import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, Search, LogOut, ChevronDown, Sparkles, CloudSun } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { LanguageSwitcher, ThemeToggle } from '@/components/Controls';
import { FutureBackground } from '@/components/FutureBackground';
import { CursorSpotlight } from '@/components/CursorSpotlight';
import { useApp } from '@/i18n/AppContext';
import { notifications as notifData, weatherNow } from '@/data/mock';

export function AppLayout() {
  const { t, user, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const unread = notifData.filter((n) => !n.read).length;

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Multi-Layer Future Background & Spotlight */}
      <FutureBackground />
      <CursorSpotlight />

      {/* Main Sidebar Component */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden z-10">
        {/* Sticky Future Glass Navbar */}
        <header className="z-30 flex h-16 items-center justify-between gap-3 border-b border-white/40 dark:border-white/10 px-4 sm:px-6 glass-strong shadow-card">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 hover:bg-slate-200/50 dark:hover:bg-white/10 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Futuristic Command Search Bar */}
            <div className="hidden items-center gap-2 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-2 md:flex shadow-inner">
              <Search className="h-4 w-4 text-brand-500" />
              <input
                placeholder={t('common.search') || 'Search AI advisory, crops, mandi prices...'}
                className="w-48 bg-transparent text-xs outline-none placeholder:text-slate-400 lg:w-64"
              />
              <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded-lg bg-slate-200/60 dark:bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                ⌘K
              </kbd>
            </div>

            {/* Quick Live Weather Pill */}
            <div className="hidden xl:flex items-center gap-2 rounded-2xl bg-brand-500/10 px-3 py-1.5 border border-brand-500/20">
              <CloudSun className="h-4 w-4 text-amber-500 animate-pulse" />
              <span className="text-xs font-bold font-display">{weatherNow.temp}°C {weatherNow.condition}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">| Rajkot</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />

            {/* Notifications Button */}
            <NavLink
              to="/app/notifications"
              className="relative rounded-2xl p-2.5 hover:bg-slate-200/50 dark:hover:bg-white/10 transition-colors"
            >
              <Bell className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-glow">
                  {unread}
                </span>
              )}
            </NavLink>

            {/* Profile Dropdown */}
            <div className="relative ml-1">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2.5 rounded-2xl p-1.5 pr-3 glass hover:border-brand-500/40 transition-all"
              >
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-sky-500 text-sm font-extrabold text-white shadow-glow">
                  {user?.name?.charAt(0).toUpperCase() ?? 'F'}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-bold leading-tight">{user?.name ?? 'Farmer'}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{user?.role ?? 'Farmer'}</p>
                </div>
                <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      className="absolute right-0 top-13 z-50 w-56 overflow-hidden rounded-3xl glass-strong shadow-card border border-white/40 dark:border-white/10 p-1"
                    >
                      <div className="border-b border-slate-200/60 dark:border-white/5 px-4 py-3 bg-brand-500/5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 mb-1">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>Active AI Session</span>
                        </div>
                        <p className="text-sm font-extrabold">{user?.name ?? 'Farmer'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email ?? ''}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-2xl px-4 py-3 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors mt-1"
                      >
                        <LogOut className="h-4 w-4" />
                        {t('common.logout')}
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
