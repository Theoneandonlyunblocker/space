import { localize } from "modules/space/localization/localize";
import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";
import { takePoisonDamage } from "../actions/takePoisonDamage";


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
  actionsPerPhase:
  {
    afterMainPhase: (unit) =>
    {
      return [
        takePoisonDamage(unit),
      ];
    },
  },
};
