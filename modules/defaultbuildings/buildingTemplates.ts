import * as otherBuildings from "./templates/otherBuildings";
import * as territoryBuildings from "./templates/territoryBuildings";


const buildingTemplates =
{
  [territoryBuildings.sectorCommand.type]: territoryBuildings.sectorCommand,
  [territoryBuildings.sectorCommand1.type]: territoryBuildings.sectorCommand1,
  [territoryBuildings.sectorCommand2.type]: territoryBuildings.sectorCommand2,
  [territoryBuildings.starBase.type]: territoryBuildings.starBase,
  [otherBuildings.commercialPort.type]: otherBuildings.commercialPort,
  [otherBuildings.deepSpaceRadar.type]: otherBuildings.deepSpaceRadar,
  [otherBuildings.resourceMine.type]: otherBuildings.resourceMine,
  [otherBuildings.reserachLab.type]: otherBuildings.reserachLab,
  [otherBuildings.thePyramids.type]: otherBuildings.thePyramids,
  [otherBuildings.nationalEpic.type]: otherBuildings.nationalEpic,
};

export default buildingTemplates;
