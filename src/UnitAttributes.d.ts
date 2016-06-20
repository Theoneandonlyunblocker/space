import FlatAndMultiplierAdjustment from "./FlatAndMultiplierAdjustment";

export declare interface PartialUnitAttributes
{
  maxActionPoints?: number;
  attack?: number;
  defence?: number;
  intelligence?: number;
  speed?: number;
}

export declare interface UnitAttributeAdjustments
{
  attack?: FlatAndMultiplierAdjustment;
  defence?: FlatAndMultiplierAdjustment;
  intelligence?: FlatAndMultiplierAdjustment;
  speed?: FlatAndMultiplierAdjustment;
}

declare interface UnitAttributes
{
  maxActionPoints: number;
  attack: number;
  defence: number;
  intelligence: number;
  speed: number;
}

export default UnitAttributes;
