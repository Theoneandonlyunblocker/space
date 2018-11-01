import {englishLanguage} from "../englishlanguage/englishLanguage";
import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileInitializationPhase from "../../src/ModuleFileInitializationPhase";

import
{
  notificationCreationScripts,
  notificationTemplates,
} from "./NotificationTemplates";


const defaultNotifications: ModuleFile =
{
  metaData:
  {
    key: "defaultNotifications",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeInitializedBefore: ModuleFileInitializationPhase.GameStart,
  supportedLanguages: [englishLanguage],
  constructModule: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates(notificationTemplates, "Notifications");
    moduleData.scripts.add(...notificationCreationScripts);

    return moduleData;
  },
};

export default defaultNotifications;
