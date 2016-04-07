import ModuleFile from "../../src/ModuleFile.d.ts";
import ModuleData from "../../src/ModuleData.ts";

import MapGenTemplate from "../../src/templateinterfaces/MapGenTemplate.d.ts";
import TemplateCollection from "../../src/templateinterfaces/TemplateCollection.d.ts";

import spiralGalaxy from "./templates/spiralGalaxy.ts";
import tinierSpiralGalaxy from "./templates/tinierSpiralGalaxy.ts";

const Templates: TemplateCollection<MapGenTemplate> =
{
  [spiralGalaxy.key]: spiralGalaxy,
  [tinierSpiralGalaxy.key]: tinierSpiralGalaxy
}

const defaultMapGen: ModuleFile =
{
  key: "defaultMapGen",
  metaData:
  {
    name: "Default map gen",
    version: "0.1.0",
    author: "giraluna",
    description: ""
  },
  constructModule: function(moduleData: ModuleData)
  {
    moduleData.copyTemplates<MapGenTemplate>(Templates, "MapGen");
    
    return moduleData;
  }
}

export default defaultMapGen;
