import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudLightning,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  CloudDrizzle,
  RefreshCw,
  MapPin,
  AlertTriangle,
  Loader2,
  ShieldAlert,
  Compass,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  Activity,
} from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { useWeather } from '@/context/WeatherContext';

// Configure Leaflet custom marker icon
const customMarkerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/**
 * Render dynamic weather icon based on internal weatherIcon string
 */
function WeatherIconRenderer({ icon, className = 'h-8 w-8' }: { icon?: string; className?: string }) {
  switch (icon) {
    case 'sun':
      return <Sun className={`${className} text-amber-400`} />;
    case 'cloud-sun':
      return <CloudSun className={`${className} text-amber-300`} />;
    case 'cloud':
      return <Cloud className={`${className} text-slate-400`} />;
    case 'cloud-rain':
      return <CloudRain className={`${className} text-sky-400`} />;
    case 'cloud-lightning':
      return <CloudLightning className={`${className} text-purple-400`} />;
    case 'cloud-drizzle':
      return <CloudDrizzle className={`${className} text-blue-300`} />;
    default:
      return <Sun className={`${className} text-amber-400`} />;
  }
}

export function Weather() {
  const { t } = useApp();
  const { weatherData, loading, error, refreshWeather } = useWeather();

  const current = weatherData?.current;
  const location = weatherData?.location;
  const hourly = weatherData?.hourly || [];
  const daily = weatherData?.daily || [];
  const airQuality = weatherData?.airQuality;
  const agriculture = weatherData?.agriculture;
  const alerts = weatherData?.alerts || [];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              {t('weather.current')}
            </span>
            {weatherData?.isCached && (
              <span className="text-[10px] font-bold text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded-full">
                MongoDB Cache (30m TTL)
              </span>
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text">
            {t('weather.title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Live atmospheric telemetry, Air Quality Index, 24-hour hourly forecast, 7-day micro-climate, and rule-based agronomy insights.
          </p>
        </div>

        <button
          onClick={() => refreshWeather()}
          disabled={loading}
          className="btn-glass text-xs py-2.5 px-4 rounded-2xl flex items-center gap-2 shrink-0 border border-slate-200 dark:border-white/10 hover:border-emerald-500"
        >
          <RefreshCw className={`h-4 w-4 text-emerald-500 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? t('common.loading') : 'Refresh Weather'}</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-600 dark:text-red-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && !weatherData ? (
        <div className="flex flex-col items-center justify-center p-20 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-2" />
          <p className="text-xs font-semibold">{t('common.loading')}</p>
        </div>
      ) : current && location ? (
        <>
          {/* Active Farm Alerts (if any) */}
          {alerts.length > 0 && (
            <div className="space-y-2">
              {alerts.map((alert, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-700 dark:text-amber-300 font-medium">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-amber-500" />
                  <div>
                    <strong className="font-bold">{alert.title}: </strong>
                    <span>{alert.message}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 1. CURRENT WEATHER CARD */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl glass-strong border border-slate-200/80 dark:border-white/10 p-6 sm:p-8 shadow-card relative overflow-hidden transition-all duration-300 hover:border-emerald-500 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]"
          >
            <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 filter blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              {/* Left: Location & Current Temperature */}
              <div className="space-y-3 lg:col-span-1 border-b lg:border-b-0 lg:border-r border-slate-200/60 dark:border-white/10 pb-6 lg:pb-0 lg:pr-6">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">{location.weatherLocationName}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="grid place-items-center rounded-3xl bg-slate-500/10 p-4 border border-white/10 shadow-glow shrink-0">
                    <WeatherIconRenderer icon={current.weatherIcon} className="h-12 w-12" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        {current.temperature ?? '--'}°
                      </span>
                      <span className="text-xl font-bold text-slate-400">C</span>
                    </div>
                    <p className="text-xs font-extrabold capitalize text-emerald-600 dark:text-emerald-400">
                      {current.weatherDescription ?? current.weatherCondition}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span>{t('weather.feels')} <strong>{current.feelsLike ?? '--'}°C</strong></span>
                  <span>•</span>
                  <span>H: <strong>{current.maximumTemperature ?? '--'}°</strong> L: <strong>{current.minimumTemperature ?? '--'}°</strong></span>
                </div>
              </div>

              {/* Right: Telemetry Grid (6 Metrics) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:col-span-2">
                <div className="rounded-2xl glass p-3.5 border border-slate-200/60 dark:border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                    <Droplets className="h-3.5 w-3.5 text-sky-400" />
                    <span>{t('land.weather.humidity')}</span>
                  </div>
                  <p className="text-lg font-bold font-display text-slate-900 dark:text-white">{current.humidity}%</p>
                  <p className="text-[10px] text-slate-400">Dew Point: {current.dewPoint}°C</p>
                </div>

                <div className="rounded-2xl glass p-3.5 border border-slate-200/60 dark:border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                    <Wind className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{t('land.weather.wind')}</span>
                  </div>
                  <p className="text-lg font-bold font-display text-slate-900 dark:text-white">{current.windSpeed} km/h</p>
                  <p className="text-[10px] text-slate-400">Gust: {current.windGust} km/h</p>
                </div>

                <div className="rounded-2xl glass p-3.5 border border-slate-200/60 dark:border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                    <CloudRain className="h-3.5 w-3.5 text-blue-400" />
                    <span>{t('weather.rain.prob')}</span>
                  </div>
                  <p className="text-lg font-bold font-display text-slate-900 dark:text-white">{current.rainProbability}%</p>
                  <p className="text-[10px] text-slate-400">Vol: {current.rainVolume} mm</p>
                </div>

                <div className="rounded-2xl glass p-3.5 border border-slate-200/60 dark:border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                    <Gauge className="h-3.5 w-3.5 text-purple-400" />
                    <span>Pressure</span>
                  </div>
                  <p className="text-lg font-bold font-display text-slate-900 dark:text-white">{current.pressure} hPa</p>
                  <p className="text-[10px] text-slate-400">Clouds: {current.cloudCoverage}%</p>
                </div>

                <div className="rounded-2xl glass p-3.5 border border-slate-200/60 dark:border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                    <Eye className="h-3.5 w-3.5 text-amber-400" />
                    <span>{t('weather.visibility')}</span>
                  </div>
                  <p className="text-lg font-bold font-display text-slate-900 dark:text-white">{current.visibility} km</p>
                  <p className="text-[10px] text-slate-400">UV Index: {current.uvIndex}</p>
                </div>

                <div className="rounded-2xl glass p-3.5 border border-slate-200/60 dark:border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                    <Sunrise className="h-3.5 w-3.5 text-amber-500" />
                    <span>Sun Cycle</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">🌅 {current.sunrise}</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">🌇 {current.sunset}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. RULE-BASED AGRONOMY ADVICE */}
          {agriculture && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl glass-strong border border-emerald-500/30 p-6 space-y-4 shadow-card"
            >
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base border-b border-white/10 pb-3">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span>Agricultural Rule Engine Insights</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="rounded-2xl glass p-4 border border-white/10 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Disease Risk</span>
                  <p className="font-bold text-emerald-400 text-sm">{agriculture.diseaseRisk}</p>
                </div>
                <div className="rounded-2xl glass p-4 border border-white/10 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Chemical Spray Window</span>
                  <p className="font-bold text-amber-400 text-sm">{agriculture.sprayWindow}</p>
                </div>
                <div className="rounded-2xl glass p-4 border border-white/10 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{t('weather.irrigation.tip')}</span>
                  <p className="font-bold text-sky-400 text-sm">{agriculture.irrigationAdvice}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* 3. AIR QUALITY INDEX CARD */}
          {airQuality && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl glass p-6 border border-slate-200/80 dark:border-white/10 space-y-4 shadow-card"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-400" />
                  <h3 className="font-bold font-display text-base text-slate-900 dark:text-white">Air Quality Telemetry</h3>
                </div>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                  AQI {airQuality.aqi} • {airQuality.aqiStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center text-xs">
                <div className="rounded-xl glass p-2.5 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block">PM 2.5</span>
                  <span className="font-bold text-slate-200">{airQuality.pm25} µg/m³</span>
                </div>
                <div className="rounded-xl glass p-2.5 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block">PM 10</span>
                  <span className="font-bold text-slate-200">{airQuality.pm10} µg/m³</span>
                </div>
                <div className="rounded-xl glass p-2.5 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block">CO</span>
                  <span className="font-bold text-slate-200">{airQuality.co} µg/m³</span>
                </div>
                <div className="rounded-xl glass p-2.5 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block">NO₂</span>
                  <span className="font-bold text-slate-200">{airQuality.no2} µg/m³</span>
                </div>
                <div className="rounded-xl glass p-2.5 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block">SO₂</span>
                  <span className="font-bold text-slate-200">{airQuality.so2} µg/m³</span>
                </div>
                <div className="rounded-xl glass p-2.5 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block">O₃</span>
                  <span className="font-bold text-slate-200">{airQuality.o3} µg/m³</span>
                </div>
                <div className="rounded-xl glass p-2.5 border border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase block">NH₃</span>
                  <span className="font-bold text-slate-200">{airQuality.nh3 || 'N/A'}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* 4. HOURLY FORECAST (24 HOURS / 8 SLOTS) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl glass p-6 border border-slate-200/80 dark:border-white/10 space-y-4 shadow-card"
          >
            <div className="flex items-center gap-2 text-base font-bold font-display text-slate-900 dark:text-white border-b border-white/10 pb-3">
              <Clock className="h-5 w-5 text-emerald-400" />
              <span>{t('weather.hourly')}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {hourly.map((h, i) => (
                <div key={i} className="flex flex-col items-center justify-between rounded-2xl glass p-3 border border-white/10 text-center space-y-2 hover:border-emerald-500 transition-colors">
                  <span className="text-xs font-semibold text-slate-400">{h.time}</span>
                  <span className="text-lg font-bold font-display text-slate-900 dark:text-white">{h.temperature}°C</span>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-sky-400">
                    <CloudRain className="h-3 w-3" />
                    <span>{h.rainChance}%</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{h.windSpeed} km/h</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 5. 7-DAY DAILY FORECAST & LIVE LEAFLET MAP */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 7-Day Forecast */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 rounded-3xl glass p-6 border border-slate-200/80 dark:border-white/10 space-y-4 shadow-card"
            >
              <div className="flex items-center gap-2 text-base font-bold font-display text-slate-900 dark:text-white border-b border-white/10 pb-3">
                <Calendar className="h-5 w-5 text-emerald-400" />
                <span>{t('weather.weekly')}</span>
              </div>

              <div className="space-y-2.5">
                {daily.map((d, i) => (
                  <div key={i} className="flex items-center justify-between rounded-2xl glass px-4 py-3 border border-white/5 hover:border-emerald-500/50 transition-all text-xs">
                    <div className="flex items-center gap-3 w-28 shrink-0">
                      <WeatherIconRenderer icon={d.icon} className="h-5 w-5" />
                      <span className="font-bold text-slate-900 dark:text-white">{d.dayName}</span>
                    </div>

                    <div className="flex items-center gap-1 text-slate-400 font-medium w-24">
                      <span className="capitalize">{d.condition}</span>
                    </div>

                    <div className="flex items-center gap-2 font-display text-sm font-bold w-24 justify-center">
                      <span className="text-slate-900 dark:text-white">{d.maximumTemperature}°</span>
                      <span className="text-slate-400 font-normal">{d.minimumTemperature}°</span>
                    </div>

                    <div className="flex items-center gap-1 text-sky-400 font-semibold w-16 justify-end">
                      <CloudRain className="h-3.5 w-3.5" />
                      <span>{d.rainChance}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Live Leaflet Station Map */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl glass p-6 border border-slate-200/80 dark:border-white/10 space-y-4 shadow-card flex flex-col"
            >
              <div className="flex items-center gap-2 text-base font-bold font-display text-slate-900 dark:text-white border-b border-white/10 pb-3">
                <MapPin className="h-5 w-5 text-emerald-400" />
                <span>Active Farm Location</span>
              </div>

              <div className="relative flex-1 min-h-[260px] rounded-2xl overflow-hidden border border-white/10 shadow-inner">
                <MapContainer
                  center={[location.latitude, location.longitude]}
                  zoom={13}
                  scrollWheelZoom={false}
                  className="h-full w-full rounded-2xl z-0"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <Marker position={[location.latitude, location.longitude]} icon={customMarkerIcon}>
                    <Popup>
                      <div className="text-xs font-sans">
                        <strong className="font-bold text-emerald-600 block">{location.farmName}</strong>
                        <span>{location.weatherLocationName}</span>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </motion.div>
          </div>
        </>
      ) : null}
    </div>
  );
}
