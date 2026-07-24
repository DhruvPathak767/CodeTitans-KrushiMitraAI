import jwt from 'jsonwebtoken';

const getJwtSecret = () => process.env.JWT_SECRET || 'krishimitra_secret_key_change_in_production';
const getRefreshSecret = () => process.env.JWT_REFRESH_SECRET || getJwtSecret();

/**
 * Generate 15-minute Access Token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '15m' });
};

/**
 * Generate 7-day Refresh Token
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, getRefreshSecret(), { expiresIn: '7d' });
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, getJwtSecret());
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, getRefreshSecret());
};
