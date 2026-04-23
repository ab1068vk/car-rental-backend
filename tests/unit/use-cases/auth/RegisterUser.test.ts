import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { RegisterUser } from '../../../../src/application/use-cases/auth/RegisterUser';
import { User, UserRole } from '../../../../src/domain/entities/User';

const mockUserRepository = {
  findById: jest.fn<(id: string) => Promise<User | null>>(),
  findByEmail: jest.fn<(email: string) => Promise<User | null>>(),
  create: jest.fn<(data: any) => Promise<User>>(),
  update: jest.fn<(id: string, data: Partial<User>) => Promise<User>>(),
  findAll: jest.fn<() => Promise<User[]>>(),
  count: jest.fn<() => Promise<number>>(),
};

const mockPasswordService = {
  hash: jest.fn<(plain: string) => Promise<string>>(),
  compare: jest.fn<(plain: string, hashed: string) => Promise<boolean>>(),
};

const mockJwtService = {
  sign: jest.fn<(payload: object) => string>(),
  verify: jest.fn<(token: string) => object | null>(),
};

const createFakeUser = (overrides: Partial<User> = {}): User =>
  new User(
    overrides.id ?? 'user-id-123',
    overrides.email ?? 'jane@example.com',
    overrides.password ?? 'hashed-password-123',
    overrides.firstName ?? 'Jane',
    overrides.lastName ?? 'Doe',
    overrides.phone ?? null,
    overrides.role ?? UserRole.USER,
    overrides.createdAt ?? new Date(),
    overrides.updatedAt ?? new Date(),
  );

describe('RegisterUser Use Case', () => {
  let registerUser: RegisterUser;

  beforeEach(() => {
    jest.clearAllMocks();

    mockPasswordService.hash.mockResolvedValue('hashed-password-123');
    mockJwtService.sign.mockReturnValue('fake-jwt-token');

    registerUser = new RegisterUser(
      mockUserRepository as any,
      mockPasswordService as any,
      mockJwtService as any,
      'test-admin-secret',
    );
  });

  it('should register a new user successfully', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue(createFakeUser());

    const result = await registerUser.execute({
      email: 'jane@example.com',
      password: 'Password1',
      firstName: 'Jane',
      lastName: 'Doe',
    });

    expect(result.token).toBe('fake-jwt-token');
    expect(result.user.email).toBe('jane@example.com');
    expect(mockPasswordService.hash).toHaveBeenCalledWith('Password1');
    expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if email already exists', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(createFakeUser());

    await expect(
      registerUser.execute({
        email: 'jane@example.com',
        password: 'Password1',
        firstName: 'Jane',
        lastName: 'Doe',
      }),
    ).rejects.toThrow('An account with this email already exists');
  });

  it('should throw an error if admin secret is wrong', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(
      registerUser.execute({
        email: 'admin@example.com',
        password: 'Password1',
        firstName: 'Admin',
        lastName: 'User',
        adminSecret: 'wrong-secret',
      }),
    ).rejects.toThrow('Invalid admin secret');
  });

  it('should register as admin with correct admin secret', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockResolvedValue(
      new User(
        'id',
        'admin@example.com',
        'hash',
        'Admin',
        'User',
        null,
        UserRole.ADMIN,
        new Date(),
        new Date(),
      ),
    );

    const result = await registerUser.execute({
      email: 'admin@example.com',
      password: 'Password1',
      firstName: 'Admin',
      lastName: 'User',
      adminSecret: 'test-admin-secret',
    });

    expect(result.user.role).toBe(UserRole.ADMIN);
    expect(mockUserRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ role: UserRole.ADMIN }),
    );
  });
});