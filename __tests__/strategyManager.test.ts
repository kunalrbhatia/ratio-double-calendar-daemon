import dayjs from 'dayjs';
import { StrategyManager } from '../src/strategy/strategyManager';
import brokerClient from '../src/execution/brokerClient';
import instrumentManager from '../src/instruments/instrumentManager';
import notifier from '../src/notify/notifier';

import { calculateDelta } from '../src/strategy/blackScholes';

jest.mock('../src/execution/brokerClient');
jest.mock('../src/instruments/instrumentManager');
jest.mock('../src/notify/notifier');
jest.mock('../src/strategy/blackScholes');

describe('StrategyManager', () => {
  let manager: StrategyManager;

  beforeEach(() => {
    jest.clearAllMocks();
    manager = new StrategyManager();
    (brokerClient.getMarketDataBatch as jest.Mock).mockImplementation(
      async (exchange: string, tokens: string[]) => {
        const map = new Map();
        for (const token of tokens) {
          map.set(token, {
            ltp: 100,
            bid: 99.5,
            ask: 100.5,
            bidQty: 1000,
            askQty: 1000,
          });
        }
        return map;
      },
    );
    (brokerClient.getOptionGreeks as jest.Mock).mockRejectedValue(new Error('API error'));
    (calculateDelta as jest.Mock).mockImplementation((_s, _k, _t, _v, _r, type) => {
      return type === 'CE' ? 0.12 : -0.12;
    });
  });

  test('checkVix passes when VIX is between 10 and 13.5', async () => {
    (instrumentManager.getVixToken as jest.Mock).mockReturnValue('26017');
    (brokerClient.getLtp as jest.Mock).mockResolvedValueOnce(12.5);

    const res = await manager.checkVix();
    expect(res.passed).toBe(true);
    expect(res.vix).toBe(12.5);
  });

  test('checkVix fails when VIX is out of range', async () => {
    (instrumentManager.getVixToken as jest.Mock).mockReturnValue('26017');
    (brokerClient.getLtp as jest.Mock).mockResolvedValueOnce(14.5);

    const res = await manager.checkVix();
    expect(res.passed).toBe(false);
  });

  test('checkVix fails when API error', async () => {
    (instrumentManager.getVixToken as jest.Mock).mockReturnValue('26017');
    (brokerClient.getLtp as jest.Mock).mockRejectedValueOnce(new Error('API error'));

    const res = await manager.checkVix();
    expect(res.passed).toBe(false);
  });

  test('buildBasket resolves strikes based on closest delta', async () => {
    // Add today's date to verify isSame('now') path coverage
    const todayStr = dayjs().format('DDMMMYYYY').toUpperCase();
    (instrumentManager.getExpiries as jest.Mock).mockReturnValue([
      todayStr,
      '16JUL2026',
      '23JUL2026',
    ]);

    (brokerClient.getLtp as jest.Mock).mockResolvedValueOnce(19000).mockResolvedValueOnce(12.5);

    (instrumentManager.getInstrument as jest.Mock).mockImplementation(
      (underlying, expiry, strike, type) => {
        return {
          symboltoken: `token-${expiry}-${strike}-${type}`,
          tradingsymbol: `NIFTY-${expiry}-${strike}-${type}`,
          lotsize: 50,
          exchange: 'NFO',
        };
      },
    );

    (calculateDelta as jest.Mock).mockImplementation((_s, strike, _t, _v, _r, type) => {
      if (type === 'CE') {
        if (strike === 19100) return 0.11;
        if (strike === 19200) return 0.14;
        if (strike === 19300) return 0.12;
        return 0.05;
      } else {
        if (strike === 18700) return -0.11;
        if (strike === 18800) return -0.14;
        if (strike === 18900) return -0.12;
        return -0.05;
      }
    });

    (brokerClient.getMarketDataBatch as jest.Mock).mockImplementation(
      async (exchange: string, tokens: string[]) => {
        const map = new Map();
        for (const token of tokens) {
          let ltp = 100;
          if (token.includes('15200')) {
            ltp = 0;
          } else if (token.includes('16JUL2026')) {
            ltp = 5;
            if (token.includes('CE')) {
              if (token.includes('19000')) ltp = 98;
              else if (token.includes('19100')) ltp = 101;
              else if (token.includes('19200')) ltp = 97;
            } else if (token.includes('PE')) {
              if (token.includes('18800')) ltp = 98;
              else if (token.includes('18900')) ltp = 101;
              else if (token.includes('19000')) ltp = 97;
            }
          }
          map.set(token, {
            ltp,
            bid: ltp - 0.5,
            ask: ltp + 0.5,
            bidQty: 1000,
            askQty: 1000,
          });
        }
        return map;
      },
    );

    const basket = await manager.buildBasket('NIFTY');

    expect(basket).not.toBeNull();
    expect(basket).toHaveLength(4);
    expect(basket?.[0].action).toBe('SELL');
  });

  test('buildBasket resolves SENSEX underlying parameters', async () => {
    const todayStr = dayjs().format('DDMMMYYYY').toUpperCase();
    (instrumentManager.getExpiries as jest.Mock).mockReturnValue([
      todayStr,
      '16JUL2026',
      '23JUL2026',
    ]);
    (brokerClient.getLtp as jest.Mock).mockResolvedValueOnce(70000).mockResolvedValueOnce(12.5);

    (instrumentManager.getInstrument as jest.Mock).mockImplementation(
      (underlying, expiry, strike, type) => {
        return {
          symboltoken: `token-${expiry}-${strike}-${type}`,
          tradingsymbol: `SENSEX-${expiry}-${strike}-${type}`,
          lotsize: 10,
          exchange: 'BFO',
        };
      },
    );

    const basket = await manager.buildBasket('SENSEX');
    expect(basket).not.toBeNull();
    expect(basket?.[0].exchange).toBe('BFO');
  });

  test('buildBasket fails when not enough future expiries', async () => {
    const todayStr = dayjs().format('DDMMMYYYY').toUpperCase();
    (instrumentManager.getExpiries as jest.Mock).mockReturnValue([todayStr, '16JUL2026']);

    const basket = await manager.buildBasket('NIFTY');
    expect(basket).toBeNull();
  });

  test('buildBasket returns null when strike resolution fails', async () => {
    const todayStr = dayjs().format('DDMMMYYYY').toUpperCase();
    (instrumentManager.getExpiries as jest.Mock).mockReturnValue([
      todayStr,
      '16JUL2026',
      '23JUL2026',
    ]);
    (brokerClient.getLtp as jest.Mock).mockResolvedValueOnce(19000).mockResolvedValueOnce(12.5);

    (instrumentManager.getInstrument as jest.Mock).mockReturnValue(null);

    const basket = await manager.buildBasket('NIFTY');
    expect(basket).toBeNull();
  });

  test('buildBasket falls back to theoretical best when no liquid strikes are found', async () => {
    const todayStr = dayjs().format('DDMMMYYYY').toUpperCase();
    (instrumentManager.getExpiries as jest.Mock).mockReturnValue([
      todayStr,
      '16JUL2026',
      '23JUL2026',
    ]);
    (brokerClient.getLtp as jest.Mock).mockResolvedValueOnce(19000).mockResolvedValueOnce(12.5);

    (instrumentManager.getInstrument as jest.Mock).mockImplementation(
      (underlying, expiry, strike, type) => {
        return {
          symboltoken: `token-${expiry}-${strike}-${type}`,
          tradingsymbol: `NIFTY-${expiry}-${strike}-${type}`,
          lotsize: 50,
          exchange: 'NFO',
        };
      },
    );

    (brokerClient.getMarketDataBatch as jest.Mock).mockImplementation(
      async (exchange: string, tokens: string[]) => {
        const map = new Map();
        for (const token of tokens) {
          map.set(token, {
            ltp: 100,
            bid: 99.5,
            ask: 100.5,
            bidQty: 0,
            askQty: 0,
          });
        }
        return map;
      },
    );

    const basket = await manager.buildBasket('NIFTY');
    expect(basket).toBeNull();
    expect(notifier.send).toHaveBeenCalled();
  });

  test('isLiquid handles ltp <= 0, high spread, high midpoint diff, and low qty', () => {
    const minLotsDepth = 2;
    const maxSpreadPct = 0.08;
    const inst = { lotsize: 50 } as any;

    expect(
      (manager as any).isLiquid(
        { ltp: 0, bid: 99.5, ask: 100.5, bidQty: 100, askQty: 100, inst },
        minLotsDepth,
        maxSpreadPct,
      ),
    ).toBe(false);
    expect(
      (manager as any).isLiquid(
        { ltp: 100, bid: 90, ask: 110, bidQty: 100, askQty: 100, inst },
        minLotsDepth,
        maxSpreadPct,
      ),
    ).toBe(false);
    expect(
      (manager as any).isLiquid(
        { ltp: 100, bid: 110, ask: 110, bidQty: 100, askQty: 100, inst },
        minLotsDepth,
        maxSpreadPct,
      ),
    ).toBe(false);
    expect(
      (manager as any).isLiquid(
        { ltp: 100, bid: 99.5, ask: 100.5, bidQty: 50, askQty: 100, inst },
        minLotsDepth,
        maxSpreadPct,
      ),
    ).toBe(false);
    expect(
      (manager as any).isLiquid(
        { ltp: 100, bid: 99.5, ask: 100.5, bidQty: 100, askQty: 50, inst },
        minLotsDepth,
        maxSpreadPct,
      ),
    ).toBe(false);
    expect(
      (manager as any).isLiquid(
        { ltp: 100, bid: 99.5, ask: 100.5, bidQty: 100, askQty: 100, inst },
        minLotsDepth,
        maxSpreadPct,
      ),
    ).toBe(true);
  });

  test('buildBasket skips liquidity checks when skipLiquidityCheck is true', async () => {
    const todayStr = dayjs().format('DDMMMYYYY').toUpperCase();
    (instrumentManager.getExpiries as jest.Mock).mockReturnValue([
      todayStr,
      '16JUL2026',
      '23JUL2026',
    ]);

    (brokerClient.getLtp as jest.Mock).mockResolvedValueOnce(19000).mockResolvedValueOnce(12.5);

    (instrumentManager.getInstrument as jest.Mock).mockImplementation(
      (underlying, expiry, strike, type) => {
        return {
          symboltoken: `${strike}-${type}`,
          tradingsymbol: `NIFTY-${expiry}-${strike}-${type}`,
          lotsize: 50,
          exchange: 'NFO',
        };
      },
    );

    (brokerClient.getMarketDataBatch as jest.Mock).mockImplementation(
      async (exchange: string, tokens: string[]) => {
        const map = new Map();
        for (const token of tokens) {
          map.set(token, {
            ltp: 100,
            bid: 99.5,
            ask: 100.5,
            bidQty: 0,
            askQty: 0,
          });
        }
        return map;
      },
    );

    const basket = await manager.buildBasket('NIFTY', true);
    expect(basket).not.toBeNull();
    expect(basket).toHaveLength(4);
    expect(notifier.send).not.toHaveBeenCalled();
  });

  test('buildBasket loads live option greeks IVs successfully', async () => {
    const todayStr = dayjs().format('DDMMMYYYY').toUpperCase();
    (instrumentManager.getExpiries as jest.Mock).mockReturnValue([
      todayStr,
      '16JUL2026',
      '23JUL2026',
    ]);
    (brokerClient.getLtp as jest.Mock).mockResolvedValueOnce(19000).mockResolvedValueOnce(12.5);

    (brokerClient.getOptionGreeks as jest.Mock).mockResolvedValue([
      {
        name: 'NIFTY',
        expiry: todayStr,
        strikePrice: 19000,
        optionType: 'CE',
        impliedVolatility: 15,
      },
      {
        name: 'NIFTY',
        expiry: todayStr,
        strikePrice: 19000,
        optionType: 'PE',
        impliedVolatility: 16,
      },
    ]);

    (instrumentManager.getInstrument as jest.Mock).mockImplementation(
      (underlying, expiry, strike, type) => {
        return {
          symboltoken: `token-${expiry}-${strike}-${type}`,
          tradingsymbol: `NIFTY-${expiry}-${strike}-${type}`,
          lotsize: 50,
          exchange: 'NFO',
        };
      },
    );

    const basket = await manager.buildBasket('NIFTY', true);
    expect(basket).not.toBeNull();
    expect(basket).toHaveLength(4);
  });

  test('buildBasket falls back to VIX when option greeks does not contain ATM strike', async () => {
    const todayStr = dayjs().format('DDMMMYYYY').toUpperCase();
    (instrumentManager.getExpiries as jest.Mock).mockReturnValue([
      todayStr,
      '16JUL2026',
      '23JUL2026',
    ]);
    (brokerClient.getLtp as jest.Mock).mockResolvedValueOnce(19000).mockResolvedValueOnce(12.5);

    (brokerClient.getOptionGreeks as jest.Mock).mockResolvedValue([
      {
        name: 'NIFTY',
        expiry: todayStr,
        strikePrice: 22000,
        optionType: 'CE',
        impliedVolatility: 15,
      },
    ]);

    (instrumentManager.getInstrument as jest.Mock).mockImplementation(
      (underlying, expiry, strike, type) => {
        return {
          symboltoken: `token-${expiry}-${strike}-${type}`,
          tradingsymbol: `NIFTY-${expiry}-${strike}-${type}`,
          lotsize: 50,
          exchange: 'NFO',
        };
      },
    );

    const basket = await manager.buildBasket('NIFTY', true);
    expect(basket).not.toBeNull();
    expect(basket).toHaveLength(4);
  });

  test('buildBasket returns null when no qualifying T0 CE strikes fall in 0.10-0.15 range', async () => {
    const todayStr = dayjs().format('DDMMMYYYY').toUpperCase();
    (instrumentManager.getExpiries as jest.Mock).mockReturnValue([
      todayStr,
      '16JUL2026',
      '23JUL2026',
    ]);
    (brokerClient.getLtp as jest.Mock).mockResolvedValueOnce(19000).mockResolvedValueOnce(12.5);

    (calculateDelta as jest.Mock).mockImplementation((_s, _k, _t, _v, _r, type) => {
      return type === 'CE' ? 0.05 : -0.12; // CE delta out of range
    });

    const basket = await manager.buildBasket('NIFTY', true);
    expect(basket).toBeNull();
  });

  test('buildBasket returns null when no qualifying T0 PE strikes fall in 0.10-0.15 range', async () => {
    const todayStr = dayjs().format('DDMMMYYYY').toUpperCase();
    (instrumentManager.getExpiries as jest.Mock).mockReturnValue([
      todayStr,
      '16JUL2026',
      '23JUL2026',
    ]);
    (brokerClient.getLtp as jest.Mock).mockResolvedValueOnce(19000).mockResolvedValueOnce(12.5);

    (calculateDelta as jest.Mock).mockImplementation((_s, _k, _t, _v, _r, type) => {
      return type === 'CE' ? 0.12 : -0.05; // PE delta out of range
    });

    const basket = await manager.buildBasket('NIFTY', true);
    expect(basket).toBeNull();
  });

  test('buildBasket returns null when CE hedge matching fails', async () => {
    const todayStr = dayjs().format('DDMMMYYYY').toUpperCase();
    (instrumentManager.getExpiries as jest.Mock).mockReturnValue([
      todayStr,
      '16JUL2026',
      '23JUL2026',
    ]);
    (brokerClient.getLtp as jest.Mock).mockResolvedValueOnce(19000).mockResolvedValueOnce(12.5);

    (calculateDelta as jest.Mock).mockImplementation((_s, _k, _t, _v, _r, type) => {
      return type === 'CE' ? 0.12 : -0.12;
    });

    // Mock T1 CE quotes to have LTP 0 (meaning no valid liquid candidates)
    (brokerClient.getMarketDataBatch as jest.Mock).mockImplementation(
      async (exchange: string, tokens: string[]) => {
        const map = new Map();
        for (const token of tokens) {
          const isT1Ce = token.includes('16JUL2026') && token.includes('CE');
          map.set(token, {
            ltp: isT1Ce ? 0 : 100,
            bid: 99.5,
            ask: 100.5,
            bidQty: 1000,
            askQty: 1000,
          });
        }
        return map;
      },
    );

    const basket = await manager.buildBasket('NIFTY', true);
    expect(basket).toBeNull();
  });

  test('buildBasket returns null when PE hedge matching fails', async () => {
    const todayStr = dayjs().format('DDMMMYYYY').toUpperCase();
    (instrumentManager.getExpiries as jest.Mock).mockReturnValue([
      todayStr,
      '16JUL2026',
      '23JUL2026',
    ]);
    (brokerClient.getLtp as jest.Mock).mockResolvedValueOnce(19000).mockResolvedValueOnce(12.5);

    (calculateDelta as jest.Mock).mockImplementation((_s, _k, _t, _v, _r, type) => {
      return type === 'CE' ? 0.12 : -0.12;
    });

    // Mock T1 PE quotes to have LTP 0
    (brokerClient.getMarketDataBatch as jest.Mock).mockImplementation(
      async (exchange: string, tokens: string[]) => {
        const map = new Map();
        for (const token of tokens) {
          const isT1Pe = token.includes('16JUL2026') && token.includes('PE');
          map.set(token, {
            ltp: isT1Pe ? 0 : 100,
            bid: 99.5,
            ask: 100.5,
            bidQty: 1000,
            askQty: 1000,
          });
        }
        return map;
      },
    );

    const basket = await manager.buildBasket('NIFTY', true);
    expect(basket).toBeNull();
  });

  test('buildBasket resolves T1 hedges to the closest LTP', async () => {
    const todayStr = dayjs().format('DDMMMYYYY').toUpperCase();
    (instrumentManager.getExpiries as jest.Mock).mockReturnValue([
      todayStr,
      '16JUL2026',
      '23JUL2026',
    ]);
    (brokerClient.getLtp as jest.Mock).mockResolvedValueOnce(19000).mockResolvedValueOnce(12.5);

    (calculateDelta as jest.Mock).mockImplementation((_s, _k, _t, _v, _r, type) => {
      return type === 'CE' ? 0.12 : -0.12;
    });

    // Short T0 LTP is 100. Let's make strike 18900 CE and 19100 PE have ltp 108, which is the closest to 100.
    (brokerClient.getMarketDataBatch as jest.Mock).mockImplementation(
      async (exchange: string, tokens: string[]) => {
        const map = new Map();
        for (const token of tokens) {
          const isT1Ce = token.includes('16JUL2026') && token.includes('CE');
          const isT1Pe = token.includes('16JUL2026') && token.includes('PE');
          let ltp = 100;
          if (isT1Ce) {
            ltp = token.includes('18900') ? 108 : 5;
          }
          if (isT1Pe) {
            ltp = token.includes('19100') ? 108 : 5;
          }
          map.set(token, {
            ltp,
            bid: 99.5,
            ask: 100.5,
            bidQty: 1000,
            askQty: 1000,
          });
        }
        return map;
      },
    );

    const basket = await manager.buildBasket('NIFTY', true);
    expect(basket).not.toBeNull();
    expect(basket).toHaveLength(4);
  });
});
