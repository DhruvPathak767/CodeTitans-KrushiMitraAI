import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Droplets, FlaskConical, CalendarClock, Sparkles, Lightbulb, Activity, Volume2 } from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { Card, Badge, SectionHeader, ConfidenceMeter, AIResponsePanel } from '@/components/ui';
import { advisoryData } from '@/data/mock';

export function Advisory() {
  const { t, lang } = useApp();
  const langSuffix = lang === 'hi' ? '_hi' : lang === 'gu' ? '_gu' : '';
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(true);

  const growthKey = `growthStage${langSuffix}` as 'growthStage' | 'growthStage_hi' | 'growthStage_gu';
  const waterKey = `water${langSuffix}` as 'water' | 'water_hi' | 'water_gu';
  const fertilizerKey = `fertilizer${langSuffix}` as 'fertilizer' | 'fertilizer_hi' | 'fertilizer_gu';
  const harvestKey = `harvest${langSuffix}` as 'harvest' | 'harvest_hi' | 'harvest_gu';
  const reasonKey = `reason${langSuffix}` as 'reason' | 'reason_hi' | 'reason_gu';

  function speak(text: string) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === 'hi' ? 'hi-IN' : lang === 'gu' ? 'gu-IN' : 'en-US';
    window.speechSynthesis.speak(u);
  }

  function generate() {
    setLoading(true);
    setShow(false);
    setTimeout(() => {
      setLoading(false);
      setShow(true);
    }, 1800);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text">{t('advisory.title')}</h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{t('advisory.subtitle')}</p>
        </div>
        <button onClick={generate} className="btn-primary text-xs shadow-glow">
          <Sparkles className="h-4 w-4" /> {t('advisory.generate')}
        </button>
      </div>

      {/* AI Crop Advisory Permanent Photography Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-brand-500/30 shadow-card group h-48 sm:h-56"
      >
        <img
          src="/images/crop_advisory_field.png"
          alt="AI Crop Agronomy & Advisory"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-400 to-transparent opacity-60 animate-laserScan pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-transparent p-6 sm:p-8 flex flex-col justify-between text-left">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-bold text-brand-400 border border-brand-500/30 w-fit backdrop-blur-md animate-float">
            <Sprout className="h-3.5 w-3.5 text-brand-400" />
            <span>Agronomic Decision Intelligence</span>
          </div>
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-white">Stage-Aware Crop & Soil Nutrition</h2>
            <p className="text-xs text-slate-200 mt-1 max-w-lg leading-relaxed">
              Custom N-P-K fertilizer schedules, micro-nutrient dosing, and growth regulator insights tailored to local soil pH and temperature.
            </p>
          </div>
        </div>
      </motion.div>
      <Card hover tilt>
        <SectionHeader title={t('advisory.growth')} subtitle="Interactive Stage-by-Stage Field Recommendations" />
        <div className="mt-6 flex items-center justify-between px-2">
          {['Germination', 'Vegetative', 'Flowering', 'Grain Filling', 'Maturity'].map((stage, i) => {
            const isCurrent = stage === 'Flowering';
            const isPast = i < 2;
            return (
              <div key={stage} className="flex flex-1 flex-col items-center">
                <div className="relative flex w-full items-center">
                  {i > 0 && <div className={`h-1 flex-1 rounded ${isPast ? 'bg-gradient-to-r from-brand-600 to-brand-400' : 'bg-slate-200 dark:bg-white/10'}`} />}
                  <motion.div
                    className={`h-5 w-5 rounded-full ${isCurrent ? 'bg-brand-500 ring-4 ring-brand-500/30 shadow-glow' : isPast ? 'bg-brand-500' : 'bg-slate-300 dark:bg-white/10'}`}
                    animate={isCurrent ? { scale: [1, 1.25, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  {i < 4 && <div className={`h-1 flex-1 rounded ${isPast ? 'bg-gradient-to-r from-brand-600 to-brand-400' : 'bg-slate-200 dark:bg-white/10'}`} />}
                </div>
                <p className={`mt-3 text-[11px] font-bold text-center ${isCurrent ? 'text-brand-600 dark:text-brand-400 font-display' : 'text-slate-400'}`}>{stage}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-5 rounded-2xl glass p-4 text-center border border-brand-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs sm:text-sm font-semibold">
            <span className="font-bold text-brand-600 dark:text-brand-400">{t('advisory.growth')}: </span>
            {advisoryData[growthKey]}
          </p>
          <button
            onClick={() => speak(advisoryData[growthKey])}
            className="btn-glass text-xs px-3 py-1.5 border-brand-500/30 shrink-0"
          >
            <Volume2 className="h-3.5 w-3.5 text-brand-500" /> Listen Voice Note
          </button>
        </div>
      </Card>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card hover tilt className="p-12 text-center">
              <Sparkles className="mx-auto h-8 w-8 animate-spin-slow text-brand-500 mb-3" />
              <p className="font-display text-lg font-bold gradient-text">{t('chat.thinking')}...</p>
              <p className="text-xs text-slate-400 mt-1">Analyzing satellite imagery and soil nutrient data</p>
            </Card>
          </motion.div>
        ) : show ? (
          <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Advisory Recommendations Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              <RecCard icon={<Droplets className="h-5 w-5 text-sky-500" />} title={t('advisory.water')} bg="bg-sky-500/20 shadow-glow-sky">
                {advisoryData[waterKey]}
              </RecCard>
              <RecCard icon={<FlaskConical className="h-5 w-5 text-amber-500" />} title={t('advisory.fertilizer')} bg="bg-amber-500/20 shadow-glow-gold">
                {advisoryData[fertilizerKey]}
              </RecCard>
              <RecCard icon={<CalendarClock className="h-5 w-5 text-brand-500" />} title={t('advisory.harvest')} bg="bg-brand-500/20 shadow-glow">
                {advisoryData[harvestKey]}
              </RecCard>
              <RecCard icon={<Lightbulb className="h-5 w-5 text-soil-500" />} title={t('common.alternative')} bg="bg-soil-500/20">
                {advisoryData.alternatives.join(' • ')}
              </RecCard>
            </div>

            {/* Explainable AI Decision Panel */}
            <Card hover tilt>
              <SectionHeader title={t('advisory.explainable')} subtitle="Explainable Neural Reasoning" />
              <div className="mt-4">
                <ConfidenceMeter value={advisoryData.confidence} label={t('common.confidence')} />
              </div>
              <div className="mt-4">
                <AIResponsePanel
                  t={t}
                  confidence={advisoryData.confidence}
                  priority="high"
                  reason={advisoryData[reasonKey]}
                  actions={[
                    advisoryData[waterKey].split('.')[0],
                    advisoryData[fertilizerKey].split('.')[0],
                  ]}
                  impact={lang === 'hi' ? '+8% उपज सुधार अपेक्षित' : lang === 'gu' ? '+8% ઉપજ સુધારો અપેક્ષિત' : '+8% yield improvement expected'}
                  alternative={advisoryData.alternatives[0]}
                />
              </div>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function RecCard({ icon, title, bg, children }: { icon: React.ReactNode; title: string; bg: string; children: React.ReactNode }) {
  return (
    <Card hover tilt>
      <div className="flex items-center gap-3 mb-3">
        <span className={`grid place-items-center rounded-2xl p-3 ${bg}`}>{icon}</span>
        <h3 className="font-display text-base font-bold">{title}</h3>
      </div>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{children}</p>
    </Card>
  );
}
