import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";
import { localizeMessage } from "modules/baselib/localization/localize";
import { allCoreCombatPhases } from "core/src/combat/core/coreCombatPhases";
import { combatActionFlags } from "../combatActionFlags";
import { blockNegativeCombatEffectChanges } from "../resultModifiers/blockNegativeCombatEffectChanges";


export const blockNegativeEffect: CombatEffectTemplate =
{
  key: "blockNegativeEffect",
  get displayName()
  {
    return localizeMessage("effect_blockNegativeEffect_displayName").toString();
  },
  getDescription: strength =>
  {
    return localizeMessage("effect_blockNegativeEffect_description").format(strength);
  },
  isActive: (strength) => strength > 0,
  limit:
  {
    min: 0,
    max: Infinity,
  },
  roundingFN: Math.round,
  actionListeners:
  [
    {
      key: "blockNegativeEffect",
      phasesToApplyTo: new Set(allCoreCombatPhases),
      flagsWhichTrigger: [combatActionFlags.addEffect],
      shouldActivate: (action, listenerSource) => action.target === listenerSource,
      onAdd: (action, combatManager) =>
      {
        action.resultModifiers.push(
        {
          modifier: blockNegativeCombatEffectChanges,
          value: action.target.battleStats.combatEffects.get(blockNegativeEffect),
        });
      },
    },
  ],
};
