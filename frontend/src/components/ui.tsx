import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode, useState, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...args: Parameters<typeof twMerge>) {
  return twMerge(...args);
}

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  tilt?: boolean;
}

export function Card({ children, className, hover = true, tilt = false, ...rest }: CardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateX(-y / 15);
    setRotateY(x / 15);
  };

  const handleMouseLeave = () => {
    if (!tilt) return;
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tilt ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'card p-6 relative overflow-hidden transition-all duration-300 border border-white/50 dark:border-white/10 hover:border-brand-500/40 dark:hover:border-brand-400/40',
        hover && 'hover:-translate-y-1 hover:shadow-glass-hover',
        className
      )}
      {...rest}
    >
      {/* Subtle glass reflection sweep */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 hover:opacity-100 pointer-events-none" />
      {children}
    </motion.div>
  );
}

interface BadgeProps {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'gold';
  className?: string;
  pulse?: boolean;
}

const badgeVariants = {
  success: 'bg-brand-500/15 text-brand-700 dark:text-brand-300 border-brand-500/30',
  warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
  error: 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30',
  info: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
  neutral: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30',
  gold: 'bg-amber-500/20 text-amber-600 dark:text-gold-400 border-amber-500/40',
};

export function Badge({ children, variant = 'neutral', className, pulse = false }: BadgeProps) {
  return (
    <span className={cn('badge shadow-sm', badgeVariants[variant], className)}>
      {pulse && <span className="h-1.5 w-1.5 rounded-full bg-current animate-ping" />}
      {children}
    </span>
  );
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
    brand: 'from-brand-500/25 to-brand-500/5 text-brand-600 dark:text-brand-400 shadow-glow',
    sky: 'from-sky-500/25 to-sky-500/5 text-sky-600 dark:text-sky-400 shadow-glow-sky',
    amber: 'from-amber-500/25 to-amber-500/5 text-amber-600 dark:text-amber-400 shadow-glow-gold',
    soil: 'from-soil-500/25 to-soil-500/5 text-soil-600 dark:text-soil-400',
    rose: 'from-rose-500/25 to-rose-500/5 text-rose-600 dark:text-rose-400',
  };
  return (
    <Card hover tilt initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">{label}</p>
          <p className="mt-2 text-3xl font-extrabold font-display tracking-tight gradient-text">{value}</p>
          {trend && (
            <p className={cn('mt-2 text-xs font-medium inline-flex items-center gap-1', trendUp ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500')}>
              <span>{trendUp ? '↑' : '↓'}</span>
              {trend}
            </p>
          )}
        </div>
        {icon && (
          <div className={cn('grid place-items-center rounded-2xl bg-gradient-to-br p-3.5 border border-white/20 dark:border-white/10', accentMap[accent])}>
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

export function ProgressBar({ value, max = 100, className, color = 'bg-gradient-to-r from-brand-600 to-brand-400' }: ProgressBarProps) {
  return (
    <div className={cn('h-2.5 w-full rounded-full bg-slate-200/80 dark:bg-white/10 overflow-hidden p-0.5', className)}>
      <motion.div
        className={cn('h-full rounded-full shadow-glow', color)}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, (value / max) * 100)}%` }}
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
  const barColor = value >= 90 ? 'bg-gradient-to-r from-brand-600 to-brand-400' : value >= 75 ? 'bg-gradient-to-r from-sky-600 to-sky-400' : 'bg-gradient-to-r from-amber-600 to-gold-400';
  return (
    <div>
      {label && <p className="mb-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>}
      <div className="flex items-center gap-3">
        <ProgressBar value={value} color={barColor} className="flex-1" />
        <span className={cn('text-sm font-extrabold tabular-nums font-display', color)}>{value}%</span>
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
      className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 glass p-10 text-center shadow-card"
    >
      <div className="grid place-items-center rounded-3xl bg-brand-500/10 p-5 text-brand-600 dark:text-brand-400 shadow-glow">{icon}</div>
      <h3 className="font-display text-xl font-bold">{title}</h3>
      <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
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
    <div className={cn('flex items-end justify-between gap-4 mb-6', className)}>
      <div>
        <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl gradient-text">{title}</h2>
        {subtitle && <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{subtitle}</p>}
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-brand-500/30 bg-gradient-to-br from-brand-500/10 via-slate-900/5 to-sky-500/10 p-6 glass-strong shadow-card"
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
