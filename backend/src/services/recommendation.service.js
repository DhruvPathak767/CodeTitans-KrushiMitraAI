import pricePredictionService from './pricePrediction.service.js';
import recommendationRepository from '../repositories/recommendation.repository.js';
import marketRepository from '../repositories/market.repository.js';
import ruleEngineService from './ruleEngine.service.js';
import groqPromptService from './groqPrompt.service.js';
import Farm from '../models/Farm.js';
import DiseaseReport from '../models/DiseaseReport.js';
import ApiError from '../utils/ApiError.js';
import logger from '../config/logger.js';

class RecommendationService {
  /**
   * Generates AI Sell/Store Decision for a farm.
   */
  async generateRecommendation({ farmId, farmerId, storageAvailable = true, storageCost = 0, storageDuration = 7 }) {
    let farm = null;

    if (farmId) {
      farm = await Farm.findById(farmId).lean();
    }

    // Fallback farm context if no specific farm ID supplied or not found
    if (!farm) {
      farm = {
        _id: farmId || null,
        cropName: 'Cotton',
        area: 5,
        address: { district: 'Rajkot', state: 'Gujarat', village: 'Rajkot' },
        location: { coordinates: [70.8022, 22.3039] },
      };
    }

    const crop = farm.cropName || 'Cotton';
    const quantity = (farm.area || 5) * 20; // 20 Quintals per acre default estimate
    const district = farm.address?.district || 'Rajkot';
    const state = farm.address?.state || 'Gujarat';

    // Fetch Market Telemetry
    let latestPrices = await marketRepository.findLatestPrices({
      filters: { crop: { $regex: new RegExp(`^${crop}$`, 'i') } },
      limit: 1,
    });

    let currentPrice = latestPrices.data[0]?.price || 7250;
    
    // Fetch 15-Day Market Forecast from Python AI
    let trend = 'STABLE';
    let predictedFuturePrice = currentPrice;
    try {
      const prediction = await pricePredictionService.predictPrice({
        crop,
        market: district ? `${district} APMC` : 'Rajkot APMC',
        district,
        farmId,
        farmerId,
      });
      trend = prediction.trend.toUpperCase();
      predictedFuturePrice = prediction.after15days;
    } catch (e) {
      logger.warn('Failed to fetch Python AI prediction for recommendation. Defaulting to STABLE.');
    }

    const marketForecast = { trend, predictedPrice: predictedFuturePrice };

    // Fetch Weather Telemetry
    const weather = {
      current: {
        temperature: 28,
        humidity: 65,
        rainProbability: 15,
      },
    };

    // Fetch Disease Status
    let diseaseReport = null;
    if (farmId) {
      diseaseReport = await DiseaseReport.findOne({ farmId }).sort({ createdAt: -1 }).lean();
    }

    const diseaseStatus = {
      diseaseStatus: diseaseReport?.diseaseName || 'Healthy',
      severity: diseaseReport?.severity || 'LOW',
    };

    // Construct Payload
    const payload = {
      crop,
      quantity,
      currentPrice,
      historicalTrend: marketForecast,
      weather,
      diseaseReport: diseaseStatus,
      storageAvailable: Boolean(storageAvailable),
      storageCost: Number(storageCost) || 0,
      storageDuration: Number(storageDuration) || 7,
      location: farm.address || { district, state },
    };

    // 1. Evaluate Rule Engine
    const ruleContext = ruleEngineService.evaluateRules(payload);

    // 2. Execute Groq AI Prompt
    const aiResult = await groqPromptService.generateDecision(payload, ruleContext);

    // Calculate predicted price based on decision
    let predictedPrice = currentPrice;
    if (aiResult.decision === 'STORE') {
      predictedPrice = Math.round(currentPrice * 1.12);
    } else if (aiResult.decision === 'SELL_NOW') {
      predictedPrice = currentPrice;
    } else if (aiResult.decision.includes('DISEASE') || aiResult.decision.includes('WEATHER')) {
      predictedPrice = Math.round(currentPrice * 0.9);
    }

    // 3. Persist Recommendation in MongoDB
    const newRecommendation = await recommendationRepository.createRecommendation({
      farmerId: farmerId || null,
      farmId: farm._id || null,
      crop,
      quantity,
      marketPrice: currentPrice,
      predictedPrice,
      weatherRisk: `${weather.current.rainProbability}% Rain Risk`,
      diseaseStatus: diseaseStatus.diseaseStatus,
      storageAvailable: Boolean(storageAvailable),
      storageCost: Number(storageCost) || 0,
      location: `${farm.address?.district || 'Rajkot'}, ${farm.address?.state || 'Gujarat'}`,
      decision: aiResult.decision,
      estimatedProfit: aiResult.estimatedProfit,
      riskLevel: aiResult.riskLevel,
      confidence: aiResult.confidence,
      reason: aiResult.reason,
      recommendationSummary: aiResult.recommendationSummary,
    });

    return {
      id: newRecommendation._id,
      crop: newRecommendation.crop,
      quantity: newRecommendation.quantity,
      marketPrice: newRecommendation.marketPrice,
      predictedPrice: newRecommendation.predictedPrice,
      decision: newRecommendation.decision,
      estimatedProfit: newRecommendation.estimatedProfit,
      riskLevel: newRecommendation.riskLevel,
      confidence: newRecommendation.confidence,
      reason: newRecommendation.reason,
      recommendationSummary: newRecommendation.recommendationSummary,
      storageAvailable: newRecommendation.storageAvailable,
      storageCost: newRecommendation.storageCost,
      createdAt: newRecommendation.createdAt,
    };
  }

  /**
   * Fetch recommendation history.
   */
  async getRecommendationHistory(farmerId, farmId) {
    if (farmId) {
      return await recommendationRepository.findHistoryByFarm(farmId);
    }
    return await recommendationRepository.findHistoryByFarmer(farmerId);
  }

  /**
   * Fetch recommendation by ID.
   */
  async getRecommendationById(id) {
    const rec = await recommendationRepository.findRecommendationById(id);
    if (!rec) {
      throw new ApiError(404, `Recommendation not found with ID ${id}`);
    }
    return rec;
  }
}

export default new RecommendationService();
