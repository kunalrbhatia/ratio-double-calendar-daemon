import cron from 'node-cron';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import logger from '../logging/logger';
import sessionManager from '../auth/session';
import instrumentManager from '../instruments/instrumentManager';
import strategyManager from '../strategy/strategyManager';
import executionManager from '../execution/executionManager';
import positionsStore from '../positions/positionsStore';
import flagWatcher from '../flags/flagWatcher';
import fs from 'fs';
import path from 'path';
import env from '../schemas/env';

dayjs.extend(utc);
dayjs.extend(timezone);

// Set default timezone to IST
dayjs.tz.setDefault('Asia/Kolkata');

export class CronScheduler {
  private cronTasks: cron.ScheduledTask[] = [];

  start() {
    logger.info('Starting scheduler daemon (Asia/Kolkata IST)...');

    // Task 1: Main trading loop running every minute during market hours (09:15 - 15:30, Mon-Fri)
    // Cron format: minute hour day-of-month month day-of-week
    // Running every 5 minutes during market hours is cleaner, but let's run every 1 minute for faster stoploss checks.
    const tradingTickJob = cron.schedule('* 9-15 * * 1-5', async () => {
      /* istanbul ignore next */
      try {
        await this.handleTradingTick();
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        logger.error(`Error in trading tick: ${msg}`);
      }
    });
    this.cronTasks.push(tradingTickJob);

    // Task 2: Daily scrip master download at 08:30 AM IST (before market opens)
    const scripMasterJob = cron.schedule('30 8 * * 1-5', async () => {
      /* istanbul ignore next */
      try {
        if (flagWatcher.isKillSwitched() || flagWatcher.isDoneForThisWeek()) {
          logger.info(
            'Trading paused (kill switch or weekly lockout active). Skipping instrument master download.',
          );
          return;
        }
        logger.info('Scheduled job: Downloading instrument master...');
        await sessionManager.login();
        await instrumentManager.loadInstruments(true);
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        logger.error(`Failed to refresh instrument master: ${msg}`);
      }
    });
    this.cronTasks.push(scripMasterJob);

    // Task 2b: Daily initialization at 08:40 AM IST (login, refresh instrument cache, check and log India VIX)
    const initializationJob = cron.schedule('40 8 * * 1-5', async () => {
      /* istanbul ignore next */
      try {
        if (flagWatcher.isKillSwitched() || flagWatcher.isDoneForThisWeek()) {
          logger.info(
            'Trading paused (kill switch or weekly lockout active). Skipping 08:40 AM IST initialization.',
          );
          return;
        }
        logger.info('Scheduled job: Running 08:40 AM IST initialization script...');
        logger.info('Logging in to SmartAPI...');
        await sessionManager.login();

        logger.info('Updating scriptmaster / instrument list...');
        await instrumentManager.loadInstruments(true);

        logger.info('Fetching India VIX...');
        const { vix } = await strategyManager.checkVix();
        logger.info(`Initialization complete. India VIX is ready: ${vix}`);
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        logger.error(`Failed 08:40 AM IST initialization: ${msg}`);
      }
    });
    this.cronTasks.push(initializationJob);

    // Task 2c: Daily margin utilization refresh at 09:20 AM IST (Mon-Fri)
    const marginRefreshJob = cron.schedule('20 9 * * 1-5', async () => {
      /* istanbul ignore next */
      try {
        if (flagWatcher.isKillSwitched() || flagWatcher.isDoneForThisWeek()) {
          logger.info(
            'Trading paused (kill switch or weekly lockout active). Skipping daily margin refresh.',
          );
          return;
        }
        logger.info('Scheduled job: Refreshing margin utilized for open positions...');
        const isPaper = flagWatcher.isPaperMode();
        const currentWeek = positionsStore.getCurrentWeekString();

        await executionManager.updateMarginUtilized('NIFTY', currentWeek, isPaper);
        if (env.SENSEX_EXPIRY_ENABLED) {
          await executionManager.updateMarginUtilized('SENSEX', currentWeek, isPaper);
        }
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        logger.error(`Failed daily margin refresh: ${msg}`);
      }
    });
    this.cronTasks.push(marginRefreshJob);

    // Task 3: Daily cleanup job at midnight
    const cleanupJob = cron.schedule('0 0 * * *', () => {
      /* istanbul ignore next */
      try {
        this.runDailyCleanup();
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        logger.error(`Error in daily cleanup: ${msg}`);
      }
    });
    this.cronTasks.push(cleanupJob);

    // Task 4: Weekly lockout flag auto-clear job at 16:00 IST on Tuesdays (cron: '0 16 * * 2')
    const lockoutClearJob = cron.schedule('0 16 * * 2', () => {
      /* istanbul ignore next */
      try {
        logger.info('Scheduled job: Auto-clearing weekly lockout flag done-for-this-week...');
        const lockoutPath = path.resolve(process.cwd(), 'done-for-this-week');
        if (fs.existsSync(lockoutPath)) {
          fs.unlinkSync(lockoutPath);
          logger.info('Successfully deleted done-for-this-week weekly lockout flag.');
        } else {
          logger.info('No done-for-this-week weekly lockout flag found to delete.');
        }
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        logger.error(`Error in weekly lockout flag auto-clear: ${msg}`);
      }
    });
    this.cronTasks.push(lockoutClearJob);

    logger.info('Scheduler started successfully.');
  }

  stop() {
    this.cronTasks.forEach((task) => task.stop());
    logger.info('Scheduler stopped.');
  }

  async handleTradingTick() {
    const isPaper = flagWatcher.isPaperMode();
    const isKill = flagWatcher.isKillSwitched();
    const isLockout = flagWatcher.isDoneForThisWeek();

    // Time-based checks in IST
    const now = dayjs().tz('Asia/Kolkata');
    const minutesSinceMidnight = now.hour() * 60 + now.minute();

    // Market hours are 09:15 to 15:30 (555 to 930 minutes)
    if (minutesSinceMidnight < 555 || minutesSinceMidnight > 930) {
      return; // Outside market hours
    }

    if (isKill || isLockout) {
      logger.info('Trading paused (kill switch or weekly lockout active).');
      return;
    }

    // Run NIFTY trading tick (Entry: Wed, Exit: Tue)
    await this.processUnderlyingTick('NIFTY', 3, 2, now, minutesSinceMidnight, isPaper);

    // Run SENSEX trading tick (Entry: Fri, Exit: Thu)
    if (env.SENSEX_EXPIRY_ENABLED) {
      await this.processUnderlyingTick('SENSEX', 5, 4, now, minutesSinceMidnight, isPaper);
    }
  }

  async processUnderlyingTick(
    underlying: string,
    entryDay: number,
    exitDay: number,
    now: dayjs.Dayjs,
    minutesSinceMidnight: number,
    isPaper: boolean,
  ) {
    const currentWeek = positionsStore.getCurrentWeekString();
    const currentPosition = positionsStore.readPosition(underlying, currentWeek, isPaper);
    const dayOfWeek = now.day();

    // 1. Entry Logic
    if (dayOfWeek === entryDay) {
      if (minutesSinceMidnight >= 570) {
        // After 09:30 AM IST
        // Check if we should entry
        if (!currentPosition || currentPosition.week !== currentWeek) {
          // No position exists at all or it belongs to a different week, run entry
          await this.attemptEntry(underlying, currentWeek);
        } else if (currentPosition.status === 'skipped') {
          // Already skipped this week, do nothing
          return;
        } else if (currentPosition.status === 'open') {
          // Position is already open, monitor PnL
          await executionManager.monitorPnl(underlying, currentWeek, isPaper);
        }
      }
    }

    // 2. Monitoring Logic
    const relDay = (dayOfWeek - entryDay + 7) % 7;
    const isMonitoringDay =
      (relDay === 0 && minutesSinceMidnight >= 570) ||
      (relDay === 6 && minutesSinceMidnight < 915) ||
      (relDay >= 1 && relDay <= 5);

    if (isMonitoringDay && currentPosition && currentPosition.status === 'open') {
      await executionManager.monitorPnl(underlying, currentWeek, isPaper);
    }

    // 3. Exit Logic
    if (dayOfWeek === exitDay && minutesSinceMidnight >= 915 && minutesSinceMidnight <= 930) {
      if (currentPosition && currentPosition.status === 'open') {
        logger.info(
          `Scheduled exit time reached for ${underlying} (${now.format('dddd')} 15:15 IST). Closing position...`,
        );
        await executionManager.executeExit(underlying, currentWeek, isPaper);
      }
    }
  }

  private async attemptEntry(underlying: string, week: string) {
    const isPaper = flagWatcher.isPaperMode();

    // Login to SmartAPI first
    await sessionManager.login();
    await instrumentManager.loadInstruments();

    const { passed, vix } = await strategyManager.checkVix();
    if (!passed) {
      logger.warn(`VIX check failed (VIX: ${vix}). Skipping entry for ${underlying} this week.`);
      positionsStore.setWeeklySkipState(underlying, week, isPaper, true);
      return;
    }

    // Build the basket (skip liquidity checks based on env configuration)
    const basket = await strategyManager.buildBasket(underlying, env.SKIP_LIQUIDITY_CHECK);
    if (!basket) {
      logger.error(`Failed to construct ${underlying} basket. Skipping entry.`);
      return;
    }

    await executionManager.executeEntry(underlying, basket);
  }

  runDailyCleanup() {
    logger.info('Starting daily log and position data retention cleanup...');
    const retentionMonths = 1;
    const logDir = path.resolve(process.cwd(), 'logs');
    const cutOffDate = dayjs().subtract(retentionMonths, 'month');

    // Cleanup daily log files
    if (fs.existsSync(logDir)) {
      const files = fs.readdirSync(logDir);
      const todayStr = dayjs().format('YYYY-MM-DD');

      for (const file of files) {
        if (!file.endsWith('.log')) continue;
        const filePath = path.join(logDir, file);
        const fileBase = path.basename(file, '.log');

        // Never delete today's log file
        if (fileBase === todayStr) continue;

        const fileDate = dayjs(fileBase, 'YYYY-MM-DD');
        if (fileDate.isValid() && fileDate.isBefore(cutOffDate)) {
          fs.unlinkSync(filePath);
          logger.info(`Deleted old daily log file: ${filePath}`);
        }
      }
    }

    // Cleanup week-files in PositionsStore
    positionsStore.cleanupOldFiles(retentionMonths);
    logger.info('Daily cleanup complete.');
  }
}

export const cronScheduler = new CronScheduler();
export default cronScheduler;
