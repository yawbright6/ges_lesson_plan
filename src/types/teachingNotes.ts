import type { ClassLevel, LessonPlan, LessonVisualAidType } from './lessonPlan';

export type TeachingNoteVisualKind =
  | 'diagram'
  | 'chart'
  | 'process'
  | 'table'
  | 'board_sketch'
  | 'curated_image'
  | 'generated_image';

export type TeachingNoteVisualSource = 'structured' | 'curated' | 'generated';

export interface TeachingNoteVisual {
  id: string;
  kind: TeachingNoteVisualKind;
  source: TeachingNoteVisualSource;
  type?: LessonVisualAidType;
  title: string;
  caption?: string;
  altText?: string;
  imageUrl?: string;
  storagePath?: string;
  prompt?: string;
  attribution?: string;
  labels?: Array<{ label: string; description?: string }>;
  rows?: string[][];
  steps?: string[];
  data?: Array<{ label: string; value: number }>;
  columns?: string[];
  cells?: string[][];
  min?: number;
  max?: number;
  points?: { value: number; label?: string; x?: number; y?: number }[];
  shape?: 'circle' | 'rectangle' | 'square' | 'triangle' | 'polygon' | string;
  segments?: number;
  shadedSegments?: number;
  items?: string[];
  centralNode?: string;
  nodes?: string[];
  groups?: { label: string; items: string[] }[];
}

export interface TeachingNotePhaseGuide {
  phase: 1 | 2 | 3;
  title: string;
  teacherNotes: string[];
}

export type TeachingNoteContentBlockType =
  | 'heading'
  | 'paragraph'
  | 'bullet_list'
  | 'worked_example'
  | 'practice_questions'
  | 'comparison_table'
  | 'bar_chart'
  | 'line_graph'
  | 'frequency_table'
  | 'tally_table'
  | 'place_value_table'
  | 'observation_table'
  | 'algorithm_trace_table'
  | 'number_line'
  | 'coordinate_grid'
  | 'geometry_shape'
  | 'fraction_model'
  | 'venn_diagram'
  | 'angle_diagram'
  | 'cycle_diagram'
  | 'flowchart'
  | 'timeline'
  | 'process_steps'
  | 'process_diagram'
  | 'block_diagram'
  | 'classification_chart'
  | 'experiment_setup'
  | 'circuit_diagram'
  | 'network_diagram'
  | 'interface_mockup'
  | 'data_table'
  | 'story_map'
  | 'labelled_diagram'
  | 'generated_visual'
  | 'image_grid'
  | 'teacher_tip';

export interface TeachingNoteImageGridItem {
  label: string;
  description?: string;
  imageUrl?: string;
  imagePrompt?: string;
  attribution?: string;
}

export interface TeachingNoteContentBlock {
  id: string;
  type: TeachingNoteContentBlockType;
  visualType?: LessonVisualAidType;
  title?: string;
  text?: string;
  items?: string[];
  rows?: string[][];
  steps?: string[];
  data?: Array<{ label: string; value: number }>;
  columns?: string[];
  cells?: string[][];
  min?: number;
  max?: number;
  points?: { value: number; label?: string; x?: number; y?: number }[];
  shape?: 'circle' | 'rectangle' | 'square' | 'triangle' | 'polygon' | string;
  segments?: number;
  shadedSegments?: number;
  centralNode?: string;
  nodes?: string[];
  groups?: { label: string; items: string[] }[];
  labels?: Array<{ label: string; description?: string }>;
  imageItems?: TeachingNoteImageGridItem[];
  visualKind?: TeachingNoteVisualKind;
  prompt?: string;
  imageUrl?: string;
  storagePath?: string;
  status?: 'pending' | 'generated' | 'failed';
  error?: string;
  caption?: string;
  teacherOnly?: boolean;
}

export interface TeachingNotes {
  id?: string;
  lessonPlanId: string;
  versionNumber?: number;
  title: string;
  subject: string;
  classLevel: ClassLevel;
  week: number;
  lessonNumber?: string;
  topic?: string;
  overview: string;
  preparation: string[];
  phaseGuidance: TeachingNotePhaseGuide[];
  keyExplanations: string[];
  misconceptions: string[];
  questionsToAsk: string[];
  differentiation: string[];
  classroomManagement: string[];
  boardSummary: string[];
  homework?: string[];
  contentBlocks?: TeachingNoteContentBlock[];
  /** @deprecated Legacy appendix visuals — new notes use inline contentBlocks only. */
  visuals?: TeachingNoteVisual[];
  sourceLessonPlan?: Pick<
    LessonPlan,
    'id' | 'subject' | 'classLevel' | 'week' | 'lessonNumber' | 'topic' | 'strand' | 'subStrand'
  >;
  createdAt?: string;
  updatedAt?: string;
}
