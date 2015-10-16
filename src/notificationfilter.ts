/// <reference path="notificationfilterstate.ts" />
/// <reference path="notification.ts" />
/// <reference path="player.ts" />

module Rance
{
  export class NotificationFilter
  {
    filters:
    {
      [notificationKey: string]: NotificationFilterState[];
    } = {};

    player: Player;

    constructor(player: Player)
    {
      this.player = player;

      this.setDefaultFilterStates();
      this.load();
    }
    setDefaultFilterStates()
    {
      var notifications = app.moduleData.Templates.Notifications;

      for (var key in notifications)
      {
        var notificationTemplate = notifications[key];
        this.filters[key] = notificationTemplate.defaultFilterState.slice(0);
      }
    }
    shouldDisplayNotification(notification: Notification)
    {
      var filterStates = this.filters[notification.template.key];
      if (filterStates.indexOf(NotificationFilterState.alwaysShow) !== -1)
      {
        return true;
      }
      else if (filterStates.indexOf(NotificationFilterState.neverShow) !== -1)
      {
        return false;
      }

      var playerIsInvolved: boolean = false;
      for (var key in notification.props)
      {
        if (notification.props[key] === this.player)
        {
          playerIsInvolved = true;
          break;
        }
      }

      if (playerIsInvolved)
      {
        return filterStates.indexOf(NotificationFilterState.showIfInvolved) !== -1
      }

      return false;
    }
    getCompatibleFilterStates(filterState: NotificationFilterState): NotificationFilterState[]
    {
      switch (filterState)
      {
        case NotificationFilterState.alwaysShow:
        {
          return [];
        }
        case NotificationFilterState.showIfInvolved:
        {
          return [];
        }
        case NotificationFilterState.neverShow:
        {
          return [];
        }
      }
    }
    load(slot?: number)
    {
      var baseString = "Rance.NotificationFilter.";

      var parsedData: any;
      if (slot && localStorage[baseString + slot])
      {
        parsedData = JSON.parse(localStorage.getItem(baseString + slot));
      }
      else
      {
        parsedData = getMatchingLocalstorageItemsByDate(baseString)[0];
      }
      
      if (parsedData)
      {
        this.filters = extendObject(parsedData.filters, this.filters, false);
      }
    }
    save(slot: number = 0)
    {
      var data = JSON.stringify(
      {
        filters: this.filters,
        date: new Date()
      });

      localStorage.setItem("Rance.NotificationFilter." + slot, data);
    }
  }
}
