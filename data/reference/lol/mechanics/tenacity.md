Source: https://wiki.leagueoflegends.com/en-us/Tenacity

> LoL wiki page "Tenacity" (revision 4021927), rendered HTML converted to Markdown by tools/extract/lol/mechanics.ts. Content © League of Legends Wiki contributors, CC BY-SA 3.0. Reference material for private research only.

# Tenacity

**Tenacity**, or **Crowd Control Reduction**, is a stat that reduces the duration of all incoming crowd control status effects (*disables*) except airborne, drowsy, nearsight, stasis, and suppression.

Tenacity is a percentage, and it indicates by how much the disable's duration is reduced. Any disable's duration cannot be reduced below 0.3 seconds*. The disable's duration is calculated at the moment of application, and does **not** change during it if **tenacity** changes.

- Tenacity stacks either multiplicatively or additively, depending on the combination of the effects.

Tenacity can be increased (self- or ally-sourced) and decreased (enemy-sourced) from abilities, buffs, items, runes, and summoner spells.

*Gold Value*

- **Tenacity** has a gold value of 10.333334 per point, for more details see this page.

## Increasing tenacity

### Items

This table is automatically generated based on the data from Module:ItemData/data.

| Item | Cost | Amount | Availability |
| --- | --- | --- | --- |
| Chainlaced Crushers Chainlaced Crushers | 1250 | 30% | Classic Summoner's Rift 5v5 |
| Endless Hunger Endless Hunger | 3100 | 20% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Jarvan I's Jarvan I's | 0 | 30% | ARAM: Mayhem |
| Mercury's Treads Mercury's Treads | 1250 | 30% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Moonflair Spellblade Moonflair Spellblade | 0 | 30% | Arena |
| Sterak's Gage Sterak's Gage | 3200 | 20% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Wit's End Wit's End | 2800 | 20% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Zephyr Zephyr | 2500 | 20% | Arena |

#### Item actives and passives

- Elixir of Iron

- Protoplasm Harness

### Champion abilities

- Garen's Courage

- Milio's Breath of Life

### Runes

- Tenacity and slow resist rune shard

### Summoner Spells

- Cleanse

### Neutral Buffs

- Chemtech Blight

### Game Modes

- ARAM (Champion-specific)

- Ultra Rapid Fire

- Ultimate Spellbook

## Decreasing tenacity

Note that **tenacity** can have negative values, which will cause incoming disables to last longer.

### Champion Abilities

- Ornn's Bellows Breath and Call of the Forge God apply Brittle, a unique status effect that reduces targets' tenacity by 30%.

## Stacking

The **tenacity** stat is built up from sub-stats that internally are referred to as "modifiers" and are part of three different groups, labelled A, B, or C. Modifiers within the same group stack **multiplicatively**, while the different groups stack **additively** with each other.

**Tenacity** is capped at 100%.

The mathematics regarding the **total** tenacity is as follows:

*(1 - ((1 - A1)(1 - A2)(1 - ...))) + (1 - ((1 - B1)(1 - B2)(1 - ...))) + (1 - ((1 - C1)(1 - C2)(1 - ...)))*

|   | Source |
| --- | --- |
| Group A | Elixir of Iron Mercury's Treads Protoplasm Harness Sterak's Gage Wit's End Endless Hunger Tenacity and slow resist rune shard Chemtech Blight |
| Group B | Milio's Breath of Life Cleanse Map/mode-specific adjustments such as for ARAM, Ultimate Spellbook, Ultra Rapid Fire, etc. |
| Group C | Garen's Courage Brittle Rift Scuttler's innate negative tenacity |

For instance, a champion has Mercury's Treads and Wit's End equipped, and they have been debuffed by Brittle's tenacity reduction from an enemy. The sum of their **tenacity** is calculated as follows:

- **Group A** Tenacity modifiers = 30% ×  20%

- **Group C** Tenacity modifier = -30%

- **Final** Tenacity = (1 - ((1 - ) × (1 - )) Group A Tenacity modifiers + Group C Tenacity modifier

- = (1 - ((1 - 0.3) × (1 - 0.2)) + -0.3

- = (1 - (0.7 × 0.8)) + -0.3

- = 0.44 + -0.3 = **14%**

## Trivia

- Until patch V1.0.0.118, **Tenacity** was an unnamed effect unique to Mercury's Treads. That patch promoted the effect to a champion statistic and added three new items: Cloak and Dagger, Eleisa's Miracle and Moonflair Spellblade (all later removed). **Tenacity** from multiple sources did not stack, similar to Enhanced Movement. In Season Three (2013) there was an item overhaul, named item effects were introduced, and **Tenacity** was reverted to an item effect. In V3.01, all sources of crowd control reduction were changed to say "Tenacity" and **Tenacity** was reintroduced as a champion statistic.

- Until Season Three (2013), **Tenacity's** in-game icon was the same as the icon used for Cho'Gath's Vorpal Spikes and Baron Nashor's passive. Between the introduction of season 3 changes and V3.01, it shared the same icon as the Tenacious mastery. As of V3.01, it no longer has an icon in the buff bar.

- Prior to the Preseason of 2021, a website news post was made that announced that Tenacity would reduce the duration of knockups. However, the change was confirmed to have been cancelled.

- Prior to his VGU in patch V11.12, Dr. Mundo's Burning Agony granted himself 30% **Tenacity** which was additive with other "Champion Tenacity" buffs such as Brittle.

- Prior to V3.04, Singed's Insanity Potion granted himself 10 / 15 / 20% **Tenacity**.

- Prior to patch V12.22, Sunfire Aegis' Mythic passive granted 5% **Tenacity** per Legendary item which was additive with other "Buff Tenacity" buffs such as Elixir of Iron and Unflinching.

- On patch V12.22 it became possible to reach 100% tenacity by combining Mercury's Treads (30%) Silvermere Dawn (active) (50%) and Iceborn Gauntlet with 4 other legendary items (20%), which are additive with one another. Until V12.23 it was even possible to reach 120% Tenacity by including Mosstomper Seedling, which was also additive with these sources.

- After V13.3, the highest amount of tenacity was changed to 100% since combinations of effects in different groups were made to be additive.

  - Examples of combinations that can reach the cap:

    - Courage and Cleanse [60% + 75% = 135%]

    - Courage, Mercury's Treads and Sterak's Gage [60% + (100% - 70% * 80%) = 104%]

    - Cleanse, Mercury's Treads and Sterak's Gage [75% + (100% - 70% * 80%) = 119%]

    - Mercury's Treads, Breath of Life and Cleanse [30% + (100% - 35% * 25%) = 121,25%]

**Champion statistics**

 League of Legends content

Crowd control

A unit that is *disabled* is affected by a status effect that prevents certain actions – such as movement, attacking, casting and/or seeing–blocked, reduced or controlled.

Crowd control applied by one's self or an ally cannot be countered in any way, neither *reduced* in duration, *resisted*, nor *removed* unless special cased to do so.

- The crowd control effect may still be cleansed if it is applied as a debuff separate from the originated ability.

 League of Legends content

Airborne

A unit that is knocked *airborne* undergoes a *forced displacement* in a specified direction, to a specific point, or for a set duration at its current location, during which it is also unable to control its movement, declare attacks, cast abilities, activate items or use the summoner spells Flash, Teleport, Hexflash, and Mark / Dash. ***Airborne* is an immobilizing effect**.

| Interrupts: | Interrupts attack windups (excluding uncancellable windups), and all channeled and charged abilities. The accompanying *displacement* overrides all other previous *displacements*, including dashes and other *airborne* effects. |
| --- | --- |
| Reduction: | The **duration** of *airborne* and its *forced movement* execution time is unaffected by Tenacity. |
| Resist: | Resisted by crowd control immunity, displacement immunity, and Dr. Mundo's Goes Where He Pleases. |
| Removal: | The forced movement that is applied alongside *airborne* effects cannot be removed by cleanses, which innately disables attacking and moving and can be overridden by dashing, blinking or lunging. Cleansing effects, with the exceptions of Milio's Breath of Life, Cleanse, Mikael's Blessing, and Quicksilver, remove the *airborne* status effect. |

Crowd control applied by one's self or an ally cannot be countered in any way, neither *reduced* in duration, *resisted*, nor *removed* unless special cased to do so.

- The crowd control effect may still be cleansed if it is applied as a debuff separate from the originated ability.

 League of Legends content

Drowsy

A unit that is *drowsy* is slowed, and afterwards will fall asleep.

Removing *drowsy* or being displacement immune or immune to crowd control at its end will prevent sleep from occurring.

| Interrupts: | Does not interrupt any actions. |
| --- | --- |
| Reduction: | The **duration** is unaffected by Tenacity. |
| Resist: | Resisted by crowd control immunity. |
| Removal: | Removed by Cleanses. |

Slow resist, slow immunity and slow removals (i.e - Decisive Strike) can be used to (respectively) weaken, prevent or remove the associated *slow*, however, it does not prevent from falling asleep after the duration. Tenacity gained while *drowsy* will still affect the duration of the *sleep*.

 League of Legends content

Nearsight

A unit that is *nearsighted* has their sight radius reduced and **cannot** see beyond their sight radius.

While nearsighted, units cannot reveal stealthed wards or traps. Nearsighted units lose vision of all their allies as well as all external sources of vision (including from wards or abilities). This prevents unit-targeted effects, including basic attacks, from being used outside of the unit's reduced sight radius. True sight and unobstructed vision do **not** bypass the vision blocked by *nearsight*. Sources of *nearsight* do **not** stack with each other; only the application with the greatest sight reduction will take effect.

| Interrupts: | Interrupts target commands if the *nearsighted* unit's target is outside of their new vision area and prevents automatic target acquisition. |
| --- | --- |
| Reduction: | The **duration** is unaffected by Tenacity. |
| Resist: | Resisted by crowd control immunity with the exceptions of Fiora's Riposte and Morgana's Black Shield. |
| Removal: | Removed by Cleanses with the exceptions of Cleanse and Mikael's Blessing. |

Crowd control applied by one's self or an ally cannot be countered in any way, neither *reduced* in duration, *resisted*, nor *removed* unless special cased to do so.

- The crowd control effect may still be cleansed if it is applied as a debuff separate from the originated ability.

 League of Legends content

Stasis

A unit that is in *stasis* is unable to control its movement, declare attacks, cast abilities, activate items or use **any** summoner spells for the duration, while also being invulnerable and untargetable. ***Stasis* is an immobilizing effect**.

| Interrupts: | Interrupts attack windups (excluding uncancellable windups), all channeled and charged abilities and all dashes and displacements. Units that are being knocked up will be placed on the ground, but aren't knocked down (the *airborne* status is not removed in this case). |
| --- | --- |
| Reduction: | The **duration** is unaffected by Tenacity. |
| Resist: | Resisted by crowd control immunity, displacement immunity, and Dr. Mundo's Goes Where He Pleases. Epic monsters and turrets are special cased to be affected by *stasis* despite them being crowd control immune. |
| Removal: | Cannot be removed by any means (except through death), and will prevent the activation of abilities that would usually remove crowd control effects. Quicksilver will either be placed on a short cooldown, remain usable, or become disabled. |

Crowd control applied by one's self or an ally cannot be countered in any way, neither *reduced* in duration, *resisted*, nor *removed* unless special cased to do so.

- The crowd control effect may still be cleansed if it is applied as a debuff separate from the originated ability.

 League of Legends content

Suppression

A unit that is *suppressed* is unable to control its movement, declare attacks, cast abilities, activate items or use **any** summoner spells for the duration. Animations for suppression abilities vary and so must not be confused with airborne effects. ***Suppression* is an immobilizing effect**.

| Interrupts: | Interrupts attack windups (excluding uncancellable windups) and all channeled and charged abilities. |
| --- | --- |
| Reduction: | The **duration** is unaffected by Tenacity. |
| Resist: | Resisted by crowd control immunity and Dr. Mundo's Goes Where He Pleases. |
| Removal: | Removed by Cleanses with the exceptions of Cleanse and Mikael's Blessing. |

Crowd control applied by one's self or an ally cannot be countered in any way, neither *reduced* in duration, *resisted*, nor *removed* unless special cased to do so.

- The crowd control effect may still be cleansed if it is applied as a debuff separate from the originated ability.

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

Champion ability

A **champion ability** (often just **ability**) is a unique action performed by and only available to a specific champion. All of these special moves available to a champion collectively constitute their *kit*. A skill point is earned each time the champion  levels up, which the player can spend on most abilities to learn them and rank them up to improve their potency.

**Champion abilities** can have either or both *active* and *passive* effects:

- Active effects are *cast* by using their respective hotkey and selecting a valid target. Most abilities require spending an amount of resource, such as  mana.

- Passive effects may simply be permanently available or are *cast* by fulfilling a requirement or using a specific command.

Most abilities incur a  cooldown after being cast, during which they cannot be used. This cooldown time is usually reduced by  ability haste. Spell effects may trigger only when a valid ability deals damage. On-cast effects trigger upon an ability's *cast time* completing.

 League of Legends content

Buff

A **buff** is any status effect given to a unit that gives them a beneficial boost to their performance in battle.

 League of Legends content

| Courage | COOLDOWN: 22 / 19.5 / 17 / 14.5 / 12 |
| --- | --- |

| **Passive:** Garen permanently gains **bonus**  armor and  magic resist by killing enemies, up to a cap. Upon reaching the cap, he gains another permanent boost to these defenses. |
| --- |
| **Active:** **Garen** reduces incoming damage for a few seconds. He also briefly gains a shield and increased tenacity. |

 League of Legends content

| Breath of Life | COOLDOWN: 160 / 145 / 130 |
| --- | --- |

| **Active:** Milio explodes in soothing flames, healing and cleansing himself and nearby allied champions of non- airborne crowd control and granting them tenacity for a short time. |
| --- |

 League of Legends content

ARAM

**All Random All Mid** is a queue and 5v5 Classic game mode in which teams are assigned random champions and fight within a single-lane map.

**Playable maps**

> Butcher's Bridge / Howling Abyss / Koeshin's Crossing

The full ARAM game rules balance combat pacing and champion interaction; most notably, the fountain's regeneration is disabled and players can only shop for items after dying. Additionally, a multitude of adjustments to champions, items and runes have been made. ARAM rules are used in both matchmade and custom games.

 League of Legends content

Ultra Rapid Fire (U.R.F.)

**Ultra Rapid Fire** is a Featured Game Mode that takes place on Summoner's Rift with the same objective as Classic 5v5, except all champions benefit from the Awesome Buff of Awesomely Awesome Buffing that grants excessive ability haste and removes ability costs. The gameplay is *explosive*. The game mode can be played as * All Random* or *Blind pick* depending on the year.

 League of Legends content

Ultimate Spellbook

Ultimate Spellbook allows players to choose between 1 of 4 random ultimates as a placeholder for one of their summoner spell slots. Use this to devise a powerful combo to surprise your enemies. Only a select number of champions' ultimates are in the roster.

Chosen ultimates are initially placed on a long cooldown. All players start at level 3 and 950. Passive experience and gold income is increased, and you share minion gold with teammates in lane. Slaying the Dragon or Baron Nashor grants Ulternate Summoner Charge.

** Ulternate Summoner Charge:** After casting your *Ulter-nate Summoner Spell*, consume this effect to refresh the cooldown of the spell after 3 seconds of having casted it.

 League of Legends content

| Bellows Breath | COOLDOWN: 12 / 11.5 / 11 / 10.5 / 10 |
| --- | --- |

| **Active:** Ornn marches in the target direction with displacement immunity, belching fire in a cone that continually deals magic damage for a brief time. The final gout of flame will apply Brittle for a short time. |
| --- |
| ** displacement immunity:** The march cannot be deterred by crowd control. ** Brittle:** The target loses  tenacity, increasing the duration of incoming crowd control. |

 League of Legends content

| Call of the Forge God | COOLDOWN: 140 / 120 / 100 |
| --- | --- |

| **Active:** Ornn summons a lava elemental that stampedes toward him, dealing magic damage and slowing enemies hit for a short time. *Call of the Forge God* can be recast while the elemental is active. |
| --- |
| **Recast:** **Ornn** dashes in the target direction. If he hits the elemental, he sends it stampeding in the new direction, dealing magic damage to enemies hit, knocking them up and stunning them for a brief time. |
| Each pass applies Brittle to enemies hit for a short time. |
| ** Brittle:** The target loses  tenacity, increasing the duration of incoming crowd control. |

 League of Legends content

Brittle

A unit afflicted with **Brittle** has their Tenacity reduced by 30%.

**Brittle's** duration ends prematurely if the affected unit becomes immobilized or silenced.

**Tenacity** (or **Crowd Control Reduction**) is a stat that reduces the duration of all incoming crowd control effects except displacements, drowsy, nearsight, stasis, and suppression.

If **tenacity** is reduced below 0, the crowd control duration increases.

 League of Legends content

| Vorpal Spikes | COOLDOWN: 8 / 7 / 6 / 5 / 4 |
| --- | --- |

| **Active:** Cho'Gath's next few basic attacks launch forth deadly spikes, dealing magic damage to enemies hit based on * Feast* stacks and each target's **maximum** health, and slowing them. |
| --- |

Removed content

 League of Legends content

| Burning Agony | COOLDOWN: 4 |
| --- | --- |

| **Toggle:** Dr. Mundo drains his health to gain  tenacity and deal magic damage continually to nearby enemies. |
| --- |

 League of Legends content

| Insanity Potion | COOLDOWN: 100 |
| --- | --- |

| **Active:** Singed empowers himself for some time with  **bonus** ability power,  **bonus** armor,  **bonus** magic resist,  **bonus** movement speed,  **bonus** health regen, and  **bonus** mana regen. |
| --- |
| During this time, * Poison Trail* additionally applies Grievous Wounds. |

- ↑ Twitter post by Mark Yetter on Tenacity change
