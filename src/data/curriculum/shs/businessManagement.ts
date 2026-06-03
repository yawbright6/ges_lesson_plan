import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Textbooks', 'Case studies', 'Business documents', 'Projector', 'Computers', 'Internet sources', 'Local business observations'];

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
    text: `Apply business management knowledge and skills to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use case study, field enquiry, role play, business document analysis and group presentation to examine ${topic.toLowerCase()}.`],
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
    subject: 'Business Management',
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
        text: `Apply business management principles in ${spec.subStrand.toLowerCase()} through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Critical thinking and problem solving', 'Communication and collaboration', 'Digital literacy', 'Creativity and innovation'],
        gesi: ['Use inclusive business examples and group roles that value different competencies, genders and abilities in enterprise creation.'],
        sel: ['Build self-confidence, responsible decision-making, relationship skills and resilience in business contexts.'],
        values: ['Integrity', 'Truthfulness', 'Equity', 'Discipline', 'Resourcefulness', 'Responsible citizenship'],
        sourcePages: spec.pages,
        contentStandards: Array.from({ length: csDistribution[index] ?? 0 }, () => {
          csIndex += 1;
          const standardId = `${outcomeId}-cs-${csIndex}`;

          return {
            id: standardId,
            code: `${baseCode}.CS.${csIndex}`,
            text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} in business management practice.`,
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

const formsTopics = ['meaning of business', 'business objectives', 'sole proprietorship', 'partnership', 'companies', 'state-owned enterprises', 'sources of funding'];
const functionalTopics = ['planning', 'organising', 'staffing', 'directing', 'controlling', 'production management', 'marketing management', 'financial management', 'human resource management'];
const legalRiskTopics = ['business law', 'contracts', 'agency', 'insurance', 'risk management'];
const internationalTopics = ['international trade', 'global business environment', 'e-business', 'digital markets'];
const developmentTopics = ['business idea generation', 'business plan', 'enterprise start-up', 'business growth'];

const shs1: Spec[] = [
  { id: 'shs1-business-management-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Managing Businesses and the Legal Framework of Businesses', subStrandCode: '1.1', subStrand: 'Forms of Business', pages: [23, 27], lo: 1, cs: 1, li: 5, topics: formsTopics },
  { id: 'shs1-business-management-1.2', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Managing Businesses and the Legal Framework of Businesses', subStrandCode: '1.2', subStrand: 'Functional Areas of Management', pages: [27, 33], lo: 1, cs: 1, li: 9, topics: functionalTopics },
  { id: 'shs1-business-management-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Glocal Business', subStrandCode: '2.1', subStrand: 'International Business and E-Business', pages: [37, 41], lo: 1, cs: 1, li: 4, topics: internationalTopics },
  { id: 'shs1-business-management-2.2', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Glocal Business', subStrandCode: '2.2', subStrand: 'Business Development', pages: [33, 37], lo: 1, cs: 1, li: 4, topics: developmentTopics },
];

const shs2: Spec[] = [
  { id: 'shs2-business-management-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Managing Businesses and the Legal Framework of Businesses', subStrandCode: '1.2', subStrand: 'Functional Areas of Management', pages: [42, 51], lo: 4, cs: 4, li: 9, topics: functionalTopics },
  { id: 'shs2-business-management-1.3', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Managing Businesses and the Legal Framework of Businesses', subStrandCode: '1.3', subStrand: 'Legal Environment of Business and Risk Management', pages: [51, 55], lo: 2, cs: 2, li: 4, topics: legalRiskTopics },
  { id: 'shs2-business-management-2.1', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Glocal Business', subStrandCode: '2.1', subStrand: 'International Business and E-Business', pages: [55, 60], lo: 2, cs: 2, li: 3, topics: internationalTopics },
];

const shs3: Spec[] = [
  { id: 'shs3-business-management-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Managing Businesses and the Legal Framework of Businesses', subStrandCode: '1.2', subStrand: 'Functional Areas of Management', pages: [61, 65], lo: 2, cs: 2, li: 4, topics: functionalTopics },
  { id: 'shs3-business-management-2.1', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Glocal Business', subStrandCode: '2.1', subStrand: 'International Business and E-Business', pages: [65, 70], lo: 1, cs: 1, li: 3, topics: internationalTopics },
  { id: 'shs3-business-management-2.2', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Glocal Business', subStrandCode: '2.2', subStrand: 'Business Development', pages: [70, 74], lo: 1, cs: 1, li: 3, topics: developmentTopics },
];

export const businessManagementShs1: ShsSubStrand[] = shs1.map(subStrand);
export const businessManagementShs2: ShsSubStrand[] = shs2.map(subStrand);
export const businessManagementShs3: ShsSubStrand[] = shs3.map(subStrand);

export const businessManagement = [...businessManagementShs1, ...businessManagementShs2, ...businessManagementShs3];
