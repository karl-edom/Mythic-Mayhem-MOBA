# Ce qui manque pour rivaliser avec LoL, ML et Unite

Inventaire tenu à jour après chaque étape. Chaque ligne indique de quel jeu vient la mécanique, puis l'état : ✅ fait, 🔜 prochaine étape proposée, ⏳ plus tard.

Les priorités suivent le brief : d'abord ce qui change la partie, puis ce qui la rend lisible, et le visuel à la fin.

## 1. Gameplay

| Élément | Source | État |
| --- | --- | --- |
| Voies en couloirs, jungle fermée, collisions | ML | ✅ |
| Attaque de base prioritaire, verrou de cible | ML | ✅ |
| Attaquer en se déplaçant (immobile seulement pendant l'armement) | ML | ✅ |
| Murs qui arrêtent attaques de base et projectiles | choix du projet | ✅ |
| Comparaison avec une vidéo de partie de ML : taille de carte, caméra, 3 tours par voie | ML | ✅ (`docs/research/video-ml-2026-10-14.md`) |
| Autres vidéos : combat d'équipe, Seigneur, fin de partie | ML | 🔜, sur demande au porteur |
| Régénération des PV hors combat seulement | choix du projet | ✅ |
| Brouillard de guerre, révélation après attaque depuis un buisson | ML, LoL | ✅ |
| Passifs des 10 objets | ML | ✅ (simplifiés) |
| Annonces : premier sang, séries, multiples, équipe anéantie | ML | ✅ |
| Prime sur un héros en série (plus d'or pour qui l'arrête) | ML, LoL | ✅ |
| Caméra inclinée (sol écrasé, unités debout, haies en relief) | ML | ✅ |
| Phase finale (sbires plus forts contre les structures après 18:00) | choix du projet | ✅ |
| Provocation et suppression | ML, LoL | 🔜 |
| Ping et signaux rapides (« attaquer », « reculer », « objectif ») | les trois | 🔜, utile surtout en multijoueur |
| Plus de héros : 2 par rôle | ML | 🔜, avec l'outil de budget de puissance |
| Plus d'objets : bottes (vitesse, pénétration), objets de soutien et de jungle | ML | ⏳ |
| Emblèmes / talents avant la partie | ML (emblèmes), Unite (objets tenus) | ⏳ ; à arbitrer, car ça ajoute un menu |
| Vision par balises (wards) | LoL | ⏳ ; ML n'en a pas, donc à éviter sauf demande |
| Ligne de vue bloquée par les murs | LoL | ⏳ |
| Pause, abandon, reprise après déconnexion | les trois | ⏳ |
| Rééquilibrage du 3v3 : la base est attaquable dès qu'une tour intérieure tombe, d'où des parties de 8 min | ML, adapté | 🔜, à mesurer avec `npm run sim` |

## 2. Lisibilité et interface

| Élément | Source | État |
| --- | --- | --- |
| Tableau des scores (Tab) : niveaux, É/M/A, derniers coups, or, objets, sorts, réapparitions, objectifs | ML, LoL | ✅ |
| Fil des éliminations, bandeaux d'annonce | ML | ✅ |
| Passif des objets visible au menu et dans l'interface | ML | ✅ |
| Indicateur de portée des compétences et zone de visée avant le lancer (maintenir, relâcher) | les trois | ✅ |
| Infobulles des compétences (dégâts au niveau actuel, recharge, coût) | LoL, ML | 🔜 |
| Récapitulatif de mort (qui a infligé quoi) | LoL, ML | ✅ |
| Minuteurs des objectifs (Tortue, Seigneur, camps) sur la minicarte | ML | ✅ |
| Caméra libre (minicarte, touche Y, après la mort) dans les limites de la vision | ML, LoL | ✅ |
| Carte retournée pour l'équipe rouge | ML | ✅ |
| Cibler avec la souris (clic sur un ennemi) en plus du verrou automatique | LoL | ⏳ |
| Commandes tactiles (joystick et boutons) | ML, Unite | ⏳, nécessaires pour jouer sur téléphone |
| Options : touches, son, qualité | les trois | ⏳ |

## 3. Bots

| Élément | État |
| --- | --- |
| Tenir la voie, combattre si favorable, se replier, rentrer à la base | ✅ |
| Respect du brouillard (les bots ne voient que ce que leur équipe voit) | ✅ |
| Jungleur : camps, Tortue, Seigneur | ✅ |
| Regroupement sur les objectifs en milieu de partie | ✅ (premier pas) |
| Rotations entre voies, poussée groupée | 🔜 |
| Niveaux de difficulté | ⏳ |

## 4. Multijoueur et technique

| Élément | État |
| --- | --- |
| Moteur déterministe à pas fixe, piloté par des commandes (prérequis du réseau) | ✅ |
| Multijoueur en ligne entre amis : salon par code, lockstep relayé par la page claude.ai (décision 0006) | ✅ |
| Rejoindre en cours, reprise si l'hôte part, resynchronisation, bot qui remplace un joueur parti | 🔜 |
| Prédiction locale du déplacement (réduire la latence ressentie) | 🔜 |
| Rejeu d'une partie à partir de la graine et des commandes | ⏳, presque gratuit grâce au déterminisme |

## 5. Personnages venus d'autres univers

| Élément | État |
| --- | --- |
| Packs de personnages en données, validés par le budget de puissance | ✅ pour le moteur E2 ; 🔜 à brancher sur le jeu v1 |
| Création de personnage par le joueur, contrainte par le budget | ⏳ |

## 6. Visuel et son (en dernier, comme convenu)

| Élément | État |
| --- | --- |
| Passe visuelle 1 : sol peint, haies arrondies, tours, sbires, monstres, effets, boutons ronds | ✅ |
| Héros dessinés par univers (silhouettes, animations d'attaque et de compétences) | ⏳, en fin de projet avec les univers |
| Effets propres à chaque compétence, sons, musique | ⏳ |
