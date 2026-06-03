import type { ShsSubStrand } from './shsTypes';

const assessmentLevels = [
  'Level 1 Recall',
  'Level 2 Skills of conceptual understanding',
  'Level 3 Strategic reasoning',
  'Level 4 Extended critical thinking and reasoning',
];

export const generalScienceShs3: ShsSubStrand[] = [
  {
    id: 'shs3-general-science-1.1',
    subject: 'General Science',
    classLevel: 'SHS3',
    year: 3,
    strandCode: '1',
    strand: 'Exploring Materials',
    subStrandCode: '1.1',
    subStrand: 'Science and Materials in Nature',
    sourcePages: [90, 91, 92, 93, 94, 95],
    learningOutcomes: [
      {
        id: 'shs3-general-science-3.1.1-lo-1',
        code: '3.1.1.LO.1',
        text: 'Explore the composition of air and the laboratory preparation of oxygen and carbon dioxide.',
        skillsAndCompetencies: [
          'Experiential learning through laboratory activities and demonstrations.',
          'Digital literacy through videos, charts and internet sources.',
          'Communication through discussing gas preparation, properties and uses.',
        ],
        gesi: [
          'Provide an enabling environment for all learners to take part in laboratory activities.',
          'Support learners who may react to the environment or materials.',
        ],
        sel: [
          'Provide opportunities for learners to listen to peers opinions and express disagreements constructively.',
          'Encourage learners to develop their own strategies for completing tasks.',
        ],
        values: ['Tolerance', 'Friendliness', 'Open-mindedness', 'Patience', 'Hard work', 'Humility'],
        sourcePages: [90, 91, 92, 93, 94],
        contentStandards: [
          {
            id: 'shs3-general-science-3.1.1-cs-1',
            code: '3.1.1.CS.1',
            text:
              "Explore the concept of 'Air' as a mixture of useful gases in nature and understand the preparation of oxygen and carbon dioxide and their uses in human life.",
            sourcePage: 92,
            indicators: [
              {
                id: 'shs3-general-science-3.1.1-cs-1-li-1',
                code: '3.1.1.LI.1',
                text: 'Identify air as a mixture and explain the uses of the components of air.',
                shortTopic: 'Air as a mixture and uses of its components',
                pedagogicalExemplars: [
                  'Put learners in differentiated groups to explore air as a mixture through laboratory activities, pictures, charts and internet videos, noting gas composition, relative abundance and uses.',
                  'Engage learners to perform simple experiments to test for the various components of air.',
                  'Provide an enabling environment for all learners to take part in all activities.',
                ],
                assessment: { code: '3.1.1.AS.1', levels: assessmentLevels },
                resources: ['Internet sources', 'Charts', 'Pictures', 'Candle', 'Matches', 'Measuring cylinder', 'Gas jar'],
                sourcePage: 92,
              },
              {
                id: 'shs3-general-science-3.1.1-cs-1-li-2',
                code: '3.1.1.LI.2',
                text: 'Prepare carbon dioxide and discuss its uses.',
                shortTopic: 'Preparation and uses of carbon dioxide',
                pedagogicalExemplars: [
                  'Put learners in different ability groups and guide them through a laboratory or classroom demonstration on preparing carbon dioxide gas.',
                  'Discuss the characteristics and uses of carbon dioxide while supporting learners who may react to the environment or materials.',
                ],
                assessment: { code: '3.1.1.AS.2', levels: assessmentLevels },
                resources: ['Dilute hydrochloric acid', 'Calcium carbonate or eggshell', 'Beakers', 'Conical flasks', 'Collecting jars', 'Delivery tubes'],
                sourcePage: 92,
              },
              {
                id: 'shs3-general-science-3.1.1-cs-1-li-3',
                code: '3.1.1.LI.3',
                text: 'Prepare oxygen and discuss its uses.',
                shortTopic: 'Preparation and uses of oxygen',
                pedagogicalExemplars: [
                  'Put learners in different ability groups and guide them through demonstrations on how to prepare oxygen gas.',
                  'Discuss the characteristics and uses of oxygen while supporting learners who may react to the environment or materials.',
                ],
                assessment: { code: '3.1.1.AS.3', levels: assessmentLevels },
                resources: ['Hydrogen peroxide', 'Potassium chlorate', 'Delivery tube', 'Water trough', 'Gas jar', 'Requisite glassware'],
                sourcePage: 92,
              },
            ],
          },
        ],
      },
      {
        id: 'shs3-general-science-3.1.1-lo-2',
        code: '3.1.1.LO.2',
        text: 'Describe and analyse the origin and composition of natural gas.',
        skillsAndCompetencies: [
          'Collaborative and inquiry-based learning through oil and gas exploration research.',
          'Critical thinking through analysing benefits and dangers of oil and gas exploration.',
          'Communication through group discussion and presentations.',
        ],
        gesi: [
          'Guide learners to use the language of the content and respect all ideas.',
          'Build learners self-confidence through guided checklists.',
        ],
        sourcePages: [90, 91, 94, 95],
        contentStandards: [
          {
            id: 'shs3-general-science-3.1.1-cs-2',
            code: '3.1.1.CS.2',
            text: 'Know, understand and identify the origin and composition of natural gas.',
            sourcePage: 94,
            indicators: [
              {
                id: 'shs3-general-science-3.1.1-cs-2-li-1',
                code: '3.1.1.LI.1',
                text: 'Discuss the composition and uses of oil and natural gas.',
                shortTopic: 'Composition and uses of oil and natural gas',
                pedagogicalExemplars: [
                  "Use think-pair-share to initiate discussion on the composition, usefulness and need for oil and gas discoveries in Ghana's economy.",
                  'Give learners a take-home assignment to collate benefits and dangers associated with oil and gas exploration in Ghana.',
                  'Put learners in mixed-ability or differentiated groups with books, pictures, charts, internet sources and videos on oil and gas extraction for critical exploration and discussion.',
                  'Provide a checklist to guide learners to focus on fracturing or fracking of fluids in discussion.',
                ],
                assessment: { code: '3.1.1.AS.1', levels: assessmentLevels },
                resources: ['Books', 'Videos', 'Charts', 'Pictures of oil and gas exploration', 'Internet sources'],
                sourcePage: 94,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'shs3-general-science-2.1',
    subject: 'General Science',
    classLevel: 'SHS3',
    year: 3,
    strandCode: '2',
    strand: 'Processes for Living',
    subStrandCode: '2.1',
    subStrand: 'Essentials for Survival',
    sourcePages: [96, 97, 98, 99, 100, 101],
    learningOutcomes: [
      {
        id: 'shs3-general-science-3.2.1-lo-1',
        code: '3.2.1.LO.1',
        text: 'Model the structure of the nervous system and describe the functions of the parts of the nervous system.',
        skillsAndCompetencies: [
          'Creativity and innovation through role-playing nervous system parts and functions.',
          'Digital literacy through videos and internet resources.',
          'Communication and collaboration through group reports and presentations.',
        ],
        gesi: [
          'Use differentiated learning groups and provide support for reflection and presentation.',
        ],
        values: ['Tolerance', 'Humility', 'Hard work', 'Respect', 'Friendliness'],
        sourcePages: [96, 97, 98, 99, 100],
        contentStandards: [
          {
            id: 'shs3-general-science-3.2.1-cs-1',
            code: '3.2.1.CS.1',
            text: 'Model and demonstrate understanding of the nervous system, its parts and uses.',
            sourcePage: 98,
            indicators: [
              {
                id: 'shs3-general-science-3.2.1-cs-1-li-1',
                code: '3.2.1.LI.1',
                text: 'Analyse the central nervous system.',
                shortTopic: 'Central nervous system',
                pedagogicalExemplars: [
                  'Put learners in mixed groups to role-play the parts and functions of the central nervous system using models, videos and pictures.',
                ],
                assessment: { code: '3.2.1.AS.1', levels: assessmentLevels },
                resources: ['Models', 'Videos', 'Books', 'Pictures of the central nervous system'],
                sourcePage: 98,
              },
              {
                id: 'shs3-general-science-3.2.1-cs-1-li-2',
                code: '3.2.1.LI.2',
                text: 'Explain the peripheral nervous system.',
                shortTopic: 'Peripheral nervous system',
                pedagogicalExemplars: [
                  'Create task groups and provide guidelines to examine the peripheral nervous system structure in relation to functions using models, pictures and videos.',
                  'Support groups to reflect and present reports.',
                ],
                assessment: { code: '3.2.1.AS.2', levels: assessmentLevels },
                resources: ['Models', 'Pictures', 'Books', 'Videos', 'Internet resources'],
                sourcePage: 98,
              },
              {
                id: 'shs3-general-science-3.2.1-cs-1-li-3',
                code: '3.2.1.LI.3',
                text: 'Describe autonomic nervous system.',
                shortTopic: 'Autonomic nervous system',
                pedagogicalExemplars: [
                  'In differentiated groups, learners match neuron structures to functions, then exchange and discuss their matches and describe neuron structure and functions.',
                ],
                assessment: { code: '3.2.1.AS.3', levels: assessmentLevels },
                resources: ['Computer or internet', 'Diagrams', 'Videos', 'Pictures', 'Drawing paper'],
                sourcePage: 98,
              },
              {
                id: 'shs3-general-science-3.2.1-cs-1-li-4',
                code: '3.2.1.LI.4',
                text: 'Discuss the generation and transmission of nerve impulses.',
                shortTopic: 'Generation and transmission of nerve impulses',
                pedagogicalExemplars: [
                  'Learners think-pair-share in same-ability groups the pathways of communication within and between neurons using diagrams, videos, pictures or simulations.',
                  'In whole-class discussion, guide learners to brainstorm on three major neurotransmitters and describe their functions.',
                ],
                assessment: { code: '3.2.1.AS.4', levels: assessmentLevels },
                resources: ['Computer or internet', 'Diagrams', 'Videos', 'Pictures', 'Simulations'],
                sourcePage: 100,
              },
            ],
          },
        ],
      },
      {
        id: 'shs3-general-science-3.2.1-lo-2',
        code: '3.2.1.LO.2',
        text: 'Demonstrate how movement occurs in parts of the human body.',
        skillsAndCompetencies: [
          'Collaboration through modelling and describing skeleton and muscles.',
          'Communication through think-pair-share.',
          'Critical thinking through explaining muscle movement.',
        ],
        gesi: [
          'Encourage learners to appreciate diversity in limb and human movement.',
        ],
        sourcePages: [96, 97, 100, 101],
        contentStandards: [
          {
            id: 'shs3-general-science-3.2.1-cs-2',
            code: '3.2.1.CS.2',
            text:
              'Develop an understanding of the relationships between bones, skeleton and muscles and the principles underlying the movement of various parts of the human body.',
            sourcePage: 100,
            indicators: [
              {
                id: 'shs3-general-science-3.2.1-cs-2-li-1',
                code: '3.2.1.LI.1',
                text: 'Model and discuss the structure of the skeleton and muscles.',
                shortTopic: 'Skeleton, muscles and movement',
                pedagogicalExemplars: [
                  'Learners use think-pair-share in mixed-ability groups to model and describe the structure and functions of skeleton parts.',
                  'Learners describe the general structure and functions of human muscles and their attachment to skeletons using models, pictures or diagrams.',
                  'Learners model and describe the nature of muscle movement and summarise movement into categories.',
                ],
                assessment: { code: '3.2.1.AS.1', levels: assessmentLevels },
                resources: ['Chart, picture or model of human skeleton', 'Pictures', 'Videos'],
                sourcePage: 100,
              },
              {
                id: 'shs3-general-science-3.2.1-cs-2-li-2',
                code: '3.2.1.LI.2',
                text: 'Demonstrate and explain the structure and function of the movement of muscle tissues.',
                shortTopic: 'Structure and function of muscle tissues',
                pedagogicalExemplars: [
                  'Let learners think-pair-share using videos, pictures and personal experience to describe how muscles bring about movement in humans.',
                  'Discuss how challenges arise for human movement and encourage appreciation of diversity in limb.',
                  'Explain the sliding filament model of muscle.',
                ],
                assessment: { code: '3.2.1.AS.2', levels: assessmentLevels },
                resources: ['Videos', 'Pictures', 'Models', 'Charts'],
                sourcePage: 100,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'shs3-general-science-3.1',
    subject: 'General Science',
    classLevel: 'SHS3',
    year: 3,
    strandCode: '3',
    strand: 'Vigour Behind Life',
    subStrandCode: '3.1',
    subStrand: 'Powering the Future with Energy Forms',
    sourcePages: [102, 103, 104],
    learningOutcomes: [
      {
        id: 'shs3-general-science-3.3.1-lo-1',
        code: '3.3.1.LO.1',
        text: 'Analyse light energy and its uses in nature.',
        skillsAndCompetencies: [
          'Communication and collaboration through group sharing.',
          'Critical thinking and problem solving through relating lenses and mirrors to life.',
        ],
        gesi: [
          'Promote respect for individuals of different backgrounds and challenge traditional gender roles and stereotypes.',
        ],
        values: ['Tolerance', 'Friendliness', 'Open-mindedness', 'Patience', 'Hard work', 'Humility'],
        sourcePages: [102, 103, 104],
        contentStandards: [
          {
            id: 'shs3-general-science-3.3.1-cs-1',
            code: '3.3.1.CS.1',
            text: 'Demonstrate understanding of light energy, its sources and generation.',
            sourcePage: 102,
            indicators: [
              {
                id: 'shs3-general-science-3.3.1-cs-1-li-1',
                code: '3.3.1.LI.1',
                text: 'Explain the concept of light energy and its uses.',
                shortTopic: 'Light energy and its uses',
                pedagogicalExemplars: [
                  'Guide learners to revise the concept of light energy through brainstorming in differentiated groups and discuss domestic and industrial uses of light.',
                ],
                assessment: { code: '3.3.1.AS.1', levels: assessmentLevels },
                resources: ['Pictures', 'Videos', 'Charts', 'PHET simulations'],
                sourcePage: 102,
              },
              {
                id: 'shs3-general-science-3.3.1-cs-1-li-2',
                code: '3.3.1.LI.2',
                text: 'Explore lenses and mirrors in relation to light energy in life.',
                shortTopic: 'Lenses, mirrors and light energy',
                pedagogicalExemplars: [
                  'Let learners work in mixed-ability groups to discuss types of mirrors and lenses using projects developed from mirrors and lenses.',
                  "Let learners work in different ability groups or pairs to discuss Snell's law, total internal reflection, refractive index, and differences between lasers and fibre optics.",
                ],
                assessment: { code: '3.3.1.AS.2', levels: assessmentLevels },
                resources: ['Mirrors', 'Lenses', 'Pictures', 'Videos', 'Charts', 'Simulations'],
                sourcePage: 102,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'shs3-general-science-3.2',
    subject: 'General Science',
    classLevel: 'SHS3',
    year: 3,
    strandCode: '3',
    strand: 'Vigour Behind Life',
    subStrandCode: '3.2',
    subStrand: 'Forces Acting on Substances and Mechanisms',
    sourcePages: [104, 105, 106, 107],
    learningOutcomes: [
      {
        id: 'shs3-general-science-3.3.2-lo-1',
        code: '3.3.2.LO.1',
        text: 'Explain the concept of momentum and its application.',
        skillsAndCompetencies: [
          'Collaborative learning through concept maps and 3E learning model.',
          'Inquiry-based learning through collision activities.',
          'Problem solving through applying force and collision concepts.',
        ],
        values: ['Tolerance', 'Friendliness', 'Open-mindedness', 'Patience', 'Hard work', 'Humility'],
        sourcePages: [104, 105, 106, 107],
        contentStandards: [
          {
            id: 'shs3-general-science-3.3.2-cs-1',
            code: '3.3.2.CS.1',
            text: 'Recognise the various forms of forces and their effects on motion.',
            sourcePage: 106,
            indicators: [
              {
                id: 'shs3-general-science-3.3.2-cs-1-li-1',
                code: '3.3.2.LI.1',
                text: 'Identify different types of forces and their daily applications.',
                shortTopic: 'Types of forces and daily applications',
                pedagogicalExemplars: [
                  'Use concept maps to explain different types of forces.',
                  'Using the 3E learning model, let learners engage, explore and explain applications of forces.',
                  'Emphasise frictional forces, factors influencing fluid friction, and ways of increasing or decreasing friction.',
                  'Engage learners to discuss frictional force, its effects and how to reduce it.',
                ],
                assessment: { code: '3.3.2.AS.1', levels: assessmentLevels },
                resources: ['Charts', 'Pictures', 'Videos', 'Simulations', 'Realia of simple machines'],
                sourcePage: 106,
              },
              {
                id: 'shs3-general-science-3.3.2-cs-1-li-2',
                code: '3.3.2.LI.2',
                text: 'Examine the differences between elastic and inelastic collisions of moving objects.',
                shortTopic: 'Elastic and inelastic collisions',
                pedagogicalExemplars: [
                  'Let learners explore differences between elastic and inelastic collisions and collisions of moving objects.',
                  'Learners discuss measures for avoiding collision with moving objects in mixed-ability groups.',
                ],
                assessment: { code: '3.3.2.AS.2', levels: assessmentLevels },
                resources: ['Simulations', 'Videos', 'Pictures'],
                sourcePage: 106,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'shs3-general-science-3.3',
    subject: 'General Science',
    classLevel: 'SHS3',
    year: 3,
    strandCode: '3',
    strand: 'Vigour Behind Life',
    subStrandCode: '3.3',
    subStrand: 'Consumer Electronics',
    sourcePages: [108, 109, 110],
    learningOutcomes: [
      {
        id: 'shs3-general-science-3.3.3-lo-1',
        code: '3.3.3.LO.1',
        text: 'Apply knowledge of electronic circuits to identify careers in electronics.',
        skillsAndCompetencies: [
          'Communication and collaboration through sharing ideas with peers.',
          'Digital literacy through use of digital devices to give information.',
          'Leadership through sharing thoughts with peers.',
        ],
        gesi: [
          'Challenge traditional gender roles and stereotypes in electronics careers.',
          'Value learners thoughts and opinions.',
        ],
        sourcePages: [108, 109, 110],
        contentStandards: [
          {
            id: 'shs3-general-science-3.3.3-cs-1',
            code: '3.3.3.CS.1',
            text: 'Demonstrate knowledge and recognition of selected electronic components and their uses in household electronic devices.',
            sourcePage: 108,
            indicators: [
              {
                id: 'shs3-general-science-3.3.3-cs-1-li-1',
                code: '3.3.3.LI.1',
                text: 'Discuss consumer electronic devices and their components.',
                shortTopic: 'Consumer electronic devices and components',
                pedagogicalExemplars: [
                  'Using inclusive and differentiated learning, engage learners to observe pictures, videos and drawings of consumer electronics devices and discuss their components.',
                ],
                assessment: { code: '3.3.3.AS.1', levels: assessmentLevels },
                resources: ['Mobile phones', 'Laptops', 'Television', 'Videos', 'Charts of consumer electronics devices'],
                sourcePage: 108,
              },
              {
                id: 'shs3-general-science-3.3.3-cs-1-li-2',
                code: '3.3.3.LI.2',
                text: 'Explore Consumer Electronic careers.',
                shortTopic: 'Careers in consumer electronics',
                pedagogicalExemplars: [
                  'Let learners explore and explain career opportunities available in consumer electronics.',
                  'Assist learners to use concept maps in mixed-ability groups to illustrate the importance of consumer electronics and present findings.',
                  'Address common misconceptions about electronic components and household appliances.',
                ],
                assessment: { code: '3.3.3.AS.2', levels: assessmentLevels },
                resources: ['Mobile phones', 'Laptops', 'Television', 'Videos', 'Charts', 'Resource person'],
                sourcePage: 108,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'shs3-general-science-4.1',
    subject: 'General Science',
    classLevel: 'SHS3',
    year: 3,
    strandCode: '4',
    strand: 'Relationships with the Environment',
    subStrandCode: '4.1',
    subStrand: 'The Human Body and Health',
    sourcePages: [110, 111, 112, 113, 114, 115],
    learningOutcomes: [
      {
        id: 'shs3-general-science-3.4.1-lo-1',
        code: '3.4.1.LO.1',
        text: 'Describe the various features of heredity.',
        skillsAndCompetencies: [
          'Collaboration and communication through group work and sharing ideas.',
          'Digital literacy through internet exploration.',
          'Critical thinking through discussing hereditary traits and diseases.',
        ],
        gesi: [
          'Use language devoid of stereotypes and encourage learners to share experiences respectfully.',
        ],
        sourcePages: [110, 111, 114, 115],
        contentStandards: [
          {
            id: 'shs3-general-science-3.4.1-cs-1',
            code: '3.4.1.CS.1',
            text: 'Apply knowledge of human reproduction to understand heredity.',
            sourcePage: 114,
            indicators: [
              {
                id: 'shs3-general-science-3.4.1-cs-1-li-1',
                code: '3.4.1.LI.1',
                text: 'Discuss heredity using traits observed in humans.',
                shortTopic: 'Heredity and traits in humans',
                pedagogicalExemplars: [
                  'Put learners in mixed-ability groups to review reproduction in humans from Year 2.',
                  'Allow learners to discuss traits and features that make humans, plants and animals look similar or different.',
                  'Using think-pair-share, guide learners to describe hereditary features in humans with pictures, videos and models.',
                ],
                assessment: { code: '3.4.1.AS.1', levels: assessmentLevels },
                resources: ['Pictures', 'Wall charts', 'Models', 'Videos', 'Computer with modem'],
                sourcePage: 114,
              },
              {
                id: 'shs3-general-science-3.4.1-cs-1-li-2',
                code: '3.4.1.LI.2',
                text: 'Discuss hereditary diseases in humans.',
                shortTopic: 'Hereditary diseases in humans',
                pedagogicalExemplars: [
                  'Using think-pair-share, learners discuss hereditary traits.',
                  'Explore hereditary diseases and disorders such as sickle cell, haemophilia, diabetes, cleft lip and palate.',
                  'Ensure teaching and interaction language is devoid of stereotypes and encourage learners to share experiences.',
                ],
                assessment: { code: '3.4.1.AS.2', levels: assessmentLevels },
                resources: ['Pictures', 'Wall charts', 'Models', 'Videos', 'Computer with modem'],
                sourcePage: 114,
              },
            ],
          },
        ],
      },
      {
        id: 'shs3-general-science-3.4.1-lo-2',
        code: '3.4.1.LO.2',
        text: 'Design mind maps and concept maps of some Mendelian crossings.',
        skillsAndCompetencies: [
          'Critical thinking through drawing and critiquing Mendelian crossings.',
          'Collaboration through mixed-ability group work.',
          'Communication through explaining sex determination and selected traits.',
        ],
        sourcePages: [112, 113, 114, 115],
        contentStandards: [
          {
            id: 'shs3-general-science-3.4.1-cs-2',
            code: '3.4.1.CS.2',
            text: 'Explore and model sex determination in humans.',
            sourcePage: 114,
            indicators: [
              {
                id: 'shs3-general-science-3.4.1-cs-2-li-1',
                code: '3.4.1.LI.1',
                text: 'Draw Mendelian crossings to explain sex determination in humans.',
                shortTopic: 'Mendelian crossing and sex determination',
                pedagogicalExemplars: [
                  'Using Diamond 9, allow learners to discuss their understanding of Mendelian crossing to show sex determination.',
                  'Get learners to compare individual drawings with drawings on pictures, videos or charts and critique themselves.',
                  'Using videos and pictures, put learners into groups to discuss and draw Mendelian crossings and explain how they show sex determination.',
                ],
                assessment: { code: '3.4.1.AS.1', levels: assessmentLevels },
                resources: ['Wall charts', 'Books', 'Pictures and videos on Mendelian crossing'],
                sourcePage: 114,
              },
              {
                id: 'shs3-general-science-3.4.1-cs-2-li-2',
                code: '3.4.1.LI.2',
                text: 'Explore selected traits in humans using applications of Mendelian crossing.',
                shortTopic: 'Mendelian crossing for selected human traits',
                pedagogicalExemplars: [
                  'In mixed-ability groups, learners select genes represented by letters of the alphabet and draw Mendelian crossings for traits such as height, skin colour and baldness.',
                ],
                assessment: { code: '3.4.1.AS.2', levels: assessmentLevels },
                resources: ['Wall charts', 'Books', 'Pictures', 'Videos on Mendelian crossing'],
                sourcePage: 114,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'shs3-general-science-4.2',
    subject: 'General Science',
    classLevel: 'SHS3',
    year: 3,
    strandCode: '4',
    strand: 'Relationships with the Environment',
    subStrandCode: '4.2',
    subStrand: 'Technology in Local Industries',
    sourcePages: [116, 117, 118],
    learningOutcomes: [
      {
        id: 'shs3-general-science-3.4.2-lo-1',
        code: '3.4.2.LO.1',
        text: 'Evaluate the scientific processes involved in indigenous texture production.',
        skillsAndCompetencies: [
          'Experiential learning through field visits.',
          'Communication through reports and class presentation.',
          'Critical thinking through analysing scientific processes and economic importance.',
        ],
        gesi: [
          'Use mixed-sex or mixed-ability groups and provide opportunities for active listening.',
        ],
        sourcePages: [116, 117, 118],
        contentStandards: [
          {
            id: 'shs3-general-science-3.4.2-cs-1',
            code: '3.4.2.CS.1',
            text: 'Demonstrate knowledge of the scientific processes involved in gari production.',
            sourcePage: 118,
            indicators: [
              {
                id: 'shs3-general-science-3.4.2-cs-1-li-1',
                code: '3.4.2.LI.1',
                text: 'Analyse the scientific processes involved in indigenous texture production.',
                shortTopic: 'Scientific processes in gari production',
                pedagogicalExemplars: [
                  'Visit a gari processing site in the locality to get first-hand information on how gari is produced.',
                  'Put learners in mixed-sex or mixed-ability groups to discuss findings from the field trip and write reports.',
                  'Using Diamond 9 discussion, learners enumerate the economic importance of gari and present ideas in class for discussion.',
                ],
                assessment: { code: '3.4.2.AS.1', levels: assessmentLevels },
                resources: ['Camera', 'Voice recording device', 'Pen', 'Notebooks or pads', 'Charts and pictures of a gari processing site'],
                sourcePage: 118,
              },
            ],
          },
        ],
      },
    ],
  },
];

