import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = [
  'Level 1 Recall',
  'Level 2 Skills of conceptual understanding',
  'Level 3 Strategic reasoning',
  'Level 4 Extended critical thinking and reasoning',
];

const mathResources = [
  'GeoGebra',
  'Graph sheets',
  'Mathematical sets',
  'Scientific calculator',
  'Grid paper',
  'Cardboards',
  'Models',
  'Algebraic tiles',
  'Computer or mobile technology',
];

function li(
  baseId: string,
  code: string,
  assessmentCode: string,
  text: string,
  shortTopic: string,
  exemplars: string[],
  sourcePage: number,
): ShsLearningIndicator {
  return {
    id: `${baseId}-${code.toLowerCase().replaceAll('.', '-')}`,
    code,
    text,
    shortTopic,
    pedagogicalExemplars: exemplars,
    assessment: { code: assessmentCode, levels: assessmentLevels },
    resources: mathResources,
    sourcePage,
  };
}

function cs(
  baseId: string,
  code: string,
  text: string,
  sourcePage: number,
  indicators: ShsLearningIndicator[],
): ShsContentStandard {
  return { id: `${baseId}-${code.toLowerCase().replaceAll('.', '-')}`, code, text, sourcePage, indicators };
}

export const mathematicsShs1: ShsSubStrand[] = [
  {
    id: 'shs1-mathematics-1.1',
    subject: 'Mathematics',
    classLevel: 'SHS1',
    year: 1,
    strandCode: '1',
    strand: 'Numbers for Everyday Life',
    subStrandCode: '1.1',
    subStrand: 'Real Number System',
    sourcePages: [26, 27, 28, 29, 30, 31, 36, 37],
    learningOutcomes: [
      {
        id: 'shs1-mathematics-1.1.1-lo-1',
        code: '1.1.1.LO.1',
        text: 'Apply the relationships and differences between rational and irrational numbers and use them to solve problems.',
        skillsAndCompetencies: ['Communication and collaboration', 'Strategic competency', 'Critical thinking'],
        gesi: ['Respect learners of different backgrounds and dispel stereotypes about ability in mathematics.'],
        values: ['Equity', 'Truth and integrity', 'Tolerance'],
        sourcePages: [26, 27, 31, 33],
        contentStandards: [
          cs('shs1-mathematics-1.1.1-lo-1', '1.1.1.CS.1', 'Demonstrate knowledge and understanding of real number systems and operations of subsets of real numbers.', 31, [
            li('shs1-mathematics-1.1.1-cs-1', '1.1.1.LI.1', '1.1.1.AS.1', 'Demonstrate knowledge and understanding of real number systems and the operations of the various subsets.', 'Real number systems and subset operations', ['Develop the real number system using closure property and solve problems in collaborative groups.'], 31),
            li('shs1-mathematics-1.1.1-cs-1', '1.1.1.LI.2', '1.1.1.AS.2', 'Distinguish between rational and irrational numbers using conversion of common fractions to decimals and solve related problems.', 'Rational and irrational numbers', ['Use Diamond Nine and collaborative learning to compare rational and irrational numbers and solve related problems.'], 31),
            li('shs1-mathematics-1.1.1-cs-1', '1.1.1.LI.3', '1.1.1.AS.3', 'Establish the properties of real numbers with respect to commutative, associative, identity, inverse and distributive properties.', 'Properties of real numbers', ['Use Talk for Learning and think-pair-share to establish and apply properties of real numbers.'], 33),
          ]),
        ],
      },
      {
        id: 'shs1-mathematics-1.1.1-lo-2',
        code: '1.1.1.LO.2',
        text: 'Analyse and solve real world problems involving union, intersection and complements of sets and apply these to three-set problems using simple surveys.',
        skillsAndCompetencies: ['Communication and collaboration', 'Technology literacy', 'Strategic competency', 'Critical thinking'],
        gesi: ['Use fair and inclusive group work when learners discuss union, intersection and complements of sets.'],
        values: ['Diversity', 'Equity', 'Truth and integrity', 'Tolerance'],
        sourcePages: [28, 29, 30, 36, 37, 40],
        contentStandards: [
          cs('shs1-mathematics-1.1.1-lo-2', '1.1.1.CS.2', 'Demonstrate knowledge and understanding of concepts and vocabulary of sets and apply set relationships to surveys.', 36, [
            li('shs1-mathematics-1.1.1-cs-2', '1.1.1.LI.1', '1.1.1.AS.1', 'Demonstrate knowledge and understanding of real number systems with respect to concepts and vocabulary of sets and carry out simple surveys using sets.', 'Set concepts and simple surveys', ['Use Venn diagrams, models and learner surveys to represent set vocabulary and relationships.'], 36),
            li('shs1-mathematics-1.1.1-cs-2', '1.1.1.LI.2', '1.1.1.AS.2', 'Organise information visually to establish relationships among three sets and apply these to mini surveys in the school community and beyond.', 'Three-set relationships and surveys', ['Use GeoGebra, cardboards and collaborative surveys to organise three-set information visually.'], 36),
            li('shs1-mathematics-1.1.1-cs-2', '1.1.1.LI.3', '1.1.1.AS.3', 'Establish the relationship among three sets, including set equations and De Morgan’s law.', 'Set equations and De Morgan’s law', ['Use think-pair-share to model set equations, De Morgan’s law and everyday set-related problems.'], 37),
          ]),
        ],
      },
    ],
  },
  {
    id: 'shs1-mathematics-1.2',
    subject: 'Mathematics',
    classLevel: 'SHS1',
    year: 1,
    strandCode: '1',
    strand: 'Numbers for Everyday Life',
    subStrandCode: '1.2',
    subStrand: 'Proportional Reasoning',
    sourcePages: [41, 47, 49, 50, 51],
    learningOutcomes: [
      {
        id: 'shs1-mathematics-1.1.2-lo-1',
        code: '1.1.2.LO.1',
        text: 'Apply proportional reasoning involving fractions and operations to solve real-life problems.',
        skillsAndCompetencies: ['Communication', 'Collaboration', 'Critical thinking'],
        gesi: ['Use differentiated grouping for work on fractions and inverse relationships.'],
        values: ['Tolerance', 'Honesty'],
        sourcePages: [41, 47, 49],
        contentStandards: [
          cs('shs1-mathematics-1.1.2-lo-1', '1.1.2.CS.1', 'Demonstrate understanding of proportional reasoning involving fractions and operations.', 47, [
            li('shs1-mathematics-1.1.2-cs-1', '1.1.2.LI.1', '1.1.2.AS.1', 'Demonstrate understanding of proportional reasoning involving fractions and operations and use it to solve real-life problems, including rounding off.', 'Fractions and proportional reasoning', ['Use fraction boards and collaborative tasks to solve proportional reasoning problems involving fractions and rounding.'], 47),
            li('shs1-mathematics-1.1.2-cs-1', '1.1.2.LI.2', '1.1.2.AS.2', 'Establish additive and multiplicative inverses of fractions using multi-purpose model charts.', 'Additive and multiplicative inverses', ['Use model charts to find additive and multiplicative inverses and explain their relationships.'], 49),
          ]),
        ],
      },
      {
        id: 'shs1-mathematics-1.1.2-lo-2',
        code: '1.1.2.LO.2',
        text: 'Use percentages and percentage change to solve everyday financial and proportional problems.',
        skillsAndCompetencies: ['Financial literacy', 'Problem solving', 'Communication'],
        gesi: ['Use household and community contexts that are inclusive and familiar to all learners.'],
        values: ['Truth and integrity', 'Responsibility'],
        sourcePages: [50, 51],
        contentStandards: [
          cs('shs1-mathematics-1.1.2-lo-2', '1.1.2.CS.2', 'Demonstrate understanding of proportional reasoning on percentages and percentage change.', 50, [
            li('shs1-mathematics-1.1.2-cs-2', '1.1.2.LI.1', '1.1.2.AS.1', 'Demonstrate conceptual understanding of proportional reasoning on percentages and use it to solve everyday problems including simple interest, discount, profit, loss and commission.', 'Percentages in everyday life', ['Use shopping, banking and household examples to solve simple interest, discount, profit, loss and commission problems.'], 50),
            li('shs1-mathematics-1.1.2-cs-2', '1.1.2.LI.2', '1.1.2.AS.2', 'Analyse daily activities involving percentage change, including personal or household finance such as utility bills, exchange rates and prices.', 'Percentage change and household finance', ['Use collaborative investigation of utility bills, exchange rates and price changes to model percentage change.'], 50),
          ]),
        ],
      },
    ],
  },
  {
    id: 'shs1-mathematics-2.1',
    subject: 'Mathematics',
    classLevel: 'SHS1',
    year: 1,
    strandCode: '2',
    strand: 'Algebraic Reasoning',
    subStrandCode: '2.1',
    subStrand: 'Applications of Expressions, Equations and Inequalities',
    sourcePages: [52, 53, 57, 58, 60, 61, 64, 65],
    learningOutcomes: [
      {
        id: 'shs1-mathematics-1.2.1-lo-1',
        code: '1.2.1.LO.1',
        text: 'Formulate and simplify algebraic expressions and solve real-life problems on them.',
        skillsAndCompetencies: ['Algebraic reasoning', 'Critical thinking', 'Collaboration'],
        gesi: ['Use algebra tiles and group work to support different learner abilities.'],
        sourcePages: [52, 53, 57, 58, 60, 61],
        contentStandards: [
          cs('shs1-mathematics-1.2.1-lo-1', '1.2.1.CS.1', 'Demonstrate understanding of algebraic expressions and operations.', 57, [
            li('shs1-mathematics-1.2.1-cs-1', '1.2.1.LI.1', '1.2.1.AS.1', 'Demonstrate knowledge and understanding of algebraic expressions and solve real-life problems on them.', 'Algebraic expressions', ['Use numbers, patterns and variables to formulate expressions and solve real-life problems.'], 57),
            li('shs1-mathematics-1.2.1-cs-1', '1.2.1.LI.2', '1.2.1.AS.2', 'Factorise algebraic expressions involving quadratic trinomials.', 'Factorising quadratic trinomials', ['Use algebraic tiles, area models and collaborative learning to factorise quadratic trinomials.'], 58),
            li('shs1-mathematics-1.2.1-cs-1', '1.2.1.LI.3', '1.2.1.AS.3', 'Recognise perfect squares and apply the idea to solve problems, including the difference of two squares of binomials.', 'Perfect squares and difference of two squares', ['Use group work and problem-based learning to recognise perfect squares and factorise differences of two squares.'], 60),
            li('shs1-mathematics-1.2.1-cs-1', '1.2.1.LI.4', '1.2.1.AS.4', 'Analyse and apply operations on simple algebraic fractions involving monomial and binomial denominators and determine conditions for zero or undefined fractions.', 'Operations on algebraic fractions', ['Use worked examples and peer discussion to simplify algebraic fractions and identify restrictions.'], 61),
          ]),
        ],
      },
      {
        id: 'shs1-mathematics-1.2.1-lo-2',
        code: '1.2.1.LO.2',
        text: 'Construct and interpret formulae, linear equations and inequalities in one variable.',
        skillsAndCompetencies: ['Problem solving', 'Mathematical modelling', 'Communication'],
        sourcePages: [64, 65],
        contentStandards: [
          cs('shs1-mathematics-1.2.1-lo-2', '1.2.1.CS.2', 'Demonstrate understanding of equations and inequalities in one variable and apply them to real-life problems.', 64, [
            li('shs1-mathematics-1.2.1-cs-2', '1.2.1.LI.1', '1.2.1.AS.1', 'Demonstrate knowledge and understanding of equations and inequalities in one variable and apply it in solving real-life problems.', 'Equations and inequalities in one variable', ['Construct and interpret formulae for given tasks and translate real-life contexts into equations or inequalities.'], 64),
            li('shs1-mathematics-1.2.1-cs-2', '1.2.1.LI.2', '1.2.1.AS.2', 'Solve linear equations and inequalities in one variable for a given problem and relate it to real-life situations.', 'Solving linear equations and inequalities', ['Use collaborative problem-solving to solve one-variable equations and inequalities from real contexts.'], 65),
          ]),
        ],
      },
      {
        id: 'shs1-mathematics-1.2.1-lo-3',
        code: '1.2.1.LO.3',
        text: 'Apply algebraic expressions, equations and inequalities to model and solve real-life problems.',
        skillsAndCompetencies: ['Mathematical modelling', 'Strategic reasoning'],
        contentStandards: [],
        sourcePages: [52, 53, 64, 65],
      },
    ],
  },
  {
    id: 'shs1-mathematics-2.2',
    subject: 'Mathematics',
    classLevel: 'SHS1',
    year: 1,
    strandCode: '2',
    strand: 'Algebraic Reasoning',
    subStrandCode: '2.2',
    subStrand: 'Patterns and Relations',
    sourcePages: [69, 74, 75, 78, 79, 82, 83],
    learningOutcomes: [
      {
        id: 'shs1-mathematics-1.2.2-lo-1',
        code: '1.2.2.LO.1',
        text: 'Interpret mapping, relations, functions and graphs of functions.',
        skillsAndCompetencies: ['Graphical reasoning', 'Communication', 'Technology literacy'],
        sourcePages: [69, 74, 75, 78, 79],
        contentStandards: [
          cs('shs1-mathematics-1.2.2-lo-1', '1.2.2.CS.1', 'Demonstrate understanding of mapping, relations and functions and interpret graphs of functions.', 74, [
            li('shs1-mathematics-1.2.2-cs-1', '1.2.2.LI.1', '1.2.2.AS.1', 'Demonstrate understanding of mapping, relations and functions and interpret graphs of a function and its applications in real life.', 'Mappings, relations and functions', ['Distinguish relations and functions using mappings, tables and real-life function examples.'], 74),
            li('shs1-mathematics-1.2.2-cs-1', '1.2.2.LI.2', '1.2.2.AS.2', 'Draw graphs of linear functions and interpret them.', 'Graphs of linear functions', ['Use equations of the form y = mx + c to draw and interpret straight-line graphs.'], 78),
          ]),
        ],
      },
      {
        id: 'shs1-mathematics-1.2.2-lo-2',
        code: '1.2.2.LO.2',
        text: 'Use gradients, equations of straight lines and distance between points in real-life situations.',
        skillsAndCompetencies: ['Analytical reasoning', 'Graphical reasoning'],
        sourcePages: [82, 83],
        contentStandards: [
          cs('shs1-mathematics-1.2.2-lo-2', '1.2.2.CS.2', 'Demonstrate understanding of gradient, straight-line equations and distance between points.', 82, [
            li('shs1-mathematics-1.2.2-cs-2', '1.2.2.LI.1', '1.2.2.AS.1', 'Demonstrate understanding of the gradient and equation of a straight line, the magnitude of a line segment and applications in real-life situations.', 'Gradient and equation of a straight line', ['Extend linear graph knowledge to gradient, equations of lines and line segment magnitude.'], 82),
            li('shs1-mathematics-1.2.2-cs-2', '1.2.2.LI.2', '1.2.2.AS.2', 'Recognise and interpret two points on a straight line and use it to find the distance between them.', 'Distance between two points', ['Investigate parallel and perpendicular lines and compute distances between points on a line.'], 83),
          ]),
        ],
      },
    ],
  },
  {
    id: 'shs1-mathematics-3.1',
    subject: 'Mathematics',
    classLevel: 'SHS1',
    year: 1,
    strandCode: '3',
    strand: 'Geometry Around Us',
    subStrandCode: '3.1',
    subStrand: 'Spatial Sense',
    sourcePages: [86, 87, 90, 91, 93, 95, 97, 101],
    learningOutcomes: [
      {
        id: 'shs1-mathematics-1.3.1-lo-1',
        code: '1.3.1.LO.1',
        text: 'Apply properties of angles, parallel lines, transversals, triangles, quadrilaterals and polygons to solve problems.',
        skillsAndCompetencies: ['Spatial reasoning', 'Problem solving', 'Collaboration'],
        sourcePages: [86, 87, 90, 91, 93, 95, 97, 101],
        contentStandards: [
          cs('shs1-mathematics-1.3.1-lo-1', '1.3.1.CS.1', 'Demonstrate conceptual understanding of spatial sense and apply geometrical properties.', 90, [
            li('shs1-mathematics-1.3.1-cs-1', '1.3.1.LI.1', '1.3.1.AS.1', 'Demonstrate conceptual understanding of spatial sense with respect to angles, parallel lines, transversals and polygons.', 'Angles, parallel lines and polygons', ['Use models, drawings and group discussion to investigate angle and polygon properties.'], 90),
            li('shs1-mathematics-1.3.1-cs-1', '1.3.1.LI.2', '1.3.1.AS.2', 'Solve problems that involve parallel lines, perpendicular lines, transversals and pairs of angles formed between them.', 'Parallel lines and transversals', ['Use experiential learning and task sheets to solve angle problems involving transversals.'], 93),
            li('shs1-mathematics-1.3.1-cs-1', '1.3.1.LI.3', '1.3.1.AS.3', 'State and apply the exterior angle theorem of a triangle to solve problems and identify properties of special triangles.', 'Exterior angle theorem and special triangles', ['Use Talk for Learning to establish triangle theorems and solve related problems.'], 95),
            li('shs1-mathematics-1.3.1-cs-1', '1.3.1.LI.4', '1.3.1.AS.4', 'Solve problems on Pythagorean theorem by identifying right-triangle situations, verifying the formula and applying it.', 'Pythagorean theorem', ['Use collaborative tasks to prove and apply the Pythagorean theorem in real-life problems.'], 97),
            li('shs1-mathematics-1.3.1-cs-1', '1.3.1.LI.5', '1.3.1.AS.5', 'State and use properties of quadrilaterals and calculate sums of interior and exterior angles of polygons.', 'Quadrilaterals and polygon angles', ['Use small-group investigations to classify quadrilaterals and compute polygon angle sums.'], 101),
          ]),
        ],
      },
    ],
  },
  {
    id: 'shs1-mathematics-3.2',
    subject: 'Mathematics',
    classLevel: 'SHS1',
    year: 1,
    strandCode: '3',
    strand: 'Geometry Around Us',
    subStrandCode: '3.2',
    subStrand: 'Measurement',
    sourcePages: [103, 112, 113, 116, 117, 118, 119, 121, 123, 125, 126, 127],
    learningOutcomes: [
      {
        id: 'shs1-mathematics-1.3.2-lo-1',
        code: '1.3.2.LO.1',
        text: 'Apply bearings and vectors to solve measurement problems.',
        skillsAndCompetencies: ['Vector reasoning', 'Spatial reasoning'],
        sourcePages: [103, 112, 113],
        contentStandards: [
          cs('shs1-mathematics-1.3.2-lo-1', '1.3.2.CS.1', 'Demonstrate understanding of measurement with respect to bearings and vectors.', 112, [
            li('shs1-mathematics-1.3.2-cs-1', '1.3.2.LI.1', '1.3.2.AS.1', 'Demonstrate knowledge and understanding of measurement with respect to bearings and vectors.', 'Bearings and vectors', ['Recognise vectors as quantities with magnitude and direction and relate them to bearings.'], 112),
            li('shs1-mathematics-1.3.2-cs-1', '1.3.2.LI.2', '1.3.2.AS.2', 'Represent a vector in two-space geometrically and algebraically, with directions expressed in different ways.', 'Vector representation', ['Represent vectors as directed line segments and algebraic objects using bearings and component notation.'], 113),
          ]),
        ],
      },
      {
        id: 'shs1-mathematics-1.3.2-lo-2',
        code: '1.3.2.LO.2',
        text: 'Use trigonometric ratios and special angles to solve right-triangle and real-life problems.',
        skillsAndCompetencies: ['Trigonometric reasoning', 'Problem solving'],
        sourcePages: [116, 117, 118, 119, 120],
        contentStandards: [
          cs('shs1-mathematics-1.3.2-lo-2', '1.3.2.CS.2', 'Demonstrate understanding of primary trigonometric ratios and apply them.', 116, [
            li('shs1-mathematics-1.3.2-cs-2', '1.3.2.LI.1', '1.3.2.AS.1', 'Demonstrate conceptual understanding of primary trigonometric ratios and apply them to solve right-triangle problems.', 'Primary trigonometric ratios', ['Investigate sine, cosine and tangent using right triangles and solve contextual problems.'], 116),
            li('shs1-mathematics-1.3.2-cs-2', '1.3.2.LI.2', '1.3.2.AS.2', 'Find trigonometric functions of special angles 30°, 45° and 60° and use calculators for angles up to 360°.', 'Special angles and calculator trigonometry', ['Use special triangles and calculators to determine sine, cosine and tangent values.'], 118),
            li('shs1-mathematics-1.3.2-cs-2', '1.3.2.LI.3', '1.3.2.AS.3', 'Solve problems using the three primary trigonometric ratios for angles from 0° to 360° in standard position.', 'Trigonometric ratios in standard position', ['Use think-pair-share to solve real-life problems involving trigonometric ratios.'], 119),
          ]),
        ],
      },
      {
        id: 'shs1-mathematics-1.3.2-lo-3',
        code: '1.3.2.LO.3',
        text: 'Use perimeter, area and volume formulae to solve measurement problems involving 2D and 3D shapes.',
        skillsAndCompetencies: ['Measurement reasoning', 'Modelling'],
        sourcePages: [121, 123, 125, 126, 127],
        contentStandards: [
          cs('shs1-mathematics-1.3.2-lo-3', '1.3.2.CS.3', 'Demonstrate conceptual understanding of perimeter, area and volume.', 121, [
            li('shs1-mathematics-1.3.2-cs-3', '1.3.2.LI.1', '1.3.2.AS.1', 'Demonstrate conceptual understanding of perimeter and area of circles and quadrilaterals.', 'Perimeter and area of circles and quadrilaterals', ['Identify and compare referents for SI units and solve perimeter and area problems.'], 121),
            li('shs1-mathematics-1.3.2-cs-3', '1.3.2.LI.2', '1.3.2.AS.2', 'Estimate the perimeter and area of regular, composite or irregular 2D shapes including kites, parallelograms, rhombi and trapezoids.', 'Perimeter and area of 2D shapes', ['Use experiential learning to estimate and compute area and perimeter of composite shapes.'], 123),
            li('shs1-mathematics-1.3.2-cs-3', '1.3.2.LI.3', '1.3.2.AS.3', 'Solve contextual problems involving perimeter and area of regular, composite or irregular 2D shapes.', 'Contextual area and perimeter problems', ['Use think-pair-share to solve contextual perimeter and area problems.'], 125),
            li('shs1-mathematics-1.3.2-cs-3', '1.3.2.LI.4', '1.3.2.AS.4', 'Determine the volume of prisms and solve everyday life problems on them.', 'Volume of prisms', ['Use think-square-share to derive and apply volume formulae for prisms.'], 126),
          ]),
        ],
      },
    ],
  },
  {
    id: 'shs1-mathematics-4.1',
    subject: 'Mathematics',
    classLevel: 'SHS1',
    year: 1,
    strandCode: '4',
    strand: 'Making Sense of and Using Data',
    subStrandCode: '4.1',
    subStrand: 'Statistical Reasoning and Its Application in Real Life',
    sourcePages: [128, 129, 135, 136, 138, 140, 144, 147],
    learningOutcomes: [
      {
        id: 'shs1-mathematics-1.4.1-lo-1',
        code: '1.4.1.LO.1',
        text: 'Design and validate data collection methods for everyday-life data.',
        skillsAndCompetencies: ['Statistical reasoning', 'Digital literacy', 'Communication'],
        sourcePages: [128, 129, 135, 136],
        contentStandards: [
          cs('shs1-mathematics-1.4.1-lo-1', '1.4.1.CS.1', 'Demonstrate understanding of appropriate data collection methods.', 135, [
            li('shs1-mathematics-1.4.1-cs-1', '1.4.1.LI.1', '1.4.1.AS.1', 'Demonstrate understanding of appropriateness of data collection methods for everyday-life data.', 'Data collection methods', ['Classify data as quantitative or qualitative and select suitable methods for everyday data.'], 135),
            li('shs1-mathematics-1.4.1-cs-1', '1.4.1.LI.2', '1.4.1.AS.2', 'Identify and validate quantitative data collection methods and use them to collect everyday-life data.', 'Quantitative data collection', ['Use surveys, questionnaires, interviews, observations and existing data to collect quantitative data.'], 136),
            li('shs1-mathematics-1.4.1-cs-1', '1.4.1.LI.3', '1.4.1.AS.3', 'Identify and validate qualitative data collection methods and use them to collect everyday-life data.', 'Qualitative data collection', ['Use interviews, observations, focus groups, oral histories and online tracking to collect qualitative data.'], 136),
          ]),
        ],
      },
      {
        id: 'shs1-mathematics-1.4.1-lo-2',
        code: '1.4.1.LO.2',
        text: 'Organise, present, analyse and interpret grouped and ungrouped data using descriptive statistics.',
        skillsAndCompetencies: ['Data presentation', 'Descriptive statistics', 'Technology literacy'],
        sourcePages: [138, 139, 140, 141, 144],
        contentStandards: [
          cs('shs1-mathematics-1.4.1-lo-2', '1.4.1.CS.2', 'Demonstrate understanding of data organisation, presentation and interpretation.', 138, [
            li('shs1-mathematics-1.4.1-cs-2', '1.4.1.LI.1', '1.4.1.AS.1', 'Demonstrate conceptual understanding of data organisation and presentation for grouped and ungrouped data, including 3D graphs with technology.', 'Organising and presenting data', ['Organise grouped and ungrouped data and present them using appropriate graphs and digital tools.'], 138),
            li('shs1-mathematics-1.4.1-cs-2', '1.4.1.LI.2', '1.4.1.AS.2', 'Analyse and interpret data using descriptive statistics and justify which averages best represent the data.', 'Measures of central tendency', ['Use mean, median, mode, minimum and maximum values to interpret grouped and ungrouped data.'], 140),
            li('shs1-mathematics-1.4.1-cs-2', '1.4.1.LI.3', '1.4.1.AS.3', 'Use mathematical arguments to support personal choices and make inferences from data in everyday life.', 'Making inferences from data', ['Use mathematical arguments and peer perspectives to assess and make inferences from data displays.'], 144),
          ]),
        ],
      },
      {
        id: 'shs1-mathematics-1.4.1-lo-3',
        code: '1.4.1.LO.3',
        text: 'Carry out a data project and present a report using appropriate technology.',
        skillsAndCompetencies: ['Project work', 'Presentation skills', 'Digital literacy'],
        sourcePages: [147],
        contentStandards: [
          cs('shs1-mathematics-1.4.1-lo-3', '1.4.1.CS.3', 'Demonstrate ability to carry out a data project in the school environment.', 147, [
            li('shs1-mathematics-1.4.1-cs-3', '1.4.1.LI.1', '1.4.1.AS.1', 'Embark on a project involving collection, analysis and interpretation of quantitative and qualitative data within the school environment.', 'School data project', ['Develop and carry out a mini-project using school-based quantitative and qualitative data.'], 147),
            li('shs1-mathematics-1.4.1-cs-3', '1.4.1.LI.2', '1.4.1.AS.2', 'Present a project report to class or school forum using presentation software and publish the report in a school medium.', 'Data project presentation', ['Use PowerPoint, infographics or other presentation tools to present and publish a data project report.'], 147),
          ]),
        ],
      },
    ],
  },
  {
    id: 'shs1-mathematics-4.2',
    subject: 'Mathematics',
    classLevel: 'SHS1',
    year: 1,
    strandCode: '4',
    strand: 'Making Sense of and Using Data',
    subStrandCode: '4.2',
    subStrand: 'Probability/Chance',
    sourcePages: [149, 152, 153, 154, 155],
    learningOutcomes: [
      {
        id: 'shs1-mathematics-1.4.2-lo-1',
        code: '1.4.2.LO.1',
        text: 'Use simple and compound probability experiments involving independent events to solve everyday problems.',
        skillsAndCompetencies: ['Probability reasoning', 'Problem solving', 'Collaboration'],
        sourcePages: [149, 152, 153, 154, 155],
        contentStandards: [
          cs('shs1-mathematics-1.4.2-lo-1', '1.4.2.CS.1', 'Demonstrate understanding of simple and compound probability experiments involving independent events.', 152, [
            li('shs1-mathematics-1.4.2-cs-1', '1.4.2.LI.1', '1.4.2.AS.1', 'Demonstrate conceptual understanding of simple and compound probability experiments involving two independent events.', 'Sample spaces for independent events', ['List sample spaces for simple and compound independent-event experiments.'], 152),
            li('shs1-mathematics-1.4.2-cs-1', '1.4.2.LI.2', '1.4.2.AS.2', 'Determine probabilities of independent events and express results as fractions, decimals, percentages and/or ratios.', 'Probability of independent events', ['Use think-pair-share to calculate probabilities and express them in multiple forms.'], 153),
            li('shs1-mathematics-1.4.2-cs-1', '1.4.2.LI.3', '1.4.2.AS.3', 'Solve everyday life problems involving the probability of two independent events.', 'Everyday probability problems', ['Create and solve everyday independent-event probability problems in convenient groups.'], 154),
          ]),
        ],
      },
    ],
  },
];

