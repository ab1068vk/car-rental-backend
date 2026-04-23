// src/presentation/validators/bookingValidators.ts

import { body } from 'express-validator';
import { validate } from './authValidators';

export const validateCreateBooking = [
  body('carId').notEmpty().isUUID().withMessage('A valid car ID is required'),
  body('startDate').notEmpty().isISO8601().withMessage('Start date must be a valid date'),
  body('endDate').notEmpty().isISO8601().withMessage('End date must be a valid date'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes max 500 characters'),
  validate,
];

export const validateCreateGuestBooking = [
  body('carId').notEmpty().isUUID().withMessage('A valid car ID is required'),
  body('startDate').notEmpty().isISO8601().withMessage('Start date must be a valid date'),
  body('endDate').notEmpty().isISO8601().withMessage('End date must be a valid date'),
  body('guestName').notEmpty().withMessage('Guest name is required'),
  body('guestEmail').isEmail().withMessage('A valid guest email is required'),
  body('guestPhone').optional().notEmpty().withMessage('Phone number is invalid'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes max 500 characters'),
  validate,
];