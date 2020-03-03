import { CombatActionPrimitiveTemplate } from "core/src/combat/CombatActionPrimitiveTemplate";
import {combatEffectChanges} from "modules/baselib/src/combat/resultTemplates/combatEffectChanges";
import { infestation } from "../effects/infestation";


export const infestationAmount: CombatActionPrimitiveTemplate<number> =
{
  key: "infestationAmount",
  applyToResult: (value, result) =>
  {
    const changes = result.get(combatEffectChanges);
    const previousAmount = changes.get(infestation) || 0;
    changes.set(infestation, previousAmount + value);
  },
};
