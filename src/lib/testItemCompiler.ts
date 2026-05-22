import type { CompiledTestItem } from '@/types/testItemCompiler';

export function buildTestItemsHeading(input: {
  subject: string;
  classLevel: string;
  termTitle?: string;
}) {
  const term = formatTermLabel(input.termTitle);
  const classTerm = [input.classLevel, term].filter(Boolean).join('-');
  return `${input.subject} (${classTerm}) Test Items`.toUpperCase();
}

export function buildTestItemsWeekLine(items: Pick<CompiledTestItem, 'week'>[]) {
  const weeks = [...new Set(items.map((item) => item.week).filter((week) => Number.isFinite(week)))]
    .sort((a, b) => a - b);
  if (!weeks.length) return '';
  if (weeks.length === 1) return `Week ${weeks[0]}`;
  return `Week ${weeks[0]}-${weeks[weeks.length - 1]}`;
}

export function formatTermLabel(termTitle?: string) {
  const text = termTitle?.trim() ?? '';
  const digitMatch = text.match(/\bterm\s*(\d+)\b/i) || text.match(/\b(\d+)(?:st|nd|rd|th)?\s*term\b/i);
  if (digitMatch?.[1]) return `Term${digitMatch[1]}`;

  if (/\bfirst\b/i.test(text)) return 'Term1';
  if (/\bsecond\b/i.test(text)) return 'Term2';
  if (/\bthird\b/i.test(text)) return 'Term3';

  return text.replace(/\s+/g, '') || 'Term';
}
