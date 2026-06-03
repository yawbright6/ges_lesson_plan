import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
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
    classLevel: 'SHS3',
    year: 3,
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

export const socialStudiesShs3: ShsSubStrand[] = [
  subStrand('shs3-social-studies-2.1', '2', 'Environment and Sustainability', '2.1', 'Environmental Policies and Laws in Ghana', [88, 89, 90, 91], [
    { code: '3.2.1.LO.1', text: 'Explore key laws and policies on environmental protection in Ghana.', page: 90, li: ['Discuss key environmental laws and policies in Ghana.', 'Analyse the importance of environmental laws and policies.', 'Suggest ways of improving environmental protection in Ghana.'] },
  ]),
  subStrand('shs3-social-studies-3.2', '3', 'Law and Order in the Society', '3.2', 'Wars and Conflicts and Their Implications', [92, 93, 94, 95], [
    { code: '3.3.2.LO.1', text: 'Analyse wars and conflicts and their implications for society.', page: 94, li: ['Examine causes and forms of wars and conflicts.', 'Analyse implications of wars and conflicts for development.'] },
  ]),
  subStrand('shs3-social-studies-3.3', '3', 'Law and Order in the Society', '3.3', 'Legal Frameworks', [96, 97], [
    { code: '3.3.3.LO.1', text: 'Examine legal frameworks that protect rights and regulate society.', page: 96, li: ['Discuss legal frameworks that protect rights in Ghana.', 'Examine how legal frameworks regulate social conduct.'] },
  ]),
  subStrand('shs3-social-studies-4.1', '4', 'Nationalism and Nationhood', '4.1', 'European Encounter, Colonialism and Neo-Colonialism', [98, 99], [
    { code: '3.4.1.LO.1', text: 'Analyse neo-colonialism and its effects on African development.', page: 98, li: ['Explain neo-colonialism in Africa.', 'Analyse effects of neo-colonialism on African development.'] },
  ]),
  subStrand('shs3-social-studies-4.2', '4', 'Nationalism and Nationhood', '4.2', 'Nationalism, Citizenship and Nation-building', [100, 101, 102, 103, 104, 105], [
    { code: '3.4.2.LO.1', text: 'Evaluate citizenship and nation-building in Ghana.', page: 102, li: ['Discuss citizenship and national identity.', 'Analyse civic responsibilities that promote nation-building.'] },
    { code: '3.4.2.LO.2', text: 'Assess democratic governance and participation in nation-building.', page: 102, li: ['Discuss democratic participation in Ghana.', 'Assess ways citizens can contribute to democratic nation-building.'] },
  ]),
  subStrand('shs3-social-studies-5.2', '5', 'Ethics and Human Development', '5.2', 'Ethics and Human Values', [104, 105, 106, 107], [
    { code: '3.5.2.LO.1', text: 'Analyse ethical issues and human values in contemporary society.', page: 106, li: ['Discuss ethical issues in contemporary society.', 'Analyse the role of human values in social development.'] },
  ]),
  subStrand('shs3-social-studies-6.2', '6', 'Production, Exchange and Creativity', '6.2', 'Entrepreneurship, Workplace Culture and Productivity', [106, 107, 108, 109], [
    { code: '3.6.2.LO.1', text: 'Assess entrepreneurship, workplace culture and productivity for national development.', page: 108, li: ['Analyse entrepreneurship and workplace culture.', 'Suggest ways to improve productivity for national development.'] },
  ]),
  subStrand('shs3-social-studies-6.4', '6', 'Production, Exchange and Creativity', '6.4', 'Financial Literacy', [110, 111], [
    { code: '3.6.4.LO.1', text: 'Apply financial literacy to investment, savings and responsible public finance.', page: 110, li: ['Discuss investment, savings and responsible personal finance.', 'Analyse responsible use of public finance.'] },
  ]),
  subStrand('shs3-social-studies-6.6', '6', 'Production, Exchange and Creativity', '6.6', 'Globalisation', [112, 113], [
    { code: '3.6.6.LO.1', text: 'Analyse globalisation and its effects on Ghana and Africa.', page: 112, li: ['Explain globalisation and its dimensions.', 'Analyse positive and negative effects of globalisation on Ghana and Africa.'] },
  ]),
];
