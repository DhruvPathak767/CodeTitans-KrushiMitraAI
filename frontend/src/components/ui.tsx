import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...args: Parameters<typeof twMerge>) {
  return twMerge(...args);
}

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false, ...rest }: CardProps) {
  return (
    <motion.div
      className={cn('card p-5', hover && 'transition-transform hover:-translate-y-1', className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  className?: string;
}

const badgeVariants = {
  success: 'bg-brand-500/15 text-brand-700 dark:text-brand-300',
  warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  error: 'bg-red-500/15 text-red-700 dark:text-red-300',
  info: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
  neutral: 'bg-slate-500/15 text-slate-700 dark:text-slate-300',
};

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return <span className={cn('badge', badgeVariants[variant], className)}>{children}</span>;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  trendUp?: boolean;
  accent?: string;
  delay?: number;
}

export function StatCard({ label, value, icon, trend, trendUp, accent = 'brand', delay = 0 }: StatCardProps) {
  const accentMap: Record<string, string> = {
    brand: 'from-brand-500/20 to-brand-500/5 text-brand-600 dark:text-brand-400',
    sky: 'from-sky-500/20 to-sky-500/5 text-sky-600 dark:text-sky-400',
    amber: 'from-amber-500/20 to-amber-500/5 text-amber-600 dark:text-amber-400',
    soil: 'from-soil-500/20 to-soil-500/5 text-soil-600 dark:text-soil-400',
    rose: 'from-rose-500/20 to-rose-500/5 text-rose-600 dark:text-rose-400',
  };
  return (
    <Card hover initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-bold font-display tracking-tight">{value}</p>
          {trend && (
            <p className={cn('mt-1 text-xs font-medium', trendUp ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500')}>
              {trend}
            </p>
          )}
        </div>
        {icon && (
          <div className={cn('grid place-items-center rounded-2xl bg-gradient-to-br p-3', accentMap[accent])}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: string;
}

export function ProgressBar({ value, max = 100, className, color = 'bg-brand-500' }: ProgressBarProps) {
  return (
    <div className={cn('h-2 w-full rounded-full bg-slate-200 dark:bg-white/10', className)}>
      <motion.div
        className={cn('h-full rounded-full', color)}
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
      />
    </div>
  );
}

interface ConfidenceMeterProps {
  value: number;
  label?: string;
}

export function ConfidenceMeter({ value, label }: ConfidenceMeterProps) {
  const color = value >= 90 ? 'text-brand-600 dark:text-brand-400' : value >= 75 ? 'text-sky-600 dark:text-sky-400' : 'text-amber-600 dark:text-amber-400';
  const barColor = value >= 90 ? 'bg-brand-500' : value >= 75 ? 'bg-sky-500' : 'bg-amber-500';
  return (
    <div>
      {label && <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>}
      <div className="flex items-center gap-3">
        <ProgressBar value={value} color={barColor} className="flex-1" />
        <span className={cn('text-sm font-bold tabular-nums', color)}>{value}%</span>
      </div>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('skeleton', className)} />;
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  desc: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, desc, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 p-10 text-center"
    >
      <div className="grid place-items-center rounded-3xl bg-slate-100 dark:bg-white/5 p-5 text-slate-400">{icon}</div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">{desc}</p>
      {action}
    </motion.div>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, subtitle, action, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-end justify-between gap-4', className)}>
      <div>
        <h2 className="font-display text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

interface AIResponsePanelProps {
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-brand-500/20 bg-gradient-to-br from-brand-500/5 to-sky-500/5 p-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid place-items-center rounded-xl bg-brand-500/15 p-1.5 text-brand-600 dark:text-brand-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a7 7 0 0 0-7 7c0 2.5 1.5 4.5 3 6v3h8v-3c1.5-1.5 3-3.5 3-6a7 7 0 0 0-7-7Z"/><path d="M9 18h6"/></svg>
          </span>
          <span className="text-sm font-semibold">AI Analysis</span>
        </div>
        <Badge variant={priorityVariant[priority]}>{t(`common.${priority}`)}</Badge>
      </div>
      <div className="mt-4 space-y-4">
        <ConfidenceMeter value={confidence} label={t('common.confidence')} />
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('common.reason')}</p>
          <p className="mt-1 text-sm">{reason}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('common.actions')}</p>
          <ul className="mt-2 space-y-1.5">
            {actions.map((a, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-start gap-2 text-sm"
              >
                <span className="mt-1 grid place-items-center rounded-full bg-brand-500/20 p-0.5 text-brand-600 dark:text-brand-400">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7"/></svg>
                </span>
                {a}
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-sky-500/10 p-3">
          <span className="text-sky-600 dark:text-sky-400">→</span>
          <p className="text-sm"><span className="font-semibold">{t('common.impact')}: </span>{impact}</p>
        </div>
        {alternative && (
          <div className="flex items-center gap-2 rounded-2xl bg-amber-500/10 p-3">
            <span className="text-amber-600 dark:text-amber-400">⇄</span>
            <p className="text-sm"><span className="font-semibold">{t('common.alternative')}: </span>{alternative}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
