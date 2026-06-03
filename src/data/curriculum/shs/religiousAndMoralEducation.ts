import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Computers', 'Internet connectivity', 'Textbooks', 'Religious and moral texts', 'Case studies', 'Community resource persons'];

type Spec = {
  id: string;
  year: 1 | 2 | 3;
  classLevel: 'SHS1' | 'SHS2' | 'SHS3';
  strandCode: string;
  strand: string;
  subStrandCode: string;
  subStrand: string;
  code: string;
  outcome: string;
  indicators: string[];
  pages: number[];
  sourcePage: number;
};

function makeIndicator(baseId: string, baseCode: string, text: string, index: number, page: number): ShsLearningIndicator {
  return {
    id: `${baseId}-li-${index}`,
    code: `${baseCode}.LI.${index}`,
    text,
    shortTopic: text,
    pedagogicalExemplars: [`Use think-pair-share, debate, role-play, case study and project work to examine ${text.toLowerCase()}.`],
    assessment: { code: `${baseCode}.AS.${index}`, levels: assessmentLevels },
    resources,
    sourcePage: page,
  };
}

function makeSubStrand(spec: Spec): ShsSubStrand {
  const baseCode = spec.code.replace(/\.LO\.\d+$/, '');
  const outcomeId = `${spec.id}-${baseCode.replaceAll('.', '-')}-lo-1`;

  return {
    id: spec.id,
    subject: 'Religious and Moral Education',
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
        code: spec.code,
        text: spec.outcome,
        skillsAndCompetencies: ['Critical thinking and problem solving', 'Communication and collaboration', 'Creativity and innovation'],
        gesi: ['Use inclusive discussion so learners appreciate diversity of opinions, beliefs and abilities.'],
        sel: ['Support self-reflection, responsible decision-making and healthy relationships.'],
        values: ['Honesty', 'Responsibility', 'Respect', 'Commitment', 'Integrity'],
        sourcePages: spec.pages,
        contentStandards: [
          {
            id: `${outcomeId}-cs-1`,
            code: `${baseCode}.CS.1`,
            text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} in personal and national life.`,
            sourcePage: spec.sourcePage,
            indicators: spec.indicators.map((text, index) => makeIndicator(`${outcomeId}-cs-1`, baseCode, text, index + 1, spec.sourcePage)),
          },
        ],
      },
    ],
  };
}

const specs: Spec[] = [
  {
    id: 'shs1-rme-1.1',
    year: 1,
    classLevel: 'SHS1',
    strandCode: '1',
    strand: 'Work, Time Management and Leisure',
    subStrandCode: '1.1',
    subStrand: 'Work, Ethics and Honesty',
    code: '1.1.1.LO.1',
    outcome: 'Analyse work ethics and honesty as foundations for personal and social development.',
    indicators: ['Explain work, work ethics and honesty.', 'Discuss the importance of honesty and ethical behaviour in work.'],
    pages: [26, 27, 28, 29],
    sourcePage: 28,
  },
  {
    id: 'shs1-rme-2.1',
    year: 1,
    classLevel: 'SHS1',
    strandCode: '2',
    strand: 'Stewardship and Responsibility',
    subStrandCode: '2.1',
    subStrand: 'The Environment and Climate Change',
    code: '1.2.1.LO.1',
    outcome: 'Demonstrate responsibility towards the environment and climate change.',
    indicators: ['Explain stewardship of the environment and climate change.', 'Discuss responsible actions for protecting the environment.'],
    pages: [30, 31, 32, 33],
    sourcePage: 32,
  },
  {
    id: 'shs1-rme-3.1',
    year: 1,
    classLevel: 'SHS1',
    strandCode: '3',
    strand: 'Ghanaian Values',
    subStrandCode: '3.1',
    subStrand: 'Honesty and Nation Building',
    code: '1.3.1.LO.1',
    outcome: 'Evaluate honesty as a value for nation building.',
    indicators: ['Explain honesty as a Ghanaian value.', 'Analyse the role of honesty in nation building.', 'Suggest ways of promoting honesty in Ghana.'],
    pages: [34, 35, 38, 39],
    sourcePage: 38,
  },
  {
    id: 'shs2-rme-1.2',
    year: 2,
    classLevel: 'SHS2',
    strandCode: '1',
    strand: 'Work, Time Management and Leisure',
    subStrandCode: '1.2',
    subStrand: 'Time Management',
    code: '2.1.2.LO.1',
    outcome: 'Develop skills in managing time profitably.',
    indicators: ['Explain time management and its importance.', 'Apply time management skills to school, work and personal life.'],
    pages: [40, 41, 42, 43],
    sourcePage: 42,
  },
  {
    id: 'shs2-rme-2.2',
    year: 2,
    classLevel: 'SHS2',
    strandCode: '2',
    strand: 'Stewardship and Responsibility',
    subStrandCode: '2.2',
    subStrand: 'Responsible Parenting and Parenthood',
    code: '2.2.2.LO.1',
    outcome: 'Analyse responsible parenting and parenthood in society.',
    indicators: ['Explain responsible parenting and parenthood.', 'Discuss responsibilities associated with parenting and parenthood.'],
    pages: [44, 45, 46, 47],
    sourcePage: 46,
  },
  {
    id: 'shs2-rme-3.2',
    year: 2,
    classLevel: 'SHS2',
    strandCode: '3',
    strand: 'Ghanaian Values',
    subStrandCode: '3.2',
    subStrand: 'Character Values',
    code: '2.3.2.LO.1',
    outcome: 'Analyse Ghanaian character values and their relevance to society.',
    indicators: ['Discuss Ghanaian character values.', 'Compare Ghanaian character values with universal values.'],
    pages: [48, 49, 50, 51, 53],
    sourcePage: 50,
  },
  {
    id: 'shs3-rme-1.1',
    year: 3,
    classLevel: 'SHS3',
    strandCode: '1',
    strand: 'Work, Time Management and Leisure',
    subStrandCode: '1.1',
    subStrand: 'Leisure',
    code: '3.1.1.LO.1',
    outcome: 'Assess leisure and its responsible use in personal development.',
    indicators: ['Explain leisure and its importance.', 'Discuss responsible and productive use of leisure.'],
    pages: [54, 55, 56, 57],
    sourcePage: 56,
  },
  {
    id: 'shs3-rme-2.3',
    year: 3,
    classLevel: 'SHS3',
    strandCode: '2',
    strand: 'Stewardship and Responsibility',
    subStrandCode: '2.3',
    subStrand: 'Responsibilities of Young Persons',
    code: '3.2.3.LO.1',
    outcome: 'Analyse responsibilities of young persons in family, school and society.',
    indicators: ['Discuss responsibilities of young persons.', 'Apply responsibilities of young persons to national development.'],
    pages: [58, 59, 60, 61],
    sourcePage: 60,
  },
  {
    id: 'shs3-rme-3.3',
    year: 3,
    classLevel: 'SHS3',
    strandCode: '3',
    strand: 'Ghanaian Values',
    subStrandCode: '3.3',
    subStrand: 'Concern for One Nation',
    code: '3.3.3.LO.1',
    outcome: 'Evaluate concern for one nation as a Ghanaian value.',
    indicators: ['Discuss concern for one nation and civic responsibility.', 'Suggest ways young persons can demonstrate concern for Ghana.'],
    pages: [62, 63, 64, 65],
    sourcePage: 64,
  },
];

export const religiousAndMoralEducationShs1: ShsSubStrand[] = specs.filter((spec) => spec.classLevel === 'SHS1').map(makeSubStrand);
export const religiousAndMoralEducationShs2: ShsSubStrand[] = specs.filter((spec) => spec.classLevel === 'SHS2').map(makeSubStrand);
export const religiousAndMoralEducationShs3: ShsSubStrand[] = specs.filter((spec) => spec.classLevel === 'SHS3').map(makeSubStrand);

export const religiousAndMoralEducation = [
  ...religiousAndMoralEducationShs1,
  ...religiousAndMoralEducationShs2,
  ...religiousAndMoralEducationShs3,
];
