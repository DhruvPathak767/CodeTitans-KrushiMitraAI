import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine,
} from 'recharts';
import { Scale, TrendingUp, Warehouse, Truck, AlertTriangle, CheckCircle2, Sparkles, Activity, RefreshCw, Loader2, Calendar } from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { useFarm } from '@/context/FarmContext';
import { getAccessToken } from '@/api/auth';
import { Card, Badge, SectionHeader, AIResponsePanel, cn } from '@/components/ui';

interface RecommendationResponse {
  id?: string;
  crop: string;
  quantity: number;
  marketPrice: number;
  predictedPrice: number;
  decision: string;
  estimatedProfit: string;
  riskLevel: string;
  confidence: number;
  reason: string;
  recommendationSummary: string;
  storageAvailable?: boolean;
  storageCost?: number;
}

interface PricePredictionData {
  today: number;
  after3days: number;
  after7days: number;
  after15days: number;
  trend: string;
  confidence: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function SellStore() {
  const { t, lang } = useApp();
  const { activeFarm } = useFarm();

  const [loading, setLoading] = useState<boolean>(false);
  const [storageAvailable] = useState<boolean>(true);
  const [storageCost] = useState<number>(0);
  const [recData, setRecData] = useState<RecommendationResponse | null>(null);
  const [predData, setPredData] = useState<PricePredictionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendation = useCallback(async () => {
    if (!activeFarm?._id || !activeFarm.cropName) {
      setError(t('state.noData'));
      setRecData(null);
      setPredData(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept-Language': lang,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };
      const district = activeFarm.address?.district;
      const market = district ? `${district} APMC` : undefined;
      const [recRes, predRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/recommendation/generate`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            farmId: activeFarm._id,
            storageAvailable,
            storageCost,
          }),
        }),
        fetch(`${API_BASE_URL}/api/price-prediction`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            farmId: activeFarm._id,
            crop: activeFarm.cropName,
            market,
            district,
          }),
        }),
      ]);

      const [recJson, predJson] = await Promise.all([recRes.json(), predRes.json()]);
      if (!recRes.ok) throw new Error(recJson.message || t('state.error'));
      if (!predRes.ok) throw new Error(predJson.message || t('state.error'));
      if (!recJson.success || !recJson.data || !predJson.success || !predJson.data) {
        throw new Error(t('state.noData'));
      }
      setRecData(recJson.data);
      setPredData(predJson.data);
    } catch (err: any) {
      setRecData(null);
      setPredData(null);
      setError(err.message || t('state.error'));
    } finally {
      setLoading(false);
    }
  }, [activeFarm, lang, storageAvailable, storageCost, t]);

  useEffect(() => {
    fetchRecommendation();
  }, [fetchRecommendation]);

  const currentCrop = recData?.crop;
  const currentRate = predData?.today ?? recData?.marketPrice;
  const predictedRate = predData?.after15days ?? recData?.predictedPrice;
  const decision = recData?.decision;
  const isStore = decision?.includes('STORE') ?? false;
  const confidence = recData?.confidence;
  const sellNowProfit = currentRate !== undefined && recData ? currentRate * recData.quantity : undefined;
  const storeProfit = predictedRate !== undefined && recData ? predictedRate * recData.quantity - (storageCost * 4) : undefined;
  const chartData = predData ? [
    { week: 'Today', price: predData.today },
    { week: '3 Days', price: predData.after3days },
    { week: '7 Days', price: predData.after7days },
    { week: '15 Days', price: predData.after15days },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header & Generate Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text">{t('sellstore.title')}</h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{t('sellstore.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchRecommendation()}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-2xl glass px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-white/20 transition-all shadow-glow"
          >
            <RefreshCw className={cn('h-3.5 w-3.5 text-brand-500', loading && 'animate-spin')} />
            {loading ? t('state.loading') : t('market.forecast')}
          </button>
          <div className="inline-flex items-center gap-2 rounded-2xl glass px-4 py-2 border border-sky-500/30">
            <Activity className="h-4 w-4 text-sky-500 animate-pulse" />
            <span className="text-xs font-bold">{t('market.aiforecast.title')}</span>
          </div>
        </div>
      </div>

      {/* Recommendation Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'relative overflow-hidden rounded-3xl p-7 text-white shadow-card border border-white/30',
          isStore ? 'bg-gradient-to-br from-sky-600 via-sky-500 to-brand-500' : 'bg-gradient-to-br from-amber-600 via-gold-500 to-amber-400',
        )}
      >
        <div className="relative z-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-5">
            <div className="grid place-items-center rounded-2xl bg-white/20 p-4 backdrop-blur-md shadow-glow">
              {loading ? <Loader2 className="h-9 w-9 animate-spin text-white" /> : <Scale className="h-9 w-9" />}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-extrabold text-white/80">{t('sellstore.recommendation')}</p>
              <p className="font-display text-3xl sm:text-4xl font-black tracking-tight">
                {decision === 'STORE'
                  ? t('sellstore.store')
                  : decision === 'SELL_NOW'
                  ? t('sellstore.sell')
                  : decision?.replace(/_/g, ' ') || t('state.noData')}
              </p>
              <p className="mt-1 text-xs sm:text-sm font-bold text-white/90">
                🌾 {currentCrop || t('state.noData')} • ₹{currentRate?.toLocaleString() || '—'}
              </p>
            </div>
          </div>
          <div className="text-center bg-white/20 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/20">
            <p className="text-[10px] uppercase tracking-widest font-black text-white/80">{t('common.confidence')}</p>
            <p className="font-display text-4xl font-black">{confidence === undefined ? '—' : `${confidence}%`}</p>
          </div>
        </div>
      </motion.div>

      {/* 4 Horizon Price Prediction Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card hover tilt className="p-4 border-slate-500/20">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{t('common.today')}</span>
            <Calendar className="h-3.5 w-3.5 text-brand-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-black text-slate-800 dark:text-slate-100">
            {currentRate === undefined ? '—' : `₹${currentRate.toLocaleString()}`}
          </p>
            <span className="text-[10px] font-bold text-slate-400">{t('market.price')}</span>
        </Card>

        <Card hover tilt className="p-4 border-slate-500/20">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{t('market.forecast')} (3)</span>
            <TrendingUp className="h-3.5 w-3.5 text-sky-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-black text-sky-500">
            {predData ? `₹${predData.after3days.toLocaleString()}` : '—'}
          </p>
            <span className="text-[10px] font-bold text-sky-400">{t('sellstore.horizon')}</span>
        </Card>

        <Card hover tilt className="p-4 border-slate-500/20">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{t('market.forecast')} (7)</span>
            <TrendingUp className="h-3.5 w-3.5 text-brand-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-black text-brand-500">
            {predData ? `₹${predData.after7days.toLocaleString()}` : '—'}
          </p>
            <span className="text-[10px] font-bold text-brand-400">{t('sellstore.horizon')}</span>
        </Card>

        <Card hover tilt className="p-4 border-slate-500/20">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>{t('market.forecast')} (15)</span>
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-black text-amber-500">
            {predictedRate === undefined ? '—' : `₹${predictedRate.toLocaleString()}`}
          </p>
            <span className="text-[10px] font-bold text-amber-400">{predData?.trend || '—'}</span>
        </Card>
      </div>

      {/* Side by Side Comparative Financial Profit Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card hover tilt className={cn('p-6', !isStore && 'border-brand-500/50 ring-2 ring-brand-500/30')}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-brand-500/20 text-brand-500 shadow-glow">
                <TrendingUp className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg font-bold">{t('sellstore.sell')}</h3>
            </div>
            {!isStore && <Badge variant="success" pulse><CheckCircle2 className="h-3.5 w-3.5" /> Recommended</Badge>}
          </div>
          <p className="mt-4 font-display text-4xl font-black gradient-text">{sellNowProfit === undefined ? '—' : `₹${sellNowProfit.toLocaleString()}`}</p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">{t('sellstore.expected.profit')}</p>
        </Card>

        <Card hover tilt className={cn('p-6', isStore && 'border-sky-500/50 ring-2 ring-sky-500/30')}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-500 shadow-glow-sky">
                <Warehouse className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg font-bold">{t('sellstore.store')}</h3>
            </div>
            {isStore && <Badge variant="info" pulse><CheckCircle2 className="h-3.5 w-3.5" /> Recommended</Badge>}
          </div>
          <p className="mt-4 font-display text-4xl font-black gradient-text-gold">{storeProfit === undefined ? '—' : `₹${storeProfit.toLocaleString()}`}</p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">{t('sellstore.expected.profit')}</p>
        </Card>
      </div>

      {/* Commodity Price Forecast Curve */}
      <Card hover tilt>
        <SectionHeader title={t('market.forecast')} subtitle={currentCrop || t('state.noData')} />
        <div className="mt-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="projG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" domain={['dataMin - 100', 'dataMax + 100']} />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(15,23,42,0.9)', color: '#fff', fontSize: 12 }} />
              {currentRate !== undefined && <ReferenceLine y={currentRate} stroke="#22c55e" strokeDasharray="4 4" />}
              <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} fill="url(#projG)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Financial Risk & Overhead Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <FactorCard icon={<Warehouse className="h-5 w-5 text-amber-500" />} label={t('sellstore.storage.cost')} value={recData?.storageCost === undefined ? '—' : `₹${recData.storageCost}`} />
        <FactorCard icon={<AlertTriangle className="h-5 w-5 text-red-500" />} label={t('sellstore.spoilage')} value={recData?.riskLevel || '—'} risk={recData?.riskLevel === 'HIGH' || recData?.riskLevel === 'CRITICAL'} />
        <FactorCard icon={<Truck className="h-5 w-5 text-sky-500" />} label={t('sellstore.transport')} value={recData?.storageAvailable ? '✓' : '—'} />
      </div>

      {/* AI Financial Reasoning & Summary */}
      <Card hover tilt>
        <SectionHeader title={t('sellstore.reasoning')} subtitle={recData?.recommendationSummary || error || t('state.noData')} />
        <div className="mt-4">
          <AIResponsePanel
            t={t}
            confidence={confidence || 0}
            priority="high"
            reason={recData?.reason || error || t('state.noData')}
            actions={recData?.recommendationSummary ? [recData.recommendationSummary] : []}
            impact={recData?.estimatedProfit || '—'}
            alternative={undefined}
          />
        </div>
      </Card>
    </div>
  );
}

function FactorCard({ icon, label, value, risk }: { icon: React.ReactNode; label: string; value: string; risk?: boolean }) {
  return (
    <Card hover tilt className={risk ? 'border-red-500/30 bg-red-500/5' : ''}>
      <div className="flex items-center gap-2.5">
        <span className="grid place-items-center rounded-xl glass p-2">{icon}</span>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
      </div>
      <p className="mt-3 font-display text-xl font-extrabold">{value}</p>
    </Card>
  );
}
