# Règles v1 de la « copie mixée »

Statut : **implémentée** (`src/game/`, `data/game/`, client `web/`). Version publiée : https://claude.ai/artifact/B3W7jknsVd1jaov6BMnuTQ Elle applique les décisions 0003 à 0005 et les propositions validées dans `docs/research/comparison.md`.

Légende des valeurs :

- ✅ valeur relevée dans le jeu cité (fichier source entre parenthèses) ;
- ⚠️ valeur ancienne, communautaire, ou connue du jeu mais absente de nos extractions ;
- 🧪 valeur provisoire, à calibrer par simulation ou par mesure en jeu (`docs/research/gaps.md`).

Toutes les valeurs chiffrées vivent dans `data/game/*.json`. Ce document en explique le sens. Le moteur ne contient aucun chiffre de gameplay.

**Unités** : distances en unités Mobile Legends (ML) ; vitesse affichée ÷ 100 = unités par seconde (une vitesse de 250 donne 2,5 u/s) ✅ ; temps en secondes de partie.

## 1. Format et carte

- **Équipes** : 3 contre 3. Les places libres sont tenues par des bots. Le nombre de joueurs par équipe est un paramètre ; le 5v5 viendra plus tard.
- **Carte** : la structure de ML (`systems/A-B-structure-carte.md`), réduite.
  - Un carré de 48 × 48 u 🧪, base bleue en bas à gauche, base rouge en haut à droite, en miroir.
  - **3 voies** : haut (par le coin haut-gauche), milieu (diagonale), bas (par le coin bas-droit).
  - **Rivière** sur l'autre diagonale ; jungle dans les quatre triangles entre voies et rivière.
  - **Buissons** : une unité dans un buisson est invisible pour l'adversaire, sauf si une unité adverse est dans le même buisson ✅ (ML, sans balises).
  - **Simplification v1** : pas de murs ni de brouillard de guerre en dehors des buissons. Les murs de ML viendront avec un vrai tracé de carte.
- **Fontaine** (autel de ML) : soigne 10 % des PV et du mana toutes les 0,2 s ✅ (`mlbb/mechanics/altar.md`). Elle inflige des dégâts mortels aux ennemis qui y entrent.
- **Retour à la base** : canalisation de 5 s, annulée par un déplacement ou des dégâts ✅. Sans boutique, il sert seulement à se soigner.

## 2. Victoire et calendrier

- **Victoire** : détruire la **base adverse** ✅ (ML). Durée visée : **12 à 20 min** (décision 0005).
- **Calendrier**, celui de ML ✅ (`systems/G-…`) :

| Moment | Événement |
| --- | --- |
| 0:10 | Première vague de sbires, puis une vague toutes les 30 s |
| 0:20 – 0:40 | Apparition des camps de jungle |
| 2:00 | Apparition de la Tortue (réapparition 120 s ; plus de nouvelle Tortue si la dernière meurt après 6:00) |
| 5:00 | Fin de la protection des tours extérieures |
| 8:00 | Apparition du Seigneur (réapparition 180 s, puis 120 s après 18:00) |
| 18:00 | Le Seigneur cesse de grandir. Phase finale annoncée à l'écran. |

## 3. Structures

| Structure | PV | Dégâts / s | Défenses | Source |
| --- | --- | --- | --- | --- |
| Tour extérieure | 4 500 | 320 + 3,82 / min | 20 / 20 | ✅ ML |
| Tour intérieure | 5 500 | 360 + 3,82 / min | 20 / 20 | ✅ ML |
| Base | 7 900, +165 PV toutes les 5 s | 539 + 3,82 / min | 40 / 40 | ✅ ML |

- **En 3v3 : 2 tours par voie** (extérieure, intérieure), puis la base.
- **Portée** : 5,3 u ✅. Les tours tirent 1 fois par seconde et infligent des **dégâts bruts** ✅.
- **Dégâts croissants sur un héros** : +75 % des dégâts initiaux par coup consécutif ✅ (ML), **plafonnés à ×2,5** (plafond de LoL, décidé en R2), remis à zéro après 2 s sans tirer sur ce héros ✅.
- **Ciblage** : la première cible valide, en commençant par les sbires. La tour bascule sur un héros ennemi qui blesse un héros allié à portée ✅. Le Seigneur invoqué est prioritaire parmi les non-héros ✅.
- **Protection sans sbires** : −50 % de dégâts subis si aucun sbire ennemi n'est à portée de la tour ✅.
- **Protection de début** : les tours extérieures subissent −30 % de dégâts jusqu'à 5:00 ✅. L'or versé à ceux qui frappent ce bouclier dans ML n'est pas repris en v1.
- **Ordre de vulnérabilité** : seule la tour la plus avancée d'une voie peut être attaquée ; la base devient vulnérable dès qu'une tour intérieure est tombée ✅.
- **Indicateur à trois couleurs de ML** ✅ :
  - jaune : on est à portée ;
  - vert : la tour vise une autre cible ;
  - rouge : on est la cible, avec un son.

## 4. Sbires

- **Une vague par voie toutes les 30 s dès 0:10** ✅ (ML), composée d'un sbire de **mêlée**, d'un sbire **à distance** et d'un **canon** ✅ (voies latérales de ML ; v1 identique au milieu).
- **Super-sbire** : envoyé sur une voie dont la tour intérieure adverse est tombée ✅.
- **Stats de combat** : aucune n'est publiée pour ML ❓. On reprend les stats de LoL converties à l'échelle de ML 🧪 :
  - PV × 4, attaque × 2, portées ÷ 140 ;
  - croissance de +3 % de PV et d'attaque par minute 🧪.
- **Or** ✅ (ML) : mêlée 65, distance 33, canon 100 en début de partie, jusqu'à 120 / 90 / 150 à 30 min (croissance linéaire).
- **XP** : celle de LoL 🧪 (mêlée 62, distance 31, canon 75).
- **Comportement** : celui de LoL ✅.
  - Priorité d'aggro : héros ennemi qui attaque un héros allié, puis sbire qui attaque un héros allié, puis la cible la plus proche.
  - 60 % de dégâts contre les héros et les structures.
- **Partage** :
  - le héros qui achève un sbire prend tout l'or ;
  - si aucun héros ne l'achève, les héros proches (8 u) en prennent 80 % ⚠️ ;
  - l'XP va à tous les héros alliés à moins de 8 u, avec le partage de LoL (100 / 65 / 43,3 %) ✅.

## 5. Jungle et objectifs

### Camps de jungle (ML, loi « valeur initiale + gain par minute ») ✅

| Camp (par côté) | PV | Attaque / s | Défense | Apparition | Réapparition | Or | Bonus |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Démon de lave (orange) | 4 941 + 158,22 / min | 214 + 3,84 | 37 + 2 / min | 0:20 | 90 s | 120 ⚠️ | Âme de lave |
| Loups du tonnerre (violet) | 4 090 + 230,22 / min | 226 + 3,84 | 60 | 0:25 | 90 s | 122 ⚠️ | Âme du vent |
| Scarabée de feu | 2 501 + 126,69 / min | 113 + 2,30 | 37 | 0:39 | 70 s | 81 ⚠️ | — |
| Lézard cornu | 3 019 + 156,69 / min | 110 + 2,30 | 37 | 0:40 | 70 s | 92 ⚠️ | — |

XP des camps : 🧪 (la valeur de ML est inconnue). Laisse : un camp revient à sa place et se soigne s'il est attiré trop loin (règle de LoL).

**Bonus**, 75 s chacun ✅ :

- **Âme de lave (orange)**
  - Effet : une attaque sur un héros déclenche une frappe brute avec ralentissement (recharge 3 s) :
    - assassins, combattants et tanks : 50 + 20 % de l'attaque, ralentissement de 60 % ;
    - tireurs, mages et soutiens : 50 + 30 % de l'attaque, ralentissement de 20 %.
  - Contre-jeu : écourter les échanges pendant la recharge de 3 s.
  - Indicateur : aura orange.
- **Âme du vent (violet)**
  - Effet : −10 % de temps de recharge, −60 % de coût en mana.
  - Contre-jeu : tuer le porteur, qui perd le bonus.
  - Indicateur : aura violette.

### Tortue

Valeurs relevées sur la version d'avant le patch 2.2.16, les seules chiffrées ✅⚠️.

- PV 10 367 + 1 067,15 / min ; attaque 260 + 21,72 / min ; défense 15 + 10 / min.
- Récompenses :
  - or d'équipe : 60, 70 puis 80 par héros pour les 1ʳᵉ, 2ᵉ et 3ᵉ Tortues ;
  - XP d'équipe 🧪 ;
  - bouclier de 200 + 20 × niveau pour chaque allié, pendant 120 s.
- Contre-jeu : l'objectif est visible, et on peut le voler d'un dernier coup.
- Indicateurs : minuteur sur la minicarte, alerte à l'apparition.

### Seigneur

- PV 31 743 + 2 242 / min, arrêt de la croissance à 18:00 ; attaque brute 428 + 20,15 / min par seconde ✅.
- Récompense : **un Seigneur allié** (PV 16 218 + 1 672 / min ✅) apparaît et pousse la voie la plus faible de l'ennemi. Les tours le ciblent en priorité ✅.
- Contre-jeu : le Seigneur allié est une unité qu'on peut tuer.
- Indicateurs : contour aux couleurs de l'équipe, alerte globale.

## 6. Héros : stats et formules

- **Stats** (échelle de ML) :
  - PV, mana, régénérations ⚠️ (l'unité, par seconde ou par 5 s, n'est pas documentée ; v1 : par seconde) ;
  - attaque physique, puissance magique, défenses physique et magique ;
  - vitesse d'attaque, vitesse de déplacement, portée d'attaque ;
  - critique (dégâts critiques ×2), réduction de recharge (plafond 40 % ⚠️), vol de vie, pénétrations.
- **Valeurs aux niveaux 1 et 15** : médianes de ML par rôle ✅ (`data/reference/mlbb/heroes.json`). Exemple pour un tireur : PV 2 288 → 4 420, attaque 115 → 244, portée 4,6 u.
- **Croissance entre les deux** : la courbe de Unite ✅. Chaque gain vaut **1,15 ×** le précédent, puis la courbe est réétalonnée pour retomber exactement sur la valeur de ML au niveau 15.
- **Niveau max 15** ✅. XP pour passer du niveau n au niveau n + 1 = 180 + 100 × n (forme de LoL) 🧪, soit 13 020 XP au total.
- **XP passive** : 2 / s pour tous 🧪 (inspirée de Unite).
- **Défense** : dégâts subis = dégâts × 120 / (120 + défense) ✅ (même formule que LoL, avec la constante de ML). Défense plancher à −60.
- **Pénétrations** : réductions d'abord, puis pénétration en %, puis pénétration fixe (ordre de LoL) ✅.
- **Dégâts bruts** : ils ignorent les défenses.
- **Réapparition** : 3,2 + 2,1 × niveau + minutes de jeu ⚠️ (ancienne formule de ML), plafonnée à 60 s 🧪. Elle augmente bien avec la durée de partie, comme observé par le porteur de projet.
- **Or d'une élimination** : 300 pour le tueur ; 150 répartis entre les participants 🧪. Revenu passif : 2 or / s 🧪.

## 7. Attaque de base et ciblage

- **Cadence** : une attaque toutes les 1 / vitesse d'attaque secondes, avec un temps d'armement de 25 % de cet intervalle 🧪 (principe de LoL). Pendant l'armement, le héros est immobile, et un déplacement annule l'attaque.
- **Attaque boostée** ✅ (Unite) : **la 3ᵉ attaque de base est boostée**. Son effet dépend du héros. Contre-jeu : le compteur (3 points) est visible au-dessus du héros, et l'adversaire peut sortir de portée avant la 3ᵉ.
- **Ciblage** ✅ (ML) : la touche d'attaque verrouille la cible par priorité, d'abord le héros ennemi au plus faible % de PV à portée, sinon l'unité la plus proche. Le verrou reste tant que la cible est à portée.
- **Tour et sbires** : une attaque de base sur une tour n'est possible que si elle est vulnérable (§3).

## 8. Compétences

Décision 0005 : montée automatique et choix façon Unite.

- **Kit** : un passif (v1 : l'attaque boostée), **2 compétences**, **1 ultime** ✅ (structure de ML).
- **Déblocage** ✅ (ML) : compétence 1 au niveau 1, compétence 2 au niveau 2, ultime au niveau 4.
- **Choix A ou B** ✅ (Unite) : au niveau 5 pour la compétence 1, au niveau 7 pour la compétence 2. Chaque option modifie la compétence : dégâts, recharge, effet ajouté…
- **Amélioration « + »** ✅ (Unite) : automatique au niveau 11 (compétence 1) et au niveau 13 (compétence 2).
- **Rang de l'ultime** ✅ (ML) : aux niveaux 4, 8 et 12.
- **Dégâts** ✅ (format de Unite) : base + croissance × (niveau − 1) + ratio × stat. Les ordres de grandeur sont ceux des compétences de ML : base de 200 à 400, ratio de 60 à 100 % ; ultimes de 500 à 1 000.
- **Mana** ✅ (ML) : 500 → 1 900 ; coûts de 40 à 70 pour les compétences et de 100 à 170 pour les ultimes. Un personnage peut aussi n'utiliser aucune ressource.
- **Recharges** ✅ (ML) : 6 à 12 s pour les compétences, 30 à 50 s pour les ultimes.
- **Contrôles v1** : ralentissement, étourdissement, projection en l'air, repoussement, immobilisation, silence. Provocation et suppression viendront plus tard. Chaque contrôle a une durée, un indicateur au-dessus de la cible et un contre-jeu, décrits par personnage dans `data/game/heroes.json`.

## 9. Objets et sort

Décisions 0004 et 0005.

- **Avant la partie** : on choisit un personnage, puis **3 objets dans un ordre donné**, puis **1 sort de combat**.
- **Objets** :
  - Chaque objet reprend une **chaîne de fabrication réelle de ML** ✅ (`data/reference/mlbb/items.json`). Exemple : Dague (250 or, +15 attaque) → Épée de légion (910, +60) → Lame du désespoir (3 010, +160 attaque, +5 % de vitesse).
  - Les stats de chaque palier sont celles de l'objet de ML correspondant ✅. Les noms sont les nôtres.
- **Montée de palier automatique, sans menu** : l'or s'accumule, et le palier suivant s'achète dès que l'or suffit, où que soit le héros. Ordre :
  1. palier 1 des objets 1, 2 et 3 ;
  2. paliers 2 puis 3 de l'objet 1 ;
  3. puis ceux de l'objet 2 ;
  4. puis ceux de l'objet 3.

  Le prix d'un palier est la différence de prix entre les deux objets de ML.
- **Effets passifs des objets** : v1 avec les stats seulement. Les passifs de ML sont listés dans les données et arriveront ensuite.
- **Sorts de combat** (ML), valeurs d'effet ✅ et recharges ⚠️ (connues du jeu, absentes de l'extraction) :
  - Saut (Flicker), 4 u, 120 s ;
  - Châtiment (Retribution), 520 + 80 × niveau de dégâts bruts aux monstres et aux sbires, 35 s ;
  - Purification, retire les contrôles, 90 s ;
  - Égide (Aegis), bouclier de 750 + 50 × niveau, 90 s.

## 10. Personnages v1

Six personnages **originaux**, un par rôle de ML. Leurs stats sont les médianes du rôle. Leurs compétences reprennent la forme et les ordres de grandeur d'un héros de ML de référence, cité dans les données :

| Personnage | Rôle | Référence | Résumé |
| --- | --- | --- | --- |
| Bastion | Tank | Tigreal | onde en cône qui ralentit ; charge qui repousse ; ultime : attire et étourdit autour de lui |
| Brasier | Mage | Eudora | éclair en cône ; orbe qui étourdit ; ultime : frappe de zone retardée |
| Pique | Tireur | Layla | bombe en ligne droite ; orbe de zone ; ultime : rayon en ligne |
| Lame | Assassin | Saber | ruée qui traverse ; renforcement de l'attaque ; ultime : projette en l'air le héros ciblé |
| Roc | Combattant | Balmond | charge qui ralentit ; tourbillon de zone ; ultime : frappe brute selon les PV manquants |
| Sylve | Soutien | Estes | soin ciblé ; zone qui ralentit ; ultime : soin de zone |

Chaque compétence précise, dans les données, son **contre-jeu** et son **indicateur visuel** (règle de `CLAUDE.md`).

## 11. Interface v1

- **Avant la partie** : personnage → 3 objets (ordre) → sort → « Jouer ». Une sélection par défaut est proposée par rôle.
- **Commandes** (touches physiques, donc AZERTY et QWERTY) :
  - déplacement : ZQSD en AZERTY (WASD en QWERTY) ou flèches ;
  - attaque : Espace ou clic gauche ;
  - compétences : A, E, R en AZERTY (Q, E, R en QWERTY), visées à la souris ;
  - sort : F ; retour à la base : B ;
  - choix A ou B : touches 1 et 2.
- **En partie** : PV, mana, recharges, niveau et XP, or et prochain palier d'objet, minicarte, minuteur, score des éliminations, alertes (objectifs, choix de compétence). Barres de vie graduées par tranches de 1 000 PV ✅ (ML).
- **Fin de partie** : vainqueur, durée, éliminations, dégâts, puis « Rejouer ».
- **Visuel** : clair et jovial (herbe vert tendre, voies sable, rivière bleu clair). Les équipes se distinguent par la couleur **et** par la forme : bleu avec un anneau rond, rouge avec un anneau en losange.

## 12. Mesure et calibrage

`tools/sim-game.ts` joue des parties complètes entre bots, sans rendu. Il mesure :

- la durée des parties (cible : 12 à 20 min) ;
- les niveaux et l'or en fin de partie ;
- les éliminations ;
- les tours détruites.

Les valeurs 🧪 sont réglées par ce banc d'essai. Les mesures en jeu prévues dans `docs/research/gaps.md` les remplaceront.

## 13. Limites connues de la v1

- **Pas de murs ni de brouillard** en dehors des buissons. La carte n'a pas encore le tracé de ML.
- **Passifs des objets** : affichés, pas encore appliqués. Seules les stats comptent.
- **Contrôles** : provocation et suppression ne sont pas encore implémentées.
- **Bots** : simples. Ils tiennent leur voie, poussent derrière leurs sbires, se battent quand c'est favorable, se replient et rentrent à la base. Le jungleur fait ses camps, la Tortue et le Seigneur.
- **Commandes** : clavier et souris seulement, pas de commandes tactiles.
- **Multijoueur en ligne** : pas encore, c'est le jalon 2 (décision 0001).
- **Durée mesurée entre bots** (`npm run sim`) : de 10 à 19 min selon les compositions. Les valeurs 🧪 restent à remplacer par les mesures en jeu.
