import CropAdvisory from '../../models/CropAdvisory.js';
import weatherService from '../weather/weather.service.js';
import groqService from '../ai/groq.service.js';
import farmRepository from '../../repositories/farm/farm.repository.js';
import logger from '../../config/logger.js';

class AdvisoryService {
  /**
   * Resolve user's active farm
   */
  async resolveActiveFarm(user) {
    let farm = null;
    if (user && user.activeFarm) {
      const farmId = typeof user.activeFarm === 'string' ? user.activeFarm : user.activeFarm._id;
      farm = await farmRepository.findFarmById(farmId);
    }
    if (!farm && user && user._id) {
      farm = await farmRepository.findFirstUserFarm(user._id);
    }
    if (!farm) {
      farm = await farmRepository.findFirstUserFarm();
    }
    if (!farm) {
      const error = new Error('No active farm found in database. Please register a farm first.');
      error.statusCode = 400;
      throw error;
    }
    return farm;
  }

  /**
   * Rule Engine Fallback Generator when Groq API fails or rate-limits
   */
  buildRuleEngineFallbackAdvisory(farm, weather, growthStage) {
    const current = weather.current || {};
    const agriculture = weather.agriculture || {};

    const isHighRain = current.rainProbability >= 60;
    const isHighTemp = current.temperature >= 35;
    const isHighHumid = current.humidity >= 80;

    return {
      cropHealthScore: isHighHumid && isHighRain ? 78 : isHighTemp ? 82 : 91,
      priority: isHighRain || isHighHumid ? 'High' : 'Medium',
      irrigation: {
        status: isHighRain ? 'Delay Irrigation' : isHighTemp ? 'Schedule Evening Irrigation' : 'Normal Schedule',
        reason: isHighRain ? 'Natural rain expected' : isHighTemp ? 'High evaporation rate' : 'Moisture balanced',
      },
      fertilizer: {
        status: isHighRain ? 'Postpone Application' : 'Apply Standard Dose',
        reason: isHighRain ? 'Prevent runoff' : 'Favorable soil conditions',
      },
      diseaseRisk: {
        level: isHighHumid ? 'High' : 'Medium',
        reason: isHighHumid ? 'High humidity favors spores' : 'Standard seasonal risk',
      },
      pestRisk: {
        level: 'Low',
        reason: 'Normal insect activity',
      },
      weedRisk: {
        level: 'Medium',
        reason: 'Soil moisture supports weed growth',
      },
      waterStress: {
        level: isHighTemp ? 'Medium' : 'Low',
        reason: isHighTemp ? 'Thermal transpiration' : 'Adequate soil water',
      },
      heatStress: {
        level: isHighTemp ? 'High' : 'Low',
        reason: isHighTemp ? 'High ambient heat' : 'Optimal temperature',
      },
      sprayWindow: {
        bestTime: isHighRain ? 'Wait for dry window' : 'Tomorrow 6:00 AM - 9:00 AM',
        suitable: !isHighRain,
      },
      harvestReadiness: {
        percentage: growthStage === 'Harvest Readiness' ? 90 : growthStage === 'Fruiting' ? 60 : 20,
      },
      fieldWork: {
        status: isHighRain ? 'Drainage Maintenance' : 'Favorable Field Operations',
        morning: 'Field inspection',
        afternoon: 'Canopy check',
        evening: 'Equipment prep',
        night: 'Rest',
      },
      timeline: {
        step1Today: 'Inspect drainage channels.',
        step2Tomorrow: 'Check crop leaves for fungal spots.',
        step3Next3Days: 'Monitor weather updates.',
      },
      estimatedYieldImpact: '+10%',
      estimatedWaterSaving: '15%',
      estimatedCostSaving: '₹800',
      nextAction: 'Monitor field humidity and lower leaves.',
      warning: isHighHumid ? 'High humidity alert for fungal disease.' : 'Maintain regular monitoring.',
      reason: 'Rule engine evaluated weather metrics against agronomic threshold limits.',
      confidence: '88% (Rule Engine)',
    };
  }

  /**
   * Generate or retrieve advisory for active farm
   */
  async getLatestAdvisory(user, forceRefresh = false, lang = 'en') {
    const farm = await this.resolveActiveFarm(user);

    // 1. Check MongoDB CropAdvisory cache (6-hour TTL) unless forceRefresh is true
    if (!forceRefresh) {
      const cached = await CropAdvisory.findOne({
        farmId: farm._id,
        lang: lang,
        expiresAt: { $gt: new Date() },
      }).sort({ createdAt: -1 });

      if (cached) {
        logger.info(`CropAdvisory Cache HIT for farmId [${farm._id}] (${farm.farmName}) lang [${lang}]`);
        return {
          isCached: true,
          advisory: cached.groqResponse,
          growthStage: cached.growthStage,
          weatherSnapshot: cached.weatherSnapshot,
          ruleEngineFallback: cached.ruleEngineFallback,
          lastUpdated: cached.createdAt,
          expiresAt: cached.expiresAt,
        };
      }
    }

    logger.info(`CropAdvisory Cache MISS for farmId [${farm._id}] lang [${lang}]. Fetching live weather & Groq AI...`);

    // 2. Fetch fresh live weather from WeatherAPI
    const weather = await weatherService.getWeatherForActiveFarm(user, lang);

    // 3. Calculate growth stage
    const growthStage = groqService.calculateGrowthStage(farm.sowingDate);

    // 4. Generate AI advisory using Groq AI with multi-language target
    let groqResult = null;
    let isFallback = false;

    try {
      groqResult = await groqService.generateCropAdvisory({
        farm,
        weather,
        agriculture: weather.agriculture || {},
        growthStage,
      }, lang);
    } catch (err) {
      logger.error(`Groq AI generation failed (${err.message}). Attempting fallback advisory...`);
      // Try finding most recent historical advisory document for target lang
      const lastDoc = await CropAdvisory.findOne({ farmId: farm._id, lang: lang }).sort({ createdAt: -1 });
      if (lastDoc) {
        return {
          isCached: true,
          isStale: true,
          advisory: lastDoc.groqResponse,
          growthStage: lastDoc.growthStage,
          weatherSnapshot: lastDoc.weatherSnapshot,
          ruleEngineFallback: true,
          lastUpdated: lastDoc.createdAt,
        };
      }

      // Generate Rule Engine fallback
      groqResult = {
        advisory: this.buildRuleEngineFallbackAdvisory(farm, weather, growthStage),
        meta: { model: 'Agriculture-Rule-Engine' },
      };
      isFallback = true;
    }

    // 5. Store in MongoDB with 6-hour TTL
    const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000);
    const advisoryDoc = await CropAdvisory.create({
      userId: user._id,
      farmId: farm._id,
      lang: lang,
      cropName: farm.cropName || 'General Crop',
      growthStage,
      weatherSnapshot: {
        temperature: weather.current?.temperature,
        humidity: weather.current?.humidity,
        windSpeed: weather.current?.windSpeed,
        condition: weather.current?.weatherCondition,
        location: weather.location?.weatherLocationName,
      },
      groqResponse: groqResult.advisory,
      ruleEngineFallback: isFallback,
      expiresAt,
    });

    logger.info(`Stored new CropAdvisory document [${advisoryDoc._id}] in MongoDB for farm [${farm._id}]`);

    return {
      isCached: false,
      advisory: groqResult.advisory,
      growthStage,
      weatherSnapshot: advisoryDoc.weatherSnapshot,
      ruleEngineFallback: isFallback,
      meta: groqResult.meta,
      lastUpdated: advisoryDoc.createdAt,
      expiresAt,
    };
  }

  /**
   * Force refresh advisory using Groq AI
   */
  async refreshAdvisory(user, lang = 'en') {
    return this.getLatestAdvisory(user, true, lang);
  }

  /**
   * Get advisory history list for active farm
   */
  async getAdvisoryHistory(user) {
    const farm = await this.resolveActiveFarm(user);
    const history = await CropAdvisory.find({ farmId: farm._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return history;
  }
}

export default new AdvisoryService();
