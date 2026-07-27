import irrigationService from '../services/irrigation/irrigation.service.js';
import resolveLang from '../utils/resolveLang.js';

class IrrigationController {
  /**
   * GET /api/irrigation
   * Return latest recommendation
   */
  getIrrigation = async (req, res, next) => {
    try {
      const lang = resolveLang(req);
      const data = await irrigationService.getLatestRecommendation(req.user, false, lang);
      res.status(200).json({
        success: true,
        message: 'Smart Irrigation Recommendation retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/irrigation/refresh
   * Force regenerate recommendation
   */
  refreshIrrigation = async (req, res, next) => {
    try {
      const lang = resolveLang(req);
      const data = await irrigationService.refreshRecommendation(req.user, lang);
      res.status(200).json({
        success: true,
        message: 'Fresh Smart Irrigation Recommendation generated successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/irrigation/history
   * Return previous recommendation history
   */
  getIrrigationHistory = async (req, res, next) => {
    try {
      const history = await irrigationService.getIrrigationHistory(req.user);
      res.status(200).json({
        success: true,
        message: 'Smart Irrigation history fetched successfully',
        data: history,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new IrrigationController();
