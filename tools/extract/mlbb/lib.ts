// Shared helpers for the MLBB Fandom wiki extraction (zero dependencies).
// - politeFetch: cached, rate-limited access to the MediaWiki API
// - parseLuaTable: parser for the Lua data modules (Module:Hero/data, ...)
// - template helpers: parse {{Template|a=b|...}} calls from wikitext
// - wikitextToMarkdown: best-effort cleanup that keeps tables
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
export const CACHE_DIR = join(REPO_ROOT, ".cache/extract/mlbb");
export const OUT_DIR = join(REPO_ROOT, "data/reference/mlbb");
export const WIKI = "https://mobile-legends.fandom.com";
export const API = `${WIKI}/api.php`;
export const SOURCE = "Mobile Legends: Bang Bang Wiki (mobile-legends.fandom.com), CC BY-SA 3.0";
const USER_AGENT = "MythicMayhemResearch/0.1 (private hobby research)";
const MIN_INTERVAL_MS = 600; // <= ~1.7 requests/second

let lastRequest = 0;
const REFRESH = process.argv.includes("--refresh");

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function pageUrl(title: string): string {
  return `${WIKI}/wiki/${encodeURIComponent(title.replace(/ /g, "_")).replace(/%2F/g, "/").replace(/%3A/g, ":")}`;
}

/** GET the API with the given params; responses are cached on disk by query string. */
export async function apiGet(params: Record<string, string>): Promise<unknown> {
  const qs = new URLSearchParams({ format: "json", formatversion: "2", ...params });
  const key = createHash("sha1").update(qs.toString()).digest("hex");
  const file = join(CACHE_DIR, "api", `${key}.json`);
  if (!REFRESH && existsSync(file)) {
    const cached = JSON.parse(readFileSync(file, "utf8")) as { query: string; body: unknown };
    return cached.body;
  }
  for (let attempt = 0; attempt < 4; attempt++) {
    const wait = lastRequest + MIN_INTERVAL_MS - Date.now();
    if (wait > 0) await sleep(wait);
    lastRequest = Date.now();
    try {
      const res = await fetch(`${API}?${qs.toString()}`, { headers: { "User-Agent": USER_AGENT } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = (await res.json()) as unknown;
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, JSON.stringify({ query: qs.toString(), fetchedAt: new Date().toISOString(), body }));
      return body;
    } catch (err) {
      if (attempt === 3) throw err;
      await sleep(2000 * (attempt + 1));
    }
  }
  throw new Error("unreachable");
}

function asRecord(v: unknown): Record<string, unknown> {
  return v !== null && typeof v === "object" ? (v as Record<string, unknown>) : {};
}

/** Raw wikitext of a page (follows redirects). Returns null if the page is missing. */
export async function getWikitext(title: string): Promise<{ title: string; text: string } | null> {
  const body = asRecord(
    await apiGet({ action: "query", prop: "revisions", rvprop: "content", rvslots: "main", titles: title, redirects: "1" }),
  );
  const pages = asRecord(body["query"])["pages"];
  if (!Array.isArray(pages) || pages.length === 0) return null;
  const page = asRecord(pages[0]);
  if (page["missing"] === true || page["invalid"] === true) return null;
  const revs = page["revisions"];
  if (!Array.isArray(revs) || revs.length === 0) return null;
  const content = asRecord(asRecord(asRecord(revs[0])["slots"])["main"])["content"];
  return typeof content === "string" ? { title: String(page["title"]), text: content } : null;
}

/** All members of a category (namespace filter optional). */
export async function categoryMembers(category: string, ns = "0|14"): Promise<{ title: string; ns: number }[]> {
  const out: { title: string; ns: number }[] = [];
  let cont: string | undefined;
  do {
    const params: Record<string, string> = {
      action: "query",
      list: "categorymembers",
      cmtitle: category.startsWith("Category:") ? category : `Category:${category}`,
      cmlimit: "500",
      cmnamespace: ns,
    };
    if (cont) params["cmcontinue"] = cont;
    const body = asRecord(await apiGet(params));
    const members = asRecord(body["query"])["categorymembers"];
    if (Array.isArray(members)) {
      for (const m of members) {
        const r = asRecord(m);
        out.push({ title: String(r["title"]), ns: Number(r["ns"]) });
      }
    }
    const c = asRecord(body["continue"])["cmcontinue"];
    cont = typeof c === "string" ? c : undefined;
  } while (cont);
  return out;
}

// ---------------------------------------------------------------------------
// Lua table literal parser (subset: tables, strings, numbers, booleans, nil, comments)
// ---------------------------------------------------------------------------
export type LuaValue = string | number | boolean | null | LuaTable;
export interface LuaTable {
  [key: string]: LuaValue;
}

export function parseLuaTable(src: string): LuaTable {
  let i = src.indexOf("return");
  if (i < 0) throw new Error("no return statement");
  i += 6;
  const skip = (): void => {
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
      const m = /^\[(=*)\[/.exec(src.slice(i));
      if (!m) throw new Error(`bad long string at ${i}`);
      const close = `]${m[1] ?? ""}]`;
      const end = src.indexOf(close, i + m[0].length);
      const s = src.slice(i + m[0].length, end);
      i = end + close.length;
      return s;
    }
    i++;
    let s = "";
    while (i < src.length && src[i] !== q) {
      const ch = src[i] ?? "";
      if (ch === "\\") {
        const n = src[i + 1] ?? "";
        s += n === "n" ? "\n" : n === "t" ? "\t" : n;
        i += 2;
      } else {
        s += ch;
        i++;
      }
    }
    i++;
    return s;
  };
  const parseValue = (): LuaValue => {
    skip();
    const ch = src[i];
    if (ch === "{") return parseTable();
    if (ch === '"' || ch === "'" || (ch === "[" && /^\[=*\[/.test(src.slice(i, i + 10)))) return parseString();
    const m = /^(true|false|nil|-?[0-9.]+(?:[eE][-+]?\d+)?)/.exec(src.slice(i, i + 40));
    if (!m) throw new Error(`unexpected token at ${i}: ${src.slice(i, i + 30)}`);
    i += m[0].length;
    if (m[0] === "true") return true;
    if (m[0] === "false") return false;
    if (m[0] === "nil") return null;
    return Number(m[0]);
  };
  const parseTable = (): LuaTable => {
    i++; // {
    const t: LuaTable = {};
    let idx = 1;
    for (;;) {
      skip();
      if (src[i] === "}") {
        i++;
        return t;
      }
      let key: string;
      if (src[i] === "[" && !/^\[=*\[/.test(src.slice(i, i + 10))) {
        i++;
        const k = parseValue();
        skip();
        if (src[i] !== "]") throw new Error(`expected ] at ${i}`);
        i++;
        skip();
        i++; // =
        key = String(k);
      } else {
        const m = /^([A-Za-z_][A-Za-z0-9_]*)\s*=(?!=)/.exec(src.slice(i, i + 80));
        if (m) {
          key = m[1] ?? "";
          i += m[0].length;
        } else {
          key = String(idx++);
        }
      }
      t[key] = parseValue();
      skip();
      if (src[i] === "," || src[i] === ";") i++;
    }
  };
  skip();
  if (src[i] !== "{") throw new Error("return value is not a table");
  return parseTable();
}

// ---------------------------------------------------------------------------
// Wikitext template parsing
// ---------------------------------------------------------------------------
export interface TemplateCall {
  name: string;
  positional: string[];
  named: Record<string, string>;
  start: number;
  end: number;
}

/** Find the matching end of a {{...}} starting at `start` (index of the first "{"). */
function matchBraces(text: string, start: number): number {
  let depth = 0;
  let i = start;
  while (i < text.length) {
    if (text.startsWith("{{", i)) {
      depth++;
      i += 2;
    } else if (text.startsWith("}}", i)) {
      depth--;
      i += 2;
      if (depth === 0) return i;
    } else i++;
  }
  return text.length;
}

/** Split a template body on top-level "|" (ignoring pipes inside {{ }}, [[ ]] and tables). */
function splitTopLevel(body: string): string[] {
  const parts: string[] = [];
  let depthT = 0;
  let depthL = 0;
  let cur = "";
  for (let i = 0; i < body.length; i++) {
    if (body.startsWith("{{", i)) {
      depthT++;
      cur += "{{";
      i++;
    } else if (body.startsWith("}}", i)) {
      depthT--;
      cur += "}}";
      i++;
    } else if (body.startsWith("[[", i)) {
      depthL++;
      cur += "[[";
      i++;
    } else if (body.startsWith("]]", i)) {
      depthL--;
      cur += "]]";
      i++;
    } else if (body[i] === "|" && depthT === 0 && depthL === 0) {
      parts.push(cur);
      cur = "";
    } else cur += body[i];
  }
  parts.push(cur);
  return parts;
}

/** All top-level-or-nested calls to templates whose name matches `pred`. */
export function findTemplates(text: string, pred: (name: string) => boolean): TemplateCall[] {
  const out: TemplateCall[] = [];
  let i = 0;
  while ((i = text.indexOf("{{", i)) >= 0) {
    const end = matchBraces(text, i);
    const inner = text.slice(i + 2, end - 2);
    const parts = splitTopLevel(inner);
    const name = (parts[0] ?? "").trim();
    if (pred(name.replace(/_/g, " ").toLowerCase())) {
      const positional: string[] = [];
      const named: Record<string, string> = {};
      for (const p of parts.slice(1)) {
        const eq = p.indexOf("=");
        const before = eq >= 0 ? p.slice(0, eq) : "";
        if (eq >= 0 && !before.includes("{{") && !before.includes("[[") && !before.includes("<")) {
          named[before.trim()] = p.slice(eq + 1).trim();
        } else positional.push(p.trim());
      }
      out.push({ name, positional, named, start: i, end });
      i = end;
    } else i += 2;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Wikitext -> plain text / markdown
// ---------------------------------------------------------------------------
const SCALE_LABELS: Record<string, string> = {
  level: "× Hero Level",
  "total-pa": "% Total Physical Attack",
  "extra-pa": "% Extra Physical Attack",
  "extra-atk-spd": "% Extra Attack Speed",
  "total-mp": "% Total Magic Power",
  "total-ma": "% Total Magic Power",
  "total-hp": "% Total HP",
  "extra-hp": "% Extra HP",
  "max-hp": "% Max HP",
  "current-hp": "% Current HP",
  "lost-hp": "% Lost HP",
  "total-mana": "% Total Mana",
  "total-pdef": "% Total Physical Defense",
  "total-mdef": "% Total Magic Defense",
  lifesteal: "× Lifesteal",
};
const DAMAGE_LABELS: Record<string, string> = {
  pd: "Physical Damage",
  cpd: "Critical Physical Damage",
  "extra-md": "extra Magic Damage",
  md: "Magic Damage",
  cmd: "Critical Magic Damage",
  td: "True Damage",
  "extra-td": "Extra True Damage",
  hp: "HP",
  "max-hp": "HP",
  mana: "Mana",
  shield: "shield",
};
export { SCALE_LABELS, DAMAGE_LABELS };

function renderScale(t: TemplateCall): string {
  const bits: string[] = [];
  const base = t.named["base"];
  if (base) bits.push(base);
  for (const [k, label] of Object.entries(SCALE_LABELS)) {
    const v = t.named[k];
    if (v) bits.push(k === "level" ? `(+${v} ${label})` : `(+${v}${label})`);
  }
  const dmg = t.positional[0] ? DAMAGE_LABELS[t.positional[0]] ?? t.positional[0] : "";
  return [bits.join(" "), dmg].filter(Boolean).join(" ");
}

/** Expand / strip inline templates to readable text. */
function renderInlineTemplates(text: string): string {
  let guard = 0;
  for (;;) {
    // innermost template first: one without nested "{{"
    const m = /\{\{([^{}]*)\}\}/.exec(text);
    if (!m || guard++ > 5000) break;
    const inner = m[1] ?? "";
    const call = findTemplates(`{{${inner}}}`, () => true)[0];
    let rep = "";
    if (call) {
      const n = call.name.toLowerCase().replace(/_/g, " ");
      const p0 = call.positional[0] ?? "";
      const p1 = call.positional[1] ?? "";
      if (n === "scale") rep = renderScale(call);
      else if (["hi", "ii", "ai", "si", "ei", "bsi", "ti", "avc1", "avc", "aq", "a", "b", "c", "sl", "link", "ci", "cci", "ri", "icon"].includes(n))
        rep = p1 && p1.length > 1 ? p1 : p0;
      else if (n === "!") rep = "|";
      else if (n === "=") rep = "=";
      else if (n === "pci") rep = `[${p0}]`;
      else if (n.startsWith("#expr") || n.startsWith("#if") || n.startsWith("#switch")) rep = "";
      else if (["cite", "citation needed", "verify", "clarify", "fact", "hero navigation", "toc", "clr", "clear", "-"].includes(n)) rep = "";
      else if (n === "tooltip" || n === "tt") rep = p0;
      else if (n === "color" || n === "colour" || n === "font color" || n === "fc") rep = p1 || p0;
      else if (n === "quote") rep = `> ${p0}${p1 ? ` — ${p1}` : ""}`;
      else if (n === "nowrap" || n === "small" || n === "big") rep = p0;
      else if (n === "main" || n === "see also" || n === "further") rep = `(See: ${call.positional.join(", ")})`;
      else if (call.positional.length === 1 && Object.keys(call.named).length === 0 && p0.length < 60 && /^[A-Z]/.test(p0) && n.length <= 12)
        rep = p0;
      else if (call.positional.length === 0 && Object.keys(call.named).length === 0) rep = `[template:${call.name}]`;
      else {
        // unknown template: keep its content (positional text, then key: value pairs)
        const named = Object.entries(call.named).map(([k, v]) => `${k}: ${v}`);
        rep = [...call.positional, ...named].filter(Boolean).join("; ");
      }
    }
    text = text.slice(0, m.index) + rep + text.slice(m.index + m[0].length);
  }
  return text;
}

const ENTITIES: Record<string, string> = {
  "&times;": "×",
  "&ndash;": "–",
  "&mdash;": "—",
  "&nbsp;": " ",
  "&amp;": "&",
  "&#32;": " ",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&le;": "≤",
  "&ge;": "≥",
  "&plusmn;": "±",
  "&rarr;": "→",
  "&#39;": "'",
};

function decodeEntities(s: string): string {
  return s.replace(/&[a-z#0-9]+;/gi, (e) => ENTITIES[e] ?? e);
}

function renderLinks(s: string): string {
  // files / categories / interlanguage dropped
  s = s.replace(/\[\[(?:File|Image|Category|[a-z]{2}(?:-[a-z]+)?):[^\]]*(?:\[\[[^\]]*\]\][^\]]*)*\]\]/gi, "");
  s = s.replace(/\[\[([^\]|]*)\|([^\]]*)\]\]/g, "$2");
  s = s.replace(/\[\[([^\]]*)\]\]/g, (_m, a: string) => a.replace(/^#/, ""));
  s = s.replace(/\[(https?:\/\/[^\s\]]+)\s+([^\]]+)\]/g, "$2");
  s = s.replace(/\[(https?:\/\/[^\s\]]+)\]/g, "$1");
  return s;
}

/**
 * Hide braces inside <math> (LaTeX "{{" breaks template brace matching).
 * Masked text is restored by wikiToText / wikitextToMarkdown.
 */
export function maskMath(s: string): string {
  return s.replace(/<math>([\s\S]*?)<\/math>/g, (_m, a: string) => `<math>${a.replace(/\{/g, "\u0001").replace(/\}/g, "\u0002")}</math>`);
}

function unmask(s: string): string {
  return s.replace(/\u0001/g, "{").replace(/\u0002/g, "}");
}

/** Wikitext fragment -> single-paragraph plain text (used for skill/item descriptions). */
export function wikiToText(s: string): string {
  s = maskMath(s);
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  s = s.replace(/<ref[^>]*\/>/g, "").replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, "");
  s = s.replace(/<math>([\s\S]*?)<\/math>/g, (_m, a: string) => `$${a.trim()}$`);
  s = renderInlineTemplates(s);
  s = renderLinks(s);
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<\/?(span|font|div|small|big|sup|sub|center|u|s|nowiki|b|i|p|code|poem|abbr|tt)[^>]*>/gi, "");
  s = s.replace(/'''''|'''|''/g, "");
  s = unmask(decodeEntities(s));
  return s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n");
}

function convertTable(block: string): string {
  // MediaWiki table -> markdown table (colspan/rowspan flattened)
  const rows: string[][] = [];
  let caption = "";
  let cur: string[] | null = null;
  let headerRow = -1;
  const cellText = (c: string): string => {
    const parts = splitTopLevel(c);
    const val = parts.length > 1 && !/\[\[|\{\{/.test(parts[0] ?? "") && /=/.test(parts[0] ?? "") ? parts.slice(1).join("|") : c;
    return wikiToText(val).replace(/\n/g, "<br>").replace(/\|/g, "\\|");
  };
  const lines = block.split("\n");
  for (const raw of lines.slice(1)) {
    const line = raw.trim();
    if (line.startsWith("|}")) break;
    if (line.startsWith("|+")) caption = wikiToText(line.slice(2));
    else if (line.startsWith("|-")) {
      if (cur && cur.length) rows.push(cur);
      cur = [];
    } else if (line.startsWith("!")) {
      cur ??= [];
      if (headerRow < 0) headerRow = rows.length;
      for (const c of line.slice(1).split(/!!|\|\|/)) cur.push(cellText(c));
    } else if (line.startsWith("|")) {
      cur ??= [];
      for (const c of line.slice(1).split("||")) cur.push(cellText(c));
    } else if (cur && cur.length) {
      cur[cur.length - 1] += "<br>" + wikiToText(line).replace(/\|/g, "\\|");
    }
  }
  if (cur && cur.length) rows.push(cur);
  if (!rows.length) return "";
  const width = Math.max(...rows.map((r) => r.length));
  const pad = (r: string[]): string[] => [...r, ...Array<string>(width - r.length).fill("")];
  const head = pad(rows[0] ?? []);
  const out = [`| ${head.join(" | ")} |`, `| ${head.map(() => "---").join(" | ")} |`];
  for (const r of rows.slice(1)) out.push(`| ${pad(r).join(" | ")} |`);
  return (caption ? `**${caption}**\n\n` : "") + out.join("\n");
}

/** Convert an HTML <table> (as used inside some templates/pages) to markdown. */
function convertHtmlTable(html: string): string {
  const rows: string[][] = [];
  for (const tr of html.match(/<tr[\s\S]*?<\/tr>/gi) ?? []) {
    const cells = [...tr.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((m) =>
      wikiToText(m[1] ?? "").replace(/\n/g, "<br>").replace(/\|/g, "\\|"),
    );
    if (cells.length) rows.push(cells);
  }
  if (!rows.length) return "";
  const width = Math.max(...rows.map((r) => r.length));
  const pad = (r: string[]): string[] => [...r, ...Array<string>(width - r.length).fill("")];
  const head = pad(rows[0] ?? []);
  return [`| ${head.join(" | ")} |`, `| ${head.map(() => "---").join(" | ")} |`, ...rows.slice(1).map((r) => `| ${pad(r).join(" | ")} |`)].join("\n");
}

const INFOBOX_GLOSSARY: Record<string, string> = {
  "jungle infobox":
    "Template:Jungle Infobox columns: suffix 1 = initial attribute, suffix 2 = attribute gained per minute, suffix 3 = attribute after 12 minutes.",
};

/** Full-page wikitext -> markdown (headings, lists, tables kept). */
export function wikitextToMarkdown(src: string): string {
  let s = maskMath(src).replace(/<!--[\s\S]*?-->/g, "");
  s = s.replace(/<ref[^>]*\/>/g, "").replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, "");
  s = s.replace(/<gallery[\s\S]*?<\/gallery>/gi, "");
  s = s.replace(/__[A-Z]+__/g, "");
  // tables first (they may be nested inside nothing else here)
  const tables: string[] = [];
  s = s.replace(/<table[\s\S]*?<\/table>/gi, (t) => {
    tables.push(convertHtmlTable(t));
    return `\n@@TABLE${tables.length - 1}@@\n`;
  });
  for (let guard = 0; guard < 200; guard++) {
    const start = s.search(/^\s*\{\|/m);
    if (start < 0) break;
    // find matching |}
    let depth = 0;
    let end = -1;
    const lines = s.slice(start).split("\n");
    let offset = start;
    for (const line of lines) {
      const t = line.trim();
      if (t.startsWith("{|")) depth++;
      if (t.startsWith("|}")) {
        depth--;
        if (depth === 0) {
          end = offset + line.length;
          break;
        }
      }
      offset += line.length + 1;
    }
    if (end < 0) end = s.length;
    tables.push(convertTable(s.slice(start, end).trim()));
    s = s.slice(0, start) + `\n@@TABLE${tables.length - 1}@@\n` + s.slice(end);
  }
  // block templates (infoboxes...): render named params as a field/value table
  for (let guard = 0; guard < 100; guard++) {
    const block = findTemplates(s, () => true).find((t) => s.slice(t.start, t.end).includes("\n|") && Object.keys(t.named).length >= 2);
    if (!block) break;
    const rows = Object.entries(block.named)
      .filter(([, v]) => v.trim() !== "")
      .map(([k, v]) => `| ${k} | ${wikiToText(maskMath(v)).replace(/\n/g, "<br>").replace(/\|/g, "\\|")} |`);
    const gloss = INFOBOX_GLOSSARY[block.name.trim().toLowerCase()];
    const md = [`**${block.name.trim()}**`, "", "| Field | Value |", "| --- | --- |", ...rows, ...(gloss ? ["", `_${gloss}_`] : [])].join("\n");
    tables.push(md);
    s = s.slice(0, block.start) + `\n@@TABLE${tables.length - 1}@@\n` + s.slice(block.end);
  }
  const out: string[] = [];
  for (const rawLine of s.split("\n")) {
    const line = rawLine.trimEnd();
    const h = /^(={2,6})\s*(.*?)\s*\1\s*$/.exec(line);
    if (h) {
      out.push("", `${"#".repeat((h[1] ?? "==").length)} ${wikiToText(h[2] ?? "")}`, "");
      continue;
    }
    const tm = /^@@TABLE(\d+)@@$/.exec(line.trim());
    if (tm) {
      out.push("", tables[Number(tm[1])] ?? "", "");
      continue;
    }
    const li = /^([*#:;]+)\s*(.*)$/.exec(line);
    if (li) {
      const marks = li[1] ?? "*";
      const depth = marks.length - 1;
      const bullet = marks.endsWith("#") ? "1." : marks.endsWith(";") ? "-" : "-";
      const body = wikiToText(li[2] ?? "").replace(/\n/g, " ");
      out.push(`${"  ".repeat(depth)}${bullet} ${marks.endsWith(";") ? `**${body}**` : body}`);
      continue;
    }
    out.push(wikiToText(line).replace(/\n/g, "  \n"));
  }
  return out
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function writeJson(name: string, data: unknown): void {
  const file = join(OUT_DIR, name);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
  console.log(`wrote ${file}`);
}

export function writeText(name: string, data: string): void {
  const file = join(OUT_DIR, name);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, data);
}

/** Parse "1 / 2 / 3" or "1/2/3" lists into numbers; null if not purely numeric. */
export function parseNumberList(s: string | undefined): number[] | null {
  if (!s) return null;
  const clean = wikiToText(s).replace(/seconds?/g, "").replace(/[%s]/g, "").trim();
  if (!clean) return null;
  // {{sl|a to b n}} (Module:SL): linear progression from a to b over n levels
  const sl = /^(-?[\d.]+)\s*to\s*(-?[\d.]+)\s+(?:for\s+)?(\d+)$/.exec(clean);
  if (sl) {
    const a = Number(sl[1]);
    const b = Number(sl[2]);
    const n = Number(sl[3]);
    if (n <= 1) return [a];
    return Array.from({ length: n }, (_v, k) => Math.round((a + ((b - a) * k) / (n - 1)) * 100) / 100);
  }
  const parts = clean.split(/\s*\/\s*/);
  const nums = parts.map((p) => Number(p.trim()));
  return nums.every((n) => Number.isFinite(n)) ? nums : null;
}

export function num(v: LuaValue | undefined): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(String(v).replace(/[%,]/g, "").trim());
  return Number.isFinite(n) ? n : null;
}

export function str(v: LuaValue | undefined): string | null {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}
