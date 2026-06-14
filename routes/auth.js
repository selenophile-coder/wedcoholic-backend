import express from 'express';
import rateLimit from 'express-rate-limit';
import { signup, verifyOtp, login, verifyStage2, cancelSignup, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

// Rate limiter for authentication paths (max 10 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many requests. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/signup', signup);
router.post('/verify-otp', authLimiter, verifyOtp);
router.post('/login', authLimiter, login);
router.post('/verify-stage2', authLimiter, verifyStage2);
router.post('/cancel-signup', cancelSignup);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

export default router;
