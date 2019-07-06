import {BuildingTemplate} from "./BuildingTemplate";
import {Color} from "../Color";

export interface TerritoryBuildingTemplate extends BuildingTemplate
{
  isTerritoryBuilding: true;

  getIconElement: (mainColor: Color) => HTMLElement | SVGElement;
}
