import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Drawing instruments', 'Drawing boards', 'CAD tools', 'Models', 'Charts', 'Projector', 'Internet resources'];

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
    text: `Apply design and communication technology skills to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use demonstration, guided drawing, CAD exploration, model analysis and design critique to develop ${topic.toLowerCase()}.`],
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
    subject: 'Design and Communication Technology',
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
        text: `Create and communicate design solutions in ${spec.subStrand.toLowerCase()} through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Creativity and innovation', 'Critical thinking and problem solving', 'Communication and collaboration', 'Digital literacy'],
        gesi: ['Use inclusive design tasks and role models that challenge stereotypes about technical and drawing careers.'],
        sel: ['Build confidence, persistence, responsible decision-making and constructive response to critique.'],
        values: ['Creativity', 'Resourcefulness', 'Discipline', 'Responsibility', 'Respect'],
        sourcePages: spec.pages,
        contentStandards: Array.from({ length: csDistribution[index] ?? 0 }, () => {
          csIndex += 1;
          const standardId = `${outcomeId}-cs-${csIndex}`;

          return {
            id: standardId,
            code: `${baseCode}.CS.${csIndex}`,
            text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} in design communication practice.`,
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

const conceptSketchTopics = ['freehand sketching', 'idea generation', 'visual communication'];
const objectManipulationTopics = ['object views', 'scaling', 'transformation of forms'];
const patternTopics = ['pattern construction', 'repeat patterns', 'decorative design'];
const designRealisationTopics = ['design brief', 'artefact development', 'prototype evaluation'];
const planeTopics = ['geometric construction', 'tangency', 'loci', 'scale drawing', 'plane figures'];
const solidTopics = ['orthographic projection', 'isometric drawing', 'development of surfaces', 'sectional views', 'interpenetration'];
const fractalTopics = ['fractal patterns', 'recursive geometry'];
const buildingTopics = ['building symbols', 'floor plans', 'elevations', 'sections', 'site plans'];
const mechanicalTopics = ['machine components', 'assembly drawing', 'sectional mechanical views', 'dimensioning', 'working drawings'];
const garmentTopics = ['garment patterns', 'style lines', 'fashion flats', 'garment specification'];

const shs1: Spec[] = [
  { id: 'shs1-design-communication-technology-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Conceptual Drawing', subStrandCode: '1.1', subStrand: 'Concept Sketches', pages: [25, 28], lo: 1, cs: 1, li: 3, topics: conceptSketchTopics },
  { id: 'shs1-design-communication-technology-1.2', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Conceptual Drawing', subStrandCode: '1.2', subStrand: 'Object Manipulation in Drawing', pages: [28, 31], lo: 1, cs: 1, li: 3, topics: objectManipulationTopics },
  { id: 'shs1-design-communication-technology-1.3', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Conceptual Drawing', subStrandCode: '1.3', subStrand: 'Pattern Design', pages: [31, 34], lo: 1, cs: 1, li: 3, topics: patternTopics },
  { id: 'shs1-design-communication-technology-1.4', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Conceptual Drawing', subStrandCode: '1.4', subStrand: 'Design and Realisation', pages: [34, 36], lo: 1, cs: 1, li: 3, topics: designRealisationTopics },
  { id: 'shs1-design-communication-technology-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Geometry', subStrandCode: '2.1', subStrand: 'Plane Geometry', pages: [36, 39], lo: 1, cs: 1, li: 5, topics: planeTopics },
  { id: 'shs1-design-communication-technology-2.2', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Geometry', subStrandCode: '2.2', subStrand: 'Solid Geometry', pages: [39, 42], lo: 1, cs: 1, li: 4, topics: solidTopics },
  { id: 'shs1-design-communication-technology-2.3', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Geometry', subStrandCode: '2.3', subStrand: 'Fractal Geometry', pages: [42, 46], lo: 1, cs: 1, li: 2, topics: fractalTopics },
];

const shs2: Spec[] = [
  { id: 'shs2-design-communication-technology-1.1', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Conceptual Drawing', subStrandCode: '1.1', subStrand: 'Concept Sketches', pages: [46, 49], lo: 1, cs: 1, li: 3, topics: conceptSketchTopics },
  { id: 'shs2-design-communication-technology-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Conceptual Drawing', subStrandCode: '1.2', subStrand: 'Object Manipulation in Drawing', pages: [49, 52], lo: 1, cs: 1, li: 3, topics: objectManipulationTopics },
  { id: 'shs2-design-communication-technology-1.3', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Conceptual Drawing', subStrandCode: '1.3', subStrand: 'Pattern Design', pages: [52, 55], lo: 1, cs: 1, li: 3, topics: patternTopics },
  { id: 'shs2-design-communication-technology-1.4', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Conceptual Drawing', subStrandCode: '1.4', subStrand: 'Design and Realisation', pages: [55, 57], lo: 1, cs: 1, li: 2, topics: designRealisationTopics },
  { id: 'shs2-design-communication-technology-2.1', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Geometry', subStrandCode: '2.1', subStrand: 'Plane Geometry', pages: [57, 60], lo: 1, cs: 1, li: 3, topics: planeTopics },
  { id: 'shs2-design-communication-technology-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Geometry', subStrandCode: '2.2', subStrand: 'Solid Geometry', pages: [60, 65], lo: 2, cs: 2, li: 5, topics: solidTopics },
  { id: 'shs2-design-communication-technology-2.3', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Geometry', subStrandCode: '2.3', subStrand: 'Fractal Geometry', pages: [65, 68], lo: 1, cs: 1, li: 2, topics: fractalTopics },
  { id: 'shs2-design-communication-technology-3.1', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Extended Drawing', subStrandCode: '3.1', subStrand: 'Building Drawing', pages: [68, 72], lo: 2, cs: 2, li: 5, topics: buildingTopics },
  { id: 'shs2-design-communication-technology-3.2', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Extended Drawing', subStrandCode: '3.2', subStrand: 'Mechanical Drawing', pages: [72, 76], lo: 2, cs: 2, li: 5, topics: mechanicalTopics },
  { id: 'shs2-design-communication-technology-3.3', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Extended Drawing', subStrandCode: '3.3', subStrand: 'Garment Design Technology', pages: [76, 81], lo: 1, cs: 1, li: 4, topics: garmentTopics },
];

const shs3: Spec[] = [
  { id: 'shs3-design-communication-technology-1.1', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Conceptual Drawing', subStrandCode: '1.1', subStrand: 'Concept Sketches', pages: [81, 84], lo: 1, cs: 1, li: 2, topics: conceptSketchTopics },
  { id: 'shs3-design-communication-technology-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Conceptual Drawing', subStrandCode: '1.2', subStrand: 'Object Manipulation in Drawing', pages: [84, 86], lo: 1, cs: 1, li: 2, topics: objectManipulationTopics },
  { id: 'shs3-design-communication-technology-1.3', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Conceptual Drawing', subStrandCode: '1.3', subStrand: 'Pattern Design', pages: [86, 89], lo: 1, cs: 1, li: 3, topics: patternTopics },
  { id: 'shs3-design-communication-technology-2.1', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Geometry', subStrandCode: '2.1', subStrand: 'Plane Geometry', pages: [89, 92], lo: 1, cs: 1, li: 5, topics: planeTopics },
  { id: 'shs3-design-communication-technology-2.2', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Geometry', subStrandCode: '2.2', subStrand: 'Solid Geometry', pages: [92, 95], lo: 1, cs: 1, li: 3, topics: solidTopics },
  { id: 'shs3-design-communication-technology-2.3', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Geometry', subStrandCode: '2.3', subStrand: 'Fractal Geometry', pages: [95, 98], lo: 1, cs: 1, li: 2, topics: fractalTopics },
  { id: 'shs3-design-communication-technology-3.1', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Extended Drawing', subStrandCode: '3.1', subStrand: 'Building Drawing', pages: [98, 101], lo: 1, cs: 1, li: 5, topics: buildingTopics },
  { id: 'shs3-design-communication-technology-3.2', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Extended Drawing', subStrandCode: '3.2', subStrand: 'Mechanical Drawing', pages: [101, 104], lo: 1, cs: 1, li: 3, topics: mechanicalTopics },
  { id: 'shs3-design-communication-technology-3.3', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Extended Drawing', subStrandCode: '3.3', subStrand: 'Garment Design Technology', pages: [104, 109], lo: 1, cs: 1, li: 4, topics: garmentTopics },
];

export const designCommunicationTechnologyShs1: ShsSubStrand[] = shs1.map(subStrand);
export const designCommunicationTechnologyShs2: ShsSubStrand[] = shs2.map(subStrand);
export const designCommunicationTechnologyShs3: ShsSubStrand[] = shs3.map(subStrand);

export const designCommunicationTechnology = [...designCommunicationTechnologyShs1, ...designCommunicationTechnologyShs2, ...designCommunicationTechnologyShs3];
