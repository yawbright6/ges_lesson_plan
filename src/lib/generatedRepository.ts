import { supabase } from './supabase';
import { withTimeout } from './async';
import { cachedRequest, invalidateCache } from './cache';
import {
  addDays,
  getCurrentUserId,
  getRetentionCutoffIso,
  loadGeneratedRetentionDays,
  loadLocalItems,
  scopeRemoteGeneratedId,
  writeLocalItems,
} from './generatedStore';

type GeneratedRepositoryConfig<T> = {
  table: string;
  localStorageKey: string;
  cachePrefix: string;
  normalize: (item: T) => T;
  title: (item: T) => string;
  sort: (a: T, b: T) => number;
  createdAt: (item: T) => string | undefined;
  saveTimeoutMessage: string;
  loadTimeoutMessage: string;
  getTimeoutMessage: string;
  deleteTimeoutMessage: string;
  scopeRemoteId?: boolean;
  ignoreMissingTable?: boolean;
};

export function createGeneratedRepository<T extends { id?: string }>(
  config: GeneratedRepositoryConfig<T>,
) {
  async function save(item: T): Promise<T> {
    const normalized = config.normalize(item);
    const userId = await getCurrentUserId();

    if (userId) {
      const remoteItem = config.scopeRemoteId === false
        ? normalized
        : { ...normalized, id: scopeRemoteGeneratedId(userId, normalized.id ?? '') };
      const retentionDays = await loadGeneratedRetentionDays();
      const expiresAt = addDays(new Date(), retentionDays).toISOString();
      const { error } = await withTimeout(
        supabase.from(config.table).upsert({
          id: remoteItem.id,
          user_id: userId,
          title: config.title(remoteItem),
          payload: remoteItem,
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        }),
        10000,
        config.saveTimeoutMessage,
      );
      if (error) throw error;
      invalidateCache(config.cachePrefix);
      return remoteItem;
    }

    const items = await loadLocal();
    const next = [normalized, ...items.filter((existing) => existing.id !== normalized.id)];
    await writeLocalItems(config.localStorageKey, next);
    invalidateCache(config.cachePrefix);
    return normalized;
  }

  async function loadAll(): Promise<T[]> {
    const userId = await getCurrentUserId();
    if (userId) {
      return cachedRequest(`${config.cachePrefix}:${userId}`, async () => {
        const retentionDays = await loadGeneratedRetentionDays();
        const retentionCutoff = getRetentionCutoffIso(retentionDays);
        const { data, error } = await withTimeout(
          supabase
            .from(config.table)
            .select('payload')
            .eq('user_id', userId)
            .gte('created_at', retentionCutoff)
            .order('created_at', { ascending: false }),
          10000,
          config.loadTimeoutMessage,
        );
        if (error) {
          if (config.ignoreMissingTable && isMissingTableError(error, config.table)) return [];
          throw error;
        }
        return (data ?? []).map((item) => config.normalize(item.payload as T));
      });
    }

    return loadLocal();
  }

  async function getById(id: string): Promise<T | null> {
    const userId = await getCurrentUserId();
    if (userId) {
      const retentionDays = await loadGeneratedRetentionDays();
      const retentionCutoff = getRetentionCutoffIso(retentionDays);
      const { data, error } = await withTimeout(
        supabase
          .from(config.table)
          .select('payload')
          .eq('user_id', userId)
          .eq('id', id)
          .gte('created_at', retentionCutoff)
          .maybeSingle(),
        10000,
        config.getTimeoutMessage,
      );
      if (error) {
        if (config.ignoreMissingTable && isMissingTableError(error, config.table)) return null;
        throw error;
      }
      return data?.payload ? config.normalize(data.payload as T) : null;
    }

    const items = await loadLocal();
    return items.find((item) => item.id === id) ?? null;
  }

  async function remove(id: string): Promise<void> {
    const userId = await getCurrentUserId();
    if (userId) {
      const { error } = await withTimeout(
        supabase.from(config.table).delete().eq('user_id', userId).eq('id', id),
        10000,
        config.deleteTimeoutMessage,
      );
      if (error) throw error;
      invalidateCache(config.cachePrefix);
      return;
    }

    const items = await loadLocal();
    await writeLocalItems(config.localStorageKey, items.filter((item) => item.id !== id));
    invalidateCache(config.cachePrefix);
  }

  function loadLocal(): Promise<T[]> {
    return loadLocalItems(
      config.localStorageKey,
      config.normalize,
      config.sort,
      config.createdAt,
    );
  }

  return { save, loadAll, getById, remove, loadLocal };
}

function isMissingTableError(error: { code?: string; message?: string }, table: string) {
  const message = (error.message ?? '').toLowerCase();
  return error.code === '42P01' || message.includes(table);
}
