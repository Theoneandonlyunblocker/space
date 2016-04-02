import NotificationTemplate from "./templateinterfaces/NotificationTemplate.d.ts";

import NotificationSaveData from "./savedata/NotificationSaveData.d.ts";
import NotificationLogSaveData from "./savedata/NotificationLogSaveData.d.ts";

import Notification from "./Notification.ts";
import NotificationFilter from "./NotificationFilter.ts";
import eventManager from "./eventManager.ts";
import Star from "./Star.ts";
import Player from "./Player.ts";


export default class NotificationLog
{
  byTurn:
  {
    [turnNumber: number]: Notification[];
  } = {};
  unread: Notification[] = [];
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
    for (var key in app.moduleData.Templates.Notifications)
    {
      var template = app.moduleData.Templates.Notifications[key];
      for (var i = 0; i < template.eventListeners.length; i++)
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
    for (var key in this.listeners)
    {
      for (var i = 0; i < this.listeners[key].length; i++)
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
  addNotification(notification: Notification)
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
  markAsRead(notification: Notification)
  {
    var index = this.unread.indexOf(notification);
    if (index === -1) throw new Error("Notification is already unread");

    notification.hasBeenRead = true;
    this.unread.splice(index, 1);
  }
  getUnreadNotificationsForTurn(turn: number)
  {
    return this.byTurn[turn].filter(function(notification: Notification)
    {
      return !notification.hasBeenRead;
    });
  }
  filterNotifications(notifications: Notification[])
  {
    var filtered: Notification[] = [];

    for (var i = 0; i < notifications.length; i++)
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

    for (var turnNumber in this.byTurn)
    {
      var notifications = this.byTurn[turnNumber];
      for (var i = 0; i < notifications.length; i++)
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
