import dns from 'dns';
import mongoose from 'mongoose';
import logger from './logger.js';

// Set reliable DNS servers to resolve MongoDB Atlas SRV records (_mongodb._tcp)
// when host/ISP DNS fails or blocks SRV resolution.
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  // Ignore if custom DNS cannot be set
}

/**
 * Connect to MongoDB Atlas / Local MongoDB instance using Mongoose.
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI or MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

export default connectDB;
