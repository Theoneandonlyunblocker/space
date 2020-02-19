import { CombatActionPrimitiveTemplate } from "../../CombatActionPrimitiveTemplate";
import { guardAmountAdded } from "../resultTemplates/guardAmountAdded";


export const guardAmount: CombatActionPrimitiveTemplate<number> =
{
  key: "guardAmount",
  applyToResult: (value, result) =>
  {
    result.set(
      guardAmountAdded,
      result.get(guardAmountAdded) + value,
    );
  },
};
