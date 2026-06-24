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
  | 'computing-practical'
  | 'social-inquiry'
  | 'rme-values'
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
  if (normalized.includes('computing')) return { defaultLessonsPerWeek: 2, strategy: 'computing-practical' };
  if (normalized.includes('social studies')) return { defaultLessonsPerWeek: 2, strategy: 'social-inquiry' };
  if (normalized === 'rme' || normalized.includes('religious and moral')) return { defaultLessonsPerWeek: 2, strategy: 'rme-values' };
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
  const normalizedGroups = normalizeFocusGroupsForAssignment(sourceGroups, input.entry, input.profile.strategy, requiredSlots);
  const slots = splitFocusGroupsAcrossSlots(normalizedGroups, requiredSlots, input.profile.strategy);
  const supportSlotIndex = input.repeatedEntrySlotCount > 1 ? input.repeatedEntrySlotIndex : 0;
  const supportGroups = slots[supportSlotIndex] ?? slots[0] ?? [];
  const deferredGroups = input.repeatedEntrySlotCount > 1
    ? slots.slice(supportSlotIndex + 1).flat()
    : input.hasFutureRelatedEntry
      ? slots.slice(1).flat()
      : [];

  return {
    supportExemplars: uniqueStrings(supportGroups.flatMap((group) => group.exemplars).map(cleanLessonFocusText).filter(Boolean)),
    deferredExemplars: uniqueStrings(deferredGroups.flatMap((group) => group.exemplars).map(cleanLessonFocusText).filter(Boolean)),
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

function normalizeFocusGroupsForAssignment(
  groups: IndicatorFocusGroup[],
  entry: SchemeWeekEntry | undefined,
  strategy: SubjectStrategy,
  slotCount: number,
): IndicatorFocusGroup[] {
  return groups.map((group) => {
    const preferredUnits = derivePreferredFocusUnits(group, entry, strategy, slotCount);
    if (!preferredUnits.length) return group;
    return {
      ...group,
      indicator: cleanText(entry?.indicator) || group.indicator,
      exemplars: preferredUnits,
    };
  });
}

function derivePreferredFocusUnits(
  group: IndicatorFocusGroup,
  entry: SchemeWeekEntry | undefined,
  strategy: SubjectStrategy,
  slotCount: number,
): string[] {
  const focusCount = Math.max(1, slotCount);
  const entryTopic = cleanLessonFocusText(entry?.topic ?? '');
  const indicator = cleanLessonFocusText(entry?.indicator || group.indicator);
  const exemplarText = cleanLessonFocusText(uniqueStrings(group.exemplars ?? []).join(' '));
  const entryContext = normalizeForMatch([
    entry?.topic,
    entry?.strand,
    entry?.subStrand,
    entry?.indicator,
    entry?.contentStandard,
  ].filter(Boolean).join(' '));
  const combined = normalizeForMatch([
    entryContext,
    group.indicator,
    exemplarText,
  ].filter(Boolean).join(' '));

  if (strategy === 'computing-practical') {
    if (hasAny(entryContext, ['network hardware', 'network topologies', 'network systems'])) {
      return [
        'Identify key network hardware used to set up network systems, such as server, client, hub, switch and cables.',
        'Explain and draw network topologies such as bus, star, ring and mesh, including their features.',
      ].slice(0, focusCount);
    }

    if (hasAny(entryContext, ['spreadsheet interface', 'basic data operations', 'entering data'])) {
      return [
        'Identify the main parts and features of the spreadsheet interface.',
        'Enter, select, delete and move data in a spreadsheet using a sample data set.',
      ].slice(0, focusCount);
    }

    if (hasAny(entryContext, ['create formulas', 'simple formulas', 'spreadsheet formula'])) {
      return [
        'Explain formula structure and why spreadsheet formulas begin with the equal sign (=).',
        'Create and test simple spreadsheet formulas using cell references and basic operators.',
      ].slice(0, focusCount);
    }

    if (hasAny(entryContext, ['modern storage', 'storage systems'])) {
      return [
        'Identify and describe modern storage systems such as flash memory cards, USB flash drives, SSDs and hybrid hard drives.',
        'Illustrate the uses, capacities and differences of modern storage systems.',
      ].slice(0, focusCount);
    }
  }

  if (strategy === 'mathematics-progression' && hasAny(combined, ['construct special angles', 'construct angles', '30', '45', '60', '75', '90'])) {
    return [
      'Construct 90 degrees and 45 degrees angles using a straightedge and pair of compasses.',
      'Construct 60 degrees and 30 degrees angles and verify the constructions.',
      'Construct 15 degrees and 75 degrees angles by bisecting known angles.',
    ].slice(0, focusCount);
  }

  if (strategy === 'mathematics-progression' && (group.exemplars ?? []).some((exemplar) => isRawWorkedExample(exemplar))) {
    return deriveIndicatorFocusUnits(group, slotCount, strategy);
  }

  if (strategy === 'practical-production' && hasAny(combined, ['micro small and medium', 'business enterprises', 'setting up micro', 'small business enterprise'])) {
    const enterpriseUnits = hasAny(entryContext, ['classifying', 'classify', 'enterprise ideas'])
      ? [
          'Identify and classify local enterprises as micro, small or medium-sized businesses.',
          'Develop and display a photo album of local enterprise examples for discussion and appraisal.',
        ]
      : hasAny(entryContext, ['setting up', 'managing', 'steps'])
        ? [
            'Explain steps involved in setting up and managing micro and small business enterprises.',
            'Discuss how micro, small and medium-sized enterprises are started and managed in the locality.',
          ]
        : [
            'Explain the meaning and criteria of micro, small and medium-sized business enterprises.',
            'Identify and classify local enterprises, then discuss steps involved in setting up micro and small businesses.',
          ];
    return enterpriseUnits.slice(0, focusCount);
  }

  if (strategy === 'language-aspect' && entryTopic && hasAny(combined, ['initiate discussions', 'engage in conferences', 'oral summary', 'listening to extended oral texts'])) {
    return [
      entryTopic,
      `Practise and apply ${entryTopic.toLowerCase()} through oral or written response activities.`,
    ].slice(0, focusCount);
  }

  if (strategy === 'language-aspect' && isGenericListeningFocus(combined) && entryTopic) {
    return [
      entryTopic,
      `Practise and apply ${entryTopic.toLowerCase()} through oral or written response activities.`,
    ].slice(0, focusCount);
  }

  if (strategy === 'language-aspect' && isRawWorkedExample(exemplarText) && entryTopic) {
    return [entryTopic, `Apply ${entryTopic.toLowerCase()} in a guided language task.`].slice(0, focusCount);
  }

  return [];
}

function isGenericListeningFocus(text: string) {
  return hasAny(text, ['listen to a level appropriate dialogue', 'listen to and note important issues', 'identify key information', 'message mood']);
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

  const naturalUnits = buildNaturalFocusUnitsAcrossGroups(cleanGroups, strategy, safeSlotCount);
  const completeUnits = naturalUnits.length >= safeSlotCount
    ? naturalUnits
    : expandSparseFocusUnits(naturalUnits, cleanGroups, safeSlotCount, strategy);
  const slots = splitFocusUnitsIntoLessonSlots(completeUnits, safeSlotCount);
  return slots.map((slot) => groupsFromFocusUnits(slot));
}

type FocusUnit = {
  group: IndicatorFocusGroup;
  text: string;
  stage: number;
  index: number;
};

function buildNaturalFocusUnitsAcrossGroups(
  groups: IndicatorFocusGroup[],
  strategy: SubjectStrategy,
  slotCount: number,
): FocusUnit[] {
  const units: FocusUnit[] = [];

  groups.forEach((group, groupIndex) => {
    const exemplars = uniqueStrings(group.exemplars ?? []).map(cleanLessonFocusText).filter(Boolean);
    const derivedUnits = deriveIndicatorFocusUnits(group, slotCount, strategy);
    const groupUnits = shouldPreferDerivedFocusUnits(group, strategy, slotCount)
      ? derivedUnits
      : exemplars.length
        ? exemplars
        : derivedUnits.slice(0, 1);
    groupUnits.forEach((text, unitIndex) => {
      const cleanTextValue = cleanLessonFocusText(text);
      if (!cleanTextValue) return;
      units.push({
        group,
        text: cleanTextValue,
        stage: classifyExemplarStage(cleanTextValue, strategy),
        index: groupIndex * 100 + unitIndex,
      });
    });
  });

  return dedupeFocusUnits(units);
}
function shouldPreferDerivedFocusUnits(group: IndicatorFocusGroup, strategy: SubjectStrategy, slotCount: number) {
  if (slotCount <= 1 || strategy !== 'mathematics-progression') return false;
  const combined = normalizeForMatch(`${group.indicator} ${(group.exemplars ?? []).join(' ')}`);
  return hasAny(combined, ['tallies', 'tally', 'frequency table', 'data'])
    && (group.exemplars ?? []).some((exemplar) => isRawWorkedExample(exemplar));
}

function isRawWorkedExample(value: string) {
  const text = normalizeForMatch(value);
  const digitCount = (value.match(/\d/g) ?? []).length;
  return text.startsWith('e g') || digitCount >= 20 || text.includes('complete the frequency table below');
}

function splitFocusUnitsIntoLessonSlots(
  units: FocusUnit[],
  slotCount: number,
): FocusUnit[][] {
  const cleanUnits = dedupeFocusUnits(units).sort((left, right) => left.stage - right.stage || left.index - right.index);
  if (!cleanUnits.length) return [];
  if (slotCount <= 1) return [cleanUnits];
  if (cleanUnits.length <= slotCount) {
    const exactSlots = cleanUnits.map((unit) => [unit]);
    while (exactSlots.length < slotCount) exactSlots.push([]);
    return exactSlots;
  }

  const stageGroups = groupFocusUnitsByStage(cleanUnits);
  const chunks = stageGroups.length > 1
    ? splitStageUnitGroupsAcrossSlots(stageGroups, slotCount)
    : splitBalanced(cleanUnits, Math.min(slotCount, cleanUnits.length));
  while (chunks.length < slotCount) chunks.push([]);
  return chunks.slice(0, slotCount);
}

function expandSparseFocusUnits(
  units: FocusUnit[],
  groups: IndicatorFocusGroup[],
  slotCount: number,
  strategy: SubjectStrategy,
): FocusUnit[] {
  const expanded = [...units];
  groups.forEach((group, groupIndex) => {
    if (expanded.length >= slotCount) return;
    const derived = deriveIndicatorFocusUnits(group, slotCount, strategy);
    derived.forEach((text, derivedIndex) => {
      if (expanded.length >= slotCount) return;
      const cleanTextValue = cleanLessonFocusText(text);
      if (!cleanTextValue || expanded.some((item) => areSimilarFocusUnits(item.text, cleanTextValue))) return;
      expanded.push({
        group,
        text: cleanTextValue,
        stage: classifyExemplarStage(cleanTextValue, strategy),
        index: groupIndex * 1000 + derivedIndex,
      });
    });
  });
  return expanded;
}

function groupFocusUnitsByStage(units: FocusUnit[]): FocusUnit[][] {
  const buckets = new Map<number, FocusUnit[]>();
  units.forEach((unit) => {
    buckets.set(unit.stage, [...(buckets.get(unit.stage) ?? []), unit]);
  });
  return [...buckets.entries()]
    .sort((left, right) => left[0] - right[0])
    .map(([, values]) => values)
    .filter((values) => values.length);
}

function splitStageUnitGroupsAcrossSlots(groups: FocusUnit[][], slotCount: number): FocusUnit[][] {
  if (groups.length === slotCount) return groups;
  if (groups.length > slotCount) return splitBalanced(groups, slotCount).map((chunk) => chunk.flat());
  const result = groups.map((group) => [...group]);
  while (result.length < slotCount) {
    let splitIndex = -1;
    let splitSize = 1;
    result.forEach((group, index) => {
      if (group.length > splitSize) {
        splitIndex = index;
        splitSize = group.length;
      }
    });
    if (splitIndex < 0) break;
    const [left, right] = splitBalanced(result[splitIndex], 2);
    result.splice(splitIndex, 1, left ?? [], right ?? []);
  }
  while (result.length < slotCount) result.push([]);
  return result.slice(0, slotCount);
}

function groupsFromFocusUnits(units: FocusUnit[]): IndicatorFocusGroup[] {
  const groups = new Map<IndicatorFocusGroup, string[]>();
  units.forEach((unit) => {
    groups.set(unit.group, [...(groups.get(unit.group) ?? []), unit.text]);
  });

  return [...groups.entries()].map(([group, exemplars]) => ({
    ...group,
    exemplars: uniqueStrings(exemplars),
  }));
}

function dedupeFocusUnits(units: FocusUnit[]): FocusUnit[] {
  const result: FocusUnit[] = [];
  for (const unit of units) {
    if (!unit.text || result.some((existing) => areSimilarFocusUnits(existing.text, unit.text))) continue;
    result.push(unit);
  }
  return result;
}

function areSimilarFocusUnits(left: string, right: string) {
  const leftTokens = new Set(tokenizeFocus(left));
  const rightTokens = tokenizeFocus(right);
  if (!leftTokens.size || !rightTokens.length) return normalizeForMatch(left) === normalizeForMatch(right);
  const shared = rightTokens.filter((token) => leftTokens.has(token)).length;
  return shared / Math.max(leftTokens.size, rightTokens.length) >= 0.82;
}

function tokenizeFocus(value: string) {
  return normalizeForMatch(value)
    .split(' ')
    .filter((token) => token.length > 3 && !FOCUS_STOP_WORDS.has(token));
}
function classifyExemplarStage(exemplar: string, strategy: SubjectStrategy): number {
  const text = normalizeForMatch(exemplar);

  if (strategy === 'language-aspect') {
    if (hasAny(text, ['write', 'compose', 'paragraph', 'essay', 'extended', 'present', 'produce'])) return 2;
    if (hasAny(text, ['categorise', 'categorize', 'classify', 'correct', 'transform', 'convert', 'compare', 'distinguish'])) return 1;
    return 0;
  }

  if (strategy === 'science-inquiry') {
    if (hasAny(text, ['apply', 'conclude', 'evaluate', 'select', 'explore', 'present findings', 'present', 'uses of', 'everyday life', 'applications'])) return 2;
    if (hasAny(text, ['investigate', 'demonstrate', 'record', 'experiment', 'measure', 'observe', 'explain', 'practice', 'practise', 'match'])) return 1;
    return 0;
  }

  if (strategy === 'mathematics-progression') {
    if (hasAny(text, ['solve', 'pose problems', 'apply', 'word problem', 'independent', 'prove', 'justify', 'analyse', 'analyze'])) return 2;
    if (hasAny(text, ['calculate', 'complete', 'work', 'practice', 'guided', 'construct', 'draw'])) return 1;
    return 0;
  }

  if (strategy === 'computing-practical') {
    if (hasAny(text, ['network hardware', 'formula structure', 'spreadsheet interface'])) return 0;
    if (hasAny(text, ['network topologies', 'create and test', 'enter select delete', 'enter, select, delete'])) return 1;
    if (hasAny(text, ['evaluate', 'troubleshoot', 'format', 'create', 'apply', 'safe', 'safety', 'risk reduction'])) return 2;
    if (hasAny(text, ['demonstrate', 'explore', 'insert', 'configure', 'practise', 'practice'])) return 1;
    return 0;
  }

  if (strategy === 'rme-values' || strategy === 'social-inquiry' || strategy === 'concept-application') {
    if (hasAny(text, ['apply', 'reflect', 'present', 'role play', 'role-play', 'demonstrate', 'community', 'life', 'evaluate'])) return 2;
    if (hasAny(text, ['discuss', 'distinguish', 'compare', 'explain benefits', 'examine'])) return 1;
    return 0;
  }

  if (strategy === 'creative-process' || strategy === 'practical-production') {
    if (hasAny(text, ['make', 'perform', 'produce', 'evaluate', 'appraise', 'display'])) return 1;
    return 0;
  }

  return 0;
}

function deriveIndicatorFocusUnits(
  group: IndicatorFocusGroup,
  slotCount: number,
  strategy: SubjectStrategy,
): string[] {
  const indicator = cleanLessonFocusText(group.indicator);
  const exemplarText = cleanLessonFocusText(uniqueStrings(group.exemplars ?? []).join(' '));
  const combined = normalizeForMatch(`${indicator} ${exemplarText}`);

  if (strategy === 'computing-practical') {
    if (hasAny(combined, ['online services', 'social media', 'wikis', 'blogs'])) {
      return [
        'Identify common online services learners use or can access, including social media, wikis, blogs, email and learning platforms.',
        'Explain and evaluate issues associated with online services such as privacy, misinformation, cyberbullying, addiction, scams and unreliable content.',
      ].slice(0, slotCount);
    }

    if (hasAny(combined, ['health issues', 'workstation health', 'wrist pains', 'eye problems', 'back and neck pains'])) {
      return [
        'Identify health risks at computer workstations, including wrist pain, eye strain, back and neck pain and faulty electrical connections.',
        'Discuss ways to prevent or reduce workstation health risks through posture, screen distance, breaks, chair adjustment and safe cable use.',
      ].slice(0, slotCount);
    }

    if (hasAny(combined, ['risk reduction', 'screen protectors', 'speakers', 'earpieces', 'electric sockets'])) {
      return [
        'Demonstrate safe volume and eye-protection practices when using speakers, earpieces, screens and screen protectors.',
        'Illustrate electrical safety and risk reduction at workstations, including avoiding overloaded sockets and unsafe adapters.',
      ].slice(0, slotCount);
    }

    return [
      `Unpack ICT terms, tools and procedures in the indicator: ${indicator}`,
      `Practise or demonstrate the expected computing skill using the curriculum examples: ${exemplarText || indicator}`,
      `Apply, evaluate or troubleshoot the computing skill in a practical task: ${exemplarText || indicator}`,
    ].slice(0, slotCount);
  }

  if (strategy === 'rme-values') {
    if (hasAny(combined, ['ssnit', 'pension', 'retirement', 'invalidity', 'dependents'])) {
      return [
        'Explain the meaning and purpose of the SSNIT pension scheme, focusing on benefits to workers on retirement or invalidity.',
        'Discuss SSNIT pension benefits to dependents after the death of a worker and to foreigners permanently leaving Ghana.',
      ].slice(0, slotCount);
    }

    return [
      `Explain the key religious or moral concept in the indicator: ${indicator}`,
      `Discuss examples and life applications from the exemplars: ${exemplarText || indicator}`,
      `Reflect on values, choices and community-life application: ${exemplarText || indicator}`,
    ].slice(0, slotCount);
  }

  if (strategy === 'social-inquiry') {
    return [
      `Explain the key civic, historical, geographical or social concept in the indicator: ${indicator}`,
      `Discuss local examples, causes, effects or responsibilities from the exemplars: ${exemplarText || indicator}`,
      `Apply the concept through reflection, presentation, inquiry or community action: ${exemplarText || indicator}`,
    ].slice(0, slotCount);
  }

  if (strategy === 'mathematics-progression' && hasAny(combined, ['tallies', 'tally', 'frequency table', 'data'])) {
    return [
      'Use tallies to organise raw data into a frequency table.',
      'Complete and check frequency tables from tally data.',
      'Use the organised table or chart to answer questions and solve or pose problems.',
    ].slice(0, slotCount);
  }

  if (strategy === 'mathematics-progression') {
    return [
      `Introduce the mathematical concept, vocabulary or rule in the indicator: ${indicator}`,
      `Work through guided examples and practice: ${exemplarText || indicator}`,
      `Apply the concept independently to solve or pose related problems: ${exemplarText || indicator}`,
    ].slice(0, slotCount);
  }

  if (strategy === 'science-inquiry') {
    return [
      `Identify and describe the key science idea in the indicator: ${indicator}`,
      `Demonstrate or investigate the science idea using observable evidence: ${exemplarText || indicator}`,
      `Explain and apply the science idea to everyday situations: ${exemplarText || indicator}`,
    ].slice(0, slotCount);
  }

  return [
    `Unpack the key terms and concepts in the indicator: ${indicator}`,
    `Use the curriculum examples for guided practice or discussion: ${exemplarText || indicator}`,
    `Apply, assess or extend the focus: ${exemplarText || indicator}`,
  ].slice(0, slotCount);
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

const FOCUS_STOP_WORDS = new Set([
  'with',
  'from',
  'that',
  'this',
  'their',
  'them',
  'into',
  'using',
  'learners',
  'lesson',
  'focus',
  'indicator',
  'exemplar',
  'examples',
  'discuss',
  'identify',
  'explain',
  'demonstrate',
  'describe',
  'explore',
]);

function normalizeForMatch(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeSubject(value: string) {
  return value.trim().toLowerCase();
}

function cleanText(value?: string) {
  return (value ?? '').trim();
}

function cleanLessonFocusText(value?: string) {
  return cleanText(value)
    .replace(/\bprevail in cyberspace\b/gi, '')
    .replace(/\b\d+\s*©?\s*NaCCA,?\s+Ministry of Education\s+\d{4}\b/gi, '')
    .replace(/\bNaCCA,?\s+Ministry of Education\s+\d{4}\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s+([.,;:])/g, '$1');
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
