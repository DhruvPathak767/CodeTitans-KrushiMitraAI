import { Groq } from 'groq-sdk';
import logger from '../config/logger.js';
import { DECISION_TYPES, RISK_LEVELS } from '../models/Recommendation.js';

class GroqPromptService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    if (this.apiKey) {
      this.groq = new Groq({ apiKey: this.apiKey });
    }
  }

  /**
   * Generates AI Sell / Store Decision using Groq AI (llama-3.3-70b-versatile).
   */
  async generateDecision(payload = {}, ruleContext = {}) {
    if (!this.groq && process.env.GROQ_API_KEY) {
      this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }

    if (!this.groq) {
      logger.warn('GROQ_API_KEY missing. Returning fallback rule-based decision.');
      return this.buildFallbackDecision(payload, ruleContext);
    }

    const {
      crop,
      quantity,
      currentPrice,
      historicalTrend,
      weather,
      diseaseReport,
      storageAvailable,
      storageCost,
      location,
    } = payload;

    const promptText = `You are India's top agricultural economist and financial mandi analyst.

Evaluate the following telemetry data and pre-evaluated agronomy rules to issue an executive decision recommendation for a farmer.

FARMER & CROP TELEMETRY:
- Crop Name: ${crop}
- Harvest Quantity: ${quantity} Quintals
- Location: ${location?.village || location?.district || 'Rajkot'}, ${location?.state || 'Gujarat'}
- Storage Facility Available: ${storageAvailable ? 'YES' : 'NO'}
- Weekly Storage Cost: ₹${storageCost || 0} / Quintal

MARKET TELEMETRY:
- Current Mandi Price: ₹${currentPrice} / Quintal
- 15-Day Market AI Forecast Trend: ${historicalTrend?.trend || 'STABLE'}
- Projected 15-Day Price: ₹${historicalTrend?.predictedPrice || currentPrice} / Quintal

WEATHER TELEMETRY:
- Rain Probability: ${weather?.current?.rainProbability || weather?.rainProbability || 10}%
- Temperature: ${weather?.current?.temperature || 28}°C
- Humidity: ${weather?.current?.humidity || 60}%

CROP HEALTH & DISEASE STATUS:
- Disease Status: ${diseaseReport?.diseaseStatus || diseaseReport?.diseaseRisk || 'Healthy'}
- Disease Severity: ${diseaseReport?.severity || 'LOW'}

PRE-EVALUATED RULE ENGINE CONSTRAINTS:
- Pre-Evaluated Override: ${ruleContext.overrideDecision || 'NONE'}
- Pre-Evaluated Rules Triggered: ${JSON.stringify(ruleContext.rulesTriggered || [])}

REQUIREMENT:
Return ONLY a valid JSON object matching the exact JSON contract below:

{
  "decision": "STORE", 
  "estimatedProfit": "12%",
  "riskLevel": "LOW",
  "confidence": 95,
  "reason": "Market prices are expected to increase over the next 5 days while weather conditions remain favorable.",
  "recommendationSummary": "Store the crop for approximately one week before selling."
}

VALID DECISION ENUM VALUES:
- "STORE"
- "SELL_NOW"
- "SELL_PARTIALLY"
- "IMMEDIATE_SALE_DISEASE"
- "IMMEDIATE_SALE_WEATHER"

VALID RISK_LEVEL ENUM VALUES:
- "LOW"
- "MEDIUM"
- "HIGH"
- "CRITICAL"

Important Constraints:
1. If Pre-Evaluated Override is NOT "NONE", your decision MUST match the override decision exactly!
2. Return ONLY JSON without code block backticks or explanation.`;

    try {
      logger.info('Sending Sell/Store Decision payload to Groq AI...');

      const completion = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'user',
            content: promptText,
          },
        ],
      });

      const rawContent = completion.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(rawContent);

      return {
        decision: parsed.decision || ruleContext.suggestedBias || DECISION_TYPES.SELL_NOW,
        estimatedProfit: parsed.estimatedProfit || '+8%',
        riskLevel: parsed.riskLevel || ruleContext.baseRiskLevel || RISK_LEVELS.LOW,
        confidence: Math.min(100, Math.max(50, parseInt(parsed.confidence, 10) || 90)),
        reason: parsed.reason || 'Calculated based on current APMC market rates and weather outlook.',
        recommendationSummary: parsed.recommendationSummary || 'Proceed with current market recommendation.',
      };
    } catch (err) {
      logger.error(`Groq AI Decision generation failed: ${err.message}. Using fallback engine.`);
      return this.buildFallbackDecision(payload, ruleContext);
    }
  }

  buildFallbackDecision(payload, ruleContext) {
    const decision = ruleContext.overrideDecision || ruleContext.suggestedBias || DECISION_TYPES.SELL_NOW;
    const isStore = decision === DECISION_TYPES.STORE;

    return {
      decision,
      estimatedProfit: isStore ? '12%' : '5%',
      riskLevel: ruleContext.baseRiskLevel || (isStore ? RISK_LEVELS.LOW : RISK_LEVELS.MEDIUM),
      confidence: 88,
      reason: ruleContext.rulesTriggered[0]?.description || 'Based on local APMC mandi price history and weather outlook.',
      recommendationSummary: isStore
        ? 'Store crop in dry storage facility for 7 to 10 days to maximize APMC mandi rate.'
        : 'Sell produce in immediate market window to prevent quality loss.',
    };
  }
}

export default new GroqPromptService();
