import { GetCurrentUser } from '../../../../src/application/use-cases/auth/GetCurrentUser';
import { User, UserRole } from '../../../../src/domain/entities/User';

const mockUserRepository = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
  count: jest.fn(),
};

const fakeUser = new User('u-1', 'test@test.com', 'hash', 'Test', 'User', null, UserRole.USER, new Date(), new Date());

describe('GetCurrentUser Use Case', () => {
  let useCase: GetCurrentUser;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetCurrentUser(mockUserRepository as any);
  });

  it('should return safe user data for valid userId', async () => {
    mockUserRepository.findById.mockResolvedValue(fakeUser);
    const result = await useCase.execute('u-1');
    expect(result.email).toBe('test@test.com');
    expect(result).not.toHaveProperty('password');
  });

  it('should throw if user not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute('bad-id')).rejects.toThrow('User not found');
  });
});