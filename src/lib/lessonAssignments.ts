import type { ClassLevel } from '@/types/lessonPlan';
import type { SchemeWeek, SchemeWeekEntry } from '@/types/scheme';
import { buildExemplarLessonGuidance } from './exemplarLessonGuidance';
import { getWeekEntries, getWeekTopic } from './schemeWeek';

export interface WeeklyLessonAssignment {
  lessonNumber: number;
  title: string;
  focus: string;
  aspect?: string;
  assignedEntryIndex?: number;
  assignedEntry?: SchemeWeekEntry;
  supportExemplars: string[];
  deferredExemplars: string[];
  previousRelatedFocus?: string;
  nextRelatedFocus?: string;
}

export interface WeeklyLessonAssignmentGuidance {
  allFocuses: string[];
  currentFocus?: string;
  assignments: WeeklyLessonAssignment[];
  currentAssignment?: WeeklyLessonAssignment;
}

type SubjectStrategy =
  | 'language-aspect'
  | 'mathematics-progression'
  | 'science-inquiry'
  | 'concept-application'
  | 'creative-process'
  | 'practical-production'
  | 'generic';

type SubjectLessonProfile = {
  defaultLessonsPerWeek: number;
  strategy: SubjectStrategy;
};

export function getSubjectLessonProfile(subject: string): SubjectLessonProfile {
  const normalized = normalizeSubject(subject);
  if (normalized.includes('english')) return { defaultLessonsPerWeek: 3, strategy: 'language-aspect' };
  if (normalized.includes('mathematics') || normalized.includes('math')) return { defaultLessonsPerWeek: 3, strategy: 'mathematics-progression' };
  if (normalized.includes('science')) return { defaultLessonsPerWeek: 3, strategy: 'science-inquiry' };
  if (normalized.includes('social studies')) return { defaultLessonsPerWeek: 2, strategy: 'concept-application' };
  if (normalized === 'rme' || normalized.includes('religious and moral')) return { defaultLessonsPerWeek: 2, strategy: 'concept-application' };
  if (normalized.includes('creative arts')) return { defaultLessonsPerWeek: 2, strategy: 'creative-process' };
  if (normalized.includes('career technology') || normalized.includes('career tech')) return { defaultLessonsPerWeek: 2, strategy: 'practical-production' };
  if (normalized.includes('french')) return { defaultLessonsPerWeek: 2, strategy: 'language-aspect' };
  if (normalized.includes('ghanaian language') || normalized.includes('gha language') || normalized.includes('gha. language')) return { defaultLessonsPerWeek: 2, strategy: 'language-aspect' };
  return { defaultLessonsPerWeek: 2, strategy: 'generic' };
}

export function getDefaultLessonsPerWeekForSubject(subject: string): string {
  return String(getSubjectLessonProfile(subject).defaultLessonsPerWeek);
}

export function buildWeeklyLessonAssignments(input: {
  subject: string;
  classLevel: ClassLevel | string;
  selectedWeek?: SchemeWeek;
  weeks?: SchemeWeek[];
  weekNumber?: number;
  sessionIndex?: number;
  sessionsPerWeek?: number;
}): WeeklyLessonAssignmentGuidance | undefined {
  const selectedWeek = input.selectedWeek;
  if (!selectedWeek) return undefined;

  const profile = getSubjectLessonProfile(input.subject);
  const lessonCount = Math.max(1, Math.min(input.sessionsPerWeek ?? profile.defaultLessonsPerWeek, 4));
  const entries = getWeekEntries(selectedWeek);
  if (!entries.length) return buildFallbackGuidance(input, lessonCount);

  const entryAssignments = assignEntriesToLessons(entries, lessonCount);
  const assignments = entryAssignments.map((entryGroup, index) => {
    const first = entryGroup[0];
    const assignedEntryIndex = first?.index;
    const assignedEntry = first?.entry;
    const sameEntryLessonIndexes = entryAssignments
      .map((group, groupIndex) => group.some((item) => item.index === assignedEntryIndex) ? groupIndex : -1)
      .filter((item) => item >= 0);
    const repeatedEntrySlotIndex = sameEntryLessonIndexes.indexOf(index);
    const repeatedEntrySlotCount = sameEntryLessonIndexes.length;
    const previousRelatedFocus = assignedEntry ? findRelatedEntry(input.weeks, selectedWeek.week, assignedEntry, -1)?.topic : undefined;
    const nextRelatedFocus = assignedEntry ? findRelatedEntry(input.weeks, selectedWeek.week, assignedEntry, 1)?.topic : undefined;
    const exemplarPlan = buildExemplarPlan({
      entry: assignedEntry,
      profile,
      repeatedEntrySlotIndex,
      repeatedEntrySlotCount,
      hasFutureRelatedEntry: Boolean(nextRelatedFocus),
    });

    return buildAssignment({
      lessonNumber: index + 1,
      entryGroup: entryGroup.map((item) => item.entry),
      assignedEntry,
      assignedEntryIndex,
      profile,
      supportExemplars: exemplarPlan.supportExemplars,
      deferredExemplars: exemplarPlan.deferredExemplars,
      previousRelatedFocus,
      nextRelatedFocus,
      weekFocus: getWeekTopic(selectedWeek),
    });
  });

  const allFocuses = assignments.map((assignment) => assignment.focus);
  const focusIndex = Math.min(
    Math.max((input.sessionIndex ?? 1) - 1, 0),
    Math.max(assignments.length - 1, 0),
  );

  return {
    allFocuses,
    currentFocus: allFocuses[focusIndex],
    assignments,
    currentAssignment: assignments[focusIndex],
  };
}

function assignEntriesToLessons(entries: SchemeWeekEntry[], lessonCount: number) {
  const indexed = entries.map((entry, index) => ({ entry, index }));
  if (lessonCount <= 1) return [indexed];
  if (indexed.length === 1) return Array.from({ length: lessonCount }, () => [indexed[0]]);

  const chunks = splitBalanced(indexed, lessonCount);
  while (chunks.length < lessonCount) {
    chunks.push([indexed[Math.min(chunks.length, indexed.length - 1)]]);
  }
  return chunks.slice(0, lessonCount);
}

function buildAssignment(input: {
  lessonNumber: number;
  entryGroup: SchemeWeekEntry[];
  assignedEntry?: SchemeWeekEntry;
  assignedEntryIndex?: number;
  profile: SubjectLessonProfile;
  supportExemplars: string[];
  deferredExemplars: string[];
  previousRelatedFocus?: string;
  nextRelatedFocus?: string;
  weekFocus: string;
}): WeeklyLessonAssignment {
  const entryGroup = input.entryGroup.filter(Boolean);
  const primary = input.assignedEntry ?? entryGroup[0];
  const aspect = entryGroup.map((entry) => entry.strand || entry.subStrand || entry.topic).filter(Boolean).join(' + ');
  const title = [
    aspect || input.weekFocus || `Lesson ${input.lessonNumber}`,
    entryGroup.map((entry) => entry.topic).filter(Boolean).join(' + '),
  ].filter(Boolean).join(' - ');
  const supportText = input.supportExemplars.length
    ? `Teach now using these supporting exemplars: ${input.supportExemplars.join(' ')}`
    : 'Teach now using only this assigned entry and its immediate curriculum demand.';
  const deferredText = input.deferredExemplars.length
    ? `Defer to the next related ${aspect || 'aspect'} lesson: ${input.deferredExemplars.join(' ')}`
    : 'No explicit exemplar is being deferred from this assignment.';
  const relatedText = [
    input.previousRelatedFocus ? `Previous related focus: ${input.previousRelatedFocus}.` : '',
    input.nextRelatedFocus ? `Next related focus may continue at: ${input.nextRelatedFocus}.` : '',
  ].filter(Boolean).join(' ');

  const focus = [
    `Lesson ${input.lessonNumber} assigned entry: ${formatEntryLabel(primary, aspect || input.weekFocus)}.`,
    `Assigned strategy: ${input.profile.strategy}.`,
    supportText,
    deferredText,
    relatedText,
    'Use only this assigned entry as the main boundary for strand, sub-strand, topic, activities, examples, performance indicator and assessment.',
  ].filter(Boolean).join(' ');

  return {
    lessonNumber: input.lessonNumber,
    title,
    focus,
    aspect: aspect || undefined,
    assignedEntryIndex: input.assignedEntryIndex,
    assignedEntry: primary,
    supportExemplars: input.supportExemplars,
    deferredExemplars: input.deferredExemplars,
    previousRelatedFocus: input.previousRelatedFocus,
    nextRelatedFocus: input.nextRelatedFocus,
  };
}

function buildExemplarPlan(input: {
  entry?: SchemeWeekEntry;
  profile: SubjectLessonProfile;
  repeatedEntrySlotIndex: number;
  repeatedEntrySlotCount: number;
  hasFutureRelatedEntry: boolean;
}) {
  const exemplars = uniqueStrings(input.entry?.exemplars ?? []);
  if (!exemplars.length) return { supportExemplars: [], deferredExemplars: [] };

  const groups = groupExemplarsByStage(exemplars, input.profile.strategy);
  if (input.repeatedEntrySlotCount > 1) {
    const chunks = splitStageGroupsAcrossSlots(groups, input.repeatedEntrySlotCount);
    const supportExemplars = chunks[input.repeatedEntrySlotIndex] ?? chunks[chunks.length - 1] ?? exemplars;
    return {
      supportExemplars,
      deferredExemplars: chunks.slice(input.repeatedEntrySlotIndex + 1).flat(),
    };
  }

  if (input.hasFutureRelatedEntry && groups.length > 1) {
    return {
      supportExemplars: groups[0],
      deferredExemplars: groups.slice(1).flat(),
    };
  }

  return { supportExemplars: exemplars, deferredExemplars: [] };
}

function groupExemplarsByStage(exemplars: string[], strategy: SubjectStrategy): string[][] {
  if (strategy === 'language-aspect') {
    return groupByStage(exemplars, (text) => {
      if (hasAny(text, ['write', 'compose', 'paragraph', 'essay', 'extended', 'present', 'produce'])) return 2;
      if (hasAny(text, ['categorise', 'categorize', 'classify', 'correct', 'transform', 'convert', 'compare', 'distinguish'])) return 1;
      return 0;
    });
  }

  if (strategy === 'science-inquiry') {
    return groupByStage(exemplars, (text) => {
      if (hasAny(text, ['explain', 'analyse', 'analyze', 'apply', 'conclude', 'evaluate'])) return 2;
      if (hasAny(text, ['investigate', 'demonstrate', 'record', 'experiment', 'measure'])) return 1;
      return 0;
    });
  }

  if (strategy === 'mathematics-progression') {
    return groupByStage(exemplars, (text) => {
      if (hasAny(text, ['solve', 'apply', 'word problem', 'independent', 'prove'])) return 2;
      if (hasAny(text, ['calculate', 'work', 'practice', 'guided', 'construct'])) return 1;
      return 0;
    });
  }

  if (strategy === 'creative-process' || strategy === 'practical-production') {
    return groupByStage(exemplars, (text) => {
      if (hasAny(text, ['make', 'perform', 'produce', 'evaluate', 'appraise', 'display'])) return 1;
      return 0;
    });
  }

  if (strategy === 'concept-application') {
    return groupByStage(exemplars, (text) => {
      if (hasAny(text, ['apply', 'reflect', 'present', 'role play', 'role-play', 'community', 'life'])) return 1;
      return 0;
    });
  }

  return [exemplars];
}

function splitStageGroupsAcrossSlots(groups: string[][], slotCount: number): string[][] {
  if (!groups.length) return [];
  if (groups.length === slotCount) return groups;
  if (groups.length > slotCount) {
    const chunks = splitBalanced(groups, slotCount);
    return chunks.map((chunk) => chunk.flat());
  }
  const result = [...groups];
  while (result.length < slotCount) {
    result.push(groups[groups.length - 1]);
  }
  return result.slice(0, slotCount);
}

function groupByStage(exemplars: string[], classify: (text: string) => number): string[][] {
  const buckets = new Map<number, string[]>();
  exemplars.forEach((exemplar) => {
    const stage = classify(normalizeForMatch(exemplar));
    buckets.set(stage, [...(buckets.get(stage) ?? []), exemplar]);
  });
  return [...buckets.entries()]
    .sort((left, right) => left[0] - right[0])
    .map(([, values]) => values)
    .filter((values) => values.length);
}

function buildFallbackGuidance(input: {
  subject: string;
  classLevel: ClassLevel | string;
  selectedWeek?: SchemeWeek;
  sessionIndex?: number;
  sessionsPerWeek?: number;
}, lessonCount: number): WeeklyLessonAssignmentGuidance | undefined {
  const fallback = buildExemplarLessonGuidance({
    subject: input.subject,
    classLevel: String(input.classLevel),
    week: input.selectedWeek,
    sessionIndex: input.sessionIndex,
    sessionsPerWeek: lessonCount,
  });
  if (!fallback?.allFocuses?.length) return undefined;
  const assignments = fallback.allFocuses.map((focus, index) => ({
    lessonNumber: index + 1,
    title: focus,
    focus,
    supportExemplars: [],
    deferredExemplars: [],
  }));
  const focusIndex = Math.min(Math.max((input.sessionIndex ?? 1) - 1, 0), Math.max(assignments.length - 1, 0));
  return {
    allFocuses: fallback.allFocuses,
    currentFocus: fallback.allFocuses[focusIndex],
    assignments,
    currentAssignment: assignments[focusIndex],
  };
}

function findRelatedEntry(
  weeks: SchemeWeek[] | undefined,
  currentWeekNumber: number,
  entry: SchemeWeekEntry,
  direction: -1 | 1,
) {
  const sorted = [...(weeks ?? [])].sort((left, right) => left.week - right.week);
  const candidates = direction > 0
    ? sorted.filter((week) => week.week > currentWeekNumber)
    : sorted.filter((week) => week.week < currentWeekNumber).reverse();
  for (const week of candidates) {
    const match = getWeekEntries(week).find((candidate) => isRelatedEntry(candidate, entry));
    if (match) return match;
  }
  return undefined;
}

function isRelatedEntry(left: SchemeWeekEntry, right: SchemeWeekEntry) {
  const leftAspect = normalizeForMatch([left.strand, left.subStrand].filter(Boolean).join(' '));
  const rightAspect = normalizeForMatch([right.strand, right.subStrand].filter(Boolean).join(' '));
  if (leftAspect && rightAspect && leftAspect === rightAspect) return true;

  const leftStandard = extractStandardCode(left.contentStandard || left.indicator);
  const rightStandard = extractStandardCode(right.contentStandard || right.indicator);
  return Boolean(leftStandard && rightStandard && leftStandard === rightStandard);
}

function formatEntryLabel(entry: SchemeWeekEntry | undefined, fallback: string) {
  if (!entry) return fallback;
  return [
    entry.strand,
    entry.subStrand,
    entry.topic,
    entry.indicator,
  ].filter(Boolean).join(' - ') || fallback;
}

function splitBalanced<T>(values: T[], groups: number): T[][] {
  if (!values.length || groups <= 0) return [];
  const groupCount = Math.min(groups, values.length);
  const result: T[][] = [];
  let cursor = 0;

  for (let index = 0; index < groupCount; index += 1) {
    const remainingItems = values.length - cursor;
    const remainingGroups = groupCount - index;
    const size = index === groupCount - 1 ? remainingItems : Math.floor(remainingItems / remainingGroups);
    result.push(values.slice(cursor, cursor + Math.max(1, size)));
    cursor += Math.max(1, size);
  }

  return result;
}

function extractStandardCode(value?: string) {
  return normalizeCurriculumCodeSpacing(value ?? '').match(/B[1-9](?:\/JHS[1-3])?(?:\.\d+){3}/)?.[0] ?? '';
}

function normalizeCurriculumCodeSpacing(value: string): string {
  return value
    .replace(/(JHS\d)\s+(\d)/g, '$1.$2')
    .replace(/(B\d\/JHS\d)\s*\.\s*/g, '$1.')
    .replace(/\s+\./g, '.')
    .replace(/\.\s+/g, '.');
}

function hasAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(normalizeForMatch(term)));
}

function normalizeForMatch(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeSubject(value: string) {
  return value.trim().toLowerCase();
}

function uniqueStrings(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const clean = value.trim();
    const key = clean.toLowerCase();
    if (!clean || seen.has(key)) continue;
    seen.add(key);
    result.push(clean);
  }
  return result;
}

