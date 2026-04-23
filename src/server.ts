import app from './app';
import logger from './infrastructure/logging/logger';
import prisma from './infrastructure/database/prismaClient';

const PORT = Number(process.env.PORT) || 3000;
let server: ReturnType<typeof app.listen>;
let isShuttingDown = false;

async function startServer(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');

    server = app.listen(PORT, () => {
      logger.info(`Car Rental API running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info(`Received ${signal} — shutting down gracefully...`);

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }

    await prisma.$disconnect();
    logger.info('✅ Database disconnected');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', () => {
  shutdown('SIGTERM').catch((error) => {
    logger.error('Shutdown failure:', error);
    process.exit(1);
  });
});

process.on('SIGINT', () => {
  shutdown('SIGINT').catch((error) => {
    logger.error('Shutdown failure:', error);
    process.exit(1);
  });
});

process.on('unhandledRejection', async (reason) => {
  logger.error('Unhandled Rejection:', reason);
  await shutdown('unhandledRejection');
});

process.on('uncaughtException', async (error) => {
  logger.error('Uncaught Exception:', error);
  await shutdown('uncaughtException');
});

startServer();