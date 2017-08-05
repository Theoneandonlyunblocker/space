import DiplomacyEvaluation from "../DiplomacyEvaluation";

declare interface AttitudeModifierTemplate
{
  type: string;
  displayName: string;
  family: string;
  duration: number;

  // if these modifiers are present and one of them has either
  // stronger effect or opposite sign (+-), don't count this modifier
  canBeOverriddenBy?: AttitudeModifierTemplate[];

  triggers?: string[];
  startCondition?: (evaluation: DiplomacyEvaluation) => boolean;
  // if endCondition is not defined and duration is infinite, the opposite of startCondition is used
  // to determine when to end modifier
  endCondition?: (evaluation: DiplomacyEvaluation) => boolean;

  constantEffect?: number;
  getEffectFromEvaluation?: (evaluation: DiplomacyEvaluation) => number;



  canOverride?: AttitudeModifierTemplate[]; // set dynamically
}

export default AttitudeModifierTemplate;
