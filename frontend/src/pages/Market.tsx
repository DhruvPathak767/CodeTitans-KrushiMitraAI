import { motion } from 'framer-motion';
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { TrendingUp, TrendingDown, Store, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { Card, Badge, SectionHeader, cn } from '@/components/ui';
import { marketPrices, priceTrend, priceForecast, cropIcon } from '@/data/mock';
import { useNavigate } from 'react-router-dom';

export function Market() {
  const { t, lang } = useApp();
  const navigate = useNavigate();
  const fmt = (n: number) => n.toLocaleString(lang === 'en' ? 'en-IN' : undefined);

  const bestMarket = marketPrices.reduce((a, b) => (a.change > b.change ? a : b));

  // Combined trend + forecast
  const combined = [...priceTrend, ...priceForecast];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{t('market.title')}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('market.subtitle')}</p>
      </div>

      {/* Best market highlight */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-amber-400 to-brand-500 p-6 text-white shadow-card"
      >
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-white/80">{t('market.best')}</p>
            <p className="mt-1 font-display text-3xl font-extrabold">{cropIcon[bestMarket.crop]} {bestMarket.crop}</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-white/90">
              <MapPin className="h-4 w-4" /> {bestMarket.mandi} · ₹{fmt(bestMarket.price)}/qtl
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-4xl font-extrabold">+{bestMarket.change}%</p>
            <button
              onClick={() => navigate('/app/sellstore')}
              className="mt-2 inline-flex items-center gap-1 rounded-xl bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm hover:bg-white/30"
            >
              {t('sellstore.title')} <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-4 -top-4 opacity-20">
          <TrendingUp className="h-32 w-32" />
        </div>
      </motion.div>

      {/* Price trend chart */}
      <Card>
        <SectionHeader title={t('market.trends')} subtitle={`${t('market.forecast')} · 6 months`} />
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={combined}>
              <defs>
                <linearGradient id="wheatG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cottonG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="tomatoG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', background: 'rgba(15,23,42,0.9)', color: '#fff', fontSize: 12 }} />
              <Area type="monotone" dataKey="wheat" stroke="#22c55e" strokeWidth={2} fill="url(#wheatG)" />
              <Area type="monotone" dataKey="cotton" stroke="#3b82f6" strokeWidth={2} fill="url(#cottonG)" />
              <Area type="monotone" dataKey="tomato" stroke="#ef4444" strokeWidth={2} fill="url(#tomatoG)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand-500" /> Wheat</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-sky-500" /> Cotton</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-500" /> Tomato</span>
        </div>
      </Card>

      {/* Nearby mandis */}
      <Card>
        <SectionHeader title={t('market.nearby')} />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-left text-xs text-slate-500 dark:text-slate-400">
                <th className="pb-2 font-medium">{t('market.crop')}</th>
                <th className="pb-2 font-medium">{t('market.mandi')}</th>
                <th className="pb-2 text-right font-medium">{t('market.price')}</th>
                <th className="pb-2 text-center font-medium">{t('common.trend')}</th>
                <th className="pb-2 text-center font-medium">{t('common.demand')}</th>
              </tr>
            </thead>
            <tbody>
              {marketPrices.map((m, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-slate-100 dark:border-white/5"
                >
                  <td className="py-3 font-medium">{cropIcon[m.crop]} {m.crop}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-400">{m.mandi}</td>
                  <td className="py-3 text-right font-semibold tabular-nums">₹{fmt(m.price)}</td>
                  <td className="py-3 text-center">
                    <span className={cn('inline-flex items-center gap-1 text-xs font-bold', m.change >= 0 ? 'text-brand-600 dark:text-brand-400' : 'text-red-500')}>
                      {m.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {m.change >= 0 ? '+' : ''}{m.change}%
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <Badge variant={m.demand === 'high' ? 'success' : m.demand === 'medium' ? 'warning' : 'neutral'}>
                      {t(`market.demand.${m.demand}`)}
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* AI insight */}
      <Card className="border-brand-500/20 bg-gradient-to-br from-brand-500/5 to-amber-500/5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-500" />
          <h3 className="font-display text-sm font-bold">AI {t('common.forecast')}</h3>
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {lang === 'hi'
            ? 'टमाटर भाव 3 सप्ताह में ₹2,100 तक पहुंच सकते हैं (+14%)। अभी 40% बेचें, 60% रखें। कपास भी मजबूत रुझान में है।'
            : lang === 'gu'
            ? 'ટમાટર ભાવ 3 અઠવાડિયામાં ₹2,100 સુધી (+14%). અત્યારે 40% વેચો, 60% સાચવો. કપાસ પણ મજબૂત.'
            : 'Tomato prices may reach ₹2,100 in 3 weeks (+14%). Sell 40% now, store 60%. Cotton trend also strong.'}
        </p>
      </Card>
    </div>
  );
}
