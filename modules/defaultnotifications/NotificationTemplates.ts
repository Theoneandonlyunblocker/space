import NotificationTemplate from "../../src/templateinterfaces/NotificationTemplate";
import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";

import battleFinishNotification from "./notifications/battleFinishNotification";
import playerDiedNotification from "./notifications/playerDiedNotification";
import warDeclarationNotification from "./notifications/warDeclarationNotification";

const Notifications: TemplateCollection<NotificationTemplate> =
{
  [battleFinishNotification.key]: battleFinishNotification,
  [playerDiedNotification.key]: playerDiedNotification,
  [warDeclarationNotification.key]: warDeclarationNotification
}

export default Notifications;
