import
{
  getBaseAdjustment,
  FlatAndMultiplierAdjustment,
} from "./FlatAndMultiplierAdjustment";


export interface BuildingEffect
{
  vision: FlatAndMultiplierAdjustment;
  detection: FlatAndMultiplierAdjustment;
  // TODO 2018.06.06 | can't we do a more generic way of handling income?
  // so exact same system is used for different resources
  income: FlatAndMultiplierAdjustment;
  resourceIncome: FlatAndMultiplierAdjustment;
  researchPoints: FlatAndMultiplierAdjustment;
}
export type PartialBuildingEffect =
{
  [K in keyof BuildingEffect]?: Partial<BuildingEffect[K]>;
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
