import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Level-appropriate texts', 'Dictionaries', 'Audio recordings', 'Internet resources', 'Writing samples', 'Literary texts'];

type SubSpec = {
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

function makeIndicator(baseId: string, baseCode: string, topic: string, index: number, page: number): ShsLearningIndicator {
  return {
    id: `${baseId}-li-${index}`,
    code: `${baseCode}.LI.${index}`,
    text: `Apply English language skills to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use modelling, guided practice, peer discussion and independent production to develop ${topic.toLowerCase()}.`],
    assessment: { code: `${baseCode}.AS.${index}`, levels: assessmentLevels },
    resources,
    sourcePage: page,
  };
}

function makeSubStrand(spec: SubSpec): ShsSubStrand {
  const liDistribution = splitCount(spec.li, spec.cs);
  const baseCode = `${spec.year}.${spec.strandCode}.${spec.subStrandCode.split('.').at(-1)}`;
  let topicIndex = 0;

  return {
    id: spec.id,
    subject: 'English Language',
    classLevel: spec.classLevel,
    year: spec.year,
    strandCode: spec.strandCode,
    strand: spec.strand,
    subStrandCode: spec.subStrandCode,
    subStrand: spec.subStrand,
    sourcePages: spec.pages,
    learningOutcomes: Array.from({ length: spec.lo }, (_, index) => {
      const loNumber = index + 1;
      const outcomeBaseId = `${spec.id}-${baseCode.replaceAll('.', '-')}-lo-${loNumber}`;
      const hasStandard = index < spec.cs;
      const indicatorsForStandard = hasStandard ? liDistribution[index] : 0;
      const standardCode = `${baseCode}.CS.${loNumber}`;

      return {
        id: outcomeBaseId,
        code: `${baseCode}.LO.${loNumber}`,
        text: `Develop competence in ${spec.subStrand.toLowerCase()} through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Communication and collaboration', 'Critical thinking', 'Creativity', 'Digital literacy'],
        gesi: ['Use inclusive language tasks that value diverse linguistic backgrounds and learner abilities.'],
        sel: ['Build confidence, listen actively and respond respectfully during language activities.'],
        values: ['Respect', 'Integrity', 'Tolerance', 'Responsibility'],
        sourcePages: spec.pages,
        contentStandards: hasStandard
          ? [
              {
                id: `${outcomeBaseId}-cs-${loNumber}`,
                code: standardCode,
                text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} for effective communication.`,
                sourcePage: spec.pages.at(-1) ?? spec.pages[0],
                indicators: Array.from({ length: indicatorsForStandard }, (_, liIndex) => {
                  const topic = spec.topics[topicIndex % spec.topics.length];
                  topicIndex += 1;
                  return makeIndicator(`${outcomeBaseId}-cs-${loNumber}`, baseCode, topic, liIndex + 1, spec.pages.at(-1) ?? spec.pages[0]);
                }),
              } satisfies ShsContentStandard,
            ]
          : [],
      };
    }),
  };
}

const shs1Specs: SubSpec[] = [
  { id: 'shs1-english-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Oral Language', subStrandCode: '1.1', subStrand: 'English Speech Sounds', pages: [25, 27, 28, 29], lo: 1, cs: 1, li: 3, topics: ['vowel sounds', 'consonant sounds', 'stress and intonation'] },
  { id: 'shs1-english-1.2', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Oral Language', subStrandCode: '1.2', subStrand: 'Listening Comprehension', pages: [29, 31], lo: 1, cs: 1, li: 2, topics: ['listening for main ideas', 'listening for details'] },
  { id: 'shs1-english-1.3', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Oral Language', subStrandCode: '1.3', subStrand: 'Conversation/Communication in Context', pages: [33, 34, 35], lo: 1, cs: 1, li: 2, topics: ['conversation strategies', 'contextual communication'] },
  { id: 'shs1-english-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Reading', subStrandCode: '2.1', subStrand: 'Reading Comprehension', pages: [36, 37, 39, 40, 42], lo: 2, cs: 1, li: 3, topics: ['skimming and scanning', 'main ideas', 'inference'] },
  { id: 'shs1-english-2.2', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Reading', subStrandCode: '2.2', subStrand: 'Summarising', pages: [43, 45, 46], lo: 1, cs: 1, li: 2, topics: ['summary skills', 'paraphrasing'] },
  { id: 'shs1-english-3.1', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Grammar Usage', subStrandCode: '3.1', subStrand: 'Grammar', pages: [48, 49, 50, 51, 52, 55, 57, 58, 61, 62], lo: 5, cs: 2, li: 11, topics: ['word classes', 'phrases', 'clauses', 'sentence types', 'tense and aspect', 'agreement', 'modifiers', 'active and passive voice', 'direct and indirect speech', 'common errors', 'sentence variety'] },
  { id: 'shs1-english-3.2', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Grammar Usage', subStrandCode: '3.2', subStrand: 'Vocabulary', pages: [64, 65, 66, 67], lo: 1, cs: 1, li: 2, topics: ['word meaning', 'context clues'] },
  { id: 'shs1-english-3.3', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Grammar Usage', subStrandCode: '3.3', subStrand: 'Punctuation and Capitalization', pages: [67, 69], lo: 1, cs: 1, li: 2, topics: ['punctuation marks', 'capitalisation'] },
  { id: 'shs1-english-4.1', year: 1, classLevel: 'SHS1', strandCode: '4', strand: 'Writing', subStrandCode: '4.1', subStrand: 'Production and Distribution of Text', pages: [70, 71, 73, 76], lo: 2, cs: 2, li: 3, topics: ['writing process', 'drafting and revising', 'editing for publication'] },
  { id: 'shs1-english-4.2', year: 1, classLevel: 'SHS1', strandCode: '4', strand: 'Writing', subStrandCode: '4.2', subStrand: 'Text Types and Purposes', pages: [77, 78, 80, 81, 82, 83, 84], lo: 2, cs: 2, li: 6, topics: ['narrative writing', 'descriptive writing', 'expository writing', 'argumentative writing', 'formal letter writing', 'informal letter writing'] },
  { id: 'shs1-english-4.3', year: 1, classLevel: 'SHS1', strandCode: '4', strand: 'Writing', subStrandCode: '4.3', subStrand: 'Building and Presenting Knowledge', pages: [86, 87, 88, 89], lo: 1, cs: 1, li: 1, topics: ['research presentation'] },
  { id: 'shs1-english-5.1', year: 1, classLevel: 'SHS1', strandCode: '5', strand: 'Literature', subStrandCode: '5.1', subStrand: 'Narrative, Drama, Poetry', pages: [89, 90, 92, 93, 94, 96, 97, 98, 99], lo: 5, cs: 1, li: 6, topics: ['elements of narrative', 'characterisation', 'dramatic techniques', 'themes', 'poetic devices', 'African poetry'] },
];

const shs2Specs: SubSpec[] = [
  { id: 'shs2-english-1.1', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Oral Language', subStrandCode: '1.1', subStrand: 'English Speech Sounds', pages: [100, 101, 103, 104, 105], lo: 2, cs: 1, li: 5, topics: ['vowels and consonants', 'stress patterns', 'intonation patterns', 'connected speech', 'pronunciation in context'] },
  { id: 'shs2-english-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Oral Language', subStrandCode: '1.2', subStrand: 'Listening Comprehension', pages: [107, 109], lo: 1, cs: 1, li: 2, topics: ['listening for argument', 'note-taking from speech'] },
  { id: 'shs2-english-1.3', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Oral Language', subStrandCode: '1.3', subStrand: 'Conversation/Communication', pages: [111, 112, 113], lo: 1, cs: 1, li: 2, topics: ['formal discussion', 'turn-taking'] },
  { id: 'shs2-english-2.1', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Reading', subStrandCode: '2.1', subStrand: 'Reading Comprehension', pages: [114, 115, 116, 117, 118, 119, 120], lo: 1, cs: 1, li: 5, topics: ['explicit meaning', 'implicit meaning', 'text structure', 'writer purpose', 'evaluating ideas'] },
  { id: 'shs2-english-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Reading', subStrandCode: '2.2', subStrand: 'Summarising', pages: [122, 123, 124, 125], lo: 1, cs: 1, li: 1, topics: ['concise summary writing'] },
  { id: 'shs2-english-3.1', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Grammar Usage', subStrandCode: '3.1', subStrand: 'Grammar Usage', pages: [126, 127, 128, 130, 132, 134, 135], lo: 3, cs: 3, li: 6, topics: ['complex sentences', 'subordination', 'coordination', 'modality', 'reported speech', 'grammar accuracy'] },
  { id: 'shs2-english-3.2', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Grammar Usage', subStrandCode: '3.2', subStrand: 'Vocabulary', pages: [136, 137, 138, 139], lo: 1, cs: 1, li: 1, topics: ['vocabulary development'] },
  { id: 'shs2-english-4.1', year: 2, classLevel: 'SHS2', strandCode: '4', strand: 'Writing', subStrandCode: '4.1', subStrand: 'Production and Distribution of Text', pages: [139, 140, 142, 143, 145], lo: 2, cs: 2, li: 3, topics: ['planning writing', 'revising drafts', 'editing for clarity'] },
  { id: 'shs2-english-4.2', year: 2, classLevel: 'SHS2', strandCode: '4', strand: 'Writing', subStrandCode: '4.2', subStrand: 'Text Types and Purposes', pages: [146, 147, 149, 150, 152, 153], lo: 2, cs: 2, li: 5, topics: ['article writing', 'speech writing', 'debate writing', 'report writing', 'argumentative essays'] },
  { id: 'shs2-english-4.3', year: 2, classLevel: 'SHS2', strandCode: '4', strand: 'Writing', subStrandCode: '4.3', subStrand: 'Building and Presenting Knowledge', pages: [154, 155, 156, 157], lo: 1, cs: 1, li: 1, topics: ['research-based writing'] },
  { id: 'shs2-english-5.1', year: 2, classLevel: 'SHS2', strandCode: '5', strand: 'Literature', subStrandCode: '5.1', subStrand: 'Poetry, Narrative and Drama', pages: [158, 159, 160, 161, 162, 163], lo: 4, cs: 2, li: 3, topics: ['poetry analysis', 'narrative technique', 'drama analysis', 'integrated literary response'] },
];

const shs3Specs: SubSpec[] = [
  { id: 'shs3-english-1.1', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Oral Language', subStrandCode: '1.1', subStrand: 'English Speech Sounds', pages: [165, 167, 168, 169], lo: 1, cs: 1, li: 2, topics: ['paralinguistic features', 'stress and intonation'] },
  { id: 'shs3-english-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Oral Language', subStrandCode: '1.2', subStrand: 'Listening Comprehension', pages: [169, 171], lo: 1, cs: 1, li: 2, topics: ['critical listening', 'listening for evaluation'] },
  { id: 'shs3-english-1.3', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Oral Language', subStrandCode: '1.3', subStrand: 'Conversation/Communication', pages: [173, 175], lo: 1, cs: 1, li: 2, topics: ['public speaking', 'discussion etiquette'] },
  { id: 'shs3-english-2.1', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Reading', subStrandCode: '2.1', subStrand: 'Reading Comprehension', pages: [177, 178, 180, 182, 183], lo: 2, cs: 1, li: 3, topics: ['critical reading', 'inference', 'evaluating texts'] },
  { id: 'shs3-english-2.2', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Reading', subStrandCode: '2.2', subStrand: 'Summarising', pages: [184, 185, 186, 187], lo: 1, cs: 1, li: 3, topics: ['summary of arguments', 'synthesis', 'precis writing'] },
  { id: 'shs3-english-3.1', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Grammar Usage', subStrandCode: '3.1', subStrand: 'Grammar', pages: [188, 189, 190, 191, 193, 194, 195, 197, 198, 199], lo: 4, cs: 4, li: 5, topics: ['advanced sentence structures', 'parallelism', 'cohesion', 'grammar accuracy', 'style'] },
  { id: 'shs3-english-3.2', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Grammar Usage', subStrandCode: '3.2', subStrand: 'Vocabulary', pages: [199, 201], lo: 1, cs: 1, li: 2, topics: ['academic vocabulary', 'figurative language'] },
  { id: 'shs3-english-4.1', year: 3, classLevel: 'SHS3', strandCode: '4', strand: 'Writing', subStrandCode: '4.1', subStrand: 'Production and Distribution of Text', pages: [202, 203, 204, 205], lo: 1, cs: 1, li: 1, topics: ['polished writing'] },
  { id: 'shs3-english-4.2', year: 3, classLevel: 'SHS3', strandCode: '4', strand: 'Writing', subStrandCode: '4.2', subStrand: 'Text Types and Purposes', pages: [206, 207, 209, 211], lo: 2, cs: 2, li: 2, topics: ['formal writing', 'argumentative writing'] },
  { id: 'shs3-english-4.3', year: 3, classLevel: 'SHS3', strandCode: '4', strand: 'Writing', subStrandCode: '4.3', subStrand: 'Building and Presenting Knowledge', pages: [212, 213, 214, 215], lo: 1, cs: 1, li: 1, topics: ['knowledge presentation'] },
  { id: 'shs3-english-5.1', year: 3, classLevel: 'SHS3', strandCode: '5', strand: 'Literature', subStrandCode: '5.1', subStrand: 'Narrative, Poetry and Drama', pages: [215, 217], lo: 1, cs: 1, li: 2, topics: ['literary appreciation', 'themes and devices'] },
];

export const englishShs1: ShsSubStrand[] = shs1Specs.map(makeSubStrand);
export const englishShs2: ShsSubStrand[] = shs2Specs.map(makeSubStrand);
export const englishShs3: ShsSubStrand[] = shs3Specs.map(makeSubStrand);

export const english = [...englishShs1, ...englishShs2, ...englishShs3];
