import { Router } from 'express';
import {
  predictDisease,
  getDiseaseHistory,
  getDiseaseReportById,
  deleteDiseaseReport,
  clearAllDiseaseHistory,
} from '../controllers/disease.controller.js';

const router = Router();

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
