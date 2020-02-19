import { CombatActionResultModifier } from "core/src/combat/CombatActionResultModifier";
import { combatEffectChanges } from "../resultTemplates/combatEffectChanges";
import { combatEffectFlags } from "../combatEffectFlags";
import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";
import { negativeEffectsBlocked } from "../resultTemplates/negativeEffectsBlocked";


const negativeFlagsOnIncrease =
[
  combatEffectFlags.positiveLinkedToNegative,
  combatEffectFlags.negative,
  combatEffectFlags.negativeLinkedToPositive,
];
const negativeFlagsOnDecrease =
[
  combatEffectFlags.positive,
  combatEffectFlags.positiveLinkedToNegative,
];
function combatEffectChangeIsNegative(effectTemplate: CombatEffectTemplate, change: number): boolean
{
  if (change === 0)
  {
    return false;
  }

  const negativeFlags = change > 0 ? negativeFlagsOnIncrease : negativeFlagsOnDecrease;

  if (effectTemplate.flags)
  {
    const templateHasNegativeFlag = negativeFlags.some(negativeFlag => effectTemplate.flags.has(negativeFlag));

    if (templateHasNegativeFlag)
    {
      return true;
    }
  }

  return false;
}
export const blockNegativeCombatEffectChanges: CombatActionResultModifier<number> =
{
  key: "blockNegativeCombatEffectChanges",
  modifyResult: (result) =>
  {
    let amountOfEffectsBlocked = 0;

    const effectChanges = result.get(combatEffectChanges);
    effectChanges.forEach((amount, effectTemplate) =>
    {
      if (combatEffectChangeIsNegative(effectTemplate, amount))
      {
        effectChanges.delete(effectTemplate); // deleting entries mid-iteration is safe
        amountOfEffectsBlocked += 1;
      }
    });

    result.set(negativeEffectsBlocked, amountOfEffectsBlocked);
  },
};
