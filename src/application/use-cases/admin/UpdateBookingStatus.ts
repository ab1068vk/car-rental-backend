//src/application/use-cases/admin/UpdateBookingStatus.ts

import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { BookingStatus } from '../../../domain/entities/Booking';
import { UpdateBookingStatusDTO, BookingResponseDTO } from '../../dtos/BookingDTOs';

export class UpdateBookingStatus {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async execute(bookingId: string, dto: UpdateBookingStatusDTO): Promise<BookingResponseDTO> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new Error('Booking not found');
    }

    // Can only confirm or decline pending booking
    if (booking.status !== BookingStatus.PENDING) {
      throw new Error(
        `Can only confirm or decline pending bookings. Current status: ${booking.status}`,
      );
    }

    const newStatus =
      dto.status === 'CONFIRMED' ? BookingStatus.CONFIRMED : BookingStatus.DECLINED;

    const updated = await this.bookingRepository.updateStatus(bookingId, newStatus);

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