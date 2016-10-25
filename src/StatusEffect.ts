import StatusEffectTemplate from "./templateinterfaces/StatusEffectTemplate";
import {StatusEffectSaveData} from "./savedata/StatusEffectSaveData";

import idGenerators from "./idGenerators";

export default class StatusEffect
{
  public id: number;
  public template: StatusEffectTemplate;
  // incremented after status effect actions are called
  public turnsHasBeenActiveFor: number = 0;
  public turnsToStayActiveFor: number;

  constructor(props:
  {
    template: StatusEffectTemplate;
    id?: number;
    turnsToStayActiveFor: number;
  })
  {
    this.id = isFinite(props.id) ? props.id : idGenerators.statusEffect++;
    this.template = props.template;
    this.turnsToStayActiveFor = props.turnsToStayActiveFor;
  }

  public clone(): StatusEffect
  {
    const effect = new StatusEffect(
    {
      template: this.template,
      turnsToStayActiveFor: this.turnsToStayActiveFor,
      id: this.id,
      sourceUnit: this.sourceUnit,
    });

    effect.turnsHasBeenActiveFor = this.turnsHasBeenActiveFor;

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
