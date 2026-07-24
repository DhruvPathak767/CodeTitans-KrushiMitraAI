import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret || cloudName === 'your_cloudinary_cloud_name') {
  logger.warn('Cloudinary environment variables are missing or default placeholders.');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export default cloudinary;
