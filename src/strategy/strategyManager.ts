import dayjs from 'dayjs';
import logger from '../logging/logger';
import instrumentManager from '../instruments/instrumentManager';
import brokerClient from '../execution/brokerClient';
import { calculateDelta } from './blackScholes';
import { InstrumentCacheEntry } from '../schemas/smartApi';

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
}

export interface IStrategyManager {
  checkVix(): Promise<{ passed: boolean; vix: number }>;
  buildBasket(underlying: string): Promise<StrategyLeg[] | null>;
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

  async buildBasket(underlying: string): Promise<StrategyLeg[] | null> {
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
    // NIFTY index token: "99926000" on NSE. SENSEX index token: "99926037" on BSE.
    const underlyingToken = underlying.toUpperCase() === 'NIFTY' ? '99926000' : '99926037';
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

    // Define target legs
    const legDefinitions = [
      {
        action: 'SELL' as const,
        qtyMult: 3,
        expiry: expiryT0,
        type: 'CE' as const,
        targetDelta: 0.2,
      },
      {
        action: 'SELL' as const,
        qtyMult: 3,
        expiry: expiryT0,
        type: 'PE' as const,
        targetDelta: 0.2,
      },
      {
        action: 'BUY' as const,
        qtyMult: 1,
        expiry: expiryT2,
        type: 'CE' as const,
        targetDelta: 0.3,
      },
      {
        action: 'BUY' as const,
        qtyMult: 1,
        expiry: expiryT2,
        type: 'PE' as const,
        targetDelta: 0.3,
      },
      {
        action: 'BUY' as const,
        qtyMult: 2,
        expiry: expiryT2,
        type: 'CE' as const,
        targetDelta: 0.2,
      },
      {
        action: 'BUY' as const,
        qtyMult: 2,
        expiry: expiryT2,
        type: 'PE' as const,
        targetDelta: 0.2,
      },
    ];

    const basket: StrategyLeg[] = [];

    for (const def of legDefinitions) {
      const expDate = dayjs(def.expiry, 'DDMMMYYYY').hour(15).minute(30);
      const daysToExpiry = Math.max(0.01, expDate.diff(now, 'day', true));
      const t = daysToExpiry / 365;

      let bestStrike = 0;
      let minDiff = Infinity;
      let bestInstrument: InstrumentCacheEntry | null = null;
      let bestDelta = 0;

      for (const strike of candidateStrikes) {
        const inst = instrumentManager.getInstrument(underlying, def.expiry, strike, def.type);
        if (!inst) continue;

        const delta = calculateDelta(underlyingLtp, strike, t, iv, 0.07, def.type);
        const absDelta = Math.abs(delta);
        const diff = Math.abs(absDelta - def.targetDelta);

        if (diff < minDiff) {
          minDiff = diff;
          bestStrike = strike;
          bestInstrument = inst;
          bestDelta = absDelta;
        }
      }

      if (!bestInstrument) {
        logger.error(
          `Could not resolve strike for ${def.type} with target delta ${def.targetDelta} on expiry ${def.expiry}`,
        );
        return null;
      }

      basket.push({
        action: def.action,
        quantity: bestInstrument.lotsize * def.qtyMult,
        expiry: def.expiry,
        strike: bestStrike,
        type: def.type,
        symboltoken: bestInstrument.symboltoken,
        tradingsymbol: bestInstrument.tradingsymbol,
        exchange: bestInstrument.exchange,
        lotsize: bestInstrument.lotsize,
        targetDelta: def.targetDelta,
        actualDelta: bestDelta,
      });
    }

    logger.info('Successfully constructed strategy basket:');
    basket.forEach((leg) => {
      logger.info(
        `- ${leg.action} ${leg.quantity} (${leg.quantity / leg.lotsize} lots) ${leg.tradingsymbol} (Strike: ${leg.strike}, Delta: ${leg.actualDelta.toFixed(3)})`,
      );
    });

    return basket;
  }
}

export const strategyManager = new StrategyManager();
export default strategyManager;
