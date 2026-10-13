# Données de référence — Pokémon Unite

Extraction privée (projet hobby, non distribué) de données publiques sur Pokémon Unite. Ces données servent de **référence** pour concevoir Mythic Mayhem. Elles ne sont pas des données de jeu et ne doivent pas être copiées telles quelles dans les packs.

- Extraction : 2026-10-13 (horodatage précis dans `retrievedAt` de chaque fichier).
- Version du jeu : aucune source ne dit à quel patch correspond chaque valeur. Dernière entrée du journal de unite-db : **1.24.1.3 « Drive to Victory »**. Première entrée de la page patch de Serebii : **1.23.2.9**. unite-db date chaque Pokémon (`lastUpdated`), du 2025-12-27 au 2026-08-23.

## Fichiers

| Fichier | Contenu | Nombre | Source principale |
| --- | --- | --- | --- |
| `pokemon.json` | identité, rôle, portée, type de dégâts, difficulté, évolutions, niveaux des capacités, stats niveaux 1–15, attaque boostée | 103 (101 unite-db + Jolteon et Flareon, présents sur Serebii seulement) | unite-db `/pokemon.json` + `/stats.json` |
| `moves.json` | passifs, attaque de base et attaque boostée, emplacements 1 et 2 (capacité de base, puis options avec niveaux d'apprentissage et d'amélioration « + »), capacité Unite | 103 Pokémon, 202 emplacements, 568 capacités, 103 capacités Unite | unite-db `/pokemon.json` (`skills`) |
| `held-items.json` | objets tenus : bonus de stats pour les niveaux 1 à 40, passif aux paliers 1, 10 et 20, coûts d'amélioration | 41 objets, coûts des niveaux 2 à 30 | unite-db `/held_items.json` ; coûts : Serebii |
| `battle-items.json` | objets de combat : temps de recharge, effet, niveau de dresseur requis | 10 standard + 14 d'événement | unite-db `/battle_items.json` ; Serebii |
| `emblems.json` | emblèmes (Pokémon, grade, couleurs, stats) et bonus de couleur | 762 emblèmes, 11 couleurs | unite-db `/emblems.json`, `/emblem_sets.json` |
| `crosscheck-stats.json` | comparaison des stats niveau par niveau entre trois sources | 101 Pokémon | unite-db, dittobase, Serebii |
| `mechanics/*.md` | pages copiées en texte, tableaux conservés ; l'URL source est sur la 1re ligne | 23 pages | Serebii (21), unite-db (2) |

Chaque fichier JSON suit la forme `{ source, retrievedAt, notes[], …, <enregistrements>[] }`. Chaque enregistrement porte un `sourceUrl`.

## Sources et méthode

- **unite-db.com** (source principale). Son front-end Nuxt charge des fichiers JSON publics depuis sa propre origine : `/pokemon.json`, `/stats.json`, `/held_items.json`, `/battle_items.json`, `/emblems.json`, `/emblem_sets.json`, `/remoat_island.json`. On les lit directement, sans analyser de HTML. Deux formules viennent de son bundle JS public :
  - dégâts : `floor(ratio% × Atk|SpAtk) + slider × (niveau − 1) + base` (voir `mechanics/unitedb-damage-formula.md`) ;
  - courbe des objets tenus (`statcalc`) : portée en TypeScript. Les 57 valeurs calculées au niveau 40 correspondent aux textes `bonus` de unite-db.
- **dittobase.com/unite/stats** : application Next.js (App Router). Il n'y a pas de `__NEXT_DATA__` : les données sont dans le flux RSC (`self.__next_f.push`). On le décode, puis on extrait le tableau `stats` (1365 lignes, soit 91 Pokémon × 15 niveaux). dittobase sert seulement au contrôle croisé. Ses lignes portent un `uniteDbId` : le site semble recopier unite-db.
- **serebii.net/pokemonunite** : HTML statique en windows-1252, avec un peu de texte mal encodé en double, corrigé par l'outil. Usages : tableaux de stats par Pokémon (contrôle croisé), chaîne d'évolution (contrôle), Pokémon absents de unite-db, coûts d'amélioration des objets tenus, objets de combat d'événement, et pages de mécanique (stages, modes, First to 500, classé, score, emblèmes, patchs).

## Définition des champs principaux

### `pokemon.json`

- `stats[]` (15 niveaux) : `hp`, `attack`, `defense`, `spAttack`, `spDefense` en points ; `critRatePct`, `cdrPct`, `lifestealPct` en % ; `attackSpeedBonusPct` est un **bonus** de vitesse d'attaque en %, pas un nombre d'attaques par seconde ; `moveSpeed` est en unités internes (3650 au niveau 1 pour la plupart) ; `penetration` est publié sans unité.
- `evolution[]` : `{ name, fromLevel }`, le niveau à partir duquel ce stade est atteint. `evolutionLevels` reprend les niveaux d'évolution bruts de unite-db.
- `baseMoveLevels` : niveaux d'apprentissage des deux capacités de base (souvent `[1,3]`). `moveOptionLevels` : niveaux de choix et d'amélioration de chaque emplacement (souvent 5/11 et 7/13).
- `uniteMove` : nom, niveau d'apprentissage, `gaugeEnergy` (besoin de la jauge Unite, en unités internes : 75 000 à 120 000).
- `boostedAttack` : description, et composantes de dégâts de l'attaque boostée (`damage`) et de l'attaque normale (`basicDamage`).
- `dataSource` vaut `unite-db` ou `serebii-only`.

### `moves.json`

- `details[]` (blocs « rsb » de unite-db) : `detailedDescription`, `notes`, `damage[]` et leurs versions après l'amélioration « + » (`upgradedDescription`, `upgradedCooldownS`, `upgradedDamage[]`).
- Composante de dégâts : `{ label, ratioPct, scalingStat: "Atk"|"SpAtk", perLevel, base, formulaApplies }`. Quand `formulaApplies` vaut false, la valeur est donnée en texte dans `description`.
- `cooldownS` est en secondes. Pour une capacité Unite, `cooldownS` reprend le champ `cd` de unite-db, que le site ne définit pas.

### `held-items.json`

- `statBonuses[].valuesByLevel` : valeurs aux niveaux 1 à 40 (`unit` vaut `flat` ou `percent`).
- `passive.valueAtLevel1|10|20` : valeur du passif à chaque palier.
- `upgradeCosts` : coût en Item Enhancers pour chaque niveau de 2 à 30.

## Contrôle croisé des stats (`crosscheck-stats.json`)

- unite-db et dittobase : 88 Pokémon sur 91 identiques. Trois diffèrent, et dittobase y rejoint Serebii, pas unite-db :
  - **Duraludon** : PV niveau 1 à 3200 sur unite-db, 3000 sur dittobase et Serebii ; niveau 15 à 6000 contre 5397.
  - **Greedent** : Déf. et Déf. Spé. différentes, par exemple Déf. Spé. niveau 15 à 420 contre 460.
  - **Zoroark** : PV, Déf. et Déf. Spé. différents de quelques points.
  - Cause probable : un rééquilibrage pris en compte d'un côté seulement. Non tranché.
- unite-db et Serebii : 32 Pokémon sur 100 identiques. Serebii est souvent en retard :
  - **Absol** : PV niveau 2 à 3114 sur unite-db, 3187 sur Serebii ;
  - **Charizard** : PV niveau 7 à 4516 contre 4066 ;
  - **Pikachu** : Déf. niveau 3 à 50 contre 45.
- Évolutions : unite-db et Serebii diffèrent pour Mega Gyarados et Mega Lucario. Serebii montre l'étape de méga-évolution au niveau 9 ; unite-db fait commencer Mega Lucario en méga.

## Lacunes et incertitudes

Aucune des trois sources ne donne de valeurs pour :
- la table d'expérience par niveau ;
- les temps de réapparition des joueurs ;
- le temps de marque selon le nombre de points portés ;
- les PV et boucliers des zones de but sur Theia Sky Ruins ;
- la charge de la jauge Unite dans le temps ;
- la formule d'atténuation par Déf. et Déf. Spé., le multiplicateur de critique et la pénétration ;
- la durée de la phase finale (seulement « final 2 minutes » sur les pages de stage).

Le fichier `mechanics/unitedb-remoat-island-legacy.md` décrit l'**ancienne** carte (Drednaw, Rotom, Zapdos), avec les seuils de destruction des buts (80 et 100 points). La carte actuelle (Theia Sky Ruins : Regieleki, Regis, Rayquaza) est décrite par Serebii, avec les points, l'apparition, les PV, l'attaque et l'expérience de base de chaque camp.

Autres points à savoir :
- Pokémon à un seul choix par emplacement (Zapdos, Typhlosion, formes Méga, etc.) : ce sont des données réelles, pas un bug.
- Scyther n'a pas de page Serebii.
- Jolteon et Flareon n'existent que sur Serebii. Leurs crit, CDR, vol de vie, vitesse d'attaque et pénétration valent donc null.
- Coûts d'amélioration des objets tenus pour les niveaux 31 à 40 : inconnus (null).
- Désaccords sur les objets de combat entre unite-db et Serebii : niveau de dresseur de Potion (3 contre 4) et de Goal Getter (17 contre 16), recharge de Full Heal (60 s contre 55 s). La valeur gardée est celle de unite-db ; celle de Serebii est conservée dans `serebii`.
- `mechanics/serebii-patch-notes.md` est volumineux (≈220 ko) : c'est l'historique complet des patchs.

## Relancer l'extraction

```sh
NODE_USE_ENV_PROXY=1 node tools/extract/unite/extract.ts   # NODE_USE_ENV_PROXY seulement derrière un proxy HTTPS
UNITE_REFRESH=1 NODE_USE_ENV_PROXY=1 node tools/extract/unite/extract.ts   # ignore le cache et retélécharge tout
```

- Cache brut : `.cache/extract/unite/` (ignoré par git). Une relance lit le cache, sans aucune requête réseau.
- Débit limité à environ 1,7 requête par seconde, avec l'User-Agent `MythicMayhemResearch/0.1 (private hobby research)`.
- Aucun asset (image, son) n'est téléchargé.
- Code : `tools/extract/unite/` contient `lib.ts` (cache, HTML vers Markdown), `unitedb.ts`, `dittobase.ts`, `serebii.ts` et `extract.ts` (point d'entrée). Aucune dépendance.
