import NotificationTemplate from "./templateinterfaces/NotificationTemplate";

import NotificationLogSaveData from "./savedata/NotificationLogSaveData";
import NotificationSaveData from "./savedata/NotificationSaveData";

import Notification from "./Notification";
import NotificationFilter from "./NotificationFilter";
import Player from "./Player";
import eventManager from "./eventManager";


export default class NotificationLog
{
  byTurn:
  {
    [turnNumber: number]: Notification<any, any>[];
  } = {};
  unread: Notification<any, any>[] = [];
  currentTurn: number;
  isHumanTurn: boolean = true;
  notificationFilter: NotificationFilter;

  constructor(player: Player)
  {
    this.notificationFilter = new NotificationFilter(player);
  }
  setTurn(turn: number, isHumanTurn: boolean)
  {
    this.currentTurn = turn;
    this.isHumanTurn = isHumanTurn;
  }
  makeNotification<P, D>(
    template: NotificationTemplate<P, D>,
    props: P,
    involvedPlayers: Player[],
  )
  {
    const notification = new Notification(template, props, this.currentTurn, involvedPlayers);

    this.addNotification(notification);
    if (this.isHumanTurn)
    {
      eventManager.dispatchEvent("updateNotificationLog");
    }
  }
  addNotification(notification: Notification<any, any>)
  {
    if (!this.byTurn[notification.turn])
    {
      this.byTurn[notification.turn] = [];
    }
    this.byTurn[notification.turn].unshift(notification);

    if (!notification.hasBeenRead)
    {
      this.unread.unshift(notification);
    }
  }
  markAsRead(notification: Notification<any, any>)
  {
    const index = this.unread.indexOf(notification);
    if (index === -1) throw new Error("Notification is already unread");

    notification.hasBeenRead = true;
    this.unread.splice(index, 1);
  }
  getUnreadNotificationsForTurn(turn: number)
  {
    return this.byTurn[turn].filter(function(notification: Notification<any, any>)
    {
      return !notification.hasBeenRead;
    });
  }
  filterNotifications(notifications: Notification<any, any>[])
  {
    const filtered: Notification<any, any>[] = [];

    for (let i = 0; i < notifications.length; i++)
    {
      if (this.notificationFilter.shouldDisplayNotification(notifications[i]))
      {
        filtered.push(notifications[i]);
      }
    }

    return filtered;
  }
  serialize(): NotificationLogSaveData
  {
    const notificationsSaveData: NotificationSaveData<any>[] = [];

    for (let turnNumber in this.byTurn)
    {
      const notifications = this.byTurn[turnNumber];
      for (let i = 0; i < notifications.length; i++)
      {
        notificationsSaveData.push(notifications[i].serialize());
      }
    }

    const data: NotificationLogSaveData =
    {
      notifications: notificationsSaveData,
    };

    return data;
  }
}
