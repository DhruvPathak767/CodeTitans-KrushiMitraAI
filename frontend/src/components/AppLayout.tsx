import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, Search, LogOut, User, ChevronDown } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { LanguageSwitcher, ThemeToggle } from '@/components/Controls';
import { useApp } from '@/i18n/AppContext';
import { notifications as notifData } from '@/data/mock';

export function AppLayout() {
  const { t, user, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const unread = notifData.filter((n) => !n.read).length;

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200/60 dark:border-white/5 px-4 glass">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-white/10 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden items-center gap-2 rounded-2xl bg-slate-100/70 dark:bg-white/5 px-3 py-2 md:flex">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                placeholder={t('common.search')}
                className="w-40 bg-transparent text-sm outline-none placeholder:text-slate-400 lg:w-56"
              />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LanguageSwitcher />
            <NavLink to="/app/notifications" className="relative rounded-2xl p-2.5 hover:bg-slate-100 dark:hover:bg-white/10">
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </NavLink>

            <div className="relative ml-1">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 rounded-2xl p-1.5 pr-2 hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-sky-500 text-sm font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase() ?? 'F'}
                </div>
                <span className="hidden text-sm font-medium sm:inline">{user?.name ?? 'Farmer'}</span>
                <ChevronDown className="hidden h-4 w-4 sm:inline" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-2xl glass-strong shadow-card"
                    >
                      <div className="border-b border-slate-200/60 dark:border-white/5 px-4 py-3">
                        <p className="text-sm font-semibold">{user?.name ?? 'Farmer'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email ?? 'demo@krishimitra.ai'}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10"
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

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
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
