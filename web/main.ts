// Browser client: pre-match screen, canvas rendering, input, HUD, end screen.
// The simulation runs locally at the rules' tick rate; bots drive every other hero.

import { add, dist, norm, sub, type Vec } from "../src/sim/math.ts";
import { CONTENT } from "../src/game/content.ts";
import { createGame, heroes, inBush, isTargetable, nextUpgrade, step, upgradeCost, visibleTo, visionRadius, type HeroPick } from "../src/game/engine.ts";
import { botCommands, createBots, type Bots } from "../src/game/match.ts";
import type { Command, HeroUnit, Unit, World, Zone } from "../src/game/state.ts";
import type { HeroDef, ItemDef } from "../src/game/types.ts";

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
    <h1>Mythic <span>Mayhem</span></h1>
    <p class="sub">3 contre 3 sur une carte façon Mobile Legends. Toi et 2 bots contre 3 bots. Détruis la base adverse.</p>
    <p class="touch-note">Cette version se joue au clavier et à la souris, sur ordinateur.</p>
    <h2>1. Personnage</h2><div class="grid">${heroCards}</div>
    <h2>2. Trois objets, dans l'ordre (l'or les améliore automatiquement)</h2><div class="grid">${itemCards}</div>
    <h2>3. Sort de combat</h2><div class="grid">${spellCards}</div>
    <button class="play" id="play" ${sel.hero && sel.items.length === 3 ? "" : "disabled"}>Jouer</button>
    <p class="keys"><kbd>Z Q S D</kbd> (ou <kbd>W A S D</kbd>, flèches) se déplacer · <kbd>Espace</kbd> ou clic gauche maintenu : attaquer ·
      <kbd>A</kbd> <kbd>E</kbd> <kbd>R</kbd> (QWERTY : <kbd>Q</kbd> <kbd>E</kbd> <kbd>R</kbd>) compétences vers la souris · <kbd>F</kbd> sort · <kbd>B</kbd> retour à la base · <kbd>1</kbd> <kbd>2</kbd> choix de compétence · <kbd>Tab</kbd> maintenu : tableau des scores</p>
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
let mouse = { x: 0, y: 0, down: false };
const queued: Partial<Command> = {};

addEventListener("keydown", (e) => {
  if (!world) return;
  keys.add(e.code);
  const aim = screenToWorld(mouse.x, mouse.y);
  if (e.code === "KeyQ" || e.code === "Digit7") queued.cast = { slot: 0, target: aim };
  if (e.code === "KeyE") queued.cast = { slot: 1, target: aim };
  if (e.code === "KeyR") queued.cast = { slot: 2, target: aim };
  if (e.code === "KeyF") queued.spell = { target: aim };
  if (e.code === "KeyB") queued.recall = true;
  if (e.code === "Digit1" || e.code === "Numpad1") queued.choose = "A";
  if (e.code === "Digit2" || e.code === "Numpad2") queued.choose = "B";
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab"].includes(e.code)) e.preventDefault();
});
addEventListener("keyup", (e) => keys.delete(e.code));
addEventListener("blur", () => keys.clear());
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
        const name = (h: HeroUnit) => `<span class="${h.team === 0 ? "b" : "r"}">${h.name}${h === player ? " (toi)" : ""}</span>`;
        const helpers = e.assists.length ? ` <span class="small">+${e.assists.length}</span>` : "";
        feed.push({ html: `${k ? name(k) : "Tour / sbires"}${helpers} ⚔ ${name(v)}`, born: performance.now() });
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
  return { x: cam.x + (sx - canvas.width / 2 / devicePixelRatio) / scalePx, y: cam.y + (sy - canvas.height / 2 / devicePixelRatio) / scalePx };
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
  scalePx = Math.max(18, Math.min(30, Math.min(W, H) / 22));
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
  ctx.setTransform(dpr * scalePx, 0, 0, dpr * scalePx, dpr * (W / 2 - cam.x * scalePx), dpr * (H / 2 - cam.y * scalePx));
  drawMap(ctx, w);
  const myTeam = player!.team;
  drawFog(ctx, w, myTeam, W * dpr, H * dpr, [dpr * scalePx, dpr * (W / 2 - cam.x * scalePx), dpr * (H / 2 - cam.y * scalePx)]);

  // Telegraphs under units.
  for (const z of w.zones) drawZone(z, myTeam);

  const visible = w.units.filter((u) => (u.alive || u.kind === "tower") && visibleTo(w, myTeam, u));
  for (const u of visible) if (u.kind === "tower") drawTower(u, myTeam);
  for (const u of visible) if (u.kind === "monster") drawMonster(u, lerpPos(u));
  for (const u of visible) if (u.kind === "minion") drawMinion(u, lerpPos(u));
  for (const u of visible) if (u.kind === "hero") drawHero(u, lerpPos(u), myTeam);
  for (const p of w.projectiles) {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.pos.x, p.pos.y, p.targetId === null ? Math.max(0.22, p.width / 2) : 0.16, 0, Math.PI * 2);
    ctx.fill();
  }
  drawTowerWarning(w);
  drawSwings();
  drawLock(w);
  drawAim();
  drawFloaters();
  drawMinimap(w);
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
  const H = innerHeight / scalePx / 2 + 2;
  const x0 = Math.max(0, Math.floor(cam.x - W));
  const x1 = Math.min(g.size - 1, Math.ceil(cam.x + W));
  const y0 = Math.max(0, Math.floor(cam.y - H));
  const y1 = Math.min(g.size - 1, Math.ceil(cam.y + H));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (!g.walls[y * g.size + x]) continue;
      c.fillStyle = COLORS.hedgeShade;
      c.fillRect(x - 0.02, y + 0.1, 1.04, 0.95);
      c.fillStyle = COLORS.hedge;
      c.fillRect(x - 0.02, y - 0.02, 1.04, 0.9);
      // Highlight on edges that face open ground, so walls read as raised.
      if (y > 0 && !g.walls[(y - 1) * g.size + x]) {
        c.fillStyle = COLORS.hedgeTop;
        c.fillRect(x, y, 1, 0.25);
      }
    }
  }
  // Bushes.
  c.fillStyle = COLORS.bush;
  for (const b of w.bushes) roundRect(c, b.cx - b.hw, b.cy - b.hh, b.hw * 2, b.hh * 2, 0.6);
}

// Fog of war: a soft veil everywhere except around allied heroes, minions and towers.
const fogLayers = new Map<CanvasRenderingContext2D, HTMLCanvasElement>();
function drawFog(c: CanvasRenderingContext2D, w: World, team: number, pw: number, ph: number, [k, ox, oy]: [number, number, number]): void {
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
  f.setTransform(k, 0, 0, k, ox, oy);
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
  const team = teamColor(h.team);
  // Team ring: circle for blue, diamond for red (colour is never the only cue).
  ctx.lineWidth = 0.12;
  ctx.strokeStyle = isMe ? "#ffd84a" : team;
  ctx.beginPath();
  if (h.team === 0) ctx.arc(p.x, p.y, h.radius + 0.22, 0, Math.PI * 2);
  else {
    const r = h.radius + 0.32;
    ctx.moveTo(p.x, p.y - r);
    ctx.lineTo(p.x + r, p.y);
    ctx.lineTo(p.x, p.y + r);
    ctx.lineTo(p.x - r, p.y);
    ctx.closePath();
  }
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
  ctx.font = "bold 0.42px Nunito, system-ui";
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.ink;
  ctx.fillText(`${h.level} ${h.name}`, p.x, p.y - h.radius - 0.9);
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
  ctx.font = "bold 0.36px Nunito, system-ui";
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
    ctx.font = "bold 0.4px Nunito, system-ui";
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
  ctx.font = "bold 0.38px Nunito, system-ui";
  ctx.fillStyle = COLORS.ink;
  ctx.textAlign = "center";
  ctx.fillText(m.name, p.x, p.y + m.radius + 0.55);
}

function drawTower(t: Extract<Unit, { kind: "tower" }>, myTeam: number): void {
  const p = t.pos;
  const r = t.radius;
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
    ctx.font = "bold 0.34px Nunito, system-ui";
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
    ctx.font = "bold 0.5px Nunito, system-ui";
    ctx.lineWidth = 0.08;
    ctx.strokeStyle = "rgba(31,42,68,.7)";
    ctx.strokeText(f.text, f.x, f.y - 1.2 - age);
    ctx.fillStyle = f.color;
    ctx.fillText(f.text, f.x, f.y - 1.2 - age);
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
  drawFog(mctx, w, myTeam, mini.width, mini.height, [k, 0, 0]);
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
  // Camera frame.
  const W = innerWidth / scalePx;
  const H = innerHeight / scalePx;
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
    dead.textContent = `Réapparition dans ${Math.ceil(p.respawnAt - w.time)} s`;
    dead.classList.remove("hidden");
  } else dead.classList.add("hidden");
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
          <td><span class="dot" style="background:${h.def.color}"></span><b>${h.name}</b>${h === player ? " (toi)" : ""}<div class="small">${ROLE_FR[h.def.role]}${state}</div></td>
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
        `<tr><td><span class="dot" style="background:${teamColor(h.team)}"></span>${h.name}${h.isPlayer ? " (toi)" : ""}</td><td>${h.level}</td><td>${h.kills} / ${h.deaths} / ${h.assists}</td><td>${h.cs}</td><td>${Math.round(h.damageToHeroes)}</td><td>${Math.round(h.totalGold)}</td></tr>`,
    )
    .join("");
  const end = $("end");
  end.innerHTML = `<div class="wrap"><h1>${won ? "Victoire !" : "Défaite"}</h1>
    <p class="sub">Partie de ${fmt(w.time)} · éliminations ${w.kills[0]} – ${w.kills[1]}</p>
    <table><tr><th>Héros</th><th>Niveau</th><th>É / M / A</th><th>Derniers coups</th><th>Dégâts aux héros</th><th>Or</th></tr>${rows}</table>
    <button class="play" id="again">Rejouer</button> <button class="play" id="back" style="background:#66708a">Changer de personnage</button></div>`;
  end.classList.remove("hidden");
  $("hud").classList.add("hidden");
  $("again").addEventListener("click", startGame);
  $("back").addEventListener("click", () => {
    end.classList.add("hidden");
    $("menu").classList.remove("hidden");
    world = null;
  });
}

renderMenu();
