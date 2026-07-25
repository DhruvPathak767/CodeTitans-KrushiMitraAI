import { cn } from '@/lib/cn';

export interface SkeletonProps {
  className?: string;
  /** Number of skeleton lines to render */
  lines?: number;
}

/**
 * Loading skeleton placeholder. Warm-toned shimmer for earthy design.
 */
export function Skeleton({ className, lines }: SkeletonProps) {
  if (lines) {
    return (
      <div className="space-y-3" role="status" aria-label="Loading">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-5 rounded-xl bg-secondary-100 animate-pulse',
              i === lines - 1 && 'w-2/3',
              className,
            )}
          />
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('rounded-xl bg-secondary-100 animate-pulse', className)}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

/**
 * Card-shaped skeleton for loading states on dashboard.
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'rounded-2xl bg-white border border-slate-100 p-5 space-y-4',
        'shadow-[0_2px_12px_-2px_rgba(139,94,60,0.08)]',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
      <Skeleton className="h-12 w-full rounded-xl" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
