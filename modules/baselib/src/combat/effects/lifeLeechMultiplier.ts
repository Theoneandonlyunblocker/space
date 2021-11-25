import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";
import { localizeMessage } from "modules/baselib/localization/localize";
import { allCoreCombatPhases } from "core/src/combat/core/coreCombatPhases";
import { multiplyLifeLeech } from "../actionListeners/multiplyLifeLeech";


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
  actionListenerFetchers:
  [
    {
      key: "lifeLeechMultiplier",
      phasesToApplyTo: new Set(allCoreCombatPhases),
      fetch: () => [multiplyLifeLeech],
    }
  ]
};
