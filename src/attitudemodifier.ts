/// <reference path="../data/templates/attitudemodifiers.ts" />

module Rance
{
  export class AttitudeModifier
  {
    template: Templates.IAttitudeModifierTemplate;
    startTurn: number;
    endTurn: number;
    currentTurn: number;
    strength: number;
    isOverRidden: boolean = false;

    constructor(props:
    {
      template: Templates.IAttitudeModifierTemplate;
      startTurn: number;
      endTurn?: number;
      strength?: number;
    })
    {
      this.template = props.template;
      this.startTurn = props.startTurn;
      this.currentTurn = this.startTurn;

      if (isFinite(props.endTurn))
      {
        this.endTurn = props.endTurn;
      }
      else if (isFinite(this.template.duration))
      {
        if (this.template.duration < 0)
        {
          this.endTurn = -1;
        }
        else
        {
          this.endTurn = this.startTurn + this.template.duration;
        }
      }
      else
      {
        throw new Error("Attitude modifier has no duration or end turn set");
      }

      if (isFinite(this.template.constantEffect))
      {
        this.strength = this.template.constantEffect;
      }
      else
      {
        this.strength = props.strength;
      }

    }

    setStrength(evaluation: IDiplomacyEvaluation)
    {
      if (this.template.constantEffect)
      {
        this.strength = this.template.constantEffect;
      }
      else if (this.template.getEffectFromEvaluation)
      {
        this.strength = this.template.getEffectFromEvaluation(evaluation);
      }
      else
      {
        throw new Error("Attitude modifier has no constant effect " +
          "or effect from evaluation defined");
      }

      return this.strength;
    }

    getFreshness(currentTurn: number = this.currentTurn)
    {
      if (this.endTurn < 0) return 1;
      else
      {
        return 1 - getRelativeValue(currentTurn, this.startTurn, this.endTurn);
      }
    }
    getAdjustedStrength(currentTurn: number = this.currentTurn)
    {
      var freshenss = this.getFreshness(currentTurn);

      return Math.round(this.strength * freshenss);
    }
    hasExpired(currentTurn: number = this.currentTurn)
    {
      return (this.endTurn >= 0 && currentTurn > this.endTurn);
    }
    shouldEnd(evaluation: IDiplomacyEvaluation)
    {
      if (this.hasExpired(evaluation.currentTurn))
      {
        return true;
      }
      else if (this.template.endCondition)
      {
        return this.template.endCondition(evaluation);
      }
      else if (this.template.startCondition)
      {
        return !this.template.startCondition(evaluation);
      }
      else
      {
        return false
      }
    }

    serialize()
    {
      var data: any = {};

      data.templateType = this.template.type;
      data.startTurn = this.startTurn;
      data.endTurn = this.endTurn;
      data.strength = this.strength;

      return data;
    }
  }
}
