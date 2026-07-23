import { Cloud, CloudRain, Sun, CloudSun, Wind, Droplets, type LucideIcon } from 'lucide-react';

export const weatherIconMap: Record<string, LucideIcon> = {
  sunny: Sun,
  rain: CloudRain,
  'partly-cloudy': CloudSun,
  cloudy: Cloud,
  windy: Wind,
};

export function WeatherIcon({ type, className }: { type: string; className?: string }) {
  const Icon = weatherIconMap[type] ?? CloudSun;
  return <Icon className={className} />;
}

export function getWeatherType(condition: string): string {
  const c = condition.toLowerCase();
  if (c.includes('rain')) return 'rain';
  if (c.includes('cloud') && c.includes('part')) return 'partly-cloudy';
  if (c.includes('cloud')) return 'cloudy';
  if (c.includes('sun') || c.includes('clear')) return 'sunny';
  if (c.includes('wind')) return 'windy';
  return 'partly-cloudy';
}
