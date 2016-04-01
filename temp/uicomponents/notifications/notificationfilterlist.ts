/// <reference path="../galaxymap/optionsgroup.ts" />
/// <reference path="notificationfilterlistitem.ts" />

export interface PropTypes
{
  filter: NotificationFilter;
  highlightedOptionKey?: string;
}

export default class NotificationFilterList extends React.Component<PropTypes, {}>
{
  displayName: reactTypeTODO_any = "NotificationFilterList";
  handleResetCategory: function(category: string)
  {
    var filter: NotificationFilter = this.props.filter;
    filter.setDefaultFilterStatesForCategory(category);
    filter.save();
    this.forceUpdate();
    eventManager.dispatchEvent("updateNotificationLog");
  }
  scrollToHighlighted: function()
  {
    if (this.props.highlightedOptionKey)
    {
      var domNode = this.refs["body"].getDOMNode();
      var highlightedNode = domNode.getElementsByClassName("highlighted")[0];
      domNode.scrollTop = highlightedNode.offsetTop + domNode.scrollHeight / 3;
    }
  }
  render: function()
  {
    var filter: Rance.NotificationFilter = this.props.filter;

    var filtersByCategory = filter.getFiltersByCategory();
    var filterGroupElements: ReactComponentPlaceHolder[] = [];

    for (var category in filtersByCategory)
    {
      var filtersForCategory = filtersByCategory[category];
      var filterElementsForCategory: ReactComponentPlaceHolder[] = [];
      for (var i = 0; i < filtersForCategory.length; i++)
      {
        var notificationTemplate = filtersForCategory[i].notificationTemplate
        var isHighlighted = Boolean(this.props.highlightedOptionKey &&
          this.props.highlightedOptionKey === notificationTemplate.key);

        filterElementsForCategory.push(
        {
          key: notificationTemplate.key,
          content: UIComponents.NotificationFilterListItem(
          {
            displayName: notificationTemplate.displayName,
            filter: filter,
            filterState: filtersForCategory[i].filterState,
            keyTODO: notificationTemplate.key,
            isHighlighted: isHighlighted
          })
        });
      }
      filterGroupElements.push(UIComponents.OptionsGroup(
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
          ref: "body"
        },
          filterGroupElements
        )
      )
    );
  }
}
