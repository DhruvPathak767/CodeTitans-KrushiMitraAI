import dotenv from 'dotenv';

// Load environment variables before any other imports (SMTP & DB updated)
dotenv.config();

import app from './app.js';
import connectDB from './config/database.js';
import logger from './config/logger.js';
import { seedSuperAdmin } from './utils/seeder.js';

const PORT = process.env.PORT || 5000;

/**
 * Initialize backend server after establishing database connection.
 */
const startServer = async () => {
  try {
    // Ensure MongoDB connects before starting express listener
    await connectDB();

    // Seed default Super Admin account if not found
    await seedSuperAdmin();

    const server = app.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      logger.info(`Health check available at http://localhost:${PORT}/`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error(`Unhandled Rejection Error: ${err.message}`, { stack: err.stack });
      server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      logger.error(`Uncaught Exception Error: ${err.message}`, { stack: err.stack });
      process.exit(1);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
