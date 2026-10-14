// Generates the walkable grid of the 3v3 map (data/game/map.json → grid) from a few
// shapes: lane corridors, bases, river, jungle walls with carved paths and camp pockets.
// Layout inspired by ML's Land of Dawn, scaled down (dimensions 🧪). Red side = point mirror.
// Usage: node tools/gen-map.ts

import { readFileSync, writeFileSync } from "node:fs";

const file = new URL("../data/game/map.json", import.meta.url).pathname;
const map = JSON.parse(readFileSync(file, "utf8"));
const N: number = map.size;

type P = [number, number];
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
const blueBase: P = [5, 43];
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
];

function openBlue(p: P): boolean {
  const [x, y] = p;
  if (x < 1 || y < 1 || x > N - 1 || y > N - 1) return false;
  for (const lane of lanes) for (let i = 1; i < lane.length; i++) if (distToSeg(p, lane[i - 1]!, lane[i]!) <= LANE_HALF) return true;
  if (dist(p, blueBase) <= 10.5) return true;
  if (Math.abs(x - y) <= 2.6 && x > 6 && x < N - 6) return true; // river
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
const blueBushes: { center: P; size: P }[] = [
  { center: [15, 27.5], size: [2.5, 2] },
  { center: [21, 38.5], size: [2, 2] },
  { center: [5.5, 26], size: [2.5, 3] },
  { center: [27, 42.5], size: [3, 2.5] },
  { center: [20.5, 21.5], size: [2.5, 2] },
];
map.bushes = [...blueBushes, ...blueBushes.map((b) => ({ center: mirror(b.center), size: b.size }))];
map.grid = rows;
map._grid = "Généré par tools/gen-map.ts : « # » mur, « . » sol. Une case = 1 unité ML. Disposition inspirée de Land of Dawn (ML), réduite 🧪.";
writeFileSync(file, JSON.stringify(map, null, 2) + "\n");
console.log(rows.join("\n"));
