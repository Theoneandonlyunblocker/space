import {activeModuleData} from "./activeModuleData";
import {activePlayer} from "./activePlayer";
import NotificationTemplate from "./templateinterfaces/NotificationTemplate";

import Notification from "./Notification";
import NotificationFilterState from "./NotificationFilterState";

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

  constructor()
  {
    this.setDefaultFilterStates();
    this.load();
  }
  setDefaultFilterStates()
  {
    const notifications = activeModuleData.Templates.Notifications;

    for (let key in notifications)
    {
      const notificationTemplate = notifications[key];
      this.filters[key] = notificationTemplate.defaultFilterState.slice(0);
    }
  }
  shouldDisplayNotification(notification: Notification<any, any>)
  {
    const filterStates = this.filters[notification.template.key];
    if (filterStates.indexOf(NotificationFilterState.AlwaysShow) !== -1)
    {
      return true;
    }
    else if (filterStates.indexOf(NotificationFilterState.NeverShow) !== -1)
    {
      return false;
    }

    const activePlayerWasInvolved = notification.involvedPlayers.indexOf(activePlayer) !== -1;

    if (activePlayerWasInvolved)
    {
      return filterStates.indexOf(NotificationFilterState.ShowIfInvolved) !== -1;
    }

    return false;
  }
  getCompatibleFilterStates(filterState: NotificationFilterState): NotificationFilterState[]
  {
    switch (filterState)
    {
      case NotificationFilterState.AlwaysShow:
      {
        return [];
      }
      case NotificationFilterState.ShowIfInvolved:
      {
        return [];
      }
      case NotificationFilterState.NeverShow:
      {
        return [];
      }
    }
  }
  handleFilterStateChange(filterKey: string, state: NotificationFilterState)
  {
    const stateIndex = this.filters[filterKey].indexOf(state);
    if (stateIndex !== -1)
    {
      if (this.filters[filterKey].length === 1)
      {
        this.filters[filterKey] = [NotificationFilterState.NeverShow];
      }
      else
      {
        this.filters[filterKey].splice(stateIndex, 1);
      }
    }
    else
    {
      const newState: NotificationFilterState[] = [state];
      const compatibleStates = this.getCompatibleFilterStates(state);
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
    const filtersByCategory:
    {
      [category: string]:
      {
        notificationTemplate: NotificationTemplate<any, any>;
        filterState: NotificationFilterState[];
      }[],
    } = {};
    const notifications = activeModuleData.Templates.Notifications;

    for (let key in this.filters)
    {
      const notificationTemplate = notifications[key];
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
    const byCategory = this.getFiltersByCategory();
    const forSelectedCategory = byCategory[category];

    for (let i = 0; i < forSelectedCategory.length; i++)
    {
      const template = forSelectedCategory[i].notificationTemplate;
      this.filters[template.key] = template.defaultFilterState.slice(0);
    }
  }
  load(slot?: number)
  {
    const baseString = "NotificationFilter.";

    let parsedData: any;
    if (slot !== undefined)
    {
      const savedData = localStorage.getItem(baseString + slot);

      if (!savedData)
      {
        throw new Error("No options saved in that slot");
      }

      parsedData = JSON.parse(savedData);
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
    const data = JSON.stringify(
    {
      filters: this.filters,
      date: new Date(),
    });

    localStorage.setItem("NotificationFilter." + slot, data);
  }
}
