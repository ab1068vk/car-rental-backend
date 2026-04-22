//src/infrastructure/database/repositories/UserRepository.ts
//User Repository Implementation
//Implements IUserRepository using Prisma to talk to PostgreSQL

import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User, UserRole } from '../../../domain/entities/User';
import prisma from '../prismaClient';

export class UserRepository implements IUserRepository {
  /**
   *Convert a Prisma database record to a domain User entity
   */
  private toDomain(record: any): User {
    return new User(
      record.id,
      record.email,
      record.password,
      record.firstName,
      record.lastName,
      record.phone,
      record.role as UserRole,
      record.createdAt,
      record.updatedAt,
    );
  }

  async findById(id: string): Promise<User | null> {
    const record = await prisma.user.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await prisma.user.findUnique({ where: { email } });
    return record ? this.toDomain(record) : null;
  }

  async create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'fullName' | 'isAdmin' | 'toSafeObject'>,
  ): Promise<User> {
    const record = await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
      },
    });
    return this.toDomain(record);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const record = await prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
      },
    });
    return this.toDomain(record);
  }

  async findAll(): Promise<User[]> {
    const records = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return records.map(this.toDomain);
  }

  async count(): Promise<number> {
    return prisma.user.count();
  }
}