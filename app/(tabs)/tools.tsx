import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radii, shadows, spacing, typography } from '@/theme/colors';

const tools = [
  {
    title: 'Lesson Plan',
    description: 'Create NaCCA/GES lesson plans from a saved scheme.',
    icon: 'sparkles-outline' as const,
    route: '/(tabs)/tools/lesson-plan',
    tone: 'primary' as const,
  },
  {
    title: 'Scheme of Work',
    description: 'Generate or analyse a termly scheme.',
    icon: 'document-text-outline' as const,
    route: '/(tabs)/tools/scheme',
    tone: 'accent' as const,
  },
  {
    title: 'Scheme Builder',
    description: 'Build a scheme week by week from mapped curriculum.',
    icon: 'calendar-outline' as const,
    route: '/(tabs)/tools/scheme-builder',
    tone: 'primary' as const,
  },
  {
    title: 'Teaching Notes',
    description: 'Generate comprehensive notes from a saved lesson plan.',
    icon: 'reader-outline' as const,
    route: '/(tabs)/tools/teaching-notes',
    tone: 'accent' as const,
  },
  {
    title: 'Test Item Compiler',
    description: 'Compile assessment prompts into question banks and test papers.',
    icon: 'list-circle-outline' as const,
    route: '/(tabs)/tools/test-item-compiler',
    tone: 'primary' as const,
  },
];

export default function ToolsLauncherScreen() {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setVisible(true);
    }, []),
  );

  function closeLauncher() {
    setVisible(false);
    requestAnimationFrame(() => router.replace('/(tabs)/library'));
  }

  function openTool(route: string) {
    setVisible(false);
    requestAnimationFrame(() => router.push(route));
  }

  return (
    <View style={styles.screen}>
      <Modal visible={visible} transparent animationType="slide" onRequestClose={closeLauncher}>
        <Pressable style={styles.backdrop} onPress={closeLauncher}>
          <Pressable
            style={[styles.sheet, { paddingBottom: insets.bottom + spacing[6] }]}
            onPress={() => undefined}
          >
            <View style={styles.handle} />
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.eyebrow}>Create</Text>
                <Text style={styles.title}>Pick a tool</Text>
                <Text style={styles.sub}>What would you like to create today?</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
                onPress={closeLauncher}
                hitSlop={6}
              >
                <Ionicons name="close" size={22} color={colors.text} />
              </Pressable>
            </View>
            <ScrollView
              style={styles.toolList}
              contentContainerStyle={styles.toolListContent}
              showsVerticalScrollIndicator={false}
            >
              {tools.map((tool) => (
                <Pressable
                  key={tool.title}
                  accessibilityRole="button"
                  accessibilityLabel={tool.title}
                  style={({ pressed }) => [styles.toolRow, pressed && styles.toolRowPressed]}
                  onPress={() => openTool(tool.route)}
                >
                  <View
                    style={[
                      styles.iconBox,
                      tool.tone === 'accent' ? styles.iconBoxAccent : styles.iconBoxPrimary,
                    ]}
                  >
                    <Ionicons
                      name={tool.icon}
                      size={22}
                      color={tool.tone === 'accent' ? colors.accentOn : colors.primary}
                    />
                  </View>
                  <View style={styles.toolText}>
                    <Text style={styles.toolTitle}>{tool.title}</Text>
                    <Text style={styles.toolDescription}>{tool.description}</Text>
                  </View>
                  <View style={styles.chevron}>
                    <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.overlay },
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '92%',
    backgroundColor: colors.bgElevated,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    paddingBottom: Platform.OS === 'ios' ? spacing[8] : spacing[6],
    ...shadows.lg,
  },
  handle: {
    alignSelf: 'center',
    width: 48,
    height: 5,
    borderRadius: radii.pill,
    backgroundColor: colors.borderStrong,
    marginBottom: spacing[5],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing[6],
    gap: spacing[4],
  },
  eyebrow: {
    ...typography.eyebrow,
    color: colors.primary,
    marginBottom: spacing[2],
  },
  title: { ...typography.h2, color: colors.text },
  sub: { ...typography.body, color: colors.textMuted, marginTop: spacing[2] },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  pressed: { opacity: 0.78 },
  toolList: { maxHeight: 520 },
  toolListContent: { gap: spacing[3], paddingBottom: spacing[2] },
  toolRow: {
    minHeight: 74,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[4],
    backgroundColor: colors.bgElevated,
  },
  toolRowPressed: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxPrimary: { backgroundColor: colors.primarySoft },
  iconBoxAccent: { backgroundColor: colors.accent },
  toolText: { flex: 1 },
  toolTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: 2,
  },
  toolDescription: {
    ...typography.bodySm,
    color: colors.textMuted,
    lineHeight: 19,
  },
  chevron: {
    width: 28,
    height: 28,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
});
