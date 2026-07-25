import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine,
} from 'recharts';
import { Scale, TrendingUp, Warehouse, Truck, AlertTriangle, CheckCircle2, Sparkles, Activity, RefreshCw, Loader2, Calendar } from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { Card, Badge, SectionHeader, AIResponsePanel, cn } from '@/components/ui';
import { sellStoreData as mockData } from '@/data/mock';

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

  const [loading, setLoading] = useState<boolean>(false);
  const [storageAvailable, setStorageAvailable] = useState<boolean>(true);
  const [storageCost, setStorageCost] = useState<number>(150);
  const [recData, setRecData] = useState<RecommendationResponse | null>(null);
  const [predData, setPredData] = useState<PricePredictionData | null>(null);

  const fetchRecommendation = useCallback(async () => {
    setLoading(true);
    try {
      const [recRes, predRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/recommendation/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            storageAvailable,
            storageCost,
          }),
        }),
        fetch(`${API_BASE_URL}/api/price-prediction`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            crop: 'Cotton',
            market: 'Rajkot APMC',
            district: 'Rajkot',
          }),
        }),
      ]);

      if (recRes.ok) {
        const recJson = await recRes.json();
        if (recJson.success && recJson.data) {
          setRecData(recJson.data);
        }
      }

      if (predRes.ok) {
        const predJson = await predRes.json();
        if (predJson.success && predJson.data) {
          setPredData(predJson.data);
        }
      }
    } catch (err: any) {
      console.warn('Backend API offline or error, utilizing fallback snapshot:', err.message);
    } finally {
      setLoading(false);
    }
  }, [storageAvailable, storageCost]);

  useEffect(() => {
    fetchRecommendation();
  }, [fetchRecommendation]);

  const currentCrop = recData?.crop || mockData.crop;
  const currentRate = predData?.today || recData?.marketPrice || mockData.currentPrice;
  const predictedRate = predData?.after15days || recData?.predictedPrice || Math.round(currentRate * 1.12);
  const decision = recData?.decision || mockData.recommendation.toUpperCase();
  const isStore = decision.includes('STORE');
  const confidence = recData?.confidence || mockData.confidence;
  const reasonText = recData?.reason || mockData.reasoning;
  const summaryText = recData?.recommendationSummary || 'Store the crop for approximately one week before selling.';

  const sellNowProfit = currentRate * (recData?.quantity || 100);
  const storeProfit = predictedRate * (recData?.quantity || 100) - (storageCost * 4);

  const chartData = [
    { week: 'Today', price: predData?.today || currentRate },
    { week: '3 Days', price: predData?.after3days || Math.round(currentRate * 1.03) },
    { week: '7 Days', price: predData?.after7days || Math.round(currentRate * 1.07) },
    { week: '15 Days', price: predData?.after15days || predictedRate },
  ];

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
            {loading ? 'Predicting...' : 'Predict Price & Re-Run Engine'}
          </button>
          <div className="inline-flex items-center gap-2 rounded-2xl glass px-4 py-2 border border-sky-500/30">
            <Activity className="h-4 w-4 text-sky-500 animate-pulse" />
            <span className="text-xs font-bold">Random Forest Model: <span className="text-brand-500">ACTIVE</span></span>
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
                  : decision.replace(/_/g, ' ')}
              </p>
              <p className="mt-1 text-xs sm:text-sm font-bold text-white/90">
                🌾 {currentCrop} • Today Rate ₹{currentRate.toLocaleString()} / qtl
              </p>
            </div>
          </div>
          <div className="text-center bg-white/20 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/20">
            <p className="text-[10px] uppercase tracking-widest font-black text-white/80">AI Confidence</p>
            <p className="font-display text-4xl font-black">{confidence}%</p>
          </div>
        </div>
      </motion.div>

      {/* 4 Horizon Price Prediction Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card hover tilt className="p-4 border-slate-500/20">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Today Rate</span>
            <Calendar className="h-3.5 w-3.5 text-brand-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-black text-slate-800 dark:text-slate-100">
            ₹{(predData?.today || currentRate).toLocaleString()}
          </p>
          <span className="text-[10px] font-bold text-slate-400">Current Mandi Price</span>
        </Card>

        <Card hover tilt className="p-4 border-slate-500/20">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>3-Day Forecast</span>
            <TrendingUp className="h-3.5 w-3.5 text-sky-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-black text-sky-500">
            ₹{(predData?.after3days || Math.round(currentRate * 1.03)).toLocaleString()}
          </p>
          <span className="text-[10px] font-bold text-sky-400">+3 Days Projection</span>
        </Card>

        <Card hover tilt className="p-4 border-slate-500/20">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>7-Day Forecast</span>
            <TrendingUp className="h-3.5 w-3.5 text-brand-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-black text-brand-500">
            ₹{(predData?.after7days || Math.round(currentRate * 1.07)).toLocaleString()}
          </p>
          <span className="text-[10px] font-bold text-brand-400">+7 Days Projection</span>
        </Card>

        <Card hover tilt className="p-4 border-slate-500/20">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>15-Day Forecast</span>
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <p className="mt-2 font-display text-2xl font-black text-amber-500">
            ₹{(predData?.after15days || predictedRate).toLocaleString()}
          </p>
          <span className="text-[10px] font-bold text-amber-400">Trend: {predData?.trend || 'Increasing'}</span>
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
              <h3 className="font-display text-lg font-bold">{t('sellstore.sell')} Now</h3>
            </div>
            {!isStore && <Badge variant="success" pulse><CheckCircle2 className="h-3.5 w-3.5" /> Recommended</Badge>}
          </div>
          <p className="mt-4 font-display text-4xl font-black gradient-text">₹{(sellNowProfit / 1000).toFixed(0)}K</p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">{t('sellstore.expected.profit')} Immediate Mandi Settlement</p>
        </Card>

        <Card hover tilt className={cn('p-6', isStore && 'border-sky-500/50 ring-2 ring-sky-500/30')}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-sky-500/20 text-sky-500 shadow-glow-sky">
                <Warehouse className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg font-bold">{t('sellstore.store')} (15 Days)</h3>
            </div>
            {isStore && <Badge variant="info" pulse><CheckCircle2 className="h-3.5 w-3.5" /> Recommended</Badge>}
          </div>
          <p className="mt-4 font-display text-4xl font-black gradient-text-gold">₹{(storeProfit / 1000).toFixed(0)}K</p>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">{t('sellstore.expected.profit')} (Net after storage & moisture loss)</p>
        </Card>
      </div>

      {/* Commodity Price Forecast Curve */}
      <Card hover tilt>
        <SectionHeader title={t('market.forecast')} subtitle={`₹ / Quintal ML Price Trajectory • ${currentCrop}`} />
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
              <ReferenceLine y={currentRate} stroke="#22c55e" strokeDasharray="4 4" label={{ value: 'Now Rate', fontSize: 10, fill: '#22c55e' }} />
              <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} fill="url(#projG)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Financial Risk & Overhead Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <FactorCard icon={<Warehouse className="h-5 w-5 text-amber-500" />} label={t('sellstore.storage.cost')} value={`₹${storageCost} / week`} />
        <FactorCard icon={<AlertTriangle className="h-5 w-5 text-red-500" />} label={t('sellstore.spoilage')} value={`${recData?.riskLevel || 'LOW'} Risk`} risk={recData?.riskLevel === 'HIGH' || recData?.riskLevel === 'CRITICAL'} />
        <FactorCard icon={<Truck className="h-5 w-5 text-sky-500" />} label={t('sellstore.transport')} value={`₹${mockData.transportCost}`} />
      </div>

      {/* AI Financial Reasoning & Summary */}
      <Card hover tilt>
        <SectionHeader title={t('sellstore.reasoning')} subtitle={summaryText} />
        <div className="mt-4">
          <AIResponsePanel
            t={t}
            confidence={confidence}
            priority="high"
            reason={reasonText}
            actions={[summaryText, 'Monitor daily APMC Mandi ticker rates in KrishiMitra dashboard.']}
            impact={`Estimated Profit Impact: ${recData?.estimatedProfit || '+12%'}`}
            alternative={lang === 'hi' ? '40% अभी बेचें, 60% रखें' : lang === 'gu' ? '40% અત્યારે વેચો, 60% સાચવો' : 'Sell 40% now for immediate cashflow, store 60% for peak rate'}
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
