import { supabase } from './supabase';
import { cachedRequest, invalidateCache } from './cache';
import { withTimeout } from './async';
import {
  addDays,
  getCurrentUserId,
  loadGeneratedRetentionDays,
  loadLocalItems,
  slugify,
  writeLocalItems,
} from './generatedStore';
import type { CompiledTestPaper } from '@/types/testItemCompiler';

const STORAGE_KEY = 'local-test-papers';
const CACHE_PREFIX = 'generated:test-papers';

export async function saveTestPaper(paper: CompiledTestPaper): Promise<CompiledTestPaper> {
  const normalized = normalizeTestPaper(paper);
  const userId = await getCurrentUserId();
  if (userId) {
    const retentionDays = await loadGeneratedRetentionDays();
    const expiresAt = addDays(new Date(), retentionDays).toISOString();
    const { error } = await withTimeout(
      supabase.from('saved_test_papers').upsert({
        id: normalized.id,
        user_id: userId,
        title: normalized.title,
        payload: normalized,
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      }),
      10000,
      'Test paper took too long to save.',
    );
    if (error) throw error;
    invalidateCache(CACHE_PREFIX);
    return normalized;
  }

  const papers = await loadLocalTestPapers();
  await writeLocalItems(STORAGE_KEY, [normalized, ...papers.filter((item) => item.id !== normalized.id)]);
  invalidateCache(CACHE_PREFIX);
  return normalized;
}

export async function loadTestPapers(): Promise<CompiledTestPaper[]> {
  const userId = await getCurrentUserId();
  if (userId) {
    return cachedRequest(`${CACHE_PREFIX}:${userId}`, async () => {
      const { data, error } = await withTimeout(
        supabase
          .from('saved_test_papers')
          .select('payload')
          .eq('user_id', userId)
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false }),
        10000,
        'Saved test papers took too long to load.',
      );
      if (error) {
        if (isMissingTableError(error)) return [];
        throw error;
      }
      return (data ?? []).map((item) => normalizeTestPaper(item.payload as CompiledTestPaper));
    });
  }
  return loadLocalTestPapers();
}

export async function getTestPaperById(id: string): Promise<CompiledTestPaper | null> {
  const userId = await getCurrentUserId();
  if (userId) {
    const { data, error } = await withTimeout(
      supabase
        .from('saved_test_papers')
        .select('payload')
        .eq('user_id', userId)
        .eq('id', id)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle(),
      10000,
      'Saved test paper took too long to load.',
    );
    if (error) {
      if (isMissingTableError(error)) return null;
      throw error;
    }
    return data?.payload ? normalizeTestPaper(data.payload as CompiledTestPaper) : null;
  }

  const papers = await loadLocalTestPapers();
  return papers.find((paper) => paper.id === id) ?? null;
}

export async function deleteTestPaper(id: string): Promise<void> {
  const userId = await getCurrentUserId();
  if (userId) {
    const { error } = await withTimeout(
      supabase.from('saved_test_papers').delete().eq('user_id', userId).eq('id', id),
      10000,
      'Test paper deletion took too long.',
    );
    if (error) throw error;
    invalidateCache(CACHE_PREFIX);
    return;
  }

  const papers = await loadLocalTestPapers();
  await writeLocalItems(STORAGE_KEY, papers.filter((paper) => paper.id !== id));
  invalidateCache(CACHE_PREFIX);
}

async function loadLocalTestPapers() {
  return loadLocalItems(STORAGE_KEY, normalizeTestPaper, compareNewestFirst, (item) => item.createdAt);
}

function normalizeTestPaper(paper: CompiledTestPaper): CompiledTestPaper {
  const createdAt = paper.createdAt ?? new Date().toISOString();
  const id =
    paper.id ??
    `test-paper-${slugify(paper.subject)}-${paper.classLevel}-${slugify(paper.termTitle ?? 'term')}-${Date.now()}`;
  return { ...paper, id, createdAt };
}

function compareNewestFirst(a: CompiledTestPaper, b: CompiledTestPaper) {
  return (b.createdAt ?? '').localeCompare(a.createdAt ?? '');
}

function isMissingTableError(error: { code?: string; message?: string }) {
  const message = (error.message ?? '').toLowerCase();
  return error.code === '42P01' || message.includes('saved_test_papers');
}
