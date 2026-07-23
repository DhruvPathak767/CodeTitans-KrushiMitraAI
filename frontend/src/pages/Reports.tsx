import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Download, Droplets, IndianRupee, AlertTriangle, Sprout, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '@/i18n/AppContext';
import { Card, SectionHeader, StatCard } from '@/components/ui';
import { yieldTrend, waterUsage, monthlyIncome, profitSummary } from '@/data/mock';

export function Reports() {
  const { t } = useApp();

  const diseaseHistory = [
    { name: 'Leaf Blight', value: 35, color: '#ef4444' },
    { name: 'Bollworm', value: 25, color: '#f59e0b' },
    { name: 'Powdery Mildew', value: 20, color: '#3b82f6' },
    { name: 'Healthy', value: 20, color: '#22c55e' },
  ];

  const diseaseTimeline = [
    { month: 'Jan', cases: 2 }, { month: 'Feb', cases: 1 },
    { month: 'Mar', cases: 4 }, { month: 'Apr', cases: 3 },
    { month: 'May', cases: 5 }, { month: 'Jun', cases: 2 },
  ];

  function handleExport() {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
    alert('Official Agricultural Summary Report (PDF & CSV) generated!');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text">{t('reports.title')}</h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{t('reports.subtitle')}</p>
        </div>
        <button onClick={handleExport} className="btn-primary text-xs shadow-glow">
          <Download className="h-4 w-4" /> {t('reports.export')} PDF & CSV
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t('reports.yield')} value="5.3 t/ac" icon={<Sprout className="h-5 w-5" />} accent="brand" trend="+8% vs last year" trendUp delay={0} />
        <StatCard label={t('reports.water')} value="40.5K L" icon={<Droplets className="h-5 w-5" />} accent="sky" trend="-23% vs flood" trendUp delay={0.05} />
        <StatCard label={t('reports.income')} value={`₹${(profitSummary.revenue / 1000).toFixed(0)}K`} icon={<IndianRupee className="h-5 w-5" />} accent="amber" trend="+15%" trendUp delay={0.1} />
        <StatCard label={t('reports.disease')} value="17 cases" icon={<AlertTriangle className="h-5 w-5" />} accent="rose" trend="6 months" delay={0.15} />
      </div>

      {/* Yield + Water Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card hover tilt>
          <SectionHeader title={t('reports.yield')} subtitle="ton / acre • Actual vs Satellite Prediction" />
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yieldTrend}>
                <defs>
                  <linearGradient id="rYield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(15,23,42,0.9)', color: '#fff', fontSize: 12 }} />
                <Area type="monotone" dataKey="predicted" stroke="#38bdf8" strokeWidth={2} strokeDasharray="4 4" fill="none" />
                <Area type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={3} fill="url(#rYield)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card hover tilt>
          <SectionHeader title={t('reports.water')} subtitle="liters / week Delivered" />
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(15,23,42,0.9)', color: '#fff', fontSize: 12 }} />
                <Bar dataKey="liters" fill="#3b82f6" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Revenue + Disease Pie */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card hover tilt>
          <SectionHeader title={t('reports.income')} subtitle="₹ Revenue Trajectory / Month" />
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyIncome}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(15,23,42,0.9)', color: '#fff', fontSize: 12 }} />
                <Line type="monotone" dataKey="income" stroke="#f59e0b" strokeWidth={3.5} dot={{ r: 5, fill: '#f59e0b' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card hover tilt>
          <SectionHeader title={t('reports.disease')} subtitle="Crop Health Distribution" />
          <div className="mt-4 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={diseaseHistory} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4}>
                  {diseaseHistory.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(15,23,42,0.9)', color: '#fff', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Disease Timeline */}
      <Card hover tilt>
        <SectionHeader title="Disease Incidents Log" subtitle="Historical Monthly Scan Frequency" />
        <div className="mt-4 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={diseaseTimeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b820" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(15,23,42,0.9)', color: '#fff', fontSize: 12 }} />
              <Bar dataKey="cases" fill="#ef4444" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
