// tests/unit/use-cases/car/GetAvailableCars.test.ts

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GetAvailableCars } from '../../../../src/application/use-cases/car/GetAvailableCars';
import { Car, CarCategory } from '../../../../src/domain/entities/Car';

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

const fakeCar = new Car(
  'car-123',
  'Toyota',
  'Camry',
  2023,
  CarCategory.SEDAN,
  75.0,
  5,
  'automatic',
  'gasoline',
  null,
  true,
  new Date(),
  new Date(),
);

describe('GetAvailableCars Use Case', () => {
  let getAvailableCars: GetAvailableCars;

  beforeEach(() => {
    jest.clearAllMocks();
    getAvailableCars = new GetAvailableCars(mockCarRepository as any);
  });

  it('should return available cars for valid dates', async () => {
    mockCarRepository.findAvailable.mockResolvedValue([fakeCar]);

    const result = await getAvailableCars.execute({
      startDate: '2026-08-01',
      endDate: '2026-08-05',
    });

    expect(result).toHaveLength(1);
    expect(result[0].make).toBe('Toyota');
  });

  it('should throw if end date is before start date', async () => {
    await expect(
      getAvailableCars.execute({
        startDate: '2026-08-10',
        endDate: '2026-08-05',
      }),
    ).rejects.toThrow('End date must be after start date');
  });

  it('should throw if dates are invalid', async () => {
    await expect(
      getAvailableCars.execute({
        startDate: 'not-a-date',
        endDate: '2026-08-05',
      }),
    ).rejects.toThrow('Invalid date format');
  });
});