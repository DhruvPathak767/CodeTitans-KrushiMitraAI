import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

/* ─── Variant maps ─── */
const variantClasses = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-button dark:bg-primary-600 dark:hover:bg-primary-500',
  secondary:
    'bg-secondary-100 text-secondary-800 hover:bg-secondary-200 active:bg-secondary-300 border border-secondary-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700',
  outline:
    'bg-transparent text-primary-700 dark:text-primary-400 border-2 border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950 active:bg-primary-100',
  ghost:
    'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
} as const;

const sizeClasses = {
  sm: 'min-h-[44px] px-4 py-2.5 text-base gap-2 rounded-xl',
  md: 'min-h-[56px] px-6 py-3.5 text-lg gap-2.5 rounded-2xl',
  lg: 'min-h-[64px] px-8 py-4 text-xl gap-3 rounded-2xl',
} as const;

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  fullWidth?: boolean;
}

/**
 * Accessible button with 56px minimum height (md), large touch targets,
 * and earthy design language. All text must use t() — never hardcode.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  fullWidth = false,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      ) : icon ? (
        <span className="shrink-0" aria-hidden="true">{icon}</span>
      ) : null}
      <span>{children}</span>
    </motion.button>
  );
}
