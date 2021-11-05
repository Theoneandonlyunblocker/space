import { CombatActionResultTemplate } from "core/src/combat/CombatActionResultTemplate";
import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";


export const combatEffectChanges: CombatActionResultTemplate<Map<CombatEffectTemplate, number>> =
{
  key: "combatEffectChanges",
  get defaultValue()
  {
    return new Map();
  },
  applyResult: (changes, source, target, combatManager) =>
  {
    changes.forEach((changeAmount, effectTemplate) =>
    {
      target.battleStats.combatEffects.get(effectTemplate).strength += changeAmount;
    });
  },
};
