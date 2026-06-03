import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Constitutional excerpts', 'Case studies', 'News articles', 'Internet resources', 'Charts', 'Community resource persons'];

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
    text: `Analyse government concepts and civic issues related to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use debate, role-play, case study, source analysis and collaborative discussion to examine ${topic.toLowerCase()}.`],
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
    subject: 'Government',
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
        text: `Evaluate ${spec.subStrand.toLowerCase()} through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Critical thinking', 'Communication', 'Collaboration', 'Creativity and innovation'],
        gesi: ['Use inclusive civic dialogue that respects different political views, cultures, religions and abilities.'],
        sel: ['Build self-confidence, tolerance and responsible decision-making in civic discussions.'],
        values: ['Tolerance', 'Integrity', 'Patriotism', 'Respect'],
        sourcePages: spec.pages,
        contentStandards: hasStandard
          ? [
              {
                id: `${outcomeId}-cs-${loNumber}`,
                code: `${baseCode}.CS.${loNumber}`,
                text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} in governance and civic life.`,
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
  { id: 'shs1-government-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Government and Development', subStrandCode: '1.1', subStrand: 'Basics of Government', pages: [24, 25, 27], lo: 1, cs: 1, li: 3, topics: ['meaning of government', 'principles of government', 'importance of government'] },
  { id: 'shs1-government-1.2', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Government and Development', subStrandCode: '1.2', subStrand: 'Indigenous and Contemporary Governance in Ghana', pages: [28, 29, 30], lo: 1, cs: 1, li: 3, topics: ['indigenous governance', 'chieftaincy', 'contemporary governance'] },
  { id: 'shs1-government-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Constitution, Institutions and Administration', subStrandCode: '2.1', subStrand: 'Constitution and Organs of Government', pages: [32, 33, 34], lo: 2, cs: 1, li: 5, topics: ['constitution', 'rule of law', 'legislature', 'executive', 'judiciary'] },
  { id: 'shs1-government-2.2', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Constitution, Institutions and Administration', subStrandCode: '2.2', subStrand: 'State and Non-State Actors in Ghana', pages: [36, 37], lo: 1, cs: 1, li: 3, topics: ['state actors', 'non-state actors', 'civic participation'] },
  { id: 'shs1-government-3.1', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Ghana in the Global System', subStrandCode: '3.1', subStrand: 'Ghana in the Community of Nations', pages: [36, 39], lo: 1, cs: 1, li: 2, topics: ['foreign policy', 'international organisations'] },
];

const shs2: Spec[] = [
  { id: 'shs2-government-1.1', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Government and Development', subStrandCode: '1.1', subStrand: 'Basics of Government', pages: [39, 43], lo: 2, cs: 1, li: 6, topics: ['forms of government', 'democracy', 'authoritarianism', 'political participation', 'citizenship', 'legitimacy'] },
  { id: 'shs2-government-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Government and Development', subStrandCode: '1.2', subStrand: 'Indigenous and Contemporary Governance in Ghana', pages: [43, 45], lo: 1, cs: 1, li: 2, topics: ['traditional authority', 'local governance'] },
  { id: 'shs2-government-2.1', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Constitution, Institutions and Administration', subStrandCode: '2.1', subStrand: 'Constitution and Organs of Government', pages: [45, 48], lo: 1, cs: 1, li: 3, topics: ['separation of powers', 'checks and balances', 'constitutionalism'] },
  { id: 'shs2-government-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Constitution, Institutions and Administration', subStrandCode: '2.2', subStrand: 'State and Non-State Actors in Ghana', pages: [48, 53], lo: 2, cs: 1, li: 5, topics: ['political parties', 'electoral bodies', 'civil society', 'media', 'interest groups'] },
  { id: 'shs2-government-3.1', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Ghana in the Global System', subStrandCode: '3.1', subStrand: 'Ghana in the Community of Nations', pages: [53, 55], lo: 1, cs: 1, li: 2, topics: ['diplomacy', 'regional cooperation'] },
  { id: 'shs2-government-3.2', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Ghana in the Global System', subStrandCode: '3.2', subStrand: 'Globalisation and Development', pages: [55, 59], lo: 1, cs: 1, li: 2, topics: ['globalisation', 'development opportunities and challenges'] },
];

const shs3: Spec[] = [
  { id: 'shs3-government-1.1', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Government and Development', subStrandCode: '1.1', subStrand: 'Basics of Government', pages: [59, 62], lo: 1, cs: 1, li: 2, topics: ['political ideologies', 'governance and development'] },
  { id: 'shs3-government-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Government and Development', subStrandCode: '1.2', subStrand: 'Indigenous and Contemporary Governance in Ghana', pages: [62, 64], lo: 1, cs: 1, li: 2, topics: ['traditional governance reforms', 'contemporary governance challenges'] },
  { id: 'shs3-government-2.1', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Constitution, Institutions and Administration', subStrandCode: '2.1', subStrand: 'Constitution and Organs of Government', pages: [64, 67], lo: 1, cs: 1, li: 3, topics: ['constitutional development', 'organs of government', 'administrative accountability'] },
  { id: 'shs3-government-2.2', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Constitution, Institutions and Administration', subStrandCode: '2.2', subStrand: 'State and Non-State Actors in Ghana', pages: [67, 72], lo: 2, cs: 1, li: 4, topics: ['public administration', 'civil society oversight', 'pressure groups', 'citizen advocacy'] },
  { id: 'shs3-government-3.1', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Ghana in the Global System', subStrandCode: '3.1', subStrand: 'Ghana in the Community of Nations', pages: [72, 74], lo: 1, cs: 1, li: 2, topics: ['international relations', 'Ghana and global institutions'] },
  { id: 'shs3-government-3.2', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Ghana in the Global System', subStrandCode: '3.2', subStrand: 'Globalisation and Development', pages: [74, 77], lo: 1, cs: 1, li: 2, topics: ['globalisation and sovereignty', 'globalisation and development'] },
];

export const governmentShs1: ShsSubStrand[] = shs1.map(subStrand);
export const governmentShs2: ShsSubStrand[] = shs2.map(subStrand);
export const governmentShs3: ShsSubStrand[] = shs3.map(subStrand);

export const government = [...governmentShs1, ...governmentShs2, ...governmentShs3];
