module Rance
{
  export module Templates
  {
    export enum AttitudeModifierConditionTypes
    {
      neighborStars,
      opinion
    }
    export interface IAttitudeModifierStartCondition
    {
      type: AttitudeModifierConditionTypes;
      value: number;
    }
    export interface IDiplomacyMapEvaluation
    {
      neighborStars: number;
    }
    export interface IAttitudeModifierTemplate
    {
      type: string;

      triggeredOnly?: boolean;

      // condition evaluates to true if provided value >= condition.value
      startConditions?:
      {
        and?: IAttitudeModifierStartCondition[]; // all must be true
        or?: IAttitudeModifierStartCondition[]; // one must be true
        not?: IAttitudeModifierStartCondition[]; // none must be true
      }

      duration: number; // -1 === infinite;

      constantEffect?: number;
      getEffectFromMapEvaluation?: (evaluation: IDiplomacyMapEvaluation) => number;
    }

    export module AttitudeModifiers
    {
      export var neighborStars: IAttitudeModifierTemplate
      {
        type: "neighborStars",

        startConditions:
        {
          and: [{type: neighborStars, value: 2}],
          not: [{type: opinion, value: 50}]
        },

        duration: -1,

        getEffectFromMapEvaluation: function(evaluation: IDiplomacyMapEvaluation)
        {
          return -evaluation.neighborStars;
        }
      }
    }
  }
}
