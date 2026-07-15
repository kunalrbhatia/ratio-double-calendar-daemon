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
    const iv = vix / 100; // e.g. 12% IV = 0.12

    // 4. Find option strikes with closest deltas
    // We search across strikes in the instrument manager.
    // For standard NSE NIFTY/SENSEX, strikes are multiples of 50 or 100 around the underlying LTP.
    // Let's generate a list of candidates or iterate through known strikes.
    // A robust way is to scan the cache of instruments.
    const candidateStrikes: number[] = [];
    const minStrike = Math.round((underlyingLtp * 0.8) / 100) * 100;
    const maxStrike = Math.round((underlyingLtp * 1.2) / 100) * 100;

    for (let strike = minStrike; strike <= maxStrike; strike += 100) {
      candidateStrikes.push(strike);
    }

    const hedgeExpiry = skipLiquidityCheck ? expiryT1 : expiryT2;

    // Define target legs
    const legDefinitions = [
      {
        action: 'SELL' as const,
        qtyMult: 3,
        expiry: expiryT0,
        type: 'CE' as const,
        targetDelta: 0.15,
      },
      {
        action: 'SELL' as const,
        qtyMult: 3,
        expiry: expiryT0,
        type: 'PE' as const,
        targetDelta: 0.15,
      },
      {
        action: 'BUY' as const,
        qtyMult: 1,
        expiry: hedgeExpiry,
        type: 'CE' as const,
        targetDelta: 0.3,
      },
      {
        action: 'BUY' as const,
        qtyMult: 1,
        expiry: hedgeExpiry,
        type: 'PE' as const,
        targetDelta: 0.3,
      },
      {
        action: 'BUY' as const,
        qtyMult: 2,
        expiry: hedgeExpiry,
        type: 'CE' as const,
        targetDelta: 0.2,
      },
      {
        action: 'BUY' as const,
        qtyMult: 2,
        expiry: hedgeExpiry,
        type: 'PE' as const,
        targetDelta: 0.2,
      },
    ];

    const basket: StrategyLeg[] = [];

    for (const def of legDefinitions) {
      const expDate = dayjs(def.expiry, 'DDMMMYYYY').hour(15).minute(30);
      const daysToExpiry = Math.max(0.01, expDate.diff(now, 'day', true));
      const t = daysToExpiry / 365;

      const candidates = await this.getLiquidCandidates(
        underlying,
        def.expiry,
        def.type,
        candidateStrikes,
      );

      for (const candidate of candidates) {
        const delta = calculateDelta(underlyingLtp, candidate.strike, t, iv, 0.07, def.type);
        candidate.delta = Math.abs(delta);
      }

      const liquidOnes = skipLiquidityCheck
        ? candidates
        : candidates.filter((c) => this.isLiquid(c));

      let chosen: LiquidCandidate | undefined;
      if (liquidOnes.length > 0) {
        chosen = liquidOnes.reduce((best, cur) => {
          const curDiff = Math.abs(cur.delta! - def.targetDelta);
          const bestDiff = Math.abs(best.delta! - def.targetDelta);
          return curDiff < bestDiff ? cur : best;
        }, liquidOnes[0]);
      } else {
        logger.warn(
          `No liquid strikes found for ${underlying} ${def.type} ${def.expiry} near target delta ${def.targetDelta}. Falling back to theoretical best.`,
        );
        await notifier.send(
          `⚠️ No liquid strikes found for ${underlying} ${def.type} ${def.expiry} near target delta ${def.targetDelta}. Falling back to theoretical best — review before going live.`,
        );

        if (candidates.length > 0) {
          chosen = candidates.reduce((best, cur) => {
            const curDiff = Math.abs(cur.delta! - def.targetDelta);
            const bestDiff = Math.abs(best.delta! - def.targetDelta);
            return curDiff < bestDiff ? cur : best;
          }, candidates[0]);
        }
      }

      if (!chosen || !chosen.inst) {
        logger.error(
          `Could not resolve strike for ${def.type} with target delta ${def.targetDelta} on expiry ${def.expiry}`,
        );
        return null;
      }

      basket.push({
        action: def.action,
        quantity: chosen.inst.lotsize * def.qtyMult,
        expiry: def.expiry,
        strike: chosen.strike,
        type: def.type,
        symboltoken: chosen.inst.symboltoken,
        tradingsymbol: chosen.inst.tradingsymbol,
        exchange: chosen.inst.exchange,
        lotsize: chosen.inst.lotsize,
        targetDelta: def.targetDelta,
        actualDelta: chosen.delta!,
        ltp: chosen.ltp,
      });
    }

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
