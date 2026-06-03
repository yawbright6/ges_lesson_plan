import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Engineering tools', 'Safety equipment', 'Circuit kits', 'Prototype materials', 'CAD software', 'Microcontrollers', 'Projector', 'Internet sources'];

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
    text: `Apply engineering concepts, tools and design thinking to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use practical investigation, design challenge, simulation, prototyping, testing and group critique to explore ${topic.toLowerCase()}.`],
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
    subject: 'Engineering',
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
        text: `Design, explain and evaluate engineering solutions in ${spec.subStrand.toLowerCase()} through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Critical thinking and problem solving', 'Creativity and innovation', 'Communication and collaboration', 'Digital literacy'],
        gesi: ['Use inclusive engineering teams, equitable workshop roles and locally relevant design problems so all learners can contribute meaningfully.'],
        sel: ['Build resilience, safety consciousness, responsible decision-making and respectful teamwork during engineering tasks.'],
        values: ['Tolerance', 'Integrity', 'Accountability', 'Humility', 'Patriotism', 'Responsibility'],
        sourcePages: spec.pages,
        contentStandards: Array.from({ length: csDistribution[index] ?? 0 }, () => {
          csIndex += 1;
          const standardId = `${outcomeId}-cs-${csIndex}`;

          return {
            id: standardId,
            code: `${baseCode}.CS.${csIndex}`,
            text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} in engineering practice.`,
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

const societyTopics = ['engineering footprints', 'engineering disciplines', 'local engineering solutions', 'community needs', 'engineering careers'];
const safetyTopics = ['workshop safety', 'hazard identification', 'personal protective equipment', 'safe tool use', 'risk assessment', 'emergency response'];
const ethicsTopics = ['engineering ethics', 'professional conduct', 'accountability', 'intellectual property', 'sustainable practice', 'public safety'];
const circuitsTopics = ['electric circuits', 'electrical machines', 'measurement', 'motors', 'generators', 'power systems', 'troubleshooting'];
const renewableTopics = ['solar energy', 'wind energy', 'hydropower', 'bioenergy', 'renewable system design'];
const efficiencyTopics = ['energy efficiency', 'energy audit', 'conservation practices', 'load management'];
const designTopics = ['engineering design process', 'problem definition', 'ideation', 'modelling', 'testing', 'iteration'];
const prototypeTopics = ['rapid prototyping', 'materials selection', 'fabrication', 'testing'];
const automationTopics = ['automation technologies', 'sensors', 'actuators', 'control systems'];
const embeddedTopics = ['embedded systems', 'microcontrollers', 'programming', 'input and output devices', 'system integration', 'debugging'];

const strands = {
  practice: 'Engineering Practice',
  energy: 'Energy Systems',
  design: 'Systems Design and Prototyping',
  automation: 'Automation and Embedded Systems',
};

const shs1: Spec[] = [
  { id: 'shs1-engineering-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: strands.practice, subStrandCode: '1.1', subStrand: 'Engineering in Society', pages: [23, 26], lo: 2, cs: 1, li: 5, topics: societyTopics },
  { id: 'shs1-engineering-1.2', year: 1, classLevel: 'SHS1', strandCode: '1', strand: strands.practice, subStrandCode: '1.2', subStrand: 'Health and Safety in Engineering Practice', pages: [27, 30], lo: 2, cs: 1, li: 4, topics: safetyTopics },
  { id: 'shs1-engineering-1.3', year: 1, classLevel: 'SHS1', strandCode: '1', strand: strands.practice, subStrandCode: '1.3', subStrand: 'Ethics and Professional Practice', pages: [31, 33], lo: 2, cs: 1, li: 4, topics: ethicsTopics },
  { id: 'shs1-engineering-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: strands.energy, subStrandCode: '2.1', subStrand: 'Circuit and Machines', pages: [34, 38], lo: 2, cs: 1, li: 7, topics: circuitsTopics },
  { id: 'shs1-engineering-2.2', year: 1, classLevel: 'SHS1', strandCode: '2', strand: strands.energy, subStrandCode: '2.2', subStrand: 'Renewable Energy Systems', pages: [39, 42], lo: 2, cs: 1, li: 4, topics: renewableTopics },
  { id: 'shs1-engineering-2.3', year: 1, classLevel: 'SHS1', strandCode: '2', strand: strands.energy, subStrandCode: '2.3', subStrand: 'Energy Efficiency and Conservation', pages: [43, 46], lo: 2, cs: 1, li: 4, topics: efficiencyTopics },
  { id: 'shs1-engineering-3.1', year: 1, classLevel: 'SHS1', strandCode: '3', strand: strands.design, subStrandCode: '3.1', subStrand: 'Engineering Design', pages: [47, 50], lo: 2, cs: 1, li: 4, topics: designTopics },
  { id: 'shs1-engineering-3.2', year: 1, classLevel: 'SHS1', strandCode: '3', strand: strands.design, subStrandCode: '3.2', subStrand: 'Rapid Prototyping', pages: [51, 52], lo: 1, cs: 1, li: 1, topics: prototypeTopics },
  { id: 'shs1-engineering-4.1', year: 1, classLevel: 'SHS1', strandCode: '4', strand: strands.automation, subStrandCode: '4.1', subStrand: 'Automation Technologies', pages: [53, 56], lo: 2, cs: 1, li: 2, topics: automationTopics },
  { id: 'shs1-engineering-4.2', year: 1, classLevel: 'SHS1', strandCode: '4', strand: strands.automation, subStrandCode: '4.2', subStrand: 'Embedded Systems', pages: [57, 67], lo: 4, cs: 2, li: 6, topics: embeddedTopics },
];

const shs2: Spec[] = [
  { id: 'shs2-engineering-1.1', year: 2, classLevel: 'SHS2', strandCode: '1', strand: strands.practice, subStrandCode: '1.1', subStrand: 'Engineering in Society', pages: [68, 70], lo: 1, cs: 1, li: 2, topics: societyTopics },
  { id: 'shs2-engineering-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: strands.practice, subStrandCode: '1.2', subStrand: 'Health and Safety in Engineering Practice', pages: [71, 74], lo: 2, cs: 1, li: 6, topics: safetyTopics },
  { id: 'shs2-engineering-1.3', year: 2, classLevel: 'SHS2', strandCode: '1', strand: strands.practice, subStrandCode: '1.3', subStrand: 'Ethics and Professional Practice', pages: [75, 78], lo: 2, cs: 1, li: 6, topics: ethicsTopics },
  { id: 'shs2-engineering-2.1', year: 2, classLevel: 'SHS2', strandCode: '2', strand: strands.energy, subStrandCode: '2.1', subStrand: 'Circuits and Machines', pages: [79, 82], lo: 2, cs: 1, li: 5, topics: circuitsTopics },
  { id: 'shs2-engineering-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: strands.energy, subStrandCode: '2.2', subStrand: 'Renewable Energy Systems', pages: [83, 86], lo: 2, cs: 1, li: 4, topics: renewableTopics },
  { id: 'shs2-engineering-2.3', year: 2, classLevel: 'SHS2', strandCode: '2', strand: strands.energy, subStrandCode: '2.3', subStrand: 'Energy Efficiency and Conservation', pages: [87, 90], lo: 2, cs: 1, li: 4, topics: efficiencyTopics },
  { id: 'shs2-engineering-3.1', year: 2, classLevel: 'SHS2', strandCode: '3', strand: strands.design, subStrandCode: '3.1', subStrand: 'Engineering Design', pages: [91, 94], lo: 2, cs: 2, li: 2, topics: designTopics },
  { id: 'shs2-engineering-3.2', year: 2, classLevel: 'SHS2', strandCode: '3', strand: strands.design, subStrandCode: '3.2', subStrand: 'Rapid Prototyping', pages: [95, 98], lo: 2, cs: 2, li: 2, topics: prototypeTopics },
  { id: 'shs2-engineering-4.1', year: 2, classLevel: 'SHS2', strandCode: '4', strand: strands.automation, subStrandCode: '4.1', subStrand: 'Automation Technologies', pages: [99, 100], lo: 1, cs: 1, li: 1, topics: automationTopics },
  { id: 'shs2-engineering-4.2', year: 2, classLevel: 'SHS2', strandCode: '4', strand: strands.automation, subStrandCode: '4.2', subStrand: 'Embedded Systems', pages: [101, 105], lo: 2, cs: 2, li: 2, topics: embeddedTopics },
];

const shs3: Spec[] = [
  { id: 'shs3-engineering-1.1', year: 3, classLevel: 'SHS3', strandCode: '1', strand: strands.practice, subStrandCode: '1.1', subStrand: 'Engineering in Society', pages: [106, 109], lo: 2, cs: 1, li: 4, topics: societyTopics },
  { id: 'shs3-engineering-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: strands.practice, subStrandCode: '1.2', subStrand: 'Health and Safety in Engineering Practice', pages: [110, 113], lo: 2, cs: 1, li: 4, topics: safetyTopics },
  { id: 'shs3-engineering-1.3', year: 3, classLevel: 'SHS3', strandCode: '1', strand: strands.practice, subStrandCode: '1.3', subStrand: 'Ethics and Professional Practice', pages: [114, 116], lo: 1, cs: 1, li: 3, topics: ethicsTopics },
  { id: 'shs3-engineering-2.1', year: 3, classLevel: 'SHS3', strandCode: '2', strand: strands.energy, subStrandCode: '2.1', subStrand: 'Circuits and Machines', pages: [117, 120], lo: 2, cs: 1, li: 4, topics: circuitsTopics },
  { id: 'shs3-engineering-2.2', year: 3, classLevel: 'SHS3', strandCode: '2', strand: strands.energy, subStrandCode: '2.2', subStrand: 'Renewable Energy Systems', pages: [121, 124], lo: 2, cs: 1, li: 4, topics: renewableTopics },
  { id: 'shs3-engineering-2.3', year: 3, classLevel: 'SHS3', strandCode: '2', strand: strands.energy, subStrandCode: '2.3', subStrand: 'Energy Efficiency and Conservation', pages: [125, 128], lo: 2, cs: 1, li: 4, topics: efficiencyTopics },
  { id: 'shs3-engineering-3.1', year: 3, classLevel: 'SHS3', strandCode: '3', strand: strands.design, subStrandCode: '3.1', subStrand: 'Engineering Design', pages: [129, 132], lo: 2, cs: 2, li: 2, topics: designTopics },
  { id: 'shs3-engineering-3.2', year: 3, classLevel: 'SHS3', strandCode: '3', strand: strands.design, subStrandCode: '3.2', subStrand: 'Rapid Prototyping', pages: [133, 136], lo: 2, cs: 2, li: 2, topics: prototypeTopics },
  { id: 'shs3-engineering-4.1', year: 3, classLevel: 'SHS3', strandCode: '4', strand: strands.automation, subStrandCode: '4.1', subStrand: 'Automation Technologies', pages: [137, 141], lo: 2, cs: 1, li: 2, topics: automationTopics },
  { id: 'shs3-engineering-4.2', year: 3, classLevel: 'SHS3', strandCode: '4', strand: strands.automation, subStrandCode: '4.2', subStrand: 'Embedded Systems', pages: [142, 145], lo: 1, cs: 1, li: 1, topics: embeddedTopics },
];

export const engineeringShs1: ShsSubStrand[] = shs1.map(subStrand);
export const engineeringShs2: ShsSubStrand[] = shs2.map(subStrand);
export const engineeringShs3: ShsSubStrand[] = shs3.map(subStrand);

export const engineering = [...engineeringShs1, ...engineeringShs2, ...engineeringShs3];
