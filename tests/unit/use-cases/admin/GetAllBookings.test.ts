// tests/unit/use-cases/admin/GetAllBookings.test.ts

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GetAllBookings } from '../../../../src/application/use-cases/admin/GetAllBookings';
import { Booking, BookingStatus } from '../../../../src/domain/entities/Booking';

const mockBookingRepository = {
  findById: jest.fn<(id: string) => Promise<Booking | null>>(),
  findByUserId: jest.fn<(userId: string) => Promise<Booking[]>>(),
  findAll: jest.fn<() => Promise<Booking[]>>(),
  create: jest.fn<(data: any) => Promise<Booking>>(),
  updateStatus: jest.fn<(id: string, status: BookingStatus) => Promise<Booking>>(),
  hasOverlappingBooking: jest.fn<
    (
      carId: string,
      startDate: Date,
      endDate: Date,
      excludeBookingId?: string
    ) => Promise<boolean>
  >(),
  count: jest.fn<() => Promise<number>>(),
  countByStatus: jest.fn<(status: BookingStatus) => Promise<number>>(),
};

const fakeBooking = new Booking(
  'booking-1',
  'car-1',
  'user-1',
  null,
  null,
  null,
  false,
  new Date('2026-09-01'),
  new Date('2026-09-05'),
  240.0,
  BookingStatus.PENDING,
  null,
  new Date(),
  new Date(),
);

describe('GetAllBookings Use Case', () => {
  let getAllBookings: GetAllBookings;

  beforeEach(() => {
    jest.clearAllMocks();
    getAllBookings = new GetAllBookings(mockBookingRepository as any);
  });

  it('should return all bookings', async () => {
    mockBookingRepository.findAll.mockResolvedValue([fakeBooking]);

    const result = await getAllBookings.execute();

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('booking-1');
    expect(mockBookingRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return an empty array when no bookings exist', async () => {
    mockBookingRepository.findAll.mockResolvedValue([]);

    const result = await getAllBookings.execute();

    expect(result).toHaveLength(0);
  });

  it('should map bookings to response DTOs correctly', async () => {
    mockBookingRepository.findAll.mockResolvedValue([fakeBooking]);

    const result = await getAllBookings.execute();

    expect(result[0]).toMatchObject({
      id: 'booking-1',
      carId: 'car-1',
      userId: 'user-1',
      status: BookingStatus.PENDING,
      totalPrice: 240.0,
      isGuest: false,
    });
  });
});