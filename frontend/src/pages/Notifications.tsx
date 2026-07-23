import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cloud, AlertCircle, Store, Landmark, Sparkles, Bell, Check, Trash2,
} from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { Card, Badge, EmptyState, cn } from '@/components/ui';
import { notifications as initial } from '@/data/mock';

type Filter = 'all' | 'weather' | 'disease' | 'market' | 'gov' | 'ai';

export function Notifications() {
  const { t, lang } = useApp();
  const langSuffix = lang === 'hi' ? '_hi' : lang === 'gu' ? '_gu' : '';
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<Filter>('all');

  const titleKey = `title${langSuffix}` as 'title' | 'title_hi' | 'title_gu';
  const filtered = filter === 'all' ? items : items.filter((n) => n.type === filter);
  const unread = items.filter((n) => !n.read).length;

  const typeConfig: Record<string, { icon: typeof Cloud; color: string }> = {
    weather: { icon: Cloud, color: 'text-sky-500 bg-sky-500/20 shadow-glow-sky' },
    disease: { icon: AlertCircle, color: 'text-red-500 bg-red-500/20 shadow-glow' },
    market: { icon: Store, color: 'text-amber-500 bg-amber-500/20 shadow-glow-gold' },
    gov: { icon: Landmark, color: 'text-brand-500 bg-brand-500/20 shadow-glow' },
    ai: { icon: Sparkles, color: 'text-sky-400 bg-sky-400/20 shadow-glow-sky' },
  };

  const filters: Filter[] = ['all', 'weather', 'disease', 'market', 'gov', 'ai'];

  function markAll() {
    setItems((p) => p.map((n) => ({ ...n, read: true })));
  }
  function markOne(id: number) {
    setItems((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }
  function clearAll() {
    setItems([]);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text">{t('notif.title')}</h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{unread} {t('notif.unread')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={markAll} className="btn-glass text-xs border-brand-500/30">
            <Check className="h-3.5 w-3.5 text-brand-500" /> {t('notif.markAll')}
          </button>
          <button onClick={clearAll} className="btn-ghost text-xs text-red-500 hover:bg-red-500/10">
            <Trash2 className="h-3.5 w-3.5" /> Clear All
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'shrink-0 rounded-2xl px-4 py-2 text-xs font-bold transition-all shadow-sm',
              filter === f
                ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-glow'
                : 'glass text-slate-600 dark:text-slate-300 hover:border-brand-500/40',
            )}
          >
            {t(`notif.${f}`)}
          </button>
        ))}
      </div>

      {/* Notifications Stream */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-8 w-8" />}
          title={t('notif.empty')}
          desc={lang === 'hi' ? 'नई सूचनाएं यहां दिखेंगी' : lang === 'gu' ? 'નવી સૂચનાઓ અહીં દેખાશે' : 'New telemetry alerts will appear here'}
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((n, i) => {
              const cfg = typeConfig[n.type];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 300 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => markOne(n.id)}
                >
                  <Card hover tilt className={cn('cursor-pointer', !n.read && 'border-brand-500/40 bg-brand-500/10')}>
                    <div className="flex items-start gap-4">
                      <div className={cn('grid place-items-center rounded-2xl p-3', cfg.color)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs sm:text-sm font-bold">{n[titleKey]}</h3>
                          {!n.read && <span className="h-2 w-2 rounded-full bg-brand-500 animate-ping" />}
                        </div>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{n.desc}</p>
                        <p className="mt-1.5 text-[10px] text-slate-400 font-mono">{n.time}</p>
                      </div>
                      <Badge variant="neutral">{t(`notif.${n.type}`)}</Badge>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
