import { CombatActionPrimitiveTemplate } from "core/src/combat/CombatActionPrimitiveTemplate";
import {combatEffectChanges} from "modules/baselib/src/combat/resultTemplates/combatEffectChanges";
import { mergeBuff } from "../effects/mergeBuff";


export const mergeBuffAmount: CombatActionPrimitiveTemplate<number> =
{
  key: "mergeBuffAmount",
  applyToResult: (value, result) =>
  {
    const changes = result.get(combatEffectChanges);
    const previousAmount = changes.get(mergeBuff) || 0;
    changes.set(mergeBuff, previousAmount + value);
    result.set(combatEffectChanges, changes);
  },
};
