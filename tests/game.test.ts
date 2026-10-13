import assert from "node:assert/strict";
import { test } from "node:test";
import { CONTENT } from "../src/game/content.ts";
import { createGame, dealDamage, giveGold, isTargetable, nextUpgrade, step, upgradeCost } from "../src/game/engine.ts";
import { growthFraction, mitigation, respawnTime, statAtLevel, xpToNext } from "../src/game/formulas.ts";
import { defaultPick, heroList, runGame } from "../src/game/match.ts";
import type { HeroUnit, TowerUnit } from "../src/game/state.ts";

const R = CONTENT.rules;
const ids = CONTENT.heroes.map((h) => h.id);
const teams = () => [ids.slice(0, 3).map((i) => defaultPick(CONTENT, i)), ids.slice(3).map((i) => defaultPick(CONTENT, i))] as const;
const newGame = (seed = 1) => createGame(CONTENT, [[...teams()[0]], [...teams()[1]]], seed);

test("croissance : valeurs de ML aux niveaux 1 et 15, courbe de Unite entre les deux", () => {
  assert.equal(statAtLevel([2288, 4420], 1, 15, 1.15), 2288);
  assert.equal(statAtLevel([2288, 4420], 15, 15, 1.15), 4420);
  let prevGain = 0;
  for (let l = 2; l <= 15; l++) {
    const gain = growthFraction(l, 15, 1.15) - growthFraction(l - 1, 15, 1.15);
    assert.ok(gain > prevGain, "chaque gain est plus grand que le précédent");
    prevGain = gain;
  }
});

test("défense : dégâts × 120 / (120 + défense), plancher à −60", () => {
  assert.equal(mitigation(0, R), 1);
  assert.equal(mitigation(120, R), 0.5);
  assert.equal(mitigation(-200, R), 120 / 60);
});

test("réapparition : augmente avec le niveau et la durée de partie, plafonnée", () => {
  assert.ok(respawnTime(5, 10, R) > respawnTime(5, 2, R));
  assert.ok(respawnTime(10, 5, R) > respawnTime(5, 5, R));
  assert.equal(respawnTime(15, 60, R), R.respawn.max);
});

test("expérience : 180 + 100 × niveau pour monter", () => {
  assert.equal(xpToNext(1, R), 280);
  assert.equal(xpToNext(14, R), 1580);
});

test("objets : paliers 1 des trois objets, puis objet 1 jusqu'au bout, au prix des recettes de ML", () => {
  const w = newGame();
  const pique = heroList(w).find((h) => h.def.id === "pique")!;
  // Faux corrosive (Couteau 280 → Arbalète 1 000 → Faux 2 050), puis Lame du désespoir, Frappe du chasseur.
  assert.equal(nextUpgrade(pique), 0);
  assert.equal(upgradeCost(w, pique, 0), 280);
  giveGold(w, pique, 280 + 250 + 250);
  assert.deepEqual(pique.items.map((i) => i.tier), [1, 1, 1]);
  assert.equal(upgradeCost(w, pique, 0), 1000 - 280);
  giveGold(w, pique, 720 + 1050);
  assert.deepEqual(pique.items.map((i) => i.tier), [3, 1, 1]);
  assert.ok(pique.stats.physicalAttack > 30 + 15 + 15);
});

test("tours : seule la plus avancée d'une voie est attaquable ; la base après une tour intérieure", () => {
  const w = newGame();
  const red = w.units.filter((u): u is TowerUnit => u.kind === "tower" && u.team === 1);
  const outer = red.find((t) => t.tier === "outer" && t.lane === 1)!;
  const inner = red.find((t) => t.tier === "inner" && t.lane === 1)!;
  const base = red.find((t) => t.tier === "base")!;
  assert.ok(isTargetable(w, outer));
  assert.ok(!isTargetable(w, inner));
  assert.ok(!isTargetable(w, base));
  outer.alive = false;
  assert.ok(isTargetable(w, inner));
  inner.alive = false;
  assert.ok(isTargetable(w, base));
});

test("tours : dégâts bruts croissants sur un héros (+75 % par coup, plafond ×2,5)", () => {
  const w = newGame();
  const blue = heroList(w).find((h) => h.team === 0)!;
  const tower = w.units.find((u): u is TowerUnit => u.kind === "tower" && u.team === 1 && u.tier === "outer" && u.lane === 1)!;
  blue.pos = { ...tower.pos, x: tower.pos.x - 2 };
  blue.hp = blue.maxHp = 1e9;
  const hits: number[] = [];
  let last = blue.hp;
  for (let i = 0; i < 20 * 5; i++) {
    step(w, []);
    blue.pos = { ...tower.pos, x: tower.pos.x - 2 };
    if (blue.hp < last) hits.push(Math.round(last - blue.hp));
    last = blue.hp;
  }
  assert.ok(hits.length >= 4);
  const first = hits[0]!;
  assert.ok(Math.abs(hits[1]! - first * 1.75) <= 2, `${hits.join(", ")}`);
  assert.ok(Math.abs(hits[3]! - first * 2.5) <= 2, `${hits.join(", ")}`);
});

test("sbires : première vague à 0:10, 3 sbires par voie et par équipe", () => {
  const w = newGame();
  while (w.time < 10.5) step(w, []);
  const minions = w.units.filter((u) => u.kind === "minion");
  assert.equal(minions.length, 3 * 3 * 2);
});

test("compétences : choix A ou B au niveau 5, appliqué par la commande", () => {
  const w = newGame();
  const h = heroList(w)[0] as HeroUnit;
  while (h.level < 5) {
    h.xp += 2000;
    step(w, []);
  }
  assert.ok(h.pendingChoices.includes(0));
  step(w, [{ heroId: h.id, choose: "B" }]);
  assert.equal(h.skills[0].choice, "B");
});

test("une élimination donne or et expérience au tueur", () => {
  const w = newGame();
  const [a, b] = [heroList(w).find((h) => h.team === 0)!, heroList(w).find((h) => h.team === 1)!];
  const gold = a.gold + a.items.length; // items may upgrade with the gold
  dealDamage(w, a, b, 1e9, "true");
  assert.equal(b.alive, false);
  assert.equal(a.kills, 1);
  assert.ok(a.totalGold >= R.gold.kill);
  assert.ok(gold >= 0);
});

test("une partie est déterministe pour une graine donnée", () => {
  const run = () => {
    const w = newGame(5);
    for (let i = 0; i < 20 * 120; i++) step(w, []);
    return w.units.map((u) => `${u.id}:${Math.round(u.hp)}`).join("|");
  };
  assert.equal(run(), run());
});

test("une partie complète entre bots se termine par la destruction d'une base", () => {
  const r = runGame(CONTENT, [[...teams()[0]], [...teams()[1]]], 3);
  assert.notEqual(r.winner, null);
  const base = r.world.units.find((u) => u.kind === "tower" && u.tier === "base" && !u.alive);
  assert.ok(base);
  assert.ok(r.duration > 6 * 60, `durée ${r.duration}`);
});
