import { DeleteCar } from '../../../../src/application/use-cases/car/DeleteCar';
import { Car, CarCategory } from '../../../../src/domain/entities/Car';
const mockCarRepository = {
  findById: jest.fn(), findAll: jest.fn(), findAvailable: jest.fn(),
  create: jest.fn(), update: jest.fn(), delete: jest.fn(), count: jest.fn(),
};

const mockBookingRepository = {
  findById: jest.fn(), findByUserId: jest.fn(), findAll: jest.fn(),
  create: jest.fn(), updateStatus: jest.fn(), hasOverlappingBooking: jest.fn(),
  count: jest.fn(), countByStatus: jest.fn(),
};

const fakeCar = new Car('c-1', 'Honda', 'Civic', 2023, CarCategory.SEDAN, 80, 5, 'automatic', 'gasoline', null, true, new Date(), new Date());

describe('DeleteCar Use Case', () => {
  let useCase: DeleteCar;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteCar(mockCarRepository as any, mockBookingRepository as any);
  });

  it('should delete a car with no active bookings', async () => {
    mockCarRepository.findById.mockResolvedValue(fakeCar);
    mockBookingRepository.hasOverlappingBooking.mockResolvedValue(false);
    mockCarRepository.delete.mockResolvedValue(undefined);
    await expect(useCase.execute('c-1')).resolves.toBeUndefined();
    expect(mockCarRepository.delete).toHaveBeenCalledWith('c-1');
  });

  it('should throw if car not found', async () => {
    mockCarRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute('bad-id')).rejects.toThrow('Car not found');
  });

  it('should throw if car has active bookings', async () => {
    mockCarRepository.findById.mockResolvedValue(fakeCar);
    mockBookingRepository.hasOverlappingBooking.mockResolvedValue(true);
    await expect(useCase.execute('c-1')).rejects.toThrow('Cannot delete a car with active bookings');
  });
});