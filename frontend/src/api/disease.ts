import { getAccessToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface PredictPayload {
  imageUrl: string;
  publicId?: string;
  crop?: string;
  farmId?: string;
}

export interface CropPredictionInfo {
  crop: string;
  confidence: number;
}

export interface DiseasePredictionInfo {
  disease: string;
  fullLabel?: string;
  confidence: number;
  severity?: 'low' | 'moderate' | 'high';
}

export interface TreatmentInfo {
  fungicide?: string;
  organic?: string;
  prevention?: string;
}

export interface PredictionDetail {
  disease: string;
  confidence: number;
  severity?: 'low' | 'moderate' | 'high';
  treatment: string;
  fungicide?: string;
  organicAlternative: string;
  prevention: string;
  predictionTime: string;
  reportId?: string;
  imageUrl?: string;
  publicId?: string;
  crop?: string;
  createdAt?: string;
  cropPrediction?: CropPredictionInfo;
  diseasePrediction?: DiseasePredictionInfo;
}

export interface DiseasePredictResponseData {
  prediction?: PredictionDetail;
  cropPrediction?: CropPredictionInfo;
  diseasePrediction?: DiseasePredictionInfo;
  treatment?: TreatmentInfo;
  reportId?: string;
  _id?: string;
  disease?: string;
  confidence?: number;
  severity?: 'low' | 'moderate' | 'high';
  organicAlternative?: string;
  fungicide?: string;
  prevention?: string;
  imageUrl?: string;
  publicId?: string;
  crop?: string;
  predictionTime?: string | number;
  createdAt?: string;
}

export interface DiseaseApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field?: string; message: string }>;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<DiseaseApiResponse<T>> {
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
    const errorMsg = data.message || 'Disease detection request failed';
    const error: any = new Error(errorMsg);
    error.status = res.status;
    error.errors = data.errors || [];
    throw error;
  }

  return data;
}

/**
 * Predict Disease API
 * Calls Node backend -> Python AI FastAPI Inference service -> MongoDB persistence
 */
export async function predictDiseaseApi(payload: PredictPayload) {
  return request<DiseasePredictResponseData>('/api/disease/predict', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Fetch Disease History API
 */
export async function getDiseaseHistoryApi() {
  return request<DiseasePredictResponseData[]>('/api/disease/history');
}

/**
 * Fetch Single Disease Report by ID
 */
export async function getDiseaseReportByIdApi(id: string) {
  return request<DiseasePredictResponseData>(`/api/disease/${id}`);
}

/**
 * Delete Single Disease Report by ID or Public ID
 */
export async function deleteDiseaseReportApi(id: string) {
  return request<{ success: boolean; message: string }>(`/api/disease/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
}

/**
 * Clear All Disease Reports History
 */
export async function clearAllDiseaseHistoryApi() {
  return request<{ success: boolean; message: string }>('/api/disease/history/all', {
    method: 'DELETE',
  });
}
