import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Droplets, CloudRain, Clock, Save, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import { useApp } from '@/i18n/AppContext';
import { Card, Badge, SectionHeader, AIResponsePanel } from '@/components/ui';
import { irrigationData, waterUsage } from '@/data/mock';

export function Irrigation() {
  const { t, lang } = useApp();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text">{t('irrigation.title')}</h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{t('irrigation.subtitle')}</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl glass px-4 py-2 border border-brand-500/30">
          <Droplets className="h-4 w-4 text-sky-500 animate-pulse" />
          <span className="text-xs font-bold">Soil Moisture: <span className="text-brand-500">82% (OPTIMAL)</span></span>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card hover tilt>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-500/15 text-sky-500 shadow-glow-sky">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('irrigation.requirement')}</span>
              <p className="font-display text-2xl font-extrabold mt-0.5">{irrigationData.requirement.toLocaleString()}</p>
              <p className="text-[10px] text-slate-400 font-semibold">liters / week</p>
            </div>
          </div>
        </Card>

        <Card hover tilt>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-400/15 text-sky-400 shadow-glow-sky">
              <CloudRain className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('irrigation.rain.pred')}</span>
              <p className="font-display text-2xl font-extrabold mt-0.5">{irrigationData.rainExpected}<span className="text-sm font-normal">mm</span></p>
              <p className="text-[10px] font-bold text-brand-500">Reduce 30% Drip Time</p>
            </div>
          </div>
        </Card>

        <Card hover tilt>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-500 shadow-glow-gold">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('irrigation.next')}</span>
              <p className="font-display text-2xl font-extrabold mt-0.5">{irrigationData.nextIrrigation}</p>
              <p className="text-[10px] text-slate-400 font-semibold">Field A • 6:00 AM</p>
            </div>
          </div>
        </Card>

        <Card hover tilt className="border-brand-500/30 bg-gradient-to-br from-brand-500/10 to-sky-500/10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-brand-500/20 text-brand-500 shadow-glow">
              <Save className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('irrigation.saving')}</span>
              <p className="font-display text-2xl font-extrabold text-brand-600 dark:text-brand-400 mt-0.5">{irrigationData.saving}%</p>
              <p className="text-[10px] text-slate-400 font-semibold">vs traditional flooding</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Water Usage Telemetry Curve */}
      <Card hover tilt>
        <SectionHeader title={t('reports.water')} subtitle="Litres Water Delivered per Week" />
        <div className="mt-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={waterUsage}>
              <defs>
                <linearGradient id="waterG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(15,23,42,0.9)', color: '#fff', fontSize: 12 }} />
              <Area type="monotone" dataKey="liters" stroke="#3b82f6" strokeWidth={3} fill="url(#waterG)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Drip Irrigation Schedule */}
      <Card hover tilt>
        <SectionHeader title={t('irrigation.schedule')} subtitle="Automated Pump & Drip Valve Matrix" />
        <div className="mt-4 space-y-3">
          {irrigationData.schedule.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between gap-4 rounded-2xl glass p-4 border border-white/40 dark:border-white/10 hover:border-brand-500/40"
            >
              <div className="flex items-center gap-3">
                <div className="grid place-items-center rounded-2xl bg-sky-500/15 p-3 text-sky-500 shadow-glow-sky">
                  <Droplets className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold">{s.zone}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.time} • {s.duration}</p>
                </div>
              </div>
              <Badge variant={s.status === 'today' ? 'success' : 'info'} pulse>
                {s.status === 'today' ? t('common.today') : 'Scheduled'}
              </Badge>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* AI Irrigation Recommendation Panel */}
      <Card hover tilt>
        <SectionHeader title={t('weather.irrigation.tip')} />
        <div className="mt-4">
          <AIResponsePanel
            t={t}
            confidence={89}
            priority="medium"
            reason={lang === 'hi'
              ? '28mm बारिश अपेक्षित, मिट्टी नमी 82%, फसल चरण और वाष्पन-उत्सर्जन डेटा आधार पर।'
              : lang === 'gu'
              ? 'વરસાદ ૨૮mm હોવાની આગાહી, જમીન ભેજ ૮૨%, પાક તબક્કો અને બાષ્પીભવન ડેટા આધારે.'
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
