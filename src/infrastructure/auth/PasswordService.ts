//src/infrastructure/auth/PasswordService.ts
//Password Service
//Implementing password hashing and comparison using bcrypt
import bcrypt from 'bcryptjs';
import { IPasswordService } from '../../application/use-cases/auth/RegisterUser';

export class PasswordService implements IPasswordService {
  //Salt rounds higher means more secure but slower. 12 is a good balance.
  private readonly SALT_ROUNDS = 12;

  /**
   *Hash a plain text password.
   *plain -user's plain text password
   *returns A bcrypt hash that is safe to store in the database
   */
  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.SALT_ROUNDS);
  }

  /**
   *Compareing a plain text password against a stored hash.
   *plain-password submitted during login
   *hashed - The stored bcrypt hash from the database
   *returns true if they match, false otherwise
   */
  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}