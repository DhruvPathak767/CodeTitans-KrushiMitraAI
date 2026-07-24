import express from 'express';
import authController from '../controllers/auth/auth.controller.js';
import validate from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  signupRules,
  verifyOtpRules,
  loginRules,
  refreshRules,
  forgotPasswordRules,
  resetPasswordRules,
  updateProfileRules,
} from '../validations/auth.validation.js';

const router = express.Router();

// Public Auth Endpoints
router.post('/signup', signupRules, validate, authController.signup);
router.post('/verify-otp', verifyOtpRules, validate, authController.verifyOtp);
router.post('/login', loginRules, validate, authController.login);
router.post('/refresh', refreshRules, validate, authController.refresh);
router.post('/forgot-password', forgotPasswordRules, validate, authController.forgotPassword);
router.post('/reset-password', resetPasswordRules, validate, authController.resetPassword);

// Protected Auth Endpoints
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getProfile);
router.put('/profile', authenticate, updateProfileRules, validate, authController.updateProfile);

export default router;
