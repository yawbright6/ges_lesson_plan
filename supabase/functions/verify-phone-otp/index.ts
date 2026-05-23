import { serve } from 'https://deno.land/std@0.208.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { formatPhoneForArkesel } from '../_shared/phone.ts'; // ✅ Use shared utility

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

interface VerifyPhoneOtpRequest {
  phoneNumber: string;
  otp: string;
  email?: string;
  password?: string;
  referralCode?: string;
  deviceId?: string;
}

interface VerifyPhoneOtpResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    phone_number: string;
  };
  error?: string;
}

async function logPhoneSignupEvent(
  supabase: ReturnType<typeof createClient>,
  input: {
    phoneNumber: string;
    eventType: string;
    status: 'info' | 'success' | 'error';
    otpRequestId?: string | null;
    userId?: string | null;
    referralCode?: string | null;
    providerMessage?: string | null;
    metadata?: Record<string, unknown>;
  },
) {
  const { error } = await supabase.from('phone_signup_events').insert({
    phone_number: input.phoneNumber,
    event_type: input.eventType,
    status: input.status,
    otp_request_id: input.otpRequestId ?? null,
    user_id: input.userId ?? null,
    referral_code: input.referralCode?.trim().toUpperCase() || null,
    provider: 'internal',
    provider_message: input.providerMessage ?? null,
    metadata: input.metadata ?? {},
  });
  if (error) console.warn('[phone_signup_events] insert failed:', error.message);
}

async function ensureStarterCredits(supabase: ReturnType<typeof createClient>, userId: string) {
  const { data: existing } = await supabase
    .from('credit_transactions')
    .select('id')
    .eq('user_id', userId)
    .eq('kind', 'starter')
    .limit(1);
  if (existing?.length) return;

  const { data: setting } = await supabase
    .from('admin_app_settings')
    .select('value')
    .eq('key', 'starter_credits')
    .maybeSingle();
  const credits = Math.max(0, Number(setting?.value?.credits ?? 5));
  if (!credits) return;

  const { error } = await supabase.rpc('add_user_credits', {
    p_user_id: userId,
    p_amount: credits,
    p_kind: 'starter',
    p_description: 'Starter credits',
    p_metadata: { source: 'phone_signup_verify' },
  });
  if (error) console.warn('[starter credits] grant failed:', error.message);
}

async function applyPhoneSignupReferral(
  supabase: ReturnType<typeof createClient>,
  input: {
    userId: string;
    phoneNumber: string;
    referralCode?: string;
    deviceId?: string;
    request: Request;
  },
) {
  const referralCode = input.referralCode?.trim().toUpperCase();
  if (!referralCode) return;

  const { data: existing } = await supabase
    .from('referrals')
    .select('id,status,referrer_user_id')
    .eq('referred_user_id', input.userId)
    .maybeSingle();
  if (existing) {
    if (existing.status === 'pending') {
      await rewardReferralDirectly(supabase, existing.id, existing.referrer_user_id, input.userId, input.phoneNumber, referralCode);
    }
    return;
  }

  const { data: code, error: codeError } = await supabase
    .from('referral_codes')
    .select('user_id,code,referrer_device_id')
    .ilike('code', referralCode)
    .maybeSingle();
  if (codeError || !code) {
    console.warn('[referral] code not found:', referralCode, codeError?.message);
    await logPhoneSignupEvent(supabase, {
      phoneNumber: input.phoneNumber,
      eventType: 'referral_apply_failed',
      status: 'error',
      userId: input.userId,
      referralCode,
      providerMessage: codeError?.message || 'Referral code not found',
      metadata: { source: 'direct_referral_apply' },
    });
    return;
  }

  let rejectionReason: string | null = null;
  if (code.user_id === input.userId) {
    rejectionReason = 'Self referral';
  } else if (
    code.referrer_device_id &&
    input.deviceId?.trim() &&
    code.referrer_device_id === input.deviceId.trim()
  ) {
    rejectionReason = 'Same device as referrer';
  }

  const { data: inserted, error: insertError } = await supabase
    .from('referrals')
    .insert({
      referrer_user_id: code.user_id,
      referred_user_id: input.userId,
      referral_code: code.code,
      referrer_device_id: code.referrer_device_id ?? null,
      referred_device_id: input.deviceId?.trim() || null,
      referred_ip:
        input.request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        input.request.headers.get('cf-connecting-ip') ||
        null,
      referred_user_agent: input.request.headers.get('user-agent'),
      status: rejectionReason ? 'rejected' : 'pending',
      rejection_reason: rejectionReason,
      referred_email_confirmed: true,
      referred_email_confirmed_at: new Date().toISOString(),
    })
    .select('id,status,referrer_user_id')
    .maybeSingle();
  if (insertError || !inserted) {
    console.warn('[referral] direct insert failed:', insertError?.message);
    await logPhoneSignupEvent(supabase, {
      phoneNumber: input.phoneNumber,
      eventType: 'referral_apply_failed',
      status: 'error',
      userId: input.userId,
      referralCode,
      providerMessage: insertError?.message || 'Referral insert did not return a row',
      metadata: { source: 'direct_referral_apply' },
    });
    return;
  }

  if (inserted.status === 'pending') {
    await rewardReferralDirectly(supabase, inserted.id, inserted.referrer_user_id, input.userId, input.phoneNumber, referralCode);
  }
}

async function rewardReferralDirectly(
  supabase: ReturnType<typeof createClient>,
  referralId: string,
  referrerUserId: string,
  referredUserId: string,
  phoneNumber?: string,
  referralCode?: string,
) {
  const { data: setting } = await supabase
    .from('admin_app_settings')
    .select('value')
    .eq('key', 'referral_reward')
    .maybeSingle();
  const rewardCredits = Math.max(0, Number(setting?.value?.credits ?? 5));
  const monthlyLimit = Math.max(0, Number(setting?.value?.monthly_limit ?? 5));
  const active = Boolean(setting?.value?.active ?? true);

  if (!active || rewardCredits <= 0) {
    await supabase
      .from('referrals')
      .update({
        status: 'rejected',
        rejection_reason: 'Referral rewards are inactive',
        updated_at: new Date().toISOString(),
      })
      .eq('id', referralId)
      .eq('status', 'pending');
    return;
  }

  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);
  const { count } = await supabase
    .from('referrals')
    .select('id', { count: 'exact', head: true })
    .eq('referrer_user_id', referrerUserId)
    .eq('status', 'rewarded')
    .gte('rewarded_at', monthStart.toISOString());

  if ((count ?? 0) >= monthlyLimit) {
    await supabase
      .from('referrals')
      .update({
        status: 'rejected',
        rejection_reason: 'Monthly referral reward limit reached',
        updated_at: new Date().toISOString(),
      })
      .eq('id', referralId);
    return;
  }

  const { error: creditError } = await supabase.rpc('add_user_credits', {
    p_user_id: referrerUserId,
    p_amount: rewardCredits,
    p_kind: 'referral_reward',
    p_description: 'Referral reward',
    p_metadata: {
      referral_id: referralId,
      referred_user_id: referredUserId,
      source: 'phone_signup_verify',
    },
  });
  if (creditError) {
    console.warn('[referral] direct reward credit failed:', creditError.message);
    if (phoneNumber) {
      await logPhoneSignupEvent(supabase, {
        phoneNumber,
        eventType: 'referral_reward_failed',
        status: 'error',
        userId: referredUserId,
        referralCode,
        providerMessage: creditError.message,
        metadata: { referralId, referrerUserId },
      });
    }
    return;
  }

  await supabase
    .from('referrals')
    .update({
      status: 'rewarded',
      qualified_at: new Date().toISOString(),
      rewarded_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', referralId);

  if (phoneNumber) {
    await logPhoneSignupEvent(supabase, {
      phoneNumber,
      eventType: 'referral_rewarded',
      status: 'success',
      userId: referredUserId,
      referralCode,
      metadata: { referralId, referrerUserId },
    });
  }
}

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  try {
    const { phoneNumber, otp, email, password, referralCode, deviceId } = (await req.json()) as VerifyPhoneOtpRequest;

    if (!phoneNumber?.trim() || !otp?.trim()) {
      return jsonResponse({ error: 'Phone number and OTP are required', success: false }, 400);
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Format phone number properly (same way as send-phone-otp does)
    const formattedPhone = formatPhoneForArkesel(phoneNumber);
    if (!formattedPhone) {
      return jsonResponse({ error: 'Invalid phone number format', success: false }, 400);
    }

    console.log('[verify-phone-otp] Looking up OTP for phone:', formattedPhone);
    await logPhoneSignupEvent(supabase, {
      phoneNumber: formattedPhone,
      eventType: 'otp_verify_attempted',
      status: 'info',
      referralCode,
    });

    // Find OTP request
    const { data: otpRequests, error: queryError } = await supabase
      .from('phone_auth_requests')
      .select('*')
      .eq('phone_number', formattedPhone)
      .is('verified_at', null)
      .gt('otp_expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (queryError) {
      console.error('[Query Error]', queryError);
      return jsonResponse({ error: 'Failed to verify OTP', success: false }, 500);
    }

    if (!otpRequests || otpRequests.length === 0) {
      return jsonResponse(
        {
          error: 'No valid OTP request found. Please request a new OTP.',
          success: false,
        },
        400,
      );
    }

    const otpRecord = otpRequests[0];

    // Check if OTP is correct
    if (otpRecord.otp_code !== otp.trim()) {
      // Increment attempt count
      await supabase
        .from('phone_auth_requests')
        .update({
          attempt_count: (otpRecord.attempt_count || 0) + 1,
          last_attempt_at: new Date().toISOString(),
        })
        .eq('id', otpRecord.id);

      return jsonResponse(
        {
          error: 'Invalid OTP. Please try again.',
          success: false,
        },
        400,
      );
    }

    // Check if phone number already has an account
    const { data: existingPhoneUser } = await supabase
      .from('user_phone_numbers')
      .select('user_id')
      .eq('phone_number', formattedPhone)
      .limit(1);

    let userId: string;

    if (existingPhoneUser && existingPhoneUser.length > 0) {
      userId = existingPhoneUser[0].user_id;
      if (email?.trim()) {
        const { data: existingUser } = await supabase.auth.admin.getUserById(userId);
        const existingEmail = existingUser.user?.email?.toLowerCase();
        const requestedEmail = email.trim().toLowerCase();
        if (existingEmail && existingEmail !== requestedEmail) {
          await logPhoneSignupEvent(supabase, {
            phoneNumber: formattedPhone,
            eventType: 'otp_verify_failed',
            status: 'error',
            otpRequestId: otpRecord.id,
            userId,
            referralCode,
            providerMessage: 'Phone number already belongs to another account',
            metadata: { requestedEmail, existingEmail },
          });
          return jsonResponse(
            {
              error: 'This phone number is already linked to another account. Please sign in with that account or use a different phone number.',
              success: false,
            },
            409,
          );
        }
      }
    } else {
      // Create new user with phone number
      if (!password || password.length < 6) {
        return jsonResponse(
          {
            error: 'Password must be at least 6 characters',
            success: false,
          },
          400,
        );
      }

      // Create auth user with email if provided, otherwise use phone-based email
      const userEmail = email?.trim().toLowerCase() || `phone_${formattedPhone}@local.lessonplanner`;
      
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userEmail,
        password: password,
        email_confirm: true, // Skip email confirmation
        user_metadata: {
          phone_number: formattedPhone,
          signup_method: email ? 'email_and_phone' : 'phone',
          invitation_code: referralCode?.trim().toUpperCase() || null,
          referral_code: referralCode?.trim().toUpperCase() || null,
        },
      });

      if (authError) {
        console.error('[Auth Error]', authError);
        return jsonResponse(
          {
            error: authError.message || 'Failed to create user account',
            success: false,
          },
          500,
        );
      }

      userId = authData.user.id;
      await ensureStarterCredits(supabase, userId);

      // Handle referral code after phone OTP verification. Phone verification makes
      // the referred account active immediately, so the referral can be rewarded here.
      if (referralCode) {
        const { data: referralResult, error: referralError } = await supabase.rpc('apply_referral_code', {
          p_referred_user_id: userId,
          p_referral_code: referralCode.trim().toUpperCase(),
          p_referred_device_id: deviceId ?? null,
          p_referred_ip:
            req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            req.headers.get('cf-connecting-ip') ||
            null,
          p_referred_user_agent: req.headers.get('user-agent'),
        });

        if (referralError) {
          console.error('[Referral Error]', referralError);
          // Do not fail account creation if referral tracking has a database-side issue.
          // The user has already verified their phone and the auth account was created.
          console.warn('[Referral Error] Continuing signup without applying referral reward.');
        }

        const appliedReferral = Array.isArray(referralResult) ? referralResult[0] : referralResult;
        if (appliedReferral?.status === 'pending') {
          const { error: rewardError } = await supabase.rpc('reward_referral_if_qualified', {
            p_referred_user_id: userId,
          });
          if (rewardError) {
            console.error('[Referral Reward Error]', rewardError);
            // Rewards can be repaired later from admin reports; signup should not fail.
            console.warn('[Referral Reward Error] Continuing signup without granting reward.');
          }
        }
        await applyPhoneSignupReferral(supabase, {
          userId,
          phoneNumber: formattedPhone,
          referralCode,
          deviceId,
          request: req,
        });
      }
    }

    // Link phone number to user
    const { error: phoneError } = await supabase.from('user_phone_numbers').upsert(
      {
        user_id: userId,
        phone_number: formattedPhone,
        verified_at: new Date().toISOString(),
        is_primary: true,
      },
      { onConflict: 'user_id,phone_number' }
    );

    if (phoneError) {
      console.error('[Phone Link Error]', phoneError);
      // Don't fail if phone linking fails - user is already created
    }
    await logPhoneSignupEvent(supabase, {
      phoneNumber: formattedPhone,
      eventType: 'otp_verified',
      status: 'success',
      otpRequestId: otpRecord.id,
      userId,
      referralCode,
    });

    // Mark OTP as verified
    const { error: updateError } = await supabase
      .from('phone_auth_requests')
      .update({
        verified_at: new Date().toISOString(),
      })
      .eq('id', otpRecord.id);

    if (updateError) {
      console.error('[Update Error]', updateError);
    }

    return jsonResponse(
      {
        success: true,
        message: 'Phone number verified successfully',
        user: {
          id: userId,
          phone_number: formattedPhone,
        },
      },
      200,
    );
  } catch (error) {
    console.error('[Request Error]', error);
    return jsonResponse(
      {
        error: 'Internal server error',
        success: false,
      },
      500,
    );
  }
});
