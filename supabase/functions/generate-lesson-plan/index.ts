import { callClaudeJson, corsHeaders } from '../_shared/claude.ts';
import {
  buildLessonPrompt,
  getLessonPlanSystemPrompt,
  normalizeLessonPlanResponse,
  type LessonGenerationBody,
} from '../_shared/generation.ts';
import { json, runCreditBackedGeneration } from '../_shared/generation-action.ts';
import { HttpError } from '../_shared/supabase.ts';

const LESSON_PLAN_CREDIT_COST = 1;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  let body: LessonGenerationBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400, corsHeaders);
  }

  if (!body.subject || !body.classLevel || !body.week) {
    return json({ error: 'subject, classLevel and week are required' }, 400, corsHeaders);
  }

  const metadata = {
    subject: body.subject,
    classLevel: body.classLevel,
    week: body.week,
    term: body.term ?? null,
  };

  try {
    const result = await runCreditBackedGeneration({
      req,
      action: 'generate_lesson_plan',
      creditKind: 'lesson_generation',
      fallbackCreditCost: LESSON_PLAN_CREDIT_COST,
      description: 'Lesson plan generation',
      metadata,
      async run() {
        const plan = await callClaudeJson<Record<string, unknown>>({
          system: getLessonPlanSystemPrompt({
            structuredVisualsEnabled: body.structuredVisualsEnabled !== false,
            visualGenerationEnabled: body.visualGenerationEnabled !== false,
          }),
          user: buildLessonPrompt(body),
        });
        return normalizeLessonPlanResponse(plan, body);
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
