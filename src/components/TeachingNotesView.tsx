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
  return (
    <View style={styles.visual}>
      <MathText style={styles.visualTitle}>{visual.title}</MathText>
      {visual.imageUrl ? (
        <Image source={{ uri: visual.imageUrl }} style={styles.visualImage} resizeMode="contain" />
      ) : (
        <TeachingNoteVisualFigure visual={visual} />
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

function TeachingNoteVisualFigure({ visual }: { visual: TeachingNoteVisual }) {
  if (visual.type === 'bar_chart' || visual.data?.length) return <BarChartVisual visual={visual} />;
  if (visual.type === 'line_graph') return <LineGraphVisual visual={visual} />;
  if (isTableVisual(visual)) return <TableVisual visual={visual} />;
  if (visual.type === 'number_line') return <NumberLineVisual visual={visual} />;
  if (visual.type === 'coordinate_grid') return <CoordinateGridVisual visual={visual} />;
  if (visual.type === 'geometry_shape' || visual.type === 'angle_diagram') return <ShapeVisual visual={visual} />;
  if (visual.type === 'fraction_model') return <FractionModelVisual visual={visual} />;
  if (visual.type === 'venn_diagram') return <VennVisual visual={visual} />;
  if (visual.type === 'cycle_diagram') return <CycleVisual visual={visual} />;
  if (visual.type === 'flowchart' || visual.type === 'process_diagram' || visual.type === 'block_diagram') return <ProcessVisual visual={visual} />;
  if (visual.type === 'classification_chart') return <ClassificationVisual visual={visual} />;
  if (visual.type === 'experiment_setup') return <ExperimentSetupVisual visual={visual} />;
  if (visual.type === 'circuit_diagram') return <CircuitVisual visual={visual} />;
  if (visual.type === 'network_diagram') return <NetworkVisual visual={visual} />;
  if (visual.type === 'interface_mockup') return <InterfaceMockupVisual visual={visual} />;
  if (visual.type === 'story_map') return <StoryMapVisual visual={visual} />;
  return <LabelledVisual visual={visual} />;
}

function BarChartVisual({ visual }: { visual: TeachingNoteVisual }) {
  if (!visual.data?.length) return <LabelledVisual visual={visual} />;
  const maxValue = Math.max(...visual.data.map((entry) => entry.value), 1);
  return (
    <View style={styles.chart}>
      {visual.data.slice(0, 5).map((item, index) => (
        <View key={`${item.label}-${index}`} style={styles.barRow}>
          <MathText style={styles.barLabel}>{item.label}</MathText>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${Math.max(8, (item.value / maxValue) * 100)}%` }]} />
          </View>
          <Text style={styles.barValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

function LineGraphVisual({ visual }: { visual: TeachingNoteVisual }) {
  if (!visual.data?.length) return <LabelledVisual visual={visual} />;
  const maxValue = Math.max(...visual.data.map((entry) => entry.value), 1);
  return (
    <View style={styles.lineGraph}>
      {visual.data.slice(0, 6).map((item, index) => (
        <View key={`${item.label}-${index}`} style={styles.linePointColumn}>
          <View style={styles.linePointTrack}>
            <View style={[styles.linePoint, { bottom: `${Math.max(4, (item.value / maxValue) * 86)}%` }]} />
          </View>
          <MathText style={styles.linePointLabel}>{item.label}</MathText>
        </View>
      ))}
    </View>
  );
}

function TableVisual({ visual }: { visual: TeachingNoteVisual }) {
  const rows = visual.cells?.length
    ? visual.cells
    : visual.rows?.length
      ? visual.rows
      : visual.labels?.map((label) => [label.label, label.description ?? '']) ?? [];
  const columns = visual.columns ?? [];
  return (
    <View style={styles.tableVisual}>
      {columns.length ? (
        <View style={[styles.tableRow, styles.tableHead]}>
          {columns.slice(0, 6).map((cell, index) => <MathText key={`${cell}-${index}`} style={styles.tableHeadCell}>{cell}</MathText>)}
        </View>
      ) : null}
      {rows.slice(0, 8).map((row, rowIndex) => (
        <View key={rowIndex} style={[styles.tableRow, rowIndex === 0 && !columns.length && styles.tableHead]}>
          {row.slice(0, 6).map((cell, cellIndex) => (
            <MathText key={cellIndex} style={styles.tableCell}>{cell}</MathText>
          ))}
        </View>
      ))}
    </View>
  );
}

function NumberLineVisual({ visual }: { visual: TeachingNoteVisual }) {
  const min = Number.isFinite(visual.min) ? Number(visual.min) : 0;
  const max = Number.isFinite(visual.max) && Number(visual.max) > min ? Number(visual.max) : min + 10;
  const points = visual.points ?? [];
  return (
    <View style={styles.numberLineBox}>
      <View style={styles.numberLine}>
        {points.map((point, index) => {
          const percent = Math.max(0, Math.min(100, ((point.value - min) / (max - min)) * 100));
          return (
            <View key={`${point.value}-${index}`} style={[styles.numberLinePoint, { left: `${percent}%` }]}>
              <Text style={styles.numberLineDot} />
              <MathText style={styles.numberLinePointLabel}>{point.label || point.value}</MathText>
            </View>
          );
        })}
      </View>
      <View style={styles.numberLineTicks}>
        <MathText style={styles.numberLineTick}>{min}</MathText>
        <MathText style={styles.numberLineTick}>{max}</MathText>
      </View>
    </View>
  );
}

function CoordinateGridVisual({ visual }: { visual: TeachingNoteVisual }) {
  return (
    <View style={styles.gridBox}>
      {Array.from({ length: 5 }).map((_, index) => <View key={`h-${index}`} style={[styles.gridLineH, { top: `${index * 25}%` }]} />)}
      {Array.from({ length: 5 }).map((_, index) => <View key={`v-${index}`} style={[styles.gridLineV, { left: `${index * 25}%` }]} />)}
      {(visual.points ?? []).slice(0, 8).map((point, index) => (
        <View key={`${point.x}-${point.y}-${index}`} style={[styles.gridPoint, { left: `${Math.max(0, Math.min(95, Number(point.x ?? point.value) * 10))}%`, bottom: `${Math.max(0, Math.min(95, Number(point.y ?? 0) * 10))}%` }]}>
          <Text style={styles.gridPointDot} />
          {point.label ? <MathText style={styles.gridPointLabel}>{point.label}</MathText> : null}
        </View>
      ))}
    </View>
  );
}

function ShapeVisual({ visual }: { visual: TeachingNoteVisual }) {
  const shape = (visual.shape || '').toLowerCase();
  const shapeStyle = shape.includes('circle') ? styles.shapeCircle : shape.includes('triangle') ? styles.shapeTriangle : shape.includes('square') ? styles.shapeSquare : styles.shapeRectangle;
  return (
    <View style={styles.shapeBox}>
      <View style={[styles.shapeBase, shapeStyle]} />
      <LabelList labels={visualItems(visual)} />
    </View>
  );
}

function FractionModelVisual({ visual }: { visual: TeachingNoteVisual }) {
  const segments = Math.max(1, Math.min(12, Number(visual.segments) || 4));
  const shaded = Math.max(0, Math.min(segments, Number(visual.shadedSegments) || 0));
  return (
    <View style={styles.fractionBar}>
      {Array.from({ length: segments }).map((_, index) => <View key={index} style={[styles.fractionSegment, index < shaded && styles.fractionSegmentShaded]} />)}
    </View>
  );
}

function VennVisual({ visual }: { visual: TeachingNoteVisual }) {
  return (
    <View style={styles.vennBox}>
      <View style={[styles.vennCircle, styles.vennLeft]} />
      <View style={[styles.vennCircle, styles.vennRight]} />
      <LabelList labels={visualItems(visual)} />
    </View>
  );
}

function ProcessVisual({ visual }: { visual: TeachingNoteVisual }) {
  const items = visualItems(visual);
  return (
    <View style={styles.processFlow}>
      {items.map((item, index) => (
        <View key={`${item}-${index}`} style={styles.processPair}>
          <View style={styles.processNode}><MathText style={styles.processText}>{item}</MathText></View>
          {index < items.length - 1 ? <Text style={styles.processArrow}>{'>'}</Text> : null}
        </View>
      ))}
    </View>
  );
}

function CycleVisual({ visual }: { visual: TeachingNoteVisual }) {
  const items = visualItems(visual, 5);
  return (
    <View style={styles.cycleBox}>
      {items.map((item, index) => (
        <View key={`${item}-${index}`} style={styles.cycleNode}>
          <MathText style={styles.cycleText}>{item}</MathText>
          {index < items.length - 1 ? <Text style={styles.cycleArrow}>{'>'}</Text> : null}
        </View>
      ))}
      {items.length > 2 ? <Text style={styles.cycleReturn}>returns to start</Text> : null}
    </View>
  );
}

function ClassificationVisual({ visual }: { visual: TeachingNoteVisual }) {
  const groups = visual.groups?.length ? visual.groups : visualItems(visual, 4).map((item) => ({ label: item, items: [] }));
  return (
    <View style={styles.classificationGrid}>
      {groups.slice(0, 4).map((group, index) => (
        <View key={`${group.label}-${index}`} style={styles.classificationCard}>
          <MathText style={styles.classificationTitle}>{group.label}</MathText>
          {(group.items ?? []).slice(0, 4).map((item, itemIndex) => <MathText key={`${item}-${itemIndex}`} style={styles.classificationItem}>{item}</MathText>)}
        </View>
      ))}
    </View>
  );
}

function ExperimentSetupVisual({ visual }: { visual: TeachingNoteVisual }) {
  return (
    <View style={styles.experimentBox}>
      <View style={styles.experimentBench} />
      <View style={styles.apparatusRow}>
        {visualItems(visual, 5).map((item, index) => <View key={`${item}-${index}`} style={styles.apparatusBlock}><MathText style={styles.apparatusText}>{item}</MathText></View>)}
      </View>
    </View>
  );
}

function CircuitVisual({ visual }: { visual: TeachingNoteVisual }) {
  const items = visualItems(visual, 4);
  const labels = items.length ? items : ['Cell', 'Switch', 'Lamp', 'Wire'];
  return (
    <View style={styles.circuitBox}>
      <View style={styles.circuitWireTop} /><View style={styles.circuitWireRight} /><View style={styles.circuitWireBottom} /><View style={styles.circuitWireLeft} />
      {labels.slice(0, 4).map((label, index) => <View key={`${label}-${index}`} style={[styles.circuitComponent, circuitComponentStyle(index)]}><MathText style={styles.circuitText}>{label}</MathText></View>)}
    </View>
  );
}

function NetworkVisual({ visual }: { visual: TeachingNoteVisual }) {
  const center = visual.centralNode || visual.items?.[0] || 'Hub';
  const nodes = (visual.nodes?.length ? visual.nodes : visual.items?.slice(1) ?? visual.labels?.map((label) => label.label) ?? []).filter(Boolean).slice(0, 4);
  const visibleNodes = nodes.length ? nodes : ['Device 1', 'Device 2', 'Device 3', 'Device 4'];
  return (
    <View style={styles.networkBox}>
      <View style={[styles.networkLine, styles.networkLineTop]} /><View style={[styles.networkLine, styles.networkLineRight]} /><View style={[styles.networkLine, styles.networkLineBottom]} /><View style={[styles.networkLine, styles.networkLineLeft]} />
      <View style={styles.networkCenter}><MathText style={styles.networkCenterText}>{center}</MathText></View>
      {visibleNodes.map((node, index) => <View key={`${node}-${index}`} style={[styles.networkNode, networkNodeStyle(index)]}><MathText style={styles.networkNodeText}>{node}</MathText></View>)}
    </View>
  );
}

function InterfaceMockupVisual({ visual }: { visual: TeachingNoteVisual }) {
  return (
    <View style={styles.interfaceBox}>
      <View style={styles.interfaceTitleBar}><View style={styles.interfaceDot} /><MathText style={styles.interfaceTitle}>{visual.title}</MathText></View>
      {visualItems(visual, 5).map((item, index) => <View key={`${item}-${index}`} style={styles.interfaceRow}><View style={styles.interfaceIcon} /><MathText style={styles.interfaceText}>{item}</MathText></View>)}
    </View>
  );
}

function StoryMapVisual({ visual }: { visual: TeachingNoteVisual }) {
  return <View style={styles.storyMap}>{visualItems(visual, 5).map((item, index) => <View key={`${item}-${index}`} style={styles.storyCard}><Text style={styles.storyIndex}>{index + 1}</Text><MathText style={styles.storyText}>{item}</MathText></View>)}</View>;
}

function LabelledVisual({ visual }: { visual: TeachingNoteVisual }) {
  return <View style={styles.diagramBox}><LabelList labels={visualItems(visual)} /></View>;
}

function LabelList({ labels }: { labels: string[] }) {
  return <View style={styles.labelWrap}>{labels.slice(0, 8).map((label, index) => <MathText key={`${label}-${index}`} style={styles.labelPill}>{label}</MathText>)}</View>;
}

function visualItems(visual: TeachingNoteVisual, limit = 6) {
  return (visual.steps?.length ? visual.steps : visual.items?.length ? visual.items : visual.labels?.map((item) => item.description ? `${item.label}: ${item.description}` : item.label) ?? [])
    .filter(Boolean)
    .slice(0, limit);
}

function isTableVisual(visual: TeachingNoteVisual) {
  return Boolean(visual.rows?.length || visual.cells?.length || ['comparison_table', 'frequency_table', 'tally_table', 'place_value_table', 'observation_table', 'algorithm_trace_table', 'data_table', 'labelled_diagram'].includes(visual.type ?? ''));
}

function circuitComponentStyle(index: number) {
  return [styles.circuitTop, styles.circuitRight, styles.circuitBottom, styles.circuitLeft][index] ?? styles.circuitTop;
}

function networkNodeStyle(index: number) {
  return [styles.networkTop, styles.networkRight, styles.networkBottom, styles.networkLeft][index] ?? styles.networkTop;
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
  lineGraph: { height: 112, borderLeftWidth: 1, borderBottomWidth: 1, borderColor: colors.borderStrong, flexDirection: 'row', alignItems: 'flex-end', gap: 6, paddingHorizontal: 8, paddingTop: 8, backgroundColor: '#fff' },
  linePointColumn: { flex: 1, height: '100%', alignItems: 'center' },
  linePointTrack: { flex: 1, width: '100%', position: 'relative' },
  linePoint: { position: 'absolute', width: 9, height: 9, borderRadius: 5, backgroundColor: colors.primary, alignSelf: 'center' },
  linePointLabel: { fontSize: 9, color: colors.textMuted, textAlign: 'center', minHeight: 18 },
  tableHeadCell: { flex: 1, padding: 8, color: colors.tableHeaderText, fontWeight: '800', borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.border },
  numberLineBox: { paddingTop: 20, paddingHorizontal: 8, backgroundColor: '#fff', borderRadius: 6 },
  numberLine: { height: 2, backgroundColor: colors.primary, position: 'relative' },
  numberLinePoint: { position: 'absolute', top: -16, alignItems: 'center', transform: [{ translateX: -8 }] },
  numberLineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  numberLinePointLabel: { fontSize: 9, color: colors.text, marginTop: 2 },
  numberLineTicks: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  numberLineTick: { fontSize: 9, color: colors.textMuted },
  gridBox: { height: 140, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, position: 'relative' },
  gridLineH: { position: 'absolute', left: 0, right: 0, height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  gridLineV: { position: 'absolute', top: 0, bottom: 0, width: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  gridPoint: { position: 'absolute', alignItems: 'center' },
  gridPointDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  gridPointLabel: { fontSize: 9, color: colors.text },
  shapeBox: { alignItems: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 6, padding: 10 },
  shapeBase: { borderWidth: 2, borderColor: colors.primary, backgroundColor: colors.primarySoft },
  shapeCircle: { width: 80, height: 80, borderRadius: 40 },
  shapeRectangle: { width: 112, height: 64, borderRadius: 4 },
  shapeSquare: { width: 78, height: 78, borderRadius: 4 },
  shapeTriangle: { width: 0, height: 0, borderLeftWidth: 44, borderRightWidth: 44, borderBottomWidth: 78, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: colors.primarySoft, backgroundColor: 'transparent' },
  fractionBar: { flexDirection: 'row', borderWidth: 1, borderColor: colors.primary, minHeight: 34 },
  fractionSegment: { flex: 1, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.primary, backgroundColor: '#fff' },
  fractionSegmentShaded: { backgroundColor: colors.primarySoft },
  vennBox: { minHeight: 130, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 6, paddingBottom: 8 },
  vennCircle: { position: 'absolute', top: 12, width: 86, height: 86, borderRadius: 43, borderWidth: 2, borderColor: colors.primary, backgroundColor: 'rgba(15,76,58,0.08)' },
  vennLeft: { left: '24%' },
  vennRight: { right: '24%' },
  processFlow: { gap: 5 },
  processPair: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  processNode: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 6, padding: 7, backgroundColor: '#fff' },
  processText: { fontSize: 12, color: colors.text, lineHeight: 17 },
  processArrow: { width: 18, color: colors.primary, fontWeight: '900', textAlign: 'center' },
  cycleBox: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  cycleNode: { maxWidth: 126, borderWidth: 1, borderColor: colors.primary, borderRadius: 32, paddingVertical: 7, paddingHorizontal: 9, backgroundColor: colors.primarySoft, flexDirection: 'row', alignItems: 'center', gap: 5 },
  cycleText: { fontSize: 11, color: colors.text, lineHeight: 15 },
  cycleArrow: { color: colors.primary, fontWeight: '900' },
  cycleReturn: { width: '100%', fontSize: 10, color: colors.textMuted, textAlign: 'center', marginTop: 2 },
  classificationGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  classificationCard: { width: '48%', minHeight: 68, borderWidth: 1, borderColor: colors.border, borderRadius: 6, backgroundColor: '#fff', padding: 7 },
  classificationTitle: { fontSize: 12, fontWeight: '800', color: colors.primary, marginBottom: 4 },
  classificationItem: { fontSize: 11, color: colors.text, lineHeight: 15 },
  experimentBox: { minHeight: 108, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 6, padding: 8, justifyContent: 'flex-end' },
  experimentBench: { height: 5, backgroundColor: colors.borderStrong, borderRadius: 3, marginBottom: 8 },
  apparatusRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 6, flexWrap: 'wrap' },
  apparatusBlock: { minWidth: 54, minHeight: 36, borderWidth: 1, borderColor: colors.primary, borderRadius: 5, backgroundColor: colors.primarySoft, padding: 5, justifyContent: 'center' },
  apparatusText: { fontSize: 10, color: colors.text, textAlign: 'center', lineHeight: 13 },
  circuitBox: { height: 150, backgroundColor: '#fff', borderRadius: 6, position: 'relative' },
  circuitWireTop: { position: 'absolute', left: '23%', right: '23%', top: 32, height: 2, backgroundColor: colors.primary },
  circuitWireRight: { position: 'absolute', right: '20%', top: 32, bottom: 32, width: 2, backgroundColor: colors.primary },
  circuitWireBottom: { position: 'absolute', left: '23%', right: '23%', bottom: 32, height: 2, backgroundColor: colors.primary },
  circuitWireLeft: { position: 'absolute', left: '20%', top: 32, bottom: 32, width: 2, backgroundColor: colors.primary },
  circuitComponent: { position: 'absolute', minWidth: 56, maxWidth: 82, borderWidth: 1, borderColor: colors.primary, borderRadius: 6, backgroundColor: colors.primarySoft, padding: 5 },
  circuitText: { fontSize: 10, color: colors.text, textAlign: 'center' },
  circuitTop: { top: 16, left: '38%' },
  circuitRight: { right: 8, top: 62 },
  circuitBottom: { bottom: 16, left: '38%' },
  circuitLeft: { left: 8, top: 62 },
  networkBox: { height: 168, backgroundColor: '#fff', borderRadius: 6, position: 'relative' },
  networkLine: { position: 'absolute', backgroundColor: colors.borderStrong },
  networkLineTop: { left: '50%', top: 36, width: 2, height: 48 },
  networkLineRight: { right: '23%', top: 84, width: '27%', height: 2 },
  networkLineBottom: { left: '50%', bottom: 36, width: 2, height: 48 },
  networkLineLeft: { left: '23%', top: 84, width: '27%', height: 2 },
  networkCenter: { position: 'absolute', left: '38%', top: 62, width: '24%', minHeight: 44, borderRadius: 8, backgroundColor: colors.primary, padding: 6, justifyContent: 'center' },
  networkCenterText: { color: '#fff', fontWeight: '800', fontSize: 10, textAlign: 'center' },
  networkNode: { position: 'absolute', width: '30%', minHeight: 34, borderWidth: 1, borderColor: colors.border, borderRadius: 7, backgroundColor: colors.primarySoft, padding: 5, justifyContent: 'center' },
  networkNodeText: { fontSize: 10, color: colors.text, textAlign: 'center' },
  networkTop: { top: 8, left: '35%' },
  networkRight: { right: 2, top: 67 },
  networkBottom: { bottom: 8, left: '35%' },
  networkLeft: { left: 2, top: 67 },
  interfaceBox: { borderWidth: 1, borderColor: colors.border, borderRadius: 7, overflow: 'hidden', backgroundColor: '#fff' },
  interfaceTitleBar: { minHeight: 28, backgroundColor: colors.tableHeader, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8 },
  interfaceDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  interfaceTitle: { flex: 1, color: colors.tableHeaderText, fontSize: 10, fontWeight: '800' },
  interfaceRow: { flexDirection: 'row', alignItems: 'center', gap: 7, padding: 7, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  interfaceIcon: { width: 18, height: 18, borderRadius: 4, backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: colors.border },
  interfaceText: { flex: 1, fontSize: 12, color: colors.text, lineHeight: 16 },
  storyMap: { gap: 6 },
  storyCard: { borderLeftWidth: 3, borderLeftColor: colors.primary, backgroundColor: '#fff', borderRadius: 6, padding: 7, flexDirection: 'row', gap: 7, alignItems: 'flex-start' },
  storyIndex: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.primary, color: '#fff', textAlign: 'center', fontSize: 10, fontWeight: '800', lineHeight: 18 },
  storyText: { flex: 1, fontSize: 12, color: colors.text, lineHeight: 17 },
});
