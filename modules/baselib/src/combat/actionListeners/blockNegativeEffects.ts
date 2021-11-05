import { CorePhase } from "core/src/combat/core/coreCombatPhases";
import { combatActionFlags } from "../combatActionFlags";
import { CombatActionListener } from "core/src/combat/CombatActionListener";
import { blockNegativeCombatEffectChanges } from "../resultModifiers/blockNegativeCombatEffectChanges";
import { blockNegativeEffect } from "../effects/blockNegativeEffect";


export const blockNegativeEffects: CombatActionListener<CorePhase> =
{
  key: "blockNegativeEffects",
  flagsWhichTrigger: [combatActionFlags.addEffect],
  onAdd: (action, combatManager) =>
  {
    action.resultModifiers.push(
    {
      modifier: blockNegativeCombatEffectChanges,
      value: action.target.battleStats.combatEffects.get(blockNegativeEffect),
    });
  },
};
