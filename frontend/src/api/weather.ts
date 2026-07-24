import { getAccessToken, getStoredLang } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface WeatherLocation {
  farmId?: string;
  farmName: string;
  village: string;
  district: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  weatherLocationName: string;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  minimumTemperature: number;
  maximumTemperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  windGust: number;
  cloudCoverage: number;
  weatherCondition: string;
  weatherDescription: string;
  weatherIcon: string;
  rainProbability: number;
  rainVolume: number;
  uvIndex: number;
  visibility: number;
  dewPoint: number;
  sunrise: string;
  sunset: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  rainChance: number;
  windSpeed: number;
  condition: string;
  icon: string;
}

export interface DailyForecast {
  date: string;
  dayName: string;
  minimumTemperature: number;
  maximumTemperature: number;
  condition: string;
  icon: string;
  rainChance: number;
}

export interface AirQuality {
  aqi: number;
  aqiStatus: string;
  pm25: number;
  pm10: number;
  co: number;
  no2: number;
  so2: number;
  o3: number;
  nh3: number;
}

export interface AgricultureRules {
  diseaseRisk: string;
  heatStress: string;
  sprayWindow: string;
  irrigationAdvice: string;
  cropComfort: string;
  fieldWorkRecommendation: string;
}

export interface WeatherAlert {
  title: string;
  message: string;
  severity: string;
}

export interface WeatherApiResponse {
  location: WeatherLocation;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  airQuality: AirQuality;
  agriculture: AgricultureRules;
  alerts: WeatherAlert[];
  isCached?: boolean;
  lastUpdated: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}, lang?: string): Promise<ApiResponse<T>> {
  const token = getAccessToken();
  const targetLang = lang || getStoredLang();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept-Language': targetLang,
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${API_BASE_URL}${endpoint}${separator}lang=${encodeURIComponent(targetLang)}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Weather API request failed');
  }

  return data;
}

export async function getWeatherApi(lang?: string): Promise<ApiResponse<WeatherApiResponse>> {
  return request<WeatherApiResponse>('/api/weather', {}, lang);
}

export async function getDashboardWeatherApi(lang?: string): Promise<ApiResponse<WeatherApiResponse>> {
  return request<WeatherApiResponse>('/api/weather/dashboard', {}, lang);
}

export async function getForecastApi(lang?: string): Promise<ApiResponse<{ location: WeatherLocation; hourly: HourlyForecast[]; daily: DailyForecast[] }>> {
  return request<{ location: WeatherLocation; hourly: HourlyForecast[]; daily: DailyForecast[] }>('/api/weather/forecast', {}, lang);
}

export async function getDebugWeatherApi(lang?: string): Promise<ApiResponse<any>> {
  return request<any>('/api/weather/debug', {}, lang);
}
