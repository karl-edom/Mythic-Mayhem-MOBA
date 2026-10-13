# Famille G : sbires, jungle, objectifs, structures

> Relevé R1 du plan (`docs/research/reverse-engineering-plan.md`, §3, lignes G1 à G5), à partir des seules données locales de `data/reference/` (extraction du 13/10/2026). Aucune valeur n'est inventée : une case sans source est marquée ❓.
>
> Rappel des décisions déjà prises : MLBB sert de squelette (structure de partie, carte, sbires, tours, jungle, objectifs, progression en partie). Les objets sont choisis **avant** la partie, comme les objets tenus de Unite : il n'y a **pas de boutique en partie**. LoL apporte la profondeur des stats et des formules. Parties courtes (le brief vise 6 à 10 min). 3v3 d'abord, 5v5 plus tard.

## 0. Conventions

### Confiance

| Marque | Sens |
| --- | --- |
| ✅ | Valeur sourcée, page récente, cohérente avec les autres sources |
| ⚠️ | Valeur partielle, ancienne, ou en contradiction avec une autre source (la contradiction est indiquée) |
| ❓ | Valeur absente des données locales |

### Sources (chemins relatifs à `data/reference/`)

| Code | Fichier | Nature |
| --- | --- | --- |
| `L-units` | `lol/units.json` | fiches de base CommunityDragon (patch 16.20). La note du fichier précise : valeurs de base seulement ; la croissance des sbires, les stats réelles des tours et l'échelle des monstres sont scriptées. |
| `L-minion`, `L-turret`, `L-monster`, `L-jungling`, `L-dragon`, `L-baron`, `L-herald`, `L-grubs`, `L-atakhan` | `lol/mechanics/{minion,turret,monster,jungling,dragon-pit,baron-nashor,rift-herald,voidgrub-camp,atakhan}.md` | wiki LoL, révisions d'octobre 2026, avec historique jusqu'à V26.13 |
| `M-minions`, `M-turret`, `M-jungle`, `M-turtle`, `M-lord`, `M-<camp>` | `mlbb/mechanics/*.md` | wiki Fandom MLBB. Les infobox de jungle donnent : valeur initiale, gain par minute, valeur à 12 min. |
| `M-time` | `mlbb/mechanics/match-details-and-timestamps.md` | chronologie d'une partie |
| `M-p1906`, `M-p2190`, `M-p2216` | `mlbb/mechanics/patch-1-9-06.md`, `patch-notes-2-1-90.md`, `patch-notes-2-2-16.md` | notes de patch (2.1.90 = juillet 2026 ; 2.2.16 = changement de carte du 28/09/2026) |
| `U-theia`, `U-remoat`, `U-legacy`, `U-auroma`, `U-500`, `U-patch` | `unite/mechanics/serebii-stage-theiaskyruins.md`, `serebii-stage-remoatisland.md`, `unitedb-remoat-island-legacy.md`, `serebii-stage-auromapark.md`, `serebii-first-to-500.md`, `serebii-patch-notes.md` | Serebii et unite-db |
| `U-held`, `U-battle` | `unite/held-items.json`, `unite/battle-items.json` | unite-db |

### Unités

- **LoL** : distances en unités du jeu (u), vitesses en u/s, vitesse d'attaque en attaques/s. Les valeurs « a – b (selon le niveau) » sont celles du wiki.
- **MLBB** : distances en « unités » du wiki (une unité MLBB ne vaut pas une unité LoL), temps en s ou min:s de partie.
- **Unite** : PV et attaque en points ; les temps de Serebii sont parfois donnés en **temps restant** (« 7:00 » = 3 min de jeu sur 10). Chaque conversion est signalée.

### Alerte de fraîcheur, à lire avant les chiffres

- **LoL V26.01** a refondu tous les monstres épiques : PV et dégâts selon le niveau, Baron à 20:00, **Atakhan retiré**, plaques des tours conservées après 14:00. `L-units` (bins) ne reflète pas ces scripts : ses PV de dragon et de Baron diffèrent du wiki. **Le wiki fait foi** pour les monstres épiques.
- **MLBB 2.2.16** (carte annuelle, 28/09/2026) : la Tortue ne donne plus de bouclier ; elle devient une **Tortue alliée qui pousse une voie et soigne** (« Healing Turtle »). Les tours rapportent beaucoup plus d'or (« Golden Turret ») et les tours intérieures et de base gagnent des PV. **Aucun chiffre n'est publié** dans les données locales. Les fiches Tortue et tour du wiki décrivent donc l'**état d'avant**.
- **Unite** : Serebii donne pour les petits monstres de Theia Sky Ruins **exactement les mêmes stats** que pour ceux de Remoat Island (Bunnelby = Aipom, Indeedee ≈ Audino, etc.). C'est peut-être un copier-coller : ⚠️ sur ces lignes.

---

## G1. Vagues de sbires

### Apparition et composition

| Élément | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Première vague | 0:30 ✅ `L-minion` (V26.01 : 1:05 → 0:30) | 0:10 ✅ `M-minions`, `M-time` | **Pas de sbires** : des Pokémon sauvages fixes réapparaissent dans les voies ✅ `U-remoat`, `U-theia` |
| Intervalle | 30 s ; 25 s dès 14:00 ; 20 s dès 30:00 ✅ `L-minion` | 30 s ✅ `M-minions` | — |
| Intervalle entre sbires d'une vague | 0,792 s ✅ `L-minion` | ❓ | — |
| Composition standard | 3 mêlée + 3 distance ; 1 sbire de siège toutes les 3 vagues (dès 1:30), toutes les 2 vagues après 14:00, à chaque vague après 25:00 ; −1 mêlée quand un siège apparaît après 14:00 ; −1 distance après 30:00 ✅ `L-minion` | Voies latérales : 1 de chaque type (fantassin, lancier, canon). Voie du milieu : 3 lanciers + 1 fantassin pendant les 10 premières vagues, puis 1 de chaque ⚠️ `M-minions` (texte du wiki, non daté) | — |
| Super-sbires | 1 par voie dont l'inhibiteur est détruit ; 2 par voie si tous les inhibiteurs sont détruits ✅ `L-minion` | Envoyés sur la voie dont la tour de base est détruite ✅ `M-minions` | — |
| Temps de trajet jusqu'au contact | Première vague « fantôme » : 28 s (voies latérales), 18 s (milieu) ✅ `L-minion` | ≈ 15 s (milieu), ≈ 25 s (côtés) ⚠️ `M-minions` | — |

### Stats de base

| Sbire | PV | Dégâts | Vit. d'attaque | Portée | Armure / RM | Or | XP | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| LoL mêlée | 430 | 11 | 1,25 | 110 u | 0 / 0 | 20 | 62 | ✅ `L-units` |
| LoL distance | 275 | 19,5 | 0,667 | 550 u | 0 / 0 | 14 | 31 | ✅ `L-units` |
| LoL siège | 750 | 36 | 1,0 | 300 u | 0 / 0 | 49 (base) ; 50 → 69 selon le temps | 75 | ✅ `L-units`, `L-minion` |
| LoL super | 1 500 (+10 PV/5 s) | 180 | 0,85 | 170 u | 100 / −30 | 49 | 75 | ✅ `L-units` |
| MLBB fantassin / lancier / canon | ❓ | ❓ | ❓ | ❓ | ❓ (avant le Seigneur : RM 40, ancienne note) | 65 / 33 / 100 au début, ≈ 120 / 90 / 150 à 30 min | ❓ | ⚠️ `M-minions` (non daté ; 2.2.16 réduit « légèrement » la croissance de l'or) |
| Unite (sauvages de voie) | voir G2 | | | | | | | |

### Croissance et règles

| Règle | LoL | MLBB |
| --- | --- | --- |
| Croissance des stats | « Amélioration » à 0:30 puis toutes les 90 s (PV, dégâts) ✅ `L-minion`. Gains par amélioration ❓ (pages individuelles des sbires non extraites) | ❓ (« l'or augmente avec le temps ») |
| Vitesse de déplacement | 350 / 375 / 400 / 425 / 450 selon les minutes ✅ `L-minion`. Bonus de 111 sur les voies latérales jusqu'à 14:00, retiré en 4 paliers sur 25 s ✅ | +10 par minute (infobox) **ou** +30 par minute (patch « 15 → 30 », plafond inchangé) ⚠️ contradiction `M-minions` / `M-jungle` |
| Dégâts contre héros et structures | 60 % ✅ `L-minion` | ❓ |
| Dégâts contre sbires | bonus en % des PV **actuels** de la cible ✅ (% ❓) | ❓ |
| Niveau des sbires | moyenne entière des niveaux de l'équipe ✅ | ❓ |
| Bonus de poussée | Équipe au niveau moyen supérieur : bonus de dégâts = (5 % + 5 % × écart de tours détruites) × écart de niveau (plafond 3) ; réduction de dégâts = 1 + écart de tours × écart de niveau. Maximum : +60 % et ×10. Dès 3:30. ✅ `L-minion` | ❓ |
| Partage de l'XP | tueur + champions ennemis à moins de 1 500 u ; partage 100 / 65 / 43,3 / 32,5 / 26 / 21,7 % (V26.01) ✅ | or partagé entre héros proches (portée ≈ 8 unités supposée) ; 80 % de l'or seulement si un sbire achève ⚠️ `M-minions` |
| Bonus de voie | — | Voie de l'or : canons +45 % d'or pendant 10 vagues (`M-minions`) **ou** +20 % pendant 5 min (`gold-laner.md`). Voie de l'XP : canons +35 % d'XP pendant 10 vagues (`M-minions`) **ou** +25 % pendant 5 min (`exp-laner.md`) ⚠️ contradiction |
| Pénalité du jungleur | — (les objets de jungle réduisent l'XP des sbires ✅ `L-jungling`) | −70 % d'or des sbires pendant 5 min, sans partage ✅ `jungler.md`, `M-time` |
| Priorité de cible | champion ennemi qui attaque un champion allié > sbire qui attaque un champion allié > sbire qui attaque un sbire > tour qui attaque un sbire > sbire le plus proche > champion le plus proche ✅ `L-minion` | ❓ |
| Portée d'acquisition | 500 u (1 000 u pour défendre un champion allié) ✅ | vision de 8 unités ✅ `M-minions` |
| Or moyen d'une vague | 118,66 (0:30) ; 115 (14:00) ; 121,5 (15:00) ; 148 (25:00) ; 137 (30:00) ✅ `L-minion` | ❓ |

### Ce qu'il faut retenir

- Les deux jeux envoient les vagues toutes les **30 s**. MLBB démarre à **0:10** contre 0:30 pour LoL : le contact est presque immédiat.
- LoL documente finement les règles de poussée (niveau, tours) et d'aggro. MLBB documente l'**économie** des sbires (or par type, bonus de voie) mais **aucune stat de combat**.
- Unite **n'a pas de sbires**. La pression de voie vient des joueurs et des Pokémon sauvages fixes. C'est une différence de structure, pas un détail.
- MLBB spécialise ses voies : une voie de l'or, une voie de l'XP. Ce rôle passe par les **récompenses** des sbires, pas par leurs stats.

### Piste pour Mythic Mayhem

- **Squelette MLBB** : vagues toutes les 30 s dès 0:10, 3 types (mêlée, distance, siège), super-sbires après la chute d'une tour de base.
- **Règles de comportement de LoL** (priorités, aggro, 60 % de dégâts contre héros et structures) : ce sont les seules documentées. Elles se testent sans ambiguïté dans le moteur déterministe.
- **Sans boutique, l'or des sbires n'a plus d'usage.** Proposition : les sbires rapportent de l'**XP** (seule ressource en partie, conformément au brief : « éviter les multiples monnaies »).
  - Achever le sbire donne un **bonus d'XP**, pour garder le geste du dernier coup sans monnaie.
  - Les bonus de voie de MLBB (or, XP) se fondent en un seul : « la voie solo reçoit +X % d'XP pendant les N premières vagues ». X et N sont à régler.
  - La pénalité du jungleur reste utile (XP des sbires réduite tant qu'il porte le sort de jungle) : elle empêche le jungleur de voler la voie.
- **3v3** : garder 3 voies impose un joueur par voie et une jungle sans titulaire. Une alternative est 2 voies + jungle. C'est une **décision B2 (carte)** à prendre avant de régler les vagues.
- **Indicateur visuel** : icône de « dernier coup possible » sur la barre de vie du sbire (LoL ajoute cet indicateur en V26.05).

### Manques

| Valeur | Où l'obtenir |
| --- | --- |
| Gains de PV et de dégâts par amélioration (LoL) | wiki LoL, pages « Melee minion », « Caster minion », « Siege minion », « Super minion » (à ajouter à `tools/extract/lol/mechanics.ts`) |
| PV, attaque, défense, vitesse, XP des sbires MLBB | Pas sur le wiki. **Mesure** en mode personnalisé, sans emblème ni objet : (1) un héros à dégâts fixes connus (attaque de base au niveau 1) frappe un sbire ; compter les coups jusqu'à la mort à 0:30, 6:00 et 12:00 ; (2) lire les graduations de la barre de vie : depuis 1.5.38, une graduation vaut 1 000 PV pour les créatures ; (3) filmer à 60 i/s et noter l'XP gagnée au niveau 1 avec un seul héros à portée. |
| Bonus de voie MLBB actuels | notes de patch récentes sur le wiki MLBB, ou l'onglet « Battlefield Overview » du jeu |
| Fréquence de la nouvelle vague améliorée MLBB à 12 min | `M-p1906` ne la décrit que pour Brawl. Vérifier en Classique (mesure du PV comme ci-dessus). |

---

## G2. Camps de jungle et bonus

### LoL : camps (valeurs de base des bins)

| Camp | PV | Dégâts | Armure / RM | Or | XP | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Sentinelle bleue (bonus bleu) | 2 300 | 66 | 42 / 42 | 90 | 95 | ✅ `L-units` (base, avant échelle de niveau ⚠️) |
| Ronceraille rouge (bonus rouge) | 2 300 | 66 | 42 / 42 | 90 | 95 | ✅ idem |
| Grompe | 2 050 | 70 | 42 / 42 | 80 | 120 | ✅ idem |
| Krug ancien / krug / mini-krug | 1 400 / 650 / 60 | 57 / 20 / 13 | 42 / 20 / 20 | 15 / 10 / 14 | 15 / 10 / 16 | ✅ idem |
| Raptor pourpre / raptor | 1 200 / 500 | 17 / 7 | 42 / 20 | 35 / 8 | 20 / 10 | ✅ idem (nombre de petits ❓) |
| Grand loup / loup ×2 | 1 600 / 630 | 30 / ❓ | 42 / 20 | 55 / 15 | 50 / 15 | ✅ idem |
| Carapateur (rivière, n'attaque pas) | 1 550 | 35 | 42 / 42 | 55 | 100 | ✅ idem |

| Règle LoL | Valeur | Source |
| --- | --- | --- |
| Niveau d'un camp | moyenne des niveaux de **tous** les champions à l'apparition ; fait varier PV, dégâts et récompenses (plafonds propres à chaque camp) | ✅ `L-monster` |
| Première apparition | 1:30 pour le bleu, le rouge, les loups et les raptors (V7.22) | ⚠️ `L-monster` (ancien) ; autres camps ❓ |
| Réapparition | « propre à chaque camp » ; minuteur exact révélé à 60 s (bleu, rouge) ou à 10 s (autres) de la réapparition | ✅ `L-jungling` ; durées ❓ |
| Patience et laisse | sortie de la zone de laisse : « soft reset » de 6 s (soin de 6 % des PV max par s), puis « hard reset » | ✅ `L-monster` |
| Petits monstres | meurent 10 s après la mort du grand monstre, hors combat | ✅ `L-monster` |
| Bonus bleu et rouge | Crête de l'intuition (bleu), Crête des braises (rouge) ; **transférés au tueur** si leur porteur meurt sous les coups d'un champion | ✅ `L-monster` ; effets et durées actuels ❓ (ancien : 120 s ⚠️) |
| Objets de jungle | XP bonus sur les grands monstres, XP des sbires fortement réduite ; +15 or et +15 XP par grand monstre avec un objet de jungle (V12.22) | ✅ `L-jungling`, `L-monster` |

### MLBB : camps (Sanctum Island)

Colonnes : valeur initiale / gain par minute / valeur à 12 min. Vérification faite : la valeur à 12 min vaut presque toujours **initiale + 11 × gain** (PV de 6 camps, attaque de 5 camps, défense du Démon). Exceptions : PV du Démon (≈ +20 × gain), attaque du Golem, défense des Fenrirs (+6 × gain). Elles sont signalées ⚠️.

| Camp | Apparition | Réapparition | PV | Attaque phys. | Déf. phys. / mag. | Source |
| --- | --- | --- | --- | --- | --- | --- |
| Démon en fusion (bonus orange) | 0:20 | 90 s | 4 941 / 158,22 / 8 111 ⚠️ (≈ +20 × gain) | 214 / 3,84 / 256 | 37 → 59 (+2/min) | ✅ `M-molten-fiend`, `M-time` (le texte « 45 s » de la même page est ancien ⚠️) |
| Fenrirs du tonnerre, duo (bonus violet) | 0:25 (`M-time` : 0:20) | 90 s | 4 090 / 230,22 / 6 622 | 226 / 3,84 / 268 | 60 → 72 ⚠️ (+2/min) / 0 | ✅ `M-thunder-fenrir` |
| Lithovagabond (n'attaque pas) | 0:35 (`M-time` : ≈ 0:45) | 120 s | 2 251 / 345,90 / 6 056 | — | 60 / 0 | ✅ `M-lithowanderer` |
| Crabe | 3:00 | 120 s | 3 640 / 384,30 / 7 867 | 55 / 1,15 / 68 | 37 / 37 | ✅ `M-crab` |
| Petit crabe | 0:42 | 20 s | ❓ | ❓ | ❓ | ✅ `M-crab` |
| Scarabée de feu | 0:39 | 70 s | 2 501 / 126,69 / 3 895 | 113 / 2,30 / 138 | 37 / 37 | ✅ `M-fire-beetle` |
| Lézard cornu | 0:40 | 70 s | 3 019 / 156,69 / 4 743 | 110 / 2,30 / 135 | 37 / 37 (+70 sous 50 % PV) | ✅ `M-horned-lizard` |
| Golem de lave | 0:31 | 70 s | 3 000 / 81,50 / 3 897 | 156 / 2,30 / 238 ⚠️ (incohérent avec +2,30/min) | 37 / 37 | ✅ `M-lava-golem` |

Tous ces camps attaquent toutes les secondes, à 100 % de leur attaque physique (le Lithovagabond n'attaque pas).

### Or et XP des camps MLBB

| Camp | Or | Source et confiance |
| --- | --- | --- |
| Lithovagabond / lézard / golem / crabe | 92 / 92 / 81 / 36 | ⚠️ `M-jungle` (non daté) |
| Fenrir petit / grand ; Démon | 22 / 100 ; 120 | ⚠️ `M-jungle` |
| Ordres de grandeur | camps simples ≈ 50–70, bonus ≈ 120, crabe d'or ≈ 90 | ⚠️ `gold.md` |
| Historique | 1.5.38 : or de base du Démon 43 → 32, croissance 1,43 → 1,07/min. 2.1.90 : +20 % (bonus), +15 % (petits camps). 2.2.16 : −13 % (petits camps). | ✅ notes de patch ; valeurs absolues actuelles ❓ |
| XP | « large » pour la Tortue ; croissance XP 2,5/min (Démon, Fenrir, patch 1.5.38) | ❓ (valeurs de base absentes) |
| 2 premières minutes | un camp tué dans **votre** jungle donne or et XP au héros proche qui porte Châtiment | ✅ `M-p1906` |

### Bonus (buffs) de jungle MLBB

| Bonus | Effet | Durée | Contre-jeu observable | Source |
| --- | --- | --- | --- | --- |
| Orange (Âme de lave) | Chaque attaque sur un héros déclenche une frappe (CD 3 s) de dégâts bruts avec ralentissement de 1 s. Assassin, combattant, tank : 50 (+20 % attaque phys. totale) (+0,3 % ❓ de quoi), ralentissement 60 %, +5 % de pénétration adaptative. Tireur, mage, soutien : 50 (+30 %) (+0,5 % ❓), ralentissement 20 %, +10 % de pénétration. | 75 s | perdu à la mort ❓ (non écrit) | ✅ `M-molten-fiend` |
| Violet (Âme du vent) | −10 % de temps de recharge, −60 % de coût en mana, −25 % de coût en énergie ; soin en tuant : sbire 3 %, héros 8 %, créature 12 % (des PV max ❓) | 75 s | ❓ | ✅ `M-thunder-fenrir` |
| Fruits (Démon et Fenrirs) | 3 fruits pendant 5 s : 153 (+1 % attaque phys. totale) PV et 0,2 % de mana chacun | 5 s | peuvent être ramassés par n'importe quel héros ❓ | ✅ |
| Soin (scarabée, lézard, golem) | 350 PV et 5 % de mana en 2 s | 2 s | — | ✅ |
| Or (crabe) | +60 or en 18 s ; petit crabe : +30 or en 10 s | 18 s / 10 s | — | ✅ `M-crab` |
| Herbe ambulante (Lithovagabond) | +1 % de mana/s aux alliés proches ; +15 % de vitesse dans la rivière ; « Rôdeur de pierre » qui patrouille et révèle les ennemis | 45 s | le rôdeur peut être attaqué | ✅ `M-lithowanderer` |
| Chemin des Fenrirs | un passage s'ouvre derrière le camp jusqu'à sa réapparition | jusqu'à la réapparition | — | ✅ |

### Unite : Pokémon sauvages (Theia Sky Ruins, 5v5, 10 min)

| Pokémon | Points (Aeos) | Apparition | Changement en phase finale | PV de base | Attaque de base | XP de base | Effet | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Bunnelby | 2 | ❓ | — | 1 300 | 58 | 250 | — | ⚠️ `U-theia` (identique à Aipom) |
| Bunnelby (vague) | 5 | chaque minute | évolue en Diggersby | 1 720 | 116 | 70 | — | ⚠️ |
| Diggersby | 7 | 2 dernières min | — | 1 720 | 116 | 120 | — | ⚠️ |
| Indeedee | 6 | ❓ | +2 points | 2 360 | 116 | 250 | — | ⚠️ |
| Baltoy → Claydol | 3 → 4 | ❓ / 2 dernières min | évolue | 1 380 → 1 720 | 93 | 60 | — | ⚠️ |
| Escavalier | 4 | ❓ | +3 points | 2 400 | 93 | 230 | petit bonus de dégâts + ralentissement des adversaires | ⚠️ |
| Accelgor | 4 | ❓ | +3 points | 2 400 | 93 | 230 | petite réduction des temps de recharge | ⚠️ |
| Natu / Xatu | 1 / 2 | ❓ | — | 1 190 / 1 890 | 58 | 250 | — | ⚠️ |
| Swablu / Altaria | 2 / 4 | chaque minute | +1 / +3 points | 1 110 / 2 750 | 58 / 93 | 80 / 190 | — | ⚠️ |

Note `U-theia` : « les PV et stats des adversaires augmentent au fil de la partie ». La loi de croissance n'est pas donnée ❓.

### Ce qu'il faut retenir

- **MLBB est le seul des trois à publier une loi de croissance simple** (initiale + gain par minute). Elle est directement réutilisable dans le moteur.
- Les bonus MLBB durent **75 s** et réapparaissent toutes les **90 s**. Un jungleur efficace les garde donc presque en continu ; les patchs successifs ont réglé ce rythme (120 → 90 s).
- LoL fait dépendre les camps du **niveau moyen** des joueurs, et MLBB du **temps**. Le niveau s'auto-équilibre ; le temps est plus lisible et prévisible.
- Le bonus orange MLBB **dépend du rôle** : plus de dégâts pour les rôles fragiles, plus de ralentissement pour les rôles robustes. C'est l'idée la plus originale de G2.
- Unite remplace l'or par des **points à marquer** et de l'**XP** : un monstre sauvage vaut des points, de l'XP et parfois un petit bonus. C'est exactement le modèle « sans boutique » qu'il nous faut.

### Piste pour Mythic Mayhem

- **Loi de croissance MLBB** (initiale + gain/min) pour tous les camps : une ligne de données par camp, testable.
- **Récompense = XP + bonus**, plus d'or. Trois options, à trancher :
  1. **XP seule** (le plus simple ; respecte « une seule monnaie »). La puissance vient des niveaux. Les objets d'avant-partie peuvent gagner des **paliers liés au niveau du héros** (par exemple aux niveaux 5 et 10), ce qui recrée la montée en puissance que l'or donnait dans MLBB.
  2. **XP + charges d'objet** à la manière d'Unite (Attack Weight : +6 à +12 Attaque par but marqué, 6 fois maximum, ✅ `U-held`). Ici, la charge viendrait des camps ou des objectifs. Plus riche, mais crée une seconde ressource.
  3. **XP + points d'équipe** qui débloquent des améliorations collectives, comme les paliers « Aeos Tech » de First to 500 (50 / 100 / 200 / 350 points, ✅ `U-500`). Plus de décisions, mais plus de menus.
  - Recommandation : **option 1 pour le prototype**, l'option 2 en réserve si les objets d'avant-partie manquent de croissance.
- **Deux bonus seulement** (équivalents orange et violet), pour respecter le brief (« éviter de nombreux buffs temporaires »). Le crabe d'or, les camps de soin et l'herbe ambulante sont **repoussés**.
- **Contre-jeu et indicateurs** (règle de `CLAUDE.md`) :
  - Bonus « brûlure » (orange) : dégâts bruts et ralentissement (CD 3 s), bonus selon le rôle. **Contre-jeu** : le bonus passe au tueur quand son porteur meurt sous les coups d'un héros, comme les crêtes de LoL ; éviter les échanges longs pendant le CD de 3 s. **Indicateur** : aura orange autour du porteur ; flammèche au-dessus de la cible pendant le ralentissement.
  - Bonus « flux » (violet) : recharge réduite. **Contre-jeu** : même transfert à la mort ; le camp est visible sur la minicarte avec un minuteur. **Indicateur** : aura violette autour du porteur, compteur de durée sous son portrait.
- **Rythme compressé** pour une partie de 6 à 10 min : apparition vers 0:20, réapparition 60 à 75 s, bonus de 45 à 60 s. Ce ne sont pas des valeurs relevées : ce sont des hypothèses à mesurer en télémétrie.
- **Patience et laisse** : reprendre la règle de LoL (« soft reset » de 6 s, soin de 6 % des PV max par s), seule règle documentée.

### Manques

| Valeur | Où l'obtenir |
| --- | --- |
| Effets et durées actuels des crêtes LoL ; réapparitions de tous les camps LoL | wiki LoL : pages « Blue Sentinel », « Red Brambleback », « Gromp », « Krug », « Raptor », « Murk Wolf », « Rift Scuttler » (le tableau des temps est sur chaque page) |
| Échelle de niveau des camps LoL | mêmes pages (section « level scaling ») |
| XP des camps MLBB, or actuel après 2.2.16 | Pas sur le wiki. **Mesure** en mode personnalisé : héros seul, niveau 1, sans emblème ; noter l'or et l'XP affichés au tableau des scores avant et après chaque camp, à 1:00, 6:00 et 12:00. Répéter 3 fois. |
| Base du « +0,3 % » et du « +0,5 % » du bonus orange ; base du soin violet (PV max ?) | infobulle du bonus en jeu (capture d'écran) |
| Le bonus MLBB est-il perdu à la mort, ou transférable ? | **Mesure** : mourir sous le bonus face à un héros, puis observer l'icône de bonus des deux héros |
| Courbe de croissance des sauvages Unite ; stats réelles de Theia (doute de copier-coller) | unite-db (page carte actuelle, si un JSON existe comme `remoat_island.json`), Bulbapedia ou Liquipedia Pokémon Unite. **Mesure** en entraînement : compter les coups d'une attaque de base connue (formule de dégâts de `unitedb-damage-formula.md`). |

---

## G3. Objectifs majeurs

### LoL (Faille de l'invocateur, patch 26.x)

| Objectif | Apparition | Réapparition | PV | Dégâts | Récompense | Effet principal | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Larves du Néant (×3) | 8:00, une seule fois ; disparaissent à 14:45 | jamais | 2 269 – 4 700 (niveau ≥ 7) | 21,69 – 46 | par larve : 30 or (tueur), 65 XP | 1 cumul de « Touch of the Void » à toute l'équipe (brûlure des structures, valeurs ❓) ; à 3 cumuls, « Hunger of the Void » : invoque des Voidmites contre les tours. Les larves survivantes se soignent de 30 % PV max + 30 % PV manquants. | ✅ `L-grubs` |
| Héraut de la Faille | 15:00, une seule fois ; disparaît à 19:45 | jamais | 11 718 – 18 900 (niveau ≥ 9) | 99,5 – 250 (+20 % PV actuels) | 100 or, 240 XP | Laisse l'Œil du Héraut (20 s) qui invoque un **Héraut mercenaire** : 4 319,8 – 7 090 PV ; charge sur une structure : **3 000 dégâts bruts**, puis ×2/3 à chaque nouvelle charge ; coupe l'armure renforcée des tours ; un champion peut le chevaucher. | ✅ `L-herald` |
| Drakes élémentaires | 5:00 | 5:00 | 5 106,25 – 10 000 | 30 % pénétration d'armure ; bonus de 5 % des PV actuels par attaque | 75 or (tueur), 160 – 400 XP locale | Cumul « Dragon Slayer » permanent pour l'équipe (valeurs ❓) ; au 3ᵉ drake, la carte devient « Faille élémentaire » ; 4ᵉ drake = Âme. Réduction de dégâts de 15 % par cumul de Dragon Slayer adverse (max 60 %). | ✅ `L-dragon` (V26.01). `L-units` donne 3 625 PV + 375/niveau ⚠️ |
| Dragon ancestral | après le 4ᵉ drake d'une équipe | 6:00 | 17 796,25 – 21 275 (niveau ≥ 13) | ❓ | 150 or global, 650 XP globale | « Aspect of the Dragon » : vivants seulement, perdu à la mort (valeurs ❓) | ✅ `L-dragon` |
| Baron Nashor | 20:00 | 6:00 | 17 791,75 – 19 190 (niveau ≥ 11) | 350,5 – 515 | 150 or global + 100 au tueur, 650 XP globale | « Main du Baron », 180 s, vivants seulement : AD, AP, rappel amélioré, aura qui renforce les sbires proches (valeurs ❓) | ✅ `L-baron`. `L-units` donne 16 300 PV ⚠️ |
| Atakhan | — | — | (historique : 8 000 – 18 400) | — | — | **Retiré en V26.01** | ✅ `L-atakhan`, `L-monster` |

Règle de retour LoL (Baron, drakes) : l'équipe en retard gagne **+25 % d'XP par niveau de retard, plafonné à ×2** ✅ `L-baron`, `L-dragon`.

### MLBB

| Objectif | Apparition | Réapparition | PV | Attaque | Défenses | Récompense | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Tortue | 2:00 (la 1ʳᵉ près de la voie de l'XP) | 120 s après la mort ; plus de Tortue si la dernière meurt après 6:00 ; 4 au maximum (patch 1.5.38 ⚠️) | 10 367 + 1 067,15/min | 260 + 21,72/min (attaque/s, 100 % physique) | 15 + 10/min | Or d'équipe : 60 / 70 / 80 par héros pour les 1ʳᵉ, 2ᵉ et 3ᵉ (total 300 / 350 / 400) ; XP « importante » ❓. Tueur : soin instantané ❓ + bouclier 400 (+40 × niveau) qui se répare après 5 s sans dégâts, +20 (+2 × niv.) attaque phys., +25 (+4 × niv.) puissance magique, 120 s. Alliés : bouclier unique de 200 (+20 × niv.), 120 s. | ✅ `M-turtle` (**avant 2.2.16**) ; `gold.md` dit « 60 + 20 par Tortue » ⚠️ |
| Tortue (depuis 2.2.16) | ❓ | ❓ | ❓ | ❓ | ❓ | Plus de bouclier : une **Tortue alliée** apparaît sur la voie la plus forte de l'ennemi pour la pousser ; soin rapide des héros alliés proches ; « compagnons tortues » pour attaquer les tours | ⚠️ `M-p2216` (sans chiffres) |
| Seigneur | 8:00, ou 2 min après la mort de la dernière Tortue. Une Tortue non tuée à 8:00 devient Seigneur après 5 s sans dégâts (au plus tard à 9:00) | 180 s entre 8 et 18 min ; 120 s après 18 min (`M-lord`) **ou** 2,5 min (infobox) ⚠️ | 31 743 + 2 242/min, arrêt de la croissance à 18 min (12 min : 42 953 ⚠️, soit +5 × gain) | 428 + 20,15/min ; attaque brute/s à 100 %. Frappe du tonnerre toutes les 4 s : 110 % brut en zone. Force de l'océan toutes les 8 s : 150 % brut + projection en l'air 1 s. | 37 / 37 | Le Seigneur rejoint l'équipe et pousse la voie la plus faible ; renforce les **vagues suivantes** des 3 voies jusqu'à sa mort | ✅ `M-lord`, `M-time` |
| Seigneur invoqué | à la vague suivante (xx:10 ou xx:43) | — | 16 218 + 1 672/min (patch 1.9.06) | ❓ | réduction de dégâts de 15 % à 35 % (+4 % par héros allié proche) | Charge sur la 1ʳᵉ tour : 30 % des PV max en brut (8–18 min) ; 50 % s'il est amélioré ou évolué ⚠️ (`M-turret`). Héros alliés proches : +250 (+50 % attaque phys.) (+50 % puissance mag.) (+2,5 % PV totaux) dégâts magiques par attaque, CD 2 s. Les tours le ciblent en priorité. | ✅ `M-lord`, `M-p1906` ; `M-turret` ⚠️ |
| Paliers du Seigneur | « amélioré » à 12 min, « évolué » à 18 min (`M-time`) ; l'infobox dit « évolué à 12 min » ⚠️ | | | | | | |

### Unite

| Objectif | Carte | Apparition | Réapparition | Points | PV / Attaque / XP de base | Effet | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Regieleki | Theia (5v5, 10 min) | 3:00 ⚠️ (« 3 Minute ») | 2 min après le KO | 20 | 5 150 / 185 / 320 | va vers le but adverse le plus proche ; **marquage instantané** pendant 15 s | ⚠️ `U-theia` |
| Regirock / Regice / Registeel | Theia | idem | idem | 20 | 5 150 / 185 / 320 | équipe : Déf. et Déf. Spé. ↑ / récupération de PV ↑ / Attaque et Atq. Spé. ↑, « pour peu de temps » (valeurs ❓) | ⚠️ `U-theia` |
| Rayquaza | Theia | 8:00 (2 dernières minutes) | — | 30 | 9 200 / 232 / 720 (+10 % de PV dans un patch récent) | bouclier d'équipe qui **accélère le marquage** et empêche le blocage des buts ; courants d'air selon le nombre de buts sans défense | ✅ `U-theia`, `U-patch` |
| Rotom | Remoat (ancien) | 3:00 (« 7:00 » restant) | 2 min | 20 | 4 290 / 116 / 320 | marche vers le but adverse ; marquage instantané pendant 25 s (15 → 25 s par patch) | ✅ `U-remoat`, `U-legacy` |
| Drednaw | Remoat (ancien) | 3:00 | 2 min | 20 | 4 320 / 122 / 320 | 660 XP d'équipe + bouclier de 8 % PV max (`U-legacy`) ; un patch indique 20 → 10 % de bouclier et 55 → 20 % XP « du niveau actuel » ⚠️ | ⚠️ |
| Zapdos | Remoat (ancien) | 8:00 (« 2:00 » restant) | jamais | 30 pour le tueur, 15 par coéquipier (patch : 20 → 15) | 6 610 / 162 / 720 | marquage instantané sur les buts adverses pendant 30 s, plus des dégâts aux adversaires | ✅ `U-legacy`, `U-patch` |
| Regigigas | Auroma Park (**3v3**, 5 min) | après 2 min | ❓ | 50 (+5 en phase finale) | 8 640 / 232 / 980 | ❓ | ✅ `U-auroma` |
| Araquanid | Auroma Park | ❓ | ❓ | 15 (+5) | 4 130 → 4 290 / 122 → 185 / 250 | invoque des Dewpider (2 points) quand on l'attaque | ✅ `U-auroma` |

### Ce qu'il faut retenir

- Les trois jeux suivent la même **courbe dramatique** : un objectif précoce petit et répétable (larves 8:00, Tortue 2:00, Regis 3:00), puis un objectif final de poussée (Baron 20:00, Seigneur 8:00, Rayquaza à 2 min de la fin).
- **MLBB et Unite pensent en minutes de match court** : Tortue à 2:00 et Seigneur à 8:00 (MLBB) ; Regis à 3:00 et Rayquaza à 8:00 (Unite). Ces horaires vont presque tels quels avec notre cible de 6 à 10 min.
- L'objectif final des trois jeux **convertit la victoire en pression sur les structures** : Seigneur qui pousse, Héraut qui charge (3 000 bruts), Regieleki ou Rotom qui donne le marquage instantané. C'est le levier de fin de partie le plus lisible.
- MLBB 2.2.16 va dans le même sens : la Tortue ne donne plus un bouclier (invisible), mais une **unité alliée qui pousse** (visible).
- Les bonus individuels compliqués (Dragon Slayer, Âmes, Faille élémentaire) sont propres à LoL et lourds à lire. Unite garde des effets d'équipe courts et simples.

### Piste pour Mythic Mayhem

- **Deux objectifs**, horaires MLBB et Unite comprimés :
  - **Objectif précoce** (équivalent Tortue ou Regis) : apparition vers 1:30–2:00, réapparition 90 à 120 s, plus d'apparitions passé ≈ 5:00. Récompense : **XP d'équipe** + un **effet d'équipe simple** (bouclier unique, ou soin de zone comme la Tortue 2.2.16).
  - **Objectif final** (équivalent Seigneur) : apparition vers 5:00–6:00, réapparition 120 s. Récompense : une **unité alliée qui pousse** la voie la plus faible, plus des vagues renforcées tant qu'elle vit.
  - Ces horaires sont des **propositions**, à valider par la télémétrie sur la durée de partie.
- **Pas d'or** : les récompenses MLBB en or (Tortue 60–80 par héros) deviennent de l'**XP d'équipe**. On reprend la règle de retour de LoL (+25 % d'XP par niveau de retard, ×2 au maximum) pour que l'objectif profite au perdant.
- **Contre-jeu et indicateurs** :
  - Objectif précoce. **Contre-jeu** : il est visible et minuté pour les deux équipes ; le vol par dernier coup est possible. **Indicateur** : minuteur sur la minicarte, alerte globale à l'apparition et à la mort.
  - Unité de poussée. **Contre-jeu** : elle reste une unité qu'on peut tuer ; sa réduction de dégâts dépend des alliés proches (règle MLBB, 4 % par héros). On l'arrête donc en isolant l'escorte. **Indicateur** : contour aux couleurs de l'équipe, trajectoire de voie affichée, alerte « charge » avant le coup sur une tour (cf. l'alerte « Assist Me » du Héraut).
- **3v3** : Unite Auroma Park (3v3, 5 min) n'a qu'**un** objectif majeur (Regigigas, 2:00, 50 points). C'est un argument pour **un seul objectif en 3v3**, et les deux en 5v5.

### Manques

| Valeur | Où l'obtenir |
| --- | --- |
| Valeurs de Dragon Slayer, de l'Âme, de l'Aspect, de la Main du Baron (stats, buff des sbires), de Touch et Hunger of the Void | wiki LoL : pages « Dragon Slayer », « Hand of Baron », « Touch of the Void », « Hunger of the Void » |
| Valeurs de la Tortue 2.2.16 (Tortue alliée : PV, soin, compagnons) | onglet « Battlefield Overview » du jeu ; wiki MLBB quand la page sera mise à jour. **Mesure** : partie personnalisée, tuer la Tortue à 2:00, relever les PV de la Tortue alliée (graduations de 2 000 PV pour la Tortue et le Seigneur) et le soin reçu par seconde (vidéo à 60 i/s). |
| XP de la Tortue et du Seigneur | **Mesure** : tableau des scores avant et après le kill, avec 1 puis 3 héros présents |
| Durées et valeurs des bonus Regi | infobulles en jeu ; unite-db. **Mesure** en entraînement : Déf. avant et après, via l'écran des stats. |
| Horaire exact des Regis (3:00 de jeu ou 3:00 restant ?) | Serebii est ambigu. **Mesure** : chronométrer une partie standard. |

---

## G4. Structures : tours, inhibiteurs, base

### Tours : stats

| Tour | PV | Dégâts | Vit. att. / portée | Armure / RM (ou défenses) | Récompense | Source |
| --- | --- | --- | --- | --- | --- | --- |
| LoL extérieure | 9 000 | 182 – 350 (selon les minutes) | 0,833 / 750 u | 60 / 60 ; perd 10 et 15 par minute de 11:00 à 15:00 (plafond −40 et −60) | 50 or global ; plaques : 5 × 120 or local ; +300 pour la **première** tour de la partie | ✅ `L-turret` |
| LoL intérieure | 5 000 | 187 – 427 | 0,833 / 750 u | 60 / 60 | 25 global | ✅ |
| LoL d'inhibiteur | 4 750 | 187 – 427 | 0,833 / 750 u | 60 / 60 | 25 global ; régénère 3 PV/s jusqu'au tiers en cours (30 %, 75 %, 100 %) | ✅ |
| LoL de Nexus (×2 par équipe) | 3 500 | 165 – 405 | 0,833 / 750 u | 60 / 60 | 50 global ; **réapparaît** 3 min après sa destruction avec 40 % de PV ; régénère 6 PV/s | ✅ |
| LoL ARAM extérieure / inhibiteur / Nexus | 1 300 / 3 900 / 1 800 **+ 250 par champion ennemi** | 185 – 293 / 205 – 385 / 195 – 375 | 0,833 / 750 u | 60 – 81 / 63 – 84 / 60 – 81 | 150 or global ; 30 / 70 / 120 XP globale | ✅ `L-turret` |
| MLBB extérieure | 4 500 | 320 (+3,82/min) | 1 attaque/s / 5,3 unités | 20 / 20 | Bouclier doré : 1 or par 10 dégâts, 360 or par voie ; tour : ≈ 100–150 ⚠️ `gold.md` ; « beaucoup plus » depuis 2.2.16 ❓ | ✅ `M-turret` |
| MLBB intérieure | 5 500 (6 000 en Mythique) ; augmentée en 2.2.16 ❓ | 360 (+3,82/min) | idem | 20 / 20 | idem ⚠️ | ✅ / ⚠️ |
| MLBB de base (inhibiteur) | 6 900 ; augmentée en 2.2.16 ❓ | 520 (+3,82/min) | idem | 40 / 40 | idem ⚠️ | ✅ / ⚠️ |
| MLBB base | 7 900 ; régénère 165 PV toutes les 5 s | 539 (+3,82/min) | idem | 40 / 40 | — (victoire) | ✅ `M-turret` |
| Unite | pas de tours : les **zones de but** jouent ce rôle (voir G5) | | | | | |

Les valeurs « à 12 min » de l'infobox MLBB (404 / 459 / 641 / 585) ne correspondent pas à +3,82/min sauf pour la base ⚠️.

### Tours : dégâts croissants, protections, ciblage

| Règle | LoL | MLBB |
| --- | --- | --- |
| Montée des dégâts sur un héros | « Warming Up » : +50 % par coup sur un champion, max +150 % ; remise à zéro 5 s après le dernier coup, **pas** au changement de cible ✅ | +75 % du coup initial (+240) par coup : 320, 560, 800 … 4 880 au 20ᵉ coup (max). Remise à zéro après 2 s sans dégâts. Dégâts **bruts, non réductibles** ✅ `M-turret` |
| Type de dégâts | physiques, 30 % de pénétration d'armure ; projectile imblocable à 1 200 u/s ✅ | brut ✅ |
| Protection sans sbires (« backdoor ») | −80 % de dégâts subis (même bruts) sans sbire ennemi ni Héraut à proximité ; retour 3 s après ✅ | −50 % de dégâts subis sans sbire ennemi à portée ✅ |
| Protection de début | Plaques : 5 plaques ; à 90 %, 75 %, 55 % et 30 % des PV, « Bulwark » de 20 s : +30 à 50 armure et RM par cumul (selon les champions proches), max +120 à 200 ✅. Les plaques **restent** après 14:00 depuis V26.01. | Bouclier doré (extérieures, 5 premières min) : absorbe 5 000, −30 % de dégâts subis ; héros alliés proches : −15 % de dégâts subis (−25 % sur la voie de l'or en Mythique) ✅. Tours inactives jusqu'à 15 s après la 1ʳᵉ vague ✅. |
| Alerte de chute rapide | Tour d'inhibiteur : −35 % de dégâts pendant 60 s après la chute de l'extérieure (version ARAM) ✅ | « Alerte orange / rouge » : si la tour précédente tombe avant 8:00, +60 défenses et −40 % de dégâts subis pendant 60 s ✅ |
| Aide à l'attaquant | « Crystalline Overgrowth » : dès 1:40, le prochain coup d'un champion inflige des dégâts bruts bonus de 2–3,3 % (niveau 1) à 8,8–18,9 % (niveau 18) des PV max de la tour ; montée sur 240 s ✅ | — |
| Bonus des mêlées | +20 % de dégâts subis des champions de mêlée ✅ | — |
| Ciblage | 1ʳᵉ unité entrée à portée, puis familiers > siège/super > mêlée > distance > champion. Bascule sur un champion qui blesse un champion allié à moins de 1 400 u ✅ | 1ʳᵉ cible valide ; Seigneur invoqué prioritaire parmi les non-héros ; bascule si un héros ennemi à portée blesse un héros allié ✅. N'attaque pas les créatures de jungle. |
| Ordre de vulnérabilité | seule la tour la plus avancée d'une voie est ciblable ; Nexus vulnérable si un inhibiteur tombe ✅ | idem ; la base devient vulnérable dès qu'une tour de base tombe ✅ |
| Vision | 1 350 u ; vision vraie à 1 100 u ✅ | 8 unités ; révèle camouflage et invisibilité ✅ |
| Indicateur | barre de ressource = cumuls de « Warming Up » ✅ | zone jaune (seul), **verte** (la tour vise un allié : on peut entrer), **rouge** avec triangles et son (on est la cible) ✅ |

### Inhibiteurs, Nexus, base

| Élément | LoL | MLBB |
| --- | --- | --- |
| Inhibiteur | n'attaque pas ; détruit, il fait apparaître des super-sbires ✅. PV et délai de réapparition ❓ | pas d'inhibiteur distinct : la « tour d'inhibiteur » en tient lieu |
| Nexus / base | PV ❓ | 7 900 PV, +165 PV / 5 s ✅ |
| Fontaine | ❓ (hors périmètre) | soin de 10 % PV et mana toutes les 0,2 s ; 2 000 dégâts bruts toutes les 0,2 s aux ennemis ✅ `altar.md` |

### Ce qu'il faut retenir

- Les deux jeux combinent **dégâts croissants**, **protection sans sbires** et **protection de début**. Sous des noms différents, c'est le même triptyque.
- La montée de MLBB est bien plus brutale (×15 au 20ᵉ coup, bruts, remise à zéro en 2 s) que celle de LoL (×2,5, remise à zéro en 5 s). Plonger sous une tour MLBB se joue en 2–3 coups.
- L'**indicateur trois couleurs** de MLBB est l'élément de lisibilité le plus fort de G4. Il répond directement au brief (« afficher clairement : en danger »).
- Les PV des tours d'ARAM **croissent avec le nombre de champions adverses** (+250 chacun). C'est un mécanisme tout fait pour passer du 3v3 au 5v5.
- Les plaques de LoL et le bouclier doré de MLBB ont surtout une **fonction économique** (de l'or pour qui frappe tôt). Sans boutique, cette fonction disparaît.

### Piste pour Mythic Mayhem

- **Structure MLBB** : tours extérieure, intérieure et de base par voie, puis la base qui se régénère. En 3v3 : 2 tours par voie peuvent suffire (décision liée à la carte, B2).
- **PV des tours = base + k × nombre d'adversaires** (règle ARAM) : le même fichier de carte sert en 3v3 et en 5v5.
- **Montée des dégâts** : reprendre la forme MLBB (+X par coup, remise à zéro rapide) mais avec un plafond proche de LoL, pour que les plongées soient punies sans être instantanément mortelles. À régler en simulation.
- **Protection sans sbires** : oui (−50 % façon MLBB ; plus simple à lire que −80 %).
- **Protection de début** : garder le **bouclier** des tours extérieures (durée comprimée, environ 2 à 3 min), mais **sans or**. Option : briser le bouclier donne de l'XP à l'équipe, pour récompenser l'agression précoce.
- **Indicateur trois couleurs MLBB** repris tel quel (jaune, vert, rouge, plus un son), avec le compteur de cumuls de LoL sur la tour.
- **Contre-jeu de la tour** : faire entrer un sbire allié dans sa portée (elle change de cible et sa montée retombe après la remise à zéro) ; ne pas blesser un héros ennemi sous sa tour.

### Manques

| Valeur | Où l'obtenir |
| --- | --- |
| PV et réapparition des inhibiteurs LoL, PV du Nexus | wiki LoL : pages « Inhibitor » et « Nexus » |
| Or ou valeur des tours MLBB après 2.2.16, nouveaux PV des tours intérieures et de base | onglet « Battlefield Overview » ; wiki à jour. **Mesure** : PV par les graduations (1 000 PV) en partie personnalisée ; or au tableau des scores avant et après la chute. |
| Distance d'une « unité » MLBB en unités LoL | **Mesure** : portée de tour (5,3) et vision (8) ; comparer à une distance connue sur une capture de la minicarte. Utile pour toute la famille B. |
| Loi de croissance des dégâts de tour MLBB | les valeurs à 12 min ne collent pas : **mesure** du 1er coup à 0:30, 6:00 et 12:00 sur un héros à défense connue |

---

## G5. Zones de but de Unite (marquer des points)

| Règle | Valeur | Source |
| --- | --- | --- |
| Victoire | le plus de points à la fin du temps (10 min en 5v5 standard ; 5 min en Quick Battle 3v3 et 4v4) ; variante **First to 500** : la première équipe à 500 points | ✅ `serebii-score-and-medals.md`, `serebii-stages.md`, `U-500` |
| Source des points | « Énergie Aeos » lâchée par les Pokémon sauvages (valeurs en points, voir G2 et G3) et par les adversaires mis KO | ✅ `serebii-mechanics.md` |
| Marquer | porter l'énergie dans une zone de but adverse ; plus on porte, **plus c'est long**, et on est vulnérable ; une attaque interrompt le marquage | ✅ (texte) ; temps exact selon la charge ❓ |
| Capacité portée | probablement 50, déduit d'un passif qui découpe 0–8 / 9–16 / 17–24 / 25–50 ; l'aptitude « Energy Capacity » donne +100 % | ⚠️ `U-patch`, `U-500` (déduction) |
| PV d'une zone | chaque point marqué retire des PV à la zone ; à 0 elle est détruite. Ancienne carte : zones de niveau 1 détruites à **80 points**, de niveau 2 à **100 points**, zone de base **indestructible** | ✅ `U-legacy` (ancienne carte) ; Theia ❓ (README unite) |
| Nombre de zones | 2 voies × 2 niveaux + 1 de base = 5 par équipe (ancienne carte) | ✅ `U-legacy` |
| Zones alliées | soignent et donnent un bouclier à leurs défenseurs ; renforcés sur les zones du milieu et de base ; soin au marquage réduit (patch 1.2.x) | ✅ `U-patch` (sans valeurs) ❓ |
| Accélérateurs | Goal-Getter (objet de combat) : marquage ×2 pendant 10 s, CD 60 s. Amulet Coin : +10 % de vitesse de marquage. Rayquaza : bouclier qui accélère le marquage. Regieleki, Rotom, Zapdos : marquage **instantané** 15, 25 ou 30 s. | ✅ `U-battle`, `U-held`, `U-theia`, `U-legacy`, `U-patch` |
| Protection du marqueur | Score Shield : pendant le marquage, bouclier de 5–10 % PV max (+ selon le niveau) qui empêche l'interruption, CD 20 s | ✅ `U-held` |
| Contre-jeu | Goal Hacker : 4 s sur une zone adverse, coupe ses boucliers et son soin (×2 sur une zone alliée). Un adversaire peut interrompre le marquage. | ✅ `U-battle` |
| Récompense de marquer | objets tenus qui cumulent à chaque but (6 fois max) : Attack Weight +6/9/12 Attaque ; Sp. Atk Specs +8/12/16 ; Aeos Cookie +100/150/200 PV max | ✅ `U-held` |
| Shivre City (4v4) | une jauge remplie par les buts, KO et assistances donne le marquage instantané | ✅ `serebii-stage-shivrecity.md` |

### Ce qu'il faut retenir

- Le système de but de Unite est **un objectif et une économie à la fois** : les points sont à la fois le score, la ressource à protéger et le moteur de progression des objets (Attack Weight).
- Les zones de but sont des **tours sans attaque** : elles soignent et protègent leurs défenseurs, et tombent après un nombre de points marqués. C'est l'équivalent Unite de G4.
- Tous les objectifs majeurs de Unite agissent sur la **vitesse de marquage**. Le système est cohérent de bout en bout.
- **Les valeurs clés manquent** : temps de marquage selon la charge, PV des zones de Theia, montant du soin et du bouclier des zones.

### Piste pour Mythic Mayhem

- La victoire reste la **destruction de la base** (squelette MLBB, déjà décidé). G5 n'est donc **pas** la condition de victoire.
- Deux emprunts possibles, à discuter :
  1. **Récompense de canalisation** : capturer l'objectif majeur demande une canalisation interruptible, comme un but Unite. Cela donne un contre-jeu lisible au vol d'objectif.
  2. **Objets d'avant-partie qui cumulent sur des actions d'équipe** (tour détruite, objectif pris), sur le modèle d'Attack Weight (6 cumuls maximum). C'est la réponse la plus directe à « que gagne-t-on sans or ? ».
- Un **mode alternatif** « score » (Unite) pourrait réutiliser la même carte plus tard. Hors prototype.

### Manques

| Valeur | Où l'obtenir |
| --- | --- |
| Temps de marquage selon l'énergie portée | **Mesure** en partie contre l'IA : filmer à 60 i/s ; noter les images entre le début et la fin du marquage pour 1, 5, 10, 20, 30, 40 et 50 points, sans objet puis avec Goal-Getter. 3 répétitions par point de mesure. |
| PV des zones de Theia (points avant destruction) | **Mesure** : marquer dans une seule zone et compter les points jusqu'à sa destruction ; ou Liquipedia / Bulbapedia Pokémon Unite |
| Soin et bouclier des zones alliées | **Mesure** : PV affichés dans la zone (vidéo), avec et sans Goal Hacker adverse |
| Capacité maximale d'énergie | **Mesure** : ramasser jusqu'au blocage du compteur |

---

## Synthèse : ce que G change pour Mythic Mayhem

| Question | Constat | Proposition (à trancher en R2) |
| --- | --- | --- |
| Que rapportent sbires et camps sans boutique ? | Dans MLBB, l'or ne sert qu'à acheter. Unite répond par des points et de l'XP. | **XP seule** pour le prototype. Paliers d'objets d'avant-partie liés au niveau du héros. Cumuls façon Attack Weight en réserve. |
| Durée | Tortue 2:00, Seigneur 8:00 (MLBB) ; Regis 3:00, Rayquaza 8:00 (Unite) | Horaires MLBB et Unite comprimés pour 6–10 min, à valider en télémétrie |
| 3v3 vs 5v5 | Unite 3v3 : 1 seul objectif majeur. ARAM : PV des tours + 250 par adversaire. | Objectifs et PV de structure paramétrés par la taille d'équipe |
| Lisibilité | Indicateur trois couleurs des tours MLBB ; alertes globales des objectifs | Repris tels quels |
| Données les plus fragiles | MLBB 2.2.16 (Tortue, tours) sans chiffres ; stats des sbires MLBB absentes ; temps de marquage Unite absents | Mesures en jeu (protocoles ci-dessus) ou pages wiki à extraire |

### Pages à ajouter aux scripts d'extraction (sans mesure en jeu)

- **LoL** : Melee / Caster / Siege / Super minion ; Blue Sentinel, Red Brambleback, Gromp, Krug, Raptor, Murk Wolf, Rift Scuttler ; Dragon Slayer, Hand of Baron, Touch of the Void, Hunger of the Void ; Inhibitor, Nexus.
- **MLBB** : pages du wiki après la carte 2026 (Turtle, Turret), dès leur mise à jour.
- **Unite** : un éventuel JSON de carte actuelle sur unite-db (équivalent de `remoat_island.json`), Liquipedia ou Bulbapedia pour les zones de but de Theia.
