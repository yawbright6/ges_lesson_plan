import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = [
  'Level 1 Recall',
  'Level 2 Skills of conceptual understanding',
  'Level 3 Strategic reasoning',
  'Level 4 Extended critical thinking and reasoning',
];

const resources = [
  'Maps and atlases',
  'Historical sources',
  'Case studies',
  'Videos and pictures',
  'Internet resources',
  'Community resource persons',
];

type OutcomeSpec = {
  code: string;
  text: string;
  li: string[];
  page: number;
};

function makeId(value: string): string {
  return value.toLowerCase().replaceAll('.', '-').replaceAll(' ', '-').replace(/[^a-z0-9-]/g, '');
}

function indicator(baseId: string, baseCode: string, text: string, index: number, page: number): ShsLearningIndicator {
  return {
    id: `${baseId}-li-${index}`,
    code: `${baseCode}.LI.${index}`,
    text,
    shortTopic: text,
    pedagogicalExemplars: [
      `Use inquiry, collaborative discussion and source analysis to investigate ${text.toLowerCase()}.`,
    ],
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

function subStrand(
  id: string,
  strandCode: string,
  strand: string,
  subStrandCode: string,
  subStrand: string,
  pages: number[],
  outcomes: OutcomeSpec[],
): ShsSubStrand {
  return {
    id,
    subject: 'Social Studies',
    classLevel: 'SHS1',
    year: 1,
    strandCode,
    strand,
    subStrandCode,
    subStrand,
    sourcePages: pages,
    learningOutcomes: outcomes.map((outcome, index) => ({
      id: `${id}-${makeId(outcome.code)}`,
      code: outcome.code,
      text: outcome.text,
      skillsAndCompetencies: ['Critical thinking', 'Communication and collaboration', 'Digital literacy'],
      gesi: ['Use inclusive groups and respect diverse backgrounds while examining society.'],
      sel: ['Practise respectful dialogue, self-awareness and responsible decision-making.'],
      values: ['Tolerance', 'Integrity', 'Responsibility', 'Open-mindedness'],
      sourcePages: pages,
      contentStandards: [standard(`${id}-${makeId(outcome.code)}`, outcome, index + 1)],
    })),
  };
}

export const socialStudiesShs1: ShsSubStrand[] = [
  subStrand('shs1-social-studies-1.1', '1', 'Identity, Significance and Purpose', '1.1', 'A Geographical and Historical Sketch of Africa', [26, 27, 28, 29], [
    {
      code: '1.1.1.LO.1',
      text: 'Use maps to describe key geographical features of Africa and how they shaped Africa ancient societies.',
      page: 28,
      li: [
        'Describe key geographical features and resources of Africa using maps.',
        'Analyse how geographical features and ecosystems influenced agriculture, trade networks and settlement patterns in early African societies.',
        'Analyse how climate change influenced the movements and adaptations of early African populations.',
      ],
    },
  ]),
  subStrand('shs1-social-studies-3.4', '3', 'Law and Order in the Society', '3.4', 'Civic Ideals and Practices', [30, 31, 32], [
    {
      code: '1.3.4.LO.1',
      text: 'Analyse the causes and consequences of road accidents in Ghana and propose effective interventions to enhance road safety.',
      page: 30,
      li: [
        'Explain the meaning and importance of road safety in Ghana.',
        'Discuss the causes of road accidents, their socio-economic implications and ways of minimising them.',
        'Describe road signs and markings and their implications for road safety in Ghana.',
        'Discuss institutions responsible for maintaining road safety, their challenges and possible solutions.',
      ],
    },
  ]),
  subStrand('shs1-social-studies-5.1', '5', 'Ethics and Human Development', '5.1', 'Indigenous Knowledge Systems', [32, 33, 34, 35], [
    {
      code: '1.5.1.LO.1',
      text: 'Use historical sources to investigate the development and impact of indigenous technological advancement in Africa.',
      page: 34,
      li: ['Examine indigenous technological advancement and its impact on African societies.'],
    },
  ]),
  subStrand('shs1-social-studies-5.2', '5', 'Ethics and Human Development', '5.2', 'Ethics and Human Values', [34, 35, 36, 37], [
    {
      code: '1.5.2.LO.1',
      text: 'Discuss the relevance of ethics and ethical behaviour in the development of the individual and society.',
      page: 36,
      li: [
        'Examine the place of ethics and ethical behaviour in the development of the individual and society.',
        'Analyse the consequences of unethical behaviour.',
      ],
    },
  ]),
  subStrand('shs1-social-studies-5.3', '5', 'Ethics and Human Development', '5.3', 'Civilisations of Africa', [36, 37, 38, 39], [
    {
      code: '1.5.3.LO.1',
      text: 'Use historical sources to analyse the common features of Ancient African civilisations.',
      page: 38,
      li: ['Examine common features of Ancient African civilisations.'],
    },
    {
      code: '1.5.3.LO.2',
      text: 'Trace the origins, rise and fall of empires in Western Sudan using historical sources.',
      page: 38,
      li: ['Examine the origins, rise and fall of empires in the Western Sudanese region of Africa.'],
    },
  ]),
  subStrand('shs1-social-studies-5.5', '5', 'Ethics and Human Development', '5.5', 'Revolutions that Changed the World', [40, 41, 42, 43], [
    {
      code: '1.5.5.LO.1',
      text: 'Assess the impact of the Industrial Revolution of the eighteenth century on the African continent.',
      page: 42,
      li: ['Examine the Industrial Revolution of the eighteenth century and its impact on Africa.'],
    },
  ]),
  subStrand('shs1-social-studies-6.1', '6', 'Production, Exchange and Creativity', '6.1', 'Economic Activities in Africa', [42, 43, 44, 45], [
    {
      code: '1.6.1.LO.1',
      text: 'Use historical sources to analyse earliest domestic and external forms of trade in Africa.',
      page: 44,
      li: ['Analyse earliest domestic and external forms of trade in Africa.'],
    },
  ]),
  subStrand('shs1-social-studies-6.2', '6', 'Production, Exchange and Creativity', '6.2', 'Entrepreneurship, Workplace Culture and Productivity', [44, 45, 46, 47], [
    {
      code: '1.6.2.LO.1',
      text: 'Analyse the importance of entrepreneurship and its relationship with self-employment.',
      page: 46,
      li: [
        'Explain the importance of entrepreneurship and self-employment.',
        'Analyse similarities and differences between self-employment and entrepreneurship.',
      ],
    },
  ]),
  subStrand('shs1-social-studies-6.3', '6', 'Production, Exchange and Creativity', '6.3', 'Consumer Rights, Protection and Responsibilities', [46, 47, 48, 49], [
    {
      code: '1.6.3.LO.1',
      text: 'Explain the types of consumer rights and the importance of consumer protection.',
      page: 48,
      li: [
        'Discuss types of consumer rights and responsibilities.',
        'Discuss the meaning and importance of consumer protection and how consumers can be protected in Ghana.',
      ],
    },
  ]),
  subStrand('shs1-social-studies-6.4', '6', 'Production, Exchange and Creativity', '6.4', 'Financial Literacy', [48, 49, 50, 51], [
    {
      code: '1.6.4.LO.1',
      text: 'Examine financial literacy and efficient ways of using individual and public finances.',
      page: 50,
      li: [
        'Explain the need to be financially literate.',
        'Examine strategies for ensuring financial security.',
        'Examine ways of ensuring sustainable use of public finances.',
      ],
    },
  ]),
];
