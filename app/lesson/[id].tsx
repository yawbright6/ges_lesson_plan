import { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { LessonPlanTable } from '@/components/LessonPlanTable';
import { PreviewActionButton, PreviewActions, PreviewHeader } from '@/components/PreviewChrome';
import { SelectField } from '@/components/SelectField';
import { useToast } from '@/components/ToastProvider';
import ShareWithAdminModal from '@/components/ShareWithAdminModal';
import ShareFeedbackDisplay from '@/components/ShareFeedbackDisplay';
import { translateLessonPlan } from '@/lib/ai';
import { exportLessonPlanPdf, shareLessonPlan } from '@/lib/export';
import { deleteLessonPlan, getLessonPlanById, saveLessonPlan } from '@/lib/lessonStore';
import { reportClientError } from '@/lib/logger';
import { goBackOrReplace } from '@/lib/navigation';
import { getShareForLesson } from '@/lib/shareStore';
import { LOCAL_LANGUAGE_OPTIONS } from '@/lib/options';
import { colors } from '@/theme/colors';
import type { LessonPlan, LessonShare } from '@/types/lessonPlan';

const PDF_FONT_SIZE_OPTIONS = [
  { label: 'Small (11pt)', value: '11' },
  { label: 'Medium (13pt)', value: '13' },
  { label: 'Large (16pt) – default', value: '16' },
  { label: 'X-Large (18pt)', value: '18' },
  { label: 'XX-Large (20pt)', value: '20' },
];

export default function LessonDetailScreen() {
  const { showToast } = useToast();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [plan, setPlan] = useState<LessonPlan | null>(null);
  const [share, setShare] = useState<LessonShare | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [localLanguage, setLocalLanguage] = useState('');
  const [translating, setTranslating] = useState(false);
  const [pdfActivityFontSize, setPdfActivityFontSize] = useState('16');

  useEffect(() => {
    async function load() {
      if (!id) return;
      const result = await getLessonPlanById(id);
      setPlan(result);
      
      // Load share info if exists
      try {
        const shareInfo = await getShareForLesson(id);
        setShare(shareInfo);
      } catch (err) {
        reportClientError('lesson_preview_load_share_status', err, { lessonId: id }, 'warning');
      }
    }
    load();
  }, [id]);

  if (!plan) {
    return (
      <View style={styles.container}>
        <Button title="Lesson not found" variant="secondary" onPress={() => Alert.alert('Missing lesson', 'This saved lesson plan could not be found locally.')} />
      </View>
    );
  }

  const canTranslate = isGhanaianLanguageSubject(plan.subject);

  return (
    <View style={styles.container}>
      <PreviewHeader
        title="Lesson Plan"
        subtitle={plan.editedAt ? 'Edited' : undefined}
        onBack={() => goBackOrReplace()}
        onEdit={() => router.push(`/lesson/edit/${encodeURIComponent(plan.id ?? '')}`)}
        onShare={() => shareLessonPlan(plan)}
        onDelete={async () => {
          const confirmed = await confirmRemoval(
            'Delete lesson plan',
            `Delete ${plan.subject} ${plan.classLevel} Week ${plan.week}?`,
          );
          if (!confirmed || !plan.id) return;
          try {
            await deleteLessonPlan(plan.id);
            showToast({ message: 'Lesson plan deleted.' });
            goBackOrReplace();
          } catch (err) {
            reportClientError('lesson_preview_delete', err, { lessonId: plan.id });
            Alert.alert('Delete failed', err instanceof Error ? err.message : 'Could not delete this lesson plan.');
          }
        }}
      />
      <LessonPlanTable plan={plan} />
      
      {/* Share feedback display */}
      {share && <ShareFeedbackDisplay share={share} />}
      
      {canTranslate ? (
        <View style={styles.translatePanel}>
            <SelectField
              label="Translate lesson plan"
              value={localLanguage}
              options={LOCAL_LANGUAGE_OPTIONS}
              onChange={setLocalLanguage}
              helperText="Creates an NLLB machine-translation draft of the indicator and lesson phases."
            />
        </View>
      ) : null}
      <View style={styles.pdfOptions}>
        <SelectField
          label="PDF activity font size"
          value={pdfActivityFontSize}
          options={PDF_FONT_SIZE_OPTIONS}
          onChange={setPdfActivityFontSize}
          compact
        />
      </View>
      <PreviewActions>
        {canTranslate ? (
          <PreviewActionButton
            title="Translate"
            icon="language-outline"
            variant="secondary"
            loading={translating}
            onPress={async () => {
              if (!localLanguage) {
                Alert.alert('Choose language', 'Select a local language first.');
                return;
              }
              setTranslating(true);
              try {
                const translated = await translateLessonPlan(plan, localLanguage);
                const saved = await saveLessonPlan(translated);
                setPlan(saved);
                showToast({ message: 'Translated lesson plan saved.' });
                if (saved.id) {
                  router.replace(`/lesson/${encodeURIComponent(saved.id)}`);
                }
              } catch (err) {
                reportClientError('lesson_preview_translate', err, { lessonId: plan.id, language: localLanguage });
                Alert.alert('Translation failed', err instanceof Error ? err.message : 'Could not translate lesson plan.');
              } finally {
                setTranslating(false);
              }
            }}
          />
        ) : null}
        <PreviewActionButton 
          title={share ? "Update Admin" : "Send to Admin"} 
          variant="secondary" 
          icon="shield-checkmark-outline"
          span={canTranslate ? 'half' : 'full'}
          onPress={() => setShareModalOpen(true)} 
        />
        <PreviewActionButton title="PDF" icon="document-text-outline" onPress={() => exportLessonPlanPdf(plan, { activityFontSize: Number(pdfActivityFontSize) })} />
        <PreviewActionButton title="Teaching Notes" icon="reader-outline" variant="secondary" onPress={() => router.push(`/tools/teaching-notes?lessonPlanId=${encodeURIComponent(plan.id ?? '')}`)} />
      </PreviewActions>
      
      {/* Share with Admin Modal */}
      <ShareWithAdminModal
        isOpen={shareModalOpen}
        lessonId={plan.id ?? ''}
        lessonData={plan}
        onClose={() => setShareModalOpen(false)}
        onSuccess={async () => {
          try {
            if (plan.id) {
              const updated = await getShareForLesson(plan.id);
              setShare(updated);
            }
            showToast({ message: 'Lesson shared with admin successfully!' });
          } catch (err) {
            reportClientError('lesson_preview_share_confirmation', err, { lessonId: plan.id }, 'warning');
            Alert.alert('Error', 'Lesson was shared but we could not load the confirmation.');
          }
        }}
      />
    </View>
  );
}

function isGhanaianLanguageSubject(subject?: string) {
  return subject?.trim().toLowerCase() === 'ghanaian language';
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
  translatePanel: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  pdfOptions: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
