/// <reference path="../data/templates/statuseffects.ts" />

module Rance
{
  
  export class StatusEffect
  {
    template: Templates.IStatusEffectTemplate;
    duration: number; // -1 === infinite

    // effects that trigger at start of battle
    // effects that trigger when using an ability
    // effects that trigger when targeted
    // effects that trigger at start of turn
    // effects that trigger at end of turn

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
