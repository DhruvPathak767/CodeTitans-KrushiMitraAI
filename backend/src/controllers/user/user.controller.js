import User from '../../models/User.js';

class UserController {
  getLanguage = async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id).select('language preferredLanguage');
      res.status(200).json({
        success: true,
        data: {
          language: user?.language || 'en',
          preferredLanguage: user?.preferredLanguage || 'English',
        },
      });
    } catch (error) {
      next(error);
    }
  };

  updateLanguage = async (req, res, next) => {
    try {
      const { language } = req.body;
      const SUPPORTED = ['en', 'hi', 'gu'];
      const lang = language?.trim()?.toLowerCase();

      if (!lang || !SUPPORTED.includes(lang)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid language code. Supported: en, hi, gu',
        });
      }

      const prefMap = { en: 'English', hi: 'Hindi', gu: 'Gujarati' };

      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            language: lang,
            preferredLanguage: prefMap[lang],
          },
        },
        { new: true }
      ).select('-password');

      res.status(200).json({
        success: true,
        message: 'User language updated successfully',
        data: {
          language: user.language,
          preferredLanguage: user.preferredLanguage,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();
