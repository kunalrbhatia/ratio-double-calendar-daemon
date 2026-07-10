import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from project root .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import sessionManager from '../auth/session';
import instrumentManager from '../instruments/instrumentManager';
import strategyManager from '../strategy/strategyManager';
import logger from '../logging/logger';

async function main() {
  const underlying = (process.argv[2] || 'NIFTY').toUpperCase();
  logger.info(`===================================================`);
  logger.info(`Generating order basket for ${underlying}...`);
  logger.info(`===================================================`);

  try {
    try {
      sessionManager.getJwtToken();
    } catch {
      logger.info('No active session found. Logging in...');
      await sessionManager.login();
    }

    logger.info('Loading instruments database...');
    await instrumentManager.loadInstruments();

    const basket = await strategyManager.buildBasket(underlying);
    if (!basket) {
      logger.error('Failed to construct strategy basket.');
      process.exit(1);
    }

    const outputDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFile = path.resolve(outputDir, `basket-${underlying.toLowerCase()}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(basket, null, 2), 'utf-8');

    logger.info(`===================================================`);
    logger.info(`Successfully generated basket and saved to: ${outputFile}`);
    logger.info(`===================================================`);
    process.exit(0);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(`Basket generation failed: ${msg}`);
    process.exit(1);
  }
}

main();
