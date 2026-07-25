import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

/**
 * Friendly empty state for when no data is available.
 * All text should use t() keys — never hardcode strings.
 */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-2xl',
        'bg-surface-100 border border-dashed border-secondary-200 p-10 text-center',
        className,
      )}
      role="status"
    >
      <div className="grid place-items-center rounded-2xl bg-primary-50 p-5 text-primary-600">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
      <p className="max-w-xs text-base text-slate-500 leading-relaxed">{description}</p>
      {action}
    </motion.div>
  );
}
