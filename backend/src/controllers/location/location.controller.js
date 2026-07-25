import locationService from '../../services/location/location.service.js';
import logger from '../../config/logger.js';

class LocationController {
  /**
   * POST /api/location/reverse
   * Reverse geocode GPS latitude & longitude
   */
  async reverseGeocode(req, res, next) {
    try {
      const { latitude, longitude } = req.body;

      if (latitude === undefined || longitude === undefined || isNaN(Number(latitude)) || isNaN(Number(longitude))) {
        return res.status(400).json({
          success: false,
          error: 'Latitude and Longitude are required numbers',
        });
      }

      const lat = Number(latitude);
      const lng = Number(longitude);

      // Validate coordinate ranges (-90 to 90 lat, -180 to 180 lng)
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return res.status(400).json({
          success: false,
          error: 'Invalid coordinates range',
        });
      }

      // Check if coordinates are within India bounding box (approx lat: 6 to 37.5, lng: 68 to 97.5)
      const isWithinIndia = lat >= 6.0 && lat <= 37.5 && lng >= 68.0 && lng <= 97.5;
      if (!isWithinIndia) {
        logger.warn(`Coordinates outside India requested: lat:${lat}, lng:${lng}`);
      }

      const result = await locationService.reverseGeocode(lat, lng);

      res.status(200).json({
        success: true,
        data: {
          ...result,
          isWithinIndia,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/location/search?q=
   * Search locations in India
   */
  async search(req, res, next) {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string' || q.trim().length < 2) {
        return res.status(200).json({
          success: true,
          data: [],
        });
      }

      const results = await locationService.searchLocations(q.trim());
      res.status(200).json({
        success: true,
        data: results,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new LocationController();
