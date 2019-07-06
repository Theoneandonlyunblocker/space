import {englishLanguage} from "../englishlanguage/englishLanguage";
import {ModuleData} from "../../src/ModuleData";
import {ModuleFile} from "../../src/ModuleFile";
import {ModuleFileInitializationPhase} from "../../src/ModuleFileInitializationPhase";

import
{
  notificationCreationScripts,
  notificationTemplates,
} from "./notificationTemplates";
import {setBaseUrl as setAssetBaseUrl} from "./assets";

import * as moduleInfo from "./moduleInfo.json";


export const defaultNotifications: ModuleFile =
{
  info: moduleInfo,
  phaseToInitializeBefore: ModuleFileInitializationPhase.GameStart,
  supportedLanguages: [englishLanguage],
  initialize: (baseUrl) =>
  {
    setAssetBaseUrl(baseUrl);

    return Promise.resolve();
  },
  addToModuleData: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates(notificationTemplates, "Notifications");
    moduleData.scripts.add(...notificationCreationScripts);

    return moduleData;
  },
};
