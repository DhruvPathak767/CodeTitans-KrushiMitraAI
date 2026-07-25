/**
 * KrishiMitra Design Tokens
 * ─────────────────────────
 * Earthy, high-contrast palette optimised for sunlight readability,
 * low-vision users (age 40-65), and trust-building aesthetics.
 *
 * Philosophy: Green = growth, Brown = earth, Cream = warmth,
 *             Blue = water/weather only.
 */

export const colors = {
  /** Primary — deep forest green, trust & growth */
  primary: {
    50: '#F0F7F4',
    100: '#D6EDE1',
    200: '#A8D8B9',
    300: '#6BBF8A',
    400: '#40A864',
    500: '#2D6A4F',
    600: '#245A42',
    700: '#1B4332',
    800: '#133024',
    900: '#0B1F17',
  },
  /** Secondary — warm earthy brown */
  secondary: {
    50: '#FAF6F0',
    100: '#F3E9D8',
    200: '#E6D2B0',
    300: '#D4B27E',
    400: '#C08F4D',
    500: '#8B5E3C',
    600: '#714B30',
    700: '#573925',
    800: '#3D271A',
    900: '#241710',
  },
  /** Surface — warm cream / off-white backgrounds */
  surface: {
    50: '#FFFDF7',
    100: '#FEFCF3',
    200: '#FDF8E8',
    300: '#FAF0D4',
    400: '#F5E6BC',
    500: '#EDD9A3',
  },
  /** Weather blue — used exclusively for weather features */
  weather: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
  },
  /** Semantic */
  success: '#2D6A4F',
  warning: '#D97706',
  error: '#DC2626',
  info: '#3B82F6',
} as const;

export const spacing = {
  /** Card inner padding */
  card: '20px',
  /** Page horizontal padding */
  page: '16px',
  /** Page horizontal padding on desktop */
  pageDesktop: '32px',
  /** Section gap */
  section: '24px',
  /** Bottom nav height */
  bottomNav: '72px',
  /** Top bar height */
  topBar: '64px',
} as const;

export const typography = {
  /** Minimum body text */
  bodyMin: '18px',
  /** Body text */
  body: '18px',
  /** Small helper text — still accessible */
  small: '16px',
  /** Card title */
  cardTitle: '20px',
  /** Section heading */
  heading: '24px',
  /** Page title */
  pageTitle: '28px',
  /** Hero greeting */
  hero: '32px',
} as const;

export const shadows = {
  /** Soft card shadow — earthy, not glassy */
  card: '0 2px 12px -2px rgba(139, 94, 60, 0.08), 0 1px 3px rgba(0,0,0,0.04)',
  /** Elevated card (pressed/active state) */
  cardHover: '0 4px 20px -4px rgba(139, 94, 60, 0.12), 0 2px 6px rgba(0,0,0,0.06)',
  /** Bottom navigation shadow */
  nav: '0 -2px 12px rgba(0,0,0,0.06)',
  /** Button shadow */
  button: '0 2px 8px -1px rgba(45, 106, 79, 0.25)',
} as const;

export const radii = {
  /** Standard card radius */
  card: '16px',
  /** Button radius */
  button: '14px',
  /** Badge / pill radius */
  pill: '9999px',
  /** Input radius */
  input: '12px',
} as const;
