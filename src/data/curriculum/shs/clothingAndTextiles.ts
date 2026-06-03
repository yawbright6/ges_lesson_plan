import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Sewing tools', 'Textile samples', 'Garment samples', 'Charts', 'Videos', 'Fashion images', 'Internet resources'];

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
    text: `Apply clothing and textiles knowledge and practical skills to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use demonstration, practical production, project work, peer critique and portfolio reflection to explore ${topic.toLowerCase()}.`],
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
    subject: 'Clothing and Textiles',
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
        text: `Apply clothing and textiles skills in ${spec.subStrand.toLowerCase()} through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Creativity and innovation', 'Critical thinking and problem solving', 'Communication and collaboration', 'Digital literacy'],
        gesi: ['Use inclusive practical tasks and role models that challenge stereotypes in clothing, textiles and fashion work.'],
        sel: ['Build confidence, self-management, teamwork and responsible decision-making through practical clothing tasks.'],
        values: ['Tolerance', 'Friendliness', 'Open-mindedness', 'Patience', 'Hard work', 'Humility'],
        sourcePages: spec.pages,
        contentStandards: Array.from({ length: standardsForOutcome }, () => {
          csIndex += 1;
          const standardId = `${outcomeId}-cs-${csIndex}`;

          return {
            id: standardId,
            code: `${baseCode}.CS.${csIndex}`,
            text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} in clothing and textiles practice.`,
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

const conceptsTopics = ['clothing for occasions', 'clothing care labels', 'clothing selection', 'appearance and identity', 'clothing maintenance', 'cultural significance of clothing'];
const wardrobeTopics = ['wardrobe planning', 'appearance management', 'clothing budget', 'clothing choices'];
const fibreTopics = ['fibre characteristics', 'fabric properties', 'fabric functionality', 'textile performance'];
const constructionFibreTopics = ['fabric selection', 'fabric preparation', 'textile finishes', 'fabric behaviour', 'fabric suitability', 'textile care'];
const constructionTopics = ['sewing tools', 'basic stitches', 'seams', 'fastenings', 'pattern preparation', 'garment layout', 'cutting', 'assembling', 'fitting', 'finishing', 'quality control'];
const fashionTopics = ['fashion design principles', 'design illustration', 'pattern adaptation', 'garment construction', 'decorative techniques', 'creative design', 'fashion trends', 'entrepreneurship', 'portfolio presentation', 'sustainable fashion'];

const shs1: Spec[] = [
  { id: 'shs1-clothing-and-textiles-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Psychosocial Aspect of Clothing', subStrandCode: '1.1', subStrand: 'Understanding Concepts and Principles of Clothing', pages: [23, 30], lo: 2, cs: 2, li: 6, topics: conceptsTopics },
  { id: 'shs1-clothing-and-textiles-1.2', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Psychosocial Aspect of Clothing', subStrandCode: '1.2', subStrand: 'Wardrobe Planning and Appearance Management Practices', pages: [30, 37], lo: 2, cs: 2, li: 4, topics: wardrobeTopics },
  { id: 'shs1-clothing-and-textiles-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Textiles in Clothing', subStrandCode: '2.1', subStrand: 'Characteristics of Fibres and Fabrics Functionality', pages: [37, 42], lo: 2, cs: 2, li: 4, topics: fibreTopics },
  { id: 'shs1-clothing-and-textiles-2.2', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Textiles in Clothing', subStrandCode: '2.2', subStrand: 'Fibres and Fabrics in Clothing Construction', pages: [42, 48], lo: 2, cs: 2, li: 4, topics: constructionFibreTopics },
  { id: 'shs1-clothing-and-textiles-3.1', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Clothing and Textiles Production Technology', subStrandCode: '3.1', subStrand: 'Clothing Construction Processes', pages: [48, 59], lo: 3, cs: 3, li: 11, topics: constructionTopics },
  { id: 'shs1-clothing-and-textiles-3.2', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Clothing and Textiles Production Technology', subStrandCode: '3.2', subStrand: 'Fashion Design and Garment Construction Technology', pages: [59, 70], lo: 3, cs: 3, li: 9, topics: fashionTopics },
];

const shs2: Spec[] = [
  { id: 'shs2-clothing-and-textiles-1.1', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Psychosocial Aspect of Clothing', subStrandCode: '1.1', subStrand: 'Understanding Concepts and Principles of Clothing', pages: [71, 79], lo: 2, cs: 2, li: 5, topics: conceptsTopics },
  { id: 'shs2-clothing-and-textiles-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Psychosocial Aspect of Clothing', subStrandCode: '1.2', subStrand: 'Wardrobe Planning and Appearance Management Practices', pages: [79, 88], lo: 2, cs: 2, li: 4, topics: wardrobeTopics },
  { id: 'shs2-clothing-and-textiles-2.1', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Textiles in Clothing', subStrandCode: '2.1', subStrand: 'Characteristics of Fibres and Fabrics Functionality', pages: [88, 97], lo: 2, cs: 2, li: 4, topics: fibreTopics },
  { id: 'shs2-clothing-and-textiles-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Textiles in Clothing', subStrandCode: '2.2', subStrand: 'Fibres and Fabrics in Clothing Construction', pages: [97, 106], lo: 2, cs: 2, li: 6, topics: constructionFibreTopics },
  { id: 'shs2-clothing-and-textiles-3.1', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Clothing and Textiles Production Technology', subStrandCode: '3.1', subStrand: 'Clothing Construction Processes', pages: [106, 115], lo: 2, cs: 2, li: 6, topics: constructionTopics },
  { id: 'shs2-clothing-and-textiles-3.2', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Clothing and Textiles Production Technology', subStrandCode: '3.2', subStrand: 'Fashion Design and Garment Construction Technology', pages: [115, 125], lo: 3, cs: 3, li: 10, topics: fashionTopics },
];

const shs3: Spec[] = [
  { id: 'shs3-clothing-and-textiles-1.1', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Psychosocial Aspect of Clothing', subStrandCode: '1.1', subStrand: 'Understanding Concepts and Principles of Clothing', pages: [126, 131], lo: 1, cs: 1, li: 3, topics: conceptsTopics },
  { id: 'shs3-clothing-and-textiles-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Psychosocial Aspect of Clothing', subStrandCode: '1.2', subStrand: 'Wardrobe Planning and Appearance Management Practices', pages: [131, 136], lo: 1, cs: 1, li: 3, topics: wardrobeTopics },
  { id: 'shs3-clothing-and-textiles-2.1', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Textiles in Clothing', subStrandCode: '2.1', subStrand: 'Characteristics of Fibres and Fabrics Functionality', pages: [136, 140], lo: 1, cs: 1, li: 4, topics: fibreTopics },
  { id: 'shs3-clothing-and-textiles-3.1', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Clothing and Textiles Production Technology', subStrandCode: '3.1', subStrand: 'Clothing Construction Processes', pages: [140, 145], lo: 1, cs: 1, li: 3, topics: constructionTopics },
  { id: 'shs3-clothing-and-textiles-3.2', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Clothing and Textiles Production Technology', subStrandCode: '3.2', subStrand: 'Fashion Design and Garment Construction Technology', pages: [145, 152], lo: 1, cs: 1, li: 3, topics: fashionTopics },
];

export const clothingAndTextilesShs1: ShsSubStrand[] = shs1.map(subStrand);
export const clothingAndTextilesShs2: ShsSubStrand[] = shs2.map(subStrand);
export const clothingAndTextilesShs3: ShsSubStrand[] = shs3.map(subStrand);

export const clothingAndTextiles = [...clothingAndTextilesShs1, ...clothingAndTextilesShs2, ...clothingAndTextilesShs3];
