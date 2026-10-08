import app from './app.js';
import { env } from './config/env.js';
import logger from './utils/logger.js';
import { seedDatabase } from './database/seed.js';

let server = null;

const startServer = async () => {
  try {
    // Seed and prepare DB schema
    await seedDatabase();

    server = app.listen(env.PORT, () => {
      logger.info(`=============================================================`);
      logger.info(`🚀 ${env.APP_NAME} active on port ${env.PORT}`);
      logger.info(`📡 API Base URL: http://localhost:${env.PORT}${env.API_PREFIX}`);
      logger.info(`🏥 Health Check: http://localhost:${env.PORT}/health`);
      logger.info(`📚 Swagger Docs: http://localhost:${env.PORT}${env.API_PREFIX}/docs`);
      logger.info(`=============================================================`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Initiating graceful shutdown...`);
  if (server) {
    server.close(() => {
      logger.info('HTTP server closed cleanly. Exiting process.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

if (process.env.NODE_ENV !== 'test') {
  startServer();
}
