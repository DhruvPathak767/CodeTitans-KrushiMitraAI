import logger from '../../config/logger.js';

class IrrigationEngineService {
  /**
   * Calculate crop growth stage based on sowing date and crop lifecycle
   */
  calculateGrowthStage(sowingDate, cropName = 'General Crop', lang = 'en') {
    if (!sowingDate) {
      return {
        stage: lang === 'hi' ? 'वानस्पतिक' : lang === 'gu' ? 'વાનસ્પતિક' : 'Vegetative',
        daysSinceSowing: 30,
        totalDurationDays: 120,
        progressPercent: 25,
        waterDemandMultiplier: 1.0,
      };
    }

    const sowing = new Date(sowingDate);
    const now = new Date();
    const diffTime = Math.max(0, now.getTime() - sowing.getTime());
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const cropDurations = {
      WHEAT: 120,
      COTTON: 160,
      RICE: 130,
      PADDY: 130,
      MAIZE: 100,
      TOMATO: 90,
      POTATO: 100,
      SUGARCANE: 360,
      SOYBEAN: 105,
      GROUNDNUT: 110,
      MUSTARD: 110,
      ONION: 120,
    };

    const normalizedCrop = String(cropName).toUpperCase().trim();
    let totalDuration = 120;
    for (const [key, duration] of Object.entries(cropDurations)) {
      if (normalizedCrop.includes(key)) {
        totalDuration = duration;
        break;
      }
    }

    const pct = Math.min(100, Math.round((days / totalDuration) * 100));

    let stageKey = 'Vegetative';
    let multiplier = 1.0;

    if (pct <= 15) {
      stageKey = 'Seedling';
      multiplier = 1.2;
    } else if (pct <= 45) {
      stageKey = 'Vegetative';
      multiplier = 1.0;
    } else if (pct <= 70) {
      stageKey = 'Flowering';
      multiplier = 1.5;
    } else if (pct <= 90) {
      stageKey = 'Fruiting';
      multiplier = 1.1;
    } else {
      stageKey = 'Harvest';
      multiplier = 0.2;
    }

    const stageTranslations = {
      Seedling: { en: 'Seedling', hi: 'अंकुरण (Seedling)', gu: 'રોપણી (Seedling)' },
      Vegetative: { en: 'Vegetative', hi: 'वानस्पतिक (Vegetative)', gu: 'વાનસ્પતિક (Vegetative)' },
      Flowering: { en: 'Flowering', hi: 'पुष्पन (Flowering)', gu: 'ફૂલ આવવાનો તબક્કો (Flowering)' },
      Fruiting: { en: 'Fruiting', hi: 'फल/दाना निर्माण (Fruiting)', gu: 'ફળ/દાણા બેસવાનો તબક્કો (Fruiting)' },
      Harvest: { en: 'Harvest', hi: 'कटाई की अवस्था (Harvest)', gu: 'લણણીનો તબક્કો (Harvest)' },
    };

    const l = ['en', 'hi', 'gu'].includes(lang) ? lang : 'en';

    return {
      stageKey,
      stage: stageTranslations[stageKey]?.[l] || stageKey,
      daysSinceSowing: days,
      totalDurationDays: totalDuration,
      progressPercent: pct,
      waterDemandMultiplier: multiplier,
    };
  }

  /**
   * Soil Moisture Retention Property Analysis
   */
  evaluateSoilProperties(soilType = 'Black Soil', lang = 'en') {
    const soil = String(soilType).toLowerCase();
    const l = ['en', 'hi', 'gu'].includes(lang) ? lang : 'en';

    if (soil.includes('black')) {
      return {
        soilType: l === 'hi' ? 'काली मिट्टी' : l === 'gu' ? 'કાળી જમીન' : 'Black Soil',
        retentionFactor: 0.85,
        drainage:
          l === 'hi'
            ? 'कम जल निकासी / उच्च नमी प्रतिधारण'
            : l === 'gu'
            ? 'ઓછો નિકાલ / ઉચ્ચ ભેજ ક્ષમતા'
            : 'Low Drainage / High Retention',
        multiplier: 0.75,
        impactSummary:
          l === 'hi'
            ? 'काली मिट्टी अधिक समय तक नमी बनाए रखती है; जलभराव से बचने के लिए कम सिंचाई चक्रों की आवश्यकता होती है।'
            : l === 'gu'
            ? 'કાળી જમીન લાંબો સમય ભેજ જાળવી રાખે છે; ઓછી સિંચાઈ ચક્રની જરૂર પડે છે.'
            : 'Black clay soil holds water longer; requires fewer irrigation cycles to prevent waterlogging.',
      };
    } else if (soil.includes('sandy')) {
      return {
        soilType: l === 'hi' ? 'बलुई मिट्टी' : l === 'gu' ? 'રેતાળ જમીન' : 'Sandy Soil',
        retentionFactor: 0.35,
        drainage:
          l === 'hi'
            ? 'उच्च जल निकासी / तेजी से पानी बहना'
            : l === 'gu'
            ? 'ઝડપી પાણીનો નિકાલ / ઓછી ભેજ ક્ષમતા'
            : 'High Drainage / Fast Permeability',
        multiplier: 1.35,
        impactSummary:
          l === 'hi'
            ? 'बलुई मिट्टी तेजी से सूखती है; छोटी और बार-बार ड्रिप सिंचाई चक्रों की आवश्यकता होती है।'
            : l === 'gu'
            ? 'રેતાળ જમીન ઝડપથી સુકાઈ જાય છે; ટૂંકી અને વારંવાર સિંચાઈની જરૂર પડે છે.'
            : 'Sandy soil drains rapidly; requires shorter, more frequent drip cycles.',
      };
    } else if (soil.includes('loam')) {
      return {
        soilType: l === 'hi' ? 'दोमट मिट्टी' : l === 'gu' ? 'ગોરાડુ જમીન' : 'Loamy Soil',
        retentionFactor: 0.70,
        drainage:
          l === 'hi'
            ? 'संतुलित जल निकासी एवं प्रतिधारण'
            : l === 'gu'
            ? 'સંતુલિત નિકાલ અને ભેજ ક્ષમતા'
            : 'Optimal / Balanced Retention',
        multiplier: 1.0,
        impactSummary:
          l === 'hi'
            ? 'दोमट मिट्टी आदर्श नमी प्रतिधारण और जड़ों के वातन का संतुलन प्रदान करती है।'
            : l === 'gu'
            ? 'ગોરાડુ જમીન ઉત્તમ ભેજ ક્ષમતા અને મૂળિયાંના શ્વાસ માટે સંતુલન પૂરું પાડે છે.'
            : 'Loamy soil provides ideal moisture retention and root aeration balance.',
      };
    }

    return {
      soilType: soilType || (l === 'hi' ? 'जलोढ़ / लाल मिट्टी' : l === 'gu' ? 'ગોરાડુ / લાલ જમીન' : 'Alluvial / Red Soil'),
      retentionFactor: 0.60,
      drainage: l === 'hi' ? 'मध्यम जल निकासी' : l === 'gu' ? 'મધ્યમ નિકાલ' : 'Moderate Drainage',
      multiplier: 1.0,
      impactSummary:
        l === 'hi'
          ? 'मानक मिट्टी बनावट जिसके लिए नियमित निर्धारित सिंचाई की आवश्यकता होती है।'
          : l === 'gu'
          ? 'સામાન્ય જમીન જેમાં બરાબર સમયપત્રક મુજબ સિંચાઈની જરૂર પડે છે.'
          : 'Standard soil texture requiring regular scheduled irrigation.',
    };
  }

  /**
   * Evaluate Evaporation Risk Index (0 - 100)
   */
  calculateEvaporationRisk(temp = 30, humidity = 60, wind = 10, uv = 5, lang = 'en') {
    const l = ['en', 'hi', 'gu'].includes(lang) ? lang : 'en';

    const tempFactor = Math.min(1.0, Math.max(0, (temp - 15) / 30));
    const humidityFactor = Math.min(1.0, Math.max(0, (100 - humidity) / 100));
    const windFactor = Math.min(1.0, Math.max(0, wind / 40));
    const uvFactor = Math.min(1.0, Math.max(0, uv / 12));

    const score = Math.round((tempFactor * 0.35 + humidityFactor * 0.35 + windFactor * 0.15 + uvFactor * 0.15) * 100);

    let levelEn = 'Moderate';
    let level = l === 'hi' ? 'मध्यम' : l === 'gu' ? 'મધ્યમ' : 'Moderate';

    if (score > 70) {
      levelEn = 'High';
      level = l === 'hi' ? 'उच्च' : l === 'gu' ? 'ઉચ્ચ' : 'High';
    } else if (score < 40) {
      levelEn = 'Low';
      level = l === 'hi' ? 'कम' : l === 'gu' ? 'ઓછું' : 'Low';
    }

    return {
      score,
      levelEn,
      level,
    };
  }

  /**
   * Main Deterministic Smart Irrigation Physics Engine
   */
  evaluate({ farm, weather }, lang = 'en') {
    const l = ['en', 'hi', 'gu'].includes(lang) ? lang : 'en';

    const current = weather.current || {};
    const dailyForecast = weather.daily || [];
    const firstForecastDay = dailyForecast[0] || {};

    const temp = Number(current.temperature ?? 30);
    const humidity = Number(current.humidity ?? 60);
    const windSpeed = Number(current.windSpeed ?? 10);
    const uvIndex = Number(current.uvIndex ?? 5);
    const rainProb = Number(current.rainProbability ?? firstForecastDay.rainChance ?? 0);
    const expectedRainfall = Number(current.rainVolume ?? 0);

    // Farm Properties
    const area = Number(farm.area || 1);
    const areaUnit = farm.areaUnit || 'ACRE';
    const areaInAcres = areaUnit === 'HECTARE' ? area * 2.47105 : area;
    const soilInfo = this.evaluateSoilProperties(farm.soilType, l);
    const stageInfo = this.calculateGrowthStage(farm.sowingDate, farm.cropName, l);

    // Evaporation Risk & Heat Stress
    const evaporation = this.calculateEvaporationRisk(temp, humidity, windSpeed, uvIndex, l);
    const isHeatStress = temp >= 35;
    const heatImpactScore = isHeatStress
      ? humidity < 30
        ? l === 'hi'
          ? 'अत्यधिक (Extreme)'
          : l === 'gu'
          ? 'અતિશય (Extreme)'
          : 'EXTREME'
        : l === 'hi'
        ? 'उच्च (High)'
        : l === 'gu'
        ? 'ઉચ્ચ (High)'
        : 'HIGH'
      : temp >= 30
      ? l === 'hi'
        ? 'मध्यम (Medium)'
        : l === 'gu'
        ? 'મધ્યમ (Medium)'
        : 'MEDIUM'
      : l === 'hi'
      ? 'कम (Low)'
      : l === 'gu'
      ? 'ઓછું (Low)'
      : 'LOW';

    // Status mapping (deterministic)
    let statusEn = 'Wait';
    let status = l === 'hi' ? 'नमी पर्याप्त (Wait)' : l === 'gu' ? 'ભેજ યોગ્ય (Wait)' : 'Wait';
    let priorityEn = 'Medium';
    let priority = l === 'hi' ? 'मध्यम' : l === 'gu' ? 'મધ્યમ' : 'Medium';
    let waterNeeded = true;
    let ruleTriggered =
      l === 'hi'
        ? 'मानक कृषि नियम आधार रेखा (मृदा नमी संतुलित है)'
        : l === 'gu'
        ? 'સામાન્ય કૃષિ નિયમ આધાર રેખા (જમીનમાં ભેજ યોગ્ય છે)'
        : 'Standard Agronomic Baseline (Optimal Soil Moisture)';
    let confidenceScore = 92;

    const isImminentRain = rainProb > 70 && expectedRainfall >= 5;
    const isHighHumidity = humidity > 85;
    const isHighTemp = temp > 35;

    let rainMultiplier = 1.0;
    let tempMultiplier = 1.0;
    let humidityMultiplier = 1.0;

    if (isImminentRain) {
      statusEn = 'Delay';
      status = l === 'hi' ? 'सिंचाई टालें (Delay)' : l === 'gu' ? 'સિંચાઈ મુલતવી રાખો (Delay)' : 'Delay';
      priorityEn = 'High';
      priority = l === 'hi' ? 'उच्च' : l === 'gu' ? 'ઉચ્ચ' : 'High';
      waterNeeded = false;
      rainMultiplier = 0.0;
      ruleTriggered =
        l === 'hi'
          ? `पूर्वानुमानित बारिश (${rainProb}% संभावना, ${expectedRainfall}mm वर्षा) के कारण सिंचाई स्थगित की गई।`
          : l === 'gu'
          ? `આગાહી કરેલ વરસાદ (${rainProb}% સંભાવના, ${expectedRainfall}mm વરસાદ) ના કારણે સિંચાઈ મુલતવી રાખેલ છે.`
          : `Imminent rain expected (${rainProb}% chance, ${expectedRainfall}mm rainfall). Irrigation delayed.`;
      confidenceScore = 96;
    } else if (isHighHumidity) {
      statusEn = 'Monitor';
      status = l === 'hi' ? 'निगरानी करें (Monitor)' : l === 'gu' ? 'દેખરેખ રાખો (Monitor)' : 'Monitor';
      priorityEn = 'Low';
      priority = l === 'hi' ? 'कम' : l === 'gu' ? 'ઓછું' : 'Low';
      humidityMultiplier = 0.65;
      ruleTriggered =
        l === 'hi'
          ? `उच्च आर्द्रता (${humidity}%) के कारण पौधे का वाष्पोत्सर्जन कम है। सिंचाई मात्रा घटाई गई।`
          : l === 'gu'
          ? `હવામાં વધારે ભેજ (${humidity}%) હોવાથી છોડની પાણીની જરૂરિયાત ઓછી છે.`
          : `High atmospheric humidity (${humidity}%) reduces plant transpiration water demand.`;
      confidenceScore = 90;
    } else if (isHighTemp || stageInfo.stageKey === 'Flowering') {
      statusEn = 'Irrigate Now';
      status = l === 'hi' ? 'तुरंत सिंचाई करें (Irrigate Now)' : l === 'gu' ? 'તરત જ સિંચાઈ કરો (Irrigate Now)' : 'Irrigate Now';
      priorityEn = 'High';
      priority = l === 'hi' ? 'उच्च' : l === 'gu' ? 'ઉચ્ચ' : 'High';
      waterNeeded = true;
      if (isHighTemp) tempMultiplier = 1.35;
      ruleTriggered = isHighTemp
        ? l === 'hi'
          ? `उच्च तापमान (${temp}°C) से वाष्पीकरण बढ़ गया है; तुरंत ड्रिप सिंचाई की आवश्यकता है।`
          : l === 'gu'
          ? `ઉંચુ તાપમાન (${temp}°C) થી બાષ્પીભવન વધ્યું છે; તરત જ ડ્રિપ સિંચાઈની જરૂર છે.`
          : `High temperature (${temp}°C) increases evapotranspiration loss; immediate drip run required.`
        : l === 'hi'
        ? `फसल पुष्पन (फूल) की संवेदनशील अवस्था में है, जहां पानी की सबसे अधिक आवश्यकता होती है।`
        : l === 'gu'
        ? `પાક ફૂલ આવવાના સંવેદનશીલ તબક્કામાં છે, જ્યાં પાણીની સૌથી વધુ જરૂર રહે છે.`
        : `Crop is at critical flowering stage with highest moisture demand.`;
      confidenceScore = 95;
    } else if (stageInfo.stageKey === 'Harvest') {
      statusEn = 'Wait';
      status = l === 'hi' ? 'कटाई अवस्था (Wait)' : l === 'gu' ? 'લણણી તબક્કો (Wait)' : 'Wait';
      priorityEn = 'Low';
      priority = l === 'hi' ? 'कम' : l === 'gu' ? 'ઓછું' : 'Low';
      waterNeeded = false;
      ruleTriggered =
        l === 'hi'
          ? `फसल कटाई के करीब है; बहुत कम या शून्य सिंचाई की सलाह दी जाती है।`
          : l === 'gu'
          ? `પાક લણણીની નજીક છે; નહિવત સિંચાઈની ભલામણ છે.`
          : `Crop nearing harvest; minimal to zero irrigation recommended.`;
      confidenceScore = 94;
    } else {
      ruleTriggered =
        l === 'hi'
          ? `${soilInfo.soilType} में वर्तमान नमी का स्तर पर्याप्त है।`
          : l === 'gu'
          ? `${soilInfo.soilType} માં વર્તમાન ભેજનું સ્તર યોગ્ય છે.`
          : `Moisture levels are optimal based on ${soilInfo.soilType} retention.`;
    }

    // Calculate Water Volume (Liters)
    const baseDemandPerAcre = 12000;
    const totalLitersRaw = Math.round(
      areaInAcres *
        baseDemandPerAcre *
        stageInfo.waterDemandMultiplier *
        soilInfo.multiplier *
        tempMultiplier *
        humidityMultiplier *
        rainMultiplier
    );

    const estimatedWaterQuantity = waterNeeded ? Math.max(1000, totalLitersRaw) : 0;

    // Drip Duration calculation
    let durationMinutes = 0;
    if (estimatedWaterQuantity > 0) {
      const flowRatePerHour = 5000 * areaInAcres;
      durationMinutes = Math.round((estimatedWaterQuantity / flowRatePerHour) * 60);
    }

    const estimatedDuration =
      durationMinutes > 0
        ? durationMinutes >= 60
          ? l === 'hi'
            ? `${Math.floor(durationMinutes / 60)} घंटे ${durationMinutes % 60} मिनट`
            : l === 'gu'
            ? `${Math.floor(durationMinutes / 60)} કલાક ${durationMinutes % 60} મિનિટ`
            : `${Math.floor(durationMinutes / 60)} hr ${durationMinutes % 60} mins`
          : l === 'hi'
          ? `${durationMinutes} मिनट`
          : l === 'gu'
          ? `${durationMinutes} મિનિટ`
          : `${durationMinutes} mins`
        : l === 'hi'
        ? '0 मिनट'
        : l === 'gu'
        ? '0 મિનિટ'
        : '0 mins';

    // Best Irrigation Window Timeline
    const bestWindow = [
      {
        slotKey: 'Morning',
        slot: l === 'hi' ? 'सुबह (Morning)' : l === 'gu' ? 'સવાર (Morning)' : 'Morning',
        time: '6:00 AM - 9:00 AM',
        score: 95,
        recommendation: l === 'hi' ? 'सर्वोत्तम (Optimal)' : l === 'gu' ? 'શ્રેષ્ઠ (Optimal)' : 'Optimal',
        status: statusEn === 'Irrigate Now' ? 'RECOMMENDED' : 'AVAILABLE',
        reason:
          l === 'hi'
            ? 'सबसे कम वाष्पीकरण दर और शांत हवा। सिंचाई के लिए सर्वोत्तम समय।'
            : l === 'gu'
            ? 'સૌથી ઓછું બાષ્પીભવન અને શાંત પવન. પિયત માટે શ્રેષ્ઠ સમય.'
            : 'Lowest ambient evaporation rate & minimal wind disturbance.',
      },
      {
        slotKey: 'Afternoon',
        slot: l === 'hi' ? 'दोपहर (Afternoon)' : l === 'gu' ? 'બપોર (Afternoon)' : 'Afternoon',
        time: '12:00 PM - 3:00 PM',
        score: 25,
        recommendation: l === 'hi' ? 'बचें (Avoid)' : l === 'gu' ? 'ટાળો (Avoid)' : 'Avoid',
        status: 'AVOID',
        reason:
          l === 'hi'
            ? 'अत्यधिक धूप से पानी का नुकसान और पत्तियों के जलने का खतरा।'
            : l === 'gu'
            ? 'તીવ્ર તાપમાનથી પાણીનો બગાડ અને પાંદડા બળવાનું જોખમ.'
            : 'High thermal evaporation loss & risk of foliage scorching.',
      },
      {
        slotKey: 'Evening',
        slot: l === 'hi' ? 'शाम (Evening)' : l === 'gu' ? 'સાંજ (Evening)' : 'Evening',
        time: '5:00 PM - 8:00 PM',
        score: 88,
        recommendation: l === 'hi' ? 'अच्छा (Good)' : l === 'gu' ? 'સારું (Good)' : 'Good',
        status: 'SUITABLE',
        reason:
          l === 'hi'
            ? 'धूप ढलने के साथ जड़ों द्वारा पानी का अच्छा अवशोषण।'
            : l === 'gu'
            ? 'સાંજે તડકો ઘટતા મૂળ દ્વારા સારું પાણીનું શોષણ.'
            : 'Favorable root absorption as solar intensity subsides.',
      },
      {
        slotKey: 'Night',
        slot: l === 'hi' ? 'रात (Night)' : l === 'gu' ? 'રાત્રે (Night)' : 'Night',
        time: '9:00 PM - 11:00 PM',
        score: 60,
        recommendation: l === 'hi' ? 'सामान्य (Moderate)' : l === 'gu' ? 'સામાન્ય (Moderate)' : 'Moderate',
        status: 'MONITOR',
        reason:
          l === 'hi'
            ? 'कम वाष्पीकरण, लेकिन रात भर पत्तों पर पानी रहने से फंगल बीमारी का खतरा।'
            : l === 'gu'
            ? 'ઓછું બાષ્પીભવન, પરંતુ રાત્રે પાંદડા ભીના રહેવાથી ફૂગનું જોખમ.'
            : 'Low evaporation but prolonged leaf moisture may foster fungal spores.',
      },
    ];

    // Analytics Calculation
    const traditionalFloodLiters = Math.round(areaInAcres * 18000);
    const estimatedWaterSaved = waterNeeded ? Math.max(0, traditionalFloodLiters - estimatedWaterQuantity) : traditionalFloodLiters;
    const estimatedCostSaved = Math.round((estimatedWaterSaved / 1000) * 8.5);
    const efficiencyScore = Math.min(98, Math.max(75, 100 - Math.round(evaporation.score * 0.2)));

    // Next Irrigation Date
    const nextDate = new Date();
    if (statusEn === 'Delay') {
      nextDate.setDate(nextDate.getDate() + 2);
    } else if (statusEn === 'Irrigate Now') {
      nextDate.setDate(nextDate.getDate() + 1);
    } else {
      nextDate.setDate(nextDate.getDate() + 2);
    }

    const todayRecText =
      statusEn === 'Irrigate Now'
        ? l === 'hi'
          ? `सुबह (6:00 AM - 9:00 AM) के दौरान ${estimatedWaterQuantity.toLocaleString()} लीटर पानी (${estimatedDuration}) से सिंचाई करें।`
          : l === 'gu'
          ? `સવારે (6:00 AM - 9:00 AM) દરમિયાન ${estimatedWaterQuantity.toLocaleString()} લિટર પાણી (${estimatedDuration}) થી પિયત આપો.`
          : `Irrigate ${estimatedWaterQuantity.toLocaleString()} Liters (${estimatedDuration}) during early morning (6:00 AM - 9:00 AM).`
        : statusEn === 'Delay'
        ? l === 'hi'
          ? `पूर्वानुमानित ${expectedRainfall}mm वर्षा (${rainProb}% संभावना) के कारण सिंचाई 48 घंटे के लिए स्थगित करें।`
          : l === 'gu'
          ? `આગાહી કરેલ ${expectedRainfall}mm વરસાદ (${rainProb}% સંભાવના) ના કારણે સિંચાઈ 48 કલાક માટે મુલતવી રાખો.`
          : `Delay irrigation for 48 hours due to expected ${expectedRainfall}mm rainfall (${rainProb}% chance).`
        : statusEn === 'Monitor'
        ? l === 'hi'
          ? `उच्च आर्द्रता (${humidity}%); सिंचाई रोकें और मिट्टी की नमी की निगरानी करें।`
          : l === 'gu'
          ? `વધારે ભેજ (${humidity}%); પિયત બંધ રાખો અને જમીનના ભેજની દેખરેખ કરો.`
          : `High humidity (${humidity}%); hold off irrigation and monitor soil moisture.`
        : l === 'hi'
        ? `मिट्टी की नमी स्थिर है; अगला सिंचाई चक्र ${nextDate.toISOString().split('T')[0]} को निर्धारित है।`
        : l === 'gu'
        ? `જમીનનો ભેજ સંતુલિત છે; આગામી પિયત ${nextDate.toISOString().split('T')[0]} પર નિર્ધારિત છે.`
        : `Soil moisture is stable; next irrigation cycle scheduled for ${nextDate.toISOString().split('T')[0]}.`;

    const recommendationFacts = {
      todayRecommendation: todayRecText,
      statusEn,
      status,
      priorityEn,
      priority,
      waterNeeded,
      estimatedDuration,
      estimatedWaterQuantity,
      reason: ruleTriggered,
      confidenceScore,
      nextIrrigationDate: nextDate.toISOString().split('T')[0],
      rainImpact: {
        probability: rainProb,
        expectedMm: expectedRainfall,
        riskLevel: isImminentRain
          ? l === 'hi'
            ? 'उच्च (High)'
            : l === 'gu'
            ? 'ઉચ્ચ (High)'
            : 'HIGH'
          : rainProb > 40
          ? l === 'hi'
            ? 'मध्यम (Medium)'
            : l === 'gu'
            ? 'મધ્યમ (Medium)'
            : 'MEDIUM'
          : l === 'hi'
          ? 'कम (Low)'
          : l === 'gu'
          ? 'ઓછું (Low)'
          : 'LOW',
        action: isImminentRain
          ? l === 'hi'
            ? 'सिंचाई टालें'
            : l === 'gu'
            ? 'સિંચાઈ મુલતવી રાખો'
            : 'Delay Irrigation'
          : l === 'hi'
          ? 'सामान्य संचालन'
          : l === 'gu'
          ? 'સામાન્ય પિયત'
          : 'Normal Operations',
      },
      heatImpact: {
        temperature: temp,
        humidity,
        heatStressLevel: heatImpactScore,
        evaporationScore: evaporation.score,
        evaporationLevel: evaporation.level,
      },
      soilImpact: soilInfo,
      growthStageImpact: {
        crop: farm.cropName,
        stage: stageInfo.stage,
        daysSinceSowing: stageInfo.daysSinceSowing,
        waterDemandMultiplier: stageInfo.waterDemandMultiplier,
      },
      bestWindow,
      analytics: {
        estimatedWaterSaved,
        estimatedCostSaved,
        efficiencyScore,
      },
    };

    logger.info(
      `Irrigation Engine evaluated (lang=${l}): status=${statusEn}, priority=${priorityEn}, waterQty=${estimatedWaterQuantity}L`
    );

    return recommendationFacts;
  }
}

export default new IrrigationEngineService();
