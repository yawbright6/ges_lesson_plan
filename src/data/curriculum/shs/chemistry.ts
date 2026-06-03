import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Molecular models', 'Charts', 'Worksheets', 'Virtual labs', 'Laboratory reagents', 'Videos'];

type SubSpec = {
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
    text: `Apply chemistry concepts and practical skills to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use inquiry-based learning, collaborative practical work, modelling and discussion to investigate ${topic.toLowerCase()}.`],
    assessment: { code: `${baseCode}.AS.${index}`, levels: assessmentLevels },
    resources,
    sourcePage: page,
  };
}

function subStrand(spec: SubSpec): ShsSubStrand {
  const baseCode = `${spec.year}.${spec.strandCode}.${spec.subStrandCode.split('.').at(-1)}`;
  const liDistribution = splitCount(spec.li, spec.cs);
  let topicIndex = 0;

  return {
    id: spec.id,
    subject: 'Chemistry',
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
      const hasStandard = index < spec.cs;

      return {
        id: outcomeId,
        code: `${baseCode}.LO.${loNumber}`,
        text: `Develop understanding of ${spec.subStrand.toLowerCase()} through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Critical thinking and problem solving', 'Communication and collaboration', 'Digital literacy', 'Creativity and innovation'],
        gesi: ['Use inclusive practical groups and shared roles so all learners participate in Chemistry investigations.'],
        sel: ['Build confidence, safety awareness and respectful teamwork during practical work.'],
        values: ['Integrity', 'Responsibility', 'Respect', 'Perseverance'],
        sourcePages: spec.pages,
        contentStandards: hasStandard
          ? [
              {
                id: `${outcomeId}-cs-${loNumber}`,
                code: `${baseCode}.CS.${loNumber}`,
                text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} in chemical systems.`,
                sourcePage: spec.pages.at(-1) ?? spec.pages[0],
                indicators: Array.from({ length: liDistribution[index] }, (_, liIndex) => {
                  const topic = spec.topics[topicIndex % spec.topics.length];
                  topicIndex += 1;
                  return indicator(`${outcomeId}-cs-${loNumber}`, baseCode, topic, liIndex + 1, spec.pages.at(-1) ?? spec.pages[0]);
                }),
              } satisfies ShsContentStandard,
            ]
          : [],
      };
    }),
  };
}

const shs1: SubSpec[] = [
  { id: 'shs1-chemistry-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Physical Chemistry', subStrandCode: '1.1', subStrand: 'Matter and its Properties', pages: [25, 26, 27, 42], lo: 4, cs: 3, li: 22, topics: ['nature of matter', 'classification of matter', 'separation techniques', 'measurement in Chemistry', 'scientific method', 'atomic structure', 'isotopes', 'electronic configuration', 'mole concept', 'Avogadro constant', 'relative atomic mass', 'relative molecular mass', 'empirical formula', 'molecular formula', 'chemical equations', 'stoichiometry', 'limiting reagents', 'percentage yield', 'solutions', 'concentration', 'dilution', 'laboratory safety'] },
  { id: 'shs1-chemistry-1.2', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Physical Chemistry', subStrandCode: '1.2', subStrand: 'Equilibria', pages: [44, 45], lo: 1, cs: 1, li: 3, topics: ['reversible reactions', 'dynamic equilibrium', 'Le Chatelier principle'] },
  { id: 'shs1-chemistry-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Systematic Chemistry of the Elements', subStrandCode: '2.1', subStrand: 'Periodicity', pages: [47, 48], lo: 1, cs: 1, li: 2, topics: ['periodic table trends', 'periodic classification'] },
  { id: 'shs1-chemistry-2.2', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Systematic Chemistry of the Elements', subStrandCode: '2.2', subStrand: 'Bonding', pages: [50, 51, 54], lo: 2, cs: 2, li: 5, topics: ['ionic bonding', 'covalent bonding', 'metallic bonding', 'intermolecular forces', 'properties of substances'] },
  { id: 'shs1-chemistry-3.1', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Chemistry of Carbon Compounds', subStrandCode: '3.1', subStrand: 'Characterisation of Organic Compounds', pages: [56, 57], lo: 1, cs: 1, li: 2, topics: ['organic and inorganic compounds', 'classification of organic compounds'] },
  { id: 'shs1-chemistry-3.2', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Chemistry of Carbon Compounds', subStrandCode: '3.2', subStrand: 'Organic Functional Groups', pages: [59, 61], lo: 1, cs: 1, li: 2, topics: ['homologous series', 'functional groups'] },
];

const shs2: SubSpec[] = [
  { id: 'shs2-chemistry-1.1', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Physical Chemistry', subStrandCode: '1.1', subStrand: 'Matter and its Properties', pages: [62, 63, 67], lo: 2, cs: 1, li: 8, topics: ['gas laws', 'ideal gas equation', 'kinetic molecular theory', 'vapour pressure', 'energetics', 'enthalpy change', 'Hess law', 'bond enthalpy'] },
  { id: 'shs2-chemistry-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Physical Chemistry', subStrandCode: '1.2', subStrand: 'Equilibria', pages: [69, 74], lo: 2, cs: 2, li: 9, topics: ['chemical equilibrium', 'equilibrium constant', 'factors affecting equilibrium', 'acid-base equilibrium', 'pH', 'buffers', 'solubility product', 'ionic equilibria', 'industrial equilibrium'] },
  { id: 'shs2-chemistry-2.1', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Systematic Chemistry of the Elements', subStrandCode: '2.1', subStrand: 'Periodicity', pages: [76, 77, 80], lo: 2, cs: 2, li: 4, topics: ['Group 1 elements', 'Group 2 elements', 'Group 7 elements', 'transition elements'] },
  { id: 'shs2-chemistry-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Systematic Chemistry of the Elements', subStrandCode: '2.2', subStrand: 'Bonding', pages: [82, 83], lo: 1, cs: 1, li: 2, topics: ['molecular shapes', 'hybridisation'] },
  { id: 'shs2-chemistry-3.1', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Chemistry of Carbon Compounds', subStrandCode: '3.1', subStrand: 'Characterisation of Organic Compounds', pages: [85, 87], lo: 1, cs: 1, li: 1, topics: ['isomerism in organic compounds'] },
  { id: 'shs2-chemistry-3.2', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Chemistry of Carbon Compounds', subStrandCode: '3.2', subStrand: 'Functional Group Chemistry', pages: [87, 93], lo: 1, cs: 1, li: 5, topics: ['alkanes', 'alkenes', 'alkynes', 'alkanols', 'alkanoic acids'] },
];

const shs3: SubSpec[] = [
  { id: 'shs3-chemistry-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Physical Chemistry', subStrandCode: '1.2', subStrand: 'Equilibria', pages: [94, 95, 105], lo: 4, cs: 4, li: 10, topics: ['redox equilibria', 'electrode potentials', 'electrochemical cells', 'electrolysis', 'Faraday laws', 'corrosion', 'reaction rates', 'rate laws', 'catalysis', 'industrial chemistry'] },
  { id: 'shs3-chemistry-2.1', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Systematic Chemistry of the Elements', subStrandCode: '2.1', subStrand: 'Periodicity', pages: [107, 108], lo: 1, cs: 1, li: 2, topics: ['periodic trends in advanced chemistry', 'properties of selected elements'] },
  { id: 'shs3-chemistry-3.2', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Chemistry of Carbon Compounds', subStrandCode: '3.2', subStrand: 'Organic Functional Groups', pages: [110, 111, 116], lo: 2, cs: 2, li: 4, topics: ['benzene and aromatic compounds', 'amines', 'amides', 'polymers'] },
];

export const chemistryShs1: ShsSubStrand[] = shs1.map(subStrand);
export const chemistryShs2: ShsSubStrand[] = shs2.map(subStrand);
export const chemistryShs3: ShsSubStrand[] = shs3.map(subStrand);

export const chemistry = [...chemistryShs1, ...chemistryShs2, ...chemistryShs3];
