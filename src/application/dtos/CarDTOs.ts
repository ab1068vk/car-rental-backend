// src/application/dtos/CarDTOs.ts

//INPUT DTOs

/**Data needed to create a new car listing*/
export interface CreateCarDTO {
  make: string;
  model: string;
  year: number;
  category: string;
  pricePerDay: number;
  seats: number;
  transmission: string;
  fuelType: string;
  imageUrl?: string;
}

/** Data for updating a car */
export interface UpdateCarDTO {
  make?: string;
  model?: string;
  year?: number;
  category?: string;
  pricePerDay?: number;
  seats?: number;
  transmission?: string;
  fuelType?: string;
  imageUrl?: string;
  available?: boolean;
}

/**Query parameters for searching available car*/
export interface CarAvailabilityQueryDTO {
  startDate: string;   
  endDate: string;    
  category?: string;
  seats?: number;
  transmission?: string;
}

//OUTPUT DTO

/**Car data returned in API responses*/
export interface CarResponseDTO {
  id: string;
  make: string;
  model: string;
  year: number;
  category: string;
  pricePerDay: number;
  seats: number;
  transmission: string;
  fuelType: string;
  imageUrl: string | null;
  available: boolean;
  createdAt: Date;
}