Source: https://wiki.leagueoflegends.com/en-us/Champion_statistic

> LoL wiki page "Champion statistic" (revision 4069636), rendered HTML converted to Markdown by tools/extract/lol/mechanics.ts. Content © League of Legends Wiki contributors, CC BY-SA 3.0. Reference material for private research only.

# Champion statistic

When referring to player units (such as champions) a **statistic** measures the magnitude of an unmodified basic attribute or capability. For example: how durable the unit is; how fast it is able to move; how quickly it is able to perform basic attacks; etc. An effect (e.g. how much damage an ability deals) that increases in strength by a statistic is said to "**scale with**" or "scale off of" that statistic. Scaling type can either directly or indirectly influence the champion's capabilities, and often heavily correlates to the champion's design. Statistics define a champion's **numerical** strength at various stages of the game or a fight, but not necessarily their overall strength—nevertheless, big differences in statistics also mean a substantial difference in the way different champions and champion classes interact with each other on the battlefield, as well as influence the game.

Units are typically given a group of non-zero, fundamental **base** stats by the game rules, while the remaining stats always have a **base** value of zero. A subset of those non-zero base stats can naturally improve, or **grow**, by leveling up.

- A **base** statistic is a statistic's unmodified value at level **1**.

- A **growth** statistic is an increase to the base amount that is gained explicitly by leveling up.

Increases and reductions to the statistics that are gained from any other source than leveling up, such as champion abilities, runes, items, buffs and debuffs, are called **bonuses**. The exception is attack speed growth, which is gained per level but uniquely counts toward the bonus amount.

## Types

There are 28 types of champion statistics divided into 4 different categories: Defensive, Offensive, Utility, Presence. In the list below, only the basic attribute of each statistic is presented. *In League of Legends, modified attacks, abilities, items, and runes, may freely scale off of **any** and/or **multiple** statistics (and sometimes other effects), whether in their damage, defense, cooldown, or any other attribute*.

### Defensive

- ** Health** [**HP**]: A champion dies when their health is reduced to zero. Some abilities and effects may scale off of your own, on your ally's, or on a target enemy's: current, bonus, missing, or maximum health.

- ** Health regeneration** [**HP5**]: The amount of health a champion passively restores per 5 seconds.

- ** Heal and shield power**: Increases the strength of certain healing and all shielding effects on yourself or allies. *See page for related attributes, mechanics, and exceptions*.

- ** Armor** [**AR**]: Reduces (mitigates) the amount of physical damage taken, thus increasing a champion's effective health against physical damage.

- ** Magic resistance** [**MR**]: Reduces (mitigates) the amount of magic damage taken, thus increasing a champion's effective health against magic damage.

- ** Tenacity**: Reduces the **duration** of most hostile crowd control effects/disables by a percentage. Stacking multiple sources of tenacity has diminishing returns. Disables cannot be reduced to under 0.3 seconds.

- ** Slow resist**: Reduces the **strength** of incoming hostile slows (movement speed reductions). The reduction is a percentage of the slow's strength.

### Offensive

- ** Attack speed** [**AS**]: The number of basic attacks your champion is allowed to perform per second. *See page for other relevant attributes*.

- ** Attack damage** [**AD**]: One of the two main offensive statistics, along with ability power. **Unmodified** basic attacks deal exactly this amount of damage.

- ** Ability power** [**AP**]: One of the two main offensive statistics, along with attack damage.

- ** Critical strike chance** [**Crit%**]: Denotes the chance that a basic attack will critically strike. Certain abilities can also critically strike for modified damage.

- ** Critical strike damage**: Denotes the damage dealt when a basic attack critically strikes. Abilities that can critically strike usually also benefit from critical strike damage.

- ** Armor penetration**: When applying physical damage to an enemy, ignores a part of their armor in the damage calculations. Armor penetration can be either flat (*lethality*) or percentage-based. The target's armor is unchanged.

- ** Magic penetration**: When applying magic damage to an enemy, ignores a part of their magic resistance in the damage calculations. Magic penetration can be either flat or percentage-based. The target's magic resistance is unchanged.

- ** Life steal**: How much health a champion restores, as a percentage of the post-mitigation damage dealt by basic attacks and on-hit effects.

- ** Physical vamp**: How much health a champion restores, as a percentage of all physical damage dealt. Physical vamp is only 33% as effective when dealing area damage or pet damage.

- ** Spell vamp**: How much health a champion restores, as a percentage of all ability damage dealt. Spell vamp is only 33% as effective when dealing area damage or pet damage.

- ** Omnivamp**: How much health a champion restores, as a percentage of all damage dealt. Omnivamp is only 20% as effective against non-champions.

### Utility

- All **haste**, but more commonly ** ability haste** [**AH**]: Reduces the cooldown of abilities by a percentage. Stacking ability haste itself has diminishing returns, but not in terms of cooldowns and casting.

  - Ability haste is just one of several forms of haste that a champion can obtain, but it is the only one actually displayed on a champion's statistics panel.

- **Resource** refers to a mechanic meant to gate and be spent on ability casting. Each resource has a maximum pool or amount, and may or may not regenerate passively. Resource and resource regeneration are counted as two distinct and innate statistics for **all** champions, regardless of whether they use a certain resource type or not. Below are listed two prevalent resources that interact with resource-generic effects, unlike all others. *For all non-mana–users, see here*.

  - ** Mana** [**MP**]: Mana is a longer-term resource that replenishes fairly slowly, but can be improved into great supply. Some effects may scale off a portion or all of your mana.

  - ** Mana regeneration** [**MP5**]: The amount of mana a champion passively restores per 5 seconds.

  - ** Energy**: Energy is a shorter-term resource that replenishes fairly quickly, but comes in limited supply compared to mana. All champions who use energy also have at least one means by which they are able to restore a flat amount of energy.

  - ** Energy regeneration**: The amount of energy a champion passively restores. Energy regeneration rate is a base of 50 energy per 5 seconds for all energy users, but it can be increased through a few effects.

- ** Attack range**: The maximum distance that a basic attack can be initiated from. Attack range is measured in game-distance units and refers to the distance from the source's edge to the target's edge.

  - When referring to **range** in general — abilities, item actives, and summoner spells' maximum distance and/or dimensions (where applicable) can also be included. Ability ranges have different targeting conditions.

- ** Movement speed** [**MS**]: How quickly a champion moves across the map, measured in game-distance units per second.

- ** Gold generation**: The rate at which a champion passively generates gold, measured per 10 seconds.

### Presence

- ** Gameplay radius**: The unit's dimensions for hitbox and visual purposes. This value can be increased or decreased via size modifiers.

- ** Pathing radius**: The unit's dimensions for determining unit collision. This value cannot be changed.

- ** Selection radius** and ** selection height**: The dimensions of the unit's virtual surfaces that allow selection of it by human players, in addition to its visual model. These values cannot be changed.

- ** Acquisition radius**: The radius of the unit's automatic seeking for basic attack targets while idling.  Attack range modifiers affect this value by the same amount, but no other effect can change it.

## Growing statistics

There are eight **base** stats that may increase through **growth**: attack damage, armor, magic resistance, health, health regeneration, mana, mana regeneration and attack speed.

The first seven growing stats' calculations use an explicit formula called the *growth formula*, which directly adds all amounts gained together. The primary growth formula may also be used for any other champion-related effect, including champion summons.

Attack speed calculations specifically use a slightly modified formula instead.

### Primary growth formula

To calculate the amount of a growing statistic that a champion has at a specific level, the following formula is used. This formula can be used for any level.

Statistic = base + bonus + g × (n − 1) × (0.7025 + 0.0175 × (n − 1))

Where:

- base = initial statistic value

- bonus = bonus statistic from any source (runes, items, buffs, etc.)

- g = growth statistic

- n = current level

- (n − 1) = total number of level ups

Growth stats cannot be modified (with the exception of when Gnar and Mega Gnar change forms).

### Attack speed growth

Attack speed is measured based on frequency, but it may only be increased and decreased by a percentage in *League of Legends*. Additionally, units are given a modifier to all attack speed bonuses by the game rules, called the attack speed *ratio*. For this purpose, all attack speed increases and reductions are considered bonuses including via growth—the growth of bonus attack speed however happens at the same rate as all other growing statistics.

The primary growth formula is adjusted to the following for attack speed calculations:

Total Attack Speed = ASbase + [ASbonus + g × (n − 1) × (0.7025 + 0.0175 × (n − 1))] × ASratio

Where:

- ASbase = base attack speed

- ASratio = attack speed ratio

- g = bonus attack speed growth, gained explicitly from leveling up

- ASbonus = sum of any percent bonus attack speed gained explicitly from any source except leveling up

- n = current level

- (n − 1) = total number of level ups

### Growth by level

The amount of the growth stat gained by leveling up increases linearly with each level; it is not constant. To achieve this formula, the growth formula is differentiated with respect to levels:

Stat Increase = g × (0.65 + 0.035 × n)

Where:

- g = growth statistic

- n = current level ≥ 2

The number in brackets determines the coefficient of the growth statistic, which increases with each level.

- When leveling up from level 1 to level 2, the champion gains 0.65 + 0.035 × 2 = 0.72 = 72% of the growth stat.

- When leveling up from level 9 to level 10, the champion gains 0.65 + 0.035 × 10 = 1.00 = 100% of the growth stat.

- When leveling up from level 17 to level 18, the champion gains 0.65 + 0.035 × 18 = 1.28 = 128% of the growth stat.

- When leveling up from level 19 to level 20, the champion gains 0.65 + 0.035 × 20 = 1.35 = 135% of the growth stat.

By level 18, a champion will have gained a total of 1700%, or 17 times, their growth statistic. In other words, a growing statistic will be equal to [ base + 17 × growth ] at level 18 when non-growth sources are ignored. The two next levels (for a total of 20) provide an additional 266.5% of the growth statistic value for a total of 1966.5% their growth statistic.

The amount of stats gained via growth is quadratic.

The amount of stats gained via growth is quadratic.

The rate of stat growth by level is linear.

The rate of stat growth by level is linear.

### Generic growth example

- Alistar starts the game at level 1 with 685 base health.

- His health growth stat is 120.

Alistar's base health at level 2 will be:

- 685 + 120 × (2 − 1) × (0.7025 + 0.0175 × (2 − 1))

- 685 + 120 × 1 × 0.72

- 685 + 86.4

- 771.4

On the HUD, that is rounded to **772**.

### Attack speed growth example

- Volibear starts the game at level 1 with 0.625 base attack speed.

- His attack speed ratio is 0.7.

- His bonus attack speed growth stat is 2% = 0.02.

- If he has 5 stacks of The Relentless Storm, he will also gain 5% × 5 = 25% = 0.25 bonus attack speed.

Volibear's attack speed at level 3 and while his passive is fully stacked will be:

- 0.625 + [0.25 + 0.02 × (3 − 1) × (0.7025 + 0.0175 × (3 − 1))] × 0.7

- 0.625 + [0.25 + 0.02 × 2 × 0.7375] × 0.7

- 0.625 + [0.25 + 0.02 × 1.475] × 0.7

- 0.625 + [0.25 + 0.0295] × 0.7

- 0.625 + [0.2795] × 0.7

- 0.625 + 0.19565

- 0.82065

On the HUD, that is rounded to **0.82** (or 0.821 in the tooltip within the champion stats panel).

## Non-growing statistics

Non-growing statistics are those which do not grow by leveling up. Most statistics do not grow.

The following statistics have a **non-zero** base value and are non-growing: all types of presence statistics, basic attack range, gold generation, critical strike damage and movement speed.

- Presence statistics cannot be zero, by strict limitation of the game.

- Every champion is given a base attack range and a base movement speed, neither of which increases naturally. *Natural increase means explicitly from leveling up itself—stats gained from innate abilities such as Tristana's Draw a Bead, despite scaling by level, are considered bonuses because they do not originate from growth.*

- All champions on the same map start the game with the same passive gold generation, which may or may not be zero.

- All champions on the same map start the game with the same  critical damage—even Ashe, Jhin, and others despite their innate abilities—which is by definition higher than 1.

All other statistics have a base value of **zero** and can only be increased via bonuses.

## Notes

- Statistics having a "base" value was established in patch V4.20, These are the values ***at* level 1**. These values can also be verified by entering a Practice Tool game with no runes and viewing the champion statistics panel.

  - The same patch changed stat growth from linear to quadratic (growth increases with increasing level).

- In the champion stats panels:

  - Attack damage, ability power, armor, magic resistance, attack speed, movement speed, ability haste and critical strike chance can be found in the basic (or default) stats menu (the player can show or hide the panel by clicking on the panel's button).

  - Health regeneration, mana regeneration, heal and shield power, armor penetration, magic penetration, life steal, physical vamp, omnivamp, attack range, and tenacity can be found in the advanced player stats menu (default **C** to toggle and **Ctrl** + **C** to cycle).

  - For each statistic, if its value is written in white then only the base amount is present, and if its value is is written in bold yellow then it has been increased from the base amount through bonuses. By hovering the cursor over almost any statistic, a tooltip can be accessed that includes extra information about the statistic and/or more precise values. Each stat can be hovered to show a tooltip that includes a brief description of a statistic, and total, base, and bonus values, in the format total (base + bonus). The base value is colored blue, and the bonus amount is colored green. If there is no bonus amount then the total value is colored blue, and if there are any bonuses then the total value is colored green. This coloring scheme applies to all visible stats, with the exceptions of armor penetration and magic penetration which are always written in blue (an inconsistency, but purely cosmetic nonetheless).

  - Armor and magic resistance also include the resulting damage reduction in their respective tooltips.

  - Ability haste also includes the resulting cooldown reduction in its respective tooltip.

  - Health regeneration and resource regeneration are presented together as "Regen" and in the format **Health regen. | Resource regen.**.

  - Armor penetration and magic penetration are presented in the format **Flat | Percentage**.

  - Total critical damage is not shown to the player. Within the critical strike chance tooltip, the base critical damage value is always listed regardless of any bonuses. The presented information also does not consider any other forms or values for critical strikes.

- Basic stats, which include health, resource, attack damage, ability power, armor, magic resistance, attack speed, movement speed, ability haste and critical strike chance (along with buffs and debuffs) are displayed on the target frame, when a unit is selected. Hovering the cursor over the health line or the resource line in the HUD additionally displays health regeneration and resource regeneration in amount per second, as opposed to the regular amount per 5 seconds. The player can also hover their cursor over their own health and resource bar to view these values per second.

## Infinite Stat Stacking

The following 17 champions have an ability that infinitely scales at least one of their statistics or abilities: Aurelion Sol,  Bard,  Bel'Veth,  Cho'Gath,  Draven,  Kindred,  Locke,  Mel,  Nasus,  Senna,  Shyvana,  Sion,  Smolder,  Swain,  Sylas,  Thresh, and  Veigar.

- Aurelion Sol can infinitely augment the potency of his abilities by collecting Stardust stacks.

- Bel'Veth can infinitely stack her attack speed with Lavender stacks.

- Cho'Gath can infinitely stack its health with Feast stacks.

- Draven can infinitely gain Adoration stacks, assuming he does not die.

- Kindred can infinitely stack the bonus attack speed gained from Dance of Arrows which scales based on how many Marks they have.

- Nasus can infinitely stack the bonus damage of his Siphoning Strike by using it to kill enemies.

- Senna can infinitely stack her bonus attack damage, bonus range, and life steal by converting critical strike chance beyond the cap from Mist stacks.

- Shyvana can infinitely stack her resistances from Scalemail.

- Sion can infinitely stack his health with Soul Furnace's passive stacks.

- Smolder can infinitely stack the bonus magic damage on his basic abilities, as well as the number of bolts and true damage of Super Scorcher Breath by collecting Dragon Practice stacks.

- Swain can infinitely stack his health with Soul Fragment stacks.

- Sylas can infinitely stack his health from Hijacking an enemy Cho'Gath's Feast and gaining stacks of the ability as they are permanent.

- Thresh can infinitely stack his ability power and armor from Soul stacks.

- Veigar can infinitely stack his ability power from Phenomenal Evil Power stacks.

While not a scaling, these champions also have an infinitely stacking effect:

- Yuumi can infinitely stack *Friendship* on ally champions with Feline Friendship. This is a stat exclusive to Yuumi.

- Mel can infinitely stack the Overwhelm debuff on enemy champions. This is however not a stat.

## Trivia

- In the HUD, if there are any positive bonuses present in a statistic, the number will be highlighted in yellow; it will remain grey otherwise.

  - Negative bonuses that reduce a statistic to the base value or less will also cause the number to be grey.

- Passive gold generation, slow resist, and total critical strike damage are the only statistics that have to be calculated by the player during the game, and are not explicitly displayed anywhere in the game's menus.

  - The current map's intrinsic gold generation is also not noted anywhere as a statistic.

- Heal and shield power was added as a functional statistic as a passive item effect in V6.13, standardized in V11.8 as a proper statistic, but only added to the stats panel in V14.10, almost eight years after its release.

- Lethality was implemented as a standard statistic in V14.9. Before this, it would be handled through scripts.

- Some statistics' effectiveness may also be relevant when combined with other statistics that both interact with a certain mechanic. For example, attack damage directly benefits the raw amount of health you gain back from life steal; both interact with the mechanic of basic attacks; and there is always an equilibrium of effectiveness among such statistics, depending on their availability at the time.

## See also

- Base champion statistics

- Champion statistics at level 20

## References

- ↑ Patch 4.20 Notes

**Champion statistics**

 League of Legends content

Area damage

**Area damage** (internally, AOE) is a secondary damage tag. Most champion, item and rune abilities that can hit targets within a zone are usually tagged **Area**.

This tag is generally restrictive and has the following interactions:

- Omnivamp heals with 33.3% effectiveness on instances of **area damage** against non-champions.

- Jax's Counter Strike grants 25% damage reduction against incoming **area damage**.

- Various champion summoned units such as Elise's Spiderlings, Naafiri's Packmates, and Yorick's Mist Walkers take reduced damage from **area damage** effects.

Effects triggered due to damage type ( physical, magic, true) will always occur regardless of classification (e.g. Black Cleaver's Carve stacking on instances of physical damage and Morellonomicon's Grievous Wounds application on instances of magic damage).

 League of Legends content

Pet damage

**Pet damage** is a secondary damage tag. Most basic attacks of champion summoned units are tagged **Pet**.

**Pet damage** is used primarily for damage attribution to their summoners. It is excluded from applying Elixir of Sorcery's damage on turrets via this attribution.

Effects triggered by damage subtypes ( physical, magic, true) will always occur regardless of damage type (e.g. Black Cleaver's Carve stacking on instances of physical damage and Morellonomicon's Grievous Wounds application on instances of magic damage).

 League of Legends content

Ability damage

**Ability damage** (internally, ActiveSpell) is a primary damage tag. Most active champion and item abilities are usually tagged **Ability**.

This damage tag invariably allows triggering ability effects (e.g. Luden's Echo's Echo, Muramana's Shock, Rylai's Crystal Scepter's Rimefrost).

Effects triggered due to damage type ( physical, magic, true) will always occur regardless of classification (e.g. Black Cleaver's Carve stacking on instances of physical damage and Morellonomicon's Grievous Wounds application on instances of magic damage).

 League of Legends content

Gameplay radius

A unit's **gameplay radius** is a stat that most closely resembles the concept of a 'hitbox', and is the radius used for edge range effects, which include basic attacks, line collision missiles, rectangular AOEs, and others. The gameplay radius determines the reach of both incoming and outgoing effects: for example, enemies are within a unit's  basic attack range based on the edge of their gameplay radius and vice versa.

 League of Legends content

Pathing radius

A unit's **pathing radius** is a stat that determines the gameplay area they occupy for unit-collision and pathfinding logic. A unit's center cannot intersect with another unit's **pathing radius**, unless one of them is ghosted.

 League of Legends content

Selection radius

A unit's **selection radius** is a stat that determines the horizontally furthest point from the center of their model that other players' cursor is allowed to be, while still maintaining the ability to select that unit.

 League of Legends content

Selection height

A unit's **selection height** is a stat that determines the vertically furthest point from the center of their model at the ground that other players' cursor is allowed to be, while still maintaining the ability to select that unit.

Gameplay in League of Legends takes place in two dimensions no matter the visuals. However, a virtual *height* dimension that is perpendicular to the ground creates the game's three-dimensional view, which in combination with the camera's perspective necessitates the usage of the **selection height**.

 League of Legends content

Acquisition radius

A unit's **acquisition range** is a stat that determines the distance at which they will acquire basic attack targets when a target unit is not specified by the player.

- Auto-attacking *automatically* orders an idle champion to acquire enemies within this range. This can be disabled in the Settings.

- Attack-move commands scan for targets within this range while moving toward a given location.

**Acquisition range** is calculated from the champion's edge to the edge of other units.
Attack range bonuses modify the champion's **acquisition range** by the same amount.

 League of Legends content

| The Relentless Storm |   |
| --- | --- |

| **Innate:** Volibear's basic attacks and ability hits generate a stack of *The Relentless Storm*, which stacks up to 5 times. At 5 stacks, he gains Lightning Claws. |
| --- |
| **The Relentless Storm:** For each stack, **Volibear** gains  **bonus** attack speed. **Lightning Claws:** **Volibear's** basic attacks deal **bonus** magic damage that can chain to up to four surrounding enemies. |

 League of Legends content

| Draw a Bead |   |
| --- | --- |

| **Innate:** Based on level, Tristana gains  **bonus** range on her basic attacks, * Explosive Charge* and * Buster Shot*. |
| --- |

 League of Legends content

Critical strike

**Critical strike** refers to an effect that deals increased damage under specific circumstances, denoted as  critical strike damage. The most common form of critical strike occurs on basic attacks, which triggers based on  critical strike chance.

By default, a critical strike deals 200% of the normal damage. Critical damage modifiers such as Infinity Edge can increase this percentage.

 League of Legends content

| Cosmic Creator |   |
| --- | --- |

| **Innate:** Aurelion Sol's damaging abilities against enemies generate him permanent stacks of Stardust, which gradually augments his abilities. * Breath of Light's* bursts deal **bonus** magic damage based on the target's **maximum** health. * Astral Flight's* distance is increased. * Singularity's* area and execute threshold are increased. * Falling Star*/* The Skies Descend* has increased impact area. |
| --- |

 League of Legends content

| Death in Lavender |   |
| --- | --- |

| **Innate:** Bel'Veth has no attack speed cap, but her  attack speed does not grow by  leveling up. |
| --- |
| **Innate:** After casting an ability, **Bel'Veth** becomes ghosted and gains  **bonus** attack speed for a few seconds. |
| **Innate:** When **Bel'Veth** scores a takedown against an enemy champion or monster, she generates a permanent stack of *Lavender*. |
| **Lavender:** For each stack, **Bel'Veth** gains  **bonus** attack speed. |

 League of Legends content

| Feast | COOLDOWN: 80 / 70 / 60 |
| --- | --- |

| **Active:** Cho'Gath devours an enemy, dealing true damage based on **Cho'Gath's bonus** health. If this attack kills the target, **Cho'Gath** gains a permanent *Feast* stack that infinitely stacks. |
| --- |
| **Feast:** For each stack, **Cho'Gath** gains  **bonus** health,  **bonus** attack range and increased size. |

 League of Legends content

| League of Draven |   |
| --- | --- |

| **Innate:** Draven gains an *Adoration* stack when he catches a Spinning Axe or kills a minion, monster, or turret. He loses *Adoration* stacks when he dies. |
| --- |
| When **Draven** kills an enemy champion, he consumes all *Adoration* stacks to gain **bonus** gold. |

 League of Legends content

| Dance of Arrows | COOLDOWN: 9 |
| --- | --- |

| **Active:** Lamb dashes toward the target location, gaining  **bonus** attack speed for a few seconds. She then fires at up to three nearby enemies, dealing physical damage. |
| --- |
| This cooldown is  reduced by casting * Wolf's Frenzy* or using *Dance of Arrows* within its area. |

 League of Legends content

| Mark of the Kindred | TARGET IMMUNITY: 240 |
| --- | --- |

| **Innate:** Both Lamb and Wolf mark targets to *hunt*. Scoring a takedown against a *hunted* target collects a permanent stack of *Mark of the Kindred*. **Lamb** can select an enemy champion to *hunt*, and **Wolf** automatically selects a large monster to *hunt*. |
| --- |
| **Mark of the Kindred:** **Lamb** gains  **bonus** range on her basic attacks and * Mounting Dread*. For each stack, Kindred's abilities become more potent. |

 League of Legends content

| Siphoning Strike | COOLDOWN: 7.5 / 6.5 / 5.5 / 4.5 / 3.5 |
| --- | --- |

| **Active:** Nasus' next basic attack within a period will gain  **bonus** range and deal **bonus** physical damage based on the amount of Siphoning Strike stacks. |
| --- |
| If this attack kills the target, **Nasus** generates permanent stacks of Siphoning Strike, increased against champions, large minions, and large monsters. |

 League of Legends content

| Absolution | TARGET IMMUNITY: 6 / 5 / 4 (based on level) |
| --- | --- |

| **Innate - Weakened Soul**: Senna's basic attacks on-hit and abilities against enemy champions apply a stack of *Mist* for a few seconds. Subsequent hits collect the *Mist*, dealing **bonus** physical damage based on the target's **current** health and rendering the target immune to further *Mist* applications for a few seconds. |
| --- |
| Enemies that die near **Senna** may spawn a *Mist Wrath* from their corpse, which lasts for a period. She can kill *Mist Wraiths* to gain gold and *Mist* stacks. |
| **Innate - Relic Cannon**: **Senna's** basic attacks deal **bonus** physical damage and briefly grant her  **bonus** movement speed based on the target's movement speed. |
| **Mist**: For each stack, **Senna** gains  **bonus** attack damage. For every few stacks, she also gains  **bonus** attack range and  critical strike chance, or  life steal if she has max critical strike chance. |

 League of Legends content

| Scalemail |   |
| --- | --- |

| **Innate:** **Shyvana** generates *Scalemail* stacks from scoring takedowns against certain enemies. Large monsters and large minions grant a stack, while enemy champions and epic monsters grant more. |
| --- |
| **Scalemail:** For each stack, **Shyvana** gains  **bonus** armor and  **bonus** magic resist. |

 League of Legends content

| Soul Furnace | COOLDOWN: 15 / 14 / 13 / 12 / 11 |
| --- | --- |

| **Passive:** Sion gains  **bonus** health whenever he kills an enemy, increased against large enemies and champion takedowns. |
| --- |
| **Active:** **Sion** gains a shield based on his **maximum** health that lasts a few seconds. *Soul Furnace* can be recast while the shield holds, and does so automatically after the duration. |
| **Recast:** **Sion** consumes the shield to deal magic damage to nearby enemies based on their **maximum** health. |

 League of Legends content

| Super Scorcher Breath | COOLDOWN: 5.5 / 5 / 4.5 / 4 / 3.5 |
| --- | --- |

| **Active:** Smolder spits a fireball that deals physical damage to the target enemy. |
| --- |
| *Super Scorcher Breath* becomes empowered with new effects based * Dragon Practice stacks*: **25 stacks:** The fireball explodes upon collision to deal physical damage to nearby enemies. **125 stacks:** The fireball sends forth bolts of fire that deal physical damage to enemies hit. The number of bolts increases based on stacks. **225 stacks:** Enemies hit will burn for true damage based on their **maximum** health over a short time. Enemy champions are also executed at low health based on stacks. |
| *Super Scorcher Breath* applies  life steal and on-hit and on-attack effects. |

 League of Legends content

| Dragon Practice |   |
| --- | --- |

| **Innate:** Smolder generates a stack of *Dragon Practice* from damaging champions with abilities, or when * Super Scorcher Breath* kills minions and monsters. His basic abilities deal **bonus** magic damage based on stacks. |
| --- |

 League of Legends content

| Ravenous Flock |   |
| --- | --- |

| **Innate:** Enemy champions that die will leave behind a Soul Fragment for some time. Swain will collect nearby Soul Fragments, as well as with * Vision of Empire* and * Nevermove*. |
| --- |
| **Soul Fragment:** For each stack, **Swain** gains  **bonus** health. Upon collection, he will heal for a portion of his **maximum** health. |

 League of Legends content

| Hijack | COOLDOWN: 80 / 55 / 30 |
| --- | --- |

| **Active:** Sylas launches his chains at the target enemy champion, gaining a copy of their ultimate ability and briefly revealing them. He cannot steal from the same champion again for a while, and can hold the *hijacked* ability for some time, during which he can recast *Hijack*. |
| --- |
| **Recast:** **Sylas** casts his *hijacked* ability at no cost. |
| *Hijacked* abilities that do not scale with  ability power have their  attack damage ratios converted to ability power ratios. |

 League of Legends content

| Damnation |   |
| --- | --- |

| **Innate:** Thresh's  armor does not increase by  leveling up. |
| --- |
| **Innate:** Enemy champions and large enemies that die near **Thresh** will drop a *Soul* for a period. **Thresh** automatically collects *Souls* near him or * Dark Passage*. |
| **Soul:** For each stack, **Thresh** gains  ability power and  **bonus** armor. |

 League of Legends content

| Phenomenal Evil Power |   |
| --- | --- |

| **Innate:** Veigar generates a stack of *Phenomenal Evil* for each enemy champion hit by his abilities, and more stacks when he scores an enemy champion takedown. |
| --- |
| **Phenomenal Evil:** For each stack, **Veigar** gains  ability power. |

 League of Legends content

| Feline Friendship | STATIC CD: 20 – 8 (based on level) |
| --- | --- |

| **Innate:** Periodically, Yuumi's next basic attack or ability hit against enemy champions will  heal her. If she is * attached* to an ally within a short time, they are healed as well. |
| --- |
| **Innate:** While * attached* to an ally, **Yuumi** grants them permanent *Friendship* stacks for killing enemy champions and minions. The ally with the highest *Friendship* stacks becomes **Yuumi's** *Best Friend*, which empowers her abilities while she is * attached* to them. |

 League of Legends content

| Searing Brilliance |   |
| --- | --- |

| **Innate - Overwhelm:** Mel's damaging basic attacks and abilities apply a stack of *Overwhelm* to enemies hit for a few seconds, stacking infinitely. Each stack stores magic damage; if the total stored damage would kill the target, the next stack will consume them all to detonate the damage. |
| --- |
| **Innate:** **Mel's** ability casts each generate stacks for a few seconds, up to a cap. Her next basic attack consumes all stacks to additionally fire an equal number of bolts dealing magic damage. |
