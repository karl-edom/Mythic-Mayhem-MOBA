// Run every MLBB extraction step in order. Usage: node tools/extract/mlbb/all.ts [--refresh]
// Behind an HTTP proxy, run with NODE_USE_ENV_PROXY=1 (Node >= 22.21) so fetch() honours HTTPS_PROXY.
import { extractHeroes } from "./heroes.ts";
import { extractSkills } from "./skills.ts";
import { extractItems } from "./items.ts";
import { extractSpellsAndEmblems } from "./spells-emblems.ts";
import { extractMechanics } from "./mechanics.ts";

await extractHeroes();
await extractSkills();
await extractItems();
await extractSpellsAndEmblems();
await extractMechanics();
