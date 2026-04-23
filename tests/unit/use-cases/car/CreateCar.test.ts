import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { CreateCar } from '../../../../src/application/use-cases/car/CreateCar';
import { Car, CarCategory } from '../../../../src/domain/entities/Car';

const mockCarRepository = {
  findById: jest.fn(),
  findAll: jest.fn(),
  findAvailable: jest.fn(),
  create: jest.fn<() => Promise<Car>>(),
  update: jest.fn(),
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

describe('CreateCar Use Case', () => {
  let useCase: CreateCar;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CreateCar(mockCarRepository as any);
  });

  it('should create a car successfully', async () => {
    mockCarRepository.create.mockResolvedValue(fakeCar);

    const result = await useCase.execute({
      make: 'Honda',
      model: 'Civic',
      year: 2023,
      category: CarCategory.SEDAN,
      pricePerDay: 80,
      seats: 5,
      transmission: 'automatic',
      fuelType: 'gasoline',
    });

    expect(result.make).toBe('Honda');
    expect(mockCarRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should throw if pricePerDay is 0', async () => {
    await expect(
      useCase.execute({
        make: 'Honda',
        model: 'Civic',
        year: 2023,
        category: CarCategory.SEDAN,
        pricePerDay: 0,
        seats: 5,
        transmission: 'automatic',
        fuelType: 'gasoline',
      })
    ).rejects.toThrow('Price per day must be greater than 0');
  });

  it('should throw if year is invalid', async () => {
    await expect(
      useCase.execute({
        make: 'Honda',
        model: 'Civic',
        year: 1990,
        category: CarCategory.SEDAN,
        pricePerDay: 80,
        seats: 5,
        transmission: 'automatic',
        fuelType: 'gasoline',
      })
    ).rejects.toThrow('Year must be between');
  });
});