//src/infrastructure/database/prismaClient.ts
//Prisma Client
//Creates a single Prisma client instance used throughout the app

import { PrismaClient } from '@prisma/client';
import logger from '../logging/logger';

//Useing a global variable in development to prevent multiple instances
//due to hot-reloading 
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prisma: PrismaClient =
  global.__prisma ||
  new PrismaClient({
    log: [
      //Log slow queries in development for debugging
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
    ],
  });

//Log slow queries 
if (process.env.NODE_ENV === 'development') {
  (prisma as any).$on('query', (e: any) => {
    if (e.duration > 500) {
      //Log queries slower than 500ms
      logger.warn(`Slow query (${e.duration}ms): ${e.query}`);
    }
  });
}

//Save instance to global in development to prevent hot-reload issues
if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

export default prisma;