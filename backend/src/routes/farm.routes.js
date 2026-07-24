import express from 'express';
import farmController from '../controllers/farm/farm.controller.js';
import validate from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  createFarmRules,
  updateFarmRules,
  farmIdRule,
  farmQueryRules,
} from '../validations/farm.validation.js';

const router = express.Router();

// All farm routes require authentication
router.use(authenticate);

router.post('/', createFarmRules, validate, farmController.createFarm);
router.get('/check', farmController.checkFarmStatus);
router.get('/', farmQueryRules, validate, farmController.getFarms);
router.get('/:id', farmIdRule, validate, farmController.getFarmById);
router.put('/:id', updateFarmRules, validate, farmController.updateFarm);
router.delete('/:id', farmIdRule, validate, farmController.deleteFarm);
router.patch('/:id/select', farmIdRule, validate, farmController.selectActiveFarm);

export default router;
