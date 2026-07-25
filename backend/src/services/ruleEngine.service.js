import { DECISION_TYPES, RISK_LEVELS } from '../models/Recommendation.js';

class RuleEngineService {
  /**
   * Evaluates agronomic and financial rules to establish initial decision bias and constraints.
   */
  evaluateRules({ crop, quantity, marketPrice, historicalTrend, weather, diseaseReport, storageAvailable, storageCost }) {
    const rulesTriggered = [];
    let overrideDecision = null;
    let baseRiskLevel = RISK_LEVELS.LOW;

    // 1. Disease Severity Rule
    const diseaseSeverity = diseaseReport?.severity || diseaseReport?.diseaseRisk || 'HEALTHY';
    const isDiseaseHigh = ['HIGH', 'CRITICAL', 'SEVERE'].includes(String(diseaseSeverity).toUpperCase());
    
    if (isDiseaseHigh) {
      overrideDecision = DECISION_TYPES.IMMEDIATE_SALE_DISEASE;
      baseRiskLevel = RISK_LEVELS.CRITICAL;
      rulesTriggered.push({
        code: 'RULE_DISEASE_CRITICAL',
        description: `High disease severity detected (${diseaseSeverity}). Immediate sale recommended to prevent post-harvest rot/spoilage.`,
      });
    }

    // 2. Weather Risk & Storage Rule
    const rainProbability = weather?.current?.rainProbability || weather?.rainProbability || 0;
    if (rainProbability > 80 && !storageAvailable && !overrideDecision) {
      overrideDecision = DECISION_TYPES.IMMEDIATE_SALE_WEATHER;
      baseRiskLevel = RISK_LEVELS.HIGH;
      rulesTriggered.push({
        code: 'RULE_WEATHER_RAIN_NO_STORAGE',
        description: `Extreme rain probability (${rainProbability}%) combined with zero covered storage facilities. Immediate mandi sale required.`,
      });
    }

    // 3. Upward Price Trend + Storage Rule
    const trendDirection = historicalTrend?.trend || 'STABLE';
    if (trendDirection === 'INCREASING' && storageAvailable && !overrideDecision) {
      rulesTriggered.push({
        code: 'RULE_UPWARD_PRICE_TREND',
        description: `Market prices are trending upward with valid storage facility. Storing crop favored.`,
      });
    }

    // 4. Stable Price + Healthy Crop + Storage Rule
    if (trendDirection === 'STABLE' && !isDiseaseHigh && storageAvailable && !overrideDecision) {
      rulesTriggered.push({
        code: 'RULE_STABLE_MARKET_HEALTHY',
        description: `Stable mandi prices and healthy crop state. Holding crop short-term is safe.`,
      });
    }

    // 5. Downward Price Trend + Storage Available Rule
    if (trendDirection === 'DECREASING' && !overrideDecision) {
      if (!storageAvailable) {
        overrideDecision = DECISION_TYPES.SELL_NOW;
      }
      rulesTriggered.push({
        code: 'RULE_DOWNWARD_PRICE_TREND',
        description: `Market prices are falling. Selling early is favored to lock in current market rate.`,
      });
    }

    return {
      overrideDecision,
      baseRiskLevel,
      rulesTriggered,
      suggestedBias: overrideDecision || (storageAvailable && trendDirection === 'INCREASING' ? 'STORE' : 'SELL_NOW'),
    };
  }
}

export default new RuleEngineService();
