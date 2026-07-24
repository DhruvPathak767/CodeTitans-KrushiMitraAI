import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, ImageIcon, ScanLine, Sparkles, RotateCcw,
  AlertCircle, Shield, Cpu, Zap, CheckCircle2,
} from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { Card, Badge, SectionHeader, ConfidenceMeter, cn } from '@/components/ui';
import { diseases } from '@/data/mock';

type Phase = 'idle' | 'scanning' | 'result';

export function DiseaseDetection() {
  const { t, lang } = useApp();
  const langSuffix = lang === 'hi' ? '_hi' : lang === 'gu' ? '_gu' : '';
  const [phase, setPhase] = useState<Phase>('idle');
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<typeof diseases[0] | null>(null);
  const [remedyTab, setRemedyTab] = useState<'organic' | 'chemical'>('organic');
  const fileRef = useRef<HTMLInputElement>(null);

  const leafImages = [
    '/images/crop_disease_leaf_scan.png',
    '/images/crop_advisory_field.png',
    '/images/smart_farm_planner.png',
  ];

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target?.result as string);
        startScan();
      };
      reader.readAsDataURL(file);
    }
  }

  function useSample(url: string) {
    setPreview(url);
    startScan();
  }

  function startScan() {
    setPhase('scanning');
    setTimeout(() => {
      setResult(diseases[Math.floor(Math.random() * diseases.length)]);
      setPhase('result');
    }, 3200);
  }

  function reset() {
    setPhase('idle');
    setPreview(null);
    setResult(null);
  }

  const nameKey = `name${langSuffix}` as 'name' | 'name_hi' | 'name_gu';
  const treatmentKey = `treatment${langSuffix}` as 'treatment' | 'treatment_hi' | 'treatment_gu';
  const preventionKey = `prevention${langSuffix}` as 'prevention' | 'prevention_hi' | 'prevention_gu';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-bold text-brand-600 dark:text-brand-400 mb-2 border border-brand-500/20">
            <Cpu className="h-3.5 w-3.5 text-brand-500 animate-pulse" />
            <span>Neural Leaf Diagnostic System v3.0</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text">{t('disease.title')}</h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{t('disease.subtitle')}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card hover tilt className="border-2 border-dashed border-brand-500/40 bg-gradient-to-br from-brand-500/5 via-slate-900/5 to-sky-500/5">
              <div className="flex flex-col items-center gap-5 py-12 text-center">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="grid place-items-center rounded-3xl bg-gradient-to-br from-brand-500/20 to-sky-500/20 p-6 shadow-glow border border-brand-500/30"
                >
                  <ScanLine className="h-12 w-12 text-brand-600 dark:text-brand-400" />
                </motion.div>
                <div>
                  <h2 className="font-display text-xl font-extrabold">{t('disease.upload.title')}</h2>
                  <p className="mt-1.5 max-w-md text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t('disease.upload.hint')}</p>
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button onClick={() => fileRef.current?.click()} className="btn-primary shadow-glow">
                    <Upload className="h-4 w-4" /> {t('common.upload')}
                  </button>
                  <button onClick={() => useSample(leafImages[0])} className="btn-glass border-brand-500/30">
                    <ImageIcon className="h-4 w-4 text-brand-500" /> Demo Sample Leaf
                  </button>
                </div>
              </div>
            </Card>

            {/* Sample Gallery */}
            <div className="mt-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Sample Diagnostic Scans:</p>
              <div className="grid grid-cols-3 gap-4">
                {leafImages.map((url, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.04 }}
                    onClick={() => useSample(url)}
                    className="group relative aspect-square overflow-hidden rounded-2xl glass border border-white/40 dark:border-white/10 shadow-card"
                  >
                    <img src={url} alt="leaf sample" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 grid place-items-center bg-brand-950/60 opacity-0 transition-all group-hover:opacity-100">
                      <ScanLine className="h-8 w-8 text-brand-400 animate-pulse" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'scanning' && (
          <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card hover tilt className="border-brand-500/40 bg-slate-900/60">
              <div className="flex flex-col items-center gap-6 py-10">
                <div className="relative">
                  {preview && (
                    <img src={preview} alt="scanning" className="h-64 w-64 rounded-3xl object-cover border-2 border-brand-500/40 shadow-glow" />
                  )}
                  {/* Laser Scan Sweep Animation */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    <div className="absolute left-0 right-0 h-2 bg-gradient-to-r from-transparent via-brand-400 to-transparent shadow-glow-strong animate-laserScan" />
                  </div>

                  {/* Futuristic Corner Brackets */}
                  <div className="absolute top-2 left-2 h-6 w-6 border-t-2 border-l-2 border-brand-400 rounded-tl" />
                  <div className="absolute top-2 right-2 h-6 w-6 border-t-2 border-r-2 border-brand-400 rounded-tr" />
                  <div className="absolute bottom-2 left-2 h-6 w-6 border-b-2 border-l-2 border-brand-400 rounded-bl" />
                  <div className="absolute bottom-2 right-2 h-6 w-6 border-b-2 border-r-2 border-brand-400 rounded-br" />
                </div>

                <div className="text-center">
                  <Sparkles className="mx-auto h-7 w-7 animate-spin-slow text-brand-500 mb-2" />
                  <p className="font-display text-xl font-extrabold gradient-text">{t('disease.scanning')}</p>
                  <div className="mt-4 flex justify-center gap-2">
                    {['Neural Vision', 'Cellular Analysis', 'Disease Matching'].map((s, i) => (
                      <motion.span
                        key={s}
                        className="rounded-full glass px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-400 border border-brand-500/30"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {phase === 'result' && result && (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <Card hover tilt className="border-brand-500/40 bg-gradient-to-br from-brand-500/10 via-slate-900/5 to-sky-500/10">
              <div className="flex flex-col gap-6 sm:flex-row items-center">
                {preview && (
                  <div className="relative shrink-0">
                    <img src={preview} alt="analyzed" className="h-44 w-44 rounded-3xl object-cover border border-white/40 dark:border-white/10 shadow-card" />
                    <div className="absolute -bottom-2 -right-2 grid place-items-center rounded-2xl bg-red-500 p-2.5 text-white shadow-glow">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                  </div>
                )}
                <div className="flex-1 space-y-3 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <Badge variant={result.severity === 'high' ? 'error' : 'warning'} pulse>{t('disease.scan.detected')}</Badge>
                    <Badge variant="neutral">{t(`common.${result.severity}`)} {t('common.severity')}</Badge>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold gradient-text">{result[nameKey]}</h2>
                  <div className="pt-2">
                    <ConfidenceMeter value={result.confidence} label={t('disease.confidence')} />
                  </div>
                </div>
              </div>
            </Card>

            {/* Treatment Selector Tabs */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setRemedyTab('organic')}
                className={cn('btn-glass text-xs px-5 py-2.5', remedyTab === 'organic' && 'border-brand-500 bg-brand-500/15 text-brand-600 dark:text-brand-400 font-bold')}
              >
                🌿 Organic Remedy
              </button>
              <button
                onClick={() => setRemedyTab('chemical')}
                className={cn('btn-glass text-xs px-5 py-2.5', remedyTab === 'chemical' && 'border-sky-500 bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold')}
              >
                🧪 Chemical Treatment
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card hover tilt className="border-red-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <span className="grid place-items-center rounded-2xl bg-red-500/20 p-2.5 text-red-500 shadow-glow">
                    <Zap className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-base font-bold">{t('disease.treatment')} ({remedyTab})</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {result[treatmentKey]} {remedyTab === 'organic' ? '(Neem extract 5ml/L + Bio-fungicide spray)' : '(Apply Copper Oxychloride @ 2.5g/L)'}
                </p>
              </Card>

              <Card hover tilt className="border-brand-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <span className="grid place-items-center rounded-2xl bg-brand-500/20 p-2.5 text-brand-500 shadow-glow">
                    <Shield className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-base font-bold">{t('disease.prevention')} Protocol</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{result[preventionKey]}</p>
              </Card>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <button onClick={reset} className="btn-primary shadow-glow">
                <RotateCcw className="h-4 w-4" /> {t('disease.scanAgain')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
