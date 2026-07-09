import cron from 'node-cron';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { CronScheduler } from '../src/scheduler/cronScheduler';
import sessionManager from '../src/auth/session';
import instrumentManager from '../src/instruments/instrumentManager';
import strategyManager from '../src/strategy/strategyManager';
import executionManager from '../src/execution/executionManager';
import positionsStore from '../src/positions/positionsStore';
import flagWatcher from '../src/flags/flagWatcher';
import fs from 'fs';

dayjs.extend(utc);
dayjs.extend(timezone);

jest.mock('node-cron');
jest.mock('../src/auth/session');
jest.mock('../src/instruments/instrumentManager');
jest.mock('../src/strategy/strategyManager');
jest.mock('../src/execution/executionManager');
jest.mock('../src/positions/positionsStore');
jest.mock('../src/flags/flagWatcher');
jest.mock('fs');

describe('CronScheduler', () => {
  let scheduler: CronScheduler;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    scheduler = new CronScheduler();

    // Mock cron.schedule
    (cron.schedule as jest.Mock).mockReturnValue({
      start: jest.fn(),
      stop: jest.fn(),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('start and stop scheduled jobs', () => {
    scheduler.start();
    expect(cron.schedule).toHaveBeenCalledTimes(4);

    scheduler.stop();
  });

  test('handleTradingTick does nothing outside market hours', async () => {
    // 8:00 AM IST (outside 09:15-15:30)
    jest.setSystemTime(new Date('2026-07-01T08:00:00+05:30')); // Wednesday 8am

    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(true);
    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(false);

    await scheduler.handleTradingTick();

    expect(positionsStore.getCurrentWeekString).not.toHaveBeenCalled();
  });

  test('handleTradingTick does nothing if kill switch is active', async () => {
    // Wednesday 10:00 AM IST
    jest.setSystemTime(new Date('2026-07-01T10:00:00+05:30'));

    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(true);
    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(true);

    await scheduler.handleTradingTick();

    expect(positionsStore.getCurrentWeekString).not.toHaveBeenCalled();
  });

  test('handleTradingTick attempts entry on Wednesday morning', async () => {
    // Wednesday 10:00 AM IST
    jest.setSystemTime(new Date('2026-07-01T10:00:00+05:30'));

    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(true);
    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(false);
    (positionsStore.getCurrentWeekString as jest.Mock).mockReturnValue('2026-W27');
    (positionsStore.readPosition as jest.Mock).mockReturnValue(null); // No position yet

    (strategyManager.checkVix as jest.Mock).mockResolvedValue({ passed: true, vix: 12 });
    (strategyManager.buildBasket as jest.Mock).mockResolvedValue([]);

    await scheduler.handleTradingTick();

    expect(sessionManager.login).toHaveBeenCalled();
    expect(instrumentManager.loadInstruments).toHaveBeenCalled();
    expect(executionManager.executeEntry).toHaveBeenCalledWith('NIFTY', []);
  });

  test('handleTradingTick skips entry if VIX is invalid', async () => {
    jest.setSystemTime(new Date('2026-07-01T10:00:00+05:30'));

    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(true);
    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(false);
    (positionsStore.getCurrentWeekString as jest.Mock).mockReturnValue('2026-W27');
    (positionsStore.readPosition as jest.Mock).mockReturnValue(null);

    (strategyManager.checkVix as jest.Mock).mockResolvedValue({ passed: false, vix: 15 });

    await scheduler.handleTradingTick();

    expect(positionsStore.setWeeklySkipState).toHaveBeenCalledWith('NIFTY', '2026-W27', true, true);
    expect(strategyManager.buildBasket).not.toHaveBeenCalled();
  });

  test('handleTradingTick skips if basket build returns null', async () => {
    jest.setSystemTime(new Date('2026-07-01T10:00:00+05:30'));

    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(true);
    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(false);
    (positionsStore.getCurrentWeekString as jest.Mock).mockReturnValue('2026-W27');
    (positionsStore.readPosition as jest.Mock).mockReturnValue(null);

    (strategyManager.checkVix as jest.Mock).mockResolvedValue({ passed: true, vix: 12 });
    (strategyManager.buildBasket as jest.Mock).mockResolvedValue(null);

    await scheduler.handleTradingTick();

    expect(executionManager.executeEntry).not.toHaveBeenCalled();
  });

  test('handleTradingTick monitors open position on Thursday', async () => {
    // Thursday 10:00 AM IST
    jest.setSystemTime(new Date('2026-07-02T10:00:00+05:30'));

    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(true);
    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(false);
    (positionsStore.getCurrentWeekString as jest.Mock).mockReturnValue('2026-W27');
    (positionsStore.readPosition as jest.Mock).mockReturnValue({ status: 'open' });

    await scheduler.handleTradingTick();

    expect(executionManager.monitorPnl).toHaveBeenCalledWith('NIFTY', '2026-W27', true);
  });

  test('handleTradingTick does nothing if position already skipped or closed', async () => {
    jest.setSystemTime(new Date('2026-07-01T10:00:00+05:30'));

    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(true);
    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(false);
    (positionsStore.getCurrentWeekString as jest.Mock).mockReturnValue('2026-W27');
    (positionsStore.readPosition as jest.Mock).mockReturnValue({ status: 'skipped' });

    await scheduler.handleTradingTick();

    expect(strategyManager.checkVix).not.toHaveBeenCalled();
  });

  test('handleTradingTick exits position on Tuesday at 15:15 IST', async () => {
    // Tuesday 15:20 PM IST
    jest.setSystemTime(new Date('2026-07-07T15:20:00+05:30'));

    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(true);
    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(false);
    (positionsStore.getCurrentWeekString as jest.Mock).mockReturnValue('2026-W28');
    (positionsStore.readPosition as jest.Mock).mockReturnValue({ status: 'open' });

    await scheduler.handleTradingTick();

    expect(executionManager.executeExit).toHaveBeenCalledWith('NIFTY', '2026-W28', true);
  });

  test('runDailyCleanup works correctly', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readdirSync as jest.Mock).mockReturnValue(['2026-05-01.log', '2026-07-01.log']);

    scheduler.runDailyCleanup();
    expect(fs.unlinkSync).toHaveBeenCalled();
  });
});
