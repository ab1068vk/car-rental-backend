// src/presentation/controllers/BookingController.ts

import { Request, Response, NextFunction } from 'express';
import { CreateBooking } from '../../application/use-cases/booking/CreateBooking';
import { GetBookingById } from '../../application/use-cases/booking/GetBookingById';
import { GetUserBookings } from '../../application/use-cases/booking/GetUserBookings';
import { CancelBooking } from '../../application/use-cases/booking/CancelBooking';
import { CarRepository } from '../../infrastructure/database/repositories/CarRepository';
import { BookingRepository } from '../../infrastructure/database/repositories/BookingRepository';
import logger from '../../infrastructure/logging/logger';

export class BookingController {
  /**
   * POST /api/bookings
   * Create a booking as a registered user 
   */
  static async createUserBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new CreateBooking(new CarRepository(), new BookingRepository());
      const booking = await useCase.executeForUser(req.user!.userId, req.body);

      logger.info(`Booking created: ${booking.id} by user ${req.user!.userId}`);

      res.status(201).json({
        success: true,
        message: 'Booking created successfully. Awaiting confirmation.',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   *POST /api/bookings/guest
   *Create a booking as a guest 
   */
  static async createGuestBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new CreateBooking(new CarRepository(), new BookingRepository());
      const booking = await useCase.executeForGuest(req.body);

      logger.info(`Guest booking created: ${booking.id} for ${booking.guestEmail}`);

      res.status(201).json({
        success: true,
        message: 'Guest booking created. Awaiting confirmation.',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/bookings/my
   */
  static async getMyBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new GetUserBookings(new BookingRepository());
      const bookings = await useCase.execute(req.user!.userId);

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
   *GET /api/bookings/:id
   *Get a specific booking with an Id
   */
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new GetBookingById(new BookingRepository());
      const isAdmin = req.user?.role === 'ADMIN';
      const id = req.params.id;

      if (!id || Array.isArray(id)) {
          throw new Error('Invalid booking ID');
      }

      const booking = await useCase.execute(id, req.user!.userId, isAdmin);

      res.status(200).json({ success: true, data: booking });
    } catch (error) {
      next(error);
    }
  }

  /**
   *PUT /api/bookings/:id/cancel
   *Cancel a booking
   */
  static async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new CancelBooking(new BookingRepository());
      const isAdmin = req.user?.role === 'ADMIN';
      const id = req.params.id;

      if (!id || Array.isArray(id)) {
          throw new Error('Invalid booking ID');
      }

      const booking = await useCase.execute(id, req.user!.userId, isAdmin);

      logger.info(`Booking cancelled: ${booking.id}`);

      res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }
}