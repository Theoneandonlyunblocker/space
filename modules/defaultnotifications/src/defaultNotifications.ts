import {englishLanguage} from "modules/englishlanguage/src/englishLanguage";
import {ModuleData} from "core/src/modules/ModuleData";
import {GameModule} from "core/src/modules/GameModule";
import {GameModuleInitializationPhase} from "core/src/modules/GameModuleInitializationPhase";

import
{
  notificationCreationScripts,
  notificationTemplates,
} from "./notificationTemplates";

import * as moduleInfo from "../moduleInfo.json";
import { loadSvg } from "../assets/assets";


export const defaultNotifications: GameModule =
{
  info: moduleInfo,
  supportedLanguages: [englishLanguage],
  assetLoaders:
  {
    [GameModuleInitializationPhase.GameStart]:
    [
      loadSvg,
    ],
  },
  addToModuleData: (moduleData: ModuleData) =>
  {
    moduleData.templates.notifications.copyTemplates(notificationTemplates);
    moduleData.scripts.add(notificationCreationScripts);

    return moduleData;
  },
};
