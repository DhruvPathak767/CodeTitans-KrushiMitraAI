import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { cn } from '@/lib/cn';

export interface StatCardProps {
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
    <Card initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}>
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
          <div className={cn('grid place-items-center rounded-2xl bg-gradient-to-br p-3.5 border border-white/20 dark:border-white/10', accentMap[accent] || accentMap.brand)}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
