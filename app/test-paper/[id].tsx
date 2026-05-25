import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { MathText } from '@/components/MathText';
import { PreviewActionButton, PreviewActions, PreviewHeader } from '@/components/PreviewChrome';
import { useToast } from '@/components/ToastProvider';
import { exportRewrittenTestPaperPdf, exportRewrittenTestPaperWord } from '@/lib/export';
import { goBackOrReplace } from '@/lib/navigation';
import { deleteTestPaper, getTestPaperById } from '@/lib/testPaperStore';
import { colors, radii, spacing, typography } from '@/theme/colors';
import type { LessonVisualAid } from '@/types/lessonPlan';
import type { CompiledTestPaper } from '@/types/testItemCompiler';

export default function TestPaperDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast } = useToast();
  const [paper, setPaper] = useState<CompiledTestPaper | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!id) return;
      try {
        const result = await getTestPaperById(id);
        if (active) setPaper(result);
      } finally {
        if (active) setLoaded(true);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [id]);

  if (!loaded) {
    return (
      <View style={styles.emptyScreen}>
        <Text style={styles.muted}>Loading test paper...</Text>
      </View>
    );
  }

  if (!paper) {
    return (
      <View style={styles.emptyScreen}>
        <Button title="Test paper not found" variant="secondary" onPress={() => goBackOrReplace()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PreviewHeader
        title="Test Paper"
        subtitle={`${paper.subject} - ${paper.classLevel}${paper.termTitle ? ` - ${paper.termTitle}` : ''}${paper.editedAt ? ' - Edited' : ''}`}
        onBack={() => goBackOrReplace()}
        onEdit={() => router.push(`/test-paper/edit/${encodeURIComponent(paper.id ?? '')}`)}
        onShare={() => exportRewrittenTestPaperPdf(paper)}
        onDelete={async () => {
          const confirmed = await confirmRemoval('Delete test paper', `Delete ${paper.title}?`);
          if (!confirmed || !paper.id) return;
          await deleteTestPaper(paper.id);
          showToast({ message: 'Test paper deleted.' });
          goBackOrReplace();
        }}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{paper.title}</Text>
          <Text style={styles.meta}>
            {paper.subject} - {paper.classLevel}
            {paper.termTitle ? ` - ${paper.termTitle}` : ''} - {paper.totalMarks} marks
          </Text>
        </View>

        {paper.instructions.length ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Instructions</Text>
            {paper.instructions.map((instruction, index) => (
              <MathText key={`${instruction}-${index}`} style={styles.bodyText}>
                {index + 1}. {instruction}
              </MathText>
            ))}
          </View>
        ) : null}

        {paper.sections.map((section) => (
          <View key={section.id} style={styles.card}>
            <Text style={styles.cardTitle}>{section.title}</Text>
            {section.questions.map((question) => (
              <View key={question.id} style={styles.questionBlock}>
                <MathText style={styles.bodyText}>
                  {question.id}. {question.text} [{question.marks} mark{question.marks === 1 ? '' : 's'}]
                </MathText>
                {question.visuals?.map((visual, index) => (
                  <TestVisual key={visual.id ?? `${question.id}-visual-${index}`} visual={visual} />
                ))}
              </View>
            ))}
          </View>
        ))}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Answer Key</Text>
          {paper.answerKey.map((item, index) => (
            <View key={`${item.questionId}-${index}`} style={styles.answerItem}>
              <MathText style={styles.bodyText}>
                {index + 1}. {item.answer}
              </MathText>
              {item.markingGuide?.map((guide, guideIndex) => (
                <MathText key={`${item.questionId}-guide-${guideIndex}`} style={styles.guideText}>
                  - {guide}
                </MathText>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      <PreviewActions>
        <PreviewActionButton title="PDF" icon="document-text-outline" onPress={() => exportRewrittenTestPaperPdf(paper)} />
        <PreviewActionButton title="Word" icon="download-outline" variant="secondary" onPress={() => exportRewrittenTestPaperWord(paper)} />
      </PreviewActions>
    </View>
  );
}

function TestVisual({ visual }: { visual: LessonVisualAid }) {
  return (
    <View style={styles.visual}>
      <MathText style={styles.visualTitle}>{visual.title}</MathText>
      <VisualFigure visual={visual} />
      {visual.caption ? <MathText style={styles.caption}>{visual.caption}</MathText> : null}
    </View>
  );
}

function VisualFigure({ visual }: { visual: LessonVisualAid }) {
  if (visual.type === 'bar_chart' && visual.data?.length) return <BarChart visual={visual} />;
  if (visual.type === 'line_graph' && visual.data?.length) return <LineGraph visual={visual} />;
  if (isTableVisual(visual)) return <MatrixTable visual={visual} />;
  if (visual.type === 'number_line') return <NumberLine visual={visual} />;
  if (visual.type === 'coordinate_grid') return <CoordinateGrid visual={visual} />;
  if (visual.type === 'geometry_shape' || visual.type === 'angle_diagram') return <ShapeVisual visual={visual} />;
  if (visual.type === 'fraction_model') return <FractionModel visual={visual} />;
  if (visual.type === 'venn_diagram') return <Venn visual={visual} />;
  if (visual.type === 'network_diagram') return <Network visual={visual} />;
  if (visual.type === 'circuit_diagram') return <Circuit visual={visual} />;
  if (visual.type === 'flowchart' || visual.type === 'process_diagram' || visual.type === 'block_diagram' || visual.type === 'cycle_diagram' || visual.type === 'story_map') return <Steps visual={visual} />;
  if (visual.type === 'classification_chart') return <Classification visual={visual} />;
  return <LabelList labels={visualItems(visual)} />;
}

function BarChart({ visual }: { visual: LessonVisualAid }) {
  const maxValue = Math.max(...(visual.data ?? []).map((item) => item.value), 1);
  return <View style={styles.chart}>{(visual.data ?? []).slice(0, 5).map((item, index) => (
    <View key={`${item.label}-${index}`} style={styles.barRow}>
      <MathText style={styles.barLabel}>{item.label}</MathText>
      <View style={styles.barTrack}><View style={[styles.barFill, { width: `${Math.max(8, (item.value / maxValue) * 100)}%` }]} /></View>
      <Text style={styles.barValue}>{item.value}</Text>
    </View>
  ))}</View>;
}

function LineGraph({ visual }: { visual: LessonVisualAid }) {
  const maxValue = Math.max(...(visual.data ?? []).map((item) => item.value), 1);
  return <View style={styles.lineGraph}>{(visual.data ?? []).slice(0, 6).map((item, index) => (
    <View key={`${item.label}-${index}`} style={styles.linePointColumn}>
      <View style={styles.linePointTrack}><View style={[styles.linePoint, { bottom: `${Math.max(4, (item.value / maxValue) * 86)}%` }]} /></View>
      <MathText style={styles.linePointLabel}>{item.label}</MathText>
    </View>
  ))}</View>;
}

function MatrixTable({ visual }: { visual: LessonVisualAid }) {
  const rows = visual.cells?.length ? visual.cells : visual.rows?.map((row) => [row.label, row.value]) ?? [];
  const columns = visual.columns?.length ? visual.columns : visual.rows?.length ? ['Item', 'Value'] : [];
  return <View style={styles.tableVisual}>{columns.length ? <View style={[styles.tableRow, styles.tableHead]}>{columns.map((cell, index) => <MathText key={`${cell}-${index}`} style={styles.tableHeadCell}>{cell}</MathText>)}</View> : null}{rows.slice(0, 8).map((row, rowIndex) => <View key={rowIndex} style={styles.tableRow}>{row.slice(0, 6).map((cell, cellIndex) => <MathText key={cellIndex} style={styles.tableCell}>{cell}</MathText>)}</View>)}</View>;
}

function NumberLine({ visual }: { visual: LessonVisualAid }) {
  const min = Number.isFinite(visual.min) ? Number(visual.min) : 0;
  const max = Number.isFinite(visual.max) && Number(visual.max) > min ? Number(visual.max) : min + 10;
  return <View style={styles.numberLineBox}><View style={styles.numberLine}>{(visual.points ?? []).map((point, index) => <View key={`${point.value}-${index}`} style={[styles.numberLinePoint, { left: `${Math.max(0, Math.min(100, ((point.value - min) / (max - min)) * 100))}%` }]}><Text style={styles.numberLineDot} /><MathText style={styles.numberLinePointLabel}>{point.label || point.value}</MathText></View>)}</View><View style={styles.numberLineTicks}><MathText style={styles.numberLineTick}>{min}</MathText><MathText style={styles.numberLineTick}>{max}</MathText></View></View>;
}

function CoordinateGrid({ visual }: { visual: LessonVisualAid }) {
  return <View style={styles.gridBox}>{Array.from({ length: 5 }).map((_, index) => <View key={`h-${index}`} style={[styles.gridLineH, { top: `${index * 25}%` }]} />)}{Array.from({ length: 5 }).map((_, index) => <View key={`v-${index}`} style={[styles.gridLineV, { left: `${index * 25}%` }]} />)}{(visual.points ?? []).slice(0, 8).map((point, index) => <View key={`${point.x}-${point.y}-${index}`} style={[styles.gridPoint, { left: `${Math.max(0, Math.min(95, Number(point.x ?? point.value) * 10))}%`, bottom: `${Math.max(0, Math.min(95, Number(point.y ?? 0) * 10))}%` }]}><Text style={styles.gridPointDot} />{point.label ? <MathText style={styles.gridPointLabel}>{point.label}</MathText> : null}</View>)}</View>;
}

function ShapeVisual({ visual }: { visual: LessonVisualAid }) {
  const shape = (visual.shape || '').toLowerCase();
  const shapeStyle = shape.includes('circle') ? styles.shapeCircle : shape.includes('triangle') ? styles.shapeTriangle : shape.includes('square') ? styles.shapeSquare : styles.shapeRectangle;
  return <View style={styles.shapeBox}><View style={[styles.shapeBase, shapeStyle]} /><LabelList labels={visualItems(visual)} /></View>;
}

function FractionModel({ visual }: { visual: LessonVisualAid }) {
  const segments = Math.max(1, Math.min(12, Number(visual.segments) || 4));
  const shaded = Math.max(0, Math.min(segments, Number(visual.shadedSegments) || 0));
  return <View style={styles.fractionBar}>{Array.from({ length: segments }).map((_, index) => <View key={index} style={[styles.fractionSegment, index < shaded && styles.fractionSegmentShaded]} />)}</View>;
}

function Venn({ visual }: { visual: LessonVisualAid }) {
  return <View style={styles.vennBox}><View style={[styles.vennCircle, styles.vennLeft]} /><View style={[styles.vennCircle, styles.vennRight]} /><LabelList labels={visualItems(visual)} /></View>;
}

function Network({ visual }: { visual: LessonVisualAid }) {
  const center = visual.centralNode || visual.items?.[0] || 'Hub';
  const nodes = (visual.nodes?.length ? visual.nodes : visual.items?.slice(1) ?? visual.labels ?? []).filter(Boolean).slice(0, 4);
  const visibleNodes = nodes.length ? nodes : ['Device 1', 'Device 2', 'Device 3', 'Device 4'];
  return <View style={styles.networkBox}><View style={[styles.networkLine, styles.networkLineTop]} /><View style={[styles.networkLine, styles.networkLineRight]} /><View style={[styles.networkLine, styles.networkLineBottom]} /><View style={[styles.networkLine, styles.networkLineLeft]} /><View style={styles.networkCenter}><MathText style={styles.networkCenterText}>{center}</MathText></View>{visibleNodes.map((node, index) => <View key={`${node}-${index}`} style={[styles.networkNode, networkNodeStyle(index)]}><MathText style={styles.networkNodeText}>{node}</MathText></View>)}</View>;
}

function Circuit({ visual }: { visual: LessonVisualAid }) {
  const labels = visualItems(visual, 4).length ? visualItems(visual, 4) : ['Cell', 'Switch', 'Lamp', 'Wire'];
  return <View style={styles.circuitBox}><View style={styles.circuitWireTop} /><View style={styles.circuitWireRight} /><View style={styles.circuitWireBottom} /><View style={styles.circuitWireLeft} />{labels.map((label, index) => <View key={`${label}-${index}`} style={[styles.circuitComponent, circuitComponentStyle(index)]}><MathText style={styles.circuitText}>{label}</MathText></View>)}</View>;
}

function Steps({ visual }: { visual: LessonVisualAid }) {
  return <View style={styles.stepList}>{visualItems(visual).map((item, index) => <View key={`${item}-${index}`} style={styles.stepItem}><Text style={styles.stepIndex}>{index + 1}</Text><MathText style={styles.stepText}>{item}</MathText></View>)}</View>;
}

function Classification({ visual }: { visual: LessonVisualAid }) {
  const groups = visual.groups?.length ? visual.groups : visualItems(visual, 4).map((item) => ({ label: item, items: [] }));
  return <View style={styles.classificationGrid}>{groups.slice(0, 4).map((group, index) => <View key={`${group.label}-${index}`} style={styles.classificationCard}><MathText style={styles.classificationTitle}>{group.label}</MathText>{group.items.slice(0, 4).map((item, itemIndex) => <MathText key={`${item}-${itemIndex}`} style={styles.classificationItem}>{item}</MathText>)}</View>)}</View>;
}

function LabelList({ labels }: { labels: string[] }) {
  return <View style={styles.labelWrap}>{labels.map((label, index) => <MathText key={`${label}-${index}`} style={styles.labelPill}>{label}</MathText>)}</View>;
}

function visualItems(visual: LessonVisualAid, limit = 6) {
  return (visual.steps?.length ? visual.steps : visual.items?.length ? visual.items : visual.labels ?? []).filter(Boolean).slice(0, limit);
}

function isTableVisual(visual: LessonVisualAid) {
  return Boolean(visual.rows?.length || visual.cells?.length || ['comparison_table', 'frequency_table', 'tally_table', 'place_value_table', 'observation_table', 'algorithm_trace_table', 'data_table'].includes(visual.type));
}

function circuitComponentStyle(index: number) {
  return [styles.circuitTop, styles.circuitRight, styles.circuitBottom, styles.circuitLeft][index] ?? styles.circuitTop;
}

function networkNodeStyle(index: number) {
  return [styles.networkTop, styles.networkRight, styles.networkBottom, styles.networkLeft][index] ?? styles.networkTop;
}

function confirmRemoval(title: string, message: string): Promise<boolean> {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return Promise.resolve(window.confirm(message));
  }

  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
      { text: 'Delete', style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing[6], gap: spacing[5], paddingBottom: spacing[10] },
  emptyScreen: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
  },
  titleBlock: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing[6],
  },
  title: { ...typography.h2, color: colors.text, textTransform: 'uppercase' },
  meta: { ...typography.bodySm, color: colors.primary, marginTop: spacing[2], fontWeight: '700' },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing[5],
    gap: spacing[3],
  },
  cardTitle: { ...typography.h4, color: colors.primaryDark },
  bodyText: { ...typography.bodySm, color: colors.text, lineHeight: 21 },
  questionBlock: { gap: spacing[2] },
  guideText: { ...typography.caption, color: colors.textMuted, lineHeight: 18, marginLeft: spacing[4] },
  answerItem: { gap: spacing[1] },
  muted: { ...typography.body, color: colors.textMuted },
  visual: { borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, padding: spacing[3], backgroundColor: colors.tableRowAlt, gap: spacing[2] },
  visualTitle: { ...typography.label, color: colors.primaryDark },
  caption: { ...typography.caption, color: colors.textMuted, lineHeight: 18 },
  labelWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  labelPill: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, color: colors.primary, fontWeight: '700' },
  chart: { gap: 7 },
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
  tableVisual: { borderWidth: 1, borderColor: colors.border, borderRadius: 6, overflow: 'hidden', backgroundColor: '#fff' },
  tableRow: { flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  tableHead: { backgroundColor: colors.tableHeader },
  tableHeadCell: { flex: 1, padding: 7, color: colors.tableHeaderText, fontWeight: '800', borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.border },
  tableCell: { flex: 1, padding: 7, color: colors.text, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.border },
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
  stepList: { gap: 6 },
  stepItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 7 },
  stepIndex: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, color: '#fff', textAlign: 'center', fontSize: 11, fontWeight: '800', lineHeight: 20 },
  stepText: { flex: 1, color: colors.text, lineHeight: 18 },
  classificationGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  classificationCard: { width: '48%', minHeight: 68, borderWidth: 1, borderColor: colors.border, borderRadius: 6, backgroundColor: '#fff', padding: 7 },
  classificationTitle: { fontSize: 12, fontWeight: '800', color: colors.primary, marginBottom: 4 },
  classificationItem: { fontSize: 11, color: colors.text, lineHeight: 15 },
});
