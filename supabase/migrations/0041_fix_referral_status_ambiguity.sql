-- Fix ambiguous references to the referral status column inside RPCs.
-- The RPCs return a column named "status", so SQL statements must qualify
-- table columns with an alias or table name.

create or replace function public.apply_referral_code(
  p_referred_user_id uuid,
  p_referral_code text,
  p_referred_device_id text default null,
  p_referred_ip text default null,
  p_referred_user_agent text default null
)
returns table (status text, referrer_user_id uuid, reason text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code public.referral_codes%rowtype;
  v_existing public.referrals%rowtype;
  v_reason text;
  v_status text;
  v_referrer_user_id uuid;
  v_rejection_reason text;
begin
  select r.*
  into v_existing
  from public.referrals as r
  where r.referred_user_id = p_referred_user_id;

  if found then
    return query select v_existing.status, v_existing.referrer_user_id, v_existing.rejection_reason;
    return;
  end if;

  select rc.*
  into v_code
  from public.referral_codes as rc
  where upper(rc.code) = upper(trim(p_referral_code));

  if not found then
    return query select 'rejected'::text, null::uuid, 'Referral code not found';
    return;
  end if;

  if v_code.user_id = p_referred_user_id then
    v_reason := 'Self referral';
  elsif nullif(v_code.referrer_device_id, '') is not null
    and nullif(trim(coalesce(p_referred_device_id, '')), '') is not null
    and v_code.referrer_device_id = p_referred_device_id then
    v_reason := 'Same device as referrer';
  end if;

  insert into public.referrals (
    referrer_user_id,
    referred_user_id,
    referral_code,
    referrer_device_id,
    referred_device_id,
    referred_ip,
    referred_user_agent,
    status,
    rejection_reason
  )
  values (
    v_code.user_id,
    p_referred_user_id,
    v_code.code,
    v_code.referrer_device_id,
    nullif(trim(coalesce(p_referred_device_id, '')), ''),
    nullif(trim(coalesce(p_referred_ip, '')), ''),
    nullif(trim(coalesce(p_referred_user_agent, '')), ''),
    case when v_reason is null then 'pending' else 'rejected' end,
    v_reason
  )
  returning public.referrals.status, public.referrals.referrer_user_id, public.referrals.rejection_reason
  into v_status, v_referrer_user_id, v_rejection_reason;

  return query select v_status, v_referrer_user_id, v_rejection_reason;
end;
$$;

create or replace function public.reward_referral_if_qualified(
  p_referred_user_id uuid
)
returns table (rewarded boolean, referrer_user_id uuid, reason text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_referral public.referrals%rowtype;
  v_month_rewards int;
  v_setting jsonb := public.app_setting('referral_reward');
  v_reward_credits int := greatest(0, coalesce((v_setting->>'credits')::int, 5));
  v_monthly_limit int := greatest(0, coalesce((v_setting->>'monthly_limit')::int, 5));
  v_active boolean := coalesce((v_setting->>'active')::boolean, true);
begin
  select r.*
  into v_referral
  from public.referrals as r
  where r.referred_user_id = p_referred_user_id
  for update;

  if not found then
    return query select false, null::uuid, 'No referral';
    return;
  end if;

  if not v_active or v_reward_credits <= 0 then
    update public.referrals as r
    set status = 'rejected',
        rejection_reason = 'Referral rewards are inactive',
        updated_at = now()
    where r.id = v_referral.id and r.status = 'pending';

    return query select false, v_referral.referrer_user_id, 'Referral rewards are inactive';
    return;
  end if;

  if v_referral.status = 'rewarded' then
    return query select false, v_referral.referrer_user_id, 'Already rewarded';
    return;
  end if;

  if v_referral.status = 'rejected' then
    return query select false, v_referral.referrer_user_id, coalesce(v_referral.rejection_reason, 'Rejected');
    return;
  end if;

  select count(*)
  into v_month_rewards
  from public.referrals as r
  where r.referrer_user_id = v_referral.referrer_user_id
    and r.status = 'rewarded'
    and r.rewarded_at >= date_trunc('month', now());

  if v_month_rewards >= v_monthly_limit then
    update public.referrals as r
    set status = 'rejected',
        rejection_reason = 'Monthly referral reward limit reached',
        updated_at = now()
    where r.id = v_referral.id;

    return query select false, v_referral.referrer_user_id, 'Monthly referral reward limit reached';
    return;
  end if;

  perform public.add_user_credits(
    v_referral.referrer_user_id,
    v_reward_credits,
    'referral_reward',
    'Referral reward',
    jsonb_build_object(
      'referral_id', v_referral.id,
      'referred_user_id', v_referral.referred_user_id
    )
  );

  update public.referrals as r
  set status = 'rewarded',
      qualified_at = now(),
      rewarded_at = now(),
      updated_at = now()
  where r.id = v_referral.id;

  return query select true, v_referral.referrer_user_id, null::text;
end;
$$;
