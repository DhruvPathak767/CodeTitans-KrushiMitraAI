import Recommendation from '../models/Recommendation.js';

class RecommendationRepository {
  /**
   * Persist recommendation record in MongoDB.
   */
  async createRecommendation(data) {
    return await Recommendation.create(data);
  }

  /**
   * Find recommendation history for a farmer.
   */
  async findHistoryByFarmer(farmerId, limit = 20) {
    const query = farmerId ? { farmerId } : {};
    return await Recommendation.find(query).sort({ createdAt: -1 }).limit(limit).lean();
  }

  /**
   * Find recommendation history for a specific farm.
   */
  async findHistoryByFarm(farmId, limit = 10) {
    return await Recommendation.find({ farmId }).sort({ createdAt: -1 }).limit(limit).lean();
  }

  /**
   * Find recommendation by ID.
   */
  async findRecommendationById(id) {
    return await Recommendation.findById(id).lean();
  }
}

export default new RecommendationRepository();
