export const crops = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Tomato', 'Groundnut', 'Bajra', 'Maize'];
export const cropIcon: Record<string, string> = {
  Wheat: '🌾', Rice: '🍚', Cotton: '☁️', Sugarcane: '🎋',
  Tomato: '🍅', Groundnut: '🥜', Bajra: '🌿', Maize: '🌽',
};

export const soilTypes = ['Black Cotton Soil', 'Red Loam', 'Alluvial', 'Sandy Loam', 'Clay'];
export const irrigationSources = ['Canal', 'Borewell', 'Drip', 'Rainfed', 'River'];
export const states = ['Gujarat', 'Maharashtra', 'Punjab', 'Rajasthan', 'Madhya Pradesh', 'Uttar Pradesh', 'Karnataka', 'Tamil Nadu'];

export const weatherNow = {
  temp: 31,
  feels: 34,
  condition: 'Partly Cloudy',
  humidity: 68,
  wind: 14,
  rainProb: 35,
  uv: 7,
  visibility: 8,
  icon: 'partly-cloudy',
};

export const hourlyWeather = [
  { time: '12 PM', temp: 31, rain: 10 },
  { time: '1 PM', temp: 32, rain: 15 },
  { time: '2 PM', temp: 33, rain: 20 },
  { time: '3 PM', temp: 33, rain: 35 },
  { time: '4 PM', temp: 32, rain: 45 },
  { time: '5 PM', temp: 31, rain: 55 },
  { time: '6 PM', temp: 29, rain: 40 },
  { time: '7 PM', temp: 28, rain: 25 },
];

export const weeklyWeather = [
  { day: 'Mon', max: 33, min: 24, rain: 20, icon: 'sunny' },
  { day: 'Tue', max: 34, min: 25, rain: 10, icon: 'sunny' },
  { day: 'Wed', max: 32, min: 24, rain: 60, icon: 'rain' },
  { day: 'Thu', max: 30, min: 23, rain: 80, icon: 'rain' },
  { day: 'Fri', max: 31, min: 23, rain: 40, icon: 'partly-cloudy' },
  { day: 'Sat', max: 33, min: 25, rain: 15, icon: 'sunny' },
  { day: 'Sun', max: 34, min: 26, rain: 5, icon: 'sunny' },
];

export const weatherAlerts = [
  {
    type: 'rain',
    title: 'Heavy Rain Expected',
    title_hi: 'भारी बारिश की संभावना',
    title_gu: 'ભારે વરસાદની સંભાવના',
    desc: '60-80mm rainfall expected Wed-Thu. Delay fertilizer application.',
    severity: 'high',
  },
  {
    type: 'heat',
    title: 'High Temperature Advisory',
    title_hi: 'उच्च तापमान सलाह',
    title_gu: 'ઊંચા તાપમાન સલાહ',
    desc: 'Temperatures reaching 34°C. Increase evening irrigation.',
    severity: 'medium',
  },
];

export const marketPrices = [
  { crop: 'Wheat', mandi: 'Ahmedabad', price: 2240, change: 2.3, demand: 'high' },
  { crop: 'Cotton', mandi: 'Rajkot', price: 6800, change: 1.8, demand: 'high' },
  { crop: 'Groundnut', mandi: 'Junagadh', price: 5850, change: -0.5, demand: 'medium' },
  { crop: 'Tomato', mandi: 'Surat', price: 1850, change: 12.4, demand: 'high' },
  { crop: 'Rice', mandi: 'Bharuch', price: 3120, change: 0.9, demand: 'medium' },
  { crop: 'Sugarcane', mandi: 'Navsari', price: 340, change: 0.2, demand: 'low' },
  { crop: 'Maize', mandi: 'Mehsana', price: 1980, change: 3.1, demand: 'high' },
  { crop: 'Bajra', mandi: 'Banaskantha', price: 2350, change: -1.2, demand: 'medium' },
];

export const priceTrend = [
  { month: 'Jan', wheat: 2100, cotton: 6500, tomato: 1400 },
  { month: 'Feb', wheat: 2150, cotton: 6600, tomato: 1500 },
  { month: 'Mar', wheat: 2200, cotton: 6700, tomato: 1650 },
  { month: 'Apr', wheat: 2240, cotton: 6800, tomato: 1850 },
  { month: 'May', wheat: 2280, cotton: 6900, tomato: 1600 },
  { month: 'Jun', wheat: 2310, cotton: 7000, tomato: 1450 },
];

export const priceForecast = [
  { month: 'Jul', wheat: 2340, cotton: 7100, tomato: 1700 },
  { month: 'Aug', wheat: 2360, cotton: 7200, tomato: 1900 },
  { month: 'Sep', wheat: 2380, cotton: 7350, tomato: 2100 },
  { month: 'Oct', wheat: 2400, cotton: 7400, tomato: 1950 },
  { month: 'Nov', wheat: 2420, cotton: 7500, tomato: 1750 },
];

export const diseases = [
  {
    name: 'Leaf Blight',
    name_hi: 'पत्ती झुलसा',
    name_gu: 'પર્ણ ઝુલસો',
    confidence: 94,
    severity: 'high',
    treatment: 'Apply copper-based fungicide (3g/L) every 7 days. Remove infected leaves.',
    treatment_hi: 'तांबे आधारित फफूंदनाशक (3g/L) हर 7 दिन में लगाएं। संक्रमित पत्तियां हटाएं।',
    treatment_gu: 'તાંબા આધારિત ફૂગનાશક (3g/L) દર 7 દિવસે લગાવો. ચેપી પર્ણ દૂર કરો.',
    prevention: 'Ensure proper spacing, avoid overhead watering, use resistant varieties.',
    prevention_hi: 'उचित दूरी सुनिश्चित करें, ऊपर से पानी देने से बचें, प्रतिरोधी किस्मों का उपयोग करें।',
    prevention_gu: 'યોગ્ય અંતર સુનિશ્ચિત કરો, ઉપરથી પાણી આપવાનું ટાળો, પ્રતિરોધક જાતો વાપરો.',
  },
  {
    name: 'Bacterial Spot',
    name_hi: 'जीवाणु धब्बा',
    name_gu: 'જીવાણુ ધાબા',
    confidence: 87,
    severity: 'medium',
    treatment: 'Spray streptomycin sulfate + copper hydroxide. Rotate crops next season.',
    treatment_hi: 'स्ट्रेप्टोमाइसिन सल्फेट + कॉपर हाइड्रोक्साइड छिड़काव करें। अगली बारिश में फसल घुमाएं।',
    treatment_gu: 'સ્ટ્રેપ્ટોમાયસિન સલ્ફેટ + કોપર હાઇડ્રોક્સાઇડ છંટકાવ કરો.',
    prevention: 'Use disease-free seeds, sanitize tools, avoid working with wet plants.',
    prevention_hi: 'रोग मुक्त बीज उपयोग करें, उपकरण साफ रखें, गीले पौधों पर काम से बचें।',
    prevention_gu: 'રોગ મુક્ત બીજ વાપરો, સાધનો સ્વચ્છ રાખો.',
  },
  {
    name: 'Powdery Mildew',
    name_hi: 'फफूंदी',
    name_gu: 'ફૂગ',
    confidence: 91,
    severity: 'medium',
    treatment: 'Apply sulfur-based fungicide or neem oil (5ml/L) weekly.',
    treatment_hi: 'सल्फर आधारित फफूंदनाशक या नीम तेल (5ml/L) साप्ताहिक लगाएं।',
    treatment_gu: 'સલ્ફર આધારિત ફૂગનાશક કે નીમ તેલ (5ml/L) સાપ્તાહિક લગાવો.',
    prevention: 'Improve air circulation, reduce humidity, remove infected parts.',
    prevention_hi: 'हवा संचार सुधारें, नमी कम करें, संक्रमित हिस्से हटाएं।',
    prevention_gu: 'હવા ફરત સુધારો, ભેજ ઘટાડો, ચેપી ભાગ દૂર કરો.',
  },
];

export const farmHealth = {
  score: 78,
  factors: [
    { name: 'Soil Moisture', name_hi: 'मिट्टी नमी', name_gu: 'જમીન ભેજ', value: 82, status: 'good' },
    { name: 'Crop Vigor', name_hi: 'फसल जीवन्तता', name_gu: 'પાક જીવંતતા', value: 75, status: 'good' },
    { name: 'Pest Risk', name_hi: 'कीट जोखिम', name_gu: 'જંતુ જોખમ', value: 38, status: 'watch' },
    { name: 'Nutrient Level', name_hi: 'पोषक स्तर', name_gu: 'પોષક સ્તર', value: 71, status: 'good' },
    { name: 'Weather Favor', name_hi: 'मौसम अनुकूल', name_gu: 'હવામાન અનુકૂળ', value: 84, status: 'good' },
  ],
};

export const dashboardTasks = [
  { id: 1, task: 'Apply urea to wheat field', task_hi: 'गेहूं खेत में यूरिया लगाएं', task_gu: 'ઘઉં ખેતરમાં યુરિયા લગાવો', time: '7:00 AM', done: true, priority: 'high' },
  { id: 2, task: 'Check drip irrigation lines', task_hi: 'ड्रिप सिंचाई लाइन जांचें', task_gu: 'ડ્રિપ સિંચાઈ લાઈન ચકાસો', time: '9:00 AM', done: true, priority: 'medium' },
  { id: 3, task: 'Scout for bollworm in cotton', task_hi: 'कपास में बोलवर्म जांचें', task_gu: 'કપાસમાં બોલવર્મ ચકાસો', time: '11:00 AM', done: false, priority: 'high' },
  { id: 4, task: 'Harvest tomato batch 2', task_hi: 'टमाटर बैच 2 काटें', task_gu: 'ટમાટર બેચ 2 લણો', time: '4:00 PM', done: false, priority: 'medium' },
  { id: 5, task: 'Register for PM-Kisan installment', task_hi: 'PM-Kissan किस्त के लिए नामांकन', task_gu: 'PM-Kisan કિસ્ત માટે નોંધણી', time: '6:00 PM', done: false, priority: 'low' },
];

export const profitSummary = {
  revenue: 485000,
  cost: 198000,
  profit: 287000,
  margin: 59,
  trend: [180000, 220000, 245000, 287000],
};

export const yieldTrend = [
  { month: 'Jan', actual: 4.2, predicted: 4.3 },
  { month: 'Feb', actual: 4.5, predicted: 4.4 },
  { month: 'Mar', actual: 4.8, predicted: 4.7 },
  { month: 'Apr', actual: 5.1, predicted: 5.0 },
  { month: 'May', actual: 5.3, predicted: 5.2 },
  { month: 'Jun', actual: null, predicted: 5.4 },
];

export const waterUsage = [
  { week: 'W1', liters: 12000 },
  { week: 'W2', liters: 10500 },
  { week: 'W3', liters: 9200 },
  { week: 'W4', liters: 8800 },
];

export const monthlyIncome = [
  { month: 'Jan', income: 42000 },
  { month: 'Feb', income: 38000 },
  { month: 'Mar', income: 65000 },
  { month: 'Apr', income: 58000 },
  { month: 'May', income: 72000 },
  { month: 'Jun', income: 48000 },
];

export const aiInsights = [
  {
    title: 'Fertilizer optimization',
    title_hi: 'उर्वरक अनुकूलन',
    title_gu: 'ખાતર ઑપ્ટિમાઇઝેશન',
    desc: 'Nitrogen levels dropping 12% in Field A. Apply 25kg urea within 3 days.',
    desc_hi: 'फील्ड A में नाइट्रोजन 12% गिर रहा है। 3 दिन में 25kg यूरिया लगाएं।',
    desc_gu: 'ફીલ્ડ A માં નાઇટ્રોજન 12% ઘટી રહ્યું છે. 3 દિવસમાં 25kg યુરિયા લગાવો.',
    priority: 'high',
    confidence: 92,
  },
  {
    title: 'Pest risk alert',
    title_hi: 'कीट जोखिम चेतावनी',
    title_gu: 'જંતુ જોખમ ચેતવણી',
    desc: 'Conditions favorable for bollworm in cotton. Scout within 48 hours.',
    desc_hi: 'कपास में बोलवर्म के लिए परिस्थितियां अनुकूल। 48 घंटे में जांच करें।',
    desc_gu: 'કપાસમાં બોલવર્મ માટે સ્થિતિ અનુકૂળ. 48 કલાકમાં ચકાસો.',
    priority: 'high',
    confidence: 88,
  },
  {
    title: 'Best market window',
    title_hi: 'सर्वश्रेष्ठ बाजार अवसर',
    title_gu: 'શ્રેષ્ઠ બજાર તક',
    desc: 'Tomato prices rising 12% this week. Sell within 4 days for max profit.',
    desc_hi: 'इस सप्ताह टमाटर भाव 12% बढ़ रहे हैं। अधिकतम लाभ के लिए 4 दिन में बेचें।',
    desc_gu: 'આ અઠવાડિયે ટમાટર ભાવ 12% વધી રહ્યા છે. 4 દિવસમાં વેચો.',
    priority: 'medium',
    confidence: 85,
  },
];

export const schemes = [
  {
    id: 'pmkisan',
    name: 'PM-Kisan Samman Nidhi',
    name_hi: 'PM-किसान सम्मान निधि',
    name_gu: 'PM-કિસાન સન્માન નિધિ',
    benefit: '₹6,000/year direct cash transfer',
    benefit_hi: '₹6,000/वर्ष सीधे नकद हस्तांतरण',
    benefit_gu: '₹6,000/વર્ષ સીધું રોકડ હસ્તાંતરણ',
    deadline: 'Ongoing',
    docs: ['Aadhaar', 'Land records', 'Bank account'],
    eligibility: 'All landholding farmers',
  },
  {
    id: 'pmfby',
    name: 'PM Fasal Bima Yojana',
    name_hi: 'PM फसल बीमा योजना',
    name_gu: 'PM ફસલ બીમા યોજના',
    benefit: 'Crop insurance up to ₹50,000/hectare',
    benefit_hi: '₹50,000/हेक्टेयर तक फसल बीमा',
    benefit_gu: '₹50,000/હેક્ટર સુધી પાક વીમો',
    deadline: '15 Aug 2026',
    docs: ['Aadhaar', 'Land records', 'Bank account', 'Sowing certificate'],
    eligibility: 'Loanee and non-loanee farmers',
  },
  {
    id: 'soil',
    name: 'Soil Health Card Scheme',
    name_hi: 'मृदा स्वास्थ्य कार्ड योजना',
    name_gu: 'જમીન સ્વાસ્થ્ય કાર્ડ યોજના',
    benefit: 'Free soil testing & nutrient recommendations',
    benefit_hi: 'मुफ्त मिट्टी परीक्षण और पोषक सलाह',
    benefit_gu: 'મફત જમીન ચકાસણી અને પોષક સલાહ',
    deadline: 'Ongoing',
    docs: ['Aadhaar', 'Land records'],
    eligibility: 'All farmers',
  },
  {
    id: 'kcc',
    name: 'Kisan Credit Card',
    name_hi: 'किसान क्रेडिट कार्ड',
    name_gu: 'કિસાન ક્રેડિટ કાર્ડ',
    benefit: 'Low-interest credit up to ₹3,00,000',
    benefit_hi: '₹3,00,000 तक कम ब्याज क्रेडिट',
    benefit_gu: '₹3,00,000 સુધી ઓછા વ્યાજ ક્રેડિટ',
    deadline: '31 Dec 2026',
    docs: ['Aadhaar', 'Land records', 'Bank account', 'Identity proof'],
    eligibility: 'All farmers, sharecroppers, tenant farmers',
  },
  {
    id: 'irrigation',
    name: 'Pradhan Mantri Krishi Sinchayee Yojana',
    name_hi: 'प्रधानमंत्री कृषि सिंचाई योजना',
    name_gu: 'પ્રધાનમંત્રી કૃષિ સિંચાઈ યોજના',
    benefit: '45-55% subsidy on drip/sprinkler irrigation',
    benefit_hi: 'ड्रिप/स्प्रिंकलर पर 45-55% सब्सिडी',
    benefit_gu: 'ડ્રિપ/સ્પ્રિન્કલર પર 45-55% સબસિડી',
    deadline: '30 Sep 2026',
    docs: ['Aadhaar', 'Land records', 'Bank account', 'Quotation'],
    eligibility: 'All farmers with cultivable land',
  },
];

export const notifications = [
  { id: 1, type: 'weather', title: 'Heavy rain in 2 days', title_hi: '2 दिन में भारी बारिश', title_gu: '2 દિવસમાં ભારે વરસાદ', desc: 'Cover harvested crops', time: '5m ago', read: false },
  { id: 2, type: 'market', title: 'Tomato price up 12%', title_hi: 'टमाटर भाव 12% ऊपर', title_gu: 'ટમાટર ભાવ 12% ઉપર', desc: 'Good time to sell at Surat mandi', time: '1h ago', read: false },
  { id: 3, type: 'disease', title: 'Blight risk detected nearby', title_hi: 'पास में झुलसा जोखिम', title_gu: 'નજીક ઝુલસો જોખમ', desc: 'Apply preventive fungicide', time: '3h ago', read: false },
  { id: 4, type: 'gov', title: 'PM-Kisan installment credited', title_hi: 'PM-Kisan किस्त जमा', title_gu: 'PM-Kisan કિસ્ત જમા', desc: '₹2,000 received in your account', time: '1d ago', read: true },
  { id: 5, type: 'ai', title: 'New advisory ready', title_hi: 'नई सलाह तैयार', title_gu: 'નવી સલાહ તૈયાર', desc: 'Weekly crop plan updated', time: '1d ago', read: true },
  { id: 6, type: 'weather', title: 'UV index high today', title_hi: 'आज UV सूचकांक उच्च', title_gu: 'આજે UV સૂચકાંક ઊંચો', desc: 'Avoid midday field work', time: '2d ago', read: true },
];

export const weeklyPlanner = [
  { day: 'mon', tasks: ['Apply nitrogen fertilizer', 'Check soil moisture sensors'] },
  { day: 'tue', tasks: ['Scout cotton for pests', 'Repair drip line section B'] },
  { day: 'wed', tasks: ['Rain expected — delay spraying', 'Prepare drainage channels'] },
  { day: 'thu', tasks: ['Post-rain disease scouting', 'Harvest tomato batch'] },
  { day: 'fri', tasks: ['Sell tomato at Surat mandi', 'Apply potash to wheat'] },
  { day: 'sat', tasks: ['Maintain farm equipment', 'Update farm diary'] },
  { day: 'sun', tasks: ['Review weekly AI report', 'Plan next week'] },
];

export const sellStoreData = {
  crop: 'Tomato',
  currentPrice: 1850,
  forecastAvg: 1950,
  forecastPeak: 2100,
  storageCostPerWeek: 120,
  spoilageRate: 4,
  transportCost: 800,
  sellNowProfit: 175000,
  storeProfit: 198000,
  recommendation: 'store',
  confidence: 87,
  reasoning: 'Prices forecast to rise 14% over 3 weeks. Spoilage risk is moderate (4%/week). Net gain from storing 2 weeks: ₹23,000 after storage cost. Recommend storing 60% and selling 40% now for cash flow.',
  reasoning_hi: '3 सप्ताह में भाव 14% बढ़ने का अनुमान। खराब होने का जोखिम मध्यम (4%/सप्ताह)। 2 सप्ताह भंडारण का शुद्ध लाभ: ₹23,000। 60% रखें और 40% अभी बेचें।',
  reasoning_gu: '3 અઠવાડિયામાં ભાવ 14% વધવાનો અંદાજ. બગડવાનું જોખમ મધ્યમ. 2 અઠવાડિયા સંગ્રહનો ચોખ્ખો નફો: ₹23,000. 60% સાચવો અને 40% અત્યારે વેચો.',
  actions: ['Store 60% in cool facility', 'Sell 40% now at Surat mandi', 'Monitor prices daily'],
  impact: '+₹23,000 net profit over 2 weeks',
};

export const irrigationData = {
  requirement: 9200,
  rainExpected: 28,
  nextIrrigation: '2 days',
  saving: 23,
  schedule: [
    { zone: 'Field A (Wheat)', time: '6:00 AM', duration: '45 min', status: 'scheduled' },
    { zone: 'Field B (Cotton)', time: '7:00 AM', duration: '60 min', status: 'scheduled' },
    { zone: 'Field C (Tomato)', time: '5:30 PM', duration: '30 min', status: 'today' },
  ],
};

export const advisoryData = {
  growthStage: 'Flowering',
  growthStage_hi: 'फूलने का चरण',
  growthStage_gu: 'ફૂલવાનો તબક્કો',
  water: 'Apply 25mm irrigation this week. Skip if rainfall exceeds 30mm.',
  water_hi: 'इस सप्ताह 25mm सिंचाई दें। यदि बारिश 30mm से अधिक हो तो छोड़ें।',
  water_gu: 'આ અઠવાડિયે 25mm સિંચાઈ આપો. જો વરસાદ 30mmથી વધુ હોય તો છોડો.',
  fertilizer: 'Apply 25kg urea + 10kg potash per acre. Avoid during flowering peak.',
  fertilizer_hi: 'एकड़ गहरे 25kg यूरिया + 10kg पोटाश लगाएं। फूलने के चरम पर न लगाएं।',
  fertilizer_gu: 'એકરદીઠ 25kg યુરિયા + 10kg પોટાશ લગાવો.',
  harvest: 'Estimated harvest: 45 days. Expected yield: 5.4 ton/acre (+8% vs last season).',
  harvest_hi: 'अनुमानित कटाई: 45 दिन। अपेक्षित उपज: 5.4 टन/एकड़ (+8%).',
  harvest_gu: 'અંદાજિત લણણી: 45 દિવસ. અપેક્ષિત ઉપજ: 5.4 ટન/એકર.',
  confidence: 90,
  reason: 'Based on current soil NPK levels, 10-day weather forecast, and crop growth stage matching historical data from 240 similar farms.',
  reason_hi: 'वर्तमान मिट्टी NPK, 10-दिन मौसम पूर्वानुमान और 240 समान खेतों के ऐतिहासिक डेटा आधार पर।',
  reason_gu: 'વર્તમાન જમીન NPK, 10-દિવસ હવામાન આગાહી અને 240 સમાન ખેતરના ઐતિહાસિક ડેટા આધારે.',
  alternatives: ['Use DAP instead of urea if soil phosphorus is low', 'Apply foliar spray for faster absorption'],
};

export const testimonials = [
  { name: 'Ramesh Patel', village: 'Anand, Gujarat', text: 'KrishiMitra detected leaf blight early and saved 30% of my tomato crop. The AI advisory is remarkably accurate.', rating: 5 },
  { name: 'Sunita Devi', village: 'Kota, Rajasthan', text: 'The market intelligence feature helped me sell wheat at the right time. I earned ₹40,000 more this season.', rating: 5 },
  { name: 'Gurpreet Singh', village: 'Ludhiana, Punjab', text: 'Smart irrigation cut my water usage by 25% while maintaining yield. The weekly planner keeps me organized.', rating: 5 },
  { name: 'Lakshmi Naidu', village: 'Coimbatore, Tamil Nadu', text: 'Voice assistant in Tamil is a game changer. I get crop advice without typing. Government schemes section got me PM-Kisan benefits.', rating: 5 },
];
