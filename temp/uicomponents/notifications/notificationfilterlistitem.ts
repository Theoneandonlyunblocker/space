/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  displayName: string;
  filterState: number[];
  keyTODO: string;
  filter: NotificationFilter;
  isHighlighted: boolean;
}

export default class NotificationFilterListItem extends React.Component<PropTypes, {}>
{
  displayName: string = "NotificationFilterListItem";

  state:
  {
    
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  getInitialState()
  {
    return(
    {
      filterState: this.props.filterState
    });
  }
  
  componentWillReceiveProps(newProps: any)
  {
    this.setState(
    {
      filterState: newProps.filterState
    });
  }

  handleChangeState(state: NotificationFilterState)
  {
    var filter: NotificationFilter = this.props.filter;
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
    var inputElements: ReactDOMPlaceHolder[] = [];
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
