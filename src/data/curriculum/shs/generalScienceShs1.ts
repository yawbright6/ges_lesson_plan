import type { ShsSubStrand } from './shsTypes';

const assessmentLevels = [
  'Level 1 Recall',
  'Level 2 Skills of conceptual understanding',
  'Level 3 Strategic reasoning',
  'Level 4 Extended critical thinking and reasoning',
];

const scienceNatureResources = [
  'Internet resources',
  'Projector',
  'Videos',
  'Charts',
  'Pictures',
  'Community examples',
];

const solidsResources = [
  'Periodic table chart',
  'Samples of metals, semi-metals and non-metals',
  'Books and journals',
  'Internet resources',
  'Projector',
  'Charts',
  'Models',
];

export const generalScienceShs1: ShsSubStrand[] = [
  {
    id: 'shs1-general-science-1.1',
    subject: 'General Science',
    classLevel: 'SHS1',
    year: 1,
    strandCode: '1',
    strand: 'Exploring Materials',
    subStrandCode: '1.1',
    subStrand: 'Science and Materials in Nature',
    sourcePages: [26, 27, 28, 29, 30, 31, 32, 33],
    learningOutcomes: [
      {
        id: 'shs1-general-science-1.1.1-lo-1',
        code: '1.1.1.LO.1',
        text: 'Evaluate the characteristics of science.',
        skillsAndCompetencies: [
          'Communication and collaboration through group discussion and sharing ideas about the characteristics of science.',
          'Critical thinking through comparing information, giving reasons, examining conclusions and modifying known ideas.',
          'Digital literacy through learning from internet resources.',
        ],
        gesi: [
          'Promote the idea that all genders and abilities have equal potential in scientific fields.',
          'Highlight contributions of scientists from different genders throughout history and contemporary science.',
          'Promote collaborative learning environments where diverse teams respect each other and learn from one another.',
        ],
        values: [
          'Tolerance',
          'Friendliness',
          'Open-mindedness',
          'Patience',
          'Hard work',
          'Humility',
        ],
        sourcePages: [26, 27, 28, 29],
        contentStandards: [
          {
            id: 'shs1-general-science-1.1.1-cs-1',
            code: '1.1.1.CS.1',
            text:
              'Demonstrate knowledge and understanding of the characteristics of science and show how they are applied in everyday life.',
            sourcePage: 28,
            indicators: [
              {
                id: 'shs1-general-science-1.1.1-cs-1-li-1',
                code: '1.1.1.LI.1',
                text: 'Explain the characteristics of science in nature.',
                shortTopic: 'Characteristics of science in nature',
                pedagogicalExemplars: [
                  'Learners work in mixed-ability groups to discuss the various characteristics of science using videos, charts, pictures, examples from their communities and cultural backgrounds, and the internet.',
                  'Learners reflect and cross-share their views of different situations in life where the characteristic of science is evident while demonstrating tolerance for divergent views.',
                ],
                assessment: {
                  code: '1.1.1.AS.1',
                  levels: assessmentLevels,
                },
                resources: scienceNatureResources,
                sourcePage: 28,
              },
              {
                id: 'shs1-general-science-1.1.1-cs-1-li-2',
                code: '1.1.1.LI.2',
                text: 'Design projects using the characteristics of science.',
                shortTopic: 'Science-characteristics-based projects',
                pedagogicalExemplars: [
                  'Learners work individually and in mixed-ability groups to design science-characteristics-based projects using books, the internet and other sources.',
                  'Learners demonstrate how the characteristics of science are used in the design of their projects.',
                ],
                assessment: {
                  code: '1.1.1.AS.2',
                  levels: assessmentLevels,
                },
                resources: scienceNatureResources,
                sourcePage: 28,
              },
              {
                id: 'shs1-general-science-1.1.1-cs-1-li-3',
                code: '1.1.1.LI.3',
                text: 'Apply the characteristics of science where appropriate.',
                shortTopic: 'Application of characteristics of science',
                pedagogicalExemplars: [
                  'Learners work in mixed-ability groups under teacher supervision so all learners participate in exploring instances from their immediate environment where characteristics of science are applied.',
                  'Learners use internet sources where possible to identify applications of the characteristics of science.',
                ],
                assessment: {
                  code: '1.1.1.AS.3',
                  levels: assessmentLevels,
                },
                resources: scienceNatureResources,
                sourcePage: 28,
              },
            ],
          },
        ],
      },
      {
        id: 'shs1-general-science-1.1.1-lo-2',
        code: '1.1.1.LO.2',
        text: 'Explain the functions of solids in life.',
        skillsAndCompetencies: [
          'Digital literacy through internet research on different solids.',
          'Research skills through identifying and describing different solids.',
          'Critical thinking through evaluating real-world scenarios and relating properties of solids to use.',
        ],
        gesi: [
          'Encourage respect for learners opinions during discussion and group activity.',
          'Use inclusive mixed-ability activities when learners investigate solids and their properties.',
        ],
        values: [
          'Tolerance',
          'Friendliness',
          'Open-mindedness',
          'Patience',
          'Hard work',
          'Humility',
        ],
        sourcePages: [26, 27, 30, 31, 32, 33],
        contentStandards: [
          {
            id: 'shs1-general-science-1.1.1-cs-2',
            code: '1.1.1.CS.2',
            text: 'Know, understand, and identify the roles of solids in life.',
            sourcePage: 30,
            indicators: [
              {
                id: 'shs1-general-science-1.1.1-cs-2-li-1',
                code: '1.1.1.LI.1',
                text: 'Classify different solids and their uses.',
                shortTopic: 'Classification and uses of solids',
                pedagogicalExemplars: [
                  'Through a whole-class session, guide learners to use periodic table charts to review the grouping of elements into metals, semi-metals and non-metals.',
                  'Using samples of metals, semi-metals and non-metallic materials, guide learners to identify and distinguish properties such as lustre, electrical conductivity, heat conductivity, density, malleability, ductility, tensile strength and sonority.',
                  'Guide learners to work in pairs to distinguish between metals and non-metals, semi-metals and non-metals, and metals and semi-metals.',
                  'Assist learners in undertaking a practical activity to demonstrate corrosion of metals and explain how corrosion or rusting can be prevented.',
                  'Learners work individually to create mind maps showing the relationship between the characteristic properties of metals, semi-metals and non-metals and their uses in daily life.',
                ],
                assessment: {
                  code: '1.1.1.AS.1',
                  levels: assessmentLevels,
                },
                resources: solidsResources,
                sourcePage: 30,
              },
              {
                id: 'shs1-general-science-1.1.1-cs-2-li-2',
                code: '1.1.1.LI.2',
                text: 'Apply the properties of solids to everyday use.',
                shortTopic: 'Properties of solids in everyday use',
                pedagogicalExemplars: [
                  'Learners research how the properties of different solids relate to their uses in life.',
                  'Provide opportunities for learners to evaluate real-world scenarios and make decisions based on the information at hand.',
                ],
                assessment: {
                  code: '1.1.1.AS.2',
                  levels: assessmentLevels,
                },
                resources: solidsResources,
                sourcePage: 30,
              },
              {
                id: 'shs1-general-science-1.1.1-cs-2-li-3',
                code: '1.1.1.LI.3',
                text:
                  'Discuss the relationship between binary compounds, the composition of binary compounds and the names of compounds.',
                shortTopic: 'Binary compounds and their composition',
                pedagogicalExemplars: [
                  'Guide learners to revise from the JHS curriculum about the nature of compounds using Talk for Learning approaches.',
                  'With the aid of models, videos, charts and the internet, learners discuss the relationship between binary compounds, their composition and chemical equations.',
                  'Provide opportunities for learners to listen to peers opinions and express disagreements constructively.',
                ],
                assessment: {
                  code: '1.1.1.AS.3',
                  levels: assessmentLevels,
                },
                resources: [
                  'Internet resources',
                  'Projector',
                  'Charts',
                  'Models',
                  'Pictures of binary compounds',
                  'Equations and reaction equations',
                  'Books and journals',
                  'Videos on binary compounds and chemical equations',
                ],
                sourcePage: 32,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'shs1-general-science-2.1',
    subject: 'General Science',
    classLevel: 'SHS1',
    year: 1,
    strandCode: '2',
    strand: 'Processes for Living',
    subStrandCode: '2.1',
    subStrand: 'Essentials for Survival',
    sourcePages: [32, 33, 34, 35, 36, 37, 38, 39],
    learningOutcomes: [
      {
        id: 'shs1-general-science-1.2.1-lo-1',
        code: '1.2.1.LO.1',
        text: 'Appreciate the movement of substances in biotic and abiotic media.',
        skillsAndCompetencies: [
          'Creativity and innovation through presentations and modelling the process of osmosis.',
          'Communication and collaboration through differentiated group work.',
          'Critical thinking and problem solving through discussing applications of diffusion.',
        ],
        gesi: [
          'Use inclusive mixed-ability and mixed-sex groupings where appropriate.',
          'Encourage learners to respect different opinions and participate constructively.',
          'Encourage females to play key roles in presentations where possible.',
        ],
        sel: [
          'Foster relationship building among learners and between learners and staff.',
          'Offer positive support when learners have difficulties with self-regulation.',
          'Build learners awareness of real-life issues and self-confidence.',
        ],
        values: [
          'Tolerance',
          'Respect for human dignity',
          'Cleanliness',
          'Friendliness',
          'Respect',
          'Empathy',
        ],
        sourcePages: [32, 33, 34, 35, 36, 37],
        contentStandards: [
          {
            id: 'shs1-general-science-1.2.1-cs-1',
            code: '1.2.1.CS.1',
            text:
              'Demonstrate understanding and appreciation and model the movement of substances in biotic and abiotic media.',
            sourcePage: 36,
            indicators: [
              {
                id: 'shs1-general-science-1.2.1-cs-1-li-1',
                code: '1.2.1.LI.1',
                text: 'Explain the concept of diffusion and its application in life.',
                shortTopic: 'Diffusion and its application in life',
                pedagogicalExemplars: [
                  'Using the guided learning approach, put learners in mixed-ability groups to design and model the osmosis process.',
                  'Learners in mixed-sex and mixed-ability groups present their work to the class.',
                  'Learners make presentations in mixed-ability groups to explain osmosis and discuss its application in everyday life.',
                ],
                assessment: {
                  code: '1.2.1.AS.1',
                  levels: assessmentLevels,
                },
                resources: [
                  'Models',
                  'Videos',
                  'Charts',
                  'Internet resources',
                  'Presentation materials',
                ],
                sourcePage: 36,
              },
              {
                id: 'shs1-general-science-1.2.1-cs-1-li-2',
                code: '1.2.1.LI.2',
                text: 'Design, model and explain the osmosis process and indicate its application to everyday life.',
                shortTopic: 'Osmosis process and everyday applications',
                pedagogicalExemplars: [
                  'Group learners according to different abilities and mixed-sex where appropriate, then use think-pair-share to discuss diffusion and its application.',
                  'Demonstrate the diffusion process using perfume, potassium permanganate crystals or volatile substances like camphor.',
                  'Guide learners to connect the demonstration to osmosis and everyday applications while observing relevant safety precautions.',
                ],
                assessment: {
                  code: '1.2.1.AS.2',
                  levels: assessmentLevels,
                },
                resources: [
                  'Perfume',
                  'Potassium permanganate crystals',
                  'Camphor',
                  'Water',
                  'Glassware',
                  'Charts',
                ],
                sourcePage: 36,
              },
            ],
          },
        ],
      },
      {
        id: 'shs1-general-science-1.2.1-lo-2',
        code: '1.2.1.LO.2',
        text: 'Illustrate the principles of reproduction.',
        skillsAndCompetencies: [
          'Digital literacy through use of videos and internet resources.',
          'Communication and collaboration through discussion of reproductive system structures.',
          'Critical thinking through addressing misconceptions and comparing information.',
          'Global citizenship through examining adolescent reproductive health as a global issue.',
        ],
        gesi: [
          'Promote respect for learners opinions during discussion of reproductive health.',
          'Be sensitive to gender roles, stereotypes and learner experiences when using models, videos, pictures or charts.',
          'Use inclusive groups for presentations and reproductive health discussions.',
        ],
        sel: [
          'Support relationship building during sensitive discussions.',
          'Offer positive support when learners have difficulty with self-regulation.',
          'Build learners self-confidence when discussing real-life reproductive health issues.',
        ],
        values: [
          'Tolerance',
          'Respect for human dignity',
          'Cleanliness',
          'Friendliness',
          'Respect',
          'Empathy',
        ],
        sourcePages: [34, 35, 36, 38, 39],
        contentStandards: [
          {
            id: 'shs1-general-science-1.2.1-cs-2',
            code: '1.2.1.CS.2',
            text:
              'Demonstrate knowledge and understanding of the principles of reproduction and their application in addressing sexually related societal problems.',
            sourcePage: 38,
            indicators: [
              {
                id: 'shs1-general-science-1.2.1-cs-2-li-1',
                code: '1.2.1.LI.1',
                text: 'Explain reproduction in plants and humans.',
                shortTopic: 'Reproduction in plants and humans',
                pedagogicalExemplars: [
                  'Embark on a nature walk around the school to observe different kinds of plants.',
                  'Task learners to identify the parts of the various plants observed that are used in reproduction.',
                  'Place learners into groups to prepare and give presentations on sexual reproduction in plants using flowers, fruits and seeds.',
                  'Place learners into groups to prepare and give presentations on asexual reproduction in plants using vegetative parts such as corm, rhizome, suckers, stem cuttings and bulbs.',
                  'Place learners into groups to prepare and give presentations on pollination and its role in sexual reproduction in plants.',
                  'Using models, videos, pictures or charts of the female reproductive system, learners describe the structure and explain the functions of its parts.',
                  'Allow learners to raise critical concerns for clarification from experiences or misconceptions about the structure and function of the female reproductive system of mammals.',
                  'Learners describe the structure and explain the functions of the parts of the male reproductive system while the teacher remains aware of stereotypes in the resources used.',
                ],
                assessment: {
                  code: '1.2.1.AS.1',
                  levels: assessmentLevels,
                },
                resources: [
                  'Flowers',
                  'Fruits',
                  'Seeds',
                  'Vegetative plant parts',
                  'Models',
                  'Videos',
                  'Pictures',
                  'Charts',
                ],
                sourcePage: 38,
              },
              {
                id: 'shs1-general-science-1.2.1-cs-2-li-2',
                code: '1.2.1.LI.2',
                text:
                  'Explain the female menstrual cycle and show how that can be used to address reproduction-related issues.',
                shortTopic: 'Female menstrual cycle and reproductive health issues',
                pedagogicalExemplars: [
                  'Put learners into mixed-ability groups and guide them to calculate the menstrual cycle using pictures, charts or videos.',
                  'Using Talk for Learning strategies and reflections from internet resources or books, compare global best practices of menstrual hygiene.',
                ],
                assessment: {
                  code: '1.2.1.AS.2',
                  levels: assessmentLevels,
                },
                resources: [
                  'Pictures',
                  'Charts',
                  'Videos',
                  'Internet resources',
                  'Books',
                ],
                sourcePage: 38,
              },
              {
                id: 'shs1-general-science-1.2.1-cs-2-li-3',
                code: '1.2.1.LI.3',
                text:
                  'Apply knowledge of reproduction-related issues such as teenage pregnancy, STI and reproductive health to address challenges of adolescent reproductive health.',
                shortTopic: 'Adolescent reproductive health challenges',
                pedagogicalExemplars: [
                  'Learners work in mixed-ability groups and different ability groups using Talk for Learning approaches to examine adolescent reproductive health issues.',
                  'Learners make presentations on adolescent reproductive health issues and connect the discussion to teenage pregnancy, STI and reproductive health challenges.',
                ],
                assessment: {
                  code: '1.2.1.AS.3',
                  levels: assessmentLevels,
                },
                resources: [
                  'Internet resources',
                  'Books',
                  'Charts',
                  'Videos',
                  'Presentation materials',
                ],
                sourcePage: 39,
              },
            ],
          },
        ],
      },
      {
        id: 'shs1-general-science-1.2.1-lo-3',
        code: '1.2.1.LO.3',
        text: 'Design possible solutions to address sexually related societal problems.',
        skillsAndCompetencies: [
          'Communication and collaboration using Talk for Learning.',
          'Problem-solving skills through calculating the menstrual cycle.',
          'Digital literacy through internet resources and presentations using projectors or PowerPoint.',
        ],
        gesi: [
          'Promote respect for learners opinions during discussion of sexually related societal problems.',
          'Encourage males to play supportive roles in female experiences and menstrual hygiene discussions.',
        ],
        sel: [
          'Support relationship building during sensitive reproductive health discussions.',
          'Build learner confidence when applying knowledge to real-world societal issues.',
        ],
        values: [
          'Tolerance',
          'Friendliness',
          'Open-mindedness',
          'Patience',
          'Hard work',
          'Humility',
        ],
        contentStandards: [],
        sourcePages: [34, 35, 38, 39],
      },
    ],
  },
  {
    id: 'shs1-general-science-3.1',
    subject: 'General Science',
    classLevel: 'SHS1',
    year: 1,
    strandCode: '3',
    strand: 'Vigour Behind Life',
    subStrandCode: '3.1',
    subStrand: 'Powering the Future with Energy Forms',
    sourcePages: [40, 41, 42, 43],
    learningOutcomes: [
      {
        id: 'shs1-general-science-1.3.1-lo-1',
        code: '1.3.1.LO.1',
        text: 'Relate forms of energy to their sources and their generation.',
        skillsAndCompetencies: [
          'Communication through sharing ideas on activities.',
          'Collaboration through group work and developing various views.',
          'Digital literacy through simulations, videos and internet resources.',
          'Cultural identity through relating energy sources to materials from school and home environments.',
        ],
        gesi: [
          'Use inclusive group work and allow learners to cross-share knowledge and understanding.',
          'Encourage respect for learners opinions and sensitivity to inter-relatedness of groups and individuals.',
        ],
        values: [
          'Tolerance',
          'Friendliness',
          'Open-mindedness',
          'Patience',
          'Hard work',
          'Humility',
          'Curiosity',
          'Awareness',
          'Courage',
          'Fairness',
        ],
        sourcePages: [40, 41, 42, 43],
        contentStandards: [
          {
            id: 'shs1-general-science-1.3.1-cs-1',
            code: '1.3.1.CS.1',
            text:
              'Demonstrate understanding of forms of energy, sources, their generation and effects on the environment.',
            sourcePage: 42,
            indicators: [
              {
                id: 'shs1-general-science-1.3.1-cs-1-li-1',
                code: '1.3.1.LI.1',
                text: 'Describe the generation of electricity from solar cells/panels.',
                shortTopic: 'Electricity generation from solar panels',
                pedagogicalExemplars: [
                  'Use Talk for Learning to revise various forms of electricity generation from the JHS curriculum and guide learners to do group presentations.',
                  'Guide learners to use diamond nine strategy to brainstorm the meaning, advantages and disadvantages of solar energy to life and the environment.',
                  'Learners use concept maps, videos, pictures, charts, diagrams and internet resources to describe electricity generation from solar panels and create awareness of the relationship between solar energy and the environment.',
                ],
                assessment: {
                  code: '1.3.1.AS.1',
                  levels: assessmentLevels,
                },
                resources: [
                  'Prototypes of solar panels',
                  'Charts',
                  'Pictures',
                  'Simulations of electricity generation',
                  'Internet resources',
                ],
                sourcePage: 42,
              },
              {
                id: 'shs1-general-science-1.3.1-cs-1-li-2',
                code: '1.3.1.LI.2',
                text: 'Design and build solar panel using locally available materials.',
                shortTopic: 'Designing a solar panel with local materials',
                pedagogicalExemplars: [
                  'Learners watch videos or simulations or look at diagrams and drawings of how solar panels are made.',
                  'Guide learners to collect different materials from home and school that can be used for building solar panels.',
                  'Using a project-based approach, learners work in mixed-ability groups to design solar panels using collected local materials.',
                  'Learners reflect on their project through reporting, cross-sharing and think-pair-share on its usability and advantages.',
                ],
                assessment: {
                  code: '1.3.1.AS.2',
                  levels: assessmentLevels,
                },
                resources: [
                  'Locally available materials',
                  'Prototypes of solar panels',
                  'Charts',
                  'Pictures',
                  'Simulations',
                ],
                sourcePage: 42,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'shs1-general-science-3.2',
    subject: 'General Science',
    classLevel: 'SHS1',
    year: 1,
    strandCode: '3',
    strand: 'Vigour Behind Life',
    subStrandCode: '3.2',
    subStrand: 'Forces Acting on Substances and Mechanisms',
    sourcePages: [44, 45, 46, 47],
    learningOutcomes: [
      {
        id: 'shs1-general-science-1.3.2-lo-1',
        code: '1.3.2.LO.1',
        text: 'Apply various forms of forces according to their effects on motions.',
        skillsAndCompetencies: [
          'Critical thinking through explaining force concepts and real-life applications.',
          'Collaboration through mixed-ability and mixed-sex discussion groups.',
          'Problem solving through enquiry, task sheets and simulations.',
        ],
        gesi: [
          'Use mixed-ability and mixed-sex groups where appropriate.',
          'Support learners to listen to peers opinions and express disagreement constructively.',
        ],
        sel: [
          'Build self-confidence through group work.',
          'Practise managing emotional reactions, thoughts and behaviours.',
          'Set goals and work towards achieving them.',
        ],
        values: [
          'Tolerance',
          'Friendliness',
          'Open-mindedness',
          'Patience',
          'Hard work',
          'Humility',
        ],
        sourcePages: [44, 45, 46, 47],
        contentStandards: [
          {
            id: 'shs1-general-science-1.3.2-cs-1',
            code: '1.3.2.CS.1',
            text: 'Recognise the various forms of forces and their effects on motions.',
            sourcePage: 46,
            indicators: [
              {
                id: 'shs1-general-science-1.3.2-cs-1-li-1',
                code: '1.3.2.LI.1',
                text: 'Identify and explain concepts associated with forces.',
                shortTopic: 'Concepts associated with forces',
                pedagogicalExemplars: [
                  'Using Talk for Learning, place learners in mixed-ability or mixed-sex groups to discuss distance, displacement, speed, velocity and acceleration with contextual examples.',
                  'Using enquiry, guide learners to develop task sheets to explore real-life applications of speed, displacement, velocity and acceleration while managing technical terminology.',
                  'Using the 3E approach, guide learners to engage, explore and explain concepts such as forces, momentum and pressure.',
                  'Using differentiated learning and scaffolding, guide learners to explore applications of forces, momentum and pressure in real life.',
                ],
                assessment: {
                  code: '1.3.2.AS.1',
                  levels: assessmentLevels,
                },
                resources: [
                  'Stop clocks or watches',
                  'Charts',
                  'Pictures',
                  'Models',
                  'Bicycle wheels',
                  'Pendulum bobs',
                  'PHET simulations',
                  'Balls',
                  'Trolleys',
                  'Siphoning materials',
                ],
                sourcePage: 46,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'shs1-general-science-3.3',
    subject: 'General Science',
    classLevel: 'SHS1',
    year: 1,
    strandCode: '3',
    strand: 'Vigour Behind Life',
    subStrandCode: '3.3',
    subStrand: 'Consumer Electronics',
    sourcePages: [48, 49, 50, 51],
    learningOutcomes: [
      {
        id: 'shs1-general-science-1.3.3-lo-1',
        code: '1.3.3.LO.1',
        text: 'Identify selected electronic components and their uses in household electronic devices.',
        skillsAndCompetencies: [
          'Digital literacy through simulations, pictures, charts, videos and internet resources.',
          'Collaboration through designing circuits in differentiated groups.',
          'Creativity and problem solving through building simple amplifiers.',
        ],
        gesi: [
          'Address stereotypes related to electronic components and household devices.',
          'Encourage all learners to participate actively in electronics activities.',
        ],
        sourcePages: [48, 49, 50, 51],
        contentStandards: [
          {
            id: 'shs1-general-science-1.3.3-cs-1',
            code: '1.3.3.CS.1',
            text:
              'Demonstrate knowledge and recognition of selected electronic components and their uses in household electronic devices.',
            sourcePage: 50,
            indicators: [
              {
                id: 'shs1-general-science-1.3.3-cs-1-li-1',
                code: '1.3.3.LI.1',
                text: 'Explain the uses of electronic components in household electronic devices and amplifiers.',
                shortTopic: 'Electronic components in household devices and amplifiers',
                pedagogicalExemplars: [
                  'Guide learners to revise the basic components of electronics from the JHS curriculum using Talk for Learning approaches and internet resources.',
                  'Demonstrate how basic electronic components are used in circuits and electronic devices using simulations, pictures, charts and realia.',
                  'In mixed-sex and differentiated groupings, learners design circuits involving transistors and switches and use them to build amplifiers.',
                  'Address stereotypes related to electronic components and household devices and encourage all learners to participate actively.',
                ],
                assessment: {
                  code: '1.3.3.AS.1',
                  levels: assessmentLevels,
                },
                resources: [
                  'Capacitor',
                  'LED',
                  'Transistors',
                  'Resistors',
                  'Diodes',
                  'Switches',
                  'Pictures, charts or videos of simple amplifiers',
                ],
                sourcePage: 50,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'shs1-general-science-4.1',
    subject: 'General Science',
    classLevel: 'SHS1',
    year: 1,
    strandCode: '4',
    strand: 'Relationships with the Environment',
    subStrandCode: '4.1',
    subStrand: 'The Human Body and Health',
    sourcePages: [50, 51, 52, 53, 54, 55, 56, 57],
    learningOutcomes: [
      {
        id: 'shs1-general-science-1.4.1-lo-1',
        code: '1.4.1.LO.1',
        text: 'Discuss everyday hazards and how to manage them in the environment.',
        skillsAndCompetencies: [
          'Communication and collaboration through think-pair-share.',
          'Digital literacy through use of camera and voice recording devices.',
          'Problem solving through assessing risks and hazards associated with local industries.',
        ],
        gesi: [
          'Promote respect for learners opinions and inclusive cross-sharing.',
          'Encourage awareness of personal biases and stereotypes.',
        ],
        sel: [
          'Set goals and work towards achieving them.',
          'Listen to peers opinions and express disagreement constructively.',
          'Develop respectful relationships with others.',
        ],
        values: [
          'Tolerance',
          'Friendliness',
          'Open-mindedness',
          'Patience',
          'Hard work',
          'Humility',
        ],
        sourcePages: [50, 51, 54, 55],
        contentStandards: [
          {
            id: 'shs1-general-science-1.4.1-cs-1',
            code: '1.4.1.CS.1',
            text: 'Demonstrate understanding of hazards in everyday life and how to manage them.',
            sourcePage: 54,
            indicators: [
              {
                id: 'shs1-general-science-1.4.1-cs-1-li-1',
                code: '1.4.1.LI.1',
                text: 'Explore common risks and hazards in the environment and how to address them.',
                shortTopic: 'Common risks and hazards in the environment',
                pedagogicalExemplars: [
                  'Enumerate possible hazards and risks in the home and workplace using think-pair-share.',
                  'Visit an accessible local industry such as a sawmill, palm kernel oil production site or gari processing site and assess possible risks and hazards associated with its activities.',
                ],
                assessment: {
                  code: '1.4.1.AS.1',
                  levels: assessmentLevels,
                },
                resources: [
                  'Pictures, charts and videos on workplace and home hazards',
                  'Camera',
                  'Voice recording device',
                  'Writing materials',
                ],
                sourcePage: 54,
              },
            ],
          },
        ],
      },
      {
        id: 'shs1-general-science-1.4.1-lo-2',
        code: '1.4.1.LO.2',
        text: 'Distinguish various types of lifestyle diseases.',
        skillsAndCompetencies: [
          'Communication and collaboration through Talk for Learning and think-pair-share.',
          'Critical thinking through comparing lifestyle diseases by causes, effects and prevention.',
        ],
        gesi: [
          'Manage stigma carefully when discussing lifestyle diseases and recovered patients.',
          'Support learners to value their thoughts and opinions during health discussions.',
        ],
        sourcePages: [52, 53, 56, 57],
        contentStandards: [
          {
            id: 'shs1-general-science-1.4.1-cs-2',
            code: '1.4.1.CS.2',
            text: 'Show understanding of lifestyle diseases, their causes, symptoms and prevention.',
            sourcePage: 56,
            indicators: [
              {
                id: 'shs1-general-science-1.4.1-cs-2-li-1',
                code: '1.4.1.LI.1',
                text: 'Describe lifestyle diseases, their causes, effects and prevention.',
                shortTopic: 'Lifestyle diseases, causes, effects and prevention',
                pedagogicalExemplars: [
                  'Invite a healthcare giver, medical practitioner or public health nurse to talk about lifestyle diseases.',
                  'Allow learners to assess lifestyle diseases within their own environment, noting diseases that easily lead to stigmatisation, using guided inquiry and cross-sharing.',
                  'Using Talk for Learning, let learners show differences among lifestyle diseases according to causes, effects, prevention and how to manage stigma on recovered patients.',
                ],
                assessment: {
                  code: '1.4.1.AS.1',
                  levels: assessmentLevels,
                },
                resources: [
                  'Public address system',
                  'Resource person',
                  'Pictures or videos of humans suffering from lifestyle diseases',
                  'Charts of diseases',
                  'Health journals',
                ],
                sourcePage: 56,
              },
            ],
          },
        ],
      },
      {
        id: 'shs1-general-science-1.4.1-lo-3',
        code: '1.4.1.LO.3',
        text: 'Clarify the concept of drugs and reflect on their effects on humans.',
        skillsAndCompetencies: [
          'Digital literacy through use of internet, books, videos and journals.',
          'Critical thinking through analysing attributes and harmful effects of drugs.',
        ],
        gesi: [
          'Encourage respectful discussion and avoid stigmatising learners or community members affected by drug abuse.',
        ],
        sourcePages: [52, 53, 56, 57],
        contentStandards: [
          {
            id: 'shs1-general-science-1.4.1-cs-3',
            code: '1.4.1.CS.3',
            text: 'Exhibit understanding of the concept of drugs and reflect on their effects on humans as well as their control.',
            sourcePage: 56,
            indicators: [
              {
                id: 'shs1-general-science-1.4.1-cs-3-li-1',
                code: '1.4.1.LI.1',
                text: 'Analyse the attributes of drugs.',
                shortTopic: 'Attributes and effects of drugs',
                pedagogicalExemplars: [
                  'Put learners in mixed-ability groups to brainstorm and come out with the attributes of drugs.',
                  'Invite a resource person to talk to learners about drugs, their attributes and harmful effects.',
                  'Learners use the internet, books, videos and journals to consolidate what they have learnt on the effects of drugs on humans and how to control drug use.',
                ],
                assessment: {
                  code: '1.4.1.AS.1',
                  levels: assessmentLevels,
                },
                resources: [
                  'Computer with modem',
                  'Charts',
                  'Videos',
                  'Journals',
                  'Books showing people affected by drug abuse',
                  'Resource person',
                  'Internet services',
                  'Computer and mobile phones',
                ],
                sourcePage: 56,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'shs1-general-science-4.2',
    subject: 'General Science',
    classLevel: 'SHS1',
    year: 1,
    strandCode: '4',
    strand: 'Relationships with the Environment',
    subStrandCode: '4.2',
    subStrand: 'Technology in Our Local Industries',
    sourcePages: [58, 59, 60, 61, 62, 63],
    learningOutcomes: [
      {
        id: 'shs1-general-science-1.4.2-lo-1',
        code: '1.4.2.LO.1',
        text: 'Produce local soap in the community.',
        skillsAndCompetencies: [
          'Communication through writing a field trip report.',
          'Collaboration and communication through mixed-ability and mixed-sex group work.',
          'Critical thinking through designing an experiment to prepare local soap.',
        ],
        gesi: [
          'Use mixed-ability groups and encourage cross-sharing knowledge and understanding.',
          'Respect individuals of different ideas and abilities.',
        ],
        values: [
          'Curiosity',
          'Vigilance',
          'Cooperation',
        ],
        sourcePages: [58, 59, 60, 61],
        contentStandards: [
          {
            id: 'shs1-general-science-1.4.2-cs-1',
            code: '1.4.2.CS.1',
            text:
              'Demonstrate understanding of the process of local soap making and design methods of producing soaps for different purposes for income generation.',
            sourcePage: 60,
            indicators: [
              {
                id: 'shs1-general-science-1.4.2-cs-1-li-1',
                code: '1.4.2.LI.1',
                text: 'Experiment to produce different types of soap.',
                shortTopic: 'Producing different types of soap',
                pedagogicalExemplars: [
                  'Organise a visit for learners to a place where local soap is produced and let them observe and report on the production processes.',
                  'Put learners in mixed-ability groups to search the internet, brainstorm or think-pair-share on the science in the process of local soap making, including saponification.',
                ],
                assessment: {
                  code: '1.4.2.AS.1',
                  levels: assessmentLevels,
                },
                resources: [
                  'Writing materials',
                  'Camera',
                  'Voice recording device',
                  'Journal from a field trip',
                  'Internet sources',
                ],
                sourcePage: 60,
              },
              {
                id: 'shs1-general-science-1.4.2-cs-1-li-2',
                code: '1.4.2.LI.2',
                text: 'Explain the processes of producing different types of soap.',
                shortTopic: 'Processes of soap production',
                pedagogicalExemplars: [
                  'Put learners into mixed-ability groups to conduct experiments to prepare local soap while varying materials or reactants to observe outcomes.',
                  'Lead learners to visit a community soap production site to observe and document stages of production and diversity in soaps, then reflect and present.',
                  'Allow learners to use internet, books and journals to brainstorm and write a report on science processes such as saponification in local soap production.',
                ],
                assessment: {
                  code: '1.4.2.AS.2',
                  levels: assessmentLevels,
                },
                resources: [
                  'Writing materials',
                  'Camera',
                  'Voice recording device',
                  'Journal from a field trip',
                  'Internet sources',
                ],
                sourcePage: 60,
              },
            ],
          },
        ],
      },
      {
        id: 'shs1-general-science-1.4.2-lo-2',
        code: '1.4.2.LO.2',
        text: 'Conduct a project on the production of an indigenous food and produce a report.',
        skillsAndCompetencies: [
          'Communication and collaboration through group work and report writing.',
          'Critical thinking through identifying science processes in indigenous food production.',
          'Digital literacy through internet, books and journals.',
        ],
        gesi: [
          'Value teamwork and friendliness in mixed-ability groups.',
          'Respect individuals of different beliefs, ideas and abilities.',
        ],
        values: [
          'Curiosity',
          'Vigilance',
          'Cooperation',
        ],
        sourcePages: [58, 59, 62, 63],
        contentStandards: [
          {
            id: 'shs1-general-science-1.4.2-cs-2',
            code: '1.4.2.CS.2',
            text:
              'Explore the production of indigenous food such as gari, akyeke, yakeyake, kenkey, aboloo, tubaani and dawadawa.',
            sourcePage: 62,
            indicators: [
              {
                id: 'shs1-general-science-1.4.2-cs-2-li-1',
                code: '1.4.2.LI.1',
                text: 'Investigate the production of an indigenous food to identify the science processes in the stages of production.',
                shortTopic: 'Science processes in indigenous food production',
                pedagogicalExemplars: [
                  'Place learners into mixed-ability groups and let them design an activity to prepare a named local food.',
                  'Lead learners to visit a community site where local food is produced to observe and document production stages and food diversity, then reflect and present.',
                  'Allow learners to use internet, books and journals to brainstorm and write a report on science processes such as fermentation and sun drying in local food production.',
                ],
                assessment: {
                  code: '1.4.2.AS.1',
                  levels: assessmentLevels,
                },
                resources: [
                  'Voice recording device',
                  'Journal from a field trip',
                  'Internet sources',
                  'Local food materials or ingredients',
                  'Checklist of science processes involved in processing local food',
                  'Writing materials',
                  'Camera',
                ],
                sourcePage: 62,
              },
            ],
          },
        ],
      },
    ],
  },
];
