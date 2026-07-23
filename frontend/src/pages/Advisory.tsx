import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Droplets, FlaskConical, CalendarClock, Sparkles, Lightbulb } from 'lucide-react';
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

  function generate() {
    setLoading(true);
    setShow(false);
    setTimeout(() => {
      setLoading(false);
      setShow(true);
    }, 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{t('advisory.title')}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('advisory.subtitle')}</p>
        </div>
        <button onClick={generate} className="btn-primary text-sm">
          <Sparkles className="h-4 w-4" /> {t('advisory.generate')}
        </button>
      </div>

      {/* Growth stage timeline */}
      <Card>
        <SectionHeader title={t('advisory.growth')} />
        <div className="mt-5 flex items-center justify-between">
          {['Germination', 'Vegetative', 'Flowering', 'Grain Filling', 'Maturity'].map((stage, i) => {
            const isCurrent = stage === 'Flowering';
            const isPast = i < 2;
            return (
              <div key={stage} className="flex flex-1 flex-col items-center">
                <div className="relative flex w-full items-center">
                  {i > 0 && <div className={`h-0.5 flex-1 ${isPast ? 'bg-brand-500' : 'bg-slate-200 dark:bg-white/10'}`} />}
                  <motion.div
                    className={`h-4 w-4 rounded-full ${isCurrent ? 'bg-brand-500 ring-4 ring-brand-500/20' : isPast ? 'bg-brand-500' : 'bg-slate-300 dark:bg-white/10'}`}
                    animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  {i < 4 && <div className={`h-0.5 flex-1 ${isPast ? 'bg-brand-500' : 'bg-slate-200 dark:bg-white/10'}`} />}
                </div>
                <p className={`mt-2 text-[10px] font-medium text-center ${isCurrent ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}>{stage}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 rounded-2xl bg-brand-500/10 p-3 text-center">
          <p className="text-sm">
            <span className="font-semibold text-brand-700 dark:text-brand-300">{t('advisory.growth')}: </span>
            {advisoryData[growthKey]}
          </p>
        </div>
      </Card>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card>
              <div className="flex flex-col items-center gap-4 py-12">
                <Sparkles className="h-8 w-8 animate-pulse text-brand-500" />
                <p className="font-display text-lg font-semibold">{t('chat.thinking')}...</p>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-2 w-2 rounded-full bg-brand-500 animate-typing" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        ) : show ? (
          <motion.div key="content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Recommendations grid */}
            <div className="grid gap-4 md:grid-cols-2">
              <RecCard icon={<Droplets className="h-5 w-5 text-sky-500" />} title={t('advisory.water')} bg="bg-sky-500/15">
                {advisoryData[waterKey]}
              </RecCard>
              <RecCard icon={<FlaskConical className="h-5 w-5 text-amber-500" />} title={t('advisory.fertilizer')} bg="bg-amber-500/15">
                {advisoryData[fertilizerKey]}
              </RecCard>
              <RecCard icon={<CalendarClock className="h-5 w-5 text-brand-500" />} title={t('advisory.harvest')} bg="bg-brand-500/15">
                {advisoryData[harvestKey]}
              </RecCard>
              <RecCard icon={<Lightbulb className="h-5 w-5 text-soil-500" />} title={t('common.alternative')} bg="bg-soil-500/15">
                {advisoryData.alternatives.join(' · ')}
              </RecCard>
            </div>

            {/* Explainable AI */}
            <Card>
              <SectionHeader title={t('advisory.explainable')} />
              <div className="mt-4">
                <ConfidenceMeter value={advisoryData.confidence} label={t('common.confidence')} />
              </div>
              <p className="mt-4 rounded-2xl bg-slate-100/60 dark:bg-white/5 p-4 text-sm text-slate-600 dark:text-slate-300">
                {advisoryData[reasonKey]}
              </p>
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
    <Card hover>
      <div className="flex items-center gap-3">
        <span className={`grid place-items-center rounded-2xl p-2.5 ${bg}`}>{icon}</span>
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{children}</p>
    </Card>
  );
}
