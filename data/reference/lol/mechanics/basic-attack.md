Source: https://wiki.leagueoflegends.com/en-us/Basic_attack

> LoL wiki page "Basic attack" (revision 4072132), rendered HTML converted to Markdown by tools/extract/lol/mechanics.ts. Content © League of Legends Wiki contributors, CC BY-SA 3.0. Reference material for private research only.

# Basic attack

A **basic attack** (also called a **standard**, **normal**, or **auto attack**) is the default means by which a unit deals damage to an enemy unit, normally equal to  100% of the attacker's AD physical damage. Turrets, minions, and most monsters perform **basic attacks** as their only method of dealing damage. The player orders their champion to perform a basic attack by issuing an attack command on an enemy (default: Right Mouse Button right-click / MB2), or when the "attack-move" command is used (default: **A**). Non-player units automatically chase and attack targets based on individual priority systems; by default, idle champions may automatically chase and attack targets that venture too close to them too.

Innately, **basic attacks** apply on-hit effects, and may critically strike via  critical strike chance for increased damage. They can also be *empowered* via champion and item abilities to grant them additional effects (e.g. most commonly bonus damage); *empowered* attacks are issued and function similarly to basic attacks otherwise.

The time it takes for attacks to fire is reduced by attack speed and reset by basic attack resets.

## Acquisition

In order for an attacker to initiate an attack, they must first **acquire** a target. Acquisition occurs when an attacker is ordered to attack a valid target, as a result of an attack command, automatic target acquisition, or the forced action effects taunt or berserk. The attacker will attempt to attack the unit if it is within their  attack range, or attempt to move toward it until their attack range meets its gameplay radius, and then stop moving and attempt to attack the target. Acquisition of the target will continue until the attacker is given a new target, attacking is canceled by any means, or the target becomes invalid (e.g. they die or become untargetable).

### Auto-attacking

By default, when champions are idle they automatically acquire the nearest enemy unit within their acquisition range as their target. This feature is called *automatic target acquisition* or simply *auto-attacking* and can be toggled from the Settings > 'Game' tab.

Auto-attacking can be temporarily disabled by holding down the "hold position" key (default **J**), or by issuing a stop command (default **S**), which stops all orders including auto-attacking until a new order is manually provided by the player.

### Attack-move

Attack-move commands allow a champion to move toward a given destination location while scanning for a valid hostile within acquisition range. Attack-move has two modes:

- When using regular attack-move (default **A**), the player's  attack range indicator becomes visible and they may select either a location or a target by left-clicking. Selecting a location scans to acquire the nearest target to the *champion's position*. Selecting a target directly acquires it without scanning, like a normal attack order.

- When using attack-move click (default **Shift + Right Click**), the champion performs the above, but without the player having to select separately. The position of the player's cursor when issuing the command is assumed to be the selection position. The range indicator is not visible when using attack-move click.

The "Attack move on cursor" option changes the targeting behavior of attack-move commands. It can be toggled from the Settings > 'Game' tab.

- If this option is enabled: the champion may also scan to acquire the nearest target in a circle around the *cursor's position* within or near attack range.

- If this option is disabled, or a target cannot be found using the cursor's position within or near attack range: attack-move commands use the default behavior of the *champion's position*.

## Behavior

### General

A basic attack cannot be avoided under normal circumstances once the attacker has begun their attack; it also cannot lose its target and it may hit them despite any subsequent changes in position. The following are exceptions to this rule and will cause basic attacks to fail:

- Parrying effects, which negate the attack's effects entirely:

  - Dodge

  - Block

  - Blind

- Attacking becomes disabled, rendering basic attacks unable to be declared. This includes (this lists those that have the capability to do so):

  - Crowd control (specifically disarming crowd control)

  - Channeling

  - Lockout, including cast time

- The attack's windup is interrupted, if the:

  - Attacker is issued a different command

  - Attacker or the target dies

  - Target becomes untargetable

  - Target moves too far away

  - Target is no longer in sight

Certain basic attacks can be physically dodged (by using mobility spells or quickly moving out of the way) as they do not follow their target after being fired, though they travel fast enough that they are unlikely to be dodged. These are: Graves' New Destiny and Twitch's Spray and Pray.

### Champion

When a champion loses sight of an acquired target while pathing to them, they will continue moving toward the last location the target was visible in. If the movement order has not completed and the target re-enters sight, the champion will be ordered to path to the target's location again and attack them. The target's new location after re-gaining sight of them may be the same as when the attacker lost sight or a different one.

When a champion is ordered to attack a valid *moving* target and acquisition of them continues without manual input from the player, delays in pathing and attacking may emerge. These delays are caused by checks for a potential target, which may be especially evident when the target moves within or out of attack range in a short amount of time. The champion may also not perfectly stop to attack the target ***at*** attack range, but may finish their movement at a slightly closer distance before attacking.

> Due to this behavior, manual cycling of issued movement and attack commands is faster and more precise than automatic orders (*also see: "kiting"*).

Many champions have abilities that will affect their basic attacks in some way or form. Such abilities may be treated like basic attacks and/or abilities, meaning trigger on-hit effects and/or ability effects.

There exists a grace period of one game-tick (0.033 seconds) before a champion's attack windup completes, during which the attack becomes *inherently* uncancellable by the player through movement commands and/or the hold or stop commands. This is a strictly unchanging implementation: at incredibly high attack speeds, it may cause any given attack windup to be uncancellable for its entirety, since it would last less than or equal to this grace period. After firing the attack, another grace period of one game-tick locks the player out of inputting new commands.

### Minions

> *Main article: MinionMinions will automatically attack their closest target by default, but may change targets in a similar manner to turrets.*

### Monsters

The majority of monsters only use basic attacks that deal physical damage, the exceptions are:

- Baron Nashor who has multiple unique attacks and also casts abilities.

- Rift Herald who also casts abilities.

- Gromp whose basic attacks deal magic damage.

- Rift Scuttler which does not attack at all.

### Turrets

> *Main article: Turret*

Turrets have armor penetration, and when hitting a champion, they additionally deal more damage to any champion for each consecutive attack, up to a cap.

The behavior of turrets as well as their basic attacks' damage are described on the corresponding page.

The only exception to the above is the Nexus Obelisk (also called the *Fountain Laser*) that deals a special type of true damage which ignores all kinds of damage reduction, untargetability and damage immunity effects and its attack does not have a missile travel speed.

### Structures

Structures can normally only be damaged by basic attacks. However, some abilities that function like basic attacks (e.g. Fiora's Lunge, Senna's Piercing Darkness, etc.) and certain effects such as Tristana's Explosive Charge and Ziggs' Satchel Charge are special-cased to be able to target and deal damage to turrets.

### Vision

Basic attacking while hiding in brush or in Fog of War will reveal a 300-unit radius centered at the attacker for 2 seconds after the attack completes.

## Damage

Basic attacks always deal physical damage, with some exceptions.

The following will modify the attack's total damage to magic damage:

- Galio's Colossal Smash

- Nidalee's Takedown

- Sylas' Petricite Burst

- Twisted Fate's Pick a Card

- Viktor's Discharge

- Zac's Stretching Strikes

- Zeri's Living Battery

Finally, Yone's Way of the Hunter can modify the attack's total damage to part physical and part magic damage, and Camille's Empowered Precision Protocol will modify the attack's total damage to part physical and part true damage.

Barring the exceptions above, certain items, buffs, and abilities may cause the attacker to deal additional damage of any subtype on top of their base physical damage. The physical damage dealt by basic attacks benefits from the attacker's  attack damage stat and is reduced by the target's  armor.

When basic attacking a turret, champion attacks deal 100% AD (+ 60% AP):

- Physical damage, if 100% **bonus** AD > 60% AP

- Magic damage, if 100% **bonus** AD < 60% AP

## Attack speed

> *Main article: Attack speed*

> *See also: List of champions/Basic attacks and List of champions/Attack speed*

The rate at which a champion attacks is called  attack speed and is by default capped at 3.003 attacks per second, though certain abilities and runes can modify this value.

## Attack reset

The cast of certain abilities and item actives will **(forcibly) reset** the attack timer to zero. Depending on the phase of the attack that the player casts them in, this effect may be detrimental or beneficial to them:

- Resetting the attack timer during the windup means that the current attack is canceled, thus delaying the windup and launch of the next attack.

- Resetting the attack timer during the cooldown means that the remaining cooldown is negated, thus allowing a new windup to begin faster than normal.

Hail of Blades generates an additional stack from the casts of abilities and spells with the Trait_AttackReset spell tag.

The following spells will reset the basic attack timer after use, and have the Trait_AttackReset tag, thus being eligible to refresh Hail of Blades:

- Aatrox's Umbral Dash

- Ashe's Ranger's Focus

- Bel'Veth's Void Surge

- Blitzcrank's Power Fist

- Briar's Head Rush, Blood Frenzy, and Snack Attack

- Camille's Precision Protocol

- Cho'Gath's Vorpal Spikes

- Darius' Crippling Strike

- Dr. Mundo's Blunt Force Trauma

- Ekko's Phase Dive *

- Elise's Skittering Frenzy

- Fiora's Bladework

- Fizz's Seastone Trident

- Garen's Decisive Strike

- Graves' Quickdraw

- Gwen's Skip 'n Slash

- Hecarim's Devastating Charge

- Illaoi's Harsh Lesson

- Jax's Empower

- Jayce's Hyper Charge

- Kai'Sa's Killer Instinct

- Kassadin's Nether Blade

- Katarina's Shunpo

- Kayle's Starfire Spellblade

- Kindred's Dance of Arrows *

- K'Sante's Ntofo Strikes

- Leona's Shield of Daybreak *

- Lucian's Relentless Pursuit *

- Malphite's Thunderclap

- Maokai's Sap Magic

- Master Yi's Meditate

- Nasus' Siphoning Strike

- Nautilus' Titan's Wrath

- Nidalee's Takedown

- Nilah's Slipstream

- Olaf's Tough It Out

- Pantheon's Empowered Shield Vault *

- Quinn's Vault

- Rek'Sai's Queen's Wrath

- Rell's Ferromancy: Mount Up

- Renekton's Ruthless Predator

- Rengar's Savagery

- Riven's Broken Wings

- Samira's Daredevil Impulse

- Sejuani's Permafrost *

- Sett's Knuckle Down

- Shyvana's Emberstrike *

- Sivir's Ricochet

- Skarner's Shattered Earth

- Sona's Power Chord

- Talon's Noxian Diplomacy

- Trundle's Chomp

- Twisted Fate's Pick a Card's recast

- Vayne's Tumble *

- Vi's Relentless Force

- Viego's Spectral Maw *

- Volibear's Thundering Smash *

- Wukong's Crushing Blow

- Xin Zhao's Three Talon Strike

- Yorick's Last Rites

- Yunara's Cultivation of Spirit

- Zaahen's The Darkin Glaive

- Zac's Stretching Strikes

- Zeri's Spark Surge *

- Zoe's Portal Jump

- Titanic Hydra's Titanic Crescent

### Notes

- The special attacks from Leona's Shield of Daybreak, Shyvana's Emberstrike, and Volibear's Thundering Smash reset the caster's attack timer **and** do not place the user's attack timer on cooldown after casting them. This results in multiple attack resets.

  - Shyvana's Emberstrike in particular will only place her attack timer on cooldown from the final cast empowered attack (second/third casts depending on her form).

- Twisted Fate's Pick a Card, Warwick's Primal Howl (recast), and Hextech Rocketbelt's Supersonic all reset the user's attack timer when they are activated, but none of them have the Trait_AttackReset spell tag, causing them to be ineligible to refresh Hail of Blades.^(bug)

- Sett's Facebreaker and Sylas' Kingslayer incorrectly have the Trait_AttackReset spell tag despite them not resetting their caster's basic attack timer. This allows them to unintentionally generate a Hail of Blades stack.^(bug)

- K'Sante's Ntofo Strikes and Rell's Ferromancy: Mount Up both have the Trait_AttackReset spell tag and reset the caster's basic attack timer upon use, but do not properly generate an additional stack of Hail of Blades as expected.^(bug)

  - These abilities were assigned with the Trait_AttackReset tag in V26.09, and were documented as being fixed with **Hail of Blades** in the same patch, but the additional stack generation does not occur for either spell despite both having the tag.

- Certain abilities that involve dashes which grant attack resets may cause the caster to dash for a longer duration than their attack's cooldown. This means the caster may not be able to follow up with another basic attack as quickly, because of the time spent performing the dash. In order to bypass this lockout time, the caster may try to end the dash prematurely, such as dashing into a wall or dashing in place, if the ability permits this behavior. Since less time will be spent dashing, the amount of time they are required to wait is reduced.

## Uncancellable Windup

A basic attack that is not interruptible is classified as having an uncancellable windup. Some effects cause a basic attack to have an **uncancellable windup**. Unlike normal basic attacks and similar to the cast time of a spell, the windup of these attacks cannot be interrupted by neither the user themselves nor any status effect, other than death, polymorph, Quinn's Vault, Hextech Rocketbelt's Supersonic, and in some cases, untargetability and range.

There are several advantages that come from attacks which use an uncancellable windup.

- **The first advantage is these attacks once started cannot be stopped by leaving range.** Inversely they can hit a target even if the attacker repositions out of range through a blink or dash. This advantage is only available to a portion of uncancellable attacks.

- **The second advantage is that these attacks once started cannot be stopped by crowd control.** This does not allow new attacks to be started, but prevents the current attack from being cancelled. This effectively shortens the total time spent crowd controlled similar to using non-channeled spells with long cast times prior to crowd control.

- **The third advantage is that these attacks once started can be overwritten by abilities.** This allows champions such as Camille to cast her other abilities during the uncancellable windup of Precision Protocol's empowered basic attacks. This can only be performed when the overwriting ability has no cast time as any spell with a cast time is locked out until the uncancellable attack is completed

- **The fourth advantage is that these attacks once started can hit targets that become untargetable.** This is similar to the first advantage as they both allow attacking targets that attempt to become an invalid attack target, and attacks with advantage one also typically have this advantage as well.

Below is a list of attacks that have an uncancellable windup:

- Ambessa's Drakehound's Step

- Aphelios' Severum

- Blitzcrank's Power Fist

- Briar's Blood Frenzy

- Caitlyn's Headshot

- Camille's Precision Protocol

- Darius' Crippling Strike

- Dr. Mundo's Blunt Force Trauma

- Fizz's Seastone Trident

- Galio's Colossal Smash

- Garen's Decisive Strike

- Gragas' Drunken Rage

- Illaoi's Harsh Lesson (only within her base  attack range)

- Jax's Empower and Grandmaster-at-Arms

- Jhin's Whisper (fourth shot)

- Kassadin's Nether Blade

- Kayle's Starfire Spellblade

- Leona's Shield of Daybreak

- Maokai's Sap Magic

- Malphite's Thunderclap

- Nasus' Siphoning Strike

- Nidalee's Takedown

- Rek'Sai's Queen's Wrath

- Rengar's Savagery

- Samira's Daredevil Impulse

- Seraphine's Stage Presence

- Skarner's Shattered Earth

- Sona's Power Chord

- Shyvana's Emberstrike

- Sylas' Petricite Burst

- Trundle's Chomp

- Udyr's Blazing Stampede

- Vayne's Tumble

- Vi's Relentless Force

- Volibear's Thundering Smash

- Wukong's Crushing Blow

- Xin Zhao's Three Talon Strike

- Yorick's Last Rites

- Yunara's Cultivation of Spirit

- Yuumi's Feline Friendship

- Zaahen's The Darkin Glaive

### Untargetability interactions

The following table features **uncancellable windups** that will be cancelled by the target becoming untargetable during the windup and those that will complete the windup regardless of the target being targetable or not.

|   | "Time doesn't heal all wounds." | This article or section is outdated. Please update this article to reflect recent events or newly available information.Missing some interactions |
| --- | --- | --- |

| Cancelled by untargetability ^(unexpected) | Not cancelled but no target effect | Not cancelled ^(unexpected) |
| --- | --- | --- |
| Ambessa's Drakehound's Step Aphelios' Severum Caitlyn's Headshot Darius' Crippling Strike Galio's Colossal Smash Jax's Empower Jhin's Whisper Kayle's Starfire Spellblade Maokai's Sap Magic Nidalee's Takedown Rengar's Savagery Seraphine's Stage Presence Shyvana's Emberstrike Sona's Power Chord Udyr's Blazing Stampede Vi's Relentless Force Xin Zhao's Three Talon Strike Yorick's Last Rites Yuumi's Feline Friendship | Gragas' Drunken Rage Illaoi's Harsh Lesson (leap) [1] Kalista's Martial Poise Volibear's Thundering Smash | Blitzcrank's Power Fist [2] Camille's Precision Protocol Dr. Mundo's Blunt Force Trauma Fizz's Seastone Trident Garen's Decisive Strike Illaoi's Harsh Lesson (melee) [3] Kassadin's Nether Blade Nasus' Siphoning Strike Sylas' Petricite Burst Trundle's Chomp Wukong's Crushing Blow |

PENDING FOR TEST: Akali's Assassin's Mark

### Range interactions

The following table features uncancellable windups that will cancel from the target moving too far away during the windup and those that will complete regardless of the target's location.

|   | "Time doesn't heal all wounds." | This article or section is outdated. Please update this article to reflect recent events or newly available information.Missing some interactions |
| --- | --- | --- |

| Cancelled by range ^(unexpected) | Not cancelled |
| --- | --- |
| Akali's Assassin's Mark Ambessa's Drakehound's Step Aphelios' Severum Caitlyn's Headshot Darius' Crippling Strike Galio's Colossal Smash Gragas' Drunken Rage Jax's Empower Jhin's Whisper Kayle's Starfire Spellblade Leona's Zenith Blade Maokai's Sap Magic Nidalee's Takedown Rengar's Savagery Shyvana's Emberstrike Skarner's Shattered Earth Sona's Power Chord Udyr's Blazing Stampede Vi's Relentless Force [4] Xin Zhao's Three Talon Strike Yorick's Last Rites Yuumi's Feline Friendship | Blitzcrank's Power Fist Camille's Precision Protocol Dr. Mundo's Blunt Force Trauma Fizz's Seastone Trident Garen's Decisive Strike Illaoi's Harsh Lesson (both melee and leap) Kalista's Martial Poise Kassadin's Nether Blade Nasus' Siphoning Strike Seraphine's Stage Presence Sylas' Petricite Burst Trundle's Chomp Volibear's Thundering Smash Wukong's Crushing Blow |

## Empowered Basic Attack

*To see the items and runes that deal bonus damage with basic attacks, see attack effects.*

### Modified Damage

The following champion abilities have their basic attack dealing modified damage:

- Akshan's Dirty Fighting

- Aphelios' Infernum

- Ashe's Frost Shot and Ranger's Focus

- Bel'Veth's Royal Maelstrom

- Galio's Colossal Smash

- Graves' New Destiny

- Hecarim's Devastating Charge

- Jayce's Hyper Charge

- Jhin's Whisper (critical strikes)

- Jinx's Fishbones

- K'Sante's Dauntless Instinct

- Kled's Skaarl the Cowardly Lizard (dismounted)

- Lucian's Lightslinger

- Master Yi's Double Strike

- Nidalee's Takedown

- Pantheon's Shield Vault

- Renekton's Ruthless Predator

- Samira's Daredevil Impulse

- Shyvana's Emberstrike

- Sylas' Petricite Burst

- Twisted Fate's Pick a Card

- Vi's Relentless Force

- Viego's Blade of the Ruined King

- Viktor's Discharge

- Zaahen's The Darkin Glaive

- Zac's Stretching Strikes

- Zeri's Living Battery

### Bonus Damage

The following champion abilities will empower their basic attack to deal bonus damage:

- Aatrox's Deathbringer Stance

- Akali's Assassin's Mark

- Akshan's Dirty Fighting

- Alistar's Trample

- Ambessa's Drakehound's Step

- Aphelios' Calibrum and Crescendum

- Bard's Traveler's Call

- Bel'Veth's Endless Banquet

- Blitzcrank's Power Fist and Static Field

- Braum's Concussive Blows

- Briar's Snack Attack

- Caitlyn's Headshot

- Camille's Precision Protocol and The Hextech Ultimatum

- Cho'Gath's Vorpal Spikes

- Corki's Hextech Munitions

- Darius' Crippling Strike

- Dr. Mundo's Blunt Force Trauma

- Diana's Moonsilver Blade

- Draven's Spinning Axe

- Ekko's Z-Drive Resonance, Parallel Convergence, and Phase Dive

- Elise's Spider Queen

- Evelynn's Hate Spike

- Ezreal's Essence Flux

- Fiora's Bladework

- Fizz's Seastone Trident

- Garen's Decisive Strike

- Gnar's Hyper

- Gragas' Drunken Rage

- Gwen's A Thousand Cuts and Skip 'n Slash

- Hwei's Stirring Lights

- Illaoi's Harsh Lesson

- Irelia's Ionian Fervor

- Ivern's Brushmaker

- Janna's Tailwind

- Jarvan IV's Martial Cadence

- Jax's Empower and Grandmaster-at-Arms

- Jayce's Transform Mercury Hammer

- Jhin's Whisper

- Kai'Sa's Second Skin

- Kalista's Sentinel

- Kassadin's Nether Blade

- Kayle's Divine Ascent and Starfire Spellblade

- Kennen's Electrical Surge

- Kha'Zix's Unseen Threat

- Kindred's Mounting Dread

- Kled's Violent Tendencies

- Kog'Maw's Bio-Arcane Barrage

- K'Sante's Dauntless Instinct

- Leona's Sunlight (allies only) and Shield of Daybreak

- Locke's Silver Stake and Ritual Nails

- Lucian's Lightslinger

- Lulu's Pix, Faerie Companion

- Lux's Illumination

- Malphite's Thunderclap

- Master Yi's Wuju Style

- Milio's Fired Up!

- Miss Fortune's Love Tap

- Mordekaiser's Darkness Rise

- Nami's Tidecaller's Blessing

- Nasus' Siphoning Strike

- Nautilus' Staggering Blow and Titan's Wrath

- Neeko's Shapesplitter

- Nocturne's Umbra Blades

- Orianna's Clockwork Winding

- Ornn's Living Forge

- Poppy's Iron Ambassador

- Qiyana's Royal Privilege and Terrashape

- Quinn's Harrier

- Rammus' Spiked Shell

- Rek'Sai's Queen's Wrath

- Rell's Break the Mold, Ferromancy: Mount Up and Full Tilt

- Renata Glasc's Leverage

- Rengar's Savagery

- Riven's Runic Blade

- Rumble's Junkyard Titan

- Samira's Daredevil Impulse

- Sejuani's Fury of the North

- Senna's Absolution

- Sett's Pit Grit's and Knuckle Down

- Seraphine's Stage Presence

- Shaco's Backstab and Deceive

- Shen's Twilight Assault

- Sion's Glory in Death

- Skarner's Shattered Earth

- Sona's Power Chord

- Tahm Kench's An Acquired Taste

- Taric's Bravado

- Teemo's Toxic Shot

- Thresh's Flay

- Trundle's Chomp

- Twisted Fate's Stacked Deck

- Udyr's Wilding Claw and Wingborne Storm

- Urgot's Echoing Flames

- Varus' Blighted Quiver

- Vayne's Tumble and Silver Bolts

- Vex's Doom 'n Gloom

- Vi's Denting Blows

- Viego's Blade of the Ruined King

- Volibear's The Relentless Storm and Thundering Smash

- Warwick's Eternal Hunger

- Wukong's Crushing Blow

- Xayah's Deadly Plumage

- Xin Zhao's Determination and Three Talon Strike

- Yorick's Last Rites and Eulogy of the Isles

- Yuumi's Prowling Projectile ( Best Friend only)

- Yunara's Vow of the First Lands and Cultivation of Spirit

- Zed's Contempt for the Weak

- Ziggs' Short Fuse

- Zoe's More Sparkles!

### Damage over Time

The following champion abilities will empower their basic attack to deal additional damage over time:

- Briar's Crimson Curse

- Darius' Hemorrhage

- Fizz's Seastone Trident

- Gangplank's Trial by Fire

- Milio's Fired Up!

- Nautilus' Titan's Wrath

- Sivir's Ricochet

- Skarner's Threads of Vibration

- Talon's Blade's End

- Teemo's Toxic Shot

- Twitch's Deadly Venom

- Udyr's Wilding Claw

### Others

The following champion abilities may not do additional/modified damage to their target but will empower their basic attacks to give another bonus:

- Amumu's Cursed Touch

- Aphelios' Severum and Gravitum

- Briar's Blood Frenzy

- Camille's Adaptive Defenses

- Gnar's Rage Gene

- Jax's Relentless Assault

- Jayce's Lightning Field and Transform Mercury Cannon

- Jinx's Pow-Pow

- Kalista's Martial Poise and Rend

- Kindred's Wolf's Frenzy

- Kled's Skaarl the Cowardly Lizard (dismounted)

- Lee Sin's Flurry

- Maokai's Sap Magic

- Master Yi's Alpha Strike

- Nilah's Formless Blade

- Nunu & Willump's Call of the Freljord

- Olaf's Reckless Swing and Ragnarok

- Pantheon's Mortal Will

- Rakan's Fey Feathers

- Rammus' Defensive Ball Curl

- Rek'Sai's Fury of the Xer'Sai

- Rell's Break the Mold

- Renekton's Reign of Anger

- Rengar's Unseen Predator

- Sejuani's Permafrost

- Shaco's Two-Shiv Poison

- Sivir's Fleet of Foot and On the Hunt

- Tristana's Explosive Charge

- Tryndamere's Battle Fury and Spinning Slash

- Twitch's Spray and Pray

- Udyr's Bridge Between, Iron Mantle and Blazing Stampede

- Vel'Koz's Organic Deconstruction

- Xayah's Clean Cuts

- Xerath's Mana Surge

- Xin Zhao's Crescent Guard

- Yasuo's Last Breath

- Yuumi's Feline Friendship and You and Me! ( Best Friend) only)

## Trivia

- Each unit that can perform basic attacks has a unique firing and recovery animation for their attack's windup and winddown which represents the physical action of drawing into and away from an attack.

  - A champion's basic attack animation may be modified by skins.

  - Turrets only display their acquired target and the fired attack, for game clarity purposes (also, turrets are thematically stationary).

- Hostile turrets are the only units in the game that visually and unambiguously mark an acquired target, specifically with a line from their crystal apex to their target's center.

- In the initial iteration, the icon used to denote basic attacks is reused from an alpha item with unknown effects called Long Staff.

- "Basic" comes from the fact that "attack" used to refer to any hostile action a champion could perform, with "special attacks" referring to ability-based actions. Effects such as Unbreakable used to refer to "attacks" in their in-game tooltips, which are now distinguished into *basic attacks* and *abilities*. The use of "attack" to refer to anything other than a "basic attack" has generally been discontinued, but affixing 'basic' has nevertheless remained.

## Patch History

**V25.24 - December 4th Hotfix**

- **Bug Fix:** Casting abilities or using item actives with no cast time no longer interrupts attacks.

- Attack hit VFX and SFX now once again prematurely play when an attack is canceled.

**V25.24**

- **Bug Fix:** Attack hit VFX and SFX no longer prematurely play when an attack is canceled.

**V14.1**

- **Undocumented / Bug:** Attack hit VFX and SFX now prematurely play when an attack is canceled.

## References

- ↑ V25.24 attack hotfix

- ↑ Example of attack hit VFX and SFX playing prematurely

**Gameplay Elements**

 League of Legends content

Critical strike

**Critical strike** refers to an effect that deals increased damage under specific circumstances, denoted as  critical strike damage. The most common form of critical strike occurs on basic attacks, which triggers based on  critical strike chance.

By default, a critical strike deals 200% of the normal damage. Critical damage modifiers such as Infinity Edge can increase this percentage.

 League of Legends content

Taunt

A unit that is *taunted* will attempt to perform basic attacks on the **Source** (the **unit** that casted the *Taunt* spell) for the duration, during which they're unable to perform issued movement or attack commands, cast abilities, activate items or use the summoner spells Flash, Teleport, Hexflash, and Mark / Dash. ***Taunt* is an immobilizing effect**. *Forced action effects **cannot** force the unit to perform an action that is disabled.*

| Interrupts: | Interrupts attack windups (excluding uncancellable windups and windups against the **Source**) and all channeled and charged abilities, as well as overrides previous Forced Action effects. |
| --- | --- |
| Reduction: | The **duration** is affected by Tenacity. |
| Resist: | Resisted by crowd control immunity and Dr. Mundo's Goes Where He Pleases. |
| Removal: | Removed by Cleanses or when the **Source** dies. |

Crowd control applied by one's self or an ally cannot be countered in any way, neither *reduced* in duration, *resisted*, nor *removed* unless special cased to do so.

- The crowd control effect may still be cleansed if it is applied as a debuff separate from the originated ability.

 League of Legends content

Berserk

A unit that is *berserk* will attempt to perform basic attacks on a nearby unit for the duration, during which they're unable to perform issued movement or attack commands, cast abilities, activate items or use the summoner spells Flash, Teleport, Hexflash, and Mark / Dash. Any associated effects included with basic attacks can persist beyond the *Berserk* duration. ***Berserk* is an immobilizing effect**. *Forced action effects **cannot** force the unit to perform an action that is disabled.*

Units that are *berserk* search for targets within a 1000 radius of them. Sources of *berserk* have their own targeting priority system, including the *berserked* unit's allies. The target does not need to be visible for the *berserked* unit to attack them.

| Interrupts: | Interrupts attack windups (excluding uncancellable windups and windups against the acquired target) and all channeled and charged abilities, as well as overrides previous Forced Action effects. |
| --- | --- |
| Reduction: | The **duration** is affected by Tenacity. |
| Resist: | Resisted by crowd control immunity and Dr. Mundo's Goes Where He Pleases. |
| Removal: | Removed by Cleanses. |

Crowd control applied by one's self or an ally cannot be countered in any way, neither *reduced* in duration, *resisted*, nor *removed* unless special cased to do so.

- The crowd control effect may still be cleansed if it is applied as a debuff separate from the originated ability.

 League of Legends content

Gameplay radius

A unit's **gameplay radius** is a stat that most closely resembles the concept of a 'hitbox', and is the radius used for edge range effects, which include basic attacks, line collision missiles, rectangular AOEs, and others. The gameplay radius determines the reach of both incoming and outgoing effects: for example, enemies are within a unit's  basic attack range based on the edge of their gameplay radius and vice versa.

 League of Legends content

Death

**Death** occurs when a unit's  health is reduced to zero, thereby being killed. The unit can no longer act and is removed or becomes a corpse.

On player death, they can view the death recap and the shop to purchase items, and some item actives can be used while dead.

 League of Legends content

Untargetable

A unit that is **untargetable** is an invalid target; it can neither be selected nor hit by most effects. Effects that have already been applied are **not** invalidated by the unit becoming untargetable, unless they are special-cased to do so.

Becoming untargetable will interrupt acqusition. This also causes non-champions to lose aggro. Many untargetabilities additionally destroy all incoming unit-targeted projectiles.

 League of Legends content

Acquisition radius

A unit's **acquisition range** is a stat that determines the distance at which they will acquire basic attack targets when a target unit is not specified by the player.

- Auto-attacking *automatically* orders an idle champion to acquire enemies within this range. This can be disabled in the Settings.

- Attack-move commands scan for targets within this range while moving toward a given location.

**Acquisition range** is calculated from the champion's edge to the edge of other units.
Attack range bonuses modify the champion's **acquisition range** by the same amount.

 League of Legends content

Dodge

**Dodging** an instance of damage will *skip* its damage event entirely, preventing it from being taken and effects that trigger from damage. *Dodge* takes precedence over block, but not blind.

Effects that *dodge* damage will only *dodge* instances that are *dodgeable*. Note that these are specified in the ability details on the Wiki.
Basic attacks and abilities that apply on-hit effects are always *dodged*, unless otherwise stated.

*This effect is exclusive to Jax's Counter Strike and Nilah's Jubilant Veil.*

 League of Legends content

Block

**Blocking** an instance of damage will reduce its value to **0**, but does not prevent effects that trigger from damage. Blind and dodge take precedence over *block*.

Effects that *block* damage will only *block* instances that are *blockable*. Note that these are specified in the ability details on the Wiki.
Basic attacks and abilities that apply on-hit effects are always *blocked*, unless otherwise stated.

*This effect is exclusive to Shen's Spirit's Refuge and is similar though mechanically different to Dodge.*

 League of Legends content

Blind

A unit that is *blinded* will *miss* their basic attacks for the duration, comparable to attacking a target that is able to dodge or block, but not mechanically similar. *Missed* basic attacks will fail to deal damage and apply on-hit effects, with the exception of some empowered basic attacks. *Blind* does not prevent the unit from declaring attacks, unlike **Disarm**.

| Interrupts: | Does not interrupt any actions, but will prevent on-hit effects from being triggered by basic attacks. |
| --- | --- |
| Reduction: | The **duration** is affected by Tenacity. |
| Resist: | Resisted by crowd control immunity. |
| Removal: | Removed by Cleanses with the exception of Mikael's Blessing. |

 League of Legends content

Crowd control

A unit that is *disabled* is affected by a status effect that prevents certain actions – such as movement, attacking, casting and/or seeing–blocked, reduced or controlled.

Crowd control applied by one's self or an ally cannot be countered in any way, neither *reduced* in duration, *resisted*, nor *removed* unless special cased to do so.

- The crowd control effect may still be cleansed if it is applied as a debuff separate from the originated ability.

 League of Legends content

Disarming crowd control

A unit that is affected by **disarming crowd control** is unable to use basic attacks and will have their attack windup be interrupted upon affliction. The following crowd control effects disable attacking:

- Airborne

- Charm

- Disarm

- Flee

- Sleep

- Stasis

- Stun ( Suspension)

- Suppression

Note that Berserk and Taunt do not fall under this category because they do not disable attacking altogether; they only inhibit attack commands from being followed.

 League of Legends content

Channel

A **channeled ability** is an ability that can be prevented from reaching its conclusion, by the user themself and / or because of other effects.

A **charged** ability has a channel that is toggled by two activations - the first begins the charging and the second will fire the ability. While using Quick cast, the player must keep the hotkey held down to charge the ability and release to fire. Unlike normal channels, the caster is still able to move freely and cast movement abilities, unless otherwise stated.

A **movement channel** is a type of channel which also involves the caster moving from their position, usually in the form of traversal such as dashes and blinks. This means the crowd control effects ground and root, which both inhibit the activation of movement spells, can interrupt the channel.

The following crowd control effects will interrupt all **channels** (except uninterruptible ones):

- Airborne

- Forced action ( Charm, Flee, Taunt)

- Silence ( Disrupt, Polymorph)

- Sleep

- Stasis

- Stun ( Suspension)

- Suppression

 League of Legends content

Lockout

A champion that is *locked out* is unable to perform certain actions such as casting abilities, moving, or attacking due to currently performing another action that must complete. The prevented actions can vary per instance.

Lockout does not interact with crowd control mechanics unless otherwise stated.

 League of Legends content

Untargetable

A unit that is **untargetable** is an invalid target; it can neither be selected nor hit by most effects. Effects that have already been applied are **not** invalidated by the unit becoming untargetable, unless they are special-cased to do so.

Becoming untargetable will interrupt acqusition. This also causes non-champions to lose aggro. Many untargetabilities additionally destroy all incoming unit-targeted projectiles.

 League of Legends content

Sight

**Sight** is a property of units, structures, certain summoner spells, items, and abilities that represents a team possessing vision of a target area or unit. It is always center range. A line of vision cannot extend beyond terrain or an unrevealed brush.

**Sight** can also refer to an effect that makes a unit visible regardless of the fog of war or brush, allowing them to be targeted. Standard sight cannot see stealthed units, but True Sight can.

- Nearsight is a crowd control debuff that inhibits **sight**; allied vision is lost in addition to a reduced sight radius.

- Obscured vision is similar to **sight** in a way that it can observe units, but does not render units *targetable*, rather it exposes their position and informs of their presence.

- Unobstructed vision is a form of **sight** that allows a unit to be able to see their full vision radius, ignoring any obstructions that would otherwise restrict visibility.

- All effects that use unit-targeting require **sight** of the target. Delayed *unit-targeted* attacks and spells can cancel if **sight** of the selected target is suddenly lost.

 League of Legends content

| New Destiny |   |
| --- | --- |

| **Innate:** Graves' basic attacks consume up to 2 shells before needing to reload. The reload speed is reduced based on his  **bonus** attack speed. |
| --- |
| Each attack fires several pellets in a cone that each collide with the first enemy hit. Hitting a target with multiple pellets will deal increased damage, and non-champion enemies are additionally knocked back. |

 League of Legends content

| Spray and Pray | COOLDOWN: 90 |
| --- | --- |

| **Active:** Twitch gains  **bonus** attack damage and  **bonus** attack range for a few seconds, during which his basic attacks are replaced with bolts that deal the attack's damage to all enemies in a line. |
| --- |

 League of Legends content

Champion

**Champions** are the player-controlled characters in League of Legends. Each champion possesses unique abilities and attributes.

 League of Legends content

Raw damage

The term **raw damage** applies to a rare form of default damage that does not respect death protection and immunity effects on the target at all, such as invulnerability, minimum health threshold and resurrection. Spell shield, if applicable, is the only way to potentially avoid **raw damage** by negating the origin spell's effects entirely (which would include avoiding their damage).

**Raw damage** also does not interact with any effect. In the context of champions, the Nexus Obelisk against them and Zac's Cell Division's redirected damage are the only **raw damage** effects. Various other systems utilize it however, such as Rift Herald's self-damage.

 League of Legends content

| Lunge | COOLDOWN: 13 / 11.25 / 9.5 / 7.75 / 6 |
| --- | --- |

| **Active:** Fiora dashes in the target direction and then stabs a nearby enemy, dealing physical damage and applying on-hit effects. |
| --- |
| If she stabs a target, the cooldown is  reduced. |

 League of Legends content

| Piercing Darkness | COOLDOWN: 15 |
| --- | --- |

| **Active:** Senna fires a spectral laser toward the target unit. **Senna** and allied champions hit are healed. Enemies hit are dealt physical damage, which applies  life steal and on-hit effects, and slowed for a short time. |
| --- |
| *Piercing Darkness'* cooldown is  reduced on-hit. |

 League of Legends content

| Explosive Charge | COOLDOWN: 16 / 15.5 / 15 / 14.5 / 14 |
| --- | --- |

| **Passive:** Enemies explode when killed by Tristana's basic attacks, dealing magic damage to nearby enemies. |
| --- |
| **Active:** **Tristana** tosses an explosive charge that attaches to the target enemy for a few seconds. The charge then explodes to deal physical damage to nearby enemies, increased based on  critical strike chance. |
| **Tristana's** basic attacks and abilities against the target will increase the charge's damage. Upon reaching the cap, the charge explodes instantly. |
| The charge can target and damage turrets and explodes farther on a turret. |

 League of Legends content

| Satchel Charge | COOLDOWN: 20 / 18 / 16 / 14 / 12 |
| --- | --- |

| **Active:** Ziggs hurls a charge to the target location that remains for a few seconds. *Satchel Charge* can be recast within the duration, and does so automatically afterwards. |
| --- |
| **Recast:** The charge explodes to deal magic damage and knock back nearby enemies hit. If this hits **Ziggs**, he will dash farther away. |
| The explosion will execute turrets hit below a certain health. |

 League of Legends content

| Colossal Smash | STATIC CD: 5 |
| --- | --- |

| **Innate:** Every few seconds, Galio's next basic attack is modified to gain  attack speed and deal magic damage in an area, increased based on his  **bonus** magic resist. |
| --- |
| **Galio's** ability hits against enemy champions or epic monsters  reduce *Colossal Smash's*  cooldown. |

 League of Legends content

| Takedown | COOLDOWN: 6 |
| --- | --- |

| **Active:** Nidalee's next basic attack within some time will gain  **bonus** range and deal magic damage based on the target's **missing** health. |
| --- |
| ** Hunted Bonus:** A *Hunted* target hit will take increased damage. |

 League of Legends content

| Petricite Burst |   |
| --- | --- |

| **Innate:** Sylas' ability casts generate stacks of *Unshackled* that stack up to a cap. While he has stacks, he gains tremendous  **bonus** attack speed. |
| --- |
| **Unshackled:** **Sylas'**next basic attack consumes a stack to whirl his chains around him, dealing magic damage to the target and reduced magic damage to nearby enemies. |

 League of Legends content

| Pick a Card | COOLDOWN: 6 |
| --- | --- |

| **Active:** Twisted Fate cycles through three cards over the next few seconds. *Pick a Card* can be recast within the duration, which selects the current card hovered. |
| --- |
| **Recast:** **Twisted Fate's** next basic attack becomes empowered to deal magic damage and apply an additional effect based on the card selected. **Blue Card Bonus:** Deals significantly increased magic damage and restores  mana. **Red Card Bonus:** Deals increased magic damage to the target and surrounding enemies, slowing them for a short time. **Gold Card Bonus:** Deals magic damage and briefly stuns the target. |

 League of Legends content

| Siphon Power | COOLDOWN: 9 / 8 / 7 / 6 / 5 |
| --- | --- |

| **Active:** Viktor throws a draining device at the target enemy that deals magic damage. He also gains *Discharge* and shields himself for a short time. |
| --- |
| ** Discharge:** **Viktor's** next basic attack with a short time will be modified to deal magic damage. |
| ** Augment:** After the device hits, **Viktor** gains  **bonus** movement speed for a short time, and the  shield is increased. |

 League of Legends content

| Stretching Strikes | COOLDOWN: 14 / 12.5 / 11 / 9.5 / 8 |
| --- | --- |

| **Active:** Zac stretches his arm in the target direction that briefly slows and deals magic damage to the first enemy hit based on his **maximum** health. He also forms a revealing tether with the target for a short time, during which his next basic attack is replaced with a second *Stretching Strike*. |
| --- |
| If the two *Stretching Strikes* hit different enemies, **Zac** will fling them together to briefly knock up and stun them, dealing magic damage to all surrounding enemies. |

 League of Legends content

| Living Battery |   |
| --- | --- |

| **Innate:** Zeri generates charge when she moves and casts * Burst Fire*. Her next basic attack will consume charge to deal magic damage. |
| --- |
| At full charge, the attack consumes all charge to deal magic damage based on the target's **maximum** health. |
| **Zeri's** basic attacks apply spell effects as spell damage and trigger on-cast effects, but they do not deal physical damage and **cannot** critically strike nor trigger on-hit and on-attack effects. |

 League of Legends content

| Way of the Hunter |   |
| --- | --- |

| **Innate - Intent:** Yone gains increased  critical strike chance. He also gains  attack damage from excess  critical strike chance. However, his critical strikes deal reduced damage. |
| --- |
| **Innate - Steel and Spirit:** **Yone's** basic attacks alternate between his Steel Sword and Azakana Sword. His Azakana Sword deals equal parts physical and magic damage. |

 League of Legends content

| Precision Protocol | COOLDOWN: 9 / 8 / 7 / 6 / 5 |
| --- | --- |

| **Active:** Camille's next basic attack deals **bonus** physical damage and grants her  **bonus** movement speed. |
| --- |
| *Precision Protocol* can be recast for a short time, dealing significantly increased damage if **Camille** delays the recast. A portion of the attack's damage will be dealt as true damage. |

 League of Legends content

Buff

A **buff** is any status effect given to a unit that gives them a beneficial boost to their performance in battle.

 League of Legends content

Champion ability

A **champion ability** (often just **ability**) is a unique action performed by and only available to a specific champion. All of these special moves available to a champion collectively constitute their *kit*. A skill point is earned each time the champion  levels up, which the player can spend on most abilities to learn them and rank them up to improve their potency.

**Champion abilities** can have either or both *active* and *passive* effects:

- Active effects are *cast* by using their respective hotkey and selecting a valid target. Most abilities require spending an amount of resource, such as  mana.

- Passive effects may simply be permanently available or are *cast* by fulfilling a requirement or using a specific command.

Most abilities incur a  cooldown after being cast, during which they cannot be used. This cooldown time is usually reduced by  ability haste. Spell effects may trigger only when a valid ability deals damage. On-cast effects trigger upon an ability's *cast time* completing.

 League of Legends content

Turret

A **turret**, also called a **tower**, is a fortification that defends a part of territory. It provides vision of the area and autonomously fires homing bolts at nearby enemies, establishing a defensive ground for allies.

Turrets are most notable in Classic, defending against waves of enemy Minions from their ultimate goal of destroying the nexus. Champions work to destroy enemy turrets to push their assault into the enemies' territory. Turrets visually fall apart as they take damage.

 League of Legends content

| Umbral Dash | COOLDOWN: 9 / 8 / 7 / 6 / 5 |
| --- | --- |

| **Passive:** Aatrox  heals for the portion of the damage he deals to champions. |
| --- |
| **Active:** **Aatrox** dashes in the target direction. |
| *Umbral Dash be cast during other abilities without cancelling them and vice versa.* |

 League of Legends content

| Ranger's Focus |   |
| --- | --- |

| **Passive:** Ashe's basic attacks generate stacks of *Focus*, up to a cap. Once the stacks reach the cap, she can cast *Ranger's Focus*. |
| --- |
| **Active:** **Ashe** gains  **bonus** attack speed and augments her basic attacks to fire a flurry of arrows. |

 League of Legends content

| Void Surge | COOLDOWN: 4 / 3.25 / 2.5 / 1.75 / 1 |
| --- | --- |

| **Active:** Bel'Veth dashes in the target direction, though not through terrain, dealing physical damage to enemies she passes through. |
| --- |
| *Void Surge* can be cast only within a cardinal direction that is off cooldown, each direction has a unique  cooldown that scales down with her  **bonus** attack speed. |
| *Void Surge's* damage against the first enemy hit can critically strike and applies on-hit effects and  life steal. |

 League of Legends content

| Power Fist | COOLDOWN: 7 / 6.5 / 6 / 5.5 / 5 |
| --- | --- |

| **Active:** Blitzcrank charges up a fist to make the next basic attack deal double damage and knock up the target into the air. |
| --- |
