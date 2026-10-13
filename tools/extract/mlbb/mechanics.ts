// Dump MLBB game-mechanics pages as cleaned markdown (one file per page) into data/reference/mlbb/mechanics/.
// Usage: node tools/extract/mlbb/mechanics.ts [--refresh]
import { categoryMembers, getWikitext, pageUrl, wikitextToMarkdown, writeJson, writeText, SOURCE } from "./lib.ts";

// Hand-picked pages (the wiki has no single "mechanics" category). Grouped for the index.
const GROUPS: Record<string, string[]> = {
  "map-and-match": [
    "Land of Dawn",
    "Land of Dawn (Old)",
    "Map",
    "Battlefield Guide",
    "Match Details & Timestamps",
    "Special Areas",
    "Bush",
    "Cyclone Eye",
    "Wall",
    "Lane cutting",
    "Macro",
    "Controls",
    "Ping",
  ],
  "lanes-and-roles": ["Gold Laner", "EXP Laner", "Mid Laner", "Jungler", "Roamer", "Side Laner", "Utility Jungler", "Hero roles", "Hero specialties"],
  structures: ["Turret", "Sacred Statue", "Altar"],
  minions: ["Minions"],
  jungle: ["Jungle", "Jungle (Old)", "Crab", "Fire Beetle", "Horned Lizard", "Lava Golem", "Lithowanderer", "Molten Fiend", "Thunder Fenrir", "Turtle", "Lord"],
  economy: ["Gold", "Kill", "Killing Notifications", "Death", "Equipment"],
  "spells-emblems": ["Battle spells", "Retribution", "Emblems", "Emblems (2016–2023)", "Impure Rage"],
  "combat-stats": [
    "Attribute",
    "Terms",
    "Basic attack",
    "Attack speed",
    "Attack range",
    "Range",
    "Movement speed",
    "Health point",
    "HP Regen",
    "HP regen (attribute)",
    "Resource",
    "Physical attack",
    "Magic power",
    "Adaptive attributes",
    "Hybrid attributes",
    "Physical defense",
    "Magic defense",
    "Physical penetration",
    "Magic penetration",
    "Defense reduction",
    "Damage",
    "Physical damage",
    "Magic damage",
    "True damage",
    "Damage reduction",
    "Critical strike",
    "Cooldown",
    "Cooldown reduction",
    "Lifesteal and Spell Vamp",
    "Physical lifesteal",
    "Magic lifesteal",
    "Healing",
    "Healing effect",
    "Healing received",
    "Shield",
    "Resilience",
    "Buff",
    "Debuff",
    "Conceal",
    "Untargetability",
    "Summoned unit",
    "Mobility",
    "Blink and charge",
    "Cast types",
    "AoE skills",
    "Single-targeted",
    "Ability tag",
    "List of Skills That Deal No Damage",
    "List of skills that reveals units",
  ],
  "crowd-control": [
    "Crowd control",
    "Control and slowing immunity",
    "Airborne",
    "Frozen",
    "Immobilized",
    "Knocked back",
    "Pulled",
    "Restrained",
    "Root",
    "Silenced",
    "Slow",
    "Stunned",
    "Suppressed",
    "Taunted",
    "Terrified",
    "Transformed",
    "Disarm",
  ],
  "game-modes": ["Game Modes", "Classic", "Ranked", "Ranks", "Draft Pick", "Brawl", "Arcade Mode", "Custom", "Vs. AI", "Chaos Clash", "Survival", "Arena", "Evolve", "Boommander"],
  "hero-lists": ["List of heroes by attack speed", "List of heroes by movement speed", "List of heroes by physical defense"],
};

// Categories crawled additionally, so new mechanics pages get picked up on rerun.
const EXTRA_CATEGORIES = ["Gameplay elements", "Battlefield Features", "Crowd control effects", "Jungle", "Attributes", "Battle Spells", "Emblems & Talents", "Turret", "Damage", "Healing", "Terrain Features"];

function slug(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "and")
    .replace(/[–—]/g, "-")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export async function extractMechanics(): Promise<void> {
  const wanted = new Map<string, string>(); // title -> group
  for (const [g, titles] of Object.entries(GROUPS)) for (const t of titles) wanted.set(t, g);
  for (const c of EXTRA_CATEGORIES) {
    for (const m of await categoryMembers(c, "0")) if (!wanted.has(m.title)) wanted.set(m.title, `category:${c}`);
  }
  const seen = new Map<string, { file: string; requested: string[]; group: string; chars: number }>();
  const missing: string[] = [];
  for (const [title, group] of wanted) {
    const page = await getWikitext(title);
    if (!page) {
      missing.push(title);
      continue;
    }
    const prev = seen.get(page.title);
    if (prev) {
      prev.requested.push(title);
      continue;
    }
    const file = `mechanics/${slug(page.title)}.md`;
    const md = wikitextToMarkdown(page.text);
    const redirectNote = page.title !== title ? ` (requested as "${title}", redirect)` : "";
    writeText(
      file,
      `Source: ${pageUrl(page.title)}\n\n<!-- ${SOURCE}. Converted from wikitext by tools/extract/mlbb/mechanics.ts on ${new Date().toISOString().slice(0, 10)}${redirectNote}. Inline templates are flattened; infoboxes are rendered as Field/Value tables. -->\n\n# ${page.title}\n\n${md}\n`,
    );
    seen.set(page.title, { file, requested: [title], group, chars: md.length });
  }
  writeJson("mechanics/index.json", {
    source: SOURCE,
    retrievedAt: new Date().toISOString(),
    notes: [
      "One markdown file per wiki page. Pages were hand-picked by group plus every page of the categories listed in `categoriesCrawled`.",
      "Redirects are resolved: several requested titles may map to one file (see `requestedAs`).",
      `Requested titles that do not exist on the wiki: ${missing.length ? missing.join(", ") : "none"}.`,
    ],
    categoriesCrawled: EXTRA_CATEGORIES,
    pages: [...seen.entries()].map(([page, v]) => ({ page, sourceUrl: pageUrl(page), file: v.file, group: v.group, requestedAs: v.requested, markdownChars: v.chars })),
  });
  console.log(`mechanics: ${seen.size} pages, missing: ${missing.join(", ") || "none"}`);
}

if (import.meta.url === `file://${process.argv[1]}`) await extractMechanics();
