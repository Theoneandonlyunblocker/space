import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";
import { localizeMessage } from "modules/drones/localization/localize";


export const mergeBuff: CombatEffectTemplate =
{
  key: "mergeBuff",
  get displayName()
  {
    return localizeMessage("merge_effect_displayName").toString();
  },
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
