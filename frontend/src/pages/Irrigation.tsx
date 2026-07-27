import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Droplets,
  CloudRain,
  Clock,
  Save,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Thermometer,
  ShieldAlert,
  Sprout,
  Activity,
  Award,
  Sun,
  Moon,
} from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { Card, Badge, SectionHeader, Button, Skeleton } from '@/components/ui';
import {
  getIrrigationApi,
  refreshIrrigationApi,
  IrrigationApiResponse,
} from '@/api/irrigation';

const uiTranslations = {
  en: {
    pageTitle: 'Smart Irrigation Decision Engine',
    pageSubtitle: 'Precision water telemetry, soil moisture retention, and micro-climate forecasting',
    liveEngine: 'Smart Engine Live',
    refreshEngine: 'Refresh Engine',
    calculating: 'Calculating Engine...',
    priority: 'Priority',
    confidence: 'Confidence',
    updated: 'Updated',
    engineRule: 'Deterministic Engine Rule',
    targetWater: 'Target Water',
    duration: 'Duration',
    nextCycle: 'Next Cycle',
    waterDemand: 'Water Demand',
    liters: 'Liters',
    dripRun: 'Drip Run',
    rainForecast: 'Rain Forecast',
    soilMoisture: 'Soil Moisture',
    retention: 'Retention',
    heatStress: 'Heat Stress',
    evap: 'Evap',
    cropStage: 'Crop Stage',
    day: 'Day',
    bestWindowsTitle: 'Best Daily Irrigation Windows',
    bestWindowsSubtitle: '4-Slot Precision Transpiration Matrix',
    analyticsTitle: 'Water Saving & Efficiency Analytics',
    analyticsSubtitle: 'Compared to Traditional Flood Irrigation',
    waterSaved: 'Estimated Water Saved',
    costSaved: 'Pumping Cost Savings',
    efficiencyScore: 'Engine Efficiency Score',
    guidanceTitle: 'Smart Agronomic Guidance',
    tailoredFor: 'Tailored for',
    stage: 'stage',
    farmerAdvisory: 'Farmer Advisory',
    fieldPrecautions: 'Field Precautions',
    waterSavingTips: 'Water Saving Tips',
    fertigation: 'Fertigation Suggestion',
    weatherWarning: 'Weather & Field Warning',
    slotMorning: 'MORNING',
    slotAfternoon: 'AFTERNOON',
    slotEvening: 'EVENING',
    slotNight: 'NIGHT',
    recOptimal: 'Optimal',
    recAvoid: 'Avoid',
    recGood: 'Good',
    recModerate: 'Moderate',
  },
  hi: {
    pageTitle: 'स्मार्ट सिंचाई निर्णय इंजन',
    pageSubtitle: 'सटीक जल मापन, मृदा नमी क्षमता और सूक्ष्म-जलवायु पूर्वानुमान',
    liveEngine: 'स्मार्ट इंजन लाइव',
    refreshEngine: 'इंजन रिफ्रेश करें',
    calculating: 'गणना जारी है...',
    priority: 'प्राथमिकता',
    confidence: 'विश्वसनीयता',
    updated: 'अद्यतन',
    engineRule: 'इंजन नियम',
    targetWater: 'लक्ष्य जल',
    duration: 'अवधि',
    nextCycle: 'अगला चक्र',
    waterDemand: 'जल की मांग',
    liters: 'लीटर',
    dripRun: 'ड्रिप समय',
    rainForecast: 'वर्षा पूर्वानुमान',
    soilMoisture: 'मृदा नमी',
    retention: 'क्षमता',
    heatStress: 'तापीय तनाव',
    evap: 'वाष्पीकरण',
    cropStage: 'फसल अवस्था',
    day: 'दिन',
    bestWindowsTitle: 'सर्वश्रेष्ठ दैनिक सिंचाई समय',
    bestWindowsSubtitle: '4-समय स्लॉट वाष्पोत्सर्जन मैट्रिक्स',
    analyticsTitle: 'जल बचत और दक्षता विश्लेषण',
    analyticsSubtitle: 'पारंपरिक बाढ़ सिंचाई की तुलना में',
    waterSaved: 'अनुमानित जल बचत',
    costSaved: 'पंपिंग लागत बचत',
    efficiencyScore: 'इंजन दक्षता स्कोर',
    guidanceTitle: 'स्मार्ट कृषि मार्गदर्शन',
    tailoredFor: 'विशेष सलाह:',
    stage: 'अवस्था',
    farmerAdvisory: 'किसान सलाह',
    fieldPrecautions: 'खेत सावधानियां',
    waterSavingTips: 'जल बचत उपाय',
    fertigation: 'उर्वरक एवं ड्रिप सिंचाई सुझाव',
    weatherWarning: 'मौसम एवं खेत चेतावनी',
    slotMorning: 'सुबह (MORNING)',
    slotAfternoon: 'दोपहर (AFTERNOON)',
    slotEvening: 'शाम (EVENING)',
    slotNight: 'रात (NIGHT)',
    recOptimal: 'सर्वोत्तम',
    recAvoid: 'बचें',
    recGood: 'अच्छा',
    recModerate: 'सामान्य',
  },
  gu: {
    pageTitle: 'સ્માર્ટ સિંચાઈ નિર્ણય એન્જિન',
    pageSubtitle: 'ચોક્કસ જળ ટેલિમેટ્રી, જમીનનો ભેજ અને સૂક્ષ્મ-હવામાન આગાહી',
    liveEngine: 'સ્માર્ટ એન્જિન લાઈવ',
    refreshEngine: 'એન્જિન રિફ્રેશ કરો',
    calculating: 'ગણતરી ચાલુ છે...',
    priority: 'પ્રાથમિકતા',
    confidence: 'વિશ્વાસપાત્રતા',
    updated: 'અપડેટ',
    engineRule: 'એન્જિન નિયમ',
    targetWater: 'લક્ષ્ય પાણી',
    duration: 'સમયગાળો',
    nextCycle: 'આગામી ચક્ર',
    waterDemand: 'પાણીની માંગ',
    liters: 'લિટર',
    dripRun: 'ડ્રિપ સમય',
    rainForecast: 'વરસાદ આગાહી',
    soilMoisture: 'જમીનનો ભેજ',
    retention: 'ક્ષમતા',
    heatStress: 'તાપમાન તણાવ',
    evap: 'બાષ્પીભવન',
    cropStage: 'પાક તબક્કો',
    day: 'દિવસ',
    bestWindowsTitle: 'શ્રેષ્ઠ દૈનિક સિંચાઈ સમય',
    bestWindowsSubtitle: '4-સમય સ્લોટ બાષ્પીભવન મેટ્રિક્સ',
    analyticsTitle: 'પાણી બચત અને કાર્યક્ષમતા વિશ્લેષણ',
    analyticsSubtitle: 'પરંપરાગત પૂર સિંચાઈની સરખામણીમાં',
    waterSaved: 'અનુમાનિત પાણી બચત',
    costSaved: 'પમ્પિંગ ખર્ચ બચત',
    efficiencyScore: 'એન્જિન કાર્યક્ષમતા સ્કોર',
    guidanceTitle: 'સ્માર્ટ કૃષિ માર્ગદર્શન',
    tailoredFor: 'વિશેષ સલાહ:',
    stage: 'તબક્કો',
    farmerAdvisory: 'ખેડૂત સલાહ',
    fieldPrecautions: 'ખેતર સાવચેતીઓ',
    waterSavingTips: 'પાણી બચાવવાની ટિપ્સ',
    fertigation: 'ખાતર અને ડ્રિપ પિયત સૂચન',
    weatherWarning: 'હવામાન અને ખેતર ચેતવણી',
    slotMorning: 'સવાર (MORNING)',
    slotAfternoon: 'બપોર (AFTERNOON)',
    slotEvening: 'સાંજ (EVENING)',
    slotNight: 'રાત્રે (NIGHT)',
    recOptimal: 'શ્રેષ્ઠ',
    recAvoid: 'ટાળો',
    recGood: 'સારું',
    recModerate: 'સામાન્ય',
  },
};

export function Irrigation() {
  const { lang } = useApp();
  const txt = uiTranslations[lang as keyof typeof uiTranslations] || uiTranslations.en;

  const [data, setData] = useState<IrrigationApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIrrigationData = async (forceRefresh = false) => {
    try {
      if (forceRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const res = forceRefresh
        ? await refreshIrrigationApi(lang)
        : await getIrrigationApi(lang);

      setData(res);
    } catch (err: any) {
      console.error('Failed to fetch irrigation recommendation:', err);
      setError(err.message || 'Unable to connect to Smart Irrigation Engine');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchIrrigationData(false);
  }, [lang]);

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const recommendation = data?.recommendation;
  const groq = data?.groqExplanation;

  // Translation helpers for legacy or un-translated strings
  const getTranslatedTodayRec = (recStr?: string) => {
    if (!recStr) return '';
    if (lang === 'hi' && recStr.includes('Soil moisture is stable')) {
      return recStr.replace(/Soil moisture is stable; next irrigation cycle scheduled for (.*)\./, 'मिट्टी की नमी स्थिर है; अगला सिंचाई चक्र $1 को निर्धारित है।');
    }
    if (lang === 'gu' && recStr.includes('Soil moisture is stable')) {
      return recStr.replace(/Soil moisture is stable; next irrigation cycle scheduled for (.*)\./, 'જમીનનો ભેજ સંતુલિત છે; આગામી પિયત $1 પર નિર્ધારિત છે।');
    }
    return recStr;
  };

  const getTranslatedReason = (reasonStr?: string) => {
    if (!reasonStr) return '';
    if (reasonStr.includes('Standard Agronomic Baseline')) {
      return lang === 'hi'
        ? 'मानक कृषि नियम आधार रेखा (मृदा नमी संतुलित है)'
        : lang === 'gu'
        ? 'સામાન્ય કૃષિ નિયમ આધાર રેખા (જમીનમાં ભેજ યોગ્ય છે)'
        : reasonStr;
    }
    return reasonStr;
  };

  // Status Badge mapping
  const getStatusBadge = (status?: string) => {
    const s = String(status || '').toLowerCase();
    if (s.includes('irrigate') || s.includes('तुरंत') || s.includes('તરત')) {
      return { variant: 'success' as const, label: status || 'Irrigate Now' };
    }
    if (s.includes('delay') || s.includes('टालें') || s.includes('મુલતવી')) {
      return { variant: 'danger' as const, label: status || 'Delay' };
    }
    if (s.includes('monitor') || s.includes('निगरानी') || s.includes('દેખરેખ')) {
      return { variant: 'warning' as const, label: status || 'Monitor' };
    }
    return { variant: 'info' as const, label: status || 'Wait' };
  };

  const getSlotTitle = (slotKey?: string) => {
    switch (slotKey) {
      case 'Morning': return txt.slotMorning;
      case 'Afternoon': return txt.slotAfternoon;
      case 'Evening': return txt.slotEvening;
      case 'Night': return txt.slotNight;
      default: return slotKey || txt.slotMorning;
    }
  };

  const getSlotRecLabel = (recStr?: string) => {
    const r = String(recStr || '').toLowerCase();
    if (r.includes('optimal') || r.includes('सर्वोत्तम') || r.includes('શ્રેષ્ઠ')) return txt.recOptimal;
    if (r.includes('avoid') || r.includes('बचें') || r.includes('ટાળો')) return txt.recAvoid;
    if (r.includes('good') || r.includes('अच्छा') || r.includes('સારું')) return txt.recGood;
    return txt.recModerate;
  };

  const statusBadge = getStatusBadge(recommendation?.status);

  return (
    <div className="space-y-6 pb-10">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text">
              {txt.pageTitle}
            </h1>
            <Badge variant="info" pulse className="ml-2">
              {txt.liveEngine}
            </Badge>
          </div>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            {txt.pageSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => fetchIrrigationData(true)}
            disabled={refreshing}
            variant="outline"
            className="rounded-2xl border-sky-500/30 hover:border-sky-500/60 text-xs font-bold gap-2"
          >
            <RefreshCw className={`h-4 w-4 text-sky-500 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? txt.calculating : txt.refreshEngine}</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-sm flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* SECTION 1: TOP HERO CARD - RECOMMENDATION OVERVIEW */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-sky-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950/60 p-6 shadow-2xl text-white"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Droplets className="h-72 w-72 text-sky-400" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant={statusBadge.variant} pulse className="text-xs px-3.5 py-1">
                {statusBadge.label}
              </Badge>
              <Badge variant="outline" className="text-xs px-3 py-1 border-white/20 text-slate-300">
                {txt.priority}: <span className="font-bold text-white ml-1">{recommendation?.priority}</span>
              </Badge>
              <Badge variant="outline" className="text-xs px-3 py-1 border-white/20 text-slate-300">
                {txt.confidence}: <span className="font-bold text-sky-400 ml-1">{recommendation?.confidenceScore}%</span>
              </Badge>
            </div>

            <span className="text-[11px] font-semibold text-slate-400">
              {txt.updated}: {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString() : 'Just now'}
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight">
              {getTranslatedTodayRec(recommendation?.todayRecommendation)}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl">
              <span className="font-bold text-sky-400">{txt.engineRule}:</span> {getTranslatedReason(recommendation?.reason)}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <Droplets className="h-4 w-4 text-sky-400" />
              <span>{txt.targetWater}: <strong className="text-white">{recommendation?.estimatedWaterQuantity.toLocaleString()} L</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-amber-400" />
              <span>{txt.duration}: <strong className="text-white">{recommendation?.estimatedDuration}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sprout className="h-4 w-4 text-emerald-400" />
              <span>{txt.nextCycle}: <strong className="text-white">{recommendation?.nextIrrigationDate}</strong></span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* SECTION 2: 5 KEY METRIC CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Card 1: Water Requirement */}
        <Card hover tilt className="border-sky-500/20 bg-slate-900/50">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{txt.waterDemand}</span>
              <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
                <Droplets className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="font-display text-2xl font-black text-white">
                {recommendation?.estimatedWaterQuantity.toLocaleString()}
                <span className="text-xs font-normal text-slate-400 ml-1">{txt.liters}</span>
              </p>
              <p className="text-[11px] text-sky-400 font-semibold mt-0.5">
                {txt.dripRun}: {recommendation?.estimatedDuration}
              </p>
            </div>
          </div>
        </Card>

        {/* Card 2: Rain Prediction */}
        <Card hover tilt className="border-sky-500/20 bg-slate-900/50">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{txt.rainForecast}</span>
              <div className="p-2 rounded-xl bg-sky-400/15 text-sky-400">
                <CloudRain className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="font-display text-2xl font-black text-white">
                {recommendation?.rainImpact.probability}%
                <span className="text-xs font-normal text-slate-400 ml-1">({recommendation?.rainImpact.expectedMm}mm)</span>
              </p>
              <p className="text-[11px] text-amber-400 font-semibold mt-0.5">
                {recommendation?.rainImpact.action}
              </p>
            </div>
          </div>
        </Card>

        {/* Card 3: Soil Retention */}
        <Card hover tilt className="border-sky-500/20 bg-slate-900/50">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{txt.soilMoisture}</span>
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="font-display text-2xl font-black text-white">
                {Math.round((recommendation?.soilImpact.retentionFactor || 0.8) * 100)}%
                <span className="text-xs font-normal text-slate-400 ml-1">{txt.retention}</span>
              </p>
              <p className="text-[11px] text-emerald-400 font-semibold mt-0.5 truncate">
                {recommendation?.soilImpact.soilType}
              </p>
            </div>
          </div>
        </Card>

        {/* Card 4: Heat & Evaporation */}
        <Card hover tilt className="border-sky-500/20 bg-slate-900/50">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{txt.heatStress}</span>
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                <Thermometer className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="font-display text-2xl font-black text-white">
                {recommendation?.heatImpact.temperature}°C
                <span className="text-xs font-normal text-slate-400 ml-1">({recommendation?.heatImpact.humidity}%)</span>
              </p>
              <p className="text-[11px] text-amber-400 font-semibold mt-0.5">
                {txt.evap}: {recommendation?.heatImpact.evaporationLevel} ({recommendation?.heatImpact.evaporationScore}/100)
              </p>
            </div>
          </div>
        </Card>

        {/* Card 5: Crop Stage */}
        <Card hover tilt className="border-sky-500/20 bg-slate-900/50">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{txt.cropStage}</span>
              <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
                <Sprout className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="font-display text-2xl font-black text-white truncate">
                {recommendation?.growthStageImpact.stage}
              </p>
              <p className="text-[11px] text-purple-400 font-semibold mt-0.5">
                {txt.day} {recommendation?.growthStageImpact.daysSinceSowing} ({recommendation?.growthStageImpact.crop})
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* SECTION 3: BEST IRRIGATION WINDOW TIMELINE */}
      <Card hover tilt className="border-sky-500/30">
        <SectionHeader
          title={txt.bestWindowsTitle}
          subtitle={txt.bestWindowsSubtitle}
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {recommendation?.bestWindow.map((slot, index) => {
            const isRecommended = slot.status === 'RECOMMENDED';
            const isAvoid = slot.status === 'AVOID';
            const slotTitle = getSlotTitle(slot.slotKey || slot.slot);
            const slotRec = getSlotRecLabel(slot.recommendation);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-2xl p-4 border transition-all ${
                  isRecommended
                    ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-950/40 to-slate-900 shadow-lg shadow-emerald-900/20'
                    : isAvoid
                    ? 'border-rose-500/30 bg-slate-950/60 opacity-75'
                    : 'border-white/10 bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                    {slotTitle}
                  </span>
                  <Badge
                    variant={isRecommended ? 'success' : isAvoid ? 'danger' : 'info'}
                    pulse={isRecommended}
                  >
                    {slotRec} ({slot.score}%)
                  </Badge>
                </div>

                <p className="font-display text-lg font-black text-white mb-1 flex items-center gap-1.5">
                  {slot.slotKey === 'Morning' || slot.slotKey === 'Afternoon' ? (
                    <Sun className="h-4 w-4 text-amber-400" />
                  ) : (
                    <Moon className="h-4 w-4 text-sky-400" />
                  )}
                  {slot.time}
                </p>

                <p className="text-xs text-slate-300 leading-relaxed mt-2">
                  {slot.reason}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* SECTION 4: WATER SAVING ANALYTICS */}
      <Card hover tilt className="border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40">
        <SectionHeader
          title={txt.analyticsTitle}
          subtitle={txt.analyticsSubtitle}
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="p-4 rounded-2xl glass border border-emerald-500/30 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
              <Save className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">{txt.waterSaved}</span>
              <p className="font-display text-2xl font-black text-emerald-400">
                {recommendation?.analytics.estimatedWaterSaved.toLocaleString()} <span className="text-sm font-semibold">{txt.liters}</span>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass border border-emerald-500/30 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">{txt.costSaved}</span>
              <p className="font-display text-2xl font-black text-white">
                ₹{recommendation?.analytics.estimatedCostSaved.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass border border-emerald-500/30 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase">{txt.efficiencyScore}</span>
              <p className="font-display text-2xl font-black text-sky-400">
                {recommendation?.analytics.efficiencyScore}%
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* SECTION 5: SMART AGRONOMIC GUIDANCE */}
      <Card hover tilt className="border-sky-500/30 bg-slate-900/60">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                {txt.guidanceTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {txt.tailoredFor} {recommendation?.growthStageImpact.crop} ({recommendation?.growthStageImpact.stage} {txt.stage})
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Main Advisory */}
          <div className="p-4 rounded-2xl glass border border-sky-500/30 bg-sky-950/20 text-slate-200 text-sm leading-relaxed">
            <p className="font-bold text-sky-400 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              {txt.farmerAdvisory}:
            </p>
            <p>{groq?.farmerExplanation}</p>
          </div>

          {/* Precautions & Water Saving Tips */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-2xl glass border border-white/10 space-y-2">
              <p className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4" /> {txt.fieldPrecautions}
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {groq?.precautions?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl glass border border-white/10 space-y-2">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Droplets className="h-4 w-4" /> {txt.waterSavingTips}
              </p>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {groq?.waterSavingTips?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Fertigation & Warning */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-2xl glass border border-purple-500/30 bg-purple-950/20 text-xs space-y-1">
              <p className="font-bold text-purple-400 flex items-center gap-1.5">
                <Sprout className="h-4 w-4" /> {txt.fertigation}:
              </p>
              <p className="text-slate-300">{groq?.fertilizerSuggestion}</p>
            </div>

            <div className="p-4 rounded-2xl glass border border-rose-500/30 bg-rose-950/20 text-xs space-y-1">
              <p className="font-bold text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" /> {txt.weatherWarning}:
              </p>
              <p className="text-slate-300">{groq?.warning}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
