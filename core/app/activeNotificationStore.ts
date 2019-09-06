import {NotificationStore} from "../notifications/NotificationStore";

export let activeNotificationStore: NotificationStore;

export function setActiveNotificationStore(store: NotificationStore): void
{
  activeNotificationStore = store;
}

