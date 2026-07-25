import { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  /** Padding variant — compact for dashboard widgets */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Hover lift effect */
  interactive?: boolean;
}

const paddingMap = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

/**
 * Earthy card with soft shadow, warm background, and rounded corners.
 * Replaces the glassmorphism cards for better sunlight readability.
 */
export function Card({
  children,
  className,
  padding = 'md',
  interactive = false,
  ...rest
}: CardProps) {
  return (
    <motion.div
      className={cn(
        'rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors',
        'shadow-[0_2px_12px_-2px_rgba(139,94,60,0.08),0_1px_3px_rgba(0,0,0,0.04)] dark:shadow-none',
        interactive && 'hover:shadow-[0_4px_20px_-4px_rgba(139,94,60,0.12)] hover:border-primary-200 dark:hover:border-primary-700 transition-all duration-200 cursor-pointer',
        paddingMap[padding],
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
