import { appStorage } from './storage';

const STORAGE_KEY = 'last-selected-term';

export async function loadLastSelectedTerm(): Promise<string | null> {
  const value = await appStorage.getItem(STORAGE_KEY);
  return value?.trim() || null;
}

export async function saveLastSelectedTerm(term: string): Promise<void> {
  const normalized = term.trim();
  if (!normalized) return;
  await appStorage.setItem(STORAGE_KEY, normalized);
}
