import { invokeEdgeFunction } from './edgeFunctions';
import { getTeachingNoteContentBlocks } from './teachingNoteContent';
import type { LessonPlan, LessonVisualAid } from '@/types/lessonPlan';
import type { TeachingNoteContentBlock, TeachingNotes } from '@/types/teachingNotes';
import type { CompiledTestPaper } from '@/types/testItemCompiler';

type GeneratedVisualResult = {
  visuals: Array<Record<string, unknown>>;
};

export async function generateLessonPlanVisuals(
  plan: LessonPlan,
  options: { signal?: AbortSignal } = {},
): Promise<LessonPlan> {
  const visuals = (plan.visualAids ?? []).filter((visual) => visual.prompt && visual.status !== 'generated');
  if (!visuals.length) return plan;

  const data = await invokeEdgeFunction<GeneratedVisualResult>('generate-lesson-visuals', {
    lessonPlanId: plan.id,
    subject: plan.subject,
    classLevel: plan.classLevel,
    week: plan.week,
    source: 'lesson_plan',
    visuals,
  }, {
    authErrorMessage: 'Sign in again before generating diagrams.',
    signal: options.signal,
    timeoutMs: 120000,
  });

  return {
    ...plan,
    visualAids: mergeLessonVisuals(plan.visualAids ?? [], data.visuals),
  };
}

export async function generateTeachingNoteVisuals(
  notes: TeachingNotes,
  options: { signal?: AbortSignal } = {},
): Promise<TeachingNotes> {
  const blocks = getTeachingNoteContentBlocks(notes);
  const visualBlocks = blocks.filter(
    (block) => block.type === 'generated_visual' && block.prompt && block.status !== 'generated',
  );
  const visuals = visualBlocks.map((block) => ({
    id: block.id,
    title: block.title,
    prompt: block.prompt,
    caption: block.caption,
    visualKind: block.visualKind,
  }));
  if (!visuals.length) return { ...notes, contentBlocks: blocks, visuals: [] };

  const data = await invokeEdgeFunction<GeneratedVisualResult>('generate-lesson-visuals', {
    lessonPlanId: notes.lessonPlanId,
    subject: notes.subject,
    classLevel: notes.classLevel,
    week: notes.week,
    source: 'teaching_notes',
    visuals,
  }, {
    authErrorMessage: 'Sign in again before generating diagrams.',
    signal: options.signal,
    timeoutMs: 120000,
  });

  return {
    ...notes,
    contentBlocks: mergeTeachingNoteBlocks(blocks, data.visuals),
    visuals: [],
  };
}

export async function generateTestPaperVisuals(
  paper: CompiledTestPaper,
  options: { signal?: AbortSignal } = {},
): Promise<CompiledTestPaper> {
  const paperWithVisualIds: CompiledTestPaper = {
    ...paper,
    sections: paper.sections.map((section) => ({
      ...section,
      questions: section.questions.map((question) => ({
        ...question,
        visuals: (question.visuals ?? []).map((visual, index) => ({
          ...visual,
          id: visual.id ?? `${section.id}-${question.id}-visual-${index + 1}`,
        })),
      })),
    })),
  };

  const visuals = paperWithVisualIds.sections.flatMap((section) =>
    section.questions.flatMap((question) =>
      (question.visuals ?? [])
        .filter((visual) => visual.prompt && visual.status !== 'generated')
        .map((visual, index) => ({
          ...visual,
          id: visual.id ?? `${section.id}-${question.id}-visual-${index + 1}`,
          questionId: question.id,
        })),
    ),
  );
  if (!visuals.length) return paperWithVisualIds;

  const data = await invokeEdgeFunction<GeneratedVisualResult>('generate-lesson-visuals', {
    lessonPlanId: paper.id ?? `test-paper-${Date.now()}`,
    subject: paper.subject,
    classLevel: paper.classLevel,
    source: 'test_paper',
    visuals,
  }, {
    authErrorMessage: 'Sign in again before generating diagrams.',
    signal: options.signal,
    timeoutMs: 120000,
  });

  return {
    ...paperWithVisualIds,
    sections: paperWithVisualIds.sections.map((section) => ({
      ...section,
      questions: section.questions.map((question) => ({
        ...question,
        visuals: mergeLessonVisuals(question.visuals ?? [], data.visuals),
      })),
    })),
  };
}

function mergeLessonVisuals(existing: LessonVisualAid[], generated: Array<Record<string, unknown>>): LessonVisualAid[] {
  const byId = new Map(generated.map((visual) => [String(visual.id ?? ''), visual]));
  return existing.map((visual, index) => {
    const id = visual.id ?? `visual-${index + 1}`;
    const next = byId.get(id);
    return next ? { ...visual, ...next, id } as LessonVisualAid : { ...visual, id };
  });
}

function mergeTeachingNoteBlocks(
  blocks: TeachingNoteContentBlock[],
  generated: Array<Record<string, unknown>>,
): TeachingNoteContentBlock[] {
  const byId = new Map(generated.map((visual) => [String(visual.id ?? ''), visual]));
  return blocks.map((block) => {
    const next = byId.get(block.id);
    return next ? { ...block, ...next } as TeachingNoteContentBlock : block;
  });
}
