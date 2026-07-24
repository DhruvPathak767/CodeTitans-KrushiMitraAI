import express from 'express';
import weatherController from '../controllers/weather/weather.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// STEP 1: Development Debug Endpoint accessible WITHOUT JWT authentication
router.get('/debug', weatherController.getDebugWeather);

// Authenticated Weather Endpoints
router.use(authenticate);

router.get('/', weatherController.getWeather);
router.get('/dashboard', weatherController.getDashboardWeather);
router.get('/current', weatherController.getCurrentWeather);
router.get('/forecast', weatherController.getForecast);

export default router;
