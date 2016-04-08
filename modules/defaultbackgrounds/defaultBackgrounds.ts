import ModuleFile from "../../src/ModuleFile.d.ts";
import ModuleData from "../../src/ModuleData.ts";

import drawNebula from "./drawNebula.ts";

const defaultBackgrounds: ModuleFile =
{
  key: "defaultBackgrounds",
  metaData:
  {
    name: "Default backgrounds",
    version: "0.1.0",
    author: "giraluna",
    description: ""
  },
  constructModule: function(moduleData: ModuleData)
  {
    if (!moduleData.mapBackgroundDrawingFunction)
    {
      moduleData.mapBackgroundDrawingFunction = drawNebula;
    }
    if (!moduleData.starBackgroundDrawingFunction)
    {
      moduleData.starBackgroundDrawingFunction = drawNebula;
    }
    
    return moduleData;
  }
}

export default defaultBackgrounds;
