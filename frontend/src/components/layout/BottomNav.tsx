import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Sprout, TrendingUp, User } from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { cn } from '@/lib/cn';

const tabs = [
  { key: 'home', path: '/app/home', icon: Home },
  { key: 'farm', path: '/app/farm', icon: Sprout },
  { key: 'market', path: '/app/market', icon: TrendingUp },
  { key: 'profile', path: '/app/profile', icon: User },
] as const;

/**
 * 4-tab bottom navigation bar — the primary navigation paradigm.
 *
 * Design decisions:
 * - 72px height for thumb reach (bottom ~20% of screen is the "thumb zone")
 * - 48px+ touch targets per tab
 * - Active tab indicator with Framer Motion layoutId animation
 * - Labels always visible (no icon-only mode) for low-literacy users
 * - All labels use t() for i18n
 * - Hides on desktop when AppShell renders side-rail variant
 */
export function BottomNav() {
  const { t } = useApp();
  const location = useLocation();

  const labelKeys: Record<string, string> = {
    home: 'bottomNav.home',
    farm: 'bottomNav.farm',
    market: 'bottomNav.market',
    profile: 'bottomNav.profile',
  };

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors',
        'shadow-[0_-2px_12px_rgba(0,0,0,0.06)]',
        'pb-[env(safe-area-inset-bottom)]',
        'lg:hidden', // Hidden on laptop & big screens — Sidebar takes over
      )}
      role="navigation"
      aria-label={t('nav.main')}
    >
      <div className="flex items-stretch justify-around h-[72px] max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            location.pathname === tab.path ||
            (tab.key === 'home' && location.pathname === '/app/dashboard') ||
            (tab.key === 'home' && location.pathname.startsWith('/app/disease')) ||
            (tab.key === 'home' && location.pathname.startsWith('/app/advisory')) ||
            (tab.key === 'home' && location.pathname.startsWith('/app/weather')) ||
            (tab.key === 'home' && location.pathname.startsWith('/app/irrigation')) ||
            (tab.key === 'home' && location.pathname.startsWith('/app/schemes')) ||
            (tab.key === 'market' && location.pathname.startsWith('/app/sellstore'));

          return (
              <NavLink
                key={tab.key}
                to={tab.path}
                className={cn(
                  'relative flex flex-col items-center justify-center gap-1 flex-1',
                  'min-h-[48px] min-w-[48px]',
                  'transition-colors duration-200',
                  isActive ? 'text-primary-700 dark:text-primary-400 font-bold' : 'text-slate-400 dark:text-slate-500',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomnav-indicator"
                    className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-10 rounded-full bg-primary-600 dark:bg-primary-400"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  className={cn(
                    'h-6 w-6 transition-transform duration-200',
                    isActive && 'scale-110',
                  )}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    'text-xs font-semibold leading-tight',
                    isActive ? 'text-primary-700 dark:text-primary-400' : 'text-slate-400 dark:text-slate-500',
                  )}
                >
                  {t(labelKeys[tab.key])}
                </span>
              </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
