import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Cloud, ScanLine, Sprout, Droplets, Store, Scale,
  Landmark, MessageSquare, Bell, MapPin, CalendarDays, FileBarChart,
  Home, Leaf, X, type LucideIcon,
} from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { cn } from '@/components/ui';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useApp();

  const mainNav: NavItem[] = [
    { to: '/app/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/app/weather', label: t('nav.weather'), icon: Cloud },
    { to: '/app/disease', label: t('nav.disease'), icon: ScanLine },
    { to: '/app/advisory', label: t('nav.advisory'), icon: Sprout },
    { to: '/app/irrigation', label: t('nav.irrigation'), icon: Droplets },
    { to: '/app/market', label: t('nav.market'), icon: Store },
    { to: '/app/sellstore', label: t('nav.sellstore'), icon: Scale },
    { to: '/app/schemes', label: t('nav.schemes'), icon: Landmark },
  ];

  const toolsNav: NavItem[] = [
    { to: '/app/chatbot', label: t('nav.chatbot'), icon: MessageSquare },
    { to: '/app/notifications', label: t('nav.notifications'), icon: Bell },
    { to: '/app/farm', label: t('nav.farm'), icon: MapPin },
    { to: '/app/planner', label: t('nav.planner'), icon: CalendarDays },
    { to: '/app/reports', label: t('nav.reports'), icon: FileBarChart },
  ];

  const location = useLocation();

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="grid place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-2 shadow-glow">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-display text-sm font-bold leading-none">{t('app.name')}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{t('app.tagline')}</p>
          </div>
        </NavLink>
        <button onClick={onClose} className="rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 lg:hidden">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 scrollbar-hide">
        <p className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t('nav.dashboard')}</p>
        {mainNav.map((item) => (
          <SidebarLink key={item.to} item={item} active={location.pathname === item.to} onClick={onClose} />
        ))}
        <p className="px-2 py-2 mt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Tools</p>
        {toolsNav.map((item) => (
          <SidebarLink key={item.to} item={item} active={location.pathname === item.to} onClick={onClose} />
        ))}
      </nav>

      <div className="px-3 py-4">
        <NavLink to="/" className="flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-white/10">
          <Home className="h-4 w-4" />
          {t('nav.home')}
        </NavLink>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-slate-200/60 dark:border-white/5 glass">
        {content}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed left-0 top-0 z-50 h-full w-72 glass-strong shadow-card lg:hidden"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarLink({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors no-tap',
        active
          ? 'text-brand-700 dark:text-brand-300'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5',
      )}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-2xl bg-brand-500/10"
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        />
      )}
      <Icon className={cn('relative h-[18px] w-[18px]', active && 'text-brand-600 dark:text-brand-400')} />
      <span className="relative">{item.label}</span>
    </NavLink>
  );
}
