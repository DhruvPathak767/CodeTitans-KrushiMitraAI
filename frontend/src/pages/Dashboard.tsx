import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import {
  Droplets, TrendingUp, CheckCircle2, Circle,
  Sparkles, Cloud, Wind, ArrowRight, Activity, Zap, Cpu, ScanLine, ShieldCheck,
  Sun, MapPin, CloudRain, Thermometer, Sprout, ShieldAlert,
} from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { useFarm } from '@/context/FarmContext';
import { useWeather } from '@/context/WeatherContext';
import { Card, StatCard, Badge, ProgressBar, SectionHeader, cn } from '@/components/ui';
import {
  farmHealth, dashboardTasks, profitSummary,
  yieldTrend, monthlyIncome, aiInsights,
} from '@/data/mock';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { t, lang, user } = useApp();
  const { activeFarm } = useFarm();
  const { weatherData, loading: weatherLoading } = useWeather();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState(dashboardTasks);

  function toggleTask(id: number) {
    setTasks((p) => p.map((tk) => (tk.id === id ? { ...tk, done: !tk.done } : tk)));
  }

  const langSuffix = lang === 'hi' ? '_hi' : lang === 'gu' ? '_gu' : '';
  const taskKey = `task${langSuffix}` as 'task' | 'task_hi' | 'task_gu';

  const currentWeather = weatherData?.current;
  const location = weatherData?.location;
  const agriculture = weatherData?.agriculture;

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
            <span>AI Command Center Active</span>
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-4xl text-white">
            Welcome, {user?.name?.split(' ')[0] ?? 'Farmer'} 👋
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-200">
            {location
              ? `${location.farmName} · ${location.weatherLocationName} · ${activeFarm?.cropName || 'Crop'}`
              : 'Real-time satellite & micro-climate AI telemetry'}
          </p>
        </div>

        {/* Live Weather Mini Widget in Header */}
        <div className="relative z-10 flex items-center gap-3 rounded-2xl glass-strong px-4 py-3 border border-white/20 shadow-glow cursor-pointer hover:border-emerald-400 transition-all" onClick={() => navigate('/app/weather')}>
          <div className="grid place-items-center rounded-xl bg-emerald-500/20 p-2 text-emerald-400">
            <Sun className="h-6 w-6 text-amber-400 animate-spin" style={{ animationDuration: '25s' }} />
          </div>
          <div className="text-right">
            <p className="text-xl font-extrabold font-display text-white">
              {currentWeather ? `${currentWeather.temperature}°C` : '--'}
            </p>
            <p className="text-[11px] font-semibold text-emerald-300">
              {location?.weatherLocationName || 'Active Farm'} • {currentWeather?.rainProbability ?? 0}% Rain
            </p>
          </div>
        </div>
      </motion.div>

      {/* Top 4 Real-Time Telemetry Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active AI Farm Location"
          value={location ? location.farmName : 'Farm Station'}
          trend={location ? location.weatherLocationName : 'Active'}
          trendUp
          icon={<MapPin className="h-6 w-6 text-emerald-400" />}
          accent="brand"
          delay={0.1}
        />
        <StatCard
          label="Farm Micro-Temperature"
          value={currentWeather ? `${currentWeather.temperature}°C` : '--'}
          trend={currentWeather ? `Feels like ${currentWeather.feelsLike}°C` : 'Normal range'}
          trendUp
          icon={<Thermometer className="h-6 w-6 text-amber-400" />}
          accent="amber"
          delay={0.2}
        />
        <StatCard
          label="Relative Air Humidity"
          value={currentWeather ? `${currentWeather.humidity}%` : '--'}
          trend={currentWeather ? `Wind ${currentWeather.windSpeed} km/h` : 'Optimal soil moisture'}
          trendUp
          icon={<Droplets className="h-6 w-6 text-sky-400" />}
          accent="sky"
          delay={0.3}
        />
        <StatCard
          label="Precipitation Probability"
          value={currentWeather ? `${currentWeather.rainProbability}%` : '--'}
          trend={currentWeather ? `Cloud coverage ${currentWeather.cloudCoverage}%` : 'Low rain threat'}
          trendUp={false}
          icon={<CloudRain className="h-6 w-6 text-blue-400" />}
          accent="rose"
          delay={0.4}
        />
      </div>

      {/* Live Micro-Climate Detailed Widget & Crop Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 space-y-4">
          <SectionHeader
            title="Active Farm Weather Telemetry"
            subtitle={location?.formattedAddress || 'Live micro-climate telemetry for your active farm.'}
            action={
              <button onClick={() => navigate('/app/weather')} className="btn-primary text-xs py-1.5 px-3">
                Full Weather Station →
              </button>
            }
          />
          {currentWeather ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-2xl bg-slate-500/5 p-3 border border-white/5 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">Temperature</span>
                <span className="text-lg font-bold text-slate-800 dark:text-white">{currentWeather.temperature}°C (Feels {currentWeather.feelsLike}°C)</span>
              </div>
              <div className="rounded-2xl bg-slate-500/5 p-3 border border-white/5 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">Humidity</span>
                <span className="text-lg font-bold text-slate-800 dark:text-white">{currentWeather.humidity}%</span>
              </div>
              <div className="rounded-2xl bg-slate-500/5 p-3 border border-white/5 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">Wind Speed</span>
                <span className="text-lg font-bold text-slate-800 dark:text-white">{currentWeather.windSpeed} km/h</span>
              </div>
              <div className="rounded-2xl bg-slate-500/5 p-3 border border-white/5 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">Rain Chance</span>
                <span className="text-lg font-bold text-slate-800 dark:text-white">{currentWeather.rainProbability}%</span>
              </div>
            </div>
          ) : (
            <div className="p-4 text-xs text-slate-400">
              {weatherLoading ? 'Connecting to live OpenWeather API...' : 'No weather telemetry available.'}
            </div>
          )}

          {agriculture && (
            <div className="rounded-2xl bg-emerald-500/10 p-3.5 border border-emerald-500/20 text-xs text-slate-600 dark:text-slate-300">
              <strong className="text-emerald-500 font-bold">Agronomy Guidance: </strong>
              {agriculture.diseaseRisk} • {agriculture.irrigationAdvice}
            </div>
          )}
        </Card>

        {/* Crop Health Index Card */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base">Crop Health Index</h3>
            <Badge variant="success" pulse>Healthy 92%</Badge>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Chlorophyll Index</span>
              <span className="font-bold text-emerald-400">Optimal</span>
            </div>
            <ProgressBar value={92} />
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Soil Moisture Balance</span>
              <span className="font-bold text-emerald-400">Good (68%)</span>
            </div>
            <ProgressBar value={68} color="bg-gradient-to-r from-sky-500 to-sky-300" />
          </div>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <SectionHeader title="7-Day Micro-Climate Trend" subtitle="Temperature and precipitation outlook" />
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
          <SectionHeader title="Monthly Revenue & Mandi Price Projection" subtitle="Expected market returns" />
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
