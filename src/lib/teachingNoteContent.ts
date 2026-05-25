import type {
  TeachingNoteContentBlock,
  TeachingNoteContentBlockType,
  TeachingNoteVisual,
  TeachingNotes,
} from '@/types/teachingNotes';
import type { LessonVisualAidType } from '@/types/lessonPlan';

export const STRUCTURED_TEACHING_NOTE_BLOCK_TYPES = new Set<TeachingNoteContentBlockType>([
  'labelled_diagram',
  'process_steps',
  'process_diagram',
  'block_diagram',
  'flowchart',
  'timeline',
  'comparison_table',
  'bar_chart',
  'line_graph',
  'frequency_table',
  'tally_table',
  'place_value_table',
  'observation_table',
  'algorithm_trace_table',
  'number_line',
  'coordinate_grid',
  'geometry_shape',
  'fraction_model',
  'venn_diagram',
  'angle_diagram',
  'cycle_diagram',
  'classification_chart',
  'experiment_setup',
  'circuit_diagram',
  'network_diagram',
  'interface_mockup',
  'data_table',
  'story_map',
]);

export const GENERATED_TEACHING_NOTE_BLOCK_TYPES = new Set<TeachingNoteContentBlockType>([
  'generated_visual',
  'image_grid',
]);

export function isStructuredTeachingNoteBlockType(type: TeachingNoteContentBlockType | string | undefined) {
  return typeof type === 'string' && STRUCTURED_TEACHING_NOTE_BLOCK_TYPES.has(type as TeachingNoteContentBlockType);
}

export function isGeneratedTeachingNoteBlockType(type: TeachingNoteContentBlockType | string | undefined) {
  return typeof type === 'string' && GENERATED_TEACHING_NOTE_BLOCK_TYPES.has(type as TeachingNoteContentBlockType);
}

/** @deprecated Use isStructuredTeachingNoteBlockType or isGeneratedTeachingNoteBlockType */
export function isVisualTeachingNoteBlockType(type: TeachingNoteContentBlockType | string | undefined) {
  return isStructuredTeachingNoteBlockType(type) || isGeneratedTeachingNoteBlockType(type);
}

/** Lesson-note blocks — merges legacy `visuals[]`; omits Gemini blocks when disabled. */
export function getTeachingNoteContentBlocks(
  notes: TeachingNotes,
  options: { includeGeneratedVisuals?: boolean } = {},
): TeachingNoteContentBlock[] {
  const includeGeneratedVisuals = options.includeGeneratedVisuals ?? true;
  const blocks = (notes.contentBlocks ?? []).filter(
    (block) => includeGeneratedVisuals || !isGeneratedTeachingNoteBlockType(block.type),
  );

  const blockIds = new Set(blocks.map((block) => block.id));
  for (const visual of notes.visuals ?? []) {
    if (blockIds.has(visual.id)) continue;
    const legacyBlock = legacyVisualToContentBlock(visual);
    if (!includeGeneratedVisuals && isGeneratedTeachingNoteBlockType(legacyBlock.type)) continue;
    blocks.push(legacyBlock);
    blockIds.add(visual.id);
  }

  return blocks;
}

/** Removes AI image placeholders only (keeps Claude structured diagrams/tables). */
export function stripGeneratedTeachingNoteVisuals(notes: TeachingNotes): TeachingNotes {
  return {
    ...notes,
    contentBlocks: (notes.contentBlocks ?? []).filter((block) => !isGeneratedTeachingNoteBlockType(block.type)),
    visuals: [],
  };
}

/** @deprecated Use stripGeneratedTeachingNoteVisuals */
export const stripTeachingNoteVisuals = stripGeneratedTeachingNoteVisuals;

export function hasPendingTeachingNoteVisuals(
  notes: TeachingNotes,
  options: { includeGeneratedVisuals?: boolean } = {},
): boolean {
  if (options.includeGeneratedVisuals === false) return false;
  return getTeachingNoteContentBlocks(notes, options).some(
    (block) => block.type === 'generated_visual' && block.prompt && block.status !== 'generated',
  );
}

export function contentBlockToVisual(block: TeachingNoteContentBlock): TeachingNoteVisual {
  return {
    id: block.id,
    type: block.visualType ?? teachingBlockTypeToVisualType(block.type),
    kind: block.visualKind ?? (block.type === 'bar_chart' ? 'chart' : 'diagram'),
    source: block.type === 'generated_visual' ? 'generated' : 'structured',
    title: block.title ?? 'Diagram',
    caption: block.caption,
    prompt: block.prompt,
    imageUrl: block.imageUrl,
    storagePath: block.storagePath,
    labels: block.labels,
    rows: block.rows,
    steps: block.steps,
    data: block.data,
    columns: block.columns,
    cells: block.cells,
    min: block.min,
    max: block.max,
    points: block.points,
    shape: block.shape,
    segments: block.segments,
    shadedSegments: block.shadedSegments,
    items: block.items,
    centralNode: block.centralNode,
    nodes: block.nodes,
    groups: block.groups,
  };
}

function teachingBlockTypeToVisualType(type: TeachingNoteContentBlockType): LessonVisualAidType {
  if (type === 'process_steps') return 'process_diagram';
  const allowed = STRUCTURED_TEACHING_NOTE_BLOCK_TYPES.has(type) && !GENERATED_TEACHING_NOTE_BLOCK_TYPES.has(type);
  return allowed ? type as LessonVisualAidType : 'labelled_diagram';
}

function legacyVisualToContentBlock(visual: TeachingNoteVisual): TeachingNoteContentBlock {
  if (visual.source === 'generated' || visual.prompt || visual.imageUrl) {
    return {
      id: visual.id,
      type: 'generated_visual',
      title: visual.title,
      visualKind: visual.kind === 'generated_image' ? 'generated_image' : visual.kind,
      prompt: visual.prompt,
      caption: visual.caption,
      imageUrl: visual.imageUrl,
      storagePath: visual.storagePath,
      status: visual.imageUrl ? 'generated' : visual.prompt ? 'pending' : undefined,
      labels: visual.labels,
      rows: visual.rows,
      steps: visual.steps,
      data: visual.data,
    };
  }

  if (visual.data?.length) {
    return {
      id: visual.id,
      type: 'bar_chart',
      title: visual.title,
      data: visual.data,
      caption: visual.caption,
    };
  }

  if (visual.steps?.length) {
    return {
      id: visual.id,
      type: 'process_steps',
      title: visual.title,
      steps: visual.steps,
      caption: visual.caption,
    };
  }

  if (visual.rows?.length) {
    return {
      id: visual.id,
      type: 'comparison_table',
      title: visual.title,
      rows: visual.rows,
      caption: visual.caption,
    };
  }

  return {
    id: visual.id,
    type: 'labelled_diagram',
    title: visual.title,
    labels: visual.labels,
    caption: visual.caption,
  };
}
