import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Sparkles, CheckCircle2, Circle, Cloud } from 'lucide-react';
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
    setTimeout(() => setGenerating(false), 2000);
  }

  const dayKeys: Record<string, string> = {
    mon: 'planner.mon', tue: 'planner.tue', wed: 'planner.wed',
    thu: 'planner.thu', fri: 'planner.fri', sat: 'planner.sat', sun: 'planner.sun',
  };

  const todayIdx = (new Date().getDay() + 6) % 7; // Monday = 0

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{t('planner.title')}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('planner.subtitle')}</p>
        </div>
        <button onClick={generate} className="btn-primary text-sm">
          <Sparkles className="h-4 w-4" /> {t('planner.generate')}
        </button>
      </div>

      {generating && (
        <Card>
          <div className="flex flex-col items-center gap-3 py-10">
            <Sparkles className="h-8 w-8 animate-pulse text-brand-500" />
            <p className="font-display text-lg font-semibold">{t('chat.thinking')}...</p>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-2 w-2 rounded-full bg-brand-500 animate-typing" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plan.map((d, i) => (
          <motion.div
            key={d.day}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className={cn(i === todayIdx && 'border-brand-500/40 ring-2 ring-brand-500/10')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className={cn('h-5 w-5', i === todayIdx ? 'text-brand-500' : 'text-slate-400')} />
                  <h3 className="font-semibold text-sm">{t(dayKeys[d.day])}</h3>
                </div>
                {i === todayIdx && <Badge variant="success">{t('common.today')}</Badge>}
                {d.tasks.some((tk, j) => tk.toLowerCase().includes('rain')) && (
                  <Cloud className="h-4 w-4 text-sky-400" />
                )}
              </div>
              <div className="mt-3 space-y-2">
                {d.tasks.map((task, j) => (
                  <button
                    key={j}
                    onClick={() => toggle(i, j)}
                    className="flex w-full items-start gap-2.5 rounded-xl p-2 text-left transition-colors hover:bg-slate-100/60 dark:hover:bg-white/5"
                  >
                    {d.done[j] ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                    ) : (
                      <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />
                    )}
                    <span className={cn('text-xs', d.done[j] && 'line-through opacity-50')}>{task}</span>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI weather-aware note */}
      <Card className="border-sky-500/20 bg-gradient-to-br from-sky-500/5 to-brand-500/5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-sky-500" />
          <h3 className="font-display text-sm font-bold">
            {lang === 'hi' ? 'AI मौसम-जागरूक योजना' : lang === 'gu' ? 'AI હવામાન-જાગૃત યોજના' : 'AI Weather-Aware Plan'}
          </h3>
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {lang === 'hi'
            ? 'बुध-गुरु को भारी बारिश अपेक्षित — छिड़काव टाला गया। शुक्रवार को बारिश के बाद रोग जांच जोड़ी गई।'
            : lang === 'gu'
            ? 'બુધ-ગુરુને ભારે વરસાદ — છંટકાવ ટાળ્યો. શુક્રવારે વરસાદ પછી રોગ ચકાસણી ઉમેરી.'
            : 'Heavy rain Wed-Thu — spraying deferred. Post-rain disease scouting added for Friday.'}
        </p>
      </Card>
    </div>
  );
}
