import notificationService from '../../services/notification/notification.service.js';
import resolveLang from '../../utils/resolveLang.js';

class NotificationController {
  getNotifications = async (req, res, next) => {
    try {
      const lang = resolveLang(req);
      const data = await notificationService.getUserNotifications(req.user, lang);
      res.status(200).json({
        success: true,
        message: 'Notifications fetched successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  markRead = async (req, res, next) => {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Notification id is required' });
      }

      await notificationService.markAsRead(req.user._id, id);
      res.status(200).json({
        success: true,
        message: 'Notification marked as read',
      });
    } catch (error) {
      next(error);
    }
  };

  markAllRead = async (req, res, next) => {
    try {
      await notificationService.markAllAsRead(req.user._id);
      res.status(200).json({
        success: true,
        message: 'All notifications marked as read',
      });
    } catch (error) {
      next(error);
    }
  };

  deleteNotification = async (req, res, next) => {
    try {
      const { id } = req.query;
      await notificationService.deleteNotification(req.user._id, id || null);
      res.status(200).json({
        success: true,
        message: id ? 'Notification deleted successfully' : 'All notifications cleared',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new NotificationController();
