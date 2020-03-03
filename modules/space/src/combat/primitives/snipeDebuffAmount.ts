import { CombatActionPrimitiveTemplate } from "core/src/combat/CombatActionPrimitiveTemplate";
import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";
import { combatEffectChanges } from "modules/baselib/src/combat/resultTemplates/combatEffectChanges";
import { snipeAttack, snipeDefence, snipeIntelligence, snipeSpeed } from "../effects/snipe";


export const snipeAttackAmount = makeSnipeDebuffPrimitive("snipeAttackAmount", snipeAttack);
export const snipeDefenceAmount = makeSnipeDebuffPrimitive("snipeDefenceAmount", snipeDefence);
export const snipeIntelligenceAmount = makeSnipeDebuffPrimitive("snipeIntelligenceAmount", snipeIntelligence);
export const snipeSpeedAmount = makeSnipeDebuffPrimitive("snipeSpeedAmount", snipeSpeed);

function makeSnipeDebuffPrimitive(
  key: string,
  debuff: CombatEffectTemplate,
): CombatActionPrimitiveTemplate<number>
{
  return {
    key: key,
    applyToResult: (value, result) =>
    {
      const changes = result.get(combatEffectChanges);
      const previousAmount = changes.get(debuff) || 0;
      changes.set(debuff, previousAmount + value);
    },
  };
}
