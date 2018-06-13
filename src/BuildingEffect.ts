import
{
  getBaseAdjustment,
  FlatAndMultiplierAdjustment,
} from "./FlatAndMultiplierAdjustment";


export interface BuildingEffect
{
  vision?: FlatAndMultiplierAdjustment;
  detection?: FlatAndMultiplierAdjustment;
  // TODO 2018.06.06 | can't all income be handled together somehow?
  income?: FlatAndMultiplierAdjustment;
  resourceIncome?: FlatAndMultiplierAdjustment;
  researchPoints?: FlatAndMultiplierAdjustment;
}

export function getBaseBuildingEffect(): BuildingEffect
{
  return(
  {
    vision: getBaseAdjustment(),
    detection: getBaseAdjustment(),
    income: getBaseAdjustment(),
    resourceIncome: getBaseAdjustment(),
    researchPoints: getBaseAdjustment(),
  });
}
