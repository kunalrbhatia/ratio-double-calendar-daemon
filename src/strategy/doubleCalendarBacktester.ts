import path from 'path';
import dayjs from 'dayjs';
import logger from '../logging/logger';
import { calculateDelta } from './blackScholes';
import {
  getAvailableSnapshots,
  loadSnapshot,
  OptionChainSnapshot,
  BacktestTrade,
  BacktestPositionLeg,
} from './backtestDataLoader';

export interface BacktestOptions {
  dataDir: string;
  lots?: number;
  stopLossPct?: number; // e.g., 0.011 for 1.1%
  targetProfitPct?: number; // e.g., 0.015 for 1.5%
  estimatedMarginPerSpread?: number; // e.g. 150,000 per lot double calendar spread
}

export interface BacktestSummary {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnl: number;
  maxDrawdown: number;
  trades: BacktestTrade[];
}

export class DoubleCalendarBacktester {
  private dataDir: string;
  private lots: number;
  private stopLossPct: number;
  private targetProfitPct: number;
  private estimatedMarginPerSpread: number;

  constructor(options: BacktestOptions) {
    this.dataDir = options.dataDir;
    this.lots = options.lots ?? 1;
    this.stopLossPct = options.stopLossPct ?? 0.011;
    this.targetProfitPct = options.targetProfitPct ?? 0.015;
    this.estimatedMarginPerSpread = options.estimatedMarginPerSpread ?? 150000;
  }

  public run(): BacktestSummary {
    logger.info(`Starting Double Calendar Backtest using data in: ${this.dataDir}`);

    const snapshots = getAvailableSnapshots(this.dataDir);
    logger.info(`Found ${snapshots.length} total snapshot files.`);

    if (snapshots.length === 0) {
      logger.warn(`No option chain snapshots found in ${this.dataDir}/chains/`);
      return {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        totalPnl: 0,
        maxDrawdown: 0,
        trades: [],
      };
    }

    const trades: BacktestTrade[] = [];
    let currentTrade: BacktestTrade | null = null;

    // Group snapshots by date/time
    for (const snapRef of snapshots) {
      const snapshot = loadSnapshot(this.dataDir, snapRef.folderDate, snapRef.filename);
      if (!snapshot) continue;

      const snapTime = dayjs(snapshot.snapshot_time);
      const dayOfWeek = snapTime.day(); // 3 = Wednesday, 2 = Tuesday
      const timeStr = snapTime.format('HH:mm');

      // 1. Entry check: Wednesday after 09:30 AM IST (if no open trade)
      if (!currentTrade && dayOfWeek === 3 && timeStr >= '09:30') {
        const basket = this.tryConstructBasket(snapshot);
        if (basket) {
          const margin = this.estimatedMarginPerSpread * this.lots;
          currentTrade = {
            tradeId: `TRADE_${snapTime.format('YYYYMMDD_HHmm')}`,
            underlying: snapshot.symbol_name,
            entryTime: snapshot.snapshot_time,
            status: 'OPEN',
            initialMargin: margin,
            legs: basket,
            realizedPnl: 0,
            maxProfit: 0,
            maxDrawdown: 0,
          };
          logger.info(`[ENTRY] New position opened on ${snapshot.snapshot_time}`);
        }
      }

      // 2. Monitor open trade
      if (currentTrade && currentTrade.status === 'OPEN') {
        const currentPnl = this.calculatePnl(currentTrade.legs, snapshot);
        const stopLossVal = -1 * currentTrade.initialMargin * this.stopLossPct;
        const targetProfitVal = currentTrade.initialMargin * this.targetProfitPct;

        if (currentPnl > currentTrade.maxProfit) {
          currentTrade.maxProfit = currentPnl;
        }
        if (currentPnl < currentTrade.maxDrawdown) {
          currentTrade.maxDrawdown = currentPnl;
        }

        // Exit conditions
        let shouldExit = false;
        let exitReason = '';

        if (currentPnl <= stopLossVal) {
          shouldExit = true;
          exitReason = `Stop Loss Breached (PnL: ₹${currentPnl.toFixed(2)} <= Limit: ₹${stopLossVal.toFixed(2)})`;
        } else if (currentPnl >= targetProfitVal) {
          shouldExit = true;
          exitReason = `Target Profit Reached (PnL: ₹${currentPnl.toFixed(2)} >= Target: ₹${targetProfitVal.toFixed(2)})`;
        } else if (dayOfWeek === 2 && timeStr >= '15:15') {
          shouldExit = true;
          exitReason = `Scheduled Exit Window Reached (Tuesday 15:15 PM IST)`;
        }

        if (shouldExit) {
          currentTrade.status = 'CLOSED';
          currentTrade.exitTime = snapshot.snapshot_time;
          currentTrade.exitReason = exitReason;
          currentTrade.realizedPnl = currentPnl;
          trades.push({ ...currentTrade });
          logger.info(
            `[EXIT] Position closed on ${snapshot.snapshot_time}. PnL: ₹${currentPnl.toFixed(2)} | Reason: ${exitReason}`,
          );
          currentTrade = null;
        }
      }
    }

    // If trade remains open at end of data, close it at last known snapshot price
    if (currentTrade && currentTrade.status === 'OPEN') {
      const lastSnapRef = snapshots[snapshots.length - 1];
      const lastSnap = loadSnapshot(this.dataDir, lastSnapRef.folderDate, lastSnapRef.filename);
      if (lastSnap) {
        const currentPnl = this.calculatePnl(currentTrade.legs, lastSnap);
        currentTrade.status = 'CLOSED';
        currentTrade.exitTime = lastSnap.snapshot_time;
        currentTrade.exitReason = 'End of backtest dataset';
        currentTrade.realizedPnl = currentPnl;
        trades.push({ ...currentTrade });
      }
    }

    const totalTrades = trades.length;
    const winningTrades = trades.filter((t) => t.realizedPnl > 0).length;
    const losingTrades = trades.filter((t) => t.realizedPnl <= 0).length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const totalPnl = trades.reduce((sum, t) => sum + t.realizedPnl, 0);
    const maxDrawdown = trades.reduce((min, t) => Math.min(min, t.maxDrawdown), 0);

    return {
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      totalPnl,
      maxDrawdown,
      trades,
    };
  }

  private tryConstructBasket(snapshot: OptionChainSnapshot): BacktestPositionLeg[] | null {
    const underlyingPrice = snapshot.index_close;
    if (!underlyingPrice || !snapshot.rows || snapshot.rows.length === 0) return null;

    // Use Black-Scholes or delta column if available
    const targetDelta = 0.15;
    const lotSize = 25; // NIFTY lot size

    let bestShortCeRow = snapshot.rows[0];
    let minCeDiff = Infinity;

    let bestShortPeRow = snapshot.rows[0];
    let minPeDiff = Infinity;

    for (const row of snapshot.rows) {
      if (row.calls_delta !== undefined && row.calls_delta !== null) {
        const ceDiff = Math.abs(row.calls_delta - targetDelta);
        if (ceDiff < minCeDiff && row.calls_ltp && row.calls_ltp > 0) {
          minCeDiff = ceDiff;
          bestShortCeRow = row;
        }
      }

      if (row.puts_delta !== undefined && row.puts_delta !== null) {
        const peDiff = Math.abs(Math.abs(row.puts_delta) - targetDelta);
        if (peDiff < minPeDiff && row.puts_ltp && row.puts_ltp > 0) {
          minPeDiff = peDiff;
          bestShortPeRow = row;
        }
      }
    }

    if (!bestShortCeRow.calls_ltp || !bestShortPeRow.puts_ltp) return null;

    // Find T1 match for Calendar spread (for backtest approximation, match premium on same/next expiry row)
    const shortCeLtp = bestShortCeRow.calls_ltp;
    const shortPeLtp = bestShortPeRow.puts_ltp;

    let bestHedgeCeRow = snapshot.rows[0];
    let minCeLtpDiff = Infinity;

    let bestHedgePeRow = snapshot.rows[0];
    let minPeLtpDiff = Infinity;

    for (const row of snapshot.rows) {
      if (row.calls_ltp && row.calls_ltp > 0) {
        const diff = Math.abs(row.calls_ltp - shortCeLtp);
        if (diff < minCeLtpDiff) {
          minCeLtpDiff = diff;
          bestHedgeCeRow = row;
        }
      }
      if (row.puts_ltp && row.puts_ltp > 0) {
        const diff = Math.abs(row.puts_ltp - shortPeLtp);
        if (diff < minPeLtpDiff) {
          minPeLtpDiff = diff;
          bestHedgePeRow = row;
        }
      }
    }

    const qty = lotSize * this.lots;

    return [
      {
        action: 'SELL',
        strike: bestShortCeRow.strike_price,
        type: 'CE',
        expiry: snapshot.expiry_date,
        quantity: qty,
        entryPrice: shortCeLtp,
        currentPrice: shortCeLtp,
      },
      {
        action: 'SELL',
        strike: bestShortPeRow.strike_price,
        type: 'PE',
        expiry: snapshot.expiry_date,
        quantity: qty,
        entryPrice: shortPeLtp,
        currentPrice: shortPeLtp,
      },
      {
        action: 'BUY',
        strike: bestHedgeCeRow.strike_price,
        type: 'CE',
        expiry: snapshot.expiry_date, // Next weekly expiry leg
        quantity: qty,
        entryPrice: bestHedgeCeRow.calls_ltp ?? shortCeLtp,
        currentPrice: bestHedgeCeRow.calls_ltp ?? shortCeLtp,
      },
      {
        action: 'BUY',
        strike: bestHedgePeRow.strike_price,
        type: 'PE',
        expiry: snapshot.expiry_date, // Next weekly expiry leg
        quantity: qty,
        entryPrice: bestHedgePeRow.puts_ltp ?? shortPeLtp,
        currentPrice: bestHedgePeRow.puts_ltp ?? shortPeLtp,
      },
    ];
  }

  private calculatePnl(legs: BacktestPositionLeg[], snapshot: OptionChainSnapshot): number {
    let totalPnl = 0;

    for (const leg of legs) {
      const row = snapshot.rows.find((r) => r.strike_price === leg.strike);
      let currentLtp = leg.entryPrice;

      if (row) {
        if (leg.type === 'CE' && row.calls_ltp !== undefined && row.calls_ltp !== null) {
          currentLtp = row.calls_ltp;
        } else if (leg.type === 'PE' && row.puts_ltp !== undefined && row.puts_ltp !== null) {
          currentLtp = row.puts_ltp;
        }
      }

      // Worthless options exit rule check (LTP <= 0.10)
      if (currentLtp <= 0.1) {
        currentLtp = 0.05;
      }

      if (leg.action === 'SELL') {
        totalPnl += (leg.entryPrice - currentLtp) * leg.quantity;
      } else {
        totalPnl += (currentLtp - leg.entryPrice) * leg.quantity;
      }
    }

    return totalPnl;
  }
}
