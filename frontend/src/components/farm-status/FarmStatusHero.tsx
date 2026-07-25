import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/Skeleton';
import { useFarmStatus, type FarmStatusItem } from '@/hooks/useFarmStatus';
import { cn } from '@/lib/cn';

const severityColor: Record<FarmStatusItem['severity'], string> = {
  info: 'bg-primary-50 border-primary-100',
  warning: 'bg-amber-50 border-amber-100',
  success: 'bg-green-50 border-green-100',
};

/**
 * Farm status hero — dynamic status cards at the top of Home.
 *
 * Shows real-time farm status items derived from weather, advisory,
 * and farm APIs. Never displays static data. Shows skeletons when loading.
 */
export function FarmStatusHero() {
  const { items, loading } = useFarmStatus();

  if (loading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-14 min-w-[200px] rounded-xl shrink-0" />
        ))}
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div
      className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
      role="status"
      aria-live="polite"
    >
      {items.map((item, idx) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.3 }}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl border shrink-0 snap-start',
            'min-w-[200px] max-w-[280px]',
            severityColor[item.severity],
          )}
        >
          <span className="text-2xl shrink-0" aria-hidden="true">
            {item.emoji}
          </span>
          <span className="text-base font-medium text-slate-700 leading-tight">
            {item.message}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
