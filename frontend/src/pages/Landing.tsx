import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Leaf, ScanLine, Cloud, Sprout, Droplets, Store, Scale, Landmark,
  MessageSquare, ArrowRight, Sun, CloudRain, TrendingUp, Star,
  Download, Smartphone, Shield, Zap, Globe, Sparkles, Radio, Cpu, Activity,
  type LucideIcon,
} from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { LanguageSwitcher, ThemeToggle } from '@/components/Controls';
import { FutureBackground } from '@/components/FutureBackground';
import { CursorSpotlight } from '@/components/CursorSpotlight';
import { CropGlobe3D } from '@/components/3d/CropGlobe3D';

const testimonials = [
  { name: 'Ramesh Patel', village: 'Anand, Gujarat', text: 'KrishiMitra detected leaf blight early and saved 30% of my tomato crop. The AI advisory is remarkably accurate.', rating: 5 },
  { name: 'Sunita Devi', village: 'Kota, Rajasthan', text: 'The market intelligence feature helped me sell wheat at the right time. I earned ₹40,000 more this season.', rating: 5 },
  { name: 'Gurpreet Singh', village: 'Ludhiana, Punjab', text: 'Smart irrigation cut my water usage by 25% while maintaining yield. The weekly planner keeps me organized.', rating: 5 },
  { name: 'Lakshmi Naidu', village: 'Coimbatore, Tamil Nadu', text: 'Voice assistant in Tamil is a game changer. I get crop advice without typing. Government schemes section got me PM-Kisan benefits.', rating: 5 },
];
import { WeatherIcon, getWeatherType } from '@/components/WeatherIcons';

const stats = [
  { value: '12,400+', key: 'land.hero.stat1' },
  { value: '48,200+', key: 'land.hero.stat2' },
  { value: '94%', key: 'land.hero.stat3' },
  { value: '3', key: 'land.hero.stat4' },
];

const features: { icon: LucideIcon; titleKey: string; descKey: string; color: string }[] = [
  { icon: ScanLine, titleKey: 'nav.disease', descKey: 'disease.subtitle', color: 'text-rose-500' },
  { icon: Cloud, titleKey: 'nav.weather', descKey: 'weather.subtitle', color: 'text-sky-500' },
  { icon: Sprout, titleKey: 'nav.advisory', descKey: 'advisory.subtitle', color: 'text-brand-500' },
  { icon: Droplets, titleKey: 'nav.irrigation', descKey: 'irrigation.subtitle', color: 'text-sky-400' },
  { icon: Store, titleKey: 'nav.market', descKey: 'market.subtitle', color: 'text-amber-500' },
  { icon: Scale, titleKey: 'nav.sellstore', descKey: 'sellstore.subtitle', color: 'text-soil-500' },
  { icon: Landmark, titleKey: 'nav.schemes', descKey: 'schemes.subtitle', color: 'text-brand-600' },
  { icon: MessageSquare, titleKey: 'nav.chatbot', descKey: 'chat.subtitle', color: 'text-sky-600' },
];

const impactStats = [
  { value: '+28%', label: 'Avg Yield Increase', label_hi: 'औसत उपज वृद्धि', label_gu: 'સરેરાશ ઉપજ વધારો' },
  { value: '-23%', label: 'Water Usage Reduction', label_hi: 'जल उपयोग में कमी', label_gu: 'જળ વપરાશમાં ઘટાડો' },
  { value: '+₹42K', label: 'Extra Income/Season', label_hi: 'अतिरिक्त आय/सत्र', label_gu: 'વધારાની આવક/સત્ર' },
  { value: '94%', label: 'Disease Detection Accuracy', label_hi: 'रोग पहचान सटीकता', label_gu: 'રોગ શોધ ચોક્સાઈ' },
];

export function Landing() {
  const { t, lang, user } = useApp();
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, 60]);
  const [installEvent, setInstallEvent] = useState<any>(null);

  useEffect(() => {
    function handler(e: any) {
      e.preventDefault();
      setInstallEvent(e);
    }
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function handleInstall() {
    if (installEvent) {
      installEvent.prompt();
      installEvent.userChoice.then(() => setInstallEvent(null));
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden relative">
      {/* Background Layers */}
      <FutureBackground />
      <CursorSpotlight />

      {/* Top Floating Glass Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 z-50 flex w-full items-center justify-between px-4 py-4 sm:px-8 lg:px-12"
      >
        <div className="flex items-center gap-3 rounded-2xl glass-strong px-4 py-2 border border-white/40 dark:border-white/10 shadow-card">
          <div className="grid place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 p-2 shadow-glow">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-base font-extrabold tracking-tight gradient-text">{t('app.name')}</span>
        </div>

        <div className="flex items-center gap-2 rounded-2xl glass-strong px-2.5 py-2 border border-white/40 dark:border-white/10 shadow-card">
          <ThemeToggle />
          <LanguageSwitcher />
          <button
            onClick={() => navigate(user ? '/app/dashboard' : '/login')}
            className="btn-primary ml-1 px-5 py-2.5 text-xs shadow-glow"
          >
            {user ? t('nav.dashboard') : t('common.login')}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-28 pb-16 text-center">
        <motion.div style={{ y: heroY }} className="mx-auto max-w-5xl z-10">
          {/* Futuristic AI Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 rounded-full glass-strong px-4 py-1.5 text-xs font-bold text-brand-700 dark:text-brand-300 border border-brand-500/30 shadow-glow mb-6"
          >
            <Sparkles className="h-4 w-4 text-brand-500 animate-spin-slow" />
            <span>Future Farming Intelligence OS 3.0</span>
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-ping" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-display text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl text-balance leading-tight"
          >
            {t('land.hero.title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-xl text-balance leading-relaxed"
          >
            {t('land.hero.desc')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate(user ? '/app/dashboard' : '/login')}
              className="btn-primary text-base px-8 py-4 shadow-glow-strong"
            >
              {t('land.hero.cta')}
              <ArrowRight className="h-5 w-5" />
            </button>
            {installEvent && (
              <button
                onClick={handleInstall}
                className="btn-glass text-base px-6 py-4 border-brand-500/40"
              >
                <Download className="h-5 w-5 text-brand-500" />
                Install PWA App
              </button>
            )}
          </motion.div>

          {/* 3D Earth Globe & Connected Node Network Visualizer with AI Agriculture Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-12 relative mx-auto max-w-5xl rounded-3xl glass-strong p-6 sm:p-8 border border-white/50 dark:border-white/10 shadow-card overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
              {/* AI Agriculture Hero Photography Card */}
              <div className="lg:col-span-6 relative group overflow-hidden rounded-3xl border border-brand-500/30 shadow-glow">
                <img
                  src="/images/hero_agriculture_ai.png"
                  alt="KrishiMitra AI Precision Agriculture"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-5 flex flex-col justify-end text-left">
                  <div className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-[10px] font-bold text-brand-400 mb-1 border border-brand-500/30">
                    <Sparkles className="h-3 w-3 text-brand-400 animate-pulse" /> Precision Drone & Telemetry Node
                  </div>
                  <p className="text-sm font-extrabold text-white">AI Field Companion for Indian Agriculture</p>
                </div>
              </div>

              {/* 3D Crop Globe & Telemetry Nodes */}
              <div className="lg:col-span-6 space-y-4 text-left">
                <div className="relative rounded-2xl glass p-2 border border-sky-500/20">
                  <CropGlobe3D className="w-full h-44" />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 glass px-3 py-1 rounded-full text-[10px] font-bold text-brand-600 dark:text-brand-400">
                    🌐 Live ISRO Satellite Telemetry
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  <div className="flex items-center gap-3 glass p-3 rounded-2xl border border-brand-500/30">
                    <Radio className="h-5 w-5 text-sky-500 animate-pulse shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Soil Moisture & Evapotranspiration Radar</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Real-time micro-climate sensors</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 glass p-3 rounded-2xl border border-brand-500/30">
                    <Cpu className="h-5 w-5 text-brand-500 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">94% Neural Disease Leaf Vision</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Instant AI diagnosis & organic remedies</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 glass p-3 rounded-2xl border border-amber-500/30">
                    <Activity className="h-5 w-5 text-amber-500 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">APMC Mandi Price Predictor</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Sell vs Store Financial Decision Engine</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats Ticker */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="glass-card p-4 text-center"
              >
                <p className="text-3xl font-extrabold font-display gradient-text">{s.value}</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{t(s.key)}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Core Features Grid Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge variant-gold mb-3">Next-Gen Agricultural Tools</span>
          <h2 className="font-display text-3xl font-extrabold sm:text-5xl gradient-text">
            Precision Intelligence for Every Indian Field
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Empowering farmers with AI satellite telemetry, micro-climate weather forecasts, and disease diagnostics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card group cursor-pointer"
                onClick={() => navigate(user ? '/app/dashboard' : '/login')}
              >
                <div className="grid place-items-center rounded-2xl bg-gradient-to-br from-brand-500/15 to-sky-500/15 p-4 w-14 h-14 mb-4 border border-white/20 dark:border-white/10 group-hover:scale-110 transition-transform shadow-glow">
                  <Icon className={`h-7 w-7 ${f.color}`} />
                </div>
                <h3 className="font-display text-lg font-bold group-hover:text-brand-500 transition-colors">
                  {t(f.titleKey)}
                </h3>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {t(f.descKey)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Interactive Agricultural Feature Showcase Gallery */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="badge variant-success mb-3 animate-float">Visual Smart Agriculture</span>
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl gradient-text">
            Experience KrishiMitra's AI Platform in Action
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Real-time telemetry, automated drip irrigation, AI crop diagnosis, and intelligent mandi price forecasting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'AI Farm Schedule Planner', img: '/images/smart_farm_planner.png', tag: 'Smart Calendar' },
            { title: 'Agronomic Field Advisory', img: '/images/crop_advisory_field.png', tag: 'Crop Health' },
            { title: 'Precision Drip Sensors', img: '/images/smart_irrigation_sensor.png', tag: 'IoT Irrigation' },
            { title: 'APMC Market Mandi Intelligence', img: '/images/market_fresh_produce.png', tag: 'Mandi Prices' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-brand-500/30 shadow-card h-64 cursor-pointer"
              onClick={() => navigate(user ? '/app/dashboard' : '/login')}
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-5 flex flex-col justify-end text-left">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-400 glass px-2.5 py-0.5 rounded-full w-fit mb-1 border border-brand-500/30 backdrop-blur-md">
                  <Sparkles className="h-3 w-3 text-brand-400 animate-pulse" /> {item.tag}
                </span>
                <h3 className="font-display text-base font-bold text-white group-hover:text-brand-300 transition-colors">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Impact Stats */}
      <section className="relative z-10 bg-gradient-to-r from-brand-900/30 via-slate-900/40 to-sky-900/30 py-16 backdrop-blur-2xl border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {impactStats.map((st, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                <p className="font-display text-4xl sm:text-5xl font-black gradient-text-gold">{st.value}</p>
                <p className="mt-2 text-xs font-semibold text-slate-300">
                  {lang === 'hi' ? st.label_hi : lang === 'gu' ? st.label_gu : st.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="badge variant-success mb-3">Farmer Testimonials</span>
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl gradient-text">Trusted Across Indian Villages</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {testimonials.map((tItem, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card">
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(tItem.rating)].map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs italic text-slate-600 dark:text-slate-300 leading-relaxed mb-4">"{tItem.text}"</p>
              <div>
                <p className="text-sm font-bold">{tItem.name}</p>
                <p className="text-[10px] text-slate-400">{tItem.village}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/20 dark:border-white/10 glass-strong py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-brand-500" />
            <span className="font-bold font-display text-slate-900 dark:text-white">KrishiMitra AI</span>
            <span>— Precision Agriculture Platform</span>
          </div>
          <p>© 2026 KrishiMitra AI. Built for Indian Farmers.</p>
        </div>
      </footer>
    </div>
  );
}
