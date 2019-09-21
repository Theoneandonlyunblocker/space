import * as otherBuildings from "modules/space/src/buildings/templates/otherBuildings";
import * as territoryBuildings from "modules/space/src/buildings/templates/territoryBuildings";
import { BuildingTemplate } from "core/src/templateinterfaces/BuildingTemplate";

export function getDefaultBuildableBuildings(): BuildingTemplate[]
{
  return [
    territoryBuildings.sectorCommand,
    territoryBuildings.starBase,

    // otherBuildings.commercialPort,
    otherBuildings.deepSpaceRadar,
    // otherBuildings.reserachLab,
    otherBuildings.resourceMine,
    otherBuildings.thePyramids,
    otherBuildings.nationalEpic,
  ];
}
