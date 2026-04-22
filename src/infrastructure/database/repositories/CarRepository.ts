//src/infrastructure/database/repositories/CarRepository.ts

import { ICarRepository, CarFilterOptions } from '../../../domain/repositories/ICarRepository';
import { Car } from '../../../domain/entities/Car';
import prisma from '../prismaClient';
import { BookingStatus } from '../../../domain/entities/Booking';

export class CarRepository implements ICarRepository {
  /**Convert Prisma record to domain Car entity */
  private toDomain(record: any): Car {
    return new Car(
      record.id,
      record.make,
      record.model,
      record.year,
      record.category,
      record.pricePerDay,
      record.seats,
      record.transmission,
      record.fuelType,
      record.imageUrl,
      record.available,
      record.createdAt,
      record.updatedAt,
    );
  }

  /**Build a Prisma 'where' clause from filter options */
  private buildFilters(filters?: CarFilterOptions) {
    if (!filters) return {};
    const where: any = {};
    if (filters.category) where.category = filters.category;
    if (filters.seats) where.seats = { gte: filters.seats };
    if (filters.transmission) where.transmission = filters.transmission;
    if (filters.minPrice) where.pricePerDay = { ...where.pricePerDay, gte: filters.minPrice };
    if (filters.maxPrice) where.pricePerDay = { ...where.pricePerDay, lte: filters.maxPrice };
    return where;
  }

  async findById(id: string): Promise<Car | null> {
    const record = await prisma.car.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async findAll(filters?: CarFilterOptions): Promise<Car[]> {
    const records = await prisma.car.findMany({
      where: this.buildFilters(filters),
      orderBy: { createdAt: 'desc' },
    });
    return records.map(this.toDomain.bind(this));
  }

  async findAvailable(
    startDate: Date,
    endDate: Date,
    filters?: CarFilterOptions,
  ): Promise<Car[]> {
    //Find cars that do NOT have an overlapping confirmed/pending booking
    const records = await prisma.car.findMany({
      where: {
        available: true,  //Car must be marked available
        ...this.buildFilters(filters),
        //Exclude cars that have overlapping active bookings
        bookings: {
          none: {
            status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
            //Overlap condition: existing booking overlaps with requested dates
            AND: [
              { startDate: { lt: endDate } },   //Booking starts before our end
              { endDate: { gt: startDate } },    //Booking ends after our start
            ],
          },
        },
      },
      orderBy: { pricePerDay: 'asc' },
    });

    return records.map(this.toDomain.bind(this));
  }

  async create(
    data: Omit<Car, 'id' | 'createdAt' | 'updatedAt' | 'calculateTotalPrice' | 'displayName'>,
  ): Promise<Car> {
    const record = await prisma.car.create({ data });
    return this.toDomain(record);
  }

  async update(id: string, data: Partial<Car>): Promise<Car> {
    const record = await prisma.car.update({
      where: { id },
      data: {
        make: data.make,
        model: data.model,
        year: data.year,
        category: data.category,
        pricePerDay: data.pricePerDay,
        seats: data.seats,
        transmission: data.transmission,
        fuelType: data.fuelType,
        imageUrl: data.imageUrl,
        available: data.available,
      },
    });
    return this.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await prisma.car.delete({ where: { id } });
  }

  async count(): Promise<number> {
    return prisma.car.count();
  }
}