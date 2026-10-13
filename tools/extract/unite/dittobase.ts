// dittobase.com/unite: Next.js (App Router) pages. Data is embedded in the
// React Server Components flight payload (self.__next_f.push([1,"..."]) chunks),
// not in __NEXT_DATA__. We concatenate the string chunks and parse the JSON
// array that follows the `"stats":` key.
import { fetchCached } from './lib.ts';

export const DITTO_STATS_URL = 'https://www.dittobase.com/unite/stats';

export interface DittoStatRow {
  pokemonSlug: string;
  level: number;
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  critRate: number;
  cooldownRate: number;
  lifesteal: number;
  attackSpeed: number;
  movementSpeed: number;
  penetration: number;
  pokemon?: { displayName?: string; uniteDbId?: number; lastUpdatedLabel?: string | null };
}

/** Concatenate the RSC flight string chunks embedded in a Next.js App Router page. */
export function decodeRscPayload(html: string): string {
  let out = '';
  const re = /self\.__next_f\.push\((\[[\s\S]*?\])\)<\/script>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    try {
      const a = JSON.parse(m[1] ?? '[]') as unknown[];
      if (typeof a[1] === 'string') out += a[1];
    } catch {
      // Non-JSON push (rare); ignore.
    }
  }
  return out;
}

/** Extract the JSON array value following `"key":` using bracket matching (string-aware). */
export function extractJsonArrayAfter(text: string, key: string): unknown[] | null {
  const idx = text.indexOf(`"${key}":[`);
  if (idx < 0) return null;
  const start = idx + key.length + 3;
  let depth = 0;
  let inStr = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inStr) {
      if (ch === '\\') i++;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === '[' || ch === '{') depth++;
    else if (ch === ']' || ch === '}') {
      depth--;
      if (depth === 0) return JSON.parse(text.slice(start, i + 1)) as unknown[];
    }
  }
  return null;
}

export async function loadDittoStats(): Promise<{ rows: DittoStatRow[]; retrievedAt: string }> {
  const { body, retrievedAt } = await fetchCached(DITTO_STATS_URL);
  const rsc = decodeRscPayload(body);
  const rows = (extractJsonArrayAfter(rsc, 'stats') ?? []) as DittoStatRow[];
  return { rows, retrievedAt };
}
