import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Cloud, ScanLine, Sprout, Droplets, Store, Scale,
  Landmark, MessageSquare, Bell, MapPin, CalendarDays, FileBarChart,
  Home, Leaf, X, Sparkles, type LucideIcon,
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
  const { t, farm } = useApp();

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
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/40 dark:border-white/10">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="grid place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-2.5 shadow-glow">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-display text-base font-extrabold leading-tight tracking-tight gradient-text">
                {t('app.name')}
              </p>
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                Future Farming AI
              </p>
            </div>
          </NavLink>
          <button onClick={onClose} className="rounded-xl p-1.5 hover:bg-slate-200/50 dark:hover:bg-white/10 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide space-y-1">
          <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Core Modules
          </p>
          {mainNav.map((item) => (
            <SidebarLink key={item.to} item={item} active={location.pathname === item.to} onClick={onClose} />
          ))}
          <p className="px-3 py-1.5 mt-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Intelligence Tools
          </p>
          {toolsNav.map((item) => (
            <SidebarLink key={item.to} item={item} active={location.pathname === item.to} onClick={onClose} />
          ))}
        </nav>
      </div>

      <div className="p-4 space-y-3 border-t border-white/40 dark:border-white/10">
        {/* Active Farm Mini Widget */}
        <div className="rounded-2xl glass-future p-3 border border-brand-500/20 bg-brand-500/5">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Farm Node
            </span>
            <span className="text-[10px] text-brand-500 font-semibold">Active</span>
          </div>
          <p className="text-xs font-bold truncate">{farm?.name || 'Patel Green Fields'}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">{farm?.crop || 'Cotton & Wheat'} • {farm?.area || 12.5} Acres</p>
        </div>

        <NavLink
          to="/"
          className="flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-200/50 dark:hover:bg-white/10"
        >
          <Home className="h-4 w-4 text-brand-500" />
          {t('nav.home')}
        </NavLink>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-white/40 dark:border-white/10 glass-strong shadow-card z-20">
        {content}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed left-0 top-0 z-50 h-full w-72 glass-strong shadow-card border-r border-white/40 dark:border-white/10 lg:hidden"
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
        'relative flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 no-tap',
        active
          ? 'text-brand-700 dark:text-brand-300 shadow-sm'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white',
      )}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-500/20 via-brand-500/10 to-transparent border border-brand-500/30"
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        />
      )}
      <div className={cn('relative p-1 rounded-xl transition-all', active ? 'bg-brand-500/20 text-brand-600 dark:text-brand-400 shadow-glow' : 'text-slate-400')}>
        <Icon className="h-4 w-4" />
      </div>
      <span className="relative font-medium">{item.label}</span>
    </NavLink>
  );
}
