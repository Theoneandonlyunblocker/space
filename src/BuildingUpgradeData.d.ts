import Building from "./Building";
import BuildingTemplate from "./templateinterfaces/BuildingTemplate";

declare interface BuildingUpgradeData
{
  template: BuildingTemplate;
  level: number;
  cost: number;
  parentBuilding: Building;
}

export default BuildingUpgradeData;
