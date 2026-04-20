// src/application/use-cases/car/UpdateCar.ts

import { ICarRepository } from '../../../domain/repositories/ICarRepository';
import { UpdateCarDTO, CarResponseDTO } from '../../dtos/CarDTOs';

export class UpdateCar {
  constructor(private readonly carRepository: ICarRepository) {}

  async execute(id: string, dto: UpdateCarDTO): Promise<CarResponseDTO> {
    // Verify car exists
    const existing = await this.carRepository.findById(id);
    if (!existing) {
      throw new Error('Car not found');
    }

    //Validate price if being updated
    if (dto.pricePerDay !== undefined && dto.pricePerDay <= 0) {
      throw new Error('Price per day must be greater than 0');
    }

    const car = await this.carRepository.update(id, dto);

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