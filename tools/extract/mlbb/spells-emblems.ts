// Extract battle spells (page "Battle spells") and emblems/talents (page "Emblems").
// Usage: node tools/extract/mlbb/spells-emblems.ts [--refresh]
import { findTemplates, getWikitext, maskMath, pageUrl, parseNumberList, SOURCE, wikiToText, writeJson } from "./lib.ts";

const LICENSE = "CC BY-SA 3.0 (Fandom). Attribution: contributors of mobile-legends.fandom.com";

function sectionOf(text: string, pos: number): string {
  let current = "";
  for (const m of text.matchAll(/^==([^=].*?)==\s*$/gm)) {
    if ((m.index ?? 0) > pos) break;
    current = wikiToText(m[1] ?? "");
  }
  return current;
}

function labeled(raw: string | undefined): { label: string; values: number[] | null; raw: string }[] {
  if (!raw) return [];
  return wikiToText(raw)
    .split("\n")
    .map((l) => /^(.+?):\s*(.+)$/.exec(l))
    .filter((m): m is RegExpExecArray => !!m)
    .map((m) => {
      const valRaw = (m[2] ?? "").trim();
      const nums = valRaw.split(/\s*\/\s*/).map((p) => Number(p.replace(/[%,s]/g, "").trim()));
      return { label: (m[1] ?? "").trim(), values: nums.length > 1 && nums.every((n) => Number.isFinite(n)) ? nums : null, raw: valRaw };
    });
}

async function extractSpells(): Promise<void> {
  const page = await getWikitext("Battle spells");
  if (!page) throw new Error("Battle spells page not found");
  const text = maskMath(page.text);
  const spells = findTemplates(text, (n) => n === "spell-box-skill").map((t) => {
    const f = t.named;
    const cd = parseNumberList(f["cooldown"]);
    const section = sectionOf(text, t.start);
    return {
      name: wikiToText(f["name"] ?? ""),
      page: page.title,
      sourceUrl: `${pageUrl(page.title)}`,
      status: /removed/i.test(section) ? "removed" : "current",
      cooldownSeconds: cd && cd.length === 1 ? cd[0] ?? null : null,
      cooldownRaw: f["cooldown"] ? wikiToText(f["cooldown"]) : null,
      unlockPlayerLevel: parseNumberList(f["level-unlock"])?.[0] ?? null,
      description: f["description"] ? wikiToText(f["description"]) : null,
      levelScaling: [1, 2, 3, 4].flatMap((n) => labeled(f[`ls-${n}`])),
      calc: f["calc"] ? wikiToText(f["calc"]) : null,
      notes: f["notes"] ? wikiToText(f["notes"]) : null,
      variants: ["image-2", "image-3", "image-4"].map((k) => f[k]).filter((x): x is string => !!x),
    };
  });
  writeJson("battle-spells.json", {
    source: SOURCE,
    sourcePage: page.title,
    sourceUrl: pageUrl(page.title),
    retrievedAt: new Date().toISOString(),
    license: LICENSE,
    notes: [
      "Parsed from the {{Spell-box-skill}} templates on the 'Battle spells' page. status = section of the page (Current / Removed Battle Spells).",
      "cooldownSeconds in seconds; the wiki lists 0 for Recall and Healing (no real cooldown value given; Healing description is 'TBA' on the wiki).",
      "unlockPlayerLevel = account level needed to unlock the spell (not hero level).",
      "levelScaling lists are per hero level 1..15 where given (e.g. Execute / Retribution base damage).",
      "Retribution variants (Flame/Ice/Bloody) come from the jungle boots blessing; see mechanics/retribution.md and mechanics/battle-spells.md.",
    ],
    count: spells.length,
    spells,
  });
}

async function extractEmblems(): Promise<void> {
  const page = await getWikitext("Emblems");
  if (!page) throw new Error("Emblems page not found");
  const sets = findTemplates(page.text, (n) => n.endsWith("emblem-set")).map((t) => {
    const f = t.named;
    const attributes: { stat: string; value: number | null; unit: string; raw: string }[] = [];
    for (let i = 1; i <= 6; i++) {
      const stat = f[`attr${i}`];
      const raw = f[`attr-val${i}`];
      if (!stat || !raw) continue;
      const m = /^([+-]?[\d.]+)(%?)/.exec(raw.trim());
      attributes.push({ stat: wikiToText(stat), value: m ? Number(m[1]) : null, unit: m?.[2] ? "%" : "flat", raw: raw.trim() });
    }
    const talents: { tier: number; kind: "standard" | "core"; name: string; description: string }[] = [];
    for (const [k, v] of Object.entries(f)) {
      const m = /^(standard|core)talent(\d+)\.(\d+)$/.exec(k);
      if (!m) continue;
      talents.push({
        tier: Number(m[2]),
        kind: m[1] === "core" ? "core" : "standard",
        name: wikiToText(v),
        description: wikiToText(f[`${m[1]}talent-descr${m[2]}.${m[3]}`] ?? ""),
      });
    }
    return {
      name: `${wikiToText(f["name"] ?? "")} Emblem`,
      page: page.title,
      sourceUrl: pageUrl(page.title),
      template: t.name,
      attributes,
      talents,
    };
  });
  const allTalents = new Map<string, { name: string; kind: string; tier: number; description: string; sets: string[] }>();
  for (const s of sets)
    for (const t of s.talents) {
      const e = allTalents.get(t.name);
      if (e) e.sets.push(s.name);
      else allTalents.set(t.name, { ...t, sets: [s.name] });
    }
  writeJson("emblems.json", {
    source: SOURCE,
    sourcePage: page.title,
    sourceUrl: pageUrl(page.title),
    retrievedAt: new Date().toISOString(),
    license: LICENSE,
    notes: [
      "Current emblem system (2023+): parsed from {{New-basic-emblem-set}} / {{New-custom-emblem-set}} on the 'Emblems' page. The pre-2023 system is dumped as markdown in mechanics/emblems-2016-2023.md.",
      "A player picks one emblem set, then 2 standard talents (tier 1 and tier 2) and 1 core talent (tier 3).",
      "The page intro says 16 standard and 8 core talents exist; the set templates list 16 standard and 10 core (Basic Common offers 4 core talents, each custom set 1). `talents` is the de-duplicated union; the intro count may be outdated.",
      "attributes: flat values unless unit is '%'. 'Adaptive' = physical or magic depending on the hero's higher bonus stat; 'Hybrid' = both physical and magic.",
    ],
    count: sets.length,
    emblems: sets,
    talents: [...allTalents.values()].map((t) => ({ ...t, page: page.title, sourceUrl: pageUrl(page.title) })),
  });
}

export async function extractSpellsAndEmblems(): Promise<void> {
  await extractSpells();
  await extractEmblems();
}

if (import.meta.url === `file://${process.argv[1]}`) await extractSpellsAndEmblems();
