// Browser client: pre-match screen, canvas rendering, input, HUD, end screen.
// The simulation runs locally at the rules' tick rate; bots drive every other hero.

import { add, dist, norm, sub, type Vec } from "../src/sim/math.ts";
import { CONTENT } from "../src/game/content.ts";
import { createGame, heroes, inBush, isTargetable, nextUpgrade, skillManaCost, skillRange, step, upgradeCost, visibleTo, visionRadius, type HeroPick } from "../src/game/engine.ts";
import { botCommands, createBots, type Bots } from "../src/game/match.ts";
import type { Command, HeroUnit, Unit, World, Zone } from "../src/game/state.ts";
import type { HeroDef, ItemDef } from "../src/game/types.ts";
import { getRoom, Lobby, newCode, OnlineGame, turnMs, type MyChoice, type RoomApi } from "./net.ts";
import { stateHash } from "../src/net/lockstep.ts";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const canvas = $<HTMLCanvasElement>("game");
const ctx = canvas.getContext("2d")!;
const mini = $<HTMLCanvasElement>("minimap");
const mctx = mini.getContext("2d")!;

const COLORS = {
  grass: "#bfe6a6",
  jungle: "#acd993",
  lane: "#f3e4b8",
  laneEdge: "#e7d39e",
  river: "#9fd7f3",
  bush: "#5fae57",
  hedge: "#6cbd5a",
  hedgeTop: "#8fd57a",
  hedgeShade: "#57a248",
  blue: "#2f7bf5",
  red: "#f25a3a",
  self: "#4bd16b",
  ink: "#1f2a44",
};
const teamColor = (t: number) => (t === 0 ? COLORS.blue : t === 1 ? COLORS.red : "#8a6a3a");
const ROLE_FR: Record<string, string> = { tank: "Tank", fighter: "Combattant", assassin: "Assassin", mage: "Mage", marksman: "Tireur", support: "Soutien" };

// ---------------------------------------------------------------- pre-match

interface Selection {
  hero: HeroDef | null;
  items: string[];
  spell: string;
}
const sel: Selection = { hero: null, items: [], spell: "flicker" };

function renderMenu(): void {
  const menu = $("menu");
  const heroCards = CONTENT.heroes
    .map(
      (h) => `<button class="card ${sel.hero?.id === h.id ? "sel" : ""}" data-hero="${h.id}">
        <div class="t"><span class="dot" style="background:${h.color}"></span>${h.name}</div>
        <div class="m">${ROLE_FR[h.role]} · inspiré de ${h.reference}</div>
        <div class="m">${h.skills.map((s) => s.name).join(" · ")}</div></button>`,
    )
    .join("");
  const itemCards = CONTENT.items
    .map((it) => {
      const idx = sel.items.indexOf(it.id);
      const last = it.tiers[2];
      const stats = Object.entries(last.stats).map(([k, v]) => statLabel(k, v)).join(", ");
      return `<button class="card ${idx >= 0 ? "sel" : ""}" data-item="${it.id}">
        ${idx >= 0 ? `<span class="order">${idx + 1}</span>` : ""}
        <div class="t">${it.name}</div>
        <div class="m">${it.tiers.map((t) => `${t.name} ${t.price}`).join(" → ")}</div>
        <div class="m">${stats}</div>${it.passive ? `<div class="m"><b>Passif</b> ${it.passive}</div>` : ""}</button>`;
    })
    .join("");
  const spellCards = CONTENT.spells
    .map((s) => `<button class="card ${sel.spell === s.id ? "sel" : ""}" data-spell="${s.id}"><div class="t">${s.name}</div><div class="m">${s.description} Recharge ${s.cooldown} s.</div></button>`)
    .join("");
  menu.innerHTML = `<div class="wrap">
    <h1>Mythic <span>Mayhem</span> · MOBA</h1>
    <p class="sub">3 contre 3 sur une carte façon Mobile Legends. Toi et 2 bots contre 3 bots. Détruis la base adverse.</p>
    <p class="touch-note">Cette version se joue au clavier et à la souris, sur ordinateur.</p>
    <h2>1. Personnage</h2><div class="grid">${heroCards}</div>
    <h2>2. Trois objets, dans l'ordre (l'or les améliore automatiquement)</h2><div class="grid">${itemCards}</div>
    <h2>3. Sort de combat</h2><div class="grid">${spellCards}</div>
    <button class="play" id="play" ${sel.hero && sel.items.length === 3 ? "" : "disabled"}>Jouer contre des bots</button>
    <h2>4. Ou jouer avec des amis</h2><div id="online" class="online"></div>
    <p class="keys"><kbd>Z Q S D</kbd> (ou <kbd>W A S D</kbd>, flèches) se déplacer · <kbd>Espace</kbd> ou clic gauche maintenu : attaquer ·
      <kbd>A</kbd> <kbd>E</kbd> <kbd>R</kbd> (QWERTY : <kbd>Q</kbd> <kbd>E</kbd> <kbd>R</kbd>) compétences : maintenir pour viser à la souris, relâcher pour lancer · <kbd>F</kbd> sort · <kbd>B</kbd> retour à la base · <kbd>1</kbd> <kbd>2</kbd> choix de compétence · <kbd>Tab</kbd> maintenu : tableau des scores</p>
  </div>`;
  menu.querySelectorAll<HTMLElement>("[data-hero]").forEach((b) =>
    b.addEventListener("click", () => {
      sel.hero = CONTENT.heroes.find((h) => h.id === b.dataset.hero) ?? null;
      if (sel.hero) {
        sel.items = [...sel.hero.defaults.items];
        sel.spell = sel.hero.defaults.spell;
      }
      renderMenu();
    }),
  );
  menu.querySelectorAll<HTMLElement>("[data-item]").forEach((b) =>
    b.addEventListener("click", () => {
      const id = b.dataset.item!;
      const i = sel.items.indexOf(id);
      if (i >= 0) sel.items.splice(i, 1);
      else if (sel.items.length < 3) sel.items.push(id);
      renderMenu();
    }),
  );
  menu.querySelectorAll<HTMLElement>("[data-spell]").forEach((b) =>
    b.addEventListener("click", () => {
      sel.spell = b.dataset.spell!;
      renderMenu();
    }),
  );
  $("play").addEventListener("click", startGame);
  renderOnline();
  lobby?.update(myChoice()).catch(() => undefined);
}

function statLabel(k: string, v: number): string {
  const labels: Record<string, string> = {
    hp: "PV", mana: "mana", hpRegen: "régén. PV", manaRegen: "régén. mana", physicalAttack: "attaque", magicPower: "puissance",
    physicalDefense: "déf. phys.", magicDefense: "déf. mag.", attackSpeedPct: "vit. d'attaque", moveSpeed: "vitesse", moveSpeedPct: "vitesse",
    cdr: "recharge", critChance: "critique", lifesteal: "vol de vie",
  };
  const pct = ["attackSpeedPct", "moveSpeedPct", "cdr", "critChance", "lifesteal"].includes(k);
  return `+${pct ? Math.round(v * 100) + " %" : v} ${labels[k] ?? k}`;
}

// ---------------------------------------------------------------- game state

// Test options in the URL: ?vitesse=8 speeds the simulation up, ?auto=1 lets a bot play the player's hero.
const params = new URLSearchParams(location.search);
const SPEED = Math.max(1, Math.min(32, Number(params.get("vitesse")) || 1));
const AUTO = params.get("auto") === "1";

let world: World | null = null;
let bots: Bots | null = null;
let player: HeroUnit | null = null;
/** Online session, when playing with friends. */
let online: OnlineGame | null = null;
/** Nicknames of the humans, by hero id (online). */
const nicks = new Map<number, string>();
const esc = (t: string) => t.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
/** Hero label: name, the player's nickname online, "(toi)" for this player. */
const who = (h: HeroUnit) => `${h.name}${nicks.has(h.id) ? ` · ${esc(nicks.get(h.id)!)}` : ""}${h === player ? " (toi)" : ""}`;
let acc = 0;
let lastFrame = 0;
const prevPos = new Map<number, Vec>();
const floaters: { x: number; y: number; text: string; color: string; born: number }[] = [];
/** Short-lived hit effects: melee slashes and ranged muzzle flashes. */
const swings: { from: Vec; to: Vec; melee: boolean; boosted: boolean; born: number }[] = [];
let toastUntil = 0;
let bannerUntil = 0;
/** Kill feed (top right), newest last. */
const feed: { html: string; born: number }[] = [];
const cam = { x: 0, y: 0 };
let scalePx = 26;
/** Tilted ML camera: the ground is squashed vertically (a range circle is ~0.65× as tall as wide on the match video). */
const TILT = 0.68;
/** Ground point → upright-object space (same scale on both axes, y squashed by the tilt). */
const proj = (p: Vec): Vec => ({ x: p.x, y: p.y * TILT });

function shuffle<T>(a: T[]): T[] {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function startGame(): void {
  if (!sel.hero || sel.items.length !== 3) return;
  const others = shuffle(CONTENT.heroes.filter((h) => h.id !== sel.hero!.id));
  const pick = (h: HeroDef): HeroPick => ({ heroId: h.id, items: h.defaults.items, spell: h.defaults.spell });
  const me: HeroPick = { heroId: sel.hero.id, items: sel.items as [string, string, string], spell: sel.spell, isPlayer: true };
  const blue = [me, pick(others[0]!), pick(others[1]!)];
  const red = [pick(others[2]!), pick(others[3]!), pick(others[4]!)];
  const seed = Math.floor(Math.random() * 1e9);
  online = null;
  nicks.clear();
  world = createGame(CONTENT, [blue, red], seed);
  bots = createBots(world, seed);
  player = heroes(world).find((h) => h.isPlayer)!;
  if (!AUTO) bots.memory.delete(player.id);
  cam.x = player.pos.x;
  cam.y = player.pos.y;
  $("menu").classList.add("hidden");
  $("end").classList.add("hidden");
  $("hud").classList.remove("hidden");
  lastFrame = performance.now();
  acc = 0;
  requestAnimationFrame(frame);
}

// ---------------------------------------------------------------- input

const keys = new Set<string>();
/** Skill keys (physical codes, AZERTY A = KeyQ) and the skill being aimed while its key is held. */
const SKILL_KEYS: Record<string, 0 | 1 | 2> = { KeyQ: 0, Digit7: 0, KeyE: 1, KeyR: 2 };
let aiming: 0 | 1 | 2 | null = null;
let mouse = { x: 0, y: 0, down: false };
const queued: Partial<Command> = {};

addEventListener("keydown", (e) => {
  if (!world) return;
  keys.add(e.code);
  const aim = screenToWorld(mouse.x, mouse.y);
  // ML-style aiming: hold the skill key to see where it lands, release to cast.
  const slot = SKILL_KEYS[e.code];
  if (slot !== undefined && !e.repeat) aiming = slot;
  if (e.code === "KeyF") queued.spell = { target: aim };
  if (e.code === "KeyB") queued.recall = true;
  if (e.code === "Digit1" || e.code === "Numpad1") queued.choose = "A";
  if (e.code === "Digit2" || e.code === "Numpad2") queued.choose = "B";
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab"].includes(e.code)) e.preventDefault();
});
addEventListener("keyup", (e) => {
  keys.delete(e.code);
  const slot = SKILL_KEYS[e.code];
  if (world && slot !== undefined && aiming === slot) {
    queued.cast = { slot, target: screenToWorld(mouse.x, mouse.y) };
    aiming = null;
  }
  if (e.code === "Escape") aiming = null;
});
addEventListener("blur", () => {
  keys.clear();
  aiming = null;
});
canvas.addEventListener("mousemove", (e) => (mouse = { ...mouse, x: e.clientX, y: e.clientY }));
canvas.addEventListener("mousedown", (e) => {
  if (e.button === 0) mouse.down = true;
});
addEventListener("mouseup", () => (mouse.down = false));
canvas.addEventListener("contextmenu", (e) => e.preventDefault());

function playerCommand(): Command {
  const cmd: Command = { heroId: player!.id, ...queued };
  let dx = 0;
  let dy = 0;
  if (keys.has("KeyW") || keys.has("ArrowUp")) dy -= 1;
  if (keys.has("KeyS") || keys.has("ArrowDown")) dy += 1;
  if (keys.has("KeyA") || keys.has("ArrowLeft")) dx -= 1;
  if (keys.has("KeyD") || keys.has("ArrowRight")) dx += 1;
  if (dx || dy) cmd.move = { x: dx, y: dy };
  if (keys.has("Space") || mouse.down) cmd.attack = true;
  for (const k of Object.keys(queued)) delete (queued as Record<string, unknown>)[k];
  return cmd;
}

// ---------------------------------------------------------------- loop

function frame(now: number): void {
  if (!world || !player) return;
  if (online) return onlineFrame(now);
  const dt = world.dt;
  acc += Math.min(0.25, (now - lastFrame) / 1000) * SPEED;
  lastFrame = now;
  while (acc >= dt && world.winner === null) {
    prevPos.clear();
    for (const u of world.units) prevPos.set(u.id, { ...u.pos });
    step(world, AUTO ? botCommands(world, bots!) : [playerCommand(), ...botCommands(world, bots!, player.id)]);
    consumeEvents();
    acc -= dt;
  }
  const alpha = Math.min(1, acc / dt);
  render(alpha);
  updateHud();
  if (world.winner !== null) {
    showEnd();
    return;
  }
  requestAnimationFrame(frame);
}

/** Online: the host's turns drive the simulation; render between turns. */
let warnedDesync = false;
function onlineFrame(now: number): void {
  const g = online!;
  g.input(playerCommand());
  g.update(
    now,
    () => {
      prevPos.clear();
      for (const u of world!.units) prevPos.set(u.id, { ...u.pos });
    },
    consumeEvents,
  );
  render(Math.min(1, (now - g.lastTurnAt) / turnMs));
  updateHud();
  if (g.match.desync && !warnedDesync) {
    warnedDesync = true;
    banner("Partie désynchronisée : relancez une partie", null);
  }
  if (g.hostGone) toast("L'hôte a quitté la partie");
  else if (g.waiting) toast("En attente de l'hôte…");
  if (world!.winner !== null) {
    showEnd();
    return;
  }
  requestAnimationFrame(frame);
}

function consumeEvents(): void {
  const w = world!;
  for (const e of w.events) {
    if (e.type === "damage" && e.amount >= 1) {
      const u = w.units.find((x) => x.id === e.targetId);
      const mine = u === player;
      if (u && (e.fromHero || mine) && (u.kind === "hero" || dist(u.pos, player!.pos) < 14)) {
        const color = e.damageType === "true" ? "#ffffff" : e.damageType === "magic" ? "#c17bff" : mine ? "#ff5a4a" : "#ffd25a";
        floaters.push({ x: e.pos.x, y: e.pos.y, text: String(Math.round(e.amount)), color, born: performance.now() });
      }
    } else if (e.type === "heal" && e.amount > 20) {
      floaters.push({ x: e.pos.x, y: e.pos.y, text: `+${Math.round(e.amount)}`, color: "#4bd16b", born: performance.now() });
    } else if (e.type === "attack") {
      const a = w.units.find((u) => u.id === e.heroId);
      const t = w.units.find((u) => u.id === e.targetId);
      if (a && t && a.kind === "hero" && dist(a.pos, player!.pos) < 16) swings.push({ from: { ...a.pos }, to: { ...t.pos }, melee: a.def.attackType === "melee", boosted: e.boosted, born: performance.now() });
    } else if (e.type === "announce") {
      if (e.big) banner(e.text, e.team);
      else toast(e.text);
    } else if (e.type === "heroKill") {
      const k = heroes(w).find((h) => h.id === e.killerId);
      const v = heroes(w).find((h) => h.id === e.victimId);
      if (v) {
        const name = (h: HeroUnit) => `<span class="${h.team === 0 ? "b" : "r"}">${who(h)}</span>`;
        const helpers = e.assists.length ? ` <span class="small">+${e.assists.length}</span>` : "";
        const bounty = e.bounty > 0 ? ` <span class="small">+${e.bounty} or</span>` : "";
        feed.push({ html: `${k ? name(k) : "Tour / sbires"}${helpers} ⚔ ${name(v)}${bounty}`, born: performance.now() });
        if (feed.length > 5) feed.shift();
      }
    } else if (e.type === "item" && e.heroId === player!.id) toast(`Objet amélioré : ${e.itemName}`);
    else if (e.type === "levelUp" && e.heroId === player!.id) floaters.push({ x: player!.pos.x, y: player!.pos.y - 1, text: `Niveau ${e.level} !`, color: "#b98af0", born: performance.now() });
  }
  w.events.length = 0;
  if (floaters.length > 120) floaters.splice(0, floaters.length - 120);
}

function banner(text: string, team: number | null): void {
  const b = $("banner");
  b.textContent = text;
  b.className = `on ${team === 0 ? "b" : team === 1 ? "r" : "n"}`;
  bannerUntil = performance.now() + 2600;
}

function toast(text: string): void {
  const t = $("toast");
  t.textContent = text;
  t.classList.add("on");
  toastUntil = performance.now() + 2600;
}

// ---------------------------------------------------------------- rendering

function screenToWorld(sx: number, sy: number): Vec {
  return { x: cam.x + (sx - canvas.width / 2 / devicePixelRatio) / scalePx, y: cam.y + (sy - canvas.height / 2 / devicePixelRatio) / (scalePx * TILT) };
}

function render(alpha: number): void {
  const w = world!;
  const dpr = devicePixelRatio || 1;
  const W = innerWidth;
  const H = innerHeight;
  if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
  }
  // ML camera, measured on a match video: about 20 u across the screen and at least 11 u high.
  scalePx = Math.min(W / 20, H / 11);
  const lerpPos = (u: Unit): Vec => {
    const p = prevPos.get(u.id);
    return p ? { x: p.x + (u.pos.x - p.x) * alpha, y: p.y + (u.pos.y - p.y) * alpha } : u.pos;
  };
  const pp = lerpPos(player!);
  cam.x += (pp.x - cam.x) * 0.2;
  cam.y += (pp.y - cam.y) * 0.2;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = COLORS.grass;
  ctx.fillRect(0, 0, W, H);
  const ox = dpr * (W / 2 - cam.x * scalePx);
  const oy = dpr * (H / 2 - cam.y * scalePx * TILT);
  // Ground pass: map, fog, telegraphs, rings and shadows, squashed by the tilt.
  ctx.setTransform(dpr * scalePx, 0, 0, dpr * scalePx * TILT, ox, oy);
  drawMap(ctx, w);
  const myTeam = player!.team;
  drawFog(ctx, w, myTeam, W * dpr, H * dpr, [dpr * scalePx, dpr * scalePx * TILT, ox, oy]);
  for (const z of w.zones) drawZone(z, myTeam);
  const visible = w.units.filter((u) => (u.alive || u.kind === "tower") && visibleTo(w, myTeam, u));
  for (const u of visible) if (u.alive) drawGroundMark(u, lerpPos(u));
  drawTowerWarning(w);
  drawSwings();
  drawLock(w);
  drawAim();
  drawSkillAim(w);

  // Upright pass: units stand on their ground point, drawn back to front.
  ctx.setTransform(dpr * scalePx, 0, 0, dpr * scalePx, ox, oy);
  const order = [...visible].sort((a, b) => lerpPos(a).y - lerpPos(b).y);
  for (const u of order) {
    const p = proj(lerpPos(u));
    if (u.kind === "tower") drawTower(u, p, myTeam);
    else if (u.kind === "monster") drawMonster(u, lift(p, u.radius));
    else if (u.kind === "minion") drawMinion(u, lift(p, u.radius));
    else drawHero(u, lift(p, u.radius), myTeam);
  }
  for (const pr of w.projectiles) {
    const p = lift(proj(pr.pos), 0.6);
    ctx.fillStyle = pr.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, pr.targetId === null ? Math.max(0.22, pr.width / 2) : 0.16, 0, Math.PI * 2);
    ctx.fill();
  }
  drawFloaters();
  drawMinimap(w);
}

/** Body centre of an upright unit: raised above its ground point. */
const lift = (p: Vec, r: number): Vec => ({ x: p.x, y: p.y - r * 0.9 });

/** Under each unit: a soft shadow, and the team ring for heroes (circle blue, diamond red: colour is never the only cue). */
function drawGroundMark(u: Unit, p: Vec): void {
  ctx.fillStyle = "rgba(31,42,68,.18)";
  ctx.beginPath();
  ctx.arc(p.x, p.y, u.radius * 0.95, 0, Math.PI * 2);
  ctx.fill();
  if (u.kind !== "hero") return;
  ctx.lineWidth = 0.12;
  ctx.strokeStyle = u === player ? "#ffd84a" : teamColor(u.team);
  ctx.beginPath();
  if (u.team === 0) ctx.arc(p.x, p.y, u.radius + 0.22, 0, Math.PI * 2);
  else {
    const r = u.radius + 0.32;
    ctx.moveTo(p.x, p.y - r);
    ctx.lineTo(p.x + r, p.y);
    ctx.lineTo(p.x, p.y + r);
    ctx.lineTo(p.x - r, p.y);
    ctx.closePath();
  }
  ctx.stroke();
}

function drawMap(c: CanvasRenderingContext2D, w: World): void {
  const s = w.content.map.size;
  // Floor.
  c.fillStyle = COLORS.jungle;
  c.fillRect(0, 0, s, s);
  // River.
  const r = w.content.map.river;
  c.strokeStyle = COLORS.river;
  c.lineCap = "round";
  c.lineWidth = r.width + 1;
  c.beginPath();
  c.moveTo(r.from[0], r.from[1]);
  c.lineTo(r.to[0], r.to[1]);
  c.stroke();
  // Lanes, as wide as their corridors.
  for (const [width, color] of [[5.4, COLORS.laneEdge], [4.8, COLORS.lane]] as const) {
    c.strokeStyle = color;
    c.lineWidth = width;
    c.lineJoin = "round";
    for (const lane of w.lanes) {
      c.beginPath();
      lane.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
      c.stroke();
    }
  }
  // Fountains.
  w.content.map.fountains.forEach(([x, y], t) => {
    c.fillStyle = t === 0 ? "rgba(47,123,245,.18)" : "rgba(242,90,58,.18)";
    c.beginPath();
    c.arc(x, y, w.content.rules.fountain.radius, 0, Math.PI * 2);
    c.fill();
  });
  // Turtle / Lord pits.
  for (const p of [w.content.map.turtle, w.content.map.lord]) {
    c.fillStyle = "rgba(255,255,255,.25)";
    c.beginPath();
    c.arc(p[0], p[1], 3, 0, Math.PI * 2);
    c.fill();
  }
  // Hedges (walls): only the visible part of the grid.
  const g = w.nav;
  const W = innerWidth / scalePx / 2 + 2;
  const H = innerHeight / (scalePx * TILT) / 2 + 3;
  const x0 = Math.max(0, Math.floor(cam.x - W));
  const x1 = Math.min(g.size - 1, Math.ceil(cam.x + W));
  const y0 = Math.max(0, Math.floor(cam.y - H));
  const y1 = Math.min(g.size - 1, Math.ceil(cam.y + H));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!g.walls[y * g.size + x]) continue;
      // Raised hedge seen from the tilted camera: the top is lifted by HEDGE_H, and the
      // front face shows where the cell below is open ground.
      const HEDGE_H = 0.9;
      if (y + 1 < g.size && !g.walls[(y + 1) * g.size + x]) {
        c.fillStyle = COLORS.hedgeShade;
        c.fillRect(x - 0.02, y + 1 - HEDGE_H, 1.04, HEDGE_H + 0.02);
      }
      c.fillStyle = COLORS.hedge;
      c.fillRect(x - 0.02, y - HEDGE_H - 0.02, 1.04, 1.04);
      if (y > 0 && !g.walls[(y - 1) * g.size + x]) {
        c.fillStyle = COLORS.hedgeTop;
        c.fillRect(x, y - HEDGE_H, 1, 0.3);
      }
    }
  }
  // Bushes.
  c.fillStyle = COLORS.bush;
  for (const b of w.bushes) roundRect(c, b.cx - b.hw, b.cy - b.hh, b.hw * 2, b.hh * 2, 0.6);
}

// Fog of war: a soft veil everywhere except around allied heroes, minions and towers.
const fogLayers = new Map<CanvasRenderingContext2D, HTMLCanvasElement>();
function drawFog(c: CanvasRenderingContext2D, w: World, team: number, pw: number, ph: number, [kx, ky, ox, oy]: [number, number, number, number]): void {
  let layer = fogLayers.get(c);
  if (!layer) fogLayers.set(c, (layer = document.createElement("canvas")));
  if (layer.width !== pw || layer.height !== ph) {
    layer.width = pw;
    layer.height = ph;
  }
  const f = layer.getContext("2d")!;
  f.setTransform(1, 0, 0, 1, 0, 0);
  f.globalCompositeOperation = "source-over";
  f.clearRect(0, 0, pw, ph);
  f.fillStyle = "rgba(48,64,110,.34)";
  f.fillRect(0, 0, pw, ph);
  f.setTransform(kx, 0, 0, ky, ox, oy);
  f.globalCompositeOperation = "destination-out";
  for (const u of w.units) {
    if (!u.alive || u.team !== team) continue;
    const r = visionRadius(w, u);
    if (r <= 0) continue;
    const g = f.createRadialGradient(u.pos.x, u.pos.y, r * 0.8, u.pos.x, u.pos.y, r);
    g.addColorStop(0, "rgba(0,0,0,1)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    f.fillStyle = g;
    f.beginPath();
    f.arc(u.pos.x, u.pos.y, r, 0, Math.PI * 2);
    f.fill();
  }
  c.save();
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.drawImage(layer, 0, 0);
  c.restore();
}

/** World-space font that keeps the same on-screen size whatever the zoom (sizes tuned at 34 px per unit). */
const font = (u: number) => `bold ${(u * 34) / scalePx}px Nunito, system-ui`;

function roundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  c.fill();
}

function hpBar(x: number, y: number, width: number, u: Unit, color: string, segment: number, h = 0.22): void {
  ctx.fillStyle = "rgba(31,42,68,.55)";
  ctx.fillRect(x - width / 2 - 0.04, y - 0.04, width + 0.08, h + 0.08);
  ctx.fillStyle = color;
  ctx.fillRect(x - width / 2, y, (width * Math.max(0, u.hp)) / u.maxHp, h);
  const shield = u.status.shields.reduce((s, sh) => s + sh.amount, 0);
  if (shield > 0) {
    ctx.fillStyle = "rgba(255,255,255,.85)";
    ctx.fillRect(x - width / 2, y - 0.1, Math.min(width, (width * shield) / u.maxHp), 0.08);
  }
  // ML: one tick per 1 000 HP.
  if (segment > 0 && u.maxHp / segment < 40) {
    ctx.fillStyle = "rgba(31,42,68,.6)";
    for (let k = segment; k < u.maxHp; k += segment) ctx.fillRect(x - width / 2 + (width * k) / u.maxHp - 0.015, y, 0.03, h);
  }
}

function drawHero(h: HeroUnit, p: Vec, myTeam: number): void {
  const isMe = h === player;
  // Body outline in team colour (the ground ring also tells teams apart).
  ctx.lineWidth = 0.08;
  ctx.strokeStyle = isMe ? "#ffd84a" : teamColor(h.team);
  ctx.beginPath();
  ctx.arc(p.x, p.y, h.radius + 0.05, 0, Math.PI * 2);
  ctx.stroke();
  if (inBush(world!, h.pos) >= 0) ctx.globalAlpha = 0.6;
  ctx.fillStyle = h.def.color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, h.radius, 0, Math.PI * 2);
  ctx.fill();
  // Facing notch.
  ctx.fillStyle = "rgba(255,255,255,.9)";
  ctx.beginPath();
  ctx.arc(p.x + h.facing.x * h.radius * 0.6, p.y + h.facing.y * h.radius * 0.6, 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  if (h.recallEnd > 0) {
    ctx.strokeStyle = "#7fd0ff";
    ctx.lineWidth = 0.1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, h.radius + 0.5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - (h.recallEnd - world!.time) / world!.content.rules.recall));
    ctx.stroke();
  }
  const barColor = isMe ? COLORS.self : h.team === myTeam ? COLORS.blue : COLORS.red;
  hpBar(p.x, p.y - h.radius - 0.75, 2.2, h, barColor, 1000);
  ctx.font = font(0.42);
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.ink;
  ctx.fillText(`${h.level} ${h.name}`, p.x, p.y - h.radius - 0.9);
  // ML: an eye under the name tells the player they are hidden in a bush.
  if (isMe && inBush(world!, h.pos) >= 0 && h.revealUntil <= world!.time) {
    ctx.font = font(0.34);
    ctx.fillStyle = "#2f7a3a";
    ctx.fillText("👁 caché", p.x, p.y - h.radius - 0.42 + 0.1);
  }
  // Boosted attack counter (Unite): visible to everyone.
  const every = world!.content.rules.boostedEvery;
  for (let i = 0; i < every - 1; i++) {
    ctx.fillStyle = i < h.attack.count % every ? "#ffd84a" : "rgba(31,42,68,.25)";
    ctx.beginPath();
    ctx.arc(p.x - 0.25 + i * 0.5, p.y + h.radius + 0.35, 0.11, 0, Math.PI * 2);
    ctx.fill();
  }
  drawStatusIcons(h, p);
  if (h.orangeUntil > world!.time || h.purpleUntil > world!.time) {
    ctx.strokeStyle = h.orangeUntil > world!.time ? "rgba(255,140,40,.8)" : "rgba(160,90,240,.8)";
    ctx.lineWidth = 0.08;
    ctx.beginPath();
    ctx.arc(p.x, p.y, h.radius + 0.45, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawStatusIcons(u: Unit, p: Vec): void {
  const t = world!.time;
  const icons: string[] = [];
  if (u.status.stunUntil > t) icons.push("✦ étourdi");
  if (u.status.airborneUntil > t) icons.push("↑ en l'air");
  if (u.status.rootUntil > t) icons.push("⌗ immobilisé");
  if (u.status.silenceUntil > t) icons.push("∅ silence");
  if (u.status.slows.some((s) => s.until > t)) icons.push("↓ ralenti");
  if (icons.length === 0) return;
  ctx.font = font(0.36);
  ctx.fillStyle = "#7a3cff";
  ctx.textAlign = "center";
  ctx.fillText(icons.join("  "), p.x, p.y - u.radius - 1.45);
}

function drawMinion(m: Extract<Unit, { kind: "minion" }>, p: Vec): void {
  ctx.fillStyle = teamColor(m.team);
  ctx.globalAlpha = m.type === "lord" ? 1 : 0.85;
  ctx.beginPath();
  if (m.type === "cannon" || m.type === "super" || m.type === "lord") ctx.rect(p.x - m.radius, p.y - m.radius, m.radius * 2, m.radius * 2);
  else ctx.arc(p.x, p.y, m.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  hpBar(p.x, p.y - m.radius - 0.3, m.type === "lord" ? 2.4 : 0.8, m, teamColor(m.team), m.type === "lord" ? 2000 : 0, m.type === "lord" ? 0.22 : 0.12);
  if (m.type === "lord") {
    ctx.font = font(0.4);
    ctx.fillStyle = COLORS.ink;
    ctx.textAlign = "center";
    ctx.fillText("Seigneur allié", p.x, p.y - m.radius - 0.5);
  }
}

function drawMonster(m: Extract<Unit, { kind: "monster" }>, p: Vec): void {
  const fill = m.monster === "lord" ? "#7b4bd6" : m.monster === "turtle" ? "#2fa58c" : m.campId === "orange" ? "#f08c2a" : m.campId === "purple" ? "#9a5cf0" : "#a07a4a";
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(p.x, p.y, m.radius, 0, Math.PI * 2);
  ctx.fill();
  hpBar(p.x, p.y - m.radius - 0.4, m.monster === "camp" ? 1.4 : 3, m, "#c8a04a", m.monster === "camp" ? 1000 : 2000);
  // ML shows monsters' HP as a number above the bar.
  ctx.font = font(0.3);
  ctx.fillStyle = COLORS.ink;
  ctx.textAlign = "center";
  ctx.fillText(String(Math.ceil(m.hp)), p.x, p.y - m.radius - 0.5);
  ctx.font = font(0.38);
  ctx.fillStyle = COLORS.ink;
  ctx.textAlign = "center";
  ctx.fillText(m.name, p.x, p.y + m.radius + 0.55);
}

function drawTower(t: Extract<Unit, { kind: "tower" }>, ground: Vec, myTeam: number): void {
  const r = t.radius;
  // Upright: a pillar from the ground point to the crown.
  const p = { x: ground.x, y: ground.y - r * 1.4 };
  ctx.fillStyle = t.alive ? "rgba(31,42,68,.25)" : "rgba(31,42,68,.12)";
  ctx.fillRect(p.x - r * 0.45, p.y, r * 0.9, r * 1.4);
  ctx.fillStyle = t.alive ? teamColor(t.team) : "rgba(31,42,68,.2)";
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    const x = p.x + Math.cos(a) * r;
    const y = p.y + Math.sin(a) * r;
    if (i) ctx.lineTo(x, y);
    else ctx.moveTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  if (!t.alive) return;
  ctx.fillStyle = "rgba(255,255,255,.85)";
  ctx.beginPath();
  ctx.arc(p.x, p.y, r * 0.4, 0, Math.PI * 2);
  ctx.fill();
  hpBar(p.x, p.y - r - 0.5, t.tier === "base" ? 3.4 : 2.6, t, teamColor(t.team), 1000);
  if (!isTargetable(world!, t) && t.team !== myTeam) {
    ctx.font = font(0.34);
    ctx.fillStyle = COLORS.ink;
    ctx.textAlign = "center";
    ctx.fillText("protégée", p.x, p.y + r + 0.5);
  }
}

/** ML three-colour tower indicator for the player. */
function drawTowerWarning(w: World): void {
  const range = w.content.units.towers.range;
  for (const t of w.units) {
    if (t.kind !== "tower" || !t.alive || t.team === player!.team) continue;
    const d = dist(t.pos, player!.pos);
    if (d > range + 3) continue;
    const targeted = t.targetId === player!.id;
    const color = targeted ? "rgba(240,60,40,.9)" : t.targetId !== null ? "rgba(60,196,90,.9)" : "rgba(242,178,27,.9)";
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.12;
    ctx.setLineDash(targeted ? [] : [0.4, 0.3]);
    ctx.beginPath();
    ctx.arc(t.pos.x, t.pos.y, range, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    if (targeted) {
      ctx.strokeStyle = "rgba(240,60,40,.7)";
      ctx.lineWidth = 0.08;
      ctx.beginPath();
      ctx.moveTo(t.pos.x, t.pos.y);
      ctx.lineTo(player!.pos.x, player!.pos.y);
      ctx.stroke();
    }
  }
}

function drawZone(z: Zone, myTeam: number): void {
  const w = world!;
  const enemy = z.team !== myTeam;
  const pending = w.time < z.triggerAt;
  const progress = pending ? (w.time - z.createdAt) / Math.max(0.01, z.triggerAt - z.createdAt) : 1;
  ctx.fillStyle = enemy ? `rgba(240,70,50,${pending ? 0.18 : 0.28})` : `rgba(47,123,245,${pending ? 0.12 : 0.2})`;
  ctx.strokeStyle = enemy ? "rgba(240,70,50,.9)" : "rgba(47,123,245,.8)";
  ctx.lineWidth = 0.08;
  const s = z.shape;
  ctx.beginPath();
  if (s.type === "circle") ctx.arc(s.center.x, s.center.y, s.radius, 0, Math.PI * 2);
  else if (s.type === "cone") {
    const a = Math.atan2(s.dir.y, s.dir.x);
    const half = (s.angle * Math.PI) / 360;
    ctx.moveTo(s.origin.x, s.origin.y);
    ctx.arc(s.origin.x, s.origin.y, s.range, a - half, a + half);
    ctx.closePath();
  } else {
    const n = { x: -s.dir.y, y: s.dir.x };
    const hw = s.width / 2;
    const a = add(s.origin, { x: n.x * hw, y: n.y * hw });
    const b = add(a, { x: s.dir.x * s.length, y: s.dir.y * s.length });
    const c = sub(b, { x: n.x * s.width, y: n.y * s.width });
    const d = sub(a, { x: n.x * s.width, y: n.y * s.width });
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.lineTo(d.x, d.y);
    ctx.closePath();
  }
  ctx.fill();
  ctx.stroke();
  // Filling telegraph: shows when it lands.
  if (pending && s.type === "circle") {
    ctx.fillStyle = enemy ? "rgba(240,70,50,.25)" : "rgba(47,123,245,.2)";
    ctx.beginPath();
    ctx.arc(s.center.x, s.center.y, s.radius * progress, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSwings(): void {
  const now = performance.now();
  for (let i = swings.length - 1; i >= 0; i--) {
    const sw = swings[i]!;
    const age = (now - sw.born) / 1000;
    if (age > 0.18) {
      swings.splice(i, 1);
      continue;
    }
    const a = 1 - age / 0.18;
    const color = sw.boosted ? `rgba(255,216,74,${a})` : `rgba(255,255,255,${a})`;
    if (sw.melee) {
      const ang = Math.atan2(sw.to.y - sw.from.y, sw.to.x - sw.from.x);
      ctx.strokeStyle = color;
      ctx.lineWidth = sw.boosted ? 0.22 : 0.14;
      ctx.beginPath();
      ctx.arc(sw.from.x, sw.from.y, Math.min(2.2, dist(sw.from, sw.to)), ang - 0.7, ang + 0.7);
      ctx.stroke();
    } else {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(sw.from.x + (sw.to.x - sw.from.x) * 0.12, sw.from.y + (sw.to.y - sw.from.y) * 0.12, sw.boosted ? 0.35 : 0.22, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/** Ring around the target the player's attack is locked on. */
function drawLock(w: World): void {
  const t = w.units.find((u) => u.id === player!.attack.targetId);
  if (!t || !t.alive || !(keys.has("Space") || mouse.down)) return;
  ctx.strokeStyle = "rgba(240,60,40,.9)";
  ctx.lineWidth = 0.1;
  ctx.setLineDash([0.3, 0.2]);
  ctx.beginPath();
  ctx.arc(t.pos.x, t.pos.y, t.radius + 0.35, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawAim(): void {
  const aim = screenToWorld(mouse.x, mouse.y);
  const p = player!;
  if (!p.alive) return;
  const dir = norm(sub(aim, p.pos));
  ctx.strokeStyle = "rgba(31,42,68,.25)";
  ctx.lineWidth = 0.06;
  ctx.setLineDash([0.25, 0.25]);
  ctx.beginPath();
  ctx.arc(p.pos.x, p.pos.y, p.stats.range + p.radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = "rgba(255,216,74,.7)";
  ctx.lineWidth = 0.08;
  ctx.beginPath();
  ctx.moveTo(p.pos.x, p.pos.y);
  ctx.lineTo(p.pos.x + dir.x * 2, p.pos.y + dir.y * 2);
  ctx.stroke();
}

/** Where the held skill will land (ML aiming): blue when castable, grey otherwise. */
function drawSkillAim(w: World): void {
  const h = player!;
  if (aiming === null || !h.alive) return;
  const slot = aiming;
  const st = h.skills[slot];
  const def = h.def.skills[slot]!;
  const ready = st.unlocked && st.readyAt <= w.time && h.mana >= skillManaCost(w, h, slot);
  const fill = ready ? "rgba(47,123,245,.22)" : "rgba(102,112,138,.2)";
  const line = ready ? "rgba(47,123,245,.9)" : "rgba(102,112,138,.8)";
  const aim = screenToWorld(mouse.x, mouse.y);
  const dir = norm(sub(aim, h.pos), h.facing);
  const range = skillRange(h, slot);
  const o = h.pos;
  ctx.fillStyle = fill;
  ctx.strokeStyle = line;
  ctx.lineWidth = 0.08;
  const circle = (c: Vec, r: number, dashed = false) => {
    ctx.setLineDash(dashed ? [0.3, 0.25] : []);
    ctx.beginPath();
    ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
    if (!dashed) ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);
  };
  const band = (length: number, width: number) => {
    const n = { x: -dir.y * (width / 2), y: dir.x * (width / 2) };
    const end = add(o, { x: dir.x * length, y: dir.y * length });
    ctx.beginPath();
    ctx.moveTo(o.x + n.x, o.y + n.y);
    ctx.lineTo(end.x + n.x, end.y + n.y);
    ctx.lineTo(end.x - n.x, end.y - n.y);
    ctx.lineTo(o.x - n.x, o.y - n.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };
  const c = def.cast;
  switch (c.type) {
    case "projectile":
      band(range, Math.max(0.5, c.width));
      break;
    case "line":
      band(range, c.width);
      break;
    case "dash":
      band(range, h.radius * 2);
      break;
    case "cone": {
      const a = Math.atan2(dir.y, dir.x);
      const half = (c.angle * Math.PI) / 360;
      ctx.beginPath();
      ctx.moveTo(o.x, o.y);
      ctx.arc(o.x, o.y, range, a - half, a + half);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;
    }
    case "circle": {
      const reach = range - c.radius;
      circle(o, reach, true);
      const d = Math.min(dist(aim, o), reach);
      circle(add(o, { x: dir.x * d, y: dir.y * d }), c.radius);
      break;
    }
    case "selfCircle":
      circle(o, range);
      break;
    case "targetEnemy":
    case "targetAlly": {
      circle(o, range, true);
      const wantAlly = c.type === "targetAlly";
      let best: Unit | undefined;
      for (const u of heroes(w)) {
        if (!u.alive || (u.team === h.team) !== wantAlly || (wantAlly && u === h) || !visibleTo(w, h.team, u)) continue;
        if (dist(u.pos, o) > range + u.radius) continue;
        if (!best || dist(u.pos, aim) < dist(best.pos, aim)) best = u;
      }
      if (best) circle(best.pos, best.radius + 0.4);
      break;
    }
    case "self":
      circle(o, h.radius + 0.5);
      break;
  }
}

function drawFloaters(): void {
  const now = performance.now();
  ctx.textAlign = "center";
  for (let i = floaters.length - 1; i >= 0; i--) {
    const f = floaters[i]!;
    const age = (now - f.born) / 1000;
    if (age > 1) {
      floaters.splice(i, 1);
      continue;
    }
    ctx.globalAlpha = 1 - age;
    ctx.font = font(0.5);
    ctx.lineWidth = 0.08;
    ctx.strokeStyle = "rgba(31,42,68,.7)";
    const fy = f.y * TILT - 1.6 - age;
    ctx.strokeText(f.text, f.x, fy);
    ctx.fillStyle = f.color;
    ctx.fillText(f.text, f.x, fy);
  }
  ctx.globalAlpha = 1;
}

function drawMinimap(w: World): void {
  const s = w.content.map.size;
  const k = mini.width / s;
  mctx.setTransform(k, 0, 0, k, 0, 0);
  mctx.fillStyle = COLORS.jungle;
  mctx.fillRect(0, 0, s, s);
  mctx.fillStyle = COLORS.hedgeShade;
  for (let y = 0; y < w.nav.size; y++) for (let x = 0; x < w.nav.size; x++) if (w.nav.walls[y * w.nav.size + x]) mctx.fillRect(x, y, 1, 1);
  mctx.strokeStyle = COLORS.river;
  mctx.lineWidth = w.content.map.river.width;
  mctx.beginPath();
  mctx.moveTo(w.content.map.river.from[0], w.content.map.river.from[1]);
  mctx.lineTo(w.content.map.river.to[0], w.content.map.river.to[1]);
  mctx.stroke();
  mctx.strokeStyle = COLORS.lane;
  mctx.lineWidth = 2;
  for (const lane of w.lanes) {
    mctx.beginPath();
    lane.forEach((p, i) => (i ? mctx.lineTo(p.x, p.y) : mctx.moveTo(p.x, p.y)));
    mctx.stroke();
  }
  const myTeam = player!.team;
  drawFog(mctx, w, myTeam, mini.width, mini.height, [k, k, 0, 0]);
  mctx.setTransform(k, 0, 0, k, 0, 0);
  for (const u of w.units) {
    if (!u.alive || !visibleTo(w, myTeam, u)) continue;
    if (u.kind === "minion") {
      mctx.fillStyle = teamColor(u.team);
      mctx.fillRect(u.pos.x - 0.4, u.pos.y - 0.4, 0.8, 0.8);
    } else if (u.kind === "tower") {
      mctx.fillStyle = teamColor(u.team);
      mctx.fillRect(u.pos.x - 0.9, u.pos.y - 0.9, 1.8, 1.8);
    } else if (u.kind === "monster") {
      mctx.fillStyle = u.monster === "camp" ? "#a07a4a" : "#7b4bd6";
      mctx.beginPath();
      mctx.arc(u.pos.x, u.pos.y, u.monster === "camp" ? 0.6 : 1.2, 0, Math.PI * 2);
      mctx.fill();
    }
  }
  for (const h of heroes(w)) {
    if (!h.alive || !visibleTo(w, myTeam, h)) continue;
    mctx.fillStyle = h === player ? "#ffd84a" : teamColor(h.team);
    mctx.beginPath();
    mctx.arc(h.pos.x, h.pos.y, 1.3, 0, Math.PI * 2);
    mctx.fill();
  }
  // Objective and camp timers (ML shows them on the minimap).
  mctx.font = "bold 3.2px Nunito, system-ui";
  mctx.textAlign = "center";
  mctx.textBaseline = "middle";
  const timer = (pos: Vec, at: number, color: string) => {
    if (!Number.isFinite(at) || at <= w.time) return;
    const left = Math.ceil(at - w.time);
    mctx.fillStyle = "rgba(255,255,255,.85)";
    mctx.fillRect(pos.x - 3.4, pos.y - 1.9, 6.8, 3.8);
    mctx.fillStyle = color;
    mctx.fillText(left >= 60 ? `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}` : `${left}`, pos.x, pos.y + 0.2);
  };
  timer({ x: w.content.map.turtle[0], y: w.content.map.turtle[1] }, w.turtle.nextSpawnAt, "#2fa58c");
  timer({ x: w.content.map.lord[0], y: w.content.map.lord[1] }, w.lord.nextSpawnAt, "#7b4bd6");
  for (const r of w.campRespawns) {
    const c = w.content.map.camps.find((x) => x.id === r.campId);
    if (!c) continue;
    const pos = r.side === 0 ? { x: c.pos[0], y: c.pos[1] } : { x: s - c.pos[0], y: s - c.pos[1] };
    timer(pos, r.at, r.campId === "orange" ? "#d9731a" : r.campId === "purple" ? "#7b4bd6" : COLORS.ink);
  }
  mctx.textBaseline = "alphabetic";
  // Camera frame.
  const W = innerWidth / scalePx;
  const H = innerHeight / (scalePx * TILT);
  mctx.strokeStyle = "rgba(31,42,68,.6)";
  mctx.lineWidth = 0.4;
  mctx.strokeRect(cam.x - W / 2, cam.y - H / 2, W, H);
}

// ---------------------------------------------------------------- HUD

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
let lastHud = "";

function updateHud(): void {
  const w = world!;
  const p = player!;
  $("clock").textContent = fmt(w.time);
  $("kb").textContent = String(w.kills[0]);
  $("kr").textContent = String(w.kills[1]);
  const now = performance.now();
  if (now > toastUntil) $("toast").classList.remove("on");
  if (now > bannerUntil) $("banner").classList.remove("on");
  while (feed.length && now - feed[0]!.born > 9000) feed.shift();
  const feedHtml = feed.map((f) => `<div>${f.html}</div>`).join("");
  if ($("feed").dataset.html !== feedHtml) {
    $("feed").innerHTML = feedHtml;
    $("feed").dataset.html = feedHtml;
  }
  updateScoreboard(w);

  const skillKeys = ["A/Q", "E", "R"];
  const skills = p.def.skills
    .map((s, i) => {
      const st = p.skills[i]!;
      const cd = Math.max(0, st.readyAt - w.time);
      const choice = st.choice && s.choices ? ` ${st.choice}` : "";
      return `<div class="sk ${st.unlocked ? "" : "locked"}" title="${s.name}"><span class="k">${skillKeys[i]}</span>${s.name}${choice}${st.plus ? "+" : ""}${
        cd > 0 && st.unlocked ? `<span class="cd">${cd.toFixed(cd < 10 ? 1 : 0)}</span>` : ""
      }</div>`;
    })
    .join("");
  const spellCd = Math.max(0, p.spell.readyAt - w.time);
  const spell = `<div class="sk" title="${p.spell.def.name}"><span class="k">F</span>${p.spell.def.name}${spellCd > 0 ? `<span class="cd">${spellCd.toFixed(0)}</span>` : ""}</div>`;
  const idx = nextUpgrade(p);
  const next = idx >= 0 ? `${itemDef(p.items[idx]!.id).tiers[p.items[idx]!.tier]!.name} (${Math.round(p.gold)} / ${upgradeCost(w, p, idx)})` : "objets complets";
  const items = p.items
    .map((it) => {
      const d = itemDef(it.id);
      const passive = it.tier === 3 && d.effect ? ` <span class="small">· passif actif</span>` : "";
      return `<div class="it" title="${d.passive ?? ""}">${it.tier > 0 ? `<b>${"★".repeat(it.tier)}</b> ${d.tiers[it.tier - 1]!.name}${passive}` : `<span class="small">☆ ${d.name}</span>`}</div>`;
    })
    .join("");
  const xpNeed = w.content.rules.xp.perLevelBase + w.content.rules.xp.perLevelStep * p.level;
  const html = `
    <div class="stat"><div class="name">${p.name} · niveau ${p.level}</div>
      <div class="meter xp"><i style="width:${p.level >= 15 ? 100 : (100 * p.xp) / xpNeed}%"></i></div>
      <div class="meter hp"><i style="width:${(100 * p.hp) / p.maxHp}%"></i></div><div class="small">${Math.round(p.hp)} / ${Math.round(p.maxHp)} PV</div>
      ${p.maxMana > 0 ? `<div class="meter mp"><i style="width:${(100 * p.mana) / p.maxMana}%"></i></div><div class="small">${Math.round(p.mana)} / ${Math.round(p.maxMana)} mana</div>` : ""}
    </div>
    <div class="skills">${skills}${spell}</div>
    <div class="items"><div class="small">Or : <b style="color:var(--gold)">${Math.round(p.gold)}</b> · prochain : ${next}</div>${items}
      <div class="small">Attaque ${Math.round(p.stats.physicalAttack)} · Puissance ${Math.round(p.stats.magicPower)} · Déf. ${Math.round(p.stats.physicalDefense)}/${Math.round(p.stats.magicDefense)}</div></div>`;
  if (html !== lastHud) {
    $("bar").innerHTML = html;
    lastHud = html;
  }

  const choice = $("choice");
  if (p.pendingChoices.length > 0) {
    const slot = p.pendingChoices[0]!;
    const sk = p.def.skills[slot]!;
    if (sk.choices && choice.dataset.slot !== String(slot)) {
      choice.dataset.slot = String(slot);
      choice.innerHTML = (["A", "B"] as const)
        .map((k, i) => `<button class="card" data-c="${k}"><div class="t">${i + 1}. ${sk.choices![k].name}</div><div class="m">${sk.name} : ${sk.choices![k].description}</div></button>`)
        .join("");
      choice.querySelectorAll<HTMLElement>("[data-c]").forEach((b) => b.addEventListener("click", () => (queued.choose = b.dataset.c as "A" | "B")));
    }
    choice.classList.remove("hidden");
  } else {
    choice.classList.add("hidden");
    choice.dataset.slot = "";
  }
  const dead = $("dead");
  if (!p.alive) {
    const html = `<div>Réapparition dans ${Math.ceil(p.respawnAt - w.time)} s</div>${deathRecap(p)}`;
    if (dead.dataset.html !== html) {
      dead.innerHTML = html;
      dead.dataset.html = html;
    }
    dead.classList.remove("hidden");
  } else dead.classList.add("hidden");
}

/** Death recap (LoL, ML): who dealt the damage in the last seconds, attacks vs skills. */
function deathRecap(p: HeroUnit): string {
  const by = new Map<string, { team: number | null; attack: number; skill: number; other: number }>();
  for (const d of p.damageLog) {
    const e = by.get(d.source) ?? { team: d.sourceTeam, attack: 0, skill: 0, other: 0 };
    e[d.origin] += d.amount;
    by.set(d.source, e);
  }
  if (by.size === 0) return "";
  const last = [...p.damageLog].reverse().find((d) => d.source !== "Sbires");
  const rows = [...by.entries()]
    .map(([name, e]) => ({ name, e, total: e.attack + e.skill + e.other }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 4)
    .map(({ name, e, total }) => {
      // Heroes: split attacks and skills; towers, minions and monsters only have a total.
      const parts = e.attack || e.skill ? [e.attack && `attaques ${Math.round(e.attack)}`, e.skill && `compétences ${Math.round(e.skill)}`, e.other && `objets ${Math.round(e.other)}`].filter(Boolean).join(", ") : "";
      return `<div class="recap"><b>${name}</b> ${Math.round(total)} <span>${parts}</span></div>`;
    })
    .join("");
  return `<div class="recap-title">Éliminé par ${last?.source ?? "?"}</div>${rows}`;
}

const itemDef = (id: string): ItemDef => CONTENT.items.find((i) => i.id === id)!;

// ---------------------------------------------------------------- scoreboard (hold Tab)

let lastScore = "";
function updateScoreboard(w: World): void {
  const box = $("score");
  if (!keys.has("Tab")) {
    box.classList.add("hidden");
    return;
  }
  const teamGold = (t: number) => heroes(w).filter((h) => h.team === t).reduce((s, h) => s + h.totalGold, 0);
  const obj = (t: 0 | 1) => {
    const o = w.objectives[t];
    return `<span class="obj">${o.towers} tour${o.towers > 1 ? "s" : ""} · ${o.turtles} Tortue${o.turtles > 1 ? "s" : ""} · ${o.lords} Seigneur${o.lords > 1 ? "s" : ""} · ${(teamGold(t) / 1000).toFixed(1)} k or</span>`;
  };
  const rows = (t: number) =>
    heroes(w)
      .filter((h) => h.team === t)
      .map((h) => {
        const items = h.items
          .map((it) => {
            const d = itemDef(it.id);
            return it.tier > 0 ? `<b>${"★".repeat(it.tier)}</b> ${d.tiers[it.tier - 1]!.name}` : `<span class="small">☆ ${d.name}</span>`;
          })
          .join("<br>");
        const spellCd = Math.max(0, h.spell.readyAt - w.time);
        const state = h.alive ? "" : ` · <b>† ${Math.ceil(h.respawnAt - w.time)} s</b>`;
        return `<tr class="${h === player ? "me" : ""} ${h.alive ? "" : "dead"}">
          <td><span class="dot" style="background:${h.def.color}"></span><b>${who(h)}</b><div class="small">${ROLE_FR[h.def.role]}${state}</div></td>
          <td><span class="lvl">${h.level}</span></td>
          <td><b>${h.kills}</b> / ${h.deaths} / ${h.assists}</td>
          <td>${h.cs}</td>
          <td>${Math.round(h.totalGold)}</td>
          <td>${Math.round(h.damageToHeroes / 100) / 10} k</td>
          <td class="its">${items}</td>
          <td>${h.spell.def.name}${h.team === player!.team && spellCd > 0 ? ` <span class="small">${Math.ceil(spellCd)} s</span>` : ""}</td></tr>`;
      })
      .join("");
  const head = `<tr><th>Héros</th><th>Niv.</th><th>É / M / A</th><th>Derniers coups</th><th>Or</th><th>Dégâts</th><th>Objets</th><th>Sort</th></tr>`;
  const diff = Math.round(teamGold(player!.team) - teamGold(1 - player!.team));
  const html = `<div class="head"><span class="b">Bleus ${w.kills[0]}</span><span>${fmt(w.time)} · écart d'or ${diff >= 0 ? "+" : ""}${diff}</span><span class="r">${w.kills[1]} Rouges</span></div>
    <div>${obj(0)}</div><table class="team-b">${head}${rows(0)}</table>
    <div>${obj(1)}</div><table class="team-r">${head}${rows(1)}</table>`;
  if (html !== lastScore) {
    box.innerHTML = html;
    lastScore = html;
  }
  box.classList.remove("hidden");
}

// ---------------------------------------------------------------- end screen

function showEnd(): void {
  const w = world!;
  const won = w.winner === player!.team;
  const rows = heroes(w)
    .sort((a, b) => a.team - b.team)
    .map(
      (h) =>
        `<tr><td><span class="dot" style="background:${teamColor(h.team)}"></span>${who(h)}</td><td>${h.level}</td><td>${h.kills} / ${h.deaths} / ${h.assists}</td><td>${h.cs}</td><td>${Math.round(h.damageToHeroes)}</td><td>${Math.round(h.totalGold)}</td></tr>`,
    )
    .join("");
  const end = $("end");
  end.innerHTML = `<div class="wrap"><h1>${won ? "Victoire !" : "Défaite"}</h1>
    <p class="sub">Partie de ${fmt(w.time)} · éliminations ${w.kills[0]} – ${w.kills[1]}</p>
    <table><tr><th>Héros</th><th>Niveau</th><th>É / M / A</th><th>Derniers coups</th><th>Dégâts aux héros</th><th>Or</th></tr>${rows}</table>
    <button class="play" id="again">Rejouer</button> <button class="play" id="back" style="background:#66708a">Changer de personnage</button></div>`;
  end.classList.remove("hidden");
  $("hud").classList.add("hidden");
  if (online) {
    online.close();
    online = null;
    lobby = null;
  }
  $("again").addEventListener("click", startGame);
  $("back").addEventListener("click", () => {
    end.classList.add("hidden");
    $("menu").classList.remove("hidden");
    world = null;
  });
}

// ---------------------------------------------------------------- online lobby

let roomApi: RoomApi | null | undefined;
let lobby: Lobby | null = null;
let joinCode = "";
let busy = false;
let nick = (() => {
  try {
    return localStorage.getItem("mm-nick") ?? "";
  } catch {
    return "";
  }
})();
let myTeam: 0 | 1 = 0;

function myChoice(): MyChoice {
  const hero = sel.hero ?? CONTENT.heroes[0]!;
  return { nick: nick || "Joueur", team: myTeam, hero: hero.id, items: sel.items.length === 3 ? sel.items : hero.defaults.items, spell: sel.spell };
}

function renderOnline(): void {
  const box = document.getElementById("online");
  if (!box) return;
  if (roomApi === undefined) {
    box.innerHTML = `<p class="sub">Recherche du mode en ligne…</p>`;
    return;
  }
  if (roomApi === null) {
    box.innerHTML = `<p class="sub">Le jeu entre amis marche dans la page publiée sur claude.ai. Invite tes amis sur la page (bouton Partager) : ils doivent être connectés à Claude. Ici, ce mode n'est pas disponible.</p>`;
    return;
  }
  const nickField = `<label class="field">Pseudo <input id="nick" maxlength="16" value="${esc(nick)}" placeholder="Ton pseudo"></label>`;
  const teamPick = `<span class="field">Équipe <button class="pill ${myTeam === 0 ? "on b" : ""}" data-team="0">Bleus</button><button class="pill ${myTeam === 1 ? "on r" : ""}" data-team="1">Rouges</button></span>`;
  if (!lobby) {
    box.innerHTML = `<div class="row">${nickField}${teamPick}</div>
      <div class="row"><button class="play small-play" id="create" ${sel.hero && !busy ? "" : "disabled"}>Créer une partie</button>
      <span class="field">ou code <input id="code" maxlength="5" value="${esc(joinCode)}" placeholder="abcde" size="6"></span>
      <button class="play small-play alt" id="join" ${sel.hero && !busy ? "" : "disabled"}>Rejoindre</button></div>
      <p class="keys">Choisis d'abord ton personnage, tes objets et ton sort. L'hôte partage le code ; les places vides sont prises par des bots.</p>`;
  } else {
    const list = (team: 0 | 1) =>
      lobby!.players
        .filter((p) => p.team === team)
        .map((p) => `<li>${esc(p.nick)}${p.isMe ? " (toi)" : ""}${p.host ? " · hôte" : ""} — ${CONTENT.heroes.find((h) => h.id === p.hero)?.name ?? ""}</li>`)
        .join("") || "<li class='small'>bots</li>";
    box.innerHTML = `<div class="row">${nickField}${teamPick}</div>
      <p class="code">Code de la partie : <b>${esc(lobby.code)}</b></p>
      <div class="teams"><div><h3 class="b">Bleus</h3><ul>${list(0)}</ul></div><div><h3 class="r">Rouges</h3><ul>${list(1)}</ul></div></div>
      ${lobby.error ? `<p class="touch-note" style="display:block">${esc(lobby.error)}</p>` : ""}
      <div class="row">${lobby.isHost ? `<button class="play small-play" id="launch">Lancer la partie</button>` : `<span class="sub">En attente du lancement par l'hôte…</span>`}
      <button class="play small-play alt" id="leave">Quitter</button></div>`;
  }
  box.querySelector<HTMLInputElement>("#nick")?.addEventListener("input", (e) => {
    nick = (e.target as HTMLInputElement).value.slice(0, 16);
    try {
      localStorage.setItem("mm-nick", nick);
    } catch {
      /* private mode */
    }
    lobby?.update(myChoice()).catch(() => undefined);
  });
  box.querySelector<HTMLInputElement>("#code")?.addEventListener("input", (e) => (joinCode = (e.target as HTMLInputElement).value.toLowerCase().replace(/[^a-z0-9]/g, "")));
  box.querySelectorAll<HTMLElement>("[data-team]").forEach((b) =>
    b.addEventListener("click", () => {
      myTeam = b.dataset.team === "1" ? 1 : 0;
      lobby?.update(myChoice()).catch(() => undefined);
      renderOnline();
    }),
  );
  box.querySelector("#create")?.addEventListener("click", () => void openLobby(newCode(), true));
  box.querySelector("#join")?.addEventListener("click", () => void (joinCode.length >= 3 && openLobby(joinCode, false)));
  box.querySelector("#launch")?.addEventListener("click", () => void lobby?.start());
  box.querySelector("#leave")?.addEventListener("click", () => {
    lobby?.close();
    void lobby?.room.leave();
    lobby = null;
    renderOnline();
  });
}

async function openLobby(code: string, host: boolean): Promise<void> {
  if (!roomApi || busy) return;
  busy = true;
  renderOnline();
  try {
    lobby = await Lobby.open(roomApi, code, host, myChoice(), renderOnline, (setup, hostPeer) => {
      const l = lobby!;
      const me = l.room.peers().find((p) => p.isMe && p.sameTab)?.peer;
      if (!me || ![...setup.humans[0], ...setup.humans[1]].includes(me)) {
        l.error = "La partie a commencé sans toi (équipe pleine ?).";
        renderOnline();
        return;
      }
      startOnline(new OnlineGame(l.room, setup, me === hostPeer, hostPeer, me), l);
    });
  } catch {
    toast("Impossible de rejoindre la partie");
  }
  busy = false;
  renderOnline();
}

function startOnline(g: OnlineGame, l: Lobby): void {
  online = g;
  warnedDesync = false;
  world = g.world;
  bots = g.match.bots;
  player = heroes(world).find((h) => h.id === g.myHero)!;
  nicks.clear();
  const humans = [...g.setup.humans[0], ...g.setup.humans[1]];
  heroes(world).forEach((h, i) => {
    const p = l.players.find((x) => x.peer === humans[i]);
    if (p) nicks.set(h.id, p.nick);
  });
  cam.x = player.pos.x;
  cam.y = player.pos.y;
  $("menu").classList.add("hidden");
  $("end").classList.add("hidden");
  $("hud").classList.remove("hidden");
  requestAnimationFrame(frame);
}

// Test hook: tick and fingerprint of the online match (compared across tabs by the end-to-end test).
(globalThis as Record<string, unknown>).__mmOnline = () => (online ? { tick: world!.tick, hash: stateHash(world!), desync: online.match.desync } : null);

renderMenu();
void getRoom().then((r) => {
  roomApi = r;
  renderOnline();
});
