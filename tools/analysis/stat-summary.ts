// Summary statistics of unit stats in the reference data (LoL, MLBB, Pokémon Unite).
// Prints Markdown tables (min / median / max per role) to paste into
// docs/research/systems/C-D-stats-formules.md.
// Usage: node tools/analysis/stat-summary.ts
// Zero dependencies: Node 22 built-ins only. Reads data/reference/{lol,mlbb,unite}/*.json.

import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

function readJson<T>(relativePath: string): T {
  return JSON.parse(readFileSync(join(ROOT, relativePath), "utf8")) as T;
}

// ---------- Source shapes (only the fields used here) ----------

interface Growth {
  base: number;
  perLevel: number;
}
interface LolChampion {
  id: string;
  name: string;
  tags: string[];
  stats: {
    hp: Growth;
    armor: Growth;
    magicResist: Growth;
    attackDamage: Growth;
    attackSpeed: { base: number; perLevelPercent: number; ratio: number | null };
    attackRange: number;
    moveSpeed: number;
  };
  attack: { windupPercent: number | null };
  radii: { gameplay: number | null; selection: number | null; acquisition: number | null };
}
interface Lvl1And15 {
  level1: number | null;
  level15: number | null;
}
interface MlbbHero {
  name: string;
  roles: string[];
  stats: {
    hp: Lvl1And15 | null;
    physicalAttack: Lvl1And15 | null;
    physicalDefense: Lvl1And15 | null;
    magicDefense: Lvl1And15 | null;
    attackSpeed: Lvl1And15 | null;
    attackSpeedRatioPct: number | null;
    movementSpeed: number | null;
    basicAttackRange: number | null;
  };
}
interface UniteLevel {
  level: number;
  hp: number | null;
  attack: number | null;
  defense: number | null;
  spAttack: number | null;
  spDefense: number | null;
  critRatePct: number | null;
  cdrPct: number | null;
  lifestealPct: number | null;
  penetration: number | null;
  attackSpeedBonusPct: number | null;
  moveSpeed: number | null;
}
interface UnitePokemon {
  name: string;
  role: string;
  range: string;
  evolution: { name: string; fromLevel: number }[];
  stats: UniteLevel[];
}

// ---------- Helpers ----------

type Num = number | null | undefined;

function clean(values: Num[]): number[] {
  return values.filter((v): v is number => typeof v === "number" && Number.isFinite(v)).sort((a, b) => a - b);
}

function median(sorted: number[]): number {
  const n = sorted.length;
  if (n === 0) return Number.NaN;
  const mid = Math.floor(n / 2);
  const hi = sorted[mid] ?? Number.NaN;
  const lo = sorted[mid - 1] ?? hi;
  return n % 2 === 1 ? hi : (lo + hi) / 2;
}

function fmt(x: number): string {
  if (!Number.isFinite(x)) return "—";
  const abs = Math.abs(x);
  if (abs >= 100) return String(Math.round(x));
  if (abs >= 10) return x.toFixed(1).replace(/\.0$/, "");
  return x.toFixed(2).replace(/\.?0+$/, "");
}

function triple(values: Num[]): string {
  const s = clean(values);
  if (s.length === 0) return "❓";
  return `${fmt(s[0] ?? Number.NaN)} / ${fmt(median(s))} / ${fmt(s[s.length - 1] ?? Number.NaN)}`;
}

function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return Number.NaN;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const a = sorted[lo] ?? Number.NaN;
  const b = sorted[Math.min(lo + 1, sorted.length - 1)] ?? a;
  return a + (b - a) * (pos - lo);
}

function quartiles(values: Num[]): string {
  const s = clean(values);
  if (s.length === 0) return "❓";
  return `${fmt(quantile(s, 0.25))} / ${fmt(median(s))} / ${fmt(quantile(s, 0.75))}`;
}

function groupBy<T>(items: T[], key: (item: T) => string): Map<string, T[]> {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    const list = groups.get(k) ?? [];
    list.push(item);
    groups.set(k, list);
  }
  return new Map([...groups.entries()].sort((a, b) => a[0].localeCompare(b[0])));
}

interface Metric<T> {
  label: string;
  get: (item: T) => Num;
}

function roleTable<T>(items: T[], role: (item: T) => string, metrics: Metric<T>[]): string {
  const groups = groupBy(items, role);
  const header = ["Stat", ...[...groups.keys()].map((k) => `${k} (n=${groups.get(k)?.length ?? 0})`), `Tous (n=${items.length})`];
  const lines = [`| ${header.join(" | ")} |`, `| ${header.map(() => "---").join(" | ")} |`];
  for (const m of metrics) {
    const cells = [...groups.values()].map((list) => triple(list.map(m.get)));
    lines.push(`| ${m.label} | ${cells.join(" | ")} | ${triple(items.map(m.get))} |`);
  }
  return lines.join("\n");
}

// LoL growth formula (wiki "Champion statistic"): base + g × (n − 1) × (0.7025 + 0.0175 × (n − 1)).
function lolGrowth(base: number, perLevel: number, level: number): number {
  return base + perLevel * (level - 1) * (0.7025 + 0.0175 * (level - 1));
}
function lolAttackSpeed(c: LolChampion, level: number): number {
  const as = c.stats.attackSpeed;
  const bonus = lolGrowth(0, as.perLevelPercent / 100, level);
  return as.base + bonus * (as.ratio ?? as.base);
}
// Damage taken multipliers.
const lolMult = (armor: number): number => (armor >= 0 ? 100 / (100 + armor) : 2 - 100 / (100 - armor));
const mlbbMult = (def: number): number => 120 / (120 + def);

function at(p: UnitePokemon, level: number): UniteLevel | undefined {
  return p.stats.find((s) => s.level === level);
}

// ---------- Load ----------

const lol = readJson<{ version: string; champions: LolChampion[] }>("data/reference/lol/champions.json");
const mlbb = readJson<{ heroes: MlbbHero[] }>("data/reference/mlbb/heroes.json");
const unite = readJson<{ pokemon: UnitePokemon[] }>("data/reference/unite/pokemon.json");

const champions = lol.champions;

// Data Dragon 16.20.1 publishes attackdamageperlevel = 0 for every champion, while the game files
// (CommunityDragon bin, damagePerLevel) and the wiki (dam_lvl) do not. When the local extraction cache
// is present, read AD growth from the bin; otherwise AD at max level is reported as unknown.
const adGrowthFromBin = new Map<string, number>();
for (const c of champions) {
  const alias = c.id.toLowerCase();
  const binFile = join(ROOT, `.cache/extract/lol/raw.communitydragon.org/latest/game/data/characters/${alias}/${alias}.bin.json`);
  if (!existsSync(binFile)) continue;
  const match = /"damagePerLevel(?:Modifiable)?"\s*:\s*\{\s*"baseValue"\s*:\s*([-\d.e]+)/.exec(readFileSync(binFile, "utf8"));
  adGrowthFromBin.set(c.id, match?.[1] ? Number(match[1]) : 0);
}
const adGrowthKnown = adGrowthFromBin.size === champions.length;
function lolAd(c: LolChampion, level: number): number | null {
  if (level === 1) return c.stats.attackDamage.base;
  if (!adGrowthKnown) return null;
  return lolGrowth(c.stats.attackDamage.base, adGrowthFromBin.get(c.id) ?? 0, level);
}
const heroes = mlbb.heroes.filter((h) => h.stats.hp?.level1 != null); // Dori: empty stats
const pokemon = unite.pokemon.filter((p) => p.stats.length === 15 && at(p, 1)?.hp != null);

const out: string[] = [];
const say = (s = ""): void => {
  out.push(s);
};

say("<!-- Généré par `node tools/analysis/stat-summary.ts` — ne pas éditer à la main. -->");
say("Cellules : **min / médiane / max**. Rôle = premier rôle listé (LoL : `tags[0]`, MLBB : `roles[0]`, Unite : `role`).");
say();

// ---------- LoL ----------
say(`### LoL — ${champions.length} champions (Data Dragon ${lol.version}), niveaux 1 et 18`);
say();
say(
  roleTable(champions, (c) => c.tags[0] ?? "?", [
    { label: "PV niv. 1", get: (c) => c.stats.hp.base },
    { label: "PV niv. 18", get: (c) => lolGrowth(c.stats.hp.base, c.stats.hp.perLevel, 18) },
    { label: "AD niv. 1", get: (c) => c.stats.attackDamage.base },
    { label: "AD niv. 18", get: (c) => lolAd(c, 18) },
    { label: "Armure niv. 1", get: (c) => c.stats.armor.base },
    { label: "Armure niv. 18", get: (c) => lolGrowth(c.stats.armor.base, c.stats.armor.perLevel, 18) },
    { label: "RM niv. 1", get: (c) => c.stats.magicResist.base },
    { label: "RM niv. 18", get: (c) => lolGrowth(c.stats.magicResist.base, c.stats.magicResist.perLevel, 18) },
    { label: "VA niv. 1 (att./s)", get: (c) => c.stats.attackSpeed.base },
    { label: "VA niv. 18 sans objet", get: (c) => lolAttackSpeed(c, 18) },
    { label: "Ratio de VA", get: (c) => c.stats.attackSpeed.ratio },
    { label: "Croissance AD (/niv., bin)", get: (c) => (adGrowthKnown ? (adGrowthFromBin.get(c.id) ?? 0) : null) },
    { label: "Croissance VA (%/niv.)", get: (c) => c.stats.attackSpeed.perLevelPercent },
    { label: "Windup (% du cycle)", get: (c) => (c.attack.windupPercent == null ? null : c.attack.windupPercent * 100) },
    { label: "Vitesse (u/s)", get: (c) => c.stats.moveSpeed },
    { label: "Portée (u)", get: (c) => c.stats.attackRange },
    { label: "Rayon gameplay (u)", get: (c) => c.radii.gameplay },
    { label: "Rayon sélection (u)", get: (c) => c.radii.selection },
    { label: "Rayon d'acquisition (u)", get: (c) => c.radii.acquisition },
  ]),
);
say();
say(
  adGrowthKnown
    ? "AD par niveau lu dans les bins CommunityDragon du cache local (`.cache/extract/lol/`) : Data Dragon 16.20.1 publie 0 pour les 173 champions."
    : "AD niv. 18 inconnu : Data Dragon 16.20.1 publie une croissance d'AD de 0 et le cache des bins CommunityDragon est absent (relancer `node tools/extract/lol/all.ts`).",
);
say();

// ---------- MLBB ----------
say(`### MLBB — ${heroes.length} héros (wiki Fandom, niveaux 1 et 15)`);
say();
say(
  roleTable(heroes, (h) => h.roles[0] ?? "?", [
    { label: "PV niv. 1", get: (h) => h.stats.hp?.level1 },
    { label: "PV niv. 15", get: (h) => h.stats.hp?.level15 },
    { label: "Attaque phys. niv. 1", get: (h) => h.stats.physicalAttack?.level1 },
    { label: "Attaque phys. niv. 15", get: (h) => h.stats.physicalAttack?.level15 },
    { label: "Déf. phys. niv. 1", get: (h) => h.stats.physicalDefense?.level1 },
    { label: "Déf. phys. niv. 15", get: (h) => h.stats.physicalDefense?.level15 },
    { label: "Déf. mag. niv. 1", get: (h) => h.stats.magicDefense?.level1 },
    { label: "Déf. mag. niv. 15", get: (h) => h.stats.magicDefense?.level15 },
    { label: "VA niv. 1 (att./s)", get: (h) => h.stats.attackSpeed?.level1 },
    { label: "VA niv. 15 (att./s)", get: (h) => h.stats.attackSpeed?.level15 },
    { label: "Ratio de VA (%)", get: (h) => h.stats.attackSpeedRatioPct },
    { label: "Vitesse", get: (h) => h.stats.movementSpeed },
    { label: "Portée (unités wiki)", get: (h) => h.stats.basicAttackRange },
  ]),
);
say();
say(
  `Portée renseignée pour ${heroes.filter((h) => h.stats.basicAttackRange != null).length}/${heroes.length} héros. ` +
    "Masha : PV stockés par barre (×3 en jeu), non corrigés ici.",
);
say();

// ---------- Unite ----------
say(`### Pokémon Unite — ${pokemon.length} Pokémon (unite-db + Serebii), niveaux 1 et 15`);
say();
say(
  roleTable(pokemon, (p) => p.role, [
    { label: "PV niv. 1", get: (p) => at(p, 1)?.hp },
    { label: "PV niv. 15", get: (p) => at(p, 15)?.hp },
    { label: "Attaque niv. 1", get: (p) => at(p, 1)?.attack },
    { label: "Attaque niv. 15", get: (p) => at(p, 15)?.attack },
    { label: "Att. spé. niv. 1", get: (p) => at(p, 1)?.spAttack },
    { label: "Att. spé. niv. 15", get: (p) => at(p, 15)?.spAttack },
    { label: "Défense niv. 1", get: (p) => at(p, 1)?.defense },
    { label: "Défense niv. 15", get: (p) => at(p, 15)?.defense },
    { label: "Déf. spé. niv. 1", get: (p) => at(p, 1)?.spDefense },
    { label: "Déf. spé. niv. 15", get: (p) => at(p, 15)?.spDefense },
    { label: "Bonus VA niv. 1 (%)", get: (p) => at(p, 1)?.attackSpeedBonusPct },
    { label: "Bonus VA niv. 15 (%)", get: (p) => at(p, 15)?.attackSpeedBonusPct },
    { label: "Critique niv. 15 (%)", get: (p) => at(p, 15)?.critRatePct },
    { label: "Réd. recharge niv. 15 (%)", get: (p) => at(p, 15)?.cdrPct },
    { label: "Vol de vie niv. 15 (%)", get: (p) => at(p, 15)?.lifestealPct },
    { label: "« Pénétration » niv. 15 (sans unité)", get: (p) => at(p, 15)?.penetration },
    { label: "Vitesse niv. 1 (interne)", get: (p) => at(p, 1)?.moveSpeed },
    { label: "Vitesse niv. 15 (interne)", get: (p) => at(p, 15)?.moveSpeed },
  ]),
);
say();
const rangeCounts = groupBy(pokemon, (p) => p.range);
say(
  "Portée : catégorielle seulement (" +
    [...rangeCounts.entries()].map(([k, v]) => `${k} ${v.length}`).join(", ") +
    "), aucune distance publiée.",
);
say();

// ---------- Cross-game orders of magnitude ----------
say("### Ordres de grandeur comparés (médianes, tous rôles)");
say();
const lolArmor1 = median(clean(champions.map((c) => c.stats.armor.base)));
const lolArmor18 = median(clean(champions.map((c) => lolGrowth(c.stats.armor.base, c.stats.armor.perLevel, 18))));
const lolMr1 = median(clean(champions.map((c) => c.stats.magicResist.base)));
const lolMr18 = median(clean(champions.map((c) => lolGrowth(c.stats.magicResist.base, c.stats.magicResist.perLevel, 18))));
const mDef1 = median(clean(heroes.map((h) => h.stats.physicalDefense?.level1)));
const mDef15 = median(clean(heroes.map((h) => h.stats.physicalDefense?.level15)));
const mMdef1 = median(clean(heroes.map((h) => h.stats.magicDefense?.level1)));
const mMdef15 = median(clean(heroes.map((h) => h.stats.magicDefense?.level15)));
const pct = (x: number): string => `${(x * 100).toFixed(0)} %`;

const lolHp1 = median(clean(champions.map((c) => c.stats.hp.base)));
const lolHp18 = median(clean(champions.map((c) => lolGrowth(c.stats.hp.base, c.stats.hp.perLevel, 18))));
const lolAd1 = median(clean(champions.map((c) => c.stats.attackDamage.base)));
const lolAd18 = median(clean(champions.map((c) => lolAd(c, 18))));
const mHp1 = median(clean(heroes.map((h) => h.stats.hp?.level1)));
const mHp15 = median(clean(heroes.map((h) => h.stats.hp?.level15)));
const mAtk1 = median(clean(heroes.map((h) => h.stats.physicalAttack?.level1)));
const mAtk15 = median(clean(heroes.map((h) => h.stats.physicalAttack?.level15)));
const uHp1 = median(clean(pokemon.map((p) => at(p, 1)?.hp)));
const uHp15 = median(clean(pokemon.map((p) => at(p, 15)?.hp)));
const uAtk1 = median(clean(pokemon.map((p) => at(p, 1)?.attack)));
const uAtk15 = median(clean(pokemon.map((p) => at(p, 15)?.attack)));
const uDef1 = median(clean(pokemon.map((p) => at(p, 1)?.defense)));
const uDef15 = median(clean(pokemon.map((p) => at(p, 15)?.defense)));

say("| Indicateur | LoL (niv. 1 → 18) | MLBB (niv. 1 → 15) | Unite (niv. 1 → 15) |");
say("| --- | --- | --- | --- |");
say(`| PV médians | ${fmt(lolHp1)} → ${fmt(lolHp18)} (×${(lolHp18 / lolHp1).toFixed(2)}) | ${fmt(mHp1)} → ${fmt(mHp15)} (×${(mHp15 / mHp1).toFixed(2)}) | ${fmt(uHp1)} → ${fmt(uHp15)} (×${(uHp15 / uHp1).toFixed(2)}) |`);
say(`| Attaque médiane | ${fmt(lolAd1)} → ${fmt(lolAd18)} (×${(lolAd18 / lolAd1).toFixed(2)}) | ${fmt(mAtk1)} → ${fmt(mAtk15)} (×${(mAtk15 / mAtk1).toFixed(2)}) | ${fmt(uAtk1)} → ${fmt(uAtk15)} (×${(uAtk15 / uAtk1).toFixed(2)}) |`);
say(`| PV / attaque (coups bruts pour tuer) | ${fmt(lolHp1 / lolAd1)} → ${fmt(lolHp18 / lolAd18)} | ${fmt(mHp1 / mAtk1)} → ${fmt(mHp15 / mAtk15)} | ${fmt(uHp1 / uAtk1)} → ${fmt(uHp15 / uAtk15)} |`);
say(`| Défense physique médiane | ${fmt(lolArmor1)} → ${fmt(lolArmor18)} | ${fmt(mDef1)} → ${fmt(mDef15)} | ${fmt(uDef1)} → ${fmt(uDef15)} |`);
say(`| Dégâts physiques subis (formule du jeu) | ${pct(lolMult(lolArmor1))} → ${pct(lolMult(lolArmor18))} | ${pct(mlbbMult(mDef1))} → ${pct(mlbbMult(mDef15))} | ❓ (formule inconnue) |`);
say(`| Défense magique médiane | ${fmt(lolMr1)} → ${fmt(lolMr18)} | ${fmt(mMdef1)} → ${fmt(mMdef15)} | Déf. spé. ${fmt(median(clean(pokemon.map((p) => at(p, 1)?.spDefense))))} → ${fmt(median(clean(pokemon.map((p) => at(p, 15)?.spDefense))))} |`);
say(`| Dégâts magiques subis | ${pct(lolMult(lolMr1))} → ${pct(lolMult(lolMr18))} | ${pct(mlbbMult(mMdef1))} → ${pct(mlbbMult(mMdef15))} | ❓ |`);
say(
  `| Coups pour tuer après défense (PV / (attaque × multiplicateur)) | ${fmt(lolHp1 / (lolAd1 * lolMult(lolArmor1)))} → ${fmt(lolHp18 / (lolAd18 * lolMult(lolArmor18)))} | ${fmt(mHp1 / (mAtk1 * mlbbMult(mDef1)))} → ${fmt(mHp15 / (mAtk15 * mlbbMult(mDef15)))} | ❓ |`,
);

// Range expressed in seconds of the attacker's own base walking: unit-free comparison.
const lolRangeSec = clean(champions.map((c) => c.stats.attackRange / c.stats.moveSpeed));
const lolMeleeSec = clean(champions.filter((c) => c.stats.attackRange <= 300).map((c) => c.stats.attackRange / c.stats.moveSpeed));
const lolRangedSec = clean(champions.filter((c) => c.stats.attackRange > 300).map((c) => c.stats.attackRange / c.stats.moveSpeed));
const mlbbWithRange = heroes.filter((h) => h.stats.basicAttackRange != null && h.stats.movementSpeed != null);
const mRangeSec = (h: MlbbHero): number => ((h.stats.basicAttackRange ?? 0) * 100) / (h.stats.movementSpeed ?? 1);
const mMeleeSec = clean(mlbbWithRange.filter((h) => (h.stats.basicAttackRange ?? 0) < 3).map(mRangeSec));
const mRangedSec = clean(mlbbWithRange.filter((h) => (h.stats.basicAttackRange ?? 0) >= 3).map(mRangeSec));
const lolMs = median(clean(champions.map((c) => c.stats.moveSpeed)));
const mMs = median(clean(heroes.map((h) => h.stats.movementSpeed)));
say(`| Portée en secondes de marche (portée ÷ vitesse) — mêlée | ${triple(lolMeleeSec)} | ${triple(mMeleeSec)} | ❓ |`);
say(`| Portée en secondes de marche — distance | ${triple(lolRangedSec)} | ${triple(mRangedSec)} | ❓ |`);
say(`| Portée de tour en secondes de marche médiane | 750 ÷ ${fmt(lolMs)} = ${fmt(750 / lolMs)} s | 5.3 × 100 ÷ ${fmt(mMs)} = ${fmt(530 / mMs)} s | sans tour |`);
say();
say(
  `LoL : ${lolRangeSec.length} champions ; seuil mêlée ≤ 300 u. MLBB : ${mlbbWithRange.length} héros avec portée ; seuil mêlée < 3 unités ; ` +
    "1 unité de portée = 100 points de vitesse (wiki *Movement speed* : « x de vitesse = x/100 unités par seconde »).",
);
say();

// ---------- Growth shapes ----------
say("### Forme des courbes de croissance");
say();
say("Part du gain total (niv. 1 → max) acquise à mi-parcours :");
say();
const lolMid = lolGrowth(0, 1, 9.5) / lolGrowth(0, 1, 18);
say(`- LoL (formule quadratique), au niveau 9,5 : ${(lolMid * 100).toFixed(1)} % ; gain du niveau 1→2 = ${(0.72 * 100).toFixed(0)} % de g, du niveau 17→18 = 128 % de g.`);
say("- MLBB : linéaire par hypothèse du wiki (seuls niv. 1 et 15 publiés) → 50 % au niveau 8.");
const uniteMid = clean(
  pokemon.map((p) => {
    const h1 = at(p, 1)?.hp;
    const h8 = at(p, 8)?.hp;
    const h15 = at(p, 15)?.hp;
    return h1 != null && h8 != null && h15 != null ? (h8 - h1) / (h15 - h1) : null;
  }),
);
say(`- Unite (PV, données niveau par niveau), au niveau 8 : ${triple(uniteMid.map((x) => x * 100))} % (min / méd / max).`);
say();

// Unite: consecutive increments grow geometrically; the ratio depends on the number of evolution stages.
say("Unite — rapport entre deux gains consécutifs (gain(n+1) / gain(n)), hors niveaux d'évolution, par nombre de stades (**1er quartile / médiane / 3e quartile**) :");
say();
say("| Stades d'évolution | n | PV | Attaque | Défense | Déf. spé. |");
say("| --- | --- | --- | --- | --- | --- |");
const byStages = groupBy(pokemon, (p) => String(Math.max(1, p.evolution.length)));
for (const [stages, list] of byStages) {
  const ratios = (field: "hp" | "attack" | "defense" | "spDefense"): number[] => {
    const all: number[] = [];
    for (const p of list) {
      const evoLevels = new Set(p.evolution.map((e) => e.fromLevel).filter((l) => l > 1));
      for (let n = 2; n <= 14; n++) {
        // gain(n) = stat(n) − stat(n−1); skip any gain touching an evolution level.
        if (evoLevels.has(n) || evoLevels.has(n + 1)) continue;
        const a = at(p, n - 1)?.[field];
        const b = at(p, n)?.[field];
        const c = at(p, n + 1)?.[field];
        if (a == null || b == null || c == null) continue;
        const g1 = b - a;
        const g2 = c - b;
        if (g1 > 0 && g2 > 0) all.push(g2 / g1);
      }
    }
    return all;
  };
  say(`| ${stages} | ${list.length} | ${quartiles(ratios("hp"))} | ${quartiles(ratios("attack"))} | ${quartiles(ratios("defense"))} | ${quartiles(ratios("spDefense"))} |`);
}
say();

console.log(out.join("\n"));
