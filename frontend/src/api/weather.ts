import { getAccessToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface LocationData {
  farmName: string;
  village: string;
  taluka: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  latitude: number;
  longitude: number;
  formattedAddress: string;
  weatherLocationName: string;
}

export interface CurrentWeatherData {
  temperature: number;
  feelsLike: number;
  minimumTemperature: number;
  maximumTemperature: number;
  humidity: number;
  pressure: number;
  visibility: number;
  cloudCoverage: number;
  windSpeed: number;
  windDirection: number;
  windGust: number;
  rainProbability: number;
  rainVolume: number;
  snowVolume: number;
  uvIndex: number;
  dewPoint: number;
  sunrise: string;
  sunset: string;
  weatherCondition: string;
  weatherDescription: string;
  weatherIcon: string;
  lastUpdated: string;
}

export interface HourlyData {
  time: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  rainChance: number;
  windSpeed: number;
  pressure: number;
  cloudCoverage: number;
}

export interface DailyData {
  date: string;
  dayName: string;
  maximumTemperature: number;
  minimumTemperature: number;
  humidity: number;
  rainChance: number;
  wind: number;
  pressure: number;
  clouds: number;
  sunrise: string;
  sunset: string;
  condition: string;
  icon: string;
}

export interface AirQualityData {
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

export interface AgricultureData {
  diseaseRisk: string;
  heatStress: string;
  sprayWindow: string;
  irrigationAdvice: string;
  cropComfort: string;
  fieldWorkRecommendation: string;
}

export interface AlertData {
  type: string;
  title: string;
  severity: string;
  message: string;
}

export interface WeatherNormalizedData {
  isCached?: boolean;
  isStale?: boolean;
  location: LocationData;
  current: CurrentWeatherData;
  hourly: HourlyData[];
  daily: DailyData[];
  airQuality: AirQualityData;
  agriculture: AgricultureData;
  alerts: AlertData[];
  lastUpdated: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    const errorMsg = data.message || 'Weather Service Unavailable';
    const error: any = new Error(errorMsg);
    error.status = data.statusCode || res.status;
    throw error;
  }

  return data;
}

/**
 * GET Dashboard Weather Endpoint (Single Source of Truth)
 */
export async function getDashboardWeatherApi() {
  return request<WeatherNormalizedData>('/api/weather/dashboard');
}

/**
 * GET Current Weather Endpoint
 */
export async function getCurrentWeatherApi() {
  return request<WeatherNormalizedData>('/api/weather/current');
}

/**
 * GET Forecast Endpoint
 */
export async function getForecastApi() {
  return request<{ location: LocationData; hourly: HourlyData[]; daily: DailyData[] }>('/api/weather/forecast');
}
