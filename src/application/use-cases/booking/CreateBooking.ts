// src/application/use-cases/booking/CreateBooking.ts
// =============================================================
// USE CASE: Create Booking
// Handles booking creation for both registered users and guests.
// =============================================================

import { ICarRepository } from '../../../domain/repositories/ICarRepository';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { BookingStatus } from '../../../domain/entities/Booking';
import {
  CreateBookingDTO,
  CreateGuestBookingDTO,
  BookingResponseDTO,
} from '../../dtos/BookingDTOs';

export class CreateBooking {
  constructor(
    private readonly carRepository: ICarRepository,
    private readonly bookingRepository: IBookingRepository,
  ) {}

  /**
   * Creates  booking for a registered user
   */
  async executeForUser(
    userId: string,
    dto: CreateBookingDTO,
  ): Promise<BookingResponseDTO> {
    return this.createBooking({
      carId: dto.carId,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      notes: dto.notes || undefined,
      userId,
      isGuest: false,
    });
  }

  /**
   * Create a booking for a guest 
   */
  async executeForGuest(dto: CreateGuestBookingDTO): Promise<BookingResponseDTO> {
    return this.createBooking({
      carId: dto.carId,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      notes: dto.notes || undefined,
      guestName: dto.guestName,
      guestEmail: dto.guestEmail,
      guestPhone: dto.guestPhone,
      isGuest: true,
    });
  }

  /**
   * Shared booking creation logic
   */
  private async createBooking(params: {
    carId: string;
    startDate: Date;
    endDate: Date;
    notes?: string;
    userId?: string;
    isGuest: boolean;
    guestName?: string;
    guestEmail?: string;
    guestPhone?: string;
  }): Promise<BookingResponseDTO> {
    const { carId, startDate, endDate } = params;

    //Validate dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date format');
    }

    if (endDate <= startDate) {
      throw new Error('End date must be after start date');
    }

    if (startDate < new Date()) {
      throw new Error('Start date cannot be in the past');
    }

    //Verify the car exists
    const car = await this.carRepository.findById(carId);
    if (!car) {
      throw new Error('Car not found');
    }

    if (!car.available) {
      throw new Error('This car is not available for rental');
    }

    //Check for overlapping bookings this is to prevent double booking)
    const hasOverlap = await this.bookingRepository.hasOverlappingBooking(
      carId,
      startDate,
      endDate,
    );

    if (hasOverlap) {
      throw new Error(
        'This car is already booked for the selected dates. Please choose different dates.',
      );
    }

    //Calculate total price using the car entity's business logic
    const totalPrice = car.calculateTotalPrice(startDate, endDate);

    //Create the booking
    const booking = await this.bookingRepository.create({
      carId,
      userId: params.userId || null,
      guestName: params.guestName || null,
      guestEmail: params.guestEmail || null,
      guestPhone: params.guestPhone || null,
      isGuest: params.isGuest,
      startDate,
      endDate,
      totalPrice,
      status: BookingStatus.PENDING,  //starts as pending
      notes: params.notes || null,
    });

    return {
      id: booking.id,
      carId: booking.carId,
      userId: booking.userId,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone,
      isGuest: booking.isGuest,
      startDate: booking.startDate,
      endDate: booking.endDate,
      totalPrice: booking.totalPrice,
      status: booking.status,
      notes: booking.notes,
      createdAt: booking.createdAt,
    };
  }
}