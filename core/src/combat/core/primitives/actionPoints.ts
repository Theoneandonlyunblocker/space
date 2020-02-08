import { CombatActionPrimitive } from "../../CombatActionPrimitive";
import { actionPointsAdded } from "../resultTemplates/actionPointsAdded";


export const actionPoints: CombatActionPrimitive<number> =
{
  key: "actionPoints",
  applyToResult: (value, result) =>
  {
    result.set(
      actionPointsAdded,
      result.get(actionPointsAdded) + value,
    );
  }
};
