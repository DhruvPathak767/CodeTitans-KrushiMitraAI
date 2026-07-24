import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark, CheckCircle2, Clock, FileText, ArrowRight, X, BadgeCheck, Sparkles, Activity,
} from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { Card, Badge, SectionHeader, cn } from '@/components/ui';
import { schemes } from '@/data/mock';

export function Schemes() {
  const { t, lang } = useApp();
  const langSuffix = lang === 'hi' ? '_hi' : lang === 'gu' ? '_gu' : '';
  const [applyScheme, setApplyScheme] = useState<typeof schemes[0] | null>(null);
  const [applied, setApplied] = useState<string[]>([]);

  const nameKey = `name${langSuffix}` as 'name' | 'name_hi' | 'name_gu';
  const benefitKey = `benefit${langSuffix}` as 'benefit' | 'benefit_hi' | 'benefit_gu';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text">{t('schemes.title')}</h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{t('schemes.subtitle')}</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl glass px-4 py-2 border border-brand-500/30">
          <BadgeCheck className="h-4 w-4 text-brand-500 animate-pulse" />
          <span className="text-xs font-bold">Government Subsidy Matcher: <span className="text-brand-500">100% ELIGIBLE</span></span>
        </div>
      </div>

      {/* Eligible Schemes Banner with Permanent Animated Imagery */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-7 text-white shadow-glow border border-white/30 group min-h-[160px]"
      >
        <img
          src="/images/hero_agriculture_ai.png"
          alt="PM-Kisan Government Agriculture Welfare Schemes"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-brand-950/80 to-transparent" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="grid place-items-center rounded-2xl bg-white/20 p-4 backdrop-blur-md shadow-glow border border-white/30 animate-float">
              <BadgeCheck className="h-9 w-9 text-brand-400" />
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl font-black text-white">{schemes.length} {t('schemes.bannerSuffix')}</p>
              <p className="text-xs sm:text-sm font-bold text-slate-200">{t('schemes.eligible')} {t('schemes.bannerMatched')}</p>
            </div>
          </div>
        </div>
        <Sparkles className="pointer-events-none absolute right-4 top-4 h-32 w-32 text-brand-400/20 animate-spin-slow" />
      </motion.div>

      {/* Schemes Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {schemes.map((s, i) => {
          const isApplied = applied.includes(s.id);
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card hover tilt className={cn('h-full flex flex-col justify-between', isApplied && 'border-brand-500/50 ring-2 ring-brand-500/30')}>
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid place-items-center rounded-2xl bg-brand-500/20 p-3 text-brand-600 dark:text-brand-400 shadow-glow">
                        <Landmark className="h-6 w-6" />
                      </span>
                      <div>
                        <h3 className="font-display text-base font-bold leading-tight">{s[nameKey]}</h3>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 font-medium">{s.eligibility}</p>
                      </div>
                    </div>
                    {isApplied && <Badge variant="success" pulse><CheckCircle2 className="h-3.5 w-3.5" /> Applied</Badge>}
                  </div>

                  <div className="mt-4 rounded-2xl glass p-3.5 border border-brand-500/20 bg-brand-500/5">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-brand-600 dark:text-brand-400">{t('schemes.benefits')}</p>
                    <p className="mt-1 text-xs font-bold text-slate-800 dark:text-slate-100">{s[benefitKey]}</p>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span>{t('common.deadline')}: </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{s.deadline}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.docs.map((d) => (
                      <span key={d} className="rounded-xl glass px-2.5 py-1 text-[10px] font-semibold text-slate-600 dark:text-slate-300 border border-white/20">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setApplyScheme(s)}
                  disabled={isApplied}
                  className={cn(
                    'mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold transition-all shadow-glow',
                    isApplied
                      ? 'bg-brand-500/20 text-brand-600 dark:text-brand-400 cursor-default'
                      : 'btn-primary',
                  )}
                >
                  {isApplied ? (
                    <><CheckCircle2 className="h-4 w-4" /> {t('common.appSubmitted')}</>
                  ) : (
                    <>{t('schemes.apply')} <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {applyScheme && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setApplyScheme(null)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2"
            >
              <Card hover tilt className="glass-strong border border-white/40 dark:border-white/10 p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-extrabold gradient-text">{applyScheme[nameKey]}</h3>
                  <button onClick={() => setApplyScheme(null)} className="rounded-xl p-2 hover:bg-slate-200/50 dark:hover:bg-white/10">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-4 space-y-4">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">{applyScheme[benefitKey]}</p>
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">{t('schemes.documents')}:</p>
                    <div className="space-y-2">
                      {applyScheme.docs.map((d) => (
                        <div key={d} className="flex items-center gap-2.5 rounded-2xl glass p-3 text-xs font-semibold border border-white/20">
                          <FileText className="h-4 w-4 text-brand-500" />
                          <span className="flex-1">{d}</span>
                          <CheckCircle2 className="h-4 w-4 text-brand-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setApplied((p) => [...p, applyScheme.id]);
                      setApplyScheme(null);
                    }}
                    className="btn-primary w-full shadow-glow"
                  >
                    <CheckCircle2 className="h-4 w-4" /> {t('schemes.submitted')}
                  </button>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
