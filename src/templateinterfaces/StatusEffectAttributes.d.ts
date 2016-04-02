import StatusEffectAttributeAdjustment from "./StatusEffectAttributeAdjustment.d.ts";

declare interface StatusEffectAttributes
{
  attack?: StatusEffectAttributeAdjustment;
  defence?: StatusEffectAttributeAdjustment;
  intelligence?: StatusEffectAttributeAdjustment;
  speed?: StatusEffectAttributeAdjustment;
}

export default StatusEffectAttributes;
