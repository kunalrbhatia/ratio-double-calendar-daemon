import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from project root .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import sessionManager from '../auth/session';
import instrumentManager from '../instruments/instrumentManager';
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
