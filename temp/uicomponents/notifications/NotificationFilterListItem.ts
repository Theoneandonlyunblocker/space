/// <reference path="../../../lib/react-0.13.3.d.ts" />


import NotificationFilterState from "../../../src/NotificationFilterState.ts";
import NotificationFilter from "../../../src/NotificationFilter.ts";
import eventManager from "../../../src/eventManager.ts";

import * as React from "react";

interface PropTypes extends React.Props<any>
{
  displayName: string;
  filterState: number[];
  keyTODO: string;
  filter: NotificationFilter;
  isHighlighted: boolean;
}

interface StateType
{
  filterState?: any; // TODO refactor | define state type 456
}

export class NotificationFilterListItemComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "NotificationFilterListItem";

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleChangeState = this.handleChangeState.bind(this);    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      filterState: this.props.filterState
    });
  }
  
  componentWillReceiveProps(newProps: PropTypes)
  {
    this.setState(
    {
      filterState: newProps.filterState
    });
  }

  handleChangeState(state: NotificationFilterState)
  {
    var filter = this.props.NotificationFilter;
    filter.handleFilterStateChange(this.props.keyTODO/*TODO react*/, state);
    filter.save();
    this.setState(
    {
      filterState: filter.filters[this.props.keyTODO/*TODO react*/]
    });
    eventManager.dispatchEvent("updateNotificationLog");
  }
  
  render()
  {
    var inputElements: React.HTMLElement[] = [];
    var filterState: NotificationFilterState[] = this.state.filterState;

    for (var state in NotificationFilterState)
    {
      var numericState = parseInt(state);
      if (!isFinite(numericState)) continue;

      var stateIsActive = filterState.indexOf(numericState) !== -1;
      inputElements.push(React.DOM.input(
      {
        className: "notification-filter-list-item-filter",
        type: "checkbox",
        id: this.props.keyTODO/*TODO react*/,
        key: state,
        checked: stateIsActive,
        onChange: this.handleChangeState.bind(this, numericState),
        title: NotificationFilterState[numericState]
      }));
    }

    return(
      React.DOM.div(
      {
        className: "notification-filter-list-item" + (this.props.isHighlighted ? " highlighted" : "")
      },
        React.DOM.label(
        {
          className: "notification-filter-list-item-label",
          htmlFor: this.props.keyTODO/*TODO react*/
        },
          this.props.displayName
        ),
        React.DOM.div(
        {
          className: "notification-filter-list-item-filters"
        },
          inputElements
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(NotificationFilterListItemComponent);
export default Factory;
