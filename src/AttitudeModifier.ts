import DiplomacyEvaluation from "./DiplomacyEvaluation";
import AttitudeModifierSaveData from "./savedata/AttitudeModifierSaveData";
import AttitudeModifierTemplate from "./templateinterfaces/AttitudeModifierTemplate";
import
{
  getRelativeValue,
} from "./utility";

export class AttitudeModifier
{
  public template: AttitudeModifierTemplate;
  public isOverRidden: boolean = false;
  public endTurn: number;

  private startTurn: number;
  private currentTurn: number;
  private strength: number;

  constructor(props:
  {
    template: AttitudeModifierTemplate;
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

  public updateWithEvaluation(evaluation: DiplomacyEvaluation)
  {
    this.currentTurn = evaluation.currentTurn;
    this.setStrength(evaluation);
  }
  public refresh(newModifier: AttitudeModifier)
  {
    this.startTurn = newModifier.startTurn;
    this.endTurn = newModifier.endTurn;
    this.strength = newModifier.strength;
  }
  public getAdjustedStrength(currentTurn: number = this.currentTurn)
  {
    const freshenss = this.getFreshness(currentTurn);

    return Math.round(this.strength * freshenss);
  }
  public shouldEnd(evaluation: DiplomacyEvaluation)
  {
    if (this.hasExpired(evaluation.currentTurn))
    {
      return true;
    }
    else if (this.template.endCondition)
    {
      return this.template.endCondition(evaluation);
    }
    else if (this.template.duration < 0 && this.template.startCondition)
    {
      return !this.template.startCondition(evaluation);
    }
    else
    {
      return false;
    }
  }
  public serialize(): AttitudeModifierSaveData
  {
    const data: AttitudeModifierSaveData =
    {
      templateType: this.template.type,
      startTurn: this.startTurn,
      endTurn: this.endTurn,
      strength: this.strength,
    };

    return data;
  }

  private setStrength(evaluation: DiplomacyEvaluation)
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
  private getFreshness(currentTurn: number = this.currentTurn)
  {
    if (this.endTurn < 0) return 1;
    else
    {
      return 1 - getRelativeValue(currentTurn, this.startTurn, this.endTurn);
    }
  }
  private hasExpired(currentTurn: number = this.currentTurn)
  {
    return (this.endTurn >= 0 && currentTurn > this.endTurn);
  }
}
