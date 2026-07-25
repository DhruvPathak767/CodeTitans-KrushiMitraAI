import { useNavigate } from 'react-router-dom';
import { Bell, CloudSun, MapPin } from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { useWeather } from '@/context/WeatherContext';
import { LanguageSwitcher, ThemeToggle } from '@/components/Controls';
import { cn } from '@/lib/cn';

export function TopBar() {
  const { t, user } = useApp();
  const { weatherData } = useWeather();
  const navigate = useNavigate();

  const currentWeather = weatherData?.current;
  const weatherLocation = weatherData?.location;

  const tempDisplay = currentWeather ? `${currentWeather.temperature}°C` : '30.3°C';
  const conditionDisplay = currentWeather?.weatherCondition || 'Patchy Rain Nearby';
  const locationDisplay = weatherLocation
    ? `${weatherLocation.weatherLocationName}, Gujarat, India`
    : 'vadodara, Vadodara, Gujarat, India';

  const userInitial = user?.name?.charAt(0).toUpperCase() || 'P';
  const userName = user?.name || 'Parth Pathak';

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex items-center justify-between',
        'h-16 px-4 sm:px-6 lg:px-8',
        'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-colors',
      )}
      role="banner"
    >
      {/* Left Area: Live Weather Pill with Location */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div
          onClick={() => navigate('/app/weather')}
          className="flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-3.5 py-1.5 border border-emerald-200/60 dark:border-emerald-800/60 cursor-pointer hover:border-emerald-500 transition-all text-xs"
        >
          <CloudSun className="h-4 w-4 text-amber-500 animate-pulse shrink-0" />
          <span className="font-bold text-slate-800 dark:text-slate-100">{tempDisplay}</span>
          <span className="hidden sm:inline font-medium text-emerald-700 dark:text-emerald-400 truncate">
            {conditionDisplay}
          </span>
          <span className="hidden md:flex items-center gap-1 border-l border-emerald-200 dark:border-emerald-800 pl-2 text-slate-500 dark:text-slate-400 font-medium truncate">
            <MapPin className="h-3 w-3 text-emerald-600" />
            <span className="truncate">{locationDisplay}</span>
          </span>
        </div>
      </div>

      {/* Right Area: Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        <ThemeToggle />
        <LanguageSwitcher />

        {/* Notifications Bell with Badge */}
        <button
          onClick={() => navigate('/app/notifications')}
          className={cn(
            'relative grid place-items-center rounded-xl',
            'h-10 w-10 text-slate-600 dark:text-slate-300',
            'hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500',
          )}
          aria-label={t('nav.notifications')}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white grid place-items-center">
            2
          </span>
        </button>

        {/* User Profile Pill */}
        <div
          onClick={() => navigate('/app/profile')}
          className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 p-1 pr-3 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-600 text-white font-bold text-xs">
            {userInitial}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
              {userName}
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold leading-none">
              {t('topbar.myProfile')}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
