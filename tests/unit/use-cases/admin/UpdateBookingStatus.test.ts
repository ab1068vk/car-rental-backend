import { UpdateBookingStatus } from '../../../../src/application/use-cases/admin/UpdateBookingStatus';
import { Booking, BookingStatus } from '../../../../src/domain/entities/Booking';

const mockBookingRepository = {
  findById: jest.fn(),
  findByUserId: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  updateStatus: jest.fn(),
  hasOverlappingBooking: jest.fn(),
  count: jest.fn(),
  countByStatus: jest.fn(),
};

const pendingBooking = new Booking(
  'booking-1', 'car-1', 'user-1',
  null, null, null, false,
  new Date('2025-09-01'), new Date('2025-09-05'),
  240.0, BookingStatus.PENDING, null,
  new Date(), new Date(),
);

const alreadyConfirmedBooking = new Booking(
  'booking-2', 'car-2', 'user-2',
  null, null, null, false,
  new Date('2025-09-01'), new Date('2025-09-05'),
  240.0, BookingStatus.CONFIRMED, null,
  new Date(), new Date(),
);

describe('UpdateBookingStatus Use Case', () => {
  let updateBookingStatus: UpdateBookingStatus;

  beforeEach(() => {
    jest.clearAllMocks();
    updateBookingStatus = new UpdateBookingStatus(mockBookingRepository as any);
  });

  it('should confirm a pending booking', async () => {
    mockBookingRepository.findById.mockResolvedValue(pendingBooking);
    mockBookingRepository.updateStatus.mockResolvedValue({
      ...pendingBooking,
      status: BookingStatus.CONFIRMED,
    });

    const result = await updateBookingStatus.execute('booking-1', {
      status: BookingStatus.CONFIRMED,
    });

    expect(mockBookingRepository.updateStatus).toHaveBeenCalledWith(
      'booking-1',
      BookingStatus.CONFIRMED,
    );
  });

  it('should decline a pending booking', async () => {
    mockBookingRepository.findById.mockResolvedValue(pendingBooking);
    mockBookingRepository.updateStatus.mockResolvedValue({
      ...pendingBooking,
      status: BookingStatus.DECLINED,
    });

    await updateBookingStatus.execute('booking-1', {
      status: BookingStatus.DECLINED,
    });

    expect(mockBookingRepository.updateStatus).toHaveBeenCalledWith(
      'booking-1',
      BookingStatus.DECLINED,
    );
  });

  it('should throw if booking is not found', async () => {
    mockBookingRepository.findById.mockResolvedValue(null);

    await expect(
      updateBookingStatus.execute('nonexistent', { status: BookingStatus.CONFIRMED }),
    ).rejects.toThrow('Booking not found');
  });

  it('should throw if booking is not PENDING', async () => {
    mockBookingRepository.findById.mockResolvedValue(alreadyConfirmedBooking);

    await expect(
      updateBookingStatus.execute('booking-2', { status: BookingStatus.CONFIRMED }),
    ).rejects.toThrow('Can only confirm or decline pending bookings');
  });
});