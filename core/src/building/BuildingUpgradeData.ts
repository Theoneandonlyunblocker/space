import {Building} from "./Building";
import {BuildingTemplate} from "../templateinterfaces/BuildingTemplate";
import { Resources } from "../player/PlayerResources";

export interface BuildingUpgradeData<T extends BuildingTemplate = BuildingTemplate>
{
  template: T;
  cost: Resources;
  parentBuilding: Building;
}
