import {englishLanguage} from "../../englishlanguage/englishLanguage";
import ModuleFile from "../../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../../src/ModuleFileInitializationPhase";

import {itemTemplates} from "./itemTemplates";
import {setBaseUrl as setBaseResourceUrl} from "./resources";

import * as moduleInfo from "./moduleInfo.json";


const spaceItems: ModuleFile =
{
  info: moduleInfo,
  phaseToInitializeBefore: ModuleFileInitializationPhase.MapGen,
  supportedLanguages: [englishLanguage],
  initialize: (baseUrl) =>
  {
    setBaseResourceUrl(baseUrl);

    return Promise.resolve();
  },
  addToModuleData: (moduleData) =>
  {
    moduleData.copyTemplates(itemTemplates, "Items");

    return moduleData;
  },
};

export default spaceItems;
