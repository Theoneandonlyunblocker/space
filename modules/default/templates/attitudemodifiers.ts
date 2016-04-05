/// <reference path="../../../src/templateinterfaces/iattitudemodifiertemplate.d.ts"/>
export enum AttitudeModifierFamily
{
  geographic,
  history,
  current
}
export var neighborStars: AttitudeModifierTemplate =
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

export var atWar: AttitudeModifierTemplate =
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

export var declaredWar: AttitudeModifierTemplate =
{
  type: "declaredWar",
  displayName: "Declared war",
  family: AttitudeModifierFamily.history,
  duration: 15,
  triggers: ["addDeclaredWarAttitudeModifier"],

  constantEffect: -35
}
