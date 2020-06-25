import { localize } from "modules/space/localization/localize";
import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";
import { takePoisonDamage } from "../actions/takePoisonDamage";
import { afterMainPhase } from "core/src/combat/core/phases/afterMainPhase";


export const poisoned: CombatEffectTemplate =
{
  key: "poisoned",
  getDisplayName: strength =>
  {
    return localize("poisoned_displayName");
  },
  getDescription: strength =>
  {
    return localize("poisoned_description");
  },
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
