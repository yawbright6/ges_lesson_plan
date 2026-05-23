import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { Field } from '@/components/Field';
import { Button } from '@/components/Button';
import { CreditUsagePreview } from '@/components/CreditUsagePreview';
import { GenerationProgress } from '@/components/GenerationProgress';
import { TeachingNotesView } from '@/components/TeachingNotesView';
import { useToast } from '@/components/ToastProvider';
import { formatAiActionError, generateTeachingNotes, isInsufficientCreditsError } from '@/lib/ai';
import { loadRuntimeAppSettings } from '@/lib/appSettings';
import { loadCreditBalance } from '@/lib/credits';
import { exportTeachingNotesPdf } from '@/lib/export';
import { loadLessonWorks } from '@/lib/lessonStore';
import { logAppError } from '@/lib/logger';
import {
  loadTeachingNotesForLesson,
  saveTeachingNotes,
} from '@/lib/teachingNotesStore';
import { colors, radii, shadows, spacing, typography } from '@/theme/colors';
import type { LessonPlan, LessonPlanBundle, SavedLessonWork } from '@/types/lessonPlan';
import type { TeachingNotes } from '@/types/teachingNotes';

export default function TeachingNotesToolScreen() {
  const { showToast } = useToast();
  const { lessonPlanId, lessonPlanIds } = useLocalSearchParams<{ lessonPlanId?: string; lessonPlanIds?: string }>();
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [query, setQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
  const [bulkPlans, setBulkPlans] = useState<LessonPlan[]>([]);
  const [bulkResults, setBulkResults] = useState<TeachingNotes[]>([]);
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [versions, setVersions] = useState<TeachingNotes[]>([]);
  const [activeNotes, setActiveNotes] = useState<TeachingNotes | null>(null);
  const [loading, setLoading] = useState(false);
  const [creditBalance, setCreditBalance] = useState(0);
  const [creditCost, setCreditCost] = useState(1);

  const refresh = useCallback(async () => {
    const [lessonWorks, balance, settings] = await Promise.all([
      loadLessonWorks(),
      loadCreditBalance().catch(() => 0),
      loadRuntimeAppSettings(),
    ]);
    setPlans(flattenLessonWorks(lessonWorks));
    setCreditBalance(balance);
    setCreditCost(settings.featureCreditCosts.teaching_notes_generation);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!lessonPlanId || !plans.length || selectedPlan) return;
    const match = plans.find((plan) => plan.id === lessonPlanId);
    if (match) {
      selectPlan(match);
    }
  }, [lessonPlanId, plans, selectedPlan]);

  useEffect(() => {
    if (!lessonPlanIds || !plans.length || bulkPlans.length) return;
    const idSet = new Set(
      lessonPlanIds
        .split(',')
        .map((id) => id.trim())
        .filter(Boolean),
    );
    const matches = plans.filter((plan) => plan.id && idSet.has(plan.id));
    if (matches.length) {
      setBulkPlans(matches);
      selectPlan(matches[0]);
    }
  }, [lessonPlanIds, plans, bulkPlans.length]);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh]),
  );

  const filteredPlans = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return plans;
    return plans.filter((plan) =>
      [
        plan.subject,
        plan.classLevel,
        plan.weekTitle,
        plan.termTitle,
        plan.lessonNumber,
        plan.topic,
        plan.strand,
        plan.subStrand,
        `week ${plan.week}`,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(term),
    );
  }, [plans, query]);

  async function selectPlan(plan: LessonPlan) {
    setSelectedPlan(plan);
    const planVersions = plan.id ? await loadTeachingNotesForLesson(plan.id) : [];
    setVersions(planVersions);
    setActiveNotes(null);
  }

  async function handleGenerate() {
    if (!selectedPlan) return;
    if (!selectedPlan.id) {
      Alert.alert('Save required', 'This lesson plan must be saved before teaching notes can be generated.');
      return;
    }

    setLoading(true);
    try {
      const generated = await generateTeachingNotes(selectedPlan);
      const saved = await saveTeachingNotes({
        ...generated,
        lessonPlanId: selectedPlan.id,
        sourceLessonPlan: {
          id: selectedPlan.id,
          subject: selectedPlan.subject,
          classLevel: selectedPlan.classLevel,
          week: selectedPlan.week,
          lessonNumber: selectedPlan.lessonNumber,
          topic: selectedPlan.topic,
          strand: selectedPlan.strand,
          subStrand: selectedPlan.subStrand,
        },
      });
      const planVersions = await loadTeachingNotesForLesson(selectedPlan.id);
      setVersions(planVersions);
      setActiveNotes(saved);
      loadCreditBalance().then(setCreditBalance).catch(() => undefined);
      showToast({ message: `Teaching notes version ${saved.versionNumber ?? 1} generated.` });
    } catch (err: unknown) {
      const message = formatAiActionError(err);
      logAppError({
        source: 'client',
        action: 'generate_teaching_notes',
        message,
        metadata: { lessonPlanId: selectedPlan.id, subject: selectedPlan.subject },
      });
      showToast({ message, type: 'error' });
      if (isInsufficientCreditsError(err)) {
        Alert.alert('Not enough credits', message, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Get credits', onPress: () => router.push('/(tabs)/credits') },
        ]);
      } else {
        Alert.alert('Generation failed', message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateBulk() {
    if (!bulkPlans.length) return;
    const missingSaved = bulkPlans.find((plan) => !plan.id);
    if (missingSaved) {
      Alert.alert('Save required', 'All lessons must be saved before bulk teaching notes can be generated.');
      return;
    }

    setBulkGenerating(true);
    setBulkProgress(0);
    setBulkResults([]);
    const generatedNotes: TeachingNotes[] = [];

    try {
      for (let index = 0; index < bulkPlans.length; index += 1) {
        const plan = bulkPlans[index];
        setSelectedPlan(plan);
        const generated = await generateTeachingNotes(plan);
        const saved = await saveTeachingNotes({
          ...generated,
          lessonPlanId: plan.id!,
          sourceLessonPlan: {
            id: plan.id,
            subject: plan.subject,
            classLevel: plan.classLevel,
            week: plan.week,
            lessonNumber: plan.lessonNumber,
            topic: plan.topic,
            strand: plan.strand,
            subStrand: plan.subStrand,
          },
        });
        generatedNotes.push(saved);
        setBulkResults([...generatedNotes]);
        setBulkProgress(index + 1);
      }

      const firstPlan = bulkPlans[0];
      if (firstPlan?.id) {
        const planVersions = await loadTeachingNotesForLesson(firstPlan.id);
        setVersions(planVersions);
        setActiveNotes(generatedNotes[0] ?? null);
      }
      loadCreditBalance().then(setCreditBalance).catch(() => undefined);
      showToast({ message: `Teaching notes generated for ${generatedNotes.length} lessons.` });
    } catch (err: unknown) {
      const message = formatAiActionError(err);
      logAppError({
        source: 'client',
        action: 'generate_bulk_teaching_notes',
        message,
        metadata: { lessonPlanIds: bulkPlans.map((plan) => plan.id), generated: generatedNotes.length },
      });
      showToast({ message, type: 'error' });
      if (isInsufficientCreditsError(err)) {
        Alert.alert('Not enough credits', message, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Get credits', onPress: () => router.push('/(tabs)/credits') },
        ]);
      } else {
        Alert.alert('Bulk generation stopped', `${message}\n\nGenerated ${generatedNotes.length} of ${bulkPlans.length} lesson notes.`);
      }
    } finally {
      setBulkGenerating(false);
    }
  }

  if (activeNotes) {
    return (
      <View style={styles.preview}>
        <View style={styles.previewActions}>
          <Button title="Back to lessons" variant="secondary" onPress={() => setActiveNotes(null)} style={styles.actionButton} />
          <Button title="PDF" onPress={() => exportTeachingNotesPdf(activeNotes)} style={styles.actionButton} />
          <Button title="Regenerate" variant="secondary" onPress={handleGenerate} disabled={loading} style={styles.actionButton} />
          <GenerationProgress active={loading} label="Regenerating teaching notes" estimateMs={85000} />
        </View>
        {versions.length > 1 ? (
          <ScrollView horizontal style={styles.versionStrip} contentContainerStyle={styles.versionStripContent}>
            {versions.map((item) => (
              <Pressable
                key={item.id}
                style={[styles.versionPill, item.id === activeNotes.id && styles.versionPillActive]}
                onPress={() => setActiveNotes(item)}
              >
                <Text style={[styles.versionText, item.id === activeNotes.id && styles.versionTextActive]}>
                  Version {item.versionNumber ?? 1}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        ) : null}
        <TeachingNotesView notes={activeNotes} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroEyebrow}>Teaching Notes</Text>
        <Text style={styles.heading}>Turn lesson plans into classroom notes</Text>
        <Text style={styles.sub}>
          Search a saved lesson plan, then generate detailed classroom-ready teaching notes from it.
        </Text>
      </View>

      <Field
        label="Search saved lesson plans"
        value={query}
        onChangeText={setQuery}
        placeholder="Search subject, class, week, topic, strand..."
        autoCapitalize="none"
      />

      {bulkPlans.length ? (
        <View style={styles.bulkCard}>
          <Text style={styles.selectedTitle}>Bulk lesson format</Text>
          <Text style={styles.cardTitle}>Generate teaching notes for all {bulkPlans.length} lessons</Text>
          <Text style={styles.cardSub}>
            {bulkPlans[0]?.subject} {bulkPlans[0]?.classLevel} - Week {bulkPlans[0]?.week}
          </Text>
          <View style={styles.bulkList}>
            {bulkPlans.map((plan, index) => (
              <Pressable key={plan.id ?? index} style={styles.bulkLessonRow} onPress={() => selectPlan(plan)}>
                <Text style={styles.bulkLessonTitle}>Lesson {plan.sessionIndex ?? index + 1}</Text>
                <Text style={styles.bulkLessonMeta} numberOfLines={1}>{plan.topic || plan.performanceIndicator || plan.lessonNumber}</Text>
              </Pressable>
            ))}
          </View>
          <CreditUsagePreview
            cost={bulkPlans.length * creditCost}
            balance={creditBalance}
            label={`Generating notes for all ${bulkPlans.length} lessons uses ${bulkPlans.length * creditCost} ${bulkPlans.length * creditCost === 1 ? 'credit' : 'credits'}.`}
            onBuyCredits={() => router.push('/(tabs)/credits')}
          />
          <View style={styles.buttonRow}>
            <Button
              title={bulkResults.length ? 'Generate all again' : 'Generate notes for all'}
              onPress={handleGenerateBulk}
              loading={bulkGenerating}
              disabled={bulkGenerating}
              style={styles.actionButton}
            />
            <Button title="Clear bulk" variant="secondary" onPress={() => setBulkPlans([])} disabled={bulkGenerating} style={styles.actionButton} />
          </View>
          <GenerationProgress
            active={bulkGenerating}
            label={`Generating lesson notes ${bulkProgress + 1 > bulkPlans.length ? bulkPlans.length : bulkProgress + 1} of ${bulkPlans.length}`}
            estimateMs={85000 * Math.max(1, bulkPlans.length - bulkProgress)}
          />
          {bulkResults.length ? (
            <Text style={styles.cardSub}>{bulkResults.length} of {bulkPlans.length} note sets saved.</Text>
          ) : null}
        </View>
      ) : null}

      {selectedPlan ? (
        <View style={styles.selectedCard}>
          <Text style={styles.selectedTitle}>Selected lesson</Text>
          <Text style={styles.cardTitle}>{lessonTitle(selectedPlan)}</Text>
          <Text style={styles.cardSub}>{selectedPlan.topic || selectedPlan.strand || selectedPlan.termTitle}</Text>
          {versions.length ? (
            <Text style={styles.cardSub}>{versions.length} saved note version{versions.length === 1 ? '' : 's'} found. Latest opens first.</Text>
          ) : null}
          <CreditUsagePreview
            cost={creditCost}
            balance={creditBalance}
            label={`Generating or regenerating teaching notes uses ${creditCost} ${creditCost === 1 ? 'credit' : 'credits'}.`}
            onBuyCredits={() => router.push('/(tabs)/credits')}
          />
          <View style={styles.buttonRow}>
            {versions[0] ? (
              <Button title="Open latest notes" variant="secondary" onPress={() => setActiveNotes(versions[0])} style={styles.actionButton} />
            ) : null}
            <Button title={versions.length ? 'Generate new version' : 'Generate teaching notes'} onPress={handleGenerate} disabled={loading} style={styles.actionButton} />
          </View>
          <GenerationProgress
            active={loading}
            label={versions.length ? 'Generating new teaching notes version' : 'Generating teaching notes'}
            estimateMs={85000}
          />
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>Saved Lesson Plans</Text>
      {filteredPlans.length ? (
        filteredPlans.map((plan) => (
          <Pressable key={plan.id ?? `${plan.subject}-${plan.week}`} style={styles.card} onPress={() => selectPlan(plan)}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{lessonTitle(plan)}</Text>
              <Text style={styles.cardSub}>{plan.topic || plan.strand || plan.termTitle}</Text>
            </View>
            <Button title="Select" variant="secondary" onPress={() => selectPlan(plan)} style={styles.selectButton} />
          </Pressable>
        ))
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No matching saved lesson plans found.</Text>
        </View>
      )}
    </ScrollView>
  );
}

function lessonTitle(plan: LessonPlan) {
  return `${plan.subject} - ${plan.classLevel} - Week ${plan.week}${plan.lessonNumber ? ` (${plan.lessonNumber})` : ''}`;
}

function flattenLessonWorks(works: SavedLessonWork[]): LessonPlan[] {
  return works.flatMap((work) => (isLessonBundle(work) ? work.plans : [work]));
}

function isLessonBundle(work: SavedLessonWork): work is LessonPlanBundle {
  return (work as LessonPlanBundle).kind === 'bundle' && Array.isArray((work as LessonPlanBundle).plans);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing[6], paddingBottom: spacing[12], gap: spacing[4] },
  hero: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    marginBottom: spacing[1],
    ...shadows.sm,
  },
  heroEyebrow: {
    ...typography.eyebrow,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing[1],
  },
  heading: { color: colors.text, fontSize: 20, lineHeight: 24, fontWeight: '700', marginBottom: spacing[1] },
  sub: { ...typography.bodySm, color: colors.textMuted, lineHeight: 18 },
  sectionTitle: { ...typography.h3, color: colors.text, marginTop: spacing[3] },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing[6],
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[5],
    ...shadows.sm,
  },
  selectedCard: {
    backgroundColor: colors.primarySoft,
    borderRadius: radii.lg,
    padding: spacing[7],
    borderWidth: 1,
    borderColor: colors.primary,
    gap: spacing[4],
    ...shadows.sm,
  },
  bulkCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.lg,
    padding: spacing[7],
    borderWidth: 1,
    borderColor: colors.primary,
    gap: spacing[4],
    ...shadows.sm,
  },
  bulkList: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  bulkLessonRow: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    gap: 2,
  },
  bulkLessonTitle: { ...typography.label, color: colors.text },
  bulkLessonMeta: { ...typography.bodySm, color: colors.textMuted },
  selectedTitle: {
    ...typography.eyebrow,
    color: colors.primaryDark,
  },
  cardTitle: { ...typography.h4, color: colors.text, marginBottom: spacing[1] },
  cardSub: { ...typography.bodySm, color: colors.textMuted },
  selectButton: { minHeight: 40, paddingHorizontal: spacing[5] },
  buttonRow: { flexDirection: 'row', gap: spacing[4], flexWrap: 'wrap' },
  actionButton: { flex: 1, minWidth: 140 },
  empty: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing[7],
    alignItems: 'center',
  },
  emptyText: { ...typography.body, color: colors.textMuted },
  preview: { flex: 1, backgroundColor: colors.bg },
  previewActions: {
    padding: spacing[5],
    gap: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  versionStrip: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  versionStripContent: { padding: spacing[4], gap: spacing[3] },
  versionPill: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    backgroundColor: colors.surface,
  },
  versionPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  versionText: { ...typography.label, color: colors.primary },
  versionTextActive: { color: colors.primaryOn },
});
