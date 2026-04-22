// src/presentation/controllers/CarController.ts

import { Request, Response, NextFunction } from 'express';
import { GetAvailableCars } from '../../application/use-cases/car/GetAvailableCars';
import { GetCarById } from '../../application/use-cases/car/GetCarById';
import { CreateCar } from '../../application/use-cases/car/CreateCar';
import { UpdateCar } from '../../application/use-cases/car/UpdateCar';
import { DeleteCar } from '../../application/use-cases/car/DeleteCar';
import { CarRepository } from '../../infrastructure/database/repositories/CarRepository';
import { BookingRepository } from '../../infrastructure/database/repositories/BookingRepository';
import logger from '../../infrastructure/logging/logger';

export class CarController {
  /**
   *GET /api/cars/availability?startDate=&endDate=
   *Returns cars available for the given dates range
   */
  static async getAvailable(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new GetAvailableCars(new CarRepository());
      const cars = await useCase.execute(req.query as any);

      res.status(200).json({
        success: true,
        count: cars.length,
        data: cars,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   *GET /api/cars
   *Returns all cars.
   */
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const carRepo = new CarRepository();
      const cars = await carRepo.findAll();

      res.status(200).json({
        success: true,
        count: cars.length,
        data: cars,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   *GET /api/cars/:id
   *Returns a single car by ID
   */
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new GetCarById(new CarRepository());
      const car = await useCase.execute(req.params.id);

      res.status(200).json({ success: true, data: car });
    } catch (error) {
      next(error);
    }
  }

  /**
   *POST /api/cars  (Admin only)
   *Add a new car 
   */
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new CreateCar(new CarRepository());
      const car = await useCase.execute(req.body);

      logger.info(`Admin created car: ${car.make} ${car.model} (${car.id})`);

      res.status(201).json({
        success: true,
        message: 'Car added successfully',
        data: car,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   *PUT /api/cars/:id  (Admin only)
   *Update a car's details.
   */
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new UpdateCar(new CarRepository());
      const car = await useCase.execute(req.params.id, req.body);

      logger.info(`Admin updated car: ${car.id}`);

      res.status(200).json({
        success: true,
        message: 'Car updated successfully',
        data: car,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   *DELETE /api/cars/:id  (Admin only)
   *Remove a car from the fleet.
   */
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const useCase = new DeleteCar(new CarRepository(), new BookingRepository());
      await useCase.execute(req.params.id);

      logger.info(`Admin deleted car: ${req.params.id}`);

      res.status(200).json({
        success: true,
        message: 'Car deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}