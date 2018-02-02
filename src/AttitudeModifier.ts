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
  private hasFixedStrength: boolean = false;

  constructor(props:
  {
    template: AttitudeModifierTemplate;
    startTurn: number;
    endTurn?: number;
    strength?: number;
    hasFixedStrength?: boolean;
    evaluation?: DiplomacyEvaluation,
  })
  {
    this.template = props.template;
    this.startTurn = props.startTurn;
    this.currentTurn = this.startTurn;
    this.hasFixedStrength = props.hasFixedStrength;

    if (props.endTurn !== undefined)
    {
      this.endTurn = props.endTurn;
    }
    else
    {
      this.endTurn = this.startTurn + this.template.duration;
    }

    if (props.strength !== undefined)
    {
      this.strength = props.strength;
    }
    else if (this.template.baseEffect !== undefined)
    {
      this.strength = this.template.baseEffect;
    }
    else if (props.evaluation && this.template.getEffectFromEvaluation)
    {
      this.setStrength(props.evaluation);
    }
    else
    {
      throw new Error(`Attitude modifier ${this.template.type} couldn't initialize with a strength value.`);
    }
  }

  public update(evaluation: DiplomacyEvaluation)
  {
    this.currentTurn = evaluation.currentTurn;

    if (!this.hasFixedStrength)
    {
      this.setStrength(evaluation);
    }
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
      hasFixedStrength: this.hasFixedStrength,
    };

    return data;
  }

  private setStrength(evaluation: DiplomacyEvaluation)
  {
    if (this.template.baseEffect)
    {
      this.strength = this.template.baseEffect;
    }
    else if (this.template.getEffectFromEvaluation)
    {
      this.strength = this.template.getEffectFromEvaluation(evaluation);
    }
    else
    {
      throw new Error(`Attitude modifier ${this.template.type} has no constant effect ` +
        "or effect from evaluation defined");
    }

    return this.strength;
  }
  private getFreshness(currentTurn: number = this.currentTurn)
  {
    if (!isFinite(this.endTurn))
    {
      return 1;
    }
    else
    {
      if (!isFinite(this.template.decayRate))
      {
        throw new Error(`Attitude modifier ${this.template.type} has finite duration but no decayRate set.`);
      }
      else
      {
        const base = 1 - getRelativeValue(currentTurn, this.startTurn, this.endTurn);

        return Math.pow(base, this.template.decayRate);
      }
    }
  }
  private hasExpired(currentTurn: number = this.currentTurn)
  {
    return (this.endTurn >= 0 && currentTurn > this.endTurn);
  }
}
