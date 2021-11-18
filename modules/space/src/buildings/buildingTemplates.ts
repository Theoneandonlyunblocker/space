import * as otherBuildings from "./templates/otherBuildings";
import * as territoryBuildings from "./templates/territoryBuildings";


export const buildingTemplates =
{
  [territoryBuildings.sectorCommand.key]: territoryBuildings.sectorCommand,
  [territoryBuildings.sectorCommand1.key]: territoryBuildings.sectorCommand1,
  [territoryBuildings.sectorCommand2.key]: territoryBuildings.sectorCommand2,
  [territoryBuildings.starBase.key]: territoryBuildings.starBase,
  [otherBuildings.commercialPort.key]: otherBuildings.commercialPort,
  [otherBuildings.deepSpaceRadar.key]: otherBuildings.deepSpaceRadar,
  [otherBuildings.resourceMine.key]: otherBuildings.resourceMine,
  [otherBuildings.reserachLab.key]: otherBuildings.reserachLab,
};
