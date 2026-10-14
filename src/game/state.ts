// Runtime state of a match. Plain data: the client renders it, the engine steps it.

import type { Vec } from "../sim/math.ts";
import type { NavGrid } from "./nav.ts";
import type { DamageType, GameContent, HeroDef, SkillDef, SpellDef, StatBlock, Team } from "./types.ts";

/** Teams 0 (blue) and 1 (red); 2 = neutral monsters. */
export type Side = Team | 2;

export interface Shield {
  amount: number;
  until: number;
}

export interface Statuses {
  slows: { pct: number; until: number }[];
  stunUntil: number;
  rootUntil: number;
  silenceUntil: number;
  airborneUntil: number;
  shields: Shield[];
  buffs: { stat: keyof StatBlock; add: number; until: number }[];
}

interface UnitBase {
  id: number;
  team: Side;
  pos: Vec;
  radius: number;
  hp: number;
  maxHp: number;
  alive: boolean;
  status: Statuses;
  /** Last time each hero damaged this unit (assists, aggro). */
  damagedBy: Map<number, number>;
}

export interface SkillState {
  unlocked: boolean;
  readyAt: number;
  choice: "A" | "B" | null;
  plus: boolean;
}

export interface HeroUnit extends UnitBase {
  kind: "hero";
  def: HeroDef;
  name: string;
  isPlayer: boolean;
  level: number;
  xp: number;
  gold: number;
  totalGold: number;
  mana: number;
  maxMana: number;
  respawnAt: number;
  skills: [SkillState, SkillState, SkillState];
  ultRank: number;
  /** Skill index (0 or 1) waiting for an A/B choice. */
  pendingChoices: number[];
  items: { id: string; tier: number }[];
  spell: { def: SpellDef; readyAt: number };
  attack: { targetId: number | null; windupEnd: number; nextAt: number; count: number };
  dash: { dir: Vec; remaining: number; speed: number; skill: SkillDef; slot: number; hit: Set<number>; stopAtHero: boolean } | null;
  recallEnd: number;
  facing: Vec;
  orangeUntil: number;
  orangeReadyAt: number;
  purpleUntil: number;
  stats: StatBlock;
  /** Attack from level only (for "bonus attack" ratios). */
  baseAttack: number;
  kills: number;
  deaths: number;
  assists: number;
  damageToHeroes: number;
  lastHitAt: number;
  /** Minions and monsters last-hit (scoreboard). */
  cs: number;
  /** Natural HP regen is paused until then (out-of-combat rule). */
  combatUntil: number;
  /** Seen through bushes until then (attacked from a bush). */
  revealUntil: number;
  /** Kills since last death, and kills chained within the multi-kill window. */
  streak: number;
  multi: { count: number; at: number };
  /** Item passive state. */
  passive: { readyAt: Record<string, number>; huntTargetId: number | null; huntHits: number[]; nextTickAt: number };
  /** Damage taken in the last seconds, for the death recap (cleared on respawn). */
  damageLog: DamageEntry[];
}

export interface DamageEntry {
  t: number;
  source: string;
  sourceTeam: Side | null;
  origin: "attack" | "skill" | "other";
  type: DamageType;
  amount: number;
}

export type MinionKind = "melee" | "ranged" | "cannon" | "super" | "lord";

export interface MinionUnit extends UnitBase {
  kind: "minion";
  type: MinionKind;
  lane: number;
  waypoint: number;
  attack: number;
  attackSpeed: number;
  range: number;
  speed: number;
  defense: number;
  nextAttackAt: number;
  targetId: number | null;
  goldValue: number;
  xpValue: number;
  /** Set when an enemy hero hit an allied hero nearby: minions turn on it (LoL aggro rule). */
  aggroHeroId: number | null;
}

/** Per lane: outer → inner → inhibitor (ML "Base Turret"); then the base itself. */
export type TowerTier = "outer" | "inner" | "inhibitor" | "base";

export interface TowerUnit extends UnitBase {
  kind: "tower";
  tier: TowerTier;
  lane: number | null;
  defense: number;
  nextAttackAt: number;
  targetId: number | null;
  ramp: { targetId: number | null; hits: number; lastShot: number };
  regenAt: number;
}

export type MonsterKind = "camp" | "turtle" | "lord";

export interface MonsterUnit extends UnitBase {
  kind: "monster";
  monster: MonsterKind;
  campId: string;
  name: string;
  home: Vec;
  attack: number;
  defense: number;
  nextAttackAt: number;
  targetId: number | null;
  /** Side whose jungle this camp is in (for display only). */
  jungleOf: Side;
}

export type Unit = HeroUnit | MinionUnit | TowerUnit | MonsterUnit;

export interface Projectile {
  id: number;
  ownerId: number;
  team: Side;
  pos: Vec;
  dir: Vec;
  speed: number;
  remaining: number;
  width: number;
  /** Homing on a unit (basic attacks) instead of a straight skillshot. */
  targetId: number | null;
  hit: (world: World, target: Unit, at: Vec) => void;
  explodeRadius: number;
  color: string;
}

export interface Zone {
  id: number;
  ownerId: number;
  team: Side;
  shape: { type: "circle"; center: Vec; radius: number } | { type: "cone"; origin: Vec; dir: Vec; range: number; angle: number } | { type: "line"; origin: Vec; dir: Vec; length: number; width: number };
  /** Circles that follow their owner. */
  follow: boolean;
  createdAt: number;
  triggerAt: number;
  endsAt: number;
  tick: number;
  nextTickAt: number;
  apply: (world: World, zone: Zone) => void;
  color: string;
  /** Telegraph shown to enemies too (red) or only a soft friendly marker. */
  hostile: boolean;
}

export type GameEvent =
  | { type: "damage"; targetId: number; amount: number; damageType: DamageType; fromHero: boolean; pos: Vec }
  | { type: "heal"; targetId: number; amount: number; pos: Vec }
  | { type: "death"; unitId: number; killerId: number | null; pos: Vec }
  | { type: "heroKill"; killerId: number | null; victimId: number; assists: number[]; bounty: number }
  | { type: "levelUp"; heroId: number; level: number }
  | { type: "item"; heroId: number; itemName: string }
  | { type: "announce"; text: string; team: Side | null; big?: boolean }
  | { type: "towerDown"; team: Side; tier: TowerTier }
  | { type: "cast"; heroId: number; slot: number }
  | { type: "attack"; heroId: number; targetId: number; boosted: boolean };

export interface Command {
  heroId: number;
  /** Desired movement direction; zero or absent = stand still. */
  move?: Vec;
  /** Hold to attack: auto-targets by ML priority. */
  attack?: boolean;
  cast?: { slot: 0 | 1 | 2; target: Vec };
  spell?: { target: Vec };
  recall?: boolean;
  choose?: "A" | "B";
}

export interface World {
  content: GameContent;
  time: number;
  tick: number;
  dt: number;
  rng: () => number;
  nextId: number;
  units: Unit[];
  projectiles: Projectile[];
  zones: Zone[];
  events: GameEvent[];
  winner: Team | null;
  kills: [number, number];
  turtle: { nextSpawnAt: number; count: number; deadAt: number };
  lord: { nextSpawnAt: number };
  campRespawns: { campId: string; side: Team; at: number }[];
  nextWaveAt: number;
  waveCount: number;
  /** Lane paths as Vec, one per lane, from the blue base. */
  lanes: Vec[][];
  bushes: { cx: number; cy: number; hw: number; hh: number }[];
  nav: NavGrid;
  /** Enemy unit ids each team can see this tick (fog of war), rebuilt at the start of every step. */
  vision: [Set<number>, Set<number>];
  /** Per team: structures destroyed, Turtles and Lords taken (scoreboard). */
  objectives: [TeamObjectives, TeamObjectives];
  firstBlood: boolean;
}

export interface TeamObjectives {
  towers: number;
  turtles: number;
  lords: number;
}
