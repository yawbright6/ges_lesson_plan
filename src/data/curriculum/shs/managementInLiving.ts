import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Local materials', 'Charts', 'Videos', 'Internet resources', 'Case studies', 'Community-based enterprise observations'];

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
    text: `Apply management in living knowledge and skills to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use role-play, project-based learning, case study, practical demonstration and group presentation to explore ${topic.toLowerCase()}.`],
    assessment: { code: `${baseCode}.AS.${index}`, levels: assessmentLevels },
    resources,
    sourcePage: page,
  };
}

function subStrand(spec: Spec): ShsSubStrand {
  const baseCode = `${spec.year}.${spec.strandCode}.${spec.subStrandCode.split('.').at(-1)}`;
  const liDistribution = splitCount(spec.li, spec.cs);
  let topicIndex = 0;

  return {
    id: spec.id,
    subject: 'Management in Living',
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
      const hasStandard = index < spec.cs;

      return {
        id: outcomeId,
        code: `${baseCode}.LO.${loNumber}`,
        text: `Apply life management skills in ${spec.subStrand.toLowerCase()} through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Communication and collaboration', 'Critical thinking and problem solving', 'Creativity and innovation', 'Digital literacy'],
        gesi: ['Use inclusive practical work that challenges stereotypes about home management and human development.'],
        sel: ['Build self-confidence, responsible decision-making, empathy and relationship skills.'],
        values: ['Tolerance', 'Friendliness', 'Open-mindedness', 'Patience', 'Hard work', 'Humility'],
        sourcePages: spec.pages,
        contentStandards: hasStandard
          ? [
              {
                id: `${outcomeId}-cs-${loNumber}`,
                code: `${baseCode}.CS.${loNumber}`,
                text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} for quality living.`,
                sourcePage: spec.pages.at(-1) ?? spec.pages[0],
                indicators: Array.from({ length: liDistribution[index] }, (_, liIndex) => {
                  const topic = spec.topics[topicIndex % spec.topics.length];
                  topicIndex += 1;
                  return indicator(`${outcomeId}-cs-${loNumber}`, baseCode, topic, liIndex + 1, spec.pages.at(-1) ?? spec.pages[0]);
                }),
              } satisfies ShsContentStandard,
            ]
          : [],
      };
    }),
  };
}

const shs1: Spec[] = [
  { id: 'shs1-management-in-living-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Personal and Family Resource Management', subStrandCode: '1.1', subStrand: 'Resource Management Practices', pages: [26, 27, 28, 33], lo: 2, cs: 2, li: 5, topics: ['scope of management in living', 'importance of management in living', 'resource management principles', 'values and goals', 'family resource decisions'] },
  { id: 'shs1-management-in-living-1.2', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Personal and Family Resource Management', subStrandCode: '1.2', subStrand: 'Management Principles for Quality Living', pages: [35, 36, 41], lo: 2, cs: 2, li: 6, topics: ['management process', 'decision-making', 'planning', 'implementation', 'evaluation', 'quality living'] },
  { id: 'shs1-management-in-living-1.3', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Personal and Family Resource Management', subStrandCode: '1.3', subStrand: 'Creative Product Development and Entrepreneurship', pages: [43, 44, 51], lo: 2, cs: 2, li: 7, topics: ['creativity', 'product development', 'entrepreneurship', 'market research', 'product costing', 'packaging', 'promotion'] },
  { id: 'shs1-management-in-living-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Family and Social Relationships', subStrandCode: '2.1', subStrand: 'Responsible Family and Social Living', pages: [53, 54, 58], lo: 2, cs: 2, li: 6, topics: ['family roles', 'healthy relationships', 'communication', 'conflict management', 'responsible behaviour', 'social living'] },
  { id: 'shs1-management-in-living-2.2', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Family and Social Relationships', subStrandCode: '2.2', subStrand: 'Consumer Education and Sustainable Living', pages: [60, 61, 69], lo: 2, cs: 2, li: 6, topics: ['consumer rights', 'consumer responsibilities', 'wise buying', 'sustainable consumption', 'waste reduction', 'financial choices'] },
];

const shs2: Spec[] = [
  { id: 'shs2-management-in-living-1.1', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Personal and Family Resource Management', subStrandCode: '1.1', subStrand: 'Resource Management Practices', pages: [72, 73, 80], lo: 2, cs: 2, li: 6, topics: ['human resources', 'material resources', 'time resources', 'energy management', 'money management', 'family goals'] },
  { id: 'shs2-management-in-living-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Personal and Family Resource Management', subStrandCode: '1.2', subStrand: 'Management Principles for Quality Living', pages: [82, 83, 91], lo: 2, cs: 2, li: 6, topics: ['home maintenance', 'work simplification', 'safety at home', 'quality standards', 'resource evaluation', 'management challenges'] },
  { id: 'shs2-management-in-living-1.3', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Personal and Family Resource Management', subStrandCode: '1.3', subStrand: 'Creative Product Development and Entrepreneurship', pages: [93, 94, 103], lo: 2, cs: 2, li: 8, topics: ['enterprise ideas', 'prototype development', 'product testing', 'branding', 'pricing', 'marketing', 'record keeping', 'business ethics'] },
  { id: 'shs2-management-in-living-2.1', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Family and Social Relationships', subStrandCode: '2.1', subStrand: 'Responsible Family and Social Living', pages: [105, 106, 113], lo: 2, cs: 2, li: 5, topics: ['family life cycle', 'responsible parenting', 'social support', 'relationship challenges', 'family wellbeing'] },
  { id: 'shs2-management-in-living-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Family and Social Relationships', subStrandCode: '2.2', subStrand: 'Consumer Education and Sustainable Living', pages: [115, 116, 126], lo: 2, cs: 2, li: 7, topics: ['consumer protection', 'advertising', 'budgeting', 'sustainable choices', 'environmental responsibility', 'ethical consumption', 'consumer complaints'] },
];

const shs3: Spec[] = [
  { id: 'shs3-management-in-living-1.1', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Personal and Family Resource Management', subStrandCode: '1.1', subStrand: 'Resource Management Practice', pages: [129, 137], lo: 1, cs: 1, li: 3, topics: ['advanced resource planning', 'family resource evaluation', 'resource sustainability'] },
  { id: 'shs3-management-in-living-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Personal and Family Resource Management', subStrandCode: '1.2', subStrand: 'Management Principles for Quality Living', pages: [139, 144], lo: 1, cs: 1, li: 3, topics: ['quality living plans', 'decision evaluation', 'management leadership'] },
  { id: 'shs3-management-in-living-1.3', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Personal and Family Resource Management', subStrandCode: '1.3', subStrand: 'Creative Product Development and Entrepreneurship', pages: [146, 151], lo: 1, cs: 1, li: 3, topics: ['enterprise planning', 'product improvement', 'business sustainability'] },
  { id: 'shs3-management-in-living-2.1', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Family and Social Relationships', subStrandCode: '2.1', subStrand: 'Responsible Family and Social Living', pages: [153, 156], lo: 1, cs: 1, li: 3, topics: ['responsible adult living', 'community relationships', 'family resilience'] },
  { id: 'shs3-management-in-living-2.2', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Family and Social Relationships', subStrandCode: '2.2', subStrand: 'Consumer Education and Sustainable Living', pages: [158, 159, 166], lo: 2, cs: 2, li: 4, topics: ['consumer advocacy', 'sustainable living plans', 'green consumer choices', 'financial sustainability'] },
];

export const managementInLivingShs1: ShsSubStrand[] = shs1.map(subStrand);
export const managementInLivingShs2: ShsSubStrand[] = shs2.map(subStrand);
export const managementInLivingShs3: ShsSubStrand[] = shs3.map(subStrand);

export const managementInLiving = [...managementInLivingShs1, ...managementInLivingShs2, ...managementInLivingShs3];
