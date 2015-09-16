/// <reference path="../../src/templateinterfaces/iattitudemodifiertemplate.d.ts"/>
module Rance
{
  export interface IDiplomacyEvaluation
  {
    currentTurn: number;
    currentStatus: DiplomaticState;
    neighborStars: number;
    opinion: number;
  }
  export module Modules
  {
    export module DefaultModule
    {
      export module Templates
      {
        export enum AttitudeModifierFamily
        {
          geographic,
          history,
          current
        }

        export module AttitudeModifiers
        {
          export var neighborStars: Rance.Templates.IAttitudeModifierTemplate =
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

          export var atWar: Rance.Templates.IAttitudeModifierTemplate =
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

          export var declaredWar: Rance.Templates.IAttitudeModifierTemplate =
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
  }
}
