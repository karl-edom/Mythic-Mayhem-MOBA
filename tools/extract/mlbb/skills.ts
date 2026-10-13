// Extract hero abilities (passive, skills, ultimate) from each hero page's {{Ability}} templates.
// Requires heroes.json (run heroes.ts first). Usage: node tools/extract/mlbb/skills.ts [--refresh]
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  DAMAGE_LABELS,
  findTemplates,
  getWikitext,
  maskMath,
  OUT_DIR,
  pageUrl,
  parseNumberList,
  SCALE_LABELS,
  SOURCE,
  wikiToText,
  writeJson,
} from "./lib.ts";

interface Scaling {
  base: string | null;
  baseMin: number | null;
  baseMax: number | null;
  ratios: { stat: string; value: number | null; raw: string }[];
  damageType: string | null;
}

const CC_PATTERNS: [string, RegExp][] = [
  ["stun", /\bstun(s|ned|ning)?\b/i],
  ["slow", /\bslow(s|ed|ing)?\b/i],
  ["airborne", /\b(knock(s|ed|ing)? (them |enemies |the target )?(up|airborne)|airborne|launch(es|ed)? .{0,20}(air|airborne))\b/i],
  ["knockback", /\bknock(s|ed|ing)? (them |enemies |the target )?back\b|\bknockback\b/i],
  ["suppress", /\bsuppress(es|ed|ing|ion)?\b/i],
  ["taunt", /\btaunt(s|ed|ing)?\b/i],
  ["silence", /\bsilenc(e|es|ed|ing)\b/i],
  ["immobilize", /\b(immobiliz(e|es|ed|ing)|root(s|ed|ing)?)\b/i],
  ["petrify", /\bpetrif(y|ies|ied)\b/i],
  ["freeze", /\bfr(eeze|eezes|oze|ozen)\b/i],
  ["charm", /\bcharm(s|ed|ing)?\b/i],
  ["fear", /\bfear(s|ed)?\b|\bterrif/i],
  ["pull", /\bpull(s|ed|ing)?\b|\bdrag(s|ged)?\b/i],
  ["sleep", /\bsleep\b|\basleep\b/i],
  ["disarm", /\bdisarm/i],
  ["transform", /\btransform(s|ed)? (them|enemies|the target)/i],
  ["blind", /\bblind(s|ed)?\b/i],
];

function parseScale(named: Record<string, string>, positional: string[]): Scaling {
  const base = named["base"] ? wikiToText(named["base"]) : null;
  let baseMin: number | null = null;
  let baseMax: number | null = null;
  if (base) {
    const m = /^(-?[\d.]+)\s*[-–]\s*(-?[\d.]+)$/.exec(base.replace(/,/g, ""));
    if (m) {
      baseMin = Number(m[1]);
      baseMax = Number(m[2]);
    } else if (/^-?[\d.]+$/.test(base)) baseMin = baseMax = Number(base);
  }
  const ratios: Scaling["ratios"] = [];
  for (const [k, label] of Object.entries(SCALE_LABELS)) {
    const raw = named[k];
    if (!raw) continue;
    const v = Number(wikiToText(raw).replace(/%/g, ""));
    ratios.push({ stat: label.replace(/^[%×]\s*/, "").trim() + (label.startsWith("%") ? " (%)" : label.startsWith("×") ? " (×)" : ""), value: Number.isFinite(v) ? v : null, raw: wikiToText(raw) });
  }
  const p0 = positional[0];
  return { base, baseMin, baseMax, ratios, damageType: p0 ? DAMAGE_LABELS[p0] ?? p0 : null };
}

/** Parse "Label: 1 / 2 / 3" lines from level-scaling style fields. */
function parseLabeledLists(raw: string | undefined): { label: string; values: number[] | null; raw: string }[] {
  if (!raw) return [];
  const out: { label: string; values: number[] | null; raw: string }[] = [];
  for (const line of wikiToText(raw).split("\n")) {
    const m = /^[*\s]*(.+?):\s*(.+)$/.exec(line);
    if (!m) continue;
    const label = (m[1] ?? "").replace(/^[*\s]+/, "").trim();
    const valRaw = (m[2] ?? "").trim();
    const nums = valRaw.split(/\s*\/\s*/).map((p) => Number(p.replace(/[%,s]|seconds?|units?/g, "").trim()));
    out.push({ label, values: nums.length > 1 && nums.every((n) => Number.isFinite(n)) ? nums : null, raw: valRaw });
  }
  return out;
}

function slotOf(heading: string): string {
  const h = heading.toLowerCase();
  if (/passive/.test(h)) return "passive";
  if (/ultimate|skill 3\b/.test(h)) return "ultimate";
  if (/skill 1\b/.test(h)) return "skill1";
  if (/skill 2\b/.test(h)) return "skill2";
  return "other";
}

const FIELD_KEYS = ["cooldown", "mana-cost", "energy-cost", "cast-range", "duration", "recharging-time", "lifesteal-ratio", "spellvamp-ratio"];

export async function extractSkills(): Promise<void> {
  const heroesFile = JSON.parse(readFileSync(join(OUT_DIR, "heroes.json"), "utf8")) as { heroes: { name: string; page: string }[] };
  const notes: string[] = [
    "Parsed from the {{Ability}} (= Template:Infobox hero ability) calls in the '== Abilities ==' section of each hero page.",
    "slot: passive / skill1 / skill2 / ultimate, derived from the section heading; 'other' for extra sections (transformations, alternate forms, Skill 4, etc.). `heading` keeps the original wiki heading path.",
    "cooldown / manaCost / energyCost are per skill level (skills: levels 1-6, ultimate: levels 1-3) in seconds / mana points. Raw text is kept in `raw` when the value is not a pure numeric list.",
    "scalings: one entry per {{scale}} template in the description, in order of appearance. base 'a-b' means value at skill level 1 to max level; ratios are % of the named stat (or × for per-level / lifesteal).",
    "levelScaling: 'Label: v1 / v2 / ...' lines parsed from the level-scaling, ult-level-scaling, hero-level-scaling, stack-scaling and properties fields.",
    "ccTypes is a keyword heuristic over description + notes (stun, slow, airborne, suppress, ...). Verify before relying on it; skillEffects are the wiki's own tags (Burst, AoE, CC, Slowed, Buff...).",
    "Ranges are in in-game units only when the wiki states them (castRange field or inside text); most pages do not provide areas/ranges.",
  ];
  const skills: Record<string, unknown>[] = [];
  const problems: string[] = [];
  for (const hero of heroesFile.heroes) {
    const page = await getWikitext(hero.page);
    if (!page) {
      problems.push(`${hero.name}: page not found`);
      continue;
    }
    const text = maskMath(page.text);
    const startM = /^==\s*(Abilities|Skills)\s*==\s*$/im.exec(text);
    if (!startM) {
      problems.push(`${hero.name}: no Abilities section`);
      continue;
    }
    const start = startM.index + startM[0].length;
    const rest = text.slice(start);
    const endM = /^==[^=].*==\s*$/m.exec(rest);
    const section = endM ? rest.slice(0, endM.index) : rest;
    // map template positions to headings
    const headings: { pos: number; level: number; title: string }[] = [];
    for (const m of section.matchAll(/^(={3,5})\s*(.*?)\s*\1\s*$/gm)) headings.push({ pos: m.index ?? 0, level: (m[1] ?? "").length, title: wikiToText(m[2] ?? "") });
    const abilities = findTemplates(section, (n) => n === "ability" || n === "infobox hero ability");
    if (!abilities.length) problems.push(`${hero.name}: no {{Ability}} templates`);
    let order = 0;
    for (const a of abilities) {
      const path: string[] = [];
      for (const h of headings) {
        if (h.pos > a.start) break;
        path.length = Math.max(0, h.level - 3);
        path.push(h.title);
      }
      const heading = path.join(" > ");
      const f = a.named;
      const descRaw = f["description"] ?? "";
      const scalings = findTemplates(descRaw, (n) => n === "scale").map((s) => parseScale(s.named, s.positional));
      const description = wikiToText(descRaw);
      const notesText = f["notes"] ? wikiToText(f["notes"]) : null;
      const ccText = `${description}\n${notesText ?? ""}`;
      const ccTypes = CC_PATTERNS.filter(([, re]) => re.test(ccText)).map(([k]) => k);
      const values: Record<string, { values: number[] | null; raw: string | null }> = {};
      for (const k of FIELD_KEYS) {
        const raw = f[k];
        values[k] = { values: parseNumberList(raw), raw: raw ? wikiToText(raw) || null : null };
      }
      const levelScaling = [
        ...parseLabeledLists(f["level-scaling"]),
        ...parseLabeledLists(f["ult-level-scaling"]),
        ...parseLabeledLists(f["hero-level-scaling"]),
        ...parseLabeledLists(f["stack-scaling"]),
        ...parseLabeledLists(f["properties"]),
        ...[1, 2, 3, 4, 5].flatMap((n) => parseLabeledLists(f[`ls-${n}`])),
      ];
      skills.push({
        hero: hero.name,
        page: page.title,
        sourceUrl: pageUrl(page.title),
        order: order++,
        slot: slotOf(heading),
        heading,
        name: f["name"] ? wikiToText(f["name"]) : null,
        skillEffects: [f["skill-effect-1"], f["skill-effect-2"]].map((x) => (x ? wikiToText(x) : "")).filter(Boolean),
        terms: [f["term-1"], f["term-2"], f["term-3"]].map((x) => (x ? wikiToText(x) : "")).filter(Boolean),
        cooldown: values["cooldown"],
        manaCost: values["mana-cost"],
        energyCost: values["energy-cost"],
        castRange: values["cast-range"],
        duration: values["duration"],
        rechargingTime: values["recharging-time"],
        lifestealRatio: values["lifesteal-ratio"],
        spellVampRatio: values["spellvamp-ratio"],
        description,
        scalings,
        levelScaling,
        ccTypes,
        calc: f["calc"] ? wikiToText(f["calc"]) : null,
        notes: notesText,
        quote: f["quote"] ? wikiToText(f["quote"]) || null : null,
      });
    }
  }
  if (problems.length) notes.push(`Extraction problems: ${problems.join("; ")}.`);
  writeJson("skills.json", {
    source: SOURCE,
    retrievedAt: new Date().toISOString(),
    license: "CC BY-SA 3.0 (Fandom). Attribution: contributors of mobile-legends.fandom.com",
    notes,
    count: skills.length,
    skills,
  });
  if (problems.length) console.warn(problems.join("\n"));
}

if (import.meta.url === `file://${process.argv[1]}`) await extractSkills();
