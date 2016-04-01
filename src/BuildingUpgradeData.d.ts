import Building from "./Building.ts";
import BuildingTemplate from "./templateinterfaces/BuildingTemplate.d.ts";

declare interface BuildingUpgradeData
{
  template: BuildingTemplate;
  level: number;
  cost: number;
  parentBuilding: Building;
}

export default BuildingUpgradeData;
