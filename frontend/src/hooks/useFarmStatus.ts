import { useMemo } from 'react';
import { useWeather } from '@/context/WeatherContext';
import { useAdvisory } from '@/context/AdvisoryContext';
import { useFarm } from '@/context/FarmContext';
import { useApp } from '@/i18n/AppContext';

export interface FarmStatusItem {
  id: string;
  emoji: string;
  message: string;
  type: 'weather' | 'irrigation' | 'disease' | 'fertilizer' | 'market';
  severity: 'info' | 'warning' | 'success';
}

/**
 * Aggregates weather + advisory + farm data into dynamic status items
 * for the Home page hero section. All data is API-driven — never static.
 */
export function useFarmStatus(): {
  items: FarmStatusItem[];
  loading: boolean;
} {
  const { t } = useApp();
  const { weatherData, loading: weatherLoading } = useWeather();
  const { advisoryData, loading: advisoryLoading } = useAdvisory();
  const { activeFarm } = useFarm();

  const loading = weatherLoading || advisoryLoading;

  const items = useMemo(() => {
    const status: FarmStatusItem[] = [];

    if (!weatherData && !advisoryData) return status;

    // Weather status
    const rain = weatherData?.current?.rainProbability ?? 0;
    if (rain > 50) {
      status.push({
        id: 'rain-high',
        emoji: '🌧️',
        message: t('farmStatus.rainExpected'),
        type: 'weather',
        severity: 'warning',
      });
    } else if (weatherData?.current) {
      status.push({
        id: 'weather-clear',
        emoji: '🌤️',
        message: `${weatherData.current.temperature}°C · ${weatherData.current.weatherCondition}`,
        type: 'weather',
        severity: 'info',
      });
    }

    // Irrigation status
    const advisory = advisoryData?.advisory;
    if (advisory?.irrigation) {
      const needsWater = advisory.irrigation.status?.toLowerCase().includes('required') ||
                         advisory.irrigation.status?.toLowerCase().includes('needed');
      status.push({
        id: 'irrigation',
        emoji: needsWater ? '💧' : '✅',
        message: needsWater
          ? t('farmStatus.irrigationNeeded')
          : t('farmStatus.irrigationNotNeeded'),
        type: 'irrigation',
        severity: needsWater ? 'warning' : 'success',
      });
    }

    // Disease risk status
    if (advisory?.diseaseRisk) {
      const isRisky = ['high', 'critical'].includes(
        (advisory.diseaseRisk.level || '').toLowerCase()
      );
      if (isRisky) {
        status.push({
          id: 'disease-risk',
          emoji: '⚠️',
          message: t('farmStatus.diseaseRisk'),
          type: 'disease',
          severity: 'warning',
        });
      }
    }

    // Fertilizer / next action
    if (advisory?.nextAction) {
      status.push({
        id: 'next-action',
        emoji: '🌱',
        message: advisory.nextAction,
        type: 'fertilizer',
        severity: 'info',
      });
    }

    // Crop info from active farm
    if (activeFarm?.cropName) {
      status.push({
        id: 'crop-info',
        emoji: '📈',
        message: `${activeFarm.cropName} · ${activeFarm.area || ''} ${t('farm.acres')}`,
        type: 'market',
        severity: 'info',
      });
    }

    return status;
  }, [weatherData, advisoryData, activeFarm, t]);

  return { items, loading };
}
