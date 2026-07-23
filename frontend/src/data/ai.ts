import type { Lang } from '../i18n/dictionaries';

interface AIResponse {
  text: string;
  confidence: number;
  actions: string[];
  priority: 'high' | 'medium' | 'low';
  impact: string;
}

function pick(text: string, hi: string, gu: string, lang: Lang) {
  return lang === 'hi' ? hi : lang === 'gu' ? gu : text;
}

const knowledge: { keywords: string[]; res: Omit<AIResponse, 'text'> & { text: string; text_hi: string; text_gu: string } }[] = [
  {
    keywords: ['weather', 'rain', 'mausam', 'havaman', 'मौसम', 'हवामान', 'बारिश', 'वरसाद', 'temperature', 'गरम'],
    res: {
      text: 'Current weather is partly cloudy at 31°C with 35% rain probability. Heavy rain expected Wednesday-Thursday (60-80mm). I recommend delaying fertilizer application until Friday. Ensure drainage channels are clear and cover any harvested produce.',
      text_hi: 'वर्तमान मौसम आंशिक बादल 31°C, 35% बारिश संभावना। बुध-गुरु को भारी बारिश (60-80mm)। शुक्रवार तक उर्वरक आवेदन टालें। नालियां साफ रखें और कटाई उपज को ढकें।',
      text_gu: 'વર્તમાન હવામાન આંશિક વાદળ 31°C, 35% વરસાદ સંભાવના. બુધ-ગુરુને ભારે વરસાદ. શુક્રવાર સુધી ખાતર ટાળો. નાળીઓ સ્વચ્છ રાખો.',
      confidence: 91,
      priority: 'high',
      actions: ['Delay fertilizer 2 days', 'Clear drainage channels', 'Cover harvested crops'],
      impact: 'Prevents fertilizer washout and crop damage',
    },
  },
  {
    keywords: ['disease', 'blight', 'pest', 'fungus', 'leaf', 'रोग', 'पत्ती', 'कीट', 'फफूंद', 'રોગ', 'પર્ણ', 'જંતુ'],
    res: {
      text: 'Based on common conditions this season, leaf blight and bollworm are the top risks. For leaf blight, apply copper-based fungicide (3g/L) every 7 days. For bollworm, use neem oil (5ml/L) as preventive. Remove infected plant parts and ensure proper spacing for air circulation.',
      text_hi: 'इस मौसम में पत्ती झुलसा और बोलवर्म मुख्य जोखिम हैं। झुलसे के लिए तांबा फफूंदनाशक (3g/L) हर 7 दिन में लगाएं। बोलवर्म के लिए नीम तेल (5ml/L) निवारक रूप से उपयोग करें।',
      text_gu: 'આ હવામાનમાં પર્ણ ઝુલસો અને બોલવર્મ મુખ્ય જોખમ છે. ઝુલસા માટે તાંબા ફૂગનાશક (3g/L) દર 7 દિવસે. બોલવર્મ માટે નીમ તેલ.',
      confidence: 88,
      priority: 'high',
      actions: ['Apply copper fungicide 3g/L', 'Spray neem oil 5ml/L preventive', 'Remove infected leaves'],
      impact: 'Reduces disease spread by up to 70%',
    },
  },
  {
    keywords: ['market', 'price', 'sell', 'mandi', 'buy', 'बाजार', 'भाव', 'बेच', 'मंडी', 'બજાર', 'ભાવ', 'વેચ', 'મંડી'],
    res: {
      text: 'Tomato prices are up 12% this week at Surat mandi (₹1,850/quintal) with high demand. Forecast shows prices may peak at ₹2,100 in 3 weeks. I recommend selling 40% now for cash flow and storing 60% for higher profit. Cotton at Rajkot is also strong at ₹6,800.',
      text_hi: 'इस सप्ताह सूरत मंडी में टमाटर भाव 12% ऊपर (₹1,850/क्विंटल), उच्च मांग। 3 सप्ताह में ₹2,100 तक पहुंच सकता है। 40% अभी बेचें और 60% रखें। कपास राजकोट में ₹6,800 मजबूत।',
      text_gu: 'આ અઠવાડિયે સુરત મંડીમાં ટમાટર ભાવ 12% ઉપર (₹1,850), ઊંચી માંગ. 3 અઠવાડિયામાં ₹2,100 સુધી. 40% અત્યારે વેચો, 60% સાચવો.',
      confidence: 85,
      priority: 'medium',
      actions: ['Sell 40% tomato at Surat', 'Store 60% for 2 weeks', 'Track daily prices'],
      impact: '+₹23,000 net profit potential',
    },
  },
  {
    keywords: ['irrigation', 'water', 'sipchai', 'पानी', 'सिंचाई', 'जल', 'પાણી', 'સિંચાઈ', 'જળ'],
    res: {
      text: 'Your fields need about 9,200 liters this week, but 28mm rain is expected so you can reduce by 30%. Next irrigation: Field A (Wheat) at 6 AM tomorrow, Field B (Cotton) at 7 AM. Drip irrigation is saving you 23% water vs flood irrigation.',
      text_hi: 'इस सप्ताह लगभग 9,200 लीटर जरूरी, लेकिन 28mm बारिश अपेक्षित इसलिए 30% कम करें। अगली सिंचाई: फील्ड A कल सुबह 6 बजे। ड्रिप सिंचाई 23% जल बचा रही है।',
      text_gu: 'આ અઠવાડિયે લગભગ 9,200 લિટર જરૂરી, પણ 28mm વરસાદ આગાહી એટલે 30% ઘટાડો. આવતી સિંચાઈ: ફીલ્ડ A કાલે સવારે 6.',
      confidence: 89,
      priority: 'medium',
      actions: ['Reduce irrigation 30% this week', 'Run Field A at 6 AM', 'Check drip lines for leaks'],
      impact: 'Saves 2,760 liters water',
    },
  },
  {
    keywords: ['scheme', 'government', 'pm-kisan', 'yojana', 'subsidy', 'योजना', 'सरकार', 'सब्सिडी', 'યોજના', 'સરકાર'],
    res: {
      text: 'You are eligible for 5 schemes. PM-Kisan gives ₹6,000/year (next installment due). PM Fasal Bima Yojana covers crop loss up to ₹50,000/hectare (deadline Aug 15). Kisan Credit Card offers low-interest credit up to ₹3,00,000. Would you like help applying?',
      text_hi: 'आप 5 योजनाओं के लिए पात्र हैं। PM-Kisan ₹6,000/वर्ष। PM फसल बीमा ₹50,000/हेक्टेयर (अंतिम 15 अगस्त)। किसान क्रेडिट कार्ड से ₹3,00,000 तक कम ब्याज क्रेडिट।',
      text_gu: 'તમે 5 યોજનાઓ માટે પાત્ર છો. PM-Kisan ₹6,000/વર્ષ. PM ફસલ બીમા ₹50,000/હેક્ટર (15 ઑગસ્ટ). કિસાન ક્રેડિટ કાર્ડ ₹3,00,000 સુધી.',
      confidence: 95,
      priority: 'medium',
      actions: ['Apply for PM-Kisan next installment', 'Register for crop insurance before Aug 15', 'Apply for KCC at your bank'],
      impact: 'Up to ₹56,000/year in benefits',
    },
  },
  {
    keywords: ['fertilizer', 'urea', 'potash', 'npk', 'compost', 'उर्वरक', 'यूरिया', 'खाद', 'ખાતર', 'યુરિયા'],
    res: {
      text: 'For your wheat at flowering stage, apply 25kg urea + 10kg potash per acre. Nitrogen levels are 12% below optimal. Avoid application during peak flowering or before expected rain. Alternative: use DAP if phosphorus is low, or foliar spray for faster uptake.',
      text_hi: 'गेहूं फूलने चरण में एकड़ गहरे 25kg यूरिया + 10kg पोटाश। नाइट्रोजन 12% कम है। फूलने चरम या बारिश से पहले न लगाएं। विकल्प: फॉस्फोरस कम हो तो DAP।',
      text_gu: 'ઘઉં ફૂલવાના તબક્કામાં એકરદીઠ 25kg યુરિયા + 10kg પોટાશ. નાઇટ્રોજન 12% ઓછું. ફૂલવાના શિખર કે વરસાદ પહેલાં નહીં.',
      confidence: 90,
      priority: 'high',
      actions: ['Apply 25kg urea + 10kg potash/acre', 'Do not spray before rain', 'Consider foliar spray alternative'],
      impact: '+8% yield improvement expected',
    },
  },
];

export function generateAIResponse(query: string, lang: Lang): AIResponse {
  const q = query.toLowerCase();
  const match = knowledge.find((k) =>
    k.keywords.some((kw) => q.includes(kw.toLowerCase())),
  );
  if (match) {
    return {
      text: pick(match.res.text, match.res.text_hi, match.res.text_gu, lang),
      confidence: match.res.confidence,
      actions: match.res.actions,
      priority: match.res.priority,
      impact: match.res.impact,
    };
  }
  const fallbacks = {
    en: `I can help with weather, disease detection, crop advisory, irrigation, market prices, government schemes, and fertilizer recommendations. Based on your farm data, your overall health score is 78/100 — good condition with minor pest risk to monitor. What would you like to know more about?`,
    hi: `मैं मौसम, रोग पहचान, फसल सलाह, सिंचाई, बाजार भाव, सरकारी योजनाएं और उर्वरक सलाह में मदद कर सकता हूं। आपका खेत स्वास्थ्य स्कोर 78/100 है — अच्छी स्थिति, हल्का कीट जोखिम। और क्या जानना चाहेंगे?`,
    gu: `હું હવામાન, રોગ શોધ, પાક સલાહ, સિંચાઈ, બજાર ભાવ, સરકારી યોજના અને ખાતર સલાહમાં મદદ કરી શકું. તમારું ખેતર સ્વાસ્થ્ય 78/100 — સારી સ્થિતિ, હળવું જંતુ જોખમ.`,
  };
  return {
    text: fallbacks[lang],
    confidence: 82,
    actions: ['Check farm dashboard', 'Review active alerts'],
    priority: 'medium',
    impact: 'Better farm visibility',
  };
}

export const chatSuggestions = {
  en: ['Will it rain this week?', 'How to treat leaf blight?', 'Best time to sell tomato?', 'Which schemes am I eligible for?'],
  hi: ['इस सप्ताह बारिश होगी?', 'पत्ती झुलसा का इलाज?', 'टमाटर कब बेचें?', 'मैं किन योजनाओं के पात्र हूं?'],
  gu: ['આ અઠવાડિયે વરસાદ થશે?', 'પર્ણ ઝુલસો સારવાર?', 'ટમાટર ક્યારે વેચો?', 'હું કઈ યોજનાઓ માટે પાત્ર છું?'],
};
