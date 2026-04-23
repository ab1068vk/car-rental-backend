// src/presentation/routes/authRoutes.ts
// Public:    POST /register, POST /login
// Protected: GET  /me (requires JWT)
import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authenticate } from '../middleware/authMiddleware';
import { validateRegister, validateLogin } from '../validators/authValidators';

const router = Router();

//POST /api/auth/register — Create a new account
router.post('/register', validateRegister, AuthController.register);

//POST /api/auth/login — Log in and receive a JWT
router.post('/login', validateLogin, AuthController.login);

//GET /api/auth/me — Get current user profile 
router.get('/me', authenticate, AuthController.getMe);

export default router;