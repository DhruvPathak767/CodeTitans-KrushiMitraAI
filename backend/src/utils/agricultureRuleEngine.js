/**
 * Agriculture Rule Engine (Non-AI agronomy rules)
 * Evaluates weather metrics against agronomic threshold rules.
 */
export function evaluateAgricultureRules(weather = {}) {
  const temp = weather.temperature ?? 30;
  const humidity = weather.humidity ?? 65;
  const windSpeed = weather.windSpeed ?? 12;
  const rainProb = weather.rainProbability ?? 20;
  const rainVol = weather.rainVolume ?? 0;
  const uv = weather.uvIndex ?? 6;

  // 1. Disease Risk
  let diseaseRisk = 'Low Disease Risk';
  if (humidity > 80 && temp >= 20 && temp <= 32) {
    diseaseRisk = 'High Disease Risk (High humidity & fungal spore favorability)';
  } else if (humidity > 70) {
    diseaseRisk = 'Moderate Disease Risk (Monitor leaf moisture)';
  }

  // 2. Heat Stress
  let heatStress = 'Optimal Thermal Range';
  if (temp > 38) {
    heatStress = 'Extreme Heat Stress (High transpiration loss risk)';
  } else if (temp > 34) {
    heatStress = 'Moderate Heat Stress (Ensure adequate soil moisture)';
  } else if (temp < 12) {
    heatStress = 'Cold Stress (Slow crop metabolic growth)';
  }

  // 3. Chemical Spray Window
  let sprayWindow = 'Favorable Spray Window';
  if (windSpeed > 25) {
    sprayWindow = `Avoid Spraying (High wind drift at ${windSpeed} km/h)`;
  } else if (rainProb > 50 || rainVol > 0) {
    sprayWindow = 'Avoid Spraying (Chemical wash-off risk from expected rain)';
  } else if (temp > 35) {
    sprayWindow = 'Spray Only Early Morning (High chemical evaporation)';
  }

  // 4. Irrigation Advice
  let irrigationAdvice = 'Normal Irrigation Schedule';
  if (rainProb > 50 || rainVol > 0.5) {
    irrigationAdvice = 'Delay Irrigation (Natural precipitation expected)';
  } else if (humidity < 35 || temp > 35) {
    irrigationAdvice = 'Increase Irrigation Frequency (High evapotranspiration rate)';
  }

  // 5. Crop Comfort Index
  let cropComfort = 'Optimal';
  if (temp > 36 || humidity > 85) {
    cropComfort = 'Challenging';
  } else if (temp < 15) {
    cropComfort = 'Dormant';
  }

  // 6. Field Work Recommendation
  let fieldWorkRecommendation = 'Favorable for Field Operations';
  if (uv > 8) {
    fieldWorkRecommendation = 'Avoid Midday Field Work (High UV index > 8)';
  } else if (rainProb > 70) {
    fieldWorkRecommendation = 'Prepare Drainage & Cover Stored Grain';
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
