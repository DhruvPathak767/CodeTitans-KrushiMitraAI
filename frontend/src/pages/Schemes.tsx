import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark, CheckCircle2, Clock, FileText, ArrowRight, X, BadgeCheck, Sparkles,
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
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{t('schemes.title')}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('schemes.subtitle')}</p>
      </div>

      {/* Eligibility banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-500 p-6 text-white shadow-glow"
      >
        <div className="relative z-10 flex items-center gap-4">
          <div className="grid place-items-center rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
            <BadgeCheck className="h-8 w-8" />
          </div>
          <div>
            <p className="font-display text-3xl font-extrabold">{schemes.length}</p>
            <p className="text-sm text-white/90">{t('schemes.eligible')} {t('schemes.schemes')}</p>
          </div>
        </div>
        <Sparkles className="pointer-events-none absolute right-4 top-4 h-24 w-24 text-white/10" />
      </motion.div>

      {/* Schemes grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {schemes.map((s, i) => {
          const isApplied = applied.includes(s.id);
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card hover className={cn('h-full', isApplied && 'border-brand-500/40')}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center rounded-2xl bg-brand-500/15 p-2.5 text-brand-600 dark:text-brand-400">
                      <Landmark className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-sm leading-tight">{s[nameKey]}</h3>
                      <p className="mt-0.5 text-xs text-slate-400">{s.eligibility}</p>
                    </div>
                  </div>
                  {isApplied && <Badge variant="success"><CheckCircle2 className="h-3 w-3" /> Applied</Badge>}
                </div>

                <div className="mt-4 rounded-2xl bg-brand-500/10 p-3">
                  <p className="text-xs font-medium text-brand-700 dark:text-brand-300">{t('schemes.benefits')}</p>
                  <p className="mt-1 text-sm font-semibold">{s[benefitKey]}</p>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{t('common.deadline')}: </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{s.deadline}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {s.docs.map((d) => (
                    <span key={d} className="rounded-full bg-slate-100 dark:bg-white/5 px-2.5 py-1 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                      {d}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setApplyScheme(s)}
                  disabled={isApplied}
                  className={cn(
                    'mt-4 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all',
                    isApplied
                      ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 cursor-default'
                      : 'bg-brand-600 text-white hover:bg-brand-700 hover:scale-[1.02]',
                  )}
                >
                  {isApplied ? (
                    <><CheckCircle2 className="h-4 w-4" /> Applied</>
                  ) : (
                    <>{t('schemes.apply')} <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Apply modal */}
      <AnimatePresence>
        {applyScheme && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setApplyScheme(null)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2"
            >
              <Card className="glass-strong">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold">{applyScheme[nameKey]}</h3>
                  <button onClick={() => setApplyScheme(null)} className="rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-white/10">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-slate-600 dark:text-slate-300">{applyScheme[benefitKey]}</p>
                  <div>
                    <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">{t('schemes.documents')}:</p>
                    <div className="space-y-2">
                      {applyScheme.docs.map((d) => (
                        <div key={d} className="flex items-center gap-2 rounded-xl bg-slate-100/60 dark:bg-white/5 p-2.5 text-sm">
                          <FileText className="h-4 w-4 text-slate-400" />
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
                    className="btn-primary w-full"
                  >
                    <CheckCircle2 className="h-4 w-4" /> {t('common.submit')}
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
