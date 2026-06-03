import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Maps and atlases', 'Globes', 'Satellite images', 'GIS tools', 'Weather instruments', 'Fieldwork materials'];

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
    text: `Apply geographical concepts and skills to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use fieldwork, map analysis, GIS interpretation and collaborative enquiry to investigate ${topic.toLowerCase()}.`],
    assessment: { code: `${baseCode}.AS.${index}`, levels: assessmentLevels },
    resources,
    sourcePage: page,
  };
}

function subStrand(spec: Spec): ShsSubStrand {
  const baseCode = `${spec.year}.${spec.strandCode}.${spec.subStrandCode.split('.').at(-1)}`;
  const liDistribution = splitCount(spec.li, spec.cs);
  let topicIndex = 0;

  return {
    id: spec.id,
    subject: 'Geography',
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
        text: `Analyse ${spec.subStrand.toLowerCase()} through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Critical thinking', 'Communication and collaboration', 'Data literacy', 'Problem solving'],
        gesi: ['Use inclusive fieldwork and group roles that value diverse experiences of places and environments.'],
        sel: ['Build responsible decision-making, empathy and respect during environmental enquiry.'],
        values: ['Responsibility', 'Respect', 'Integrity', 'Sustainability'],
        sourcePages: spec.pages,
        contentStandards: hasStandard
          ? [
              {
                id: `${outcomeId}-cs-${loNumber}`,
                code: `${baseCode}.CS.${loNumber}`,
                text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} in geographical systems.`,
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

const shs1: Spec[] = [
  { id: 'shs1-geography-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'The Earth and its Neighbourhoods', subStrandCode: '1.1', subStrand: 'The Earth and its Features', pages: [26, 27, 28, 29, 33], lo: 4, cs: 4, li: 8, topics: ['earth structure', 'earth movements', 'latitude and longitude', 'time zones', 'landforms', 'drainage systems', 'weathering of landforms', 'earth resources'] },
  { id: 'shs1-geography-1.2', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'The Earth and its Neighbourhoods', subStrandCode: '1.2', subStrand: 'Rocks, Weathering, Soil and Mass Wasting', pages: [35, 36], lo: 1, cs: 1, li: 3, topics: ['rock types', 'weathering processes', 'soil formation'] },
  { id: 'shs1-geography-1.3', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'The Earth and its Neighbourhoods', subStrandCode: '1.3', subStrand: 'The Earth Atmosphere', pages: [38, 39, 40], lo: 1, cs: 1, li: 3, topics: ['atmospheric composition', 'weather elements', 'climate controls'] },
  { id: 'shs1-geography-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Navigating Our Environment', subStrandCode: '2.1', subStrand: 'Maps, Their Elements and Analyses', pages: [42, 43, 45], lo: 2, cs: 2, li: 4, topics: ['map elements', 'scale', 'direction and bearing', 'map interpretation'] },
  { id: 'shs1-geography-2.2', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Navigating Our Environment', subStrandCode: '2.2', subStrand: 'Geospatial Data Collection, Representation and Interpretation', pages: [47, 48], lo: 1, cs: 1, li: 2, topics: ['geospatial data collection', 'geospatial representation'] },
  { id: 'shs1-geography-3.1', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Human and Environment', subStrandCode: '3.1', subStrand: 'Physical Settings and People', pages: [50, 51, 52], lo: 1, cs: 1, li: 3, topics: ['settlement patterns', 'population distribution', 'human adaptation to physical settings'] },
  { id: 'shs1-geography-3.2', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Human and Environment', subStrandCode: '3.2', subStrand: 'Economic Activities', pages: [54, 55], lo: 1, cs: 1, li: 2, topics: ['primary economic activities', 'economic activity and environment'] },
  { id: 'shs1-geography-3.3', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Human and Environment', subStrandCode: '3.3', subStrand: 'Environmental Degradation', pages: [57, 58], lo: 1, cs: 1, li: 2, topics: ['causes of degradation', 'effects of degradation'] },
  { id: 'shs1-geography-3.4', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Human and Environment', subStrandCode: '3.4', subStrand: 'Environmental Hazards and Their Management', pages: [60, 61, 62], lo: 1, cs: 1, li: 2, topics: ['environmental hazards', 'hazard management'] },
];

const shs2: Spec[] = [
  { id: 'shs2-geography-1.1', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'The Earth and its Neighbourhoods', subStrandCode: '1.1', subStrand: 'The Earth and its Features', pages: [64, 65, 67], lo: 2, cs: 2, li: 4, topics: ['plate tectonics', 'earthquakes', 'volcanism', 'folding and faulting'] },
  { id: 'shs2-geography-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'The Earth and its Neighbourhoods', subStrandCode: '1.2', subStrand: 'Rocks, Weathering, Soil and Mass Wasting', pages: [69, 70], lo: 1, cs: 1, li: 2, topics: ['soil profiles', 'mass wasting'] },
  { id: 'shs2-geography-1.3', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'The Earth and its Neighbourhoods', subStrandCode: '1.3', subStrand: 'The Earth Atmosphere', pages: [72, 73], lo: 1, cs: 1, li: 3, topics: ['weather systems', 'climatic regions', 'climate variability'] },
  { id: 'shs2-geography-2.1', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Navigating Our Environment', subStrandCode: '2.1', subStrand: 'Maps, Their Elements and Analyses', pages: [75, 77], lo: 1, cs: 1, li: 4, topics: ['topographical maps', 'contours', 'cross-sections', 'map-based problem solving'] },
  { id: 'shs2-geography-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Navigating Our Environment', subStrandCode: '2.2', subStrand: 'Geospatial Data Collection, Representation and Interpretation', pages: [79, 80], lo: 1, cs: 1, li: 3, topics: ['remote sensing', 'GIS layers', 'spatial interpretation'] },
  { id: 'shs2-geography-3.1', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Human and Environment', subStrandCode: '3.1', subStrand: 'Physical Settings and People', pages: [82, 83], lo: 1, cs: 1, li: 2, topics: ['migration', 'urbanisation'] },
  { id: 'shs2-geography-3.2', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Human and Environment', subStrandCode: '3.2', subStrand: 'Economic Activities', pages: [85, 87], lo: 1, cs: 1, li: 2, topics: ['agriculture and industry', 'transport and trade'] },
  { id: 'shs2-geography-3.3', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Human and Environment', subStrandCode: '3.3', subStrand: 'Environmental Degradation', pages: [89, 90], lo: 1, cs: 1, li: 2, topics: ['land degradation', 'pollution control'] },
  { id: 'shs2-geography-3.4', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Human and Environment', subStrandCode: '3.4', subStrand: 'Environmental Hazards and Their Management', pages: [92, 93, 94], lo: 1, cs: 1, li: 2, topics: ['floods and droughts', 'disaster preparedness'] },
];

const shs3: Spec[] = [
  { id: 'shs3-geography-1.1', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'The Earth and its Neighbourhoods', subStrandCode: '1.1', subStrand: 'The Earth and its Features', pages: [96, 97], lo: 1, cs: 1, li: 2, topics: ['advanced geomorphology', 'landform development'] },
  { id: 'shs3-geography-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'The Earth and its Neighbourhoods', subStrandCode: '1.2', subStrand: 'Rocks, Weathering, Soil and Mass Wasting', pages: [99, 100], lo: 1, cs: 1, li: 3, topics: ['rock cycle applications', 'soil management', 'slope processes'] },
  { id: 'shs3-geography-1.3', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'The Earth and its Neighbourhoods', subStrandCode: '1.3', subStrand: 'The Earth Atmosphere', pages: [102, 103], lo: 1, cs: 1, li: 3, topics: ['climate change', 'weather forecasting', 'atmospheric hazards'] },
  { id: 'shs3-geography-2.1', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Navigating Our Environment', subStrandCode: '2.1', subStrand: 'Maps, Their Elements and Analyses', pages: [105, 106], lo: 1, cs: 1, li: 3, topics: ['advanced map interpretation', 'map calculations', 'field sketching'] },
  { id: 'shs3-geography-2.2', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Navigating Our Environment', subStrandCode: '2.2', subStrand: 'Geospatial Data Collection, Representation and Interpretation', pages: [106, 109], lo: 1, cs: 1, li: 2, topics: ['GIS analysis', 'geospatial decision-making'] },
  { id: 'shs3-geography-3.1', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Human and Environment', subStrandCode: '3.1', subStrand: 'Physical Settings and People', pages: [109, 114], lo: 2, cs: 2, li: 5, topics: ['population policies', 'settlement planning', 'regional development', 'resource use', 'human-environment interaction'] },
  { id: 'shs3-geography-3.2', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Human and Environment', subStrandCode: '3.2', subStrand: 'Economic Activities', pages: [114, 118], lo: 1, cs: 1, li: 3, topics: ['industrial location', 'tourism', 'sustainable economic development'] },
  { id: 'shs3-geography-3.3', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Human and Environment', subStrandCode: '3.3', subStrand: 'Environmental Degradation', pages: [118, 122], lo: 1, cs: 1, li: 3, topics: ['deforestation', 'desertification', 'environmental restoration'] },
  { id: 'shs3-geography-3.4', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Human and Environment', subStrandCode: '3.4', subStrand: 'Environmental Hazards and Their Management', pages: [122, 126], lo: 1, cs: 1, li: 2, topics: ['hazard risk reduction', 'community resilience'] },
];

export const geographyShs1: ShsSubStrand[] = shs1.map(subStrand);
export const geographyShs2: ShsSubStrand[] = shs2.map(subStrand);
export const geographyShs3: ShsSubStrand[] = shs3.map(subStrand);

export const geography = [...geographyShs1, ...geographyShs2, ...geographyShs3];
