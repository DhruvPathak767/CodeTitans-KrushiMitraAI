/** API base URL — sourced from env or defaults to localhost */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/** localStorage key names */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'km_access_token',
  REFRESH_TOKEN: 'km_refresh_token',
  USER: 'km_user',
  LANG: 'km_lang',
  THEME: 'km_theme',
  FARM: 'km_farm',
  ACTIVE_FARM_ID: 'km_active_farm_id',
} as const;

/** Bottom navigation tabs */
export const NAV_TABS = [
  { key: 'home', path: '/app/home' },
  { key: 'farm', path: '/app/farm' },
  { key: 'market', path: '/app/market' },
  { key: 'profile', path: '/app/profile' },
] as const;

/** Minimum accessibility dimensions */
export const A11Y = {
  MIN_BUTTON_HEIGHT: 56,
  MIN_TOUCH_TARGET: 48,
  MIN_FONT_SIZE: 18,
} as const;
