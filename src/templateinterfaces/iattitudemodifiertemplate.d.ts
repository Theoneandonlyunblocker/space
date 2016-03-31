declare namespace Rance
{
  namespace Templates
  {
    interface IAttitudeModifierTemplate
    {
      type: string;
      displayName: string;
      family: AttitudeModifierFamily;
      duration: number; // -1 === infinite;
      
      // if these modifiers are present and one of them has either
      // stronger effect or opposite sign (+-), don't count this modifier
      canBeOverriddenBy?: IAttitudeModifierTemplate[];
      
      triggers?: string[];
      startCondition?: (evaluation: IDiplomacyEvaluation) => boolean;
      // if endCondition is not defined and duration is infinite, the opposite of startCondition is used
      // to determine when to end modifier
      endCondition?: (evaluation: IDiplomacyEvaluation) => boolean;
      
      constantEffect?: number;
      getEffectFromEvaluation?: (evaluation: IDiplomacyEvaluation) => number;
      
      
      
      canOverride?: IAttitudeModifierTemplate[]; // set dynamically
    }
  }
}
