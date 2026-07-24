import { body } from 'express-validator';
import { LANGUAGES } from '../models/User.js';

// Password rules: min 8 chars, 1 upper, 1 lower, 1 number, 1 special char
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
// Indian phone number regex: starts with 6,7,8,9 and 10 digits
const indianPhoneRegex = /^[6-9]\d{9}$/;

export const signupRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().toLowerCase().isEmail().withMessage('Please provide a valid email address'),
  body('phone')
    .trim()
    .matches(indianPhoneRegex)
    .withMessage('Phone must be a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9'),
  body('password')
    .matches(passwordRegex)
    .withMessage(
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  body('preferredLanguage')
    .optional()
    .isIn(Object.values(LANGUAGES))
    .withMessage(`Language must be one of: ${Object.values(LANGUAGES).join(', ')}`),
];

export const verifyOtpRules = [
  body('email').trim().toLowerCase().isEmail().withMessage('Please provide a valid email address'),
  body('otp').trim().isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be a 6-digit number'),
];

export const loginRules = [
  body('email').trim().toLowerCase().isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const refreshRules = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];

export const forgotPasswordRules = [
  body('email').trim().toLowerCase().isEmail().withMessage('Please provide a valid email address'),
];

export const resetPasswordRules = [
  body('email').trim().toLowerCase().isEmail().withMessage('Please provide a valid email address'),
  body('otp').trim().isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be a 6-digit number'),
  body('newPassword')
    .matches(passwordRegex)
    .withMessage(
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
];

export const updateProfileRules = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('phone')
    .optional()
    .trim()
    .matches(indianPhoneRegex)
    .withMessage('Phone must be a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9'),
  body('preferredLanguage')
    .optional()
    .isIn(Object.values(LANGUAGES))
    .withMessage(`Language must be one of: ${Object.values(LANGUAGES).join(', ')}`),
  body('profileImage').optional().trim().isString().withMessage('Profile image must be a valid URL/string'),
];
