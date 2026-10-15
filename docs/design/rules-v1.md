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
- **Carte** : la structure de ML (`systems/A-B-structure-carte.md`).
  - Un carré de **68 × 68 u** ✅, base bleue en bas à gauche, base rouge en haut à droite, en miroir. Taille mesurée sur la vidéo d'une partie de ML : un héros à 240 de vitesse traverse la largeur de la carte en 28 s environ (`docs/research/video-ml-2026-10-14.md`). Toute la carte est générée par `node tools/gen-map.ts --size 68` ; les couloirs, poches et fosses gardent leur largeur, les positions suivent la taille.
  - **Vue de l'équipe rouge** ✅ (ML) : la carte est retournée de 180° pour les joueurs rouges. Leur base est en bas à gauche et le combat se trouve devant eux, sur l'écran comme sur la minicarte. Les commandes suivent l'écran.
  - **Caméra libre** : clic maintenu sur la minicarte pour regarder ailleurs, puis retour au héros au relâchement (ML). Touche Y pour une caméra libre, déplacée en amenant la souris au bord de l'écran (LoL). Mort : la caméra reste libre, déplacée avec Z Q S D ou la souris au bord. On ne voit jamais plus que ce que voit son équipe : le brouillard s'applique partout.
  - **Caméra** ✅ (même vidéo) : environ 20 u de large à l'écran, **inclinée** comme dans ML. Le sol est écrasé verticalement (facteur 0,68 : un cercle de portée est environ 0,65 fois moins haut que large sur la vidéo). Les héros, sbires, tours et textes restent debout, avec une ombre et l'anneau d'équipe au sol ; les haies ont du relief.
  - **3 voies** : haut (par le coin haut-gauche), milieu (diagonale), bas (par le coin bas-droit).
  - **Rivière** sur l'autre diagonale ; jungle dans les quatre triangles entre voies et rivière.
  - **Brouillard de guerre** (ML, LoL, Unite) : chaque équipe ne voit les héros et sbires adverses que dans le rayon de vision de ses héros (8 u), sbires (5 u) et tours (8 u) 🧪. Les tours et les monstres restent toujours visibles. À l'écran, un voile bleuté couvre ce que l'équipe ne voit pas, sur la carte et sur la minicarte. Contre-jeu : se cacher dans la jungle ou en buisson, et avancer avec ses sbires pour voir.
  - **Buissons** : un héros dans un buisson est invisible pour l'adversaire, même dans sa vision, sauf si une unité adverse est dans le même buisson ✅ (ML, sans balises). Un héros qui inflige des dégâts depuis un buisson est révélé 1 s ✅ (ML).
  - **Murs** : la jungle est fermée par des haies, avec des passages, des poches pour les camps et des fosses pour la Tortue et le Seigneur. La grille de la carte (1 case = 1 u) est générée par `tools/gen-map.ts` et vit dans `data/game/map.json`. Les murs arrêtent les déplacements, les ruées et les repoussements. Ils arrêtent aussi les **attaques de base** (il faut une ligne de vue dégagée vers la cible) et les **projectiles** (attaques à distance et compétences tirées) 🎯. C'est un choix du porteur de projet après test : les sources publiques sur ML ne tranchent pas. Les zones au sol (cônes, cercles, lignes télégraphiées) passent toujours. Réglage : `wallsBlockShots` dans `data/game/rules.json`.
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
| 18:00 | Le Seigneur cesse de grandir. **Phase finale** : les sbires infligent +50 % de dégâts aux structures 🎯 (pour finir les parties ; cible 12 à 20 min). |

## 3. Structures

| Structure | PV | Dégâts / s | Défenses | Source |
| --- | --- | --- | --- | --- |
| Tour extérieure | 4 500 | 320 + 3,82 / min | 20 / 20 | ✅ ML |
| Tour intérieure | 5 500 | 360 + 3,82 / min | 20 / 20 | ✅ ML |
| Tour de base de voie | 6 900 | 520 + 3,82 / min | 40 / 40 | ✅ ML |
| Base | 7 900, +165 PV toutes les 5 s | 539 + 3,82 / min | 40 / 40 | ✅ ML |

- **3 tours par voie, comme dans ML** (extérieure, intérieure, tour de base de voie), puis la base. La v1 n'en avait que 2 : les parties entre bots finissaient trop vite.
- **Portée** : 5,3 u ✅. Les tours tirent 1 fois par seconde et infligent des **dégâts bruts** ✅.
- **Dégâts croissants sur un héros** : +75 % des dégâts initiaux par coup consécutif ✅ (ML), **plafonnés à ×2,5** (plafond de LoL, décidé en R2), remis à zéro après 2 s sans tirer sur ce héros ✅.
- **Ciblage** : la première cible valide, en commençant par les sbires. La tour bascule sur un héros ennemi qui blesse un héros allié à portée ✅. Le Seigneur invoqué est prioritaire parmi les non-héros ✅.
- **Protection sans sbires** : −50 % de dégâts subis si aucun sbire ennemi n'est à portée de la tour ✅.
- **Protection de début** : les tours extérieures subissent −30 % de dégâts jusqu'à 5:00 ✅. L'or versé à ceux qui frappent ce bouclier dans ML n'est pas repris en v1.
- **Ordre de vulnérabilité** : seule la tour la plus avancée d'une voie peut être attaquée ; la base devient vulnérable dès qu'une tour de base de voie est tombée ✅.
- **Indicateur à trois couleurs de ML** ✅ :
  - jaune : on est à portée ;
  - vert : la tour vise une autre cible ;
  - rouge : on est la cible, avec un son.

## 4. Sbires

- **Une vague par voie toutes les 30 s dès 0:10** ✅ (ML), composée d'un sbire de **mêlée**, d'un sbire **à distance** et d'un **canon** ✅ (voies latérales de ML ; v1 identique au milieu).
- **Super-sbire** : envoyé sur une voie dont la tour de base de voie adverse est tombée ✅.
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
  - **régénération des PV hors combat seulement** 🎯 (choix du projet après test) : elle s'arrête pendant 4 s après un coup reçu, ou après un coup porté à un héros ou à une tour. Le mana se régénère toujours. Les PV montent aussi d'un coup quand le PV max augmente, au passage de niveau ou de palier d'objet (règle de LoL) ;
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
- **Prime** (ML, LoL) : tuer un héros en série rapporte +100 or par élimination de sa série à partir de la 2e, plafonné à +500 🧪. Elle est affichée dans le fil des éliminations et dans l'annonce de fin de série. Contre-jeu : la prime aide l'équipe en retard à revenir.

## 7. Attaque de base et ciblage

- **Cadence** : une attaque toutes les 1 / vitesse d'attaque secondes, avec un temps d'armement de 25 % de cet intervalle 🧪 (principe de LoL). Le héros n'est immobile que pendant l'armement.
- **Attaquer en se déplaçant** ✅ (ML) : attaque maintenue + direction, le héros frappe dès que l'attaque est prête et que la cible est à portée, puis se déplace librement jusqu'au coup suivant. Avec une direction, il ne poursuit pas une cible hors de portée : le joueur garde la main. Sans direction, il la poursuit.
- **Attaque boostée** ✅ (Unite) : **la 3ᵉ attaque de base est boostée**. Son effet dépend du héros. Contre-jeu : le compteur (3 points) est visible au-dessus du héros, et l'adversaire peut sortir de portée avant la 3ᵉ.
- **Ciblage** ✅ (ML) : la touche d'attaque verrouille la cible par priorité, d'abord le héros ennemi au plus faible % de PV à portée, sinon l'unité la plus proche, parmi les cibles visibles et en ligne de vue. Le verrou reste tant que la cible est à portée. Tant que la touche est maintenue, l'attaque l'emporte sur le déplacement : le héros poursuit sa cible (jusqu'à 3 u au-delà de sa portée) et frappe, comme le bouton d'attaque de ML. La cible verrouillée est entourée de rouge, et chaque coup est visible.
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
- **Effets passifs des objets** : actifs quand l'objet est complet (palier 3), comme dans ML. Chaque passif est décrit en données (`effect` dans `data/game/items.json`) et appliqué par un crochet du moteur. Valeurs de ML ✅ ou ⚠️ (version ancienne), simplifiées quand c'est indiqué :

  | Objet | Passif |
  | --- | --- |
  | Lame du désespoir | +25 % d'attaque 2 s en touchant un héros sous 50 % de PV |
  | Frappe du chasseur | 5 coups en 3 s sur le même héros : +50 % de vitesse 2 s |
  | Faux corrosive | attaques de base : +80 dégâts physiques et ralentissement de 8 % |
  | Cristal sacré | +21 % (niveau 1) à +35 % (niveau 15) de puissance magique |
  | Matraque foudroyante | toutes les 6 s, une compétence ajoute 255 + 85 % de puissance |
  | Talisman enchanté | rend 15 % du mana max toutes les 10 s |
  | Cuirasse antique | touché par une compétence : −6 % d'attaque au lanceur 2 s |
  | Glace dominante | +8 défenses par héros ennemi proche (max +40) |
  | Casque maudit | 1,2 % des PV max par seconde en dégâts magiques autour de soi |
  | Ceinture du tonnerre | toutes les 4 s, l'attaque suivante : 30 + 1,5 % des PV max en dégâts bruts, ralentit de 40 % |
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
  - compétences : A, E, R en AZERTY (Q, E, R en QWERTY). **Maintenir pour viser, relâcher pour lancer** (visée de ML) : la zone d'effet s'affiche au sol pendant la visée (bande, cône, cercle, cible entourée), en bleu si la compétence est prête, en gris sinon. Échap annule ;
  - sort : F ; retour à la base : B ;
  - choix A ou B : touches 1 et 2.
- **En partie** : PV, mana, recharges, niveau et XP, or et prochain palier d'objet, minicarte, minuteur, score des éliminations, alertes (objectifs, choix de compétence). Barres de vie graduées par tranches de 1 000 PV ✅ (ML).
- **Tableau des scores** (Tab maintenu, comme dans ML et LoL) : par héros, niveau, éliminations / morts / assistances, derniers coups (sbires et monstres), or total, dégâts aux héros, objets et paliers, sort (recharge visible pour les alliés), temps de réapparition des morts. Par équipe : tours détruites, Tortues, Seigneurs, or total, écart d'or.
- **Annonces** (ML) : premier sang, doublé, triplé, séries (3 éliminations sans mourir : « Série meurtrière », puis « Déchaîné », « Inarrêtable », « Divin », « Légendaire »), fin de série, équipe anéantie. Bandeau à la couleur de l'équipe, et fil des 5 dernières éliminations en haut à droite.
- **Récapitulatif de mort** (LoL, ML) : pendant la réapparition, qui a porté le dernier coup et les dégâts reçus dans les 15 dernières secondes, par source, avec la part attaques / compétences pour les héros.
- **Minuteurs sur la minicarte** (ML) : temps avant le retour de la Tortue, du Seigneur et de chaque camp de jungle.
- **Jeu en ligne** (décision 0006) : salon par code (« Créer une partie », « Rejoindre »), pseudo et équipe ; l'hôte lance, les bots complètent. Pseudos affichés à côté des héros dans le tableau Tab et le fil des éliminations. Messages « En attente de l'hôte… », « L'hôte a quitté la partie », « Partie désynchronisée ».
- **Fin de partie** : vainqueur, durée, éliminations, dégâts, puis « Rejouer ».
- **Visuel** (passe 1, en attendant l'habillage des personnages par univers) : sol peint une fois et mis en cache (herbe tachetée, voies sableuses avec cailloux, rivière à reflets, places des bases, fosses en pierre), haies en touffes arrondies avec fleurs, hautes herbes pour les buissons. Héros en boules brillantes marquées de leur initiale, avec un halo d'équipe et un anneau au sol (rond bleu, losange rouge : la couleur n'est jamais le seul indice). Sbires distincts par type, monstres avec des yeux qui suivent leur cible, tours en pierre avec cristal lumineux et décombres une fois détruites. Projectiles avec traînée, étincelles à l'impact, nuage à la mort, léger rebond en marchant. Boutons de compétence ronds avec balayage de recharge, grisés sans mana.

## 12. Mesure et calibrage

`tools/sim-game.ts` joue des parties complètes entre bots, sans rendu. Il mesure :

- la durée des parties (cible : 12 à 20 min) ;
- les niveaux et l'or en fin de partie ;
- les éliminations ;
- les tours détruites.

Les valeurs 🧪 sont réglées par ce banc d'essai. Les mesures en jeu prévues dans `docs/research/gaps.md` les remplaceront.

## 13. Limites connues de la v1

- **Carte** : la structure de ML (3 voies en couloirs, jungle fermée), avec un tracé simplifié. La vision ne tient pas compte des murs (pas de ligne de vue).
- **Passifs des objets** : appliqués, avec des simplifications (pas de décroissance de la vitesse de Traque, pas de cumul de Dissuasion, Résonance sur une seule cible).
- **Contrôles** : provocation et suppression ne sont pas encore implémentées.
- **Bots** : simples. Ils tiennent leur voie, poussent derrière leurs sbires, se battent quand c'est favorable, se replient et rentrent à la base. Le jungleur fait ses camps, la Tortue et le Seigneur. À partir de 10:00, les bots de voie rejoignent de plus loin (30 u) un objectif qu'un allié attaque.
- **Commandes** : clavier et souris seulement, pas de commandes tactiles.
- **Multijoueur en ligne** : pas encore, c'est le jalon 2 (décision 0001).
- **Durée mesurée entre bots** (`npm run sim -- --n 20`, carte de 68 u, 3 tours par voie, phase finale) : de 10:11 à 23:00, médiane 16:12, 10 victoires de chaque côté. Les valeurs 🧪 restent à remplacer par les mesures en jeu.
