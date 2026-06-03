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
    classLevel: 'SHS1',
    year: 1,
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

export const biologyShs1: ShsSubStrand[] = [
  sub('shs1-biology-1.1', '1', 'Exploring Biology in Society', '1.1', 'Biology as the Science of Life', [24, 25, 26, 27, 29, 30, 31, 32, 33], [
    { code: '1.1.1.LO.1', text: 'Explain the importance of Biology and its branches and relate this to everyday life.', page: 29, li: ['Explain Biology, its branches and everyday applications.'] },
    { code: '1.1.1.LO.2', text: 'Solve everyday problems using the scientific method.', page: 30, li: ['Use the scientific method to investigate and solve everyday problems.'] },
    { code: '1.1.1.LO.3', text: 'Apply biological laboratory skills and safety rules during investigations.', page: 31, li: ['Describe laboratory apparatus, safety rules and responsible conduct in biological investigations.'] },
    { code: '1.1.1.LO.4', text: 'Use biological drawings and measurements to communicate observations.', page: 32, li: ['Prepare accurate biological drawings and record observations.', 'Use measurements and magnification to communicate biological observations.'] },
  ]),
  sub('shs1-biology-1.2', '1', 'Exploring Biology in Society', '1.2', 'Biology and Entrepreneurship', [33, 35, 36, 37], [
    { code: '1.1.2.LO.1', text: 'Explore Biology-related entrepreneurial opportunities for improving livelihoods.', page: 35, li: ['Identify Biology-related entrepreneurial opportunities.', 'Explain how biological knowledge can support enterprise development.', 'Design a simple Biology-based product or service idea.'] },
  ]),
  sub('shs1-biology-2.1', '2', 'Life in the Fundamental Unit', '2.1', 'Movement of Substances in Living Organisms', [37, 38, 39], [
    { code: '1.2.1.LO.1', text: 'Explain movement of substances in living organisms.', page: 38, li: ['Explain diffusion and osmosis in living organisms.', 'Investigate factors affecting diffusion and osmosis.', 'Relate movement of substances to survival of organisms.'] },
  ]),
  sub('shs1-biology-3.1', '3', 'Diversity of Living Things and Their Environment', '3.1', 'Living Organisms', [40, 41, 43, 44, 45], [
    { code: '1.3.1.LO.1', text: 'Classify living organisms and describe their characteristic features.', page: 43, li: ['Classify living organisms using observable characteristics.'] },
    { code: '1.3.1.LO.2', text: 'Describe life processes of selected organisms.', page: 44, li: ['Describe life processes of selected organisms.'] },
    { code: '1.3.1.LO.3', text: 'Relate features of selected organisms to their economic importance.', page: 45, li: ['Discuss the economic importance of selected organisms.'] },
  ]),
  sub('shs1-biology-3.2', '3', 'Diversity of Living Things and Their Environment', '3.2', 'Ecology', [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57], [
    { code: '1.3.2.LO.1', text: 'Explain basic ecological concepts and relationships.', page: 50, li: ['Explain ecological terms and concepts.', 'Describe relationships among organisms in ecosystems.'] },
    { code: '1.3.2.LO.2', text: 'Describe the structure and function of ecosystems.', page: 52, li: ['Describe components of ecosystems.', 'Explain energy flow and nutrient cycling in ecosystems.'] },
    { code: '1.3.2.LO.3', text: 'Analyse ecological factors that affect populations.', page: 54, li: ['Analyse ecological factors that affect population size and distribution.'] },
    { code: '1.3.2.LO.4', text: 'Explain conservation and sustainable use of natural resources.', page: 55, li: ['Discuss conservation and sustainable use of natural resources.'] },
    { code: '1.3.2.LO.5', text: 'Investigate human impacts on ecosystems.', page: 56, li: ['Investigate human activities that affect ecosystems.'] },
  ]),
  sub('shs1-biology-3.3', '3', 'Diversity of Living Things and Their Environment', '3.3', 'Diseases and Infections', [57, 58, 59], [
    { code: '1.3.3.LO.1', text: 'Explain common diseases and infections and how they are prevented.', page: 58, li: ['Discuss common diseases, infections and prevention methods.'] },
  ]),
  sub('shs1-biology-4.1', '4', 'Systems of Life', '4.1', 'Mammalian Systems', [59, 60, 61], [
    { code: '1.4.1.LO.1', text: 'Explain how selected mammalian systems function to maintain life.', page: 60, li: ['Describe selected mammalian systems and their functions.', 'Relate mammalian systems to healthy living.'] },
  ]),
  sub('shs1-biology-4.2', '4', 'Systems of Life', '4.2', 'Plant Systems', [61, 62, 63], [
    { code: '1.4.2.LO.1', text: 'Explain selected plant systems and their importance.', page: 62, li: ['Describe selected plant systems and their functions.', 'Explain transport in plants.', 'Relate plant systems to growth and survival.'] },
  ]),
];
