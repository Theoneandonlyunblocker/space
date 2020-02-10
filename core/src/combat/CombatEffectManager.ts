import { CombatEffect } from "./CombatEffect";
import { CorePhase } from "./core/coreCombatPhases";
import { CombatEffectTemplate } from "./CombatEffectTemplate";
import { CombatEffectManagerSaveData } from "./CombatEffectManagerSaveData";
import { TemplateCollection } from "../templateinterfaces/TemplateCollection";
import { UnitAttributeAdjustments } from "../unit/UnitAttributes";


export class CombatEffectManager<Phase extends string = CorePhase>
{
  private readonly effects:
  {
    [key: string]: CombatEffect<Phase>;
  } = {};
  private get allEffects(): CombatEffect<Phase>[]
  {
    return Object.keys(this.effects).map(key => this.effects[key]);
  }

  constructor()
  {

  }
  public static fromData<Phase extends string = CorePhase>(
    data: CombatEffectManagerSaveData,
    effectTemplates: TemplateCollection<CombatEffectTemplate>,
  ): CombatEffectManager<Phase>
  {
    const manager = new CombatEffectManager<Phase>();

    data.effects.forEach(effectSaveData =>
    {
      const effect = CombatEffect.fromData(effectSaveData, effectTemplates);
      manager[effectSaveData.templateKey] = effect;
    });

    return manager;
  }

  public get(template: CombatEffectTemplate<Phase>): CombatEffect<Phase>
  {
    if (!this.effects[template.key])
    {
      this.effects[template.key] = new CombatEffect<Phase>(
      {
        template: template,
        initialStrength: 0,
      });
    }

    return this.effects[template.key];
  }
  public getAttributeAdjustments(): UnitAttributeAdjustments[]
  {
    return this.allEffects.filter(effect =>
    {
      return Boolean(effect.template.getAttributeAdjustments);
    }).map(effect =>
    {
      return effect.template.getAttributeAdjustments(effect.strength);
    });
  }
  public clone(): CombatEffectManager<Phase>
  {
    const cloned = new CombatEffectManager<Phase>();

    for (const key in this.effects)
    {
      cloned.effects[key] = this.effects[key].clone();
    }

    return cloned;
  }
  public serialize(): CombatEffectManagerSaveData
  {
    return {
      effects: Object.keys(this.effects).map(key =>
      {
        return this.effects[key].serialize();
      }),
    };
  }
}
