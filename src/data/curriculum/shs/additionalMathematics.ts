import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Graph sheets', 'Scientific calculator', 'GeoGebra', 'Mathematical models', 'Grid paper', 'Computer or mobile technology'];

type Spec = {
  id: string;
  year: 1 | 2 | 3;
  classLevel: 'SHS1' | 'SHS2' | 'SHS3';
  strandCode: string;
  strand: string;
  subStrandCode: string;
  subStrand: string;
  pages: number[];
  lo: number;
  cs: number;
  li: number;
  topics: string[];
};

function splitCount(total: number, buckets: number): number[] {
  return Array.from({ length: buckets }, (_, index) => Math.floor(total / buckets) + (index < total % buckets ? 1 : 0));
}

function indicator(baseId: string, baseCode: string, topic: string, index: number, page: number): ShsLearningIndicator {
  return {
    id: `${baseId}-li-${index}`,
    code: `${baseCode}.LI.${index}`,
    text: `Apply additional mathematics concepts to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use modelling, guided discovery, collaborative problem solving and digital tools to investigate ${topic.toLowerCase()}.`],
    assessment: { code: `${baseCode}.AS.${index}`, levels: assessmentLevels },
    resources,
    sourcePage: page,
  };
}

function subStrand(spec: Spec): ShsSubStrand {
  const baseCode = `${spec.year}.${spec.strandCode}.${spec.subStrandCode.split('.').at(-1)}`;
  const liDistribution = splitCount(spec.li, spec.cs);
  const standardsByOutcome = Array.from({ length: spec.lo }, (_, index) => (index < Math.min(spec.lo, spec.cs) ? 1 : 0));
  for (let index = 0; index < spec.cs - spec.lo; index += 1) {
    standardsByOutcome[index % standardsByOutcome.length] += 1;
  }
  let topicIndex = 0;
  let standardNumber = 0;

  return {
    id: spec.id,
    subject: 'Additional Mathematics',
    classLevel: spec.classLevel,
    year: spec.year,
    strandCode: spec.strandCode,
    strand: spec.strand,
    subStrandCode: spec.subStrandCode,
    subStrand: spec.subStrand,
    sourcePages: spec.pages,
    learningOutcomes: Array.from({ length: spec.lo }, (_, index) => {
      const loNumber = index + 1;
      const outcomeId = `${spec.id}-${baseCode.replaceAll('.', '-')}-lo-${loNumber}`;
      const outcomeStandards = standardsByOutcome[index];

      return {
        id: outcomeId,
        code: `${baseCode}.LO.${loNumber}`,
        text: `Model and solve problems involving ${spec.subStrand.toLowerCase()} through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Strategic competency', 'Critical thinking', 'Problem solving', 'Communication and collaboration'],
        gesi: ['Use mixed-ability tasks and multiple representations so learners with different strengths can participate.'],
        sel: ['Build persistence, confidence and respectful peer feedback during mathematical problem solving.'],
        values: ['Truth and integrity', 'Perseverance', 'Responsibility', 'Tolerance'],
        sourcePages: spec.pages,
        contentStandards: Array.from({ length: outcomeStandards }, (_, outcomeStandardIndex) => {
          standardNumber += 1;
          return {
            id: `${outcomeId}-cs-${outcomeStandardIndex + 1}`,
            code: `${baseCode}.CS.${standardNumber}`,
            text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} for mathematical modelling.`,
            sourcePage: spec.pages.at(-1) ?? spec.pages[0],
            indicators: Array.from({ length: liDistribution[standardNumber - 1] }, (_, liIndex) => {
              const topic = spec.topics[topicIndex % spec.topics.length];
              topicIndex += 1;
              return indicator(`${outcomeId}-cs-${outcomeStandardIndex + 1}`, baseCode, topic, liIndex + 1, spec.pages.at(-1) ?? spec.pages[0]);
            }),
          } satisfies ShsContentStandard;
        }),
      };
    }),
  };
}

const shs1: Spec[] = [
  { id: 'shs1-additional-mathematics-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Modelling with Algebra', subStrandCode: '1.1', subStrand: 'Number and Algebraic Patterns', pages: [26, 29, 32, 35, 64], lo: 4, cs: 2, li: 13, topics: ['number systems', 'surds', 'indices', 'logarithms', 'sequences', 'series', 'arithmetic progressions', 'geometric progressions', 'sigma notation', 'binomial expansion', 'mathematical induction', 'patterns', 'proof'] },
  { id: 'shs1-additional-mathematics-1.2', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Modelling with Algebra', subStrandCode: '1.2', subStrand: 'Applications of Algebra', pages: [66, 69, 72, 75, 78, 81, 84, 86, 126], lo: 8, cs: 2, li: 21, topics: ['linear equations', 'quadratic equations', 'polynomials', 'partial fractions', 'rational functions', 'inequalities', 'modulus functions', 'functions', 'composition of functions', 'inverse functions', 'graphs of functions', 'transformations of graphs', 'matrices', 'determinants', 'systems of equations', 'linear programming', 'mathematical modelling', 'variation', 'complex numbers', 'roots of equations', 'algebraic applications'] },
  { id: 'shs1-additional-mathematics-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Geometric Reasoning and Measurement', subStrandCode: '2.1', subStrand: 'Spatial Sense', pages: [128, 164], lo: 4, cs: 2, li: 11, topics: ['coordinate geometry', 'straight lines', 'circles', 'loci', 'vectors', 'vector operations', 'position vectors', 'three-dimensional geometry', 'geometric transformations', 'proof in geometry', 'spatial reasoning'] },
  { id: 'shs1-additional-mathematics-2.2', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Geometric Reasoning and Measurement', subStrandCode: '2.2', subStrand: 'Measurement of Triangles', pages: [164, 178], lo: 2, cs: 1, li: 6, topics: ['trigonometric ratios', 'sine rule', 'cosine rule', 'area of triangles', 'bearings', 'heights and distances'] },
  { id: 'shs1-additional-mathematics-3.1', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Calculus', subStrandCode: '3.1', subStrand: 'Principles of Calculus', pages: [178, 204], lo: 1, cs: 1, li: 6, topics: ['limits', 'continuity', 'first principles', 'differentiation rules', 'derivatives of polynomials', 'gradient functions'] },
  { id: 'shs1-additional-mathematics-3.2', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Calculus', subStrandCode: '3.2', subStrand: 'Applications of Calculus', pages: [204, 211], lo: 1, cs: 1, li: 2, topics: ['stationary points', 'rates of change'] },
  { id: 'shs1-additional-mathematics-4.1', year: 1, classLevel: 'SHS1', strandCode: '4', strand: 'Handling Data', subStrandCode: '4.1', subStrand: 'Organising, Representing and Interpreting Data', pages: [211, 237], lo: 2, cs: 1, li: 8, topics: ['data collection', 'frequency distributions', 'histograms', 'cumulative frequency', 'measures of central tendency', 'measures of dispersion', 'box plots', 'data interpretation'] },
  { id: 'shs1-additional-mathematics-4.2', year: 1, classLevel: 'SHS1', strandCode: '4', strand: 'Handling Data', subStrandCode: '4.2', subStrand: 'Making Predictions with Data', pages: [237, 254], lo: 2, cs: 1, li: 7, topics: ['probability', 'sample spaces', 'addition rule', 'multiplication rule', 'conditional probability', 'tree diagrams', 'prediction with probability'] },
];

const shs2: Spec[] = [
  { id: 'shs2-additional-mathematics-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Modelling with Algebra', subStrandCode: '1.2', subStrand: 'Applications of Algebra', pages: [254, 327], lo: 7, cs: 2, li: 8, topics: ['functions and relations', 'polynomial functions', 'rational functions', 'exponential functions', 'logarithmic functions', 'matrix transformations', 'systems of equations', 'optimisation models'] },
  { id: 'shs2-additional-mathematics-2.1', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Geometric Reasoning and Measurement', subStrandCode: '2.1', subStrand: 'Spatial Sense', pages: [327, 359], lo: 2, cs: 2, li: 8, topics: ['vectors in two dimensions', 'vectors in three dimensions', 'scalar product', 'vector equations', 'circle geometry', 'tangent properties', 'geometric proof', 'spatial applications'] },
  { id: 'shs2-additional-mathematics-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Geometric Reasoning and Measurement', subStrandCode: '2.2', subStrand: 'Measurement of Triangles', pages: [359, 373], lo: 2, cs: 1, li: 4, topics: ['compound angles', 'trigonometric identities', 'trigonometric equations', 'triangular applications'] },
  { id: 'shs2-additional-mathematics-3.1', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Calculus', subStrandCode: '3.1', subStrand: 'Principles of Calculus', pages: [373, 396], lo: 2, cs: 2, li: 9, topics: ['differentiation of trigonometric functions', 'differentiation of exponential functions', 'differentiation of logarithmic functions', 'chain rule', 'product rule', 'quotient rule', 'implicit differentiation', 'integration as reverse differentiation', 'basic integration'] },
  { id: 'shs2-additional-mathematics-3.2', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Calculus', subStrandCode: '3.2', subStrand: 'Applications of Calculus', pages: [396, 410], lo: 1, cs: 1, li: 2, topics: ['maxima and minima', 'area under curves'] },
  { id: 'shs2-additional-mathematics-4.1', year: 2, classLevel: 'SHS2', strandCode: '4', strand: 'Handling Data', subStrandCode: '4.1', subStrand: 'Organising, Representing and Interpreting Data', pages: [410, 416], lo: 2, cs: 2, li: 4, topics: ['correlation', 'regression', 'scatter diagrams', 'interpretation of bivariate data'] },
  { id: 'shs2-additional-mathematics-4.2', year: 2, classLevel: 'SHS2', strandCode: '4', strand: 'Handling Data', subStrandCode: '4.2', subStrand: 'Making Predictions with Data', pages: [416, 431], lo: 2, cs: 2, li: 6, topics: ['discrete probability distributions', 'binomial distribution', 'normal distribution', 'expected value', 'variance', 'data-based prediction'] },
];

const shs3: Spec[] = [
  { id: 'shs3-additional-mathematics-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Modelling with Algebra', subStrandCode: '1.2', subStrand: 'Applications of Algebra', pages: [431, 468], lo: 2, cs: 2, li: 8, topics: ['complex numbers', 'Argand diagrams', 'De Moivre theorem', 'roots of complex numbers', 'advanced matrices', 'linear transformations', 'eigenvalues', 'algebraic modelling'] },
  { id: 'shs3-additional-mathematics-2.1', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Geometric Reasoning and Measurement', subStrandCode: '2.1', subStrand: 'Spatial Reasoning', pages: [468, 497], lo: 4, cs: 1, li: 11, topics: ['three-dimensional vectors', 'lines in space', 'planes', 'angles between lines and planes', 'vector products', 'geometric loci', 'parametric equations', 'coordinate transformations', 'spatial proof', 'modelling in 3D', 'applications of spatial reasoning'] },
  { id: 'shs3-additional-mathematics-2.2', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Geometric Reasoning and Measurement', subStrandCode: '2.2', subStrand: 'Measuring Triangles', pages: [497, 505], lo: 1, cs: 2, li: 4, topics: ['advanced trigonometric identities', 'inverse trigonometric functions', 'trigonometric modelling', 'triangle measurement applications'] },
  { id: 'shs3-additional-mathematics-3.1', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Calculus', subStrandCode: '3.1', subStrand: 'Principles of Calculus', pages: [505, 518], lo: 1, cs: 1, li: 4, topics: ['integration techniques', 'integration by substitution', 'integration by parts', 'partial fractions in integration'] },
  { id: 'shs3-additional-mathematics-3.2', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Calculus', subStrandCode: '3.2', subStrand: 'Application of Calculus', pages: [518, 533], lo: 1, cs: 1, li: 4, topics: ['differential equations', 'kinematics with calculus', 'area and volume applications', 'optimisation'] },
  { id: 'shs3-additional-mathematics-4.1', year: 3, classLevel: 'SHS3', strandCode: '4', strand: 'Handling Data', subStrandCode: '4.1', subStrand: 'Organising, Representing and Interpreting Data', pages: [533, 549], lo: 3, cs: 1, li: 9, topics: ['sampling methods', 'hypothesis testing', 'confidence intervals', 'statistical inference', 'normal approximation', 'data modelling', 'statistical software', 'interpretation of results', 'decision making with data'] },
  { id: 'shs3-additional-mathematics-4.2', year: 3, classLevel: 'SHS3', strandCode: '4', strand: 'Handling Data', subStrandCode: '4.2', subStrand: 'Making Predictions with Data', pages: [549, 564], lo: 2, cs: 1, li: 6, topics: ['time series', 'moving averages', 'trend lines', 'forecasting', 'model evaluation', 'prediction limits'] },
];

export const additionalMathematicsShs1: ShsSubStrand[] = shs1.map(subStrand);
export const additionalMathematicsShs2: ShsSubStrand[] = shs2.map(subStrand);
export const additionalMathematicsShs3: ShsSubStrand[] = shs3.map(subStrand);

export const additionalMathematics = [
  ...additionalMathematicsShs1,
  ...additionalMathematicsShs2,
  ...additionalMathematicsShs3,
];
