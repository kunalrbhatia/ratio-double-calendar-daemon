import dotenv from 'dotenv';
import path from 'path';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Load environment variables from project root .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

dayjs.extend(utc);
dayjs.extend(timezone);

import sessionManager from '../auth/session';
import instrumentManager from '../instruments/instrumentManager';
import flagWatcher from '../flags/flagWatcher';
import logger from '../logging/logger';

async function main() {
  logger.info('===================================================');
  logger.info('Starting daily prep script (updating SmartAPI session & Instruments)...');
  logger.info('===================================================');

  try {
    // 1. Force a fresh login to update the smartapi session cache
    logger.info('Forcing a fresh SmartAPI login...');
    await sessionManager.login();

    // 2. Force download the scrip master and parse/cache it
    logger.info('Forcing download and cache of OpenAPIScripMaster...');
    await instrumentManager.loadInstruments(true);

    // 3. Clear weekly lockout flags on entry days (Wednesday for NIFTY, Friday for SENSEX)
    const now = dayjs().tz('Asia/Kolkata');
    const dayOfWeek = now.day();
    if (dayOfWeek === 3) {
      flagWatcher.clearDoneForThisWeek('NIFTY');
      logger.info('Daily prep (Wednesday): Cleared NIFTY weekly lockout flag.');
    }
    if (dayOfWeek === 5) {
      flagWatcher.clearDoneForThisWeek('SENSEX');
      logger.info('Daily prep (Friday): Cleared SENSEX weekly lockout flag.');
    }

    logger.info('===================================================');
    logger.info('Daily preparation completed successfully! Market ready.');
    logger.info('===================================================');
    process.exit(0);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(`Daily preparation failed: ${msg}`);
    process.exit(1);
  }
}

main();
