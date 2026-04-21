//src/application/use-cases/admin/GetAnalytics.ts
//Get Analytics (Admin Dashboard)

import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ICarRepository } from '../../../domain/repositories/ICarRepository';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository';
import { BookingStatus } from '../../../domain/entities/Booking';

/* Analytics data returned to the admin dashboard */
export interface AnalyticsDTO {
  users: {
    total: number;
  };
  cars: {
    total: number;
  };
  bookings: {
    total: number;
    pending: number;
    confirmed: number;
    declined: number;
    cancelled: number;
  };
}

export class GetAnalytics {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly carRepository: ICarRepository,
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(): Promise<AnalyticsDTO> {
    //Run all counts in parallel for better performance
    const [
      totalUsers,
      totalCars,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      declinedBookings,
      cancelledBookings,
    ] = await Promise.all([
      this.userRepository.count(),
      this.carRepository.count(),
      this.bookingRepository.count(),
      this.bookingRepository.countByStatus(BookingStatus.PENDING),
      this.bookingRepository.countByStatus(BookingStatus.CONFIRMED),
      this.bookingRepository.countByStatus(BookingStatus.DECLINED),
      this.bookingRepository.countByStatus(BookingStatus.CANCELLED),
    ]);

    return {
      users: {
        total: totalUsers,
      },
      cars: {
        total: totalCars,
      },
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        declined: declinedBookings,
        cancelled: cancelledBookings,
      },
    };
  }
}