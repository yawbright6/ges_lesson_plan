import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { PreviewActionButton, PreviewActions, PreviewHeader } from '@/components/PreviewChrome';
import { useToast } from '@/components/ToastProvider';
import { exportRewrittenTestPaperPdf, exportRewrittenTestPaperWord } from '@/lib/export';
import { goBackOrReplace } from '@/lib/navigation';
import { deleteTestPaper, getTestPaperById } from '@/lib/testPaperStore';
import { colors, radii, spacing, typography } from '@/theme/colors';
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
              <Text key={`${instruction}-${index}`} style={styles.bodyText}>
                {index + 1}. {instruction}
              </Text>
            ))}
          </View>
        ) : null}

        {paper.sections.map((section) => (
          <View key={section.id} style={styles.card}>
            <Text style={styles.cardTitle}>{section.title}</Text>
            {section.questions.map((question) => (
              <Text key={question.id} style={styles.bodyText}>
                {question.id}. {question.text} [{question.marks} mark{question.marks === 1 ? '' : 's'}]
              </Text>
            ))}
          </View>
        ))}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Answer Key</Text>
          {paper.answerKey.map((item, index) => (
            <View key={`${item.questionId}-${index}`} style={styles.answerItem}>
              <Text style={styles.bodyText}>
                {index + 1}. {item.answer}
              </Text>
              {item.markingGuide?.map((guide, guideIndex) => (
                <Text key={`${item.questionId}-guide-${guideIndex}`} style={styles.guideText}>
                  - {guide}
                </Text>
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
  guideText: { ...typography.caption, color: colors.textMuted, lineHeight: 18, marginLeft: spacing[4] },
  answerItem: { gap: spacing[1] },
  muted: { ...typography.body, color: colors.textMuted },
});
