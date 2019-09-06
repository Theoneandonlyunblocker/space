import {NotificationSubscriberSaveData} from "../savedata/NotificationSubscriberSaveData";

import {Notification} from "./Notification";
import {NotificationStore} from "./NotificationStore";


export class NotificationSubscriber
{
  public readonly allReceivedNotifications: Notification[] = [];
  public readonly unreadNotifications: Notification[] = [];

  private readonly notificationIsRelevantFilter: (notification: Notification) => boolean;

  constructor(notificationIsRelevantFilter: (notification: Notification) => boolean)
  {
    this.notificationIsRelevantFilter = notificationIsRelevantFilter;

    this.receiveNotificationIfNeeded = this.receiveNotificationIfNeeded.bind(this);
  }

  public registerToNotificationStore(store: NotificationStore): void
  {
    store.onNewNotification.push(this.receiveNotificationIfNeeded);
  }
  public markNotificationAsRead(notification: Notification): void
  {
    this.unreadNotifications.splice(this.unreadNotifications.indexOf(notification), 1);
  }
  public serialize(): NotificationSubscriberSaveData
  {
    return(
    {
      allReceivedNotificationIds: this.allReceivedNotifications.map(notification => notification.id),
      unreadNotificationIds: this.unreadNotifications.map(notification => notification.id),
    });
  }

  private receiveNotificationIfNeeded(notification: Notification): void
  {
    const shouldReceiveNotification = this.notificationIsRelevantFilter(notification);
    if (!shouldReceiveNotification)
    {
      return;
    }

    this.allReceivedNotifications.push(notification);
    this.unreadNotifications.push(notification);
  }
}
