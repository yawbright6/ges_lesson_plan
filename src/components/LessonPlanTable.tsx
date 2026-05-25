import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MathText } from '@/components/MathText';
import { formatMathText } from '@/lib/mathText';
import { colors } from '@/theme/colors';
import type { LessonPlan, LessonPhase, LessonVisualAid, LocalLanguageSupport } from '@/types/lessonPlan';

interface Props {
  plan: LessonPlan;
}

interface StackProps {
  plans: LessonPlan[];
}

/**
 * Renders a LessonPlan in the EXACT layout of the official Ghanaian
 * NaCCA/GES lesson plan template (verified against B7 Science Term 2 plans).
 *
 * Layout order:
 *   1. Title block  (TERM LESSON PLAN / SUBJECT – CLASS / WEEK N)
 *   2. Header info  (Date | Period | Subject · Duration | Strand · Class | Size | SubStrand)
 *   3. Curriculum   (Content Standard | Indicator | Lesson No  ·  Perf. Indicator | Competencies)
 *   4. References
 *   5. Phase table  (Phase/Duration · Learners Activities · Resources)
 *      └─ Assessment block embedded inside Phase 2
 */
export function LessonPlanTable({ plan }: Props) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <LessonPlanContent plan={plan} />
    </ScrollView>
  );
}

export function LessonPlanStack({ plans }: StackProps) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {plans.map((plan, index) => (
        <View key={plan.id ?? `${plan.week}-${plan.lessonNumber}-${index}`} style={index > 0 && styles.lessonDivider}>
          <LessonPlanContent plan={plan} />
        </View>
      ))}
    </ScrollView>
  );
}

function LessonPlanContent({ plan }: Props) {
  const title = buildLessonTitle(plan);

  return (
    <View>
      {/* ── 1. Title block ────────────────────────────────── */}
      <View style={styles.titleBlock}>
        <Text style={styles.titleMain}>{(plan.termTitle || '').toUpperCase()}</Text>
        <Text style={styles.titleSub}>{title.toUpperCase()}</Text>
      </View>
      {plan.translationLanguage ? (
        <View style={styles.translationNotice}>
          <Text style={styles.translationNoticeTitle}>{plan.translationLanguage} translation draft</Text>
          <Text style={styles.translationNoticeText}>
            NLLB machine translation. Teacher should review before classroom use.
          </Text>
        </View>
      ) : null}

      {/* ── 2. Header info table ─────────────────────────── */}
      <View style={styles.table}>
        {/* Row 1: Week ending | Period | Subject */}
        <View style={styles.infoRow}>
          <InfoCell label="Week ending" value={plan.date} flex={1.2} />
          <InfoCell label="Period" value={plan.period} flex={0.8} />
          <InfoCell label="Subject" value={plan.subject} flex={1} last />
        </View>
        {/* Row 2: Duration | Strand */}
        <View style={[styles.infoRow, styles.infoRowAlt]}>
          <InfoCell label="Duration" value={plan.duration} flex={1.2} />
          <InfoCell label="Strand" value={plan.strand} flex={1.8} last />
        </View>
        {/* Row 3: Class | Class Size | Sub Strand */}
        <View style={styles.infoRow}>
          <InfoCell label="Class" value={plan.classLevel} flex={1.2} />
          <InfoCell label="Class Size" value={plan.classSize} flex={0.8} />
          <InfoCell label="Sub Strand" value={plan.subStrand} flex={1} last />
        </View>
        <View style={[styles.infoRow, styles.infoRowAlt]}>
          <InfoCell label="Topic" value={plan.topic} flex={1.5} />
          <InfoCell
            label="Lesson in Week"
            value={
              plan.lessonNumber ||
              (plan.sessionIndex && plan.sessionsPerWeek
                ? `${plan.sessionIndex} of ${plan.sessionsPerWeek}`
                : '')
            }
            flex={0.8}
            last
          />
        </View>
      </View>

      {/* ── 3. Curriculum block ───────────────────────────── */}
      <View style={[styles.table, styles.mt8]}>
        {/* Content Standard | Indicator | Lesson */}
        <View style={styles.infoRow}>
          <View style={[styles.cellWrap, { flex: 1.5 }]}>
            <InlineCellText label="Content Standard:" value={plan.contentStandard} />
          </View>
          <View style={[styles.cellWrap, { flex: 1.3 }]}>
            <InlineCellText label="Indicator:" value={plan.indicator} />
          </View>
          <View style={[styles.cellWrap, { flex: 0.5 }, styles.lastCell]}>
            <InlineCellText label="Lesson:" value={plan.lessonNumber} />
          </View>
        </View>
        {/* Performance Indicator | Core Competencies */}
        <View style={[styles.infoRow, styles.infoRowAlt]}>
          <View style={[styles.cellWrap, { flex: 1.5 }]}>
            <InlineCellText label="Performance Indicator:" value={plan.performanceIndicator} />
          </View>
          <View style={[styles.cellWrap, { flex: 1.8 }, styles.lastCell]}>
            <InlineCellText label="Core Competencies:" value={plan.coreCompetencies?.join(': ') ?? ''} />
          </View>
        </View>
        {/* References */}
        {plan.references ? (
          <View style={[styles.infoRow]}>
            <View style={[styles.cellWrap, { flex: 1 }, styles.lastCell]}>
              <InlineCellText label="References:" value={plan.references} />
            </View>
          </View>
        ) : null}
      </View>

      {/* ── 4. Phase table ────────────────────────────────── */}
      <View style={[styles.table, styles.mt8]}>
        {/* Column headers */}
        <View style={[styles.infoRow, { backgroundColor: colors.tableHeader }]}>
          <Text style={[styles.phaseHeaderCell, { flex: 0.45 }]}>Phase/Duration</Text>
          <Text style={[styles.phaseHeaderCell, { flex: 2.8 }]}>Learners Activities</Text>
          <Text style={[styles.phaseHeaderCell, { flex: 0.45 }, styles.lastCell]}>Resources</Text>
        </View>
        {plan.phases.map((phase, idx) => (
          <PhaseRow
            key={phase.phase}
            phase={phase}
            alt={idx % 2 === 1}
            visualAids={(plan.visualAids ?? []).filter((visualAid) => visualAid.phase === phase.phase)}
          />
        ))}
      </View>

      {plan.localLanguageSupport ? <LocalLanguageBlock support={plan.localLanguageSupport} /> : null}

      {hasTeacherDetails(plan) ? (
        <View style={[styles.teacherDetails, styles.mt8]}>
          {plan.teacherName ? <MathText style={styles.teacherText}>Teacher: {plan.teacherName}</MathText> : null}
          {plan.schoolName ? <MathText style={styles.teacherText}>School: {plan.schoolName}</MathText> : null}
          {plan.schoolDistrict ? (
            <MathText style={styles.teacherText}>District: {plan.schoolDistrict}</MathText>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function LocalLanguageBlock({ support }: { support: LocalLanguageSupport }) {
  const hasContent = Boolean(
    support.reviewNote ||
    support.vocabulary?.length ||
      support.classroomExpressions?.length ||
      support.activityPrompts?.length ||
      support.assessmentPrompts?.length,
  );
  if (!hasContent) return null;

  return (
    <View style={styles.localLanguageBlock}>
      <Text style={styles.visualLabel}>Local Language Support</Text>
      <MathText style={styles.visualTitle}>{support.language}</MathText>
      <MathText style={styles.localReview}>
        {support.reviewNote || 'AI-assisted draft. Teacher should review before classroom use.'}
      </MathText>
      <TranslationGroup title="Key Vocabulary" items={support.vocabulary} showPronunciation />
      <TranslationGroup title="Classroom Expressions" items={support.classroomExpressions} />
      <TranslationGroup title="Activity Prompts" items={support.activityPrompts} />
      <TranslationGroup title="Assessment Prompts" items={support.assessmentPrompts} />
    </View>
  );
}

function TranslationGroup({
  title,
  items,
  showPronunciation,
}: {
  title: string;
  items?: { english: string; local: string; pronunciation?: string }[];
  showPronunciation?: boolean;
}) {
  if (!items?.length) return null;
  return (
    <View style={styles.translationGroup}>
      <Text style={styles.translationGroupTitle}>{title}</Text>
      {items.map((item, index) => (
        <View key={`${title}-${item.english}-${index}`} style={styles.translationRow}>
          <MathText style={styles.translationEnglish}>{item.english}</MathText>
          <View style={styles.translationLocalWrap}>
            <MathText style={styles.translationLocal}>{item.local}</MathText>
            {showPronunciation && item.pronunciation ? (
              <MathText style={styles.translationPronunciation}>{item.pronunciation}</MathText>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  );
}

function VisualAidBlock({ visualAid }: { visualAid: LessonVisualAid }) {
  return (
    <View style={styles.visualBlock}>
      <Text style={styles.visualLabel}>Visual Aid{visualAid.phase ? ` - Phase ${visualAid.phase}` : ''}</Text>
      <MathText style={styles.visualTitle}>{visualAid.title}</MathText>
      {visualAid.purpose ? <MathText style={styles.visualPurpose}>{visualAid.purpose}</MathText> : null}
      {visualAid.activityLink ? <MathText style={styles.visualActivity}>{visualAid.activityLink}</MathText> : null}
      <VisualAidFigure visualAid={visualAid} />
      {visualAid.caption ? <MathText style={styles.visualCaption}>{visualAid.caption}</MathText> : null}
    </View>
  );
}

function VisualAidFigure({ visualAid }: { visualAid: LessonVisualAid }) {
  if (visualAid.imageUrl) {
    return (
      <View style={styles.generatedImageBox}>
        <Image source={{ uri: visualAid.imageUrl }} style={styles.generatedImage} resizeMode="contain" />
      </View>
    );
  }

  if (visualAid.status === 'failed') {
    return <MathText style={styles.visualError}>{visualAid.error || 'Diagram could not be generated.'}</MathText>;
  }

  if (visualAid.type === 'bar_chart' && visualAid.data?.length) {
    const maxValue = Math.max(...visualAid.data.map((item) => item.value), 1);
    return (
      <View style={styles.chart}>
        {visualAid.data.slice(0, 5).map((item, index) => (
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

  if (visualAid.type === 'line_graph' && visualAid.data?.length) {
    const maxValue = Math.max(...visualAid.data.map((item) => item.value), 1);
    return (
      <View style={styles.lineGraph}>
        {visualAid.data.slice(0, 6).map((item, index) => (
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

  if (visualAid.type === 'timeline' && visualAid.steps?.length) {
    return (
      <View style={styles.stepList}>
        {visualAid.steps.slice(0, 6).map((step, index) => (
          <View key={`${step}-${index}`} style={styles.stepItem}>
            <Text style={styles.stepIndex}>{index + 1}</Text>
            <MathText style={styles.stepText}>{step}</MathText>
          </View>
        ))}
      </View>
    );
  }

  if (visualAid.type === 'comparison_table' && visualAid.rows?.length) {
    return (
      <View style={styles.visualTable}>
        {visualAid.rows.slice(0, 5).map((row, index) => (
          <View key={`${row.label}-${index}`} style={[styles.visualTableRow, index % 2 === 1 && styles.infoRowAlt]}>
            <MathText style={styles.visualTableLabel}>{row.label}</MathText>
            <MathText style={styles.visualTableValue}>{row.value}</MathText>
          </View>
        ))}
      </View>
    );
  }

  if (isMatrixTableVisual(visualAid) && (visualAid.cells?.length || visualAid.rows?.length)) {
    return <VisualMatrixTable visualAid={visualAid} />;
  }

  if (visualAid.type === 'number_line') {
    return <NumberLineVisual visualAid={visualAid} />;
  }

  if (visualAid.type === 'coordinate_grid') {
    return <CoordinateGridVisual visualAid={visualAid} />;
  }

  if (visualAid.type === 'geometry_shape' || visualAid.type === 'angle_diagram') {
    return <ShapeVisual visualAid={visualAid} />;
  }

  if (visualAid.type === 'fraction_model') {
    return <FractionModelVisual visualAid={visualAid} />;
  }

  if (visualAid.type === 'venn_diagram') {
    return <VennVisual visualAid={visualAid} />;
  }

  if (visualAid.type === 'cycle_diagram') return <CycleVisual visualAid={visualAid} />;
  if (visualAid.type === 'process_diagram' || visualAid.type === 'block_diagram' || visualAid.type === 'flowchart') {
    return <ProcessVisual visualAid={visualAid} />;
  }
  if (visualAid.type === 'classification_chart') return <ClassificationVisual visualAid={visualAid} />;
  if (visualAid.type === 'experiment_setup') return <ExperimentSetupVisual visualAid={visualAid} />;
  if (visualAid.type === 'circuit_diagram') return <CircuitVisual visualAid={visualAid} />;
  if (visualAid.type === 'network_diagram') return <NetworkVisual visualAid={visualAid} />;
  if (visualAid.type === 'interface_mockup') return <InterfaceMockupVisual visualAid={visualAid} />;
  if (visualAid.type === 'story_map') return <StoryMapVisual visualAid={visualAid} />;

  const labels = visualAid.labels?.length ? visualAid.labels : visualAid.steps;
  return (
    <View style={styles.labelGrid}>
      {labels?.slice(0, 6).map((label, index) => (
        <MathText key={`${label}-${index}`} style={styles.labelChip}>{label}</MathText>
      ))}
    </View>
  );
}

function VisualMatrixTable({ visualAid }: { visualAid: LessonVisualAid }) {
  const rows = visualAid.cells?.length
    ? visualAid.cells
    : visualAid.rows?.map((row) => [row.label, row.value]) ?? [];
  const columns = visualAid.columns?.length
    ? visualAid.columns
    : visualAid.rows?.length
      ? ['Item', 'Value']
      : [];

  return (
    <View style={styles.matrixTable}>
      {columns.length ? (
        <View style={[styles.matrixRow, styles.matrixHeader]}>
          {columns.map((column) => <MathText key={column} style={styles.matrixHeaderCell}>{column}</MathText>)}
        </View>
      ) : null}
      {rows.slice(0, 8).map((row, rowIndex) => (
        <View key={rowIndex} style={[styles.matrixRow, rowIndex % 2 === 1 && styles.infoRowAlt]}>
          {row.slice(0, 6).map((cell, cellIndex) => (
            <MathText key={`${rowIndex}-${cellIndex}`} style={styles.matrixCell}>{cell}</MathText>
          ))}
        </View>
      ))}
    </View>
  );
}

function NumberLineVisual({ visualAid }: { visualAid: LessonVisualAid }) {
  const min = Number.isFinite(visualAid.min) ? Number(visualAid.min) : 0;
  const max = Number.isFinite(visualAid.max) && Number(visualAid.max) > min ? Number(visualAid.max) : min + 10;
  const points = visualAid.points?.length ? visualAid.points : [];
  const ticks = Array.from({ length: 6 }, (_, index) => min + ((max - min) * index) / 5);

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
        {ticks.map((tick) => <MathText key={tick} style={styles.numberLineTick}>{Math.round(tick * 10) / 10}</MathText>)}
      </View>
    </View>
  );
}

function CoordinateGridVisual({ visualAid }: { visualAid: LessonVisualAid }) {
  return (
    <View style={styles.gridBox}>
      {Array.from({ length: 5 }).map((_, index) => <View key={`h-${index}`} style={[styles.gridLineH, { top: `${index * 25}%` }]} />)}
      {Array.from({ length: 5 }).map((_, index) => <View key={`v-${index}`} style={[styles.gridLineV, { left: `${index * 25}%` }]} />)}
      {(visualAid.points ?? []).slice(0, 8).map((point, index) => (
        <View
          key={`${point.x}-${point.y}-${index}`}
          style={[
            styles.gridPoint,
            {
              left: `${Math.max(0, Math.min(95, Number(point.x ?? point.value) * 10))}%`,
              bottom: `${Math.max(0, Math.min(95, Number(point.y ?? 0) * 10))}%`,
            },
          ]}
        >
          <Text style={styles.gridPointDot} />
          {point.label ? <MathText style={styles.gridPointLabel}>{point.label}</MathText> : null}
        </View>
      ))}
    </View>
  );
}

function ShapeVisual({ visualAid }: { visualAid: LessonVisualAid }) {
  const shape = (visualAid.shape || '').toLowerCase();
  const shapeStyle =
    shape.includes('circle') ? styles.shapeCircle :
      shape.includes('triangle') ? styles.shapeTriangle :
        shape.includes('square') ? styles.shapeSquare :
          styles.shapeRectangle;

  return (
    <View style={styles.shapeBox}>
      <View style={[styles.shapeBase, shapeStyle]} />
      <View style={styles.labelGrid}>
        {(visualAid.labels ?? visualAid.items ?? []).slice(0, 6).map((label, index) => (
          <MathText key={`${label}-${index}`} style={styles.labelChip}>{label}</MathText>
        ))}
      </View>
    </View>
  );
}

function FractionModelVisual({ visualAid }: { visualAid: LessonVisualAid }) {
  const segments = Math.max(1, Math.min(12, Number(visualAid.segments) || 4));
  const shaded = Math.max(0, Math.min(segments, Number(visualAid.shadedSegments) || 0));
  return (
    <View style={styles.fractionBar}>
      {Array.from({ length: segments }).map((_, index) => (
        <View key={index} style={[styles.fractionSegment, index < shaded && styles.fractionSegmentShaded]} />
      ))}
    </View>
  );
}

function VennVisual({ visualAid }: { visualAid: LessonVisualAid }) {
  return (
    <View style={styles.vennBox}>
      <View style={[styles.vennCircle, styles.vennLeft]} />
      <View style={[styles.vennCircle, styles.vennRight]} />
      <View style={styles.labelGrid}>
        {(visualAid.labels ?? visualAid.items ?? []).slice(0, 6).map((label, index) => (
          <MathText key={`${label}-${index}`} style={styles.labelChip}>{label}</MathText>
        ))}
      </View>
    </View>
  );
}

function visualItems(visualAid: LessonVisualAid, limit = 6) {
  return (visualAid.steps?.length ? visualAid.steps : visualAid.items?.length ? visualAid.items : visualAid.labels ?? [])
    .filter(Boolean)
    .slice(0, limit);
}

function ProcessVisual({ visualAid }: { visualAid: LessonVisualAid }) {
  const items = visualItems(visualAid, 6);
  return (
    <View style={styles.processFlow}>
      {items.map((item, index) => (
        <View key={`${item}-${index}`} style={styles.processPair}>
          <View style={styles.processNode}>
            <MathText style={styles.processText}>{item}</MathText>
          </View>
          {index < items.length - 1 ? <Text style={styles.processArrow}>{'>'}</Text> : null}
        </View>
      ))}
    </View>
  );
}

function CycleVisual({ visualAid }: { visualAid: LessonVisualAid }) {
  const items = visualItems(visualAid, 5);
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

function ClassificationVisual({ visualAid }: { visualAid: LessonVisualAid }) {
  const groups = visualAid.groups?.length
    ? visualAid.groups
    : visualItems(visualAid, 4).map((item) => ({ label: item, items: [] }));
  return (
    <View style={styles.classificationGrid}>
      {groups.slice(0, 4).map((group, index) => (
        <View key={`${group.label}-${index}`} style={styles.classificationCard}>
          <MathText style={styles.classificationTitle}>{group.label}</MathText>
          {(group.items ?? []).slice(0, 4).map((item, itemIndex) => (
            <MathText key={`${item}-${itemIndex}`} style={styles.classificationItem}>{item}</MathText>
          ))}
        </View>
      ))}
    </View>
  );
}

function ExperimentSetupVisual({ visualAid }: { visualAid: LessonVisualAid }) {
  const items = visualItems(visualAid, 5);
  return (
    <View style={styles.experimentBox}>
      <View style={styles.experimentBench} />
      <View style={styles.apparatusRow}>
        {items.map((item, index) => (
          <View key={`${item}-${index}`} style={styles.apparatusBlock}>
            <MathText style={styles.apparatusText}>{item}</MathText>
          </View>
        ))}
      </View>
    </View>
  );
}

function CircuitVisual({ visualAid }: { visualAid: LessonVisualAid }) {
  const items = visualItems(visualAid, 4);
  const labels = items.length ? items : ['Cell', 'Switch', 'Lamp', 'Wire'];
  return (
    <View style={styles.circuitBox}>
      <View style={styles.circuitWireTop} />
      <View style={styles.circuitWireRight} />
      <View style={styles.circuitWireBottom} />
      <View style={styles.circuitWireLeft} />
      {labels.slice(0, 4).map((label, index) => (
        <View key={`${label}-${index}`} style={[styles.circuitComponent, circuitComponentStyle(index)]}>
          <MathText style={styles.circuitText}>{label}</MathText>
        </View>
      ))}
    </View>
  );
}

function circuitComponentStyle(index: number) {
  return [styles.circuitTop, styles.circuitRight, styles.circuitBottom, styles.circuitLeft][index] ?? styles.circuitTop;
}

function NetworkVisual({ visualAid }: { visualAid: LessonVisualAid }) {
  const center = visualAid.centralNode || visualAid.items?.[0] || 'Hub';
  const nodes = (visualAid.nodes?.length ? visualAid.nodes : visualAid.items?.slice(1) ?? visualAid.labels ?? [])
    .filter(Boolean)
    .slice(0, 5);
  const visibleNodes = nodes.length ? nodes : ['Device 1', 'Device 2', 'Device 3', 'Device 4'];
  return (
    <View style={styles.networkBox}>
      <View style={[styles.networkLine, styles.networkLineTop]} />
      <View style={[styles.networkLine, styles.networkLineRight]} />
      <View style={[styles.networkLine, styles.networkLineBottom]} />
      <View style={[styles.networkLine, styles.networkLineLeft]} />
      <View style={styles.networkCenter}>
        <MathText style={styles.networkCenterText}>{center}</MathText>
      </View>
      {visibleNodes.slice(0, 4).map((node, index) => (
        <View key={`${node}-${index}`} style={[styles.networkNode, networkNodeStyle(index)]}>
          <MathText style={styles.networkNodeText}>{node}</MathText>
        </View>
      ))}
    </View>
  );
}

function networkNodeStyle(index: number) {
  return [styles.networkTop, styles.networkRight, styles.networkBottom, styles.networkLeft][index] ?? styles.networkTop;
}

function InterfaceMockupVisual({ visualAid }: { visualAid: LessonVisualAid }) {
  const items = visualItems(visualAid, 5);
  return (
    <View style={styles.interfaceBox}>
      <View style={styles.interfaceTitleBar}>
        <View style={styles.interfaceDot} />
        <MathText style={styles.interfaceTitle}>{visualAid.title}</MathText>
      </View>
      {items.map((item, index) => (
        <View key={`${item}-${index}`} style={styles.interfaceRow}>
          <View style={styles.interfaceIcon} />
          <MathText style={styles.interfaceText}>{item}</MathText>
        </View>
      ))}
    </View>
  );
}

function StoryMapVisual({ visualAid }: { visualAid: LessonVisualAid }) {
  const items = visualItems(visualAid, 5);
  return (
    <View style={styles.storyMap}>
      {items.map((item, index) => (
        <View key={`${item}-${index}`} style={styles.storyCard}>
          <Text style={styles.storyIndex}>{index + 1}</Text>
          <MathText style={styles.storyText}>{item}</MathText>
        </View>
      ))}
    </View>
  );
}

function isMatrixTableVisual(visualAid: LessonVisualAid) {
  return [
    'frequency_table',
    'tally_table',
    'place_value_table',
    'observation_table',
    'algorithm_trace_table',
    'data_table',
  ].includes(visualAid.type);
}

function InfoCell({
  label, value, flex, last,
}: { label: string; value?: string | number | null; flex: number; last?: boolean }) {
  return (
    <View style={[styles.cellWrap, { flex }, last && styles.lastCell]}>
      <InlineCellText label={label} value={value} />
    </View>
  );
}

function InlineCellText({ label, value }: { label: string; value?: string | number | null }) {
  const separator = label.trim().endsWith(':') ? ' ' : ': ';
  return (
      <Text style={styles.cellBody}>
        <Text style={styles.cellLabel}>{label}{separator}</Text>
        {formatMathText(value)}
      </Text>
  );
}

function PhaseRow({ phase, alt, visualAids }: { phase: LessonPhase; alt: boolean; visualAids: LessonVisualAid[] }) {
  const placements = placeVisualAidsWithActivities(phase.activities, visualAids);
  return (
    <View style={[styles.infoRow, alt && styles.infoRowAlt]}>
      {/* Phase / Duration column */}
      <View style={[styles.cellWrap, { flex: 0.45 }]}>
        <Text style={styles.phaseLabel}>PHASE {phase.phase}:</Text>
        <MathText style={styles.phaseTitle}>{phase.title}</MathText>
        {phase.duration ? (
          <MathText style={styles.phaseDuration}>{phase.duration}</MathText>
        ) : null}
      </View>

      {/* Learners Activities column */}
      <View style={[styles.cellWrap, { flex: 2.8 }]}>
        {phase.activities.map((act, i) => (
          <View key={`${i}-${act}`}>
            <MathText style={styles.activityText}>{act}</MathText>
            {placements.byActivity[i]?.map((visualAid, index) => (
              <VisualAidBlock key={visualAid.id ?? `${visualAid.title}-${index}`} visualAid={visualAid} />
            ))}
          </View>
        ))}
        {placements.unmatched.map((visualAid, index) => (
          <VisualAidBlock key={visualAid.id ?? `${visualAid.title}-${index}`} visualAid={visualAid} />
        ))}
        {/* Assessment embedded in Phase 2 */}
        {phase.assessment?.length ? (
          <View style={styles.assessmentBlock}>
            <Text style={styles.assessmentTitle}>Assessment</Text>
            {phase.assessment.map((q, i) => (
              <MathText key={i} style={styles.assessmentQ}>{`${i + 1}. ${q}`}</MathText>
            ))}
          </View>
        ) : null}
      </View>

      {/* Resources column */}
      <View style={[styles.cellWrap, { flex: 0.45 }, styles.lastCell]}>
        {phase.resources?.map((r, i) => (
          <MathText key={i} style={styles.resourceText}>{r}</MathText>
        ))}
      </View>
    </View>
  );
}

function placeVisualAidsWithActivities(activities: string[], visualAids: LessonVisualAid[]) {
  const byActivity: Record<number, LessonVisualAid[]> = {};
  const unmatched: LessonVisualAid[] = [];

  for (const visualAid of visualAids) {
    const index = findActivityIndex(activities, visualAid.activityLink);
    if (index >= 0) {
      byActivity[index] = [...(byActivity[index] ?? []), visualAid];
    } else {
      unmatched.push(visualAid);
    }
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
    if (!text) return;
    let score = 0;
    if (text === link) score = 100;
    else if (text.includes(link) || link.includes(text)) score = 80;
    else {
      const linkWords = link.split(' ').filter((word) => word.length > 3);
      const matches = linkWords.filter((word) => text.includes(word)).length;
      score = linkWords.length ? (matches / linkWords.length) * 60 : 0;
    }
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  return bestScore >= 35 ? bestIndex : -1;
}

function normalizeMatchText(value?: string) {
  return (value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 12, paddingBottom: 64 },
  lessonDivider: {
    marginTop: 24,
    paddingTop: 18,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },

  // Title block
  titleBlock: { alignItems: 'center', paddingVertical: 12, marginBottom: 8 },
  titleMain: { fontSize: 15, fontWeight: '800', color: colors.primaryDark, textAlign: 'center' },
  titleSub: { fontSize: 13, fontWeight: '700', color: colors.primaryDark, marginTop: 2, textAlign: 'center' },
  titleWeek: { fontSize: 13, fontWeight: '700', color: colors.primaryDark, marginTop: 2, textAlign: 'center' },

  // Generic table/row helpers
  table: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  mt8: { marginTop: 8 },
  infoRow: {
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
    minHeight: 32,
  },
  infoRowAlt: { backgroundColor: colors.tableRowAlt },

  // Cell
  cellWrap: {
    padding: 5,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.border,
    justifyContent: 'flex-start',
  },
  lastCell: { borderRightWidth: 0 },
  cellLabel: { fontSize: 10, fontWeight: '700', color: colors.primary },
  cellBody: { fontSize: 12, color: colors.text, lineHeight: 18 },

  // Phase table header
  phaseHeaderCell: {
    padding: 8,
    fontWeight: '700',
    fontSize: 11,
    color: colors.tableHeaderText,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: 'rgba(255,255,255,0.3)',
  },

  // Phase row left column
  phaseLabel: { fontSize: 10, fontWeight: '800', color: colors.primary },
  phaseTitle: { fontSize: 11, fontWeight: '600', color: colors.text, marginTop: 2 },
  phaseDuration: { fontSize: 10, color: colors.textMuted, marginTop: 3 },

  // Activities
  activityText: { fontSize: 12, color: colors.text, lineHeight: 18, marginBottom: 2 },

  // Assessment (embedded in Phase 2)
  assessmentBlock: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  assessmentTitle: { fontSize: 11, fontWeight: '700', color: colors.primary, marginBottom: 4 },
  assessmentQ: { fontSize: 12, color: colors.text, lineHeight: 18, marginBottom: 2 },

  // Resources
  resourceText: { fontSize: 12, color: colors.text, lineHeight: 16, marginBottom: 2 },
  visualBlock: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 8,
    backgroundColor: colors.surface,
  },
  localLanguageBlock: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 8,
    backgroundColor: colors.surface,
  },
  localReview: { fontSize: 11, color: colors.textMuted, lineHeight: 16, marginTop: 3 },
  translationGroup: { marginTop: 8 },
  translationGroupTitle: { fontSize: 11, fontWeight: '800', color: colors.primary, marginBottom: 4 },
  translationRow: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingVertical: 5,
    gap: 8,
  },
  translationEnglish: { flex: 1, fontSize: 11, color: colors.textMuted, lineHeight: 16 },
  translationLocalWrap: { flex: 1.1 },
  translationLocal: { fontSize: 12, color: colors.text, fontWeight: '700', lineHeight: 16 },
  translationPronunciation: { fontSize: 10, color: colors.textMuted, lineHeight: 14 },
  visualLabel: { fontSize: 10, fontWeight: '800', color: colors.primary, textTransform: 'uppercase' },
  visualTitle: { fontSize: 13, fontWeight: '800', color: colors.text, marginTop: 2 },
  visualPurpose: { fontSize: 12, color: colors.text, lineHeight: 17, marginTop: 3 },
  visualActivity: { fontSize: 11, color: colors.textMuted, lineHeight: 16, marginTop: 2 },
  visualCaption: { fontSize: 11, color: colors.textMuted, lineHeight: 16, marginTop: 5 },
  generatedImageBox: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  generatedImage: { width: '100%', height: 180 },
  visualError: { fontSize: 11, color: colors.danger, lineHeight: 16, marginTop: 8 },
  chart: { marginTop: 8, gap: 5 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  barLabel: { width: 76, fontSize: 11, color: colors.text },
  barTrack: { flex: 1, height: 10, backgroundColor: colors.tableRowAlt, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.primary },
  barValue: { width: 28, fontSize: 11, color: colors.textMuted, textAlign: 'right' },
  stepList: { marginTop: 8, gap: 5 },
  stepItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 7 },
  stepIndex: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    color: '#fff',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 18,
  },
  stepText: { flex: 1, fontSize: 12, color: colors.text, lineHeight: 17 },
  visualTable: { marginTop: 8, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border },
  visualTableRow: { flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  visualTableLabel: { flex: 0.8, padding: 5, fontSize: 11, fontWeight: '800', color: colors.primary },
  visualTableValue: { flex: 1.2, padding: 5, fontSize: 12, color: colors.text, lineHeight: 17 },
  labelGrid: { marginTop: 8, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  labelChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontSize: 11,
    color: colors.text,
    backgroundColor: colors.tableRowAlt,
  },
  lineGraph: {
    height: 112,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderStrong,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    paddingHorizontal: 8,
    paddingTop: 8,
    marginTop: 8,
    backgroundColor: '#fff',
  },
  linePointColumn: { flex: 1, height: '100%', alignItems: 'center' },
  linePointTrack: { flex: 1, width: '100%', position: 'relative' },
  linePoint: {
    position: 'absolute',
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.primary,
    alignSelf: 'center',
  },
  linePointLabel: { fontSize: 9, color: colors.textMuted, textAlign: 'center', minHeight: 18 },
  matrixTable: { marginTop: 8, borderWidth: 1, borderColor: colors.border, borderRadius: 6, overflow: 'hidden' },
  matrixRow: { flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  matrixHeader: { backgroundColor: colors.tableHeader },
  matrixHeaderCell: { flex: 1, padding: 6, color: colors.tableHeaderText, fontSize: 10, fontWeight: '800' },
  matrixCell: { flex: 1, padding: 6, color: colors.text, fontSize: 11, lineHeight: 16 },
  numberLineBox: { marginTop: 8, paddingTop: 20, paddingHorizontal: 8, backgroundColor: '#fff', borderRadius: 6 },
  numberLine: { height: 2, backgroundColor: colors.primary, position: 'relative' },
  numberLinePoint: { position: 'absolute', top: -16, alignItems: 'center', transform: [{ translateX: -8 }] },
  numberLineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },
  numberLinePointLabel: { fontSize: 9, color: colors.text, marginTop: 2 },
  numberLineTicks: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  numberLineTick: { fontSize: 9, color: colors.textMuted },
  gridBox: { height: 140, marginTop: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, position: 'relative' },
  gridLineH: { position: 'absolute', left: 0, right: 0, height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  gridLineV: { position: 'absolute', top: 0, bottom: 0, width: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  gridPoint: { position: 'absolute', alignItems: 'center' },
  gridPointDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  gridPointLabel: { fontSize: 9, color: colors.text },
  shapeBox: { marginTop: 8, alignItems: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 6, padding: 10 },
  shapeBase: { borderWidth: 2, borderColor: colors.primary, backgroundColor: colors.primarySoft },
  shapeCircle: { width: 80, height: 80, borderRadius: 40 },
  shapeRectangle: { width: 112, height: 64, borderRadius: 4 },
  shapeSquare: { width: 78, height: 78, borderRadius: 4 },
  shapeTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 44,
    borderRightWidth: 44,
    borderBottomWidth: 78,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.primarySoft,
    backgroundColor: 'transparent',
  },
  fractionBar: { marginTop: 8, flexDirection: 'row', borderWidth: 1, borderColor: colors.primary, minHeight: 34 },
  fractionSegment: { flex: 1, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.primary, backgroundColor: '#fff' },
  fractionSegmentShaded: { backgroundColor: colors.primarySoft },
  vennBox: { marginTop: 8, minHeight: 130, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 6, paddingBottom: 8 },
  vennCircle: { position: 'absolute', top: 12, width: 86, height: 86, borderRadius: 43, borderWidth: 2, borderColor: colors.primary, backgroundColor: 'rgba(15,76,58,0.08)' },
  vennLeft: { left: '24%' },
  vennRight: { right: '24%' },
  processFlow: { marginTop: 8, gap: 5 },
  processPair: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  processNode: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 7,
    backgroundColor: '#fff',
  },
  processText: { fontSize: 11, color: colors.text, lineHeight: 16 },
  processArrow: { width: 18, color: colors.primary, fontWeight: '900', textAlign: 'center' },
  cycleBox: { marginTop: 8, flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' },
  cycleNode: { maxWidth: 116, borderWidth: 1, borderColor: colors.primary, borderRadius: 32, paddingVertical: 7, paddingHorizontal: 9, backgroundColor: colors.primarySoft, flexDirection: 'row', alignItems: 'center', gap: 5 },
  cycleText: { fontSize: 10, color: colors.text, lineHeight: 14 },
  cycleArrow: { color: colors.primary, fontWeight: '900' },
  cycleReturn: { width: '100%', fontSize: 9, color: colors.textMuted, textAlign: 'center', marginTop: 2 },
  classificationGrid: { marginTop: 8, flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  classificationCard: { width: '48%', minHeight: 68, borderWidth: 1, borderColor: colors.border, borderRadius: 6, backgroundColor: '#fff', padding: 7 },
  classificationTitle: { fontSize: 11, fontWeight: '800', color: colors.primary, marginBottom: 4 },
  classificationItem: { fontSize: 10, color: colors.text, lineHeight: 14 },
  experimentBox: { marginTop: 8, minHeight: 108, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 6, padding: 8, justifyContent: 'flex-end' },
  experimentBench: { height: 5, backgroundColor: colors.borderStrong, borderRadius: 3, marginBottom: 8 },
  apparatusRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 6, flexWrap: 'wrap' },
  apparatusBlock: { minWidth: 54, minHeight: 36, borderWidth: 1, borderColor: colors.primary, borderRadius: 5, backgroundColor: colors.primarySoft, padding: 5, justifyContent: 'center' },
  apparatusText: { fontSize: 9, color: colors.text, textAlign: 'center', lineHeight: 12 },
  circuitBox: { marginTop: 8, height: 150, backgroundColor: '#fff', borderRadius: 6, position: 'relative' },
  circuitWireTop: { position: 'absolute', left: '23%', right: '23%', top: 32, height: 2, backgroundColor: colors.primary },
  circuitWireRight: { position: 'absolute', right: '20%', top: 32, bottom: 32, width: 2, backgroundColor: colors.primary },
  circuitWireBottom: { position: 'absolute', left: '23%', right: '23%', bottom: 32, height: 2, backgroundColor: colors.primary },
  circuitWireLeft: { position: 'absolute', left: '20%', top: 32, bottom: 32, width: 2, backgroundColor: colors.primary },
  circuitComponent: { position: 'absolute', minWidth: 56, maxWidth: 82, borderWidth: 1, borderColor: colors.primary, borderRadius: 6, backgroundColor: colors.primarySoft, padding: 5 },
  circuitText: { fontSize: 9, color: colors.text, textAlign: 'center' },
  circuitTop: { top: 16, left: '38%' },
  circuitRight: { right: 8, top: 62 },
  circuitBottom: { bottom: 16, left: '38%' },
  circuitLeft: { left: 8, top: 62 },
  networkBox: { marginTop: 8, height: 168, backgroundColor: '#fff', borderRadius: 6, position: 'relative' },
  networkLine: { position: 'absolute', backgroundColor: colors.borderStrong },
  networkLineTop: { left: '50%', top: 36, width: 2, height: 48 },
  networkLineRight: { right: '23%', top: 84, width: '27%', height: 2 },
  networkLineBottom: { left: '50%', bottom: 36, width: 2, height: 48 },
  networkLineLeft: { left: '23%', top: 84, width: '27%', height: 2 },
  networkCenter: { position: 'absolute', left: '38%', top: 62, width: '24%', minHeight: 44, borderRadius: 8, backgroundColor: colors.primary, padding: 6, justifyContent: 'center' },
  networkCenterText: { color: '#fff', fontWeight: '800', fontSize: 10, textAlign: 'center' },
  networkNode: { position: 'absolute', width: '30%', minHeight: 34, borderWidth: 1, borderColor: colors.border, borderRadius: 7, backgroundColor: colors.primarySoft, padding: 5, justifyContent: 'center' },
  networkNodeText: { fontSize: 9, color: colors.text, textAlign: 'center' },
  networkTop: { top: 8, left: '35%' },
  networkRight: { right: 2, top: 67 },
  networkBottom: { bottom: 8, left: '35%' },
  networkLeft: { left: 2, top: 67 },
  interfaceBox: { marginTop: 8, borderWidth: 1, borderColor: colors.border, borderRadius: 7, overflow: 'hidden', backgroundColor: '#fff' },
  interfaceTitleBar: { minHeight: 28, backgroundColor: colors.tableHeader, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8 },
  interfaceDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  interfaceTitle: { flex: 1, color: colors.tableHeaderText, fontSize: 10, fontWeight: '800' },
  interfaceRow: { flexDirection: 'row', alignItems: 'center', gap: 7, padding: 7, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border },
  interfaceIcon: { width: 18, height: 18, borderRadius: 4, backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: colors.border },
  interfaceText: { flex: 1, fontSize: 11, color: colors.text, lineHeight: 15 },
  storyMap: { marginTop: 8, gap: 6 },
  storyCard: { borderLeftWidth: 3, borderLeftColor: colors.primary, backgroundColor: '#fff', borderRadius: 6, padding: 7, flexDirection: 'row', gap: 7, alignItems: 'flex-start' },
  storyIndex: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.primary, color: '#fff', textAlign: 'center', fontSize: 10, fontWeight: '800', lineHeight: 18 },
  storyText: { flex: 1, fontSize: 11, color: colors.text, lineHeight: 16 },
  teacherDetails: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    padding: 8,
    backgroundColor: colors.surface,
    gap: 3,
  },
  teacherText: { fontSize: 13, color: colors.text, lineHeight: 18 },
  translationNotice: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 6,
    padding: 8,
    backgroundColor: colors.accentSoft,
    marginBottom: 8,
  },
  translationNoticeTitle: { fontSize: 12, color: colors.primaryDark, fontWeight: '800' },
  translationNoticeText: { fontSize: 11, color: colors.textMuted, lineHeight: 16, marginTop: 2 },
});

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

function hasTeacherDetails(plan: LessonPlan) {
  return Boolean(plan.teacherName || plan.schoolName || plan.schoolDistrict);
}
