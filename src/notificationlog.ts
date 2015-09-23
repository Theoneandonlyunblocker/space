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
    currentTurn: number;
    eventListeners: Function[] = [];

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
          var listener = eventManager.addEventListener(template.eventListeners[i],
            this.makeNotification.bind(this, template));
          this.eventListeners.push(listener);
        }
      }
    }
    destroy()
    {
      for (var i = 0; i < this.eventListeners.length; i++)
      {
        eventManager.removeEventListener(this.eventListeners[i]);
      }
    }
    setTurn(turn: number)
    {
      this.currentTurn = turn;
      this.byTurn[turn] = [];
    }
    makeNotification(template: Templates.INotificationTemplate, location: Star, props: any)
    {
      var notification = new Notification(template, props, this.currentTurn);

      this.byTurn[this.currentTurn].push(notification);
    }
    getUnreadNotificationsForThisTurn()
    {
      return this.byTurn[this.currentTurn].filter(function(notification: Notification)
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
