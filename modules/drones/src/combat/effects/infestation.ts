import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";
import { localizeMessage } from "modules/drones/localization/localize";
import { losePercentCurrentHealth } from "modules/baselib/src/combat/actions/losePercentCurrentHealth";
import { increaseInfestationAmount } from "../actions/increaseInfestationAmount";
import { combatEffectFlags } from "modules/baselib/src/combat/combatEffectFlags";
import { afterMainPhase } from "core/src/combat/core/phases/afterMainPhase";


export function getPercentageHealthLostForInfestationLevel(strength: number): number
{
  // 0.1, 0.2, 0.4, 0.8
  return 0.1 * Math.pow(2, strength - 1);
}

export const infestation: CombatEffectTemplate =
{
  key: "infestation",
  get displayName()
  {
    // TODO 2021.11.05 | rename
    return localizeMessage("infest_effect_displayName").toString();
  },
  getDescription: strength =>
  {
    const percentageLost = getPercentageHealthLostForInfestationLevel(strength);

    return localizeMessage("infest_effect_description").format(percentageLost);
  },
  isActive: (strength) => strength > 0,
  flags: new Set([combatEffectFlags.negative]),
  limit:
  {
    min: 0,
    max: 4,
  },
  actionFetchers:
  [
    {
      key: "applyInfestation",
      phasesToApplyTo: new Set([afterMainPhase]),
      fetch: (battle, unit) =>
      {
        const strength = unit.battleStats.combatEffects.get(infestation).strength;
        const percentCurrentHealthRemoved = getPercentageHealthLostForInfestationLevel(strength);

        return [
          losePercentCurrentHealth(unit, unit, percentCurrentHealthRemoved),
          increaseInfestationAmount(unit, unit, {flat: 1}),
        ];
      },
    },
  ],
};
