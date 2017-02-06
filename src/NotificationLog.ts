
import app from "./App"; // TODO global
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
    [turnNumber: number]: Notification<any>[];
  } = {};
  unread: Notification<any>[] = [];
  currentTurn: number;
  isHumanTurn: boolean = true;
  listeners:
  {
    [name: string]: Function[];
  } = {};
  notificationFilter: NotificationFilter;

  constructor(player: Player)
  {
    this.addEventListeners();
    this.notificationFilter = new NotificationFilter(player);
  }
  addEventListeners()
  {
    for (let key in app.moduleData.Templates.Notifications)
    {
      var template = app.moduleData.Templates.Notifications[key];
      for (let i = 0; i < template.eventListeners.length; i++)
      {
        var listenerKey = template.eventListeners[i];
        var listener = eventManager.addEventListener(listenerKey,
          this.makeNotification.bind(this, template));

        if (!this.listeners[listenerKey])
        {
          this.listeners[listenerKey] = [];
        }
        this.listeners[listenerKey].push(listener);
      }
    }
  }
  destroy()
  {
    for (let key in this.listeners)
    {
      for (let i = 0; i < this.listeners[key].length; i++)
      {
        eventManager.removeEventListener(key, this.listeners[key][i]);
      }
    }
  }
  setTurn(turn: number, isHumanTurn: boolean)
  {
    this.currentTurn = turn;
    this.isHumanTurn = isHumanTurn;
  }
  makeNotification(template: NotificationTemplate, props: any)
  {
    var notification = new Notification(template, props, this.currentTurn);

    this.addNotification(notification);
    if (this.isHumanTurn)
    {
      eventManager.dispatchEvent("updateNotificationLog");
    }
  }
  addNotification(notification: Notification<any>)
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
  markAsRead(notification: Notification<any>)
  {
    var index = this.unread.indexOf(notification);
    if (index === -1) throw new Error("Notification is already unread");

    notification.hasBeenRead = true;
    this.unread.splice(index, 1);
  }
  getUnreadNotificationsForTurn(turn: number)
  {
    return this.byTurn[turn].filter(function(notification: Notification<any>)
    {
      return !notification.hasBeenRead;
    });
  }
  filterNotifications(notifications: Notification<any>[])
  {
    var filtered: Notification<any>[] = [];

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
    var notificationsSaveData: NotificationSaveData[] = []

    for (let turnNumber in this.byTurn)
    {
      var notifications = this.byTurn[turnNumber];
      for (let i = 0; i < notifications.length; i++)
      {
        notificationsSaveData.push(notifications[i].serialize());
      }
    }

    var data: NotificationLogSaveData =
    {
      notifications: notificationsSaveData
    };

    return data;
  }
}
