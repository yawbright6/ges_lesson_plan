import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = [
  'Level 1 Recall',
  'Level 2 Skills of conceptual understanding',
  'Level 3 Strategic reasoning',
  'Level 4 Extended critical thinking and reasoning',
];

const resources = ['Maps and atlases', 'Historical sources', 'Case studies', 'Videos and pictures', 'Internet resources', 'Community resource persons'];

type OutcomeSpec = { code: string; text: string; li: string[]; page: number };

function id(value: string): string {
  return value.toLowerCase().replaceAll('.', '-').replaceAll(' ', '-').replace(/[^a-z0-9-]/g, '');
}

function indicator(baseId: string, baseCode: string, text: string, index: number, page: number): ShsLearningIndicator {
  return {
    id: `${baseId}-li-${index}`,
    code: `${baseCode}.LI.${index}`,
    text,
    shortTopic: text,
    pedagogicalExemplars: [`Use inquiry, collaborative discussion and source analysis to investigate ${text.toLowerCase()}.`],
    assessment: { code: `${baseCode}.AS.${index}`, levels: assessmentLevels },
    resources,
    sourcePage: page,
  };
}

function standard(baseId: string, outcome: OutcomeSpec, index: number): ShsContentStandard {
  const baseCode = outcome.code.replace(/\.LO\.\d+$/, '');
  return {
    id: `${baseId}-cs-${index}`,
    code: `${baseCode}.CS.${index}`,
    text: `Demonstrate knowledge and understanding of ${outcome.text.toLowerCase()}.`,
    sourcePage: outcome.page,
    indicators: outcome.li.map((text, liIndex) => indicator(`${baseId}-cs-${index}`, baseCode, text, liIndex + 1, outcome.page)),
  };
}

function subStrand(idValue: string, strandCode: string, strand: string, subStrandCode: string, subStrand: string, pages: number[], outcomes: OutcomeSpec[]): ShsSubStrand {
  return {
    id: idValue,
    subject: 'Social Studies',
    classLevel: 'SHS2',
    year: 2,
    strandCode,
    strand,
    subStrandCode,
    subStrand,
    sourcePages: pages,
    learningOutcomes: outcomes.map((outcome, index) => ({
      id: `${idValue}-${id(outcome.code)}`,
      code: outcome.code,
      text: outcome.text,
      skillsAndCompetencies: ['Critical thinking', 'Communication and collaboration', 'Digital literacy'],
      gesi: ['Use inclusive groups and respect diverse backgrounds while examining society.'],
      sel: ['Practise respectful dialogue, self-awareness and responsible decision-making.'],
      values: ['Tolerance', 'Integrity', 'Responsibility', 'Open-mindedness'],
      sourcePages: pages,
      contentStandards: [standard(`${idValue}-${id(outcome.code)}`, outcome, index + 1)],
    })),
  };
}

export const socialStudiesShs2: ShsSubStrand[] = [
  subStrand('shs2-social-studies-1.2', '1', 'Identity, Significance and Purpose', '1.2', 'Identity and National Cohesion', [52, 53, 54, 55], [
    { code: '2.1.2.LO.1', text: 'Analyse Ghanaian values and traditions that promote national cohesion.', page: 54, li: ['Examine Ghanaian values and traditions that promote national cohesion.', 'Examine false identity and its implications for personal development.', 'Discuss ways of promoting national cohesion in Ghana.'] },
  ]),
  subStrand('shs2-social-studies-2.2', '2', 'Environment and Sustainability', '2.2', 'Environmental Literacy and Sustainability', [56, 57, 58, 59], [
    { code: '2.2.2.LO.1', text: 'Analyse the interdependent relationship between humans and the physical environment and ways of protecting it.', page: 58, li: ['Examine the interdependent relationship between humans and the physical environment.', 'Examine ways of developing responsibility among the youth towards environmental sanitation.'] },
  ]),
  subStrand('shs2-social-studies-3.1', '3', 'Law and Order in the Society', '3.1', 'Law Enforcement Mechanisms in Ghana', [58, 59, 60, 61], [
    { code: '2.3.1.LO.1', text: 'Analyse the need for law enforcement institutions and mechanisms in Ghana.', page: 60, li: ['Discuss institutions mandated to enforce law and order in Ghana.', 'Examine challenges of law enforcement in Ghana and how these challenges can be addressed.'] },
  ]),
  subStrand('shs2-social-studies-4.1', '4', 'Nationalism and Nationhood', '4.1', 'European Encounter, Colonialism and Neo-Colonialism', [62, 63, 64, 65], [
    { code: '2.4.1.LO.1', text: 'Evaluate historical narratives surrounding European exploration and colonialism in Africa.', page: 64, li: ['Discuss European exploration and colonialism from African perspectives.', 'Explain the Scramble for and Partition of Africa and its impact.', 'Analyse forms and legacies of European colonialism and propose solutions to present-day challenges.'] },
  ]),
  subStrand('shs2-social-studies-4.2', '4', 'Nationalism and Nationhood', '4.2', 'Nationalism, Citizenship and Nation Building', [66, 67, 68, 69], [
    { code: '2.4.2.LO.1', text: 'Analyse the origins and impact of Pan-Africanist ideals on decolonisation and nation building.', page: 68, li: ['Examine the origins and impact of Pan-Africanist ideals on decolonisation.', 'Analyse post-independence challenges and suggest solutions informed by Pan-Africanist ideals.'] },
  ]),
  subStrand('shs2-social-studies-5.4', '5', 'Ethics and Human Development', '5.4', 'Leisure and Tourism', [70, 71, 72, 73], [
    { code: '2.5.4.LO.1', text: 'Explore opportunities for leisure and recreation in Ghana and their contribution to development.', page: 72, li: ['Identify opportunities for leisure and recreation in Ghana.', 'Discuss the relevance of leisure and recreation to personal and national development.'] },
  ]),
  subStrand('shs2-social-studies-5.5', '5', 'Ethics and Human Development', '5.5', 'Revolutions that Changed the World', [74, 75], [
    { code: '2.5.5.LO.1', text: 'Analyse the causes and effects of major revolutions that changed the world.', page: 74, li: ['Discuss causes of major world revolutions.', 'Analyse effects of major world revolutions on societies.'] },
  ]),
  subStrand('shs2-social-studies-5.6', '5', 'Ethics and Human Development', '5.6', 'The Youth and National Development', [76, 77, 78, 79], [
    { code: '2.5.6.LO.1', text: 'Examine the role of the youth in national development.', page: 78, li: ['Discuss the role of the youth in national development.', 'Examine challenges that limit youth participation in national development.', 'Propose ways of enhancing youth participation in national development.'] },
  ]),
  subStrand('shs2-social-studies-6.1', '6', 'Production, Exchange and Creativity', '6.1', 'Economic Activities in Ghana', [78, 79, 80, 81], [
    { code: '2.6.1.LO.1', text: 'Analyse economic activities in Ghana and their contribution to development.', page: 80, li: ['Describe major economic activities in Ghana.', 'Analyse the contribution of economic activities to national development.'] },
  ]),
  subStrand('shs2-social-studies-6.2', '6', 'Production, Exchange and Creativity', '6.2', 'Entrepreneurship, Workplace Culture and Productivity', [80, 81, 82, 83], [
    { code: '2.6.2.LO.1', text: 'Analyse entrepreneurship, workplace culture and productivity in Ghana.', page: 82, li: ['Discuss qualities and skills of entrepreneurs.', 'Examine workplace culture and productivity.', 'Analyse ways of improving productivity in the workplace.'] },
  ]),
  subStrand('shs2-social-studies-6.3', '6', 'Production, Exchange and Creativity', '6.3', 'Consumer Rights, Protection and Responsibilities', [84, 85], [
    { code: '2.6.3.LO.1', text: 'Assess consumer rights, protection and responsibilities in Ghana.', page: 84, li: ['Explain consumer rights and responsibilities.', 'Discuss institutions and measures that protect consumers in Ghana.'] },
  ]),
  subStrand('shs2-social-studies-6.4', '6', 'Production, Exchange and Creativity', '6.4', 'Financial Literacy', [86, 87], [
    { code: '2.6.4.LO.1', text: 'Apply financial literacy skills to individual and public financial decisions.', page: 86, li: ['Discuss responsible personal financial management.', 'Examine responsible management of public finances.'] },
  ]),
];
