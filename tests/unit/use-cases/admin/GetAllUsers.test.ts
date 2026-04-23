// tests/unit/use-cases/admin/GetAllUsers.test.ts

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GetAllUsers } from '../../../../src/application/use-cases/admin/GetAllUsers';
import { User, UserRole } from '../../../../src/domain/entities/User';

const mockUserRepository = {
  findById: jest.fn<(id: string) => Promise<User | null>>(),
  findByEmail: jest.fn<(email: string) => Promise<User | null>>(),
  create: jest.fn<(data: any) => Promise<User>>(),
  update: jest.fn<(id: string, data: Partial<User>) => Promise<User>>(),
  findAll: jest.fn<() => Promise<User[]>>(),
  count: jest.fn<() => Promise<number>>(),
};

const fakeUsers = [
  new User(
    'u1',
    'alice@example.com',
    'hash',
    'Alice',
    'Smith',
    null,
    UserRole.USER,
    new Date(),
    new Date(),
  ),
  new User(
    'u2',
    'bob@example.com',
    'hash',
    'Bob',
    'Jones',
    '555-1234',
    UserRole.ADMIN,
    new Date(),
    new Date(),
  ),
];

describe('GetAllUsers Use Case', () => {
  let getAllUsers: GetAllUsers;

  beforeEach(() => {
    jest.clearAllMocks();
    getAllUsers = new GetAllUsers(mockUserRepository as any);
  });

  it('should return all users as safe DTOs (no passwords)', async () => {
    mockUserRepository.findAll.mockResolvedValue(fakeUsers);

    const result = await getAllUsers.execute();

    expect(result).toHaveLength(2);
    expect(result[0]).not.toHaveProperty('password');
    expect(result[1]).not.toHaveProperty('password');
  });

  it('should return correct user fields', async () => {
    mockUserRepository.findAll.mockResolvedValue(fakeUsers);

    const result = await getAllUsers.execute();

    expect(result[0]).toMatchObject({
      id: 'u1',
      email: 'alice@example.com',
      firstName: 'Alice',
      lastName: 'Smith',
      role: UserRole.USER,
    });
  });

  it('should return an empty array when no users exist', async () => {
    mockUserRepository.findAll.mockResolvedValue([]);

    const result = await getAllUsers.execute();

    expect(result).toHaveLength(0);
  });

  it('should include admin users in the results', async () => {
    mockUserRepository.findAll.mockResolvedValue(fakeUsers);

    const result = await getAllUsers.execute();

    const adminUser = result.find((u) => u.role === UserRole.ADMIN);
    expect(adminUser).toBeDefined();
    expect(adminUser?.email).toBe('bob@example.com');
  });
});