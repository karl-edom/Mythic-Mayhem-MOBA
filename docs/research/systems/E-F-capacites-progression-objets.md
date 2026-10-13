# Familles E et F — Capacités, progression et objets (LoL | MLBB | Unite)

Statut : **relevé R1 + pistes pour R2**, rien n'est décidé. Périmètre : §3 du plan (`docs/research/reverse-engineering-plan.md`), lignes E1 à E6 et F1 à F5. Cadre déjà acté (décision 0004) : MLBB est le squelette ; **objets choisis avant la partie comme les objets tenus de Unite, sans boutique en partie** ; LoL apporte la profondeur des stats ; parties courtes (6 à 10 min visées) ; 3v3 d'abord.

## Mode d'emploi

- **Chemins** : relatifs à `data/reference/`. Exemple : `mlbb/skills.json` = `data/reference/mlbb/skills.json`.
- **Confiance** : ✅ valeur structurée ou texte explicite d'une source ; ⚠️ source datée, heuristique, ancienne note de patch ou contradiction entre sources ; ❓ absent des fichiers locaux (le texte dit alors où la trouver).
- **Statistiques** : produites par `node tools/analysis/kit-summary.ts [section]`. Sections : `kit ranks cooldowns roles costs ratios cc shapes ultimate spells items power held emblems`. Le script lit seulement les JSON locaux et n'a aucune dépendance.
- **Versions** : LoL patch 16.20.1 ; MLBB wiki au 13/10/2026 ; Unite unite-db au 13/10/2026 (dernière entrée du journal : 1.24.1.3). Voir chaque `README.md`.
- **Pistes** : ce sont des propositions de conception, pas des relevés. Les seuls chiffres qu'elles contiennent sont des **paramètres à calibrer**, signalés comme tels.

## Synthèse (10 points)

1. **Kit** : LoL a 5 éléments (P, Q, W, E, R). MLBB en a 4 (passif, 2 compétences, ultime). Unite a un passif, 2 emplacements et un Unite Move ; chaque emplacement offre 2 options dans 81 % des cas.
2. **Points de compétence** : rangs 5/5/5/3 dans LoL (18 points = niveau max 18) ; 6/6/3 dans MLBB (15 points = niveau max 15). Unite n'a pas de points : les capacités arrivent aux niveaux 1 et 3, le choix se fait à 5 et 7, les améliorations « + » à 11 et 13 (cas le plus fréquent).
3. **Temps de recharge médians** (rang 1 → rang max) : compétences de base ≈ 8–14 s → 6–10 s dans LoL, 8–10 s → 6–8 s dans MLBB, 6–8 s dans Unite (fixe). Ultime : **LoL 120 → 80 s, MLBB 40 → 30 s**. Dans Unite, l'ultime dépend d'une jauge.
4. **Ratios médians** : LoL 0,6 × AP (Q/W/E) et 0,7 (R). MLBB 80–100 % de la stat. Unite ≈ 80–113 % Atk/SpAtk et 150 % Atk sur le Unite Move. La part fixe de Unite croît avec le niveau du Pokémon (`perLevel`), pas avec un rang.
5. **Contrôles** : 42–66 % des capacités LoL/MLBB en portent (ralentissements compris). Unite en porte moins : 21 % des capacités de base, 41 % des options.
6. **Sorts de combat** : LoL 180–300 s, MLBB 35–120 s (médiane 75), objets de combat Unite 22–80 s (médiane 47,5). Pour une partie courte, l'échelle de Unite ou de MLBB convient.
7. **Objets, poids en stats** : un objet tenu Unite au niveau 40 vaut ≈ 4–5 % de la stat d'un Pokémon niveau 15. Les 3 objets ensemble valent ≈ 11–14 %. Dans MLBB, 6 objets de tier 3 valent ≈ 73 % des PV et ≈ 150 % de l'attaque d'un héros niveau 15. **Dans Unite, la puissance vient surtout des niveaux, pas des objets.**
8. **Économie MLBB** : revenu passif « 5 or / 2 s → 6 or / 2 s » ⚠️ (version non datée). Bonus de voie : +20 % d'or (voie d'or) et +25 % d'EXP (voie d'EXP) pendant 5 min ✅. Rattrapage d'équipe ✅ (sans chiffres actuels).
9. **Courbe d'XP** : celle de LoL est complète ✅ (280 + 100 × (n − 2) par niveau). Celles de **MLBB et Unite sont absentes ❓** : c'est le plus gros manque de la famille F.
10. **Proposition centrale** (§ F3-bis) : 3 objets tenus choisis avant la partie. **L'or de la partie les fait monter automatiquement de palier** (1 → 2 → 3), sans menu. Le précédent est l'équipement de roaming de MLBB, qui débloque une compétence à 600 or et la renforce jusqu'à 1 500 or ✅.

---

## E1 — Structure du kit

| | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Personnages relevés | 173 ✅ `lol/abilities.json` | 134 ✅ `mlbb/skills.json` | 101 (+2 Serebii seul) ✅ `unite/moves.json` |
| Éléments | passif + Q, W, E + R (ultime) ✅ | passif + skill1, skill2 + ultime ; 20 capacités « autre » (formes, transformations) ✅ | passif + attaque boostée (1 coup sur 3) + emplacement 1 + emplacement 2 + Unite Move ✅ |
| Choix dans la partie | aucun (ordre des points seulement) | aucun (ordre des points seulement) | 1 choix parmi 2 options par emplacement (164 / 202 emplacements) ; 38 emplacements à chemin fixe ✅ |
| Ressource | mana pour 80 % des Q/W/E/R ; énergie 3 % ; PV 2 % ; aucune 14 % ✅ | mana, énergie ou rien (champ `resource` de `mlbb/heroes.json`) ✅ | **aucune** ✅ |

Sortie du script (`kit`) :

| Jeu | Personnages | Détail des emplacements |
| --- | --- | --- |
| LoL | 173 | P 173 · Q 173 · W 173 · E 173 · R 173 |
| MLBB | 134 | passif 137 · skill1 147 · skill2 149 · ultime 155 · autre 20 |
| Unite | 101 | capacités d'emplacement 568 (base 202, options 366) · Unite Moves 103 |

**Ce qu'il faut retenir**
- Les trois kits ont tous la forme « 2 ou 3 sorts courts + 1 sort fort + 1 passif ». Ils diffèrent par la manière d'**obtenir** et d'**améliorer** les sorts.
- Unite met la profondeur dans le **choix** (2 options) et non dans la répartition des points. C'est plus lisible et cela s'accorde avec des menus simplifiés.
- L'absence de ressource dans Unite simplifie la lecture (rien à gérer en dehors des temps de recharge).

**Piste pour Mythic Mayhem**
- Kit MLBB (passif + 2 compétences + ultime), car MLBB est le squelette. On y ajoute **l'évolution par choix de Unite** sur les 2 compétences : une option A ou B à un niveau fixe, puis une amélioration « + ».
- Pas de mana en v1. On garde les temps de recharge et éventuellement l'énergie pour quelques kits. C'est l'option la plus simple ; LoL et MLBB montrent que la ressource sert surtout à limiter le harcèlement en voie. **Arbitrage** : le mana ajoute une couche de gestion, mais il donne aussi un sens aux stats de régénération.
- Contre-jeu et indicateur visuel : chaque option du choix A/B est une nouvelle capacité. Elle doit donc préciser les deux, comme le demande `CLAUDE.md`.

**Manques** : les durées précises de l'attaque boostée Unite (fenêtre, reset) ❓. À relever en mode entraînement de Unite : vidéo à 60 i/s, compter les attaques entre deux effets boostés.

---

## E2 — Rangs, points de compétence, choix à niveaux fixes

| | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Rangs des sorts de base | 5 (169–170 / 173) ; 6 pour 3–4 champions ✅ `lol/abilities.json` | 6 (130–133 / ~148) ✅ (déduit de la longueur des listes par rang) | **aucun rang** : 1 version de base, puis une option, puis l'option « + » ✅ |
| Rangs de l'ultime | 3 (168 / 173) ✅ | 3 (137 / 155) ✅ | 1 ✅ |
| Points | 1 par niveau ✅ (`lol/mechanics/experience.md`) ; 5+5+5+3 = 18 = niveau max | 6+6+3 = 15 = niveau max (déduit) ⚠️ ; contraintes d'ordre ❓ | sans objet : apprentissage automatique ✅ |
| Ultime disponible à | niveau 6, puis 11 et 16 : **❓ absent des fichiers locaux** (page wiki « Champion ability » non extraite) | niveau 4 ⚠️ (indirect : « reach level 4 … have ultimates available for contesting turtle », `mlbb/mechanics/exp-laner.md`) | niveau 9 (81 %), 8 (17 %), 7 (2 %) ✅ `unite/pokemon.json` |
| Choix et « + » | — | — | emplacement 1 : choix au niv. 5, « + » au niv. 11 (51 / 101) ; emplacement 2 : choix au niv. 7, « + » au niv. 13 (50 / 101) ✅ |
| Évolution du personnage | — | — | 65 / 101 évoluent ; niveaux 5 (45 %), 7 (25 %), 4 (18 %) ✅ |

Sorties du script (`ranks`), extraits :

| Emplacement | rang max LoL (nombre) |
| --- | --- |
| Q | 5 (169), 6 (4) |
| W | 5 (170), 6 (3) |
| E | 5 (170), 6 (3) |
| R | 3 (168), 4 (3), 1 (1), 6 (1) |

| Emplacement | rangs MLBB (nombre) |
| --- | --- |
| skill1 | 6 (133), inconnu (7), 5 (4), 4 (3) |
| skill2 | 6 (130), inconnu (12), 5 (4), 4 (3) |
| ultimate | 3 (137), 4 (6), inconnu (5), 5 (5), 6 (2) |

| Unite `baseMoveLevels` | n | part |
| --- | --- | --- |
| [1,3] | 85 | 84 % |
| [1,2] | 14 | 14 % |
| [1,5] | 1 | 1 % |
| [1,4] | 1 | 1 % |

| Unite : emplacement | niveaux (les plus fréquents) | Pokémon |
| --- | --- | --- |
| 1 | choix 5 → + 11 | 51 |
| 1 | choix 7 → + 13 | 14 |
| 1 | choix 4 → + 10 | 12 |
| 1 | choix 4 → + 11 | 6 |
| 2 | choix 7 → + 13 | 50 |
| 2 | choix 5 → + 11 | 14 |
| 2 | choix 6 → + 12 | 13 |
| 2 | choix 6 → + 13 | 6 |

(Table complète : `node tools/analysis/kit-summary.ts ranks`. Il existe 14 combinaisons pour l'emplacement 1 et 13 pour l'emplacement 2.)

**Ce qu'il faut retenir**
- Dans les trois jeux, le **nombre total d'améliorations correspond au niveau maximum**. Dans Unite, la montée de niveau sert à débloquer et à choisir, non à répartir des points.
- La cadence de référence de Unite est : 2 capacités dès les niveaux 1 et 3, des choix à 5 et 7, l'ultime à 9, les « + » à 11 et 13. Cela fait un événement de kit tous les 2 niveaux environ, sur 15 niveaux.
- Les contraintes de MLBB sur l'ordre des points (niveau minimal pour chaque rang) **ne sont pas documentées localement**.

**Piste pour Mythic Mayhem** (2 variantes à trancher en R2)
- **A. Fidèle à MLBB** : points de compétence 6/6/3 avec ultime au niveau 4. Profondeur faible, mais un écran de plus à gérer pendant la partie (boutons « + »).
- **B. Hybride, recommandée** : pas de points. Les rangs montent automatiquement avec le niveau, à la manière de l'interpolation par niveau de Unite (`perLevel`). Le kit reprend la structure de MLBB (2 compétences + ultime) et les **choix de Unite** sur les 2 compétences. Calendrier de départ à calibrer : compétence 1 au niv. 1, compétence 2 au niv. 2, ultime au niv. 4 (MLBB), choix A/B à 5 et 7, « + » à 11 et 13 (Unite). Avantages : zéro micro-gestion, 4 décisions lisibles par partie, et le validateur de packs n'a qu'une valeur par niveau à contrôler.
- **Arbitrage** : B retire une compétence de joueur (l'ordre des points) mais ajoute un choix de build en partie. C'est utile puisque la boutique disparaît.

**Manques**
- LoL, niveaux de l'ultime 6/11/16 et contraintes de rang ❓ : ajouter la page wiki « Champion ability » (ou « Skill point ») à `tools/extract/lol/mechanics.ts`.
- MLBB, contraintes d'ordre ❓. Protocole : partie personnalisée seul contre l'IA, noter à chaque niveau (1 à 15) les boutons « + » actifs et la date de première disponibilité de l'ultime, sur 3 héros (dont un à ultime de rang 4 ou plus).

---

## E3 — Valeurs : temps de recharge, coûts, ratios, contrôles

### Temps de recharge par emplacement (s)

| | n | min | p25 | médiane | p75 | max |
| --- | --- | --- | --- | --- | --- | --- |
| LoL Q rang 1 | 173 | 0 | 6 | 8 | 10 | 20 |
| LoL Q rang max | 173 | 0 | 4 | 6 | 8 | 18 |
| LoL W rang 1 | 173 | 0 | 10 | 14 | 18 | 80 |
| LoL W rang max | 173 | 0 | 7 | 10 | 14 | 40 |
| LoL E rang 1 | 173 | 0 | 10 | 12 | 16 | 26 |
| LoL E rang max | 173 | 0 | 7 | 10 | 12 | 20 |
| LoL R rang 1 | 173 | 0 | 100 | 120 | 130 | 200 |
| LoL R rang max | 173 | 0 | 70 | 80 | 100 | 160 |
| MLBB skill1 rang 1 | 147 | 0.3 | 5.5 | 8 | 10 | 30 |
| MLBB skill1 rang max | 147 | 0.3 | 4.5 | 6 | 8 | 30 |
| MLBB skill2 rang 1 | 149 | 0 | 7.5 | 10 | 12 | 30 |
| MLBB skill2 rang max | 149 | 0 | 6 | 8 | 10 | 30 |
| MLBB ultimate rang 1 | 152 | 0 | 29.5 | 40 | 50 | 90 |
| MLBB ultimate rang max | 152 | 0 | 20.75 | 30 | 42 | 70 |
| Unite empl. 1 base | 101 | 4 | 5 | 6 | 7 | 9 |
| Unite empl. 1 options | 182 | 3 | 5.5 | 6.5 | 7.5 | 12 |
| Unite empl. 2 base | 101 | 3.5 | 6 | 8 | 8 | 11 |
| Unite empl. 2 options | 184 | 2 | 7 | 7.75 | 9 | 14 |
| Unite options après « + » (réduction du CD, si présente) | 40 | 0.5 | 1 | 1 | 1 | 4 |

Sources ✅ : `lol/abilities.json` (`cooldown`, Data Dragon), `mlbb/skills.json` (`cooldown.values`), `unite/moves.json` (`cooldownS`). Un temps de recharge de 0 correspond à un sort à charges ou sans recharge. La dernière ligne Unite est ⚠️ : `upgradedCooldownS` est apparemment une **réduction** et non une valeur absolue. Exemple : Aegislash Wide Guard, CD 8 s, `upgradedCooldownS` 1, texte « Cooldown reduced by 1s ». Médiane −1 s.

### Par rôle (médianes, s)

| LoL (1er tag) | champions | Q/W/E rang 1 | Q/W/E rang max | R rang 1 | R rang max |
| --- | --- | --- | --- | --- | --- |
| Assassin | 17 | 9 | 7 | 100 | 70 |
| Fighter | 50 | 12 | 8 | 120 | 80 |
| Mage | 35 | 10 | 7 | 120 | 80 |
| Marksman | 29 | 12 | 9 | 100 | 80 |
| Support | 18 | 11.5 | 10 | 130 | 100 |
| Tank | 24 | 11.5 | 8 | 120 | 90 |

| MLBB (1er rôle) | héros | S1/S2 rang 1 | S1/S2 rang max | Ultime rang 1 | Ultime rang max |
| --- | --- | --- | --- | --- | --- |
| Assassin | 20 | 9.5 | 6.75 | 28 | 23 |
| Fighter | 37 | 8 | 6.5 | 34 | 26.5 |
| Mage | 26 | 8 | 7 | 43 | 33 |
| Marksman | 20 | 8.5 | 7 | 38 | 30 |
| Support | 13 | 10.75 | 8.75 | 60 | 47.5 |
| Tank | 18 | 10 | 8 | 50 | 40 |

| Unite (rôle) | Pokémon | CD base | CD options | `cd` du Unite Move | jauge (gaugeEnergy) |
| --- | --- | --- | --- | --- | --- |
| All-Rounder | 36 | 6 | 7 | 112 | 100000 |
| Attacker | 28 | 7 | 7.5 | 112 | 100000 |
| Defender | 13 | 6.5 | 7.5 | 100 | 90000 |
| Speedster | 12 | 6.5 | 6.25 | 100 | 90000 |
| Supporter | 12 | 7 | 7.25 | 100 | 90000 |

### Coûts (mana)

| | n | min | p25 | médiane | p75 | max |
| --- | --- | --- | --- | --- | --- | --- |
| LoL Q mana rang 1 → max | 139 | 15 | 40 | 50 → 60 | 60 → 80 | 100 → 120 |
| LoL W mana rang 1 → max | 131 | — | 40 → 50 | 50 → 65 | 60 → 80 | 90 → 130 |
| LoL E mana rang 1 → max | 132 | — | 40 → 50 | 50 → 70 | 70 → 80 | 90 → 120 |
| LoL R mana rang 1 → max | 138 | — | 100 | 100 | 100 | 125 → 200 |
| MLBB skill1 rang 1 → max | 87 | 25 | 50 → 75 | 60 → 90 | 70 → 115 | 135 → 210 |
| MLBB skill2 rang 1 → max | 87 | — | 52.5 → 77.5 | 70 → 100 | 80 → 120 | 120 → 170 |
| MLBB ultime rang 1 → max | 88 | — | 100 → 140 | 120 → 170 | 150 → 200 | 200 → 450 |

(Table brute du script : `node tools/analysis/kit-summary.ts costs`. Ici les lignes rang 1 et rang max sont fusionnées.) ✅. Unite : pas de coût.

### Ratios et dégâts de base

| LoL, ratio au dernier rang | n | min | p25 | médiane | p75 | max |
| --- | --- | --- | --- | --- | --- | --- |
| Q · total AP | 108 | 0 | 0.42 | 0.6 | 0.8 | 1.2 |
| Q · bonus AD | 49 | 0 | 0.6 | 0.85 | 1 | 2.3 |
| W · total AP | 99 | 0 | 0.4 | 0.6 | 0.8 | 1.5 |
| W · bonus AD | 28 | 0 | 0.19 | 0.65 | 1 | 2 |
| E · total AP | 108 | 0 | 0.45 | 0.6 | 0.8 | 2.4 |
| E · bonus AD | 38 | 0 | 0.41 | 0.6 | 1 | 2.4 |
| R · total AP | 106 | 0 | 0.5 | 0.7 | 1 | 3 |
| R · bonus AD | 52 | 0.05 | 0.7 | 1 | 1.31 | 3 |

| MLBB, ratio max (% de la stat) | n | min | p25 | médiane | p75 | max |
| --- | --- | --- | --- | --- | --- | --- |
| skill1 · Total Magic Power | 59 | 10 | 60 | 90 | 122.5 | 220 |
| skill1 · Total Physical Attack | 59 | 25 | 50 | 80 | 100 | 200 |
| skill2 · Total Magic Power | 60 | 16 | 50 | 80 | 121.25 | 200 |
| skill2 · Total Physical Attack | 50 | 13 | 50 | 60 | 100 | 240 |
| ultimate · Total Magic Power | 55 | 5 | 45 | 100 | 157.5 | 750 |
| ultimate · Total Physical Attack | 50 | 10 | 66.25 | 95 | 127.5 | 300 |
| ultimate · Extra Physical Attack | 23 | 10 | 85 | 130 | 200 | 1105 |

| MLBB, dégâts de base (1re formule) | n | min | p25 | médiane | p75 | max |
| --- | --- | --- | --- | --- | --- | --- |
| skill1 rang 1 → max | 134 | 10 → 20 | 150 → 225 | 210 → 350 | 295 → 491 | 600 → 1000 |
| skill2 rang 1 → max | 129 | 20 | 125 → 200 | 200 → 315 | 250 → 410 | 1500 → 3000 |
| ultimate rang 1 → max | 124 | 15 | 136 → 200 | 270 → 400 | 400 → 660 | 1560 → 3500 |

| Unite (`floor(ratio × stat) + perLevel × (niv − 1) + base`) | n | min | p25 | médiane | p75 | max |
| --- | --- | --- | --- | --- | --- | --- |
| base · ratio % Atk | 94 | 25 | 78.25 | 101 | 140 | 221 |
| options · ratio % Atk | 185 | 15 | 68 | 113 | 166 | 345 |
| Unite Move · ratio % Atk | 55 | 20 | 99.5 | 150 | 208 | 396 |
| options · part fixe niv. 15, Atk | 185 | 0 | 172 | 299 | 480 | 1268 |
| Unite Move · part fixe niv. 15, Atk | 55 | 0 | 245 | 434 | 657 | 1358 |
| base · ratio % SpAtk | 86 | 16 | 48.5 | 80 | 100 | 200 |
| options · ratio % SpAtk | 156 | 0 | 54 | 80 | 120 | 266 |
| Unite Move · ratio % SpAtk | 44 | 19 | 64.5 | 97.5 | 165 | 486 |
| options · part fixe niv. 15, SpAtk | 156 | 0 | 264 | 405 | 570 | 1232 |
| Unite Move · part fixe niv. 15, SpAtk | 44 | 81 | 297.5 | 504 | 759.5 | 2130 |

Sources : `lol/abilities.json` `ratios` ✅ (bins CommunityDragon ; LoL note les ratios en fraction, MLBB et Unite en %) ; `mlbb/skills.json` `scalings` ✅ ; `unite/moves.json` `damage[]` ✅. La formule Unite vient du code de unite-db (`unite/mechanics/unitedb-damage-formula.md`, ⚠️ communautaire).

### Contrôles (heuristiques)

| Groupe | n | avec CC (ralentissement inclus) | CC dur (hors ralentissement) |
| --- | --- | --- | --- |
| LoL Q | 173 | 46 % | 27 % |
| LoL W | 173 | 42 % | 23 % |
| LoL E | 173 | 59 % | 36 % |
| LoL R | 173 | 57 % | 42 % |
| MLBB skill1 | 147 | 61 % | 29 % |
| MLBB skill2 | 149 | 64 % | 39 % |
| MLBB ultimate | 155 | 66 % | 50 % |
| Unite empl. base | 202 | 21 % | 10 % |
| Unite options | 366 | 41 % | 28 % |
| Unite Move | 103 | 45 % | 36 % |

| Jeu | types les plus fréquents (occurrences) |
| --- | --- |
| LoL | slow 225, stun 85, airborne 80, root 54, fear 17, suppression 7, taunt 7, silence 6 |
| MLBB | slow 178, stun 71, airborne 43, knockback 42, pull 42, immobilize 40, suppress 33, freeze 11 |

⚠️ Les trois relevés reposent sur des mots-clés (champ `crowdControl` de LoL, `ccTypes` de MLBB, regex du script pour Unite), donc avec des faux positifs possibles.

**Ce qu'il faut retenir**
- **Ultimes : MLBB est 3 fois plus rapide que LoL** (40 → 30 s contre 120 → 80 s). Pour une partie de 6 à 10 minutes, l'échelle de MLBB donne environ 10 à 15 ultimes par joueur, contre 4 à 6 avec LoL (simple calcul : durée ÷ temps de recharge).
- Les compétences de base sont **du même ordre dans les 3 jeux** (6 à 10 s).
- Ratios : LoL autour de 0,6 × la stat, MLBB et Unite autour de 80–100 %. La différence vient de l'échelle des stats, pas de la conception.
- Unite fait monter les dégâts **avec le niveau du personnage** (`perLevel`) et non avec un rang de sort. C'est exactement ce qu'il faut pour la variante B de l'E2.
- Les supports et les tanks ont les ultimes les plus longs dans LoL et MLBB. Dans Unite, la jauge est un peu plus basse (90 000) pour Defender, Speedster et Supporter que pour Attacker et All-Rounder (100 000).

**Piste pour Mythic Mayhem**
- **Gabarits par rôle pour le validateur de packs** : les fourchettes p25–p75 de MLBB servent de plage autorisée par défaut, par exemple compétences 5,5–12 s au rang 1, ultime 29,5–50 s au rang 1. On les complète par les médianes par rôle ci-dessus.
- **Format de dégâts** : celui de Unite, `base + perLevel × (niveau − 1) + ratio × stat`, sans rang. Il donne une seule formule par capacité, facile à valider et à afficher. Les ordres de grandeur se calent sur MLBB (stats de même échelle que les héros).
- **Contrôles** : budgéter la part de capacités à CC dur. Repère : environ 30 % des compétences et 40–50 % des ultimes chez LoL et MLBB. Chaque CC dur précise sa durée, son contre-jeu et son télégraphe (règle du brief).

**Manques**
- Les types de dégâts et les durées de CC de LoL ne sont pas normalisés (lire `description`). Les portées de MLBB sont absentes (voir E4).
- `upgradedCooldownS` de Unite lu comme une réduction ⚠️ : à confirmer sur 5 cas dans unite-db.

---

## E4 — Incantation, projectiles, formes

| | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Temps d'incantation | médiane 0,25 s pour Q, W, E et R ; p75 0,4 s pour R ✅ `lol/abilities.json` (`castTime`, bins) | ❓ | ❓ |
| Vitesse des projectiles | médiane 1 200–1 500 u/s (p25 ≈ 800, p75 ≈ 1 750) ✅ | ❓ | ❓ |
| Largeur des projectiles en ligne | médiane 70–80 u (Q/W/E), 120 u (R) ✅ | ❓ | ❓ |
| Rayon des zones | médiane 210–300 u ✅ | ❓ (1 seule capacité sur 608 a `castRange`) | ❓ |
| Typologie | `spellTags` du bin (non normalisés) | étiquettes du wiki (`skillEffects` : Burst, AoE, CC…) ✅ | catégorie unite-db ✅ : Dash 23 %, Area 18 %, Ranged 18 %, Buff 10 %, Melee 10 %, Hindrance 9 %, Sure Hit 7 %, Recovery 3 %, Debuff 2 % |
| Unités de distance | unités LoL (portée de base ≈ 125–650) | « unités » MLBB (ex. portée de tour 5,3) ✅ `mlbb/README.md` | interne (vitesse de déplacement 3 650 au niv. 1) ✅ |

| LoL (filtré : castTime ≥ 0, missile ≤ 10 000 u/s, rayon ≤ 5 000 u) | n | min | p25 | médiane | p75 | max |
| --- | --- | --- | --- | --- | --- | --- |
| Q castTime (s) | 161 | 0 | 0.25 | 0.25 | 0.25 | 0.75 |
| Q missileSpeed (u/s) | 140 | 20 | 1200 | 1500 | 1800 | 8700 |
| Q lineWidth (u) | 103 | 1 | 60 | 70 | 80 | 500 |
| Q castRadius (u) | 124 | 20 | 175 | 210 | 299.3 | 1500 |
| W castTime (s) | 153 | 0 | 0.25 | 0.25 | 0.25 | 0.75 |
| W missileSpeed (u/s) | 110 | 7 | 828.5 | 1450 | 1700 | 10000 |
| W lineWidth (u) | 59 | 15 | 60 | 80 | 120 | 250 |
| W castRadius (u) | 132 | 20 | 125 | 215 | 350 | 2200 |
| E castTime (s) | 148 | 0 | 0.25 | 0.25 | 0.25 | 1.5 |
| E missileSpeed (u/s) | 120 | 20 | 812.5 | 1400 | 1750 | 5000 |
| E lineWidth (u) | 81 | 15 | 60 | 80 | 120 | 200 |
| E castRadius (u) | 128 | 1 | 175 | 210 | 350 | 3000 |
| R castTime (s) | 158 | 0 | 0.25 | 0.25 | 0.4 | 1.38 |
| R missileSpeed (u/s) | 125 | 20 | 779.9 | 1200 | 1700 | 8700 |
| R lineWidth (u) | 69 | 15 | 80 | 120 | 160 | 450 |
| R castRadius (u) | 139 | 1 | 210 | 300 | 500 | 1500 |

**Ce qu'il faut retenir**
- Seul LoL publie la géométrie. Le temps d'incantation standard est **0,25 s**. Un projectile parcourt environ 1 400 u/s, soit environ 0,7 s pour traverser 1 000 u.
- La catégorie de Unite (Dash, Area, Ranged, Sure Hit…) est une **taxonomie simple et prête à l'emploi** pour le format des packs. « Sure Hit » (ciblé, ne rate pas) dit aussi au joueur qu'aucune esquive n'est possible.

**Piste pour Mythic Mayhem**
- Reprendre les valeurs de LoL **converties dans l'échelle de notre carte**. Le facteur se déduit des portées : portée de LoL ÷ portée équivalente de MLBB, une fois B1 relevé.
- Reprendre la catégorie de Unite comme champ obligatoire du pack (`category`). Elle détermine l'indicateur visuel par défaut : flèche pour Ranged, cercle pour Area, trajectoire pour Dash, marqueur de cible pour Sure Hit.

**Manques** — protocole de mesure (MLBB et Unite, mode entraînement)
1. Capturer en 60 i/s une vue de caméra fixe. Étalonner les distances avec la portée d'une tour MLBB (5,3 unités, `mlbb/mechanics/turret.md`) ou avec une ligne connue de la carte.
2. Incantation : compter les images entre l'appui (indicateur relâché) et l'apparition de l'effet ; 5 essais par capacité.
3. Vitesse de projectile : distance parcourue ÷ nombre d'images × 60.
4. Rayon : diamètre de l'indicateur au sol, mesuré par rapport à l'étalon.
5. Faire 10 capacités par jeu, 2 par catégorie, et noter la méthode et la confiance dans `docs/research/evidence-log.md`.

---

## E5 — Disponibilité de l'ultime

| | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Déblocage | niveau 6 ❓ (voir E2) | niveau 4 ⚠️ | niveau 7–9 (9 pour 81 %) ✅ |
| Rangs | 3 ✅ | 3 ✅ | 1 ✅ |
| Recharge | temps : 120 → 80 s (médiane) ✅ | temps : 40 → 30 s (médiane) ✅ | **jauge** (`gaugeEnergy` 75 000–120 000, médiane 100 000) ✅ ; vitesse de remplissage ❓ |
| Effets annexes | — | — | buff à l'activation (ex. vitesse 80 % et bouclier 20 % des PV max pendant 6 s pour Absol) ✅ `unite/moves.json` |

| | n | min | p25 | médiane | p75 | max |
| --- | --- | --- | --- | --- | --- | --- |
| LoL R CD rang 1 (s) | 173 | 0 | 100 | 120 | 130 | 200 |
| LoL R CD rang 3 (s) | 173 | 0 | 70 | 80 | 100 | 160 |
| MLBB ultime CD rang 1 (s) | 152 | 0 | 29.5 | 40 | 50 | 90 |
| MLBB ultime CD rang max (s) | 152 | 0 | 20.75 | 30 | 42 | 70 |
| Unite gaugeEnergy (unités internes) | 97 | 75000 | 90000 | 100000 | 100000 | 120000 |
| Unite `cd` du Unite Move (s, sens non défini) | 102 | 4.7 | 100 | 112 | 112 | 134 |

| gaugeEnergy | n | part |
| --- | --- | --- |
| 100000 | 45 | 45 % |
| 90000 | 29 | 29 % |
| 80000 | 12 | 12 % |
| 110000 | 6 | 6 % |
| inconnu | 4 | 4 % |
| 120000 | 4 | 4 % |
| 75000 | 1 | 1 % |

Indices de fonctionnement de la jauge Unite ⚠️ (`unite/mechanics/serebii-patch-notes.md`) : des notes de patch disent « Unite Move charge rate increased by 20–25 % » et « Unite Gauge Requirements reduced by 10–15 % ». Une attaque boostée réduit le temps de charge (« 15 % → 10 % », Reshiram). L'objet tenu Energy Amplifier accorde un bonus de « Energy Rate » de 7 % au niveau 40 ✅. **La jauge se charge donc avec le temps et avec certaines actions, selon des règles non publiées.**

**Ce qu'il faut retenir**
- Le champ `cd` de unite-db (médiane 112 s) a le même ordre de grandeur qu'un ultime de LoL. Si c'est le temps de charge à vide, la jauge de Unite est **2 à 3 fois plus lente que l'ultime de MLBB**. C'est ⚠️ tant que ce sens n'est pas vérifié.
- La jauge récompense l'activité : elle accélère avec les attaques boostées et les objets. Le temps de recharge simple est plus lisible.

**Piste pour Mythic Mayhem**
- **Temps de recharge à la manière de MLBB** (squelette ; plus lisible ; fourchette médiane de 30 à 40 s), ultime débloqué au niveau 4.
- Option de variété : une « jauge » réservée à certains kits (type Unite), déclarée dans le pack comme `ultimate.charge = "time" | "gauge"`, avec le même budget.

**Manques** : la vitesse de charge de la jauge Unite ❓. Protocole : mode entraînement, ne rien faire et chronométrer la jauge de 0 à 100 % sur 3 Pokémon de `gaugeEnergy` différents (80 000, 100 000, 120 000). Recommencer en n'utilisant que des attaques de base, puis seulement des attaques boostées. On obtient le taux passif et la part due aux actions.

---

## E6 — Sorts de combat et objets de combat

| LoL (Classic) | CD (s) | niveau de compte |
| --- | --- | --- |
| Cleanse | 240 | 9 |
| Exhaust | 240 | 4 |
| Flash | 300 | 7 |
| Ghost | 240 | 1 |
| Heal | 240 | 1 |
| Smite | 15 | 3 |
| Teleport | 300 | 7 |
| Ignite | 180 | 9 |
| Barrier | 180 | 4 |

| MLBB (actuels) | CD (s) | niveau de compte |
| --- | --- | --- |
| Recall | 0 (5 s de canalisation) | 0 |
| Healing | 0 (« TBA » sur le wiki) | 0 |
| Execute | 90 | 1 |
| Retribution | 35 | 3 |
| Inspire | 75 | 5 |
| Sprint | 100 | 7 |
| Revitalize | 100 | 9 |
| Aegis | 75 | 11 |
| Petrify | 75 | 13 |
| Purify | 90 | 15 |
| Flameshot | 50 | 17 |
| Flicker | 120 | 19 |
| Arrival | 75 | 21 |
| Vengeance | 75 | 23 |

| Unite (standard) | CD (s) | niveau de dresseur |
| --- | --- | --- |
| Eject Button | 80 | 11 |
| Fluffy Tail | 22 | 10 |
| Full Heal | 60 (Serebii : 55) ⚠️ | 14 |
| Goal Getter | 60 | 17 (Serebii : 16) ⚠️ |
| Goal Hacker | 80 | — |
| Potion | 30 | 3 (Serebii : 4) ⚠️ |
| Slow Smoke | 35 | 13 |
| X Attack | 40 | 7 |
| X Speed | 50 | 8 |
| Shedinja Doll | 45 | — |

| | n | min | p25 | médiane | p75 | max |
| --- | --- | --- | --- | --- | --- | --- |
| LoL CD (hors Smite) | 8 | 180 | 225 | 240 | 255 | 300 |
| MLBB CD (hors Recall/Healing) | 12 | 35 | 75 | 75 | 92.5 | 120 |
| Unite CD | 10 | 22 | 36.25 | 47.5 | 60 | 80 |

Sources ✅ : `lol/summoner-spells.json` (2 sorts par joueur), `mlbb/battle-spells.json` (1 sort), `unite/battle-items.json` (1 objet de combat). Effets par niveau ✅, par exemple Execute 110–250 de dégâts de base, Aegis un bouclier de 800–1 500, Heal 80–318 (formule `{{pp}}` du wiki).

**Ce qu'il faut retenir**
- On équipe **2 sorts dans LoL** et **1 dans MLBB et dans Unite**. Les rôles se recoupent : fuite (Flash, Flicker, Eject Button), soin (Heal, Revitalize, Potion), purge (Cleanse, Purify, Full Heal), vitesse (Ghost, Sprint, X Speed), jungle (Smite, Retribution).
- Un temps de recharge de 75 s (MLBB) ou de 47,5 s (Unite) permet **4 à 12 utilisations dans une partie de 6 à 10 minutes**. Les 240 s de LoL n'en permettent que 2 ou 3.
- Les sorts liés à l'objectif (Goal Getter, Goal Hacker) n'ont de sens qu'avec un mode à score.

**Piste pour Mythic Mayhem**
- **Un seul emplacement actif**, qui fusionne les sorts de combat de MLBB et les objets de combat de Unite. Liste de départ de 6 à 8 sorts pris dans les recoupements ci-dessus. Temps de recharge sur l'échelle de Unite et de MLBB (≈ 30–90 s).
- Le **retour à la base** est une action de base hors emplacement, comme dans MLBB (canalisation de 5 s ✅, interrompue par un déplacement ou des dégâts).
- Le **sort de jungle** (Retribution, Smite) est lié au rôle de jungleur dans MLBB (bottes de jungle). Il est à revoir avec la famille G.

**Manques** : Healing de MLBB (« TBA ») ❓. Pour relever les valeurs : regarder le jeu, ou télécharger la page wiki du sort quand elle sera remplie.

---

## F1 — Expérience : courbe, niveau maximum, partage

| | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Niveau max | 18 ✅ `lol/mechanics/experience.md` | 15 ✅ (stats niveaux 1 et 15, `mlbb/heroes.json`) | 15 ✅ (`unite/pokemon.json`, 15 niveaux de stats) |
| Niveau de départ | 1 (Faille) ; 3 (ARAM) ✅ | 1 ✅ ; 4 dans Brawl et Mayhem ✅ `mlbb/mechanics/brawl.md` | 1 ✅ `unite/mechanics/serebii-mechanics.md` |
| EXP par niveau | 280 + 100 × (n − 2), soit 280, 380, … 1 880 ; cumul 13 020 au niveau 15 et 18 360 au niveau 18 ✅ | ❓ (absente du wiki, `mlbb/README.md`) | ❓ (absente des 3 sources, `unite/README.md`) |
| Sources d'EXP | sbires (1 500 u), champions (1 600 u), monstres (au tueur), épiques (locaux ou globaux) ✅ | sbires, creeps, héros, tours (EXP d'équipe 150) ⚠️, Tortue (EXP d'équipe 163) ⚠️ `mlbb/mechanics/battlefield-guide.md` | Pokémon sauvages : EXP de base par camp (ex. 60–250 pour les petits, 320 pour Regieleki, 720 pour Rayquaza) ✅ `unite/mechanics/serebii-stage-theiaskyruins.md` ; KO de joueurs ❓ |
| EXP passive | aucune hors modes (Howling Abyss Aura) ✅ | ❓ | ⚠️ : une note de patch 1.5.1.3 corrige un bug qui empêchait « experience getting added every second » ; Exp. Share donne 3 → 4 → 5 EXP/s au joueur le plus en retard ✅ `unite/held-items.json` (Serebii : 2 EXP/s ⚠️) |
| Partage | sbires : 100 / 65 / 43,3 / 32,5 / 26 % chacun pour 1 à 5 champions (total ≈ 130 %) ✅ ; kill de champion : 42–990 en solo, 27,97–891 partagés ✅ | « Reduced each one's share when gold and Exp from minions are shared » ⚠️ (sans chiffres) | ❓ ; le mode First to 500 montre des variantes « Shared Growth +50 % » et « Solo +60 % » ✅ `unite/mechanics/serebii-first-to-500.md` |
| Rattrapage | ±20 % par niveau d'écart au-delà du premier (kill de champion), plancher 40 % ; sbires +20 % à +240 % ✅ | voie d'EXP : +25 % d'EXP des sbires pendant les 5 premières minutes ✅ `mlbb/mechanics/exp-laner.md` ; « increased the EXP gained by killing high-level heroes » ⚠️ | Exp. Share (objet) ✅ ; reste ❓ |

**Ce qu'il faut retenir**
- La courbe de LoL est **linéaire et bien documentée**. Si on la tronque au niveau 15, il faut 13 020 EXP. Elle peut servir de forme de départ, à remettre à l'échelle de la durée de nos parties.
- MLBB et Unite atteignent le niveau 15 en environ 10 à 15 minutes (durée de partie). Leur table d'EXP n'est publiée nulle part.
- Le partage « total ≈ 130 % » de LoL **pousse à jouer en groupe sans pénaliser le jeu seul**. C'est une bonne règle pour du 3v3.

**Piste pour Mythic Mayhem**
- Niveau max **15** (MLBB et Unite), niveau de départ 1.
- Courbe : reprendre la **forme** de LoL, `xp(n) = a + b × (n − 2)`. On ajuste a et b par simulation pour atteindre le niveau 15 vers 80 % de la durée cible. Ce sont des paramètres à calibrer, pas des valeurs relevées.
- Partage des sbires de LoL (100 / 65 / 43 %) et rattrapage de LoL (±20 % par niveau d'écart). Ces règles sont les mieux documentées et elles se testent facilement en simulation.
- **EXP passive** faible pour tous, comme dans Unite. Elle évite qu'un joueur mort plusieurs fois soit bloqué.

**Manques** — protocole pour la courbe d'EXP de MLBB et de Unite
1. Partie personnalisée ou entraînement, contre des IA passives, dans une seule voie.
2. Enregistrer en vidéo ; noter l'horodatage de chaque montée de niveau et le nombre de sbires (MLBB) ou de Pokémon sauvages (Unite) tués entre deux niveaux.
3. Unite : chaque camp donne une EXP de base connue (Serebii). On en déduit l'EXP par niveau en additionnant les EXP des kills. Retirer la part passive en mesurant aussi le temps passé immobile.
4. MLBB : sans valeur d'EXP connue par sbire, mesurer d'abord « sbires par niveau », puis demander la valeur sur la page wiki « Minions » ou dans les sources chinoises (wiki CN).

---

## F2 — Or : revenus

| | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Or de départ | 500 (Faille), 1 400 (ARAM) ✅ `lol/mechanics/gold.md` | ❓ (Classic) ; 2 500 dans Brawl, 900 dans Mayhem ✅ | **pas d'or en partie** : la monnaie de partie est l'énergie Aeos (points à marquer) ✅ `unite/mechanics/serebii-mechanics.md` |
| Revenu passif | 20,4 / 10 s à partir de 1:05 ✅ | « 2 gold every 1s → 5 gold every 2s », puis « 5 every 2s → 6 every 2s » ⚠️ (notes de patch sans version, `battlefield-guide.md`) | — |
| Sbires | vague ≈ 115–148 or ; mêlée 20, distance 14, siège 50–69 selon le temps de jeu ✅ `lol/mechanics/minion.md` | ~50–70 par creep ⚠️ `mlbb/mechanics/gold.md` ; voie d'or : +20 % d'or des sbires pendant 5 min ✅ `gold-laner.md` | — |
| Kill de héros | ❓ (page « Champion gold bounties » non extraite) ; plus d'or généré en cas d'assistance ✅ | « 50–400 » selon les séries ⚠️ ; ancienne note de patch : bonus de série 80 → 60, plafond 400 → 300 ⚠️ ; au moins 50 or pour un héros tué plusieurs fois de suite ⚠️ | Aeos lâchée par le Pokémon KO ✅ (quantité ❓) |
| Objectifs | tours : or global et local ; plaques ✅ | Tortue : 60 or à l'équipe, +20 par apparition ⚠️ ; tours (team gold) : extérieure 60–100, intérieure 80–120, base 100–160 selon les patchs ⚠️ ; bouclier de tour : 0,8 or par 10 dégâts ⚠️ | points de camp, ex. Regieleki 20, Rayquaza 30 ✅ |
| Rattrapage | primes de reprise (« shut down », page non extraite) ❓ | l'équipe en retard d'or reçoit un bonus en tuant un héros riche (+33 %, puis +50 % sous un retard de 2 000) ⚠️ ; le joueur le plus pauvre reçoit le passif du roamer ✅ `gold.md` | — |
| Économie de rôle | objets de jungle et de support à quêtes ✅ | jungle : −70 % sur les sbires pendant 5 min, +30 or par kill ou assistance ✅ `mlbb/battle-spells.json` ; roaming : partage, puis débloque une compétence à 600 or, renforcée jusqu'à 1 500 or ⚠️ | Amulet Coin : +60 → 100 % d'énergie Aeos sur les sauvages ✅ |

**Ce qu'il faut retenir**
- L'or de MLBB **se répartit selon les voies** : bonus d'or en voie d'or, bonus d'EXP en voie d'EXP, bonus de siège selon le côté de la Tortue (ancien). Il comporte un **rattrapage d'équipe**. Ce sont deux leviers de conception qui ne dépendent pas de la boutique.
- Unite **n'a pas d'or en partie**. Sa ressource de partie est le **score** (énergie Aeos), qui sert à marquer et à rien d'autre.
- Les chiffres actuels de MLBB sont **peu fiables** : le wiki est en ébauche et les notes de patch ne sont pas datées.

**Piste pour Mythic Mayhem** : voir § F3-bis. L'or est conservé comme **jauge de progression des objets tenus**. Les règles de répartition de MLBB (bonus de voie, rattrapage) restent en place.

**Manques**
- Prime de kill de LoL ❓ : ajouter « Champion gold bounties » et « Objective bounties » à `tools/extract/lol/mechanics.ts`.
- Revenu passif actuel de MLBB ❓. Protocole : partie personnalisée, rester à la fontaine de 0:00 à 3:00, filmer le compteur d'or et calculer la pente sur 60 s.
- Or par creep, par kill et par série dans MLBB ❓. Protocole : contre l'IA, noter l'or affiché (texte flottant « +X ») sur 20 kills de chaque type, à 2, 6 et 10 minutes.

---

## F3 — Objets : boutique de MLBB et LoL, objets tenus de Unite

### Comparatif

| | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Quand on choisit | en partie, à la fontaine ✅ | en partie, **n'importe où** (bouton en haut à droite) ✅ `mlbb/mechanics/equipment.md` | **avant la partie** ✅ `unite/held-items.json` (notes) |
| Emplacements | 6 (7e pour les bottes via la quête de voie) ✅ `lol/items.json` (texte des quêtes) | 6 ✅ | **3 objets tenus** + 1 objet de combat ✅ |
| Nombre d'objets | 245 achetables sur la Faille (hors consommables) dont 138 finaux ✅ | 96 actuels avec un prix (113 dans le module, dont 8 retirés) ✅ | 41 objets tenus, dont 34 avec stats ✅ |
| Prix et progression | médiane finale 2 800 or (400–3 500) ✅ | tier 3 : médiane 2 060 or (1 820–3 010) ✅ | niveaux 1–40 via des Item Enhancers hors partie : 2 587 améliorateurs jusqu'au niveau 30 ✅ ; 31–40 ❓ |
| Passifs | uniques, texte sans formule par niveau ✅ | « Unique » (non cumulable) ✅ | **3 paliers : niveaux 1, 10 et 20** ✅ |
| Revente | 70 % (40 % pour certains objets) ✅ | 100 % pendant 15 s, puis 60 % (20 % pour les bottes) ✅ | — |
| Plafonds associés | Ability Haste plafonnée à 500 (83,3 % de réduction) ✅ `lol/mechanics/haste.md` | réduction de CD plafonnée à 40 % (45 % avec un objet), vitesse d'attaque à 3,00 ✅ | ❓ |

Sorties du script (`items`) :

| LoL (Faille, achetables, hors consommables) | n | prix médian | min | max |
| --- | --- | --- | --- | --- |
| tous | 245 | 2400 | 0 | 3500 |
| de base (sans recette) | 54 | 450 | 0 | 2500 |
| composants (ont un « into ») | 73 | 900 | 150 | 2250 |
| finaux (recette, sans « into ») | 138 | 2800 | 400 | 3500 |

| MLBB (actuels) | n | prix médian | min | max |
| --- | --- | --- | --- | --- |
| tier 1 | 23 | 280 | 0 | 1500 |
| tier 2 | 30 | 725 | 500 | 2050 |
| tier 3 | 43 | 2060 | 1820 | 3010 |

Catégories MLBB : Attack 30, Defense 25, Magic 25, Movement 12, mixtes 4 ✅.

### Poids d'un objet par rapport au personnage (sortie `power`)

| Jeu · stat | objets avec la stat | médiane par objet | médiane perso niveau max | 1 objet / perso | emplacements | plein / perso |
| --- | --- | --- | --- | --- | --- | --- |
| LoL · PV (objets finaux, perso niv. 18) | 60 | 350 | 2395 | 15 % | 6 | 88 % |
| MLBB · PV (tier 3, héros niv. 15) | 19 | 600 | 4935 | 12 % | 6 | 73 % |
| MLBB · attaque physique (tier 3, héros niv. 15) | 16 | 57.5 | 227 | 25 % | 6 | 152 % |
| Unite · PV (objet tenu niv. 40, Pokémon niv. 15) | 14 | 367.5 | 7650 | 5 % | 3 | 14 % |
| Unite · Attack (objet tenu niv. 40, Pokémon physiques niv. 15) | 10 | 17.5 | 462 | 4 % | 3 | 11 % |

« Plein / perso » est un ordre de grandeur : un vrai build mélange les stats. L'AD de LoL est exclue parce que l'extrait donne une **croissance d'AD par niveau de 0 pour les 173 champions**. C'est une anomalie à vérifier dans `tools/extract/lol/` : soit un bug d'extraction, soit un vrai changement du patch 16.x.

Repère de croissance de Unite ✅ (`unite/pokemon.json`, Absol) : PV 3 000 → 6 200 et Attack 140 → 670 entre les niveaux 1 et 15. **Les niveaux multiplient l'attaque par environ 4,8**, alors que les 3 objets ajoutent environ 11 %.

### Objets tenus de Unite (sortie `held`)

| Objet | Stat : niv. 1 / 10 / 20 / 30 / **40** | Passif (niv. 1 → 10 → 20) |
| --- | --- | --- |
| Accel Bracer | Attack 0.5 / 5 / 10 / 15 / **17.5**<br>CD Reduction 0 / 1 / 2 / 3 / **3.5** % | Attack 0.3% → 0.45% → 0.6% |
| Aeos Cookie | HP 8 / 80 / 160 / 240 / **280** | Max HP 100 → 150 → 200 |
| Amulet Coin | HP 8 / 80 / 160 / 240 / **280**<br>Speed 0 / 50 / 100 / 150 / **175** | Additional Aeos Energy 60% → 80% → 100% |
| Assault Vest | HP 18 / 90 / 180 / 270 / **315**<br>Sp. Defense 0 / 17 / 34 / 51 / **59.5** | Max HP 10% → 15% → 20% |
| Attack Weight | Attack 0.6 / 6 / 12 / 18 / **21** | Attack 6 → 9 → 12 |
| Big Root | HP 15 / 150 / 300 / 450 / **525** | HP Recovery 10% → 15% → 20% |
| Buddy Barrier | HP 15 / 150 / 300 / 450 / **525** | Max HP Shield 15% → 20% → 25% |
| Charging Charm | Attack 1 / 5 / 10 / 15 / **17.5**<br>Speed 4 / 40 / 80 / 120 / **140** | Attack 50% → 60% → 70% |
| Choice Scarf | Attack Speed 0.5 / 2.5 / 5 / 7.5 / **8.75** %<br>Speed 0 / 50 / 100 / 150 / **175** | Movement Speed 30% → 35% → 40% |
| Choice Specs | Sp. Attack 10 / 19 / 29 / 39 / **44** | Sp. Attack 30% → 35% → 40% |
| Curse Bangle | Attack 0.8 / 8 / 16 / 24 / **28** | Reduced HP Recovery 20% → 25% → 30% |
| Curse Incense | Sp. Attack 1.3 / 13 / 26 / 39 / **45.5** | Reduced HP Recovery 20% → 25% → 30% |
| Drain Crown | HP 8 / 40 / 80 / 120 / **140**<br>Attack 0 / 6 / 12 / 18 / **21** | Lifesteal 9% → 12% → 15% |
| Drive Lens | Sp. Attack 0.8 / 8 / 16 / 24 / **28**<br>CD Reduction 0 / 1 / 2 / 3 / **3.5** % | Sp. Attack 0.3% → 0.45% → 0.6% |
| Energy Amplifier | Energy Rate 0.4 / 2 / 4 / 6 / **7** %<br>CD Reduction 0 / 1.5 / 3 / 4.5 / **5.25** % | Damage 7% → 14% → 21% |
| Exp. Share | HP 24 / 120 / 240 / 360 / **420**<br>Speed 0 / 50 / 100 / 150 / **175** | EXP/s 3 → 4 → 5 |
| Float Stone | Attack 1.6 / 8 / 16 / 24 / **28**<br>Speed 0 / 50 / 100 / 150 / **175** | Speed 10% → 15% → 20% |
| Focus Band | Defense 2 / 10 / 20 / 30 / **35**<br>Sp. Defense 0 / 10 / 20 / 30 / **35** | HP Lost 6% → 9% → 12% |
| Leftovers | HP 24 / 120 / 240 / 360 / **420**<br>HP/5s 0 / 3 / 6 / 9 / **10.5** | Max HP/s 2% → 3% → 4% |
| Muscle Band | Attack 1 / 5 / 10 / 15 / **17.5**<br>Attack Speed 0 / 2.5 / 5 / 7.5 / **8.75** % | Remaining HP 1% → 2% → 3% |
| Rapid-Fire Scarf | Attack 0.8 / 4 / 8 / 12 / **14**<br>Attack Speed 0 / 3 / 6 / 9 / **10.5** % | Attack Speed 15% → 20% → 25% |
| Razor Claw | Attack 1 / 5 / 10 / 15 / **17.5**<br>Critical-Hit Rate 0.6 / 1.1 / 1.6 / 2.1 / **2.35** % | Attack 40% → 45% → 50% |
| Rescue Hood | Defense 2 / 10 / 20 / 30 / **35**<br>Sp. Defense 0 / 10 / 20 / 30 / **35** | Shield and Recovery Effects 17% → 20% → 23% |
| Resonant Guard | HP 15 / 150 / 300 / 450 / **525**<br>HP/5s 0.6 / 6 / 12 / 18 / **21** | Max HP Shield 4% → 5% → 6% |
| Rocky Helmet | HP 18 / 90 / 180 / 270 / **315**<br>Defense 0 / 17 / 34 / 51 / **59.5** | Max HP 1.9% → 2.2% → 2.5% |
| Scope Lens | Critical-Hit Rate 0.4 / 2 / 4 / 6 / **7** %<br>Critical-Hit Damage Modifier 0 / 4 / 8 / 12 / **14** % | Of Attack Stat 45% → 60% → 75% |
| Score Shield | HP 15 / 150 / 300 / 450 / **525** | Shield 5% → 7.5% → 10% |
| Shell Bell | Sp. Attack 1.6 / 8 / 16 / 24 / **28**<br>CD Reduction 0 / 1.5 / 3 / 4.5 / **5.25** % | HP 50 → 65 → 80 |
| Slick Spoon | HP 14 / 70 / 140 / 210 / **245**<br>Sp. Attack 0 / 10 / 20 / 30 / **35** | Sp. Defense Penetration 9% → 12% → 15% |
| Sp. Atk Specs | Sp. Attack 0.8 / 8 / 16 / 24 / **28** | Sp. Attack 8 → 12 → 16 |
| Tenacity Belt | Defense 2 / 10 / 20 / 30 / **35**<br>Sp. Defense 0 / 10 / 20 / 30 / **35** | Def. & Sp. Def. 12% → 20% → 28% |
| Vanguard Bell | HP 15 / 150 / 300 / 450 / **525** | HP 6% → 8% → 10% |
| Weakness Policy | HP 70 / 110 / 160 / 210 / **235**<br>Attack 0 / 5 / 10 / 15 / **17.5** | Attack 1.5% → 2% → 2.5% |
| Wise Glasses | Sp. Attack 10 / 19 / 29 / 39 / **44** | Sp. Attack 3% → 5% → 7% |

Sans bonus de stats : Charizardite X/Y, Gyaradosite, Lucarionite, Mewtwonite X/Y (Méga-gemmes : transformation en partie), Rusted Sword.

Stats offertes (nombre d'objets) : HP 14, Attack 10, Sp. Attack 7, Speed 5, CD Reduction 4, Defense 4, Sp. Defense 4, Attack Speed 3, HP/5s 2, Crit Rate 2, Energy Rate 1, Crit Damage 1 ✅.

Source : `unite/held-items.json` ✅ (courbe recalculée avec la formule de unite-db et contrôlée sur ses textes au niveau 40). Les valeurs de Serebii sont plus anciennes ⚠️ (ex. Muscle Band « Attack +15 » contre 17,5 au niveau 40).

**Ce qu'il faut retenir**
- Les objets tenus de Unite sont **faibles en stats et forts en passifs**. Leur rôle est d'**orienter** le personnage (crit, vol de vie, bouclier, mobilité), pas de le faire monter en puissance.
- Les paliers de passif 1 / 10 / 20 suivent un rapport d'environ **1 : 1,5 : 2**, voire 1 : 2 : 3 (Muscle Band 1 → 2 → 3 %, Energy Amplifier 7 → 14 → 21 %).
- Les niveaux 1 à 40 servent à la progression de compte (monétisation, grind). **Ce n'est pas notre besoin** : nous visons un usage privé, entre amis, sans progression persistante en v1 (brief §367).
- Dans MLBB, 6 objets représentent l'essentiel de la montée en puissance d'un héros (+73 % de PV, +150 % d'attaque). Si on retire la boutique, **ce gain doit venir d'ailleurs** : des niveaux, des objets tenus ou d'un autre mécanisme.

### F3-bis — Proposition : les objets tenus remplacent l'or et la boutique de MLBB

**Principe** : chaque joueur choisit **3 objets tenus avant la partie**, sur le modèle de Unite. Il n'y a ni boutique ni achat en partie. **L'or de la partie existe toujours, mais il ne s'achète rien avec** : il remplit une jauge qui fait **monter automatiquement les 3 objets de palier**. Cela reprend le mécanisme MLBB des bottes de roaming : compétence débloquée à 600 or, renforcée jusqu'à 1 500 or ⚠️.

| Élément | Proposition | D'où ça vient |
| --- | --- | --- |
| Avant la partie | 3 objets tenus + 1 sort ou objet de combat + 1 ensemble d'emblème simplifié (F5). Le joueur fixe aussi **l'ordre de montée** des objets, ce qui lui sert de build sans menu en partie. | Unite (3 + 1) ✅, MLBB (emblème avant la partie) ✅ |
| Paliers d'objet | 3 paliers (I, II, III) au lieu de 40 niveaux. Chaque palier augmente la stat et le passif, avec un rapport de passif d'environ 1 : 1,5 : 2 comme Unite. | Unite (passifs aux niveaux 1, 10, 20) ✅ |
| Rôle de l'or | Seuils d'or cumulés : chaque seuil franchi monte d'un palier le prochain objet de l'ordre choisi. Avec 3 objets × 2 montées, on a **6 seuils**, l'équivalent des 6 achats de MLBB. Notification à l'écran, aucun clic. | MLBB, roaming 600 / 1 500 ⚠️ ; MLBB, 6 emplacements ✅ |
| Sources d'or | Celles de MLBB : passif, sbires, creeps, kills et assistances, tours, Tortue ; bonus de voie (+20 % voie d'or, +25 % EXP en voie d'EXP pendant 5 min) ; rattrapage d'équipe. | MLBB ✅ / ⚠️ |
| Rôle de l'EXP | Débloquer le kit (E2, variante B) et la croissance des stats de base. | MLBB et Unite ✅ |
| Équilibre or / niveaux | Gain de puissance d'un objet du palier I au palier III : à calibrer. **Cible de départ à simuler** : objets au palier III ≈ 30–50 % des stats ajoutées, le reste venant des niveaux. Ce serait un point médian entre Unite (≈ 11–14 %) et MLBB (≈ 73–150 %). | Calcul `power` ✅ ; **cible = proposition** |
| Contre-jeu | Les objets de l'adversaire sont visibles dès l'écran de chargement, avec leur palier sur le tableau des scores. Le joueur s'adapte par son ordre de montée et son jeu, pas par ses achats. | — |
| Indicateur visuel | Icône de palier (I, II, III) sur la barre de vie ou le portrait, et effet bref lors d'une montée. | — |
| Rattrapage | L'équipe en retard reçoit plus d'or par kill (règle MLBB, à reprendre). Le joueur le plus pauvre gagne un peu d'or passif (règle de l'Exp. Share de Unite ou du roamer de MLBB). | MLBB ✅ / ⚠️, Unite ✅ |

**Pourquoi ce choix (arbitrages)**
- **Supprimer l'or** (Unite pur) est plus simple, mais **farmer et tuer ne rapporterait plus que de l'EXP**. Les voies d'or et d'EXP de MLBB perdraient leur sens, et les objectifs aussi (Tortue = or).
- **Garder une mini-boutique** (MLBB simplifié) a été rejeté par le porteur de projet (décision 0004).
- **Monter les paliers automatiquement avec l'or** garde la boucle « farmer → devenir plus fort » de MLBB sans aucun menu. Le choix stratégique se fait avant la partie : quels objets, et dans quel ordre.
- Ce choix est compatible avec les packs : un objet est **une donnée** (stats par palier, passif par palier), validée contre le budget comme un kit.

**Paramètres à calibrer en simulation** (aucun n'est relevé) : seuils d'or des 6 montées, valeur de chaque palier, part de puissance objets / niveaux.

**Manques**
- Coûts d'amélioration des objets tenus de Unite au-delà du niveau 30 ❓ : non utile ici, puisque la proposition n'a que 3 paliers.
- Prix et recettes de MLBB ✅, mais sans formules par niveau pour les passifs du type « (+60 × Hero Level) » : ils restent en texte, à analyser objet par objet si on en reprend un.
- Croissance de l'AD dans LoL nulle dans l'extrait ⚠️ : à vérifier avant tout calcul de poids des objets sur l'AD.

---

## F4 — Retour à la base et achat

| | LoL | MLBB | Unite |
| --- | --- | --- | --- |
| Retour | Recall : durée de canalisation ❓ localement. Le buff du Baron « reduces recall channel by 4 seconds » et donne +50 % de vitesse pendant 8 s après le retour ✅ `lol/mechanics/monster.md` | Recall : canalisation de 5 s, annulée par un déplacement ou des dégâts ✅ `mlbb/battle-spells.json` ; Arrival : téléport vers une tour ou un sbire allié en 3 s ✅ | ❓ (la fonction existe en jeu, mais elle est absente des fichiers locaux) |
| Achat | à la fontaine seulement ✅ `lol/mechanics/summoners-rift.md` | **à distance**, partout ✅ ; Brawl : seulement à la base, ou après une mort ✅ | aucun achat ✅ |
| Rôle de la base | soin, boutique | soin (zone de restauration) ✅ | soin ❓ (à relever) |

**Ce qu'il faut retenir** : MLBB a déjà découplé l'achat du retour à la base. Avec la proposition F3-bis, **le retour ne sert plus qu'à se soigner**, comme dans Unite.

**Piste pour Mythic Mayhem** : retour en 5 s (MLBB) comme action de base. Montée de palier des objets **immédiate** quand un seuil d'or est franchi, où que soit le joueur. La fontaine soigne vite.

**Manques** : durée du Recall de LoL ❓ (ajouter la page wiki « Recall ») ; retour de Unite ❓ (protocole : chronométrer la canalisation en mode entraînement, 3 essais, et noter le soin à la base en PV par seconde).

---

## F5 — Emblèmes (MLBB), runes (LoL), emblèmes boost (Unite)

| | LoL (runes) | MLBB (emblèmes 2023+) | Unite (emblèmes boost) |
| --- | --- | --- | --- |
| Données locales | ❓ (`runesReforged.json` de Data Dragon non extrait) | 7 ensembles, 26 talents ✅ `mlbb/emblems.json` | 762 emblèmes, 11 couleurs ✅ `unite/emblems.json` |
| Structure | ❓ | 1 ensemble (3 attributs fixes) + 2 talents standard (paliers 1 et 2) + 1 talent principal (palier 3) ✅ | jusqu'à 10 emblèmes ; grade C, B ou A (≈ 1/3 chacun) ; 1 couleur (83 %) ou 2 (17 %) ; stats parfois négatives ; bonus de couleur à 2/4/6 ou 3/5/7 emblèmes ✅ |
| Choix | avant la partie | avant la partie (préparation ou sélection) ✅ | avant la partie ✅ |
| Ampleur | ❓ | ex. ensemble Tank : PV +500, défense hybride +10, régénération +4 ; talent principal du type « 4 % des PV max en dégâts adaptatifs » ✅ | ex. Bulbasaur A : PV −50, SpAtk +3 ; bonus de couleur maximal +4 % (Attack, HP…) à +8 % (Def, CD) ✅ |

| MLBB emblème | attributs | talents proposés |
| --- | --- | --- |
| Basic Common Emblem | Hybrid Regen +12, HP +275, Adaptive Attack +22 | 8 |
| Custom Tank Emblem | HP +500, Hybrid Defense +10, HP Regen +4 | 3 |
| Custom Assassin Emblem | Adaptive Penetration +14, Adaptive Attack +10, Movement Speed +3 % | 3 |
| Custom Mage Emblem | Magic Power +30, Cooldown Reduction +5 %, Magic Penetration +8 | 3 |
| Custom Fighter Emblem | Hybrid Lifesteal +10 %, Adaptive Attack +16, Hybrid Defense +8 | 3 |
| Custom Support Emblem | Healing Effect +12 %, Cooldown Reduction +10 %, Movement Speed +6 % | 3 |
| Custom Marksman Emblem | Attack Speed +15 %, Adaptive Attack +16, Adaptive Penetration +10 % | 3 |

⚠️ L'introduction du wiki annonce 16 talents standard et 8 principaux ; les modèles en listent 16 et 10.

**Ce qu'il faut retenir**
- Les **emblèmes de MLBB (2023+) ressemblent déjà à un système de runes simplifié** : 1 ensemble lié au rôle et 3 choix. Les emblèmes de Unite sont un système de collection, sans intérêt pour un jeu entre amis.
- Avec 3 objets tenus et 1 sort de combat, ajouter un emblème complet ferait **5 décisions avant la partie**. C'est déjà beaucoup pour des menus simplifiés.

**Piste pour Mythic Mayhem**
- **v1** : un ensemble d'emblème **par rôle**, attribué automatiquement (attributs fixes, à la manière de MLBB), **plus 1 talent principal au choix** parmi 3. On compte ainsi 3 objets + 1 sort + 1 talent avant la partie.
- Alternative plus simple : supprimer les emblèmes et intégrer leurs attributs aux stats de base des rôles. **Arbitrage** : on perd une petite personnalisation, et on gagne un écran de moins.

**Manques** : runes de LoL ❓. Ajouter `runesReforged.json` (Data Dragon) à `tools/extract/lol/`, seulement si on veut comparer ; les pistes ci-dessus n'en dépendent pas.

---

## Décisions attendues du porteur de projet (R2)

1. **E2** : variante A (points de compétence de MLBB) ou **B (montée automatique + choix A/B de Unite, recommandée)** ?
2. **E5** : ultime à temps de recharge de MLBB (recommandé) ; jauge de Unite autorisée seulement comme variante de pack ?
3. **E6** : un seul emplacement actif qui fusionne les sorts de combat de MLBB et les objets de combat de Unite ?
4. **F2–F3** : l'or est-il conservé comme **jauge de paliers d'objets** (F3-bis, recommandé), ou supprimé à la manière de Unite ?
5. **F5** : emblème par rôle + 1 talent, ou pas d'emblème en v1 ?

## Manques prioritaires (récapitulatif)

| Priorité | Manque | Comment le combler |
| --- | --- | --- |
| 1 | Courbes d'EXP de MLBB et de Unite ❓ | Mesure en jeu (protocole F1) |
| 2 | Or de MLBB actuel : passif, creeps, kills, séries ⚠️ / ❓ | Mesure en jeu (protocole F2) ; wiki CN |
| 3 | Vitesse de charge de la jauge Unite ❓ | Mesure en jeu (protocole E5) |
| 4 | Géométrie des capacités de MLBB et de Unite ❓ | Mesure vidéo (protocole E4) |
| 5 | LoL : niveaux de l'ultime, primes de kill, Recall, runes ❓ | Ajouter les pages wiki « Champion ability », « Champion gold bounties », « Objective bounties », « Recall » et `runesReforged.json` aux extracteurs |
| 6 | Croissance de l'AD dans LoL = 0 pour 173 champions ⚠️ | Vérifier `tools/extract/lol/champions.ts` contre Data Dragon (`attackdamageperlevel`) |
| 7 | Sens du `cd` des Unite Moves ; `upgradedCooldownS` lu comme une réduction ⚠️ | Comparer 5 Pokémon sur unite-db et en jeu |
