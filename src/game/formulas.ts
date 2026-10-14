// Pure formulas from docs/design/rules-v1.md. No state, easy to test.

import type { Formula, GrowingStat, RulesData, StatRange } from "./types.ts";

/**
 * Fraction of the level 1 → 15 gain reached at `level`, with Unite's geometric
 * curve: each level's gain is `ratio` times the previous one.
 */
export function growthFraction(level: number, maxLevel: number, ratio: number): number {
  if (level <= 1) return 0;
  if (level >= maxLevel) return 1;
  let done = 0;
  let total = 0;
  let gain = 1; // ratio^(k-2), by repeated products (determinism: no pow)
  for (let k = 2; k <= maxLevel; k++) {
    if (k > 2) gain *= ratio;
    total += gain;
    if (k <= level) done += gain;
  }
  return done / total;
}

/** ML endpoints at levels 1 and 15, Unite curve in between. */
export function statAtLevel([l1, l15]: StatRange, level: number, maxLevel: number, ratio: number): number {
  return l1 + (l15 - l1) * growthFraction(level, maxLevel, ratio);
}

/** XP needed to go from `level` to `level + 1` (LoL shape). */
export function xpToNext(level: number, rules: RulesData): number {
  return rules.xp.perLevelBase + rules.xp.perLevelStep * level;
}

/** Damage multiplier for a defense value: K / (K + defense), defense floored. */
export function mitigation(defense: number, rules: RulesData): number {
  const d = Math.max(defense, rules.defense.floor);
  return rules.defense.k / (rules.defense.k + d);
}

/** Defense left after percentage penetration (LoL order: reductions, then % pen, then flat pen). */
export function effectiveDefense(defense: number, penPct: number, flatPen = 0): number {
  if (defense <= 0) return defense;
  return Math.max(0, defense * (1 - penPct) - flatPen);
}

export function respawnTime(level: number, minutes: number, rules: RulesData): number {
  const r = rules.respawn;
  return Math.min(r.max, r.base + r.perLevel * level + r.perMinute * minutes);
}

export function grow(stat: GrowingStat, minutes: number): number {
  return stat.base + stat.perMin * minutes;
}

const pick = (v: number | number[], rank: number): number => (Array.isArray(v) ? (v[Math.min(rank, v.length) - 1] ?? 0) : v);

export interface FormulaContext {
  level: number;
  /** Ultimate rank 1–3 (1 for other skills). */
  rank: number;
  stats: { physicalAttack: number; basePhysicalAttack: number; magicPower: number; maxHp: number };
  target?: { maxHp: number; hp: number };
}

/** Unite-style value: base + perLevel × (level − 1) + Σ ratio × stat. */
export function evaluate(f: Formula, ctx: FormulaContext): number {
  let v = pick(f.base, ctx.rank) + (f.perLevel ?? 0) * (ctx.level - 1);
  for (const r of f.ratios ?? []) {
    const ratio = pick(r.value, ctx.rank);
    switch (r.stat) {
      case "physicalAttack":
        v += ratio * ctx.stats.physicalAttack;
        break;
      case "bonusPhysicalAttack":
        v += ratio * (ctx.stats.physicalAttack - ctx.stats.basePhysicalAttack);
        break;
      case "magicPower":
        v += ratio * ctx.stats.magicPower;
        break;
      case "maxHp":
        v += ratio * ctx.stats.maxHp;
        break;
      case "targetMaxHp":
        v += ratio * (ctx.target?.maxHp ?? 0);
        break;
      case "targetMissingHp":
        v += ratio * ((ctx.target?.maxHp ?? 0) - (ctx.target?.hp ?? 0));
        break;
    }
  }
  return v;
}
