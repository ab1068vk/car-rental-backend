// src/presentation/controllers/AuthController.ts
//Handles HTTP requests for authentication routes.
//Delegates business logic to use cases
import { Request, Response, NextFunction } from 'express';
import { RegisterUser } from '../../application/use-cases/auth/RegisterUser';
import { LoginUser } from '../../application/use-cases/auth/LoginUser';
import { GetCurrentUser } from '../../application/use-cases/auth/GetCurrentUser';
import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';
import { PasswordService } from '../../infrastructure/auth/PasswordService';
import { JwtService } from '../../infrastructure/auth/JwtService';
import logger from '../../infrastructure/logging/logger';

export class AuthController {
  /**
   * POST /api/auth/register
   * Register a new user account.
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new RegisterUser(
        new UserRepository(),
        new PasswordService(),
        new JwtService(),
        process.env.ADMIN_SECRET || '',
      );

      const result = await useCase.execute(req.body);

      logger.info(`New user registered: ${result.user.email}`);

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: result,
      });
    } catch (error) {
      next(error);  //Pass to global error handler
    }
  }

  /**
   *POST /api/auth/login
   *Loging in with email and password.
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new LoginUser(
        new UserRepository(),
        new PasswordService(),
        new JwtService(),
      );

      const result = await useCase.execute(req.body);

      logger.info(`User logged in: ${result.user.email}`);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   *GET /api/auth/me
   *Get the currently logged-in user's profile.
   *Protected route requires a valid JWT.
   */
  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new GetCurrentUser(new UserRepository());

      //req.user.userId is set by the authenticate middleware
      const result = await useCase.execute(req.user!.userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}