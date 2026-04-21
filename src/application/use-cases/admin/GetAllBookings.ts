//src/application/use-cases/admin/GetAllBookings.ts

import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { BookingResponseDTO } from '../../dtos/BookingDTOs';

export class GetAllBookings {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  /** Returns all bookings in the system admin use only */
  async execute(): Promise<BookingResponseDTO[]> {
    const bookings = await this.bookingRepository.findAll();

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