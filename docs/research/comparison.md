# Synthèse comparative : la « copie mixée »

Statut : **à discuter (phase R2)**. Chaque ligne est une proposition, pas une décision. Le détail, avec les valeurs, les sources et les niveaux de confiance, est dans les fiches :

- `systems/A-B-structure-carte.md` (A–B) ;
- `systems/C-D-stats-formules.md` (C–D) ;
- `systems/E-F-capacites-progression-objets.md` (E–F) ;
- `systems/G-sbires-jungle-objectifs.md` (G).

Décisions déjà prises :

- **Mobile Legends** (abrégé ML dans les tableaux) est le squelette ;
- objets choisis **avant** la partie, comme dans Unite ;
- LoL apporte la profondeur des stats et des formules ;
- 3v3 maintenant (2 à 3 amis et des bots), 5v5 plus tard ;
- menus simplifiés, visuel lumineux.

Légende des sources : ✅ valeur relevée et sourcée · ⚠️ valeur partielle, ancienne ou communautaire · 🧪 valeur à calibrer par simulation ou par mesure en jeu.

## 1. Partie et carte

| # | Sujet | Ce que font les jeux | Proposition |
| --- | --- | --- | --- |
| P1 | Carte | ML : 3 voies, jungle, rivière, 3 tours par voie ✅. Unite : 3v3 sur Auroma Park, partie de 5 min ✅ | **Carte de ML réduite pour le 3v3** : 3 voies, **2 tours par voie** en 3v3 et 3 en 5v5. Les PV des tours dépendent du nombre de joueurs (règle de l'ARAM de LoL) : le même fichier de carte sert aux deux formats. |
| P2 | Victoire | ML : destruction de la base ✅. Unite : score à la fin du temps ✅ | Destruction de la base (ML). Option en réserve : une limite de temps qui départage au score. |
| P3 | Durée cible | ML : 12–20 min. Unite : 10 min (5 min en 3v3). LoL : 30 min et plus | **À trancher (question 1)**. Le calendrier des objectifs (P4) en découle. |
| P4 | Calendrier | ML : Tortue à 2:00, Seigneur à 8:00, renforts à 12 et 18 min, boucliers des tours jusqu'à 5:00 ✅⚠️. Unite : objectifs à 3:00 et 8:00 ✅ | La séquence de ML (petit objectif tôt, gros objectif, puis paliers de renforts), **comprimée** pour tenir dans la durée cible, avec une phase finale annoncée à l'écran (comme le Final Stretch de Unite). |
| P5 | Réapparition | ML : augmente avec le niveau **et** la minute de jeu ⚠️. Ancienne formule : 3,2 s + 2,1 s × niveau + minutes, plus un palier en fin de partie. LoL : documenté ✅ | Même forme que ML, `a + b × niveau + c × minutes`, plafonnée. Valeurs provisoires reprises de l'ancienne formule 🧪, **à mesurer en jeu**. |
| P6 | Retour à la base et fontaine | ML : retour en 5 s, interrompu par les dégâts ; fontaine qui soigne vite ; bonus de vitesse en sortie ✅ | Tel quel. Sans boutique, le retour sert seulement à se soigner. |
| P7 | Vision | ML : buissons et brouillard, **pas de balises** ✅. LoL : balises | ML (buissons, pas de balises) : rien à acheter, rien à gérer. |
| P8 | Accélérateurs | ML : 4 points de glissade (Cyclone Eyes) avec 30 s de recharge ✅. Unite : tremplins | ML. Ils réduisent les temps morts. |

## 2. Unités, sbires, jungle, objectifs

| # | Sujet | Ce que font les jeux | Proposition |
| --- | --- | --- | --- |
| U1 | Sbires | ML : une vague toutes les 30 s dès 0:10, 3 types, super-sbires après la chute d'une tour de base ✅. Stats des sbires ❓ | Rythme et types de ML. Comportement (aggro, priorités) repris de LoL, le seul documenté ✅. Stats 🧪 (mesure en jeu, ou valeurs de LoL converties). |
| U2 | Jungle | ML : camps avec stats « initiale + gain par minute » ✅ ; bonus violet et orange | Réduite pour le 3v3 : **un bonus violet et un orange par côté**, quelques petits camps. Même loi de croissance que ML. |
| U3 | Objectif précoce | ML : Tortue (depuis le 28/09/2026 : une Tortue alliée pousse une voie ; plus de chiffres publiés) ⚠️. Unite : Regis à 3:00 | Équivalent de la Tortue : XP d'équipe et un effet d'équipe simple. |
| U4 | Objectif final | ML : Seigneur à 8:00, qui pousse une voie pour l'équipe qui le tue ✅ | Seigneur de ML : une unité alliée qui pousse la voie la plus faible. |
| U5 | Tours | ML : portée 5,3, dégâts croissants coup après coup, bascule d'aggro sur un héros qui attaque un allié ✅. PV ❓ | Règles de ML, montée des dégâts plafonnée (à la manière de LoL) pour que plonger sous une tour soit puni sans être une mort instantanée 🧪. |

## 3. Stats et combat

| # | Sujet | Ce que font les jeux | Proposition |
| --- | --- | --- | --- |
| C1 | Échelle des chiffres | PV médians au niveau 1 : 620 (LoL), 2 511 (ML), 3 250 (Unite) ✅ | **Échelle de ML** (PV environ 2 500 → 5 000) : les chiffres de ML (sbires, tours, jungle) se reprennent sans conversion. |
| C2 | Liste des stats | LoL : la plus complète ✅ | Environ 16 stats issues de LoL : PV, régénération, attaque, puissance, 2 défenses, vitesse d'attaque, critique, pénétrations, accélération des capacités, vol de vie, ténacité, vitesse de déplacement… |
| C3 | Défense | LoL et ML ont la même formule, dégâts × K / (K + défense), avec K = 100 (LoL) ou 120 (ML) ✅. Unite : ≈ dégâts × 600 / (600 + Déf/2,5) ⚠️ | **K = 120 (ML)**, plancher de défense à −60 (ML), ordre des pénétrations de LoL. |
| C4 | Croissance par niveau | LoL : courbe quadratique ✅. ML : seuls les niveaux 1 et 15 sont publiés ✅. Unite : chaque gain vaut 1,10 à 1,20 fois le précédent, plus forte croissance car **pas de boutique** ✅ | **Courbe de Unite** : sans boutique, la puissance doit venir des niveaux. Alternative : formule de LoL adaptée à 15 niveaux. |
| C5 | Attaque de base | LoL : vitesse d'attaque, temps d'armement ✅. Unite : **attaque boostée tous les 3 coups** (68 Pokémon sur 103) ✅ | Cadence et armement de LoL, plus **l'attaque boostée de Unite** (compteur visible par l'adversaire). |
| C6 | Ciblage | ML : bouton d'attaque avec verrouillage, priorité au choix (plus proche, % de PV le plus bas, PV effectifs les plus bas) ✅ | ML, avec la même option au clavier et à la souris. |
| C7 | Contrôles | LoL et ML : environ 15 types. ML les range par niveaux (ce que la ténacité et la purge touchent) ✅ | **8 contrôles** : ralentissement, immobilisation, désarmement, silence, étourdissement, projection, provocation, suppression. Niveaux et ténacité de ML ; durée minimale de 0,3 s (LoL). |
| C8 | Soins et anti-soins | LoL : anti-soin à 40 %, qui ne réduit pas les boucliers ✅ | Règle de LoL. |

## 4. Personnages et progression

| # | Sujet | Ce que font les jeux | Proposition |
| --- | --- | --- | --- |
| K1 | Structure du kit | ML : passif + 2 compétences + ultime ✅. Unite : 2 capacités **à choix** (A ou B aux niveaux 5 et 7, amélioration « + » à 11 et 13), ultime au niveau 9 ✅ | **Kit de ML + choix de Unite** sur les 2 compétences. |
| K2 | Points de compétence | ML : à répartir (6/6/3) ✅. Unite : aucun, montée automatique ✅ | **À trancher (question 3)**. Proposition : montée automatique (Unite). Les seules décisions en partie sont alors les 4 choix A/B et « + ». |
| K3 | Ressource | LoL et ML : mana ou énergie ✅. Unite : **aucune** ✅ | **À trancher (question 4)**. Proposition : pas de mana en v1, seulement des temps de recharge (Unite). |
| K4 | Ultime | ML : débloqué au niveau 4, recharge de 30 à 50 s ✅. Unite : au niveau 9, chargé par une jauge ✅ | ML (niveau 4, recharge). La jauge reste une option pour certains personnages. |
| K5 | Dégâts des capacités | Unite : `base + croissance × (niveau − 1) + ratio × stat`, une seule formule ✅. LoL et ML : valeurs par rang | **Format de Unite**, avec les ordres de grandeur de ML. |
| K6 | Expérience | Niveau max 15 (ML et Unite) ✅. Table d'XP ❓ pour les deux. Partage et rattrapage de LoL ✅ | Niveau max 15, forme de courbe de LoL, partage et rattrapage de LoL. Table 🧪, calibrée pour atteindre le niveau 15 vers 80 % de la durée cible. |

## 5. Objets et avant-partie

| # | Sujet | Ce que font les jeux | Proposition |
| --- | --- | --- | --- |
| O1 | Objets tenus | Unite : 3 objets, qui valent environ 11 à 14 % des stats d'un Pokémon niveau 15 ✅. ML : 6 objets, qui valent environ +73 % de PV et +150 % d'attaque ✅ | 3 objets tenus de Unite. |
| O2 | **Que devient l'or ?** | ML : tout repose sur l'or et la boutique | **À trancher (question 2)**. (a) **XP seule** : plus d'or, les objets gagnent des paliers aux niveaux 5 et 10 du héros. (b) **L'or fait monter les objets** automatiquement à des seuils (sur le modèle des bottes de roaming de ML, 600 / 1 500 or), dans un ordre choisi avant la partie. |
| O3 | Sort actif | ML : sorts de combat (Flash, Soin…) ✅. Unite : objets de combat ✅ | **Un seul emplacement** qui fusionne les deux : 6 à 8 choix, recharge de 30 à 90 s. |
| O4 | Emblèmes et runes | ML : emblèmes + talents ✅. Unite : emblèmes ✅. LoL : runes | Proposition : un emblème par rôle, attribué automatiquement, plus 1 talent au choix parmi 3. Variante plus simple : aucun emblème. |

**Écran d'avant-partie qui en découle** : personnage → 3 objets → 1 sort → (1 talent). Quatre choix au maximum, puis on joue.

## 6. Ce qui reste à mesurer

Voir `gaps.md` et les sections « Manques » des fiches. Mesures prioritaires dans Mobile Legends, en partie personnalisée :

1. temps de réapparition selon le niveau et la minute ;
2. table d'expérience ;
3. PV et dégâts des sbires ;
4. PV des tours et de la base ;
5. temps de trajet d'une base à l'autre, qui fixe l'échelle de la carte.
