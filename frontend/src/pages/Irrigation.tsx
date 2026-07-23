import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Droplets, CloudRain, Clock, Save, Calendar, Sparkles, Zap } from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { Card, Badge, SectionHeader, ProgressBar, AIResponsePanel, cn } from '@/components/ui';
import { irrigationData, waterUsage } from '@/data/mock';

export function Irrigation() {
  const { t, lang } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{t('irrigation.title')}</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('irrigation.subtitle')}</p>
      </div>

      {/* Top metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card>
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-sky-500" />
              <span className="text-xs text-slate-500 dark:text-slate-400">{t('irrigation.requirement')}</span>
            </div>
            <p className="mt-2 font-display text-3xl font-bold">{irrigationData.requirement.toLocaleString()}</p>
            <p className="text-xs text-slate-400">liters/week</p>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <div className="flex items-center gap-2">
              <CloudRain className="h-5 w-5 text-sky-400" />
              <span className="text-xs text-slate-500 dark:text-slate-400">{t('irrigation.rain.pred')}</span>
            </div>
            <p className="mt-2 font-display text-3xl font-bold">{irrigationData.rainExpected}<span className="text-base">mm</span></p>
            <p className="text-xs text-brand-600 dark:text-brand-400">Reduce 30%</p>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span className="text-xs text-slate-500 dark:text-slate-400">{t('irrigation.next')}</span>
            </div>
            <p className="mt-2 font-display text-3xl font-bold">{irrigationData.nextIrrigation}</p>
            <p className="text-xs text-slate-400">Field A · 6:00 AM</p>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="border-brand-500/20 bg-gradient-to-br from-brand-500/5 to-sky-500/5">
            <div className="flex items-center gap-2">
              <Save className="h-5 w-5 text-brand-500" />
              <span className="text-xs text-slate-500 dark:text-slate-400">{t('irrigation.saving')}</span>
            </div>
            <p className="mt-2 font-display text-3xl font-bold text-brand-600 dark:text-brand-400">{irrigationData.saving}%</p>
            <p className="text-xs text-slate-400">vs flood irrigation</p>
          </Card>
        </motion.div>
      </div>

      {/* Water usage chart */}
      <Card>
        <SectionHeader title={t('reports.water')} subtitle="liters/week" />
        <div className="mt-4 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={waterUsage}>
              <defs>
                <linearGradient id="waterG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', background: 'rgba(15,23,42,0.9)', color: '#fff', fontSize: 12 }} />
              <Area type="monotone" dataKey="liters" stroke="#3b82f6" strokeWidth={2.5} fill="url(#waterG)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Schedule */}
      <Card>
        <SectionHeader title={t('irrigation.schedule')} />
        <div className="mt-4 space-y-3">
          {irrigationData.schedule.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 rounded-2xl bg-slate-100/50 dark:bg-white/5 p-4"
            >
              <div className="grid place-items-center rounded-xl bg-sky-500/15 p-2.5 text-sky-500">
                <Droplets className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{s.zone}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.time} · {s.duration}</p>
              </div>
              <Badge variant={s.status === 'today' ? 'success' : 'info'}>
                {s.status === 'today' ? t('common.today') : 'Scheduled'}
              </Badge>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* AI tip */}
      <Card>
        <SectionHeader title={t('weather.irrigation.tip')} />
        <div className="mt-4">
          <AIResponsePanel
            t={t}
            confidence={89}
            priority="medium"
            reason={lang === 'hi'
              ? '28mm बारिश अपेक्षित, मिट्टी नमी 82%, फसल चरण और वाष्पन-उत्सर्जन डेटा आधार पर।'
              : lang === 'gu'
              ? '28mm વરસાદ આગાહી, જમીન ભેજ 82%, પાક તબક્કો અને વાષ્પન-ઉત્સર્જન ડેટા આધારે.'
              : '28mm rain expected, soil moisture at 82%, based on crop stage and evapotranspiration data.'}
            actions={[
              lang === 'hi' ? 'इस सप्ताह सिंचाई 30% कम करें' : lang === 'gu' ? 'આ અઠવાડિયે સિંચાઈ 30% ઘટાડો' : 'Reduce irrigation 30% this week',
              lang === 'hi' ? 'बारिश के बाद नमी जांचें' : lang === 'gu' ? 'વરસાદ પછી ભેજ ચકાસો' : 'Check moisture after rain',
              lang === 'hi' ? 'ड्रिप लाइन लीक जांचें' : lang === 'gu' ? 'ડ્રિપ લાઈન લીક ચકાસો' : 'Inspect drip lines for leaks',
            ]}
            impact={lang === 'hi' ? '2,760 लीटर जल बचत' : lang === 'gu' ? '2,760 લિટર જળ બચત' : 'Saves 2,760 liters water'}
            alternative={lang === 'hi' ? 'स्प्रिंकलर का उपयोग करें यदि वर्षा नहीं होती' : lang === 'gu' ? 'સ્પ્રિન્કલર વાપરો જો વરસાદ ન થાય' : 'Use sprinkler if rain does not occur'}
          />
        </div>
      </Card>
    </div>
  );
}
