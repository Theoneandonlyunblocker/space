import {BuildingTemplate} from "./BuildingTemplate";

export interface TerritoryBuildingTemplate extends BuildingTemplate
{
  isTerritoryBuilding: true;

  iconSrc: string;
}
