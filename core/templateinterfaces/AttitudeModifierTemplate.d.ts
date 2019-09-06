import {DiplomacyEvaluation} from "../diplomacy/DiplomacyEvaluation";

export interface AttitudeModifierTemplate
{
  type: string;
  displayName: string;
  duration: number;

  // if these modifiers are present and one of them has either
  // stronger effect or opposite sign (+-), don't count this modifier
  // unused
  canBeOverriddenBy?: AttitudeModifierTemplate[];

  startCondition?: (evaluation: DiplomacyEvaluation) => boolean;
  // if endCondition is not defined and duration is infinite, modifier will be removed once startcondition no longer applies
  endCondition?: (evaluation: DiplomacyEvaluation) => boolean;

  baseEffect?: number;
  getEffectFromEvaluation?: (evaluation: DiplomacyEvaluation) => number;
  decayRate?: number;
}
