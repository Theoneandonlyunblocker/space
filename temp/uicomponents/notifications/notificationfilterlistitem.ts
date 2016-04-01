export interface PropTypes
{
  displayName: string;
  filterState: number[];
  keyTODO: string;
  filter: NotificationFilter;
  isHighlighted: boolean;
}

export var NotificationFilterListItem = React.createFactory(React.createClass(
{
  displayName: "NotificationFilterListItem",
  propTypes:
  {
    displayName: React.PropTypes.string.isRequired,
    filterState: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
    keyTODO: React.PropTypes.string.isRequired,
    filter: React.PropTypes.instanceOf(Rance.NotificationFilter).isRequired,
    isHighlighted: React.PropTypes.bool.isRequired
  },

  getInitialState: function()
  {
    return(
    {
      filterState: this.props.filterState
    });
  },
  
  componentWillReceiveProps: function(newProps: any)
  {
    this.setState(
    {
      filterState: newProps.filterState
    });
  },

  handleChangeState: function(state: NotificationFilterState)
  {
    var filter: Rance.NotificationFilter = this.props.filter;
    filter.handleFilterStateChange(this.props.keyTODO/*TODO react*/, state);
    filter.save();
    this.setState(
    {
      filterState: filter.filters[this.props.keyTODO/*TODO react*/]
    });
    eventManager.dispatchEvent("updateNotificationLog");
  },
  
  render: function()
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
}));
