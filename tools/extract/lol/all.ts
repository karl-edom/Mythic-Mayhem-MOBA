// Runs every LoL extraction step in order (cache-aware; add --refresh to re-download).
// Usage: NODE_USE_ENV_PROXY=1 node tools/extract/lol/all.ts [--refresh]

for (const step of ["champions.ts", "items.ts", "units.ts", "mechanics.ts", "spot-check.ts"]) {
  console.log(`\n=== ${step}`);
  await import(`./${step}`);
}
