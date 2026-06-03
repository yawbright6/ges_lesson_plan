import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Computers', 'Internet access', 'Programming environment', 'Network devices', 'Storage devices', 'Web browser'];

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
    text: `Apply computing concepts and practical skills to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use hands-on practice, project-based learning and collaborative troubleshooting to investigate ${topic.toLowerCase()}.`],
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
    subject: 'Computing',
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
        text: `Develop practical competence in ${spec.subStrand.toLowerCase()}.`,
        skillsAndCompetencies: ['Computational thinking', 'Problem solving', 'Creativity and innovation', 'Digital literacy'],
        gesi: ['Use inclusive roles in practical computing tasks so all learners participate in design, coding and evaluation.'],
        sel: ['Build responsible digital citizenship, persistence and constructive collaboration.'],
        values: ['Responsibility', 'Integrity', 'Respect', 'Innovation'],
        sourcePages: spec.pages,
        contentStandards: [
          {
            id: `${outcomeId}-cs-1`,
            code: `${baseCode}.CS.1`,
            text: `Demonstrate knowledge, skills and responsible practice in ${spec.subStrand.toLowerCase()}.`,
            sourcePage: spec.pages.at(-1) ?? spec.pages[0],
            indicators: Array.from({ length: spec.li }, (_, index) => indicator(`${outcomeId}-cs-1`, baseCode, spec.topics[index % spec.topics.length], index + 1, spec.pages.at(-1) ?? spec.pages[0])),
          },
        ],
      },
    ],
  };
}

const shared = {
  strand1: 'Computer Architecture and Organisation',
  strand2: 'Computational Thinking (Programming Logic)',
};

const specs: Spec[] = [
  { id: 'shs1-computing-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: shared.strand1, subStrandCode: '1.1', subStrand: 'Data Storage and Manipulation', pages: [25, 27], li: 4, topics: ['data representation', 'number systems', 'storage units', 'data manipulation'] },
  { id: 'shs1-computing-1.2', year: 1, classLevel: 'SHS1', strandCode: '1', strand: shared.strand1, subStrandCode: '1.2', subStrand: 'Computer Hardware and Software', pages: [29, 31], li: 2, topics: ['computer hardware', 'system and application software'] },
  { id: 'shs1-computing-1.3', year: 1, classLevel: 'SHS1', strandCode: '1', strand: shared.strand1, subStrandCode: '1.3', subStrand: 'Data Communication and Network Systems', pages: [33, 35], li: 3, topics: ['data communication', 'network devices', 'network topologies'] },
  { id: 'shs1-computing-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: shared.strand2, subStrandCode: '2.1', subStrand: 'Algorithm and Data Structure', pages: [37, 39], li: 2, topics: ['algorithm design', 'basic data structures'] },
  { id: 'shs1-computing-2.2', year: 1, classLevel: 'SHS1', strandCode: '2', strand: shared.strand2, subStrandCode: '2.2', subStrand: 'App Development', pages: [41, 43], li: 2, topics: ['app design', 'basic programming constructs'] },
  { id: 'shs1-computing-2.3', year: 1, classLevel: 'SHS1', strandCode: '2', strand: shared.strand2, subStrandCode: '2.3', subStrand: 'Web Technologies', pages: [45, 48], li: 2, topics: ['web page structure', 'HTML and CSS basics'] },
  { id: 'shs2-computing-1.1', year: 2, classLevel: 'SHS2', strandCode: '1', strand: shared.strand1, subStrandCode: '1.1', subStrand: 'Data Storage and Manipulation', pages: [50, 51, 53], li: 3, topics: ['data encoding', 'file organisation', 'data security'] },
  { id: 'shs2-computing-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: shared.strand1, subStrandCode: '1.2', subStrand: 'Computer Hardware and Software', pages: [55, 57], li: 2, topics: ['hardware maintenance', 'software installation and updates'] },
  { id: 'shs2-computing-1.3', year: 2, classLevel: 'SHS2', strandCode: '1', strand: shared.strand1, subStrandCode: '1.3', subStrand: 'Data Communication and Network Systems', pages: [59, 61], li: 3, topics: ['network protocols', 'internet services', 'network safety'] },
  { id: 'shs2-computing-2.1', year: 2, classLevel: 'SHS2', strandCode: '2', strand: shared.strand2, subStrandCode: '2.1', subStrand: 'Algorithm and Data Structure', pages: [63, 65], li: 2, topics: ['search algorithms', 'sorting algorithms'] },
  { id: 'shs2-computing-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: shared.strand2, subStrandCode: '2.2', subStrand: 'App Development', pages: [67, 69], li: 2, topics: ['user interface design', 'event-driven programming'] },
  { id: 'shs2-computing-2.3', year: 2, classLevel: 'SHS2', strandCode: '2', strand: shared.strand2, subStrandCode: '2.3', subStrand: 'Web Technologies and Databases', pages: [71, 75], li: 3, topics: ['dynamic web pages', 'database concepts', 'web database integration'] },
  { id: 'shs3-computing-1.1', year: 3, classLevel: 'SHS3', strandCode: '1', strand: shared.strand1, subStrandCode: '1.1', subStrand: 'Data Storage and Manipulation', pages: [77, 80], li: 3, topics: ['data compression', 'data encryption', 'data recovery'] },
  { id: 'shs3-computing-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: shared.strand1, subStrandCode: '1.2', subStrand: 'Computer Hardware and Software', pages: [82, 83, 84], li: 2, topics: ['computer system performance', 'troubleshooting hardware and software'] },
  { id: 'shs3-computing-1.3', year: 3, classLevel: 'SHS3', strandCode: '1', strand: shared.strand1, subStrandCode: '1.3', subStrand: 'Data Communication and Network Systems', pages: [86, 87, 89], li: 3, topics: ['network administration', 'cybersecurity', 'cloud services'] },
  { id: 'shs3-computing-2.1', year: 3, classLevel: 'SHS3', strandCode: '2', strand: shared.strand2, subStrandCode: '2.1', subStrand: 'Algorithm and Data Structure', pages: [91, 93], li: 1, topics: ['algorithm efficiency'] },
  { id: 'shs3-computing-2.2', year: 3, classLevel: 'SHS3', strandCode: '2', strand: shared.strand2, subStrandCode: '2.2', subStrand: 'App Development', pages: [95, 97], li: 2, topics: ['mobile app development', 'testing and debugging'] },
  { id: 'shs3-computing-2.3', year: 3, classLevel: 'SHS3', strandCode: '2', strand: shared.strand2, subStrandCode: '2.3', subStrand: 'Web Technologies', pages: [99, 103], li: 3, topics: ['responsive web design', 'web hosting', 'web application security'] },
];

export const computingShs1: ShsSubStrand[] = specs.filter((spec) => spec.classLevel === 'SHS1').map(subStrand);
export const computingShs2: ShsSubStrand[] = specs.filter((spec) => spec.classLevel === 'SHS2').map(subStrand);
export const computingShs3: ShsSubStrand[] = specs.filter((spec) => spec.classLevel === 'SHS3').map(subStrand);

export const computing = [...computingShs1, ...computingShs2, ...computingShs3];
