import chatService from '../../services/ai/chat.service.js';
import resolveLang from '../../utils/resolveLang.js';

class ChatController {
  sendMessage = async (req, res, next) => {
    try {
      const { message } = req.body;
      if (!message || !message.trim()) {
        return res.status(400).json({ success: false, message: 'Message content is required' });
      }

      const lang = resolveLang(req);
      const result = await chatService.processMessage({
        user: req.user,
        message: message.trim(),
        lang,
      });

      res.status(200).json({
        success: true,
        message: 'AI Response generated successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getHistory = async (req, res, next) => {
    try {
      const history = await chatService.getHistory(req.user._id);
      res.status(200).json({
        success: true,
        message: 'Chat history retrieved successfully',
        data: history,
      });
    } catch (error) {
      next(error);
    }
  };

  clearHistory = async (req, res, next) => {
    try {
      await chatService.clearHistory(req.user._id);
      res.status(200).json({
        success: true,
        message: 'Chat history cleared successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new ChatController();
