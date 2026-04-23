// src/presentation/middleware/authMiddleware.ts
//Verifies the JWT token on protected routes
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../infrastructure/auth/JwtService';
import logger from '../../infrastructure/logging/logger';

//Extend the Express Request type to include our user payload
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

const jwtService = new JwtService();

/**
 * Middleware: Require a valid JWT token to access the route.
 * Reads the token from the Authorization header: Bearer <token>
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    //Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'No token provided. Please log in.' });
      return;
    }

    const token = authHeader.split(' ')[1]; //Get the token after Bearer 

    //Verify the token
    const decoded = jwtService.verify(token);

    if (!decoded) {
      res.status(401).json({ success: false, message: 'Invalid or expired token. Please log in again.' });
      return;
    }

    //Attach user info to request for downstream use
    req.user = decoded as { userId: string; email: string; role: string };

    logger.info(`Authenticated request: userId=${req.user.userId} ${req.method} ${req.path}`);
    next();

  } catch (error) {
    logger.error('Authentication middleware error:', error);
    res.status(401).json({ success: false, message: 'Authentication failed' });
  }
};