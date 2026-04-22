// src/infrastructure/auth/JwtService.ts
// JWT Service
// Implements JWT signing and verification

import jwt from 'jsonwebtoken';
import { IJwtService } from '../../application/use-cases/auth/RegisterUser';

/**encode inside the JWT payload */
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export class JwtService implements IJwtService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    //Read from environment variables 
    this.secret = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  /**
   *Sign a payload and return a JWT token string.
   */
  sign(payload: object): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: this.expiresIn as any,
    });
  }

  /**
   * Verify and decode a JWT token.
   * returns decoded payload, or null if invalid/expired
   */
  verify(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this.secret) as JwtPayload;
    } catch {
      //Token is invalid, expired, or tampered with
      return null;
    }
  }
}