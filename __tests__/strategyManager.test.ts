import dayjs from 'dayjs';
import { StrategyManager } from '../src/strategy/strategyManager';
import brokerClient from '../src/execution/brokerClient';
import instrumentManager from '../src/instruments/instrumentManager';

jest.mock('../src/execution/brokerClient');
jest.mock('../src/instruments/instrumentManager');

describe('StrategyManager', () => {
  let manager: StrategyManager;

  beforeEach(() => {
    jest.clearAllMocks();
    manager = new StrategyManager();
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

    const basket = await manager.buildBasket('NIFTY');

    expect(basket).not.toBeNull();
    expect(basket).toHaveLength(6);
    expect(basket?.[0].action).toBe('SELL');
  });

  test('buildBasket resolves SENSEX underlying parameters', async () => {
    (instrumentManager.getExpiries as jest.Mock).mockReturnValue([
      '09JUL2026',
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
    (instrumentManager.getExpiries as jest.Mock).mockReturnValue(['09JUL2026', '16JUL2026']);

    const basket = await manager.buildBasket('NIFTY');
    expect(basket).toBeNull();
  });

  test('buildBasket returns null when strike resolution fails', async () => {
    (instrumentManager.getExpiries as jest.Mock).mockReturnValue([
      '09JUL2026',
      '16JUL2026',
      '23JUL2026',
    ]);
    (brokerClient.getLtp as jest.Mock).mockResolvedValueOnce(19000).mockResolvedValueOnce(12.5);

    (instrumentManager.getInstrument as jest.Mock).mockReturnValue(null);

    const basket = await manager.buildBasket('NIFTY');
    expect(basket).toBeNull();
  });
});
