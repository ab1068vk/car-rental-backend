// src/application/use-cases/car/DeleteCar.ts

import { ICarRepository } from '../../../domain/repositories/ICarRepository';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';

export class DeleteCar {
  constructor(
    private readonly carRepository: ICarRepository,
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(id: string): Promise<void> {
    //Verify car exists
    const car = await this.carRepository.findById(id);
    if (!car) {
      throw new Error('Car not found');
    }

    //Check if there are active bookings for thats car
    const activeBookings = await this.bookingRepository.hasOverlappingBooking(
      id,
      new Date(),
      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), //Check next year
    );

    if (activeBookings) {
      throw new Error('Cannot delete a car with active bookings');
    }

    await this.carRepository.delete(id);
  }
}