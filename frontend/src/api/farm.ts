import { getAccessToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface FarmAddress {
  formattedAddress?: string;
  country?: string;
  state?: string;
  district?: string;
  taluka?: string;
  village?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
}

export interface FarmLocation {
  type: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export interface FarmData {
  _id: string;
  userId: string | { _id: string; name: string; email: string; phone?: string };
  farmName: string;
  cropName: string;
  soilType: string;
  area: number;
  areaUnit: 'ACRE' | 'HECTARE';
  sowingDate: string;
  irrigationType: string;
  status: 'ACTIVE' | 'INACTIVE';
  location: FarmLocation;
  address: FarmAddress;
  createdAt: string;
  updatedAt: string;
}

export interface FarmQueryParams {
  search?: string;
  crop?: string;
  state?: string;
  district?: string;
  status?: string;
  sort?: 'newest' | 'oldest' | 'farmName' | 'cropName' | 'area';
  page?: number;
  limit?: number;
}

export interface PaginatedFarmsResponse {
  farms: FarmData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field?: string; message: string }>;
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
    const errorMsg = data.message || 'An error occurred during request';
    const error: any = new Error(errorMsg);
    error.status = data.statusCode || res.status;
    error.errors = data.errors || [];
    throw error;
  }

  return data;
}

/**
 * Check Farm Status API (First-time onboarding guard)
 */
export async function checkFarmStatusApi() {
  return request<{ hasFarm: boolean; farmCount: number; activeFarm: FarmData | null }>('/api/farms/check');
}

/**
 * Create Farm API
 */
export async function createFarmApi(payload: Partial<FarmData>) {
  return request<{ farm: FarmData }>('/api/farms', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Get All Farms API (with Search, Filter, Sort, Pagination)
 */
export async function getFarmsApi(params: FarmQueryParams = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.crop) query.append('crop', params.crop);
  if (params.state) query.append('state', params.state);
  if (params.district) query.append('district', params.district);
  if (params.status) query.append('status', params.status);
  if (params.sort) query.append('sort', params.sort);
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return request<PaginatedFarmsResponse>(`/api/farms${queryString}`);
}

/**
 * Get Single Farm by ID API
 */
export async function getFarmByIdApi(id: string) {
  return request<{ farm: FarmData }>(`/api/farms/${id}`);
}

/**
 * Update Farm API
 */
export async function updateFarmApi(id: string, payload: Partial<FarmData>) {
  return request<{ farm: FarmData }>(`/api/farms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

/**
 * Delete Farm API
 */
export async function deleteFarmApi(id: string) {
  return request<{ message: string; remainingCount?: number }>(`/api/farms/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Select Active Farm API
 */
export async function selectActiveFarmApi(id: string) {
  return request<{ activeFarm: FarmData }>(`/api/farms/${id}/select`, {
    method: 'PATCH',
  });
}
