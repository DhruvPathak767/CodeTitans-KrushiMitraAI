import { motion } from 'framer-motion';
import {
  AreaChart, Area, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { Droplets, Wind, Eye, Sun, CloudRain, AlertTriangle, Sparkles, ShieldCheck } from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { Card, Badge, SectionHeader, AIResponsePanel } from '@/components/ui';
import { WeatherIcon, getWeatherType } from '@/components/WeatherIcons';
import { weatherNow, hourlyWeather, weeklyWeather, weatherAlerts } from '@/data/mock';

export function Weather() {
  const { t, lang } = useApp();
  const langSuffix = lang === 'hi' ? '_hi' : lang === 'gu' ? '_gu' : '';
  const titleKey = `title${langSuffix}` as 'title' | 'title_hi' | 'title_gu';
  const wType = getWeatherType(weatherNow.condition);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text">{t('weather.title')}</h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{t('weather.subtitle')}</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl glass px-4 py-2 border border-sky-500/30">
          <ShieldCheck className="h-4 w-4 text-sky-500" />
          <span className="text-xs font-bold">Pesticide Spray Window: <span className="text-brand-500">SAFE (06:00 - 10:00 AM)</span></span>
        </div>
      </div>

      {/* Current Weather Hero with Permanent Satellite Monitoring Imagery */}
      <Card hover tilt className="relative overflow-hidden border-sky-500/30 group">
        <img
          src="/images/satellite_field_monitoring.png"
          alt="Satellite Field Weather Radar & Telemetry"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-25 dark:opacity-30 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-sky-950/70" />
        <div className="relative z-10 flex flex-col items-center gap-6 py-6 sm:flex-row sm:justify-between text-white">
          <div className="flex items-center gap-6">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="p-3 rounded-3xl bg-sky-500/20 border border-sky-400/30 shadow-glow-sky backdrop-blur-md"
            >
              <WeatherIcon type={wType} className="h-20 w-20 text-sky-400" />
            </motion.div>
            <div>
              <p className="font-display text-5xl font-extrabold tracking-tight text-white">{weatherNow.temp}°C</p>
              <p className="text-base font-bold text-sky-300 mt-1">{weatherNow.condition}</p>
              <p className="text-xs text-slate-300 mt-0.5">{t('weather.feels')}: {weatherNow.feels}°C • ISRO INSAT-3DR Telemetry</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 w-full sm:w-auto">
            <WeatherStat icon={<Droplets className="h-5 w-5 text-sky-400" />} value={`${weatherNow.humidity}%`} label={t('land.weather.humidity')} />
            <WeatherStat icon={<Wind className="h-5 w-5 text-slate-300" />} value={`${weatherNow.wind} km/h`} label={t('land.weather.wind')} />
            <WeatherStat icon={<Sun className="h-5 w-5 text-amber-400" />} value={`${weatherNow.uv}`} label={t('weather.uv')} />
            <WeatherStat icon={<Eye className="h-5 w-5 text-slate-300" />} value={`${weatherNow.visibility} km`} label={t('weather.visibility')} />
          </div>
        </div>
      </Card>

      {/* Weather Hazard Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        {weatherAlerts.map((a, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card hover tilt className={a.severity === 'high' ? 'border-red-500/40 bg-red-500/5' : 'border-amber-500/40 bg-amber-500/5'}>
              <div className="flex items-start gap-3.5">
                <div className={`grid place-items-center rounded-2xl p-3 shadow-glow ${a.severity === 'high' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'}`}>
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm">{a[titleKey]}</h3>
                    <Badge variant={a.severity === 'high' ? 'error' : 'warning'} pulse>{t(`common.${a.severity}`)}</Badge>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{a.desc}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Hourly Forecast Curve */}
      <Card hover tilt>
        <SectionHeader title={t('weather.hourly')} subtitle="24-Hour Temperature & Rainfall Curve" />
        <div className="mt-4 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyWeather}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(15,23,42,0.9)', color: '#fff', fontSize: 12 }} />
              <Area type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={3} fill="url(#tempGrad)" />
              <Area type="monotone" dataKey="rain" stroke="#3b82f6" strokeWidth={2.5} fill="url(#rainGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 7-Day Forecast Grid */}
      <Card hover tilt>
        <SectionHeader title={t('weather.weekly')} subtitle="7-Day Micro-Climate Projection" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {weeklyWeather.map((d, i) => (
            <motion.div
              key={d.day}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col items-center rounded-2xl glass p-3 border border-white/40 dark:border-white/10 hover:border-brand-500/40"
            >
              <p className="text-xs font-bold font-display">{d.day}</p>
              <WeatherIcon type={d.icon} className="my-2.5 h-8 w-8 text-sky-500" />
              <div className="text-center">
                <p className="text-sm font-extrabold">{d.max}°</p>
                <p className="text-[10px] text-slate-400 font-semibold">{d.min}°</p>
              </div>
              <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-sky-500">
                <CloudRain className="h-3 w-3" /> {d.rain}%
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* AI Weather Advice */}
      <Card hover tilt>
        <SectionHeader title={t('weather.ai.advice')} />
        <div className="mt-4">
          <AIResponsePanel
            t={t}
            confidence={91}
            priority="high"
            reason={lang === 'hi'
              ? 'वर्तमान मौसम पैटर्न, 7-दिन पूर्वानुमान और आपकी फसल चरण के आधार पर।'
              : lang === 'gu'
              ? 'વર્તમાન હવામાન, 7-દિવસ આગાહી અને તમારા પાક તબક્કા આધારે.'
              : 'Based on current weather patterns, 7-day forecast, and your crop growth stage. Rain Wed-Thu requires adjusted field operations.'}
            actions={[
              lang === 'hi' ? 'शुक्रवार तक उर्वरक टालें' : lang === 'gu' ? 'શુક્રવાર સુધી ખાતર ટાળો' : 'Delay fertilizer until Friday',
              lang === 'hi' ? 'नालियां साफ करें' : lang === 'gu' ? 'નાળીઓ સ્વચ્છ કરો' : 'Clear drainage channels',
              lang === 'hi' ? 'कटाई उपज ढकें' : lang === 'gu' ? 'લણણી ઉપજ ઢાંકો' : 'Cover harvested produce',
            ]}
            impact={lang === 'hi' ? 'फसल क्षति और उर्वरक बहाव रोकता है' : lang === 'gu' ? 'પાક નુકસાન અને ખાતર વહે અટકાવે' : 'Prevents crop damage and fertilizer runoff'}
            alternative={lang === 'hi' ? 'वर्षा के बाद मिट्टी नमी जांचें' : lang === 'gu' ? 'વરસાદ પછી જમીન ભેજ ચકાસો' : 'Check soil moisture after rain before next irrigation'}
          />
        </div>
      </Card>
    </div>
  );
}

function WeatherStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl glass p-3.5 border border-white/40 dark:border-white/10">
      {icon}
      <p className="mt-1.5 text-sm font-extrabold font-display">{value}</p>
      <p className="text-[10px] font-semibold text-slate-400">{label}</p>
    </div>
  );
}
