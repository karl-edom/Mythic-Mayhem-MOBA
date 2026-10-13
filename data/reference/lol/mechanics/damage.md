Source: https://wiki.leagueoflegends.com/en-us/Damage

> LoL wiki page "Damage" (revision 4068095), rendered HTML converted to Markdown by tools/extract/lol/mechanics.ts. Content © League of Legends Wiki contributors, CC BY-SA 3.0. Reference material for private research only.

# Damage

|   | "Hmm... let me fix that." | This article or section is substantially or structurally incomplete. You can help the League of Legends Wiki by expanding it. For more projects, see the Community To Do List. **Additional information:**This article and the **Damage types** section in particular contain confusing or outdated information that is presently subject to a complete overhaul. |
| --- | --- | --- |

> *Not to be confused with attack damage, a champion statistic, nor conflated with health costs, which are not damage.*

Damage is displayed as a red section on a champion's health bar.

**Damage** is the result of a direct combat interaction between two units: a source unit causes a deduction of a target unit's current health via a *damaging* spell (or accompanying debuff). Damage takes place in engine time ("instantaneously") and the application itself is formally called a **damage instance** or **damage event**.

Invulnerability prevents damage, and shields can protect from it. Damage values can also be modified by the source or the target through damage modifiers. They can also be increased by a percentage due to an event called a critical strike.

Enemies are slain upon dealing enough **damage** to deplete their health. A champion dealing damage against another champion triggers kill attribution (if it does not slay them otherwise) and, if the damage-dealer is within enemy turret attack range, also triggers the turret's aggression until they exit the turret's range.

## Types

The following three **damage types** exist: **Physical**, **Magic**, and **True**. Each damage event can fall under only one of these three categories.

These three types exist to add variability to gameplay beyond simple deduction of health equal to the source's outgoing damage value, by potentially reducing, or ***mitigating*** it instead.

- Physical damage is innately mitigated by  armor, a statistic that units possess.

- Magic damage is innately mitigated by  magic resistance, a statistic that units possess.

- True damage cannot be mitigated by any innate statistic.

Aside from these innate mitigations, various effects can also reduce outgoing damage by a source (e.g. Exhaust), reduce incoming damage from all or some sources (e.g. Master Yi's Meditate), potentially nullify any damage received (e.g. invulnerability) or prevent an effect, which may or may not be accompanied by damage, from being applied altogether (e.g. spell shield). True damage additionally has the property of being largely unaffected by damage *reductions*, with the exception of Fiora's Riposte, which invariably reduces all incoming non- execution damage dealt by sources other than turrets by 100%.

Effects that trigger from damage **type** will always occur, unless prevented from applying altogether, regardless of its classification.

## Additional classification

In addition to types, damage instances can have multiple other classifications to determine and manage interactions systemically.

Note that damage instances can equal zero (i.e., no health deduction). This is most commonly utilized for triggering kill attribution and minion aggression.

### Tags

The **tag** system is a restrictive classification applicable to the *source* of the damage instance. It is restrictive because each tag entails a number of default *properties* the damage instance can have, and spells that interact with other spells can choose to ignore certain tags. Damage instances can have any combination of these **tags**, though some combinations are atypical or never found in game. Properties are a secondary classification system, explained further below.

- **BasicAttack:** Represents the base damage of all champion basic attacks (invariably), most empowered attacks (e.g. Blitzcrank's Power Fist, Darius' Crippling Strike), most attack-like abilities/also referred to as attack-spells (e.g. Ezreal's Mystic Shot, Fiora's Lunge) and all attack modifiers (e.g. Akshan's Heroic Swing, Bel'Veth's Royal Maelstrom, Urgot's Purge, Runaan's Hurricane's Wind's Fury bolts).

  - All champion basic attacks, which are tagged with this, apply  life steal and on-hit effects through the ApplyLifesteal and TriggerOnHitEvents properties, respectively, as a fundamental mechanic. However other damage tags can have these properties, meaning they are not exclusive to this tag.

- **ActiveSpell:** Represents most active champion and item abilities, i.e., ones that the player has issued an active command, and paid a cost if applicable, to cast.

  - This tag allows triggering ability effects (invariably).

- **AOE:** Represents damage in an area (**A**rea **o**f **E**ffect) or sometimes across multiple units.

  - This tag is usually tied to penalties compared to other damage tags, since area effects are considered easier to apply than single-target effects.

- **Periodic:** Represents effects repeating at a cadence generally shorter than traditional cooldowns and over a period, instead of at once. The repetition can originate from a continually firing spell (e.g. Lucian's The Culling, Morgana's Tormented Shadow) or be applied via a debuff (e.g. Malzahar's Malefic Visions, Singed's Poison Trail, Liandry's Torment's Torment).

  - This tag is usually tied to even stricter penalties compared to AOE and additionally has the property of not expunging sleep.

- **Proc:** Represents all effects applied as secondary on top of other more interactive effects. This is used for any damage that should not trigger a chain of additional attack and spell effects due to other damage tags on a target. On-hit and spell effects themselves are usually tagged proc.

  - This tag is self-limiting; it exists so that effects that trigger from other damage tags do not continuously apply and/or repeat.

- **Indirect:** Represents effects that are to be considered "not actively or directly sourced by the player themselves".

  - In addition to not expunging sleep like Periodic, and being self-limiting like Proc, this tag is reserved for use in other systems that require exclusion of all other damage types. It is rare and any further uses as of 2026 are unknown.

- **Pet:** Represents all damage originating from champion summoned units, also to defer attribution to their summoner.

- **Item:** Represents damage originating from most non-champion spells. Despite the name, this includes summoner spell damage against champions, in addition to item abilities.

  - This tag is generally exclusionary; it exists so that non-champion-sourced damage is identified and grouped separately from other champion-sourced damage, as a lesser category, and so that it does not remain untagged, for consistency. Damage instances which are supposed to remain unaffected by effects that modify champion attacks or ability damage are also tagged as such.

- **NonRedirectable:** Represents all damage that manipulates the source of the instance. It has no current known applications, except (presumably) Zoe's Sleepy Trouble Bubble's expunging of sleep specifically. It may be vestigial.

- **DoesNotAggroJungle:** Represents all damage that should not trigger neutral monster aggression, which includes Ivern's Friend of the Forest and the regular damage of jungle companions.

- **OnHit:** Represents all on-hit effects (invariably).

  - This tag exists for interaction with effects that modify and/or repeat on-hit effect application.

- **Augment:** Represents damage dealt by augment systems in modes such as Arena and ARAM: Mayhem (invariably).

  - This tag exists for interaction with effects that modify and/or repeat augment effect application.

The same origin spell can have any number of damage instances, even occurring simultaneously. It can also apply different damage instances with different tags depending on the target, or even the number of targets hit (the latter includes effects such as Karthus' Lay Waste).

In addition to all of the above, damage can be made to ignore shields and other forms of health manipulation internally. This is not handled by any known tags or properties. It is however most relevant for damage that does not fall under any tag.

- ↑ The League of Legends Wiki elected to call this 'basic damage' and avoid using the term 'attack' in order to prevent confusion between the damage type, the action, and the attack damage statistic.

- ↑ The term 'proc' refers to a mechanic that has a chance of triggering, which is common in games such as World of Warcraft (e.g., "Your attacks have an x % chance to cause [...]" effects). League of Legends originally featured 'true' proc effects (e.g., "your attacks have a chance to slow.") However, the design philosophy of Riot Games' over-time grew more towards preferring 'on-hit' or "every nth attack" to purely random mechanics. Despite this: the engine-level label persisted. The term 'proc' now describes all additional effect triggers even if they are not guaranteed, 'proc' is used as a verb when triggering such an effect.

### Untagged

Untagged damaging effects also exist, which can have completely custom properties, though they are rare. On the League of Legends Wiki, these are referred to as default damage (not official terminology). Some examples are listed below.

- All executes ( Elder Immolation, Pyke's Death from Below, Ziggs' Satchel Charge against turrets, etc), which ignore shields.

- The Nexus Obelisk's damage, which ignores shields.

- Aphelios' Crescendum's attack secondary damage.

- Milio's Fired Up! when applied via self-cast only.

- Umbral Glaive's Blackout ward damage.

- A portion of all zero-damage instance spells, such as Bard's Tempered Fate, Zilean's Time Bomb's application, Trundle's Pillar of Ice's displacement, and Ignite's application (exists separately to its ticks of non-zero damage).

Untagged effects which *also* bypass death protection are termed raw damage. In the context of champions, this only includes the Nexus Obelisk's damage against them specifically (it uniquely respects death protection against non-champions) and Zac's Cell Division's damage redirection. It is however common in other systems, such as the pit Rift Herald's Eye damage, the summoned Mercenary's self-damage when hitting a turret, Mutated Scryer's Bloom's ward damage in the Chemtech Rift, and others.

### Properties

Damage **properties** determine the *behavior* of the damage instance. As stated above, tags can imply certain properties as implemented, but apart from ActiveSpell's behavior these are technically completely customizable.

- **ApplyAttackRatio:** (Unknown)

- **ApplyCritical:** (Unknown)

- **ApplyDamageModifier:** When disabled, the damage instance will be unaffected by damage modifiers.

- **ApplyLifesteal:** When enabled, the damage instance applies  life steal. Unlike vamp effects, this is not healing through damage dealt. Healing modifiers that affect  life steal also affect spells with this tag.

- **ApplyOmnivamp:** When enabled, the damage instance applies  omnivamp.

- **ApplyPhysicalVamp:** When enabled, the damage instance applies  physical vamp. Due to the stat being unused, this property is likewise deprecated.

- **ApplySpellvamp:** When enabled, the damage instance applies  spell vamp. Due to the stat being unused, this property is likewise deprecated.

- **EnableCallForHelp:** When enabled, the damage instance triggers enemy minion aggression on the user.

- **EnableKill:** When disabled, the damage instance will never be able to deal lethal damage. Mostly used for systems other than champion and minion combat.

- **RespectDodge:** When enabled, the damage instance will be prevented via dodge effects (e.g. Nilah's Jubilant Veil, Jax's Counter Strike).

- **RespectImmunity:** When disabled, the damage instance will ignore all death protection effects and kill the enemy. Spell shield may still prevent the application of the effect, if applicable.

- **TriggerDamageEvents:** When disabled, the damage instance will ignore effects that trigger from the damage type and will behave as it were not considered one (except for stat tracking).

- **TriggerOnHitEvents:** When enabled, the damage instance will apply on-hit effects.

### Unexpected effect tags

These effects have certain tags or combine properties of multiple tags in a manner that renders their behavior unexpected or complicated to players. Note that these are not necessarily considered bugs, however.

- Only tagged **AOE** ( Malphite's Thunderclap's cone)

- **Proc** damage that is also **ActiveSpell** ( Aftershock)

- **Item** damage that is also **BasicAttack** ( Heartsteel, Kraken Slayer)

- **Proc** damage that is also **AOE** ( Aphelios' Infernum cone damage, Galio's Colossal Smash, Sivir's Ricochet)

- **Proc** damage not tagged **AOE** ( Hextech Dragon Soul, Jinx's Switcheroo!'s Fishbones explosion, Nocturne's Umbra Blades, Rek'Sai's Queen's Wrath area attack, Volibear's The Relentless Storm's chain lightning, Zeri's Lightning Crash's chain lightning, Luden's Echo)

- Non-**AOE** damage that actually affects multiple enemies passively ( Aphelios' Sentry Infernum, Shaco's Jack in the Box)

- Always **AOE** damage that actually potentially affects only a single target ( Aphelios' Binding Eclipse, Kai'Sa's Icathian Rain, Katarina's Death Lotus, Lee Sin's Dragon's Rage, Senna's Piercing Darkness against minions, Sona's Hymn of Valor, Twisted Fate's Red Card, Wukong's Nimbus Strike, Titanic Hydra target and cone.)

- DoT effects not tagged **Periodic** ( Darius' Hemorrhage, Aspect of the Dragon).

- Repeating effects not tagged **Periodic** ( Ahri's Fox-Fire, Akshan's Comeuppance, Bel'Veth's Royal Maelstrom, Gangplank's Cannon Barrage, Gwen's Snip Snip!, Heimerdinger's Hextech Micro-Rockets, Kled's Pocket Pistol, Master Yi's Alpha Strike secondary hits, Nunu's Snowball Barrage, Ornn's Bellows Breath, Smolder's Flap, Flap, Flap, Swain's Death's Hand, Syndra's Unleashed Power, Warwick's Infinite Duress, Zeri's Burst Fire).

  - Similar effects tagged **Periodic** ( Kai'Sa's Icathian Rain additional hits, Lucian's The Culling, Taliyah's Threaded Volley additional hits, Katarina's Death Lotus)

- **Pet** basic attacks tagged **BasicAttack** ( Annie's Tibbers, Ivern's Daisy, Malzahar's Voidling and Yorick's Maiden of the Mist) - can trigger Infernal Dragon Soul and be reduced by Plated Steelcaps, but cannot apply Conqueror

- **Pet** basic attacks *not* tagged **BasicAttack** ( Elise's Spiderling, Heimerdinger's H-28G Evolution Turret, Shaco's Jack in the Box, Yorick's Mist Walker, Zyra's Garden of Thorns) - cannot trigger Infernal Dragon Soul nor be reduced by Plated Steelcaps, but can apply Conqueror

- Ability-modified attacks that are not tagged **BasicAttack** ( Twisted Fate's Pick a Card) ^(unexpected)

- Attack **additional** damage that applies lifesteal but is not tagged **BasicAttack** ( Riven's Runic Blade, Vayne's Tumble, Wukong's Crushing Blow, Xin Zhao's Determination)

  - Similar effects that apply lifesteal and are tagged **BasicAttack** ( Kled's Violent Tendencies, Rengar's Savagery and Thrill of the Hunt)

## Damage values

### Base values and character statistics ratios

### 0 Damage Instances

The following effects deal 0 proc damage, triggering events that occur upon dealing/taking damage (such as drawing turret aggro and the in-combat status), but not applying spell effects.

- Anivia's Crystallize

- Bard's Tempered Fate

- Ezreal's Essence Flux (on application)

- Tristana's Explosive Charge (on application)

- Trundle's Pillar of Ice

- Yorick's Dark Procession

- Zilean's Time Bomb (when it snaps onto an enemy)

- Ignite (on application)

The following abilities deal 0 ability damage, triggering events that occur upon dealing/taking damage (such as drawing turret aggro and the combat status), while also applying spell effects.

- Vladimir's Sanguine Pool (final tick)

Neeko can deal 0 damage with certain disguises.

### Critical strike

A damage instance can **critically strike** when it is implemented as such on an active attack or ability. Damage that critically strikes has been modified by a percentage above 100%, thus deals increased damage. Most critical strikes interact exclusively with  critical strike chance,  critical strike damage, and Randuin's Omen's Resilience. The highest critical strike damage instance is also tracked in the post-game statistics.

|   |   |   |
| --- | --- | --- |
| Physical damage critical strike | Magic damage critical strike | True damage critical strike |

A basic attack that critically strikes is modified by the attacker's  critical strike damage, which is by default 200%. (since v26.01; before v10.23)
Previously 175%. (from v10.23; until v26.01)
Most on-hit effects, and spells will be unaffected, unless specified otherwise (e.g. Riven's Runic Blade).

By default,  critical strike chance above 100% does nothing. Certain gamemodes and champions may have exceptions.

**Average damage calculations**

> Formula Assumes the Following:

- *All amounts are in decimal form.*

- DamageBase = the damage that can crit

  - Set value to 1.00 to get average damage multiplier

- CritChance = critical strike chance

- CritMod = critical strike modifier/multiplier/ratio

  - This affects your Damage Increase from your attack critting

Then the average damage per attack when continously attacking can be calculated with the formula:

 `[ AverageDamage(DamageBase) = DamageBase + CritChance × (CritMod − 1) × DamageBase ; = DamageBase × (1 + CritChance × (CritMod − 1)) ; = DamageBase × (ExpectedDamageMultiplier) ]`

*Examples*

| Crit Stat Combination | Calculation | Possible Item Combination |
| --- | --- | --- |
| 1.00 DamageBase, 50% CritChance, 200% CritMod | `1.00 × (1 + 0.50 × (2.00 − 1)) = 1.5000` average damage per attack (1.5000x average damage multipler) | 2 Crit Items, No Infinity Edge |
| 1.00 DamageBase, 75% CritChance, 200% CritMod | `1.00 × (1 + 0.75 × (2.00 − 1)) = 1.7500` average damage per attack (1.7500x average damage multipler) | 3 Crit Items, No Infinity Edge |
| 1.00 DamageBase, 50% CritChance, 230% CritMod | `1.00 × (1 + 0.50 × (2.30 − 1)) = 1.6500` average damage per attack (1.6500x average damage multipler) | 2 Crit Items, With Infinity Edge |
| 1.00 DamageBase, 75% CritChance, 230% CritMod | `1.00 × (1 + 0.75 × (2.30 − 1)) = 1.9750` average damage per attack (1.9750x average damage multipler) | 3 Crit Items, With Infinity Edge |

*More Examples:*

| Crit Stat Combination | Calculation | Possible Item Combination |
| --- | --- | --- |
| 1.00 DamageBase, 25% CritChance, 200% CritMod | `1.00 × (1 + 0.25 × (2.00 − 1)) = 1.2500` average damage per attack (1.2500x average damage multipler) | 1 Crit Item, No Infinity Edge |
| 1.00 DamageBase, 50% CritChance, 200% CritMod | `1.00 × (1 + 0.50 × (2.00 − 1)) = 1.5000` average damage per attack (1.5000x average damage multipler) | 2 Crit Items, No Infinity Edge |
| 1.00 DamageBase, 75% CritChance, 200% CritMod | `1.00 × (1 + 0.75 × (2.00 − 1)) = 1.7500` average damage per attack (1.7500x average damage multipler) | 3 Crit Items, No Infinity Edge |
| 1.00 DamageBase, 100% CritChance, 200% CritMod | `1.00 × (1 + 1.00 × (2.00 − 1)) = 2.0000` average damage per attack (2.0000x average damage multipler) | 4 Crit Items, No Infinity Edge |
| 1.00 DamageBase, 25% CritChance, 230% CritMod | `1.00 × (1 + 0.25 × (2.30 − 1)) = 1.3250` average damage per attack (1.3250x average damage multipler) | 1 Crit Item, With Infinity Edge |
| 1.00 DamageBase, 50% CritChance, 230% CritMod | `1.00 × (1 + 0.50 × (2.30 − 1)) = 1.6500` average damage per attack (1.6500x average damage multipler) | 2 Crit Items, With Infinity Edge |
| 1.00 DamageBase, 75% CritChance, 230% CritMod | `1.00 × (1 + 0.75 × (2.30 − 1)) = 1.9750` average damage per attack (1.9750x average damage multipler) | 3 Crit Items, With Infinity Edge |
| 1.00 DamageBase, 100% CritChance, 230% CritMod | `1.00 × (1 + 1.00 × (2.30 − 1)) = 2.3000` average damage per attack (2.3000x average damage multipler) | 4 Crit Items, With Infinity Edge |
| 1.00 DamageBase, 25% CritChance, 225% CritMod | `1.00 × (1 + 0.25 × (2.25 − 1)) = 1.3125` average damage per attack (1.3125x average damage multipler) | 1 Crit Item, With Infinity Edge |
| 1.00 DamageBase, 50% CritChance, 225% CritMod | `1.00 × (1 + 0.50 × (2.25 − 1)) = 1.6500` average damage per attack (1.6250x average damage multipler) | 2 Crit Items, With Infinity Edge |
| 1.00 DamageBase, 75% CritChance, 225% CritMod | `1.00 × (1 + 0.75 × (2.25 − 1)) = 1.9375` average damage per attack (1.9375x average damage multipler) | 3 Crit Items, With Infinity Edge |
| 1.00 DamageBase, 100% CritChance, 225% CritMod | `1.00 × (1 + 1.00 × (2.25 − 1)) = 2.2500` average damage per attack (2.2500x average damage multipler) | 4 Crit Items, With Infinity Edge |
| 1.00 DamageBase, 40% CritChance, 175% CritMod | `1.00 × (1 + 0.40 × (1.75 − 1)) = 1.3000` average damage per attack (1.3000x average damage multipler) | 2 Crit Items, No Infinity Edge |
| 1.00 DamageBase, 40% CritChance, 250% CritMod | `1.00 × (1 + 0.40 × (2.50 − 1)) = 1.6000` average damage per attack (1.6000x average damage multipler) | 2 Crit Items, With Infinity Edge |

**Average damage explanation**

Intuitively understand that critical strikes can be considered a 'percent chance' to increase damage by 'some percent' (with variance of course)
along with some math to convert it to a multiplier

Crit multiplier explanation

- For a 175% (1.75x) crit multiplier, this 'some percent' damage increase is 75% (Add 0.75x base damage)

- For a 200% (2.00x) crit multiplier, this 'some percent' damage increase is 100% (Add 1.00x base damage)

- For a 230% (2.30x) crit multiplier, this 'some percent' damage increase is 130% (Add 1.30x base damage)

- For a CritMod (?.??x) crit multiplier, this 'some percent' damage increase is (CritMod% - 100%) (Add [CritMod - 1.00]x base damage)

Some abilities or characters have a crit multiplier attached to them also. (e.g Yasuo's Way of the Wanderer) Simply multiply by that number to get the final result.

Crit chance explanation

With a 25% 'percent chance' to increase damage by 'some percent', this is equivalent to (on average, with some variance) increasing your damage dealt by 25% of your 'some percent' damage increase.

- A 25% 'percent chance' to increase damage by 75% is equivalent to increasing your damage by 18.75% (25% of a +75% damage increase is a 1.1875x damage increase)

- A 1% 'percent chance' to increase damage by 75% is equivalent to increasing your damage by 0.75% (1% of a +75% damage increase is a 1.0075x damage increase)

- A 25% 'percent chance' to increase damage by 100% is equivalent to increasing your damage by 25% (25% of a +100% damage increase is a 1.25x increase)

- A 1% 'percent chance' to increase damage by 100% is equivalent to increasing your damage by 1% (1% of a +100% damage increase is a 1.01x increase)

### Successful ability casts

Certain abilities have unique impact text that triggers when they deal increased damage due to the player successfully passing the ability's condition (e.g. to denote Karthus' Lay Waste hitting a single target). On the LoL Wiki, these are referred to as cosmetic critical strikes (not to be confused with actual critical strikes). A list of all abilities that use this impact effect can be found below.

|   |   |   |
| --- | --- | --- |
| Physical damage "successfully enhanced" | Magic damage "successfully enhanced" | True damage "successfully enhanced" |

- Ambessa's Cunning Sweep against enemies hit by the outer edge and Sundering Slam against the first enemy hit

- Anivia's Frostbite against enemies recently hit by Flash Frost or a fully formed Glacial Storm

- Aurelion Sol's Breath of Light against bursted enemies and The Skies Descend against enemies hit

- Briar's Chilling Scream against enemies that hit a wall

- Caitlyn's Piltover Peacemaker against enemies hit if they were revealed by Yordle Snap Trap

- Evelynn's Empowered Whiplash against the target and Last Caress against enemies under the health threshold

- Fiddlesticks' Terrify against the target if they were recently feared by the ability

- Gnar's GNAR! against enemies that collide with terrain

- Gragas' Barrel Roll against enemies hit after the barrel has fully fermented

- Gwen's Snip Snip! against enemies hit in the center of the cone

- Hwei's Severing Bolt against immobilized or isolated targets

- Karthus' Lay Waste against an isolated enemy

- Kog'Maw's Living Artillery against enemies under the health threshold

- LeBlanc's Sigil of Malice's detonation

- Lillia's Watch Out! Eep! against enemy champions and monsters hit in the center of the area

- Lulu's Glitterlance against enemies hit by both bolts

- Malphite's Thunderclap against the target hit by the first attack

- Milio's Fired Up! against targets hit by the burst

- Mordekaiser's Obliterate against a single target

- Naafiri's Darkin Daggers against the target if they are already bleeding

- Nidalee's Takedown against the target if they were Hunted

- Pantheon's Comet Spear against enemies under the health threshold

- Pyke's Death from Below against executed enemy champions

- Qiyana's Elemental Wrath (**Terrain**) against enemies under the health threshold

- Rek'Sai's Furious Bite at maximum Fury

- Ryze's Overload against enemies marked by Spell Flux

- Samira's Taunt against the enemy hit

- Shaco's Two-Shiv Poison against enemies under the health threshold

- Shyvana's Emberstrike's third cast against the target

- Seraphine's High Note against enemies that take increased damage

- Sett's Haymaker and The Show Stopper against enemies hit in the center of the respective areas

- Shen's Twilight Assault's super-empowered attacks after the blade has hit an enemy champion

- Smolder's MMOOOMMMM! against enemies in the center

- Taliyah's Threaded Volley when casting on Worked Ground

- Udyr's Awakened Wilding Claw against both the target and enemies hit by the lightning, and Awakened Wingborne Storm's bonus damage

- Urgot's Fear Beyond Death against the executed target

- Varus' Piercing Arrow against enemies hit if the ability was fully charged (includes Blighted Quiver's bonus damage)

- Vayne's Condemn against the target if they collide with terrain

- Vex's Doom 'n Gloom against targets marked with *Gloom*

- Vladimir's Transfusion against the target if the ability was empowered by Crimson Rush

- Volibear's Frenzied Maul against the target if they are *Wounded* and Stormbringer against enemies hit in the center of the area

- Yorick's Mist Walkers upon attacking enemies marked by Mourning Mist

- Zaahen's Aureate Rush against enemies hit by the outer edge

- Zeri's Living Battery against executed targets

- Ziggs' Satchel Charge against turrets below the health threshold

- Rift Herald's charge against turrets

- Serpent's Fang's Shield Reaver against shields

- Arcane Comet when dealing damage at 100% increase

- Demolish (incorrectly uses the critical strike icon instead)

### Capped damage

## Damage value modifiers

*See also: Damage modifier*

### Invulnerability

*See also: Invulnerability*

### Calculating mitigation

*See also: Armor and Magic Resistance*

### Calculating applied damage

*See also: Shields*

## Subtypes

### Resistance subtypes

*See also: Armor and Magic Resistance*

Resistance subtypes are a secondary typing system that exists to promote champion classes by diversifying the effectiveness of items and champion match-ups. There is a small selection of effects that are triggered by specific subtypes rather than the above archetypes - e.g. Morellonomicon will trigger on anything with the magic damage subtype, including abilities, basic attacks and on-hit effects (i.e. Wit's End will trigger Morellonomicon on a champion with no other source of magic damage). These are the damage types visible to players in-game.

| Name | Description | Example |
| --- | --- | --- |
| Physical damage | A damage type thematically associated with making physical contact, such as fists, swords and the physical projectiles of bows and guns.  Armor reduces incoming physical damage. | Most basic attacks; most AD-scaling abilities; some item effects. |
| Magic damage | A damage type thematically associated with non-physical, such as magic or the supernatural.  Magic resistance reduces incoming magic damage. | Most AP-scaling abilities; some item effects. |
| True damage | A damage type thematically associated with bypassing the target's defenses. Not to be confused with raw damage. | A select few sources, such as Smite, Ignite, Silver Bolts and Reckless Swing. |

## Calculating Damage

> *Also see: Damage modifier.*

The following effects influence damage as non-zero values, in no particular order of calculation. They may originate from the attacker or the target.

- Percentage damage amplification

- Percentage damage reduction

- Flat damage reduction

- Resistances, meaning  armor and  magic resistance, against physical damage and magic damage, respectively

- Resistances reduction

- Resistances penetration, meaning  armor penetration and  magic penetration

Resistances effectively reduce the respective damage subtype (physical or magic) by a **percentage**. However, **"percent damage reduction"** is a different, independent effect: abilities such as Alistar's Unbreakable Will and item effects such as Plated Steelcaps' *Plating* may grant it as a beneficial effect while effects such as Exhaust may apply it as a debuff. Percent damage modifiers stack multiplicatively with the damage reduction achieved through resistances.

After the physical and magic damage is affected by the various reductions, it is applied to the target in  health amount. This amount received by the target is called *post-mitigation damage*.

## Capped Damage

Some abilities, scaling with target's health, have a capped amount of damage they can deal to a target. This is made to avoid dealing massive damage to targets with a lot of health, most often against only minions and/or monsters.

- If the ability deals enough damage (before damage reductions) to reach the cap, the ability's damage is reduced to the cap and damage reductions are then applied. This means that against a target that has negative armor or magic resistance the ability's post-mitigation damage can be higher than the cap.

## Misconceptions

The resistance types—physical, magic and true—are often regarded by players to be the archetypal damage types, which leads to a lot of misconceptions.

For example, some players believe that magic damage, ability damage and AP are all interchangeable terms, with even prominent streamers referring to abilities as dealing "AP damage" and "AD damage". This is incorrect. It is possible for basic attacks to deal magic damage (e.g. Thresh with a point in Flay); it is possible for abilities to deal physical damage (e.g. Riven); it is possible for AD-scaling abilities to deal magic damage (e.g. Shyvana); and it is possible for non-magic damage to apply spell effects (e.g. Luden's Echo would trigger on Riven if she chose to buy it, although she's discouraged due to her having no AP scalings).

Similarly, many players believe that life steal and spell vamp are specific to physical and magic damage, respectively. Life steal will apply to anything classified as basic damage (including the magic damage from Takedown and Infinite Duress and true damage from Hextech Munitions), and spell vamp will apply to anything classified as ability damage (including the physical damage from Comet Spear and true damage from Reckless Swing).

## See also

- Damage modifier

- Magic damage

- Physical damage

- True damage

**Gameplay Elements**

 League of Legends content

Invulnerability

A unit that is **Invulnerable** reduces all damage taken to **0** and prevents effects that trigger from damage.

 League of Legends content

Shield

A **shield** adds hitpoints over the unit's  health that absorbs the next instances of damage in place of actual health. This can be improved by various items and effects depending on the type of **shielding**.

 League of Legends content

Critical strike

**Critical strike** refers to an effect that deals increased damage under specific circumstances, denoted as  critical strike damage. The most common form of critical strike occurs on basic attacks, which triggers based on  critical strike chance.

By default, a critical strike deals 200% of the normal damage. Critical damage modifiers such as Infinity Edge can increase this percentage.

 League of Legends content

Turret

A **turret**, also called a **tower**, is a fortification that defends a part of territory. It provides vision of the area and autonomously fires homing bolts at nearby enemies, establishing a defensive ground for allies.

Turrets are most notable in Classic, defending against waves of enemy Minions from their ultimate goal of destroying the nexus. Champions work to destroy enemy turrets to push their assault into the enemies' territory. Turrets visually fall apart as they take damage.

 League of Legends content

| Meditate | COOLDOWN: 10 |
| --- | --- |

| **Active:** Master Yi channels for a few seconds, rapidly healing himself based on his **missing** health. |
| --- |
| While channeling, **Master Yi** gains damage reduction, pauses * Wuju Style's* and * Highlander's* duration, and gains one stack of * Double Strike* per second. |

 League of Legends content

Spell shield

A **spell shield** refers to one of several effects that have the capacity to negate hostile abilities from applying to the recipient. A **spell shield** may negate many active effects coming from champion abilities, epic monsters, champion summoned units, and items, but almost none from runes and summoner spells with the only exceptions of Arcane Comet, Unleashed Smite, and Primal Smite which will be blocked.

- *See the article for more details.*

 League of Legends content

| Riposte | COOLDOWN: 24 / 22 / 20 / 18 / 16 |
| --- | --- |

| **Active:** Fiora briefly parries all incoming damage and debuffs, then stabs in a direction, dealing magic damage to enemies hit. |
| --- |
| The stab slows the first enemy champion hit, or stuns them if **Fiora** parried a hostile immobilizing effect. |

 League of Legends content

Execute

**Executes** deal damage equal to 100% of the target's **current** health, which is usually true damage, while ignoring all mitigations. Those that affect champions may additionally have the property of breaking 100% of the target's current shields before applying their damage.

Most **executes** do not ignore invulnerability, resurrection and effects that grant a minimum health threshold. If they do, they are termed raw damage.

 League of Legends content

Turret

A **turret**, also called a **tower**, is a fortification that defends a part of territory. It provides vision of the area and autonomously fires homing bolts at nearby enemies, establishing a defensive ground for allies.

Turrets are most notable in Classic, defending against waves of enemy Minions from their ultimate goal of destroying the nexus. Champions work to destroy enemy turrets to push their assault into the enemies' territory. Turrets visually fall apart as they take damage.

 League of Legends content

| Power Fist | COOLDOWN: 7 / 6.5 / 6 / 5.5 / 5 |
| --- | --- |

| **Active:** Blitzcrank charges up a fist to make the next basic attack deal double damage and knock up the target into the air. |
| --- |

 League of Legends content

| Crippling Strike | COOLDOWN: 5 |
| --- | --- |

| **Active:** Darius' next basic attack within a few seconds deals increased physical damage and slows the target. |
| --- |
| If the empowered attack kills the target, the cooldown is  reduced and the  mana cost is refunded. |

 League of Legends content

| Mystic Shot | COOLDOWN: 5.5 / 5.25 / 5 / 4.75 / 4.5 |
| --- | --- |

| **Active:** Ezreal fires a bolt of energy that deals physical damage to the first enemy hit. |
| --- |
| If the bolt hits an enemy, all of **Ezreal's** ability cooldowns are  reduced. |
| *Mystic Shot* applies on-hit and on-attack effects. |

 League of Legends content

| Lunge | COOLDOWN: 13 / 11.25 / 9.5 / 7.75 / 6 |
| --- | --- |

| **Active:** Fiora dashes in the target direction and then stabs a nearby enemy, dealing physical damage and applying on-hit effects. |
| --- |
| If she stabs a target, the cooldown is  reduced. |

 League of Legends content

| Heroic Swing | COOLDOWN: 18 / 16.5 / 15 / 13.5 / 12 |
| --- | --- |

| **First Cast:** Akshan prepares to swing by firing a hook that embeds in the first terrain hit. *Heroic Swing's* second cast can be used while the hook is attached. |
| --- |
| **Second Cast:** **Akshan** swings around the terrain in a direction, firing physical damage bullets at the nearest enemy. He may swing indefinitely, or until he collides with an enemy champion or terrain. |
| **Third Cast:** While swinging, he can recast again to jump toward the target location and fire a final shot. *Heroic Swing's*  cooldown will reset upon scoring a champion takedown. |
| *Heroic Swing* applies on-hit effects. |

 League of Legends content

| Royal Maelstrom | COOLDOWN: 24 / 21 / 18 / 15 / 12 |
| --- | --- |

| **Active:** Bel'Veth enters a brief defensive stance, gaining  life steal and damage reduction. During this time, **Bel'Veth** rapidly slashes at the most wounded enemy, with the max number of slashes increased based on her **bonus** attack speed. Each slash deals physical damage, and applies  life steal, on-hit and spell effects based on the target's **missing** health. |
| --- |
| *Royal Maelstrom* can be recast within the duration, and does so automatically afterwards or when **Bel'Veth** casts an ability. |
| **Recast:** **Bel'Veth** ends *Royal Maelstrom*. |

 League of Legends content

| Purge | STATIC CD: 0.5 • 0.25 |
| --- | --- |

| **Passive:** Urgot's other abilities *mark* enemy champions hit for a few seconds, only one enemy can be *marked* at a time. |
| --- |
| **Active:** For a few seconds, **Urgot** autonomously attacks the nearest enemy at a  **fixed** attack speed, prioritizing the *marked* enemy. He also gains slow resist, but his movement speed is reduced. *Purge* can be recast within the duration, and does so automatically afterwards; at max rank however, *Purge* lasts indefinitely and becomes a **toggled** ability. |
| **Recast:** **Urgot** ends *Purge*. |
| *Purge's* attacks deal **modified** physical damage and cannot critically strike. |

 League of Legends content

On-hit effect

**On-hit effects** refers to a category of effects that are applied on some damage instances, through the *TriggerOnHitEvents* property. Champion basic damage through their basic attack applies **on-hit effects** by default, but many other spells are made to do the same. The damage of most **on-hit effects** itself is in turn usually tagged proc, which is non-reactive (= does not trigger further damage-tag-specific effects).

Some important clarifications:

- A critical strike is not an on-hit effect. Their application is handled completely separately.

- Health restoration from  life steal is not an **on-hit effect**. However, damage can be made to apply life steal through the ApplyLifesteal property, and this is also employed on some **on-hit effects**.

**On-hit effects** contrast with ability effects, which apply on instances of ability damage.

 League of Legends content

Ability effects

**Ability effects** refers to a category of effects that trigger upon dealing ability damage. The damage of most **ability effects** itself is in turn usually tagged proc, which is non-reactive (= does not trigger further damage-tag-specific effects).

**Ability effects** contrast with attack effects, which apply on instances of basic damage.

 League of Legends content

| The Culling | COOLDOWN: 110 / 100 / 90 |
| --- | --- |

| **Active:** Lucian channels for a few seconds to rapidly fire a torrent of bullets in the target direction. Each shot deals physical damage to the first enemy hit. *The Culling* can be recast within the duration. |
| --- |
| While channeling, **Lucian** is ghosted and may still move. |
| **Recast:** **Lucian** ends *The Culling*. |

 League of Legends content

| Tormented Shadow | COOLDOWN: 12 |
| --- | --- |

| **Passive:** *Tormented Shadow's* **current** cooldown is  reduced whenever * Soul Siphon* triggers. |
| --- |
| **Active:** Morgana desecrates the target area for a few seconds, which continually deals magic damage to enemies based on their **missing** health. |

 League of Legends content

| Malefic Visions | COOLDOWN: 11 / 10 / 9 / 8 / 7 |
| --- | --- |

| **Active:** Malzahar infects the target enemy's mind, continually dealing magic damage over a few seconds, which refreshes upon damaging them with * Call of the Void* or * Nether Grasp*. |
| --- |
| If the target dies while infected, they spread *Malefic Visions* onto the closest nearby enemy and **Malzahar** restores a portion of  his **maximum** mana. |

 League of Legends content

| Poison Trail | STATIC CD: 1 |
| --- | --- |

| **Toggle:** Singed continually creates a toxic cloud that shortly lingers in his wake, which continually inflicts poison to enemies within. |
| --- |
| ** poison:** The target continually takes magic damage over a short time. Subsequent inflictions refresh the duration. |

 League of Legends content

Sleep

A unit that is *asleep* is unable to control its movement, declare attacks, cast abilities, activate items or use the summoner spells Flash, Teleport, Hexflash, and Mark / Dash for the duration. *Sleep* occurs after the duration of drowsiness finishes. ***Sleep* is an immobilizing effect**.

| Interrupts: | Falling *asleep* interrupts attack windups (excluding uncancellable basic attacks) and all channeled and charged abilities. |
| --- | --- |
| Reduction: | The **duration** is affected by Tenacity. |
| Resist: | Resisted by crowd control immunity, displacement immunity, and Dr. Mundo's Goes Where He Pleases. |
| Removal: | Removed by Cleanses and taking damage that is not persistent nor indirect. Damage originating from minions, and small and medium monsters, will not affect *sleep*. Any damage instance less than or equal to a value of 10 post-mitigation is also ignored and will not affect *sleep*. |

Crowd control applied by one's self or an ally cannot be countered in any way, neither *reduced* in duration, *resisted*, nor *removed* unless special cased to do so.

- The crowd control effect may still be cleansed if it is applied as a debuff separate from the originated ability.

 League of Legends content

Ability effects

**Ability effects** refers to a category of effects that trigger upon dealing ability damage. The damage of most **ability effects** itself is in turn usually tagged proc, which is non-reactive (= does not trigger further damage-tag-specific effects).

**Ability effects** contrast with attack effects, which apply on instances of basic damage.

 League of Legends content

| Sleepy Trouble Bubble | COOLDOWN: 18 / 17 / 16 / 15 / 14 |
| --- | --- |

| **Active:** Zoe kicks a bubble in the target direction that bursts upon the first enemy hit. At max range, it will linger as a trap for a few seconds that bursts upon enemy contact. |
| --- |
| The burst deals magic damage and briefly inflicts drowsy, which gradually slows them. Afterwards, the target falls asleep for a short time, during which they cannot act. |
| If the target is attacked during Sleep by an enemy champion, large monster, or turret, they wake up and take **bonus** true damage equal to the attack, up to a cap. |

 League of Legends content

Monster

**Monsters** are neutral units in **League of Legends**. Unlike minions, monsters do not fight for either team, and will only do so if *aggroed* (provoked) – with the exception of the Rift Scuttler, which simply runs away when attacked.

 League of Legends content

| Friend of the Forest |   |
| --- | --- |

| **Innate:** Ivern cannot attack nor damage non-epic monsters. When he targets a jungle camp, he plants a magical grove under it at the cost of health and mana. |
| --- |
| The grove charges up over time to fully mature, upon which **Ivern** can then target the monsters to instantly clear the camp. Using Smite on a monster in the grove will clear the camp regardless of maturity. |

 League of Legends content

Arena

**Arena** is a team deathmatch game mode organized in a tournament format that consists of eight teams of two players fighting on six different battlefields. Teams brawl in rotating combat rounds while powering themselves up with unique Augments and Items and using multiple environmental features to their advantage, in a display of both deeply tactical and highly explosive combat until the last team standing.

**Regular Modes**

- *8-Team Round-Robin Tournament*

**Battlefields — The Grand Reckoning**

> 

- *Ancestral Woods*

- *Desert Oasis*

- *Frostbite Thicket*

- *Koi Pond*

- *Magma Chamber*

- *Reckoner Arena*

 League of Legends content

ARAM: Mayhem

**ARAM: Mayhem** is an altered version of the **ARAM** game mode. Its most prominent feature is the addition of a multitude of *augments*, unique power-ups that greatly enhance champions' capabilities.

**Regular Modes**

- Classic 5v5 ( All random)

- Custom

 League of Legends content

| Lay Waste | COOLDOWN: 1 |
| --- | --- |

| **Active:** Karthus conjures a delayed blast at the target location that deals magic damage to all enemies within, doubled when only one target is struck. |
| --- |

 League of Legends content

Default damage

**Default damage** is the community-created term for damage instances that are untagged.

While other damage tags have certain behaviors and systems that interact with them (whether including or excluding them), default damage only interacts with its damage properties, which can be completely custom. An example of **default damage** effects is executes, which deal 100% of the target's  **current** health (**"execution damage"**). Most **default damage** effects respect death protection, i.e., invulnerability will nullify damage, resurrection will activate upon receiving lethal damage, and units with a minimum health threshold are left at 1 health rather than the threshold, when dealt lethal damage. When they do not, they are called ** raw damage**.

 League of Legends content

| Death from Below | COOLDOWN: 100 / 85 / 70 |
| --- | --- |

| **Active:** Pyke strikes the target location in a X pattern, which executes enemy champions hit that are at low health. Other enemies hit are instead dealt physical damage. |
| --- |
| If *Death from Below* hits an enemy champion, **Pyke** will blink to the location. If an enemy champion dies inside the X, *Death from Below* can be recast within a period of time at no cost. |
| Each execution grants kill gold to both **Pyke** and the last assisting ally instead of the natural assist gold. |

 League of Legends content

| Satchel Charge | COOLDOWN: 20 / 18 / 16 / 14 / 12 |
| --- | --- |

| **Active:** Ziggs hurls a charge to the target location that remains for a few seconds. *Satchel Charge* can be recast within the duration, and does so automatically afterwards. |
| --- |
| **Recast:** The charge explodes to deal magic damage and knock back nearby enemies hit. If this hits **Ziggs**, he will dash farther away. |
| The explosion will execute turrets hit below a certain health. |

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

 League of Legends content

| Fired Up! |   |
| --- | --- |

| **Innate:** Milio's abilities enchant allied champions on-contact, causing their next basic attack or ability hit shortly after to apply a burst and then a short burn to the target enemy, both parts dealing magic damage. |
| --- |

 League of Legends content

| Tempered Fate | COOLDOWN: 110 / 95 / 80 |
| --- | --- |

| **Active:** Bard sends spirit energy arcing to a location, putting all champions, minions, monsters, and turrets hit into stasis for a short time. |
| --- |

 League of Legends content

| Time Bomb | COOLDOWN: 10 / 9.5 / 9 / 8.5 / 8 |
| --- | --- |

| **Active:** Zilean throws a ticking time bomb to the target location that will attach upon enemy contact, revealing them. It will detonate after a short time or when the attached unit dies, dealing magic damage to nearby enemies hit. |
| --- |
| The bomb will detonate immediately if another bomb attaches to the same target, briefly stunning enemies hit. |

 League of Legends content

| Pillar of Ice | COOLDOWN: 21 / 19.5 / 18 / 16.5 / 15 |
| --- | --- |

| **Active:** Trundle erects an ice pillar at the target location that remains for a few seconds, which knocks back units hit. The pillar acts as terrain and slows nearby enemies. |
| --- |

 League of Legends content

Raw damage

The term **raw damage** applies to a rare form of default damage that does not respect death protection and immunity effects on the target at all, such as invulnerability, minimum health threshold and resurrection. Spell shield, if applicable, is the only way to potentially avoid **raw damage** by negating the origin spell's effects entirely (which would include avoiding their damage).

**Raw damage** also does not interact with any effect. In the context of champions, the Nexus Obelisk against them and Zac's Cell Division's redirected damage are the only **raw damage** effects. Various other systems utilize it however, such as Rift Herald's self-damage.

 League of Legends content

| Cell Division | STATIC CD: 300 |
| --- | --- |

| **Innate - Goo:** Zac's abilities have a  health cost. Whenever **Zac's** abilities damage an enemy, he sheds a number of chunks on the ground that remain for a few seconds. **Zac** and enemy champions can collect the chunks; an enemy will destroy it, while **Zac** will heal a portion of his **maximum** health. |
| --- |
| **Innate - Cell Division:** Periodically when **Zac** would die, he instead enters resurrection for a period, splitting into four *bloblets* that can be attacked by enemies. **Zac** will die once all *bloblets* are killed. |
