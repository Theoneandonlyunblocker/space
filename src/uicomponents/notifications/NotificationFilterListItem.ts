import * as React from "react";


import NotificationFilter from "../../NotificationFilter";
import NotificationFilterState from "../../NotificationFilterState";
import eventManager from "../../eventManager";


export interface PropTypes extends React.Props<any>
{
  displayName: string;
  filterState: NotificationFilterState[];
  keyTODO: string;
  filter: NotificationFilter;
  isHighlighted: boolean;
}

interface StateType
{
  filterState?: NotificationFilterState[];
}

export class NotificationFilterListItemComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "NotificationFilterListItem";

  state: StateType;

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
      filterState: this.props.filterState,
    });
  }

  componentWillReceiveProps(newProps: PropTypes)
  {
    this.setState(
    {
      filterState: newProps.filterState,
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
    const filterState: NotificationFilterState[] = this.state.filterState;

    for (let state in NotificationFilterState)
    {
      const numericState = parseInt(state);
      if (!isFinite(numericState)) continue;

      const stateIsActive = filterState.indexOf(numericState) !== -1;
      inputElements.push(React.DOM.input(
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
      React.DOM.div(
      {
        className: "notification-filter-list-item" + (this.props.isHighlighted ? " highlighted" : ""),
      },
        React.DOM.label(
        {
          className: "notification-filter-list-item-label",
          htmlFor: this.props.keyTODO,/*TODO react*/
        },
          this.props.displayName,
        ),
        React.DOM.div(
        {
          className: "notification-filter-list-item-filters",
        },
          inputElements,
        ),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(NotificationFilterListItemComponent);
export default Factory;
