// Pokémon Unite reference extraction (private hobby research).
//
// Usage:  NODE_USE_ENV_PROXY=1 node tools/extract/unite/extract.ts
//   - NODE_USE_ENV_PROXY=1 is only needed behind an HTTPS proxy (Node's fetch ignores HTTPS_PROXY otherwise).
//   - Every raw response is cached under .cache/extract/unite/; reruns are offline. UNITE_REFRESH=1 refetches.
//
// Outputs (data/reference/unite/): pokemon.json, moves.json, held-items.json,
// battle-items.json, emblems.json, crosscheck-stats.json, mechanics/*.md
import { extractTables, fetchCached, num, writeOut } from './lib.ts';
import {
  UDB_URLS, heldItemStatAt, loadUniteDb, matchKey, normalizeUdbMoves, normalizeUdbStats,
  parseStatCurves, pokemonId, udbArr, udbEvolution, udbNum, udbStr, udbTags,
  type LevelStats, type UdbData,
} from './unitedb.ts';
import {
  SEREBII_BASE, fetchSerebiiPokemon, serebiiLatestPatch, serebiiPageMarkdown, serebiiPokemonIndex,
  serebiiStagePages, type SerebiiPokemon,
} from './serebii.ts';
import { DITTO_STATS_URL, loadDittoStats, type DittoStatRow } from './dittobase.ts';

const UDB_SITE = 'https://unite-db.com/';
const DAMAGE_FORMULA =
  'damage = floor(ratioPct/100 × scalingStat) + perLevel × (level − 1) + base, where scalingStat is the user\'s Attack ("Atk") or Sp. Atk ("SpAtk") at its current level. Formula as implemented by unite-db\'s front-end (damageCalc); it is the raw value before the target\'s Defense / Sp. Def mitigation, which no source used here documents.';

function latest(dates: string[]): string {
  return dates.filter(Boolean).sort().at(-1) ?? new Date().toISOString();
}

async function main(): Promise<void> {
  const udb = await loadUniteDb();
  const ditto = await loadDittoStats();
  const serebiiIndex = await serebiiPokemonIndex();
  const serebii = new Map<string, SerebiiPokemon>();
  for (const s of serebiiIndex) {
    try {
      serebii.set(matchKey(s.name), await fetchSerebiiPokemon(s.slug, s.url));
    } catch (err) {
      process.stderr.write(`serebii ${s.slug}: ${String(err)}\n`);
    }
  }
  const patch = await serebiiLatestPatch();
  const udbPatch = await unitedbLatestPatch();

  const pokemonOut = buildPokemon(udb, serebii, serebiiIndex);
  writeOut('pokemon.json', {
    source: 'unite-db.com JSON endpoints (primary); serebii.net per-Pokémon pages (evolution cross-check, Pokémon missing from unite-db)',
    retrievedAt: latest([udb.retrievedAt.pokemon, udb.retrievedAt.stats]),
    gameVersion: {
      uniteDbPatchLog: udbPatch,
      serebiiPatchPage: patch,
      note: 'No source states which patch each value reflects; unite-db stores a per-Pokémon "lastUpdated" date instead.',
    },
    notes: pokemonOut.notes,
    units: {
      hp: 'HP points', attack: 'stat points', defense: 'stat points', spAttack: 'stat points', spDefense: 'stat points',
      critRatePct: 'percent', cdrPct: 'percent (cooldown reduction)', lifestealPct: 'percent',
      attackSpeedBonusPct: 'percent bonus basic-attack speed (unite-db "attack_speed"; not attacks per second)',
      moveSpeed: 'game movement-speed units as published (e.g. 3650 at level 1 for most Pokémon)',
      penetration: 'as published by unite-db ("penetration"); unit/type not documented by the source',
      evolution: 'fromLevel = level at which that stage is reached',
    },
    pokemon: pokemonOut.records,
  });

  const movesOut = buildMoves(udb, serebii, serebiiIndex);
  writeOut('moves.json', {
    source: 'unite-db.com /pokemon.json "skills" (primary); serebii.net per-Pokémon attack tables for Pokémon missing from unite-db',
    retrievedAt: udb.retrievedAt.pokemon,
    notes: movesOut.notes,
    damageFormula: DAMAGE_FORMULA,
    units: { cooldownS: 'seconds', learnLevel: 'Pokémon level (1-15)', ratioPct: 'percent of scalingStat', perLevel: 'flat damage per level above 1', base: 'flat damage', gaugeEnergy: 'Unite gauge requirement, unite-db internal units (e.g. 80000, 100000)' },
    moves: movesOut.records,
  });

  writeOut('held-items.json', await buildHeldItems(udb));
  writeOut('battle-items.json', await buildBattleItems(udb));
  writeOut('emblems.json', buildEmblems(udb));

  const cc = buildCrosscheck(udb, ditto.rows, serebii);
  writeOut('crosscheck-stats.json', {
    source: 'Comparison of level 1-15 stats: unite-db /stats.json vs dittobase.com/unite/stats (RSC payload) vs serebii.net per-Pokémon stat tables',
    retrievedAt: latest([udb.retrievedAt.stats, ditto.retrievedAt]),
    notes: cc.notes,
    summary: cc.summary,
    pokemon: cc.records,
  });

  await buildMechanics(udb);
  process.stderr.write('done\n');
}

// ---------------------------------------------------------------------------

async function unitedbLatestPatch(): Promise<{ version: string | null; title: string | null; url: string }> {
  const url = `${UDB_SITE}patch-notes`;
  try {
    const { body } = await fetchCached(url);
    const m = /<h2 class="title">\s*Patch ([0-9.]+)\s*([^<]*)</.exec(body);
    return { version: m?.[1] ?? null, title: m?.[2]?.trim() || null, url };
  } catch {
    return { version: null, title: null, url };
  }
}

function serebiiEvolutionStages(s: SerebiiPokemon | undefined): { name: string; fromLevel: number | null }[] | null {
  if (!s || s.evolution.length === 0) return null;
  return s.evolution.map((e) => ({ name: e.name, fromLevel: e.level }));
}

function buildPokemon(udb: UdbData, serebii: Map<string, SerebiiPokemon>, index: { slug: string; name: string; url: string }[]) {
  const notes: string[] = [
    'Primary source: unite-db.com/pokemon.json (identity, tags, evolution, moves) and unite-db.com/stats.json (level 1-15 stats). These are the JSON files the unite-db front-end itself loads.',
    'Mega forms and Mewtwo X/Y are separate records, as on unite-db (they have their own stat lines and kits).',
    'boostedAttack.description is unite-db\'s basic-attack text; boostedAttack.damage holds the boosted-attack formula components.',
    'Pokémon present on Serebii but absent from unite-db are included with dataSource "serebii-only": their stats come from Serebii (HP/Atk/Def/SpA/SpD only) and fields Serebii does not publish are null.',
  ];
  const statsByName = new Map(udb.stats.map((s) => [udbStr(s, 'name') ?? '', s]));
  const records: unknown[] = [];
  const udbKeys = new Set<string>();
  for (const p of udb.pokemon) {
    const name = udbStr(p, 'name') ?? '?';
    const display = udbStr(p, 'display_name') ?? name;
    const key = matchKey(name);
    udbKeys.add(key);
    const tags = udbTags(p);
    const evo = udbEvolution(p);
    const stages: { name: string; fromLevel: number | null }[] = [];
    let from: number | null = 1;
    for (const e of evo) {
      stages.push({ name: e.name, fromLevel: from });
      from = e.level;
    }
    stages.push({ name: display, fromLevel: from });
    const ser = serebii.get(key);
    const serStages = serebiiEvolutionStages(ser);
    const recNotes: string[] = [];
    if (serStages && JSON.stringify(serStages.map((s) => s.fromLevel)) !== JSON.stringify(stages.map((s) => s.fromLevel))) {
      recNotes.push(`Serebii evolution levels differ: ${serStages.map((s) => `${s.name}@${s.fromLevel ?? '?'}`).join(' > ')}`);
    }
    if (!ser) recNotes.push('No matching Serebii page found.');
    const moves = normalizeUdbMoves(p);
    const stats = statsByName.get(name);
    const unite = moves.uniteMoves[0];
    const statRows = stats ? normalizeUdbStats(stats) : [];
    if (statRows.length !== 15) recNotes.push(`unite-db stats has ${statRows.length} levels (expected 15).`);
    records.push({
      id: pokemonId(name),
      name: display,
      uniteDbName: name,
      dataSource: 'unite-db',
      sourceUrl: UDB_URLS.pokemon,
      sourceUrls: { identityAndMoves: UDB_URLS.pokemon, stats: UDB_URLS.stats, serebiiPage: ser?.url ?? null },
      role: tags.role,
      range: tags.range,
      damageType: udbStr(p, 'damage_type'),
      difficulty: tags.difficulty,
      serebiiAttackStyle: ser?.attackStyle ?? null,
      evolution: stages,
      evolutionLevels: evo.map((e) => e.level),
      baseMoveLevels: udbArr(p, 'base_move_levels'),
      moveOptionLevels: moves.slots.map((s) => ({ slot: s.slot, learnLevels: [...new Set(s.options.map((o) => o.learnLevel))], upgradeLevels: [...new Set(s.options.map((o) => o.upgradeLevel))] })),
      uniteMove: unite ? { name: unite.name, learnLevel: unite.learnLevel, gaugeEnergy: unite.gaugeEnergy } : null,
      boostedAttack: moves.basicAttack
        ? {
            description: moves.basicAttack.description ?? moves.basicAttack.details[0]?.detailedDescription ?? null,
            detailedDescription: moves.basicAttack.details[0]?.detailedDescription ?? null,
            damage: moves.basicAttack.boosted.flatMap((b) => b.damage),
            basicDamage: moves.basicAttack.details.flatMap((b) => b.damage),
          }
        : null,
      passive: moves.passives.map((x) => x.name),
      uniteDbNotes: udbStr(p, 'notes'),
      lastUpdated: udbStr(p, 'last_updated'),
      stats: statRows,
      notes: recNotes,
    });
  }
  // Serebii-only Pokémon.
  for (const s of index) {
    const key = matchKey(s.name);
    if (udbKeys.has(key)) continue;
    const ser = serebii.get(key);
    if (!ser) continue;
    notes.push(`${s.name}: present on Serebii only (not in unite-db.com/pokemon.json at retrieval time).`);
    const stats: LevelStats[] = ser.stats.map((r) => ({
      level: r.level, hp: r.hp, attack: r.attack, defense: r.defense, spAttack: r.spAttack, spDefense: r.spDefense,
      critRatePct: null, cdrPct: null, lifestealPct: null, attackSpeedBonusPct: null, moveSpeed: r.speed, penetration: null,
    }));
    const unite = ser.moves.find((m) => m.section === 'Unite');
    const basic = ser.moves.find((m) => m.section === 'Basic');
    records.push({
      id: s.slug.replace(/[^a-z0-9]+/g, '-'),
      name: s.name,
      uniteDbName: null,
      dataSource: 'serebii-only',
      sourceUrl: ser.url,
      sourceUrls: { identityAndMoves: ser.url, stats: ser.url, serebiiPage: ser.url },
      role: ser.role,
      range: ser.style,
      damageType: ser.attackStyle ? ser.attackStyle.replace(/ Attacker$/, '') : null,
      difficulty: ser.difficulty,
      serebiiAttackStyle: ser.attackStyle,
      evolution: serebiiEvolutionStages(ser) ?? [{ name: s.name, fromLevel: 1 }],
      evolutionLevels: ser.evolution.slice(1).map((e) => e.level),
      baseMoveLevels: null,
      moveOptionLevels: null,
      uniteMove: unite ? { name: unite.name, learnLevel: num(/Level (\d+)/.exec(unite.upgradeNote ?? '')?.[1]), gaugeEnergy: null } : null,
      boostedAttack: basic ? { description: basic.description, detailedDescription: null, damage: [], basicDamage: [] } : null,
      passive: ser.ability.name ? [ser.ability.name] : [],
      uniteDbNotes: null,
      lastUpdated: null,
      stats,
      notes: ['Stats from Serebii: crit, CDR, lifesteal, attack speed, penetration not published there (null).', ...(stats.every((x) => x.moveSpeed === null) ? ['Serebii Speed column empty (moveSpeed null).'] : [])],
    });
  }
  return { records, notes };
}

function buildMoves(udb: UdbData, serebii: Map<string, SerebiiPokemon>, index: { slug: string; name: string; url: string }[]) {
  const notes = [
    'Structure per Pokémon: passives[], basicAttack (with boosted-attack formula components), slots[] (slot 1 and 2: base move learned at baseMoveLevels, then 2 options learned at learnLevel and upgraded "+" at upgradeLevel), uniteMoves[].',
    'details[] are unite-db "rsb" blocks: detailedDescription (long text), notes, damage[] formula components, upgraded* (values after the "+" upgrade).',
    'A damage component with formulaApplies=false is a textual exception (e.g. "30% of the full damage"); read its description.',
    'Unite Move cooldownS is unite-db\'s "cd" field for Unite Moves; unite-db does not define it further (it is not the gauge charge rate, which is driven by gaugeEnergy).',
    'Some Pokémon have a single option per slot (fixed upgrade path, e.g. Zapdos, Typhlosion, Mega forms): options[] then has 1 entry; Scizor/Scyther have 2 options on slot 2 only.',
    'Pokémon only on Serebii use a reduced shape (serebiiMoves) with L15 base damage text and cooldowns, no formulas.',
  ];
  const records: unknown[] = [];
  const udbKeys = new Set<string>();
  for (const p of udb.pokemon) {
    const name = udbStr(p, 'name') ?? '?';
    udbKeys.add(matchKey(name));
    records.push({
      pokemonId: pokemonId(name),
      name: udbStr(p, 'display_name') ?? name,
      dataSource: 'unite-db',
      sourceUrl: UDB_URLS.pokemon,
      baseMoveLevels: udbArr(p, 'base_move_levels'),
      fixedBaseMoves: udbStr(p, 'fixed_base_moves') === 'True',
      standardMoves: udbStr(p, 'standard_moves') === 'True',
      ...normalizeUdbMoves(p),
    });
  }
  for (const s of index) {
    const key = matchKey(s.name);
    const ser = serebii.get(key);
    if (udbKeys.has(key) || !ser) continue;
    records.push({
      pokemonId: s.slug.replace(/[^a-z0-9]+/g, '-'),
      name: s.name,
      dataSource: 'serebii-only',
      sourceUrl: ser.url,
      passives: ser.ability.name ? [{ name: ser.ability.name, description: ser.ability.description, details: [] }] : [],
      serebiiMoves: ser.moves.map((m) => ({
        ...m,
        learnOrUpgradeLevel: num(/Level (\d+)/.exec(m.upgradeNote ?? '')?.[1]),
      })),
    });
  }
  return { records, notes };
}

async function buildHeldItems(udb: UdbData) {
  const serebiiUrl = `${SEREBII_BASE}holditems.shtml`;
  const { body, retrievedAt: serRetrieved } = await fetchCached(serebiiUrl);
  const tables = extractTables(body);
  const costTable = tables.find((t) => t.rows[0]?.[0] === 'Rank' && t.rows[0]?.[1] === 'Requirement');
  const upgradeCosts = (costTable?.rows.slice(1) ?? []).map((r) => ({
    toLevel: num(r[0]),
    itemEnhancers: num(r[1]),
    cumulativeItemEnhancers: num(r[2]),
  }));
  const serList = tables.find((t) => t.rows[0]?.[1] === 'Name' && t.rows[0]?.[2] === 'Effect');
  const serByKey = new Map((serList?.rows.slice(1) ?? []).map((r) => [matchKey(r[1] ?? ''), r]));
  const levels = Array.from({ length: 40 }, (_, i) => i + 1);
  const heldItems = udb.heldItems.map((it) => {
    const name = udbStr(it, 'display_name') ?? udbStr(it, 'name') ?? '?';
    const curves = parseStatCurves(it);
    const ser = serByKey.get(matchKey(name.replace(/^Rapid Fire/, 'Rapid-Fire').replace(/^Exp Share/, 'Exp. Share')));
    return {
      id: matchKey(name),
      name,
      sourceUrl: UDB_URLS.heldItems,
      statBonuses: curves.map((c) => ({
        stat: c.label,
        unit: c.percent ? 'percent' : 'flat',
        valuesByLevel: Object.fromEntries(levels.map((l) => [l, heldItemStatAt(c, l)])),
        curve: { initial: c.initial, increment: c.increment, start: c.start, skip: c.skip, initialDiff: c.initialDiff, decimals: c.float },
      })),
      maxLevelBonusText: [udbStr(it, 'bonus1'), udbStr(it, 'bonus2')].filter((x) => x !== null),
      passive: {
        description: udbStr(it, 'description1'),
        scaledValueLabel: udbStr(it, 'description3'),
        valueAtLevel1: udbStr(it, 'level1'),
        valueAtLevel10: udbStr(it, 'level10'),
        valueAtLevel20: udbStr(it, 'level20'),
      },
      note: udbStr(it, 'note'),
      extraInfo: udbStr(it, 'extra_info'),
      serebii: ser ? { sourceUrl: serebiiUrl, effect: ser[2] ?? null, boosts: ser[3] ?? null } : null,
    };
  });
  return {
    source: 'unite-db.com/held_items.json (stats, passives); serebii.net/pokemonunite/holditems.shtml (upgrade costs, older effect/boost text)',
    retrievedAt: latest([udb.retrievedAt.heldItems, serRetrieved]),
    notes: [
      'Held items are chosen before the match (up to 3) and upgraded outside matches with Item Enhancers; there is no in-match shop.',
      'statBonuses[].valuesByLevel: item level 1..40, computed with a port of unite-db\'s own front-end formula (statcalc) from the per-stat curve parameters; levels 31-40 grow at half the increment. Values were checked against unite-db\'s level-40 "bonus" strings (maxLevelBonusText).',
      'passive.valueAtLevel1/10/20: the passive\'s scaled number at item grades (passive improves at item level 10 and 20, per both sources).',
      'Items without statBonuses are Mega Stones or special items (Rusted Sword, etc.).',
      'upgradeCosts from Serebii cover levels 2-30 only; costs for levels 31-40 are not published by the sources used (null).',
      'serebii.effect/boosts text is older than unite-db data (e.g. level-30 boost values); prefer unite-db.',
    ],
    upgradeCosts: { sourceUrl: serebiiUrl, unit: 'Item Enhancers', levels: upgradeCosts, levels31to40: null },
    heldItems,
  };
}

async function buildBattleItems(udb: UdbData) {
  const serebiiUrl = `${SEREBII_BASE}battleitems.shtml`;
  const { body, retrievedAt } = await fetchCached(serebiiUrl);
  const list = extractTables(body).find((t) => t.rows[0]?.[1] === 'Name' && t.rows[0]?.[2] === 'Effect');
  const serRows = list?.rows.slice(1) ?? [];
  const serByKey = new Map(serRows.map((r) => [matchKey(r[1] ?? ''), r]));
  const udbKeys = new Set<string>();
  const items: unknown[] = udb.battleItems.map((b) => {
    const name = udbStr(b, 'display_name') ?? '?';
    const key = matchKey(name);
    udbKeys.add(key);
    const ser = serByKey.get(key);
    return {
      id: key,
      name,
      sourceUrl: UDB_URLS.battleItems,
      mode: 'standard',
      cooldownS: udbNum(b, 'cooldown'),
      unlockTrainerLevel: udbNum(b, 'level'),
      description: udbStr(b, 'description'),
      serebii: ser ? { sourceUrl: serebiiUrl, effect: ser[2] ?? null, cooldownS: num(ser[3]), unlock: ser[4] ?? null } : null,
    };
  });
  for (const r of serRows) {
    const key = matchKey(r[1] ?? '');
    if (udbKeys.has(key)) continue;
    items.push({
      id: key,
      name: r[1] ?? '?',
      sourceUrl: serebiiUrl,
      mode: /Event|Only/.test(r[4] ?? '') ? 'event' : 'unknown',
      // Serebii lists "0 Seconds" for most event items: treated as undocumented.
      cooldownS: num(r[3]) === 0 ? null : num(r[3]),
      unlockTrainerLevel: num(/Trainer Level (\d+)/.exec(r[4] ?? '')?.[1]),
      description: r[2] ?? null,
      serebii: { sourceUrl: serebiiUrl, effect: r[2] ?? null, cooldownS: num(r[3]), unlock: r[4] ?? null },
    });
  }
  return {
    source: 'unite-db.com/battle_items.json (standard items, precise effects); serebii.net/pokemonunite/battleitems.shtml (unlock levels, event-only items)',
    retrievedAt: latest([udb.retrievedAt.battleItems, retrievedAt]),
    notes: [
      'One battle item is equipped per match; it is an active button with a cooldown.',
      'cooldownS in seconds. unlockTrainerLevel = account (trainer) level required, not in-match level; null when unite-db does not list it.',
      'Items with mode "event" exist only in limited event modes; Serebii lists most of their cooldowns as "0 Seconds", stored as null (undocumented).',
      'Known disagreements: unlock trainer level Potion 3 (unite-db) vs 4 (Serebii), Goal Getter 17 vs 16; Full Heal cooldown 60 s vs 55 s.',
      'Where unite-db and Serebii disagree (e.g. Full Heal cooldown), unite-db is used for cooldownS and the Serebii value is kept under serebii.',
    ],
    battleItems: items,
  };
}

function buildEmblems(udb: UdbData) {
  const statKey: Record<string, string> = {
    hp: 'hp', attack: 'attack', defense: 'defense', sp_attack: 'spAttack', sp_defense: 'spDefense',
    crit: 'critRatePct', cdr: 'cdrPct', move_speed: 'moveSpeed', attack_speed: 'attackSpeedBonusPct',
  };
  const emblems = udb.emblems.map((e) => {
    const stats: Record<string, number> = {};
    for (const s of udbArr(e, 'stats')) {
      for (const [k, v] of Object.entries(s)) if (typeof v === 'number') stats[statKey[k] ?? k] = v;
    }
    return {
      id: udbStr(e, 'name'),
      pokemon: udbStr(e, 'display_name'),
      pokedex: udbStr(e, 'pokedex'),
      grade: udbStr(e, 'grade'),
      colors: [udbStr(e, 'color1'), udbStr(e, 'color2')].filter((c) => c !== null),
      stats,
      sourceUrl: UDB_URLS.emblems,
    };
  });
  const colorSets = udb.emblemSets.map((s) => ({
    color: udbStr(s, 'color'),
    stat: udbStr(s, 'stat'),
    tiers: [1, 2, 3].map((i) => ({ emblemsRequired: udbNum(s, `count${i}`), bonus: udbNum(s, `bonus${i}`) })),
    bonusUnit: s['percent'] === true ? 'percent' : 'flat',
    math: udbStr(s, 'math'),
    sourceUrl: UDB_URLS.emblemSets,
  }));
  return {
    source: 'unite-db.com/emblems.json and /emblem_sets.json',
    retrievedAt: latest([udb.retrievedAt.emblems, udb.retrievedAt.emblemSets]),
    notes: [
      'Boost emblems: up to 10 equipped in a loadout before the match. Each emblem has a grade (C/B/A) and 1-2 colors; stats can be negative.',
      'emblems[].stats keys use the same names as pokemon.json stats (percent fields end in Pct); values are flat unless the key ends in Pct.',
      'colorSets: equipping N emblems of a color grants the tier bonus (bonusUnit percent = percent of the stat; math "add"/other as published).',
    ],
    emblems,
    colorSets,
  };
}

// ---------------------------------------------------------------------------
// Cross-check
// ---------------------------------------------------------------------------

function buildCrosscheck(udb: UdbData, ditto: DittoStatRow[], serebii: Map<string, SerebiiPokemon>) {
  const dittoBy = new Map<string, DittoStatRow[]>();
  for (const r of ditto) {
    const k = matchKey(r.pokemonSlug);
    dittoBy.set(k, [...(dittoBy.get(k) ?? []), r]);
  }
  const fields: [keyof LevelStats, keyof DittoStatRow][] = [
    ['hp', 'hp'], ['attack', 'attack'], ['defense', 'defense'], ['spAttack', 'specialAttack'], ['spDefense', 'specialDefense'],
    ['critRatePct', 'critRate'], ['cdrPct', 'cooldownRate'], ['lifestealPct', 'lifesteal'], ['attackSpeedBonusPct', 'attackSpeed'],
    ['moveSpeed', 'movementSpeed'], ['penetration', 'penetration'],
  ];
  const serFields: (keyof LevelStats)[] = ['hp', 'attack', 'defense', 'spAttack', 'spDefense'];
  const records: unknown[] = [];
  let dittoCompared = 0, dittoIdentical = 0, serCompared = 0, serIdentical = 0;
  for (const s of udb.stats) {
    const name = udbStr(s, 'name') ?? '?';
    const key = matchKey(name);
    const rows = normalizeUdbStats(s);
    const d = dittoBy.get(key);
    const ser = serebii.get(key);
    const dittoDiffs: string[] = [];
    if (d) {
      dittoCompared++;
      for (const r of rows) {
        const dr = d.find((x) => x.level === r.level);
        if (!dr) { dittoDiffs.push(`L${r.level}: missing`); continue; }
        for (const [a, b] of fields) if (r[a] !== dr[b]) dittoDiffs.push(`L${r.level} ${a}: unite-db ${String(r[a])} vs dittobase ${String(dr[b])}`);
      }
      if (dittoDiffs.length === 0) dittoIdentical++;
    }
    const serDiffs: string[] = [];
    if (ser && ser.stats.length > 0) {
      serCompared++;
      for (const r of rows) {
        const sr = ser.stats.find((x) => x.level === r.level);
        if (!sr) { serDiffs.push(`L${r.level}: missing`); continue; }
        for (const f of serFields) {
          const sv = sr[f as keyof typeof sr];
          if (r[f] !== sv) serDiffs.push(`L${r.level} ${f}: unite-db ${String(r[f])} vs serebii ${String(sv)}`);
        }
      }
      if (serDiffs.length === 0) serIdentical++;
    }
    records.push({
      pokemonId: pokemonId(name),
      name,
      sourceUrl: UDB_URLS.stats,
      dittobaseUrl: d ? DITTO_STATS_URL : null,
      serebiiUrl: ser?.url ?? null,
      dittobase: d ? (dittoDiffs.length === 0 ? 'identical' : dittoDiffs) : 'not on dittobase',
      serebii: ser ? (serDiffs.length === 0 ? 'identical' : { mismatches: serDiffs.length, examples: serDiffs.slice(0, 10) }) : 'not on serebii',
    });
  }
  return {
    notes: [
      'dittobase rows carry the unite-db id of each Pokémon (uniteDbId): it appears to mirror unite-db, so agreement is expected and is not independent confirmation.',
      'Serebii publishes HP/Atk/Def/SpA/SpD only (its Speed column is empty); Serebii tables are often older than the current balance patch.',
    ],
    summary: {
      uniteDbPokemon: udb.stats.length,
      comparedWithDittobase: dittoCompared,
      identicalWithDittobase: dittoIdentical,
      comparedWithSerebii: serCompared,
      identicalWithSerebii: serIdentical,
    },
    records,
  };
}

// ---------------------------------------------------------------------------
// Mechanics pages
// ---------------------------------------------------------------------------

async function buildMechanics(udb: UdbData): Promise<void> {
  const pages: [string, string][] = [
    ['serebii-mechanics', `${SEREBII_BASE}mechanics.shtml`],
    ['serebii-stages', `${SEREBII_BASE}stages.shtml`],
    ['serebii-game-modes', `${SEREBII_BASE}gamemodes.shtml`],
    ['serebii-first-to-500', `${SEREBII_BASE}firstto500.shtml`],
    ['serebii-ranked-battle', `${SEREBII_BASE}rankedbattle.shtml`],
    ['serebii-score-and-medals', `${SEREBII_BASE}score.shtml`],
    ['serebii-hold-items', `${SEREBII_BASE}holditems.shtml`],
    ['serebii-battle-items', `${SEREBII_BASE}battleitems.shtml`],
    ['serebii-boost-emblems', `${SEREBII_BASE}boostemblems.shtml`],
    ['serebii-patch-notes', `${SEREBII_BASE}patch.shtml`],
  ];
  for (const url of await serebiiStagePages()) {
    const slug = /stages\/([^/]+)\.shtml$/.exec(url)?.[1] ?? 'stage';
    pages.push([`serebii-stage-${slug}`, url]);
  }
  for (const [file, url] of pages) {
    try {
      const { markdown, retrievedAt, title } = await serebiiPageMarkdown(url);
      writeOut(`mechanics/${file}.md`, `${url}\n\n<!-- ${title} — retrieved ${retrievedAt}. Text dump (tables kept) for private reference. -->\n\n${markdown}\n`);
    } catch (err) {
      process.stderr.write(`mechanics ${url}: ${String(err)}\n`);
    }
  }
  // unite-db legacy Remoat Island map JSON.
  const rows = udb.remoatIsland.map((r) => [
    udbStr(r, 'category') ?? '', udbStr(r, 'name') ?? '', udbStr(r, 'position') ?? '', udbStr(r, 'reference_position') ?? '',
    udbStr(r, 'points') ?? '', udbStr(r, 'spawn') ?? '', udbStr(r, 'respawn') ?? '', udbStr(r, 'buff') ?? '', udbStr(r, 'final') ?? '',
  ]);
  const md = [
    UDB_URLS.remoatIsland,
    '',
    `<!-- unite-db map data used by its /maps-old page (legacy Remoat Stadium layout: Drednaw/Rotom/Zapdos era). Retrieved ${udb.retrievedAt.remoatIsland}. -->`,
    '',
    '# Remoat Island (legacy) — goals and wild Pokémon (unite-db)',
    '',
    '| Category | Name | Position | Side | Points | Spawn | Respawn | Buff | Final Stretch |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map((r) => `| ${r.map((c) => c.replace(/\|/g, '\\|').replace(/\n/g, ' ')).join(' | ')} |`),
    '',
  ].join('\n');
  writeOut('mechanics/unitedb-remoat-island-legacy.md', md);
  writeOut(
    'mechanics/unitedb-damage-formula.md',
    [
      `${UDB_SITE}_nuxt/0414581.js`,
      '',
      '<!-- Paraphrase of the damage-calculation code in unite-db\'s public front-end bundle (function damageCalc, component "rsb"). Not an official formula. -->',
      '',
      '# Move damage formula (unite-db)',
      '',
      'unite-db displays each damaging line of a move as `ratio% Atk|SpAtk + slider × (Level − 1) + base` and computes:',
      '',
      '```',
      'stat   = (dmg_type == "Atk") ? Attack : Sp. Atk      // user stat at its current level',
      'damage = floor(ratio × stat / 100) + slider × (level − 1) + base',
      '```',
      '',
      '- Lines flagged `exception: "True"` are not formula-based; their `true_desc` text describes them (e.g. "30% of the full damage").',
      '- `enhanced_*` fields hold the values after the move\'s "+" upgrade; `enhanced_cdr` is the upgraded cooldown.',
      '- Mitigation by Defense / Sp. Def, critical-hit multiplier and penetration are NOT documented by unite-db, Serebii or dittobase pages used here.',
      '',
      DAMAGE_FORMULA,
      '',
    ].join('\n'),
  );
}

main().catch((err: unknown) => {
  process.stderr.write(`${err instanceof Error ? (err.stack ?? err.message) : String(err)}\n`);
  process.exitCode = 1;
});
