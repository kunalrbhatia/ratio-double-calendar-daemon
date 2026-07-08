import { ExecutionManager } from '../src/execution/executionManager';
import brokerClient from '../src/execution/brokerClient';
import flagWatcher from '../src/flags/flagWatcher';
import positionsStore from '../src/positions/positionsStore';
import notifier from '../src/notify/notifier';
import { StrategyLeg } from '../src/strategy/strategyManager';

jest.mock('../src/execution/brokerClient');
jest.mock('../src/flags/flagWatcher');
jest.mock('../src/positions/positionsStore');
jest.mock('../src/notify/notifier');

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
        targetDelta: 0.2,
        actualDelta: 0.19,
      },
    ];

    (positionsStore.getCurrentWeekString as jest.Mock).mockReturnValue('2026-W27');
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
    (brokerClient.placeOrder as jest.Mock).mockResolvedValue('ORD-ID');

    (brokerClient.getOrderBook as jest.Mock).mockResolvedValue([
      {
        orderid: 'ORD-ID',
        status: 'COMPLETE',
        price: 105,
        averageprice: 105,
        tradingsymbol: 'NIFTY16JUL26C19100',
        symboltoken: 'T1_CE_BUY',
        transactiontype: 'BUY',
        quantity: 50,
      },
    ]);
    (brokerClient.getMarginUtilized as jest.Mock).mockResolvedValue(120000);

    const success = await executionManager.executeEntry('NIFTY', mockBasket);

    expect(success).toBe(true);
    expect(brokerClient.placeOrder).toHaveBeenCalledTimes(2);
  });

  test('executeEntry rollback on Buy leg failure', async () => {
    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(false);
    (brokerClient.getLtp as jest.Mock).mockResolvedValue(100);

    (brokerClient.placeOrder as jest.Mock).mockResolvedValueOnce('BUY-ORD-ID');
    (brokerClient.getOrderBook as jest.Mock).mockResolvedValue([
      {
        orderid: 'BUY-ORD-ID',
        status: 'REJECTED',
        price: 0,
        tradingsymbol: 'NIFTY16JUL26C19100',
        symboltoken: 'T1_CE_BUY',
        transactiontype: 'BUY',
        quantity: 50,
      },
    ]);

    const success = await executionManager.executeEntry('NIFTY', mockBasket);

    expect(success).toBe(false);
    expect(notifier.send).toHaveBeenCalled();
  });

  test('executeEntry aborts if sell leg fails', async () => {
    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(false);
    (brokerClient.getLtp as jest.Mock).mockResolvedValue(100);

    (brokerClient.placeOrder as jest.Mock)
      .mockResolvedValueOnce('BUY-ORD-ID')
      .mockResolvedValueOnce('SELL-ORD-ID');

    (brokerClient.getOrderBook as jest.Mock)
      .mockResolvedValueOnce([
        {
          orderid: 'BUY-ORD-ID',
          status: 'COMPLETE',
          price: 100,
          tradingsymbol: 'NIFTY16JUL26C19100',
          symboltoken: 'T1_CE_BUY',
          transactiontype: 'BUY',
          quantity: 50,
        },
      ])
      .mockResolvedValueOnce([
        {
          orderid: 'SELL-ORD-ID',
          status: 'REJECTED',
          price: 0,
          tradingsymbol: 'NIFTY09JUL26C19200',
          symboltoken: 'T0_CE_SELL',
          transactiontype: 'SELL',
          quantity: 150,
        },
      ]);

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
    const success = await executionManager.executeExit('2026-W27', true);
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

    const success = await executionManager.executeExit('2026-W27', false);
    expect(success).toBe(false);
  });

  test('monitorPnl handles kill switch and non-open positions', async () => {
    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(true);
    await executionManager.monitorPnl('2026-W27', true);
    expect(positionsStore.readPosition).not.toHaveBeenCalled();

    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(false);
    (positionsStore.readPosition as jest.Mock).mockReturnValue(null);
    await executionManager.monitorPnl('2026-W27', true);
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

    await expect(executionManager.monitorPnl('2026-W27', true)).resolves.not.toThrow();
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

    await executionManager.monitorPnl('2026-W27', true);

    expect(executeExitSpy).toHaveBeenCalledWith('2026-W27', true);
    expect(positionsStore.setWeeklySkipState).toHaveBeenCalledWith('2026-W27', true, true);
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

    await executionManager.monitorPnl('2026-W27', true);

    expect(executeExitSpy).toHaveBeenCalledWith('2026-W27', true);
    expect(positionsStore.setWeeklySkipState).not.toHaveBeenCalledWith('2026-W27', true, true);
    executeExitSpy.mockRestore();
  });
});
