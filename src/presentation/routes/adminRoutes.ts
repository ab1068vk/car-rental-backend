// src/presentation/routes/adminRoutes.ts
// ALL routes here require JWT + ADMIN role.
import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authenticate } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';

const router = Router();

//Apply authentication + admin check to ALL admin routes
router.use(authenticate, requireAdmin);

//GET /api/admin/bookings View all bookings
router.get('/bookings', AdminController.getAllBookings);

//PUT /api/admin/bookings/:id/status Confirm or decline a booking
router.put('/bookings/:id/status', AdminController.updateBookingStatus);

//GET /api/admin/users View all registered users
router.get('/users', AdminController.getAllUsers);

//GET /api/admin/analytics View site statistics
router.get('/analytics', AdminController.getAnalytics);

export default router;