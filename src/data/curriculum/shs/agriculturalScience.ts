import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Farm tools', 'Pictures', 'Videos', 'Field notebooks', 'Projector', 'Agricultural machinery models', 'Local farms and agribusinesses'];

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
    text: `Apply agricultural science knowledge and practical skills to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use field visits, demonstrations, digital learning, practical tasks and collaborative enquiry to investigate ${topic.toLowerCase()}.`],
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
    subject: 'Agricultural Science',
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
        text: `Apply agricultural knowledge in ${spec.subStrand.toLowerCase()} through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Critical thinking', 'Communication and collaboration', 'Digital literacy', 'Creativity and innovation'],
        gesi: ['Use inclusive agricultural examples and roles that challenge stereotypes about gender, location and farming careers.'],
        sel: ['Build confidence, responsible decision-making, teamwork and resilience in practical agricultural contexts.'],
        values: ['Respect', 'Tolerance', 'Resourcefulness', 'Responsible citizenship', 'Hard work'],
        sourcePages: spec.pages,
        contentStandards: Array.from({ length: csDistribution[index] ?? 0 }, () => {
          csIndex += 1;
          const standardId = `${outcomeId}-cs-${csIndex}`;

          return {
            id: standardId,
            code: `${baseCode}.CS.${csIndex}`,
            text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} in agricultural practice.`,
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

const misconceptionsTopics = ['importance of agriculture', 'misconceptions about farming', 'agricultural prospects', 'agribusiness start-up'];
const technologyTopics = ['drones in agriculture', 'digital agriculture', 'greenhouse technology', 'irrigation technology', 'precision farming'];
const machineryTopics = ['farm machinery', 'tractor operations', 'maintenance', 'safety', 'mechanisation services', 'appropriate tools'];
const cropTopics = ['crop enterprise', 'vegetable production', 'ornamental production'];
const animalTopics = ['animal enterprise', 'small ruminants', 'pigs and fish'];
const landTopics = ['land tenure systems', 'access to land', 'land use decisions'];
const supportTopics = ['extension services', 'credit support', 'input supply', 'market linkages', 'farmer organisations'];
const climateVariabilityTopics = ['climate variability', 'weather risks'];
const adaptationTopics = ['adaptation practices', 'climate-smart agriculture'];
const mitigationTopics = ['mitigation strategies'];

const shs1: Spec[] = [
  { id: 'shs1-agricultural-science-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'New Dawn in Agriculture', subStrandCode: '1.1', subStrand: 'Misconceptions and Prospects in Agriculture and Farming', pages: [23, 26], lo: 2, cs: 2, li: 4, topics: misconceptionsTopics },
  { id: 'shs1-agricultural-science-1.2', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'New Dawn in Agriculture', subStrandCode: '1.2', subStrand: 'Emerging Technologies in Agriculture', pages: [26, 30], lo: 2, cs: 2, li: 5, topics: technologyTopics },
  { id: 'shs1-agricultural-science-1.3', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'New Dawn in Agriculture', subStrandCode: '1.3', subStrand: 'Agricultural Machineries', pages: [30, 34], lo: 2, cs: 2, li: 5, topics: machineryTopics },
  { id: 'shs1-agricultural-science-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Farming for Jobs and Income', subStrandCode: '2.1', subStrand: 'Economic Production of Crops', pages: [34, 36], lo: 1, cs: 1, li: 3, topics: cropTopics },
  { id: 'shs1-agricultural-science-2.2', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Farming for Jobs and Income', subStrandCode: '2.2', subStrand: 'Economic Production of Animals', pages: [36, 39], lo: 1, cs: 1, li: 3, topics: animalTopics },
  { id: 'shs1-agricultural-science-3.1', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Mobilisation of Resources and Networks', subStrandCode: '3.1', subStrand: 'Land Tenure Systems for Agriculture', pages: [39, 41], lo: 1, cs: 1, li: 3, topics: landTopics },
  { id: 'shs1-agricultural-science-3.2', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Mobilisation of Resources and Networks', subStrandCode: '3.2', subStrand: 'Support Systems in Agriculture', pages: [41, 45], lo: 2, cs: 2, li: 5, topics: supportTopics },
  { id: 'shs1-agricultural-science-4.1', year: 1, classLevel: 'SHS1', strandCode: '4', strand: 'Agriculture and Climate', subStrandCode: '4.1', subStrand: 'Climate Variability', pages: [45, 47], lo: 1, cs: 1, li: 2, topics: climateVariabilityTopics },
  { id: 'shs1-agricultural-science-4.2', year: 1, classLevel: 'SHS1', strandCode: '4', strand: 'Agriculture and Climate', subStrandCode: '4.2', subStrand: 'Climate Change Adaptation', pages: [47, 49], lo: 1, cs: 1, li: 2, topics: adaptationTopics },
  { id: 'shs1-agricultural-science-4.3', year: 1, classLevel: 'SHS1', strandCode: '4', strand: 'Agriculture and Climate', subStrandCode: '4.3', subStrand: 'Climate Change Mitigation Strategies', pages: [49, 52], lo: 1, cs: 1, li: 1, topics: mitigationTopics },
];

const shs2: Spec[] = [
  { id: 'shs2-agricultural-science-1.1', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'New Dawn in Agriculture', subStrandCode: '1.1', subStrand: 'Misconceptions and Prospects in Agriculture and Farming', pages: [52, 54], lo: 1, cs: 1, li: 2, topics: misconceptionsTopics },
  { id: 'shs2-agricultural-science-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'New Dawn in Agriculture', subStrandCode: '1.2', subStrand: 'Emerging Technologies in Agriculture', pages: [54, 58], lo: 2, cs: 2, li: 5, topics: technologyTopics },
  { id: 'shs2-agricultural-science-1.3', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'New Dawn in Agriculture', subStrandCode: '1.3', subStrand: 'Agricultural Machineries', pages: [58, 62], lo: 2, cs: 2, li: 6, topics: machineryTopics },
  { id: 'shs2-agricultural-science-2.1', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Farming for Jobs and Income', subStrandCode: '2.1', subStrand: 'Economic Production of Crops', pages: [62, 64], lo: 1, cs: 1, li: 3, topics: cropTopics },
  { id: 'shs2-agricultural-science-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Farming for Jobs and Income', subStrandCode: '2.2', subStrand: 'Economic Production of Small Ruminants', pages: [64, 67], lo: 1, cs: 1, li: 3, topics: animalTopics },
  { id: 'shs2-agricultural-science-3.2', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Mobilisation of Resources and Networks', subStrandCode: '3.2', subStrand: 'Support Systems in Agriculture', pages: [67, 71], lo: 2, cs: 2, li: 5, topics: supportTopics },
  { id: 'shs2-agricultural-science-4.1', year: 2, classLevel: 'SHS2', strandCode: '4', strand: 'Agriculture and Climate', subStrandCode: '4.1', subStrand: 'Climate Variability and Change', pages: [71, 75], lo: 2, cs: 2, li: 2, topics: climateVariabilityTopics },
];

const shs3: Spec[] = [
  { id: 'shs3-agricultural-science-1.1', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'New Dawn in Agriculture', subStrandCode: '1.1', subStrand: 'Misconceptions and Prospects in Agriculture and Farming', pages: [75, 77], lo: 1, cs: 1, li: 2, topics: misconceptionsTopics },
  { id: 'shs3-agricultural-science-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'New Dawn in Agriculture', subStrandCode: '1.2', subStrand: 'Emerging Technologies in Agriculture', pages: [77, 81], lo: 2, cs: 2, li: 5, topics: technologyTopics },
  { id: 'shs3-agricultural-science-1.3', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'New Dawn in Agriculture', subStrandCode: '1.3', subStrand: 'Agricultural Machineries', pages: [81, 85], lo: 3, cs: 2, li: 6, topics: machineryTopics },
  { id: 'shs3-agricultural-science-2.1', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Farming for Jobs and Income', subStrandCode: '2.1', subStrand: 'Economic Production of Crops', pages: [85, 87], lo: 1, cs: 1, li: 3, topics: cropTopics },
  { id: 'shs3-agricultural-science-2.2', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Farming for Jobs and Income', subStrandCode: '2.2', subStrand: 'Economic Production of Pigs and Fish', pages: [87, 90], lo: 1, cs: 1, li: 3, topics: animalTopics },
  { id: 'shs3-agricultural-science-3.2', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Mobilisation of Resources and Networks', subStrandCode: '3.2', subStrand: 'Support Systems in Agriculture', pages: [90, 94], lo: 2, cs: 2, li: 5, topics: supportTopics },
  { id: 'shs3-agricultural-science-4.1', year: 3, classLevel: 'SHS3', strandCode: '4', strand: 'Agriculture and Climate', subStrandCode: '4.1', subStrand: 'Climate Variability and Change', pages: [94, 98], lo: 2, cs: 2, li: 2, topics: climateVariabilityTopics },
];

export const agriculturalScienceShs1: ShsSubStrand[] = shs1.map(subStrand);
export const agriculturalScienceShs2: ShsSubStrand[] = shs2.map(subStrand);
export const agriculturalScienceShs3: ShsSubStrand[] = shs3.map(subStrand);

export const agriculturalScience = [...agriculturalScienceShs1, ...agriculturalScienceShs2, ...agriculturalScienceShs3];
