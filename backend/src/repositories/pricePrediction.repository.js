import PricePrediction from '../models/PricePrediction.js';

class PricePredictionRepository {
  /**
   * Create and store price prediction document in MongoDB.
   */
  async createPrediction(data) {
    return await PricePrediction.create(data);
  }

  /**
   * Find previous price predictions for farmer or farm.
   */
  async findHistory({ farmerId, farmId, crop, limit = 20 }) {
    const query = {};
    if (farmerId) query.farmerId = farmerId;
    if (farmId) query.farmId = farmId;
    if (crop) query.crop = { $regex: new RegExp(`^${crop}$`, 'i') };

    return await PricePrediction.find(query).sort({ createdAt: -1 }).limit(limit).lean();
  }

  /**
   * Find prediction record by ID.
   */
  async findPredictionById(id) {
    return await PricePrediction.findById(id).lean();
  }
}

export default new PricePredictionRepository();
