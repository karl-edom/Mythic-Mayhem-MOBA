// Bundles the game data files. Works in Node (import attributes) and in the browser bundle (esbuild).

import heroes from "../../data/game/heroes.json" with { type: "json" };
import items from "../../data/game/items.json" with { type: "json" };
import map from "../../data/game/map.json" with { type: "json" };
import rules from "../../data/game/rules.json" with { type: "json" };
import spells from "../../data/game/spells.json" with { type: "json" };
import units from "../../data/game/units.json" with { type: "json" };
import type { GameContent } from "./types.ts";

export const CONTENT: GameContent = {
  rules: rules as unknown as GameContent["rules"],
  units: units as unknown as GameContent["units"],
  map: map as unknown as GameContent["map"],
  heroes: heroes.heroes as unknown as GameContent["heroes"],
  items: items.items as unknown as GameContent["items"],
  spells: spells.spells as unknown as GameContent["spells"],
};
