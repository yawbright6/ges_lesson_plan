import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
import type { QuickLessonCurriculumItem } from '@/lib/curriculum';
import { exportLessonPlanPdf, exportLessonPlansPdf, shareLessonPlan, shareLessonPlans } from '@/lib/export';
import { buildWeeklyLessonAssignments } from '@/lib/lessonAssignments';
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
import { DEFAULT_PDF_ACTIVITY_FONT_SIZE, PDF_ACTIVITY_FONT_SIZE_OPTIONS } from '@/lib/pdfOptions';
import { getAvailableCurriculumEntries, type CurriculumEntryOption } from '@/lib/schemeBuilder';
import { findMatchingScheme, loadMatchingSchemes } from '@/lib/schemeStore';
import {
  getDefaultLessonsPerWeekSubjectPreference,
  getLessonsPerWeekForSubject,
  setLessonsPerWeekForSubject,
} from '@/lib/subjectPrefs';
import { getWeekTopic } from '@/lib/schemeWeek';
import { calculateWeekEnding, loadTermStartDate, saveTermStartDate } from '@/lib/termDates';
import { loadLastSelectedTerm, saveLastSelectedTerm } from '@/lib/termPrefs';
import { colors, radii, shadows, spacing, typography } from '@/theme/colors';
import type { ClassLevel, LessonPlan } from '@/types/lessonPlan';
import type { SchemeOfWork } from '@/types/scheme';

type LessonSelection = number | 'all';
type PlanningMethod = 'quick' | 'scheme';

const PLANNING_METHOD_OPTIONS = [
  {
    label: 'Quick lesson - Select your own topic and generate a lesson plan',
    value: 'quick',
  },
  {
    label: 'From organized scheme - Generate a lesson plan based on your scheme of work',
    value: 'scheme',
  },
];

export default function GenerateScreen() {
  const { showToast } = useToast();
  const [classLevel, setClassLevel] = useState<ClassLevel>('B7');
  const [subject, setSubject] = useState(getDefaultSubjectForClassLevel('B7'));
  const [week, setWeek] = useState('1');
  const [term, setTerm] = useState('Term 1');
  const [termPrefsLoaded, setTermPrefsLoaded] = useState(false);
  const [sessionsPerWeekInput, setSessionsPerWeekInput] = useState('3');
  const [sessionIndex, setSessionIndex] = useState<LessonSelection>(1);
  const [planningMethod, setPlanningMethod] = useState<PlanningMethod>('quick');
  const [selectedQuickAspect, setSelectedQuickAspect] = useState('all');
  const [selectedQuickItemId, setSelectedQuickItemId] = useState('');
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
  const [pdfActivityFontSize, setPdfActivityFontSize] = useState(DEFAULT_PDF_ACTIVITY_FONT_SIZE);

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
  const quickCurriculumItems = useMemo(
    () =>
      buildQuickLessonItemsFromAvailableEntries(
        getAvailableCurriculumEntries({
          subject,
          classLevel,
          includeFullYear: true,
        })
      ),
    [classLevel, subject],
  );
  const showQuickAspectField = planningMethod === 'quick' && isQuickLanguageSubject(subject);
  const quickAspectOptions = useMemo(
    () => buildQuickAspectOptions(quickCurriculumItems),
    [quickCurriculumItems],
  );
  const filteredQuickCurriculumItems = useMemo(
    () =>
      showQuickAspectField && selectedQuickAspect !== 'all'
        ? quickCurriculumItems.filter((item) => item.aspect === selectedQuickAspect)
        : quickCurriculumItems,
    [quickCurriculumItems, selectedQuickAspect, showQuickAspectField],
  );
  const selectedQuickItem = useMemo(
    () =>
      filteredQuickCurriculumItems.find((item) => item.id === selectedQuickItemId) ??
      filteredQuickCurriculumItems[0],
    [filteredQuickCurriculumItems, selectedQuickItemId],
  );
  const quickScheme = useMemo(
    () =>
      selectedQuickItem
        ? buildQuickLessonScheme({
            item: selectedQuickItem,
            subject,
            classLevel,
            term,
            week: Number(week) || 1,
          })
        : null,
    [classLevel, selectedQuickItem, subject, term, week],
  );
  const activeScheme = planningMethod === 'quick' ? quickScheme : selectedScheme;
  const selectedSchemeWeek = useMemo(
    () => selectedScheme?.weeks.find((item) => Number(item.week) === Number(week)),
    [selectedScheme, week],
  );
  const activeSchemeWeek = planningMethod === 'quick'
    ? quickScheme?.weeks[0]
    : selectedSchemeWeek;
  const lessonFocusPreview = useMemo(
    () =>
      buildLessonFocusPreview({
        subject,
        classLevel,
        selectedWeek: activeSchemeWeek,
        weeks: activeScheme?.weeks,
        sessionsPerWeek,
      }),
    [activeScheme?.weeks, activeSchemeWeek, classLevel, sessionsPerWeek, subject],
  );
  const availableWeeks = useMemo(
    () =>
      planningMethod === 'quick'
        ? Array.from({ length: 14 }, (_, index) => index + 1)
        : selectedScheme?.weeks.length
        ? selectedScheme.weeks.map((item) => item.week)
        : Array.from({ length: 12 }, (_, index) => index + 1),
    [planningMethod, selectedScheme],
  );

  const weekOptions = useMemo(
    () =>
      planningMethod === 'scheme' && selectedScheme?.weeks.length
        ? getExplicitWeekOptions(availableWeeks)
        : getWeekOptions(availableWeeks.length),
    [availableWeeks, planningMethod, selectedScheme?.weeks.length],
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
    setSelectedQuickItemId((current) => {
      if (current && filteredQuickCurriculumItems.some((item) => item.id === current)) return current;
      return filteredQuickCurriculumItems[0]?.id ?? '';
    });
  }, [filteredQuickCurriculumItems]);

  useEffect(() => {
    setSelectedQuickAspect((current) => {
      if (!showQuickAspectField) return 'all';
      if (quickAspectOptions.some((option) => option.value === current)) return current;
      return 'all';
    });
  }, [quickAspectOptions, showQuickAspectField]);

  useEffect(() => {
    let active = true;

    async function loadSubjectPreference() {
      if (!subject.trim()) return;
      const savedValue = await getLessonsPerWeekForSubject(subject);
      if (!active) return;
      setSessionsPerWeekInput(savedValue || getDefaultLessonsPerWeekSubjectPreference(subject));
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
    if (planningMethod === 'quick' && !selectedQuickItem) {
      Alert.alert(
        'Curriculum focus required',
        'Please select the indicator or topic for the quick lesson.',
      );
      return;
    }
    if (planningMethod === 'scheme' && !selectedScheme) {
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
        selectedScheme: activeScheme as SchemeOfWork,
        planningMode: planningMethod,
        selectedCurriculumCode: planningMethod === 'quick' ? selectedQuickItem?.code : undefined,
        selectedCurriculumTopic: planningMethod === 'quick' ? selectedQuickItem?.topic : undefined,
        selectedIndicator: planningMethod === 'quick' ? selectedQuickItem?.indicator : undefined,
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
        shareLessonPlan(singlePlan, { activityFontSize: Number(pdfActivityFontSize) });
      } else {
        shareLessonPlans(generatedPlans, { activityFontSize: Number(pdfActivityFontSize) });
      }
    };
    const saveGeneratedPlansAsPdf = () => {
      if (singlePlan) {
        exportLessonPlanPdf(singlePlan, { activityFontSize: Number(pdfActivityFontSize) });
      } else {
        exportLessonPlansPdf(generatedPlans, { activityFontSize: Number(pdfActivityFontSize) });
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
            setPdfActivityFontSize(DEFAULT_PDF_ACTIVITY_FONT_SIZE);
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
        <View style={styles.pdfOptions}>
          <SelectField
            label="PDF activity font size"
            value={pdfActivityFontSize}
            options={PDF_ACTIVITY_FONT_SIZE_OPTIONS}
            onChange={setPdfActivityFontSize}
            compact
          />
        </View>
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
          <Text style={styles.sub}>Choose quick lesson for your own curriculum topic, or use an organized scheme of work.</Text>
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
          <View style={styles.coreFieldFull}>
            <SelectField
              label="Planning method"
              value={planningMethod}
              options={PLANNING_METHOD_OPTIONS}
              onChange={(value) => setPlanningMethod(value as PlanningMethod)}
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
          {planningMethod === 'quick' ? (
            <>
              {showQuickAspectField ? (
                <View style={styles.coreFieldCell}>
                  <SelectField
                    label="Aspect"
                    value={selectedQuickAspect}
                    options={quickAspectOptions}
                    onChange={setSelectedQuickAspect}
                  />
                </View>
              ) : null}
              <View style={showQuickAspectField ? styles.coreFieldCell : styles.coreFieldFull}>
                <SearchableCurriculumSelect
                  label="Indicator / Topic"
                  value={selectedQuickItemId}
                  items={filteredQuickCurriculumItems}
                  onChange={setSelectedQuickItemId}
                  placeholder="Search or select a curriculum topic"
                  helperText={
                    filteredQuickCurriculumItems.length
                      ? 'Search by keyword, topic, code, indicator, strand or exemplar.'
                      : showQuickAspectField
                        ? 'No curriculum topics are available for this aspect yet.'
                        : 'No mapped curriculum topics are available for this class and subject yet.'
                  }
                  disabled={!filteredQuickCurriculumItems.length}
                />
              </View>
            </>
          ) : null}
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

        <View style={styles.focusPreview}>
          <View style={styles.focusPreviewHeader}>
            <Text style={styles.focusPreviewTitle}>Weekly Lesson Focus</Text>
            <Text style={styles.focusPreviewMeta}>
              {lessonFocusPreview.weekFocus
                ? planningMethod === 'quick'
                  ? `Selected focus: ${lessonFocusPreview.weekFocus}`
                  : `Week focus: ${lessonFocusPreview.weekFocus}`
                : 'Preview based on the selected focus'}
            </Text>
          </View>
          {lessonFocusPreview.items.map((item) => {
            const active = sessionIndex === 'all' || sessionIndex === item.lessonNumber;
            return (
              <View key={item.lessonNumber} style={[styles.focusRow, active && styles.focusRowActive]}>
                <Text style={[styles.focusLesson, active && styles.focusLessonActive]}>
                  Lesson {item.lessonNumber}
                </Text>
                <Text style={styles.focusText}>{item.title}</Text>
              </View>
            );
          })}
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
            {planningMethod === 'quick'
              ? 'Using quick lesson topic'
              : selectedScheme
                ? 'Using selected term scheme'
                : 'No saved term scheme found'}
          </Text>
          <Text style={styles.schemeHintText}>
            {planningMethod === 'quick'
              ? sessionIndex === 'all'
                ? `${selectedQuickItem?.topic ?? 'Selected curriculum focus'} will generate all ${sessionsPerWeek} lessons and use ${formatCredits(generationCost)}.`
                : `${selectedQuickItem?.topic ?? 'Selected curriculum focus'} will generate Lesson ${sessionIndex} of ${sessionsPerWeek}.`
              : selectedScheme
                ? sessionIndex === 'all'
                  ? `${selectedScheme.subject} - ${selectedScheme.classLevel} - ${selectedScheme.term}. Week ${week || '?'} will generate all ${sessionsPerWeek} lessons and use ${formatCredits(generationCost)}.`
                  : `${selectedScheme.subject} - ${selectedScheme.classLevel} - ${selectedScheme.term}. Week ${week || '?'} will be grounded on that scheme for Lesson ${sessionIndex} of ${sessionsPerWeek}.`
                : 'Generate or select a scheme of work for this subject, class and term before using organized scheme mode.'}
          </Text>
        </View>

        {planningMethod === 'scheme' && matchingSchemes.length ? (
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
  pdfOptions: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
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
  coreFieldFull: {
    width: '100%',
    flexGrow: 0,
    flexShrink: 0,
    minWidth: 0,
  },
  searchSelectWrap: {
    marginBottom: spacing[6],
  },
  searchSelectLabel: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing[3],
  },
  searchSelectTrigger: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    minHeight: 64,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[4],
  },
  searchSelectTriggerDisabled: {
    opacity: 0.55,
  },
  searchSelectTriggerPressed: {
    borderColor: colors.primary,
  },
  searchSelectValue: {
    flex: 1,
    minWidth: 0,
    gap: spacing[1],
  },
  searchSelectValueTitle: {
    ...typography.bodyLg,
    color: colors.text,
    fontWeight: '400',
  },
  searchSelectPlaceholder: {
    color: colors.textSubtle,
  },
  searchSelectValueMeta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  searchSelectHelper: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing[3],
  },
  searchSelectOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    padding: spacing[6],
  },
  searchSelectSheet: {
    backgroundColor: colors.bgElevated,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: '82%',
    overflow: 'hidden',
    ...shadows.lg,
  },
  searchSelectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[6],
    paddingTop: spacing[6],
    paddingBottom: spacing[4],
  },
  searchSelectTitle: {
    ...typography.h4,
    color: colors.text,
  },
  searchSelectClose: {
    width: 32,
    height: 32,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  searchInputShell: {
    marginHorizontal: spacing[5],
    marginBottom: spacing[3],
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    minHeight: 46,
    paddingHorizontal: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing[3],
  },
  searchSelectList: {
    maxHeight: 500,
  },
  searchSelectListContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[5],
  },
  curriculumOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[4],
    borderRadius: radii.md,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    marginTop: spacing[2],
  },
  curriculumOptionRowActive: {
    backgroundColor: colors.primarySoft,
  },
  curriculumOptionRowPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  curriculumOptionTextWrap: {
    flex: 1,
    minWidth: 0,
    gap: spacing[1],
  },
  curriculumOptionTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  curriculumOptionTitleActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  curriculumOptionMeta: {
    ...typography.caption,
    color: colors.textMuted,
  },
  curriculumOptionAspect: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  searchEmptyState: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[8],
    alignItems: 'center',
    gap: spacing[2],
  },
  searchEmptyTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '700',
  },
  searchEmptyText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
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
  focusPreview: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing[5],
    gap: spacing[3],
    ...shadows.sm,
  },
  focusPreviewHeader: {
    gap: spacing[1],
  },
  focusPreviewTitle: {
    ...typography.h4,
    color: colors.text,
  },
  focusPreviewMeta: {
    ...typography.bodySm,
    color: colors.textMuted,
  },
  focusRow: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[1],
  },
  focusRowActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  focusLesson: {
    ...typography.label,
    color: colors.textMuted,
  },
  focusLessonActive: {
    color: colors.primary,
  },
  focusText: {
    ...typography.bodySm,
    color: colors.text,
    lineHeight: 18,
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

function buildQuickLessonItemsFromAvailableEntries(
  entries: CurriculumEntryOption[]
): QuickLessonCurriculumItem[] {
  return entries.map((entry, index) => {
    const topic = entry.topic || cleanQuickText(stripLeadingIndicatorCode(entry.indicator)) || 'Curriculum focus';
    const indicator = entry.indicator || entry.contentStandard || topic;
    const code = entry.indicatorCode || extractQuickIndicatorCode(indicator);
    const aspect = normalizeQuickAspectLabel(entry.strand || entry.subStrand);
    const searchText = [
      topic,
      indicator,
      code,
      aspect,
      entry.strand,
      entry.subStrand,
      entry.contentStandard,
      ...(entry.exemplars ?? []),
    ].filter(Boolean).join(' ');

    return {
      id: entry.id || [
        entry.sourceTerm,
        entry.sourceWeek,
        index,
        code || topic,
      ].map((value) => normalizeSearchText(String(value))).join('__'),
      topic,
      indicator,
      code,
      aspect,
      searchText,
      sourceTerm: entry.sourceTerm,
      sourceWeek: entry.sourceWeek,
      week: {
        week: entry.sourceWeek,
        strand: entry.strand,
        subStrand: entry.subStrand,
        contentStandard: entry.contentStandard,
        contentStandardCode: entry.contentStandardCode,
        indicatorCode: entry.indicatorCode || code,
        indicator,
        topic,
        resources: entry.resources,
        exemplars: entry.exemplars,
        sourcePage: entry.sourcePage,
        matchedCurriculumTerm: entry.sourceTerm,
        uploadedTopic: topic,
      },
    };
  });
}

function SearchableCurriculumSelect({
  label,
  value,
  items,
  placeholder,
  helperText,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  items: QuickLessonCurriculumItem[];
  placeholder: string;
  helperText?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selectedItem = useMemo(
    () => items.find((item) => item.id === value),
    [items, value],
  );
  const visibleItems = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) return items;
    const queryTokens = normalizedQuery.split(' ').filter(Boolean);
    return items.filter((item) => {
      const haystack = normalizeSearchText(item.searchText);
      return queryTokens.every((token) => haystack.includes(token));
    });
  }, [items, query]);

  return (
    <View style={styles.searchSelectWrap}>
      <Text style={styles.searchSelectLabel}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !!disabled, expanded: open }}
        disabled={disabled}
        onPress={() => {
          setQuery('');
          setOpen(true);
        }}
        style={({ pressed }) => [
          styles.searchSelectTrigger,
          disabled && styles.searchSelectTriggerDisabled,
          pressed && !disabled && styles.searchSelectTriggerPressed,
        ]}
      >
        <View style={styles.searchSelectValue}>
          <Text
            style={[styles.searchSelectValueTitle, !selectedItem && styles.searchSelectPlaceholder]}
            numberOfLines={1}
          >
            {selectedItem?.topic || placeholder}
          </Text>
          {selectedItem ? (
            <Text style={styles.searchSelectValueMeta} numberOfLines={1}>
              {formatCurriculumIndicatorMeta(selectedItem)}
            </Text>
          ) : null}
        </View>
        <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
      </Pressable>
      {helperText ? <Text style={styles.searchSelectHelper}>{helperText}</Text> : null}

      <Modal transparent animationType="fade" visible={open} onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.searchSelectOverlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.searchSelectSheet} onPress={() => undefined}>
            <View style={styles.searchSelectHeader}>
              <Text style={styles.searchSelectTitle}>{label}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={() => setOpen(false)}
                hitSlop={10}
                style={styles.searchSelectClose}
              >
                <Ionicons name="close" size={20} color={colors.textMuted} />
              </Pressable>
            </View>
            <View style={styles.searchInputShell}>
              <Ionicons name="search" size={18} color={colors.textMuted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Type a keyword"
                placeholderTextColor={colors.textSubtle}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.searchInput}
              />
              {query ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Clear search"
                  onPress={() => setQuery('')}
                  hitSlop={8}
                >
                  <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                </Pressable>
              ) : null}
            </View>
            <ScrollView
              style={styles.searchSelectList}
              contentContainerStyle={styles.searchSelectListContent}
              keyboardShouldPersistTaps="handled"
            >
              {visibleItems.length ? (
                visibleItems.map((item) => {
                  const active = item.id === value;
                  return (
                    <Pressable
                      key={item.id}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      onPress={() => {
                        onChange(item.id);
                        setOpen(false);
                      }}
                      style={({ pressed }) => [
                        styles.curriculumOptionRow,
                        active && styles.curriculumOptionRowActive,
                        pressed && styles.curriculumOptionRowPressed,
                      ]}
                    >
                      <View style={styles.curriculumOptionTextWrap}>
                        <Text style={[styles.curriculumOptionTitle, active && styles.curriculumOptionTitleActive]} numberOfLines={2}>
                          {item.topic}
                        </Text>
                        <Text style={styles.curriculumOptionMeta} numberOfLines={3}>
                          {formatCurriculumIndicatorMeta(item)}
                        </Text>
                        {item.aspect ? (
                          <Text style={styles.curriculumOptionAspect} numberOfLines={1}>
                            {item.aspect}
                          </Text>
                        ) : null}
                      </View>
                      {active ? <Ionicons name="checkmark" size={18} color={colors.primary} /> : null}
                    </Pressable>
                  );
                })
              ) : (
                <View style={styles.searchEmptyState}>
                  <Text style={styles.searchEmptyTitle}>No matching curriculum focus</Text>
                  <Text style={styles.searchEmptyText}>Try another keyword from the topic, indicator or exemplar.</Text>
                </View>
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function buildQuickLessonScheme({
  item,
  subject,
  classLevel,
  term,
  week,
}: {
  item: QuickLessonCurriculumItem;
  subject: string;
  classLevel: ClassLevel;
  term: string;
  week: number;
}): SchemeOfWork {
  const selectedWeek = {
    ...item.week,
    week,
    topic: item.topic,
    indicator: item.indicator,
    matchedCurriculumTerm: item.sourceTerm,
    uploadedTopic: item.topic,
  };

  return {
    id: `quick-${classLevel}-${subject}-${item.id}`,
    title: `Quick lesson - ${item.topic}`,
    subject,
    classLevel,
    term,
    source: 'mapped',
    weeks: [selectedWeek],
    createdAt: new Date().toISOString(),
  };
}

function isQuickLanguageSubject(subject: string) {
  const normalized = subject.trim().toLowerCase();
  return normalized.includes('english') ||
    normalized.includes('ghanaian language') ||
    normalized.includes('gha language') ||
    normalized.includes('gha. language');
}

function buildQuickAspectOptions(items: QuickLessonCurriculumItem[]) {
  const aspects = uniqueValues(items.map((item) => item.aspect).filter(Boolean) as string[]);
  return [
    { label: 'All aspects', value: 'all' },
    ...aspects.map((aspect) => ({ label: aspect, value: aspect })),
  ];
}

function formatCurriculumIndicatorMeta(item: QuickLessonCurriculumItem) {
  const indicator = cleanQuickText(item.indicator);
  if (!item.code) return indicator;
  if (indicator.toLowerCase().startsWith(item.code.toLowerCase())) return indicator;
  return `${item.code} ${indicator}`;
}

function normalizeQuickAspectLabel(value?: string) {
  const text = cleanQuickText(value);
  if (!text) return undefined;
  const normalized = text.toLowerCase();
  if (normalized.includes('oral') || normalized.includes('speaking') || normalized.includes('listening') || normalized.includes('conversation')) {
    return 'Oral Language';
  }
  if (normalized.includes('grammar') || normalized.includes('language and usage') || normalized.includes('convention')) {
    return 'Grammar';
  }
  if (normalized.includes('writing') || normalized.includes('composition')) return 'Writing';
  if (normalized.includes('literature')) return 'Literature';
  if (normalized.includes('reading') || normalized.includes('comprehension') || normalized.includes('phonics')) return 'Reading';
  return text;
}

function extractQuickIndicatorCode(value?: string) {
  return value?.match(/B[1-9](?:\/JHS[1-3])?(?:\.\d+){3,4}/)?.[0];
}

function stripLeadingIndicatorCode(value?: string) {
  return cleanQuickText(value).replace(/^B[1-9](?:\/JHS[1-3])?(?:\.\d+){3,4}\s*/, '').trim();
}

function cleanQuickText(value?: string) {
  return (value ?? '').trim();
}

function normalizeSearchText(value?: string) {
  return (value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function uniqueValues(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  values.forEach((value) => {
    const cleaned = value.trim();
    const key = cleaned.toLowerCase();
    if (!cleaned || seen.has(key)) return;
    seen.add(key);
    result.push(cleaned);
  });
  return result;
}

function buildLessonFocusPreview({
  subject,
  classLevel,
  selectedWeek,
  weeks,
  sessionsPerWeek,
}: {
  subject: string;
  classLevel: ClassLevel;
  selectedWeek?: SchemeOfWork['weeks'][number];
  weeks?: SchemeOfWork['weeks'];
  sessionsPerWeek: number;
}) {
  const weekFocus = selectedWeek ? getWeekTopic(selectedWeek) : '';
  const guidance = buildWeeklyLessonAssignments({
    subject,
    classLevel,
    selectedWeek,
    weeks,
    sessionIndex: 1,
    sessionsPerWeek,
  });
  const fallbackItems = buildFallbackLessonFocusItems(sessionsPerWeek, weekFocus);
  const items = Array.from({ length: sessionsPerWeek }, (_, index) => {
    const assignment = guidance?.assignments?.[index];
    return {
      lessonNumber: index + 1,
      title: assignment?.title ? sentenceCase(truncateFocusLabel(assignment.title)) : fallbackItems[index],
    };
  });

  return { weekFocus, items };
}

function buildFallbackLessonFocusItems(lessonCount: number, weekFocus?: string) {
  const focus = weekFocus || 'the weekly focus';
  const base = [
    `Introduce ${focus}`,
    `Guided practice and application on ${focus}`,
    `Independent practice, assessment and correction on ${focus}`,
    `Consolidation, remediation and enrichment across ${focus}`,
  ];
  return base.slice(0, lessonCount);
}

function formatLessonFocusLabel(rawFocus: string, index: number, lessonCount: number, weekFocus?: string) {
  const focus = weekFocus || 'the week focus';
  if (/optional fourth lesson/i.test(rawFocus)) {
    return `Consolidation, remediation and enrichment across ${focus}`;
  }

  let text = rawFocus
    .replace(/\s+/g, ' ')
    .replace(/^Always begin from the assigned indicator:.*?not as a separate (?:weekly topic|unrelated weekly topic):/i, '')
    .replace(/^Always begin from the assigned indicator:.*?guidance:/i, '')
    .trim();

  text = extractBetween(text, /Teach now:\s*/i, /\s+(?:Review only|Do not teach yet|If the assigned indicator)/i) || text;
  text =
    extractBetween(text, /Lesson-only exemplars:\s*/i, /\s+(?:Review only|Do not teach yet|If the assigned indicator)/i) ||
    extractBetween(text, /Exemplars for this lesson only:\s*/i, /\s+(?:Review only|Do not teach yet|If the assigned indicator)/i) ||
    text;
  text = text.replace(/Assigned indicator:\s*(?:B[1-9](?:\/JHS[1-3])?(?:\.\d+){4}\s*)?/gi, '');
  text = text.replace(/Use only the activities implied by this assigned indicator\.?/gi, focus);
  text = text.replace(/\s+(?:Review only|Do not teach yet|If the assigned indicator).*$/i, '');
  text = text.replace(/\s+/g, ' ').trim();

  if (!text || text.length < 8) return buildFallbackLessonFocusItems(lessonCount, weekFocus)[index];
  return sentenceCase(truncateFocusLabel(text));
}

function extractBetween(value: string, start: RegExp, end: RegExp) {
  const startMatch = value.match(start);
  if (!startMatch || startMatch.index === undefined) return '';
  const startIndex = startMatch.index + startMatch[0].length;
  const rest = value.slice(startIndex);
  const endMatch = rest.match(end);
  return (endMatch?.index === undefined ? rest : rest.slice(0, endMatch.index)).trim();
}

function truncateFocusLabel(value: string) {
  if (value.length <= 120) return value;
  const shortened = value.slice(0, 117).replace(/\s+\S*$/, '');
  return `${shortened}...`;
}

function sentenceCase(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function isGhanaianLanguageSubject(subject?: string) {
  return subject?.trim().toLowerCase() === 'ghanaian language';
}

