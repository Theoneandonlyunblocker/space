module Rance
{
  export interface IStatusEffectAttributeAdjustment
  {
    flat?: number;
    multiplier?: number;
  }
  export interface IStatusEffectAttributes
  {
    attack?: IStatusEffectAttributeAdjustment;
    defence?: IStatusEffectAttributeAdjustment;
    intelligence?: IStatusEffectAttributeAdjustment;
    speed?: IStatusEffectAttributeAdjustment;
  }
  export class StatusEffect
  {
    attributes: IStatusEffectAttributes;

    duration: number; // -1 === infinite

    // effects that trigger at start of battle
    // effects that trigger when using an ability
    // effects that trigger when targeted
    // effects that trigger at start of turn
    // effects that trigger at end of turn

    constructor(attributes: IStatusEffectAttributes, duration: number)
    {
      this.attributes = attributes;
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
      return new StatusEffect(this.attributes, this.duration);
    }
  }
}
