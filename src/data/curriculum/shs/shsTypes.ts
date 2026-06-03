import type { ClassLevel } from '@/types/lessonPlan';

export type ShsClassLevel = Extract<ClassLevel, 'SHS1' | 'SHS2' | 'SHS3'>;

export interface ShsAssessmentReference {
  code: string;
  levels: string[];
}

export interface ShsLearningIndicator {
  id: string;
  code: string;
  text: string;
  shortTopic: string;
  pedagogicalExemplars: string[];
  assessment?: ShsAssessmentReference;
  resources?: string[];
  sourcePage: number;
}

export interface ShsContentStandard {
  id: string;
  code: string;
  text: string;
  indicators: ShsLearningIndicator[];
  sourcePage: number;
}

export interface ShsLearningOutcome {
  id: string;
  code: string;
  text: string;
  skillsAndCompetencies?: string[];
  gesi?: string[];
  sel?: string[];
  values?: string[];
  contentStandards: ShsContentStandard[];
  sourcePages: number[];
}

export interface ShsSubStrand {
  id: string;
  subject: string;
  classLevel: ShsClassLevel;
  year: 1 | 2 | 3;
  strandCode: string;
  strand: string;
  subStrandCode: string;
  subStrand: string;
  learningOutcomes: ShsLearningOutcome[];
  sourcePages: number[];
}

