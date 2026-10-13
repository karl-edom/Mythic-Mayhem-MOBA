// Extract every MLBB hero's infobox data and base stats from Module:Hero/data.
// Usage: node tools/extract/mlbb/heroes.ts [--refresh]
import {
  apiGet,
  categoryMembers,
  getWikitext,
  num,
  pageUrl,
  parseLuaTable,
  SOURCE,
  str,
  wikiToText,
  writeJson,
  type LuaTable,
  type LuaValue,
} from "./lib.ts";

const MODULE = "Module:Hero/data";

function table(v: LuaValue | undefined): LuaTable {
  return v !== null && typeof v === "object" ? v : {};
}

interface StatPair {
  level1: number | null;
  level15: number | null;
  /** (level15 - level1) / 14, the wiki's own growth formula (Template:Hero stats) */
  perLevel: number | null;
}

function pair(stats: LuaTable, key: string): StatPair {
  const a = num(stats[`${key}1`]);
  const b = num(stats[`${key}15`]);
  return { level1: a, level15: b, perLevel: a !== null && b !== null ? Math.round(((b - a) / 14) * 10000) / 10000 : null };
}

// Crit damage overrides hard-coded in Template:Hero stats (#switch), default 200%.
const CRIT_DAMAGE_OVERRIDES: Record<string, number> = { Natalia: 150, Lesley: 140, Ling: 150 };

export async function extractHeroes(): Promise<void> {
  const mod = await getWikitext(MODULE);
  if (!mod) throw new Error(`${MODULE} not found`);
  const revBody = (await apiGet({ action: "query", prop: "revisions", rvprop: "timestamp", titles: MODULE })) as {
    query?: { pages?: { revisions?: { timestamp?: string }[] }[] };
  };
  const moduleTimestamp = revBody.query?.pages?.[0]?.revisions?.[0]?.timestamp ?? null;
  const data = parseLuaTable(mod.text);
  const heroCat = new Set((await categoryMembers("Heroes", "0")).map((m) => m.title));
  const notes: string[] = [
    "All numeric stats come from Module:Hero/data, the Lua table used by {{Infobox hero}} and {{Hero stats}} on every hero page.",
    "perLevel = (level15 - level1) / 14, i.e. linear growth as computed by the wiki's Template:Hero stats. The wiki only stores level 1 and level 15 values.",
    "Units: HP/mana/attack/defense are flat points; attackSpeed is attacks per second; attackSpeedRatio is the % of bonus attack speed the hero converts; movementSpeed is in game speed units; basicAttackRange is in in-game 'units' (wiki convention, melee heroes are ~1.5-2); hpRegen and manaRegen are per-second-ish values as shown in-game (the wiki does not state whether per 1s or per 5s).",
    "magicPower is not stored per hero: Template:Hero stats shows 0 base Magic Power for every hero (MLBB heroes start with 0 Magic Power).",
    "critDamage is not in the module: Template:Hero stats hard-codes 200% for all heroes except Natalia 150%, Lesley 140%, Ling 150%.",
    "resource: 'Mana', 'Energy', 'None' (no resource bar) or 'Rage/Indicator' (module value 'Resource#Rage/Indicator|None': heroes with a rage bar or custom indicator and no mana; resourceRaw keeps the original). For non-mana heroes mana fields are null or 0.",
    "The 'Mystery Hero' placeholder entry of the module is skipped.",
  ];
  const heroes: Record<string, unknown>[] = [];
  for (const [key, raw] of Object.entries(data)) {
    if (key === "Mystery Hero") continue;
    const h = table(raw);
    const s = table(h["stats"]);
    const r = table(h["ratings"]);
    const name = str(h["name"]) ?? key;
    const roles = [str(h["role1"]), str(h["role2"])].filter((x): x is string => !!x);
    const resourceRaw = str(h["resource"]);
    // e.g. "Resource#Rage/Indicator|None": a wiki link used as value -> heroes with a rage bar / custom indicator
    const resource = resourceRaw && /rage|indicator/i.test(resourceRaw) ? "Rage/Indicator" : resourceRaw;
    const mana = pair(s, "mana");
    const manaRegen = pair(s, "mana_regen");
    const armorHp = s["armor_hp1"] !== undefined ? pair(s, "armor_hp") : null;
    const record = {
      name,
      page: key,
      sourceUrl: pageUrl(key),
      inHeroesCategory: heroCat.has(key),
      id: str(h["id"]),
      number: num(h["number"]),
      title: str(h["title"]),
      region: str(h["region"]),
      description: str(h["description"]),
      roles,
      specialties: [str(h["specialty1"]), str(h["specialty2"])].filter((x): x is string => !!x),
      lanes: [str(h["lane1"]), str(h["lane2"])].filter((x): x is string => !!x),
      resource,
      resourceRaw,
      damageType: str(h["dmg_type"]),
      attackType: str(h["atk_type"]),
      releaseYear: num(h["release_year"]),
      releaseDate: str(h["release_date"]),
      price: {
        battlePoints: num(h["bp"]),
        diamonds: num(h["diamond"]),
        tickets: num(h["ticket"]),
        luckyGems: num(h["lucky_gem"]),
        fragments: num(h["fragment"]),
      },
      ratings: {
        durability: num(r["durability"]),
        offense: num(r["offense"]),
        controlEffect: num(r["control_effect"]),
        difficulty: num(r["difficulty"]),
      },
      stats: {
        hp: pair(s, "hp"),
        hpRegen: pair(s, "hp_regen"),
        mana: resource === "Mana" ? mana : mana.level1 === null ? null : mana,
        manaRegen: resource === "Mana" ? manaRegen : manaRegen.level1 === null ? null : manaRegen,
        energy: num(s["energy"]) ?? (resource === "Energy" ? 100 : null),
        energyRegen: num(s["energy_regen"]),
        physicalAttack: pair(s, "physical_atk"),
        magicPower: { level1: 0, level15: 0, perLevel: 0 },
        physicalDefense: pair(s, "physical_def"),
        magicDefense: pair(s, "magic_def"),
        attackSpeed: pair(s, "atk_spd"),
        attackSpeedRatioPct: num(s["atk_spd_ratio"]),
        movementSpeed: num(s["movement_spd"]),
        basicAttackRange: num(s["basic_atk_range"]),
        critDamagePct: CRIT_DAMAGE_OVERRIDES[key] ?? 200,
        ...(armorHp ? { armorHp } : {}),
      },
      rawStats: Object.fromEntries(Object.entries(s).map(([k, v]) => [k, v === null ? null : String(v)])),
      internalName: str(h["int_name"]) ? wikiToText(String(h["int_name"])) : null,
    };
    heroes.push(record);
  }
  heroes.sort((a, b) => Number(a["number"] ?? 9999) - Number(b["number"] ?? 9999));
  const inModule = new Set(Object.keys(data));
  const missingFromModule = [...heroCat].filter((t) => !inModule.has(t) && !t.includes("/"));
  if (missingFromModule.length)
    notes.push(`Pages in Category:Heroes without an entry in Module:Hero/data (not heroes or not yet added): ${missingFromModule.join(", ")}.`);
  const special = heroes.filter((h) => h["resource"] !== "Mana").map((h) => `${String(h["name"])} (${String(h["resource"])})`);
  notes.push(`Non-mana heroes: ${special.join(", ")}.`);
  notes.push("Masha: the wiki displays her HP multiplied by 3 (three HP bars); the module value is per bar. X.Borg has an extra armorHp stat.");
  writeJson("heroes.json", {
    source: SOURCE,
    sourcePage: MODULE,
    sourceUrl: pageUrl(MODULE),
    moduleLastEdited: moduleTimestamp,
    retrievedAt: new Date().toISOString(),
    license: "CC BY-SA 3.0 (Fandom). Attribution: contributors of mobile-legends.fandom.com",
    notes,
    count: heroes.length,
    heroes,
  });
}

if (import.meta.url === `file://${process.argv[1]}`) await extractHeroes();
