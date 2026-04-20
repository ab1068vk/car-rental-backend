// src/application/use-cases/booking/CancelBooking.ts

import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { BookingStatus } from '../../../domain/entities/Booking';
import { BookingResponseDTO } from '../../dtos/BookingDTOs';

export class CancelBooking {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async execute(
    bookingId: string,
    userId: string,
    isAdmin: boolean,
  ): Promise<BookingResponseDTO> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    //Only the owner or an admin can cancel
    if (!isAdmin && booking.userId !== userId) {
      throw new Error('You do not have permission to cancel this booking');
    }

    //Check if the booking is in a cancellable periode
    if (!booking.isCancellable()) {
      throw new Error(
        `Cannot cancel a booking with status: ${booking.status}`,
      );
    }

    const updated = await this.bookingRepository.updateStatus(
      bookingId,
      BookingStatus.CANCELLED,
    );

    return {
      id: updated.id,
      carId: updated.carId,
      userId: updated.userId,
      guestName: updated.guestName,
      guestEmail: updated.guestEmail,
      guestPhone: updated.guestPhone,
      isGuest: updated.isGuest,
      startDate: updated.startDate,
      endDate: updated.endDate,
      totalPrice: updated.totalPrice,
      status: updated.status,
      notes: updated.notes,
      createdAt: updated.createdAt,
    };
  }
}   