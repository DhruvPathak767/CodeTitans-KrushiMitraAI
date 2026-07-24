import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Sparkles, CheckCircle2, Circle, Cloud, Cpu } from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { Card, Badge, SectionHeader, cn } from '@/components/ui';
import { weeklyPlanner } from '@/data/mock';

export function Planner() {
  const { t, lang } = useApp();
  const [plan, setPlan] = useState(weeklyPlanner.map((d) => ({ ...d, done: d.tasks.map(() => false) })));
  const [generating, setGenerating] = useState(false);

  function toggle(dayIdx: number, taskIdx: number) {
    setPlan((p) => p.map((d, i) => {
      if (i !== dayIdx) return d;
      return { ...d, done: d.done.map((v, j) => (j === taskIdx ? !v : v)) };
    }));
  }

  function generate() {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 1800);
  }

  const dayKeys: Record<string, string> = {
    mon: 'planner.mon', tue: 'planner.tue', wed: 'planner.wed',
    thu: 'planner.thu', fri: 'planner.fri', sat: 'planner.sat', sun: 'planner.sun',
  };

  const todayIdx = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-bold text-brand-600 dark:text-brand-400 mb-1 border border-brand-500/20">
            <Cpu className="h-3.5 w-3.5 text-brand-500 animate-pulse" />
            <span>Seasonal Agricultural Schedule Generator</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text">{t('planner.title')}</h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{t('planner.subtitle')}</p>
        </div>
        <button onClick={generate} className="btn-primary text-xs shadow-glow">
          <Sparkles className="h-4 w-4" /> {t('planner.generate')}
        </button>
      </div>

      {/* AI Smart Farm Planner Permanent Animated Photo Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-brand-500/30 shadow-card group h-52 sm:h-64"
      >
        <img
          src="/images/smart_farm_planner.png"
          alt="AI Smart Agriculture Farm Planner"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Animated laser scanner line overlay */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-400 to-transparent opacity-70 animate-laserScan pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-transparent p-6 sm:p-8 flex flex-col justify-between text-left">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-bold text-brand-400 border border-brand-500/30 w-fit backdrop-blur-md animate-float">
            <Sparkles className="h-3.5 w-3.5 text-brand-400 animate-spin-slow" />
            <span>{t('planner.aiScheduleLabel')}</span>
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-white">{t('planner.bannerTitle')}</h2>
            <p className="text-xs text-slate-200 mt-1 max-w-lg leading-relaxed">{t('planner.bannerSubtitle')}</p>
          </div>
        </div>
      </motion.div>

      {generating && (
        <Card hover tilt className="p-10 text-center glass-strong border border-brand-500/40">
          <Sparkles className="mx-auto h-8 w-8 animate-spin-slow text-brand-500 mb-3" />
          <p className="font-display text-lg font-bold gradient-text">{t('chat.thinking')}...</p>
          <p className="text-xs text-slate-400 mt-1">Cross-referencing satellite precipitation models</p>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plan.map((d, i) => (
          <motion.div
            key={d.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card hover tilt className={cn('h-full', i === todayIdx && 'border-brand-500/50 ring-2 ring-brand-500/30 bg-brand-500/5')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={cn('p-2 rounded-xl glass', i === todayIdx ? 'text-brand-500 shadow-glow' : 'text-slate-400')}>
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <h3 className="font-display text-sm font-bold">{t(dayKeys[d.day])}</h3>
                </div>
                {i === todayIdx && <Badge variant="success" pulse>{t('common.today')}</Badge>}
                {d.tasks.some((tk, j) => tk.toLowerCase().includes('rain')) && (
                  <Cloud className="h-4 w-4 text-sky-400 animate-bounce" />
                )}
              </div>

              <div className="mt-4 space-y-2">
                {d.tasks.map((task, j) => (
                  <button
                    key={j}
                    onClick={() => toggle(i, j)}
                    className="flex w-full items-start gap-3 rounded-2xl glass p-2.5 text-left transition-all hover:border-brand-500/40"
                  >
                    {d.done[j] ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    ) : (
                      <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />
                    )}
                    <span className={cn('text-xs font-semibold', d.done[j] && 'line-through opacity-50')}>{task}</span>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Weather-Aware Planner Note */}
      <Card hover tilt className="border-sky-500/30 bg-gradient-to-br from-sky-500/10 via-slate-900/5 to-brand-500/10">
        <div className="flex items-center gap-3 mb-2">
          <span className="grid place-items-center rounded-2xl bg-sky-500/20 p-2 text-sky-500 shadow-glow-sky">
            <Sparkles className="h-4 w-4" />
          </span>
          <h3 className="font-display text-base font-bold">
            {t('planner.weatherAware')}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('planner.weatherAwareHint')}
        </p>
      </Card>
    </div>
  );
}
