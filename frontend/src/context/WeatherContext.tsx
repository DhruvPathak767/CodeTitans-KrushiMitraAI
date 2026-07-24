import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useFarm } from './FarmContext';
import { useApp } from '@/i18n/AppContext';
import { getDashboardWeatherApi, type WeatherApiResponse } from '@/api/weather';

interface WeatherContextType {
  weatherData: WeatherApiResponse | null;
  loading: boolean;
  error: string | null;
  refreshWeather: () => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const { activeFarm } = useFarm();
  const { lang } = useApp();
  const [weatherData, setWeatherData] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboardWeatherApi(lang);
      if (res.data) {
        setWeatherData(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeFarm) {
      fetchWeather();
    } else {
      setWeatherData(null);
      setLoading(false);
    }

    // Auto refresh every 30 minutes
    const interval = setInterval(() => {
      if (activeFarm) {
        fetchWeather();
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [activeFarm?._id, lang]);

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        loading,
        error,
        refreshWeather: fetchWeather,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
