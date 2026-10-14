// Online play between friends: deterministic lockstep relayed by a host.
//
// Every player's browser runs the same simulation (same content, seed and picks). The host
// collects each human's input, cuts time into short turns and broadcasts, for each turn, the
// commands of every human hero. Bots are decided locally by every browser, deterministically.
// The simulation only uses + − × ÷ and Math.sqrt (src/sim/math.ts), so all browsers agree.
// Messages stay tiny (well under the 4 KiB room limit): a few numbers per human per turn.

import { createBots, botCommands, type Bots } from "../game/match.ts";
import { createGame, step, type HeroPick } from "../game/engine.ts";
import type { Command, World } from "../game/state.ts";
import type { GameContent } from "../game/types.ts";

/** Ticks per turn: 3 ticks at 20 Hz = one message every 150 ms. */
export const TICKS_PER_TURN = 3;

/** One human's input, as sent over the network (short keys, rounded numbers). */
export interface NetInput {
  /** Movement direction. */
  mv?: [number, number];
  /** Attack held. */
  at?: 1;
  /** Skill cast: slot, target x, target y. */
  c?: [0 | 1 | 2, number, number];
  /** Battle spell target. */
  f?: [number, number];
  /** Recall. */
  rc?: 1;
  /** A/B skill choice. */
  ch?: "A" | "B";
}

/** One turn as broadcast by the host: inputs keyed by hero id, plus a state check now and then. */
export interface Turn {
  n: number;
  i: Record<string, NetInput>;
  /** Hash of the world at the start of this turn (sent every few turns to detect desyncs). */
  h?: number;
}

/** Everything a client needs to build the same match as the host. */
export interface MatchSetup {
  seed: number;
  picks: [HeroPick[], HeroPick[]];
  /** Peer label of the human behind each hero, by team and slot ("" = bot). */
  humans: [string[], string[]];
}

export const q = (v: number) => Math.round(v * 100) / 100;

/** Local command → network input (rounded, so the host and every client apply the same numbers). */
export function toNetInput(cmd: Partial<Command>): NetInput {
  const out: NetInput = {};
  if (cmd.move && (cmd.move.x || cmd.move.y)) out.mv = [q(cmd.move.x), q(cmd.move.y)];
  if (cmd.attack) out.at = 1;
  if (cmd.cast) out.c = [cmd.cast.slot, q(cmd.cast.target.x), q(cmd.cast.target.y)];
  if (cmd.spell) out.f = [q(cmd.spell.target.x), q(cmd.spell.target.y)];
  if (cmd.recall) out.rc = 1;
  if (cmd.choose) out.ch = cmd.choose;
  return out;
}

/** Network input → engine command for one tick of a turn. One-shot actions only on the turn's first tick. */
export function toCommand(heroId: number, inp: NetInput, tickInTurn: number): Command {
  const cmd: Command = { heroId };
  if (inp.mv) cmd.move = { x: inp.mv[0], y: inp.mv[1] };
  if (inp.at) cmd.attack = true;
  if (tickInTurn === 0) {
    if (inp.c) cmd.cast = { slot: inp.c[0], target: { x: inp.c[1], y: inp.c[2] } };
    if (inp.f) cmd.spell = { target: { x: inp.f[0], y: inp.f[1] } };
    if (inp.rc) cmd.recall = true;
    if (inp.ch) cmd.choose = inp.ch;
  }
  return cmd;
}

/** Integer fingerprint of the world: positions (1/100 u), HP and tick. Equal on every browser in sync. */
export function stateHash(world: World): number {
  let h = world.tick | 0;
  for (const u of world.units) {
    h = Math.imul(h ^ u.id, 0x9e3779b1);
    h = Math.imul(h ^ Math.round(u.pos.x * 100), 0x85ebca6b);
    h = Math.imul(h ^ Math.round(u.pos.y * 100), 0xc2b2ae35);
    h = Math.imul(h ^ Math.round(u.hp), 0x27d4eb2f);
  }
  return h >>> 0;
}

/** A match driven by turns: identical on the host and on every client. */
export class LockstepMatch {
  readonly world: World;
  readonly bots: Bots;
  /** Hero ids played by humans (their bots are switched off). */
  readonly humanHeroes: number[];
  private turns = new Map<number, Turn>();
  nextTurn = 0;
  desync = false;

  constructor(content: GameContent, setup: MatchSetup) {
    this.world = createGame(content, setup.picks, setup.seed);
    this.bots = createBots(this.world, setup.seed);
    const heroes = this.world.units.filter((u) => u.kind === "hero");
    this.humanHeroes = [];
    // Heroes are created team by team, slot by slot (engine.createGame): map them to their humans.
    let k = 0;
    for (const team of [0, 1] as const) {
      for (let slot = 0; slot < setup.picks[team].length; slot++) {
        const hero = heroes[k++]!;
        if (setup.humans[team][slot]) {
          this.humanHeroes.push(hero.id);
          this.bots.memory.delete(hero.id);
        }
      }
    }
  }

  /** Hero id of the human behind `peer`, if any. */
  static heroOf(match: LockstepMatch, setup: MatchSetup, peer: string): number | undefined {
    const heroes = match.world.units.filter((u) => u.kind === "hero");
    let k = 0;
    for (const team of [0, 1] as const) {
      for (let slot = 0; slot < setup.picks[team].length; slot++) {
        const hero = heroes[k++]!;
        if (setup.humans[team][slot] === peer) return hero.id;
      }
    }
    return undefined;
  }

  receive(turn: Turn): void {
    if (turn.n >= this.nextTurn) this.turns.set(turn.n, turn);
  }

  /** Turns received but not yet played (a client that lags behind plays several per frame). */
  get buffered(): number {
    let n = 0;
    while (this.turns.has(this.nextTurn + n)) n++;
    return n;
  }

  /** Plays the next turn if it has arrived. Returns false when waiting for the host. */
  playNext(): boolean {
    const turn = this.turns.get(this.nextTurn);
    if (!turn) return false;
    this.turns.delete(this.nextTurn);
    if (turn.h !== undefined && turn.h !== stateHash(this.world)) this.desync = true;
    for (let t = 0; t < TICKS_PER_TURN && this.world.winner === null; t++) {
      const cmds: Command[] = botCommands(this.world, this.bots);
      for (const [id, inp] of Object.entries(turn.i)) cmds.push(toCommand(Number(id), inp, t));
      step(this.world, cmds);
    }
    this.nextTurn++;
    return true;
  }
}
