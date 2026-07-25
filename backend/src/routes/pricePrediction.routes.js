import { Router } from 'express';
import pricePredictionController from '../controllers/pricePrediction.controller.js';

const router = Router();

// POST /api/price-prediction - Generate price prediction
router.post('/', pricePredictionController.generatePrediction);

// GET /api/price-prediction/history - Fetch prediction history
router.get('/history', pricePredictionController.getPredictionHistory);

// GET /api/price-prediction/:id - Fetch prediction details by ID
router.get('/:id', pricePredictionController.getPredictionById);

export default router;
