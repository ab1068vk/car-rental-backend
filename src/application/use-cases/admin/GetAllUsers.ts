//src/application/use-cases/admin/GetAllUsers.ts

import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserResponseDTO } from '../../dtos/AuthDTOs';

export class GetAllUsers {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.findAll();

    //Return users without passwords
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    }));
  }
}