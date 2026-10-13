// serebii.net/pokemonunite: static HTML (windows-1252). Used for per-Pokémon
// level 1-15 stat tables (cross-check), evolution chains, Pokémon missing from
// unite-db, and mechanics / stage pages (dumped to Markdown).
import { cellText, extractTables, fetchCached, htmlToMarkdown, num } from './lib.ts';

export const SEREBII_BASE = 'https://www.serebii.net/pokemonunite/';

/** Pages under /pokemonunite/ that are not Pokémon (stat ranking pages share the folder). */
const NON_POKEMON = new Set(['attack', 'defense', 'hp', 'sp.attack', 'sp.defense']);

export async function serebiiPokemonIndex(): Promise<{ slug: string; name: string; url: string }[]> {
  const url = `${SEREBII_BASE}pokemon.shtml`;
  const { body } = await fetchCached(url);
  const seen = new Map<string, { slug: string; name: string; url: string }>();
  const re = /<a href="\/pokemonunite\/pokemon\/([^"]+)\.shtml"><u>([^<]+)<\/u><\/a>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body))) {
    const slug = m[1] ?? '';
    if (NON_POKEMON.has(slug) || seen.has(slug)) continue;
    seen.set(slug, { slug, name: (m[2] ?? '').trim(), url: `${SEREBII_BASE}pokemon/${encodeURI(slug)}.shtml` });
  }
  return [...seen.values()];
}

export interface SerebiiStatsRow {
  level: number;
  hp: number | null;
  attack: number | null;
  defense: number | null;
  spAttack: number | null;
  spDefense: number | null;
  speed: number | null;
}

export interface SerebiiMove {
  section: string; // Basic, Special 1, Special 2, Unite
  name: string;
  category: string | null;
  style: string | null;
  l15BaseDamage: string | null;
  cooldownS: number | null;
  description: string | null;
  upgradeNote: string | null;
}

export interface SerebiiPokemon {
  slug: string;
  url: string;
  retrievedAt: string;
  name: string | null;
  difficulty: string | null;
  style: string | null; // Melee / Ranged
  role: string | null;
  attackStyle: string | null; // Physical Attacker / Special Attacker
  evolution: { name: string; level: number | null }[];
  ability: { name: string | null; description: string | null };
  moves: SerebiiMove[];
  stats: SerebiiStatsRow[];
}

function mainContent(html: string): string {
  const s = html.indexOf('<main');
  const e = html.indexOf('</main>');
  return s >= 0 && e > s ? html.slice(s, e) : html;
}

export async function fetchSerebiiPokemon(slug: string, url: string): Promise<SerebiiPokemon> {
  const { body, retrievedAt } = await fetchCached(url);
  const html = mainContent(body);
  const tables = extractTables(html);
  const rec: SerebiiPokemon = {
    slug, url, retrievedAt, name: null, difficulty: null, style: null, role: null, attackStyle: null,
    evolution: [], ability: { name: null, description: null }, moves: [], stats: [],
  };
  const h = /<h1>([^<]+)<\/h1>/.exec(html) ?? /<h2>([^<]+)<\/h2>/.exec(html);
  rec.name = h?.[1]?.trim() ?? null;

  for (const t of tables) {
    for (const r of t.rows) {
      const [k, v] = r;
      if (r.length === 2 && k && v !== undefined) {
        if (k === 'Difficulty') rec.difficulty = v || null;
        if (k === 'Style') rec.style = v || null;
        if (k === 'Role') rec.role = v || null;
        if (k === 'Attack Style') rec.attackStyle = v || null;
      }
    }
  }

  // Evolution: sequence of <img alt="Name"> and <img alt="Level N"> after the "Evolution Data" heading.
  const evoStart = html.indexOf('Evolution Data');
  if (evoStart >= 0) {
    const seg = html.slice(evoStart, html.indexOf('</table>', evoStart));
    const alts = [...seg.matchAll(/<img[^>]*\balt="([^"]+)"/g)].map((m) => m[1] ?? '');
    let pendingLevel: number | null = null;
    for (const a of alts) {
      const lv = /^Level (\d+)$/.exec(a);
      if (lv) {
        pendingLevel = Number(lv[1]);
        continue;
      }
      rec.evolution.push({ name: a, level: rec.evolution.length === 0 ? 1 : pendingLevel });
      pendingLevel = null;
    }
  }

  // Stats table: header row "Level | HP | Attack | Defense | Sp. Atk | Sp. Def | Speed".
  for (const t of tables) {
    const hi = t.rows.findIndex((r) => r[0] === 'Level' && r[1] === 'HP');
    if (hi < 0) continue;
    const header = t.rows[hi] ?? [];
    const col = (name: string) => header.indexOf(name);
    for (const r of t.rows.slice(hi + 1)) {
      const lv = /^Level (\d+)$/.exec(r[0] ?? '');
      if (!lv) continue;
      const get = (name: string) => (col(name) >= 0 ? num(r[col(name)]) : null);
      rec.stats.push({
        level: Number(lv[1]),
        hp: get('HP'),
        attack: get('Attack'),
        defense: get('Defense'),
        spAttack: get('Sp. Atk'),
        spDefense: get('Sp. Def'),
        speed: get('Speed'),
      });
    }
  }

  // Ability + attacks table.
  for (const t of tables) {
    if (t.rows[0]?.[0] !== 'Ability') continue;
    let section = '';
    let i = 0;
    const rows = t.rows;
    rec.ability.name = rows[1]?.find((c) => c) ?? null;
    rec.ability.description = rows[2]?.[0] ?? null;
    for (i = 3; i < rows.length; i++) {
      const r = rows[i] ?? [];
      const nonEmpty = r.filter((c) => c);
      if (nonEmpty.length === 1 && ['Basic', 'Special 1', 'Special 2', 'Unite', 'Attacks'].includes(nonEmpty[0] ?? '')) {
        section = nonEmpty[0] ?? '';
        continue;
      }
      if (r[0] === 'Pic' && r[1] === 'Name') continue;
      if (r.length >= 5 && r[1]) {
        const descRow = rows[i + 1] ?? [];
        const descText = descRow.length > 0 && descRow.filter((c) => c).length === 1 ? (descRow[0] ?? '') : '';
        const parts = descText.split(' / ');
        const upgrade = parts.filter((p) => /^(Upgrade at Level|Activates at Level)/.test(p)).join(' / ') || null;
        const desc = parts.filter((p) => !/^(Upgrade at Level|Activates at Level)/.test(p)).join(' / ') || null;
        rec.moves.push({
          section,
          name: r[1],
          category: r[2] || null,
          style: r[3] || null,
          l15BaseDamage: r[4] || null,
          cooldownS: num(r[5]),
          description: desc,
          upgradeNote: upgrade,
        });
        if (descText) i++;
      }
    }
  }
  return rec;
}

// ---------------------------------------------------------------------------
// Mechanics / map pages -> Markdown
// ---------------------------------------------------------------------------

export async function serebiiStagePages(): Promise<string[]> {
  const { body } = await fetchCached(`${SEREBII_BASE}stages.shtml`);
  const urls = new Set<string>();
  for (const m of body.matchAll(/<a href="(stages\/[^"]+\.shtml)"/g)) urls.add(`${SEREBII_BASE}${m[1] ?? ''}`);
  return [...urls];
}

export async function serebiiPageMarkdown(url: string): Promise<{ markdown: string; retrievedAt: string; title: string }> {
  const { body, retrievedAt } = await fetchCached(url);
  const html = mainContent(body);
  const title = cellText(/<title>([\s\S]*?)<\/title>/i.exec(body)?.[1] ?? url);
  return { markdown: htmlToMarkdown(html), retrievedAt, title };
}

export async function serebiiLatestPatch(): Promise<{ version: string | null; date: string | null; url: string }> {
  const url = `${SEREBII_BASE}patch.shtml`;
  const { body } = await fetchCached(url);
  const html = mainContent(body);
  const v = /Version ([0-9][0-9.]+)/.exec(html);
  const after = v ? html.slice(v.index, v.index + 2000) : '';
  const d = /([A-Z][a-z]+ \d{1,2}(?:st|nd|rd|th)? \d{4})/.exec(cellText(after));
  return { version: v?.[1] ?? null, date: d?.[1] ?? null, url };
}
