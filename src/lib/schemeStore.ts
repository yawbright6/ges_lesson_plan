import { normalizeSchemeWeek } from '@/lib/schemeWeek';
import { createGeneratedRepository } from './generatedRepository';
import type { ClassLevel } from '@/types/lessonPlan';
import type { SchemeOfWork, SchemeWeek } from '@/types/scheme';

const STORAGE_KEY = 'local-schemes';
const CACHE_PREFIX = 'generated:schemes';

const schemeRepository = createGeneratedRepository<SchemeOfWork>({
  table: 'saved_schemes',
  localStorageKey: STORAGE_KEY,
  cachePrefix: CACHE_PREFIX,
  normalize: normalizeScheme,
  title: (scheme) => scheme.title,
  sort: (a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''),
  createdAt: (scheme) => scheme.createdAt,
  saveTimeoutMessage: 'Scheme took too long to save.',
  loadTimeoutMessage: 'Saved schemes took too long to load.',
  getTimeoutMessage: 'Saved scheme took too long to load.',
  deleteTimeoutMessage: 'Saved scheme deletion took too long.',
});

type SchemeMatchInput = {
  subject: string;
  classLevel: ClassLevel;
  term?: string;
};

type SchemeContext = {
  schemeId: string;
  title: string;
  subject: string;
  classLevel: ClassLevel;
  term: string;
  selectedWeek?: SchemeWeek;
  previousWeek?: SchemeWeek;
  nextWeek?: SchemeWeek;
  lessonFocusGuidance?: {
    allFocuses: string[];
    currentFocus?: string;
  };
};

export async function saveScheme(scheme: SchemeOfWork): Promise<SchemeOfWork> {
  return schemeRepository.save(scheme);
}

export async function loadSchemes(): Promise<SchemeOfWork[]> {
  return schemeRepository.loadAll();
}

export async function findMatchingScheme(input: SchemeMatchInput): Promise<SchemeOfWork | null> {
  const matches = await loadMatchingSchemes(input);
  return matches[0] ?? null;
}

export async function loadMatchingSchemes(input: SchemeMatchInput): Promise<SchemeOfWork[]> {
  const normalizedSubject = normalizeText(input.subject);
  const normalizedTerm = normalizeTerm(input.term);

  const schemes = await loadSchemes();
  return schemes.filter((scheme) => {
    const sameSubject = normalizeText(scheme.subject) === normalizedSubject;
    const sameClass = scheme.classLevel === input.classLevel;
    const sameTerm = !normalizedTerm || normalizeTerm(scheme.term) === normalizedTerm;
    return sameSubject && sameClass && sameTerm;
  });
}

export async function getSchemeById(id: string): Promise<SchemeOfWork | null> {
  return schemeRepository.getById(id);
}

export async function deleteScheme(id: string): Promise<void> {
  return schemeRepository.remove(id);
}

export function buildSchemeContext(scheme: SchemeOfWork, week: number): SchemeContext {
  const weeks = [...scheme.weeks].sort((a, b) => a.week - b.week);
  const index = weeks.findIndex((item) => item.week === week);
  const selectedWeek = index >= 0 ? weeks[index] : undefined;

  return {
    schemeId: scheme.id ?? '',
    title: scheme.title,
    subject: scheme.subject,
    classLevel: scheme.classLevel,
    term: scheme.term,
    selectedWeek,
    previousWeek: index > 0 ? weeks[index - 1] : undefined,
    nextWeek: index >= 0 && index < weeks.length - 1 ? weeks[index + 1] : undefined,
  };
}

export function normalizeTerm(term?: string): string {
  const value = normalizeText(term);

  if (!value) return '';
  if (value.includes('1')) return 'term 1';
  if (value.includes('first')) return 'term 1';
  if (value.includes('begin')) return 'term 1';
  if (value.includes('2')) return 'term 2';
  if (value.includes('second')) return 'term 2';
  if (value.includes('middle')) return 'term 2';
  if (value.includes('mid')) return 'term 2';
  if (value.includes('3')) return 'term 3';
  if (value.includes('third')) return 'term 3';
  if (value.includes('end')) return 'term 3';
  if (value.includes('final')) return 'term 3';

  return value;
}

function normalizeScheme(scheme: SchemeOfWork): SchemeOfWork {
  const createdAt = scheme.createdAt ?? new Date().toISOString();
  const id = scheme.id ?? `${normalizeText(scheme.subject)}-${scheme.classLevel}-${normalizeTerm(scheme.term)}-${createdAt}`;

  return {
    ...scheme,
    id,
    createdAt,
    title: scheme.title?.trim() || `${scheme.subject} Scheme of Work - ${scheme.classLevel} ${scheme.term}`,
    term: scheme.term?.trim() || 'Term 1',
    weeks: [...(scheme.weeks ?? [])]
      .filter((week) => Number.isFinite(week.week))
      .map(normalizeSchemeWeek)
      .sort((a, b) => a.week - b.week),
  };
}

function normalizeText(value?: string): string {
  return (value ?? '').trim().toLowerCase();
}
