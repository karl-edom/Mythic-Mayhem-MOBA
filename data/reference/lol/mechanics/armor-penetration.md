Source: https://wiki.leagueoflegends.com/en-us/Armor_penetration

> LoL wiki page "Armor penetration" (revision 4035725), rendered HTML converted to Markdown by tools/extract/lol/mechanics.ts. Content © League of Legends Wiki contributors, CC BY-SA 3.0. Reference material for private research only.

# Armor penetration

> *Lethality* redirects here. For the 2013 Mastery, see Lethality.

**Armor penetration** is a champion statistic that determines the amount of a target's  armor that will be ignored when the user deals physical damage. **Percentage armor penetration** and **Lethality** have no effect if the target's armor is less than or equal to 0.

**Armor reduction** is an effect that reduces the target's armor for a period of time, by an amount or percentage. **Flat** armor reduction can reduce armor values below 0, while **percentage** armor reduction cannot.

It is important to note that **penetration** *treats* the target's resistances as being multiplied by a percentage or reduced by a flat amount, in contrast to **reduction** which applies to the target's resistances as a whole.

All champions have 0 base armor penetration and lethality, but they can be increased by items, runes, and with certain champions' passive ability effects.

Starting in V6.22, **lethality** replaced **flat armor penetration** as a statistic, and offered 40.33% – 100% (based on target's level) of the value as penetration. In V7.14, it was changed to scale with the user's level instead of the target's level, offering 62.22% – 100% (based on level) of the value as penetration. In V14.1 **lethality** was changed back to no longer scale by level; it grants the full amount of **flat armor penetration** at all levels, but keeps the name to differentiate it from *percent armor penetration* and emphasize its relative effectiveness against low-armor enemies rather than high-armor enemies. In V14.9, **lethality** was updated to be handled as an innate statistic rather than a scripted one.

## Order of calculations

Armor penetration and armor reduction are considered in the following order:

- Armor reduction, flat

- Armor reduction, percentage

- Armor penetration, percentage

- Armor penetration, flat (Lethality)

**Base** armor and **bonus** armor are calculated separately. Flat reductions affect the target's bonus amount first, then their base amount once the bonus amount reaches 0 (unless noted otherwise).

## Flat armor reduction

The target's armor is reduced by an amount. Flat armor reduction stacks additively and is distributed proportionally between base armor and bonus armor.

> *Example: 15 armor reduction against a 20 base armor and 40 bonus armor target will reduce base armor by 5 and bonus armor by 10, so the target will be reduced to 45 armor ((20 − 5) *+ * (40 − 10) = 45*)*.*

Flat armor reduction can reduce a target's armor below zero. For example, if an enemy with 10 armor has their armor reduced by 25, the enemy will have −15 armor.

## Percentage armor reduction

The target's armor is multiplied by a percentage (100% − the listed reduction). Applies to both base and bonus armor. Percentage armor reduction stacks multiplicatively and is ignored if the target's armor is 0 or less.

> *Example: 30% armor reduction multiplies the target's armor to 70%, so a target with 20 base armor and 40 bonus armor will be reduced to 42 armor ((20 × 0.7*) + (*40 × 0.7*)* = 42).*

Percentage armor reduction reduces more armor on targets with higher armor. For instance, with 40% armor reduction, a target with 200 armor will lose 80 while a target with only 50 armor will lose 20.

With 40% armor reduction, the physical damage dealt to a target with 50 armor is only increased by around 15%, whereas the physical damage dealt to a target with 200 armor is increased by around 36%.

If one wanted to calculate the total armor reduction after two consecutive percent armor reductions, the following formula may be useful:

 `CumulativePercentArmorReduction = r_1 + r_2 − r_1r_2`

Each *r* is the individual percent armor reductions. For example, the calculation of two armor reductions, 20% and 30%, would yield the following:

 `CumulativePercentArmorReduction = r_1 + r_2 − r_1r_2 = (.2) + (.3) − (.2)(.3) = 44%`

## Percentage armor penetration

The target's armor is treated as being multiplied by a percentage for purposes of damage calculation (100% − the listed penetration). Percentage armor penetration stacks multiplicatively and is ignored if the target's armor is 0 or less.

> *Example: 30% armor penetration causes the target to take damage as if its armor was multiplied by 70%, so a target with*20 base armor and 40 bonus armor will be treated as though it had 42 for purposes of damage *(the target's actual armor value will not change, however)*(*(20 × 0.7*)*+*(40 × 0.7) = 42).

Because the target's actual armor value does not change, anything else depending on that value also doesn't change.

Percentage armor penetration reduces more armor on targets with higher armor. For instance, with 40% armor penetration, a target with 200 armor will be considered as having 80 less while a target with only 50 armor will be considered as having 20 less.

*Gold Value*

- **Percent armor penetration** has a gold value of 41.666667 per point.

### Percentage bonus armor penetration

Percentage armor penetration that applies only to **bonus** armor.

> *Example: 30% bonus armor penetration multiplies the target's bonus armor to 70% without affecting base armor, so a target with 20 base armor and 40 bonus armor*will be treated as though it had 48 for purposes of damage calculation (the target's actual armor value will not change, however).*(20* + (*40 × 0.7*)* = 48).*

> If the unit has multiple sources of percentage bonus penetration, they stack multiplicatively:

> *Example: 10% armor penetration and 30% bonus armor penetration*.*(20  × 0.9))* + (*40 × 0.7 × 0.9)*)* = 43.2).*

Because the target's actual armor value does not change, anything else depending on that value also doesn't change.

Percentage bonus armor penetration reduces more armor on targets with higher **bonus** armor, but will not have an effect against base armor. For instance, with 40% **bonus** armor penetration, a target with 200 **bonus** armor will be considered as having 80 less while a target with only 50 **bonus** armor will be considered as having 20 less. In contrast, a target with any amount of base armor and no **bonus** armor will be considered as having the same value.

## Lethality

**Lethality** is the statistic that represents and grants flat armor penetration.

The target's armor is treated as being reduced by an amount for the purposes of damage calculation, but cannot be reduced below 0. Flat armor penetration stacks additively.

> *Example: 20 lethality on a user will cause a target to take damage as if its armor was 20 less, so a target with 30 armor will be treated as though it had 10 for purposes of damage calculation (the target's actual armor value will not change, however).*

Because the target's actual armor value does not change, anything else depending on that value also doesn't change.

*Gold Value*

- **Lethality** has a gold value of 30 per point, for more details see this page.

## Examples

Given 10 flat armor penetration and 45% bonus armor penetration, and the target is affected by 30 flat armor reduction and 30% armor reduction;

Target A has 300 armor (100 base and 200 bonus armor).

- The 300 is reduced to 270 (90 base and 180 bonus armor) by the 30 armor reduction.

- The 270 is reduced to 189 (63 base and 126 bonus armor) by the 30% armor reduction.

- The 189 is considered to be 132.3 (63 base and 69.3 bonus armor) by the 45% bonus armor penetration.

- The 132.3 is considered to be 122.3 by the 10 armor penetration.

- Target A takes damage as if it has 122.3 armor.

Target B has 18 armor.

- The 18 is reduced to −12 by the 30 armor reduction.

- The −12 is not affected by any further calculations because it is less than 0.

- Target B takes damage as if it has −12 armor.

## Lethality as scaling

The following have their stats improved based on the amount of lethality acquired:

### Champion abilities

- Pyke's Gift of the Drowned Ones, Ghostwater Dive, Phantom Undertow, and Death from Below

### Items

- Axiom Arc

- Bastionbreaker

- Umbral Glaive

## Increasing lethality

### Champion abilities

- Aphelios' The Hitman and the Seer

### Items

This table is automatically generated based on the data from Module:ItemData/data.

| Item | Cost | Amount | Availability |
| --- | --- | --- | --- |
| Axiom Arc Axiom Arc | 2750 | 18 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Bastionbreaker Bastionbreaker | 3000 | 22 | Nexus Blitz, Classic Summoner's Rift 5v5 |
| Duskblade of Draktharr Duskblade of Draktharr | 0 | 20 | Arena |
| Edge of Night Edge of Night | 3000 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Guardian's Dirk Guardian's Dirk | 500 | 11 | Arena |
| Hellfire Hatchet Hellfire Hatchet | 2500 | 12 | Arena |
| Hubris Hubris | 2800 | 18 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Lifeline Lifeline | 1600 | 5 | Nexus Blitz, All Random All Mid |
| Profane Hydra Profane Hydra | 2850 | 18 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Prowler's Claw Prowler's Claw | 0 | 22 | Arena |
| Regicide Regicide | 0 | 15 | Arena |
| Serpent's Fang Serpent's Fang | 2500 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Serrated Dirk Serrated Dirk | 1000 | 10 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Spectral Cutlass Spectral Cutlass | 2800 | 15 | Nexus Blitz, Arena, All Random All Mid |
| Talisman of Ascension Talisman of Ascension | 0 | 0 | Arena |
| The Brutalizer The Brutalizer | 1337 | 5 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| The Collector The Collector | 3000 | 10 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Ultra Hydra Ultra Hydra | 0 | 25 | ARAM: Mayhem |
| Umbral Glaive Umbral Glaive | 2800 | 18 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Voltaic Cyclosword Voltaic Cyclosword | 3000 | 10 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Youmuu's Ghostblade Youmuu's Ghostblade | 2800 | 18 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |

#### Item passives

- Voltaic Cyclosword

## Increasing percent armor penetration

### Champion abilities

- Ambessa's Public Execution

- Darius' Apprehend

- K'Sante's All Out*

- Nilah's Formless Blade

- Pantheon's Grand Starfall

- Zaahen's Grim Deliverance

### Items

This table is automatically generated based on the data from Module:ItemData/data.

| Item | Cost | Amount | Availability |
| --- | --- | --- | --- |
| Last Whisper Last Whisper | 1450 | 18% | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Lord Dominik's Regards Lord Dominik's Regards | 3300 | 35% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Mortal Reminder Mortal Reminder | 3000 | 30% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Perplexity Perplexity | 2500 | 22% | Arena |
| Serylda's Grudge Serylda's Grudge | 3000 | 35% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Talisman of Ascension Talisman of Ascension | 0 | 0% | Arena |

#### Item passives

- Terminus

## Reducing armor

### Champion abilities

**Percentage Reduction**

- Briar's Head Rush

- Garen's Judgment

- Jarvan IV's Dragon Strike

- Jayce's Transform Mercury Cannon

- Kayle's Radiant Blast

- Kog'Maw's Caustic Spittle

- Mordekaiser's Realm of Death

- Nasus' Spirit Fire

- Olaf's Undertow

- Rell's Break the Mold

- Renekton's Slice and Dice

- Sion's Roar of the Slayer

- Trundle's Subjugate

- Vi's Denting Blows

- Wukong's Crushing Blow

- Yorick's Mourning Mist

**Flat Reduction**

- Corki's Gatling Gun

- Rell's Break the Mold

- Rengar's Thrill of the Hunt

### Items

**Percentage Reduction**

- Black Cleaver

### Monsters

**Flat Reduction**

- Baron Nashor's Void Corruption

## Notes

- Armor penetration will apply to any and all sources of physical damage.

  - It will apply to the damage dealt to almost every type of unit, including turrets but not other structures like inhibitors and the Nexus.

- Armor reduction will affect the physical damage from any unit source.

- Percentage penetration is applied before flat penetration.

- Turrets and Dragons have 30% armor penetration.

- Gangplank's Powder Keg is special cased to ignore a percentage of the target's armor with its damage.

- Yasuo's Last Breath grants him a buff that causes his critical strike damage to ignore a percentage of the target's **bonus** armor.

## Trivia

### Highest Lethality

***Last updated:** January 10, 2026, patch V26.01*

The highest amount of lethality any champion can obtain in Summoner's Rift is **( 123 / 117)**.

- **Items:**

  - Bastionbreaker - 22

  - Opportunity - 18

    - **Preparation** grants an additional ( 11 / 5) lethality to a champion.

  - Axiom Arc - 18

  - Hubris - 18

  - Profane Hydra - 18

  - Umbral Glaive - 18

- **Calculation:**

  - **Items** = 22 + 18 + ( 11 / 5) + 18 + 18 + 18 + 18 = **( 123 / 117) lethality**

The highest amount of lethality obtainable in *Summoner's Rift* is **144** with Aphelios when the above items are equipped and The Hitman and the Seer's *Lethality* is at rank 6.

- 117 + 27 = **144**

### Highest Armor Penetration (%)

The highest amount of percentage armor penetration any champion can obtain is **35%** with Lord Dominik's Regards.

The highest amount of percentage armor penetration obtainable in the game is **61%** with Darius when Lord Dominik's Regards is equipped and Apprehend is at rank 5.

- Use the formula for armor:

  - (1 - 0.4) × (1 - 0.35) = 0.39

- Convert to armor penetration:

  - (1 - 0.39) × 100% = **61%** armor penetration

## Media

Armor reduced indicator

Armor reduced indicator

Armor and magic resistance reduced indicator

Armor and magic resistance reduced indicator

## See also

- Armor

- Magic penetration

- Champion statistic

## References

- ↑ https://web.archive.org/web/0/http://na.leagueoflegends.com/en/news/game-updates/patch/patch-72-notes#patch-items

- ↑ Lethality name

- ↑ If I technically had 100% armor reduction on an enemy... at LeagueOfLegends.com Boards

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

Stacks multiplicatively

An effect that **stacks multiplicatively** can be calculated by multiplying the effects together.

Most champion statistics that stack this way are expressed through percentages.

The following stats **stack multiplicatively**:

- Attack speed reduction

- Damage modifiers

- Percent armor penetration and reduction

- Percent magic penetration and reduction

- Slow potency reduction

 League of Legends content

| Gift of the Drowned Ones |   |
| --- | --- |

| **Innate:** Pyke gains  attack damage equal to a portion of his  bonus health. |
| --- |
| **Innate:** **Pyke** stores grey health when receiving damage from enemy champions, increased if there are multiple nearby. |
| **Pyke** can heal himself by consuming grey health while hidden. |
| **Pyke's**  maximum health cannot increase except by  leveling. |

 League of Legends content

| Ghostwater Dive | COOLDOWN: 14 / 13 / 12 / 11 / 10 |
| --- | --- |

| **Active:** Pyke submerges into water, entering camouflage and gaining a burst of  movement speed for a few seconds. Nearby enemies are alerted of his presence. |
| --- |
| Attacking or casting abilities ends *Ghostwater Dive* immediately. |

 League of Legends content

| Phantom Undertow | COOLDOWN: 15 / 14 / 13 / 12 / 11 |
| --- | --- |

| **Active:** Pyke dashes in the target direction, leaving behind a phantom and becoming ghosted. |
| --- |
| After a brief period, the phantom homes back to **Pyke** to briefly stun enemies it passes through. Enemy champions hit also take physical damage. |

 League of Legends content

| Death from Below | COOLDOWN: 100 / 85 / 70 |
| --- | --- |

| **Active:** Pyke strikes the target location in a X pattern, which executes enemy champions hit that are at low health. Other enemies hit are instead dealt physical damage. |
| --- |
| If *Death from Below* hits an enemy champion, **Pyke** will blink to the location. If an enemy champion dies inside the X, *Death from Below* can be recast within a period of time at no cost. |
| Each execution grants kill gold to both **Pyke** and the last assisting ally instead of the natural assist gold. |

 League of Legends content

| The Hitman and the Seer |   |
| --- | --- |

| **Innate:** Aphelios wields 5 Lunari Weapons made by his sister **Alune**. He has access to two at a time: main weapon and off-hand weapon. Each weapon grants him a unique basic attack and a primary ability. |
| --- |
| **Moonlight:** Attacks and abilities consume a weapon's ammo. When out of ammo, **Aphelios** discards the weapon to the reserve and **Alune** assembles the next of the 5. |
| **Weapon Master:** **Aphelios** cannot improve his abilities with skill points, instead he spend those for **bonus** stats:  attack damage,  attack speed, and  lethality. |

 League of Legends content

| Public Execution | COOLDOWN: 130 / 115 / 100 |
| --- | --- |

| **Passive:** Ambessa gains  armor penetration and heals for a percentage of the damage dealt by her active abilities. |
| --- |
| **Active:** **Ambessa** prepares a massive strike in a line in the target direction. She will seize the farthest enemy hit to blink behind them and suppress them, then crashes them into the ground, dealing physical damage and stunning them briefly. |
| **Ambessa** is displacement immune over the preparation and the target's suppression. |

 League of Legends content

| Apprehend | COOLDOWN: 26 / 23.5 / 21 / 18.5 / 16 |
| --- | --- |

| **Passive:** Darius gains  armor penetration. |
| --- |
| **Active:** **Darius** sweeps in a cone in the target direction, slowing and pulling enemies hit towards him. |

 League of Legends content

| All Out | COOLDOWN: 120 / 100 / 80 |
| --- | --- |

| **Active:** K'Sante roots an enemy and then shatters his tonfas, knocking them back, blinking behind them, and dealing physical damage. If the enemy is pushed into terrain, they will be knocked over it and take additional physical damage. |
| --- |
| The target is stunned at the end of the push, and also knocked up again if they were pushed through terrain. At the end, **K'Sante** goes *All Out* for some time. |
| **All Out:** **K'Sante's**  **maximum** health is greatly reduced and he loses a large portion of his **base**  armor and  magic resistance, but gains  **bonus** attack speed,  **bonus**-armor penetration, and  omnivamp. During this time, his basic abilities are empowered and have no  mana cost. |
| **Bonus**-armor penetration affects  **bonus** armor only. |

 League of Legends content

| Formless Blade | COOLDOWN: 4 |
| --- | --- |

| **Passive:** Nilah gains  armor penetration based on her  critical strike chance. Also, her basic attacks and *Formless Blade* against champions heal her based on her  critical strike chance; overhealing becomes a shield that lasts a few seconds. |
| --- |
| **Active:** **Nilah** cracks her whip-blade in a line, dealing physical damage to enemies hit, increased based on her  critical chance. Casting *Formless Blade* during * Slipstream* leaves a wave behind instead that deals the same damage to enemies it passes through. |
| If *Formless Blade* hits an enemy, **Nilah** becomes empowered for a short time: gaining  attack range,  attack speed, and causing her attacks to strike in a cone. |

 League of Legends content

| Grand Starfall | COOLDOWN: 180 / 165 / 150 |
| --- | --- |

| **Passive:** Pantheon gains  armor penetration. |
| --- |
| **Active:** **Pantheon** channels, then leaps high into the air. After a short time, he throws a spear at the target location that deals physical damage to nearby enemies and slows them. |
| **Pantheon** then crashes down and creates a shockwave alongside himself that travels toward the target location, dealing magic damage to enemies hit. |
| **Pantheon** gains full stacks of ** Mortal Will** upon landing. |

 League of Legends content

| Grim Deliverance | COOLDOWN: 110 / 95 / 80 |
| --- | --- |

| **Passive:** Zaahen gains  armor penetration. |
| --- |
| **Active:** **Zaahen** launches to the target location. He then slams his glaive, unleashing a shockwave that deals physical damage to nearby enemies and heals himself for a portion of the damage dealt to champions. |
| While performing *Grim Deliverance*, **Zaahen** is cc-immune and gains damage reduction. |
| ** Cc-immunity**: Crowd control cannot be applied during this time. |

 League of Legends content

| Head Rush | COOLDOWN: 13 / 12 / 11 / 10 / 9 |
| --- | --- |

| **Active:** Briar leaps to the target unit. If the target is an enemy, she deals physical damage, stuns them briefly, and additionally reduces their  armor and  magic resistance for a few seconds. |
| --- |
| *Head Rush* applies on-hit and on-attack effects. |

 League of Legends content

| Judgment | COOLDOWN: 9 / 8.25 / 7.5 / 6.75 / 6 |
| --- | --- |

| **Active:** Garen rapidly spins with his sword for a short time while ghosted, continually dealing physical damage to nearby enemies. He spins more based on his  **bonus** attack speed. |
| --- |
| The nearest enemy is dealt increased damage. Enemy champions hit by enough spins will have  reduced armor. |
| **Recast:** *Judgment* is ended early. |

 League of Legends content

| Dragon Strike | COOLDOWN: 10 / 9 / 8 / 7 / 6 |
| --- | --- |

| **Active:** Jarvan IV extends his lance in the target direction, dealing physical damage to enemies hit and  reducing their armor for a short time. |
| --- |
| If the lance connects with a deployed * Demacian Standard*, he will dash to its location, knocking up enemies he passes by. |

 League of Legends content

| Transform Mercury Cannon | COOLDOWN: 6 |
| --- | --- |

| **Active:** Jayce transforms into **Cannon Stance**, becoming ranged with greater  attack range and gaining new abilities. |
| --- |
| His next basic attack will reduce the target's  armor and  magic resist for a few seconds. |
| **Jayce** begins the game with *Transform* but cannot increase its rank. Instead, his basic abilities each have 6 ranks. |

 League of Legends content

| Radiant Blast | COOLDOWN: 12 / 11 / 10 / 9 / 8 |
| --- | --- |

| **Active:** Kayle summons a celestial sword that travels forward and expands upon hitting a target, dealing magic damage, slowing, and reducing the  armor and  magic resist of all targets struck. |
| --- |

 League of Legends content

| Caustic Spittle | COOLDOWN: 7 |
| --- | --- |

| **Passive:** Kog'Maw gains  **bonus** attack speed. |
| --- |
| **Active:** **Kog'Maw** ejects a wad of spittle in the target direction that deals magic damage to the first enemy hit, reducing their  armor and  magic resistance for a few seconds. |

 League of Legends content

| Realm of Death | COOLDOWN: 120 / 110 / 100 |
| --- | --- |

| **Active:** Mordekaiser slows the target enemy champion, then banishes them with him to the *Death Realm* for a few seconds, cancelling all interactions with non-banished units. |
| --- |
| Additionally, **Mordekaiser** heals himself for a portion of the target's **maximum** health and temporarily steals a portion of their **current**  attack damage,  ability power,  **total** attack speed,  **maximum** health,  armor,  magic resist, and size. |
| If the target dies while inside the *Death Realm*, **Mordekaiser** keeps his stolen stats until they respawn. |
| **Death Realm:** The *Death Realm* confines units in a small area. Allies and enemies cannot see or interact with those in the *Death Realm* but can see their locations and vice versa. |

 League of Legends content

| Spirit Fire | COOLDOWN: 12 |
| --- | --- |

| **Active:** Nasus unleashes a spirit fire at the target location that deals magic damage to enemies within. |
| --- |
| The fire remains for a few seconds,  reducing enemy armor and continually dealing magic damage. |

 League of Legends content

| Undertow | COOLDOWN: 9 |
| --- | --- |

| **Active:** Olaf throws an axe to the target location that deals physical damage to enemies it passes through, briefly slowing them based on distance travelled. Enemy champions hit also have  reduced armor for a few seconds. |
| --- |
| The axe remains in place during the cooldown, and **Olaf** can pick up the axe to reduce the  **total** cooldown. |

 League of Legends content

| Break the Mold |   |
| --- | --- |

| **Innate:** Rell's basic attacks deal **bonus** magic damage on-hit equal to a percentage of her **total** armor and **total** magic resistance. |
| --- |
| **Rell's** basic attacks and abilities apply a stack of *Break The Mold* to enemies hit for a few seconds. Each stack reduces the target's  armor and  magic resist and increases **Rell's**  armor and  magic resist by the same amount. |

 League of Legends content

| Slice and Dice | COOLDOWN: 16 / 14.5 / 13 / 11.5 / 10 |
| --- | --- |

| **Active - Slice:** Renekton dashes in the target direction, dealing physical damage to enemies he passes through. |
| --- |
| If he hits an enemy, he can recast *Slice and Dice* within the next few seconds. |
| **Recast - Dice:** **Renekton** dashes in the target direction, dealing physical damage to enemies he passes through. |
| ** Reign of Anger Bonus:** *Dice*, the recast, deals additional damage and  reduces enemy armor for a few seconds. |

 League of Legends content

| Roar of the Slayer | COOLDOWN: 12 / 11 / 10 / 9 / 8 |
| --- | --- |

| **Active:** Sion bellows a shockwave in the target direction that deals magic damage and shortly slows the first enemy hit,  reducing their armor for a few seconds. |
| --- |
| If the target is a minion or non-epic monster, they are also briefly stunned and knocked back, applying *Roar of the Slayer's* effects to enemies they pass through. |

 League of Legends content

| Subjugate | COOLDOWN: 120 / 100 / 80 |
| --- | --- |

| **Active:** Trundle drains the life force of the target enemy champion, dealing magic damage based on their **maximum** health and healing for the same amount. He also steals a portion of their  armor and  magic resist, and increases in size while reducing their size. |
| --- |
| Half of the damage and stealing is applied instantly, and the other half is applied over a few seconds. The armor and magic resist will remain stolen for a few seconds afterwards. |

 League of Legends content

| Denting Blows |   |
| --- | --- |

| **Passive:** Vi's basic attacks and * Vault Breaker* apply a stack of *Denting Blows*. |
| --- |
| The third stack consumes them all to deal **bonus** physical damage based on the target's **maximum** health and inflict  armor reduction for a few seconds. **Vi** will also gain  **bonus** attack speed for a few seconds. |

 League of Legends content

| Crushing Blow | COOLDOWN: 8 / 7.5 / 7 / 6.5 / 6 |
| --- | --- |

| **Active:** Wukong's next basic attack within a few seconds will gain  **bonus** range, deal **bonus** physical damage, and inflict  armor reduction for a short time. |
| --- |
| The cooldown is  reduced whenever **Wukong** or his * clone* damage an enemy. |

 League of Legends content

| Mourning Mist | COOLDOWN: 12 / 11 / 10 / 9 / 8 |
| --- | --- |

| **Active:** Yorick hurls a globule of Black Mist that splashes at the target location dealing magic damage to enemies. Enemy champions and monsters hit are also shortly slowed, and marked *Cursed* for a few seconds. |
| --- |
| **Yorick** and his summons gain  **bonus** movement speed toward a *Cursed* target. Mist Walkers will leap to a nearby *Cursed* target and focus them. |
| **Cursed:** The target has reduced armor. Nearby *graves* automatically raise a Mist Walkers. |

 League of Legends content

| Gatling Gun | COOLDOWN: 12 |
| --- | --- |

| **Active:** Corki's gatling gun rapidly fires in a frontal cone, continually dealing physical damage and applying stacks of *Gatling Gun* to enemies hit. |
| --- |
| **Gatling Gun:** For each stack, the target loses  armor and  magic resist. |

 League of Legends content

| Thrill of the Hunt | COOLDOWN: 100 / 90 / 80 |
| --- | --- |

| **Passive:** Rengar also gains * Unseen Predator* while camouflaged. |
| --- |
| **Active:** **Rengar** prowls for some time, gaining  **bonus** movement speed. After a short delay, he also becomes camouflaged and gains Unseen Predator. |
| During this time, **Rengar** will detect the nearest enemy champion in range, revealing them for the remaining full duration. As he approaches, he will mark the nearest detected enemy. **Rengar's** next basic attack will deal **bonus** physical damage, then  reduce the target's armor for a few seconds. |

 League of Legends content

Void Corruption

**Aura of Destruction:** Baron Nashor applies stacks of the **Void Corruption** debuff to his targets, lasting for 8 seconds and stacking up to 100 times. For each stack, the unit's  armor and  magic resistance are reduced by 0.5, up to a maximum total of 50 resistances reduction.

Baron Nashor applies two stacks of **Void Corruption** on his ranged basic attack and one stack through his *Corrosion* attack, which prioritizes the unit with the least stacks. Any attack or ability from Baron Nashor will refresh the duration of the debuff.

 League of Legends content

Physical damage

**Physical damage** is one of the three damage types.

- Applies:

  - Black Cleaver's Carve

  - Chempunk Chainsword's, Executioner's Calling's and Mortal Reminder's Grievous Wounds

  - Omnivamp

  - Physical vamp

- Triggers:

  - Armored Advance's Noxian Endurance

- Mitigated by:

  - Armor

  - Damage shields & Physical shields

  - Invulnerability

  - Damage reduction

  - Death's Dance's Ignore Pain

 League of Legends content

Turret

A **turret**, also called a **tower**, is a fortification that defends a part of territory. It provides vision of the area and autonomously fires homing bolts at nearby enemies, establishing a defensive ground for allies.

Turrets are most notable in Classic, defending against waves of enemy Minions from their ultimate goal of destroying the nexus. Champions work to destroy enemy turrets to push their assault into the enemies' territory. Turrets visually fall apart as they take damage.

 League of Legends content

| Powder Keg | RECHARGE: 17 / 16 / 15 / 14 / 13 |
| --- | --- |

| **Active:** Gangplank places a *Powder Keg* at the target location, which can be attacked or shot to damage it. If an enemy destroys a *Powder Keg*, it is safely dismantled. |
| --- |
| If **Gangplank** destroys a *Powder Keg*, it will explode to deal the attack's damage to nearby enemies and slow them. Against an enemy champion, the explosion additionally deals **bonus** physical damage and ignores a  portion of their armor. The explosion will cause nearby *Powder Kegs* to also explode. |
| **Gangplank** stocks a *Powder Keg* every few seconds, up to a maximum. |

 League of Legends content

| Last Breath | COOLDOWN: 70 / 50 / 30 |
| --- | --- |

| **Active:** Yasuo blinks to the target airborne enemy champion and instantly generates max Flow. He then briefly knocks up, reveals, and deals physical damage to all nearby airborne enemies. |
| --- |
| He becomes empowered for some time, causing his critical strikes to gain  **bonus**-armor penetration. |
| **Bonus**-armor penetration affects  **bonus** armor only. |

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

Melee

**Melee** champions have a basic attack  range usually within 200 units. A melee attack does not use a projectile to deal damage, therefore not subject to effects that mitigate projectiles, like Wind Wall. Some champions can shift between a ranged and melee form, and certain items/runes differ for melee characters.

 League of Legends content

Ranged

**Ranged** champions have a basic attack  range usually beyond 300 units. Many deal damage through projectiles, which are subject to mitigating effects like Wind Wall. Some champions can shift between a ranged and melee form, and certain items/runes differ for ranged characters.
