/// <reference path="notification.ts" />

module Rance
{
  export module UIComponents
  {
    export var NotificationLog = React.createClass(
    {
      displayName: "NotificationLog",
      getInitialState: function()
      {
        return(
        {
          notifications: this.props.log.getUnreadNotificationsForThisTurn()
        });
      },
      
      render: function()
      {
        var log: NotificationLog = this.props.log;
        var notifications: Notification[] = this.state.notifications;

        var items: ReactDOMPlaceHolder[] = [];

        for (var i = 0; i < notifications.length; i++)
        {
          var logIndex = log.byTurn[notifications[i].turn].indexOf(notifications[i]);
          items.push(UIComponents.Notification(
          {
            notification: notifications[i],
            key: logIndex
          }));
        }

        return(
          React.DOM.ol(
          {
            className: "notification-log"
          },
            null
          )
        );
      }
    })
  }
}
