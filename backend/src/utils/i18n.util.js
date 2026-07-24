/**
 * Backend i18n Dictionary for Weather & Agronomy Messages
 */
const translations = {
  en: {
    // Disease Risk
    highDiseaseRisk: 'High Disease Risk (High humidity & fungal spore favorability)',
    mediumDiseaseRisk: 'Moderate Disease Risk (Monitor lower leaves)',
    lowDiseaseRisk: 'Low Disease Risk (Favorable clean air conditions)',

    // Heat Stress
    highHeatStress: 'Extreme Heat Warning (High ambient thermal stress)',
    mediumHeatStress: 'Moderate Heat Stress (Ensure adequate irrigation)',
    optimalThermal: 'Optimal Thermal Range',

    // Spray Window
    avoidSprayingRain: 'Avoid Spraying (Chemical wash-off risk from expected rain)',
    avoidSprayingWind: 'Avoid Spraying (Pesticide drift risk from high wind)',
    favorableSpray: 'Favorable Spray Window (Clear weather & low wind)',

    // Irrigation Advice
    delayIrrigation: 'Delay Irrigation (Natural precipitation expected)',
    eveningIrrigation: 'Schedule Evening Irrigation (Reduce evapotranspiration loss)',
    normalIrrigation: 'Normal Irrigation Schedule',

    // Crop Comfort
    challengingComfort: 'Challenging',
    optimalComfort: 'Optimal',

    // Fieldwork
    prepareDrainage: 'Prepare Drainage & Cover Stored Grain',
    favorableFieldwork: 'Favorable for Field Operations',
  },
  hi: {
    // Disease Risk
    highDiseaseRisk: 'उच्च रोग जोखिम (उच्च आर्द्रता और फफूंद बीजाणु अनुकूलता)',
    mediumDiseaseRisk: 'मध्यम रोग जोखिम (निचले पत्तों की निगरानी करें)',
    lowDiseaseRisk: 'कम रोग जोखिम (अनुकूल स्वच्छ हवा)',

    // Heat Stress
    highHeatStress: 'अत्यधिक गर्मी की चेतावनी (उच्च तापीय तनाव)',
    mediumHeatStress: 'मध्यम तापीय तनाव (पर्याप्त सिंचाई सुनिश्चित करें)',
    optimalThermal: 'अनुकूल तापमान सीमा',

    // Spray Window
    avoidSprayingRain: 'छिड़काव से बचें (बारिश से रसायन बहने का जोखिम)',
    avoidSprayingWind: 'छिड़काव से बचें (तेज हवा से कीटनाशक बहने का जोखिम)',
    favorableSpray: 'छिड़काव का अनुकूल समय (साफ मौसम और कम हवा)',

    // Irrigation Advice
    delayIrrigation: 'सिंचाई में देरी करें (प्राकृतिक बारिश की उम्मीद)',
    eveningIrrigation: 'शाम की सिंचाई निर्धारित करें (वाष्पीकरण नुकसान कम करें)',
    normalIrrigation: 'सामान्य सिंचाई कार्यक्रम',

    // Crop Comfort
    challengingComfort: 'चुनौतीपूर्ण',
    optimalComfort: 'अनुकूल',

    // Fieldwork
    prepareDrainage: 'जल निकासी की तैयारी करें और अनाज ढकें',
    favorableFieldwork: 'खेत के कार्यों के लिए अनुकूल',
  },
  gu: {
    // Disease Risk
    highDiseaseRisk: 'ઉચ્ચ રોગનું જોખમ (વધારે ભેજ અને ફૂગના બીજકણની સાનુકૂળતા)',
    mediumDiseaseRisk: 'મધ્યમ રોગનું જોખમ (નીચેના પાંદડાની દેખરેખ કરો)',
    lowDiseaseRisk: 'ઓછું રોગનું જોખમ (સાનુકૂળ સ્વચ્છ હવા)',

    // Heat Stress
    highHeatStress: 'અતિશય ગરમીની ચેતવણી (ઉચ્ચ તાપમાન તણાવ)',
    mediumHeatStress: 'મધ્યમ તાપમાન તણાવ (પર્યાપ્ત પિયત સુનિશ્ચિત કરો)',
    optimalThermal: 'સાનુકૂળ તાપમાન શ્રેણી',

    // Spray Window
    avoidSprayingRain: 'છંટકાવ ટાળો (વરસાદથી દવા ધોવાઈ જવાનું જોખમ)',
    avoidSprayingWind: 'છંટકાવ ટાળો (પવનથી કીટનાશક ઉડી જવાનું જોખમ)',
    favorableSpray: 'છંટકાવનો સાનુકૂળ સમય (સ્વચ્છ હવામાન અને ઓછો પવન)',

    // Irrigation Advice
    delayIrrigation: 'પિયતમાં વિલંબ કરો (વરસાદની સંભાવના)',
    eveningIrrigation: 'સાંજે પિયત આપો (બાષ્પીભવન ઓછું કરવા)',
    normalIrrigation: 'સામાન્ય પિયત સમયપત્રક',

    // Crop Comfort
    challengingComfort: 'પડકારજનક',
    optimalComfort: 'સાનુકૂળ',

    // Fieldwork
    prepareDrainage: 'નિકાલની ગટર સાફ કરો અને અનાજ ઢાંકો',
    favorableFieldwork: 'ખેતરના કામ માટે સાનુકૂળ',
  },
};

export const getTranslation = (key, lang = 'en') => {
  const l = ['en', 'hi', 'gu'].includes(lang) ? lang : 'en';
  return translations[l]?.[key] || translations.en[key] || key;
};

export const getLanguageName = (lang = 'en') => {
  switch (lang) {
    case 'hi':
      return 'Hindi (हिन्दी)';
    case 'gu':
      return 'Gujarati (ગુજરાતી)';
    default:
      return 'English';
  }
};
