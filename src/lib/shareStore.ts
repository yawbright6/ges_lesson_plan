import { supabase } from './supabase';
import { cachedRequest, invalidateCache } from './cache';
import { withTimeout } from './async';
import { getCurrentUserId } from './generatedStore';
import type { AdminLessonShare, LessonShare, SavedLessonWork } from '@/types/lessonPlan';

const CACHE_PREFIX = 'lesson-shares';

/**
 * Share a lesson plan with admin for feedback/suggestions.
 * Creates a snapshot of the lesson at time of share.
 */
export async function shareLesson(
  lessonId: string,
  lessonData: SavedLessonWork,
  teacherMessage?: string
): Promise<LessonShare> {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Must be logged in to share lessons');

  const { data, error } = await withTimeout(
    supabase
      .from('lesson_shares')
      .insert({
        lesson_id: lessonId,
        teacher_id: userId,
        lesson_data: lessonData,
        teacher_message: teacherMessage || null,
      })
      .select()
      .single(),
    10000,
    'Failed to share lesson with admin'
  );

  if (error) throw error;
  if (!data) throw new Error('No data returned from share');

  invalidateCache(`${CACHE_PREFIX}:teacher:${userId}`);
  invalidateCache(`${CACHE_PREFIX}:admin`);

  return data as LessonShare;
}

/**
 * Load all lessons this teacher has shared with admin.
 */
export async function loadSharedLessons(): Promise<LessonShare[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  return cachedRequest(`${CACHE_PREFIX}:teacher:${userId}`, async () => {
    const { data, error } = await withTimeout(
      supabase
        .from('lesson_shares')
        .select('*')
        .eq('teacher_id', userId)
        .order('shared_at', { ascending: false }),
      10000,
      'Failed to load your shared lessons'
    );

    if (error) throw error;
    return (data ?? []) as LessonShare[];
  });
}

/**
 * Load a specific share by ID (for viewing/editing feedback).
 */
export async function getShareById(shareId: string): Promise<LessonShare | null> {
  const { data, error } = await withTimeout(
    supabase
      .from('lesson_shares')
      .select('*')
      .eq('id', shareId)
      .maybeSingle(),
    10000,
    'Failed to load shared lesson'
  );

  if (error) throw error;
  return (data ?? null) as LessonShare | null;
}

/**
 * Load all lessons shared with admin (admin only).
 * Includes teacher info joined from profiles/auth.
 */
export async function loadSharedLessonsForAdmin(): Promise<AdminLessonShare[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  return cachedRequest(`${CACHE_PREFIX}:admin`, async () => {
    const { data, error } = await withTimeout(
      supabase.rpc('get_shared_lessons_with_teacher_info'),
      10000,
      'Failed to load shared lessons'
    );

    if (error) {
      // Fallback: load just the shares if RPC doesn't exist yet
      const { data: fallbackData, error: fallbackError } = await withTimeout(
        supabase
          .from('lesson_shares')
          .select('*')
          .order('shared_at', { ascending: false }),
        10000,
        'Failed to load shared lessons'
      );

      if (fallbackError) throw fallbackError;
      return (fallbackData ?? []) as LessonShare[];
    }

    return (data ?? []) as AdminLessonShare[];
  });
}

/**
 * Update admin feedback on a shared lesson.
 * Admin only.
 */
export async function updateShareFeedback(shareId: string, feedback: string): Promise<LessonShare> {
  const userId = await getCurrentUserId();
  if (!userId) throw new Error('Must be logged in');

  // Verify user is admin
  const { data: profileData } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (profileData?.role !== 'admin') {
    throw new Error('Only admins can provide feedback');
  }

  const { data, error } = await withTimeout(
    supabase
      .from('lesson_shares')
      .update({
        admin_feedback: feedback,
        feedback_updated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', shareId)
      .select()
      .single(),
    10000,
    'Failed to update feedback'
  );

  if (error) throw error;
  if (!data) throw new Error('No data returned from update');

  invalidateCache(`${CACHE_PREFIX}:admin`);

  return data as LessonShare;
}

/**
 * Check if a lesson has been shared with admin.
 * Returns the share record if exists, null otherwise.
 */
export async function getShareForLesson(lessonId: string): Promise<LessonShare | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const { data, error } = await withTimeout(
    supabase
      .from('lesson_shares')
      .select('*')
      .eq('lesson_id', lessonId)
      .eq('teacher_id', userId)
      .order('shared_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    10000,
    'Failed to check lesson share status'
  );

  if (error) throw error;
  return (data ?? null) as LessonShare | null;
}
