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
  Sparkles,
  ShieldAlert,
  Compass,
  Activity,
  CheckCircle2,
  Calendar,
  Clock,
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
      return <Sun className={`${className} text-amber-400 animate-spin`} style={{ animationDuration: '20s' }} />;
    case 'cloud-sun':
      return <CloudSun className={`${className} text-amber-300`} />;
    case 'cloud-rain':
      return <CloudRain className={`${className} text-sky-400`} />;
    case 'cloud-lightning':
      return <CloudLightning className={`${className} text-purple-400`} />;
    case 'cloud-fog':
    case 'snowflake':
      return <CloudDrizzle className={`${className} text-sky-300`} />;
    case 'cloud':
    default:
      return <Cloud className={`${className} text-slate-300`} />;
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
              Live Micro-Climate Station
            </span>
            {weatherData?.isCached && (
              <span className="text-[10px] font-bold text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded-full">
                MongoDB Cache (30m TTL)
              </span>
            )}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text">
            Agriculture Weather Intelligence
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Live OpenWeather atmospheric telemetry, Air Quality Index, 24-hour hourly forecast, 7-day micro-climate, and rule-based agronomy insights.
          </p>
        </div>

        <button
          onClick={() => refreshWeather()}
          disabled={loading}
          className="btn-glass text-xs py-2.5 px-4 rounded-2xl flex items-center gap-2 shrink-0 border border-slate-200 dark:border-white/10 hover:border-emerald-500"
        >
          <RefreshCw className={`h-4 w-4 text-emerald-500 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Refreshing...' : 'Refresh Weather'}</span>
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
          <p className="text-xs font-semibold">Loading live OpenWeather telemetry for active farm...</p>
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
                  <span>Feels like <strong>{current.feelsLike ?? '--'}°C</strong></span>
                  <span>•</span>
                  <span>H: <strong>{current.maximumTemperature ?? '--'}°</strong> L: <strong>{current.minimumTemperature ?? '--'}°</strong></span>
                </div>
              </div>

              {/* Middle: Detailed OpenWeather Atmospheric Parameters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 lg:col-span-2">
                <div className="rounded-2xl bg-slate-500/5 p-3 border border-slate-200/50 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 block flex items-center gap-1">
                    <Droplets className="h-3 w-3 text-sky-400" /> Humidity
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{current.humidity ?? '--'}%</p>
                </div>

                <div className="rounded-2xl bg-slate-500/5 p-3 border border-slate-200/50 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 block flex items-center gap-1">
                    <Wind className="h-3 w-3 text-teal-400" /> Wind Speed
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{current.windSpeed ?? '--'} km/h</p>
                </div>

                <div className="rounded-2xl bg-slate-500/5 p-3 border border-slate-200/50 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 block flex items-center gap-1">
                    <Compass className="h-3 w-3 text-purple-400" /> Direction / Gust
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{current.windDirection ?? '--'}° / {current.windGust ?? '--'} km/h</p>
                </div>

                <div className="rounded-2xl bg-slate-500/5 p-3 border border-slate-200/50 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 block flex items-center gap-1">
                    <CloudRain className="h-3 w-3 text-blue-400" /> Rain Chance
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{current.rainProbability ?? 0}% ({current.rainVolume ?? 0}mm)</p>
                </div>

                <div className="rounded-2xl bg-slate-500/5 p-3 border border-slate-200/50 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 block flex items-center gap-1">
                    <Gauge className="h-3 w-3 text-purple-400" /> Pressure
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{current.pressure ?? '--'} hPa</p>
                </div>

                <div className="rounded-2xl bg-slate-500/5 p-3 border border-slate-200/50 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 block flex items-center gap-1">
                    <Eye className="h-3 w-3 text-amber-400" /> Visibility
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{current.visibility ?? '--'} km</p>
                </div>

                <div className="rounded-2xl bg-slate-500/5 p-3 border border-slate-200/50 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 block flex items-center gap-1">
                    <Sun className="h-3 w-3 text-amber-500" /> UV / Dew Point
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{current.uvIndex ?? '--'} / {current.dewPoint ?? '--'}°C</p>
                </div>

                <div className="rounded-2xl bg-slate-500/5 p-3 border border-slate-200/50 dark:border-white/5 space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 block flex items-center gap-1">
                    <Sunrise className="h-3 w-3 text-amber-500" /> Sun Schedule
                  </span>
                  <p className="text-[11px] font-bold text-slate-900 dark:text-white">↑ {current.sunrise ?? '--'} • ↓ {current.sunset ?? '--'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. AGRICULTURE RULE ENGINE INSIGHTS CARD & AIR QUALITY CARD */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Agriculture Agronomy Insights */}
            {agriculture && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl glass-strong border border-slate-200/80 dark:border-white/10 p-6 shadow-card space-y-4 transition-all duration-300 hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="grid place-items-center rounded-xl bg-emerald-500/20 p-2 text-emerald-500">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                      Agronomy & Field Operations Insights
                    </h3>
                    <p className="text-xs text-slate-400">Deterministic rule-based agronomic recommendations</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-start gap-2.5 rounded-2xl bg-slate-500/5 p-3 border border-slate-200/40 dark:border-white/5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Disease Risk: </strong>
                      <span className="text-slate-600 dark:text-slate-300">{agriculture.diseaseRisk}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-2xl bg-slate-500/5 p-3 border border-slate-200/40 dark:border-white/5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Chemical Spray Window: </strong>
                      <span className="text-slate-600 dark:text-slate-300">{agriculture.sprayWindow}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-2xl bg-slate-500/5 p-3 border border-slate-200/40 dark:border-white/5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Irrigation Advice: </strong>
                      <span className="text-slate-600 dark:text-slate-300">{agriculture.irrigationAdvice}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-2xl bg-slate-500/5 p-3 border border-slate-200/40 dark:border-white/5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Heat & Thermal Stress: </strong>
                      <span className="text-slate-600 dark:text-slate-300">{agriculture.heatStress}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 rounded-2xl bg-slate-500/5 p-3 border border-slate-200/40 dark:border-white/5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Field Work Recommendation: </strong>
                      <span className="text-slate-600 dark:text-slate-300">{agriculture.fieldWorkRecommendation}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Air Quality Index Card */}
            {airQuality && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl glass-strong border border-slate-200/80 dark:border-white/10 p-6 shadow-card space-y-4 transition-all duration-300 hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="grid place-items-center rounded-xl bg-teal-500/20 p-2 text-teal-500">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                          Air Quality Telemetry
                        </h3>
                        <p className="text-xs text-slate-400">OpenWeather Air Pollution Sensor Data</p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      AQI: {airQuality.aqi} ({airQuality.aqiStatus})
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs">
                    <div className="rounded-2xl bg-slate-500/5 p-3 border border-slate-200/40 dark:border-white/5">
                      <span className="text-[10px] font-semibold text-slate-400 block">PM2.5</span>
                      <strong className="text-sm text-slate-800 dark:text-white">{airQuality.pm25 ?? '--'} µg/m³</strong>
                    </div>

                    <div className="rounded-2xl bg-slate-500/5 p-3 border border-slate-200/40 dark:border-white/5">
                      <span className="text-[10px] font-semibold text-slate-400 block">PM10</span>
                      <strong className="text-sm text-slate-800 dark:text-white">{airQuality.pm10 ?? '--'} µg/m³</strong>
                    </div>

                    <div className="rounded-2xl bg-slate-500/5 p-3 border border-slate-200/40 dark:border-white/5">
                      <span className="text-[10px] font-semibold text-slate-400 block">NO₂</span>
                      <strong className="text-sm text-slate-800 dark:text-white">{airQuality.no2 ?? '--'} µg/m³</strong>
                    </div>

                    <div className="rounded-2xl bg-slate-500/5 p-3 border border-slate-200/40 dark:border-white/5">
                      <span className="text-[10px] font-semibold text-slate-400 block">SO₂</span>
                      <strong className="text-sm text-slate-800 dark:text-white">{airQuality.so2 ?? '--'} µg/m³</strong>
                    </div>

                    <div className="rounded-2xl bg-slate-500/5 p-3 border border-slate-200/40 dark:border-white/5">
                      <span className="text-[10px] font-semibold text-slate-400 block">O₃</span>
                      <strong className="text-sm text-slate-800 dark:text-white">{airQuality.o3 ?? '--'} µg/m³</strong>
                    </div>

                    <div className="rounded-2xl bg-slate-500/5 p-3 border border-slate-200/40 dark:border-white/5">
                      <span className="text-[10px] font-semibold text-slate-400 block">CO</span>
                      <strong className="text-sm text-slate-800 dark:text-white">{airQuality.co ?? '--'} µg/m³</strong>
                    </div>

                    <div className="rounded-2xl bg-slate-500/5 p-3 border border-slate-200/40 dark:border-white/5 col-span-2">
                      <span className="text-[10px] font-semibold text-slate-400 block">NH₃ (Ammonia)</span>
                      <strong className="text-sm text-slate-800 dark:text-white">{airQuality.nh3 ?? '--'} µg/m³</strong>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-200/40 dark:border-white/5">
                  Optimal air quality supports uninhibited crop stomatal respiration.
                </div>
              </motion.div>
            )}
          </div>

          {/* 3. 24-HOUR HOURLY FORECAST (8 x 3-Hour slots) */}
          {hourly.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-lg font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-emerald-500" /> 24-Hour Micro-Climate Hourly Forecast (Every 3 Hours)
                </h2>
                <span className="text-xs font-semibold text-slate-400">Next 24 Hours</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
                {hourly.map((h, i) => (
                  <div key={i} className="rounded-2xl glass-strong p-3 border border-slate-200/60 dark:border-white/10 text-center space-y-1.5 transition-all hover:border-emerald-500">
                    <p className="text-[10px] font-extrabold text-slate-400">{h.time}</p>
                    <p className="text-base font-extrabold text-slate-900 dark:text-white">{h.temperature ?? '--'}°C</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Feels {h.feelsLike ?? '--'}°</p>
                    <div className="pt-1 border-t border-slate-200/40 dark:border-white/5 text-[9px] font-semibold text-slate-400 flex flex-col gap-0.5">
                      <span className="text-sky-400">☔ {h.rainChance}%</span>
                      <span>💨 {h.windSpeed ?? '--'}k</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. 7-DAY DAILY FORECAST SECTION */}
          {daily.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display text-lg font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-500" /> 7-Day Micro-Climate Projection
                </h2>
                <span className="text-xs font-semibold text-slate-400">7 Days Outlook</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
                {daily.map((day, idx) => (
                  <motion.div
                    key={day.date || idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="rounded-3xl glass-strong p-4 border border-slate-200/70 dark:border-white/10 text-center space-y-3 transition-all duration-300 hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      {day.dayName}
                    </p>

                    <div className="grid place-items-center py-1">
                      <WeatherIconRenderer icon={day.icon} className="h-8 w-8" />
                    </div>

                    <div>
                      <p className="text-lg font-extrabold font-display text-slate-900 dark:text-white">
                        {day.maximumTemperature ?? '--'}°C
                      </p>
                      <p className="text-[10px] font-semibold text-slate-400">
                        Low: {day.minimumTemperature ?? '--'}°C
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/50 dark:border-white/5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 space-y-1">
                      <div className="flex items-center justify-between">
                        <span>☔ Rain:</span>
                        <strong className="text-sky-400">{day.rainChance}%</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>💨 Wind:</span>
                        <span>{day.wind ?? '--'} km/h</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>💧 Humid:</span>
                        <span>{day.humidity ?? '--'}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* 5. INTERACTIVE LEAFLET FARM MAP */}
          <div className="rounded-3xl glass-strong border border-slate-200/80 dark:border-white/10 p-6 shadow-card space-y-4 transition-all duration-300 hover:border-emerald-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-500" /> Farm Weather Location Map
                </h3>
                <p className="text-xs text-slate-400">
                  Latitude: <strong>{location.latitude}</strong> • Longitude: <strong>{location.longitude}</strong> ({location.weatherLocationName})
                </p>
              </div>
            </div>

            <div className="h-72 w-full rounded-2xl overflow-hidden border border-slate-200/60 dark:border-white/10 z-10 relative">
              <MapContainer
                center={[location.latitude, location.longitude]}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[location.latitude, location.longitude]} icon={customMarkerIcon}>
                  <Popup>
                    <div className="p-1 space-y-1 text-xs">
                      <strong className="font-bold text-emerald-600 block">{location.farmName}</strong>
                      <p className="text-slate-600">{location.weatherLocationName}</p>
                      <hr className="my-1" />
                      <p><strong>Temp:</strong> {current.temperature}°C (Feels {current.feelsLike}°C)</p>
                      <p><strong>Humidity:</strong> {current.humidity}%</p>
                      <p><strong>Wind:</strong> {current.windSpeed} km/h</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
