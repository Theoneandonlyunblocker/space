
import app from "./App"; // TODO global
import NotificationTemplate from "./templateinterfaces/NotificationTemplate";

import Notification from "./Notification";
import NotificationFilterState from "./NotificationFilterState";
import Player from "./Player";

import
{
  extendObject,
  getMatchingLocalstorageItemsByDate,
} from "./utility";

export default class NotificationFilter
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

    for (let key in notifications)
    {
      var notificationTemplate = notifications[key];
      this.filters[key] = notificationTemplate.defaultFilterState.slice(0);
    }
  }
  shouldDisplayNotification(notification: Notification<any>)
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
    for (let key in notification.props)
    {
      if (notification.props[key] === this.player)
      {
        playerIsInvolved = true;
        break;
      }
    }

    if (playerIsInvolved)
    {
      return filterStates.indexOf(NotificationFilterState.showIfInvolved) !== -1;
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
  handleFilterStateChange(filterKey: string, state: NotificationFilterState)
  {
    var stateIndex = this.filters[filterKey].indexOf(state);
    if (stateIndex !== -1)
    {
      if (this.filters[filterKey].length === 1)
      {
        this.filters[filterKey] = [NotificationFilterState.neverShow];
      }
      else
      {
        this.filters[filterKey].splice(stateIndex, 1);
      }
    }
    else
    {
      var newState: NotificationFilterState[] = [state];
      var compatibleStates = this.getCompatibleFilterStates(state);
      for (let i = 0; i < this.filters[filterKey].length; i++)
      {
        if (compatibleStates.indexOf(this.filters[filterKey][i]) !== -1)
        {
          newState.push(this.filters[filterKey][i]);
        }
      }
      this.filters[filterKey] = newState;
    }
  }
  getFiltersByCategory()
  {
    var filtersByCategory:
    {
      [category: string]:
      {
        notificationTemplate: NotificationTemplate;
        filterState: NotificationFilterState[];
      }[],
    } = {};
    var notifications = app.moduleData.Templates.Notifications;

    for (let key in this.filters)
    {
      var notificationTemplate = notifications[key];
      if (notificationTemplate)
      {
        if (!filtersByCategory[notificationTemplate.category])
        {
          filtersByCategory[notificationTemplate.category] = [];
        }

        filtersByCategory[notificationTemplate.category].push(
        {
          notificationTemplate: notificationTemplate,
          filterState: this.filters[key],
        });
      }
    }

    return filtersByCategory;
  }
  setDefaultFilterStatesForCategory(category: string)
  {
    var byCategory = this.getFiltersByCategory();
    var forSelectedCategory = byCategory[category];

    for (let i = 0; i < forSelectedCategory.length; i++)
    {
      var template = forSelectedCategory[i].notificationTemplate;
      this.filters[template.key] = template.defaultFilterState.slice(0);
    }
  }
  load(slot?: number)
  {
    var baseString = "NotificationFilter.";

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
      date: new Date(),
    });

    localStorage.setItem("NotificationFilter." + slot, data);
  }
}
