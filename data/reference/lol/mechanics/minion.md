Source: https://wiki.leagueoflegends.com/en-us/Minion

> LoL wiki page "Minion" (revision 4084248), rendered HTML converted to Markdown by tools/extract/lol/mechanics.ts. Content © League of Legends Wiki contributors, CC BY-SA 3.0. Reference material for private research only.

# Minion

Minion (Universe)Minion (Universe)

MinionMinion

LoR:MinionLoR:Minion

Minions of League of Legends (by Riot Contracted Artist Marie Magny)

**Minions** are units that comprise the main offensive force sent by the Nexus. They spawn periodically from each team's Nexus in groups and advance along a lane towards the enemy Nexus, automatically engaging any enemy unit they encounter within the lane. They are controlled by artificial intelligence and only use basic attacks.

A group of spawned minions is called a **wave**. The game's pace fundamentally depends on minion waves.

## Spawning location and routes

The following graphics show the points at which minions spawn right beside each Nexus, and the route they follow after spawning for Summoner's Rift and Howling Abyss:

Summoner's Rift

Summoner's Rift

Howling Abyss

Howling Abyss

> The thick, short segments at each line's end represent the spawning point for each lane (the point at which minions appear on the map).

> The thin, long segments represent the minions' regular route along each lane that they march along immediately after spawning.

## Gameplay - Summoner's Rift

### Minion waves

Minions on Summoner's Rift

Minions start spawning from each Nexus. Minions within a wave spawn 0.792 seconds apart from each other.

- Starting from **00:30**, *waves* spawn every 30 seconds.

- At **14:00**, *waves* spawn every 25 seconds (with sequence of 13:30 / 14:00 / 14:25).

- At **30:00**, *waves* spawn every 20 seconds (with sequence of 29:25 / 29:50 / 30:10).

Each minion wave comprises several types of minions, which spawn in this order:

- Super minions

  - If a team's inhibitor is destroyed, one super minion spawns for the enemy team on the same lane as the destroyed inhibitor.

  - If all of a team's inhibitors are destroyed, two super minions spawn on each lane for the enemy team instead.

- Melee minions

  - Three of them spawn in each wave.

  - After **14:00**, when a siege minion spawns on these waves, one fewer melee minion spawns.

- Siege minions

  - They do not spawn on waves in which super minions are present.

  - They spawn between the melee and caster minions.

  - The first one spawns with the third wave (at 01:30).

  - Then, for the first 14 minutes, one spawns every three waves.

  - After the 14 minute mark, one spawns every two waves (with sequence of 12:00 / 13:30 / 14:25 / 15:15).

  - After the 25 minute mark, one spawns every wave (with sequence of 24:25 / 25:15 / 25:40).

- Caster minions

  - Three of them spawn in each wave.

  - After **30:00**, one fewer caster minion spawns per wave.

### Behavior

While minions have not acquired a target, they will strictly path linearly along a lane until they find a valid enemy unit. Upon finding one, they will move toward and attack it within their range. Minions respect unit collision as well as player-generated terrain.

The **first wave**'s minions have modified behavior. Top and bottom lanes' minions are ghosted for 28 seconds, while middle lane minions are ghosted for 18 seconds. They will ignore enemy champions until a champion walks much closer to them or until meeting with the enemy wave. When the waves meet, minions will spread out their attacks on the three enemy melee minions regardless of distance. This special behavior exists so that, in every game, neither side gains a pushing advantage without champion interference since the first wave's melee minions are guaranteed to die at roughly the same time.

Minion bearing **aggro**

Nearby enemy minions will become aggressive toward, or "**aggro**", an enemy champion within their own variable acquisition range and under certain conditions. When activated by enemy champion actions, this aggression is formally referred to as a **Call for Help signal** in-game and throughout the League of Legends Wiki, and it is indicated by an icon of three concentrated lines above a minion's health bar (this icon indicates all non-playable units' aggro, including monsters, turrets, pets, etc.).

> On the Wiki, abilities' interaction with / minion Call for Help is noted under their respective "Details" section within the formatted table of properties.

Call for Help signals trigger when:

- A champion stands in the minion's path, without any other targets within the minions' attack range and outside of a turret's range.

- A champion deals damage to an enemy champion with a basic attack, the majority of unit-targeted abilities, and a minority of abilities which are marked as being similar to those two. Minions will prioritize the closest champion in the case there are multiple sources.

  - Bar the first wave (which is noted above as an exception), Call for Help signals are also ignored while minions are already attacking an enemy turret.

#### Priority

When minions find several enemy units, they choose their target using a priority system that follows this order:

- Enemy champions attacking an allied champion.

- Enemy minions attacking an allied champion.

- Enemy minions attacking an allied minion.

- Enemy turrets attacking an allied minion.

- The closest enemy minion.

- The closest enemy champion.

Once a minion has chosen a target, it only switches to a new target if that new target has a higher priority. The minion cannot acquire a new target that has the same priority as their current target (and thus continues attacking its current target).

#### Acquisition range

In general, valid targets must be within 500 units of the minion in order to be acquired.

Allied champions being attacked by an enemy champion may be within 1000 range of the minion to trigger a Call for Help signal instead.

#### Timing

Minions reevaluate their target in between each attack windup every few seconds. For instance, if an enemy champion is attacking an allied champion and stops doing so, minions will not stop targeting that champion for a short time afterwards.

#### Vision

When the minion loses sight of its target, the minion switches to a new target or keeps advancing if there are no targets left within sight.

#### Death grace

When a minion is below 0.35% of its **maximum** health and receives lethal damage from another minion, its health is set to 1. If it has not received damage from another source within the next 0.066 seconds, it will then proceed to die at the end of the delay.

This effect does not take place if the damage to the minion would exceed 190.

### Stats mechanics

- Starting at 0:30 and every 90 seconds thereafter (regardless of which minion spawn), minions gain an "upgrade", gaining health, attack damage, and possibly certain buffs depending on the game state.

- Against champions and structures, minions deal 60% damage.

- Against other minions, minions deal **bonus** physical damage equal to a percentage of their target's **current** health, varying based on the attacking minion.

- Minions have  350 / 375 / 400 / 425 / 450 (based on minutes) **base** movement speed (before caps).

- New spawning minions level up based on their team's average champion level, rounded down to integer (e.g. champion levels 15, 13, 18, 15, 10 = minion level 14). Minion levels interact with the minion pushing buff explained below.

- Upon dying, a minion's experience bounty is split equally among the killer and all nearby enemy champions within 1500 units of its death location.

## Buffs

### General

- Destroying an enemy inhibitor grants a small buff to allied minions in the lane where the inhibitor has been destroyed.

### Sidelane Speed

**Exclusive to Summoner's Rift**

After the first wave and until 14:00 game time, all top and bottom lane (= side lane) minions gain a  movement speed buff for a set duration upon their spawn.

Each spawned minion in the second minion wave of the game gains 111 **bonus** movement speed as an *initial speed*. Each subsequent wave reduces its spawned minions' *initial speed* by 4.5.

The bonus is removed in four *stages* as the minion travels:

- The first, second, and third stages last 7 seconds; the fourth stage lasts 4 seconds. (Total: 25 seconds)

- Upon a minion's time in each stage completing, reduce its movement speed by 15.

- After the stages' collective time has elapsed, this buff is removed.

### Minion Pushing

**On Summoner's Rift**

> 

The team with the higher average champion level gains the minion pushing buff. The buff increases the minion damage against enemy minions and reduces the damage they take from them.

**Bonus damage** = (5% + (5% × *Turret advantage of the lane*)) × *Team level advantage*

**Damage reduction** = 1 + (*Turret advantage of the lane* × *Team level advantage*)

- Team level advantage is the difference between the (decimal) average of the (integer) levels of the players in one team and the average of the levels of the other. This difference can be a decimal value, and is capped at 3.

- Turret advantage is the difference between the number of turrets destroyed in one team on a specific lane and the number of turrets destroyed on the other team on that same lane. Note that Nexus turrets are not lane turrets. This difference cannot be below 0.

Since there are three turrets on each lane, the maximum possible benefits on Summoner's Rift are:

**Bonus damage** = (5% + (5% × 3)) × 3 = 60%

**Damage reduction** = 1 + (3 × 3) = 10

This buff starts to apply at 3:30. Already-spawned minions will also receive the buff and these values will update for all minions when the level and turret advantages change.

**On Howling Abyss**

> 

Minions in the team with higher average champion level receive a buff that reduces damage taken from enemy minions.

**Damage reduction** = *Level advantage* × *Turret advantage*

- Team level advantage is the difference between the (decimal) average of the (integer) levels of the players in one team and the average of the levels of the other. This difference can be a decimal value, and is **not** capped.

- Turret advantage is the difference between the number of inner and nexus turrets destroyed for each team.

This buff starts to apply at 3:30. Already-spawned minions will also receive the buff and these values will update for all minions when the level and turret advantages change.

### Neutral Buffs

- Hand of Baron

## Minion interactions

|   | "Time doesn't heal all wounds." | This article or section is outdated. Please update this article to reflect recent events or newly available information.Last champion added: Zaahen. |
| --- | --- | --- |

The following game elements have special interactions or effects against minions:

### Capped damage

#### Champions

- Briar's Snack Attack

- Cho'Gath's Vorpal Spikes

- Ekko's Parallel Convergence

- Kog'Maw's Bio-Arcane Barrage

- Malzahar's Nether Grasp

- Maokai's Sapling Toss

- Mel's Searing Brilliance and Radiant Volley

- Singed's Fling

- Sion's Glory in Death and Soul Furnace

- Volibear's Sky Splitter

- Zac's Unstable Matter

#### Items

- Blade of the Ruined King

### Modified damage

#### Champions

- Aatrox's Deathbringer Stance, The Darkin Blade and Infernal Chains

- Ahri's Fox-Fire

- Akshan's Dirty Fighting, Avengerang and Comeuppance

- Aphelios' Infernum

- Aurora's Twofold Hex's recast

- Bel'Veth's Void Surge

- Briar's Snack Attack

- Dr. Mundo's Blunt Force Trauma

- Ezreal's Trueshot Barrage

- Fiddlesticks' Bountiful Harvest

- Galio's Justice Punch

- Gragas' Barrel Roll

- Gwen's A Thousand Cuts

- Hecarim's Rampage

- Heimerdinger's Hextech Micro-Rockets and Hextech Rocket Swarm

- Hwei's Severing Bolt and Molten Fissure and Stirring Lights

- Irelia's Bladesurge

- Jhin's Deadly Flourish and Captive Audience

- Kai'Sa's Icathian Rain

- Kalista's Sentinel

- Kayn's Reaping Slash

- Kled's Bear Trap on a Rope

- Lillia's Watch Out! Eep!

- Lucian's Lightslinger and The Culling

- Lulu's Glitterlance

- Malzahar's Void Swarm

- Mel's Searing Brilliance, Radiant Volley and Solar Snare

- Miss Fortune's Love Tap

- Nilah's Formless Blade

- Nocturne's Umbra Blades

- Nunu's Consume

- Ornn's Bellows Breath

- Pantheon's Comet Spear and Aegis Assault

- Rumble's Flamespitter

- Samira's Inferno Trigger

- Seraphine's Beat Drop

- Sion's Decimating Smash

- Smolder's MMOOOMMMM!

- Swain's Vision of Empire

- Sylas' Petricite Burst and Chain Lash

- Urgot's Purge

- Vex's Doom 'n Gloom

- Xayah's Bladecaller

- Xin Zhao's Wind Becomes Lightning

- Yone's Spirit Cleave

- Yorick's Mourning Mist

- Yunara's Cultivation of Spirit

#### Items

- Bami's Cinder

- Doran's Ring

- Doran's Shield

- Elixir of Avarice

- Hollow Radiance

- Sunfire Aegis

- Tear of the Goddess

### Other interactions

#### Champions

- Aatrox's Deathbringer Stance and World Ender

- Alistar's Triumphant Roar

- Ambessa's Public Execution

- Bel'Veth's Endless Banquet

- Cassiopeia's Twin Fang

- Cho'Gath's Feast

- Darius' Noxian Guillotine

- Draven's League of Draven

- Fiddlesticks' Terrify and Bountiful Harvest

- Gangplank's Cannon Barrage with Raise Morale

- Graves' New Destiny

- Hecarim's Spirit of Dread

- Janna's Monsoon

- Kled's Jousting and Dismounted Skaarl the Cowardly Lizard

- Lillia's Lilting Lullaby

- Malzahar's Void Shift

- Mel's Searing Brilliance

- Morgana's Soul Siphon

- Naafiri's We Are More and Darkin Daggers

- Nasus' Siphoning Strike

- Nilah's Joy Unending and Apotheosis

- Nocturne's Umbra Blades

- Nunu's Consume, Biggest Snowball Ever!

- Orianna's Command: Dissonance

- Quinn's Blinding Assault

- Rek'Sai's Fury of the Xer'Sai

- Rell's Break the Mold and Ferromancy: Crash Down

- Sejuani's Winter's Wrath and Permafrost

- Senna's Absolution

- Shaco's Jack in the Box

- Sion's Soul Furnace and Roar of the Slayer

- Sivir's On the Hunt

- Swain's Demonic Ascension

- Syndra's Force of Will

- Teemo's Blinding Dart

- Thresh's Damnation and Death Sentence

- Varus' Living Vengeance

- Veigar's Baleful Strike

- Vex's Doom 'n Gloom

- Viego's Blade of the Ruined King

- Viktor's Glorious Evolution

- Vladimir's Transfusion with Crimson Rush

- Volibear's Frenzied Maul

- Yorick's Shepherd of Souls

- Yunara's Arc of Judgment

- Zaahen's The Darkin Glaive

- Zed's Contempt for the Weak

- Zoe's Spell Thief and Sleepy Trouble Bubble

#### Items

- Bami's Cinder

- Cull

- Hollow Radiance

- Hullbreaker

- Ravenous Hydra

- Runic Compass

- Sunfire Aegis

- Tear of the Goddess

- Warmog's Armor

- World Atlas

#### Runes

- Fleet Footwork

- Legend: Alacrity

- Legend: Bloodline

- Legend: Haste

- Overgrowth

#### Summoner Spells

- Smite ( Unleashed Smite and Primal Smite)

#### Neutral Buffs

- Ocean Dragon Soul

## Creep Score

**Creep Score**, or **CS**, is the number of minions, monsters, and champion pets a champion has slain by dealing the killing blow to these units. Dealing this hit is known as **last hitting** and is considered one of the most important skills in League of Legends.

Every minion is worth 1 CS.

In the early- and mid-game, CS along with KDA can be used to measure a player's performance against their lane opponent.

### Wave Gold Value

In Summoner's Rift, an undisturbed wave consists of three melee minions, three caster minions and possibly a siege minion.

- As of V26.01, a **minion wave** has an *average* gold value that varies from 115 and up to 148, depending on game time.

| Game time | Average gold per wave | Calculations | Average gold per CS |
| --- | --- | --- | --- |
| 0:30 | 118.66 | (3 ×  20) + (3 ×  14) + ( 50 ÷ 3) | 18.7 |
| 14:00 | 115 | ((8 ÷ 3) ×  20) + (3 ×  14) + ( 59 ÷ 3) | 19.16 |
| 15:00 | 121.5 | ((5 ÷ 2) ×  20) + (3 ×  14) + ( 59 ÷ 2) | 20.25 |
| 25:00 | 148 | (2 ×  20) + (3 ×  14) + ( 66) | 24.66 |
| 30:00 | 137 | (2 ×  20) + (2 ×  14) + ( 69) | 27.4 |

## Last Hit Indicator

In non-ranked Summoner's Rift queues (Co-op vs. AI, Custom Lobbies, Tutorial, Swiftplay, Draft Pick and Featured game modes), players have the option to enable an indicator that shows when their next basic attack will guarantee a kill on a minion. The indicator's damage calculation only factors in permanent sources of damage, such as Varus' Blighted Quiver's on-hit effect or increased attack damage from a Long Sword, and does not include temporary sources of damage, such as the Sheen's Spellblade effect. The indicator's damage calculation factors in the minion's armor and magic resistance, as well as the champion's lethality, but does not factor in percentage armor penetration or magic penetration.

On Zeri, Last Hit Indicators instead show her Living Battery's execute threshold.

This option is enabled by default for newly created accounts, but is disabled by default for accounts created prior to V26.05. It can be found in Settings under **Interface** → **Health and Resource Bars** → "**Show Last Hit Assist**."

## Wave Strategy

- Without player interference, a lane's wave is neither advancing or retreating in any significant amount.

- A minion wave that catches up with its preceding wave starts pushing the lane towards enemy turret.

- Big waves of minions can overwhelm a turret.

- When a player interrupts an enemy minion wave, ensuring their minions deal more damage to the opponent's minions than they are receiving, the lane starts to **push**.

  - In the simplest way, this is done by killing every minion in a wave without interference from your own minions. This changes where in the lane the minion waves clash.

  - On more sophisticated turning the player makes sure their side is making just slightly more damage thus allowing the wave to build up as the wave gets reinforcements before than the enemy wave.

- If a player becomes targeted by the minion wave, then the result will be that if the targeted player has a minion wave with them then this will cause the wave to push much faster since during the period of time the player was targeted, that player's minion wave was able to freely attack the opposing wave without taking damage in return.

  - This is important since even if a wave is pushing away from a player, if that player does not want the wave to move further from their side of the map. That player can try to tempt an enemy player into attacking them to draw the attention of the minions, so that the wave starts moving back to the player who was attacked.

## Game Terminology

Some game terms related to minions:

- **Farming**, or **Last-hitting**: Dealing the killing blow on minions in order to earn their gold bounty along with experience.

- **Lane Momentum**: The strength with which the minions in a lane advance without champion aid.

- **Pushing**: Advancing allied minions along the lane.

- **Freezing**: Preventing the advancement of allied and enemy minions along the lane.

- **"Winions"**: A wave of minions so big or so strong that it can destroy turrets, nexuses, or champions without champion aid.

- **Free Farming**: Farming without being confronted by an enemy champion.

- **Proxy Farming**: Farming behind an enemy tower. The enemy champion has to remain in front of their turret to last-hit minions, since they would die to the turret due to freely advancing to it. However the "proxying" player is also in much more danger.

- **Split Pushing**: Attacking several objectives at the same time when at least one of the objectives is a lane turret.

## Minion Variants

Labels use the Order (blue team) and Chaos (red team) faction names.

These are all the Minions used after the second Summoner's Rift map update

Blue Caster Minion (Order)

Blue Caster Minion (Order)

Red Caster Minion (Chaos)

Red Caster Minion (Chaos)

Blue Melee Minion (Order)

Blue Melee Minion (Order)

Red Melee Minion (Chaos)

Red Melee Minion (Chaos)

Blue Siege Minion (Order)

Blue Siege Minion (Order)

Red Siege Minion (Chaos)

Red Siege Minion (Chaos)

Blue Super Minion (Order)

Blue Super Minion (Order)

Red Super Minion (Chaos)

Red Super Minion (Chaos)

These are all the Minions used between Beta 1 and Beta 3

Blue Barracks Wizard (Order)

Blue Barracks Wizard (Order)

Blue Archer Minion (Order)

Blue Archer Minion (Order)

Red Barracks Wizard (Chaos)

Red Barracks Wizard (Chaos)

Red Archer Minion (Chaos)

Red Archer Minion (Chaos)

Blue Melee Minion (Order)

Blue Melee Minion (Order)

Red Melee Minion (Chaos)

Red Melee Minion (Chaos)

Blue Rider Minion (Order)

Blue Rider Minion (Order)

Red Rider Minion (Chaos)

Red Rider Minion (Chaos)

These are all the Minions used between Beta 3 and the second Summoner's Rift map update

Blue Caster Minion (Order)

Blue Caster Minion (Order)

Purple Caster Minion (Chaos)

Purple Caster Minion (Chaos)

Blue Melee Minion (Order)

Blue Melee Minion (Order)

Purple Melee Minion (Chaos)

Purple Melee Minion (Chaos)

Blue Siege Minion (Order)

Blue Siege Minion (Order)

Unused Blue Siege Minion (Order)

Unused Blue Siege Minion (Order)

Purple Siege Minion (Chaos)

Purple Siege Minion (Chaos)

Blue Super Minion (Order)

Blue Super Minion (Order)

Purple Super Minion 1 (Chaos)

Purple Super Minion 1 (Chaos)

Purple Super Minion 2 (Chaos)

Purple Super Minion 2 (Chaos)

Other game modes refers to April Fools' Day,  Arcade,  Arcane,  PROJECT, Snowdown Showdown and Ultra Rapid Fire Minions.

Both original Howling Abyss, Twisted Treeline and Murder Bridge had altered variants of the original Summoner's Rift inhibitors before their eventual updates.

Blue "Arcane" Caster Minion (Order)

Blue "Arcane" Caster Minion (Order)

Red "Arcane" Caster Minion (Order)

Red "Arcane" Caster Minion (Order)

Blue "Arcane" Caster Minion (Chaos)

Blue "Arcane" Caster Minion (Chaos)

Red "Arcane" Caster Minion (Chaos)

Red "Arcane" Caster Minion (Chaos)

Blue "Arcane" Melee Minion (Order)

Blue "Arcane" Melee Minion (Order)

Red "Arcane" Melee Minion (Order)

Red "Arcane" Melee Minion (Order)

Blue "Arcane" Melee Minion (Chaos)

Blue "Arcane" Melee Minion (Chaos)

Red "Arcane" Melee Minion (Chaos)

Red "Arcane" Melee Minion (Chaos)

Blue "Arcane" Siege Minion (Order)

Blue "Arcane" Siege Minion (Order)

Red "Arcane" Siege Minion (Order)

Red "Arcane" Siege Minion (Order)

Blue "Arcane" Siege Minion (Chaos)

Blue "Arcane" Siege Minion (Chaos)

Red "Arcane" Siege Minion (Chaos)

Red "Arcane" Siege Minion (Chaos)

Blue "Arcane" Super Minion (Order)

Blue "Arcane" Super Minion (Order)

Red "Arcane" Super Minion (Order)

Red "Arcane" Super Minion (Order)

Blue "Arcane" Super Minion (Chaos)

Blue "Arcane" Super Minion (Chaos)

Red "Arcane" Super Minion (Chaos)

Red "Arcane" Super Minion (Chaos)

## Trivia

- If the game plays out without champion interference, the minions in one of the teams will eventually win the game. The team that wins is random.

- When minions acquire a target, it is possible for a champion to pick up aggro multiple times from a minion. Minions can constantly pick up aggro from you and can follow you through the jungle.

- By default, each player sees their allied minions and structures in Summoner's Rift in blue and the enemy minions and structures in red. This is just a visual effect, it has no practical effects in the game.

- Previously, midlane minions had reduced gold bounties, which lasted until 14:00 (until the wave at 13:35). The gold penalty was ultimately removed in V13.12.

  - Between V10.23 and V12.21, midlane siege minions were worth 10 less. Compared to other lanes, the total amount of gold from midlane minions was 80 less.

  - Between V12.22 and V13.11, all midlane minions were worth 1 less (i.e., siege minions were in total worth 1 less instead of 10 less than their regular bounty as before). Compared to other lanes, the total amount of gold from midlane minions was 164 less.

- Blue Siege Minion in beta is a mobile ballista.

  - An unused Blue Siege Minion model found in the files during beta also became the actual Blue Siege Minion in their next version.

- Visually, Blue Super Minion's pilots use two control sticks similar to analog sticks on Siege Minions to control their mech while Red Super Minion's pilots control their mech with a red crystal sphere, suggesting that magic is used.

## Patch History

**For specific patch history, check individual minion pages**

**V26.13 - June 25th Hotfix**

- **Bug Fix:** A disguised Neeko and her clone are now considered to have the disguise's armor and magic resistance instead of their real armor and magic resistance for the purposes of last hit indicators.

**V26.10**

- **Removed:** Previously, when an enemy champion attacked an allied minion, the enemy champion would enter the minions' aggro priority list. We're removing this action entirely from aggroing minions to prevent it feeling like minions sometimes randomly change their target.

**V26.05**

- Last Hit Indicators

  - Added to Co-op vs. AI, Tutorials, Swiftplay, Custom Games , Practice Tool, and RGM Summoner's Rift queues.

  - Last Hit Indicators are on by default for newly created accounts, and off by default for existing accounts.

  - Damage calculations that arise from anything other than the base attack damage of the champion but is part of an effect applied via attacks is handled on a case-by-case basis: context of passive and persistent innate attack effects is added manually to the system. For example Ashe's Frost Shot (but not Ranger's Focus), Kayle's Starfire Spellblade passive (but not its active), or the passive item effects Helping Hand, Icathian Bite, and others.

    - The system accounts for minion damage mitigation (resistances and damage reductions).

    - Basic/ultimate ability sources (if applicable) will only be considered if the particular ability has been learned.

    - Support item () minion execute threshold is accounted for when charges are available.

    - A disguised Neeko and her clone are considered to have their real armor and magic resistance instead of the disguise's armor and magic resistance.

    - On Zeri, Last Hit Indicators instead show her Living Battery's execute threshold.

  - Added toggle option under Interface > Health and Resource Bars > "Show Last Hit Asssist" to show/hide the display altogether.

**V26.01**

- Minion initial spawn time reduced to 0:30 from 1:05.

- **New Effect:** At 14:00, minion waves now spawn every 25 seconds (with sequence of 13:30 / 14:00 / 14:25). When a cannon minion spawns on these waves, one fewer melee minion spawns.

- **New Effect:** At 30:00, minion waves now spawn every 20 seconds (with sequence of 29:25 / 29:50 / 30:10 [1]). One fewer caster minion spawns on these waves.

- Minion turret damage increased to 60% from 55%.

- Base movement speed increased to 350 from 325.

- Minion experience share changed to 100 / 65 / 43.3 / 32.5 / 26 / 21.7% from 95 / 62 / 41.3 / 31 / 24.8 / 20.7%.

- First Siege minion wave starts at wave 3 (at 01:30) instead of 4.

- **Undocumented:** Siege minion time threshold to spawn every 2 waves reduced to 14 minutes (with sequence of 12:00 / 13:30 / 14:25 / 15:15 [2]), instead of 15 minutes (with expected sequence of 12:00 / 13:30 / 14:50 / 15:40).

  - *Time threshold to spawn every wave, unchanged at 25 minutes.*

**V25.05**

- **Bug Fix:** Minions no longer fail to path toward respawned Nexus turrets.

**V25.S1.1**

- Damage to structures increased to 55% from 50%.

- Damage to champions increased to 55% from 50%.

- Experience range increased to 1500 from 1400.

- **Undocumented:** Base movement speed changed to  325 / 350 / 375 / 400 / 425 (based on minutes) from  325 / 350 / 375 / 400 / 425 (based on minutes).

  - *Now starts upgrading at minute **11:00** instead of **10:00**.*

- Minions now deal bonus damage to each other.

- Siege minion first spawn time increased to 4th wave (02:35) from 3rd wave (02:05).

  - *Respawn interval unchanged.*

**V14.22**

- Sidelane speed buff initial value reduced to  111 **bonus** movement speed on the second wave.

  - **Removed:** Initial speed is no longer always 120 until the buff times out.

  - **New Effect:** Initial value now decreases by 4.5 for every wave spawned thereafter.

  - *[Note: Internally, the buff begins at 120 bonus movement speed from 00:35 onward, after structures have activated. However, there is no minion wave spawning at that time (it would otherwise receive a bonus of 120), and the first minion wave spawned at 01:05 cannot gain any movement speed bonuses (it would otherwise receive a bonus of 115.5).]*

**V14.10**

- Shared XP minion multiplier increased to 124% from 116%.

  - *Solo XP unchanged at 95%.*

**V13.12**

- **Removed:** Mid lane minions no longer give 1 less before 14:00.

**V13.10**

- **New Effect:** After the first wave and before 14 minutes, side lane minions gain increased movement speed, matching the time it takes for two opposing minion waves to meet at the midpoint of top lane and bottom lane, with the time it takes for the middle lane. The desired distance coverage is achieved via a  movement speed buff that each minion in those lanes gains, which is removed in four *stages*:

  - The first, second, and third stages last 7 seconds; the fourth stage lasts 4 seconds.

  - Upon spawn, a minion in the sidelanes gains  120 **bonus** movement speed

  - After a minion's time in a stage has elapsed, its raw movement speed is reduced by 15.

  - After the fourth stage, the buff is removed and the minion's movement speed returns to its base value.

- **New Effect:** Minions that are targeting towers now ignore "call for help" signals against enemy champions.

**V12.22**

- **New Effect:** All minions spawned in the middle lane will now be worth 1 less before 14 minutes when last hit.

  - This affects siege minions which were previously worth 10 less.

- Minion solo XP increased to 95% from 93%.

  - Minion shared XP unchanged.

**V9.23**

- Minion solo XP increased to 93% from 92%.

- Minion shared XP reduced to 116% from 120%.

**V9.4**

- The first wave of top and bot lane minions are ghosted for 28 seconds, instead of 18, after spawning. *Mid lane minions unchanged at 18 seconds of ghosting.*

**V8.23**

- Damage to turrets reduced to 50% from 60%.

- Damage to champions reduced to 50% from 60%.

- Bonus movement speed based on game-time increased to 25 / 50 / 75 / 100 (based on minutes) from 25 at 20:00.

- Siege minion time threshold to spawn every 2 waves reduced to 15 minutes (with sequence of 12:35 / 14:05 / 15:05 [3]) from 20 minutes (with sequence of 18:35 / 20:05 / 21:05).

- Siege minion time threshold to spawn every wave reduced to 25 minutes from 35 minutes.

**V8.4**

- **Removed:** Basic attacks dealing 5 bonus physical damage to minions.

**V8.2**

- **New Effect:** Targeted champion abilities, item actives and summoner spells now draw nearby minion aggro when targeting an enemy champion.

- Minions now have an inventory with cosmetic items that explains game mechanics and buffs.

**V7.23**

- Minion reduced damage to turrets reduced to 40% from 50%.

- **New Effect:** After 20 minutes, minions gain +25 movement speed. *This change will be enabled several days into the patch so we can more accurately track its impact.*

**V7.22**

- Minions now start spawning at 1:05 from 1:15.

- Champion attacks now deal 5 bonus damage to minions.

**V7.16**

- **Undocumented / Bug Fix:** At 20 minutes, Siege minions now correctly have a spawn sequence of 17:15 / 18:45 / 20:15 / 21:15 [4], instead of 17:15 / 18:45 / 20:45 / 21:45.

  - At 35 minutes they now have a spawn sequence of 34:15 / 35:15 / 35:45, from 33:45 / 34:45 / 35:15.

**V5.23**

- **New Buff - Pushing Advantage**

  - Team level advantage = Average level of your team − average level of the enemy team. The value can be decimal but cannot be higher than 3.

  - If you have a team level advantage:

    - Your minions deal bonus damage to enemy minions equal to 5% + 5% per turret advantage in their lane, all multiplied by your team's level advantage.

    - Your minions take reduced damage from enemy minions equal to 1 + 1 per turret advantage in that lane, with the turret advantage bonus multiplied by the team's level advantage.

**V5.22**

- Minions now spawn at 1:15 instead of 1:30.

  - **Bug:** At 20 minutes, Siege minions now have a spawn sequence of 17:15 / 18:45 / 20:45 / 21:45 [5], instead of 17:15 / 18:45 / 20:15 / 21:15.

  - At 35 minutes Siege minions correctly have a spawn sequence of 33:45 / 34:45 / 35:15 [6], from 34:00 / 35:00 / 35:30.

**V4.20**

- Siege minions now start spawning every two waves at 20 minutes (with sequence of 17:30 / 19:00 / 20:00 [7]), instead of 35 minutes (with sequence of 32:30 / 34:00 / 35:00).

- Siege minions now start spawning every wave at 35 minutes (with sequence of 34:00 / 35:00 / 35:30 [8]).

**V1.0.0.138**

- Minion shared experience increased to 120% from 116%.

  - Melee minion

    - Shared XP increased to 76.8 from 74.24.

  - Caster minion

    - Shared XP increased to 38.4 from 37.12.

  - Siege / Super minion

    - Shared XP increased to 120 from 116.

**V1.0.0.130**

- Damage from lane minions to champions reduced by about 15%.

- **Undocumented:** Minion shared experience increased to 116% from 110%.

  - Melee minion

    - Shared XP increased to 74.24 from 70.4.

  - Caster minion

    - Shared XP increased to 37.12 from 35.2.

  - Siege / Super minion

    - Shared XP increased to 116 from 110.

**V1.0.0.127**

- Personal score on Dominion: minion kill reward increased to 2 points from 1.

**V1.0.0.122**

- Fixed a bug where minions were not properly displaying stat growth over time.

**V1.0.0.113**

- **New effect:** Shared minion kill experience now grants 110% experience, shared equally between nearby allied champions.

  - Melee minion

    - Shared XP increased to 70.4 from 64.

  - Caster minion

    - Shared XP increased to 35.2 from 32.

  - Siege / Super minion

    - Shared XP increased to 110 from 100.

**March 9th Hotfix**

- Siege minions now spawn every 2 waves after 35 minutes (with sequence of 32:30 / 34:00 / 35:00 [9]), instead of 20 minutes (with sequence of 17:30 / 19:00 / 20:00).

- Minions now deal 50% damage to turrets, down from 60%.

**V1.0.0.112**

- Minions now deal 60% damage to turrets, up from 40%.

- After 20 minutes, siege minions now spawn every 2 waves (with sequence of 17:30 / 19:00 / 20:00 [10]), up from every 3 waves.

**V1.0.0.108**

- Removed mana from all inhibitor minions.

**V1.0.0.104**

- **Undocumented:** Solo minion kill experience reduced to 92% of the **base** value *(shared experience unchanged)*.

  - Melee minion

    - Solo XP reduced to 58.88 from 64.

  - Caster minion

    - Solo XP reduced to 29.44 from 32.

  - Siege / Super minion

    - Solo XP reduced to 92 from 100.

**V1.0.0.52**

- Improved minion turning when they appear from fog of war.

- Twisted Treeline:

  - Fixed minion pathfinding.

**V0.9.22.16**

- Minion kills now display the correct values.

- Minions no longer clear the player's bounty.

**V0.9.22.15**

- Minion corpses now fade out when they disappear instead of popping.

**June 19, 2009 Patch**

- Minions no longer have health or mana regeneration. This will help the game run faster.

- Siege minions spawn rate increased to every 3 waves from ever 4 waves.

- Fixed a bug with ghost minions. They will no longer be present when you reconnect.

**June 6, 2009 Patch**

- Fixed an issue where minions were not giving players full credit for kills in the announcements.

- Damage minions deal to champions increased to 70% from 60%.

**May 29, 2009 Patch**

- Inhibitor bonuses:

  - Melee minion bonus damage increased to 10 from 8.

  - Caster minion bonus damage increased to 18 from 15.

  - Siege minion bonus damage increased to 25 from 20.

**May 1, 2009 Patch**

- Destroying an inhibitor no longer causes the enemy team to gain less experience and gold from minion kills.

- Duration between minion upgrades increased to 200 from 180.

- Damage minions deal to champions increased to 60% from 50%.

- Minion gold bounty now caps after 30 minutes (10 upgrades).

**Alpha Week 7**

- Minions should no longer be able to get killing streaks.

**Alpha Week 6**

- Minions no longer give half gold and experience when you have lost an inhibitor.

**Alpha Week 5**

- Minion health bars are now brighter.

**Alpha Week 4**

- Minions now spawn after 1 minute instead of 1 minute and 40 seconds.

- Minions now spawn from the Nexus instead of inhibitors.

**Alpha Week 2**

- Minions can no longer be denied.

**Gameplay Elements**

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

Howling Abyss

The Howling Abyss is a bottomless crevasse located in the coldest, cruelest, part of the Freljord. Legends say that, long ago, a great battle took place here on the narrow bridge spanning this chasm. No one remembers who fought here, or why, but it is said that if you listen carefully to the wind you can still hear the cries of the vanquished tossed howling into the Abyss.

**Regular Modes**

- Classic 5v5 ( All random)

- Custom

**Featured Game Modes**

- ARAM: Mayhem

- Legend of the Poro King

- One For All

- One For All: Mirror Mode

- Snowdown Showdown

 League of Legends content

Acquisition radius

A unit's **acquisition range** is a stat that determines the distance at which they will acquire basic attack targets when a target unit is not specified by the player.

- Auto-attacking *automatically* orders an idle champion to acquire enemies within this range. This can be disabled in the Settings.

- Attack-move commands scan for targets within this range while moving toward a given location.

**Acquisition range** is calculated from the champion's edge to the edge of other units.
Attack range bonuses modify the champion's **acquisition range** by the same amount.

 League of Legends content

Monster

**Monsters** are neutral units in **League of Legends**. Unlike minions, monsters do not fight for either team, and will only do so if *aggroed* (provoked) – with the exception of the Rift Scuttler, which simply runs away when attacked.

 League of Legends content

Turret

A **turret**, also called a **tower**, is a fortification that defends a part of territory. It provides vision of the area and autonomously fires homing bolts at nearby enemies, establishing a defensive ground for allies.

Turrets are most notable in Classic, defending against waves of enemy Minions from their ultimate goal of destroying the nexus. Champions work to destroy enemy turrets to push their assault into the enemies' territory. Turrets visually fall apart as they take damage.

 League of Legends content

Pet

A **pet** is a unit summoned by a champion to assist them on the battlefield.

 League of Legends content

| Snack Attack |   |
| --- | --- |

| **Active:** Briar empowers her next attack during Blood Frenzy to take a bite out of the target enemy. The attack gains increased  range, deals **bonus** physical damage based on the target's **missing** health and heals **Briar** for a portion of the damage dealt. |
| --- |

 League of Legends content

| Vorpal Spikes | COOLDOWN: 8 / 7 / 6 / 5 / 4 |
| --- | --- |

| **Active:** Cho'Gath's next few basic attacks launch forth deadly spikes, dealing magic damage to enemies hit based on * Feast* stacks and each target's **maximum** health, and slowing them. |
| --- |

 League of Legends content

| Parallel Convergence | COOLDOWN: 22 / 20 / 18 / 16 / 14 |
| --- | --- |

| **Passive:** Ekko's basic attacks deal **bonus** magic damage against a low-health target, increased based on their **missing** health. |
| --- |
| **Active:** **Ekko** indicates the target location where a sphere will be created, which slows enemies within. |
| If **Ekko** enters the sphere, it detonates, stunning enemies within and granting **Ekko** a  shield. |

 League of Legends content

| Bio-Arcane Barrage | COOLDOWN: 17 |
| --- | --- |

| **Active:** Kog'Maw empowers his basic attacks for a period, gaining  **bonus** attack range and dealing **bonus** magic damage based on the target's **maximum** health. |
| --- |

 League of Legends content

| Nether Grasp | COOLDOWN: 140 / 110 / 80 |
| --- | --- |

| **Active:** Malzahar tethers to the target enemy champion, knocking them down. The tether lasts a short time, during which he channels to suppress and reveal the target, continually dealing them magic damage. |
| --- |
| Additionally, a *Null Zone* is opened beneath the target's location for a few seconds, which continually deals magic damage to enemies within. |

 League of Legends content

| Sapling Toss | COOLDOWN: 18 / 17 / 16 / 15 / 14 |
| --- | --- |

| **Active:** Maokai flings a *Sapling* to the target location, where it remains for some time. A *Sapling* will chase nearby enemies for a short time, expiring afterward or upon contact. |
| --- |
| When a *Sapling* expires, it deals magic damage to nearby enemies based on their **maximum** health and slows them for a short time. |
| A *Sapling* placed in brush will last longer, and deal double damage over 3 bursts. |

 League of Legends content

| Searing Brilliance |   |
| --- | --- |

| **Innate - Overwhelm:** Mel's damaging basic attacks and abilities apply a stack of *Overwhelm* to enemies hit for a few seconds, stacking infinitely. Each stack stores magic damage; if the total stored damage would kill the target, the next stack will consume them all to detonate the damage. |
| --- |
| **Innate:** **Mel's** ability casts each generate stacks for a few seconds, up to a cap. Her next basic attack consumes all stacks to additionally fire an equal number of bolts dealing magic damage. |

 League of Legends content

| Radiant Volley | COOLDOWN: 10 / 9 / 8 / 7 / 6 |
| --- | --- |

| **Active:** Mel concentrates a bombardment of luminous bolts that explode in an area, dealing magic damage. |
| --- |

 League of Legends content

| Fling | COOLDOWN: 10 / 9.5 / 9 / 8.5 / 8 |
| --- | --- |

| **Active:** Singed flings the target enemy, dealing magic damage based on their **maximum** health. |
| --- |
| If the target lands on * Mega Adhesive*, they are briefly rooted. |

 League of Legends content

| Glory in Death |   |
| --- | --- |

| **Innate:** Upon dying, Sion reanimates into a frenzy where he is restored to max health that rapidly decays, and reduces incoming healing. |
| --- |
| **Sion** can cast *Death Surge*, move and basic attack. His attacks become very rapid, gain  life steal, and deal **bonus** physical damage based on the target's **maximum** health. |

| Death Surge | COOLDOWN: 100 |
| --- | --- |

| **Active:** Sion gains a burst of  movement speed for a short time. |
| --- |

 League of Legends content

| Soul Furnace | COOLDOWN: 15 / 14 / 13 / 12 / 11 |
| --- | --- |

| **Passive:** Sion gains  **bonus** health whenever he kills an enemy, increased against large enemies and champion takedowns. |
| --- |
| **Active:** **Sion** gains a shield based on his **maximum** health that lasts a few seconds. *Soul Furnace* can be recast while the shield holds, and does so automatically after the duration. |
| **Recast:** **Sion** consumes the shield to deal magic damage to nearby enemies based on their **maximum** health. |

 League of Legends content

| Sky Splitter | COOLDOWN: 16 |
| --- | --- |

| **Active:** Volibear conjures a lightning bolt to strike the target location, dealing magic damage to enemies hit based on their **maximum** health and slowing them for a short time. |
| --- |
| The bolt can hit **Volibear**, briefly granting him a shield for a portion of his **maximum** health. |

 League of Legends content

| Unstable Matter | COOLDOWN: 5 |
| --- | --- |

| **Active:** Zac explodes to deal magic damage to nearby enemies hit based on their **maximum** health. |
| --- |
| *Unstable Matter's* cooldown is  reduced whenever **Zac** collects a * Cell Division* chunk. |

 League of Legends content

| Deathbringer Stance | STATIC CD: 22 – 10 (based on level) |
| --- | --- |

| **Innate:** Periodically, Aatrox's next basic attack deals **bonus** magic damage based on the target's **maximum** health,  healing him for the damage dealt. |
| --- |
| **Aatrox's** basic attacks and ability hits against enemy champions or large monsters  reduce *Deathbringer Stance's*  cooldown. |

 League of Legends content

| The Darkin Blade | COOLDOWN: 14 / 12 / 10 / 8 / 6 |
| --- | --- |

| Aatrox can cast this ability up to three times in a short amount of time before it goes on  cooldown. |
| --- |
| **Active:** **Aatrox** performs an attack with his greatsword in the target direction, dealing physical damage to enemies within an area. The area varies and the damage increases per cast. Enemies within each area's Sweetspot receive increased damage and are briefly knocked up. **First Cast:** **Aatrox** strikes his greatsword in a long rectangle. **Second Cast:** **Aatrox** slashes his greatsword in a wide trapezoid. **Third Cast:** **Aatrox** slams his greatsword in a circle. |

 League of Legends content

| Infernal Chains | COOLDOWN: 18 / 16.5 / 15 / 13.5 / 12 |
| --- | --- |

| **Active:** Aatrox sends a chain in the target direction that deals physical damage and slows the first enemy hit. |
| --- |
| If this hits an enemy champion or large monster, it creates a revealing tether between them and the ground. If the tether is not broken after a brief moment, they are dealt physical damage and pulled back to the center. |

 League of Legends content

| Fox-Fire | COOLDOWN: 9 / 8 / 7 / 6 / 5 |
| --- | --- |

| **Active:** Ahri gains a burst of  move speed and conjures three fox-fires that orbit her for a short time. Fox-fires home onto nearby enemies, dealing magic damage. |
| --- |

 League of Legends content

| Dirty Fighting |   |
| --- | --- |

| **Innate:** Akshan's basic attack causes him to fire a second attack that deals **reduced** physical damage. If **Akshan** cancels the second attack, he gains a brief burst of  move speed, increased based on his  attack speed. |
| --- |
| **Innate:** **Akshan's** attacks and abilities apply a stack to enemies hit. The third stack consumes them all to deal **bonus** magic damage; if the target was a champion, he also gains a brief shield. |

 League of Legends content

| Avengerang | COOLDOWN: 9 / 8 / 7 / 6 / 5 |
| --- | --- |

| **Active:** Akshan throws a boomerang that deals physical damage to enemies hit, extending the boomerang range and briefly revealing them. If this hits an enemy champion, **Akshan** gains a brief burst of  move speed. |
| --- |
| Once the boomerang has passed its original range and has not recently hit an enemy, it homes back to **Akshan** and deals the same effects to enemies hit. |

 League of Legends content

| Comeuppance | COOLDOWN: 100 / 85 / 70 |
| --- | --- |

| **Active:** Akshan locks onto the target enemy champion and begins channeling power into his gun to store bullets, revealing them as well as revealing himself. *Comeuppance* will recast after the channel, or can recast early. |
| --- |
| **Recast:** Akshan fires the stored bullets at the target, each dealing physical damage to the first enemy hit, increased by their **missing** health. |
| **Akshan** can move normally and cast * Heroic Swing* while channeling and firing *Comeuppance*. |
| *Comeuppance* applies  life steal and can hit turrets. |

 League of Legends content

| Infernum, the Flamethrower |   |
| --- | --- |

| Aphelios' basic attacks will hit all enemies in its trajectory, dealing increased damage to the main target and less damage to other targets. The attack will then spread into a cone behind his main target. |
| --- |
| While Infernum is the main weapon, his ability will be: |

| Duskwave | COOLDOWN: 8 – 5 (based on level) |
| --- | --- |

| **Active:** **Aphelios** unleashes a wave of energy in a cone, dealing physical damage to enemies hit and locking on to each of them, basic attacking them after a delay. |
| --- |

 League of Legends content

| Twofold Hex | COOLDOWN: 9 / 8.5 / 8 / 7.5 / 7 |
| --- | --- |

| **Active:** Aurora fires a bolt of energy that deals magic damage to enemies hit and marks them for a short time. *Twofold Hex* can be recast while at least one target is marked. |
| --- |
| **Recast:** **Aurora** expunges the curse from all marked targets, drawing back bolts that each deal magic damage to enemies they pass through based on their **missing** health. |

 League of Legends content

| Void Surge | COOLDOWN: 4 / 3.25 / 2.5 / 1.75 / 1 |
| --- | --- |

| **Active:** Bel'Veth dashes in the target direction, though not through terrain, dealing physical damage to enemies she passes through. |
| --- |
| *Void Surge* can be cast only within a cardinal direction that is off cooldown, each direction has a unique  cooldown that scales down with her  **bonus** attack speed. |
| *Void Surge's* damage against the first enemy hit can critically strike and applies on-hit effects and  life steal. |

 League of Legends content

| Blunt Force Trauma | COOLDOWN: 9 / 8.25 / 7.5 / 6.75 / 6 |
| --- | --- |

| **Passive:** Dr. Mundo gains  **bonus** attack damage based on his **maximum** health. |
| --- |
| **Active:** **Dr. Mundo's** next basic attack deals **bonus** physical damage, increased based on his **missing** health. If the target dies, their corpse is sent flying away in a line, dealing physical damage to enemies it passes through. |

 League of Legends content

| Trueshot Barrage | COOLDOWN: 120 / 105 / 90 |
| --- | --- |

| **Active:** Ezreal fires a powerful arc of energy that deals magic damage to enemies hit. |
| --- |

 League of Legends content

| Bountiful Harvest | COOLDOWN: 10 / 9.5 / 9 / 8.5 / 8 |
| --- | --- |

| **Active:** Fiddlesticks tethers to nearby enemies, channeling for a short duration during which it reveals tethered enemies and continually deals magic damage to them. **Fiddlesticks** heals for a portion of the damage dealt. |
| --- |
| If **Fiddlesticks** ends the channel without interruption, the last tick deals increased magic damage based on each target's **missing** health and the remaining cooldown is  reduced. |

 League of Legends content

| Justice Punch | COOLDOWN: 11 / 10 / 9 / 8 / 7 |
| --- | --- |

| **Active:** Galio briefly steps back before charging to the target location. Enemies he passes through are dealt magic damage and knocked up. Hitting an enemy champion or terrain stops his charge. |
| --- |

 League of Legends content

| Barrel Roll | COOLDOWN: 10 / 9 / 8 / 7 / 6 |
| --- | --- |

| **Active:** Gragas rolls a cask to the target location that lingers for a short time before exploding. *Barrel Roll* can be recast within the duration once it fully travels. |
| --- |
| **Recast:** **Gragas** detonates the cast, dealing magic damage and slowing nearby enemies. The effects are increased based on how long the cask lingered. |

 League of Legends content

| A Thousand Cuts |   |
| --- | --- |

| **Innate:** Gwen's basic attacks on-hit and damaging abilities deal **bonus** magic damage equal to a portion of the target's **maximum** health and heal her for a portion of this damage dealt against champions. |
| --- |

 League of Legends content

| Rampage | COOLDOWN: 4 / 3.25 / 2.5 / 1.75 (based on *Rampage* stacks) |
| --- | --- |

| **Active:** Hecarim cleaves his glaive to deal physical damage to nearby enemies. |
| --- |
| Whenever *Rampage* hits at least one enemy, he gains a stack, up to a cap. |
| **Rampage:** For each stack, *Rampage's* damage is increased and the cooldown is  reduced. |

 League of Legends content

| Hextech Micro-Rockets | COOLDOWN: 11 / 10 / 9 / 8 / 7 |
| --- | --- |

| **Active:** Heimerdinger fires a wave of rockets that converge to the target location and fan beyond it to max range, each dealing magic damage to the first enemy hit. Enemies take less damage from subsequent rockets that hit them. |
| --- |
| Whenever a rocket hits an enemy champion, nearby turrets gain some beam charge. |

| Hextech Rocket Swarm | COOLDOWN: 11 / 10 / 9 / 8 / 7 |
| --- | --- |

| **UPGRADE:** Heimerdinger now fires 4 waves of rockets, each rocket dealing magic damage to the first enemy hit. Enemies take less damage from subsequent rockets that hit them. |
| --- |

 League of Legends content

| Hextech Micro-Rockets | COOLDOWN: 11 / 10 / 9 / 8 / 7 |
| --- | --- |

| **Active:** Heimerdinger fires a wave of rockets that converge to the target location and fan beyond it to max range, each dealing magic damage to the first enemy hit. Enemies take less damage from subsequent rockets that hit them. |
| --- |
| Whenever a rocket hits an enemy champion, nearby turrets gain some beam charge. |

| Hextech Rocket Swarm | COOLDOWN: 11 / 10 / 9 / 8 / 7 |
| --- | --- |

| **UPGRADE:** Heimerdinger now fires 4 waves of rockets, each rocket dealing magic damage to the first enemy hit. Enemies take less damage from subsequent rockets that hit them. |
| --- |

 League of Legends content

| Severing Bolt |   |
| --- | --- |

| **Active - QW:** Hwei strikes the target area with a lightning bolt, dealing magic damage to enemies within the area. Isolated or immobilized enemies are dealt increased damage based on their **missing** health. |
| --- |

 League of Legends content

| Molten Fissure |   |
| --- | --- |

| **Active - QE:** Hwei marks a blazing path in a direction that erupts after a delay into explosions. Each explosion deals magic damage and leaves behind a volcanic fissure that continually deals magic damage and slows enemies within. |
| --- |

**Units**
