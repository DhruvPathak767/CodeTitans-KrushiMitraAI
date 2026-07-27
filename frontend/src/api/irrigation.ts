import { getAccessToken, getStoredLang } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface BestWindowSlot {
  slot: string; // "Morning", "Afternoon", "Evening", "Night"
  time: string;
  score: number;
  recommendation: string;
  status: string; // "RECOMMENDED", "AVOID", "SUITABLE", "MONITOR"
  reason: string;
}

export interface SoilImpactInfo {
  soilType: string;
  retentionFactor: number;
  drainage: string;
  multiplier: number;
  impactSummary: string;
}

export interface RainImpactInfo {
  probability: number;
  expectedMm: number;
  riskLevel: string;
  action: string;
}

export interface HeatImpactInfo {
  temperature: number;
  humidity: number;
  heatStressLevel: string;
  evaporationScore: number;
  evaporationLevel: string;
}

export interface GrowthStageImpactInfo {
  crop: string;
  stage: string;
  daysSinceSowing: number;
  waterDemandMultiplier: number;
}

export interface WaterAnalytics {
  estimatedWaterSaved: number;
  estimatedCostSaved: number;
  efficiencyScore: number;
}

export interface RecommendationFacts {
  todayRecommendation: string;
  status: 'Irrigate Now' | 'Wait' | 'Delay' | 'Monitor';
  priority: 'Low' | 'Medium' | 'High';
  waterNeeded: boolean;
  estimatedDuration: string;
  estimatedWaterQuantity: number;
  reason: string;
  confidenceScore: number;
  nextIrrigationDate: string;
  rainImpact: RainImpactInfo;
  heatImpact: HeatImpactInfo;
  soilImpact: SoilImpactInfo;
  growthStageImpact: GrowthStageImpactInfo;
  bestWindow: BestWindowSlot[];
  analytics: WaterAnalytics;
}

export interface GroqIrrigationExplanation {
  farmerExplanation: string;
  precautions: string[];
  waterSavingTips: string[];
  fertilizerSuggestion: string;
  warning: string;
}

export interface IrrigationApiResponse {
  isCached: boolean;
  recommendation: RecommendationFacts;
  groqExplanation: GroqIrrigationExplanation;
  ruleEngineFallback?: boolean;
  weatherSnapshot?: any;
  lastUpdated: string;
  expiresAt?: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}, lang?: string): Promise<T> {
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
    const errorMsg = data.message || 'Irrigation Engine Error';
    const error: any = new Error(errorMsg);
    error.status = res.status;
    throw error;
  }

  return data.data;
}

export async function getIrrigationApi(lang?: string): Promise<IrrigationApiResponse> {
  return request<IrrigationApiResponse>('/api/irrigation', {}, lang);
}

export async function refreshIrrigationApi(lang?: string): Promise<IrrigationApiResponse> {
  return request<IrrigationApiResponse>('/api/irrigation/refresh', { method: 'POST' }, lang);
}

export async function getIrrigationHistoryApi(lang?: string): Promise<any[]> {
  return request<any[]>('/api/irrigation/history', {}, lang);
}
