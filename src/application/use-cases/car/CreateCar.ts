// src/application/use-cases/car/CreateCar.ts
//Create Car (Admin Only)

import { ICarRepository } from '../../../domain/repositories/ICarRepository';
import { CreateCarDTO, CarResponseDTO } from '../../dtos/CarDTOs';

export class CreateCar {
  constructor(private readonly carRepository: ICarRepository) {}

  async execute(dto: CreateCarDTO): Promise<CarResponseDTO> {
    //Validate price
    if (dto.pricePerDay <= 0) {
      throw new Error('Price per day must be greater than 0');
    }

    //Validate year
    const currentYear = new Date().getFullYear();
    if (dto.year < 2000 || dto.year > currentYear + 1) {
      throw new Error(`Year must be between 2000 and ${currentYear + 1}`);
    }

    const car = await this.carRepository.create({
      make: dto.make.trim(),
      model: dto.model.trim(),
      year: dto.year,
      category: dto.category,
      pricePerDay: dto.pricePerDay,
      seats: dto.seats,
      transmission: dto.transmission.toLowerCase(),
      fuelType: dto.fuelType.toLowerCase(),
      imageUrl: dto.imageUrl || null,
      available: true,  //New cars are available by default
    });

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