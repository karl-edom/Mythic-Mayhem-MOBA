// Shared helpers for the Pokémon Unite reference extraction.
// Zero dependencies: built-in fetch, node:fs, regex-based HTML handling.
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = resolve(here, '..', '..', '..');
export const CACHE_DIR = join(REPO_ROOT, '.cache', 'extract', 'unite');
export const OUT_DIR = join(REPO_ROOT, 'data', 'reference', 'unite');

const USER_AGENT = 'MythicMayhemResearch/0.1 (private hobby research)';
const MIN_INTERVAL_MS = 600; // <= ~1.7 requests/second
let lastRequestAt = 0;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Cache file path for a URL: readable slug + short hash to avoid collisions. */
export function cachePathFor(url: string): string {
  const u = new URL(url);
  const slug = (u.hostname + u.pathname + u.search)
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .slice(0, 150);
  const hash = createHash('sha1').update(url).digest('hex').slice(0, 8);
  return join(CACHE_DIR, `${slug}.${hash}`);
}

export interface FetchResult {
  url: string;
  body: string;
  fromCache: boolean;
  /** ISO timestamp of the original network retrieval (from the cache meta file). */
  retrievedAt: string;
}

/**
 * Fetch a URL as text, using the on-disk cache when present.
 * Set UNITE_REFRESH=1 to bypass the cache. Throws on non-2xx.
 */
export async function fetchCached(url: string): Promise<FetchResult> {
  const path = cachePathFor(url);
  const metaPath = `${path}.meta.json`;
  const refresh = process.env['UNITE_REFRESH'] === '1';
  if (!refresh && existsSync(path) && existsSync(metaPath)) {
    const meta = JSON.parse(readFileSync(metaPath, 'utf8')) as { retrievedAt: string };
    return { url, body: fixMojibake(readFileSync(path, 'utf8')), fromCache: true, retrievedAt: meta.retrievedAt };
  }
  const wait = lastRequestAt + MIN_INTERVAL_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastRequestAt = Date.now();
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: '*/*' } });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      const body = decodeBody(new Uint8Array(await res.arrayBuffer()), res.headers.get('content-type'));
      const retrievedAt = new Date().toISOString();
      mkdirSync(CACHE_DIR, { recursive: true });
      writeFileSync(path, body);
      writeFileSync(metaPath, JSON.stringify({ url, retrievedAt, status: res.status }, null, 2));
      process.stderr.write(`fetched ${url} (${body.length} bytes)\n`);
      return { url, body, fromCache: false, retrievedAt };
    } catch (err) {
      lastErr = err;
      if (String(err).includes('HTTP 404')) break;
      await sleep(1500 * (attempt + 1));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

/** Decode bytes using the charset from the Content-Type header or an HTML meta tag (default UTF-8). */
function decodeBody(bytes: Uint8Array, contentType: string | null): string {
  let charset = /charset=([\w-]+)/i.exec(contentType ?? '')?.[1];
  if (!charset) {
    const head = new TextDecoder('latin1').decode(bytes.slice(0, 4096));
    charset = /<meta[^>]+charset=["']?([\w-]+)/i.exec(head)?.[1];
  }
  const label = (charset ?? 'utf-8').toLowerCase();
  let text: string;
  try {
    text = new TextDecoder(label === 'iso-8859-1' ? 'windows-1252' : label).decode(bytes);
  } catch {
    text = new TextDecoder('utf-8').decode(bytes);
  }
  return fixMojibake(text);
}

/** Repair UTF-8 text that was double-decoded as windows-1252 upstream (e.g. "PokÃ©mon"). */
export function fixMojibake(s: string): string {
  if (!/[ÃÂâ][\u0080-\u00bf\u0152-\u2122]/.test(s)) return s;
  const cp1252: Record<string, number> = {
    '€': 0x80, '‚': 0x82, 'ƒ': 0x83, '„': 0x84, '…': 0x85, '†': 0x86, '‡': 0x87, 'ˆ': 0x88, '‰': 0x89,
    'Š': 0x8a, '‹': 0x8b, 'Œ': 0x8c, 'Ž': 0x8e, '‘': 0x91, '’': 0x92, '“': 0x93, '”': 0x94, '•': 0x95,
    '–': 0x96, '—': 0x97, '˜': 0x98, '™': 0x99, 'š': 0x9a, '›': 0x9b, 'œ': 0x9c, 'ž': 0x9e, 'Ÿ': 0x9f,
  };
  return s.replace(/[\u00c2-\u00f4][\u0080-\u00bf\u0152-\u2122]{1,3}/g, (seq) => {
    const bytes: number[] = [];
    for (const ch of seq) {
      const code = ch.codePointAt(0) ?? 0;
      const b = code <= 0xff ? code : cp1252[ch];
      if (b === undefined) return seq;
      bytes.push(b);
    }
    try {
      return new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array(bytes));
    } catch {
      return seq;
    }
  });
}

export async function fetchJson<T>(url: string): Promise<{ data: T; retrievedAt: string }> {
  const r = await fetchCached(url);
  return { data: JSON.parse(r.body) as T, retrievedAt: r.retrievedAt };
}

export function writeOut(relPath: string, content: unknown): void {
  const path = join(OUT_DIR, relPath);
  mkdirSync(dirname(path), { recursive: true });
  const text = typeof content === 'string' ? content : `${JSON.stringify(content, null, 2)}\n`;
  writeFileSync(path, text);
  process.stderr.write(`wrote ${path}\n`);
}

// ---------------------------------------------------------------------------
// Minimal HTML utilities (regex based; sufficient for the static pages used).
// ---------------------------------------------------------------------------

const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', eacute: 'é', times: '×',
  rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', ndash: '–', mdash: '—', hellip: '…',
  deg: '°', middot: '·', plusmn: '±', frac12: '½', rarr: '→', larr: '←', bull: '•',
};

export function decodeEntities(s: string): string {
  return s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, code: string) => {
    if (code.startsWith('#x') || code.startsWith('#X')) return String.fromCodePoint(parseInt(code.slice(2), 16));
    if (code.startsWith('#')) return String.fromCodePoint(parseInt(code.slice(1), 10));
    return ENTITIES[code] ?? m;
  });
}

/** Inner text of an HTML fragment: tags removed, <br> as newline, whitespace collapsed. */
export function textOf(html: string): string {
  const withBreaks = html
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, '\n');
  const stripped = decodeEntities(withBreaks.replace(/<[^>]+>/g, ''));
  return stripped
    .split('\n')
    .map((l) => l.replace(/[ \t\r\f\v ]+/g, ' ').trim())
    .filter((l) => l.length > 0)
    .join('\n');
}

/** Same as textOf but on a single line. */
export function cellText(html: string): string {
  return textOf(html).replace(/\n+/g, ' / ').trim();
}

export interface HtmlTable {
  /** Byte offset of the <table> in the source, used to keep document order. */
  start: number;
  end: number;
  rows: string[][];
  /** Raw HTML of each row's cells, parallel to rows. */
  rawRows: string[][];
}

/**
 * Extract innermost tables (tables containing no nested table) with their cells.
 * Colspans are not expanded; callers handle layout quirks.
 */
export function extractTables(html: string): HtmlTable[] {
  const tables: HtmlTable[] = [];
  const re = /<table\b[^>]*>((?:(?!<table\b)[\s\S])*?)<\/table>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const inner = m[1] ?? '';
    const rows: string[][] = [];
    const rawRows: string[][] = [];
    // Split on both <tr> and </tr>: some pages (Serebii) omit opening <tr> tags.
    for (const segment of inner.split(/<tr\b[^>]*>|<\/tr>/i)) {
      const cells: string[] = [];
      const raw: string[] = [];
      const cellRe = /<(td|th)\b[^>]*>([\s\S]*?)(?=<td\b|<th\b|$)/gi;
      let c: RegExpExecArray | null;
      while ((c = cellRe.exec(segment))) {
        const body = (c[2] ?? '').replace(/<\/t[dh]>\s*$/i, '');
        raw.push(body);
        cells.push(cellText(body));
      }
      if (cells.length > 0) {
        rows.push(cells);
        rawRows.push(raw);
      }
    }
    tables.push({ start: m.index, end: m.index + m[0].length, rows, rawRows });
  }
  return tables;
}

/** Render rows as a Markdown table (first row as header). */
export function toMarkdownTable(rows: string[][]): string {
  if (rows.length === 0) return '';
  const width = Math.max(...rows.map((r) => r.length));
  const esc = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' / ');
  const pad = (r: string[]) => Array.from({ length: width }, (_, i) => esc(r[i] ?? ''));
  const [head, ...body] = rows;
  const lines = [`| ${pad(head ?? []).join(' | ')} |`, `|${' --- |'.repeat(width)}`];
  for (const r of body) lines.push(`| ${pad(r).join(' | ')} |`);
  return lines.join('\n');
}

/**
 * Convert an HTML fragment into Markdown-ish text, keeping tables as Markdown
 * tables (innermost tables only; outer layout tables are flattened to text).
 */
export function htmlToMarkdown(html: string): string {
  let cleaned = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|noscript|iframe)\b[\s\S]*?<\/\1>/gi, '')
    // Keep image alt text (e.g. evolution "Level 5" icons, Pokémon names in picture cells).
    .replace(/<img\b[^>]*\balt="([^"]*)"[^>]*>/gi, (_m, alt: string) => (alt ? ` ${alt} ` : ''));
  cleaned = inlineSmallNestedTables(cleaned);
  const tables = extractTables(cleaned);
  const parts: string[] = [];
  let cursor = 0;
  for (const t of tables) {
    if (t.start < cursor) continue;
    const before = cleaned.slice(cursor, t.start);
    const txt = headingAwareText(before);
    if (txt) parts.push(txt);
    const md = toMarkdownTable(t.rows.filter((r) => r.some((c) => c.length > 0)));
    if (md) parts.push(md);
    cursor = t.end;
  }
  const tail = headingAwareText(cleaned.slice(cursor));
  if (tail) parts.push(tail);
  return parts.join('\n\n').replace(/\n{3,}/g, '\n\n');
}

/** Nesting depth (number of open <table>) at a given offset. */
function tableDepthAt(html: string, offset: number): number {
  let depth = 0;
  const re = /<(\/?)table\b/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) && m.index < offset) depth += m[1] ? -1 : 1;
  return depth;
}

/**
 * Replace small innermost tables that sit inside another table (e.g. a per-row
 * "Match Time / Base HP / Base XP" mini table) by inline "Header: value" text,
 * so the parent table can be rendered as a proper Markdown table.
 */
function inlineSmallNestedTables(html: string): string {
  const tables = extractTables(html).filter((t) => tableDepthAt(html, t.start) > 0);
  let out = html;
  for (const t of [...tables].reverse()) {
    const rows = t.rows.filter((r) => r.some((c) => c));
    if (rows.length < 2 || rows.length > 4) continue;
    const [head, ...body] = rows;
    if (!head || body.some((r) => r.length !== head.length)) continue;
    // Only header + numeric data rows (avoid mangling key/value layout tables).
    if (head.some((c) => /^\d/.test(c)) || !body.every((r) => r.some((c) => /^\d/.test(c)))) continue;
    const text = body
      .map((r) => r.map((c, i) => `${head[i] ?? ''}: ${c}`).join('; '))
      .join(' // ');
    out = `${out.slice(0, t.start)}<span>${text}</span>${out.slice(t.end)}`;
  }
  return out;
}

function headingAwareText(html: string): string {
  const withHeadings = html.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_m, lvl: string, inner: string) => {
    const level = Math.min(6, Number(lvl) + 1);
    return `\n${'#'.repeat(level)} ${cellText(inner)}\n`;
  });
  // Drop leftover table structure tags (outer layout tables), keep their text.
  return textOf(withHeadings.replace(/<\/?(table|tbody|thead|tr|td|th)\b[^>]*>/gi, '\n'));
}

/** Parse a number out of a string like "3,000", "10.5%", "+12". Returns null when absent. */
export function num(s: string | undefined | null): number | null {
  if (s === undefined || s === null) return null;
  const m = /-?\d[\d,]*(?:\.\d+)?|-?\.\d+/.exec(s.replace(/\s/g, ''));
  if (!m) return null;
  const v = Number(m[0].replace(/,/g, ''));
  return Number.isFinite(v) ? v : null;
}

export function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
