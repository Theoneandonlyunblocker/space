import { CombatActionPrimitiveTemplate } from "core/src/combat/CombatActionPrimitiveTemplate";
import { healthRestored } from "../resultTemplates/healthRestored";


export const healing: CombatActionPrimitiveTemplate<number> =
{
  key: "healing",
  applyToResult: (value, result) =>
  {
    result.set(
      healthRestored,
      result.get(healthRestored) + value,
    );
  },
};
