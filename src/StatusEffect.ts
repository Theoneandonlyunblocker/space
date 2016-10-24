import StatusEffectTemplate from "./templateinterfaces/StatusEffectTemplate";
import {StatusEffectSaveData} from "./savedata/StatusEffectSaveData";

import app from "./App"; // TODO global
import idGenerators from "./idGenerators";

export default class StatusEffect
{
  public id: number;
  public template: StatusEffectTemplate;
  // public duration: number; // -1 === infinite
  // incremented after status effect actions are called
  public turnsHasBeenActiveFor: number = 0;
  public turnsToStayActiveFor: number;

  constructor(template: StatusEffectTemplate, turnsToStayActiveFor: number, id?: number)
  {
    this.id = isFinite(id) ? id : idGenerators.statusEffect++;
    this.template = template;
    this.turnsToStayActiveFor = turnsToStayActiveFor;
  }
  public static fromData(data: StatusEffectSaveData): StatusEffect
  {
    const effect = new StatusEffect(
      app.moduleData.Templates.StatusEffects[data.templateType],
      data.turnsToStayActiveFor,
      data.id,
    );

    effect.turnsHasBeenActiveFor = data.turnsHasBeenActiveFor;

    return effect;
  }

  public processTurnEnd(): void
  {
    this.turnsHasBeenActiveFor++;
  }
  public serialize(): StatusEffectSaveData
  {
    return(
    {
      id: this.id,
      templateType: this.template.type,
      turnsToStayActiveFor: this.turnsToStayActiveFor,
      turnsHasBeenActiveFor: this.turnsHasBeenActiveFor,
    });
  }
}
