import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, CheckCircle2, ArrowRight, Leaf, Ruler, Sprout, Droplets, Cpu, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '@/i18n/AppContext';
import { Card } from '@/components/ui';
import { crops, soilTypes, irrigationSources, states } from '@/data/mock';

export function FarmRegistration() {
  const { t, lang, farm, registerFarm } = useApp();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: farm?.name ?? 'Green Valley Farm',
    village: farm?.village ?? 'Anand',
    district: 'Anand',
    state: farm?.state ?? 'Gujarat',
    area: farm?.area ?? 5.5,
    crop: farm?.crop ?? 'Wheat',
    soil: farm?.soil ?? 'Black Cotton Soil',
    irrigation: farm?.irrigation ?? 'Drip',
  });

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function submit() {
    registerFarm(form);
    setDone(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    setTimeout(() => navigate('/app/dashboard'), 2000);
  }

  const selectClass = 'input cursor-pointer appearance-none';

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-bold text-brand-600 dark:text-brand-400 mb-2 border border-brand-500/20">
          <Cpu className="h-3.5 w-3.5 text-brand-500 animate-pulse" />
          <span>Farm Telemetry Node Setup</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text">{t('farm.title')}</h1>
        <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{t('farm.subtitle')}</p>
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <Card hover tilt className="p-8 glass-strong border border-white/40 dark:border-white/10 shadow-card">
              {/* Interactive Smart Farm Telemetry & Map Card */}
              <div className="relative mb-6 h-48 overflow-hidden rounded-3xl border border-brand-500/30 shadow-card group">
                <img
                  src="/images/farm_registration_hero.png"
                  alt="KrushiMitra Smart Farm Registration Telemetry"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute inset-0 grid place-items-center">
                  <motion.div
                    animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute h-20 w-20 rounded-full border-2 border-brand-500 shadow-glow"
                  />
                  <div className="grid place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-3.5 text-white shadow-glow animate-pulse">
                    <MapPin className="h-7 w-7" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 rounded-2xl glass px-3.5 py-1.5 text-xs font-bold border border-white/20 text-white backdrop-blur-md">
                  <span className="flex items-center gap-1.5">
                    <Navigation className="h-3.5 w-3.5 text-brand-400 animate-spin-slow" />
                    22.5645°N, 72.9625°E GPS Acquired
                  </span>
                </div>
                <button className="absolute right-3 top-3 rounded-xl bg-brand-600/90 hover:bg-brand-600 px-3 py-1.5 text-xs font-bold text-white shadow-glow hover:scale-105 transition-transform backdrop-blur-md border border-brand-400/30">
                  {t('farm.gps')}
                </button>
              </div>

              <div className="space-y-4">
                <Field icon={<Leaf className="h-4 w-4" />} label={t('farm.name')}>
                  <input value={form.name} onChange={(e) => set('name', e.target.value)} className="input pl-11 font-semibold" />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={t('farm.village')}>
                    <input value={form.village} onChange={(e) => set('village', e.target.value)} className="input font-semibold" />
                  </Field>
                  <Field label={t('farm.district')}>
                    <input value={form.district} onChange={(e) => set('district', e.target.value)} className="input font-semibold" />
                  </Field>
                </div>

                <Field label={t('farm.state')}>
                  <select value={form.state} onChange={(e) => set('state', e.target.value)} className={`${selectClass} font-semibold`}>
                    {states.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>

                <Field icon={<Ruler className="h-4 w-4" />} label={t('farm.area')}>
                  <input type="number" step="0.1" value={form.area} onChange={(e) => set('area', parseFloat(e.target.value) || 0)} className="input pl-11 font-semibold" />
                </Field>

                <Field icon={<Sprout className="h-4 w-4" />} label={t('farm.crop')}>
                  <select value={form.crop} onChange={(e) => set('crop', e.target.value)} className={`${selectClass} pl-11 font-semibold`}>
                    {crops.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={t('farm.soil')}>
                    <select value={form.soil} onChange={(e) => set('soil', e.target.value)} className={`${selectClass} font-semibold`}>
                      {soilTypes.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field icon={<Droplets className="h-4 w-4" />} label={t('farm.irrigation')}>
                    <select value={form.irrigation} onChange={(e) => set('irrigation', e.target.value)} className={`${selectClass} pl-11 font-semibold`}>
                      {irrigationSources.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>

                <button onClick={submit} className="btn-primary w-full shadow-glow mt-4">
                  {t('farm.complete')} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Card hover tilt className="p-12 text-center glass-strong border border-brand-500/40">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="mx-auto grid place-items-center rounded-full bg-brand-500/20 p-6 shadow-glow"
              >
                <CheckCircle2 className="h-14 w-14 text-brand-500" />
              </motion.div>
              <h2 className="mt-5 font-display text-2xl font-extrabold gradient-text">{t('farm.registered')}</h2>
              <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                {lang === 'hi' ? 'डैशबोर्ड पर ले जा रहे हैं...' : lang === 'gu' ? 'ડેશબોર્ડ પર લઈ જાય છીએ...' : 'Initializing Telemetry Dashboard...'}
              </p>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ icon, label, children }: { icon?: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-slate-500 dark:text-slate-400">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-500">{icon}</span>}
        {children}
      </div>
    </div>
  );
}
