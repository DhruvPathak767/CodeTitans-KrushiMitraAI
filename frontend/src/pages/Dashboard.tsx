import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import {
  Droplets, Thermometer, MapPin, CloudRain, Sun,
  Cpu, RotateCw, Sparkles, AlertTriangle, CheckCircle2,
} from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { useFarm } from '@/context/FarmContext';
import { useWeather } from '@/context/WeatherContext';
import { useAdvisory } from '@/context/AdvisoryContext';
import { Card, StatCard, Badge, ProgressBar, SectionHeader } from '@/components/ui';
import {
  yieldTrend, monthlyIncome,
} from '@/data/mock';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { t, user } = useApp();
  const { activeFarm } = useFarm();
  const { weatherData } = useWeather();
  const { advisoryData, loading: advisoryLoading, refreshing: advisoryRefreshing, refreshAdvisory } = useAdvisory();
  const navigate = useNavigate();

  const currentWeather = weatherData?.current;
  const location = weatherData?.location;
  const advisory = advisoryData?.advisory;

  return (
    <div className="space-y-6">
      {/* AI Command Center Greeting Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden group border border-white/40 dark:border-white/10"
      >
        <img
          src="/images/hero_agriculture_ai.png"
          alt="KrushiMitra AI Agriculture Command Center"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/40" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1 text-xs font-bold text-brand-400 mb-2 border border-brand-500/30 backdrop-blur-md animate-float">
            <Cpu className="h-3.5 w-3.5 text-brand-400 animate-pulse" />
            <span>{t('dash.ai.insights')}</span>
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-4xl text-white">
            {t('dash.greeting.morning')}, {user?.name?.split(' ')[0] ?? 'Farmer'} 👋
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-200">
            {location
              ? `${location.farmName} · ${location.weatherLocationName} · ${activeFarm?.cropName || t('farm.crop')}`
              : t('app.subtitle')}
          </p>
        </div>

        {/* Live Weather Mini Widget in Header */}
        <div
          className="relative z-10 flex items-center gap-3 rounded-2xl glass-strong px-4 py-3 border border-white/20 shadow-glow cursor-pointer hover:border-emerald-400 transition-all"
          onClick={() => navigate('/app/weather')}
        >
          <div className="grid place-items-center rounded-xl bg-emerald-500/20 p-2 text-emerald-400">
            <Sun className="h-6 w-6 text-amber-400 animate-spin" style={{ animationDuration: '25s' }} />
          </div>
          <div className="text-right">
            <p className="text-xl font-extrabold font-display text-white">
              {currentWeather ? `${currentWeather.temperature}°C` : '--'}
            </p>
            <p className="text-[11px] font-semibold text-emerald-300">
              {location?.weatherLocationName || t('nav.farm')} • {currentWeather?.rainProbability ?? 0}% {t('land.weather.rain')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Top 4 Telemetry Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t('farm.location')}
          value={location ? location.farmName : 'Farm Station'}
          trend={location ? location.weatherLocationName : 'Active'}
          trendUp
          icon={<MapPin className="h-6 w-6 text-emerald-400" />}
          accent="brand"
          delay={0.1}
        />
        <StatCard
          label={t('weather.temp')}
          value={currentWeather ? `${currentWeather.temperature}°C` : '--'}
          trend={currentWeather ? `${t('weather.feels')} ${currentWeather.feelsLike}°C` : 'Normal range'}
          trendUp
          icon={<Thermometer className="h-6 w-6 text-amber-400" />}
          accent="amber"
          delay={0.2}
        />
        <StatCard
          label={t('land.weather.humidity')}
          value={currentWeather ? `${currentWeather.humidity}%` : '--'}
          trend={currentWeather ? `${t('land.weather.wind')} ${currentWeather.windSpeed} km/h` : 'Optimal'}
          trendUp
          icon={<Droplets className="h-6 w-6 text-sky-400" />}
          accent="sky"
          delay={0.3}
        />
        <StatCard
          label={t('weather.rain.prob')}
          value={currentWeather ? `${currentWeather.rainProbability}%` : '--'}
          trend={currentWeather ? `Cloud ${currentWeather.cloudCoverage}%` : 'Low rain threat'}
          trendUp={false}
          icon={<CloudRain className="h-6 w-6 text-blue-400" />}
          accent="rose"
          delay={0.4}
        />
      </div>

      {/* Groq AI Live Crop Advisory Card & Health Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-4 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-500 animate-pulse" />
              <div>
                <h3 className="font-display text-base font-bold">{t('advisory.title')}</h3>
                <p className="text-xs text-slate-400">
                  {t('advisory.growth')}: <strong className="text-emerald-500">{advisoryData?.growthStage || 'Vegetative'}</strong> · Updated {advisoryData?.lastUpdated ? new Date(advisoryData.lastUpdated).toLocaleTimeString() : 'Recently'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={refreshAdvisory}
                disabled={advisoryRefreshing}
                className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <RotateCw className={`h-3.5 w-3.5 ${advisoryRefreshing ? 'animate-spin' : ''}`} />
                <span>{advisoryRefreshing ? t('common.loading') : t('advisory.generate')}</span>
              </button>
              <button onClick={() => navigate('/app/advisory')} className="btn-secondary text-xs py-1.5 px-3">
                {t('common.viewAll')} →
              </button>
            </div>
          </div>

          {advisoryLoading ? (
            <div className="p-8 text-center space-y-2">
              <RotateCw className="h-8 w-8 animate-spin text-emerald-500 mx-auto" />
              <p className="text-xs font-semibold text-slate-400">{t('common.loading')}</p>
            </div>
          ) : advisory ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl bg-emerald-500/10 p-3.5 border border-emerald-500/20">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block">{t('common.priority')}</span>
                  <p className="text-lg font-bold text-slate-800 dark:text-white mt-1">{advisory.priority || 'Medium'}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{advisory.irrigation?.status}</p>
                </div>
                <div className="rounded-2xl bg-amber-500/10 p-3.5 border border-amber-500/20">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block">{t('disease.severity')}</span>
                  <p className="text-lg font-bold text-slate-800 dark:text-white mt-1">{advisory.diseaseRisk?.level || 'Low'}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{advisory.diseaseRisk?.reason || 'Normal'}</p>
                </div>
                <div className="rounded-2xl bg-sky-500/10 p-3.5 border border-sky-500/20">
                  <span className="text-[10px] font-bold text-sky-500 uppercase tracking-wider block">{t('weather.ai.advice')}</span>
                  <p className="text-sm font-bold text-slate-800 dark:text-white mt-1">{advisory.sprayWindow?.bestTime || 'Morning'}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{t('common.impact')}: {advisory.estimatedYieldImpact}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-500/5 p-4 border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <h4 className="text-xs font-bold uppercase text-slate-400">{t('common.actions')}</h4>
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{advisory.nextAction}</p>
                {advisory.warning && (
                  <p className="text-xs text-amber-400 flex items-center gap-1 mt-1 font-medium">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span>{advisory.warning}</span>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 text-xs text-slate-400">{t('common.noAdvisory')}</div>
          )}
        </Card>

        {/* AI Crop Health Index Card */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base">{t('dash.health.title')}</h3>
            <Badge variant="success" pulse>
              Score: {advisory?.cropHealthScore || 90}%
            </Badge>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">{t('dash.health.subtitle')}</span>
              <span className="font-bold text-emerald-400">{advisory?.cropHealthScore || 90}%</span>
            </div>
            <ProgressBar value={advisory?.cropHealthScore || 90} />

            <div className="flex justify-between text-xs">
              <span className="text-slate-400">{t('irrigation.saving')}</span>
              <span className="font-bold text-sky-400">{advisory?.estimatedWaterSaving || '18%'}</span>
            </div>
            <ProgressBar value={75} color="bg-gradient-to-r from-sky-500 to-sky-300" />

            <div className="flex justify-between text-xs">
              <span className="text-slate-400">{t('sellstore.expected.profit')}</span>
              <span className="font-bold text-amber-400">{advisory?.estimatedCostSaving || '₹900'}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <SectionHeader title={t('dash.charts.yield')} subtitle={t('weather.weekly')} />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yieldTrend}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#tempGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionHeader title={t('dash.charts.income')} subtitle={t('market.trends')} />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyIncome}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="income" fill="#34d399" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
