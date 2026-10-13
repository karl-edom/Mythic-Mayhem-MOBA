Source: https://wiki.leagueoflegends.com/en-us/Magic_penetration

> LoL wiki page "Magic penetration" (revision 4060414), rendered HTML converted to Markdown by tools/extract/lol/mechanics.ts. Content © League of Legends Wiki contributors, CC BY-SA 3.0. Reference material for private research only.

# Magic penetration

**Magic penetration** (also referred to as * **MPen***) is a champion statistic that determines the amount of a target's  magic resistance that will be ignored when the user deals magic damage. **Percentage magic penetration** and **flat magic penetration** have no effect if the target's magic resistance is less than or equal to 0.

**Magic resistance reduction** is an effect that reduces the target's magic resistance for a period of time, by an amount or percentage. **Flat** magic resistance reduction can reduce the value below 0, while **percentage** magic resistance reduction cannot.

It is important to note that **penetration** *treats* the target's resistances as being multiplied by a percentage or reduced by a flat amount, in contrast to **reduction** which applies to the target's resistances as a whole.

All champions have 0 base flat magic penetration and percent magic penetration, but they can be increased by items, runes, and with certain champions' passive ability effects.

## Order of calculations

Magic penetration and magic resistance reduction are considered in the following order:

- Magic resistance reduction, flat

- Magic resistance reduction, percentage

- Magic penetration, percentage

- Magic penetration, flat

**Base** magic resistance and **bonus** magic resistance are calculated separately. Flat reductions affect the target's bonus amount first, then their base amount once the bonus amount reaches 0 (unless noted otherwise).

## Flat magic resistance reduction

The target's magic resistance is reduced by an amount. Flat magic resistance reduction stacks additively.

> *Example: 20 magic resistance reduction reduces the target's magic resistance by 20, so a target with 30 magic resistance will be reduced to 10 magic resistance. (30 − 20 = 10)*

Flat magic resistance reduction can reduce a target's magic resistance below zero. For example, if an enemy with 10 magic resistance has their magic resistance reduced by 25, the enemy will have −15 magic resistance.

## Percentage magic resistance reduction

The target's magic resistance is multiplied by a percentage (100% − the listed reduction). Percentage magic resistance reduction stacks multiplicatively and is ignored if the target's magic resistance is 0 or less.

> *Example: 20% magic resistance reduction multiplies the target's magic resistance to 80%, so a target with 30 magic resistance will be reduced to 24 magic resist. (30 × 0.8 = 24)*

Percentage magic resistance reduction reduces more magic resistance on targets with higher magic resistance. For instance, with 40% magic resistance reduction, a target with 200 magic resistance will lose 80 while a target with only 50 magic resistance will lose 20.

With 40% magic resistance reduction, the magic damage dealt to a target with 50 magic resistance is only increased by around 15%, whereas the magic damage dealt to a target with 200 magic resistance is increased by around 36%.

If one wanted to calculate the total magic resistance reduction after two consecutive percent magic resistance reductions, the following formula may be useful:

 `CumulativePercentMagicResistanceReduction = r_1 + r_2 − r_1r_2`

Each *r* is the individual percent magic resistance reductions. For example, the calculation of two magic resistance reductions, 20% and 30%, would yield the following:

 `CumulativePercentMagicResistanceReduction = r_1 + r_2 − r_1r_2 = (.2) + (.3) − (.2)(.3) = 44%`

## Percentage magic penetration

The target's magic resistance is treated as being multiplied by a percentage for purposes of damage calculation (100% − the listed penetration). Percentage magic penetration stacks multiplicatively and is ignored if the target's magic resistance is 0 or less.

> *Example: 20% magic penetration causes the target to take damage as if its magic resistance was multiplied by 80%, so a target with 30 magic resistance will be treated as though it had 24 for purposes of damage calculation (the target's actual magic resistance value will not change, however).*

Because the target's actual magic resistance value does not change, anything else depending on that value also doesn't change.

Percentage magic penetration reduces more magic resistance on targets with higher magic resistance. For instance, with 40% magic penetration, a target with 200 magic resistance will be considered as having 80 less while a target with only 50 magic resistance will be considered as having 20 less.

*Gold Value*
​​

- **Percentage magic penetration** has a gold value of 46.15 per point.

## Flat magic penetration

The target's magic resistance is treated as being reduced by an amount for purposes of damage calculation, but cannot be reduced below 0. Flat magic penetration stacks additively.

> *Example: 20 magic penetration causes the target to take damage as if its magic resistance was 20 less, so a target with 30 magic resistance will be treated as though it had 10 for purposes of damage calculation (the target's actual magic resistance value will not change, however).*

Because the target's actual magic resistance value does not change, anything else depending on that value also doesn't change.

*Gold Value*
​​

- **Flat magic penetration** has a gold value of 46.67 per point.

## Examples

Given 10 flat magic penetration and 35% magic penetration, and the target is affected by 20 flat magic resistance reduction and 30% magic resistance reduction;

Target A has 80 magic resistance.

- The 80 is reduced to 60 by the 20 magic resistance reduction.

- The 60 is reduced to 42 by the 30% magic resistance reduction.

- The 42 is considered to be 27.3 by the 35% magic resistance penetration.

- The 27.3 is considered to be 17.3 by the 10 magic resistance penetration.

- Target A takes damage as if it has 17.3 magic resistance.

Target B has 18 magic resistance.

- The 18 is reduced to −2 by the 20 magic resistance reduction.

- The −2 is not affected by any further calculations because it is less than 0.

- Target B takes damage as if it has −2 magic resistance.

## Increasing flat magic penetration

### Items

This table is automatically generated based on the data from Module:ItemData/data.

| Item | Cost | Amount | Availability |
| --- | --- | --- | --- |
| Detonation Orb Detonation Orb | 0 | 12 | Arena |
| Jarvan I's Jarvan I's | 0 | 12 | ARAM: Mayhem |
| Shadowflame Shadowflame | 3200 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Sorcerer's Shoes Sorcerer's Shoes | 1100 | 12 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Spellslinger's Shoes Spellslinger's Shoes | 1100 | 20 | Classic Summoner's Rift 5v5 |
| Stormsurge Stormsurge | 2800 | 15 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Talisman of Ascension Talisman of Ascension | 0 | 0 | Arena |

## Increasing percent magic penetration

### Champion abilities

- Annie's Summon: Tibbers

- Mordekaiser's Death's Grasp

### Items

This table is automatically generated based on the data from Module:ItemData/data.

| Item | Cost | Amount | Availability |
| --- | --- | --- | --- |
| Blighting Jewel Blighting Jewel | 1100 | 13% | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Cryptbloom Cryptbloom | 3000 | 30% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Perplexity Perplexity | 2500 | 30% | Arena |
| Spellslinger's Shoes Spellslinger's Shoes | 1100 | 8% | Classic Summoner's Rift 5v5 |
| Talisman of Ascension Talisman of Ascension | 0 | 0% | Arena |
| Void Staff Void Staff | 3000 | 40% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |

#### Item passives

- Terminus

## Reducing magic resistance

### Champion abilities

**Percentage reduction**

- Briar's Head Rush

- Evelynn's Allure

- Jayce's Transform Mercury Cannon

- Karthus' Wall of Pain

- Kayle's Radiant Blast

- Kog'Maw's Caustic Spittle

- Mordekaiser's Realm of Death

- Rell's Break the Mold

- Rumble's Electro Harpoon

- Trundle's Subjugate

- Zoe's Sleepy Trouble Bubble

**Flat reduction**

- Corki's Gatling Gun

- Rell's Break the Mold

### Items

**Percentage reduction**

- Bloodletter's Curse

**Flat reduction**

- Malignance

### Monsters

**Flat reduction**

- Atakhan's Frail and Unworthy

- Baron Nashor's Void Corruption

## Notes

- Magic penetration will apply to any and all sources of magic damage.

  - It will apply to the damage dealt to any unit, including turrets.

- Magic resistance reduction will affect the magic damage from any unit source.

- Percentage penetration is applied before flat penetration.

## Trivia

> *Last updated: V25.05*

### Highest Magic Penetration (flat)

The highest amount of flat magic penetration any champion can obtain is **50**.

- **Items:**

  - Spellslinger's Shoes - 20

  - Shadowflame - 15

  - Stormsurge - 15

- **Relevant mathematics**:

  - **Items** = 20+ 15 + 15 = 50 **flat magic penetration**

### Highest Magic Penetration (%)

The highest amount of percentage magic penetration any champion can obtain is **44.8%** due to Void Staff and Spellslinger's Shoes.

- **Relevant mathematics:**

  - *(1 - 0.4) × (1 - 0.08) = 0.552*

    - *1 - 0.552* = *0.448* × 100 = **44.8%** magic penetration

The highest amount obtainable in the game is **55.84%** with Annie when she has Void Staff, Spellslinger's Shoes and her Summon: Tibbers is at rank 3.

- **Relevant mathematics:**

  - *(1 - 0.4) × (1 - 0.08) × (1 - 0.2) = 0.4416*

    - *1 - 0.4416* = *0.5584* × 100 = **55.84%** magic penetration

## Media

Magic resistance reduced indicator

Magic resistance reduced indicator

Armor and magic resistance reduced indicator

Armor and magic resistance reduced indicator

## See also

- Magic resistance

- Armor penetration

- Champion's stats

## References

- ↑ If I technically had 100% armor reduction on an enemy... at League of Legend

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

| Summon: Tibbers | COOLDOWN: 130 / 115 / 100 |
| --- | --- |

| **Passive:** Annie gains  magic penetration. |
| --- |
| **Active:** **Annie** summons her bear Tibbers, dealing magic damage to enemies in the area. |
| Tibbers deals magic damage with his attacks and also burns nearby enemies. Re-cast to direct him. |

 League of Legends content

| Death's Grasp | COOLDOWN: 16 / 14 / 12 / 10 / 8 |
| --- | --- |

| **Passive:** Mordekaiser gains  magic penetration. |
| --- |
| **Active:** **Mordekaiser** summons a claw in the target direction that grants sight of the area. After a brief time, it deals magic damage and pulls enemies hit. |

 League of Legends content

| Head Rush | COOLDOWN: 13 / 12 / 11 / 10 / 9 |
| --- | --- |

| **Active:** Briar leaps to the target unit. If the target is an enemy, she deals physical damage, stuns them briefly, and additionally reduces their  armor and  magic resistance for a few seconds. |
| --- |
| *Head Rush* applies on-hit and on-attack effects. |

 League of Legends content

| Allure | COOLDOWN: 15 / 14 / 13 / 12 / 11 |
| --- | --- |

| **Active:** Evelynn *curses* the target enemy, causing her next basic attack or ability against the target to *expunge* the *curse*, slowing the target and refunding the  mana cost. |
| --- |
| If the *curse* matures long enough, the *expunge* will increase the slow, charm the target, and apply an additional effect based on the target type. Champions have  reduced magic resist for a few seconds. Monsters are dealt **bonus** magic damage and increased charm duration. |

 League of Legends content

| Transform Mercury Cannon | COOLDOWN: 6 |
| --- | --- |

| **Active:** Jayce transforms into **Cannon Stance**, becoming ranged with greater  attack range and gaining new abilities. |
| --- |
| His next basic attack will reduce the target's  armor and  magic resist for a few seconds. |
| **Jayce** begins the game with *Transform* but cannot increase its rank. Instead, his basic abilities each have 6 ranks. |

 League of Legends content

| Wall of Pain | COOLDOWN: 15 |
| --- | --- |

| **Active:** Karthus erects a wall of pain at the target location that lasts a few seconds, enemies that touch it suffer reduced  magic resistance and become slowed for a few seconds. |
| --- |

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

| Break the Mold |   |
| --- | --- |

| **Innate:** Rell's basic attacks deal **bonus** magic damage on-hit equal to a percentage of her **total** armor and **total** magic resistance. |
| --- |
| **Rell's** basic attacks and abilities apply a stack of *Break The Mold* to enemies hit for a few seconds. Each stack reduces the target's  armor and  magic resist and increases **Rell's**  armor and  magic resist by the same amount. |

 League of Legends content

| Electro Harpoon | RECHARGE: 6 |
| --- | --- |

| **Active:** Rumble shoots a harpoon in the target direction that deals magic damage and briefly slows the first enemy hit, reducing their  magic resist for a few seconds. These effects can stack with multiple harpoons. |
| --- |
| **Rumble** periodically stocks an *Electro Harpoon*, up to a cap. |
| ** Danger Zone Bonus:** *Electro Harpoon's* effects are increased. |

 League of Legends content

| Subjugate | COOLDOWN: 120 / 100 / 80 |
| --- | --- |

| **Active:** Trundle drains the life force of the target enemy champion, dealing magic damage based on their **maximum** health and healing for the same amount. He also steals a portion of their  armor and  magic resist, and increases in size while reducing their size. |
| --- |
| Half of the damage and stealing is applied instantly, and the other half is applied over a few seconds. The armor and magic resist will remain stolen for a few seconds afterwards. |

 League of Legends content

| Sleepy Trouble Bubble | COOLDOWN: 18 / 17 / 16 / 15 / 14 |
| --- | --- |

| **Active:** Zoe kicks a bubble in the target direction that bursts upon the first enemy hit. At max range, it will linger as a trap for a few seconds that bursts upon enemy contact. |
| --- |
| The burst deals magic damage and briefly inflicts drowsy, which gradually slows them. Afterwards, the target falls asleep for a short time, during which they cannot act. |
| If the target is attacked during Sleep by an enemy champion, large monster, or turret, they wake up and take **bonus** true damage equal to the attack, up to a cap. |

 League of Legends content

| Gatling Gun | COOLDOWN: 12 |
| --- | --- |

| **Active:** Corki's gatling gun rapidly fires in a frontal cone, continually dealing physical damage and applying stacks of *Gatling Gun* to enemies hit. |
| --- |
| **Gatling Gun:** For each stack, the target loses  armor and  magic resist. |

 League of Legends content

Void Corruption

**Aura of Destruction:** Baron Nashor applies stacks of the **Void Corruption** debuff to his targets, lasting for 8 seconds and stacking up to 100 times. For each stack, the unit's  armor and  magic resistance are reduced by 0.5, up to a maximum total of 50 resistances reduction.

Baron Nashor applies two stacks of **Void Corruption** on his ranged basic attack and one stack through his *Corrosion* attack, which prioritizes the unit with the least stacks. Any attack or ability from Baron Nashor will refresh the duration of the debuff.

 League of Legends content

Magic damage

**Magic damage** is one of the three damage types.

- Applies:

  - Bloodletter's Curse's Vile Decay (conditionally)

  - Morellonomicon's and Oblivion Orb's Grievous Wounds

  - Omnivamp

- Triggers:

  - Hexdrinker's and Maw of Malmortius' Lifeline

- Mitigated by:

  - Magic resistance

  - Damage shields & Magic shields

  - Invulnerability

  - Damage reduction

  - Death's Dance's Ignore Pain

 League of Legends content

Turret

A **turret**, also called a **tower**, is a fortification that defends a part of territory. It provides vision of the area and autonomously fires homing bolts at nearby enemies, establishing a defensive ground for allies.

Turrets are most notable in Classic, defending against waves of enemy Minions from their ultimate goal of destroying the nexus. Champions work to destroy enemy turrets to push their assault into the enemies' territory. Turrets visually fall apart as they take damage.
