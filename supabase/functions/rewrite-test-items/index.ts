import { callClaudeJson, corsHeaders } from '../_shared/claude.ts';
import {
  buildTestItemRewritePrompt,
  normalizeTestItemRewriteResponse,
  testItemRewriteSystemPrompt,
  type TestItemRewriteBody,
} from '../_shared/generation.ts';
import { consumeCreditsForRequest, getFeatureCreditCost, refundCredits } from '../_shared/credits.ts';
import { HttpError, logEdgeError } from '../_shared/supabase.ts';
import { rewardReferralIfQualified } from '../_shared/referrals.ts';

const TEST_ITEM_REWRITE_CREDIT_COST = 1;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  let body: TestItemRewriteBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  if (!body.subject || !body.classLevel || !Array.isArray(body.items) || !body.items.length) {
    return json({ error: 'subject, classLevel and items are required' }, 400);
  }

  let creditDebit: Awaited<ReturnType<typeof consumeCreditsForRequest>> | null = null;
  let creditCost = TEST_ITEM_REWRITE_CREDIT_COST;

  try {
    creditCost = await getFeatureCreditCost('test_item_rewrite', TEST_ITEM_REWRITE_CREDIT_COST);
    creditDebit = await consumeCreditsForRequest(
      req,
      creditCost,
      'test_item_rewrite',
      'Test item rewrite',
      {
        subject: body.subject,
        classLevel: body.classLevel,
        termTitle: body.termTitle ?? null,
        itemCount: body.items.length,
      },
    );

    const rawPaper = await callClaudeJson<Record<string, unknown>>({
      system: testItemRewriteSystemPrompt,
      user: buildTestItemRewritePrompt(body),
      maxTokens: 10000,
    });
    const normalized = normalizeTestItemRewriteResponse(rawPaper, body);

    await rewardReferralIfQualified(creditDebit.user.id);

    return json({ ...normalized, creditBalance: creditDebit.balance }, 200);
  } catch (err) {
    if (err instanceof HttpError) {
      return json({ error: err.message, ...(err.payload ?? {}) }, err.status);
    }

    await logEdgeError({
      userId: creditDebit?.user.id ?? null,
      source: 'edge',
      action: 'rewrite_test_items',
      message: (err as Error).message,
      metadata: {
        subject: body.subject,
        classLevel: body.classLevel,
        itemCount: body.items?.length ?? 0,
      },
    });

    if (creditDebit) {
      try {
        await refundCredits(
          creditDebit.user.id,
          creditCost,
          'Refund for failed test item rewrite',
          {
            originalTransactionId: creditDebit.transactionId,
            reason: (err as Error).message,
          },
        );
      } catch (refundErr) {
        console.error('[CRITICAL] Credit refund failed after test item rewrite error', {
          userId: creditDebit.user.id,
          transactionId: creditDebit.transactionId,
          credits: creditCost,
          refundError: (refundErr as Error).message,
          originalError: (err as Error).message,
        });
        return json({
          error: (err as Error).message,
          refundStatus: 'failed_to_refund',
          supportNote: 'Credits may not have been refunded. Support has been notified.',
        }, 500);
      }
    }

    return json({ error: (err as Error).message }, 500);
  }
});

function json(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'content-type': 'application/json' },
  });
}
