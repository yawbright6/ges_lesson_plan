import { createGeneratedRepository } from './generatedRepository';
import { slugify } from './generatedStore';
import type { CompiledTestPaper } from '@/types/testItemCompiler';

const STORAGE_KEY = 'local-test-papers';
const CACHE_PREFIX = 'generated:test-papers';

const testPaperRepository = createGeneratedRepository<CompiledTestPaper>({
  table: 'saved_test_papers',
  localStorageKey: STORAGE_KEY,
  cachePrefix: CACHE_PREFIX,
  normalize: normalizeTestPaper,
  title: (paper) => paper.title,
  sort: compareNewestFirst,
  createdAt: (paper) => paper.createdAt,
  saveTimeoutMessage: 'Test paper took too long to save.',
  loadTimeoutMessage: 'Saved test papers took too long to load.',
  getTimeoutMessage: 'Saved test paper took too long to load.',
  deleteTimeoutMessage: 'Test paper deletion took too long.',
  scopeRemoteId: false,
  ignoreMissingTable: true,
});

export async function saveTestPaper(paper: CompiledTestPaper): Promise<CompiledTestPaper> {
  return testPaperRepository.save(paper);
}

export async function loadTestPapers(): Promise<CompiledTestPaper[]> {
  return testPaperRepository.loadAll();
}

export async function getTestPaperById(id: string): Promise<CompiledTestPaper | null> {
  return testPaperRepository.getById(id);
}

export async function deleteTestPaper(id: string): Promise<void> {
  return testPaperRepository.remove(id);
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
