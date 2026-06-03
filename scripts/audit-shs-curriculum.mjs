import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const subjectConfigs = [
  {
    name: 'General Science',
    slug: 'general-science',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/generalScienceShs1.ts',
        exportName: 'generalScienceShs1',
        expected: {
          subStrands: 7,
          learningOutcomes: 13,
          contentStandards: 12,
          explicitLearningIndicators: 21,
          scopeLearningIndicators: 22,
        },
        notes: [
          'The PDF scope table reports 22 Year 1 learning indicators; the explicit Year 1 content tables currently expose 21 LI rows.',
          '1.2.1.LO.3 is preserved as an overview learning outcome with no separate content standard because the content table folds it into 1.2.1.CS.2 / 1.2.1.LI.3.',
        ],
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/generalScienceShs2.ts',
        exportName: 'generalScienceShs2',
        expected: {
          subStrands: 7,
          learningOutcomes: 8,
          contentStandards: 8,
          explicitLearningIndicators: 18,
          scopeLearningIndicators: 18,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/generalScienceShs3.ts',
        exportName: 'generalScienceShs3',
        expected: {
          subStrands: 7,
          learningOutcomes: 10,
          contentStandards: 10,
          explicitLearningIndicators: 21,
          scopeLearningIndicators: 21,
        },
      },
    ],
  },
  {
    name: 'Mathematics',
    slug: 'mathematics',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/mathematicsShs1.ts',
        exportName: 'mathematicsShs1',
        expected: {
          subStrands: 8,
          learningOutcomes: 17,
          contentStandards: 16,
          explicitLearningIndicators: 45,
          scopeLearningIndicators: 45,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/mathematicsShs2.ts',
        exportName: 'mathematicsShs2',
        expected: {
          subStrands: 8,
          learningOutcomes: 16,
          contentStandards: 15,
          explicitLearningIndicators: 41,
          scopeLearningIndicators: 41,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/mathematicsShs3.ts',
        exportName: 'mathematicsShs3',
        expected: {
          subStrands: 6,
          learningOutcomes: 9,
          contentStandards: 9,
          explicitLearningIndicators: 22,
          scopeLearningIndicators: 22,
        },
      },
    ],
  },
  {
    name: 'Social Studies',
    slug: 'social-studies',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/socialStudiesShs1.ts',
        exportName: 'socialStudiesShs1',
        expected: {
          subStrands: 10,
          learningOutcomes: 11,
          contentStandards: 11,
          explicitLearningIndicators: 21,
          scopeLearningIndicators: 21,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/socialStudiesShs2.ts',
        exportName: 'socialStudiesShs2',
        expected: {
          subStrands: 12,
          learningOutcomes: 12,
          contentStandards: 12,
          explicitLearningIndicators: 28,
          scopeLearningIndicators: 28,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/socialStudiesShs3.ts',
        exportName: 'socialStudiesShs3',
        expected: {
          subStrands: 9,
          learningOutcomes: 10,
          contentStandards: 10,
          explicitLearningIndicators: 21,
          scopeLearningIndicators: 21,
        },
      },
    ],
  },
  {
    name: 'Biology',
    slug: 'biology',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/biologyShs1.ts',
        exportName: 'biologyShs1',
        expected: {
          subStrands: 8,
          learningOutcomes: 17,
          contentStandards: 17,
          explicitLearningIndicators: 27,
          scopeLearningIndicators: 27,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/biologyShs2.ts',
        exportName: 'biologyShs2',
        expected: {
          subStrands: 8,
          learningOutcomes: 12,
          contentStandards: 11,
          explicitLearningIndicators: 24,
          scopeLearningIndicators: 24,
        },
        notes: [
          '2.3.1.LO.4 is preserved as an overview learning outcome because the Biology scope summary reports one more LO than CS for SHS2 Living Organisms.',
        ],
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/biologyShs3.ts',
        exportName: 'biologyShs3',
        expected: {
          subStrands: 7,
          learningOutcomes: 12,
          contentStandards: 12,
          explicitLearningIndicators: 27,
          scopeLearningIndicators: 29,
        },
        notes: [
          'The Biology scope table gives SHS3 as 13 CS / 13 LO / 29 LI, but the visible Year 3 curriculum sections expose 12 LO groups and 27 mapped LI entries after normalising repeated extraction artefacts.',
        ],
      },
    ],
  },
  {
    name: 'English Language',
    slug: 'english-language',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/english.ts',
        exportName: 'englishShs1',
        expected: {
          subStrands: 12,
          learningOutcomes: 23,
          contentStandards: 15,
          explicitLearningIndicators: 43,
          scopeLearningIndicators: 43,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/english.ts',
        exportName: 'englishShs2',
        expected: {
          subStrands: 11,
          learningOutcomes: 19,
          contentStandards: 16,
          explicitLearningIndicators: 34,
          scopeLearningIndicators: 34,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/english.ts',
        exportName: 'englishShs3',
        expected: {
          subStrands: 11,
          learningOutcomes: 16,
          contentStandards: 15,
          explicitLearningIndicators: 25,
          scopeLearningIndicators: 25,
        },
      },
    ],
  },
  {
    name: 'Physics',
    slug: 'physics',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/physics.ts',
        exportName: 'physicsShs1',
        expected: {
          subStrands: 11,
          learningOutcomes: 18,
          contentStandards: 18,
          explicitLearningIndicators: 57,
          scopeLearningIndicators: 57,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/physics.ts',
        exportName: 'physicsShs2',
        expected: {
          subStrands: 11,
          learningOutcomes: 20,
          contentStandards: 20,
          explicitLearningIndicators: 66,
          scopeLearningIndicators: 66,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/physics.ts',
        exportName: 'physicsShs3',
        expected: {
          subStrands: 11,
          learningOutcomes: 21,
          contentStandards: 21,
          explicitLearningIndicators: 65,
          scopeLearningIndicators: 65,
        },
      },
    ],
  },
  {
    name: 'Chemistry',
    slug: 'chemistry',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/chemistry.ts',
        exportName: 'chemistryShs1',
        expected: {
          subStrands: 6,
          learningOutcomes: 10,
          contentStandards: 9,
          explicitLearningIndicators: 36,
          scopeLearningIndicators: 36,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/chemistry.ts',
        exportName: 'chemistryShs2',
        expected: {
          subStrands: 6,
          learningOutcomes: 9,
          contentStandards: 8,
          explicitLearningIndicators: 29,
          scopeLearningIndicators: 29,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/chemistry.ts',
        exportName: 'chemistryShs3',
        expected: {
          subStrands: 3,
          learningOutcomes: 7,
          contentStandards: 7,
          explicitLearningIndicators: 16,
          scopeLearningIndicators: 16,
        },
      },
    ],
  },
  {
    name: 'Additional Mathematics',
    slug: 'additional-mathematics',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/additionalMathematics.ts',
        exportName: 'additionalMathematicsShs1',
        expected: {
          subStrands: 8,
          learningOutcomes: 24,
          contentStandards: 11,
          explicitLearningIndicators: 74,
          scopeLearningIndicators: 73,
        },
        notes: [
          'The Additional Mathematics scope table prints SHS1 total LI as 73, but its visible sub-strand rows add to 74. The map preserves the row-level sub-strand counts.',
        ],
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/additionalMathematics.ts',
        exportName: 'additionalMathematicsShs2',
        expected: {
          subStrands: 7,
          learningOutcomes: 18,
          contentStandards: 12,
          explicitLearningIndicators: 41,
          scopeLearningIndicators: 60,
        },
        notes: [
          'The scope table total for SHS2 is 14 CS / 22 LO / 60 LI, but its visible sub-strand rows add to 12 CS / 18 LO / 41 LI. This entry preserves the row-level scope currently visible in the extracted table.',
        ],
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/additionalMathematics.ts',
        exportName: 'additionalMathematicsShs3',
        expected: {
          subStrands: 7,
          learningOutcomes: 14,
          contentStandards: 9,
          explicitLearningIndicators: 46,
          scopeLearningIndicators: 46,
        },
      },
    ],
  },
  {
    name: 'Computing',
    slug: 'computing',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/computing.ts',
        exportName: 'computingShs1',
        expected: {
          subStrands: 6,
          learningOutcomes: 6,
          contentStandards: 6,
          explicitLearningIndicators: 15,
          scopeLearningIndicators: 15,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/computing.ts',
        exportName: 'computingShs2',
        expected: {
          subStrands: 6,
          learningOutcomes: 6,
          contentStandards: 6,
          explicitLearningIndicators: 15,
          scopeLearningIndicators: 15,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/computing.ts',
        exportName: 'computingShs3',
        expected: {
          subStrands: 6,
          learningOutcomes: 6,
          contentStandards: 6,
          explicitLearningIndicators: 14,
          scopeLearningIndicators: 15,
        },
        notes: [
          'The Computing scope table total says 15 Year 3 LIs, while its visible row counts add to 14. The map preserves the row-level counts.',
        ],
      },
    ],
  },
  {
    name: 'Geography',
    slug: 'geography',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/geography.ts',
        exportName: 'geographyShs1',
        expected: {
          subStrands: 9,
          learningOutcomes: 13,
          contentStandards: 13,
          explicitLearningIndicators: 29,
          scopeLearningIndicators: 29,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/geography.ts',
        exportName: 'geographyShs2',
        expected: {
          subStrands: 9,
          learningOutcomes: 10,
          contentStandards: 10,
          explicitLearningIndicators: 24,
          scopeLearningIndicators: 24,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/geography.ts',
        exportName: 'geographyShs3',
        expected: {
          subStrands: 9,
          learningOutcomes: 10,
          contentStandards: 10,
          explicitLearningIndicators: 26,
          scopeLearningIndicators: 26,
        },
      },
    ],
  },
  {
    name: 'Government',
    slug: 'government',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/government.ts',
        exportName: 'governmentShs1',
        expected: {
          subStrands: 5,
          learningOutcomes: 6,
          contentStandards: 5,
          explicitLearningIndicators: 16,
          scopeLearningIndicators: 16,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/government.ts',
        exportName: 'governmentShs2',
        expected: {
          subStrands: 6,
          learningOutcomes: 8,
          contentStandards: 6,
          explicitLearningIndicators: 20,
          scopeLearningIndicators: 20,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/government.ts',
        exportName: 'governmentShs3',
        expected: {
          subStrands: 6,
          learningOutcomes: 7,
          contentStandards: 6,
          explicitLearningIndicators: 15,
          scopeLearningIndicators: 15,
        },
      },
    ],
  },
  {
    name: 'Accounting',
    slug: 'accounting',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/accounting.ts',
        exportName: 'accountingShs1',
        expected: {
          subStrands: 6,
          learningOutcomes: 6,
          contentStandards: 6,
          explicitLearningIndicators: 28,
          scopeLearningIndicators: 28,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/accounting.ts',
        exportName: 'accountingShs2',
        expected: {
          subStrands: 6,
          learningOutcomes: 9,
          contentStandards: 9,
          explicitLearningIndicators: 24,
          scopeLearningIndicators: 24,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/accounting.ts',
        exportName: 'accountingShs3',
        expected: {
          subStrands: 6,
          learningOutcomes: 7,
          contentStandards: 7,
          explicitLearningIndicators: 19,
          scopeLearningIndicators: 19,
        },
      },
    ],
  },
  {
    name: 'Management in Living',
    slug: 'management-in-living',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/managementInLiving.ts',
        exportName: 'managementInLivingShs1',
        expected: {
          subStrands: 5,
          learningOutcomes: 10,
          contentStandards: 10,
          explicitLearningIndicators: 30,
          scopeLearningIndicators: 30,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/managementInLiving.ts',
        exportName: 'managementInLivingShs2',
        expected: {
          subStrands: 5,
          learningOutcomes: 10,
          contentStandards: 10,
          explicitLearningIndicators: 32,
          scopeLearningIndicators: 32,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/managementInLiving.ts',
        exportName: 'managementInLivingShs3',
        expected: {
          subStrands: 5,
          learningOutcomes: 6,
          contentStandards: 6,
          explicitLearningIndicators: 16,
          scopeLearningIndicators: 16,
        },
      },
    ],
  },
  {
    name: 'Art and Design Foundation',
    slug: 'art-and-design-foundation',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/artAndDesignFoundation.ts',
        exportName: 'artAndDesignFoundationShs1',
        expected: {
          subStrands: 7,
          learningOutcomes: 10,
          contentStandards: 10,
          explicitLearningIndicators: 27,
          scopeLearningIndicators: 27,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/artAndDesignFoundation.ts',
        exportName: 'artAndDesignFoundationShs2',
        expected: {
          subStrands: 7,
          learningOutcomes: 10,
          contentStandards: 10,
          explicitLearningIndicators: 27,
          scopeLearningIndicators: 27,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/artAndDesignFoundation.ts',
        exportName: 'artAndDesignFoundationShs3',
        expected: {
          subStrands: 7,
          learningOutcomes: 10,
          contentStandards: 10,
          explicitLearningIndicators: 26,
          scopeLearningIndicators: 26,
        },
      },
    ],
  },
  {
    name: 'Art and Design Studio',
    slug: 'art-and-design-studio',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/artAndDesignStudio.ts',
        exportName: 'artAndDesignStudioShs1',
        expected: {
          subStrands: 7,
          learningOutcomes: 10,
          contentStandards: 8,
          explicitLearningIndicators: 19,
          scopeLearningIndicators: 19,
        },
        notes: [
          'Year 1 Material Classifications and Methods is preserved with 3 learning outcomes but 1 content standard, matching the scope summary structure.',
        ],
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/artAndDesignStudio.ts',
        exportName: 'artAndDesignStudioShs2',
        expected: {
          subStrands: 7,
          learningOutcomes: 8,
          contentStandards: 8,
          explicitLearningIndicators: 21,
          scopeLearningIndicators: 21,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/artAndDesignStudio.ts',
        exportName: 'artAndDesignStudioShs3',
        expected: {
          subStrands: 7,
          learningOutcomes: 8,
          contentStandards: 8,
          explicitLearningIndicators: 22,
          scopeLearningIndicators: 22,
        },
      },
    ],
  },
  {
    name: 'History',
    slug: 'history',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/history.ts',
        exportName: 'historyShs1',
        expected: {
          subStrands: 4,
          learningOutcomes: 7,
          contentStandards: 7,
          explicitLearningIndicators: 19,
          scopeLearningIndicators: 19,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/history.ts',
        exportName: 'historyShs2',
        expected: {
          subStrands: 5,
          learningOutcomes: 5,
          contentStandards: 5,
          explicitLearningIndicators: 16,
          scopeLearningIndicators: 16,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/history.ts',
        exportName: 'historyShs3',
        expected: {
          subStrands: 7,
          learningOutcomes: 7,
          contentStandards: 7,
          explicitLearningIndicators: 17,
          scopeLearningIndicators: 17,
        },
      },
    ],
  },
  {
    name: 'Christian Religious Studies',
    slug: 'christian-religious-studies',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/christianReligiousStudies.ts',
        exportName: 'christianReligiousStudiesShs1',
        expected: {
          subStrands: 4,
          learningOutcomes: 5,
          contentStandards: 5,
          explicitLearningIndicators: 20,
          scopeLearningIndicators: 20,
        },
        notes: [
          'The two Year 1 Background to the Study of Religion entries are preserved under one combined sub-strand with two learning outcomes and two content standards.',
        ],
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/christianReligiousStudies.ts',
        exportName: 'christianReligiousStudiesShs2',
        expected: {
          subStrands: 6,
          learningOutcomes: 6,
          contentStandards: 6,
          explicitLearningIndicators: 25,
          scopeLearningIndicators: 25,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/christianReligiousStudies.ts',
        exportName: 'christianReligiousStudiesShs3',
        expected: {
          subStrands: 5,
          learningOutcomes: 5,
          contentStandards: 5,
          explicitLearningIndicators: 22,
          scopeLearningIndicators: 22,
        },
      },
    ],
  },
  {
    name: 'Clothing and Textiles',
    slug: 'clothing-and-textiles',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/clothingAndTextiles.ts',
        exportName: 'clothingAndTextilesShs1',
        expected: {
          subStrands: 6,
          learningOutcomes: 14,
          contentStandards: 14,
          explicitLearningIndicators: 38,
          scopeLearningIndicators: 38,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/clothingAndTextiles.ts',
        exportName: 'clothingAndTextilesShs2',
        expected: {
          subStrands: 6,
          learningOutcomes: 13,
          contentStandards: 13,
          explicitLearningIndicators: 35,
          scopeLearningIndicators: 35,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/clothingAndTextiles.ts',
        exportName: 'clothingAndTextilesShs3',
        expected: {
          subStrands: 5,
          learningOutcomes: 5,
          contentStandards: 5,
          explicitLearningIndicators: 16,
          scopeLearningIndicators: 16,
        },
      },
    ],
  },
  {
    name: 'Food and Nutrition',
    slug: 'food-and-nutrition',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/foodAndNutrition.ts',
        exportName: 'foodAndNutritionShs1',
        expected: {
          subStrands: 4,
          learningOutcomes: 8,
          contentStandards: 9,
          explicitLearningIndicators: 23,
          scopeLearningIndicators: 23,
        },
        notes: [
          'Year 1 Food for Healthy Living is preserved with 2 learning outcomes and 3 content standards, matching the scope summary.',
        ],
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/foodAndNutrition.ts',
        exportName: 'foodAndNutritionShs2',
        expected: {
          subStrands: 4,
          learningOutcomes: 10,
          contentStandards: 10,
          explicitLearningIndicators: 27,
          scopeLearningIndicators: 27,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/foodAndNutrition.ts',
        exportName: 'foodAndNutritionShs3',
        expected: {
          subStrands: 4,
          learningOutcomes: 7,
          contentStandards: 7,
          explicitLearningIndicators: 18,
          scopeLearningIndicators: 18,
        },
      },
    ],
  },
  {
    name: 'Design and Communication Technology',
    slug: 'design-and-communication-technology',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/designCommunicationTechnology.ts',
        exportName: 'designCommunicationTechnologyShs1',
        expected: {
          subStrands: 7,
          learningOutcomes: 7,
          contentStandards: 7,
          explicitLearningIndicators: 23,
          scopeLearningIndicators: 23,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/designCommunicationTechnology.ts',
        exportName: 'designCommunicationTechnologyShs2',
        expected: {
          subStrands: 10,
          learningOutcomes: 13,
          contentStandards: 13,
          explicitLearningIndicators: 35,
          scopeLearningIndicators: 35,
        },
        notes: [
          'SHS2 preserves all three Extended Drawing option branches: Building Drawing, Mechanical Drawing and Garment Design Technology.',
        ],
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/designCommunicationTechnology.ts',
        exportName: 'designCommunicationTechnologyShs3',
        expected: {
          subStrands: 9,
          learningOutcomes: 9,
          contentStandards: 9,
          explicitLearningIndicators: 29,
          scopeLearningIndicators: 29,
        },
        notes: [
          'SHS3 preserves all three Extended Drawing option branches: Building Drawing, Mechanical Drawing and Garment Design Technology.',
        ],
      },
    ],
  },
  {
    name: 'Agricultural Science',
    slug: 'agricultural-science',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/agriculturalScience.ts',
        exportName: 'agriculturalScienceShs1',
        expected: {
          subStrands: 10,
          learningOutcomes: 14,
          contentStandards: 14,
          explicitLearningIndicators: 33,
          scopeLearningIndicators: 33,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/agriculturalScience.ts',
        exportName: 'agriculturalScienceShs2',
        expected: {
          subStrands: 7,
          learningOutcomes: 11,
          contentStandards: 11,
          explicitLearningIndicators: 26,
          scopeLearningIndicators: 26,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/agriculturalScience.ts',
        exportName: 'agriculturalScienceShs3',
        expected: {
          subStrands: 7,
          learningOutcomes: 12,
          contentStandards: 11,
          explicitLearningIndicators: 26,
          scopeLearningIndicators: 26,
        },
        notes: [
          'SHS3 Agricultural Machineries is preserved with 3 learning outcomes and 2 content standards, matching the scope summary.',
        ],
      },
    ],
  },
  {
    name: 'Business Management',
    slug: 'business-management',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/businessManagement.ts',
        exportName: 'businessManagementShs1',
        expected: {
          subStrands: 4,
          learningOutcomes: 4,
          contentStandards: 4,
          explicitLearningIndicators: 22,
          scopeLearningIndicators: 22,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/businessManagement.ts',
        exportName: 'businessManagementShs2',
        expected: {
          subStrands: 3,
          learningOutcomes: 8,
          contentStandards: 8,
          explicitLearningIndicators: 16,
          scopeLearningIndicators: 16,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/businessManagement.ts',
        exportName: 'businessManagementShs3',
        expected: {
          subStrands: 3,
          learningOutcomes: 4,
          contentStandards: 4,
          explicitLearningIndicators: 10,
          scopeLearningIndicators: 10,
        },
      },
    ],
  },
  {
    name: 'Economics',
    slug: 'economics',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/economics.ts',
        exportName: 'economicsShs1',
        expected: {
          subStrands: 10,
          learningOutcomes: 13,
          contentStandards: 12,
          explicitLearningIndicators: 28,
          scopeLearningIndicators: 28,
        },
        notes: [
          'SHS1 Introduction to the Subject Economics is preserved with 2 learning outcomes and 1 content standard, matching the scope summary.',
        ],
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/economics.ts',
        exportName: 'economicsShs2',
        expected: {
          subStrands: 10,
          learningOutcomes: 13,
          contentStandards: 13,
          explicitLearningIndicators: 30,
          scopeLearningIndicators: 30,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/economics.ts',
        exportName: 'economicsShs3',
        expected: {
          subStrands: 9,
          learningOutcomes: 12,
          contentStandards: 12,
          explicitLearningIndicators: 26,
          scopeLearningIndicators: 26,
        },
      },
    ],
  },
  {
    name: 'Information and Communications Technology',
    slug: 'information-and-communications-technology',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/ict.ts',
        exportName: 'ictShs1',
        expected: {
          subStrands: 5,
          learningOutcomes: 5,
          contentStandards: 5,
          explicitLearningIndicators: 15,
          scopeLearningIndicators: 15,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/ict.ts',
        exportName: 'ictShs2',
        expected: {
          subStrands: 5,
          learningOutcomes: 5,
          contentStandards: 5,
          explicitLearningIndicators: 13,
          scopeLearningIndicators: 13,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/ict.ts',
        exportName: 'ictShs3',
        expected: {
          subStrands: 5,
          learningOutcomes: 5,
          contentStandards: 5,
          explicitLearningIndicators: 11,
          scopeLearningIndicators: 11,
        },
      },
    ],
  },
  {
    name: 'Biomedical Science',
    slug: 'biomedical-science',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/biomedicalScience.ts',
        exportName: 'biomedicalScienceShs1',
        expected: {
          subStrands: 7,
          learningOutcomes: 7,
          contentStandards: 7,
          explicitLearningIndicators: 22,
          scopeLearningIndicators: 22,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/biomedicalScience.ts',
        exportName: 'biomedicalScienceShs2',
        expected: {
          subStrands: 7,
          learningOutcomes: 8,
          contentStandards: 8,
          explicitLearningIndicators: 25,
          scopeLearningIndicators: 25,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/biomedicalScience.ts',
        exportName: 'biomedicalScienceShs3',
        expected: {
          subStrands: 7,
          learningOutcomes: 7,
          contentStandards: 7,
          explicitLearningIndicators: 22,
          scopeLearningIndicators: 22,
        },
      },
    ],
  },
  {
    name: 'Applied Technology',
    slug: 'applied-technology',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/appliedTechnology.ts',
        exportName: 'appliedTechnologyShs1',
        expected: {
          subStrands: 9,
          learningOutcomes: 11,
          contentStandards: 11,
          explicitLearningIndicators: 32,
          scopeLearningIndicators: 32,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/appliedTechnology.ts',
        exportName: 'appliedTechnologyShs2',
        expected: {
          subStrands: 9,
          learningOutcomes: 11,
          contentStandards: 11,
          explicitLearningIndicators: 72,
          scopeLearningIndicators: 72,
        },
        notes: [
          'SHS2 preserves all three Applied Technology option pathways: Automobile and Metal, Building Construction and Wood, and Electrical and Electronic Technology.',
        ],
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/appliedTechnology.ts',
        exportName: 'appliedTechnologyShs3',
        expected: {
          subStrands: 9,
          learningOutcomes: 10,
          contentStandards: 11,
          explicitLearningIndicators: 73,
          scopeLearningIndicators: 73,
        },
        notes: [
          'SHS3 preserves all three Applied Technology option pathways; Materials and Artefact Production in Ghana has 1 LO and 2 CS in the source summary.',
        ],
      },
    ],
  },
  {
    name: 'Aviation and Aerospace Engineering',
    slug: 'aviation-and-aerospace-engineering',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/aviationAndAerospaceEngineering.ts',
        exportName: 'aviationAndAerospaceEngineeringShs1',
        expected: {
          subStrands: 4,
          learningOutcomes: 9,
          contentStandards: 9,
          explicitLearningIndicators: 20,
          scopeLearningIndicators: 20,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/aviationAndAerospaceEngineering.ts',
        exportName: 'aviationAndAerospaceEngineeringShs2',
        expected: {
          subStrands: 4,
          learningOutcomes: 8,
          contentStandards: 8,
          explicitLearningIndicators: 18,
          scopeLearningIndicators: 18,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/aviationAndAerospaceEngineering.ts',
        exportName: 'aviationAndAerospaceEngineeringShs3',
        expected: {
          subStrands: 4,
          learningOutcomes: 11,
          contentStandards: 11,
          explicitLearningIndicators: 23,
          scopeLearningIndicators: 23,
        },
      },
    ],
  },
  {
    name: 'Religious and Moral Education',
    slug: 'religious-and-moral-education',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/religiousAndMoralEducation.ts',
        exportName: 'religiousAndMoralEducationShs1',
        expected: {
          subStrands: 3,
          learningOutcomes: 3,
          contentStandards: 3,
          explicitLearningIndicators: 7,
          scopeLearningIndicators: 7,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/religiousAndMoralEducation.ts',
        exportName: 'religiousAndMoralEducationShs2',
        expected: {
          subStrands: 3,
          learningOutcomes: 3,
          contentStandards: 3,
          explicitLearningIndicators: 6,
          scopeLearningIndicators: 6,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/religiousAndMoralEducation.ts',
        exportName: 'religiousAndMoralEducationShs3',
        expected: {
          subStrands: 3,
          learningOutcomes: 3,
          contentStandards: 3,
          explicitLearningIndicators: 6,
          scopeLearningIndicators: 6,
        },
      },
    ],
  },
  {
    name: 'French',
    slug: 'french',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/french.ts',
        exportName: 'frenchShs1',
        expected: {
          subStrands: 12,
          learningOutcomes: 17,
          contentStandards: 17,
          explicitLearningIndicators: 68,
          scopeLearningIndicators: 68,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/french.ts',
        exportName: 'frenchShs2',
        expected: {
          subStrands: 13,
          learningOutcomes: 19,
          contentStandards: 19,
          explicitLearningIndicators: 76,
          scopeLearningIndicators: 76,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/french.ts',
        exportName: 'frenchShs3',
        expected: {
          subStrands: 10,
          learningOutcomes: 13,
          contentStandards: 13,
          explicitLearningIndicators: 45,
          scopeLearningIndicators: 45,
        },
      },
    ],
  },
  {
    name: 'Literature-in-English',
    slug: 'literature-in-english',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/literatureInEnglish.ts',
        exportName: 'literatureInEnglishShs1',
        expected: {
          subStrands: 10,
          learningOutcomes: 18,
          contentStandards: 16,
          explicitLearningIndicators: 46,
          scopeLearningIndicators: 46,
        },
        notes: [
          'SHS1 has two more learning outcomes than content standards in the source summary; the extra LOs are preserved as overview-only outcomes.',
        ],
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/literatureInEnglish.ts',
        exportName: 'literatureInEnglishShs2',
        expected: {
          subStrands: 9,
          learningOutcomes: 13,
          contentStandards: 13,
          explicitLearningIndicators: 37,
          scopeLearningIndicators: 37,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/literatureInEnglish.ts',
        exportName: 'literatureInEnglishShs3',
        expected: {
          subStrands: 9,
          learningOutcomes: 10,
          contentStandards: 10,
          explicitLearningIndicators: 29,
          scopeLearningIndicators: 29,
        },
      },
    ],
  },
  {
    name: 'Islamic Religious Studies',
    slug: 'islamic-religious-studies',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/islamicReligiousStudies.ts',
        exportName: 'islamicReligiousStudiesShs1',
        expected: {
          subStrands: 4,
          learningOutcomes: 5,
          contentStandards: 5,
          explicitLearningIndicators: 21,
          scopeLearningIndicators: 21,
        },
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/islamicReligiousStudies.ts',
        exportName: 'islamicReligiousStudiesShs2',
        expected: {
          subStrands: 5,
          learningOutcomes: 5,
          contentStandards: 5,
          explicitLearningIndicators: 21,
          scopeLearningIndicators: 21,
        },
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/islamicReligiousStudies.ts',
        exportName: 'islamicReligiousStudiesShs3',
        expected: {
          subStrands: 5,
          learningOutcomes: 5,
          contentStandards: 5,
          explicitLearningIndicators: 18,
          scopeLearningIndicators: 18,
        },
      },
    ],
  },
  {
    name: 'Engineering',
    slug: 'engineering',
    levels: [
      {
        name: 'SHS1',
        file: 'src/data/curriculum/shs/engineering.ts',
        exportName: 'engineeringShs1',
        expected: {
          subStrands: 10,
          learningOutcomes: 21,
          contentStandards: 11,
          explicitLearningIndicators: 41,
          scopeLearningIndicators: 41,
        },
        notes: [
          'Engineering SHS1 has more LOs than CS in the source summary; extra LOs are preserved as overview-only outcomes.',
        ],
      },
      {
        name: 'SHS2',
        file: 'src/data/curriculum/shs/engineering.ts',
        exportName: 'engineeringShs2',
        expected: {
          subStrands: 10,
          learningOutcomes: 18,
          contentStandards: 13,
          explicitLearningIndicators: 34,
          scopeLearningIndicators: 34,
        },
        notes: [
          'Engineering SHS2 has more LOs than CS in several sub-strands; extra LOs are preserved as overview-only outcomes.',
        ],
      },
      {
        name: 'SHS3',
        file: 'src/data/curriculum/shs/engineering.ts',
        exportName: 'engineeringShs3',
        expected: {
          subStrands: 10,
          learningOutcomes: 18,
          contentStandards: 12,
          explicitLearningIndicators: 30,
          scopeLearningIndicators: 30,
        },
        notes: [
          'Engineering SHS3 has more LOs than CS in several sub-strands; extra LOs are preserved as overview-only outcomes.',
        ],
      },
    ],
  },
];

const options = parseOptions(process.argv.slice(2));

if (options.help) {
  printHelp();
  process.exit(0);
}

if (options.list) {
  printSubjectList();
  process.exit(0);
}

const selectedSubjects = selectSubjects(subjectConfigs, options);
if (!selectedSubjects.length) {
  console.error('No SHS curriculum subjects matched the requested filters.');
  process.exit(1);
}

const results = selectedSubjects.map(auditSubject);
printResults(results, options);

const hasErrors = results.some((subject) =>
  subject.levels.some((level) => level.errors.length > 0)
);

if (hasErrors) process.exitCode = 1;

function auditSubject(subject) {
  return {
    subject,
    levels: subject.levels
      .filter((level) => !options.levels.size || options.levels.has(level.name.toLowerCase()))
      .map((level) => auditLevel(subject, level)),
  };
}

function auditLevel(subject, level) {
  const errors = [];
  const infos = [];
  const warnings = [];
  const filePath = resolve(rootDir, level.file);

  if (!existsSync(filePath)) {
    return {
      subject,
      level,
      counts: emptyCounts(),
      errors: [`Missing file: ${level.file}`],
      infos,
      warnings,
    };
  }

  let records = [];
  try {
    const moduleExports = loadTsModule(filePath);
    records = moduleExports[level.exportName];
    if (!Array.isArray(records)) {
      errors.push(`Export ${level.exportName} is not an array.`);
      records = [];
    }
  } catch (err) {
    errors.push(`Unable to load ${level.file}: ${err.message}`);
  }

  const counts = countRecords(records);
  compareExpectedCounts(level.expected, counts, errors, warnings);
  validateRecords(records, {
    subjectName: subject.name,
    levelName: level.name,
    errors,
    warnings,
    infos,
  });

  for (const note of level.notes ?? []) infos.push(note);

  return { subject, level, counts, errors, warnings, infos };
}

function loadTsModule(filePath) {
  const source = readFileSync(filePath, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: filePath,
  }).outputText;

  const module = { exports: {} };
  const sandbox = {
    exports: module.exports,
    module,
    require: (request) => {
      if (request.startsWith('./') || request.startsWith('../')) return {};
      return require(request);
    },
  };

  vm.runInNewContext(output, sandbox, { filename: filePath });
  return module.exports;
}

function countRecords(subStrands) {
  const counts = emptyCounts();
  counts.subStrands = subStrands.length;

  for (const subStrand of subStrands) {
    counts.learningOutcomes += subStrand.learningOutcomes?.length ?? 0;
    for (const outcome of subStrand.learningOutcomes ?? []) {
      counts.contentStandards += outcome.contentStandards?.length ?? 0;
      for (const standard of outcome.contentStandards ?? []) {
        counts.learningIndicators += standard.indicators?.length ?? 0;
      }
    }
  }

  return counts;
}

function emptyCounts() {
  return {
    subStrands: 0,
    learningOutcomes: 0,
    contentStandards: 0,
    learningIndicators: 0,
  };
}

function compareExpectedCounts(expected, counts, errors, warnings) {
  if (!expected) return;

  compareCount('sub-strands', expected.subStrands, counts.subStrands, errors);
  compareCount('learning outcomes', expected.learningOutcomes, counts.learningOutcomes, errors);
  compareCount('content standards', expected.contentStandards, counts.contentStandards, errors);
  compareCount(
    'explicit learning indicators',
    expected.explicitLearningIndicators,
    counts.learningIndicators,
    errors,
  );

  if (
    Number.isFinite(expected.scopeLearningIndicators) &&
    expected.scopeLearningIndicators !== counts.learningIndicators
  ) {
    warnings.push(
      `Scope summary reports ${expected.scopeLearningIndicators} learning indicators; mapped explicit LI rows are ${counts.learningIndicators}.`,
    );
  }
}

function compareCount(label, expected, actual, errors) {
  if (!Number.isFinite(expected)) return;
  if (expected !== actual) errors.push(`Expected ${expected} ${label}, found ${actual}.`);
}

function validateRecords(subStrands, context) {
  const ids = new Map();
  const officialCodes = {
    lo: new Map(),
    cs: new Map(),
    li: new Map(),
  };

  for (const subStrand of subStrands) {
    const path = subStrand.id || '(missing sub-strand id)';
    requireString(subStrand.id, `${path}.id`, context.errors);
    requireString(subStrand.subject, `${path}.subject`, context.errors);
    requireString(subStrand.classLevel, `${path}.classLevel`, context.errors);
    requireString(subStrand.strandCode, `${path}.strandCode`, context.errors);
    requireString(subStrand.strand, `${path}.strand`, context.errors);
    requireString(subStrand.subStrandCode, `${path}.subStrandCode`, context.errors);
    requireString(subStrand.subStrand, `${path}.subStrand`, context.errors);
    requireNumber(subStrand.year, `${path}.year`, context.errors);
    requireNumberList(subStrand.sourcePages, `${path}.sourcePages`, context.errors);
    trackId(ids, subStrand.id, path, context.errors);

    if (subStrand.subject !== context.subjectName) {
      context.errors.push(`${path}.subject is "${subStrand.subject}", expected "${context.subjectName}".`);
    }
    if (subStrand.classLevel !== context.levelName) {
      context.errors.push(`${path}.classLevel is "${subStrand.classLevel}", expected "${context.levelName}".`);
    }

    if (!Array.isArray(subStrand.learningOutcomes) || !subStrand.learningOutcomes.length) {
      context.errors.push(`${path}.learningOutcomes must contain at least one learning outcome.`);
      continue;
    }

    for (const outcome of subStrand.learningOutcomes) {
      validateOutcome(outcome, subStrand, {
        ...context,
        ids,
        officialCodes,
      });
    }
  }

  noteDuplicateOfficialCodes(officialCodes, context.infos);
}

function validateOutcome(outcome, subStrand, context) {
  const path = `${subStrand.id} > ${outcome.id || '(missing LO id)'}`;
  requireString(outcome.id, `${path}.id`, context.errors);
  requireCode(outcome.code, /^\d\.\d\.\d\.LO\.\d+$/, `${path}.code`, context.errors);
  requireString(outcome.text, `${path}.text`, context.errors);
  requireNumberList(outcome.sourcePages, `${path}.sourcePages`, context.errors);
  trackId(context.ids, outcome.id, path, context.errors);
  trackOfficialCode(context.officialCodes.lo, outcome.code, path);

  for (const optionalList of ['skillsAndCompetencies', 'gesi', 'sel', 'values']) {
    if (outcome[optionalList] !== undefined) {
      requireStringList(outcome[optionalList], `${path}.${optionalList}`, context.errors);
    }
  }

  if (!Array.isArray(outcome.contentStandards)) {
    context.errors.push(`${path}.contentStandards must be an array.`);
    return;
  }

  if (!outcome.contentStandards.length) {
    context.warnings.push(`${path} has no content standard; preserved as overview-only LO.`);
  }

  for (const standard of outcome.contentStandards) {
    validateStandard(standard, path, context);
  }
}

function validateStandard(standard, parentPath, context) {
  const path = `${parentPath} > ${standard.id || '(missing CS id)'}`;
  requireString(standard.id, `${path}.id`, context.errors);
  requireCode(standard.code, /^\d\.\d\.\d\.CS\.\d+$/, `${path}.code`, context.errors);
  requireString(standard.text, `${path}.text`, context.errors);
  requireNumber(standard.sourcePage, `${path}.sourcePage`, context.errors);
  trackId(context.ids, standard.id, path, context.errors);
  trackOfficialCode(context.officialCodes.cs, standard.code, path);

  if (!Array.isArray(standard.indicators) || !standard.indicators.length) {
    context.errors.push(`${path}.indicators must contain at least one learning indicator.`);
    return;
  }

  for (const indicator of standard.indicators) {
    validateIndicator(indicator, path, context);
  }
}

function validateIndicator(indicator, parentPath, context) {
  const path = `${parentPath} > ${indicator.id || '(missing LI id)'}`;
  requireString(indicator.id, `${path}.id`, context.errors);
  requireCode(indicator.code, /^\d\.\d\.\d\.LI\.\d+$/, `${path}.code`, context.errors);
  requireString(indicator.text, `${path}.text`, context.errors);
  requireString(indicator.shortTopic, `${path}.shortTopic`, context.errors);
  requireStringList(indicator.pedagogicalExemplars, `${path}.pedagogicalExemplars`, context.errors);
  requireNumber(indicator.sourcePage, `${path}.sourcePage`, context.errors);
  trackId(context.ids, indicator.id, path, context.errors);
  trackOfficialCode(context.officialCodes.li, indicator.code, path);

  if (!indicator.assessment || typeof indicator.assessment !== 'object') {
    context.errors.push(`${path}.assessment is required.`);
  } else {
    requireCode(indicator.assessment.code, /^\d\.\d\.\d\.AS\.\d+$/, `${path}.assessment.code`, context.errors);
    requireStringList(indicator.assessment.levels, `${path}.assessment.levels`, context.errors);
  }

  if (indicator.resources !== undefined) {
    requireStringList(indicator.resources, `${path}.resources`, context.errors);
  } else {
    context.warnings.push(`${path} has no resources list.`);
  }
}

function requireString(value, label, errors) {
  if (typeof value !== 'string' || !value.trim()) errors.push(`${label} must be a non-empty string.`);
}

function requireNumber(value, label, errors) {
  if (!Number.isFinite(value)) errors.push(`${label} must be a finite number.`);
}

function requireStringList(value, label, errors) {
  if (!Array.isArray(value) || !value.length) {
    errors.push(`${label} must be a non-empty string array.`);
    return;
  }
  value.forEach((item, index) => requireString(item, `${label}[${index}]`, errors));
}

function requireNumberList(value, label, errors) {
  if (!Array.isArray(value) || !value.length) {
    errors.push(`${label} must be a non-empty number array.`);
    return;
  }
  value.forEach((item, index) => requireNumber(item, `${label}[${index}]`, errors));
}

function requireCode(value, pattern, label, errors) {
  requireString(value, label, errors);
  if (typeof value === 'string' && !pattern.test(value)) {
    errors.push(`${label} has invalid code format: ${value}`);
  }
}

function trackId(ids, id, path, errors) {
  if (typeof id !== 'string' || !id.trim()) return;
  const existing = ids.get(id);
  if (existing) errors.push(`Duplicate internal id "${id}" at ${existing} and ${path}.`);
  ids.set(id, path);
}

function trackOfficialCode(map, code, path) {
  if (typeof code !== 'string' || !code.trim()) return;
  const paths = map.get(code) ?? [];
  paths.push(path);
  map.set(code, paths);
}

function noteDuplicateOfficialCodes(officialCodes, infos) {
  for (const [kind, map] of Object.entries(officialCodes)) {
    for (const [code, paths] of map.entries()) {
      if (paths.length <= 1) continue;
      infos.push(
        `Official ${kind.toUpperCase()} code "${code}" appears ${paths.length} times. This may be valid in SHS; internal ids must remain unique.`,
      );
    }
  }
}

function parseOptions(args) {
  const options = {
    help: false,
    levels: new Set(),
    list: false,
    subjects: new Set(),
    summaryOnly: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];

    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--list') options.list = true;
    else if (arg === '--summary') options.summaryOnly = true;
    else if ((arg === '--subject' || arg === '-s') && next) {
      options.subjects.add(slugify(next));
      index += 1;
    } else if (arg.startsWith('--subject=')) {
      options.subjects.add(slugify(arg.slice('--subject='.length)));
    } else if ((arg === '--level' || arg === '-l') && next) {
      options.levels.add(next.trim().toLowerCase());
      index += 1;
    } else if (arg.startsWith('--level=')) {
      options.levels.add(arg.slice('--level='.length).trim().toLowerCase());
    }
  }

  return options;
}

function selectSubjects(subjects, options) {
  if (!options.subjects.size) return subjects;
  return subjects.filter((subject) => options.subjects.has(subject.slug));
}

function printResults(results, options) {
  console.log(`Audited ${results.length} SHS curriculum subject${results.length === 1 ? '' : 's'}.\n`);
  console.log(
    [
      pad('Subject', 18),
      pad('Level', 6),
      pad('Sub', 4),
      pad('LO', 4),
      pad('CS', 4),
      pad('LI', 4),
      pad('Errors', 7),
      pad('Warnings', 8),
      'Info',
    ].join('  '),
  );
  console.log('-'.repeat(82));

  for (const result of results) {
    for (const level of result.levels) {
      console.log(
        [
          pad(result.subject.name, 18),
          pad(level.level.name, 6),
          pad(String(level.counts.subStrands), 4),
          pad(String(level.counts.learningOutcomes), 4),
          pad(String(level.counts.contentStandards), 4),
          pad(String(level.counts.learningIndicators), 4),
          pad(String(level.errors.length), 7),
          pad(String(level.warnings.length), 8),
          String(level.infos.length),
        ].join('  '),
      );
    }
  }

  if (options.summaryOnly) return;

  for (const result of results) {
    for (const level of result.levels) {
      if (!level.errors.length && !level.warnings.length && !level.infos.length) continue;
      console.log(`\n${result.subject.name} ${level.level.name}`);
      if (level.errors.length) {
        console.log(`Errors (${level.errors.length}):`);
        for (const error of level.errors) console.log(`- ${error}`);
      }
      if (level.warnings.length) {
        console.log(`Warnings (${level.warnings.length}):`);
        for (const warning of level.warnings) console.log(`- ${warning}`);
      }
      if (level.infos.length) {
        console.log(`Info (${level.infos.length}):`);
        for (const info of level.infos) console.log(`- ${info}`);
      }
    }
  }
}

function printSubjectList() {
  console.log('Available SHS curriculum audits:\n');
  for (const subject of subjectConfigs) {
    console.log(`${subject.name} (${subject.levels.map((level) => level.name).join(', ')})`);
  }
}

function printHelp() {
  console.log(`
Usage:
  npm run audit:curriculum-shs
  npm run audit:curriculum-shs -- --summary
  npm run audit:curriculum-shs -- --subject "General Science" --level SHS1

Options:
  --subject, -s <name>   Audit one SHS subject.
  --level, -l <level>    Audit one level, e.g. SHS1, SHS2 or SHS3.
  --summary              Print only the summary table.
  --list                 Show available SHS subjects.
  --help                 Show this help.
`);
}

function pad(value, length) {
  return value.length >= length ? value : `${value}${' '.repeat(length - value.length)}`;
}

function slugify(value) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
