import { motion } from 'framer-motion';
import {
  RotateCw, ShieldAlert, Droplets, Thermometer,
  CloudRain, AlertTriangle, Sprout,
  Sun, Cpu, Layers, Info,
} from 'lucide-react';
import { useFarm } from '@/context/FarmContext';
import { useWeather } from '@/context/WeatherContext';
import { useAdvisory } from '@/context/AdvisoryContext';
import { useApp } from '@/i18n/AppContext';
import { Card, Badge, SectionHeader } from '@/components/ui';

export function Advisory() {
  const { t } = useApp();
  const { activeFarm } = useFarm();
  const { weatherData } = useWeather();
  const { advisoryData, loading, refreshing, refreshAdvisory } = useAdvisory();

  const advisory = advisoryData?.advisory;
  const growthStage = advisoryData?.growthStage || 'Vegetative';
  const currentWeather = weatherData?.current;
  const location = weatherData?.location;

  const score = advisory?.cropHealthScore || 90;

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER BAR & REFRESH ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-bold text-brand-400 mb-1 border border-brand-500/30">
            <Cpu className="h-3.5 w-3.5 text-brand-400 animate-pulse" />
            <span>Groq AI Llama-3.3 Agronomist</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight">
            {t('advisory.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            {t('advisory.subtitle')} — <strong className="text-emerald-400">{activeFarm?.farmName || 'Active Farm'}</strong> ({location?.weatherLocationName || 'Location'})
          </p>
        </div>

        <button
          onClick={refreshAdvisory}
          disabled={refreshing || loading}
          className="btn-primary py-2.5 px-5 flex items-center gap-2 shadow-glow hover:scale-105 active:scale-95 transition-all text-xs font-bold self-start sm:self-auto"
        >
          <RotateCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? t('common.loading') : t('advisory.generate')}</span>
        </button>
      </div>

      {loading ? (
        <div className="rounded-3xl glass p-12 text-center space-y-3">
          <RotateCw className="h-10 w-10 animate-spin text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold">{t('common.loading')}</h3>
          <p className="text-xs text-slate-400">{t('advisory.synthesizing')}</p>
        </div>
      ) : advisory ? (
        <>
          {/* TOP SECTION: LARGE AI CROP HEALTH CARD */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-6 sm:p-8 glass-strong border border-emerald-500/30 shadow-card relative overflow-hidden space-y-6"
          >
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-6">
                {/* Circular Score Gauge */}
                <div className="relative grid place-items-center w-28 h-28 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-400"
                      strokeDasharray={`${score}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-extrabold font-display">{score}</span>
                    <span className="text-[9px] font-bold uppercase text-slate-400">Score</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={advisory.priority === 'High' ? 'error' : 'success'} pulse>
                      {t('common.priority')}: {advisory.priority || 'Medium'}
                    </Badge>
                    <span className="text-xs text-slate-400">{t('advisory.growth')}: <strong className="text-emerald-400">{growthStage}</strong></span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold font-display">
                    {activeFarm?.cropName || 'Crop'}
                  </h2>
                  <p className="text-xs text-slate-300 max-w-xl line-clamp-2">
                    {advisory.nextAction}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl glass p-4 border border-white/10 text-right shrink-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('weather.current')}</span>
                <p className="text-2xl font-extrabold font-display text-emerald-400">{currentWeather?.temperature ?? 25}°C</p>
                <p className="text-xs font-medium text-slate-300">
                  {currentWeather?.humidity}% {t('land.weather.humidity')} · {currentWeather?.windSpeed} km/h {t('land.weather.wind')}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {advisoryData?.lastUpdated ? new Date(advisoryData.lastUpdated).toLocaleTimeString() : 'Just now'}
                </span>
              </div>
            </div>

            {/* Quick Banner Alert */}
            {advisory.warning && (
              <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3.5 flex items-center gap-3 text-xs text-amber-300 relative z-10">
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
                <span className="font-semibold">{advisory.warning}</span>
              </div>
            )}
          </motion.div>

          {/* SECOND SECTION: RESPONSIVE GRID (6 CARDS) */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-400" />
              <span>Agronomic Subsystem Status</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: Irrigation */}
              <motion.div whileHover={{ y: -4 }} className="rounded-2xl glass p-4 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                    <Droplets className="h-4 w-4" />
                    <span>💧 {t('nav.irrigation')}</span>
                  </div>
                  <Badge variant="info">{advisory.irrigation?.status}</Badge>
                </div>
                <p className="text-xs text-slate-300">{advisory.irrigation?.reason}</p>
              </motion.div>

              {/* Card 2: Fertilizer */}
              <motion.div whileHover={{ y: -4 }} className="rounded-2xl glass p-4 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Sprout className="h-4 w-4" />
                    <span>🌾 {t('advisory.fertilizer')}</span>
                  </div>
                  <Badge variant="success">{advisory.fertilizer?.status}</Badge>
                </div>
                <p className="text-xs text-slate-300">{advisory.fertilizer?.reason || 'Optimal soil nutrition'}</p>
              </motion.div>

              {/* Card 3: Pest Risk */}
              <motion.div whileHover={{ y: -4 }} className="rounded-2xl glass p-4 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <ShieldAlert className="h-4 w-4" />
                    <span>🐛 Pest Risk</span>
                  </div>
                  <Badge variant={advisory.pestRisk?.level === 'High' ? 'error' : 'success'}>
                    {advisory.pestRisk?.level} Risk
                  </Badge>
                </div>
                <p className="text-xs text-slate-300">{advisory.pestRisk?.reason}</p>
              </motion.div>

              {/* Card 4: Disease Risk */}
              <motion.div whileHover={{ y: -4 }} className="rounded-2xl glass p-4 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>🦠 {t('disease.severity')}</span>
                  </div>
                  <Badge variant={advisory.diseaseRisk?.level === 'High' ? 'error' : 'warning'}>
                    {advisory.diseaseRisk?.level} Risk
                  </Badge>
                </div>
                <p className="text-xs text-slate-300">{advisory.diseaseRisk?.reason}</p>
              </motion.div>

              {/* Card 5: Heat Stress */}
              <motion.div whileHover={{ y: -4 }} className="rounded-2xl glass p-4 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Thermometer className="h-4 w-4" />
                    <span>🔥 Heat Stress</span>
                  </div>
                  <Badge variant="warning">{advisory.heatStress?.level} Stress</Badge>
                </div>
                <p className="text-xs text-slate-300">{advisory.heatStress?.reason}</p>
              </motion.div>

              {/* Card 6: Water Stress */}
              <motion.div whileHover={{ y: -4 }} className="rounded-2xl glass p-4 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                    <CloudRain className="h-4 w-4" />
                    <span>💦 Water Stress</span>
                  </div>
                  <Badge variant="info">{advisory.waterStress?.level} Stress</Badge>
                </div>
                <p className="text-xs text-slate-300">{advisory.waterStress?.reason}</p>
              </motion.div>
            </div>
          </div>

          {/* THIRD SECTION: SPRAY RECOMMENDATION */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 font-bold text-base">
                <Sun className="h-5 w-5 text-amber-400" />
                <span>Chemical & Pesticide Spray Window</span>
              </div>
              <Badge variant={advisory.sprayWindow?.suitable !== false ? 'success' : 'error'}>
                {advisory.sprayWindow?.suitable !== false ? 'Favorable Window' : 'Unsuitable Window'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="rounded-xl bg-slate-500/5 p-3 border border-white/5 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">Optimal Time</span>
                <span className="text-sm font-bold text-emerald-400">{advisory.sprayWindow?.bestTime}</span>
              </div>
              <div className="rounded-xl bg-slate-500/5 p-3 border border-white/5 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">{t('land.weather.wind')}</span>
                <span className="text-sm font-bold text-slate-200">{currentWeather?.windSpeed} km/h</span>
              </div>
              <div className="rounded-xl bg-slate-500/5 p-3 border border-white/5 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">{t('land.weather.humidity')}</span>
                <span className="text-sm font-bold text-slate-200">{currentWeather?.humidity}%</span>
              </div>
              <div className="rounded-xl bg-slate-500/5 p-3 border border-white/5 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">{t('weather.rain.prob')}</span>
                <span className="text-sm font-bold text-slate-200">{currentWeather?.rainProbability}%</span>
              </div>
            </div>
          </Card>

          {/* FOURTH SECTION: FIELD WORK TIMELINE */}
          <Card className="space-y-4">
            <SectionHeader
              title="Daily Field Work Operational Schedule"
              subtitle={`Status: ${advisory.fieldWork?.status || 'Favorable'}`}
            />
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-2xl glass p-3.5 border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-amber-400 block uppercase">🌅 Morning</span>
                <p className="font-semibold text-slate-200">{advisory.fieldWork?.morning || 'Field Inspection'}</p>
              </div>
              <div className="rounded-2xl glass p-3.5 border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-amber-500 block uppercase">☀️ Afternoon</span>
                <p className="font-semibold text-slate-200">{advisory.fieldWork?.afternoon || 'Canopy Check'}</p>
              </div>
              <div className="rounded-2xl glass p-3.5 border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-indigo-400 block uppercase">🌆 Evening</span>
                <p className="font-semibold text-slate-200">{advisory.fieldWork?.evening || 'Equipment Check'}</p>
              </div>
              <div className="rounded-2xl glass p-3.5 border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-purple-400 block uppercase">🌙 Night</span>
                <p className="font-semibold text-slate-200">{advisory.fieldWork?.night || 'Rest'}</p>
              </div>
            </div>
          </Card>

          {/* FIFTH SECTION: AI ACTION PLAN TIMELINE */}
          <Card className="space-y-4">
            <SectionHeader title="3-Step AI Operational Action Plan" subtitle="Sequential recommendations for maximum crop yield" />
            <div className="space-y-3">
              <div className="flex items-start gap-4 rounded-2xl glass p-4 border border-emerald-500/20">
                <div className="grid place-items-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold shrink-0">1</div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-emerald-400 uppercase">{t('common.today')}</span>
                  <p className="text-sm text-slate-200 font-medium">{advisory.timeline?.step1Today || advisory.nextAction}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl glass p-4 border border-white/10">
                <div className="grid place-items-center w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 font-bold shrink-0">2</div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-sky-400 uppercase">{t('common.tomorrow')}</span>
                  <p className="text-sm text-slate-200 font-medium">{advisory.timeline?.step2Tomorrow || 'Follow up on crop health.'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl glass p-4 border border-white/10">
                <div className="grid place-items-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold shrink-0">3</div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-indigo-400 uppercase">Next 3 Days</span>
                  <p className="text-sm text-slate-200 font-medium">{advisory.timeline?.step3Next3Days || 'Monitor soil moisture balance.'}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* SIXTH SECTION: ESTIMATED IMPACT ANALYTICS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="text-center space-y-1 bg-emerald-500/10 border-emerald-500/30">
              <span className="text-xs text-slate-400 font-semibold block uppercase">Yield Gain Projection</span>
              <p className="text-2xl font-extrabold text-emerald-400">{advisory.estimatedYieldImpact}</p>
            </Card>
            <Card className="text-center space-y-1 bg-sky-500/10 border-sky-500/30">
              <span className="text-xs text-slate-400 font-semibold block uppercase">{t('irrigation.saving')}</span>
              <p className="text-2xl font-extrabold text-sky-400">{advisory.estimatedWaterSaving}</p>
            </Card>
            <Card className="text-center space-y-1 bg-amber-500/10 border-amber-500/30">
              <span className="text-xs text-slate-400 font-semibold block uppercase">Cost Saving</span>
              <p className="text-2xl font-extrabold text-amber-400">{advisory.estimatedCostSaving}</p>
            </Card>
          </div>

          {/* BOTTOM SECTION: AI EXPLANATION */}
          <Card className="space-y-3 bg-slate-900/60 border-slate-800">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
              <Info className="h-4 w-4" />
              <span>{t('advisory.explainable')}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {advisory.reason || 'Advisory generated by synthesizing live WeatherAPI telemetry, farm coordinates, crop growth stage, and agricultural threshold rules via Groq Llama-3.3 AI.'}
            </p>
          </Card>
        </>
      ) : (
        <Card className="p-8 text-center text-slate-400 text-xs">No AI advisory available.</Card>
      )}
    </div>
  );
}
