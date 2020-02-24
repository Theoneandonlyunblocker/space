import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";
import { localize } from "modules/drones/localization/localize";
import { losePercentCurrentHealth } from "modules/common/src/combat/actions/losePercentCurrentHealth";
import { increaseInfestationAmount } from "../actions/increaseInfestationAmount";
import { combatEffectFlags } from "modules/common/src/combat/combatEffectFlags";

export const infestation: CombatEffectTemplate =
{
  key: "infestation",
  getDisplayName: strength =>
  {
    return localize("infest_effect_displayName").toString();
  },
  getDescription: strength =>
  {
    return localize("infest_effect_description").toString();
  },
  flags: new Set([combatEffectFlags.negative]),
  limit:
  {
    min: 0,
    max: 4,
  },
  actionsPerPhase:
  {
    afterMainPhase: (unit) =>
    {
      const severity = unit.battleStats.combatEffects.get(infestation).strength;
      // 0.1, 0.2, 0.4, 0.8
      const percentCurrentHealthRemoved = 0.1 * Math.pow(2, severity - 1);

      return [
        losePercentCurrentHealth(unit, unit, percentCurrentHealthRemoved),
        increaseInfestationAmount(unit, unit, {flat: 1}),
      ];
    },
  },
};
