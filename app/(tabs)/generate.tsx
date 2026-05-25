import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Field } from '@/components/Field';
import { Button } from '@/components/Button';
import { CreditUsagePreview } from '@/components/CreditUsagePreview';
import { DatePickerField } from '@/components/DatePickerField';
import { GenerationProgress } from '@/components/GenerationProgress';
import { LessonPlanStack, LessonPlanTable } from '@/components/LessonPlanTable';
import { PreviewActionButton, PreviewActions, PreviewHeader } from '@/components/PreviewChrome';
import { SelectField } from '@/components/SelectField';
import ShareWithAdminModal from '@/components/ShareWithAdminModal';
import { useToast } from '@/components/ToastProvider';
import { formatAiActionError, isInsufficientCreditsError } from '@/lib/ai';
import { defaultRuntimeSettings, loadRuntimeAppSettings } from '@/lib/appSettings';
import { loadCreditBalance } from '@/lib/credits';
import { exportLessonPlanPdf, exportLessonPlansPdf, shareLessonPlan, shareLessonPlans } from '@/lib/export';
import {
  buildGeneratedBundle,
  generateAndSaveLessonPlans,
  translateAndSaveLessonPlans,
} from '@/lib/lessonGeneration';
import { logAppError, reportClientError } from '@/lib/logger';
import {
  CLASS_LEVEL_OPTIONS,
  getDefaultSubjectForClassLevel,
  getExplicitWeekOptions,
  getSubjectOptionsForClassLevel,
  getWeekOptions,
  LESSONS_PER_WEEK_OPTIONS,
  TERM_OPTIONS,
  LOCAL_LANGUAGE_OPTIONS,
} from '@/lib/options';
import { findMatchingScheme, loadMatchingSchemes } from '@/lib/schemeStore';
import {
  getLessonsPerWeekForSubject,
  setLessonsPerWeekForSubject,
} from '@/lib/subjectPrefs';
import { calculateWeekEnding, loadTermStartDate, saveTermStartDate } from '@/lib/termDates';
import { loadLastSelectedTerm, saveLastSelectedTerm } from '@/lib/termPrefs';
import { colors, radii, shadows, spacing, typography } from '@/theme/colors';
import type { ClassLevel, LessonPlan } from '@/types/lessonPlan';
import type { SchemeOfWork } from '@/types/scheme';

type LessonSelection = number | 'all';

export default function GenerateScreen() {
  const { showToast } = useToast();
  const [classLevel, setClassLevel] = useState<ClassLevel>('B7');
  const [subject, setSubject] = useState(getDefaultSubjectForClassLevel('B7'));
  const [week, setWeek] = useState('1');
  const [term, setTerm] = useState('Term 1');
  const [termPrefsLoaded, setTermPrefsLoaded] = useState(false);
  const [sessionsPerWeekInput, setSessionsPerWeekInput] = useState('3');
  const [sessionIndex, setSessionIndex] = useState<LessonSelection>(1);
  const [termStartDate, setTermStartDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [creditBalance, setCreditBalance] = useState(0);
  const [lessonCreditCost, setLessonCreditCost] = useState(defaultRuntimeSettings.featureCreditCosts.lesson_generation);
  const [generatedPlans, setGeneratedPlans] = useState<LessonPlan[]>([]);
  const [matchedScheme, setMatchedScheme] = useState<SchemeOfWork | null>(null);
  const [matchingSchemes, setMatchingSchemes] = useState<SchemeOfWork[]>([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(null);
  const [savedPlanIds, setSavedPlanIds] = useState<string[]>([]);
  const [savedBundleId, setSavedBundleId] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [previewLocalLanguage, setPreviewLocalLanguage] = useState('');
  const [previewTranslating, setPreviewTranslating] = useState(false);

  const subjectOptions = useMemo(
    () => getSubjectOptionsForClassLevel(classLevel),
    [classLevel],
  );

  useEffect(() => {
    if (!subjectOptions.some((option) => option.value === subject)) {
      setSubject(getDefaultSubjectForClassLevel(classLevel));
    }
  }, [classLevel, subject, subjectOptions]);

  const refreshSchemes = useCallback(async () => {
    if (!subject.trim()) {
      setMatchedScheme(null);
      setMatchingSchemes([]);
      setSelectedSchemeId(null);
      return;
    }

    const [scheme, schemes] = await Promise.all([
      findMatchingScheme({
        subject,
        classLevel,
        term,
      }),
      loadMatchingSchemes({
        subject,
        classLevel,
        term,
      }),
    ]);
    setMatchedScheme(scheme);
    setMatchingSchemes(schemes);
    setSelectedSchemeId((current) => {
      if (current && schemes.some((item) => item.id === current)) return current;
      return scheme?.id ?? null;
    });
  }, [subject, classLevel, term]);

  useEffect(() => {
    refreshSchemes();
  }, [refreshSchemes]);

  useFocusEffect(
    useCallback(() => {
      refreshSchemes();
      Promise.all([
        loadCreditBalance().catch(() => null),
        loadRuntimeAppSettings(),
      ])
        .then(([balance, settings]) => {
          if (typeof balance === 'number') setCreditBalance(balance);
          setLessonCreditCost(settings.featureCreditCosts.lesson_generation);
        })
        .catch(() => undefined);
    }, [refreshSchemes]),
  );

  const selectedScheme =
    matchingSchemes.find((scheme) => scheme.id === selectedSchemeId) ?? matchedScheme;
  const sessionsPerWeek = Math.max(1, Math.min(4, Number(sessionsPerWeekInput) || 1));
  const availableWeeks = useMemo(
    () =>
      selectedScheme?.weeks.length
        ? selectedScheme.weeks.map((item) => item.week)
        : Array.from({ length: 12 }, (_, index) => index + 1),
    [selectedScheme],
  );

  const weekOptions = useMemo(
    () => (selectedScheme?.weeks.length ? getExplicitWeekOptions(availableWeeks) : getWeekOptions(availableWeeks.length)),
    [availableWeeks, selectedScheme?.weeks.length],
  );
  const lessonNumbers = useMemo(
    () => Array.from({ length: sessionsPerWeek }, (_, index) => index + 1),
    [sessionsPerWeek],
  );

  const selectedLessonNumbers = useMemo(
    () => (sessionIndex === 'all' ? lessonNumbers : [sessionIndex]),
    [lessonNumbers, sessionIndex],
  );
  const generationCost = selectedLessonNumbers.length * lessonCreditCost;

  useEffect(() => {
    if (sessionIndex !== 'all' && sessionIndex > sessionsPerWeek) {
      setSessionIndex(sessionsPerWeek);
    }
  }, [sessionIndex, sessionsPerWeek]);

  useEffect(() => {
    let active = true;

    async function loadSubjectPreference() {
      if (!subject.trim()) return;
      const savedValue = await getLessonsPerWeekForSubject(subject);
      if (active && savedValue) {
        setSessionsPerWeekInput(savedValue);
      }
    }

    loadSubjectPreference();

    return () => {
      active = false;
    };
  }, [subject]);

  useEffect(() => {
    if (!subject.trim()) return;
    setLessonsPerWeekForSubject(subject, String(sessionsPerWeek));
  }, [subject, sessionsPerWeek]);

  useEffect(() => {
    let active = true;
    loadLastSelectedTerm().then((savedTerm) => {
      if (active && savedTerm) setTerm(savedTerm);
    }).catch(() => undefined).finally(() => {
      if (active) setTermPrefsLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (termPrefsLoaded) saveLastSelectedTerm(term).catch(() => undefined);
  }, [term, termPrefsLoaded]);

  useEffect(() => {
    const currentWeek = Number(week);
    if (availableWeeks.length && !availableWeeks.includes(currentWeek)) {
      setWeek(String(availableWeeks[0]));
    }
  }, [availableWeeks, week]);

  useEffect(() => {
    let active = true;

    async function loadSavedTermDate() {
      const savedDate = await loadTermStartDate({ classLevel, term });
      if (active) setTermStartDate(savedDate);
    }

    loadSavedTermDate();
    return () => {
      active = false;
    };
  }, [classLevel, term]);

  useEffect(() => {
    saveTermStartDate({ classLevel, term, startDate: termStartDate });
  }, [classLevel, term, termStartDate]);

  async function handleGenerate() {
    if (!subject.trim()) {
      Alert.alert('Subject required', 'Please select the subject.');
      return;
    }
    if (!selectedScheme) {
      Alert.alert(
        'Scheme required',
        'Please generate or select a saved scheme of work for this subject, class and term before creating a lesson plan.',
      );
      return;
    }

    const weekNum = Number(week);
    if (!Number.isInteger(weekNum) || weekNum < 1 || weekNum > 14) {
      Alert.alert('Week invalid', 'Select a valid week.');
      return;
    }

    setLoading(true);
    try {
      if (sessionIndex === 'all') {
        const balance = await loadCreditBalance();
        if (balance < generationCost) {
          const message = `You need ${formatCredits(generationCost)} to generate all ${sessionsPerWeek} lessons for this week.`;
          showToast({ message, type: 'error' });
          Alert.alert('Not enough credits', message, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Get credits', onPress: () => router.push('/(tabs)/credits') },
          ]);
          return;
        }
      }

      const result = await generateAndSaveLessonPlans({
        subject,
        classLevel,
        week: weekNum,
        term,
        termStartDate,
        sessionsPerWeek,
        selectedLessonNumbers,
        sessionIndex,
        notes,
        selectedScheme,
      });

      setSavedPlanIds(result.savedPlanIds);
      setSavedBundleId(result.savedBundleId);
      setGeneratedPlans(result.plans);
      loadCreditBalance().then(setCreditBalance).catch(() => undefined);
      const usedFallback = result.plans.some(
        (result) =>
          typeof result.references === 'string' &&
          result.references.toLowerCase().includes('fallback template'),
      );
      showToast({
        message:
          sessionIndex === 'all'
            ? `${result.plans.length} lesson plans generated for the week.`
            : usedFallback
              ? 'Lesson plan generated from fallback template.'
              : 'Lesson plan generated successfully.',
      });
    } catch (err: unknown) {
      const message = formatAiActionError(err);
      logAppError({
        source: 'client',
        action: 'generate_lesson_plan',
        message,
        metadata: { subject, classLevel, week, sessionIndex, sessionsPerWeek },
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

  if (generatedPlans.length) {
    const singlePlan = generatedPlans.length === 1 ? generatedPlans[0] : null;
    const canTranslatePreview = generatedPlans.every((plan) => isGhanaianLanguageSubject(plan.subject));
    const shareGeneratedPlans = () => {
      if (singlePlan) {
        shareLessonPlan(singlePlan);
      } else {
        shareLessonPlans(generatedPlans);
      }
    };
    const saveGeneratedPlansAsPdf = () => {
      if (singlePlan) {
        exportLessonPlanPdf(singlePlan);
      } else {
        exportLessonPlansPdf(generatedPlans);
      }
    };
    const translateGeneratedPlans = async () => {
      if (!previewLocalLanguage) {
        Alert.alert('Choose language', 'Select a local language first.');
        return;
      }
      setPreviewTranslating(true);
      try {
        const result = await translateAndSaveLessonPlans(generatedPlans, previewLocalLanguage);
        setGeneratedPlans(result.plans);
        setSavedPlanIds(result.savedPlanIds);
        setSavedBundleId(result.savedBundleId);
        showToast({ message: 'Translated lesson plan saved.' });
      } catch (err) {
        reportClientError('lesson_preview_translate_generated', err, {
          lessonIds: generatedPlans.map((plan) => plan.id).filter(Boolean),
          language: previewLocalLanguage,
        });
        Alert.alert('Translation failed', err instanceof Error ? err.message : 'Could not translate lesson plan.');
      } finally {
        setPreviewTranslating(false);
      }
    };
    return (
      <View style={styles.previewContainer}>
        <PreviewHeader
          title={singlePlan ? 'Lesson Plan' : `Week Plan (${generatedPlans.length})`}
          onBack={() => {
            setGeneratedPlans([]);
            setSavedPlanIds([]);
            setSavedBundleId(null);
            setShareModalOpen(false);
            setPreviewLocalLanguage('');
          }}
          onShare={shareGeneratedPlans}
        />
        {singlePlan ? <LessonPlanTable plan={singlePlan} /> : <LessonPlanStack plans={generatedPlans} />}
        {canTranslatePreview ? (
          <View style={styles.translatePanel}>
            <SelectField
              label={singlePlan ? 'Translate lesson plan' : 'Translate week plan'}
              value={previewLocalLanguage}
              options={LOCAL_LANGUAGE_OPTIONS}
              onChange={setPreviewLocalLanguage}
              helperText="Creates an NLLB machine-translation draft of the indicator and lesson phases."
            />
          </View>
        ) : null}
        <PreviewActions>
          {canTranslatePreview ? (
            <PreviewActionButton
              title="Translate"
              icon="language-outline"
              variant="secondary"
              loading={previewTranslating}
              onPress={translateGeneratedPlans}
            />
          ) : null}
          <PreviewActionButton
            title="Send to Admin"
            icon="shield-checkmark-outline"
            variant="secondary"
            span={canTranslatePreview ? 'half' : 'full'}
            onPress={() => setShareModalOpen(true)}
          />
          <PreviewActionButton title="PDF" icon="document-text-outline" onPress={saveGeneratedPlansAsPdf} />
          <PreviewActionButton
            title="Teaching Notes"
            icon="reader-outline"
            variant="secondary"
            onPress={() =>
              router.push(
                singlePlan
                  ? `/(tabs)/tools/teaching-notes?lessonPlanId=${encodeURIComponent(singlePlan.id ?? '')}`
                  : `/(tabs)/tools/teaching-notes?lessonPlanIds=${encodeURIComponent(generatedPlans.map((plan) => plan.id).filter(Boolean).join(','))}`,
              )
            }
          />
        </PreviewActions>
        <ShareWithAdminModal
          isOpen={shareModalOpen}
          lessonId={singlePlan?.id ?? savedBundleId ?? ''}
          lessonData={singlePlan ?? buildGeneratedBundle(generatedPlans, savedBundleId)}
          onClose={() => setShareModalOpen(false)}
          onSuccess={() => {
            showToast({ message: 'Lesson shared with admin successfully!' });
          }}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>Lesson Planner</Text>
          <Text style={styles.heading}>New Lesson Plan</Text>
          <Text style={styles.sub}>
            Choose the class first — the subject list updates automatically to show only subjects
            mapped for that level.
          </Text>
        </View>

        <View style={styles.headerPanel}>
          <View style={styles.headerControls}>
            <View style={styles.termControl}>
              <SelectField
                label="Term"
                value={term}
                options={TERM_OPTIONS}
                onChange={setTerm}
                compact
                triggerStyle={styles.termTrigger}
                triggerTextStyle={styles.termTriggerText}
              />
            </View>
            <View style={styles.headerControl}>
              <DatePickerField
                label="Term start date"
                value={termStartDate}
                onChange={setTermStartDate}
                placeholder="Select start date"
              />
            </View>
          </View>
          <Text style={styles.headerMeta}>
            Week ending: {calculateWeekEnding(termStartDate, Number(week)) || 'Enter term start date'}
          </Text>
        </View>

        <View style={styles.coreFieldGrid}>
          <View style={styles.coreFieldCell}>
            <SelectField
              label="Class"
              value={classLevel}
              options={CLASS_LEVEL_OPTIONS}
              onChange={(value) => setClassLevel(value as ClassLevel)}
            />
          </View>
          <View style={styles.coreFieldCell}>
            <SelectField
              label="Subject"
              value={subject}
              options={subjectOptions}
              onChange={setSubject}
              placeholder="Select a subject"
              helperText={
                subjectOptions.length
                  ? undefined
                  : 'No mapped subjects are available for this level yet.'
              }
              disabled={!subjectOptions.length}
            />
          </View>
          <View style={styles.coreFieldCell}>
            <SelectField
              label="Week"
              value={week}
              options={weekOptions}
              onChange={setWeek}
            />
          </View>
          <View style={styles.coreFieldCell}>
            <SelectField
              label="Lessons per week"
              value={sessionsPerWeekInput}
              options={LESSONS_PER_WEEK_OPTIONS}
              onChange={setSessionsPerWeekInput}
            />
          </View>
        </View>

        <View style={styles.lessonStripWrap}>
          <Text style={styles.lessonStripLabel}>Lesson This Week</Text>
          <View style={styles.lessonStripRow}>
            {lessonNumbers.map((lessonNumber) => {
              const active = lessonNumber === sessionIndex;
              return (
                <Pressable
                  key={lessonNumber}
                  onPress={() => setSessionIndex(lessonNumber)}
                  style={({ pressed }) => [
                    styles.lessonStrip,
                    active && styles.lessonStripActive,
                    pressed && styles.lessonStripPressed,
                  ]}
                >
                  <Text style={[styles.lessonStripText, active && styles.lessonStripTextActive]}>
                    Lesson {lessonNumber}
                  </Text>
                </Pressable>
              );
            })}
            <Pressable
              onPress={() => setSessionIndex('all')}
              style={({ pressed }) => [
                styles.lessonStrip,
                sessionIndex === 'all' && styles.lessonStripActive,
                pressed && styles.lessonStripPressed,
              ]}
            >
              <Text style={[styles.lessonStripText, sessionIndex === 'all' && styles.lessonStripTextActive]}>
                All
              </Text>
            </Pressable>
          </View>
        </View>

        <Field
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          style={{ minHeight: 80, textAlignVertical: 'top' }}
        />

        <View style={styles.schemeHint}>
          <Text style={styles.schemeHintTitle}>
            {selectedScheme ? 'Using selected term scheme' : 'No saved term scheme found'}
          </Text>
          <Text style={styles.schemeHintText}>
            {selectedScheme
              ? sessionIndex === 'all'
                ? `${selectedScheme.subject} - ${selectedScheme.classLevel} - ${selectedScheme.term}. Week ${week || '?'} will generate all ${sessionsPerWeek} lessons and use ${formatCredits(generationCost)}.`
                : `${selectedScheme.subject} - ${selectedScheme.classLevel} - ${selectedScheme.term}. Week ${week || '?'} will be grounded on that scheme for Lesson ${sessionIndex} of ${sessionsPerWeek}.`
              : 'Lesson plans now depend on a saved scheme of work. Generate or select a scheme for this subject, class and term first.'}
          </Text>
        </View>

        {matchingSchemes.length ? (
          <View style={styles.schemeList}>
            <Text style={styles.schemeListTitle}>Select Scheme to Use</Text>
            {matchingSchemes.map((scheme) => {
              const active = scheme.id === selectedSchemeId;
              return (
                <Pressable
                  key={scheme.id}
                  style={[styles.schemeCard, active && styles.schemeCardActive]}
                  onPress={() => setSelectedSchemeId(scheme.id ?? null)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.schemeCardTitle}>{scheme.title}</Text>
                    <Text style={styles.schemeCardMeta}>
                      {scheme.term} | {scheme.weeks.length} weeks
                    </Text>
                  </View>
                  <Button
                    title="View full"
                    variant="secondary"
                    onPress={() => router.push(`/(tabs)/scheme/${scheme.id}`)}
                    style={styles.inlineButton}
                  />
                </Pressable>
              );
            })}
          </View>
        ) : null}

        <CreditUsagePreview
          cost={generationCost}
          balance={creditBalance}
          label={
            sessionIndex === 'all'
              ? `This will use ${formatCredits(generationCost)} for ${selectedLessonNumbers.length} lessons.`
              : `This will use ${formatCredits(generationCost)}.`
          }
          onBuyCredits={() => router.push('/(tabs)/credits')}
        />
        <Button
          title={sessionIndex === 'all' ? `Generate all ${sessionsPerWeek} lesson plans` : 'Generate lesson plan'}
          onPress={handleGenerate}
          disabled={loading}
        />
        <GenerationProgress
          active={loading}
          label={sessionIndex === 'all' ? 'Generating full-week lesson plans' : 'Generating lesson plan'}
          estimateMs={sessionIndex === 'all' ? 45000 * selectedLessonNumbers.length : 40000}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  previewContainer: { flex: 1, backgroundColor: colors.bg },
  translatePanel: {
    padding: spacing[5],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
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
  headerPanel: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing[4],
    gap: spacing[2],
    ...shadows.sm,
  },
  headerControls: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    columnGap: spacing[2],
    alignItems: 'flex-start',
  },
  headerControl: {
    flex: 1,
    minWidth: 0,
  },
  termControl: {
    width: 82,
    maxWidth: 90,
    flexShrink: 0,
  },
  termTrigger: {
    paddingHorizontal: spacing[2],
    gap: 1,
  },
  termTriggerText: {
    fontSize: 11,
    lineHeight: 14,
  },
  headerMeta: {
    ...typography.bodySm,
    color: colors.primary,
    marginTop: 2,
  },
  coreFieldGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing[4],
    rowGap: spacing[3],
  },
  coreFieldCell: {
    width: '47.5%',
    flexGrow: 0,
    flexShrink: 0,
    minWidth: 0,
  },
  actions: {
    padding: spacing[6],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing[4],
  },
  schemeHint: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    borderRadius: radii.md,
    padding: spacing[6],
    ...shadows.sm,
  },
  schemeHintTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing[2],
  },
  schemeHintText: {
    ...typography.bodySm,
    color: colors.textMuted,
  },
  lessonStripWrap: {
    gap: spacing[3],
  },
  lessonStripLabel: {
    ...typography.label,
    color: colors.text,
  },
  lessonStripRow: {
    flexDirection: 'row',
    gap: spacing[3],
    flexWrap: 'wrap',
  },
  lessonStrip: {
    minHeight: 44,
    minWidth: 96,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[5],
  },
  lessonStripActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  lessonStripPressed: {
    opacity: 0.82,
  },
  lessonStripText: {
    ...typography.label,
    color: colors.textMuted,
  },
  lessonStripTextActive: {
    color: colors.primary,
  },
  schemeList: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing[6],
    gap: spacing[4],
    ...shadows.sm,
  },
  schemeListTitle: {
    ...typography.h4,
    color: colors.text,
  },
  schemeCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing[5],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[5],
    backgroundColor: colors.surface,
  },
  schemeCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  schemeCardTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing[1],
  },
  schemeCardMeta: {
    ...typography.bodySm,
    color: colors.textMuted,
  },
  inlineButton: {
    minHeight: 40,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
  },
});

function formatCredits(value: number) {
  return `${value} ${value === 1 ? 'credit' : 'credits'}`;
}

function isGhanaianLanguageSubject(subject?: string) {
  return subject?.trim().toLowerCase() === 'ghanaian language';
}
