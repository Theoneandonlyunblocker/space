import StatusEffectAttributeAdjustment from "./StatusEffectAttributeAdjustment";

declare interface StatusEffectAttributes
{
  attack?: StatusEffectAttributeAdjustment;
  defence?: StatusEffectAttributeAdjustment;
  intelligence?: StatusEffectAttributeAdjustment;
  speed?: StatusEffectAttributeAdjustment;
}

export default StatusEffectAttributes;
