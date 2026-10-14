// Data contracts for the v1 "mixed copy" (docs/design/rules-v1.md).
// Every gameplay number lives in data/game/*.json; the engine only reads these shapes.

export type Vec2 = [number, number];
export type Team = 0 | 1;
export type Role = "tank" | "fighter" | "assassin" | "mage" | "marksman" | "support";
export type DamageType = "physical" | "magic" | "true";

/** Stats a formula can scale on. */
export type ScalingStat =
  | "physicalAttack"
  | "bonusPhysicalAttack"
  | "magicPower"
  | "maxHp"
  | "targetMaxHp"
  | "targetMissingHp";

/** Unite-style value: base + perLevel × (level − 1) + Σ ratio × stat. Arrays are indexed by ultimate rank. */
export interface Formula {
  base: number | number[];
  perLevel?: number;
  ratios?: { stat: ScalingStat; value: number | number[] }[];
}

export type Effect =
  | { type: "damage"; damageType: DamageType; amount: Formula }
  | { type: "heal"; amount: Formula }
  | { type: "shield"; amount: Formula; duration: number }
  | { type: "slow"; pct: number; duration: number }
  | { type: "stun"; duration: number }
  | { type: "airborne"; duration: number }
  | { type: "root"; duration: number }
  | { type: "silence"; duration: number }
  | { type: "knockback"; distance: number }
  | { type: "pull"; distance: number }
  | { type: "buff"; stat: keyof StatBlock; add: number; duration: number };

export type EffectType = Effect["type"];

/** How a skill reaches its targets. Ranges and sizes in ML units. */
export type Cast =
  | { type: "projectile"; range: number; width: number; speed: number; explodeRadius?: number }
  | { type: "line"; length: number; width: number; delay: number }
  | { type: "cone"; range: number; angle: number; delay: number }
  | { type: "circle"; castRange: number; radius: number; delay: number; duration?: number; tick?: number }
  | { type: "selfCircle"; radius: number; delay: number; duration?: number; tick?: number }
  | { type: "dash"; distance: number; speed: number; stopAtHero?: boolean }
  | { type: "targetEnemy"; range: number; dashTo?: boolean }
  | { type: "targetAlly"; range: number }
  | { type: "self" };

export interface SkillMods {
  damageMult?: number;
  cooldownDelta?: number;
  rangeAdd?: number;
  addEffects?: Effect[];
}

export interface SkillChoice {
  name: string;
  description: string;
  mods: SkillMods;
}

export interface SkillDef {
  id: string;
  name: string;
  /** Seconds; for the ultimate, one value per rank. */
  cooldown: number | number[];
  manaCost: number | number[];
  cast: Cast;
  /** Effects on enemies (damage, CC) and allies (heal, shield, buff): the engine routes them by type. */
  effects: Effect[];
  counterplay: string;
  indicator: string;
  choices?: { A: SkillChoice; B: SkillChoice };
  plus?: { description: string; mods: SkillMods };
}

/** Level 1 and level 15 values (ML); the engine interpolates with Unite's geometric curve. */
export type StatRange = [number, number];

export interface StatBlock {
  hp: number;
  hpRegen: number;
  mana: number;
  manaRegen: number;
  physicalAttack: number;
  magicPower: number;
  physicalDefense: number;
  magicDefense: number;
  attackSpeed: number;
  moveSpeed: number;
  range: number;
  critChance: number;
  cdr: number;
  lifesteal: number;
  physicalPenPct: number;
  magicPenPct: number;
}

export interface HeroDef {
  id: string;
  name: string;
  role: Role;
  /** The ML hero whose kit shape and numbers this one follows. */
  reference: string;
  color: string;
  resource: "mana" | "none";
  attackType: "melee" | "ranged";
  projectileSpeed?: number;
  radius: number;
  stats: {
    hp: StatRange;
    hpRegen: StatRange;
    mana: StatRange;
    manaRegen: StatRange;
    physicalAttack: StatRange;
    physicalDefense: StatRange;
    magicDefense: StatRange;
    attackSpeed: StatRange;
    /** ML speed points (÷100 = units/s). */
    moveSpeed: number;
    range: number;
  };
  boosted: { description: string; effects: Effect[] };
  skills: [SkillDef, SkillDef, SkillDef];
  defaults: { items: [string, string, string]; spell: string };
}

export type ItemStatKey =
  | "hp"
  | "mana"
  | "hpRegen"
  | "manaRegen"
  | "physicalAttack"
  | "magicPower"
  | "physicalDefense"
  | "magicDefense"
  | "attackSpeedPct"
  | "moveSpeed"
  | "moveSpeedPct"
  | "cdr"
  | "critChance"
  | "lifesteal";

export interface ItemTier {
  name: string;
  /** Total ML price of this tier's item. */
  price: number;
  stats: Partial<Record<ItemStatKey, number>>;
  /** The ML item this tier copies. */
  source: string;
}

export interface ItemDef {
  id: string;
  name: string;
  category: "attack" | "magic" | "defense";
  tiers: [ItemTier, ItemTier, ItemTier];
  passive?: string;
}

export type SpellDef =
  | { id: "flicker"; name: string; cooldown: number; distance: number; description: string }
  | { id: "retribution"; name: string; cooldown: number; damage: Formula; description: string }
  | { id: "purify"; name: string; cooldown: number; description: string }
  | { id: "aegis"; name: string; cooldown: number; shield: Formula; duration: number; description: string };

export interface GrowingStat {
  base: number;
  perMin: number;
}

export interface MinionDef {
  hp: number;
  attack: number;
  attackSpeed: number;
  range: number;
  speed: number;
  defense: number;
  gold: GrowingStat;
  xp: number;
}

export interface CampDef {
  id: string;
  name: string;
  hp: GrowingStat;
  attack: GrowingStat;
  defense: GrowingStat;
  spawnAt: number;
  respawn: number;
  gold: number;
  xp: number;
  buff?: "orange" | "purple";
  radius: number;
}

export interface TowerDef {
  hp: number;
  damage: GrowingStat;
  defense: number;
  regenPer5s?: number;
}

export interface UnitsData {
  version: number;
  minions: {
    firstWave: number;
    interval: number;
    growthPctPerMin: number;
    damageVsHeroesAndStructures: number;
    types: { melee: MinionDef; ranged: MinionDef; cannon: MinionDef; super: MinionDef };
  };
  towers: {
    range: number;
    attackInterval: number;
    rampPerHit: number;
    rampCap: number;
    rampReset: number;
    backdoorReduction: number;
    earlyShield: { until: number; reduction: number };
    outer: TowerDef;
    inner: TowerDef;
    base: TowerDef;
  };
  camps: CampDef[];
  buffs: {
    duration: number;
    orange: { cooldown: number; slowTough: number; slowSquishy: number; base: number; ratioTough: number; ratioSquishy: number };
    purple: { cdr: number; manaCostReduction: number };
  };
  turtle: {
    hp: GrowingStat;
    attack: GrowingStat;
    defense: GrowingStat;
    spawnAt: number;
    respawn: number;
    lastSpawnAfterDeathBefore: number;
    goldPerHero: number[];
    xpPerHero: number;
    allyShield: Formula;
    shieldDuration: number;
    radius: number;
  };
  lord: {
    hp: GrowingStat;
    attack: GrowingStat;
    defense: number;
    growthStopsAt: number;
    spawnAt: number;
    respawn: number;
    respawnLate: number;
    lateAfter: number;
    xpPerHero: number;
    summoned: { hp: GrowingStat; attack: GrowingStat; speed: number; range: number };
    radius: number;
  };
}

export interface RulesData {
  version: number;
  tickRate: number;
  teamSize: number;
  xp: {
    perLevelBase: number;
    perLevelStep: number;
    maxLevel: number;
    passivePerSec: number;
    shareRadius: number;
    shareSplit: number[];
    heroKillBase: number;
    heroKillPerLevel: number;
  };
  gold: { passivePerSec: number; kill: number; assist: number; noHeroLastHitShare: number };
  respawn: { base: number; perLevel: number; perMinute: number; max: number };
  defense: { k: number; floor: number };
  caps: { cdr: number; attackSpeed: number };
  growthRatio: number;
  windupFraction: number;
  boostedEvery: number;
  recall: number;
  fountain: { radius: number; healPct: number; interval: number };
  skillSchedule: { skill2: number; ultimate: number; choice1: number; choice2: number; plus1: number; plus2: number; ultRanks: number[] };
  finalStretch: number;
  assistWindow: number;
  combatTimeout: number;
}

export interface MapData {
  version: number;
  size: number;
  bases: [Vec2, Vec2];
  fountains: [Vec2, Vec2];
  /** Lanes as polylines from the blue base to the red base. */
  lanes: { id: "top" | "mid" | "bot"; path: Vec2[] }[];
  /** Tower distances along each lane, from each team's own base. */
  towerDistances: Record<"top" | "mid" | "bot", { inner: number; outer: number }>;
  river: { from: Vec2; to: Vec2; width: number };
  bushes: { center: Vec2; size: Vec2 }[];
  /** Walkable grid, one string per row: "#" wall, "." floor (tools/gen-map.ts). */
  grid?: string[];
  /** Camps for the blue side; red camps are the point mirror. */
  camps: { id: string; pos: Vec2 }[];
  turtle: Vec2;
  lord: Vec2;
}

export interface GameContent {
  rules: RulesData;
  units: UnitsData;
  map: MapData;
  heroes: HeroDef[];
  items: ItemDef[];
  spells: SpellDef[];
}
