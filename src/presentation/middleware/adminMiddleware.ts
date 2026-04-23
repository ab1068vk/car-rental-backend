// src/presentation/middleware/adminMiddleware.ts
//Ensure only teh admins users can access admin routes
import { Request, Response, NextFunction } from 'express';
import logger from '../../infrastructure/logging/logger';

/**
 * Middleware Require the authenticated user to have Admin role.
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  //req.user is set by the authenticate middleware
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  if (req.user.role !== 'ADMIN') {
    logger.warn(
      `Unauthorized admin access attempt by userId=${req.user.userId}`,
    );
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
    return;
  }

  next();
};