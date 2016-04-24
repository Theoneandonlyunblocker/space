import ModuleData from "../../src/ModuleData";
import ModuleFile from "../../src/ModuleFile";

import NotificationTemplates from "./NotificationTemplates";

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
