import { CombatActionPrimitiveTemplate } from "../../CombatActionPrimitiveTemplate";
import { moveDelayAdded } from "../resultTemplates/moveDelayAdded";


export const moveDelay: CombatActionPrimitiveTemplate<number> =
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
