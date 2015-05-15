module Rance
{
  export interface IDiplomacyEvaluation
  {
    currentTurn: number;
    currentStatus: DiplomaticState;
    neighborStars: number;
    opinion: number;
  }
  export module Templates
  {
    export enum AttitudeModifierFamily
    {
      geographic,
      history,
      current
    }
    export interface IAttitudeModifierTemplate
    {
      type: string;
      displayName: string;
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
      
      

      canOverride?: IAttitudeModifierTemplate[]; // set dynamically
    }

    export module AttitudeModifiers
    {
      export var neighborStars: IAttitudeModifierTemplate =
      {
        type: "neighborStars",
        displayName: "neighborStars",
        family: AttitudeModifierFamily.geographic,
        duration: -1,

        startCondition: function(evaluation: IDiplomacyEvaluation)
        {
          return (evaluation.neighborStars >= 2 && evaluation.opinion < 50);
        },
        
        getEffectFromEvaluation: function(evaluation: IDiplomacyEvaluation)
        {
          return -2 * evaluation.neighborStars;
        }
      }

      export var atWar: IAttitudeModifierTemplate =
      {
        type: "atWar",
        displayName: "At war",
        family: AttitudeModifierFamily.current,
        duration: -1,

        startCondition: function(evaluation: IDiplomacyEvaluation)
        {
          return (evaluation.currentStatus >= DiplomaticState.war)
        },

        constantEffect: -30
      }

      export var declaredWar: IAttitudeModifierTemplate =
      {
        type: "declaredWar",
        displayName: "Declared war",
        family: AttitudeModifierFamily.history,
        duration: 15,

        startCondition: function(evaluation: IDiplomacyEvaluation)
        {
          return (evaluation.currentStatus >= DiplomaticState.war)
        },

        constantEffect: -35
      }
    }
  }
}
