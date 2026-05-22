import type { ExplicitCurriculumTerm } from './mathematicsB7';

const resources = {
  safety: ['Career Technology textbook', 'Safety posters', 'First aid box', 'Demonstration tools'],
  materials: ['Material samples', 'Food samples', 'Charts', 'Career Technology textbook'],
  tools: ['Workshop tools', 'Measuring tools', 'Kitchen tools', 'Demonstration materials'],
  technology: ['Models', 'Simple circuit kit', 'Structure diagrams', 'Projector'],
  design: ['Sketch pad', 'Pencils', 'Design brief cards', 'Sample products'],
  enterprise: ['Business cards', 'Case studies', 'Budget sheets', 'Career Technology textbook'],
};

function week(
  weekNumber: number,
  strand: string,
  subStrand: string,
  contentStandard: string,
  indicator: string,
  topic: string,
  resourceList: string[]
) {
  return {
    week: weekNumber,
    strand,
    subStrand,
    contentStandard,
    indicator,
    topic,
    resources: resourceList,
  };
}

export const careerTechnologyB7Terms: ExplicitCurriculumTerm[] = [
  {
    subject: 'Career Technology',
    classLevel: 'B7',
    term: 'Term 1',
    title: 'B7 Career Technology Scheme of Work - Term 1',
    weeks: [
      week(
        1,
        'Health and Safety',
        'Personal Hygiene and Food Hygiene',
        'B7/JHS1.1.1.1 Demonstrate knowledge of personal hygiene and food hygiene.',
        'B7/JHS1.1.1.1.2 Describe ways of maintaining personal hygiene',
        'Personal hygiene and its importance',
        resources.safety
      ),
      week(
        2,
        'Health and Safety',
        'Personal Hygiene and Food Hygiene',
        'B7/JHS1.1.1.1 Demonstrate knowledge of personal hygiene and food hygiene.',
        'B7/JHS1.1.1.1.3 Discuss food hygiene',
        'Personal hygiene practices in practical work',
        resources.safety
      ),
      week(
        3,
        'Health and Safety',
        'Personal Hygiene and Food Hygiene',
        'B7/JHS1.1.1.1 Demonstrate knowledge of personal hygiene and food hygiene.',
        'B7/JHS1.1.1.1.3 Discuss food hygiene',
        'Food hygiene and safe food handling',
        resources.safety
      ),
      week(
        4,
        'Health and Safety',
        'Personal, Workshop and Food Laboratory Safety',
        'B7/JHS1.1.2.1 Demonstrate knowledge of preventing accidents in the workshop/site and laboratory.',
        'B7/JHS1.1.2.1.2 Explain the need for keeping the workshop/site and',
        'Accidents in the workshop, site and laboratory',
        resources.safety
      ),
      week(
        5,
        'Health and Safety',
        'Personal, Workshop and Food Laboratory Safety',
        'B7/JHS1.1.2.1 Demonstrate knowledge of preventing accidents in the workshop/site and laboratory.',
        'B7/JHS1.1.2.1.2 Explain the need for keeping the workshop/site and',
        'Causes of accidents and unsafe practices',
        resources.safety
      ),
      week(
        6,
        'Health and Safety',
        'Personal, Workshop and Food Laboratory Safety',
        'B7/JHS1.1.2.1 Demonstrate knowledge of preventing accidents in the workshop/site and laboratory.',
        'B7/JHS1.1.2.1.2 Explain the need for keeping the workshop/site and',
        'Safety rules and emergency responses',
        resources.safety
      ),
      week(
        7,
        'Materials for Production',
        'Compliant Materials',
        'B7/JHS1.2.1.1 Demonstrate knowledge of basic concept of compliant materials.',
        'B7/JHS1.2.1.1.2 Distinguish between types of compliant',
        'Meaning and examples of compliant materials',
        resources.materials
      ),
      week(
        8,
        'Materials for Production',
        'Compliant Materials',
        'B7/JHS1.2.1.1 Demonstrate knowledge of basic concept of compliant materials.',
        'B7/JHS1.2.1.1.1 Describe compliant materials',
        'Types of compliant materials',
        resources.materials
      ),
      week(
        9,
        'Materials for Production',
        'Resistant Materials',
        'B7/JHS1.2.2.1 Demonstrate knowledge of basic concept of resistant materials.',
        'B7/JHS1.2.2.1.3 Explain how each of the resistant materials is',
        'Meaning and examples of resistant materials',
        resources.materials
      ),
      week(
        10,
        'Materials for Production',
        'Resistant Materials',
        'B7/JHS1.2.2.1 Demonstrate knowledge of basic concept of resistant materials.',
        'B7/JHS1.2.2.1.1 Describe resistant materials',
        'Types of resistant materials',
        resources.materials
      ),
      week(
        11,
        'Materials for Production',
        'Smart and Modern Materials',
        'B7/JHS1.2.3.1 Demonstrate understanding of the properties of smart and modern materials.',
        'B7/JHS1.2.3.1.1 Explore the general properties of smart and modern',
        'Properties of smart and modern materials',
        resources.materials
      ),
      week(
        12,
        'Materials for Production',
        'Food Commodities (Animal and Plant Sources)',
        'B7/JHS1.2.4.1 Demonstrate understanding of food commodities from animal and plant sources.',
        'B7/JHS1.2.4.1.1 Discuss food commodities',
        'Food commodities from animal and plant sources',
        resources.materials
      ),
    ],
  },
  {
    subject: 'Career Technology',
    classLevel: 'B7',
    term: 'Term 2',
    title: 'B7 Career Technology Scheme of Work - Term 2',
    weeks: [
      week(
        1,
        'Tools, Equipment and Processes',
        'Measuring and Marking Out',
        'B7/JHS1.3.1.1 Demonstrate understanding of measuring and marking out tools and equipment.',
        'B7/JHS1.3.1.1.1 Classify and use measuring and marking out tools and',
        'Measuring and marking out tools',
        resources.tools
      ),
      week(
        2,
        'Tools, Equipment and Processes',
        'Measuring and Marking Out',
        'B7/JHS1.3.1.1 Demonstrate understanding of measuring and marking out tools and equipment.',
        'B7/JHS1.3.1.1.1 Classify and use measuring and marking out tools and',
        'Using measuring and marking out tools',
        resources.tools
      ),
      week(
        3,
        'Tools, Equipment and Processes',
        'Cutting/Shaping',
        'B7/JHS1.3.2.1 Demonstrate understanding of cutting and shaping tools and equipment.',
        'B7/JHS1.3.2.1.1 Identify cutting and shaping tools and equipment used',
        'Cutting and shaping tools',
        resources.tools
      ),
      week(
        4,
        'Tools, Equipment and Processes',
        'Cutting/Shaping',
        'B7/JHS1.3.2.1 Demonstrate understanding of cutting and shaping tools and equipment.',
        'B7/JHS1.3.2.1.1 Identify cutting and shaping tools and equipment used',
        'Using cutting and shaping tools safely',
        resources.tools
      ),
      week(
        5,
        'Tools, Equipment and Processes',
        'Joining and Assembling',
        'B7/JHS1.3.3.1 Demonstrate understanding of joining and assembling processes.',
        'B7/JHS1.3.3.1.1 Describe joining and assembling materials, tools and',
        'Joining and assembling techniques',
        resources.tools
      ),
      week(
        6,
        'Tools, Equipment and Processes',
        'Kitchen Essentials',
        'B7/JHS1.3.4.1 Demonstrate understanding of kitchen essentials.',
        'B7/JHS1.3.4.1.1 Describe kitchen essentials',
        'Kitchen tools and essentials',
        resources.tools
      ),
      week(
        7,
        'Tools, Equipment and Processes',
        'Kitchen Essentials',
        'B7/JHS1.3.4.1 Demonstrate understanding of kitchen essentials.',
        'B7/JHS1.3.4.1.1 Describe kitchen essentials',
        'Uses and care of kitchen essentials',
        resources.tools
      ),
      week(
        8,
        'Tools, Equipment and Processes',
        'Finishes and Finishing',
        'B7/JHS1.3.5.1 Demonstrate understanding of finishes and finishing.',
        'B7/JHS1.3.5.1.1 Identify finishes and finishing applied to products/',
        'Meaning and importance of finishing',
        resources.tools
      ),
      week(
        9,
        'Technology',
        'Simple Structures and Mechanisms, Electric and Electronic Systems',
        'B7/JHS1.4.1.1 Demonstrate understanding of simple structures and mechanisms and basic electric/electronic systems.',
        'B7/JHS1.4.1.1.3 Design and make simple structures',
        'Simple structures and mechanisms in the environment',
        resources.technology
      ),
      week(
        10,
        'Technology',
        'Simple Structures and Mechanisms, Electric and Electronic Systems',
        'B7/JHS1.4.1.1 Demonstrate understanding of simple structures and mechanisms and basic electric/electronic systems.',
        'B7/JHS1.4.1.1.3 Design and make simple structures',
        'Basic electric and electronic systems',
        resources.technology
      ),
      week(
        11,
        'Technology',
        'Simple Structures and Mechanisms, Electric and Electronic Systems',
        'B7/JHS1.4.1.1 Demonstrate understanding of simple structures and mechanisms and basic electric/electronic systems.',
        'B7/JHS1.4.1.1.3 Design and make simple structures',
        'Applying simple technology to everyday problems',
        resources.technology
      ),
      week(
        12,
        'Tools, Equipment and Processes',
        'Review of Processes and Technology',
        'B7/JHS1.4.1.1 Integrated review of practical tools, equipment and technology.',
        'B7/JHS1.4.1.1.3 Design and make simple structures',
        'Integrated review of tools, equipment and technology',
        resources.tools
      ),
    ],
  },
  {
    subject: 'Career Technology',
    classLevel: 'B7',
    term: 'Term 3',
    title: 'B7 Career Technology Scheme of Work - Term 3',
    weeks: [
      week(
        1,
        'Designing and Making of Artefacts/Products',
        'Communicating Designs',
        'B7/JHS1.5.1.1 Demonstrate knowledge and skills in communicating designs.',
        'B7/JHS1.5.1.1.2 Discuss the types of lines used in graphic',
        'Communicating design ideas',
        resources.design
      ),
      week(
        2,
        'Designing and Making of Artefacts/Products',
        'Communicating Designs',
        'B7/JHS1.5.3.1 Demonstrate knowledge and skills in communicating designs.',
        'B7/JHS1.5.3.1.1 Discuss the factors to consider when planning a meal Communication and collaboration (CC) Demonstrate',
        'Sketching and symbols in design communication',
        resources.design
      ),
      week(
        3,
        'Designing and Making of Artefacts/Products',
        'Designing',
        'B7/JHS1.5.4.1 Demonstrate knowledge and skills in designing.',
        'B7/JHS1.5.4.1.2 Demonstrate skills of making artefacts/products in sewing',
        'Identifying problems and writing design briefs',
        resources.design
      ),
      week(
        4,
        'Designing and Making of Artefacts/Products',
        'Designing',
        'B7/JHS1.5.4.1 Demonstrate knowledge and skills in designing.',
        'B7/JHS1.5.4.1.2 Demonstrate skills of making artefacts/products in sewing',
        'Generating and selecting design ideas',
        resources.design
      ),
      week(
        5,
        'Designing and Making of Artefacts/Products',
        'Planning for Making Artefacts/Products',
        'B7/JHS1.5.3.1 Demonstrate knowledge and skills in planning for making artefacts/products.',
        'B7/JHS1.5.3.1.1 Discuss the factors to consider when planning a meal Communication and collaboration (CC) Demonstrate',
        'Planning materials, tools and steps',
        resources.design
      ),
      week(
        6,
        'Designing and Making of Artefacts/Products',
        'Planning for Making Artefacts/Products',
        'B7/JHS1.5.3.1 Demonstrate knowledge and skills in planning for making artefacts/products.',
        'B7/JHS1.5.3.1.1 Discuss the factors to consider when planning a meal Communication and collaboration (CC) Demonstrate',
        'Simple production planning',
        resources.design
      ),
      week(
        7,
        'Designing and Making of Artefacts/Products',
        'Making Artefacts from Compliant, Resistant Materials and Food Ingredients',
        'B7/JHS1.5.4.1 Demonstrate knowledge and skills in making artefacts/products.',
        'B7/JHS1.5.4.1.2 Demonstrate skills of making artefacts/products in sewing',
        'Making simple artefacts from compliant materials and food ingredients',
        resources.design
      ),
      week(
        8,
        'Designing and Making of Artefacts/Products',
        'Making Artefacts from Compliant, Resistant Materials and Food Ingredients',
        'B7/JHS1.5.4.1 Demonstrate knowledge and skills in making artefacts/products.',
        'B7/JHS1.5.4.1.2 Demonstrate skills of making artefacts/products in sewing',
        'Making simple artefacts from resistant materials',
        resources.design
      ),
      week(
        9,
        'Entrepreneurial Skills',
        'Career Pathways and Career Opportunities',
        'B7/JHS1.5.4.1 Demonstrate understanding of career pathways and opportunities.',
        'B7/JHS1.5.4.1.3 Make mock-ups using compliant and resistant materials ideas to create novel things.',
        'Career pathways in Career Technology',
        resources.enterprise
      ),
      week(
        10,
        'Entrepreneurial Skills',
        'Career Pathways and Career Opportunities',
        'B7/JHS1.5.4.1 Demonstrate understanding of career pathways and opportunities.',
        'B7/JHS1.5.4.1.3 Make mock-ups using compliant and resistant materials ideas to create novel things.',
        'Skills and attitudes for career opportunities',
        resources.enterprise
      ),
      week(
        11,
        'Entrepreneurial Skills',
        'Establishing and Managing a Small Business Enterprise',
        'B7/JHS1.6.2.1 Demonstrate understanding of establishing and managing a small business enterprise.',
        'B7/JHS1.6.2.1.3 Explain the advantages and disadvantages of being an',
        'Meaning and features of a small business enterprise',
        resources.enterprise
      ),
      week(
        12,
        'Entrepreneurial Skills',
        'Establishing and Managing a Small Business Enterprise',
        'B7/JHS1.6.2.1 Demonstrate understanding of establishing and managing a small business enterprise.',
        'B7/JHS1.6.2.1.3 Explain the advantages and disadvantages of being an',
        'Basic steps in starting and managing an enterprise',
        resources.enterprise
      ),
    ],
  },
];

export const careerTechnologyB8Terms: ExplicitCurriculumTerm[] = [
  {
    subject: 'Career Technology',
    classLevel: 'B8',
    term: 'Term 1',
    title: 'B8 Career Technology Scheme of Work - Term 1',
    weeks: [
      week(1, 'Health and Safety', 'Personal Hygiene and Food Hygiene', 'B8/JHS2.1.1.1 Demonstrate understanding of personal hygiene and food hygiene.', 'B8/JHS2.1.1.1.2 Demonstrate skills in keeping food safe (food hygiene)', 'Applying personal and food hygiene practices', resources.safety),
      week(2, 'Health and Safety', 'Personal, Workshop and Food Laboratory Safety', 'B8/JHS2.5.3.1 Demonstrate understanding of personal, workshop and food laboratory safety.', 'B8/JHS2.5.3.1.1 Plan and make wooden, metal/plastic artefacts', 'Safety signs, rules and procedures', resources.safety),
      week(3, 'Health and Safety', 'Environment', 'B8/JHS2.5.2.1 Demonstrate understanding of environmental cleanliness and safety.', 'B8/JHS2.5.2.1.5 Make artefact using resistant materials', 'Environmental sanitation and safety', resources.safety),
      week(4, 'Materials for Production', 'Compliant Materials', 'B8/JHS2.2.1.1 Demonstrate understanding of compliant materials.', 'B8/JHS2.2.1.1.2 Discuss the basic characteristics of compliant materials', 'Properties and uses of compliant materials', resources.materials),
      week(5, 'Materials for Production', 'Compliant Materials', 'B8/JHS2.3.1.1 Demonstrate understanding of compliant materials.', 'B8/JHS2.3.1.1.3 Use appropriate techniques to measure', 'Selecting compliant materials for products', resources.materials),
      week(6, 'Materials for Production', 'Resistant Materials', 'B8/JHS2.2.2.1 Demonstrate understanding of resistant materials.', 'B8/JHS2.2.2.1.1 Explain the basic properties of resistant materials', 'Properties and uses of resistant materials', resources.materials),
      week(7, 'Materials for Production', 'Resistant Materials', 'B8/JHS2.3.1.1 Demonstrate understanding of resistant materials.', 'B8/JHS2.3.1.1.3 Use appropriate techniques to measure', 'Selecting resistant materials for products', resources.materials),
      week(8, 'Materials for Production', 'Smart and Modern Materials', 'B8/JHS2.2.3.1 Demonstrate understanding of smart and modern materials.', 'B8/JHS2.2.3.1.1 Discuss smart and modern materials', 'Factors affecting smart and modern materials', resources.materials),
      week(9, 'Materials for Production', 'Smart and Modern Materials', 'B8/JHS2.2.3.1 Demonstrate understanding of smart and modern materials.', 'B8/JHS2.2.3.1.1 Discuss smart and modern materials', 'Uses of smart and modern materials', resources.materials),
      week(10, 'Materials for Production', 'Food Commodities (Animal and Plant Sources)', 'B8/JHS2.2.4.1 Demonstrate understanding of food commodities.', 'B8/JHS2.2.4.1.1 Explore the functions of food to the body', 'Functions of food commodities', resources.materials),
      week(11, 'Materials for Production', 'Food Commodities (Animal and Plant Sources)', 'B8/JHS2.2.4.1 Demonstrate understanding of food commodities.', 'B8/JHS2.2.4.1.1 Explore the functions of food to the body', 'Classifying foods by nutritional functions', resources.materials),
      week(12, 'Materials for Production', 'Review of Materials for Production', 'B8/JHS2.3.1.1 Integrated review of materials for production.', 'B8/JHS2.3.1.1.2 Take measurements of body/products/artefacts/articles', 'Integrated review of materials for production', resources.materials),
    ],
  },
  {
    subject: 'Career Technology',
    classLevel: 'B8',
    term: 'Term 2',
    title: 'B8 Career Technology Scheme of Work - Term 2',
    weeks: [
      week(1, 'Tools, Equipment and Processes', 'Measuring and Marking Out', 'B8/JHS2.3.1.1 Demonstrate understanding of measuring and marking out.', 'B8/JHS2.3.1.1.1 Identify tools and equipment for measuring and', 'Selecting and using measuring and marking tools', resources.tools),
      week(2, 'Tools, Equipment and Processes', 'Measuring and Marking Out', 'B8/JHS2.3.1.1 Demonstrate understanding of measuring and marking out.', 'B8/JHS2.3.1.1.1 Identify tools and equipment for measuring and', 'Accuracy in measuring and marking', resources.tools),
      week(3, 'Tools, Equipment and Processes', 'Cutting/Shaping', 'B8/JHS2.3.2.1 Demonstrate understanding of cutting and shaping.', 'B8/JHS2.3.2.1.1 Identify and use cutting and shaping tools and', 'Cutting and shaping across trade areas', resources.tools),
      week(4, 'Tools, Equipment and Processes', 'Cutting/Shaping', 'B8/JHS2.3.2.1 Demonstrate understanding of cutting and shaping.', 'B8/JHS2.3.2.1.1 Identify and use cutting and shaping tools and', 'Uses of cutting and shaping tools', resources.tools),
      week(5, 'Tools, Equipment and Processes', 'Joining and Assembling', 'B8/JHS2.3.3.1 Demonstrate understanding of joining and assembling.', 'B8/JHS2.3.3.1.1 Identify joining and assembling materials, tools and', 'Joining and assembling methods', resources.tools),
      week(6, 'Tools, Equipment and Processes', 'Kitchen Essentials', 'B8/JHS2.3.4.1 Demonstrate understanding of kitchen essentials.', 'B8/JHS2.3.4.1.1 Demonstrate how to care for and maintain kitchen', 'Selecting and using kitchen essentials', resources.tools),
      week(7, 'Tools, Equipment and Processes', 'Finishes and Finishing', 'B8/JHS2.3.5.1 Demonstrate understanding of finishes and finishing.', 'B8/JHS2.3.5.1.2 Demonstrate skills of finishing edges of sewing articles', 'Finishing processes and their uses', resources.tools),
      week(8, 'Technology', 'Simple Structures and Mechanisms, Electric and Electronic Systems', 'B8/JHS2.4.1.1 Demonstrate understanding of simple structures and systems.', 'B8/JHS2.4.1.1.2 Design and make simple school technology projects', 'Functions of simple structures and mechanisms', resources.technology),
      week(9, 'Technology', 'Simple Structures and Mechanisms, Electric and Electronic Systems', 'B8/JHS2.4.1.1 Demonstrate understanding of simple structures and systems.', 'B8/JHS2.4.1.1.2 Design and make simple school technology projects', 'Electric and electronic systems in everyday products', resources.technology),
      week(10, 'Technology', 'Simple Structures and Mechanisms, Electric and Electronic Systems', 'B8/JHS2.4.1.1 Demonstrate understanding of simple structures and systems.', 'B8/JHS2.4.1.1.2 Design and make simple school technology projects', 'Technology systems in design and production', resources.technology),
      week(11, 'Tools, Equipment and Processes', 'Integrated Practical Review', 'B8/JHS2.3.1.1 Integrated review of tools, equipment and technology systems.', 'B8/JHS2.3.1.1.3 Use appropriate techniques to measure', 'Integrated practical review', resources.tools),
      week(12, 'Technology', 'Integrated Systems Review', 'B8/JHS2.4.1.1 Integrated systems review.', 'B8/JHS2.4.1.1.2 Design and make simple school technology projects', 'Integrated systems review', resources.technology),
    ],
  },
  {
    subject: 'Career Technology',
    classLevel: 'B8',
    term: 'Term 3',
    title: 'B8 Career Technology Scheme of Work - Term 3',
    weeks: [
      week(1, 'Designing and Making of Artefacts/Products', 'Communicating Design', 'B8/JHS2.5.1.1 Demonstrate understanding of drawing plane figures and solid objects using drawing instruments.', 'B8/JHS2.5.1.1.1 Draw plane figures using instruments', 'Drawing plane figures using instruments', resources.design),
      week(2, 'Designing and Making of Artefacts/Products', 'Communicating Design', 'B8/JHS2.5.1.1 Demonstrate understanding of drawing plane figures and solid objects using drawing instruments.', 'B8/JHS2.5.1.1.2 Draw objects in pictorial using instruments', 'Drawing objects in pictorial using instruments', resources.design),
      week(3, 'Designing and Making of Artefacts/Products', 'Designing', 'B8/JHS2.5.4.1 Demonstrate knowledge and skills in designing.', 'B8/JHS2.5.4.1.2 Demonstrate skills in making sewing artefacts/products', 'Writing design briefs from problem situations', resources.design),
      week(4, 'Designing and Making of Artefacts/Products', 'Designing', 'B8/JHS2.5.4.1 Demonstrate knowledge and skills in designing.', 'B8/JHS2.5.4.1.2 Demonstrate skills in making sewing artefacts/products', 'Researching and analysing design problems', resources.design),
      week(5, 'Designing and Making of Artefacts/Products', 'Designing', 'B8/JHS2.5.4.1 Demonstrate knowledge and skills in designing.', 'B8/JHS2.5.4.1.2 Demonstrate skills in making sewing artefacts/products', 'Writing and justifying design specifications', resources.design),
      week(6, 'Designing and Making of Artefacts/Products', 'Planning for Making Artefacts/Products', 'B8/JHS2.5.3.1 Demonstrate knowledge and skills in planning for making artefacts/products.', 'B8/JHS2.5.3.1.3 Planning to set a table', 'Production planning and scheduling', resources.design),
      week(7, 'Designing and Making of Artefacts/Products', 'Planning for Making Artefacts/Products', 'B8/JHS2.5.3.1 Demonstrate knowledge and skills in planning for making artefacts/products.', 'B8/JHS2.5.3.1.3 Planning to set a table', 'Estimating materials and sequencing operations', resources.design),
      week(8, 'Designing and Making of Artefacts/Products', 'Making Artefacts from Compliant, Resistant Materials and Food Ingredients', 'B8/JHS2.5.4.1 Demonstrate knowledge and skills in making artefacts/products.', 'B8/JHS2.5.4.1.2 Demonstrate skills in making sewing artefacts/products', 'Making products from planned designs', resources.design),
      week(9, 'Designing and Making of Artefacts/Products', 'Making Artefacts from Compliant, Resistant Materials and Food Ingredients', 'B8/JHS2.5.4.1 Demonstrate knowledge and skills in making artefacts/products.', 'B8/JHS2.5.4.1.2 Demonstrate skills in making sewing artefacts/products', 'Appraising and improving finished products', resources.design),
      week(10, 'Entrepreneurial Skills', 'Career Pathways and Career Opportunities', 'B8/JHS2.6.1.1 Demonstrate understanding of career pathways and opportunities.', 'B8/JHS2.6.1.1.1 Explore the various career pathways and opportunities in', 'Exploring career opportunities in practical fields', resources.enterprise),
      week(11, 'Entrepreneurial Skills', 'Establishing and Managing a Small Business Enterprise', 'B8/JHS2.6.2.1 Demonstrate understanding of establishing and managing micro and small business enterprises.', 'B8/JHS2.6.2.1.1 Explain what is meant by Micro, Small and Medium-sized', 'Micro, small and medium-sized enterprises', resources.enterprise),
      {
        week: 12,
        strand: 'Entrepreneurial Skills',
        subStrand: 'Establishing and Managing a Small Business Enterprise',
        contentStandard: 'B8/JHS2.6.2.1 Demonstrate understanding of establishing and managing micro and small business enterprises.',
        indicator: 'B8/JHS2.6.2.1.1 Explain what is meant by Micro, Small and Medium-sized',
        topic: 'Setting up, managing and classifying small enterprises',
        resources: resources.enterprise,
        entries: [
          {
            strand: 'Entrepreneurial Skills',
            subStrand: 'Establishing and Managing a Small Business Enterprise',
            contentStandard: 'B8/JHS2.6.2.1 Demonstrate understanding of establishing and managing micro and small business enterprises.',
            indicator: 'B8/JHS2.6.2.1.1 Explain what is meant by Micro, Small and Medium-sized',
            topic: 'Steps in setting up and managing small enterprises',
            resources: resources.enterprise,
          },
          {
            strand: 'Entrepreneurial Skills',
            subStrand: 'Establishing and Managing a Small Business Enterprise',
            contentStandard: 'B8/JHS2.6.2.1 Demonstrate understanding of establishing and managing micro and small business enterprises.',
            indicator: 'B8/JHS2.6.2.1.1 Explain what is meant by Micro, Small and Medium-sized',
            topic: 'Classifying local businesses and enterprise ideas',
            resources: resources.enterprise,
          },
        ],
      },
    ],
  },
];

export const careerTechnologyB9Terms: ExplicitCurriculumTerm[] = [
  {
    subject: 'Career Technology',
    classLevel: 'B9',
    term: 'Term 1',
    title: 'B9 Career Technology Scheme of Work - Term 1',
    weeks: [
      week(1, 'Health and Safety', 'Personal Hygiene and Food Hygiene', 'B9/JHS3.1.2.1 Demonstrate advanced understanding of personal hygiene and food hygiene.', 'B9/JHS3.1.2.1.3 Maintain safe working environments', 'Applying advanced hygiene practices', resources.safety),
      week(2, 'Health and Safety', 'Personal, Workshop and Food Laboratory Safety', 'B9/JHS3.1.2.1 Demonstrate skills related to personal, workshop and laboratory safety.', 'B9/JHS3.1.2.1.3 Maintain safe working environments', 'Reporting accidents and unsafe practices', resources.safety),
      week(3, 'Health and Safety', 'Personal, Workshop and Food Laboratory Safety', 'B9/JHS3.1.2.1 Demonstrate skills related to personal, workshop and laboratory safety.', 'B9/JHS3.1.2.1.3 Maintain safe working environments', 'Safe responses and responsibilities', resources.safety),
      week(4, 'Materials for Production', 'Compliant Materials', 'B9/JHS3.2.1.1 Demonstrate skills in selecting compliant materials for making products and artefacts.', 'B9/JHS3.2.1.1.1 Discuss the factors that influence the selection of', 'Selecting compliant materials', resources.materials),
      week(5, 'Materials for Production', 'Compliant Materials', 'B9/JHS3.2.1.1 Demonstrate skills in selecting compliant materials for making products and artefacts.', 'B9/JHS3.2.1.1.1 Discuss the factors that influence the selection of', 'Processes in working with compliant materials', resources.materials),
      week(6, 'Materials for Production', 'Resistant Materials', 'B9/JHS3.4.1.1 Demonstrate skills in selecting resistant materials for making products and artefacts.', 'B9/JHS3.4.1.1.3 Design and make simple school technology projects using', 'Selecting resistant materials', resources.materials),
      week(7, 'Materials for Production', 'Resistant Materials', 'B9/JHS3.4.1.1 Demonstrate skills in selecting resistant materials for making products and artefacts.', 'B9/JHS3.4.1.1.3 Design and make simple school technology projects using', 'Processes in working with resistant materials', resources.materials),
      week(8, 'Materials for Production', 'Smart and Modern Materials', 'B9/JHS3.2.3.1 Demonstrate understanding of using smart and modern materials for making products/artefacts.', 'B9/JHS3.2.3.1.2 Demonstrate techniques for making prototypes/ projects to solve problems in the environment using smart and', 'Using smart and modern materials in production', resources.materials),
      week(9, 'Materials for Production', 'Smart and Modern Materials', 'B9/JHS3.2.3.1 Demonstrate understanding of using smart and modern materials for making products/artefacts.', 'B9/JHS3.2.3.1.2 Demonstrate techniques for making prototypes/ projects to solve problems in the environment using smart and', 'Making prototypes with smart and modern materials', resources.materials),
      week(10, 'Materials for Production', 'Food Commodities (Animal and Plant Sources)', 'B9/JHS3.2.4.1 Demonstrate skills in selecting food commodities and planning meals.', 'B9/JHS3.2.4.1.1 Discuss how to select food commodities used for meal', 'Selecting food commodities for meal preparation', resources.materials),
      week(11, 'Materials for Production', 'Food Commodities (Animal and Plant Sources)', 'B9/JHS3.2.4.1 Demonstrate skills in selecting food commodities and planning meals.', 'B9/JHS3.2.4.1.2 Discuss the basic food requirements for different Collaboration (CC),', 'Meal planning for different family members', resources.materials),
      week(12, 'Materials for Production', 'Integrated Materials Review', 'B9/JHS3.2.4.1 Integrated review of materials for production and food planning.', 'B9/JHS3.2.4.1.2 Discuss the basic food requirements for different Collaboration (CC),', 'Integrated materials and food planning review', resources.materials),
    ],
  },
  {
    subject: 'Career Technology',
    classLevel: 'B9',
    term: 'Term 2',
    title: 'B9 Career Technology Scheme of Work - Term 2',
    weeks: [
      week(1, 'Tools, Equipment and Processes', 'Measuring and Marking Out', 'B9/JHS3.2.1.1 Demonstrate understanding of measuring and marking out tools and processes.', 'B9/JHS3.2.1.1.1 Discuss the factors that influence the selection of', 'Advanced measuring and marking out', resources.tools),
      week(2, 'Tools, Equipment and Processes', 'Measuring and Marking Out', 'B9/JHS3.2.1.1 Demonstrate understanding of measuring and marking out tools and processes.', 'B9/JHS3.2.1.1.1 Discuss the factors that influence the selection of', 'Applying measuring and marking techniques', resources.tools),
      week(3, 'Tools, Equipment and Processes', 'Cutting/Shaping', 'B9/JHS3.3.2.1 Demonstrate understanding of cutting/shaping tools and equipment used for making artefacts/products.', 'B9/JHS3.3.2.1.1 Discuss tools and equipment used for cutting and shaping', 'Cutting and shaping across trade areas', resources.tools),
      week(4, 'Tools, Equipment and Processes', 'Cutting/Shaping', 'B9/JHS3.3.2.1 Demonstrate understanding of cutting/shaping tools and equipment used for making artefacts/products.', 'B9/JHS3.3.2.1.2 Demonstrate how to use shaping and cutting tools and', 'Cutting, shaping and tool care', resources.tools),
      week(5, 'Tools, Equipment and Processes', 'Joining and Assembling', 'B9/JHS3.3.3.1 Demonstrate understanding of joining and assembling processes.', 'B9/JHS3.3.3.1.1 Discuss joining and assembling materials, tools and', 'Applying joining and assembling processes', resources.tools),
      week(6, 'Tools, Equipment and Processes', 'Kitchen Essentials', 'B9/JHS3.3.4.1 Demonstrate understanding of kitchen essentials.', 'B9/JHS3.3.4.1.1 Select and purchase suitable kitchen essentials to meet', 'Efficient use of kitchen essentials', resources.tools),
      week(7, 'Tools, Equipment and Processes', 'Finishes and Finishing', 'B9/JHS3.3.5.1 Demonstrate understanding of finishes and finishing.', 'B9/JHS3.3.5.1.1 Demonstrate the techniques of applying finishes to resistant Communication and Demonstrate materials Collaboration (CC), understanding of', 'Applying finishes and finishing', resources.tools),
      week(8, 'Technology', 'Simple Structures and Mechanisms, Electric and Electronic Systems', 'B9/JHS3.4.1.1 Demonstrate understanding of structures and systems in practical technology.', 'B9/JHS3.4.1.1.3 Design and make simple school technology projects using', 'Structure-function relationships in products', resources.technology),
      week(9, 'Technology', 'Simple Structures and Mechanisms, Electric and Electronic Systems', 'B9/JHS3.4.1.1 Demonstrate understanding of structures and systems in practical technology.', 'B9/JHS3.4.1.1.3 Design and make simple school technology projects using', 'Electric and electronic components in simple systems', resources.technology),
      week(10, 'Technology', 'Simple Structures and Mechanisms, Electric and Electronic Systems', 'B9/JHS3.4.1.1 Demonstrate understanding of structures and systems in practical technology.', 'B9/JHS3.4.1.1.3 Design and make simple school technology projects using', 'Applying simple technological systems', resources.technology),
      week(11, 'Tools, Equipment and Processes', 'Integrated Practical Systems Review', 'B9/JHS3.5.4.1 Integrated review of tools, equipment and systems.', 'B9/JHS3.5.4.1.2 Create advanced articles using crocheting and embroidery', 'Integrated practical systems review', resources.tools),
      week(12, 'Technology', 'Integrated Technology Review', 'B9/JHS3.4.1.1 Integrated technology review.', 'B9/JHS3.4.1.1.3 Design and make simple school technology projects using', 'Integrated technology review', resources.technology),
    ],
  },
  {
    subject: 'Career Technology',
    classLevel: 'B9',
    term: 'Term 3',
    title: 'B9 Career Technology Scheme of Work - Term 3',
    weeks: [
      week(1, 'Designing and Making of Artefacts/Products', 'Communicating Designs', 'B9/JHS3.3.3.1 Demonstrate knowledge and skills in communicating designs.', 'B9/JHS3.3.3.1.2 Demonstrate appropriate skills in the use of joining and', 'Detailed communication of design solutions', resources.design),
      week(2, 'Designing and Making of Artefacts/Products', 'Designing', 'B9/JHS3.5.2.1 Demonstrate knowledge of designing.', 'B9/JHS3.5.2.1.2 Clarify user requirements', 'Identifying user requirements', resources.design),
      week(3, 'Designing and Making of Artefacts/Products', 'Designing', 'B9/JHS3.5.2.1 Demonstrate knowledge of designing.', 'B9/JHS3.5.2.1.2 Clarify user requirements', 'Analysing problems and writing design briefs', resources.design),
      week(4, 'Designing and Making of Artefacts/Products', 'Designing', 'B9/JHS3.5.2.1 Demonstrate knowledge of designing.', 'B9/JHS3.5.2.1.2 Clarify user requirements', 'Developing design specifications', resources.design),
      week(5, 'Designing and Making of Artefacts/Products', 'Planning for Making Artefacts/Products', 'B9/JHS3.3.3.1 Demonstrate knowledge and skills in planning for making artefacts/products.', 'B9/JHS3.3.3.1.2 Demonstrate appropriate skills in the use of joining and', 'Detailed planning for making products', resources.design),
      week(6, 'Designing and Making of Artefacts/Products', 'Planning for Making Artefacts/Products', 'B9/JHS3.3.3.1 Demonstrate knowledge and skills in planning for making artefacts/products.', 'B9/JHS3.3.3.1.2 Demonstrate appropriate skills in the use of joining and', 'Sequencing operations and estimating resources', resources.design),
      week(7, 'Designing and Making of Artefacts/Products', 'Making Artefacts from Compliant, Resistant Materials and Food Ingredients', 'B9/JHS3.4.1.1 Demonstrate knowledge and skills in making artefacts/products.', 'B9/JHS3.4.1.1.3 Design and make simple school technology projects using', 'Making products from selected materials', resources.design),
      week(8, 'Designing and Making of Artefacts/Products', 'Making Artefacts from Compliant, Resistant Materials and Food Ingredients', 'B9/JHS3.4.1.1 Demonstrate knowledge and skills in making artefacts/products.', 'B9/JHS3.4.1.1.3 Design and make simple school technology projects using', 'Evaluating finished products against design criteria', resources.design),
      week(9, 'Entrepreneurial Skills', 'Career Pathways and Career Opportunities', 'B9/JHS3.6.1.1 Demonstrate understanding of career pathways and opportunities.', 'B9/JHS3.6.1.1.3 Develop a career plan that would assist in the transition', 'Analysing career pathways and opportunities', resources.enterprise),
      week(10, 'Entrepreneurial Skills', 'Establishing and Managing a Small Business Enterprise', 'B9/JHS3.6.2.1 Demonstrate understanding of establishing and managing a small business enterprise.', 'B9/JHS3.6.2.1.2 Explain how to manage resources of small business', 'Starting and running a small business', resources.enterprise),
      week(11, 'Entrepreneurial Skills', 'Establishing and Managing a Small Business Enterprise', 'B9/JHS3.6.2.1 Demonstrate understanding of establishing and managing a small business enterprise.', 'B9/JHS3.6.2.1.2 Explain how to manage resources of small business', 'Business naming, licensing and registration', resources.enterprise),
      week(12, 'Entrepreneurial Skills', 'Establishing and Managing a Small Business Enterprise', 'B9/JHS3.6.2.1 Demonstrate understanding of establishing and managing a small business enterprise.', 'B9/JHS3.6.2.1.2 Explain how to manage resources of small business', 'Preparing a simple business plan', resources.enterprise),
    ],
  },
];
