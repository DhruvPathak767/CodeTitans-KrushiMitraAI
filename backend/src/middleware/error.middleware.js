import logger from '../config/logger.js';

/**
 * Global Error Handling Middleware
 */
const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const message = err.message || 'Internal Server Error';

  logger.error(`[${req.method}] ${req.originalUrl} - ${statusCode} - ${message}`, {
    stack: err.stack,
  });

  const response = {
    success: false,
    message: message,
    errors: err.errors || [],
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorMiddleware;
