module Rance
{
  export module Templates
  {
    export interface IDiplomacyEvaluation
    {
      neighborStars: number;
      opinion: number;
    }
    export enum AttitudeModifierFamily
    {
      geographic,
      history,
      current
    }
    export interface IAttitudeModifierTemplate
    {
      type: string;
      family: AttitudeModifierFamily;
      duration: number; // -1 === infinite;

      // if these modifiers are present and one of them has either
      // stronger effect or opposite sign (+-), don't count this modifier
      canBeOverriddenBy?: IAttitudeModifierTemplate[];

      triggeredOnly?: boolean;
      startCondition?: (evaluation: IDiplomacyEvaluation) => boolean;
      // if endCondition is not defined, the opposite of startCondition is used
      // to determine when to end modifier
      endCondition?: (evaluation: IDiplomacyEvaluation) => boolean;

      constantEffect?: number;
      getEffectFromEvaluation?: (evaluation: IDiplomacyEvaluation) => number;
    }

    export module AttitudeModifiers
    {
      export var neighborStars: IAttitudeModifierTemplate =
      {
        type: "neighborStars",
        family: AttitudeModifierFamily.geographic,
        duration: -1,

        startCondition: function(evaluation: IDiplomacyEvaluation)
        {
          return (evaluation.neighborStars >= 2 && evaluation.opinion < 50);
        },
        
        getEffectFromEvaluation: function(evaluation: IDiplomacyEvaluation)
        {
          return -evaluation.neighborStars;
        }
      }

      export var atWar: IAttitudeModifierTemplate =
      {
        type: "atWar",
        family: AttitudeModifierFamily.current,
        duration: -1,

        triggeredOnly: true,

        constantEffect: -50
      }

      export var declaredWar: IAttitudeModifierTemplate =
      {
        type: "declaredWar",
        family: AttitudeModifierFamily.history,
        duration: 15,

        triggeredOnly: true,

        constantEffect: -35
      }
    }
  }
}
