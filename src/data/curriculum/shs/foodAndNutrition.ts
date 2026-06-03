import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Food samples', 'Kitchen tools', 'Charts', 'Videos', 'Internet resources', 'Recipe cards', 'Local food processing materials'];

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
    text: `Apply food and nutrition knowledge and practical skills to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use food demonstrations, practical work, case study, project-based learning and group presentation to explore ${topic.toLowerCase()}.`],
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
    subject: 'Food and Nutrition',
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
      const standardsForOutcome = csDistribution[index] ?? 0;

      return {
        id: outcomeId,
        code: `${baseCode}.LO.${loNumber}`,
        text: `Apply food and nutrition skills in ${spec.subStrand.toLowerCase()} through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Communication and collaboration', 'Critical thinking and problem solving', 'Creativity and innovation', 'Digital literacy'],
        gesi: ['Use inclusive practical work and balanced role models that challenge stereotypes in food preparation and nutrition careers.'],
        sel: ['Build self-confidence, teamwork, responsible choices and respect for diverse food cultures.'],
        values: ['Tolerance', 'Friendliness', 'Open-mindedness', 'Patience', 'Hard work', 'Humility'],
        sourcePages: spec.pages,
        contentStandards: Array.from({ length: standardsForOutcome }, () => {
          csIndex += 1;
          const standardId = `${outcomeId}-cs-${csIndex}`;

          return {
            id: standardId,
            code: `${baseCode}.CS.${csIndex}`,
            text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} for healthy living and food production.`,
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

const healthyLivingTopics = ['food commodities', 'nutrients and growth', 'balanced diets', 'meal planning', 'dietary needs', 'healthy lifestyle', 'food habits', 'nutrition-related diseases', 'food choices', 'consumer food decisions', 'menu planning'];
const foodSecurityTopics = ['food availability', 'food access', 'food utilisation', 'food stability', 'sustainable food systems'];
const productionTopics = ['food production systems', 'local food production', 'food production tools', 'quality control', 'food enterprise'];
const processingTopics = ['food processing methods', 'food preservation', 'packaging', 'storage', 'value addition', 'food spoilage', 'food safety'];

const shs1: Spec[] = [
  { id: 'shs1-food-and-nutrition-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Nutrition and Health', subStrandCode: '1.1', subStrand: 'Food for Healthy Living', pages: [23, 35], lo: 2, cs: 3, li: 8, topics: healthyLivingTopics },
  { id: 'shs1-food-and-nutrition-1.2', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Nutrition and Health', subStrandCode: '1.2', subStrand: 'Food Security', pages: [35, 41], lo: 2, cs: 2, li: 5, topics: foodSecurityTopics },
  { id: 'shs1-food-and-nutrition-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Food Production', subStrandCode: '2.1', subStrand: 'Food Production Technology', pages: [41, 54], lo: 2, cs: 2, li: 5, topics: productionTopics },
  { id: 'shs1-food-and-nutrition-2.2', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Food Production', subStrandCode: '2.2', subStrand: 'Food Processing Techniques', pages: [54, 65], lo: 2, cs: 2, li: 5, topics: processingTopics },
];

const shs2: Spec[] = [
  { id: 'shs2-food-and-nutrition-1.1', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Nutrition and Health', subStrandCode: '1.1', subStrand: 'Food for Healthy Living', pages: [66, 91], lo: 4, cs: 4, li: 11, topics: healthyLivingTopics },
  { id: 'shs2-food-and-nutrition-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Nutrition and Health', subStrandCode: '1.2', subStrand: 'Food Security', pages: [91, 102], lo: 2, cs: 2, li: 5, topics: foodSecurityTopics },
  { id: 'shs2-food-and-nutrition-2.1', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Food Production', subStrandCode: '2.1', subStrand: 'Food Production Technology', pages: [102, 112], lo: 2, cs: 2, li: 4, topics: productionTopics },
  { id: 'shs2-food-and-nutrition-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Food Production', subStrandCode: '2.2', subStrand: 'Food Processing Techniques', pages: [112, 122], lo: 2, cs: 2, li: 7, topics: processingTopics },
];

const shs3: Spec[] = [
  { id: 'shs3-food-and-nutrition-1.1', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Nutrition and Health', subStrandCode: '1.1', subStrand: 'Food for Healthy Living', pages: [123, 133], lo: 2, cs: 2, li: 6, topics: healthyLivingTopics },
  { id: 'shs3-food-and-nutrition-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Nutrition and Health', subStrandCode: '1.2', subStrand: 'Food Security', pages: [133, 146], lo: 2, cs: 2, li: 4, topics: foodSecurityTopics },
  { id: 'shs3-food-and-nutrition-2.1', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Food Production', subStrandCode: '2.1', subStrand: 'Food Production Technology', pages: [146, 155], lo: 2, cs: 2, li: 4, topics: productionTopics },
  { id: 'shs3-food-and-nutrition-2.2', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Food Production', subStrandCode: '2.2', subStrand: 'Food Processing Techniques', pages: [155, 163], lo: 1, cs: 1, li: 4, topics: processingTopics },
];

export const foodAndNutritionShs1: ShsSubStrand[] = shs1.map(subStrand);
export const foodAndNutritionShs2: ShsSubStrand[] = shs2.map(subStrand);
export const foodAndNutritionShs3: ShsSubStrand[] = shs3.map(subStrand);

export const foodAndNutrition = [...foodAndNutritionShs1, ...foodAndNutritionShs2, ...foodAndNutritionShs3];
