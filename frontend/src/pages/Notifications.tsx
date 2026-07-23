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
    weather: { icon: Cloud, color: 'text-sky-500 bg-sky-500/15' },
    disease: { icon: AlertCircle, color: 'text-red-500 bg-red-500/15' },
    market: { icon: Store, color: 'text-amber-500 bg-amber-500/15' },
    gov: { icon: Landmark, color: 'text-brand-500 bg-brand-500/15' },
    ai: { icon: Sparkles, color: 'text-sky-400 bg-sky-400/15' },
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
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{t('notif.title')}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{unread} {t('notif.unread')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={markAll} className="btn-ghost text-xs">
            <Check className="h-3.5 w-3.5" /> {t('notif.markAll')}
          </button>
          <button onClick={clearAll} className="btn-ghost text-xs text-red-500">
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-all',
              filter === f
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10',
            )}
          >
            {t(`notif.${f}`)}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-8 w-8" />}
          title={t('notif.empty')}
          desc={lang === 'hi' ? 'नई सूचनाएं यहां दिखेंगी' : lang === 'gu' ? 'નવી સૂચનાઓ અહીં દેખાશે' : 'New notifications will appear here'}
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
                  <Card hover className={cn('cursor-pointer', !n.read && 'border-brand-500/30 bg-brand-500/5')}>
                    <div className="flex items-start gap-3">
                      <div className={cn('grid place-items-center rounded-2xl p-2.5', cfg.color)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold">{n[titleKey]}</h3>
                          {!n.read && <span className="h-2 w-2 rounded-full bg-brand-500" />}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{n.desc}</p>
                        <p className="mt-1 text-[10px] text-slate-400">{n.time}</p>
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
