import ModuleData from "../../../src/ModuleData";
import ModuleFile from "../../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../../src/ModuleFileInitializationPhase";

import drawNebula from "./drawNebula";


const spaceBackgrounds: ModuleFile =
{
  info:
  {
    key: "spaceBackgrounds",
    version: "0.1.0",
    author: "giraluna",
    description: "",
    modsToReplace: ["defaultBackgrounds"],
  },
  phaseToInitializeBefore: ModuleFileInitializationPhase.GameStart,
  supportedLanguages: "all",
  addToModuleData: (moduleData: ModuleData) =>
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
  },
};

export default spaceBackgrounds;
