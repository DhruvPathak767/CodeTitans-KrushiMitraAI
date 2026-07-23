import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, CheckCircle2, ArrowRight, Leaf, Ruler, Sprout, Droplets } from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { Card, cn } from '@/components/ui';
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
    setTimeout(() => navigate('/app/dashboard'), 2000);
  }

  const selectClass = 'input cursor-pointer appearance-none';

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{t('farm.title')}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('farm.subtitle')}</p>
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <Card className="p-7">
              {/* Map preview */}
              <div className="relative mb-6 h-40 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500/20 via-sky-500/15 to-soil-500/20">
                <div className="absolute inset-0 grid place-items-center">
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute h-16 w-16 rounded-full border-2 border-brand-500"
                  />
                  <div className="grid place-items-center rounded-full bg-brand-600 p-3 text-white shadow-glow">
                    <MapPin className="h-6 w-6" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 rounded-xl glass px-3 py-1.5 text-xs">
                  <span className="flex items-center gap-1.5">
                    <Navigation className="h-3 w-3 text-brand-500" />
                    22.5645°N, 72.9625°E
                  </span>
                </div>
                <button className="absolute right-3 top-3 rounded-xl bg-brand-600 px-3 py-1.5 text-xs font-medium text-white">
                  {t('farm.gps')}
                </button>
              </div>

              <div className="space-y-4">
                <Field icon={<Leaf className="h-4 w-4" />} label={t('farm.name')}>
                  <input value={form.name} onChange={(e) => set('name', e.target.value)} className="input pl-11" />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={t('farm.village')}>
                    <input value={form.village} onChange={(e) => set('village', e.target.value)} className="input" />
                  </Field>
                  <Field label={t('farm.district')}>
                    <input value={form.district} onChange={(e) => set('district', e.target.value)} className="input" />
                  </Field>
                </div>

                <Field label={t('farm.state')}>
                  <select value={form.state} onChange={(e) => set('state', e.target.value)} className={selectClass}>
                    {states.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>

                <Field icon={<Ruler className="h-4 w-4" />} label={t('farm.area')}>
                  <input type="number" step="0.1" value={form.area} onChange={(e) => set('area', parseFloat(e.target.value) || 0)} className="input pl-11" />
                </Field>

                <Field icon={<Sprout className="h-4 w-4" />} label={t('farm.crop')}>
                  <select value={form.crop} onChange={(e) => set('crop', e.target.value)} className={`${selectClass} pl-11`}>
                    {crops.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={t('farm.soil')}>
                    <select value={form.soil} onChange={(e) => set('soil', e.target.value)} className={selectClass}>
                      {soilTypes.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field icon={<Droplets className="h-4 w-4" />} label={t('farm.irrigation')}>
                    <select value={form.irrigation} onChange={(e) => set('irrigation', e.target.value)} className={`${selectClass} pl-11`}>
                      {irrigationSources.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>

                <button onClick={submit} className="btn-primary w-full">
                  {t('farm.complete')} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="p-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="mx-auto grid place-items-center rounded-full bg-brand-500/15 p-5"
              >
                <CheckCircle2 className="h-12 w-12 text-brand-500" />
              </motion.div>
              <h2 className="mt-4 font-display text-xl font-bold">{t('farm.registered')}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {lang === 'hi' ? 'डैशबोर्ड पर ले जा रहे हैं...' : lang === 'gu' ? 'ડેશબોર્ડ પર લઈ જાય છીએ...' : 'Taking you to dashboard...'}
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
      <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
        {children}
      </div>
    </div>
  );
}
