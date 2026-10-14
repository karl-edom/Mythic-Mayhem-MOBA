// Fixed-step match simulation for the v1 rules (docs/design/rules-v1.md).
// Deterministic for a given seed; driven only by Commands; no rendering.

import { add, dist, distToSegment, dot, len, norm, rng, scale, sub, type Vec } from "../sim/math.ts";
import { effectiveDefense, evaluate, grow, mitigation, respawnTime, statAtLevel, xpToNext, type FormulaContext } from "./formulas.ts";
import type {
  Command,
  GameEvent,
  HeroUnit,
  MinionKind,
  MinionUnit,
  MonsterUnit,
  Side,
  Statuses,
  TowerTier,
  TowerUnit,
  Unit,
  World,
  Zone,
} from "./state.ts";
import { buildGrid, isWallAt, moveUntilWall, resolveWalls, segmentClear } from "./nav.ts";
import type { DamageType, Effect, GameContent, ItemEffect, HeroDef, Role, SkillDef, SkillMods, SpellDef, StatBlock, Team, Vec2 } from "./types.ts";

const v = ([x, y]: Vec2): Vec => ({ x, y });
const SPEED_UNIT = 100; // ML speed points per unit/s

// ---------------------------------------------------------------- setup

export interface HeroPick {
  heroId: string;
  items: [string, string, string];
  spell: string;
  isPlayer?: boolean;
}

const emptyStatus = (): Statuses => ({ slows: [], stunUntil: 0, rootUntil: 0, silenceUntil: 0, airborneUntil: 0, shields: [], buffs: [] });

function pathLength(path: Vec[]): number {
  let l = 0;
  for (let i = 1; i < path.length; i++) l += dist(path[i - 1]!, path[i]!);
  return l;
}

export function pointAlong(path: Vec[], d: number): Vec {
  let rest = Math.max(0, d);
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1]!;
    const b = path[i]!;
    const seg = dist(a, b);
    if (rest <= seg) return add(a, scale(norm(sub(b, a)), rest));
    rest -= seg;
  }
  return path[path.length - 1]!;
}

/** Distance travelled along a path to the closest point to p. */
export function progressAlong(path: Vec[], p: Vec): number {
  let best = Infinity;
  let bestD = 0;
  let acc = 0;
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1]!;
    const b = path[i]!;
    const ab = sub(b, a);
    const l = len(ab);
    const t = Math.max(0, Math.min(1, dot(sub(p, a), ab) / (l * l)));
    const q = add(a, scale(ab, t));
    const d = dist(p, q);
    if (d < best) [best, bestD] = [d, acc + t * l];
    acc += l;
  }
  return bestD;
}

/** Path from a team's base toward the enemy base. */
export function lanePathFor(world: World, lane: number, team: Side): Vec[] {
  const p = world.lanes[lane]!;
  return team === 1 ? [...p].reverse() : p;
}

export function createGame(content: GameContent, picks: [HeroPick[], HeroPick[]], seed = 1): World {
  const map = content.map;
  const world: World = {
    content,
    time: 0,
    tick: 0,
    dt: 1 / content.rules.tickRate,
    rng: rng(seed),
    nextId: 1,
    units: [],
    projectiles: [],
    zones: [],
    events: [],
    winner: null,
    kills: [0, 0],
    turtle: { nextSpawnAt: content.units.turtle.spawnAt, count: 0, deadAt: -1 },
    lord: { nextSpawnAt: content.units.lord.spawnAt },
    campRespawns: [],
    nextWaveAt: content.units.minions.firstWave,
    waveCount: 0,
    lanes: map.lanes.map((l) => l.path.map(v)),
    bushes: map.bushes.map((b) => ({ cx: b.center[0], cy: b.center[1], hw: b.size[0] / 2, hh: b.size[1] / 2 })),
    nav: buildGrid(map.grid, map.size),
    vision: [new Set(), new Set()],
    objectives: [
      { towers: 0, turtles: 0, lords: 0 },
      { towers: 0, turtles: 0, lords: 0 },
    ],
    firstBlood: false,
  };

  // Structures: 2 towers per lane per team, then the base.
  const tw = content.units.towers;
  for (const team of [0, 1] as Team[]) {
    map.lanes.forEach((lane, li) => {
      const path = lanePathFor(world, li, team);
      const d = map.towerDistances[lane.id];
      for (const tier of ["inner", "outer"] as const) {
        addTower(world, team, tier, li, pointAlong(path, d[tier]), tw[tier].hp, tw[tier].defense);
      }
    });
    addTower(world, team, "base", null, v(map.bases[team]), tw.base.hp, tw.base.defense);
  }

  // Camps: each side's jungle; red camps are the point mirror of blue ones.
  for (const side of [0, 1] as Team[]) {
    for (const c of map.camps) {
      const def = content.units.camps.find((k) => k.id === c.id);
      if (!def) throw new Error(`camp inconnu ${c.id}`);
      world.campRespawns.push({ campId: c.id, side, at: def.spawnAt });
    }
  }

  // Heroes.
  for (const team of [0, 1] as Team[]) {
    for (const pick of picks[team]) addHero(world, team, pick);
  }
  computeVision(world);
  return world;
}

export function mirror(p: Vec, size: number): Vec {
  return { x: size - p.x, y: size - p.y };
}

function addTower(world: World, team: Team, tier: TowerTier, lane: number | null, pos: Vec, hp: number, defense: number): TowerUnit {
  const t: TowerUnit = {
    id: world.nextId++,
    kind: "tower",
    team,
    tier,
    lane,
    pos,
    radius: tier === "base" ? 1.6 : 1,
    hp,
    maxHp: hp,
    alive: true,
    status: emptyStatus(),
    damagedBy: new Map(),
    defense,
    nextAttackAt: 0,
    targetId: null,
    ramp: { targetId: null, hits: 0, lastShot: -99 },
    regenAt: 5,
  };
  world.units.push(t);
  return t;
}

function heroDef(world: World, id: string): HeroDef {
  const d = world.content.heroes.find((h) => h.id === id);
  if (!d) throw new Error(`héros inconnu ${id}`);
  return d;
}

function spellDef(world: World, id: string): SpellDef {
  const s = world.content.spells.find((x) => x.id === id);
  if (!s) throw new Error(`sort inconnu ${id}`);
  return s;
}

function addHero(world: World, team: Team, pick: HeroPick): HeroUnit {
  const def = heroDef(world, pick.heroId);
  for (const id of pick.items) if (!world.content.items.some((i) => i.id === id)) throw new Error(`objet inconnu ${id}`);
  const fountain = v(world.content.map.fountains[team]);
  const h: HeroUnit = {
    id: world.nextId++,
    kind: "hero",
    team,
    def,
    name: def.name,
    isPlayer: pick.isPlayer ?? false,
    pos: { ...fountain },
    radius: def.radius,
    hp: 1,
    maxHp: 1,
    alive: true,
    status: emptyStatus(),
    damagedBy: new Map(),
    level: 1,
    xp: 0,
    gold: 0,
    totalGold: 0,
    mana: 0,
    maxMana: 0,
    respawnAt: 0,
    skills: [0, 1, 2].map((i) => ({ unlocked: i === 0, readyAt: 0, choice: null, plus: false })) as HeroUnit["skills"],
    ultRank: 0,
    pendingChoices: [],
    items: pick.items.map((id) => ({ id, tier: 0 })),
    spell: { def: spellDef(world, pick.spell), readyAt: 0 },
    attack: { targetId: null, windupEnd: 0, nextAt: 0, count: 0 },
    dash: null,
    recallEnd: 0,
    facing: { x: team === 0 ? 1 : -1, y: team === 0 ? -1 : 1 },
    orangeUntil: 0,
    orangeReadyAt: 0,
    purpleUntil: 0,
    stats: null as unknown as StatBlock,
    baseAttack: 0,
    kills: 0,
    deaths: 0,
    assists: 0,
    damageToHeroes: 0,
    lastHitAt: -99,
    cs: 0,
    combatUntil: 0,
    revealUntil: 0,
    streak: 0,
    multi: { count: 0, at: -99 },
    passive: { readyAt: {}, huntTargetId: null, huntHits: [], nextTickAt: 0 },
  };
  refreshStats(world, h);
  h.hp = h.maxHp;
  h.mana = h.maxMana;
  world.units.push(h);
  return h;
}

// ---------------------------------------------------------------- stats

const ROLE_TOUGH: Role[] = ["tank", "fighter", "assassin"];

export function refreshStats(world: World, h: HeroUnit): void {
  const r = world.content.rules;
  const s = h.def.stats;
  const lvl = (range: [number, number]) => statAtLevel(range, h.level, r.xp.maxLevel, r.growthRatio);
  const st: StatBlock = {
    hp: lvl(s.hp),
    hpRegen: lvl(s.hpRegen),
    mana: lvl(s.mana),
    manaRegen: lvl(s.manaRegen),
    physicalAttack: lvl(s.physicalAttack),
    magicPower: 0,
    physicalDefense: lvl(s.physicalDefense),
    magicDefense: lvl(s.magicDefense),
    attackSpeed: lvl(s.attackSpeed),
    moveSpeed: s.moveSpeed,
    range: s.range,
    critChance: 0,
    cdr: 0,
    lifesteal: 0,
    physicalPenPct: 0,
    magicPenPct: 0,
  };
  let asPct = 0;
  let msPct = 0;
  for (const it of h.items) {
    if (it.tier === 0) continue;
    const def = world.content.items.find((i) => i.id === it.id)!;
    const tier = def.tiers[it.tier - 1]!;
    for (const [k, val] of Object.entries(tier.stats)) {
      if (k === "attackSpeedPct") asPct += val;
      else if (k === "moveSpeedPct") msPct += val;
      else st[k as keyof StatBlock] += val;
    }
  }
  for (const b of h.status.buffs) st[b.stat] += b.add;
  const amp = itemEffect(world, h, "magicAmp");
  if (amp) st.magicPower *= 1 + amp.pctAtLevel1 + ((amp.pctAtMaxLevel - amp.pctAtLevel1) * (h.level - 1)) / (r.xp.maxLevel - 1);
  if (h.purpleUntil > world.time) st.cdr += world.content.units.buffs.purple.cdr;
  st.cdr = Math.min(st.cdr, r.caps.cdr);
  st.attackSpeed = Math.min(st.attackSpeed * (1 + asPct), r.caps.attackSpeed);
  st.moveSpeed = st.moveSpeed * (1 + msPct);
  const ratio = h.maxHp > 0 ? h.hp / h.maxHp : 1;
  const manaRatio = h.maxMana > 0 ? h.mana / h.maxMana : 1;
  const grewHp = st.hp - h.maxHp;
  h.baseAttack = lvl(s.physicalAttack);
  h.stats = st;
  h.maxHp = st.hp;
  h.maxMana = st.mana;
  // Max HP gains are added as current HP (LoL rule); losses keep the ratio.
  h.hp = grewHp > 0 && h.hp > 0 ? Math.min(h.maxHp, h.hp + grewHp) : Math.min(h.maxHp, ratio * h.maxHp);
  h.mana = Math.min(h.maxMana, Math.max(h.mana, manaRatio * h.maxMana));
}

/** The unique passive of a finished (tier 3) item the hero carries, if any. */
export function itemEffect<K extends ItemEffect["kind"]>(world: World, h: HeroUnit, kind: K): Extract<ItemEffect, { kind: K }> | undefined {
  for (const it of h.items) {
    if (it.tier < 3) continue;
    const e = world.content.items.find((i) => i.id === it.id)?.effect;
    if (e?.kind === kind) return e as Extract<ItemEffect, { kind: K }>;
  }
  return undefined;
}

/** Ready-once-per-cooldown helper for item passives. */
function passiveReady(world: World, h: HeroUnit, key: string, cooldown: number): boolean {
  if ((h.passive.readyAt[key] ?? 0) > world.time) return false;
  h.passive.readyAt[key] = world.time + cooldown;
  return true;
}

function addBuff(world: World, h: HeroUnit, stat: keyof StatBlock, add: number, duration: number): void {
  h.status.buffs.push({ stat, add, until: world.time + duration });
  refreshStats(world, h);
}

function formulaCtx(h: HeroUnit, rank: number, target?: Unit): FormulaContext {
  return {
    level: h.level,
    rank: Math.max(1, rank),
    stats: {
      physicalAttack: h.stats.physicalAttack,
      basePhysicalAttack: h.baseAttack,
      magicPower: h.stats.magicPower,
      maxHp: h.maxHp,
    },
    ...(target ? { target: { maxHp: target.maxHp, hp: target.hp } } : {}),
  };
}

export function moveSpeedOf(world: World, u: Unit): number {
  const slow = u.status.slows.reduce((m, s) => (s.until > world.time ? Math.max(m, s.pct) : m), 0);
  let base: number;
  if (u.kind === "hero") base = u.stats.moveSpeed;
  else if (u.kind === "minion") base = u.speed;
  else base = 250;
  return (base / SPEED_UNIT) * (1 - slow);
}

export const isDisabled = (w: World, u: Unit) => u.status.stunUntil > w.time || u.status.airborneUntil > w.time;
export const isRooted = (w: World, u: Unit) => isDisabled(w, u) || u.status.rootUntil > w.time;

// ---------------------------------------------------------------- queries

export function inBush(world: World, p: Vec): number {
  return world.bushes.findIndex((b) => Math.abs(p.x - b.cx) <= b.hw && Math.abs(p.y - b.cy) <= b.hh);
}

/** Fog of war: towers and monsters are always shown; heroes and minions only inside the team's vision. */
export function visibleTo(world: World, team: Side, u: Unit): boolean {
  if (team === 2 || u.team === team || u.kind === "tower" || u.kind === "monster") return true;
  return world.vision[team].has(u.id);
}

export function visionRadius(world: World, u: Unit): number {
  const r = world.content.rules.vision;
  return u.kind === "hero" ? r.hero : u.kind === "tower" ? r.tower : u.kind === "minion" ? r.minion : 0;
}

/**
 * Rebuilds what each team sees. Vision comes from allied heroes, minions and towers.
 * ML bushes: a hero in a bush stays hidden unless an enemy unit stands in the same bush
 * or the hero attacked in the last second.
 */
export function computeVision(world: World): void {
  for (const team of [0, 1] as Team[]) {
    const seen = world.vision[team];
    seen.clear();
    const sources = world.units.filter((s) => s.alive && s.team === team && s.kind !== "monster");
    const sourceBush = new Map<number, number>();
    const bushOf = (s: Unit) => {
      let b = sourceBush.get(s.id);
      if (b === undefined) sourceBush.set(s.id, (b = inBush(world, s.pos)));
      return b;
    };
    for (const u of world.units) {
      if (!u.alive || u.team === team || u.team === 2 || u.kind === "tower") continue;
      if (u.kind === "hero" && u.revealUntil <= world.time) {
        const b = inBush(world, u.pos);
        if (b >= 0 && !sources.some((s) => bushOf(s) === b)) continue;
      }
      if (sources.some((s) => dist(s.pos, u.pos) <= visionRadius(world, s) + u.radius)) seen.add(u.id);
    }
  }
}

export const isEnemy = (a: Side, b: Side) => a !== b;

export function unitById(world: World, id: number | null): Unit | undefined {
  if (id === null) return undefined;
  return world.units.find((u) => u.id === id);
}

/** Structures follow ML's order: only the frontmost tower of a lane, base after an inner tower falls. */
export function isTargetable(world: World, u: Unit): boolean {
  if (!u.alive) return false;
  if (u.kind !== "tower") return true;
  const own = world.units.filter((t): t is TowerUnit => t.kind === "tower" && t.team === u.team);
  if (u.tier === "outer") return true;
  if (u.tier === "inner") return !own.some((t) => t.alive && t.tier === "outer" && t.lane === u.lane);
  return own.some((t) => !t.alive && t.tier === "inner");
}

export const heroes = (w: World) => w.units.filter((u): u is HeroUnit => u.kind === "hero");

// ---------------------------------------------------------------- damage

function pushEvent(world: World, e: GameEvent): void {
  world.events.push(e);
  if (world.events.length > 4000) world.events.splice(0, world.events.length - 2000);
}

/** How the damage was dealt; item passives react to basic attacks and skills. */
export type DamageOrigin = "attack" | "skill" | "other";

export function dealDamage(world: World, source: Unit | null, target: Unit, raw: number, type: DamageType, origin: DamageOrigin = "other"): number {
  if (!target.alive || raw <= 0) return 0;
  const rules = world.content.rules;
  let amount = raw;
  if (type !== "true") {
    let def: number;
    if (target.kind === "hero") {
      def = type === "physical" ? target.stats.physicalDefense : target.stats.magicDefense;
      const fort = itemEffect(world, target, "fortress");
      if (fort) def += Math.min(fort.max, fort.perEnemy * nearbyHeroes(world, (1 - (target.team as Team)) as Team, target.pos, fort.radius).length);
    } else def = target.defense;
    const pen = source?.kind === "hero" ? (type === "physical" ? source.stats.physicalPenPct : source.stats.magicPenPct) : 0;
    amount *= mitigation(effectiveDefense(def, pen), rules);
  }
  if (target.kind === "tower") {
    const tw = world.content.units.towers;
    const enemyMinionsNear = world.units.some((m) => m.alive && m.kind === "minion" && m.team !== target.team && dist(m.pos, target.pos) <= tw.range + 1);
    if (!enemyMinionsNear) amount *= 1 - tw.backdoorReduction;
    if (target.tier === "outer" && world.time < tw.earlyShield.until) amount *= 1 - tw.earlyShield.reduction;
  }
  // Retribution passive (ML): damage taken from creeps −50 %.
  if (source?.kind === "monster" && target.kind === "hero" && target.spell.def.id === "retribution") amount *= 0.5;
  if (source && (source.kind === "minion" && source.type !== "lord") && (target.kind === "hero" || target.kind === "tower")) {
    amount *= world.content.units.minions.damageVsHeroesAndStructures;
  }
  // Shields absorb first, soonest-expiring first (LoL).
  target.status.shields.sort((a, b) => a.until - b.until);
  for (const s of target.status.shields) {
    if (s.until <= world.time) continue;
    const absorbed = Math.min(s.amount, amount);
    s.amount -= absorbed;
    amount -= absorbed;
  }
  target.status.shields = target.status.shields.filter((s) => s.amount > 0 && s.until > world.time);
  target.hp -= amount;
  // Out-of-combat rule: any hit on a hero, or a hero hitting a hero or a tower, pauses natural regen.
  if (target.kind === "hero" && source) target.combatUntil = world.time + rules.combatTimeout;
  if (source?.kind === "hero") {
    target.damagedBy.set(source.id, world.time);
    if (target.kind === "hero" || target.kind === "tower") source.combatUntil = world.time + rules.combatTimeout;
    if (inBush(world, source.pos) >= 0) source.revealUntil = world.time + rules.vision.revealAfterAttack;
    if (target.kind === "hero") source.damageToHeroes += amount;
    if (source.stats.lifesteal > 0 && type === "physical") healUnit(world, source, amount * source.stats.lifesteal);
    if (target.kind === "hero") heroHitPassives(world, source, target, origin);
  }
  if (target.kind === "hero") target.recallEnd = 0;
  pushEvent(world, { type: "damage", targetId: target.id, amount, damageType: type, fromHero: source?.kind === "hero", pos: { ...target.pos } });
  // Aggro: monsters turn on whoever hits them; minions and towers on heroes hitting allied heroes.
  if (source && target.kind === "monster" && target.targetId === null) target.targetId = source.id;
  if (source?.kind === "hero" && target.kind === "hero") {
    for (const u of world.units) {
      if (!u.alive || u.team !== target.team) continue;
      if (u.kind === "minion" && dist(u.pos, source.pos) < 5) u.aggroHeroId = source.id;
      if (u.kind === "tower" && dist(u.pos, source.pos) <= world.content.units.towers.range) u.targetId = source.id;
    }
  }
  if (target.hp <= 0) kill(world, source, target);
  return amount;
}

/** Item passives triggered when a hero damages an enemy hero. */
function heroHitPassives(world: World, source: HeroUnit, target: HeroUnit, origin: DamageOrigin): void {
  const t = world.time;
  const despair = itemEffect(world, source, "despair");
  if (despair && target.hp > 0 && target.hp / target.maxHp < despair.hpBelow && passiveReady(world, source, "despair", despair.duration)) {
    addBuff(world, source, "physicalAttack", source.stats.physicalAttack * despair.attackPct, despair.duration);
  }
  const hunt = itemEffect(world, source, "hunt");
  if (hunt && origin !== "other") {
    const p = source.passive;
    if (p.huntTargetId !== target.id) p.huntHits = [];
    p.huntTargetId = target.id;
    p.huntHits = [...p.huntHits.filter((x) => t - x <= hunt.window), t];
    if (p.huntHits.length >= hunt.hits && passiveReady(world, source, "hunt", hunt.duration)) {
      p.huntHits = [];
      addBuff(world, source, "moveSpeed", source.stats.moveSpeed * hunt.moveSpeedPct, hunt.duration);
    }
  }
  const deter = itemEffect(world, target, "deterrence");
  if (deter && origin === "skill" && passiveReady(world, source, "deterred", deter.duration)) {
    addBuff(world, source, "physicalAttack", -source.stats.physicalAttack * deter.attackPct, deter.duration);
  }
}

export function healUnit(world: World, target: Unit, amount: number): void {
  if (!target.alive || amount <= 0) return;
  const before = target.hp;
  target.hp = Math.min(target.maxHp, target.hp + amount);
  if (target.hp - before > 1) pushEvent(world, { type: "heal", targetId: target.id, amount: target.hp - before, pos: { ...target.pos } });
}

function minutes(world: World): number {
  return world.time / 60;
}

function giveXp(world: World, h: HeroUnit, amount: number): void {
  const r = world.content.rules;
  if (h.level >= r.xp.maxLevel) return;
  h.xp += amount;
  let leveled = false;
  while (h.level < r.xp.maxLevel && h.xp >= xpToNext(h.level, r)) {
    h.xp -= xpToNext(h.level, r);
    h.level++;
    leveled = true;
    onLevelUp(world, h);
  }
  if (h.level >= r.xp.maxLevel) h.xp = 0;
  if (leveled) refreshStats(world, h);
}

function onLevelUp(world: World, h: HeroUnit): void {
  const s = world.content.rules.skillSchedule;
  if (h.level >= s.skill2) h.skills[1].unlocked = true;
  if (h.level >= s.ultimate) h.skills[2].unlocked = true;
  h.ultRank = s.ultRanks.filter((l) => h.level >= l).length;
  if (h.level === s.choice1 && h.def.skills[0].choices) h.pendingChoices.push(0);
  if (h.level === s.choice2 && h.def.skills[1].choices) h.pendingChoices.push(1);
  if (h.level === s.plus1) h.skills[0].plus = true;
  if (h.level === s.plus2) h.skills[1].plus = true;
  pushEvent(world, { type: "levelUp", heroId: h.id, level: h.level });
}

export function giveGold(world: World, h: HeroUnit, amount: number): void {
  h.gold += amount;
  h.totalGold += amount;
  upgradeItems(world, h);
}

/** Upgrade order (rules-v1 §9): tier 1 of the 3 items, then item 1 to tier 3, item 2, item 3. */
export function nextUpgrade(h: HeroUnit): number {
  const t1 = h.items.findIndex((i) => i.tier === 0);
  if (t1 >= 0) return t1;
  return h.items.findIndex((i) => i.tier < 3);
}

export function upgradeCost(world: World, h: HeroUnit, idx: number): number {
  const it = h.items[idx]!;
  const def = world.content.items.find((i) => i.id === it.id)!;
  const next = def.tiers[it.tier]!.price;
  const current = it.tier > 0 ? def.tiers[it.tier - 1]!.price : 0;
  return next - current;
}

function upgradeItems(world: World, h: HeroUnit): void {
  let changed = false;
  for (;;) {
    const idx = nextUpgrade(h);
    if (idx < 0) break;
    const cost = upgradeCost(world, h, idx);
    if (h.gold < cost) break;
    h.gold -= cost;
    const it = h.items[idx]!;
    it.tier++;
    changed = true;
    const def = world.content.items.find((i) => i.id === it.id)!;
    pushEvent(world, { type: "item", heroId: h.id, itemName: def.tiers[it.tier - 1]!.name });
  }
  if (changed) refreshStats(world, h);
}

/** Heroes of `team` near `p`, for XP sharing. */
function nearbyHeroes(world: World, team: Side, p: Vec, radius: number): HeroUnit[] {
  return heroes(world).filter((h) => h.alive && h.team === team && dist(h.pos, p) <= radius);
}

function shareXp(world: World, team: Side, p: Vec, total: number, mustInclude?: HeroUnit): void {
  const r = world.content.rules.xp;
  const list = nearbyHeroes(world, team, p, r.shareRadius);
  if (mustInclude && !list.includes(mustInclude)) list.push(mustInclude);
  if (list.length === 0) return;
  const each = total * (r.shareSplit[Math.min(list.length, r.shareSplit.length) - 1] ?? 0.2);
  for (const h of list) giveXp(world, h, each);
}

function kill(world: World, source: Unit | null, target: Unit): void {
  target.alive = false;
  target.hp = 0;
  const killerHero = source?.kind === "hero" ? source : lastHeroDamager(world, target);
  pushEvent(world, { type: "death", unitId: target.id, killerId: killerHero?.id ?? null, pos: { ...target.pos } });
  const min = minutes(world);
  const rules = world.content.rules;

  if (target.kind === "hero") {
    target.deaths++;
    target.respawnAt = world.time + respawnTime(target.level, min, rules);
    target.dash = null;
    target.recallEnd = 0;
    target.orangeUntil = 0;
    target.purpleUntil = 0;
    target.status = emptyStatus();
    const enemyTeam = (1 - target.team) as Team;
    world.kills[enemyTeam]++;
    const assists = [...target.damagedBy.entries()]
      .filter(([id, t]) => world.time - t <= rules.assistWindow && id !== killerHero?.id)
      .map(([id]) => world.units.find((u) => u.id === id))
      .filter((u): u is HeroUnit => u?.kind === "hero" && u.team === enemyTeam);
    if (killerHero && killerHero.team === enemyTeam) {
      killerHero.kills++;
      giveGold(world, killerHero, rules.gold.kill);
    }
    for (const a of assists) {
      a.assists++;
      giveGold(world, a, rules.gold.assist / Math.max(1, assists.length));
    }
    const xp = rules.xp.heroKillBase + rules.xp.heroKillPerLevel * target.level;
    shareXp(world, enemyTeam, target.pos, xp, killerHero?.team === enemyTeam ? killerHero : undefined);
    pushEvent(world, { type: "heroKill", killerId: killerHero?.id ?? null, victimId: target.id, assists: assists.map((a) => a.id) });
    announceKill(world, killerHero?.team === enemyTeam ? killerHero : null, target);
    target.damagedBy.clear();
    return;
  }

  if (target.kind === "minion") {
    const enemyTeam = target.team === 0 ? 1 : 0;
    const early = world.time < 300;
    if (source?.kind === "hero") {
      const retri = source.spell.def.id === "retribution" && early ? 0.3 : 1;
      giveGold(world, source, target.goldValue * retri);
      source.cs++;
    } else {
      const near = nearbyHeroes(world, enemyTeam, target.pos, rules.xp.shareRadius);
      for (const h of near) giveGold(world, h, (target.goldValue * rules.gold.noHeroLastHitShare) / near.length);
    }
    shareXp(world, enemyTeam, target.pos, target.xpValue);
    return;
  }

  if (target.kind === "tower") {
    pushEvent(world, { type: "towerDown", team: target.team, tier: target.tier });
    const enemyTeam = (1 - (target.team as Team)) as Team;
    world.objectives[enemyTeam].towers++;
    for (const h of heroes(world)) if (h.team === enemyTeam && h.alive) giveGold(world, h, target.tier === "base" ? 0 : 120);
    if (target.tier === "base") world.winner = enemyTeam;
    else pushEvent(world, { type: "announce", text: target.team === 0 ? "Une tour bleue est tombée" : "Une tour rouge est tombée", team: null });
    return;
  }

  // Monsters.
  const m = target;
  const team = killerHero?.team ?? null;
  if (m.monster === "camp") {
    const def = world.content.units.camps.find((c) => c.id === m.campId)!;
    world.campRespawns.push({ campId: m.campId, side: m.jungleOf as Team, at: world.time + def.respawn });
    if (killerHero) {
      killerHero.cs++;
      const bonus = killerHero.spell.def.id === "retribution" ? 1.6 : 1;
      giveGold(world, killerHero, def.gold * bonus);
      shareXp(world, killerHero.team, m.pos, def.xp * bonus, killerHero);
      const dur = world.content.units.buffs.duration;
      if (def.buff === "orange") killerHero.orangeUntil = world.time + dur;
      if (def.buff === "purple") {
        killerHero.purpleUntil = world.time + dur;
        refreshStats(world, killerHero);
      }
    }
    return;
  }
  if (m.monster === "turtle") {
    const tu = world.content.units.turtle;
    world.turtle.deadAt = world.time;
    world.turtle.nextSpawnAt = world.time < tu.lastSpawnAfterDeathBefore ? world.time + tu.respawn : Infinity;
    if (team !== null) {
      world.objectives[team as Team].turtles++;
      const gold = tu.goldPerHero[Math.min(world.turtle.count - 1, tu.goldPerHero.length - 1)] ?? 60;
      for (const h of heroes(world)) {
        if (h.team !== team) continue;
        giveGold(world, h, gold);
        if (h.alive) {
          giveXp(world, h, tu.xpPerHero);
          h.status.shields.push({ amount: evaluate(tu.allyShield, formulaCtx(h, 1)), until: world.time + tu.shieldDuration });
        }
      }
      pushEvent(world, { type: "announce", text: team === 0 ? "L'équipe bleue a vaincu la Tortue" : "L'équipe rouge a vaincu la Tortue", team });
    }
    return;
  }
  // Lord.
  const lo = world.content.units.lord;
  world.lord.nextSpawnAt = world.time + (world.time >= lo.lateAfter ? lo.respawnLate : lo.respawn);
  if (team !== null) {
    world.objectives[team as Team].lords++;
    for (const h of heroes(world)) if (h.team === team && h.alive) giveXp(world, h, lo.xpPerHero);
    summonLord(world, team as Team);
    pushEvent(world, { type: "announce", text: team === 0 ? "Le Seigneur rejoint l'équipe bleue !" : "Le Seigneur rejoint l'équipe rouge !", team });
  }
}

/** ML announcer: first blood, multi-kills, kill streaks, shutdowns and aces. */
function announceKill(world: World, killer: HeroUnit | null, victim: HeroUnit): void {
  const a = world.content.rules.announcer;
  const t = world.time;
  const say = (text: string) => pushEvent(world, { type: "announce", text, team: killer?.team ?? null, big: true });
  if (victim.streak >= 3 && killer) say(`${killer.name} met fin à la série de ${victim.name}`);
  victim.streak = 0;
  victim.multi = { count: 0, at: -99 };
  if (!killer) return;
  killer.streak++;
  killer.multi = t - killer.multi.at <= a.multiKillWindow ? { count: killer.multi.count + 1, at: t } : { count: 1, at: t };
  const multi = a.multiNames[Math.min(killer.multi.count, a.multiNames.length - 1)];
  const streak = a.streakNames[Math.min(killer.streak, a.streakNames.length - 1)];
  if (!world.firstBlood) {
    world.firstBlood = true;
    say(`${a.firstBlood} : ${killer.name}`);
  } else if (multi) say(`${multi} : ${killer.name}`);
  else if (streak) say(`${streak} : ${killer.name}`);
  if (heroes(world).every((h) => h.team !== victim.team || !h.alive)) say(a.ace);
}

function lastHeroDamager(world: World, target: Unit): HeroUnit | null {
  let best: HeroUnit | null = null;
  let bestT = -Infinity;
  for (const [id, t] of target.damagedBy) {
    const u = world.units.find((x) => x.id === id);
    if (u?.kind === "hero" && world.time - t <= world.content.rules.assistWindow && t > bestT) [best, bestT] = [u, t];
  }
  return best;
}

// ---------------------------------------------------------------- effects

function applyEffect(world: World, caster: HeroUnit, target: Unit, e: Effect, rank: number, mult: number, origin: Vec): void {
  if (!target.alive) return;
  const t = world.time;
  const ally = target.team === caster.team;
  switch (e.type) {
    case "damage":
      if (!ally) {
        dealDamage(world, caster, target, evaluate(e.amount, formulaCtx(caster, rank, target)) * mult, e.damageType, "skill");
        const blade = itemEffect(world, caster, "spellblade");
        if (blade && target.alive && target.kind !== "tower" && passiveReady(world, caster, "spellblade", blade.cooldown)) {
          dealDamage(world, caster, target, evaluate(blade.amount, formulaCtx(caster, 1, target)), blade.damageType);
        }
      }
      return;
    case "heal":
      if (ally) healUnit(world, target, evaluate(e.amount, formulaCtx(caster, rank, target)) * mult);
      return;
    case "shield":
      if (ally) target.status.shields.push({ amount: evaluate(e.amount, formulaCtx(caster, rank)) * mult, until: t + e.duration });
      return;
    case "buff":
      if (ally) {
        target.status.buffs.push({ stat: e.stat, add: e.add, until: t + e.duration });
        if (target.kind === "hero") refreshStats(world, target);
      }
      return;
  }
  if (ally || target.kind === "tower") return;
  // Crowd control on enemies. Objectives (Turtle, Lord) are immune.
  if (target.kind === "monster" && target.monster !== "camp") return;
  switch (e.type) {
    case "slow":
      target.status.slows.push({ pct: e.pct, until: t + e.duration });
      return;
    case "stun":
      target.status.stunUntil = Math.max(target.status.stunUntil, t + e.duration);
      break;
    case "airborne":
      target.status.airborneUntil = Math.max(target.status.airborneUntil, t + e.duration);
      break;
    case "root":
      target.status.rootUntil = Math.max(target.status.rootUntil, t + e.duration);
      return;
    case "silence":
      target.status.silenceUntil = Math.max(target.status.silenceUntil, t + e.duration);
      return;
    case "knockback": {
      const dir = norm(sub(target.pos, origin), { x: 1, y: 0 });
      target.pos = clampMap(world, moveUntilWall(world.nav, target.pos, dir, e.distance, target.radius).pos);
      break;
    }
    case "pull": {
      const to = sub(origin, target.pos);
      const d = Math.min(len(to), e.distance);
      target.pos = clampMap(world, moveUntilWall(world.nav, target.pos, norm(to), Math.max(0, d - 0.8), target.radius).pos);
      break;
    }
  }
  if (target.kind === "hero") {
    target.recallEnd = 0;
    target.dash = null;
    target.attack.windupEnd = 0;
  }
}

export function clampMap(world: World, p: Vec): Vec {
  const s = world.content.map.size;
  return { x: Math.min(s - 0.5, Math.max(0.5, p.x)), y: Math.min(s - 0.5, Math.max(0.5, p.y)) };
}

/** Effects after A/B choice and "+" upgrade: added CC replaces a weaker one of the same type. */
function skillEffects(skill: SkillDef, mods: SkillMods[]): Effect[] {
  let effects = [...skill.effects];
  for (const m of mods) {
    for (const add of m.addEffects ?? []) {
      effects = effects.filter((e) => e.type !== add.type || e.type === "damage");
      effects.push(add);
    }
  }
  return effects;
}

function skillMods(h: HeroUnit, slot: number): SkillMods[] {
  const def = h.def.skills[slot]!;
  const st = h.skills[slot]!;
  const mods: SkillMods[] = [];
  if (st.choice && def.choices) mods.push(def.choices[st.choice].mods);
  if (st.plus && def.plus) mods.push(def.plus.mods);
  return mods;
}

export function skillCooldown(world: World, h: HeroUnit, slot: number): number {
  const def = h.def.skills[slot]!;
  const base = Array.isArray(def.cooldown) ? (def.cooldown[Math.max(1, h.ultRank) - 1] ?? def.cooldown[0]!) : def.cooldown;
  const delta = skillMods(h, slot).reduce((s, m) => s + (m.cooldownDelta ?? 0), 0);
  return Math.max(1, (base + delta) * (1 - h.stats.cdr));
}

export function skillManaCost(world: World, h: HeroUnit, slot: number): number {
  if (h.def.resource === "none") return 0;
  const def = h.def.skills[slot]!;
  const base = Array.isArray(def.manaCost) ? (def.manaCost[Math.max(1, h.ultRank) - 1] ?? def.manaCost[0]!) : def.manaCost;
  return h.purpleUntil > world.time ? base * (1 - world.content.units.buffs.purple.manaCostReduction) : base;
}

export function skillRange(h: HeroUnit, slot: number): number {
  const c = h.def.skills[slot]!.cast;
  const add = skillMods(h, slot).reduce((s, m) => s + (m.rangeAdd ?? 0), 0);
  switch (c.type) {
    case "projectile":
      return c.range + add;
    case "line":
      return c.length + add;
    case "cone":
      return c.range + add;
    case "circle":
      return c.castRange + c.radius;
    case "selfCircle":
      return c.radius + add;
    case "dash":
      return c.distance + add;
    case "targetEnemy":
    case "targetAlly":
      return c.range + add;
    case "self":
      return 0;
  }
}

function inCone(p: Vec, r: number, origin: Vec, dir: Vec, range: number, angleDeg: number): boolean {
  const rel = sub(p, origin);
  const d = len(rel);
  if (d > range + r) return false;
  if (d < 0.01) return true;
  const cos = dot(rel, dir) / d;
  return Math.acos(Math.max(-1, Math.min(1, cos))) <= (angleDeg * Math.PI) / 360 + Math.asin(Math.min(1, r / d));
}

export function zoneContains(z: Zone, p: Vec, r: number): boolean {
  const s = z.shape;
  if (s.type === "circle") return dist(p, s.center) <= s.radius + r;
  if (s.type === "cone") return inCone(p, r, s.origin, s.dir, s.range, s.angle);
  const rel = sub(p, s.origin);
  const along = dot(rel, s.dir);
  const across = Math.abs(rel.x * s.dir.y - rel.y * s.dir.x);
  return along >= -r && along <= s.length + r && across <= s.width / 2 + r;
}

/** Enemy units an ability can hit (heroes must be visible; structures excluded). */
function hittable(world: World, caster: HeroUnit, u: Unit): boolean {
  return u.alive && u.team !== caster.team && u.kind !== "tower" && visibleTo(world, caster.team, u);
}

export function tryCast(world: World, h: HeroUnit, slot: number, target: Vec): boolean {
  const st = h.skills[slot]!;
  const def = h.def.skills[slot]!;
  if (!st.unlocked || st.readyAt > world.time || h.status.silenceUntil > world.time || isDisabled(world, h) || h.dash) return false;
  const cost = skillManaCost(world, h, slot);
  if (h.mana < cost) return false;
  const rank = slot === 2 ? h.ultRank : 1;
  const mods = skillMods(h, slot);
  const mult = mods.reduce((m, x) => m * (x.damageMult ?? 1), 1);
  const rangeAdd = mods.reduce((s, x) => s + (x.rangeAdd ?? 0), 0);
  const effects = skillEffects(def, mods);
  const dir = norm(sub(target, h.pos), h.facing);
  const c = def.cast;

  const applyTo = (u: Unit, origin: Vec) => {
    for (const e of effects) applyEffect(world, h, u, e, rank, mult, origin);
  };

  switch (c.type) {
    case "projectile": {
      const range = c.range + rangeAdd;
      world.projectiles.push({
        id: world.nextId++, ownerId: h.id, team: h.team, pos: { ...h.pos }, dir, speed: c.speed, remaining: range, width: c.width,
        targetId: null, explodeRadius: c.explodeRadius ?? 0, color: h.def.color,
        hit: (w, first, at) => {
          if (c.explodeRadius) {
            for (const u of w.units) if (hittable(w, h, u) && dist(u.pos, at) <= c.explodeRadius + u.radius) applyTo(u, at);
          } else applyTo(first, at);
        },
      });
      break;
    }
    case "line":
    case "cone": {
      const shape =
        c.type === "line"
          ? { type: "line" as const, origin: { ...h.pos }, dir, length: c.length + rangeAdd, width: c.width }
          : { type: "cone" as const, origin: { ...h.pos }, dir, range: c.range + rangeAdd, angle: c.angle };
      addZone(world, h, shape, c.delay, 0, 0, false, (w, z) => {
        for (const u of w.units) if (hittable(w, h, u) && zoneContains(z, u.pos, u.radius)) applyTo(u, z.shape.type === "circle" ? z.shape.center : h.pos);
      });
      break;
    }
    case "circle":
    case "selfCircle": {
      const radius = c.radius + (c.type === "selfCircle" ? rangeAdd : 0);
      const center =
        c.type === "circle"
          ? add(h.pos, scale(dir, Math.min(dist(target, h.pos), c.castRange + rangeAdd)))
          : { ...h.pos };
      const healing = effects.some((e) => e.type === "heal" || e.type === "shield" || e.type === "buff");
      addZone(world, h, { type: "circle", center, radius }, c.delay, c.duration ?? 0, c.tick ?? 0, c.type === "selfCircle", (w, z) => {
        const ctr = z.shape.type === "circle" ? z.shape.center : h.pos;
        for (const u of w.units) {
          if (!u.alive || u.kind === "tower" || dist(u.pos, ctr) > radius + u.radius) continue;
          if (u.team === h.team ? healing && (u.kind === "hero") : hittable(w, h, u)) applyTo(u, ctr);
        }
      });
      break;
    }
    case "dash": {
      h.dash = { dir, remaining: c.distance + rangeAdd, speed: c.speed, skill: { ...def, effects }, slot, hit: new Set(), stopAtHero: c.stopAtHero ?? false };
      h.attack.windupEnd = 0;
      break;
    }
    case "targetEnemy": {
      const range = c.range + rangeAdd;
      const t = pickEnemyHeroNear(world, h, target, range);
      if (!t) return false;
      if (c.dashTo) h.pos = resolveWalls(world.nav, clampMap(world, add(t.pos, scale(norm(sub(h.pos, t.pos)), t.radius + h.radius))), h.radius);
      applyTo(t, h.pos);
      break;
    }
    case "targetAlly": {
      const allies = heroes(world).filter((a) => a.alive && a.team === h.team && dist(a.pos, h.pos) <= c.range + rangeAdd);
      allies.sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp);
      const t = allies[0];
      if (!t) return false;
      applyTo(t, h.pos);
      break;
    }
    case "self":
      applyTo(h, h.pos);
      break;
  }
  h.mana -= cost;
  st.readyAt = world.time + skillCooldown(world, h, slot);
  h.facing = dir;
  h.recallEnd = 0;
  pushEvent(world, { type: "cast", heroId: h.id, slot });
  return true;
}

/** Enemy hero to lock on: closest to the aimed point, within range of the caster. */
function pickEnemyHeroNear(world: World, h: HeroUnit, aim: Vec, range: number): HeroUnit | undefined {
  let best: HeroUnit | undefined;
  let bestD = Infinity;
  for (const e of heroes(world)) {
    if (!e.alive || e.team === h.team || !visibleTo(world, h.team, e) || dist(e.pos, h.pos) > range + e.radius) continue;
    const d = dist(e.pos, aim);
    if (d < bestD) [best, bestD] = [e, d];
  }
  return best;
}

function addZone(world: World, owner: HeroUnit, shape: Zone["shape"], delay: number, duration: number, tick: number, follow: boolean, apply: Zone["apply"]): void {
  const t = world.time;
  world.zones.push({
    id: world.nextId++, ownerId: owner.id, team: owner.team, shape, follow, createdAt: t, triggerAt: t + delay,
    endsAt: t + delay + duration, tick, nextTickAt: t + delay, apply, color: owner.def.color, hostile: true,
  });
}

// ---------------------------------------------------------------- basic attacks

/** ML lock-on priority: lowest-HP% visible enemy hero in range, else the closest attackable unit. */
/** Basic attacks need a clear line when walls block shots. */
export function lineOfSight(world: World, a: Vec, b: Vec): boolean {
  return !world.content.rules.wallsBlockShots || segmentClear(world.nav, a, b, 0.1);
}

export function pickAttackTarget(world: World, h: HeroUnit, extra = 0): Unit | undefined {
  const range = h.stats.range + extra;
  let best: Unit | undefined;
  let bestKey = Infinity;
  for (const u of world.units) {
    if (!u.alive || u.team === h.team || !isTargetable(world, u) || !visibleTo(world, h.team, u) || !lineOfSight(world, h.pos, u.pos)) continue;
    const d = dist(u.pos, h.pos) - u.radius - h.radius;
    if (d > range) continue;
    const key = u.kind === "hero" ? u.hp / u.maxHp - 10 : d;
    if (key < bestKey) [best, bestKey] = [u, key];
  }
  return best;
}

function heroAttack(world: World, h: HeroUnit, target: Unit): void {
  const rules = world.content.rules;
  h.attack.count++;
  const boosted = h.attack.count % rules.boostedEvery === 0;
  pushEvent(world, { type: "attack", heroId: h.id, targetId: target.id, boosted });
  const crit = h.stats.critChance > 0 && world.rng() < h.stats.critChance;
  const hit = (w: World, t: Unit) => {
    dealDamage(w, h, t, h.stats.physicalAttack * (crit ? 2 : 1), "physical", "attack");
    const onHit = itemEffect(w, h, "onHit");
    if (onHit && t.alive) {
      dealDamage(w, h, t, onHit.damage, onHit.damageType);
      if (t.kind !== "tower") t.status.slows.push({ pct: onHit.slowPct, until: w.time + onHit.slowDuration });
    }
    const thunder = itemEffect(w, h, "thunder");
    if (thunder && t.alive && t.kind !== "tower" && passiveReady(w, h, "thunder", thunder.cooldown)) {
      dealDamage(w, h, t, evaluate(thunder.amount, formulaCtx(h, 1, t)), thunder.damageType);
      t.status.slows.push({ pct: thunder.slowPct, until: w.time + thunder.slowDuration });
    }
    if (boosted) for (const e of h.def.boosted.effects) applyEffect(w, h, t, e, 1, 1, h.pos);
    if (h.orangeUntil > w.time && t.kind === "hero" && h.orangeReadyAt <= w.time) {
      const b = w.content.units.buffs.orange;
      const tough = ROLE_TOUGH.includes(h.def.role);
      dealDamage(w, h, t, b.base + (tough ? b.ratioTough : b.ratioSquishy) * h.stats.physicalAttack, "true");
      t.status.slows.push({ pct: tough ? b.slowTough : b.slowSquishy, until: w.time + 1 });
      h.orangeReadyAt = w.time + b.cooldown;
    }
  };
  if (h.def.attackType === "melee") hit(world, target);
  else {
    world.projectiles.push({
      id: world.nextId++, ownerId: h.id, team: h.team, pos: { ...h.pos }, dir: norm(sub(target.pos, h.pos)), speed: h.def.projectileSpeed ?? 12,
      remaining: Infinity, width: 0, targetId: target.id, explodeRadius: 0, color: boosted ? "#fff3a0" : h.def.color,
      hit: (w, t) => hit(w, t),
    });
  }
}

// ---------------------------------------------------------------- hero step

function stepHero(world: World, h: HeroUnit, cmd: Command | undefined): void {
  const rules = world.content.rules;
  const t = world.time;
  if (!h.alive) {
    if (t >= h.respawnAt) {
      h.alive = true;
      h.pos = v(world.content.map.fountains[h.team as Team]);
      h.hp = h.maxHp;
      h.mana = h.maxMana;
      h.attack = { targetId: null, windupEnd: 0, nextAt: 0, count: 0 };
    }
    return;
  }
  // Expire timed buffs.
  const nBuffs = h.status.buffs.length;
  h.status.buffs = h.status.buffs.filter((b) => b.until > t);
  h.status.slows = h.status.slows.filter((s) => s.until > t);
  if (h.status.buffs.length !== nBuffs || (h.purpleUntil > 0 && h.purpleUntil <= t && h.purpleUntil > t - world.dt)) refreshStats(world, h);

  // Regeneration (HP only out of combat) and fountain.
  if (t >= h.combatUntil) h.hp = Math.min(h.maxHp, h.hp + h.stats.hpRegen * world.dt);
  h.mana = Math.min(h.maxMana, h.mana + h.stats.manaRegen * world.dt);
  periodicPassives(world, h);
  giveXp(world, h, rules.xp.passivePerSec * world.dt);
  giveGold(world, h, rules.gold.passivePerSec * world.dt);
  const fountain = v(world.content.map.fountains[h.team as Team]);
  if (dist(h.pos, fountain) <= rules.fountain.radius) {
    const perSec = rules.fountain.healPct / rules.fountain.interval;
    h.hp = Math.min(h.maxHp, h.hp + h.maxHp * perSec * world.dt);
    h.mana = Math.min(h.maxMana, h.mana + h.maxMana * perSec * world.dt);
  }

  if (cmd?.choose && h.pendingChoices.length > 0) {
    const slot = h.pendingChoices.shift()!;
    h.skills[slot]!.choice = cmd.choose;
  }

  // Dash in progress.
  if (h.dash) {
    const d = h.dash;
    const stepLen = Math.min(d.speed * world.dt, d.remaining);
    const from = h.pos;
    const moved = moveUntilWall(world.nav, h.pos, d.dir, stepLen, h.radius);
    h.pos = clampMap(world, moved.pos);
    d.remaining = moved.blocked ? 0 : d.remaining - stepLen;
    for (const u of world.units) {
      if (!hittable(world, h, u) || d.hit.has(u.id)) continue;
      if (distToSegment(u.pos, from, h.pos) <= u.radius + h.radius) {
        d.hit.add(u.id);
        for (const e of d.skill.effects) applyEffect(world, h, u, e, 1, skillMods(h, d.slot).reduce((m, x) => m * (x.damageMult ?? 1), 1), h.pos);
        if (d.stopAtHero && u.kind === "hero") d.remaining = 0;
      }
    }
    if (d.remaining <= 1e-6) h.dash = null;
    return;
  }
  if (isDisabled(world, h)) return;

  // Recall.
  if (h.recallEnd > 0 && t >= h.recallEnd) {
    h.pos = { ...fountain };
    h.recallEnd = 0;
  }

  if (cmd?.spell && h.spell.readyAt <= t) castSpell(world, h, cmd.spell.target);
  if (cmd?.cast) {
    if (tryCast(world, h, cmd.cast.slot, cmd.cast.target)) return;
  }
  if (cmd?.recall && h.recallEnd === 0) h.recallEnd = t + rules.recall;

  const moving = !!cmd?.move && (cmd.move.x !== 0 || cmd.move.y !== 0);
  const move = () => {
    h.recallEnd = 0;
    h.attack.windupEnd = 0;
    const dir = norm(cmd!.move!);
    h.facing = dir;
    h.pos = clampMap(world, add(h.pos, scale(dir, moveSpeedOf(world, h) * world.dt)));
  };

  // Basic attack (ML attack button): while held, it takes precedence over movement
  // as long as there is a target in range or close enough to chase.
  if (cmd?.attack) {
    let target = unitById(world, h.attack.targetId);
    const inRange = (u: Unit) => dist(u.pos, h.pos) - u.radius - h.radius <= h.stats.range;
    const chaseable = (u: Unit) => dist(u.pos, h.pos) - u.radius - h.radius <= h.stats.range + 3;
    if (!target || !target.alive || !isTargetable(world, target) || !visibleTo(world, h.team, target) || !chaseable(target) || !lineOfSight(world, h.pos, target.pos)) {
      target = pickAttackTarget(world, h) ?? pickAttackTarget(world, h, 3);
      h.attack.targetId = target?.id ?? null;
    } else if (!inRange(target)) {
      // A closer target in range wins over chasing the locked one, except a locked hero.
      const near = pickAttackTarget(world, h);
      if (near && (target.kind !== "hero" || near.kind === "hero")) {
        target = near;
        h.attack.targetId = near.id;
      }
    }
    if (target) {
      h.recallEnd = 0;
      if (!inRange(target)) {
        // Steering wins over chasing: the player keeps control of where the hero goes.
        if (moving) {
          if (!isRooted(world, h)) move();
          return;
        }
        if (!isRooted(world, h)) h.pos = clampMap(world, add(h.pos, scale(norm(sub(target.pos, h.pos)), moveSpeedOf(world, h) * world.dt)));
        h.attack.windupEnd = 0;
        return;
      }
      // Kiting (ML): between two attacks the hero moves; it only stands still during the wind-up.
      if (moving && h.attack.windupEnd === 0 && h.attack.nextAt > t) {
        if (!isRooted(world, h)) move();
        return;
      }
      h.facing = norm(sub(target.pos, h.pos), h.facing);
      const interval = 1 / h.stats.attackSpeed;
      if (h.attack.windupEnd === 0 && h.attack.nextAt <= t) h.attack.windupEnd = t + interval * rules.windupFraction;
      if (h.attack.windupEnd > 0 && t >= h.attack.windupEnd) {
        h.attack.windupEnd = 0;
        h.attack.nextAt = t + interval * (1 - rules.windupFraction);
        heroAttack(world, h, target);
      }
      return;
    }
  }
  h.attack.windupEnd = 0;
  if (moving && !isRooted(world, h)) move();
}

/** Item passives on a timer: mana surge, burning aura. */
function periodicPassives(world: World, h: HeroUnit): void {
  const surge = itemEffect(world, h, "manaSurge");
  if (surge && h.maxMana > 0 && h.mana < h.maxMana && passiveReady(world, h, "manaSurge", surge.interval)) {
    h.mana = Math.min(h.maxMana, h.mana + h.maxMana * surge.manaPct);
  }
  const burn = itemEffect(world, h, "burn");
  if (burn && passiveReady(world, h, "burn", burn.interval)) {
    for (const u of world.units) {
      if (u.alive && hittable(world, h, u) && dist(u.pos, h.pos) <= burn.radius + u.radius) dealDamage(world, h, u, h.maxHp * burn.maxHpPct * burn.interval, "magic");
    }
  }
}

function castSpell(world: World, h: HeroUnit, target: Vec): void {
  const s = h.spell.def;
  switch (s.id) {
    case "flicker": {
      const dir = norm(sub(target, h.pos), h.facing);
      h.pos = resolveWalls(world.nav, clampMap(world, add(h.pos, scale(dir, Math.min(s.distance, dist(target, h.pos) || s.distance)))), h.radius);
      h.dash = null;
      break;
    }
    case "retribution": {
      let best: Unit | undefined;
      for (const u of world.units) {
        if (!u.alive || u.team === h.team || (u.kind !== "monster" && u.kind !== "minion")) continue;
        if (dist(u.pos, h.pos) > 4 + u.radius) continue;
        if (!best || dist(u.pos, target) < dist(best.pos, target)) best = u;
      }
      if (!best) return;
      dealDamage(world, h, best, evaluate(s.damage, formulaCtx(h, 1)), "true");
      break;
    }
    case "purify":
      h.status.slows = [];
      h.status.stunUntil = h.status.rootUntil = h.status.silenceUntil = h.status.airborneUntil = 0;
      break;
    case "aegis":
      h.status.shields.push({ amount: evaluate(s.shield, formulaCtx(h, 1)), until: world.time + s.duration });
      break;
  }
  h.spell.readyAt = world.time + s.cooldown;
}

// ---------------------------------------------------------------- minions

function spawnWave(world: World): void {
  const m = world.content.units.minions;
  const min = minutes(world);
  const growth = 1 + m.growthPctPerMin * min;
  for (const team of [0, 1] as Team[]) {
    world.lanes.forEach((_, li) => {
      const enemyInnerDown = world.units.some((u) => u.kind === "tower" && u.team !== team && u.tier === "inner" && u.lane === li && !u.alive);
      // ML side lanes: one footman, one ranged, one cannon per wave.
      const kinds: MinionKind[] = ["melee", "ranged", "cannon"];
      if (enemyInnerDown) kinds.push("super");
      kinds.forEach((k, i) => spawnMinion(world, team, li, k, growth, i * 0.8));
    });
  }
  world.waveCount++;
}

function spawnMinion(world: World, team: Team, lane: number, type: MinionKind, growth: number, offset: number): MinionUnit {
  const m = world.content.units.minions;
  const d = type === "lord" ? null : m.types[type];
  const path = lanePathFor(world, lane, team);
  const start = pointAlong(path, 2 - offset);
  const min = minutes(world);
  const lo = world.content.units.lord;
  const hp = d ? d.hp * growth : grow(lo.summoned.hp, min);
  const u: MinionUnit = {
    id: world.nextId++,
    kind: "minion",
    type,
    team,
    lane,
    waypoint: 1,
    pos: start,
    radius: type === "lord" ? 1.4 : type === "cannon" || type === "super" ? 0.55 : 0.4,
    hp,
    maxHp: hp,
    alive: true,
    status: emptyStatus(),
    damagedBy: new Map(),
    attack: d ? d.attack * growth : grow(lo.summoned.attack, min),
    attackSpeed: d ? d.attackSpeed : 1,
    range: d ? d.range : lo.summoned.range,
    speed: d ? d.speed : lo.summoned.speed,
    defense: d ? d.defense : lo.defense,
    nextAttackAt: 0,
    targetId: null,
    goldValue: d ? d.gold.base + d.gold.perMin * min : 0,
    xpValue: d ? d.xp : 0,
    aggroHeroId: null,
  };
  world.units.push(u);
  return u;
}

function summonLord(world: World, team: Team): void {
  // Push the lane where the enemy has the most structures standing (its strongest lane).
  let best = 1;
  let bestScore = -1;
  world.lanes.forEach((_, li) => {
    const score = world.units.filter((u) => u.kind === "tower" && u.alive && u.team !== team && u.lane === li).reduce((s, u) => s + u.hp, 0);
    if (score > bestScore) [best, bestScore] = [li, score];
  });
  spawnMinion(world, team, best, "lord", 1, 0);
}

function stepAttacker(world: World, u: MinionUnit | MonsterUnit | TowerUnit, target: Unit, damage: number, type: DamageType, interval: number): void {
  if (world.time < u.nextAttackAt) return;
  u.nextAttackAt = world.time + interval;
  dealDamage(world, u, target, damage, type);
}

function stepMinion(world: World, m: MinionUnit): void {
  if (isDisabled(world, m)) return;
  m.status.slows = m.status.slows.filter((s) => s.until > world.time);
  const acquire = 4.5;
  let target = unitById(world, m.targetId);
  const aggroHero = unitById(world, m.aggroHeroId);
  if (aggroHero?.alive && visibleTo(world, m.team, aggroHero) && dist(aggroHero.pos, m.pos) <= acquire) target = aggroHero;
  else m.aggroHeroId = null;
  const valid = (u: Unit | undefined): u is Unit =>
    !!u && u.alive && u.team !== m.team && u.team !== 2 && isTargetable(world, u) && visibleTo(world, m.team, u) && dist(u.pos, m.pos) <= acquire + u.radius;
  if (!valid(target)) {
    target = undefined;
    let bestD = Infinity;
    for (const u of world.units) {
      if (!valid(u)) continue;
      // Minions prefer minions and structures; heroes only when nothing else is near.
      const d = dist(u.pos, m.pos) + (u.kind === "hero" ? 3 : 0);
      if (d < bestD) [target, bestD] = [u, d];
    }
  }
  m.targetId = target?.id ?? null;
  if (target) {
    const reach = m.range + m.radius + target.radius;
    if (dist(target.pos, m.pos) > reach) {
      if (!isRooted(world, m)) m.pos = add(m.pos, scale(norm(sub(target.pos, m.pos)), moveSpeedOf(world, m) * world.dt));
    } else {
      const type: DamageType = m.type === "lord" ? "true" : "physical";
      stepAttacker(world, m, target, m.attack, type, 1 / m.attackSpeed);
    }
    return;
  }
  // March along the lane.
  const path = lanePathFor(world, m.lane, m.team as Team);
  const wp = path[Math.min(m.waypoint, path.length - 1)]!;
  if (dist(wp, m.pos) < 0.5 && m.waypoint < path.length - 1) m.waypoint++;
  if (!isRooted(world, m)) m.pos = add(m.pos, scale(norm(sub(wp, m.pos)), moveSpeedOf(world, m) * world.dt));
}

/** Light separation so minions do not stack on one point. */
function separateMinions(world: World): void {
  const ms = world.units.filter((u): u is MinionUnit => u.kind === "minion" && u.alive);
  for (let i = 0; i < ms.length; i++) {
    for (let j = i + 1; j < ms.length; j++) {
      const a = ms[i]!;
      const b = ms[j]!;
      const d = dist(a.pos, b.pos);
      const min = a.radius + b.radius;
      if (d >= min || d === 0) continue;
      const push = scale(norm(sub(a.pos, b.pos)), (min - d) / 2);
      a.pos = add(a.pos, push);
      b.pos = sub(b.pos, push);
    }
  }
}

// ---------------------------------------------------------------- towers

function stepTower(world: World, tw: TowerUnit): void {
  const def = world.content.units.towers;
  const tierDef = def[tw.tier];
  if (tierDef.regenPer5s && world.time >= tw.regenAt) {
    tw.hp = Math.min(tw.maxHp, tw.hp + tierDef.regenPer5s);
    tw.regenAt = world.time + 5;
  }
  const inRange = (u: Unit | undefined): u is Unit =>
    !!u && u.alive && u.team !== tw.team && u.team !== 2 && dist(u.pos, tw.pos) <= def.range + u.radius && visibleTo(world, tw.team, u);
  let target = unitById(world, tw.targetId);
  if (!inRange(target)) {
    target = undefined;
    // Summoned Lord first, then minions (closest), then heroes.
    let bestKey = Infinity;
    for (const u of world.units) {
      if (!inRange(u)) continue;
      const key = (u.kind === "minion" && u.type === "lord" ? 0 : u.kind === "minion" ? 100 : 1000) + dist(u.pos, tw.pos);
      if (key < bestKey) [target, bestKey] = [u, key];
    }
  }
  tw.targetId = target?.id ?? null;
  if (!target || world.time < tw.nextAttackAt) return;
  tw.nextAttackAt = world.time + def.attackInterval;
  let damage = grow(tierDef.damage, minutes(world));
  if (target.kind === "hero") {
    const r = tw.ramp;
    if (r.targetId !== target.id || world.time - r.lastShot > def.rampReset) r.hits = 0;
    damage *= Math.min(def.rampCap, 1 + def.rampPerHit * r.hits);
    r.targetId = target.id;
    r.hits++;
    r.lastShot = world.time;
  }
  dealDamage(world, tw, target, damage, "true");
}

// ---------------------------------------------------------------- monsters

function spawnCamp(world: World, campId: string, side: Team): void {
  const def = world.content.units.camps.find((c) => c.id === campId)!;
  const pos = world.content.map.camps.find((c) => c.id === campId)!.pos;
  const home = side === 0 ? v(pos) : mirror(v(pos), world.content.map.size);
  const min = minutes(world);
  addMonster(world, "camp", campId, def.name, home, grow(def.hp, min), grow(def.attack, min), grow(def.defense, min), def.radius, side);
}

function addMonster(world: World, monster: MonsterUnit["monster"], campId: string, name: string, home: Vec, hp: number, attack: number, defense: number, radius: number, jungleOf: Side): void {
  world.units.push({
    id: world.nextId++, kind: "monster", monster, campId, name, team: 2, pos: { ...home }, home, radius, hp, maxHp: hp, alive: true,
    status: emptyStatus(), damagedBy: new Map(), attack, defense, nextAttackAt: 0, targetId: null, jungleOf,
  });
}

function stepMonster(world: World, m: MonsterUnit): void {
  m.status.slows = m.status.slows.filter((s) => s.until > world.time);
  const leash = m.monster === "camp" ? 6 : 9;
  let target = unitById(world, m.targetId);
  if (target && (!target.alive || dist(target.pos, m.home) > leash + 2)) {
    m.targetId = null;
    target = undefined;
  }
  if (!target) {
    // Return home and reset (LoL leash rule: heals while walking back).
    if (dist(m.pos, m.home) > 0.2) m.pos = add(m.pos, scale(norm(sub(m.home, m.pos)), 3 * world.dt));
    m.hp = Math.min(m.maxHp, m.hp + m.maxHp * 0.06 * world.dt * 3);
    m.damagedBy.clear();
    return;
  }
  if (isDisabled(world, m)) return;
  const reach = m.radius + target.radius + 1;
  if (dist(target.pos, m.pos) > reach) {
    if (!isRooted(world, m)) m.pos = add(m.pos, scale(norm(sub(target.pos, m.pos)), moveSpeedOf(world, m) * world.dt));
    return;
  }
  stepAttacker(world, m, target, m.attack, m.monster === "lord" ? "true" : "physical", 1);
}

// ---------------------------------------------------------------- timers

function stepTimers(world: World): void {
  const t = world.time;
  const u = world.content.units;
  if (t >= world.nextWaveAt) {
    spawnWave(world);
    world.nextWaveAt += u.minions.interval;
  }
  for (const r of world.campRespawns) if (t >= r.at) spawnCamp(world, r.campId, r.side);
  world.campRespawns = world.campRespawns.filter((r) => t < r.at);
  const min = minutes(world);
  const objectiveAlive = (k: MonsterUnit["monster"]) => world.units.some((x) => x.kind === "monster" && x.monster === k && x.alive);
  if (t >= world.turtle.nextSpawnAt && !objectiveAlive("turtle")) {
    world.turtle.nextSpawnAt = Infinity;
    world.turtle.count++;
    addMonster(world, "turtle", "turtle", "Tortue", v(world.content.map.turtle), grow(u.turtle.hp, min), grow(u.turtle.attack, min), grow(u.turtle.defense, min), u.turtle.radius, 2);
    pushEvent(world, { type: "announce", text: "La Tortue est apparue", team: null });
  }
  if (t >= world.lord.nextSpawnAt && !objectiveAlive("lord")) {
    world.lord.nextSpawnAt = Infinity;
    const lm = Math.min(min, u.lord.growthStopsAt / 60);
    if (objectiveAlive("turtle")) world.units = world.units.filter((x) => !(x.kind === "monster" && x.monster === "turtle"));
    addMonster(world, "lord", "lord", "Seigneur", v(world.content.map.lord), grow(u.lord.hp, lm), grow(u.lord.attack, lm), u.lord.defense, u.lord.radius, 2);
    pushEvent(world, { type: "announce", text: "Le Seigneur est apparu", team: null });
  }
  if (Math.abs(t - world.content.rules.finalStretch) < world.dt / 2) pushEvent(world, { type: "announce", text: "Phase finale !", team: null });
}

// ---------------------------------------------------------------- step

export function step(world: World, commands: Command[]): void {
  if (world.winner !== null) return;
  world.tick++;
  world.time = world.tick * world.dt;
  stepTimers(world);
  computeVision(world);

  const byHero = new Map(commands.map((c) => [c.heroId, c]));
  for (const u of world.units) {
    if (u.kind === "hero") stepHero(world, u, byHero.get(u.id));
  }
  for (const u of world.units) {
    if (!u.alive) continue;
    if (u.kind === "minion") stepMinion(world, u);
    else if (u.kind === "tower") stepTower(world, u);
    else if (u.kind === "monster") stepMonster(world, u);
  }
  separateMinions(world);
  for (const u of world.units) if (u.alive && u.kind !== "tower") u.pos = resolveWalls(world.nav, u.pos, Math.min(u.radius, 0.7));

  // Fountain kills intruders (ML altar: 2 000 raw damage every 0.2 s).
  for (const team of [0, 1] as Team[]) {
    const f = v(world.content.map.fountains[team]);
    for (const u of world.units) {
      if (u.alive && u.kind === "hero" && u.team !== team && dist(u.pos, f) <= world.content.rules.fountain.radius) dealDamage(world, null, u, 2000 * world.dt * 5, "true");
    }
  }

  // Projectiles.
  world.projectiles = world.projectiles.filter((p) => {
    const owner = world.units.find((u) => u.id === p.ownerId);
    if (p.targetId !== null) {
      const t = unitById(world, p.targetId);
      if (!t || !t.alive) return false;
      const to = sub(t.pos, p.pos);
      if (len(to) <= p.speed * world.dt + t.radius) {
        p.hit(world, t, t.pos);
        return false;
      }
      p.dir = norm(to);
      p.pos = add(p.pos, scale(p.dir, p.speed * world.dt));
      // A homing shot whose target slipped behind a hedge hits the hedge.
      return !(world.content.rules.wallsBlockShots && isWallAt(world.nav, p.pos));
    }
    const stepLen = Math.min(p.speed * world.dt, p.remaining);
    const from = p.pos;
    p.pos = add(p.pos, scale(p.dir, stepLen));
    p.remaining -= stepLen;
    if (world.content.rules.wallsBlockShots && isWallAt(world.nav, p.pos)) return false;
    if (owner?.kind === "hero") {
      for (const u of world.units) {
        if (!hittable(world, owner, u)) continue;
        if (distToSegment(u.pos, from, p.pos) <= u.radius + p.width / 2) {
          p.hit(world, u, p.pos);
          return false;
        }
      }
    }
    return p.remaining > 1e-6;
  });

  // Zones.
  world.zones = world.zones.filter((z) => {
    if (world.time < z.triggerAt) return true;
    if (z.follow && z.shape.type === "circle") {
      const o = world.units.find((u) => u.id === z.ownerId);
      if (!o || !o.alive) return false;
      z.shape.center = { ...o.pos };
    }
    if (world.time >= z.nextTickAt) {
      z.apply(world, z);
      z.nextTickAt = z.tick > 0 ? z.nextTickAt + z.tick : Infinity;
    }
    return world.time < z.endsAt || (z.tick > 0 && world.time < z.endsAt);
  });

  // Drop dead non-heroes (heroes respawn).
  world.units = world.units.filter((u) => u.alive || u.kind === "hero" || u.kind === "tower");
}
