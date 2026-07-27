import express from 'express';
import irrigationController from '../controllers/irrigation.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All irrigation endpoints require authentication
router.use(authenticate);

// GET /api/irrigation
router.get('/', irrigationController.getIrrigation);

// POST /api/irrigation/refresh
router.post('/refresh', irrigationController.refreshIrrigation);

// GET /api/irrigation/history
router.get('/history', irrigationController.getIrrigationHistory);

export default router;
