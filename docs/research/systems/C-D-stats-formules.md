# Familles C et D — stats des unités et formules de combat (LoL | MLBB | Unite)

Statut : **relevé R1 + pistes pour R2**, à discuter. Rien n'est tranché ici.
Cadre : MLBB = squelette, objets choisis avant la partie (Unite), LoL = profondeur des stats et des formules, parties courtes, 3v3 puis 5v5 (décisions 0003 et 0004).

## Lecture

- **Confiance** : ✅ formule ou valeur écrite dans la source · ⚠️ dérivée par nous, incomplète ou contradictoire dans la source · ❓ absente de nos données.
- **Chemins abrégés** : `lol/…`, `mlbb/…`, `unite/…` = `data/reference/<jeu>/…` ; `m/` = `mechanics/`. Exemple : `lol/m/armor.md` = `data/reference/lol/mechanics/armor.md`.
- **Chiffres agrégés** : produits par `node tools/analysis/stat-summary.ts` (annexe A). Versions : LoL Data Dragon 16.20.1 ; MLBB wiki Fandom au 13/10/2026 ; Unite unite-db (journal 1.24.1.3) + Serebii.

## En bref

1. **D1 : LoL et MLBB utilisent la même formule** : dégâts × K / (K + défense), avec K = 100 (LoL) et K = 120 (MLBB). La formule de Unite (Défense, Déf. spé.) **n'est dans aucune de nos sources** ❓.
2. **Les trois jeux n'ont pas la même échelle**. Au niveau 1, la défense physique médiane vaut 30 (LoL), 19 (MLBB) et 72 (Unite), et les PV médians 620, 2511 et 3250. Pour comparer, il faut passer par le **% de dégâts subis** et le **nombre de coups pour tuer** (§0), pas par les valeurs brutes.
3. **Trois formes de croissance** :
   - LoL : quadratique explicite (gains de 72 % à 128 % de la croissance g d'un niveau à l'autre) ✅ ;
   - MLBB : linéaire par hypothèse, car seuls les niveaux 1 et 15 sont publiés ⚠️ ;
   - Unite : **géométrique**. Chaque gain vaut ×1,10, ×1,15 ou ×1,20 le précédent (selon 1, 2 ou 3 stades d'évolution), plus un saut à chaque évolution ⚠️ (constat calculé, très net).
4. **Anomalie de données** : Data Dragon 16.20.1 publie une **croissance d'AD de 0 pour les 173 champions**. Les fichiers du jeu (bins CommunityDragon) et le wiki donnent environ 3 par niveau (170 sur 173 concordent). Le script lit donc les bins du cache. ⚠️ `lol/champions.json` est à corriger à la prochaine extraction.
5. **Sans boutique en partie** (décision 0004), toute la montée en puissance vient des niveaux. C'est le cas de Unite : PV ×2,35 et Attaque ×2,5 du niveau 1 au niveau 15, avec une vitesse qui augmente aussi. Avec leurs seules stats de base, LoL et MLBB ne font que ×1,9 à ×2 (PV ×3,9 pour LoL), car le reste vient des objets.
6. **Il manque surtout** :
   - toute la couche formules de Unite (atténuation, critique, pénétration, plafonds, ciblage) ;
   - les rayons de collision de MLBB et de Unite ;
   - la vitesse de déplacement et les portées de Unite en distance réelle ;
   - les rendements décroissants des contrôles (non décrits ailleurs que dans LoL, qui n'en a pas).

---

## 0. Échelles et unités (à lire avant tout le reste)

| Grandeur | LoL | MLBB | Unite | Conversion proposée |
| --- | --- | --- | --- | --- |
| Distance | unités de jeu (u) ; portées de 125 à 650 ✅ `lol/champions.json` | « unités » wiki ; portées de 1,4 à 5 ✅ `mlbb/heroes.json` ; 1 unité = 100 points de vitesse ✅ `mlbb/m/movement-speed.md` | aucune distance publiée ; portée « Melee » ou « Ranged » seulement ❓ | Exprimer les portées en **secondes de marche** (portée ÷ vitesse de base). Par la vitesse, 1 unité MLBB ≈ 134 u LoL (335 u/s contre 2,5 unités/s). Par la portée des tours : 750 u ↔ 5,3 unités, soit 1 unité ≈ 141 u ⚠️ |
| Vitesse de déplacement | 315 à 355 u/s ✅ | 225 à 268 points, soit 2,25 à 2,68 unités/s ✅ | 3600 à 3800 au niveau 1, puis 4200 à 4400 au niveau 15, en « unités internes » ❓ | Unite : échelle inconnue, seul le rapport niv. 15 / niv. 1 ≈ 1,16 est exploitable |
| PV niveau 1 → max (médiane) | 620 → 2395 | 2511 → 4935 | 3250 → 7650 | Comparer en coups pour tuer, ci-dessous |
| Attaque niveau 1 → max (médiane) | 59 → 112 (AD) | 117 → 227 | 140 → 350 | — |
| PV ÷ attaque (coups bruts pour tuer, sans objet) | 10,5 → 21,3 | 21,5 → 21,7 | 23,2 → 21,9 | Repère de rythme de combat ⚠️ |
| Défense physique (médiane) | armure 30 → 107 | 19 → 74 | Défense 72 → 340 | **Ne jamais comparer en brut.** Comparer le % de dégâts subis |
| % de dégâts physiques subis | 77 % → 48 % | 86 % → 62 % | ❓ | Égalité LoL ↔ MLBB : 100/(100+A) = 120/(120+D), d'où **D = 1,2 × A** ✅ (algèbre) |
| Coups pour tuer après défense | 13,7 → 44,1 | 24,9 → 35,1 | ❓ | — |
| Vitesse d'attaque | attaques/s (0,47 à 0,8 au niv. 1) + ratio + croissance en % bonus ✅ | attaques/s aux niveaux 1 et 15 (0,87 à 1,22 au niv. 1) + ratio en % ✅ | **bonus en %** seulement (10 % au niv. 1 en médiane) ; cadence de base ❓ | — |
| Régénération | PV par 5 s ✅ | unité non précisée (par 1 s ou par 5 s) ⚠️ `mlbb/README.md` | « HP/5s » sur les objets tenus ⚠️ | — |

**Ce qu'il faut retenir.**
- MLBB et Unite ont des PV « gonflés » (×4 à ×5 ceux de LoL au niveau 1), mais un rapport PV/attaque proche (≈ 22 coups).
- LoL au niveau 1 est le plus létal en coups bruts (10,5), puis converge vers ≈ 21 au niveau 18, sans objet.
- Avec la défense, MLBB reste plus « mou » au début (86 % de dégâts subis contre 77 %).

**Piste pour Mythic Mayhem.**
- Adopter **l'échelle numérique de MLBB** (PV ≈ 2500 → 5000, attaque ≈ 120 → 230, défense ≈ 20 → 75), puisque MLBB est le squelette. Les chiffres de MLBB (sbires, tours, monstres) se réutilisent alors sans conversion.
- Garder une **unité de distance unique** et exprimer toutes les portées de référence en secondes de marche pour convertir LoL ou Unite.

**Manques.**
- Échelle des distances et des vitesses de Unite ❓ : à mesurer en jeu, en chronométrant une traversée de voie sur vidéo à vitesse connue.
- Unité de la régénération MLBB ❓ : à lire dans le panneau de stats en jeu.

---

## C1. Liste des stats

| Stat | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| PV | ✅ HP | ✅ HP | ✅ HP |
| Régénération des PV | ✅ HP5 (par 5 s) | ✅ hpRegen (unité ⚠️) | pas dans les stats ; objets (Leftovers, Resonant Guard) ⚠️ |
| Ressource | ✅ mana, énergie (50 par 5 s), autres ou aucune | ✅ Mana, Energy, None, Rage | ✅ aucune (`unite/pokemon.json` n'a pas de champ de ressource) |
| Attaque | ✅ AD | ✅ Physical Attack | ✅ Attack |
| Puissance | ✅ AP (0 de base) | ✅ Magic Power (0 de base pour tous) | ✅ Sp. Atk (**non nulle et croissante**) |
| Défenses | ✅ armure, RM | ✅ Physical DEF, Magic DEF (Magic DEF de 15 au niveau 1 pour presque tous) | ✅ Defense, Sp. Def |
| Vitesse d'attaque | ✅ attaques/s, ratio, croissance en % | ✅ attaques/s, ratio en % | ✅ bonus en % |
| Portée | ✅ u | ✅ unités | ⚠️ catégorie seulement |
| Vitesse de déplacement | ✅ fixe (ne croît pas) | ✅ fixe | ✅ **croît avec le niveau** (par paliers) |
| Critique | ✅ chance (0 de base), dégâts ×2 (172 champions sur 173) | ✅ chance (0), dégâts 200 % (exceptions à 140–150 %) | ✅ taux par niveau pour certains (0 à 30 % au niv. 15) ; multiplicateur ❓ |
| Vol de vie | ✅ life steal (attaques), physical vamp, spell vamp, omnivamp | ✅ lifesteal (attaques), spell vamp (compétences) | ✅ lifestealPct (0 à 25 % au niv. 15) |
| Recharges | ✅ ability haste (accélération) | ✅ CDR en % | ✅ cdrPct (0 à 25 % au niv. 15) |
| Réduction des contrôles | ✅ ténacité | ✅ résilience | ❓ pas de stat ; « hindrance resistance » sur certaines capacités ⚠️ |
| Pénétration | ✅ létalité (fixe), % d'armure, RM fixe et % | ✅ fixe et %, physique et magique | ⚠️ `penetration` sans unité (0 → 60–80 pour 6 Pokémon) ; Slick Spoon : 9 à 15 % de Déf. spé. ignorée |
| Puissance des soins et boucliers | ✅ heal and shield power | ✅ healing effect (sortant), healing received (reçu) | ⚠️ objets : Rescue Hood (soins et boucliers donnés), Big Root (soins sur soi) |
| Résistance aux ralentissements | ✅ slow resist | ❓ | ❓ |
| Rayons | ✅ gameplay, pathing, sélection, acquisition | ❓ | ❓ |
| Jauge d'ultime | — | — | ✅ `gaugeEnergy` de 75 000 à 120 000 ; stat « Energy Rate » sur un objet |

Sources : `lol/m/champion-statistic.md` (28 stats en 4 familles), `lol/champions.json`, `mlbb/heroes.json`, `mlbb/m/*` (pages par attribut), `unite/pokemon.json` (`units`), `unite/held-items.json`.

**Ce qu'il faut retenir.**
- Les trois jeux partagent le même noyau : PV, attaque, deux défenses, vitesse d'attaque, vitesse de déplacement, critique, vol de vie, recharge.
- LoL ajoute la granularité :
  - quatre formes de vampirisme ;
  - pénétration fixe ou en % ;
  - puissance des soins ;
  - résistance aux ralentissements ;
  - rayons.
- Unite simplifie : pas de ressource, et la vitesse de déplacement, le critique, la recharge et le vol de vie **viennent du niveau** (des valeurs par niveau, pas des objets).

**Piste pour Mythic Mayhem.** Le schéma de stats de LoL, réduit à environ 16 stats :

| Groupe | Stats |
| --- | --- |
| Survie | PV, régén. |
| Attaque | attaque, puissance |
| Défenses | défense physique, défense magique |
| Vitesses | vitesse d'attaque (+ ratio), vitesse de déplacement |
| Critique et pénétration | chance de critique, dégâts critiques, pénétration fixe, pénétration en % |
| Soins | vol de vie (attaques), vampirisme des sorts |
| Divers | accélération des recharges, ténacité |

En plus : les rayons comme données du pack (pas comme stats affichées).

- **Sans ressource**, comme dans Unite. Cela simplifie l'interface ; à confirmer en R2.
- Les stats de Unite qui viennent du niveau (critique, vitesse) peuvent passer dans les **paliers de niveau du pack**.

**Manques.** Unite : ténacité, résistance aux ralentissements, unité de `penetration` ❓. Pistes : tester en entraînement, ou chercher sur les pages par Pokémon de unite-db.

---

## C2. Stats de base et croissance par niveau

| | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Niveaux | 1 à 18 ✅ | 1 à 15 ✅ | 1 à 15 ✅ |
| Données publiées | base + croissance g par stat ✅ `lol/champions.json` | niveaux 1 et 15 seulement ✅ `mlbb/heroes.json` | **table complète des niveaux 1 à 15** ✅ `unite/pokemon.json` |
| Formule | `stat(n) = base + bonus + g × (n−1) × (0,7025 + 0,0175 × (n−1))` ✅ `lol/m/champion-statistic.md` | `perLevel = (niv15 − niv1) / 14`, linéaire (hypothèse du wiki) ⚠️ | aucune publiée. Constat : **gain(n+1) ≈ r × gain(n)** avec r = 1,10, 1,15 ou 1,20 pour 1, 2 ou 3 stades, plus un saut ponctuel au niveau d'évolution ⚠️ (annexe A) |
| Gain d'un niveau | g × (0,65 + 0,035 × n) pour passer au niveau n : 72 % de g au niveau 2, 100 % au niveau 10, 128 % au niveau 18 ✅ | constant | croissant de 10 à 20 % par niveau |
| Total au niveau max | base + 17 g ✅ | niv. 15 publié | niv. 15 publié |
| Part du gain atteinte à mi-parcours | 42,6 % (niv. 9,5) ⚠️ calculée | 50 % (niv. 8) | 34 % en médiane (niv. 8, PV) ⚠️ |
| Vitesse d'attaque | `VA = base + [bonus + croissance(n)] × ratio` ; la croissance compte comme du **bonus** ✅ `lol/m/attack-speed.md` | niv. 1 et 15 en attaques/s ; ratio de 30 à 100 % ✅ | bonus de 10 % → 30 % (médiane) ✅ |
| Vitesse de déplacement | fixe ✅ | fixe ✅ | par paliers. Exemple d'Absol : 3650, puis 3800 au niv. 5, 3950 au niv. 7, 4100 au niv. 9, 4250 au niv. 11 ✅ |

Ordres de grandeur par rôle (min / médiane / max) : **annexe A**. Repères :

| Repère | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| PV des Tanks ou Defenders au niveau max | 2412 | 6031 | 9900 |
| PV des Marksmen ou Attackers au niveau max | 2374 | 4397 | 6700 |
| Écart Tank ÷ tireur | ≈ 1,0 (sans objet) | ≈ 1,4 | ≈ 1,5 |

**Ce qu'il faut retenir.**
- Unite est le seul jeu à donner la courbe complète. Elle est **concentrée en fin de partie** : un tiers du gain à mi-parcours, puis ×1,1 à ×1,2 par niveau, et les évolutions comme pics de puissance.
- LoL est à peine plus précoce que le linéaire.
- Dans LoL, les rôles se distinguent **peu** par les stats de base : ce sont les objets qui font l'écart.
- Dans Unite, le rôle est **dans la courbe** : Defender à 9900 PV, Attacker à 6700.

**Piste pour Mythic Mayhem.** Sans boutique en partie, il faut la logique de Unite : des rôles différenciés par la courbe de base, et une croissance plus forte que LoL ou MLBB sans objets. Deux options à trancher en R2 :

- **(a) Formule de LoL adaptée à 15 niveaux** (proposition dérivée, non sourcée) : `stat(n) = base + g × (n−1) × (a + b × (n−1))`, avec a + 14 b = 1 pour que le niveau 15 vaille base + 14 g, et a + b = 0,72 pour garder le premier gain de LoL. On obtient **b ≈ 0,0215 et a ≈ 0,6985**.
  - Avantages : un seul nombre g par stat (facile à valider contre un budget de puissance), un pack court.
- **(b) Courbe géométrique de Unite** : `gain(n) = gain(2) × r^(n−2)`, avec r de 1,10 à 1,20, plus des bonus d'évolution.
  - Avantages : des pics lisibles, adaptés aux parties courtes.
  - Inconvénients : deux paramètres par stat, plus les sauts.
- **Recommandation** : (a) pour le moteur (formule unique, testable), avec des **paliers de niveau optionnels** dans le pack pour émuler les évolutions de Unite.
- **Valeurs de départ** : PV et attaque sur l'échelle de MLBB (§0), écarts de rôles sur le modèle de Unite.

**Manques.**
- MLBB : niveaux 2 à 14 ❓. Le relevé dans l'outil d'entraînement en jeu dira si la croissance est vraiment linéaire.
- LoL : `champions.json` porte AD/niv. = 0 (anomalie de Data Dragon) ⚠️. Il faut prendre `damagePerLevel` des bins à la prochaine extraction (`tools/extract/lol/champions.ts`).
- Unite : Duraludon, Greedent et Zoroark diffèrent selon les sources ⚠️ `unite/crosscheck-stats.json`.

---

## C3. Tailles de collision et de sélection

| | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Rayon de gameplay (hitbox) | 55 / 65 / 80 u (min / médiane / max) ; 65 par défaut ✅ `lol/champions.json` `radii.gameplay` | ❓ | ❓ |
| Rayon de déplacement (collision entre unités) | 35 u pour 117 champions sur 173 ; 25,8 à 50 u pour les autres ✅ `radii.pathfinding` | ❓ | ❓ |
| Rayon de sélection (clic) | 100 / 120 / 150 u ✅ | sans objet (pas de clic, ciblage automatique) | sans objet |
| Rayon d'acquisition (auto-attaque à l'arrêt) | 200 / 600 / 900 u ✅ | ❓ | ❓ |
| Tour | gameplay 88,4, pathing 125, sélection 130 u ✅ `lol/units.json` | ❓ | sans objet |
| Portée mesurée | bord à bord (de la source à la cible) ✅ `lol/m/champion-statistic.md` | ❓ | ❓ |

**Ce qu'il faut retenir.**
- Seul LoL publie ces rayons.
- La portée de LoL se mesure **de bord à bord** : un rayon de 65 u ajoute en fait ~65 u de portée effective contre une grosse cible.
- Un rayon de collision de 35 u, petit devant la hitbox de 65 u : les unités se chevauchent visuellement mais se bloquent peu.

**Piste pour Mythic Mayhem.**
- Prendre les **trois rayons de LoL** (gameplay, déplacement, acquisition), convertis en unités MLBB (÷ ≈ 134 à 141, §0) : hitbox ≈ 0,5 unité, collision ≈ 0,25, acquisition ≈ 4,5.
- Portées mesurées de bord à bord.
- **Pas de rayon de sélection** (ciblage automatique, D7).
- **Indicateur visuel** : cercle au sol de la taille de la hitbox sous chaque unité.

**Manques.** MLBB et Unite ❓. À mesurer sur vidéo, en comparant la taille du modèle à la portée connue d'un héros (4,8 unités pour un tireur MLBB).

---

## C4. Plafonds et paliers

| Stat | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Vitesse d'attaque | max **3,003**, min **0,2** att./s ✅ `lol/m/attack-speed.md` | max **3,0** ✅ `mlbb/m/attack-speed.md` | ❓ |
| Recharge | pas de plafond : `CD = CD_base × 100 / (100 + AH)` (rendements décroissants intégrés) ✅ `lol/m/haste.md` | **40 %**, porté à 45 % par un objet ; additif ✅ `mlbb/m/cooldown-reduction.md` | ❓ (0 à 25 % de base au niv. 15) |
| Vitesse de déplacement | soft caps : au-delà de 415, ×0,8 entre 415 et 490 et ×0,5 au-dessus de 490 ; en dessous de 220, `110 + 0,5 × VD` ✅ `lol/m/movement-speed.md` | effets atténués « à un taux inconnu » sous 230 et au-dessus de 420 ⚠️ ; ralentissement max **90 %** ✅ `mlbb/m/movement-speed.md`, `slow.md` | ❓ |
| Critique | chance ≤ 100 % ✅ | ≥ 100 % = critique garanti ✅ | ❓ |
| Ténacité ou résilience | ≤ 100 % ; durée min **0,3 s** ✅ `lol/m/tenacity.md` | durée min **0,1 s** ✅ `mlbb/m/resilience.md` | ❓ |
| Défense minimale | négatif possible ; sous 0 : `2 − 100/(100 − R)` ✅ | **−60** minimum (soit 200 % de dégâts) ✅ `mlbb/m/physical-defense.md` | ❓ |
| Réduction de dégâts | multiplicative ✅ | additive, **sans plafond** ✅ `mlbb/m/damage-reduction.md` | ❓ |

**Ce qu'il faut retenir.**
- LoL préfère les **rendements décroissants intégrés** (accélération des recharges, soft caps) aux plafonds secs.
- MLBB met des **plafonds durs** : 40 % de recharge, VA 3,0, ralentissement 90 %. C'est plus lisible pour le joueur.

**Piste pour Mythic Mayhem.**
- Plafonds durs façon MLBB pour ce que le joueur voit (VA ≤ 3,0, ralentissement ≤ 90 %, défense ≥ −60).
- Formules à rendement décroissant de LoL là où un plafond crée des seuils (recharges via l'accélération ; soft cap de la vitesse de déplacement, avec seuils convertis : 415 u/s ≈ 3,1 unités/s et 220 ≈ 1,6, soit 310 et 165 en points de vitesse MLBB ⚠️).
- **Contre-jeu** : plafonds bas sur la ténacité, pour que les contrôles gardent de la valeur.
- **Indicateur visuel** : valeur plafonnée affichée en couleur dans le panneau de stats.

**Manques.** Tous les plafonds de Unite ❓. Le taux d'atténuation de la vitesse de MLBB ❓ (mesure en jeu, avec et sans bonus de vitesse).

---

## D1. Atténuation par la défense

| | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Formule | `dégâts × 100 / (100 + R)` si R ≥ 0 ; `× (2 − 100/(100 − R))` si R < 0 ✅ `lol/m/armor.md`, `magic-resistance.md` | `dégâts × 120 / (120 + DEF)`, valable aussi en négatif jusqu'à −60 ✅ `mlbb/m/physical-defense.md`, `magic-defense.md` | ❓ « Mitigation by Defense / Sp. Def … NOT documented » `unite/m/unitedb-damage-formula.md` |
| Point à 50 % de réduction | 100 | 120 | ❓ |
| PV effectifs | `PV × (1 + R/100)` : +1 % par point, linéaire ✅ | `PV × (1 + DEF/120)` ⚠️ (algèbre) | ❓ |
| Base au niveau 1 | armure 18 à 43, RM 22 à 37 | déf. phys. 10 à 30, déf. mag. 15 (presque tous) | Déf. 35 à 120, Déf. spé. 25 à 118 |

**Ce qu'il faut retenir.**
- Formule identique en K/(K+D) : les PV effectifs croissent **linéairement** avec la défense, et la réduction en % a des rendements décroissants.
- Seule la constante change (100 ou 120).
- Unite a la même structure de stats (Défense, Déf. spé.), mais aucune source locale ne donne sa formule.
- Une formule communautaire en `600 / (600 + Déf)` circule ; elle est **absente de nos données** ❓. Si elle était juste, les valeurs de Unite (72 → 340) donneraient 89 % → 64 % de dégâts subis, du même ordre que MLBB (86 % → 62 %). C'est une hypothèse à vérifier, pas un chiffre à utiliser.

**Piste pour Mythic Mayhem.** Adopter **`dégâts × K / (K + DEF)` avec K = 120** (constante de MLBB) :
- c'est la formule de LoL, de profondeur égale ;
- l'échelle de défense de MLBB s'utilise telle quelle ;
- une armure LoL A se convertit en DEF = 1,2 × A ;
- branche négative de LoL ou plancher à −60 de MLBB : prendre **le plancher de MLBB**, plus simple ;
- **indicateur visuel** : le panneau de stats affiche « réduit de X % » à côté de la défense (comme l'infobulle de LoL) ;
- **contre-jeu** : pénétration et réduction de défense (D2), dégâts bruts (D3).

**Manques.** La formule de Unite ❓. À mesurer en jeu, en entraînement : frapper des cibles de Défense connue avec une attaque de base aux dégâts connus (formule de unite-db), puis ajuster K. Autres sources : unite-db (pages de notes), Dittobase.

---

## D2. Ordre des pénétrations et réductions

| Étape | LoL ✅ `lol/m/armor-penetration.md`, `magic-penetration.md` | MLBB `mlbb/m/physical-defense.md`, `defense-reduction.md`, `physical-penetration.md` | Unite |
| --- | --- | --- | --- |
| 1 | réduction fixe (peut descendre sous 0 ; répartie entre base et bonus au prorata) | réduction fixe (pages Physical defense et Magic defense) **ou** réduction en % (page Defense reduction) ⚠️ contradiction | ❓ |
| 2 | réduction en % (multiplicative ; ignorée si l'armure ≤ 0) | l'autre réduction | ❓ |
| 3 | pénétration en % (multiplicative ; variante « % du bonus » seulement) | pénétration en %. La page Physical penetration l'**additionne** à la réduction en % : `(100 % − %réd − %pén)` ⚠️ | Slick Spoon : « ignore 9/12/15 % de Déf. spé. » ⚠️ |
| 4 | pénétration fixe (létalité ; ne descend pas sous 0) | pénétration fixe (**peut** descendre jusqu'à −60) ✅ | `penetration` par niveau (0 → 60–80), unité ❓ |
| Notes | Les tours et les Dragons ont 30 % de pénétration d'armure ✅. La pénétration ne change pas l'armure réelle. Exemple chiffré du wiki : armure 300 traitée comme 122,3 ✅ | Les réductions sont des débuffs visibles ; la pénétration est propre à l'attaquant | ❓ |

**Ce qu'il faut retenir.**
- LoL : ordre documenté, cohérent, avec un exemple chiffré.
- MLBB : même idée, mais la source se contredit sur l'ordre (fixe puis %, ou l'inverse) et sur l'empilement (additif ou multiplicatif).
- Différence de fond : dans MLBB, la **pénétration fixe peut rendre la défense négative**, pas dans LoL.

**Piste pour Mythic Mayhem.**
- Ordre de LoL : réduction fixe → réduction en % → pénétration en % → pénétration fixe, avec un plancher à 0 pour la pénétration (pas la réduction) et un plancher global à −60.
- Garder **une seule pénétration en %** (pas la variante « bonus seulement ») pour simplifier.
- **Contre-jeu** : la réduction de défense est un débuff visible et purifiable ; la pénétration ne l'est pas.
- **Indicateur visuel** : icône « armure brisée » avec sa durée sur la cible.
- Le changement est à documenter et tester comme contrat de combat commun.

**Manques.**
- Ordre réel de MLBB ⚠️ : test en jeu avec un objet de pénétration et une compétence de réduction connue.
- Pénétration de Unite ❓.

---

## D3. Types de dégâts et critique

| | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Types | physique, magique, brut (« true ») ✅ `lol/m/damage.md` | physique, magique, brut ✅ `mlbb/m/damage.md`, `true-damage.md` | « Attack-based » et « Sp. Attack-based » (`damageType` : Physical ou Special) ✅ ; « true damage » cité 7 fois ⚠️ `unite/moves.json` |
| Dégâts bruts | ignorent les résistances et presque toutes les réductions ✅ | ignorent les défenses ; réduits par **certaines** réductions (Guardian Helmet) ; ceux des tours ne sont jamais réduits ✅ | ⚠️ « une réduction de dégâts suffisante peut empêcher… » (Suicune) |
| Ordre du calcul | amplifications et réductions en %, réduction fixe, résistances : « sans ordre particulier », les % sont multiplicatifs avec la résistance ✅ ; **boucliers après les résistances** ✅ | défenses puis réduction de dégâts (additive), puis boucliers ✅ `mlbb/m/damage-reduction.md`, `shield.md` | ❓ |
| Dégâts d'une capacité | ratios par rang (`lol/abilities.json`) | `scalings[]` (`mlbb/skills.json`) | `floor(ratio % × Atk ou SpAtk) + curseur × (niv − 1) + base` ✅ `unite/m/unitedb-damage-formula.md` |
| Chance de critique | 0 de base ; **pseudo-aléatoire** (série d'échecs, au moins 20 % de la chance manquante, série plafonnée à 5) ✅ `lol/m/critical-strike.md` | 0 de base ; aléatoire simple (« 25 % = 1 sur 4 ») ⚠️ | taux par niveau pour certains Pokémon (Absol : 5 % au niv. 5, 10 % au niv. 9) ✅ |
| Dégâts critiques | ×2 (172 champions sur 173) ✅ ; moyenne : `1 + chance × (1 + bonus)` ✅ | 200 %, plus le bonus (additif) ; exceptions de 140 à 150 % ✅ ; Blade Armor : −20 % ✅ | ❓ multiplicateur de base ; Scope Lens donne un « Critical-Hit Damage Modifier » ✅ ; Azumarill : 150 % → 170 % (spécifique) ⚠️ |
| Critique sur les structures | non, sauf exceptions ✅ | ❓ | ❓ |

**Ce qu'il faut retenir.**
- LoL et MLBB ont trois types identiques.
- Unite n'en a que deux en pratique, physique et spécial, avec le brut en exception.
- La formule de dégâts de Unite (`ratio × stat + croissance par niveau + base`) est **la plus lisible pour un pack** : la croissance par niveau est dans la capacité, pas dans un rang de sort.
- Critique pseudo-aléatoire de LoL : moins de séries frustrantes.

**Piste pour Mythic Mayhem.**
- Trois types (physique, magique, brut), avec le brut rare et réservé aux exécutions ou aux objectifs.
- Dégâts de capacité au format **Unite** : `base + croissance × (niv − 1) + ratio × stat`, sans rangs de sort. C'est compatible avec les évolutions de capacités (E2).
- Critique ×2 par défaut, avec le **pseudo-aléatoire de LoL** (déterministe à graine égale, compatible avec notre simulation).
- **Contre-jeu** du critique : un objet ou une stat de réduction des dégâts critiques (modèle Blade Armor).
- **Indicateur visuel** : couleur des chiffres de dégâts par type (orange physique, bleu magique, blanc brut), chiffre agrandi pour un critique.

**Manques.**
- Multiplicateur critique et algorithme de tirage de Unite ❓ : mesure en entraînement (dégâts affichés).
- Tirage de MLBB ❓.

---

## D4. Boucliers, soins et anti-soins

| | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Bouclier | PV temporaires après les résistances ; le bouclier qui **expire le premier** absorbe en premier ; trois sortes (tout, magique, physique) ✅ `lol/m/shield.md` | absorbe après défense et réduction ; **les boucliers se cumulent** ✅ `mlbb/m/shield.md` | Score Shield détruit avant les autres ✅ ; deux boucliers du même objet ne se cumulent pas, la durée est rafraîchie ✅ `unite/held-items.json` |
| Puissance des soins et boucliers | heal and shield power (sortant) ; Spirit Visage et autres (reçu) ✅ tableau `lol/m/grievous-wounds.md` | healing effect (sortant) + healing received (reçu), **additionnés** ✅ `mlbb/m/healing-received.md` | Rescue Hood +17 à 23 % (donnés) ; Big Root +10 à 20 % (sur soi) ✅ |
| Anti-soins | Grievous Wounds : **−40 %** des soins et de la régénération, ne se cumule pas ; **n'affecte pas les boucliers** ✅ `lol/m/grievous-wounds.md` | Lifebane : **−40 %** des soins reçus ✅ (healing received s'applique aussi aux boucliers ⚠️) `mlbb/m/healing-received.md` | Curse Bangle et Curse Incense : **−20/25/30 % pendant 1,5 s** ✅ |
| Vampirisme | life steal (attaques, après atténuation) ; physical et spell vamp : 33 % en zone ; omnivamp : 20 % contre les non-champions ✅ `lol/m/champion-statistic.md` | lifesteal (attaques), spell vamp (compétences) ; multipliés par healing received, pas par healing effect ✅ | Drain Crown : 9 à 15 % des attaques ✅ ; stat lifestealPct ✅ |
| Soin au-delà des PV max | impossible ✅ | ❓ | ❓ |

**Ce qu'il faut retenir.**
- Anti-soins à **40 %** dans LoL et MLBB, plus faible et bref dans Unite (20 à 30 % pendant 1,5 s, à réappliquer).
- LoL distingue les boucliers des soins (les anti-soins ne touchent pas les boucliers) ; MLBB passe tout par healing received.
- Les vampirismes en zone sont réduits dans LoL (33 %).

**Piste pour Mythic Mayhem.**
- Un multiplicateur **soins et boucliers donnés** et un multiplicateur **soins reçus** (modèle MLBB, deux nombres).
- **Anti-soins à 40 %**, n'affectant pas les boucliers (règle de LoL, qui donne un rôle distinct aux boucliers).
- Vampirisme des sorts en zone à 33 %.
- Ordre d'absorption : le bouclier qui expire le premier absorbe en premier (LoL), et un même objet ne cumule pas ses boucliers (Unite).
- **Contre-jeu** : anti-soins par objet tenu ; destruction de bouclier rare.
- **Indicateur visuel** : bouclier gris (ou violet ou orange s'il est typé) sur la barre de vie ; icône de soin barré sur la cible sous anti-soins.

**Manques.** Unite : règle d'empilement des boucliers de sources différentes ❓, plafond de vol de vie ❓.

---

## D5. Contrôles, ténacité et rendements décroissants

| | LoL ✅ `lol/m/crowd-control.md`, `tenacity.md` | MLBB ✅ `mlbb/m/crowd-control.md`, `resilience.md`, `control-and-slowing-immunity.md` | Unite ⚠️ `unite/moves.json` (mots-clés), `battle-items.json` |
| --- | --- | --- | --- |
| Types | 17 types, avec un tableau de ce que chacun bloque (déplacement, attaque, capacités, canalisation, sorts d'invocateur, ténacité, purge) | **4 niveaux** : Low (disarm, restrain, root, immobilize), Basic (stun, silence, terrify, taunt), High (freeze, petrify, airborne, transform), Ultimate (frozen moment, suppress) | « hindrances » : mots-clés les plus fréquents : slow, burn, frozen, launch (projection), stun, throw, shove (poussée), paralyze, sleep, confusion |
| Réduction | ténacité : groupes A, B et C ; **multiplicative dans un groupe, additive entre groupes** ; plafond 100 % ; durée ≥ 0,3 s ; **sans effet** sur airborne, drowsy, nearsight, stasis et suppression | résilience : `durée × (1 − résilience)` ; sources différentes **multiplicatives** ; durée ≥ 0,1 s ; sans effet sur airborne, knockback et suppress | Tenacity Belt (Déf. +12 à 28 % sous contrôle) ; « hindrance resistance » sur certaines capacités (ex. 15 %) ⚠️ |
| Empilement | les ralentissements ne se cumulent pas : seul **le plus fort** compte ✅ `lol/m/movement-speed.md` | les contrôles ne se cumulent pas : **le plus récent remplace** le précédent et repart à zéro ✅ ; ralentissement ≤ 90 % | ❓ |
| Rendements décroissants (contrôles répétés) | **aucun** décrit ⚠️ | **aucun** décrit ⚠️ | ❓ |
| Immunités | totale, aux déplacements forcés, aux ralentissements, au cripple (ralentissement de la VA), boucliers anti-sort | immunité aux contrôles (sauf suppress), aux ralentissements, aux projections (Yve), inciblable | **Unstoppable** (130 mentions) ; Full Heal : purge + Unstoppable 1,5 s ; Shedinja Doll : invulnérable 2 s |

**Ce qu'il faut retenir.**
- Aucun des trois jeux n'a de rendements décroissants pour les contrôles enchaînés. La limite vient de la ténacité, de l'immunité temporaire (Unstoppable) et de la règle « pas de cumul ».
- MLBB a la **classification la plus lisible** (4 niveaux).
- Unite a l'**immunité la plus simple** (un seul état, Unstoppable).

**Piste pour Mythic Mayhem.**
- Garder **environ 8 contrôles** : ralentissement, immobilisation, désarmement, silence, étourdissement, projection, provocation, suppression.
- Les ranger dans les **niveaux de MLBB** (Low, Basic, High, Ultimate), qui disent ce que la ténacité et la purge touchent.
- **Ténacité** avec la formule de MLBB : multiplicative, durée min 0,3 s (LoL).
- Non-cumul : le contrôle le plus récent remplace le précédent, et le ralentissement le plus fort l'emporte.
- **Ajout proposé** (aucun des trois jeux ne l'a, à valider) : après un contrôle dur, 0,5 s de résistance de 50 %, pour éviter les chaînes infinies à 3v3. Sinon, simplement l'**Unstoppable de Unite** sur certaines capacités.
- **Contre-jeu** : la purge (objet de combat type Full Heal) et l'Unstoppable.
- **Indicateurs visuels** : icône et barre de durée au-dessus de la cible, couleur par niveau, et contour doré pour « Unstoppable ».

**Manques.**
- Unite : liste officielle des hindrances, règles d'empilement, effet de la « hindrance resistance » ❓. La détection par mots-clés de `moves.json` donne des faux positifs (ex. « Slowbro » compté comme ralentissement).
- Vérifier sur vidéo l'absence de rendements décroissants (LoL, MLBB) : chaîne de deux étourdissements de durée connue.

---

## D6. Attaque de base

| | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Formule de VA | `VA = base + bonus × ratio` (ratio ≈ base pour la plupart : 0,64 en médiane) ; temps d'attaque = 1 / VA ✅ `lol/m/attack-speed.md` | niv. 1 et 15 en att./s ; ratio de 30 à 100 % de la VA bonus ✅ | bonus en % sur une cadence de base ❓ |
| Windup (temps avant l'impact) | `windup = 0,3 + offset` ou `castTime / totalTime` ; médiane **18,8 %** du cycle (0,5 à 36 %) ✅ `lol/champions.json` ; modificateur de windup ; 1 tick (0,033 s) non annulable ✅ | « backswing puis wind-up » accélérés par la VA ; annulé par un contrôle ou un sort ✅ ; durées ❓ | ❓ |
| Annulation | ordre avant la fin du windup = attaque perdue ; après = libre (*stutter-step*, c'est-à-dire bouger entre deux attaques) ✅ | ❓ ; Kimmy et Irithel attaquent en bougeant ✅ | Charizard attaque en bougeant (ralenti de 5 %) ✅ |
| Projectile | tête chercheuse ; vitesse 1000 à 8000 u/s (médiane 2000, 82 champions) ✅ | tête chercheuse pour les tirs à distance ; le corps-à-corps fait des dégâts de zone mais ne pose ses effets que sur la cible principale ✅ `mlbb/m/basic-attack.md` | ❓ |
| Attaque renforcée | par compétence ou par objet | par compétence ; Golden Staff : 3e attaque ✅ | **attaque boostée tous les 3 coups pour 68 Pokémon sur 103** ; tous les 4 coups (2), 5 coups (1), sur minuteur (Chandelure 5 s, Zapdos 8 s, Palkia 9 s, Tinkaton 12 s) ; aucune (Gyarados, Miraidon) ✅ `unite/pokemon.json` `boostedAttack` |
| Dégâts | 100 % AD, physiques ✅ | 100 % de l'attaque physique, exceptions listées ✅ | `damage` et `basicDamage` (ratio, curseur, base) ✅ |

**Ce qu'il faut retenir.**
- Le modèle de LoL (base + ratio, windup en %, annulation) est complet et chiffré pour 173 champions.
- L'**attaque boostée tous les 3 coups** de Unite rythme le combat sans compétence.
- MLBB ne publie pas les timings.

**Piste pour Mythic Mayhem.**
- VA, ratio et windup en % de LoL ; dégâts de l'attaque normale et de l'attaque boostée au format Unite.
- **Attaque boostée** :
  - tous les 3 coups par défaut, réglable dans le pack (3, 4 ou 5 coups, ou minuteur) ;
  - **contre-jeu** : le compteur est visible par l'adversaire, qui peut sortir de portée avant la 3e ;
  - **indicateur visuel** : 3 pastilles sous la barre de vie, et l'arme ou la main qui brille à la 3e.
- **Indicateur visuel** du windup : animation lisible, et projectile visible au-delà de 1500 u/s équivalents.

**Manques.**
- Cadence de base de Unite (att./s au bonus 0) ❓ : chronométrer sur vidéo 10 attaques d'un Pokémon niveau 1 sans objet.
- Windup de MLBB ❓ : même méthode.

---

## D7. Règles de ciblage

| | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Commande | clic droit sur la cible ; attaque-déplacement (A ou Maj + clic) vers la cible la plus proche du champion ou du curseur ✅ `lol/m/basic-attack.md` | bouton d'attaque : **verrouillage automatique** ✅ `mlbb/m/basic-attack.md` | ❓ (verrouillage automatique observé, non sourcé) |
| Auto-attaque à l'arrêt | cible la plus proche dans le rayon d'acquisition (200 à 900 u, médiane 600) ✅ | ❓ | ❓ |
| Priorité réglable | — | **Closest Target**, **Lowest HP Percent**, **Lowest Effective HP** (prend en compte pénétration, défense et PV depuis 2.2.16 ; « Lowest HP » pour Karina, Karrie, Lesley et Thamuz) ✅ `mlbb/m/patch-notes-2-2-16.md` | ❓ |
| Persistance | jusqu'à un nouvel ordre ; poursuite jusqu'au dernier point vu ✅ | après un coup sur un héros, un nouvel appui **garde la même cible**, sauf si un héros prioritaire est à portée ✅ | ❓ |
| Sorts en appui rapide | — (visée manuelle) | même réglage de priorité (cible ou point) ✅ `mlbb/m/cast-types.md` | ❓ ; certaines capacités « peuvent désormais être visées » ⚠️ patchs Serebii |
| Révélation | attaquer depuis un buisson révèle sur 300 u pendant 2 s ✅ | ❓ | ❓ |

**Ce qu'il faut retenir.** MLBB documente le système le plus adapté à notre cible (manette ou tactile, entre amis) :
- verrouillage automatique ;
- 3 priorités au choix ;
- persistance de cible ;
- la même logique pour l'appui rapide des sorts.

**Piste pour Mythic Mayhem.**
- **Modèle de MLBB** :
  - bouton d'attaque avec verrouillage ;
  - réglage de priorité (plus proche, % de PV le plus bas, PV effectifs les plus bas) ;
  - persistance après un coup ;
  - boutons « attaquer sbire » et « attaquer héros » à étudier (Unite, à sourcer).
- Option clavier-souris : clic et attaque-déplacement de LoL avec rayon d'acquisition.
- **Contre-jeu** : la priorité « PV effectifs » rend le tank visible et oriente les débats sur le placement.
- **Indicateur visuel** : anneau au sol sous la cible verrouillée, rouge pour un héros et blanc pour un sbire.

**Manques.** Unite : tout le ciblage ❓. À relever dans les menus d'options du jeu (captures) et sur vidéo.

---

## D8. Tours : cible et aggro

| | LoL ✅ `lol/m/turret.md`, `lol/units.json` | MLBB ✅ `mlbb/m/turret.md`, `attack-range.md` | Unite |
| --- | --- | --- | --- |
| Stats | tour externe : 9000 PV, AD de 182 à 350 selon les minutes, VA 0,833, portée **750 u**, armure et RM 60 ; 30 % de pénétration d'armure | portée **5,3 unités**, vision 8, 1 attaque/s, dégâts **bruts** | pas de tours (zones de but) ; Goal Hacker : bouclier et soin des zones ⚠️ |
| Montée des dégâts | Warming Up : **+50 % par coup sur un champion**, jusqu'à +150 % ; remise à zéro 5 s après le dernier coup, pas au changement de cible | **+75 % par coup** consécutif (320, 560… jusqu'à 4880, +240 par coup, plafond 20) ; remise à zéro après 2 s sans dégâts ; deux tours se cumulent | — |
| Priorité de cible | première unité entrée, gardée jusqu'à la mort, la sortie ou l'inciblabilité ; ensuite : familiers > sbires de siège ou super-sbires > … > sbires de mêlée > sbires à distance > champions | première unité entrée ; Seigneur invoqué prioritaire parmi les non-héros | — |
| Changement vers un champion | si un champion ennemi blesse un champion allié à moins de 1400 u de la tour | si un héros ennemi dans la portée blesse un héros allié un peu au-delà de la portée ; **ne change plus** une fois sur un héros | — |
| Défense sans sbires | Reinforced Armor : −80 % de dégâts sans sbire ennemi proche | −50 % sans sbire ennemi à portée ; Energy Shield les 5 premières minutes (absorbe 5000, −30 % de dégâts) | — |
| Indicateur | ❓ (ressource = compteur de Warming Up) | zone jaune, puis **rouge avec alerte sonore** quand le joueur est ciblé ✅ | — |

**Ce qu'il faut retenir.**
- Mêmes règles d'aggro dans LoL et MLBB : première unité entrée, puis bascule si on frappe un héros allié sous la tour.
- La portée de tour vaut ~2,1 à 2,2 s de marche dans les deux jeux (§0).
- MLBB punit beaucoup plus fort (+75 % par coup, bruts, sans plafond bas) et prévient mieux le joueur.

**Piste pour Mythic Mayhem.**
- Tours de MLBB (squelette) : dégâts bruts croissants, portée 5,3, et règle de bascule.
- **Indicateur jaune puis rouge avec son** (MLBB) pour la lisibilité.
- Priorité entre sbires reprise de LoL (siège > mêlée > distance), car MLBB ne la documente pas.
- **Contre-jeu** : plongée possible si un sbire ou un tank prend l'aggro ; la remise à zéro en 2 s récompense les sorties courtes.

**Manques.**
- MLBB : PV et dégâts par palier de tour, et priorité entre types de sbires ❓. À relever en partie personnalisée.
- Unite : effets chiffrés des zones de but ❓.

---

## Décisions attendues (R2)

1. **Échelle** : celle de MLBB (PV ≈ 2500 → 5000) comme unité commune ? Oui proposé.
2. **Atténuation** : `K / (K + DEF)` avec K = 120 ? Oui proposé.
3. **Croissance** : formule de LoL adaptée à 15 niveaux, avec paliers optionnels (a), ou courbe géométrique de Unite (b) ?
4. **Ressource** : aucune, comme dans Unite ?
5. **Attaque boostée** tous les 3 coups comme règle de base ?
6. **Contrôles** : niveaux de MLBB, avec ou sans résistance brève après un contrôle dur (ajout non copié) ?

---

## Annexe A — sortie de `node tools/analysis/stat-summary.ts`

<!-- Généré par `node tools/analysis/stat-summary.ts` — ne pas éditer à la main. -->
Cellules : **min / médiane / max**. Rôle = premier rôle listé (LoL : `tags[0]`, MLBB : `roles[0]`, Unite : `role`).

### LoL — 173 champions (Data Dragon 16.20.1), niveaux 1 et 18

| Stat | Assassin (n=17) | Fighter (n=50) | Mage (n=35) | Marksman (n=29) | Support (n=18) | Tank (n=24) | Tous (n=173) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PV niv. 1 | 590 / 630 / 672 | 410 / 640 / 696 | 550 / 590 / 650 | 560 / 610 / 675 | 500 / 572 / 670 | 600 / 642 / 685 | 410 / 620 / 696 |
| PV niv. 18 | 2308 / 2442 / 2623 | 1838 / 2425 / 2668 | 2114 / 2358 / 2728 | 2234 / 2374 / 2498 | 1673 / 2164 / 2660 | 2134 / 2412 / 2742 | 1673 / 2395 / 2742 |
| AD niv. 1 | 55 / 59 / 68 | 55 / 64 / 69 | 44 / 54 / 61 | 50 / 59 / 66 | 47 / 50 / 62 | 55 / 62 / 69 | 44 / 59 / 69 |
| AD niv. 18 | 89 / 113 / 125 | 80.5 / 125 / 150 | 88.2 / 105 / 116 | 90 / 110 / 138 | 50 / 101 / 122 | 104 / 120 / 148 | 50 / 112 / 150 |
| Armure niv. 1 | 21 / 31 / 37 | 22 / 35 / 40 | 18 / 22 / 34 | 23 / 26 / 33 | 24 / 27 / 40 | 24 / 35 / 43 | 18 / 30 / 43 |
| Armure niv. 18 | 89 / 104 / 117 | 94.9 / 113 / 125 | 88.7 / 101 / 117 | 92 / 99.7 / 112 | 33 / 106 / 117 | 98 / 118 / 127 | 33 / 107 / 127 |
| RM niv. 1 | 29 / 32 / 37 | 28 / 32 / 32 | 26 / 30 / 34 | 22 / 33 / 33 | 25 / 30 / 33 | 28 / 32 / 32 | 22 / 32 / 37 |
| RM niv. 18 | 52.1 / 66.8 / 71.8 | 52.1 / 66.8 / 66.8 | 48.1 / 52.1 / 75.3 | 44.1 / 51.7 / 52.1 | 43.7 / 52.1 / 66.8 | 58.6 / 66.8 / 68.1 | 43.7 / 58.4 / 75.3 |
| VA niv. 1 (att./s) | 0.63 / 0.66 / 0.69 | 0.63 / 0.65 / 0.72 | 0.61 / 0.66 / 0.69 | 0.47 / 0.66 / 0.69 | 0.63 / 0.63 / 0.67 | 0.63 / 0.66 / 0.8 | 0.47 / 0.66 / 0.8 |
| VA niv. 18 sans objet | 0.81 / 0.97 / 1.05 | 0.67 / 0.96 / 1.26 | 0.75 / 0.88 / 1.21 | 0.63 / 0.96 / 1.22 | 0.73 / 0.88 / 1.02 | 0.75 / 0.92 / 1.1 | 0.63 / 0.91 / 1.26 |
| Ratio de VA | 0.63 / 0.64 / 0.69 | 0.63 / 0.65 / 0.72 | 0.63 / 0.63 / 0.69 | 0 / 0.66 / 0.69 | 0.4 / 0.63 / 0.67 | 0.61 / 0.63 / 0.69 | 0 / 0.64 / 0.72 |
| Croissance AD (/niv., bin) | 2 / 3 / 3.9 | 1.5 / 3.5 / 5 | 2.5 / 3 / 3.75 | 2 / 3 / 4.75 | 0 / 3 / 3.5 | 2.5 / 3.45 / 5 | 0 / 3.1 / 5 |
| Croissance VA (%/niv.) | 1.5 / 3 / 3.7 | 0 / 2.6 / 6 | 1 / 2.11 / 5 | 0 / 2.8 / 4.5 | 1 / 2.27 / 3.5 | 1 / 2.15 / 3.5 | 0 / 2.5 / 6 |
| Windup (% du cycle) | 12.4 / 16.3 / 22.2 | 9.5 / 19.7 / 30 | 14 / 19 / 30 | 0.5 / 16.3 / 36 | 14 / 18.7 / 34.4 | 16 / 22.9 / 30.6 | 0.5 / 18.8 / 36 |
| Vitesse (u/s) | 330 / 340 / 345 | 330 / 343 / 355 | 325 / 335 / 340 | 325 / 330 / 340 | 325 / 330 / 340 | 315 / 335 / 345 | 315 / 335 / 355 |
| Portée (u) | 125 / 125 / 550 | 125 / 150 / 350 | 175 / 550 / 625 | 175 / 550 / 650 | 150 / 525 / 600 | 125 / 125 / 175 | 125 / 175 / 650 |
| Rayon gameplay (u) | 55 / 65 / 65 | 55 / 65 / 80 | 55 / 65 / 80 | 55 / 65 / 65 | 55 / 65 / 80 | 55 / 80 / 80 | 55 / 65 / 80 |
| Rayon sélection (u) | 100 / 120 / 135 | 100 / 120 / 140 | 100 / 120 / 150 | 100 / 115 / 140 | 100 / 120 / 140 | 100 / 125 / 140 | 100 / 120 / 150 |
| Rayon d'acquisition (u) | 400 / 400 / 600 | 200 / 600 / 775 | 400 / 575 / 800 | 500 / 775 / 900 | 350 / 550 / 800 | 300 / 600 / 600 | 200 / 600 / 900 |

AD par niveau lu dans les bins CommunityDragon du cache local (`.cache/extract/lol/`) : Data Dragon 16.20.1 publie 0 pour les 173 champions.

### MLBB — 133 héros (wiki Fandom, niveaux 1 et 15)

| Stat | Assassin (n=20) | Fighter (n=37) | Mage (n=25) | Marksman (n=20) | Support (n=13) | Tank (n=18) | Tous (n=133) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| PV niv. 1 | 2320 / 2549 / 2878 | 998 / 2600 / 2908 | 2260 / 2421 / 2880 | 2225 / 2287 / 2620 | 2221 / 2468 / 2950 | 2350 / 2615 / 2859 | 998 / 2511 / 2950 |
| PV niv. 15 | 4356 / 4746 / 5664 | 2524 / 5568 / 6250 | 4150 / 4496 / 5655 | 4052 / 4397 / 4699 | 3950 / 4902 / 5706 | 5000 / 6031 / 6900 | 2524 / 4935 / 6900 |
| Attaque phys. niv. 1 | 108 / 120 / 128 | 90 / 121 / 148 | 0 / 112 / 118 | 90 / 116 / 145 | 112 / 119 / 143 | 105 / 117 / 135 | 0 / 117 / 148 |
| Attaque phys. niv. 15 | 201 / 255 / 289 | 191 / 244 / 317 | 0 / 199 / 230 | 193 / 245 / 348 | 207 / 216 / 255 | 190 / 207 / 259 | 0 / 227 / 348 |
| Déf. phys. niv. 1 | 15 / 18 / 24 | 15 / 22 / 25 | 13 / 18 / 21 | 14 / 17 / 22 | 12 / 20 / 30 | 10 / 19.5 / 27 | 10 / 19 / 30 |
| Déf. phys. niv. 15 | 60 / 73 / 83 | 50 / 84 / 124 | 55 / 72 / 79 | 56 / 72.5 / 80 | 51 / 70 / 85 | 47 / 72.5 / 119 | 47 / 74 / 124 |
| Déf. mag. niv. 1 | 15 / 15 / 15 | 10 / 15 / 15 | 15 / 15 / 15 | 15 / 15 / 15 | 15 / 15 / 20 | 10 / 15 / 15 | 10 / 15 / 20 |
| Déf. mag. niv. 15 | 38 / 50 / 56 | 38 / 50 / 71 | 15 / 50 / 50 | 38 / 50 / 50 | 27 / 50 / 50 | 24 / 50 / 71 | 15 / 50 / 71 |
| VA niv. 1 (att./s) | 0.99 / 1.08 / 1.17 | 0.88 / 1.07 / 1.22 | 0.9 / 1 / 1.08 | 0.87 / 1.03 / 1.21 | 0.97 / 1 / 1.14 | 0.91 / 1.01 / 1.06 | 0.87 / 1.03 / 1.22 |
| VA niv. 15 (att./s) | 1.14 / 1.35 / 1.54 | 1 / 1.34 / 1.6 | 1.04 / 1.14 / 1.43 | 1 / 1.25 / 1.91 | 1.07 / 1.14 / 1.59 | 0.94 / 1.23 / 1.35 | 0.94 / 1.25 / 1.91 |
| Ratio de VA (%) | 60 / 100 / 100 | 70 / 100 / 100 | 100 / 100 / 100 | 70 / 100 / 100 | 30 / 100 / 100 | 50 / 100 / 100 | 30 / 100 / 100 |
| Vitesse | 225 / 260 / 265 | 240 / 260 / 265 | 240 / 245 / 255 | 240 / 240 / 260 | 240 / 250 / 260 | 240 / 258 / 268 | 225 / 250 / 268 |
| Portée (unités wiki) | 1.8 / 1.8 / 4.5 | 1.4 / 1.8 / 3.8 | 4.1 / 4.7 / 5 | 4.3 / 4.7 / 5 | 1.4 / 4.1 / 4.9 | 1.4 / 1.8 / 3 | 1.4 / 2 / 5 |

Portée renseignée pour 80/133 héros. Masha : PV stockés par barre (×3 en jeu), non corrigés ici.

### Pokémon Unite — 103 Pokémon (unite-db + Serebii), niveaux 1 et 15

| Stat | All-Rounder (n=37) | Attacker (n=28) | Defender (n=13) | Speedster (n=13) | Supporter (n=12) | Tous (n=103) |
| --- | --- | --- | --- | --- | --- | --- |
| PV niv. 1 | 3000 / 3250 / 3600 | 3000 / 3300 / 3406 | 3000 / 3300 / 3740 | 3000 / 3100 / 3600 | 3000 / 3278 / 3640 | 3000 / 3250 / 3740 |
| PV niv. 15 | 6800 / 7800 / 9000 | 6000 / 6700 / 7350 | 9099 / 9900 / 10400 | 6200 / 6490 / 7800 | 5900 / 9000 / 10000 | 5900 / 7650 / 10400 |
| Attaque niv. 1 | 20 / 160 / 190 | 20 / 134 / 167 | 20 / 170 / 175 | 20 / 159 / 200 | 20 / 130 / 150 | 20 / 140 / 200 |
| Attaque niv. 15 | 115 / 461 / 630 | 115 / 291 / 500 | 115 / 325 / 380 | 115 / 630 / 710 | 116 / 305 / 330 | 115 / 350 / 710 |
| Att. spé. niv. 1 | 20 / 20 / 118 | 20 / 67.5 / 200 | 20 / 20 / 96 | 20 / 20 / 118 | 20 / 45 / 106 | 20 / 20 / 200 |
| Att. spé. niv. 15 | 114 / 115 / 780 | 114 / 855 / 1050 | 114 / 117 / 460 | 114 / 118 / 720 | 120 / 635 / 850 | 114 / 119 / 1050 |
| Défense niv. 1 | 60 / 80 / 120 | 35 / 50 / 84 | 70 / 97 / 114 | 40 / 58 / 80 | 40 / 50 / 98 | 35 / 72 / 120 |
| Défense niv. 15 | 280 / 460 / 620 | 175 / 270 / 330 | 480 / 560 / 650 | 280 / 300 / 350 | 200 / 300 / 539 | 175 / 340 / 650 |
| Déf. spé. niv. 1 | 40 / 70 / 110 | 25 / 45 / 82 | 60 / 70 / 118 | 30 / 40 / 76 | 30 / 55 / 98 | 25 / 60 / 118 |
| Déf. spé. niv. 15 | 200 / 380 / 540 | 160 / 236 / 330 | 410 / 455 / 590 | 200 / 215 / 361 | 149 / 315 / 520 | 149 / 320 / 590 |
| Bonus VA niv. 1 (%) | 0 / 10 / 20 | 10 / 10 / 10 | 10 / 10 / 10 | 10 / 10 / 10 | 10 / 10 / 10 | 0 / 10 / 20 |
| Bonus VA niv. 15 (%) | 0 / 30 / 50 | 10 / 30 / 140 | 30 / 30 / 40 | 30 / 40 / 40 | 20 / 20 / 40 | 0 / 30 / 140 |
| Critique niv. 15 (%) | 0 / 20 / 30 | 0 / 0 / 30 | 0 / 0 / 0 | 0 / 10 / 10 | 0 / 0 / 0 | 0 / 10 / 30 |
| Réd. recharge niv. 15 (%) | 0 / 0 / 20 | 0 / 25 / 25 | 0 / 10 / 10 | 0 / 20 / 25 | 10 / 10 / 10 | 0 / 10 / 25 |
| Vol de vie niv. 15 (%) | 0 / 15 / 20 | 0 / 0 / 25 | 0 / 0 / 0 | 0 / 0 / 10 | 0 / 0 / 0 | 0 / 0 / 25 |
| « Pénétration » niv. 15 (sans unité) | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 30 / 80 | 0 / 0 / 0 | 0 / 0 / 80 |
| Vitesse niv. 1 (interne) | 3600 / 3700 / 3800 | 3600 / 3700 / 3700 | 3600 / 3700 / 3800 | 3650 / 3650 / 3800 | 3700 / 3700 / 3800 | 3600 / 3700 / 3800 |
| Vitesse niv. 15 (interne) | 4200 / 4300 / 4400 | 4200 / 4300 / 4300 | 4200 / 4300 / 4400 | 4250 / 4250 / 4400 | 4300 / 4300 / 4400 | 4200 / 4300 / 4400 |

Portée : catégorielle seulement (Melee 60, Ranged 43), aucune distance publiée.

### Ordres de grandeur comparés (médianes, tous rôles)

| Indicateur | LoL (niv. 1 → 18) | MLBB (niv. 1 → 15) | Unite (niv. 1 → 15) |
| --- | --- | --- | --- |
| PV médians | 620 → 2395 (×3.86) | 2511 → 4935 (×1.97) | 3250 → 7650 (×2.35) |
| Attaque médiane | 59 → 112 (×1.91) | 117 → 227 (×1.94) | 140 → 350 (×2.50) |
| PV / attaque (coups bruts pour tuer) | 10.5 → 21.3 | 21.5 → 21.7 | 23.2 → 21.9 |
| Défense physique médiane | 30 → 107 | 19 → 74 | 72 → 340 |
| Dégâts physiques subis (formule du jeu) | 77 % → 48 % | 86 % → 62 % | ❓ (formule inconnue) |
| Défense magique médiane | 32 → 58.4 | 15 → 50 | Déf. spé. 60 → 320 |
| Dégâts magiques subis | 76 % → 63 % | 89 % → 71 % | ❓ |
| Coups pour tuer après défense (PV / (attaque × multiplicateur)) | 13.7 → 44.1 | 24.9 → 35.1 | ❓ |
| Portée en secondes de marche (portée ÷ vitesse) — mêlée | 0.36 / 0.43 / 0.9 | 0.54 / 0.69 / 1.17 | ❓ |
| Portée en secondes de marche — distance | 0.98 / 1.62 / 2 | 1.25 / 1.88 / 2.08 | ❓ |
| Portée de tour en secondes de marche médiane | 750 ÷ 335 = 2.24 s | 5.3 × 100 ÷ 250 = 2.12 s | sans tour |

LoL : 173 champions ; seuil mêlée ≤ 300 u. MLBB : 80 héros avec portée ; seuil mêlée < 3 unités ; 1 unité de portée = 100 points de vitesse (wiki *Movement speed* : « x de vitesse = x/100 unités par seconde »).

### Forme des courbes de croissance

Part du gain total (niv. 1 → max) acquise à mi-parcours :

- LoL (formule quadratique), au niveau 9,5 : 42.6 % ; gain du niveau 1→2 = 72 % de g, du niveau 17→18 = 128 % de g.
- MLBB : linéaire par hypothèse du wiki (seuls niv. 1 et 15 publiés) → 50 % au niveau 8.
- Unite (PV, données niveau par niveau), au niveau 8 : 23.5 / 33.8 / 34.6 % (min / méd / max).

Unite — rapport entre deux gains consécutifs (gain(n+1) / gain(n)), hors niveaux d'évolution, par nombre de stades (**1er quartile / médiane / 3e quartile**) :

| Stades d'évolution | n | PV | Attaque | Défense | Déf. spé. |
| --- | --- | --- | --- | --- | --- |
| 1 | 36 | 1.1 / 1.1 / 1.1 | 1.08 / 1.11 / 1.13 | 1.08 / 1.1 / 1.13 | 1.08 / 1.1 / 1.13 |
| 2 | 32 | 1.15 / 1.15 / 1.15 | 1.11 / 1.14 / 1.17 | 1.12 / 1.14 / 1.17 | 1.11 / 1.14 / 1.17 |
| 3 | 35 | 1.2 / 1.2 / 1.2 | 1.18 / 1.2 / 1.23 | 1.18 / 1.2 / 1.22 | 1.18 / 1.2 / 1.23 |

