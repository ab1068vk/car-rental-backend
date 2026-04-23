// tests/unit/use-cases/auth/LoginUser.test.ts

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { LoginUser } from '../../../../src/application/use-cases/auth/LoginUser';
import { User, UserRole } from '../../../../src/domain/entities/User';

const mockUserRepository = {
  findByEmail: jest.fn<(email: string) => Promise<User | null>>(),
  findById: jest.fn<(id: string) => Promise<User | null>>(),
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

const fakeUser = new User(
  'user-123',
  'test@example.com',
  'hashed-pass',
  'Test',
  'User',
  null,
  UserRole.USER,
  new Date(),
  new Date(),
);

describe('LoginUser Use Case', () => {
  let loginUser: LoginUser;

  beforeEach(() => {
    jest.clearAllMocks();
    mockJwtService.sign.mockReturnValue('fake-token');

    loginUser = new LoginUser(
      mockUserRepository as any,
      mockPasswordService as any,
      mockJwtService as any,
    );
  });

  it('should log in successfully with valid credentials', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(fakeUser);
    mockPasswordService.compare.mockResolvedValue(true);

    const result = await loginUser.execute({
      email: 'test@example.com',
      password: 'correct-password',
    });

    expect(result.token).toBe('fake-token');
    expect(result.user.email).toBe('test@example.com');
  });

  it('should throw an error if email is not found', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(
      loginUser.execute({
        email: 'wrong@example.com',
        password: 'pass',
      }),
    ).rejects.toThrow('Invalid email or password');
  });

  it('should throw an error if password is incorrect', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(fakeUser);
    mockPasswordService.compare.mockResolvedValue(false);

    await expect(
      loginUser.execute({
        email: 'test@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow('Invalid email or password');
  });
});