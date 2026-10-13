Source: https://wiki.leagueoflegends.com/en-us/Movement_speed

> LoL wiki page "Movement speed" (revision 4064468), rendered HTML converted to Markdown by tools/extract/lol/mechanics.ts. Content © League of Legends Wiki contributors, CC BY-SA 3.0. Reference material for private research only.

# Movement speed

> *Also see: List of champions/Movement speed.*

**Movement speed** (also *Move speed*), or  **MS**, is a stat that represents the rate at which an entity travels across the map, measured in game-distance units traveled per second.

- *As a frame of reference, Teemo's hat is circa 100 game-distance units in diameter. A champion with 300 movement speed is able to traverse three Teemos standing hat-to-hat next to one another in one second.*

Each champion begins the game with a base amount of movement speed that ranges strictly from 325 (e.g. Anivia) to 355 (e.g. Master Yi). Some effects *innately* decrease or increase certain champions' own movement speed, such as Kled with 305 movement speed while dismounted.

This base movement speed can be increased by flat bonuses and percentage bonuses, or reduced by slows. These increases or decreases can be sourced from champion abilities, items, summoner spells, runes and buffs or debuffs.

## Calculations

A champion's total movement speed is given by the following formula:

> (Base MS + Flat MS bonuses) × (1 + Sum of all Additive Percent MS bonuses) × [ Product of (1 + each Multiplicative Movement Speed bonus) ] × (1 - Highest Slow ratio)

Add any flat bonuses to the champion's base movement speed; the total flat movement speed will be the baseline for the percentage bonuses. Add all additive percentage bonuses together, add 100% to the result, and multiply it with the total flat movement speed. Then, if applicable, apply the slow reduction and any special multiplicative bonuses one at a time. If the result is over 415 or under 220 movement speed, apply soft caps as described below.

### Movement speed caps

When the raw movement speed is greater than 415, there are two soft caps applied:

- The raw speed between 415 and 490 gets multiplied by 80%.

- The raw speed over 490 gets multiplied by 50%.

The two ranges have their reductions applied at the same time before being added back together.

> *As an example, if the calculated raw speed is 600 before soft caps kick in, it is reduced to (600 − 490) × 0.5 + (490 − 415) × 0.8 + 415 = 530, which means an **11.7% reduction of the raw movement speed.***

These are the simplified formulas:

- If the raw speed is 415 or lower, no cap is applied.

- If the raw speed is between 415 and 490, final speed is soft capped to (Raw MS) × 0.8 + 83.

- If the raw speed is above 490, final speed is soft capped to (Raw MS) × 0.5 + 230.

When the raw movement speed is less than 220 another two soft caps are used:

- If the raw speed is below 220, final speed is increased to 110 + (Raw MS) × 0.5.

- If the raw speed is below 0, final speed is increased to 110 + (Raw MS) × 0.01.

> *Example 1: If the calculated raw speed is 180 before soft caps kick in, it is increased to 180 × 0.5 + 110 = 200.*

> *Example 2: If the calculated raw speed is 0 before soft caps kick in, it is increased to 0 × 0.5 + 110 = 110.*

> *Example 3: If the calculated raw speed is -10000 before soft caps kick in, it is increased to -10000 × 0.01 + 110 = 10.*

Only the slow with the highest value is taken into account within movement speed calculations. All additional slows are ignored until the higher-valued slow wears off.

### Slow Resist

> *Main article: Slow resist*

Slow Resist is a statistic that reduces the strength of slows by a percentage.

> *Example: 50% Slow Resist reduces a 40% Slow to a 20% Slow. If it would normally reduce e.g. 400 raw speed to 400* × *(1 − 0.4) = 240 raw speed, because of the Slow Resist it reduces 400 raw speed to 400* × *(1 − 0.4 × (1 − 0.5)) = 320 raw speed. If the resulting raw values were beyond the soft cap thresholds, they would each be adjusted as usual.*

### Simple Example

***Last updated:** April 22nd, 2026, patch V26.08.*

Consider the following situation. Nocturne has Boots of Swiftness, Mercurial Scimitar, Winged Moonplate, and Stridebreaker. To calculate Nocturne's total movement speed when affected by all item actives, Duskbringer, and Singed's Mega Adhesive,

- Start with the base movement speed. Nocturne has 345 base movement speed. 345

- Apply flat movement speed bonuses. +55 flat movement speed bonus from Boots of Swiftness. 345 +  55 = 400

- Apply additive movement speed bonuses. +4% additive movement speed bonus from Winged Moonplate and +35% additive movement speed bonus from Stridebreaker. 400 × (1 + ( 0.04 +  0.35)) = 400 × 1.39 = 556

- Apply multiplicative movement speed bonuses. +40% multiplicative movement speed bonus from Duskbringer and +50% multiplicative movement speed bonus from Mercurial Scimitar. 556 × (1 +  0.40) × (1 +  0.50) = 556 × 2.10 = 1167.6

- Apply movement speed slows (affected by slow resists). +70% slow from Singed's Mega Adhesive and +25% slow resist from Boots of Swiftness. 1167.6 × (1 − ( 0.7 × (1 −  0.25))) = 1167.6 × 0.475 = 554.61

- Apply soft movement speed caps. 554.61 is greater than 490. 554.61 × 0.5 + 230 = 507.305

The resulting total movement speed is 507.305.

## Movement speed as scaling

These use the champion's personal movement speed to increase the magnitude of the item or ability. By building movement speed items or casting spells you can receive more benefit and power from these items or abilities in most situations. This also means that any slowing effects will have the inverse result.

### Items

- Swiftmarch

### Movement abilities

- Ambessa's Drakehound's Step (Affects the speed of the dash)

- Aurelion Sol's Astral Flight

- Aurora's The Weirding (The recoil speed is increased)

- Bel'Veth's Void Surge

- Braum's Stand Behind Me

- Camille's Wall Dive

- Corki's Valkyrie

- Garen's Decisive Strike (nudge speed is modified by movement speed, the time when the ability hits doesn't change)

- Irelia's Bladesurge

- K'Sante's Footwork

- Kindred's Dance of Arrows

- Kled's Jousting and Chaaaaaaaarge!!!

- Kalista's Martial Poise (dash distance increases with boots tier and dash speed with movement speed)

- Kayn's Reaping Slash

- Lee Sin's Resonating Strike and Safeguard

- Malphite's Unstoppable Force

- Nunu & Willump's Biggest Snowball Ever! (Nunu and Willump keep all increases in movement speed at time of cast for the duration of the charge)

- Qiyana's Terrashape and Audacity

- Rakan's Battle Dance

- Rammus' Soaring Slam (The range of the dash is affected)

- Rek'Sai's Tunnel

- Renekton's Slice and Dice

- Shen's Shadow Dash

- Sion's Unstoppable Onslaught

- Talon's Assassin's Path

- Urgot's Disdain

- Vayne's Tumble

- Warwick's Infinite Duress (The range and speed of the dash is affected)

- Yasuo's Sweeping Blade

- Zeri's Spark Surge

### Other

- Hecarim's Warpath

## Increasing flat movement speed

The bonus given by these items or champion abilities are flat increases to the champion's base movement speed. These flat bonuses will increase the effectiveness of percentage bonuses.

Purchasing boots from the store grants a champion a flat increase in movement speed. The bonus from boots is quite big compared to their cost and is essential for all champions.

*Gold Value*

- **Flat movement speed** has a gold value of 12 per point.

### Items

This table is automatically generated based on the data from Module:ItemData/data.

| Item | Cost | Amount | Availability |
| --- | --- | --- | --- |
| Armored Advance Armored Advance | 1200 | 45 | Classic Summoner's Rift 5v5 |
| Berserker's Greaves Berserker's Greaves | 1100 | 45 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Boots Boots | 300 | 25 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Boots of Swiftness Boots of Swiftness | 1000 | 55 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Chainlaced Crushers Chainlaced Crushers | 1250 | 45 | Classic Summoner's Rift 5v5 |
| Crimson Lucidity Crimson Lucidity | 900 | 45 | Classic Summoner's Rift 5v5 |
| Ghostcrawlers Ghostcrawlers | 500 | 70 | Arena |
| Gluttonous Greaves Gluttonous Greaves | 1000 | 45 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Gunmetal Greaves Gunmetal Greaves | 1100 | 45 | Classic Summoner's Rift 5v5 |
| Immortal Path Immortal Path | 1000 | 45 | Classic Summoner's Rift 5v5 |
| Ionian Boots of Lucidity Ionian Boots of Lucidity | 900 | 45 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Jarvan I's Jarvan I's | 0 | 100 | ARAM: Mayhem |
| Mercury's Treads Mercury's Treads | 1250 | 45 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Plated Steelcaps Plated Steelcaps | 1200 | 45 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Slightly Magical Boots Slightly Magical Boots | 0 | 25 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Sorcerer's Shoes Sorcerer's Shoes | 1100 | 45 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Spellslinger's Shoes Spellslinger's Shoes | 1100 | 45 | Classic Summoner's Rift 5v5 |
| Swiftmarch Swiftmarch | 1000 | 65 | Classic Summoner's Rift 5v5 |
| Talisman of Ascension Talisman of Ascension | 0 | 0 | Arena |

#### Item passives

- Bandlepipes

- Black Cleaver

- Cosmic Drive

- Dead Man's Plate

- Phage

- Trinity Force

- Youmuu's Ghostblade

### Champion abilities

- Akshan's Dirty Fighting and Going Rogue

- Elise's Spider Form

- Gnar's Rage Gene

- Jayce's Hextech Capacitor

- Kled's Skaarl the Cowardly Lizard and Chaaaaaaaarge!!!

- Lucian's Ardent Blaze

- Miss Fortune's Strut

- Nami's Surging Tides

- Nunu's Biggest Snowball Ever!

- Rek'Sai's Burrow

- Rell's Ferromancy: Crash Down

- Singed's Insanity Potion

- Sion's Unstoppable Onslaught

- Sivir's Fleet of Foot

- Vayne's Night Hunter

### Runes

- Relentless Hunter

- Waterwalking

- Magical Footwear

## Increasing percentage movement speed

The bonus movement speed given by these items or champion abilities are based on a percentage of the bonus compared to your total flat movement speed (before all sources of percentage movement speed bonuses are factored in). Percentage movement speed will stack additively with other sources of percentage movement speed, unless the bonus movement speed is one of the few exceptions that stack multiplicatively.

All percentage bonuses from the items listed below stack additively with one another.

*Gold Value*

- **Percent movement speed** has a gold value of 65.105 per point.

### Items

This table is automatically generated based on the data from Module:ItemData/data.

| Item | Cost | Amount | Availability |
| --- | --- | --- | --- |
| Aether Wisp Aether Wisp | 900 | 4% | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Ardent Censer Ardent Censer | 2200 | 4% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Cosmic Drive Cosmic Drive | 3000 | 4% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Darksteel Talons Darksteel Talons | 0 | 5% | Arena |
| Dead Man's Plate Dead Man's Plate | 2900 | 4% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Decapitator Decapitator | 0 | 8% | Arena |
| Fiendhunter Bolts Fiendhunter Bolts | 2650 | 4% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Force of Nature Force of Nature | 2800 | 4% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Fulmination Fulmination | 0 | 15% | Arena |
| Galeforce Galeforce | 0 | 6% | Arena |
| Gambler's Blade Gambler's Blade | 0 | 8% | Arena |
| Gargoyle Stoneplate Gargoyle Stoneplate | 0 | 10% | Arena |
| Hexbolt Companion Hexbolt Companion | 0 | 4% | Arena |
| Hullbreaker Hullbreaker | 3000 | 4% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Kraken Slayer Kraken Slayer | 3000 | 4% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Lich Bane Lich Bane | 2900 | 6% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Lifeline Lifeline | 1600 | 4% | Nexus Blitz, All Random All Mid |
| Lightning Rod Lightning Rod | 0 | 8% | Arena |
| Mirage Blade Mirage Blade | 0 | 6% | Arena |
| Navori Flickerblade Navori Flickerblade | 2650 | 4% | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Perplexity Perplexity | 2500 | 5% | Arena |
| Phantom Dancer Phantom Dancer | 2650 | 10% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Rapid Firecannon Rapid Firecannon | 2650 | 4% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Reaper's Toll Reaper's Toll | 0 | 5% | Arena |
| Rectrix Rectrix | 775 | 4% | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Regicide Regicide | 0 | 8% | Arena |
| Runaan's Hurricane Runaan's Hurricane | 2650 | 5% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Runecarver Runecarver | 0 | 4% | Arena |
| Shurelya's Battlesong Shurelya's Battlesong | 2200 | 4% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Spectral Cutlass Spectral Cutlass | 2800 | 4% | Nexus Blitz, Arena, All Random All Mid |
| Statikk Shiv Statikk Shiv | 3000 | 4% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Stormsurge Stormsurge | 2800 | 6% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Talisman of Ascension Talisman of Ascension | 0 | 0% | Arena |
| The Golden Spatula The Golden Spatula | 0 | 10% | ARAM: Mayhem, Arena |
| Winged Moonplate Winged Moonplate | 800 | 4% | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Youmuu's Ghostblade Youmuu's Ghostblade | 2800 | 4% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Zeal Zeal | 1200 | 4% | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Zephyr Zephyr | 2500 | 10% | Arena |

#### Item actives and passives

- Crimson Lucidity

- Elixir of Iron (allies only)

- Experimental Hexplate

- Force of Nature

- Gustwalker Hatchling

- Mejai's Soulstealer

- Protoplasm Harness

- Shurelya's Battlesong

- Solstice Sleigh

- Stormrazor

- Stridebreaker

- Youmuu's Ghostblade

### Champion abilities

#### Ally and/or User-targeted

- Annie's Molten Shield

- Bard's Caretaker's Shrine

- Gangplank's Cannon Barrage with Raise Morale

- Hwei's Fleeting Current

- Janna's Tailwind

- Jayce's Acceleration Gate

- Karma's Inspire and Defiance

- Kayle's Celestial Blessing

- Kled's Chaaaaaaaarge!!! *

- Lulu's Whimsy

- Milio's Warm Hugs

- Naafiri's The Call of the Pack *

- Nilah's Jubilant Veil

- Nunu's Call of the Freljord

- Orianna's Command: Dissonance

- Renata Glasc's Bailout

- Senna's Curse of the Black Mist

- Seraphine's Surround Sound

- Sivir's On the Hunt

- Soraka's Astral Infusion with Starcall

- Sona's Song of Celerity

- Yuumi's Zoomies

- Zilean's Time Warp

#### User only

- Aatrox's World Ender

- Ahri's Fox-Fire

- Akali's Assassin's Mark and Twilight Shroud

- Akshan's Avengerang

- Aphelios' Onslaught

- Aurora's Across the Veil and Between Worlds

- Bard's Traveler's Call

- Blitzcrank's Overdrive

- Braum's Unbreakable

- Briar's Blood Frenzy

- Camille's Precision Protocol

- Cassiopeia's Noxious Blast

- Dr. Mundo's Maximum Dosage

- Draven's Blood Rush

- Ekko's Z-Drive Resonance

- Evelynn's Whiplash

- Fiora's Duelist's Dance and Grand Challenge

- Fizz's Playful

- Gangplank's Trial by Fire

- Garen's Decisive Strike

- Gnar's Hyper

- Heimerdinger's Hextech Affinity

- Janna's Zephyr

- Jhin's Whisper

- Jinx's Get Excited!

- Kai'Sa's Supercharge

- Katarina's Preparation

- Kayle's Divine Ascent

- Kennen's Lightning Rush

- Kha'Zix's Void Assault

- Kled's Jousting

- Kog'Maw's Icathian Surprise

- Lillia's Prance

- Locke's Soul Ignition

- Malphite's Seismic Shard

- Maokai's Nature's Grasp

- Master Yi's Highlander

- Mel's Rebuttal

- Mordekaiser's Darkness Rise

- Morgana's Soul Shackles

- Neeko's Shapesplitter

- Nidalee's Prowl

- Nocturne's Unspeakable Horror

- Olaf's Ragnarok

- Pantheon's Empowered Aegis Assault

- Poppy's Steadfast Presence

- Pyke's Ghostwater Dive

- Qiyana's Elemental Wrath with **Brush** and Terrashape with an *Element*

- Quinn's Heightened Senses

- Rakan's The Quickness

- Rell's Ferromancy: Mount Up and Full Tilt

- Rengar's Unseen Predator and Thrill of the Hunt

- Rumble's Scrap Shield

- Ryze's Overload

- Samira's Daredevil Impulse

- Senna's Relic Cannon

- Sett's Looking for a Fight

- Shyvana's Inferno Aegis

- Singed's Noxious Slipstream

- Sion's Death Surge

- Skarner's Impale

- Smolder's Flap, Flap, Flap

- Soraka's Salvation and Starcall

- Tahm Kench's Devour

- Talon's Shadow Assault

- Taliyah's Rock Surfing

- Teemo's Move Quick

- Trundle's Frozen Domain

- Twitch's Ambush

- Udyr's Blazing Stampede

- Viego's Sovereign's Domination and Harrowed Path

- Viktor's Augment: Turbocharge

- Vladimir's Transfusion and Sanguine Pool

- Volibear's Thundering Smash

- Warwick's Blood Hunt

- Wukong's Cyclone

- Xayah's Deadly Plumage

- Yone's Soul Unbound

- Yorick's Mourning Mist

- Yunara's Kanmei's Steps

- Zac's Let's Bounce!

- Zeri's Lightning Crash

- Zoe's Spell Thief

### Summoner spells

- Ghost

### Runes

- Celerity

- Fleet Footwork

- Nimbus Cloak

- Stormraider's Surge

### Neutral Buffs

- Cloudbringer's Grace

- Cloud Dragon Soul

- Homeguard and Homestart

- Speed Shrine

### Other

- Cloud Rift speed zones

- Jungle Quest

## Multiplicative speed boosts

Most speed boosts stack additively, but a select few stack multiplicatively with other speed boosts. These do not stack additionally with other percentage movement speed bonus, but rather multiply the **total** movement speed after all other percentage movement speed have been calculated. Movement speed obtained thanks to the formula is still affected by movement speed caps (see above).

### Items

- Mercurial Scimitar

### Champions

- Hecarim's Devastating Charge

- Kayn's Shadow Step and Shadow Assassin's Shadow Step

- Nocturne's Duskbringer

- Quinn's Behind Enemy Lines

- Rammus' Powerball

### Runes

- Approach Velocity

### Summoner spells

- Heal

- Unleashed Teleport

### Other

- Hand of Baron (affects nearby Melee minions and Super minions only)

## Decreasing movement speed

There are many ways to decrease a champion's movement speed, with the most usual one being through champion abilities. For a full list of slows, see Types of Crowd Control/Sources#Slow.

Movement speed can also be decreased by negative buff values (e.g. by having a negative stat scaling with it) down to 0 (ignoring the  110 movement speed floor that slows have) down to 0, at which point the unit will not move at all. Movement speed cannot be reduced below 0 in any way.

## Base movement speeds by champion

| Movement Speed | Champion |
| --- | --- |
| 355 | Master Yi |
| 350 | Illaoi Jax Nasus Olaf Shyvana Trundle Udyr |
| 345 | Aatrox Akali Cho'Gath Diana Dr. Mundo Fiora Gangplank Hecarim Kha'Zix Kled & Skaarl Lee Sin Nocturne Nunu & Willump Pantheon Poppy Renekton Rengar Rumble Shaco Singed Sion Tryndamere Viego Xin Zhao Yasuo Yone Zaahen Zed |
| 340 | Aurelion Sol Bel'Veth Brand Briar Camille Darius Ekko Galio Garen Graves Gwen Heimerdinger Jarvan IV Kayn LeBlanc Locke Naafiri Neeko Nilah Rek'Sai Riven Ryze Sejuani Sett Shen Sylas Taric Veigar Vel'Koz Vi Volibear Wukong Xerath Yorick Zac Zoe Zyra |
| 335 | Alistar Ambessa Amumu Annie Aurora Bard Braum Cassiopeia Evelynn Fiddlesticks Fizz Gnar ( level 1) Irelia Jayce Kai'Sa Karma Karthus Kassadin Katarina Kayle Kennen Leona Lucian Malphite Malzahar Maokai Mega Gnar Mordekaiser Morgana Nami Nidalee Ornn Qiyana Rakan Rammus Samira Sivir Skarner Tahm Kench Talon Vex Viktor Warwick Zilean |
| 330 | Ahri Akshan Azir Draven Elise ( Human) Gragas Hwei Ivern Jhin K'Sante Kalista Kog'Maw Lillia Lulu Lux Mel Milio Pyke Quinn Renata Glasc Senna Seraphine Smolder Swain Syndra Taliyah Teemo Thresh Twisted Fate Twitch Urgot Varus Vayne Vladimir Xayah Yuumi Zeri |
| 325 | Anivia Aphelios Ashe Blitzcrank Caitlyn Corki Ezreal Janna Jinx Kindred Lissandra Miss Fortune Nautilus Orianna Sona Soraka Tristana Yunara Ziggs |
| 315 | Rell |
| 305 | Kled |

## Old slow stacking

**Since patch V5.13, units can only be affected by the highest slow value during its effect. Any applied slows that have a lower potency do not further affect the slow amount.**

Prior to patch V5.13 slow stacked:

Slowing effects followed particular rules when stacking:

- If a champion was affected by multiple slows, the strongest one would be fully applied, while the others were applied sequentially with **65% reduced effectiveness** down to 35% of its original strength.

- Slow effects derived from items with the same name or named item effect did **NOT** stack, even when coming from different champions. Only the strongest item slow was applied at any moment. The exception to this was the active effect of Randuin's Omen which stacked with other slowing items normally, because they were considered champion abilities for slow stacking purposes.

- Attacking a champion with the Crest of Cinders buff when the target was already affected by that slow would reapply the debuff, resetting its duration. It would **NOT** increase the slow amount. The same held true for the Exhaust summoner spell.

#### Example

A champion with a raw movement speed of 400 was affected by a 2 second long 40% slow and a 5 second long 20% slow at the same time.

- For the first two seconds, they would have (1 − 0.4) × (1 − 0.2 × 0.35) = 0.6 × 0.93 = 55.8% of his original movement speed (a 44.2% effective slow). So he would have 400 × 0.558 = 223.2 raw movement speed.

- For the following three seconds, the effective slow would be 20% and so he would have 400 × 0.8 = 320 movement speed.

- After that, he would return to his normal speed of 400.

## Trivia

- The old stat icon for **movement speed** was an edited version of the icon of Boots of Speed.

***Last updated:** January 8th, 2020, patch V10.1*

- Without using Gathering Storm or Prototype: Omnistone, the highest **movement speed** attainable is about **47959** as Rammus at level 18.

- **Base stats:** 335 movement speed

- **Runes:**

  - Predator

  - Relentless Hunter

  - Approach Velocity

  - Magical Footwear

- **Items:**

  - 1 Mercurial Scimitar **activated**

  - 1 Righteous Glory **activated**

  - 1 Youmuu's Ghostblade **activated**

  - 1 Boots of Mobility

  - 1 Spellbinder activated

  - 1 Shurelya's Reverie activated

- **Buffs:**

  - * Rammus will need to have Nami, Kayle, Lulu and Zilean alongside him.*

  - Rammus' Powerball

  - Nami's Tidal Wave to proc Surging Tides

  - Kayle's Celestial Blessing

  - Lulu's Whimsy

  - Zilean:

    - Shurelya's Reverie active

    - Has to have impaired movement to proc Approach Velocity.

    - Guardian

    - Time Warp

  - Homeguard **empowered by** Hand of Baron

  - Heal

  - Ghost

  - Four Infernal Might buffs.

- Must be out of combat for Boots of Mobility and Youmuu's Ghostblade passive.

- Nami, Kayle, and Lulu:

  - **Runes:**

    - Conqueror **at 10 stacks**

    - Presence of Mind **at 500 mana**

    - Absolute Focus

    - Waterwalking

  - **Items:**

    - 3 Rabadon's Deathcap

    - 1 Spellbinder **activated at 100 stacks**

    - 1 Mejai's Soulstealer **at 25 stacks**

    - 1 Seraph's Embrace

- **Relevant mathematics:**

- Nami's AP:

  - **Items** = 120 × 3 + 200 + 145 + 146.246 = 851.246 AP

    - Seraph's Embrace's AP = 50 + ( 1108.2 + 200 + 500 + 1400) × 0.03 = 146.246 AP

  - **Runes** = 30 + 30 + 50 = 110 AP

  - **Buffs** = 80 + 50 = 130 AP

  - **AP Multiplier** = 1 + 0.4 + 0.16 = 1.56

    - Nami's AP = (851.246 + 110 + 130) × 1.56 = **1702.24 AP**

    - Surging Tides' bonus MS = 120 + 0.4 × 1624.34 = **800.896 flat movement speed**

- Kayle's AP:

  - **Items** = 120 × 3 + 200 + 145 + 137 = 842 AP

    - Seraph's Embrace's AP = 50 + ( 800 + 200 + 500 + 1400) × 0.03 = 137 AP

  - **Runes** = 30 + 30 + 50 = 110 AP

  - **Buffs** = 80 + 50 = 130 AP

  - **AP Multiplier** = 1 + 0.4 + 0.16 = 1.56

    - Kayle's AP = (842 + 110 + 130) × 1.56 = **1687.92 AP**

    - Celestial Blessing's bonus MS = 40% + (1687.92 × 8 / 100)% = **175.034% bonus movement speed**

- Lulu's AP:

  - **Items** = 120 × 3 + 200 + 145 + 151.55 = 856.55 AP

    - Seraph's Embrace's AP = 50 + ( 1285 + 200 + 500 + 1400) × 0.03 = 151.55 AP

  - **Runes** = 30 + 30 + 50 = 110 AP

  - **Buffs** = 80 + 50 = 130 AP

  - **AP Multiplier** = 1 + 0.4 + 0.16 = 1.56

    - Lulu's AP = (856.55 + 110 + 130) × 1.56 = **1710.62 AP**

    - Whimsy's bonus = 30% + (1710.62 × 5 / 100)% = **115.531% bonus movement speed**

- Rammus' movement speed:

  - **Base** = 335

  - **Items** = 115 + 75% + (40 + 20%) + 60% + 60 = 215 flat movement speed + 155% **bonus** movement speed

  - **Runes** = 67.5%* + 55 + 15% + 10 = 65 flat movement speed + 82.5% **bonus** movement speed

  - **Buffs** = 800.896 + 175.034% + 115.531% + 40% + 20% + 99% + 200% + 45% = 800.896 flat movement speed + 694.565% **bonus** movement speed

  - **Total Movement Speed Multiplier** = 3.35 ×  1.5 ×  1.3 = 6.5325

    - Rammus' Movement Speed = (215 + 65 + 800.896 + 335) × (1 + 1.55 + 0.825 + 6.94565) × 6.5325 = **95,459.2073 movement speed** before soft caps

- **Soft caps:**

  - Rammus' Movement Speed = 95,459.2073 × 0.5 + 230 = **47,959.6034 movement speed**

### Infinite MS Theory

There is a theory that allow 2 players, one from each team, to reach infinite amount of movement speed. It require the same set-up as seen just before, twice, each per team, but with a Malphite replacing the Rammus. The theory is simple: **Team 1** speeds up **Malphite 1**, and as soon as he reaches his highest amount **Malphite 2** steals **Malphite 1** movement speed with Seismic Shard, and get speeds up by **Team 2**. Then as soon as he reaches his highest amount **Malphite 1** steals **Malphite 2** movement speed with Seismic Shard and get speeds up by **Team 1**. Repeat the operation an infinite amount of time and in the end **Malphite 1** or **Malphite 2** will have an infinite amount of movement speed. As seen in this video.

## See also

League of Legends Wiki | Lists of champions

 League of Legends content

| Dismounted |   |
| --- | --- |

| **Innate:** While **Dismounted**, ** Kled** suffers all damage taken and is vulnerable to death. **Kled's** base health cannot be improved through any means, his movement speed is reduced, and his basic attacks against champions deal less physical damage. However, **Kled** gains a large amount of **bonus** movement speed when facing visible enemy champions,  **bonus** armor and  **bonus** magic resistance, and he has the ability to restore ** Skaarl's** Courage to * mount* again. |
| --- |
| **Courage:** Kled gains a large amount of Courage by basic attacking champions and a small amount when killing minions, or attacking structures or epic monsters. At 100 Courage, ** Skaarl** returns and **Kled** becomes **Mounted**. **Kled's** own health is preserved through re-mounting. |
| Entering the fountain will always restore Courage and return ** Skaarl**. Outside of the fountain, **Kled** cannot gain Courage for 30 seconds after re-mounting. |

 League of Legends content

Slow

A unit that is *slowed* has reduced  movement speed for the duration. *Slows* based on a percentage value cannot reduce a target below  110 movement speed. Some *slows* will instead modify the target's movement speed to a static value, which may not be further reduced nor increased.

Only the slow with the highest value is taken into movement speed calculations. All additional slows are ignored until the higher-valued slow wears off. The strength of slows may amplify or decay over their duration. Slows of the same debuff cannot stack and will instead refresh on each application unless otherwise stated.

Negative *slow* values will increase the unit's movement speed instead.

| Interrupts: | Does not interrupt any actions. |
| --- | --- |
| Reduction: | The **duration** is affected by Tenacity.The **strength** is reduced by slow resist. |
| Resist: | Resisted by crowd control immunity and slow immunity. |
| Removal: | Removed by Cleanses, Garen's Decisive Strike, Master Yi's Highlander and Nunu's Biggest Snowball Ever!. |

 League of Legends content

| Duskbringer | COOLDOWN: 8 |
| --- | --- |

| **Active:** Nocturne casts out a shadow blade in the target direction that leaves a *Dusk Trail* in its wake, dealing physical damage to enemies hit. Enemy champions hit will leave a *Dusk Trail* in their wake for a few seconds. |
| --- |
| While on the *Dusk Trail*, Nocturne is ghosted and gains  **bonus** movement speed and  **bonus** attack damage. |

 League of Legends content

| Mega Adhesive | COOLDOWN: 17 / 16 / 15 / 14 / 13 |
| --- | --- |

| **Active:** Singed creates a field of adhesive at the target location for a short time that grounds and slows enemies within. |
| --- |

 League of Legends content

| Drakehound's Step |   |
| --- | --- |

| **Innate:** During any of Ambessa's ability lockouts, the player may right-click to select a location or target to dash toward after the lockout ends. An indicator appears on the ground denoting the direction and destination location. |
| --- |
| **Innate:** Casting an ability generates a stack of *Medarda Maxim* for a few seconds, up to 3 stacks. Basic attacks consume one stack to become empowered. |
| **Medarda Maxim:** **Ambessa's** next basic attack gains  range,  **bonus** attack speed, deals **bonus** physical damage, and restores  energy. |

 League of Legends content

| Astral Flight | COOLDOWN: 22 / 20 / 18 / 16 / 14 |
| --- | --- |

| **Active:** Aurelion Sol flies in the target direction. During flight, he can cast any of his abilities, and * Breath of Light* has no  cooldown, no maximum channel duration, and its flat damage is increased. Aurelion Sol flies at a reduced speed while channeling * Breath of Light*. |
| --- |
| *Astral Flight* can be recast during flight, and does so automatically upon arrival. |
| **Recast:** Aurelion Sol ends *Astral Flight*. |
| Scoring a champion takedown within 3 seconds of damaging them refunds a large portion of *Astral Flight's*  cooldown. |

 League of Legends content

| The Weirding | COOLDOWN: 15 / 14 / 13 / 12 / 11 |
| --- | --- |

| **Active:** Aurora blasts energy and recoils backward. The blast deals magic damage to enemies hit and slows them for a moment. |
| --- |

 League of Legends content

| Void Surge | COOLDOWN: 4 / 3.25 / 2.5 / 1.75 / 1 |
| --- | --- |

| **Active:** Bel'Veth dashes in the target direction, though not through terrain, dealing physical damage to enemies she passes through. |
| --- |
| *Void Surge* can be cast only within a cardinal direction that is off cooldown, each direction has a unique  cooldown that scales down with her  **bonus** attack speed. |
| *Void Surge's* damage against the first enemy hit can critically strike and applies on-hit effects and  life steal. |

 League of Legends content

| Stand Behind Me | COOLDOWN: 12 / 11 / 10 / 9 / 8 |
| --- | --- |

| **Active:** Braum dashes to a target allied champion or minion. On arrival, both of them gain  armor and  magic resistance for a few seconds. |
| --- |

 League of Legends content

| Hookshot | COOLDOWN: 16 / 15 / 14 / 13 / 12 |
| --- | --- |

| **Active:** Camille fires a grapple, dashing onto any terrain she hits and briefly perching onto it. |
| --- |
| While perched, she gains the ability to cast * Wall Dive*. |

| Wall Dive |   |
| --- | --- |

| **Active:** Camille dashes, dealing physical damage to enemies near the landing location. Dash range is doubled towards enemy champions. |
| --- |
| Upon colliding with an enemy champion, she knocks back and stuns all nearby enemy champions, gaining  **bonus** attack speed. |

 League of Legends content

| Valkyrie | COOLDOWN: 20 / 18 / 16 / 14 / 12 |
| --- | --- |

| **Active:** Corki flies a short distance to the target location, dropping bombs that create a trail of fire that deals magic damage continually to enemies within. |
| --- |

 League of Legends content

| Decisive Strike | COOLDOWN: 8 |
| --- | --- |

| **Active:** Garen gains  **bonus** movement speed and cleanses from slows. |
| --- |
| His next basic attack will lunge and deal **bonus** physical damage, silencing the target. |

 League of Legends content

| Bladesurge | COOLDOWN: 10 / 9 / 8 / 7 / 6 |
| --- | --- |

| **Active:** Irelia dashes through the target enemy, dealing physical damage, applying on-hit effects, and healing herself. |
| --- |
| If this attack kills the target, the cooldown is  reset. Whenever a mark is consumed, the cooldown is  reduced. |

 League of Legends content

| Footwork | COOLDOWN: 10 / 9.5 / 9 / 8.5 / 8 |
| --- | --- |

| **Active:** K'Sante dashes, granting himself a shield. |
| --- |
| If cast toward an ally, *Footwork* has increased range and can dash through terrain. If the ally is a champion, they also receive the shield. |
| ** All Out Bonus:** *Footwork's* dash speed and location range are increased, and it can dash through terrain. |

 League of Legends content

| Dance of Arrows | COOLDOWN: 9 |
| --- | --- |

| **Active:** Lamb dashes toward the target location, gaining  **bonus** attack speed for a few seconds. She then fires at up to three nearby enemies, dealing physical damage. |
| --- |
| This cooldown is  reduced by casting * Wolf's Frenzy* or using *Dance of Arrows* within its area. |

 League of Legends content

| Jousting | COOLDOWN: 13 / 12 / 11 / 10 / 9 |
| --- | --- |

| **Active:** ** Skaarl** dashes in the target direction, dealing physical damage to enemies she passes through and marking enemy champions hit. The mark reveals the target for a short time, during which *Jousting* can be recast. |
| --- |
| **Recast:** ** Skaarl** consumes the mark to dash through the marked target. |

 League of Legends content

| Chaaaaaaaarge!!! | COOLDOWN: 140 / 125 / 110 |
| --- | --- |

| **Active:** **Kled** & ** Skaarl** become ghosted and unstoppably charge to a location, building up  **bonus** movement speed and shield and leaving a draft in their wake that grants *Mr. Kled's Wild Ride* to allies that follow the draft. |
| --- |
| ** Skaarl** dashes to the first enemy champion encountered, knocking them back, and dealing magic damage based on travel time. |
| **Mr. Kled's Wild Ride:** Gain a large amount of  movement speed. |

 League of Legends content

| Martial Poise |   |
| --- | --- |

| **Innate:** During each basic attack or casting of * Pierce*, Kalista can optionally choose a target direction to quickly dash to. The range is based on dash angle and **Kalista's** Boots tier. The dash speed scales with **bonus** attack speed and movement speed effects. |
| --- |
| **Innate - Oathsworn Bond:** **Kalista** begins the game with an exclusive Black Spear. |

 League of Legends content

| Reaping Slash | COOLDOWN: 7 / 6.5 / 6 / 5.5 / 5 |
| --- | --- |

| **Active:** Kayn dashes in the target direction, dealing physical damage to enemies he passes through. He then swings his scythe, dealing the same damage to surrounding enemies. |
| --- |
| **Darkin Slayer Bonus:** *Reaping Slash* deals damage based on the target's **maximum** health. |

 League of Legends content

| Sonic Wave | COOLDOWN: 10 / 9 / 8 / 7 / 6 |
| --- | --- |

| **Active:** Lee Sin fires a sonic blast in the target direction that deals physical damage to the first enemy hit and marks them for a short time, during which they are revealed. |
| --- |
| While the target is marked, **Lee Sin** can cast * Resonating Strike*. |

| Resonating Strike |   |
| --- | --- |

| **Active:** Lee Sin dashes to the nearby enemy marked by * Sonic Wave*, consuming the mark upon arrival to deal physical damage based on the target's **missing** health. |
| --- |

 League of Legends content

| Safeguard | COOLDOWN: 7 |
| --- | --- |

| **Active:** Lee Sin dashes to the target allied unit. If the ally is a champion, both they and **Lee Sin** gain a shield for a short time upon his arrival and *Safeguard's* cooldown is  halved. **Lee Sin** can self-cast *Safeguard* to shield himself. |
| --- |
| After *Safeguard* is cast, **Lee Sin** can cast * Iron Will* within a short time. |

| Iron Will |   |
| --- | --- |

| **Active:** Lee Sin gains  omnivamp for a few seconds. |
| --- |

 League of Legends content

| Unstoppable Force | COOLDOWN: 130 / 115 / 100 |
| --- | --- |

| **Active:** Malphite dashes with displacement immunity to the target location. Upon arrival, he deals magic damage to nearby enemies and briefly knocks them up. |
| --- |
| ** displacement immunity:** The dash cannot be deterred by crowd control. |

 League of Legends content

| Biggest Snowball Ever! | COOLDOWN: 14 |
| --- | --- |

| **Active:** Willump becomes slow-immune and ghosted, and channels for a long duration to create a snowball that grows in size and speed. **Willump** can gradually steer the snowball during this time. |
| --- |
| When hitting minions and small monsters, the snowball rolls over them, dealing magic damage. When hitting an enemy champion, large monster or terrain, the snowball instead explodes, dealing magic damage to nearby enemies, and briefly knocking them up then stunning them based on the snowball's size. *Biggest Snowball Ever!* can be recast during the channel, and does so automatically afterwards or if interrupted. |
| **Recast:** **Willump** ends the channel and manually releases the snowball. |

 League of Legends content

| Terrashape | COOLDOWN: 7 |
| --- | --- |

| **Passive:** While holding an Element, Qiyana gains **bonus**  attack speed and  attack range, as well as **bonus** magic damage on her basic attacks and basic abilities. **Qiyana** gains  **bonus** movement speed speed while moving near the current Element. |
| --- |
| **Active:** **Qiyana** dashes in the target direction to gather the Element of the nearest **Brush**, **River** or **Terrain** she targeted. |

 League of Legends content

| Audacity | COOLDOWN: 11 / 10 / 9 / 8 / 7 |
| --- | --- |

| **Active:** Qiyana dashes toward the target enemy and deals physical damage upon arrival. |
| --- |

 League of Legends content

| Battle Dance | COOLDOWN: 20 / 18 / 16 / 14 / 12 |
| --- | --- |

| **Passive:** Rakan can cast or re-cast *Battle Dance* at an increased  range when targeting Xayah. |
| --- |
| **Active:** **Rakan** shields the target allied champion for a short time, then dashes to them. *Battle Dance* can be recast once with no cost. |
| **Recast:** **Rakan** mimics the first cast. |

 League of Legends content

| Soaring Slam | COOLDOWN: 120 / 105 / 90 |
| --- | --- |

| **Active:** Rammus leaps to the target location with Cc-immunity, dealing magic damage to nearby enemies and briefly slowing them. |
| --- |
| *Soaring Slam* gains increased  range based on **Rammus'**  movement speed. **Rammus** can cast this ability during * Powerball*, which will additionally knock up enemies in the epicenter. |
| *Soaring Slam's* damage affects structures and is doubled against turrets. |
| ** Cc-immunity**: Crowd control cannot be applied during this time. |

 League of Legends content

| Tunnel | COOLDOWN: 18 / 17 / 16 / 15 / 14 |
| --- | --- |

| **Active:** Rek'Sai dashes in the target direction and creates a *Tunnel* in her wake that lasts for a while. **Rek'Sai** can travel through the *Tunnel* in either direction, which becomes disabled afterwards for a few seconds. |
| --- |
| **Rek'Sai** cannot enter a tunnel while immobilized, grounded, or silenced. Enemy champions can stand on a *Tunnel* to destroy it and gain gold. |

 League of Legends content

| Slice and Dice | COOLDOWN: 16 / 14.5 / 13 / 11.5 / 10 |
| --- | --- |

| **Active - Slice:** Renekton dashes in the target direction, dealing physical damage to enemies he passes through. |
| --- |
| If he hits an enemy, he can recast *Slice and Dice* within the next few seconds. |
| **Recast - Dice:** **Renekton** dashes in the target direction, dealing physical damage to enemies he passes through. |
| ** Reign of Anger Bonus:** *Dice*, the recast, deals additional damage and  reduces enemy armor for a few seconds. |

 League of Legends content

| Shadow Dash | COOLDOWN: 18 / 16 / 14 / 12 / 10 |
| --- | --- |

| **Passive:** Dealing damage with * Twilight Assault* or *Shadow Dash* will restore  energy. |
| --- |
| **Active:** Shen dashes to the target location, briefly taunting enemy champions and monsters he passes through and dealing physical damage based on his **bonus** health. |

 League of Legends content

| Unstoppable Onslaught | COOLDOWN: 140 / 100 / 60 |
| --- | --- |

| **Active:** Sion becomes Cc-immune and ghosted, and charges forward for a period, gradually gaining **bonus** movement speed. **Sion's** charge may end upon colliding with an enemy, causing him to slam the ground around him to deal physical damage to enemies hit based on charge time. |
| --- |
| **Sion** can steer himself during the charge, but will slam upon hitting an enemy champion or terrain; crashing into terrain will briefly stun him. *Unstoppable Onslaught* can be recast within the duration, and automatically does so afterwards. |
| **Recast:** **Sion** lunges forward and slams the ground beneath him, dealing physical damage and slowing nearby enemies. Closer enemies are also briefly pulled and stunned based on the charge time. |
| ** Cc-immunity**: Crowd control cannot be applied during this time. |

 League of Legends content

| Assassin's Path | COOLDOWN: 2 |
| --- | --- |

| **Active:** Talon vaults over the target terrain. |
| --- |
| **Talon** cannot cast *Assassin's Path* on the same area for a set duration. |

 League of Legends content

| Disdain | COOLDOWN: 16 / 15.5 / 15 / 14.5 / 14 |
| --- | --- |

| **Active:** Urgot shields himself for a few seconds and dashes in the target direction, dealing physical damage and briefly stunning enemies hit, knocking them aside. |
| --- |
| **Urgot** will stop upon hitting an enemy champion, briefly stunning and flinging them over. |
| *Neither **Urgot's** dash nor the fling cross terrain.* |

 League of Legends content

| Tumble | COOLDOWN: 6 / 5 / 4 / 3 / 2 |
| --- | --- |

| **Active:** Vayne dashes in the target direction. Her next basic attack within a few seconds will deal **bonus** physical damage. |
| --- |

 League of Legends content

| Infinite Duress | COOLDOWN: 110 / 90 / 70 |
| --- | --- |

| **Active:** Warwick leaps a huge distance toward the target direction, stopping on the first champion he collides with, suppressing them while he channels for a brief time. He mauls them over the duration, dealing magic damage and  healing for 100% of the damage dealt. *Infinite Duress* applies on-hit effects and  life steal, as well as triggers on-attack effects, 3 times. |
| --- |
| The leap's range scales with **Warwick's**  movement speed and he gains cc-immunity during it. |
| ** Cc-immunity**: Crowd control cannot be applied during this time. |

 League of Legends content

| Sweeping Blade | TARGET IMMUNITY: 10 / 9 / 8 / 7 / 6 |
| --- | --- |

| **Active:** Yasuo dashes in the target enemy's direction, dealing magic damage, briefly becoming ghosted, and generating a stack of *Ride the Wind* for a few seconds, stacking up to a cap. |
| --- |
| *Sweeping Blade* cannot be cast on the same target for a period. |
| **Ride the Wind:** Each stack increases *Sweeping Blade's* damage. |

 League of Legends content

| Spark Surge | COOLDOWN: 24 / 22.5 / 21 / 19.5 / 18 |
| --- | --- |

| **Active:** Zeri dashes in the target direction, she will dash across any terrain she hits. Afterwards, she gains *Lightning Rounds* for a short time. |
| --- |
| *Spark Surge's* cooldown is  reduced if **Zeri** hits an enemy with a * charged* basic attack or * Burst Fire*. * Burst Fire* reduces the cooldown even more if it critically strikes. |
| **Lightning Rounds:** * Burst Fire* deals **bonus** magic damage to the first enemy hit and will pierce through enemies to deal modified damage. |

 League of Legends content

| Warpath |   |
| --- | --- |

| **Innate:** Hecarim gains  **bonus** attack damage equal to a portion of his  **bonus** movement speed. |
| --- |

 League of Legends content

| Dirty Fighting |   |
| --- | --- |

| **Innate:** Akshan's basic attack causes him to fire a second attack that deals **reduced** physical damage. If **Akshan** cancels the second attack, he gains a brief burst of  move speed, increased based on his  attack speed. |
| --- |
| **Innate:** **Akshan's** attacks and abilities apply a stack to enemies hit. The third stack consumes them all to deal **bonus** magic damage; if the target was a champion, he also gains a brief shield. |

 League of Legends content

| Going Rogue | COOLDOWN: 18 / 14 / 10 / 6 / 2 |
| --- | --- |

| **Passive:** Enemy champions that kill allied champions are marked as a *Scoundrel* for a long time. When Akshan scores a takedown on a *Scoundrel*, he gains **bonus** gold, all allies killed by the *Scoundrel* are resurrected, and *Scoundrel* status is removed from all other enemies. |
| --- |
| **Active:** **Akshan** briefly gains camouflage, or indefinitely while near terrain and in brush. During this time, he can see trails leading toward *Scoundrels* and gains  move speed and  mana regeneration while moving toward them. |
| **Recast:** **Akshan** ends *Going Rogue*. |

**Champion statistics**

## References
