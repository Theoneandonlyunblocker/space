import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";
import { localizeMessage } from "modules/baselib/localization/localize";
import { allCoreCombatPhases } from "core/src/combat/core/coreCombatPhases";
import { combatActionFlags } from "../combatActionFlags";
import { makeSimpleModifier } from "core/src/combat/core/modifiers/makeSimpleModifier";
import { lifeLeech } from "../primitives/lifeLeech";


export const lifeLeechMultiplier: CombatEffectTemplate =
{
  key: "lifeLeechMultiplier",
  get displayName()
  {
    return localizeMessage("effect_lifeLeechMultiplier_displayName").toString();
  },
  getDescription: strength =>
  {
    return localizeMessage("effect_lifeLeechMultiplier_description").format(strength);
  },
  isActive: (strength) => strength !== 0,
  limit:
  {
    min: -Infinity,
    max: Infinity,
  },
  roundingFN: strength => strength,
  actionListeners:
  [
    {
      key: "lifeLeechMultiplier",
      phasesToApplyTo: new Set(allCoreCombatPhases),
      flagsWhichTrigger: [combatActionFlags.lifeLeech],
      shouldActivate: (action, listenerSource) => action.source === listenerSource,
      onAdd: (action, combatManager) =>
      {
        const strength = action.source.battleStats.combatEffects.get(lifeLeechMultiplier).strength;
        action.modifiers.push(makeSimpleModifier(lifeLeech, {additiveMultiplier: strength}));
      },
    }
  ],
};
