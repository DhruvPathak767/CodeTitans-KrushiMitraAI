import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import logger from './config/logger.js';
import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import diseaseRoutes from './routes/disease.routes.js';
import notFoundMiddleware from './middleware/notFound.middleware.js';
import errorMiddleware from './middleware/error.middleware.js';

const app = express();

// Security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// HTTP request logging via Morgan streamed to Winston
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    project: 'KrishiMitra AI Backend',
    status: 'Running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount Authentication Routes (support both /auth and /api/auth)
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);

// Mount Upload Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Mount Disease Detection Routes
app.use('/api/disease', diseaseRoutes);
app.use('/api/v1/disease', diseaseRoutes);

// 404 Route Handler
app.use(notFoundMiddleware);

// Global Error Handler
app.use(errorMiddleware);

export default app;
