import { corsHeaders } from '../_shared/claude.ts';
import { callConfiguredTextJson } from '../_shared/ai-provider.ts';
import {
  buildSchemePrompt,
  normalizeSchemeResponse,
  schemeSystemPrompt,
  type SchemeGenerationBody,
} from '../_shared/generation.ts';
import { json, runCreditBackedGeneration } from '../_shared/generation-action.ts';
import { HttpError } from '../_shared/supabase.ts';

const SCHEME_CREDIT_COST = 1;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  let body: SchemeGenerationBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400, corsHeaders);
  }

  if (!body.subject || !body.classLevel || !body.term) {
    return json({ error: 'subject, classLevel and term are required' }, 400, corsHeaders);
  }

  const metadata = {
    subject: body.subject,
    classLevel: body.classLevel,
    term: body.term,
  };

  try {
    const result = await runCreditBackedGeneration({
      req,
      action: 'generate_scheme',
      creditKind: 'scheme_generation',
      fallbackCreditCost: SCHEME_CREDIT_COST,
      description: 'Scheme of work generation',
      metadata,
      async run() {
        const scheme = await callConfiguredTextJson<Record<string, unknown>>({
          system: schemeSystemPrompt,
          user: buildSchemePrompt(body),
        });
        return normalizeSchemeResponse(scheme, body);
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
