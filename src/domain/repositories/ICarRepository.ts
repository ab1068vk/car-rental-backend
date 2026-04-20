// src/domain/repositories/ICarRepository.ts
// Defines database operations for cars

import { Car, CarCategory } from '../entities/Car';

export interface CarFilterOptions {
  category?: CarCategory;
  minPrice?: number;
  maxPrice?: number;
  seats?: number;
  transmission?: string;
}

export interface ICarRepository {
  /**Find a car by its ID*/
  findById(id: string): Promise<Car | null>;

  /** Get all cars with optional filters */
  findAll(filters?: CarFilterOptions): Promise<Car[]>;

  /**
   * Find cars that are available for a specific date range.
   */
  findAvailable(startDate: Date, endDate: Date, filters?: CarFilterOptions): Promise<Car[]>;

  /**Create a new car listing */
  create(car: Omit<Car, 'id' | 'createdAt' | 'updatedAt' | 'calculateTotalPrice' | 'displayName'>): Promise<Car>;

  /** Update a car's details*/
  update(id: string, data: Partial<Car>): Promise<Car>;

  /** Remove a car from the system*/
  delete(id: string): Promise<void>;

  /**Count total cars in the system */
  count(): Promise<number>;
}