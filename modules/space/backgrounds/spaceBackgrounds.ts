import {ModuleData} from "../../../src/ModuleData";
import {ModuleFile} from "../../../src/ModuleFile";
import {ModuleFileInitializationPhase} from "../../../src/ModuleFileInitializationPhase";

import {drawNebula} from "./drawNebula";

import * as moduleInfo from "./moduleInfo.json";


export const spaceBackgrounds: ModuleFile =
{
  info: moduleInfo,
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
