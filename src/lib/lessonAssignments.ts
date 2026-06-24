import type { ClassLevel } from '@/types/lessonPlan';
import type { SchemeWeek, SchemeWeekEntry } from '@/types/scheme';
import {
  buildExemplarLessonGuidance,
  getCurriculumFocusGroupsForEntry,
  type IndicatorFocusGroup,
} from './exemplarLessonGuidance';
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
  supportIndicators: string[];
  deferredIndicators: string[];
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

type IndexedEntry = { entry: SchemeWeekEntry; index: number };

type ExemplarPlan = {
  supportExemplars: string[];
  deferredExemplars: string[];
  supportIndicators: string[];
  deferredIndicators: string[];
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
      subject: input.subject,
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
      supportIndicators: exemplarPlan.supportIndicators,
      deferredIndicators: exemplarPlan.deferredIndicators,
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

function assignEntriesToLessons(entries: SchemeWeekEntry[], lessonCount: number): IndexedEntry[][] {
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
  supportIndicators: string[];
  deferredIndicators: string[];
  previousRelatedFocus?: string;
  nextRelatedFocus?: string;
  weekFocus: string;
}): WeeklyLessonAssignment {
  const entryGroup = input.entryGroup.filter(Boolean);
  const primary = input.assignedEntry ?? entryGroup[0];
  const aspect = entryGroup.map((entry) => entry.strand || entry.subStrand || entry.topic).filter(Boolean).join(' + ');
  const title = buildDisplayTitle({
    supportExemplars: input.supportExemplars,
    supportIndicators: input.supportIndicators,
    primary,
    aspect,
    weekFocus: input.weekFocus,
    lessonNumber: input.lessonNumber,
  });
  const supportText = input.supportExemplars.length
    ? `Teach now using these curriculum exemplars only: ${input.supportExemplars.join(' ')}`
    : 'Teach now using only this assigned entry and the curriculum demand stated in its indicator.';
  const supportIndicatorText = input.supportIndicators.length
    ? `Assigned indicator focus: ${input.supportIndicators.join(' ')}`
    : `Assigned indicator focus: ${primary?.indicator || primary?.topic || input.weekFocus || ''}`;
  const deferredText = input.deferredExemplars.length
    ? `Defer to a later related ${aspect || 'aspect'} lesson: ${input.deferredExemplars.join(' ')}`
    : 'No explicit curriculum exemplar is being deferred from this assignment.';
  const deferredIndicatorText = input.deferredIndicators.length
    ? `Deferred indicator focus: ${input.deferredIndicators.join(' ')}`
    : '';
  const relatedText = [
    input.previousRelatedFocus ? `Previous related focus: ${input.previousRelatedFocus}.` : '',
    input.nextRelatedFocus ? `Next related focus may continue at: ${input.nextRelatedFocus}.` : '',
  ].filter(Boolean).join(' ');

  const focus = [
    `Lesson ${input.lessonNumber} assigned entry: ${formatEntryLabel(primary, aspect || input.weekFocus)}.`,
    `Assigned strategy: ${input.profile.strategy}.`,
    supportIndicatorText,
    supportText,
    deferredText,
    deferredIndicatorText,
    relatedText,
    'Use only this assigned entry and teach-now exemplars as the boundary for strand, sub-strand, topic, activities, examples, performance indicator, assessment and visual aids.',
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
    supportIndicators: input.supportIndicators,
    deferredIndicators: input.deferredIndicators,
    previousRelatedFocus: input.previousRelatedFocus,
    nextRelatedFocus: input.nextRelatedFocus,
  };
}

function buildExemplarPlan(input: {
  subject: string;
  entry?: SchemeWeekEntry;
  profile: SubjectLessonProfile;
  repeatedEntrySlotIndex: number;
  repeatedEntrySlotCount: number;
  hasFutureRelatedEntry: boolean;
}): ExemplarPlan {
  const curriculumGroups = getCurriculumFocusGroupsForEntry({ subject: input.subject, entry: input.entry });
  const sourceGroups = curriculumGroups.length
    ? curriculumGroups
    : buildEntryOnlyFocusGroups(input.entry);
  if (!sourceGroups.length) {
    return { supportExemplars: [], deferredExemplars: [], supportIndicators: [], deferredIndicators: [] };
  }

  const requiredSlots = input.repeatedEntrySlotCount > 1
    ? input.repeatedEntrySlotCount
    : input.hasFutureRelatedEntry
      ? 2
      : 1;
  const slots = splitFocusGroupsAcrossSlots(sourceGroups, requiredSlots, input.profile.strategy);
  const supportSlotIndex = input.repeatedEntrySlotCount > 1 ? input.repeatedEntrySlotIndex : 0;
  const supportGroups = slots[supportSlotIndex] ?? slots[0] ?? [];
  const deferredGroups = input.repeatedEntrySlotCount > 1
    ? slots.slice(supportSlotIndex + 1).flat()
    : input.hasFutureRelatedEntry
      ? slots.slice(1).flat()
      : [];

  return {
    supportExemplars: uniqueStrings(supportGroups.flatMap((group) => group.exemplars)),
    deferredExemplars: uniqueStrings(deferredGroups.flatMap((group) => group.exemplars)),
    supportIndicators: uniqueStrings(supportGroups.map(formatIndicatorLabel).filter(Boolean)),
    deferredIndicators: uniqueStrings(deferredGroups.map(formatIndicatorLabel).filter(Boolean)),
  };
}

function buildEntryOnlyFocusGroups(entry?: SchemeWeekEntry): IndicatorFocusGroup[] {
  if (!entry) return [];
  const exemplars = uniqueStrings(entry.exemplars ?? []);
  if (exemplars.length) {
    return [{ indicator: cleanText(entry.indicator) || cleanText(entry.topic) || 'Weekly curriculum focus', exemplars }];
  }
  const indicator = cleanText(entry.indicator) || cleanText(entry.topic);
  return indicator ? [{ indicator, exemplars: [] }] : [];
}

function splitFocusGroupsAcrossSlots(
  groups: IndicatorFocusGroup[],
  slotCount: number,
  strategy: SubjectStrategy,
): IndicatorFocusGroup[][] {
  const cleanGroups = groups.filter(Boolean);
  if (!cleanGroups.length) return [];
  const safeSlotCount = Math.max(1, slotCount);
  if (safeSlotCount <= 1) return [cleanGroups];
  if (cleanGroups.length === 1) return splitSingleFocusGroup(cleanGroups[0], safeSlotCount, strategy);

  const allocations = allocateFocusGroupSlots(cleanGroups, safeSlotCount);
  return allocations.flatMap(({ group, count }) => splitSingleFocusGroup(group, count, strategy));
}

function allocateFocusGroupSlots(
  groups: IndicatorFocusGroup[],
  slotCount: number,
): Array<{ group: IndicatorFocusGroup; count: number }> {
  const allocations = groups.map((group, index) => ({ group, count: 1, index }));
  let remaining = Math.max(0, slotCount - allocations.length);

  while (remaining > 0) {
    allocations.sort((left, right) => exemplarWeight(right.group) / right.count - exemplarWeight(left.group) / left.count);
    allocations[0].count += 1;
    remaining -= 1;
  }

  return allocations.sort((left, right) => left.index - right.index);
}

function splitSingleFocusGroup(
  group: IndicatorFocusGroup,
  slotCount: number,
  strategy: SubjectStrategy,
): IndicatorFocusGroup[][] {
  const exemplars = uniqueStrings(group.exemplars ?? []);
  if (!exemplars.length) return Array.from({ length: slotCount }, () => [{ ...group, exemplars: [] }]);

  if (exemplars.length === 1 && slotCount > 1) {
    const expanded = expandSingleDenseExemplar(exemplars[0], group.indicator, strategy, slotCount);
    if (expanded.length > 1) return expanded.map((exemplar) => [{ ...group, exemplars: [exemplar] }]);
  }

  const stageGroups = groupExemplarsByStage(exemplars, strategy);
  const exemplarChunks = splitStageGroupsAcrossSlots(stageGroups, slotCount);

  return exemplarChunks.map((chunk) => [{ ...group, exemplars: chunk }]);
}

function expandSingleDenseExemplar(
  exemplar: string,
  indicator: string,
  strategy: SubjectStrategy,
  slotCount: number,
): string[] {
  const text = normalizeForMatch(`${indicator} ${exemplar}`);

  if (strategy === 'mathematics-progression' && hasAny(text, ['tallies', 'tally', 'frequency table', 'data'])) {
    return [
      'Use tallies to organise raw data into a frequency table.',
      'Complete and check frequency tables from tally data.',
      'Use the organised table or chart to answer questions and solve or pose problems.',
    ].slice(0, slotCount);
  }

  if (strategy === 'mathematics-progression') {
    return [
      `Introduce the mathematical idea and unpack the worked example: ${exemplar}`,
      `Use guided practice from the exemplar: ${exemplar}`,
      `Apply the exemplar independently to solve or pose related problems: ${exemplar}`,
    ].slice(0, slotCount);
  }

  if (strategy === 'science-inquiry') {
    return [
      `Identify and describe the key science idea: ${exemplar}`,
      `Demonstrate or investigate the science idea using observable evidence: ${exemplar}`,
      `Explain and apply the science idea to everyday situations: ${exemplar}`,
    ].slice(0, slotCount);
  }

  return [];
}

function exemplarWeight(group: IndicatorFocusGroup): number {
  return Math.max(1, group.exemplars.length);
}

function buildDisplayTitle(input: {
  supportExemplars: string[];
  supportIndicators: string[];
  primary?: SchemeWeekEntry;
  aspect: string;
  weekFocus: string;
  lessonNumber: number;
}): string {
  if (input.supportExemplars.length) return input.supportExemplars.join(' + ');
  if (input.supportIndicators.length) return input.supportIndicators.join(' + ');
  return [input.aspect, input.primary?.topic || input.weekFocus || `Lesson ${input.lessonNumber}`]
    .filter(Boolean)
    .join(' - ');
}

function formatIndicatorLabel(group: IndicatorFocusGroup): string {
  const code = cleanText(group.code);
  const indicator = cleanText(group.indicator);
  return [code, indicator].filter(Boolean).join(' ');
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
      if (hasAny(text, ['explain', 'analyse', 'analyze', 'apply', 'conclude', 'evaluate', 'use'])) return 2;
      if (hasAny(text, ['investigate', 'demonstrate', 'record', 'experiment', 'measure', 'observe'])) return 1;
      return 0;
    });
  }

  if (strategy === 'mathematics-progression') {
    return groupByStage(exemplars, (text) => {
      if (hasAny(text, ['solve', 'pose problems', 'apply', 'word problem', 'independent', 'prove', 'justify', 'analyse', 'analyze'])) return 2;
      if (hasAny(text, ['calculate', 'complete', 'work', 'practice', 'guided', 'construct', 'draw'])) return 1;
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
    supportIndicators: [],
    deferredIndicators: [],
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

function cleanText(value?: string) {
  return (value ?? '').trim();
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

