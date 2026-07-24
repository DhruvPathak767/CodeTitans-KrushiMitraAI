import { Groq } from 'groq-sdk';
import logger from '../../config/logger.js';
import { getLanguageName } from '../../utils/i18n.util.js';

class GroqService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    if (this.apiKey) {
      this.groq = new Groq({ apiKey: this.apiKey });
    }
  }

  /**
   * Automatically calculate Crop Growth Stage based on Sowing Date
   */
  calculateGrowthStage(sowingDateStr) {
    if (!sowingDateStr) return 'Vegetative';
    const sowingDate = new Date(sowingDateStr);
    if (isNaN(sowingDate.getTime())) return 'Vegetative';

    const diffDays = Math.floor((Date.now() - sowingDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Sowing Phase';
    if (diffDays <= 20) return 'Seedling';
    if (diffDays <= 50) return 'Vegetative';
    if (diffDays <= 80) return 'Flowering';
    if (diffDays <= 110) return 'Fruiting';
    return 'Harvest Readiness';
  }

  /**
   * Generate AI Crop Advisory using Groq AI (llama-3.3-70b-versatile) with multi-language output
   */
  async generateCropAdvisory(payload = {}, lang = 'en') {
    const startTime = Date.now();
    if (!this.groq && process.env.GROQ_API_KEY) {
      this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }

    if (!this.groq) {
      throw new Error('Groq SDK uninitialized (GROQ_API_KEY missing)');
    }

    const { farm, weather, agriculture, growthStage } = payload;
    const current = weather.current || {};
    const airQuality = weather.airQuality || {};
    const location = weather.location || {};
    const targetLangName = getLanguageName(lang);

    const promptText = `You are India's best agricultural advisor and senior agronomist.

CRITICAL MULTI-LANGUAGE REQUIREMENT:
You MUST generate ALL human-readable string values inside the JSON (such as reason, nextAction, warning, irrigation status, fertilizer status, fieldWork recommendations, timeline steps, etc.) strictly in the language: ${targetLangName} (Language code: ${lang}).
Keep JSON key names strictly in English.

Return ONLY a valid JSON object matching the exact requested JSON contract below.
Never use markdown codeblocks inside JSON string values.
Never explain outside JSON.
Use ONLY the supplied weather and farm telemetry data.

FARM CONTEXT:
- Farm Name: ${farm.farmName || location.farmName}
- Village/District: ${location.village || 'N/A'}, ${location.district || 'N/A'}, ${location.state || 'N/A'}
- Coordinates: ${location.latitude}, ${location.longitude}
- Crop Name: ${farm.cropName || 'General Crop'}
- Crop Variety: ${farm.cropVariety || 'Standard'}
- Crop Category: ${farm.cropCategory || 'Cereal'}
- Sowing Date: ${farm.sowingDate || 'N/A'}
- Calculated Growth Stage: ${growthStage}

LIVE WEATHER TELEMETRY:
- Temperature: ${current.temperature}°C (Feels Like: ${current.feelsLike}°C)
- Humidity: ${current.humidity}%
- Pressure: ${current.pressure} hPa
- Wind Speed: ${current.windSpeed} km/h (Direction: ${current.windDirection}°)
- Rain Probability: ${current.rainProbability}% (Volume: ${current.rainVolume} mm)
- Visibility: ${current.visibility} km
- UV Index: ${current.uvIndex}
- AQI Index: ${airQuality.aqi || 1} (${airQuality.aqiStatus || 'Good'})
- Air PM2.5 / PM10: ${airQuality.pm25} / ${airQuality.pm10}

PRE-EVALUATED AGRONOMY RULES:
- Disease Risk: ${agriculture.diseaseRisk}
- Heat Stress: ${agriculture.heatStress}
- Water Stress: ${agriculture.waterStress || 'Normal'}
- Spray Window: ${agriculture.sprayWindow}
- Irrigation Guidance: ${agriculture.irrigationAdvice}
- Crop Comfort: ${agriculture.cropComfort}

Generate a comprehensive, highly actionable agronomic advisory in JSON format matching this EXACT schema (with text values written in ${targetLangName}):

{
  "cropHealthScore": 90,
  "priority": "Medium",
  "irrigation": {
    "status": "Delay Irrigation",
    "reason": "Natural precipitation expected over next 24h"
  },
  "fertilizer": {
    "status": "Apply Foliar Spray After Rain",
    "reason": "Prevent chemical wash-off during rain"
  },
  "diseaseRisk": {
    "level": "Medium",
    "reason": "High ambient humidity favors fungal spore germination"
  },
  "pestRisk": {
    "level": "Low",
    "reason": "Pest population activity suppressed by wind"
  },
  "weedRisk": {
    "level": "Medium",
    "reason": "Moist soil encourages weed sapling growth"
  },
  "waterStress": {
    "level": "Low",
    "reason": "Adequate root zone soil moisture"
  },
  "heatStress": {
    "level": "Low",
    "reason": "Ambient temperatures within optimal photosynthetic threshold"
  },
  "sprayWindow": {
    "bestTime": "Tomorrow 6:00 AM - 9:00 AM",
    "suitable": true
  },
  "harvestReadiness": {
    "percentage": 25
  },
  "fieldWork": {
    "status": "Suitable for Drainage Maintenance",
    "morning": "Check field drainage channels",
    "afternoon": "Inspect lower canopy leaves for fungal spots",
    "evening": "Ensure grain storage aeration",
    "night": "Rest"
  },
  "timeline": {
    "step1Today": "Inspect field boundary and clear waterlogging channels.",
    "step2Tomorrow": "Apply preventive copper fungicide spray if rain ceases.",
    "step3Next3Days": "Monitor soil moisture status before scheduling next irrigation."
  },
  "estimatedYieldImpact": "+12%",
  "estimatedWaterSaving": "18%",
  "estimatedCostSaving": "₹900",
  "nextAction": "Inspect lower leaves tomorrow morning for early blight spots.",
  "warning": "Watch for high humidity encouraging fungal pathogens.",
  "reason": "High air humidity combined with moderate temperature increases leaf wetness duration.",
  "confidence": "94%"
}`;

    logger.info(`Sending multi-language prompt (${targetLangName}) to Groq AI (llama-3.3-70b-versatile)...`);

    const completion = await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'user',
          content: promptText,
        },
      ],
    });

    const responseTime = Date.now() - startTime;
    const usage = completion.usage || {};
    logger.info(`Groq AI response received in ${responseTime}ms (${targetLangName})`);

    const rawContent = completion.choices[0]?.message?.content;
    const parsed = JSON.parse(rawContent);

    return {
      advisory: parsed,
      meta: {
        model: 'llama-3.3-70b-versatile',
        lang,
        languageName: targetLangName,
        responseTime,
        promptTokens: usage.prompt_tokens || 0,
        completionTokens: usage.completion_tokens || 0,
      },
    };
  }
}

export default new GroqService();
