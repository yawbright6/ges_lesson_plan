import { consumeCreditsForRequest, getFeatureCreditCost, refundCredits, type CreditKind } from './credits.ts';
import { HttpError, logEdgeError, type EdgeUser } from './supabase.ts';
import { rewardReferralIfQualified } from './referrals.ts';

type CreditDebit = Awaited<ReturnType<typeof consumeCreditsForRequest>>;

type GenerationActionOptions<T> = {
  req: Request;
  action: string;
  creditKind: CreditKind;
  fallbackCreditCost: number;
  description: string;
  metadata: Record<string, unknown>;
  run: (context: { user: EdgeUser; creditCost: number; creditDebit: CreditDebit }) => Promise<T>;
};

export async function runCreditBackedGeneration<T>({
  req,
  action,
  creditKind,
  fallbackCreditCost,
  description,
  metadata,
  run,
}: GenerationActionOptions<T>): Promise<T & { creditBalance: number }> {
  let creditDebit: CreditDebit | null = null;
  let creditCost = fallbackCreditCost;

  try {
    creditCost = await getFeatureCreditCost(creditKind, fallbackCreditCost);
    creditDebit = await consumeCreditsForRequest(
      req,
      creditCost,
      creditKind,
      description,
      metadata,
    );

    const payload = await run({
      user: creditDebit.user,
      creditCost,
      creditDebit,
    });
    await rewardReferralIfQualified(creditDebit.user.id);

    return {
      ...payload,
      creditBalance: creditDebit.balance,
    };
  } catch (err) {
    if (err instanceof HttpError) {
      throw err;
    }

    await logEdgeError({
      userId: creditDebit?.user.id ?? null,
      source: 'edge',
      action,
      message: (err as Error).message,
      metadata,
    });

    if (creditDebit) {
      try {
        await refundCredits(
          creditDebit.user.id,
          creditCost,
          `Refund for failed ${description.toLowerCase()}`,
          {
            originalTransactionId: creditDebit.transactionId,
            reason: (err as Error).message,
            action,
          },
        );
      } catch (refundErr) {
        console.error('[CRITICAL] Credit refund failed after generation error', {
          userId: creditDebit.user.id,
          transactionId: creditDebit.transactionId,
          credits: creditCost,
          refundError: (refundErr as Error).message,
          originalError: (err as Error).message,
          action,
        });
        throw new HttpError(500, (err as Error).message, {
          refundStatus: 'failed_to_refund',
          supportNote: 'Credits may not have been refunded. Support has been notified.',
        });
      }
    }

    throw err;
  }
}

export function json(payload: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...headers, 'content-type': 'application/json' },
  });
}
