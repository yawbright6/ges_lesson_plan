import { supabase } from './supabase';
import { appStorage } from './storage';
import { defaultRuntimeSettings, loadRuntimeAppSettingsOrDefault } from './appSettings';
import { invalidateCache } from './cache';

export const DEFAULT_RETENTION_DAYS = defaultRuntimeSettings.generatedFileRetention.days;

export async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

export async function loadGeneratedRetentionDays(): Promise<number> {
  const settings = await loadRuntimeAppSettingsOrDefault();
  return Math.max(1, Math.round(settings.generatedFileRetention.days || DEFAULT_RETENTION_DAYS));
}

export async function loadLocalItems<T>(
  storageKey: string,
  normalize: (item: T) => T,
  sort: (a: T, b: T) => number,
  getCreatedAt: (item: T) => string | undefined,
): Promise<T[]> {
  const raw = await appStorage.getItem(storageKey);
  if (!raw) return [];
  const retentionDays = await loadGeneratedRetentionDays();

  try {
    const parsed = JSON.parse(raw) as T[];
    return parsed
      .map(normalize)
      .filter((item) => !isExpired(getCreatedAt(item), retentionDays))
      .sort(sort);
  } catch {
    return [];
  }
}

export async function writeLocalItems<T>(storageKey: string, items: T[]) {
  await appStorage.setItem(storageKey, JSON.stringify(items));
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function getRetentionCutoffIso(days: number, now = new Date()) {
  return addDays(now, -Math.max(1, Math.round(days))).toISOString();
}

export function isExpired(createdAt: string | undefined, days: number) {
  if (!createdAt) return false;
  return Date.now() - new Date(createdAt).getTime() > days * 24 * 60 * 60 * 1000;
}

export function slugify(value?: string) {
  return (value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function clearGeneratedStoreCaches() {
  invalidateCache('generated:');
}

export function scopeRemoteGeneratedId(userId: string, id: string) {
  const prefix = `${userId}:`;
  return id.startsWith(prefix) ? id : `${prefix}${id}`;
}
