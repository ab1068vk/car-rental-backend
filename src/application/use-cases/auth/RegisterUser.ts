//src/application/use-cases/auth/RegisterUser.ts
//Register User
//logic for creating a new account.

import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserRole } from '../../../domain/entities/User';
import { RegisterUserDTO, AuthResponseDTO } from '../../dtos/AuthDTOs';

/** Interface for password hashing */
export interface IPasswordService {
  hash(plain: string): Promise<string>;
  compare(plain: string, hashed: string): Promise<boolean>;
}

/** Interface for JWT token generation */
export interface IJwtService {
  sign(payload: object): string;
  verify(token: string): object | null;
}

export class RegisterUser {
  /**
   * Inject dependencies through constructor.
   */
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly jwtService: IJwtService,
    private readonly adminSecret: string,
  ) {}

  /**
   * Execute the register user use case
   */
  async execute(dto: RegisterUserDTO): Promise<AuthResponseDTO> {
    // 1. Check if email is already taken
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('An account with this email already exists');
    }

    //Determine the role admin will require a secret key
    let role = UserRole.USER;
    if (dto.adminSecret) {
      if (dto.adminSecret !== this.adminSecret) {
        throw new Error('Invalid admin secret');
      }
      role = UserRole.ADMIN;
    }

    //Hash the password before storing 
    const hashedPassword = await this.passwordService.hash(dto.password);

    //Save the new user to the database
    const user = await this.userRepository.create({
      email: dto.email.toLowerCase().trim(),
      password: hashedPassword,
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      phone: dto.phone || null,
      role,
    });

    //Generateing JWT token for immediate login after registration
    const token = this.jwtService.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    //Return token and safe user data no passwrod
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