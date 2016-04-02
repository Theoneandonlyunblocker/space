import StatusEffectTemplate from "./templateinterfaces/StatusEffectTemplate.d.ts";

export default class StatusEffect
{
  template: StatusEffectTemplate;
  duration: number; // -1 === infinite

  constructor(template: StatusEffectTemplate, duration: number)
  {
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
