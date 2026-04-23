import { describe, it, expect } from '@jest/globals';
import { User, UserRole } from '../../../src/domain/entities/User';
import { Booking, BookingStatus } from '../../../src/domain/entities/Booking';
import { Car, CarCategory } from '../../../src/domain/entities/Car';
describe('User Entity', () => {
  const makeUser = (role = UserRole.USER) =>
    new User('id-1', 'jane@test.com', 'hash', 'Jane', 'Doe', null, role, new Date(), new Date());

  it('should return full name', () => {
    expect(makeUser().fullName).toBe('Jane Doe');
  });

  it('should return false for isAdmin when role is USER', () => {
    expect(makeUser(UserRole.USER).isAdmin()).toBe(false);
  });

  it('should return true for isAdmin when role is ADMIN', () => {
    expect(makeUser(UserRole.ADMIN).isAdmin()).toBe(true);
  });

  it('should return safe object without password', () => {
    const safe = makeUser().toSafeObject();
    expect(safe).not.toHaveProperty('password');
    expect(safe.email).toBe('jane@test.com');
  });
});

describe('Car Entity', () => {
  const makeCar = () =>
    new Car('car-1', 'Toyota', 'Camry', 2023, CarCategory.SEDAN, 100, 5, 'automatic', 'gasoline', null, true, new Date(), new Date());

  it('should return display name', () => {
    expect(makeCar().displayName).toBe('2023 Toyota Camry');
  });

  it('should calculate total price correctly', () => {
    const car = makeCar();
    const start = new Date('2025-09-01');
    const end = new Date('2025-09-05');
    expect(car.calculateTotalPrice(start, end)).toBe(400);
  });

  it('should throw if end date is before start date', () => {
    const car = makeCar();
    const start = new Date('2025-09-05');
    const end = new Date('2025-09-01');
    expect(() => car.calculateTotalPrice(start, end)).toThrow('End date must be after start date');
  });
});

describe('Booking Entity', () => {
  const makeBooking = (status: typeof BookingStatus[keyof typeof BookingStatus]) =>
    new Booking(
      'b-1',
      'car-1',
      'user-1',
      null,
      null,
      null,
      false,
      new Date('2025-09-01'),
      new Date('2025-09-05'),
      400,
      status,
      null,
      new Date(),
      new Date(),
    );

  it('should be active when PENDING', () => {
    expect(makeBooking(BookingStatus.PENDING).isActive()).toBe(true);
  });

  it('should be active when CONFIRMED', () => {
    expect(makeBooking(BookingStatus.CONFIRMED).isActive()).toBe(true);
  });

  it('should not be active when CANCELLED', () => {
    expect(makeBooking(BookingStatus.CANCELLED).isActive()).toBe(false);
  });

  it('should not be active when DECLINED', () => {
    expect(makeBooking(BookingStatus.DECLINED).isActive()).toBe(false);
  });

  it('should be cancellable when PENDING', () => {
    expect(makeBooking(BookingStatus.PENDING).isCancellable()).toBe(true);
  });

  it('should not be cancellable when DECLINED', () => {
    expect(makeBooking(BookingStatus.DECLINED).isCancellable()).toBe(false);
  });

  it('should return correct duration in days', () => {
    expect(makeBooking(BookingStatus.PENDING).getDurationDays()).toBe(4);
  });
});