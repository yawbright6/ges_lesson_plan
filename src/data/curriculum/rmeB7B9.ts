import type { ExplicitCurriculumTerm } from './mathematicsB7';

const resources = {
  scriptures: ['RME textbook', 'Bible', "Qur'an", 'Oral tradition notes'],
  worship: ['RME textbook', 'Songbook', 'Prayer guide', 'Charts'],
  family: ['RME textbook', 'Case studies', 'Role-play cards', 'Community stories'],
  leadership: ['RME textbook', 'Biographies', 'Story cards', 'Posters'],
  ethics: ['RME textbook', 'Value cards', 'Scenario cards', 'Charts'],
  economic: ['RME textbook', 'Budget sheets', 'Newspaper cuttings', 'Community resource persons'],
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

export const rmeB7Terms: ExplicitCurriculumTerm[] = [
  {
    subject: 'RME',
    classLevel: 'B7',
    term: 'Term 1',
    title: 'B7 RME Scheme of Work - Term 1',
    weeks: [
      week(
        1,
        'God, His Creation and Attributes',
        'God, His Nature and Attributes',
        'B7/JHS1.1.1.1 Describe the nature and attributes of God in the three major religions in Ghana.',
        'B7/JHS1.1.1.1.2 Describe ways in which you demonstrate',
        'Names and attributes of God',
        resources.scriptures
      ),
      week(
        2,
        'God, His Creation and Attributes',
        'God, His Nature and Attributes',
        'B7/JHS1.1.1.1 Describe the nature and attributes of God in the three major religions in Ghana.',
        'B7/JHS1.1.1.1.2 Describe ways in which you demonstrate',
        'The uniqueness and greatness of God',
        resources.scriptures
      ),
      week(
        3,
        'God, His Creation and Attributes',
        'God, His Nature and Attributes',
        'B7/JHS1.1.1.1 Describe the nature and attributes of God in the three major religions in Ghana.',
        'B7/JHS1.1.1.1.2 Describe ways in which you demonstrate',
        'Applying knowledge of God’s attributes to daily life',
        resources.scriptures
      ),
      week(
        4,
        'Religious Practices',
        'Worship',
        'B7/JHS1.2.1.1 Explain how worship is performed in the three major religions in Ghana and apply the moral lessons in worship in daily life.',
        'B7/JHS1.2.1.1.3 Identify and explain the moral lessons from',
        'Meaning and purpose of worship',
        resources.worship
      ),
      week(
        5,
        'Religious Practices',
        'Worship',
        'B7/JHS1.2.1.1 Explain how worship is performed in the three major religions in Ghana and apply the moral lessons in worship in daily life.',
        'B7/JHS1.2.1.1.3 Identify and explain the moral lessons from',
        'Acts of worship in the three major religions',
        resources.worship
      ),
      week(
        6,
        'Religious Practices',
        'Worship',
        'B7/JHS1.2.1.1 Explain how worship is performed in the three major religions in Ghana and apply the moral lessons in worship in daily life.',
        'B7/JHS1.2.1.1.3 Identify and explain the moral lessons from',
        'Modes of worship in the three major religions',
        resources.worship
      ),
      week(
        7,
        'Religious Practices',
        'Worship',
        'B7/JHS1.2.1.1 Explain how worship is performed in the three major religions in Ghana and apply the moral lessons in worship in daily life.',
        'B7/JHS1.2.1.1.3 Identify and explain the moral lessons from',
        'Moral lessons from worship',
        resources.worship
      ),
      week(
        8,
        'Religious Practices',
        'Religious Songs and Recitations',
        'B7/JHS1.2.2.1 Analyse and apply the moral values in religious songs and recitations.',
        'B7/JHS1.2.2.1.3 Identify the moral values in religious',
        'Religious songs and non-religious songs',
        resources.worship
      ),
      week(
        9,
        'Religious Practices',
        'Religious Songs and Recitations',
        'B7/JHS1.2.2.1 Analyse and apply the moral values in religious songs and recitations.',
        'B7/JHS1.2.2.1.3 Identify the moral values in religious',
        'Characteristics and purposes of religious songs',
        resources.worship
      ),
      week(
        10,
        'Religious Practices',
        'Religious Songs and Recitations',
        'B7/JHS1.2.2.1 Analyse and apply the moral values in religious songs and recitations.',
        'B7/JHS1.2.2.1.3 Identify the moral values in religious',
        'Messages in religious songs and recitations',
        resources.worship
      ),
      week(
        11,
        'Religious Practices',
        'Religious Songs and Recitations',
        'B7/JHS1.2.2.1 Analyse and apply the moral values in religious songs and recitations.',
        'B7/JHS1.2.2.1.3 Identify the moral values in religious',
        'Composing and performing religious songs',
        resources.worship
      ),
      week(
        12,
        'Religious Practices',
        'Religious Songs and Recitations',
        'B7/JHS1.2.2.1 Analyse and apply the moral values in religious songs and recitations.',
        'B7/JHS1.2.2.1.3 Identify the moral values in religious',
        'Moral values from songs and recitations',
        resources.worship
      ),
    ],
  },
  {
    subject: 'RME',
    classLevel: 'B7',
    term: 'Term 2',
    title: 'B7 RME Scheme of Work - Term 2',
    weeks: [
      week(
        1,
        'The Family and the Community',
        'Family Systems',
        'B7/JHS1.3.1.1 Identify and explain the importance of family systems.',
        'B7/JHS1.3.1.1.3 Describe ways of promoting good',
        'Meaning and types of family systems',
        resources.family
      ),
      week(
        2,
        'The Family and the Community',
        'Family Systems',
        'B7/JHS1.3.1.1 Identify and explain the importance of family systems.',
        'B7/JHS1.3.1.1.3 Describe ways of promoting good',
        'Nuclear and extended family systems',
        resources.family
      ),
      week(
        3,
        'The Family and the Community',
        'Family Systems',
        'B7/JHS1.3.1.1 Identify and explain the importance of family systems.',
        'B7/JHS1.3.1.1.3 Describe ways of promoting good',
        'Importance and functions of the family',
        resources.family
      ),
      week(
        4,
        'The Family and the Community',
        'Family Systems',
        'B7/JHS1.3.1.1 Identify and explain the importance of family systems.',
        'B7/JHS1.3.1.1.3 Describe ways of promoting good',
        'Merits and demerits of the nuclear family',
        resources.family
      ),
      week(
        5,
        'The Family and the Community',
        'Family Systems',
        'B7/JHS1.3.1.1 Identify and explain the importance of family systems.',
        'B7/JHS1.3.1.1.3 Describe ways of promoting good',
        'Merits and demerits of the extended family',
        resources.family
      ),
      week(
        6,
        'The Family and the Community',
        'Family Systems',
        'B7/JHS1.3.1.1 Identify and explain the importance of family systems.',
        'B7/JHS1.3.1.1.2 Identify the role of family',
        'Roles of family members',
        resources.family
      ),
      week(
        7,
        'The Family and the Community',
        'Family Systems',
        'B7/JHS1.3.1.1 Identify and explain the importance of family systems.',
        'B7/JHS1.3.1.1.3 Describe ways of promoting good',
        'Values for healthy family living',
        resources.family
      ),
      week(
        8,
        'Religious Leaders and Personalities',
        'Religious Leaders',
        'B7/JHS1.4.1.1 Identify the key features and moral messages of the call and ministry of religious leaders in the three major religions.',
        'B7/JHS1.4.1.1.1 Discuss the early life and call of the religious',
        'Call of selected religious leaders',
        resources.leadership
      ),
      week(
        9,
        'Religious Leaders and Personalities',
        'Religious Leaders',
        'B7/JHS1.4.1.1 Identify the key features and moral messages of the call and ministry of religious leaders in the three major religions.',
        'B7/JHS1.4.1.1.1 Discuss the early life and call of the religious',
        'Ministry of religious leaders',
        resources.leadership
      ),
      week(
        10,
        'Religious Leaders and Personalities',
        'Religious Leaders',
        'B7/JHS1.4.1.1 Identify the key features and moral messages of the call and ministry of religious leaders in the three major religions.',
        'B7/JHS1.4.1.1.2 Describe the ministries of the religious leaders',
        'Key events in the lives of religious leaders',
        resources.leadership
      ),
      week(
        11,
        'Religious Leaders and Personalities',
        'Religious Leaders',
        'B7/JHS1.4.1.1 Identify the key features and moral messages of the call and ministry of religious leaders in the three major religions.',
        'B7/JHS1.4.1.1.1 Discuss the early life and call of the religious',
        'Moral lessons from religious leaders',
        resources.leadership
      ),
      week(
        12,
        'Religious Leaders and Personalities',
        'Religious Leaders',
        'B7/JHS1.4.1.1 Identify the key features and moral messages of the call and ministry of religious leaders in the three major religions.',
        'B7/JHS1.4.1.1.1 Discuss the early life and call of the religious',
        'Applying lessons from religious leaders',
        resources.leadership
      ),
    ],
  },
  {
    subject: 'RME',
    classLevel: 'B7',
    term: 'Term 3',
    title: 'B7 RME Scheme of Work - Term 3',
    weeks: [
      week(
        1,
        'Ethics and Moral Life',
        'Manners and Decency',
        'B7/JHS1.5.1.1 Demonstrate understanding of manners and decency in the home, school and community.',
        'B7/JHS1.5.1.1.1 Identify and explain behaviours considered',
        'Meaning of manners and decency',
        resources.ethics
      ),
      week(
        2,
        'Ethics and Moral Life',
        'Manners and Decency',
        'B7/JHS1.5.1.1 Demonstrate understanding of manners and decency in the home, school and community.',
        'B7/JHS1.5.1.1.1 Identify and explain behaviours considered',
        'Acceptable and unacceptable behaviours',
        resources.ethics
      ),
      week(
        3,
        'Ethics and Moral Life',
        'Manners and Decency',
        'B7/JHS1.5.1.1 Demonstrate understanding of manners and decency in the home, school and community.',
        'B7/JHS1.5.1.1.1 Identify and explain behaviours considered',
        'Proper manners in speech, dressing and conduct',
        resources.ethics
      ),
      week(
        4,
        'Ethics and Moral Life',
        'Manners and Decency',
        'B7/JHS1.5.1.1 Demonstrate understanding of manners and decency in the home, school and community.',
        'B7/JHS1.5.1.1.1 Identify and explain behaviours considered',
        'Importance of decent behaviour',
        resources.ethics
      ),
      week(
        5,
        'Ethics and Moral Life',
        'Manners and Decency',
        'B7/JHS1.5.1.1 Demonstrate understanding of manners and decency in the home, school and community.',
        'B7/JHS1.5.1.1.1 Identify and explain behaviours considered',
        'Practising manners and decency',
        resources.ethics
      ),
      week(
        6,
        'Ethics and Moral Life',
        'Substance Abuse',
        'B7/JHS1.5.2.1 Explain the dangers of substance abuse and ways of avoiding it.',
        'B7/JHS1.5.2.1.2 Discuss the effects of substance abuse.',
        'Meaning of substance abuse and common substances',
        resources.ethics
      ),
      week(
        7,
        'Ethics and Moral Life',
        'Substance Abuse',
        'B7/JHS1.5.2.1 Explain the dangers of substance abuse and ways of avoiding it.',
        'B7/JHS1.5.2.1.2 Discuss the effects of substance abuse.',
        'Causes of substance abuse',
        resources.ethics
      ),
      week(
        8,
        'Ethics and Moral Life',
        'Substance Abuse',
        'B7/JHS1.5.2.1 Explain the dangers of substance abuse and ways of avoiding it.',
        'B7/JHS1.5.2.1.2 Discuss the effects of substance abuse.',
        'Effects of substance abuse',
        resources.ethics
      ),
      week(
        9,
        'Religion and Economic Life',
        'Work, Entrepreneurship and Social Security',
        'B7/JHS1.6.1.1 Cultivate the need for hard work and develop the spirit of entrepreneurship.',
        'B7/JHS1.6.1.1.4 Justify the need to become an',
        'The value of hard work',
        resources.economic
      ),
      week(
        10,
        'Religion and Economic Life',
        'Work, Entrepreneurship and Social Security',
        'B7/JHS1.6.1.1 Cultivate the need for hard work and develop the spirit of entrepreneurship.',
        'B7/JHS1.6.1.1.4 Justify the need to become an',
        'Qualities of an entrepreneur',
        resources.economic
      ),
      week(
        11,
        'Religion and Economic Life',
        'Work, Entrepreneurship and Social Security',
        'B7/JHS1.6.1.1 Cultivate the need for hard work and develop the spirit of entrepreneurship.',
        'B7/JHS1.6.1.1.1 Explain the meaning of work and',
        'Saving and planning for the future',
        resources.economic
      ),
      week(
        12,
        'Religion and Economic Life',
        'Work, Entrepreneurship and Social Security',
        'B7/JHS1.6.1.1 Cultivate the need for hard work and develop the spirit of entrepreneurship.',
        'B7/JHS1.6.1.1.1 Explain the meaning of work and',
        'Hard work, entrepreneurship and social responsibility',
        resources.economic
      ),
    ],
  },
];

export const rmeB8Terms: ExplicitCurriculumTerm[] = [
  {
    subject: 'RME',
    classLevel: 'B8',
    term: 'Term 1',
    title: 'B8 RME Scheme of Work - Term 1',
    weeks: [
      week(
        1,
        'God, His Creation and Attributes',
        'The Creation Stories of the Three Major Religions in Ghana',
        'B8/JHS2.1.1.1 Explain the creation stories of the three major religions in Ghana.',
        'B8/JHS2.1.1.1.1 Discuss the creation stories of the three',
        'Creation stories in the three major religions',
        resources.scriptures
      ),
      week(
        2,
        'God, His Creation and Attributes',
        'The Creation Stories of the Three Major Religions in Ghana',
        'B8/JHS2.1.1.1 Explain the creation stories of the three major religions in Ghana.',
        'B8/JHS2.1.1.1.1 Discuss the creation stories of the three',
        'Comparing creation stories',
        resources.scriptures
      ),
      week(
        3,
        'God, His Creation and Attributes',
        'The Creation Stories of the Three Major Religions in Ghana',
        'B8/JHS2.1.1.1 Explain the creation stories of the three major religions in Ghana.',
        'B8/JHS2.1.1.1.2 Identify and explain the moral values in each',
        'Moral lessons from creation stories',
        resources.scriptures
      ),
      week(
        4,
        'Religious Practices',
        'Rites of Passage',
        'B8/JHS2.2.1.1 Explain rites of passage and identify the moral lessons in them.',
        'B8/JHS2.2.1.1.1 Describe the naming ceremonies/outdooring',
        'Meaning and importance of rites of passage',
        resources.worship
      ),
      week(
        5,
        'Religious Practices',
        'Rites of Passage',
        'B8/JHS2.2.1.1 Explain rites of passage and identify the moral lessons in them.',
        'B8/JHS2.2.1.1.1 Describe the naming ceremonies/outdooring',
        'Naming ceremonies',
        resources.worship
      ),
      week(
        6,
        'Religious Practices',
        'Rites of Passage',
        'B8/JHS2.2.1.1 Explain rites of passage and identify the moral lessons in them.',
        'B8/JHS2.2.1.1.1 Describe the naming ceremonies/outdooring',
        'Puberty rites and their relevance',
        resources.worship
      ),
      week(
        7,
        'Religious Practices',
        'Rites of Passage',
        'B8/JHS2.2.1.1 Explain rites of passage and identify the moral lessons in them.',
        'B8/JHS2.2.1.1.1 Describe the naming ceremonies/outdooring',
        'Marriage rites in the three major religions',
        resources.worship
      ),
      week(
        8,
        'Religious Practices',
        'Rites of Passage',
        'B8/JHS2.2.1.1 Explain rites of passage and identify the moral lessons in them.',
        'B8/JHS2.2.1.1.1 Describe the naming ceremonies/outdooring',
        'Moral lessons from marriage rites',
        resources.worship
      ),
      week(
        9,
        'Religious Practices',
        'Rites of Passage',
        'B8/JHS2.2.1.1 Explain rites of passage and identify the moral lessons in them.',
        'B8/JHS2.2.1.1.1 Describe the naming ceremonies/outdooring',
        'Death rites in the three major religions',
        resources.worship
      ),
      week(
        10,
        'Religious Practices',
        'Rites of Passage',
        'B8/JHS2.2.1.1 Explain rites of passage and identify the moral lessons in them.',
        'B8/JHS2.2.1.1.1 Describe the naming ceremonies/outdooring',
        'Importance of death rites',
        resources.worship
      ),
      week(
        11,
        'Religious Practices',
        'Rites of Passage',
        'B8/JHS2.2.1.1 Explain rites of passage and identify the moral lessons in them.',
        'B8/JHS2.2.1.1.6 Identify and explain the moral lessons in the',
        'Moral lessons in rites of passage',
        resources.worship
      ),
      week(
        12,
        'Religious Practices',
        'Rites of Passage',
        'B8/JHS2.2.1.1 Explain rites of passage and identify the moral lessons in them.',
        'B8/JHS2.2.1.1.6 Identify and explain the moral lessons in the',
        'Applying lessons from rites of passage',
        resources.worship
      ),
    ],
  },
  {
    subject: 'RME',
    classLevel: 'B8',
    term: 'Term 2',
    title: 'B8 RME Scheme of Work - Term 2',
    weeks: [
      week(
        1,
        'The Family and the Community',
        'Authority and Obedience',
        'B8/JHS2.3.1.1 Identify and explain the importance of obeying authority.',
        'B8/JHS2.3.1.1.2 Explain the need to obey God, parents and those (',
        'Meaning of authority and obedience',
        resources.family
      ),
      week(
        2,
        'The Family and the Community',
        'Authority and Obedience',
        'B8/JHS2.3.1.1 Identify and explain the importance of obeying authority.',
        'B8/JHS2.3.1.1.3 Demonstrate how to apply the rules and (',
        'Types and sources of authority',
        resources.family
      ),
      week(
        3,
        'The Family and the Community',
        'Authority and Obedience',
        'B8/JHS2.3.1.1 Identify and explain the importance of obeying authority.',
        'B8/JHS2.3.1.1.3 Demonstrate how to apply the rules and (',
        'Why rules and regulations should be obeyed',
        resources.family
      ),
      week(
        4,
        'The Family and the Community',
        'Authority and Obedience',
        'B8/JHS2.3.1.1 Identify and explain the importance of obeying authority.',
        'B8/JHS2.3.1.1.3 Demonstrate how to apply the rules and (',
        'Applying rules and regulations in daily life',
        resources.family
      ),
      week(
        5,
        'The Family and the Community',
        'Authority and Obedience',
        'B8/JHS2.3.1.1 Identify and explain the importance of obeying authority.',
        'B8/JHS2.3.1.1.2 Explain the need to obey God, parents and those (',
        'Benefits of obedience and consequences of disobedience',
        resources.family
      ),
      week(
        6,
        'Religious Leaders and Personalities',
        'Prophets and Caliphs',
        'B8/JHS2.4.1.1 Identify and explain the moral lessons that can be learned from the exemplary lives of the Prophets and Caliphs.',
        'B8/JHS2.4.1.1.3 Examine lessons from the exemplary lives',
        'Selected prophets and caliphs',
        resources.leadership
      ),
      week(
        7,
        'Religious Leaders and Personalities',
        'Prophets and Caliphs',
        'B8/JHS2.4.1.1 Identify and explain the moral lessons that can be learned from the exemplary lives of the Prophets and Caliphs.',
        'B8/JHS2.4.1.1.3 Examine lessons from the exemplary lives',
        'Missions of selected prophets',
        resources.leadership
      ),
      week(
        8,
        'Religious Leaders and Personalities',
        'Prophets and Caliphs',
        'B8/JHS2.4.1.1 Identify and explain the moral lessons that can be learned from the exemplary lives of the Prophets and Caliphs.',
        'B8/JHS2.4.1.1.3 Examine lessons from the exemplary lives',
        'Roles of selected caliphs',
        resources.leadership
      ),
      week(
        9,
        'Religious Leaders and Personalities',
        'Prophets and Caliphs',
        'B8/JHS2.4.1.1 Identify and explain the moral lessons that can be learned from the exemplary lives of the Prophets and Caliphs.',
        'B8/JHS2.4.1.1.3 Examine lessons from the exemplary lives',
        'Exemplary qualities of prophets and caliphs',
        resources.leadership
      ),
      week(
        10,
        'Religious Leaders and Personalities',
        'Prophets and Caliphs',
        'B8/JHS2.4.1.1 Identify and explain the moral lessons that can be learned from the exemplary lives of the Prophets and Caliphs.',
        'B8/JHS2.4.1.1.3 Examine lessons from the exemplary lives',
        'Moral lessons from prophets and caliphs',
        resources.leadership
      ),
      week(
        11,
        'Religious Leaders and Personalities',
        'Prophets and Caliphs',
        'B8/JHS2.4.1.1 Identify and explain the moral lessons that can be learned from the exemplary lives of the Prophets and Caliphs.',
        'B8/JHS2.4.1.1.3 Examine lessons from the exemplary lives',
        'Applying lessons from prophets and caliphs',
        resources.leadership
      ),
      week(
        12,
        'Religious Leaders and Personalities',
        'Prophets and Caliphs',
        'B8/JHS2.4.1.1 Identify and explain the moral lessons that can be learned from the exemplary lives of the Prophets and Caliphs.',
        'B8/JHS2.4.1.1.3 Examine lessons from the exemplary lives',
        'Project presentation on prophets and caliphs',
        resources.leadership
      ),
    ],
  },
  {
    subject: 'RME',
    classLevel: 'B8',
    term: 'Term 3',
    title: 'B8 RME Scheme of Work - Term 3',
    weeks: [
      week(
        1,
        'Ethics and Moral Life',
        'Moral Teachings in the Three Major Religions in Ghana',
        'B8/JHS2.5.1.1 Exemplify the moral teachings from the Bible, Qur’an and Oral Traditions.',
        'B8/JHS2.5.1.1.1 Identify and explain the moral teachings',
        'Moral teachings from the three major religions',
        resources.ethics
      ),
      week(
        2,
        'Ethics and Moral Life',
        'Moral Teachings in the Three Major Religions in Ghana',
        'B8/JHS2.5.1.1 Exemplify the moral teachings from the Bible, Qur’an and Oral Traditions.',
        'B8/JHS2.5.1.1.1 Identify and explain the moral teachings',
        'Honesty, respect, peace and love',
        resources.ethics
      ),
      week(
        3,
        'Ethics and Moral Life',
        'Moral Teachings in the Three Major Religions in Ghana',
        'B8/JHS2.5.1.1 Exemplify the moral teachings from the Bible, Qur’an and Oral Traditions.',
        'B8/JHS2.5.1.1.1 Identify and explain the moral teachings',
        'Self-control, chastity and humility',
        resources.ethics
      ),
      week(
        4,
        'Ethics and Moral Life',
        'Moral Teachings in the Three Major Religions in Ghana',
        'B8/JHS2.5.1.1 Exemplify the moral teachings from the Bible, Qur’an and Oral Traditions.',
        'B8/JHS2.5.1.1.2 Demonstrate how to apply the moral teachings',
        'Applying moral teachings in daily life',
        resources.ethics
      ),
      week(
        5,
        'Religion and Economic Life',
        'Money',
        'B8/JHS2.6.1.1 Plan the wise use of money.',
        'B8/JHS2.6.1.1.2 Identify and explain honest ways of acquiring',
        'Meaning and usefulness of money',
        resources.economic
      ),
      week(
        6,
        'Religion and Economic Life',
        'Money',
        'B8/JHS2.6.1.1 Plan the wise use of money.',
        'B8/JHS2.6.1.1.2 Identify and explain honest ways of acquiring',
        'Honest ways of acquiring money',
        resources.economic
      ),
      week(
        7,
        'Religion and Economic Life',
        'Money',
        'B8/JHS2.6.1.1 Plan the wise use of money.',
        'B8/JHS2.6.1.1.3 Discuss the appropriate ways of using',
        'Appropriate ways of using money',
        resources.economic
      ),
      week(
        8,
        'Religion and Economic Life',
        'Money',
        'B8/JHS2.6.1.1 Plan the wise use of money.',
        'B8/JHS2.6.1.1.2 Identify and explain honest ways of acquiring',
        'Saving, social security and prudent financial planning',
        resources.economic
      ),
      week(
        9,
        'Religion and Economic Life',
        'Bribery and Corruption',
        'B8/JHS2.6.2.1 Explain the need to avoid bribery and corruption and the ways to do so.',
        'B8/JHS2.6.2.1.2 Identify the causes and effects of',
        'Meaning of bribery and corruption',
        resources.economic
      ),
      week(
        10,
        'Religion and Economic Life',
        'Bribery and Corruption',
        'B8/JHS2.6.2.1 Explain the need to avoid bribery and corruption and the ways to do so.',
        'B8/JHS2.6.2.1.2 Identify the causes and effects of',
        'Causes and effects of bribery and corruption',
        resources.economic
      ),
      week(
        11,
        'Religion and Economic Life',
        'Bribery and Corruption',
        'B8/JHS2.6.2.1 Explain the need to avoid bribery and corruption and the ways to do so.',
        'B8/JHS2.6.2.1.2 Identify the causes and effects of',
        'Why bribery and corruption should be avoided',
        resources.economic
      ),
      week(
        12,
        'Religion and Economic Life',
        'Bribery and Corruption',
        'B8/JHS2.6.2.1 Explain the need to avoid bribery and corruption and the ways to do so.',
        'B8/JHS2.6.2.1.2 Identify the causes and effects of',
        'Moral values against bribery and corruption',
        resources.economic
      ),
    ],
  },
];

export const rmeB9Terms: ExplicitCurriculumTerm[] = [
  {
    subject: 'RME',
    classLevel: 'B9',
    term: 'Term 1',
    title: 'B9 RME Scheme of Work - Term 1',
    weeks: [
      week(
        1,
        'God, His Creation and Attributes',
        'The Purpose and Usefulness of God’s Creation',
        'B9/JHS3.1.1.1 Describe and explain the purpose and usefulness of God’s creation.',
        'B9/JHS3.1.1.1.1 Identify the purpose and usefulness of God’s',
        'Purpose and usefulness of God’s creation',
        resources.scriptures
      ),
      week(
        2,
        'God, His Creation and Attributes',
        'The Purpose and Usefulness of God’s Creation',
        'B9/JHS3.1.1.1 Describe and explain the purpose and usefulness of God’s creation.',
        'B9/JHS3.1.1.1.1 Identify the purpose and usefulness of God’s',
        'How creation reveals the nature of God',
        resources.scriptures
      ),
      week(
        3,
        'God, His Creation and Attributes',
        'The Purpose and Usefulness of God’s Creation',
        'B9/JHS3.1.1.1 Describe and explain the purpose and usefulness of God’s creation.',
        'B9/JHS3.1.1.1.1 Identify the purpose and usefulness of God’s',
        'Human responsibility toward creation',
        resources.scriptures
      ),
      week(
        4,
        'God, His Creation and Attributes',
        'The Environment',
        'B9/JHS3.1.2.1 Explain why it is important to care for the environment and how to do so.',
        'B9/JHS3.1.2.1.1 Describe human activities that',
        'Human activities that destroy the environment',
        resources.scriptures
      ),
      week(
        5,
        'God, His Creation and Attributes',
        'The Environment',
        'B9/JHS3.1.2.1 Explain why it is important to care for the environment and how to do so.',
        'B9/JHS3.1.2.1.1 Describe human activities that',
        'Indigenous Ghanaian care for the environment',
        resources.scriptures
      ),
      week(
        6,
        'God, His Creation and Attributes',
        'The Environment',
        'B9/JHS3.1.2.1 Explain why it is important to care for the environment and how to do so.',
        'B9/JHS3.1.2.1.1 Describe human activities that',
        'Reasons for caring for the environment',
        resources.scriptures
      ),
      week(
        7,
        'God, His Creation and Attributes',
        'The Environment',
        'B9/JHS3.1.2.1 Explain why it is important to care for the environment and how to do so.',
        'B9/JHS3.1.2.1.3 Discuss reasons for taking care for the',
        'Practical ways of protecting the environment',
        resources.scriptures
      ),
      week(
        8,
        'Religious Practices',
        'Religious Festivals',
        'B9/JHS3.2.1.1 Understand the relevance of, and the need to participate in, religious festivals.',
        'B9/JHS3.2.1.1.3 Identify and explain the social, religious and',
        'Meaning and types of festivals',
        resources.worship
      ),
      week(
        9,
        'Religious Practices',
        'Religious Festivals',
        'B9/JHS3.2.1.1 Understand the relevance of, and the need to participate in, religious festivals.',
        'B9/JHS3.2.1.1.2 Describe the activities in festivals celebrated',
        'Activities in religious festivals',
        resources.worship
      ),
      week(
        10,
        'Religious Practices',
        'Religious Festivals',
        'B9/JHS3.2.1.1 Understand the relevance of, and the need to participate in, religious festivals.',
        'B9/JHS3.2.1.1.3 Identify and explain the social, religious and',
        'Social and religious importance of festivals',
        resources.worship
      ),
      week(
        11,
        'Religious Practices',
        'Religious Festivals',
        'B9/JHS3.2.1.1 Understand the relevance of, and the need to participate in, religious festivals.',
        'B9/JHS3.2.1.1.3 Identify and explain the social, religious and',
        'Moral lessons from festivals',
        resources.worship
      ),
      week(
        12,
        'Religious Practices',
        'Religious Festivals',
        'B9/JHS3.2.1.1 Understand the relevance of, and the need to participate in, religious festivals.',
        'B9/JHS3.2.1.1.3 Identify and explain the social, religious and',
        'Applying lessons from festivals',
        resources.worship
      ),
    ],
  },
  {
    subject: 'RME',
    classLevel: 'B9',
    term: 'Term 2',
    title: 'B9 RME Scheme of Work - Term 2',
    weeks: [
      week(
        1,
        'The Family and the Community',
        'Religion and Social Cohesion',
        'B9/JHS3.3.1.1 Identify and apply ways people with different religions can co-exist peacefully.',
        'B9/JHS3.3.1.1.3 Identify and explain ways in which people with',
        'Tolerant and intolerant communities',
        resources.family
      ),
      week(
        2,
        'The Family and the Community',
        'Religion and Social Cohesion',
        'B9/JHS3.3.1.1 Identify and apply ways people with different religions can co-exist peacefully.',
        'B9/JHS3.3.1.1.3 Identify and explain ways in which people with',
        'Causes of religious intolerance',
        resources.family
      ),
      week(
        3,
        'The Family and the Community',
        'Religion and Social Cohesion',
        'B9/JHS3.3.1.1 Identify and apply ways people with different religions can co-exist peacefully.',
        'B9/JHS3.3.1.1.3 Identify and explain ways in which people with',
        'Effects of religious intolerance',
        resources.family
      ),
      week(
        4,
        'The Family and the Community',
        'Religion and Social Cohesion',
        'B9/JHS3.3.1.1 Identify and apply ways people with different religions can co-exist peacefully.',
        'B9/JHS3.3.1.1.3 Identify and explain ways in which people with',
        'Ways of promoting peaceful co-existence',
        resources.family
      ),
      week(
        5,
        'The Family and the Community',
        'Religion and Social Cohesion',
        'B9/JHS3.3.1.1 Identify and apply ways people with different religions can co-exist peacefully.',
        'B9/JHS3.3.1.1.3 Identify and explain ways in which people with',
        'Need for inter-religious harmony',
        resources.family
      ),
      week(
        6,
        'The Family and the Community',
        'Religion and Social Cohesion',
        'B9/JHS3.3.1.1 Identify and apply ways people with different religions can co-exist peacefully.',
        'B9/JHS3.3.1.1.3 Identify and explain ways in which people with',
        'Peacebuilding and conflict prevention',
        resources.family
      ),
      week(
        7,
        'Religious Leaders and Personalities',
        'Women in Religion and Leadership Positions',
        'B9/JHS3.4.1.1 Recognise the leadership role of women in society.',
        'B9/JHS3.4.1.1.1 Discuss the contributions of key women in the',
        'Key women in religion and their contributions',
        resources.leadership
      ),
      week(
        8,
        'Religious Leaders and Personalities',
        'Women in Religion and Leadership Positions',
        'B9/JHS3.4.1.1 Recognise the leadership role of women in society.',
        'B9/JHS3.4.1.1.2 Discuss how to apply the moral lessons',
        'Moral lessons from women in religion',
        resources.leadership
      ),
      week(
        9,
        'Religious Leaders and Personalities',
        'Women in Religion and Leadership Positions',
        'B9/JHS3.4.1.1 Recognise the leadership role of women in society.',
        'B9/JHS3.4.1.1.2 Discuss how to apply the moral lessons',
        'Women in religious leadership',
        resources.leadership
      ),
      week(
        10,
        'Religious Leaders and Personalities',
        'Women in Religion and Leadership Positions',
        'B9/JHS3.4.1.1 Recognise the leadership role of women in society.',
        'B9/JHS3.4.1.1.2 Discuss how to apply the moral lessons',
        'Women and national development',
        resources.leadership
      ),
      week(
        11,
        'Religious Leaders and Personalities',
        'Women in Religion and Leadership Positions',
        'B9/JHS3.4.1.1 Recognise the leadership role of women in society.',
        'B9/JHS3.4.1.1.3 Identify and explain the contributions of',
        'Challenging stereotypes about women in leadership',
        resources.leadership
      ),
      week(
        12,
        'Religious Leaders and Personalities',
        'Women in Religion and Leadership Positions',
        'B9/JHS3.4.1.1 Recognise the leadership role of women in society.',
        'B9/JHS3.4.1.1.2 Discuss how to apply the moral lessons',
        'Promoting respect and responsible leadership',
        resources.leadership
      ),
    ],
  },
  {
    subject: 'RME',
    classLevel: 'B9',
    term: 'Term 3',
    title: 'B9 RME Scheme of Work - Term 3',
    weeks: [
      week(
        1,
        'Ethics and Moral Life',
        'Reward, Punishment and Repentance',
        'B9/JHS3.5.1.1 Demonstrate an understanding that good deeds attract reward but bad deeds attract punishment.',
        'B9/JHS3.5.1.1.1 Describe the basis for good deeds and',
        'Good deeds and reward',
        resources.ethics
      ),
      week(
        2,
        'Ethics and Moral Life',
        'Reward, Punishment and Repentance',
        'B9/JHS3.5.1.1 Demonstrate an understanding that good deeds attract reward but bad deeds attract punishment.',
        'B9/JHS3.5.1.1.1 Describe the basis for good deeds and',
        'Examples of good deeds',
        resources.ethics
      ),
      week(
        3,
        'Ethics and Moral Life',
        'Reward, Punishment and Repentance',
        'B9/JHS3.5.1.1 Demonstrate an understanding that good deeds attract reward but bad deeds attract punishment.',
        'B9/JHS3.5.1.1.1 Describe the basis for good deeds and',
        'Importance of rewarding good behaviour',
        resources.ethics
      ),
      week(
        4,
        'Ethics and Moral Life',
        'Reward, Punishment and Repentance',
        'B9/JHS3.5.1.1 Demonstrate an understanding that good deeds attract reward but bad deeds attract punishment.',
        'B9/JHS3.5.1.1.1 Describe the basis for good deeds and',
        'Acts that attract punishment',
        resources.ethics
      ),
      week(
        5,
        'Ethics and Moral Life',
        'Reward, Punishment and Repentance',
        'B9/JHS3.5.1.1 Demonstrate an understanding that good deeds attract reward but bad deeds attract punishment.',
        'B9/JHS3.5.1.1.1 Describe the basis for good deeds and',
        'Reasons for punishment',
        resources.ethics
      ),
      week(
        6,
        'Ethics and Moral Life',
        'Reward, Punishment and Repentance',
        'B9/JHS3.5.1.1 Demonstrate an understanding that good deeds attract reward but bad deeds attract punishment.',
        'B9/JHS3.5.1.1.1 Describe the basis for good deeds and',
        'Meaning and stages of repentance',
        resources.ethics
      ),
      week(
        7,
        'Ethics and Moral Life',
        'Reward, Punishment and Repentance',
        'B9/JHS3.5.1.1 Demonstrate an understanding that good deeds attract reward but bad deeds attract punishment.',
        'B9/JHS3.5.1.1.1 Describe the basis for good deeds and',
        'Repentance, forgiveness and reconciliation',
        resources.ethics
      ),
      week(
        8,
        'Religion and Economic Life',
        'Time and Leisure',
        'B9/JHS3.6.1.1 Develop skills in managing time profitably.',
        'B9/JHS3.6.1.1.1 Explain the meaning of the terms “time”,',
        'Meaning of time, leisure and idleness',
        resources.economic
      ),
      week(
        9,
        'Religion and Economic Life',
        'Time and Leisure',
        'B9/JHS3.6.1.1 Develop skills in managing time profitably.',
        'B9/JHS3.6.1.1.1 Explain the meaning of the terms “time”,',
        'Planning and using time wisely',
        resources.economic
      ),
      week(
        10,
        'Religion and Economic Life',
        'Time and Leisure',
        'B9/JHS3.6.1.1 Develop skills in managing time profitably.',
        'B9/JHS3.6.1.1.2 Demonstrate how to plan and use time',
        'Religious teachings on time management',
        resources.economic
      ),
      week(
        11,
        'Religion and Economic Life',
        'Time and Leisure',
        'B9/JHS3.6.1.1 Develop skills in managing time profitably.',
        'B9/JHS3.6.1.1.1 Explain the meaning of the terms “time”,',
        'Profitable use of leisure',
        resources.economic
      ),
      week(
        12,
        'Religion and Economic Life',
        'Time and Leisure',
        'B9/JHS3.6.1.1 Develop skills in managing time profitably.',
        'B9/JHS3.6.1.1.1 Explain the meaning of the terms “time”,',
        'Balancing work, study, leisure and service',
        resources.economic
      ),
    ],
  },
];
