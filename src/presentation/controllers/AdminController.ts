// src/presentation/controllers/AdminController.ts

import { Request, Response, NextFunction } from 'express';
import { GetAllBookings } from '../../application/use-cases/admin/GetAllBookings';
import { UpdateBookingStatus } from '../../application/use-cases/admin/UpdateBookingStatus';
import { GetAllUsers } from '../../application/use-cases/admin/GetAllUsers';
import { GetAnalytics } from '../../application/use-cases/admin/GetAnalytics';
import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';
import { CarRepository } from '../../infrastructure/database/repositories/CarRepository';
import { BookingRepository } from '../../infrastructure/database/repositories/BookingRepository';
import logger from '../../infrastructure/logging/logger';

export class AdminController {
  /**
   *GET /api/admin/bookings
   *Get all of the bookings in the system
   */
  static async getAllBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new GetAllBookings(new BookingRepository());
      const bookings = await useCase.execute();

      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   *PUT /api/admin/bookings/:id/status
   *Confirm or decline a booking
   */
  static async updateBookingStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new UpdateBookingStatus(new BookingRepository());
      const id = req.params.id;

      if (!id || Array.isArray(id)) {
        throw new Error('Invalid booking ID');
      }

      const booking = await useCase.execute(id, req.body);
      logger.info(
        `Admin ${req.user!.userId} updated booking ${req.params.id} to ${req.body.status}`,
      );

      res.status(200).json({
        success: true,
        message: `Booking ${req.body.status.toLowerCase()} successfully`,
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   *GET /api/admin/users
   *Get all registered users
   */
  static async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new GetAllUsers(new UserRepository());
      const users = await useCase.execute();

      res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   *GET /api/admin/analytics
   *Get site statistics for the admin dashboard
   */
  static async getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new GetAnalytics(
        new UserRepository(),
        new CarRepository(),
        new BookingRepository(),
      );
      const analytics = await useCase.execute();

      res.status(200).json({ success: true, data: analytics });
    } catch (error) {
      next(error);
    }
  }
}