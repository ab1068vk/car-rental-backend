// tests/unit/use-cases/admin/GetAnalytics.test.ts

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GetAnalytics } from '../../../../src/application/use-cases/admin/GetAnalytics';
import { BookingStatus, Booking } from '../../../../src/domain/entities/Booking';
import { User } from '../../../../src/domain/entities/User';
import { Car } from '../../../../src/domain/entities/Car';

const mockUserRepository = {
  findById: jest.fn<(id: string) => Promise<User | null>>(),
  findByEmail: jest.fn<(email: string) => Promise<User | null>>(),
  create: jest.fn<(data: any) => Promise<User>>(),
  update: jest.fn<(id: string, data: Partial<User>) => Promise<User>>(),
  findAll: jest.fn<() => Promise<User[]>>(),
  count: jest.fn<() => Promise<number>>(),
};

const mockCarRepository = {
  findById: jest.fn<(id: string) => Promise<Car | null>>(),
  findAll: jest.fn<() => Promise<Car[]>>(),
  findAvailable: jest.fn<
    (startDate: Date, endDate: Date, filters?: any) => Promise<Car[]>
  >(),
  create: jest.fn<(data: any) => Promise<Car>>(),
  update: jest.fn<(id: string, data: Partial<Car>) => Promise<Car>>(),
  delete: jest.fn<(id: string) => Promise<void>>(),
  count: jest.fn<() => Promise<number>>(),
};

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

describe('GetAnalytics Use Case', () => {
  let getAnalytics: GetAnalytics;

  beforeEach(() => {
    jest.clearAllMocks();
    getAnalytics = new GetAnalytics(
      mockUserRepository as any,
      mockCarRepository as any,
      mockBookingRepository as any,
    );
  });

  it('should return correct analytics totals', async () => {
    mockUserRepository.count.mockResolvedValue(42);
    mockCarRepository.count.mockResolvedValue(10);
    mockBookingRepository.count.mockResolvedValue(100);
    mockBookingRepository.countByStatus
      .mockResolvedValueOnce(20)
      .mockResolvedValueOnce(50)
      .mockResolvedValueOnce(15)
      .mockResolvedValueOnce(15);

    const result = await getAnalytics.execute();

    expect(result.users.total).toBe(42);
    expect(result.cars.total).toBe(10);
    expect(result.bookings.total).toBe(100);
    expect(result.bookings.pending).toBe(20);
    expect(result.bookings.confirmed).toBe(50);
    expect(result.bookings.declined).toBe(15);
    expect(result.bookings.cancelled).toBe(15);
  });

  it('should run all count queries in parallel (Promise.all)', async () => {
    mockUserRepository.count.mockResolvedValue(0);
    mockCarRepository.count.mockResolvedValue(0);
    mockBookingRepository.count.mockResolvedValue(0);
    mockBookingRepository.countByStatus.mockResolvedValue(0);

    await getAnalytics.execute();

    expect(mockBookingRepository.countByStatus).toHaveBeenCalledWith(BookingStatus.PENDING);
    expect(mockBookingRepository.countByStatus).toHaveBeenCalledWith(BookingStatus.CONFIRMED);
    expect(mockBookingRepository.countByStatus).toHaveBeenCalledWith(BookingStatus.DECLINED);
    expect(mockBookingRepository.countByStatus).toHaveBeenCalledWith(BookingStatus.CANCELLED);
    expect(mockBookingRepository.countByStatus).toHaveBeenCalledTimes(4);
  });

  it('should return zero counts when system is empty', async () => {
    mockUserRepository.count.mockResolvedValue(0);
    mockCarRepository.count.mockResolvedValue(0);
    mockBookingRepository.count.mockResolvedValue(0);
    mockBookingRepository.countByStatus.mockResolvedValue(0);

    const result = await getAnalytics.execute();

    expect(result.users.total).toBe(0);
    expect(result.bookings.total).toBe(0);
  });
});