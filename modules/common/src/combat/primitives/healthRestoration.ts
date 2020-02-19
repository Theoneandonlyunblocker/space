import { CombatActionPrimitiveTemplate } from "core/src/combat/CombatActionPrimitiveTemplate";
import { healthRestored } from "../resultTemplates/healthRestored";


export const healthRestoration: CombatActionPrimitiveTemplate<number> =
{
  key: "healthRestoration",
  applyToResult: (value, result) =>
  {
    result.set(
      healthRestored,
      result.get(healthRestored) + value,
    );
  },
};
