import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {activeNotificationFilter, NotificationFilter} from "../../../../src/notifications/NotificationFilter";

import {localize} from "../../localization/localize";

import {eventManager} from "../../../../src/app/eventManager";

import {OptionsGroup} from "../options/OptionsGroup";

import {NotificationFilterListItem} from "./NotificationFilterListItem";


export interface PropTypes extends React.Props<any>
{
  filter?: NotificationFilter;
  highlightedOptionKey?: string;
}

interface StateType
{
}

export class NotificationFilterListComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "NotificationFilterList";
  public state: StateType;
  private readonly bodyElement = React.createRef<HTMLDivElement>();

  static get defaultProps(): Partial<PropTypes>
  {
    return(
    {
      filter: activeNotificationFilter,
    });
  }

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();
  }
  private bindMethods()
  {
    this.scrollToHighlighted = this.scrollToHighlighted.bind(this);
    this.handleResetCategory = this.handleResetCategory.bind(this);
  }

  private handleResetCategory(category: string): void
  {
    const filter = this.props.filter;
    filter.setDefaultFilterStatesForCategory(category);
    filter.save();
    this.forceUpdate();
    eventManager.dispatchEvent("updateNotificationLog");
  }
  public scrollToHighlighted(): void
  {
    if (this.props.highlightedOptionKey)
    {
      const highlightedNode = <HTMLElement> this.bodyElement.current.getElementsByClassName("highlighted")[0];
      this.bodyElement.current.scrollTop = highlightedNode.offsetTop - this.bodyElement.current.offsetHeight / 3;
    }
  }
  public parentPopupDidMount(): void
  {
    this.scrollToHighlighted();
  }

  render()
  {
    const filter = this.props.filter;

    const filtersByCategory = filter.getFiltersByCategory();
    const filterGroupElements: React.ReactElement<any>[] = [];

    for (const category in filtersByCategory)
    {
      const filtersForCategory = filtersByCategory[category];
      const filterElementsForCategory:
      {
        key: string;
        content: React.ReactElement<any>;
      }[] = [];
      for (let i = 0; i < filtersForCategory.length; i++)
      {
        const notificationTemplate = filtersForCategory[i].notificationTemplate;
        const isHighlighted = Boolean(this.props.highlightedOptionKey &&
          this.props.highlightedOptionKey === notificationTemplate.key);

        filterElementsForCategory.push(
        {
          key: notificationTemplate.key,
          content: NotificationFilterListItem(
          {
            displayName: notificationTemplate.displayName,
            filter: filter,
            initialFilterState: filtersForCategory[i].filterState,
            keyTODO: notificationTemplate.key,
            isHighlighted: isHighlighted,
          }),
        });
      }
      filterGroupElements.push(OptionsGroup(
      {
        headerTitle: category,
        options: filterElementsForCategory,
        key: category,
        resetFN: this.handleResetCategory.bind(this, category),
      }));
    }

    return(
      ReactDOMElements.div(
      {
        className: "notification-filter-list",
      },
        ReactDOMElements.div(
        {
          className: "notification-filter-list-header",
        },
          ReactDOMElements.div(
          {
            className: "notification-filter-list-item-label",
          },
            localize("show").toString(),
          ),
          ReactDOMElements.div(
          {
            className: "notification-filter-list-item-filters",
          },
            localize("alwaysShow_short").toString(),
            localize("showIfInvolved_short").toString(),
            localize("neverShow_short").toString(),
          ),
        ),
        ReactDOMElements.div(
        {
          className: "notification-filter-list-body",
          ref: this.bodyElement,
        },
          filterGroupElements,
        ),
      )
    );
  }
}

export const NotificationFilterList: React.Factory<PropTypes> = React.createFactory(NotificationFilterListComponent);
