import { createServer } from 'node:http';
import { resolve } from 'node:path';
import { createAnthropicJsonCaller } from './anthropic-json.mjs';
import { extractSchemeTextFromUpload } from './document-extraction.mjs';
import {
  detectAvailableClassLevels,
  detectUploadedSchemeMetadata,
  detectWeekCountFromText,
  extractAnnualPlanText,
  extractLikelyWeekRows,
  isolateRequestedSubjectText,
  selectPreferredSchemeSection,
  subjectsRoughlyMatch,
} from './scheme-text-parser.mjs';
import {
  normalizeSchemeResponse,
  reconcileParsedSchemeWithCurriculumBackend,
} from './scheme-normalizer.mjs';
import {
  getErrorMessage,
  loadEnvFile,
  readJsonBody,
  setCorsHeaders,
  writeJson,
} from './runtime-utils.mjs';

const PORT = Number(process.env.PARSER_SERVICE_PORT || process.env.PORT || 8788);
const LOCAL_ENV_PATH = resolve(process.cwd(), '.env');
const ROOT_ENV_PATH = resolve(process.cwd(), '..', '.env');

loadEnvFile(LOCAL_ENV_PATH);
loadEnvFile(ROOT_ENV_PATH);

const apiKey = process.env.ANTHROPIC_API_KEY;
const model = process.env.LOCAL_AI_MODEL || 'claude-sonnet-4-5';
const callAnthropicJson = createAnthropicJsonCaller({ apiKey, model });

if (!apiKey) {
  console.error('Missing ANTHROPIC_API_KEY.');
  process.exit(1);
}

const server = createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    writeJson(res, 200, { ok: true, service: 'parser-service' });
    return;
  }

  if (req.method === 'POST' && req.url === '/parse-scheme') {
    const body = await readJsonBody(req, res);
    if (!body) return;

    if (!body.subject || !body.classLevel || !body.term || !body.fileName || !body.fileBase64) {
      writeJson(res, 400, {
        error: 'subject, classLevel, term, fileName and fileBase64 are required',
      });
      return;
    }

    try {
      const extractedText = await extractSchemeTextFromUpload(body.fileName, body.fileBase64);
      const subjectScopedText = isolateRequestedSubjectText(extractedText, body.subject);
      if (!subjectScopedText.trim()) {
        writeJson(res, 400, {
          error: `This file contains subject sections, but no ${body.subject} scheme section could be found.`,
        });
        return;
      }

      const detectedMetadata = detectUploadedSchemeMetadata(subjectScopedText);
      if (
        detectedMetadata.subject &&
        !subjectsRoughlyMatch(detectedMetadata.subject, body.subject)
      ) {
        writeJson(res, 400, {
          error: `This file appears to contain a ${detectedMetadata.subject} scheme, not ${body.subject}.`,
        });
        return;
      }

      const availableClassLevels = detectAvailableClassLevels(subjectScopedText);
      if (
        availableClassLevels.length &&
        !availableClassLevels.includes(String(body.classLevel).toUpperCase())
      ) {
        const described = availableClassLevels.join(', ');
        writeJson(res, 400, {
          error:
            availableClassLevels.length === 1
              ? `This file appears to contain a scheme for ${described} only, not ${body.classLevel}.`
              : `This file appears to contain schemes for ${described}, not ${body.classLevel}.`,
        });
        return;
      }

      const annualPlanText = extractAnnualPlanText(subjectScopedText, body.classLevel, body.subject);
      const selectedSection = selectPreferredSchemeSection(
        subjectScopedText,
        body.classLevel,
        body.term,
        body.subject
      );
      const relevantText = selectedSection.text;
      const likelyWeekRows = extractLikelyWeekRows(relevantText);
      const detectedWeekCount =
        selectedSection.weekCount ||
        detectWeekCountFromText(relevantText) ||
        (selectedSection.source === 'annual' ? detectWeekCountFromText(annualPlanText) : 0) ||
        body.numberOfWeeks ||
        12;

      if (!relevantText.trim()) {
        writeJson(res, 400, {
          error: 'The uploaded file could not be read as usable text.',
        });
        return;
      }

      if (selectedSection.source === 'annual') {
        writeJson(res, 200, {
          scheme: buildAnnualSchemeFromSelectedText({
            text: relevantText,
            subject: body.subject,
            classLevel: body.classLevel,
            term: body.term,
            fileName: body.fileName,
            detectedMetadata,
            curriculumYearHint: Array.isArray(body.curriculumYearHint)
              ? body.curriculumYearHint
              : [],
          }),
          detectedMetadata,
        });
        return;
      }

      const scheme = await callAnthropicJson({
        system: uploadSchemeParserSystemPrompt,
        user:
          `Parse this uploaded Ghanaian scheme of work into structured JSON.\n` +
          `- Subject: ${body.subject}\n` +
          `- Class Level: ${body.classLevel}\n` +
          `- Term: ${body.term}\n` +
          `- File name: ${body.fileName}\n` +
          `- Expected weeks: ${detectedWeekCount}\n` +
          `- Best-effort detected metadata from the file:\n` +
          `  * Subject: ${detectedMetadata.subject || 'Unknown'}\n` +
          `  * Class Level: ${detectedMetadata.classLevel || 'Unknown'}\n` +
          `  * Term: ${detectedMetadata.term || 'Unknown'}\n` +
          `- The uploaded file may contain the full academic year. Extract only the requested term.\n` +
          `- Parsing precedence: use a detailed weekly/termly scheme section first. Only use the annual scheme/annual scheme of learning if no detailed term section exists.\n` +
          `- Respect the actual number of weeks visible in the uploaded scheme. Do not invent extra weeks beyond ${detectedWeekCount}.\n` +
          `- Selected parser section type: ${selectedSection.source}\n` +
          (selectedSection.source === 'annual'
            ? `- This is an annual-plan column extraction. Keep each Week topic exactly as listed in the relevant uploaded scheme text. Do not replace annual-plan topics with detailed Term 1 topics or mapped curriculum topics.\n`
            : '') +
          `\nAnnual plan summary text (if present):\n${annualPlanText || 'No separate annual summary detected.'}\n` +
          `\nRelevant uploaded scheme text:\n${relevantText}\n` +
          `\nLikely week rows and table cues:\n${likelyWeekRows || 'No obvious week rows detected.'}\n` +
          `\nReturn the JSON object only.`,
      });

      const normalized = normalizeSchemeResponse(scheme, {
        subject: body.subject,
        classLevel: body.classLevel,
        term: body.term,
        numberOfWeeks: detectedWeekCount,
      });

      const reconciled = reconcileParsedSchemeWithCurriculumBackend({
        scheme: {
          ...normalized,
          subject: body.subject,
          classLevel: body.classLevel,
          term: body.term,
          sourceFileKey: body.fileName,
        },
        subject: body.subject,
        classLevel: body.classLevel,
        preferredTerm: body.term,
        detectedMetadata,
        curriculumYearHint: Array.isArray(body.curriculumYearHint)
          ? body.curriculumYearHint
          : [],
      });

      writeJson(res, 200, {
        scheme: reconciled,
        detectedMetadata,
      });
    } catch (error) {
      writeJson(res, 500, { error: getErrorMessage(error) });
    }
    return;
  }

  writeJson(res, 404, { error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`Parser service listening on http://localhost:${PORT}`);
});

function buildAnnualSchemeFromSelectedText(input) {
  const curriculumEntries = flattenCurriculumEntries(input.curriculumYearHint);
  const weeks = parseAnnualSelectedWeeks(input.text, curriculumEntries);
  const now = new Date().toISOString();

  return {
    id: `${slugify(input.subject)}-${input.classLevel}-${slugify(input.term)}-${Date.now()}`,
    title: `${input.subject} Scheme of Work - ${input.classLevel} ${input.term}`,
    subject: input.subject,
    classLevel: input.classLevel,
    term: input.term,
    source: 'uploaded',
    sourceFileKey: input.fileName,
    weeks,
    createdAt: now,
    parserMetadata: {
      detectedMetadata: input.detectedMetadata,
      warnings: [
        'Parsed from the uploaded annual scheme table. Weekly topics were preserved from the requested term column. Mapped curriculum details were used only to enrich matching uploaded topics.',
      ],
      confidence: 0.72,
    },
  };
}

function parseAnnualSelectedWeeks(text, curriculumEntries) {
  const lines = String(text || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const weeks = [];

  for (let index = 0; index < lines.length; index += 1) {
    const weekMatch = lines[index].match(/^week\s+(\d{1,2})$/i);
    if (!weekMatch) continue;

    const topicLines = [];
    for (let nextIndex = index + 1; nextIndex < lines.length; nextIndex += 1) {
      if (/^week\s+\d{1,2}$/i.test(lines[nextIndex])) break;
      topicLines.push(lines[nextIndex]);
    }

    const topics = topicLines
      .join('; ')
      .split(/\s*(?:;|\n| {2,})\s*/)
      .map((topic) => topic.trim())
      .filter(Boolean);

    if (!topics.length) continue;
    const combinedTopic = topics.join('; ');
    const entries = topics.map((topic) => buildAnnualTopicEntry(topic, curriculumEntries));
    weeks.push({
      week: Number(weekMatch[1]),
      strand: entries[0]?.strand || '',
      subStrand: combinedTopic,
      contentStandard: entries[0]?.contentStandard || '',
      indicator: entries[0]?.indicator || '',
      topic: combinedTopic,
      resources: uniqueCleanStrings(entries.flatMap((entry) => entry.resources || [])),
      uploadedTopic: combinedTopic,
      entries: topics.length > 1 ? entries : undefined,
    });
  }

  return weeks;
}

function buildAnnualTopicEntry(topic, curriculumEntries) {
  const match = findBestCurriculumEntry(topic, curriculumEntries);
  if (!match) {
    return {
      strand: '',
      subStrand: topic,
      contentStandard: '',
      indicator: '',
      topic,
      resources: [],
    };
  }

  return {
    strand: match.strand || '',
    subStrand: match.subStrand || topic,
    contentStandard: match.contentStandard || '',
    indicator: match.indicator || '',
    topic,
    uploadedTopic: topic,
    mappedTopic: match.topic || '',
    matchedCurriculumTerm: match.sourceTerm,
    matchConfidence: match.matchConfidence,
    resources: Array.isArray(match.resources) ? match.resources : [],
  };
}

function flattenCurriculumEntries(curriculumYearHint) {
  const flattened = [];
  for (const week of Array.isArray(curriculumYearHint) ? curriculumYearHint : []) {
    const sourceTerm = typeof week?.sourceTerm === 'string' ? week.sourceTerm : '';
    const weekEntries = Array.isArray(week?.entries) && week.entries.length
      ? week.entries
      : [week];

    for (const entry of weekEntries) {
      flattened.push({
        strand: cleanString(entry?.strand ?? week?.strand),
        subStrand: cleanString(entry?.subStrand ?? week?.subStrand),
        contentStandard: cleanString(entry?.contentStandard ?? week?.contentStandard),
        indicator: cleanString(entry?.indicator ?? week?.indicator),
        topic: cleanString(entry?.topic ?? week?.topic),
        sourceTerm,
        resources: Array.isArray(entry?.resources)
          ? entry.resources.map(cleanString).filter(Boolean)
          : Array.isArray(week?.resources)
            ? week.resources.map(cleanString).filter(Boolean)
            : [],
      });
    }
  }
  return flattened;
}

function findBestCurriculumEntry(topic, curriculumEntries) {
  const topicTokens = tokenizeForMatch(topic);
  if (!topicTokens.size) return null;

  let best = null;
  for (const entry of curriculumEntries) {
    const candidateTokens = tokenizeForMatch([
      entry.topic,
      entry.subStrand,
      entry.strand,
      entry.contentStandard,
      entry.indicator,
    ].join(' '));
    const shared = countSharedTokens(topicTokens, candidateTokens);
    const exactBoost = candidateIncludesPhrase(entry, topic) ? 0.35 : 0;
    const confidence = Number(((shared / Math.max(1, topicTokens.size)) + exactBoost).toFixed(2));
    if (!best || confidence > best.matchConfidence) {
      best = { ...entry, matchConfidence: confidence };
    }
  }

  return best && best.matchConfidence >= 0.35 ? best : null;
}

function candidateIncludesPhrase(entry, topic) {
  const needle = normalizeForCompare(topic);
  if (!needle) return false;
  return [entry.topic, entry.subStrand, entry.contentStandard, entry.indicator]
    .map(normalizeForCompare)
    .some((value) => value.includes(needle) || needle.includes(value));
}

function tokenizeForMatch(value) {
  return new Set(
    normalizeForCompare(value)
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .map((token) => token.trim())
      .filter((token) => token.length > 2 && !STOP_WORDS.has(token))
  );
}

function normalizeForCompare(value) {
  return cleanString(value)
    .toLowerCase()
    .replace(/\borganize\b/g, 'organise')
    .replace(/\borganizing\b/g, 'organising')
    .replace(/\band\b/g, ' ')
    .replace(/&/g, ' ');
}

function countSharedTokens(left, right) {
  let total = 0;
  left.forEach((token) => {
    if (right.has(token)) total += 1;
  });
  return total;
}

function uniqueCleanStrings(values) {
  const seen = new Set();
  const output = [];
  for (const value of values) {
    const cleaned = cleanString(value);
    const key = cleaned.toLowerCase();
    if (!cleaned || seen.has(key)) continue;
    seen.add(key);
    output.push(cleaned);
  }
  return output;
}

function cleanString(value) {
  return String(value || '').trim();
}

function slugify(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'with',
  'into',
  'from',
  'ideas',
  'idea',
]);

const uploadSchemeParserSystemPrompt = `You are an expert at reading Ghanaian school schemes of work and converting them into structured weekly records.
Return a single JSON object only with this shape:
{
  "title": string,
  "subject": string,
  "classLevel": string,
  "term": string,
  "weeks": [
    {
      "week": number,
      "strand": string,
      "subStrand": string,
      "contentStandard": string,
      "indicator": string,
      "topic": string,
      "resources": string[]
    }
  ]
}

Rules:
- Treat the uploaded scheme text as the source of truth.
- The uploaded document may contain Term 1, Term 2 and Term 3 together. Extract only the requested term.
- Use the detected file metadata when it is clearly supported by the document text rather than blindly echoing the requested values.
- If the document begins with an annual plan or yearly summary table and later expands into detailed term pages, prefer the detailed page for the requested term.
- Use the annual plan only as a supporting hint about topic sequence, not as the main source when a detailed term page exists.
- Use the supplied "Likely week rows and table cues" as extra hints about row boundaries and column meaning.
- Preserve the uploaded week sequence as closely as possible.
- If the upload uses labels like Week 1, Wk 1, or similar, map them to numeric week values.
- Be tolerant of table-style layouts where one row may be split across multiple lines.
- Ignore rows belonging to other terms once the requested term has been identified.
- If some rows omit strand, sub-strand, standard, indicator, or resources, infer only what is clearly implied by nearby rows.
- Do not invent a different term sequence from NaCCA if the uploaded scheme already specifies its own weekly order.
- Keep titles and topics concise and teacher-usable.
- Return JSON only.`;
