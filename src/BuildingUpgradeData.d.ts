import {Building} from "./Building";
import {BuildingTemplate} from "./templateinterfaces/BuildingTemplate";

declare interface BuildingUpgradeData<T extends BuildingTemplate = BuildingTemplate>
{
  template: T;
  level: number;
  cost: number;
  parentBuilding: Building;
}

export default BuildingUpgradeData;
