Source: https://wiki.leagueoflegends.com/en-us/Magic_resistance

> LoL wiki page "Magic resistance" (revision 4073058), rendered HTML converted to Markdown by tools/extract/lol/mechanics.ts. Content © League of Legends Wiki contributors, CC BY-SA 3.0. Reference material for private research only.

# Magic resistance

**Magic Resistance** (also *Magic Resist*), or **MR**, is one of the two defensive stats that counter a specific damage type. It reduces incoming magic damage by a percentage.

- Magic resistance ** stacks additively**.

Every champion has a certain amount of base magic resistance that increases through growth per level. **Total** magic resistance refers to **base** plus **bonus** magic resistance. **Bonus** magic resistance can be gained from any source other than levels, for example from abilities, buffs, items, runes, and others.

Excluding the intentional outlier of Mega Gnar (whose magic resistance deviates greatly from all other champions' at 127.892), magic resistance values at level 20 range from 46.632 ( Yuumi) to 82.146 ( Sylas).

*Gold Value*

- **Magic resistance** has a gold value of 20 per point.

## Magic resist formula

Magic resistance determines by how much incoming *magic damage* is reduced before it applies to the target's health. The incoming pre-mitigation damage is *mitigated* through magic resist into a reduced amount of post-mitigation damage. This post-mitigation damage equals the actual amount of health deducted from the unit. Also, magic resist reduces an amount of pre-mitigation damage by a *percentage*; in other words, magic resist can be interpreted as effectively increasing the  nominal health of a unit by a percentage, when receiving *magic damage*.

To calculate the post-mitigation damage (meaning health deduction) given an amount of incoming magic damage and the target's magic resist, the following formula is used, where:

- `R` is magic resist

- `d_m` is post-mitigation damage

- `d_r` is pre-mitigation, or "raw", magic damage

 `post mitigation damage = magic damage × {[ 100 / (100 + R) , if Magic Resist ≥ 0 ; 2 − 100 / (100 − R) , otherwise ]`

Due to the order of operations for resistance penetration and reductions, negative values almost never occur. Therefore, ignoring negative magic resist values, the following simpler formula may be used:

 `d_m = d_r / (1 + R / 100)`

Solving for raw magic damage instead gives:

 `d_r = d_m × (1 + R / 100)`

The second formula proves that magic resistance increases nominal health by a percentage against magic damage; this is called **effective health**. Every 1 point of magic resist adds 1% to the effective health pool. *Also see "Stacking magic resistance" section below.*

Examples using 1000 health and 1000 pre-mitigation damage, for the sake of simplicity:

- 25 Magic Resistance

  - 25% effective health increase → 1000 nominal health becomes 1000 × (1 + 25 ÷ 100) = 1000 × 1.25 = 1250 total effective health against magic damage

  - 1000 raw damage ÷ (1 + 25 ÷ 100) = 1000 ÷ 1.25 = 800 post-mitigation damage → 20% total magic damage reduction

- 100 Magic Resistance

  - 100% effective health increase → 1000 nominal health becomes 1000 × (1 + 100 ÷ 100) = 1000 × 2 = 2000 total effective health against magic damage

  - 1000 raw damage ÷ (1 + 100 ÷ 100) = 1000 ÷ 2 = 500 post-mitigation damage → 50% total magic damage reduction

- 200 Magic Resistance

  - 200% effective health increase → 1000 nominal health becomes 1000 × (1 + 200 ÷ 100) = 1000 × 3 = 3000 total effective health against magic damage

  - 1000 raw damage ÷ (1 + 200 ÷ 100) = 1000 ÷ 3 = 333.3 post-mitigation damage → 66.6% total magic damage reduction

## Stacking magic resistance

Following the above damage formula, each point of magic resist increases the effective health pool against magic damage by 1%, formally:

> `Effective health = (1 + R / 100) × Nominal health`

> *Example: A unit with 60 magic resistance has 160% of its maximum health in its effective health, so if the unit has 1000 maximum health, it will take 1600 magic damage to kill it.*

By definition, **magic resist does not give diminishing returns of effective health**. Each additional point of magic resist increases the effective health pool (against magic damage) by 1% of your maximum health. This is not changed by any amount of magic resist already held.

If a unit's magic resist is negative due to reduction debuffs, magic resist has *increasing* returns with respect to itself. This is because negative magic resist cannot reduce effective health to less than 50% of actual health. A unit with -100 magic resist has 66.67% of nominal health (gains −33.33%) of its maximum health as effective health. This is an exotic case with only a select few in-game applications.

For a more detailed explanation, see this video.

## Magic resistance as scaling

Effects may benefit from (scale off of) a percentage/ratio, of **total** magic resistance, or **bonus** magic resistance.

### Champions

#### Self

- Amumu's Tantrum

- Braum's Stand Behind Me

- Galio's Colossal Smash and Shield of Durand

- K'Sante's Dauntless Instinct, Ntofo Strikes, Path Maker, and All Out

- Leona's Eclipse

- Ornn's Living Forge and Searing Charge

- Poppy's Stubborn to a Fault

- Rammus' Spiked Shell and Defensive Ball Curl

- Rell's Ferromancy: Mount Up

- Sejuani's Fury of the North

#### Enemy

- Mordekaiser's Realm of Death

- Rell's Break the Mold

- Trundle's Subjugate

### Items

#### Self

- Gustwalker Hatchling

- Jak'Sho, The Protean

- Mosstomper Seedling

- Protoplasm Harness

- Scorchclaw Pup

### Runes

#### Self

- Aftershock

- Conditioning

### Neutral buffs

#### Self

- Mountainous Vigor

## Increasing magic resistance

### Items

This table is automatically generated based on the data from Module:ItemData/data.

| Item | Cost | Amount | Availability |
| --- | --- | --- | --- |
| Abyssal Mask Abyssal Mask | 2650 | 45 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Bandlepipes Bandlepipes | 2300 | 20 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Banshee's Veil Banshee's Veil | 3000 | 40 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Chainlaced Crushers Chainlaced Crushers | 1250 | 25 | Classic Summoner's Rift 5v5 |
| Cloak of Starry Night Cloak of Starry Night | 0 | 100 | Arena |
| Cruelty Cruelty | 0 | 30 | Arena |
| Doran's Helm Doran's Helm | 450 | 8 | Nexus Blitz, Classic Summoner's Rift 5v5 |
| Eleisa's Miracle Eleisa's Miracle | 0 | 50 | Arena |
| Force of Nature Force of Nature | 2800 | 55 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Gargoyle Stoneplate Gargoyle Stoneplate | 0 | 65 | Arena |
| Hexdrinker Hexdrinker | 1300 | 25 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Hollow Radiance Hollow Radiance | 2800 | 40 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Jak'Sho, The Protean Jak'Sho, The Protean | 3200 | 45 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Jarvan I's Jarvan I's | 0 | 20 | ARAM: Mayhem |
| Kaenic Rookern Kaenic Rookern | 2900 | 80 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Lightning Rod Lightning Rod | 0 | 30 | Arena |
| Locket of the Iron Solari Locket of the Iron Solari | 2200 | 30 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Maw of Malmortius Maw of Malmortius | 3100 | 40 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Mercurial Scimitar Mercurial Scimitar | 3200 | 35 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Mercury's Treads Mercury's Treads | 1250 | 20 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Negatron Cloak Negatron Cloak | 850 | 45 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Null-Magic Mantle Null-Magic Mantle | 400 | 20 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Quicksilver Sash Quicksilver Sash | 1300 | 30 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Radiant Virtue Radiant Virtue | 0 | 35 | Arena |
| Reverberation Reverberation | 0 | 35 | Arena |
| Spectre's Cowl Spectre's Cowl | 1250 | 35 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Spirit Visage Spirit Visage | 2700 | 50 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Talisman of Ascension Talisman of Ascension | 0 | 0 | Arena |
| The Golden Spatula The Golden Spatula | 0 | 40 | ARAM: Mayhem, Arena |
| Verdant Barrier Verdant Barrier | 1600 | 25 | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Void Immolation Void Immolation | 0 | 80 | ARAM: Mayhem, Arena |
| Wit's End Wit's End | 2800 | 45 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Zeke's Convergence Zeke's Convergence | 2200 | 25 | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |

#### Item passives

- Force of Nature

- Hullbreaker *

- Jak'Sho, The Protean

- Terminus

### Champion abilities

- Anivia's Rebirth

- Braum's Stand Behind Me

- Briar's Hematomania

- Garen's Courage

- Gnar's Rage Gene

- Graves' Quickdraw

- Gwen's Hallowed Mist

- Hecarim's Spirit of Dread

- Jax's Grandmaster-at-Arms

- Jayce's Transform Mercury Hammer

- Kennen's Slicing Maelstrom

- Kled's Skaarl the Cowardly Lizard

- Leona's Eclipse

- Mordekaiser's Realm of Death

- Nasus' Fury of the Sands

- Olaf's Ragnarok

- Orianna's Command: Protect

- Ornn's Living Forge

- Pantheon's Empowered Aegis Assault

- Poppy's Stubborn to a Fault

- Rammus' Defensive Ball Curl

- Rell's Break the Mold and Ferromancy: Mount Up

- Sejuani's Frost Armor

- Shyvana's Scalemail

- Singed's Insanity Potion

- Trundle's Subjugate

### Runes

- Aftershock

- Conditioning

- Unflinching

### Neutral buffs

- Mountainous Vigor

## Reducing magic resistance

> *Main article: magic penetration*

**Magic resist** can be negated by *magic penetration* and *magic resistance reduction*, treated as negative values in damage calculations. The calculation then uses the effective magic resist values after the reduction; the actual damage formulae are not changed.

## Magic resist vs. Health

*Note: The following information similarly applies to armor. As of Season 2016, the base equilibrium line for magic resist is a function:*

health* = 6.75 × (magic resist + 100)*

*while the line for armor is a bit shifted up and more steep:*

health* = 7.5 × (armor + 100)*

It can be helpful to understand the equilibrium between maximum health and magic resist, which is represented in the graph on the right. The equilibrium line represents the point at which your champion will have the highest effective health against that damage type, while the smaller lines represent the baseline progression for each kind of champion from level 1-18 without items. You can also see that for a somewhat brief period in the early game health is the most gold efficient purchase, however this assumes the enemy team will only have one type of damage. The more equal the distribution of physical damage/magic damage in the enemy team, the more effective will buying health be.

There are many other factors which can effect whether you should buy more magic resist or health, such as these key examples:

- Unlike HP, increasing magic resist also makes healing more effective because it takes more effort to remove the unit's HP than it does to restore it.

- HP helps you survive both magic damage and physical damage. Against a team with mainly burst or just low damage, HP can be more efficient than resistances.

- Percentage magic resist reduction in the enemy team tilts the optimal health:magic resist ratio slightly in the favor of HP.

- Whether or not the enemy is capable of delivering true damage or percent health damage, thus reducing the value of magic resist and health stacking respectively.

- The presence of resist or HP steroids built into your champion's kit, such as in Leona's Eclipse or Cho'Gath's Feast.

- Against sustained damage vamp and healing abilities can be considered as contributing to your maximum HP (while being mostly irrelevant against burst damage).

- The need to prioritize specific items mainly for their other qualities (regardless of whether or not they contribute towards the ideal balance between HP and resists).

## List of champions' magic resistance

> *Main article: List of champions' magic resistance*

Most melee champions, along with Graves, Ivern, and Urgot, have a base magic resistance of 32 – 72.31 (based on level).

Most ranged champions, Kassadin, and shapeshifting champions who can become ranged in one of their forms ( Nidalee, Jayce, Elise, Gnar), have base magic resistance of 30 – 55.56 (based on level).

## Optimal efficiency (theoretical)

> *Note: Effective burst health, commonly referred to just as 'effective health', describes the amount of raw burst damage a champion can receive before dying in such a short time span that he remains unaffected by any form of health restoration*. Unless champion's resists aren't reduced below zero, it will always be more than or equal to a champion's displayed health in their health bar and can be increased by buying items with extra health, armor and magic resistance. In this section, effective health will refer to the amount of raw 'magical damage' a champion can take.*

In almost all circumstances, champions will have more maximum health than magic resistance, thus a single point of magic resistance will give more 'effective health' to a champion than a single point of health. However, if there is a case where max health is below the value of 'magic resistance + 100', the opposite becomes true.

Because of this relationship, theoretically, maximum effective health is attained by *ensure that you have exactly 100 more max health than magic resistance*, regardless of how much health or magic resistance you actually already have.

> *Example: Given a theoretical situation where you start off with 1 health and 1 magic resistance and are given an arbitrary sufficient number of stat points (x ≥ 100), each of which you can use to increase either your health or magic resistance by 1 point, the way to maximize your effective health is to add points to your health until your health has 100 more points than magic resistance, then split the remaining stat points in half and share them between your health and magic resistance.*

However, this is only theoretically true if we consider both health and magic resistance to be equally obtainable resources with simplified mechanism of skill point investment. In reality a player buys these stats for gold instead. So when attempting to ensure the balance of 'health = magic resistance + 100', consider it through gold value distributed to the stats. Because the gold value of 1 health is roughly 7 times smaller than 1 point of magic resistance (as of V8.7), distribution per point of health or magic resistance should be 12.5% gold into health and 87.5% gold into magic resistance once the 'health = magic resistance + 100' equilibrium is reached.

This model is highly simplified and cannot be exactly applied when buying **any other item** that aren't purely magic resistance or health oriented as they deviate the equilibrium. Going even further, the continuous model simplifies a discrete character of real shopping, as you cannot really buy 1.125 ×  Ruby Crystals for 450, so you either opt to buy a single Ruby Crystal or a single Null-Magic Mantle, drastically unbalancing the equilibrium.

Broadly speaking, items which provide both health and magic resistance give a very high amount of effective health against magic damage compared to items which only provide health or only provide magic resistance. These items should be purchased when a player is seeking efficient ways to reduce the magic damage they take by a large amount. Furthermore, these items are among all available items the best ones to distribute their gold value equally among both health and magic resistance, thus working perfectly for *rule of preserving equilibrium*.

### Conclusion

This information is strongly theoretical. Due to how there are many variables aside from health, magic resistance and gold value, "true equilibrium" is too complicated and unrealistic to achieve. However, a player can develop their intuition to itemize towards this equilibrium in a timely manner through the experience gained from the multitude of plays they perform.

The important thing to remember is that there is no reason to hold to the equilibrium too strictly, or else you might just lose the fun out of the game.

## Trivia

- The old stat icon for **magic resistance** was a blue recolor of the old stat icon for armor, which seems to based on the old icon of Aegis of the Legion.

- The game internally refers to **magic resistance** as *spellBlock*.

***Last updated:** May 15, 2026, patch V26.10*

Without using Shyvana's Scalemail or Jax's Grandmaster's Might with Gathering Storm which potentially allow for infinite amounts of magic resistance, the largest amount of magic resistance is reached with a Bot Lane level 18 Rammus at **2272** magic resistance (which reduces magic damage by 95.784%).

- **Runes:**

  - Aftershock

  - Conditioning

  - Unflinching

- **Items:**

  - Kaenic Rookern

  - Force of Nature

    - Force of Nature must have maximum stacks of Steadfast

  - Spirit Visage

  - Jak'Sho, The Protean

    - Jak'Sho, The Protean must have maximum stacks of Voidborn Resilience

  - Two of Negatron Cloak, Wit's End, Abyssal Mask

  - Mercury's Treads

  - Either Kaenic Rookern, Force of Nature, or Wit's End upgraded with Ornn's Living Forge

- **Buffs:**

  - Rammus' Defensive Ball Curl

  - Braum's Stand Behind Me

    - Braum must be a Top Laner to access Level 20

  - Orianna's Command: Protect

  - Ornn's Living Forge

  - 4 ×  Mountainous Vigor

- Braum:

  - **Base MR** = 72.31

  - **Items** = 80 + 55+70 + 50 + 45 + 45 × 2 + 27.78= 417.78 MR

  - **Runes** = 158 + 8 + 10 = 176 MR

  - **Bonus MR Multiplier** = 1 + 0.30 = 1.30

  - **MR Multiplier** = (1 + 0.20)  ×  (1 + 0.03) = 1.236

  - Braum's MR = (72.31 + (417.78 + 176) × 1.30)  ×  1.236 = 1043.46 MR

  - Braum's Bonus MR = 1043.46 - 72.31 = 971.15 Bonus MR

    - Stand Behind Me's bonus = 40 + 971.15 × 0.12 = **156.54 Bonus MR**

- Rammus:

  - **Base MR** = 68.85 MR

  - **Items** = 80 + 55+70 + 50 + 45 + 45 × 2 + 20 + 27.78= 437.78 MR

  - **Runes** = 150 + 8 + 10 = 168 MR

  - **Buffs** = 156.54 + 30 + 40 = 226.54 MR

  - **Bonus MR Multiplier** = 1 + 0.30 = 1.30

  - **MR Multiplier** = (1 + 0.20)  ×  (1 + 0.03)  ×  (1 + 0.60)= 1.9776

    - Rammus' MR = (68.85 + (437.78 + 168 + 226.54) × 1.30)  ×  1.9776 = **2271.99 MR**

- Prior to Patch 3.10, a level 18 Master Yi with 1 Runic Bulwark, 5 Spirit Visages, 3 points in Resistance, 3 points in Legendary Armor, Creeping Death, Bulwark, Aria of Perseverance, Command Protect, an allied Runic Bulwark aura, a full page of Scaling Magic Resist runes, and Meditate active gave a total of approximately 1004 magic resistance. Switching Mordekaiser for Trundle and having an enemy Trundle with the same setup use Subjugate on Master Yi and the allied Trundle use Subjugate on the enemy Trundle, yielded a total of approximately 1297 magic resistance. This is the highest possible amount of magic resistance, which is 92.8% reduction.

  - If Garen disconnected from the fountain and had the same setup, he will have 2108 magic resistance. This is a 95.5% reduction.

  - **NOTE:** This calculation does not include the Defender mastery.

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

| Tantrum | COOLDOWN: 9 / 8 / 7 / 6 / 5 |
| --- | --- |

| **Passive:** Amumu gains damage reduction against physical damage.  *Tantrum's* cooldown is reduced whenever he is hit by a basic attack. |
| --- |
| **Active:** **Amumu** releases his anger, dealing magic damage to nearby enemies. |

 League of Legends content

| Stand Behind Me | COOLDOWN: 12 / 11 / 10 / 9 / 8 |
| --- | --- |

| **Active:** Braum dashes to a target allied champion or minion. On arrival, both of them gain  armor and  magic resistance for a few seconds. |
| --- |

 League of Legends content

| Colossal Smash | STATIC CD: 5 |
| --- | --- |

| **Innate:** Every few seconds, Galio's next basic attack is modified to gain  attack speed and deal magic damage in an area, increased based on his  **bonus** magic resist. |
| --- |
| **Galio's** ability hits against enemy champions or epic monsters  reduce *Colossal Smash's*  cooldown. |

 League of Legends content

| Shield of Durand | COOLDOWN: 18 / 17 / 16 / 15 / 14 |
| --- | --- |

| **Passive:** Galio gains a shield that absorbs magic damage based on his **maximum** health, and restores it while out of combat. |
| --- |
| **Active:** **Galio** charges up a defensive stance, moving slowly while gaining damage reduction. *Shield of Durand* can be recast within the duration and does so automatically afterward. |
| **Recast:** **Galio** taunts nearby enemy champions, dealing magic damage. The effects are increased based on charge time. |

 League of Legends content

| Dauntless Instinct |   |
| --- | --- |

| **Innate:** K'Sante's abilities mark enemies hit for a short time. His basic attacks on-hit consume the mark to deal **bonus** physical damage based on the target's **maximum** health. |
| --- |
| ** All Out Bonus:** K'Sante's basic attacks and abilities are empowered to deal **additional bonus** physical damage based on the target's **maximum** health, increased based on **K'Sante's** **bonus** armor and magic resist. |

 League of Legends content

| Ntofo Strikes | STATIC CD: 3.5 – 2 (based on **bonus** resistances) • 2.33 – 1.33 |
| --- | --- |

| **Active:** K'Sante slams his ntofo down in the target direction that deals physical damage and briefly slows enemies hit. |
| --- |
| If this hits at least one enemy, he generates a stack for a few seconds. At 2 stacks, the next *Ntofo Strikes* consumes them all to become empowered with a new effect. |
| **Empowered Active:** **K'Sante** fires a shockwave that deals physical damage and pulls enemies hit toward him. |
| ** All Out Bonus:** *Ntofo Strikes's*  cooldown is reduced, but it no longer slows enemies hit. |

 League of Legends content

| Path Maker | COOLDOWN: 14 / 13 / 12 / 11 / 10 |
| --- | --- |

| **Active:** K'Sante begins to charge, during which he gains damage reduction. After a brief delay, *Path Maker* can be recast within the remaining charge duration, and does so automatically afterwards. The charge cannot be interrupted. |
| --- |
| **Recast:** **K'Sante** dashes in the target direction, dealing physical damage to enemies hit, knocking them back and stunning all targets. |
| ** All Out Bonus:** Upon entering *All Out*, *Path Maker's*  cooldown is refreshed. *Path Maker's* damage, dash speed, and damage reduction are increased, but it will no longer stun or knock back targets. |

 League of Legends content

| All Out | COOLDOWN: 120 / 100 / 80 |
| --- | --- |

| **Active:** K'Sante roots an enemy and then shatters his tonfas, knocking them back, blinking behind them, and dealing physical damage. If the enemy is pushed into terrain, they will be knocked over it and take additional physical damage. |
| --- |
| The target is stunned at the end of the push, and also knocked up again if they were pushed through terrain. At the end, **K'Sante** goes *All Out* for some time. |
| **All Out:** **K'Sante's**  **maximum** health is greatly reduced and he loses a large portion of his **base**  armor and  magic resistance, but gains  **bonus** attack speed,  **bonus**-armor penetration, and  omnivamp. During this time, his basic abilities are empowered and have no  mana cost. |
| **Bonus**-armor penetration affects  **bonus** armor only. |

 League of Legends content

| Eclipse | COOLDOWN: 14 / 13 / 12 / 11 / 10 |
| --- | --- |

| **Active:** Leona raises her *guard* for a short time, gaining flat damage reduction,  **bonus** armor and  **bonus** magic resistance. |
| --- |
| Her shield detonates afterward, dealing magic damage to all nearby enemies. If this hits an enemy, **Leona's** *guard* is extended for a short time. |

 League of Legends content

| Living Forge |   |
| --- | --- |

| **Innate - Living Forge:** Ornn can purchase items from anywhere by channeling for a few seconds. |
| --- |
| **Innate - Master Craftsman:** From level 13 onward, **Ornn** can upgrade items he and his teammates own into Masterwork items, improving their stats. **Ornn** gains increased  **bonus** health,  **bonus** armor, and  **bonus** magic resistance from all sources, further increased each time he upgrades an item. |
| **Innate - Temper:** **Ornn's** basic attacks against Brittle targets knock them back. Immobilizing effects against Brittle targets will consume the debuff to deal **bonus** magic damage based on the **target's** maximum health. |

 League of Legends content

| Searing Charge | COOLDOWN: 14 / 13.5 / 13 / 12.5 / 12 |
| --- | --- |

| **Active:** Ornn charges in the target direction, dealing physical damage to enemies he passes through. |
| --- |
| **Ornn** will stop upon hitting terrain, creating a shockwave that deals physical damage to enemies, knocks them up and briefly stuns them. This will also destruct his * Volcanic Rupture* and enemy-created terrain. |

 League of Legends content

| Steadfast Presence | COOLDOWN: 20 / 18 / 16 / 14 / 12 |
| --- | --- |

| **Passive:** Poppy increases her  **total** armor and  **total** magic resist. This effect is doubled while she is at low health. |
| --- |
| **Active:** **Poppy** gains  **bonus** movement speed for a short time and creates an aura that stops enemy dashes. Enemies that dash within the aura are dealt magic damage and briefly knocked up, they are then grounded and slowed for a short time. |

 League of Legends content

| Spiked Shell |   |
| --- | --- |

| **Innate:** Rammus gains **bonus** AD equal to a percentage of his **total** armor and **total** magic resistance. |
| --- |

 League of Legends content

| Defensive Ball Curl | COOLDOWN: 7 |
| --- | --- |

| **Active:** Rammus enters a defensive stance for a few seconds, gaining  **bonus** armor and  **bonus** magic resist. During this time, enemies that land a basic attack against **Rammus** are dealt magic damage. |
| --- |
| *Defensive Ball Curl* can be recast within the duration, and does so automatically afterward. |
| **Recast:** **Rammus** ends *Defensive Ball Curl*. |

 League of Legends content

| Ferromancy: Mount Up | COOLDOWN: 10 |
| --- | --- |

| **Passive:** While Rell is **Dismounted**, she gains  **bonus** armor and  **bonus** magic resist. |
| --- |
| **Active:** **Rell** becomes **Mounted** and gains  **bonus** movement speed for a short time, increased while moving towards enemy champions. |
| During this time, **Rell's** next basic attack will gain  **bonus** attack range and causes her to charge to the target, dealing **bonus** magic damage before briefly stunning and flinging them over. |
| While **Rell** is **Mounted**, she can cast * Ferromancy: Crash Down*. |

 League of Legends content

| Fury of the North |   |
| --- | --- |

| **Innate - Icebreaker:** Enemies stunned by Sejuani are also marked *Frozen* at the same time. Her next basic attack or ability against a *Frozen* target will consume the mark to deal **bonus** magic damage based on their **maximum** health. |
| --- |
| **Innate - Frost Armor:** **Sejuani** gains *Frost Armor*, which lingers shortly after taking damage from enemy champions or large monsters. She restores it after a period without taking damage from them. |
| **Frost Armor:** Sejuani gains  **bonus** armor and  **bonus** magic resist, as well as slow immunity and cripple immunity. |

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

| Subjugate | COOLDOWN: 120 / 100 / 80 |
| --- | --- |

| **Active:** Trundle drains the life force of the target enemy champion, dealing magic damage based on their **maximum** health and healing for the same amount. He also steals a portion of their  armor and  magic resist, and increases in size while reducing their size. |
| --- |
| Half of the damage and stealing is applied instantly, and the other half is applied over a few seconds. The armor and magic resist will remain stolen for a few seconds afterwards. |

 League of Legends content

| Rebirth | STATIC CD: 240 |
| --- | --- |

| **Innate:** Periodically, upon dying, Anivia will instead revert into an egg. If the egg can survive for a few seconds, she is gloriously reborn. |
| --- |

 League of Legends content

| Certain Death | COOLDOWN: 120 / 100 / 80 |
| --- | --- |

| **Active:** Briar kicks her pillory's hemolith a large distance toward the target direction which marks the first enemy champion hit and reveals them. |
| --- |
| If a target is hit, **Briar** destroys her pillory and dashes to them. Upon arrival, she creates an explosion that deals magic damage to the marked champion and enemies around them, and also fears all non-marked enemies. **Briar** then enters *Hematomania*. |
| **Hematomania:** **Briar** gains all effects of * Blood Frenzy* against the marked target as well as  **bonus** armor,  **bonus** magic resistance,  life steal, and  **additional bonus** movement speed. *Hematomania* lasts until she or the marked target dies. |
| **Briar** can cast Chilling Scream to end *Hematomania* early. |

 League of Legends content

| Courage | COOLDOWN: 22 / 19.5 / 17 / 14.5 / 12 |
| --- | --- |

| **Passive:** Garen permanently gains **bonus**  armor and  magic resist by killing enemies, up to a cap. Upon reaching the cap, he gains another permanent boost to these defenses. |
| --- |
| **Active:** **Garen** reduces incoming damage for a few seconds. He also briefly gains a shield and increased tenacity. |

 League of Legends content

| Rage Gene |   |
| --- | --- |

| **Innate - Rage Gene:** Mini Gnar generates *Rage* while fighting. At maximum *Rage*, his next ability will be * Mega Gnar's* as he transforms, losing *Mini Gnar's* passive effects in exchange for increased stats and new abilities. |
| --- |
| *Mega Gnar* form lasts for some time before reverting to *Mini Gnar*, afterwards he cannot generate *Rage* for some time. |

 League of Legends content

| Quickdraw | COOLDOWN: 16 / 15 / 14 / 13 / 12 |
| --- | --- |

| **Active:** Graves dashes in the target direction and reloads 1 shell. He also gains a stack of *True Grit*, doubled if he dashed toward an enemy champion. |
| --- |
| Each time he hits an enemy with a pellet, the cooldown is  reduced. |
| **True Grit:** For each stack, **Graves** gains  **bonus** armor and  **bonus** magic resistance. Attacks versus non-minion enemies will refresh the duration. |

 League of Legends content

| Hallowed Mist | COOLDOWN: 22 / 21 / 20 / 19 / 18 |
| --- | --- |

| **Active:** Gwen summons the *Hallowed Mist* upon her current location for a few seconds. *Hallowed Mist* can be recast within this time, and does so automatically if she attempts to leave the area. |
| --- |
| While inside the mist, **Gwen** becomes ghosted, gains  **bonus** armor and  **bonus** magic resistance and is untargetable to enemies who are outside of it. |
| **Recast:** **Gwen** commands the mist to move to her current location. |

 League of Legends content

| Spirit of Dread | COOLDOWN: 14 |
| --- | --- |

| **Active:** Hecarim continually deals magic damage to nearby enemies for a short time. |
| --- |
| During this time, he gains **bonus** resistances and heals for a portion of any damage he and his allies deal to nearby enemies, with reduced healing on ally damage. |

 League of Legends content

| Grandmaster-at-Arms | COOLDOWN: 110 / 100 / 90 |
| --- | --- |

| **Passive:** Jax's basic attacks generate stacks. At max stacks, he consumes them to deal **additional** magic damage. |
| --- |
| **Active:** **Jax** swings his lantern around, dealing magic damage to nearby enemies. If this hits a champion, he gains **bonus** resistances. He applies his passive on-hit every 2 stacks instead of every 3 while active. |

 League of Legends content

| Transform Mercury Hammer | COOLDOWN: 6 |
| --- | --- |

| **Active:** Jayce transforms into **Hammer Stance**, becoming melee, gaining  **bonus** armor and  **bonus** magic resist and gaining new abilities. |
| --- |
| His next basic attack will deal **bonus** magic damage. |
| **Jayce** begins the game with *Transform* but cannot increase its rank. Instead, his basic abilities each have 6 ranks. |

 League of Legends content

| Slicing Maelstrom | COOLDOWN: 120 |
| --- | --- |

| **Active:** Kennen summons a storm that strikes at nearby enemy champions, dealing magic damage. Enemies take increased damage from each subsequent strike. |
| --- |

 League of Legends content

| Skaarl, the Cowardly Lizard |   |
| --- | --- |

| **Innate:** Kled rides his semi-trusty steed, ** Skaarl**, whom takes damage for him while he is **Mounted**. When ** Skaarl's** health depletes, **Kled** dismounts, cleansing from all crowd control. |
| --- |
| **Kled** remains **Dismounted** until he returns to the summoning platform, but can restore ** Skaarl's** Courage by fighting enemies. At maximum Courage, **Kled** becomes **Mounted** with a portion of ** Skaarl's** health. |
| **Dismounted:** **Kled** gains  **bonus** movement speed while moving toward enemy champions, but his basic attacks deal less damage to champions. * Bear Trap on a Rope* is replaced with * Pocket Pistol*, and **Kled** cannot cast his other abilities. |

 League of Legends content

| Fury of the Sands | COOLDOWN: 120 / 100 / 80 |
| --- | --- |

| **Active:** Nasus empowers himself for some time, gaining bonus size,  health,  armor,  magic resist, and  attack range. |
| --- |
| While empowered, * Siphoning Strike* has reduced  cooldown, and **Nasus** creates an aura that continually deals magic damage to nearby enemies based on their **maximum** health. |

 League of Legends content

| Ragnarok | COOLDOWN: 100 / 90 / 80 |
| --- | --- |

| **Passive:** Olaf gains  **bonus** armor and  **bonus** magic resist. |
| --- |
| **Active:** **Olaf** becomes enraged for a short time, cleansing himself and becoming cc-immune, as well as gaining  **bonus** attack damage and increased size. For a brief moment, he gains  **bonus** movement speed while facing nearby enemy champions. |
| *Ragnarok's* duration can be extended by hitting basic attacks and * Reckless Swing* against an enemy champion. |
| ** Cc-immunity**: Crowd control cannot be applied during this time. |

 League of Legends content

| Command: Protect | COOLDOWN: 9 |
| --- | --- |

| **Passive:** The Ball grants **bonus**  armor and  magic resist to the unit it is attached to. |
| --- |
| **Active:** Orianna commands **The Ball** to fly and attach to herself or the target allied champion, dealing magic damage to enemies it passes through and shielding the target for a short time. |

 League of Legends content

| Aegis Assault | COOLDOWN: 22 / 21 / 20 / 19 / 18 |
| --- | --- |

| **Active:** Pantheon braces his shield in the target direction and channels for a brief period, during which he becomes invulnerable against non- turret damage from enemies in that direction. He will also strike in a cone that continually deals physical damage to enemies hit. |
| --- |
| *Aegis Assault* can be recast within this time, and does so automatically after the duration. The channel cannot be interrupted. |
| **Recast:** **Pantheon** slams his shield in a cone, dealing physical damage to enemies hit. |
| ** Mortal Will Bonus:** **Pantheon** briefly gains  **bonus** movement speed,  **bonus** armor and  **bonus** magic resist after recasting. |

 League of Legends content

| Scalemail |   |
| --- | --- |

| **Innate:** **Shyvana** generates *Scalemail* stacks from scoring takedowns against certain enemies. Large monsters and large minions grant a stack, while enemy champions and epic monsters grant more. |
| --- |
| **Scalemail:** For each stack, **Shyvana** gains  **bonus** armor and  **bonus** magic resist. |

 League of Legends content

| Insanity Potion | COOLDOWN: 100 |
| --- | --- |

| **Active:** Singed empowers himself for some time with  **bonus** ability power,  **bonus** armor,  **bonus** magic resist,  **bonus** movement speed,  **bonus** health regen, and  **bonus** mana regen. |
| --- |
| During this time, * Poison Trail* additionally applies Grievous Wounds. |

 League of Legends content

| Feast | COOLDOWN: 80 / 70 / 60 |
| --- | --- |

| **Active:** Cho'Gath devours an enemy, dealing true damage based on **Cho'Gath's bonus** health. If this attack kills the target, **Cho'Gath** gains a permanent *Feast* stack that infinitely stacks. |
| --- |
| **Feast:** For each stack, **Cho'Gath** gains  **bonus** health,  **bonus** attack range and increased size. |

Removed content

 League of Legends content

| Grandmaster's Might | COOLDOWN: 80 |
| --- | --- |

| **Passive:** Jax's basic attacks generate stacks. At max stacks, he consumes them to deal **bonus** magic damage. |
| --- |
| **Active:** **Jax** gains  **bonus** armor and  **bonus** magic resistance for a period. |

Removed content

 League of Legends content

| Command: Protect | COOLDOWN: 9 |
| --- | --- |

| **Passive:** The Ball grants **bonus**  armor and  magic resist to the unit it is attached to. |
| --- |
| **Active:** Orianna commands **The Ball** to fly and attach to herself or the target allied champion, dealing magic damage to enemies it passes through and shielding the target for a short time. |

- ↑ Should you buy Armor or Health?
