import { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { PreviewActionButton, PreviewActions, PreviewHeader } from '@/components/PreviewChrome';
import { TeachingNotesView } from '@/components/TeachingNotesView';
import { useToast } from '@/components/ToastProvider';
import { deleteTeachingNotes, getTeachingNotesById } from '@/lib/teachingNotesStore';
import { exportTeachingNotesPdf } from '@/lib/export';
import { goBackOrReplace } from '@/lib/navigation';
import { colors } from '@/theme/colors';
import type { TeachingNotes } from '@/types/teachingNotes';

export default function TeachingNoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showToast } = useToast();
  const [notes, setNotes] = useState<TeachingNotes | null>(null);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setNotes(await getTeachingNotesById(id));
    }
    load();
  }, [id]);

  if (!notes) {
    return (
      <View style={styles.container}>
        <Button title="Teaching notes not found" variant="secondary" onPress={() => goBackOrReplace()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PreviewHeader
        title="Teaching Notes"
        onBack={() => goBackOrReplace()}
        onShare={() => exportTeachingNotesPdf(notes)}
      />
      <TeachingNotesView notes={notes} />
      <PreviewActions>
        <PreviewActionButton title="PDF" icon="document-text-outline" onPress={() => exportTeachingNotesPdf(notes)} />
        <PreviewActionButton
          title="Delete"
          variant="danger"
          onPress={async () => {
            const confirmed = await confirmRemoval('Delete teaching notes', `Delete ${notes.title}?`);
            if (!confirmed || !notes.id) return;
            await deleteTeachingNotes(notes.id);
            showToast({ message: 'Teaching notes deleted.' });
            goBackOrReplace();
          }}
        />
      </PreviewActions>
    </View>
  );
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
});
