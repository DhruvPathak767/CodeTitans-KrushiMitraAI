import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Camera, ImageIcon, ScanLine, Sparkles, RotateCcw,
  CheckCircle2, AlertCircle, Shield, X,
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
  const fileRef = useRef<HTMLInputElement>(null);

  const leafImages = [
    'https://images.pexels.com/photos/5944702/pexels-photo-5944702.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/5944703/pexels-photo-5944703.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/4750274/pexels-photo-4750274.jpeg?auto=compress&cs=tinysrgb&w=400',
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
    }, 3500);
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
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{t('disease.title')}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('disease.subtitle')}</p>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="border-2 border-dashed border-brand-500/30">
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="grid place-items-center rounded-3xl bg-gradient-to-br from-brand-500/20 to-sky-500/20 p-6"
                >
                  <ScanLine className="h-10 w-10 text-brand-600 dark:text-brand-400" />
                </motion.div>
                <div>
                  <h2 className="font-display text-lg font-semibold">{t('disease.upload.title')}</h2>
                  <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{t('disease.upload.hint')}</p>
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button onClick={() => fileRef.current?.click()} className="btn-primary">
                    <Upload className="h-4 w-4" /> {t('common.upload')}
                  </button>
                  <button onClick={() => useSample(leafImages[0])} className="btn-ghost border border-slate-200 dark:border-white/10">
                    <ImageIcon className="h-4 w-4" /> {t('common.gallery')}
                  </button>
                </div>
              </div>
            </Card>

            {/* Sample leaves */}
            <div className="mt-5">
              <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">{t('disease.history')}:</p>
              <div className="grid grid-cols-3 gap-3">
                {leafImages.map((url, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => useSample(url)}
                    className="group relative aspect-square overflow-hidden rounded-2xl"
                  >
                    <img src={url} alt="leaf sample" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 grid place-items-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                      <ScanLine className="h-6 w-6 text-white" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'scanning' && (
          <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card>
              <div className="flex flex-col items-center gap-6 py-8">
                <div className="relative">
                  {preview && (
                    <img src={preview} alt="scanning" className="h-56 w-56 rounded-3xl object-cover" />
                  )}
                  {/* Scan line animation */}
                  <motion.div
                    className="absolute inset-0 overflow-hidden rounded-3xl"
                  >
                    <motion.div
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-400 to-transparent shadow-glow"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </motion.div>
                  {/* Corner brackets */}
                  {['top-2 left-2 border-t-2 border-l-2', 'top-2 right-2 border-t-2 border-r-2', 'bottom-2 left-2 border-b-2 border-l-2', 'bottom-2 right-2 border-b-2 border-r-2'].map((c, i) => (
                    <div key={i} className={cn('absolute h-6 w-6 rounded-sm border-brand-400', c)} />
                  ))}
                </div>
                <div className="text-center">
                  <Sparkles className="mx-auto h-6 w-6 animate-pulse text-brand-500" />
                  <p className="mt-2 font-display text-lg font-semibold">{t('disease.scanning')}</p>
                  <div className="mt-3 flex justify-center gap-1.5">
                    {['Detecting', 'Analyzing', 'Classifying'].map((s, i) => (
                      <motion.span
                        key={s}
                        className="rounded-full bg-brand-500/15 px-3 py-1 text-xs text-brand-700 dark:text-brand-300"
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
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            <Card className="overflow-hidden">
              <div className="flex flex-col gap-5 sm:flex-row">
                {preview && (
                  <div className="relative shrink-0">
                    <img src={preview} alt="analyzed" className="h-40 w-40 rounded-2xl object-cover" />
                    <div className="absolute -bottom-2 -right-2 grid place-items-center rounded-full bg-red-500 p-2 text-white shadow-lg">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={result.severity === 'high' ? 'error' : 'warning'}>{t('disease.scan.detected')}</Badge>
                    <Badge variant="neutral">{t(`common.${result.severity}`)} {t('common.severity')}</Badge>
                  </div>
                  <h2 className="mt-2 font-display text-2xl font-bold">{result[nameKey]}</h2>
                  <div className="mt-3">
                    <ConfidenceMeter value={result.confidence} label={t('disease.confidence')} />
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-red-500/20">
                <div className="flex items-center gap-2">
                  <span className="grid place-items-center rounded-xl bg-red-500/15 p-2 text-red-500">
                    <AlertCircle className="h-4 w-4" />
                  </span>
                  <h3 className="font-semibold">{t('disease.treatment')}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{result[treatmentKey]}</p>
              </Card>
              <Card className="border-brand-500/20">
                <div className="flex items-center gap-2">
                  <span className="grid place-items-center rounded-xl bg-brand-500/15 p-2 text-brand-500">
                    <Shield className="h-4 w-4" />
                  </span>
                  <h3 className="font-semibold">{t('disease.prevention')}</h3>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{result[preventionKey]}</p>
              </Card>
            </div>

            <div className="flex justify-center gap-3">
              <button onClick={reset} className="btn-primary">
                <RotateCcw className="h-4 w-4" /> {t('disease.scanAgain')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
