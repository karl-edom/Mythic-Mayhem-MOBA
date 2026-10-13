Source: https://wiki.leagueoflegends.com/en-us/Critical_strike

> LoL wiki page "Critical strike" (revision 4059009), rendered HTML converted to Markdown by tools/extract/lol/mechanics.ts. Content © League of Legends Wiki contributors, CC BY-SA 3.0. Reference material for private research only.

# Critical strike

> *For information about the **success floating text, also referred to as "cosmetic crits"**, see Damage#Successful ability casts.*

Critical strike icon

A **critical strike** is a damage event that deals 200% of its normal value by default, denoted as  critical strike damage. This can occur on some items and abilities, and almost always on basic attacks. Depending on the effect, a critical strike would occur under specific conditions via champion abilities or item abilities (and either passively or actively), or semi-randomly based on  critical strike chance.

Critical strikes interact exclusively with the game mechanics of  critical chance,  critical damage, and Randuin's Omen's Resilience. The most common form of critical strike occurs on basic attacks. Basic attacks cannot critically strike against structures. The exceptions are the enhanced attacks from Fiora's Bladework, Jhin's Whisper and Master Yi's Double Strike.

Critical strikes are especially valuable for champions who primarily output basic attacks rather than abilities, since champion basic attacks have lower cooldowns compared to most abilities. Some champions, like Ashe, have an affinity for critical strikes and benefit more than others from items that improve them.

## Critical strike chance

**Critical strike chance** (often shortened to *crit chance*, or *% crit* / *crit%*) is a stat that denotes the probability, or **chance**, that a basic attack will critically strike. Some damaging effects may be able to critically strike using the same chance, some others may scale with critical strike chance but are usually not able to critically strike themselves, and some may critically strike without a pre-requisite for this chance but based on other conditions.

- Critical strike chance ** stacks additively**, and each point acquired directly adds to the statistic (1:1).

All champions start at 0% critical strike chance, and can only increase it via items or certain abilities. Critical strike chance cannot exceed 100%, but some effects may be special-cased to benefit from the excess, such as by granting additional statistics (e.g. Senna's Absolution).

*Gold Value*

- Critical strike chance has a gold value of 40 per point.

## Algorithm

Critical strikes being rolled is not governed by complete RNG but by a pseudorandom algorithm that aims to alleviate full randomness in a manner that is not intrusive. Generally, the probability of a critical strike chance increases with the number of attacks that have not critically struck against the same target, called a failure streak. It is governed by the following rules:

- An internal constant, herein called *luck modifier*, is explicitly defined every 0.5 percent points of critical strike chance (rounded down when applying the user's critical strike chance). When graphed, the values resemble an error function where the midpoint (the 50% luck modifier mark) corresponds to exactly 63% critical strike chance.

- 20% of the user's **missing** critical strike chance is guaranteed to apply every roll. This determines an absolute maximum *modified* probability of a critical strike and prevents guaranteed critical strikes at any chance below 100%.

  - For example, at 25% critical strike chance, the maximum modified failure chance is 0.2 × (1 − 0.25) = 0.15 = 15%, making the maximum critical chance its 1-complement, 85%.

- Observed critical strike probability is defined as the minimum between [ the maximum modified probability ] and [ the product of the luck modifier and the current streak ].

- Streaks max out their probability at 5. This means any further rolls if unsuccessful will use the same probability as when on a streak of 5.

As a result, the probability of failure streaks noticeably increases at lower luck modifiers, and the probability of critical strike streaks noticeably increases at higher critical strike chance.

When averaged over a high number of basic attacks (i.e. calculating damage per second), critical strike chance is essentially a damage multiplier. At **base** critical strike damage (*100% bonus damage*), every 1% of critical chance equates to a 1% damage increase.

> For example, the damage dealt with basic attacks by a champion with 50% critical strike chance and base critical damage is on average 150% of the damage they would deal if they had 0% critical strike chance.

For this reason, critical strike chance scales well with both attack damage and attack speed. The formula for this damage multiplier is:

> *Average damage multiplier* = 1 + (*Critical chance* × (1 + ***Bonus** critical damage*))

## Increasing critical strike chance

### Items

This table is automatically generated based on the data from Module:ItemData/data.

| Item | Cost | Amount | Availability |
| --- | --- | --- | --- |
| Atma's Reckoning Atma's Reckoning | 2500 | 20% | ARAM: Mayhem, Arena |
| Cloak of Agility Cloak of Agility | 600 | 15% | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Essence Reaver Essence Reaver | 3050 | 25% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Fiendhunter Bolts Fiendhunter Bolts | 2650 | 25% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Force of Entropy Force of Entropy | 0 | 25% | Arena |
| Galeforce Galeforce | 0 | 25% | Arena |
| Hamstringer Hamstringer | 0 | 25% | Arena |
| Hexoptics C44 Hexoptics C44 | 2800 | 25% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Immortal Shieldbow Immortal Shieldbow | 3000 | 25% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Infinity Edge Infinity Edge | 3500 | 25% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Lord Dominik's Regards Lord Dominik's Regards | 3300 | 25% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Mortal Reminder Mortal Reminder | 3000 | 25% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Navori Flickerblade Navori Flickerblade | 2650 | 25% | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Noonquiver Noonquiver | 1300 | 20% | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |
| Phantom Dancer Phantom Dancer | 2650 | 25% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Rapid Firecannon Rapid Firecannon | 2650 | 25% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Rite of Ruin Rite of Ruin | 2500 | 25% | ARAM: Mayhem, Arena |
| Runaan's Hurricane Runaan's Hurricane | 2650 | 25% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Stormrazor Stormrazor | 3200 | 25% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Sword of the Divine Sword of the Divine | 0 | 50% | Arena |
| Talisman of Ascension Talisman of Ascension | 0 | 0% | Arena |
| The Collector The Collector | 3000 | 25% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| The Golden Spatula The Golden Spatula | 0 | 25% | ARAM: Mayhem, Arena |
| Yun Tal Wildarrows Yun Tal Wildarrows | 3000 | 0% | Nexus Blitz, Arena, Classic Summoner's Rift 5v5, All Random All Mid |
| Zeal Zeal | 1200 | 15% | Nexus Blitz, Classic Summoner's Rift 5v5, All Random All Mid |

### Champion abilities

- Senna's Absolution

- Tryndamere's Battle Fury

- Yasuo's Way of the Wanderer

- Yone's Way of the Hunter

## Critical strike chance as scaling

Some game elements scale with the champion's amount of critical strike chance.

### Champion abilities

- Akshan's Comeuppance

- Ashe's Frost Shot

- Caitlyn's Headshot and Ace in the Hole

- Corki's Missile Barrage

- Jhin's Whisper

- Kindred's Mounting Dread

- Lucian's The Culling

- Nilah's Formless Blade and Apotheosis

- Quinn's Harrier

- Senna's Absolution

- Sivir's Boomerang Blade

- Smolder's Dragon Practice and Super Scorcher Breath

- Tristana's Explosive Charge

- Twisted Fate's Pick a Card

- Viego's Blade of the Ruined King and Heartbreaker

- Xayah's Bladecaller

- Xin Zhao's Wind Becomes Lightning

- Yasuo's Way of the Wanderer

- Yone's Way of the Hunter

- Yuumi's Prowling Projectile

- Zeri's Spark Surge

### Items

- Essence Reaver

## Modifying critical strike damage

### General

- In most cases, critical strike damage stacks additively.

- Damage modifiers apply to critical strike damage normally.

### Champion abilities

- Ashe's Frost Shot

- Fiora's Bladework

- Jhin's Whisper

- Senna's Absolution

- Shaco's Deceive when used to Backstab

- Yasuo's Way of the Wanderer

- Yone's Way of the Hunter

### Items

- Fiendhunter Bolts

- Infinity Edge

- Sundered Sky

## Guaranteed critical strikes

Some game elements can critically strike with no dependence on **critical strike chance**.

### Champion abilities

- Ashe's Volley

- Fiora's Bladework's second attack

- Jhin's Whisper's fourth attack and Curtain Call's fourth shot

- Miss Fortune's Double Up after killing the first target hit

- Shaco's Deceive when used to Backstab

- Talon's Noxian Diplomacy when used in melee range

- Zeri's Ultrashock Laser when it collides with terrain

### Items

- Fiendhunter Bolts

- Shadowflame against enemies below a health threshold

- Sundered Sky

## Game elements that can critically strike

### Champion abilities

**Basic attack modifiers**

Many abilities in the game wrap themselves with the main basic attack, enhancing it to cause them to deal increased damage. Since these are basic attacks, they can critically strike, with a few exceptions (see below), however, the ability's damage itself will only be amplified by a critical strike for the following abilities:

- Akshan's Dirty Fighting

- Aphelios' Infernum

- Blitzcrank's Power Fist

- Darius' Crippling Strike

- Graves' New Destiny

- Jayce's Hyper Charge

- Jinx's Switcheroo!

- Lucian's Lightslinger

- Master Yi's Double Strike

- Nasus' Siphoning Strike (only the base and flat **bonus** damage)

- Nocturne's Umbra Blades

- Pantheon's Empowered Shield Vault basic attacks

- Rek'Sai's Queen's Wrath (only to primary target)

- Samira's Daredevil Impulse

- Shaco's Backstab and Deceive with Backstab

- Shyvana's Emberstrike

- Sylas' Petricite Burst

- Viego's Blade of the Ruined King

- Xin Zhao's Three Talon Strike

**Modified damage**

The following enhanced basic attacks are wrapped with the main basic attack but are unaffected by critical damage modifiers, except the main basic attack portion which can still critically strike for bonus damage in addition to the modified damage.

However, effects that modify the total critical strike damage (e.g Randuin's Omen) will still modify the ability's damage:

- Caitlyn's Headshot

- Dr. Mundo's Blunt Force Trauma

- Draven's Spinning Axe

- Galio's Colossal Smash

- Garen's Decisive Strike

- Hecarim's Devastating Charge

- Jhin's Whisper

- K'Sante's Dauntless Instinct *All Out* **bonus**

- Nasus' Siphoning Strike (only the **bonus** from stacks is unaffected by critical modifiers)

- Nautilus' Staggering Blow

- Nidalee's Takedown

- Quinn's Harrier

- Renekton's Ruthless Predator

- Sett's Pit Grit and Knuckle Down

- Trundle's Chomp

- Vi's Relentless Force

- Viktor's Discharge *

- Volibear's Thundering Smash

- Yorick's Last Rites

- Zaahen's The Darkin Glaive

**Critically striking abilities**

The following abilities are special cased to be able to critically strike:

- Akshan's Heroic Swing

- Aphelios' Onslaught, Duskwave, Crescendum, Sentry and Moonlight Vigil

- Bel'Veth's Void Surge and Royal Maelstrom

- Briar's Blood Frenzy

- Gangplank's Parrrley and Powder Keg

- Garen's Judgment

- Kayle's Fire Waves and Starfire Spellblade (while Aflame)

- Master Yi's Alpha Strike

- Miss Fortune's Double Up and Bullet Time

- Riven's Runic Blade

- Samira's Flair and Inferno Trigger

- Sivir's Ricochet

- Twitch's Spray and Pray

- Xayah's Clean Cuts

- Yasuo's Steel Tempest

- Yone's Mortal Steel

- Yunara's Cultivation of Spirit spread and on-hit ^(note)

- Zeri's Burst Fire and Lightning Crash's physical damage chain

### Items

The following item's damage will critically strike if the triggering basic attack does:

- Runaan's Hurricane

## Basic attacks that cannot critically strike

- Camille's Precision Protocol - both enhanced attacks cannot critically strike.

- Fiora's Bladework - the first attack cannot critically strike.

- Shyvana's Emberstrike - third cast's attack cannot critically strike.

- Twisted Fate's Pick a Card - enhanced attack cannot critically strike.

- Zac's Stretching Strikes - enhanced attack cannot critically strike.

- Zeri's Living Battery - cannot critically strike.

## Critically striking against structures

*Critical strikes do not affect structures, with the following exceptions:*

- Fiora's Bladework - second attack will also critically strike turrets.

- Jhin's Whisper - the fourth attack will also critically strike turrets.

- Master Yi's Double Strike - the additional attack can critically strike turrets.^(bug)

## Interacting with critical strikes

- Aphelios' Infernum sprays 6 missiles in a wider cone when critically striking enemies and Crescendum has a reduced wind up percentage when critically striking enemies.

- Graves' New Destiny sprays 6 pellets in a wider cone when critically striking enemies.

- Jhin's Whisper grants him movement speed when critically striking enemies.

- Kennen's Lightning Rush's attack speed duration is extended when critically striking enemies.

- Tryndamere's Spinning Slash reduces its  cooldown when critically striking enemies.

- Yasuo's Last Breath grants all critical strikes  armor penetration against  **bonus** armor.

- Yunara's Vow of the First Lands causes critical strikes to deal increased damage (without modifying critical strike damage).

- Zeri's Spark Surge reduces its  cooldown by an increased amount when Burst Fire critically strikes enemies and Lightning Crash will grant extra stacks when Burst Fire or Ultrashock Laser critically strikes enemies.

- Fiendhunter Bolts' Opening Barrage deals bonus damage if its empowered attacks would have already critically struck based on the user's critical strike chance.

- Randuin's Omen's Resilience reduces the damage dealt by incoming critical strikes from enemies.

## Trivia

- From its inception, critical strikes did 200% damage before being changed to 175% in V10.23. It would later be reverted to 200% again in V26.01.

- In many MMO settings, a number of attack damage-based assassins or secondary assassin-based champions also benefit from high critical strike chance in varying forms, as a means to help finish off targets faster as well as to deal more damage in bursts overall.

- Most champions have special basic attack animations that play when they critically strike, even champions who may not usually opt into critical strike chance.

- A few champions that typically itemize critical strike chance may have quotes that play when they critically strike.

- Some champions may actually use their critical strike animation for an empowered basic attack, when consuming a single-use on-hit effect *(this is entirely cosmetic by itself and does not represent an actual critical strike)*.

- At negative attack damage, critical strikes from basic attacks are also multiplied by the same amount (e.g.  − 50 AD →  − 100 critical physical damage).

**Champion statistics**

 League of Legends content

Basic attack

The **basic attack** (or "auto") is the default means by which a unit deals damage, usually equaling  100% AD physical damage. **Basic attacks** are normally unit-targeted edge range spells, and the  attack range stat determines their reach.

The caster must stand still to complete a brief *windup* before launching a **basic attack**. Depending on the caster:

- If a caster's attacks are non-projectile (e.g. melee) launching the attack deals damage immediately.

- If a caster's attacks are projectile, launching the attack sends a projectile that follows the target and deals damage upon striking them.

The caster then incurs a brief cooldown, based on their  attack speed. Basic attacks' damage may trigger on-hit effects only upon dealing damage. On-attack effects will always trigger upon the attack's *windup* completing.

 League of Legends content

| Bladework | COOLDOWN: 11 / 10 / 9 / 8 / 7 |
| --- | --- |

| **Active:** Fiora gains  **bonus** range and  **bonus** attack speed for the next two attacks. |
| --- |
| The first attack slows the target, and the second attack will critically strike. |

 League of Legends content

| Whisper |   |
| --- | --- |

| **Innate - Death in 4 Acts:** Jhin's gun may fire up to 4 times before needing to reload for a short period. The final round will critically strike, dealing **bonus** physical damage based on the target's **missing** health. |
| --- |
| **Innate - Every Moment Matters:** **Jhin** gains  **bonus** attack damage, increased by his  critical strike chance and  **bonus** attack speed. Whenever he critically strikes, he gains a burst of  movement speed based on his  **bonus** attack speed. |
| **Jhin's**  attack speed cannot increase except by  leveling up, and he deals reduced critical strike damage. |

 League of Legends content

| Double Strike |   |
| --- | --- |

| **Innate:** Master Yi's basic attacks generate a stack of *Double Strike* for a few seconds. At 3 stacks, his next basic attack will consume them all to strike a second time for reduced physical damage. |
| --- |

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

| Absolution | TARGET IMMUNITY: 6 / 5 / 4 (based on level) |
| --- | --- |

| **Innate - Weakened Soul**: Senna's basic attacks on-hit and abilities against enemy champions apply a stack of *Mist* for a few seconds. Subsequent hits collect the *Mist*, dealing **bonus** physical damage based on the target's **current** health and rendering the target immune to further *Mist* applications for a few seconds. |
| --- |
| Enemies that die near **Senna** may spawn a *Mist Wrath* from their corpse, which lasts for a period. She can kill *Mist Wraiths* to gain gold and *Mist* stacks. |
| **Innate - Relic Cannon**: **Senna's** basic attacks deal **bonus** physical damage and briefly grant her  **bonus** movement speed based on the target's movement speed. |
| **Mist**: For each stack, **Senna** gains  **bonus** attack damage. For every few stacks, she also gains  **bonus** attack range and  critical strike chance, or  life steal if she has max critical strike chance. |

 League of Legends content

| Battle Fury |   |
| --- | --- |

| **Innate:** Tryndamere generates Fury on his basic attacks, critical strikes, and enemy kills. His Fury begins to decay after a period without dealing or taking damage. |
| --- |
| **Tryndamere** gains  critical strike chance based on his Fury. |

 League of Legends content

| Way of the Wanderer |   |
| --- | --- |

| **Innate - Intent:** Yasuo gains increased  critical strike chance. He also gains  attack damage from excess  critical strike chance. However, his critical strikes deal reduced damage. |
| --- |
| **Innate - Resolve:** **Yasuo's** movement generates the Flow resource. He gains a brief shield when taking damage from a champion or monster at maximum **Flow**, consuming all of it. |

 League of Legends content

| Way of the Hunter |   |
| --- | --- |

| **Innate - Intent:** Yone gains increased  critical strike chance. He also gains  attack damage from excess  critical strike chance. However, his critical strikes deal reduced damage. |
| --- |
| **Innate - Steel and Spirit:** **Yone's** basic attacks alternate between his Steel Sword and Azakana Sword. His Azakana Sword deals equal parts physical and magic damage. |

 League of Legends content

| Comeuppance | COOLDOWN: 100 / 85 / 70 |
| --- | --- |

| **Active:** Akshan locks onto the target enemy champion and begins channeling power into his gun to store bullets, revealing them as well as revealing himself. *Comeuppance* will recast after the channel, or can recast early. |
| --- |
| **Recast:** Akshan fires the stored bullets at the target, each dealing physical damage to the first enemy hit, increased by their **missing** health. |
| **Akshan** can move normally and cast * Heroic Swing* while channeling and firing *Comeuppance*. |
| *Comeuppance* applies  life steal and can hit turrets. |

 League of Legends content

| Frost Shot |   |
| --- | --- |

| **Innate:** Ashe's basic attacks deal increased damage based on her critical strike chance and critical strike damage. |
| --- |
| **Innate - Frost Shot:** Ashe's basic attacks apply a slow on-hit. |
| **Innate - Critical Slow:** Ashe's critical strikes deal no bonus damage but apply an empowered slow. |

 League of Legends content

| Headshot |   |
| --- | --- |

| **Innate:** Caitlyn's basic attacks generate stacks of *Count* on-attack. At maximum stacks, her next basic attack will fire a *Headshot* dealing **bonus** physical damage that scales with her  critical strike chance. |
| --- |
| On trapped or netted targets, she gains another *Headshot* at extra  attack range. |

 League of Legends content

| Ace in the Hole | COOLDOWN: 90 |
| --- | --- |

| **Active:** Caitlyn targets an enemy champion and takes time to line up the perfect shot, dealing massive physical damage to them at a huge range. |
| --- |
| The target's allied champions can intercept the shot for them. |

 League of Legends content

| Missile Barrage | RECHARGE: 20 |
| --- | --- |

| **Active:** Corki fires a missile in the target direction that explodes upon the first enemy hit, dealing physical damage to enemies in an area. |
| --- |
| **Corki** stores missiles over time, and starts with maximum missiles when he respawns. |
| Every 3rd missile fired is a *Big One*: which fires farther and deals increased damage in a bigger explosion. |

 League of Legends content

| Mounting Dread | COOLDOWN: 14 / 12.5 / 11 / 9.5 / 8 |
| --- | --- |

| **Active:** Lamb fires a shot at the target enemy that briefly slows them and applies a stack of *Mounting Dread*. **Lamb's** basic attacks against this target stack *Mounting Dread* up to a cap. |
| --- |
| Applying maximum stacks consumes them all, causing Wolf to pounce on the target and deal physical damage based on both **Kindred's**  critical strike chance and the target's **missing** health. |

 League of Legends content

| The Culling | COOLDOWN: 110 / 100 / 90 |
| --- | --- |

| **Active:** Lucian channels for a few seconds to rapidly fire a torrent of bullets in the target direction. Each shot deals physical damage to the first enemy hit. *The Culling* can be recast within the duration. |
| --- |
| While channeling, **Lucian** is ghosted and may still move. |
| **Recast:** **Lucian** ends *The Culling*. |

 League of Legends content

| Formless Blade | COOLDOWN: 4 |
| --- | --- |

| **Passive:** Nilah gains  armor penetration based on her  critical strike chance. Also, her basic attacks and *Formless Blade* against champions heal her based on her  critical strike chance; overhealing becomes a shield that lasts a few seconds. |
| --- |
| **Active:** **Nilah** cracks her whip-blade in a line, dealing physical damage to enemies hit, increased based on her  critical chance. Casting *Formless Blade* during * Slipstream* leaves a wave behind instead that deals the same damage to enemies it passes through. |
| If *Formless Blade* hits an enemy, **Nilah** becomes empowered for a short time: gaining  attack range,  attack speed, and causing her attacks to strike in a cone. |

 League of Legends content

| Apotheosis | COOLDOWN: 110 / 95 / 80 |
| --- | --- |

| **Active:** Nilah whirls her whip-blade for a brief moment, continually dealing physical damage to nearby enemies. She then bursts to deal physical damage and pull in nearby enemies. Each hit will also slow enemies for a short time. |
| --- |
| **Nilah** heals herself and nearby allied champions for a portion of the damage dealt to champions, based on her  critical strike chance, and converting overhealing into shielding that lasts for a moderate amount of time. |
| **Nilah** can move during *Apotheosis*. |

 League of Legends content

| Harrier | STATIC CD: 7 – 2.56 (based on critical strike chance) |
| --- | --- |

| **Innate:** Quinn's damaging abilities mark enemies with *Harrier* and reveal them for a few seconds. Periodically, Valor marks a nearby enemy with *Harrier*. |
| --- |
| **Quinn's** next basic attack against a *Harrier* target consumes the mark to deal **bonus** physical damage. |

 League of Legends content

| Boomerang Blade | COOLDOWN: 10 / 9.5 / 9 / 8.5 / 8 |
| --- | --- |

| **Active:** Sivir hurls her crossblade in the target direction that deals physical damage to enemies hit. |
| --- |
| At max range, it homes back to **Sivir** to deal physical damage to enemies hit. |

 League of Legends content

| Dragon Practice |   |
| --- | --- |

| **Innate:** Smolder generates a stack of *Dragon Practice* from damaging champions with abilities, or when * Super Scorcher Breath* kills minions and monsters. His basic abilities deal **bonus** magic damage based on stacks. |
| --- |

 League of Legends content

| Super Scorcher Breath | COOLDOWN: 5.5 / 5 / 4.5 / 4 / 3.5 |
| --- | --- |

| **Active:** Smolder spits a fireball that deals physical damage to the target enemy. |
| --- |
| *Super Scorcher Breath* becomes empowered with new effects based * Dragon Practice stacks*: **25 stacks:** The fireball explodes upon collision to deal physical damage to nearby enemies. **125 stacks:** The fireball sends forth bolts of fire that deal physical damage to enemies hit. The number of bolts increases based on stacks. **225 stacks:** Enemies hit will burn for true damage based on their **maximum** health over a short time. Enemy champions are also executed at low health based on stacks. |
| *Super Scorcher Breath* applies  life steal and on-hit and on-attack effects. |

 League of Legends content

| Explosive Charge | COOLDOWN: 16 / 15.5 / 15 / 14.5 / 14 |
| --- | --- |

| **Passive:** Enemies explode when killed by Tristana's basic attacks, dealing magic damage to nearby enemies. |
| --- |
| **Active:** **Tristana** tosses an explosive charge that attaches to the target enemy for a few seconds. The charge then explodes to deal physical damage to nearby enemies, increased based on  critical strike chance. |
| **Tristana's** basic attacks and abilities against the target will increase the charge's damage. Upon reaching the cap, the charge explodes instantly. |
| The charge can target and damage turrets and explodes farther on a turret. |

 League of Legends content

| Pick a Card | COOLDOWN: 6 |
| --- | --- |

| **Active:** Twisted Fate cycles through three cards over the next few seconds. *Pick a Card* can be recast within the duration, which selects the current card hovered. |
| --- |
| **Recast:** **Twisted Fate's** next basic attack becomes empowered to deal magic damage and apply an additional effect based on the card selected. **Blue Card Bonus:** Deals significantly increased magic damage and restores  mana. **Red Card Bonus:** Deals increased magic damage to the target and surrounding enemies, slowing them for a short time. **Gold Card Bonus:** Deals magic damage and briefly stuns the target. |

 League of Legends content

| Blade of the Ruined King | COOLDOWN: 5 / 4.5 / 4 / 3.5 / 3 |
| --- | --- |

| **Passive:** Viego's basic attacks deal **bonus** physical damage based on the target's **current** health. Additionally, **Viego's** damaging abilities apply a mark to enemies hit. His next basic attack will consume the mark to strike twice, dealing additional **modified** physical damage and healing him. |
| --- |
| **Active:** **Viego** stabs in a line in the target direction, dealing physical damage to enemies hit, increased based on his  critical strike chance. |
| *Blade of the Ruined King's* passive remains under * Possession*. |

 League of Legends content

| Heartbreaker | COOLDOWN: 120 / 100 / 80 |
| --- | --- |

| **Active:** Viego blinks with displacement immunity to the target location, dealing physical damage based on his  critical strike chance to all nearby enemies upon arrival. |
| --- |
| The most wounded enemy champion hit takes **bonus** physical damage based on their **missing** health, is dealt on-hit effects, and is slowed briefly. Other enemies hit are knocked back. |
| ** displacement immunity:** The blink cannot be deterred by crowd control. |

 League of Legends content

| Bladecaller | COOLDOWN: 12 / 11 / 10 / 9 / 8 |
| --- | --- |

| **Active:** Xayah recalls all Feathers to shoot back to her, each dealing physical damage to enemies hit based on her  critical strike chance. |
| --- |
| An enemy hit by at least three Feathers is briefly rooted. |

 League of Legends content

| Wind Becomes Lightning | COOLDOWN: 12 / 11 / 10 / 9 / 8 |
| --- | --- |

| **Active:** Xin Zhao slashes in an arc, then thrusts his spear in a line in the target direction. Each strike deals physical damage to enemies hit and heals **Xin Zhao** based on his  life steal. |
| --- |
| The thrust deals increased damage based on  critical strike chance and briefly slows enemies hit, enemy champions or monsters hit are also revealed and marked Challenged for a short time. |

 League of Legends content

| Prowling Projectile | COOLDOWN: 6.5 |
| --- | --- |

| **Active:** Yuumi fires an errant missile in the target direction that deals magic damage to the first enemy hit and briefly slows the target if they were a champion. |
| --- |
| ** Attached Bonus:** **Yuumi** channels briefly to steer the missile, after which it accelerates to deal increased damage and apply a stronger slow to champions. ** Best Friend Bonus:** Always applies the stronger slow and grants her *Best Friend* bonus on-hit damage for a few seconds. |

 League of Legends content

| Spark Surge | COOLDOWN: 24 / 22.5 / 21 / 19.5 / 18 |
| --- | --- |

| **Active:** Zeri dashes in the target direction, she will dash across any terrain she hits. Afterwards, she gains *Lightning Rounds* for a short time. |
| --- |
| *Spark Surge's* cooldown is  reduced if **Zeri** hits an enemy with a * charged* basic attack or * Burst Fire*. * Burst Fire* reduces the cooldown even more if it critically strikes. |
| **Lightning Rounds:** * Burst Fire* deals **bonus** magic damage to the first enemy hit and will pierce through enemies to deal modified damage. |

 League of Legends content

| Deceive | COOLDOWN: 13 / 12.5 / 12 / 11.5 / 11 |
| --- | --- |

| **Active:** Shaco becomes invisible for a short time and blinks to the target location. |
| --- |
| After breaking the invisibility, his next basic attack within a brief moment will deal **bonus** physical damage. |
| ** Backstab Bonus:** The attack will critically strike. |

 League of Legends content

| Backstab |   |
| --- | --- |

| **Innate:** Shaco's basic attacks deal **bonus** physical damage when hitting an enemy from behind. |
| --- |
| * Deceive* and * Two-Shiv Poison* have additional effects when they hit an enemy from behind. |

 League of Legends content

| Volley | COOLDOWN: 18 / 14.5 / 11 / 7.5 / 4 |
| --- | --- |

| **Active:** Ashe fires arrows in a cone dealing physical damage and applying Critical Slow to the first enemies hit. |
| --- |

 League of Legends content

| Curtain Call | COOLDOWN: 120 / 105 / 90 |
| --- | --- |

| **Active:** Jhin channels up to a period, being able to fire up to four shots in a large cone in front of him. |
| --- |
| **Recast:** **Jhin** fires a round in the target direction that deals physical damage to enemies hit based on their **missing** health. It stops upon hitting an enemy champion, slowing and revealing them for a short time. |
| The fourth shot critically strikes for **bonus** physical damage. |
| *Curtain Call* plays music globally when first activated and its range is always visible. |

 League of Legends content

| Curtain Call | COOLDOWN: 120 / 105 / 90 |
| --- | --- |

| **Active:** Jhin channels up to a period, being able to fire up to four shots in a large cone in front of him. |
| --- |
| **Recast:** **Jhin** fires a round in the target direction that deals physical damage to enemies hit based on their **missing** health. It stops upon hitting an enemy champion, slowing and revealing them for a short time. |
| The fourth shot critically strikes for **bonus** physical damage. |
| *Curtain Call* plays music globally when first activated and its range is always visible. |

 League of Legends content

| Double Up | COOLDOWN: 7 / 6 / 5 / 4 / 3 |
| --- | --- |

| **Active:** Miss Fortune fires a shot at the target enemy that deals physical damage, which then bounces to hit another enemy behind them. This applies on-hit effects to both enemies hit. |
| --- |
| *Double Up's* bounce can critically strike, and does so if *Double Up* kills the primary target. |

 League of Legends content

| Noxian Diplomacy | COOLDOWN: 8 / 7.5 / 7 / 6.5 / 6 |
| --- | --- |

| **Active:** Talon leaps to the target enemy, dealing physical damage. If the target is within melee range, **Talon** will critically strike the target. |
| --- |
| If *Noxian Diplomacy* kills the target, **Talon** heals and  reduces its cooldown. |

 League of Legends content

| Ultrashock Laser | COOLDOWN: 12 / 11 / 10 / 9 / 8 |
| --- | --- |

| **Active:** Zeri fires an electric pulse in the target direction that deals physical damage to the first enemy hit and slows them for a short duration. |
| --- |
| If this hits terrain, it transforms into a laser that fires in a line, dealing physical damage to enemies hit and critically striking against champions and monsters. |

 League of Legends content

| Dirty Fighting |   |
| --- | --- |

| **Innate:** Akshan's basic attack causes him to fire a second attack that deals **reduced** physical damage. If **Akshan** cancels the second attack, he gains a brief burst of  move speed, increased based on his  attack speed. |
| --- |
| **Innate:** **Akshan's** attacks and abilities apply a stack to enemies hit. The third stack consumes them all to deal **bonus** magic damage; if the target was a champion, he also gains a brief shield. |

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
