Source: https://wiki.leagueoflegends.com/en-us/Haste

> LoL wiki page "Haste" (revision 4070414), rendered HTML converted to Markdown by tools/extract/lol/mechanics.ts. Content © League of Legends Wiki contributors, CC BY-SA 3.0. Reference material for private research only.

# Haste

**Haste** is a category of stats that reduce the **total** cooldown of non-basic attack spells, and thus improves their **casting rate**. It is the analog to attack speed for basic attacks. **Haste** does not affect static cooldowns nor target immunity cooldowns, unless otherwise stated. Haste is categorized based on the spell it affects; champion ability haste (basic, ultimate), item haste, summoner spell haste, and trinket haste.

In Pre-Season 2021, **haste** replaced  cooldown reduction, a statistic that multiplicatively increased casting rate and mandated an artificial cap and limited access from items and runes. Every point of haste has the same benefit compared to the base casting rate; analogous to the way armor and magic resist are calculated.

## Reducing ability cooldowns

> *Main article: Haste/Reducing ability cooldowns*

**Haste** is a generic means of reducing cooldowns, but it is not the only method. Some effects' **current** (remaining) cooldown may decrease upon a condition being fulfilled.

## Haste formula

Assuming an effect is used as soon as it is available, and ignoring cast time, its base casting rate is definitionally equal to  `(1 cast) / (Base Cooldown)`  (inverse cooldown).

Haste modifies the casting rate of the effect by a percentage, at a 1:1 ratio. This is expressed using the following formula:

 `New Casting Rate = Base Casting Rate × (1 + Haste / 100)`

The casting rate therefore increases (for positive values) or decreases (for negative values) linearly, by 1% for every 1 point of haste. 100 haste means a 100% increase to the original casting rate, or double. 200 haste means a 200% increase to the original casting rate, or triple.

To find the resulting cooldown, combine the expression in brackets and substitute casting rate for inverse cooldown:

 `1 / (New Cooldown) = 1 / (Base Cooldown) × (100 + Haste) / 100`

Via invertendo property, the above is equivalent to:

 `New Cooldown = Base Cooldown × 100 / (100 + Haste)`

The cooldown therefore decreases (for positive values) or increases (for negative values) as haste increases via hyperbolic growth. 100 haste means the resulting cooldown is 50% of the original cooldown, or half. 200 haste means the resulting cooldown is 33.3% of the original cooldown, or a third.

Cooldown reduction can be found by manipulation of the above formula.

 `(New Cooldown) / (Base Cooldown) = 100 / (100 + Haste)`  (Take the fraction of new over the old cooldown to find the resulting cooldown percentage)

 `1 − (New Cooldown) / (Base Cooldown) = 1 − 100 / (100 + Haste)`  (Take the additive inverse of both sides to find the cooldown reduction)

 `Cooldown Reduction = (100 + Haste) / (100 + Haste) − 100 / (100 + Haste)`  (Combine fractions)

 `Cooldown Reduction = (100 + Haste − 100) / (100 + Haste)`

 `Cooldown Reduction = Haste / (100 + Haste)`

The formula shows that cooldown reduction can never reach exactly 100%, for a real cooldown of 0, by adding more haste: each additional point of haste gives less cooldown reduction. However, **haste** itself does not have diminishing returns in regards to **casting speed**. Conversely, cooldown reduction as a percentage value has increasing, potentially unlimited returns that bring the **casting speed** to infinity as it approaches 100%. When considering other factors such as potential cast times, human imperfect input and other gameplay variables, cooldown reduction can be a difficult statistic to intuit and calculate the value of.

Casting speed graph with respect to haste, example cooldown = 10 seconds.

Casting speed graph with respect to haste, example cooldown = 10 seconds.

Cooldown graph with respect to haste, example cooldown = 10 seconds.

Cooldown graph with respect to haste, example cooldown = 10 seconds.

## Ability haste

**Ability haste**, or  **AH** reduces the cooldowns of champion abilities by a percentage. It is the most common form of **haste** and it is the only **haste** stat that is displayed by the game client in the HUD's player stat overview. It is capped at **500**, which is equivalent to 83.3% cooldown reduction.

- Ability haste itself stacks additively, and each point acquired directly adds to the statistic (1:1).

**Ability haste** can be gained from buffs, items and runes.

*Gold Value*

- **Ability haste** has a gold value of 50 per point.

### Scaling with ability haste

It is important to note that **any** cooldown that can be reduced through cooldown reduction, will innately scale off of haste (which is, of course, cooldown reduction). However, certain mechanics are special-cased to be affected by ability haste whereas they normally would not be. There are currently no such effects.

### Increasing ability haste

**Items**

This table is automatically generated based on the data from Module:ItemData/data.

| Item | Cost | Amount | Availability |
| --- | --- | --- | --- |
| Abyssal Mask Abyssal Mask | 2650 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Actualizer Actualizer | 2800 | 10 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Anathema's Chains Anathema's Chains | 2500 | 20 | Arena |
| Archangel's Staff Archangel's Staff | 2900 | 25 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Axiom Arc Axiom Arc | 2750 | 20 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Bami's Cinder Bami's Cinder | 900 | 5 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Bandleglass Mirror Bandleglass Mirror | 900 | 10 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Bandlepipes Bandlepipes | 2300 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Bastionbreaker Bastionbreaker | 3000 | 15 | Nexus Blitz, Classic Summoner's Rift 5v5 |
| Black Cleaver Black Cleaver | 3000 | 20 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Black Hole Gauntlet Black Hole Gauntlet | 0 | 25 | Arena |
| Blackfire Torch Blackfire Torch | 2800 | 20 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Bloodletter's Curse Bloodletter's Curse | 2900 | 15 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Caulfield's Warhammer Caulfield's Warhammer | 1050 | 10 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Chempunk Chainsword Chempunk Chainsword | 3000 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Cosmic Drive Cosmic Drive | 3000 | 25 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Crimson Lucidity Crimson Lucidity | 900 | 20 | Classic Summoner's Rift 5v5 |
| Crown of the Shattered Queen Crown of the Shattered Queen | 0 | 25 | Arena |
| Cryptbloom Cryptbloom | 3000 | 20 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Death's Dance Death's Dance | 3300 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Detonation Orb Detonation Orb | 0 | 20 | Arena |
| Divine Sunderer Divine Sunderer | 0 | 20 | Arena |
| Dusk and Dawn Dusk and Dawn | 3100 | 20 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Duskblade of Draktharr Duskblade of Draktharr | 0 | 20 | Arena |
| Echoes of Helia Echoes of Helia | 2200 | 20 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Eclipse Eclipse | 2900 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Eleisa's Miracle Eleisa's Miracle | 0 | 25 | Arena |
| Empyrean Promise Empyrean Promise | 0 | 30 | Arena |
| Essence Reaver Essence Reaver | 3050 | 20 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Everfrost Everfrost | 0 | 25 | Arena |
| Fiendish Codex Fiendish Codex | 850 | 10 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Fimbulwinter Fimbulwinter | 2400 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Flesheater Flesheater | 0 | 20 | Arena |
| Force of Entropy Force of Entropy | 0 | 30 | Arena |
| Frozen Heart Frozen Heart | 2500 | 20 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Gambler's Blade Gambler's Blade | 0 | 40 | Arena |
| Gargoyle Stoneplate Gargoyle Stoneplate | 0 | 15 | Arena |
| Glacial Buckler Glacial Buckler | 900 | 10 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Glowing Mote Glowing Mote | 250 | 5 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Goredrinker Goredrinker | 0 | 20 | Arena |
| Guardian's Amulet Guardian's Amulet | 500 | 20 | Arena |
| Guardian's Blade Guardian's Blade | 950 | 15 | Arena, All Random All Mid |
| Guardian's Dirk Guardian's Dirk | 500 | 10 | Arena |
| Guardian's Shroud Guardian's Shroud | 500 | 15 | Arena |
| Hemomancer's Helm Hemomancer's Helm | 0 | 30 | Arena |
| Hextech Rocketbelt Hextech Rocketbelt | 2650 | 10 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Hollow Radiance Hollow Radiance | 2800 | 10 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Horizon Focus Horizon Focus | 2700 | 25 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Hubris Hubris | 2800 | 10 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Iceborn Gauntlet Iceborn Gauntlet | 2900 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Imperial Mandate Imperial Mandate | 2400 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Innervating Locket Innervating Locket | 0 | 20 | Arena |
| Ionian Boots of Lucidity Ionian Boots of Lucidity | 900 | 10 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Jarvan I's Jarvan I's | 0 | 10 | ARAM: Mayhem |
| Kindlegem Kindlegem | 800 | 10 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Kinkou Jitte Kinkou Jitte | 0 | 30 | Arena |
| Knight's Vow Knight's Vow | 2300 | 10 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Lich Bane Lich Bane | 2900 | 10 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Locket of the Iron Solari Locket of the Iron Solari | 2200 | 10 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Lost Chapter Lost Chapter | 1200 | 10 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Luden's Echo Luden's Echo | 2750 | 10 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Malignance Malignance | 2700 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Manamune Manamune | 2900 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Maw of Malmortius Maw of Malmortius | 3100 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Mikael's Blessing Mikael's Blessing | 2300 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Moonstone Renewer Moonstone Renewer | 2200 | 20 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Morellonomicon Morellonomicon | 2850 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Muramana Muramana | 2900 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Nashor's Tooth Nashor's Tooth | 2900 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Night Harvester Night Harvester | 0 | 25 | Arena |
| Profane Hydra Profane Hydra | 2850 | 10 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Protoplasm Harness Protoplasm Harness | 2600 | 20 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Prowler's Claw Prowler's Claw | 0 | 20 | Arena |
| Puppeteer Puppeteer | 0 | 40 | Arena |
| Pyromancer's Cloak Pyromancer's Cloak | 0 | 15 | Arena |
| Ravenous Hydra Ravenous Hydra | 3300 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Redemption Redemption | 2250 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Riftmaker Riftmaker | 3100 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Rite of Ruin Rite of Ruin | 2500 | 15 | ARAM: Mayhem, Arena |
| Runecarver Runecarver | 0 | 20 | Arena |
| Sanguine Gift Sanguine Gift | 0 | 20 | Arena |
| Seraph's Embrace Seraph's Embrace | 2900 | 25 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Serylda's Grudge Serylda's Grudge | 3000 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Sheen Sheen | 900 | 10 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Shurelya's Battlesong Shurelya's Battlesong | 2200 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Spirit Visage Spirit Visage | 2700 | 10 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Staff of Flowing Water Staff of Flowing Water | 2250 | 10 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Sundered Sky Sundered Sky | 3100 | 10 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Sunfire Aegis Sunfire Aegis | 2800 | 10 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Sword of Blossoming Dawn Sword of Blossoming Dawn | 2500 | 15 | ARAM: Mayhem, Arena |
| Talisman of Ascension Talisman of Ascension | 0 | 0 | Arena |
| The Brutalizer The Brutalizer | 1337 | 10 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| The Golden Spatula The Golden Spatula | 0 | 20 | ARAM: Mayhem, Arena |
| Trinity Force Trinity Force | 3333 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Ultra Hydra Ultra Hydra | 0 | 25 | ARAM: Mayhem |
| Umbral Glaive Umbral Glaive | 2800 | 15 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Unending Despair Unending Despair | 2800 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Void Immolation Void Immolation | 0 | 25 | ARAM: Mayhem, Arena |
| Voltaic Cyclosword Voltaic Cyclosword | 3000 | 10 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Winter's Approach Winter's Approach | 2400 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Wooglet's Witchcap Wooglet's Witchcap | 0 | 20 | ARAM: Mayhem, Arena |
| Wordless Promise Wordless Promise | 2500 | 25 | Arena |
| Zeke's Convergence Zeke's Convergence | 2200 | 10 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Zephyr Zephyr | 2500 | 30 | Arena |

**Item passives**

- Endless Hunger

- Staff of Flowing Water

**Champion abilities**

- Bel'Veth's Void Surge grants ability haste to its per-direction cooldown

- Syndra's Unleashed Power grants ability haste to Dark Sphere

**Runes**

- Jack of All Trades

- Transcendence

- Ability haste rune shard

**Neutral buffs**

- Crest of Insight

- Hextech Prowess

- Infernal Cinder

## Basic ability haste

**Basic ability haste** reduces the cooldowns of champion basic abilities. It stacks additively with ability haste. The resulting additive **total haste** is capped at **500**, which is equivalent to 83.3% cooldown reduction.

### Increasing basic ability haste

**Champion abilities**

- Sona's Accelerando

**Items**

- Spear of Shojin

**Runes**

- Legend: Haste

## Ultimate haste

**Ultimate haste** reduces the cooldowns of champion ultimate abilities. It stacks additively with ability haste. The resulting additive **total haste** is capped at **500**, which is equivalent to 83.3% cooldown reduction.

### Scaling with ultimate haste

- Shyvana's Dragon's Descent

### Increasing ultimate haste

**Items**

- Experimental Hexplate

- Fiendhunter Bolts

- Malignance

- Zeke's Convergence

**Runes**

- Ultimate Hunter

## Item haste

**Item haste** reduces the cooldowns of items with cooldowns, including passives and actives (trinkets count as active items).

### Increasing item haste

**Runes**

- Grisly Mementos

- Cosmic Insight

| Item Haste | Item Haste | Item Haste | Item Haste | Item Haste | Item Haste | Item Haste | Item Haste |
| --- | --- | --- | --- | --- | --- | --- | --- |
|   | None |   |   |   |   |   |   |
| None | 0 |   |   |   |   |   |   |
|   | 10 |   |   |   |   |   |   |

| Item Haste (Equivalent in CDR) | Item Haste (Equivalent in CDR) | Item Haste (Equivalent in CDR) | Item Haste (Equivalent in CDR) | Item Haste (Equivalent in CDR) | Item Haste (Equivalent in CDR) | Item Haste (Equivalent in CDR) | Item Haste (Equivalent in CDR) |
| --- | --- | --- | --- | --- | --- | --- | --- |
|   | None |   |   |   |   |   |   |
| None | 0% |   |   |   |   |   |   |
|   | 9.09% |   |   |   |   |   |   |

| Item Cooldown | Item Cooldown | Item Cooldown | Item Cooldown | Item Cooldown | Item Cooldown | Item Cooldown | Item Cooldown | Item Cooldown | Item Cooldown | Item Cooldown |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Items | Base Cooldown |   |   |   |   |   |   |   |   |   |
|   | 1 | 0.91 |   |   |   |   |   |   |   |   |
|   | 1.5 | 1.36 |   |   |   |   |   |   |   |   |
|   | 3 | 2.73 |   |   |   |   |   |   |   |   |
|   | 4 | 3.64 |   |   |   |   |   |   |   |   |
|   | 6 | 5.45 |   |   |   |   |   |   |   |   |
|   | 8 | 7.27 |   |   |   |   |   |   |   |   |
|   | 10 | 9.09 |   |   |   |   |   |   |   |   |
|   | 12 | 10.91 |   |   |   |   |   |   |   |   |
|   | 15 | 13.64 |   |   |   |   |   |   |   |   |
|   | 18 | 16.36 |   |   |   |   |   |   |   |   |
|   | 20 | 18.18 |   |   |   |   |   |   |   |   |
|   | 30 | 27.27 |   |   |   |   |   |   |   |   |
|   | 40 | 36.36 |   |   |   |   |   |   |   |   |
|   | 45 | 40.91 |   |   |   |   |   |   |   |   |
|   | 50 | 45.45 |   |   |   |   |   |   |   |   |
|   | 60 | 54.55 |   |   |   |   |   |   |   |   |
|   | 75 | 68.18 |   |   |   |   |   |   |   |   |
|   | 90 | 81.82 |   |   |   |   |   |   |   |   |
|   | 120 | 109.09 |   |   |   |   |   |   |   |   |
|   | 300 | 272.73 |   |   |   |   |   |   |   |   |

## Summoner spell haste

**Summoner spell haste** reduces the cooldowns of summoner spells.

### Increasing summoner spell haste

**Items**

- Crimson Lucidity

- Ionian Boots of Lucidity

**Runes**

- Cosmic Insight

- Grisly Mementos (in modes where wards are not available)

**Other**

- Howling Abyss aura

*Summoner spell haste*

| **Summoner's Rift** | **Summoner's Rift** | **Summoner's Rift** | **Summoner's Rift** | **Summoner's Rift** | **Summoner's Rift** | **Summoner's Rift** | **Summoner's Rift** | **Summoner's Rift** | **Summoner's Rift** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Base cooldown ▶ | Base cooldown ▶ | 420s () | 300s () | 240s ( ) | 180s () | 90s () | 20s () |   |   |
| ▼  Haste | ▼  Haste | 420s () | 300s () | 240s ( ) | 180s () | 90s () | 20s () |   |   |
| 10 () | 10 () | 381.82s | 272.73s | 218.18s | 163.64s | 81.82s | 18.18s |   |   |
| 18 () | 18 () | 355.93s | 254.24s | 203.39s | 152.54s | 76.27s | 16.95s |   |   |
| 20 () | 20 () | 350s | 250s | 200s | 150s | 75s | 16.67s |   |   |
| 28 () | 28 () | 328.13s | 234.38s | 187.5s | 140.63s | 70.31s | 15.63s |   |   |
| 38 () | 38 () | 304.35s | 217.39s | 173.91s | 130.43s | 65.22s | 14.49s |   |   |
| **Howling Abyss** | **Howling Abyss** | **Howling Abyss** | **Howling Abyss** | **Howling Abyss** | **Howling Abyss** | **Howling Abyss** | **Howling Abyss** | **Howling Abyss** | **Howling Abyss** |
| Base cooldown ▶ | Base cooldown ▶ | 300s () | 290s () | 240s ( ) | 180s () | 80s () | 20s () |   |   |
| ▼  Haste | ▼  Haste | 300s () | 290s () | 240s ( ) | 180s () | 80s () | 20s () |   |   |
| 70 () | 70 () | 176.47s | 170.59s | 141.18s | 105.88s | 47.06s | 11.76s |   |   |
| 80 () | 80 () | 166.67s | 161.11s | 133.33s | 100s | 44.44s | 11.11s |   |   |
| 88 () | 88 () | 159.57s | 154.26s | 127.66s | 95.74s | 42.55s | 10.64s |   |   |
| 98 () | 98 () | 151.52s | 146.46s | 121.21s | 90.91s | 40.4s | 10.1s |   |   |
| 124 () | 124 () | 133.93s | 129.46s | 107.14s | 80.36s | 35.71s | 8.93s |   |   |
| 134 () | 134 () | 128.21s | 123.93s | 102.56s | 76.92s | 34.19s | 8.55s |   |   |
| 142 () | 142 () | 123.97s | 119.83s | 99.17s | 74.38s | 33.06s | 8.26s |   |   |
| 152 () | 152 () | 119.05s | 115.08s | 95.24s | 71.43s | 31.75s | 7.94s |   |   |

## Trinket haste

**Trinket haste** reduces the cooldowns of trinket items.

**Runes**

- Grisly Mementos

## Trivia

- There is only one current rune that can have their cooldown reduced:

  - Dark Harvest has its cooldown reset to 1 second upon scoring a takedown against an enemy champion.

  - As of Patch 26.9, the cooldown refund for Arcane Comet has been removed.

## Highest Ability Haste

### Summoner's Rift

***Last updated:** April 19th, 2026, patch V26.08*

- The highest attainable ability haste in Summoner's Rift draft pick, excluding any infinitely stacking effects such as Heartsteel's Colossal Consumption or Gathering Storm, is **297.28 AH** (attainable by Zaahen), this is equivalent to **74.83% cooldown reduction**.

- **Team:**

  - Ornn

  - Zaahen

  - Janna

  - Lulu

  - Karma / Milio / Soraka / etc.(anyone that can quickly shield or heal multiple targets works)

- Lulu's setup:

  - Level 18

  - **Items:**

    - Rabadon's Deathcap* and *Magical Opus* bonus

    - Mejai's Soulstealer and 25 stacks of *Glory*

    - Banshee's Veil

    - Shadowflame*

    - Zhonya's Hourglass

    - Lich Bane / Luden's Echo

    - Consumed Elixir of Sorcery

      - *Any of these can be masterwork

  - **Runes:**

    - 12 stacks of Conqueror

    - Absolute Focus while health is at least 70%

    - Waterwalking while in the river

    - 2 ×  Adaptive force rune shard

  - **Other Buffs:**

    - Hand of Baron

    - Staff of Flowing Water's *Rapids*

  - Lulu's total AP: 1359.8 AP

    - **Items** = 180 + 20 + 125 + 105 + 110 + 105 + 100= 745 AP

    - **Runes** = 48 + 30 + 30 + 9 × 2 = 126 AP

    - **Buffs** = 80 + 50 + 45 = 175 AP

    - **AP Multiplier** = 1 + 0.3 = 1.3

      - AP = (745 AP + 126 + 175) × 1.3 = **1359.8 AP**

      - Wild Growth's health: 575 + (1359.8  ×  0.55) = 1322.89

- Janna's setup:

  - Level 20 (Toplane Role Quest completed))

  - **Items:**

    - Rabadon's Deathcap* and *Magical Opus* bonus

    - Mejai's Soulstealer and 25 stacks of *Glory*

    - Banshee's Veil

    - Shadowflame*

    - Zhonya's Hourglass

    - Riftmaker

    - Consumed Elixir of Sorcery

      - *Any of these can be masterwork

  - **Runes:**

    - 12 stacks of Conqueror

    - Absolute Focus while health is at least 70%

    - Waterwalking while in the river

    - 2 ×  Adaptive force rune shard

    - Scaling health rune shard

  - **Other Buffs:**

    - Hand of Baron

    - Staff of Flowing Water's *Rapids*

  - Janna's bonus HP: 350 + 100 + 200 + 995.75 = 1645.75

  - Janna's total AP: 1374.36 AP

    - **Items** = 180 + 20 + 125 + 105 + 110 + 105 + 70 + 32.915= 754.46 AP

    - **Runes** = 51.11 + 33.18 + 32 + 9 × 2 = 134.29 AP

    - **Buffs** = 80 + 50 + 45 = 175 AP

    - **AP Multiplier** = 1 + 0.3 = 1.3

      - AP = (754.46 AP + 134.29 + 175) × 1.3 = **1382.86 AP**

      - Eye of the Storm's attack damage: 30 + (1382.86*0.1) = 168.29 **bonus** AD

- Zaahen's setup:

  - Level 18

  - **Items:**

    - Black Cleaver

    - Death's Dance*

    - Endless Hunger

    - Muramana*

    - Ravenous Hydra*

    - Essence Reaver*

    - Ionian Boots of Lucidity (Botlane Role Quest completed)

    - Consumed Elixir of Wrath

    - Consumed Elixir of Force

      - *Any of these can be masterwork

  - **Runes:**

    - Manaflow Band

    - Transcendence

    - Waterwalking while in the river

    - Triple Tonic

    - Jack of All Trades

    - Ability haste rune shard

    - Adaptive force rune shard

  - **Buffs:**

    - Crest of Insight

    - Hextech Prowess x 4

    - Hand of Baron

    - Eye of the Storm

  - Zaahen's total mana: 1285 + 1000 + 250 = 2535 mana

  - Zaahen bonus attack damage:

    - **Items** = 40 + 60 + 65 + 35 + 50.7 + 79.29* + 50 + 30 + 15 = 430 attack damage

    - **Runes** = 15 + 18 + 5.4 = 38.4 attack damage

    - **Buff** = 48 + 168.29 = 216.29 attack damage

    - **AD Multiplier** = 1 + 0.672

      - Total attack damage before passive: 131 + 430 + 38.4 + 216.29 = 815.67 total attack damage

      - Bonus final attack damage: (815.67  ×  1.672) - 131 = 1232.8 bonus attack damage

- Zaahen's ability haste:

  - **Items** = 20 + 15 + 128.28 + 15 + 31* + 20 + 10 = 239.28 ability haste

  - **Runes** = 10 + 10 + 8 = 28 ability haste

  - **Buff** = 10 + 20 = 30 ability haste

    - **Total ability haste** = 239.28 + 28 + 30 = **297.2803473929 ability haste**

## References

- ↑ Yetter, M. (7 August 2020). *Preseason 2021 Class Item Goals*. leagueoflegends.com.

## See Also

**Champion statistics**

 League of Legends content

Stacks additively

An effect that **stacks additively** can be calculated by adding the effects together.

Most champion statistics that stack this way are expressed through flat numbers, but the stats can also be percentages. The following stats **stack additively**:

- Ability haste

- Ability power

- Armor

- Lethality and flat armor reduction

- Attack damage

- Attack speed

- Critical strike chance

- Critical strike damage

- Heal and shield power

- Health

- Health regeneration

- Life steal

- Magic resistance

- Flat magic penetration and reduction

- Mana

- Mana regeneration

- Omnivamp

- Physical vamp

 League of Legends content

| Void Surge | COOLDOWN: 4 / 3.25 / 2.5 / 1.75 / 1 |
| --- | --- |

| **Active:** Bel'Veth dashes in the target direction, though not through terrain, dealing physical damage to enemies she passes through. |
| --- |
| *Void Surge* can be cast only within a cardinal direction that is off cooldown, each direction has a unique  cooldown that scales down with her  **bonus** attack speed. |
| *Void Surge's* damage against the first enemy hit can critically strike and applies on-hit effects and  life steal. |

 League of Legends content

| Unleashed Power | COOLDOWN: 120 / 100 / 80 |
| --- | --- |

| **Passive:** * Dark Sphere* gains  ability haste. |
| --- |
| **Active:** Syndra creates a few * Dark Spheres* and grabs a few more nearby, then barrages them at the target enemy champion. Each sphere deals magic damage upon hit, and remains on the ground for a few seconds. |
| ** Transcendent Bonus:** *Unleashed Power* executes enemies once they reach a certain  health threshold. |

 League of Legends content

| Dark Sphere | RECHARGE: 7 |
| --- | --- |

| **Active:** After a brief delay, Syndra conjures a *Dark Sphere* at the target location that deals magic damage to nearby enemies. The *Dark Sphere* then remains on the ground for a few seconds. |
| --- |
| ** Transcendent Bonus:** **Syndra** periodically stocks a *Dark Sphere* charge. |

 League of Legends content

| Power Chord |   |
| --- | --- |

| **Innate - Accelerando:** Sona gains a permanent stack of *Accelerando* each time she hits an enemy champion with * Hymn of Valor* and each time she mitigates sufficient damage or heals damaged allies with * Aria of Perseverance*. If she has max stacks, she instead  reduces the cooldown of * Crescendo* each time. |
| --- |
| **Innate - Melody:** **Sona's** basic abilities incur a  brief cooldown on her other basic abilities, and cause her to generate a unique aura for a short time that empowers herself and nearby allied champions. |
| **Innate - Power Chord:** **Sona's** basic abilities generate permanent stacks of *Power Chord*. At 3 stacks, her next basic attack consumes them all to become empowered with bonus magic damage and apply an additional effect based on the last basic ability cast. |
| **Accelerando:** For each stack, **Sona** gains  basic ability haste. |

 League of Legends content

| Dragon's Descent |   |
| --- | --- |

| **Passive - Fury:** Shyvana generates Fury every second while in **Human Form**, and also generates Fury from her basic attacks and abilities when they deal damage. |
| --- |
| **Active:** **Shyvana** transforms into **Dragon Form** and dashes with displacement immunity, breathing fire in a cone that deals magic damage to enemies hit and briefly fears them. |
| **Dragon Form**: **Shyvana** gains  **bonus** health,  **bonus** attack range, and increased size. Her abilities are empowered to apply an additional effect. She maintains **Dragon Form** at a recurring cost of Dragon Fury, returning to **Human Form** once all Dragon Fury has been depleted. |

 League of Legends content

Howling Abyss Aura

- +70 summoner spell haste.

- Restores  0.1% of **maximum** mana per second.

- Passively gains  5 experience per second.

- Reduces all outgoing heals by 50%. *The healing reduction does not affect self-heals.*

- Omnivamp and  life steal healing effectiveness against minions is reduced by 40%.

- While alive and within 1250 units of an enemy minion that dies, gain 6 from its death (unless you scored the killing blow on it).

- Melee champions gain  15 **bonus** magic resistance and their basic attacks deal 20% increased damage against siege minions and super minions.

- Melee champions deal 20% increased damage against structures, if they adaptively have more ability power. *This buff is replaced by the generic time-based ARAM buff's bonus damage to structures once the latter exceeds 20%.*

 League of Legends content

Takedown

**Takedown** refers to a *kill* or *assist* being acceptable, with the type of enemy specified in each use case.

**Takedown** is associated with triggering a passive effect, or timed effects shortly after scoring.

 League of Legends content

Summoner's Rift

The newest and most venerated battleground is known as Summoner's Rift. Traverse down one of three different paths in order to attack your enemy at their weakest point. Work with your allies to siege the enemy base and destroy their Nexus!

**Regular Modes**

- Classic 5v5

- Custom

**Featured Game Modes**

- Doom Bots

- One For All

- Ultimate Spellbook

- Ultra Rapid Fire

 League of Legends content

| Wild Growth | COOLDOWN: 120 / 100 / 80 |
| --- | --- |

| **Active:** Lulu enchants herself or the target allied champion, knocking up surrounding enemies. |
| --- |
| The target remains enchanted for a few seconds, gaining  **bonus** health, size, and an aura that slows nearby enemies. |

 League of Legends content

| Eye of the Storm | COOLDOWN: 16 / 15 / 14 / 13 / 12 |
| --- | --- |

| **Passive:** Whenever Janna's abilities slow or knock up at least one enemy champion, she  refunds a portion of Eye of the Storm's cooldown. |
| --- |
| **Active:** **Janna** can target an allied champion, turret, or herself to place a shield that decays over a short time. |
| While the shield holds, the target gains  **bonus** attack damage. |

 League of Legends content

| Cultivation of War |   |
| --- | --- |

| **Innate:** Zaahen's basic attacks and abilities against enemy champions grant him stacks of *Determination*, refreshing on subsequent damage to champions and stacking up to 12 times. |
| --- |
| Periodically, if **Zaahen** would take lethal damage while at maximum stacks of *Determination*, he will enter resurrection for a short time, healing himself over the duration and then reviving himself. |
| **Determination:** For each stack, **Zaahen** gains  **bonus** attack damage, increased greatly while at maximum stacks. |
