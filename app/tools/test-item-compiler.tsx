import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Button } from '@/components/Button';
import { CreditUsagePreview } from '@/components/CreditUsagePreview';
import { Field } from '@/components/Field';
import { GenerationProgress } from '@/components/GenerationProgress';
import { MathText } from '@/components/MathText';
import { SelectField } from '@/components/SelectField';
import { useToast } from '@/components/ToastProvider';
import { formatAiActionError, isInsufficientCreditsError, rewriteTestItems } from '@/lib/ai';
import { loadRuntimeAppSettings } from '@/lib/appSettings';
import { loadCreditBalance } from '@/lib/credits';
import {
  exportCompiledTestItemsPdf,
  exportCompiledTestItemsWord,
  exportRewrittenTestPaperPdf,
  exportRewrittenTestPaperWord,
} from '@/lib/export';
import { loadLessonWorks } from '@/lib/lessonStore';
import { logAppError, reportClientError } from '@/lib/logger';
import { buildTestItemsHeading, buildTestItemsWeekLine } from '@/lib/testItemCompiler';
import { saveTestPaper } from '@/lib/testPaperStore';
import { generateTestPaperVisuals } from '@/lib/visuals';
import { colors, radii, shadows, spacing, typography } from '@/theme/colors';
import type { ClassLevel, LessonPlan, LessonPlanBundle, SavedLessonWork } from '@/types/lessonPlan';
import type { CompiledTestCompilation, CompiledTestItem, CompiledTestPaper, TestItemMode } from '@/types/testItemCompiler';

type SelectOption = { label: string; value: string };
type RewriteModeDraft = { mode: TestItemMode; enabled: boolean; count: string };
type AssessmentSourceFilter = 'both' | 'scheme' | 'quick';

const ASSESSMENT_SOURCE_OPTIONS: SelectOption[] = [
  { label: 'Both quick and organized scheme lessons', value: 'both' },
  { label: 'Organized scheme lesson plans', value: 'scheme' },
  { label: 'Quick lesson plans', value: 'quick' },
];

const REWRITE_MODE_LABELS: Record<TestItemMode, string> = {
  multiple_choice: 'Multiple choice',
  fill_in_blank: 'Fill in',
  essay: 'Essay type',
};

export default function TestItemCompilerScreen() {
  const { showToast } = useToast();
  const { width } = useWindowDimensions();
  const isWide = width >= 920;
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [subject, setSubject] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [termTitle, setTermTitle] = useState('');
  const [assessmentSource, setAssessmentSource] = useState<AssessmentSourceFilter>('both');
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
  const [removedItemIds, setRemovedItemIds] = useState<string[]>([]);
  const [rewrittenPaper, setRewrittenPaper] = useState<CompiledTestPaper | null>(null);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(false);
  const [creditBalance, setCreditBalance] = useState(0);
  const [rewriteCreditCost, setRewriteCreditCost] = useState(1);
  const [rewritePanelOpen, setRewritePanelOpen] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({
    lessons: false,
    exact: false,
    paper: false,
  });
  const [rewriteModes, setRewriteModes] = useState<RewriteModeDraft[]>([
    { mode: 'multiple_choice', enabled: true, count: '' },
    { mode: 'fill_in_blank', enabled: false, count: '' },
    { mode: 'essay', enabled: true, count: '' },
  ]);
  const [totalMarksInput, setTotalMarksInput] = useState('');
  const mounted = useRef(true);
  const rewriteAbortController = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      mounted.current = false;
      rewriteAbortController.current?.abort();
    };
  }, []);

  const refresh = useCallback(async () => {
    try {
      const [works, balance, settings] = await Promise.all([
        loadLessonWorks(),
        loadCreditBalance().catch(() => 0),
        loadRuntimeAppSettings(),
      ]);
      if (!mounted.current) return;
      const nextPlans = flattenLessonWorks(works);
      setPlans(nextPlans);
      setCreditBalance(balance);
      setRewriteCreditCost(settings.featureCreditCosts.test_item_rewrite);
      setLoadError('');
      setSubject((current) => current || optionValues(nextPlans.map((plan) => plan.subject))[0] || '');
      setClassLevel((current) => current || optionValues(nextPlans.map((plan) => plan.classLevel))[0] || '');
      setTermTitle((current) => current || optionValues(nextPlans.map((plan) => plan.termTitle || 'Untitled term'))[0] || '');
    } catch (err) {
      if (!mounted.current) return;
      const message = err instanceof Error ? err.message : 'Unable to load saved lesson plans.';
      setLoadError(message);
      showToast({ message, type: 'error' });
    }
  }, [showToast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const subjectOptions = useMemo(() => toOptions(plans.map((plan) => plan.subject)), [plans]);
  const classOptions = useMemo(
    () => toOptions(plans.filter((plan) => !subject || plan.subject === subject).map((plan) => plan.classLevel)),
    [plans, subject],
  );
  const termOptions = useMemo(
    () =>
      toOptions(
        plans
          .filter((plan) => (!subject || plan.subject === subject) && (!classLevel || plan.classLevel === classLevel))
          .map((plan) => plan.termTitle || 'Untitled term'),
      ),
    [plans, subject, classLevel],
  );

  useEffect(() => {
    if (subject && !subjectOptions.some((option) => option.value === subject)) {
      setSubject(subjectOptions[0]?.value ?? '');
    }
  }, [subject, subjectOptions]);

  useEffect(() => {
    if (classLevel && !classOptions.some((option) => option.value === classLevel)) {
      setClassLevel(classOptions[0]?.value ?? '');
    }
  }, [classLevel, classOptions]);

  useEffect(() => {
    if (termTitle && !termOptions.some((option) => option.value === termTitle)) {
      setTermTitle(termOptions[0]?.value ?? '');
    }
  }, [termTitle, termOptions]);

  const filteredPlans = useMemo(
    () =>
      plans
        .filter((plan) => (!subject || plan.subject === subject))
        .filter((plan) => (!classLevel || plan.classLevel === classLevel))
        .filter((plan) => (!termTitle || (plan.termTitle || 'Untitled term') === termTitle))
        .filter((plan) => assessmentSource === 'both' || getPlanAssessmentSource(plan) === assessmentSource)
        .sort(compareLessonPlans),
    [assessmentSource, plans, subject, classLevel, termTitle],
  );

  const selectedPlans = useMemo(() => {
    const selected = new Set(selectedLessonIds);
    return filteredPlans.filter((plan) => plan.id && selected.has(plan.id));
  }, [filteredPlans, selectedLessonIds]);

  const compiledItems = useMemo(() => {
    const removed = new Set(removedItemIds);
    return selectedPlans
      .flatMap(extractAssessmentItems)
      .filter((item) => !removed.has(item.id))
      .sort(compareCompiledItems);
  }, [selectedPlans, removedItemIds]);

  const compilation = useMemo<CompiledTestCompilation>(() => {
    const title = buildTestItemsHeading({
      subject: subject || selectedPlans[0]?.subject || 'Subject',
      classLevel: classLevel || selectedPlans[0]?.classLevel || 'B7',
      termTitle,
    });
    return {
      id: `compiled-test-items-${Date.now()}`,
      title,
      subject: subject || selectedPlans[0]?.subject || 'Subject',
      classLevel: (classLevel || selectedPlans[0]?.classLevel || 'B7') as ClassLevel,
      termTitle,
      items: compiledItems,
      createdAt: new Date().toISOString(),
    };
  }, [classLevel, compiledItems, selectedPlans, subject, termTitle]);

  function toggleLesson(plan: LessonPlan) {
    if (!plan.id || !hasAssessmentItems(plan)) return;
    const planId = plan.id;
    setRewrittenPaper(null);
    setSelectedLessonIds((current) =>
      current.includes(planId)
        ? current.filter((id) => id !== planId)
        : [...current, planId],
    );
    setCollapsedSections((current) => ({ ...current, exact: false }));
  }

  function selectAllWithItems() {
    setRewrittenPaper(null);
    setSelectedLessonIds(filteredPlans.filter(hasAssessmentItems).map((plan) => plan.id).filter(Boolean) as string[]);
    setCollapsedSections((current) => ({ ...current, lessons: true, exact: false }));
  }

  function removeItem(id: string) {
    setRewrittenPaper(null);
    setRemovedItemIds((current) => (current.includes(id) ? current : [...current, id]));
  }

  async function handleRewrite() {
    if (!compiledItems.length) {
      Alert.alert('No test items', 'Add at least one lesson with assessment items before rewriting.');
      return;
    }

    const controller = new AbortController();
    rewriteAbortController.current?.abort();
    rewriteAbortController.current = controller;
    setLoading(true);

    try {
      const settings = await loadRuntimeAppSettings();
      const paper = await rewriteTestItems(
        {
          title: compilation.title.replace(/TEST ITEMS/i, 'TEST PAPER'),
          subject: compilation.subject,
          classLevel: compilation.classLevel,
          termTitle: compilation.termTitle,
          items: compiledItems,
          options: {
            modes: rewriteModes
              .filter((item) => item.enabled)
              .map((item) => ({
                mode: item.mode,
                enabled: true,
                questionCount: Number(item.count) > 0 ? Number(item.count) : undefined,
              })),
            totalMarks: Number(totalMarksInput) > 0 ? Number(totalMarksInput) : undefined,
          },
        },
        { signal: controller.signal },
      );
      if (controller.signal.aborted || !mounted.current) return;
      const paperWithVisuals = settings.visualGeneration.enabled && settings.visualGeneration.autoGenerate
        ? await generateTestPaperVisuals(paper, { signal: controller.signal })
        : paper;
      if (controller.signal.aborted || !mounted.current) return;
      setRewrittenPaper(paperWithVisuals);
      setCollapsedSections((current) => ({ ...current, paper: false }));
      if (typeof paperWithVisuals.creditBalance === 'number') {
        setCreditBalance(paperWithVisuals.creditBalance);
      } else {
        loadCreditBalance().then((balance) => {
          if (!controller.signal.aborted && mounted.current) setCreditBalance(balance);
        }).catch(() => undefined);
      }
      showToast({ message: 'Test paper and answer key generated.' });
    } catch (err) {
      if (controller.signal.aborted || !mounted.current) return;
      const message = formatAiActionError(err);
      logAppError({
        source: 'client',
        action: 'rewrite_test_items',
        message,
        metadata: { subject: compilation.subject, classLevel: compilation.classLevel, itemCount: compiledItems.length },
      });
      showToast({ message, type: 'error' });
      if (isInsufficientCreditsError(err)) {
        Alert.alert('Not enough credits', message, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Get credits', onPress: () => router.push('/(tabs)/credits') },
        ]);
      } else {
        Alert.alert('Rewrite failed', message);
      }
    } finally {
      if (!controller.signal.aborted && mounted.current) setLoading(false);
      if (rewriteAbortController.current === controller) rewriteAbortController.current = null;
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>Test Item Compiler</Text>
        <Text style={styles.heading}>Compile assessment prompts into test items</Text>
        <Text style={styles.sub}>
          Filter saved lesson plans, add the lessons you need, then export the exact assessment prompts or rewrite them into a test paper.
        </Text>
      </View>

      {loadError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{loadError}</Text>
          <Button title="Retry" variant="secondary" onPress={refresh} style={styles.retryButton} />
        </View>
      ) : null}

      <View style={styles.filterPanel}>
        <View style={styles.filterGrid}>
          <View style={styles.filterCell}>
            <SelectField label="Subject" value={subject} options={subjectOptions} onChange={setSubject} placeholder="Select subject" />
          </View>
          <View style={styles.filterCell}>
            <SelectField label="Class" value={classLevel} options={classOptions} onChange={setClassLevel} placeholder="Select class" />
          </View>
          <View style={styles.filterCell}>
            <SelectField label="Term" value={termTitle} options={termOptions} onChange={setTermTitle} placeholder="Select term" />
          </View>
          <View style={styles.filterCellWide}>
            <SelectField
              label="Assessment source"
              value={assessmentSource}
              options={ASSESSMENT_SOURCE_OPTIONS}
              onChange={(value) => setAssessmentSource(value as AssessmentSourceFilter)}
            />
          </View>
        </View>
        <View style={styles.buttonRow}>
          <Button title="Add all with items" variant="secondary" icon="add-circle-outline" onPress={selectAllWithItems} style={styles.actionButton} />
        </View>
      </View>

      <View style={styles.workspace}>
        <View style={[styles.workspaceGrid, isWide && styles.workspaceGridWide]}>
        <AccordionSection
          title="Matching Lessons"
          meta={`${filteredPlans.length} lesson${filteredPlans.length === 1 ? '' : 's'} - ${selectedLessonIds.length} selected`}
          collapsed={collapsedSections.lessons}
          onToggle={() => setCollapsedSections((current) => ({ ...current, lessons: !current.lessons }))}
          panelStyle={isWide ? styles.workspaceColumn : undefined}
        >
          {filteredPlans.length ? (
            filteredPlans.map((plan) => {
              const selected = Boolean(plan.id && selectedLessonIds.includes(plan.id));
              const itemCount = extractAssessmentItems(plan).length;
              const disabled = itemCount === 0;
              return (
                <Pressable
                  key={plan.id ?? `${plan.subject}-${plan.classLevel}-${plan.week}-${plan.lessonNumber}`}
                  disabled={disabled}
                  style={({ pressed }) => [
                    styles.lessonRow,
                    selected && styles.lessonRowActive,
                    disabled && styles.lessonRowDisabled,
                    pressed && !disabled && styles.pressed,
                  ]}
                  onPress={() => toggleLesson(plan)}
                >
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={selected ? 'Remove lesson' : 'Add lesson'}
                    disabled={disabled}
                    onPress={() => toggleLesson(plan)}
                    style={[styles.iconButton, selected && styles.iconButtonActive, disabled && styles.iconButtonDisabled]}
                  >
                    <Ionicons name={selected ? 'remove' : 'add'} size={18} color={selected ? colors.textOnPrimary : colors.primary} />
                  </Pressable>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>Week {plan.week}{plan.lessonNumber ? ` - Lesson ${plan.lessonNumber}` : ''}</Text>
                    <MathText style={styles.cardSub}>{plan.topic || plan.strand || plan.subStrand || 'No topic'}</MathText>
                    <Text style={styles.cardMeta}>
                      {disabled ? 'No assessment items found' : `${itemCount} assessment item${itemCount === 1 ? '' : 's'}`}
                    </Text>
                  </View>
                </Pressable>
              );
            })
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No saved lesson plans match these filters.</Text>
            </View>
          )}
        </AccordionSection>

        <AccordionSection
          title={compilation.title}
          meta={`${compiledItems.length} item${compiledItems.length === 1 ? '' : 's'}${compiledItems.length ? ` - ${buildTestItemsWeekLine(compiledItems)}` : ''}`}
          collapsed={collapsedSections.exact}
          onToggle={() => setCollapsedSections((current) => ({ ...current, exact: !current.exact }))}
          panelStyle={isWide ? styles.workspaceColumn : undefined}
        >
          <View style={styles.sectionHeader}>
            <View style={{ flex: 1 }}>
              {compiledItems.length ? <Text style={styles.sectionMeta}>{buildTestItemsWeekLine(compiledItems)}</Text> : null}
            </View>
            <Text style={styles.sectionMeta}>{compiledItems.length} item{compiledItems.length === 1 ? '' : 's'}</Text>
          </View>

          {compiledItems.length ? (
            <>
              <View style={styles.compiledActions}>
                <Button title="Export exact PDF" icon="download-outline" onPress={() => exportCompiledTestItemsPdf(compilation)} style={styles.actionButton} />
                <Button title="Export exact Word" variant="secondary" icon="document-text-outline" onPress={() => exportCompiledTestItemsWord(compilation)} style={styles.actionButton} />
                <Button
                  title={rewritePanelOpen ? 'Hide AI rewrite' : 'AI rewrite'}
                  variant={rewritePanelOpen ? 'accent' : 'secondary'}
                  icon="sparkles-outline"
                  onPress={() => setRewritePanelOpen((current) => !current)}
                  disabled={loading}
                  style={styles.actionButton}
                />
              </View>
              {rewritePanelOpen ? (
                <>
                  <CreditUsagePreview
                    cost={rewriteCreditCost}
                    balance={creditBalance}
                    label={`AI rewrite uses ${rewriteCreditCost} ${rewriteCreditCost === 1 ? 'credit' : 'credits'}. Exact export is free.`}
                    onBuyCredits={() => router.push('/(tabs)/credits')}
                  />
                  <RewriteControls
                    modes={rewriteModes}
                    totalMarksInput={totalMarksInput}
                    loading={loading}
                    onToggleMode={(mode) =>
                      setRewriteModes((current) =>
                        current.map((item) =>
                          item.mode === mode ? { ...item, enabled: !item.enabled } : item,
                        ),
                      )
                    }
                    onChangeCount={(mode, count) =>
                      setRewriteModes((current) =>
                        current.map((item) =>
                          item.mode === mode ? { ...item, count: cleanWholeNumber(count) } : item,
                        ),
                      )
                    }
                    onChangeTotalMarks={(value) => setTotalMarksInput(cleanWholeNumber(value))}
                    onProceed={handleRewrite}
                  />
                  <GenerationProgress active={loading} label="Rewriting test items" estimateMs={65000} />
                </>
              ) : null}
              <CompiledBank items={compiledItems} onRemoveItem={removeItem} />
            </>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Add lessons with assessment items to compile a question bank.</Text>
            </View>
          )}
          </AccordionSection>
        </View>
        {rewrittenPaper ? (
          <AccordionSection
            title="AI Test Paper"
            meta={`${rewrittenPaper.totalMarks} marks`}
            collapsed={collapsedSections.paper}
            onToggle={() => setCollapsedSections((current) => ({ ...current, paper: !current.paper }))}
            panelStyle={styles.paperPanel}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionMeta}>{rewrittenPaper.totalMarks} marks</Text>
            </View>
            <View style={styles.compiledActions}>
              <Button
                title="Save to Library"
                icon="bookmark-outline"
                onPress={async () => {
                  try {
                    const saved = await saveTestPaper(rewrittenPaper);
                    setRewrittenPaper(saved);
                    showToast({ message: 'AI test paper saved to Library.' });
                  } catch (err) {
                    reportClientError('test_item_compiler_save_paper', err, {
                      subject: rewrittenPaper.subject,
                      classLevel: rewrittenPaper.classLevel,
                      title: rewrittenPaper.title,
                    });
                    Alert.alert('Save failed', err instanceof Error ? err.message : 'Could not save test paper.');
                  }
                }}
                style={styles.actionButton}
              />
              <Button title="Export PDF" icon="download-outline" onPress={() => exportRewrittenTestPaperPdf(rewrittenPaper)} style={styles.actionButton} />
              <Button title="Export Word" variant="secondary" icon="document-text-outline" onPress={() => exportRewrittenTestPaperWord(rewrittenPaper)} style={styles.actionButton} />
            </View>
            {rewrittenPaper.sections.map((section) => (
              <View key={section.id} style={styles.group}>
                <MathText style={styles.groupTitle}>{section.title}</MathText>
                {section.questions.map((question) => (
                  <View key={question.id} style={styles.questionBlock}>
                    <MathText style={styles.questionText}>
                      {question.id}. {question.text} [{question.marks}]
                    </MathText>
                    {question.subparts?.map((subpart, index) => (
                      <MathText key={`${question.id}-subpart-${index}`} style={styles.subpartText}>
                        ({subpart.label || String.fromCharCode(97 + index)}) {subpart.text}{subpart.marks ? ` [${subpart.marks}]` : ''}
                      </MathText>
                    ))}
                  </View>
                ))}
              </View>
            ))}
            <View style={styles.group}>
              <MathText style={styles.groupTitle}>Answer Key</MathText>
              {rewrittenPaper.answerKey.map((item) => (
                <MathText key={item.questionId} style={styles.questionText}>
                  {item.questionId}. {item.answer}
                </MathText>
              ))}
            </View>
          </AccordionSection>
        ) : null}
      </View>
    </ScrollView>
  );
}

function AccordionSection({
  title,
  meta,
  collapsed,
  onToggle,
  children,
  panelStyle,
}: {
  title: string;
  meta?: string;
  collapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  panelStyle?: object;
}) {
  return (
    <View style={[styles.workspacePane, panelStyle, collapsed && styles.workspacePaneCollapsed]}>
      <Pressable style={styles.accordionHeader} onPress={onToggle}>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {meta ? <Text style={styles.sectionMeta}>{meta}</Text> : null}
        </View>
        <Ionicons name={collapsed ? 'chevron-down' : 'chevron-up'} size={22} color={colors.primary} />
      </Pressable>
      {collapsed ? null : children}
    </View>
  );
}

function RewriteControls({
  modes,
  totalMarksInput,
  loading,
  onToggleMode,
  onChangeCount,
  onChangeTotalMarks,
  onProceed,
}: {
  modes: RewriteModeDraft[];
  totalMarksInput: string;
  loading: boolean;
  onToggleMode: (mode: TestItemMode) => void;
  onChangeCount: (mode: TestItemMode, count: string) => void;
  onChangeTotalMarks: (value: string) => void;
  onProceed: () => void;
}) {
  return (
    <View style={styles.rewritePanel}>
      <Text style={styles.groupTitle}>AI rewrite setup</Text>
      <Text style={styles.cardMeta}>
        Choose the question styles to include. Leave a count blank to let AI decide.
      </Text>
      <View style={styles.modeGrid}>
        {modes.map((item) => (
          <View key={item.mode} style={[styles.modeCard, item.enabled && styles.modeCardActive]}>
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: item.enabled }}
              onPress={() => onToggleMode(item.mode)}
              style={styles.modeToggle}
            >
              <Ionicons
                name={item.enabled ? 'checkbox' : 'square-outline'}
                size={20}
                color={item.enabled ? colors.primary : colors.textMuted}
              />
              <Text style={styles.modeLabel}>{REWRITE_MODE_LABELS[item.mode]}</Text>
            </Pressable>
            <Field
              label="Questions"
              value={item.count}
              onChangeText={(value) => onChangeCount(item.mode, value)}
              keyboardType="number-pad"
              placeholder="AI decides"
              editable={item.enabled}
            />
          </View>
        ))}
      </View>
      <Field
        label="Total marks"
        value={totalMarksInput}
        onChangeText={onChangeTotalMarks}
        keyboardType="number-pad"
        placeholder="AI decides"
        helperText="When set, AI will distribute marks across the selected question types."
      />
      <Button
        title="Generate AI test paper"
        icon="sparkles-outline"
        onPress={onProceed}
        loading={loading}
        disabled={!modes.some((mode) => mode.enabled)}
      />
    </View>
  );
}

function CompiledBank({ items, onRemoveItem }: { items: CompiledTestItem[]; onRemoveItem: (id: string) => void }) {
  return (
    <View style={styles.bankList}>
      {groupCompiledItems(items).map((group) => (
        <View key={group.key} style={styles.group}>
          <MathText style={styles.groupTitle}>{group.title}</MathText>
          {group.topic ? <MathText style={styles.cardMeta}>{group.topic}</MathText> : null}
          {group.items.map((item, index) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemNumber}>{index + 1}</Text>
              <View style={{ flex: 1 }}>
                <MathText style={styles.questionText}>{item.question}</MathText>
                <MathText style={styles.cardMeta}>{item.indicator || item.strand || item.subStrand || 'Source lesson item'}</MathText>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel="Remove question" onPress={() => onRemoveItem(item.id)} style={styles.smallIconButton}>
                <Ionicons name="close" size={16} color={colors.danger} />
              </Pressable>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

function cleanWholeNumber(value: string) {
  return value.replace(/[^0-9]/g, '').slice(0, 3);
}

function flattenLessonWorks(works: SavedLessonWork[]) {
  const byId = new Map<string, LessonPlan>();
  for (const work of works) {
    const plans = isLessonBundle(work) ? work.plans : [work];
    for (const plan of plans) {
      if (plan.sourceLessonPlanId || plan.translationLanguage) continue;
      const id = plan.id ?? `${plan.subject}-${plan.classLevel}-${plan.termTitle}-${plan.week}-${plan.lessonNumber}`;
      if (!byId.has(id)) byId.set(id, { ...plan, id });
    }
  }
  return [...byId.values()].sort(compareLessonPlans);
}

function extractAssessmentItems(plan: LessonPlan): CompiledTestItem[] {
  return plan.phases.filter((phase) => phase.phase === 2).flatMap((phase) =>
    (phase.assessment ?? [])
      .map((question) => question.trim())
      .filter(Boolean)
      .map((question, index) => ({
        id: `${plan.id ?? `${plan.subject}-${plan.classLevel}-${plan.week}`}:phase-${phase.phase}:assessment-${index}`,
        sourceLessonPlanId: plan.id,
        subject: plan.subject,
        classLevel: plan.classLevel,
        termTitle: plan.termTitle,
        week: plan.week,
        weekTitle: plan.weekTitle,
        lessonNumber: plan.lessonNumber,
        topic: plan.topic,
        strand: plan.strand,
        subStrand: plan.subStrand,
        indicator: plan.indicator,
        question,
      })),
  );
}

function hasAssessmentItems(plan: LessonPlan) {
  return extractAssessmentItems(plan).length > 0;
}

function getPlanAssessmentSource(plan: LessonPlan): Exclude<AssessmentSourceFilter, 'both'> {
  return plan.planningMode === 'quick' ? 'quick' : 'scheme';
}

function groupCompiledItems(items: CompiledTestItem[]) {
  const groups = new Map<string, { key: string; title: string; topic: string; items: CompiledTestItem[] }>();
  for (const item of items) {
    const key = `${item.week}:${item.lessonNumber ?? ''}`;
    const title = `Week ${item.week}${item.lessonNumber ? ` - Lesson ${item.lessonNumber}` : ''}`;
    const topic = [item.topic, item.strand].filter(Boolean).join(' | ');
    const group = groups.get(key);
    if (group) {
      group.items.push(item);
    } else {
      groups.set(key, { key, title, topic, items: [item] });
    }
  }
  return [...groups.values()];
}

function compareLessonPlans(a: LessonPlan, b: LessonPlan) {
  return (
    a.week - b.week ||
    parseLessonNumber(a.lessonNumber) - parseLessonNumber(b.lessonNumber) ||
    (a.topic ?? '').localeCompare(b.topic ?? '')
  );
}

function compareCompiledItems(a: CompiledTestItem, b: CompiledTestItem) {
  return (
    a.week - b.week ||
    parseLessonNumber(a.lessonNumber) - parseLessonNumber(b.lessonNumber) ||
    a.id.localeCompare(b.id)
  );
}

function parseLessonNumber(value?: string) {
  const match = value?.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function toOptions(values: string[]): SelectOption[] {
  return optionValues(values).map((value) => ({ label: value, value }));
}

function optionValues(values: Array<string | undefined>) {
  return [...new Set(values.map((value) => value?.trim()).filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b));
}

function isLessonBundle(work: SavedLessonWork): work is LessonPlanBundle {
  return (work as LessonPlanBundle).kind === 'bundle' && Array.isArray((work as LessonPlanBundle).plans);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing[7], paddingBottom: spacing[12], gap: spacing[5] },
  hero: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: spacing[7],
    paddingVertical: spacing[7],
    marginBottom: spacing[2],
    ...shadows.sm,
  },
  heroEyebrow: { ...typography.eyebrow, color: colors.primary, marginBottom: spacing[3] },
  heading: { ...typography.h1, color: colors.text, marginBottom: spacing[3] },
  sub: { ...typography.body, color: colors.textMuted },
  filterPanel: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[6],
    gap: spacing[4],
    ...shadows.sm,
  },
  filterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[5] },
  filterCell: { flex: 1, minWidth: 220 },
  filterCellWide: { flex: 1.4, minWidth: 280 },
  buttonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[4] },
  actionButton: { flex: 1, minWidth: 150 },
  workspace: { gap: spacing[5] },
  workspaceGrid: { gap: spacing[5] },
  workspaceGridWide: { flexDirection: 'row', alignItems: 'flex-start' },
  workspaceColumn: { flex: 1, minWidth: 0 },
  workspacePane: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[6],
    gap: spacing[4],
    ...shadows.sm,
  },
  workspacePaneCollapsed: {
    padding: spacing[4],
    gap: 0,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[4],
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[4] },
  sectionTitle: { ...typography.h3, color: colors.text },
  sectionMeta: { ...typography.label, color: colors.primary },
  lessonRow: {
    minHeight: 82,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing[5],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    backgroundColor: colors.bgElevated,
    marginTop: spacing[3],
  },
  lessonRowActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  lessonRowDisabled: { opacity: 0.55 },
  pressed: { opacity: 0.82 },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  iconButtonActive: { backgroundColor: colors.primary },
  iconButtonDisabled: { borderColor: colors.borderStrong },
  smallIconButton: {
    width: 30,
    height: 30,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dangerSoft,
  },
  cardTitle: { ...typography.h4, color: colors.text, marginBottom: spacing[1] },
  cardSub: { ...typography.bodySm, color: colors.textMuted },
  cardMeta: { ...typography.caption, color: colors.textMuted, marginTop: spacing[1] },
  compiledActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[4] },
  rewritePanel: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.md,
    padding: spacing[5],
    backgroundColor: colors.bgElevated,
    gap: spacing[4],
  },
  modeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[4] },
  modeCard: {
    flex: 1,
    minWidth: 160,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing[4],
    backgroundColor: colors.surface,
  },
  modeCardActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  modeToggle: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], marginBottom: spacing[3] },
  modeLabel: { ...typography.label, color: colors.text },
  bankList: { gap: spacing[4] },
  group: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.md,
    padding: spacing[5],
    backgroundColor: colors.bgElevated,
    gap: spacing[3],
  },
  groupTitle: { ...typography.h4, color: colors.primaryDark },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    paddingTop: spacing[4],
  },
  itemNumber: {
    width: 24,
    height: 24,
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '700',
  },
  questionText: { ...typography.bodySm, color: colors.text, lineHeight: 20 },
  questionBlock: { gap: spacing[2] },
  subpartText: { ...typography.caption, color: colors.textMuted, lineHeight: 18, marginLeft: spacing[4] },
  paperPanel: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.lg,
    padding: spacing[6],
    gap: spacing[4],
    backgroundColor: colors.primarySoft,
  },
  empty: {
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing[7],
    alignItems: 'center',
  },
  emptyText: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  errorBanner: {
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radii.md,
    padding: spacing[5],
    gap: spacing[3],
  },
  errorText: { ...typography.bodySm, color: colors.danger },
  retryButton: { alignSelf: 'flex-start', minHeight: 40 },
});

