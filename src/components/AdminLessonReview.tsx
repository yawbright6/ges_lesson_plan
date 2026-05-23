import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { reportClientError } from '@/lib/logger';
import { updateShareFeedback } from '@/lib/shareStore';
import { LessonPlanStack, LessonPlanTable } from '@/components/LessonPlanTable';
import { Button } from '@/components/Button';
import { colors, radii, spacing, typography } from '@/theme/colors';
import type { AdminLessonShare, LessonPlanBundle, SavedLessonWork } from '@/types/lessonPlan';

interface AdminLessonReviewProps {
  share: AdminLessonShare;
  onFeedbackUpdated: (updatedShare: AdminLessonShare) => void;
  onBack: () => void;
}

export default function AdminLessonReview({ share, onFeedbackUpdated, onBack }: AdminLessonReviewProps) {
  const [feedback, setFeedback] = useState(share.admin_feedback || '');
  const [isEditing, setIsEditing] = useState(!share.admin_feedback);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    try {
      setIsSaving(true);
      setError(null);
      const updated = await updateShareFeedback(share.id, feedback.trim());
      onFeedbackUpdated({ ...share, ...updated });
      setIsEditing(false);
    } catch (err) {
      reportClientError('admin_save_lesson_feedback', err, { shareId: share.id });
      setError(err instanceof Error ? err.message : 'Failed to save feedback');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View style={styles.stack}>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={18} color={colors.primary} />
        <Text style={styles.backText}>Back to shared lessons</Text>
      </Pressable>

      <View style={styles.infoPanel}>
        <View style={styles.infoHeader}>
          <View style={styles.teacherBadge}>
            <Ionicons name="person-outline" size={20} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.teacher}>{share.teacher_name || share.teacher_email || 'Teacher'}</Text>
            <Text style={styles.meta}>{formatDate(share.shared_at)}</Text>
          </View>
        </View>
        {share.teacher_message ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageLabel}>Teacher request</Text>
            <Text style={styles.messageText}>{share.teacher_message}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Lesson Snapshot</Text>
        <View style={styles.lessonFrame}>
          {isLessonBundle(share.lesson_data) ? (
            <LessonPlanStack plans={share.lesson_data.plans} />
          ) : (
            <LessonPlanTable plan={share.lesson_data} />
          )}
        </View>
      </View>

      <View style={styles.panel}>
        <View style={styles.feedbackHeader}>
          <Text style={styles.panelTitle}>Admin Feedback</Text>
          {share.admin_feedback && !isEditing ? (
            <Pressable style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Ionicons name="create-outline" size={16} color={colors.primary} />
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          ) : null}
        </View>

        {isEditing ? (
          <View style={styles.stack}>
            <TextInput
              value={feedback}
              onChangeText={setFeedback}
              placeholder="Share your feedback and suggestions for improvement..."
              placeholderTextColor={colors.textSubtle}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              style={styles.input}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.actionRow}>
              {share.admin_feedback ? (
                <Button
                  title="Cancel"
                  variant="ghost"
                  onPress={() => {
                    setFeedback(share.admin_feedback || '');
                    setIsEditing(false);
                  }}
                  disabled={isSaving}
                  style={styles.actionButton}
                />
              ) : null}
              <Button
                title="Save feedback"
                icon="checkmark-outline"
                onPress={handleSave}
                loading={isSaving}
                disabled={!feedback.trim()}
                style={styles.actionButton}
              />
            </View>
          </View>
        ) : feedback ? (
          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackText}>{feedback}</Text>
            {share.feedback_updated_at ? <Text style={styles.meta}>Updated {formatDate(share.feedback_updated_at).replace('Shared ', '')}</Text> : null}
          </View>
        ) : (
          <Text style={styles.emptyText}>No feedback provided yet.</Text>
        )}
      </View>
    </View>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Shared recently';
  return `Shared ${date.toLocaleDateString()}`;
}

function isLessonBundle(work: SavedLessonWork): work is LessonPlanBundle {
  return 'kind' in work && work.kind === 'bundle';
}

const styles = StyleSheet.create({
  stack: { gap: spacing[4] },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: spacing[2], alignSelf: 'flex-start' },
  backText: { ...typography.label, color: colors.primary },
  infoPanel: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing[4],
    backgroundColor: colors.bgElevated,
    gap: spacing[3],
  },
  infoHeader: { flexDirection: 'row', gap: spacing[3], alignItems: 'center' },
  teacherBadge: {
    width: 42,
    height: 42,
    borderRadius: radii.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teacher: { ...typography.h4, color: colors.text },
  meta: { ...typography.bodySm, color: colors.textMuted, marginTop: 2 },
  messageBox: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing[3],
  },
  messageLabel: { ...typography.eyebrow, color: colors.primary, marginBottom: spacing[1] },
  messageText: { ...typography.body, color: colors.text, lineHeight: 21 },
  panel: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing[4],
    backgroundColor: colors.bgElevated,
    gap: spacing[3],
  },
  panelTitle: { ...typography.h4, color: colors.text },
  lessonFrame: {
    maxHeight: 540,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] },
  editButton: { flexDirection: 'row', alignItems: 'center', gap: spacing[1] },
  editText: { ...typography.label, color: colors.primary },
  input: {
    minHeight: 150,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    ...typography.body,
    color: colors.text,
  },
  error: { ...typography.bodySm, color: colors.danger },
  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[3], justifyContent: 'flex-end' },
  actionButton: { minWidth: 150 },
  feedbackBox: {
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: radii.md,
    backgroundColor: colors.successSoft,
    padding: spacing[4],
  },
  feedbackText: { ...typography.body, color: colors.text, lineHeight: 21 },
  emptyText: { ...typography.bodySm, color: colors.textMuted },
});
