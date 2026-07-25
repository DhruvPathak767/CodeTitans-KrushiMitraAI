import { Router } from 'express';
import recommendationController from '../controllers/recommendation.controller.js';

const router = Router();

// POST /api/recommendation/generate - Generate AI recommendation
router.post('/generate', recommendationController.generateRecommendation);

// GET /api/recommendation/history - Fetch farmer's recommendation history
router.get('/history', recommendationController.getRecommendationHistory);

// GET /api/recommendation/:id - Fetch recommendation details by ID
router.get('/:id', recommendationController.getRecommendationById);

export default router;
