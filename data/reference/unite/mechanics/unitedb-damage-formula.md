https://unite-db.com/_nuxt/0414581.js

<!-- Paraphrase of the damage-calculation code in unite-db's public front-end bundle (function damageCalc, component "rsb"). Not an official formula. -->

# Move damage formula (unite-db)

unite-db displays each damaging line of a move as `ratio% Atk|SpAtk + slider × (Level − 1) + base` and computes:

```
stat   = (dmg_type == "Atk") ? Attack : Sp. Atk      // user stat at its current level
damage = floor(ratio × stat / 100) + slider × (level − 1) + base
```

- Lines flagged `exception: "True"` are not formula-based; their `true_desc` text describes them (e.g. "30% of the full damage").
- `enhanced_*` fields hold the values after the move's "+" upgrade; `enhanced_cdr` is the upgraded cooldown.
- Mitigation by Defense / Sp. Def, critical-hit multiplier and penetration are NOT documented by unite-db, Serebii or dittobase pages used here.

damage = floor(ratioPct/100 × scalingStat) + perLevel × (level − 1) + base, where scalingStat is the user's Attack ("Atk") or Sp. Atk ("SpAtk") at its current level. Formula as implemented by unite-db's front-end (damageCalc); it is the raw value before the target's Defense / Sp. Def mitigation, which no source used here documents.
