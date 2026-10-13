// Builds data/reference/lol/items.json and summoner-spells.json from Data Dragon
// (+ LoL wiki Module:SpellData/data for summoner spell effect formulas).
// Usage: NODE_USE_ENV_PROXY=1 node tools/extract/lol/items.ts [--refresh]

import { DDRAGON, WIKI_PAGE, decodeEntities, fetchJson, isObject, latestDDragonVersion, parseLuaTable, wikiSource, writeOutput } from "./lib.ts";
import type { Json, JsonObject } from "./lib.ts";

type DDItem = {
  name: string;
  description: string;
  plaintext?: string;
  from?: string[];
  into?: string[];
  gold: { base: number; total: number; sell: number; purchasable: boolean };
  tags?: string[];
  maps?: Record<string, boolean>;
  stats?: Record<string, number>;
  depth?: number;
  inStore?: boolean;
  requiredChampion?: string;
  requiredAlly?: string;
  consumed?: boolean;
  hideFromAll?: boolean;
  specialRecipe?: number;
};

type DDSummoner = {
  id: string;
  key: string;
  name: string;
  description: string;
  tooltip: string;
  cooldown: number[];
  range: number[];
  summonerLevel: number;
  modes: string[];
};

const MAP_NAMES: Record<string, string> = { "11": "Summoner's Rift", "12": "Howling Abyss (ARAM)", "21": "Nexus Blitz", "30": "Arena", "33": "Swarm", "35": "Brawl" };

/** Item description HTML -> readable text with line breaks; keeps <passive>/<active> labels. */
function itemText(html: string): string {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<(passive|active|rarityMythic|rarityLegendary|keywordMajor)>/gi, "")
      .replace(/<\/(passive|active)>/gi, ":")
      .replace(/<li>/gi, "\n- ")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}

/** Parses the <stats> block of an item description: "40 Attack Damage" lines. */
function statsFromDescription(html: string): { stat: string; value: number; percent: boolean }[] {
  const block = /<stats>([\s\S]*?)<\/stats>/i.exec(html)?.[1];
  if (!block) return [];
  return block
    .split(/<br\s*\/?>/i)
    .map((l) => decodeEntities(l.replace(/<[^>]+>/g, "")).trim())
    .filter(Boolean)
    .map((l) => {
      const m = /^([+-]?\d+(?:\.\d+)?)(%?)\s+(.+)$/.exec(l);
      return m ? { stat: (m[3] ?? "").trim(), value: Number(m[1]), percent: m[2] === "%" } : { stat: l, value: Number.NaN, percent: false };
    })
    .filter((s) => !Number.isNaN(s.value));
}

async function main(): Promise<void> {
  const version = await latestDDragonVersion();
  const retrievedAt = new Date().toISOString();

  // ---- Items
  const itemUrl = `${DDRAGON}/cdn/${version}/data/en_US/item.json`;
  const items = await fetchJson<{ data: Record<string, DDItem> }>(itemUrl);
  if (!items) throw new Error("item.json missing");
  const itemRecords = Object.entries(items.data)
    .map(([id, it]) => ({
      id: Number(id),
      name: it.name,
      plaintext: it.plaintext ?? "",
      text: itemText(it.description),
      statsParsed: statsFromDescription(it.description),
      stats: it.stats ?? {},
      gold: it.gold,
      from: (it.from ?? []).map(Number),
      into: (it.into ?? []).map(Number),
      depth: it.depth ?? 1,
      tags: it.tags ?? [],
      maps: Object.entries(it.maps ?? {})
        .filter(([, v]) => v)
        .map(([k]) => MAP_NAMES[k] ?? `map${k}`),
      inStore: it.inStore ?? true,
      requiredChampion: it.requiredChampion ?? null,
      requiredAlly: it.requiredAlly ?? null,
      consumed: it.consumed ?? false,
    }))
    .sort((a, b) => a.id - b.id);
  const sr = itemRecords.filter((i) => i.maps.includes("Summoner's Rift") && i.gold.purchasable && i.inStore);
  writeOutput("items.json", {
    source: itemUrl,
    version,
    retrievedAt,
    notes: [
      "All Data Dragon items (every mode). Filter on maps contains \"Summoner's Rift\" + gold.purchasable for the standard shop.",
      `${itemRecords.length} items total, ${sr.length} purchasable in the Summoner's Rift store.`,
      "stats: Data Dragon stat keys (FlatPhysicalDamageMod, ...) — often incomplete for modern stats (ability haste, lethality, omnivamp); statsParsed reads the <stats> block of the description and is more complete.",
      "text: description with HTML removed; passives/actives keep their label followed by ':'. Numbers in passives are as written by Riot (no per-level formulas).",
    ],
    items: itemRecords,
  });

  // ---- Summoner spells
  const sumUrl = `${DDRAGON}/cdn/${version}/data/en_US/summoner.json`;
  const sums = await fetchJson<{ data: Record<string, DDSummoner> }>(sumUrl);
  if (!sums) throw new Error("summoner.json missing");
  const wikiLua = await wikiSource("Module:SpellData/data");
  const wiki = wikiLua ? parseLuaTable(wikiLua) : null;
  const wikiByName = new Map<string, JsonObject>();
  if (isObject(wiki)) for (const [k, v] of Object.entries(wiki)) if (isObject(v)) wikiByName.set(k.toLowerCase(), v);
  const str = (v: Json | undefined): string | null => (typeof v === "string" ? v : typeof v === "number" ? String(v) : null);
  const sumRecords = Object.values(sums.data)
    .map((s) => {
      const standard = s.modes.some((m) => m === "CLASSIC" || m === "ARAM");
      const w = standard ? wikiByName.get(s.name.toLowerCase()) ?? null : null;
      return {
        id: s.id,
        key: Number(s.key),
        name: s.name,
        description: s.description,
        cooldown: s.cooldown[0] ?? null,
        range: s.range[0] ?? null,
        summonerLevel: s.summonerLevel,
        modes: s.modes,
        wiki: w
          ? {
              cooldown: str(w["cooldown"]),
              range: str(w["range"]),
              effect: str(w["effect"]),
              maps: isObject(w["maps"]) ? Object.entries(w["maps"]).filter(([, v]) => v === true).map(([k]) => k) : [],
            }
          : null,
      };
    })
    .sort((a, b) => a.key - b.key);
  writeOutput("summoner-spells.json", {
    source: [sumUrl, `${WIKI_PAGE}Module:SpellData/data`],
    version,
    retrievedAt,
    notes: [
      "cooldown/range from Data Dragon (range 25000 = global/self in DDragon convention).",
      "wiki.effect is raw wikitext from the community wiki (templates such as {{pp|...}} encode per-level formulas, e.g. Barrier 100 + (460-100)/17*(x-1) for level x).",
      "wiki.maps codes: sr Summoner's Rift, ha Howling Abyss, ar Arena, nb Nexus Blitz, tt Twisted Treeline, cs Crystal Scar.",
    ],
    summonerSpells: sumRecords,
  });
}

await main();
