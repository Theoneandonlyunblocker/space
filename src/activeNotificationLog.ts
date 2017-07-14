import {default as NotificationLog} from "./NotificationLog";


// TODO 2017.07.14 | kinda stupidly named. consistent with the other global stuff at least
export let activeNotificationLog: NotificationLog;

export function setActiveNotificationLog(notificationLog: NotificationLog): void
{
  activeNotificationLog = notificationLog;
}
