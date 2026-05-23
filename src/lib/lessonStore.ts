import { createGeneratedRepository } from './generatedRepository';
import { slugify } from './generatedStore';
import type { LessonPlan, LessonPlanBundle, SavedLessonWork } from '@/types/lessonPlan';

const STORAGE_KEY = 'local-lesson-plans';
const CACHE_PREFIX = 'generated:lesson-works';

const lessonWorkRepository = createGeneratedRepository<SavedLessonWork>({
  table: 'saved_lesson_plans',
  localStorageKey: STORAGE_KEY,
  cachePrefix: CACHE_PREFIX,
  normalize: normalizeLessonWork,
  title: buildTitle,
  sort: (a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''),
  createdAt: (item) => item.createdAt,
  saveTimeoutMessage: 'Lesson plan took too long to save.',
  loadTimeoutMessage: 'Saved lesson plans took too long to load.',
  getTimeoutMessage: 'Saved lesson plan took too long to load.',
  deleteTimeoutMessage: 'Saved lesson plan deletion took too long.',
});

export async function saveLessonPlan(plan: LessonPlan): Promise<LessonPlan> {
  const normalized = normalizeLessonPlan(plan);
  return (await saveLessonWork(normalized)) as LessonPlan;
}

export async function saveLessonPlanBundle(plans: LessonPlan[]): Promise<LessonPlanBundle> {
  const normalized = normalizeLessonPlanBundle(plans);
  return (await saveLessonWork(normalized)) as LessonPlanBundle;
}

export async function saveLessonPlanWork(work: SavedLessonWork): Promise<SavedLessonWork> {
  const normalized = normalizeLessonWork(work);
  return saveLessonWork(normalized);
}

async function saveLessonWork(work: SavedLessonWork): Promise<SavedLessonWork> {
  return lessonWorkRepository.save(work);
}

export async function loadLessonPlans(): Promise<LessonPlan[]> {
  const works = await loadLessonWorks();
  return works.filter(isLessonPlan);
}

export async function loadLessonWorks(): Promise<SavedLessonWork[]> {
  return lessonWorkRepository.loadAll();
}

export async function getLessonPlanById(id: string): Promise<LessonPlan | null> {
  const work = await lessonWorkRepository.getById(id);
  return work && isLessonPlan(work) ? work : null;
}

export async function getLessonPlanBundleById(id: string): Promise<LessonPlanBundle | null> {
  const work = await lessonWorkRepository.getById(id);
  return work && isLessonPlanBundle(work) ? work : null;
}

export async function deleteLessonPlan(id: string): Promise<void> {
  return lessonWorkRepository.remove(id);
}

function normalizeLessonWork(work: SavedLessonWork): SavedLessonWork {
  return isLessonPlanBundle(work) ? normalizeLessonPlanBundle(work.plans, work) : normalizeLessonPlan(work as LessonPlan);
}

function normalizeLessonPlan(plan: LessonPlan): LessonPlan {
  const createdAt = plan.createdAt ?? new Date().toISOString();
  const lessonSegment =
    plan.sessionIndex && plan.sessionsPerWeek
      ? `lesson-${plan.sessionIndex}-of-${plan.sessionsPerWeek}`
      : slugify(plan.lessonNumber) || 'lesson';
  const id =
    plan.id ??
    `${slugify(plan.subject)}-${plan.classLevel}-${plan.week}-${lessonSegment}-${slugify(plan.termTitle)}-${createdAt}`;

  return {
    ...plan,
    id,
    createdAt,
    updatedAt: plan.updatedAt ?? createdAt,
  };
}

function normalizeLessonPlanBundle(plans: LessonPlan[], bundle?: Partial<LessonPlanBundle>): LessonPlanBundle {
  const normalizedPlans = plans.map(normalizeLessonPlan);
  const first = normalizedPlans[0];
  const createdAt = bundle?.createdAt ?? first?.createdAt ?? new Date().toISOString();
  const lessonCount = normalizedPlans.length;
  const subject = bundle?.subject ?? first?.subject ?? 'Lesson';
  const classLevel = bundle?.classLevel ?? first?.classLevel ?? 'B7';
  const week = bundle?.week ?? first?.week ?? 1;
  const termTitle = bundle?.termTitle ?? first?.termTitle ?? '';
  const weekTitle = bundle?.weekTitle ?? first?.weekTitle ?? `WEEK ${week}`;
  const title = bundle?.title ?? `${subject} ${classLevel} Week ${week} (${lessonCount} lessons)`;
  const id =
    bundle?.id ??
    `${slugify(subject)}-${classLevel}-${week}-week-plan-${lessonCount}-lessons-${slugify(termTitle)}-${createdAt}`;

  return {
    kind: 'bundle',
    id,
    title,
    subject,
    classLevel,
    termTitle,
    week,
    weekTitle,
    lessonCount,
    plans: normalizedPlans,
    editedAt: bundle?.editedAt,
    createdAt,
    updatedAt: bundle?.updatedAt ?? createdAt,
  };
}

function buildTitle(work: SavedLessonWork) {
  if (isLessonPlanBundle(work)) return work.title;
  return `${work.subject} ${work.classLevel} Week ${work.week}`;
}

function isLessonPlanBundle(work: SavedLessonWork): work is LessonPlanBundle {
  return (work as LessonPlanBundle).kind === 'bundle' && Array.isArray((work as LessonPlanBundle).plans);
}

function isLessonPlan(work: SavedLessonWork): work is LessonPlan {
  return !isLessonPlanBundle(work);
}
