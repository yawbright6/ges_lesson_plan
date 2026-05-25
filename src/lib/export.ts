import { Alert, Platform } from 'react-native';
import { Share } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import {
  getWeekEntries,
  getWeekResourceList,
  getWeekStrandSummary,
  getWeekSubStrandSummary,
  getWeekTopic,
} from '@/lib/schemeWeek';
import type { LessonPlan, LessonVisualAid, LessonVisualAidType } from '@/types/lessonPlan';
import type { SchemeOfWork } from '@/types/scheme';
import type { TeachingNoteVisual, TeachingNotes } from '@/types/teachingNotes';
import type { CompiledTestCompilation, CompiledTestPaper } from '@/types/testItemCompiler';
import { formatMathText } from './mathText';
import { buildTestItemsHeading, buildTestItemsWeekLine } from './testItemCompiler';

export async function exportLessonPlanPdf(plan: LessonPlan, options?: { activityFontSize?: number }) {
  const html = pageHtml(buildLessonPlanContent(plan), 'lesson', options);
  const fileName = `${slugify(plan.subject)}-${plan.classLevel}-week-${plan.week}.pdf`;
  await exportHtmlAsPdf(html, fileName);
}

export async function shareLessonPlan(plan: LessonPlan) {
  if (Platform.OS === 'web') {
    await shareText(`Lesson plan: ${plan.subject} ${plan.classLevel} Week ${plan.week}`);
    return;
  }
  await exportLessonPlanPdf(plan);
}

export async function shareLessonPlans(plans: LessonPlan[]) {
  if (!plans.length) return;
  const first = plans[0];
  if (Platform.OS === 'web') {
    await shareText(
      `Lesson plans: ${first.subject} ${first.classLevel} Week ${first.week} (${plans.length} lessons)`,
    );
    return;
  }
  await exportLessonPlansPdf(plans);
}

export async function shareScheme(scheme: SchemeOfWork) {
  if (Platform.OS === 'web') {
    await shareText(`Scheme of work: ${scheme.subject} ${scheme.classLevel} ${scheme.term}`);
    return;
  }
  await exportSchemePdf(scheme);
}

export async function exportLessonPlansPdf(plans: LessonPlan[], options?: { activityFontSize?: number }) {
  if (!plans.length) return;
  const html = pageHtml(
    plans
      .map((plan, index) => `<section class="lesson-page${index > 0 ? ' page-break' : ''}">${buildLessonPlanContent(plan)}</section>`)
      .join(''),
    'lesson',
    options,
  );
  const first = plans[0];
  const fileName = `${slugify(first.subject)}-${first.classLevel}-week-${first.week}-all-lessons.pdf`;
  await exportHtmlAsPdf(html, fileName);
}

export async function exportSchemePdf(scheme: SchemeOfWork) {
  const html = buildSchemeHtml(scheme);
  const fileName = `${slugify(scheme.subject)}-${scheme.classLevel}-${slugify(scheme.term)}-scheme.pdf`;
  await exportHtmlAsPdf(html, fileName);
}

export async function exportTeachingNotesPdf(notes: TeachingNotes) {
  const html = pageHtml(buildTeachingNotesContent(notes), 'notes');
  const fileName = `${slugify(notes.subject)}-${notes.classLevel}-week-${notes.week}-teaching-notes-v${notes.versionNumber ?? 1}.pdf`;
  await exportHtmlAsPdf(html, fileName);
}

export async function exportCompiledTestItemsPdf(compilation: CompiledTestCompilation) {
  const html = pageHtml(buildCompiledTestItemsContent(compilation), 'test');
  const fileName = `${slugify(compilation.subject)}-${compilation.classLevel}-${slugify(compilation.termTitle ?? 'term')}-test-items.pdf`;
  await exportHtmlAsPdf(html, fileName);
}

export async function exportCompiledTestItemsWord(compilation: CompiledTestCompilation) {
  const html = pageHtml(buildCompiledTestItemsContent(compilation), 'test');
  const fileName = `${slugify(compilation.subject)}-${compilation.classLevel}-${slugify(compilation.termTitle ?? 'term')}-test-items.doc`;
  await exportHtmlAsWord(html, fileName);
}

export async function exportRewrittenTestPaperPdf(paper: CompiledTestPaper) {
  const html = pageHtml(buildCompiledTestPaperContent(paper), 'test');
  const fileName = `${slugify(paper.subject)}-${paper.classLevel}-${slugify(paper.termTitle ?? 'term')}-test-paper.pdf`;
  await exportHtmlAsPdf(html, fileName);
}

export async function exportRewrittenTestPaperWord(paper: CompiledTestPaper) {
  const html = pageHtml(buildCompiledTestPaperContent(paper), 'test');
  const fileName = `${slugify(paper.subject)}-${paper.classLevel}-${slugify(paper.termTitle ?? 'term')}-test-paper.doc`;
  await exportHtmlAsWord(html, fileName);
}

async function exportHtmlAsPdf(html: string, fileName: string) {
  if (Platform.OS === 'web') {
    const popup = window.open('', '_blank');
    if (!popup) {
      Alert.alert('Popup blocked', 'Allow popups so the browser print dialog can open.');
      return;
    }

    popup.document.write(html);
    popup.document.close();
    popup.focus();
    popup.print();
    return;
  }

  const { uri } = await Print.printToFileAsync({ html });
  const canShare = await Sharing.isAvailableAsync();

  if (canShare) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: fileName,
      UTI: '.pdf',
    });
    return;
  }

  await Print.printAsync({ uri });
}

async function exportHtmlAsWord(html: string, fileName: string) {
  if (Platform.OS === 'web') {
    const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    return;
  }

  const uri = `${FileSystem.cacheDirectory}${fileName}`;
  await FileSystem.writeAsStringAsync(uri, html, { encoding: FileSystem.EncodingType.UTF8 });
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/msword',
      dialogTitle: fileName,
      UTI: 'com.microsoft.word.doc',
    });
    return;
  }

  Alert.alert('Word export ready', `The Word-compatible file was created: ${fileName}`);
}

async function shareText(message: string) {
  const webNavigator =
    typeof navigator !== 'undefined'
      ? (navigator as Navigator & {
          share?: (data: { text?: string; title?: string }) => Promise<void>;
          clipboard?: { writeText: (text: string) => Promise<void> };
        })
      : undefined;
  if (webNavigator?.share) {
    await webNavigator.share({ text: message, title: 'GES Lesson Plan' });
    return;
  }
  if (webNavigator?.clipboard) {
    await webNavigator.clipboard.writeText(message);
    Alert.alert('Copied', 'Share text copied to clipboard.');
    return;
  }
  await Share.share({ message });
}

function buildLessonPlanContent(plan: LessonPlan) {
  const lessonTitle = buildLessonTitle(plan);
  const rows = plan.phases
    .map(
      (phase, index) => `
        <tr class="${index % 2 === 1 ? 'alt' : ''}">
          <td class="phase-cell">
            <strong>PHASE ${phase.phase}:</strong><br/>
            <span>${escapeHtml(phase.title)}</span><br/>
            <small>${escapeHtml(phase.duration ?? '')}</small>
          </td>
          <td class="activity-cell">
            ${buildActivityVisualHtml(phase.activities, (plan.visualAids ?? []).filter((visualAid) => visualAid.phase === phase.phase))}
            ${
              phase.assessment?.length
                ? `<div class="assessment"><strong>Assessment</strong>${phase.assessment
                    .map((item, index) => `<div>${index + 1}. ${escapeHtml(item)}</div>`)
                    .join('')}</div>`
                : ''
            }
          </td>
          <td class="resource-cell">${(phase.resources ?? []).map((item) => `<div>${escapeHtml(item)}</div>`).join('')}</td>
        </tr>
      `
    )
    .join('');

  return `
    <section class="lesson-title">
      <h1>${escapeHtml((plan.termTitle || '').toUpperCase())}</h1>
      <h2>${escapeHtml(lessonTitle.toUpperCase())}</h2>
    </section>

    <table class="info-table">
      <tr>
        <td style="width:40%"><span class="label">Week ending:</span> ${escapeHtml(plan.date ?? '')}</td>
        <td style="width:27%"><span class="label">Period:</span> ${escapeHtml(plan.period ?? '')}</td>
        <td style="width:33%"><span class="label">Subject:</span> ${escapeHtml(plan.subject)}</td>
      </tr>
      <tr class="alt">
        <td style="width:40%"><span class="label">Duration:</span> ${escapeHtml(plan.duration ?? '')}</td>
        <td colspan="2"><span class="label">Strand:</span> ${escapeHtml(plan.strand ?? '')}</td>
      </tr>
      <tr>
        <td style="width:40%"><span class="label">Class:</span> ${escapeHtml(plan.classLevel)}</td>
        <td style="width:27%"><span class="label">Class Size:</span> ${escapeHtml(plan.classSize ?? '')}</td>
        <td style="width:33%"><span class="label">Sub Strand:</span> ${escapeHtml(plan.subStrand ?? '')}</td>
      </tr>
      <tr class="alt">
        <td colspan="2"><span class="label">Topic:</span> ${escapeHtml(plan.topic ?? '')}</td>
        <td><span class="label">Lesson in Week:</span> ${escapeHtml(plan.lessonNumber ?? (plan.sessionIndex && plan.sessionsPerWeek ? `${plan.sessionIndex} of ${plan.sessionsPerWeek}` : ''))}</td>
      </tr>
    </table>

    <table class="info-table mt8">
      <tr>
        <td style="width:45%"><span class="label">Content Standard:</span> ${escapeHtml(plan.contentStandard ?? '')}</td>
        <td style="width:40%"><span class="label">Indicator:</span> ${escapeHtml(plan.indicator ?? '')}</td>
        <td style="width:15%"><span class="label">Lesson:</span> ${escapeHtml(plan.lessonNumber ?? '')}</td>
      </tr>
      <tr class="alt">
        <td style="width:45%"><span class="label">Performance Indicator:</span> ${escapeHtml(plan.performanceIndicator ?? '')}</td>
        <td colspan="2"><span class="label">Core Competencies:</span> ${escapeHtml((plan.coreCompetencies ?? []).join(': '))}</td>
      </tr>
      ${
        plan.references
          ? `<tr><td colspan="3"><span class="label">References:</span> ${escapeHtml(plan.references)}</td></tr>`
          : ''
      }
    </table>

    <table class="phase-table mt8">
      <tr class="phase-head"><th style="width:12%">Phase/Duration</th><th style="width:76%">Learners Activities</th><th style="width:12%">Resources</th></tr>
      ${rows}
    </table>

    ${buildLocalLanguageHtml(plan)}
    ${buildTeacherDetailsHtml(plan)}
  `;
}

function buildSchemeHtml(scheme: SchemeOfWork) {
  const rows = scheme.weeks
    .map((week) => {
      // Get entries for this week (or create from main week data if no entries)
      const entries = week.entries && week.entries.length > 0 
        ? week.entries 
        : [{ 
            strand: week.strand, 
            subStrand: week.subStrand, 
            contentStandard: week.contentStandard, 
            indicator: week.indicator, 
            topic: week.topic, 
            resources: week.resources 
          }];

      // For each entry, create a row
      return entries
        .map((entry, entryIndex) => {
          // Only add Week and Topic cells for the first entry
          const weekCell = entryIndex === 0 
            ? `<td rowspan="${entries.length}" style="vertical-align: middle;">${week.week}</td>` 
            : '';
          const topicCell = entryIndex === 0 
            ? `<td rowspan="${entries.length}" style="vertical-align: middle;">${escapeHtml(entry.topic || week.theme || '')}</td>` 
            : '';

          return `
            <tr>
              ${weekCell}
              ${topicCell}
              <td>${escapeHtml(entry.strand || '')}</td>
              <td>${escapeHtml(entry.subStrand || '')}</td>
              <td>${escapeHtml(entry.contentStandard || '')}</td>
              <td>${escapeHtml(entry.indicator || '')}</td>
              <td>${escapeHtml((entry.resources || []).join(', '))}</td>
            </tr>
          `;
        })
        .join('');
    })
    .join('');

  return pageHtml(`
    <h1>${escapeHtml(scheme.title)}</h1>
    <h2>${escapeHtml(scheme.subject)} - ${escapeHtml(scheme.classLevel)} - ${escapeHtml(
      scheme.term
    )}</h2>
    <table>
      <tr><th>Week</th><th>Topic</th><th>Strand</th><th>Sub-strand</th><th>Content Standard</th><th>Indicator</th><th>Resources</th></tr>
      ${rows}
    </table>
  `, 'scheme');
}

function buildTeachingNotesContent(notes: TeachingNotes) {
  return `
    <section class="notes-title">
      <h1>${escapeHtml(notes.title)}</h1>
      <h2>${escapeHtml(`${notes.subject} - ${notes.classLevel} - Week ${notes.week}${notes.lessonNumber ? ` - Lesson ${notes.lessonNumber}` : ''}${notes.versionNumber ? ` - Version ${notes.versionNumber}` : ''}`)}</h2>
    </section>
    ${notes.overview ? notesSection('Overview', `<p>${escapeHtml(notes.overview)}</p>`) : ''}
    ${notes.contentBlocks?.length ? notesSection('Lesson Note', notes.contentBlocks.map(buildTeachingNoteBlockHtml).join('')) : ''}
    ${notesListSection('Teacher Preparation', notes.preparation)}
    ${notes.visuals?.length ? notesSection('Content Diagrams and Examples', notes.visuals.map(buildVisualHtml).join('')) : ''}
    ${notesSection('Teaching Guide', notes.phaseGuidance.map((phase) => `
      <div class="phase-note">
        <h3>Phase ${phase.phase}: ${escapeHtml(phase.title)}</h3>
        ${listHtml(phase.teacherNotes)}
      </div>
    `).join(''))}
    ${notesListSection('Key Explanations', notes.keyExplanations)}
    ${notesListSection('Likely Misconceptions', notes.misconceptions)}
    ${notesListSection('Questions to Ask', notes.questionsToAsk)}
    ${notesListSection('Differentiation', notes.differentiation)}
    ${notesListSection('Classroom Management', notes.classroomManagement)}
    ${notesListSection('Board Summary', notes.boardSummary)}
    ${notesListSection('Homework / Follow-up', notes.homework ?? [])}
  `;
}

function buildCompiledTestItemsContent(compilation: CompiledTestCompilation) {
  const groups = groupCompiledItems(compilation.items);
  const title = buildTestItemsHeading(compilation);
  const weekLine = buildTestItemsWeekLine(compilation.items);
  let questionNumber = 1;

  return `
    <section class="test-title">
      <h1>${escapeHtml(title)}</h1>
      ${weekLine ? `<h2>${escapeHtml(weekLine)}</h2>` : ''}
    </section>
    ${groups
      .map(
        (group) => `
          <section class="test-section">
            <h3>${escapeHtml(group.title)}</h3>
            ${group.topic ? `<p class="test-meta">${escapeHtml(group.topic)}</p>` : ''}
            <ol start="${questionNumber}" class="test-list">
              ${group.items
                .map((item) => {
                  questionNumber += 1;
                  return `<li><span>${escapeHtml(item.question)}</span></li>`;
                })
                .join('')}
            </ol>
          </section>
        `,
      )
      .join('')}
  `;
}

function buildCompiledTestPaperContent(paper: CompiledTestPaper) {
  const instructions = normalizeTestPaperInstructions(paper.instructions ?? []);
  return `
    <section class="test-title">
      <h1>${escapeHtml(paper.title)}</h1>
      <h2>${escapeHtml(`${paper.subject} - ${paper.classLevel}${paper.termTitle ? ` - ${paper.termTitle}` : ''} - ${paper.totalMarks} marks`)}</h2>
    </section>
    ${instructions.length ? notesSection('Instructions', listHtml(instructions)) : ''}
    ${paper.sections
      .map(
        (section) => `
          <section class="test-section">
            <h3>${escapeHtml(section.title)}</h3>
            <ol class="test-list">
              ${section.questions
                .map((question) => {
                  const marks = question.marks || 1;
                  return `<li>${buildTestQuestionHtml(question)}<strong>[${marks} mark${marks === 1 ? '' : 's'}]</strong></li>`;
                })
                .join('')}
            </ol>
          </section>
        `,
      )
      .join('')}
    ${paper.answerKey?.length ? `<div class="answer-key-page">${notesSection('Answer Key', buildAnswerKeyHtml(paper))}</div>` : ''}
  `;
}

function buildAnswerKeyHtml(paper: CompiledTestPaper) {
  return `<ol class="answer-key">${paper.answerKey
    .map(
      (item) => `<li>
        ${escapeHtml(stripLeadingQuestionNumber(item.answer))}
        ${item.markingGuide?.length ? listHtml(item.markingGuide) : ''}
        <span class="test-meta">${item.marks} mark${item.marks === 1 ? '' : 's'}</span>
      </li>`,
    )
    .join('')}</ol>`;
}

function buildTestQuestionHtml(question: CompiledTestPaper['sections'][number]['questions'][number]) {
  const parsed = parseMultipleChoiceText(question.text);
  const visuals = question.visuals?.length
    ? `<div class="test-question-visuals">${question.visuals.map(buildVisualAidHtml).join('')}</div>`
    : '';
  if (!parsed || (question.mode && question.mode !== 'multiple_choice' && !hasOptionMarkers(question.text))) {
    return `<span>${escapeHtml(question.text)}</span>${visuals}`;
  }

  return `<span>${escapeHtml(parsed.stem)}</span>
    <div class="mcq-options">
      ${orderMultipleChoiceOptions(parsed.options).map((option) => `<div class="mcq-option"><strong>${escapeHtml(option.label)}.</strong> ${escapeHtml(option.text)}</div>`).join('')}
    </div>${visuals}`;
}

function parseMultipleChoiceText(text: string) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  const optionRegex = /(?:^|\s)([A-D])[\.\)]\s+/g;
  const matches = [...normalized.matchAll(optionRegex)];
  if (matches.length < 2) return null;

  const firstIndex = matches[0].index ?? -1;
  if (firstIndex < 0) return null;
  const stem = normalized.slice(0, firstIndex).trim();
  const options = matches.map((match, index) => {
    const start = (match.index ?? 0) + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index ?? normalized.length : normalized.length;
    return {
      label: match[1],
      text: normalized.slice(start, end).trim(),
    };
  }).filter((option) => option.text);

  return stem && options.length >= 2 ? { stem, options } : null;
}

function hasOptionMarkers(text: string) {
  return /(?:^|\s)[A-D][\.\)]\s+/.test(text);
}

function orderMultipleChoiceOptions(options: Array<{ label: string; text: string }>) {
  const byLabel = new Map(options.map((option) => [option.label, option]));
  const preferred = ['A', 'C', 'B', 'D']
    .map((label) => byLabel.get(label))
    .filter(Boolean) as Array<{ label: string; text: string }>;
  return preferred.length === options.length ? preferred : options;
}

function normalizeTestPaperInstructions(instructions: string[]) {
  return instructions
    .map((instruction) => instruction.trim())
    .filter((instruction) => !/silent\s+electronic\s+calculators?\s+should\s+be\s+used/i.test(instruction))
    .map((instruction) =>
      /all\s+workings\s+must\s+be\s+shown\s+clearly/i.test(instruction)
        ? 'All workings in Section B must be shown clearly.'
        : instruction,
    );
}

function stripLeadingQuestionNumber(value: string) {
  return value.replace(/^\s*(?:question\s*)?\d+[\.\)]\s*/i, '').trim();
}

function groupCompiledItems(items: CompiledTestCompilation['items']) {
  const groups = new Map<string, { title: string; topic: string; items: typeof items }>();
  for (const item of items) {
    const key = `${item.week}:${item.lessonNumber ?? ''}`;
    const title = `Week ${item.week}${item.lessonNumber ? ` - Lesson ${item.lessonNumber}` : ''}`;
    const topic = [item.topic, item.strand, item.indicator].filter(Boolean).join(' | ');
    const existing = groups.get(key);
    if (existing) {
      existing.items.push(item);
    } else {
      groups.set(key, { title, topic, items: [item] });
    }
  }
  return [...groups.values()];
}

function notesSection(title: string, content: string) {
  return `<section class="notes-section"><h3>${escapeHtml(title)}</h3>${content}</section>`;
}

function notesListSection(title: string, items: string[]) {
  return items.length ? notesSection(title, listHtml(items)) : '';
}

function listHtml(items: string[]) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function buildVisualHtml(visual: TeachingNoteVisual) {
  return `
    <div class="visual-block">
      <h4>${escapeHtml(visual.title)}</h4>
      ${buildTeachingNoteVisualFigureHtml(visual)}
      ${visual.caption ? `<p class="caption">${escapeHtml(visual.caption)}</p>` : ''}
      ${visual.attribution ? `<p class="attribution">${escapeHtml(visual.attribution)}</p>` : ''}
    </div>
  `;
}

function buildTeachingNoteVisualFigureHtml(visual: TeachingNoteVisual) {
  const type = visual.type ?? inferTeachingNoteVisualType(visual);
  const labels = visual.labels?.map((item) => item.description ? `${item.label}: ${item.description}` : item.label);
  const aid: LessonVisualAid = {
    id: visual.id,
    type,
    title: visual.title,
    imageUrl: visual.imageUrl,
    prompt: visual.prompt,
    labels,
    steps: visual.steps,
    data: visual.data,
    columns: visual.columns,
    cells: visual.cells ?? visual.rows,
    min: visual.min,
    max: visual.max,
    points: visual.points,
    shape: visual.shape,
    segments: visual.segments,
    shadedSegments: visual.shadedSegments,
    items: visual.items,
    centralNode: visual.centralNode,
    nodes: visual.nodes,
    groups: visual.groups,
    caption: visual.caption,
  };
  return buildVisualFigureHtml(aid);
}

function inferTeachingNoteVisualType(visual: TeachingNoteVisual): LessonVisualAidType {
  if (visual.data?.length) return 'bar_chart';
  if (visual.rows?.length || visual.cells?.length) return 'comparison_table';
  if (visual.kind === 'process' || visual.steps?.length) return 'process_diagram';
  return 'labelled_diagram';
}

function buildTeachingNoteBlockHtml(block: NonNullable<TeachingNotes['contentBlocks']>[number]) {
  if (isTeachingNoteStructuredVisualBlock(block.type)) {
    return buildVisualHtml(teachingNoteBlockToVisual(block));
  }
  if (block.type === 'generated_visual') {
    return buildVisualHtml({
      id: block.id,
      type: 'labelled_diagram',
      kind: block.visualKind ?? 'generated_image',
      source: 'generated',
      title: block.title ?? 'Generated diagram',
      caption: block.caption,
      prompt: block.prompt,
      imageUrl: block.imageUrl,
      storagePath: block.storagePath,
    });
  }
  if (block.type === 'comparison_table') {
    const rows = block.rows ?? [];
    return `<div class="note-block structured-block">
      ${block.title ? `<h4>${escapeHtml(block.title)}</h4>` : ''}
      ${block.text ? `<p>${escapeHtml(block.text)}</p>` : ''}
      ${rows.length ? buildRowsTableHtml(rows) : ''}
      ${block.caption ? `<p class="caption">${escapeHtml(block.caption)}</p>` : ''}
    </div>`;
  }
  if (block.type === 'bar_chart') {
    return `<div class="note-block structured-block">
      ${block.title ? `<h4>${escapeHtml(block.title)}</h4>` : ''}
      ${block.text ? `<p>${escapeHtml(block.text)}</p>` : ''}
      ${buildBarChartHtml(block.data ?? [])}
      ${block.caption ? `<p class="caption">${escapeHtml(block.caption)}</p>` : ''}
    </div>`;
  }
  if (block.type === 'process_steps') {
    return `<div class="note-block structured-block">
      ${block.title ? `<h4>${escapeHtml(block.title)}</h4>` : ''}
      ${block.text ? `<p>${escapeHtml(block.text)}</p>` : ''}
      ${block.steps?.length ? `<ol>${block.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol>` : ''}
      ${block.caption ? `<p class="caption">${escapeHtml(block.caption)}</p>` : ''}
    </div>`;
  }
  if (block.type === 'labelled_diagram') {
    return `<div class="note-block structured-block">
      ${block.title ? `<h4>${escapeHtml(block.title)}</h4>` : ''}
      ${block.text ? `<p>${escapeHtml(block.text)}</p>` : ''}
      ${block.labels?.length ? `<table class="visual-table">${block.labels.map((label) => `<tr><td><strong>${escapeHtml(label.label)}</strong></td><td>${escapeHtml(label.description ?? '')}</td></tr>`).join('')}</table>` : ''}
      ${block.caption ? `<p class="caption">${escapeHtml(block.caption)}</p>` : ''}
    </div>`;
  }
  if (block.type === 'heading') return `<h4>${escapeHtml(block.text || block.title || '')}</h4>`;
  if (block.items?.length) {
    return `<div class="note-block">${block.title ? `<h4>${escapeHtml(block.title)}</h4>` : ''}${listHtml(block.items)}</div>`;
  }
  return block.text
    ? `<div class="note-block">${block.title ? `<h4>${escapeHtml(block.title)}</h4>` : ''}<p>${escapeHtml(block.text)}</p></div>`
    : '';
}

function isTeachingNoteStructuredVisualBlock(type: string) {
  return [
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
  ].includes(type);
}

function teachingNoteBlockToVisual(block: NonNullable<TeachingNotes['contentBlocks']>[number]): TeachingNoteVisual {
  const fallbackType = block.type === 'process_steps' ? 'process_diagram' : block.type as LessonVisualAidType;
  return {
    id: block.id,
    type: block.visualType ?? fallbackType,
    kind: block.visualKind ?? (block.type.includes('table') ? 'table' : block.type.includes('chart') ? 'chart' : 'diagram'),
    source: 'structured',
    title: block.title ?? 'Diagram',
    caption: block.caption,
    labels: block.labels,
    rows: block.rows,
    steps: block.steps,
    data: block.data,
    columns: block.columns,
    cells: block.cells,
    min: block.min,
    max: block.max,
    points: block.points,
    shape: block.shape,
    segments: block.segments,
    shadedSegments: block.shadedSegments,
    items: block.items,
    centralNode: block.centralNode,
    nodes: block.nodes,
    groups: block.groups,
  };
}

function buildRowsTableHtml(rows: string[][]) {
  return `<table class="visual-table">${rows
    .map((row, rowIndex) => `<tr class="${rowIndex === 0 ? 'head' : ''}">${row
      .map((cell) => `<td>${escapeHtml(cell)}</td>`)
      .join('')}</tr>`)
    .join('')}</table>`;
}

function buildBarChartHtml(data: Array<{ label: string; value: number }>) {
  if (!data.length) return '';
  const maxValue = Math.max(...data.map((item) => Number(item.value) || 0), 1);
  return `<div class="bar-chart">${data
    .map((item) => {
      const width = Math.max(8, Math.round(((Number(item.value) || 0) / maxValue) * 100));
      return `<div class="bar-row"><span class="bar-label">${escapeHtml(item.label)}</span><span class="bar-track"><span class="bar-fill" style="width:${width}%"></span></span><span class="bar-value">${Number(item.value) || 0}</span></div>`;
    })
    .join('')}</div>`;
}

function pageHtml(content: string, documentType: 'lesson' | 'scheme' | 'notes' | 'test', options?: { activityFontSize?: number }) {
  const lessonStyles =
    documentType === 'lesson'
      ? `
        body { padding: 18px; }
        h1 { font-size: 18px; }
        h2 { font-size: 15px; margin-bottom: 10px; }
        table { margin-top: 7px; }
        th, td { border-color: #e2e2dc; padding: 4px; font-size: 12px; line-height: 1.2; }
        th { font-size: 10px; }
        .lesson-title { margin-bottom: 4px; }
        .info-table, .phase-table { margin-top: 6px; }
        .info-table td { line-height: 1.18; }
        .label { font-size: 10px; }
        .phase-head th { font-size: 10px; padding: 4px; }
        .phase-cell { font-size: 12px; line-height: 1.18; }
        .phase-cell strong { font-size: 10px; }
        .phase-cell span { font-size: 11px; }
        .phase-cell small { font-size: 10px; }
        .activity-cell { font-size: ${options?.activityFontSize ?? 16}px; }
        .activity-cell div { margin-bottom: 6px; line-height: 1.24; }
        .resource-cell { font-size: 13px; line-height: 1.2; }
        .assessment { margin-top: 5px; padding-top: 5px; border-top-color: #e2e2dc; }
        .assessment strong { font-size: 11px; }
        .teacher-details { border-color: #e2e2dc; padding: 5px; margin-top: 6px; font-size: 12px; line-height: 1.24; }
        .visual-aid { border: 1px solid #e2e2dc; border-radius: 6px; padding: 7px; margin-top: 7px; break-inside: avoid; page-break-inside: avoid; }
        .visual-kicker { color: #0F4C3A; font-size: 10px; font-weight: 700; text-transform: uppercase; }
        .visual-title { font-size: 14px; font-weight: 700; margin-top: 2px; }
        .visual-purpose, .visual-activity, .visual-caption { font-size: 12px; line-height: 1.25; margin-top: 3px; }
        .visual-activity, .visual-caption { color: #6B6B6B; font-size: 11px; }
        .visual-figure { margin-top: 6px; }
        .bar-row { display: flex; align-items: center; gap: 6px; margin-top: 4px; }
        .bar-label { width: 90px; font-size: 11px; }
        .bar-track { flex: 1; height: 10px; background: #F4F1EA; border-radius: 4px; overflow: hidden; }
        .bar-fill { height: 10px; background: #0F4C3A; }
        .bar-value { width: 28px; font-size: 11px; text-align: right; color: #6B6B6B; }
        .step-list { display: grid; gap: 4px; }
        .step-item { display: flex; gap: 6px; align-items: flex-start; font-size: 12px; line-height: 1.25; }
        .step-index { min-width: 16px; height: 16px; border-radius: 8px; background: #0F4C3A; color: #fff; text-align: center; font-size: 10px; font-weight: 700; line-height: 16px; }
        .label-grid { display: flex; flex-wrap: wrap; gap: 5px; }
        .label-chip { border: 1px solid #e2e2dc; background: #F4F1EA; border-radius: 5px; padding: 3px 5px; font-size: 11px; }
        .visual-table { border: 1px solid #e2e2dc; border-collapse: collapse; margin-top: 6px; }
        .visual-table td { border: 1px solid #e2e2dc; padding: 4px; font-size: 12px; }
        .visual-table .head td { background: #edf3f0; color: #0F4C3A; font-weight: 700; }
        .visual-table .visual-row-label { color: #0F4C3A; font-weight: 700; width: 35%; }
        .line-graph { height: 92px; border-left: 1px solid #0F4C3A; border-bottom: 1px solid #0F4C3A; display: flex; align-items: flex-end; gap: 8px; padding: 6px 8px 16px; }
        .line-point-wrap { flex: 1; height: 100%; position: relative; text-align: center; }
        .line-point { position: absolute; left: 50%; width: 8px; height: 8px; border-radius: 50%; background: #0F4C3A; }
        .line-label { position: absolute; left: 0; right: 0; bottom: -16px; font-size: 9px; color: #666; }
        .number-line { margin-top: 8px; padding: 14px 8px 4px; }
        .number-line-base { height: 2px; background: #0F4C3A; position: relative; }
        .number-line-point { position: absolute; top: -12px; transform: translateX(-50%); text-align: center; font-size: 9px; }
        .number-line-point b { display: block; width: 9px; height: 9px; border-radius: 50%; background: #0F4C3A; margin: 0 auto 2px; }
        .number-line-point em { font-style: normal; }
        .number-line-ends { display: flex; justify-content: space-between; color: #666; font-size: 9px; margin-top: 8px; }
        .coordinate-grid { height: 120px; border: 1px solid #e2e2dc; background-image: linear-gradient(#e2e2dc 1px, transparent 1px), linear-gradient(90deg, #e2e2dc 1px, transparent 1px); background-size: 25% 25%; position: relative; }
        .grid-point { position: absolute; width: 10px; height: 10px; border-radius: 50%; background: #0F4C3A; color: #0F4C3A; font-size: 9px; }
        .shape-visual { text-align: center; margin-top: 8px; }
        .shape { display: inline-block; border: 2px solid #0F4C3A; background: #edf3f0; width: 86px; height: 54px; }
        .shape.circle { border-radius: 50%; width: 70px; height: 70px; }
        .shape.square { width: 68px; height: 68px; }
        .fraction-model { display: flex; min-height: 28px; border: 1px solid #0F4C3A; margin-top: 8px; }
        .fraction-model span { flex: 1; border-right: 1px solid #0F4C3A; }
        .fraction-model .shaded { background: #cfe4da; }
        .venn-visual { min-height: 106px; position: relative; text-align: center; }
        .venn { position: absolute; top: 8px; width: 72px; height: 72px; border: 2px solid #0F4C3A; border-radius: 50%; background: rgba(15,76,58,0.08); }
        .venn.left { left: 32%; }
        .venn.right { right: 32%; }
        .process-flow { display: grid; gap: 5px; }
        .process-node { border: 1px solid #e2e2dc; border-radius: 6px; background: #fff; padding: 6px; font-size: 11px; }
        .process-arrow { color: #0F4C3A; font-weight: 700; text-align: center; }
        .cycle-visual { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; }
        .cycle-node { border: 1px solid #0F4C3A; border-radius: 18px; background: #edf3f0; padding: 5px 8px; font-size: 10px; }
        .classification-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
        .classification-card { border: 1px solid #e2e2dc; border-radius: 6px; background: #fff; padding: 6px; }
        .classification-card strong { color: #0F4C3A; display: block; margin-bottom: 3px; }
        .experiment-setup { border: 1px solid #e2e2dc; border-radius: 6px; background: #fff; padding: 8px; }
        .experiment-bench { height: 5px; background: #777; border-radius: 3px; margin: 28px 0 8px; }
        .apparatus-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
        .apparatus { border: 1px solid #0F4C3A; border-radius: 5px; background: #edf3f0; padding: 6px; min-width: 56px; text-align: center; font-size: 10px; }
        .circuit-diagram, .network-diagram { height: 140px; position: relative; background: #fff; border-radius: 6px; }
        .circuit-wire.top { position: absolute; left: 22%; right: 22%; top: 30px; height: 2px; background: #0F4C3A; }
        .circuit-wire.right { position: absolute; right: 20%; top: 30px; bottom: 30px; width: 2px; background: #0F4C3A; }
        .circuit-wire.bottom { position: absolute; left: 22%; right: 22%; bottom: 30px; height: 2px; background: #0F4C3A; }
        .circuit-wire.left { position: absolute; left: 20%; top: 30px; bottom: 30px; width: 2px; background: #0F4C3A; }
        .circuit-part { position: absolute; border: 1px solid #0F4C3A; border-radius: 6px; background: #edf3f0; padding: 5px; font-size: 9px; text-align: center; min-width: 54px; }
        .circuit-part.p0 { top: 12px; left: 39%; }
        .circuit-part.p1 { top: 58px; right: 4px; }
        .circuit-part.p2 { bottom: 12px; left: 39%; }
        .circuit-part.p3 { top: 58px; left: 4px; }
        .network-line.vtop { position: absolute; left: 50%; top: 32px; width: 2px; height: 42px; background: #777; }
        .network-line.hright { position: absolute; right: 22%; top: 70px; width: 28%; height: 2px; background: #777; }
        .network-line.vbottom { position: absolute; left: 50%; bottom: 32px; width: 2px; height: 42px; background: #777; }
        .network-line.hleft { position: absolute; left: 22%; top: 70px; width: 28%; height: 2px; background: #777; }
        .network-center { position: absolute; left: 39%; top: 50px; width: 22%; border-radius: 7px; background: #0F4C3A; color: #fff; padding: 7px; text-align: center; font-size: 10px; font-weight: 700; }
        .network-node { position: absolute; width: 30%; border: 1px solid #e2e2dc; border-radius: 6px; background: #edf3f0; padding: 5px; text-align: center; font-size: 9px; }
        .network-node.n0 { top: 4px; left: 35%; }
        .network-node.n1 { top: 56px; right: 0; }
        .network-node.n2 { bottom: 4px; left: 35%; }
        .network-node.n3 { top: 56px; left: 0; }
        .interface-mockup { border: 1px solid #e2e2dc; border-radius: 7px; overflow: hidden; background: #fff; }
        .interface-title { background: #0F4C3A; color: #fff; padding: 6px 8px; font-size: 10px; font-weight: 700; }
        .interface-row { border-top: 1px solid #e2e2dc; padding: 6px 8px; font-size: 11px; }
        .story-map { display: grid; gap: 5px; }
        .story-card { border-left: 3px solid #0F4C3A; border-radius: 6px; background: #fff; padding: 6px; font-size: 11px; }
        .local-language { border: 1px solid #e2e2dc; border-radius: 6px; padding: 7px; margin-top: 7px; break-inside: avoid; page-break-inside: avoid; }
        .local-review { color: #6B6B6B; font-size: 11px; line-height: 1.25; margin-top: 3px; }
        .translation-group { margin-top: 7px; }
        .translation-group-title { color: #0F4C3A; font-size: 11px; font-weight: 700; margin-bottom: 3px; }
        .translation-table { border-collapse: collapse; margin-top: 0; }
        .translation-table td { border: 1px solid #e2e2dc; padding: 4px; font-size: 12px; line-height: 1.2; }
        .translation-english { color: #6B6B6B; width: 45%; }
        .translation-local { font-weight: 700; }
        .translation-pronunciation { display: block; color: #6B6B6B; font-size: 10px; font-weight: 400; margin-top: 1px; }
      `
      : '';

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Export</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; color: #1a1a1a; }
        h1, h2, h3 { margin: 0 0 8px; }
        h1 { color: #0F4C3A; font-size: 18px; }
        h2 { font-size: 15px; margin-bottom: 20px; color: #0A3326; }
        h3 { margin-top: 24px; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { border: 1px solid #d8d8d2; padding: 6px; vertical-align: top; font-size: 12px; text-align: left; }
        th { background: #edf3f0; }
        .lesson-title { text-align: center; margin-bottom: 8px; }
        .lesson-title h1, .lesson-title h2 { text-align: center; }
        .page-break { break-before: page; page-break-before: always; }
        .info-table, .phase-table { margin-top: 8px; }
        .info-table td { line-height: 1.32; }
        .alt { background: #F4F1EA; }
        .label { color: #0F4C3A; font-size: 10px; font-weight: 700; }
        .mt8 { margin-top: 8px; }
        .phase-head th { background: #0F4C3A; color: #fff; font-size: 11px; font-weight: 700; }
        .phase-cell strong { color: #0F4C3A; font-size: 10px; }
        .phase-cell span { font-weight: 600; }
        .phase-cell small { color: #6B6B6B; }
        .activity-cell div { margin-bottom: 3px; line-height: 1.45; }
        .assessment { margin-top: 8px; padding-top: 8px; border-top: 1px solid #d8d8d2; }
        .teacher-details { border: 1px solid #d8d8d2; border-radius: 6px; padding: 8px; margin-top: 8px; font-size: 12px; line-height: 1.45; }
        ${visualExportStyles()}
        ${lessonStyles}
        ${documentType === 'notes' ? notesStyles() : ''}
        ${documentType === 'test' ? testStyles() : ''}
      </style>
    </head>
    <body>${content}</body>
  </html>`;
}

function testStyles() {
  return `
    body { padding: 22px; }
    .test-title { text-align: center; margin-bottom: 16px; }
    .test-title h1 { font-size: 20px; color: #0F4C3A; }
    .test-title h2 { font-size: 15px; color: #555; }
    .test-section { border: 1px solid #d8d8d2; border-radius: 6px; padding: 10px; margin-bottom: 10px; }
    .notes-section { border: 1px solid #d8d8d2; border-radius: 6px; padding: 10px; margin-bottom: 10px; }
    .test-section h3 { color: #0F4C3A; font-size: 15px; margin-bottom: 4px; }
    .notes-section h3 { color: #0F4C3A; font-size: 14px; margin-bottom: 6px; }
    .notes-section li { font-size: 12px; line-height: 1.45; margin-bottom: 4px; }
    .test-meta { color: #666; font-size: 12px; line-height: 1.35; margin: 2px 0 8px; }
    .test-list { margin: 0; padding-left: 20px; }
    .test-list li { font-size: 15px; line-height: 1.5; margin-bottom: 8px; }
    .test-list strong { color: #0F4C3A; margin-left: 6px; white-space: nowrap; }
    .test-question-visuals { margin-top: 8px; }
    .test-question-visuals .visual-aid { margin-top: 6px; }
    .mcq-options { display: grid; grid-template-columns: 1fr 1fr; column-gap: 28px; row-gap: 7px; margin-top: 8px; margin-bottom: 4px; }
    .mcq-option { display: block; padding-left: 4px; line-height: 1.45; }
    .mcq-option strong { margin-left: 0; margin-right: 6px; color: #0F4C3A; }
    .answer-key { margin: 0; padding-left: 20px; }
    .answer-key li { font-size: 12px; line-height: 1.45; margin-bottom: 8px; }
    .answer-key-page { break-before: page; page-break-before: always; }
  `;
}

function notesStyles() {
  return `
    body { padding: 20px; }
    .notes-title { margin-bottom: 14px; }
    .notes-title h1 { font-size: 20px; color: #0F4C3A; }
    .notes-title h2 { font-size: 13px; color: #555; }
    .notes-section { border: 1px solid #d8d8d2; border-radius: 6px; padding: 10px; margin-bottom: 10px; break-inside: avoid; page-break-inside: avoid; }
    .notes-section h3 { color: #0F4C3A; font-size: 14px; margin-bottom: 6px; }
    .notes-section p, .notes-section li { font-size: 12px; line-height: 1.48; }
    .notes-section ul, .notes-section ol { margin-top: 4px; padding-left: 18px; }
    .notes-section li { margin-bottom: 3px; }
    .phase-note { border-top: 1px solid #e2e2dc; padding-top: 6px; margin-top: 6px; }
    .phase-note h3 { font-size: 12px; color: #0F4C3A; }
    .visual-block { background: #F4F1EA; border: 1px solid #d8d8d2; border-radius: 6px; padding: 8px; margin-top: 8px; break-inside: avoid; page-break-inside: avoid; }
    .visual-block h4 { margin: 0 0 6px; color: #1a1a1a; font-size: 13px; }
    .visual-block ol { margin-top: 4px; padding-left: 18px; }
    .visual-image { max-width: 100%; max-height: 240px; object-fit: contain; display: block; margin: 6px auto; background: #fff; }
    .visual-table { margin-top: 6px; }
    .visual-table td { font-size: 11px; }
    .visual-table .head td { background: #edf3f0; font-weight: 700; }
    .structured-block { background: #F4F1EA; border: 1px solid #d8d8d2; border-radius: 6px; padding: 8px; margin-top: 8px; break-inside: avoid; page-break-inside: avoid; }
    .bar-chart { margin-top: 6px; }
    .bar-row { display: flex; align-items: center; gap: 6px; margin-top: 5px; }
    .bar-label { width: 100px; font-size: 11px; }
    .bar-track { flex: 1; height: 10px; background: #fff; border-radius: 4px; overflow: hidden; }
    .bar-fill { display: block; height: 10px; background: #0F4C3A; }
    .bar-value { width: 28px; text-align: right; color: #666; font-size: 11px; }
    .caption { margin-top: 6px; }
    .attribution { color: #666; font-size: 10px; }
  `;
}

function escapeHtml(value: string | number | null | undefined) {
  return formatMathText(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function buildWeekContentStandards(week: SchemeOfWork['weeks'][number]) {
  return joinUnique(
    getWeekEntries(week)
      .map((entry) => entry.contentStandard)
      .filter(Boolean) as string[]
  );
}

function buildWeekIndicators(week: SchemeOfWork['weeks'][number]) {
  return joinUnique(
    getWeekEntries(week)
      .map((entry) => entry.indicator)
      .filter(Boolean) as string[]
  );
}

function joinUnique(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].join(' | ');
}

function buildTeacherDetailsHtml(plan: LessonPlan) {
  const rows = [
    plan.teacherName ? `<div><strong>Teacher:</strong> ${escapeHtml(plan.teacherName)}</div>` : '',
    plan.schoolName ? `<div><strong>School:</strong> ${escapeHtml(plan.schoolName)}</div>` : '',
    plan.schoolDistrict ? `<div><strong>District:</strong> ${escapeHtml(plan.schoolDistrict)}</div>` : '',
  ].filter(Boolean);

  return rows.length ? `<section class="teacher-details">${rows.join('')}</section>` : '';
}

function buildVisualAidHtml(visualAid: NonNullable<LessonPlan['visualAids']>[number]) {
  if (!visualAid?.title) return '';

  return `<section class="visual-aid">
    <div class="visual-kicker">Visual Aid${visualAid.phase ? ` - Phase ${visualAid.phase}` : ''}</div>
    <div class="visual-title">${escapeHtml(visualAid.title)}</div>
    ${visualAid.purpose ? `<div class="visual-purpose">${escapeHtml(visualAid.purpose)}</div>` : ''}
    ${visualAid.activityLink ? `<div class="visual-activity">${escapeHtml(visualAid.activityLink)}</div>` : ''}
    ${buildVisualFigureHtml(visualAid)}
    ${visualAid.caption ? `<div class="visual-caption">${escapeHtml(visualAid.caption)}</div>` : ''}
  </section>`;
}

function buildVisualFigureHtml(visualAid: NonNullable<LessonPlan['visualAids']>[number]) {
  if (visualAid.imageUrl) {
    return `<div class="visual-figure"><img class="visual-image" src="${escapeHtml(visualAid.imageUrl)}" alt="${escapeHtml(visualAid.title)}" /></div>`;
  }

  if (visualAid.status === 'failed') {
    return `<div class="visual-error">${escapeHtml(visualAid.error || 'Diagram could not be generated.')}</div>`;
  }

  if (visualAid.type === 'bar_chart' && visualAid.data?.length) {
    const maxValue = Math.max(...visualAid.data.map((item) => item.value), 1);
    return `<div class="visual-figure">${visualAid.data
      .slice(0, 5)
      .map((item) => {
        const width = Math.max(8, Math.round((item.value / maxValue) * 100));
        return `<div class="bar-row"><div class="bar-label">${escapeHtml(item.label)}</div><div class="bar-track"><div class="bar-fill" style="width:${width}%"></div></div><div class="bar-value">${item.value}</div></div>`;
      })
      .join('')}</div>`;
  }

  if (visualAid.type === 'line_graph' && visualAid.data?.length) {
    const maxValue = Math.max(...visualAid.data.map((item) => item.value), 1);
    return `<div class="visual-figure line-graph">${visualAid.data
      .slice(0, 6)
      .map((item) => {
        const height = Math.max(8, Math.round((item.value / maxValue) * 86));
        return `<div class="line-point-wrap"><span class="line-point" style="bottom:${height}%"></span><span class="line-label">${escapeHtml(item.label)}</span></div>`;
      })
      .join('')}</div>`;
  }

  if (visualAid.type === 'timeline' && visualAid.steps?.length) {
    return `<div class="visual-figure step-list">${visualAid.steps
      .slice(0, 6)
      .map((step, index) => `<div class="step-item"><span class="step-index">${index + 1}</span><span>${escapeHtml(step)}</span></div>`)
      .join('')}</div>`;
  }

  if (visualAid.type === 'comparison_table' && visualAid.rows?.length) {
    return `<table class="visual-table">${visualAid.rows
      .slice(0, 5)
      .map((row) => `<tr><td class="visual-row-label">${escapeHtml(row.label)}</td><td>${escapeHtml(row.value)}</td></tr>`)
      .join('')}</table>`;
  }

  if (isMatrixTableVisual(visualAid) && (visualAid.cells?.length || visualAid.rows?.length)) {
    const columns = visualAid.columns?.length ? visualAid.columns : visualAid.rows?.length ? ['Item', 'Value'] : [];
    const rows = visualAid.cells?.length ? visualAid.cells : visualAid.rows?.map((row) => [row.label, row.value]) ?? [];
    return `<table class="visual-table">${columns.length ? `<tr class="head">${columns.map((column) => `<td>${escapeHtml(column)}</td>`).join('')}</tr>` : ''}${rows
      .slice(0, 8)
      .map((row) => `<tr>${row.slice(0, 6).map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`)
      .join('')}</table>`;
  }

  if (visualAid.type === 'number_line') {
    const min = Number.isFinite(visualAid.min) ? Number(visualAid.min) : 0;
    const max = Number.isFinite(visualAid.max) && Number(visualAid.max) > min ? Number(visualAid.max) : min + 10;
    const points = visualAid.points ?? [];
    return `<div class="number-line"><div class="number-line-base">${points
      .map((point) => {
        const left = Math.max(0, Math.min(100, ((point.value - min) / (max - min)) * 100));
        return `<span class="number-line-point" style="left:${left}%"><b></b><em>${escapeHtml(point.label || String(point.value))}</em></span>`;
      })
      .join('')}</div><div class="number-line-ends"><span>${min}</span><span>${max}</span></div></div>`;
  }

  if (visualAid.type === 'coordinate_grid') {
    return `<div class="coordinate-grid">${(visualAid.points ?? []).slice(0, 8).map((point) => `<span class="grid-point" style="left:${Math.max(0, Math.min(95, Number(point.x ?? point.value) * 10))}%;bottom:${Math.max(0, Math.min(95, Number(point.y ?? 0) * 10))}%">${escapeHtml(point.label ?? '')}</span>`).join('')}</div>`;
  }

  if (visualAid.type === 'geometry_shape' || visualAid.type === 'angle_diagram') {
    return `<div class="shape-visual"><div class="shape ${escapeHtml(visualAid.shape || 'rectangle')}"></div>${buildLabelListHtml(visualAid.labels ?? visualAid.items)}</div>`;
  }

  if (visualAid.type === 'fraction_model') {
    const segments = Math.max(1, Math.min(12, Number(visualAid.segments) || 4));
    const shaded = Math.max(0, Math.min(segments, Number(visualAid.shadedSegments) || 0));
    return `<div class="fraction-model">${Array.from({ length: segments }).map((_, index) => `<span class="${index < shaded ? 'shaded' : ''}"></span>`).join('')}</div>`;
  }

  if (visualAid.type === 'venn_diagram') {
    return `<div class="venn-visual"><span class="venn left"></span><span class="venn right"></span>${buildLabelListHtml(visualAid.labels ?? visualAid.items)}</div>`;
  }

  if (visualAid.type === 'flowchart' || visualAid.type === 'process_diagram' || visualAid.type === 'block_diagram') {
    return buildProcessVisualHtml(visualAid);
  }

  if (visualAid.type === 'cycle_diagram') return buildCycleVisualHtml(visualAid);
  if (visualAid.type === 'classification_chart') return buildClassificationVisualHtml(visualAid);
  if (visualAid.type === 'experiment_setup') return buildExperimentSetupHtml(visualAid);
  if (visualAid.type === 'circuit_diagram') return buildCircuitVisualHtml(visualAid);
  if (visualAid.type === 'network_diagram') return buildNetworkVisualHtml(visualAid);
  if (visualAid.type === 'interface_mockup') return buildInterfaceMockupHtml(visualAid);
  if (visualAid.type === 'story_map') return buildStoryMapHtml(visualAid);

  const labels = visualAid.labels?.length ? visualAid.labels : visualAid.steps;
  if (!labels?.length) return '';
  return `<div class="visual-figure label-grid">${labels
    .slice(0, 6)
    .map((label) => `<span class="label-chip">${escapeHtml(label)}</span>`)
    .join('')}</div>`;
}

function visualExportStyles() {
  return `
    .visual-figure { margin-top: 6px; }
    .visual-image { max-width: 100%; max-height: 240px; object-fit: contain; display: block; margin: 6px auto; background: #fff; }
    .visual-table { border: 1px solid #e2e2dc; border-collapse: collapse; margin-top: 6px; }
    .visual-table td { border: 1px solid #e2e2dc; padding: 4px; font-size: 12px; }
    .visual-table .head td { background: #edf3f0; color: #0F4C3A; font-weight: 700; }
    .visual-table .visual-row-label { color: #0F4C3A; font-weight: 700; width: 35%; }
    .label-grid { display: flex; flex-wrap: wrap; gap: 5px; }
    .label-chip { border: 1px solid #e2e2dc; background: #F4F1EA; border-radius: 5px; padding: 3px 5px; font-size: 11px; }
    .bar-row { display: flex; align-items: center; gap: 6px; margin-top: 4px; }
    .bar-label { width: 90px; font-size: 11px; }
    .bar-track { flex: 1; height: 10px; background: #F4F1EA; border-radius: 4px; overflow: hidden; }
    .bar-fill { height: 10px; background: #0F4C3A; }
    .bar-value { width: 28px; font-size: 11px; text-align: right; color: #6B6B6B; }
    .step-list { display: grid; gap: 4px; }
    .step-item { display: flex; gap: 6px; align-items: flex-start; font-size: 12px; line-height: 1.25; }
    .step-index { min-width: 16px; height: 16px; border-radius: 8px; background: #0F4C3A; color: #fff; text-align: center; font-size: 10px; font-weight: 700; line-height: 16px; }
    .line-graph { height: 92px; border-left: 1px solid #0F4C3A; border-bottom: 1px solid #0F4C3A; display: flex; align-items: flex-end; gap: 8px; padding: 6px 8px 16px; }
    .line-point-wrap { flex: 1; height: 100%; position: relative; text-align: center; }
    .line-point { position: absolute; left: 50%; width: 8px; height: 8px; border-radius: 50%; background: #0F4C3A; }
    .line-label { position: absolute; left: 0; right: 0; bottom: -16px; font-size: 9px; color: #666; }
    .number-line { margin-top: 8px; padding: 14px 8px 4px; }
    .number-line-base { height: 2px; background: #0F4C3A; position: relative; }
    .number-line-point { position: absolute; top: -12px; transform: translateX(-50%); text-align: center; font-size: 9px; }
    .number-line-point b { display: block; width: 9px; height: 9px; border-radius: 50%; background: #0F4C3A; margin: 0 auto 2px; }
    .number-line-point em { font-style: normal; }
    .number-line-ends { display: flex; justify-content: space-between; color: #666; font-size: 9px; margin-top: 8px; }
    .coordinate-grid { height: 120px; border: 1px solid #e2e2dc; background-image: linear-gradient(#e2e2dc 1px, transparent 1px), linear-gradient(90deg, #e2e2dc 1px, transparent 1px); background-size: 25% 25%; position: relative; }
    .grid-point { position: absolute; width: 10px; height: 10px; border-radius: 50%; background: #0F4C3A; color: #0F4C3A; font-size: 9px; }
    .shape-visual { text-align: center; margin-top: 8px; }
    .shape { display: inline-block; border: 2px solid #0F4C3A; background: #edf3f0; width: 86px; height: 54px; }
    .shape.circle { border-radius: 50%; width: 70px; height: 70px; }
    .shape.square { width: 68px; height: 68px; }
    .fraction-model { display: flex; min-height: 28px; border: 1px solid #0F4C3A; margin-top: 8px; }
    .fraction-model span { flex: 1; border-right: 1px solid #0F4C3A; }
    .fraction-model .shaded { background: #cfe4da; }
    .venn-visual { min-height: 106px; position: relative; text-align: center; }
    .venn { position: absolute; top: 8px; width: 72px; height: 72px; border: 2px solid #0F4C3A; border-radius: 50%; background: rgba(15,76,58,0.08); }
    .venn.left { left: 32%; }
    .venn.right { right: 32%; }
    .process-flow { display: grid; gap: 5px; }
    .process-node { border: 1px solid #e2e2dc; border-radius: 6px; background: #fff; padding: 6px; font-size: 11px; }
    .process-arrow { color: #0F4C3A; font-weight: 700; text-align: center; }
    .cycle-visual { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; }
    .cycle-node { border: 1px solid #0F4C3A; border-radius: 18px; background: #edf3f0; padding: 5px 8px; font-size: 10px; }
    .classification-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
    .classification-card { border: 1px solid #e2e2dc; border-radius: 6px; background: #fff; padding: 6px; }
    .classification-card strong { color: #0F4C3A; display: block; margin-bottom: 3px; }
    .experiment-setup { border: 1px solid #e2e2dc; border-radius: 6px; background: #fff; padding: 8px; }
    .experiment-bench { height: 5px; background: #777; border-radius: 3px; margin: 28px 0 8px; }
    .apparatus-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
    .apparatus { border: 1px solid #0F4C3A; border-radius: 5px; background: #edf3f0; padding: 6px; min-width: 56px; text-align: center; font-size: 10px; }
    .circuit-diagram, .network-diagram { height: 140px; position: relative; background: #fff; border-radius: 6px; }
    .circuit-wire.top { position: absolute; left: 22%; right: 22%; top: 30px; height: 2px; background: #0F4C3A; }
    .circuit-wire.right { position: absolute; right: 20%; top: 30px; bottom: 30px; width: 2px; background: #0F4C3A; }
    .circuit-wire.bottom { position: absolute; left: 22%; right: 22%; bottom: 30px; height: 2px; background: #0F4C3A; }
    .circuit-wire.left { position: absolute; left: 20%; top: 30px; bottom: 30px; width: 2px; background: #0F4C3A; }
    .circuit-part { position: absolute; border: 1px solid #0F4C3A; border-radius: 6px; background: #edf3f0; padding: 5px; font-size: 9px; text-align: center; min-width: 54px; }
    .circuit-part.p0 { top: 12px; left: 39%; }
    .circuit-part.p1 { top: 58px; right: 4px; }
    .circuit-part.p2 { bottom: 12px; left: 39%; }
    .circuit-part.p3 { top: 58px; left: 4px; }
    .network-line.vtop { position: absolute; left: 50%; top: 32px; width: 2px; height: 42px; background: #777; }
    .network-line.hright { position: absolute; right: 22%; top: 70px; width: 28%; height: 2px; background: #777; }
    .network-line.vbottom { position: absolute; left: 50%; bottom: 32px; width: 2px; height: 42px; background: #777; }
    .network-line.hleft { position: absolute; left: 22%; top: 70px; width: 28%; height: 2px; background: #777; }
    .network-center { position: absolute; left: 39%; top: 50px; width: 22%; border-radius: 7px; background: #0F4C3A; color: #fff; padding: 7px; text-align: center; font-size: 10px; font-weight: 700; }
    .network-node { position: absolute; width: 30%; border: 1px solid #e2e2dc; border-radius: 6px; background: #edf3f0; padding: 5px; text-align: center; font-size: 9px; }
    .network-node.n0 { top: 4px; left: 35%; }
    .network-node.n1 { top: 56px; right: 0; }
    .network-node.n2 { bottom: 4px; left: 35%; }
    .network-node.n3 { top: 56px; left: 0; }
    .interface-mockup { border: 1px solid #e2e2dc; border-radius: 7px; overflow: hidden; background: #fff; }
    .interface-title { background: #0F4C3A; color: #fff; padding: 6px 8px; font-size: 10px; font-weight: 700; }
    .interface-row { border-top: 1px solid #e2e2dc; padding: 6px 8px; font-size: 11px; }
    .story-map { display: grid; gap: 5px; }
    .story-card { border-left: 3px solid #0F4C3A; border-radius: 6px; background: #fff; padding: 6px; font-size: 11px; }
  `;
}

function visualItems(visualAid: NonNullable<LessonPlan['visualAids']>[number], limit = 6) {
  return (visualAid.steps?.length ? visualAid.steps : visualAid.items?.length ? visualAid.items : visualAid.labels ?? [])
    .filter(Boolean)
    .slice(0, limit);
}

function buildProcessVisualHtml(visualAid: NonNullable<LessonPlan['visualAids']>[number]) {
  const items = visualItems(visualAid, 6);
  return `<div class="visual-figure process-flow">${items
    .map((item, index) => `<div class="process-node">${escapeHtml(item)}</div>${index < items.length - 1 ? '<div class="process-arrow">&gt;</div>' : ''}`)
    .join('')}</div>`;
}

function buildCycleVisualHtml(visualAid: NonNullable<LessonPlan['visualAids']>[number]) {
  const items = visualItems(visualAid, 5);
  return `<div class="visual-figure cycle-visual">${items
    .map((item, index) => `<span class="cycle-node">${escapeHtml(item)}</span>${index < items.length - 1 ? '<span class="process-arrow">&gt;</span>' : ''}`)
    .join('')}${items.length > 2 ? '<span class="process-arrow">back to start</span>' : ''}</div>`;
}

function buildClassificationVisualHtml(visualAid: NonNullable<LessonPlan['visualAids']>[number]) {
  const groups = visualAid.groups?.length
    ? visualAid.groups
    : visualItems(visualAid, 4).map((item) => ({ label: item, items: [] }));
  return `<div class="visual-figure classification-grid">${groups
    .slice(0, 4)
    .map((group) => `<div class="classification-card"><strong>${escapeHtml(group.label)}</strong>${(group.items ?? [])
      .slice(0, 4)
      .map((item) => `<div>${escapeHtml(item)}</div>`)
      .join('')}</div>`)
    .join('')}</div>`;
}

function buildExperimentSetupHtml(visualAid: NonNullable<LessonPlan['visualAids']>[number]) {
  const items = visualItems(visualAid, 5);
  return `<div class="visual-figure experiment-setup"><div class="experiment-bench"></div><div class="apparatus-row">${items
    .map((item) => `<span class="apparatus">${escapeHtml(item)}</span>`)
    .join('')}</div></div>`;
}

function buildCircuitVisualHtml(visualAid: NonNullable<LessonPlan['visualAids']>[number]) {
  const items = visualItems(visualAid, 4);
  const labels = items.length ? items : ['Cell', 'Switch', 'Lamp', 'Wire'];
  return `<div class="visual-figure circuit-diagram">
    <span class="circuit-wire top"></span><span class="circuit-wire right"></span><span class="circuit-wire bottom"></span><span class="circuit-wire left"></span>
    ${labels.slice(0, 4).map((label, index) => `<span class="circuit-part p${index}">${escapeHtml(label)}</span>`).join('')}
  </div>`;
}

function buildNetworkVisualHtml(visualAid: NonNullable<LessonPlan['visualAids']>[number]) {
  const center = visualAid.centralNode || visualAid.items?.[0] || 'Hub';
  const nodes = (visualAid.nodes?.length ? visualAid.nodes : visualAid.items?.slice(1) ?? visualAid.labels ?? [])
    .filter(Boolean)
    .slice(0, 4);
  const visibleNodes = nodes.length ? nodes : ['Device 1', 'Device 2', 'Device 3', 'Device 4'];
  return `<div class="visual-figure network-diagram">
    <span class="network-line vtop"></span><span class="network-line hright"></span><span class="network-line vbottom"></span><span class="network-line hleft"></span>
    <span class="network-center">${escapeHtml(center)}</span>
    ${visibleNodes.slice(0, 4).map((node, index) => `<span class="network-node n${index}">${escapeHtml(node)}</span>`).join('')}
  </div>`;
}

function buildInterfaceMockupHtml(visualAid: NonNullable<LessonPlan['visualAids']>[number]) {
  const items = visualItems(visualAid, 5);
  return `<div class="visual-figure interface-mockup"><div class="interface-title">${escapeHtml(visualAid.title)}</div>${items
    .map((item) => `<div class="interface-row">${escapeHtml(item)}</div>`)
    .join('')}</div>`;
}

function buildStoryMapHtml(visualAid: NonNullable<LessonPlan['visualAids']>[number]) {
  return `<div class="visual-figure story-map">${visualItems(visualAid, 5)
    .map((item, index) => `<div class="story-card"><strong>${index + 1}.</strong> ${escapeHtml(item)}</div>`)
    .join('')}</div>`;
}

function buildActivityVisualHtml(
  activities: string[],
  visualAids: NonNullable<LessonPlan['visualAids']>,
) {
  const placements = placeVisualAidsWithActivities(activities, visualAids);
  return `${activities
    .map((item, index) => `<div>${escapeHtml(item)}</div>${(placements.byActivity[index] ?? []).map(buildVisualAidHtml).join('')}`)
    .join('')}${placements.unmatched.map(buildVisualAidHtml).join('')}`;
}

function placeVisualAidsWithActivities(
  activities: string[],
  visualAids: NonNullable<LessonPlan['visualAids']>,
) {
  const byActivity: Record<number, NonNullable<LessonPlan['visualAids']>> = {};
  const unmatched: NonNullable<LessonPlan['visualAids']> = [];
  for (const visualAid of visualAids) {
    const index = findActivityIndex(activities, visualAid.activityLink);
    if (index >= 0) byActivity[index] = [...(byActivity[index] ?? []), visualAid];
    else unmatched.push(visualAid);
  }
  return { byActivity, unmatched };
}

function findActivityIndex(activities: string[], activityLink?: string) {
  const link = normalizeMatchText(activityLink);
  if (!link) return -1;
  let bestIndex = -1;
  let bestScore = 0;
  activities.forEach((activity, index) => {
    const text = normalizeMatchText(activity);
    let score = 0;
    if (text === link) score = 100;
    else if (text.includes(link) || link.includes(text)) score = 80;
    else {
      const words = link.split(' ').filter((word) => word.length > 3);
      const matches = words.filter((word) => text.includes(word)).length;
      score = words.length ? (matches / words.length) * 60 : 0;
    }
    if (score > bestScore) {
      bestIndex = index;
      bestScore = score;
    }
  });
  return bestScore >= 35 ? bestIndex : -1;
}

function normalizeMatchText(value?: string) {
  return (value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function isMatrixTableVisual(visualAid: NonNullable<LessonPlan['visualAids']>[number]) {
  return ['frequency_table', 'tally_table', 'place_value_table', 'observation_table', 'algorithm_trace_table', 'data_table'].includes(visualAid.type);
}

function buildLabelListHtml(labels?: string[]) {
  return labels?.length ? `<div class="label-grid">${labels.slice(0, 6).map((label) => `<span class="label-chip">${escapeHtml(label)}</span>`).join('')}</div>` : '';
}

function buildLocalLanguageHtml(plan: LessonPlan) {
  const support = plan.localLanguageSupport;
  if (!support?.language) return '';
  const sections = [
    buildTranslationSection('Key Vocabulary', support.vocabulary, true),
    buildTranslationSection('Classroom Expressions', support.classroomExpressions),
    buildTranslationSection('Activity Prompts', support.activityPrompts),
    buildTranslationSection('Assessment Prompts', support.assessmentPrompts),
  ].filter(Boolean);
  if (!sections.length) return '';

  return `<section class="local-language">
    <div class="visual-kicker">Local Language Support</div>
    <div class="visual-title">${escapeHtml(support.language)}</div>
    <div class="local-review">${escapeHtml(support.reviewNote || 'AI-assisted draft. Teacher should review before classroom use.')}</div>
    ${sections.join('')}
  </section>`;
}

function buildTranslationSection(
  title: string,
  items?: { english: string; local: string; pronunciation?: string }[],
  showPronunciation = false,
) {
  if (!items?.length) return '';
  return `<div class="translation-group">
    <div class="translation-group-title">${escapeHtml(title)}</div>
    <table class="translation-table">${items
      .map(
        (item) => `<tr>
          <td class="translation-english">${escapeHtml(item.english)}</td>
          <td class="translation-local">${escapeHtml(item.local)}${
            showPronunciation && item.pronunciation
              ? `<span class="translation-pronunciation">${escapeHtml(item.pronunciation)}</span>`
              : ''
          }</td>
        </tr>`,
      )
      .join('')}</table>
  </div>`;
}

function buildLessonTitle(plan: LessonPlan) {
  const rawLessonCount =
    plan.lessonNumber?.trim() ||
    (plan.sessionIndex && plan.sessionsPerWeek
      ? `Lesson ${plan.sessionIndex} of ${plan.sessionsPerWeek}`
      : '');
  const lessonCount =
    rawLessonCount && rawLessonCount.toLowerCase().includes('lesson')
      ? rawLessonCount
      : rawLessonCount
        ? `Lesson ${rawLessonCount}`
        : '';
  const lessonSuffix = lessonCount ? ` (${lessonCount})` : '';
  return `${plan.subjectClassTitle} - ${plan.weekTitle}${lessonSuffix}`;
}
