import { generateLessonPlan, translateLessonPlan } from './ai';
import { saveLessonPlan, saveLessonPlanBundle } from './lessonStore';
import { calculateWeekEnding } from './termDates';
import { loadTeacherProfile } from './teacherProfile';
import type { ClassLevel, LessonPlan, LessonPlanBundle } from '@/types/lessonPlan';
import type { SchemeOfWork } from '@/types/scheme';

type LessonSelection = number | 'all';

type GenerateAndSaveLessonPlansInput = {
  subject: string;
  classLevel: ClassLevel;
  week: number;
  term: string;
  termStartDate: string;
  sessionsPerWeek: number;
  selectedLessonNumbers: number[];
  sessionIndex: LessonSelection;
  notes?: string;
  selectedScheme: SchemeOfWork;
};

export type GenerateAndSaveLessonPlansResult = {
  plans: LessonPlan[];
  savedPlanIds: string[];
  savedBundleId: string | null;
};

export async function generateAndSaveLessonPlans({
  subject,
  classLevel,
  week,
  term,
  termStartDate,
  sessionsPerWeek,
  selectedLessonNumbers,
  sessionIndex,
  notes,
  selectedScheme,
}: GenerateAndSaveLessonPlansInput): Promise<GenerateAndSaveLessonPlansResult> {
  const teacherProfile = await loadTeacherProfile();
  const weekEnding = calculateWeekEnding(termStartDate, week);
  const classSize = teacherProfile.classSizes?.[classLevel]?.trim() ?? '';
  const generated: LessonPlan[] = [];
  const savedPlanIds: string[] = [];
  let savedBundleId: string | null = null;

  for (const lessonNumber of selectedLessonNumbers) {
    const result = await generateLessonPlan(
      {
        subject: subject.trim(),
        classLevel,
        week,
        term: term.trim() || undefined,
        weekEnding: weekEnding || undefined,
        duration: '60 mins',
        sessionIndex: lessonNumber,
        sessionsPerWeek,
        notes: notes?.trim() || undefined,
        teacherName: teacherProfile.teacherName || undefined,
        schoolName: teacherProfile.schoolName || undefined,
        schoolDistrict: teacherProfile.schoolDistrict || undefined,
        classSize,
      },
      selectedScheme,
    );
    const enrichedResult = {
      ...result,
      date: weekEnding || result.date,
      duration: '60 mins',
      classSize,
      teacherName: teacherProfile.teacherName || undefined,
      schoolName: teacherProfile.schoolName || undefined,
      schoolDistrict: teacherProfile.schoolDistrict || undefined,
    };

    if (sessionIndex === 'all') {
      generated.push(enrichedResult);
      continue;
    }

    const saved = await saveLessonPlan(enrichedResult);
    if (saved.id) savedPlanIds.push(saved.id);
    generated.push(saved);
  }

  if (sessionIndex === 'all') {
    const savedBundle = await saveLessonPlanBundle(generated);
    savedBundleId = savedBundle.id ?? null;
    generated.splice(0, generated.length, ...savedBundle.plans);
  }

  return {
    plans: generated,
    savedPlanIds,
    savedBundleId,
  };
}

export async function translateAndSaveLessonPlans(
  plans: LessonPlan[],
  localLanguage: string,
): Promise<GenerateAndSaveLessonPlansResult> {
  if (plans.length === 1) {
    const translated = await translateLessonPlan(plans[0], localLanguage);
    const saved = await saveLessonPlan(translated);
    return {
      plans: [saved],
      savedPlanIds: saved.id ? [saved.id] : [],
      savedBundleId: null,
    };
  }

  const translatedPlans = await Promise.all(
    plans.map((plan) => translateLessonPlan(plan, localLanguage)),
  );
  const savedBundle = await saveLessonPlanBundle(translatedPlans);

  return {
    plans: savedBundle.plans,
    savedPlanIds: [],
    savedBundleId: savedBundle.id ?? null,
  };
}

export function buildGeneratedBundle(plans: LessonPlan[], savedBundleId: string | null): LessonPlanBundle {
  const first = plans[0];
  const subject = first?.subject ?? 'Lesson';
  const classLevel = first?.classLevel ?? 'B7';
  const week = first?.week ?? 1;
  const termTitle = first?.termTitle ?? '';
  const createdAt = first?.createdAt ?? new Date().toISOString();
  const lessonCount = plans.length;

  return {
    kind: 'bundle',
    id: savedBundleId ?? `generated-week-plan-${subject}-${classLevel}-${week}-${createdAt}`,
    title: `${subject} ${classLevel} Week ${week} (${lessonCount} lessons)`,
    subject,
    classLevel,
    termTitle,
    week,
    weekTitle: first?.weekTitle ?? `WEEK ${week}`,
    lessonCount,
    plans,
    createdAt,
    updatedAt: new Date().toISOString(),
  };
}
