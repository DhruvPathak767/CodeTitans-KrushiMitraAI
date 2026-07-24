import { getTranslation } from './i18n.util.js';

/**
 * Agriculture Rule Engine (Non-AI agronomy rules)
 * Evaluates weather metrics against agronomic threshold rules supporting multi-language.
 */
export function evaluateAgricultureRules(weather = {}, lang = 'en') {
  const temp = weather.temperature ?? 30;
  const humidity = weather.humidity ?? 65;
  const windSpeed = weather.windSpeed ?? 12;
  const rainProb = weather.rainProbability ?? 20;
  const rainVol = weather.rainVolume ?? 0;
  const uv = weather.uvIndex ?? 6;

  // 1. Disease Risk
  let diseaseRisk = getTranslation('lowDiseaseRisk', lang);
  if (humidity > 80 && temp >= 20 && temp <= 32) {
    diseaseRisk = getTranslation('highDiseaseRisk', lang);
  } else if (humidity > 70) {
    diseaseRisk = getTranslation('mediumDiseaseRisk', lang);
  }

  // 2. Heat Stress
  let heatStress = getTranslation('optimalThermal', lang);
  if (temp > 38) {
    heatStress = getTranslation('highHeatStress', lang);
  } else if (temp > 34) {
    heatStress = getTranslation('mediumHeatStress', lang);
  }

  // 3. Chemical Spray Window
  let sprayWindow = getTranslation('favorableSpray', lang);
  if (windSpeed > 25) {
    sprayWindow = getTranslation('avoidSprayingWind', lang);
  } else if (rainProb > 50 || rainVol > 0) {
    sprayWindow = getTranslation('avoidSprayingRain', lang);
  }

  // 4. Irrigation Advice
  let irrigationAdvice = getTranslation('normalIrrigation', lang);
  if (rainProb > 50 || rainVol > 0.5) {
    irrigationAdvice = getTranslation('delayIrrigation', lang);
  } else if (humidity < 35 || temp > 35) {
    irrigationAdvice = getTranslation('eveningIrrigation', lang);
  }

  // 5. Crop Comfort Index
  let cropComfort = getTranslation('optimalComfort', lang);
  if (temp > 36 || humidity > 85) {
    cropComfort = getTranslation('challengingComfort', lang);
  }

  // 6. Field Work Recommendation
  let fieldWorkRecommendation = getTranslation('favorableFieldwork', lang);
  if (rainProb > 70) {
    fieldWorkRecommendation = getTranslation('prepareDrainage', lang);
  }

  return {
    diseaseRisk,
    heatStress,
    sprayWindow,
    irrigationAdvice,
    cropComfort,
    fieldWorkRecommendation,
  };
}
