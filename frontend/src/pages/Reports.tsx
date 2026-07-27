import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Download, Droplets, IndianRupee, AlertTriangle, Sprout, Sparkles, FileText, Sheet, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useApp } from '@/i18n/AppContext';
import { Card, SectionHeader, StatCard } from '@/components/ui';

const profitSummary = {
  revenue: 485000,
  cost: 198000,
  profit: 287000,
  margin: 59,
};

const yieldTrend = [
  { month: 'Jan', actual: 4.2, predicted: 4.3 },
  { month: 'Feb', actual: 4.5, predicted: 4.4 },
  { month: 'Mar', actual: 4.8, predicted: 4.7 },
  { month: 'Apr', actual: 5.1, predicted: 5.0 },
  { month: 'May', actual: 5.3, predicted: 5.2 },
  { month: 'Jun', actual: null, predicted: 5.4 },
];

const waterUsage = [
  { week: 'W1', liters: 12000 },
  { week: 'W2', liters: 10500 },
  { week: 'W3', liters: 9200 },
  { week: 'W4', liters: 8800 },
];

const monthlyIncome = [
  { month: 'Jan', income: 42000 },
  { month: 'Feb', income: 38000 },
  { month: 'Mar', income: 65000 },
  { month: 'Apr', income: 58000 },
  { month: 'May', income: 72000 },
  { month: 'Jun', income: 48000 },
];

export function Reports() {
  const { t } = useApp();
  const [exporting, setExporting] = useState(false);

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

  /* ── CSV Helper ── */
  function downloadCSV() {
    const lines: string[] = [];

    // Summary
    lines.push('=== Farm Summary ===');
    lines.push('Metric,Value');
    lines.push(`Total Yield,5.3 t/ac`);
    lines.push(`Water Used,40500 L`);
    lines.push(`Revenue,₹${profitSummary.revenue}`);
    lines.push(`Cost,₹${profitSummary.cost}`);
    lines.push(`Profit,₹${profitSummary.profit}`);
    lines.push(`Margin,${profitSummary.margin}%`);
    lines.push('');

    // Yield Trend
    lines.push('=== Yield Trend (ton/acre) ===');
    lines.push('Month,Actual,Predicted');
    yieldTrend.forEach(r => lines.push(`${r.month},${r.actual ?? ''},${r.predicted}`));
    lines.push('');

    // Water Usage
    lines.push('=== Water Usage (liters/week) ===');
    lines.push('Week,Liters');
    waterUsage.forEach(r => lines.push(`${r.week},${r.liters}`));
    lines.push('');

    // Monthly Income
    lines.push('=== Monthly Income (₹) ===');
    lines.push('Month,Income');
    monthlyIncome.forEach(r => lines.push(`${r.month},${r.income}`));
    lines.push('');

    // Disease History
    lines.push('=== Disease Distribution ===');
    lines.push('Disease,Percentage');
    diseaseHistory.forEach(r => lines.push(`${r.name},${r.value}%`));
    lines.push('');

    // Disease Timeline
    lines.push('=== Disease Timeline ===');
    lines.push('Month,Cases');
    diseaseTimeline.forEach(r => lines.push(`${r.month},${r.cases}`));

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KrushiMitra_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ── PDF Helper ── */
  function downloadPDF() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const now = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    let y = 15;

    // Header with brand color
    doc.setFillColor(22, 163, 74); // green-600
    doc.rect(0, 0, pageWidth, 32, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('KrushiMitra AI — Farm Report', pageWidth / 2, 15, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${now}`, pageWidth / 2, 24, { align: 'center' });

    y = 42;
    doc.setTextColor(30, 41, 59); // slate-800

    // ── Section 1: Farm Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Farm Summary', 14, y);
    y += 3;

    autoTable(doc, {
      startY: y,
      head: [['Metric', 'Value']],
      body: [
        ['Total Yield', '5.3 ton/acre'],
        ['Water Consumed', '40,500 Liters'],
        ['Revenue', `₹${profitSummary.revenue.toLocaleString('en-IN')}`],
        ['Cost', `₹${profitSummary.cost.toLocaleString('en-IN')}`],
        ['Profit', `₹${profitSummary.profit.toLocaleString('en-IN')}`],
        ['Profit Margin', `${profitSummary.margin}%`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [22, 163, 74], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: 14, right: 14 },
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    // ── Section 2: Yield Trend
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Yield Trend (ton/acre)', 14, y);
    y += 3;

    autoTable(doc, {
      startY: y,
      head: [['Month', 'Actual', 'Predicted']],
      body: yieldTrend.map(r => [r.month, r.actual?.toString() ?? '—', r.predicted.toString()]),
      theme: 'striped',
      headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: 14, right: 14 },
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    // ── Section 3: Water Usage
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Water Usage (liters/week)', 14, y);
    y += 3;

    autoTable(doc, {
      startY: y,
      head: [['Week', 'Liters']],
      body: waterUsage.map(r => [r.week, r.liters.toLocaleString('en-IN')]),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: 14, right: 14 },
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    // ── Section 4: Monthly Income
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Monthly Income (₹)', 14, y);
    y += 3;

    autoTable(doc, {
      startY: y,
      head: [['Month', 'Income (₹)']],
      body: monthlyIncome.map(r => [r.month, `₹${r.income.toLocaleString('en-IN')}`]),
      theme: 'striped',
      headStyles: { fillColor: [245, 158, 11], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: 14, right: 14 },
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    // Check if we need a new page
    if (y > 230) {
      doc.addPage();
      y = 20;
    }

    // ── Section 5: Disease Distribution
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Disease Distribution', 14, y);
    y += 3;

    autoTable(doc, {
      startY: y,
      head: [['Disease', 'Percentage']],
      body: diseaseHistory.map(r => [r.name, `${r.value}%`]),
      theme: 'grid',
      headStyles: { fillColor: [239, 68, 68], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: 14, right: 14 },
    });

    y = (doc as any).lastAutoTable.finalY + 10;

    // ── Section 6: Disease Timeline
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Disease Timeline (Monthly Cases)', 14, y);
    y += 3;

    autoTable(doc, {
      startY: y,
      head: [['Month', 'Cases']],
      body: diseaseTimeline.map(r => [r.month, r.cases.toString()]),
      theme: 'striped',
      headStyles: { fillColor: [239, 68, 68], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { left: 14, right: 14 },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(148, 163, 184);
      doc.text(
        `KrushiMitra AI • Page ${i} of ${pageCount} • ${now}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 8,
        { align: 'center' },
      );
    }

    doc.save(`KrushiMitra_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  /* ── Export Handler ── */
  function handleExport(type: 'pdf' | 'csv') {
    setExporting(true);
    try {
      if (type === 'pdf') {
        downloadPDF();
      } else {
        downloadCSV();
      }
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight gradient-text">{t('reports.title')}</h1>
          <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{t('reports.subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleExport('pdf')} disabled={exporting} className="btn-primary text-xs shadow-glow disabled:opacity-50">
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />} {t('reports.export')} PDF
          </button>
          <button onClick={() => handleExport('csv')} disabled={exporting} className="btn-primary text-xs shadow-glow disabled:opacity-50">
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sheet className="h-4 w-4" />} Export CSV
          </button>
        </div>
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
        <SectionHeader title={t('reports.diseaseTimeline')} subtitle="Historical Monthly Scan Frequency" />
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
