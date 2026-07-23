import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Leaf, ScanLine, Cloud, Sprout, Droplets, Store, Scale, Landmark,
  MessageSquare, ArrowRight, Sun, CloudRain, TrendingUp, Star,
  Download, Smartphone, Shield, Zap, Globe, type LucideIcon,
} from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { LanguageSwitcher, ThemeToggle } from '@/components/Controls';
import { weatherNow, marketPrices, testimonials, cropIcon } from '@/data/mock';
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
  const heroY = useTransform(scrollY, [0, 400], [0, 80]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
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

  const featureDesc: Record<string, string> = {
    'disease.subtitle': t('disease.subtitle'),
    'weather.subtitle': t('weather.subtitle'),
    'advisory.subtitle': t('advisory.subtitle'),
    'irrigation.subtitle': t('irrigation.subtitle'),
    'market.subtitle': t('market.subtitle'),
    'sellstore.subtitle': t('sellstore.subtitle'),
    'schemes.subtitle': t('schemes.subtitle'),
    'chat.subtitle': t('chat.subtitle'),
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 z-50 flex w-full items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
      >
        <div className="flex items-center gap-2.5 rounded-2xl glass px-4 py-2">
          <div className="grid place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 p-1.5 shadow-glow">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-sm font-bold">{t('app.name')}</span>
        </div>
        <div className="flex items-center gap-1 rounded-2xl glass px-2 py-1.5">
          <ThemeToggle />
          <LanguageSwitcher />
          <button
            onClick={() => navigate(user ? '/app/dashboard' : '/login')}
            className="btn-primary ml-1 px-4 py-2 text-xs"
          >
            {t('common.login')}
          </button>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-20 text-center">
        {/* Animated background clouds */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -left-20 top-32 text-sky-200/30 dark:text-sky-500/10"
            animate={{ x: [0, 100, 0] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
            <Cloud className="h-40 w-40" />
          </motion.div>
          <motion.div
            className="absolute right-10 top-48 text-sky-200/20 dark:text-sky-500/5"
            animate={{ x: [0, -80, 0] }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          >
            <Cloud className="h-56 w-56" />
          </motion.div>
        </div>

        {/* Floating particles */}
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
              transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Leaf className="h-5 w-5 text-brand-400/30" />
            </motion.div>
          ))}
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium"
          >
            <span className="flex h-2 w-2 rounded-full bg-brand-500">
              <span className="h-full w-full rounded-full bg-brand-500 animate-pulseRing" />
            </span>
            {t('app.subtitle')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl font-extrabold leading-tight tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            {t('land.hero.title').split(' ').slice(0, -2).join(' ')}{' '}
            <span className="gradient-text">{t('land.hero.title').split(' ').slice(-2).join(' ')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-5 max-w-xl text-base text-slate-600 dark:text-slate-300 sm:text-lg text-balance"
          >
            {t('land.hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <button onClick={() => navigate(user ? '/app/dashboard' : '/login')} className="btn-primary text-base">
              {t('land.hero.cta')} <ArrowRight className="h-4 w-4" />
            </button>
            {installEvent && (
              <button onClick={handleInstall} className="btn-ghost text-base">
                <Download className="h-4 w-4" /> {t('common.install')}
              </button>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {stats.map((s) => (
              <div key={s.key} className="rounded-2xl glass p-4">
                <p className="font-display text-2xl font-bold gradient-text">{s.value}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t(s.key)}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="grid place-items-center rounded-full glass p-2"
          >
            <ArrowRight className="h-4 w-4 -rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      {/* Live Weather + Market Ticker */}
      <section className="relative z-10 -mt-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2">
          {/* Weather card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card overflow-hidden p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{t('land.weather.title')}</p>
              <span className="badge bg-brand-500/15 text-brand-700 dark:text-brand-300">● Live</span>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <WeatherIcon type={getWeatherType(weatherNow.condition)} className="h-14 w-14 text-sky-500" />
              <div>
                <p className="font-display text-4xl font-bold">{weatherNow.temp}°</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{weatherNow.condition}</p>
              </div>
              <div className="ml-auto grid grid-cols-3 gap-3 text-center">
                <div>
                  <Droplets className="mx-auto h-4 w-4 text-sky-500" />
                  <p className="mt-1 text-xs font-semibold">{weatherNow.humidity}%</p>
                  <p className="text-[10px] text-slate-400">{t('land.weather.humidity')}</p>
                </div>
                <div>
                  <Cloud className="mx-auto h-4 w-4 text-slate-400" />
                  <p className="mt-1 text-xs font-semibold">{weatherNow.wind}km/h</p>
                  <p className="text-[10px] text-slate-400">{t('land.weather.wind')}</p>
                </div>
                <div>
                  <CloudRain className="mx-auto h-4 w-4 text-sky-400" />
                  <p className="mt-1 text-xs font-semibold">{weatherNow.rainProb}%</p>
                  <p className="text-[10px] text-slate-400">{t('land.weather.rain')}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Market ticker */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="card overflow-hidden p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{t('land.market.title')}</p>
              <span className="badge bg-amber-500/15 text-amber-700 dark:text-amber-300">● Live</span>
            </div>
            <div className="mt-4 space-y-2 max-h-[120px] overflow-hidden">
              <div className="animate-[drift_25s_linear_infinite] space-y-2">
                {[...marketPrices, ...marketPrices].map((m, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-slate-100/50 dark:bg-white/5 px-3 py-1.5">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <span>{cropIcon[m.crop]}</span> {m.crop}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-semibold">₹{m.price.toLocaleString(lang === 'en' ? 'en-IN' : undefined)}</span>
                      <span className={`text-xs font-bold ${m.change >= 0 ? 'text-brand-600 dark:text-brand-400' : 'text-red-500'}`}>
                        {m.change >= 0 ? '▲' : '▼'} {Math.abs(m.change)}%
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 text-center"
          >
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t('land.features.title')}</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">{t('land.features.subtitle')}</p>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.button
                  key={f.titleKey}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  onClick={() => navigate(user ? `/app/${f.titleKey === 'nav.disease' ? 'disease' : f.titleKey === 'nav.weather' ? 'weather' : 'dashboard'}` : '/login')}
                  className="card group p-5 text-left"
                >
                  <div className={`grid place-items-center rounded-2xl bg-slate-100 dark:bg-white/5 p-3 ${f.color} transition-transform group-hover:scale-110`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-3 font-display text-base font-semibold">{t(f.titleKey)}</h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{featureDesc[f.descKey]}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact stats */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-center"
          >
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{t('land.impact.title')}</h2>
          </motion.div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {impactStats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 text-center"
              >
                <p className="font-display text-3xl font-extrabold gradient-text sm:text-4xl">{s.value}</p>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                  {lang === 'hi' ? s.label_hi : lang === 'gu' ? s.label_gu : s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-center font-display text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {t('land.testimonials.title')}
          </motion.h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((tm, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-5"
              >
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: tm.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">"{tm.text}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-sky-500 text-sm font-bold text-white">
                    {tm.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{tm.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{tm.village}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6">
          {[
            { icon: Shield, label: 'Bank-grade Security' },
            { icon: Zap, label: 'Real-time AI' },
            { icon: Globe, label: '3 Languages' },
            { icon: Smartphone, label: 'Offline PWA' },
          ].map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
            >
              <b.icon className="h-4 w-4 text-brand-500" />
              {b.label}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-600 via-brand-500 to-sky-500 p-10 text-center text-white shadow-glow sm:p-16"
        >
          <div className="pointer-events-none absolute inset-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/10"
                style={{ left: `${i * 12}%`, top: `${(i % 4) * 25}%`, width: 20 + i * 5, height: 20 + i * 5 }}
                animate={{ y: [0, -30, 0], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </div>
          <h2 className="relative font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{t('land.cta.title')}</h2>
          <p className="relative mx-auto mt-3 max-w-md text-white/80">{t('land.cta.subtitle')}</p>
          <button
            onClick={() => navigate(user ? '/app/dashboard' : '/login')}
            className="relative mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-brand-700 transition-transform hover:scale-105"
          >
            {t('land.cta.button')} <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 dark:border-white/5 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-brand-500" />
            <span className="font-display text-sm font-bold">{t('app.name')}</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">© 2026 KrishiMitra AI · National Hackathon Edition</p>
        </div>
      </footer>
    </div>
  );
}
