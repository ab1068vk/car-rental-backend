// src/domain/repositories/IUserRepository.ts

import { User } from '../entities/User';

export interface IUserRepository {
  /** Find a user by their ID */
  findById(id: string): Promise<User | null>;

  /**Find a user by their email address*/
  findByEmail(email: string): Promise<User | null>;

  /**Save a new user to the database*/
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'fullName' | 'isAdmin' | 'toSafeObject'>): Promise<User>;

  /**Update an existing user's information*/
  update(id: string, data: Partial<User>): Promise<User>;

  /**Get all of the users */
  findAll(): Promise<User[]>;

  /**Counting the  total number of registered users*/
  count(): Promise<number>;
}