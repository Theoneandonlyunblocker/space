import ModuleFile from "../../src/ModuleFile";
import ModuleData from "../../src/ModuleData";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";

import drawNebula from "./drawNebula";

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
  needsToBeLoadedBefore: ModuleFileLoadingPhase.game,
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
