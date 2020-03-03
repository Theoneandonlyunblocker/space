import { CombatActionPrimitiveTemplate } from "core/src/combat/CombatActionPrimitiveTemplate";
import { healthRestored } from "../resultTemplates/healthRestored";


// should be used when you want healing to ignore all modifiers, resistances, etc.
export const rawHealthRestoration: CombatActionPrimitiveTemplate<number> =
{
  key: "rawHealthRestoration",
  applyToResult: (value, result) =>
  {
    result.set(
      healthRestored,
      result.get(healthRestored) + value,
    );
  },
};
