/// <reference path="templateinterfaces/istatuseffecttemplate.d.ts" />

namespace Rance
{
  export class StatusEffect
  {
    template: Templates.IStatusEffectTemplate;
    duration: number; // -1 === infinite

    constructor(template: Templates.IStatusEffectTemplate, duration: number)
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
}
