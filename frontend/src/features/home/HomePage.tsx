import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ScanLine, Sprout, CloudRain, Droplets, CheckCircle2,
  AlertTriangle, Shield, TrendingUp, Sparkles, ChevronRight,
  CloudSun, MapPin, ArrowRight, Camera, Circle, MessageSquare,
  Landmark, Info, Check, Filter
} from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { useFarm } from '@/context/FarmContext';
import { useWeather } from '@/context/WeatherContext';
import { useGreeting } from '@/hooks/useGreeting';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/cn';

export function HomePage() {
  const { t, user } = useApp();
  const { activeFarm } = useFarm();
  const { weatherData } = useWeather();
  const greeting = useGreeting();
  const navigate = useNavigate();

  const firstName = user?.name?.split(' ')[0] ?? t('common.farmer');
  const farmName = activeFarm?.farmName || 'Green Farm';
  const cropName = activeFarm?.cropName || t('crop.wheat');

  const currentWeather = weatherData?.current;
  const temp = currentWeather ? `${currentWeather.temperature}°C` : '30.3°C';
  const condition = currentWeather?.weatherCondition || 'Patchy rain nearby';
  const rainProb = currentWeather?.rainProbability ?? 75;

  // Krishi Guide Steps State
  const [activeStep, setActiveStep] = useState(0);

  const guideSteps = [
    {
      id: 1,
      shortIcon: Camera,
      titleKey: 'guide.step1.title',
      subKey: 'guide.step1.sub',
      actionKey: 'guide.step1.action',
      ctaKey: 'guide.step1.cta',
      route: '/app/disease',
    },
    {
      id: 2,
      shortIcon: AlertTriangle,
      titleKey: 'guide.step2.title',
      subKey: 'guide.step2.sub',
      actionKey: 'guide.step2.action',
      ctaKey: 'guide.step2.cta',
      route: '/app/disease',
    },
    {
      id: 3,
      shortIcon: Shield,
      titleKey: 'guide.step3.title',
      subKey: 'guide.step3.sub',
      actionKey: 'guide.step3.action',
      ctaKey: 'guide.step3.cta',
      route: '/app/advisory',
    },
    {
      id: 4,
      shortIcon: Droplets,
      titleKey: 'guide.step4.title',
      subKey: 'guide.step4.sub',
      actionKey: 'guide.step4.action',
      ctaKey: 'guide.step4.cta',
      route: '/app/irrigation',
    },
    {
      id: 5,
      shortIcon: TrendingUp,
      titleKey: 'guide.step5.title',
      subKey: 'guide.step5.sub',
      actionKey: 'guide.step5.action',
      ctaKey: 'guide.step5.cta',
      route: '/app/market',
    },
  ];

  // Today's Tasks State
  const [tasks, setTasks] = useState([
    { id: 1, textKey: 'tasks.sprayPesticide', priorityKey: 'tasks.highPriority', priorityColor: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300', done: true },
    { id: 2, textKey: 'tasks.applyFertilizer', priorityKey: 'tasks.mediumPriority', priorityColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300', done: false },
    { id: 3, textKey: 'tasks.prepareIrrigation', priorityKey: 'tasks.lowPriority', priorityColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300', done: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const completedCount = tasks.filter(t => t.done).length;
  const completedPct = Math.round((completedCount / tasks.length) * 100);

  const currentStep = guideSteps[activeStep];
  const StepIcon = currentStep.shortIcon;

  return (
    <div className="space-y-6 pb-12">
      {/* ═══════════════════════════════════════════════════════════
          SECTION 1: HERO COMMAND BANNER
         ═══════════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 p-6 sm:p-8 text-white shadow-xl border border-emerald-900/30"
      >
        <div className="absolute inset-0 bg-noise opacity-20" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30 backdrop-blur-md mb-2">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                <span>{t('home.hero.tag')}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                {greeting}, {firstName} 👋
              </h1>
              <p className="text-sm font-medium text-emerald-300/90 mt-1 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                <span>{farmName} • {cropName}</span>
              </p>
            </div>

            {/* Top-Right Weather Card inside Hero */}
            <div
              onClick={() => navigate('/app/weather')}
              className="flex items-center gap-3.5 rounded-2xl bg-white/10 dark:bg-slate-900/60 p-4 border border-white/15 backdrop-blur-md cursor-pointer hover:border-emerald-400 transition-all shrink-0"
            >
              <div className="grid place-items-center rounded-xl bg-amber-500/20 p-2.5 text-amber-400">
                <CloudRain className="h-7 w-7 animate-bounce" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white leading-none">{temp}</p>
                <p className="text-xs font-semibold text-emerald-300 mt-1">
                  {condition} • {rainProb}% {t('alerts.rainProbability')}
                </p>
              </div>
            </div>
          </div>

          {/* TODAY'S FARM STATUS — 5 Dynamic Pills */}
          <div className="pt-2">
            <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-3">
              {t('home.farmStatusTitle')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 rounded-2xl bg-slate-800/80 p-3.5 border border-slate-700/60">
                <span className="text-xl">🌧️</span>
                <span className="text-xs font-bold text-slate-200">{t('status.rainExpected')}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-amber-950/60 p-3.5 border border-amber-800/50">
                <span className="text-xl">💧</span>
                <span className="text-xs font-bold text-amber-200">{t('status.noIrrigation')}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-emerald-950/60 p-3.5 border border-emerald-800/50">
                <span className="text-xl">🌱</span>
                <span className="text-xs font-bold text-emerald-200">{cropName} {t('status.fertilizerTomorrow')}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-rose-950/60 p-3.5 border border-rose-800/50">
                <span className="text-xl">⚠️</span>
                <span className="text-xs font-bold text-rose-200">{t('status.diseaseDetected')}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-teal-950/60 p-3.5 border border-teal-800/50 sm:col-span-2 lg:col-span-1">
                <span className="text-xl">📈</span>
                <span className="text-xs font-bold text-teal-200">{t('status.marketPriceUp')}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2: PRIMARY FARMING ACTIONS
         ═══════════════════════════════════════════════════════════ */}
      <section aria-label={t('home.primaryActions')}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {t('home.primaryActions')}
          </h2>
          <span className="text-xs font-semibold text-slate-400">{t('home.singleTap')}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Disease Detection */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950/90 via-slate-900 to-slate-950 p-6 text-white shadow-lg border border-rose-900/40 flex flex-col justify-between min-h-[220px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="grid place-items-center rounded-2xl bg-rose-500/20 p-3.5 text-rose-400 border border-rose-500/30">
                  <ScanLine className="h-8 w-8" />
                </div>
                <span className="inline-flex items-center rounded-full bg-rose-500/20 px-3 py-1 text-[11px] font-extrabold text-rose-300 border border-rose-500/30">
                  {t('home.badge.cameraScanner')}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{t('home.diseaseScan.title')}</h3>
              <p className="text-sm text-slate-300">{t('home.diseaseScan.desc')}</p>
            </div>
            <button
              onClick={() => navigate('/app/disease')}
              className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-lg py-3.5 w-full shadow-lg transition-all"
            >
              <span>{t('home.scanCrop')}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>

          {/* Card 2: Crop Advisory */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-950 p-6 text-white shadow-lg border border-emerald-900/40 flex flex-col justify-between min-h-[220px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="grid place-items-center rounded-2xl bg-emerald-500/20 p-3.5 text-emerald-400 border border-emerald-500/30">
                  <Sprout className="h-8 w-8" />
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-extrabold text-emerald-300 border border-emerald-500/30">
                  {t('home.badge.actionPlan')}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{t('home.advisory.title')}</h3>
              <p className="text-sm text-slate-300">{t('home.advisory.desc')}</p>
            </div>
            <button
              onClick={() => navigate('/app/advisory')}
              className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-lg py-3.5 w-full shadow-lg transition-all"
            >
              <span>{t('home.viewAdvisory')}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>

          {/* Card 3: Weather Forecast */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950/90 via-slate-900 to-slate-950 p-6 text-white shadow-lg border border-blue-900/40 flex flex-col justify-between min-h-[220px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="grid place-items-center rounded-2xl bg-blue-500/20 p-3.5 text-blue-400 border border-blue-500/30">
                  <CloudRain className="h-8 w-8" />
                </div>
                <span className="inline-flex items-center rounded-full bg-blue-500/20 px-3 py-1 text-[11px] font-extrabold text-blue-300 border border-blue-500/30">
                  {t('home.badge.satelliteWeather')}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{t('home.weather.title')}</h3>
              <p className="text-sm text-slate-300">{t('home.weather.desc')}</p>
            </div>
            <button
              onClick={() => navigate('/app/weather')}
              className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-lg py-3.5 w-full shadow-lg transition-all"
            >
              <span>{t('home.viewWeather')}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>

          {/* Card 4: Irrigation Need */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-950/90 via-slate-900 to-slate-950 p-6 text-white shadow-lg border border-teal-900/40 flex flex-col justify-between min-h-[220px]"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="grid place-items-center rounded-2xl bg-teal-500/20 p-3.5 text-teal-400 border border-teal-500/30">
                  <Droplets className="h-8 w-8" />
                </div>
                <span className="inline-flex items-center rounded-full bg-teal-500/20 px-3 py-1 text-[11px] font-extrabold text-teal-300 border border-teal-500/30">
                  {t('home.badge.smartWater')}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{t('home.irrigation.title')}</h3>
              <p className="text-sm text-slate-300">{t('home.irrigation.desc')}</p>
            </div>
            <button
              onClick={() => navigate('/app/irrigation')}
              className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-lg py-3.5 w-full shadow-lg transition-all"
            >
              <span>{t('home.checkWater')}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3: KRISHI GUIDE WORKFLOW
         ═══════════════════════════════════════════════════════════ */}
      <Card className="p-6 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white border border-emerald-900/40 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 mb-1 border border-emerald-500/30">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>{t('guide.workflow')}</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">{t('guide.title')}</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              {t('guide.step')} {activeStep + 1} / {guideSteps.length}
            </span>
            <button
              onClick={() => setActiveStep(prev => (prev + 1) % guideSteps.length)}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
            >
              {t('guide.nextStep')}
            </button>
          </div>
        </div>

        {/* 5 Step Indicator Tabs */}
        <div className="grid grid-cols-5 gap-2">
          {guideSteps.map((step, idx) => {
            const IconComp = step.shortIcon;
            const isActive = idx === activeStep;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={cn(
                  'flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-xs font-bold min-h-[56px]',
                  isActive
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white',
                )}
              >
                <IconComp className="h-5 w-5 mb-1" />
                <span>S{step.id}</span>
              </button>
            );
          })}
        </div>

        {/* Active Step Content Container */}
        <div className="rounded-2xl bg-amber-950/30 border border-amber-800/40 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-amber-500/20 px-2.5 py-1 text-[11px] font-extrabold text-amber-400 uppercase tracking-wider">
              {t('guide.actionToday')}
            </span>
            <span className="text-xs text-slate-300">{t(currentStep.actionKey)}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="grid place-items-center rounded-2xl bg-amber-500/20 p-3.5 text-amber-400 border border-amber-500/30 shrink-0">
                <StepIcon className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{t(currentStep.titleKey)}</h3>
                <p className="text-sm text-slate-300 mt-0.5">{t(currentStep.subKey)}</p>
              </div>
            </div>

            <button
              onClick={() => navigate(currentStep.route)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base px-6 py-3.5 shadow-md transition-all shrink-0"
            >
              <span>{t(currentStep.ctaKey)}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Card>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4: TODAY'S TASKS
         ═══════════════════════════════════════════════════════════ */}
      <Card className="p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
              {t('tasks.plannerTag')}
            </span>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {t('tasks.today')}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {completedCount} / {tasks.length} {t('tasks.progress')} ({completedPct}%)
            </span>
            <div className="h-2 w-28 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${completedPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {tasks.map(task => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={cn(
                'flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer min-h-[56px]',
                task.done
                  ? 'bg-emerald-50/70 border-emerald-200/80 dark:bg-emerald-950/30 dark:border-emerald-900/40'
                  : 'bg-white border-slate-200/80 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800',
              )}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={cn(
                    'grid h-6 w-6 place-items-center rounded-full border transition-colors',
                    task.done
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800',
                  )}
                >
                  {task.done && <Check className="h-4 w-4 stroke-[3]" />}
                </div>
                <span
                  className={cn(
                    'text-base font-bold transition-all',
                    task.done
                      ? 'line-through text-slate-400 dark:text-slate-500'
                      : 'text-slate-800 dark:text-slate-100',
                  )}
                >
                  {t(task.textKey)}
                </span>
              </div>
              <span className={cn('text-xs font-bold px-3 py-1 rounded-full', task.priorityColor)}>
                {t(task.priorityKey)}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5: MARKET & SCHEMES GRID
         ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Crop Prices */}
        <Card className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> {t('market.trendsTag')}
              </span>
              <span className="font-bold text-slate-500 dark:text-slate-400">{t('market.bestMandi')}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              {t('market.todayPrices')}
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-base font-bold text-slate-800 dark:text-slate-100">
                  🌱 {t('crop.wheat')}
                </span>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  ₹2,450 / qtl ↑ +₹120
                </span>
              </div>
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-base font-bold text-slate-800 dark:text-slate-100">
                  🌱 {t('crop.cotton')}
                </span>
                <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  ₹7,100 / qtl ↑ +₹80
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/app/market')}
            className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base py-3.5 w-full shadow-md transition-all mt-4"
          >
            <span>{t('market.viewFull')}</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </Card>

        {/* Government Schemes For You */}
        <Card className="p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="text-xs mb-1 font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Landmark className="h-3.5 w-3.5" /> {t('schemes.verifiedTag')}
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              {t('schemes.homeTitle')}
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40">
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  {t('schemes.pmKisan.name')}
                </h4>
                <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                  {t('schemes.pmKisan.desc')}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/40">
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                  {t('schemes.bima.name')}
                </h4>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
                  {t('schemes.bima.desc')}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/app/schemes')}
            className="flex items-center justify-center gap-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base py-3.5 w-full shadow-md transition-all mt-4"
          >
            <span>{t('schemes.exploreAll')}</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </Card>
      </div>

      {/* FLOATING AI ASSISTANT BUTTON */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/app/chatbot')}
        className="fixed bottom-20 lg:bottom-8 right-6 z-50 flex items-center justify-center rounded-full bg-emerald-600 text-white p-4 shadow-2xl hover:bg-emerald-700 border-2 border-white dark:border-slate-800 transition-all"
        aria-label={t('nav.chatbot')}
      >
        <Sparkles className="h-7 w-7 animate-pulse" />
        <span className="absolute -top-2 -right-1 rounded-full bg-amber-400 text-[10px] font-extrabold text-slate-900 px-1.5 py-0.5 border border-white">
          AI
        </span>
      </motion.button>
    </div>
  );
}
