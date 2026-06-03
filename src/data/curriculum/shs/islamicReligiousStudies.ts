import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ["Qur'an", 'Hadith texts', 'Internet sources', 'Religious texts', 'Charts', 'Case studies', 'Resource persons', 'Audio-visual materials'];

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
    text: `Apply Islamic Religious Studies concepts and values to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use text study, enquiry-based discussion, role play, debate, case analysis and reflective writing to examine ${topic.toLowerCase()}.`],
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
    subject: 'Islamic Religious Studies',
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
        text: `Explain and evaluate ${spec.subStrand.toLowerCase()} through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Critical thinking and problem solving', 'Communication and collaboration', 'Cultural identity and global citizenship', 'Personal development and leadership'],
        gesi: ['Use inclusive discussions that respect religious diversity, gender equity and the dignity of all learners.'],
        sel: ['Build self-awareness, social awareness, relationship skills and responsible moral decision-making.'],
        values: ['Respect', 'Tolerance', 'Truthfulness', 'Honesty', 'Peace', 'Responsible citizenship'],
        sourcePages: spec.pages,
        contentStandards: hasStandard
          ? [
              {
                id: `${outcomeId}-cs-${loNumber}`,
                code: `${baseCode}.CS.${loNumber}`,
                text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} in Islamic Religious Studies.`,
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

const backgroundTopics = ['meaning of religion', 'importance of religious studies', 'history of Islam', 'Islam in Ghana', 'Islamic contribution to development', 'religious diversity', 'career pathways', 'interreligious understanding', 'sources of Islamic knowledge'];
const godCreationTopics = ['nature of Allah', 'creation', 'human responsibility', 'stewardship', 'dignity of humankind'];
const beliefsTopics = ['major beliefs of Islam', 'tawhid', 'prophethood', 'life after death'];
const worshipTopics = ['Islamic worship', 'moral values', 'service', 'development'];
const practicesTopics = ['Muslim practices', 'community service', 'responsible citizenship', 'national development'];
const communitiesTopics = ['origin of Islamic communities', 'nature of Islamic communities', 'Islamic leadership', 'community life'];
const nationTopics = ['Islam and citizenship', 'peace building', 'national cohesion', 'religious tolerance', 'social welfare'];
const genderDevelopmentTopics = ['gender dignity', 'Islamic communities', 'social inclusion', 'development', 'responsible relationships'];
const environmentTopics = ['environmental stewardship', 'sustainable use of resources', 'Islamic responsibility', 'cleanliness'];
const sexualMoralityTopics = ['sexual morality', 'chastity', 'responsible choices', 'healthy relationships'];
const fraudTopics = ['meaning of fraud', 'forms of fraud', 'Islamic response to fraud'];

const strands = {
  creation: "Study of Religion, God's Creation and Humankind",
  values: 'Religious Beliefs, Practices, Moral Values and Human Development',
  communities: 'Religious Communities and Nation Building',
  issues: 'Religion and Contemporary Issues',
};

const shs1: Spec[] = [
  { id: 'shs1-islamic-religious-studies-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: strands.creation, subStrandCode: '1.1', subStrand: 'Background to the Study of Religion and Islam', pages: [23, 37], lo: 2, cs: 2, li: 9, topics: backgroundTopics },
  { id: 'shs1-islamic-religious-studies-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: strands.values, subStrandCode: '2.1', subStrand: 'Major Beliefs of Islam', pages: [38, 44], lo: 1, cs: 1, li: 4, topics: beliefsTopics },
  { id: 'shs1-islamic-religious-studies-3.1', year: 1, classLevel: 'SHS1', strandCode: '3', strand: strands.communities, subStrandCode: '3.1', subStrand: 'The Origin and Nature of Islamic Communities', pages: [45, 51], lo: 1, cs: 1, li: 4, topics: communitiesTopics },
  { id: 'shs1-islamic-religious-studies-4.1', year: 1, classLevel: 'SHS1', strandCode: '4', strand: strands.issues, subStrandCode: '4.1', subStrand: 'Islam and the Environment', pages: [52, 58], lo: 1, cs: 1, li: 4, topics: environmentTopics },
];

const shs2: Spec[] = [
  { id: 'shs2-islamic-religious-studies-1.1', year: 2, classLevel: 'SHS2', strandCode: '1', strand: strands.creation, subStrandCode: '1.1', subStrand: 'Background to the Study of Religion and Islam', pages: [60, 66], lo: 1, cs: 1, li: 3, topics: backgroundTopics },
  { id: 'shs2-islamic-religious-studies-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: strands.creation, subStrandCode: '1.2', subStrand: 'The Nature of God and His Creation', pages: [67, 75], lo: 1, cs: 1, li: 5, topics: godCreationTopics },
  { id: 'shs2-islamic-religious-studies-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: strands.values, subStrandCode: '2.2', subStrand: 'Islamic Worship and Moral Values for Development', pages: [76, 83], lo: 1, cs: 1, li: 4, topics: worshipTopics },
  { id: 'shs2-islamic-religious-studies-3.2', year: 2, classLevel: 'SHS2', strandCode: '3', strand: strands.communities, subStrandCode: '3.2', subStrand: 'Islam and Nation Building', pages: [84, 92], lo: 1, cs: 1, li: 5, topics: nationTopics },
  { id: 'shs2-islamic-religious-studies-4.2', year: 2, classLevel: 'SHS2', strandCode: '4', strand: strands.issues, subStrandCode: '4.2', subStrand: 'Islam and Sexual Morality', pages: [93, 100], lo: 1, cs: 1, li: 4, topics: sexualMoralityTopics },
];

const shs3: Spec[] = [
  { id: 'shs3-islamic-religious-studies-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: strands.creation, subStrandCode: '1.2', subStrand: 'The Nature of God and His Creation', pages: [102, 108], lo: 1, cs: 1, li: 3, topics: godCreationTopics },
  { id: 'shs3-islamic-religious-studies-2.2', year: 3, classLevel: 'SHS3', strandCode: '2', strand: strands.values, subStrandCode: '2.2', subStrand: 'Worship and Moral Values for Development', pages: [109, 115], lo: 1, cs: 1, li: 3, topics: worshipTopics },
  { id: 'shs3-islamic-religious-studies-2.3', year: 3, classLevel: 'SHS3', strandCode: '2', strand: strands.values, subStrandCode: '2.3', subStrand: 'Muslim Practices and National Development', pages: [116, 123], lo: 1, cs: 1, li: 4, topics: practicesTopics },
  { id: 'shs3-islamic-religious-studies-3.3', year: 3, classLevel: 'SHS3', strandCode: '3', strand: strands.communities, subStrandCode: '3.3', subStrand: 'Islamic Communities, Gender and Development', pages: [124, 133], lo: 1, cs: 1, li: 5, topics: genderDevelopmentTopics },
  { id: 'shs3-islamic-religious-studies-4.3', year: 3, classLevel: 'SHS3', strandCode: '4', strand: strands.issues, subStrandCode: '4.3', subStrand: 'Islam and Fraud', pages: [134, 142], lo: 1, cs: 1, li: 3, topics: fraudTopics },
];

export const islamicReligiousStudiesShs1: ShsSubStrand[] = shs1.map(subStrand);
export const islamicReligiousStudiesShs2: ShsSubStrand[] = shs2.map(subStrand);
export const islamicReligiousStudiesShs3: ShsSubStrand[] = shs3.map(subStrand);

export const islamicReligiousStudies = [...islamicReligiousStudiesShs1, ...islamicReligiousStudiesShs2, ...islamicReligiousStudiesShs3];
