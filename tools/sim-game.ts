// Plays full bot-vs-bot matches and reports duration and progression (rules-v1 §12).
// Usage: node tools/sim-game.ts [--n 10] [--seed 1]

import { parseArgs } from "node:util";
import { CONTENT } from "../src/game/content.ts";
import { defaultPick, heroList, runGame } from "../src/game/match.ts";
import type { HeroPick } from "../src/game/engine.ts";

const { values } = parseArgs({ options: { n: { type: "string", default: "10" }, seed: { type: "string", default: "1" } } });
const n = Number(values.n);
const ids = CONTENT.heroes.map((h) => h.id);

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const durations: number[] = [];
const wins = [0, 0, 0];
const started = Date.now();
for (let i = 0; i < n; i++) {
  const seed = Number(values.seed) + i;
  // Rotate compositions: 3 distinct heroes per team, one of them with Retribution (jungler).
  const rot = (k: number) => ids[(i + k) % ids.length]!;
  const team = (offset: number): HeroPick[] => [rot(offset), rot(offset + 1), rot(offset + 2)].map((id) => defaultPick(CONTENT, id));
  const r = runGame(CONTENT, [team(0), team(3)], seed);
  durations.push(r.duration);
  wins[r.winner ?? 2]!++;
  const hs = heroList(r.world);
  const towers = r.world.units.filter((u) => u.kind === "tower" && !u.alive).length;
  console.log(
    `#${i + 1} ${r.winner === null ? "nul" : r.winner === 0 ? "bleus" : "rouges"} en ${fmt(r.duration)} | éliminations ${r.world.kills.join("-")} | tours détruites ${towers} | ` +
      hs.map((h) => `${h.name}${h.team === 0 ? "ᴮ" : "ᴿ"} niv${h.level} ${h.kills}/${h.deaths}/${h.assists} ${Math.round(h.totalGold)}or [${h.items.map((x) => x.tier).join("")}]`).join("  "),
  );
}
durations.sort((a, b) => a - b);
console.log(`\nDurée : min ${fmt(durations[0]!)}, médiane ${fmt(durations[Math.floor(n / 2)]!)}, max ${fmt(durations[n - 1]!)} (cible 12:00–20:00)`);
console.log(`Victoires : bleus ${wins[0]}, rouges ${wins[1]}, nuls ${wins[2]}`);
console.log(`(${((Date.now() - started) / 1000).toFixed(1)} s)`);
