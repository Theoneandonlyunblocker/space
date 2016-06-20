import FlatAndMultiplierAdjustment from "../FlatAndMultiplierAdjustment";

declare interface BuildingEffect
{
  vision?: number;
  detection?: number;
  income?: FlatAndMultiplierAdjustment;
  resourceIncome?: FlatAndMultiplierAdjustment;
  research?: FlatAndMultiplierAdjustment;
  itemLevel?: number;
}

export default BuildingEffect;
