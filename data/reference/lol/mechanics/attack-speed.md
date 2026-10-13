Source: https://wiki.leagueoflegends.com/en-us/Attack_speed

> LoL wiki page "Attack speed" (revision 4073067), rendered HTML converted to Markdown by tools/extract/lol/mechanics.ts. Content © League of Legends Wiki contributors, CC BY-SA 3.0. Reference material for private research only.

# Attack speed

**Attack speed**, or **AS**, is a stat that determines the rate of a unit's basic attack, measured in attacks per second. Similarly to abilities, attacks have an uptime period and a downtime period, called the windup and the winddown/cooldown respectively.

Every unit is given the following values related to attack speed by the game rules. Their amounts vary for each unit.

- The **base** attack speed, which is the attack rate that they start the game with.

- The **growth** coefficient (gained by leveling up) which is uniquely considered **bonus** attack speed. In contrast, all other stats gained through growth are always considered increases to the base stats.

- The **ratio**, which modifies the effectiveness of all attack speed **bonuses** to the actual attack speed by a percentage. Having a *higher* **ratio** means that the attack rate improves *more* by obtaining **bonus** attack speed, compared to champions who have a lower **ratio**.

- The **windup percentage**, which determines the champion's time to launch an attack (windup) as a portion of their attack time. Optionally, they may also have a windup modifier, which alters the effectiveness of **bonus** attack speed specifically on the windup time.

In addition to growth, champions can gain **bonus** attack speed from any source, such as abilities, buffs, items, runes, and others.

- Bonus attack speed ** stacks additively**, and each percent point acquired directly adds to the statistic (1:1).

*Gold Value*

- **Bonus attack speed** has a gold value of 25 per percent point.

## Cap and floor

The **maximum** attack speed that units can have is precisely **3.003**, or 1 basic attack per 0.333 seconds.

The **minimum** attack speed that units can have is precisely **0.2**, or 1 basic attack per 5 seconds.

Some effects are allowed to modify these values. Featured Game Modes may feature a different attack speed cap; see their respective article for details.

## Calculations

### Attack speed growth

Excluding the outlier of Bel'Veth (who does not gain any attack speed growth due to her innate), attack speed growth coefficients range from 0.5% to 6% in champions.

The full formula for total attack speed is the same as the regular growth formula, but it includes a constant factor—the attack speed ratio—that modifies the sum of the bonus gained via growth and bonuses gained via other sources. Other than that, attack speed growth happens at the same rate as any other statistic's growth.

### Short formula

Because the amount of bonus attack speed is easily known by hovering the attack speed tooltip on the champion stats panel, the growth formula can be entirely avoided with little error, resulting in a much simpler calculation.

#### Simple example

Suppose a unit has `0.7` base attack speed and an attack speed ratio of `0.7` , and it has gained 100% bonus attack speed:

- 100% = `100 / 100 = 1.0` bonus attack speed

This bonus amount is then multiplied by the attack speed ratio to find the *actual improvement* that the unit receives to their attack speed:

- `1.0 × 0.7 = 0.7`

Lastly, this result is added to its default (base) attack speed, resulting in a total attack speed of:

- `0.7 + 1.0 × 0.7 = 1.4` total attack speed

At 50% bonus attack speed, the calculations would be:

- 50% = `50 / 100 = 0.5` bonus attack speed

- `0.5 × 0.7 = 0.35` actual improvement to their attack rate

- `0.7 + 0.5 × 0.7 = 1.05` total attack speed

At 200% bonus attack speed, that unit would have 2.1 total attack speed.

At 10% bonus attack speed, that unit would have 0.77 total attack speed.

#### Generalization

Let:

- `b` be the unit's base attack speed

- `m` be the unit's attack speed ratio

- `x` be the sum of all attack speed bonuses on the unit

- `y` be the unit's total attack speed

Then the total attack speed is calculated through the equation  `y = mx + b`  which is a linear equation of attack speed in terms of its bonuses.

Most champions' base attack speed and attack speed ratio are equal, meaning `m` can be replaced with `b` , resulting in the equation   `y = bx + b`  or simply  `y = b(x + 1)`

### Full example

> *Last updated: V25.10.*

As a demonstration of how the formulas work in-game, this section will use the champion Twisted Fate. Twisted Fate's base attack speed is 0.625 and his attack speed ratio is 0.651. Like most champions, he gains an amount of bonus attack speed by leveling up. His attack speed growth is 2.5%. In order to find the amount of **bonus** attack speed at a certain level, the statistics growth formula is used:

- At level 10, he would have gained 2.5% × 9 × (0.7025 + 0.0175 × 9) = 19.35% **bonus** attack speed.

Suppose he has some other sources of **bonus** attack speed as well:

- His Stacked Deck is fully ranked, granting him 50% bonus AS.

- The rune Legend: Alacrity is fully stacked, granting him 18% bonus AS.

- He has equipped Berserker's Greaves, granting him 30% bonus AS.

Adding all sources of bonuses together, he has 19.35% + 50% + 25% + 18% = 112.35% **bonus** attack speed.

In order to find his total attack speed, we then finally use the attack speed formula:
**0.625 + 0.65100002288818 × 112.35 ÷ 100 ≈ 1.3563985257149**

- On the champion stats panel of the HUD, this number is rounded to 2 decimal places: 1.36

- In the tooltip when hovering over attack speed in the same panel, this number is rounded to 3 decimal places: 1.356.

## Attack timer

Attack timer = 1 ÷ **total** attack speed

Like abilities, basic attacks have an uptime when a basic attack is available, and a downtime when the basic attack is on cooldown.

Attacks follow a two-phase period called the **attack timer**, which consists of:

- The **windup**, during which an attacker executes a basic attack.

- The **cooldown**, during which an attacker cannot execute a basic attack.

Starting a windup also starts counting the attack timer.

- When the windup is interrupted by any means, the attack timer stops counting and resets to zero. A basic attack has **not** been launched and a new windup may begin whenever allowed/possible.

- When the windup completes and a basic attack has been launched, the attack timer continues on to incur its cooldown phase. All issued attack commands will be invalidated during this time.

- When the cooldown completes, the attack timer also ends, allowing a new windup to begin.

Optimizing movement commands after launching an attack is known as **stutter-stepping**.

### Windup

A unit's **attack windup** is the portion of their attack which must be completed in order to launch it, different for each unit. The attacker must be standing in place in order to complete the windup.

- Upon the windup completing for non-projectile attacks, the attack simultaneously launches and hits the target.

- Upon the windup completing for projectile attacks, launching the attack creates a projectile, which follows and hits the target shortly after.

The windup and therefore the attack is canceled by issuing a different command at any point before the moment of launching. After launching the attack, commands may be freely input without penalty.

Normally, a champion's **windup time** scales the same as their attack's total time, proportionally to their attack speed given both positive and negative ( cripple) bonuses. For champions that are given a **windup modifier** (a value different from the default **1**) by the game rules, the actual duration of their windup is scaled against the expected value by that amount. *Base* windup time refers to the champion's windup time at level 1 and with no attack speed bonuses.

All champions are implicitly given a **windup percent** by the game rules, the percentage of the attack's total time that the windup takes up. There are currently two different ways of determining the windup percent — most newer champions use an independent formula while all others utilize a constant. *This difference does **not** affect gameplay.*

The original way of calculating the windup percent is  `0.3 + attackOffset`  where:

> attackOffset is a given positive or negative decimal value.

The updated way of calculating the windup percent is  `attackCastTime ÷ attackTotalTime`  where:

> attackCastTime is a given positive decimal value in seconds

> attackTotalTime is a given positive decimal value in seconds, larger than attackCastTime

Assuming:

- *All attack speed values are in decimal form.*

- ***WindupPercent*** = the statistic as a decimal

- ***WindupModifier*** = the statistic as a decimal, defaults to 1

- ***currentAttackTotalTime*** = 1 ÷ **total** attack speed

- ***baseWindupTime*** = **WindupPercent** ÷ **base** attack speed

Then to calculate a champion's **current windup time**, use the following formulas:

- General form:

> ***baseWindupTime** + **WindupModifier**  ×  { **currentAttackTotalTime**  ×  **WindupPercent** – **baseWindupTime** }*

- If the champion's **base** attack speed and attack speed **ratio** are equal, the formula can be adjusted to:

> ***currentAttackTotalTime**  ×  **WindupPercent**  ×  { 1 + **bonus** attack speed  ×  (1 - **WindupModifier**) }*

- If the champion has no **windup modifier** and their **base** attack speed and attack speed **ratio** are equal, the formula can be simplified to:

> ***currentAttackTotalTime**  ×  **WindupPercent*** or ***baseWindupTime**  ÷  {**bonus** attack speed + 1}*

### Cooldown

The attack timer's cooldown phase is simply the remaining time until their attack timer has elapsed.

Resetting the basic attack timer during the cooldown phase allows a caster to essentially bypass it and initiate a new windup earlier than usual.

## Exceeding or altering the attack speed cap

The following game elements can modify the attack speed cap.

### Removing the cap

Effects that remove the attack speed cap allow characters to fire basic attacks at rates higher than 3.003, given high enough attack speed bonuses. The game engine's tick rate can technically register up to 30 attacks per second, meaning one attack per frame. Bel'Veth is the only champion in the game that can exceed both the imposed and the technical limitation of attack speed by default.

#### Champions

- Bel'Veth's Death in Lavender - Increases the attack speed cap to 9999.00 at all times.

- Jinx's Get Excited! - Increases the attack speed cap to 90.00 while active.

- Kennen's Lightning Rush - Increases the attack speed cap by the amount gained.

- Varus' Living Vengeance - Increases the attack speed cap to 3.33 while active.*

#### Runes

- Hail of Blades - Increases the attack speed cap to 90.00 while active.

### Fixed attack speed

#### Champions

- Urgot's Purge - 3.0; *Purge* does not interact with bonuses nor the attack speed stat itself, it functions completely independently and autonomously.

### Reducing the cap

#### Champions

- Graves' New Destiny - Special attack cooldown and attack speed calculation; Graves cannot technically reach the attack speed cap.

- Jhin's Whisper - Jhin's attack speed does not benefit from any bonuses other than its growth; Jhin cannot reach the attack speed cap under any circumstance.

- Sion's Glory in Death effectively reduces his attack speed cap to 1.75 and increases his attack speed floor to 1.75 until the ability ends. *Other modifiers are still allowed to alter the cap.*

- Zeri's Burst Fire reduces her attack speed cap to 1.5; attack speed from Lightning Crash can exceed this cap by the amount gained.

## Attack speed as scaling

Outside of basic attacks, attack speed can also scale various effects of certain champion abilities or item effects. A portion of their **bonus** or their **total** attack speed may be used in these cases. Certain abilities are uniquely implemented to scale down their cast time via attack speed, similarly to how a basic attack's cast time ("windup") becomes lower at higher attack speed; this time may or may not have an imposed floor on abilities.

If an ability's benefit from attack speed does not have a floor, or if that floor is lower than the one gained at the attack speed cap, any bonus attack speed acquired that exceeds the attack speed cap can continue to improve ability scalings, because the absolute total rate of attacks is irrelevant to the calculations for the related abilities.

Lastly, there are also some other abilities, not listed here, that can scale indirectly with the raw rate of attacking. For example, Master Yi's Alpha Strike reduces its cooldown by a flat amount every time he attacks, therefore having a higher attack speed means attacking faster and thus reducing the ability's cooldown more times.

### Champions

#### Total attack speed multipliers

- Bel'Veth's Endless Banquet

- Jinx's Get Excited!

- Taric's Bravado

#### Cast time

- Jinx's Zap!

- Kai'Sa's Supercharge

- Kayle's Radiant Blast

- Nilah's Formless Blade

- Olaf's Reckless Swing

- Senna's Piercing Darkness

- Sivir's Boomerang Blade

- Smolder's Super Scorcher Breath

- Talon's Noxian Diplomacy's melee cast

- Tristana's Explosive Charge

- Viego's Blade of the Ruined King

- Xayah's Double Daggers

- Yasuo's Steel Tempest

- Yone's Mortal Steel and Spirit Cleave

- Yunara's Arc of Judgment and Arc of Ruin*

- Zeri's Burst Fire and Ultrashock Laser

#### Cooldown

- Bel'Veth's Void Surge*

- Yasuo's Steel Tempest

- Yone's Mortal Steel and Spirit Cleave

- Zeri's Burst Fire

#### Other effects

- Akshan

  - Dirty Fighting's bonus movement speed

  - Heroic Swing's damage per shot

- Aphelios

  - Onslaught's shot count

  - Crescendum's inbound missile speed

  - Sentry's attack speed

- Bel'Veth's Royal Maelstrom's slash count

- Garen's Judgment's spin count*

- Graves' New Destiny's reload time

- Jhin's Whisper's bonus attack damage and movement speed

- Kai'Sa's Supercharge's bonus movement speed and evolution*

- Kalista's Martial Poise's dash speed

- Katarina's Death Lotus' physical damage per dagger

- Kindred's Wolf's Frenzy's attack speed

- Maokai's Sap Magic's heal delay

- Varus' Living Vengeance's bonus attack speed, bonus attack damage and ability power

- Viego's Sovereign's Domination's healing based on the target's maximum health

- Volibear's Thundering Smash's attack windup which overrides his basic attack's windup

- Xin Zhao's Audacious Charge's bonus attack speed*

- Zeri's Burst Fire converts bonus attack speed in excess of the cap into bonus attack damage

### Items

#### Cast time

- Tiamat's, Profane Hydra's, Ravenous Hydra's, and Stridebreaker's Cleave

### Runes

- Lethal Tempo

## Increasing attack speed

### Items

This table is automatically generated based on the data from Module:ItemData/data.

| Item | Cost | Amount | Availability |
| --- | --- | --- | --- |
| Berserker's Greaves Berserker's Greaves | 1100 | 30% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Blade of the Ruined King Blade of the Ruined King | 3200 | 25% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Dagger Dagger | 250 | 10% | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Darksteel Talons Darksteel Talons | 0 | 50% | Arena |
| Decapitator Decapitator | 0 | 50% | Arena |
| Diamond-Tipped Spear Diamond-Tipped Spear | 0 | 30% | Arena |
| Doran's Bow Doran's Bow | 400 | 15% | Nexus Blitz, Classic Summoner's Rift 5v5 |
| Dusk and Dawn Dusk and Dawn | 3100 | 20% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Experimental Hexplate Experimental Hexplate | 3000 | 20% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Fiendhunter Bolts Fiendhunter Bolts | 2650 | 45% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Fulmination Fulmination | 0 | 45% | Arena |
| Galeforce Galeforce | 0 | 30% | Arena |
| Gambler's Blade Gambler's Blade | 0 | 70% | Arena |
| Guinsoo's Rageblade Guinsoo's Rageblade | 3000 | 25% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Gunmetal Greaves Gunmetal Greaves | 1100 | 45% | Classic Summoner's Rift 5v5 |
| Hamstringer Hamstringer | 0 | 40% | Arena |
| Hearthbound Axe Hearthbound Axe | 1200 | 20% | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Hexbolt Companion Hexbolt Companion | 0 | 75% | Arena |
| Jarvan I's Jarvan I's | 0 | 25% | ARAM: Mayhem |
| Kraken Slayer Kraken Slayer | 3000 | 40% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Mirage Blade Mirage Blade | 0 | 60% | Arena |
| Nashor's Tooth Nashor's Tooth | 2900 | 50% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Navori Flickerblade Navori Flickerblade | 2650 | 40% | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Phantom Dancer Phantom Dancer | 2650 | 65% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Puppeteer Puppeteer | 0 | 30% | Arena |
| Rapid Firecannon Rapid Firecannon | 2650 | 35% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Reality Fracture Reality Fracture | 0 | 40% | Arena |
| Reaper's Toll Reaper's Toll | 0 | 50% | Arena |
| Recurve Bow Recurve Bow | 700 | 15% | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Reverberation Reverberation | 0 | 40% | Arena |
| Runaan's Hurricane Runaan's Hurricane | 2650 | 40% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Scout's Slingshot Scout's Slingshot | 600 | 20% | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Statikk Shiv Statikk Shiv | 3000 | 30% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Stormrazor Stormrazor | 3200 | 25% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Stridebreaker Stridebreaker | 3300 | 25% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Talisman of Ascension Talisman of Ascension | 0 | 0% | Arena |
| Terminus Terminus | 3000 | 35% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| The Golden Spatula The Golden Spatula | 0 | 60% | ARAM: Mayhem, Arena |
| Trinity Force Trinity Force | 3333 | 30% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Wit's End Wit's End | 2800 | 50% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Yun Tal Wildarrows Yun Tal Wildarrows | 3000 | 45% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Zeal Zeal | 1200 | 15% | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Zephyr Zephyr | 2500 | 50% | Arena |

#### Item passives

- Ardent Censer

- Bandlepipes

- Experimental Hexplate

- Fiendhunter Bolts

- Guinsoo's Rageblade

- Lich Bane

### Champion abilities

#### Ally and/or User-targeted

- Jarvan IV's Demacian Standard

- Lulu's Whimsy

- Nidalee's Primal Surge

- Nunu's Call of the Freljord

- Renata Glasc's Bailout

- Yuumi's Zoomies

#### User only

- Ambessa's Drakehound's Step

- Aphelios' The Hitman and the Seer

- Ashe's Ranger's Focus

- Bel'Veth's Death in Lavender and Endless Banquet

- Blitzcrank's Overdrive

- Briar's Blood Frenzy

- Camille's Wall Dive

- Diana's Moonsilver Blade

- Draven's Blood Rush

- Elise's Skittering Frenzy

- Ezreal's Rising Spell Force

- Fiora's Bladework

- Gnar's Rage Gene and Hop

- Gwen's Skip 'n Slash

- Irelia's Ionian Fervor

- Jarvan IV's Demacian Standard

- Jax's Relentless Assault

- Jayce's Hyper Charge

- Jinx's Get Excited! and Pow-Pow

- K'Sante's All Out

- Kai'Sa's Supercharge

- Kayle's Divine Ascent

- Kennen's Lightning Rush

- Kindred's Dance of Arrows

- Kled's Violent Tendencies

- Kog'Maw's Caustic Spittle

- Lee Sin's Flurry

- Locke's Soul Ignition

- Master Yi's Highlander

- Miss Fortune's Strut

- Mordekaiser's Realm of Death

- Nilah's Formless Blade

- Nocturne's Shroud of Darkness

- Olaf's Berserker Rage and Tough It Out

- Qiyana's Terrashape with an *Element*

- Quinn's Heightened Senses

- Rek'Sai's Queen's Wrath

- Rell's Ferromancy: Mount Up

- Rengar's Savagery

- Rumble's Overheat

- Samira's Wild Rush

- Shen's Twilight Assault

- Sivir's Ricochet

- Skarner's Shattered Earth

- Sylas' Petricite Burst

- Taric's Bravado

- Teemo's Guerrilla Warfare

- Tristana's Rapid Fire

- Trundle's Frozen Domain

- Twisted Fate's Stacked Deck

- Twitch's Ambush

- Udyr's Monk Training and Wilding Claw

- Varus' Living Vengeance

- Vi's Denting Blows

- Viego's Harrowed Path

- Volibear's The Relentless Storm

- Warwick's Blood Hunt

- Wukong's Nimbus Strike

- Xayah's Deadly Plumage

- Xin Zhao's Audacious Charge

- Yunara's Cultivation of Spirit

- Zeri's Lightning Crash

### Enemy only

- Renata Glasc's Hostile Takeover

### Runes

- Hail of Blades

- Legend: Alacrity

- Lethal Tempo

- Attack speed rune shard

### Neutral buffs

- Hextech Prowess

## Decreasing attack speed

> *Main article: Types of Crowd Control#Cripple*

Attack speed reductions stack multiplicatively and reduce the unit's total attack speed value by a percentage. The duration of these reductions are affected by tenacity.

### Champion abilities

- Fiora's Riposte

- Malphite's Ground Slam

- Mordekaiser's Realm of Death

- Nasus' Wither

### Items

- Frozen Heart

## Champions with altered base attack speed at level 1

- Ahri

- Akshan

- Amumu

- Anivia

- Annie

- Aphelios

- Azir

- Brand

- Briar

- Caitlyn

- Cho'Gath

- Diana

- Dr. Mundo

- Ekko

- Gangplank

- Gragas

- Graves

- Heimerdinger

- Hwei

- Jhin

- K'Sante

- Kayle

- Kennen

- LeBlanc

- Lissandra

- Locke

- Lux

- Malphite

- Maokai

- Naafiri

- Nautilus

- Neeko

- Nilah

- Olaf

- Poppy

- Qiyana

- Rammus

- Ryze

- Sejuani

- Senna

- Seraphine

- Shen

- Singed

- Syndra

- Taliyah

- Tristana

- Tryndamere

- Twisted Fate

- Vel'Koz

- Vex

- Volibear

- Wukong

- Xerath

- Yasuo

- Zac

- Zeri

- Zilean

- Zoe

- Zyra

### List of champions' attack speed

> *Main article: List of champions' attack speed*

*Champions with the lowest or highest attack speed before items, runes, or abilities*

| Champion Level | Top 5 champions | Top 5 champions | Bottom 5 champions | Bottom 5 champions |
| --- | --- | --- | --- | --- |
| Level 1 | 1. Maokai | 0.8 AS | 1. Graves | 0.475 AS |
| Level 1 | 2. Shen | 0.751 AS | 2. Annie | 0.61 AS |
| Level 1 | 3. Zac 3. Amumu 3. Malphite | 0.736 AS | 3. Gnar 3. Sett 3. Soraka 3. Fiddlesticks 3. Diana 3. Mel 3. Mega Gnar 3. Sivir 3. Azir 3. Ezreal 3. Janna 3. Twisted Fate 3. Rell 3. Mordekaiser 3. Kled 3. Galio 3. Lillia 3. Ornn 3. Riven 3. Kindred 3. Yone 3. Yorick 3. Volibear 3. Jinx 3. Karma 3. Lulu 3. Malzahar 3. Yuumi 3. Talon 3. Kennen 3. Kayle 3. Taric 3. Zaahen 3. Renata Glasc 3. Senna 3. Neeko 3. Veigar 3. Morgana 3. Thresh 3. Alistar 3. Garen 3. Blitzcrank 3. Urgot 3. Aurelion Sol 3. Illaoi 3. Milio 3. Ambessa 3. Karthus 3. Skarner 3. Leona 3. Nunu & Willump 3. Darius 3. Elise 3. Jhin 3. Swain 3. Kled & Skaarl 3. Akali | 0.625 AS |
| Level 1 | 4. Nocturne | 0.721 AS | 4. Rakan | 0.635 AS |
| Level 1 | 5. Olaf | 0.72 AS | 5. Shyvana 5. Nasus 5. Nidalee 5. Akshan 5. Lucian 5. Smolder 5. Warwick 5. Jax | 0.638 AS |
|   |   |   |   |   |
| Level 20 | 1. Gnar | 1.362 AS | 1. Bel'Veth | 0.67 AS |
| Level 20 | 2. Kalista | 1.308 AS | 2. Mega Gnar | 0.686 AS |
| Level 20 | 3. Azir | 1.307 AS | 3. Darius 3. Jinx 3. Mordekaiser 3. Yuumi | 0.748 AS |
| Level 20 | 4. Caitlyn | 1.173 AS | 4. Blitzcrank | 0.764 AS |
| Level 20 | 5. Xayah | 1.163 AS | 5. Graves | 0.764 AS |

## Trivia

- For most units, including champions, their **base** attack speed and their attack speed **ratio** are equal, though this is not necessary.

- The majority of champions' **windup time** makes up around 15–30% of their attack's **total time**.

- The default attack speed cap was changed from 2.5 to 3.003 in patch V25.S1.3 (Feburary 2025) for the first time since the game's release in 2009.

- The first stat icon for **attack speed** was an edited red recolor of the icon for the item Stinger.

- The second stat icon for **attack speed**, which depicted an axe identical to attack damage, was updated to depict a sword on patch V25.16. The new icon coincidentally closely resembles the first stat icon, which also depicts a sword.

  - Its update was not announced to players—Riot Yasuna later gave a statement clarifying the change was taken from the same asset update being performed for the Teamfight Tactics icon.

***Last updated:** 20 April, 2026 – V26.08*
Without using any form of infinite stacking, the most **attack speed** a champion can have is **16.2885** with a level 18 Jinx.

- **Base AS:** 0.625 AS

- **Allies:**

  - Nidalee

  - Ornn

  - Renata Glasc

  - Yuumi

- **Enemy:**

  - Renata Glasc / Sylas

- **Items:**

  - Phantom Dancer (masterwork)

  - Guinsoo's Rageblade (full stacks)

  - Experimental Hexplate

  - Nashor's Tooth

  - Wit's End

  - Fiendhunter Bolts

  - Berserker's Greaves ( Botlane quest completed)

- **Runes:**

  - Hail of Blades

  - Legend: Alacrity (full stacks)

  - Attack speed rune shard

- **Buffs:**

  - Jinx's Pow-Pow

  - Renata Glasc's Hostile Takeover (from an enemy Renata or Sylas with stolen Renata ult)

  - Renata Glasc's Bailout (with  1359.8 AP)

  - Nidalee's Primal Surge (with Staff of Flowing Water for Renata and Yuumi)

  - Yuumi's Zoomies (with  1359.8 AP)

  - Ardent Censer's Sanctify

  - Bandlepipes' Fanfare (from Ornn)

  - Hextech Prowess x 4

  - Jinx's level 18 attack speed

- **AS Amplification:**

  - Jinx's Get Excited!

- **Relevant mathematics:**

  - Jinx's **total** AS:

    - **Items** = 65% + 33.33% + 25% + 32% + 25% + 30% + 50% + 50% + 45% + 50% + 25% = 430.33% **bonus** AS

    - **Runes** = 80% + 18% + 10% = 108% **bonus** AS

    - **Buffs** = 130% + 100% + 87.196% + 70% + 143.784% + 25% + 30%'s + 20% + 17% = 622.98% **bonus** AS

  - Jinx's **total** AS = (0.625 × (1 + 4.3033 + 1.08 + 6.2298)) ×  2.25 = 16.2885 **total** AS

***Last updated:** August 15th, 2024 – V14.16*
The most attack speed a champion can reach at level 1 with the initial 500 is **4.7891** with Jinx.

- **Base AS:** 0.625 AS

- **Item:**

  - One Dagger

- **Runes:**

  - Hail of Blades

  - Legend: Alacrity (no stacks)

  - Attack speed rune shard

- **Buffs:**

  - Jinx's Pow-Pow

  - Lulu's Whimsy

  - Nidalee's Primal Surge

  - Renata Glasc's Bailout (with  75.6 AP)

  - Yuumi's Zoomies (with  75.6 AP)

- **AS Amplification:**

  - Jinx's Get Excited!

- **Relevant mathematics:**

  - Jinx's **total** AS:

    - **Items** = 10% = 10% **bonus** AS

    - **Runes** = 80% + 3% + 10% = 93% **bonus** AS

    - **Buffs** = 25% + 30% + 31.048% + 21.512% + 30% = 137.56% **bonus** AS

  - Jinx's **total** AS = (0.625 × (1 + 0.10 + 0.93 + 1.3756)) ×  2.25 = 4.789125 **total** AS

## References

- ↑ Reddit — Yasuna (u/RiotYasuna) (13 August 2025) Hey folks! So sorry we missed this one in patch notes. We updated these to keep parity with TFT who recently did some updates to these icons.

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

| Death in Lavender |   |
| --- | --- |

| **Innate:** Bel'Veth has no attack speed cap, but her  attack speed does not grow by  leveling up. |
| --- |
| **Innate:** After casting an ability, **Bel'Veth** becomes ghosted and gains  **bonus** attack speed for a few seconds. |
| **Innate:** When **Bel'Veth** scores a takedown against an enemy champion or monster, she generates a permanent stack of *Lavender*. |
| **Lavender:** For each stack, **Bel'Veth** gains  **bonus** attack speed. |

 League of Legends content

| Stacked Deck |   |
| --- | --- |

| **Passive:** Twisted Fate gains  **bonus** attack speed. His basic attacks on-hit generate stacks of *Stacked Deck*, which stacks up to a cap. |
| --- |
| At max stacks, his next basic attack consumes them all to deal **bonus** magic damage. |

 League of Legends content

Cripple

A unit that is *crippled* has their **total**  attack speed reduced by a percentage for the duration.

Sources of *cripple* stack multiplicatively with each other.

Negative *cripple* values will increase the unit's attack speed instead.

| Interrupts: | Does not interrupt any actions. |
| --- | --- |
| Reduction: | The **duration** is affected by Tenacity. |
| Resist: | Resisted by crowd control immunity and cripple immunity. |
| Removal: | Removed by Cleanses and specifically Master Yi's Highlander. |

Crowd control applied by one's self or an ally cannot be countered in any way, neither *reduced* in duration, *resisted*, nor *removed* unless special cased to do so.

- The crowd control effect may still be cleansed if it is applied as a debuff separate from the originated ability.

 League of Legends content

Basic attack reset

An **attack reset** is a mechanic that will result in a champion's attack timer being reset to zero. When this effect takes place during the basic attack's cooldown and not its windup, it allows the attacker to start a second attack quicker than normal.

Certain abilities and item actives can reset the attack timer upon use. Hail of Blades generates an additional stack of its effect each time the user casts an ability or spell that has an **attack reset**.

 League of Legends content

| Get Excited! |   |
| --- | --- |

| **Innate:** Whenever Jinx scores a takedown against an enemy champion, epic monster, turret, or inhibitor shortly after damaging them, she gains a burst of  movement speed for a few seconds. |
| --- |
| During this time, she also gains  **bonus total** attack speed and is allowed to exceed the attack speed cap. |

 League of Legends content

| Lightning Rush | COOLDOWN: 10 / 9 / 8 / 7 / 6 |
| --- | --- |

| **Active:** Kennen becomes lightning, a ghosted form that gains  **bonus** movement speed for a short time. He deals magic damage to enemies he passes through and restores  energy if he damaged an enemy at all. *Lightning Rush* can be recast within the duration and automatically recasts afterwards. |
| --- |
| **Recast:** **Kennen** ends *Lightning Rush* to gain  **bonus** attack speed for a few seconds. Critical strikes extend the duration slightly. |

 League of Legends content

| Living Vengeance |   |
| --- | --- |

| **Innate:** When Varus kills an enemy, he gains  **bonus** attack speed,  **bonus** attack damage, and  ability power for a few seconds. The amount is based on his other sources of  **bonus** attack speed, and is increased on an enemy champion takedown. |
| --- |

 League of Legends content

| Purge | STATIC CD: 0.5 • 0.25 |
| --- | --- |

| **Passive:** Urgot's other abilities *mark* enemy champions hit for a few seconds, only one enemy can be *marked* at a time. |
| --- |
| **Active:** For a few seconds, **Urgot** autonomously attacks the nearest enemy at a  **fixed** attack speed, prioritizing the *marked* enemy. He also gains slow resist, but his movement speed is reduced. *Purge* can be recast within the duration, and does so automatically afterwards; at max rank however, *Purge* lasts indefinitely and becomes a **toggled** ability. |
| **Recast:** **Urgot** ends *Purge*. |
| *Purge's* attacks deal **modified** physical damage and cannot critically strike. |

 League of Legends content

| New Destiny |   |
| --- | --- |

| **Innate:** Graves' basic attacks consume up to 2 shells before needing to reload. The reload speed is reduced based on his  **bonus** attack speed. |
| --- |
| Each attack fires several pellets in a cone that each collide with the first enemy hit. Hitting a target with multiple pellets will deal increased damage, and non-champion enemies are additionally knocked back. |

 League of Legends content

| Whisper |   |
| --- | --- |

| **Innate - Death in 4 Acts:** Jhin's gun may fire up to 4 times before needing to reload for a short period. The final round will critically strike, dealing **bonus** physical damage based on the target's **missing** health. |
| --- |
| **Innate - Every Moment Matters:** **Jhin** gains  **bonus** attack damage, increased by his  critical strike chance and  **bonus** attack speed. Whenever he critically strikes, he gains a burst of  movement speed based on his  **bonus** attack speed. |
| **Jhin's**  attack speed cannot increase except by  leveling up, and he deals reduced critical strike damage. |

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

| Burst Fire | STATIC CD: 1 ÷ **Zeri's** attack speed |
| --- | --- |

| **Active:** Zeri fires a burst of 7 rounds in the target direction that each deal physical damage to the first enemy hit. This is treated as a basic attack, can critically strike, and applies on-hit and on-attack effects to the first enemy hit. |
| --- |
| The  cooldown scales down with  attack speed, up to a cap. A portion of the excess attack speed is converted into  **bonus** attack damage. |

 League of Legends content

| Lightning Crash | COOLDOWN: 80 / 75 / 70 |
| --- | --- |

| **Active:** Zeri explodes to deal magic damage to nearby enemies. If this hits at least one enemy champion, she enters *Overcharged* for a few seconds. Damaging an enemy will extend *Overcharged*. |
| --- |
| **Overcharged:** **Zeri** gains  **bonus** attack speed and  **bonus** move speed. * Burst Fire* is empowered to instead fire 3 rounds that can chain to up to 4 surrounding enemies, dealing physical damage. |
| During *Overcharged*, **Zeri** generates a stack of *Overcharge* for each enemy champion hit by her abilities and * charged* attacks, increased on abilities that critically strike. For each stack, she briefly gains  **bonus** move speed. |

 League of Legends content

| Alpha Strike | COOLDOWN: 20 / 19.5 / 19 / 18.5 / 18 |
| --- | --- |

| **Active:** Master Yi briefly vanishes and marks the target enemy, then rapidly marks up to 3 other nearby enemies. If there are no other eligible targets before then, **Master Yi** can mark the same enemies again. |
| --- |
| Upon finishing marking, he reappears and detonates the marks, dealing physical damage and applying on-hit effects. Subsequent marks on a target have less effect. |
| Basic attacks  reduce *Alpha Strike's* cooldown. |

 League of Legends content

| Endless Banquet | COOLDOWN: 1 |
| --- | --- |

| **Passive:** **Bel'Veth's** basic attacks deal **bonus** true damage and generates a stack that increases this damage against the same target. This effect can stack infinitely. |
| --- |
| **Passive:** Takedowns against enemy champions and epic monsters spawn a *Void Coral* for some time. Taking down Baron Nashor, the pit Rift Herald, or a Voidgrub spawns an *Enhance Void Coral*. |
| **Active:** Bel'Veth dashes to the target *Void Coral*, gradually slowing nearby enemies before violently exploding, dealing true damage based on their **missing** health and assuming her **True Form** for a while. **True Form's** duration increases as **Bel'Veth** gains stacks of *Lavender*, eventually lasting until death. |
| **True Form:** **Bel'Veth** gains bonus  health,  attack range, and increased **total** attack speed. During this time, * Void Surge* can dash through terrain. Consuming more *Void Corals* renews the form's duration and  heals her instead. **Enhanced Void Coral Bonus:** **True Form** is empowered to cause *Void Remora* to spawn from minions that die nearby. |

 League of Legends content

| Bravado |   |
| --- | --- |

| **Innate:** After casting an ability, Taric empowers his next two basic attacks to gain tremendous  **total** attack speed, deal **bonus** magic damage based on his **bonus** armor, and  reduce the cooldowns of his basic abilities. |
| --- |

 League of Legends content

| Zap! | COOLDOWN: 8 / 7 / 6 / 5 / 4 |
| --- | --- |

| **Active:** Jinx fires a shock bolt in the target direction that deals physical damage to the first enemy hit, slowing and revealing them for a short time. |
| --- |

 League of Legends content

| Supercharge | COOLDOWN: 16 / 14.5 / 13 / 11.5 / 10 |
| --- | --- |

| **Active:** Kai'Sa briefly becomes ghosted and gains  **bonus** move speed during the cast time, then gains  **bonus** attack speed for a few seconds. |
| --- |
| ** Living Weapon Bonus:** [**Requires  attack speed**] *Supercharge* briefly grants invisibility. |

 League of Legends content

| Radiant Blast | COOLDOWN: 12 / 11 / 10 / 9 / 8 |
| --- | --- |

| **Active:** Kayle summons a celestial sword that travels forward and expands upon hitting a target, dealing magic damage, slowing, and reducing the  armor and  magic resist of all targets struck. |
| --- |

 League of Legends content

| Formless Blade | COOLDOWN: 4 |
| --- | --- |

| **Passive:** Nilah gains  armor penetration based on her  critical strike chance. Also, her basic attacks and *Formless Blade* against champions heal her based on her  critical strike chance; overhealing becomes a shield that lasts a few seconds. |
| --- |
| **Active:** **Nilah** cracks her whip-blade in a line, dealing physical damage to enemies hit, increased based on her  critical chance. Casting *Formless Blade* during * Slipstream* leaves a wave behind instead that deals the same damage to enemies it passes through. |
| If *Formless Blade* hits an enemy, **Nilah** becomes empowered for a short time: gaining  attack range,  attack speed, and causing her attacks to strike in a cone. |

 League of Legends content

| Reckless Swing | COOLDOWN: 11 / 10 / 9 / 8 / 7 |
| --- | --- |

| **Active:** Olaf consumes  health to strike thunder onto the target enemy, dealing true damage. If this kills the target, **Olaf** heals the  health cost. |
| --- |
| Basic attacks  reduce *Reckless Swing's* cooldown. |

 League of Legends content

| Piercing Darkness | COOLDOWN: 15 |
| --- | --- |

| **Active:** Senna fires a spectral laser toward the target unit. **Senna** and allied champions hit are healed. Enemies hit are dealt physical damage, which applies  life steal and on-hit effects, and slowed for a short time. |
| --- |
| *Piercing Darkness'* cooldown is  reduced on-hit. |

 League of Legends content

| Boomerang Blade | COOLDOWN: 10 / 9.5 / 9 / 8.5 / 8 |
| --- | --- |

| **Active:** Sivir hurls her crossblade in the target direction that deals physical damage to enemies hit. |
| --- |
| At max range, it homes back to **Sivir** to deal physical damage to enemies hit. |

 League of Legends content

| Super Scorcher Breath | COOLDOWN: 5.5 / 5 / 4.5 / 4 / 3.5 |
| --- | --- |

| **Active:** Smolder spits a fireball that deals physical damage to the target enemy. |
| --- |
| *Super Scorcher Breath* becomes empowered with new effects based * Dragon Practice stacks*: **25 stacks:** The fireball explodes upon collision to deal physical damage to nearby enemies. **125 stacks:** The fireball sends forth bolts of fire that deal physical damage to enemies hit. The number of bolts increases based on stacks. **225 stacks:** Enemies hit will burn for true damage based on their **maximum** health over a short time. Enemy champions are also executed at low health based on stacks. |
| *Super Scorcher Breath* applies  life steal and on-hit and on-attack effects. |

 League of Legends content

| Noxian Diplomacy | COOLDOWN: 8 / 7.5 / 7 / 6.5 / 6 |
| --- | --- |

| **Active:** Talon leaps to the target enemy, dealing physical damage. If the target is within melee range, **Talon** will critically strike the target. |
| --- |
| If *Noxian Diplomacy* kills the target, **Talon** heals and  reduces its cooldown. |

 League of Legends content

| Explosive Charge | COOLDOWN: 16 / 15.5 / 15 / 14.5 / 14 |
| --- | --- |

| **Passive:** Enemies explode when killed by Tristana's basic attacks, dealing magic damage to nearby enemies. |
| --- |
| **Active:** **Tristana** tosses an explosive charge that attaches to the target enemy for a few seconds. The charge then explodes to deal physical damage to nearby enemies, increased based on  critical strike chance. |
| **Tristana's** basic attacks and abilities against the target will increase the charge's damage. Upon reaching the cap, the charge explodes instantly. |
| The charge can target and damage turrets and explodes farther on a turret. |

 League of Legends content

| Blade of the Ruined King | COOLDOWN: 5 / 4.5 / 4 / 3.5 / 3 |
| --- | --- |

| **Passive:** Viego's basic attacks deal **bonus** physical damage based on the target's **current** health. Additionally, **Viego's** damaging abilities apply a mark to enemies hit. His next basic attack will consume the mark to strike twice, dealing additional **modified** physical damage and healing him. |
| --- |
| **Active:** **Viego** stabs in a line in the target direction, dealing physical damage to enemies hit, increased based on his  critical strike chance. |
| *Blade of the Ruined King's* passive remains under * Possession*. |

 League of Legends content

| Double Daggers | COOLDOWN: 10 / 9.5 / 9 / 8.5 / 8 |
| --- | --- |

| **Active:** Xayah barrages out two Feathers that each deal physical damage to enemies hit. |
| --- |

 League of Legends content

| Steel Tempest | STATIC CD: 4 – 1.33 (based on **bonus** attack speed) |
| --- | --- |

| **Active:** Yasuo thrusts his sword in a line in the target direction that deals physical damage to enemies hit and applies on-hit and on-attack effects to the first enemy hit. This can critically strike. |
| --- |
| If this hits an enemy, **Yasuo** generates a stack of *Gathering Storm* for a few seconds. At 2 stacks, the next *Steel Tempest* consumes them all to become empowered with a new effect. |
| If *Steel Tempest* is cast during * Sweeping Blade*, it instead affects enemies around **Yasuo**. |
| **Gathering Storm Bonus:** **Yasuo** unleashes a whirlwind in the target direction that deals physical damage and briefly knocks up enemies hit. |

 League of Legends content

| Mortal Steel | STATIC CD: 4 – 1.33 (based on **bonus** attack speed) |
| --- | --- |

| **Active:** Yone thrusts his Steel Sword in a line in the target direction that deals physical damage to enemies hit and applies on-hit and on-attack effects to the first enemy hit. This can critically strike. |
| --- |
| If this hits an enemy, **Yone** generates a stack of *Gathering Storm* for a few seconds. At 2 stacks, the next *Mortal Steel* consumes them all to become empowered with a new effect. |
| **Gathering Storm Bonus:** **Yone** dashes in the target direction and unleashes a whirlwind in the same direction, both deal physical damage and briefly knocks up enemies hit. |

 League of Legends content

| Spirit Cleave | STATIC CD: 14 – 6 (based on **bonus** attack speed) |
| --- | --- |

| **Active:** Yone cleaves his Azakana Sword in a cone in the target direction, dealing equal parts physical and magic damage to enemies hit based on their **maximum** health. |
| --- |
| If this hits an enemy, **Yone** briefly shields himself, increased per champion hit. |

 League of Legends content

| Arc of Judgment | COOLDOWN: 10 |
| --- | --- |

| **Active:** Yunara launches a spinning prayer bead that briefly slows down upon hitting an enemy. The initial hit against each enemy deals magic damage and slows the target, and the bead continually deals magic damage to nearby enemies. |
| --- |
| Upon reaching maximum range, the bead expands and lingers briefly. |

 League of Legends content

| Arc of Ruin | COOLDOWN: 10 |
| --- | --- |

| **Active:** Yunara fires a beam of spirit magic in the target direction that deals magic damage to enemies and slows them for a short duration. |
| --- |
| *Arc of Ruin* is upgraded from * Arc of Judgment* during **Yunara's** * Transcendent State*. |

 League of Legends content

| Ultrashock Laser | COOLDOWN: 12 / 11 / 10 / 9 / 8 |
| --- | --- |

| **Active:** Zeri fires an electric pulse in the target direction that deals physical damage to the first enemy hit and slows them for a short duration. |
| --- |
| If this hits terrain, it transforms into a laser that fires in a line, dealing physical damage to enemies hit and critically striking against champions and monsters. |

 League of Legends content

| Void Surge | COOLDOWN: 4 / 3.25 / 2.5 / 1.75 / 1 |
| --- | --- |

| **Active:** Bel'Veth dashes in the target direction, though not through terrain, dealing physical damage to enemies she passes through. |
| --- |
| *Void Surge* can be cast only within a cardinal direction that is off cooldown, each direction has a unique  cooldown that scales down with her  **bonus** attack speed. |
| *Void Surge's* damage against the first enemy hit can critically strike and applies on-hit effects and  life steal. |

 League of Legends content

| Dirty Fighting |   |
| --- | --- |

| **Innate:** Akshan's basic attack causes him to fire a second attack that deals **reduced** physical damage. If **Akshan** cancels the second attack, he gains a brief burst of  move speed, increased based on his  attack speed. |
| --- |
| **Innate:** **Akshan's** attacks and abilities apply a stack to enemies hit. The third stack consumes them all to deal **bonus** magic damage; if the target was a champion, he also gains a brief shield. |

 League of Legends content

| Heroic Swing | COOLDOWN: 18 / 16.5 / 15 / 13.5 / 12 |
| --- | --- |

| **First Cast:** Akshan prepares to swing by firing a hook that embeds in the first terrain hit. *Heroic Swing's* second cast can be used while the hook is attached. |
| --- |
| **Second Cast:** **Akshan** swings around the terrain in a direction, firing physical damage bullets at the nearest enemy. He may swing indefinitely, or until he collides with an enemy champion or terrain. |
| **Third Cast:** While swinging, he can recast again to jump toward the target location and fire a final shot. *Heroic Swing's*  cooldown will reset upon scoring a champion takedown. |
| *Heroic Swing* applies on-hit effects. |

 League of Legends content

| Severum, the Scythe Pistol |   |
| --- | --- |

| Aphelios' basic attacks will heal him, and create a shield from excess healing. |
| --- |
| While Severum is the main weapon, his ability will be: |

| Onslaught | COOLDOWN: 10 – 8 (based on level) |
| --- | --- |

| **Active:** **Aphelios** gains **bonus**  movement speed and quickly attacks a nearby enemy with Severum and his current off-hand weapon, dealing physical damage. The number of attacks is increased based on his **bonus** attack speed. |
| --- |
| **Aphelios** can move during *Onslaught*. |

 League of Legends content

| Crescendum, the Chakram |   |
| --- | --- |

| Aphelios throws a chakram as his basic attack and he cannot attack again until it returns to him. Other abilities will create mirror chakrams that he gathers, and his basic attacks deal **bonus** physical damage based on how many mirror chakrams he holds. |
| --- |
| While Crescendum is the main weapon, his ability will be: |

| Sentry | COOLDOWN: 9 – 6 (based on level) |
| --- | --- |

| **Active:** **Aphelios** deploys a lunar sentry that gains a copy of his off-hand weapon and attacks with it, dealing physical damage. |
| --- |
