import * as otherBuildings from "../../defaultbuildings/templates/otherBuildings";
import * as territoryBuildings from "../../defaultbuildings/templates/territoryBuildings";
import { BuildingTemplate } from "../../../src/templateinterfaces/BuildingTemplate";

export function getDefaultBuildableBuildings(): BuildingTemplate[]
{
  return [
    territoryBuildings.sectorCommand,
    territoryBuildings.starBase,

    otherBuildings.commercialPort,
    otherBuildings.deepSpaceRadar,
    otherBuildings.reserachLab,
    otherBuildings.resourceMine,
  ];
}
