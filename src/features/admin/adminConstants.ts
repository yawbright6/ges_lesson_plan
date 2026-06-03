import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { AdminSection } from './adminTypes';

export const adminSections: {
  id: AdminSection;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}[] = [
  { id: 'overview', label: 'Overview', icon: 'view-dashboard-outline' },
  { id: 'users', label: 'Users', icon: 'account-group-outline' },
  { id: 'credits', label: 'Credits', icon: 'wallet-outline' },
  { id: 'payments', label: 'Payments', icon: 'script-text-outline' },
  { id: 'usage', label: 'Usage', icon: 'chart-timeline-variant' },
  { id: 'referrals', label: 'Referrals', icon: 'share-variant-outline' },
  { id: 'phone-signups', label: 'Phone Signups', icon: 'cellphone' },
  { id: 'shared-lessons', label: 'Shared Lessons', icon: 'share-outline' },
  { id: 'logs', label: 'Error Logs', icon: 'alert-circle-outline' },
  { id: 'faqs', label: 'FAQs', icon: 'frequently-asked-questions' },
  { id: 'settings', label: 'Settings', icon: 'cog-outline' },
];

export const paymentStatusOptions = [
  { label: 'All statuses', value: '' },
  { label: 'Success', value: 'success' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
  { label: 'Abandoned', value: 'abandoned' },
];

export const creditKindOptions = [
  { label: 'All credit kinds', value: '' },
  { label: 'Purchase', value: 'purchase' },
  { label: 'Adjustment', value: 'adjustment' },
  { label: 'Referral reward', value: 'referral_reward' },
  { label: 'Lesson generation', value: 'lesson_generation' },
  { label: 'Scheme generation', value: 'scheme_generation' },
  { label: 'Scheme parsing', value: 'scheme_parsing' },
  { label: 'Teaching notes generation', value: 'teaching_notes_generation' },
  { label: 'Test item rewrite', value: 'test_item_rewrite' },
  { label: 'Visual generation', value: 'visual_generation' },
  { label: 'Starter', value: 'starter' },
];

export const usageKindOptions = [
  { label: 'All features', value: '' },
  { label: 'Lesson generation', value: 'lesson_generation' },
  { label: 'Scheme generation', value: 'scheme_generation' },
  { label: 'Custom scheme analysis', value: 'scheme_parsing' },
  { label: 'Teaching notes generation', value: 'teaching_notes_generation' },
  { label: 'Test item rewrite', value: 'test_item_rewrite' },
  { label: 'Visual generation', value: 'visual_generation' },
];

export const referralStatusOptions = [
  { label: 'All statuses', value: '' },
  { label: 'Unconfirmed email', value: 'unconfirmed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Rewarded', value: 'rewarded' },
  { label: 'Not rewarded', value: 'rejected' },
];

export const logSeverityOptions = [
  { label: 'All severities', value: '' },
  { label: 'Info', value: 'info' },
  { label: 'Warning', value: 'warning' },
  { label: 'Error', value: 'error' },
];

export const phoneSignupStatusOptions = [
  { label: 'All events', value: '' },
  { label: 'OTP requested', value: 'otp_requested' },
  { label: 'OTP sent', value: 'otp_send_succeeded' },
  { label: 'Send failed', value: 'otp_send_failed' },
  { label: 'Verify attempted', value: 'otp_verify_attempted' },
  { label: 'Verified', value: 'otp_verified' },
  { label: 'Verify failed', value: 'otp_verify_failed' },
  { label: 'Registration completed', value: 'registration_completed' },
  { label: 'Registration failed', value: 'registration_failed' },
];

export const promotionTypeOptions = [
  { label: 'None', value: 'none' },
  { label: 'Bonus credits', value: 'bonus' },
  { label: 'Discount (%)', value: 'percent_discount' },
  { label: 'Discount (GHS)', value: 'fixed_discount' },
  { label: 'Custom badge only', value: 'custom' },
];

export const aiTextProviderOptions = [
  { label: 'OpenAI', value: 'openai' },
  { label: 'Gemini', value: 'gemini' },
  { label: 'Claude / Anthropic', value: 'anthropic' },
];

export const openAiTextModelOptions = [
  { label: 'GPT-5.5', value: 'gpt-5.5' },
  { label: 'GPT-5.4', value: 'gpt-5.4' },
  { label: 'GPT-5.4 mini', value: 'gpt-5.4-mini' },
  { label: 'GPT-5.4 nano', value: 'gpt-5.4-nano' },
  { label: 'GPT-5.2', value: 'gpt-5.2' },
  { label: 'GPT-5.1', value: 'gpt-5.1' },
  { label: 'GPT-5', value: 'gpt-5' },
];

export const claudeTextModelOptions = [
  { label: 'Claude Sonnet 4.5', value: 'claude-sonnet-4-5' },
];

export const geminiTextModelOptions = [
  { label: 'Gemini 2.5 Pro', value: 'gemini-2.5-pro' },
  { label: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash' },
  { label: 'Gemini 2.5 Flash-Lite', value: 'gemini-2.5-flash-lite' },
  { label: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash' },
  { label: 'Gemini 2.0 Flash-Lite', value: 'gemini-2.0-flash-lite' },
];

export const visualProviderOptions = [
  { label: 'OpenAI', value: 'openai' },
  { label: 'Gemini', value: 'gemini' },
];

export const openAiImageModelOptions = [
  { label: 'GPT Image 2', value: 'gpt-image-2' },
  { label: 'GPT Image 1.5', value: 'gpt-image-1.5' },
  { label: 'GPT Image 1', value: 'gpt-image-1' },
  { label: 'GPT Image 1 mini', value: 'gpt-image-1-mini' },
];

export const geminiImageModelOptions = [
  { label: 'Gemini 3.1 Flash Image Preview', value: 'gemini-3.1-flash-image-preview' },
];
