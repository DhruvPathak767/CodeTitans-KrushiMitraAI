import { Router } from 'express';
import {
  predictDisease,
  getDiseaseHistory,
  getDiseaseReportById,
  deleteDiseaseReport,
  clearAllDiseaseHistory,
} from '../controllers/disease.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// All disease detection endpoints require authentication
router.use(authenticate);

/**
 * Disease Detection Routes
 * POST /api/disease/predict
 * GET /api/disease/history
 * DELETE /api/disease/history/all
 * GET /api/disease/:id
 * DELETE /api/disease/:id
 */
router.post('/predict', predictDisease);
router.get('/history', getDiseaseHistory);
router.delete('/history/all', clearAllDiseaseHistory);
router.get('/:id', getDiseaseReportById);
router.delete('/:id', deleteDiseaseReport);

export default router;

