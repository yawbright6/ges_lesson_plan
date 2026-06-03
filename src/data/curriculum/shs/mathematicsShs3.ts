import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = [
  'Level 1 Recall',
  'Level 2 Skills of conceptual understanding',
  'Level 3 Strategic reasoning',
  'Level 4 Extended critical thinking and reasoning',
];

const resources = ['GeoGebra', 'Graph sheets', 'Mathematical sets', 'Scientific calculator', 'Grid paper', 'Models', 'Computer or mobile technology'];

function li(base: string, code: string, as: string, text: string, topic: string, page: number): ShsLearningIndicator {
  return {
    id: `${base}-${code.toLowerCase().replaceAll('.', '-')}`,
    code,
    text,
    shortTopic: topic,
    pedagogicalExemplars: [`Use collaborative, investigative and technology-supported activities to explore ${topic.toLowerCase()} and solve related real-life problems.`],
    assessment: { code: as, levels: assessmentLevels },
    resources,
    sourcePage: page,
  };
}

function cs(base: string, code: string, text: string, page: number, indicators: ShsLearningIndicator[]): ShsContentStandard {
  return { id: `${base}-${code.toLowerCase().replaceAll('.', '-')}`, code, text, sourcePage: page, indicators };
}

export const mathematicsShs3: ShsSubStrand[] = [
  {
    id: 'shs3-mathematics-1.2',
    subject: 'Mathematics',
    classLevel: 'SHS3',
    year: 3,
    strandCode: '1',
    strand: 'Numbers for Everyday Life',
    subStrandCode: '1.2',
    subStrand: 'Proportional Reasoning',
    sourcePages: [300, 301, 305, 308, 309],
    learningOutcomes: [
      { id: 'shs3-mathematics-3.1.2-lo-1', code: '3.1.2.LO.1', text: 'Use logical reasoning to establish valid arguments and solve real-life problems.', skillsAndCompetencies: ['Logical reasoning', 'Critical thinking'], sourcePages: [300, 305], contentStandards: [
        cs('shs3-mathematics-3.1.2-lo-1', '3.1.2.CS.1', 'Demonstrate conceptual understanding of logical reasoning.', 305, [
          li('shs3-mathematics-3.1.2-cs-1', '3.1.2.LI.1', '3.1.2.AS.1', 'Demonstrate conceptual understanding of logical reasoning to solve real-life problems.', 'Logical reasoning', 305),
          li('shs3-mathematics-3.1.2-cs-1', '3.1.2.LI.2', '3.1.2.AS.2', 'Make intelligent guesses to establish valid arguments and draw logical conclusions.', 'Valid arguments and logical conclusions', 305),
        ]),
      ] },
      { id: 'shs3-mathematics-3.1.2-lo-2', code: '3.1.2.LO.2', text: 'Use proportional reasoning in variation and community investigations.', skillsAndCompetencies: ['Proportional reasoning', 'Investigation'], sourcePages: [308, 309], contentStandards: [
        cs('shs3-mathematics-3.1.2-lo-2', '3.1.2.CS.2', 'Demonstrate conceptual understanding of proportionality and variation.', 308, [
          li('shs3-mathematics-3.1.2-cs-2', '3.1.2.LI.1', '3.1.2.AS.1', 'Demonstrate conceptual understanding of proportionality in relation to variation and use it to solve real-life problems.', 'Proportionality and variation', 308),
          li('shs3-mathematics-3.1.2-cs-2', '3.1.2.LI.2', '3.1.2.AS.2', 'Use proportional reasoning to investigate joint and partial variation and extend this to make generalisations.', 'Joint and partial variation', 308),
        ]),
      ] },
    ],
  },
  {
    id: 'shs3-mathematics-2.2',
    subject: 'Mathematics',
    classLevel: 'SHS3',
    year: 3,
    strandCode: '2',
    strand: 'Algebraic Reasoning',
    subStrandCode: '2.2',
    subStrand: 'Patterns and Relations',
    sourcePages: [311, 314, 315, 316, 317, 319, 321],
    learningOutcomes: [
      { id: 'shs3-mathematics-3.2.2-lo-1', code: '3.2.2.LO.1', text: 'Use quadratic functions, equations and graphs to solve real-life problems.', skillsAndCompetencies: ['Algebraic modelling', 'Graphical reasoning'], sourcePages: [311, 314, 316, 319, 321], contentStandards: [
        cs('shs3-mathematics-3.2.2-lo-1', '3.2.2.CS.1', 'Demonstrate understanding of quadratic functions and equations.', 314, [
          li('shs3-mathematics-3.2.2-cs-1', '3.2.2.LI.1', '3.2.2.AS.1', 'Demonstrate understanding of quadratic functions and equations and solve real-life problems with them.', 'Quadratic functions and equations', 314),
          li('shs3-mathematics-3.2.2-cs-1', '3.2.2.LI.2', '3.2.2.AS.2', 'Solve quadratic equations graphically and find maximum and minimum points of quadratic graphs.', 'Quadratic graphs and turning points', 316),
          li('shs3-mathematics-3.2.2-cs-1', '3.2.2.LI.3', '3.2.2.AS.3', 'Identify and explain axis of symmetry, write its equation and solve linear and quadratic equations simultaneously using graphs.', 'Axis of symmetry and graphical solutions', 319),
        ]),
      ] },
    ],
  },
  {
    id: 'shs3-mathematics-3.1',
    subject: 'Mathematics',
    classLevel: 'SHS3',
    year: 3,
    strandCode: '3',
    strand: 'Geometry Around Us',
    subStrandCode: '3.1',
    subStrand: 'Spatial Sense',
    sourcePages: [323, 329, 334, 339, 343, 347, 348, 351],
    learningOutcomes: [
      { id: 'shs3-mathematics-3.3.1-lo-1', code: '3.3.1.LO.1', text: 'Use circle theorems to solve geometry problems.', skillsAndCompetencies: ['Spatial reasoning', 'Proof'], sourcePages: [323, 329, 334, 339, 343], contentStandards: [
        cs('shs3-mathematics-3.3.1-lo-1', '3.3.1.CS.1', 'Demonstrate conceptual understanding of circles and circle theorems.', 329, [
          li('shs3-mathematics-3.3.1-cs-1', '3.3.1.LI.1', '3.3.1.AS.1', 'Demonstrate conceptual understanding of spatial sense with respect to circles and their theorems.', 'Circles and circle theorems', 329),
          li('shs3-mathematics-3.3.1-cs-1', '3.3.1.LI.2', '3.3.1.AS.2', 'Discuss circle theorems by identifying statements, proofs, examples and applications.', 'Statements and proofs of circle theorems', 334),
          li('shs3-mathematics-3.3.1-cs-1', '3.3.1.LI.3', '3.3.1.AS.3', 'Identify the tangent as perpendicular to the radius at the point of contact and verify the Alternate Segment Theorem.', 'Tangent-radius and alternate segment theorem', 339),
          li('shs3-mathematics-3.3.1-cs-1', '3.3.1.LI.4', '3.3.1.AS.4', 'Verify that tangents drawn from an external point to the same circle are equal from their points of contact.', 'Equal tangents from an external point', 343),
        ]),
      ] },
      { id: 'shs3-mathematics-3.3.1-lo-2', code: '3.3.1.LO.2', text: 'Use geometrical construction to construct plane shapes and loci.', skillsAndCompetencies: ['Construction', 'Precision'], sourcePages: [347, 348, 351], contentStandards: [
        cs('shs3-mathematics-3.3.1-lo-2', '3.3.1.CS.2', 'Demonstrate knowledge and understanding of geometrical construction.', 347, [
          li('shs3-mathematics-3.3.1-cs-2', '3.3.1.LI.1', '3.3.1.AS.1', 'Demonstrate knowledge and understanding of geometrical construction and apply it to construct plane shapes.', 'Geometrical construction', 347),
          li('shs3-mathematics-3.3.1-cs-2', '3.3.1.LI.2', '3.3.1.AS.2', 'Construct a triangle or quadrilateral under given conditions.', 'Constructing triangles and quadrilaterals', 348),
          li('shs3-mathematics-3.3.1-cs-2', '3.3.1.LI.3', '3.3.1.AS.3', 'Construct a particular locus for a given condition.', 'Loci construction', 351),
        ]),
      ] },
    ],
  },
  {
    id: 'shs3-mathematics-3.2',
    subject: 'Mathematics',
    classLevel: 'SHS3',
    year: 3,
    strandCode: '3',
    strand: 'Geometry Around Us',
    subStrandCode: '3.2',
    subStrand: 'Measurement',
    sourcePages: [355, 358, 359, 367],
    learningOutcomes: [
      { id: 'shs3-mathematics-3.3.2-lo-1', code: '3.3.2.LO.1', text: 'Use trigonometric graphs to solve trigonometric equations and determine equations.', skillsAndCompetencies: ['Trigonometric graphing'], sourcePages: [355, 358, 367], contentStandards: [
        cs('shs3-mathematics-3.3.2-lo-1', '3.3.2.CS.1', 'Demonstrate conceptual understanding of trigonometric graphs.', 358, [
          li('shs3-mathematics-3.3.2-cs-1', '3.3.2.LI.1', '3.3.2.AS.1', 'Demonstrate conceptual understanding of trigonometric graphs and use them to solve trigonometric equations.', 'Trigonometric graphs and equations', 358),
          li('shs3-mathematics-3.3.2-cs-1', '3.3.2.LI.2', '3.3.2.AS.2', 'Use trigonometric graphs to determine equations.', 'Determining equations from trigonometric graphs', 367),
        ]),
      ] },
    ],
  },
  {
    id: 'shs3-mathematics-4.1',
    subject: 'Mathematics',
    classLevel: 'SHS3',
    year: 3,
    strandCode: '4',
    strand: 'Making Sense of and Using Data',
    subStrandCode: '4.1',
    subStrand: 'Statistical Reasoning and Its Application in Real Life',
    sourcePages: [368, 369, 371, 373, 375, 378, 379],
    learningOutcomes: [
      { id: 'shs3-mathematics-3.4.1-lo-1', code: '3.4.1.LO.1', text: 'Use bivariate data to establish relationships and make inferences.', skillsAndCompetencies: ['Bivariate data analysis'], sourcePages: [368, 371, 373], contentStandards: [
        cs('shs3-mathematics-3.4.1-lo-1', '3.4.1.CS.1', 'Demonstrate understanding of bivariate data in observational and experimental contexts.', 371, [
          li('shs3-mathematics-3.4.1-cs-1', '3.4.1.LI.1', '3.4.1.AS.1', 'Demonstrate understanding of data handling involving simple mathematical relationships of bivariate data.', 'Bivariate data relationships', 371),
          li('shs3-mathematics-3.4.1-cs-1', '3.4.1.LI.2', '3.4.1.AS.2', 'Collect data from an experimental study with treatment and control groups and illustrate the data using scatter graphs.', 'Experimental data and scatter graphs', 373),
        ]),
      ] },
      { id: 'shs3-mathematics-3.4.1-lo-2', code: '3.4.1.LO.2', text: 'Compare data sets and discuss published data information.', skillsAndCompetencies: ['Data interpretation', 'Media literacy'], sourcePages: [375, 378, 379], contentStandards: [
        cs('shs3-mathematics-3.4.1-lo-2', '3.4.1.CS.2', 'Demonstrate ability to compare data sets and make inferences from published data.', 375, [
          li('shs3-mathematics-3.4.1-cs-2', '3.4.1.LI.1', '3.4.1.AS.1', 'Compare different data sets and use appropriate vocabulary to make inferences about information.', 'Comparing data sets', 375),
          li('shs3-mathematics-3.4.1-cs-2', '3.4.1.LI.2', '3.4.1.AS.2', 'Discuss data information published in local and international media platforms by making useful inferences.', 'Interpreting published data', 378),
        ]),
      ] },
    ],
  },
  {
    id: 'shs3-mathematics-4.2',
    subject: 'Mathematics',
    classLevel: 'SHS3',
    year: 3,
    strandCode: '4',
    strand: 'Making Sense of and Using Data',
    subStrandCode: '4.2',
    subStrand: 'Probability/Chance',
    sourcePages: [380, 381, 383, 384, 385],
    learningOutcomes: [
      { id: 'shs3-mathematics-3.4.2-lo-1', code: '3.4.2.LO.1', text: 'Use probability reasoning to analyse and predict everyday-life events.', skillsAndCompetencies: ['Probability reasoning'], sourcePages: [380, 383, 384], contentStandards: [
        cs('shs3-mathematics-3.4.2-lo-1', '3.4.2.CS.1', 'Demonstrate understanding of the role of probability in society and apply probability reasoning.', 383, [
          li('shs3-mathematics-3.4.2-cs-1', '3.4.2.LI.1', '3.4.2.AS.1', 'Demonstrate understanding of the role of probability in society and apply probability reasoning to make predictions.', 'Role of probability in society', 383),
          li('shs3-mathematics-3.4.2-cs-1', '3.4.2.LI.2', '3.4.2.AS.2', 'Solve everyday-life problems involving probability of dependent and independent events, including addition and multiplication laws.', 'Dependent and independent events', 384),
        ]),
      ] },
    ],
  },
];
