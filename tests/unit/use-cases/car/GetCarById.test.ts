import { GetCarById } from '../../../../src/application/use-cases/car/GetCarById';
import { Car, CarCategory } from '../../../../src/domain/entities/Car';

const mockCarRepository = {
  findById: jest.fn(), findAll: jest.fn(), findAvailable: jest.fn(),
  create: jest.fn(), update: jest.fn(), delete: jest.fn(), count: jest.fn(),
};

const fakeCar = new Car('c-1', 'Toyota', 'RAV4', 2023, CarCategory.SEDAN, 90, 5, 'automatic', 'gasoline', null, true, new Date(), new Date());

describe('GetCarById Use Case', () => {
  let useCase: GetCarById;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetCarById(mockCarRepository as any);
  });

  it('should return car when found', async () => {
    mockCarRepository.findById.mockResolvedValue(fakeCar);
    const result = await useCase.execute('c-1');
    expect(result.make).toBe('Toyota');
    expect(result.model).toBe('RAV4');
  });

  it('should throw if car not found', async () => {
    mockCarRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute('bad-id')).rejects.toThrow('Car not found');
  });
});