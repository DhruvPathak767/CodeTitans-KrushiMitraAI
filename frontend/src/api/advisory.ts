import { getAccessToken, getStoredLang } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface IrrigationData {
  status: string;
  reason: string;
}

export interface FertilizerData {
  status: string;
  reason?: string;
}

export interface RiskData {
  level: string;
  reason?: string;
}

export interface SprayWindowData {
  bestTime: string;
  suitable?: boolean;
}

export interface FieldWorkData {
  status: string;
  morning?: string;
  afternoon?: string;
  evening?: string;
  night?: string;
}

export interface TimelineData {
  step1Today: string;
  step2Tomorrow: string;
  step3Next3Days: string;
}

export interface AdvisoryData {
  cropHealthScore: number;
  priority: string;
  irrigation: IrrigationData;
  fertilizer: FertilizerData;
  diseaseRisk: RiskData;
  pestRisk: RiskData;
  weedRisk: RiskData;
  waterStress: RiskData;
  heatStress: RiskData;
  sprayWindow: SprayWindowData;
  harvestReadiness?: { percentage: number };
  fieldWork: FieldWorkData;
  timeline?: TimelineData;
  estimatedYieldImpact: string;
  estimatedWaterSaving: string;
  estimatedCostSaving: string;
  nextAction: string;
  warning: string;
  reason: string;
  confidence?: string;
}

export interface AdvisoryResponse {
  isCached: boolean;
  advisory: AdvisoryData;
  growthStage: string;
  weatherSnapshot: any;
  ruleEngineFallback?: boolean;
  lastUpdated: string;
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
    const errorMsg = data.message || 'Advisory Service Error';
    const error: any = new Error(errorMsg);
    error.status = res.status;
    throw error;
  }

  return data.data;
}

export async function getAdvisoryApi(lang?: string): Promise<AdvisoryResponse> {
  return request<AdvisoryResponse>('/api/advisory', {}, lang);
}

export async function refreshAdvisoryApi(lang?: string): Promise<AdvisoryResponse> {
  return request<AdvisoryResponse>('/api/advisory/refresh', { method: 'POST' }, lang);
}

export async function getAdvisoryHistoryApi(lang?: string): Promise<any[]> {
  return request<any[]>('/api/advisory/history', {}, lang);
}
