// src/application/dtos/AuthDTOs.ts
//INPUT DTOs
import { UserRole } from '@domain/entities/User';
/** Data needed to register a new user */
export interface RegisterUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  adminSecret?: string;  //Only needed if registering as admin
}

/** Data needed to log in */
export interface LoginUserDTO {
  email: string;
  password: string;
}

//OUTPUT DTOs

/**Safe user data returned in responsesno password*/
export interface UserResponseDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
  createdAt: Date;
}

/**Returned after successful login or register*/
export interface AuthResponseDTO {
  token: string;          // JWT access token
  user: UserResponseDTO;  //User info no password here as well
}