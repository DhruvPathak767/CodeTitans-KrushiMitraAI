import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, X, AlertCircle, CloudRain, ShieldAlert, Thermometer, Sparkles, Sprout, Store, Landmark } from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { getNotificationsApi, markNotificationReadApi, markAllNotificationsReadApi, deleteNotificationApi, NotificationItem } from '@/api/notifications';

export function NotificationBell() {
  const { t } = useApp();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const data = await getNotificationsApi();
      setItems(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.warn('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 45000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    await markAllNotificationsReadApi();
  };

  const handleMarkOneRead = async (id: string) => {
    setItems((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
    await markNotificationReadApi(id);
  };

  const handleDeleteOne = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setItems((prev) => prev.filter((n) => n._id !== id));
    await deleteNotificationApi(id);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'rain': return <CloudRain className="h-4 w-4 text-sky-400" />;
      case 'disease': return <ShieldAlert className="h-4 w-4 text-red-400" />;
      case 'heat': return <Thermometer className="h-4 w-4 text-amber-400" />;
      case 'harvest': return <Sprout className="h-4 w-4 text-emerald-400" />;
      case 'market': return <Store className="h-4 w-4 text-amber-400" />;
      case 'scheme': return <Landmark className="h-4 w-4 text-purple-400" />;
      default: return <Sparkles className="h-4 w-4 text-brand-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative grid place-items-center rounded-2xl glass p-2.5 text-slate-700 dark:text-slate-200 hover:border-brand-500/40 transition-all shadow-sm"
        title={t('notif.title')}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white shadow-glow animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-3xl glass-strong border border-slate-200/80 dark:border-white/10 shadow-card p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-sm font-bold">{t('notif.title')}</h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-brand-500/20 px-2 py-0.5 text-[10px] font-extrabold text-brand-500">
                    {unreadCount} {t('notif.unread')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] font-bold text-brand-500 hover:underline flex items-center gap-1"
                  >
                    <Check className="h-3 w-3" /> {t('notif.markAll')}
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-3 max-h-80 overflow-y-auto space-y-2.5 pr-1 scrollbar-hide">
              {items.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 font-medium">
                  {t('notif.empty')}
                </div>
              ) : (
                items.map((n) => (
                  <div
                    key={n._id}
                    onClick={() => handleMarkOneRead(n._id)}
                    className={`group relative flex items-start gap-3 rounded-2xl p-3 text-xs transition-all cursor-pointer border ${
                      !n.read
                        ? 'bg-brand-500/10 border-brand-500/30'
                        : 'glass border-slate-200/40 dark:border-white/5 opacity-80'
                    }`}
                  >
                    <div className="grid place-items-center rounded-xl bg-slate-800/40 p-2 shrink-0 mt-0.5">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 pr-4">
                      <p className="font-bold text-slate-900 dark:text-white leading-snug">{n.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-300 mt-0.5 line-clamp-2">{n.message}</p>
                      <span className="text-[9px] font-mono text-slate-400 mt-1 block">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteOne(e, n._id)}
                      className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-400 transition-opacity"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
