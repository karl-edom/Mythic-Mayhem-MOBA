// unite-db.com: the site's Nuxt front-end loads plain JSON files from its own
// origin (/pokemon.json, /stats.json, /held_items.json, /battle_items.json,
// /emblems.json, /emblem_sets.json, /remoat_island.json). We read those.
import { fetchJson, num, slugify } from './lib.ts';

export const UDB_BASE = 'https://unite-db.com';
export const UDB_URLS = {
  pokemon: `${UDB_BASE}/pokemon.json`,
  stats: `${UDB_BASE}/stats.json`,
  heldItems: `${UDB_BASE}/held_items.json`,
  battleItems: `${UDB_BASE}/battle_items.json`,
  emblems: `${UDB_BASE}/emblems.json`,
  emblemSets: `${UDB_BASE}/emblem_sets.json`,
  remoatIsland: `${UDB_BASE}/remoat_island.json`,
} as const;

type Raw = Record<string, unknown>;

function str(o: Raw | undefined, k: string): string | null {
  const v = o?.[k];
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s === '' ? null : s;
}
function n(o: Raw | undefined, k: string): number | null {
  const v = o?.[k];
  if (typeof v === 'number') return v;
  return typeof v === 'string' ? num(v) : null;
}
function arr(o: Raw | undefined, k: string): Raw[] {
  const v = o?.[k];
  return Array.isArray(v) ? (v as Raw[]) : [];
}
function obj(o: Raw | undefined, k: string): Raw | undefined {
  const v = o?.[k];
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Raw) : undefined;
}

// ---------------------------------------------------------------------------
// Raw loaders
// ---------------------------------------------------------------------------

export interface UdbData {
  pokemon: Raw[];
  stats: Raw[];
  heldItems: Raw[];
  battleItems: Raw[];
  emblems: Raw[];
  emblemSets: Raw[];
  remoatIsland: Raw[];
  retrievedAt: Record<keyof typeof UDB_URLS, string>;
}

export async function loadUniteDb(): Promise<UdbData> {
  const out: Partial<Record<keyof typeof UDB_URLS, Raw[]>> = {};
  const retrievedAt = {} as Record<keyof typeof UDB_URLS, string>;
  for (const key of Object.keys(UDB_URLS) as (keyof typeof UDB_URLS)[]) {
    const r = await fetchJson<Raw[]>(UDB_URLS[key]);
    out[key] = r.data;
    retrievedAt[key] = r.retrievedAt;
  }
  return {
    pokemon: out.pokemon ?? [],
    stats: out.stats ?? [],
    heldItems: out.heldItems ?? [],
    battleItems: out.battleItems ?? [],
    emblems: out.emblems ?? [],
    emblemSets: out.emblemSets ?? [],
    remoatIsland: out.remoatIsland ?? [],
    retrievedAt,
  };
}

// ---------------------------------------------------------------------------
// Identity
// ---------------------------------------------------------------------------

/** Cross-source matching key ("Mega-Charizard-X", "mega charizard x" -> "megacharizardx"). */
export function matchKey(name: string): string {
  let k = slugify(name).replace(/-/g, '');
  k = k.replace(/^(alolan|galarian)/, '');
  k = k.replace(/^megamewtwo/, 'mewtwo');
  return k;
}

export function pokemonId(udbName: string): string {
  return slugify(udbName);
}

// ---------------------------------------------------------------------------
// Stats
// ---------------------------------------------------------------------------

export interface LevelStats {
  level: number;
  hp: number | null;
  attack: number | null;
  defense: number | null;
  spAttack: number | null;
  spDefense: number | null;
  critRatePct: number | null;
  cdrPct: number | null;
  lifestealPct: number | null;
  attackSpeedBonusPct: number | null;
  moveSpeed: number | null;
  penetration: number | null;
}

export function normalizeUdbStats(raw: Raw): LevelStats[] {
  return arr(raw, 'level').map((l) => ({
    level: n(l, 'level') ?? 0,
    hp: n(l, 'hp'),
    attack: n(l, 'attack'),
    defense: n(l, 'defense'),
    spAttack: n(l, 'sp_attack'),
    spDefense: n(l, 'sp_defense'),
    critRatePct: n(l, 'crit'),
    cdrPct: n(l, 'cdr'),
    lifestealPct: n(l, 'lifesteal'),
    attackSpeedBonusPct: n(l, 'attack_speed'),
    moveSpeed: n(l, 'move_speed'),
    penetration: n(l, 'penetration'),
  }));
}

// ---------------------------------------------------------------------------
// Moves (skills) — "rsb" blocks hold damage formula components
// ---------------------------------------------------------------------------

export interface DamageComponent {
  label: string | null;
  /** Percentage of the scaling stat (e.g. 66 means 66% of Attack). */
  ratioPct: number | null;
  /** "Atk" (Attack) or "SpAtk" (Sp. Atk). */
  scalingStat: string | null;
  /** Flat damage added per level above 1 ("slider"). */
  perLevel: number | null;
  /** Flat base damage. */
  base: number | null;
  /** False when unite-db marks the line as an exception (not a ratio/slider/base formula). */
  formulaApplies: boolean;
  description: string | null;
  notes: string | null;
  info: string | null;
}

function component(r: Raw, prefix: string): DamageComponent | null {
  const label = str(r, `${prefix}label`);
  const ratio = n(r, `${prefix}ratio`);
  const desc = str(r, `${prefix}true_desc`);
  // The top-level true_desc is the move's long description, not a component one.
  const isMain = prefix === '' || prefix === 'enhanced_';
  if (!label && ratio === null && (isMain || !desc)) return null;
  return {
    label,
    ratioPct: ratio,
    scalingStat: str(r, `${prefix}dmg_type`),
    perLevel: n(r, `${prefix}slider`),
    base: n(r, `${prefix}base`),
    formulaApplies: str(r, `${prefix}exception`) !== 'True',
    description: isMain ? null : desc,
    notes: isMain ? null : str(r, `${prefix}notes`),
    info: str(r, `${prefix}rsb_info`),
  };
}

export interface RsbBlock {
  code: string | null;
  detailedDescription: string | null;
  notes: string | null;
  alert: string | null;
  damage: DamageComponent[];
  /** Values after the move's "+" upgrade (enhanced_*). */
  upgradedDescription: string | null;
  upgradedNotes: string | null;
  upgradedCooldownS: number | null;
  upgradedDamage: DamageComponent[];
}

function rsbBlocks(v: unknown): Raw[] {
  if (Array.isArray(v)) return v as Raw[];
  if (v && typeof v === 'object') {
    const o = v as Raw;
    // Some entries are arrays serialized as objects with numeric keys.
    if ('0' in o && !('name' in o)) return Object.keys(o).filter((k) => /^\d+$/.test(k)).map((k) => o[k] as Raw);
    return [o];
  }
  return [];
}

export function parseRsb(v: unknown): RsbBlock[] {
  return rsbBlocks(v).map((r) => {
    const damage: DamageComponent[] = [];
    const upgradedDamage: DamageComponent[] = [];
    for (const p of ['', 'add1_', 'add2_', 'add3_', 'add4_', 'add5_']) {
      const c = component(r, p);
      if (c) damage.push(c);
      const e = component(r, `enhanced_${p}`);
      if (e) upgradedDamage.push(e);
    }
    return {
      code: str(r, 'code'),
      detailedDescription: str(r, 'true_desc'),
      notes: str(r, 'notes'),
      alert: str(r, 'alert'),
      damage,
      upgradedDescription: str(r, 'enhanced_true_desc'),
      upgradedNotes: str(r, 'enhanced_notes'),
      upgradedCooldownS: n(r, 'enhanced_cdr'),
      upgradedDamage,
    };
  });
}

export interface MoveOption {
  name: string;
  category: string | null;
  cooldownS: number | null;
  /** Level at which this option can be learned. */
  learnLevel: number | null;
  /** Level at which the option gets its "+" upgrade. */
  upgradeLevel: number | null;
  description: string | null;
  upgradeDescription: string | null;
  details: RsbBlock[];
}

export interface MoveSlot {
  slot: 1 | 2;
  base: MoveOption;
  options: MoveOption[];
}

export interface UniteMove {
  name: string;
  category: string | null;
  learnLevel: number | null;
  /** unite-db "cd" field for the Unite Move (seconds). */
  cooldownS: number | null;
  /** unite-db "energy" field: Unite gauge requirement in internal units. */
  gaugeEnergy: number | null;
  buffs: string | null;
  buffDurationS: number | null;
  description: string | null;
  details: RsbBlock[];
}

export interface PokemonMoves {
  passives: { name: string; description: string | null; details: RsbBlock[] }[];
  basicAttack: {
    name: string;
    description: string | null;
    variants: { name: string; description: string | null }[];
    details: RsbBlock[];
    boosted: RsbBlock[];
  } | null;
  slots: MoveSlot[];
  uniteMoves: UniteMove[];
}

function moveOption(s: Raw, levelKey1: string, levelKey2: string, cdKey: string, descKey: string): MoveOption {
  return {
    name: str(s, 'name') ?? '?',
    category: str(s, 'type'),
    cooldownS: n(s, cdKey),
    learnLevel: n(s, levelKey1),
    upgradeLevel: n(s, levelKey2),
    description: str(s, descKey),
    upgradeDescription: str(s, 'description2'),
    details: parseRsb(s['rsb']),
  };
}

export function normalizeUdbMoves(p: Raw): PokemonMoves {
  const skills = arr(p, 'skills');
  const baseLevels = arr(p, 'base_move_levels') as unknown as number[];
  const out: PokemonMoves = { passives: [], basicAttack: null, slots: [], uniteMoves: [] };
  for (const s of skills) {
    const ability = str(s, 'ability');
    if (ability === 'Passive') {
      out.passives.push({ name: str(s, 'name') ?? '?', description: str(s, 'description'), details: parseRsb(s['rsb']) });
      for (const i of [2, 3]) {
        const nm = str(s, `passive${i}_name`);
        if (nm) out.passives.push({ name: nm, description: str(s, `passive${i}_description`), details: parseRsb(s[`rsb${i}`]) });
      }
    } else if (ability === 'Basic') {
      const variants: { name: string; description: string | null }[] = [];
      for (const i of [2, 3]) {
        const nm = str(s, `basic${i}_name`);
        const d = str(s, `basic${i}_description`);
        if (nm || d) variants.push({ name: nm ?? `variant ${i}`, description: d });
      }
      out.basicAttack = {
        name: str(s, 'name') ?? 'Attack',
        description: str(s, 'description'),
        variants,
        details: parseRsb(s['rsb']),
        boosted: parseRsb(s['boosted_rsb']),
      };
    } else if (ability === 'Move 1' || ability === 'Move 2') {
      const slot = ability === 'Move 1' ? 1 : 2;
      const base = moveOption(s, 'level1', 'level2', 'cd', 'description');
      if (base.learnLevel === null) base.learnLevel = baseLevels[slot - 1] ?? null;
      const options = arr(s, 'upgrades').map((u) => moveOption(u, 'level1', 'level2', 'cd1', 'description1'));
      out.slots.push({ slot, base, options });
    } else if (ability === 'Unite Move') {
      const details = parseRsb(s['rsb']);
      details.push(...parseRsb(s['secondary_unite_rsb']));
      out.uniteMoves.push({
        name: str(s, 'name') ?? '?',
        category: str(s, 'type'),
        learnLevel: n(s, 'level'),
        cooldownS: n(s, 'cd'),
        gaugeEnergy: n(s, 'energy'),
        buffs: str(s, 'buffs'),
        buffDurationS: n(s, 'buff_duration'),
        description: str(s, 'description'),
        details,
      });
    }
  }
  return out;
}

export function udbEvolution(p: Raw): { name: string; level: number | null }[] {
  return arr(p, 'evolution').map((e) => ({ name: str(e, 'name') ?? '?', level: n(e, 'level') }));
}

export function udbTags(p: Raw): { role: string | null; range: string | null; difficulty: string | null } {
  const t = obj(p, 'tags');
  return { role: str(t, 'role'), range: str(t, 'range'), difficulty: str(t, 'difficulty') };
}

export { str as udbStr, n as udbNum, arr as udbArr };

// ---------------------------------------------------------------------------
// Held items: per-level stat curve (port of unite-db's front-end "statcalc")
// ---------------------------------------------------------------------------

interface StatCurve {
  label: string;
  percent: boolean;
  float: number;
  initial: number;
  start: number;
  skip: number;
  increment: number;
  initialDiff: number;
}

function curveValue(t: number, inc: number, initial: number, initialDiff: number, start: number, skip: number): number {
  if (!t || t <= 0) return 0;
  let c = t > 1 ? t * inc : initial;
  if (skip > 0 && start === 0 && t > 1) c = Math.floor((t + 1) / 2) * inc;
  if (skip > 0 && start === 1 && t > 1) c = Math.floor(t / 2) * inc;
  if (initialDiff > 0 && t > 1) c += initialDiff;
  return c;
}

/** Value of a held-item stat at item level 1..40, rounded like unite-db displays it. */
export function heldItemStatAt(s: StatCurve, level: number): number {
  let v: number;
  if (level <= 30) {
    v = curveValue(level, s.increment, s.initial, s.initialDiff, s.start, s.skip);
  } else {
    const base = curveValue(30, s.increment, s.initial, s.initialDiff, s.start, s.skip);
    const half = s.increment / 2;
    v = base + curveValue(level - 30, half, s.skip === 0 || s.start === 0 ? half : 0, 0, s.start, s.skip);
  }
  let decimals = s.float;
  if (level > 30) {
    const d = String(s.increment / 2);
    if (d.includes('.')) decimals = Math.max(decimals, (d.split('.')[1] ?? '').length);
  }
  decimals = s.percent ? Math.min(2, Math.max(1, decimals)) : Math.min(2, decimals);
  const f = 10 ** decimals;
  return Math.floor(v * f + 1e-9) / f;
}

export function parseStatCurves(item: Raw): StatCurve[] {
  return arr(item, 'stats').map((s) => ({
    label: str(s, 'label') ?? '?',
    percent: s['percent'] === true,
    float: n(s, 'float') ?? 0,
    initial: n(s, 'initial') ?? 0,
    start: n(s, 'start') ?? 0,
    skip: n(s, 'skip') ?? 0,
    increment: n(s, 'increment') ?? 0,
    initialDiff: n(s, 'initial_diff') ?? 0,
  }));
}
