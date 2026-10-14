# Mythic Mayhem

MOBA 3 contre 3 jouable dans le navigateur. C'est une **copie mixée** de Mobile Legends (le squelette), de League of Legends (stats et formules) et de Pokémon Unite (objets choisis avant la partie, compétences à choix). Les personnages sont originaux, et seront ensuite déclinés dans les univers voulus.

Statut : **v1 jouable**, toi et 2 bots contre 3 bots. Règles : `docs/design/rules-v1.md`.

> **Deux jeux dans ce dépôt.** Cette branche (`claude/great-ramanujan-j9816b`) est le **MOBA 3v3**, publié sous le nom « Mythic Mayhem MOBA ». La branche `claude/jstars-custom-characters-fiqi08` est un autre jeu, un brawler d'arène 3D (« Mythic Mayhem Arène »). Les deux branches se séparent après la décision 0004. Leurs décisions 0005 et suivantes portent les mêmes numéros mais ne parlent pas de la même chose : ne pas les fusionner.

## Jouer

```bash
npm install
npm run build        # → dist/mythic-mayhem.html, un seul fichier à ouvrir dans un navigateur
```

Commandes (clavier et souris) :

| Action | Touches |
| --- | --- |
| Se déplacer | ZQSD en AZERTY (WASD en QWERTY) ou flèches |
| Attaquer (verrouillage automatique de la cible) | Espace ou clic gauche maintenu |
| Compétences, visées à la souris | A, E, R en AZERTY (Q, E, R en QWERTY) |
| Sort de combat | F |
| Retour à la base | B |
| Tableau des scores | Tab (maintenu) |
| Choix de compétence A ou B (niveaux 5 et 7) | 1 et 2 |

Options de test dans l'adresse : `?vitesse=8` accélère la simulation, `?auto=1` confie ton personnage à un bot.

## Développer

```bash
npm test             # tests (moteur, règles, validateur)
npm run typecheck
npm run sim -- --n 10   # parties complètes entre bots : durée, niveaux, or
```

- `src/game/` : moteur déterministe sans rendu (`engine.ts`), formules, bots ;
- `data/game/` : **tous les chiffres du jeu**, avec leur source ;
- `web/` : client navigateur (canvas 2D) ;
- `data/reference/` et `tools/extract/` : données extraites des trois jeux de référence.

## Documents

- `docs/design/rules-v1.md` : règles de la v1 (valeurs ✅ relevées, ⚠️ anciennes, 🧪 provisoires)
- `docs/design/backlog.md` : ce qui manque encore par rapport aux trois jeux, par priorité
- `docs/research/comparison.md` : comparaison des trois jeux et choix faits
- `docs/research/systems/` : fiches détaillées par famille de systèmes
- `docs/research/gaps.md` : valeurs manquantes et mesures à faire en jeu
- `docs/decisions/` : décisions prises (0001 à 0005)
- `docs/vision.md`, `docs/product-brief.md` : intention et brief initial
- `docs/experiments/e2-results.md` : première expérience d'équilibrage (approche abandonnée au profit de la copie, outils conservés pour le futur créateur de personnages)
