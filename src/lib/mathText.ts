const SUPERSCRIPT: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  '+': '⁺',
  '-': '⁻',
  '=': '⁼',
  '(': '⁽',
  ')': '⁾',
  n: 'ⁿ',
  i: 'ⁱ',
};

const SUBSCRIPT: Record<string, string> = {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',
  '+': '₊',
  '-': '₋',
  '=': '₌',
  '(': '₍',
  ')': '₎',
  a: 'ₐ',
  e: 'ₑ',
  h: 'ₕ',
  i: 'ᵢ',
  j: 'ⱼ',
  k: 'ₖ',
  l: 'ₗ',
  m: 'ₘ',
  n: 'ₙ',
  o: 'ₒ',
  p: 'ₚ',
  r: 'ᵣ',
  s: 'ₛ',
  t: 'ₜ',
  u: 'ᵤ',
  v: 'ᵥ',
  x: 'ₓ',
};

const COMMANDS: Record<string, string> = {
  '\\times': '×',
  '\\cdot': '·',
  '\\div': '÷',
  '\\pm': '±',
  '\\mp': '∓',
  '\\leq': '≤',
  '\\le': '≤',
  '\\geq': '≥',
  '\\ge': '≥',
  '\\neq': '≠',
  '\\ne': '≠',
  '\\approx': '≈',
  '\\angle': '∠',
  '\\degree': '°',
  '\\pi': 'π',
  '\\theta': 'θ',
  '\\alpha': 'α',
  '\\beta': 'β',
  '\\gamma': 'γ',
  '\\Delta': 'Δ',
  '\\infty': '∞',
};

export function formatMathText(value?: string | number | null): string {
  if (value == null) return '';
  let text = String(value);
  if (!text) return '';

  text = text
    .replace(/\\\((.*?)\\\)/g, '$1')
    .replace(/\\\[(.*?)\\\]/g, '$1')
    .replace(/\$([^$]+)\$/g, '$1');

  text = replaceCommandWithTwoGroups(text, '\\frac', (numerator, denominator) =>
    formatFraction(formatMathText(numerator), formatMathText(denominator)),
  );
  text = replaceCommandWithOneGroup(text, '\\sqrt', (radicand) => {
    const rendered = formatMathText(radicand);
    return rendered.length <= 4 ? `√${rendered}` : `√(${rendered})`;
  });
  text = replaceCommandWithOneGroup(text, '\\vec', formatVector);
  text = replaceCommandWithOneGroup(text, '\\overrightarrow', formatVector);

  text = text.replace(/([A-Za-z0-9)\]])\^\{([^{}]+)\}/g, (_, base, power) => `${base}${toSuperscript(power)}`);
  text = text.replace(/([A-Za-z0-9)\]])\^([A-Za-z0-9+\-=()]+)/g, (_, base, power) => `${base}${toSuperscript(power)}`);
  text = text.replace(/([A-Za-z0-9)\]])_\{([^{}]+)\}/g, (_, base, subscript) => `${base}${toSubscript(subscript)}`);
  text = text.replace(/([A-Za-z0-9)\]])_([A-Za-z0-9+\-=()]+)/g, (_, base, subscript) => `${base}${toSubscript(subscript)}`);

  for (const [command, symbol] of Object.entries(COMMANDS)) {
    text = text.replaceAll(command, symbol);
  }

  return text.replace(/\s+/g, ' ').trim();
}

function replaceCommandWithOneGroup(
  source: string,
  command: string,
  render: (value: string) => string,
) {
  let text = source;
  let index = text.indexOf(command);

  while (index >= 0) {
    const group = readGroup(text, index + command.length);
    if (!group) {
      index = text.indexOf(command, index + command.length);
      continue;
    }

    text = `${text.slice(0, index)}${render(group.value)}${text.slice(group.end)}`;
    index = text.indexOf(command, index + 1);
  }

  return text;
}

function replaceCommandWithTwoGroups(
  source: string,
  command: string,
  render: (first: string, second: string) => string,
) {
  let text = source;
  let index = text.indexOf(command);

  while (index >= 0) {
    const first = readGroup(text, index + command.length);
    const second = first ? readGroup(text, first.end) : null;
    if (!first || !second) {
      index = text.indexOf(command, index + command.length);
      continue;
    }

    text = `${text.slice(0, index)}${render(first.value, second.value)}${text.slice(second.end)}`;
    index = text.indexOf(command, index + 1);
  }

  return text;
}

function readGroup(source: string, start: number): { value: string; end: number } | null {
  let index = start;
  while (source[index] === ' ') index += 1;
  if (source[index] !== '{') return null;

  let depth = 0;
  for (let cursor = index; cursor < source.length; cursor += 1) {
    if (source[cursor] === '{') depth += 1;
    if (source[cursor] === '}') depth -= 1;
    if (depth === 0) {
      return {
        value: source.slice(index + 1, cursor),
        end: cursor + 1,
      };
    }
  }

  return null;
}

function formatFraction(numerator: string, denominator: string) {
  const compactNumerator = toSuperscript(numerator);
  const compactDenominator = toSubscript(denominator);
  if (compactNumerator && compactDenominator) return `${compactNumerator}⁄${compactDenominator}`;
  return `(${numerator})/(${denominator})`;
}

function formatVector(value: string) {
  return `${formatMathText(value)}⃗`;
}

function toSuperscript(value: string) {
  return mapScript(value, SUPERSCRIPT);
}

function toSubscript(value: string) {
  return mapScript(value, SUBSCRIPT);
}

function mapScript(value: string, map: Record<string, string>) {
  const normalized = formatMathText(value).replace(/\s+/g, '');
  if (!normalized) return '';

  let output = '';
  for (const char of normalized) {
    const mapped = map[char] ?? map[char.toLowerCase()];
    if (!mapped) return '';
    output += mapped;
  }
  return output;
}
