// src/presentation/validators/carValidators.ts

import { body, query } from 'express-validator';
import { validate } from './authValidators';

export const validateCreateCar = [
  body('make').notEmpty().withMessage('Car make is required'),
  body('model').notEmpty().withMessage('Car model is required'),
  body('year')
    .isInt({ min: 2000, max: new Date().getFullYear() + 1 })
    .withMessage('Year must be a valid year'),
  body('category')
    .notEmpty()
    .isIn(['economy', 'sedan', 'suv', 'luxury', 'van', 'truck'])
    .withMessage('Category must be one of: economy, sedan, suv, luxury, van, truck'),
  body('pricePerDay')
    .isFloat({ min: 0.01 })
    .withMessage('Price per day must be greater than 0'),
  body('seats')
    .isInt({ min: 1, max: 15 })
    .withMessage('Seats must be between 1 and 15'),
  body('transmission')
    .isIn(['automatic', 'manual'])
    .withMessage('Transmission must be automatic or manual'),
  body('fuelType')
    .isIn(['gasoline', 'diesel', 'electric', 'hybrid'])
    .withMessage('Fuel type must be one of: gasoline, diesel, electric, hybrid'),
  validate,
];

export const validateCarAvailability = [
  query('startDate')
    .notEmpty()
    .isISO8601()
    .withMessage('startDate is required and must be a valid date (YYYY-MM-DD)'),
  query('endDate')
    .notEmpty()
    .isISO8601()
    .withMessage('endDate is required and must be a valid date (YYYY-MM-DD)'),
  validate,
];