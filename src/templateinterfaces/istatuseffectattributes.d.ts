declare module Rance
{
  module Templates
  {
    interface IStatusEffectAttributes
    {
      attack?: IStatusEffectAttributeAdjustment;
      defence?: IStatusEffectAttributeAdjustment;
      intelligence?: IStatusEffectAttributeAdjustment;
      speed?: IStatusEffectAttributeAdjustment;
    }
  }
}
