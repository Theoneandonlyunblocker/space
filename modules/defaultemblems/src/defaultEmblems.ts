import {ModuleData} from "core/src/modules/ModuleData";
import {GameModule} from "core/src/modules/GameModule";
import {GameModuleInitializationPhase} from "core/src/modules/GameModuleInitialization";
import {svgCache} from "../assets/assets";

import {subEmblemTemplates} from "./subEmblemTemplates";

import * as moduleInfo from "../moduleInfo.json";


export const defaultEmblems: GameModule =
{
  info: moduleInfo,
  supportedLanguages: "all",
  assetLoaders:
  {
    [GameModuleInitializationPhase.GameSetup]:
    [
      (baseUrl) => svgCache.load(baseUrl),
    ],
  },
  addToModuleData: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates(subEmblemTemplates, "SubEmblems");

    return moduleData;
  },
};
