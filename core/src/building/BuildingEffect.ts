import
{
  getBaseAdjustment,
  FlatAndMultiplierAdjustment,
} from "../generic/FlatAndMultiplierAdjustment";


export interface BuildingEffect
{
  vision: FlatAndMultiplierAdjustment;
  detection: FlatAndMultiplierAdjustment;
  // TODO 2019.09.27 | unify income & resourceincome
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
