import pricePredictionService from '../services/pricePrediction.service.js';
import ApiResponse from '../utils/apiResponse.js';
import ApiError from '../utils/ApiError.js';

class PricePredictionController {
  /**
   * POST /api/price-prediction
   * Generate crop market price prediction.
   */
  async generatePrediction(req, res, next) {
    try {
      const { crop, market, district, farmId } = req.body || {};
      const farmerId = req.user?._id || req.body?.farmerId;

      if (!crop) {
        throw new ApiError(400, 'Crop parameter is required for price prediction');
      }

      const prediction = await pricePredictionService.predictPrice({
        crop,
        market: market || 'Rajkot APMC',
        district: district || 'Rajkot',
        farmerId,
        farmId,
      });

      return res
        .status(200)
        .json(new ApiResponse(200, 'Price prediction generated successfully', prediction));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/price-prediction/history
   * Fetch previous price predictions.
   */
  async getPredictionHistory(req, res, next) {
    try {
      const farmerId = req.user?._id || req.query?.farmerId;
      const { farmId, crop } = req.query;

      const history = await pricePredictionService.getPredictionHistory({ farmerId, farmId, crop });

      return res
        .status(200)
        .json(new ApiResponse(200, 'Price prediction history fetched successfully', history));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/price-prediction/:id
   * Fetch complete prediction details by ID.
   */
  async getPredictionById(req, res, next) {
    try {
      const { id } = req.params;
      const prediction = await pricePredictionService.getPredictionById(id);

      return res
        .status(200)
        .json(new ApiResponse(200, 'Price prediction details fetched successfully', prediction));
    } catch (error) {
      next(error);
    }
  }
}

export default new PricePredictionController();
