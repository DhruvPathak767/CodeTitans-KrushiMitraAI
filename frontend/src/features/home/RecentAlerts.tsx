import { useApp } from '@/i18n/AppContext';
import { useWeather } from '@/context/WeatherContext';
import { useAdvisory } from '@/context/AdvisoryContext';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { AlertTriangle, CloudRain, Bug, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/cn';

interface AlertItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  description?: string;
  type: 'weather' | 'disease' | 'market';
  severity: 'warning' | 'info';
}

/**
 * Recent Alerts — aggregated from weather and advisory APIs.
 * All data is API-driven, never static.
 */
export function RecentAlerts() {
  const { t } = useApp();
  const { weatherData, loading: weatherLoading } = useWeather();
  const { advisoryData, loading: advisoryLoading } = useAdvisory();

  const loading = weatherLoading || advisoryLoading;

  if (loading) {
    return (
      <Card>
        <Skeleton className="h-5 w-1/3 mb-4" />
        <Skeleton lines={3} />
      </Card>
    );
  }

  const alerts: AlertItem[] = [];

  // Weather alerts
  const rain = weatherData?.current?.rainProbability ?? 0;
  if (rain > 60) {
    alerts.push({
      id: 'rain-alert',
      icon: <CloudRain className="h-5 w-5 text-blue-600" />,
      title: t('alerts.heavyRain'),
      description: `${rain}% ${t('alerts.rainProbability')}`,
      type: 'weather',
      severity: 'warning',
    });
  }

  // Disease alerts from advisory
  const diseaseRisk = advisoryData?.advisory?.diseaseRisk;
  if (diseaseRisk && ['high', 'critical'].includes((diseaseRisk.level || '').toLowerCase())) {
    alerts.push({
      id: 'disease-alert',
      icon: <Bug className="h-5 w-5 text-red-600" />,
      title: t('alerts.diseaseRisk'),
      description: diseaseRisk.reason || '',
      type: 'disease',
      severity: 'warning',
    });
  }

  // Advisory warning
  const warning = advisoryData?.advisory?.warning;
  if (warning) {
    alerts.push({
      id: 'advisory-warning',
      icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
      title: t('alerts.advisoryWarning'),
      description: warning,
      type: 'market',
      severity: 'info',
    });
  }

  if (alerts.length === 0) return null;

  return (
    <Card>
      <h2 className="text-xl font-bold text-slate-800 mb-4">{t('alerts.recent')}</h2>

      <ul className="space-y-3" role="list">
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className={cn(
              'flex items-start gap-3 p-3 rounded-xl',
              alert.severity === 'warning' ? 'bg-amber-50 border border-amber-100' : 'bg-slate-50 border border-slate-100',
            )}
            role="alert"
          >
            <div className="shrink-0 mt-0.5">{alert.icon}</div>
            <div className="min-w-0">
              <p className="text-base font-semibold text-slate-800">{alert.title}</p>
              {alert.description && (
                <p className="text-sm text-slate-500 mt-0.5">{alert.description}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
