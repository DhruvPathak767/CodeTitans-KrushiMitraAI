import { Groq } from 'groq-sdk';
import IrrigationCache from '../../models/IrrigationCache.js';
import farmRepository from '../../repositories/farm/farm.repository.js';
import weatherService from '../weather/weather.service.js';
import irrigationEngine from './irrigationEngine.service.js';
import logger from '../../config/logger.js';

class IrrigationService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    if (this.apiKey) {
      this.groq = new Groq({ apiKey: this.apiKey });
    }
  }

  /**
   * Resolve user's active farm strictly from DB
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
   * Generate Groq AI Explanation based STRICTLY on calculated facts in target language
   */
  async generateGroqExplanation(facts, lang = 'en') {
    if (!this.groq && process.env.GROQ_API_KEY) {
      this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }

    if (!this.groq) {
      logger.warn('GROQ_API_KEY missing. Returning rule-engine deterministic explanation.');
      return {
        explanation: this.buildFallbackExplanation(facts, lang),
        meta: { model: 'Rule-Engine-Fallback' },
        ruleEngineFallback: true,
      };
    }

    const langName = lang === 'hi' ? 'Hindi (हिन्दी)' : lang === 'gu' ? 'Gujarati (ગુજરાતી)' : 'English';

    const systemPrompt = `You are an expert agronomic irrigation guide. Never invent weather or crop data. Use only supplied facts. You MUST return all text values in ${langName}. Return raw JSON only.`;

    const userPrompt = `
FACTS:
- Crop: ${facts.growthStageImpact.crop} (Stage: ${facts.growthStageImpact.stage}, Day ${facts.growthStageImpact.daysSinceSowing})
- Soil Type: ${facts.soilImpact.soilType} (${facts.soilImpact.drainage})
- Temperature: ${facts.heatImpact.temperature}°C (Heat Stress Level: ${facts.heatImpact.heatStressLevel})
- Humidity: ${facts.heatImpact.humidity}%
- Rain Probability: ${facts.rainImpact.probability}% (Expected Rain: ${facts.rainImpact.expectedMm}mm)
- Calculated Status: ${facts.status} (Priority: ${facts.priority})
- Recommended Water Quantity: ${facts.estimatedWaterQuantity} Liters
- Estimated Drip Duration: ${facts.estimatedDuration}
- Deterministic Rule Triggered: ${facts.reason}
- Target Language: ${langName}

CRITICAL REQUIREMENT:
Return ONLY a raw JSON object with all text content strictly translated into ${langName}:
{
  "farmerExplanation": "Clear, practical farmer advisory explaining why this irrigation decision was made.",
  "precautions": ["Precaution 1 in ${langName}", "Precaution 2 in ${langName}"],
  "waterSavingTips": ["Water saving tip 1 in ${langName}", "Water saving tip 2 in ${langName}"],
  "fertilizerSuggestion": "Fertigation / fertilizer application suggestion for ${facts.growthStageImpact.stage} stage in ${langName}.",
  "warning": "Important weather, overflow, or heat stress warning in ${langName}."
}
Return raw JSON ONLY without markdown backticks.`;

    const startTime = Date.now();
    try {
      logger.info(`Invoking Groq AI (llama-3.3-70b-versatile, temp 0.2) in ${langName}...`);
      const completion = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      });

      const latency = Date.now() - startTime;
      logger.info(`Groq AI irrigation explanation completed in ${latency}ms`);

      const raw = completion.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(raw);

      return {
        explanation: {
          farmerExplanation: parsed.farmerExplanation || facts.todayRecommendation,
          precautions: Array.isArray(parsed.precautions) ? parsed.precautions : [facts.soilImpact.impactSummary],
          waterSavingTips: Array.isArray(parsed.waterSavingTips)
            ? parsed.waterSavingTips
            : [`Save ~${facts.analytics.estimatedWaterSaved}L water by maintaining scheduled drip pressure.`],
          fertilizerSuggestion:
            parsed.fertilizerSuggestion ||
            `Apply balanced fertigation suitable for ${facts.growthStageImpact.stage} stage.`,
          warning: parsed.warning || `Monitor humidity and canopy temperature during peak heat hours.`,
        },
        meta: { model: 'llama-3.3-70b-versatile', latencyMs: latency },
        ruleEngineFallback: false,
      };
    } catch (err) {
      logger.error(`Groq AI generation failed: ${err.message}. Using rule-engine fallback.`);
      return {
        explanation: this.buildFallbackExplanation(facts, lang),
        meta: { model: 'Rule-Engine-Fallback', error: err.message },
        ruleEngineFallback: true,
      };
    }
  }

  /**
   * Rule Engine Fallback Explanation when Groq API fails
   */
  buildFallbackExplanation(facts, lang = 'en') {
    const isHi = lang === 'hi';
    const isGu = lang === 'gu';

    if (facts.statusEn === 'Delay' || String(facts.status).includes('Delay') || String(facts.status).includes('टालें') || String(facts.status).includes('મુલતવી')) {
      return {
        farmerExplanation: isHi
          ? `पूर्वानुमानित बारिश (${facts.rainImpact.expectedMm}mm) के कारण सिंचाई 48 घंटे के लिए स्थगित करें। इससे पानी और बिजली की बचत होगी।`
          : isGu
          ? `આગાહી કરેલ વરસાદ (${facts.rainImpact.expectedMm}mm) ના કારણે સિંચાઈ 48 કલાક માટે મુલતવી રાખો.`
          : `Postpone irrigation for 48 hours due to forecasted rain (${facts.rainImpact.expectedMm}mm). This prevents waterlogging and nutrient leaching.`,
        precautions: [
          isHi ? 'खेत में अतिरिक्त पानी के निकास के लिए जल निकासी मार्ग साफ रखें।' : isGu ? 'ખેતરમાં વધારે પાણીના નિકાલ માટે ગટર સાફ રાખો.' : 'Ensure field drainage channels are clear to prevent standing water.',
          isHi ? 'बारिश के बाद ही सिंचाई की आवश्यकता की समीक्षा करें।' : isGu ? 'વરસાદ પછી જ પિયતની જરૂરિયાત ચકાસો.' : 'Review moisture status after the rain spell before resuming pump operations.',
        ],
        waterSavingTips: [
          isHi ? 'वर्षा जल का उपयोग कर सिंचाई चक्र को टालें।' : isGu ? 'વરસાદી પાણીનો ઉપયોગ કરી પિયત ખર્ચ બચાવો.' : 'Utilize natural rainwater to reduce electrical pumping operational costs.',
        ],
        fertilizerSuggestion: isHi
          ? 'बारिश के दौरान उर्वरक देने से बचें।'
          : isGu
          ? 'વરસાદ દરમિયાન ખાતર આપવાનું ટાળો.'
          : 'Delay fertigation until heavy rain passes to prevent nutrient runoff.',
        warning: isHi ? 'उच्च आर्द्रता और जलभराव से फंगल रोग का जोखिम बढ़ता है।' : isGu ? 'વધારે ભેજ અને પાણી ભરાવાથી ફૂગના રોગનું જોખમ વધે છે.' : 'High humidity and waterlogging increase fungal disease vulnerability.',
      };
    }

    if (facts.statusEn === 'Irrigate Now' || String(facts.status).includes('Irrigate') || String(facts.status).includes('तुरंत') || String(facts.status).includes('તરત')) {
      return {
        farmerExplanation: isHi
          ? `उच्च तापमान (${facts.heatImpact.temperature}°C) और ${facts.growthStageImpact.stage} अवस्था के कारण फसल को तुरंत सिंचाई की आवश्यकता है।`
          : isGu
          ? `ઉચ્ચ તાપમાન (${facts.heatImpact.temperature}°C) અને ${facts.growthStageImpact.stage} તબક્કાને કારણે પાકને તરત જ સિંચાઈની જરૂર છે.`
          : `Crop requires immediate irrigation of ${facts.estimatedWaterQuantity.toLocaleString()} Liters due to ${facts.heatImpact.temperature}°C temperature during the critical ${facts.growthStageImpact.stage} phase.`,
        precautions: [
          isHi ? 'दोपहर के समय सिंचाई से बचें, केवल सुबह (6-9 AM) सिंचाई करें।' : isGu ? 'બપોરના સમયે પિયત ટાળો, ફક્ત સવારે (6-9 AM) પિયત આપો.' : 'Irrigate strictly during early morning (6:00 AM - 9:00 AM) to minimize evaporation loss.',
          isHi ? 'ड्रिप लाइन में दबाव और लीकेज की जांच करें।' : isGu ? 'ડ્રિપ લાઈનમાં પ્રેશર અને લીકેજ ચકાસો.' : 'Verify drip line pressure to maintain uniform lateral flow across all rows.',
        ],
        waterSavingTips: [
          isHi ? 'मल्चिंग का उपयोग कर वाष्पीकरण कम करें।' : isGu ? 'મલ્ચિંગનો ઉપયોગ કરી બાષ્પીભવન ઓછું કરો.' : 'Apply organic mulching along crop rows to reduce soil surface evaporation.',
        ],
        fertilizerSuggestion: isHi
          ? 'ड्रिप के माध्यम से घुलनशील उर्वरक (NPK) दें।'
          : isGu
          ? 'ડ્રિપ દ્વારા દ્રાવ્ય ખાતર (NPK) આપો.'
          : `Apply water-soluble N-P-K fertigation suited for ${facts.growthStageImpact.stage} growth phase during early morning drip run.`,
        warning: isHi ? 'दोपहर में पानी देने से पत्तियों के जलने का खतरा रहता है।' : isGu ? 'બપોરે પાણી આપવાથી પાંદડા બળવાનું જોખમ રહે છે.' : 'Avoid mid-day sprinkler application to prevent foliage scorching under direct heat.',
      };
    }

    return {
      farmerExplanation: isHi
        ? `वर्तमान मृदा नमी और मौसम की स्थितियां सामान्य हैं। नियमित सिंचाई तालिका का पालन करें।`
        : isGu
        ? `વર્તમાન જમીનનો ભેજ અને હવામાન સાધારણ છે. નિયમિત પિયત સમયપત્રકનું પાલન કરો.`
        : `Soil moisture levels are balanced based on ${facts.soilImpact.soilType} retention. Maintain standard scheduled irrigation.`,
      precautions: [
        isHi ? 'ड्रिप चालू करने से पहले मिट्टी की गहराई में नमी की जांच करें।' : isGu ? 'ડ્રિપ ચાલુ કરતા પહેલા જમીનમાં ભેજ ચકાસો.' : 'Monitor soil moisture depth before turning on drip valves.',
        isHi ? 'लैटरल फिल्टर को साफ रखें ताकि नोजल बंद न हों।' : isGu ? 'ફિલ્ટર સાફ રાખો જેથી નોઝલ બંધ ન થાય.' : 'Keep lateral filters clean to avoid nozzle clogging.',
      ],
      waterSavingTips: [
        isHi ? 'निर्धारित अवधि के बाद पंप बंद करने के लिए टाइमर का उपयोग करें।' : isGu ? 'સમય પૂરો થયા પછી પમ્પ બંધ કરવા ટાઈમર વાપરો.' : 'Maintain automated timer controls to stop pump after prescribed duration.',
      ],
      fertilizerSuggestion: isHi
        ? `वर्तमान ${facts.growthStageImpact.stage} अवस्था के लिए मानक साप्ताहिक उर्वरक तालिका बनाए रखें।`
        : isGu
        ? `વર્તમાન ${facts.growthStageImpact.stage} તબક્કા માટે સામાન્ય અઠવાડિક ખાતર સમયપત્રક જાળવો.`
        : `Maintain standard weekly fertigation schedule for ${facts.growthStageImpact.stage} stage.`,
      warning: isHi ? '3-दिवसीय मौसम पूर्वानुमान में अचानक बदलाव की निगरानी करें।' : isGu ? '3-દિવસની હવામાન આગાહીમાં ફેરફાર પર ધ્યાન રાખો.' : 'Monitor sudden shifts in 3-day weather forecast.',
    };
  }

  /**
   * Main Irrigation Endpoint handler logic (GET /api/irrigation)
   */
  async getLatestRecommendation(user, forceRefresh = false, lang = 'en') {
    const farm = await this.resolveActiveFarm(user);

    // 1. Fetch live weather from WeatherAPI
    let weather;
    try {
      weather = await weatherService.getWeatherForActiveFarm(user, lang);
    } catch (weatherErr) {
      logger.warn(`WeatherAPI fetch failed (${weatherErr.message}). Searching for last cached irrigation recommendation...`);
      const lastCached = await IrrigationCache.findOne({ farmId: farm._id, lang }).sort({ createdAt: -1 });
      if (lastCached) {
        return {
          isCached: true,
          isStale: true,
          recommendation: lastCached.recommendation,
          groqExplanation: lastCached.groqExplanation,
          weatherSnapshot: lastCached.weatherHash,
          lastUpdated: lastCached.createdAt,
        };
      }
      throw weatherErr;
    }

    const curTemp = Number(weather.current?.temperature ?? 30);
    const curHumid = Number(weather.current?.humidity ?? 60);
    const curRainProb = Number(weather.current?.rainProbability ?? 0);
    const curRainMm = Number(weather.current?.rainVolume ?? 0);

    // 2. Check MongoDB cache unless forceRefresh is requested
    if (!forceRefresh) {
      const cached = await IrrigationCache.findOne({
        farmId: farm._id,
        lang,
        expiresAt: { $gt: new Date() },
      }).sort({ createdAt: -1 });

      if (cached && cached.weatherHash) {
        const tempDiff = Math.abs(curTemp - cached.weatherHash.temperature);
        const humidDiff = Math.abs(curHumid - cached.weatherHash.humidity);
        const rainProbDiff = Math.abs(curRainProb - cached.weatherHash.rainProbability);

        if (tempDiff < 2 && humidDiff < 5 && rainProbDiff < 10) {
          logger.info(`Irrigation Cache HIT for farm [${farm._id}] (lang=${lang})`);
          return {
            isCached: true,
            recommendation: cached.recommendation,
            groqExplanation: cached.groqExplanation,
            ruleEngineFallback: cached.ruleEngineFallback,
            weatherSnapshot: cached.weatherHash,
            lastUpdated: cached.createdAt,
            expiresAt: cached.expiresAt,
          };
        }
      }
    }

    logger.info(`Irrigation Cache MISS for farm [${farm._id}] (lang=${lang}). Executing Engine & Groq AI...`);

    // 3. Run Deterministic Rules Engine with language
    const facts = irrigationEngine.evaluate({ farm, weather }, lang);

    // 4. Generate Groq AI Explanation with language
    const groqResult = await this.generateGroqExplanation(facts, lang);

    // 5. Store in MongoDB IrrigationCache with 3-hour TTL
    const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000);
    const weatherHash = {
      temperature: curTemp,
      humidity: curHumid,
      rainProbability: curRainProb,
      expectedRainfall: curRainMm,
      condition: weather.current?.weatherCondition || 'Clear',
    };

    const cacheDoc = await IrrigationCache.create({
      userId: user._id,
      farmId: farm._id,
      lang,
      weatherHash,
      recommendation: facts,
      groqExplanation: groqResult.explanation,
      ruleEngineFallback: groqResult.ruleEngineFallback,
      expiresAt,
    });

    return {
      isCached: false,
      recommendation: facts,
      groqExplanation: groqResult.explanation,
      ruleEngineFallback: groqResult.ruleEngineFallback,
      weatherSnapshot: weatherHash,
      meta: groqResult.meta,
      lastUpdated: cacheDoc.createdAt,
      expiresAt,
    };
  }

  /**
   * Force Refresh Recommendation (POST /api/irrigation/refresh)
   */
  async refreshRecommendation(user, lang = 'en') {
    return this.getLatestRecommendation(user, true, lang);
  }

  /**
   * Get Previous Recommendation History (GET /api/irrigation/history)
   */
  async getIrrigationHistory(user) {
    const farm = await this.resolveActiveFarm(user);
    const history = await IrrigationCache.find({ farmId: farm._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return history;
  }
}

export default new IrrigationService();
