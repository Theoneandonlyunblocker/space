/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../galaxymap/optionsgroup.ts" />
/// <reference path="notificationfilterlistitem.ts" />


import OptionsGroup from "../galaxymap/OptionsGroup.ts";
import NotificationFilterListItem from "./NotificationFilterListItem.ts";
import NotificationFilter from "../../NotificationFilter.ts";
import eventManager from "../../eventManager.ts";


interface PropTypes extends React.Props<any>
{
  filter: NotificationFilter;
  highlightedOptionKey?: string;
}

interface StateType
{
}

export class NotificationFilterListComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "NotificationFilterList";
  handleResetCategory(category: string)
  {
    var filter = this.props.filter;
    filter.setDefaultFilterStatesForCategory(category);
    filter.save();
    this.forceUpdate();
    eventManager.dispatchEvent("updateNotificationLog");
  }
  state: StateType;

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
  
  scrollToHighlighted()
  {
    if (this.props.highlightedOptionKey)
    {
      var domNode = this.ref_TODO_body.getDOMNode();
      var highlightedNode = domNode.getElementsByClassName("highlighted")[0];
      domNode.scrollTop = highlightedNode.offsetTop + domNode.scrollHeight / 3;
    }
  }
  render()
  {
    var filter = this.props.filter;

    var filtersByCategory = filter.getFiltersByCategory();
    var filterGroupElements: React.ReactElement<any>[] = [];

    for (var category in filtersByCategory)
    {
      var filtersForCategory = filtersByCategory[category];
      var filterElementsForCategory: React.ReactElement<any>[] = [];
      for (var i = 0; i < filtersForCategory.length; i++)
      {
        var notificationTemplate = filtersForCategory[i].notificationTemplate
        var isHighlighted = Boolean(this.props.highlightedOptionKey &&
          this.props.highlightedOptionKey === notificationTemplate.key);

        filterElementsForCategory.push(
        {
          key: notificationTemplate.key,
          content: NotificationFilterListItem(
          {
            displayName: notificationTemplate.displayName,
            filter: filter,
            filterState: filtersForCategory[i].filterState,
            keyTODO: notificationTemplate.key,
            isHighlighted: isHighlighted
          })
        });
      }
      filterGroupElements.push(OptionsGroup(
      {
        header: category,
        options: filterElementsForCategory,
        key: category,
        resetFN: this.handleResetCategory.bind(this, category)
      }));
    }

    return(
      React.DOM.div(
      {
        className: "notification-filter-list"
      },
        React.DOM.div(
        {
          className: "notification-filter-list-header"
        },
          React.DOM.div(
          {
            className: "notification-filter-list-item-label"
          },
            "Show"
          ),
          React.DOM.div(
          {
            className: "notification-filter-list-item-filters"
          },
            "Always",
            "Involved",
            "Never"
          )
        ),
        React.DOM.div(
        {
          className: "notification-filter-list-body",
          ref: (component: TODO_TYPE) =>
{
  this.ref_TODO_body = component;
}
        },
          filterGroupElements
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(NotificationFilterListComponent);
export default Factory;
