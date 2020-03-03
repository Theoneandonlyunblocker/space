import { CombatActionPrimitiveTemplate } from "core/src/combat/CombatActionPrimitiveTemplate";
import { lifeLeeched } from "../resultTemplates/lifeLeeched";


export const lifeLeech: CombatActionPrimitiveTemplate<number> =
{
  key: "lifeLeech",
  applyToResult: (value, result) =>
  {
    result.set(
      lifeLeeched,
      result.get(lifeLeeched) + value,
    );
  },
};
