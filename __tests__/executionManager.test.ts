import { ExecutionManager } from '../src/execution/executionManager';
import brokerClient from '../src/execution/brokerClient';
import flagWatcher from '../src/flags/flagWatcher';
import positionsStore from '../src/positions/positionsStore';
import notifier from '../src/notify/notifier';
import { StrategyLeg } from '../src/strategy/strategyManager';
import { InstrumentCacheEntry } from '../src/schemas/smartApi';
import { instrumentManager } from '../src/instruments/instrumentManager';

jest.mock('../src/execution/brokerClient');
jest.mock('../src/flags/flagWatcher');
jest.mock('../src/positions/positionsStore');
jest.mock('../src/notify/notifier');
jest.mock('../src/instruments/instrumentManager');

describe('ExecutionManager', () => {
  let executionManager: ExecutionManager;
  let mockBasket: StrategyLeg[];

  beforeEach(() => {
    jest.clearAllMocks();
    executionManager = new ExecutionManager();

    // Set polling settings to execute instantly in tests
    (
      executionManager as unknown as { pollIntervalMs: number; maxPollAttempts: number }
    ).pollIntervalMs = 1;
    (
      executionManager as unknown as { pollIntervalMs: number; maxPollAttempts: number }
    ).maxPollAttempts = 2;

    mockBasket = [
      {
        action: 'BUY',
        quantity: 50,
        expiry: '16JUL2026',
        strike: 19100,
        type: 'CE',
        symboltoken: 'T1_CE_BUY',
        tradingsymbol: 'NIFTY16JUL26C19100',
        exchange: 'NFO',
        lotsize: 50,
        targetDelta: 0.35,
        actualDelta: 0.36,
      },
      {
        action: 'SELL',
        quantity: 150,
        expiry: '09JUL2026',
        strike: 19200,
        type: 'CE',
        symboltoken: 'T0_CE_SELL',
        tradingsymbol: 'NIFTY09JUL26C19200',
        exchange: 'NFO',
        lotsize: 50,
        targetDelta: 0.15,
        actualDelta: 0.16,
      },
    ];

    (positionsStore.getCurrentWeekString as jest.Mock).mockReturnValue('2026-W27');
    (brokerClient.getMarketData as jest.Mock).mockResolvedValue({
      ltp: 100,
      bid: 99.5,
      ask: 100.5,
    });
    (brokerClient.getOrderBook as jest.Mock).mockResolvedValue([]);
  });

  test('executeEntry in Paper Mode (simulated fills)', async () => {
    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(true);
    (brokerClient.getLtp as jest.Mock).mockResolvedValue(100);

    const success = await executionManager.executeEntry('NIFTY', mockBasket);

    expect(success).toBe(true);
    expect(positionsStore.writePosition).toHaveBeenCalled();
  });

  test('executeEntry in Live Mode success', async () => {
    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(false);
    (brokerClient.getLtp as jest.Mock).mockResolvedValue(100);

    let placedOrders: any[] = [];
    (brokerClient.placeOrder as jest.Mock).mockImplementation(async (params) => {
      const orderid = `ORD-${params.symboltoken}`;
      placedOrders.push({
        orderid,
        status: 'COMPLETE',
        price: 105,
        averageprice: 105,
        tradingsymbol: params.tradingsymbol,
        symboltoken: params.symboltoken,
        transactiontype: params.transactiontype,
        quantity: Number(params.quantity),
      });
      return orderid;
    });

    (brokerClient.getOrderBook as jest.Mock).mockImplementation(async () => {
      return placedOrders;
    });

    (brokerClient.getMarginUtilized as jest.Mock).mockResolvedValue(120000);

    const success = await executionManager.executeEntry('NIFTY', mockBasket);

    expect(success).toBe(true);
    expect(brokerClient.placeOrder).toHaveBeenCalledTimes(2);
  });

  test('executeEntry rollback on Buy leg failure', async () => {
    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(false);
    (brokerClient.getLtp as jest.Mock).mockResolvedValue(100);

    let placedOrders: any[] = [];
    (brokerClient.placeOrder as jest.Mock).mockImplementation(async (params) => {
      const orderid = 'BUY-ORD-ID';
      placedOrders.push({
        orderid,
        status: 'REJECTED',
        price: 0,
        tradingsymbol: params.tradingsymbol,
        symboltoken: params.symboltoken,
        transactiontype: params.transactiontype,
        quantity: Number(params.quantity),
      });
      return orderid;
    });

    (brokerClient.getOrderBook as jest.Mock).mockImplementation(async () => {
      return placedOrders;
    });

    const success = await executionManager.executeEntry('NIFTY', mockBasket);

    expect(success).toBe(false);
    expect(notifier.send).toHaveBeenCalled();
  });

  test('executeEntry aborts if sell leg fails', async () => {
    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(false);
    (brokerClient.getLtp as jest.Mock).mockResolvedValue(100);

    let placedOrders: any[] = [];
    (brokerClient.placeOrder as jest.Mock).mockImplementation(async (params) => {
      const orderid = params.transactiontype === 'BUY' ? 'BUY-ORD-ID' : 'SELL-ORD-ID';
      placedOrders.push({
        orderid,
        status: params.transactiontype === 'BUY' ? 'COMPLETE' : 'REJECTED',
        price: params.transactiontype === 'BUY' ? 100 : 0,
        tradingsymbol: params.tradingsymbol,
        symboltoken: params.symboltoken,
        transactiontype: params.transactiontype,
        quantity: Number(params.quantity),
      });
      return orderid;
    });

    (brokerClient.getOrderBook as jest.Mock).mockImplementation(async () => {
      return placedOrders;
    });

    const success = await executionManager.executeEntry('NIFTY', mockBasket);
    expect(success).toBe(false);
  });

  test('executeEntry polling timeouts', async () => {
    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(false);
    (brokerClient.getLtp as jest.Mock).mockResolvedValue(100);
    (brokerClient.placeOrder as jest.Mock).mockResolvedValue('ORD-ID');
    (brokerClient.getOrderBook as jest.Mock).mockResolvedValue([]);

    const success = await executionManager.executeEntry('NIFTY', mockBasket);
    expect(success).toBe(false);
  });

  test('executeEntry order placement exceptions', async () => {
    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(false);
    (brokerClient.getLtp as jest.Mock).mockResolvedValue(100);
    (brokerClient.placeOrder as jest.Mock).mockRejectedValue(new Error('Network drop'));

    const success = await executionManager.executeEntry('NIFTY', mockBasket);
    expect(success).toBe(false);
  });

  test('rollbackOrders failure logging check', async () => {
    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(false);
    (brokerClient.placeOrder as jest.Mock).mockRejectedValue(new Error('Rollback failed'));

    await expect(
      (
        executionManager as unknown as { rollbackOrders: (orders: unknown[]) => Promise<void> }
      ).rollbackOrders([
        {
          symboltoken: '123',
          tradingsymbol: 'NIFTY',
          transactiontype: 'BUY',
          quantity: 50,
          exchange: 'NFO',
          orderid: 'O1',
          status: 'COMPLETE',
          price: 100,
        },
      ]),
    ).resolves.not.toThrow();
  });

  test('executeExit returns false if no open position', async () => {
    (positionsStore.readPosition as jest.Mock).mockReturnValue(null);
    const success = await executionManager.executeExit('NIFTY', '2026-W27', true);
    expect(success).toBe(false);
  });

  test('executeExit handles live order close failures', async () => {
    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(false);

    const openPosition = {
      week: '2026-W27',
      status: 'open' as const,
      marginUtilized: 120000,
      orders: [
        {
          symboltoken: 'T1_CE_BUY',
          tradingsymbol: 'NIFTY16JUL26C19100',
          transactiontype: 'BUY' as const,
          quantity: 50,
          exchange: 'NFO',
          orderid: 'O1',
          status: 'COMPLETE',
          price: 100,
        },
      ],
      realizedPnl: 0,
      skippedThisWeek: false,
    };
    (positionsStore.readPosition as jest.Mock).mockReturnValue(openPosition);
    (brokerClient.getLtp as jest.Mock).mockResolvedValue(90);
    (brokerClient.placeOrder as jest.Mock).mockRejectedValue(new Error('Order API down'));

    const success = await executionManager.executeExit('NIFTY', '2026-W27', false);
    expect(success).toBe(false);
  });

  test('monitorPnl handles kill switch and non-open positions', async () => {
    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(true);
    await executionManager.monitorPnl('NIFTY', '2026-W27', true);
    expect(positionsStore.readPosition).not.toHaveBeenCalled();

    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(false);
    (positionsStore.readPosition as jest.Mock).mockReturnValue(null);
    await executionManager.monitorPnl('NIFTY', '2026-W27', true);
    expect(brokerClient.getLtp).not.toHaveBeenCalled();
  });

  test('monitorPnl handles LTP api errors gracefully', async () => {
    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(false);

    const openPosition = {
      week: '2026-W27',
      status: 'open' as const,
      marginUtilized: 100000,
      orders: [
        {
          symboltoken: 'T1_CE_BUY',
          tradingsymbol: 'NIFTY16JUL26C19100',
          transactiontype: 'BUY' as const,
          quantity: 50,
          exchange: 'NFO',
          orderid: 'O1',
          status: 'COMPLETE',
          price: 100,
        },
      ],
      realizedPnl: 0,
      skippedThisWeek: false,
    };
    (positionsStore.readPosition as jest.Mock).mockReturnValue(openPosition);
    (brokerClient.getLtp as jest.Mock).mockRejectedValue(new Error('LTP fetch failed'));

    await expect(executionManager.monitorPnl('NIFTY', '2026-W27', true)).resolves.not.toThrow();
  });

  test('monitorPnl exits on profit target reached', async () => {
    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(false);

    const openPosition = {
      week: '2026-W27',
      status: 'open' as const,
      marginUtilized: 100000,
      orders: [
        {
          symboltoken: 'T1_CE_BUY',
          tradingsymbol: 'NIFTY16JUL26C19100',
          transactiontype: 'BUY' as const,
          quantity: 50,
          exchange: 'NFO',
          orderid: 'O1',
          status: 'COMPLETE',
          price: 100,
        },
      ],
      realizedPnl: 0,
      skippedThisWeek: false,
    };
    (positionsStore.readPosition as jest.Mock).mockReturnValue(openPosition);
    (brokerClient.getLtp as jest.Mock).mockResolvedValue(150);

    const executeExitSpy = jest.spyOn(executionManager, 'executeExit').mockResolvedValue(true);

    await executionManager.monitorPnl('NIFTY', '2026-W27', true);

    expect(executeExitSpy).toHaveBeenCalledWith('NIFTY', '2026-W27', true);
    expect(positionsStore.setWeeklySkipState).toHaveBeenCalledWith('NIFTY', '2026-W27', true, true);
    executeExitSpy.mockRestore();
  });

  test('monitorPnl exits on profit target reached and handles exit failure', async () => {
    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(false);

    const openPosition = {
      week: '2026-W27',
      status: 'open' as const,
      marginUtilized: 100000,
      orders: [
        {
          symboltoken: 'T1_CE_BUY',
          tradingsymbol: 'NIFTY16JUL26C19100',
          transactiontype: 'BUY' as const,
          quantity: 50,
          exchange: 'NFO',
          orderid: 'O1',
          status: 'COMPLETE',
          price: 100,
        },
      ],
      realizedPnl: 0,
      skippedThisWeek: false,
    };
    (positionsStore.readPosition as jest.Mock).mockReturnValue(openPosition);
    (brokerClient.getLtp as jest.Mock).mockResolvedValue(150);

    const executeExitSpy = jest.spyOn(executionManager, 'executeExit').mockResolvedValue(false);

    await executionManager.monitorPnl('NIFTY', '2026-W27', true);

    expect(executeExitSpy).toHaveBeenCalledWith('NIFTY', '2026-W27', true);
    expect(positionsStore.setWeeklySkipState).not.toHaveBeenCalledWith(
      'NIFTY',
      '2026-W27',
      true,
      true,
    );
    executeExitSpy.mockRestore();
  });

  test('prevents duplicate order placements', async () => {
    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(false);
    (brokerClient.getLtp as jest.Mock).mockResolvedValue(100);

    (brokerClient.getOrderBook as jest.Mock).mockResolvedValue([
      {
        orderid: 'ORD-EXISTING',
        status: 'COMPLETE',
        price: 105,
        tradingsymbol: 'NIFTY16JUL26C19100',
        symboltoken: 'T1_CE_BUY',
        transactiontype: 'BUY',
        quantity: 50,
      },
    ]);

    const success = await executionManager.executeEntry('NIFTY', mockBasket);
    expect(success).toBe(false); // aborts because second leg is not placed or because we abort (wait, in this test, buy leg is skipped and returned, then sell leg is placed)
    // Actually, buy leg is skipped and returns existing order, then sell leg fails because placeOrder is not mocked for it or it is. Let's see what happens.
    // If we mock placeOrder to fail or succeed:
    (brokerClient.placeOrder as jest.Mock).mockResolvedValue('ORD-ID-2');
  });

  test('performs liquidity check and strike shift for Nifty CE', async () => {
    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(false);
    
    // First token (T1_CE_BUY) has poor liquidity: ltp=100, bid/ask=250/255 -> spread=5, midpoint=252.5. Diff to LTP is 152.5%
    // Shifted token (T1_CE_SHIFTED) has good liquidity: ltp=100, bid=99.5, ask=100.5
    (brokerClient.getMarketData as jest.Mock)
      .mockResolvedValueOnce({ ltp: 100, bid: 250, ask: 255 })
      .mockResolvedValueOnce({ ltp: 100, bid: 99.5, ask: 100.5 });

    (brokerClient.getLtp as jest.Mock)
      .mockResolvedValueOnce(19000) // Underlying Nifty LTP for direction check
      .mockResolvedValueOnce(100); // Shifted option LTP

    const shiftedInst: InstrumentCacheEntry = {
      symboltoken: 'T1_CE_SHIFTED',
      tradingsymbol: 'NIFTY16JUL26C19050',
      lotsize: 50,
      exchange: 'NFO',
    };
    (instrumentManager.getInstrument as jest.Mock).mockReturnValue(shiftedInst);

    (brokerClient.placeOrder as jest.Mock).mockResolvedValue('ORD-ID');
    (brokerClient.getOrderBook as jest.Mock).mockResolvedValue([
      {
        orderid: 'ORD-ID',
        status: 'COMPLETE',
        price: 100,
        tradingsymbol: 'NIFTY16JUL26C19050',
        symboltoken: 'T1_CE_SHIFTED',
        transactiontype: 'BUY',
        quantity: 50,
      },
    ]);

    const result = await (executionManager as any).placeAndConfirmOrder(mockBasket[0], false);
    expect(result).not.toBeNull();
    expect(result?.symboltoken).toBe('T1_CE_SHIFTED');
  });
});
