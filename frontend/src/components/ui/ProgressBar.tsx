import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';

export interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: string;
  label?: string;
}

/**
 * Accessible progress bar with earthy green fill.
 */
export function ProgressBar({
  value,
  max = 100,
  className,
  color = 'bg-primary-500',
  label,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-base font-medium text-slate-600">{label}</span>
          <span className="text-base font-bold text-primary-700">{Math.round(pct)}%</span>
        </div>
      )}
      <div
        className="h-3 w-full rounded-full bg-slate-100 overflow-hidden"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <motion.div
          className={cn('h-full rounded-full', color)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
