/// <reference path="notification.ts" />

module Rance
{
  export module UIComponents
  {
    export var NotificationLog = React.createClass(
    {
      displayName: "NotificationLog",
      mixins: [React.addons.PureRenderMixin],

      getInitialState: function()
      {
        return(
        {
          
        });
      },

      componentWillReceiveProps: function(newProps: any)
      {
        if (newProps.currentTurn !== this.props.currentTurn)
        {
          this.scrollTop = undefined;
        }
      },

      componentDidUpdate: function()
      {
        var domNode = this.getDOMNode();
        if (!isFinite(this.scrollTop))
        {
          this.scrollTop = domNode.scrollTop;
        }

        domNode.scrollTop = domNode.scrollHeight;
      },

      getNotificationKey: function(notification: Notification)
      {
        return "" + notification.turn + this.props.log.byTurn[notification.turn].indexOf(notification);
      },

      handleMarkAsRead: function(notification: Notification)
      {
        this.props.log.markAsRead(notification);
        var notificationKey = this.getNotificationKey(notification);
        if (isFinite(this.state[notificationKey]))
        {
          this.closePopup(notificationKey);
        }
        else
        {
          this.forceUpdate();
        }
      },

      makePopup: function(notification: Notification, key: string)
      {
        var popupId = this.refs.popupManager.makePopup(
        {
          contentConstructor: UIComponents.ConfirmPopup,
          contentProps:
          {
            contentConstructor: notification.template.contentConstructor,
            contentProps: notification.props,
            handleOk: this.handleMarkAsRead.bind(this, notification),
            handleClose: this.closePopup.bind(this, key),
            okText: "Mark as read",
            cancelText: "Close"
          },
          popupProps:
          {
            resizable: true,
            containerDragOnly: true,
            minWidth: 150,
            minHeight: 50
          }
        });

        var stateObj: any = {};
        stateObj[key] = popupId;
        this.setState(stateObj);
      },

      closePopup: function(key: string)
      {
        var stateObj: any = {};
        stateObj[key] = undefined;
        this.setState(stateObj);
      },

      togglePopup: function(notification: Notification)
      {
        var key = this.getNotificationKey(notification);
        if (isFinite(this.state[key]))
        {
          this.closePopup(notification, key);
        }
        else
        {
          this.makePopup(notification, key);
        }
      },

      render: function()
      {
        var log: NotificationLog = this.props.log;
        var notifications: Notification[] = log.unread;

        var items: ReactComponentPlaceHolder[] = [];

        for (var i = 0; i < notifications.length; i++)
        {
          items.push(UIComponents.Notification(
          {
            notification: notifications[i],
            key: this.getNotificationKey(notifications[i]),
            markAsRead: this.handleMarkAsRead,
            togglePopup: this.togglePopup
          }));
        }

        return(
          React.DOM.div(
          {
            className: "notification-log-container"
          },
            React.DOM.ol(
            {
              className: "notification-log"
            },
              items.reverse()
            ),
            UIComponents.PopupManager(
            {
              ref: "popupManager"
            })
          )
        );
      }
    })
  }
}
