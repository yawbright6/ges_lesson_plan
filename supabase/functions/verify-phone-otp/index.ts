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
      // User already exists, just verify the OTP
      userId = existingPhoneUser[0].user_id;
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
          return jsonResponse(
            {
              error: referralError.message || 'Failed to apply referral code',
              success: false,
            },
            500,
          );
        }

        const appliedReferral = Array.isArray(referralResult) ? referralResult[0] : referralResult;
        if (appliedReferral?.status === 'pending') {
          const { error: rewardError } = await supabase.rpc('reward_referral_if_qualified', {
            p_referred_user_id: userId,
          });
          if (rewardError) {
            console.error('[Referral Reward Error]', rewardError);
            return jsonResponse(
              {
                error: rewardError.message || 'Failed to grant referral reward',
                success: false,
              },
              500,
            );
          }
        }
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
