import http from 'http';
import env from './schemas/env';
import logger from './logging/logger';
import sessionManager from './auth/session';
import instrumentManager from './instruments/instrumentManager';
import cronScheduler from './scheduler/cronScheduler';
import flagWatcher from './flags/flagWatcher';

const PORT = env.PORT;

async function bootstrap() {
  logger.info('===================================================');
  logger.info('Initializing Ratio Double Calendar Spread Daemon...');
  logger.info(`Environment: ${env.NODE_ENV}`);
  logger.info(`Paper Mode: ${flagWatcher.isPaperMode() ? 'ACTIVE' : 'INACTIVE'}`);
  logger.info(`Kill Switch: ${flagWatcher.isKillSwitched() ? 'ACTIVE' : 'INACTIVE'}`);
  logger.info('===================================================');

  try {
    // 1. Initial SmartAPI Auth
    await sessionManager.login();

    // 2. Load Instruments Cache
    await instrumentManager.loadInstruments();

    // 3. Initialize SmartStream WebSocket
    const { smartStream } = await import('./execution/smartStream');
    const { positionsStore } = await import('./positions/positionsStore');

    smartStream.connect((_tick) => {
      // Real-time tick callback - cache is updated automatically in smartStream
    });

    const isPaper = flagWatcher.isPaperMode();
    const currentWeek = positionsStore.getCurrentWeekString();
    const currentPosition = positionsStore.readPosition(currentWeek, isPaper);
    if (currentPosition && currentPosition.status === 'open') {
      const tokens = currentPosition.orders.map((o) => o.symboltoken);
      smartStream.subscribe(tokens);
      logger.info(`Resubscribed SmartStream to active position tokens: ${tokens.join(', ')}`);
    }

    // 4. Start Scheduler
    cronScheduler.start();

    // 4. Create simple HTTP server for health monitoring (built-in, no express needed)
    const server = http.createServer((req, res) => {
      if (req.url === '/health' || req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            status: 'UP',
            timestamp: new Date().toISOString(),
            paperMode: flagWatcher.isPaperMode(),
            killSwitched: flagWatcher.isKillSwitched(),
            nodeVersion: process.version,
            env: env.NODE_ENV,
          }),
        );
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
      }
    });

    server.listen(PORT, () => {
      logger.info(`Health check server listening on port ${PORT}`);
    });

    // Graceful Shutdown
    const shutdown = () => {
      logger.info('Shutting down gracefully...');
      cronScheduler.stop();
      smartStream.disconnect();
      server.close(() => {
        logger.info('HTTP server closed. Process exiting.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error(`Critical error during bootstrap: ${msg}`);
    process.exit(1);
  }
}

bootstrap();
