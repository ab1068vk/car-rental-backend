// src/app.ts
//Creates and configures the Express app.
//Exported separately from server.ts to allow easy testing
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

//Load environment variables from .env file
dotenv.config();

//Import routes
import authRoutes from './presentation/routes/authRoutes';
import carRoutes from './presentation/routes/carRoutes';
import bookingRoutes from './presentation/routes/bookingRoutes';
import adminRoutes from './presentation/routes/adminRoutes';

//Import middleware
import { errorHandler, notFoundHandler } from './presentation/middleware/errorMiddleware';
import logger from './infrastructure/logging/logger';

// Create Express application
const app = express();


//SECURITY MIDDLEWARE

//Helmet: Sets various HTTP security headers
app.use(helmet());

//Allow frontend to communicate with this API
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',   //In production: specify your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

//BODY PARSING

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


//REQUEST LOGGING

app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path} — IP: ${req.ip}`);
  next();
});


//HEALTH CHECK

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});


//API ROUTES

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);


//ERROR HANDLING 

app.use(notFoundHandler);   //Handle unknown routes
app.use(errorHandler);      //Handle all thrown errors

export default app;