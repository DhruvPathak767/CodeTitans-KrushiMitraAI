import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, Search, LogOut, ChevronDown, Sparkles, CloudSun, MapPin } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { LanguageSwitcher, ThemeToggle } from '@/components/Controls';
import { FutureBackground } from '@/components/FutureBackground';
import { CursorSpotlight } from '@/components/CursorSpotlight';
import { useApp } from '@/i18n/AppContext';
import { useWeather } from '@/context/WeatherContext';
import { notifications as notifData } from '@/data/mock';

export function AppLayout() {
  const { t, user, logout } = useApp();
  const { weatherData, loading: weatherLoading } = useWeather();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const unread = notifData.filter((n) => !n.read).length;

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const currentWeather = weatherData?.current;
  const weatherLocation = weatherData?.location;

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

            {/* Live Weather Pill Connected to Single Source of Truth Context */}
            <div
              onClick={() => navigate('/app/weather')}
              className="hidden xl:flex items-center gap-2 rounded-2xl bg-brand-500/10 px-3 py-1.5 border border-brand-500/20 cursor-pointer hover:border-emerald-500 transition-all"
            >
              <CloudSun className="h-4 w-4 text-amber-500 animate-pulse" />
              {currentWeather && weatherLocation ? (
                <span className="text-xs font-bold font-display flex items-center gap-1.5">
                  <span>{currentWeather.temperature}°C</span>
                  <span className="text-[11px] font-medium capitalize text-emerald-600 dark:text-emerald-400">
                    ({currentWeather.weatherCondition})
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 border-l border-slate-300 dark:border-white/20 pl-1.5 flex items-center gap-0.5">
                    <MapPin className="h-3 w-3 text-emerald-500" /> {weatherLocation.weatherLocationName}
                  </span>
                </span>
              ) : (
                <span className="text-xs font-semibold text-slate-400">
                  {weatherLoading ? 'Loading weather...' : 'Active Farm Weather'}
                </span>
              )}
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
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 z-50 mt-2 w-56 rounded-2xl glass-strong border border-white/20 p-2 shadow-glow"
                    >
                      <div className="border-b border-white/10 p-3">
                        <p className="text-xs font-bold">{user?.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-xl p-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors mt-1"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Route Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
