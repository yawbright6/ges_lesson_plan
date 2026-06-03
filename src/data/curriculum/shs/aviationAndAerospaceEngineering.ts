import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Aircraft models', 'Videos', 'Flight diagrams', 'Simulation tools', 'Charts', 'CAD tools', 'Airport/aviation case studies'];

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
    text: `Apply aviation and aerospace engineering concepts to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use model building, simulation, diagram analysis, design challenge and collaborative enquiry to investigate ${topic.toLowerCase()}.`],
    assessment: { code: `${baseCode}.AS.${index}`, levels: assessmentLevels },
    resources,
    sourcePage: page,
  };
}

function subStrand(spec: Spec): ShsSubStrand {
  const baseCode = `${spec.year}.${spec.strandCode}.${spec.subStrandCode.split('.').at(-1)}`;
  const csDistribution = splitCount(spec.cs, spec.lo);
  const liDistribution = splitCount(spec.li, spec.cs);
  let topicIndex = 0;
  let csIndex = 0;

  return {
    id: spec.id,
    subject: 'Aviation and Aerospace Engineering',
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

      return {
        id: outcomeId,
        code: `${baseCode}.LO.${loNumber}`,
        text: `Analyse and design aviation solutions in ${spec.subStrand.toLowerCase()} through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Logical thinking', 'Problem solving', 'Creativity and innovation', 'Communication and collaboration'],
        gesi: ['Use inclusive aviation examples and role models that challenge stereotypes about aerospace careers.'],
        sel: ['Build resilience, attention to detail, teamwork and responsible decision-making in engineering tasks.'],
        values: ['Tolerance', 'Friendliness', 'Open-mindedness', 'Patience', 'Hard work', 'Humility'],
        sourcePages: spec.pages,
        contentStandards: Array.from({ length: csDistribution[index] ?? 0 }, () => {
          csIndex += 1;
          const standardId = `${outcomeId}-cs-${csIndex}`;

          return {
            id: standardId,
            code: `${baseCode}.CS.${csIndex}`,
            text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} in aviation and aerospace engineering.`,
            sourcePage: spec.pages.at(-1) ?? spec.pages[0],
            indicators: Array.from({ length: liDistribution[csIndex - 1] }, (_, liIndex) => {
              const topic = spec.topics[topicIndex % spec.topics.length];
              topicIndex += 1;
              return indicator(standardId, baseCode, topic, liIndex + 1, spec.pages.at(-1) ?? spec.pages[0]);
            }),
          } satisfies ShsContentStandard;
        }),
      };
    }),
  };
}

const flightTopics = ['history of flight', 'aerospace vehicles', 'parts of aircraft', 'forces of flight', 'flight principles', 'model aircraft'];
const aerodynamicsTopics = ['airfoils', 'lift and drag', 'propulsion systems', 'flight performance', 'stability', 'engine types', 'aerodynamic testing'];
const structuresTopics = ['aircraft structures', 'control surfaces', 'materials', 'loads', 'stability and control', 'structural testing', 'maintenance considerations', 'design trade-offs'];
const avionicsTopics = ['avionics systems', 'sensors', 'control systems', 'electrical systems', 'data systems', 'cockpit displays'];
const instrumentationTopics = ['flight instruments', 'measurement systems', 'instrument interpretation', 'calibration'];
const cnsTopics = ['communication systems', 'navigation systems', 'surveillance systems', 'air traffic management', 'radio systems', 'satellite navigation'];
const professionTopics = ['aviation careers', 'airport operations', 'safety culture', 'aviation services'];
const organisationTopics = ['aviation organisations', 'regulation', 'ICAO and IATA', 'Ghana aviation institutions'];
const maintenanceTopics = ['aircraft maintenance', 'inspection', 'repair procedures', 'maintenance records'];
const uavTopics = ['UAV types', 'UAV applications', 'mission planning', 'UAV operations'];
const safetyTopics = ['UAV safety', 'regulations', 'ethical operation'];
const fabricationTopics = ['UAV design', 'materials selection', 'fabrication', 'testing', 'iteration'];

const shs1: Spec[] = [
  { id: 'shs1-aviation-aerospace-engineering-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Core Concepts in Aerospace Engineering', subStrandCode: '1.1', subStrand: 'Fundamentals of Flight', pages: [23, 37], lo: 3, cs: 3, li: 6, topics: flightTopics },
  { id: 'shs1-aviation-aerospace-engineering-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Avionics', subStrandCode: '2.1', subStrand: 'Fundamentals of Avionics', pages: [37, 45], lo: 2, cs: 2, li: 6, topics: avionicsTopics },
  { id: 'shs1-aviation-aerospace-engineering-3.1', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Aviation Industry', subStrandCode: '3.1', subStrand: 'The Aviation Profession and Operations', pages: [45, 53], lo: 2, cs: 2, li: 4, topics: professionTopics },
  { id: 'shs1-aviation-aerospace-engineering-4.1', year: 1, classLevel: 'SHS1', strandCode: '4', strand: 'Unmanned Aerial Vehicles (UAVs)', subStrandCode: '4.1', subStrand: 'UAV Applications', pages: [53, 61], lo: 2, cs: 2, li: 4, topics: uavTopics },
];

const shs2: Spec[] = [
  { id: 'shs2-aviation-aerospace-engineering-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Core Concepts in Aerospace Engineering', subStrandCode: '1.2', subStrand: 'Aerodynamics and Propulsion', pages: [61, 75], lo: 3, cs: 3, li: 7, topics: aerodynamicsTopics },
  { id: 'shs2-aviation-aerospace-engineering-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Avionics', subStrandCode: '2.2', subStrand: 'Aircraft Instrumentation', pages: [75, 83], lo: 2, cs: 2, li: 4, topics: instrumentationTopics },
  { id: 'shs2-aviation-aerospace-engineering-3.2', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Aviation Industry', subStrandCode: '3.2', subStrand: 'Aviation Organisations', pages: [83, 91], lo: 2, cs: 2, li: 4, topics: organisationTopics },
  { id: 'shs2-aviation-aerospace-engineering-4.2', year: 2, classLevel: 'SHS2', strandCode: '4', strand: 'Unmanned Aerial Vehicles (UAVs)', subStrandCode: '4.2', subStrand: 'Safety and Regulations', pages: [91, 99], lo: 1, cs: 1, li: 3, topics: safetyTopics },
];

const shs3: Spec[] = [
  { id: 'shs3-aviation-aerospace-engineering-1.3', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Core Concepts in Aerospace Engineering', subStrandCode: '1.3', subStrand: 'Aircraft Structures and Control', pages: [99, 113], lo: 3, cs: 3, li: 8, topics: structuresTopics },
  { id: 'shs3-aviation-aerospace-engineering-2.3', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Avionics', subStrandCode: '2.3', subStrand: 'Communication, Navigation and Surveillance System', pages: [113, 121], lo: 3, cs: 3, li: 6, topics: cnsTopics },
  { id: 'shs3-aviation-aerospace-engineering-3.3', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Aviation Industry', subStrandCode: '3.3', subStrand: 'Aircraft Maintenance', pages: [121, 129], lo: 2, cs: 2, li: 4, topics: maintenanceTopics },
  { id: 'shs3-aviation-aerospace-engineering-4.3', year: 3, classLevel: 'SHS3', strandCode: '4', strand: 'Unmanned Aerial Vehicles (UAVs)', subStrandCode: '4.3', subStrand: 'Design and Fabrications of UAVs', pages: [129, 137], lo: 3, cs: 3, li: 5, topics: fabricationTopics },
];

export const aviationAndAerospaceEngineeringShs1: ShsSubStrand[] = shs1.map(subStrand);
export const aviationAndAerospaceEngineeringShs2: ShsSubStrand[] = shs2.map(subStrand);
export const aviationAndAerospaceEngineeringShs3: ShsSubStrand[] = shs3.map(subStrand);

export const aviationAndAerospaceEngineering = [...aviationAndAerospaceEngineeringShs1, ...aviationAndAerospaceEngineeringShs2, ...aviationAndAerospaceEngineeringShs3];
