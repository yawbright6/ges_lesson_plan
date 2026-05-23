import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { LessonPlanStack } from '@/components/LessonPlanTable';
import { PreviewActionButton, PreviewActions, PreviewHeader } from '@/components/PreviewChrome';
import { SelectField } from '@/components/SelectField';
import { useToast } from '@/components/ToastProvider';
import ShareFeedbackDisplay from '@/components/ShareFeedbackDisplay';
import ShareWithAdminModal from '@/components/ShareWithAdminModal';
import { translateLessonPlan } from '@/lib/ai';
import { exportLessonPlansPdf, shareLessonPlans } from '@/lib/export';
import { getLessonPlanBundleById, getLessonPlanById, saveLessonPlanBundle } from '@/lib/lessonStore';
import { goBackOrReplace } from '@/lib/navigation';
import { LOCAL_LANGUAGE_OPTIONS } from '@/lib/options';
import { getShareForLesson } from '@/lib/shareStore';
import { colors } from '@/theme/colors';
import type { LessonPlan, LessonPlanBundle, LessonShare } from '@/types/lessonPlan';

export default function LessonWeekDetailScreen() {
  const { showToast } = useToast();
  const { bundleId, ids } = useLocalSearchParams<{ bundleId?: string; ids?: string }>();
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [bundle, setBundle] = useState<LessonPlanBundle | null>(null);
  const [share, setShare] = useState<LessonShare | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [localLanguage, setLocalLanguage] = useState('');
  const [translating, setTranslating] = useState(false);
  const lessonIds = useMemo(
    () => (ids ?? '').split(',').map((id) => id.trim()).filter(Boolean),
    [ids],
  );

  useEffect(() => {
    let active = true;

    async function load() {
      if (bundleId) {
        const result = await getLessonPlanBundleById(bundleId);
        if (active) {
          setBundle(result);
          setPlans(result?.plans ?? []);
        }
        if (result?.id) {
          try {
            const shareInfo = await getShareForLesson(result.id);
            if (active) setShare(shareInfo);
          } catch {
            if (active) setShare(null);
          }
        }
        return;
      }
      if (!lessonIds.length) return;
      const results = await Promise.all(lessonIds.map((id) => getLessonPlanById(id)));
      if (active) {
        const foundPlans = results.filter(Boolean) as LessonPlan[];
        setPlans(foundPlans);
        const previewBundle = buildPreviewBundle(foundPlans);
        setBundle(previewBundle);
        try {
          const shareInfo = previewBundle.id ? await getShareForLesson(previewBundle.id) : null;
          if (active) setShare(shareInfo);
        } catch {
          if (active) setShare(null);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [bundleId, lessonIds]);

  if (!plans.length) {
    return (
      <View style={styles.container}>
        <Button
          title="Lessons not found"
          variant="secondary"
          onPress={() =>
            Alert.alert('Missing lessons', 'These saved lesson plans could not be found.')
          }
        />
      </View>
    );
  }

  const canTranslate = plans.every((plan) => isGhanaianLanguageSubject(plan.subject));
  const shareBundle = bundle ?? buildPreviewBundle(plans);

  return (
    <View style={styles.container}>
      <PreviewHeader
        title={`Week Plan (${plans.length})`}
        subtitle={shareBundle.editedAt ? 'Edited' : undefined}
        onBack={() => goBackOrReplace()}
        onEdit={bundleId ? () => router.push(`/lesson/week/edit?bundleId=${encodeURIComponent(bundleId)}`) : undefined}
        onShare={() => shareLessonPlans(plans)}
      />
      <LessonPlanStack plans={plans} />
      {share ? <ShareFeedbackDisplay share={share} /> : null}
      {canTranslate ? (
        <View style={styles.translatePanel}>
            <SelectField
              label="Translate week plan"
              value={localLanguage}
              options={LOCAL_LANGUAGE_OPTIONS}
              onChange={setLocalLanguage}
              helperText="Creates NLLB machine-translation drafts of the indicators and lesson phases."
            />
        </View>
      ) : null}
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
                const translatedPlans = await Promise.all(
                  plans.map((plan) => translateLessonPlan(plan, localLanguage)),
                );
                const savedBundle = await saveLessonPlanBundle(translatedPlans);
                setBundle(savedBundle);
                setPlans(savedBundle.plans);
                if (savedBundle.id) {
                  router.replace(`/lesson/week?bundleId=${encodeURIComponent(savedBundle.id)}`);
                }
                showToast({ message: 'Translated week plan saved.' });
              } catch (err) {
                Alert.alert('Translation failed', err instanceof Error ? err.message : 'Could not translate week plan.');
              } finally {
                setTranslating(false);
              }
            }}
          />
        ) : null}
        <PreviewActionButton
          title={share ? 'Update Admin' : 'Send to Admin'}
          variant="secondary"
          icon="shield-checkmark-outline"
          span={canTranslate ? 'half' : 'full'}
          onPress={() => setShareModalOpen(true)}
        />
        <PreviewActionButton title="PDF" icon="document-text-outline" onPress={() => exportLessonPlansPdf(plans)} />
        <PreviewActionButton
          title="Teaching Notes"
          variant="secondary"
          icon="reader-outline"
          onPress={() => router.push(`/tools/teaching-notes?lessonPlanIds=${encodeURIComponent(plans.map((plan) => plan.id).filter(Boolean).join(','))}`)}
        />
      </PreviewActions>
      <ShareWithAdminModal
        isOpen={shareModalOpen}
        lessonId={shareBundle.id ?? ''}
        lessonData={shareBundle}
        onClose={() => setShareModalOpen(false)}
        onSuccess={async () => {
          try {
            if (shareBundle.id) {
              const updated = await getShareForLesson(shareBundle.id);
              setShare(updated);
            }
            showToast({ message: 'Week plan shared with admin successfully!' });
          } catch {
            Alert.alert('Shared', 'Week plan was shared, but the confirmation could not be loaded.');
          }
        }}
      />
    </View>
  );
}

function isGhanaianLanguageSubject(subject?: string) {
  return subject?.trim().toLowerCase() === 'ghanaian language';
}

function buildPreviewBundle(plans: LessonPlan[]): LessonPlanBundle {
  const first = plans[0];
  const subject = first?.subject ?? 'Lesson';
  const classLevel = first?.classLevel ?? 'B7';
  const week = first?.week ?? 1;
  const termTitle = first?.termTitle ?? '';
  const createdAt = first?.createdAt ?? new Date().toISOString();
  const lessonCount = plans.length;
  return {
    kind: 'bundle',
    id: first?.id ? `${first.id}-week-bundle-${lessonCount}` : `week-plan-${subject}-${classLevel}-${week}-${createdAt}`,
    title: `${subject} ${classLevel} Week ${week} (${lessonCount} lessons)`,
    subject,
    classLevel,
    termTitle,
    week,
    weekTitle: first?.weekTitle ?? `WEEK ${week}`,
    lessonCount,
    plans,
    createdAt,
    updatedAt: new Date().toISOString(),
  };
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  translatePanel: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
