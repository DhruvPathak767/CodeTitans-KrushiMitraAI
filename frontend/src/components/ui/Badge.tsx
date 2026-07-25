import { cn } from '@/lib/cn';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  className?: string;
  pulse?: boolean;
}

const variants = {
  success: 'bg-primary-50 text-primary-700 border-primary-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  neutral: 'bg-slate-50 text-slate-600 border-slate-200',
};

/**
 * Small status badge with earthy palette. 16px min font for accessibility.
 */
export function Badge({ children, variant = 'neutral', className, pulse }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold border',
        variants[variant],
        className,
      )}
    >
      {pulse && (
        <span className="h-2 w-2 rounded-full bg-current animate-pulse" aria-hidden="true" />
      )}
      {children}
    </span>
  );
}
