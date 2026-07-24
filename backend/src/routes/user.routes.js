import express from 'express';
import userController from '../controllers/user/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/language', userController.getLanguage);
router.put('/language', userController.updateLanguage);

export default router;
