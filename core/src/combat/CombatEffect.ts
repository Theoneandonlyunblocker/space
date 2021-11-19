import {idGenerators} from "../app/idGenerators";
import { CorePhase } from "./core/coreCombatPhases";
import { clamp } from "../generic/utility";
import { CombatEffectTemplate } from "./CombatEffectTemplate";
import { CombatEffectSaveData } from "./CombatEffectSaveData";
import { TemplateCollection } from "../generic/TemplateCollection";


export class CombatEffect<Phase extends string = CorePhase>
{
  public readonly id: number;
  public readonly template: CombatEffectTemplate<Phase>;
  public get description(): string
  {
    return this.template.getDescription(this.strength);
  }
  public get strength(): number
  {
    return this._strength;
  }
  public set strength(rawStrength: number)
  {
    let strength = rawStrength;

    const roundingFN = this.template.roundingFN || Math.round;
    strength = roundingFN(strength);

    if (this.template.limit)
    {
      strength = clamp(strength, this.template.limit.min, this.template.limit.max);
    }

    this._strength = strength;
  }
  private _strength: number;


  constructor(props:
  {
    id?: number;
    template: CombatEffectTemplate<Phase>;
    initialStrength: number;
  })
  {
    this.id = isFinite(props.id) ? props.id : idGenerators.combatEffect++;
    this.template = props.template;
    this.strength = props.initialStrength;
  }
  public static fromData(
    data: CombatEffectSaveData,
    templates: TemplateCollection<CombatEffectTemplate>,
  ): CombatEffect
  {
    return new CombatEffect({
      id: data.id,
      template: templates.get(data.template),
      initialStrength: data.strength,
    });
  }

  public clone(): CombatEffect<Phase>
  {
    const cloned = new CombatEffect(
    {
      id: this.id,
      template: this.template,
      initialStrength: this.strength,
    });

    return cloned;
  }
  public serialize(): CombatEffectSaveData
  {
    return {
      id: this.id,
      template: this.template.key,
      strength: this.strength,
    };
  }
}
