//src/domain/entities/Car.ts
//Entity: Car

/**
 * Categories of type of rental cars 
 */
export enum CarCategory {
  ECONOMY = 'economy',
  SEDAN = 'sedan',
  SUV = 'suv',
  LUXURY = 'luxury',
  VAN = 'van',
  TRUCK = 'truck',
}

/**
 * Car entity — represents a vehicle available for rental.
 */
export class Car {
  constructor(
    public readonly id: string,
    public make: string,          //Manufacturer - Toyota
    public model: string,         //Model name - Camry
    public year: number,          //Manufacturing year
    public category: CarCategory, // Car category
    public pricePerDay: number,   // Daily rental rate in CAD
    public seats: number,         //Passenger capacity
    public transmission: string,  //'automatic' or 'manual'
    public fuelType: string,      //'gasoline', 'diesel', 'electric', 'hybrid'
    public imageUrl: string | null,
    public available: boolean,    //If car is aviable to be booked or if its already bokked by other user
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  /**
   * Calculate the total price for a rental period.
   */
  calculateTotalPrice(startDate: Date, endDate: Date): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / msPerDay);
    
    if (days <= 0) {
      throw new Error('End date must be after start date');
    }
    
    return Math.round(days * this.pricePerDay * 100) / 100; // Round to 2 decimals
  }

  /**
   *Display name for the car.
   */
  get displayName(): string {
    return `${this.year} ${this.make} ${this.model}`;
  }
}