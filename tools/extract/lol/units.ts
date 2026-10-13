// Builds data/reference/lol/units.json: base records of Summoner's Rift lane
// minions, jungle/epic monsters and the generic turret, from CommunityDragon bins.
// Wave/time scaling of minions and turrets is scripted in game and NOT in these
// records: see mechanics/minion.md and mechanics/turret.md (wiki).
// Usage: NODE_USE_ENV_PROXY=1 node tools/extract/lol/units.ts [--refresh]

import { CDRAGON, clean, fetchJson, isObject, latestDDragonVersion, writeOutput } from "./lib.ts";
import type { Json, JsonObject } from "./lib.ts";

const UNITS: [string, string][] = [
  ["sru_orderminionmelee", "lane minion"],
  ["sru_orderminionranged", "lane minion"],
  ["sru_orderminionsiege", "lane minion"],
  ["sru_orderminionsuper", "lane minion"],
  ["ha_orderminionmelee", "lane minion (ARAM)"],
  ["ha_orderminionranged", "lane minion (ARAM)"],
  ["ha_orderminionsiege", "lane minion (ARAM)"],
  ["ha_orderminionsuper", "lane minion (ARAM)"],
  ["turret", "structure"],
  ["sru_baron", "epic monster"],
  ["sru_riftherald", "epic monster"],
  ["sru_horde", "epic monster"],
  ["sru_atakhan", "epic monster"],
  ["sru_dragon_air", "epic monster"],
  ["sru_dragon_earth", "epic monster"],
  ["sru_dragon_fire", "epic monster"],
  ["sru_dragon_water", "epic monster"],
  ["sru_dragon_hextech", "epic monster"],
  ["sru_dragon_chemtech", "epic monster"],
  ["sru_dragon_elder", "epic monster"],
  ["sru_blue", "buff monster"],
  ["sru_red", "buff monster"],
  ["sru_gromp", "jungle monster"],
  ["sru_krug", "jungle monster"],
  ["sru_krugmini", "jungle monster"],
  ["sru_krugminimini", "jungle monster"],
  ["sru_razorbeak", "jungle monster"],
  ["sru_razorbeakmini", "jungle monster"],
  ["sru_murkwolf", "jungle monster"],
  ["sru_murkwolfmini", "jungle monster"],
  ["sru_crab", "jungle monster"],
];

const FIELDS: [string, string][] = [
  ["hp", "baseHPModifiable"],
  ["hpPerLevel", "hpPerLevelModifiable"],
  ["hpRegen", "baseStaticHPRegenModifiable"],
  ["attackDamage", "baseDamageModifiable"],
  ["attackDamagePerLevel", "damagePerLevelModifiable"],
  ["armor", "baseArmorModifiable"],
  ["armorPerLevel", "armorPerLevelModifiable"],
  ["magicResist", "baseMR"],
  ["magicResistPerLevel", "mrPerLevel"],
  ["moveSpeed", "baseMoveSpeedModifiable"],
  ["attackRange", "attackRangeModifiable"],
  ["attackSpeed", "attackSpeedModifiable"],
  ["attackSpeedRatio", "attackSpeedRatioModifiable"],
  ["acquisitionRange", "acquisitionRange"],
  ["expGivenOnDeath", "expGivenOnDeath"],
  ["goldGivenOnDeath", "goldGivenOnDeath"],
  ["globalGoldGivenOnDeath", "globalGoldGivenOnDeath"],
  ["globalExpGivenOnDeath", "globalExpGivenOnDeath"],
  ["experienceRadius", "experienceRadius"],
  ["gameplayRadius", "overrideGameplayCollisionRadius"],
  ["selectionRadius", "selectionRadius"],
  ["pathfindingRadius", "pathfindingCollisionRadius"],
  ["towerTargetingPriorityBoost", "towerTargetingPriorityBoost"],
];

function value(v: Json | undefined): number | null {
  if (typeof v === "number") return clean(v);
  if (isObject(v) && typeof v["baseValue"] === "number") return clean(v["baseValue"]);
  return null;
}

async function main(): Promise<void> {
  const version = await latestDDragonVersion();
  const units: JsonObject[] = [];
  const missing: string[] = [];
  for (const [name, category] of UNITS) {
    const bin = await fetchJson<JsonObject>(`${CDRAGON}/game/data/characters/${name}/${name}.bin.json`);
    const rootKey = bin ? Object.keys(bin).find((k) => /\/characterrecords\/root$/i.test(k)) : undefined;
    const root = bin && rootKey ? bin[rootKey] : undefined;
    if (!isObject(root)) {
      missing.push(name);
      continue;
    }
    const stats: Record<string, number | null> = {};
    for (const [out, key] of FIELDS) stats[out] = value(root[key]);
    units.push({
      id: typeof root["mCharacterName"] === "string" ? root["mCharacterName"] : name,
      category,
      tags: typeof root["unitTagsString"] === "string" ? root["unitTagsString"].split("|").map((s) => s.trim()) : [],
      stats,
    });
  }
  writeOutput("units.json", {
    source: `${CDRAGON}/game/data/characters/<name>/<name>.bin.json`,
    version,
    retrievedAt: new Date().toISOString(),
    notes: [
      "Base CharacterRecord values only. Minion stat growth per wave/time, turret stats, plates and damage ramp, and monster level scaling rules are scripted and documented in mechanics/minion.md, turret.md, monster.md (wiki).",
      "Order minions only (Chaos minions share stats). null = field absent in the record (game default applies, e.g. 0 armor or 65 gameplay radius).",
      "The 'turret' record is a generic template; real SR turret stats (by tier) come from map scripts — use mechanics/turret.md.",
      `Not found in CommunityDragon: ${missing.join(", ") || "none"}.`,
    ],
    units,
  });
}

await main();
