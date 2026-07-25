import { Router } from 'express';
import marketController from '../controllers/market.controller.js';

const router = Router();

// GET /api/market/prices - Fetch latest market prices
router.get('/prices', marketController.getLatestPrices);

// GET /api/market/history - Fetch historical prices
router.get('/history', marketController.getPriceHistory);

// GET /api/market/nearby - Fetch nearby market prices
router.get('/nearby', marketController.getNearbyMarketPrices);

// GET /api/market/crops - Fetch all supported crops
router.get('/crops', marketController.getAllCrops);

// GET /api/market/markets - Fetch all supported markets
router.get('/markets', marketController.getAllMarkets);

export default router;
