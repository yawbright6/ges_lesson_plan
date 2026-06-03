import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Historical sources', 'Maps', 'Timelines', 'Archives', 'Oral history recordings', 'Documentaries', 'Internet sources'];

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
    text: `Apply historical inquiry and reasoning to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use source analysis, timeline construction, debate, oral history, maps and collaborative enquiry to investigate ${topic.toLowerCase()}.`],
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
    subject: 'History',
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
        text: `Analyse ${spec.subStrand.toLowerCase()} through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Critical thinking and problem solving', 'Communication and collaboration', 'Digital literacy', 'Cultural identity and global citizenship'],
        gesi: ['Use inclusive historical sources and balanced narratives that represent women, men and marginalised groups.'],
        sel: ['Build empathy, responsible judgement and respect for diverse experiences in historical interpretation.'],
        values: ['Truthfulness', 'Patriotism', 'Tolerance', 'Respect', 'Responsible citizenship'],
        sourcePages: spec.pages,
        contentStandards: hasStandard
          ? [
              {
                id: `${outcomeId}-cs-${loNumber}`,
                code: `${baseCode}.CS.${loNumber}`,
                text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} using historical evidence.`,
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

const natureTopics = ['meaning of history', 'scope of history', 'historical thinking skills', 'chronology', 'importance of history'];
const sourcesTopics = ['primary sources', 'secondary sources', 'oral tradition', 'archaeology', 'source evaluation'];
const emergenceTopics = ['early states', 'state formation', 'political organisation', 'leadership systems', 'social structure', 'trade networks', 'technology', 'migration', 'inter-group relations'];
const economyTopics = ['indigenous industries', 'trade and markets', 'agriculture', 'technology and production'];
const religionTopics = ['indigenous religion', 'religious change', 'religion and society'];
const globalTopics = ['trans-Saharan connections', 'Atlantic connections', 'diaspora links'];
const colonialPreludeTopics = ['European contact', 'trade relations', 'missionary activities', 'imperial interests'];
const colonialResponseTopics = ['resistance', 'collaboration', 'nationalist ideas'];
const postColonialTopics = ['political developments', 'economic policies', 'social change', 'constitutional development', 'Ghana from 1957 to 2007'];

const shs1: Spec[] = [
  { id: 'shs1-history-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Historical Inquiry and Writing', subStrandCode: '1.1', subStrand: 'Nature and Scope of History', pages: [24, 35], lo: 2, cs: 2, li: 5, topics: natureTopics },
  { id: 'shs1-history-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'States and Societies in Pre-Colonial Times', subStrandCode: '2.1', subStrand: 'Emergence of States and Societies', pages: [35, 51], lo: 3, cs: 3, li: 9, topics: emergenceTopics },
  { id: 'shs1-history-2.2', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'States and Societies in Pre-Colonial Times', subStrandCode: '2.2', subStrand: 'Pre-Colonial Economy and Economic Activities', pages: [51, 57], lo: 1, cs: 1, li: 3, topics: economyTopics },
  { id: 'shs1-history-3.1', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Age of Encounter and Exchanges Up to the 20th Century', subStrandCode: '3.1', subStrand: 'Religion and Religious Change', pages: [57, 62], lo: 1, cs: 1, li: 2, topics: religionTopics },
];

const shs2: Spec[] = [
  { id: 'shs2-history-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Historical Inquiry and Writing', subStrandCode: '1.2', subStrand: 'Sources and Methods of Reconstructing History', pages: [62, 68], lo: 1, cs: 1, li: 3, topics: sourcesTopics },
  { id: 'shs2-history-3.2', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Age of Encounter and Exchanges Up to the 20th Century', subStrandCode: '3.2', subStrand: 'Global Connections', pages: [68, 73], lo: 1, cs: 1, li: 2, topics: globalTopics },
  { id: 'shs2-history-3.3', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Age of Encounter and Exchanges Up to the 20th Century', subStrandCode: '3.3', subStrand: 'Prelude to Colonisation and Colonial Rule', pages: [73, 79], lo: 1, cs: 1, li: 3, topics: colonialPreludeTopics },
  { id: 'shs2-history-3.4', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Age of Encounter and Exchanges Up to the 20th Century', subStrandCode: '3.4', subStrand: 'Response to Colonial Rule', pages: [79, 86], lo: 1, cs: 1, li: 3, topics: colonialResponseTopics },
  { id: 'shs2-history-4.1', year: 2, classLevel: 'SHS2', strandCode: '4', strand: 'Independence and Post-Colonial Developments', subStrandCode: '4.1', subStrand: 'Socio-Economic and Political Developments in Ghana (1957 - 2007)', pages: [86, 97], lo: 1, cs: 1, li: 5, topics: postColonialTopics },
];

const shs3: Spec[] = [
  { id: 'shs3-history-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Historical Inquiry and Writing', subStrandCode: '1.2', subStrand: 'Sources and Methods of Reconstructing History', pages: [97, 103], lo: 1, cs: 1, li: 2, topics: sourcesTopics },
  { id: 'shs3-history-2.1', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'States and Societies in Pre-Colonial Times', subStrandCode: '2.1', subStrand: 'Emergence of States and Societies', pages: [103, 109], lo: 1, cs: 1, li: 3, topics: emergenceTopics },
  { id: 'shs3-history-2.2', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'States and Societies in Pre-Colonial Times', subStrandCode: '2.2', subStrand: 'Pre-Colonial Economy and Economic Activities', pages: [109, 116], lo: 1, cs: 1, li: 3, topics: economyTopics },
  { id: 'shs3-history-3.1', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Age of Encounter and Exchanges Up to the 20th Century', subStrandCode: '3.1', subStrand: 'Religion and Religious Change', pages: [116, 120], lo: 1, cs: 1, li: 2, topics: religionTopics },
  { id: 'shs3-history-3.2', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Age of Encounter and Exchanges Up to the 20th Century', subStrandCode: '3.2', subStrand: 'Global Connections', pages: [120, 125], lo: 1, cs: 1, li: 2, topics: globalTopics },
  { id: 'shs3-history-3.3', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Age of Encounter and Exchanges Up to the 20th Century', subStrandCode: '3.3', subStrand: 'Prelude to Colonisation and Colonial Rule', pages: [125, 131], lo: 1, cs: 1, li: 3, topics: colonialPreludeTopics },
  { id: 'shs3-history-3.4', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Age of Encounter and Exchanges Up to the 20th Century', subStrandCode: '3.4', subStrand: 'Response to Colonial Rule', pages: [131, 136], lo: 1, cs: 1, li: 2, topics: colonialResponseTopics },
];

export const historyShs1: ShsSubStrand[] = shs1.map(subStrand);
export const historyShs2: ShsSubStrand[] = shs2.map(subStrand);
export const historyShs3: ShsSubStrand[] = shs3.map(subStrand);

export const history = [...historyShs1, ...historyShs2, ...historyShs3];
