import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { LessonShare } from '@/types/lessonPlan';

interface ShareFeedbackDisplayProps {
  share: LessonShare;
}

export default function ShareFeedbackDisplay({ share }: ShareFeedbackDisplayProps) {
  if (!share.admin_feedback && !share.teacher_message) {
    // Show "shared with admin" badge only
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-2">
          <span className="text-blue-600 text-xl">✅</span>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900">Shared with Admin</h4>
            <p className="text-sm text-blue-700">
              Shared {formatDistanceToNow(new Date(share.shared_at), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-4">
      {/* Shared status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <span className="text-blue-600 text-xl">✅</span>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900">Shared with Admin</h4>
            <p className="text-sm text-blue-700">
              Shared {formatDistanceToNow(new Date(share.shared_at), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>

      {/* Teacher's message */}
      {share.teacher_message && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h5 className="font-semibold text-gray-900 mb-2">Your message:</h5>
          <p className="text-gray-700 whitespace-pre-wrap">{share.teacher_message}</p>
        </div>
      )}

      {/* Admin feedback */}
      {share.admin_feedback && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <h5 className="font-semibold text-green-900">💬 Admin Feedback</h5>
            {share.feedback_updated_at && (
              <span className="text-xs text-green-700">
                {formatDistanceToNow(new Date(share.feedback_updated_at), { addSuffix: true })}
              </span>
            )}
          </div>
          <p className="text-green-700 whitespace-pre-wrap">{share.admin_feedback}</p>
        </div>
      )}
    </div>
  );
}
