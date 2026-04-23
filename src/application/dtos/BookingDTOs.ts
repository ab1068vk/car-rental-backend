// src/application/dtos/BookingDTOs.ts
//INPUT DTOs
import { BookingStatus } from '@domain/entities/Booking';
/** Data needed to creat booking as a registered user */
export interface CreateBookingDTO {
  carId: string;
  startDate: string;   
  endDate: string;     
  notes?: string;
}

/** Data needed to create a booking as a guest for user without account */
export interface CreateGuestBookingDTO {
  carId: string;
  startDate: string;
  endDate: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  notes?: string;
}

/**Admin action: change booking status */
export interface UpdateBookingStatusDTO {
  status: 'CONFIRMED' | 'DECLINED';
}

//OUTPUT DTOs

/** Booking data returned in API responses */
export interface BookingResponseDTO {
  id: string;
  carId: string;
  userId: string | null;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  isGuest: boolean;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: BookingStatus;
  notes: string | null;
  createdAt: Date;
}

