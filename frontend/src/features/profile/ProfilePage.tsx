import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Globe, LogOut, Bell, FileBarChart, MapPin, ChevronRight, MessageSquare, HelpCircle,
} from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { useFarm } from '@/context/FarmContext';
import { LanguageSwitcher, ThemeToggle } from '@/components/Controls';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

/**
 * Profile page — consolidates user info, settings, reports, and help.
 *
 * Absorbs functionality from:
 * - Settings (language, notifications)
 * - Reports page
 * - Chatbot (accessible from Help)
 *
 * All text uses t() keys.
 */
export function ProfilePage() {
  const { t, user, logout } = useApp();
  const { activeFarm } = useFarm();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const menuItems: MenuItem[] = [
    {
      icon: <MapPin className="h-5 w-5" />,
      label: t('profile.manageFarms'),
      onClick: () => navigate('/app/farm'),
    },
    {
      icon: <FileBarChart className="h-5 w-5" />,
      label: t('profile.reports'),
      onClick: () => navigate('/app/reports'),
    },
    {
      icon: <Bell className="h-5 w-5" />,
      label: t('profile.notifications'),
      onClick: () => navigate('/app/notifications'),
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: t('profile.aiHelp'),
      onClick: () => navigate('/app/chatbot'),
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: t('profile.schemes'),
      onClick: () => navigate('/app/schemes'),
    },
  ];

  return (
    <div className="space-y-6 pb-4">
      {/* User Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-100 text-primary-700 shrink-0">
            <User className="h-8 w-8" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-slate-800 truncate">
              {user?.name ?? t('common.farmer')}
            </h1>
            <p className="text-base text-slate-500 truncate">{user?.email}</p>
            {activeFarm && (
              <p className="text-sm text-primary-600 font-medium mt-0.5">
                {activeFarm.farmName} · {activeFarm.cropName}
              </p>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Settings: Language & Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-slate-500" />
              <span className="text-lg font-semibold text-slate-700 dark:text-slate-200">{t('profile.language')}</span>
            </div>
            <LanguageSwitcher />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-slate-700 dark:text-slate-200">{t('profile.theme')}</span>
            </div>
            <ThemeToggle />
          </div>
        </Card>
      </div>

      {/* Menu Items */}
      <Card padding="none">
        <nav>
          <ul role="list" className="divide-y divide-slate-100">
            {menuItems.map((item, idx) => (
              <li key={idx}>
                <button
                  onClick={item.onClick}
                  className={cn(
                    'flex w-full items-center justify-between px-5 py-4',
                    'text-left text-lg font-medium text-slate-700',
                    'hover:bg-slate-50 transition-colors',
                    'min-h-[56px]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-slate-400">{item.icon}</span>
                    {item.label}
                  </span>
                  <ChevronRight className="h-5 w-5 text-slate-300" />
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </Card>

      {/* Logout */}
      <Button
        variant="danger"
        size="md"
        fullWidth
        icon={<LogOut className="h-5 w-5" />}
        onClick={handleLogout}
      >
        {t('common.logout')}
      </Button>
    </div>
  );
}
