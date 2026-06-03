import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Bible', 'Internet sources', 'Religious texts', 'Charts', 'Case studies', 'Resource persons', 'Audio-visual materials'];

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
    text: `Apply Christian Religious Studies concepts and values to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use scripture study, enquiry-based discussion, role play, debate, case analysis and reflective writing to examine ${topic.toLowerCase()}.`],
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
    subject: 'Christian Religious Studies',
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
                text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} in Christian Religious Studies.`,
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

const backgroundTopics = ['meaning of religion', 'importance of religious studies', 'history of Christianity', 'Christianity in Ghana', 'Christian contribution to development', 'religious diversity', 'career pathways', 'interreligious understanding'];
const godCreationTopics = ['nature of God', 'creation narratives', 'human responsibility', 'stewardship', 'dignity of humankind'];
const beliefsTopics = ['major Christian beliefs', 'Jesus Christ', 'salvation', 'Christian discipleship'];
const worshipTopics = ['Christian worship', 'moral values', 'service', 'development'];
const musicTopics = ['Christian music', 'values in music', 'worship expression', 'national development'];
const prayerTopics = ['meaning of prayer', 'forms of prayer', 'prayer and character', 'prayer and peace', 'national development'];
const communitiesTopics = ['origin of religious communities', 'nature of religious communities', 'religious leadership', 'community life'];
const nationTopics = ['religion and citizenship', 'peace building', 'national cohesion'];
const genderDevelopmentTopics = ['gender dignity', 'religious communities', 'social inclusion', 'development', 'responsible relationships'];
const environmentTopics = ['creation care', 'environmental stewardship', 'sustainable use of resources', 'Christian responsibility'];
const sexualMoralityTopics = ['sexual morality', 'chastity', 'responsible choices', 'healthy relationships'];
const fraudTopics = ['meaning of fraud', 'forms of fraud', 'Christian response to fraud'];

const shs1: Spec[] = [
  { id: 'shs1-christian-religious-studies-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: "Study of Religion, God's Creation and Humankind", subStrandCode: '1.1', subStrand: 'Background to the Study of Religion and Christianity', pages: [23, 28, 37], lo: 2, cs: 2, li: 8, topics: backgroundTopics },
  { id: 'shs1-christian-religious-studies-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Religious Beliefs, Practices, Moral Values and Human Development', subStrandCode: '2.1', subStrand: 'Major Beliefs of Christianity', pages: [37, 45], lo: 1, cs: 1, li: 4, topics: beliefsTopics },
  { id: 'shs1-christian-religious-studies-3.1', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Religious Communities and Nation Building', subStrandCode: '3.1', subStrand: 'The Origin and Nature of Religious Communities', pages: [45, 52], lo: 1, cs: 1, li: 4, topics: communitiesTopics },
  { id: 'shs1-christian-religious-studies-4.1', year: 1, classLevel: 'SHS1', strandCode: '4', strand: 'Religion and Contemporary Issues', subStrandCode: '4.1', subStrand: 'Religion and the Environment', pages: [52, 59], lo: 1, cs: 1, li: 4, topics: environmentTopics },
];

const shs2: Spec[] = [
  { id: 'shs2-christian-religious-studies-1.1', year: 2, classLevel: 'SHS2', strandCode: '1', strand: "Study of Religion, God's Creation and Humankind", subStrandCode: '1.1', subStrand: 'Background to the Study of Religion and Christianity', pages: [60, 67], lo: 1, cs: 1, li: 4, topics: backgroundTopics },
  { id: 'shs2-christian-religious-studies-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: "Study of Religion, God's Creation and Humankind", subStrandCode: '1.2', subStrand: 'The Nature of God and His Creation', pages: [67, 76], lo: 1, cs: 1, li: 5, topics: godCreationTopics },
  { id: 'shs2-christian-religious-studies-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Religious Beliefs, Practices, Moral Values and Human Development', subStrandCode: '2.2', subStrand: 'Worship and Moral Values for Development', pages: [76, 83], lo: 1, cs: 1, li: 4, topics: worshipTopics },
  { id: 'shs2-christian-religious-studies-3.2', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Religious Communities and Nation Building', subStrandCode: '3.2', subStrand: 'Religion and Nation Building', pages: [83, 91], lo: 1, cs: 1, li: 3, topics: nationTopics },
  { id: 'shs2-christian-religious-studies-3.3', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Religious Communities and Nation Building', subStrandCode: '3.3', subStrand: 'Religious Communities, Gender and Development', pages: [83, 91], lo: 1, cs: 1, li: 5, topics: genderDevelopmentTopics },
  { id: 'shs2-christian-religious-studies-4.2', year: 2, classLevel: 'SHS2', strandCode: '4', strand: 'Religion and Contemporary Issues', subStrandCode: '4.2', subStrand: 'Religion and Sexual Morality', pages: [91, 98], lo: 1, cs: 1, li: 4, topics: sexualMoralityTopics },
];

const shs3: Spec[] = [
  { id: 'shs3-christian-religious-studies-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: "Study of Religion, God's Creation and Humankind", subStrandCode: '1.2', subStrand: 'The Nature of God and His Creation', pages: [99, 108], lo: 1, cs: 1, li: 5, topics: godCreationTopics },
  { id: 'shs3-christian-religious-studies-2.3', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Religious Beliefs, Practices, Moral Values and Human Development', subStrandCode: '2.3', subStrand: 'Christian Music and Values for National Development', pages: [108, 118], lo: 1, cs: 1, li: 4, topics: musicTopics },
  { id: 'shs3-christian-religious-studies-2.4', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Religious Beliefs, Practices, Moral Values and Human Development', subStrandCode: '2.4', subStrand: 'Prayer and National Development', pages: [118, 124], lo: 1, cs: 1, li: 5, topics: prayerTopics },
  { id: 'shs3-christian-religious-studies-3.3', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Religious Communities and Nation Building', subStrandCode: '3.3', subStrand: 'Religious Communities, Gender and Development', pages: [124, 132], lo: 1, cs: 1, li: 5, topics: genderDevelopmentTopics },
  { id: 'shs3-christian-religious-studies-4.3', year: 3, classLevel: 'SHS3', strandCode: '4', strand: 'Religion and Contemporary Issues', subStrandCode: '4.3', subStrand: 'Religion and Fraud', pages: [132, 139], lo: 1, cs: 1, li: 3, topics: fraudTopics },
];

export const christianReligiousStudiesShs1: ShsSubStrand[] = shs1.map(subStrand);
export const christianReligiousStudiesShs2: ShsSubStrand[] = shs2.map(subStrand);
export const christianReligiousStudiesShs3: ShsSubStrand[] = shs3.map(subStrand);

export const christianReligiousStudies = [...christianReligiousStudiesShs1, ...christianReligiousStudiesShs2, ...christianReligiousStudiesShs3];
