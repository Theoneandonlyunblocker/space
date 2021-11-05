import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";
import { universalCoreListenerFetchers } from "core/src/combat/core/universalCoreListenerFetchers";
import { blockNegativeEffects as blockNegativeEffectsListener } from "../actionListeners/blockNegativeEffects";
import { localizeMessage } from "modules/baselib/localization/localize";


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
  actionListenerFetchers:
  [
    {
      key: "blockNegativeEffect",
      phasesToApplyTo: new Set(universalCoreListenerFetchers.phasesToApplyTo),
      fetch: () => [blockNegativeEffectsListener],
    }
  ]
};
