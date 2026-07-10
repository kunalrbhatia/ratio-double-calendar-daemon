import logger from '../logging/logger';
import notifier from '../notify/notifier';
import flagWatcher from '../flags/flagWatcher';
import brokerClient, { PlaceOrderParams } from './brokerClient';
import positionsStore from '../positions/positionsStore';
import { StrategyLeg } from '../strategy/strategyManager';
import { OrderRecord, WeeklyPosition } from '../schemas/smartApi';
import smartStream from './smartStream';

export interface IExecutionManager {
  executeEntry(underlying: string, basket: StrategyLeg[]): Promise<boolean>;
  executeExit(underlying: string, week: string, isPaper: boolean): Promise<boolean>;
  monitorPnl(underlying: string, week: string, isPaper: boolean): Promise<void>;
}

export class ExecutionManager implements IExecutionManager {
  private pollIntervalMs = 1000;
  private maxPollAttempts = 15; // 15 seconds max

  async executeEntry(underlying: string, basket: StrategyLeg[]): Promise<boolean> {
    const isPaper = flagWatcher.isPaperMode();
    const modeStr = isPaper ? 'PAPER' : 'LIVE';
    logger.info(`Starting entry execution in ${modeStr} mode...`);

    const buyLegs = basket.filter((leg) => leg.action === 'BUY');
    const sellLegs = basket.filter((leg) => leg.action === 'SELL');

    const executedOrders: OrderRecord[] = [];

    // Step 1: Execute all Buy Legs first
    for (const leg of buyLegs) {
      const order = await this.placeAndConfirmOrder(leg, isPaper);
      if (!order) {
        logger.error(`Failed to execute buy leg ${leg.tradingsymbol}. Aborting entry sequence.`);
        await notifier.send(
          `🚨 ENTRY ABORTED [${modeStr}]: Failed to fill buy leg ${leg.tradingsymbol}.`,
        );
        // Rollback any executed buy legs
        await this.rollbackOrders(executedOrders, isPaper);
        return false;
      }
      executedOrders.push(order);
    }

    // Step 2: Execute all Sell Legs
    for (const leg of sellLegs) {
      const order = await this.placeAndConfirmOrder(leg, isPaper);
      if (!order) {
        logger.error(`Failed to execute sell leg ${leg.tradingsymbol}. Aborting entry sequence.`);
        await notifier.send(
          `🚨 ENTRY FAILURE [${modeStr}]: Failed to fill sell leg ${leg.tradingsymbol}. Manual intervention required!`,
        );
        // Note: Do NOT automatically roll back sells, but keep what is done and notify
        return false;
      }
      executedOrders.push(order);
    }

    // Calculate margin utilized
    let marginUtilized = 0;
    if (isPaper) {
      marginUtilized = 150000 * 3; // simulated margin
    } else {
      marginUtilized = await brokerClient.getMarginUtilized(basket);
    }

    // Save positions
    const week = positionsStore.getCurrentWeekString();
    const position: WeeklyPosition = {
      week,
      status: 'open',
      marginUtilized,
      orders: executedOrders,
      realizedPnl: 0,
      skippedThisWeek: false,
    };

    positionsStore.writePosition(underlying, week, isPaper, position);

    // Subscribe SmartStream to the newly opened positions
    const tokens = executedOrders.map((o) => o.symboltoken);
    smartStream.subscribe(tokens);
    logger.info(`Subscribed SmartStream to new position tokens: ${tokens.join(', ')}`);

    await notifier.send(
      `✅ ENTRY COMPLETE [${modeStr}] for ${underlying} Spread. Margin Utilized: ₹${marginUtilized.toLocaleString()}`,
    );
    return true;
  }

  private async placeAndConfirmOrder(
    leg: StrategyLeg,
    isPaper: boolean,
  ): Promise<OrderRecord | null> {
    const { instrumentManager } = await import('../instruments/instrumentManager');

    if (!isPaper) {
      // 1. Liquidity check & strike adjustment loop
      let currentStrike = leg.strike;
      let currentToken = leg.symboltoken;
      let currentSymbol = leg.tradingsymbol;

      const isSearchingLiquidity = true;
      while (isSearchingLiquidity) {
        try {
          const marketData = await brokerClient.getMarketData(leg.exchange, currentToken);
          const { ltp, bid, ask } = marketData;

          const spread = ask - bid;
          const midpoint = (bid + ask) / 2;
          const isPoorLiquidity =
            ltp > 5 && (spread / ltp > 0.1 || Math.abs(ltp - midpoint) / ltp > 0.1);

          if (!isPoorLiquidity) {
            leg.symboltoken = currentToken;
            leg.tradingsymbol = currentSymbol;
            leg.strike = currentStrike;
            break;
          }

          logger.info(
            `Poor liquidity detected for ${currentSymbol} (LTP: ${ltp}, Bid: ${bid}, Ask: ${ask}). Shifting strike...`,
          );
        } catch (marketErr) {
          logger.warn(`Failed to fetch market data for quote check, proceeding: ${marketErr}`);
          break;
        }

        const step = leg.tradingsymbol.toUpperCase().includes('SENSEX') ? 100 : 50;
        const underlying = leg.tradingsymbol.toUpperCase().includes('SENSEX') ? 'SENSEX' : 'NIFTY';
        const underlyingExchange = underlying === 'NIFTY' ? 'NSE' : 'BSE';
        const underlyingSymbol = underlying === 'NIFTY' ? 'Nifty 50' : 'SENSEX';
        const underlyingToken = underlying === 'NIFTY' ? '99926000' : '1';

        let underlyingLtp = 0;
        try {
          underlyingLtp = await brokerClient.getLtp(
            underlyingExchange,
            underlyingSymbol,
            underlyingToken,
          );
        } catch (ltpErr) {
          logger.warn(`Failed to get underlying LTP, aborting strike shift: ${ltpErr}`);
          break;
        }

        if (leg.type === 'CE') {
          currentStrike =
            currentStrike > underlyingLtp ? currentStrike - step : currentStrike + step;
        } else {
          currentStrike =
            currentStrike < underlyingLtp ? currentStrike + step : currentStrike - step;
        }

        const nextInst = instrumentManager.getInstrument(
          underlying,
          leg.expiry,
          currentStrike,
          leg.type,
        );
        if (!nextInst) {
          logger.error(
            `Could not find instrument for shifted strike ${currentStrike} on expiry ${leg.expiry}`,
          );
          break;
        }

        currentToken = nextInst.symboltoken;
        currentSymbol = nextInst.tradingsymbol;
      }

      // 2. Duplicate order prevention using resolved token
      try {
        const orderBook = await brokerClient.getOrderBook();
        const existing = orderBook.find(
          (o) =>
            o.symboltoken === leg.symboltoken &&
            (o.status.toUpperCase() === 'COMPLETE' ||
              o.status.toUpperCase() === 'PENDING' ||
              o.status.toUpperCase() === 'OPEN' ||
              o.status.toUpperCase() === 'VALIDATION_PENDING'),
        );

        if (existing) {
          logger.info(
            `Duplicate order prevention: found existing order ${existing.orderid} (${existing.status}) for token ${leg.symboltoken}. Skipping leg.`,
          );
          return {
            symboltoken: leg.symboltoken,
            tradingsymbol: leg.tradingsymbol,
            transactiontype: leg.action,
            quantity: leg.quantity,
            exchange: leg.exchange,
            orderid: existing.orderid,
            status: existing.status.toUpperCase(),
            price: existing.averageprice || existing.price || 0,
          };
        }
      } catch (obErr) {
        logger.warn(`Failed to fetch order book for duplicate check: ${obErr}`);
      }
    }

    const ltp = await brokerClient.getLtp(leg.exchange, leg.tradingsymbol, leg.symboltoken);

    if (isPaper) {
      logger.info(
        `[PAPER] Simulating order fill for ${leg.action} ${leg.quantity} ${leg.tradingsymbol} @ ₹${ltp}`,
      );
      return {
        symboltoken: leg.symboltoken,
        tradingsymbol: leg.tradingsymbol,
        transactiontype: leg.action,
        quantity: leg.quantity,
        exchange: leg.exchange,
        orderid: `PAPER-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        status: 'COMPLETE',
        price: ltp,
      };
    }

    // Live order
    const orderParams: PlaceOrderParams = {
      variety: 'NORMAL',
      tradingsymbol: leg.tradingsymbol,
      symboltoken: leg.symboltoken,
      transactiontype: leg.action,
      exchange: leg.exchange,
      ordertype: 'MARKET',
      producttype: 'CARRYFORWARD',
      duration: 'DAY',
      quantity: leg.quantity,
    };

    try {
      const orderid = await brokerClient.placeOrder(orderParams);
      logger.info(`Placed order ${orderid} for ${leg.tradingsymbol}. Polling for completeness...`);

      const isComplete = await this.pollOrderStatus(orderid);
      if (!isComplete) {
        return null;
      }

      // Fetch filled price from order book
      const orderBook = await brokerClient.getOrderBook();
      const filledOrder = orderBook.find((o) => o.orderid === orderid);
      const filledPrice = filledOrder?.averageprice || filledOrder?.price || ltp;

      return {
        symboltoken: leg.symboltoken,
        tradingsymbol: leg.tradingsymbol,
        transactiontype: leg.action,
        quantity: leg.quantity,
        exchange: leg.exchange,
        orderid,
        status: 'COMPLETE',
        price: filledPrice,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.error(`Error executing order: ${msg}`);
      return null;
    }
  }

  private async pollOrderStatus(orderid: string): Promise<boolean> {
    for (let attempt = 0; attempt < this.maxPollAttempts; attempt++) {
      await new Promise((r) => setTimeout(r, this.pollIntervalMs));
      const orderBook = await brokerClient.getOrderBook();
      const order = orderBook.find((o) => o.orderid === orderid);

      if (order) {
        const statusUpper = order.status.toUpperCase();
        if (statusUpper === 'COMPLETE') {
          return true;
        }
        if (statusUpper === 'REJECTED' || statusUpper === 'CANCELLED') {
          logger.warn(`Order ${orderid} was ${order.status}. Detail: ${order.text || 'None'}`);
          return false;
        }
      }
    }
    logger.error(`Order ${orderid} polling timed out.`);
    return false;
  }

  private async rollbackOrders(orders: OrderRecord[], isPaper: boolean) {
    logger.info(`Rolling back ${orders.length} executed buy orders...`);
    // Close buy legs (by selling them)
    for (const order of orders) {
      if (isPaper) {
        logger.info(
          `[PAPER] Simulated rollback: Selling back ${order.quantity} ${order.tradingsymbol}`,
        );
        continue;
      }

      try {
        const orderParams: PlaceOrderParams = {
          variety: 'NORMAL',
          tradingsymbol: order.tradingsymbol,
          symboltoken: order.symboltoken,
          transactiontype: 'SELL',
          exchange: order.exchange,
          ordertype: 'MARKET',
          producttype: 'CARRYFORWARD',
          duration: 'DAY',
          quantity: order.quantity,
        };
        await brokerClient.placeOrder(orderParams);
        logger.info(`Rollback order placed for ${order.tradingsymbol}`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        logger.error(`Rollback order failed for ${order.tradingsymbol}: ${msg}`);
      }
    }
  }

  async executeExit(underlying: string, week: string, isPaper: boolean): Promise<boolean> {
    const pos = positionsStore.readPosition(underlying, week, isPaper);
    if (!pos || pos.status !== 'open') {
      logger.warn(`No open positions found to exit for ${underlying} week ${week}.`);
      return false;
    }

    const modeStr = isPaper ? 'PAPER' : 'LIVE';
    logger.info(`Starting exit unwind for ${underlying} in ${modeStr} mode...`);

    // In exit unwind, we close SHORT legs first (buy to cover) before closing LONG legs
    // Short legs are SELL orders in the entry basket. We must BUY them to close.
    // Long legs are BUY orders in the entry basket. We must SELL them to close.
    const shortLegs = pos.orders.filter((o) => o.transactiontype === 'SELL');
    const longLegs = pos.orders.filter((o) => o.transactiontype === 'BUY');

    const closedOrders: OrderRecord[] = [];
    let exitSuccess = true;

    // Step 1: Buy back short legs first to avoid margin spikes
    for (const leg of shortLegs) {
      const order = await this.placeExitLeg(leg, 'BUY', isPaper);
      if (!order) {
        logger.error(`Failed to close short leg ${leg.tradingsymbol}`);
        exitSuccess = false;
      } else {
        closedOrders.push(order);
      }
    }

    // Step 2: Sell long legs
    for (const leg of longLegs) {
      const order = await this.placeExitLeg(leg, 'SELL', isPaper);
      if (!order) {
        logger.error(`Failed to close long leg ${leg.tradingsymbol}`);
        exitSuccess = false;
      } else {
        closedOrders.push(order);
      }
    }

    // Calculate PnL
    // PnL = (Sell price - Buy price) * Qty
    // For legs that were entered as BUY, PnL = (exit sell price - entry buy price) * Qty
    // For legs that were entered as SELL, PnL = (entry sell price - exit buy price) * Qty
    let totalPnl = 0;
    for (const entryLeg of pos.orders) {
      const exitLeg = closedOrders.find(
        (co) =>
          co.symboltoken === entryLeg.symboltoken &&
          co.transactiontype !== entryLeg.transactiontype,
      );
      if (exitLeg) {
        if (entryLeg.transactiontype === 'BUY') {
          totalPnl += (exitLeg.price - entryLeg.price) * entryLeg.quantity;
        } else {
          totalPnl += (entryLeg.price - exitLeg.price) * entryLeg.quantity;
        }
      }
    }

    pos.status = 'closed';
    pos.realizedPnl = totalPnl;
    positionsStore.writePosition(underlying, week, isPaper, pos);

    // Disconnect/cleanup SmartStream after exit
    smartStream.disconnect();

    await notifier.send(
      `📉 EXIT COMPLETE [${modeStr}] for ${underlying} week ${week}. Realized P&L: ₹${totalPnl.toLocaleString()}`,
    );
    return exitSuccess;
  }

  private async placeExitLeg(
    entryOrder: OrderRecord,
    exitAction: 'BUY' | 'SELL',
    isPaper: boolean,
  ): Promise<OrderRecord | null> {
    const ltp = await brokerClient.getLtp(
      entryOrder.exchange,
      entryOrder.tradingsymbol,
      entryOrder.symboltoken,
    );

    if (isPaper) {
      logger.info(
        `[PAPER] Simulating exit fill: ${exitAction} ${entryOrder.quantity} ${entryOrder.tradingsymbol} @ ₹${ltp}`,
      );
      return {
        symboltoken: entryOrder.symboltoken,
        tradingsymbol: entryOrder.tradingsymbol,
        transactiontype: exitAction,
        quantity: entryOrder.quantity,
        exchange: entryOrder.exchange,
        orderid: `PAPER-EXIT-${Date.now()}`,
        status: 'COMPLETE',
        price: ltp,
      };
    }

    const orderParams: PlaceOrderParams = {
      variety: 'NORMAL',
      tradingsymbol: entryOrder.tradingsymbol,
      symboltoken: entryOrder.symboltoken,
      transactiontype: exitAction,
      exchange: entryOrder.exchange,
      ordertype: 'MARKET',
      producttype: 'CARRYFORWARD',
      duration: 'DAY',
      quantity: entryOrder.quantity,
    };

    try {
      const orderid = await brokerClient.placeOrder(orderParams);
      const isComplete = await this.pollOrderStatus(orderid);
      if (!isComplete) return null;

      const orderBook = await brokerClient.getOrderBook();
      const filledOrder = orderBook.find((o) => o.orderid === orderid);
      const filledPrice = filledOrder?.averageprice || filledOrder?.price || ltp;

      return {
        symboltoken: entryOrder.symboltoken,
        tradingsymbol: entryOrder.tradingsymbol,
        transactiontype: exitAction,
        quantity: entryOrder.quantity,
        exchange: entryOrder.exchange,
        orderid,
        status: 'COMPLETE',
        price: filledPrice,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.error(`Error executing exit order: ${msg}`);
      return null;
    }
  }

  async monitorPnl(underlying: string, week: string, isPaper: boolean): Promise<void> {
    // If kill switch is active, do absolutely nothing (no exit)
    if (flagWatcher.isKillSwitched()) {
      logger.info('Kill switch is ACTIVE. Monitoring is paused (read-only).');
      return;
    }

    const pos = positionsStore.readPosition(underlying, week, isPaper);
    if (!pos || pos.status !== 'open') {
      return;
    }

    logger.info(`Monitoring P&L for ${underlying} week ${week}...`);

    let currentPnl = 0;
    for (const leg of pos.orders) {
      try {
        let ltp = smartStream.getCachedLtp(leg.symboltoken);
        if (ltp === null) {
          logger.info(
            `LTP for ${leg.tradingsymbol} not found in SmartStream cache. Falling back to REST API.`,
          );
          ltp = await brokerClient.getLtp(leg.exchange, leg.tradingsymbol, leg.symboltoken);
        }
        if (leg.transactiontype === 'BUY') {
          currentPnl += (ltp - leg.price) * leg.quantity;
        } else {
          currentPnl += (leg.price - ltp) * leg.quantity;
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        logger.error(`Failed to get LTP for ${leg.tradingsymbol} during P&L monitor: ${msg}`);
      }
    }

    logger.info(`Current unrealized P&L for ${underlying}: ₹${currentPnl.toLocaleString()}`);

    // If cumulative loss exceeds 1% of the margin utilized, exit immediately
    const stoplossThreshold = -0.01 * pos.marginUtilized;
    // If cumulative profit exceeds 2% of the margin utilized, exit immediately
    const profitTargetThreshold = 0.02 * pos.marginUtilized;

    logger.info(
      `[${underlying}] Stoploss threshold: ₹${stoplossThreshold.toLocaleString()} (1% of ₹${pos.marginUtilized.toLocaleString()})`,
    );
    logger.info(
      `[${underlying}] Profit target threshold: ₹${profitTargetThreshold.toLocaleString()} (2% of ₹${pos.marginUtilized.toLocaleString()})`,
    );

    if (currentPnl <= stoplossThreshold) {
      logger.warn(
        `Stoploss breached for ${underlying}! Current P&L (₹${currentPnl.toLocaleString()}) <= threshold (₹${stoplossThreshold.toLocaleString()})`,
      );
      await notifier.send(
        `🚨 STOPLOSS BREACHED [${isPaper ? 'PAPER' : 'LIVE'}] for ${underlying}: P&L is ₹${currentPnl.toLocaleString()}. Unwinding positions...`,
      );

      const success = await this.executeExit(underlying, week, isPaper);
      if (success) {
        // Set skip state for rest of week
        positionsStore.setWeeklySkipState(underlying, week, isPaper, true);
        logger.info(`Set skip state for ${underlying} week ${week}.`);
      }
    } else if (currentPnl >= profitTargetThreshold) {
      logger.info(
        `Profit target reached for ${underlying}! Current P&L (₹${currentPnl.toLocaleString()}) >= threshold (₹${profitTargetThreshold.toLocaleString()})`,
      );
      await notifier.send(
        `🎉 PROFIT TARGET REACHED [${isPaper ? 'PAPER' : 'LIVE'}] for ${underlying}: P&L is ₹${currentPnl.toLocaleString()}. Unwinding positions to lock in gains...`,
      );

      const success = await this.executeExit(underlying, week, isPaper);
      if (success) {
        // Set skip state for rest of week
        positionsStore.setWeeklySkipState(underlying, week, isPaper, true);
        logger.info(`Set skip state for ${underlying} week ${week} after profit target exit.`);
      }
    }
  }
}

export const executionManager = new ExecutionManager();
export default executionManager;
