import { useApp } from '@/i18n/AppContext';
import { useAdvisory } from '@/context/AdvisoryContext';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/cn';

interface TaskItem {
  id: string;
  label: string;
  completed: boolean;
}

/**
 * Today's Tasks — derived from Advisory API data.
 * Shows a checklist of actionable farming tasks for the day.
 * All labels use t() keys. Data comes from advisoryData.
 */
export function TodaysTasks() {
  const { t } = useApp();
  const { advisoryData, loading } = useAdvisory();

  if (loading) {
    return (
      <Card>
        <Skeleton className="h-5 w-1/3 mb-4" />
        <Skeleton lines={4} />
      </Card>
    );
  }

  const advisory = advisoryData?.advisory;

  // Derive tasks from advisory data — never hardcoded
  const tasks: TaskItem[] = [];

  if (advisory?.nextAction) {
    tasks.push({
      id: 'next-action',
      label: advisory.nextAction,
      completed: false,
    });
  }

  if (advisory?.irrigation?.status) {
    const skip = advisory.irrigation.status.toLowerCase().includes('not');
    tasks.push({
      id: 'irrigation',
      label: skip ? t('tasks.skipIrrigation') : t('tasks.irrigate'),
      completed: skip,
    });
  }

  if (advisory?.diseaseRisk?.level) {
    tasks.push({
      id: 'disease-check',
      label: t('tasks.captureImage'),
      completed: false,
    });
  }

  tasks.push({
    id: 'market-check',
    label: t('tasks.checkMarket'),
    completed: false,
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const pct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  if (tasks.length === 0) return null;

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">{t('tasks.today')}</h2>

      <ProgressBar value={pct} label={t('tasks.progress')} className="mb-4" />

      <ul className="space-y-3" role="list">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={cn(
              'flex items-start gap-3 py-2',
              task.completed && 'opacity-60',
            )}
          >
            {task.completed ? (
              <CheckCircle2 className="h-6 w-6 text-primary-500 shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <Circle className="h-6 w-6 text-slate-300 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <span
              className={cn(
                'text-lg text-slate-700',
                task.completed && 'line-through text-slate-400',
              )}
            >
              {task.label}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
