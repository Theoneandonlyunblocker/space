import { CombatActionPrimitive } from "../../CombatActionPrimitive";
import { moveDelayAdded } from "../resultTemplates/moveDelayAdded";


export const moveDelay: CombatActionPrimitive<number> =
{
  key: "moveDelay",
  applyToResult: (value, result) =>
  {
    result.set(
      moveDelayAdded,
      result.get(moveDelayAdded) + value,
    );
  },
};
