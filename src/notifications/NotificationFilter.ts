import * as localForage from "localforage";

import {activeModuleData} from "../activeModuleData";
import {activePlayer} from "../activePlayer";
import {NotificationTemplate} from "../templateinterfaces/NotificationTemplate";
import
{
  extendObject,
} from "../utility";

import {Notification} from "./Notification";
import {NotificationFilterState} from "./NotificationFilterState";
import { storageStrings } from "../storageStrings";


export class NotificationFilter
{
  public filters:
  {
    [notificationKey: string]: NotificationFilterState[];
  } = {};

  constructor()
  {

  }

  public shouldDisplayNotification(notification: Notification): boolean
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
  public handleFilterStateChange(filterKey: string, state: NotificationFilterState): void
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
  public getFiltersByCategory()
  {
    const filtersByCategory:
    {
      [category: string]:
      {
        notificationTemplate: NotificationTemplate<any, any>;
        filterState: NotificationFilterState[];
      }[];
    } = {};
    const notifications = activeModuleData.templates.Notifications;

    for (const key in this.filters)
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
  public setDefaultFilterStatesForCategory(category: string): void
  {
    const byCategory = this.getFiltersByCategory();
    const forSelectedCategory = byCategory[category];

    for (let i = 0; i < forSelectedCategory.length; i++)
    {
      const template = forSelectedCategory[i].notificationTemplate;
      this.filters[template.key] = template.defaultFilterState.slice(0);
    }
  }
  public save(): Promise<string>
  {
    const data = JSON.stringify(
    {
      filters: this.filters,
      date: new Date(),
    });

    return localForage.setItem(storageStrings.notificationFilter, data);
  }
  public load(): Promise<void>
  {
    this.setDefaultFilterStates();

    return localForage.getItem<string>(storageStrings.notificationFilter).then(savedData =>
    {
      const parsedData = JSON.parse(savedData);

      if (parsedData)
      {
        this.filters = extendObject(parsedData.filters, this.filters, false);
      }
    });
  }

  private setDefaultFilterStates(): void
  {
    const notifications = activeModuleData.templates.Notifications;

    for (const key in notifications)
    {
      const notificationTemplate = notifications[key];
      this.filters[key] = notificationTemplate.defaultFilterState.slice(0);
    }
  }
  private getCompatibleFilterStates(filterState: NotificationFilterState): NotificationFilterState[]
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
}

export const activeNotificationFilter = new NotificationFilter();
