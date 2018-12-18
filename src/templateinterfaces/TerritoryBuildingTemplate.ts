import {BuildingTemplate} from "./BuildingTemplate";
import Color from "../Color";

export interface TerritoryBuildingTemplate extends BuildingTemplate
{
  isTerritoryBuilding: true;

  createIconElement(mainColor: Color): Node;
}
