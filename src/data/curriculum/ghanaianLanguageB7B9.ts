import type { ExplicitCurriculumTerm } from './mathematicsB7';
import type { SchemeWeek, SchemeWeekEntry } from '@/types/scheme';

const resources = {
  customs: ['Ghanaian Language textbook', 'Community elders', 'Picture cards', 'Culture notes'],
  oral: ['Prompt cards', 'Audio clips', 'Conversation guide', 'Teacher model'],
  reading: ['Short passages', 'Big book or reader', 'Question cards', 'Dictionary'],
  usage: ['Sentence cards', 'Grammar chart', 'Exercise book', 'Word bank'],
  writing: ['Exercise book', 'Writing frame', 'Model paragraphs', 'Peer checklist'],
  literature: ['Folktales', 'Songs', 'Poems', 'Drama excerpts'],
};

function entry(
  strand: string,
  subStrand: string,
  contentStandard: string,
  indicator: string,
  topic: string,
  extraResources: string[]
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

export const ghanaianLanguageB7Terms: ExplicitCurriculumTerm[] = [
  {
    subject: 'Ghanaian Language',
    classLevel: 'B7',
    term: 'Term 1',
    title: 'B7 Ghanaian Language Scheme of Work - Term 1',
    weeks: [
      week(1, 'Childhood rites and everyday introductions', [
        entry("Customs and Institutions", 'Rites of Passage: Childhood Rites', "B7.1.1.1 Rites of Passage: Childhood Rites", "B7.1.1.1.1 Identify the processes involved in naming a child.", 'Childhood rites in the local community', resources.customs),
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B7.2.1.1 Conversation/Everyday Discourse", "B7.2.1.1.1 Use appropriate register in everyday communication (informal and formal) with diverse partners on grade-level topics/ texts/issues.", 'Greetings and self-introduction in context', resources.oral),
        entry("Reading", 'Reading', "B7.3.1.1 Reading", "B7.3.1.1.1 Read and understand main ideas and supporting points in a range of texts on familiar and unfamiliar topics.", 'Reading a short cultural passage on childhood rites', resources.reading),
      ]),
      week(2, 'Naming systems and listening for detail', [
        entry("Customs and Institutions", 'Naming Systems: Day Names, Order of Birth Names', "B7.1.2.1 Naming Systems: Day Names, Order of Birth Names", "B7.1.2.1.1 State the names of the days of the week and relate their names to the days.", 'Day names and order-of-birth names', resources.customs),
        entry("Listening and Speaking", 'Listening Comprehension', "B7.2.1.1 Listening Comprehension", "B7.2.1.1.5 Use techniques (voice modulation and eye contact) for effective oral communication.", 'Listening to oral explanations about names', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B7.5.1.1 Structure and Organise Ideas in Composition Writing", "B7.5.1.1.2 Develop a three-paragraph essay using the features of a given text type.", 'Writing short sentences about personal names', resources.writing),
      ]),
      week(3, 'Clan identity and speech sounds', [
        entry("Customs and Institutions", 'The Clan System', "B7.1.3.1 The Clan System", "B7.1.3.1.2 Discuss the features of the clan system in relation to their community.", 'Clan identity and totems', resources.customs),
        entry("Listening and Speaking", 'Speech Sounds: Vowels, Consonants and Syllable', "B7.2.3.1 Speech Sounds: Vowels, Consonants and Syllable", "B7.2.3.1.2 Identify and produce the consonants in their language.", 'Pronouncing vowels, consonants and syllables', resources.oral),
        entry("Language and Usage", 'Sentences: Simple, Compound and Complex', "B7.4.1.1 Sentences: Simple, Compound and Complex", "B7.4.1.1.1 Discuss the components of sentences.", 'Building simple sentences from clan vocabulary', resources.usage),
      ]),
      week(4, 'Chieftaincy and reading with tone awareness', [
        entry("Customs and Institutions", 'Chieftaincy: Installation and Destoolment', "B7.1.4.1 Chieftaincy: Installation and Destoolment", "B7.1.4.1.4 Discuss and compare modern trends affecting the enstoolment/enskinement of chiefs and queenmothers.", 'Installation and destoolment of chiefs', resources.customs),
        entry("Listening and Speaking", 'Tone', "B7.2.4.1 Tone", "B7.2.4.1.1 Identify and produce the basic tones in their language.", 'Tone patterns in familiar expressions', resources.oral),
        entry("Reading", 'Translation', "B7.3.2.1 Translation", "B7.3.2.1.1 Translate words and phrases in his/her language.", 'Reading and translating simple cultural statements', resources.reading),
      ]),
      week(5, 'Vocabulary building from custom and institution texts', [
        entry("Listening and Speaking", 'Vocabulary Development', "B7.2.5.1 Vocabulary Development", "B7.2.5.1.1 Identify and produce words in the home and school environments and use them to form meaningful sentences.", 'Sight and content vocabulary from cultural topics', resources.oral),
        entry("Reading", 'Reading', "B7.3.1.1 Reading", "B7.3.1.1.1 Read and understand main ideas and supporting points in a range of texts on familiar and unfamiliar topics.", 'Reading for meaning in short custom-based texts', resources.reading),
        entry("Language and Usage", 'Integrating Grammar in Written Language (Nouns, Pronouns and Adjectives)', "B7.4.2.1 Integrating Grammar in Written Language (Nouns, Pronouns and Adjectives)", "B7.4.2.1.1 Categorise nouns under common, proper and collective and use them correctly in speech and in texts.", 'Nouns, pronouns and adjectives in context', resources.usage),
      ]),
      week(6, 'Presentation of everyday experiences', [
        entry("Listening and Speaking", 'Presentation: Everyday Experience', "B7.2.6.1 Presentation: Everyday Experience", "B7.2.6.1.1 Describe daily activities using appropriate register, structure and gestures for the contest being presented.", 'Presenting an everyday cultural experience', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B7.5.1.1 Structure and Organise Ideas in Composition Writing", "B7.5.1.1.1 Discuss the features of a paragraph.", 'Organising ideas into a short paragraph', resources.writing),
        entry("Literature", 'Folktales, Songs, Prose, Drama, Poetry', "B7.6.1.1 Folktales, Songs, Prose, Drama, Poetry", "B7.6.1.1.3 Discuss the components of written literature (prose, drama and poetry).", 'Listening to and retelling a simple folktale', resources.literature),
      ]),
      week(7, 'Reading and translation practice', [
        entry("Reading", 'Reading', "B7.3.1.1 Reading", "B7.3.1.1.1 Read and understand main ideas and supporting points in a range of texts on familiar and unfamiliar topics.", 'Reading a short narrative with fluency', resources.reading),
        entry("Reading", 'Translation', "B7.3.2.1 Translation", "B7.3.2.1.1 Translate words and phrases in his/her language.", 'Translating familiar sentences from and into the language', resources.reading),
        entry("Language and Usage", 'Vocabulary, Spelling and Punctuation', "B7.4.4.1 Vocabulary, Spelling and Punctuation", "B7.4.4.1.3 Identify and use punctuations appropriately and correctly in writing.", 'Basic spelling and punctuation in context', resources.usage),
      ]),
      week(8, 'Sentence variety in speaking and writing', [
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B7.2.1.1 Conversation/Everyday Discourse", "B7.2.1.1.5 Use techniques (voice modulation and eye contact) for effective oral communication.", 'Speaking in complete sentences during discussion', resources.oral),
        entry("Language and Usage", 'Sentences: Simple, Compound and Complex', "B7.4.1.1 Sentences: Simple, Compound and Complex", "B7.4.1.1.2 Discuss the types of sentence structure (simple, compound and complex).", 'Simple and compound sentence construction', resources.usage),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B7.5.1.1 Structure and Organise Ideas in Composition Writing", "B7.5.1.1.2 Develop a three-paragraph essay using the features of a given text type.", 'Writing short descriptions with sentence variety', resources.writing),
      ]),
      week(9, 'Grammar in meaningful contexts', [
        entry("Reading", 'Reading', "B7.3.1.1 Reading", "B7.3.1.1.1 Read and understand main ideas and supporting points in a range of texts on familiar and unfamiliar topics.", 'Reading model sentences and short paragraphs', resources.reading),
        entry("Language and Usage", 'Integrating Grammar in Written Language (Verbs, Adverbs, Conjunctions, Postpositions/Prepositions)', "B7.4.3.1 Integrating Grammar in Written Language (Verbs, Adverbs, Conjunctions, Postpositions/Prepositions)", "B7.4.3.1.4 Explore the use of postpositions/prepositions appropriately and correctly in a range of texts.", 'Verbs, adverbs, conjunctions and postpositions/prepositions', resources.usage),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B7.5.1.1 Structure and Organise Ideas in Composition Writing", "B7.5.1.1.2 Develop a three-paragraph essay using the features of a given text type.", 'Writing about family or school routines', resources.writing),
      ]),
      week(10, 'Songs, poems and expressive language', [
        entry("Listening and Speaking", 'Presentation: Everyday Experience', "B7.2.6.1 Presentation: Everyday Experience", "B7.2.6.1.1 Describe daily activities using appropriate register, structure and gestures for the contest being presented.", 'Oral performance of short cultural pieces', resources.oral),
        entry("Literature", 'Folktales, Songs, Prose, Drama, Poetry', "B7.6.1.1 Folktales, Songs, Prose, Drama, Poetry", "B7.6.1.1.3 Discuss the components of written literature (prose, drama and poetry).", 'Songs and poems in Ghanaian Language', resources.literature),
        entry("Language and Usage", 'Vocabulary Development', "B7.4.4.1 Vocabulary Development", "B7.4.4.1.1 Use vocabulary appropriately and correctly in writing.", 'Expressive vocabulary from songs and poems', resources.usage),
      ]),
      week(11, 'Folktales and guided composition', [
        entry("Reading", 'Reading', "B7.3.1.1 Reading", "B7.3.1.1.1 Read and understand main ideas and supporting points in a range of texts on familiar and unfamiliar topics.", 'Reading or listening to folktales for meaning', resources.reading),
        entry("Literature", 'Folktales, Songs, Prose, Drama, Poetry', "B7.6.1.1 Folktales, Songs, Prose, Drama, Poetry", "B7.6.1.1.3 Discuss the components of written literature (prose, drama and poetry).", 'Folktale appreciation and moral lessons', resources.literature),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B7.5.1.1 Structure and Organise Ideas in Composition Writing", "B7.5.1.1.2 Develop a three-paragraph essay using the features of a given text type.", 'Writing a guided retelling of a folktale', resources.writing),
      ]),
      week(12, 'Integrated cultural language project', [
        entry("Customs and Institutions", 'Review of Customs and Institutions', "B7.1.1.1 Review of Customs and Institutions", "B7.1.1.1.1 Identify the processes involved in naming a child.", 'Review of B7 customs and institution themes', resources.customs),
        entry("Listening and Speaking", 'Presentation: Everyday Experience', "B7.2.6.1 Presentation: Everyday Experience", "B7.2.6.1.1 Describe daily activities using appropriate register, structure and gestures for the contest being presented.", 'Group presentation on a cultural topic', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B7.5.1.1 Structure and Organise Ideas in Composition Writing", "B7.5.1.1.2 Develop a three-paragraph essay using the features of a given text type.", 'Final short composition on a cultural theme', resources.writing),
      ]),
    ],
  },
  {
    subject: 'Ghanaian Language',
    classLevel: 'B7',
    term: 'Term 2',
    title: 'B7 Ghanaian Language Scheme of Work - Term 2',
    weeks: [
      week(1, 'Conversational routines and paragraph structure', [
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B7.2.1.1 Conversation/Everyday Discourse", "B7.2.1.1.1 Use appropriate register in everyday communication (informal and formal) with diverse partners on grade-level topics/ texts/issues.", 'Conversational routines in school and community', resources.oral),
        entry("Language and Usage", 'Sentences: Simple, Compound and Complex', "B7.4.1.1 Sentences: Simple, Compound and Complex", "B7.4.1.1.2 Discuss the types of sentence structure (simple, compound and complex).", 'Combining ideas into compound sentences', resources.usage),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B7.5.1.1 Structure and Organise Ideas in Composition Writing", "B7.5.1.1.2 Develop a three-paragraph essay using the features of a given text type.", 'Topic sentence and supporting details', resources.writing),
      ]),
      week(2, 'Listening and descriptive writing', [
        entry("Listening and Speaking", 'Listening Comprehension', "B7.2.1.1 Listening Comprehension", "B7.2.1.1.5 Use techniques (voice modulation and eye contact) for effective oral communication.", 'Listening to a short account and sequencing details', resources.oral),
        entry("Reading", 'Reading', "B7.3.1.1 Reading", "B7.3.1.1.2 Read to understand and summarise the main ideas in a given grade level passage.", 'Reading descriptive passages', resources.reading),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B7.5.1.1 Structure and Organise Ideas in Composition Writing", "B7.5.1.1.2 Develop a three-paragraph essay using the features of a given text type.", 'Descriptive writing on people and places', resources.writing),
      ]),
      week(3, 'Sound patterns and translation practice', [
        entry("Listening and Speaking", 'Speech Sounds: Vowels, Consonants and Syllable', "B7.2.3.1 Speech Sounds: Vowels, Consonants and Syllable", "B7.2.3.1.2 Identify and produce the consonants in their language.", 'Review of sound patterns in words and phrases', resources.oral),
        entry("Reading", 'Translation', "B7.3.2.1 Translation", "B7.3.2.1.1 Translate words and phrases in his/her language.", 'Word and sentence translation practice', resources.reading),
        entry("Language and Usage", 'Vocabulary, Spelling and Punctuation', "B7.4.4.1 Vocabulary, Spelling and Punctuation", "B7.4.4.1.3 Identify and use punctuations appropriately and correctly in writing.", 'Spelling patterns and punctuation review', resources.usage),
      ]),
      week(4, 'Tone and oral presentation', [
        entry("Listening and Speaking", 'Tone', "B7.2.4.1 Tone", "B7.2.4.1.1 Identify and produce the basic tones in their language.", 'Tone in statements and questions', resources.oral),
        entry("Listening and Speaking", 'Presentation: Everyday Experience', "B7.2.6.1 Presentation: Everyday Experience", "B7.2.6.1.1 Describe daily activities using appropriate register, structure and gestures for the contest being presented.", 'Short prepared oral presentations', resources.oral),
        entry("Literature", 'Songs, Prose and Poetry', "B7.6.1.1 Songs, Prose and Poetry", "B7.6.1.1.3 Discuss the components of written literature (prose, drama and poetry).", 'Using oral pieces to practise tone', resources.literature),
      ]),
      week(5, 'Reading fluency and grammar choices', [
        entry("Reading", 'Reading', "B7.3.1.1 Reading", "B7.3.1.1.1 Read and understand main ideas and supporting points in a range of texts on familiar and unfamiliar topics.", 'Guided reading for fluency', resources.reading),
        entry("Language and Usage", 'Integrating Grammar in Written Language (Nouns, Pronouns and Adjectives)', "B7.4.2.1 Integrating Grammar in Written Language (Nouns, Pronouns and Adjectives)", "B7.4.2.1.1 Categorise nouns under common, proper and collective and use them correctly in speech and in texts.", 'Expanding noun and adjective use', resources.usage),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B7.5.1.1 Structure and Organise Ideas in Composition Writing", "B7.5.1.1.2 Develop a three-paragraph essay using the features of a given text type.", 'Sentence expansion in short writing', resources.writing),
      ]),
      week(6, 'Drama and dialogue writing', [
        entry("Literature", 'Drama', "B7.6.1.1 Drama", "B7.6.1.1.3 Discuss the components of written literature (prose, drama and poetry).", 'Simple dialogue and role play', resources.literature),
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B7.2.1.1 Conversation/Everyday Discourse", "B7.2.1.1.5 Use techniques (voice modulation and eye contact) for effective oral communication.", 'Turn-taking and respectful speaking', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B7.5.1.1 Structure and Organise Ideas in Composition Writing", "B7.5.1.1.2 Develop a three-paragraph essay using the features of a given text type.", 'Writing short dialogue exchanges', resources.writing),
      ]),
      week(7, 'Cultural reading and vocabulary growth', [
        entry("Customs and Institutions", 'Review of Naming and Clan Systems', "B7.1.3.1 Review of Naming and Clan Systems", "B7.1.3.1.1 Describe the clan system and state some clans in their ethnic community.", 'Language of kinship and identity', resources.customs),
        entry("Reading", 'Reading', "B7.3.1.1 Reading", "B7.3.1.1.1 Read and understand main ideas and supporting points in a range of texts on familiar and unfamiliar topics.", 'Reading informational cultural texts', resources.reading),
        entry("Listening and Speaking", 'Vocabulary Development', "B7.2.5.1 Vocabulary Development", "B7.2.5.1.1 Identify and produce words in the home and school environments and use them to form meaningful sentences.", 'Cultural and content vocabulary', resources.oral),
      ]),
      week(8, 'Prose comprehension and organised retelling', [
        entry("Literature", 'Prose', "B7.6.1.1 Prose", "B7.6.1.1.3 Discuss the components of written literature (prose, drama and poetry).", 'Short prose comprehension', resources.literature),
        entry("Reading", 'Reading', "B7.3.1.1 Reading", "B7.3.1.1.1 Read and understand main ideas and supporting points in a range of texts on familiar and unfamiliar topics.", 'Answering comprehension questions from prose', resources.reading),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B7.5.1.1 Structure and Organise Ideas in Composition Writing", "B7.5.1.1.2 Develop a three-paragraph essay using the features of a given text type.", 'Retelling a prose story', resources.writing),
      ]),
      week(9, 'Grammar integration in real-life writing', [
        entry("Language and Usage", 'Integrating Grammar in Written Language (Verbs, Adverbs, Conjunctions, Postpositions/Prepositions)', "B7.4.3.1 Integrating Grammar in Written Language (Verbs, Adverbs, Conjunctions, Postpositions/Prepositions)", "B7.4.3.1.4 Explore the use of postpositions/prepositions appropriately and correctly in a range of texts.", 'Editing grammar in short paragraphs', resources.usage),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B7.5.1.1 Structure and Organise Ideas in Composition Writing", "B7.5.1.1.2 Develop a three-paragraph essay using the features of a given text type.", 'Writing about a school event', resources.writing),
        entry("Listening and Speaking", 'Listening Comprehension', "B7.2.1.1 Listening Comprehension", "B7.2.1.1.3 Use appropriate language orally to describe experiences about oneself and others.", 'Listening for grammatical accuracy in model sentences', resources.oral),
      ]),
      week(10, 'Poetry and expressive performance', [
        entry("Literature", 'Poetry', "B7.6.1.1 Poetry", "B7.6.1.1.3 Discuss the components of written literature (prose, drama and poetry).", 'Short poems and chant-like texts', resources.literature),
        entry("Listening and Speaking", 'Presentation: Everyday Experience', "B7.2.6.1 Presentation: Everyday Experience", "B7.2.6.1.1 Describe daily activities using appropriate register, structure and gestures for the contest being presented.", 'Expressive oral delivery', resources.oral),
        entry("Language and Usage", 'Vocabulary Development', "B7.4.4.1 Vocabulary Development", "B7.4.4.1.1 Use vocabulary appropriately and correctly in writing.", 'Imagery and expressive vocabulary', resources.usage),
      ]),
      week(11, 'Composition workshop and peer response', [
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B7.5.1.1 Structure and Organise Ideas in Composition Writing", "B7.5.1.1.2 Develop a three-paragraph essay using the features of a given text type.", 'Planning, drafting and revising short composition', resources.writing),
        entry("Reading", 'Reading', "B7.3.1.1 Reading", "B7.3.1.1.1 Read and understand main ideas and supporting points in a range of texts on familiar and unfamiliar topics.", 'Reading peer models and checklists', resources.reading),
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B7.2.1.1 Conversation/Everyday Discourse", "B7.2.1.1.5 Use techniques (voice modulation and eye contact) for effective oral communication.", 'Giving oral feedback respectfully', resources.oral),
      ]),
      week(12, 'Integrated language and literature showcase', [
        entry("Listening and Speaking", 'Presentation: Everyday Experience', "B7.2.6.1 Presentation: Everyday Experience", "B7.2.6.1.1 Describe daily activities using appropriate register, structure and gestures for the contest being presented.", 'Showcase oral presentation', resources.oral),
        entry("Literature", 'Folktales, Songs, Prose, Drama, Poetry', "B7.6.1.1 Folktales, Songs, Prose, Drama, Poetry", "B7.6.1.1.3 Discuss the components of written literature (prose, drama and poetry).", 'Term literature showcase', resources.literature),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B7.5.1.1 Structure and Organise Ideas in Composition Writing", "B7.5.1.1.2 Develop a three-paragraph essay using the features of a given text type.", 'Final polished composition', resources.writing),
      ]),
    ],
  },
  {
    subject: 'Ghanaian Language',
    classLevel: 'B7',
    term: 'Term 3',
    title: 'B7 Ghanaian Language Scheme of Work - Term 3',
    weeks: [
      week(1, 'Review of cultural themes through oral discussion', [
        entry("Customs and Institutions", 'Review of Childhood Rites, Names and Chieftaincy', "B7.1.4.1 Review of Childhood Rites, Names and Chieftaincy", "B7.1.4.1.4 Discuss and compare modern trends affecting the enstoolment/enskinement of chiefs and queenmothers.", 'Review of key B7 cultural topics', resources.customs),
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B7.2.1.1 Conversation/Everyday Discourse", "B7.2.1.1.5 Use techniques (voice modulation and eye contact) for effective oral communication.", 'Structured oral discussion on cultural values', resources.oral),
        entry("Reading", 'Reading', "B7.3.1.1 Reading", "B7.3.1.1.1 Read and understand main ideas and supporting points in a range of texts on familiar and unfamiliar topics.", 'Reading a review passage on customs', resources.reading),
      ]),
      week(2, 'Listening, note-making and simple reports', [
        entry("Listening and Speaking", 'Listening Comprehension', "B7.2.1.1 Listening Comprehension", "B7.2.1.1.5 Use techniques (voice modulation and eye contact) for effective oral communication.", 'Listening to a short oral report', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B7.5.1.1 Structure and Organise Ideas in Composition Writing", "B7.5.1.1.2 Develop a three-paragraph essay using the features of a given text type.", 'Turning notes into a short report', resources.writing),
        entry("Language and Usage", 'Vocabulary, Spelling and Punctuation', "B7.4.4.1 Vocabulary, Spelling and Punctuation", "B7.4.4.1.1 Use vocabulary appropriately and correctly in writing.", 'Editing report writing conventions', resources.usage),
      ]),
      week(3, 'Fluency, translation and sentence control', [
        entry("Reading", 'Reading', "B7.3.1.1 Reading", "B7.3.1.1.1 Read and understand main ideas and supporting points in a range of texts on familiar and unfamiliar topics.", 'Reading aloud with fluency', resources.reading),
        entry("Reading", 'Translation', "B7.3.2.1 Translation", "B7.3.2.1.1 Translate words and phrases in his/her language.", 'Translation of practical sentences', resources.reading),
        entry("Language and Usage", 'Sentences: Simple, Compound and Complex', "B7.4.1.1 Sentences: Simple, Compound and Complex", "B7.4.1.1.2 Discuss the types of sentence structure (simple, compound and complex).", 'Review of sentence patterns', resources.usage),
      ]),
      week(4, 'Storytelling and sequence in writing', [
        entry("Literature", 'Folktales', "B7.6.1.1 Folktales", "B7.6.1.1.2 Discuss the components of oral literature (folktales and songs-lullabies and play songs).", 'Oral storytelling and sequence', resources.literature),
        entry("Listening and Speaking", 'Presentation: Everyday Experience', "B7.2.6.1 Presentation: Everyday Experience", "B7.2.6.1.1 Describe daily activities using appropriate register, structure and gestures for the contest being presented.", 'Storytelling techniques', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B7.5.1.1 Structure and Organise Ideas in Composition Writing", "B7.5.1.1.2 Develop a three-paragraph essay using the features of a given text type.", 'Writing a short narrative sequence', resources.writing),
      ]),
      week(5, 'Songs, rhythm and vocabulary retention', [
        entry("Literature", 'Songs', "B7.6.1.1 Songs", "B7.6.1.1.1 Discuss the components of literature.", 'Traditional and school songs', resources.literature),
        entry("Listening and Speaking", 'Speech Sounds and Tone', "B7.2.3.1 Speech Sounds and Tone", "B7.2.3.1.2 Identify and produce the consonants in their language.", 'Rhythm, pronunciation and tone in songs', resources.oral),
        entry("Language and Usage", 'Vocabulary Development', "B7.4.4.1 Vocabulary Development", "B7.4.4.1.1 Use vocabulary appropriately and correctly in writing.", 'Vocabulary retention through songs', resources.usage),
      ]),
      week(6, 'Reading comprehension and grammar editing', [
        entry("Reading", 'Reading', "B7.3.1.1 Reading", "B7.3.1.1.2 Read to understand and summarise the main ideas in a given grade level passage.", 'Short comprehension passages', resources.reading),
        entry("Language and Usage", 'Integrating Grammar in Written Language', "B7.4.2.1 Integrating Grammar in Written Language", "B7.4.2.1.1 Categorise nouns under common, proper and collective and use them correctly in speech and in texts.", 'Editing grammar in comprehension responses', resources.usage),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B7.5.1.1 Structure and Organise Ideas in Composition Writing", "B7.5.1.1.2 Develop a three-paragraph essay using the features of a given text type.", 'Writing clear responses from reading', resources.writing),
      ]),
      week(7, 'Poetry response and expressive writing', [
        entry("Literature", 'Poetry', "B7.6.1.1 Poetry", "B7.6.1.1.3 Discuss the components of written literature (prose, drama and poetry).", 'Understanding imagery and message in simple poems', resources.literature),
        entry("Listening and Speaking", 'Presentation: Everyday Experience', "B7.2.6.1 Presentation: Everyday Experience", "B7.2.6.1.1 Describe daily activities using appropriate register, structure and gestures for the contest being presented.", 'Poetry recital and response', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B7.5.1.1 Structure and Organise Ideas in Composition Writing", "B7.5.1.1.2 Develop a three-paragraph essay using the features of a given text type.", 'Writing personal response to a poem', resources.writing),
      ]),
      week(8, 'Conversation and cultural problem solving', [
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B7.2.1.1 Conversation/Everyday Discourse", "B7.2.1.1.1 Use appropriate register in everyday communication (informal and formal) with diverse partners on grade-level topics/ texts/issues.", 'Role-play on family and community issues', resources.oral),
        entry("Customs and Institutions", 'Customs and Institutions Review', "B7.1.1.1 Customs and Institutions Review", "B7.1.1.1.1 Identify the processes involved in naming a child.", 'Applying cultural values to community issues', resources.customs),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B7.5.1.1 Structure and Organise Ideas in Composition Writing", "B7.5.1.1.2 Develop a three-paragraph essay using the features of a given text type.", 'Writing advice based on cultural values', resources.writing),
      ]),
      week(9, 'Drama and collaborative language use', [
        entry("Literature", 'Drama', "B7.6.1.1 Drama", "B7.6.1.1.3 Discuss the components of written literature (prose, drama and poetry).", 'Simple dramatic performance', resources.literature),
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B7.2.1.1 Conversation/Everyday Discourse", "B7.2.1.1.5 Use techniques (voice modulation and eye contact) for effective oral communication.", 'Collaboration and turn-taking in drama', resources.oral),
        entry("Reading", 'Reading', "B7.3.1.1 Reading", "B7.3.1.1.1 Read and understand main ideas and supporting points in a range of texts on familiar and unfamiliar topics.", 'Reading short dramatic scripts', resources.reading),
      ]),
      week(10, 'Composition improvement week', [
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B7.5.1.1 Structure and Organise Ideas in Composition Writing", "B7.5.1.1.2 Develop a three-paragraph essay using the features of a given text type.", 'Drafting, revising and editing composition', resources.writing),
        entry("Language and Usage", 'Vocabulary, Spelling and Punctuation', "B7.4.4.1 Vocabulary, Spelling and Punctuation", "B7.4.4.1.1 Use vocabulary appropriately and correctly in writing.", 'Editing for correctness and clarity', resources.usage),
        entry("Listening and Speaking", 'Listening Comprehension', "B7.2.1.1 Listening Comprehension", "B7.2.1.1.5 Use techniques (voice modulation and eye contact) for effective oral communication.", 'Listening to model compositions', resources.oral),
      ]),
      week(11, 'Integrated reading and literature reflection', [
        entry("Reading", 'Reading', "B7.3.1.1 Reading", "B7.3.1.1.1 Read and understand main ideas and supporting points in a range of texts on familiar and unfamiliar topics.", 'Reading chosen term-end texts', resources.reading),
        entry("Literature", 'Folktales, Songs, Prose, Drama, Poetry', "B7.6.1.1 Folktales, Songs, Prose, Drama, Poetry", "B7.6.1.1.3 Discuss the components of written literature (prose, drama and poetry).", 'Reflecting on literary forms studied', resources.literature),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B7.5.1.1 Structure and Organise Ideas in Composition Writing", "B7.5.1.1.2 Develop a three-paragraph essay using the features of a given text type.", 'Reflective writing on favourite texts', resources.writing),
      ]),
      week(12, 'End-of-year language showcase', [
        entry("Listening and Speaking", 'Presentation: Everyday Experience', "B7.2.6.1 Presentation: Everyday Experience", "B7.2.6.1.1 Describe daily activities using appropriate register, structure and gestures for the contest being presented.", 'Year-end oral showcase', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B7.5.1.1 Structure and Organise Ideas in Composition Writing", "B7.5.1.1.2 Develop a three-paragraph essay using the features of a given text type.", 'Best-work writing portfolio selection', resources.writing),
        entry("Literature", 'Folktales, Songs, Prose, Drama, Poetry', "B7.6.1.1 Folktales, Songs, Prose, Drama, Poetry", "B7.6.1.1.3 Discuss the components of written literature (prose, drama and poetry).", 'Performance and appreciation showcase', resources.literature),
      ]),
    ],
  },
];

export const ghanaianLanguageB8Terms: ExplicitCurriculumTerm[] = [
  {
    subject: 'Ghanaian Language',
    classLevel: 'B8',
    term: 'Term 1',
    title: 'B8 Ghanaian Language Scheme of Work - Term 1',
    weeks: [
      week(1, 'Puberty rites and oral interaction', [
        entry("Customs and Institutions", 'Rites of Passage: Puberty Rites', "B8.1.1.1 Rites of Passage: Puberty Rites", "B8.1.1.1.1 Identify the processes involved in performing puberty rites in your culture.", 'Puberty rites and their social meaning', resources.customs),
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B8.2.2.1 Conversation/Everyday Discourse", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Discussing puberty rites respectfully', resources.oral),
        entry("Reading", 'Reading', "B8.3.1.1 Reading", "B8.3.1.1.2 Summarise long passages read.", 'Reading cultural passages on puberty rites', resources.reading),
      ]),
      week(2, 'Naming systems and listening comprehension', [
        entry("Customs and Institutions", 'Naming Systems: Family Names, Kinship Terms, Proverbial and Insinuation Names', "B8.1.2.1 Naming Systems: Family Names, Kinship Terms, Proverbial and Insinuation Names", "B8.1.2.1.4 Discuss proverbial and insinuation names.", 'Family names and kinship terms', resources.customs),
        entry("Listening and Speaking", 'Listening Comprehension', "B8.2.2.1 Listening Comprehension", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Listening to oral examples of naming practices', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Writing about kinship and family names', resources.writing),
      ]),
      week(3, 'Proverbial names and vocabulary development', [
        entry("Customs and Institutions", 'Naming Systems', "B8.1.2.1 Naming Systems", "B8.1.2.1.4 Discuss proverbial and insinuation names.", 'Proverbial and insinuation names', resources.customs),
        entry("Listening and Speaking", 'Vocabulary Development', "B8.2.2.1 Vocabulary Development", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Kinship and proverbial vocabulary', resources.oral),
        entry("Literature", 'Proverbs and Idioms', "B8.6.1.1 Proverbs and Idioms", "B8.6.1.1.1 Discuss the features of proverbs and idioms.", 'Proverbial expressions connected to names', resources.literature),
      ]),
      week(4, 'Clan system and reading for meaning', [
        entry("Customs and Institutions", 'The Clan System', "B8.1.3.1 The Clan System", "B8.1.3.1.1 Discuss the importance and threats to the clan system.", 'Clan relationships and obligations', resources.customs),
        entry("Reading", 'Reading', "B8.3.1.1 Reading", "B8.3.1.1.1 Understand the main ideas and supporting points in a range of extended texts on familiar and unfamiliar topics.", 'Reading informational texts on clan systems', resources.reading),
        entry("Language and Usage", 'Integrating Grammar in Written Language (Use of Nouns, Pronouns and Adjectives)', "B8.4.2.1 Integrating Grammar in Written Language (Use of Nouns, Pronouns and Adjectives)", "B8.4.2.1.1 Explore the use of nouns and pronouns in an increasing range of texts and classify them.", 'Using descriptive grammar in clan descriptions', resources.usage),
      ]),
      week(5, 'Chieftaincy and oral presentation', [
        entry("Customs and Institutions", 'Chieftaincy: Destoolment', "B8.1.4.1 Chieftaincy: Destoolment", "B8.1.4.1.1 Examine some behaviours that can lead to the destoolment/deskinment of chiefs and queenmothers.", 'Destoolment and accountability in leadership', resources.customs),
        entry("Listening and Speaking", 'Presentation: Everyday Experience', "B8.2.2.1 Presentation: Everyday Experience", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Short talks on leadership and responsibility', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Writing a short account of a leadership issue', resources.writing),
      ]),
      week(6, 'Conversation and practical reading', [
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B8.2.2.1 Conversation/Everyday Discourse", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Conversing on community and school issues', resources.oral),
        entry("Reading", 'Reading', "B8.3.1.1 Reading", "B8.3.1.1.2 Summarise long passages read.", 'Short practical reading passages', resources.reading),
        entry("Language and Usage", 'Vocabulary, Spelling and Punctuation', "B8.4.2.1 Vocabulary, Spelling and Punctuation", "B8.4.2.1.1 Explore the use of nouns and pronouns in an increasing range of texts and classify them.", 'Editing everyday language texts', resources.usage),
      ]),
      week(7, 'Listening, tone and message delivery', [
        entry("Listening and Speaking", 'Listening Comprehension', "B8.2.2.1 Listening Comprehension", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Listening to oral instructions and stories', resources.oral),
        entry("Listening and Speaking", 'Tone', "B8.2.2.1 Tone", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Tone in oral messages and storytelling', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Summarising oral information in writing', resources.writing),
      ]),
      week(8, 'Translation and grammar integration', [
        entry("Reading", 'Translation', "B8.3.2.1 Translation", "B8.3.2.1.1 Establish the meaning of words, phrases and sentences in their various languages.", 'Translation of connected statements', resources.reading),
        entry("Language and Usage", 'Integrating Grammar in Written Language (Verbs, Adverbs, Conjunctions)', "B8.4.3.1 Integrating Grammar in Written Language (Verbs, Adverbs, Conjunctions)", "B8.4.3.1.2 Identify and use adverbs appropriately in sentences.", 'Verbs, adverbs and conjunctions in connected writing', resources.usage),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Writing connected paragraphs from translation tasks', resources.writing),
      ]),
      week(9, 'Proverbs, idioms and oral expression', [
        entry("Literature", 'Proverbs and Idioms', "B8.6.1.1 Proverbs and Idioms", "B8.6.1.1.1 Discuss the features of proverbs and idioms.", 'Meaning and use of common proverbs and idioms', resources.literature),
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B8.2.2.1 Conversation/Everyday Discourse", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Using proverbs appropriately in speech', resources.oral),
        entry("Reading", 'Reading', "B8.3.1.1 Reading", "B8.3.1.1.1 Understand the main ideas and supporting points in a range of extended texts on familiar and unfamiliar topics.", 'Reading short texts rich in idiomatic language', resources.reading),
      ]),
      week(10, 'Prose and composition writing', [
        entry("Literature", 'Prose', "B8.6.1.2 Prose", "B8.6.1.2.1 Discuss how writers use language to create effect in prose, poetry and drama.", 'Understanding a short prose passage', resources.literature),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Narrative and descriptive paragraph writing', resources.writing),
        entry("Language and Usage", 'Integrating Grammar in Written Language', "B8.4.2.1 Integrating Grammar in Written Language", "B8.4.2.1.1 Explore the use of nouns and pronouns in an increasing range of texts and classify them.", 'Grammar choices in prose response writing', resources.usage),
      ]),
      week(11, 'Drama, poetry and performance', [
        entry("Literature", 'Drama and Poetry', "B8.6.1.2 Drama and Poetry", "B8.6.1.2.1 Discuss how writers use language to create effect in prose, poetry and drama.", 'Simple performance pieces in Ghanaian Language', resources.literature),
        entry("Listening and Speaking", 'Presentation: Everyday Experience', "B8.2.2.1 Presentation: Everyday Experience", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Performance with confidence and clear diction', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Writing a short dramatic or poetic response', resources.writing),
      ]),
      week(12, 'Integrated term review', [
        entry("Customs and Institutions", 'Review of Customs and Institutions', "B8.1.4.1 Review of Customs and Institutions", "B8.1.4.1.1 Examine some behaviours that can lead to the destoolment/deskinment of chiefs and queenmothers.", 'Review of puberty rites, names, clan and chieftaincy', resources.customs),
        entry("Listening and Speaking", 'Presentation: Everyday Experience', "B8.2.2.1 Presentation: Everyday Experience", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Term review presentation', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Final term composition', resources.writing),
      ]),
    ],
  },
  {
    subject: 'Ghanaian Language',
    classLevel: 'B8',
    term: 'Term 2',
    title: 'B8 Ghanaian Language Scheme of Work - Term 2',
    weeks: [
      week(1, 'Oral interaction and composition planning', [
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B8.2.2.1 Conversation/Everyday Discourse", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Extended conversation on familiar themes', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Planning and outlining compositions', resources.writing),
        entry("Language and Usage", 'Integrating Grammar in Written Language', "B8.4.2.1 Integrating Grammar in Written Language", "B8.4.2.1.1 Explore the use of nouns and pronouns in an increasing range of texts and classify them.", 'Sentence control in composition plans', resources.usage),
      ]),
      week(2, 'Listening and summary writing', [
        entry("Listening and Speaking", 'Listening Comprehension', "B8.2.2.1 Listening Comprehension", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Listening to oral narratives and explanations', resources.oral),
        entry("Reading", 'Reading', "B8.3.1.1 Reading", "B8.3.1.1.2 Summarise long passages read.", 'Reading related passages for comparison', resources.reading),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Writing short summaries', resources.writing),
      ]),
      week(3, 'Tone, fluency and oral performance', [
        entry("Listening and Speaking", 'Tone', "B8.2.2.1 Tone", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Using tone in reading and speaking', resources.oral),
        entry("Listening and Speaking", 'Presentation: Everyday Experience', "B8.2.2.1 Presentation: Everyday Experience", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Prepared oral performance', resources.oral),
        entry("Literature", 'Poetry', "B8.6.1.2 Poetry", "B8.6.1.2.1 Discuss how writers use language to create effect in prose, poetry and drama.", 'Performance of short poetic pieces', resources.literature),
      ]),
      week(4, 'Reading and translation workshop', [
        entry("Reading", 'Reading', "B8.3.1.1 Reading", "B8.3.1.1.1 Understand the main ideas and supporting points in a range of extended texts on familiar and unfamiliar topics.", 'Fluent reading of connected texts', resources.reading),
        entry("Reading", 'Translation', "B8.3.2.1 Translation", "B8.3.2.1.1 Establish the meaning of words, phrases and sentences in their various languages.", 'Paragraph-level translation practice', resources.reading),
        entry("Language and Usage", 'Vocabulary, Spelling and Punctuation', "B8.4.2.1 Vocabulary, Spelling and Punctuation", "B8.4.2.1.1 Explore the use of nouns and pronouns in an increasing range of texts and classify them.", 'Editing translated texts', resources.usage),
      ]),
      week(5, 'Grammar in authentic contexts', [
        entry("Language and Usage", 'Integrating Grammar in Written Language (Use of Nouns, Pronouns and Adjectives)', "B8.4.2.1 Integrating Grammar in Written Language (Use of Nouns, Pronouns and Adjectives)", "B8.4.2.1.1 Explore the use of nouns and pronouns in an increasing range of texts and classify them.", 'Precision in descriptive language', resources.usage),
        entry("Language and Usage", 'Integrating Grammar in Written Language (Verbs, Adverbs, Conjunctions)', "B8.4.3.1 Integrating Grammar in Written Language (Verbs, Adverbs, Conjunctions)", "B8.4.3.1.2 Identify and use adverbs appropriately in sentences.", 'Verb and connector choice in narrative flow', resources.usage),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Improving paragraph cohesion', resources.writing),
      ]),
      week(6, 'Proverbs and moral discussion', [
        entry("Literature", 'Proverbs and Idioms', "B8.6.1.1 Proverbs and Idioms", "B8.6.1.1.1 Discuss the features of proverbs and idioms.", 'Moral and social meanings in proverbs', resources.literature),
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B8.2.2.1 Conversation/Everyday Discourse", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Discussing values using proverbs', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Writing a short reflection from a proverb', resources.writing),
      ]),
      week(7, 'Idioms and contextual reading', [
        entry("Literature", 'Proverbs and Idioms', "B8.6.1.1 Proverbs and Idioms", "B8.6.1.1.1 Discuss the features of proverbs and idioms.", 'Idioms in context', resources.literature),
        entry("Reading", 'Reading', "B8.3.1.1 Reading", "B8.3.1.1.2 Summarise long passages read.", 'Short passages with figurative language', resources.reading),
        entry("Language and Usage", 'Vocabulary Development', "B8.4.2.1 Vocabulary Development", "B8.4.2.1.1 Explore the use of nouns and pronouns in an increasing range of texts and classify them.", 'Context vocabulary from figurative texts', resources.usage),
      ]),
      week(8, 'Prose response and organised retelling', [
        entry("Literature", 'Prose', "B8.6.1.2 Prose", "B8.6.1.2.1 Discuss how writers use language to create effect in prose, poetry and drama.", 'Reading and discussing prose', resources.literature),
        entry("Reading", 'Reading', "B8.3.1.1 Reading", "B8.3.1.1.1 Understand the main ideas and supporting points in a range of extended texts on familiar and unfamiliar topics.", 'Comprehension response to prose', resources.reading),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Retelling prose in logical order', resources.writing),
      ]),
      week(9, 'Drama dialogue and collaborative speaking', [
        entry("Literature", 'Drama', "B8.6.1.1 Drama", "B8.6.1.1.1 Discuss the features of proverbs and idioms.", 'Short scenes and role-play', resources.literature),
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B8.2.2.1 Conversation/Everyday Discourse", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Dialogue for dramatic situations', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Script-writing basics', resources.writing),
      ]),
      week(10, 'Poetry, imagery and expression', [
        entry("Literature", 'Poetry', "B8.6.1.2 Poetry", "B8.6.1.2.1 Discuss how writers use language to create effect in prose, poetry and drama.", 'Imagery and message in poems', resources.literature),
        entry("Listening and Speaking", 'Presentation: Everyday Experience', "B8.2.2.1 Presentation: Everyday Experience", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Poetry recital', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Short poetic response', resources.writing),
      ]),
      week(11, 'Composition workshop and peer editing', [
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Drafting, editing and improving compositions', resources.writing),
        entry("Language and Usage", 'Vocabulary, Spelling and Punctuation', "B8.4.2.1 Vocabulary, Spelling and Punctuation", "B8.4.2.1.1 Explore the use of nouns and pronouns in an increasing range of texts and classify them.", 'Proofreading conventions', resources.usage),
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B8.2.2.1 Conversation/Everyday Discourse", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Giving constructive peer feedback', resources.oral),
      ]),
      week(12, 'Integrated term performance and writing task', [
        entry("Listening and Speaking", 'Presentation: Everyday Experience', "B8.2.2.1 Presentation: Everyday Experience", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Integrated oral showcase', resources.oral),
        entry("Literature", 'Proverbs, Idioms, Prose, Drama, Poetry', "B8.6.1.2 Proverbs, Idioms, Prose, Drama, Poetry", "B8.6.1.2.1 Discuss how writers use language to create effect in prose, poetry and drama.", 'Literature review and performance', resources.literature),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Final composition task', resources.writing),
      ]),
    ],
  },
  {
    subject: 'Ghanaian Language',
    classLevel: 'B8',
    term: 'Term 3',
    title: 'B8 Ghanaian Language Scheme of Work - Term 3',
    weeks: [
      week(1, 'Customs review through reading and speaking', [
        entry("Customs and Institutions", 'Review of Puberty Rites, Naming, Clan and Chieftaincy', "B8.1.4.1 Review of Puberty Rites, Naming, Clan and Chieftaincy", "B8.1.4.1.1 Examine some behaviours that can lead to the destoolment/deskinment of chiefs and queenmothers.", 'Review of B8 cultural themes', resources.customs),
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B8.2.2.1 Conversation/Everyday Discourse", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Speaking on cultural identity', resources.oral),
        entry("Reading", 'Reading', "B8.3.1.1 Reading", "B8.3.1.1.1 Understand the main ideas and supporting points in a range of extended texts on familiar and unfamiliar topics.", 'Review reading on culture and identity', resources.reading),
      ]),
      week(2, 'Listening, note-making and short reports', [
        entry("Listening and Speaking", 'Listening Comprehension', "B8.2.2.1 Listening Comprehension", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Listening to interviews or oral reports', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Short report writing from notes', resources.writing),
        entry("Language and Usage", 'Vocabulary, Spelling and Punctuation', "B8.4.2.1 Vocabulary, Spelling and Punctuation", "B8.4.2.1.1 Explore the use of nouns and pronouns in an increasing range of texts and classify them.", 'Editing report language', resources.usage),
      ]),
      week(3, 'Fluent reading and translation', [
        entry("Reading", 'Reading', "B8.3.1.1 Reading", "B8.3.1.1.1 Understand the main ideas and supporting points in a range of extended texts on familiar and unfamiliar topics.", 'Guided and independent reading', resources.reading),
        entry("Reading", 'Translation', "B8.3.2.1 Translation", "B8.3.2.1.1 Establish the meaning of words, phrases and sentences in their various languages.", 'Connected-text translation', resources.reading),
        entry("Language and Usage", 'Integrating Grammar in Written Language', "B8.4.2.1 Integrating Grammar in Written Language", "B8.4.2.1.1 Explore the use of nouns and pronouns in an increasing range of texts and classify them.", 'Grammar review during translation', resources.usage),
      ]),
      week(4, 'Oral presentation and descriptive writing', [
        entry("Listening and Speaking", 'Presentation: Everyday Experience', "B8.2.2.1 Presentation: Everyday Experience", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Speaking from personal and community experience', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Descriptive and expository writing', resources.writing),
        entry("Reading", 'Reading', "B8.3.1.1 Reading", "B8.3.1.1.1 Understand the main ideas and supporting points in a range of extended texts on familiar and unfamiliar topics.", 'Model texts for presentation and description', resources.reading),
      ]),
      week(5, 'Proverb, idiom and reflective composition', [
        entry("Literature", 'Proverbs and Idioms', "B8.6.1.1 Proverbs and Idioms", "B8.6.1.1.1 Discuss the features of proverbs and idioms.", 'Selecting proverbs for given situations', resources.literature),
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B8.2.2.1 Conversation/Everyday Discourse", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Using figurative language in discussion', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Reflective writing using a proverb', resources.writing),
      ]),
      week(6, 'Prose and comprehension response', [
        entry("Literature", 'Prose', "B8.6.1.2 Prose", "B8.6.1.2.1 Discuss how writers use language to create effect in prose, poetry and drama.", 'Understanding sequence and character motives', resources.literature),
        entry("Reading", 'Reading', "B8.3.1.1 Reading", "B8.3.1.1.1 Understand the main ideas and supporting points in a range of extended texts on familiar and unfamiliar topics.", 'Answering comprehension questions in full sentences', resources.reading),
        entry("Language and Usage", 'Integrating Grammar in Written Language', "B8.4.2.1 Integrating Grammar in Written Language", "B8.4.2.1.1 Explore the use of nouns and pronouns in an increasing range of texts and classify them.", 'Sentence accuracy in responses', resources.usage),
      ]),
      week(7, 'Drama, scripts and collaborative speaking', [
        entry("Literature", 'Drama', "B8.6.1.1 Drama", "B8.6.1.1.1 Discuss the features of proverbs and idioms.", 'Role-play and scripted speaking', resources.literature),
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B8.2.2.1 Conversation/Everyday Discourse", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Voice, timing and turn-taking in drama', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Improving short scripts', resources.writing),
      ]),
      week(8, 'Poetry and oral expression', [
        entry("Literature", 'Poetry', "B8.6.1.2 Poetry", "B8.6.1.2.1 Discuss how writers use language to create effect in prose, poetry and drama.", 'Theme and feeling in poems', resources.literature),
        entry("Listening and Speaking", 'Presentation: Everyday Experience', "B8.2.2.1 Presentation: Everyday Experience", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Poetry recital and commentary', resources.oral),
        entry("Language and Usage", 'Vocabulary Development', "B8.4.2.1 Vocabulary Development", "B8.4.2.1.1 Explore the use of nouns and pronouns in an increasing range of texts and classify them.", 'Expressive language from poems', resources.usage),
      ]),
      week(9, 'Writing improvement and editing', [
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Drafting and revising longer compositions', resources.writing),
        entry("Language and Usage", 'Vocabulary, Spelling and Punctuation', "B8.4.2.1 Vocabulary, Spelling and Punctuation", "B8.4.2.1.1 Explore the use of nouns and pronouns in an increasing range of texts and classify them.", 'Self- and peer-editing', resources.usage),
        entry("Reading", 'Reading', "B8.3.1.1 Reading", "B8.3.1.1.1 Understand the main ideas and supporting points in a range of extended texts on familiar and unfamiliar topics.", 'Using model texts as writing support', resources.reading),
      ]),
      week(10, 'Integrated literacy project', [
        entry("Reading", 'Reading', "B8.3.1.1 Reading", "B8.3.1.1.1 Understand the main ideas and supporting points in a range of extended texts on familiar and unfamiliar topics.", 'Gathering information from short texts', resources.reading),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Turning reading into a project write-up', resources.writing),
        entry("Listening and Speaking", 'Presentation: Everyday Experience', "B8.2.2.1 Presentation: Everyday Experience", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Project briefing to peers', resources.oral),
      ]),
      week(11, 'Literature appreciation and comparison', [
        entry("Literature", 'Proverbs, Idioms, Prose, Drama, Poetry', "B8.6.1.2 Proverbs, Idioms, Prose, Drama, Poetry", "B8.6.1.2.1 Discuss how writers use language to create effect in prose, poetry and drama.", 'Comparing literary forms', resources.literature),
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B8.2.2.1 Conversation/Everyday Discourse", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'Discussing favourite texts and performances', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Short comparative response', resources.writing),
      ]),
      week(12, 'End-of-year blended language showcase', [
        entry("Listening and Speaking", 'Presentation: Everyday Experience', "B8.2.2.1 Presentation: Everyday Experience", "B8.2.2.1.1 Listen to a level-appropriate dialogue attentively and identify key information.", 'End-of-year oral showcase', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B8.5.1.1 Structure and Organise Ideas in Composition Writing", "B8.5.1.1.1 Develop coherent essays using the features of given text types.", 'Final writing portfolio selection', resources.writing),
        entry("Literature", 'Proverbs, Idioms, Prose, Drama, Poetry', "B8.6.1.2 Proverbs, Idioms, Prose, Drama, Poetry", "B8.6.1.2.1 Discuss how writers use language to create effect in prose, poetry and drama.", 'Performance and appreciation showcase', resources.literature),
      ]),
    ],
  },
];

export const ghanaianLanguageB9Terms: ExplicitCurriculumTerm[] = [
  {
    subject: 'Ghanaian Language',
    classLevel: 'B9',
    term: 'Term 1',
    title: 'B9 Ghanaian Language Scheme of Work - Term 1',
    weeks: [
      week(1, 'Marriage rites and respectful discussion', [
        entry("Customs and Institutions", 'Rites of Passage: Marriage', "B9.1.1.1 Rites of Passage: Marriage", "B9.1.1.1.1 Discuss the processes involved in performing marriage rites in their culture.", 'Marriage rites in the local culture', resources.customs),
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B9.2.2.1 Conversation/Everyday Discourse", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Respectful discussion of marriage and family issues', resources.oral),
        entry("Reading", 'Reading', "B9.3.1.1 Reading", "B9.3.1.1.1 Locate the main and subsidiary points in a range of texts and rewrite logically with accuracy in their own words.", 'Reading cultural texts on marriage', resources.reading),
      ]),
      week(2, 'Naming systems and inferential listening', [
        entry("Customs and Institutions", 'Naming Systems: Circumstantial, Reincarnation, Deity Names', "B9.1.2.1 Naming Systems: Circumstantial, Reincarnation, Deity Names", "B9.1.2.1.1 Identify and discuss circumstances that result in naming children in their community.", 'Special naming systems and meanings', resources.customs),
        entry("Listening and Speaking", 'Listening Comprehension', "B9.2.2.1 Listening Comprehension", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Listening for implied meanings in oral explanations', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Short explanatory writing on naming systems', resources.writing),
      ]),
      week(3, 'Clan system and traditional government language', [
        entry("Customs and Institutions", 'The Clan System', "B9.1.3.1 The Clan System", "B9.1.3.1.1 Discuss trends affecting the clan system.", 'Clan organisation and social roles', resources.customs),
        entry("Customs and Institutions", 'Chieftaincy: Traditional Government', "B9.1.4.1 Chieftaincy: Traditional Government", "B9.1.4.1.1 Explore the traditional governing structure of their community and discuss the duties of the functionaries.", 'Traditional government structures', resources.customs),
        entry("Language and Usage", 'Integrating Grammar in Written Language (Nouns, Adjectives)', "B9.4.2.2 Integrating Grammar in Written Language (Nouns, Adjectives)", "B9.4.2.2.1 Discuss how adjectives follow each other in a sentence.", 'Accurate descriptive language in social studies contexts', resources.usage),
      ]),
      week(4, 'Conversation, reading and translation', [
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B9.2.2.1 Conversation/Everyday Discourse", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Everyday discourse on civic and cultural issues', resources.oral),
        entry("Reading", 'Reading', "B9.3.1.1 Reading", "B9.3.1.1.2 Summarise passages read in given number of sentences.", 'Reading informational and reflective passages', resources.reading),
        entry("Reading", 'Translation', "B9.3.2.1 Translation", "B9.3.2.1.1 Decode the meaning of texts and translate from source to target language.", 'Translation of more complex statements', resources.reading),
      ]),
      week(5, 'Listening and tone in formal speech', [
        entry("Listening and Speaking", 'Listening Comprehension', "B9.2.2.1 Listening Comprehension", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Listening to speeches and explanations', resources.oral),
        entry("Listening and Speaking", 'Tones', "B9.2.2.1 Tones", "B9.2.2.1.1 Listen to a more natural level-appropriate interactions with multiple speakers for example, TV shows, dramas, films, etc.", 'Tone in formal and informal speech', resources.oral),
        entry("Listening and Speaking", 'Presentation: Everyday Experiences', "B9.2.2.1 Presentation: Everyday Experiences", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Short formal oral presentation', resources.oral),
      ]),
      week(6, 'Reading and composition writing', [
        entry("Reading", 'Reading', "B9.3.1.1 Reading", "B9.3.1.1.1 Locate the main and subsidiary points in a range of texts and rewrite logically with accuracy in their own words.", 'Reading for theme and viewpoint', resources.reading),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Organising multi-paragraph writing', resources.writing),
        entry("Language and Usage", 'Vocabulary, Spelling and Punctuation', "B9.4.2.1 Vocabulary, Spelling and Punctuation", "B9.4.2.1.1 Discuss nouns under singular and plural forms in an increasing and abstract range of texts.", 'Precision in spelling and mechanics', resources.usage),
      ]),
      week(7, 'Grammar integration in connected writing', [
        entry("Language and Usage", 'Integrating Grammar in Written Language (Nouns, Adjectives)', "B9.4.2.2 Integrating Grammar in Written Language (Nouns, Adjectives)", "B9.4.2.2.1 Discuss how adjectives follow each other in a sentence.", 'Nominal groups and descriptive precision', resources.usage),
        entry("Language and Usage", 'Integrating Grammar in Written Language (Verbs, Adverbs)', "B9.4.3.1 Integrating Grammar in Written Language (Verbs, Adverbs)", "B9.4.3.1.3 Discuss how adverbs follow each other in a sentence.", 'Verb choice and adverbial precision', resources.usage),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Refining paragraph flow and cohesion', resources.writing),
      ]),
      week(8, 'Drum, horn and symbolic language', [
        entry("Literature", 'Drum/Horn/Xylophone Language', "B9.6.1.2 Drum/Horn/Xylophone Language", "B9.6.1.2.1 Discuss how writers use language to create effect in an increasing range of prose, poetry and drama.", 'Symbolic and performance language in culture', resources.literature),
        entry("Listening and Speaking", 'Listening Comprehension', "B9.2.2.1 Listening Comprehension", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Listening to performance language explanations', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Writing a brief response to performance language', resources.writing),
      ]),
      week(9, 'Prose comprehension and critical response', [
        entry("Literature", 'Prose', "B9.6.1.2 Prose", "B9.6.1.2.1 Discuss how writers use language to create effect in an increasing range of prose, poetry and drama.", 'Prose themes and viewpoint', resources.literature),
        entry("Reading", 'Reading', "B9.3.1.1 Reading", "B9.3.1.1.2 Summarise passages read in given number of sentences.", 'Critical reading of prose passages', resources.reading),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Critical written response', resources.writing),
      ]),
      week(10, 'Poetry and expressive interpretation', [
        entry("Literature", 'Poetry', "B9.6.1.2 Poetry", "B9.6.1.2.1 Discuss how writers use language to create effect in an increasing range of prose, poetry and drama.", 'Poetic meaning, mood and imagery', resources.literature),
        entry("Listening and Speaking", 'Presentation: Everyday Experiences', "B9.2.2.1 Presentation: Everyday Experiences", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Recital and oral interpretation', resources.oral),
        entry("Language and Usage", 'Vocabulary Development', "B9.4.2.1 Vocabulary Development", "B9.4.2.1.1 Discuss nouns under singular and plural forms in an increasing and abstract range of texts.", 'Expressive and figurative vocabulary', resources.usage),
      ]),
      week(11, 'Drama and dialogue for social issues', [
        entry("Literature", 'Drama', "B9.6.1.1 Drama", "B9.6.1.1.1 Explore drum language/appellations and war songs respectively.", 'Drama around social and cultural issues', resources.literature),
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B9.2.2.1 Conversation/Everyday Discourse", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Dialogue and persuasion in drama', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Script and scene writing', resources.writing),
      ]),
      week(12, 'Integrated term review and project', [
        entry("Customs and Institutions", 'Review of Marriage, Naming, Clan and Traditional Government', "B9.1.4.1 Review of Marriage, Naming, Clan and Traditional Government", "B9.1.4.1.1 Explore the traditional governing structure of their community and discuss the duties of the functionaries.", 'Review of B9 customs and institutions', resources.customs),
        entry("Listening and Speaking", 'Presentation: Everyday Experiences', "B9.2.2.1 Presentation: Everyday Experiences", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Project presentation on a cultural institution', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Final term explanatory composition', resources.writing),
      ]),
    ],
  },
  {
    subject: 'Ghanaian Language',
    classLevel: 'B9',
    term: 'Term 2',
    title: 'B9 Ghanaian Language Scheme of Work - Term 2',
    weeks: [
      week(1, 'Advanced reading and discussion', [
        entry("Reading", 'Reading', "B9.3.1.1 Reading", "B9.3.1.1.2 Summarise passages read in given number of sentences.", 'Reading connected passages on social themes', resources.reading),
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B9.2.2.1 Conversation/Everyday Discourse", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Discussion of social and community issues', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Writing responses to social issues', resources.writing),
      ]),
      week(2, 'Listening, inference and oral summary', [
        entry("Listening and Speaking", 'Listening Comprehension', "B9.2.2.1 Listening Comprehension", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Listening to extended oral texts', resources.oral),
        entry("Listening and Speaking", 'Presentation: Everyday Experiences', "B9.2.2.1 Presentation: Everyday Experiences", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Oral summary from listening', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Turning oral summaries into written form', resources.writing),
      ]),
      week(3, 'Translation and precision in vocabulary', [
        entry("Reading", 'Translation', "B9.3.2.1 Translation", "B9.3.2.1.1 Decode the meaning of texts and translate from source to target language.", 'Connected-text translation and meaning transfer', resources.reading),
        entry("Language and Usage", 'Vocabulary, Spelling and Punctuation', "B9.4.2.1 Vocabulary, Spelling and Punctuation", "B9.4.2.1.1 Discuss nouns under singular and plural forms in an increasing and abstract range of texts.", 'Precision of word choice in translation', resources.usage),
        entry("Reading", 'Reading', "B9.3.2.1 Reading", "B9.3.2.1.1 Decode the meaning of texts and translate from source to target language.", 'Comparing source and translated meaning', resources.reading),
      ]),
      week(4, 'Formal presentation and composition structure', [
        entry("Listening and Speaking", 'Presentation: Everyday Experiences', "B9.2.2.1 Presentation: Everyday Experiences", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Formal speech and organised presentation', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Planning introductions, body and conclusion', resources.writing),
        entry("Language and Usage", 'Integrating Grammar in Written Language', "B9.4.2.1 Integrating Grammar in Written Language", "B9.4.2.1.1 Discuss nouns under singular and plural forms in an increasing and abstract range of texts.", 'Accuracy in formal language use', resources.usage),
      ]),
      week(5, 'Drum and horn language appreciation', [
        entry("Literature", 'Drum/Horn/Xylophone Language', "B9.6.1.2 Drum/Horn/Xylophone Language", "B9.6.1.2.1 Discuss how writers use language to create effect in an increasing range of prose, poetry and drama.", 'Message, function and occasion in performance language', resources.literature),
        entry("Listening and Speaking", 'Listening Comprehension', "B9.2.2.1 Listening Comprehension", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Listening to symbolic communication commentary', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Short interpretive response', resources.writing),
      ]),
      week(6, 'Prose analysis and paragraph development', [
        entry("Literature", 'Prose', "B9.6.1.2 Prose", "B9.6.1.2.1 Discuss how writers use language to create effect in an increasing range of prose, poetry and drama.", 'Theme and point of view in prose', resources.literature),
        entry("Reading", 'Reading', "B9.3.1.1 Reading", "B9.3.1.1.1 Locate the main and subsidiary points in a range of texts and rewrite logically with accuracy in their own words.", 'Close reading of prose paragraphs', resources.reading),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Paragraph development from prose analysis', resources.writing),
      ]),
      week(7, 'Poetry, imagery and reflection', [
        entry("Literature", 'Poetry', "B9.6.1.2 Poetry", "B9.6.1.2.1 Discuss how writers use language to create effect in an increasing range of prose, poetry and drama.", 'Imagery, rhythm and message', resources.literature),
        entry("Listening and Speaking", 'Presentation: Everyday Experiences', "B9.2.2.1 Presentation: Everyday Experiences", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Poetry reading and reflection', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Reflective poetry response', resources.writing),
      ]),
      week(8, 'Drama, conflict and dialogue writing', [
        entry("Literature", 'Drama', "B9.6.1.1 Drama", "B9.6.1.1.1 Explore drum language/appellations and war songs respectively.", 'Conflict, character and dialogue', resources.literature),
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B9.2.2.1 Conversation/Everyday Discourse", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Negotiation and persuasion in role-play', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Dialogue writing for drama', resources.writing),
      ]),
      week(9, 'Grammar refinement in longer writing', [
        entry("Language and Usage", 'Integrating Grammar in Written Language (Nouns, Adjectives)', "B9.4.2.2 Integrating Grammar in Written Language (Nouns, Adjectives)", "B9.4.2.2.1 Discuss how adjectives follow each other in a sentence.", 'Precision and conciseness in description', resources.usage),
        entry("Language and Usage", 'Integrating Grammar in Written Language (Verbs, Adverbs)', "B9.4.3.1 Integrating Grammar in Written Language (Verbs, Adverbs)", "B9.4.3.1.3 Discuss how adverbs follow each other in a sentence.", 'Shading meaning with verb and adverb choices', resources.usage),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Revising longer compositions', resources.writing),
      ]),
      week(10, 'Independent reading and critical response', [
        entry("Reading", 'Reading', "B9.3.1.1 Reading", "B9.3.1.1.1 Locate the main and subsidiary points in a range of texts and rewrite logically with accuracy in their own words.", 'Independent reading of selected texts', resources.reading),
        entry("Literature", 'Prose, Poetry or Drama', "B9.6.1.2 Prose, Poetry or Drama", "B9.6.1.2.1 Discuss how writers use language to create effect in an increasing range of prose, poetry and drama.", 'Critical response to chosen texts', resources.literature),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Critical response paragraph writing', resources.writing),
      ]),
      week(11, 'Integrated oral and written project', [
        entry("Listening and Speaking", 'Presentation: Everyday Experiences', "B9.2.2.1 Presentation: Everyday Experiences", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Presenting a language project', resources.oral),
        entry("Reading", 'Reading', "B9.3.1.1 Reading", "B9.3.1.1.1 Locate the main and subsidiary points in a range of texts and rewrite logically with accuracy in their own words.", 'Using source texts for project support', resources.reading),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Project write-up drafting', resources.writing),
      ]),
      week(12, 'Term showcase and review', [
        entry("Listening and Speaking", 'Presentation: Everyday Experiences', "B9.2.2.1 Presentation: Everyday Experiences", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Term showcase presentation', resources.oral),
        entry("Literature", 'Drum/Horn/Xylophone Language, Prose, Poetry and Drama', "B9.6.1.2 Drum/Horn/Xylophone Language, Prose, Poetry and Drama", "B9.6.1.2.1 Discuss how writers use language to create effect in an increasing range of prose, poetry and drama.", 'Review of studied literary forms', resources.literature),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Final polished writing submission', resources.writing),
      ]),
    ],
  },
  {
    subject: 'Ghanaian Language',
    classLevel: 'B9',
    term: 'Term 3',
    title: 'B9 Ghanaian Language Scheme of Work - Term 3',
    weeks: [
      week(1, 'Review of customs through formal speaking', [
        entry("Customs and Institutions", 'Review of Marriage, Naming and Traditional Government', "B9.1.4.1 Review of Marriage, Naming and Traditional Government", "B9.1.4.1.1 Explore the traditional governing structure of their community and discuss the duties of the functionaries.", 'Review of B9 customs and institutions', resources.customs),
        entry("Listening and Speaking", 'Presentation: Everyday Experiences', "B9.2.2.1 Presentation: Everyday Experiences", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Formal oral report on cultural themes', resources.oral),
        entry("Reading", 'Reading', "B9.3.1.1 Reading", "B9.3.1.1.1 Locate the main and subsidiary points in a range of texts and rewrite logically with accuracy in their own words.", 'Review reading on customs and governance', resources.reading),
      ]),
      week(2, 'Listening and advanced summary writing', [
        entry("Listening and Speaking", 'Listening Comprehension', "B9.2.2.1 Listening Comprehension", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Listening to speeches, interviews or oral narratives', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Advanced summary writing', resources.writing),
        entry("Language and Usage", 'Vocabulary, Spelling and Punctuation', "B9.4.2.1 Vocabulary, Spelling and Punctuation", "B9.4.2.1.1 Discuss nouns under singular and plural forms in an increasing and abstract range of texts.", 'Editing summaries for precision', resources.usage),
      ]),
      week(3, 'Translation and comparison of meaning', [
        entry("Reading", 'Translation', "B9.3.2.1 Translation", "B9.3.2.1.1 Decode the meaning of texts and translate from source to target language.", 'Translation of connected and culturally nuanced texts', resources.reading),
        entry("Reading", 'Reading', "B9.3.2.1 Reading", "B9.3.2.1.1 Decode the meaning of texts and translate from source to target language.", 'Comparing original and translated meanings', resources.reading),
        entry("Language and Usage", 'Integrating Grammar in Written Language', "B9.4.2.1 Integrating Grammar in Written Language", "B9.4.2.1.1 Discuss nouns under singular and plural forms in an increasing and abstract range of texts.", 'Maintaining grammatical accuracy in translation', resources.usage),
      ]),
      week(4, 'Extended composition and editing', [
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Planning and drafting extended compositions', resources.writing),
        entry("Language and Usage", 'Integrating Grammar in Written Language', "B9.4.2.1 Integrating Grammar in Written Language", "B9.4.2.1.1 Discuss nouns under singular and plural forms in an increasing and abstract range of texts.", 'Editing for cohesion and correctness', resources.usage),
        entry("Reading", 'Reading', "B9.3.1.1 Reading", "B9.3.1.1.1 Locate the main and subsidiary points in a range of texts and rewrite logically with accuracy in their own words.", 'Using model texts to improve writing', resources.reading),
      ]),
      week(5, 'Performance language and cultural interpretation', [
        entry("Literature", 'Drum/Horn/Xylophone Language', "B9.6.1.2 Drum/Horn/Xylophone Language", "B9.6.1.2.1 Discuss how writers use language to create effect in an increasing range of prose, poetry and drama.", 'Cultural interpretation of symbolic language', resources.literature),
        entry("Listening and Speaking", 'Listening Comprehension', "B9.2.2.1 Listening Comprehension", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Listening to cultural performances or explanations', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Interpretive writing on performance language', resources.writing),
      ]),
      week(6, 'Literary comparison week', [
        entry("Literature", 'Prose, Poetry and Drama', "B9.6.1.2 Prose, Poetry and Drama", "B9.6.1.2.1 Discuss how writers use language to create effect in an increasing range of prose, poetry and drama.", 'Comparing theme and message across genres', resources.literature),
        entry("Reading", 'Reading', "B9.3.1.1 Reading", "B9.3.1.1.1 Locate the main and subsidiary points in a range of texts and rewrite logically with accuracy in their own words.", 'Reading for comparison across texts', resources.reading),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Comparative paragraph writing', resources.writing),
      ]),
      week(7, 'Oral debate and persuasive writing', [
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B9.2.2.1 Conversation/Everyday Discourse", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Debate on a cultural or social issue', resources.oral),
        entry("Reading", 'Reading', "B9.3.1.1 Reading", "B9.3.1.1.1 Locate the main and subsidiary points in a range of texts and rewrite logically with accuracy in their own words.", 'Reading arguments and viewpoints', resources.reading),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Short persuasive composition', resources.writing),
      ]),
      week(8, 'Poetry recital and creative response', [
        entry("Literature", 'Poetry', "B9.6.1.2 Poetry", "B9.6.1.2.1 Discuss how writers use language to create effect in an increasing range of prose, poetry and drama.", 'Recital, tone and interpretation', resources.literature),
        entry("Listening and Speaking", 'Presentation: Everyday Experiences', "B9.2.2.1 Presentation: Everyday Experiences", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Creative oral response to poetry', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Creative response writing', resources.writing),
      ]),
      week(9, 'Drama performance and script polishing', [
        entry("Literature", 'Drama', "B9.6.1.1 Drama", "B9.6.1.1.1 Explore drum language/appellations and war songs respectively.", 'Scene performance and character interpretation', resources.literature),
        entry("Listening and Speaking", 'Conversation/Everyday Discourse', "B9.2.2.1 Conversation/Everyday Discourse", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Voice and interaction in dramatic performance', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Editing and polishing short scripts', resources.writing),
      ]),
      week(10, 'Independent reading portfolio', [
        entry("Reading", 'Reading', "B9.3.1.1 Reading", "B9.3.1.1.1 Locate the main and subsidiary points in a range of texts and rewrite logically with accuracy in their own words.", 'Independent reading of selected texts', resources.reading),
        entry("Literature", 'Prose, Poetry or Drama', "B9.6.1.2 Prose, Poetry or Drama", "B9.6.1.2.1 Discuss how writers use language to create effect in an increasing range of prose, poetry and drama.", 'Literary portfolio response', resources.literature),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Portfolio reflection writing', resources.writing),
      ]),
      week(11, 'Integrated project completion', [
        entry("Listening and Speaking", 'Presentation: Everyday Experiences', "B9.2.2.1 Presentation: Everyday Experiences", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Final project rehearsal and delivery', resources.oral),
        entry("Reading", 'Reading', "B9.3.1.1 Reading", "B9.3.1.1.1 Locate the main and subsidiary points in a range of texts and rewrite logically with accuracy in their own words.", 'Checking sources and evidence for project work', resources.reading),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Final project report or essay', resources.writing),
      ]),
      week(12, 'End-of-year language and literature showcase', [
        entry("Listening and Speaking", 'Presentation: Everyday Experiences', "B9.2.2.1 Presentation: Everyday Experiences", "B9.2.2.1.2 Initiate and participate in meaningful and collaborative discussions on texts and related materials building on others’ ideas and expressing their own clearly and persuasively.", 'Year-end oral showcase', resources.oral),
        entry("Composition Writing", 'Structure and Organise Ideas in Composition Writing', "B9.5.1.1 Structure and Organise Ideas in Composition Writing", "B9.5.1.1.1 Plan and structure a range of extended texts using paragraphs to show progression from one idea to the next and linking paragraphs using cohesive language.", 'Final portfolio selection and reflection', resources.writing),
        entry("Literature", 'Drum/Horn/Xylophone Language, Prose, Poetry and Drama', "B9.6.1.2 Drum/Horn/Xylophone Language, Prose, Poetry and Drama", "B9.6.1.2.1 Discuss how writers use language to create effect in an increasing range of prose, poetry and drama.", 'Final literature showcase', resources.literature),
      ]),
    ],
  },
];
