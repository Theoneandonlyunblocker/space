import StatusEffectTemplate from "./templateinterfaces/StatusEffectTemplate";
import {StatusEffectSaveData} from "./savedata/StatusEffectSaveData";

import app from "./App"; // TODO global
import idGenerators from "./idGenerators";

export default class StatusEffect
{
  public id: number;
  public template: StatusEffectTemplate;
  public duration: number; // -1 === infinite
  // incremented after status effect actions are called
  public turnsHasBeenActiveFor: number = 0;

  constructor(template: StatusEffectTemplate, duration: number, id?: number)
  {
    this.id = isFinite(id) ? id : idGenerators.statusEffect++;
    this.template = template;
    this.duration = duration;
  }
  public static fromData(data: StatusEffectSaveData): StatusEffect
  {
    const effect = new StatusEffect(
      app.moduleData.Templates.StatusEffects[data.templateType],
      data.duration,
      data.id,
    );

    effect.turnsHasBeenActiveFor = data.turnsHasBeenActiveFor;

    return effect;
  }

  public processTurnEnd(): void
  {
    this.turnsHasBeenActiveFor++;
    if (this.duration > 0)
    {
      this.duration--;
    }
  }
  public serialize(): StatusEffectSaveData
  {
    return(
    {
      id: this.id,
      templateType: this.template.type,
      duration: this.duration,
      turnsHasBeenActiveFor: this.turnsHasBeenActiveFor,
    });
  }
}
