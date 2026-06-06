import { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { Field } from '@/components/Field';
import { PreviewIconButton } from '@/components/PreviewChrome';
import { reportClientError } from '@/lib/logger';
import { goBackOrReplace } from '@/lib/navigation';
import { getTestPaperById, saveTestPaper } from '@/lib/testPaperStore';
import { colors, radii, spacing, typography } from '@/theme/colors';
import type { CompiledAnswerKeyItem, CompiledTestPaper, CompiledTestQuestion, CompiledTestQuestionSubpart, CompiledTestSection } from '@/types/testItemCompiler';

export default function TestPaperEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [draft, setDraft] = useState<CompiledTestPaper | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!id) return;
      const paper = await getTestPaperById(id);
      if (active) setDraft(paper ? clone(paper) : null);
    }
    load();
    return () => {
      active = false;
    };
  }, [id]);

  const computedMarks = useMemo(
    () => draft?.sections.reduce((sum, section) => sum + section.questions.reduce((inner, question) => inner + markValue(question.marks), 0), 0) ?? 0,
    [draft],
  );

  if (!draft) {
    return (
      <View style={styles.emptyScreen}>
        <Button title="Test paper not found" variant="secondary" onPress={() => goBackOrReplace()} />
      </View>
    );
  }

  const updateDraft = (patch: Partial<CompiledTestPaper>) => setDraft((current) => current ? { ...current, ...patch } : current);
  const updateSection = (sectionIndex: number, patch: Partial<CompiledTestSection>) =>
    updateDraft({
      sections: draft.sections.map((section, index) => index === sectionIndex ? { ...section, ...patch } : section),
    });
  const updateQuestion = (sectionIndex: number, questionIndex: number, patch: Partial<CompiledTestQuestion>) => {
    const section = draft.sections[sectionIndex];
    updateSection(sectionIndex, {
      questions: section.questions.map((question, index) => index === questionIndex ? { ...question, ...patch } : question),
    });
  };
  const updateQuestionSubparts = (sectionIndex: number, questionIndex: number, subparts: CompiledTestQuestionSubpart[]) => {
    updateQuestion(sectionIndex, questionIndex, { subparts });
  };

  async function handleSave() {
    const current = draft;
    if (!current) return;
    if (!current.title.trim()) {
      Alert.alert('Missing title', 'Enter a title for the test paper.');
      return;
    }
    setSaving(true);
    try {
      const now = new Date().toISOString();
      const saved = await saveTestPaper({
        ...current,
        totalMarks: computedMarks,
        answerKey: syncAnswerKeyMarks(current.answerKey, current.sections),
        editedAt: now,
        updatedAt: now,
      } as CompiledTestPaper & { updatedAt: string });
      router.replace(`/(tabs)/test-paper/${encodeURIComponent(saved.id ?? id ?? '')}`);
    } catch (err) {
      reportClientError('test_paper_edit_save', err, { testPaperId: current.id ?? id });
      Alert.alert('Save failed', err instanceof Error ? err.message : 'Could not save test paper edits.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <PreviewIconButton icon="arrow-back" label="Back" onPress={() => goBackOrReplace()} />
        <Text style={styles.headerTitle}>Edit Test Paper</Text>
        <Button title="Save" size="small" icon="checkmark-outline" loading={saving} onPress={handleSave} />
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Paper Details</Text>
          <Field label="Title" value={draft.title} onChangeText={(title) => updateDraft({ title })} />
          <View style={styles.grid}>
            <Field label="Subject" value={draft.subject} onChangeText={(subject) => updateDraft({ subject })} />
            <Field label="Class" value={draft.classLevel} onChangeText={(classLevel) => updateDraft({ classLevel: classLevel as CompiledTestPaper['classLevel'] })} />
            <Field label="Term" value={draft.termTitle ?? ''} onChangeText={(termTitle) => updateDraft({ termTitle })} />
          </View>
          <Text style={styles.markSummary}>{computedMarks} total marks from questions</Text>
        </View>

        <LineListEditor
          title="Instructions"
          values={draft.instructions}
          placeholder="Instruction"
          onChange={(instructions) => updateDraft({ instructions })}
        />

        {draft.sections.map((section, sectionIndex) => (
          <View key={section.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Section {sectionIndex + 1}</Text>
              <Button
                title="Remove"
                size="small"
                variant="danger"
                icon="trash-outline"
                onPress={() => updateDraft({ sections: draft.sections.filter((_, index) => index !== sectionIndex) })}
              />
            </View>
            <Field label="Section title" value={section.title} onChangeText={(title) => updateSection(sectionIndex, { title })} />
            {section.questions.map((question, questionIndex) => (
              <View key={question.id} style={styles.questionCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.questionTitle}>Question {questionIndex + 1}</Text>
                  <Button
                    title="Remove"
                    size="small"
                    variant="danger"
                    icon="trash-outline"
                    onPress={() => updateSection(sectionIndex, { questions: section.questions.filter((_, index) => index !== questionIndex) })}
                  />
                </View>
                <Field label="Question number" value={question.id} onChangeText={(nextId) => updateQuestion(sectionIndex, questionIndex, { id: nextId })} />
                <Field label="Question text" value={question.text} multiline onChangeText={(text) => updateQuestion(sectionIndex, questionIndex, { text })} />
                <Field
                  label="Marks"
                  value={String(question.marks)}
                  keyboardType="number-pad"
                  onChangeText={(marks) => updateQuestion(sectionIndex, questionIndex, { marks: markValue(Number(marks)) })}
                />
                <SubpartEditor
                  subparts={question.subparts ?? []}
                  onChange={(subparts) => updateQuestionSubparts(sectionIndex, questionIndex, subparts)}
                />
              </View>
            ))}
            <Button
              title="Add question"
              variant="secondary"
              icon="add-outline"
              onPress={() =>
                updateSection(sectionIndex, {
                  questions: [
                    ...section.questions,
                    {
                      id: String(section.questions.length + 1),
                      text: '',
                      marks: 1,
                      sourceItemIds: [],
                    },
                  ],
                })
              }
            />
          </View>
        ))}

        <Button
          title="Add section"
          variant="secondary"
          icon="add-circle-outline"
          onPress={() =>
            updateDraft({
              sections: [
                ...draft.sections,
                {
                  id: `section-${draft.sections.length + 1}`,
                  title: `Section ${draft.sections.length + 1}`,
                  questions: [],
                },
              ],
            })
          }
        />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Answer Key</Text>
          {draft.answerKey.map((item, index) => (
            <View key={`${item.questionId}-${index}`} style={styles.questionCard}>
              <Field label="Question number" value={item.questionId} onChangeText={(questionId) => updateAnswerKey(draft, updateDraft, index, { questionId })} />
              <Field label="Answer" value={item.answer} multiline onChangeText={(answer) => updateAnswerKey(draft, updateDraft, index, { answer })} />
              <LineListEditor
                title="Marking guide"
                values={item.markingGuide ?? []}
                placeholder="Guide"
                onChange={(markingGuide) => updateAnswerKey(draft, updateDraft, index, { markingGuide })}
              />
            </View>
          ))}
          <Button
            title="Add answer"
            variant="secondary"
            icon="add-outline"
            onPress={() =>
              updateDraft({
                answerKey: [
                  ...draft.answerKey,
                  { questionId: String(draft.answerKey.length + 1), answer: '', marks: 1, markingGuide: [] },
                ],
              })
            }
          />
        </View>
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
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
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

function SubpartEditor({
  subparts,
  onChange,
}: {
  subparts: CompiledTestQuestionSubpart[];
  onChange: (subparts: CompiledTestQuestionSubpart[]) => void;
}) {
  const items = subparts.length ? subparts : [];
  return (
    <View style={styles.subpartBlock}>
      <View style={styles.cardHeader}>
        <Text style={styles.subpartTitle}>Subparts</Text>
        <Button
          title="Add"
          size="small"
          variant="secondary"
          icon="add-outline"
          onPress={() => onChange([...subparts, { label: String.fromCharCode(97 + subparts.length), text: '', marks: undefined }])}
        />
      </View>
      {items.map((subpart, index) => (
        <View key={index} style={styles.subpartCard}>
          <View style={styles.grid}>
            <Field
              label="Label"
              value={subpart.label}
              onChangeText={(label) => onChange(replaceSubpartAt(items, index, { ...subpart, label }))}
            />
            <Field
              label="Marks"
              value={subpart.marks ? String(subpart.marks) : ''}
              keyboardType="number-pad"
              onChangeText={(marks) => onChange(replaceSubpartAt(items, index, { ...subpart, marks: marks ? markValue(Number(marks)) : undefined }))}
            />
          </View>
          <Field
            label="Subpart text"
            value={subpart.text}
            multiline
            onChangeText={(text) => onChange(replaceSubpartAt(items, index, { ...subpart, text }))}
          />
          <Button
            title="Remove subpart"
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

function replaceSubpartAt(values: CompiledTestQuestionSubpart[], index: number, value: CompiledTestQuestionSubpart) {
  return values.map((item, itemIndex) => itemIndex === index ? value : item);
}

function updateAnswerKey(
  draft: CompiledTestPaper,
  updateDraft: (patch: Partial<CompiledTestPaper>) => void,
  index: number,
  patch: Partial<CompiledAnswerKeyItem>,
) {
  updateDraft({
    answerKey: draft.answerKey.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item),
  });
}

function syncAnswerKeyMarks(answerKey: CompiledAnswerKeyItem[], sections: CompiledTestSection[]) {
  const marksByQuestion = new Map<string, number>();
  sections.forEach((section) => section.questions.forEach((question) => marksByQuestion.set(question.id, markValue(question.marks))));
  return answerKey.map((item) => ({ ...item, marks: marksByQuestion.get(item.questionId) ?? markValue(item.marks) }));
}

function replaceAt(values: string[], index: number, value: string) {
  return values.map((item, itemIndex) => itemIndex === index ? value : item);
}

function markValue(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : 1;
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
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[4] },
  cardTitle: { ...typography.h3, color: colors.primaryDark },
  questionCard: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.md,
    padding: spacing[4],
    backgroundColor: colors.bgElevated,
    gap: spacing[2],
  },
  questionTitle: { ...typography.label, color: colors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[4] },
  subpartBlock: { gap: spacing[2], marginTop: spacing[2] },
  subpartTitle: { ...typography.label, color: colors.textMuted },
  subpartCard: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.sm,
    padding: spacing[3],
    gap: spacing[2],
    backgroundColor: colors.surface,
  },
  markSummary: { ...typography.label, color: colors.primary },
  listItem: { gap: spacing[2] },
});
