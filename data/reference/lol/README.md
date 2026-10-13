# Données de référence — League of Legends

Extraction de données publiques de League of Legends pour la recherche privée de Mythic Mayhem
(non distribuée). Usage visé : profondeur du système de stats et des formules de combat
(stats + croissance par niveau, armure/pénétration, ratios et valeurs par rang, windup, contrôle),
plus repères pour sbires, tours, monstres et expérience. **Ce ne sont pas des données de jeu
à réutiliser telles quelles** : aucun personnage, nom ou asset de LoL ne doit entrer dans le jeu.

- Patch Data Dragon : **16.20.1** (CommunityDragon `latest` = 16.20, wiki : pages au 13/10/2026).
- Scripts : `tools/extract/lol/` (TypeScript, zéro dépendance). Cache brut : `.cache/extract/lol/` (ignoré par git).

## Fichiers

| Fichier | Contenu | Enregistrements |
| --- | --- | --- |
| `champions.json` | stats de base + croissance, vitesse d'attaque (+ ratio), windup, rayons, rôles/positions (wiki), modificateurs ARAM/URF | 173 champions |
| `abilities.json` | passif + Q/W/E/R : CD/coût/portée par rang, `dataValues` par rang, formules (`calculations`), `ratios`, temps d'incantation, vitesse/largeur de missile, CC (heuristique), données brutes du sort racine et des sous-sorts | 865 capacités |
| `items.json` | tous les objets Data Dragon : stats, coût, recette (`from`/`into`), texte des passifs/actifs, cartes | 870 (254 achetables sur la Faille) |
| `summoner-spells.json` | sorts d'invocateur (Data Dragon) + formule d'effet du wiki | 34 (variantes de modes incluses) |
| `units.json` | fiches de base des sbires (Faille + ARAM), monstres de jungle, monstres épiques, tour générique | 31 |
| `mechanics/*.md` | pages de mécanique du wiki converties en Markdown (tableaux conservés), URL source en 1re ligne ; `mechanics/index.json` liste les pages | 35 pages |
| `spot-check.json` | contrôle croisé automatique des Q extraits contre les modèles de données du wiki | 8 champions |

Chaque JSON a la forme `{ source, version, retrievedAt, notes[], <enregistrements>[] }`.

## Définitions des champs

### champions.json
- `stats.*` = `{ base, perLevel }` (Data Dragon). Formule de croissance LoL :
  `stat(n) = base + perLevel × (n − 1) × (0.7025 + 0.0175 × (n − 1))` (n = niveau 1–18).
  Régénérations exprimées **par 5 secondes**.
- `stats.attackSpeed` : `base` (attaques/s au niveau 1), `perLevelPercent` (% de VA bonus par niveau,
  même formule de croissance), `ratio` (multiplicateur appliqué à la VA bonus ; bin CDragon, sinon wiki).
- `stats.critDamageMultiplier` : multiplicateur de dégâts critiques de base (2.0 en général, bin).
- `attack.windupPercent` : part du temps d'attaque consacrée au windup. `mAttackCastTime / mAttackTotalTime`
  quand le bin les donne, sinon `0.3 + attackDelayOffset` (convention confirmée par `mechanics/attack-speed.md`).
  `windupModifier` : efficacité de la VA bonus sur le windup (null = 1 par défaut).
  `missileSpeed` : vitesse du projectile d'attaque de base (distance, null pour les mêlées).
- `radii` : `gameplay` (rayon de collision de gameplay, 65 par défaut), `selection`, `selectionHeight`,
  `pathfinding`, `acquisition` (bins CDragon, wiki en secours).
- `wiki` : bloc issu de `Module:ChampionData/data` (communautaire) : type, portée, rôles, positions,
  notes de style (`ratings`), `modeModifiers` (ex. `aram.dmg_dealt`), date de sortie, dernière modif.
- `discrepancies` : écarts Data Dragon ↔ bin ↔ wiki (1 seul : Master Yi, offset arrondi).

### abilities.json
- `slot` : `P`, `Q`, `W`, `E`, `R`. `maxRank` : Data Dragon (passif = 1).
- `cooldown`, `cost`, `costType`, `range` : par rang (Data Dragon ; bin si absent).
- `castTime` (s), `missileSpeed` (u/s), `lineWidth` (u), `castRadius` (u) : bin du sort racine
  (ou premier sous-sort qui en a).
- `dataValues` : nom → valeurs **par rang 1..maxRank** (l'index 0 « rang 0 » des bins est retiré ;
  un tableau constant est réduit à une valeur). Ce sont les nombres bruts du jeu (dégâts, durées,
  pourcentages…) ; les noms sont ceux de Riot et ne sont pas normalisés.
- `calculations` : nom → formule lisible reconstruite depuis l'arbre `GameCalculation` du jeu,
  ex. `BaseDamage(80/125/170/215/260) + 0.8 × AP`. Notations : `bonus AD`, `{AutreCalcul}`,
  `byLevel(...)` (paliers par niveau du champion), `lerpByLevel(a → b)`, `stacks(buff)`, `(as %)`.
- `ratios` : toutes les mises à l'échelle trouvées : `{ calculation, stat, scaling: total|bonus|base, values, dataValue }`.
  Statistiques identifiées (enum `mStat` des bins, déduite par recoupement, voir ci-dessous) :
  `AP`, `armor`, `AD`, `attackSpeed`, `magicResist`, `moveSpeed`, `critChance`, `critDamage`,
  `maxHealth`, `lethality`. Les valeurs non identifiées restent `statN` (10 occurrences au total).
- `crowdControl` : **heuristique** (mots-clés dans le texte de l'infobulle + noms de `dataValues`) :
  `{ type, evidence, durationValues }`. À vérifier au cas par cas (faux positifs/négatifs possibles).
- `root` / `children` : nombres « bruts » du sort racine et de ses sous-sorts (recast, buffs, missiles) :
  `cooldown`, `mana`, `castRange`, `castFrame`, `spellTags`, `damageTag`, `effectAmounts` (anciens sorts),
  `coefficients`, et l'arbre de calcul brut (`calculations.*.raw`).

Enum `mStat` (déduite) : 0 AP · 1 armure · 2 AD · 4 vitesse d'attaque · 6 RM · 7 vitesse de déplacement ·
8 chance de critique · 9 dégâts critiques · 12 PV max · 29 létalité. `mStatFormula` : 0 total, 1 base, 2 bonus.
Preuves : Malphite E (armure), Galio/Rammus (RM), Hecarim/Corki (VD), Cho'Gath R (PV bonus), Pyke (létalité),
motif `1 + k × (stat9 − 1)` des critiques (dégâts critiques), Caitlyn R (chance de critique).

### Autres
- `items.json` : `stats` = clés Data Dragon (souvent incomplètes pour accélération/létalité/omnivampirisme) ;
  `statsParsed` lit le bloc `<stats>` de la description (plus complet). `maps` : noms de cartes.
- `summoner-spells.json` : `cooldown`/`range` Data Dragon ; `wiki.effect` = wikitext brut (modèles comme
  `{{pp|100 + (460-100)/17*(x-1)|...}}` donnent la formule par niveau). Variantes Arena/autres modes listées sans bloc wiki.
- `units.json` : valeurs de base des `CharacterRecord` (sbires Order, la faction Chaos est identique).

## Couverture (capacités Q/W/E/R ; passifs entre parenthèses)

| Champ | Q/W/E/R | Passifs |
| --- | --- | --- |
| `dataValues` | 99 % | 93 % |
| `calculations` | 91 % | 86 % |
| `ratios` (au moins un) | 89 % | 61 % |
| `castTime` | 90 % | 13 % |
| `missileSpeed` | 72 % | 28 % |
| `lineWidth` | 45 % | 6 % |
| `crowdControl` détecté | 51 % | 13 % |

Champions : windup 100 %, rayons 100 %, bloc wiki 100 %. Les capacités sans ratio sont en général
utilitaires (pas de dégâts) ; 7 Q/W/E/R n'ont aucun `dataValues` (Aphelios Q/E, Cho'Gath W, Fizz Q,
Kai'Sa W/E, Zoe R) : leurs nombres sont dans des sous-objets non reliés ou dans des scripts.

## Contrôle croisé (wiki)

`spot-check.json` compare les bornes des rangs et les ratios des Q avec `Template:Data <Champion>/<Capacité>` du wiki.
Annie, Ahri, Ezreal, Lux, Thresh, Yasuo : **identiques** (dégâts par rang, ratio, CD). Garen Q : le bin donne
`30–150 + 1.5 × AD` (attaque de base comprise), le wiki `30–150 (+50 % AD)` en bonus : même mécanique.
Jinx Q : la ligne « leveling » du wiki ne contient pas les dégâts de roquette (110 % AD), rien à comparer.

## Lacunes connues
- Pas de valeurs par mode (ARAM/Arena) dans `abilities.json` (les surcharges `DataValuesModeOverride` sont ignorées) ;
  les modificateurs ARAM globaux sont dans `champions.json` (`wiki.modeModifiers`).
- Types de dégâts : non normalisés (seul `root.damageTag` du bin, sémantique non vérifiée). Lire la description.
- Le CC est heuristique ; les durées ne sont présentes que si un `dataValue` porte un nom explicite.
- Croissance des sbires par vague, stats des tours par palier, plaques, montée des dégâts des tours, timers
  des monstres : scriptés côté jeu, donc **uniquement dans `mechanics/*.md`** (wiki), pas en JSON.
- Le texte des objets est celui de Riot, sans formules par niveau.
- Les formules mathématiques du wiki (MathML) sont linéarisées en texte (`d_m = d_r / (1 + R / 100)`) ;
  les icônes et navbox sont retirées. Quelques mises en forme complexes (infobox) peuvent être imparfaites.

## Relancer

```sh
node tools/extract/lol/all.ts            # tout, depuis le cache
node tools/extract/lol/all.ts --refresh  # re-télécharge (≈ 230 requêtes, ≤ 3/s)
node tools/extract/lol/champions.ts      # ou une étape : items.ts, units.ts, mechanics.ts, spot-check.ts [Champion ...]
```

Derrière un proxy HTTPS (ex. environnement cloud), préfixer par `NODE_USE_ENV_PROXY=1` (le `fetch` de Node
n'utilise pas `HTTPS_PROXY` sinon). Le patch Data Dragon le plus récent est pris automatiquement ;
`versions.json` est mis en cache comme le reste : utiliser `--refresh` pour passer au patch suivant.
User-Agent : `MythicMayhemResearch/0.1 (private hobby research)`.

## Sources, licences et conditions
- **Data Dragon** (Riot Games) — données statiques publiques. Usage soumis à la politique
  « Legal Jibber Jabber » de Riot (https://www.riotgames.com/en/legal) : projets de fans non commerciaux tolérés,
  avec la mention : *Mythic Mayhem isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games
  or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated
  properties are trademarks or registered trademarks of Riot Games, Inc.* Ces données ne doivent pas être redistribuées
  dans un produit ni servir à reproduire les champions.
- **CommunityDragon** (raw.communitydragon.org) — extraction communautaire des fichiers du jeu ; contenu © Riot Games,
  mêmes conditions. Seuls des champs numériques sont conservés ici ; les bins bruts restent dans le cache.
- **League of Legends Wiki** (wiki.leagueoflegends.com) — texte sous licence **CC BY-SA 3.0** (attribution aux
  contributeurs du wiki, partage dans les mêmes conditions si redistribué). Chaque fichier `mechanics/*.md` cite sa page.
- Aucun asset graphique ou sonore n'a été téléchargé ; aucun accès authentifié, aucune instrumentation du client.
