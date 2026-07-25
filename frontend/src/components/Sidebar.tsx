import { NavLink, useLocation } from 'react-router-dom';
import {
  Home, Sprout, TrendingUp, User, Leaf, MapPin, Radio,
} from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { useFarm } from '@/context/FarmContext';
import { cn } from '@/lib/cn';

/**
 * Desktop-Only Sidebar Component (Hidden on Mobile/Small Screens).
 * On Mobile/Small screens (< 1024px), BottomNav is used exclusively.
 */
export function Sidebar() {
  const { t } = useApp();
  const { activeFarm } = useFarm();
  const location = useLocation();

  const navItems = [
    { to: '/app/home', label: t('bottomNav.home'), icon: Home, key: 'home' },
    { to: '/app/farm', label: t('bottomNav.farm'), icon: Sprout, key: 'farm' },
    { to: '/app/market', label: t('bottomNav.market'), icon: TrendingUp, key: 'market' },
    { to: '/app/profile', label: t('bottomNav.profile'), icon: User, key: 'profile' },
  ];

  return (
    <aside className="hidden lg:block w-64 h-full shrink-0 z-20">
      <div className="flex h-full flex-col justify-between overflow-hidden bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <NavLink to="/app/home" className="flex items-center gap-3">
              <div className="grid place-items-center rounded-2xl bg-emerald-600 p-2.5 text-white shadow-md">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  KrishiMitra AI
                </p>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Farmer Decision Guide
                </p>
              </div>
            </NavLink>
          </div>

          {/* Navigation Section */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('sidebar.primaryActions')}
            </p>
            <div className="space-y-1 mt-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active =
                  location.pathname === item.to ||
                  (item.key === 'home' && location.pathname === '/app/dashboard') ||
                  (item.key === 'home' && location.pathname.startsWith('/app/disease')) ||
                  (item.key === 'home' && location.pathname.startsWith('/app/advisory')) ||
                  (item.key === 'home' && location.pathname.startsWith('/app/weather')) ||
                  (item.key === 'home' && location.pathname.startsWith('/app/irrigation')) ||
                  (item.key === 'market' && location.pathname.startsWith('/app/sellstore'));

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={cn(
                      'relative flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-base font-bold transition-all duration-200 min-h-[52px]',
                      active
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80',
                    )}
                  >
                    <Icon className={cn('h-5 w-5', active ? 'text-white' : 'text-slate-400')} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Active Field GPS Live Widget at Bottom */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 p-4 border border-emerald-100 dark:border-emerald-900/50">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-emerald-600" /> {t('sidebar.activeField')}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-200/60 dark:bg-emerald-800/60 px-2 py-0.5 rounded-full">
                <Radio className="h-2.5 w-2.5 animate-pulse text-emerald-600" /> {t('sidebar.gpsLive')}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate mt-1">
              {activeFarm?.farmName || 'Patel Green Fields'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {activeFarm?.cropName || 'Wheat Crop'} • {activeFarm?.area || 12.5} Acres
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
