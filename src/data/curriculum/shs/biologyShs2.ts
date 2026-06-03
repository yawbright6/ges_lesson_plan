import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Appropriate textbooks', 'Internet resources', 'Charts and models', 'Laboratory apparatus', 'Videos and pictures', 'Field specimens'];
type OutcomeSpec = { code: string; text: string; li: string[]; page: number; overview?: boolean };

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
    classLevel: 'SHS2',
    year: 2,
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
      contentStandards: outcome.overview ? [] : [cs(`${id}-${key(outcome.code)}`, outcome, index + 1)],
    })),
  };
}

export const biologyShs2: ShsSubStrand[] = [
  sub('shs2-biology-1.1', '1', 'Exploring Biology in Society', '1.1', 'Biology as the Science of Life', [65, 66, 67], [
    { code: '2.1.1.LO.1', text: 'Apply biological knowledge and skills to improve life and the environment.', page: 66, li: ['Discuss applications of Biology in society.', 'Relate biological knowledge to solving environmental and health problems.'] },
  ]),
  sub('shs2-biology-1.2', '1', 'Exploring Biology in Society', '1.2', 'Biology and Entrepreneurship', [67, 68, 69], [
    { code: '2.1.2.LO.1', text: 'Develop Biology-related enterprise ideas that respond to community needs.', page: 68, li: ['Identify community needs that can be addressed through Biology.', 'Prepare a simple plan for a Biology-related enterprise.'] },
  ]),
  sub('shs2-biology-2.1', '2', 'Life in the Fundamental Unit', '2.1', 'Cell Structure and Functions', [69, 70, 71, 72, 73], [
    { code: '2.2.1.LO.1', text: 'Explain the structure and functions of cellular components.', page: 70, li: ['Describe cellular structures and their functions.'] },
    { code: '2.2.1.LO.2', text: 'Explain cell organisation and specialised cell functions.', page: 72, li: ['Describe specialised cells and their functions.', 'Compare plant and animal cells.', 'Explain how cells are organised into tissues and organs.', 'Relate cell structure to function.', 'Use microscopes and diagrams to study cells.'] },
  ]),
  sub('shs2-biology-3.1', '3', 'Diversity of Living Things and Their Environment', '3.1', 'Living Organisms', [74, 75, 76, 77], [
    { code: '2.3.1.LO.1', text: 'Describe life processes of selected higher organisms.', page: 76, li: ['Describe characteristic features of selected higher organisms.', 'Discuss economic importance of selected higher organisms.'] },
    { code: '2.3.1.LO.2', text: 'Compare adaptations of selected organisms.', page: 76, li: ['Compare adaptations of selected organisms.', 'Relate adaptations to survival.'] },
    { code: '2.3.1.LO.3', text: 'Investigate habitats of selected organisms.', page: 77, li: ['Investigate habitats and behaviours of selected organisms.', 'Present findings from field or virtual observations.'] },
    { code: '2.3.1.LO.4', text: 'Summarise organism diversity using classification evidence.', page: 77, overview: true, li: [] },
  ]),
  sub('shs2-biology-3.2', '3', 'Diversity of Living Things and Their Environment', '3.2', 'Ecology', [78, 79, 80, 81], [
    { code: '2.3.2.LO.1', text: 'Explain tropical habitats and how organisms are adapted to them.', page: 80, li: ['Describe features of major tropical habitats.', 'Describe how common tropical organisms are adapted to their habitats.'] },
  ]),
  sub('shs2-biology-3.3', '3', 'Diversity of Living Things and Their Environment', '3.3', 'Diseases and Infections', [81, 82, 83], [
    { code: '2.3.3.LO.1', text: 'Explain immunisation, vaccination and inoculation and state their importance.', page: 82, li: ['Explain immunisation, vaccination and inoculation.', 'Discuss the importance of immunisation, vaccination and inoculation.'] },
  ]),
  sub('shs2-biology-4.1', '4', 'Systems of Life', '4.1', 'Mammalian Systems', [83, 84, 85], [
    { code: '2.4.1.LO.1', text: 'Explain how the cardiovascular and excretory systems ensure good health.', page: 84, li: ['Discuss the cardiovascular system and its functions.', 'Discuss the excretory system and its role in homeostasis.'] },
  ]),
  sub('shs2-biology-4.2', '4', 'Systems of Life', '4.2', 'Plant Systems', [86, 87], [
    { code: '2.4.2.LO.1', text: 'Explain transportation and photosynthesis in flowering plants.', page: 87, li: ['Explain transportation in flowering plants.', 'Explain photosynthesis and factors affecting it.'] },
  ]),
];
