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
import env from '../src/schemas/env';

dayjs.extend(utc);
dayjs.extend(timezone);

jest.mock('node-cron');
jest.mock('../src/auth/session');
jest.mock('../src/instruments/instrumentManager');
jest.mock('../src/strategy/strategyManager');
jest.mock('../src/execution/executionManager');
jest.mock('../src/positions/positionsStore');
jest.mock('../src/flags/flagWatcher');
jest.mock('../src/schemas/env', () => ({
  __esModule: true,
  default: {
    SENSEX_EXPIRY_ENABLED: true,
  },
  env: {
    SENSEX_EXPIRY_ENABLED: true,
  },
}));
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
    (flagWatcher.isDoneForThisWeek as jest.Mock).mockReturnValue(false);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('start and stop scheduled jobs', () => {
    scheduler.start();
    expect(cron.schedule).toHaveBeenCalledTimes(6);

    scheduler.stop();
  });

  test('handleTradingTick does nothing outside market hours', async () => {
    // 09:15 AM IST (outside 09:30-15:30)
    jest.setSystemTime(new Date('2026-07-01T09:15:00+05:30')); // Wednesday 09:15am

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
    (positionsStore.readPosition as jest.Mock).mockReturnValue({
      status: 'open',
      week: '2026-W27',
    });

    await scheduler.handleTradingTick();

    expect(executionManager.monitorPnl).toHaveBeenCalledWith('NIFTY', '2026-W27', true);
  });

  test('handleTradingTick does nothing if position already skipped or closed', async () => {
    jest.setSystemTime(new Date('2026-07-01T10:00:00+05:30'));

    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(true);
    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(false);
    (positionsStore.getCurrentWeekString as jest.Mock).mockReturnValue('2026-W27');
    (positionsStore.readPosition as jest.Mock).mockReturnValue({
      status: 'skipped',
      week: '2026-W27',
    });

    await scheduler.handleTradingTick();

    expect(strategyManager.checkVix).not.toHaveBeenCalled();
  });

  test('handleTradingTick exits position on Tuesday at 15:15 IST', async () => {
    // Tuesday 15:20 PM IST
    jest.setSystemTime(new Date('2026-07-07T15:20:00+05:30'));

    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(true);
    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(false);
    (positionsStore.getCurrentWeekString as jest.Mock).mockReturnValue('2026-W28');
    (positionsStore.readPosition as jest.Mock).mockReturnValue({
      status: 'open',
      week: '2026-W28',
    });

    await scheduler.handleTradingTick();

    expect(executionManager.executeExit).toHaveBeenCalledWith('NIFTY', '2026-W28', true);
  });

  test('handleTradingTick attempts entry on Friday morning for SENSEX when SENSEX_EXPIRY_ENABLED is true', async () => {
    // Friday 10:00 AM IST
    jest.setSystemTime(new Date('2026-07-03T10:00:00+05:30'));
    env.SENSEX_EXPIRY_ENABLED = true;

    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(true);
    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(false);
    (positionsStore.getCurrentWeekString as jest.Mock).mockReturnValue('2026-W27');
    (positionsStore.readPosition as jest.Mock).mockReturnValue(null); // No position yet

    (strategyManager.checkVix as jest.Mock).mockResolvedValue({ passed: true, vix: 12 });
    (strategyManager.buildBasket as jest.Mock).mockResolvedValue([]);

    await scheduler.handleTradingTick();

    expect(sessionManager.login).toHaveBeenCalled();
    expect(instrumentManager.loadInstruments).toHaveBeenCalled();
    expect(executionManager.executeEntry).toHaveBeenCalledWith('SENSEX', []);
  });

  test('handleTradingTick skips entry on Friday morning for SENSEX when SENSEX_EXPIRY_ENABLED is false', async () => {
    // Friday 10:00 AM IST
    jest.setSystemTime(new Date('2026-07-03T10:00:00+05:30'));
    env.SENSEX_EXPIRY_ENABLED = false;

    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(true);
    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(false);
    (positionsStore.getCurrentWeekString as jest.Mock).mockReturnValue('2026-W27');
    (positionsStore.readPosition as jest.Mock).mockReturnValue(null); // No position yet

    (strategyManager.checkVix as jest.Mock).mockResolvedValue({ passed: true, vix: 12 });
    (strategyManager.buildBasket as jest.Mock).mockResolvedValue([]);

    await scheduler.handleTradingTick();

    // SENSEX should not be entered
    expect(executionManager.executeEntry).not.toHaveBeenCalledWith('SENSEX', expect.any(Array));
  });

  test('runDailyCleanup works correctly', () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readdirSync as jest.Mock).mockReturnValue(['2026-05-01.log', '2026-07-01.log']);

    scheduler.runDailyCleanup();
    expect(fs.unlinkSync).toHaveBeenCalled();
  });

  test('handleTradingTick does nothing if weekly lockout is active', async () => {
    // Wednesday 10:00 AM IST
    jest.setSystemTime(new Date('2026-07-01T10:00:00+05:30'));

    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(true);
    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(false);
    (flagWatcher.isDoneForThisWeek as jest.Mock).mockReturnValue(true);

    await scheduler.handleTradingTick();

    expect(positionsStore.getCurrentWeekString).not.toHaveBeenCalled();
  });

  test('weekly lockout clear job deletes done-for-this-week file', () => {
    let clearCallback: any;
    (cron.schedule as jest.Mock).mockImplementation((expression, cb) => {
      if (expression === '0 16 * * 2') {
        clearCallback = cb;
      }
      return { start: jest.fn(), stop: jest.fn() };
    });

    scheduler.start();
    expect(clearCallback).toBeDefined();

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    clearCallback();
    expect(fs.unlinkSync).toHaveBeenCalledWith(expect.stringContaining('done-for-this-week'));
  });

  test('weekly lockout clear job does nothing if done-for-this-week file does not exist', () => {
    let clearCallback: any;
    (cron.schedule as jest.Mock).mockImplementation((expression, cb) => {
      if (expression === '0 16 * * 2') {
        clearCallback = cb;
      }
      return { start: jest.fn(), stop: jest.fn() };
    });

    scheduler.start();
    expect(clearCallback).toBeDefined();

    (fs.existsSync as jest.Mock).mockReturnValue(false);
    clearCallback();
    expect(fs.unlinkSync).not.toHaveBeenCalled();
  });

  test('margin refresh job does nothing if kill switch or lockout is active', async () => {
    let refreshCallback: any;
    (cron.schedule as jest.Mock).mockImplementation((expression, cb) => {
      if (expression === '20 9 * * 1-5') {
        refreshCallback = cb;
      }
      return { start: jest.fn(), stop: jest.fn() };
    });

    scheduler.start();
    expect(refreshCallback).toBeDefined();

    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(true);
    await refreshCallback();
    expect(executionManager.updateMarginUtilized).not.toHaveBeenCalled();

    jest.clearAllMocks();
    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(false);
    (flagWatcher.isDoneForThisWeek as jest.Mock).mockReturnValue(true);
    await refreshCallback();
    expect(executionManager.updateMarginUtilized).not.toHaveBeenCalled();
  });

  test('margin refresh job updates NIFTY and SENSEX margins when active', async () => {
    let refreshCallback: any;
    (cron.schedule as jest.Mock).mockImplementation((expression, cb) => {
      if (expression === '20 9 * * 1-5') {
        refreshCallback = cb;
      }
      return { start: jest.fn(), stop: jest.fn() };
    });

    scheduler.start();
    expect(refreshCallback).toBeDefined();

    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(false);
    (flagWatcher.isDoneForThisWeek as jest.Mock).mockReturnValue(false);
    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(false);
    (positionsStore.getCurrentWeekString as jest.Mock).mockReturnValue('2026-W27');

    env.SENSEX_EXPIRY_ENABLED = true;
    await refreshCallback();

    expect(executionManager.updateMarginUtilized).toHaveBeenCalledWith('NIFTY', '2026-W27', false);
    expect(executionManager.updateMarginUtilized).toHaveBeenCalledWith('SENSEX', '2026-W27', false);

    jest.clearAllMocks();
    env.SENSEX_EXPIRY_ENABLED = false;
    await refreshCallback();

    expect(executionManager.updateMarginUtilized).toHaveBeenCalledWith('NIFTY', '2026-W27', false);
    expect(executionManager.updateMarginUtilized).not.toHaveBeenCalledWith(
      'SENSEX',
      '2026-W27',
      false,
    );
  });

  test('margin refresh job catches errors and logs them', async () => {
    let refreshCallback: any;
    (cron.schedule as jest.Mock).mockImplementation((expression, cb) => {
      if (expression === '20 9 * * 1-5') {
        refreshCallback = cb;
      }
      return { start: jest.fn(), stop: jest.fn() };
    });

    scheduler.start();
    expect(refreshCallback).toBeDefined();

    (flagWatcher.isKillSwitched as jest.Mock).mockReturnValue(false);
    (flagWatcher.isDoneForThisWeek as jest.Mock).mockReturnValue(false);
    (flagWatcher.isPaperMode as jest.Mock).mockReturnValue(false);
    (positionsStore.getCurrentWeekString as jest.Mock).mockReturnValue('2026-W27');

    (executionManager.updateMarginUtilized as jest.Mock).mockRejectedValue(
      new Error('Update failed'),
    );

    await expect(refreshCallback()).resolves.not.toThrow();
  });
});
