import { GetUserBookings } from '../../../../src/application/use-cases/booking/GetUserBookings';
import { Booking, BookingStatus } from '../../../../src/domain/entities/Booking';

const mockBookingRepository = {
  findById: jest.fn(), findByUserId: jest.fn(), findAll: jest.fn(),
  create: jest.fn(), updateStatus: jest.fn(), hasOverlappingBooking: jest.fn(),
  count: jest.fn(), countByStatus: jest.fn(),
};

const fakeBookings = [
  new Booking('b-1', 'c-1', 'u-1', null, null, null, false, new Date('2025-09-01'), new Date('2025-09-05'), 400, BookingStatus.PENDING, null, new Date(), new Date()),
  new Booking('b-2', 'c-2', 'u-1', null, null, null, false, new Date('2025-10-01'), new Date('2025-10-03'), 200, BookingStatus.CONFIRMED, null, new Date(), new Date()),
];

describe('GetUserBookings Use Case', () => {
  let useCase: GetUserBookings;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetUserBookings(mockBookingRepository as any);
  });

  it('should return all bookings for a user', async () => {
    mockBookingRepository.findByUserId.mockResolvedValue(fakeBookings);
    const result = await useCase.execute('u-1');
    expect(result).toHaveLength(2);
    expect(result[0].userId).toBe('u-1');
  });

  it('should return empty array if user has no bookings', async () => {
    mockBookingRepository.findByUserId.mockResolvedValue([]);
    const result = await useCase.execute('u-1');
    expect(result).toHaveLength(0);
  });
});