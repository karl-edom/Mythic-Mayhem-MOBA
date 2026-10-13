// Summary statistics for research families E (abilities) and F (progression, economy).
// Reads the local reference extracts in data/reference/{lol,mlbb,unite} and prints Markdown tables.
// Usage: node tools/analysis/kit-summary.ts [section ...]
// Sections: kit, ranks, cooldowns, roles, costs, ratios, cc, shapes, ultimate, spells, items, power, held, emblems (default: all).
// Zero dependencies; Node >= 22.18 (type stripping).

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..', '..', 'data', 'reference');

function load<T>(game: string, file: string): T {
  return JSON.parse(readFileSync(join(ROOT, game, file), 'utf8')) as T;
}

// ---------- generic helpers ----------

interface Summary {
  n: number;
  min: number;
  p25: number;
  med: number;
  p75: number;
  max: number;
}

function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return Number.NaN;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  const a = sorted[lo] ?? Number.NaN;
  const b = sorted[hi] ?? Number.NaN;
  return a + (b - a) * (pos - lo);
}

function summarize(values: number[]): Summary {
  const s = values.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  return {
    n: s.length,
    min: s[0] ?? Number.NaN,
    p25: quantile(s, 0.25),
    med: quantile(s, 0.5),
    p75: quantile(s, 0.75),
    max: s[s.length - 1] ?? Number.NaN,
  };
}

function fmt(v: number): string {
  if (!Number.isFinite(v)) return '—';
  if (Number.isInteger(v)) return String(v);
  return String(Math.round(v * 100) / 100);
}

function pct(part: number, total: number): string {
  return total === 0 ? '—' : `${Math.round((part / total) * 100)} %`;
}

function table(headers: string[], rows: (string | number)[][]): string {
  const line = (cells: (string | number)[]) => `| ${cells.map((c) => String(c)).join(' | ')} |`;
  return [line(headers), line(headers.map(() => '---')), ...rows.map(line)].join('\n');
}

function summaryRow(label: string, values: number[]): (string | number)[] {
  const s = summarize(values);
  return [label, s.n, fmt(s.min), fmt(s.p25), fmt(s.med), fmt(s.p75), fmt(s.max)];
}

const SUMMARY_HEADERS = ['', 'n', 'min', 'p25', 'médiane', 'p75', 'max'];

function countBy<T>(items: T[], key: (item: T) => string): Map<string, number> {
  const m = new Map<string, number>();
  for (const it of items) {
    const k = key(it);
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return m;
}

function countTable(title: string, m: Map<string, number>, total?: number): string {
  const all = total ?? [...m.values()].reduce((a, b) => a + b, 0);
  const rows = [...m.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, v, pct(v, all)]);
  return table([title, 'n', 'part'], rows);
}

function first(arr: number[] | null | undefined): number {
  return arr && arr.length > 0 ? (arr[0] ?? Number.NaN) : Number.NaN;
}

function last(arr: number[] | null | undefined): number {
  return arr && arr.length > 0 ? (arr[arr.length - 1] ?? Number.NaN) : Number.NaN;
}

function out(s = ''): void {
  process.stdout.write(`${s}\n`);
}

// ---------- data shapes (only the fields used here) ----------

interface LolAbility {
  champion: string;
  slot: 'P' | 'Q' | 'W' | 'E' | 'R';
  maxRank: number;
  cooldown: number[] | null;
  cost: number[] | null;
  costType: string | null;
  castTime: number | null;
  missileSpeed: number | null;
  lineWidth: number | null;
  castRadius: number[] | null;
  ratios: { stat: string; scaling: string; values: number[] }[];
  crowdControl: { type: string }[];
}
interface LolChampion {
  name: string;
  id: string;
  tags: string[];
  stats: { hp: { base: number; perLevel: number }; attackDamage: { base: number; perLevel: number } };
}
interface LolItem {
  name: string;
  gold: { total: number; purchasable: boolean };
  into: string[] | number[];
  from: string[] | number[];
  depth?: number;
  maps: string[];
  inStore?: boolean;
  requiredChampion: string | null;
  consumed: boolean;
  tags: string[];
  statsParsed?: { stat: string; value: number; percent: boolean }[];
}
interface LolSpell {
  name: string;
  cooldown: number;
  summonerLevel: number;
  modes: string[];
}

interface NumField {
  values: number[] | null;
}
interface MlbbSkill {
  hero: string;
  slot: 'passive' | 'skill1' | 'skill2' | 'ultimate' | 'other';
  cooldown: NumField;
  manaCost: NumField;
  energyCost: NumField;
  castRange: NumField;
  scalings: { baseMin: number | null; baseMax: number | null; ratios: { stat: string; value: number | null }[] }[];
  levelScaling: { label: string; values: number[] | null }[];
  ccTypes: string[];
}
interface MlbbHero {
  name: string;
  roles: string[];
  damageType?: string;
  stats: { hp?: { level15: number | null } | null; physicalAttack?: { level15: number | null } | null };
}
interface MlbbItem {
  name: string;
  category: string;
  priceTotal: number | null;
  tier: number;
  removed: boolean;
  buildsInto: string[];
  stats: { stat: string; value: number; unit: string }[];
}
interface MlbbSpell {
  name: string;
  status: string;
  cooldownSeconds: number;
  unlockPlayerLevel: number;
}
interface MlbbEmblem {
  name: string;
  attributes: { stat: string; value: number; unit: string }[];
  talents: { tier: number }[];
}

interface UniteDamage {
  ratioPct: number | null;
  scalingStat: string | null;
  perLevel: number | null;
  base: number | null;
  formulaApplies: boolean;
}
interface UniteDetail {
  detailedDescription: string | null;
  damage: UniteDamage[];
  upgradedCooldownS: number | null;
}
interface UniteMove {
  name: string;
  category: string | null;
  cooldownS: number | null;
  learnLevel: number | null;
  upgradeLevel: number | null;
  description: string | null;
  details: UniteDetail[];
}
interface UniteSlot {
  slot: number;
  base: UniteMove | null;
  options: UniteMove[];
}
interface UniteUnite {
  name: string;
  learnLevel: number | null;
  cooldownS: number | null;
  gaugeEnergy: number | null;
  description: string | null;
  details: UniteDetail[];
}
interface UnitePokemonMoves {
  pokemonId: string;
  dataSource: string;
  baseMoveLevels?: number[];
  slots?: UniteSlot[];
  uniteMoves?: UniteUnite[];
}
interface UnitePokemon {
  id: string;
  role: string;
  damageType?: string;
  stats: { level: number; hp: number; attack: number }[];
  dataSource: string;
  evolution: { name: string; fromLevel: number }[];
  baseMoveLevels: number[] | null;
  moveOptionLevels: { slot: number; learnLevels: number[]; upgradeLevels: number[] }[] | null;
  uniteMove: { learnLevel: number | null; gaugeEnergy: number | null } | null;
}
interface UniteHeld {
  name: string;
  statBonuses: { stat: string; unit: string; valuesByLevel: Record<string, number> }[];
  passive: { scaledValueLabel: string | null; valueAtLevel1: string | null; valueAtLevel10: string | null; valueAtLevel20: string | null } | null;
}
interface UniteBattleItem {
  name: string;
  mode: string;
  cooldownS: number | null;
  unlockTrainerLevel: number | null;
}
interface UniteEmblem {
  grade: string;
  colors: string[];
}

// ---------- load ----------

const lolAbilities = load<{ abilities: LolAbility[] }>('lol', 'abilities.json').abilities;
const lolChampions = load<{ champions: LolChampion[] }>('lol', 'champions.json').champions;
const lolItems = load<{ items: LolItem[] }>('lol', 'items.json').items;
const lolSpells = load<{ summonerSpells: LolSpell[] }>('lol', 'summoner-spells.json').summonerSpells;
const mlbbSkills = load<{ skills: MlbbSkill[] }>('mlbb', 'skills.json').skills;
const mlbbHeroes = load<{ heroes: MlbbHero[] }>('mlbb', 'heroes.json').heroes;
const mlbbItems = load<{ items: MlbbItem[] }>('mlbb', 'items.json').items;
const mlbbSpells = load<{ spells: MlbbSpell[] }>('mlbb', 'battle-spells.json').spells;
const mlbbEmblems = load<{ emblems: MlbbEmblem[] }>('mlbb', 'emblems.json').emblems;
const uniteMoves = load<{ moves: UnitePokemonMoves[] }>('unite', 'moves.json').moves.filter((p) => p.dataSource === 'unite-db');
const unitePokemon = load<{ pokemon: UnitePokemon[] }>('unite', 'pokemon.json').pokemon.filter((p) => p.dataSource === 'unite-db');
const uniteHeld = load<{ heldItems: UniteHeld[] }>('unite', 'held-items.json').heldItems;
const uniteBattle = load<{ battleItems: UniteBattleItem[] }>('unite', 'battle-items.json').battleItems;
const uniteEmblems = load<{ emblems: UniteEmblem[] }>('unite', 'emblems.json').emblems;

const LOL_SLOTS = ['Q', 'W', 'E', 'R'] as const;
const MLBB_SLOTS = ['skill1', 'skill2', 'ultimate'] as const;

const lolRole = new Map(lolChampions.flatMap((c) => [[c.name, c.tags[0] ?? '?'] as const, [c.id, c.tags[0] ?? '?'] as const]));
const mlbbRole = new Map(mlbbHeroes.map((h) => [h.name, h.roles[0] ?? '?'] as const));
const uniteRole = new Map(unitePokemon.map((p) => [p.id, p.role] as const));

/** All Unite standard moves (slot base moves + options), with the slot number. */
function uniteSlotMoves(): { pokemon: string; slot: number; kind: 'base' | 'option'; move: UniteMove }[] {
  const res: { pokemon: string; slot: number; kind: 'base' | 'option'; move: UniteMove }[] = [];
  for (const p of uniteMoves) {
    for (const s of p.slots ?? []) {
      if (s.base) res.push({ pokemon: p.pokemonId, slot: s.slot, kind: 'base', move: s.base });
      for (const o of s.options) res.push({ pokemon: p.pokemonId, slot: s.slot, kind: 'option', move: o });
    }
  }
  return res;
}

/** MLBB number of skill ranks: the longest per-rank list (cooldown, mana, level-scaling) between 2 and 6. */
function mlbbRanks(s: MlbbSkill): number {
  const lens = [s.cooldown.values, s.manaCost.values, s.energyCost.values, ...s.levelScaling.map((l) => l.values)]
    .map((v) => (v ? v.length : 0))
    .filter((n) => n >= 2 && n <= 6);
  return lens.length === 0 ? Number.NaN : Math.max(...lens);
}

// Unite has no structured CC field: keyword heuristic over descriptions (same spirit as the LoL/MLBB extracts).
const UNITE_HARD_CC = /\b(stun|stunned|thrown|throws?|bound|binds?|sleep|asleep|frozen|freezes?|shoves?|shoved|knock(?:s|ed)? (?:back|up|away)|pulls?|pulled|taunt|unable to act|suppress|drowsy|trapped)\b/i;
const UNITE_SLOW = /\b(decreas\w* (?:the )?movement speed|slow(?:s|ed|ing)?)\b/i;

function uniteText(m: { description: string | null; details: UniteDetail[] }): string {
  return [m.description ?? '', ...m.details.map((d) => d.detailedDescription ?? '')].join(' ');
}

// ---------- sections ----------

function sectionKit(): void {
  out('## E1 — Structure du kit (nombre de capacités par personnage)');
  out();
  const lolCount = countBy(lolAbilities, (a) => a.slot);
  const champs = new Set(lolAbilities.map((a) => a.champion)).size;
  const mlbbCount = countBy(mlbbSkills, (s) => s.slot);
  const heroes = new Set(mlbbSkills.map((s) => s.hero)).size;
  const uMoves = uniteSlotMoves();
  const uOptionsPerSlot = new Map<string, number>();
  for (const p of uniteMoves) for (const s of p.slots ?? []) uOptionsPerSlot.set(`${s.options.length}`, (uOptionsPerSlot.get(`${s.options.length}`) ?? 0) + 1);
  const uPassives = uniteMoves.length;
  const uUnite = uniteMoves.reduce((a, p) => a + (p.uniteMoves?.length ?? 0), 0);
  out(table(['Jeu', 'Personnages', 'Détail des emplacements'], [
    ['LoL', champs, `P ${lolCount.get('P') ?? 0} · Q ${lolCount.get('Q') ?? 0} · W ${lolCount.get('W') ?? 0} · E ${lolCount.get('E') ?? 0} · R ${lolCount.get('R') ?? 0}`],
    ['MLBB', heroes, `passif ${mlbbCount.get('passive') ?? 0} · skill1 ${mlbbCount.get('skill1') ?? 0} · skill2 ${mlbbCount.get('skill2') ?? 0} · ultime ${mlbbCount.get('ultimate') ?? 0} · autre ${mlbbCount.get('other') ?? 0}`],
    ['Unite', uPassives, `capacités d'emplacement ${uMoves.length} (base ${uMoves.filter((m) => m.kind === 'base').length}, options ${uMoves.filter((m) => m.kind === 'option').length}) · Unite Moves ${uUnite}`],
  ]));
  out();
  out('Unite — nombre d\'options par emplacement (1 = chemin fixe) :');
  out();
  out(countTable('options', uOptionsPerSlot));
  out();
}

function sectionRanks(): void {
  out('## E2 — Rangs et niveaux d\'apprentissage');
  out();
  out('LoL — rang max par emplacement (Data Dragon `maxRank`) :');
  out();
  const lolRows = LOL_SLOTS.map((slot) => {
    const m = countBy(lolAbilities.filter((a) => a.slot === slot), (a) => String(a.maxRank));
    return [slot, [...m.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} (${v})`).join(', ')];
  });
  out(table(['Emplacement', 'rang max (nombre)'], lolRows));
  out();
  out('MLBB — nombre de rangs inféré (longueur des listes par rang : CD, mana, level-scaling) :');
  out();
  const mlbbRows = MLBB_SLOTS.map((slot) => {
    const m = countBy(mlbbSkills.filter((s) => s.slot === slot), (s) => (Number.isNaN(mlbbRanks(s)) ? 'inconnu' : String(mlbbRanks(s))));
    return [slot, [...m.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} (${v})`).join(', ')];
  });
  out(table(['Emplacement', 'rangs (nombre)'], mlbbRows));
  out();
  out('Unite — niveaux d\'apprentissage des capacités de base (`baseMoveLevels`) :');
  out();
  out(countTable('niveaux', countBy(unitePokemon, (p) => JSON.stringify(p.baseMoveLevels))));
  out();
  out('Unite — niveaux de choix / amélioration « + » par emplacement (`moveOptionLevels`) :');
  out();
  const optRows: string[][] = [];
  for (const slot of [1, 2]) {
    const m = countBy(unitePokemon, (p) => {
      const o = p.moveOptionLevels?.find((x) => x.slot === slot);
      return o ? `choix ${o.learnLevels.join('/')} → + ${o.upgradeLevels.join('/')}` : 'absent';
    });
    for (const [k, v] of [...m.entries()].sort((a, b) => b[1] - a[1])) optRows.push([`emplacement ${slot}`, k, String(v)]);
  }
  out(table(['Emplacement', 'niveaux', 'Pokémon'], optRows));
  out();
  out('Unite — niveau d\'apprentissage du Unite Move :');
  out();
  out(countTable('niveau', countBy(unitePokemon, (p) => String(p.uniteMove?.learnLevel ?? 'inconnu'))));
  out();
  out('Unite — niveaux d\'évolution (stades après le premier) :');
  out();
  const evo = unitePokemon.flatMap((p) => p.evolution.slice(1).map((e) => e.fromLevel));
  out(countTable('niveau', countBy(evo, (l) => String(l))));
  out(`\nPokémon sans évolution : ${unitePokemon.filter((p) => p.evolution.length <= 1).length} / ${unitePokemon.length}`);
  out();
}

function sectionCooldowns(): void {
  out('## E3 — Temps de recharge par emplacement (secondes)');
  out();
  const rows: (string | number)[][] = [];
  for (const slot of LOL_SLOTS) {
    const a = lolAbilities.filter((x) => x.slot === slot);
    rows.push(summaryRow(`LoL ${slot} rang 1`, a.map((x) => first(x.cooldown))));
    rows.push(summaryRow(`LoL ${slot} rang max`, a.map((x) => last(x.cooldown))));
  }
  for (const slot of MLBB_SLOTS) {
    const s = mlbbSkills.filter((x) => x.slot === slot);
    rows.push(summaryRow(`MLBB ${slot} rang 1`, s.map((x) => first(x.cooldown.values))));
    rows.push(summaryRow(`MLBB ${slot} rang max`, s.map((x) => last(x.cooldown.values))));
  }
  const um = uniteSlotMoves();
  for (const slot of [1, 2]) {
    rows.push(summaryRow(`Unite empl. ${slot} base`, um.filter((m) => m.slot === slot && m.kind === 'base').map((m) => m.move.cooldownS ?? Number.NaN)));
    rows.push(summaryRow(`Unite empl. ${slot} options`, um.filter((m) => m.slot === slot && m.kind === 'option').map((m) => m.move.cooldownS ?? Number.NaN)));
  }
  rows.push(summaryRow('Unite options après « + » (si CD modifié)', um.flatMap((m) => m.move.details.map((d) => d.upgradedCooldownS ?? Number.NaN))));
  out(table(SUMMARY_HEADERS, rows));
  out();
  out('Note : un CD MLBB à valeur unique (constant) compte comme rang 1 = rang max. Unite : pas de rangs, un seul CD par capacité.');
  out();
}

function sectionRoles(): void {
  out('## E3 — Médiane des temps de recharge par rôle (s)');
  out();
  const lolRoles = [...new Set(lolChampions.map((c) => c.tags[0] ?? '?'))].sort();
  const lolRows = lolRoles.map((role) => {
    const a = lolAbilities.filter((x) => lolRole.get(x.champion) === role);
    const basic = a.filter((x) => x.slot !== 'R' && x.slot !== 'P');
    const ult = a.filter((x) => x.slot === 'R');
    return [role, new Set(a.map((x) => x.champion)).size,
      fmt(summarize(basic.map((x) => first(x.cooldown))).med), fmt(summarize(basic.map((x) => last(x.cooldown))).med),
      fmt(summarize(ult.map((x) => first(x.cooldown))).med), fmt(summarize(ult.map((x) => last(x.cooldown))).med)];
  });
  out('LoL (rôle = 1er tag Data Dragon) :');
  out();
  out(table(['Rôle', 'champions', 'Q/W/E rang 1', 'Q/W/E rang max', 'R rang 1', 'R rang max'], lolRows));
  out();
  const mlbbRoles = [...new Set(mlbbHeroes.map((h) => h.roles[0] ?? '?'))].sort();
  const mlbbRows = mlbbRoles.map((role) => {
    const s = mlbbSkills.filter((x) => mlbbRole.get(x.hero) === role);
    const basic = s.filter((x) => x.slot === 'skill1' || x.slot === 'skill2');
    const ult = s.filter((x) => x.slot === 'ultimate');
    return [role, new Set(s.map((x) => x.hero)).size,
      fmt(summarize(basic.map((x) => first(x.cooldown.values))).med), fmt(summarize(basic.map((x) => last(x.cooldown.values))).med),
      fmt(summarize(ult.map((x) => first(x.cooldown.values))).med), fmt(summarize(ult.map((x) => last(x.cooldown.values))).med)];
  });
  out('MLBB (rôle = 1er rôle du wiki) :');
  out();
  out(table(['Rôle', 'héros', 'S1/S2 rang 1', 'S1/S2 rang max', 'Ultime rang 1', 'Ultime rang max'], mlbbRows));
  out();
  const uRoles = [...new Set(unitePokemon.map((p) => p.role))].sort();
  const um = uniteSlotMoves();
  const uRows = uRoles.map((role) => {
    const m = um.filter((x) => uniteRole.get(x.pokemon) === role);
    const ult = uniteMoves.filter((p) => uniteRole.get(p.pokemonId) === role).flatMap((p) => p.uniteMoves ?? []);
    const gauge = unitePokemon.filter((p) => p.role === role).map((p) => p.uniteMove?.gaugeEnergy ?? Number.NaN);
    return [role, new Set(m.map((x) => x.pokemon)).size,
      fmt(summarize(m.filter((x) => x.kind === 'base').map((x) => x.move.cooldownS ?? Number.NaN)).med),
      fmt(summarize(m.filter((x) => x.kind === 'option').map((x) => x.move.cooldownS ?? Number.NaN)).med),
      fmt(summarize(ult.map((u) => u.cooldownS ?? Number.NaN)).med),
      fmt(summarize(gauge).med)];
  });
  out('Unite (rôle unite-db) :');
  out();
  out(table(['Rôle', 'Pokémon', 'CD base', 'CD options', 'Unite `cd` (sens non défini)', 'jauge (gaugeEnergy)'], uRows));
  out();
}

function sectionCosts(): void {
  out('## E3 — Coûts en ressource');
  out();
  out('LoL — type de coût (Q/W/E/R) :');
  out();
  const qwer = lolAbilities.filter((a) => a.slot !== 'P');
  out(countTable('costType', countBy(qwer, (a) => {
    const t = a.costType ?? 'null';
    return /mana/i.test(t) ? 'Mana (toutes variantes)' : /no cost|^null$|passive/i.test(t) ? 'Aucun / non renseigné' : /energy/i.test(t) ? 'Énergie' : /health/i.test(t) ? 'PV' : 'Autre ressource';
  })));
  out();
  const rows: (string | number)[][] = [];
  for (const slot of LOL_SLOTS) {
    const a = lolAbilities.filter((x) => x.slot === slot && x.costType === 'Mana' && (x.cost?.some((c) => c > 0) ?? false));
    rows.push(summaryRow(`LoL ${slot} mana rang 1`, a.map((x) => first(x.cost))));
    rows.push(summaryRow(`LoL ${slot} mana rang max`, a.map((x) => last(x.cost))));
  }
  for (const slot of MLBB_SLOTS) {
    const s = mlbbSkills.filter((x) => x.slot === slot && (x.manaCost.values?.some((c) => c > 0) ?? false));
    rows.push(summaryRow(`MLBB ${slot} mana rang 1`, s.map((x) => first(x.manaCost.values))));
    rows.push(summaryRow(`MLBB ${slot} mana rang max`, s.map((x) => last(x.manaCost.values))));
  }
  out(table(SUMMARY_HEADERS, rows));
  out();
  out('Unite : aucune ressource (pas de mana), seulement des temps de recharge.');
  out();
}

function sectionRatios(): void {
  out('## E3 — Ratios de mise à l\'échelle');
  out();
  out('LoL — ratio maximal (dernier rang) par capacité, pour les deux stats principales :');
  out();
  const rows: (string | number)[][] = [];
  for (const slot of LOL_SLOTS) {
    for (const [stat, scaling] of [['AP', 'total'], ['AD', 'bonus'], ['AD', 'total']] as const) {
      const vals = lolAbilities
        .filter((a) => a.slot === slot)
        .map((a) => {
          const r = a.ratios.filter((x) => x.stat === stat && x.scaling === scaling).map((x) => last(x.values));
          return r.length ? Math.max(...r) : Number.NaN;
        });
      rows.push(summaryRow(`${slot} · ${scaling} ${stat}`, vals));
    }
  }
  out(table(SUMMARY_HEADERS, rows));
  out();
  out('MLBB — ratio maximal par capacité (% de la stat, `scalings`) :');
  out();
  const mRows: (string | number)[][] = [];
  for (const slot of MLBB_SLOTS) {
    for (const stat of ['Total Magic Power (%)', 'Total Physical Attack (%)', 'Extra Physical Attack (%)']) {
      const vals = mlbbSkills
        .filter((s) => s.slot === slot)
        .map((s) => {
          const r = s.scalings.flatMap((sc) => sc.ratios.filter((x) => x.stat === stat).map((x) => x.value ?? Number.NaN));
          return r.length ? Math.max(...r) : Number.NaN;
        });
      mRows.push(summaryRow(`${slot} · ${stat}`, vals));
    }
  }
  out(table(SUMMARY_HEADERS, mRows));
  out();
  out('MLBB — dégâts de base (1er `scale` de la capacité) au rang 1 et au rang max :');
  out();
  const bRows: (string | number)[][] = [];
  for (const slot of MLBB_SLOTS) {
    const s = mlbbSkills.filter((x) => x.slot === slot && x.scalings.length > 0);
    bRows.push(summaryRow(`${slot} base rang 1`, s.map((x) => x.scalings[0]?.baseMin ?? Number.NaN)));
    bRows.push(summaryRow(`${slot} base rang max`, s.map((x) => x.scalings[0]?.baseMax ?? Number.NaN)));
  }
  out(table(SUMMARY_HEADERS, bRows));
  out();
  out('Unite — composantes de dégâts (`ratioPct` du 1er composant avec formule) :');
  out();
  const uRows: (string | number)[][] = [];
  const um = uniteSlotMoves();
  const firstDmg = (m: { details: UniteDetail[] }): UniteDamage | undefined =>
    m.details.flatMap((d) => d.damage).find((d) => d.formulaApplies && d.ratioPct !== null);
  for (const stat of ['Atk', 'SpAtk']) {
    const base = um.filter((m) => m.kind === 'base').map((m) => firstDmg(m.move)).filter((d) => d?.scalingStat === stat);
    const opt = um.filter((m) => m.kind === 'option').map((m) => firstDmg(m.move)).filter((d) => d?.scalingStat === stat);
    const ult = uniteMoves.flatMap((p) => p.uniteMoves ?? []).map((u) => firstDmg(u)).filter((d) => d?.scalingStat === stat);
    uRows.push(summaryRow(`base · ratio % ${stat}`, base.map((d) => d?.ratioPct ?? Number.NaN)));
    uRows.push(summaryRow(`options · ratio % ${stat}`, opt.map((d) => d?.ratioPct ?? Number.NaN)));
    uRows.push(summaryRow(`Unite Move · ratio % ${stat}`, ult.map((d) => d?.ratioPct ?? Number.NaN)));
    uRows.push(summaryRow(`options · fixe niv. 15 (base + 14 × perLevel) ${stat}`, opt.map((d) => (d?.base ?? 0) + 14 * (d?.perLevel ?? 0))));
    uRows.push(summaryRow(`Unite Move · fixe niv. 15 ${stat}`, ult.map((d) => (d?.base ?? 0) + 14 * (d?.perLevel ?? 0))));
  }
  out(table(SUMMARY_HEADERS, uRows));
  out();
}

function sectionCc(): void {
  out('## E3 — Part des capacités avec contrôle (heuristiques par mots-clés)');
  out();
  const rows: (string | number)[][] = [];
  for (const slot of LOL_SLOTS) {
    const a = lolAbilities.filter((x) => x.slot === slot);
    const any = a.filter((x) => x.crowdControl.length > 0).length;
    const hard = a.filter((x) => x.crowdControl.some((c) => c.type !== 'slow')).length;
    rows.push([`LoL ${slot}`, a.length, pct(any, a.length), pct(hard, a.length)]);
  }
  for (const slot of MLBB_SLOTS) {
    const s = mlbbSkills.filter((x) => x.slot === slot);
    const any = s.filter((x) => x.ccTypes.length > 0).length;
    const hard = s.filter((x) => x.ccTypes.some((c) => c !== 'slow' && c !== 'transform')).length;
    rows.push([`MLBB ${slot}`, s.length, pct(any, s.length), pct(hard, s.length)]);
  }
  const um = uniteSlotMoves();
  const groups: [string, { description: string | null; details: UniteDetail[] }[]][] = [
    ['Unite empl. base', um.filter((m) => m.kind === 'base').map((m) => m.move)],
    ['Unite options', um.filter((m) => m.kind === 'option').map((m) => m.move)],
    ['Unite Move', uniteMoves.flatMap((p) => p.uniteMoves ?? [])],
  ];
  for (const [label, moves] of groups) {
    const hard = moves.filter((m) => UNITE_HARD_CC.test(uniteText(m))).length;
    const any = moves.filter((m) => UNITE_HARD_CC.test(uniteText(m)) || UNITE_SLOW.test(uniteText(m))).length;
    rows.push([label, moves.length, pct(any, moves.length), pct(hard, moves.length)]);
  }
  out(table(['Groupe', 'n', 'avec CC (ralentissement inclus)', 'avec CC dur (hors ralentissement)'], rows));
  out();
  out('Types de CC les plus fréquents :');
  out();
  const lolTypes = countBy(lolAbilities.flatMap((a) => a.crowdControl.map((c) => c.type)), (t) => t);
  const mlbbTypes = countBy(mlbbSkills.flatMap((s) => s.ccTypes), (t) => t);
  const top = (m: Map<string, number>) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${k} ${v}`).join(', ');
  out(table(['Jeu', 'top 8 (occurrences)'], [['LoL', top(lolTypes)], ['MLBB', top(mlbbTypes)]]));
  out();
}

function sectionShapes(): void {
  out('## E4 — Incantation, projectiles, zones (LoL ; unités de distance LoL)');
  out();
  const rows: (string | number)[][] = [];
  for (const slot of LOL_SLOTS) {
    const a = lolAbilities.filter((x) => x.slot === slot);
    rows.push(summaryRow(`${slot} castTime (s)`, a.map((x) => x.castTime ?? Number.NaN).filter((v) => v >= 0)));
    rows.push(summaryRow(`${slot} missileSpeed (u/s)`, a.map((x) => x.missileSpeed ?? Number.NaN).filter((v) => v <= 10000)));
    rows.push(summaryRow(`${slot} lineWidth (u)`, a.map((x) => x.lineWidth ?? Number.NaN)));
    rows.push(summaryRow(`${slot} castRadius (u)`, a.map((x) => last(x.castRadius)).filter((v) => v > 0 && v <= 5000)));
  }
  out(table(SUMMARY_HEADERS, rows));
  out();
  out('Filtres : castTime < 0, missileSpeed > 10 000 u/s (valeurs « instantanées » des bins) et castRadius > 5 000 u (global) exclus.');
  out();
  out('Unite — catégories de capacités (étiquette unite-db, emplacements 1–2) :');
  out();
  out(countTable('catégorie', countBy(uniteSlotMoves(), (m) => m.move.category ?? 'null')));
  out();
  const mlbbRange = mlbbSkills.filter((s) => s.castRange.values !== null).length;
  out(`MLBB — capacités avec \`castRange\` structuré : ${mlbbRange} / ${mlbbSkills.length}.`);
  out();
}

function sectionUltimate(): void {
  out('## E5 — Disponibilité de l\'ultime');
  out();
  const rows: (string | number)[][] = [];
  rows.push(summaryRow('LoL R CD rang 1 (s)', lolAbilities.filter((a) => a.slot === 'R').map((a) => first(a.cooldown))));
  rows.push(summaryRow('LoL R CD rang 3 (s)', lolAbilities.filter((a) => a.slot === 'R').map((a) => last(a.cooldown))));
  rows.push(summaryRow('MLBB ultime CD rang 1 (s)', mlbbSkills.filter((s) => s.slot === 'ultimate').map((s) => first(s.cooldown.values))));
  rows.push(summaryRow('MLBB ultime CD rang max (s)', mlbbSkills.filter((s) => s.slot === 'ultimate').map((s) => last(s.cooldown.values))));
  rows.push(summaryRow('Unite gaugeEnergy (unités internes)', unitePokemon.map((p) => p.uniteMove?.gaugeEnergy ?? Number.NaN)));
  rows.push(summaryRow('Unite `cd` du Unite Move (s, sens non défini)', uniteMoves.flatMap((p) => p.uniteMoves ?? []).map((u) => u.cooldownS ?? Number.NaN)));
  out(table(SUMMARY_HEADERS, rows));
  out();
  out(countTable('gaugeEnergy', countBy(unitePokemon, (p) => String(p.uniteMove?.gaugeEnergy ?? 'inconnu'))));
  out();
}

function sectionSpells(): void {
  out('## E6 — Sorts d\'invocateur / de combat / objets de combat');
  out();
  const lol = lolSpells.filter((s) => s.modes.includes('CLASSIC'));
  out(table(['LoL (Classic)', 'CD (s)', 'niveau de compte'], lol.map((s) => [s.name, s.cooldown, s.summonerLevel])));
  out();
  const ml = mlbbSpells.filter((s) => s.status === 'current');
  out(table(['MLBB (actuels)', 'CD (s)', 'niveau de compte'], ml.map((s) => [s.name, s.cooldownSeconds, s.unlockPlayerLevel])));
  out();
  const un = uniteBattle.filter((b) => b.mode === 'standard');
  out(table(['Unite (standard)', 'CD (s)', 'niveau de dresseur'], un.map((b) => [b.name, b.cooldownS ?? '—', b.unlockTrainerLevel ?? '—'])));
  out();
  out(table(SUMMARY_HEADERS, [
    summaryRow('LoL CD', lol.filter((s) => s.name !== 'Smite').map((s) => s.cooldown)),
    summaryRow('MLBB CD (hors Recall/Healing à 0)', ml.map((s) => s.cooldownSeconds).filter((c) => c > 0)),
    summaryRow('Unite CD', un.map((b) => b.cooldownS ?? Number.NaN)),
  ]));
  out();
}

function sectionItems(): void {
  out('## F3 — Objets de boutique (LoL, MLBB)');
  out();
  const sr = lolItems.filter((i) => i.maps.includes("Summoner's Rift") && i.gold.purchasable && i.inStore !== false && !i.requiredChampion && !i.consumed);
  const finals = sr.filter((i) => i.into.length === 0 && i.from.length > 0);
  const comps = sr.filter((i) => i.into.length > 0);
  const basics = sr.filter((i) => i.from.length === 0);
  out(table(['LoL (Faille, achetables, hors consommables)', 'n', 'prix médian', 'min', 'max'], [
    ['tous', sr.length, fmt(summarize(sr.map((i) => i.gold.total)).med), fmt(summarize(sr.map((i) => i.gold.total)).min), fmt(summarize(sr.map((i) => i.gold.total)).max)],
    ['de base (sans recette)', basics.length, fmt(summarize(basics.map((i) => i.gold.total)).med), fmt(summarize(basics.map((i) => i.gold.total)).min), fmt(summarize(basics.map((i) => i.gold.total)).max)],
    ['composants (ont un « into »)', comps.length, fmt(summarize(comps.map((i) => i.gold.total)).med), fmt(summarize(comps.map((i) => i.gold.total)).min), fmt(summarize(comps.map((i) => i.gold.total)).max)],
    ['finaux (recette, sans « into »)', finals.length, fmt(summarize(finals.map((i) => i.gold.total)).med), fmt(summarize(finals.map((i) => i.gold.total)).min), fmt(summarize(finals.map((i) => i.gold.total)).max)],
  ]));
  out();
  const ml = mlbbItems.filter((i) => !i.removed && i.priceTotal !== null);
  const tiers = [...new Set(ml.map((i) => i.tier))].sort();
  out(table(['MLBB (actuels)', 'n', 'prix médian', 'min', 'max'], tiers.map((t) => {
    const s = summarize(ml.filter((i) => i.tier === t).map((i) => i.priceTotal ?? Number.NaN));
    return [`tier ${t}`, s.n, fmt(s.med), fmt(s.min), fmt(s.max)];
  })));
  out();
  out(countTable('MLBB catégorie (actuels)', countBy(ml, (i) => i.category)));
  out();
}


function sectionPower(): void {
  out('## F3 — Poids d\'un objet par rapport à la stat du personnage au niveau max');
  out();
  const lolFinals = lolItems.filter((i) => i.maps.includes("Summoner's Rift") && i.gold.purchasable && !i.requiredChampion && !i.consumed && i.into.length === 0 && i.from.length > 0);
  const lolStat = (name: string) => lolFinals.map((i) => i.statsParsed?.find((x) => x.stat === name && !x.percent)?.value ?? Number.NaN);
  const lolHp18 = lolChampions.map((c) => c.stats.hp.base + 17 * c.stats.hp.perLevel);
  const lolAd18 = lolChampions.map((c) => c.stats.attackDamage.base + 17 * c.stats.attackDamage.perLevel);
  const mlTop = mlbbItems.filter((i) => !i.removed && i.tier === 3);
  const mlStat = (name: string) => mlTop.map((i) => i.stats.find((x) => x.stat === name && x.unit === 'flat')?.value ?? Number.NaN);
  const mlHp15 = mlbbHeroes.map((h) => h.stats.hp?.level15 ?? Number.NaN);
  const mlAtk15 = mlbbHeroes.map((h) => h.stats.physicalAttack?.level15 ?? Number.NaN);
  const uStat = (name: string) => uniteHeld.map((h) => h.statBonuses.find((x) => x.stat === name)?.valuesByLevel['40'] ?? Number.NaN);
  const uHp15 = unitePokemon.map((p) => p.stats.find((x) => x.level === 15)?.hp ?? Number.NaN);
  const uAtk15 = unitePokemon.filter((p) => p.damageType === 'Physical').map((p) => p.stats.find((x) => x.level === 15)?.attack ?? Number.NaN);
  const row = (label: string, item: number[], base: number[], slots: number) => {
    const i = summarize(item).med;
    const b = summarize(base).med;
    return [label, summarize(item).n, fmt(i), fmt(b), pct(i, b), slots, pct(i * slots, b)];
  };
  out(table(['Jeu · stat', 'objets avec la stat', 'médiane par objet', 'médiane perso niveau max', '1 objet / perso', 'emplacements', 'plein / perso'], [
    row('LoL · PV (objets finaux, perso niv. 18)', lolStat('Health'), lolHp18, 6),
    row('MLBB · PV (tier 3, héros niv. 15)', mlStat('HP'), mlHp15, 6),
    row('MLBB · attaque physique (tier 3, héros niv. 15)', mlStat('Physical Attack'), mlAtk15, 6),
    row('Unite · PV (objet tenu niv. 40, Pokémon niv. 15)', uStat('HP'), uHp15, 3),
    row('Unite · Attack (objet tenu niv. 40, Pokémon physiques niv. 15)', uStat('Attack'), uAtk15, 3),
  ]));
  out();
  const adGrowthZero = lolChampions.filter((c) => c.stats.attackDamage.perLevel === 0).length;
  out(`LoL · AD exclu : croissance d'AD par niveau = 0 pour ${adGrowthZero} / ${lolChampions.length} champions dans l'extrait (anomalie à vérifier) ; médiane AD des objets finaux = ${fmt(summarize(lolStat('Attack Damage')).med)}, AD de base médiane = ${fmt(summarize(lolAd18).med)}.`);
  out();
  out('« plein / perso » = médiane par objet × nombre d\'emplacements, rapportée à la stat médiane au niveau max : ordre de grandeur seulement (un vrai build mélange les stats).');
  out();
}

function sectionHeld(): void {
  out('## F3 — Objets tenus de Unite (valeurs aux niveaux 1, 10, 20, 30, 40)');
  out();
  const rows = uniteHeld
    .filter((h) => h.statBonuses.length > 0)
    .map((h) => {
      const stats = h.statBonuses.map((s) => {
        const u = s.unit === 'percent' ? ' %' : '';
        const v = (l: number) => fmt(s.valuesByLevel[String(l)] ?? Number.NaN);
        return `${s.stat} ${v(1)} / ${v(10)} / ${v(20)} / ${v(30)} / **${v(40)}**${u}`;
      }).join('<br>');
      const p = h.passive;
      const passive = p ? `${p.scaledValueLabel ?? ''} ${p.valueAtLevel1 ?? '?'} → ${p.valueAtLevel10 ?? '?'} → ${p.valueAtLevel20 ?? '?'}` : '—';
      return [h.name, stats, passive];
    });
  out(table(['Objet', 'Stat : niv. 1 / 10 / 20 / 30 / **40**', 'Passif (niv. 1 → 10 → 20)'], rows));
  out();
  const noStats = uniteHeld.filter((h) => h.statBonuses.length === 0).map((h) => h.name);
  out(`Sans bonus de stats (Méga-gemmes, objets spéciaux) : ${noStats.join(', ')}.`);
  out();
  out('Fréquence des stats offertes :');
  out();
  out(countTable('stat', countBy(uniteHeld.flatMap((h) => h.statBonuses), (s) => s.stat)));
  out();
}

function sectionEmblems(): void {
  out('## F5 — Emblèmes');
  out();
  out(table(['MLBB emblème', 'attributs', 'talents proposés'], mlbbEmblems.map((e) => [e.name, e.attributes.map((a) => `${a.stat} +${a.value}${a.unit === '%' ? ' %' : ''}`).join(', '), e.talents.length])));
  out();
  out(countTable('Unite grade', countBy(uniteEmblems, (e) => e.grade)));
  out();
  out(countTable('Unite nombre de couleurs', countBy(uniteEmblems, (e) => String(e.colors.length))));
  out();
}

const SECTIONS: Record<string, () => void> = {
  kit: sectionKit,
  ranks: sectionRanks,
  cooldowns: sectionCooldowns,
  roles: sectionRoles,
  costs: sectionCosts,
  ratios: sectionRatios,
  cc: sectionCc,
  shapes: sectionShapes,
  ultimate: sectionUltimate,
  spells: sectionSpells,
  items: sectionItems,
  power: sectionPower,
  held: sectionHeld,
  emblems: sectionEmblems,
};

const wanted = process.argv.slice(2);
for (const [name, fn] of Object.entries(SECTIONS)) {
  if (wanted.length === 0 || wanted.includes(name)) fn();
}
