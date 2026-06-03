import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['PhET interactive simulations', 'Videos', 'Projectors', 'Audio-visuals', 'Laboratory apparatus', 'Physics models'];

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
    text: `Apply physics concepts and skills to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use experiments, simulations, talk-for-learning and collaborative problem solving to investigate ${topic.toLowerCase()}.`],
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
    subject: 'Physics',
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
      const standardCode = `${baseCode}.CS.${loNumber}`;
      const hasStandard = index < spec.cs;

      return {
        id: outcomeId,
        code: `${baseCode}.LO.${loNumber}`,
        text: `Develop understanding of ${spec.subStrand.toLowerCase()} through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Critical thinking and problem solving', 'Communication and collaboration', 'Digital literacy', 'Creativity and innovation'],
        gesi: ['Use mixed-ability practical groups and challenge stereotypes about participation in Physics.'],
        sel: ['Build confidence, persistence and respectful collaboration during investigations.'],
        values: ['Resilience', 'Courage', 'Patience', 'Adaptability'],
        sourcePages: spec.pages,
        contentStandards: hasStandard
          ? [
              {
                id: `${outcomeId}-cs-${loNumber}`,
                code: standardCode,
                text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} in physical systems.`,
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
  { id: 'shs1-physics-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Mechanics and Matter', subStrandCode: '1.1', subStrand: 'Introduction to Physics', pages: [24, 25, 26, 27, 31], lo: 2, cs: 2, li: 8, topics: ['applications of Physics', 'measurement', 'physical quantities', 'units', 'instruments', 'uncertainty', 'scientific investigation', 'careers in Physics'] },
  { id: 'shs1-physics-1.2', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Mechanics and Matter', subStrandCode: '1.2', subStrand: 'Matter', pages: [32, 33, 34], lo: 1, cs: 1, li: 2, topics: ['properties of matter', 'states of matter'] },
  { id: 'shs1-physics-1.3', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Mechanics and Matter', subStrandCode: '1.3', subStrand: 'Kinematics', pages: [36, 37, 38], lo: 1, cs: 1, li: 3, topics: ['distance and displacement', 'speed and velocity', 'acceleration'] },
  { id: 'shs1-physics-1.4', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Mechanics and Matter', subStrandCode: '1.4', subStrand: 'Dynamics', pages: [40, 41, 45], lo: 2, cs: 2, li: 6, topics: ['forces', 'Newton laws', 'friction', 'momentum', 'impulse', 'equilibrium'] },
  { id: 'shs1-physics-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Energy', subStrandCode: '2.1', subStrand: 'Heat', pages: [46, 47, 49], lo: 1, cs: 1, li: 4, topics: ['temperature', 'heat transfer', 'thermal expansion', 'specific heat capacity'] },
  { id: 'shs1-physics-2.2', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Energy', subStrandCode: '2.2', subStrand: 'Waves', pages: [50, 51, 52, 53, 58], lo: 3, cs: 3, li: 10, topics: ['wave motion', 'transverse waves', 'longitudinal waves', 'reflection', 'refraction', 'diffraction', 'interference', 'sound waves', 'light waves', 'wave calculations'] },
  { id: 'shs1-physics-3.1', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Electric Field, Magnetic Field and Electronics', subStrandCode: '3.1', subStrand: 'Electrostatics', pages: [59, 60, 61, 62, 63], lo: 2, cs: 2, li: 7, topics: ['electric charge', 'electric fields', 'Coulomb law', 'conductors and insulators', 'charging methods', 'electric potential', 'applications of electrostatics'] },
  { id: 'shs1-physics-3.2', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Electric Field, Magnetic Field and Electronics', subStrandCode: '3.2', subStrand: 'Magnetostatics', pages: [65, 66, 67], lo: 1, cs: 1, li: 3, topics: ['magnetic fields', 'magnetic materials', 'force on current-carrying conductors'] },
  { id: 'shs1-physics-3.3', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Electric Field, Magnetic Field and Electronics', subStrandCode: '3.3', subStrand: 'Analogue Electronics', pages: [69, 70, 71, 72, 73, 78], lo: 3, cs: 3, li: 9, topics: ['semiconductors', 'diodes', 'rectification', 'transistors', 'amplification', 'logic signals', 'sensors', 'analogue circuits', 'circuit troubleshooting'] },
  { id: 'shs1-physics-4.1', year: 1, classLevel: 'SHS1', strandCode: '4', strand: 'Atomic and Nuclear Physics', subStrandCode: '4.1', subStrand: 'Atomic Physics', pages: [79, 80, 81], lo: 1, cs: 1, li: 2, topics: ['atomic structure', 'energy levels'] },
  { id: 'shs1-physics-4.2', year: 1, classLevel: 'SHS1', strandCode: '4', strand: 'Atomic and Nuclear Physics', subStrandCode: '4.2', subStrand: 'Nuclear Physics', pages: [83, 84, 85, 86], lo: 1, cs: 1, li: 3, topics: ['nuclear structure', 'radioactivity', 'nuclear reactions'] },
];

const shs2: SubSpec[] = [
  { id: 'shs2-physics-1.1', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Mechanics and Matter', subStrandCode: '1.1', subStrand: 'Basic Physics', pages: [87, 88, 89, 92], lo: 3, cs: 3, li: 7, topics: ['flotation', 'Archimedes principle', 'density', 'upthrust', 'viscosity', 'terminal velocity', 'practical measurements'] },
  { id: 'shs2-physics-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Mechanics and Matter', subStrandCode: '1.2', subStrand: 'Matter', pages: [93, 94, 95, 96], lo: 1, cs: 1, li: 4, topics: ['elasticity', 'Hooke law', 'stress and strain', 'Young modulus'] },
  { id: 'shs2-physics-1.3', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Mechanics and Matter', subStrandCode: '1.3', subStrand: 'Kinematics', pages: [97, 98, 99, 100, 101, 103], lo: 2, cs: 2, li: 7, topics: ['linear motion', 'motion graphs', 'projectiles', 'relative velocity', 'free fall', 'equations of motion', 'circular motion'] },
  { id: 'shs2-physics-1.4', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Mechanics and Matter', subStrandCode: '1.4', subStrand: 'Dynamics', pages: [105, 106, 107], lo: 1, cs: 1, li: 2, topics: ['work and energy', 'power'] },
  { id: 'shs2-physics-2.1', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Energy', subStrandCode: '2.1', subStrand: 'Heat', pages: [107, 108, 109, 110], lo: 1, cs: 1, li: 4, topics: ['gas laws', 'kinetic theory', 'thermal processes', 'latent heat'] },
  { id: 'shs2-physics-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Energy', subStrandCode: '2.2', subStrand: 'Waves', pages: [111, 112, 113, 114, 115, 116], lo: 2, cs: 2, li: 8, topics: ['superposition', 'stationary waves', 'resonance', 'Doppler effect', 'sound intensity', 'optical instruments', 'lenses', 'wave applications'] },
  { id: 'shs2-physics-3.1', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Electric Field, Magnetic Field and Electronics', subStrandCode: '3.1', subStrand: 'Electrostatics', pages: [117, 118, 119, 120, 121, 122], lo: 2, cs: 2, li: 9, topics: ['electric fields', 'electric potential', 'capacitors', 'capacitance', 'energy storage', 'series capacitors', 'parallel capacitors', 'electric field applications', 'charge distribution'] },
  { id: 'shs2-physics-3.2', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Electric Field, Magnetic Field and Electronics', subStrandCode: '3.2', subStrand: 'Electromagnetism', pages: [123, 124, 125, 126, 127, 128, 129, 132], lo: 3, cs: 3, li: 10, topics: ['magnetic flux', 'force on charges', 'force on conductors', 'motors', 'electromagnetic induction', 'Faraday law', 'Lenz law', 'generators', 'transformers', 'applications of electromagnetism'] },
  { id: 'shs2-physics-3.3', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Electric Field, Magnetic Field and Electronics', subStrandCode: '3.3', subStrand: 'Digital Electronics', pages: [133, 134, 135, 136, 137, 139], lo: 3, cs: 3, li: 9, topics: ['number systems', 'logic gates', 'truth tables', 'Boolean expressions', 'combinational circuits', 'flip-flops', 'digital signals', 'microelectronics', 'digital applications'] },
  { id: 'shs2-physics-4.1', year: 2, classLevel: 'SHS2', strandCode: '4', strand: 'Atomic and Nuclear Physics', subStrandCode: '4.1', subStrand: 'Atomic Physics', pages: [141, 142, 143, 145], lo: 1, cs: 1, li: 3, topics: ['photoelectric effect', 'laws of photoelectric effect', 'applications of photoelectric effect'] },
  { id: 'shs2-physics-4.2', year: 2, classLevel: 'SHS2', strandCode: '4', strand: 'Atomic and Nuclear Physics', subStrandCode: '4.2', subStrand: 'Nuclear Physics', pages: [143, 144, 145, 146], lo: 1, cs: 1, li: 3, topics: ['radioactive decay law', 'half-life', 'radioactive dating'] },
];

const shs3: SubSpec[] = [
  { id: 'shs3-physics-1.1', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Mechanics and Matter', subStrandCode: '1.1', subStrand: 'Basic Physics', pages: [147, 148, 149, 150, 151, 155], lo: 3, cs: 3, li: 13, topics: ['moments', 'centre of gravity', 'couples', 'torque', 'rotational equilibrium', 'machines', 'efficiency', 'simple harmonic motion', 'oscillations', 'damping', 'resonance', 'practical measurement', 'uncertainty analysis'] },
  { id: 'shs3-physics-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Mechanics and Matter', subStrandCode: '1.2', subStrand: 'Kinematics', pages: [157, 158, 159], lo: 1, cs: 1, li: 4, topics: ['angular displacement', 'angular velocity', 'centripetal acceleration', 'circular motion applications'] },
  { id: 'shs3-physics-1.3', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Mechanics and Matter', subStrandCode: '1.3', subStrand: 'Dynamics', pages: [161, 162, 163], lo: 1, cs: 1, li: 3, topics: ['gravitational fields', 'satellite motion', 'escape velocity'] },
  { id: 'shs3-physics-2.1', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Energy', subStrandCode: '2.1', subStrand: 'Heat', pages: [163, 164, 165], lo: 1, cs: 1, li: 3, topics: ['thermodynamic processes', 'first law of thermodynamics', 'heat engines'] },
  { id: 'shs3-physics-2.2', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Energy', subStrandCode: '2.2', subStrand: 'Wave', pages: [167, 168, 169], lo: 2, cs: 2, li: 6, topics: ['electromagnetic waves', 'polarisation', 'interference', 'diffraction grating', 'spectra', 'wave applications'] },
  { id: 'shs3-physics-3.1', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Electric Field, Magnetic Field and Electronics', subStrandCode: '3.1', subStrand: 'Direct Current', pages: [171, 172, 173, 174, 175, 176], lo: 3, cs: 3, li: 7, topics: ['current electricity', 'Ohm law', 'resistivity', 'series circuits', 'parallel circuits', 'Kirchhoff laws', 'electrical power'] },
  { id: 'shs3-physics-3.2', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Electric Field, Magnetic Field and Electronics', subStrandCode: '3.2', subStrand: 'Alternating Current', pages: [177, 178, 179, 180, 181], lo: 2, cs: 2, li: 6, topics: ['alternating current', 'rms values', 'reactance', 'impedance', 'resonance in AC circuits', 'power in AC circuits'] },
  { id: 'shs3-physics-3.3', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Electric Field, Magnetic Field and Electronics', subStrandCode: '3.3', subStrand: 'Electromagnetic Induction and Applications', pages: [183, 184, 185, 186, 187, 190], lo: 3, cs: 3, li: 9, topics: ['induced emf', 'Faraday law', 'Lenz law', 'self-inductance', 'mutual inductance', 'transformers', 'generators', 'eddy currents', 'induction applications'] },
  { id: 'shs3-physics-3.4', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Electric Field, Magnetic Field and Electronics', subStrandCode: '3.4', subStrand: 'Applications of Electronics', pages: [191, 192, 193, 194, 195, 196], lo: 3, cs: 3, li: 7, topics: ['communication systems', 'sensors', 'control circuits', 'rectifier applications', 'amplifier applications', 'logic applications', 'electronic devices'] },
  { id: 'shs3-physics-4.1', year: 3, classLevel: 'SHS3', strandCode: '4', strand: 'Atomic and Nuclear Physics', subStrandCode: '4.1', subStrand: 'Atomic Physics', pages: [197, 198, 199, 200], lo: 1, cs: 1, li: 4, topics: ['atomic spectra', 'energy quantisation', 'X-rays', 'atomic physics applications'] },
  { id: 'shs3-physics-4.2', year: 3, classLevel: 'SHS3', strandCode: '4', strand: 'Atomic and Nuclear Physics', subStrandCode: '4.2', subStrand: 'Nuclear Physics', pages: [201, 202, 203, 204], lo: 1, cs: 1, li: 3, topics: ['nuclear fission', 'nuclear fusion', 'nuclear energy applications'] },
];

export const physicsShs1: ShsSubStrand[] = shs1.map(subStrand);
export const physicsShs2: ShsSubStrand[] = shs2.map(subStrand);
export const physicsShs3: ShsSubStrand[] = shs3.map(subStrand);

export const physics = [...physicsShs1, ...physicsShs2, ...physicsShs3];
