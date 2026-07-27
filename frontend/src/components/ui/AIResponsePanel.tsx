import { motion } from 'framer-motion';
import { Badge } from './Badge';
import { ConfidenceMeter } from './ConfidenceMeter';

export interface AIResponsePanelProps {
  confidence: number;
  reason: string;
  actions: string[];
  priority: 'high' | 'medium' | 'low';
  impact: string;
  alternative?: string;
  t: (k: string) => string;
}

const priorityVariant: Record<string, 'error' | 'warning' | 'info'> = {
  high: 'error',
  medium: 'warning',
  low: 'info',
};

export function AIResponsePanel({ confidence, reason, actions, priority, impact, alternative, t }: AIResponsePanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-emerald-500/30 hover:border-emerald-500 bg-gradient-to-br from-emerald-500/10 via-slate-900/5 to-sky-500/10 p-6 glass-strong shadow-card transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center rounded-2xl bg-brand-500/20 p-2.5 text-brand-600 dark:text-brand-400 shadow-glow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6v3h8v-3c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7Z"/><path d="M9 18h6"/></svg>
          </span>
          <div>
            <h4 className="text-base font-bold font-display">AI Agricultural Analysis</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Satellite & Micro-Climate Powered</p>
          </div>
        </div>
        <Badge variant={priorityVariant[priority]} pulse>{t(`common.${priority}`)}</Badge>
      </div>
      <div className="mt-5 space-y-4">
        <ConfidenceMeter value={confidence} label={t('common.confidence')} />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('common.reason')}</p>
          <p className="mt-1 text-sm leading-relaxed">{reason}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('common.actions')}</p>
          <ul className="mt-2 space-y-2">
            {actions.map((a, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-start gap-2.5 text-sm"
              >
                <span className="mt-0.5 grid place-items-center rounded-full bg-brand-500/20 p-1 text-brand-600 dark:text-brand-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7"/></svg>
                </span>
                <span>{a}</span>
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-sky-500/10 p-3.5 border border-sky-500/20">
          <span className="text-sky-600 dark:text-sky-400 font-bold">→</span>
          <p className="text-sm"><span className="font-bold">{t('common.impact')}: </span>{impact}</p>
        </div>
        {alternative && (
          <div className="flex items-center gap-3 rounded-2xl bg-amber-500/10 p-3.5 border border-amber-500/20">
            <span className="text-amber-600 dark:text-amber-400 font-bold">⇄</span>
            <p className="text-sm"><span className="font-bold">{t('common.alternative')}: </span>{alternative}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
