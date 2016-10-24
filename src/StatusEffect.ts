import StatusEffectTemplate from "./templateinterfaces/StatusEffectTemplate";
import idGenerators from "./idGenerators";

export default class StatusEffect
{
  public id: number;
  public template: StatusEffectTemplate;
  public duration: number; // -1 === infinite

  constructor(template: StatusEffectTemplate, duration: number, id?: number)
  {
    this.id = isFinite(id) ? id : idGenerators.statusEffect++;
    this.template = template;
    this.duration = duration;
  }
  processTurnEnd()
  {
    if (this.duration > 0)
    {
      this.duration--;
    }
  }
  clone()
  {
    return new StatusEffect(this.template, this.duration);
  }
}
