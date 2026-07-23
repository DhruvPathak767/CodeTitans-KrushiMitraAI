import { motion } from 'framer-motion';
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine,
} from 'recharts';
import { Scale, TrendingUp, Warehouse, Truck, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { Card, Badge, SectionHeader, ConfidenceMeter, AIResponsePanel, cn } from '@/components/ui';
import { sellStoreData } from '@/data/mock';

export function SellStore() {
  const { t, lang } = useApp();
  const langSuffix = lang === 'hi' ? '_hi' : lang === 'gu' ? '_gu' : '';
  const reasoningKey = `reasoning${langSuffix}` as 'reasoning' | 'reasoning_hi' | 'reasoning_gu';
  const isStore = sellStoreData.recommendation === 'store';

  // Price projection chart data
  const chartData = [
    { week: 'Now', price: sellStoreData.currentPrice },
    { week: 'W1', price: 1920 },
    { week: 'W2', price: 1980 },
    { week: 'W3', price: 2100 },
    { week: 'W4', price: 2050 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{t('sellstore.title')}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('sellstore.subtitle')}</p>
      </div>

      {/* Crop selector + recommendation banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'relative overflow-hidden rounded-3xl p-6 text-white shadow-card',
          isStore ? 'bg-gradient-to-br from-sky-600 via-sky-500 to-brand-500' : 'bg-gradient-to-br from-amber-600 to-amber-400',
        )}
      >
        <div className="relative z-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="grid place-items-center rounded-2xl bg-white/20 p-4 backdrop-blur-sm">
              <Scale className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-white/80">{t('sellstore.recommendation')}</p>
              <p className="font-display text-3xl font-extrabold">
                {isStore ? t('sellstore.store') : t('sellstore.sell')}
              </p>
              <p className="mt-0.5 text-sm text-white/90">🍅 {sellStoreData.crop} · ₹{sellStoreData.currentPrice}/qtl</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-white/80">{t('common.confidence')}</p>
            <p className="font-display text-4xl font-extrabold">{sellStoreData.confidence}%</p>
          </div>
        </div>
      </motion.div>

      {/* Comparison cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className={cn(!isStore && 'border-brand-500/40 ring-2 ring-brand-500/20')}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-500" />
              <h3 className="font-semibold">{t('sellstore.sell')}</h3>
            </div>
            {!isStore && <Badge variant="success"><CheckCircle2 className="h-3 w-3" /> Recommended</Badge>}
          </div>
          <p className="mt-3 font-display text-3xl font-bold">₹{(sellStoreData.sellNowProfit / 1000).toFixed(0)}K</p>
          <p className="text-xs text-slate-500">{t('sellstore.expected.profit')}</p>
        </Card>
        <Card className={cn(isStore && 'border-sky-500/40 ring-2 ring-sky-500/20')}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-sky-500" />
              <h3 className="font-semibold">{t('sellstore.store')}</h3>
            </div>
            {isStore && <Badge variant="info"><CheckCircle2 className="h-3 w-3" /> Recommended</Badge>}
          </div>
          <p className="mt-3 font-display text-3xl font-bold">₹{(sellStoreData.storeProfit / 1000).toFixed(0)}K</p>
          <p className="text-xs text-slate-500">{t('sellstore.expected.profit')} (2 weeks)</p>
        </Card>
      </div>

      {/* Price projection */}
      <Card>
        <SectionHeader title={t('market.forecast')} subtitle={`₹/quintal · ${sellStoreData.crop}`} />
        <div className="mt-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="projG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" domain={['dataMin - 50', 'dataMax + 50']} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', background: 'rgba(15,23,42,0.9)', color: '#fff', fontSize: 12 }} />
              <ReferenceLine y={sellStoreData.currentPrice} stroke="#22c55e" strokeDasharray="4 4" label={{ value: 'Now', fontSize: 10, fill: '#22c55e' }} />
              <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2.5} fill="url(#projG)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Risk factors */}
      <div className="grid gap-4 sm:grid-cols-3">
        <FactorCard icon={<Warehouse className="h-5 w-5 text-amber-500" />} label={t('sellstore.storage.cost')} value={`₹${sellStoreData.storageCostPerWeek}/week`} />
        <FactorCard icon={<AlertTriangle className="h-5 w-5 text-red-500" />} label={t('sellstore.spoilage')} value={`${sellStoreData.spoilageRate}%/week`} risk />
        <FactorCard icon={<Truck className="h-5 w-5 text-sky-500" />} label={t('sellstore.transport')} value={`₹${sellStoreData.transportCost}`} />
      </div>

      {/* AI Reasoning */}
      <Card>
        <SectionHeader title={t('sellstore.reasoning')} />
        <div className="mt-4">
          <AIResponsePanel
            t={t}
            confidence={sellStoreData.confidence}
            priority="high"
            reason={sellStoreData[reasoningKey]}
            actions={sellStoreData.actions}
            impact={sellStoreData.impact}
            alternative={lang === 'hi' ? '40% अभी बेचें, 60% रखें' : lang === 'gu' ? '40% અત્યારે વેચો, 60% સાચવો' : 'Sell 40% now, store 60% for balance'}
          />
        </div>
      </Card>
    </div>
  );
}

function FactorCard({ icon, label, value, risk }: { icon: React.ReactNode; label: string; value: string; risk?: boolean }) {
  return (
    <Card hover className={risk ? 'border-red-500/20' : ''}>
      <div className="flex items-center gap-2">
        <span className="grid place-items-center rounded-xl bg-slate-100 dark:bg-white/5 p-2">{icon}</span>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
      </div>
      <p className="mt-3 font-display text-xl font-bold">{value}</p>
    </Card>
  );
}
