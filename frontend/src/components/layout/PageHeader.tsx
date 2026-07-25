import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { cn } from '@/lib/cn';

/** Routes that are primary bottom-nav tabs — no back button on these */
const PRIMARY_TABS = ['/app/home', '/app/farm', '/app/market', '/app/profile'];

export interface PageHeaderProps {
  /** Page title — must use t() */
  title: string;
  /** Optional right-side action */
  action?: React.ReactNode;
  /** Override "should show back button" logic */
  showBack?: boolean;
}

/**
 * Page-level header with back navigation.
 *
 * Shows a back arrow + title on sub-pages (disease, weather, advisory, etc.)
 * Hidden on primary tabs (Home, Farm, Market, Profile).
 *
 * The back button navigates using browser history (navigate(-1)).
 * If no history, it falls back to /app/home.
 */
export function PageHeader({ title, action, showBack }: PageHeaderProps) {
  const { t } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const isPrimaryTab = PRIMARY_TABS.includes(location.pathname);
  const shouldShowBack = showBack ?? !isPrimaryTab;

  function handleBack() {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/app/home');
    }
  }

  if (!shouldShowBack && !action) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between mb-4"
    >
      <div className="flex items-center gap-3 min-w-0">
        {shouldShowBack && (
          <button
            onClick={handleBack}
            className={cn(
              'grid place-items-center rounded-xl',
              'h-11 w-11 min-h-[48px] min-w-[48px]',
              'bg-white border border-slate-100 shadow-sm',
              'hover:bg-slate-50 active:bg-slate-100 transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
            )}
            aria-label={t('nav.back')}
          >
            <ArrowLeft className="h-5 w-5 text-slate-700" />
          </button>
        )}
        <h1 className="text-2xl font-bold text-slate-800 truncate">{title}</h1>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  );
}
