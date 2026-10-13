// Builds data/reference/lol/champions.json and abilities.json.
// Sources: Data Dragon (championFull.json), CommunityDragon character bins
// (game/data/characters/<alias>/<alias>.bin.json), LoL wiki Module:ChampionData/data.
// Usage: NODE_USE_ENV_PROXY=1 node tools/extract/lol/champions.ts [--refresh]
// (NODE_USE_ENV_PROXY is only needed behind an HTTPS proxy.)

import {
  CDRAGON,
  DDRAGON,
  WIKI_PAGE,
  clean,
  fetchJson,
  isObject,
  latestDDragonVersion,
  parseLuaTable,
  wikiSource,
  writeOutput,
} from "./lib.ts";
import type { Json, JsonObject } from "./lib.ts";

// ---------------------------------------------------------------------------
// Types (output)
// ---------------------------------------------------------------------------

type Growth = { base: number | null; perLevel: number | null };

type ChampionRecord = {
  id: string;
  key: number;
  name: string;
  title: string;
  tags: string[];
  resource: string;
  info: { attack: number; defense: number; magic: number; difficulty: number } | null;
  stats: {
    hp: Growth;
    mp: Growth;
    armor: Growth;
    magicResist: Growth;
    attackDamage: Growth;
    hpRegenPer5: Growth;
    mpRegenPer5: Growth;
    crit: Growth;
    attackSpeed: { base: number | null; perLevelPercent: number | null; ratio: number | null };
    attackRange: number | null;
    moveSpeed: number | null;
    critDamageMultiplier: number | null;
  };
  attack: {
    windupPercent: number | null;
    windupSource: string | null;
    attackDelayOffset: number | null;
    windupModifier: number | null;
    attackCastTime: number | null;
    attackTotalTime: number | null;
    missileSpeed: number | null;
  };
  radii: {
    gameplay: number | null;
    selection: number | null;
    selectionHeight: number | null;
    pathfinding: number | null;
    acquisition: number | null;
  };
  wiki: {
    herotype: string | null;
    alttype: string | null;
    rangetype: string | null;
    adaptivetype: string | null;
    roles: string[];
    positions: string[];
    ratings: Record<string, number> | null;
    modeModifiers: Record<string, Json> | null;
    releaseDate: string | null;
    lastChanged: string | null;
  } | null;
  discrepancies: string[];
};

type RatioRecord = {
  calculation: string;
  stat: string;
  scaling: "total" | "bonus" | "base";
  values: number[] | null;
  dataValue: string | null;
};

type SpellNumbers = {
  binPath: string;
  scriptName: string | null;
  castTime: number | null;
  castFrame: number | null;
  totalTime: number | null;
  missileSpeed: number | null;
  lineWidth: number | null;
  castRange: number[] | null;
  castRadius: number[] | null;
  castConeAngle: number | null;
  castConeDistance: number | null;
  cooldown: number[] | null;
  mana: number[] | null;
  damageTag: number | null;
  spellTags: string[];
  dataValues: Record<string, number[]>;
  calculations: Record<string, { formula: string; raw: Json }>;
  ratios: RatioRecord[];
  effectAmounts: number[][] | null;
  coefficients: number[];
};

type AbilityRecord = {
  champion: string;
  slot: "P" | "Q" | "W" | "E" | "R";
  name: string;
  ddragonId: string | null;
  description: string;
  maxRank: number | null;
  cooldown: number[] | null;
  cost: number[] | null;
  costType: string | null;
  range: number[] | null;
  castTime: number | null;
  missileSpeed: number | null;
  lineWidth: number | null;
  castRadius: number[] | null;
  dataValues: Record<string, number[]>;
  calculations: Record<string, string>;
  ratios: RatioRecord[];
  crowdControl: { type: string; evidence: string; durationValues: Record<string, number[]> }[];
  root: SpellNumbers | null;
  children: SpellNumbers[];
  notes: string[];
};

// ---------------------------------------------------------------------------
// Bin helpers
// ---------------------------------------------------------------------------

/** Known stat enum used by calculation parts (mStat). See README for how it was inferred. */
const STAT_NAMES: Record<number, string> = {
  0: "AP",
  1: "armor",
  2: "AD",
  4: "attackSpeed",
  6: "magicResist",
  7: "moveSpeed",
  8: "critChance",
  9: "critDamage",
  12: "maxHealth",
  29: "lethality",
};
const SCALING: Record<number, "total" | "base" | "bonus"> = { 0: "total", 1: "base", 2: "bonus" };

function num(v: Json | undefined): number | null {
  return typeof v === "number" ? clean(v) : null;
}
function modifiable(v: Json | undefined): number | null {
  if (typeof v === "number") return clean(v);
  if (isObject(v) && typeof v["baseValue"] === "number") return clean(v["baseValue"]);
  if (isObject(v)) return 0; // ModifiableFloat without baseValue => default 0
  return null;
}
function numArray(v: Json | undefined, len?: number): number[] | null {
  if (!Array.isArray(v)) return null;
  const out = v.filter((x): x is number => typeof x === "number").map(clean);
  return len ? out.slice(0, len) : out;
}

/** DataValues: index 0 is the "rank 0" placeholder; ranks 1..n are indices 1..n. */
function readDataValues(spell: JsonObject, maxRank: number): Record<string, number[]> {
  const out: Record<string, number[]> = {};
  const list = spell["DataValues"] ?? spell["mDataValues"];
  if (!Array.isArray(list)) return out;
  for (const dv of list) {
    if (!isObject(dv)) continue;
    const name = dv["name"] ?? dv["mName"];
    const values = dv["values"] ?? dv["mValues"];
    if (typeof name !== "string") continue;
    const arr = numArray(values) ?? [];
    const ranks = arr.length > 1 ? arr.slice(1, 1 + maxRank) : arr;
    // collapse constant arrays to a single value for readability
    out[name] = ranks.length > 0 && ranks.every((x) => x === ranks[0]) ? [ranks[0] ?? 0] : ranks;
  }
  return out;
}

function statLabel(part: JsonObject): { stat: string; scaling: "total" | "bonus" | "base" } {
  const s = typeof part["mStat"] === "number" ? part["mStat"] : 0;
  const f = typeof part["mStatFormula"] === "number" ? part["mStatFormula"] : 0;
  return { stat: STAT_NAMES[s] ?? `stat${s}`, scaling: SCALING[f] ?? "total" };
}

function fmtValues(v: number[] | undefined | null): string {
  if (!v || v.length === 0) return "?";
  return v.length === 1 ? String(v[0]) : v.join("/");
}

/** Renders a GameCalculation (or part) into a readable formula string, collecting ratios. */
function renderCalc(
  node: Json | undefined,
  dv: Record<string, number[]>,
  calcs: JsonObject,
  calcName: string,
  ratios: RatioRecord[],
  depth = 0,
): string {
  if (depth > 8 || !isObject(node)) return "?";
  const t = String(node["__type"] ?? "");
  const multStr = (m: Json | undefined): string | null =>
    typeof m === "number" ? (m === 1 ? null : String(clean(m))) : isObject(m) ? renderCalc(m, dv, calcs, calcName, ratios, depth + 1) : null;
  switch (t) {
    case "GameCalculation": {
      const parts = Array.isArray(node["mFormulaParts"]) ? node["mFormulaParts"] : [];
      const body = parts.map((p) => renderCalc(p, dv, calcs, calcName, ratios, depth + 1)).join(" + ") || "0";
      const m = multStr(node["mMultiplier"]);
      return (m ? `(${body}) × ${m}` : body) + (node["mDisplayAsPercent"] ? " (as %)" : "");
    }
    case "GameCalculationModified": {
      const ref = node["mModifiedGameCalculation"];
      const inner = typeof ref === "string" ? `{${ref}}` : "?";
      return `${inner} × ${multStr(node["mMultiplier"]) ?? "1"}`;
    }
    case "GameCalculationConditional": {
      const a = node["mDefaultGameCalculation"];
      const b = node["mConditionalGameCalculation"];
      return `[default {${String(a ?? "?")}} | if condition: {${String(b ?? "?")}}]`;
    }
    case "NamedDataValueCalculationPart": {
      const n = String(node["mDataValue"] ?? "?");
      return `${n}(${fmtValues(dv[n])})`;
    }
    case "NumberCalculationPart":
      return String(num(node["mNumber"]) ?? 0);
    case "EffectValueCalculationPart":
      return `Effect${String(node["mEffectIndex"] ?? "?")}Amount`;
    case "StatByNamedDataValueCalculationPart": {
      const n = String(node["mDataValue"] ?? "?");
      const { stat, scaling } = statLabel(node);
      ratios.push({ calculation: calcName, stat, scaling, values: dv[n] ?? null, dataValue: n });
      return `${fmtValues(dv[n])} × ${scaling === "total" ? "" : scaling + " "}${stat}`;
    }
    case "StatByCoefficientCalculationPart": {
      const c = num(node["mCoefficient"]) ?? 0;
      const { stat, scaling } = statLabel(node);
      ratios.push({ calculation: calcName, stat, scaling, values: [c], dataValue: null });
      return `${c} × ${scaling === "total" ? "" : scaling + " "}${stat}`;
    }
    case "StatBySubPartCalculationPart": {
      const { stat, scaling } = statLabel(node);
      const sub = renderCalc(node["mSubpart"], dv, calcs, calcName, [], depth + 1);
      ratios.push({ calculation: calcName, stat, scaling, values: null, dataValue: `expr:${sub}` });
      return `(${sub}) × ${scaling === "total" ? "" : scaling + " "}${stat}`;
    }
    case "ProductOfSubPartsCalculationPart":
      return `(${renderCalc(node["mPart1"], dv, calcs, calcName, ratios, depth + 1)}) × (${renderCalc(node["mPart2"], dv, calcs, calcName, ratios, depth + 1)})`;
    case "SumOfSubPartsCalculationPart": {
      const subs = Array.isArray(node["mSubparts"]) ? node["mSubparts"] : [];
      return `(${subs.map((p) => renderCalc(p, dv, calcs, calcName, ratios, depth + 1)).join(" + ")})`;
    }
    case "ByCharLevelInterpolationCalculationPart":
      return `lerpByLevel(${num(node["mStartValue"]) ?? 0} → ${num(node["mEndValue"]) ?? 0})`;
    case "ByCharLevelBreakpointsCalculationPart": {
      const bps = Array.isArray(node["mBreakpoints"]) ? node["mBreakpoints"] : [];
      const bp = bps
        .filter(isObject)
        .map((b) => `L${String(b["mLevel"] ?? "?")}:+${String(num(b["{d5fd07ed}"] ?? b["mBonusPerLevelAtAndAfter"]) ?? num(b["{57fdc438}"]) ?? "?")}`)
        .join(",");
      return `byLevel(L1=${num(node["mLevel1Value"]) ?? 0}${node["mInitialBonusPerLevel"] !== undefined ? `, +${num(node["mInitialBonusPerLevel"])}/lvl` : ""}${bp ? `, ${bp}` : ""})`;
    }
    case "BuffCounterByNamedDataValueCalculationPart": {
      const n = String(node["mDataValue"] ?? "?");
      return `${fmtValues(dv[n])} × stacks(${String(node["mBuffName"] ?? "?")})`;
    }
    case "BuffCounterByCoefficientCalculationPart":
      return `${num(node["mCoefficient"]) ?? 0} × stacks(${String(node["mBuffName"] ?? "?")})`;
    case "CooldownMultiplierCalculationPart":
      return "cooldownMultiplier";
    case "{f3cbe7b2}":
      return `{${String(node["mSpellCalculationKey"] ?? "?")}}`;
    default: {
      // unknown/hashed part: show the referenced data value or calculation if any
      const ref = node["mDataValue"] ?? node["mSpellCalculationKey"];
      if (typeof ref === "string") return dv[ref] ? `${ref}(${fmtValues(dv[ref])})` : `{${ref}}`;
      return `<${t || "unknown"}>`;
    }
  }
}

function readSpell(path: string, obj: JsonObject, maxRank: number): SpellNumbers | null {
  const spell = obj["mSpell"];
  if (!isObject(spell)) return null;
  const dv = readDataValues(spell, maxRank);
  const calcsObj = isObject(spell["mSpellCalculations"]) ? spell["mSpellCalculations"] : {};
  const calculations: Record<string, { formula: string; raw: Json }> = {};
  const ratios: RatioRecord[] = [];
  for (const [name, calc] of Object.entries(calcsObj)) {
    if (name === "__type") continue;
    calculations[name] = { formula: renderCalc(calc, dv, calcsObj, name, ratios), raw: calc };
  }
  const missileComp = isObject(spell["mMissileSpec"]) && isObject(spell["mMissileSpec"]["movementComponent"]) ? spell["mMissileSpec"]["movementComponent"] : null;
  const effect = Array.isArray(spell["mEffectAmount"])
    ? spell["mEffectAmount"].filter(isObject).map((e) => numArray(e["value"], maxRank + 1)?.slice(1) ?? [])
    : null;
  const botData = isObject(obj["BotData"]) ? obj["BotData"] : null;
  const coefficients = [spell["mCoefficient"], spell["mCoefficient2"]].filter((x): x is number => typeof x === "number").map(clean);
  return {
    binPath: path,
    scriptName: typeof obj["mScriptName"] === "string" ? obj["mScriptName"] : null,
    castTime: num(spell["mCastTime"]) ?? num(spell["spellCastTime"]) ?? null,
    castFrame: num(spell["castFrame"]),
    totalTime: num(spell["spellTotalTime"]),
    missileSpeed: positive((missileComp ? num(missileComp["mSpeed"]) : null) ?? num(spell["missileSpeed"])),
    lineWidth: num(spell["mLineWidth"]),
    castRange: numArray(spell["castRange"], maxRank),
    castRadius: numArray(spell["castRadius"], maxRank),
    castConeAngle: num(spell["castConeAngle"]),
    castConeDistance: num(spell["castConeDistance"]),
    cooldown: numArray(spell["cooldownTime"], maxRank),
    mana: numArray(spell["mana"], maxRank),
    damageTag: botData ? num(botData["DamageTag"]) : null,
    spellTags: Array.isArray(spell["mSpellTags"]) ? spell["mSpellTags"].filter((x): x is string => typeof x === "string") : [],
    dataValues: dv,
    calculations,
    ratios,
    effectAmounts: effect && effect.some((e) => e.some((x) => x !== 0)) ? effect : null,
    coefficients,
  };
}

// ---------------------------------------------------------------------------
// Crowd control heuristics
// ---------------------------------------------------------------------------

const CC_PATTERNS: [string, RegExp][] = [
  ["stun", /stun/i],
  ["root", /\broot|snare|immobiliz/i],
  ["slow", /\bslow(?:s|ed|ing)?\b(?! affecting| resist)/i],
  ["airborne", /knock ?(?:up|back|aside)|knocks? (?:them |enemies |the target |it )?(?:up|back|aside)|airborne|pull(?:s|ing)? (?:the |an |all )?(?:target|enem|champion|them)|displac/i],
  ["charm", /charm/i],
  ["fear", /fear|flee|terrif/i],
  ["taunt", /taunt/i],
  ["silence", /silenc/i],
  ["suppression", /suppress/i],
  ["sleep", /sleep|drows/i],
  ["blind", /blind|nearsight/i],
  ["polymorph", /polymorph/i],
  ["grounded", /ground(?:ed|s)\b/i],
  ["disarm", /disarm/i],
  ["berserk", /berserk/i],
  ["stasis", /stasis/i],
];

function detectCc(text: string, dvs: Record<string, number[]>): AbilityRecord["crowdControl"] {
  const out: AbilityRecord["crowdControl"] = [];
  for (const [type, re] of CC_PATTERNS) {
    const inText = re.test(text);
    const dvNames = Object.keys(dvs).filter((n) => re.test(n.replace(/([a-z])([A-Z])/g, "$1 $2")) || re.test(n));
    if (!inText && dvNames.length === 0) continue;
    const durationValues: Record<string, number[]> = {};
    for (const n of dvNames) if (/dur|time|length/i.test(n)) durationValues[n] = dvs[n] ?? [];
    if (Object.keys(durationValues).length === 0) {
      for (const n of dvNames) durationValues[n] = dvs[n] ?? [];
    }
    out.push({ type, evidence: [inText ? "tooltip text" : "", dvNames.length ? "dataValue names" : ""].filter(Boolean).join(" + "), durationValues });
  }
  return out;
}

function positive(n: number | null): number | null {
  return n !== null && n > 0 ? n : null;
}

function resourceName(costType: string, partype: string): string | null {
  const t = stripHtml(costType || "").replace(/\{\{\s*abilityresourcename\s*\}\}/gi, partype).trim();
  return t || null;
}

function stripHtml(s: string): string {
  return s
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

type DDSpell = {
  id: string;
  name: string;
  description: string;
  tooltip: string;
  maxrank: number;
  cooldown: number[];
  cost: number[];
  costType: string;
  range: number[];
  resource?: string;
};
type DDChampion = {
  id: string;
  key: string;
  name: string;
  title: string;
  tags: string[];
  partype: string;
  info: { attack: number; defense: number; magic: number; difficulty: number };
  stats: Record<string, number>;
  spells: DDSpell[];
  passive: { name: string; description: string };
};

async function main(): Promise<void> {
  const version = await latestDDragonVersion();
  const full = await fetchJson<{ data: Record<string, DDChampion> }>(`${DDRAGON}/cdn/${version}/data/en_US/championFull.json`);
  if (!full) throw new Error("championFull.json missing");
  const champions = Object.values(full.data).sort((a, b) => a.id.localeCompare(b.id));

  // Wiki ChampionData (Lua) — windup offsets, radii, ARAM modifiers, roles.
  const wikiLua = await wikiSource("Module:ChampionData/data");
  const wikiData = wikiLua ? parseLuaTable(wikiLua) : null;
  const wikiByApi = new Map<string, JsonObject>();
  if (isObject(wikiData)) {
    for (const [name, rec] of Object.entries(wikiData)) {
      if (!isObject(rec)) continue;
      const api = typeof rec["apiname"] === "string" ? rec["apiname"] : name;
      wikiByApi.set(api.toLowerCase(), { ...rec, __wikiName: name });
    }
  }

  const champOut: ChampionRecord[] = [];
  const abilityOut: AbilityRecord[] = [];
  let missingBins = 0;

  for (const c of champions) {
    const alias = c.id.toLowerCase();
    process.stdout.write(`${c.id} `);
    const bin = await fetchJson<JsonObject>(`${CDRAGON}/game/data/characters/${alias}/${alias}.bin.json`);
    const notes: string[] = [];
    let root: JsonObject | null = null;
    if (bin) {
      const rk = Object.keys(bin).find((k) => k.toLowerCase() === `characters/${alias}/characterrecords/root`);
      const r = rk ? bin[rk] : undefined;
      if (isObject(r)) root = r;
    } else missingBins++;

    const s = c.stats;
    const w = wikiByApi.get(c.id.toLowerCase()) ?? wikiByApi.get(c.name.toLowerCase()) ?? null;
    const ws = w && isObject(w["stats"]) ? w["stats"] : null;
    const discrepancies: string[] = [];

    // Attack timing
    const basic = root && isObject(root["basicAttack"]) ? root["basicAttack"] : null;
    const offsetBin = basic ? num(basic["mAttackDelayCastOffsetPercent"]) : null;
    const offsetWiki = ws ? num(ws["attack_delay_offset"]) : null;
    const castTime = basic ? num(basic["mAttackCastTime"]) : null;
    const totalTime = basic ? num(basic["mAttackTotalTime"]) : null;
    const windupMod = basic ? num(basic["mAttackDelayCastOffsetPercentAttackSpeedRatio"]) : null;
    let windup: number | null = null;
    let windupSource: string | null = null;
    if (castTime !== null && totalTime !== null && totalTime > 0) {
      windup = clean(castTime / totalTime);
      windupSource = "bin: mAttackCastTime / mAttackTotalTime";
    } else if (offsetBin !== null || basic) {
      windup = clean(0.3 + (offsetBin ?? 0));
      windupSource = "bin: 0.3 + mAttackDelayCastOffsetPercent";
    } else if (offsetWiki !== null) {
      windup = clean(0.3 + offsetWiki);
      windupSource = "wiki: 0.3 + attack_delay_offset";
    }
    if (offsetBin !== null && offsetWiki !== null && Math.abs(offsetBin - offsetWiki) > 1e-4) discrepancies.push(`attack_delay_offset bin ${offsetBin} vs wiki ${offsetWiki}`);

    // Basic attack missile speed (bin basic attack spell)
    let attackMissile: number | null = ws ? num(ws["missile_speed"]) : null;
    if (bin) {
      const ba = Object.entries(bin).find(([k]) => k.toLowerCase() === `characters/${alias}/spells/${alias}basicattack`);
      if (ba && isObject(ba[1])) {
        const sp = readSpell(ba[0], ba[1], 1);
        if (sp?.missileSpeed && (c.stats["attackrange"] ?? 0) > 300) attackMissile = sp.missileSpeed;
      }
    }

    const ddVsBin = (label: string, dd: number | undefined, bv: number | null): void => {
      if (dd !== undefined && bv !== null && Math.abs(dd - bv) > 0.01) discrepancies.push(`${label} ddragon ${dd} vs bin ${bv}`);
    };
    if (root) {
      ddVsBin("hp", s["hp"], modifiable(root["baseHPModifiable"]));
      ddVsBin("armor", s["armor"], modifiable(root["baseArmorModifiable"]));
      ddVsBin("attackdamage", s["attackdamage"], modifiable(root["baseDamageModifiable"]));
      ddVsBin("movespeed", s["movespeed"], modifiable(root["baseMoveSpeedModifiable"]));
    }

    const g = (base: string, lvl: string): Growth => ({ base: s[base] ?? null, perLevel: s[lvl] ?? null });
    const ratings: Record<string, number> = {};
    if (w) for (const k of ["damage", "toughness", "control", "mobility", "utility"]) if (typeof w[k] === "number") ratings[k] = w[k];
    const modes: Record<string, Json> = {};
    if (ws) for (const k of ["aram", "urf", "ar", "nb", "ofa", "usb"]) if (ws[k] !== undefined) modes[k] = ws[k] ?? null;
    const strList = (v: Json | undefined): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : isObject(v) ? Object.values(v).filter((x): x is string => typeof x === "string") : []);

    champOut.push({
      id: c.id,
      key: Number(c.key),
      name: c.name,
      title: c.title,
      tags: c.tags,
      resource: c.partype,
      info: c.info ?? null,
      stats: {
        hp: g("hp", "hpperlevel"),
        mp: g("mp", "mpperlevel"),
        armor: g("armor", "armorperlevel"),
        magicResist: g("spellblock", "spellblockperlevel"),
        attackDamage: g("attackdamage", "attackdamageperlevel"),
        hpRegenPer5: g("hpregen", "hpregenperlevel"),
        mpRegenPer5: g("mpregen", "mpregenperlevel"),
        crit: g("crit", "critperlevel"),
        attackSpeed: {
          base: s["attackspeed"] ?? null,
          perLevelPercent: s["attackspeedperlevel"] ?? null,
          ratio: (root ? modifiable(root["attackSpeedRatioModifiable"]) : null) ?? (ws ? num(ws["as_ratio"]) : null),
        },
        attackRange: s["attackrange"] ?? null,
        moveSpeed: s["movespeed"] ?? null,
        critDamageMultiplier: root ? num(root["critDamageMultiplier"]) : null,
      },
      attack: {
        windupPercent: windup,
        windupSource,
        attackDelayOffset: offsetBin ?? offsetWiki,
        windupModifier: windupMod ?? (ws ? num(ws["windup_modifier"]) : null),
        attackCastTime: castTime,
        attackTotalTime: totalTime,
        missileSpeed: attackMissile,
      },
      radii: {
        gameplay: (root ? num(root["overrideGameplayCollisionRadius"]) : null) ?? (ws ? num(ws["gameplay_radius"]) : null) ?? 65,
        selection: (root ? num(root["selectionRadius"]) : null) ?? (ws ? num(ws["selection_radius"]) : null),
        selectionHeight: (root ? num(root["selectionHeight"]) : null) ?? (ws ? num(ws["selection_height"]) : null),
        pathfinding: (root ? num(root["pathfindingCollisionRadius"]) : null) ?? (ws ? num(ws["pathing_radius"]) : null),
        acquisition: (root ? num(root["acquisitionRange"]) : null) ?? (ws ? num(ws["acquisition_radius"]) : null),
      },
      wiki: w
        ? {
            herotype: typeof w["herotype"] === "string" ? w["herotype"] : null,
            alttype: typeof w["alttype"] === "string" ? w["alttype"] : null,
            rangetype: typeof w["rangetype"] === "string" ? w["rangetype"] : null,
            adaptivetype: typeof w["adaptivetype"] === "string" ? w["adaptivetype"] : null,
            roles: strList(w["role"]),
            positions: strList(w["client_positions"]),
            ratings: Object.keys(ratings).length ? ratings : null,
            modeModifiers: Object.keys(modes).length ? modes : null,
            releaseDate: typeof w["date"] === "string" ? w["date"] : null,
            lastChanged: typeof w["changes"] === "string" ? w["changes"] : null,
          }
        : null,
      discrepancies,
    });

    // ---- Abilities
    const spellPaths = root && Array.isArray(root["spells"]) ? root["spells"].filter((x): x is string => typeof x === "string") : [];
    const abilities = bin ? Object.values(bin).filter((o): o is JsonObject => isObject(o) && o["__type"] === "AbilityObject") : [];
    const byPathLower = new Map<string, [string, JsonObject]>();
    if (bin) for (const [k, v] of Object.entries(bin)) if (isObject(v)) byPathLower.set(k.toLowerCase(), [k, v]);

    const childrenOf = (rootPath: string): string[] => {
      const ab = abilities.find((a) => typeof a["mRootSpell"] === "string" && a["mRootSpell"].toLowerCase() === rootPath.toLowerCase());
      const kids = ab && Array.isArray(ab["mChildSpells"]) ? ab["mChildSpells"].filter((x): x is string => typeof x === "string") : [];
      return kids.filter((k) => k.toLowerCase() !== rootPath.toLowerCase());
    };

    const slots: ("P" | "Q" | "W" | "E" | "R")[] = ["P", "Q", "W", "E", "R"];
    for (const slot of slots) {
      const dd = slot === "P" ? null : c.spells[slots.indexOf(slot) - 1] ?? null;
      const maxRank = dd?.maxrank ?? (slot === "P" ? 1 : null);
      const rankLen = maxRank ?? 5;
      let rootPath: string | null = null;
      if (slot === "P") {
        const pAb = abilities.find((a) => a["mType"] === 3) ?? abilities.find((a) => typeof a["mName"] === "string" && /passive/i.test(a["mName"]));
        if (pAb && typeof pAb["mRootSpell"] === "string") rootPath = pAb["mRootSpell"];
        else if (root && typeof root["passiveSpell"] === "string") {
          const ps = root["passiveSpell"].toLowerCase();
          rootPath = [...byPathLower.values()].find(([k]) => k.toLowerCase().endsWith("/" + ps))?.[0] ?? null;
        }
      } else {
        rootPath = spellPaths[slots.indexOf(slot) - 1] ?? null;
      }
      const notes: string[] = [];
      const rootEntry = rootPath ? byPathLower.get(rootPath.toLowerCase()) : undefined;
      const rootSpell = rootEntry ? readSpell(rootEntry[0], rootEntry[1], rankLen) : null;
      if (!rootSpell) notes.push(rootPath ? `bin spell ${rootPath} has no mSpell data` : "no bin spell found");
      const children: SpellNumbers[] = [];
      if (rootPath) {
        for (const kid of childrenOf(rootPath)) {
          const e = byPathLower.get(kid.toLowerCase());
          const sp = e ? readSpell(e[0], e[1], rankLen) : null;
          if (sp && (Object.keys(sp.dataValues).length || Object.keys(sp.calculations).length || sp.missileSpeed)) children.push(sp);
        }
      }
      // Merged view: root first, then children (prefixed on clash)
      const dataValues: Record<string, number[]> = { ...(rootSpell?.dataValues ?? {}) };
      const calculations: Record<string, string> = {};
      const ratios: RatioRecord[] = [...(rootSpell?.ratios ?? [])];
      for (const [k, v] of Object.entries(rootSpell?.calculations ?? {})) calculations[k] = v.formula;
      for (const ch of children) {
        const tag = ch.scriptName ?? ch.binPath.split("/").pop() ?? "child";
        for (const [k, v] of Object.entries(ch.dataValues)) dataValues[k in dataValues ? `${tag}.${k}` : k] = v;
        for (const [k, v] of Object.entries(ch.calculations)) calculations[k in calculations ? `${tag}.${k}` : k] = v.formula;
        for (const r of ch.ratios) ratios.push({ ...r, calculation: `${tag}.${r.calculation}` });
      }
      if (!Object.keys(dataValues).length && rootSpell?.effectAmounts) notes.push("legacy spell: numbers only in effectAmounts (unnamed)");

      const text = stripHtml(slot === "P" ? c.passive.description : `${dd?.description ?? ""} ${dd?.tooltip ?? ""}`);
      abilityOut.push({
        champion: c.id,
        slot,
        name: slot === "P" ? c.passive.name : dd?.name ?? "?",
        ddragonId: dd?.id ?? null,
        description: stripHtml(slot === "P" ? c.passive.description : dd?.description ?? ""),
        maxRank,
        cooldown: dd?.cooldown ?? rootSpell?.cooldown ?? null,
        cost: dd?.cost ?? rootSpell?.mana ?? null,
        costType: dd ? resourceName(dd.costType, c.partype) : null,
        range: dd?.range ?? rootSpell?.castRange ?? null,
        castTime: rootSpell?.castTime ?? null,
        missileSpeed: rootSpell?.missileSpeed ?? children.find((x) => x.missileSpeed)?.missileSpeed ?? null,
        lineWidth: rootSpell?.lineWidth ?? children.find((x) => x.lineWidth)?.lineWidth ?? null,
        castRadius: rootSpell?.castRadius ?? null,
        dataValues,
        calculations,
        ratios,
        crowdControl: detectCc(text, dataValues),
        root: rootSpell,
        children,
        notes,
      });
    }
    void notes;
  }
  process.stdout.write("\n");

  const retrievedAt = new Date().toISOString();
  writeOutput("champions.json", {
    source: [
      `${DDRAGON}/cdn/${version}/data/en_US/championFull.json`,
      `${CDRAGON}/game/data/characters/<alias>/<alias>.bin.json`,
      `${WIKI_PAGE}Module:ChampionData/data`,
    ],
    version,
    retrievedAt,
    notes: [
      "Base stats and growth: Data Dragon. Growth formula: stat(n) = base + perLevel × (n − 1) × (0.7025 + 0.0175 × (n − 1)).",
      "attackSpeed.perLevelPercent is a percentage of bonus attack speed applied with the same growth formula; bonus AS is multiplied by attackSpeed.ratio.",
      "attack.windupPercent: mAttackCastTime/mAttackTotalTime when present, else 0.3 + attackDelayOffset (wiki convention).",
      "radii from CDragon bins (gameplay radius defaults to 65 when not overridden); wiki block from Module:ChampionData/data (community-maintained).",
      `${missingBins} champions without CDragon bin.`,
      "discrepancies lists Data Dragon vs bin mismatches (bin = live game files, usually newer).",
    ],
    champions: champOut,
  });
  writeOutput("abilities.json", {
    source: [`${DDRAGON}/cdn/${version}/data/en_US/championFull.json`, `${CDRAGON}/game/data/characters/<alias>/<alias>.bin.json`],
    version,
    retrievedAt,
    notes: [
      "cooldown/cost/range: Data Dragon (rank 1..maxRank). dataValues/calculations/ratios/castTime/missileSpeed/lineWidth: CommunityDragon bins.",
      "dataValues: arrays indexed rank 1..maxRank (bin index 0 = rank-0 placeholder dropped); constant arrays collapsed to one value.",
      "calculations: human-readable rendering of the game's GameCalculation tree. Stat names ending with '?' are unverified enum guesses (see README).",
      "ratios: every stat scaling found in calculations; scaling = total | bonus | base.",
      "crowdControl is a heuristic (keywords in tooltip text and dataValue names), not authoritative.",
      "root/children: raw-ish numbers of the ability's root spell and its child spells (sub-casts, buffs, missiles).",
      "Values are base Summoner's Rift numbers; per-mode overrides (DataValuesModeOverride) are not included.",
    ],
    abilities: abilityOut,
  });
}

await main();
