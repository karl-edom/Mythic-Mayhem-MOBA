import assert from "node:assert/strict";
import { test } from "node:test";
import { CONTENT } from "../src/game/content.ts";
import { defaultPick } from "../src/game/match.ts";
import { rng } from "../src/sim/math.ts";
import { LockstepMatch, stateHash, toCommand, toNetInput, type MatchSetup, type NetInput, type Turn } from "../src/net/lockstep.ts";

const ids = CONTENT.heroes.map((h) => h.id);
const setup: MatchSetup = {
  seed: 42,
  picks: [ids.slice(0, 3).map((i) => defaultPick(CONTENT, i)), ids.slice(3).map((i) => defaultPick(CONTENT, i))],
  humans: [["peerA", "", ""], ["peerB", "", ""]],
};

/** A host-side script of random inputs for the two humans. */
function scriptTurns(n: number, humans: number[], withHash: (k: number) => number | undefined): Turn[] {
  const r = rng(9);
  const turns: Turn[] = [];
  for (let k = 0; k < n; k++) {
    const i: Record<string, NetInput> = {};
    for (const id of humans) {
      i[id] = toNetInput({
        move: { x: r() * 2 - 1, y: r() * 2 - 1 },
        attack: r() < 0.5,
        ...(r() < 0.05 ? { cast: { slot: Math.floor(r() * 3) as 0 | 1 | 2, target: { x: r() * 68, y: r() * 68 } } } : {}),
      });
    }
    turns.push({ n: k, i, h: withHash(k) });
  }
  return turns;
}

test("en ligne : deux navigateurs qui reçoivent les mêmes tours restent identiques", () => {
  const host = new LockstepMatch(CONTENT, setup);
  const client = new LockstepMatch(CONTENT, setup);
  assert.equal(host.humanHeroes.length, 2);
  assert.deepEqual(host.humanHeroes, client.humanHeroes);
  // The host plays first and stamps a hash every 10 turns, as the real host does.
  const turns = scriptTurns(400, host.humanHeroes, () => undefined);
  for (const t of turns) {
    if (t.n % 10 === 0) t.h = stateHash(host.world);
    host.receive(t);
    assert.ok(host.playNext());
  }
  // The client receives them out of order and in bursts.
  for (const t of [...turns].reverse()) client.receive(t);
  while (client.playNext());
  assert.equal(client.nextTurn, 400);
  assert.equal(client.desync, false);
  assert.equal(stateHash(client.world), stateHash(host.world));
  assert.ok(host.world.time > 59, "une minute de jeu");
});

test("en ligne : une divergence est détectée par l'empreinte", () => {
  const a = new LockstepMatch(CONTENT, setup);
  const b = new LockstepMatch(CONTENT, setup);
  a.receive({ n: 0, i: {} });
  a.playNext();
  b.world.units[0]!.hp -= 1; // a client drifted
  b.receive({ n: 0, i: {}, h: undefined });
  b.playNext();
  b.receive({ n: 1, i: {}, h: stateHash(a.world) });
  b.playNext();
  assert.equal(b.desync, true);
});

test("en ligne : les entrées sont arrondies et les actions ponctuelles ne valent qu'au premier tick", () => {
  const inp = toNetInput({ move: { x: 0.123456, y: -1 }, attack: true, cast: { slot: 1, target: { x: 10.555, y: 3.333 } } });
  assert.deepEqual(inp, { mv: [0.12, -1], at: 1, c: [1, 10.56, 3.33] });
  assert.ok(JSON.stringify(inp).length < 60);
  assert.ok(toCommand(7, inp, 0).cast);
  assert.equal(toCommand(7, inp, 1).cast, undefined);
  assert.ok(toCommand(7, inp, 2).attack);
});
