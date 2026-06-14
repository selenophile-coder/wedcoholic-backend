import express from 'express';
import { createBooking, getBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(createBooking)
  .get(protect, getBookings);

router
  .route('/:id/status')
  .put(protect, adminOnly, updateBookingStatus);

export default router;
