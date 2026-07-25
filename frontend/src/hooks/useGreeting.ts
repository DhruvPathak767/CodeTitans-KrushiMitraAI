import { useApp } from '@/i18n/AppContext';

/**
 * Returns a time-appropriate greeting using i18n keys.
 * - Before 12:00 → morning
 * - 12:00–17:00 → afternoon  
 * - After 17:00 → evening
 */
export function useGreeting(): string {
  const { t } = useApp();
  const hour = new Date().getHours();

  if (hour < 12) return t('greeting.morning');
  if (hour < 17) return t('greeting.afternoon');
  return t('greeting.evening');
}
