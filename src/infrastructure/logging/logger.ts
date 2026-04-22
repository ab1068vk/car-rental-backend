//src/infrastructure/logging/logger.ts
//Logging service

import winston from 'winston';
import path from 'path';

//Define the log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),   // Include stack traces on errors
  winston.format.printf(({ timestamp, level, message, stack }) => {
    //If there's a stack trace, include it
    return stack
      ? `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}`
      : `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  }),
);

//Create the Winston logger instance
const logger = winston.createLogger({
  //Log level from environment variable 
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    //Always log to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),  //olorize console output
        logFormat,
      ),
    }),

    //Log errors to a separate file
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024,  //5MB max file size
      maxFiles: 5,                 //Keep last 5 rotated files
    }),

    // Log all messages to combined log
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
});

//In production, don't print to console 
if (process.env.NODE_ENV === 'production') {
  logger.remove(new winston.transports.Console());
}

export default logger;