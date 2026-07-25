import marketService from '../services/market.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

class MarketController {
  /**
   * GET /api/market/prices
   * Fetch current/latest crop prices.
   */
  async getLatestPrices(req, res, next) {
    try {
      const data = await marketService.getLatestPrices(req.query);
      return res
        .status(200)
        .json(new ApiResponse(200, 'Market prices fetched successfully', data.prices, { pagination: data.pagination }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/market/history
   * Fetch historical prices for a crop/market.
   */
  async getPriceHistory(req, res, next) {
    try {
      const data = await marketService.getPriceHistory(req.query);
      return res.status(200).json(new ApiResponse(200, 'Historical market prices fetched successfully', data));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/market/nearby
   * Fetch nearby market prices filtered by district/state/crop.
   */
  async getNearbyMarketPrices(req, res, next) {
    try {
      const data = await marketService.getNearbyMarketPrices(req.query);
      return res.status(200).json(new ApiResponse(200, 'Nearby market prices fetched successfully', data));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/market/crops
   * Return distinct supported crops.
   */
  async getAllCrops(req, res, next) {
    try {
      const crops = await marketService.getAllCrops();
      return res.status(200).json(new ApiResponse(200, 'Supported crops fetched successfully', crops));
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/market/markets
   * Return distinct supported markets.
   */
  async getAllMarkets(req, res, next) {
    try {
      const markets = await marketService.getAllMarkets();
      return res.status(200).json(new ApiResponse(200, 'Supported markets fetched successfully', markets));
    } catch (error) {
      next(error);
    }
  }
}

export default new MarketController();
