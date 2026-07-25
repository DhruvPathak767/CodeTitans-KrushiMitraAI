import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

export interface ActionCardProps {
  /** Emoji or icon to display at top */
  icon: ReactNode;
  /** Title — must use t() */
  title: string;
  /** Description — must use t() */
  description: string;
  /** CTA button label — must use t() */
  ctaLabel: string;
  /** Route to navigate to on CTA click */
  to: string;
  /** Entrance animation delay */
  delay?: number;
  /** Optional accent color class for the icon background */
  accent?: string;
}

/**
 * Primary action card — one of the 4 main dashboard actions.
 *
 * Design requirements:
 * - 180px minimum height
 * - Large icon (48px)
 * - 20px title, 16px description
 * - Full-width CTA button (56px height)
 * - Rounded corners, earthy shadow
 * - Touch-friendly with clear tap target
 */
export function ActionCard({
  icon,
  title,
  description,
  ctaLabel,
  to,
  delay = 0,
  accent = 'bg-primary-50 text-primary-600',
}: ActionCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
    >
      <Card
        className="min-h-[180px] flex flex-col justify-between"
        interactive
        onClick={() => navigate(to)}
      >
        <div className="flex items-start gap-4 mb-4">
          <div
            className={cn(
              'grid place-items-center rounded-2xl p-3 shrink-0',
              accent,
            )}
            aria-hidden="true"
          >
            <span className="text-3xl">{icon}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
              {title}
            </h3>
            <p className="text-base text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            navigate(to);
          }}
        >
          {ctaLabel}
        </Button>
      </Card>
    </motion.div>
  );
}
