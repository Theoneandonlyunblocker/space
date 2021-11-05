import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";
import { localize } from "modules/drones/localization/localize";
import { localizeMessage } from "modules/drones/localization/localize";


export const mergeBuff: CombatEffectTemplate =
{
  key: "mergeBuff",
  getDisplayName: strength =>
  {
    return localize("merge_effect_displayName").toString();
  getDescription: strength =>
  {
    return localizeMessage("merge_effect_description").format(strength);
  },
  isActive: (strength) => strength > 0,
  limit:
  {
    min: 0,
    max: Infinity,
  },
  roundingFN: Math.round,
  getAttributeAdjustments: strength =>
  {
    return {
      attack: {flat: strength},
      defence: {flat: strength},
      intelligence: {flat: strength},
      speed: {flat: strength},
    };
  },
};
