import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { PreviewIconButton } from '@/components/PreviewChrome';
import { getLessonPlanBundleById, saveLessonPlanWork } from '@/lib/lessonStore';
import { goBackOrReplace } from '@/lib/navigation';
import { colors, radii, spacing, typography } from '@/theme/colors';
import type { LessonPhase, LessonPlan, LessonPlanBundle } from '@/types/lessonPlan';

export default function WeekLessonEditScreen() {
  const { bundleId } = useLocalSearchParams<{ bundleId?: string }>();
  const [draft, setDraft] = useState<LessonPlanBundle | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!bundleId) return;
      const bundle = await getLessonPlanBundleById(bundleId);
      if (active) setDraft(bundle ? clone(bundle) : null);
    }
    load();
    return () => {
      active = false;
    };
  }, [bundleId]);

  if (!draft) {
    return (
      <View style={styles.emptyScreen}>
        <Button title="Week plan not found" variant="secondary" onPress={() => goBackOrReplace()} />
      </View>
    );
  }

  const updateBundle = (patch: Partial<LessonPlanBundle>) => setDraft((current) => current ? { ...current, ...patch } : current);
  const updatePlan = (planIndex: number, patch: Partial<LessonPlan>) =>
    updateBundle({
      plans: draft.plans.map((plan, index) => index === planIndex ? { ...plan, ...patch } : plan),
    });
  const updatePhase = (planIndex: number, phaseIndex: number, patch: Partial<LessonPhase>) => {
    const plan = draft.plans[planIndex];
    updatePlan(planIndex, {
      phases: plan.phases.map((phase, index) => index === phaseIndex ? { ...phase, ...patch } : phase),
    });
  };

  async function handleSave() {
    const current = draft;
    if (!current) return;
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const plans = current.plans.map((plan) => ({
        ...plan,
        subject: current.subject,
        classLevel: current.classLevel,
        termTitle: current.termTitle || plan.termTitle || 'Term',
        week: current.week,
        weekTitle: current.weekTitle || `WEEK ${current.week}`,
        subjectClassTitle: `${current.subject} - ${current.classLevel}`,
        editedAt: now,
        updatedAt: now,
      }));
      const saved = await saveLessonPlanWork({
        ...current,
        lessonCount: plans.length,
        plans,
        editedAt: now,
        updatedAt: now,
      });
      router.replace(`/lesson/week?bundleId=${encodeURIComponent(saved.id ?? bundleId ?? '')}`);
    } catch (err) {
      Alert.alert('Save failed', err instanceof Error ? err.message : 'Could not save week plan edits.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <PreviewIconButton icon="arrow-back" label="Back" onPress={() => goBackOrReplace()} />
        <Text style={styles.headerTitle}>Edit Week Plan</Text>
        <Button title="Save" size="small" icon="checkmark-outline" loading={saving} onPress={handleSave} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Week Details</Text>
          <Field label="Title" value={draft.title} onChangeText={(title) => updateBundle({ title })} />
          <Field label="Subject" value={draft.subject} onChangeText={(subject) => updateBundle({ subject })} />
          <Field label="Class" value={draft.classLevel} onChangeText={(classLevel) => updateBundle({ classLevel: classLevel as LessonPlanBundle['classLevel'] })} />
          <Field label="Term" value={draft.termTitle} onChangeText={(termTitle) => updateBundle({ termTitle })} />
          <Field label="Week" value={String(draft.week)} keyboardType="number-pad" onChangeText={(week) => updateBundle({ week: Number(week) || 1, weekTitle: `WEEK ${Number(week) || 1}` })} />
        </View>

        {draft.plans.map((plan, planIndex) => (
          <View key={plan.id ?? planIndex} style={styles.card}>
            <Text style={styles.cardTitle}>Lesson {plan.lessonNumber || planIndex + 1}</Text>
            <Field label="Lesson number" value={plan.lessonNumber ?? ''} onChangeText={(lessonNumber) => updatePlan(planIndex, { lessonNumber })} />
            <Field label="Topic" value={plan.topic ?? ''} onChangeText={(topic) => updatePlan(planIndex, { topic })} />
            <Field label="Strand" value={plan.strand ?? ''} onChangeText={(strand) => updatePlan(planIndex, { strand })} />
            <Field label="Sub-strand" value={plan.subStrand ?? ''} onChangeText={(subStrand) => updatePlan(planIndex, { subStrand })} />
            <Field label="Indicator" value={plan.indicator ?? ''} multiline onChangeText={(indicator) => updatePlan(planIndex, { indicator })} />
            <Field label="Performance indicator" value={plan.performanceIndicator ?? ''} multiline onChangeText={(performanceIndicator) => updatePlan(planIndex, { performanceIndicator })} />
            {plan.phases.map((phase, phaseIndex) => (
              <View key={`${planIndex}-${phase.phase}`} style={styles.phaseCard}>
                <Text style={styles.phaseTitle}>Phase {phase.phase}: {phase.title}</Text>
                <LineListEditor title="Activities" values={phase.activities} placeholder="Activity" onChange={(activities) => updatePhase(planIndex, phaseIndex, { activities })} />
                {phase.phase === 2 ? (
                  <LineListEditor title="Assessment questions" values={phase.assessment ?? []} placeholder="Question" onChange={(assessment) => updatePhase(planIndex, phaseIndex, { assessment })} />
                ) : null}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function LineListEditor({ title, values, placeholder, onChange }: { title: string; values: string[]; placeholder: string; onChange: (values: string[]) => void }) {
  const items = values.length ? values : [''];
  return (
    <View style={styles.listBlock}>
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>{title}</Text>
        <Button title="Add" size="small" variant="secondary" icon="add-outline" onPress={() => onChange([...values, ''])} />
      </View>
      {items.map((value, index) => (
        <View key={index} style={styles.listItem}>
          <Field label={`${placeholder} ${index + 1}`} value={value} multiline onChangeText={(nextValue) => onChange(replaceAt(items, index, nextValue))} />
          <Button title="Remove" size="small" variant="danger" icon="trash-outline" onPress={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} />
        </View>
      ))}
    </View>
  );
}

function replaceAt(values: string[], index: number, value: string) {
  return values.map((item, itemIndex) => itemIndex === index ? value : item);
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing[6], gap: spacing[5], paddingBottom: spacing[10] },
  emptyScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg, padding: spacing[6] },
  header: {
    minHeight: 40,
    backgroundColor: colors.primaryDark,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2],
  },
  headerTitle: { color: colors.textOnPrimary, fontSize: 14, lineHeight: 18, fontWeight: '600', flex: 1, textAlign: 'center' },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing[6],
    gap: spacing[3],
  },
  cardTitle: { ...typography.h3, color: colors.primaryDark },
  phaseCard: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.md,
    padding: spacing[4],
    backgroundColor: colors.bgElevated,
    gap: spacing[3],
  },
  phaseTitle: { ...typography.label, color: colors.text },
  listBlock: { gap: spacing[3] },
  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[4] },
  listTitle: { ...typography.label, color: colors.text },
  listItem: { gap: spacing[2] },
});
