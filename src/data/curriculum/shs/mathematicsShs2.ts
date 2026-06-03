import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = [
  'Level 1 Recall',
  'Level 2 Skills of conceptual understanding',
  'Level 3 Strategic reasoning',
  'Level 4 Extended critical thinking and reasoning',
];

const resources = ['GeoGebra', 'Graph sheets', 'Scientific calculator', 'Grid paper', 'Models', 'Algebraic tiles', 'Computer or mobile technology'];

function li(base: string, code: string, as: string, text: string, topic: string, page: number): ShsLearningIndicator {
  return {
    id: `${base}-${code.toLowerCase().replaceAll('.', '-')}`,
    code,
    text,
    shortTopic: topic,
    pedagogicalExemplars: [`Use collaborative, problem-based and technology-supported activities to explore ${topic.toLowerCase()} and solve related real-life problems.`],
    assessment: { code: as, levels: assessmentLevels },
    resources,
    sourcePage: page,
  };
}

function cs(base: string, code: string, text: string, page: number, indicators: ShsLearningIndicator[]): ShsContentStandard {
  return { id: `${base}-${code.toLowerCase().replaceAll('.', '-')}`, code, text, sourcePage: page, indicators };
}

export const mathematicsShs2: ShsSubStrand[] = [
  {
    id: 'shs2-mathematics-1.1',
    subject: 'Mathematics',
    classLevel: 'SHS2',
    year: 2,
    strandCode: '1',
    strand: 'Numbers for Everyday Life',
    subStrandCode: '1.1',
    subStrand: 'Real Number and Numeration System',
    sourcePages: [158, 159, 166, 167, 168, 171, 173],
    learningOutcomes: [
      { id: 'shs2-mathematics-2.1.1-lo-1', code: '2.1.1.LO.1', text: 'Apply surds, indices and logarithms to solve real-life problems.', skillsAndCompetencies: ['Strategic competency', 'Critical thinking'], gesi: ['Use mixed-ability and gender-responsive groups.'], values: ['Tolerance', 'Truth and integrity'], sourcePages: [158, 166, 167, 168], contentStandards: [
        cs('shs2-mathematics-2.1.1-lo-1', '2.1.1.CS.1', 'Demonstrate understanding of surds, indices and logarithms and their laws.', 166, [
          li('shs2-mathematics-2.1.1-cs-1', '2.1.1.LI.1', '2.1.1.AS.1', 'Demonstrate knowledge and understanding of surds, indices and logarithms and establish their laws and properties.', 'Surds, indices and logarithm laws', 166),
          li('shs2-mathematics-2.1.1-cs-1', '2.1.1.LI.2', '2.1.1.AS.2', 'Explain the concepts of indices and logarithms with examples.', 'Concepts of indices and logarithms', 167),
          li('shs2-mathematics-2.1.1-cs-1', '2.1.1.LI.3', '2.1.1.AS.3', 'Compose and decompose logarithm laws and properties with exponents and apply the concepts to solve real-life problems.', 'Logarithm laws and exponents', 168),
        ]),
      ] },
      { id: 'shs2-mathematics-2.1.1-lo-2', code: '2.1.1.LO.2', text: 'Use surds, indices and logarithms in scientific and real-life applications.', skillsAndCompetencies: ['Mathematical connections', 'Problem solving'], sourcePages: [171], contentStandards: [
        cs('shs2-mathematics-2.1.1-lo-2', '2.1.1.CS.2', 'Apply laws and properties of indices and logarithms to real-life and scientific contexts.', 171, [
          li('shs2-mathematics-2.1.1-cs-2', '2.1.1.LI.1', '2.1.1.AS.1', 'Demonstrate knowledge and understanding of the laws and properties of indices and logarithms and their applications to real-life problems.', 'Applications of indices and logarithms', 171),
          li('shs2-mathematics-2.1.1-cs-2', '2.1.1.LI.2', '2.1.1.AS.2', 'Use mathematical connections to explore the relevance of surds, indices and logarithms and their applications to scientific concepts.', 'Surds, indices and logarithms in science', 171),
        ]),
      ] },
      { id: 'shs2-mathematics-2.1.1-lo-3', code: '2.1.1.LO.3', text: 'Apply modular arithmetic to real-life problems.', skillsAndCompetencies: ['Logical reasoning', 'Problem solving'], sourcePages: [173], contentStandards: [
        cs('shs2-mathematics-2.1.1-lo-3', '2.1.1.CS.3', 'Demonstrate understanding of modulo arithmetic and its applications.', 173, [
          li('shs2-mathematics-2.1.1-cs-3', '2.1.1.LI.1', '2.1.1.AS.1', 'Demonstrate understanding of modulo arithmetic and solve real-life problems on them.', 'Modulo arithmetic', 173),
          li('shs2-mathematics-2.1.1-cs-3', '2.1.1.LI.2', '2.1.1.AS.2', 'Model and solve real-life problems involving modular arithmetic.', 'Modelling with modular arithmetic', 173),
        ]),
      ] },
    ],
  },
  {
    id: 'shs2-mathematics-1.2',
    subject: 'Mathematics',
    classLevel: 'SHS2',
    year: 2,
    strandCode: '1',
    strand: 'Numbers for Everyday Life',
    subStrandCode: '1.2',
    subStrand: 'Proportional Reasoning',
    sourcePages: [176, 177, 182, 183, 185],
    learningOutcomes: [
      { id: 'shs2-mathematics-2.1.2-lo-1', code: '2.1.2.LO.1', text: 'Use ratios, rates and proportions to solve real-world problems.', skillsAndCompetencies: ['Proportional reasoning'], sourcePages: [176, 182, 183], contentStandards: [
        cs('shs2-mathematics-2.1.2-lo-1', '2.1.2.CS.1', 'Demonstrate understanding of ratios, rates and proportions.', 182, [
          li('shs2-mathematics-2.1.2-cs-1', '2.1.2.LI.1', '2.1.2.AS.1', 'Demonstrate knowledge and understanding of ratios, rates and proportions and use it to solve real-world problems.', 'Ratios, rates and proportions', 182),
          li('shs2-mathematics-2.1.2-cs-1', '2.1.2.LI.2', '2.1.2.AS.2', 'Establish the relationships among ratio, rates and proportions.', 'Relationships among ratio, rates and proportions', 183),
        ]),
      ] },
      { id: 'shs2-mathematics-2.1.2-lo-2', code: '2.1.2.LO.2', text: 'Apply proportional reasoning to finance and real-life contexts.', skillsAndCompetencies: ['Financial literacy'], sourcePages: [185], contentStandards: [
        cs('shs2-mathematics-2.1.2-lo-2', '2.1.2.CS.2', 'Apply mathematical connections among ratios, rates and proportions to solve daily problems.', 185, [
          li('shs2-mathematics-2.1.2-cs-2', '2.1.2.LI.1', '2.1.2.AS.1', 'Demonstrate understanding of proportional reasoning using mathematical connections among ratios, rates and proportions to solve daily problems including compound interest and tax.', 'Proportional reasoning in finance', 185),
          li('shs2-mathematics-2.1.2-cs-2', '2.1.2.LI.2', '2.1.2.AS.2', 'Establish the relevance of ratios, rates and proportions in day-to-day activities and apply them to solve real-world problems.', 'Daily applications of ratios and proportions', 185),
        ]),
      ] },
    ],
  },
  {
    id: 'shs2-mathematics-2.1',
    subject: 'Mathematics',
    classLevel: 'SHS2',
    year: 2,
    strandCode: '2',
    strand: 'Algebraic Reasoning',
    subStrandCode: '2.1',
    subStrand: 'Applications of Expressions, Equations and Inequalities',
    sourcePages: [187, 193, 196, 198],
    learningOutcomes: [
      { id: 'shs2-mathematics-2.2.1-lo-1', code: '2.2.1.LO.1', text: 'Solve simultaneous linear equations and related word problems.', skillsAndCompetencies: ['Algebraic modelling'], sourcePages: [187, 193, 196, 198], contentStandards: [
        cs('shs2-mathematics-2.2.1-lo-1', '2.2.1.CS.1', 'Demonstrate understanding of simultaneous equations involving two variables.', 193, [
          li('shs2-mathematics-2.2.1-cs-1', '2.2.1.LI.1', '2.2.1.AS.1', 'Demonstrate knowledge and understanding of simultaneous equations involving two variables and apply them to everyday-life problems.', 'Simultaneous equations in two variables', 193),
          li('shs2-mathematics-2.2.1-cs-1', '2.2.1.LI.2', '2.2.1.AS.2', 'Analyse two linear equations in two variables and solve them using elimination and substitution methods.', 'Elimination and substitution methods', 196),
          li('shs2-mathematics-2.2.1-cs-1', '2.2.1.LI.3', '2.2.1.AS.3', 'Analyse, model and solve word problems of simultaneous linear equations involving numbers and age.', 'Word problems with simultaneous equations', 198),
          li('shs2-mathematics-2.2.1-cs-1', '2.2.1.LI.4', '2.2.1.AS.4', 'Apply simultaneous linear equations to contextual decision-making problems.', 'Applications of simultaneous equations', 198),
        ]),
      ] },
      { id: 'shs2-mathematics-2.2.1-lo-2', code: '2.2.1.LO.2', text: 'Model real-life situations using linear equations in two variables.', skillsAndCompetencies: ['Mathematical modelling'], contentStandards: [], sourcePages: [187, 198] },
    ],
  },
  {
    id: 'shs2-mathematics-2.2',
    subject: 'Mathematics',
    classLevel: 'SHS2',
    year: 2,
    strandCode: '2',
    strand: 'Algebraic Reasoning',
    subStrandCode: '2.2',
    subStrand: 'Patterns and Relations',
    sourcePages: [200, 201, 203, 204, 205, 207, 208],
    learningOutcomes: [
      { id: 'shs2-mathematics-2.2.2-lo-1', code: '2.2.2.LO.1', text: 'Use sequence and series to model and solve real-life problems.', skillsAndCompetencies: ['Pattern recognition', 'Financial mathematics'], sourcePages: [200, 203, 204, 205, 207, 208], contentStandards: [
        cs('shs2-mathematics-2.2.2-lo-1', '2.2.2.CS.1', 'Demonstrate understanding of patterns, relations, sequence and series.', 203, [
          li('shs2-mathematics-2.2.2-cs-1', '2.2.2.LI.1', '2.2.2.AS.1', 'Demonstrate understanding of patterns and relations involving sequence and series, generate strategies for algebraic formulas and solve real-life problems.', 'Sequence and series', 203),
          li('shs2-mathematics-2.2.2-cs-1', '2.2.2.LI.2', '2.2.2.AS.2', 'Recognise and find the nth term and the sum of the nth term of an arithmetic progression.', 'Arithmetic progression', 204),
          li('shs2-mathematics-2.2.2-cs-1', '2.2.2.LI.3', '2.2.2.AS.3', 'Identify geometric progression or exponential sequence and find the algebraic expression for the general term.', 'Geometric progression', 205),
          li('shs2-mathematics-2.2.2-cs-1', '2.2.2.LI.4', '2.2.2.AS.4', 'Analyse, model and solve real-life problems involving financial mathematics.', 'Financial mathematics with sequences', 207),
          li('shs2-mathematics-2.2.2-cs-1', '2.2.2.LI.5', '2.2.2.AS.5', 'Analyse, model and solve real-life problems involving exponential growth.', 'Exponential growth', 208),
        ]),
      ] },
    ],
  },
  {
    id: 'shs2-mathematics-3.1',
    subject: 'Mathematics',
    classLevel: 'SHS2',
    year: 2,
    strandCode: '3',
    strand: 'Geometry Around Us',
    subStrandCode: '3.1',
    subStrand: 'Spatial Sense',
    sourcePages: [209, 213, 218, 223, 227],
    learningOutcomes: [
      { id: 'shs2-mathematics-2.3.1-lo-1', code: '2.3.1.LO.1', text: 'Apply transformations to analyse spatial relationships.', skillsAndCompetencies: ['Spatial reasoning'], sourcePages: [209, 213, 218, 223, 227], contentStandards: [
        cs('shs2-mathematics-2.3.1-lo-1', '2.3.1.CS.1', 'Demonstrate understanding of transformations and invariance.', 213, [
          li('shs2-mathematics-2.3.1-cs-1', '2.3.1.LI.1', '2.3.1.AS.1', 'Demonstrate conceptual understanding of spatial sense regarding transformations, reflection, translation and rotation.', 'Transformations and invariance', 213),
          li('shs2-mathematics-2.3.1-cs-1', '2.3.1.LI.2', '2.3.1.AS.2', 'Identify and explain reflection of an object in a mirror line and describe image points in a reflection.', 'Reflection in a mirror line', 218),
          li('shs2-mathematics-2.3.1-cs-1', '2.3.1.LI.3', '2.3.1.AS.3', 'Identify shapes with rotational symmetry and show the image after rotation about the origin or a point.', 'Rotational symmetry and rotation', 223),
          li('shs2-mathematics-2.3.1-cs-1', '2.3.1.LI.4', '2.3.1.AS.4', 'Carry out an enlargement of a plane shape given a scale factor.', 'Enlargement of plane shapes', 227),
        ]),
      ] },
    ],
  },
  {
    id: 'shs2-mathematics-3.2',
    subject: 'Mathematics',
    classLevel: 'SHS2',
    year: 2,
    strandCode: '3',
    strand: 'Geometry Around Us',
    subStrandCode: '3.2',
    subStrand: 'Measurement',
    sourcePages: [231, 239, 243, 244, 246, 248, 252, 258, 263],
    learningOutcomes: [
      { id: 'shs2-mathematics-2.3.2-lo-1', code: '2.3.2.LO.1', text: 'Use operations on bearings and vectors to solve problems.', skillsAndCompetencies: ['Vector reasoning'], sourcePages: [231, 239, 243, 244], contentStandards: [
        cs('shs2-mathematics-2.3.2-lo-1', '2.3.2.CS.1', 'Demonstrate understanding of measurement with respect to operations on bearings and vectors.', 239, [
          li('shs2-mathematics-2.3.2-cs-1', '2.3.2.LI.1', '2.3.2.AS.1', 'Perform addition, subtraction and scalar multiplication on vectors represented geometrically and algebraically.', 'Operations on vectors', 239),
          li('shs2-mathematics-2.3.2-cs-1', '2.3.2.LI.2', '2.3.2.AS.2', 'Determine properties of operations on vectors through investigation with and without technology.', 'Properties of vector operations', 243),
          li('shs2-mathematics-2.3.2-cs-1', '2.3.2.LI.3', '2.3.2.AS.3', 'Solve problems involving addition, subtraction and scalar multiplication of vectors, including real-world applications.', 'Vector problem solving', 244),
        ]),
      ] },
      { id: 'shs2-mathematics-2.3.2-lo-2', code: '2.3.2.LO.2', text: 'Use inverse trigonometric ratios and angles of elevation/depression to calculate distances and heights.', skillsAndCompetencies: ['Trigonometric reasoning'], sourcePages: [246, 248], contentStandards: [
        cs('shs2-mathematics-2.3.2-lo-2', '2.3.2.CS.2', 'Demonstrate understanding of inverse trigonometric ratios and angles of elevation and depression.', 246, [
          li('shs2-mathematics-2.3.2-cs-2', '2.3.2.LI.1', '2.3.2.AS.1', 'Demonstrate understanding of inverse trigonometric ratios and angles of elevation/depression and apply them to calculate distances and heights.', 'Inverse trigonometry and elevation/depression', 246),
          li('shs2-mathematics-2.3.2-cs-2', '2.3.2.LI.2', '2.3.2.AS.2', 'Solve real-life problems involving angles of elevation and depression and identify everyday situations of these concepts.', 'Angles of elevation and depression', 248),
        ]),
      ] },
      { id: 'shs2-mathematics-2.3.2-lo-3', code: '2.3.2.LO.3', text: 'Solve surface area, volume and capacity problems involving solid shapes.', skillsAndCompetencies: ['Measurement reasoning'], sourcePages: [252, 258, 263], contentStandards: [
        cs('shs2-mathematics-2.3.2-lo-3', '2.3.2.CS.3', 'Demonstrate understanding of surface area, volume and capacity of solid shapes.', 252, [
          li('shs2-mathematics-2.3.2-cs-3', '2.3.2.LI.1', '2.3.2.AS.1', 'Demonstrate conceptual understanding of measurement of surface area, volume and capacity of solid shapes.', 'Surface area, volume and capacity', 252),
          li('shs2-mathematics-2.3.2-cs-3', '2.3.2.LI.2', '2.3.2.AS.2', 'Solve problems involving SI and imperial units in volume and capacity measurements.', 'Volume and capacity units', 258),
          li('shs2-mathematics-2.3.2-cs-3', '2.3.2.LI.3', '2.3.2.AS.3', 'Solve real-world problems involving the volume/capacity of a 3D object.', 'Real-world volume and capacity', 263),
        ]),
      ] },
    ],
  },
  {
    id: 'shs2-mathematics-4.1',
    subject: 'Mathematics',
    classLevel: 'SHS2',
    year: 2,
    strandCode: '4',
    strand: 'Making Sense of and Using Data',
    subStrandCode: '4.1',
    subStrand: 'Statistical Reasoning and Its Application in Real Life',
    sourcePages: [266, 274, 275, 277, 283, 288, 290, 291],
    learningOutcomes: [
      { id: 'shs2-mathematics-2.4.1-lo-1', code: '2.4.1.LO.1', text: 'Design and validate data collection instruments.', skillsAndCompetencies: ['Statistical reasoning'], sourcePages: [266, 274, 275], contentStandards: [
        cs('shs2-mathematics-2.4.1-lo-1', '2.4.1.CS.1', 'Demonstrate understanding of data handling in relation to designing and validating data collection methods.', 274, [
          li('shs2-mathematics-2.4.1-cs-1', '2.4.1.LI.1', '2.4.1.AS.1', 'Design a data collection instrument such as questionnaire, interview guide or observation schedule.', 'Designing data collection instruments', 274),
          li('shs2-mathematics-2.4.1-cs-1', '2.4.1.LI.2', '2.4.1.AS.2', 'Evaluate a data set or instrument by identifying potential problems related to bias, language, gender, ethics, cost, time and privacy.', 'Evaluating data instruments', 275),
        ]),
      ] },
      { id: 'shs2-mathematics-2.4.1-lo-2', code: '2.4.1.LO.2', text: 'Use measures of dispersion to analyse grouped and ungrouped data.', skillsAndCompetencies: ['Data analysis'], sourcePages: [277, 283, 288], contentStandards: [
        cs('shs2-mathematics-2.4.1-lo-2', '2.4.1.CS.2', 'Demonstrate understanding of data presentations and analysis for grouped and ungrouped data.', 277, [
          li('shs2-mathematics-2.4.1-cs-2', '2.4.1.LI.1', '2.4.1.AS.1', 'Organise, present and analyse grouped and ungrouped data and describe relationships among measures of dispersion.', 'Measures of dispersion', 277),
          li('shs2-mathematics-2.4.1-cs-2', '2.4.1.LI.2', '2.4.1.AS.2', 'Analyse and interpret data using measures of dispersion and justify the most suitable measures.', 'Interpreting dispersion', 283),
          li('shs2-mathematics-2.4.1-cs-2', '2.4.1.LI.3', '2.4.1.AS.3', 'Use mathematical arguments to evaluate and make inferences from data in everyday life.', 'Inferences from data', 288),
        ]),
      ] },
      { id: 'shs2-mathematics-2.4.1-lo-3', code: '2.4.1.LO.3', text: 'Carry out and present a data project beyond the school environment.', skillsAndCompetencies: ['Project work', 'Presentation'], sourcePages: [290, 291], contentStandards: [
        cs('shs2-mathematics-2.4.1-lo-3', '2.4.1.CS.3', 'Demonstrate ability to carry out a mini-project beyond the school environment.', 290, [
          li('shs2-mathematics-2.4.1-cs-3', '2.4.1.LI.1', '2.4.1.AS.1', 'Carry out a mini-project involving collection, analysis and interpretation of quantitative and qualitative data beyond school.', 'Community data project', 290),
          li('shs2-mathematics-2.4.1-cs-3', '2.4.1.LI.2', '2.4.1.AS.2', 'Present a project report using PowerPoint, infographics or media platforms.', 'Presenting a community data project', 291),
        ]),
      ] },
    ],
  },
  {
    id: 'shs2-mathematics-4.2',
    subject: 'Mathematics',
    classLevel: 'SHS2',
    year: 2,
    strandCode: '4',
    strand: 'Making Sense of and Using Data',
    subStrandCode: '4.2',
    subStrand: 'Probability/Chance',
    sourcePages: [292, 296, 297, 298, 299],
    learningOutcomes: [
      { id: 'shs2-mathematics-2.4.2-lo-1', code: '2.4.2.LO.1', text: 'Use probability experiments involving dependent events to solve everyday-life problems.', skillsAndCompetencies: ['Probability reasoning'], sourcePages: [292, 296, 297, 298], contentStandards: [
        cs('shs2-mathematics-2.4.2-lo-1', '2.4.2.CS.1', 'Demonstrate understanding of simple and compound probability experiments involving dependent events.', 296, [
          li('shs2-mathematics-2.4.2-cs-1', '2.4.2.LI.1', '2.4.2.AS.1', 'Demonstrate conceptual understanding of simple and compound probability experiments involving two dependent events.', 'Dependent-event probability experiments', 296),
          li('shs2-mathematics-2.4.2-cs-1', '2.4.2.LI.2', '2.4.2.AS.2', 'Solve everyday-life problems involving probability of dependent events.', 'Solving dependent-event probability problems', 298),
        ]),
      ] },
    ],
  },
];

