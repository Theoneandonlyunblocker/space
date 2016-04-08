import NotificationTemplate from "../../src/templateinterfaces/NotificationTemplate.d.ts";
import TemplateCollection from "../../src/templateinterfaces/TemplateCollection.d.ts";

import battleFinishNotification from "./notifications/battleFinishNotification.ts"; 
import playerDiedNotification from "./notifications/playerDiedNotification.ts";
import warDeclarationNotification from "./notifications/warDeclarationNotification.ts";

const Notifications: TemplateCollection<NotificationTemplate> =
{
  [battleFinishNotification.key]: battleFinishNotification,
  [playerDiedNotification.key]: playerDiedNotification,
  [warDeclarationNotification.key]: warDeclarationNotification
}

export default Notifications;
