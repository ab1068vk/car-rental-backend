//src/infrastructure/database/repositories/BookingRepository.ts

import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { Booking, BookingStatus } from '../../../domain/entities/Booking';
import prisma from '../prismaClient';

export class BookingRepository implements IBookingRepository {
  /**Convert a Prisma record to a domain Booking entity */
  private toDomain(record: any): Booking {
    return new Booking(
      record.id,
      record.carId,
      record.userId,
      record.guestName,
      record.guestEmail,
      record.guestPhone,
      record.isGuest,
      record.startDate,
      record.endDate,
      record.totalPrice,
      record.status as BookingStatus,
      record.notes,
      record.createdAt,
      record.updatedAt,
    );
  }

  async findById(id: string): Promise<Booking | null> {
    const record = await prisma.booking.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const records = await prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(this.toDomain.bind(this));
  }

  async findAll(): Promise<Booking[]> {
    const records = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return records.map(this.toDomain.bind(this));
  }

  async create(
    data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'isCancellable' | 'getDurationDays'>,
  ): Promise<Booking> {
    const record = await prisma.booking.create({ data });
    return this.toDomain(record);
  }

  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    const record = await prisma.booking.update({
      where: { id },
      data: { status },
    });
    return this.toDomain(record);
  }

  async hasOverlappingBooking(
    carId: string,
    startDate: Date,
    endDate: Date,
    excludeBookingId?: string,
  ): Promise<boolean> {
    const count = await prisma.booking.count({
      where: {
        carId,
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        AND: [
          { startDate: { lt: endDate } },
          { endDate: { gt: startDate } },
        ],
      },
    });
    return count > 0;
  }

  async count(): Promise<number> {
    return prisma.booking.count();
  }

  async countByStatus(status: BookingStatus): Promise<number> {
    return prisma.booking.count({ where: { status } });
  }
}