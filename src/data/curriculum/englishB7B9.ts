import type { ExplicitCurriculumTerm } from './mathematicsB7';
import type { SchemeWeek, SchemeWeekEntry } from '@/types/scheme';

const resources = {
  oral: ['English textbook', 'Prompt cards', 'Audio clips', 'Discussion guide'],
  reading: ['Reading passages', 'Library books', 'Graphic organisers', 'Highlighters'],
  grammar: ['Sentence cards', 'Grammar reference chart', 'Exercise book'],
  writing: ['Exercise book', 'Writing frame', 'Model texts', 'Dictionary'],
  literature: ['Poems', 'Stories', 'Drama excerpts', 'Performance space'],
  media: ['Projector', 'Newspaper or blog samples', 'Audio-visual clips'],
};

function entry(
  strand: string,
  subStrand: string,
  contentStandard: string,
  indicator: string,
  topic: string,
  extraResources: string[] = []
): SchemeWeekEntry {
  return {
    strand,
    subStrand,
    contentStandard,
    indicator,
    topic,
    resources: extraResources,
  };
}

function week(weekNumber: number, theme: string, entries: SchemeWeekEntry[]): SchemeWeek {
  const primary = entries[0];
  const mergedResources = [...new Set(entries.flatMap((item) => item.resources ?? []))];

  return {
    week: weekNumber,
    theme,
    topic: theme,
    strand: primary?.strand,
    subStrand: primary?.subStrand,
    contentStandard: primary?.contentStandard,
    indicator: primary?.indicator,
    resources: mergedResources,
    entries,
  };
}

export const englishB7Terms: ExplicitCurriculumTerm[] = [
  {
    subject: 'English Language',
    classLevel: 'B7',
    term: 'Term 1',
    title: 'B7 English Language Scheme of Work - Term 1',
    weeks: [
      week(1, 'Formal and informal introductions', [
        entry('Oral Language', 'Conversation/Everyday Discourse', "B7/JHS1.1.1.1 Demonstrate use of appropriate language orally in specific situations.", "B7/JHS1.1.1.1.1 Use appropriate register in everyday communication (informal and formal) with diverse partners on grade-level topics/texts/issues", 'Formal and informal greetings and introductions', resources.oral),
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.1 Demonstrate increasing confidence and enjoyment in independent reading.", "B7/JHS1.2.1.1.1 Read and understand a range of texts using monitoring and mental visualisation strategies to interpret texts", 'Reading short personal and school texts for main ideas', resources.reading),
        entry('Writing', 'Production and Distribution of Writing', "B7/JHS1.4.2.1 Develop, organise and express ideas coherently and cohesively in writing.", "B7/JHS1.4.2.1.2 Use precise (technical) vocabulary, phrases and sensory language to convey a vivid mental picture of people and experiences", 'Writing a self-introduction paragraph', resources.writing),
      ]),
      week(2, 'Asking questions and predicting meaning', [
        entry('Oral Language', 'Conversation/Everyday Discourse', "B7/JHS1.1.1.1 Demonstrate use of appropriate language orally in specific situations.", "B7/JHS1.1.1.1.2 Ask questions that elicit elaboration and respond to others’ questions in conversation", 'Open-ended questioning in conversation', resources.oral),
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.1 Demonstrate increasing confidence and enjoyment in independent reading.", "B7/JHS1.2.1.1.2 Use prediction to assess and improve understanding of texts", 'Predicting content using titles, pictures and text features', resources.reading),
        entry('Grammar Usage', 'Vocabulary', "B7/JHS1.3.3.1 Demonstrate appropriate use of vocabulary in communication.", "B7/JHS1.3.3.1.1 Apply vocabulary appropriately in specific contexts", 'Vocabulary for questioning and responding', resources.grammar),
      ]),
      week(3, 'Describing experiences and monitoring reading', [
        entry('Oral Language', 'Conversation/Everyday Discourse', "B7/JHS1.1.1.1 Demonstrate use of appropriate language orally in specific situations.", "B7/JHS1.1.1.1.3 Use appropriate language orally to describe experiences about oneself and others", 'Describing familiar experiences orally', resources.oral),
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.1 Demonstrate increasing confidence and enjoyment in independent reading.", "B7/JHS1.2.1.1.3 Generate and answer questions to increase understanding and independent reading of fiction texts", 'Questioning and monitoring meaning in fiction', resources.reading),
        entry('Grammar Usage', 'Grammar', "B7/JHS1.3.1.1 Apply grammar accurately in communication.", "B7/JHS1.3.1.1.3 Explore accurate use of adjectives in texts", 'Descriptive words in oral and written communication', resources.grammar),
      ]),
      week(4, 'Giving directions and understanding text structure', [
        entry('Oral Language', 'Conversation/Everyday Discourse', "B7/JHS1.1.1.1 Demonstrate use of appropriate language orally in specific situations.", "B7/JHS1.1.1.1.4 Listen to and give accurate directions to familiar places", 'Giving and following directions', resources.oral),
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.1 Demonstrate increasing confidence and enjoyment in independent reading.", "B7/JHS1.2.1.1.4 Use text structure to understand and read texts independently", 'Text structures: sequence, cause and effect, compare and contrast', resources.reading),
        entry('Writing', 'Building and Presenting Knowledge', "B7/JHS1.4.3.1 Research to build and present knowledge.", "B7/JHS1.4.3.1.1 Identify and record information from non-text sources (figures and tables), organise and present it in writing", 'Writing guided directions using sequence words', resources.writing),
      ]),
      week(5, 'Voice control and non-fiction features', [
        entry('Oral Language', 'Conversation/Everyday Discourse', "B7/JHS1.1.1.1 Demonstrate use of appropriate language orally in specific situations.", "B7/JHS1.1.1.1.5 Use techniques (voice modulation and eye contact) for effective oral communication", 'Voice modulation and eye contact in short presentations', resources.oral),
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.2 Read, comprehend and interpret texts.", "B7/JHS1.2.1.2.1 Identify the main text features of a non-literary texts", 'Features of articles, notices and letters', resources.reading),
        entry('Grammar Usage', 'Punctuation and Capitalisation', "B7/JHS1.3.2.1 Demonstrate use and mastery of capitalisation and punctuation in communication.", "B7/JHS1.3.2.1.1 Identify and use punctuation marks (question, exclamation, full-stop, comma) in given texts", 'Punctuation in simple informational texts', resources.grammar),
      ]),
      week(6, 'Listening for key information and factual reading', [
        entry('Oral Language', 'Listening Comprehension', "B7/JHS1.1.2.1 Demonstrate the ability to listen to extended reading and identify key information.", "B7/JHS1.1.2.1.1 Listen to level-appropriate text attentively and identify key information", 'Listening for purpose, main idea and supporting points', resources.oral),
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.2 Read, comprehend and interpret texts.", "B7/JHS1.2.1.2.2 Interpret non-fiction texts pointing out attitudes, opinions, biases and facts", 'Fact, opinion and bias in non-fiction reading', resources.reading),
        entry('Writing', 'Text Types and Purposes', "B7/JHS1.4.2.1 Use process approach to compose descriptive, narrative and informational texts.", "B7/JHS1.4.2.1.3 Create advertisements to persuade a given audience to take decisions on products and services", 'Summarising factual information in sentences', resources.writing),
      ]),
      week(7, 'Sharing opinions and personal responses to texts', [
        entry('Oral Language', 'Listening Comprehension', "B7/JHS1.1.2.1 Demonstrate the ability to listen to extended reading and identify key information.", "B7/JHS1.1.2.1.2 Listen to, discuss ideas and share opinions from a level-appropriate text", 'Discussion skills and sharing opinions', resources.oral),
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.2 Read, comprehend and interpret texts.", "B7/JHS1.2.1.2.3 Interpret a non-literary text showing personal responses and supporting responses with textual evidences", 'Responding to texts with evidence', resources.reading),
        entry('Literature', 'Narrative, Drama and Poetry', "B7/JHS1.5.1.1 Demonstrate understanding of how various elements of literary genres contribute to meaning.", "B7/JHS1.5.1.1.1 Demonstrate understanding of oral literature (narratives, poetry, drama) and how the different genres contribute to meaning", 'Responding to folktales, lullabies and simple oral literature', resources.literature),
      ]),
      week(8, 'English sounds and vocabulary in context', [
        entry('Oral Language', 'English Sounds', "B7/JHS1.1.3.1 Articulate English speech sounds to develop confidence and skills in listening and speaking.", "B7/JHS1.1.3.1.1 Produce pure vowel sounds (short vowels) in context; B7/JHS1.1.3.1.2 Produce pure vowel sounds (long vowels) in context; B7/JHS1.1.3.1.3 Produce diphthongs in context (centring and closing)", 'Pure vowels and diphthongs in connected speech', resources.oral),
        entry('Grammar Usage', 'Vocabulary', "B7/JHS1.3.3.1 Demonstrate appropriate use of vocabulary in communication.", "B7/JHS1.3.3.1.1 Apply vocabulary appropriately in specific contexts", 'Advice, agreement and disagreement vocabulary', resources.grammar),
        entry('Writing', 'Production and Distribution of Writing', "B7/JHS1.4.2.1 Develop, organise and express ideas coherently and cohesively in writing.", "B7/JHS1.4.2.1.2 Use precise (technical) vocabulary, phrases and sensory language to convey a vivid mental picture of people and experiences", 'Writing short dialogues for oral practice', resources.writing),
      ]),
      week(9, 'Word classes in descriptive communication', [
        entry('Grammar Usage', 'Grammar', "B7/JHS1.3.1.1 Apply grammar accurately in communication.", "B7/JHS1.3.1.1.5 Use adverbs to modify verbs accurately at phrase and sentence level", 'Adjectives, adverbs and conjunctions in description', resources.grammar),
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.1 Demonstrate increasing confidence and enjoyment in independent reading.", "B7/JHS1.2.1.1.3 Generate and answer questions to increase understanding and independent reading of fiction texts", 'Identifying grammatical choices in model texts', resources.reading),
        entry('Writing', 'Text Types and Purposes', "B7/JHS1.4.1.2 Use process approach to compose descriptive and narrative texts.", "B7/JHS1.4.1.2.1 Organise information in a logical manner", 'Descriptive paragraph writing', resources.writing),
      ]),
      week(10, 'Prepositions, determiners and written organisation', [
        entry('Grammar Usage', 'Grammar', "B7/JHS1.3.1.1 Apply grammar accurately in communication.", "B7/JHS1.3.1.1.7 Demonstrate command of the use of prepositions in daily discourse (TV, radio, social media, news, home, role play); B7/JHS1.3.1.1.8 Identify and use determiners in speaking and texts", 'Prepositions and determiners in sentences and paragraphs', resources.grammar),
        entry('Writing', 'Text Types and Purposes', "B7/JHS1.4.2.2 Apply writing skills to specific life situations.", "B7/JHS1.4.2.2.2 Compose formal writing such as application, invitation, email and media texts on given topics using appropriate format", 'Notices and short practical writing', resources.writing),
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.2 Read, comprehend and interpret texts.", "B7/JHS1.2.1.2.1 Identify the main text features of a non-literary texts", 'How layout supports meaning in practical texts', resources.reading),
      ]),
      week(11, 'Note-taking and poster writing', [
        entry('Writing', 'Text Types and Purposes', "B7/JHS1.4.2.2 Apply writing skills to specific life situations.", "B7/JHS1.4.2.2.3 Take notes for academic and other purposes; B7/JHS1.4.2.2.4 Design notices and posters for different purposes and audiences", 'Note-taking, notices and posters', resources.writing),
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.1 Read, comprehend and interpret texts.", "B7/JHS1.2.1.1.3 Generate and answer questions to increase understanding and independent reading of fiction texts", 'Reading practical texts for purpose and audience', resources.reading),
        entry('Grammar Usage', 'Vocabulary', "B7/JHS1.3.4.1 Demonstrate understanding of use of aesthetic language to enrich communication.", "B7/JHS1.3.4.1.1 Explore the use of proverbs to enrich communication", 'Proverbs and expressive language in posters and messages', resources.grammar),
      ]),
      week(12, 'Articles, oral literature and term presentation', [
        entry('Writing', 'Text Types and Purposes', "B7/JHS1.4.2.2 Apply writing skills to specific life situations.", "B7/JHS1.4.2.2.5 Write articles on given issues for publication in class and club magazines", 'Writing simple articles on familiar issues', resources.writing),
        entry('Literature', 'Narrative, Drama and Poetry', "B7/JHS1.5.1.1 Demonstrate understanding of how various elements of literary genres contribute to meaning.", "B7/JHS1.5.1.1.2 Analyse the elements of written literature (narrative, drama, or poetry); B7/JHS1.5.1.1.3 Use basic literary devices in texts (e.g. metaphor, simile, personification, alliteration, assonance, consonance, etc.)", 'Story elements and basic literary devices', resources.literature),
        entry('Oral Language', 'Conversation/Listening', "B7/JHS1.1.1.1 Integrate oral presentation skills across term work.", "B7/JHS1.1.1.1.5 Use techniques (voice modulation and eye contact) for effective oral communication", 'Integrated oral presentation and reflection', resources.oral),
      ]),
    ],
  },
  {
    subject: 'English Language',
    classLevel: 'B7',
    term: 'Term 2',
    title: 'B7 English Language Scheme of Work - Term 2',
    weeks: [
      week(1, 'Listening and reading around natural resources', [
        entry('Oral Language', 'Listening Comprehension', "B7/JHS1.1.2.1 Demonstrate the ability to listen to extended reading and identify key information.", "B7/JHS1.1.2.1.1 Listen to level-appropriate text attentively and identify key information", 'Listening to short talks on Ghana’s natural resources', resources.oral),
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.1 Read, comprehend and interpret texts.", "B7/JHS1.2.1.1.3 Generate and answer questions to increase understanding and independent reading of fiction texts", 'Reading informational texts on mining and natural resources', resources.reading),
        entry('Writing', 'Building and Presenting Knowledge', "B7/JHS1.4.3.1 Research to build and present knowledge.", "B7/JHS1.4.3.1.1 Identify and record information from non-text sources (figures and tables), organise and present it in writing", 'Taking notes from charts and reading passages', resources.writing),
      ]),
      week(2, 'Discussion and paragraphing on environmental issues', [
        entry('Oral Language', 'Conversation/Everyday Discourse', "B7/JHS1.1.1.1 Use appropriate language orally in specific situations.", "B7/JHS1.1.1.1.1 Use appropriate register in everyday communication (informal and formal) with diverse partners on grade-level topics/texts/issues", 'Structured discussion on environmental degradation and preservation', resources.oral),
        entry('Writing', 'Production and Distribution of Writing', "B7/JHS1.4.2.1 Develop, organise and express ideas coherently and cohesively in writing.", "B7/JHS1.4.2.1.4 Compose a paragraph to explain a process, social and natural phenomena (how to do or use something, how something works)", 'Paragraph writing on preservation and pollution', resources.writing),
        entry('Grammar Usage', 'Grammar', "B7/JHS1.3.1.1 Apply grammar accurately in communication.", "B7/JHS1.3.1.1.6 Use conjunctions accurately to link ideas in everyday discourse", 'Joining environmental ideas in coherent sentences', resources.grammar),
      ]),
      week(3, 'Reading themes, facts and opinions', [
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.2 Read, comprehend and interpret texts.", "B7/JHS1.2.1.2.2 Interpret non-fiction texts pointing out attitudes, opinions, biases and facts", 'Distinguishing fact and opinion in health and social issue texts', resources.reading),
        entry('Grammar Usage', 'Vocabulary', "B7/JHS1.3.3.1 Demonstrate appropriate use of vocabulary in communication.", "B7/JHS1.3.3.1.1 Apply vocabulary appropriately in specific contexts", 'Thematic vocabulary building', resources.grammar),
        entry('Oral Language', 'Listening Comprehension', "B7/JHS1.1.2.1 Demonstrate the ability to listen to extended reading and identify key information.", "B7/JHS1.1.2.1.2 Listen to, discuss ideas and share opinions from a level-appropriate text", 'Oral response to informational passages', resources.oral),
      ]),
      week(4, 'Sounds, fluency and reading aloud', [
        entry('Oral Language', 'English Sounds', "B7/JHS1.1.3.1 Articulate English speech sounds to develop confidence and skills in listening and speaking.", "B7/JHS1.1.3.1.1 Produce pure vowel sounds (short vowels) in context", 'Reading aloud with accurate pronunciation', resources.oral),
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.1 Demonstrate increasing confidence and enjoyment in independent reading.", "B7/JHS1.2.1.1.1 Read and understand a range of texts using monitoring and mental visualisation strategies to interpret texts", 'Guided fluency and comprehension practice', resources.reading),
        entry('Literature', 'Narrative, Drama and Poetry', "B7/JHS1.5.1.1 Demonstrate understanding of how various elements of literary genres contribute to meaning.", "B7/JHS1.5.1.1.1 Demonstrate understanding of oral literature (narratives, poetry, drama) and how the different genres contribute to meaning", 'Poetry reading for fluency and sound awareness', resources.literature),
      ]),
      week(5, 'Functional writing: notices, posters and short speeches', [
        entry('Writing', 'Text Types and Purposes', "B7/JHS1.4.2.2 Apply writing skills to specific life situations.", "B7/JHS1.4.2.2.4 Design notices and posters for different purposes and audiences", 'Functional writing for school communication', resources.writing),
        entry('Oral Language', 'Conversation/Everyday Discourse', "B7/JHS1.1.1.1 Use voice modulation and eye contact for effective oral communication.", "B7/JHS1.1.1.1.5 Use techniques (voice modulation and eye contact) for effective oral communication", 'Reading and presenting notices aloud', resources.oral),
        entry('Grammar Usage', 'Punctuation and Capitalisation', "B7/JHS1.3.2.1 Demonstrate mastery of punctuation and capitalisation.", "B7/JHS1.3.2.1.1 Identify and use punctuation marks (question, exclamation, full-stop, comma) in given texts", 'Editing practical writing', resources.grammar),
      ]),
      week(6, 'Narrative and dramatic elements', [
        entry('Literature', 'Narrative, Drama and Poetry', "B7/JHS1.5.1.1 Demonstrate understanding of how various elements of literary genres contribute to meaning.", "B7/JHS1.5.1.1.1 Demonstrate understanding of oral literature (narratives, poetry, drama) and how the different genres contribute to meaning", 'Narrative and drama elements', resources.literature),
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.1 Read, comprehend and interpret texts.", "B7/JHS1.2.1.1.3 Generate and answer questions to increase understanding and independent reading of fiction texts", 'Reading stories and short dramatic excerpts', resources.reading),
        entry('Writing', 'Text Types and Purposes', "B7/JHS1.4.2.1 Use process approach to compose narrative texts.", "B7/JHS1.4.2.1.1 Write personal narratives using effective techniques incorporating descriptive details and logical event sequences", 'Short narrative composition', resources.writing),
      ]),
      week(7, 'Poetry, values and figurative language', [
        entry('Literature', 'Narrative, Drama and Poetry', "B7/JHS1.5.1.1 Demonstrate understanding of how various elements of literary genres contribute to meaning.", "B7/JHS1.5.1.1.1 Demonstrate understanding of oral literature (narratives, poetry, drama) and how the different genres contribute to meaning", 'Poetry, values and performance', resources.literature),
        entry('Grammar Usage', 'Vocabulary/Aesthetic language', "B7/JHS1.3.3.1 Demonstrate understanding of aesthetic language to enrich communication.", "B7/JHS1.3.3.1.1 Apply vocabulary appropriately in specific contexts", 'Simple figurative language in poetry and speech', resources.grammar),
        entry('Oral Language', 'Conversation/Presentation', "B7/JHS1.1.1.1 Use appropriate oral language and performance techniques.", "B7/JHS1.1.1.1.5 Use techniques (voice modulation and eye contact) for effective oral communication", 'Poetry recitation and oral performance', resources.oral),
      ]),
      week(8, 'Articles and school magazine writing', [
        entry('Writing', 'Text Types and Purposes', "B7/JHS1.4.2.2 Apply writing skills to specific life situations.", "B7/JHS1.4.2.2.5 Write articles on given issues for publication in class and club magazines", 'Writing for class and club magazines', resources.writing),
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.2 Read, comprehend and interpret texts.", "B7/JHS1.2.1.2.1 Identify the main text features of a non-literary texts", 'Article reading and feature spotting', resources.reading),
        entry('Grammar Usage', 'Grammar', "B7/JHS1.3.1.1 Apply grammar accurately in communication.", "B7/JHS1.3.1.1.8 Identify and use determiners in speaking and texts", 'Editing articles for accuracy', resources.grammar),
      ]),
      week(9, 'Research and graphic information', [
        entry('Writing', 'Building and Presenting Knowledge', "B7/JHS1.4.3.1 Research to build and present knowledge.", "B7/JHS1.4.3.1.1 Identify and record information from non-text sources (figures and tables), organise and present it in writing", 'Using tables and figures to support writing', resources.writing),
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.1 Read, comprehend and interpret texts.", "B7/JHS1.2.1.1.3 Generate and answer questions to increase understanding and independent reading of fiction texts", 'Reading graphical information', resources.reading),
        entry('Oral Language', 'Listening/Discussion', "B7/JHS1.1.1.1 Discuss and share ideas from texts and related sources.", "B7/JHS1.1.1.1.5 Use techniques (voice modulation and eye contact) for effective oral communication", 'Oral sharing of findings', resources.oral),
      ]),
      week(10, 'Health and social issues integrated week', [
        entry('Oral Language', 'Conversation/Everyday Discourse', "B7/JHS1.1.1.1 Use appropriate register in conversations on varied themes.", "B7/JHS1.1.1.1.1 Use appropriate register in everyday communication (informal and formal) with diverse partners on grade-level topics/texts/issues", 'Discussion on adolescent health and social inclusion', resources.oral),
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.1 Read, comprehend and interpret texts.", "B7/JHS1.2.1.1.3 Generate and answer questions to increase understanding and independent reading of fiction texts", 'Reading health and social issue passages', resources.reading),
        entry('Writing', 'Text Types and Purposes', "B7/JHS1.4.2.2 Compose informational texts for specific audiences.", "B7/JHS1.4.2.2.2 Compose formal writing such as application, invitation, email and media texts on given topics using appropriate format", 'Advice and awareness writing', resources.writing),
      ]),
      week(11, 'Independent reading and response portfolio', [
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.1 Demonstrate increasing confidence and enjoyment in independent reading.", "B7/JHS1.2.1.1.3 Generate and answer questions to increase understanding and independent reading of fiction texts", 'Independent reading and response journal', resources.reading),
        entry('Writing', 'Building and Presenting Knowledge', "B7/JHS1.4.3.1 Research to build and present knowledge.", "B7/JHS1.4.3.1.1 Identify and record information from non-text sources (figures and tables), organise and present it in writing", 'Portfolio note-making and reflection', resources.writing),
        entry('Literature', 'Narrative, Drama and Poetry', "B7/JHS1.5.1.1 Demonstrate understanding of how literary genres contribute to meaning.", "B7/JHS1.5.1.1.1 Demonstrate understanding of oral literature (narratives, poetry, drama) and how the different genres contribute to meaning", 'Personal response to literary reading', resources.literature),
      ]),
      week(12, 'Integrated term project and presentation', [
        entry('Writing', 'Text Types and Purposes', "B7/JHS1.4.2.2 Apply writing skills to specific life situations.", "B7/JHS1.4.2.2.4 Design notices and posters for different purposes and audiences", 'Integrated publishing task', resources.writing),
        entry('Oral Language', 'Conversation/Presentation', "B7/JHS1.1.1.1 Use appropriate voice and register in oral presentation.", "B7/JHS1.1.1.1.5 Use techniques (voice modulation and eye contact) for effective oral communication", 'Project presentation and peer feedback', resources.oral),
        entry('Reading/Literature', 'Response and Reflection', "B7/JHS1.2.1.1 Integrate reading and literary response across the term.", "B7/JHS1.2.1.1.3 Generate and answer questions to increase understanding and independent reading of fiction texts", 'Presentation supported by reading and literature', [...resources.reading, ...resources.literature]),
      ]),
    ],
  },
  {
    subject: 'English Language',
    classLevel: 'B7',
    term: 'Term 3',
    title: 'B7 English Language Scheme of Work - Term 3',
    weeks: [
      week(1, 'Tourism and place description', [
        entry('Oral Language', 'Conversation/Everyday Discourse', "B7/JHS1.1.1.1 Use appropriate language orally in specific situations.", "B7/JHS1.1.1.1.4 Listen to and give accurate directions to familiar places", 'Oral descriptions of tourist sites and local places', resources.oral),
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.1 Demonstrate increasing confidence and enjoyment in independent reading.", "B7/JHS1.2.1.1.3 Generate and answer questions to increase understanding and independent reading of fiction texts", 'Reading descriptive texts on tourism and places', resources.reading),
        entry('Writing', 'Text Types and Purposes', "B7/JHS1.4.2.1 Use process approach to compose descriptive texts.", "B7/JHS1.4.2.1.1 Write personal narratives using effective techniques incorporating descriptive details and logical event sequences", 'Descriptive writing on tourism', resources.writing),
      ]),
      week(2, 'Festivals, performance and oral literature', [
        entry('Literature', 'Narrative, Drama and Poetry', "B7/JHS1.5.1.1 Demonstrate understanding of oral literature and literary elements.", "B7/JHS1.5.1.1.1 Demonstrate understanding of oral literature (narratives, poetry, drama) and how the different genres contribute to meaning", 'Festival literature and performance', resources.literature),
        entry('Oral Language', 'Conversation/Presentation', "B7/JHS1.1.1.1 Use voice modulation and eye contact for effective oral communication.", "B7/JHS1.1.1.1.5 Use techniques (voice modulation and eye contact) for effective oral communication", 'Cultural oral performance', resources.oral),
        entry('Writing', 'Text Types and Purposes', "B7/JHS1.4.2.2 Compose texts for audience and purpose.", "B7/JHS1.4.2.2.2 Compose formal writing such as application, invitation, email and media texts on given topics using appropriate format", 'Cultural narrative and script writing', resources.writing),
      ]),
      week(3, 'Technology and media awareness', [
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.1 Read, comprehend and interpret texts.", "B7/JHS1.2.1.1.3 Generate and answer questions to increase understanding and independent reading of fiction texts", 'Reading on technology and media', resources.reading),
        entry('Grammar Usage', 'Vocabulary', "B7/JHS1.3.3.1 Demonstrate appropriate use of vocabulary in communication.", "B7/JHS1.3.3.1.1 Apply vocabulary appropriately in specific contexts", 'Technology vocabulary in context', resources.grammar),
        entry('Writing', 'Building and Presenting Knowledge', "B7/JHS1.4.3.1 Research to build and present knowledge.", "B7/JHS1.4.3.1.1 Identify and record information from non-text sources (figures and tables), organise and present it in writing", 'Simple research note-taking on technology', [...resources.writing, ...resources.media]),
      ]),
      week(4, 'Environment and persuasive messaging', [
        entry('Oral Language', 'Conversation/Everyday Discourse', "B7/JHS1.1.1.1 Discuss ideas and issues using appropriate register.", "B7/JHS1.1.1.1.1 Use appropriate register in everyday communication (informal and formal) with diverse partners on grade-level topics/texts/issues", 'Environmental discussion and persuasion', resources.oral),
        entry('Writing', 'Text Types and Purposes', "B7/JHS1.4.2.1 Apply writing skills to specific life situations.", "B7/JHS1.4.2.1.3 Create advertisements to persuade a given audience to take decisions on products and services", 'Persuasive poster and awareness writing', resources.writing),
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.1 Interpret non-fiction texts using evidence.", "B7/JHS1.2.1.1.3 Generate and answer questions to increase understanding and independent reading of fiction texts", 'Persuasive features in environmental texts', resources.reading),
      ]),
      week(5, 'Entrepreneurship and informational texts', [
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.1 Read, comprehend and interpret texts.", "B7/JHS1.2.1.1.3 Generate and answer questions to increase understanding and independent reading of fiction texts", 'Reading entrepreneurship and small business texts', resources.reading),
        entry('Writing', 'Building and Presenting Knowledge', "B7/JHS1.4.3.1 Research to build and present knowledge.", "B7/JHS1.4.3.1.1 Identify and record information from non-text sources (figures and tables), organise and present it in writing", 'Organising information about simple business ideas', resources.writing),
        entry('Oral Language', 'Listening/Discussion', "B7/JHS1.1.2.1 Listen to and discuss ideas from level-appropriate texts.", "B7/JHS1.1.2.1.2 Listen to, discuss ideas and share opinions from a level-appropriate text", 'Discussion on enterprise ideas', resources.oral),
      ]),
      week(6, 'Health awareness article writing', [
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.1 Read, comprehend and interpret texts.", "B7/JHS1.2.1.1.3 Generate and answer questions to increase understanding and independent reading of fiction texts", 'Reading health information critically', resources.reading),
        entry('Writing', 'Text Types and Purposes', "B7/JHS1.4.2.2 Write articles on given issues for publication.", "B7/JHS1.4.2.2.5 Write articles on given issues for publication in class and club magazines", 'Health awareness article', resources.writing),
        entry('Grammar Usage', 'Punctuation and Vocabulary', "B7/JHS1.3.3.1 Use punctuation and vocabulary appropriately in communication.", "B7/JHS1.3.3.1.1 Apply vocabulary appropriately in specific contexts", 'Editing and refining health writing', resources.grammar),
      ]),
      week(7, 'Drama, dialogue and role play', [
        entry('Literature', 'Narrative, Drama and Poetry', "B7/JHS1.5.1.1 Demonstrate understanding of literary genres and their elements.", "B7/JHS1.5.1.1.2 Analyse the elements of written literature (narrative, drama, or poetry)", 'Drama reading and role play', resources.literature),
        entry('Writing', 'Text Types and Purposes', "B7/JHS1.4.2.2 Compose dialogues for publication and performance.", "B7/JHS1.4.2.2.2 Compose formal writing such as application, invitation, email and media texts on given topics using appropriate format", 'Dialogue writing', resources.writing),
        entry('Oral Language', 'Conversation/Presentation', "B7/JHS1.1.1.1 Use oral techniques in communication.", "B7/JHS1.1.1.1.5 Use techniques (voice modulation and eye contact) for effective oral communication", 'Role play and performance', resources.oral),
      ]),
      week(8, 'Poetry, proverb and figurative language workshop', [
        entry('Literature', 'Narrative, Drama and Poetry', "B7/JHS1.5.1.1 Demonstrate understanding of poetry and literary devices.", "B7/JHS1.5.1.1.1 Demonstrate understanding of oral literature (narratives, poetry, drama) and how the different genres contribute to meaning", 'Poetry writing and recitation', resources.literature),
        entry('Grammar Usage', 'Aesthetic language/Vocabulary', "B7/JHS1.3.4.1 Demonstrate understanding of use of aesthetic language to enrich communication.", "B7/JHS1.3.4.1.1 Explore the use of proverbs to enrich communication", 'Proverbs and poetic language', resources.grammar),
        entry('Oral Language', 'English Sounds/Presentation', "B7/JHS1.1.3.1 Articulate English speech sounds in connected speech.", "B7/JHS1.1.3.1.1 Produce pure vowel sounds (short vowels) in context", 'Sound, rhythm and recital practice', resources.oral),
      ]),
      week(9, 'Research and presentation from charts and figures', [
        entry('Writing', 'Building and Presenting Knowledge', "B7/JHS1.4.3.1 Research to build and present knowledge.", "B7/JHS1.4.3.1.1 Identify and record information from non-text sources (figures and tables), organise and present it in writing", 'Writing from graphs, tables and figures', resources.writing),
        entry('Reading', 'Comprehension', "B7/JHS1.2.1.1 Read, comprehend and interpret texts.", "B7/JHS1.2.1.1.3 Generate and answer questions to increase understanding and independent reading of fiction texts", 'Reading tables and simple data displays', resources.reading),
        entry('Oral Language', 'Listening/Presentation', "B7/JHS1.1.2.1 Share opinions and findings from texts and related materials.", "B7/JHS1.1.2.1.2 Listen to, discuss ideas and share opinions from a level-appropriate text", 'Oral presentation of simple data', resources.oral),
      ]),
      week(10, 'Independent reading and summary practice', [
        entry('Reading', 'Comprehension/Summarising', "B7/JHS1.2.1.1 Develop comprehension and summarising skills through independent reading.", "B7/JHS1.2.1.1.3 Generate and answer questions to increase understanding and independent reading of fiction texts", 'Independent reading and guided summary', resources.reading),
        entry('Writing', 'Production and Distribution of Writing', "B7/JHS1.4.3.1 Develop, organise and express ideas coherently and cohesively in writing.", "B7/JHS1.4.3.1.1 Identify and record information from non-text sources (figures and tables), organise and present it in writing", 'Summary writing practice', resources.writing),
        entry('Grammar Usage', 'Grammar', "B7/JHS1.3.1.1 Use sentence structures accurately in communication.", "B7/JHS1.3.1.1.3 Explore accurate use of adjectives in texts", 'Sentence control in summaries', resources.grammar),
      ]),
      week(11, 'Integrated reading portfolio and reflection', [
        entry('Reading', 'Independent Reading', "B7/JHS1.2.1.1 Build reading confidence and enjoyment across varied texts.", "B7/JHS1.2.1.1.3 Generate and answer questions to increase understanding and independent reading of fiction texts", 'Reading portfolio entries', resources.reading),
        entry('Writing', 'Building and Presenting Knowledge', "B7/JHS1.4.3.1 Research to build and present knowledge.", "B7/JHS1.4.3.1.1 Identify and record information from non-text sources (figures and tables), organise and present it in writing", 'Reading log and reflection writing', resources.writing),
        entry('Oral Language', 'Discussion', "B7/JHS1.1.1.1 Share and defend personal responses to texts.", "B7/JHS1.1.1.1.5 Use techniques (voice modulation and eye contact) for effective oral communication", 'Book talk and peer discussion', resources.oral),
      ]),
      week(12, 'Term showcase: article, performance and presentation', [
        entry('Writing', 'Integrated Writing Task', "B7/JHS1.4.2.1 Apply writing skills to a final term task.", "B7/JHS1.4.2.1.2 Use precise (technical) vocabulary, phrases and sensory language to convey a vivid mental picture of people and experiences", 'Final integrated English writing task', resources.writing),
        entry('Oral Language', 'Presentation', "B7/JHS1.1.1.1 Use appropriate register, eye contact and voice modulation.", "B7/JHS1.1.1.1.5 Use techniques (voice modulation and eye contact) for effective oral communication", 'Final oral presentation', resources.oral),
        entry('Literature/Reading', 'Response and Appreciation', "B7/JHS1.2.1.1 Use literary and reading understanding to enrich final output.", "B7/JHS1.2.1.1.3 Generate and answer questions to increase understanding and independent reading of fiction texts", 'Reading-supported showcase', [...resources.reading, ...resources.literature]),
      ]),
    ],
  },
];

export const englishB8Terms: ExplicitCurriculumTerm[] = [
  {
    subject: 'English Language',
    classLevel: 'B8',
    term: 'Term 1',
    title: 'B8 English Language Scheme of Work - Term 1',
    weeks: [
      week(1, 'Describing places and events with precise language', [
        entry('Oral Language', 'Conversation/Everyday Discourse', "B8/JHS2.1.1.1 Demonstrate use of appropriate language orally in specific situations.", "B8/JHS2.1.1.1.3 Use appropriate language orally to describe familiar places and events", 'Oral description using sensory and figurative language', resources.oral),
        entry('Reading', 'Comprehension', "B8/JHS2.2.1.1 Demonstrate confidence and enjoyment in reading varied texts.", "B8/JHS2.2.1.1.3 Generate and answer questions to increase confidence and independent reading through a variety of non- fiction texts", 'Reading descriptive texts for imagery and detail', resources.reading),
        entry('Writing', 'Production and Distribution of Writing', "B8/JHS2.4.2.1 Develop, organise and express ideas coherently and cohesively in writing.", "B8/JHS2.4.2.1.1 Write personal narratives using effective techniques incorporating descriptive details and logical event sequences", 'Descriptive paragraph writing', resources.writing),
      ]),
      week(2, 'Directions, travel and tourism texts', [
        entry('Oral Language', 'Conversation/Everyday Discourse', "B8/JHS2.1.1.1 Demonstrate use of appropriate language orally in specific situations.", "B8/JHS2.1.1.1.4 Listen to and give accurate directions of complex routes to different locations", 'Giving complex directions and travel guidance', resources.oral),
        entry('Reading', 'Comprehension', "B8/JHS2.2.1.1 Demonstrate confidence and enjoyment in reading varied texts.", "B8/JHS2.2.1.1.3 Generate and answer questions to increase confidence and independent reading through a variety of non- fiction texts", 'Reading tourism brochures and travel information', resources.reading),
        entry('Grammar Usage', 'Vocabulary', "B8/JHS2.3.3.1 Build and apply domain-specific vocabulary in communication.", "B8/JHS2.3.3.1.1 Use vocabulary appropriately in speaking and writing", 'Travel and location vocabulary', resources.grammar),
      ]),
      week(3, 'Turn-taking and discussion strategies', [
        entry('Oral Language', 'Conversation/Everyday Discourse', "B8/JHS2.1.1.1 Demonstrate use of appropriate language orally in specific situations.", "B8/JHS2.1.1.1.5 Demonstrate appropriate turn taking for effective oral communication", 'Turn-taking in meetings and discussions', resources.oral),
        entry('Reading', 'Comprehension', "B8/JHS2.2.1.2 Read, comprehend and analyse varied texts.", "B8/JHS2.2.1.2.2 Use contextual clues (topic sentence, vocabulary knowledge, cohesive devices, text features) to analyse text", 'Finding cues for meaning in discussion texts', resources.reading),
        entry('Writing', 'Production and Distribution of Writing', "B8/JHS2.4.2.2 Develop, organise and express ideas coherently and cohesively in writing.", "B8/JHS2.4.2.2.3 Write articles on given issues for publication in school magazines", 'Preparing notes for group discussion', resources.writing),
      ]),
      week(4, 'Inference and evidence in reading', [
        entry('Reading', 'Comprehension', "B8/JHS2.2.1.2 Read, comprehend and analyse varied texts.", "B8/JHS2.2.1.2.2 Use contextual clues (topic sentence, vocabulary knowledge, cohesive devices, text features) to analyse text; B8/JHS2.2.1.2.3 Read silently and answer more complex comprehension questions on texts /passages; B8/JHS2.2.1.2.4 Provide evidence and show mastery to support understanding of texts", 'Inference and evidence in reading', resources.reading),
        entry('Writing', 'Building and Presenting Knowledge', "B8/JHS2.4.2.2 Research to build and present knowledge.", "B8/JHS2.4.2.2.1 Compose formal writing using the appropriate format", 'Evidence-based response writing', resources.writing),
        entry('Oral Language', 'Listening Comprehension', "B8/JHS2.1.1.1 Demonstrate the ability to listen and respond to extended texts.", "B8/JHS2.1.1.1.5 Demonstrate appropriate turn taking for effective oral communication", 'Justifying responses in discussion', resources.oral),
      ]),
      week(5, 'Themes and viewpoints across texts', [
        entry('Reading', 'Comprehension', "B8/JHS2.2.1.2 Read, comprehend and analyse varied texts.", "B8/JHS2.2.1.2.5 Generate simple themes from a text and apply to different situations; B8/JHS2.2.1.2.6 Examine the connections between a text and other points of view", 'Themes and viewpoints in reading', resources.reading),
        entry('Literature', 'Narrative, Drama and Poetry', "B8/JHS2.5.1.1 Demonstrate understanding of literary elements.", "B8/JHS2.5.1.1.4 Use literary devices (euphemism, hyperbole, onomatopoeia, etc.) in texts", 'Comparing viewpoints in literary and informational texts', resources.literature),
        entry('Oral Language', 'Conversation/Discussion', "B8/JHS2.1.1.1 Use oral language for reasoned discussion.", "B8/JHS2.1.1.1.5 Demonstrate appropriate turn taking for effective oral communication", 'Oral interpretation and defence', resources.oral),
      ]),
      week(6, 'Sentence control and reported speech', [
        entry('Grammar Usage', 'Grammar', "B8/JHS2.3.1.5 Apply grammar accurately in speech and writing.", "B8/JHS2.3.1.5.2 Demonstrate command of the use of reported speech", 'Reported speech and sentence transformation', resources.grammar),
        entry('Writing', 'Production and Distribution of Writing', "B8/JHS2.4.2.2 Develop, organise and express ideas coherently and cohesively in writing.", "B8/JHS2.4.2.2.5 Compose speeches for different purposes and occasions", 'Using reported speech in writing', resources.writing),
        entry('Reading', 'Comprehension', "B8/JHS2.2.1.1 Read model texts to identify language patterns.", "B8/JHS2.2.1.1.3 Generate and answer questions to increase confidence and independent reading through a variety of non- fiction texts", 'Reported speech in reading passages', resources.reading),
      ]),
      week(7, 'Question tags, punctuation and editing', [
        entry('Grammar Usage', 'Grammar/Punctuation', "B8/JHS2.3.2.1 and Apply question tags and punctuation accurately.", "B8/JHS2.3.2.1.1 Use punctuation marks (colon, semi-colon, apostrophe) in context", 'Question tags and advanced punctuation', resources.grammar),
        entry('Writing', 'Text Types and Purposes', "B8/JHS2.4.2.2 Apply writing skills to practical texts.", "B8/JHS2.4.2.2.1 Compose formal writing using the appropriate format", 'Editing letters and announcements', resources.writing),
        entry('Oral Language', 'Conversation', "B8/JHS2.1.1.1 Use question tags in communication.", "B8/JHS2.1.1.1.5 Demonstrate appropriate turn taking for effective oral communication", 'Interactive question-tag conversations', resources.oral),
      ]),
      week(8, 'Formal letters and emails', [
        entry('Writing', 'Text Types and Purposes', "B8/JHS2.4.2.2 Apply writing skills to specific life situations.", "B8/JHS2.4.2.2.1 Compose formal writing using the appropriate format", 'Formal letters and emails', resources.writing),
        entry('Reading', 'Comprehension', "B8/JHS2.2.1.1 Read model practical texts critically.", "B8/JHS2.2.1.1.3 Generate and answer questions to increase confidence and independent reading through a variety of non- fiction texts", 'Reading model formal letters and emails', resources.reading),
        entry('Grammar Usage', 'Vocabulary/Grammar', "B8/JHS2.3.3.1 Apply formal register appropriately.", "B8/JHS2.3.3.1.1 Use vocabulary appropriately in speaking and writing", 'Formal register and language choices', resources.grammar),
      ]),
      week(9, 'Flyers, brochures and notices', [
        entry('Writing', 'Text Types and Purposes', "B8/JHS2.4.2.2 Apply writing skills to specific life situations.", "B8/JHS2.4.2.2.2 Compose notes, brochures and flyers for different purposes and audiences", 'Flyers, brochures and notices', resources.writing),
        entry('Reading', 'Comprehension', "B8/JHS2.2.1.1 Analyse media and practical texts.", "B8/JHS2.2.1.1.3 Generate and answer questions to increase confidence and independent reading through a variety of non- fiction texts", 'Reading brochures and publicity materials', [...resources.reading, ...resources.media]),
        entry('Oral Language', 'Presentation', "B8/JHS2.1.1.1 Present information clearly to audience.", "B8/JHS2.1.1.1.5 Demonstrate appropriate turn taking for effective oral communication", 'Short promotional presentation', resources.oral),
      ]),
      week(10, 'Article writing and school publication', [
        entry('Writing', 'Text Types and Purposes', "B8/JHS2.4.2.2 Apply writing skills to specific life situations.", "B8/JHS2.4.2.2.3 Write articles on given issues for publication in school magazines", 'Article writing for school publication', resources.writing),
        entry('Reading', 'Comprehension', "B8/JHS2.2.1.1 Read and compare article models.", "B8/JHS2.2.1.1.3 Generate and answer questions to increase confidence and independent reading through a variety of non- fiction texts", 'Analysing school magazine articles', resources.reading),
        entry('Grammar Usage', 'Vocabulary/Grammar', "B8/JHS2.3.3.1 Use sentence variety and topical vocabulary in writing.", "B8/JHS2.3.3.1.1 Use vocabulary appropriately in speaking and writing", 'Revising articles for publication', resources.grammar),
      ]),
      week(11, 'Dialogues and speeches', [
        entry('Writing', 'Text Types and Purposes', "B8/JHS2.4.2.2 Apply writing skills to specific life situations.", "B8/JHS2.4.2.2.4 Create dialogues among multiple interlocutors on different themes; B8/JHS2.4.2.2.5 Compose speeches for different purposes and occasions", 'Dialogues and speeches', resources.writing),
        entry('Oral Language', 'Conversation/Presentation', "B8/JHS2.1.1.1 Use appropriate spoken language, turn-taking and presentation skills.", "B8/JHS2.1.1.1.5 Demonstrate appropriate turn taking for effective oral communication", 'Speech rehearsal and dialogue performance', resources.oral),
        entry('Literature', 'Drama and Poetry', "B8/JHS2.5.1.1 Use dramatic and rhetorical effects in communication.", "B8/JHS2.5.1.1.4 Use literary devices (euphemism, hyperbole, onomatopoeia, etc.) in texts", 'Linking dialogue writing to performance', resources.literature),
      ]),
      week(12, 'Research, poetry and integrated term task', [
        entry('Writing', 'Building and Presenting Knowledge', "B8/JHS2.4.3.1 Research to build and present knowledge.", "B8/JHS2.4.3.1.1 Use information from non-text sources (figures, tables graphs, and maps) to support ideas in writing", 'Research-supported writing and presentation', resources.writing),
        entry('Literature', 'Narrative, Drama and Poetry', "B8/JHS2.5.1.1 Demonstrate understanding of literary genres.", "B8/JHS2.5.1.1.4 Use literary devices (euphemism, hyperbole, onomatopoeia, etc.) in texts", 'Poetry and performance appreciation', resources.literature),
        entry('Oral Language', 'Presentation', "B8/JHS2.1.1.1 Use clear spoken language in final integrated presentations.", "B8/JHS2.1.1.1.5 Demonstrate appropriate turn taking for effective oral communication", 'Integrated term presentation', resources.oral),
      ]),
    ],
  },
  {
    subject: 'English Language',
    classLevel: 'B8',
    term: 'Term 2',
    title: 'B8 English Language Scheme of Work - Term 2',
    weeks: [
      week(1, 'Values and discussion texts', [
        entry('Reading', 'Comprehension', "B8/JHS2.2.1.1 Read, comprehend and analyse varied texts.", "B8/JHS2.2.1.1.3 Generate and answer questions to increase confidence and independent reading through a variety of non- fiction texts", 'Reading on honesty, loyalty and hard work', resources.reading),
        entry('Oral Language', 'Conversation/Discussion', "B8/JHS2.1.1.1 Use oral language appropriately in discussion.", "B8/JHS2.1.1.1.5 Demonstrate appropriate turn taking for effective oral communication", 'Discussion on values and attitude to work', resources.oral),
        entry('Writing', 'Production and Distribution of Writing', "B8/JHS2.4.2.1 Develop coherent paragraphs in response to texts.", "B8/JHS2.4.2.1.1 Write personal narratives using effective techniques incorporating descriptive details and logical event sequences", 'Reflective writing on values', resources.writing),
      ]),
      week(2, 'Engineering and invention vocabulary', [
        entry('Reading', 'Comprehension', "B8/JHS2.2.1.2 Read, comprehend and analyse varied texts.", "B8/JHS2.2.1.2.2 Use contextual clues (topic sentence, vocabulary knowledge, cohesive devices, text features) to analyse text", 'Reading engineering and invention texts', resources.reading),
        entry('Grammar Usage', 'Vocabulary', "B8/JHS2.3.3.1 Apply vocabulary appropriately in specific contexts.", "B8/JHS2.3.3.1.1 Use vocabulary appropriately in speaking and writing", 'Technical vocabulary in context', resources.grammar),
        entry('Writing', 'Building and Presenting Knowledge', "B8/JHS2.4.2.2 Research to build and present knowledge.", "B8/JHS2.4.2.2.3 Write articles on given issues for publication in school magazines", 'Structured note-taking from informational texts', resources.writing),
      ]),
      week(3, 'Banking, finance and formal communication', [
        entry('Reading', 'Comprehension', "B8/JHS2.2.1.1 Read, comprehend and analyse varied texts.", "B8/JHS2.2.1.1.3 Generate and answer questions to increase confidence and independent reading through a variety of non- fiction texts", 'Reading banking and finance texts', resources.reading),
        entry('Writing', 'Text Types and Purposes', "B8/JHS2.4.2.2 Compose formal writing for specific life situations.", "B8/JHS2.4.2.2.1 Compose formal writing using the appropriate format", 'Formal communication in finance-related contexts', resources.writing),
        entry('Grammar Usage', 'Grammar/Punctuation', "B8/JHS2.3.2.1 Use punctuation and formal structures accurately.", "B8/JHS2.3.2.1.1 Use punctuation marks (colon, semi-colon, apostrophe) in context", 'Editing formal communication', resources.grammar),
      ]),
      week(4, 'Media, communication and audience awareness', [
        entry('Reading', 'Comprehension', "B8/JHS2.2.1.1 Read, comprehend and analyse varied texts.", "B8/JHS2.2.1.1.3 Generate and answer questions to increase confidence and independent reading through a variety of non- fiction texts", 'Reading print and electronic media texts', [...resources.reading, ...resources.media]),
        entry('Writing', 'Text Types and Purposes', "B8/JHS2.4.2.2 Apply writing skills to practical and media texts.", "B8/JHS2.4.2.2.1 Compose formal writing using the appropriate format", 'Media writing and audience targeting', resources.writing),
        entry('Oral Language', 'Conversation/Presentation', "B8/JHS2.1.1.1 Use appropriate language in discussion and presentation.", "B8/JHS2.1.1.1.5 Demonstrate appropriate turn taking for effective oral communication", 'Media presentation and peer critique', [...resources.oral, ...resources.media]),
      ]),
      week(5, 'Poetry forms and creative expression', [
        entry('Literature', 'Narrative, Drama and Poetry', "B8/JHS2.5.1.1 Demonstrate understanding of literary elements.", "B8/JHS2.5.1.1.2 Examine the features of different types of poems", 'Sonnet, acrostic and haiku', resources.literature),
        entry('Writing', 'Creative Writing', "B8/JHS2.4.2.2 Compose varied poetic forms for audience and purpose.", "B8/JHS2.4.2.2.5 Compose speeches for different purposes and occasions", 'Poetry composition workshop', resources.writing),
        entry('Oral Language', 'Presentation', "B8/JHS2.1.1.1 Perform oral texts with confidence and expression.", "B8/JHS2.1.1.1.5 Demonstrate appropriate turn taking for effective oral communication", 'Poetry performance', resources.oral),
      ]),
      week(6, 'Character types and literary comparison', [
        entry('Literature', 'Narrative, Drama and Poetry', "B8/JHS2.5.1.1 Demonstrate understanding of literary elements.", "B8/JHS2.5.1.1.1 Analyse the types of characters in texts", 'Round and static characters', resources.literature),
        entry('Reading', 'Comprehension', "B8/JHS2.2.1.1 Read, comprehend and analyse varied texts.", "B8/JHS2.2.1.1.3 Generate and answer questions to increase confidence and independent reading through a variety of non- fiction texts", 'Character comparison reading', resources.reading),
        entry('Writing', 'Text Response', "B8/JHS2.4.2.2 Write organised responses to texts using support.", "B8/JHS2.4.2.2.4 Create dialogues among multiple interlocutors on different themes", 'Writing about character types', resources.writing),
      ]),
      week(7, 'Dialogue, monologue and performance writing', [
        entry('Literature', 'Narrative, Drama and Poetry', "B8/JHS2.5.1.1 Demonstrate understanding of literary elements.", "B8/JHS2.5.1.1.3 Examine how monologues and dialogues are used to convey characters in narratives and play scripts", 'Dialogues and monologues in narrative and drama', resources.literature),
        entry('Writing', 'Text Types and Purposes', "B8/JHS2.4.2.2 Create dialogues among multiple interlocutors.", "B8/JHS2.4.2.2.4 Create dialogues among multiple interlocutors on different themes", 'Dialogue scripting', resources.writing),
        entry('Oral Language', 'Presentation', "B8/JHS2.1.2.1 Use spoken language to perform prepared texts.", "B8/JHS2.1.2.1.1 Listen to a level-appropriate dialogue/discussion by more than one speaker attentively and identify key information", 'Dialogue and monologue performance', resources.oral),
      ]),
      week(8, 'Literary devices and style', [
        entry('Literature', 'Narrative, Drama and Poetry', "B8/JHS2.5.1.1 Demonstrate understanding of literary devices in texts.", "B8/JHS2.5.1.1.4 Use literary devices (euphemism, hyperbole, onomatopoeia, etc.) in texts", 'Literary devices and style', resources.literature),
        entry('Grammar Usage', 'Vocabulary/Aesthetic language', "B8/JHS2.3.3.1 Use figurative and expressive language appropriately.", "B8/JHS2.3.3.1.1 Use vocabulary appropriately in speaking and writing", 'Expressive language choices', resources.grammar),
        entry('Writing', 'Creative Writing', "B8/JHS2.4.2.1 Craft short creative pieces using style and effect.", "B8/JHS2.4.2.1.3 Create shorter transactional texts to convince an audience to accept an opinion", 'Creative style practice', resources.writing),
      ]),
      week(9, 'Sequence of events in media and narratives', [
        entry('Literature', 'Narrative, Drama and Poetry', "B8/JHS2.5.1.1 Demonstrate understanding of sequence and structure in literary texts.", "B8/JHS2.5.1.1.5 Analyse the sequence of events in film/media, narratives and play scripts (drama)", 'Sequencing events in stories and media', resources.literature),
        entry('Reading', 'Comprehension', "B8/JHS2.2.1.1 Analyse texts for structure and meaning.", "B8/JHS2.2.1.1.3 Generate and answer questions to increase confidence and independent reading through a variety of non- fiction texts", 'Event mapping in reading', resources.reading),
        entry('Writing', 'Narrative Writing', "B8/JHS2.4.2.1 Compose coherent event sequences in writing.", "B8/JHS2.4.2.1.1 Write personal narratives using effective techniques incorporating descriptive details and logical event sequences", 'Sequenced narrative writing', resources.writing),
      ]),
      week(10, 'Transport, health and report writing', [
        entry('Reading', 'Comprehension', "B8/JHS2.2.1.1 Read and analyse informational texts on real-life themes.", "B8/JHS2.2.1.1.3 Generate and answer questions to increase confidence and independent reading through a variety of non- fiction texts", 'Reading around transport and health', resources.reading),
        entry('Writing', 'Text Types and Purposes', "B8/JHS2.4.2.2 Apply writing skills to real-life communication.", "B8/JHS2.4.2.2.3 Write articles on given issues for publication in school magazines", 'Informational and report writing', resources.writing),
        entry('Oral Language', 'Discussion', "B8/JHS2.1.1.1 Discuss practical issues using appropriate register.", "B8/JHS2.1.1.1.2 Ask and respond to specific questions with elaboration by making comments that contribute to texts, issues or topics under discussion", 'Discussion on transport and health issues', resources.oral),
      ]),
      week(11, 'Independent reading and article development', [
        entry('Reading', 'Independent Reading', "B8/JHS2.2.1.1 Build reading confidence and enjoyment across varied texts.", "B8/JHS2.2.1.1.3 Generate and answer questions to increase confidence and independent reading through a variety of non- fiction texts", 'Independent thematic reading', resources.reading),
        entry('Writing', 'Text Types and Purposes', "B8/JHS2.4.2.2 Write articles for publication using planning and drafting.", "B8/JHS2.4.2.2.3 Write articles on given issues for publication in school magazines", 'Article drafting and revision', resources.writing),
        entry('Grammar Usage', 'Grammar/Vocabulary', "B8/JHS2.3.3.1 Use editing strategies to improve clarity and correctness.", "B8/JHS2.3.3.1.1 Use vocabulary appropriately in speaking and writing", 'Revision and editing workshop', resources.grammar),
      ]),
      week(12, 'Integrated publishing and presentation week', [
        entry('Writing', 'Integrated Writing Task', "B8/JHS2.4.2.1 Apply writing skills to a polished final task.", "B8/JHS2.4.2.1.1 Write personal narratives using effective techniques incorporating descriptive details and logical event sequences", 'Publishing and presentation task', resources.writing),
        entry('Oral Language', 'Presentation', "B8/JHS2.1.1.1 Present ideas clearly to audience.", "B8/JHS2.1.1.1.5 Demonstrate appropriate turn taking for effective oral communication", 'Final oral presentation', resources.oral),
        entry('Literature/Reading', 'Response and Appreciation', "B8/JHS2.2.1.1 Use reading and literary appreciation to support final work.", "B8/JHS2.2.1.1.3 Generate and answer questions to increase confidence and independent reading through a variety of non- fiction texts", 'Reading-supported final showcase', [...resources.reading, ...resources.literature]),
      ]),
    ],
  },
  {
    subject: 'English Language',
    classLevel: 'B8',
    term: 'Term 3',
    title: 'B8 English Language Scheme of Work - Term 3',
    weeks: [
      week(1, 'Social issues and oral argument', [
        entry('Oral Language', 'Conversation/Everyday Discourse', "B8/JHS2.1.1.1 Use oral language to discuss issues appropriately.", "B8/JHS2.1.1.1.5 Demonstrate appropriate turn taking for effective oral communication", 'Oral argument on social issues', resources.oral),
        entry('Reading', 'Comprehension', "B8/JHS2.2.1.1 Read and analyse texts on current issues.", "B8/JHS2.2.1.1.3 Generate and answer questions to increase confidence and independent reading through a variety of non- fiction texts", 'Reading on social issues and current affairs', resources.reading),
        entry('Writing', 'Text Response', "B8/JHS2.4.2.1 Write organised responses using textual evidence.", "B8/JHS2.4.2.1.4 Compose paragraphs that identify an issue, give details about it and suggest solutions", 'Written response to social issues', resources.writing),
      ]),
      week(2, 'Agriculture and informative explanation', [
        entry('Reading', 'Comprehension', "B8/JHS2.2.1.1 Analyse informational texts using contextual clues and evidence.", "B8/JHS2.2.1.1.3 Generate and answer questions to increase confidence and independent reading through a variety of non- fiction texts", 'Reading agriculture and environment passages', resources.reading),
        entry('Writing', 'Building and Presenting Knowledge', "B8/JHS2.4.3.1 Research to build and present knowledge.", "B8/JHS2.4.3.1.1 Use information from non-text sources (figures, tables graphs, and maps) to support ideas in writing", 'Research-supported explanation writing', resources.writing),
        entry('Grammar Usage', 'Vocabulary', "B8/JHS2.3.3.1 Use subject-specific vocabulary in context.", "B8/JHS2.3.3.1.1 Use vocabulary appropriately in speaking and writing", 'Domain vocabulary in context', resources.grammar),
      ]),
      week(3, 'Speech writing and persuasive appeals', [
        entry('Writing', 'Text Types and Purposes', "B8/JHS2.4.2.2 Compose speeches for different purposes and occasions.", "B8/JHS2.4.2.2.5 Compose speeches for different purposes and occasions", 'Speech writing and rhetorical structure', resources.writing),
        entry('Oral Language', 'Presentation', "B8/JHS2.1.1.1 Use oral techniques to deliver structured messages.", "B8/JHS2.1.1.1.5 Demonstrate appropriate turn taking for effective oral communication", 'Speech presentation', resources.oral),
        entry('Reading', 'Comprehension', "B8/JHS2.2.1.1 Analyse persuasive models for structure and effect.", "B8/JHS2.2.1.1.3 Generate and answer questions to increase confidence and independent reading through a variety of non- fiction texts", 'Reading speeches and persuasive texts', resources.reading),
      ]),
      week(4, 'Research and non-text sources', [
        entry('Writing', 'Building and Presenting Knowledge', "B8/JHS2.4.3.1 Research to build and present knowledge.", "B8/JHS2.4.3.1.1 Use information from non-text sources (figures, tables graphs, and maps) to support ideas in writing", 'Research using graphs, figures and maps', resources.writing),
        entry('Reading', 'Comprehension', "B8/JHS2.2.1.1 Interpret non-textual elements and support ideas with evidence.", "B8/JHS2.2.1.1.3 Generate and answer questions to increase confidence and independent reading through a variety of non- fiction texts", 'Reading graphical and visual data', resources.reading),
        entry('Oral Language', 'Discussion/Presentation', "B8/JHS2.1.1.1 Present findings using clear spoken language.", "B8/JHS2.1.1.1.5 Demonstrate appropriate turn taking for effective oral communication", 'Presenting research findings', resources.oral),
      ]),
      week(5, 'Poetry and creative performance', [
        entry('Literature', 'Narrative, Drama and Poetry', "B8/JHS2.5.1.1 Demonstrate understanding of literary genres and their elements.", "B8/JHS2.5.1.1.4 Use literary devices (euphemism, hyperbole, onomatopoeia, etc.) in texts", 'Poetry interpretation and performance', resources.literature),
        entry('Writing', 'Creative Writing', "B8/JHS2.4.2.1 Compose original creative texts for audience and effect.", "B8/JHS2.4.2.1.1 Write personal narratives using effective techniques incorporating descriptive details and logical event sequences", 'Creative poetry writing', resources.writing),
        entry('Oral Language', 'Presentation', "B8/JHS2.1.1.1 Perform oral texts with confidence and expression.", "B8/JHS2.1.1.1.5 Demonstrate appropriate turn taking for effective oral communication", 'Poetry performance showcase', resources.oral),
      ]),
      week(6, 'Media and technology communication', [
        entry('Reading', 'Comprehension', "B8/JHS2.2.1.1 Read and analyse media and technology texts.", "B8/JHS2.2.1.1.3 Generate and answer questions to increase confidence and independent reading through a variety of non- fiction texts", 'Reading on communication and technology', [...resources.reading, ...resources.media]),
        entry('Writing', 'Text Types and Purposes', "B8/JHS2.4.2.2 Create short practical and media texts for audience.", "B8/JHS2.4.2.2.1 Compose formal writing using the appropriate format", 'Technology-supported communication writing', resources.writing),
        entry('Grammar Usage', 'Vocabulary/Style', "B8/JHS2.3.3.1 Use communication and media vocabulary effectively.", "B8/JHS2.3.3.1.1 Use vocabulary appropriately in speaking and writing", 'Media vocabulary and style', resources.grammar),
      ]),
      week(7, 'Comparative reading and thematic synthesis', [
        entry('Reading', 'Comprehension', "B8/JHS2.2.1.1 Compare text meaning, viewpoints and themes.", "B8/JHS2.2.1.1.3 Generate and answer questions to increase confidence and independent reading through a variety of non- fiction texts", 'Comparative reading and synthesis', resources.reading),
        entry('Writing', 'Text Response', "B8/JHS2.4.2.1 Write integrated responses that combine evidence from multiple texts.", "B8/JHS2.4.2.1.4 Compose paragraphs that identify an issue, give details about it and suggest solutions", 'Synthesis writing', resources.writing),
        entry('Oral Language', 'Discussion', "B8/JHS2.1.1.1 Discuss text comparisons and defend viewpoints.", "B8/JHS2.1.1.1.2 Ask and respond to specific questions with elaboration by making comments that contribute to texts, issues or topics under discussion", 'Panel-style comparison discussion', resources.oral),
      ]),
      week(8, 'Narratives, dialogues and publication', [
        entry('Writing', 'Text Types and Purposes', "B8/JHS2.4.2.2 Create dialogues and articles for publication.", "B8/JHS2.4.2.2.3 Write articles on given issues for publication in school magazines", 'Dialogue-rich publication writing', resources.writing),
        entry('Literature', 'Narrative, Drama and Poetry', "B8/JHS2.5.1.1 Use literary elements to enrich writing.", "B8/JHS2.5.1.1.4 Use literary devices (euphemism, hyperbole, onomatopoeia, etc.) in texts", 'Narrative craft and dialogue', resources.literature),
        entry('Grammar Usage', 'Punctuation', "B8/JHS2.3.2.1 Use dialogue punctuation and capitals correctly.", "B8/JHS2.3.2.1.1 Use punctuation marks (colon, semi-colon, apostrophe) in context", 'Dialogue punctuation workshop', resources.grammar),
      ]),
      week(9, 'Environmental and health campaign writing', [
        entry('Writing', 'Text Types and Purposes', "B8/JHS2.4.2.2 Apply writing skills to campaign and awareness tasks.", "B8/JHS2.4.2.2.1 Compose formal writing using the appropriate format", 'Campaign writing on environment and health', resources.writing),
        entry('Reading', 'Comprehension', "B8/JHS2.2.1.1 Read campaign texts critically for audience and effectiveness.", "B8/JHS2.2.1.1.3 Generate and answer questions to increase confidence and independent reading through a variety of non- fiction texts", 'Reading campaign materials', resources.reading),
        entry('Oral Language', 'Presentation', "B8/JHS2.1.1.1 Present campaigns orally with confidence.", "B8/JHS2.1.1.1.5 Demonstrate appropriate turn taking for effective oral communication", 'Short oral advocacy presentations', resources.oral),
      ]),
      week(10, 'Independent reading and literary appreciation', [
        entry('Reading', 'Independent Reading', "B8/JHS2.2.1.1 Sustain independent reading across themes.", "B8/JHS2.2.1.1.3 Generate and answer questions to increase confidence and independent reading through a variety of non- fiction texts", 'Independent reading journal', resources.reading),
        entry('Literature', 'Narrative, Drama and Poetry', "B8/JHS2.5.1.1 Connect literary appreciation to wider reading.", "B8/JHS2.5.1.1.4 Use literary devices (euphemism, hyperbole, onomatopoeia, etc.) in texts", 'Literary response journal', resources.literature),
        entry('Writing', 'Reflection Writing', "B8/JHS2.4.2.2 Write reflections and reviews on texts read.", "B8/JHS2.4.2.2.4 Create dialogues among multiple interlocutors on different themes", 'Reader response writing', resources.writing),
      ]),
      week(11, 'Revision, editing and portfolio assembly', [
        entry('Writing', 'Production and Distribution of Writing', "B8/JHS2.4.2.1 Develop, revise and present coherent writing.", "B8/JHS2.4.2.1.1 Write personal narratives using effective techniques incorporating descriptive details and logical event sequences", 'Portfolio editing and assembly', resources.writing),
        entry('Grammar Usage', 'Grammar/Punctuation/Vocabulary', "B8/JHS2.3.2.1 Use editing strategies across multiple drafts.", "B8/JHS2.3.2.1.1 Use punctuation marks (colon, semi-colon, apostrophe) in context", 'Editing workshop', resources.grammar),
        entry('Oral Language', 'Conference', "B8/JHS2.1.1.1 Use speaking skills in feedback conferences.", "B8/JHS2.1.1.1.5 Demonstrate appropriate turn taking for effective oral communication", 'Peer feedback and conferencing', resources.oral),
      ]),
      week(12, 'Integrated B8 English showcase', [
        entry('Writing', 'Integrated Final Task', "B8/JHS2.4.2.2 Apply writing skills to a polished final piece.", "B8/JHS2.4.2.2.3 Write articles on given issues for publication in school magazines", 'Final integrated B8 writing task', resources.writing),
        entry('Oral Language', 'Presentation', "B8/JHS2.1.1.1 Use oral confidence and appropriate register in final presentation.", "B8/JHS2.1.1.1.5 Demonstrate appropriate turn taking for effective oral communication", 'Final presentation and defence', resources.oral),
        entry('Reading/Literature', 'Response and Appreciation', "B8/JHS2.2.1.1 Use reading and literary understanding to enrich final work.", "B8/JHS2.2.1.1.3 Generate and answer questions to increase confidence and independent reading through a variety of non- fiction texts", 'Integrated reading/literature support', [...resources.reading, ...resources.literature]),
      ]),
    ],
  },
];

export const englishB9Terms: ExplicitCurriculumTerm[] = [
  {
    subject: 'English Language',
    classLevel: 'B9',
    term: 'Term 1',
    title: 'B9 English Language Scheme of Work - Term 1',
    weeks: [
      week(1, 'Register, slang and purposeful conversation', [
        entry('Oral Language', 'Conversation/Everyday Discourse', "B9/JHS3.1.1.1 Demonstrate the use of appropriate language orally in specific situations.", "B9/JHS3.1.1.1.1 Use appropriate register in everyday communication (informal and formal) with diverse partners on grade-level topics/texts/issue", 'Formal and informal register, slang and jargon', resources.oral),
        entry('Reading', 'Comprehension', "B9/JHS3.2.1.1 Demonstrate increasing confidence and enjoyment in independent reading.", "B9/JHS3.2.1.1.1 Read a variety of grade level texts and demonstrate understanding", 'Reading texts for register and audience awareness', resources.reading),
        entry('Writing', 'Production and Distribution of Writing', "B9/JHS3.4.3.1 Develop, organise and express ideas coherently and cohesively in writing.", "B9/JHS3.4.3.1.1 Conduct short research projects based on focused questions, and present key findings in writing", 'Register-sensitive writing', resources.writing),
      ]),
      week(2, 'Open-ended discussion on national and global issues', [
        entry('Oral Language', 'Conversation/Everyday Discourse', "B9/JHS3.1.1.1 Demonstrate the use of appropriate language orally in specific situations.", "B9/JHS3.1.1.1.2 Ask questions that link the ideas of several speakers and respond to others’ questions in a discussion; B9/JHS3.1.1.1.3 Use appropriate language and open-ended questions to discuss grade-level national and global issues", 'Discussion of national and global issues', resources.oral),
        entry('Reading', 'Comprehension', "B9/JHS3.2.1.1 Demonstrate increasing confidence and enjoyment in independent reading.", "B9/JHS3.2.1.1.2 Reflect on how reading impacts self and others see the world (contrasting viewpoints, evaluating reasoning, determining importance or credibility)", 'Reading texts on governance, media and social values', resources.reading),
        entry('Writing', 'Text Response', "B9/JHS3.4.2.2 Compose organised viewpoints using support.", "B9/JHS3.4.2.2.1 Compose formal writing (business letters, email, minutes, programme agenda reports) on given topics using appropriate format", 'Issue-based response writing', resources.writing),
      ]),
      week(3, 'Argument and debate techniques', [
        entry('Oral Language', 'Conversation/Everyday Discourse', "B9/JHS3.1.1.1 Demonstrate the use of appropriate language orally in specific situations.", "B9/JHS3.1.1.1.4 Demonstrate appropriate turn taking and use techniques for effective argument (debating)", 'Argument, debate and rebuttal', resources.oral),
        entry('Reading', 'Comprehension', "B9/JHS3.2.1.1 Read a variety of texts and analyse how ideas are supported.", "B9/JHS3.2.1.1.2 Reflect on how reading impacts self and others see the world (contrasting viewpoints, evaluating reasoning, determining importance or credibility)", 'Reading arguments and identifying support', resources.reading),
        entry('Writing', 'Persuasive Writing', "B9/JHS3.4.2.1 Use writing to defend a clear position.", "B9/JHS3.4.2.1.2 Use different narrative techniques to manipulate time in a story", 'Argument paragraph writing', resources.writing),
      ]),
      week(4, 'Audio-visual listening and media response', [
        entry('Oral Language', 'Listening Comprehension', "B9/JHS3.1.2.1 Demonstrate the ability to listen to extended texts and identify key information.", "B9/JHS3.1.2.1.1 Listen to audio-visual texts attentively and support ideas with vocabulary/ language/figures; B9/JHS3.1.2.1.2 Initiate and participate in meaningful and collaborative discussions using texts and related materials, building on others’ ideas and expressing their own clearly and persuasively", 'Audio-visual listening and response', [...resources.oral, ...resources.media]),
        entry('Reading', 'Comprehension', "B9/JHS3.2.1.1 Demonstrate increasing confidence and enjoyment in independent reading.", "B9/JHS3.2.1.1.3 Evaluate ways that the media helps to disseminate information via different text types", 'Media reading and critique', [...resources.reading, ...resources.media]),
        entry('Writing', 'Building and Presenting Knowledge', "B9/JHS3.4.3.1 Research to build and present knowledge.", "B9/JHS3.4.3.1.1 Conduct short research projects based on focused questions, and present key findings in writing", 'Media note-taking and response writing', resources.writing),
      ]),
      week(5, 'Advanced sound work and oral fluency', [
        entry('Oral Language', 'English Sounds', "B9/JHS3.1.3.1 Articulate English speech sounds to develop confidence and skills in listening and speaking.", "B9/JHS3.1.3.1.1 Produce /r/ and /l/ sounds in different positions in word; B9/JHS3.1.3.1.2 Produce consonant clusters in context; B9/JHS3.1.3.1.3 Produce mono-syllabic and di-syllabic words with accurate stress in speech", 'Advanced pronunciation and stress patterns', resources.oral),
        entry('Reading', 'Comprehension', "B9/JHS3.2.1.1 Use texts to support sound and fluency practice.", "B9/JHS3.2.1.1.1 Read a variety of grade level texts and demonstrate understanding", 'Oral fluency through reading', resources.reading),
        entry('Writing', 'Production and Distribution of Writing', "B9/JHS3.4.2.2 Develop coherent writing that supports oral communication.", "B9/JHS3.4.2.2.3 Write articles, short reports, letters and case studies on given issues for publication", 'Preparing oral scripts', resources.writing),
      ]),
      week(6, 'Comparing viewpoints and expanding perspectives', [
        entry('Reading', 'Comprehension', "B9/JHS3.2.1.1 Demonstrate increasing confidence and enjoyment in independent reading.", "B9/JHS3.2.1.1.2 Reflect on how reading impacts self and others see the world (contrasting viewpoints, evaluating reasoning, determining importance or credibility); B9/JHS3.2.1.1.3 Evaluate ways that the media helps to disseminate information via different text types; B9/JHS3.2.1.1.4 Expand various ideas and perspectives in texts", 'Comparing viewpoints and perspectives', resources.reading),
        entry('Oral Language', 'Discussion', "B9/JHS3.1.1.1 Discuss and defend interpretations clearly and persuasively.", "B9/JHS3.1.1.1.2 Ask questions that link the ideas of several speakers and respond to others’ questions in a discussion", 'Seminar discussion on contrasting viewpoints', resources.oral),
        entry('Writing', 'Analytical Response', "B9/JHS3.4.2.1 Write organised analytical responses to texts.", "B9/JHS3.4.2.1.2 Use different narrative techniques to manipulate time in a story", 'Writing viewpoint comparison responses', resources.writing),
      ]),
      week(7, 'Timed reading, prediction and generalisation', [
        entry('Reading', 'Comprehension', "B9/JHS3.2.1.2 Read, comprehend and analyse varieties of texts.", "B9/JHS3.2.1.2.1 Read given text, within a specific time, for specific information; B9/JHS3.2.1.2.2 Make predictions, identify patterns and relationships of ideas to analyse texts; B9/JHS3.2.1.2.3 Make generalisations from text and link to real life situations", 'Timed reading and pattern analysis', resources.reading),
        entry('Writing', 'Summary and Notes', "B9/JHS3.4.2.2 Produce concise written records of reading.", "B9/JHS3.4.2.2.1 Compose formal writing (business letters, email, minutes, programme agenda reports) on given topics using appropriate format", 'Summary and note-making from timed reading', resources.writing),
        entry('Grammar Usage', 'Vocabulary', "B9/JHS3.3.3.1 Use academic and technical vocabulary in context.", "B9/JHS3.3.3.1.1 Interpret vocabulary appropriately in more complex texts", 'Vocabulary from academic reading', resources.grammar),
      ]),
      week(8, 'Comparative text analysis', [
        entry('Reading', 'Comprehension', "B9/JHS3.2.1.2 Read, comprehend and analyse varieties of texts.", "B9/JHS3.2.1.2.4 Compare the language, style, structure and purpose, as well as the ideas/information from different types of texts; B9/JHS3.2.1.2.5 Read silently and answer more complex comprehension questions on texts /passages", 'Comparative analysis of narrative, expository and procedural texts', resources.reading),
        entry('Writing', 'Analytical Writing', "B9/JHS3.4.2.1 Develop coherent multi-text analytical responses.", "B9/JHS3.4.2.1.2 Use different narrative techniques to manipulate time in a story", 'Comparative analytical writing', resources.writing),
        entry('Oral Language', 'Discussion', "B9/JHS3.1.1.1 Discuss similarities and differences in texts with support.", "B9/JHS3.1.1.1.2 Ask questions that link the ideas of several speakers and respond to others’ questions in a discussion", 'Oral comparison of text choices', resources.oral),
      ]),
      week(9, 'Imagery, figurative meaning and effect on reader', [
        entry('Reading', 'Comprehension', "B9/JHS3.2.1.2 Read, comprehend and analyse varieties of texts.", "B9/JHS3.2.1.2.6 Show the effect a text has on the reader; B9/JHS3.2.1.2.7 Interpret use of words/ phases (figurative, symbolic, sensory) in complex texts", 'Imagery and reader response', resources.reading),
        entry('Literature', 'Narrative, Drama and Poetry', "B9/JHS3.5.1.1 Analyse literary devices and thematic effect.", "B9/JHS3.5.1.1.4 Use literary devices and imagery in texts", 'Literary imagery and effect', resources.literature),
        entry('Writing', 'Creative/Analytical Writing', "B9/JHS3.4.2.1 Use imagery purposefully in original writing.", "B9/JHS3.4.2.1.2 Use different narrative techniques to manipulate time in a story", 'Imagery in writing', resources.writing),
      ]),
      week(10, 'Academic and technical vocabulary', [
        entry('Reading', 'Comprehension', "B9/JHS3.2.1.2 Read, comprehend and analyse varieties of texts.", "B9/JHS3.2.1.2.8 Demonstrate conceptual understanding of academic, domain-specific, and technical vocabulary in varied context; B9/JHS3.2.1.2.9 Make conceptual connections between known and unknown words or phrases and analyse nuances of words or phrases in texts", 'Academic and technical vocabulary in context', resources.reading),
        entry('Grammar Usage', 'Vocabulary', "B9/JHS3.3.3.1 Demonstrate appropriate use of vocabulary and spelling conventions in communication.", "B9/JHS3.3.3.1.1 Interpret vocabulary appropriately in more complex texts", 'Precision and nuance in word choice', resources.grammar),
        entry('Writing', 'Academic Response', "B9/JHS3.4.1.1 Use academic vocabulary in coherent paragraphs.", "B9/JHS3.4.1.1.1 Compose logically connected paragraphs to show unity, completeness and coherence using appropriate cohesive devices, e.g., connectors, pronouns, repetition of vocabulary or grammatical structures", 'Academic vocabulary in writing', resources.writing),
      ]),
      week(11, 'Objective summary and evidence', [
        entry('Reading', 'Summarising', "B9/JHS3.2.2.1 Cite the textual evidence that supports an analysis of what the text says and provide an objective summary.", "B9/JHS3.2.2.1.1 Analyse critically a given text in entirety and provide an objective summary", 'Critical reading and objective summary', resources.reading),
        entry('Writing', 'Summary Writing', "B9/JHS3.4.3.1 Write objective summaries that preserve central ideas.", "B9/JHS3.4.3.1.1 Conduct short research projects based on focused questions, and present key findings in writing", 'Objective summary writing', resources.writing),
        entry('Oral Language', 'Discussion', "B9/JHS3.1.1.1 Explain central ideas and evidence orally.", "B9/JHS3.1.1.1.2 Ask questions that link the ideas of several speakers and respond to others’ questions in a discussion", 'Oral explanation of main and supporting ideas', resources.oral),
      ]),
      week(12, 'Integrated reading and issue response portfolio', [
        entry('Reading', 'Independent Reading', "B9/JHS3.2.1.1 Sustain independent reading and analysis.", "B9/JHS3.2.1.1.1 Read a variety of grade level texts and demonstrate understanding", 'Independent reading portfolio', resources.reading),
        entry('Writing', 'Integrated Analytical Task', "B9/JHS3.4.3.1 Produce a polished analytical or argumentative response.", "B9/JHS3.4.3.1.1 Conduct short research projects based on focused questions, and present key findings in writing", 'Portfolio of analytical writing', resources.writing),
        entry('Oral Language', 'Presentation', "B9/JHS3.1.2.1 Present ideas with confidence and clarity.", "B9/JHS3.1.2.1.2 Initiate and participate in meaningful and collaborative discussions using texts and related materials, building on others’ ideas and expressing their own clearly and persuasively", 'Issue-response presentation', resources.oral),
      ]),
    ],
  },
  {
    subject: 'English Language',
    classLevel: 'B9',
    term: 'Term 2',
    title: 'B9 English Language Scheme of Work - Term 2',
    weeks: [
      week(1, 'Noun phrases and sentence functions', [
        entry('Grammar Usage', 'Grammar', "B9/JHS3.3.1.1 Apply the knowledge of phrases and clauses and their functions in communication.", "B9/JHS3.3.1.1.1 Use noun phrases accurately in context", 'Noun phrases and sentence functions', resources.grammar),
        entry('Reading', 'Comprehension', "B9/JHS3.2.1.2 Read and analyse texts for structure and meaning.", "B9/JHS3.2.1.2.9 Make conceptual connections between known and unknown words or phrases and analyse nuances of words or phrases in texts", 'Analysing phrase use in texts', resources.reading),
        entry('Writing', 'Production and Distribution of Writing', "B9/JHS3.4.1.1 Develop organised and coherent writing.", "B9/JHS3.4.1.1.1 Compose logically connected paragraphs to show unity, completeness and coherence using appropriate cohesive devices, e.g., connectors, pronouns, repetition of vocabulary or grammatical structures", 'Sentence expansion with noun phrases', resources.writing),
      ]),
      week(2, 'Adjective order and phrasal verbs', [
        entry('Grammar Usage', 'Grammar', "B9/JHS3.3.1.1 Apply the knowledge of phrases and clauses and their functions in communication.", "B9/JHS3.3.1.1.2 Demonstrate command using multiple adjectives in the correct order, and using quantifiers effectively in speaking and writing; B9/JHS3.3.1.1.3 Use more complex phrasal verbs accurately in speech and writing", 'Adjective order and phrasal verbs', resources.grammar),
        entry('Writing', 'Production and Distribution of Writing', "B9/JHS3.4.2.1 Develop coherent and detailed written expression.", "B9/JHS3.4.2.1.3 Write a well-organised persuasive piece (e.g. argumentative) that states and defends a position", 'Enhancing style through modifiers and phrasal verbs', resources.writing),
        entry('Oral Language', 'Conversation', "B9/JHS3.1.1.1 Use complex vocabulary and phrases in speech.", "B9/JHS3.1.1.1.3 Use appropriate language and open-ended questions to discuss grade-level national and global issues", 'Phrasal verbs in spoken interaction', resources.oral),
      ]),
      week(3, 'Adverbial phrases and conditionals', [
        entry('Grammar Usage', 'Grammar', "B9/JHS3.3.1.1 and B9/JHS3.3.1.2 Apply phrase knowledge and conditional tenses in communication.", "B9/JHS3.3.1.1.4 Use the knowledge of the adverbial phrase and its functions; B9/JHS3.3.1.2.1 Use conditional sentences in communication to indicate an impossible condition in the past and its probable result", 'Adverbial phrases and conditional structures', resources.grammar),
        entry('Writing', 'Production and Distribution of Writing', "B9/JHS3.4.1.1 Develop organised and nuanced sentences and paragraphs.", "B9/JHS3.4.1.1.1 Compose logically connected paragraphs to show unity, completeness and coherence using appropriate cohesive devices, e.g., connectors, pronouns, repetition of vocabulary or grammatical structures", 'Sentence variety with adverbials and conditionals', resources.writing),
        entry('Reading', 'Comprehension', "B9/JHS3.2.1.1 Notice grammatical choices in complex texts.", "B9/JHS3.2.1.1.2 Reflect on how reading impacts self and others see the world (contrasting viewpoints, evaluating reasoning, determining importance or credibility)", 'Grammar in context through reading', resources.reading),
      ]),
      week(4, 'Relative clauses, subject and predicate', [
        entry('Grammar Usage', 'Grammar', "B9/JHS3.3.1.2 and B9/JHS3.3.1.3 Apply clause knowledge and sentence structure in communication.", "B9/JHS3.3.1.2.2 Use defining and non-defining relative clauses appropriately in speech and writing; B9/JHS3.3.1.3.1 Identify and use subject and predicate in texts", 'Relative clauses, subject and predicate', resources.grammar),
        entry('Writing', 'Production and Distribution of Writing', "B9/JHS3.4.1.1 Construct complete and varied sentences.", "B9/JHS3.4.1.1.1 Compose logically connected paragraphs to show unity, completeness and coherence using appropriate cohesive devices, e.g., connectors, pronouns, repetition of vocabulary or grammatical structures", 'Sentence combining and expansion', resources.writing),
        entry('Reading', 'Comprehension', "B9/JHS3.2.1.1 Use model texts to identify sentence structures.", "B9/JHS3.2.1.1.1 Read a variety of grade level texts and demonstrate understanding", 'Sentence structure in reading', resources.reading),
      ]),
      week(5, 'Voice, reported speech and punctuation', [
        entry('Grammar Usage', 'Grammar/Punctuation', "B9/JHS3.3.1.4 and Demonstrate mastery of active/passive voice, reported speech, punctuation and capitalisation.", "B9/JHS3.3.1.4.1 Use passive forms appropriately in speech and in writing", 'Voice, reported speech and advanced punctuation', resources.grammar),
        entry('Writing', 'Editing and Revision', "B9/JHS3.4.2.2 Improve writing through effective editing.", "B9/JHS3.4.2.2.1 Compose formal writing (business letters, email, minutes, programme agenda reports) on given topics using appropriate format", 'Editing for advanced punctuation and reported speech', resources.writing),
        entry('Reading', 'Comprehension', "B9/JHS3.2.1.2 Read complex texts and identify stylistic features.", "B9/JHS3.2.1.2.5 Read silently and answer more complex comprehension questions on texts /passages", 'Punctuation and voice in model texts', resources.reading),
      ]),
      week(6, 'Logical paragraphs and cohesion', [
        entry('Writing', 'Production and Distribution of Writing', "B9/JHS3.4.1.1 Develop, organise and express ideas coherently and cohesively in writing.", "B9/JHS3.4.1.1.1 Compose logically connected paragraphs to show unity, completeness and coherence using appropriate cohesive devices, e.g., connectors, pronouns, repetition of vocabulary or grammatical structures; B9/JHS3.4.1.1.2 Develop a paragraph to show paragraph unity and completeness using supporting details (e.g. explanation, elaboration, definition, examples)", 'Paragraph cohesion, unity and completeness', resources.writing),
        entry('Grammar Usage', 'Grammar', "B9/JHS3.3.1.2 Apply connectors, clauses and phrase structures to writing.", "B9/JHS3.3.1.2.2 Use defining and non-defining relative clauses appropriately in speech and writing", 'Cohesive devices in paragraph writing', resources.grammar),
        entry('Reading', 'Comprehension', "B9/JHS3.2.1.1 Analyse paragraph organisation in model texts.", "B9/JHS3.2.1.1.1 Read a variety of grade level texts and demonstrate understanding", 'Reading as a model for paragraph structure', resources.reading),
      ]),
      week(7, 'Complex paragraphs and connectors', [
        entry('Writing', 'Production and Distribution of Writing', "B9/JHS3.4.1.2 Create different paragraphs on given topics.", "B9/JHS3.4.1.2.1 Compose more complex paragraphs using appropriate strategies", 'Mixed and periodic paragraphs, logical connectors', resources.writing),
        entry('Reading', 'Comprehension', "B9/JHS3.2.1.2 Read model paragraphs for style and purpose.", "B9/JHS3.2.1.2.8 Demonstrate conceptual understanding of academic, domain-specific, and technical vocabulary in varied context", 'Model paragraph analysis', resources.reading),
        entry('Oral Language', 'Discussion', "B9/JHS3.1.1.1 Explain paragraph choices and organisation orally.", "B9/JHS3.1.1.1.2 Ask questions that link the ideas of several speakers and respond to others’ questions in a discussion", 'Oral reasoning about writing choices', resources.oral),
      ]),
      week(8, 'Descriptive and narrative essays', [
        entry('Writing', 'Text Types and Purposes', "B9/JHS3.4.2.1 Use process approach to compose descriptive, narrative/imaginative, informational and persuasive/argumentative texts.", "B9/JHS3.4.2.1.1 Create effective descriptive sentences when describing characters, settings or mood; B9/JHS3.4.2.1.2 Use different narrative techniques to manipulate time in a story", 'Descriptive and narrative essays', resources.writing),
        entry('Literature', 'Narrative, Drama and Poetry', "B9/JHS3.5.1.1 Use literary craft to support writing choices.", "B9/JHS3.5.1.1.3 Analyse the sequence of events across texts (descriptive, auto-biography, biography, narrative and play script/ drama", 'Narrative craft and literary technique', resources.literature),
        entry('Reading', 'Comprehension', "B9/JHS3.2.1.1 Read narrative and descriptive models critically.", "B9/JHS3.2.1.1.1 Read a variety of grade level texts and demonstrate understanding", 'Reading narrative models', resources.reading),
      ]),
      week(9, 'Argumentative and informative writing', [
        entry('Writing', 'Text Types and Purposes', "B9/JHS3.4.2.1 Use process approach to compose persuasive and informative texts.", "B9/JHS3.4.2.1.3 Write a well-organised persuasive piece (e.g. argumentative) that states and defends a position; B9/JHS3.4.2.1.4 Write an informative, explanatory text on a familiar or unfamiliar topic", 'Argumentative and informative writing', resources.writing),
        entry('Reading', 'Comprehension', "B9/JHS3.2.1.1 Analyse persuasive and explanatory texts.", "B9/JHS3.2.1.1.1 Read a variety of grade level texts and demonstrate understanding", 'Reading persuasive and explanatory texts', resources.reading),
        entry('Oral Language', 'Debate/Discussion', "B9/JHS3.1.1.1 Use oral argument to test and refine positions.", "B9/JHS3.1.1.1.4 Demonstrate appropriate turn taking and use techniques for effective argument (debating)", 'Debate and explanation in speech', resources.oral),
      ]),
      week(10, 'Formal writing, minutes and agendas', [
        entry('Writing', 'Text Types and Purposes', "B9/JHS3.4.2.2 Apply writing skills to specific life situations using appropriate format.", "B9/JHS3.4.2.2.1 Compose formal writing (business letters, email, minutes, programme agenda reports) on given topics using appropriate format", 'Formal writing, minutes and agendas', resources.writing),
        entry('Reading', 'Comprehension', "B9/JHS3.2.1.1 Read model practical texts for organisation and tone.", "B9/JHS3.2.1.1.1 Read a variety of grade level texts and demonstrate understanding", 'Model analysis of practical texts', resources.reading),
        entry('Grammar Usage', 'Formal Register', "B9/JHS3.3.1.4 Use formal language and avoid inappropriate short forms.", "B9/JHS3.3.1.4.1 Use passive forms appropriately in speech and in writing", 'Formal register editing', resources.grammar),
      ]),
      week(11, 'Short texts, articles and speeches for publication', [
        entry('Writing', 'Text Types and Purposes', "B9/JHS3.4.2.2 Apply writing skills to specific life situations using appropriate format.", "B9/JHS3.4.2.2.2 Compose short texts for different purposes and audiences; B9/JHS3.4.2.2.3 Write articles, short reports, letters and case studies on given issues for publication; B9/JHS3.4.2.2.4 Compose speeches for different purposes and occasions", 'Flyers, invitations, emails, articles and speeches', resources.writing),
        entry('Oral Language', 'Presentation', "B9/JHS3.1.2.1 Use oral techniques and inclusive language in speeches.", "B9/JHS3.1.2.1.2 Initiate and participate in meaningful and collaborative discussions using texts and related materials, building on others’ ideas and expressing their own clearly and persuasively", 'Speech delivery and oral refinement', resources.oral),
        entry('Reading', 'Comprehension', "B9/JHS3.2.1.1 Analyse published articles and speeches for effect.", "B9/JHS3.2.1.1.1 Read a variety of grade level texts and demonstrate understanding", 'Reading articles and speeches as models', resources.reading),
      ]),
      week(12, 'Research project design and source handling', [
        entry('Writing', 'Building and Presenting Knowledge', "B9/JHS3.4.3.1 Research to build and present knowledge.", "B9/JHS3.4.3.1.1 Conduct short research projects based on focused questions, and present key findings in writing", 'Research question design and source recording', resources.writing),
        entry('Reading', 'Comprehension/Research', "B9/JHS3.2.1.1 Use sources critically and select evidence.", "B9/JHS3.2.1.1.1 Read a variety of grade level texts and demonstrate understanding", 'Reading for research', resources.reading),
        entry('Oral Language', 'Conference/Presentation', "B9/JHS3.1.2.1 Explain research intentions and findings clearly.", "B9/JHS3.1.2.1.2 Initiate and participate in meaningful and collaborative discussions using texts and related materials, building on others’ ideas and expressing their own clearly and persuasively", 'Research conference and proposal presentation', resources.oral),
      ]),
    ],
  },
  {
    subject: 'English Language',
    classLevel: 'B9',
    term: 'Term 3',
    title: 'B9 English Language Scheme of Work - Term 3',
    weeks: [
      week(1, 'Research findings and academic presentation', [
        entry('Writing', 'Building and Presenting Knowledge', "B9/JHS3.4.3.1 Research to build and present knowledge.", "B9/JHS3.4.3.1.1 Conduct short research projects based on focused questions, and present key findings in writing", 'Drafting and presenting research findings', resources.writing),
        entry('Oral Language', 'Presentation', "B9/JHS3.1.2.1 Use formal and persuasive presentation skills.", "B9/JHS3.1.2.1.2 Initiate and participate in meaningful and collaborative discussions using texts and related materials, building on others’ ideas and expressing their own clearly and persuasively", 'Research presentation', resources.oral),
        entry('Reading', 'Research Reading', "B9/JHS3.2.1.1 Use research sources critically and accurately.", "B9/JHS3.2.1.1.2 Reflect on how reading impacts self and others see the world (contrasting viewpoints, evaluating reasoning, determining importance or credibility)", 'Reviewing research sources', resources.reading),
      ]),
      week(2, 'Characters and dialogue in media and drama', [
        entry('Literature', 'Narrative, Drama and Poetry', "B9/JHS3.5.1.1 Demonstrate understanding of how various elements of literary genres contribute to meaning.", "B9/JHS3.5.1.1.1 Analyse the use of language to convey characters in film/media, narratives and play scripts; B9/JHS3.5.1.1.2 Create monologues and dialogues narratives in play scripts", 'Characters, monologues and dialogues', resources.literature),
        entry('Writing', 'Creative Writing', "B9/JHS3.4.2.1 Compose original dramatic and narrative pieces.", "B9/JHS3.4.2.1.2 Use different narrative techniques to manipulate time in a story", 'Dialogue and monologue creation', resources.writing),
        entry('Oral Language', 'Performance', "B9/JHS3.1.1.1 Perform dramatic speech with expression and clarity.", "B9/JHS3.1.1.1.1 Use appropriate register in everyday communication (informal and formal) with diverse partners on grade-level topics/texts/issue", 'Dramatic oral performance', resources.oral),
      ]),
      week(3, 'Sequence of events across texts', [
        entry('Literature', 'Narrative, Drama and Poetry', "B9/JHS3.5.1.1 Demonstrate understanding of how various elements of literary genres contribute to meaning.", "B9/JHS3.5.1.1.3 Analyse the sequence of events across texts (descriptive, auto-biography, biography, narrative and play script/ drama", 'Sequencing in media, narrative and drama', resources.literature),
        entry('Reading', 'Comparative Reading', "B9/JHS3.2.1.1 Compare texts for structure and event development.", "B9/JHS3.2.1.1.2 Reflect on how reading impacts self and others see the world (contrasting viewpoints, evaluating reasoning, determining importance or credibility)", 'Comparative event analysis', resources.reading),
        entry('Writing', 'Narrative/Analytical Writing', "B9/JHS3.4.2.1 Write about sequence and craft coherent event structures.", "B9/JHS3.4.2.1.2 Use different narrative techniques to manipulate time in a story", 'Sequenced writing and analysis', resources.writing),
      ]),
      week(4, 'Imagery and figurative expression in speech and writing', [
        entry('Literature', 'Narrative, Drama and Poetry', "B9/JHS3.5.1.1 Demonstrate understanding of literary devices and effect.", "B9/JHS3.5.1.1.4 Use literary devices and imagery in texts", 'Imagery, simile, metaphor and idiomatic expression', resources.literature),
        entry('Writing', 'Creative Writing', "B9/JHS3.4.2.1 Use figurative language for effect in original writing.", "B9/JHS3.4.2.1.2 Use different narrative techniques to manipulate time in a story", 'Crafting imagery in original writing', resources.writing),
        entry('Oral Language', 'Presentation', "B9/JHS3.1.2.1 Use expressive spoken language to communicate vividly.", "B9/JHS3.1.2.1.2 Initiate and participate in meaningful and collaborative discussions using texts and related materials, building on others’ ideas and expressing their own clearly and persuasively", 'Expressive oral reading', resources.oral),
      ]),
      week(5, 'Themes, values and adaptation', [
        entry('Literature', 'Narrative, Drama and Poetry', "B9/JHS3.5.1.1 Demonstrate understanding of thematic meaning in texts.", "B9/JHS3.5.1.1.5 Analyse common themes in texts", 'Themes and adaptation', resources.literature),
        entry('Reading', 'Comparative Reading', "B9/JHS3.2.1.1 Identify themes in texts and connect them to context.", "B9/JHS3.2.1.1.1 Read a variety of grade level texts and demonstrate understanding", 'Thematic reading on values and media', resources.reading),
        entry('Writing', 'Creative/Analytical Writing', "B9/JHS3.4.2.2 Write adapted narratives or thematic responses.", "B9/JHS3.4.2.2.1 Compose formal writing (business letters, email, minutes, programme agenda reports) on given topics using appropriate format", 'Theme-based adaptation writing', resources.writing),
      ]),
      week(6, 'Media, society and article publication', [
        entry('Reading', 'Comprehension', "B9/JHS3.2.1.1 Analyse media texts and public discourse critically.", "B9/JHS3.2.1.1.3 Evaluate ways that the media helps to disseminate information via different text types", 'Media and society reading', [...resources.reading, ...resources.media]),
        entry('Writing', 'Text Types and Purposes', "B9/JHS3.4.2.2 Write for publication using audience awareness and clear argument.", "B9/JHS3.4.2.2.3 Write articles, short reports, letters and case studies on given issues for publication", 'Publication writing on current issues', resources.writing),
        entry('Oral Language', 'Discussion/Debate', "B9/JHS3.1.1.1 Discuss and argue viewpoints on public issues.", "B9/JHS3.1.1.1.2 Ask questions that link the ideas of several speakers and respond to others’ questions in a discussion", 'Panel discussion on media and public values', resources.oral),
      ]),
      week(7, 'Environmental and civic communication', [
        entry('Reading', 'Comprehension', "B9/JHS3.2.1.1 Read texts on civic and environmental issues critically.", "B9/JHS3.2.1.1.1 Read a variety of grade level texts and demonstrate understanding", 'Environmental and civic reading', resources.reading),
        entry('Writing', 'Persuasive/Informative Writing', "B9/JHS3.4.2.2 Write effective awareness and civic texts.", "B9/JHS3.4.2.2.1 Compose formal writing (business letters, email, minutes, programme agenda reports) on given topics using appropriate format", 'Civic and environmental writing', resources.writing),
        entry('Oral Language', 'Presentation', "B9/JHS3.1.2.1 Use persuasive oral language for advocacy.", "B9/JHS3.1.2.1.2 Initiate and participate in meaningful and collaborative discussions using texts and related materials, building on others’ ideas and expressing their own clearly and persuasively", 'Civic advocacy presentation', resources.oral),
      ]),
      week(8, 'Portfolio research and reference handling', [
        entry('Writing', 'Building and Presenting Knowledge', "B9/JHS3.4.3.1 Research to build and present knowledge.", "B9/JHS3.4.3.1.1 Conduct short research projects based on focused questions, and present key findings in writing", 'Source handling and referencing', resources.writing),
        entry('Reading', 'Research Reading', "B9/JHS3.2.1.1 Read and select credible sources.", "B9/JHS3.2.1.1.3 Evaluate ways that the media helps to disseminate information via different text types", 'Evaluating research sources', resources.reading),
        entry('Grammar Usage', 'Academic Vocabulary', "B9/JHS3.3.3.1 Use domain-specific and academic vocabulary appropriately.", "B9/JHS3.3.3.1.1 Interpret vocabulary appropriately in more complex texts", 'Academic vocabulary in project work', resources.grammar),
      ]),
      week(9, 'Independent reading and literary response', [
        entry('Reading', 'Independent Reading', "B9/JHS3.2.1.1 Sustain independent reading and analysis across complex texts.", "B9/JHS3.2.1.1.1 Read a variety of grade level texts and demonstrate understanding", 'Independent reading portfolio', resources.reading),
        entry('Literature', 'Response and Appreciation', "B9/JHS3.5.1.1 Connect literary understanding to personal reading.", "B9/JHS3.5.1.1.4 Use literary devices and imagery in texts", 'Literary response journal', resources.literature),
        entry('Writing', 'Reflective Writing', "B9/JHS3.4.2.1 Write sustained reflective responses on reading.", "B9/JHS3.4.2.1.2 Use different narrative techniques to manipulate time in a story", 'Independent reading reflection', resources.writing),
      ]),
      week(10, 'Revision of advanced grammar in authentic writing', [
        entry('Grammar Usage', 'Integrated Grammar Revision', "B9/JHS3.3.1.1 Apply advanced grammar choices accurately in communication.", "B9/JHS3.3.1.1.1 Use noun phrases accurately in context", 'Integrated grammar revision in context', resources.grammar),
        entry('Writing', 'Editing and Revision', "B9/JHS3.4.2.2 Improve substantial writing through revision.", "B9/JHS3.4.2.2.1 Compose formal writing (business letters, email, minutes, programme agenda reports) on given topics using appropriate format", 'Advanced editing workshop', resources.writing),
        entry('Reading', 'Model Analysis', "B9/JHS3.2.1.1 Read final models as support for revision.", "B9/JHS3.2.1.1.1 Read a variety of grade level texts and demonstrate understanding", 'Model analysis for revision', resources.reading),
      ]),
      week(11, 'Exam-style synthesis and response writing', [
        entry('Reading', 'Comprehension/Summary', "B9/JHS3.2.2.1 Analyse, compare and summarise complex texts.", "B9/JHS3.2.2.1.1 Analyse critically a given text in entirety and provide an objective summary", 'Exam-style synthesis and summary', resources.reading),
        entry('Writing', 'Analytical and Summary Writing', "B9/JHS3.4.3.1 Produce concise and well-supported responses.", "B9/JHS3.4.3.1.1 Conduct short research projects based on focused questions, and present key findings in writing", 'Timed analytical writing', resources.writing),
        entry('Oral Language', 'Reasoned Explanation', "B9/JHS3.1.2.1 Explain choices and reasoning clearly.", "B9/JHS3.1.2.1.2 Initiate and participate in meaningful and collaborative discussions using texts and related materials, building on others’ ideas and expressing their own clearly and persuasively", 'Reasoning aloud and peer feedback', resources.oral),
      ]),
      week(12, 'Final integrated English project and presentation', [
        entry('Writing', 'Integrated Final Task', "B9/JHS3.4.3.1 Apply English skills in a polished final task.", "B9/JHS3.4.3.1.1 Conduct short research projects based on focused questions, and present key findings in writing", 'Final integrated B9 English task', resources.writing),
        entry('Oral Language', 'Presentation', "B9/JHS3.1.2.1 Use mature oral communication in final defence and presentation.", "B9/JHS3.1.2.1.2 Initiate and participate in meaningful and collaborative discussions using texts and related materials, building on others’ ideas and expressing their own clearly and persuasively", 'Final oral presentation and defence', resources.oral),
        entry('Reading/Literature', 'Response and Appreciation', "B9/JHS3.2.1.1 Use reading and literature as support for final tasks.", "B9/JHS3.2.1.1.1 Read a variety of grade level texts and demonstrate understanding", 'Integrated reading/literature support', [...resources.reading, ...resources.literature]),
      ]),
    ],
  },
];
