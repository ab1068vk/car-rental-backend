// src/application/use-cases/booking/GetUserBookings.ts

import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { BookingResponseDTO } from '../../dtos/BookingDTOs';

export class GetUserBookings {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  /** Get all bookings which is belonging to specific registered user */
  async execute(userId: string): Promise<BookingResponseDTO[]> {
    const bookings = await this.bookingRepository.findByUserId(userId);

    return bookings.map((booking) => ({
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
    }));
  }
}