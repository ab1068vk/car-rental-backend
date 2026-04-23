// tests/unit/use-cases/booking/CreateBooking.test.ts

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { CreateBooking } from '../../../../src/application/use-cases/booking/CreateBooking';
import { Car, CarCategory } from '../../../../src/domain/entities/Car';
import { Booking, BookingStatus } from '../../../../src/domain/entities/Booking';

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

const fakeCar = new Car(
  'car-123',
  'Honda',
  'Civic',
  2023,
  CarCategory.SEDAN,
  60.0,
  5,
  'automatic',
  'gasoline',
  null,
  true,
  new Date(),
  new Date(),
);

const fakeBooking = new Booking(
  'booking-123',
  'car-123',
  'user-123',
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

describe('CreateBooking Use Case', () => {
  let createBooking: CreateBooking;

  beforeEach(() => {
    jest.clearAllMocks();
    createBooking = new CreateBooking(
      mockCarRepository as any,
      mockBookingRepository as any,
    );
  });

  it('should create a booking for a registered user', async () => {
    mockCarRepository.findById.mockResolvedValue(fakeCar);
    mockBookingRepository.hasOverlappingBooking.mockResolvedValue(false);
    mockBookingRepository.create.mockResolvedValue(fakeBooking);

    const result = await createBooking.executeForUser('user-123', {
      carId: 'car-123',
      startDate: '2026-09-01',
      endDate: '2026-09-05',
    });

    expect(result.carId).toBe('car-123');
    expect(result.status).toBe(BookingStatus.PENDING);
    expect(mockBookingRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should throw if car not found', async () => {
    mockCarRepository.findById.mockResolvedValue(null);

    await expect(
      createBooking.executeForUser('user-123', {
        carId: 'nonexistent',
        startDate: '2026-09-01',
        endDate: '2026-09-05',
      }),
    ).rejects.toThrow('Car not found');
  });

  it('should throw if car has overlapping booking', async () => {
    mockCarRepository.findById.mockResolvedValue(fakeCar);
    mockBookingRepository.hasOverlappingBooking.mockResolvedValue(true);

    await expect(
      createBooking.executeForUser('user-123', {
        carId: 'car-123',
        startDate: '2026-09-01',
        endDate: '2026-09-05',
      }),
    ).rejects.toThrow('already booked');
  });

  it('should create a guest booking', async () => {
    mockCarRepository.findById.mockResolvedValue(fakeCar);
    mockBookingRepository.hasOverlappingBooking.mockResolvedValue(false);

    const guestBooking = new Booking(
      'booking-456',
      'car-123',
      null,
      'John Guest',
      'guest@example.com',
      null,
      true,
      new Date('2026-09-01'),
      new Date('2026-09-05'),
      240.0,
      BookingStatus.PENDING,
      null,
      new Date(),
      new Date(),
    );

    mockBookingRepository.create.mockResolvedValue(guestBooking);

    const result = await createBooking.executeForGuest({
      carId: 'car-123',
      startDate: '2026-09-01',
      endDate: '2026-09-05',
      guestName: 'John Guest',
      guestEmail: 'guest@example.com',
    });

    expect(result.isGuest).toBe(true);
    expect(result.userId).toBeNull();
    expect(result.guestName).toBe('John Guest');
  });
});