import { GetBookingById } from '../../../../src/application/use-cases/booking/GetBookingById';
import { Booking, BookingStatus } from '../../../../src/domain/entities/Booking';

const mockBookingRepository = {
  findById: jest.fn(), findByUserId: jest.fn(), findAll: jest.fn(),
  create: jest.fn(), updateStatus: jest.fn(), hasOverlappingBooking: jest.fn(),
  count: jest.fn(), countByStatus: jest.fn(),
};

const fakeBooking = new Booking('b-1', 'c-1', 'u-1', null, null, null, false, new Date('2025-09-01'), new Date('2025-09-05'), 400, BookingStatus.CONFIRMED, null, new Date(), new Date());

describe('GetBookingById Use Case', () => {
  let useCase: GetBookingById;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetBookingById(mockBookingRepository as any);
  });

  it('should return booking when user owns it', async () => {
    mockBookingRepository.findById.mockResolvedValue(fakeBooking);
    const result = await useCase.execute('b-1', 'u-1', false);
    expect(result.id).toBe('b-1');
  });

  it('should allow admin to view any booking', async () => {
    mockBookingRepository.findById.mockResolvedValue(fakeBooking);
    const result = await useCase.execute('b-1', 'other-user', true);
    expect(result.id).toBe('b-1');
  });

  it('should throw if booking not found', async () => {
    mockBookingRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute('bad-id', 'u-1', false)).rejects.toThrow('Booking not found');
  });

  it('should throw if user tries to view someone elses booking', async () => {
    mockBookingRepository.findById.mockResolvedValue(fakeBooking);
    await expect(useCase.execute('b-1', 'wrong-user', false)).rejects.toThrow('permission');
  });
});