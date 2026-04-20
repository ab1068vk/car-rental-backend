// src/domain/entities/Booking.ts
//Entity: Booking

export enum BookingStatus {
  PENDING = 'PENDING',       //Awaiting  review
  CONFIRMED = 'CONFIRMED',   //Approved the booking
  DECLINED = 'DECLINED',     //rejected the booking
  CANCELLED = 'CANCELLED',   //Customer cancelled
}

/**
 * Booking entity  car rental reservation
 */
export class Booking {
  constructor(
    public readonly id: string,
    public carId: string,

    //Registered user fields 
    public userId: string | null,

    //Guest fields 
    public guestName: string | null,
    public guestEmail: string | null,
    public guestPhone: string | null,
    public isGuest: boolean,

    public startDate: Date,
    public endDate: Date,
    public totalPrice: number,
    public status: BookingStatus,
    public notes: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  /**
   * Checks if this booking is still active 
   */
  isActive(): boolean {
    return (
      this.status === BookingStatus.PENDING ||
      this.status === BookingStatus.CONFIRMED
    );
  }

  /**
   * Checks if the booking can be cancelled by the customer
   * because only pending or confirmed bookings can be cancelled
   */
  isCancellable(): boolean {
    return this.isActive();
  }

  /**
   * Returns the duration of the rental in days
   */
  getDurationDays(): number {
    const msPerDay = 1000 * 60 * 60 * 24;
    return Math.ceil(
      (this.endDate.getTime() - this.startDate.getTime()) / msPerDay,
    );
  }
}