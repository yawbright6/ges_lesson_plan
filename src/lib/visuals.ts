import { invokeEdgeFunction } from './edgeFunctions';
import { getTeachingNoteContentBlocks } from './teachingNoteContent';
import type { LessonPlan, LessonVisualAid } from '@/types/lessonPlan';
import type { TeachingNoteContentBlock, TeachingNotes } from '@/types/teachingNotes';

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

