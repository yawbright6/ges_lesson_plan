import { Ionicons } from '@expo/vector-icons';
import type React from 'react';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { colors, radii, shadows, spacing, typography } from '@/theme/colors';

type PreviewIcon = ComponentProps<typeof Ionicons>['name'];

export function PreviewHeader({
  title,
  subtitle,
  onBack,
  onShare,
  onDelete,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
  onShare?: () => void;
  onDelete?: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + spacing[3] }]}>
      <PreviewIconButton icon="arrow-back" label="Back" onPress={onBack} />
      <View style={styles.titleWrap}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.headerActions}>
        {onDelete ? <PreviewIconButton icon="trash-outline" label="Delete" onPress={onDelete} tone="danger" /> : null}
        {onShare ? <PreviewIconButton icon="share-social-outline" label="Share" onPress={onShare} /> : null}
        {!onShare && !onDelete ? <View style={styles.spacer} /> : null}
      </View>
    </View>
  );
}

export function PreviewActions({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.actionsShell, { paddingBottom: insets.bottom + spacing[4] }]}>
      <View style={styles.actions}>{children}</View>
    </View>
  );
}

export function PreviewActionButton({
  title,
  onPress,
  variant,
  loading,
  icon,
  span = 'half',
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
  loading?: boolean;
  icon?: PreviewIcon;
  span?: 'half' | 'full';
}) {
  return (
    <Button
      title={title}
      onPress={onPress}
      variant={variant}
      loading={loading}
      icon={icon}
      size="small"
      style={[styles.actionButton, span === 'full' && styles.actionButtonFull]}
      textStyle={styles.actionButtonText}
    />
  );
}

function PreviewIconButton({
  icon,
  label,
  onPress,
  tone,
}: {
  icon: PreviewIcon;
  label: string;
  onPress: () => void;
  tone?: 'default' | 'danger';
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [styles.iconButton, tone === 'danger' && styles.iconButtonDanger, pressed && styles.iconButtonPressed]}
    >
      <Ionicons name={icon} size={20} color={colors.textOnPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 56,
    backgroundColor: colors.primaryDark,
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[4],
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing[2],
    minWidth: 38,
    justifyContent: 'flex-end',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  iconButtonPressed: { opacity: 0.7 },
  iconButtonDanger: { backgroundColor: 'rgba(220,38,38,0.24)' },
  headerTitle: {
    ...typography.h4,
    color: colors.textOnPrimary,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerSubtitle: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.78)',
    textAlign: 'center',
    marginTop: 2,
  },
  spacer: { width: 38 },
  actionsShell: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bgElevated,
    ...shadows.sm,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  actionButton: {
    flexBasis: '48%',
    flexGrow: 1,
    minHeight: 38,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  actionButtonFull: {
    flexBasis: '100%',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
