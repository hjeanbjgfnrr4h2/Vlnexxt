import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Get setting value by key from settings array
 */
export function getSettingValue(
  settings: Array<{ key: string; value: string | null }>,
  key: string,
  defaultValue: string = ''
): string {
  const setting = settings.find((s) => s.key === key);
  return setting?.value ?? defaultValue;
}

/**
 * Parse JSON setting value safely
 */
export function parseJsonSetting<T>(value: string | null, defaultValue: T): T {
  if (!value) return defaultValue;
  try {
    return JSON.parse(value) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Get boolean setting value
 */
export function getBooleanSetting(value: string | null): boolean {
  return value === 'true';
}
