import {idGenerators} from "../app/idGenerators";
import { CorePhase } from "./core/coreCombatPhases";
import { clamp } from "../generic/utility";
import { CombatEffectTemplate } from "./CombatEffectTemplate";
import { CombatEffectSaveData } from "./CombatEffectSaveData";
import { TemplateCollection } from "../templateinterfaces/TemplateCollection";


export class CombatEffect<Phase extends string = CorePhase>
{
  public readonly id: number;
  public readonly template: CombatEffectTemplate<Phase>;
  public get strength(): number
  {
    return this._strength;
  }
  public set strength(rawStrength: number)
  {
    let strength = rawStrength;

    if (this.template.roundingFN)
    {
      strength = this.template.roundingFN(strength);
    }
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
    this.id = isFinite(props.id) ? props.id : idGenerators.statusEffect++;
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
      template: templates[data.templateKey],
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
      templateKey: this.template.key,
      strength: this.strength,
    };
  }
}
