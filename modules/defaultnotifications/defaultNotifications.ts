import * as Languages from "../../localization/defaultLanguages";
import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";
import ModuleFileLoadingPhase from "../../src/ModuleFileLoadingPhase";

import
{
  notificationCreationScripts,
  notificationTemplates,
} from "./NotificationTemplates";


const defaultNotifications: ModuleFile =
{
  key: "defaultNotifications",
  metaData:
  {
    name: "Default Notifications",
    version: "0.1.0",
    author: "giraluna",
    description: "",
  },
  needsToBeLoadedBefore: ModuleFileLoadingPhase.Game,
  supportedLanguages: [Languages.en],
  constructModule: (moduleData: ModuleData) =>
  {
    moduleData.copyTemplates(notificationTemplates, "Notifications");
    moduleData.scripts.add(...notificationCreationScripts);

    return moduleData;
  },
};

export default defaultNotifications;
