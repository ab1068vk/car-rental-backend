import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { UpdateCar } from '../../../../src/application/use-cases/car/UpdateCar';
import { Car, CarCategory } from '../../../../src/domain/entities/Car';

const mockCarRepository = {
  findById: jest.fn<(id: string) => Promise<Car | null>>(),
  findAll: jest.fn(),
  findAvailable: jest.fn(),
  create: jest.fn<(car: Car) => Promise<Car>>(),
  update: jest.fn<(id: string, data: Partial<Car>) => Promise<Car>>(),
  delete: jest.fn(),
  count: jest.fn(),
};

const fakeCar = new Car(
  'c-1',
  'Honda',
  'Civic',
  2023,
  CarCategory.SEDAN,
  80,
  5,
  'automatic',
  'gasoline',
  null,
  true,
  new Date(),
  new Date()
);

describe('UpdateCar Use Case', () => {
  let useCase: UpdateCar;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateCar(mockCarRepository as any);
  });

  it('should update a car successfully', async () => {
  mockCarRepository.findById.mockResolvedValue(fakeCar);

  mockCarRepository.update.mockResolvedValue(
    new Car(
      'c-1',
      'Honda',
      'Civic',
      2023,
      CarCategory.SEDAN,
      90,
      5,
      'automatic',
      'gasoline',
      null,
      true,
      new Date(),
      new Date()
    )
  );

  const result = await useCase.execute('c-1', { pricePerDay: 90 });

  expect(result.pricePerDay).toBe(90);
});

  it('should throw if new price is 0', async () => {
    mockCarRepository.findById.mockResolvedValue(fakeCar);

    await expect(
      useCase.execute('c-1', { pricePerDay: 0 })
    ).rejects.toThrow('Price per day must be greater than 0');
  });
});