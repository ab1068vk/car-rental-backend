// src/application/use-cases/booking/GetBookingById.ts

import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { BookingResponseDTO } from '../../dtos/BookingDTOs';

export class GetBookingById {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  /**
   *booking to retrieve
   *requesting user's ID 
   *Admins can view any booking, users only their own
   */
  async execute(
    bookingId: string,
    userId: string,
    isAdmin: boolean,
  ): Promise<BookingResponseDTO> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    //Authorization: regular users can only view their own bookings
    if (!isAdmin && booking.userId !== userId) {
      throw new Error('You do not have permission to view this booking');
    }

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