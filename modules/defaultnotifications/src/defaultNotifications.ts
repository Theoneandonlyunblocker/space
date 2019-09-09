import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {ModuleData} from "core/src/modules/ModuleData";
import {GameModule} from "core/src/modules/GameModule";
import {GameModuleInitializationPhase} from "core/src/modules/GameModuleInitializationPhase";

import
{
  notificationCreationScripts,
  notificationTemplates,
} from "./notificationTemplates";
import {setBaseUrl as setAssetBaseUrl} from "../assets/assets";

import * as moduleInfo from "../moduleInfo.json";


export const defaultNotifications: GameModule =
{
  info: moduleInfo,
  phaseToInitializeBefore: GameModuleInitializationPhase.GameStart,
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
