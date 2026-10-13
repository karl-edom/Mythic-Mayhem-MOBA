# Données de référence MLBB (Mobile Legends: Bang Bang)

Données publiques extraites du wiki Fandom MLBB (<https://mobile-legends.fandom.com>) via l'API MediaWiki uniquement, pour un usage de recherche privé (MLBB = squelette du jeu : structure de match, carte, sbires, tourelles, jungle, objectifs). Aucun asset (image, son) n'est téléchargé ; le client du jeu n'est jamais touché.

## Licence et attribution

Le contenu textuel du wiki Fandom est sous licence **CC BY-SA 3.0**. Attribution : « Mobile Legends: Bang Bang Wiki, contributeurs de mobile-legends.fandom.com ». Chaque enregistrement porte `sourceUrl` (page d'origine). Toute redistribution de ces fichiers doit conserver l'attribution et la même licence. Les noms et la propriété intellectuelle du jeu appartiennent à Moonton : ces données servent de référence de calibrage, elles ne doivent pas être reprises telles quelles dans le jeu (cf. `CLAUDE.md` : pas de personnages sous licence dans le dépôt hors `packs/local/`).

## Contenu

| Fichier | Enregistrements | Source wiki |
| --- | --- | --- |
| `heroes.json` | 134 héros (`heroes[]`) | `Module:Hero/data` (table Lua derrière `{{Infobox hero}}` et `{{Hero stats}}`) |
| `skills.json` | 608 capacités (`skills[]`) : 137 passifs, 147 skill1, 149 skill2, 155 ultimes, 20 « other » | modèles `{{Ability}}` de la section « Abilities » de chaque page héros |
| `items.json` | 113 équipements (`items[]`), dont 8 retirés | `Module:Equipment/data` |
| `battle-spells.json` | 19 sorts (14 actuels, 5 retirés) | modèles `{{Spell-box-skill}}` de la page « Battle spells » |
| `emblems.json` | 7 emblèmes + 26 talents (`emblems[]`, `talents[]`) | modèles `{{New-*-emblem-set}}` de la page « Emblems » |
| `mechanics/*.md` | 133 pages | pages de mécaniques converties wikitext → markdown, index dans `mechanics/index.json` |

Chaque JSON a la forme `{ source, retrievedAt, license, notes[], count, <collection>[] }` ; `notes[]` documente les conventions et les problèmes rencontrés.

## Définitions des champs

### heroes.json
- `roles`, `specialties`, `lanes` (Gold Lane, EXP Lane, Mid Lane, Jungle, Roaming), `attackType` (Melee/Ranged), `damageType`, `resource` (`Mana`, `Energy`, `None`, `Rage/Indicator` ; `resourceRaw` garde la valeur d'origine), `ratings` (notes 1–10 in-game), `price`.
- `stats.<stat>` = `{ level1, level15, perLevel }`. Le wiki ne stocke **que les niveaux 1 et 15** ; `perLevel = (level15 − level1) / 14` (croissance linéaire, formule du wiki lui-même).
  Stats : `hp`, `hpRegen`, `mana`, `manaRegen`, `physicalAttack`, `magicPower` (toujours 0, constante du modèle), `physicalDefense`, `magicDefense`, `attackSpeed` (attaques/s).
- Scalaires : `energy`, `energyRegen`, `attackSpeedRatioPct` (% de vitesse d'attaque bonus convertie), `movementSpeed`, `basicAttackRange` (unités du jeu), `critDamagePct` (200 % sauf Natalia 150, Lesley 140, Ling 150 — codé en dur dans `Template:Hero stats`), `armorHp` (X.Borg seulement).
- `rawStats` : valeurs brutes du module (chaînes) pour vérification.

### skills.json
- `slot` : `passive` / `skill1` / `skill2` / `ultimate` / `other` (formes alternatives, buffs d'escouade, combos de Hirara…) ; `heading` = chemin de titres d'origine.
- `cooldown`, `manaCost`, `energyCost`, `castRange`, `duration`, `rechargingTime`, `lifestealRatio`, `spellVampRatio` : `{ values: number[] | null, raw }` ; une valeur par niveau de compétence (1–6 pour les skills, 1–3 pour l'ultime), en secondes ou points. La notation `{{sl|a to b n}}` est développée linéairement.
- `scalings[]` : un élément par `{{scale}}` de la description — `baseMin`/`baseMax` (niveau 1 → niveau max), `ratios[]` (% d'une stat : Total Physical Attack, Total Magic Power, Max HP…), `damageType`.
- `levelScaling[]` : lignes « Label: v1 / v2 / … » des champs level-scaling/properties/ls-N.
- `ccTypes[]` : **heuristique par mots-clés** sur description + notes (stun, slow, airborne, knockback, suppress, taunt, silence, immobilize, petrify, freeze, charm, fear, pull, sleep, disarm…). `skillEffects` et `terms` sont les étiquettes du wiki.

### items.json
- `category` (Attack, Magic, Defense, Movement, Jungling, Roaming, mixtes), `priceTotal`, `priceUpgrade` (coût de combinaison), `tier` (dérivé : 1 + tier max des composants), `recipe`, `buildsInto`.
- `stats[]` / `uniqueStats[]` : `{ stat, value, unit: "flat" | "%" }` (les attributs « Unique » ne se cumulent pas). `passives[]` / `actives[]` : `{ name, text, numbers[] }`.
- `removed`, `availability`, `sellable`, `occupiesSlot`.

### battle-spells.json / emblems.json
- Sorts : `cooldownSeconds`, `unlockPlayerLevel` (niveau de compte), `description`, `levelScaling` (par niveau de héros 1–15), `status` (current/removed).
- Emblèmes : `attributes[]` (`stat`, `value`, `unit`), `talents[]` (`tier` 1–2 = standard, 3 = core). « Adaptive » = physique ou magique selon le bonus le plus élevé du héros ; « Hybrid » = les deux.

### mechanics/
Une page par fichier, nommé d'après la page (slug), URL source en première ligne. Les infobox (Turtle, Lord, creeps, tourelles, sbires…) sont rendues en tableaux Champ/Valeur ; pour `Jungle Infobox`, suffixe 1 = valeur initiale, 2 = gain par minute, 3 = valeur à 12 min. Les tableaux wiki sont conservés en tableaux markdown, les formules `<math>` en LaTeX `$…$`. Groupes (voir `index.json`) : carte & match (Land of Dawn, Map, Battlefield Guide, Match Details & Timestamps, Bush, Lane cutting…), lanes & rôles, structures (Turret, Sacred Statue, Altar), Minions, jungle (chaque camp, Turtle, Lord), économie (Gold, Kill, Death), sorts & emblèmes, stats de combat (dégâts, défense, pénétration, vitesse d'attaque, vol de vie, soins, boucliers, résilience, réduction de CD…), contrôles (13 types), modes de jeu (Classic, Ranked, Draft Pick, Brawl…), notes de patch récentes (1.9.06, 2.1.67, 2.1.88, 2.1.90, 2.2.16) et listes de héros par stat.

## Lacunes et valeurs incertaines

- **Dori** (héros le plus récent) : toutes les stats sont vides dans le module → `null`.
- `basicAttackRange` manque pour 54 héros (champ vide dans le module).
- Le wiki ne donne que les niveaux 1 et 15 : la croissance par niveau est supposée linéaire.
- L'unité de `hpRegen` / `manaRegen` (par seconde ou par 5 s) n'est pas précisée par le wiki.
- Peu de portées/zones/durées structurées : `castRange` (2 capacités) et `duration` (6) ; le reste est dans le texte des descriptions.
- `ccTypes` est heuristique (faux positifs possibles, par ex. « slow » dans un contexte d'immunité).
- **Absent du wiki** (pas de page dédiée trouvée) : table d'EXP par niveau, stats chiffrées des sbires (PV/attaque/croissance), PV du cristal/base, formule exacte du temps de réapparition (seule une ancienne note de patch : « 3.2 (+2.1 par niveau) (+ minutes de match) »), durée de rappel hors texte du sort Recall. Les PV et dégâts des tourelles ne sont donnés que partiellement (portée 5.3, vision 8, règles de montée en dégâts). Plusieurs pages (Gold, Map, Death, Match Details) sont des ébauches courtes et parfois datées.
- 20 pages de `Category:Equipment` (anciens objets de jungle/bottes retirés) n'ont pas d'entrée dans le module ; elles sont listées dans `items.json > notes`.
- Les pages emblèmes/talents : l'intro annonce 16 talents standard et 8 core, les modèles en listent 16 et 10.

## Relancer l'extraction

Scripts TypeScript sans dépendance dans `tools/extract/mlbb/` (Node ≥ 22.18, type stripping natif) :

```sh
node tools/extract/mlbb/all.ts            # tout (héros → capacités → objets → sorts/emblèmes → mécaniques)
node tools/extract/mlbb/heroes.ts         # ou une étape seule (skills.ts dépend de heroes.json)
node tools/extract/mlbb/all.ts --refresh  # ignore le cache et refait les requêtes
```

Derrière un proxy HTTP (environnement cloud), ajouter `NODE_USE_ENV_PROXY=1` (Node ≥ 22.21) pour que `fetch` utilise `HTTPS_PROXY`. Toutes les réponses brutes de l'API sont mises en cache dans `.cache/extract/mlbb/api/` (ignoré par git) : une relance sans `--refresh` ne fait aucune requête réseau. Débit limité à ~1,7 requête/s, User-Agent `MythicMayhemResearch/0.1 (private hobby research)`.

Fichiers : `lib.ts` (fetch en cache, parseur de tables Lua, parseur de modèles wikitext, conversion wikitext → texte/markdown), `heroes.ts`, `skills.ts`, `items.ts`, `spells-emblems.ts`, `mechanics.ts` (liste de pages par groupe + catégories explorées), `all.ts`.

## Vérification

Contrôle ponctuel contre le wikitext brut (extraction du 2026-10-13) : héros Layla, Tigreal, Fanny (16 à 19 stats chacun, temps de recharge et coûts de toutes les capacités) et objets Blade of Despair, Corrosion Scythe, Immortality (prix, coût de combinaison, stats, recette) : aucun écart.
