import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import {
  Droplets, TrendingUp, CheckCircle2, Circle,
  Sparkles, Cloud, Wind, ArrowRight, Activity, Zap, Cpu, ScanLine, ShieldCheck,
} from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { Card, StatCard, Badge, ProgressBar, SectionHeader, cn } from '@/components/ui';
import {
  weatherNow, farmHealth, dashboardTasks, profitSummary,
  yieldTrend, monthlyIncome, aiInsights,
} from '@/data/mock';
import { WeatherIcon, getWeatherType } from '@/components/WeatherIcons';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { t, lang, user, farm } = useApp();
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'dash.greeting.morning' : hour < 17 ? 'dash.greeting.afternoon' : 'dash.greeting.evening';
  const [tasks, setTasks] = useState(dashboardTasks);

  function toggleTask(id: number) {
    setTasks((p) => p.map((tk) => (tk.id === id ? { ...tk, done: !tk.done } : tk)));
  }

  const langSuffix = lang === 'hi' ? '_hi' : lang === 'gu' ? '_gu' : '';
  const taskKey = `task${langSuffix}` as 'task' | 'task_hi' | 'task_gu';

  return (
    <div className="space-y-6">
      {/* AI Command Center Greeting Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl glass-strong p-6 border border-white/50 dark:border-white/10 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-brand-500/10 filter blur-3xl pointer-events-none" />
        <div>
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-bold text-brand-600 dark:text-brand-400 mb-2 border border-brand-500/20">
            <Cpu className="h-3.5 w-3.5 text-brand-500 animate-pulse" />
            <span>AI Command Center Active</span>
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-4xl gradient-text">
            {t(greeting)}, {user?.name?.split(' ')[0] ?? 'Farmer'} 👋
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            {farm?.registered
              ? `${farm.name} · ${farm.village}, ${farm.state} · ${farm.crop}`
              : t('farm.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/app/disease')}
            className="btn-primary text-xs px-4 py-2.5 shadow-glow"
          >
            <ScanLine className="h-4 w-4" /> AI Disease Scan
          </button>
          <button
            onClick={() => navigate('/app/chatbot')}
            className="btn-glass text-xs px-4 py-2.5 border-brand-500/30"
          >
            <Sparkles className="h-4 w-4 text-brand-500" /> AI Assistant
          </button>
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t('dash.health.title')} value={`${farmHealth.score}/100`} icon={<Activity className="h-5 w-5" />} accent="brand" trend={t('common.high') + ' health'} trendUp delay={0} />
        <StatCard label={t('dash.profit.title')} value={`₹${(profitSummary.profit / 1000).toFixed(0)}K`} icon={<TrendingUp className="h-5 w-5" />} accent="sky" trend={`+${profitSummary.margin}% margin`} trendUp delay={0.05} />
        <StatCard label={t('weather.temp')} value={`${weatherNow.temp}°C`} icon={<Cloud className="h-5 w-5" />} accent="amber" trend={weatherNow.condition} delay={0.1} />
        <StatCard label={t('dash.tasks.title')} value={`${tasks.filter((tk) => tk.done).length}/${tasks.length}`} icon={<CheckCircle2 className="h-5 w-5" />} accent="soil" trend={t('common.today')} delay={0.15} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Health Score + Telemetry Charts */}
        <div className="space-y-6 lg:col-span-2">
          {/* Farm Health Score Meter */}
          <Card hover tilt>
            <SectionHeader title={t('dash.health.title')} subtitle={t('dash.health.subtitle')} />
            <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row">
              <HealthScoreRing score={farmHealth.score} />
              <div className="flex-1 space-y-3.5 w-full">
                {farmHealth.factors.map((f, i) => {
                  const name = f[`name${langSuffix}` as 'name' | 'name_hi' | 'name_gu'];
                  const color = f.status === 'good' ? 'bg-gradient-to-r from-brand-600 to-brand-400' : 'bg-gradient-to-r from-amber-500 to-gold-400';
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-700 dark:text-slate-300">{name}</span>
                        <span className="tabular-nums font-bold font-display">{f.value}%</span>
                      </div>
                      <ProgressBar value={f.value} color={color} />
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Yield Prediction Trend */}
          <Card hover tilt>
            <SectionHeader title={t('dash.charts.yield')} subtitle="ton / acre (AI Satellite Forecast)" />
            <div className="mt-4 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yieldTrend}>
                  <defs>
                    <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(15,23,42,0.9)', color: '#fff', fontSize: 12 }} />
                  <Area type="monotone" dataKey="predicted" stroke="#38bdf8" strokeWidth={2} strokeDasharray="4 4" fill="none" />
                  <Area type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={3} fill="url(#yieldGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Monthly Income Breakdown */}
          <Card hover tilt>
            <SectionHeader title={t('dash.charts.income')} subtitle="₹ Monthly Farm Revenue" />
            <div className="mt-4 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyIncome}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(15,23,42,0.9)', color: '#fff', fontSize: 12 }} />
                  <Bar dataKey="income" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right: Weather, AI Insights, Task Checklist */}
        <div className="space-y-6">
          {/* Weather Widget */}
          <Card hover tilt className="border-sky-500/30 bg-gradient-to-br from-sky-500/10 to-transparent">
            <SectionHeader title={t('dash.weather.title')} />
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <WeatherIcon type={getWeatherType(weatherNow.condition)} className="h-14 w-14 text-sky-500 animate-pulse" />
                <div>
                  <p className="font-display text-4xl font-extrabold tracking-tight">{weatherNow.temp}°C</p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{weatherNow.condition}</p>
                </div>
              </div>
              <Badge variant="info">Live Radar</Badge>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <MiniStat icon={<Droplets className="h-4 w-4 text-sky-500" />} value={`${weatherNow.humidity}%`} label={t('land.weather.humidity')} />
              <MiniStat icon={<Wind className="h-4 w-4 text-slate-400" />} value={`${weatherNow.wind}`} label={t('land.weather.wind')} />
              <MiniStat icon={<Cloud className="h-4 w-4 text-sky-400" />} value={`${weatherNow.rainProb}%`} label={t('land.weather.rain')} />
            </div>
            <button onClick={() => navigate('/app/weather')} className="btn-ghost mt-4 w-full text-xs font-bold border border-white/20">
              {t('common.viewAll')} <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Card>

          {/* AI Insights & Advisory Alerts */}
          <Card hover tilt className="border-brand-500/30 bg-gradient-to-br from-brand-500/10 via-slate-900/5 to-sky-500/10">
            <div className="flex items-center gap-2 mb-3">
              <span className="grid place-items-center rounded-xl bg-brand-500/20 p-2 text-brand-600 dark:text-brand-400 shadow-glow">
                <Sparkles className="h-4 w-4" />
              </span>
              <h3 className="font-display text-base font-bold">{t('dash.ai.insights')}</h3>
              <Badge variant="success" pulse className="ml-auto">{t('dash.ai.new')}</Badge>
            </div>
            <div className="space-y-3">
              {aiInsights.map((ins, i) => {
                const title = ins[`title${langSuffix}` as 'title' | 'title_hi' | 'title_gu'];
                const desc = ins[`desc${langSuffix}` as 'desc' | 'desc_hi' | 'desc_gu'];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    className="rounded-2xl glass p-3.5 border border-white/40 dark:border-white/10"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant={ins.priority === 'high' ? 'error' : 'warning'}>{t(`common.${ins.priority}`)}</Badge>
                      <span className="text-[10px] font-bold text-slate-400 font-mono">Confidence: {ins.confidence}%</span>
                    </div>
                    <p className="mt-2 text-xs font-bold">{title}</p>
                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </Card>

          {/* Daily Farm Tasks */}
          <Card hover tilt>
            <SectionHeader title={t('dash.tasks.title')} />
            <div className="mt-3 space-y-1.5">
              {tasks.map((tk) => {
                const taskText = tk[taskKey];
                return (
                  <button
                    key={tk.id}
                    onClick={() => toggleTask(tk.id)}
                    className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-all hover:bg-slate-200/50 dark:hover:bg-white/5"
                  >
                    {tk.done ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-500" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-slate-300 dark:text-slate-600" />
                    )}
                    <span className={cn('flex-1 text-xs font-medium', tk.done && 'line-through opacity-50')}>{taskText}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{tk.time}</span>
                    {tk.priority === 'high' && !tk.done && <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function HealthScoreRing({ score }: { score: number }) {
  const radius = 52;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#3b82f6' : '#f59e0b';
  return (
    <div className="relative grid place-items-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" className="dark:stroke-white/10" />
        <motion.circle
          cx="70" cy="70" r={radius} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="font-display text-3xl font-extrabold"
          style={{ color }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</span>
      </div>
    </div>
  );
}

function MiniStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-xl glass p-2">
      <div className="flex justify-center">{icon}</div>
      <p className="mt-1 text-xs font-bold font-display">{value}</p>
      <p className="text-[10px] text-slate-400">{label}</p>
    </div>
  );
}
