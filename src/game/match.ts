// Headless bot-vs-bot matches, for tests and calibration (rules-v1 §12).

import { rng } from "../sim/math.ts";
import { assignRoles, decideBot, type BotMemory } from "./ai.ts";
import { createGame, step, type HeroPick } from "./engine.ts";
import type { Command, HeroUnit, World } from "./state.ts";
import type { GameContent, Team } from "./types.ts";

export function defaultPick(content: GameContent, heroId: string, isPlayer = false): HeroPick {
  const h = content.heroes.find((x) => x.id === heroId);
  if (!h) throw new Error(`héros inconnu ${heroId}`);
  return { heroId, items: h.defaults.items, spell: h.defaults.spell, isPlayer };
}

export interface Bots {
  memory: Map<number, BotMemory>;
}

export function createBots(world: World, seed: number): Bots {
  const random = rng(seed * 31 + 7);
  const memory = new Map<number, BotMemory>();
  for (const team of [0, 1] as Team[]) for (const [id, m] of assignRoles(world, team, random)) memory.set(id, m);
  return { memory };
}

export function botCommands(world: World, bots: Bots, skipHeroId?: number): Command[] {
  const cmds: Command[] = [];
  for (const u of world.units) {
    if (u.kind !== "hero" || u.id === skipHeroId) continue;
    const mem = bots.memory.get(u.id);
    if (mem) cmds.push(decideBot(world, u, mem));
  }
  return cmds;
}

export interface GameResult {
  winner: Team | null;
  duration: number;
  world: World;
}

export function runGame(content: GameContent, picks: [HeroPick[], HeroPick[]], seed: number, maxSeconds = 40 * 60): GameResult {
  const world = createGame(content, picks, seed);
  const bots = createBots(world, seed);
  const maxTicks = maxSeconds * content.rules.tickRate;
  while (world.winner === null && world.tick < maxTicks) {
    step(world, botCommands(world, bots));
    if (world.tick % 200 === 0) world.events.length = 0;
  }
  return { winner: world.winner, duration: world.time, world };
}

export const heroList = (w: World) => w.units.filter((u): u is HeroUnit => u.kind === "hero");
