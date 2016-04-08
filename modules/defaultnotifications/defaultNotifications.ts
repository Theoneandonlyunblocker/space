import RuleSet from "../../src/RuleSet.ts";
import ModuleData from "../../src/ModuleData.ts";
import ModuleFile from "../../src/ModuleFile.d.ts";

import NotificationTemplates from "./NotificationTemplates.ts";

const defaultNotifications: ModuleFile =
{
  key: "defaultNotifications",
  metaData:
  {
    name: "Default Notifications",
    version: "0.1.0",
    author: "giraluna",
    description: ""
  },
  constructModule: function(moduleData: ModuleData)
  {
    moduleData.copyTemplates(NotificationTemplates, "Notifications");
    
    return moduleData;
  }
}

export default defaultNotifications;
