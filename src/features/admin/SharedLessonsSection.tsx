import { useState } from 'react';
import { Text, View } from 'react-native';
import SharedLessonsList from '@/components/SharedLessonsList';
import AdminLessonReview from '@/components/AdminLessonReview';
import { styles } from './adminStyles';
import type { AdminLessonShare } from '@/types/lessonPlan';

export function SharedLessonsSection() {
  const [selectedShare, setSelectedShare] = useState<AdminLessonShare | null>(null);

  if (selectedShare) {
    return (
      <View style={styles.adminSection}>
        <AdminLessonReview
          share={selectedShare}
          onFeedbackUpdated={(updated) => setSelectedShare(updated)}
          onBack={() => setSelectedShare(null)}
        />
      </View>
    );
  }

  return (
    <View style={styles.adminSection}>
      <Text style={styles.heading}>Shared Lessons</Text>
      <Text style={styles.adminSubtitle}>
        Teachers can share lessons here for your feedback and suggestions
      </Text>
      <SharedLessonsList onSelectShare={setSelectedShare} />
    </View>
  );
}
