import {englishLanguage} from "../../englishlanguage/englishLanguage";
import {ModuleData} from "../../../src/ModuleData";
import {GameModule} from "../../../src/GameModule";
import {GameModuleInitializationPhase} from "../../../src/GameModuleInitializationPhase";

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
