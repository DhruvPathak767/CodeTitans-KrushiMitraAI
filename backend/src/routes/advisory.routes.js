import express from 'express';
import advisoryController from '../controllers/advisory/advisory.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All advisory endpoints require authentication
router.use(authenticate);

router.get('/', advisoryController.getAdvisory);
router.post('/refresh', advisoryController.refreshAdvisory);
router.get('/history', advisoryController.getAdvisoryHistory);

export default router;
