import dayjs from 'dayjs';
import logger from '../logging/logger';
import instrumentManager from '../instruments/instrumentManager';
import brokerClient from '../execution/brokerClient';
import { calculateDelta } from './blackScholes';
import { InstrumentCacheEntry } from '../schemas/smartApi';
import notifier from '../notify/notifier';

export interface StrategyLeg {
  action: 'BUY' | 'SELL';
  quantity: number;
  expiry: string;
  strike: number;
  type: 'CE' | 'PE';
  symboltoken: string;
  tradingsymbol: string;
  exchange: string;
  lotsize: number;
  targetDelta: number;
  actualDelta: number;
  ltp?: number;
}

export interface LiquidCandidate {
  strike: number;
  inst: InstrumentCacheEntry;
  ltp: number;
  bid: number;
  ask: number;
  bidQty: number;
  askQty: number;
  delta?: number;
}

export interface IStrategyManager {
  checkVix(): Promise<{ passed: boolean; vix: number }>;
  buildBasket(underlying: string, skipLiquidityCheck?: boolean): Promise<StrategyLeg[] | null>;
}

export class StrategyManager implements IStrategyManager {
  async checkVix(): Promise<{ passed: boolean; vix: number }> {
    logger.info('Performing VIX entry filter check...');
    try {
      const vixToken = instrumentManager.getVixToken();
      // Angel One India VIX is on NSE
      const vix = await brokerClient.getLtp('NSE', 'INDIA VIX', vixToken);
      logger.info(`Current India VIX: ${vix}`);
      const passed = vix >= 10 && vix <= 13.5;
      return { passed, vix };
    } catch (error: unknown) {
      /* istanbul ignore next */
      const msg = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to check VIX: ${msg}. Proceeding assuming VIX check fails.`);
      return { passed: false, vix: 0 };
    }
  }

  private async getLiquidCandidates(
    underlying: string,
    expiry: string,
    type: 'CE' | 'PE',
    strikes: number[],
  ): Promise<LiquidCandidate[]> {
    const instrumentsWithStrikes: { strike: number; inst: InstrumentCacheEntry }[] = [];
    for (const strike of strikes) {
      const inst = instrumentManager.getInstrument(underlying, expiry, strike, type);
      if (inst) {
        instrumentsWithStrikes.push({ strike, inst });
      }
    }

    if (instrumentsWithStrikes.length === 0) {
      return [];
    }

    const exchange = instrumentsWithStrikes[0].inst.exchange;
    const tokens = instrumentsWithStrikes.map((x) => x.inst.symboltoken);

    const marketDataMap = await brokerClient.getMarketDataBatch(exchange, tokens);

    const candidates: LiquidCandidate[] = [];
    for (const { strike, inst } of instrumentsWithStrikes) {
      const quote = marketDataMap.get(inst.symboltoken);
      if (quote) {
        candidates.push({
          strike,
          inst,
          ltp: quote.ltp,
          bid: quote.bid,
          ask: quote.ask,
          bidQty: quote.bidQty,
          askQty: quote.askQty,
        });
      }
    }
    return candidates;
  }

  private isLiquid(
    candidate: LiquidCandidate,
    minLotsDepth = 2,
    maxSpreadPct = 0.08,
    maxMidpointDiffPct = 0.08,
  ): boolean {
    const { ltp, bid, ask, bidQty, askQty, inst } = candidate;
    if (ltp <= 0) return false;
    if ((ask - bid) / ltp > maxSpreadPct) return false;
    if (Math.abs(ltp - (ask + bid) / 2) / ltp > maxMidpointDiffPct) return false;
    if (bidQty < minLotsDepth * inst.lotsize) return false;
    if (askQty < minLotsDepth * inst.lotsize) return false;
    return true;
  }

  async buildBasket(underlying: string, skipLiquidityCheck = false): Promise<StrategyLeg[] | null> {
    logger.info(`Building strategy basket for ${underlying}...`);

    // 1. Resolve Expiry_T0, Expiry_T1 and Expiry_T2
    const expiries = instrumentManager.getExpiries(underlying);
    const now = dayjs();

    // Filter expiries to only future or today's expiries
    const futureExpiries = expiries.filter((exp) => {
      const expDate = dayjs(exp, 'DDMMMYYYY').endOf('day');
      /* istanbul ignore next */
      return expDate.isAfter(now) || expDate.isSame(now, 'day');
    });

    if (futureExpiries.length < 3) {
      logger.error(`Not enough future expiries found for ${underlying}. Found: ${futureExpiries}`);
      return null;
    }

    const expiryT0 = futureExpiries[0];
    const expiryT1 = futureExpiries[1];
    const expiryT2 = futureExpiries[2];
    logger.info(`Resolved Expiry_T0: ${expiryT0}, Expiry_T1: ${expiryT1}, Expiry_T2: ${expiryT2}`);

    // 2. Fetch underlying price (LTP)
    // NIFTY index token: "99926000" on NSE. SENSEX index token: "1" on BSE.
    const underlyingToken = underlying.toUpperCase() === 'NIFTY' ? '99926000' : '1';
    const underlyingExchange = underlying.toUpperCase() === 'NIFTY' ? 'NSE' : 'BSE';
    const underlyingLtp = await brokerClient.getLtp(
      underlyingExchange,
      underlying.toUpperCase() === 'NIFTY' ? 'Nifty 50' : 'SENSEX',
      underlyingToken,
    );
    logger.info(`Underlying ${underlying} LTP: ${underlyingLtp}`);

    // 3. Fetch VIX as proxy for IV
    const vixToken = instrumentManager.getVixToken();
    const vix = await brokerClient.getLtp('NSE', 'INDIA VIX', vixToken);
    const vixIv = vix / 100; // e.g. 12% IV = 0.12

    // Fetch live IV for expiryT0 if possible (using ATM strike closest to underlying LTP to filter out noise)
    let liveIv = vixIv;
    try {
      const greeks = await brokerClient.getOptionGreeks(underlying, expiryT0);
      const atmStrike = Math.round(underlyingLtp / 100) * 100;
      const atmGreek = greeks.find(
        (item) => Math.round(item.strikePrice) === atmStrike && item.optionType === 'CE',
      );
      if (atmGreek) {
        liveIv = atmGreek.impliedVolatility / 100;
        logger.info(
          `Loaded live option ATM Greek IV for ${underlying} expiry ${expiryT0}: ${(liveIv * 100).toFixed(2)}% (ATM Strike: ${atmStrike})`,
        );
      } else {
        logger.info(
          `No ATM strike greek found for ${underlying} expiry ${expiryT0}. Falling back to VIX.`,
        );
      }
    } catch (err: unknown) {
      /* istanbul ignore next */
      logger.warn(
        `Failed to fetch option greeks for ${underlying} on ${expiryT0}. Falling back to VIX.`,
      );
    }

    // 4. Find option strikes with closest deltas
    const candidateStrikes: number[] = [];
    const minStrike = Math.round((underlyingLtp * 0.8) / 100) * 100;
    const maxStrike = Math.round((underlyingLtp * 1.2) / 100) * 100;

    for (let strike = minStrike; strike <= maxStrike; strike += 100) {
      candidateStrikes.push(strike);
    }

    // Days to T0 and T1 expiry
    const t0ExpDate = dayjs(expiryT0, 'DDMMMYYYY').hour(15).minute(30);
    const t0DaysToExpiry = Math.max(0.01, t0ExpDate.diff(now, 'day', true));
    const t0 = t0DaysToExpiry / 365;

    const t1ExpDate = dayjs(expiryT1, 'DDMMMYYYY').hour(15).minute(30);
    const t1DaysToExpiry = Math.max(0.01, t1ExpDate.diff(now, 'day', true));
    const t1 = t1DaysToExpiry / 365;

    // A. Resolve Short CE Leg (T0)
    const t0CeCandidates = await this.getLiquidCandidates(
      underlying,
      expiryT0,
      'CE',
      candidateStrikes,
    );
    for (const c of t0CeCandidates) {
      c.delta = Math.abs(calculateDelta(underlyingLtp, c.strike, t0, liveIv, 0.07, 'CE'));
    }
    const t0CeFiltered = t0CeCandidates.filter(
      (c) => c.delta! >= 0.1 && c.delta! <= 0.15 && (skipLiquidityCheck || this.isLiquid(c)),
    );
    if (t0CeFiltered.length === 0) {
      logger.error(`No qualifying T0 CE strikes in delta range 0.10-0.15 for ${underlying}.`);
      await notifier.send(
        `🚨 Basket generation failed: No qualifying T0 CE strikes in delta range 0.10-0.15 for ${underlying}.`,
      );
      return null;
    }
    const shortCe = t0CeFiltered.reduce((best, cur) => {
      const curDiff = Math.abs(cur.delta! - 0.15);
      const bestDiff = Math.abs(best.delta! - 0.15);
      if (curDiff < bestDiff) {
        return cur;
      }
      return best;
    }, t0CeFiltered[0]);

    // B. Resolve Short PE Leg (T0)
    const t0PeCandidates = await this.getLiquidCandidates(
      underlying,
      expiryT0,
      'PE',
      candidateStrikes,
    );
    for (const c of t0PeCandidates) {
      c.delta = Math.abs(calculateDelta(underlyingLtp, c.strike, t0, liveIv, 0.07, 'PE'));
    }
    const t0PeFiltered = t0PeCandidates.filter(
      (c) => c.delta! >= 0.1 && c.delta! <= 0.15 && (skipLiquidityCheck || this.isLiquid(c)),
    );
    if (t0PeFiltered.length === 0) {
      logger.error(`No qualifying T0 PE strikes in delta range 0.10-0.15 for ${underlying}.`);
      await notifier.send(
        `🚨 Basket generation failed: No qualifying T0 PE strikes in delta range 0.10-0.15 for ${underlying}.`,
      );
      return null;
    }
    const shortPe = t0PeFiltered.reduce((best, cur) => {
      const curDiff = Math.abs(cur.delta! - 0.15);
      const bestDiff = Math.abs(best.delta! - 0.15);
      if (curDiff < bestDiff) {
        return cur;
      }
      return best;
    }, t0PeFiltered[0]);

    // C. Resolve T1 CE Hedge Leg
    const t1CeCandidates = await this.getLiquidCandidates(
      underlying,
      expiryT1,
      'CE',
      candidateStrikes,
    );
    const validT1Ce = t1CeCandidates.filter(
      (c) => c.ltp > 0 && (skipLiquidityCheck || this.isLiquid(c)),
    );
    validT1Ce.sort((a, b) => b.strike - a.strike); // Ascending premium (CE lower strike has higher premium)

    const t1CeInBand = validT1Ce.filter(
      (c) => c.ltp >= shortCe.ltp * 0.95 && c.ltp <= shortCe.ltp * 1.05,
    );
    let hedgeCe: LiquidCandidate | undefined;
    if (t1CeInBand.length > 0) {
      hedgeCe = t1CeInBand.reduce((best, cur) => {
        const curDiff = Math.abs(cur.ltp - shortCe.ltp);
        const bestDiff = Math.abs(best.ltp - shortCe.ltp);
        if (curDiff < bestDiff) {
          return cur;
        }
        return best;
      }, t1CeInBand[0]);
    } else {
      // Fallback: Widen search upward only (higher premium)
      const startIndex = validT1Ce.findIndex((c) => c.ltp > shortCe.ltp * 1.05);
      if (startIndex !== -1) {
        const searchLimit = Math.min(validT1Ce.length, startIndex + 10);
        for (let i = startIndex; i < searchLimit; i++) {
          const candidate = validT1Ce[i];
          if (candidate.ltp <= shortCe.ltp * 1.1) {
            hedgeCe = candidate;
            break;
          }
        }
      }
    }
    if (!hedgeCe) {
      logger.error(
        `No valid T1 CE hedge strike found for ${underlying} matching T0 LTP ₹${shortCe.ltp.toFixed(2)}.`,
      );
      await notifier.send(
        `🚨 Basket generation failed: No valid T1 CE hedge strike found for ${underlying}.`,
      );
      return null;
    }

    // D. Resolve T1 PE Hedge Leg
    const t1PeCandidates = await this.getLiquidCandidates(
      underlying,
      expiryT1,
      'PE',
      candidateStrikes,
    );
    const validT1Pe = t1PeCandidates.filter(
      (c) => c.ltp > 0 && (skipLiquidityCheck || this.isLiquid(c)),
    );
    validT1Pe.sort((a, b) => a.strike - b.strike); // Ascending premium (PE higher strike has higher premium)

    const t1PeInBand = validT1Pe.filter(
      (c) => c.ltp >= shortPe.ltp * 0.95 && c.ltp <= shortPe.ltp * 1.05,
    );
    let hedgePe: LiquidCandidate | undefined;
    if (t1PeInBand.length > 0) {
      hedgePe = t1PeInBand.reduce((best, cur) => {
        const curDiff = Math.abs(cur.ltp - shortPe.ltp);
        const bestDiff = Math.abs(best.ltp - shortPe.ltp);
        if (curDiff < bestDiff) {
          return cur;
        }
        return best;
      }, t1PeInBand[0]);
    } else {
      // Fallback: Widen search upward only (higher premium)
      const startIndex = validT1Pe.findIndex((c) => c.ltp > shortPe.ltp * 1.05);
      if (startIndex !== -1) {
        const searchLimit = Math.min(validT1Pe.length, startIndex + 10);
        for (let i = startIndex; i < searchLimit; i++) {
          const candidate = validT1Pe[i];
          if (candidate.ltp <= shortPe.ltp * 1.1) {
            hedgePe = candidate;
            break;
          }
        }
      }
    }
    if (!hedgePe) {
      logger.error(
        `No valid T1 PE hedge strike found for ${underlying} matching T0 LTP ₹${shortPe.ltp.toFixed(2)}.`,
      );
      await notifier.send(
        `🚨 Basket generation failed: No valid T1 PE hedge strike found for ${underlying}.`,
      );
      return null;
    }

    // Calculate delta for hedges to store in basket metadata
    hedgeCe.delta = Math.abs(calculateDelta(underlyingLtp, hedgeCe.strike, t1, liveIv, 0.07, 'CE'));

    hedgePe.delta = Math.abs(calculateDelta(underlyingLtp, hedgePe.strike, t1, liveIv, 0.07, 'PE'));

    const basket: StrategyLeg[] = [
      {
        action: 'SELL',
        quantity: shortCe.inst.lotsize * 3,
        expiry: expiryT0,
        strike: shortCe.strike,
        type: 'CE',
        symboltoken: shortCe.inst.symboltoken,
        tradingsymbol: shortCe.inst.tradingsymbol,
        exchange: shortCe.inst.exchange,
        lotsize: shortCe.inst.lotsize,
        targetDelta: 0.15,
        actualDelta: shortCe.delta!,
        ltp: shortCe.ltp,
      },
      {
        action: 'SELL',
        quantity: shortPe.inst.lotsize * 3,
        expiry: expiryT0,
        strike: shortPe.strike,
        type: 'PE',
        symboltoken: shortPe.inst.symboltoken,
        tradingsymbol: shortPe.inst.tradingsymbol,
        exchange: shortPe.inst.exchange,
        lotsize: shortPe.inst.lotsize,
        targetDelta: 0.15,
        actualDelta: shortPe.delta!,
        ltp: shortPe.ltp,
      },
      {
        action: 'BUY',
        quantity: hedgeCe.inst.lotsize * 3,
        expiry: expiryT1,
        strike: hedgeCe.strike,
        type: 'CE',
        symboltoken: hedgeCe.inst.symboltoken,
        tradingsymbol: hedgeCe.inst.tradingsymbol,
        exchange: hedgeCe.inst.exchange,
        lotsize: hedgeCe.inst.lotsize,
        targetDelta: hedgeCe.delta!,
        actualDelta: hedgeCe.delta!,
        ltp: hedgeCe.ltp,
      },
      {
        action: 'BUY',
        quantity: hedgePe.inst.lotsize * 3,
        expiry: expiryT1,
        strike: hedgePe.strike,
        type: 'PE',
        symboltoken: hedgePe.inst.symboltoken,
        tradingsymbol: hedgePe.inst.tradingsymbol,
        exchange: hedgePe.inst.exchange,
        lotsize: hedgePe.inst.lotsize,
        targetDelta: hedgePe.delta!,
        actualDelta: hedgePe.delta!,
        ltp: hedgePe.ltp,
      },
    ];

    logger.info('Successfully constructed strategy basket:');
    basket.forEach((leg) => {
      logger.info(
        `- ${leg.action} ${leg.quantity} (${leg.quantity / leg.lotsize} lots) ${leg.tradingsymbol} (Strike: ${leg.strike}, Delta: ${leg.actualDelta.toFixed(3)}, LTP: ${leg.ltp})`,
      );
    });

    return basket;
  }
}

export const strategyManager = new StrategyManager();
export default strategyManager;
