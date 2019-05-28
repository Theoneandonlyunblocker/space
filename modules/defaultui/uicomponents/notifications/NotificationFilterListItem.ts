import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";


import {NotificationFilter} from "../../notifications/NotificationFilter";
import {NotificationFilterState} from "../../notifications/NotificationFilterState";

import eventManager from "../../eventManager";


export interface PropTypes extends React.Props<any>
{
  displayName: string;
  initialFilterState: NotificationFilterState[];
  keyTODO: string;
  filter: NotificationFilter;
  isHighlighted: boolean;
}

interface StateType
{
  filterState: NotificationFilterState[];
}

export class NotificationFilterListItemComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "NotificationFilterListItem";

  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleChangeState = this.handleChangeState.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {
      filterState: this.props.initialFilterState,
    });
  }

  handleChangeState(state: NotificationFilterState)
  {
    const filter = this.props.filter;
    filter.handleFilterStateChange(this.props.keyTODO/*TODO react*/, state);
    filter.save();
    this.setState(
    {
      filterState: filter.filters[this.props.keyTODO/*TODO react*/],
    });
    eventManager.dispatchEvent("updateNotificationLog");
  }

  render()
  {
    const inputElements: React.ReactHTMLElement<any>[] = [];
    const filterState = this.state.filterState;

    for (const state in NotificationFilterState)
    {
      const numericState = parseInt(state);
      if (!isFinite(numericState)) { continue; }

      const stateIsActive = filterState.indexOf(numericState) !== -1;
      inputElements.push(ReactDOMElements.input(
      {
        className: "notification-filter-list-item-filter",
        // could use radio buttons for now as filter states don't overlap currently
        // but they might in the future so just use checkboxes
        // see src/NotificationFilter#getCompatibleFilterStates()
        type: "checkbox",
        id: this.props.keyTODO/*TODO react*/,
        key: state,
        checked: stateIsActive,
        onChange: this.handleChangeState.bind(this, numericState),
        title: NotificationFilterState[numericState],
      }));
    }

    return(
      ReactDOMElements.div(
      {
        className: "notification-filter-list-item" + (this.props.isHighlighted ? " highlighted" : ""),
      },
        ReactDOMElements.label(
        {
          className: "notification-filter-list-item-label",
          htmlFor: this.props.keyTODO, /*TODO react*/
        },
          this.props.displayName,
        ),
        ReactDOMElements.div(
        {
          className: "notification-filter-list-item-filters",
        },
          inputElements,
        ),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(NotificationFilterListItemComponent);
export default factory;
