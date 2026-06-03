import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['French texts', 'Audio recordings', 'Dictionaries', 'Conversation cards', 'Videos', 'Internet resources', 'Writing samples'];

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
    text: `Use French listening, speaking, reading and writing skills to communicate about ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use dialogue, role play, listening practice, guided reading and short writing tasks to communicate about ${topic.toLowerCase()}.`],
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
    subject: 'French',
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
        text: `Communicate in French about ${spec.subStrand.toLowerCase()} through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Communication and collaboration', 'Critical thinking and problem solving', 'Intercultural competence', 'Digital literacy'],
        gesi: ['Use inclusive francophone contexts and varied participation roles so learners with different language backgrounds can contribute confidently.'],
        sel: ['Build confidence, respectful listening, empathy and persistence while using French in oral and written interactions.'],
        values: ['Respect', 'Tolerance', 'Open-mindedness', 'Responsibility', 'Good citizenship'],
        sourcePages: spec.pages,
        contentStandards: Array.from({ length: csDistribution[index] ?? 0 }, () => {
          csIndex += 1;
          const standardId = `${outcomeId}-cs-${csIndex}`;

          return {
            id: standardId,
            code: `${baseCode}.CS.${csIndex}`,
            text: `Demonstrate knowledge and understanding of French language functions for ${spec.subStrand.toLowerCase()}.`,
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

const acquaintanceTopics = ['personal identity', 'introducing others', 'nationality', 'family relationships', 'school identity', 'social greetings', 'personal descriptions', 'formal introductions'];
const opinionTopics = ['feelings', 'likes and dislikes', 'preferences', 'agreement and disagreement', 'reasons for opinions', 'emotions', 'courtesy expressions', 'personal judgement'];
const routineTopics = ['daily routine', 'school timetable', 'time expressions', 'household duties', 'weekend plans', 'personal agenda'];
const eventsTopics = ['festivals', 'celebrations', 'public events', 'invitations', 'customs', 'community activities'];
const workTopics = ['occupations', 'workplaces', 'career plans', 'professional qualities', 'job interviews', 'work routines', 'entrepreneurship', 'work safety'];
const healthTopics = ['health problems', 'healthy habits', 'environmental care', 'sanitation', 'medical services', 'pollution'];
const rightsTopics = ['rights and responsibilities', 'democratic participation', 'elections', 'civic duties'];
const servicesTopics = ['social services', 'public offices', 'asking for help', 'community support'];
const timeTopics = ['past events', 'sequence markers', 'future plans', 'biographical events', 'historical dates', 'reported experiences', 'time connectors', 'narration'];
const leisureTopics = ['hobbies', 'sports', 'music', 'games', 'holiday activities'];
const newsTopics = ['news items', 'incidents', 'headlines', 'reported events'];
const relationsTopics = ['neighbouring countries', 'francophone relations', 'cultural exchange', 'international cooperation'];
const literatureTopics = ['short stories', 'poems', 'themes', 'characters', 'reading response', 'oral interpretation', 'creative writing', 'literary appreciation'];
const travelTopics = ['directions', 'transport means', 'travel plans', 'tickets', 'road safety'];
const mediaTopics = ['radio', 'television', 'newspapers', 'announcements', 'media messages'];
const internetTopics = ['internet use', 'online communication', 'digital safety', 'online research'];

const strands = {
  acquaintance: 'Faire Connaissance',
  environment: "Découvrir l'environnement et la vie sociale",
  time: 'Situer les événements dans le temps',
  communication: 'Les moyens de communication et de déplacement',
};

const specs: Spec[] = [
  { id: 'shs1-french-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: strands.acquaintance, subStrandCode: '1.1', subStrand: "Se présenter et présenter quelqu'un", pages: [24, 30], lo: 2, cs: 2, li: 8, topics: acquaintanceTopics },
  { id: 'shs1-french-1.2', year: 1, classLevel: 'SHS1', strandCode: '1', strand: strands.acquaintance, subStrandCode: '1.2', subStrand: 'Exprimer ses sentiments et son opinion', pages: [31, 37], lo: 2, cs: 2, li: 8, topics: opinionTopics },
  { id: 'shs1-french-1.3', year: 1, classLevel: 'SHS1', strandCode: '1', strand: strands.acquaintance, subStrandCode: '1.3', subStrand: 'Parler de ses activités journalières et de son agenda', pages: [38, 41], lo: 1, cs: 1, li: 4, topics: routineTopics },
  { id: 'shs1-french-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: strands.environment, subStrandCode: '2.1', subStrand: 'Parler des évènements et des fêtes', pages: [42, 45], lo: 1, cs: 1, li: 4, topics: eventsTopics },
  { id: 'shs1-french-2.2', year: 1, classLevel: 'SHS1', strandCode: '2', strand: strands.environment, subStrandCode: '2.2', subStrand: 'Parler du monde de travail', pages: [46, 53], lo: 2, cs: 2, li: 8, topics: workTopics },
  { id: 'shs1-french-2.3', year: 1, classLevel: 'SHS1', strandCode: '2', strand: strands.environment, subStrandCode: '2.3', subStrand: "Parler de la santé et d'environnement", pages: [54, 57], lo: 1, cs: 1, li: 4, topics: healthTopics },
  { id: 'shs1-french-3.1', year: 1, classLevel: 'SHS1', strandCode: '3', strand: strands.time, subStrandCode: '3.1', subStrand: 'Situer des faits dans le temps', pages: [58, 65], lo: 2, cs: 2, li: 8, topics: timeTopics },
  { id: 'shs1-french-3.2', year: 1, classLevel: 'SHS1', strandCode: '3', strand: strands.time, subStrandCode: '3.2', subStrand: 'Parler de ses loisirs et de ses passe-temps', pages: [66, 69], lo: 1, cs: 1, li: 4, topics: leisureTopics },
  { id: 'shs1-french-3.4', year: 1, classLevel: 'SHS1', strandCode: '3', strand: strands.time, subStrandCode: '3.4', subStrand: 'Parler des relations entre son pays et les autres', pages: [70, 73], lo: 1, cs: 1, li: 4, topics: relationsTopics },
  { id: 'shs1-french-3.5', year: 1, classLevel: 'SHS1', strandCode: '3', strand: strands.time, subStrandCode: '3.5', subStrand: 'Découvrir la littérature', pages: [74, 80], lo: 2, cs: 2, li: 8, topics: literatureTopics },
  { id: 'shs1-french-4.1', year: 1, classLevel: 'SHS1', strandCode: '4', strand: strands.communication, subStrandCode: '4.1', subStrand: 'Parler de déplacement', pages: [81, 84], lo: 1, cs: 1, li: 4, topics: travelTopics },
  { id: 'shs1-french-4.2', year: 1, classLevel: 'SHS1', strandCode: '4', strand: strands.communication, subStrandCode: '4.2', subStrand: 'Parler des médias', pages: [85, 89], lo: 1, cs: 1, li: 4, topics: mediaTopics },
  { id: 'shs2-french-1.1', year: 2, classLevel: 'SHS2', strandCode: '1', strand: strands.acquaintance, subStrandCode: '1.1', subStrand: "Se présenter et présenter quelqu'un", pages: [90, 93], lo: 1, cs: 1, li: 4, topics: acquaintanceTopics },
  { id: 'shs2-french-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: strands.acquaintance, subStrandCode: '1.2', subStrand: 'Exprimer ses sentiments et son opinion', pages: [94, 100], lo: 2, cs: 2, li: 8, topics: opinionTopics },
  { id: 'shs2-french-2.1', year: 2, classLevel: 'SHS2', strandCode: '2', strand: strands.environment, subStrandCode: '2.1', subStrand: 'Parler des évènements et des fêtes', pages: [101, 104], lo: 1, cs: 1, li: 4, topics: eventsTopics },
  { id: 'shs2-french-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: strands.environment, subStrandCode: '2.2', subStrand: 'Parler du monde de travail', pages: [105, 121], lo: 4, cs: 4, li: 16, topics: workTopics },
  { id: 'shs2-french-2.3', year: 2, classLevel: 'SHS2', strandCode: '2', strand: strands.environment, subStrandCode: '2.3', subStrand: "Parler de la santé et d'environnement", pages: [122, 126], lo: 1, cs: 1, li: 4, topics: healthTopics },
  { id: 'shs2-french-2.4', year: 2, classLevel: 'SHS2', strandCode: '2', strand: strands.environment, subStrandCode: '2.4', subStrand: "S'exprimer sur ses droits et les processus démocratiques", pages: [127, 131], lo: 1, cs: 1, li: 4, topics: rightsTopics },
  { id: 'shs2-french-2.5', year: 2, classLevel: 'SHS2', strandCode: '2', strand: strands.environment, subStrandCode: '2.5', subStrand: 'Parler des services sociaux', pages: [132, 135], lo: 1, cs: 1, li: 4, topics: servicesTopics },
  { id: 'shs2-french-3.1', year: 2, classLevel: 'SHS2', strandCode: '3', strand: strands.time, subStrandCode: '3.1', subStrand: 'Situer des faits dans le temps', pages: [136, 144], lo: 2, cs: 2, li: 8, topics: timeTopics },
  { id: 'shs2-french-3.2', year: 2, classLevel: 'SHS2', strandCode: '3', strand: strands.time, subStrandCode: '3.2', subStrand: 'Parler de ses loisirs et de ses passe-temps', pages: [145, 148], lo: 1, cs: 1, li: 4, topics: leisureTopics },
  { id: 'shs2-french-3.4', year: 2, classLevel: 'SHS2', strandCode: '3', strand: strands.time, subStrandCode: '3.4', subStrand: 'Parler des relations entre son pays et les autres', pages: [149, 152], lo: 1, cs: 1, li: 4, topics: relationsTopics },
  { id: 'shs2-french-3.5', year: 2, classLevel: 'SHS2', strandCode: '3', strand: strands.time, subStrandCode: '3.5', subStrand: 'Découvrir la littérature', pages: [153, 159], lo: 2, cs: 2, li: 8, topics: literatureTopics },
  { id: 'shs2-french-4.2', year: 2, classLevel: 'SHS2', strandCode: '4', strand: strands.communication, subStrandCode: '4.2', subStrand: 'Parler des médias', pages: [160, 163], lo: 1, cs: 1, li: 4, topics: mediaTopics },
  { id: 'shs2-french-4.3', year: 2, classLevel: 'SHS2', strandCode: '4', strand: strands.communication, subStrandCode: '4.3', subStrand: "Parler d'Internet", pages: [164, 171], lo: 1, cs: 1, li: 4, topics: internetTopics },
  { id: 'shs3-french-1.3', year: 3, classLevel: 'SHS3', strandCode: '1', strand: strands.acquaintance, subStrandCode: '1.3', subStrand: 'Parler de ses activités journalières et de son agenda', pages: [172, 175], lo: 1, cs: 1, li: 4, topics: routineTopics },
  { id: 'shs3-french-2.2', year: 3, classLevel: 'SHS3', strandCode: '2', strand: strands.environment, subStrandCode: '2.2', subStrand: 'Parler du monde de travail', pages: [176, 183], lo: 2, cs: 2, li: 8, topics: workTopics },
  { id: 'shs3-french-2.3', year: 3, classLevel: 'SHS3', strandCode: '2', strand: strands.environment, subStrandCode: '2.3', subStrand: "Parler de la santé et d'environnement", pages: [184, 187], lo: 1, cs: 1, li: 4, topics: healthTopics },
  { id: 'shs3-french-2.4', year: 3, classLevel: 'SHS3', strandCode: '2', strand: strands.environment, subStrandCode: '2.4', subStrand: "S'exprimer sur ses droits et les processus démocratiques", pages: [188, 191], lo: 1, cs: 1, li: 4, topics: rightsTopics },
  { id: 'shs3-french-2.5', year: 3, classLevel: 'SHS3', strandCode: '2', strand: strands.environment, subStrandCode: '2.5', subStrand: 'Parler des services sociaux', pages: [192, 195], lo: 1, cs: 1, li: 4, topics: servicesTopics },
  { id: 'shs3-french-3.1', year: 3, classLevel: 'SHS3', strandCode: '3', strand: strands.time, subStrandCode: '3.1', subStrand: 'Situer des faits dans le temps', pages: [196, 199], lo: 1, cs: 1, li: 4, topics: newsTopics },
  { id: 'shs3-french-3.3', year: 3, classLevel: 'SHS3', strandCode: '3', strand: strands.time, subStrandCode: '3.3', subStrand: 'Parler des faits divers', pages: [196, 199], lo: 1, cs: 1, li: 4, topics: newsTopics },
  { id: 'shs3-french-3.5', year: 3, classLevel: 'SHS3', strandCode: '3', strand: strands.time, subStrandCode: '3.5', subStrand: 'Découvrir la littérature', pages: [200, 207], lo: 3, cs: 3, li: 5, topics: literatureTopics },
  { id: 'shs3-french-4.1', year: 3, classLevel: 'SHS3', strandCode: '4', strand: strands.communication, subStrandCode: '4.1', subStrand: 'Parler de déplacement', pages: [208, 211], lo: 1, cs: 1, li: 4, topics: travelTopics },
  { id: 'shs3-french-4.3', year: 3, classLevel: 'SHS3', strandCode: '4', strand: strands.communication, subStrandCode: '4.3', subStrand: "Parler d'Internet", pages: [212, 214], lo: 1, cs: 1, li: 4, topics: internetTopics },
];

export const frenchShs1: ShsSubStrand[] = specs.filter((spec) => spec.year === 1).map(subStrand);
export const frenchShs2: ShsSubStrand[] = specs.filter((spec) => spec.year === 2).map(subStrand);
export const frenchShs3: ShsSubStrand[] = specs.filter((spec) => spec.year === 3).map(subStrand);

export const french = [...frenchShs1, ...frenchShs2, ...frenchShs3];
