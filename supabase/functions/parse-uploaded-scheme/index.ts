import { corsHeaders } from '../_shared/claude.ts';
import { json, runCreditBackedGeneration } from '../_shared/generation-action.ts';
import { HttpError } from '../_shared/supabase.ts';

const SCHEME_PARSE_CREDIT_COST = 1;

type ParseUploadedSchemeBody = {
  subject?: string;
  classLevel?: string;
  term?: string;
  fileName?: string;
  fileBase64?: string;
  numberOfWeeks?: number;
  curriculumYearHint?: unknown[];
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405, corsHeaders);
  }

  let body: ParseUploadedSchemeBody;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400, corsHeaders);
  }

  if (!body.subject || !body.classLevel || !body.term || !body.fileName || !body.fileBase64) {
    return json(
      { error: 'subject, classLevel, term, fileName and fileBase64 are required' },
      400,
      corsHeaders,
    );
  }

  const { baseUrl: parserBaseUrl, provider: parserProvider } = getParserBackend();
  if (!parserBaseUrl) {
    return json({ error: 'Parser backend URL is not configured for this edge function' }, 500, corsHeaders);
  }

  const metadata = {
    subject: body.subject,
    classLevel: body.classLevel,
    term: body.term,
    fileName: body.fileName,
    parserProvider,
  };

  try {
    const result = await runCreditBackedGeneration({
      req,
      action: 'parse_uploaded_scheme',
      creditKind: 'scheme_parsing',
      fallbackCreditCost: SCHEME_PARSE_CREDIT_COST,
      description: 'Scheme upload parsing',
      metadata,
      async run() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);

        try {
          const response = await fetch(`${parserBaseUrl}/parse-scheme`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(body),
            signal: controller.signal,
          });

          const payload = await response.json().catch(() => null);
          if (!response.ok) {
            throw new Error(
              typeof payload?.error === 'string'
                ? payload.error
                : `Parser service failed with status ${response.status}`,
            );
          }

          return payload ?? {};
        } finally {
          clearTimeout(timeoutId);
        }
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

function getParserBackend() {
  const provider = (Deno.env.get('PARSER_BACKEND') || 'active').trim().toLowerCase();
  const activeUrl = cleanUrl(Deno.env.get('PARSER_SERVICE_URL'));
  const renderUrl = cleanUrl(Deno.env.get('PARSER_RENDER_SERVICE_URL'));
  const cloudRunUrl = cleanUrl(Deno.env.get('PARSER_CLOUD_RUN_SERVICE_URL'));

  if (provider === 'render') {
    return { provider, baseUrl: renderUrl || activeUrl };
  }

  if (provider === 'cloud-run' || provider === 'cloudrun') {
    return { provider: 'cloud-run', baseUrl: cloudRunUrl || activeUrl };
  }

  return { provider: 'active', baseUrl: activeUrl };
}

function cleanUrl(value?: string | null) {
  return value?.trim().replace(/\/$/, '') || '';
}
