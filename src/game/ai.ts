// Bots for v1: same Commands as a human player. Simple priorities, kit-agnostic
// (reads skill data, never hero ids).

import { add, dist, norm, scale, sub, type Vec } from "../sim/math.ts";
import { isTargetable, lanePathFor, pointAlong, progressAlong, skillManaCost, skillRange, visibleTo } from "./engine.ts";
import { newNavCache, steer, type NavCache } from "./nav.ts";
import type { Command, HeroUnit, MinionUnit, MonsterUnit, TowerUnit, Unit, World } from "./state.ts";
import type { Team } from "./types.ts";

export interface BotMemory {
  role: "lane" | "jungle";
  lane: number;
  retreating: boolean;
  random: () => number;
  nav: NavCache;
}

/** Jungler = the hero carrying Retribution; laners fill mid, bot, top. */
export function assignRoles(world: World, team: Team, random: () => number): Map<number, BotMemory> {
  const mine = world.units.filter((u): u is HeroUnit => u.kind === "hero" && u.team === team);
  const out = new Map<number, BotMemory>();
  const laneOrder = [1, 2, 0];
  let next = 0;
  let jungler = false;
  for (const h of mine) {
    if (!jungler && h.spell.def.id === "retribution") {
      jungler = true;
      out.set(h.id, { role: "jungle", lane: 0, retreating: false, random, nav: newNavCache() });
    } else out.set(h.id, { role: "lane", lane: laneOrder[next++ % 3]!, retreating: false, random, nav: newNavCache() });
  }
  return out;
}

/** Walk toward p, around walls (A* on the map grid, cached per bot). */
const moveTo = (world: World, h: HeroUnit, mem: BotMemory, p: Vec): Vec | undefined => steer(world.nav, h.pos, p, mem.nav, world.time);

function enemyHeroesNear(world: World, h: HeroUnit, r: number): HeroUnit[] {
  return world.units.filter(
    (u): u is HeroUnit => u.kind === "hero" && u.alive && u.team !== h.team && visibleTo(world, h.team, u) && dist(u.pos, h.pos) <= r,
  );
}

function alliesNear(world: World, h: HeroUnit, p: Vec, r: number): number {
  return world.units.filter((u) => u.kind === "hero" && u.alive && u.team === h.team && u.id !== h.id && dist(u.pos, p) <= r).length;
}

/** The enemy tower that would shoot a hero standing at p (no allied minion to take aggro). */
function dangerousTower(world: World, h: HeroUnit, p: Vec): TowerUnit | undefined {
  const range = world.content.units.towers.range;
  return world.units.find((t): t is TowerUnit => {
    if (t.kind !== "tower" || !t.alive || t.team === h.team || dist(t.pos, p) > range + 1) return false;
    const covered = world.units.some((m) => m.kind === "minion" && m.alive && m.team === h.team && dist(m.pos, t.pos) <= range);
    return !covered;
  });
}

function trySkills(world: World, h: HeroUnit, target: Unit, enemiesNear: number): Command["cast"] {
  for (const slot of [2, 0, 1] as const) {
    const st = h.skills[slot];
    if (!st.unlocked || st.readyAt > world.time || h.mana < skillManaCost(world, h, slot)) continue;
    const cast = h.def.skills[slot].cast;
    const d = dist(h.pos, target.pos);
    if (cast.type === "targetAlly") {
      const hurt = world.units.some((u) => u.kind === "hero" && u.alive && u.team === h.team && u.hp / u.maxHp < 0.6 && dist(u.pos, h.pos) <= cast.range);
      if (hurt) return { slot, target: h.pos };
      continue;
    }
    const healing = h.def.skills[slot].effects.some((e) => e.type === "heal");
    if (healing) {
      if (h.hp / h.maxHp < 0.6 || enemiesNear >= 1) return { slot, target: h.pos };
      continue;
    }
    if (d > skillRange(h, slot) * 0.95 + target.radius) continue;
    if (slot === 2 && target.kind === "hero" && target.hp / target.maxHp > 0.7 && enemiesNear < 2) continue;
    // Lead moving targets slightly.
    return { slot, target: target.pos };
  }
  return undefined;
}

export function decideBot(world: World, h: HeroUnit, mem: BotMemory): Command {
  const cmd: Command = { heroId: h.id };
  if (!h.alive) return cmd;
  if (h.pendingChoices.length > 0) cmd.choose = mem.random() < 0.5 ? "A" : "B";
  const fountain: Vec = { x: world.content.map.fountains[h.team as Team][0], y: world.content.map.fountains[h.team as Team][1] };
  const hpRatio = h.hp / h.maxHp;
  const threats = enemyHeroesNear(world, h, 7);

  // Retreat and recall.
  if (hpRatio < 0.28 || (mem.retreating && hpRatio < 0.9)) {
    mem.retreating = true;
    if (dist(h.pos, fountain) < 3) return cmd;
    // Recall only out of reach of anything hostile: any hit cancels it.
    const anyHostile = world.units.some(
      (u) => u.alive && u.team !== h.team && u.kind !== "tower" && dist(u.pos, h.pos) < 6 && (u.kind !== "monster" || u.targetId === h.id),
    );
    const underTower = !!dangerousTower(world, h, h.pos);
    if (!anyHostile && !underTower) {
      if (h.recallEnd === 0) cmd.recall = true;
      return cmd;
    }
    const m = moveTo(world, h, mem, fountain);
    if (m) cmd.move = m;
    if (hpRatio < 0.2 && h.spell.def.id === "flicker" && h.spell.readyAt <= world.time && threats.some((t) => dist(t.pos, h.pos) < 3)) {
      cmd.spell = { target: fountain };
    }
    return cmd;
  }
  mem.retreating = false;
  if (h.recallEnd > 0) return cmd;

  // Fight a nearby enemy hero when it looks favorable.
  const target = threats.sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
  if (target) {
    const theirRatio = target.hp / target.maxHp;
    const allies = alliesNear(world, h, h.pos, 7);
    const favorable = hpRatio >= theirRatio - 0.15 || allies + 1 >= threats.length;
    const guarded = dangerousTower(world, h, target.pos);
    if (favorable && (!guarded || theirRatio < 0.25)) {
      const cast = trySkills(world, h, target, threats.length);
      if (cast) cmd.cast = cast;
      if (h.spell.def.id === "aegis" && hpRatio < 0.4 && h.spell.readyAt <= world.time) cmd.spell = { target: h.pos };
      if (h.spell.def.id === "purify" && h.status.stunUntil > world.time && h.spell.readyAt <= world.time) cmd.spell = { target: h.pos };
      if (dist(target.pos, h.pos) - target.radius - h.radius <= h.stats.range + 3) cmd.attack = true;
      else cmd.move = moveTo(world, h, mem, target.pos);
      return cmd;
    }
    if (!favorable && dist(target.pos, h.pos) < 5) {
      const m = moveTo(world, h, mem, fountain);
      if (m) cmd.move = m;
      return cmd;
    }
  }

  // Objectives: the jungler takes them; laners help when close.
  const objective = world.units.find(
    (u): u is MonsterUnit => u.kind === "monster" && u.alive && u.monster !== "camp" && (u.monster === "turtle" ? h.level >= 4 : h.level >= 8),
  );
  if (objective && threats.length === 0) {
    const d = dist(objective.pos, h.pos);
    const helpers = alliesNear(world, h, objective.pos, 8);
    if ((mem.role === "jungle" && (objective.monster === "turtle" || helpers >= 1)) || (d < 12 && helpers >= 1)) {
      return engageMonster(world, h, objective, cmd, mem);
    }
  }

  if (mem.role === "jungle") return jungle(world, h, cmd, mem);
  return lane(world, h, cmd, mem);
}

function engageMonster(world: World, h: HeroUnit, m: MonsterUnit, cmd: Command, mem: BotMemory): Command {
  if (h.spell.def.id === "retribution" && h.spell.readyAt <= world.time && dist(h.pos, m.pos) < 4) {
    const smite = 520 + 80 * h.level;
    if (m.hp <= smite || m.monster !== "camp") cmd.spell = { target: m.pos };
  }
  if (dist(m.pos, h.pos) - m.radius - h.radius > h.stats.range) {
    cmd.move = moveTo(world, h, mem, m.pos);
    return cmd;
  }
  const cast = trySkills(world, h, m, 0);
  if (cast && h.mana > h.maxMana * 0.4) cmd.cast = cast;
  cmd.attack = true;
  h.attack.targetId = m.id;
  return cmd;
}

function jungle(world: World, h: HeroUnit, cmd: Command, mem: BotMemory): Command {
  const camps = world.units.filter((u): u is MonsterUnit => u.kind === "monster" && u.alive && u.monster === "camp");
  const own = camps.filter((c) => c.jungleOf === h.team);
  const pool = own.length > 0 ? own : camps.filter((c) => enemyHeroesNear(world, h, 10).length === 0);
  pool.sort((a, b) => dist(a.pos, h.pos) - dist(b.pos, h.pos));
  const camp = pool[0];
  if (camp && (h.hp / h.maxHp > 0.5 || camp.targetId === h.id)) return engageMonster(world, h, camp, cmd, mem);
  // No camp up: help the lane with the most enemy pressure (mid by default).
  mem.lane = 1;
  return lane(world, h, cmd, mem);
}

function lane(world: World, h: HeroUnit, cmd: Command, mem: BotMemory): Command {
  const path = lanePathFor(world, mem.lane, h.team);
  const allyMinions = world.units.filter((u): u is MinionUnit => u.kind === "minion" && u.alive && u.team === h.team && u.lane === mem.lane);
  let front = -Infinity;
  for (const m of allyMinions) front = Math.max(front, progressAlong(path, m.pos));
  if (front === -Infinity) {
    // No wave: wait at the frontmost own tower of this lane.
    const towers = world.units.filter((u): u is TowerUnit => u.kind === "tower" && u.alive && u.team === h.team && u.lane === mem.lane);
    front = towers.reduce((m, t) => Math.max(m, progressAlong(path, t.pos)), 4);
  }
  const anchor = pointAlong(path, Math.max(2, front - 1.5));

  // Hit what is in range, unless an uncovered enemy tower would shoot us.
  const target = world.units
    .filter(
      (u) =>
        u.alive && u.team !== h.team && u.team !== 2 && isTargetable(world, u) && visibleTo(world, h.team, u) && dist(u.pos, h.pos) < h.stats.range + 4,
    )
    .sort((a, b) => dist(a.pos, h.pos) - dist(b.pos, h.pos))[0];
  const danger = dangerousTower(world, h, h.pos);
  if (danger && !(target?.kind === "tower" && target.id === danger.id && allyMinions.some((m) => dist(m.pos, danger.pos) < 6))) {
    const back = add(h.pos, scale(norm(sub(h.pos, danger.pos)), 2));
    cmd.move = moveTo(world, h, mem, back);
    return cmd;
  }
  if (target && !dangerousTower(world, h, target.pos)) {
    const minionsNear = world.units.filter((u) => u.kind === "minion" && u.alive && u.team !== h.team && dist(u.pos, target.pos) < 2.5).length;
    if (minionsNear >= 3 && h.mana > h.maxMana * 0.6) {
      const cast = trySkills(world, h, target, 0);
      if (cast && cast.slot !== 2) cmd.cast = cast;
    }
    cmd.attack = true;
    return cmd;
  }
  const m = moveTo(world, h, mem, anchor);
  if (m) cmd.move = m;
  return cmd;
}
