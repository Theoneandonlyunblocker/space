import {Building} from "./Building";
import {BuildingTemplate} from "../templateinterfaces/BuildingTemplate";

export interface BuildingUpgradeData<T extends BuildingTemplate = BuildingTemplate>
{
  template: T;
  cost: number;
  parentBuilding: Building;
}
