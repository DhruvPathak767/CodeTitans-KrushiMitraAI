import { motion } from 'framer-motion';
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { TrendingUp, TrendingDown, Store, MapPin, Sparkles, ArrowRight, Activity } from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { Card, Badge, SectionHeader, cn } from '@/components/ui';
import { marketPrices, priceTrend, priceForecast, cropIcon } from '@/data/mock';
import { useNavigate } from 'react-router-dom';

export function Market() {
  const { t, lang } = useApp();
  const navigate = useNavigate();
  const fmt = (n: number) => n.toLocaleString(lang === 'en' ? 'en-IN' : undefined);

  const bestMarket = marketPrices.reduce((a, b) => (a.change > b.change ? a : b));
  const combined = [...priceTrend, ...priceForecast];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text">{t('market.title')}</h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{t('market.subtitle')}</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl glass px-4 py-2 border border-amber-500/30">
          <Activity className="h-4 w-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-bold">APMC Mandi Ticker: <span className="text-amber-500">BULLISH</span></span>
        </div>
      </div>

      {/* Best Market Highlight Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-gold-500 to-brand-600 p-7 text-white shadow-card border border-white/30"
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white mb-2 backdrop-blur-md">
              Highest Price Momentum
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight">{cropIcon[bestMarket.crop]} {bestMarket.crop}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-white/90">
              <MapPin className="h-4 w-4" /> {bestMarket.mandi} • ₹{fmt(bestMarket.price)} / Quintal
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="font-display text-4xl sm:text-5xl font-black tracking-tight">+{bestMarket.change}%</p>
            <button
              onClick={() => navigate('/app/sellstore')}
              className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-white/25 px-5 py-2.5 text-xs font-extrabold backdrop-blur-md hover:bg-white/35 transition-all shadow-glow"
            >
              {t('sellstore.title')} Decision Engine <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-6 -bottom-6 opacity-20">
          <TrendingUp className="h-44 w-44" />
        </div>
      </motion.div>

      {/* Commodity Price Trend Area Chart */}
      <Card hover tilt>
        <SectionHeader title={t('market.trends')} subtitle={`${t('market.forecast')} • 6 Month Historical & AI Forecast`} />
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={combined}>
              <defs>
                <linearGradient id="wheatG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="cottonG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="tomatoG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(15,23,42,0.9)', color: '#fff', fontSize: 12 }} />
              <Area type="monotone" dataKey="wheat" stroke="#22c55e" strokeWidth={3} fill="url(#wheatG)" />
              <Area type="monotone" dataKey="cotton" stroke="#3b82f6" strokeWidth={3} fill="url(#cottonG)" />
              <Area type="monotone" dataKey="tomato" stroke="#ef4444" strokeWidth={3} fill="url(#tomatoG)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex gap-6 text-xs font-bold">
          <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-brand-500 shadow-glow" /> Wheat</span>
          <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-sky-500 shadow-glow-sky" /> Cotton</span>
          <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Tomato</span>
        </div>
      </Card>

      {/* APMC Mandi Commodity Table */}
      <Card hover tilt>
        <SectionHeader title={t('market.nearby')} subtitle="Real-time APMC Mandi Rates" />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/20 dark:border-white/10 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">{t('market.crop')}</th>
                <th className="pb-3">{t('market.mandi')}</th>
                <th className="pb-3 text-right">{t('market.price')}</th>
                <th className="pb-3 text-center">{t('common.trend')}</th>
                <th className="pb-3 text-center">{t('common.demand')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {marketPrices.map((m, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-slate-200/40 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="py-3.5 font-extrabold">{cropIcon[m.crop]} {m.crop}</td>
                  <td className="py-3.5 text-slate-600 dark:text-slate-300 font-medium">{m.mandi}</td>
                  <td className="py-3.5 text-right font-extrabold tabular-nums font-display">₹{fmt(m.price)} / qtl</td>
                  <td className="py-3.5 text-center">
                    <span className={cn('inline-flex items-center gap-1 font-extrabold', m.change >= 0 ? 'text-brand-600 dark:text-brand-400' : 'text-red-500')}>
                      {m.change >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                      {m.change >= 0 ? '+' : ''}{m.change}%
                    </span>
                  </td>
                  <td className="py-3.5 text-center">
                    <Badge variant={m.demand === 'high' ? 'success' : m.demand === 'medium' ? 'warning' : 'neutral'} pulse>
                      {t(`market.demand.${m.demand}`)}
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* AI Market Prediction Card */}
      <Card hover tilt className="border-brand-500/30 bg-gradient-to-br from-brand-500/10 via-slate-900/5 to-amber-500/10">
        <div className="flex items-center gap-3 mb-2">
          <span className="grid place-items-center rounded-2xl bg-brand-500/20 p-2.5 text-brand-500 shadow-glow">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-base font-bold">AI Mandi Price Forecast</h3>
            <p className="text-[10px] text-slate-400">92% Historical Predictive Accuracy</p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {lang === 'hi'
            ? 'टमाटर भाव 3 सप्ताह में ₹2,100 तक पहुंच सकते हैं (+14%)। अभी 40% बेचें, 60% रखें। कपास भी मजबूत रुझान में है।'
            : lang === 'gu'
            ? 'ટમાટર ભાવ 3 અઠવાડિયામાં ₹2,100 સુધી (+14%). અત્યારે 40% વેચો, 60% સાચવો. કપાસ પણ મજબૂત.'
            : 'Tomato prices projected to reach ₹2,100/qtl in 3 weeks (+14%). Recommended strategy: Sell 40% now for liquid cashflow, store 60% for peak pricing window.'}
        </p>
      </Card>
    </div>
  );
}
