import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFile } from 'node:child_process';
import StreamZip from 'node-stream-zip';

export async function extractSchemeTextFromUpload(fileName, fileBase64) {
  const extension = extname(fileName).toLowerCase();

  if (extension === '.docx') {
    return extractDocxText(Buffer.from(fileBase64, 'base64'));
  }

  if (extension === '.pdf') {
    return extractPdfText(Buffer.from(fileBase64, 'base64'));
  }

  throw new Error('Only PDF and DOCX scheme uploads are supported for parsing right now.');
}

async function extractDocxText(buffer) {
  const tempDir = await mkdtemp(join(tmpdir(), 'scheme-docx-'));
  const docxPath = join(tempDir, 'upload.docx');

  try {
    await writeFile(docxPath, buffer);
    const zip = new StreamZip.async({ file: docxPath });
    try {
      const xmlBuffer = await zip.entryData('word/document.xml');
      const xml = xmlBuffer.toString('utf8');
      return extractDocumentXmlText(xml);
    } finally {
      await zip.close();
    }
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

async function extractPdfText(buffer) {
  const tempDir = await mkdtemp(join(tmpdir(), 'scheme-pdf-'));
  const pdfPath = join(tempDir, 'upload.pdf');

  try {
    await writeFile(pdfPath, buffer);
    const pythonCode = [
      'import pdfplumber, sys',
      `pdf = pdfplumber.open(r"""${pdfPath}""")`,
      'parts = []',
      'for page in pdf.pages:',
      '    text = page.extract_text() or ""',
      '    if text.strip():',
      '        parts.append(text)',
      'sys.stdout.buffer.write("\\n\\n".join(parts).encode("utf-8", "replace"))',
    ].join('\n');

    return await execFileText('python3', ['-c', pythonCode]).catch(() =>
      execFileText('python', ['-c', pythonCode])
    );
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

async function execFileText(command, args) {
  return new Promise((resolvePromise, rejectPromise) => {
    execFile(command, args, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        rejectPromise(
          new Error(
            stderr?.trim()
              ? `Document parsing failed: ${stderr.trim()}`
              : `Document parsing failed: ${error.message}`
          )
        );
        return;
      }
      resolvePromise(stdout);
    });
  });
}

function decodeXmlEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#160;/g, ' ')
    .replace(/&#xA;/gi, '\n');
}

function extractDocumentXmlText(xml) {
  const bodyMatch = xml.match(/<w:body\b[^>]*>([\s\S]*?)<\/w:body>/);
  const bodyXml = bodyMatch ? bodyMatch[1] : xml;
  const parts = [];
  let cursor = 0;
  const tablePattern = /<w:tbl\b[\s\S]*?<\/w:tbl>/g;
  let tableMatch;

  while ((tableMatch = tablePattern.exec(bodyXml))) {
    const beforeTable = bodyXml.slice(cursor, tableMatch.index);
    parts.push(...extractParagraphTexts(beforeTable));
    parts.push(extractTableText(tableMatch[0]));
    cursor = tableMatch.index + tableMatch[0].length;
  }

  parts.push(...extractParagraphTexts(bodyXml.slice(cursor)));

  return parts
    .map((part) => cleanExtractedText(part))
    .filter(Boolean)
    .join('\n')
    .trim();
}

function extractTableText(tableXml) {
  const rows = [];
  const rowMatches = tableXml.match(/<w:tr\b[\s\S]*?<\/w:tr>/g) || [];

  for (const rowXml of rowMatches) {
    const cellMatches = rowXml.match(/<w:tc\b[\s\S]*?<\/w:tc>/g) || [];
    const cells = cellMatches.map((cellXml) => {
      const paragraphs = extractParagraphTexts(cellXml);
      return cleanExtractedText(paragraphs.join('; '));
    });

    if (cells.some(Boolean)) {
      rows.push(cells.join('\t'));
    }
  }

  return rows.join('\n');
}

function extractParagraphTexts(xml) {
  const paragraphs = [];
  const paragraphMatches = xml.match(/<w:p\b[\s\S]*?<\/w:p>/g) || [];

  for (const paragraphXml of paragraphMatches) {
    const textRuns = [];
    const runPattern = /<w:t\b[^>]*>([\s\S]*?)<\/w:t>|<w:tab\/>|<w:br\/>/g;
    let runMatch;

    while ((runMatch = runPattern.exec(paragraphXml))) {
      if (runMatch[0] === '<w:tab/>') {
        textRuns.push('\t');
      } else if (runMatch[0] === '<w:br/>') {
        textRuns.push('\n');
      } else {
        textRuns.push(runMatch[1] || '');
      }
    }

    const text = cleanExtractedText(textRuns.join(''));
    if (text) paragraphs.push(text);
  }

  return paragraphs;
}

function cleanExtractedText(text) {
  return decodeXmlEntities(String(text || ''))
    .replace(/\s+\n/g, '\n')
    .replace(/\n\s+/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}
