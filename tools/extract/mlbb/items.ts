// Extract MLBB equipment from Module:Equipment/data.
// Usage: node tools/extract/mlbb/items.ts [--refresh]
import { categoryMembers, getWikitext, num, pageUrl, parseLuaTable, SOURCE, str, wikiToText, writeJson, type LuaTable, type LuaValue } from "./lib.ts";

const MODULE = "Module:Equipment/data";

function table(v: LuaValue | undefined): LuaTable {
  return v !== null && typeof v === "object" ? v : {};
}

function list(v: LuaValue | undefined): string[] {
  const s = str(v);
  return s ? s.split(",").map((x) => x.trim()).filter(Boolean) : [];
}

/** "+60 Physical Attack, +25% Crit Chance" -> [{stat, value, unit}] */
function parseBonus(s: string | null): { stat: string; value: number; unit: "flat" | "%" ; raw: string }[] {
  if (!s) return [];
  const out: { stat: string; value: number; unit: "flat" | "%"; raw: string }[] = [];
  for (const part of wikiToText(s).split(/,\s*(?=[+-]?\d)/)) {
    const m = /^([+-]?\d+(?:\.\d+)?)(%?)\s+(.+)$/.exec(part.trim());
    if (m) out.push({ stat: (m[3] ?? "").trim(), value: Number(m[1]), unit: m[2] ? "%" : "flat", raw: part.trim() });
  }
  return out;
}

/** "Name: text@ Name2: text2" -> [{name, text}] ; the module separates multiple effects with "@". */
function parseEffects(s: string | null): { name: string | null; text: string; numbers: number[] }[] {
  if (!s) return [];
  return s
    .split("@")
    .map((x) => wikiToText(x).trim())
    .filter(Boolean)
    .map((x) => {
      const m = /^([A-Z][^:.]{0,40}):\s*([\s\S]*)$/.exec(x);
      const text = m ? (m[2] ?? "") : x;
      const numbers = [...text.matchAll(/-?\d+(?:\.\d+)?/g)].map((n) => Number(n[0]));
      return { name: m ? (m[1] ?? null) : null, text, numbers };
    });
}

export async function extractItems(): Promise<void> {
  const mod = await getWikitext(MODULE);
  if (!mod) throw new Error(`${MODULE} not found`);
  const data = parseLuaTable(mod.text);
  const equipmentCat = new Set((await categoryMembers("Equipment", "0")).map((m) => m.title));
  const removedCat = new Set((await categoryMembers("Removed equipment", "0")).map((m) => m.title));
  const recipes = new Map<string, string[]>();
  for (const [k, v] of Object.entries(data)) recipes.set(k, list(table(v)["recipe"]));
  const tierCache = new Map<string, number>();
  const tierOf = (name: string, depth = 0): number => {
    const c = tierCache.get(name);
    if (c !== undefined) return c;
    const rec = recipes.get(name) ?? [];
    const t = depth > 5 || rec.length === 0 ? 1 : 1 + Math.max(...rec.map((r) => tierOf(r, depth + 1)));
    tierCache.set(name, t);
    return t;
  };
  const items: Record<string, unknown>[] = [];
  for (const [key, raw] of Object.entries(data)) {
    const it = table(raw);
    const bonusRaw = str(it["bonus"]);
    const uniqueRaw = str(it["unique"]);
    const availability = str(it["availability"]);
    items.push({
      name: str(it["name"]) ?? key,
      page: key,
      sourceUrl: pageUrl(key),
      category: str(it["type"]),
      caption: str(it["caption"]),
      priceTotal: num(it["price"]),
      priceUpgrade: num(it["upgrade_price"]),
      tier: tierOf(key),
      recipe: list(it["recipe"]),
      buildsInto: list(it["builds"]),
      stats: parseBonus(bonusRaw),
      statsRaw: bonusRaw,
      uniqueStats: parseBonus(uniqueRaw),
      uniqueStatsRaw: uniqueRaw,
      passives: parseEffects(str(it["passive"])),
      actives: parseEffects(str(it["active"])),
      availability,
      removed: availability === "Removed" || removedCat.has(key),
      sellable: str(it["salability"]) === "Yes" ? true : str(it["salability"]) === "No" ? false : null,
      occupiesSlot: str(it["slot"]) === "Yes" ? true : str(it["slot"]) === "No" ? false : null,
      inEquipmentCategory: equipmentCat.has(key),
    });
  }
  const inModule = new Set(Object.keys(data));
  const pagesNotInModule = [...equipmentCat].filter((t) => !inModule.has(t));
  const notes = [
    "Source of truth: Module:Equipment/data, the Lua table behind {{Infobox equipment}} on every item page.",
    "priceTotal = full gold cost; priceUpgrade = gold paid on top of the recipe components (combine cost).",
    "tier is derived here: 1 = no recipe, else 1 + max(tier of components). It is not a wiki field.",
    "stats = 'bonus' attributes; uniqueStats = 'Unique' attributes (do not stack with the same unique attribute from another item). unit '%' means percentage points.",
    "passives/actives: the module separates multiple named effects with '@'; numbers[] lists every number found in the text (unit/meaning must be read from the text).",
    "Expressions like '(+60*Hero Level)' or '(120*Hero Level)' are kept verbatim in passive text.",
    "removed = availability 'Removed' in the module or page listed in Category:Removed equipment. Removed items are kept for reference.",
    `Pages in Category:Equipment without a module entry: ${pagesNotInModule.length ? pagesNotInModule.join(", ") : "none"}.`,
  ];
  items.sort((a, b) => String(a["category"]).localeCompare(String(b["category"])) || String(a["name"]).localeCompare(String(b["name"])));
  writeJson("items.json", {
    source: SOURCE,
    sourcePage: MODULE,
    sourceUrl: pageUrl(MODULE),
    retrievedAt: new Date().toISOString(),
    license: "CC BY-SA 3.0 (Fandom). Attribution: contributors of mobile-legends.fandom.com",
    notes,
    count: items.length,
    items,
  });
}

if (import.meta.url === `file://${process.argv[1]}`) await extractItems();
