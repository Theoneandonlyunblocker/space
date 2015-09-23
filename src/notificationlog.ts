/// <reference path="templateinterfaces/inotificationtemplate.d.ts" />
/// <reference path="notification.ts" />
/// <reference path="eventmanager.ts" />
/// <reference path="star.ts" />

module Rance
{
  export class NotificationLog
  {
    byTurn:
    {
      [turnNumber: number]: Notification[];
    } = {};
    unread: Notification[] = [];
    currentTurn: number;
    listeners:
    {
      [name: string]: Function[];
    } = {};

    constructor()
    {
      this.addEventListeners();
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
    setTurn(turn: number)
    {
      this.currentTurn = turn;
      this.byTurn[turn] = [];
    }
    makeNotification(template: Templates.INotificationTemplate, location: Star, props: any)
    {
      console.log("makeNotification");
      var notification = new Notification(template, props, this.currentTurn);

      this.byTurn[this.currentTurn].unshift(notification);
      this.unread.unshift(notification);
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
    serialize()
    {
      var data:
      {
        [turnNumber: number]: any;
      } = {};

      for (var turnNumber in this.byTurn)
      {
        data[turnNumber] = [];
        var notifications = this.byTurn[turnNumber];
        for (var i = 0; i < notifications.length; i++)
        {
          data[turnNumber].push(notifications[i].serialize());
        }
      }

      return data;
    }
  }
}
