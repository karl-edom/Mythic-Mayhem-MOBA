# Valeurs manquantes : sources possibles et mesures en jeu

État au 2026-10-13, après l'extraction initiale et une recherche web ciblée. Les sites d'extraction déjà ouverts ne documentent pas ces valeurs.

Légende de confiance :

- ✅ : source fiable ;
- ⚠️ : source communautaire non vérifiée, ou ancienne ;
- ❓ : introuvable.

## Mobile Legends (squelette) : surtout introuvable publiquement

| Valeur | État | Ce qu'on sait | Piste |
| --- | --- | --- | --- |
| Table d'expérience par niveau (1 → 15) | ❓ | Rien de public. Le wiki Fandom n'a pas la table. | **Mesure en jeu** |
| Temps de réapparition | ⚠️ | Il augmente avec la durée de la partie (constaté par le porteur de projet). Le wiki indique « calcul nécessaire » ([Death](https://mobile-legends.fandom.com/wiki/Death)). Un ancien patch donne 3,2 s + 2,1 s × niveau + minutes de jeu. | **Mesure en jeu** pour confirmer |
| PV et attaque des sbires, croissance par vague | ❓ | Arrivée des sbires sur la voie : environ 15 s au milieu et 28 s sur les côtés ([VCGamers](https://www.vcgamers.com/news/?p=28467), ⚠️). Bonus de 25 % d'XP des sbires sur la voie d'expérience pendant 5 min ([EXP Laner](https://mobile-legends.fandom.com/wiki/EXP_Laner)). | **Mesure en jeu** |
| PV des tours et du cristal | ❓ | Portée des tours 5,3 et vision 8 (wiki) | **Mesure en jeu** |

Aucune base de données publique n'existe sur ces points. Les recherches en anglais et en indonésien n'ont rien donné. Le seul jeu de données complet trouvé ([opendatabay](https://www.opendatabay.com/data/ai-ml/9c27ee82-a4db-4260-a82f-8a980ed3f280)) s'arrête au patch 1.7.20 (2022) et ne couvre que les héros.

## Pokémon Unite : documenté par la communauté

| Valeur | État | Ce qu'on sait | Source |
| --- | --- | --- | --- |
| Réduction des dégâts par la défense | ⚠️ | Dégâts = base × 600 / (600 + plancher(Déf / 2,5)), soit l'équivalent de Déf / (Déf + 1500). Tests de la communauté (2021), pas forcément à jour. | [r/PokemonUnite](https://reddit.fabiomanganiello.com/r/PokemonUnite/comments/os277b/defensesp_defense_formula) |
| Limite de points des zones de but | ⚠️ | Zones extérieures 80 points, zone du milieu 100, zone de base illimitée (jamais détruite) | [Bulbapedia, Goal zone](https://bulbapedia.bulbagarden.net/wiki/Goal_zone) |
| Temps de marque | ⚠️ | Proportionnel aux points portés. Réduit quand plusieurs alliés marquent ensemble (jusqu'à moitié moins). Points doublés pendant les 2 dernières minutes. | Bulbapedia |
| Expérience gagnée | ⚠️ | Par le temps qui passe, les Pokémon battus et les buts (à partir de 2 points). Pas de table par niveau trouvée. | [GameWith](https://gamewith.net/pokemon-unite/article/show/29608), wikiwiki.jp |
| Objectifs | ⚠️ | Drednaw et Rotom à 7:00 ; Rotom revient 2 min après sa capture | GameWith |

## Domaines à ouvrir pour aller plus loin

À ajouter dans « Allowed domains » :

- `bulbapedia.bulbagarden.net` : Unite (zones de but, mécaniques, expérience) ;
- `wikiwiki.jp` : wiki japonais de Unite, très détaillé sur les mécaniques ;
- `gamewith.net` : guides de Unite avec minuteurs ;
- `pokemonunite.fandom.com` : wiki de Unite.

Pour Mobile Legends, ouvrir d'autres domaines n'apportera probablement rien : ces valeurs ne sont publiées nulle part. **La mesure en jeu est la seule voie.**

## Protocole de mesure en jeu (Mobile Legends)

Le protocole détaillé, système par système, est dans les fiches `docs/research/systems/*.md` (sections « Manques »). En résumé, en partie d'entraînement :

1. **Expérience par niveau.** Noter l'XP affichée avant et après chaque montée de niveau, et la source de l'XP : un sbire, un camp, le temps qui passe.
2. **Réapparition.** Mourir volontairement à plusieurs moments (par exemple à 2, 5, 10 et 15 min) et à différents niveaux. Noter le niveau, la minute de jeu et le temps affiché.
3. **Sbires.** Compter le nombre d'attaques de base d'un héros connu (attaque connue grâce à nos données) pour tuer chaque type de sbire, à 1, 5 et 10 min.
4. **Tours et cristal.** Même méthode, avec un héros dont l'attaque est connue, en notant les protections actives.

Une capture vidéo de l'écran suffit : on peut faire les relevés après coup, image par image.
