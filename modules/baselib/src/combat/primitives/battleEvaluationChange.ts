import { CombatActionPrimitiveTemplate } from "core/src/combat/CombatActionPrimitiveTemplate";
import { battleEvaluationChanged } from "../resultTemplates/battleEvaluationChanged";


export const battleEvaluationChange: CombatActionPrimitiveTemplate<number> =
{
  key: "battleEvaluationChange",
  applyToResult: (value, result) =>
  {
    result.set(
      battleEvaluationChanged,
      result.get(battleEvaluationChanged) + value,
    );
  },
};
