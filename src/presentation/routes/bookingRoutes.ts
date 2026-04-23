//src/presentation/routes/bookingRoutes.ts
//Guest: POST /api/bookings/guest (no JWT needed)
//Authenticated: POST, GET, PUT 

import { Router } from 'express';
import { BookingController } from '../controllers/BookingController';
import { authenticate } from '../middleware/authMiddleware';
import {
  validateCreateBooking,
  validateCreateGuestBooking,
} from '../validators/bookingValidators';

const router = Router();

//POST /api/bookings/guest Book as a guest 
router.post('/guest', validateCreateGuestBooking, BookingController.createGuestBooking);

//POST /api/bookings Booking as a registered user 
router.post('/', authenticate, validateCreateBooking, BookingController.createUserBooking);

//GET /api/bookings/my Get my booking history 
router.get('/my', authenticate, BookingController.getMyBookings);

//GET/api/bookings/:id — Get a specific booking 
router.get('/:id', authenticate, BookingController.getById);

//PUT/api/bookings/:id/cancel Cancel a booking 
router.put('/:id/cancel', authenticate, BookingController.cancel);

export default router;