// Shared helpers for the League of Legends reference extraction.
// Polite, cache-aware HTTP (<= ~3 req/s, descriptive User-Agent), JSON output
// helpers, a tiny Lua data-table parser (wiki modules) and an HTML -> Markdown
// converter (wiki pages rendered by MediaWiki).
// Zero dependencies: Node 22 built-ins only.

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
export const CACHE_DIR = join(REPO_ROOT, ".cache/extract/lol");
export const OUT_DIR = join(REPO_ROOT, "data/reference/lol");
export const USER_AGENT = "MythicMayhemResearch/0.1 (private hobby research)";

export const DDRAGON = "https://ddragon.leagueoflegends.com";
export const CDRAGON = "https://raw.communitydragon.org/latest";
export const WIKI_API = "https://wiki.leagueoflegends.com/en-us/api.php";
export const WIKI_PAGE = "https://wiki.leagueoflegends.com/en-us/";

/** `--refresh` on the command line bypasses the cache (re-downloads). */
const REFRESH = process.argv.includes("--refresh");
const MIN_INTERVAL_MS = 350; // ~2.9 requests per second
let lastRequestAt = 0;

export type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
export type JsonObject = { [key: string]: Json };

function cachePathFor(url: string): string {
  const u = new URL(url);
  const safe = (u.pathname + (u.search ? "_" + u.search : ""))
    .replace(/[^A-Za-z0-9._/-]+/g, "_")
    .replace(/\/+/g, "/")
    .replace(/^\//, "");
  let path = join(CACHE_DIR, u.hostname, safe);
  if (path.length > 200 || u.search) {
    const h = createHash("sha1").update(url).digest("hex").slice(0, 12);
    path = join(CACHE_DIR, u.hostname, safe.slice(0, 120) + "." + h);
  }
  return path;
}

async function sleep(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

/**
 * Fetches a URL as text, using the on-disk cache when present.
 * Returns null on 404 (cached as a `.404` marker so reruns stay offline).
 */
export async function fetchText(url: string): Promise<string | null> {
  const path = cachePathFor(url);
  if (!REFRESH) {
    if (existsSync(path)) return readFileSync(path, "utf8");
    if (existsSync(path + ".404")) return null;
  }
  for (let attempt = 1; attempt <= 4; attempt++) {
    const wait = lastRequestAt + MIN_INTERVAL_MS - Date.now();
    if (wait > 0) await sleep(wait);
    lastRequestAt = Date.now();
    let res: Response;
    try {
      res = await fetch(url, { headers: { "User-Agent": USER_AGENT, Accept: "application/json, text/plain, */*" } });
    } catch (err) {
      if (attempt === 4) throw err;
      await sleep(1000 * attempt);
      continue;
    }
    if (res.status === 404) {
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path + ".404", "");
      return null;
    }
    if (res.status === 429 || res.status >= 500) {
      await sleep(2000 * attempt);
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    const text = await res.text();
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
    return text;
  }
  throw new Error(`Giving up on ${url}`);
}

export async function fetchJson<T = Json>(url: string): Promise<T | null> {
  const text = await fetchText(url);
  return text === null ? null : (JSON.parse(text) as T);
}

export async function latestDDragonVersion(): Promise<string> {
  // versions.json changes every patch: always re-fetch it unless offline cache only.
  const versions = await fetchJson<string[]>(`${DDRAGON}/api/versions.json`);
  const v = versions?.[0];
  if (!v) throw new Error("Cannot read Data Dragon versions");
  return v;
}

export function writeOutput(relPath: string, data: unknown): void {
  const path = join(OUT_DIR, relPath);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(data, null, 1) + "\n");
  console.log(`wrote ${path}`);
}

export function writeText(relPath: string, text: string): void {
  const path = join(OUT_DIR, relPath);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
  console.log(`wrote ${path}`);
}

export function isObject(v: unknown): v is JsonObject {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Rounds float32 noise (0.800000011920929 -> 0.8). */
export function clean(n: number): number {
  return Number.parseFloat(n.toPrecision(6));
}

// ---------------------------------------------------------------------------
// Wiki helpers
// ---------------------------------------------------------------------------

/** Raw source (wikitext or Lua) of a wiki page, via the MediaWiki API. */
export async function wikiSource(title: string): Promise<string | null> {
  const q = new URLSearchParams({
    action: "query",
    titles: title,
    prop: "revisions",
    rvprop: "content",
    rvslots: "main",
    redirects: "1",
    format: "json",
    formatversion: "2",
  });
  const data = await fetchJson<JsonObject>(`${WIKI_API}?${q.toString()}`);
  const pages = isObject(data) && isObject(data["query"]) ? data["query"]["pages"] : null;
  const page = Array.isArray(pages) ? pages[0] : null;
  if (!isObject(page) || !Array.isArray(page["revisions"])) return null;
  const rev = page["revisions"][0];
  if (!isObject(rev) || !isObject(rev["slots"]) || !isObject(rev["slots"]["main"])) return null;
  const content = rev["slots"]["main"]["content"];
  return typeof content === "string" ? content : null;
}

/** Rendered HTML of a wiki page (templates expanded), via action=parse. */
export async function wikiParse(title: string): Promise<{ title: string; html: string; revid: number | null } | null> {
  const q = new URLSearchParams({
    action: "parse",
    page: title,
    prop: "text|revid",
    redirects: "1",
    disableeditsection: "1",
    disabletoc: "1",
    format: "json",
    formatversion: "2",
  });
  const data = await fetchJson<JsonObject>(`${WIKI_API}?${q.toString()}`);
  const parse = isObject(data) ? data["parse"] : null;
  if (!isObject(parse) || typeof parse["text"] !== "string") return null;
  return {
    title: typeof parse["title"] === "string" ? parse["title"] : title,
    html: parse["text"],
    revid: typeof parse["revid"] === "number" ? parse["revid"] : null,
  };
}

// ---------------------------------------------------------------------------
// Minimal Lua table-constructor parser (for `return { ... }` data modules).
// Supports strings, numbers, booleans, nil, nested tables, [key]= / name= keys,
// positional entries and -- comments. Anything else throws.
// ---------------------------------------------------------------------------

/** Evaluates + - * / and parentheses on numeric literals (no identifiers). */
export function evalArithmetic(expr: string): number {
  const tokens = expr.match(/0x[0-9a-fA-F]+|\d+\.?\d*(?:[eE][-+]?\d+)?|\.\d+|[-+*\/()]/g) ?? [];
  let k = 0;
  const primary = (): number => {
    const t = tokens[k++];
    if (t === "(") {
      const v = sum();
      k++; // )
      return v;
    }
    if (t === "-") return -primary();
    if (t === "+") return primary();
    return Number(t);
  };
  const product = (): number => {
    let v = primary();
    while (tokens[k] === "*" || tokens[k] === "/") v = tokens[k++] === "*" ? v * primary() : v / primary();
    return v;
  };
  const sum = (): number => {
    let v = product();
    while (tokens[k] === "+" || tokens[k] === "-") v = tokens[k++] === "+" ? v + product() : v - product();
    return v;
  };
  return sum();
}

export function parseLuaTable(src: string): Json {
  let i = src.indexOf("return");
  if (i < 0) throw new Error("No `return` in Lua module");
  i += "return".length;

  const ws = (): void => {
    for (;;) {
      while (i < src.length && /\s/.test(src[i] ?? "")) i++;
      if (src.startsWith("--[[", i)) {
        const end = src.indexOf("]]", i);
        i = end < 0 ? src.length : end + 2;
      } else if (src.startsWith("--", i)) {
        const end = src.indexOf("\n", i);
        i = end < 0 ? src.length : end + 1;
      } else return;
    }
  };

  const parseString = (): string => {
    const q = src[i];
    if (q === "[") {
      // long bracket string [[...]] or [==[...]==]
      const m = /^\[(=*)\[/.exec(src.slice(i, i + 20));
      if (!m) throw new Error(`Bad long string at ${i}`);
      const close = "]" + (m[1] ?? "") + "]";
      const end = src.indexOf(close, i + m[0].length);
      const s = src.slice(i + m[0].length, end);
      i = end + close.length;
      return s;
    }
    i++;
    let out = "";
    while (i < src.length && src[i] !== q) {
      const c = src[i] ?? "";
      if (c === "\\") {
        const n = src[i + 1] ?? "";
        const map: Record<string, string> = { n: "\n", t: "\t", r: "\r", '"': '"', "'": "'", "\\": "\\" };
        out += map[n] ?? n;
        i += 2;
      } else {
        out += c;
        i++;
      }
    }
    i++;
    return out;
  };

  const parseValue = (): Json => {
    ws();
    const c = src[i];
    if (c === "{") return parseTable();
    if (c === '"' || c === "'" || (c === "[" && /^\[=*\[/.test(src.slice(i, i + 10)))) return parseString();
    // numbers, including simple constant arithmetic such as `84+1000/17`
    const m = /^(?:-|\()*(?:0x[0-9a-fA-F]+|\d+\.?\d*(?:[eE][-+]?\d+)?|\.\d+)(?:[\s()]*[-+*\/][\s()-]*(?:\d+\.?\d*|\.\d+)\)*)*/.exec(src.slice(i, i + 80));
    if (m) {
      i += m[0].length;
      return evalArithmetic(m[0]);
    }
    for (const [word, val] of [["true", true], ["false", false], ["nil", null]] as const) {
      if (src.startsWith(word, i) && !/\w/.test(src[i + word.length] ?? "")) {
        i += word.length;
        return val;
      }
    }
    throw new Error(`Unexpected Lua token at ${i}: ${src.slice(i, i + 40)}`);
  };

  const parseTable = (): Json => {
    i++; // {
    const obj: JsonObject = {};
    const arr: Json[] = [];
    let keyed = false;
    for (;;) {
      ws();
      if (src[i] === "}") {
        i++;
        break;
      }
      let key: string | null = null;
      if (src[i] === "[" && !/^\[=*\[/.test(src.slice(i, i + 10))) {
        i++;
        const k = parseValue();
        ws();
        if (src[i] !== "]") throw new Error(`Expected ] at ${i}`);
        i++;
        ws();
        if (src[i] !== "=") throw new Error(`Expected = at ${i}`);
        i++;
        key = String(k);
      } else {
        const m = /^([A-Za-z_]\w*)\s*=(?!=)/.exec(src.slice(i, i + 80));
        if (m) {
          key = m[1] ?? "";
          i += m[0].length;
        }
      }
      const v = parseValue();
      if (key === null) arr.push(v);
      else {
        keyed = true;
        obj[key] = v;
      }
      ws();
      if (src[i] === "," || src[i] === ";") i++;
    }
    if (!keyed) return arr;
    arr.forEach((v, idx) => {
      obj[String(idx + 1)] = v;
    });
    return obj;
  };

  return parseValue();
}

// ---------------------------------------------------------------------------
// HTML -> Markdown (good enough for MediaWiki output; keeps tables).
// ---------------------------------------------------------------------------

const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—",
  times: "×", minus: "−", le: "≤", ge: "≥", divide: "÷", middot: "·", hellip: "…", rarr: "→",
  larr: "←", plusmn: "±", deg: "°", frac12: "½", frac14: "¼", frac34: "¾", bull: "•", prime: "′",
};

export function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z0-9]+);/g, (m, e: string) => {
    if (e.startsWith("#x")) return String.fromCodePoint(Number.parseInt(e.slice(2), 16));
    if (e.startsWith("#")) return String.fromCodePoint(Number.parseInt(e.slice(1), 10));
    return ENTITIES[e] ?? m;
  });
}

/** Inline HTML -> markdown text (no block structure). */
function inline(html: string): string {
  let s = html;
  s = s.replace(/<br\s*\/?>/gi, " ");
  s = s.replace(/<img[^>]*alt="([^"]*)"[^>]*>/gi, (_m, alt: string) => (alt && !/\.(png|jpg|gif|svg)$/i.test(alt) ? alt : ""));
  s = s.replace(/<(b|strong)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_m, _t, inner: string) => {
    const t = inner.trim();
    return t ? `**${t}**` : "";
  });
  s = s.replace(/<(i|em)\b[^>]*>([\s\S]*?)<\/\1>/gi, (_m, _t, inner: string) => {
    const t = inner.trim();
    return t ? `*${t}*` : "";
  });
  s = s.replace(/<sup\b[^>]*class="[^"]*reference[^"]*"[^>]*>[\s\S]*?<\/sup>/gi, "");
  s = s.replace(/<sup\b[^>]*>([\s\S]*?)<\/sup>/gi, "^$1");
  s = s.replace(/<sub\b[^>]*>([\s\S]*?)<\/sub>/gi, "_$1");
  s = s.replace(/<[^>]+>/g, "");
  s = decodeEntities(s);
  return s.replace(/[ \t\r\n]+/g, " ").trim();
}

function tableToMarkdown(tableHtml: string): string {
  const rows: string[][] = [];
  const caption = /<caption[^>]*>([\s\S]*?)<\/caption>/i.exec(tableHtml);
  const rowRe = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
  // rowspan carry-over: column index -> [remaining rows, text]
  const carry = new Map<number, [number, string]>();
  for (let m = rowRe.exec(tableHtml); m; m = rowRe.exec(tableHtml)) {
    const cells: string[] = [];
    const cellRe = /<(td|th)\b([^>]*)>([\s\S]*?)(?=<\/?(?:td|th)\b[^>]*>|$)/gi;
    let col = 0;
    const pushCarry = (): void => {
      for (let c = carry.get(col); c; c = carry.get(col)) {
        cells.push(c[1]);
        if (c[0] <= 1) carry.delete(col);
        else carry.set(col, [c[0] - 1, c[1]]);
        col++;
      }
    };
    const body = m[1] ?? "";
    for (let c = cellRe.exec(body); c; c = cellRe.exec(body)) {
      const attrs = c[2] ?? "";
      const raw = (c[3] ?? "").replace(/<\/(td|th)>\s*$/i, "");
      if (/^\s*$/.test(raw) && /<\/(td|th)>/i.test(raw) === false && c[0].length === 0) continue;
      pushCarry();
      const text = inline(raw).replace(/\|/g, "\\|") || " ";
      const colspan = Number(/colspan="?(\d+)/i.exec(attrs)?.[1] ?? "1");
      const rowspan = Number(/rowspan="?(\d+)/i.exec(attrs)?.[1] ?? "1");
      for (let k = 0; k < colspan; k++) {
        if (rowspan > 1) carry.set(col, [rowspan - 1, text]);
        cells.push(text);
        col++;
      }
    }
    pushCarry();
    if (cells.length) rows.push(cells);
  }
  if (!rows.length) return "";
  const width = Math.max(...rows.map((r) => r.length));
  const pad = (r: string[]): string[] => [...r, ...Array<string>(width - r.length).fill(" ")];
  const [head, ...rest] = rows;
  const out = [`| ${pad(head ?? []).join(" | ")} |`, `|${" --- |".repeat(width)}`];
  for (const r of rest) out.push(`| ${pad(r).join(" | ")} |`);
  const cap = caption ? `*${inline(caption[1] ?? "")}*\n\n` : "";
  return `\n\n${cap}${out.join("\n")}\n\n`;
}

/** Converts MediaWiki-rendered HTML to Markdown, keeping tables and lists. */
export function htmlToMarkdown(html: string): string {
  let s = html;
  // drop noise
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  s = s.replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/gi, "");
  s = s.replace(/<span[^>]*class="[^"]*mw-editsection[^"]*"[^>]*>[\s\S]*?<\/span>\s*<\/span>/gi, "");
  // tables (innermost first, repeat for nesting)
  for (let guard = 0; guard < 20 && /<table\b/i.test(s); guard++) {
    s = s.replace(/<table\b[^>]*>((?:(?!<table\b)[\s\S])*?)<\/table>/gi, (m) => {
      if (/class="[^"]*navbox/i.test(m.slice(0, 300))) return "";
      return tableToMarkdown(m);
    });
  }
  // headings
  s = s.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_m, lvl: string, inner: string) => `\n\n${"#".repeat(Math.min(6, Number(lvl)))} ${inline(inner)}\n\n`);
  // definition lists (wiki uses ; term : def)
  s = s.replace(/<dt\b[^>]*>([\s\S]*?)<\/dt>/gi, (_m, inner: string) => `\n**${inline(inner)}**\n`);
  s = s.replace(/<dd\b[^>]*>([\s\S]*?)<\/dd>/gi, (_m, inner: string) => `\n> ${inline(inner)}\n`);
  // lists: handle nesting by tracking depth
  let depth = 0;
  s = s.replace(/<(\/?)(ul|ol|li)\b[^>]*>/gi, (_m, close: string, tag: string) => {
    const t = tag.toLowerCase();
    if (t === "ul" || t === "ol") {
      depth += close ? -1 : 1;
      if (depth < 0) depth = 0;
      return "\n";
    }
    if (close) return "\n";
    return `\n${"  ".repeat(Math.max(0, depth - 1))}- `;
  });
  s = s.replace(/<p\b[^>]*>/gi, "\n\n").replace(/<\/p>/gi, "\n\n");
  s = s.replace(/<div\b[^>]*>/gi, "\n").replace(/<\/div>/gi, "\n");
  // process remaining inline per line, preserving markdown table lines
  const lines = s.split("\n").map((line) => {
    if (/^\s*\|/.test(line)) return line;
    const lead = /^(\s*(?:- |> |#+ )?)/.exec(line)?.[1] ?? "";
    const body = inline(line.slice(lead.length));
    return body ? lead + body : lead.trim() === "-" ? "" : lead.trim() ? lead + body : "";
  });
  return lines
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s+|\s+$/g, "")
    .concat("\n");
}
