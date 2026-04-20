//src/application/use-cases/auth/GetCurrentUser.ts
//Get Current User
//Returns the profile of the users that are logged-in 

import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserResponseDTO } from '../../dtos/AuthDTOs';

export class GetCurrentUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserResponseDTO> {
    //Fetch the user from the database using the ID 
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    //Return safe user data (no password)
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}