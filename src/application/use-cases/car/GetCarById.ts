// src/application/use-cases/car/GetCarById.ts

import { ICarRepository } from '../../../domain/repositories/ICarRepository';
import { CarResponseDTO } from '../../dtos/CarDTOs';

export class GetCarById {
  constructor(private readonly carRepository: ICarRepository) {}

  async execute(id: string): Promise<CarResponseDTO> {
    const car = await this.carRepository.findById(id);

    if (!car) {
      throw new Error('Car not found');
    }

    return {
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
    };
  }
}