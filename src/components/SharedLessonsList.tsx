import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { loadSharedLessonsForAdmin } from '@/lib/shareStore';
import { colors, radii, spacing, typography } from '@/theme/colors';
import type { AdminLessonShare, LessonPlanBundle, SavedLessonWork } from '@/types/lessonPlan';

interface SharedLessonsListProps {
  onSelectShare: (share: AdminLessonShare) => void;
}

export default function SharedLessonsList({ onSelectShare }: SharedLessonsListProps) {
  const [shares, setShares] = useState<AdminLessonShare[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'no-feedback'>('all');

  const loadShares = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setShares(await loadSharedLessonsForAdmin());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load shared lessons');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadShares();
    }, [loadShares]),
  );

  const filteredShares = shares.filter((share) => (filter === 'no-feedback' ? !share.admin_feedback : true));

  if (isLoading) {
    return (
      <View style={styles.emptyBox}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.emptyText}>Loading shared lessons...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.emptyBox, styles.errorBox]}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryButton} onPress={loadShares}>
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.stack}>
      <View style={styles.filterRow}>
        <FilterButton title="All" active={filter === 'all'} onPress={() => setFilter('all')} />
        <FilterButton title="Awaiting feedback" active={filter === 'no-feedback'} onPress={() => setFilter('no-feedback')} />
      </View>

      {filteredShares.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="file-tray-outline" size={24} color={colors.textMuted} />
          <Text style={styles.emptyText}>
            {filter === 'no-feedback' ? 'No lessons awaiting feedback.' : 'No lessons have been shared yet.'}
          </Text>
        </View>
      ) : (
        filteredShares.map((share) => (
          <Pressable key={share.id} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]} onPress={() => onSelectShare(share)}>
            <View style={styles.cardTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.teacher}>{share.teacher_name || share.teacher_email || 'Teacher'}</Text>
                <Text style={styles.meta}>{getSubjectAndClass(share)}</Text>
              </View>
              <StatusPill done={Boolean(share.admin_feedback)} />
            </View>
            <Text style={styles.lessonTitle}>{getLessonTitle(share)}</Text>
            {share.teacher_message ? <Text style={styles.message} numberOfLines={2}>{share.teacher_message}</Text> : null}
            <View style={styles.cardFooter}>
              <Text style={styles.date}>{formatDate(share.shared_at)}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.primary} />
            </View>
          </Pressable>
        ))
      )}
    </View>
  );
}

function FilterButton({ title, active, onPress }: { title: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.filterButton, active && styles.filterButtonActive]} onPress={onPress}>
      <Text style={[styles.filterText, active && styles.filterTextActive]}>{title}</Text>
    </Pressable>
  );
}

function StatusPill({ done }: { done: boolean }) {
  return (
    <View style={[styles.statusPill, done ? styles.statusDone : styles.statusWaiting]}>
      <Text style={[styles.statusText, done ? styles.statusDoneText : styles.statusWaitingText]}>
        {done ? 'Feedback sent' : 'Awaiting feedback'}
      </Text>
    </View>
  );
}

function getSubjectAndClass(share: AdminLessonShare) {
  return `${share.lesson_data.subject} ${share.lesson_data.classLevel || ''}`.trim();
}

function getLessonTitle(share: AdminLessonShare) {
  const lesson = share.lesson_data;
  if (isLessonBundle(lesson)) return `${lesson.title} (${lesson.lessonCount} lessons)`;
  return lesson.topic || lesson.performanceIndicator || `Week ${lesson.week} Lesson`;
}

function isLessonBundle(work: SavedLessonWork): work is LessonPlanBundle {
  return 'kind' in work && work.kind === 'bundle';
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Shared recently';
  return `Shared ${date.toLocaleDateString()}`;
}

const styles = StyleSheet.create({
  stack: { gap: spacing[3] },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], marginBottom: spacing[1] },
  filterButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    backgroundColor: colors.surface,
  },
  filterButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { ...typography.label, color: colors.primaryDark },
  filterTextActive: { color: colors.textOnPrimary },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing[4],
    backgroundColor: colors.bgElevated,
    gap: spacing[2],
  },
  cardPressed: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  cardTop: { flexDirection: 'row', gap: spacing[3], alignItems: 'flex-start' },
  teacher: { ...typography.h4, color: colors.text },
  meta: { ...typography.bodySm, color: colors.textMuted, marginTop: 2 },
  lessonTitle: { ...typography.label, color: colors.text },
  message: { ...typography.bodySm, color: colors.textMuted, lineHeight: 19 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { ...typography.bodySm, color: colors.textSubtle },
  statusPill: { borderRadius: radii.pill, paddingHorizontal: spacing[3], paddingVertical: spacing[1] },
  statusDone: { backgroundColor: colors.successSoft },
  statusWaiting: { backgroundColor: colors.accentSoft },
  statusText: { fontSize: 11, fontWeight: '800' },
  statusDoneText: { color: colors.success },
  statusWaitingText: { color: colors.accentOn },
  emptyBox: {
    minHeight: 140,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[5],
    gap: spacing[2],
    backgroundColor: colors.surface,
  },
  emptyText: { ...typography.bodySm, color: colors.textMuted, textAlign: 'center' },
  errorBox: { borderColor: colors.danger },
  errorText: { ...typography.bodySm, color: colors.danger, textAlign: 'center' },
  retryButton: { paddingHorizontal: spacing[4], paddingVertical: spacing[2] },
  retryText: { ...typography.label, color: colors.primary },
});
