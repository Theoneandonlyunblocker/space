import { CombatActionPrimitiveTemplate } from "../../CombatActionPrimitiveTemplate";
import { actionPointsAdded } from "../resultTemplates/actionPointsAdded";


export const actionPoints: CombatActionPrimitiveTemplate<number> =
{
  key: "actionPoints",
  applyToResult: (value, result) =>
  {
    result.set(
      actionPointsAdded,
      result.get(actionPointsAdded) + value,
    );
  },
};
