interface SchemeWeekEntry {
  strand?: string;
  subStrand?: string;
  contentStandard?: string;
  indicator?: string;
  topic?: string;
  resources?: string[];
}

interface SchemeWeek extends SchemeWeekEntry {
  week: number;
  theme?: string;
  entries?: SchemeWeekEntry[];
}

interface LessonAssignment {
  lessonNumber?: number;
  title?: string;
  focus?: string;
  aspect?: string;
  assignedEntry?: SchemeWeekEntry;
  supportExemplars?: string[];
  deferredExemplars?: string[];
  supportIndicators?: string[];
  deferredIndicators?: string[];
  previousRelatedFocus?: string;
  nextRelatedFocus?: string;
}

interface SchemeContext {
  title?: string;
  subject?: string;
  classLevel?: string;
  term?: string;
  selectedWeek?: SchemeWeek;
  previousWeek?: SchemeWeek;
  nextWeek?: SchemeWeek;
  lessonFocusGuidance?: {
    allFocuses?: string[];
    currentFocus?: string;
    assignments?: LessonAssignment[];
    currentAssignment?: LessonAssignment;
  };
}

export interface LessonGenerationBody {
  subject: string;
  classLevel: string;
  week: number;
  term?: string;
  notes?: string;
  sessionIndex?: number;
  sessionsPerWeek?: number;
  weekEnding?: string;
  duration?: string;
  teacherName?: string;
  schoolName?: string;
  schoolDistrict?: string;
  classSize?: string;
  schemeContext?: SchemeContext;
  structuredVisualsEnabled?: boolean;
  visualGenerationEnabled?: boolean;
}

export interface SchemeGenerationBody {
  subject: string;
  classLevel: string;
  term: string;
  academicYear?: string;
  numberOfWeeks?: number;
  notes?: string;
}

export interface TeachingNotesGenerationBody {
  lessonPlan: Record<string, unknown>;
  structuredVisualsEnabled?: boolean;
  visualGenerationEnabled?: boolean;
}

export interface TestItemRewriteBody {
  title: string;
  subject: string;
  classLevel: string;
  termTitle?: string;
  structuredVisualsEnabled?: boolean;
  visualGenerationEnabled?: boolean;
  items: Array<{
    id?: string;
    week?: number;
    lessonNumber?: string;
    topic?: string;
    strand?: string;
    subStrand?: string;
    indicator?: string;
    question?: string;
    marks?: number;
  }>;
  options?: {
    modes?: Array<{
      mode?: string;
      enabled?: boolean;
      questionCount?: number;
    }>;
    totalMarks?: number;
  };
}

const TEACHING_NOTE_GENERATED_BLOCK_TYPES = new Set(['generated_visual', 'image_grid']);
const TEACHING_NOTE_STRUCTURED_BLOCK_TYPES = new Set([
  'labelled_diagram',
  'process_steps',
  'process_diagram',
  'block_diagram',
  'flowchart',
  'timeline',
  'comparison_table',
  'bar_chart',
  'line_graph',
  'frequency_table',
  'tally_table',
  'place_value_table',
  'observation_table',
  'algorithm_trace_table',
  'number_line',
  'coordinate_grid',
  'geometry_shape',
  'fraction_model',
  'venn_diagram',
  'angle_diagram',
  'cycle_diagram',
  'classification_chart',
  'experiment_setup',
  'circuit_diagram',
  'network_diagram',
  'interface_mockup',
  'data_table',
  'story_map',
]);

export const lessonPlanSystemPrompt = `You are an expert curriculum designer for the Ghanaian Basic and Senior High
School standards-based curriculum (NaCCA / GES). You write lesson plans that match
the exact official Ghanaian lesson plan template used by schools across Ghana.

Always respond with a single JSON object only, no markdown or commentary, with this shape:
{
  "termTitle": string,
  "subjectClassTitle": string,
  "weekTitle": string,
  "date": string,
  "period": string,
  "subject": string,
  "duration": string,
  "strand": string,
  "classLevel": string,
  "classSize": string,
  "subStrand": string,
  "topic": string,
  "contentStandard": string,
  "indicator": string,
  "lessonNumber": string,
  "performanceIndicator": string,
  "coreCompetencies": string[],
  "references": string,
  "week": number,
  "phases": [
    {
      "phase": 1,
      "title": "STARTER",
      "duration": string,
      "activities": string[],
      "resources": string[]
    },
    {
      "phase": 2,
      "title": "NEW LEARNING",
      "duration": string,
      "activities": string[],
      "resources": string[],
      "assessment": string[]
    },
    {
      "phase": 3,
      "title": "REFLECTION",
      "duration": string,
      "activities": string[],
      "resources": string[]
    }
  ],
  "visualAids": [
    {
      "type": "labelled_diagram" | "bar_chart" | "line_graph" | "flowchart" | "timeline" | "comparison_table" |
        "frequency_table" | "tally_table" | "place_value_table" | "observation_table" | "algorithm_trace_table" |
        "number_line" | "coordinate_grid" | "geometry_shape" | "fraction_model" | "venn_diagram" |
        "angle_diagram" | "cycle_diagram" | "process_diagram" | "classification_chart" |
        "block_diagram" | "experiment_setup" | "circuit_diagram" | "network_diagram" | "interface_mockup" |
        "data_table" | "story_map",
      "title": string,
      "purpose": string,
      "phase": 1 | 2 | 3,
      "activityLink": string,
      "prompt": string,
      "status": "pending",
      "labels": string[],
      "steps": string[],
      "data": [{ "label": string, "value": number }],
      "rows": [{ "label": string, "value": string }],
      "columns": string[],
      "cells": string[][],
      "min": number,
      "max": number,
      "points": [{ "value": number, "label": string, "x": number, "y": number }],
      "shape": string,
      "segments": number,
      "shadedSegments": number,
      "items": string[],
      "centralNode": string,
      "nodes": string[],
      "groups": [{ "label": string, "items": string[] }],
      "caption": string
    }
  ]
}

Rules:
- When a scheme context is provided, treat it as the authoritative guide for the week's strand, sub-strand,
  content standard, indicator, topic focus, and progression.
- When a scheme context is provided, the output topic, strand, sub-strand, content standard, and indicator
  must match the selected week from that scheme. Do not substitute a different topic from another term or strand.
- When session information is provided, set lessonNumber to match that weekly session, for example "1 of 3",
  "2 of 3", or "3 of 3", and make the activities progress within the same topic across the week.
- When lesson focus guidance is provided, use it as internal curriculum guidance for this session's activities,
  performance indicator, examples, and assessment. Do not add an "exemplars" field to the JSON output.
- For Mathematics, treat exemplar examples as anchor examples: teach the method, solve additional similar
  worked examples, and give learners practice problems around the current lesson focus.
- For Social Studies, treat exemplar guidance as inquiry/action guidance: use discussion, local examples,
  role-play, research, presentation, reflection, or community tasks around the current lesson focus.
- For Computing, treat exemplar guidance as practical ICT guidance: include demonstration, hands-on tool
  exploration, troubleshooting, safe/responsible use, and where useful a small digital artefact or lab task
  around the current lesson focus.
- For Science, treat exemplar guidance as investigation guidance: include observation, prediction,
  demonstration, practical activity, explanation, recording findings, and assessment around the focus.
- For Career Technology, treat exemplar guidance as practical production guidance: include safety, tools,
  materials, design process, workshop/food-lab practice, enterprise thinking, and product evaluation where relevant.
- For RME, treat exemplar guidance as religious and moral application guidance: include respectful discussion,
  scripture or tradition references where appropriate, values reflection, role-play, and daily-life application.
- For Creative Arts and Design, treat exemplar guidance as creative-process guidance: include exploration,
  sketching/design thinking, media and technique practice, making/performance, display, appreciation and appraisal.
- For Ghanaian Language, treat exemplar guidance like language support: use it for oral practice, reading,
  language usage, writing, cultural context, literature response and assessment cues without replacing the selected
  weekly aspect or strand.
- For French Language, treat exemplar guidance like communicative language support: use it for listening,
  speaking, reading, writing, vocabulary, pronunciation, role-play, culture and assessment cues without replacing
  the selected weekly communicative function.
- For English Language, do not split exemplar points as separate weekly topics. Keep the selected scheme entry
  or aspect as the lesson focus, and use exemplar points only as supporting teaching points, practice moves,
  text-response prompts, language-use prompts, or assessment cues.
- Always set duration to "60 mins" unless the request explicitly provides a different duration.
- When a week ending date is provided, put it in the date field.
- When no scheme context is provided, infer the weekly focus from the NaCCA curriculum and the term position:
  Term 1 = beginning of the curriculum sequence, Term 2 = middle sequence, Term 3 = later/end sequence.
- Use Ghanaian English spelling.
- Write the lesson plan in English during normal lesson generation. For Ghanaian Language lessons, write an English lesson plan about teaching the selected Ghanaian-language content; do not translate the whole lesson into Twi, Akan, Ewe, Hausa, Ga, Dagbani, or any other local language unless the separate translation endpoint is explicitly called.
- Do not include translationLanguage, translatedFrom, translationStatus, or localLanguageSupport in normal lesson generation.
- Use culturally relevant Ghanaian examples.
- Make activities age-appropriate.
- Phase 2 must include exactly 3 assessment questions.
- Include at most two visual aids when structured visuals are enabled and they genuinely support a classroom activity. If no visual is useful, return "visualAids": [].
- Prefer subject-appropriate structured visual aids when the topic benefits from one:
  Mathematics: frequency_table, tally_table, place_value_table, number_line, coordinate_grid, geometry_shape, fraction_model, venn_diagram, angle_diagram, bar_chart, line_graph.
  Science: labelled_diagram, process_diagram, cycle_diagram, classification_chart, experiment_setup, observation_table, circuit_diagram, bar_chart, line_graph, comparison_table.
  Computing: flowchart, algorithm_trace_table, block_diagram, process_diagram, network_diagram, interface_mockup, data_table, comparison_table, place_value_table for binary.
  English/languages: story_map, timeline, comparison_table, process_diagram, vocabulary/sentence tables.
  Social Studies/History/RME: timeline, comparison_table, classification_chart, process_diagram, story_map, bar_chart.
  Creative Arts/Career Tech/PE: process_diagram, geometry_shape, comparison_table, timeline, labelled_diagram, flowchart.
- MANDATORY: Every visualAid MUST have a phase (1, 2, or 3). Set phase to the lesson phase where the visual is most helpful. If not set, the visual will appear as a separate section instead of inline.
- MANDATORY: Set activityLink to the specific activity text that this visual supports (copy a phrase from the activities array).
- Visual aids render inline within the phase activities only when phase is correctly set.
- Use labelled_diagram with labels; flowchart/timeline/cycle/process/block/story_map with steps; bar_chart/line_graph with data; comparison_table with rows; table types with columns and cells; number_line with min, max, points; geometry_shape with shape and labels; fraction_model with segments and shadedSegments; network_diagram with centralNode and nodes; classification_chart with groups; experiment_setup/circuit_diagram/interface_mockup with items.
- For visual aids that would benefit from a generated image, include a clear Gemini-ready prompt and set status to "pending". Do not include imageUrl, markdown, SVG, or base64.
- Keep prompts simple, classroom-friendly, culturally appropriate, and labelled where useful. Avoid copyrighted characters, brand names, and unnecessary people.
- Return JSON only.`;

export const lessonPlanNoGeminiVisualRules = `
- AI image generation is turned OFF. Do not include prompt, status, imageUrl, or pending image placeholders on any visualAid.
- Still include structured visualAids when they support the lesson.
- Use only data the app can render as charts, tables, steps, labels, simple shapes, number lines, grids and diagrams.`;

export const lessonPlanNoStructuredVisualRules = `
- Structured classroom visuals are turned OFF. Return "visualAids": [].
- Do not include charts, tables, flowcharts, diagrams, visual placeholders, prompts, or generated image fields.`;

export function getLessonPlanSystemPrompt(options: boolean | {
  structuredVisualsEnabled?: boolean;
  visualGenerationEnabled?: boolean;
} = true) {
  const visualGenerationEnabled = typeof options === 'boolean' ? options : options.visualGenerationEnabled !== false;
  const structuredVisualsEnabled = typeof options === 'boolean' ? true : options.structuredVisualsEnabled !== false;
  if (!structuredVisualsEnabled) return `${lessonPlanSystemPrompt}\n${lessonPlanNoStructuredVisualRules}`;
  if (visualGenerationEnabled) return lessonPlanSystemPrompt;
  return `${lessonPlanSystemPrompt}\n${lessonPlanNoGeminiVisualRules}`;
}

export const schemeSystemPrompt = `You are an expert Ghanaian curriculum planner.
Return a single JSON object only with this shape:
{
  "title": string,
  "subject": string,
  "classLevel": string,
  "term": string,
  "weeks": [
    {
      "week": number,
      "strand": string,
      "subStrand": string,
      "contentStandard": string,
      "indicator": string,
      "topic": string,
      "resources": string[]
    }
  ]
}

Rules:
- Produce the requested number of weeks.
- Base the scheme on the Ghana Education Service / NaCCA curriculum progression for the requested subject and class.
- Respect term progression:
  * Term 1 / First Term = beginning topics and foundations for the curriculum year
  * Term 2 / Second Term = middle topics that logically follow term 1 work
  * Term 3 / Third Term = later or concluding topics for the curriculum year
- Sequence the weeks logically across the term rather than repeating the same strand.
- For each week, provide a clear topic, strand, sub-strand, content standard, and indicator that fit the term position.
- Use Ghanaian curriculum language and examples.
- Return JSON only.`;

export const teachingNotesSystemPrompt = `You are an expert Ghanaian subject teacher and textbook writer.
Generate a learner-facing teaching note from a saved Ghanaian NaCCA/GES lesson plan.
The note should read like a focused textbook section for exactly what the teacher will teach in that lesson, not like a lesson-plan extension.

Always respond with a single JSON object only, no markdown or commentary, with this shape:
{
  "lessonPlanId": string,
  "title": string,
  "subject": string,
  "classLevel": string,
  "week": number,
  "lessonNumber": string,
  "topic": string,
  "overview": string,
  "preparation": string[],
  "phaseGuidance": [
    { "phase": 1, "title": "STARTER", "teacherNotes": string[] },
    { "phase": 2, "title": "NEW LEARNING", "teacherNotes": string[] },
    { "phase": 3, "title": "REFLECTION", "teacherNotes": string[] }
  ],
  "keyExplanations": string[],
  "misconceptions": string[],
  "questionsToAsk": string[],
  "differentiation": string[],
  "classroomManagement": string[],
  "boardSummary": string[],
  "homework": string[],
  "contentBlocks": [
    {
      "id": string,
      "type": "heading" | "paragraph" | "bullet_list" | "worked_example" | "practice_questions" |
        "comparison_table" | "bar_chart" | "line_graph" | "frequency_table" | "tally_table" |
        "place_value_table" | "observation_table" | "algorithm_trace_table" | "number_line" |
        "coordinate_grid" | "geometry_shape" | "fraction_model" | "venn_diagram" | "angle_diagram" |
        "cycle_diagram" | "flowchart" | "process_steps" | "process_diagram" | "block_diagram" |
        "classification_chart" | "experiment_setup" | "circuit_diagram" | "network_diagram" |
        "interface_mockup" | "data_table" | "story_map" | "labelled_diagram" |
        "generated_visual" | "image_grid" | "teacher_tip",
      "visualType": "labelled_diagram" | "bar_chart" | "line_graph" | "flowchart" | "timeline" | "comparison_table" |
        "frequency_table" | "tally_table" | "place_value_table" | "observation_table" | "algorithm_trace_table" |
        "number_line" | "coordinate_grid" | "geometry_shape" | "fraction_model" | "venn_diagram" |
        "angle_diagram" | "cycle_diagram" | "process_diagram" | "classification_chart" |
        "block_diagram" | "experiment_setup" | "circuit_diagram" | "network_diagram" | "interface_mockup" |
        "data_table" | "story_map",
      "title": string,
      "text": string,
      "items": string[],
      "labels": [{ "label": string, "description": string }],
      "rows": string[][],
      "steps": string[],
      "data": [{ "label": string, "value": number }],
      "columns": string[],
      "cells": string[][],
      "min": number,
      "max": number,
      "points": [{ "value": number, "label": string, "x": number, "y": number }],
      "shape": string,
      "segments": number,
      "shadedSegments": number,
      "centralNode": string,
      "nodes": string[],
      "groups": [{ "label": string, "items": string[] }],
      "visualKind": "diagram" | "chart" | "process" | "table" | "board_sketch" | "generated_image",
      "prompt": string,
      "caption": string,
      "status": "pending"
    }
  ],
  "visuals": []
  }
  
  Rules:
  - Ground the notes strictly in the provided lesson plan.
  - Write the content the teacher will teach and the learners can copy/read, not instructions about how to teach.
  - Keep the current JSON structure, but reinterpret the fields as content-note sections:
    * overview = textbook-style introduction to the topic.
    * preparation = key words, prior knowledge, and materials needed to understand the note.
    * phaseGuidance.teacherNotes = the main lesson content, arranged from introduction to worked examples/practice/reflection.
    * keyExplanations = clear definitions, rules, formulas, steps, and examples.
    * misconceptions = common learner errors with corrected explanations.
    * questionsToAsk = learner practice questions and oral review questions.
    * differentiation = extra support examples and extension tasks for learners.
    * classroomManagement = short teacher-only delivery notes; keep this practical and brief.
    * boardSummary = concise learner copy notes for the board.
  - Include worked examples where the subject needs them, especially Mathematics.
  - For Mathematics, include definitions, place-value tables, worked examples, comparison/ordering steps, and practice items.
  - All diagrams and illustrations must appear only inside contentBlocks, placed exactly where they support the nearby explanation, worked example, or activity.
  - Do not use a separate top-level visuals array. Always return "visuals": [].
  - Include structured visual blocks when they help learners understand the topic. Prefer at least one structured block when the subject benefits from a chart, comparison, process, or labelled explanation.
  - Use only visual types the app can render properly: tables, bar_chart, line_graph, number_line, coordinate_grid, geometry_shape, fraction_model, venn_diagram, flowchart/process/block diagrams, cycle_diagram, classification_chart, experiment_setup, circuit_diagram, network_diagram, interface_mockup, story_map, and labelled_diagram.
  - Include visual blocks only when they directly match the subject and topic. Never include examples from another subject.
  - Use bar_chart/line_graph with data; comparison_table/table types with rows or columns+cells; process_steps/flowchart/process_diagram/block_diagram/cycle_diagram/story_map with steps; labelled_diagram with labels; number_line with min/max/points; geometry_shape with shape and labels; fraction_model with segments and shadedSegments; network_diagram with centralNode and nodes; classification_chart with groups; experiment_setup/circuit_diagram/interface_mockup with items.
  - Use generated_visual with visualKind "generated_image" only when a custom illustration is needed; include prompt, status: "pending", and do not include imageUrl.
  - Each generated_visual block must include id, title, visualKind, prompt, caption, status: "pending", and brief text explaining why it supports the nearby content.
  - Include at most two generated_visual blocks per note.
  - Do not include examples, tools, brands, objects, platforms, organisms, places, diagrams, charts, or images unless they are directly required by the lesson topic, strand, sub-strand, content standard, indicator, or planned activities.
  - Keep the JSON complete: overview 3-5 sentences; preparation 4-6 items; each phaseGuidance.teacherNotes 6-9 rich content items; every other text array 4-8 items.
  - Do not wrap the response in markdown fences.
  - Return JSON only.`;

export const teachingNotesNoGeminiVisualRules = `
  - AI image generation (Gemini) is turned OFF for this school.
  - Do not include generated_visual or image_grid blocks. Do not include prompt, status, imageUrl, or image placeholders.
  - Still include structured blocks (bar_chart, comparison_table, process_steps, labelled_diagram) when they support the lesson.
  - Do not mention missing images, diagrams to generate later, or illustration prompts.`;

export const teachingNotesNoStructuredVisualRules = `
  - Structured classroom visuals are turned OFF for this school.
  - Do not include structured visual blocks, charts, tables, diagrams, sketch placeholders, generated_visual, image_grid, prompts, or image placeholders.`;

export function getTeachingNotesSystemPrompt(options: boolean | {
  structuredVisualsEnabled?: boolean;
  visualGenerationEnabled?: boolean;
} = true) {
  const visualGenerationEnabled = typeof options === 'boolean' ? options : options.visualGenerationEnabled !== false;
  const structuredVisualsEnabled = typeof options === 'boolean' ? true : options.structuredVisualsEnabled !== false;
  if (!structuredVisualsEnabled) return `${teachingNotesSystemPrompt}\n${teachingNotesNoStructuredVisualRules}`;
  if (visualGenerationEnabled) return teachingNotesSystemPrompt;
  return `${teachingNotesSystemPrompt}\n${teachingNotesNoGeminiVisualRules}`;
}

export const testItemRewriteSystemPrompt = `You are an expert Ghanaian assessment setter.
Rewrite extracted lesson assessment prompts into a polished classroom test paper.

Always respond with a single JSON object only, no markdown or commentary, with this shape:
{
  "title": string,
  "subject": string,
  "classLevel": string,
  "termTitle": string,
  "instructions": string[],
  "sections": [
    {
      "id": string,
      "title": string,
      "questions": [
        {
          "id": string,
          "text": string,
          "marks": number,
          "mode": "multiple_choice" | "fill_in_blank" | "essay",
          "sourceItemIds": string[],
          "subparts": [
            {
              "label": string,
              "text": string,
              "marks": number
            }
          ],
          "visuals": [
            {
              "type": "labelled_diagram" | "bar_chart" | "line_graph" | "flowchart" | "timeline" | "comparison_table" |
                "frequency_table" | "tally_table" | "place_value_table" | "observation_table" | "algorithm_trace_table" |
                "number_line" | "coordinate_grid" | "geometry_shape" | "fraction_model" | "venn_diagram" |
                "angle_diagram" | "cycle_diagram" | "process_diagram" | "classification_chart" |
                "block_diagram" | "experiment_setup" | "circuit_diagram" | "network_diagram" | "interface_mockup" |
                "data_table" | "story_map",
              "title": string,
              "purpose": string,
              "labels": string[],
              "steps": string[],
              "data": [{ "label": string, "value": number }],
              "rows": [{ "label": string, "value": string }],
              "columns": string[],
              "cells": string[][],
              "min": number,
              "max": number,
              "points": [{ "value": number, "label": string, "x": number, "y": number }],
              "shape": string,
              "segments": number,
              "shadedSegments": number,
              "items": string[],
              "centralNode": string,
              "nodes": string[],
              "groups": [{ "label": string, "items": string[] }],
              "caption": string,
              "prompt": string,
              "status": "pending"
            }
          ]
        }
      ]
    }
  ],
  "answerKey": [
    {
      "questionId": string,
      "answer": string,
      "markingGuide": string[],
      "marks": number
    }
  ],
  "totalMarks": number
}

Rules:
- Use only the selected source items. Do not introduce new curriculum coverage.
- Preserve Ghanaian classroom context and Ghanaian English spelling.
- Keep curriculum alignment with the source week, topic, strand, sub-strand, and indicator metadata.
- Group sections by week and lesson unless the source items clearly need a simpler combined section.
- Respect requested test modes. If a mode has a questionCount, create exactly that many MAIN questions for that mode.
- A MAIN question is one object in sections[].questions and one numbered item on the paper. Do not combine two or more requested questions into one major question.
- For example, if essay has questionCount 5, return exactly five essay question objects, numbered as five main questions.
- Subparts are allowed only inside a main question's subparts array. Subparts may test smaller steps of that one main question, but they do not count as additional main questions and must not replace the requested main-question count.
- If a mode is selected without a questionCount, choose a sensible number based on the source items and total marks.
- If totalMarks is provided, distribute marks across all MAIN questions so the final totalMarks equals the requested value. When a main question has subparts, the subpart marks should add up to that main question's marks.
- Multiple choice questions must include options A-D in the question text and the answer key must give the correct option and answer.
- Format multiple choice options as separate lines in the question text using A., B., C., and D.
- Fill-in questions should be short completion items with clear expected answers.
- Essay type questions should use explain, discuss, describe, compare, justify, or evaluate prompts for theory-heavy subjects.
- For Mathematics, "essay" means constructed-response problem-solving questions. Ask learners to calculate, simplify, solve,
  prove by working, draw/interpret, or apply a method, and require clear working where appropriate. Do not turn Mathematics
  essay questions into concept-description prompts unless the source item itself explicitly asks for an explanation.
- For Mathematics, prefer precise notation such as \frac{3}{4}, \sqrt{18}, x^{2}, \vec{AB}, inequalities, equations,
  tables, diagrams, and multi-step word problems that demand an answer with working.
- When a question genuinely requires a visual, attach it in that question's visuals array and make the question text refer to it clearly, e.g. "Use the diagram below...".
- Use question-level visuals for number lines, fraction models, geometry shapes, coordinate grids, Venn diagrams, bar/line charts, frequency/tally/place-value tables, circuits, flowcharts, algorithm trace tables, network diagrams, timelines, and labelled diagrams when they improve assessment quality.
- If image generation is enabled, visuals that need a custom generated illustration may include a clear classroom-friendly prompt and status: "pending".
- If image generation is disabled, do not include generated image prompts or image placeholders. Use only structured visual data the app can render.
- If structured visuals are turned off, return "visuals": [] for every question and write text-only questions.
- Do not include any instruction about silent electronic calculators.
- If workings are needed, use exactly this instruction: "All workings in Section B must be shown clearly."
- Improve clarity and test-paper wording, but keep the same skill or knowledge demand as the source prompt.
- Keep marks modest and appropriate. If the source mark is provided, use it unless the rewrite truly requires a small adjustment.
- Provide a concise answer or expected response for every question.
- Provide markingGuide items that a teacher can use quickly while marking.
- Return JSON only.`;

export function buildTestItemRewritePrompt(body: TestItemRewriteBody): string {
  const items = Array.isArray(body.items) ? body.items : [];
  return (
    `Create a formal classroom test paper from these extracted lesson assessment items.\n` +
    `- Title: ${body.title}\n` +
    `- Subject: ${body.subject}\n` +
    `- Class Level: ${body.classLevel}\n` +
    (body.termTitle ? `- Term: ${body.termTitle}\n` : '') +
    (body.options?.totalMarks ? `- Required total marks: ${body.options.totalMarks}\n` : '- Total marks: AI may decide\n') +
    `- Requested test modes: ${formatTestModeOptions(body.options?.modes)}\n` +
    `- Structured question visuals: ${body.structuredVisualsEnabled === false ? 'OFF. Return visuals: [] on all questions.' : 'ON. Add question-level visuals only when they improve the assessment.'}\n` +
    `- AI-generated question images: ${body.visualGenerationEnabled === false ? 'OFF. Do not include prompt, status, imageUrl or pending image placeholders on visuals.' : 'ON. Include prompt and status: "pending" on visuals that should become generated image files.'}\n` +
    `- Source items JSON:\n${JSON.stringify(items)}\n\n` +
    `Return the JSON object only.`
  );
}

export function normalizeTestItemRewriteResponse(
  payload: Record<string, unknown>,
  body: TestItemRewriteBody,
) {
  const sections = Array.isArray(payload?.sections) ? payload.sections : [];
  const normalizedSections = sections
    .filter((section) => section && typeof section === 'object')
    .map((section, sectionIndex) => {
      const sectionRecord = section as Record<string, unknown>;
      const questions = Array.isArray(sectionRecord.questions) ? sectionRecord.questions : [];
      return {
        id: cleanText(sectionRecord.id) || `section-${sectionIndex + 1}`,
        title: cleanText(sectionRecord.title) || `Section ${sectionIndex + 1}`,
        questions: questions
          .filter((question) => question && typeof question === 'object')
          .map((question, questionIndex) => {
            const questionRecord = question as Record<string, unknown>;
            const marks = Math.max(1, Math.round(Number(questionRecord.marks) || 1));
            return {
              id: cleanText(questionRecord.id) || `${sectionIndex + 1}.${questionIndex + 1}`,
              text: cleanText(questionRecord.text),
              marks,
              mode: normalizeTestMode(questionRecord.mode),
              sourceItemIds: cleanStringList(questionRecord.sourceItemIds, 20),
              subparts: normalizeTestQuestionSubparts(questionRecord.subparts ?? questionRecord.subQuestions),
              visuals: body.structuredVisualsEnabled === false
                ? []
                : normalizeVisualAids(questionRecord.visuals, body.visualGenerationEnabled !== false, Number.POSITIVE_INFINITY),
            };
          })
          .filter((question) => question.text)
          .slice(0, 80),
      };
    })
    .filter((section) => section.questions.length)
    .slice(0, 20);

  const requestedCounts = getRequestedModeCounts(body.options?.modes);
  const countAdjustedSections = enforceRequestedTestModeCounts(normalizedSections, body, requestedCounts);
  const markAdjustedSections = distributeRequestedTestMarks(countAdjustedSections, body.options?.totalMarks);

  const answerKeyValue = Array.isArray(payload?.answerKey) ? payload.answerKey : [];
  const rawAnswerKey = answerKeyValue
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const record = item as Record<string, unknown>;
      return {
        questionId: cleanText(record.questionId),
        answer: cleanText(record.answer),
        markingGuide: cleanStringList(record.markingGuide, 8),
        marks: Math.max(1, Math.round(Number(record.marks) || 1)),
      };
    })
    .filter((item) => item.questionId && item.answer)
    .slice(0, 80);

  const marksByQuestion = new Map<string, number>();
  markAdjustedSections.forEach((section) => section.questions.forEach((question) => marksByQuestion.set(question.id, question.marks)));
  const answerKey = rawAnswerKey.map((item) => ({
    ...item,
    marks: marksByQuestion.get(item.questionId) ?? item.marks,
  }));

  const totalMarks = markAdjustedSections.reduce(
      (sum, section) => sum + section.questions.reduce((sectionSum, question) => sectionSum + question.marks, 0),
      0,
    );

  return {
    id: `test-paper-${slugify(body.subject)}-${slugify(body.classLevel)}-${Date.now()}`,
    title: cleanText(payload?.title) || body.title || `${body.subject} ${body.classLevel} Test Paper`,
    subject: cleanText(payload?.subject) || body.subject,
    classLevel: cleanText(payload?.classLevel) || body.classLevel,
    termTitle: cleanText(payload?.termTitle) || cleanText(body.termTitle),
    instructions: normalizeTestPaperInstructions(cleanStringList(payload?.instructions, 8)).length
      ? normalizeTestPaperInstructions(cleanStringList(payload?.instructions, 8))
      : ['Answer all questions.', 'Write clearly and show working where necessary.'],
    sections: markAdjustedSections,
    answerKey,
    totalMarks,
    createdAt: new Date().toISOString(),
  };
}

function normalizeTestMode(value: unknown) {
  const mode = cleanText(value);
  return ['multiple_choice', 'fill_in_blank', 'essay'].includes(mode) ? mode : undefined;
}

function normalizeTestQuestionSubparts(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === 'object')
    .map((item, index) => {
      const record = item as Record<string, unknown>;
      const label = cleanText(record.label) || String.fromCharCode(97 + index);
      const text = cleanText(record.text ?? record.question);
      const marks = Math.round(Number(record.marks));
      if (!text) return null;
      return {
        label,
        text,
        marks: Number.isFinite(marks) && marks > 0 ? marks : undefined,
      };
    })
    .filter((item): item is { label: string; text: string; marks: number | undefined } => Boolean(item))
    .slice(0, 8);
}

function getRequestedModeCounts(modes?: NonNullable<TestItemRewriteBody['options']>['modes']) {
  const counts = new Map<string, number>();
  if (!Array.isArray(modes)) return counts;
  modes.forEach((mode) => {
    const modeName = normalizeTestMode(mode?.mode);
    const count = Math.round(Number(mode?.questionCount));
    if (mode?.enabled !== false && modeName && Number.isFinite(count) && count > 0) {
      counts.set(modeName, count);
    }
  });
  return counts;
}

function enforceRequestedTestModeCounts<T extends {
  id: string;
  title: string;
  questions: Array<{
    id: string;
    text: string;
    marks: number;
    mode?: string;
    sourceItemIds: string[];
    subparts?: Array<{ label: string; text: string; marks?: number }>;
    visuals?: unknown[];
  }>;
}>(sections: T[], body: TestItemRewriteBody, requestedCounts: Map<string, number>): T[] {
  if (!requestedCounts.size) return sections;

  const adjustedSections = sections.map((section) => ({ ...section, questions: [...section.questions] }));
  const allQuestions = adjustedSections.flatMap((section) => section.questions);
  requestedCounts.forEach((requiredCount, mode) => {
    let modeQuestions = allQuestions.filter((question) => question.mode === mode);

    if (modeQuestions.length > requiredCount) {
      let remaining = requiredCount;
      adjustedSections.forEach((section) => {
        section.questions = section.questions.filter((question) => {
          if (question.mode !== mode) return true;
          if (remaining > 0) {
            remaining -= 1;
            return true;
          }
          return false;
        });
      });
      modeQuestions = adjustedSections.flatMap((section) => section.questions).filter((question) => question.mode === mode);
    }

    if (modeQuestions.length >= requiredCount) return;

    const targetSection = adjustedSections.find((section) => section.questions.some((question) => question.mode === mode)) ?? adjustedSections[0];
    if (!targetSection) return;
    const sourceItems = Array.isArray(body.items) ? body.items : [];
    for (let index = modeQuestions.length; index < requiredCount; index += 1) {
      const sourceItem = sourceItems[index % Math.max(1, sourceItems.length)] ?? {};
      const questionId = String(adjustedSections.flatMap((section) => section.questions).length + 1);
      const questionText =
        cleanText(sourceItem.question) ||
        `${mode === 'essay' ? 'Discuss' : mode === 'fill_in_blank' ? 'Complete' : 'Answer'} a curriculum-aligned question from the selected assessment item.`;
      targetSection.questions.push({
        id: questionId,
        text: questionText,
        marks: 1,
        mode,
        sourceItemIds: cleanText(sourceItem.id) ? [cleanText(sourceItem.id)] : [],
        subparts: [],
        visuals: [],
      });
    }
  });

  return adjustedSections.filter((section) => section.questions.length) as T[];
}

function distributeRequestedTestMarks<T extends {
  questions: Array<{
    marks: number;
    subparts?: Array<{ marks?: number }>;
  }>;
}>(sections: T[], requestedTotal?: number): T[] {
  const total = Math.round(Number(requestedTotal));
  const questions = sections.flatMap((section) => section.questions);
  if (!Number.isFinite(total) || total <= 0 || !questions.length) return sections;

  const baseMark = Math.max(1, Math.floor(total / questions.length));
  let remainder = Math.max(0, total - baseMark * questions.length);
  questions.forEach((question) => {
    question.marks = baseMark + (remainder > 0 ? 1 : 0);
    remainder -= 1;
    if (question.subparts?.length) {
      distributeQuestionSubpartMarks(question.subparts, question.marks);
    }
  });
  return sections;
}

function distributeQuestionSubpartMarks(subparts: Array<{ marks?: number }>, questionMarks: number) {
  if (!subparts.length) return;
  const baseMark = Math.max(1, Math.floor(questionMarks / subparts.length));
  let remainder = Math.max(0, questionMarks - baseMark * subparts.length);
  subparts.forEach((subpart) => {
    subpart.marks = baseMark + (remainder > 0 ? 1 : 0);
    remainder -= 1;
  });
}

function normalizeTestPaperInstructions(instructions: string[]) {
  return instructions
    .map((instruction) => cleanText(instruction))
    .filter(Boolean)
    .filter((instruction) => !/silent\s+electronic\s+calculators?\s+should\s+be\s+used/i.test(instruction))
    .map((instruction) =>
      /all\s+workings\s+must\s+be\s+shown\s+clearly/i.test(instruction)
        ? 'All workings in Section B must be shown clearly.'
        : instruction,
    );
}

function formatTestModeOptions(modes?: NonNullable<TestItemRewriteBody['options']>['modes']) {
  const enabled = Array.isArray(modes) ? modes.filter((mode) => mode?.enabled !== false && cleanText(mode?.mode)) : [];
  if (!enabled.length) return 'AI may choose the best mix of multiple_choice, fill_in_blank, and essay questions.';
  return enabled
    .map((mode) => {
      const count = Number(mode.questionCount);
      return `${cleanText(mode.mode)}${Number.isFinite(count) && count > 0 ? ` (${Math.round(count)} questions)` : ' (AI decides count)'}`;
    })
    .join(', ');
}

export function buildLessonPrompt(body: LessonGenerationBody): string {
  const sessionBlock =
    body.sessionIndex && body.sessionsPerWeek
      ? `\nThis lesson is session ${body.sessionIndex} of ${body.sessionsPerWeek} for the week.
Shape the activities as part of the assigned weekly lesson sequence:
- Use the current lesson assignment or current focus as the main boundary.
- Do not assume every lesson in the week teaches the same topic when the scheme has multiple entries/aspects.
- Later sessions should deepen, practise, apply, assess, or extend only their assigned entry/aspect.\n`
      : '';

  const schemeContextBlock = body.schemeContext
    ? `\nUse this saved term scheme as the primary curriculum guide for this lesson:
- Scheme title: ${body.schemeContext.title || ''}
- Subject: ${body.schemeContext.subject || ''}
- Class Level: ${body.schemeContext.classLevel || ''}
- Term: ${body.schemeContext.term || ''}
${formatWeekBlock('Selected week', body.schemeContext.selectedWeek)}${formatWeekBlock(
        'Previous week',
        body.schemeContext.previousWeek,
      )}${formatWeekBlock('Next week', body.schemeContext.nextWeek)}
${formatLessonFocusGuidance(body.schemeContext.lessonFocusGuidance)}

The lesson plan must align tightly with the selected scheme week. Use the strand, sub-strand, indicator,
content standard, and topic progression from the scheme. Do not jump ahead to later-term content unless the
scheme context explicitly does so.\n`
    : '\nIf no saved scheme context is provided, infer the correct week focus from the NaCCA curriculum progression for the requested term.\n';

  return (
    `Draft a complete Ghanaian lesson plan for:\n` +
    `- Subject: ${body.subject}\n` +
    `- Class Level: ${body.classLevel}\n` +
    `- Week: ${body.week}\n` +
    (body.term ? `- Term: ${body.term}\n` : '') +
    (body.weekEnding ? `- Week ending: ${body.weekEnding}\n` : '') +
    (body.duration ? `- Lesson duration: ${body.duration}\n` : '- Lesson duration: 60 mins\n') +
    (body.classSize ? `- Class size: ${body.classSize}\n` : '') +
    (body.notes ? `- Additional notes: ${body.notes}\n` : '') +
    sessionBlock +
    schemeContextBlock +
    `\nReturn the JSON object only.`
  );
}

export function buildSchemePrompt(body: SchemeGenerationBody): string {
  const weeks = body.numberOfWeeks ?? 12;

  return (
    `Generate a ${weeks}-week Scheme of Work for:\n` +
    `- Subject: ${body.subject}\n` +
    `- Class: ${body.classLevel}\n` +
    `- Term: ${body.term}\n` +
    (body.academicYear ? `- Academic Year: ${body.academicYear}\n` : '') +
    (body.notes ? `- Notes: ${body.notes}\n` : '') +
    `\nReturn the JSON object only.`
  );
}

export function buildTeachingNotesPrompt(body: TeachingNotesGenerationBody): string {
  const visualsOff = body.visualGenerationEnabled === false;
  return (
    `Generate a textbook-style learner teaching note for this saved lesson plan.\n` +
    `The output should contain the actual lesson content to teach, including clear explanations and worked examples where useful.\n` +
    (visualsOff
      ? `AI image generation is disabled. Use structured chart/table/diagram blocks only (no generated_visual or image_grid).\n`
      : '') +
    `Lesson plan JSON:\n${JSON.stringify(body.lessonPlan)}\n\n` +
    `Return one complete JSON object only. Do not use markdown fences.`
  );
}

export function normalizeLessonPlanResponse(
  payload: Record<string, unknown>,
  body: LessonGenerationBody,
) {
  const {
    localLanguageSupport: _localLanguageSupport,
    translationLanguage: _translationLanguage,
    translatedFrom: _translatedFrom,
    translationStatus: _translationStatus,
    ...lessonPayload
  } = payload;
  const selectedWeek = body?.schemeContext?.selectedWeek;
  const assignedEntry = body?.schemeContext?.lessonFocusGuidance?.currentAssignment?.assignedEntry;
  const primaryEntry =
    assignedEntry ||
    (Array.isArray(selectedWeek?.entries) && selectedWeek.entries.length
      ? selectedWeek.entries[0]
      : null);
  const termLabel = cleanText(body?.term) || cleanText(body?.schemeContext?.term) || 'Term';
  const subject = cleanText(lessonPayload?.subject) || cleanText(body?.subject);
  const classLevel = cleanText(lessonPayload?.classLevel) || cleanText(body?.classLevel);
  const sessionIndex = Number(body?.sessionIndex) || undefined;
  const sessionsPerWeek = Number(body?.sessionsPerWeek) || undefined;

  return {
    ...lessonPayload,
    subject,
    classLevel,
    week: Number(lessonPayload?.week) || Number(body?.week) || 1,
    weekTitle: cleanText(lessonPayload?.weekTitle) || `WEEK ${Number(body?.week) || 1}`,
    date: cleanText(lessonPayload?.date) || cleanText(body?.weekEnding),
    duration: cleanText(body?.duration) || cleanText(lessonPayload?.duration) || '60 mins',
    classSize: cleanText(body?.classSize) || cleanText(lessonPayload?.classSize),
    termTitle:
      cleanText(lessonPayload?.termTitle) ||
      `${termLabel.toUpperCase()} LESSON PLAN`,
    subjectClassTitle:
      cleanText(lessonPayload?.subjectClassTitle) ||
      `${subject.toUpperCase()} - ${classLevel.toUpperCase()}`,
    lessonNumber:
      cleanText(lessonPayload?.lessonNumber) ||
      (sessionIndex && sessionsPerWeek ? `${sessionIndex} of ${sessionsPerWeek}` : ''),
    sessionIndex,
    sessionsPerWeek,
    strand: cleanText(primaryEntry?.strand) || cleanText(lessonPayload?.strand) || selectedWeek?.strand,
    subStrand:
      cleanText(primaryEntry?.subStrand) || cleanText(lessonPayload?.subStrand) || selectedWeek?.subStrand,
    topic: cleanText(primaryEntry?.topic) || cleanText(lessonPayload?.topic) || selectedWeek?.topic,
    contentStandard:
      cleanText(primaryEntry?.contentStandard) ||
      cleanText(lessonPayload?.contentStandard) ||
      selectedWeek?.contentStandard,
    indicator:
      cleanText(primaryEntry?.indicator) || cleanText(lessonPayload?.indicator) || selectedWeek?.indicator,
    references:
      cleanText(lessonPayload?.references) ||
      (selectedWeek?.topic ? `Scheme topic: ${selectedWeek.topic}` : ''),
    visualAids: body.structuredVisualsEnabled === false
      ? []
      : normalizeVisualAids(lessonPayload?.visualAids, body.visualGenerationEnabled !== false),
    teacherName: cleanText(body?.teacherName),
    schoolName: cleanText(body?.schoolName),
    schoolDistrict: cleanText(body?.schoolDistrict),
    localLanguageSupport: undefined,
    translationLanguage: undefined,
    translatedFrom: undefined,
    translationStatus: undefined,
  };
}

function normalizeVisualAids(value: unknown, includeGeneratedImages = true, limit = 2) {
  if (!Array.isArray(value)) return [];
  const allowedTypes = new Set([
    'labelled_diagram',
    'bar_chart',
    'line_graph',
    'flowchart',
    'timeline',
    'comparison_table',
    'frequency_table',
    'tally_table',
    'place_value_table',
    'observation_table',
    'algorithm_trace_table',
    'number_line',
    'coordinate_grid',
    'geometry_shape',
    'fraction_model',
    'venn_diagram',
    'angle_diagram',
    'cycle_diagram',
    'process_diagram',
    'block_diagram',
    'classification_chart',
    'experiment_setup',
    'circuit_diagram',
    'network_diagram',
    'interface_mockup',
    'data_table',
    'story_map',
  ]);

  const maxItems = Number.isFinite(limit) ? Math.max(0, limit) : value.length;

  return value
    .slice(0, maxItems)
    .map((item) => {
      const visual = item as Record<string, unknown>;
      const type = cleanText(visual?.type);
      const title = cleanText(visual?.title);
      if (!allowedTypes.has(type) || !title) return null;
      const phase = Number(visual?.phase);
      const prompt = includeGeneratedImages ? cleanText(visual?.prompt) : '';

      return {
        type,
        title,
        purpose: cleanText(visual?.purpose),
        phase: phase === 1 || phase === 2 || phase === 3 ? phase : undefined,
        activityLink: cleanText(visual?.activityLink),
        labels: cleanStringList(visual?.labels, 6),
        steps: cleanStringList(visual?.steps, 6),
        data: cleanChartData(visual?.data),
        rows: cleanVisualRows(visual?.rows),
        columns: cleanStringList(visual?.columns, 6),
        cells: cleanCellRows(visual?.cells),
        min: finiteNumber(visual?.min),
        max: finiteNumber(visual?.max),
        points: cleanVisualPoints(visual?.points),
        shape: cleanText(visual?.shape),
        segments: finiteNumber(visual?.segments),
        shadedSegments: finiteNumber(visual?.shadedSegments),
        items: cleanStringList(visual?.items, 8),
        centralNode: cleanText(visual?.centralNode),
        nodes: cleanStringList(visual?.nodes, 8),
        groups: cleanVisualGroups(visual?.groups),
        caption: cleanText(visual?.caption),
        id: cleanText(visual?.id) || `visual-${slugify(title)}-${Date.now()}`,
        prompt,
        imageUrl: includeGeneratedImages ? cleanText(visual?.imageUrl) : '',
        storagePath: includeGeneratedImages ? cleanText(visual?.storagePath) : '',
        status: includeGeneratedImages && prompt ? cleanText(visual?.status) || 'pending' : undefined,
        error: cleanText(visual?.error),
      };
    })
    .filter(Boolean);
}

function cleanCellRows(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((row) => Array.isArray(row))
    .map((row) => (row as unknown[]).map((cell) => cleanText(cell)).slice(0, 6))
    .filter((row) => row.some(Boolean))
    .slice(0, 8);
}

function cleanVisualPoints(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const point = item as Record<string, unknown>;
      const value = finiteNumber(point?.value);
      const x = finiteNumber(point?.x);
      const y = finiteNumber(point?.y);
      if (value == null && (x == null || y == null)) return null;
      return {
        value: value ?? 0,
        label: cleanText(point?.label),
        x: x ?? undefined,
        y: y ?? undefined,
      };
    })
    .filter(Boolean)
    .slice(0, 10);
}

function cleanVisualGroups(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const group = item as Record<string, unknown>;
      const label = cleanText(group?.label);
      const items = cleanStringList(group?.items, 6);
      if (!label && !items.length) return null;
      return { label: label || 'Group', items };
    })
    .filter(Boolean)
    .slice(0, 4);
}

function finiteNumber(value: unknown) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : undefined;
}

function cleanStringList(value: unknown, limit: number) {
  return Array.isArray(value)
    ? value.map((item) => cleanText(item)).filter(Boolean).slice(0, limit)
    : [];
}

function cleanChartData(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const row = item as Record<string, unknown>;
      const label = cleanText(row?.label);
      const numericValue = Number(row?.value);
      if (!label || !Number.isFinite(numericValue)) return null;
      return { label, value: numericValue };
    })
    .filter(Boolean)
    .slice(0, 5);
}

function cleanVisualRows(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const row = item as Record<string, unknown>;
      const label = cleanText(row?.label);
      const rowValue = cleanText(row?.value);
      if (!label || !rowValue) return null;
      return { label, value: rowValue };
    })
    .filter(Boolean)
    .slice(0, 5);
}

export function normalizeSchemeResponse(
  payload: Record<string, unknown>,
  input: SchemeGenerationBody,
) {
  const weeks = Array.isArray(payload?.weeks) ? payload.weeks : [];
  const normalizedWeeks = normalizeParsedWeeks(
    weeks.map((week, index) => ({
      week: parseWeekNumber((week as Record<string, unknown>)?.week, index),
      strand: cleanText((week as Record<string, unknown>)?.strand),
      subStrand: cleanText((week as Record<string, unknown>)?.subStrand),
      contentStandard: cleanText((week as Record<string, unknown>)?.contentStandard),
      indicator: cleanText((week as Record<string, unknown>)?.indicator),
      topic: cleanText((week as Record<string, unknown>)?.topic),
      resources: Array.isArray((week as Record<string, unknown>)?.resources)
        ? ((week as Record<string, unknown>).resources as unknown[])
            .map((item) => cleanText(item))
            .filter(Boolean)
        : [],
    })),
    input.numberOfWeeks ?? 12,
  );

  return {
    id: `${slugify(input.subject)}-${input.classLevel}-${slugify(input.term)}-${Date.now()}`,
    title:
      cleanText(payload?.title) ||
      `${input.subject} Scheme of Work - ${input.classLevel} ${input.term}`,
    subject: cleanText(payload?.subject) || input.subject,
    classLevel: cleanText(payload?.classLevel) || input.classLevel,
    term: cleanText(payload?.term) || input.term,
    academicYear: cleanText(payload?.academicYear) || input.academicYear || undefined,
    weeks: normalizedWeeks,
    createdAt: new Date().toISOString(),
  };
}

export function normalizeTeachingNotesResponse(
  payload: Record<string, unknown>,
  body: TeachingNotesGenerationBody,
) {
  const lessonPlan = body.lessonPlan ?? {};
  const subject = cleanText(payload?.subject) || cleanText(lessonPlan.subject);
  const classLevel = cleanText(payload?.classLevel) || cleanText(lessonPlan.classLevel);
  const week = Number(payload?.week) || Number(lessonPlan.week) || 1;
  const lessonPlanId = cleanText(payload?.lessonPlanId) || cleanText(lessonPlan.id) || `${subject}-${classLevel}-${week}`;

  return {
    ...payload,
    lessonPlanId,
    title: cleanText(payload?.title) || `Teaching Notes: ${subject} ${classLevel} Week ${week}`,
    subject,
    classLevel,
    week,
    lessonNumber: cleanText(payload?.lessonNumber) || cleanText(lessonPlan.lessonNumber),
    topic: cleanText(payload?.topic) || cleanText(lessonPlan.topic),
    preparation: arrayOfText(payload?.preparation),
    phaseGuidance: Array.isArray(payload?.phaseGuidance) ? payload.phaseGuidance : [],
    keyExplanations: arrayOfText(payload?.keyExplanations),
    misconceptions: arrayOfText(payload?.misconceptions),
    questionsToAsk: arrayOfText(payload?.questionsToAsk),
    differentiation: arrayOfText(payload?.differentiation),
    classroomManagement: arrayOfText(payload?.classroomManagement),
    boardSummary: arrayOfText(payload?.boardSummary),
    homework: arrayOfText(payload?.homework),
    contentBlocks: filterTeachingNoteVisualBlocks(
      normalizeTeachingNoteBlocks(
        payload?.contentBlocks,
        body.visualGenerationEnabled === false ? [] : payload?.visuals,
      ),
      {
        includeStructuredVisuals: body.structuredVisualsEnabled !== false,
        includeGeneratedVisuals: body.visualGenerationEnabled !== false,
      },
    ),
    visuals: [],
    sourceLessonPlan: {
      id: cleanText(lessonPlan.id),
      subject: cleanText(lessonPlan.subject),
      classLevel: cleanText(lessonPlan.classLevel),
      week: Number(lessonPlan.week) || week,
      lessonNumber: cleanText(lessonPlan.lessonNumber),
      topic: cleanText(lessonPlan.topic),
      strand: cleanText(lessonPlan.strand),
      subStrand: cleanText(lessonPlan.subStrand),
    },
    createdAt: new Date().toISOString(),
  };
}

function arrayOfText(value: unknown) {
  return Array.isArray(value) ? value.map((item) => cleanText(item)).filter(Boolean) : [];
}

function filterTeachingNoteVisualBlocks<T extends { type?: string; prompt?: string; imageUrl?: string; status?: string }>(
  blocks: T[],
  options: { includeStructuredVisuals: boolean; includeGeneratedVisuals: boolean },
) {
  return blocks.filter((block) => {
    const type = cleanText(block.type);
    if (!options.includeStructuredVisuals && TEACHING_NOTE_STRUCTURED_BLOCK_TYPES.has(type)) return false;
    if (!options.includeGeneratedVisuals && TEACHING_NOTE_GENERATED_BLOCK_TYPES.has(type)) return false;
    return true;
  });
}

function normalizeTeachingNoteBlocks(value: unknown, legacyVisuals: unknown = []) {
  const blocks: Array<Record<string, unknown>> = Array.isArray(value)
    ? value
        .filter((item) => item && typeof item === 'object')
        .map((item, index) => normalizeTeachingNoteBlock(item as Record<string, unknown>, index))
    : [];
  const blockIds = new Set(blocks.map((block) => block.id));

  if (Array.isArray(legacyVisuals)) {
    for (const item of legacyVisuals) {
      if (!item || typeof item !== 'object') continue;
      const legacyBlock = legacyVisualToContentBlock(item as Record<string, unknown>);
      if (!legacyBlock || blockIds.has(legacyBlock.id)) continue;
      blocks.push(legacyBlock);
      blockIds.add(legacyBlock.id);
    }
  }

  return blocks;
}

function normalizeTeachingNoteBlock(block: Record<string, unknown>, index: number) {
  return {
    id: cleanText(block.id) || `block-${index + 1}`,
    type: cleanText(block.type) || 'paragraph',
    visualType: cleanText(block.visualType),
    title: cleanText(block.title),
    text: cleanText(block.text),
    items: arrayOfText(block.items),
    rows: Array.isArray(block.rows)
      ? block.rows
          .filter((row) => Array.isArray(row))
          .map((row) => (row as unknown[]).map((cell) => cleanText(cell)))
          .filter((row) => row.some(Boolean))
      : [],
    steps: arrayOfText(block.steps),
    data: cleanChartData(block.data),
    columns: cleanStringList(block.columns, 6),
    cells: cleanCellRows(block.cells),
    min: finiteNumber(block.min),
    max: finiteNumber(block.max),
    points: cleanVisualPoints(block.points),
    shape: cleanText(block.shape),
    segments: finiteNumber(block.segments),
    shadedSegments: finiteNumber(block.shadedSegments),
    centralNode: cleanText(block.centralNode),
    nodes: cleanStringList(block.nodes, 8),
    groups: cleanVisualGroups(block.groups),
    labels: Array.isArray(block.labels)
      ? block.labels
          .filter((label) => label && typeof label === 'object')
          .map((label) => ({
            label: cleanText((label as Record<string, unknown>).label),
            description: cleanText((label as Record<string, unknown>).description),
          }))
          .filter((label) => label.label)
      : [],
    imageItems: Array.isArray(block.imageItems)
      ? block.imageItems
          .filter((image) => image && typeof image === 'object')
          .map((image) => ({
            label: cleanText((image as Record<string, unknown>).label),
            description: cleanText((image as Record<string, unknown>).description),
            imageUrl: cleanText((image as Record<string, unknown>).imageUrl),
            imagePrompt: cleanText((image as Record<string, unknown>).imagePrompt),
            attribution: cleanText((image as Record<string, unknown>).attribution),
          }))
          .filter((image) => image.label)
      : [],
    caption: cleanText(block.caption),
    visualKind: cleanText(block.visualKind),
    prompt: cleanText(block.prompt),
    imageUrl: cleanText(block.imageUrl),
    storagePath: cleanText(block.storagePath),
    status: cleanText(block.status) || (cleanText(block.prompt) ? 'pending' : ''),
    error: cleanText(block.error),
    teacherOnly: block.teacherOnly === true,
  };
}

function legacyVisualToContentBlock(visual: Record<string, unknown>) {
  const id = cleanText(visual.id);
  const title = cleanText(visual.title);
  if (!id || !title) return null;

  const prompt = cleanText(visual.prompt);
  const imageUrl = cleanText(visual.imageUrl);
  const source = cleanText(visual.source);
  const kind = cleanText(visual.kind);
  const steps = arrayOfText(visual.steps);
  const rows = Array.isArray(visual.rows)
    ? visual.rows
        .filter((row) => Array.isArray(row))
        .map((row) => (row as unknown[]).map((cell) => cleanText(cell)))
        .filter((row) => row.some(Boolean))
    : [];
  const labels = Array.isArray(visual.labels)
    ? visual.labels
        .filter((label) => label && typeof label === 'object')
        .map((label) => ({
          label: cleanText((label as Record<string, unknown>).label),
          description: cleanText((label as Record<string, unknown>).description),
        }))
        .filter((label) => label.label)
    : [];

  if (source === 'generated' || prompt || imageUrl || kind === 'generated_image') {
    return {
      id,
      type: 'generated_visual',
      title,
      visualKind: kind || 'generated_image',
      prompt,
      caption: cleanText(visual.caption),
      imageUrl,
      storagePath: cleanText(visual.storagePath),
      status: imageUrl ? 'generated' : prompt ? 'pending' : '',
      labels,
      rows,
      steps,
      data: cleanChartData(visual.data),
      columns: cleanStringList(visual.columns, 6),
      cells: cleanCellRows(visual.cells),
      min: finiteNumber(visual.min),
      max: finiteNumber(visual.max),
      points: cleanVisualPoints(visual.points),
      shape: cleanText(visual.shape),
      segments: finiteNumber(visual.segments),
      shadedSegments: finiteNumber(visual.shadedSegments),
      items: cleanStringList(visual.items, 8),
      centralNode: cleanText(visual.centralNode),
      nodes: cleanStringList(visual.nodes, 8),
      groups: cleanVisualGroups(visual.groups),
    };
  }

  const chartData = cleanChartData(visual.data);
  if (chartData.length) {
    return { id, type: 'bar_chart', title, data: chartData, caption: cleanText(visual.caption) };
  }

  if (steps.length) {
    return { id, type: 'process_steps', title, steps, caption: cleanText(visual.caption) };
  }

  if (rows.length) {
    return { id, type: 'comparison_table', title, rows, caption: cleanText(visual.caption) };
  }

  return { id, type: 'labelled_diagram', title, labels, caption: cleanText(visual.caption) };
}

function formatWeekBlock(label: string, week?: SchemeWeek) {
  if (!week) return '';
  const entriesBlock = Array.isArray(week.entries) && week.entries.length
    ? `  Multi-strand entries:\n${week.entries
        .map(
          (entry, index) =>
            `  ${index + 1}. Strand: ${entry?.strand || ''}\n` +
            `     Sub-strand: ${entry?.subStrand || ''}\n` +
            `     Topic: ${entry?.topic || ''}\n` +
            `     Content standard: ${entry?.contentStandard || ''}\n` +
            `     Indicator: ${entry?.indicator || ''}`,
        )
        .join('\n')}\n`
    : '';
  return `- ${label}: Week ${week.week}
  Topic: ${week.topic || ''}
  Strand: ${week.strand || ''}
  Sub-strand: ${week.subStrand || ''}
  Content standard: ${week.contentStandard || ''}
  Indicator: ${week.indicator || ''}
  Resources: ${(week.resources || []).join(', ')}
${entriesBlock}`;
}

function formatLessonFocusGuidance(guidance?: SchemeContext['lessonFocusGuidance']) {
  const allFocuses = Array.isArray(guidance?.allFocuses)
    ? guidance.allFocuses.filter(Boolean)
    : [];
  if (!guidance?.currentFocus && !allFocuses.length) return '';
  const currentAssignment = guidance?.currentAssignment;
  const assignedEntry = currentAssignment?.assignedEntry;
  const assignmentBlock = currentAssignment
    ? `
  Current assignment:
  - Lesson: ${currentAssignment.lessonNumber || ''}
  - Aspect: ${currentAssignment.aspect || ''}
  - Title: ${currentAssignment.title || ''}
  - Assigned topic: ${assignedEntry?.topic || ''}
  - Assigned strand: ${assignedEntry?.strand || ''}
  - Assigned sub-strand: ${assignedEntry?.subStrand || ''}
  - Assigned content standard: ${assignedEntry?.contentStandard || ''}
  - Assigned indicator: ${assignedEntry?.indicator || ''}
  - Lesson-only indicator focus: ${(currentAssignment.supportIndicators || []).join(' ')}
  - Teach now exemplars: ${(currentAssignment.supportExemplars || []).join(' ')}
  - Defer to later related lessons: ${(currentAssignment.deferredExemplars || []).join(' ')}
  - Deferred indicator focus: ${(currentAssignment.deferredIndicators || []).join(' ')}
  - Previous related focus: ${currentAssignment.previousRelatedFocus || ''}
  - Next related focus: ${currentAssignment.nextRelatedFocus || ''}
`
    : '';

  return `Binding lesson focus guidance:
  Current lesson focus: ${guidance?.currentFocus || ''}
${assignmentBlock}
  Weekly lesson focus sequence:
${allFocuses.map((focus, index) => `  ${index + 1}. ${focus}`).join('\n')}
Use the current lesson focus as the boundary for this lesson's main activities, examples, performance indicator and assessment.
Do not blend every weekly indicator or exemplar into every lesson.
Build the starter, new learning activities, performance indicator, assessment and visual aids from the assigned entry and teach-now exemplars.
If deferred exemplars are listed, do not teach them as the main content, worked examples, assessment items, or visual aids in this lesson.
If the assigned indicator is broad, do not unpack every concept in it at once; unpack only the parts needed for the current assignment.
Later focus-sequence items may be mentioned only as a one-sentence preview, not taught as main content.
`;
}

function normalizeParsedWeeks(weeks: SchemeWeek[], expectedWeeks: number) {
  const deduped: SchemeWeek[] = [];
  const seen = new Set<number>();

  for (const week of weeks) {
    if (!week.topic && !week.indicator && !week.contentStandard) continue;

    let weekNumber = week.week;
    if (!Number.isInteger(weekNumber) || weekNumber < 1) {
      weekNumber = deduped.length + 1;
    }

    if (weekNumber > expectedWeeks) continue;

    if (seen.has(weekNumber)) {
      const existingIndex = deduped.findIndex((item) => item.week === weekNumber);
      if (existingIndex >= 0) {
        deduped[existingIndex] = preferRicherWeek(deduped[existingIndex], {
          ...week,
          week: weekNumber,
        });
      }
      continue;
    }

    seen.add(weekNumber);
    deduped.push({
      ...week,
      week: weekNumber,
    });
  }

  deduped.sort((a, b) => a.week - b.week);

  return deduped.slice(0, expectedWeeks);
}

function preferRicherWeek(existingWeek: SchemeWeek, nextWeek: SchemeWeek) {
  return scoreWeek(nextWeek) > scoreWeek(existingWeek) ? nextWeek : existingWeek;
}

function scoreWeek(week: SchemeWeek) {
  return [
    week.topic,
    week.strand,
    week.subStrand,
    week.contentStandard,
    week.indicator,
    Array.isArray(week.resources) ? week.resources.join(' ') : '',
  ]
    .join(' ')
    .trim().length;
}

function parseWeekNumber(value: unknown, index: number) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.trunc(value);
  }

  const text = cleanText(value);
  const match = text.match(/\d{1,2}/);

  if (match) {
    return Number(match[0]);
  }

  return index + 1;
}

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function slugify(value: string) {
  return cleanText(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

