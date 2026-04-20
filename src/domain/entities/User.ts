// src/domain/entities/User.ts
//Entity: User

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

/**
 * User entity — represents a registered account in the system.
 */
export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public password: string,      //Always stored as a bcrypt hash
    public firstName: string,
    public lastName: string,
    public phone: string | null,
    public role: UserRole,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  /**
   * Returns the user's full name.
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * This chekcs if this user has administrator privileges
   */
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  /**
   * Returns a safe version of the user so that no password is retured
   */
  toSafeObject(): Omit<User, 'password' | 'toSafeObject'> {
    const { password, toSafeObject, ...safeUser } = this;
    return safeUser;
  }
}