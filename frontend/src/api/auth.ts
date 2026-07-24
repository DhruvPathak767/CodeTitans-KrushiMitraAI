const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  preferredLanguage?: string;
  profileImage?: string;
  emailVerified?: boolean;
  activeFarm?: string | any;
  createdAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field?: string; message: string }>;
}

export const TOKEN_KEYS = {
  ACCESS: 'km_access_token',
  REFRESH: 'km_refresh_token',
  USER: 'km_user',
};

export function getStoredLang(): string {
  try {
    const l = localStorage.getItem('km_lang');
    return l ? JSON.parse(l) : 'en';
  } catch {
    return 'en';
  }
}

export const getAccessToken = (): string | null => localStorage.getItem(TOKEN_KEYS.ACCESS);
export const getRefreshToken = (): string | null => localStorage.getItem(TOKEN_KEYS.REFRESH);

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(TOKEN_KEYS.ACCESS, accessToken);
  localStorage.setItem(TOKEN_KEYS.REFRESH, refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEYS.ACCESS);
  localStorage.removeItem(TOKEN_KEYS.REFRESH);
  localStorage.removeItem(TOKEN_KEYS.USER);
};

/**
 * Fetch wrapper with automatic Bearer token injection and JSON error parsing
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
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
  } catch (err: any) {
    if (!err.status) {
      err.message = err.message || 'Network error. Please check backend connection.';
    }
    throw err;
  }
}

/**
 * Signup API
 */
export async function signupApi(payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
  preferredLanguage?: string;
}) {
  return request<{ userId: string; email: string }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Verify OTP API
 */
export async function verifyOtpApi(payload: { email: string; otp: string }) {
  return request('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Login API
 */
export async function loginApi(payload: { email: string; password: string }) {
  const res = await request<{ accessToken: string; refreshToken: string; user: UserProfile }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (res.data?.accessToken && res.data?.refreshToken) {
    setTokens(res.data.accessToken, res.data.refreshToken);
  }

  return res;
}

/**
 * Refresh Token API
 */
export async function refreshTokenApi() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available');

  const res = await request<{ accessToken: string }>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  if (res.data?.accessToken) {
    localStorage.setItem(TOKEN_KEYS.ACCESS, res.data.accessToken);
  }

  return res;
}

/**
 * Forgot Password API
 */
export async function forgotPasswordApi(payload: { email: string }) {
  return request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Reset Password API
 */
export async function resetPasswordApi(payload: { email: string; otp: string; newPassword: string }) {
  return request('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Logout API
 */
export async function logoutApi() {
  try {
    await request('/auth/logout', { method: 'POST' });
  } catch (err) {
    // Ignore backend logout errors if token is already expired
  } finally {
    clearTokens();
  }
}

/**
 * Get Profile API
 */
export async function getProfileApi() {
  return request<{ user: UserProfile }>('/auth/me');
}

/**
 * Update Profile API
 */
export async function updateProfileApi(payload: Partial<UserProfile>) {
  return request<{ user: UserProfile }>('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
