import {ModuleData} from "../../../src/modules/ModuleData";
import {GameModule} from "../../../src/modules/GameModule";
import {GameModuleInitializationPhase} from "../../../src/modules/GameModuleInitializationPhase";

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
