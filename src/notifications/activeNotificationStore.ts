import {NotificationStore} from "./NotificationStore";

export let activeNotificationStore: NotificationStore;

export function setActiveNotificationStore(store: NotificationStore): void
{
  activeNotificationStore = store;
}

