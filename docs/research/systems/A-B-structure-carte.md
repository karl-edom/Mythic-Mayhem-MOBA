# Familles A et B — Structure de partie et carte (LoL, MLBB, Unite)

Statut : **relevé R1**, à discuter en R2. Périmètre : systèmes A1–A4 et B1–B6 du plan (`docs/research/reverse-engineering-plan.md` §3).

Sources : uniquement les extraits locaux de `data/reference/{lol,mlbb,unite}/` (wiki LoL au patch 16.20, wiki Fandom MLBB et Serebii / unite-db, extraits le 2026-10-13). Aucune valeur n'est inventée. Quand un nombre est **calculé** à partir d'une source (et non lu tel quel), c'est écrit « calcul ».

Légende de confiance :

- ✅ valeur sourcée et a priori à jour ;
- ⚠️ valeur partielle, ancienne, contradictoire entre deux pages, ou interprétée ;
- ❓ valeur absente des sources locales.

Rappel des décisions (`docs/decisions/0004-squelette-mlbb-objets-avant-partie.md`, `docs/product-brief.md` §4.1) : MLBB = squelette ; objets choisis avant la partie (façon Unite), pas de boutique en partie ; stats et formules façon LoL ; parties courtes (cible du brief : 6 à 10 min) ; 3v3 d'abord (2–3 amis + bots), 5v5 plus tard ; menus simplifiés ; visuel lumineux.

---

## 0. Unités de distance : ce que chaque source utilise

| | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Unité | « unités » Riot (u) | « units » du jeu | mètres (m) dans les notes de patch ; unités internes pour la vitesse |
| Vitesse de déplacement des personnages | 315 à 355 u/s, médiane 335 (`data/reference/lol/champions.json`) ✅ | 225 à 268, médiane 250 (`data/reference/mlbb/heroes.json`) ; **vitesse ÷ 100 = units par seconde** (ex. 265 → 2,65 units/s) (`data/reference/mlbb/mechanics/movement-speed.md`) ✅ | 3600 à 3800 au niveau 1 (médiane 3700), 4200 à 4400 au niveau 15, « unités internes » (`data/reference/unite/pokemon.json`, `README.md`) ✅ ; conversion en m/s ❓ |
| Portée d'attaque des personnages | 125 à 650 u, médiane 175 (`lol/champions.json`) ✅ | 1,4 à 5 units (80 héros renseignés sur 134), médiane 2 ; jusqu'à 7,1 avec capacités (`mlbb/heroes.json`, `mlbb/mechanics/attack-range.md`) ✅ | seulement « Melee » / « Ranged » (`unite/pokemon.json`) ; portées de capacités en m dans `unite/mechanics/serebii-patch-notes.md` (ex. Hyper Voice 9 m → 10 m) ✅ |
| Portée des tours | 750 u (`lol/mechanics/turret.md`) ✅ | 5,3 units ; autel 6,8 (`mlbb/mechanics/turret.md`, `attack-range.md`) ✅ | sans objet (pas de tour) |

**Rapport indicatif LoL ↔ MLBB (calcul, à vérifier)** : 335 / 2,50 ≈ 134 u LoL par unit MLBB (vitesses médianes) ; 750 / 5,3 ≈ 142 (portées de tour). Les deux calculs concordent à ±5 %, ce qui suggère qu'**1 unit MLBB ≈ 135–140 u LoL**. Ce n'est pas une donnée publiée.

**Unite** : aucune source ne relie les mètres des capacités aux 3650 unités internes de vitesse. Mesure proposée en §M.

---

## A1 — Format, nombre de joueurs, modes alternatifs

| Élément | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Mode principal | 5v5 sur la Faille de l'invocateur (Classic) — `lol/mechanics/summoners-rift.md` ✅ | 5v5 Classic / Ranked — `mlbb/mechanics/classic.md`, `ranked.md` ✅ | 5v5 Standard / Ranked, Theia Sky Ruins — `unite/mechanics/serebii-game-modes.md`, `serebii-stages.md` ✅ |
| Mode court / réduit | ARAM 5v5, une seule voie (Howling Abyss, Butcher's Bridge, Koeshin's Crossing tirés au hasard) — `lol/mechanics/aram.md` ✅ | Brawl 5v5, une seule voie, 2 tours par équipe, départ niveau 4 et 2500 or — `mlbb/mechanics/brawl.md`, `patch-1-9-06.md` ✅ | Quick Battle 3v3 (Auroma Park) ou 4v4 (Shivre City, Mer Stadium), 5 min — `serebii-stages.md` ✅ |
| Contre bots | ❓ (pas de page extraite) | Vs. AI 5v5, 3 difficultés (Easy, Normal, Hard), jusqu'à 4 amis — `mlbb/mechanics/vs-ai.md` ✅ | « CPU Match » : 4 amis contre le CPU (Standard) ; **2 à 3 amis contre le CPU** (Quick Battle) — `serebii-game-modes.md` ✅ |
| Partie personnalisée | ❓ | Custom : nombre de joueurs libre, IA ajoutable des deux côtés (ex. 3 contre 5 IA, 1v1) — `mlbb/mechanics/custom.md` ✅ | Friend Match jusqu'à 10 joueurs — `serebii-game-modes.md` ✅ |
| Autres modes | URF, One for All, Doom Bots (événements) — `summoners-rift.md` ⚠️ (historique) | Arcade (modes tournants), Evolve, Magic Chess — `arcade-mode.md`, `evolve.md` ⚠️ | First to 500 (5v5, premier à 500 points, depuis février 2025), Electrode Volleyball 3v3 — `serebii-game-modes.md`, `serebii-first-to-500.md` ✅ |
| Tours par équipe (carte principale) | 11 (3 voies × 3 + 2 tours du Nexus) ; 4 sur Howling Abyss — `lol/mechanics/turret.md` ✅ | 9 (3 voies × 3) + la base ; 2 en Brawl — `mlbb/mechanics/turret.md` ✅ | 5 zones de but par équipe : 2 par voie + 1 de base (carte ancienne) — `unite/mechanics/unitedb-remoat-island-legacy.md` ⚠️ |

**Ce qu'il faut retenir**

- Les trois jeux tournent autour du 5v5. Seul Unite propose un **vrai format 3v3 officiel** (Auroma Park, 5 min), et un mode « 2 à 3 amis contre le CPU ».
- MLBB permet en Custom n'importe quelle composition, IA comprise, sur la carte 5v5 standard.
- Les modes « une voie » (ARAM, Brawl) existent dans LoL et MLBB pour raccourcir la partie.

**Piste pour Mythic Mayhem (proposition)** : carte MLBB réduite pour 3v3 (2–3 amis + bots en complément), en gardant la structure 3 voies ; prévoir dès le format de données un paramètre « joueurs par équipe » (3 ou 5), comme le Custom de MLBB.

**Manques**

- LoL : modes contre bots et partie personnalisée (pages wiki « Co-op vs. AI », « Custom game » non extraites).
- MLBB : règles exactes d'une partie Custom 3v3 (les sbires, la jungle et les objectifs restent-ils identiques ?) → mesure en jeu (§M7).
- Unite : carte d'Auroma Park (taille, voies, nombre de buts) ❓ ; Serebii ne donne que la liste des Pokémon sauvages.

---

## A2 — Durée, abandon, conditions de victoire

| Élément | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Condition de victoire | détruire le Nexus — `summoners-rift.md` ✅ | détruire la base ; elle n'est vulnérable qu'après la chute d'une tour d'inhibiteur — `classic.md`, `turret.md` ✅ | plus haut score à la fin du minuteur — `serebii-mechanics.md`, `serebii-score-and-medals.md` ✅ ; First to 500 : premier à 500 points — `serebii-first-to-500.md` ✅ |
| Durée | sans limite ; durée typique ❓ ; minuteurs de réapparition jusqu'à 55 min (`death.md`) | sans limite ; « 10–15 min pour la plupart des parties, certaines dépassent 30 min » — `classic.md` ⚠️ (texte ancien, non daté) | minuteur fixe : **10 min** (Standard), **5 min** (Quick Battle) — `serebii-stages.md` ✅ ; First to 500 : 5 min selon `serebii-stages.md`, mais Zapdos y apparaît « à 8 min » ⚠️ contradictoire |
| Abandon (vote) | Faille : ❓ ; ARAM : à partir de **8:00**, vote à 4/5 (70 %) — `aram.md` ✅ | ❓ en général ; « abandon anticipé » si un joueur est inactif pendant les **3 premières minutes** (Draft Pick) → partie invalidée — `mlbb/mechanics/terms.md` ✅ | le vote d'abandon existe (option « s'opposer automatiquement », version de juin 2023) ; seuils et horaire ❓ — `serebii-patch-notes.md` ⚠️ |
| Mécanismes anti-parties longues | minuteurs de mort croissants après 15 min (A4) ; sbires plus fréquents à 14:00 et 30:00 (A3) — `death.md`, `minion.md` ✅ | Seigneur renforcé à 12 min, évolué à 18 min ; sbires plus rapides à 12 min ; mort plus longue à 18 min — `match-details-and-timestamps.md` ✅ ; Brawl : super sbires à 12 min — `brawl.md` ✅ | phase finale (« Final Stretch ») : 2 dernières minutes, points doublés ou accrus sur certains Pokémon — `serebii-stage-theiaskyruins.md` ✅ |

**Ce qu'il faut retenir**

- LoL et MLBB : victoire par **destruction**, durée libre ; MLBB force la fin par des renforts minutés (12 et 18 min).
- Unite : victoire au **score** sur un temps fixe, ce qui garantit la durée.
- L'abandon n'est documenté que pour l'ARAM (8:00, 70 %) et pour le cas « joueur inactif » de MLBB (3 premières minutes).

**Piste pour Mythic Mayhem (proposition)** : victoire par destruction de la base (squelette MLBB), avec des renforts minutés recalés sur la cible de 6–10 min (équivalents des paliers 12 et 18 min de MLBB, à avancer). Garder en réserve un minuteur de sécurité façon Unite qui départage au score si la base tient trop longtemps. Abandon : vote simple ouvert après quelques minutes, à fixer en R2.

**Manques**

- LoL : page « Surrender » (horaire et seuil sur la Faille) ; durée moyenne des parties (statistiques publiques, ex. sites de stats).
- MLBB : existence, horaire et seuil du vote d'abandon en Classic/Ranked → vérifier en jeu (§M8) ; durée moyenne actuelle ❓.
- Unite : règles du vote d'abandon (horaire, seuil) → vérifier en jeu (§M8) ; durée réelle du First to 500.

---

## A3 — Phases de partie et événements minutés

Temps écoulés depuis le début de la partie. Unite affiche un **compte à rebours** : « 3:00 écoulées » = 7:00 affichées sur une partie de 10 min.

| Moment | LoL (Faille) | MLBB (Classic) | Unite (Theia Sky Ruins, 10 min) |
| --- | --- | --- | --- |
| 1re vague de sbires | 0:30 — `lol/mechanics/minion.md` ✅ | 0:10 — `mlbb/mechanics/minions.md`, `match-details-and-timestamps.md` ✅ | sans objet (pas de sbires) |
| Intervalle des vagues | 30 s ; 25 s dès 14:00 ; 20 s dès 30:00 — `minion.md` ✅ | 30 s — `minions.md` ✅ | sans objet |
| Revenu passif | or dès 1:05 (20,4 or / 10 s) — `lol/mechanics/gold.md` ✅ | 6 or / 2 s (valeur la plus récente du journal, non datée) — `battlefield-guide.md` ⚠️ | ❓ |
| 1ers camps de jungle | buffs, loups, raptors : 1:30 (dernière modif. relevée V7.22) — `lol/mechanics/monster.md` ⚠️ | buffs : 0:20 (`match-details-and-timestamps.md`), 0:30 (`jungle.md`), 0:25 (note de patch dans `jungle.md`) ⚠️ contradictoire ; autres camps ~0:30 ; Lithowanderer 0:35 puis 0:40, petits crabes 0:42–0:45 — `jungle.md`, `crab.md` ⚠️ | Pokémon sauvages dès le début ; certains « toutes les minutes » (Swablu, Altaria) — `serebii-stage-theiaskyruins.md` ⚠️ (page en retard, voir ci-dessous) |
| Fin de la protection des tours | plaques : animation 0:25–0:32 ; tours extérieures perdent armure/RM de 11:00 à 15:00 — `turret.md` ✅ | bouclier des tours extérieures (absorbe 5000, −30 % dégâts) jusqu'à **5:00** ; « Orange/Red Alert » si une tour tombe avant 8:00 (ou 9:00 selon un patch) — `turret.md`, `battlefield-guide.md` ⚠️ | sans objet |
| 1er objectif majeur | Dragon 5:00, réapparition 5 min ; Larves du Néant 8:00 (V25.09), disparition 14:45 — `dragon-pit.md`, `voidgrub-camp.md` ✅ | Tortue 2:00, réapparition 120 s, plus de Tortue si la dernière meurt après 6:00 — `turtle.md` ✅ | Regieleki / Regirock / Regice / Registeel : à **3 min** écoulées, réapparition 2 min après KO — `serebii-stage-theiaskyruins.md` ⚠️ |
| 2e objectif majeur | Héraut 15:00 (disparaît 19:45) ; Baron 20:00, réapparition 6 min ; Atakhan 20:00 (la page parle au passé) — `rift-herald.md`, `baron-nashor.md`, `atakhan.md` ⚠️ | Seigneur à 8:00 (ou 2 min après la dernière Tortue) ; réapparition 180 s entre 8 et 18 min, puis 120 s (texte) ou 2,5 min (infobox) — `lord.md` ⚠️ contradictoire | Rayquaza à **8 min** écoulées (= 2:00 affichées), 30 points — `serebii-stage-theiaskyruins.md` ⚠️ |
| Bascule de milieu | sbires : un sbire de siège toutes les 2 vagues après 14:00, à chaque vague après 25:00 — `minion.md` ✅ | 2:00 : fin du bonus de dégâts en jungle ennemie ; 5:00 : fin des pénalités et bonus de début ; 8:00 : les roamers partagent l'or — `match-details-and-timestamps.md` ✅ | « Final Stretch » : 2 dernières minutes ; Diggersby, Claydol apparaissent, points accrus — `serebii-stage-theiaskyruins.md` ✅ |
| Bascule de fin | minuteurs de mort croissants dès 15:00 — `death.md` ✅ | 12:00 : Seigneur renforcé, sbires plus rapides ; 18:00 : Seigneur évolué, mort « fortement allongée », vitesse en base accrue — `match-details-and-timestamps.md`, `battlefield-guide.md` ✅ | fin du minuteur à 10:00 |

**Ce qu'il faut retenir**

- MLBB enchaîne ses événements bien plus tôt que LoL : Tortue à 2:00 contre Dragon à 5:00 ; Seigneur à 8:00 contre Baron à 20:00.
- MLBB découpe la partie en 0–5 / 5–12 / 13+ min (`match-details-and-timestamps.md`), et Unite en « Standard » / « Final Stretch » (2 dernières minutes).
- **Unite, attention** : la page Serebii de Theia Sky Ruins est en retard sur les notes de patch du même site (`serebii-patch-notes.md`) :
  - Groudon est le boss principal depuis la version 1.20.1.2 (4 sept. 2025) ;
  - Bunnelby et Baltoy ont été retirés en 1.20.3.10 (23 oct. 2025) ;
  - Kyogre a été ajouté en 1.21.1.2 (4 déc. 2025) : but adverse affaibli 45 s, soin de 4 % des PV max par seconde.
  - Le calendrier actuel des boss de Theia est donc ❓.
- **MLBB, attention** : la refonte annuelle de la carte du 28 sept. 2026 (`mlbb/mechanics/patch-notes-2-2-16.md`) remplace le bouclier de la Tortue par une « Tortue de soin » alliée qui pousse une voie. Les minuteurs ci-dessus peuvent avoir bougé.

**Piste pour Mythic Mayhem (proposition)** : reprendre la séquence MLBB (petit objectif tôt, gros objectif ensuite, puis deux paliers de renforcement) en **compressant les horaires** pour viser 6–10 min. On peut s'inspirer des horaires d'Unite 10 min : 1er objectif majeur à 3:00 écoulées, final à 8:00. Phase finale signalée à l'écran, comme le « Final Stretch ».

**Manques**

- MLBB : horaires actuels (après le 28 sept. 2026) de la Tortue de soin, des buffs, du Lithowanderer → chronométrer une partie (§M3).
- Unite : calendrier actuel de Theia (Regis, Groudon, Kyogre, Rayquaza, Pokémon du Final Stretch) → enregistrer une partie CPU complète (§M3) ; autre source : unite-db (page cartes actuelle, non extraite).
- LoL : apparition du Carapateur (Rift Scuttler) ❓ ; statut actuel d'Atakhan (retiré ?) ⚠️.

---

## A4 — Réapparition (délai selon le niveau et le temps)

| Élément | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Formule | délai = **BRW + BRW × TIF** — `lol/mechanics/death.md` ✅ | ancienne note : **3,2 s + 2,1 s × niveau + minutes de partie** (avant : 6,5 + 1,8 × niveau + minutes) — `mlbb/mechanics/battlefield-guide.md` ⚠️ (non datée, ancienne) | ❓ (aucune des trois sources) — `unite/README.md` |
| Part liée au niveau | BRW = 10 / 10 / 12 / 12 / 14 / 16 / 20 / 25 / 28 / 32,5 / 35 / 37,5 / 40 / 42,5 / 45 / 47,5 / 50 / 52,5 s (niv. 1 à 18) ✅ | +2,1 s par niveau (ancienne formule) ⚠️ ; le délai « augmente toujours avec le niveau du héros et la durée de partie » (Brawl, patch 1.9.06, 2024) — `patch-1-9-06.md` ✅ | ❓ |
| Part liée au temps | rien avant 15:00 ; TIF +0,425 % par demi-minute (15–30 min), +0,30 % (30–45 min), +1,45 % (45–55 min) ; plafond TIF 50 % ✅ | +1 s par minute (ancienne formule) ⚠️. Changements qualitatifs, sans valeurs : plus court les 20 premières minutes puis croissant ; réduit après 25 min ; « fortement allongé » à 18:00 — `battlefield-guide.md`, `match-details-and-timestamps.md` ⚠️ | ❓ |
| Maximum | 52,5 × 1,5 = **78,75 s** (niv. 18, 55 min) ✅ | Brawl : **50 s** max (patch 1.9.06, 2024) ✅ ; Classic ❓ | ❓ |
| Mode court | ARAM : niveau seul, 11 → 40 s en 16 paliers (niveau de départ non précisé) — `aram.md`, `death.md` ✅ | Brawl : délai réduit, plafond 50 s — `patch-1-9-06.md` ✅ | ❓ |
| Lieu de réapparition | centre de la fontaine alliée — `death.md` ✅ | autel (fontaine) — `mlbb/mechanics/altar.md` ✅ | ❓ (base de l'équipe) |

**Ordre de grandeur de l'ancienne formule MLBB** (calcul, formule ⚠️ périmée, et on ignore si « niveau » part de 1) :

| Niveau | Minute de partie | 3,2 + 2,1 × niveau + minutes |
| --- | --- | --- |
| 1 | 0 | 5,3 s |
| 4 | 3 | 14,6 s |
| 8 | 8 | 28,0 s |
| 12 | 12 | 40,4 s |
| 15 | 18 | 52,7 s |

**Ce qu'il faut retenir**

- Le constat du porteur de projet est confirmé par les sources MLBB : le délai **croît avec le niveau et avec le temps de partie**. Il y a en plus un saut à 18 min et un adoucissement après 25 min, sans valeurs publiées.
- L'ancienne formule (3,2 + 2,1 × niveau + minutes) en est la seule version chiffrée. Elle est probablement modifiée depuis : deux ajustements ultérieurs sont décrits sans chiffres.
- LoL est entièrement documenté : table par niveau, multiplicateur après 15 min, plafond de 50 %.
- Unite : rien dans les sources locales.

**Piste pour Mythic Mayhem (proposition)** : forme **MLBB** `délai = a + b × niveau + c × minutes`, plafonnée, avec un palier de fin de partie (équivalent du saut de 18 min, avancé pour une partie de 6–10 min). Valeurs provisoires = ancienne formule MLBB, à remplacer par la mesure §M1. En 3v3, chaque mort pèse plus lourd : à surveiller en télémétrie.

**Manques**

- MLBB : formule actuelle en Classic → **mesure prioritaire** (§M1). Autres sources possibles : Liquipedia MLBB, notes de patch officielles (Project NEXT et suivantes).
- Unite : délais de réapparition → mesure (§M2) ; autre source : pages « Respawn » d'unite-db ou de Game8 (non extraites).
- LoL : complet pour la Faille.

---

## B1 — Dimensions, échelle, symétrie

| Élément | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Forme | carré ; bases dans deux coins opposés (bleu au sud-ouest, rouge au nord-est) — `summoners-rift.md` ✅ | ❓ (pas de plan chiffré) ; cartes : Sanctum Island (refaite en sept. 2026), Imperial Sanctuary, Celestial Palace / Western Expanse — `turret.md`, `patch-notes-2-2-16.md` ✅ | ❓ ; « Research Map » d'image seulement — `serebii-stage-theiaskyruins.md` |
| Taille | ~**20 500 u** d'un obélisque du Nexus à l'autre ; dimensions du carré ❓ — `summoners-rift.md` ⚠️ | ❓ | ❓ |
| Symétrie | jungles « de même surface, mêmes camps, en miroir de part et d'autre de la rivière » ; les objectifs épiques cassent la symétrie (Baron en haut, Dragon en bas) — `lol/mechanics/jungling.md` ✅ | Gold Lane et EXP Lane changent de côté (haut/bas) selon l'équipe ; la 1re Tortue est toujours côté EXP Lane — `mlbb/mechanics/map.md`, `turtle.md` ⚠️ (symétrie exacte ❓) | positions « top », « bottom », « mid » côté ami et côté ennemi (ancienne carte) — `unitedb-remoat-island-legacy.md` ⚠️ |
| Variantes de terrain | Faille élémentaire (6 variantes après le 3e drake), Faille corrompue (Baron) — `summoners-rift.md`, `dragon-pit.md` ✅ | depuis la saison 38, variante tirée au hasard avant la partie : Expanding River, Dangerous Grass, Broken Walls, Flying Clouds — `mlbb/mechanics/draft-pick.md` ✅ | Theia Sky Ruins, avec boss changeants (Rayquaza, puis Groudon, Kyogre) — `serebii-patch-notes.md` ✅ |

**Ce qu'il faut retenir**

- Seule LoL donne un ordre de grandeur (≈ 20 500 u entre les deux obélisques). Par le rapport indicatif du §0, cela ferait ≈ 150 units MLBB (calcul, non vérifié).
- Aucune dimension MLBB ni Unite n'est publiée dans les sources locales.
- Les trois jeux sont à **symétrie diagonale ou miroir**, avec des exceptions voulues pour les objectifs.

**Piste pour Mythic Mayhem (proposition)** : carte MLBB en miroir diagonal, mesurée en **temps de trajet** plutôt qu'en distance. Exemple : « base à base en X s à vitesse moyenne », à caler sur la mesure §M4 puis à réduire pour le 3v3. Unité interne : reprendre la convention MLBB (vitesse ÷ 100 = unités/s), simple à lire.

**Manques**

- MLBB : longueur base–base, largeur de carte, distances entre tours → mesure §M4 (marche chronométrée).
- Unite : idem pour Theia et Auroma Park (§M4), plus la conversion m ↔ unités internes (§M5).
- LoL : taille du carré (page wiki « Map » ou données de carte CommunityDragon, non extraites).

---

## B2 — Voies, jungle, rivière

| Élément | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Voies | 3 (haut, milieu, bas) — `summoners-rift.md` ✅ | 3 : Gold Lane, Mid Lane, EXP Lane — `map.md`, `battlefield-guide.md` ✅ | 2 voies (haut, bas) avec 2 buts par équipe et par voie, plus un but de base au milieu (ancienne carte) — `unitedb-remoat-island-legacy.md` ⚠️ |
| Structures par voie | tour extérieure, intérieure, d'inhibiteur, puis inhibiteur ; 2 tours du Nexus communes — `summoners-rift.md`, `turret.md` ✅ | tour extérieure, intérieure, de base (« d'inhibiteur ») ; puis la base — `turret.md` ✅ | but niveau 1 détruit à **80 points**, niveau 2 à **100 points** ; but de base jamais détruit (ancienne carte) — `unitedb-remoat-island-legacy.md` ⚠️ ; seuils sur Theia ❓ |
| Longueur des voies | ❓ ; indice : les sbires de la 1re vague sont « fantômes » 28 s sur les voies latérales et 18 s au milieu — `minion.md` ⚠️ | ❓ ; indice : sbires au point de rencontre en ~**15 s** au milieu et ~**25 s** sur les côtés — `minions.md` ⚠️ | ❓ |
| Composition des vagues | 3 mêlée + 3 distance (+ siège) — `minion.md` ✅ | 1 sbire de chaque type par voie ; au milieu, 3 lanciers + 1 fantassin pendant 10 vagues — `minions.md` ✅ | sans objet |
| Jungle | 6 camps par côté (Raptors, Loups, Krugs, Gromp, Sentinelle bleue, Ronceterre rouge) + Carapateur en rivière — `jungling.md`, `monster.md` ✅ | Purple buff (Thunder Fenrir / Serpent), Orange buff (Molten Fiend / Lava Golem), Horned Lizard, Fire Beetle, Lithowanderer, crabes, Tortue, Seigneur — `jungle.md` ✅ | Pokémon sauvages répartis (liste par carte) ; Regis aux côtés, boss au centre — `serebii-stage-theiaskyruins.md` ⚠️ |
| Rivière | diagonale entre les deux coins sans base, ne traverse pas les voies — `summoners-rift.md` ✅ | rivière comptée dans la jungle ; le Lithowanderer y patrouille — `jungle.md`, `lithowanderer.md` ✅ | ❓ |
| Fosses d'objectifs | fosse du Baron (en haut, Larves → Héraut → Baron), fosse du Dragon (en bas) — `jungling.md` ✅ | Tortue côté EXP Lane, Seigneur en face — `turtle.md`, `lord.md` ✅ | boss au centre (Rayquaza / Groudon) — `serebii-mechanics.md` ✅ |

**Ce qu'il faut retenir**

- MLBB : 3 voies × 3 tours, des voies typées (or, expérience, milieu) et une jungle à buffs violet et orange.
- Les temps de trajet des sbires (15 s au milieu, 25 s sur les côtés) sont le seul indice de longueur de voie côté MLBB.
- Unite n'a que 2 voies, et des buts au lieu de tours.
- Pour le 3v3, aucun jeu n'a de carte « 3 voies » réduite. Les formats courts officiels sont soit une seule voie (ARAM, Brawl), soit l'arène Unite.

**Piste pour Mythic Mayhem (proposition)** : 3 voies MLBB conservées mais raccourcies. Deux tours par voie en 3v3 au lieu de trois (comme Brawl, qui en a deux), à valider en R2. Jungle réduite à un buff violet et un buff orange par côté, une Tortue et un Seigneur.

**Manques**

- Longueur de chaque voie MLBB (base → tour extérieure → point de rencontre) → mesure §M4.
- Nombre et position des camps MLBB sur Sanctum Island après la refonte de sept. 2026 → capture de la minimap et de l'onglet « Battlefield Overview » (§M6).
- Unite : seuils des buts et nombre de buts sur Theia ❓ (unite-db, page cartes actuelle).

---

## B3 — Bases, fontaine, retour à la base

| Élément | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Soin à la fontaine | ❓ (Faille) ; ARAM : aucun soin à la plate-forme — `aram.md` ✅ | **10 % des PV max et 10 % du mana max toutes les 0,2 s**, plus un bonus de vitesse — `mlbb/mechanics/altar.md` ✅ ; Brawl : aucun soin — `brawl.md` ✅ | les zones de but alliées soignent et donnent un bouclier (le but du milieu et le but de base plus fort), valeurs ❓ — `serebii-patch-notes.md` ⚠️ |
| Défense de la fontaine | obélisque du Nexus : dégâts « bruts » qui ignorent réductions, intangibilité et immunité — `lol/mechanics/basic-attack.md`, `damage.md` ✅ | **2000 dégâts bruts toutes les 0,2 s** (10 000 par seconde) aux ennemis sur l'autel ; portée 6,8 — `altar.md`, `attack-range.md` ✅ | ❓ |
| Cœur de base | Nexus (PV ❓) ; 2 tours du Nexus à 3500 PV, réapparition 3 min à 40 % des PV — `turret.md` ✅ | base : **7900 PV**, attaque 539 (+3,82/min), défenses 40/40, régénère **165 PV / 5 s** — `turret.md` ✅ | but de base jamais détruit (ancienne carte) — `unitedb-remoat-island-legacy.md` ⚠️ |
| Retour à la base | Recall ❓ (page non extraite) ; désactivé en ARAM — `aram.md` | **Recall** : 5 s de canalisation, annulée par un déplacement ou des dégâts, recharge 0 — `mlbb/mechanics/battle-spells.md` ✅ ; **Arrival** (TP vers une tour ou un sbire allié) : 3 s, recharge 75 s — `battle-spells.md` ✅ | ❓ |
| Vitesse en sortie de base | Homeguard (bonus de vitesse en sortie de fontaine), valeur ❓ — `movement-speed.md` ⚠️ | bonus de vitesse de l'autel, « fortement accru » à 18:00, valeur ❓ — `altar.md`, `battlefield-guide.md` ⚠️ | ❓ |
| Achats | boutique en base, et pendant la mort — `death.md` ✅ | achat à distance en Classic ; Brawl : seulement mort ou avant de quitter l'autel — `brawl.md` ✅ | pas de boutique en partie (objets choisis avant) — `serebii-mechanics.md` ✅ |
| Portes de base | portes réservées à l'équipe (Faille) ; Howling Abyss : portes fermées 15 s puis portes de glace à sens unique — `summoners-rift.md`, `howling-abyss.md` ✅ | ❓ | ❓ |

**Ce qu'il faut retenir**

- L'autel MLBB est une zone **sûre et létale** : soin de 50 % des PV par seconde (calcul : 10 % × 5 par seconde) et 10 000 dégâts par seconde aux ennemis.
- Le retour à la base de MLBB est gratuit, sans recharge, et prend 5 s.
- La base MLBB a des PV modestes (7900) mais se régénère, et n'est attaquable qu'après une tour d'inhibiteur.

**Piste pour Mythic Mayhem (proposition)** : autel et Recall de MLBB tels quels (5 s, annulés par les dégâts) ; pas de boutique, cohérent avec la décision 0004. Le retour à la base sert seulement au soin. Indicateur visuel : barre de canalisation. Contre-jeu : infliger des dégâts. Bonus de vitesse en sortie d'autel à conserver, car il raccourcit les temps morts, utile pour des parties courtes.

**Manques**

- MLBB : valeur du bonus de vitesse de l'autel avant et après 18:00 → lire le panneau d'attributs (§M9) ; PV actuels de la base (refonte de sept. 2026, « Golden Turret » renforce les tours) → §M9.
- LoL : pages « Fountain », « Recall », « Nexus », « Inhibitor » à extraire (soin, délai de Recall, PV, réapparition des inhibiteurs).
- Unite : retour à la base, soin en base et dans les buts, réapparition → §M2 et §M9.

---

## B4 — Buissons, brouillard de guerre, vision

| Élément | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Buissons | bloquent la vue de toute unité à l'extérieur — `summoners-rift.md` ✅ ; taille et nombre ❓ | dissimulation après **0,25 s** (**0,75 s** si l'on était vu juste avant) ; révélé **3 s** après avoir frappé un sbire (attaque de base) ou un héros proche ; les pièges révèlent tout le buisson — `mlbb/mechanics/bush.md` ✅ | hautes herbes existantes (ex. Trailblaze : portée dans l'herbe 7,5 m → 9,5 m) ; règles ❓ — `serebii-patch-notes.md` ⚠️ |
| Brouillard de guerre | oui ; vision centrée sur la source (« always center range »), bloquée par le terrain — `turret.md` (bloc « Sight ») ✅ | ❓ en détail ; un héros mort ne donne plus de vision — `death.md` ✅ ; les murs ne bloquent pas la vision — `wall.md` ✅ | ❓ ; Aeos Tech « True Sight » : champ de vision élargi — `serebii-first-to-500.md` ⚠️ |
| Rayons de vision | Carapateur : 525 (ancien patch) — `monster.md` ⚠️ ; champions ❓ | tours : **8 units** ; sbires : **8 units** — `turret.md`, `minions.md` ✅ ; héros ❓ | ❓ |
| Balises | 3 types de balises achetables (« wards »), détails ❓ — `baron-nashor.md` (glossaire) ⚠️ | aucune balise ; vision par capacités, Lithowanderer (Stone Roamer) et, depuis le 28 sept. 2026, **« Revealing Wisps »** ramassables — `jungle.md`, `patch-notes-2-2-16.md` ✅ | ❓ |
| Furtivité | camouflage, invisibilité, pièges furtifs ; « True Sight » — `monster.md` (glossaire) ✅ | camouflage / invisibilité ; les tours révèlent les unités furtives — `conceal.md`, `turret.md` ✅ | ❓ |

**Ce qu'il faut retenir**

- MLBB n'a **pas de balises**. La vision vient des héros, des sbires et des tours (8 units), des capacités, et depuis 2026 de feux follets ramassables.
- Les buissons MLBB ont des délais précis (0,25 s / 0,75 s / 3 s). C'est le système le mieux documenté des trois.
- LoL ajoute une économie de balises que MLBB et Unite n'ont pas.

**Piste pour Mythic Mayhem (proposition)** : buissons et brouillard MLBB, **sans balises** (moins de menus, cohérent avec l'absence de boutique). Indicateur visuel : œil barré au-dessus du personnage caché (comme MLBB). Contre-jeu : capacités révélatrices, entrée dans le buisson, tours.

**Manques**

- Rayon de vision d'un héros MLBB → mesure §M10 ; nombre et taille des buissons de Sanctum Island → §M6.
- LoL : pages « Sight », « Brush », « Ward » à extraire (rayons, durées, limites de balises).
- Unite : règles des hautes herbes et rayon de vision → §M10.

---

## B5 — Murs, passages, terrain modifiable

| Élément | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Murs | murs rocheux qui séparent les zones ; murs de base en arc, avec une porte réservée à l'équipe — `summoners-rift.md` ✅ | bloquent le déplacement, **pas la vision** ; une charge bloquée s'arrête, un dash qui finit dans un mur est replacé au point valide le plus proche ; les socles de tours (même détruites) comptent comme des murs — `mlbb/mechanics/wall.md` ✅ | ❓ |
| Murs temporaires | ❓ (capacités de champions) | capacités : 5 à 8 s (Badang, Grock, Yin) — `wall.md` ✅ | ex. Light Screen (Mr. Mime) bloque le passage — `serebii-patch-notes.md` ✅ |
| Terrain qui change | Faille élémentaire (après le 3e drake) : terrain et plantes modifiés ; Faille corrompue au 1er Baron — `summoners-rift.md`, `dragon-pit.md` ✅ | variante de carte tirée avant la partie (Expanding River, Dangerous Grass, Broken Walls, Flying Clouds) — `draft-pick.md` ✅ | boss qui modifie le terrain : Rayquaza crée des courants selon le nombre de buts sans défense — `serebii-stage-theiaskyruins.md` ✅ |
| Passages rapides | portes de distorsion (« Warp gates ») et portes de glace sur les cartes ARAM — `aram.md`, `howling-abyss.md` ✅ | Cyclone Eye : glissade (voir B6), traverse certains obstacles — `cyclone-eye.md` ✅ | ❓ |

**Ce qu'il faut retenir**

- MLBB fixe des règles simples et explicites d'interaction mur / déplacement : charge stoppée, dash replacé, et les murs ne cachent pas la vue.
- MLBB change la carte **avant** la partie (variantes tirées au sort), alors que LoL la change **pendant** la partie (Faille élémentaire).

**Piste pour Mythic Mayhem (proposition)** : murs MLBB (bloquent le déplacement, pas la vision) et règles de dash MLBB. Le terrain qui change en cours de partie est reporté à plus tard, car il pèse sur la lisibilité. Une variante tirée avant la partie reste une option bon marché pour la variété.

**Manques**

- Effet précis des variantes MLBB (Expanding River, etc.) ❓ → onglet « Battlefield Overview » en jeu (§M6).
- Unite : murs et passages de Theia ❓.

---

## B6 — Vitesse sur certaines zones

| Élément | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Zones d'accélération permanentes | ❓ (aucune sur la Faille de base) | autel : bonus de vitesse, valeur ❓ — `altar.md` ⚠️ | jump pads (« Jump Pad ») mentionnés dans une correction de bug ; effets et positions ❓ — `serebii-patch-notes.md` ⚠️ |
| Zones liées à un objectif | Carapateur : « Speed Shrine », vision et vitesse devant la fosse du Dragon ou du Baron pendant **75 s** (valeur de vitesse ❓) — `monster.md` ⚠️ | Lithowanderer : **+15 % de vitesse dans la rivière pendant 45 s** — `lithowanderer.md`, `jungle.md` ✅ | Rayquaza : courants d'air selon le nombre de buts sans défense, valeurs ❓ — `serebii-stage-theiaskyruins.md` ⚠️ |
| Zones liées au terrain | Faille des nuages : **+20 %** de vitesse dans les « Cloud Zones », **+35 %** hors combat — `dragon-pit.md` ✅ | **Cyclone Eye** : 4 sur la carte, apparition à 0:40, recharge 30 s ; glissade vers l'avant après **1,2 s** d'arrêt ; traverse certains obstacles — `cyclone-eye.md` ✅ ; Flying Clouds (variante 2026) ❓ | ❓ |
| Bonus de déplacement en jungle | ❓ | talent d'emblème : **+10 %** (version actuelle) ou **+15 %** (autre page) dans la jungle et la rivière, divisé par deux en combat — `mlbb/mechanics/emblems.md` ⚠️ | Aeos Tech « Map Sprinter » : **+40 %** hors combat (mode First to 500) — `serebii-first-to-500.md` ✅ |
| Plafonds de vitesse | plafonds souples : ×0,8 entre 415 et 490, ×0,5 au-delà de 490 — `lol/mechanics/movement-speed.md` ✅ | efficacité réduite (taux ❓) sous 230 et au-dessus de 420 ; ralentissement max 90 % — `mlbb/mechanics/movement-speed.md` ✅ | ❓ |

**Ce qu'il faut retenir**

- Aucun des trois jeux n'a de « couloir » d'accélération permanent bien documenté.
- MLBB utilise des bonus **conditionnels** : rivière après le Lithowanderer, Cyclone Eye, autel. LoL n'en a qu'en Faille des nuages. Unite en a (jump pads, courants de Rayquaza) mais sans valeurs publiées.

**Piste pour Mythic Mayhem (proposition)** : reprendre les Cyclone Eyes de MLBB (4 points de glissade, recharge 30 s), lisibles et utiles pour accélérer des parties courtes. Indicateur visuel : tourbillon au sol, et état « prêt / en recharge » sur la minimap. Contre-jeu : la glissade est prévisible et part dans la direction du mouvement. Ajouter le bonus de vitesse en sortie d'autel (B3).

**Manques**

- Unite : effets et positions des jump pads de Theia, valeur des courants de Rayquaza → §M11.
- MLBB : valeur du bonus de l'autel (§M9) ; distance de glissade du Cyclone Eye → §M11 ; effet de Flying Clouds ❓.
- LoL : valeur du Speed Shrine (page « Rift Scuttler » à extraire).

---

## M. Mesures en jeu proposées au porteur de projet

Matériel commun : enregistrement d'écran à 60 images/s si possible (le chronomètre se lit ensuite image par image), captures d'écran du minuteur de partie et de l'écran de mort. Noter pour chaque mesure : date, version du jeu, carte, mode, héros ou Pokémon, niveau, emblème ou objets (désactiver ceux qui donnent de la vitesse).

Distances : **distance = temps × vitesse**. Lire la vitesse dans le panneau d'attributs du héros (MLBB : vitesse ÷ 100 = units/s), hors bonus de l'autel et hors combat.

### M1 — Réapparition MLBB (priorité 1)

- **Où** : Custom, Classic, 1 humain contre 5 IA, ou Vs. AI.
- **Quoi** : mourir volontairement (sous une tour ennemie) à des moments choisis et lire le minuteur affiché dès la mort, avec une capture.
- **Grille** : niveaux ≈ 1, 4, 8, 12, 15 × minutes ≈ 1, 4, 8, 12, 16, 19, 22, 26. Une quinzaine de points suffisent. Monter en niveau en restant en voie.
- **Noter** : niveau exact, minute:seconde du minuteur de partie, délai affiché (arrondi ?), éventuel talent ou objet réduisant le délai (n'en prendre aucun).
- **Vérifier** : le saut à 18:00, la baisse après 25:00, l'existence d'un plafond. Ajuster ensuite `a + b × niveau + c × minutes` (tableur).

### M2 — Réapparition Unite

- **Où** : Standard Battle en « CPU Match » (Theia, 10 min), puis Quick Battle CPU (Auroma Park, 5 min) pour comparer.
- **Quoi** : se faire mettre KO à plusieurs niveaux (1–15) et à plusieurs moments (dont le Final Stretch). Noter niveau, temps restant affiché et délai de réapparition.
- **Vérifier** : délai fixe ? dépendance au niveau, au temps, au Final Stretch ?

### M3 — Calendrier des événements

- **MLBB** (Custom, rester en base en observant la minimap, ou jouer normalement en enregistrant) : noter l'heure d'apparition des sbires, des buffs violet et orange, des petits crabes, du Lithowanderer, des Cyclone Eyes, de la Tortue (nouvelle « Tortue de soin ») et du Seigneur. Noter aussi l'heure des annonces (fin des boucliers à 5:00, Seigneur renforcé, évolué).
- **Unite** (Standard CPU, Theia) : noter le temps restant à chaque apparition (Regis, Groudon, Kyogre, Rayquaza, Pokémon du Final Stretch) et le début du Final Stretch. Une partie complète enregistrée suffit.

### M4 — Dimensions de carte (marche chronométrée)

- **Où** : MLBB Custom (sans ennemis humains, IA en « Easy ») ; Unite en Practice si la carte complète y est accessible, sinon CPU Match.
- **Héros** : vitesse connue, sans bottes ni bonus de vitesse. Relever la vitesse dans le panneau d'attributs avant chaque trajet.
- **Trajets à chronométrer** (départ = sortie de la zone de l'autel, pour exclure son bonus) :
  1. autel allié → autel ennemi par la voie du milieu ;
  2. idem par chaque voie latérale ;
  3. tour extérieure → tour intérieure → tour de base, sur chaque voie ;
  4. largeur de la rivière (perpendiculairement) ;
  5. tour extérieure alliée → tour extérieure ennemie, sur chaque voie.
- **Unite** : base → chaque but, haut et bas ; but → centre (fosse du boss).
- Faire chaque trajet deux fois et garder la moyenne. Convertir : distance = temps × vitesse ÷ 100 (MLBB).

### M5 — Conversion des unités de Unite

- Choisir un Pokémon de vitesse 3650 (niveau 1) et une capacité de portée connue en mètres (notes de patch, ex. une portée de 10 m).
- Méthode : placer une cible fixe (mannequin du mode Practice) à la portée maximale de la capacité. Marcher ensuite de la position de tir jusqu'à la cible et chronométrer. Vitesse en m/s = portée ÷ temps, à comparer à 3650.

### M6 — Inventaire de la carte MLBB actuelle

- Ouvrir l'onglet « Battlefield Overview » et faire une capture de la minimap en partie (Sanctum Island après le 28 sept. 2026).
- Compter : buissons, camps de jungle par côté, Cyclone Eyes, feux follets de vision (« Revealing Wisps »), fosses d'objectifs.
- Noter l'effet affiché des variantes (Expanding River, Dangerous Grass, Broken Walls, Flying Clouds) quand elles sortent.
- Mesurer la taille d'un buisson en le traversant dans sa longueur et sa largeur (méthode M4).

### M7 — Custom MLBB en 3v3

- Lancer un Custom à 3 contre 3 (IA comprises).
- Vérifier : les 3 voies, la jungle, la Tortue et le Seigneur restent-ils identiques ? Les vagues de sbires changent-elles ? Y a-t-il un ajustement d'expérience ou d'or au nombre de joueurs ?

### M8 — Abandon

- **MLBB** (Classic, ou Custom si disponible) : à partir de quelle minute le bouton d'abandon apparaît-il ? Combien de votes faut-il ? Combien de temps dure le vote ?
- **Unite** (Standard) : mêmes questions.

### M9 — Autel, base, retour à la base (MLBB)

- Lire la vitesse dans le panneau d'attributs **sur** l'autel, puis juste après en être sorti, avant et après 18:00. Chronométrer la durée du bonus.
- Chronométrer le Recall (attendu : 5 s) et la remontée des PV de 10 % à 100 % sur l'autel (attendu : < 2 s d'après 10 % / 0,2 s).
- En Custom, toucher la base ennemie et lire ses PV max (attendu 7900 selon le wiki, à revérifier après la refonte « Golden Turret »).
- **Unite** : chronométrer le retour à la base s'il existe, et le soin dans un but allié (PV à l'entrée puis toutes les secondes).

### M10 — Rayon de vision

- **MLBB** : Custom 1v1 avec un ami. L'ami reste immobile au milieu d'une voie (hors buisson) ; l'autre avance en ligne droite depuis le brouillard. Noter l'instant où chacun apparaît à l'écran de l'autre : distance = temps restant jusqu'au contact × vitesse. Répéter trois fois.
- **Unite** : même protocole dans un Friend Match, si possible.

### M11 — Zones de vitesse

- **MLBB Cyclone Eye** : chronométrer le délai avant glissade (attendu 1,2 s) et la durée de glissade. En déduire la distance : comparer avec la marche normale sur le même trajet.
- **MLBB Lithowanderer** : vitesse dans le panneau d'attributs dans la rivière, avant et après le kill (attendu +15 %, 45 s).
- **Unite** : jump pads de Theia : position (capture), temps de vol, distance parcourue (méthode M4) ; courants de Rayquaza : vitesse dans le courant, à comparer à la marche normale.

---

## Sources consultées

- `data/reference/lol/mechanics/` : `summoners-rift.md`, `aram.md`, `howling-abyss.md`, `death.md`, `turret.md`, `minion.md`, `monster.md`, `jungling.md`, `dragon-pit.md`, `baron-nashor.md`, `rift-herald.md`, `voidgrub-camp.md`, `atakhan.md`, `gold.md`, `movement-speed.md`, `basic-attack.md`, `damage.md` ; `data/reference/lol/champions.json`, `units.json`, `summoner-spells.json`.
- `data/reference/mlbb/mechanics/` : `map.md`, `land-of-dawn.md`, `match-details-and-timestamps.md`, `battlefield-guide.md`, `death.md`, `classic.md`, `brawl.md`, `vs-ai.md`, `custom.md`, `ranked.md`, `draft-pick.md`, `terms.md`, `turret.md`, `altar.md`, `minions.md`, `lane-cutting.md`, `jungle.md`, `turtle.md`, `lord.md`, `crab.md`, `lithowanderer.md`, `cyclone-eye.md`, `bush.md`, `conceal.md`, `wall.md`, `attack-range.md`, `movement-speed.md`, `battle-spells.md`, `emblems.md`, `patch-1-9-06.md`, `patch-notes-2-1-88.md`, `patch-notes-2-2-16.md` ; `data/reference/mlbb/heroes.json`.
- `data/reference/unite/mechanics/` : `serebii-stages.md`, `serebii-stage-theiaskyruins.md`, `serebii-stage-auromapark.md`, `serebii-stage-remoatisland.md`, `serebii-stage-remoatstadium-firstto500.md`, `serebii-game-modes.md`, `serebii-mechanics.md`, `serebii-score-and-medals.md`, `serebii-ranked-battle.md`, `serebii-first-to-500.md`, `serebii-patch-notes.md`, `unitedb-remoat-island-legacy.md` ; `data/reference/unite/pokemon.json`, `README.md`.
