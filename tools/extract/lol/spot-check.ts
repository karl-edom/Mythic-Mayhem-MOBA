// Spot-checks Q abilities from abilities.json against the LoL wiki ability
// data templates (Template:Data <Champion>/<Ability>). Writes spot-check.json.
// Usage: NODE_USE_ENV_PROXY=1 node tools/extract/lol/spot-check.ts [Champion ...]

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { OUT_DIR, wikiSource, writeOutput } from "./lib.ts";

type Ratio = { stat: string; scaling: string; values: number[] | null };
type Ability = { champion: string; slot: string; name: string; calculations: Record<string, string>; dataValues: Record<string, number[]>; ratios: Ratio[]; cooldown: number[] | null; cost: number[] | null };

const champs = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const targets = champs.length ? champs : ["Annie", "Garen", "Ahri", "Ezreal", "Lux", "Thresh", "Yasuo", "Jinx"];

const file = JSON.parse(readFileSync(join(OUT_DIR, "abilities.json"), "utf8")) as { version: string; abilities: Ability[] };

function wikiNumbers(text: string): Set<number> {
  const out = new Set<number>();
  // expand "{{ap|80 to 260}}" style ranges into endpoints, keep all other numbers
  for (const m of text.matchAll(/-?\d+(?:\.\d+)?/g)) out.add(Number(m[0]));
  return out;
}

const results = [];
for (const champ of targets) {
  const ab = file.abilities.find((a) => a.champion === champ && a.slot === "Q");
  if (!ab) continue;
  const wikiName = ab.name;
  const src = await wikiSource(`Template:Data ${champ === "MonkeyKing" ? "Wukong" : champ}/${wikiName}`);
  const field = (name: string): string | null => {
    if (!src) return null;
    const m = new RegExp(`\\|${name}\\s*=([\\s\\S]*?)\\n\\|[a-z]`, "i").exec(src);
    return m ? (m[1] ?? "").trim() : null;
  };
  const leveling = [field("leveling"), field("leveling2"), field("leveling3")].filter(Boolean).join(" || ");
  const nums = wikiNumbers(leveling);
  // values we expect to find: endpoints of rank-scaled data values used in damage calcs + ratio percentages
  const checks: { what: string; value: number; found: boolean }[] = [];
  const usedDv = new Set<string>();
  for (const f of Object.values(ab.calculations)) for (const m of f.matchAll(/(\w+)\(([\d./-]+)\)/g)) usedDv.add(m[1] ?? "");
  for (const n of usedDv) {
    const v = ab.dataValues[n];
    if (!v || v.length < 2) continue;
    for (const x of [v[0], v[v.length - 1]]) if (x !== undefined) checks.push({ what: `${n} rank endpoint`, value: x, found: nums.has(x) });
  }
  for (const r of ab.ratios) for (const x of r.values ?? []) {
    const pct = Math.round(x * 1000) / 10;
    checks.push({ what: `${r.scaling} ${r.stat} ratio (as "N%")`, value: pct, found: new RegExp(`(?<![\\d.])${pct}%`).test(leveling) });
  }
  results.push({
    champion: champ,
    ability: wikiName,
    wikiTemplate: `Template:Data ${champ}/${wikiName}`,
    wikiLeveling: leveling || null,
    wikiCooldown: field("cooldown"),
    wikiCost: field("cost"),
    extracted: { calculations: ab.calculations, cooldown: ab.cooldown, cost: ab.cost },
    checks,
    allFound: checks.length > 0 && checks.every((c) => c.found),
  });
  console.log(`${champ} Q ${wikiName}: ${checks.filter((c) => c.found).length}/${checks.length} values found in wiki leveling`);
}

writeOutput("spot-check.json", {
  source: "https://wiki.leagueoflegends.com/en-us/ (Template:Data <Champion>/<Ability>) vs abilities.json",
  version: file.version,
  retrievedAt: new Date().toISOString(),
  notes: [
    "Garen Q: the bin's TotalDamage (1.5 × AD) includes the empowered basic attack itself (100% AD), the wiki lists only the bonus part (+50% AD): same mechanic, different presentation.",
    "Automatic check: rank endpoints of data values used in calculations and ratio percentages must appear in the wiki 'leveling' field. Manual reading of wikiLeveling vs extracted.calculations is recommended for 'allFound: false'."],
  results,
});
