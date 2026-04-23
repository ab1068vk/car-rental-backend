//src/presentation/routes/carRoutes.ts
//Public: GET /api/cars, GET /api/cars/:id, GET /api/cars/availability
//Admin only: POST, PUT, DELETE
import { Router } from 'express';
import { CarController } from '../controllers/CarController';
import { authenticate } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';
import { validateCreateCar, validateCarAvailability } from '../validators/carValidators';

const router = Router();

//GET /api/cars/availability?startDate=&endDate= — Find available cars (public)
router.get('/availability', validateCarAvailability, CarController.getAvailable);

//GET /api/cars List all cars (public)
router.get('/', CarController.getAll);

//GET /api/cars/:id Get single car (public)
router.get('/:id', CarController.getById);

//POST /api/cars Add a new car (admin only)
router.post('/', authenticate, requireAdmin, validateCreateCar, CarController.create);

//PUT /api/cars/:id Update a car (admin only)
router.put('/:id', authenticate, requireAdmin, CarController.update);

//DELETE /api/cars/:id Delete a car (admin only)
router.delete('/:id', authenticate, requireAdmin, CarController.delete);

export default router;