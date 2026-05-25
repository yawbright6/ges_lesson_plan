import { callClaudeJson, corsHeaders } from '../_shared/claude.ts';
import {
  buildTeachingNotesPrompt,
  getTeachingNotesSystemPrompt,
  normalizeTeachingNotesResponse,
  type TeachingNotesGenerationBody,
} from '../_shared/generation.ts';
import { json, runCreditBackedGeneration } from '../_shared/generation-action.ts';
import { HttpError } from '../_shared/supabase.ts';

const TEACHING_NOTES_CREDIT_COST = 1;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  let body: TeachingNotesGenerationBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400, corsHeaders);
  }

  if (!body.lessonPlan || typeof body.lessonPlan !== 'object') {
    return json({ error: 'lessonPlan is required' }, 400, corsHeaders);
  }

  const lessonPlan = body.lessonPlan as Record<string, unknown>;
  const metadata = {
    lessonPlanId: lessonPlan.id ?? null,
    subject: lessonPlan.subject ?? null,
    classLevel: lessonPlan.classLevel ?? null,
    week: lessonPlan.week ?? null,
  };

  try {
    const result = await runCreditBackedGeneration({
      req,
      action: 'generate_teaching_notes',
      creditKind: 'teaching_notes_generation',
      fallbackCreditCost: TEACHING_NOTES_CREDIT_COST,
      description: 'Teaching notes generation',
      metadata,
      async run() {
        const rawNotes = await callClaudeJson<Record<string, unknown>>({
          system: getTeachingNotesSystemPrompt({
            structuredVisualsEnabled: body.structuredVisualsEnabled !== false,
            visualGenerationEnabled: body.visualGenerationEnabled !== false,
          }),
          user: buildTeachingNotesPrompt(body),
          maxTokens: 12000,
        });
        return normalizeTeachingNotesResponse(rawNotes, body);
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
