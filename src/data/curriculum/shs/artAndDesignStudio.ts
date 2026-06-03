import type { ShsContentStandard, ShsLearningIndicator, ShsSubStrand } from './shsTypes';

const assessmentLevels = ['Level 1 Recall', 'Level 2 Skills of conceptual understanding', 'Level 3 Strategic reasoning', 'Level 4 Extended critical thinking and reasoning'];
const resources = ['Studio tools', 'Art materials', 'Sketchbooks', 'Portfolio samples', 'Digital design tools', 'Safety equipment', 'Exhibition resources'];

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
    text: `Apply art and design studio knowledge and skills to ${topic.toLowerCase()}.`,
    shortTopic: topic,
    pedagogicalExemplars: [`Use studio demonstration, design brief analysis, guided practice, peer critique and portfolio documentation to develop ${topic.toLowerCase()}.`],
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
    subject: 'Art and Design Studio',
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
        text: `Create and evaluate studio work in ${spec.subStrand.toLowerCase()} through ${spec.topics[index % spec.topics.length].toLowerCase()}.`,
        skillsAndCompetencies: ['Creativity and innovation', 'Critical thinking and problem solving', 'Communication and collaboration', 'Digital literacy'],
        gesi: ['Use inclusive studio briefs, materials and roles so all learners can participate meaningfully in making and critique.'],
        sel: ['Build perseverance, responsible decision-making, self-management and respectful response to feedback.'],
        values: ['Creativity', 'Discipline', 'Safety consciousness', 'Integrity', 'Responsibility'],
        sourcePages: spec.pages,
        contentStandards: hasStandard
          ? [
              {
                id: `${outcomeId}-cs-${loNumber}`,
                code: `${baseCode}.CS.${loNumber}`,
                text: `Demonstrate knowledge and understanding of ${spec.subStrand.toLowerCase()} in studio practice.`,
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

const scopeRoleTopics = ['studio practice', 'fields of art and design', 'career opportunities'];
const materialTopics = ['material properties', 'material preparation', 'studio methods'];
const professionalTopics = ['studio safety', 'ethical practice', 'professional conduct'];
const thinkingStudioTopics = ['ideation', 'design brief', 'creative problem solving'];
const fabricationTopics = ['tool handling', 'joining methods', 'construction processes', 'finishing', 'prototyping', 'material testing'];
const artefactTopics = ['production planning', 'artefact making', 'quality control'];
const portfolioTopics = ['documentation', 'portfolio selection', 'presentation'];

const shs1: Spec[] = [
  { id: 'shs1-art-design-studio-1.1', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Art and Design Theories and Application', subStrandCode: '1.1', subStrand: 'Meanings, Scope and Role of Art and Design Studio', pages: [25, 27, 29], lo: 1, cs: 1, li: 2, topics: scopeRoleTopics },
  { id: 'shs1-art-design-studio-1.2', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Art and Design Theories and Application', subStrandCode: '1.2', subStrand: 'Material Classifications and Methods', pages: [29, 35], lo: 3, cs: 1, li: 3, topics: materialTopics },
  { id: 'shs1-art-design-studio-1.3', year: 1, classLevel: 'SHS1', strandCode: '1', strand: 'Art and Design Theories and Application', subStrandCode: '1.3', subStrand: 'Professional Practice and Ethics', pages: [35, 38], lo: 1, cs: 1, li: 2, topics: professionalTopics },
  { id: 'shs1-art-design-studio-2.1', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Creative Methodologies', subStrandCode: '2.1', subStrand: 'Thinking Studio', pages: [38, 43], lo: 1, cs: 1, li: 3, topics: thinkingStudioTopics },
  { id: 'shs1-art-design-studio-2.2', year: 1, classLevel: 'SHS1', strandCode: '2', strand: 'Creative Methodologies', subStrandCode: '2.2', subStrand: 'Fabrication and Construction', pages: [43, 50], lo: 2, cs: 2, li: 4, topics: fabricationTopics },
  { id: 'shs1-art-design-studio-3.1', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Creative Project', subStrandCode: '3.1', subStrand: 'Artefact Production', pages: [50, 53], lo: 1, cs: 1, li: 2, topics: artefactTopics },
  { id: 'shs1-art-design-studio-3.2', year: 1, classLevel: 'SHS1', strandCode: '3', strand: 'Creative Project', subStrandCode: '3.2', subStrand: 'Portfolio Building', pages: [53, 58], lo: 1, cs: 1, li: 3, topics: portfolioTopics },
];

const shs2: Spec[] = [
  { id: 'shs2-art-design-studio-1.1', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Art and Design Theories and Application', subStrandCode: '1.1', subStrand: 'Meanings, Scope and Role of Art and Design Studio', pages: [58, 61], lo: 1, cs: 1, li: 2, topics: scopeRoleTopics },
  { id: 'shs2-art-design-studio-1.2', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Art and Design Theories and Application', subStrandCode: '1.2', subStrand: 'Material Classifications and Methods', pages: [61, 65], lo: 1, cs: 1, li: 2, topics: materialTopics },
  { id: 'shs2-art-design-studio-1.3', year: 2, classLevel: 'SHS2', strandCode: '1', strand: 'Art and Design Theories and Application', subStrandCode: '1.3', subStrand: 'Professional Practice and Ethics', pages: [65, 69], lo: 1, cs: 1, li: 2, topics: professionalTopics },
  { id: 'shs2-art-design-studio-2.1', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Creative Methodologies', subStrandCode: '2.1', subStrand: 'Thinking Studio', pages: [69, 73], lo: 1, cs: 1, li: 3, topics: thinkingStudioTopics },
  { id: 'shs2-art-design-studio-2.2', year: 2, classLevel: 'SHS2', strandCode: '2', strand: 'Creative Methodologies', subStrandCode: '2.2', subStrand: 'Fabrication and Construction', pages: [73, 80], lo: 2, cs: 2, li: 6, topics: fabricationTopics },
  { id: 'shs2-art-design-studio-3.1', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Creative Project', subStrandCode: '3.1', subStrand: 'Artefact Production', pages: [80, 84], lo: 1, cs: 1, li: 3, topics: artefactTopics },
  { id: 'shs2-art-design-studio-3.2', year: 2, classLevel: 'SHS2', strandCode: '3', strand: 'Creative Project', subStrandCode: '3.2', subStrand: 'Portfolio Building', pages: [84, 89], lo: 1, cs: 1, li: 3, topics: portfolioTopics },
];

const shs3: Spec[] = [
  { id: 'shs3-art-design-studio-1.1', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Art and Design Theories and Application', subStrandCode: '1.1', subStrand: 'Meanings, Scope and Role of Art and Design Studio', pages: [89, 93], lo: 1, cs: 1, li: 3, topics: scopeRoleTopics },
  { id: 'shs3-art-design-studio-1.2', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Art and Design Theories and Application', subStrandCode: '1.2', subStrand: 'Material Classifications and Methods', pages: [93, 97], lo: 1, cs: 1, li: 2, topics: materialTopics },
  { id: 'shs3-art-design-studio-1.3', year: 3, classLevel: 'SHS3', strandCode: '1', strand: 'Art and Design Theories and Application', subStrandCode: '1.3', subStrand: 'Professional Practice and Ethics', pages: [97, 101], lo: 1, cs: 1, li: 2, topics: professionalTopics },
  { id: 'shs3-art-design-studio-2.1', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Creative Methodologies', subStrandCode: '2.1', subStrand: 'Thinking Studio', pages: [101, 105], lo: 1, cs: 1, li: 3, topics: thinkingStudioTopics },
  { id: 'shs3-art-design-studio-2.2', year: 3, classLevel: 'SHS3', strandCode: '2', strand: 'Creative Methodologies', subStrandCode: '2.2', subStrand: 'Fabrication and Construction', pages: [105, 114], lo: 2, cs: 2, li: 6, topics: fabricationTopics },
  { id: 'shs3-art-design-studio-3.1', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Creative Project', subStrandCode: '3.1', subStrand: 'Artefact Production', pages: [114, 118], lo: 1, cs: 1, li: 3, topics: artefactTopics },
  { id: 'shs3-art-design-studio-3.2', year: 3, classLevel: 'SHS3', strandCode: '3', strand: 'Creative Project', subStrandCode: '3.2', subStrand: 'Portfolio Building', pages: [118, 123], lo: 1, cs: 1, li: 3, topics: portfolioTopics },
];

export const artAndDesignStudioShs1: ShsSubStrand[] = shs1.map(subStrand);
export const artAndDesignStudioShs2: ShsSubStrand[] = shs2.map(subStrand);
export const artAndDesignStudioShs3: ShsSubStrand[] = shs3.map(subStrand);

export const artAndDesignStudio = [...artAndDesignStudioShs1, ...artAndDesignStudioShs2, ...artAndDesignStudioShs3];
