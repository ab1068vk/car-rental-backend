//src/presentation/middleware/errorMiddleware.ts
//Catches any errors thrown in controllers and returns a clean JSON response
import { Request, Response, NextFunction } from 'express';
import logger from '../../infrastructure/logging/logger';

/**
 *Global error handling middleware.
 *Express recognizes this as an error handler because it has 4 parameters 
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  //Log the full error with stack trace
  logger.error(`Unhandled error on ${req.method} ${req.path}: ${err.message}`, {
    stack: err.stack,
  });

  //Determine HTTP status code based on the error message
  let statusCode = 500;
  const message = err.message || 'Internal server error';

  if (message.includes('not found') || message.includes('Not found')) {
    statusCode = 404;
  } else if (
    message.includes('already exists') ||
    message.includes('Invalid') ||
    message.includes('must be') ||
    message.includes('cannot') ||
    message.includes('required')
  ) {
    statusCode = 400;
  } else if (
    message.includes('permission') ||
    message.includes('Access denied')
  ) {
    statusCode = 403;
  } else if (message.includes('Invalid email or password')) {
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message,
    //Only show stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 *Handle 404
 *Register this afters all routes but before errorHandler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  });
};