// Walls, collision and pathfinding on the map grid (one cell = 1 ML unit).

import { add, dist, norm, scale, sub, type Vec } from "../sim/math.ts";

export interface NavGrid {
  size: number;
  /** 1 = wall. Row-major, index y * size + x. */
  walls: Uint8Array;
}

export function buildGrid(rows: string[] | undefined, size: number): NavGrid {
  const walls = new Uint8Array(size * size);
  if (rows) {
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) walls[y * size + x] = rows[y]?.[x] === "#" ? 1 : 0;
  }
  return { size, walls };
}

export function isWallCell(g: NavGrid, cx: number, cy: number): boolean {
  if (cx < 0 || cy < 0 || cx >= g.size || cy >= g.size) return true;
  return g.walls[cy * g.size + cx] === 1;
}

export const isWallAt = (g: NavGrid, p: Vec) => isWallCell(g, Math.floor(p.x), Math.floor(p.y));

/** Pushes a circle out of wall cells (a few relaxation passes). */
export function resolveWalls(g: NavGrid, p: Vec, r: number): Vec {
  let pos = { ...p };
  for (let pass = 0; pass < 3; pass++) {
    let moved = false;
    const x0 = Math.floor(pos.x - r);
    const x1 = Math.floor(pos.x + r);
    const y0 = Math.floor(pos.y - r);
    const y1 = Math.floor(pos.y + r);
    for (let cy = y0; cy <= y1; cy++) {
      for (let cx = x0; cx <= x1; cx++) {
        if (!isWallCell(g, cx, cy)) continue;
        const qx = Math.max(cx, Math.min(pos.x, cx + 1));
        const qy = Math.max(cy, Math.min(pos.y, cy + 1));
        const dx = pos.x - qx;
        const dy = pos.y - qy;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d >= r) continue;
        if (d > 1e-6) {
          pos = { x: pos.x + (dx / d) * (r - d), y: pos.y + (dy / d) * (r - d) };
        } else {
          // Centre inside a wall: move to the nearest open neighbour cell.
          const free = nearestOpen(g, cx, cy);
          pos = { x: free.x + 0.5, y: free.y + 0.5 };
        }
        moved = true;
      }
    }
    if (!moved) break;
  }
  return pos;
}

function nearestOpen(g: NavGrid, cx: number, cy: number): Vec {
  for (let rad = 1; rad < g.size; rad++) {
    for (let dy = -rad; dy <= rad; dy++) {
      for (let dx = -rad; dx <= rad; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== rad) continue;
        if (!isWallCell(g, cx + dx, cy + dy)) return { x: cx + dx, y: cy + dy };
      }
    }
  }
  return { x: cx, y: cy };
}

/** True if a circle of radius r can travel straight from a to b. */
export function segmentClear(g: NavGrid, a: Vec, b: Vec, r = 0.35): boolean {
  const d = dist(a, b);
  const steps = Math.ceil(d / 0.25);
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    for (const o of [{ x: 0, y: 0 }, { x: r, y: 0 }, { x: -r, y: 0 }, { x: 0, y: r }, { x: 0, y: -r }]) {
      if (isWallAt(g, add(p, o))) return false;
    }
  }
  return true;
}

/** A* on the grid (8 directions, no corner cutting). Returns cell centres from start to goal. */
export function findPath(g: NavGrid, from: Vec, to: Vec): Vec[] {
  const n = g.size;
  const clampCell = (v: number) => Math.max(0, Math.min(n - 1, Math.floor(v)));
  let start = clampCell(from.y) * n + clampCell(from.x);
  let goal = clampCell(to.y) * n + clampCell(to.x);
  if (g.walls[start]) start = idx(nearestOpen(g, start % n, Math.floor(start / n)));
  if (g.walls[goal]) goal = idx(nearestOpen(g, goal % n, Math.floor(goal / n)));
  function idx(v: Vec) {
    return v.y * n + v.x;
  }
  const gScore = new Float32Array(n * n).fill(Infinity);
  const came = new Int32Array(n * n).fill(-1);
  const closed = new Uint8Array(n * n);
  const heap: [number, number][] = [];
  const push = (f: number, i: number) => {
    heap.push([f, i]);
    let k = heap.length - 1;
    while (k > 0) {
      const p = (k - 1) >> 1;
      if (heap[p]![0] <= heap[k]![0]) break;
      [heap[p], heap[k]] = [heap[k]!, heap[p]!];
      k = p;
    }
  };
  const pop = (): number => {
    const top = heap[0]!;
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let k = 0;
      for (;;) {
        const l = 2 * k + 1;
        const r = l + 1;
        let m = k;
        if (l < heap.length && heap[l]![0] < heap[m]![0]) m = l;
        if (r < heap.length && heap[r]![0] < heap[m]![0]) m = r;
        if (m === k) break;
        [heap[m], heap[k]] = [heap[k]!, heap[m]!];
        k = m;
      }
    }
    return top[1];
  };
  const gx = goal % n;
  const gy = Math.floor(goal / n);
  const h = (i: number) => {
    const dx = Math.abs((i % n) - gx);
    const dy = Math.abs(Math.floor(i / n) - gy);
    return Math.max(dx, dy) + 0.414 * Math.min(dx, dy);
  };
  gScore[start] = 0;
  push(h(start), start);
  while (heap.length > 0) {
    const cur = pop();
    if (cur === goal) break;
    if (closed[cur]) continue;
    closed[cur] = 1;
    const cx = cur % n;
    const cy = Math.floor(cur / n);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = cx + dx;
        const ny = cy + dy;
        if (isWallCell(g, nx, ny)) continue;
        if (dx && dy && (isWallCell(g, cx + dx, cy) || isWallCell(g, cx, cy + dy))) continue;
        const ni = ny * n + nx;
        const cost = gScore[cur]! + (dx && dy ? 1.414 : 1);
        if (cost < gScore[ni]!) {
          gScore[ni] = cost;
          came[ni] = cur;
          push(cost + h(ni), ni);
        }
      }
    }
  }
  if (came[goal] === -1 && goal !== start) return [to];
  const out: Vec[] = [];
  for (let i = goal; i !== -1 && i !== start; i = came[i]!) out.push({ x: (i % n) + 0.5, y: Math.floor(i / n) + 0.5 });
  out.reverse();
  out.push(to);
  return out;
}

export interface NavCache {
  goal: Vec | null;
  path: Vec[];
  at: number;
}

export const newNavCache = (): NavCache => ({ goal: null, path: [], at: -99 });

/** Direction to walk from `from` toward `to`, going around walls. */
export function steer(g: NavGrid, from: Vec, to: Vec, cache: NavCache, now: number): Vec | undefined {
  if (dist(from, to) < 0.4) return undefined;
  if (segmentClear(g, from, to)) {
    cache.path = [];
    return norm(sub(to, from));
  }
  if (!cache.goal || dist(cache.goal, to) > 1.5 || now - cache.at > 1.5 || cache.path.length === 0) {
    cache.path = findPath(g, from, to);
    cache.goal = { ...to };
    cache.at = now;
  }
  // Drop reached waypoints, then aim at the farthest one in straight line (string pulling).
  while (cache.path.length > 1 && dist(cache.path[0]!, from) < 0.6) cache.path.shift();
  let target = cache.path[0] ?? to;
  for (let i = Math.min(cache.path.length - 1, 8); i > 0; i--) {
    if (segmentClear(g, from, cache.path[i]!)) {
      target = cache.path[i]!;
      break;
    }
  }
  return norm(sub(target, from));
}

/** Moves p by `step` along dir but stops before entering a wall (dashes, knockbacks). */
export function moveUntilWall(g: NavGrid, p: Vec, dir: Vec, step: number, r: number): { pos: Vec; blocked: boolean } {
  const n = Math.ceil(step / 0.2);
  let pos = p;
  for (let i = 0; i < n; i++) {
    const next = add(pos, scale(dir, step / n));
    if (isWallAt(g, next) || !segmentClear(g, pos, next, r * 0.7)) return { pos, blocked: true };
    pos = next;
  }
  return { pos, blocked: false };
}
