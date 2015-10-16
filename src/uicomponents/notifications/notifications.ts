/// <reference path="../../notificationlog.ts" />
/// <reference path="notificationlog.ts" />
/// <reference path="notificationfilterbutton.ts" />

module Rance
{
  export module UIComponents
  {
    export var Notifications = React.createClass(
    {
      displayName: "Notifications",

      propTypes:
      {
        log: React.PropTypes.instanceOf(Rance.NotificationLog).isRequired,
        currentTurn: React.PropTypes.number.isRequired
      },

      render: function()
      {
        return(
          React.DOM.div(
          {
            className: "notifications-container"
          },
            UIComponents.NotificationLog(
            {
              log: this.props.log,
              currentTurn: this.props.currentTurn,
              key: "log"
            }),
            UIComponents.NotificationFilterButton(
            {
              filter: this.props.log.notificationFilter,
              text: "Filter",
              key: "filter"
            })
          )
        );
      }
    })
  }
}
