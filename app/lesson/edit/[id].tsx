import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { PreviewIconButton } from '@/components/PreviewChrome';
import { getLessonPlanById, saveLessonPlan } from '@/lib/lessonStore';
import { reportClientError } from '@/lib/logger';
import { goBackOrReplace } from '@/lib/navigation';
import { colors, radii, spacing, typography } from '@/theme/colors';
import type { LessonPhase, LessonPlan } from '@/types/lessonPlan';

export default function LessonEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [draft, setDraft] = useState<LessonPlan | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!id) return;
      const plan = await getLessonPlanById(id);
      if (active) setDraft(plan ? clone(plan) : null);
    }
    load();
    return () => {
      active = false;
    };
  }, [id]);

  if (!draft) {
    return (
      <View style={styles.emptyScreen}>
        <Button title="Lesson not found" variant="secondary" onPress={() => goBackOrReplace()} />
      </View>
    );
  }

  const updateDraft = (patch: Partial<LessonPlan>) => setDraft((current) => current ? { ...current, ...patch } : current);
  const updatePhase = (phaseIndex: number, patch: Partial<LessonPhase>) =>
    updateDraft({
      phases: draft.phases.map((phase, index) => index === phaseIndex ? { ...phase, ...patch } : phase),
    });

  async function handleSave() {
    const current = draft;
    if (!current) return;
    if (!current.subject.trim() || !current.classLevel || !current.week) {
      Alert.alert('Missing details', 'Subject, class, and week are required.');
      return;
    }
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const saved = await saveLessonPlan({
        ...current,
        termTitle: current.termTitle || 'Term',
        subjectClassTitle: `${current.subject} - ${current.classLevel}`,
        weekTitle: current.weekTitle || `WEEK ${current.week}`,
        editedAt: now,
        updatedAt: now,
      });
      router.replace(`/lesson/${encodeURIComponent(saved.id ?? id ?? '')}`);
    } catch (err) {
      reportClientError('lesson_edit_save', err, { lessonId: current.id ?? id });
      Alert.alert('Save failed', err instanceof Error ? err.message : 'Could not save lesson edits.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <PreviewIconButton icon="arrow-back" label="Back" onPress={() => goBackOrReplace()} />
        <Text style={styles.headerTitle}>Edit Lesson Plan</Text>
        <Button title="Save" size="small" icon="checkmark-outline" loading={saving} onPress={handleSave} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Lesson Details</Text>
          <View style={styles.grid}>
            <Field label="Subject" value={draft.subject} onChangeText={(subject) => updateDraft({ subject })} />
            <Field label="Class" value={draft.classLevel} onChangeText={(classLevel) => updateDraft({ classLevel: classLevel as LessonPlan['classLevel'] })} />
            <Field label="Term" value={draft.termTitle} onChangeText={(termTitle) => updateDraft({ termTitle })} />
            <Field label="Week" value={String(draft.week)} keyboardType="number-pad" onChangeText={(week) => updateDraft({ week: Number(week) || 1, weekTitle: `WEEK ${Number(week) || 1}` })} />
            <Field label="Lesson number" value={draft.lessonNumber ?? ''} onChangeText={(lessonNumber) => updateDraft({ lessonNumber })} />
            <Field label="Duration" value={draft.duration ?? ''} onChangeText={(duration) => updateDraft({ duration })} />
          </View>
          <Field label="Topic" value={draft.topic ?? ''} onChangeText={(topic) => updateDraft({ topic })} />
          <Field label="Strand" value={draft.strand ?? ''} onChangeText={(strand) => updateDraft({ strand })} />
          <Field label="Sub-strand" value={draft.subStrand ?? ''} onChangeText={(subStrand) => updateDraft({ subStrand })} />
          <Field label="Indicator" value={draft.indicator ?? ''} onChangeText={(indicator) => updateDraft({ indicator })} multiline />
          <Field label="Performance indicator" value={draft.performanceIndicator ?? ''} onChangeText={(performanceIndicator) => updateDraft({ performanceIndicator })} multiline />
          <Field label="Resources / references" value={draft.references ?? ''} onChangeText={(references) => updateDraft({ references })} multiline />
        </View>

        {draft.phases.map((phase, phaseIndex) => (
          <View key={`${phase.phase}-${phaseIndex}`} style={styles.card}>
            <Text style={styles.cardTitle}>Phase {phase.phase}: {phase.title}</Text>
            <Field label="Title" value={phase.title} onChangeText={(title) => updatePhase(phaseIndex, { title })} />
            <Field label="Duration" value={phase.duration ?? ''} onChangeText={(duration) => updatePhase(phaseIndex, { duration })} />
            <LineListEditor
              title="Activities"
              values={phase.activities}
              placeholder="Activity"
              onChange={(activities) => updatePhase(phaseIndex, { activities })}
            />
            <LineListEditor
              title="Resources"
              values={phase.resources ?? []}
              placeholder="Resource"
              onChange={(resources) => updatePhase(phaseIndex, { resources })}
            />
            {phase.phase === 2 ? (
              <LineListEditor
                title="Assessment questions"
                values={phase.assessment ?? []}
                placeholder="Assessment question"
                onChange={(assessment) => updatePhase(phaseIndex, { assessment })}
              />
            ) : null}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function LineListEditor({
  title,
  values,
  placeholder,
  onChange,
}: {
  title: string;
  values: string[];
  placeholder: string;
  onChange: (values: string[]) => void;
}) {
  const items = values.length ? values : [''];
  return (
    <View style={styles.listBlock}>
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>{title}</Text>
        <Button title="Add" size="small" variant="secondary" icon="add-outline" onPress={() => onChange([...values, ''])} />
      </View>
      {items.map((value, index) => (
        <View key={index} style={styles.listItem}>
          <Field
            label={`${placeholder} ${index + 1}`}
            value={value}
            multiline
            onChangeText={(nextValue) => onChange(replaceAt(items, index, nextValue))}
          />
          <Button
            title="Remove"
            size="small"
            variant="danger"
            icon="trash-outline"
            onPress={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
          />
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
  },
  cardTitle: { ...typography.h3, color: colors.primaryDark, marginBottom: spacing[5] },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[4] },
  listBlock: { gap: spacing[3], marginTop: spacing[2] },
  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[4] },
  listTitle: { ...typography.label, color: colors.text },
  listItem: { gap: spacing[2], marginBottom: spacing[3] },
});
