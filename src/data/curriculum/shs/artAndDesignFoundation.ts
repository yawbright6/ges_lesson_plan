import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Sketchbooks', 'Art images', 'Museum and gallery resources', 'Design samples', 'Colour wheel', 'Drawing tools', 'Digital image resources'];

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
    text: `Apply art and design foundation knowledge and skills to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use visual enquiry, studio demonstration, critique, collaborative analysis and portfolio reflection to explore ${topic.toLowerCase()}.`],
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
    subject: 'Art and Design Foundation',
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
        text: `Analyse and apply ${spec.subStrand.toLowerCase()} through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Creativity and innovation', 'Critical thinking', 'Communication and collaboration', 'Cultural identity and global citizenship'],
        gesi: ['Use inclusive visual references and studio roles that value learners from diverse cultural, gender and ability backgrounds.'],
        sel: ['Build confidence, self-expression, empathy and respectful critique in art and design practice.'],
        values: ['Creativity', 'Respect', 'Responsibility', 'Open-mindedness', 'Excellence'],
        sourcePages: spec.pages,
        contentStandards: hasStandard
          ? [
              {
                id: `${outcomeId}-cs-${loNumber}`,
                code: `${baseCode}.CS.${loNumber}`,
                text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} in art and design contexts.`,
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

const artAcrossTimeTopics = ['indigenous Ghanaian art', 'African art and culture', 'ancient art traditions', 'art materials and methods', 'socio-cultural contexts', 'global art influences', 'modern art movements', 'contemporary art practices', 'visual documentation'];
const designHistoryTopics = ['design movements', 'historical design influences'];
const worldAroundUsTopics = ['natural forms', 'built environment', 'visual elements', 'cultural symbols', 'observation drawing', 'aesthetic qualities'];
const makingJudgementsTopics = ['art criticism', 'criteria for judgement', 'interpretation'];
const designThinkingTopics = ['design process', 'composition principles', 'problem definition'];
const colourTopics = ['colour wheel', 'colour harmony', 'colour symbolism'];
const relationOfFormsTopics = ['two-dimensional forms', 'three-dimensional forms', 'form relationships'];

const shs1: Spec[] = [
  { id: 'shs1-art-design-foundation-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'The Creative Journey (From Caves to 21st Century)', subStrandCode: '1.1', subStrand: 'Art Across Time', pages: [24, 26, 34], lo: 3, cs: 3, li: 9, topics: artAcrossTimeTopics },
  { id: 'shs1-art-design-foundation-1.2', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'The Creative Journey (From Caves to 21st Century)', subStrandCode: '1.2', subStrand: 'Design History', pages: [34, 37], lo: 1, cs: 1, li: 2, topics: designHistoryTopics },
  { id: 'shs1-art-design-foundation-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Aesthetics and Criticism', subStrandCode: '2.1', subStrand: 'The World Around Us', pages: [37, 44], lo: 2, cs: 2, li: 6, topics: worldAroundUsTopics },
  { id: 'shs1-art-design-foundation-2.2', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Aesthetics and Criticism', subStrandCode: '2.2', subStrand: 'Making Judgements', pages: [44, 47], lo: 1, cs: 1, li: 2, topics: makingJudgementsTopics },
  { id: 'shs1-art-design-foundation-3.1', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Design For Life', subStrandCode: '3.1', subStrand: 'Design Thinking and Composition', pages: [47, 51], lo: 1, cs: 1, li: 3, topics: designThinkingTopics },
  { id: 'shs1-art-design-foundation-3.2', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Design For Life', subStrandCode: '3.2', subStrand: 'Colour Theory and Application', pages: [51, 55], lo: 1, cs: 1, li: 3, topics: colourTopics },
  { id: 'shs1-art-design-foundation-3.3', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Design For Life', subStrandCode: '3.3', subStrand: 'Relation of Forms', pages: [55, 59], lo: 1, cs: 1, li: 2, topics: relationOfFormsTopics },
];

const shs2: Spec[] = [
  { id: 'shs2-art-design-foundation-1.1', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'The Creative Journey (From Caves to 21st Century)', subStrandCode: '1.1', subStrand: 'Art Across Time', pages: [59, 71], lo: 3, cs: 3, li: 7, topics: artAcrossTimeTopics },
  { id: 'shs2-art-design-foundation-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'The Creative Journey (From Caves to 21st Century)', subStrandCode: '1.2', subStrand: 'Design History', pages: [71, 76], lo: 1, cs: 1, li: 2, topics: designHistoryTopics },
  { id: 'shs2-art-design-foundation-2.1', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Aesthetics and Criticism', subStrandCode: '2.1', subStrand: 'The World Around Us', pages: [76, 84], lo: 2, cs: 2, li: 6, topics: worldAroundUsTopics },
  { id: 'shs2-art-design-foundation-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Aesthetics and Criticism', subStrandCode: '2.2', subStrand: 'Making Judgements', pages: [84, 88], lo: 1, cs: 1, li: 3, topics: makingJudgementsTopics },
  { id: 'shs2-art-design-foundation-3.1', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Design For Life', subStrandCode: '3.1', subStrand: 'Design Thinking and Composition', pages: [88, 91], lo: 1, cs: 1, li: 3, topics: designThinkingTopics },
  { id: 'shs2-art-design-foundation-3.2', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Design For Life', subStrandCode: '3.2', subStrand: 'Colour Theory and Application', pages: [91, 94], lo: 1, cs: 1, li: 3, topics: colourTopics },
  { id: 'shs2-art-design-foundation-3.3', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Design For Life', subStrandCode: '3.3', subStrand: 'Relation of Forms', pages: [94, 99], lo: 1, cs: 1, li: 3, topics: relationOfFormsTopics },
];

const shs3: Spec[] = [
  { id: 'shs3-art-design-foundation-1.1', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'The Creative Journey (From Caves to 21st Century)', subStrandCode: '1.1', subStrand: 'Art Across Time', pages: [99, 110], lo: 3, cs: 3, li: 8, topics: artAcrossTimeTopics },
  { id: 'shs3-art-design-foundation-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'The Creative Journey (From Caves to 21st Century)', subStrandCode: '1.2', subStrand: 'Design History', pages: [110, 113], lo: 1, cs: 1, li: 2, topics: designHistoryTopics },
  { id: 'shs3-art-design-foundation-2.1', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Aesthetics and Criticism', subStrandCode: '2.1', subStrand: 'The World Around Us', pages: [113, 122], lo: 2, cs: 2, li: 6, topics: worldAroundUsTopics },
  { id: 'shs3-art-design-foundation-2.2', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Aesthetics and Criticism', subStrandCode: '2.2', subStrand: 'Making Judgements', pages: [122, 127], lo: 1, cs: 1, li: 3, topics: makingJudgementsTopics },
  { id: 'shs3-art-design-foundation-3.1', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Design For Life', subStrandCode: '3.1', subStrand: 'Design Thinking and Composition', pages: [127, 130], lo: 1, cs: 1, li: 2, topics: designThinkingTopics },
  { id: 'shs3-art-design-foundation-3.2', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Design For Life', subStrandCode: '3.2', subStrand: 'Colour Theory and Application', pages: [130, 134], lo: 1, cs: 1, li: 3, topics: colourTopics },
  { id: 'shs3-art-design-foundation-3.3', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Design For Life', subStrandCode: '3.3', subStrand: 'Relation of Forms', pages: [134, 138], lo: 1, cs: 1, li: 2, topics: relationOfFormsTopics },
];

export const artAndDesignFoundationShs1: ShsSubStrand[] = shs1.map(subStrand);
export const artAndDesignFoundationShs2: ShsSubStrand[] = shs2.map(subStrand);
export const artAndDesignFoundationShs3: ShsSubStrand[] = shs3.map(subStrand);

export const artAndDesignFoundation = [...artAndDesignFoundationShs1, ...artAndDesignFoundationShs2, ...artAndDesignFoundationShs3];
