import {englishLanguage} from "modules/englishlanguage/englishLanguage";
import {ModuleData} from "src/modules/ModuleData";
import {GameModule} from "src/modules/GameModule";
import {GameModuleInitializationPhase} from "src/modules/GameModuleInitializationPhase";

import * as ResourceTemplates from  "./resourceTemplates";
import {setBaseUrl as setAssetBaseUrl} from "./assets";

import * as moduleInfo from "./moduleInfo.json";


export const spaceResources: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.MapGen,
  supportedLanguages: [englishLanguage],
  initialize: (baseUrl) =>
  {
    setAssetBaseUrl(baseUrl);

    return Promise.resolve();
  },
  addToModuleData: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates(ResourceTemplates, "Resources");

    return moduleData;
  },
};
