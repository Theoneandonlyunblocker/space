import { CombatActionPrimitiveTemplate } from "core/src/combat/CombatActionPrimitiveTemplate";
import { increasedCaptureChance } from "../resultTemplates/increasedCaptureChance";


export const captureChance: CombatActionPrimitiveTemplate<number> =
{
  key: "captureChance",
  applyToResult: (value, result) =>
  {
    result.set(
      increasedCaptureChance,
      result.get(increasedCaptureChance) + value,
    );
  },
};
