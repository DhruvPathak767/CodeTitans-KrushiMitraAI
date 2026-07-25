import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/cn';

export interface ErrorStateProps {
  title: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: ReactNode;
  className?: string;
}

/**
 * Error state with retry button. Accessible and farmer-friendly.
 * All text should use t() keys — never hardcode strings.
 */
export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel,
  icon,
  className,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-2xl',
        'bg-red-50 border border-red-100 p-10 text-center',
        className,
      )}
      role="alert"
    >
      <div className="grid place-items-center rounded-2xl bg-red-100 p-5 text-red-600">
        {icon || <AlertTriangle className="h-8 w-8" />}
      </div>
      <h3 className="text-xl font-bold text-red-800">{title}</h3>
      {description && (
        <p className="max-w-xs text-base text-red-600 leading-relaxed">{description}</p>
      )}
      {onRetry && (
        <Button
          variant="outline"
          size="md"
          icon={<RefreshCw className="h-5 w-5" />}
          onClick={onRetry}
        >
          {retryLabel || 'Retry'}
        </Button>
      )}
    </motion.div>
  );
}
