import FlatAndMultiplierAdjustment from "../FlatAndMultiplierAdjustment";

declare interface StatusEffectAttributes
{
  attack?: FlatAndMultiplierAdjustment;
  defence?: FlatAndMultiplierAdjustment;
  intelligence?: FlatAndMultiplierAdjustment;
  speed?: FlatAndMultiplierAdjustment;
}

export default StatusEffectAttributes;
