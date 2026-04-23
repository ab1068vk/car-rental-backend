// src/presentation/validators/authValidators.ts
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**Middleware to check validation results and return errors */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.type, message: e.msg })),
    });
    return;
  }
  next();
};

/** Validation rules for user registration */
export const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 50 })
    .withMessage('First name must be 50 characters or less'),
  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 50 })
    .withMessage('Last name must be 50 characters or less'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s\-().]{7,20}$/)
    .withMessage('Please provide a valid phone number'),
  validate,
];

/** Validation rules for login */
export const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];