import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MathText } from '@/components/MathText';
import { loadRuntimeAppSettingsOrDefault } from '@/lib/appSettings';
import {
  contentBlockToVisual,
  getTeachingNoteContentBlocks,
  isVisualTeachingNoteBlockType,
} from '@/lib/teachingNoteContent';
import { colors } from '@/theme/colors';
import type { TeachingNoteContentBlock, TeachingNoteVisual, TeachingNotes } from '@/types/teachingNotes';

export function TeachingNotesView({
  notes,
  showVisuals,
  showGeneratedVisuals: showGeneratedVisualsOverride,
}: {
  notes: TeachingNotes;
  /** @deprecated Use showGeneratedVisuals */
  showVisuals?: boolean;
  showGeneratedVisuals?: boolean;
}) {
  const resolvedOverride = showGeneratedVisualsOverride ?? showVisuals;
  const [showGeneratedVisuals, setShowGeneratedVisuals] = useState(Boolean(resolvedOverride));

  useEffect(() => {
    if (resolvedOverride !== undefined) {
      setShowGeneratedVisuals(resolvedOverride);
      return;
    }
    loadRuntimeAppSettingsOrDefault()
      .then((settings) => setShowGeneratedVisuals(settings.visualGeneration.enabled))
      .catch(() => setShowGeneratedVisuals(false));
  }, [resolvedOverride]);

  const contentBlocks = getTeachingNoteContentBlocks(notes, {
    includeGeneratedVisuals: showGeneratedVisuals,
  });
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <MathText style={styles.title}>{notes.title}</MathText>
        <MathText style={styles.meta}>
          {notes.subject} - {notes.classLevel} - Week {notes.week}
          {notes.lessonNumber ? ` - Lesson ${notes.lessonNumber}` : ''}
          {notes.versionNumber ? ` - Version ${notes.versionNumber}` : ''}
        </MathText>
      </View>

      <Section title="Overview" text={notes.overview} />
      <ContentBlocks blocks={contentBlocks} />
      <ListSection title="Teacher Preparation" items={notes.preparation} />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Teaching Guide</Text>
        {notes.phaseGuidance.map((phase) => (
          <View key={phase.phase} style={styles.phaseBlock}>
            <MathText style={styles.phaseTitle}>Phase {phase.phase}: {phase.title}</MathText>
            {phase.teacherNotes.map((item, index) => (
              <Bullet key={index} text={item} />
            ))}
          </View>
        ))}
      </View>
      <ListSection title="Key Explanations" items={notes.keyExplanations} />
      <ListSection title="Likely Misconceptions" items={notes.misconceptions} />
      <ListSection title="Questions to Ask" items={notes.questionsToAsk} />
      <ListSection title="Differentiation" items={notes.differentiation} />
      <ListSection title="Classroom Management" items={notes.classroomManagement} />
      <ListSection title="Board Summary" items={notes.boardSummary} />
      <ListSection title="Homework / Follow-up" items={notes.homework ?? []} />
    </ScrollView>
  );
}

function ContentBlocks({ blocks }: { blocks: TeachingNoteContentBlock[] }) {
  if (!blocks.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Lesson Note</Text>
      {blocks.map((block) => {
        if (isVisualTeachingNoteBlockType(block.type)) {
          return <VisualBlock key={block.id} visual={contentBlockToVisual(block)} />;
        }
        if (block.type === 'heading') {
          return <MathText key={block.id} style={styles.contentHeading}>{block.text || block.title}</MathText>;
        }
        if (block.items?.length) {
          return (
            <View key={block.id} style={styles.contentBlock}>
              {block.title ? <MathText style={styles.visualTitle}>{block.title}</MathText> : null}
              {block.items.map((item, index) => <Bullet key={index} text={item} />)}
            </View>
          );
        }
        return block.text ? (
          <View key={block.id} style={styles.contentBlock}>
            {block.title ? <MathText style={styles.visualTitle}>{block.title}</MathText> : null}
            <MathText style={styles.body}>{block.text}</MathText>
          </View>
        ) : null;
      })}
    </View>
  );
}

function Section({ title, text }: { title: string; text?: string }) {
  if (!text) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <MathText style={styles.body}>{text}</MathText>
    </View>
  );
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item, index) => <Bullet key={index} text={item} />)}
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>{'\u2022'}</Text>
      <MathText style={styles.body}>{text}</MathText>
    </View>
  );
}

function VisualBlock({ visual }: { visual: TeachingNoteVisual }) {
  const barChart = visual.data?.length ? (
    <View style={styles.chart}>
      {visual.data.slice(0, 5).map((item, index) => {
        const maxValue = Math.max(...visual.data!.map((entry) => entry.value), 1);
        return (
          <View key={`${item.label}-${index}`} style={styles.barRow}>
            <MathText style={styles.barLabel}>{item.label}</MathText>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${Math.max(8, (item.value / maxValue) * 100)}%` }]} />
            </View>
            <Text style={styles.barValue}>{item.value}</Text>
          </View>
        );
      })}
    </View>
  ) : null;

  return (
    <View style={styles.visual}>
      <MathText style={styles.visualTitle}>{visual.title}</MathText>
      {visual.imageUrl ? (
        <Image source={{ uri: visual.imageUrl }} style={styles.visualImage} resizeMode="contain" />
      ) : barChart ? (
        barChart
      ) : (
        <View style={styles.diagramBox}>
          {(visual.steps ?? visual.labels?.map((item) => item.label) ?? []).map((item, index) => (
            <View key={`${visual.id}-${index}`} style={styles.diagramStep}>
              <Text style={styles.diagramIndex}>{index + 1}</Text>
              <MathText style={styles.diagramText}>{item}</MathText>
            </View>
          ))}
          {visual.rows?.length ? (
            <View style={styles.tableVisual}>
              {visual.rows.map((row, rowIndex) => (
                <View key={rowIndex} style={[styles.tableRow, rowIndex === 0 && styles.tableHead]}>
                  {row.map((cell, cellIndex) => (
                    <MathText key={cellIndex} style={styles.tableCell}>{cell}</MathText>
                  ))}
                </View>
              ))}
            </View>
          ) : null}
        </View>
      )}
      {visual.caption ? <MathText style={styles.caption}>{visual.caption}</MathText> : null}
      {visual.attribution ? <MathText style={styles.attribution}>{visual.attribution}</MathText> : null}
      {visual.labels?.length && visual.imageUrl ? (
        <View style={styles.labelWrap}>
          {visual.labels.map((item) => (
            <MathText key={item.label} style={styles.labelPill}>{item.label}</MathText>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 56 },
  header: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.primaryDark, marginBottom: 4 },
  meta: { color: colors.textMuted, lineHeight: 18 },
  section: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: colors.text, marginBottom: 8 },
  body: { flex: 1, color: colors.text, fontSize: 14, lineHeight: 21 },
  bulletRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  bulletDot: { color: colors.primary, fontWeight: '800', lineHeight: 21 },
  phaseBlock: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    marginTop: 8,
  },
  phaseTitle: { color: colors.primary, fontWeight: '800', marginBottom: 6 },
  contentBlock: { marginBottom: 10 },
  contentHeading: { fontSize: 16, fontWeight: '800', color: colors.primaryDark, marginBottom: 8 },
  visual: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    backgroundColor: colors.tableRowAlt,
  },
  visualTitle: { fontWeight: '800', color: colors.text, marginBottom: 8 },
  visualImage: { width: '100%', height: 180, backgroundColor: '#fff', borderRadius: 6 },
  diagramBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#fff',
    gap: 8,
  },
  diagramStep: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  diagramIndex: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '800',
  },
  diagramText: { flex: 1, color: colors.text, lineHeight: 19 },
  tableVisual: { borderWidth: 1, borderColor: colors.border, borderRadius: 6, overflow: 'hidden' },
  tableRow: { flexDirection: 'row' },
  tableHead: { backgroundColor: colors.tableHeader },
  tableCell: { flex: 1, padding: 8, color: colors.text, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.border },
  caption: { color: colors.text, lineHeight: 18, marginTop: 8 },
  attribution: { color: colors.textMuted, fontSize: 11, lineHeight: 16, marginTop: 4 },
  labelWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  labelPill: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    color: colors.primary,
    fontWeight: '700',
  },
  chart: { gap: 8 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  barLabel: { width: 72, fontSize: 12, color: colors.text },
  barTrack: { flex: 1, height: 12, backgroundColor: '#e8e8e4', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.primary },
  barValue: { width: 28, fontSize: 12, color: colors.textMuted, textAlign: 'right' },
});
