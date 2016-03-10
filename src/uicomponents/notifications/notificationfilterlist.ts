/// <reference path="../galaxymap/optionsgroup.ts" />
/// <reference path="notificationfilterlistitem.ts" />

module Rance
{
  export module UIComponents
  {
    export var NotificationFilterList = React.createClass(
    {
      displayName: "NotificationFilterList",
      propTypes:
      {
        filter: React.PropTypes.instanceOf(Rance.NotificationFilter).isRequired,
        highlightedOptionKey: React.PropTypes.string
      },
      handleResetCategory: function(category: string)
      {
        var filter: NotificationFilter = this.props.filter;
        filter.setDefaultFilterStatesForCategory(category);
        filter.save();
        this.forceUpdate();
        eventManager.dispatchEvent("updateNotificationLog");
      },
      componentDidMount: function()
      {
        // TODO ui | scroll to highlighted
      },
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
                key: notificationTemplate.key,
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
              className: "notification-filter-list-body"
            },
              filterGroupElements
            )
          )
        );
      }
    })
  }
}
