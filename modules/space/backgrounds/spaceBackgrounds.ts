import {ModuleData} from "core/modules/ModuleData";
import {GameModule} from "core/modules/GameModule";
import {GameModuleInitializationPhase} from "core/modules/GameModuleInitializationPhase";

import {drawNebula} from "./drawNebula";

import * as moduleInfo from "./moduleInfo.json";


export const spaceBackgrounds: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.GameStart,
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
