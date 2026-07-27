import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { TrendingUp, MapPin, Sparkles, ArrowRight, Activity, RefreshCw, Search, Filter, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { useFarm } from '@/context/FarmContext';
import { Card, Badge, SectionHeader, cn } from '@/components/ui';
import { useNavigate } from 'react-router-dom';

interface MarketItem {
  id?: string;
  crop: string;
  market?: string;
  mandi?: string;
  district?: string;
  state?: string;
  price: number;
  unit?: string;
  date?: string;
  change?: number;
  demand?: 'high' | 'medium' | 'low' | string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function Market() {
  const { t, lang } = useApp();
  const { activeFarm } = useFarm();
  const navigate = useNavigate();
  const fmt = (n: number) => n.toLocaleString(lang === 'en' ? 'en-IN' : undefined);

  const [prices, setPrices] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [availableCrops, setAvailableCrops] = useState<string[]>([]);

  const farmCrop = activeFarm?.cropName?.trim();
  const farmDistrict = activeFarm?.address?.district?.trim();
  const farmState = activeFarm?.address?.state?.trim();

  // The first market view must reflect the crop registered on the active farm.
  // A manual crop selection remains intact until the farmer switches farms.
  useEffect(() => {
    if (farmCrop) setSelectedCrop(farmCrop);
  }, [activeFarm?._id, farmCrop]);

  const fetchMarketPrices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: '50' });
      const crop = selectedCrop === 'All' ? farmCrop : selectedCrop;
      if (crop) params.set('crop', crop);
      // Do not silently broaden to state- or India-wide records. A market
      // must match the farmer's registered district when one is available.
      if (farmDistrict) params.set('district', farmDistrict);
      if (farmState) params.set('state', farmState);
      if (searchTerm) params.set('search', searchTerm);
      const url = `${API_BASE_URL}/api/market/prices?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();

      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const mapped: MarketItem[] = json.data.map((item: any, idx: number) => ({
          id: item.id || `m-${idx}`,
          crop: item.crop,
          market: item.market,
          mandi: item.market,
          district: item.district,
          state: item.state,
          price: item.price,
          unit: item.unit || 'Quintal',
          date: item.date,
          change: item.change,
          demand: item.demand,
        }));
        setPrices(mapped);
      } else {
        setPrices([]);
      }
    } catch (err: any) {
      setError(err.message || t('state.error'));
      setPrices([]);
    } finally {
      setLoading(false);
    }
  }, [farmCrop, farmDistrict, farmState, selectedCrop, searchTerm, t]);

  const fetchCrops = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/market/crops`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setAvailableCrops(['All', ...json.data]);
          return;
        }
      }
    } catch {
      setError(t('state.error'));
    }
    setAvailableCrops(['All']);
  }, [t]);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  useEffect(() => {
    fetchMarketPrices();
  }, [fetchMarketPrices]);

  // The backend sorts by newest price first. Using the first result prevents
  // an older, more expensive record from replacing the current local rate.
  const bestMarket = prices[0] ?? null;
  const combined = prices.map((item) => ({ label: item.crop, price: item.price }));

  const getTickerState = () => {
    if (!prices || prices.length === 0) return { label: 'LIVE', color: 'text-brand-500', bg: 'border-brand-500/30' };
    let up = 0, down = 0;
    prices.forEach(p => {
      if (p.change && p.change > 0) up++;
      else if (p.change && p.change < 0) down++;
    });
    if (up > down) return { label: 'BULLISH', color: 'text-amber-500', bg: 'border-amber-500/30' };
    if (down > up) return { label: 'BEARISH', color: 'text-red-500', bg: 'border-red-500/30' };
    return { label: 'STABLE', color: 'text-brand-500', bg: 'border-brand-500/30' };
  };
  const ticker = getTickerState();

  return (
    <div className="space-y-6">
      {/* Top Header & Ticker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text">{t('market.title')}</h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{t('market.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchMarketPrices()}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-2xl glass px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white/20 transition-all"
            title="Refresh APMC Market Rates"
          >
            <RefreshCw className={cn('h-3.5 w-3.5 text-brand-500', loading && 'animate-spin')} />
            Refresh
          </button>
          <div className={cn("inline-flex items-center gap-2 rounded-2xl glass px-4 py-2 border", ticker.bg)}>
            <Activity className={cn("h-4 w-4 animate-pulse", ticker.color)} />
            <span className="text-xs font-bold">APMC Mandi Ticker: <span className={ticker.color}>{ticker.label}</span></span>
          </div>
        </div>
      </div>

      {/* Best Market Highlight Banner with Permanent Animated Produce Image */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-7 text-white shadow-card border border-white/30 group min-h-[220px]"
      >
        <img
          src="/images/market_fresh_produce.png"
          alt="Fresh APMC Mandi Harvest Produce"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-amber-950/40" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/30 border border-amber-400/40 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-300 mb-2 backdrop-blur-md animate-float">
              <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" /> {t('market.best')}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white">
              🌾 {bestMarket?.crop || t('state.noData')}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-200">
              <MapPin className="h-4 w-4 text-amber-400" /> {bestMarket?.mandi || bestMarket?.market || '—'} • {bestMarket ? `₹${fmt(bestMarket.price)}` : '—'}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="font-display text-4xl sm:text-5xl font-black tracking-tight text-brand-400 drop-shadow">
              {bestMarket ? `₹${fmt(bestMarket.price)}` : '—'}
            </p>
            <button
              onClick={() => navigate('/app/sellstore')}
              className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-white/20 hover:bg-white/30 px-5 py-2.5 text-xs font-extrabold backdrop-blur-md transition-all shadow-glow border border-white/30"
            >
              {t('sellstore.title')} Decision Engine <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-6 -bottom-6 opacity-20 text-amber-400">
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
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(15,23,42,0.9)', color: '#fff', fontSize: 12 }} />
              <Area type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={3} fill="url(#wheatG)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 flex gap-6 text-xs font-bold">
          <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-brand-500 shadow-glow" /> {t('market.price')}</span>
        </div>
      </Card>

      {/* APMC Mandi Commodity Table & Controls */}
      <Card hover tilt>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <SectionHeader title={t('market.nearby')} subtitle="Real-time APMC Mandi Rates" />
          
          {/* Controls: Search & Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search Mandi or Crop..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-40 sm:w-48 rounded-xl glass pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>
            
            <div className="flex items-center gap-1.5 rounded-xl glass px-2.5 py-1.5 text-xs font-semibold">
              <Filter className="h-3.5 w-3.5 text-brand-500" />
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="bg-transparent text-slate-800 dark:text-slate-100 focus:outline-none cursor-pointer"
              >
                {availableCrops.map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-white">
                    {c === 'All' ? 'All Crops' : c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-4 overflow-x-auto min-h-[160px]">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
              <span className="text-xs font-semibold">Fetching APMC Market Intelligence...</span>
            </div>
          ) : prices.length === 0 ? (
            <div className="py-12 text-center text-xs font-semibold text-slate-400">
              No APMC mandi prices match your current filter. Try searching for a different crop or district.
            </div>
          ) : (
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
                {prices.map((m, i) => (
                  <motion.tr
                    key={m.id || i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-slate-200/40 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3.5 font-extrabold">
                      🌾 {m.crop}
                    </td>
                    <td className="py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                      {m.mandi || m.market} {m.district ? `(${m.district})` : ''}
                    </td>
                    <td className="py-3.5 text-right font-extrabold tabular-nums font-display">
                      ₹{fmt(m.price)} / {m.unit || 'qtl'}
                    </td>
                    <td className="py-3.5 text-center">
                      <span className={cn('inline-flex items-center gap-1 font-extrabold', (m.change || 0) >= 0 ? 'text-brand-600 dark:text-brand-400' : 'text-red-500')}>
                        {m.change === undefined ? '—' : <><TrendingUp className="h-3.5 w-3.5" />{m.change > 0 ? '+' : ''}{m.change}%</>}
                      </span>
                    </td>
                    <td className="py-3.5 text-center">
                      {m.demand ? <Badge variant={m.demand === 'high' ? 'success' : m.demand === 'medium' ? 'warning' : 'neutral'} pulse>{t(`market.demand.${m.demand}`)}</Badge> : '—'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* AI Market Prediction Card */}
      <Card hover tilt className="border-brand-500/30 bg-gradient-to-br from-brand-500/10 via-slate-900/5 to-amber-500/10">
        <div className="flex items-center gap-3 mb-2">
          <span className="grid place-items-center rounded-2xl bg-brand-500/20 p-2.5 text-brand-500 shadow-glow">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-display text-base font-bold">{t('market.aiforecast.title')}</h3>
            <p className="text-[10px] text-slate-400">{t('market.aiforecast.subtitle')}</p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('market.aiforecast.text')}
        </p>
      </Card>
    </div>
  );
}
