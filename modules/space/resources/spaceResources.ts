import {englishLanguage} from "../../englishlanguage/englishLanguage";
import ModuleData from "../../../src/ModuleData";
import ModuleFile from "../../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../../src/ModuleFileInitializationPhase";

import * as ResourceTemplates from  "./resourceTemplates";
import {setBaseUrl as setResourceBaseUrl} from "./graphicsResources";

import * as moduleInfo from "./moduleInfo.json";


export const spaceResources: ModuleFile =
{
  info: moduleInfo,
  phaseToInitializeBefore: ModuleFileInitializationPhase.MapGen,
  supportedLanguages: [englishLanguage],
  initialize: (baseUrl) =>
  {
    setResourceBaseUrl(baseUrl);

    return Promise.resolve();
  },
  addToModuleData: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates(ResourceTemplates, "Resources");

    return moduleData;
  },
};
