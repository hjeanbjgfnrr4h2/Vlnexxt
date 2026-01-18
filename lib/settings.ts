import { prisma } from './prisma';
import { Setting } from '@prisma/client';

let settingsCache: Setting[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 60000; // 1 minute

/**
 * Get all settings with caching
 */
export async function getAllSettings(forceRefresh: boolean = false): Promise<Setting[]> {
  const now = Date.now();
  
  if (!forceRefresh && settingsCache && (now - cacheTimestamp) < CACHE_TTL) {
    return settingsCache;
  }

  const settings = await prisma.setting.findMany({
    orderBy: [
      { group: 'asc' },
      { sortOrder: 'asc' },
    ],
  });

  settingsCache = settings;
  cacheTimestamp = now;
  
  return settings;
}

/**
 * Get settings by group
 */
export async function getSettingsByGroup(group: string): Promise<Setting[]> {
  const allSettings = await getAllSettings();
  return allSettings.filter((s) => s.group === group);
}

/**
 * Get a single setting value
 */
export async function getSettingValue(
  group: string,
  key: string,
  defaultValue: string = ''
): Promise<string> {
  const setting = await prisma.setting.findUnique({
    where: {
      group_key: {
        group,
        key,
      },
    },
  });

  return setting?.value ?? defaultValue;
}

/**
 * Update a setting
 */
export async function updateSetting(
  group: string,
  key: string,
  value: string
): Promise<Setting> {
  const setting = await prisma.setting.update({
    where: {
      group_key: {
        group,
        key,
      },
    },
    data: { value },
  });

  // Invalidate cache
  settingsCache = null;

  return setting;
}

/**
 * Bulk update settings
 */
export async function bulkUpdateSettings(
  updates: Array<{ group: string; key: string; value: string }>
): Promise<void> {
  await prisma.$transaction(
    updates.map((update) =>
      prisma.setting.update({
        where: {
          group_key: {
            group: update.group,
            key: update.key,
          },
        },
        data: { value: update.value },
      })
    )
  );

  // Invalidate cache
  settingsCache = null;
}

/**
 * Clear settings cache
 */
export function clearSettingsCache(): void {
  settingsCache = null;
}
