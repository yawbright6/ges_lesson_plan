import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Computers', 'Internet access', 'Productivity software', 'Network devices', 'Projector', 'Mobile devices', 'Security tools'];

type Spec = {
  id: string;
  year: 1 | 2 | 3;
  classLevel: 'SHS1' | 'SHS2' | 'SHS3';
  strandCode: string;
  strand: string;
  subStrandCode: string;
  subStrand: string;
  pages: number[];
  li: number;
  topics: string[];
};

function indicator(baseId: string, baseCode: string, topic: string, index: number, page: number): ShsLearningIndicator {
  return {
    id: `${baseId}-li-${index}`,
    code: `${baseCode}.LI.${index}`,
    text: `Apply ICT knowledge and practical skills to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use hands-on practice, project-based learning, collaborative troubleshooting and digital artefact creation to explore ${topic.toLowerCase()}.`],
    assessment: { code: `${baseCode}.AS.${index}`, levels: assessmentLevels },
    resources,
    sourcePage: page,
  };
}

function subStrand(spec: Spec): ShsSubStrand {
  const baseCode = `${spec.year}.${spec.strandCode}.${spec.subStrandCode.split('.').at(-1)}`;
  const outcomeId = `${spec.id}-${baseCode.replaceAll('.', '-')}-lo-1`;

  return {
    id: spec.id,
    subject: 'Information and Communications Technology',
    classLevel: spec.classLevel,
    year: spec.year,
    strandCode: spec.strandCode,
    strand: spec.strand,
    subStrandCode: spec.subStrandCode,
    subStrand: spec.subStrand,
    sourcePages: spec.pages,
    learningOutcomes: [
      {
        id: outcomeId,
        code: `${baseCode}.LO.1`,
        text: `Use ICT tools responsibly in ${spec.subStrand.toLowerCase()}.`,
        skillsAndCompetencies: ['Digital literacy', 'Critical thinking and problem solving', 'Communication and collaboration', 'Creativity and innovation'],
        gesi: ['Use inclusive digital tasks and assistive options so diverse learners can create, communicate and participate safely.'],
        sel: ['Build confidence, responsible digital decision-making, respectful communication and collaborative problem solving.'],
        values: ['Patriotism', 'Honesty', 'Discipline', 'Respect', 'Humility', 'Good citizenship'],
        sourcePages: spec.pages,
        contentStandards: [
          {
            id: `${outcomeId}-cs-1`,
            code: `${baseCode}.CS.1`,
            text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} in ICT practice.`,
            sourcePage: spec.pages.at(-1) ?? spec.pages[0],
            indicators: Array.from({ length: spec.li }, (_, index) => indicator(`${outcomeId}-cs-1`, baseCode, spec.topics[index % spec.topics.length], index + 1, spec.pages.at(-1) ?? spec.pages[0])),
          } satisfies ShsContentStandard,
        ],
      },
    ],
  };
}

const productivityTopics = ['multimedia documents', 'word processing', 'spreadsheets', 'presentations', 'data organisation'];
const emergingTopics = ['emerging technologies', 'artificial intelligence', 'technology applications'];
const onlineTopics = ['online communication', 'internet services', 'digital collaboration'];
const networkTopics = ['guided media', 'unguided media', 'network transmission'];
const securityTopics = ['information security', 'safe computing', 'data protection'];

const specs: Spec[] = [
  { id: 'shs1-ict-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'ICTs in the Society', subStrandCode: '1.1', subStrand: 'Organising, Managing and Presenting Information Using Essential Productivity Tools', pages: [23, 29], li: 5, topics: productivityTopics },
  { id: 'shs1-ict-1.2', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'ICTs in the Society', subStrandCode: '1.2', subStrand: 'Emerging Technologies and Applications', pages: [29, 34], li: 3, topics: emergingTopics },
  { id: 'shs1-ict-1.3', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'ICTs in the Society', subStrandCode: '1.3', subStrand: 'Connecting and Communicating Online', pages: [34, 37], li: 2, topics: onlineTopics },
  { id: 'shs1-ict-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Network Systems for Transmitting Information', subStrandCode: '2.1', subStrand: 'Guided and Unguided Network Systems', pages: [37, 41], li: 2, topics: networkTopics },
  { id: 'shs1-ict-2.2', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Network Systems for Transmitting Information', subStrandCode: '2.2', subStrand: 'Data and Information Security', pages: [41, 46], li: 3, topics: securityTopics },
  { id: 'shs2-ict-1.1', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'ICTs in the Society', subStrandCode: '1.1', subStrand: 'Organising, Managing and Presenting Information Using Essential Productivity Tools', pages: [46, 51], li: 5, topics: productivityTopics },
  { id: 'shs2-ict-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'ICTs in the Society', subStrandCode: '1.2', subStrand: 'Emerging Technologies and Applications', pages: [51, 54], li: 2, topics: emergingTopics },
  { id: 'shs2-ict-1.3', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'ICTs in the Society', subStrandCode: '1.3', subStrand: 'Connecting and Communicating Online', pages: [54, 58], li: 2, topics: onlineTopics },
  { id: 'shs2-ict-2.1', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Network Systems for Transmitting Information', subStrandCode: '2.1', subStrand: 'Guided and Unguided Network Systems', pages: [58, 62], li: 2, topics: networkTopics },
  { id: 'shs2-ict-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Network Systems for Transmitting Information', subStrandCode: '2.2', subStrand: 'Data and Information Security', pages: [62, 67], li: 2, topics: securityTopics },
  { id: 'shs3-ict-1.1', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'ICTs in the Society', subStrandCode: '1.1', subStrand: 'Organising, Managing and Presenting Information Using Essential Productivity Tools', pages: [67, 71], li: 4, topics: productivityTopics },
  { id: 'shs3-ict-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'ICTs in the Society', subStrandCode: '1.2', subStrand: 'Emerging Technologies and Applications', pages: [71, 75], li: 2, topics: emergingTopics },
  { id: 'shs3-ict-1.3', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'ICTs in the Society', subStrandCode: '1.3', subStrand: 'Connecting and Communicating Online', pages: [75, 79], li: 2, topics: onlineTopics },
  { id: 'shs3-ict-2.1', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Network Systems for Transmitting Information', subStrandCode: '2.1', subStrand: 'Guided and Unguided Network Systems', pages: [79, 83], li: 1, topics: networkTopics },
  { id: 'shs3-ict-2.2', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Network Systems for Transmitting Information', subStrandCode: '2.2', subStrand: 'Data and Information Security', pages: [83, 87], li: 2, topics: securityTopics },
];

export const ictShs1: ShsSubStrand[] = specs.filter((spec) => spec.year === 1).map(subStrand);
export const ictShs2: ShsSubStrand[] = specs.filter((spec) => spec.year === 2).map(subStrand);
export const ictShs3: ShsSubStrand[] = specs.filter((spec) => spec.year === 3).map(subStrand);

export const ict = [...ictShs1, ...ictShs2, ...ictShs3];
