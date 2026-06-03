import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Videos', 'Charts', 'Models', 'Laboratory equipment', 'Online resources', 'Case studies', 'Biomedical device images'];

type Spec = {
  id: string;
  year: 1 | 2 | 3;
  classLevel: 'SHS1' | 'SHS2' | 'SHS3';
  strandCode: string;
  strand: string;
  subStrandCode: string;
  subStrand: string;
  pages: number[];
  lo: number;
  cs: number;
  li: number;
  topics: string[];
};

function splitCount(total: number, buckets: number): number[] {
  return Array.from({ length: buckets }, (_, index) => Math.floor(total / buckets) + (index < total % buckets ? 1 : 0));
}

function indicator(baseId: string, baseCode: string, topic: string, index: number, page: number): ShsLearningIndicator {
  return {
    id: `${baseId}-li-${index}`,
    code: `${baseCode}.LI.${index}`,
    text: `Apply biomedical science knowledge and inquiry skills to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use problem-based learning, practical investigation, model analysis, digital research and group presentation to examine ${topic.toLowerCase()}.`],
    assessment: { code: `${baseCode}.AS.${index}`, levels: assessmentLevels },
    resources,
    sourcePage: page,
  };
}

function subStrand(spec: Spec): ShsSubStrand {
  const baseCode = `${spec.year}.${spec.strandCode}.${spec.subStrandCode.split('.').at(-1)}`;
  const csDistribution = splitCount(spec.cs, spec.lo);
  const liDistribution = splitCount(spec.li, spec.cs);
  let topicIndex = 0;
  let csIndex = 0;

  return {
    id: spec.id,
    subject: 'Biomedical Science',
    classLevel: spec.classLevel,
    year: spec.year,
    strandCode: spec.strandCode,
    strand: spec.strand,
    subStrandCode: spec.subStrandCode,
    subStrand: spec.subStrand,
    sourcePages: spec.pages,
    learningOutcomes: Array.from({ length: spec.lo }, (_, index) => {
      const loNumber = index + 1;
      const outcomeId = `${spec.id}-${baseCode.replaceAll('.', '-')}-lo-${loNumber}`;

      return {
        id: outcomeId,
        code: `${baseCode}.LO.${loNumber}`,
        text: `Investigate biomedical science concepts in ${spec.subStrand.toLowerCase()} through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Critical thinking', 'Collaboration', 'Communication', 'Digital literacy', 'Problem solving'],
        gesi: ['Use mixed-ability groups and inclusive biomedical examples so all learners can participate in investigation and design.'],
        sel: ['Build patience, confidence, ethical judgement and constructive collaboration in biomedical problem solving.'],
        values: ['Tolerance', 'Patience', 'Responsibility', 'Integrity', 'Respect'],
        sourcePages: spec.pages,
        contentStandards: Array.from({ length: csDistribution[index] ?? 0 }, () => {
          csIndex += 1;
          const standardId = `${outcomeId}-cs-${csIndex}`;

          return {
            id: standardId,
            code: `${baseCode}.CS.${csIndex}`,
            text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} in biomedical science.`,
            sourcePage: spec.pages.at(-1) ?? spec.pages[0],
            indicators: Array.from({ length: liDistribution[csIndex - 1] }, (_, liIndex) => {
              const topic = spec.topics[topicIndex % spec.topics.length];
              topicIndex += 1;
              return indicator(standardId, baseCode, topic, liIndex + 1, spec.pages.at(-1) ?? spec.pages[0]);
            }),
          } satisfies ShsContentStandard;
        }),
      };
    }),
  };
}

const practiceTopics = ['meaning of biomedical science', 'biomedical science careers', 'scientific method'];
const biosafetyTopics = ['laboratory safety', 'biosafety practices', 'biohazards'];
const anatomyTopics = ['body systems', 'organ functions', 'homeostasis', 'physiological processes'];
const diseaseTopics = ['disease processes', 'disorders', 'pathogens', 'risk factors', 'prevention', 'diagnosis', 'public health', 'case analysis'];
const diagnosticTopics = ['diagnostic devices', 'test principles', 'device interpretation'];
const therapeuticTopics = ['therapeutic devices', 'treatment technologies', 'clinical application'];
const innovationTopics = ['research design', 'biomedical innovation', 'prototype development', 'ethical design'];

const shs1: Spec[] = [
  { id: 'shs1-biomedical-science-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Biomedical Science in Society', subStrandCode: '1.1', subStrand: 'Biomedical Science Practice', pages: [23, 27], lo: 1, cs: 1, li: 3, topics: practiceTopics },
  { id: 'shs1-biomedical-science-1.2', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Biomedical Science in Society', subStrandCode: '1.2', subStrand: 'Biosafety', pages: [27, 31], lo: 1, cs: 1, li: 3, topics: biosafetyTopics },
  { id: 'shs1-biomedical-science-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Human Body Systems', subStrandCode: '2.1', subStrand: 'Anatomy and Physiology', pages: [31, 35], lo: 1, cs: 1, li: 3, topics: anatomyTopics },
  { id: 'shs1-biomedical-science-2.2', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Human Body Systems', subStrandCode: '2.2', subStrand: 'Diseases and Disorders', pages: [35, 39], lo: 1, cs: 1, li: 3, topics: diseaseTopics },
  { id: 'shs1-biomedical-science-3.1', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Biomedical Intervention', subStrandCode: '3.1', subStrand: 'Diagnostic Device', pages: [39, 42], lo: 1, cs: 1, li: 3, topics: diagnosticTopics },
  { id: 'shs1-biomedical-science-3.2', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Biomedical Intervention', subStrandCode: '3.2', subStrand: 'Therapeutic Device', pages: [42, 46], lo: 1, cs: 1, li: 3, topics: therapeuticTopics },
  { id: 'shs1-biomedical-science-4.1', year: 1, classLevel: 'SHS1', strandCode: '4', strand: 'Biomedical Innovations', subStrandCode: '4.1', subStrand: 'Research and Design in Biomedical Science', pages: [46, 51], lo: 1, cs: 1, li: 4, topics: innovationTopics },
];

const shs2: Spec[] = [
  { id: 'shs2-biomedical-science-1.1', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Biomedical Science in Society', subStrandCode: '1.1', subStrand: 'Biomedical Science Practice', pages: [51, 55], lo: 1, cs: 1, li: 3, topics: practiceTopics },
  { id: 'shs2-biomedical-science-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Biomedical Science in Society', subStrandCode: '1.2', subStrand: 'Biosafety', pages: [55, 58], lo: 1, cs: 1, li: 3, topics: biosafetyTopics },
  { id: 'shs2-biomedical-science-2.1', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Human Body Systems', subStrandCode: '2.1', subStrand: 'Anatomy and Physiology', pages: [58, 61], lo: 1, cs: 1, li: 3, topics: anatomyTopics },
  { id: 'shs2-biomedical-science-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Human Body Systems', subStrandCode: '2.2', subStrand: 'Diseases and Disorders', pages: [61, 68], lo: 2, cs: 2, li: 8, topics: diseaseTopics },
  { id: 'shs2-biomedical-science-3.1', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Biomedical Intervention', subStrandCode: '3.1', subStrand: 'Diagnostic Device', pages: [68, 72], lo: 1, cs: 1, li: 3, topics: diagnosticTopics },
  { id: 'shs2-biomedical-science-3.2', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Biomedical Intervention', subStrandCode: '3.2', subStrand: 'Therapeutic Device', pages: [72, 76], lo: 1, cs: 1, li: 3, topics: therapeuticTopics },
  { id: 'shs2-biomedical-science-4.1', year: 2, classLevel: 'SHS2', strandCode: '4', strand: 'Biomedical Innovation', subStrandCode: '4.1', subStrand: 'Research and Design in Biomedical Science', pages: [76, 80], lo: 1, cs: 1, li: 2, topics: innovationTopics },
];

const shs3: Spec[] = [
  { id: 'shs3-biomedical-science-1.1', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Biomedical Science in Society', subStrandCode: '1.1', subStrand: 'Biomedical Science Practice', pages: [80, 84], lo: 1, cs: 1, li: 3, topics: practiceTopics },
  { id: 'shs3-biomedical-science-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Biomedical Science in Society', subStrandCode: '1.2', subStrand: 'Biosafety', pages: [84, 87], lo: 1, cs: 1, li: 3, topics: biosafetyTopics },
  { id: 'shs3-biomedical-science-2.1', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Human Body Systems', subStrandCode: '2.1', subStrand: 'Anatomy and Physiology', pages: [87, 91], lo: 1, cs: 1, li: 4, topics: anatomyTopics },
  { id: 'shs3-biomedical-science-2.2', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Human Body Systems', subStrandCode: '2.2', subStrand: 'Diseases and Disorders', pages: [91, 94], lo: 1, cs: 1, li: 4, topics: diseaseTopics },
  { id: 'shs3-biomedical-science-3.1', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Biomedical Intervention', subStrandCode: '3.1', subStrand: 'Diagnostic Device', pages: [94, 98], lo: 1, cs: 1, li: 3, topics: diagnosticTopics },
  { id: 'shs3-biomedical-science-3.2', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Biomedical Intervention', subStrandCode: '3.2', subStrand: 'Therapeutic Device', pages: [98, 100], lo: 1, cs: 1, li: 3, topics: therapeuticTopics },
  { id: 'shs3-biomedical-science-4.1', year: 3, classLevel: 'SHS3', strandCode: '4', strand: 'Biomedical Innovation', subStrandCode: '4.1', subStrand: 'Research and Design in Biomedical Science', pages: [100, 103], lo: 1, cs: 1, li: 2, topics: innovationTopics },
];

export const biomedicalScienceShs1: ShsSubStrand[] = shs1.map(subStrand);
export const biomedicalScienceShs2: ShsSubStrand[] = shs2.map(subStrand);
export const biomedicalScienceShs3: ShsSubStrand[] = shs3.map(subStrand);

export const biomedicalScience = [...biomedicalScienceShs1, ...biomedicalScienceShs2, ...biomedicalScienceShs3];
