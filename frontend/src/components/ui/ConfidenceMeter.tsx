import { ProgressBar } from './ProgressBar';
import { cn } from '@/lib/cn';

export interface ConfidenceMeterProps {
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
