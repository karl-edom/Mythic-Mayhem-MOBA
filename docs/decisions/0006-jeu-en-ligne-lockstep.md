# 0006 — Jeu en ligne entre amis : lockstep relayé par la page claude.ai

Date : 14 octobre 2026. Statut : appliquée (lot 3).

## Contexte

La décision 0001 prévoyait le réseau au jalon 2. Le moteur est déjà déterministe : pas fixe de 20 Hz, graine, commandes. Il fallait choisir un transport et une architecture sans imposer d'hébergement payant ni d'installation.

## Décision

1. **Transport : la capacité `room` de la page publiée sur claude.ai.** Elle relie en temps réel tous ceux qui ont la page ouverte, sans serveur à héberger. Ses limites : messages de 4 Ko au plus, environ 40 envois par seconde, et aucune garantie de livraison.
2. **Architecture : lockstep déterministe, cadencé par l'hôte.**
   - Chaque navigateur fait tourner la même simulation (mêmes données, graine et choix).
   - L'hôte découpe le temps en tours de 3 ticks (150 ms). Pour chaque tour, il diffuse les commandes de chaque héros humain : quelques dizaines d'octets par joueur. Les bots sont calculés par chaque navigateur, à l'identique.
   - Les invités envoient leurs commandes dans leur *présence* (`room.presence`). Elle est fusionnée et renvoyée environ 30 fois par seconde. Chaque action ponctuelle (compétence, sort, retour, choix) porte un compteur, pour ne jamais être appliquée deux fois.
3. **Déterminisme entre navigateurs.** La simulation n'utilise plus que + − × ÷ et `Math.sqrt`, que la norme IEEE 754 rend identiques partout. `Math.hypot`, `acos`, `asin` et `**` sont remplacés par `hypot = sqrt(x² + y²)`, un cosinus polynomial et des produits (`src/sim/math.ts`).
4. **Robustesse.**
   - Chaque message de l'hôte répète les 2 tours précédents.
   - Un invité qui attend un tour depuis plus de 600 ms le demande dans sa présence (`need`), et l'hôte le renvoie.
   - Toutes les 10 tours, l'hôte joint une empreinte de l'état ; un écart affiche « Partie désynchronisée ».

## Alternatives écartées

- **Serveur WebSocket hébergé** (Render, Fly…) : il faut un compte, un hébergement et sa maintenance. Il reste possible plus tard : le module `src/net/lockstep.ts` ne dépend pas du transport.
- **Hôte qui envoie l'état complet** : trop gros pour des messages de 4 Ko (une centaine d'unités, 10 fois par seconde).
- **WebRTC pair à pair** : il faut une signalisation et un serveur TURN pour certains réseaux. C'est plus complexe pour un gain faible ici.

## Conséquences et limites

- **Qui peut jouer** : les personnes que la plateforme admet sur la page, c'est-à-dire les membres de l'organisation du propriétaire et les invités (bouton Partager de la page). Il faut être connecté à Claude. Un lien public ne suffit pas.
- **Qui peut héberger** : il faut le rôle Contributeur ou plus sur la page, car les sujets `turn` et `start` y sont ouverts. Un invité Lecteur peut seulement rejoindre.
- **Latence** : une commande met environ un tour (150 ms) plus le trajet réseau, aller-retour, à prendre effet. Il n'y a pas encore de prédiction locale.
- **Non géré pour l'instant** :
  - rejoindre une partie en cours ;
  - reprise si l'hôte part : la partie s'arrête ;
  - resynchronisation automatique après une divergence ;
  - remplacement par un bot d'un joueur parti : son héros reste immobile.
- **Tests** :
  - `tests/net.test.ts` : deux simulations alimentées par les mêmes tours restent identiques, et une divergence est détectée.
  - Test de bout en bout dans Chromium avec une imitation de `room` : 3 onglets, 20 % de messages perdus, même empreinte au tick 531.
