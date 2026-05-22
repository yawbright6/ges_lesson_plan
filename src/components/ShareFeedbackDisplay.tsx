import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme/colors';
import type { LessonShare } from '@/types/lessonPlan';

interface ShareFeedbackDisplayProps {
  share: LessonShare;
}

export default function ShareFeedbackDisplay({ share }: ShareFeedbackDisplayProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.statusRow}>
        <View style={styles.statusIcon}>
          <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.statusTitle}>Shared with Admin</Text>
          <Text style={styles.statusMeta}>Sent {formatRelativeDate(share.shared_at)}</Text>
        </View>
      </View>

      {share.teacher_message ? (
        <View style={styles.messageBox}>
          <Text style={styles.boxLabel}>Teacher request</Text>
          <Text style={styles.boxText}>{share.teacher_message}</Text>
        </View>
      ) : null}

      {share.admin_feedback ? (
        <View style={[styles.messageBox, styles.feedbackBox]}>
          <View style={styles.feedbackHeader}>
            <Text style={styles.boxLabel}>Admin feedback</Text>
            {share.feedback_updated_at ? (
              <Text style={styles.statusMeta}>{formatRelativeDate(share.feedback_updated_at)}</Text>
            ) : null}
          </View>
          <Text style={styles.boxText}>{share.admin_feedback}</Text>
        </View>
      ) : null}
    </View>
  );
}

function formatRelativeDate(value?: string | null) {
  if (!value) return 'recently';
  const timestamp = new Date(value).getTime();
  if (!timestamp) return 'recently';
  const diffMs = Date.now() - timestamp;
  const minutes = Math.max(1, Math.round(diffMs / 60000));
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

const styles = StyleSheet.create({
  wrap: {
    margin: spacing[5],
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    padding: spacing[5],
    gap: spacing[4],
  },
  statusRow: { flexDirection: 'row', gap: spacing[4], alignItems: 'center' },
  statusIcon: {
    width: 38,
    height: 38,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  statusTitle: { ...typography.h4, color: colors.text },
  statusMeta: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  messageBox: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.md,
    padding: spacing[4],
    backgroundColor: colors.bgElevated,
  },
  feedbackBox: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing[3] },
  boxLabel: { ...typography.eyebrow, color: colors.primary, marginBottom: spacing[2] },
  boxText: { ...typography.bodySm, color: colors.text, lineHeight: 20 },
});
