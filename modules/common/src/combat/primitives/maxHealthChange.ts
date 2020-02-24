import { CombatActionPrimitiveTemplate } from "core/src/combat/CombatActionPrimitiveTemplate";
import { maxHealthChanged } from "../resultTemplates/maxHealthChanged";


export const maxHealthChange: CombatActionPrimitiveTemplate<number> =
{
  key: "maxHealthChange",
  applyToResult: (value, result) =>
  {
    // could also restore health here if needed
    result.set(
      maxHealthChanged,
      result.get(maxHealthChanged) + value,
    );
  },
};
