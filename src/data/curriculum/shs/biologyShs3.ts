import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Appropriate textbooks', 'Internet resources', 'Charts and models', 'Laboratory apparatus', 'Videos and pictures', 'Field specimens'];
type OutcomeSpec = { code: string; text: string; li: string[]; page: number };

function key(value: string): string {
  return value.toLowerCase().replaceAll('.', '-').replaceAll(' ', '-').replace(/[^a-z0-9-]/g, '');
}

function li(baseId: string, baseCode: string, text: string, index: number, page: number): ShsLearningIndicator {
  return {
    id: `${baseId}-li-${index}`,
    code: `${baseCode}.LI.${index}`,
    text,
    shortTopic: text,
    pedagogicalExemplars: [`Use observation, practical investigation and collaborative discussion to learn ${text.toLowerCase()}.`],
    assessment: { code: `${baseCode}.AS.${index}`, levels: assessmentLevels },
    resources,
    sourcePage: page,
  };
}

function cs(baseId: string, outcome: OutcomeSpec, index: number): ShsContentStandard {
  const baseCode = outcome.code.replace(/\.LO\.\d+$/, '');
  return {
    id: `${baseId}-cs-${index}`,
    code: `${baseCode}.CS.${index}`,
    text: `Demonstrate knowledge and understanding of ${outcome.text.toLowerCase()}.`,
    sourcePage: outcome.page,
    indicators: outcome.li.map((text, liIndex) => li(`${baseId}-cs-${index}`, baseCode, text, liIndex + 1, outcome.page)),
  };
}

function sub(id: string, strandCode: string, strand: string, subStrandCode: string, subStrand: string, pages: number[], outcomes: OutcomeSpec[]): ShsSubStrand {
  return {
    id,
    subject: 'Biology',
    classLevel: 'SHS3',
    year: 3,
    strandCode,
    strand,
    subStrandCode,
    subStrand,
    sourcePages: pages,
    learningOutcomes: outcomes.map((outcome, index) => ({
      id: `${id}-${key(outcome.code)}`,
      code: outcome.code,
      text: outcome.text,
      skillsAndCompetencies: ['Communication and collaboration', 'Critical thinking and problem solving', 'Digital literacy'],
      gesi: ['Respect individuals of different backgrounds and practise inclusion in practical group work.'],
      sel: ['Build confidence, listen to peers and express disagreement constructively.'],
      values: ['Respect', 'Integrity', 'Selflessness', 'Perseverance'],
      sourcePages: pages,
      contentStandards: [cs(`${id}-${key(outcome.code)}`, outcome, index + 1)],
    })),
  };
}

export const biologyShs3: ShsSubStrand[] = [
  sub('shs3-biology-1.2', '1', 'Exploring Biology in Society', '1.2', 'Biology and Entrepreneurship', [90, 91, 92, 93], [
    { code: '3.1.2.LO.1', text: 'Apply biotechnology knowledge and skills to enhance products that improve human life and the environment.', page: 91, li: ['Explain basic concepts in biotechnology.', 'Describe tissue culture and its application in food production.', 'Describe recombinant DNA technology and production of GMOs.', 'Describe biological applications in water treatment, mineral extraction and bio-oil production.'] },
  ]),
  sub('shs3-biology-2.1', '2', 'Life in the Fundamental Unit', '2.1', 'Cell Structure and Functions', [94, 95, 96, 97, 98, 99, 100, 101, 102, 103], [
    { code: '3.2.1.LO.1', text: 'Explain key terms in Genetics and their applications.', page: 98, li: ['Explain the application of key terminologies in Genetics.'] },
    { code: '3.2.1.LO.2', text: 'Relate Mendel laws and concepts of inheritance to human blood groups and their importance.', page: 99, li: ['Explain Mendel laws and concepts of inheritance.', 'Discuss the importance of blood group and Rhesus factor classification.'] },
    { code: '3.2.1.LO.3', text: 'Explain variation, its causes, processes and consequences in life.', page: 100, li: ['Explain the concept, causes and consequences of variation.', 'Describe applications of variation among humans to improve life.'] },
    { code: '3.2.1.LO.4', text: 'Explain evolution and the factors leading to its occurrence in nature.', page: 102, li: ['Explain evolution and factors that lead to its occurrence.'] },
    { code: '3.2.1.LO.5', text: 'Explain the cell cycle, cell division and their relevance in living things.', page: 103, li: ['Explain the cell cycle and cell division in living things.'] },
  ]),
  sub('shs3-biology-3.1', '3', 'Diversity of Living Things and Their Environment', '3.1', 'Living Organisms', [104, 105, 106, 107], [
    { code: '3.3.1.LO.1', text: 'Relate features and life processes of tilapia, toad, wall gecko and domestic fowl to their economic importance.', page: 106, li: ['Describe features and life processes of selected organisms.', 'Discuss economic importance of tilapia, frog, wall gecko and domestic fowl.'] },
  ]),
  sub('shs3-biology-3.2', '3', 'Diversity of Living Things and Their Environment', '3.2', 'Ecology', [107, 108, 109, 110, 111], [
    { code: '3.3.2.LO.1', text: 'Explain interdependencies of living things and their environment.', page: 109, li: ['Explain interactions between living and non-living components.', 'Explain interdependency of living things and its importance to life.'] },
    { code: '3.3.2.LO.2', text: 'Collect and analyse ecological data, draw valid conclusions and inferences.', page: 110, li: ['Collect, organise and analyse ecological data.', 'Draw valid conclusions and inferences from analysed data.'] },
  ]),
  sub('shs3-biology-3.3', '3', 'Diversity of Living Things and Their Environment', '3.3', 'Diseases and Infections', [111, 112, 113], [
    { code: '3.3.3.LO.1', text: 'Examine emerging diseases and infections and suggest prevention methods.', page: 112, li: ['Discuss emerging human diseases and prevention methods.', 'Research plant and animal diseases and suggest ways to prevent their spread.'] },
  ]),
  sub('shs3-biology-4.1', '4', 'Systems of Life', '4.1', 'Mammalian Systems', [114, 115, 116, 117], [
    { code: '3.4.1.LO.1', text: 'Explain how mammalian respiratory, reproductive, musculoskeletal, nervous and hormonal systems work together for healthy living.', page: 115, li: ['Describe the mammalian respiratory system and its functions.', 'Describe the reproductive system in mammals.', 'Describe the musculoskeletal system in mammals.', 'Describe nervous and hormonal coordination in mammals.'] },
  ]),
  sub('shs3-biology-4.2', '4', 'Systems of Life', '4.2', 'Plant Systems', [118, 119, 120], [
    { code: '3.4.2.LO.1', text: 'Describe reproduction and excretion and relate them to their importance in flowering plants.', page: 119, li: ['Describe reproduction in flowering plants.', 'Discuss the importance of reproduction in flowering plants.', 'Discuss excretion in flowering plants.', 'Relate excretion and reproduction to plant survival.'] },
  ]),
];
