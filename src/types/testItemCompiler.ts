import type { ClassLevel } from './lessonPlan';
import type { LessonVisualAid } from './lessonPlan';

export interface CompiledTestItem {
  id: string;
  sourceLessonPlanId?: string;
  subject: string;
  classLevel: ClassLevel;
  termTitle?: string;
  week: number;
  weekTitle?: string;
  lessonNumber?: string;
  topic?: string;
  strand?: string;
  subStrand?: string;
  indicator?: string;
  question: string;
}

export interface CompiledTestCompilation {
  id: string;
  title: string;
  subject: string;
  classLevel: ClassLevel;
  termTitle?: string;
  items: CompiledTestItem[];
  createdAt: string;
}

export interface CompiledTestQuestion {
  id: string;
  text: string;
  marks: number;
  sourceItemIds: string[];
  mode?: TestItemMode;
  subparts?: CompiledTestQuestionSubpart[];
  visuals?: LessonVisualAid[];
}

export interface CompiledTestQuestionSubpart {
  label: string;
  text: string;
  marks?: number;
}

export interface CompiledTestSection {
  id: string;
  title: string;
  questions: CompiledTestQuestion[];
}

export interface CompiledAnswerKeyItem {
  questionId: string;
  answer: string;
  markingGuide?: string[];
  marks: number;
}

export interface CompiledTestPaper {
  id?: string;
  title: string;
  subject: string;
  classLevel: ClassLevel;
  termTitle?: string;
  instructions: string[];
  sections: CompiledTestSection[];
  answerKey: CompiledAnswerKeyItem[];
  totalMarks: number;
  editedAt?: string;
  createdAt?: string;
  creditBalance?: number;
}

export type TestItemMode = 'multiple_choice' | 'fill_in_blank' | 'essay';

export interface TestItemModeSelection {
  mode: TestItemMode;
  enabled: boolean;
  questionCount?: number;
}

export interface TestItemRewriteOptions {
  modes: TestItemModeSelection[];
  totalMarks?: number;
}

export interface TestItemRewriteRequest {
  title: string;
  subject: string;
  classLevel: ClassLevel;
  termTitle?: string;
  items: CompiledTestItem[];
  options?: TestItemRewriteOptions;
  structuredVisualsEnabled?: boolean;
  visualGenerationEnabled?: boolean;
}
