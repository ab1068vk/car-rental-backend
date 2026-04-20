//src/application/use-cases/auth/LoginUser.ts
//Login User
//Validates credentials and returns a JWT token

import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { LoginUserDTO, AuthResponseDTO } from '../../dtos/AuthDTOs';
import { IPasswordService, IJwtService } from './RegisterUser';

export class LoginUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly jwtService: IJwtService,
  ) {}

  /**
   * Execute the login use case.
   */
  async execute(dto: LoginUserDTO): Promise<AuthResponseDTO> {
    //Look up user by email
    const user = await this.userRepository.findByEmail(dto.email.toLowerCase().trim());
    
    //Use the same generic error whether email or password is wrong not giving a way too much information which can be used to hack 
    if (!user) {
      throw new Error('Invalid email or password');
    }

    //Compare new password against stored bcrypt hash
    const isPasswordValid = await this.passwordService.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    //Generate JWT with user identity
    const token = this.jwtService.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    };
  }
}