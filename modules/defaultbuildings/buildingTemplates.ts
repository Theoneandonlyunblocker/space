import BuildingTemplate from "../../src/templateinterfaces/BuildingTemplate";
import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";

import * as Templates from "./templates/Templates";


const buildingTemplates: TemplateCollection<BuildingTemplate> =
{
  [Templates.sectorCommand.type]: Templates.sectorCommand,
  [Templates.sectorCommand1.type]: Templates.sectorCommand1,
  [Templates.sectorCommand2.type]: Templates.sectorCommand2,
  [Templates.starBase.type]: Templates.starBase,
  [Templates.commercialPort.type]: Templates.commercialPort,
  [Templates.deepSpaceRadar.type]: Templates.deepSpaceRadar,
  [Templates.resourceMine.type]: Templates.resourceMine,
  [Templates.reserachLab.type]: Templates.reserachLab,
};

export default buildingTemplates;
