import DiplomacyEvaluation from "../DiplomacyEvaluation";

declare interface AttitudeModifierTemplate
{
  type: string;
  displayName: string;
  duration: number;

  // if these modifiers are present and one of them has either
  // stronger effect or opposite sign (+-), don't count this modifier
  // TODO 2017.12.19 | unused
  canBeOverriddenBy?: AttitudeModifierTemplate[];

  startCondition?: (evaluation: DiplomacyEvaluation) => boolean;
  // if endCondition is not defined and duration is infinite, the opposite of startCondition is used
  // to determine when to end modifier
  endCondition?: (evaluation: DiplomacyEvaluation) => boolean;

  baseEffect?: number;
  getEffectFromEvaluation?: (evaluation: DiplomacyEvaluation) => number;
  decayRate?: number;


  canOverride?: AttitudeModifierTemplate[]; // set dynamically
}

export default AttitudeModifierTemplate;
