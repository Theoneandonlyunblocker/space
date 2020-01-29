import { CombatActionPrimitive } from "../../CombatActionPrimitive";
import { guardAmountAdded } from "../resultTemplates/guardAmountAdded";


export const guardAmount: CombatActionPrimitive<number> =
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
