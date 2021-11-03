import { CombatEffect } from "./CombatEffect";
import { CorePhase } from "./core/coreCombatPhases";
import { CombatEffectTemplate } from "./CombatEffectTemplate";
import { CombatEffectMapSaveData } from "./CombatEffectMapSaveData";
import { TemplateCollection } from "../generic/TemplateCollection";
import { UnitAttributeAdjustments } from "../unit/UnitAttributes";


export class CombatEffectMap<Phase extends string = CorePhase>
{
  private readonly effects:
  {
    [key: string]: CombatEffect<Phase>;
  } = {};

  constructor()
  {

  }
  public static fromData<Phase extends string = CorePhase>(
    data: CombatEffectMapSaveData,
    effectTemplates: TemplateCollection<CombatEffectTemplate>,
  ): CombatEffectMap<Phase>
  {
    const map = new CombatEffectMap<Phase>();

    data.effects.forEach(effectSaveData =>
    {
      const effect = CombatEffect.fromData(effectSaveData, effectTemplates);
      map[effectSaveData.templateKey] = effect;
    });

    return map;
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
  public getAllActiveEffects(): CombatEffect<Phase>[]
  {
    return this.filter(effect => effect.template.isActive(effect.strength));
  }
  public getAttributeAdjustments(): UnitAttributeAdjustments[]
  {
    return this.getAll().filter(effect =>
    {
      return Boolean(effect.template.getAttributeAdjustments);
    }).map(effect =>
    {
      return effect.template.getAttributeAdjustments(effect.strength);
    });
  }
  public clone(): CombatEffectMap<Phase>
  {
    const cloned = new CombatEffectMap<Phase>();

    for (const key in this.effects)
    {
      cloned.effects[key] = this.effects[key].clone();
    }

    return cloned;
  }
  public serialize(): CombatEffectMapSaveData
  {
    return {
      effects: Object.keys(this.effects).map(key =>
      {
        return this.effects[key].serialize();
      }),
    };
  }

  private getAll(): CombatEffect<Phase>[]
  {
    return Object.keys(this.effects).map(key => this.effects[key]);
  }
  private filter(filterFn: (effect: CombatEffect<Phase>) => boolean): CombatEffect<Phase>[]
  {
    return this.getAll().filter(filterFn);
  }
}
