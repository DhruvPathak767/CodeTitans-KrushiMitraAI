import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import logger from './config/logger.js';
import authRoutes from './routes/auth.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import diseaseRoutes from './routes/disease.routes.js';
import farmRoutes from './routes/farm.routes.js';
import weatherRoutes from './routes/weather.routes.js';
import advisoryRoutes from './routes/advisory.routes.js';
import chatRoutes from './routes/chat.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import userRoutes from './routes/user.routes.js';
import marketRoutes from './routes/market.routes.js';
import recommendationRoutes from './routes/recommendation.routes.js';
import pricePredictionRoutes from './routes/pricePrediction.routes.js';
import locationRoutes from './routes/location.routes.js';
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

// Mount Authentication Routes
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);

// Mount Location Routes
app.use('/location', locationRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/v1/location', locationRoutes);

// Mount Upload Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Mount Disease Detection Routes
app.use('/api/disease', diseaseRoutes);
app.use('/api/v1/disease', diseaseRoutes);

// Mount Farm Management Routes
app.use('/farms', farmRoutes);
app.use('/api/farms', farmRoutes);

// Mount Weather Routes
app.use('/weather', weatherRoutes);
app.use('/api/weather', weatherRoutes);

// Mount AI Crop Advisory Routes
app.use('/advisory', advisoryRoutes);
app.use('/api/advisory', advisoryRoutes);

// Mount AI Chat Assistant Routes
app.use('/chat', chatRoutes);
app.use('/api/chat', chatRoutes);

// Mount Notification Routes
app.use('/notifications', notificationRoutes);
app.use('/api/notifications', notificationRoutes);

// Mount User Preference Routes
app.use('/user', userRoutes);
app.use('/api/user', userRoutes);

// Mount Market Intelligence Routes
app.use('/market', marketRoutes);
app.use('/api/market', marketRoutes);

// Mount AI Sell/Store Recommendation Routes
app.use('/recommendation', recommendationRoutes);
app.use('/api/recommendation', recommendationRoutes);

// Mount Crop Price Prediction Routes
app.use('/price-prediction', pricePredictionRoutes);
app.use('/api/price-prediction', pricePredictionRoutes);

// 404 Route Handler
app.use(notFoundMiddleware);

// Global Error Handler
app.use(errorMiddleware);

export default app;
