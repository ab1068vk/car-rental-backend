//src/application/use-cases/car/GetAvailableCars.ts
// Finds all cars that can be rented for the given range

import { ICarRepository } from '../../../domain/repositories/ICarRepository';
import { CarAvailabilityQueryDTO, CarResponseDTO } from '../../dtos/CarDTOs';
import { CarFilterOptions } from '../../../domain/repositories/ICarRepository';
export class GetAvailableCars {
  constructor(private readonly carRepository: ICarRepository) {}

  async execute(query: CarAvailabilityQueryDTO): Promise<CarResponseDTO[]> {
    //Parse the date strings to Date objects
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    //Validate the date range
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date format. Use ISO 8601 (e.g., 2024-07-15)');
    }

    if (endDate <= startDate) {
      throw new Error('End date must be after start date');
    }

    if (startDate < new Date()) {
      throw new Error('Start date cannot be in the past');
    }

    //optional filters from query parameters
    const filters: CarFilterOptions = {
        category: query.category,
        seats: query.seats,
        transmission: query.transmission,
    };

    //Query the repository for available cars
    const cars = await this.carRepository.findAvailable(startDate, endDate, filters);

    //Map domain entities to response DTOs
    return cars.map((car) => ({
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      category: car.category,
      pricePerDay: car.pricePerDay,
      seats: car.seats,
      transmission: car.transmission,
      fuelType: car.fuelType,
      imageUrl: car.imageUrl,
      available: car.available,
      createdAt: car.createdAt,
    }));
  }
}