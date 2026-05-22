import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from '@/components/Button';
import { shareLesson } from '@/lib/shareStore';
import { colors, radii, shadows, spacing, typography } from '@/theme/colors';
import type { LessonPlanBundle, SavedLessonWork } from '@/types/lessonPlan';

interface ShareWithAdminModalProps {
  isOpen: boolean;
  lessonId: string;
  lessonData: SavedLessonWork;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ShareWithAdminModal({
  isOpen,
  lessonId,
  lessonData,
  onClose,
  onSuccess,
}: ShareWithAdminModalProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleShare() {
    if (!message.trim()) {
      setError('Tell admin what you want reviewed before sending.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await shareLesson(lessonId, lessonData, message.trim());
      onSuccess();
      setMessage('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share lesson');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal transparent animationType="fade" visible={isOpen} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => undefined}>
          <View style={styles.header}>
            <View style={styles.iconBadge}>
              <Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Share with Admin</Text>
              <Text style={styles.subtitle}>Send this lesson plan with a clear complaint or review request.</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={18} color={colors.textMuted} />
            </Pressable>
          </View>

          <View style={styles.lessonSummary}>
            <Text style={styles.summaryLabel}>Snapshot</Text>
            <Text style={styles.summaryTitle}>
              {isLessonBundle(lessonData)
                ? lessonData.title
                : `${lessonData.subject} ${lessonData.classLevel} Week ${lessonData.week}`}
            </Text>
          </View>

          <Text style={styles.label}>Complaint or request</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Example: Please check whether the activities and assessment match the indicator."
            placeholderTextColor={colors.textSubtle}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.actions}>
            <Button title="Cancel" variant="ghost" onPress={onClose} disabled={isLoading} style={styles.actionButton} />
            <Button title="Send to admin" icon="send-outline" onPress={handleShare} loading={isLoading} style={styles.actionButton} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
  },
  sheet: {
    width: '100%',
    maxWidth: 560,
    backgroundColor: colors.bgElevated,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing[6],
    gap: spacing[5],
    ...shadows.lg,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing[4] },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  title: { ...typography.h3, color: colors.text },
  subtitle: { ...typography.bodySm, color: colors.textMuted, marginTop: spacing[1] },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  lessonSummary: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.md,
    padding: spacing[4],
    backgroundColor: colors.surface,
  },
  summaryLabel: { ...typography.eyebrow, color: colors.primary, marginBottom: spacing[1] },
  summaryTitle: { ...typography.label, color: colors.text },
  label: { ...typography.label, color: colors.text },
  input: {
    minHeight: 130,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    ...typography.body,
    color: colors.text,
  },
  error: { ...typography.bodySm, color: colors.danger },
  actions: { flexDirection: 'row', gap: spacing[4], flexWrap: 'wrap' },
  actionButton: { flex: 1, minWidth: 140 },
});

function isLessonBundle(work: SavedLessonWork): work is LessonPlanBundle {
  return 'kind' in work && work.kind === 'bundle';
}
