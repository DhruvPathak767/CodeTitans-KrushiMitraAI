import express from 'express';
import notificationController from '../controllers/notification/notification.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', notificationController.getNotifications);
router.post('/read', notificationController.markRead);
router.post('/read-all', notificationController.markAllRead);
router.delete('/', notificationController.deleteNotification);

export default router;
