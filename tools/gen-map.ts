// Generates the whole 3v3 map (data/game/map.json): layout scaled to the target size, then the
// walkable grid from a few shapes: lane corridors, bases, river, jungle walls with carved paths
// and camp pockets. Layout inspired by ML's Land of Dawn. Red side = point mirror.
// Corridor widths, pockets and pits keep their size; positions scale with the map.
// Usage: node tools/gen-map.ts [--size 64]

import { readFileSync, writeFileSync } from "node:fs";

const file = new URL("../data/game/map.json", import.meta.url).pathname;
const map = JSON.parse(readFileSync(file, "utf8"));
const arg = process.argv.indexOf("--size");
const N: number = arg > 0 ? Number(process.argv[arg + 1]) : map.size;

type P = [number, number];
// Design layout on a 48 × 48 grid (blue side for camps, bushes and paths).
const D = 48;
const k = N / D;
const sc = (p: P): P => [Math.round(p[0] * k * 10) / 10, Math.round(p[1] * k * 10) / 10];
const layout = {
  bases: [[6, 42], [42, 6]] as P[],
  fountains: [[2.5, 45.5], [45.5, 2.5]] as P[],
  lanes: [
    { id: "top", path: [[6, 42], [5, 5], [42, 6]] as P[] },
    { id: "mid", path: [[6, 42], [42, 6]] as P[] },
    { id: "bot", path: [[6, 42], [43, 43], [42, 6]] as P[] },
  ],
  // Three turrets per lane, as in ML (outer, inner, base turret = "inhibitor").
  towerDistances: {
    top: { inhibitor: 9, inner: 15.5, outer: 22 },
    mid: { inhibitor: 8, inner: 12, outer: 16 },
    bot: { inhibitor: 9, inner: 15.5, outer: 22 },
  } as Record<string, { inhibitor: number; inner: number; outer: number }>,
  river: { from: [9, 9] as P, to: [39, 39] as P },
  camps: [
    { id: "orange", pos: [12, 28] as P },
    { id: "purple", pos: [21, 36] as P },
    { id: "beetle", pos: [11, 21] as P },
    { id: "lizard", pos: [29, 37] as P },
  ],
  turtle: [33, 33] as P,
  lord: [15, 15] as P,
};
map.size = N;
map.bases = layout.bases.map(sc);
map.fountains = layout.fountains.map((f, i) => (i === 0 ? [2.5, N - 2.5] : [N - 2.5, 2.5]) as P);
map.lanes = layout.lanes.map((l) => ({ id: l.id, path: l.path.map(sc) }));
map.towerDistances = Object.fromEntries(
  Object.entries(layout.towerDistances).map(([id, t]) => [id, Object.fromEntries(Object.entries(t).map(([tier, d]) => [tier, Math.round(d * k * 10) / 10]))]),
);
map.river = { from: sc(layout.river.from), to: sc(layout.river.to), width: 4 };
map.camps = layout.camps.map((c) => ({ id: c.id, pos: sc(c.pos) }));
map.turtle = sc(layout.turtle);
map.lord = sc(layout.lord);

const dist = (a: P, b: P) => Math.hypot(a[0] - b[0], a[1] - b[1]);
function distToSeg(p: P, a: P, b: P): number {
  const [ax, ay] = a;
  const dx = b[0] - ax;
  const dy = b[1] - ay;
  const l2 = dx * dx + dy * dy;
  const t = l2 === 0 ? 0 : Math.max(0, Math.min(1, ((p[0] - ax) * dx + (p[1] - ay) * dy) / l2));
  return Math.hypot(p[0] - (ax + t * dx), p[1] - (ay + t * dy));
}

// Blue-side shapes; everything is mirrored to the red side.
const LANE_HALF = 2.6;
const lanes: P[][] = map.lanes.map((l: { path: P[] }) => l.path);
const blueBase: P = map.bases[0];
const BASE_RADIUS = 10.5 * k;
const camps: P[] = map.camps.map((c: { pos: P }) => c.pos);
const pits: P[] = [map.turtle, map.lord];
// Jungle paths (blue side), width 2.6.
const paths: P[][] = [
  [[8, 30], [12, 28], [18, 27]], // top lane → orange buff → mid
  [[12, 28], [11, 21]], // orange → beetle
  [[8, 21], [11, 21], [15, 19]], // top lane → beetle → river (lord pit)
  [[21, 30], [21, 36], [21, 40]], // mid → purple buff → bot lane
  [[21, 36], [29, 37]], // purple → lizard
  [[29, 40], [29, 37], [32, 34]], // bot lane → lizard → river (turtle pit)
].map((path) => (path as P[]).map(sc));

function openBlue(p: P): boolean {
  const [x, y] = p;
  if (x < 1 || y < 1 || x > N - 1 || y > N - 1) return false;
  for (const lane of lanes) for (let i = 1; i < lane.length; i++) if (distToSeg(p, lane[i - 1]!, lane[i]!) <= LANE_HALF) return true;
  if (dist(p, blueBase) <= BASE_RADIUS) return true;
  if (Math.abs(x - y) <= 2.6 && x > 6 * k && x < N - 6 * k) return true; // river
  for (const c of camps) if (dist(p, c) <= 2.4) return true;
  for (const c of pits) if (dist(p, c) <= 3.6) return true;
  for (const path of paths) for (let i = 1; i < path.length; i++) if (distToSeg(p, path[i - 1]!, path[i]!) <= 1.3) return true;
  return false;
}

const mirror = (p: P): P => [N - p[0], N - p[1]];
const rows: string[] = [];
for (let cy = 0; cy < N; cy++) {
  let row = "";
  for (let cx = 0; cx < N; cx++) {
    const c: P = [cx + 0.5, cy + 0.5];
    row += openBlue(c) || openBlue(mirror(c)) ? "." : "#";
  }
  rows.push(row);
}

// Bushes on walkable ground (blue side), mirrored for red.
const blueBushes: { center: P; size: P }[] = ([
  { center: [15, 27.5], size: [2.5, 2] },
  { center: [21, 38.5], size: [2, 2] },
  { center: [5.5, 26], size: [2.5, 3] },
  { center: [27, 42.5], size: [3, 2.5] },
  { center: [20.5, 21.5], size: [2.5, 2] },
] as { center: P; size: P }[]).map((b) => ({ center: sc(b.center), size: b.size }));
map.bushes = [...blueBushes, ...blueBushes.map((b) => ({ center: mirror(b.center), size: b.size }))];
map.grid = rows;
map._grid = "Généré par tools/gen-map.ts : « # » mur, « . » sol. Une case = 1 unité ML. Disposition inspirée de Land of Dawn (ML) ; taille calée sur la vidéo du porteur de projet (docs/research/video-ml-2026-10-14.md).";
writeFileSync(file, JSON.stringify(map, null, 2) + "\n");
console.log(rows.join("\n"));
