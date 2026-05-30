import { corsHeaders } from '../_shared/claude.ts';
import { callConfiguredTextJson } from '../_shared/ai-provider.ts';
import {
  buildTestItemRewritePrompt,
  normalizeTestItemRewriteResponse,
  testItemRewriteSystemPrompt,
  type TestItemRewriteBody,
} from '../_shared/generation.ts';
import { json, runCreditBackedGeneration } from '../_shared/generation-action.ts';
import { HttpError } from '../_shared/supabase.ts';

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
    return json({ error: 'Invalid JSON body' }, 400, corsHeaders);
  }

  if (!body.subject || !body.classLevel || !Array.isArray(body.items) || !body.items.length) {
    return json({ error: 'subject, classLevel and items are required' }, 400, corsHeaders);
  }

  const metadata = {
    subject: body.subject,
    classLevel: body.classLevel,
    termTitle: body.termTitle ?? null,
    itemCount: body.items.length,
  };

  try {
    const result = await runCreditBackedGeneration({
      req,
      action: 'rewrite_test_items',
      creditKind: 'test_item_rewrite',
      fallbackCreditCost: TEST_ITEM_REWRITE_CREDIT_COST,
      description: 'Test item rewrite',
      metadata,
      async run() {
        const rawPaper = await callConfiguredTextJson<Record<string, unknown>>({
          system: testItemRewriteSystemPrompt,
          user: buildTestItemRewritePrompt(body),
          maxTokens: 10000,
        });
        return normalizeTestItemRewriteResponse(rawPaper, body);
      },
    });

    return json(result, 200, corsHeaders);
  } catch (err) {
    if (err instanceof HttpError) {
      return json({ error: err.message, ...(err.payload ?? {}) }, err.status, corsHeaders);
    }
    return json({ error: (err as Error).message }, 500, corsHeaders);
  }
});
