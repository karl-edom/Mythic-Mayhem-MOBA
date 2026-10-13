Source: https://wiki.leagueoflegends.com/en-us/Death

> LoL wiki page "Death" (revision 4051174), rendered HTML converted to Markdown by tools/extract/lol/mechanics.ts. Content © League of Legends Wiki contributors, CC BY-SA 3.0. Reference material for private research only.

# Death

**Death** occurs when a champion takes sufficient damage to be reduced to zero health. Dying removes the champion from active play and causes them to enter the **death screen**, where they will have to wait some time before they *respawn* at their allied fountain. If slain by an enemy champion,  experience and gold bounties are dispensed and granted to the killer, their assistors, and nearby enemies.

Certain effects are able to defer death or prevent it from triggering its penalties altogether, allowing the player to continue some or all of their actions for a varying amount of time.

## Death screen

While in the death screen, the player's view becomes grey, the Death Recap summarizes the player's combat, and other champion or situation-specific events may occur. A special "Ally Spectate" menu also appears—within the menu, players can Left Mouse Button select the portrait of allies who are alive to jump the camera to them and follow their view. The menu can also be moved by clicking and dragging.

While dead:

- Players **cannot** perform the vast majority of map-impacting actions. They are prohibited from movement, attacking, and casting champion abilities, item active abilities and summoner spells.

- Players **can** purchase items from the shop as if they were inside their shopping platform, look around the map, cast pings, and use the scoreboard and chat. There are 5 items that **can** be used while dead, these are: Elixir of Iron, Elixir of Sorcery, Elixir of Wrath, Redemption, and Your Cut (of these, 4 are consumable).

Some passive effects from champion abilities or items may be disabled while in the death screen. The death screen does not affect currently incurred cooldowns and they will continue being incurred as normal.

## Death timer

Upon death, every player must wait an amount of time before they respawn, called the **death timer**. A countdown above the "Ally Spectate" portraits indicates this timer. Decimals within the countdown are not displayed and always round up.

When the death timer reaches zero, the player's champion respawns at the center of their allied fountain.

### Summoner's Rift

In Summoner's Rift, death timers increase both by champion **level** and by **game time**. The sum of these two increases is the total death timer.

By level, death timers consider a set time duration, called **Base Respawn Wait time (BRW)** here, in their calculations:

**BRW** = 10 / 10 / 12 / 12 / 14 / 16 / 20 / 25 / 28 / 32.5 / 35 / 37.5 / 40 / 42.5 / 45 / 47.5 / 50 / 52.5 seconds

By game time, death timer calculations involve a multiplier that modifies the **BRW**, called the **Time Increase Factor** (**TIF_x**) here.

After 15 minutes, the **TIF_x** increases「 2 times per minute 」「 every 30 seconds 」, and it is also multiplied by:

- **0.425%** between 15 and 30 minutes

- **0.3%** between 30 and 45 minutes

- **1.45%** after 45 minutes, until 55 minutes

> In the following table, *current minutes* is in decimal form, and *ceil* is the Least Integer/Ceiling function.

***TIF_x***

| Game Time | Formula | Result |
| --- | --- | --- |
| 0 – 14:59 | **TIF_0 – 15** = N/A ⇒ Only BRW is considered, see above. | **TIF_0 – 15** = N/A ⇒ Only BRW is considered, see above. |
| 15 – 29:59 | 0 + ceil (2 × (*current minutes* - 15)) × **0.425 / 100** | **TIF_15 – 29.5** = 0.425% – 12.75% (based on minutes) |
| 30 – 44:59 | 12.75 + ceil (2 × (*current minutes* - 30)) × **0.30 / 100** | **TIF_30 – 44.5** = 13.05% – 21.75% (based on minutes) |
| 45 – 54:59 | 21.75 + ceil (2 × (*current minutes* - 45)) × **1.45 / 100** | **TIF_45 – 54.5** = 23.2% – 50.75% (based on minutes) |

Total death time is calculated as follows:

**Total death time** = **BRW** + **BRW** × **TIF_x** | where x = current minute-half.

- The TIF_x has a hard cap of 50%, so the maximum possible death timer is at 55 minutes at champion level 18:

> 52.5 + 52.5 × 50% = **78.75 seconds**

### Howling Abyss

In the Howling Abyss, the death timer is only based on level:

Death Timer = 11 / 13 / 15 / 17 / 19 / 21 / 22 / 24 / 26 / 28 / 30 / 32 / 34 / 36 / 38 / 40 seconds.

## Loss of buffs or effects

Death does not mean that every ongoing effect is interrupted or removed when the source dies. For example, damage over time and already launched projectiles are not affected by death.

By default, death interrupts basic attack windups, cast times, channels, and all forms of movement (e.g. dashes, displacements). Entering resurrection will not interrupt an ability's cast time, unless it is special-cased to be interrupted by the resurrection source. Any other effect that is removed or interrupted by death is specifically implemented to do so.

If the slain champion possessed a status effect that doesn't *persist through death*, it is removed. For example, the Crest of Cinders and Crest of Insight buffs are removed upon dying. This may also apply to debuffs: Exhaust does not persist through death, meaning spells that are able to continue dealing damage after the enemy's death may inadvertently deal more damage to the team than desired, due to the debuff's removal.

Many other status effects may be reapplied again upon respawning, depending on their particular conditions; this is common among item effects. Yet others may simply be permanent and unaffected by the death state (e.g. the Bloody Petals neutral buff).

- Common buffs that are lost upon death:

  - Health Potion

  - Refillable Potion

  - Hand of Baron

  - Aspect of the Dragon

- Buffs that are transferred to the killer:

  - Crest of Insight (conditionally)

  - Crest of Cinders (conditionally)

- Champion ability stacks lost upon death:

  - Draven's League of Draven

- Item stacks lost upon death:

  - Dark Seal (loses 5 stacks)

  - Hubris (loses all stacks)

  - Mejai's Soulstealer (loses 10 stacks)

## Ways to prevent death when reaching zero health

** Edit **A unit that is protected by **Resurrection** will enter a revival state and dispel most debuffs upon taking fatal damage. After the state completes, the unit is revived. **Resurrection** effects do not count for kills or assists.

**Resurrection** sources have a hierarchy, and will trigger in the following order:

- Zilean's Chronoshift

- Zaahen's Cultivation of War

- Guardian Angel

- Anivia's Rebirth and Zac's Cell Division

**Resurrection** will always take precedence over zombie state effects. Entering **resurrection** does not cancel cast times. Renata Glasc's Bailout always takes priority over **resurrection**.

- Renata Glasc's Bailout prevents the target from dying upon reaching zero health.

## Ways to prevent dying by not losing health

A unit that has gained a **minimum health threshold** cannot have their health reduced below it from damage dealt by enemies.

The following effects grant a minimum health threshold:

- Kindred's Lamb's Respite

- Pantheon's Grand Starfall

- Tryndamere's Undying Rage

Executes against units within this state will set the target's health to **1**. All other sources of raw damage ignore the threshold.

Other effects that trigger from damage dealt will still take place (e.g.  life steal) even if the unit under the effect of a minimum damage threshold ignores the damage itself.

## Ways to revive a champion in the death state

The following will revive allied champions while they are in the death state:

- Akshan's Going Rogue

## Zombie states

** Edit **A buff that allows a player to keep controlling their champion after Death always flags the champion to be in a **zombie state**. It prevents enemies from gaining full kill credit or triggering most on-kill effects from the champion a second time, and some abilities (e.g. You and Me!) interact differently with champions in this state. Renata Glasc's Bailout and Resurrection will always take precedence over **zombie state** effects.

The following effects trigger a champion to enter a **zombie state**:

- Karthus' Death Defied

- Kog'Maw's Icathian Surprise

- Sion's Glory in Death

### Notes

- Zombie states trigger upon taking lethal damage.

  - Raw damage effects will not prevent zombie states from triggering.

- All resurrection effects will take precedence over effects that reanimate as a zombie.

- A champion that enters a zombie state will start their death timer upon triggering the effect.

- Most buffs and debuffs will be lost upon transitioning into a zombie state.

  - Those that persist through death, such as Brand's Blaze, will remain.

  - Undisplayed marker buffs, such as those imposed by Veigar's Event Horizon and Viktor's Gravity Field to prevent being affected multiple times by the same effect, will be lost.^(bug)

  - This does not apply when transitioning from one zombie state to another zombie state.^(bug)

- Units within a zombie state cannot:

  - Use Recall or Refillable Potion.

  - Activate resurrection effects.

  - Take Dark Passage, Catapult, or gates.

  - Initate the Rift Herald Rodeo.

  - Pick up the Eye of the Herald.

  - Be targeted by the following:

    - Bailout

    - Chronoshift

    - Umbral Trespass.

  - Be affected by the following:

    - Curse of the Black Mist

    - Fear Beyond Death's chain missile

    - Test of Spirit's initial missile

    - Lamb's Respite

    - Realm of Death

    - Fountain health restore

### Trivia

- Yorick's Omen of Death allowed any champion it was cast on to remain in full control of their  reanimated champion for up to 10 seconds, if they died while the *Revenant* clone was alive.

- Zyra's Rise of the Thorns allowed her to shoot a singular deadly projectile between 2 and 8 seconds after dying.

## Order of events upon death

Some champions have abilities that trigger after their death or the death of another targeted champion, allowing for limited control by one of the involved parties. These will only occur after the previously mentioned sequence and when more than one of them apply they will occur in the following order.

- Mordekaiser's Realm of Death (keeping the stolen stats)

- Viego's Sovereign's Domination (Mist Wraith appear)

- Zombie state effects - Karthus' Death Defied / Sion's Glory in Death / Kog'Maw's Icathian Surprise

- Lissandra's Iceborn Subjugation

## See also

- Kill

- Assist

- Kill to Death Ratio

## References

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

Dash

A **dash** is a quick movement action by a unit in which they move to a specific direction or location while traversing the intervening distance, ignoring the boundaries of terrain.

The game engine does not take into account the height of the unit; dashes that depict air travel are considered to be on the ground for targeting purposes such as skill-shots.

- Dashes should not be confused with displacement effects, which are usually sourced from enemy units (and are classified as crowd control debuffs).

- Dashes are interrupted by stasis (from an enemy), knockdown, and blinks.

- Dashes are overridden by all move blocks, which includes displacements and other dashes, as well as a few other cases.

- Not all dashes can traverse terrain (e.g. Justice Punch, Searing Charge, Tumble).

- Some dashes gain increased distance when directed through terrain (e.g. Umbral Dash, Perfect Execution, Phantom Undertow).

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

Resurrection

A unit that is protected by **Resurrection** will enter a revival state and dispel most debuffs upon taking fatal damage. After the state completes, the unit is revived. **Resurrection** effects do not count for kills or assists.

**Resurrection** sources have a hierarchy, and will trigger in the following order:

- Zilean's Chronoshift

- Zaahen's Cultivation of War

- Guardian Angel

- Anivia's Rebirth and Zac's Cell Division

**Resurrection** will always take precedence over zombie state effects. Entering **resurrection** does not cancel cast times. Renata Glasc's Bailout always takes priority over **resurrection**.

 League of Legends content

| League of Draven |   |
| --- | --- |

| **Innate:** Draven gains an *Adoration* stack when he catches a Spinning Axe or kills a minion, monster, or turret. He loses *Adoration* stacks when he dies. |
| --- |
| When **Draven** kills an enemy champion, he consumes all *Adoration* stacks to gain **bonus** gold. |

 League of Legends content

Dispel

A **dispel** removes debuffs (e.g. - poison). It is distinct from *Cleanse*, which only removes crowd control, and Death, which removes all *status effects* (regardless of being positive or detrimental) that do not *persist through death*.

Currently, the only sources of **dispel** exist in resurrection:

- Anivia's Rebirth

- Zaahen's Cultivation of War

- Zac's Cell Division

- Zilean's Chronoshift

- Guardian Angel

 League of Legends content

Debuff

A **debuff** is any *status effect* given to a unit that negatively impacts their combat performance in some way.

 League of Legends content

Death

**Death** occurs when a unit's  health is reduced to zero, thereby being killed. The unit can no longer act and is removed or becomes a corpse.

On player death, they can view the death recap and the shop to purchase items, and some item actives can be used while dead.

 League of Legends content

| Chronoshift | COOLDOWN: 120 / 90 / 60 |
| --- | --- |

| **Active:** Zilean places a protective time rune on himself or the target allied champion for a few seconds. |
| --- |
| If the target would die, they enter resurrection for a short time, becoming invulnerable, untargetable, and unable to act. They are healed afterwards. |

 League of Legends content

| Cultivation of War |   |
| --- | --- |

| **Innate:** Zaahen's basic attacks and abilities against enemy champions grant him stacks of *Determination*, refreshing on subsequent damage to champions and stacking up to 12 times. |
| --- |
| Periodically, if **Zaahen** would take lethal damage while at maximum stacks of *Determination*, he will enter resurrection for a short time, healing himself over the duration and then reviving himself. |
| **Determination:** For each stack, **Zaahen** gains  **bonus** attack damage, increased greatly while at maximum stacks. |

 League of Legends content

| Rebirth | STATIC CD: 240 |
| --- | --- |

| **Innate:** Periodically, upon dying, Anivia will instead revert into an egg. If the egg can survive for a few seconds, she is gloriously reborn. |
| --- |

 League of Legends content

| Cell Division | STATIC CD: 300 |
| --- | --- |

| **Innate - Goo:** Zac's abilities have a  health cost. Whenever **Zac's** abilities damage an enemy, he sheds a number of chunks on the ground that remain for a few seconds. **Zac** and enemy champions can collect the chunks; an enemy will destroy it, while **Zac** will heal a portion of his **maximum** health. |
| --- |
| **Innate - Cell Division:** Periodically when **Zac** would die, he instead enters resurrection for a period, splitting into four *bloblets* that can be attacked by enemies. **Zac** will die once all *bloblets* are killed. |

 League of Legends content

Zombie state

A buff that allows a player to keep controlling their champion after Death always flags the champion to be in a **zombie state**. It prevents enemies from gaining full kill credit or triggering most on-kill effects from the champion a second time, and some abilities (e.g. You and Me!) interact differently with champions in this state. Renata Glasc's Bailout and Resurrection will always take precedence over **zombie state** effects.

The following effects trigger a champion to enter a **zombie state**:

- Karthus' Death Defied

- Kog'Maw's Icathian Surprise

- Sion's Glory in Death

 League of Legends content

| Bailout | COOLDOWN: 28 / 27 / 26 / 25 / 24 |
| --- | --- |

| **Active:** Renata grants herself or the target allied champion ramping  **bonus** attack speed in addition to  **bonus** movement speed toward enemies. *Bailout's* duration resets whenever the target scores a takedown against an enemy champion. |
| --- |
| If the target would die while *Bailout* is active, their health is set back to full but they suffer a true damage burn that would kill them over a short time. The target can stop the burn by scoring a takedown. |

 League of Legends content

| Lamb's Respite | COOLDOWN: 160 / 140 / 120 |
| --- | --- |

| **Active:** Lamb blesses the ground under herself for a few seconds. Any unit inside the area will become invulnerable upon reaching low health. |
| --- |
| Units within the area are healed when the blessing ends. |

 League of Legends content

| Grand Starfall | COOLDOWN: 180 / 165 / 150 |
| --- | --- |

| **Passive:** Pantheon gains  armor penetration. |
| --- |
| **Active:** **Pantheon** channels, then leaps high into the air. After a short time, he throws a spear at the target location that deals physical damage to nearby enemies and slows them. |
| **Pantheon** then crashes down and creates a shockwave alongside himself that travels toward the target location, dealing magic damage to enemies hit. |
| **Pantheon** gains full stacks of ** Mortal Will** upon landing. |

 League of Legends content

| Undying Rage | COOLDOWN: 120 / 100 / 80 |
| --- | --- |

| **Active:** Tryndamere becomes enraged, gaining Fury and a minimum health threshold for a few seconds. |
| --- |
| ** minimum health threshold:** The target's health cannot be reduced below the threshold. |

 League of Legends content

Execute

**Executes** deal damage equal to 100% of the target's **current** health, which is usually true damage, while ignoring all mitigations. Those that affect champions may additionally have the property of breaking 100% of the target's current shields before applying their damage.

Most **executes** do not ignore invulnerability, resurrection and effects that grant a minimum health threshold. If they do, they are termed raw damage.

 League of Legends content

Raw damage

The term **raw damage** applies to a rare form of default damage that does not respect death protection and immunity effects on the target at all, such as invulnerability, minimum health threshold and resurrection. Spell shield, if applicable, is the only way to potentially avoid **raw damage** by negating the origin spell's effects entirely (which would include avoiding their damage).

**Raw damage** also does not interact with any effect. In the context of champions, the Nexus Obelisk against them and Zac's Cell Division's redirected damage are the only **raw damage** effects. Various other systems utilize it however, such as Rift Herald's self-damage.

 League of Legends content

| Going Rogue | COOLDOWN: 18 / 14 / 10 / 6 / 2 |
| --- | --- |

| **Passive:** Enemy champions that kill allied champions are marked as a *Scoundrel* for a long time. When Akshan scores a takedown on a *Scoundrel*, he gains **bonus** gold, all allies killed by the *Scoundrel* are resurrected, and *Scoundrel* status is removed from all other enemies. |
| --- |
| **Active:** **Akshan** briefly gains camouflage, or indefinitely while near terrain and in brush. During this time, he can see trails leading toward *Scoundrels* and gains  move speed and  mana regeneration while moving toward them. |
| **Recast:** **Akshan** ends *Going Rogue*. |

 League of Legends content

Champion

**Champions** are the player-controlled characters in League of Legends. Each champion possesses unique abilities and attributes.

 League of Legends content

| You and Me! | STATIC CD: 10 / 5 / 0 (based on level) |
| --- | --- |

| **Passive:** While Yuumi is attached, she is untargetable and casts her abilities from the *Anchor's* position, empowering them with additional effects. |
| --- |
| **Active:** **Yuumi** dashes to the target allied champion to attach to them. *You and Me!* can be recast while attached. |
| **Recast:** **Yuumi** detaches from her *Anchor* and dashes to the target allied champion to attach to them. If this is cast without a target, she will dash out to detach. |
| *You and Me!* is placed on a short  cooldown if **Yuumi** becomes immobilized or grounded. ** Best Friend Bonus:** **Yuumi** gains  heal and shield power and her *Best Friend* gains on-hit healing. |

 League of Legends content

| Death Defied |   |
| --- | --- |

| **Innate:** Upon dying, Karthus enters an untargetable spirit form for a few seconds that allows him to continue casting spells at no cost but without being able to move. |
| --- |
| If * Defile* has been learned, it will remain toggled on for *Death Defied's* entire duration. |

 League of Legends content

| Icathian Surprise |   |
| --- | --- |

| **Innate:** Upon dying, Kog'Maw enters an untargetable zombie state for a few seconds, gradually gaining  **bonus** movement speed. He explodes at the end of the duration, dealing true damage to nearby enemies. |
| --- |

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

| Blaze |   |
| --- | --- |

| **Innate:** Brand's abilities apply a stack of *Ablaze* to enemies hit. Subsequent abilities used against a target with *Ablaze* are empowered. Killing an enemy afflicted with *Ablaze* or with an ability restores  mana. |
| --- |
| At three stacks, champions and large monsters become unstable and explode after a brief delay, dealing magic damage to nearby enemies and applying a stack of *Ablaze*. *Ablaze* cannot stack more than once on enemies who have recently exploded. |
| **Ablaze:** While afflicted with *Ablaze*, the target is continually dealt magic damage equal to a portion of their **maximum** health. |

 League of Legends content

| Event Horizon | COOLDOWN: 20 / 18.5 / 17 / 15.5 / 14 |
| --- | --- |

| **Active:** After a brief delay, Veigar erects a cage at the target location that lasts for a short time. Enemies that touch the cage edges are briefly knocked down and stunned. |
| --- |

 League of Legends content

| Gravity Field | COOLDOWN: 17 / 16 / 15 / 14 / 13 |
| --- | --- |

| **Active:** Viktor deploys a gravity field that remains at the target location for a few seconds. After a brief delay, the field will activate to continually slow enemies within and inflict stack of *Heavy Gravity*. |
| --- |
| **Heavy Gravity:** The fifth stack will consume them all to knock down and briefly stun the target. |
| ** Augment:** **Viktor's** basic abilities and the initial hit of Arcane Storm will briefly slow enemies hit. |

 League of Legends content

| Dark Passage | COOLDOWN: 21 / 20 / 19 / 18 / 17 |
| --- | --- |

| **Active:** Thresh throws his lantern to the target location that remains for a few seconds while he remains nearby. He and the first allied champion to come near the lantern are granted a shield for a few seconds, with the amount based on * Souls*. |
| --- |
| An ally can grab the lantern to dash to **Thresh** and gain the shield, but cannot do so while immobilized, grounded, or silenced. |

 League of Legends content

Warp gate

**Warp gates** (or simply **gates**) are map elements that offer transit.

Champions can interact with a gate to briefly channel. Then, they dash to the other side of the gate while untargetable. Each route cannot be taken again for some time after using either side of the gate. Upon arrival, players may choose a direction to dash again a distance away from the gate, though not through terrain.

The channel can be interrupted by taking damage, becoming grounded, or manually by the player, though the travel cannot. Channeling cannot take place while unable to cast abilities or while grounded.

 League of Legends content

| Umbral Trespass | COOLDOWN: 120 / 100 / 80 |
| --- | --- |

| **Passive:** Kayn *marks* enemy champions he has damaged for a few seconds. |
| --- |
| **Active:** **Kayn** vanishes and dashes to a *marked* enemy champion. Upon arrival, he channels for a short time, attaching to the target and revealing them. |
| **Recast:** **Kayn** deals physical damage to the target and dashes out from their body in the target direction. |
| **Shadow Assassin Bonus:** *Umbral Trespass* has increased range. Emerging will  reset * The Darkin Scythe's* cooldown. **Darkin Slayer Bonus:** *Umbral Trespass* deals damage based on the target's **maximum** health, and heals him for a portion of the target's **maximum** health. |

 League of Legends content

| Curse of the Black Mist | COOLDOWN: 26 / 24.5 / 23 / 21.5 / 20 |
| --- | --- |

| **Active:** Senna creates an aura of mist and gains camouflage for a few seconds. She will quickly regain camouflage after breaking stealth. |
| --- |
| Allied champions that enter the mist gain *Wraith Form* for the remaining duration. **Senna** and allies camouflaged by *Curse of the Black Mist* also gain  **bonus** movement speed. |
| **Wraith Form**: Gain camouflage. Enemies will have obscured vision of camouflaged *Wraiths* moving outside the mist. *Wraiths* will quickly regain camouflage after breaking stealth. |

 League of Legends content

| Fear Beyond Death | COOLDOWN: 100 / 85 / 70 |
| --- | --- |

| **Active:** Urgot fires a chem-drill in the target direction that impales the first enemy champion hit, dealing physical damage and leashing them for a few seconds. The target is also revealed and slowed based on their **missing** health. |
| --- |
| *Fear Beyond Death* can be recast if the leashed target falls to low health, and does so automatically afterwards if they remain at low health. It will also recast if the chem-drill would kill the target. |
| **Recast:** **Urgot** suppresses the target and reels them in, revealing them and rendering them untargetable. He then executes them, which briefly fears and slows nearby enemies. |

 League of Legends content

| Test of Spirit | COOLDOWN: 16 / 15 / 14 / 13 / 12 |
| --- | --- |

| **Active:** Illaoi reaches with a tendril in the target direction that stops upon the first enemy hit. If the target is a champion, she rips their Spirit out from them to stand before her. |
| --- |
| The Spirit tethers to the target for a duration, dealing a portion of any damage it takes. If the Spirit is killed or the target leaves its range, the target will be slowed and marked as a Vessel for a duration or until they takedown **Illaoi**, spawning Tentacles while marked. |
| Tentacles will autonomously attack the nearest Spirit or Vessel. |

 League of Legends content

| Realm of Death | COOLDOWN: 120 / 110 / 100 |
| --- | --- |

| **Active:** Mordekaiser slows the target enemy champion, then banishes them with him to the *Death Realm* for a few seconds, cancelling all interactions with non-banished units. |
| --- |
| Additionally, **Mordekaiser** heals himself for a portion of the target's **maximum** health and temporarily steals a portion of their **current**  attack damage,  ability power,  **total** attack speed,  **maximum** health,  armor,  magic resist, and size. |
| If the target dies while inside the *Death Realm*, **Mordekaiser** keeps his stolen stats until they respawn. |
| **Death Realm:** The *Death Realm* confines units in a small area. Allies and enemies cannot see or interact with those in the *Death Realm* but can see their locations and vice versa. |

 League of Legends content

| Sovereign's Domination |   |
| --- | --- |

| **Innate:** Scoring an enemy champion takedown will spawn a *Mist Wraith* for a period. Viego can consume the *Mist Wraith* to briefly become untargetable and blink to it, which heals him for a portion of the target's **maximum** health and grants *Possession*. |
| --- |
| Casting * Heartbreaker* or consuming a *Mist Wraith* will end *Possession* early. |
| **Possession:** For a period, **Viego's** items, stats, basic attacks, and basic abilities become those of the slain enemy's. He also gains a free cast of * Heartbreaker* and  **bonus** movement speed while facing an enemy champion. |

 League of Legends content

| Iceborn Subjugation |   |
| --- | --- |

| **Innate:** Whenever an enemy champion dies while Lissandra is nearby, she spawns a *Frozen Thrall* from their corpse. |
| --- |
| *Frozen Thralls* are invulnerable and untargetable ice spirits that slow nearby enemies and gain increasing  movement speed over their lifespan. They will chase nearby enemies for a few seconds before exploding, dealing magic damage in an area. |
