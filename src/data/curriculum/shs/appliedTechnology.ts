import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Workshop tools', 'Machine diagrams', 'Videos', 'Models', 'Projector', 'Local industry visits', 'Safety equipment'];

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
    text: `Apply applied technology knowledge and practical skills to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use workshop demonstration, practical production, simulation, field visit and group critique to explore ${topic.toLowerCase()}.`],
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
    subject: 'Applied Technology',
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
        text: `Apply technological problem-solving in ${spec.subStrand.toLowerCase()} through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Creativity and innovation', 'Critical thinking and problem solving', 'Communication and collaboration', 'Digital literacy'],
        gesi: ['Use gender-sensitive workshop roles and inclusive examples that challenge stereotypes about technical education.'],
        sel: ['Build confidence, safety consciousness, persistence and respectful teamwork in practical technology tasks.'],
        values: ['Creativity', 'Discipline', 'Responsibility', 'Resourcefulness', 'Respect'],
        sourcePages: spec.pages,
        contentStandards: Array.from({ length: csDistribution[index] ?? 0 }, () => {
          csIndex += 1;
          const standardId = `${outcomeId}-cs-${csIndex}`;

          return {
            id: standardId,
            code: `${baseCode}.CS.${csIndex}`,
            text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} in applied technology practice.`,
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

const engineTopics = ['engine systems', 'engine operation', 'engine servicing', 'fault diagnosis', 'engine maintenance', 'engine safety'];
const vehicleTopics = ['vehicle systems', 'vehicle components', 'braking and steering', 'vehicle maintenance', 'vehicle diagnostics', 'roadworthiness'];
const preConstructionTopics = ['site preparation', 'building materials', 'setting out', 'building drawings', 'estimating', 'safety', 'tools'];
const substructureTopics = ['foundation systems', 'substructure construction', 'walls', 'floors', 'roofing', 'finishes', 'building services', 'construction safety', 'maintenance', 'quantity estimation', 'superstructure detailing', 'site management'];
const electricalTopics = ['electrical symbols', 'circuit design', 'installation safety', 'wiring systems', 'protective devices', 'testing', 'fault finding', 'renewable systems', 'power control', 'lighting circuits', 'electrical drawings', 'maintenance'];
const electronicTopics = ['electronic components', 'semiconductor devices', 'circuit assembly', 'soldering', 'testing', 'fault diagnosis', 'sensors', 'control circuits', 'power supplies', 'logic circuits', 'measurement', 'maintenance'];
const metalTopics = ['engineering materials', 'hand tools', 'machine tools', 'measuring tools', 'cutting operations', 'metal forming'];
const weldingTopics = ['welding safety', 'welding processes', 'joint preparation', 'weld defects', 'finishing', 'fabrication'];
const woodToolsTopics = ['woodwork tools', 'wood machines', 'tool safety', 'machine maintenance'];
const woodProductionTopics = ['wood materials', 'artefact design', 'joint construction', 'wood finishing', 'product assembly', 'sustainable wood use', 'quality control', 'wood industry'];

const shs1: Spec[] = [
  { id: 'shs1-applied-technology-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Automotive Technology', subStrandCode: '1.1', subStrand: 'Introduction to Engine Technology', pages: [26, 29], lo: 1, cs: 1, li: 3, topics: engineTopics },
  { id: 'shs1-applied-technology-1.2', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Automotive Technology', subStrandCode: '1.2', subStrand: 'Introduction to Vehicle Technology', pages: [29, 33], lo: 1, cs: 1, li: 3, topics: vehicleTopics },
  { id: 'shs1-applied-technology-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Building Construction Technology', subStrandCode: '2.1', subStrand: 'Pre-Construction Activities', pages: [33, 42], lo: 2, cs: 2, li: 7, topics: preConstructionTopics },
  { id: 'shs1-applied-technology-3.1', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Electrical and Electronic Technology', subStrandCode: '3.1', subStrand: 'Electrical Systems Design', pages: [42, 48], lo: 1, cs: 1, li: 3, topics: electricalTopics },
  { id: 'shs1-applied-technology-3.2', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Electrical and Electronic Technology', subStrandCode: '3.2', subStrand: 'Electronic Devices and Circuits', pages: [54, 57], lo: 1, cs: 1, li: 3, topics: electronicTopics },
  { id: 'shs1-applied-technology-4.1', year: 1, classLevel: 'SHS1', strandCode: '4', strand: 'Metal Technology', subStrandCode: '4.1', subStrand: 'Engineering Materials, Tools and Machines', pages: [48, 51], lo: 1, cs: 1, li: 3, topics: metalTopics },
  { id: 'shs1-applied-technology-4.2', year: 1, classLevel: 'SHS1', strandCode: '4', strand: 'Metal Technology', subStrandCode: '4.2', subStrand: 'Welding Technology', pages: [51, 54], lo: 1, cs: 1, li: 4, topics: weldingTopics },
  { id: 'shs1-applied-technology-5.1', year: 1, classLevel: 'SHS1', strandCode: '5', strand: 'Woodwork Technology', subStrandCode: '5.1', subStrand: 'Tools and Machines in Woodwork', pages: [54, 57], lo: 1, cs: 1, li: 1, topics: woodToolsTopics },
  { id: 'shs1-applied-technology-5.2', year: 1, classLevel: 'SHS1', strandCode: '5', strand: 'Woodwork Technology', subStrandCode: '5.2', subStrand: 'Materials and Artefact Production in Ghana', pages: [57, 65], lo: 2, cs: 2, li: 5, topics: woodProductionTopics },
];

const shs2: Spec[] = [
  { id: 'shs2-applied-technology-1.1', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Automotive Technology', subStrandCode: '1.1', subStrand: 'Introduction to Engine Technology', pages: [65, 70], lo: 1, cs: 1, li: 6, topics: engineTopics },
  { id: 'shs2-applied-technology-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Automotive Technology', subStrandCode: '1.2', subStrand: 'Introduction to Vehicle Technology', pages: [70, 74], lo: 1, cs: 1, li: 6, topics: vehicleTopics },
  { id: 'shs2-applied-technology-2.1', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Metal Technology', subStrandCode: '2.1', subStrand: 'Engineering Materials, Tools and Machines', pages: [74, 79], lo: 1, cs: 1, li: 6, topics: metalTopics },
  { id: 'shs2-applied-technology-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Metal Technology', subStrandCode: '2.2', subStrand: 'Welding Technology', pages: [79, 83], lo: 1, cs: 1, li: 6, topics: weldingTopics },
  { id: 'shs2-applied-technology-3.2', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Building Construction Technology', subStrandCode: '3.2', subStrand: 'Substructure and Superstructure', pages: [83, 92], lo: 2, cs: 2, li: 12, topics: substructureTopics },
  { id: 'shs2-applied-technology-4.1', year: 2, classLevel: 'SHS2', strandCode: '4', strand: 'Wood Technology', subStrandCode: '4.1', subStrand: 'Tools and Machines in Woodwork', pages: [92, 99], lo: 1, cs: 1, li: 4, topics: woodToolsTopics },
  { id: 'shs2-applied-technology-4.2', year: 2, classLevel: 'SHS2', strandCode: '4', strand: 'Wood Technology', subStrandCode: '4.2', subStrand: 'Materials and Artefact Production in Ghana', pages: [99, 110], lo: 2, cs: 2, li: 8, topics: woodProductionTopics },
  { id: 'shs2-applied-technology-5.1', year: 2, classLevel: 'SHS2', strandCode: '5', strand: 'Electrical and Electronic Technology', subStrandCode: '5.1', subStrand: 'Electrical Systems Design', pages: [110, 117], lo: 1, cs: 1, li: 12, topics: electricalTopics },
  { id: 'shs2-applied-technology-5.2', year: 2, classLevel: 'SHS2', strandCode: '5', strand: 'Electrical and Electronic Technology', subStrandCode: '5.2', subStrand: 'Electronic Devices and Circuits', pages: [117, 126], lo: 1, cs: 1, li: 12, topics: electronicTopics },
];

const shs3: Spec[] = [
  { id: 'shs3-applied-technology-1.1', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Automotive Technology', subStrandCode: '1.1', subStrand: 'Introduction to Engine Technology', pages: [126, 131], lo: 1, cs: 1, li: 6, topics: engineTopics },
  { id: 'shs3-applied-technology-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Automotive Technology', subStrandCode: '1.2', subStrand: 'Introduction to Vehicle Technology', pages: [131, 136], lo: 1, cs: 1, li: 6, topics: vehicleTopics },
  { id: 'shs3-applied-technology-2.1', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Metal Technology', subStrandCode: '2.1', subStrand: 'Engineering Materials, Tools and Machines', pages: [136, 142], lo: 1, cs: 1, li: 6, topics: metalTopics },
  { id: 'shs3-applied-technology-2.2', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Metal Technology', subStrandCode: '2.2', subStrand: 'Welding Technology', pages: [142, 148], lo: 1, cs: 1, li: 6, topics: weldingTopics },
  { id: 'shs3-applied-technology-3.2', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Building Construction Technology', subStrandCode: '3.2', subStrand: 'Substructure and Superstructure', pages: [148, 162], lo: 2, cs: 2, li: 12, topics: substructureTopics },
  { id: 'shs3-applied-technology-4.1', year: 3, classLevel: 'SHS3', strandCode: '4', strand: 'Wood Technology', subStrandCode: '4.1', subStrand: 'Tools and Machines in Woodwork', pages: [162, 168], lo: 1, cs: 1, li: 3, topics: woodToolsTopics },
  { id: 'shs3-applied-technology-4.2', year: 3, classLevel: 'SHS3', strandCode: '4', strand: 'Wood Technology', subStrandCode: '4.2', subStrand: 'Materials and Artefact Production in Ghana', pages: [168, 176], lo: 1, cs: 2, li: 10, topics: woodProductionTopics },
  { id: 'shs3-applied-technology-5.1', year: 3, classLevel: 'SHS3', strandCode: '5', strand: 'Electrical and Electronic Technology', subStrandCode: '5.1', subStrand: 'Electrical Systems Design', pages: [176, 183], lo: 1, cs: 1, li: 12, topics: electricalTopics },
  { id: 'shs3-applied-technology-5.2', year: 3, classLevel: 'SHS3', strandCode: '5', strand: 'Electrical and Electronic Technology', subStrandCode: '5.2', subStrand: 'Electronic Devices and Circuits', pages: [183, 199], lo: 1, cs: 1, li: 12, topics: electronicTopics },
];

export const appliedTechnologyShs1: ShsSubStrand[] = shs1.map(subStrand);
export const appliedTechnologyShs2: ShsSubStrand[] = shs2.map(subStrand);
export const appliedTechnologyShs3: ShsSubStrand[] = shs3.map(subStrand);

export const appliedTechnology = [...appliedTechnologyShs1, ...appliedTechnologyShs2, ...appliedTechnologyShs3];
