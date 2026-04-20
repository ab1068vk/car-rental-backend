// src/domain/repositories/IBookingRepository.ts

import { Booking, BookingStatus } from '../entities/Booking';

export interface IBookingRepository {
  /**Find a booking by its ID*/
  findById(id: string): Promise<Booking | null>;

  /**Get all bookings for a specific registered user*/
  findByUserId(userId: string): Promise<Booking[]>;

  /** Get all bookings in the system*/
  findAll(): Promise<Booking[]>;

  /**Create a new booking */
  create(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'isCancellable' | 'getDurationDays'>): Promise<Booking>;

  /**Update a booking's status (admin car: confirm/decline) or cancel */
  updateStatus(id: string, status: BookingStatus): Promise<Booking>;

  /**
   * Check if a car has an double or overlaping booking for the given dates
   * Used to prevent double-booking.
   */
  hasOverlappingBooking(
    carId: string,
    startDate: Date,
    endDate: Date,
    excludeBookingId?: string,
  ): Promise<boolean>;

  /**Count the total bookings in the system */
  count(): Promise<number>;

  /** Count bookings by teh status*/
  countByStatus(status: BookingStatus): Promise<number>;
}