import recommendationService from '../services/recommendation.service.js';
import ApiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/ApiError.js';

class RecommendationController {
  /**
   * POST /api/recommendation/generate
   * Generate AI Sell / Store Decision.
   */
  async generateRecommendation(req, res, next) {
    try {
      const { farmId, storageAvailable, storageCost, storageDuration } = req.body || {};
      const farmerId = req.user?._id || req.body?.farmerId;

      const recommendation = await recommendationService.generateRecommendation({
        farmId,
        farmerId,
        storageAvailable,
        storageCost,
        storageDuration,
      });

      return res
        .status(200)
        .json(new ApiResponse(200, 'Recommendation generated successfully', recommendation));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/recommendation/history
   * Fetch recommendation history.
   */
  async getRecommendationHistory(req, res, next) {
    try {
      const farmerId = req.user?._id || req.query?.farmerId;
      const farmId = req.query?.farmId;

      const history = await recommendationService.getRecommendationHistory(farmerId, farmId);

      return res
        .status(200)
        .json(new ApiResponse(200, 'Recommendation history fetched successfully', history));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/recommendation/:id
   * Fetch complete recommendation details by ID.
   */
  async getRecommendationById(req, res, next) {
    try {
      const { id } = req.params;
      const recommendation = await recommendationService.getRecommendationById(id);

      return res
        .status(200)
        .json(new ApiResponse(200, 'Recommendation details fetched successfully', recommendation));
    } catch (error) {
      next(error);
    }
  }
}

export default new RecommendationController();
