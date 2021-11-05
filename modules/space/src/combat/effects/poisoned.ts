import { localizeMessage } from "modules/space/localization/localize";
import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";
import { takePoisonDamage } from "../actions/takePoisonDamage";
import { afterMainPhase } from "core/src/combat/core/phases/afterMainPhase";


export const poisoned: CombatEffectTemplate =
{
  key: "poisoned",
  get displayName()
  {
    return localizeMessage("combatEffect_poisoned_displayName").toString();
  },
  getDescription: strength =>
  {
    return localizeMessage("combatEffect_poisoned_description").format(strength);
  },
  isActive: (strength) => strength > 0,
  limit:
  {
    min: 0,
    max: Infinity,
  },
  roundingFN: Math.round,
  actionFetchers:
  [
    {
      key: "takePoisonDamage",
      phasesToApplyTo: new Set([afterMainPhase]),
      fetch: (battle, unit) =>
      {
        return [
          takePoisonDamage(unit),
        ];
      },
    },
  ],
};
