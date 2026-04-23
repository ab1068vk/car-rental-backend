import { CancelBooking } from '../../../../src/application/use-cases/booking/CancelBooking';
import { Booking, BookingStatus } from '../../../../src/domain/entities/Booking';

const mockBookingRepository = {
  findById: jest.fn(), findByUserId: jest.fn(), findAll: jest.fn(),
  create: jest.fn(), updateStatus: jest.fn(), hasOverlappingBooking: jest.fn(),
  count: jest.fn(), countByStatus: jest.fn(),
};

const makeBooking = (status: BookingStatus, userId = 'u-1') =>
  new Booking('b-1', 'c-1', userId, null, null, null, false, new Date('2025-09-01'), new Date('2025-09-05'), 400, status, null, new Date(), new Date());

describe('CancelBooking Use Case', () => {
  let useCase: CancelBooking;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new CancelBooking(mockBookingRepository as any);
  });

  it('should cancel a pending booking', async () => {
    const pending = makeBooking(BookingStatus.PENDING);
    mockBookingRepository.findById.mockResolvedValue(pending);
    mockBookingRepository.updateStatus.mockResolvedValue({ ...pending, status: BookingStatus.CANCELLED });

    const result = await useCase.execute('b-1', 'u-1', false);
    expect(mockBookingRepository.updateStatus).toHaveBeenCalledWith('b-1', BookingStatus.CANCELLED);
  });

  it('should throw if booking not found', async () => {
    mockBookingRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute('bad-id', 'u-1', false)).rejects.toThrow('Booking not found');
  });

  it('should throw if user does not own the booking', async () => {
    mockBookingRepository.findById.mockResolvedValue(makeBooking(BookingStatus.PENDING, 'other-user'));
    await expect(useCase.execute('b-1', 'u-1', false)).rejects.toThrow('permission');
  });

  it('should throw if booking is already declined', async () => {
    mockBookingRepository.findById.mockResolvedValue(makeBooking(BookingStatus.DECLINED));
    await expect(useCase.execute('b-1', 'u-1', false)).rejects.toThrow('Cannot cancel');
  });

  it('should allow admin to cancel any booking', async () => {
    const pending = makeBooking(BookingStatus.PENDING, 'other-user');
    mockBookingRepository.findById.mockResolvedValue(pending);
    mockBookingRepository.updateStatus.mockResolvedValue({ ...pending, status: BookingStatus.CANCELLED });
    await expect(useCase.execute('b-1', 'admin-id', true)).resolves.toBeDefined();
  });
});