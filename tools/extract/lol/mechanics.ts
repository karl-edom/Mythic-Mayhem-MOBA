// Dumps LoL wiki mechanics pages to data/reference/lol/mechanics/*.md.
// Uses MediaWiki action=parse (rendered HTML, templates expanded so computed
// table values are present) and converts it to Markdown, keeping tables.
// The raw wikitext is also cached (not committed) for reference.
// Usage: NODE_USE_ENV_PROXY=1 node tools/extract/lol/mechanics.ts [--refresh]

import { WIKI_PAGE, htmlToMarkdown, wikiParse, wikiSource, writeOutput, writeText } from "./lib.ts";

/** [output file, wiki page title, topic] */
export const MECHANICS_PAGES: [string, string, string][] = [
  ["champion-statistic", "Champion statistic", "stats, per-level growth formula"],
  ["armor", "Armor", "armor & damage reduction formula"],
  ["magic-resistance", "Magic resistance", "MR & damage reduction formula"],
  ["armor-penetration", "Armor penetration", "armor pen, lethality, reduction ordering"],
  ["magic-penetration", "Magic penetration", "magic pen, reduction ordering"],
  ["damage", "Damage", "damage types, modifiers, ordering"],
  ["damage-over-time", "Damage over time", "DoT rules"],
  ["critical-strike", "Critical strike", "crit chance & damage"],
  ["attack-speed", "Attack speed", "AS formula, ratio, cap"],
  ["basic-attack", "Basic attack", "windup, attack timer, missiles"],
  ["movement-speed", "Movement speed", "soft caps, slow stacking"],
  ["haste", "Haste", "ability haste formula"],
  ["cooldown-reduction", "Cooldown reduction", "legacy CDR"],
  ["crowd-control", "Crowd control", "CC types & interactions"],
  ["tenacity", "Tenacity", "tenacity stacking"],
  ["healing", "Healing", "heal & regen"],
  ["shield", "Shield", "shields"],
  ["grievous-wounds", "Grievous Wounds", "healing reduction"],
  ["vamp", "Vamp", "life steal / omnivamp"],
  ["experience", "Experience (champion)", "level table, XP sharing"],
  ["gold", "Gold", "gold income"],
  ["kill", "Kill", "kill gold, bounties, assists"],
  ["death", "Death", "death timer / respawn"],
  ["minion", "Minion", "waves, minion stats & growth"],
  ["turret", "Turret", "turret stats, plates, damage ramp"],
  ["monster", "Monster", "camps, epic monsters, timers"],
  ["jungling", "Jungling", "jungle rules"],
  ["dragon-pit", "Dragon pit", "drakes"],
  ["baron-nashor", "Baron Nashor", "baron"],
  ["rift-herald", "Rift Herald", "herald"],
  ["voidgrub-camp", "Voidgrub camp", "voidgrubs"],
  ["atakhan", "Atakhan", "atakhan"],
  ["summoners-rift", "Summoner's Rift", "map"],
  ["aram", "ARAM", "ARAM mode"],
  ["howling-abyss", "Howling Abyss", "ARAM map"],
];

async function main(): Promise<void> {
  const index: { file: string; title: string; topic: string; url: string; revid: number | null; chars: number }[] = [];
  const failed: string[] = [];
  for (const [file, title, topic] of MECHANICS_PAGES) {
    process.stdout.write(`${title}… `);
    const parsed = await wikiParse(title);
    await wikiSource(title); // cache raw wikitext alongside (not committed)
    if (!parsed) {
      failed.push(title);
      console.log("missing");
      continue;
    }
    const url = `${WIKI_PAGE}${encodeURIComponent(parsed.title.replace(/ /g, "_")).replace(/%2F/g, "/")}`;
    const md = htmlToMarkdown(parsed.html);
    const header =
      `Source: ${url}\n\n` +
      `> LoL wiki page "${parsed.title}" (revision ${parsed.revid ?? "?"}), rendered HTML converted to Markdown by tools/extract/lol/mechanics.ts. ` +
      `Content © League of Legends Wiki contributors, CC BY-SA 3.0. Reference material for private research only.\n\n` +
      `# ${parsed.title}\n\n`;
    writeText(`mechanics/${file}.md`, header + md);
    index.push({ file: `mechanics/${file}.md`, title: parsed.title, topic, url, revid: parsed.revid, chars: md.length });
  }
  writeOutput("mechanics/index.json", {
    source: "https://wiki.leagueoflegends.com/en-us/api.php (action=parse)",
    version: "wiki revision per page (see revid)",
    retrievedAt: new Date().toISOString(),
    notes: ["One Markdown file per wiki page. Images and navboxes dropped; tables kept.", failed.length ? `Missing pages: ${failed.join(", ")}` : "All pages fetched."],
    pages: index,
  });
}

await main();
