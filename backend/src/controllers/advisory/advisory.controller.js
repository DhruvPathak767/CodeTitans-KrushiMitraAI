import advisoryService from '../../services/advisory/advisory.service.js';
import resolveLang from '../../utils/resolveLang.js';

class AdvisoryController {
  getAdvisory = async (req, res, next) => {
    try {
      const lang = resolveLang(req);
      const data = await advisoryService.getLatestAdvisory(req.user, false, lang);
      res.status(200).json({
        success: true,
        message: 'AI Crop Advisory retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  refreshAdvisory = async (req, res, next) => {
    try {
      const lang = resolveLang(req);
      const data = await advisoryService.refreshAdvisory(req.user, lang);
      res.status(200).json({
        success: true,
        message: 'Fresh AI Crop Advisory generated successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  getAdvisoryHistory = async (req, res, next) => {
    try {
      const history = await advisoryService.getAdvisoryHistory(req.user);
      res.status(200).json({
        success: true,
        message: 'Advisory history fetched successfully',
        data: history,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new AdvisoryController();
