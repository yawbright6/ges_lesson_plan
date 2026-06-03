import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Literary texts', 'Poems', 'Drama scripts', 'Short stories', 'Films', 'Audio recordings', 'Internet resources'];

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
    text: `Analyse and respond to literary texts through ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use close reading, discussion, performance, annotation, creative response and evidence-based interpretation to explore ${topic.toLowerCase()}.`],
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
    subject: 'Literature-in-English',
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
        text: `Explore ${spec.subStrand.toLowerCase()} in literature through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Critical thinking and problem solving', 'Communication and collaboration', 'Creativity and innovation', 'Cultural literacy'],
        gesi: ['Use diverse texts and inclusive discussion routines so learners can connect literature to different identities, cultures and experiences.'],
        sel: ['Build empathy, self-expression, responsible dialogue and confidence through interpretation and performance.'],
        values: ['Respect', 'Tolerance', 'Integrity', 'Open-mindedness', 'Responsible citizenship'],
        sourcePages: spec.pages,
        contentStandards: Array.from({ length: csDistribution[index] ?? 0 }, () => {
          csIndex += 1;
          const standardId = `${outcomeId}-cs-${csIndex}`;

          return {
            id: standardId,
            code: `${baseCode}.CS.${csIndex}`,
            text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} in Literature-in-English.`,
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

const generalTopics = ['meaning of literature', 'functions of literature', 'oral literature', 'written literature', 'literary genres'];
const narrativeTopics = ['plot', 'setting', 'characterisation', 'point of view', 'theme', 'narrative technique', 'style'];
const proseAppreciationTopics = ['prose analysis', 'textual evidence', 'themes', 'context', 'character analysis', 'language'];
const narrativeCraftTopics = ['creative prose writing', 'narrative voice', 'plot development', 'character creation', 'editing'];
const dramaElementsTopics = ['plot', 'dialogue', 'character', 'setting', 'conflict', 'stage directions'];
const dramaAppreciationTopics = ['dramatic analysis', 'performance context', 'themes', 'character roles', 'language', 'stagecraft', 'audience response'];
const stageTopics = ['script writing', 'rehearsal', 'staging', 'performance', 'reflection'];
const poeticElementsTopics = ['persona', 'imagery', 'sound devices', 'rhythm', 'diction', 'form'];
const poetryAppreciationTopics = ['poetic analysis', 'theme', 'imagery', 'tone', 'context', 'performance'];
const versePerformanceTopics = ['poetry writing', 'recitation', 'performance', 'revision'];

const strands = {
  exploring: 'Exploring Literature',
  prose: 'Prose',
  drama: 'Drama',
  poetry: 'Poetry',
};

const specs: Spec[] = [
  { id: 'shs1-literature-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: strands.exploring, subStrandCode: '1.1', subStrand: 'General Knowledge in Literature', pages: [23, 29], lo: 2, cs: 2, li: 4, topics: generalTopics },
  { id: 'shs1-literature-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: strands.prose, subStrandCode: '2.1', subStrand: 'Knowing Your Narrative Elements', pages: [30, 36], lo: 3, cs: 2, li: 7, topics: narrativeTopics },
  { id: 'shs1-literature-2.2', year: 1, classLevel: 'SHS1', strandCode: '2', strand: strands.prose, subStrandCode: '2.2', subStrand: 'Appreciation', pages: [37, 39], lo: 1, cs: 1, li: 3, topics: proseAppreciationTopics },
  { id: 'shs1-literature-2.3', year: 1, classLevel: 'SHS1', strandCode: '2', strand: strands.prose, subStrandCode: '2.3', subStrand: 'From Narrative to Craft', pages: [40, 43], lo: 1, cs: 1, li: 4, topics: narrativeCraftTopics },
  { id: 'shs1-literature-3.1', year: 1, classLevel: 'SHS1', strandCode: '3', strand: strands.drama, subStrandCode: '3.1', subStrand: 'Knowing Your Dramatic Elements', pages: [44, 51], lo: 3, cs: 3, li: 6, topics: dramaElementsTopics },
  { id: 'shs1-literature-3.2', year: 1, classLevel: 'SHS1', strandCode: '3', strand: strands.drama, subStrandCode: '3.2', subStrand: 'Appreciation', pages: [52, 57], lo: 2, cs: 2, li: 8, topics: dramaAppreciationTopics },
  { id: 'shs1-literature-3.3', year: 1, classLevel: 'SHS1', strandCode: '3', strand: strands.drama, subStrandCode: '3.3', subStrand: 'From Script to Stage', pages: [58, 62], lo: 2, cs: 1, li: 5, topics: stageTopics },
  { id: 'shs1-literature-4.1', year: 1, classLevel: 'SHS1', strandCode: '4', strand: strands.poetry, subStrandCode: '4.1', subStrand: 'Knowing Your Poetic Elements', pages: [63, 66], lo: 1, cs: 1, li: 2, topics: poeticElementsTopics },
  { id: 'shs1-literature-4.2', year: 1, classLevel: 'SHS1', strandCode: '4', strand: strands.poetry, subStrandCode: '4.2', subStrand: 'Appreciation', pages: [67, 73], lo: 2, cs: 2, li: 4, topics: poetryAppreciationTopics },
  { id: 'shs1-literature-4.3', year: 1, classLevel: 'SHS1', strandCode: '4', strand: strands.poetry, subStrandCode: '4.3', subStrand: 'From Verse to Performance', pages: [74, 78], lo: 1, cs: 1, li: 3, topics: versePerformanceTopics },
  { id: 'shs2-literature-2.1', year: 2, classLevel: 'SHS2', strandCode: '2', strand: strands.prose, subStrandCode: '2.1', subStrand: 'Knowing Your Narrative Elements', pages: [79, 84], lo: 2, cs: 2, li: 6, topics: narrativeTopics },
  { id: 'shs2-literature-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: strands.prose, subStrandCode: '2.2', subStrand: 'Appreciation', pages: [85, 89], lo: 2, cs: 2, li: 5, topics: proseAppreciationTopics },
  { id: 'shs2-literature-2.3', year: 2, classLevel: 'SHS2', strandCode: '2', strand: strands.prose, subStrandCode: '2.3', subStrand: 'From Narrative to Craft', pages: [90, 92], lo: 1, cs: 1, li: 3, topics: narrativeCraftTopics },
  { id: 'shs2-literature-3.1', year: 2, classLevel: 'SHS2', strandCode: '3', strand: strands.drama, subStrandCode: '3.1', subStrand: 'Knowing Your Dramatic Elements', pages: [93, 96], lo: 1, cs: 1, li: 3, topics: dramaElementsTopics },
  { id: 'shs2-literature-3.2', year: 2, classLevel: 'SHS2', strandCode: '3', strand: strands.drama, subStrandCode: '3.2', subStrand: 'Appreciation', pages: [97, 100], lo: 1, cs: 1, li: 4, topics: dramaAppreciationTopics },
  { id: 'shs2-literature-3.3', year: 2, classLevel: 'SHS2', strandCode: '3', strand: strands.drama, subStrandCode: '3.3', subStrand: 'From Script to Stage', pages: [101, 103], lo: 1, cs: 1, li: 2, topics: stageTopics },
  { id: 'shs2-literature-4.1', year: 2, classLevel: 'SHS2', strandCode: '4', strand: strands.poetry, subStrandCode: '4.1', subStrand: 'Knowing Your Poetic Elements', pages: [104, 110], lo: 2, cs: 2, li: 6, topics: poeticElementsTopics },
  { id: 'shs2-literature-4.2', year: 2, classLevel: 'SHS2', strandCode: '4', strand: strands.poetry, subStrandCode: '4.2', subStrand: 'Appreciation', pages: [111, 116], lo: 2, cs: 2, li: 6, topics: poetryAppreciationTopics },
  { id: 'shs2-literature-4.3', year: 2, classLevel: 'SHS2', strandCode: '4', strand: strands.poetry, subStrandCode: '4.3', subStrand: 'From Verse to Performance', pages: [117, 120], lo: 1, cs: 1, li: 2, topics: versePerformanceTopics },
  { id: 'shs3-literature-2.1', year: 3, classLevel: 'SHS3', strandCode: '2', strand: strands.prose, subStrandCode: '2.1', subStrand: 'Knowing Your Narrative Elements', pages: [121, 124], lo: 1, cs: 1, li: 2, topics: narrativeTopics },
  { id: 'shs3-literature-2.2', year: 3, classLevel: 'SHS3', strandCode: '2', strand: strands.prose, subStrandCode: '2.2', subStrand: 'Appreciation', pages: [125, 130], lo: 2, cs: 2, li: 6, topics: proseAppreciationTopics },
  { id: 'shs3-literature-2.3', year: 3, classLevel: 'SHS3', strandCode: '2', strand: strands.prose, subStrandCode: '2.3', subStrand: 'From Narrative to Craft', pages: [131, 134], lo: 1, cs: 1, li: 3, topics: narrativeCraftTopics },
  { id: 'shs3-literature-3.1', year: 3, classLevel: 'SHS3', strandCode: '3', strand: strands.drama, subStrandCode: '3.1', subStrand: 'Knowing Your Dramatic Elements', pages: [135, 138], lo: 1, cs: 1, li: 2, topics: dramaElementsTopics },
  { id: 'shs3-literature-3.2', year: 3, classLevel: 'SHS3', strandCode: '3', strand: strands.drama, subStrandCode: '3.2', subStrand: 'Appreciation', pages: [139, 142], lo: 1, cs: 1, li: 4, topics: dramaAppreciationTopics },
  { id: 'shs3-literature-3.3', year: 3, classLevel: 'SHS3', strandCode: '3', strand: strands.drama, subStrandCode: '3.3', subStrand: 'From Script to Stage', pages: [143, 145], lo: 1, cs: 1, li: 3, topics: stageTopics },
  { id: 'shs3-literature-4.1', year: 3, classLevel: 'SHS3', strandCode: '4', strand: strands.poetry, subStrandCode: '4.1', subStrand: 'Knowing Your Poetic Elements', pages: [146, 148], lo: 1, cs: 1, li: 3, topics: poeticElementsTopics },
  { id: 'shs3-literature-4.2', year: 3, classLevel: 'SHS3', strandCode: '4', strand: strands.poetry, subStrandCode: '4.2', subStrand: 'Appreciation', pages: [149, 152], lo: 1, cs: 1, li: 4, topics: poetryAppreciationTopics },
  { id: 'shs3-literature-4.3', year: 3, classLevel: 'SHS3', strandCode: '4', strand: strands.poetry, subStrandCode: '4.3', subStrand: 'From Verse to Performance', pages: [153, 156], lo: 1, cs: 1, li: 2, topics: versePerformanceTopics },
];

export const literatureInEnglishShs1: ShsSubStrand[] = specs.filter((spec) => spec.year === 1).map(subStrand);
export const literatureInEnglishShs2: ShsSubStrand[] = specs.filter((spec) => spec.year === 2).map(subStrand);
export const literatureInEnglishShs3: ShsSubStrand[] = specs.filter((spec) => spec.year === 3).map(subStrand);

export const literatureInEnglish = [...literatureInEnglishShs1, ...literatureInEnglishShs2, ...literatureInEnglishShs3];
