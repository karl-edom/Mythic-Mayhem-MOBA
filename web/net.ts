// Online play in the published page, through the claude.ai `room` capability (no server to host).
// Lobby: a named room "mm-<code>", each player's choices in their presence, the host starts.
// Match: deterministic lockstep (src/net/lockstep.ts). Clients send their input in presence;
// the host turns everyone's input into turns and broadcasts them on the "turn" topic.

import { CONTENT } from "../src/game/content.ts";
import type { HeroPick } from "../src/game/engine.ts";
import type { Command, World } from "../src/game/state.ts";
import { rng } from "../src/sim/math.ts";
import { LockstepMatch, TICKS_PER_TURN, q, stateHash, toNetInput, type MatchSetup, type NetInput, type Turn } from "../src/net/lockstep.ts";

// Minimal shape of the room capability we use (the platform's type definitions are authoritative).
interface Peer {
  peer: string;
  isMe: boolean;
  sameTab: boolean;
  guest: boolean;
  presence: Readonly<Record<string, unknown>>;
}
interface Message {
  peer: string;
  topic: string;
  data?: unknown;
}
interface NamedRoom {
  emit(topic: string, data?: unknown): Promise<void>;
  on(topic: string, fn: (m: Message) => void, onError?: (e: { code: string }) => void): () => void;
  presence(patch: Record<string, unknown>): Promise<void>;
  peers(): readonly Peer[];
  onPeers(fn: (c: { peers: readonly Peer[] }) => void, onError?: (e: { code: string }) => void): () => void;
  connected(): boolean;
  leave(): Promise<void>;
}
export interface RoomApi {
  join(name: string): Promise<NamedRoom>;
}

/** The room capability, or null outside claude.ai (standalone file, signed out, public link). */
export async function getRoom(): Promise<RoomApi | null> {
  const c = (globalThis as { claude?: { use?: (n: string) => Promise<unknown> } }).claude;
  if (!c?.use) return null;
  try {
    return ((await c.use("room")) as RoomApi | null) ?? null;
  } catch {
    return null;
  }
}

export interface MyChoice {
  nick: string;
  team: 0 | 1;
  hero: string;
  items: string[];
  spell: string;
}

export interface LobbyPlayer extends MyChoice {
  peer: string;
  host: boolean;
  isMe: boolean;
  guest: boolean;
}

const str = (v: unknown, max = 24) => (typeof v === "string" ? v.slice(0, max) : "");

/** Reads a peer's lobby presence defensively (anyone can set anything). */
function readPlayer(p: Peer): LobbyPlayer | null {
  const pr = p.presence;
  const hero = str(pr.hero);
  if (!str(pr.nick) || !CONTENT.heroes.some((h) => h.id === hero)) return null;
  const items = Array.isArray(pr.items) ? pr.items.map((i) => str(i)).filter((i) => CONTENT.items.some((x) => x.id === i)).slice(0, 3) : [];
  const spell = CONTENT.spells.some((s) => s.id === pr.spell) ? (pr.spell as string) : "flicker";
  return {
    peer: p.peer,
    nick: str(pr.nick),
    team: pr.team === 1 ? 1 : 0,
    hero,
    items: items.length === 3 ? items : CONTENT.heroes.find((h) => h.id === hero)!.defaults.items,
    spell,
    host: pr.host === true,
    isMe: p.isMe && p.sameTab,
    guest: p.guest,
  };
}

export const newCode = () => Array.from({ length: 5 }, () => "abcdefghjkmnpqrstuvwxyz23456789"[Math.floor(Math.random() * 31)]).join("");

export class Lobby {
  players: LobbyPlayer[] = [];
  started = false;
  error = "";
  private stops: (() => void)[] = [];

  readonly room: NamedRoom;
  readonly code: string;
  readonly isHost: boolean;
  private onChange: () => void;
  private onStart: (setup: MatchSetup, hostPeer: string) => void;

  private constructor(room: NamedRoom, code: string, isHost: boolean, onChange: () => void, onStart: (setup: MatchSetup, hostPeer: string) => void) {
    this.room = room;
    this.code = code;
    this.isHost = isHost;
    this.onChange = onChange;
    this.onStart = onStart;
  }

  static async open(api: RoomApi, code: string, isHost: boolean, me: MyChoice, onChange: () => void, onStart: (s: MatchSetup, hostPeer: string) => void): Promise<Lobby> {
    const room = await api.join(`mm-${code}`);
    const lobby = new Lobby(room, code, isHost, onChange, onStart);
    lobby.stops.push(
      room.onPeers((c) => {
        lobby.players = c.peers.map(readPlayer).filter((p): p is LobbyPlayer => p !== null);
        lobby.onChange();
      }),
      room.on("start", (m) => {
        const host = lobby.players.find((p) => p.peer === m.peer);
        if (lobby.started || !host?.host) return; // only the host starts a game
        lobby.started = true;
        lobby.onStart(m.data as MatchSetup, m.peer);
      }),
    );
    await lobby.update(me);
    return lobby;
  }

  update(me: MyChoice): Promise<void> {
    return this.room.presence({ ...me, items: me.items.slice(0, 3), host: this.isHost });
  }

  /** Host: builds the match (humans in their team, bots fill up) and tells everyone, a few times (messages can drop). */
  async start(): Promise<void> {
    const seed = Math.floor(Math.random() * 1e9);
    const r = rng(seed);
    const picks: [HeroPick[], HeroPick[]] = [[], []];
    const humans: [string[], string[]] = [[], []];
    const size = CONTENT.rules.teamSize;
    for (const team of [0, 1] as const) {
      const mine = this.players.filter((p) => p.team === team).slice(0, size);
      for (const p of mine) {
        picks[team].push({ heroId: p.hero, items: p.items as [string, string, string], spell: p.spell });
        humans[team].push(p.peer);
      }
      const free = CONTENT.heroes.filter((h) => !picks[team].some((x) => x.heroId === h.id));
      while (picks[team].length < size) {
        const h = free.splice(Math.floor(r() * free.length), 1)[0] ?? CONTENT.heroes[0]!;
        picks[team].push({ heroId: h.id, items: h.defaults.items, spell: h.defaults.spell });
        humans[team].push("");
      }
    }
    const setup: MatchSetup = { seed, picks, humans };
    try {
      for (let k = 0; k < 4 && !(k > 0 && !this.room.connected()); k++) {
        await this.room.emit("start", setup);
        await new Promise((res) => setTimeout(res, 700));
      }
    } catch (e) {
      this.error = (e as { code?: string }).code === "not_permitted" ? "Pour héberger une partie, il faut au moins le rôle Contributeur sur cette page." : "Impossible de lancer la partie.";
      this.onChange();
    }
  }

  close(): void {
    for (const s of this.stops) s();
  }
}

/** Input sent by a client: continuous part, plus one-shot actions each with its own counter. */
interface ClientInput {
  mv?: [number, number];
  at?: 1;
  c?: [number, 0 | 1 | 2, number, number];
  f?: [number, number, number];
  rc?: number;
  ch?: [number, "A" | "B"];
}

const TURN_MS = (TICKS_PER_TURN * 1000) / CONTENT.rules.tickRate;

export class OnlineGame {
  readonly match: LockstepMatch;
  readonly myHero: number;
  lastTurnAt = 0;
  hostGone = false;
  private history: Turn[] = [];
  private nextTurnAt = 0;
  private stops: (() => void)[] = [];
  // Host: own input, and last one-shot counters applied per peer.
  private local: NetInput = {};
  private seen = new Map<string, Record<string, number>>();
  // Client: last input sent and one-shot counters.
  private sent = "";
  private counter = 1;
  private oneShots: Pick<ClientInput, "c" | "f" | "rc" | "ch"> = {};
  private waitingSince = 0;

  readonly room: NamedRoom;
  readonly setup: MatchSetup;
  readonly isHost: boolean;
  readonly hostPeer: string;

  constructor(room: NamedRoom, setup: MatchSetup, isHost: boolean, hostPeer: string, myPeer: string) {
    this.room = room;
    this.setup = setup;
    this.isHost = isHost;
    this.hostPeer = hostPeer;
    this.match = new LockstepMatch(CONTENT, setup);
    const hero = LockstepMatch.heroOf(this.match, setup, myPeer);
    if (hero === undefined) throw new Error("pas de héros pour ce joueur");
    this.myHero = hero;
    this.stops.push(
      room.on("turn", (m) => {
        if (m.peer !== hostPeer) return;
        const turns = (m.data as { t?: Turn[] })?.t;
        if (Array.isArray(turns)) for (const t of turns) if (t && typeof t.n === "number" && t.i) this.match.receive(t);
      }),
      room.onPeers((c) => {
        if (!c.peers.some((p) => p.peer === hostPeer)) this.hostGone = true;
      }),
    );
    void room.presence({ inp: null, need: null });
  }

  get world(): World {
    return this.match.world;
  }

  /** This player's command for the coming turn. */
  input(cmd: Command): void {
    const net = toNetInput(cmd);
    if (this.isHost) {
      // Continuous part replaced, one-shot actions kept until the next turn uses them.
      this.local = { ...this.local, mv: net.mv, at: net.at };
      if (!net.mv) delete this.local.mv;
      if (!net.at) delete this.local.at;
      for (const k of ["c", "f", "rc", "ch"] as const) if (net[k] !== undefined) (this.local as Record<string, unknown>)[k] = net[k];
      return;
    }
    if (net.c) this.oneShots.c = [this.counter++, ...net.c];
    if (net.f) this.oneShots.f = [this.counter++, ...net.f];
    if (net.rc) this.oneShots.rc = this.counter++;
    if (net.ch) this.oneShots.ch = [this.counter++, net.ch];
    const inp: ClientInput = { ...(net.mv ? { mv: net.mv } : {}), ...(net.at ? { at: 1 } : {}), ...this.oneShots };
    const text = JSON.stringify(inp);
    if (text !== this.sent) {
      this.sent = text;
      void this.room.presence({ inp }).catch(() => undefined);
    }
  }

  /** Advances the match; `beforeTurn`/`afterTurn` let the page interpolate and read events. */
  update(now: number, beforeTurn: () => void, afterTurn: () => void): void {
    if (this.isHost) this.hostTurns(now, beforeTurn, afterTurn);
    else this.clientTurns(now, beforeTurn, afterTurn);
  }

  private hostTurns(now: number, beforeTurn: () => void, afterTurn: () => void): void {
    if (this.nextTurnAt === 0) this.nextTurnAt = now;
    let played = 0;
    while (now >= this.nextTurnAt && played < 4 && this.world.winner === null) {
      const turn: Turn = { n: this.match.nextTurn, i: this.collectInputs() };
      if (turn.n % 10 === 0) turn.h = stateHash(this.world);
      this.history.push(turn);
      if (this.history.length > 400) this.history.shift();
      // Each message repeats the two previous turns: a dropped message rarely loses a turn.
      void this.room.emit("turn", { t: this.history.slice(-3) }).catch(() => undefined);
      this.match.receive(turn);
      beforeTurn();
      this.match.playNext();
      afterTurn();
      this.lastTurnAt = now;
      this.nextTurnAt += TURN_MS;
      played++;
    }
    if (now - this.nextTurnAt > 1000) this.nextTurnAt = now; // the tab slept: do not rush
    this.resendMissing();
  }

  /** Host: turns asked for by clients that missed them (their presence says `need`). */
  private lastResend = new Map<string, number>();
  private resendMissing(): void {
    const now = performance.now();
    for (const p of this.room.peers()) {
      const need = p.presence.need;
      if (typeof need !== "number" || p.isMe) continue;
      if (now - (this.lastResend.get(p.peer) ?? 0) < 400) continue; // stay well under the room's message budget
      this.lastResend.set(p.peer, now);
      const from = this.history.findIndex((t) => t.n === need);
      if (from >= 0) void this.room.emit("turn", { t: this.history.slice(from, from + 8) }).catch(() => undefined);
    }
  }

  private collectInputs(): Record<string, NetInput> {
    const out: Record<string, NetInput> = {};
    const peers = this.room.peers();
    for (const team of [0, 1] as const) {
      this.setup.humans[team].forEach((peer, slot) => {
        if (!peer) return;
        const hero = LockstepMatch.heroOf(this.match, this.setup, peer)!;
        if (hero === this.myHero) {
          out[hero] = this.local;
          this.local = { ...(this.local.mv ? { mv: this.local.mv } : {}), ...(this.local.at ? { at: 1 as const } : {}) };
          return;
        }
        const inp = peers.find((p) => p.peer === peer)?.presence.inp as ClientInput | undefined;
        out[hero] = inp ? this.fromClient(peer, inp) : {};
        void slot;
      });
    }
    return out;
  }

  /** Validates a client's input (untrusted) and keeps each one-shot action once. */
  private fromClient(peer: string, inp: ClientInput): NetInput {
    const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? q(v) : 0);
    const out: NetInput = {};
    if (Array.isArray(inp.mv)) out.mv = [Math.max(-1, Math.min(1, num(inp.mv[0]))), Math.max(-1, Math.min(1, num(inp.mv[1])))];
    if (inp.at) out.at = 1;
    const seen = this.seen.get(peer) ?? {};
    const fresh = (key: string, k: unknown) => typeof k === "number" && k > (seen[key] ?? 0) && ((seen[key] = k), true);
    if (Array.isArray(inp.c) && fresh("c", inp.c[0]) && [0, 1, 2].includes(inp.c[1] as number)) out.c = [inp.c[1] as 0 | 1 | 2, num(inp.c[2]), num(inp.c[3])];
    if (Array.isArray(inp.f) && fresh("f", inp.f[0])) out.f = [num(inp.f[1]), num(inp.f[2])];
    if (fresh("rc", inp.rc)) out.rc = 1;
    if (Array.isArray(inp.ch) && fresh("ch", inp.ch[0]) && (inp.ch[1] === "A" || inp.ch[1] === "B")) out.ch = inp.ch[1];
    this.seen.set(peer, seen);
    return out;
  }

  private clientTurns(now: number, beforeTurn: () => void, afterTurn: () => void): void {
    // Play what has arrived; catch up faster when far behind.
    const budget = this.match.buffered > 6 ? 10 : 2;
    let played = 0;
    while (played < budget && this.world.winner === null && this.match.buffered > 0) {
      beforeTurn();
      this.match.playNext();
      afterTurn();
      this.lastTurnAt = now;
      played++;
    }
    if (played > 0) {
      if (this.waitingSince !== 0) void this.room.presence({ need: null }).catch(() => undefined);
      this.waitingSince = 0;
    } else if (this.waitingSince === 0) this.waitingSince = now;
    else if (now - this.waitingSince > 600) void this.room.presence({ need: this.match.nextTurn }).catch(() => undefined);
  }

  /** Delay behind the host, for the HUD. */
  get waiting(): boolean {
    return !this.isHost && this.waitingSince !== 0 && performance.now() - this.waitingSince > 600;
  }

  close(): void {
    for (const s of this.stops) s();
    void this.room.leave().catch(() => undefined);
  }
}

export const turnMs = TURN_MS;
