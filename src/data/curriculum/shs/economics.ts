import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Whiteboard', 'Charts', 'Graph books', 'Economic data', 'Case studies', 'Projector', 'Internet sources'];

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
    text: `Apply economic concepts and analytical skills to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use data interpretation, graph work, role play, case study and collaborative enquiry to analyse ${topic.toLowerCase()}.`],
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
    subject: 'Economics',
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
        text: `Analyse economic decision-making in ${spec.subStrand.toLowerCase()} through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Critical thinking and problem solving', 'Communication and collaboration', 'Numeracy and data literacy', 'Digital literacy'],
        gesi: ['Use inclusive economic examples that respect learners from different backgrounds and show how economic choices affect diverse groups.'],
        sel: ['Build self-awareness, responsible decision-making and collaborative problem solving in economic contexts.'],
        values: ['Tolerance', 'Open-mindedness', 'Commitment', 'Hard work', 'Responsible citizenship'],
        sourcePages: spec.pages,
        contentStandards: Array.from({ length: csDistribution[index] ?? 0 }, () => {
          csIndex += 1;
          const standardId = `${outcomeId}-cs-${csIndex}`;

          return {
            id: standardId,
            code: `${baseCode}.CS.${csIndex}`,
            text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} in economic analysis.`,
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

const introductionTopics = ['definition of economics', 'career prospects in economics', 'economic tools', 'scarcity and choice'];
const demandTopics = ['demand schedule', 'demand curve', 'determinants of demand'];
const consumerTopics = ['utility', 'consumer choice'];
const productionTopics = ['factors of production', 'production process', 'productivity', 'division of labour', 'costs of production'];
const supplyTopics = ['supply schedule', 'determinants of supply'];
const marketTopics = ['market structures', 'market performance'];
const priceTopics = ['price determination', 'market equilibrium'];
const macroTopics = ['gross domestic product', 'inflation', 'unemployment', 'exchange rate'];
const moneyTopics = ['money', 'financial institutions', 'public finance', 'taxation'];
const tradeTopics = ['agriculture and development', 'industrialisation', 'international trade', 'trade policy'];

const shared = {
  strand1: "Consumers' Rational Decision Making",
  strand2: "Firms' Innovative Decision Making",
  strand3: 'Price Analysis and Prediction in the Modern Economy',
  strand4: 'Government Economic Policy, Money, Agriculture and Trade',
};

const shs1: Spec[] = [
  { id: 'shs1-economics-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: shared.strand1, subStrandCode: '1.1', subStrand: 'Introduction to the Subject Economics', pages: [23, 27], lo: 2, cs: 1, li: 4, topics: introductionTopics },
  { id: 'shs1-economics-1.2', year: 1, classLevel: 'SHS1', strandCode: '1', strand: shared.strand1, subStrandCode: '1.2', subStrand: 'Demand for Goods and Services', pages: [27, 30], lo: 1, cs: 1, li: 3, topics: demandTopics },
  { id: 'shs1-economics-1.3', year: 1, classLevel: 'SHS1', strandCode: '1', strand: shared.strand1, subStrandCode: '1.3', subStrand: 'Consumer Behaviour', pages: [30, 32], lo: 1, cs: 1, li: 2, topics: consumerTopics },
  { id: 'shs1-economics-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: shared.strand2, subStrandCode: '2.1', subStrand: 'Production of Goods and Services', pages: [32, 37], lo: 2, cs: 2, li: 5, topics: productionTopics },
  { id: 'shs1-economics-2.2', year: 1, classLevel: 'SHS1', strandCode: '2', strand: shared.strand2, subStrandCode: '2.2', subStrand: 'Supply of Goods and Services', pages: [37, 40], lo: 1, cs: 1, li: 2, topics: supplyTopics },
  { id: 'shs1-economics-2.3', year: 1, classLevel: 'SHS1', strandCode: '2', strand: shared.strand2, subStrandCode: '2.3', subStrand: 'Market Analysis', pages: [40, 43], lo: 1, cs: 1, li: 2, topics: marketTopics },
  { id: 'shs1-economics-3.1', year: 1, classLevel: 'SHS1', strandCode: '3', strand: shared.strand3, subStrandCode: '3.1', subStrand: 'Price and Equilibrium Analysis', pages: [43, 46], lo: 1, cs: 1, li: 2, topics: priceTopics },
  { id: 'shs1-economics-4.1', year: 1, classLevel: 'SHS1', strandCode: '4', strand: shared.strand4, subStrandCode: '4.1', subStrand: 'Macroeconomic Variables (GDP, Inflation, Unemployment, Exchange Rate)', pages: [46, 49], lo: 1, cs: 1, li: 2, topics: macroTopics },
  { id: 'shs1-economics-4.2', year: 1, classLevel: 'SHS1', strandCode: '4', strand: shared.strand4, subStrandCode: '4.2', subStrand: 'Concept of Money, Financial Institutions and Public Finance', pages: [49, 52], lo: 1, cs: 1, li: 2, topics: moneyTopics },
  { id: 'shs1-economics-4.3', year: 1, classLevel: 'SHS1', strandCode: '4', strand: shared.strand4, subStrandCode: '4.3', subStrand: 'Agriculture, Industrialization, and Trade', pages: [52, 58], lo: 2, cs: 2, li: 4, topics: tradeTopics },
];

const shs2: Spec[] = [
  { id: 'shs2-economics-1.1', year: 2, classLevel: 'SHS2', strandCode: '1', strand: shared.strand1, subStrandCode: '1.1', subStrand: 'Introduction to the Subject Economics', pages: [58, 61], lo: 1, cs: 1, li: 3, topics: introductionTopics },
  { id: 'shs2-economics-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: shared.strand1, subStrandCode: '1.2', subStrand: 'Demand for Goods and Services', pages: [61, 64], lo: 1, cs: 1, li: 2, topics: demandTopics },
  { id: 'shs2-economics-1.3', year: 2, classLevel: 'SHS2', strandCode: '1', strand: shared.strand1, subStrandCode: '1.3', subStrand: 'Consumer Behaviour', pages: [64, 66], lo: 1, cs: 1, li: 2, topics: consumerTopics },
  { id: 'shs2-economics-2.1', year: 2, classLevel: 'SHS2', strandCode: '2', strand: shared.strand2, subStrandCode: '2.1', subStrand: 'Production of Goods and Services', pages: [66, 71], lo: 2, cs: 2, li: 5, topics: productionTopics },
  { id: 'shs2-economics-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: shared.strand2, subStrandCode: '2.2', subStrand: 'Supply of Goods and Services', pages: [71, 73], lo: 1, cs: 1, li: 2, topics: supplyTopics },
  { id: 'shs2-economics-2.3', year: 2, classLevel: 'SHS2', strandCode: '2', strand: shared.strand2, subStrandCode: '2.3', subStrand: 'Market Analysis', pages: [73, 78], lo: 1, cs: 1, li: 2, topics: marketTopics },
  { id: 'shs2-economics-3.1', year: 2, classLevel: 'SHS2', strandCode: '3', strand: shared.strand3, subStrandCode: '3.1', subStrand: 'Price and Equilibrium Analysis', pages: [66, 78], lo: 1, cs: 1, li: 2, topics: priceTopics },
  { id: 'shs2-economics-4.1', year: 2, classLevel: 'SHS2', strandCode: '4', strand: shared.strand4, subStrandCode: '4.1', subStrand: 'Macroeconomic Variables (GDP, Inflation, Unemployment, Exchange Rate)', pages: [78, 82], lo: 2, cs: 2, li: 4, topics: macroTopics },
  { id: 'shs2-economics-4.2', year: 2, classLevel: 'SHS2', strandCode: '4', strand: shared.strand4, subStrandCode: '4.2', subStrand: 'Concept of Money, Financial Institutions and Public Finance', pages: [82, 85], lo: 1, cs: 1, li: 4, topics: moneyTopics },
  { id: 'shs2-economics-4.3', year: 2, classLevel: 'SHS2', strandCode: '4', strand: shared.strand4, subStrandCode: '4.3', subStrand: 'Agriculture, Industrialization, and Trade', pages: [85, 90], lo: 2, cs: 2, li: 4, topics: tradeTopics },
];

const shs3: Spec[] = [
  { id: 'shs3-economics-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: shared.strand1, subStrandCode: '1.2', subStrand: 'Demand for Goods and Services', pages: [90, 93], lo: 1, cs: 1, li: 2, topics: demandTopics },
  { id: 'shs3-economics-1.3', year: 3, classLevel: 'SHS3', strandCode: '1', strand: shared.strand1, subStrandCode: '1.3', subStrand: 'Consumer Behaviour', pages: [93, 96], lo: 1, cs: 1, li: 2, topics: consumerTopics },
  { id: 'shs3-economics-2.1', year: 3, classLevel: 'SHS3', strandCode: '2', strand: shared.strand2, subStrandCode: '2.1', subStrand: 'Production of Goods and Services', pages: [96, 101], lo: 2, cs: 2, li: 5, topics: productionTopics },
  { id: 'shs3-economics-2.2', year: 3, classLevel: 'SHS3', strandCode: '2', strand: shared.strand2, subStrandCode: '2.2', subStrand: 'Supply of Goods and Services', pages: [101, 104], lo: 1, cs: 1, li: 2, topics: supplyTopics },
  { id: 'shs3-economics-2.3', year: 3, classLevel: 'SHS3', strandCode: '2', strand: shared.strand2, subStrandCode: '2.3', subStrand: 'Market Analysis', pages: [104, 107], lo: 1, cs: 1, li: 2, topics: marketTopics },
  { id: 'shs3-economics-3.1', year: 3, classLevel: 'SHS3', strandCode: '3', strand: shared.strand3, subStrandCode: '3.1', subStrand: 'Price and Equilibrium Analysis', pages: [107, 110], lo: 1, cs: 1, li: 2, topics: priceTopics },
  { id: 'shs3-economics-4.1', year: 3, classLevel: 'SHS3', strandCode: '4', strand: shared.strand4, subStrandCode: '4.1', subStrand: 'Macroeconomic Variables (GDP, Inflation, Unemployment, Exchange Rate)', pages: [110, 115], lo: 2, cs: 2, li: 4, topics: macroTopics },
  { id: 'shs3-economics-4.2', year: 3, classLevel: 'SHS3', strandCode: '4', strand: shared.strand4, subStrandCode: '4.2', subStrand: 'Concept of Money, Financial Institutions and Public Finance', pages: [115, 118], lo: 1, cs: 1, li: 3, topics: moneyTopics },
  { id: 'shs3-economics-4.3', year: 3, classLevel: 'SHS3', strandCode: '4', strand: shared.strand4, subStrandCode: '4.3', subStrand: 'Agriculture, Industrialization, and Trade', pages: [118, 124], lo: 2, cs: 2, li: 4, topics: tradeTopics },
];

export const economicsShs1: ShsSubStrand[] = shs1.map(subStrand);
export const economicsShs2: ShsSubStrand[] = shs2.map(subStrand);
export const economicsShs3: ShsSubStrand[] = shs3.map(subStrand);

export const economics = [...economicsShs1, ...economicsShs2, ...economicsShs3];
