import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Projector', 'Computer', 'Internet sources', 'Textbooks', 'IFRS manual', 'Financial statements and reports'];

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
    text: `Apply accounting knowledge and skills to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use think-pair-share, collaborative analysis, practical records and financial-report interpretation to examine ${topic.toLowerCase()}.`],
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
    subject: 'Accounting',
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
        text: `Demonstrate accounting competence in ${spec.subStrand.toLowerCase()} through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Financial literacy', 'Critical thinking', 'Problem solving', 'Communication and collaboration'],
        gesi: ['Use inclusive accounting tasks and mixed-ability groups so learners value different competencies and backgrounds.'],
        sel: ['Build self-confidence, ethical judgement and responsible decision-making in financial contexts.'],
        values: ['Integrity', 'Truthfulness', 'Discipline', 'Equity', 'Responsible citizenship'],
        sourcePages: spec.pages,
        contentStandards: hasStandard
          ? [
              {
                id: `${outcomeId}-cs-${loNumber}`,
                code: `${baseCode}.CS.${loNumber}`,
                text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} in accounting practice.`,
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
  { id: 'shs1-accounting-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Financial Accounting', subStrandCode: '1.1', subStrand: 'Conceptual Framework', pages: [25, 26, 27, 28], lo: 1, cs: 1, li: 4, topics: ['accounting as a system', 'processing accounting information', 'users of accounting information', 'accounting standards'] },
  { id: 'shs1-accounting-1.2', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Financial Accounting', subStrandCode: '1.2', subStrand: 'Financial Data Analysis', pages: [29, 33], lo: 1, cs: 1, li: 4, topics: ['source documents', 'books of original entry', 'ledger accounts', 'trial balance'] },
  { id: 'shs1-accounting-1.3', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Financial Accounting', subStrandCode: '1.3', subStrand: 'Financial Reporting', pages: [33, 37], lo: 1, cs: 1, li: 3, topics: ['financial statements', 'statement of profit or loss', 'statement of financial position'] },
  { id: 'shs1-accounting-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Cost Accounting', subStrandCode: '2.1', subStrand: 'Controlling Cost to Improve Organisational Performance', pages: [37, 41], lo: 1, cs: 1, li: 5, topics: ['cost concepts', 'cost classification', 'cost behaviour', 'cost control', 'organisational performance'] },
  { id: 'shs1-accounting-2.2', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Cost Accounting', subStrandCode: '2.2', subStrand: 'Determining Cost of Operations for Pricing and Control', pages: [41, 45], lo: 1, cs: 1, li: 5, topics: ['materials cost', 'labour cost', 'overheads', 'unit cost', 'pricing decisions'] },
  { id: 'shs1-accounting-2.3', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Cost Accounting', subStrandCode: '2.3', subStrand: 'Analysing Information for Control and Decision-Making', pages: [45, 50], lo: 1, cs: 1, li: 7, topics: ['cost information', 'budgeting', 'variance analysis', 'break-even analysis', 'decision-making data', 'control reports', 'performance evaluation'] },
];

const shs2: Spec[] = [
  { id: 'shs2-accounting-1.1', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Financial Accounting', subStrandCode: '1.1', subStrand: 'Conceptual Framework', pages: [50, 53], lo: 1, cs: 1, li: 2, topics: ['accounting concepts', 'accounting policies'] },
  { id: 'shs2-accounting-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Financial Accounting', subStrandCode: '1.2', subStrand: 'Financial Data Analysis', pages: [53, 54, 55, 59], lo: 3, cs: 3, li: 6, topics: ['adjustments', 'control accounts', 'bank reconciliation', 'correction of errors', 'depreciation', 'provisions'] },
  { id: 'shs2-accounting-1.3', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Financial Accounting', subStrandCode: '1.3', subStrand: 'Financial Reporting', pages: [59, 60, 65], lo: 2, cs: 2, li: 5, topics: ['sole trader accounts', 'partnership accounts', 'company accounts', 'financial ratios', 'report interpretation'] },
  { id: 'shs2-accounting-2.1', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Cost Accounting', subStrandCode: '2.1', subStrand: 'Controlling Cost to Improve Organisational Performance', pages: [65, 70], lo: 1, cs: 1, li: 5, topics: ['stock control', 'labour control', 'overhead control', 'cost centres', 'responsibility accounting'] },
  { id: 'shs2-accounting-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Cost Accounting', subStrandCode: '2.2', subStrand: 'Determining Cost of Operations for Pricing and Control', pages: [70, 74], lo: 1, cs: 1, li: 4, topics: ['job costing', 'batch costing', 'process costing', 'service costing'] },
  { id: 'shs2-accounting-2.3', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Cost Accounting', subStrandCode: '2.3', subStrand: 'Analysing Information for Control and Decision-Making', pages: [74, 78], lo: 1, cs: 1, li: 2, topics: ['marginal costing', 'short-term decisions'] },
];

const shs3: Spec[] = [
  { id: 'shs3-accounting-1.1', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Financial Accounting', subStrandCode: '1.1', subStrand: 'Conceptual Framework', pages: [78, 81], lo: 1, cs: 1, li: 2, topics: ['regulatory framework', 'ethical accounting practice'] },
  { id: 'shs3-accounting-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Financial Accounting', subStrandCode: '1.2', subStrand: 'Financial Data Analysis', pages: [81, 84], lo: 1, cs: 1, li: 2, topics: ['advanced financial analysis', 'interpretation of accounts'] },
  { id: 'shs3-accounting-1.3', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Financial Accounting', subStrandCode: '1.3', subStrand: 'Financial Reporting', pages: [84, 85, 91], lo: 2, cs: 2, li: 6, topics: ['published accounts', 'cash flow statements', 'non-profit accounts', 'incomplete records', 'accounts from incomplete data', 'reporting decisions'] },
  { id: 'shs3-accounting-2.1', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Cost Accounting', subStrandCode: '2.1', subStrand: 'Controlling Cost to Improve Organisational Performance', pages: [91, 95], lo: 1, cs: 1, li: 5, topics: ['standard costing', 'variance analysis', 'budgetary control', 'cost reduction', 'performance reporting'] },
  { id: 'shs3-accounting-2.2', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Cost Accounting', subStrandCode: '2.2', subStrand: 'Determining Cost of Operations for Pricing and Control', pages: [95, 98], lo: 1, cs: 1, li: 2, topics: ['activity-based costing', 'pricing strategies'] },
  { id: 'shs3-accounting-2.3', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Cost Accounting', subStrandCode: '2.3', subStrand: 'Analysing Information for Control and Decision-Making', pages: [98, 101], lo: 1, cs: 1, li: 2, topics: ['investment decisions', 'management reports'] },
];

export const accountingShs1: ShsSubStrand[] = shs1.map(subStrand);
export const accountingShs2: ShsSubStrand[] = shs2.map(subStrand);
export const accountingShs3: ShsSubStrand[] = shs3.map(subStrand);

export const accounting = [...accountingShs1, ...accountingShs2, ...accountingShs3];
