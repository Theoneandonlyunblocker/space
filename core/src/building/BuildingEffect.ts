import
{
  getBaseAdjustment,
  FlatAndMultiplierAdjustment,
} from "../generic/FlatAndMultiplierAdjustment";


export interface BuildingEffect
{
  vision: FlatAndMultiplierAdjustment;
  detection: FlatAndMultiplierAdjustment;

  /**
   * amount of local resources extracted
   */
  mining: FlatAndMultiplierAdjustment;
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
    mining: getBaseAdjustment(),
    researchPoints: getBaseAdjustment(),
  });
}
