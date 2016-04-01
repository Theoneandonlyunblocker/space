/// <reference path="../../notificationlog.ts" />
/// <reference path="notification.ts" />
/// <reference path="notificationfilterbutton.ts" />

export interface PropTypes
{
  log: NotificationLog;
  currentTurn: number;
}

export var NotificationLog = React.createFactory(React.createClass(
{
  displayName: "NotificationLog",
  mixins: [React.addons.PureRenderMixin],
  updateListener: undefined,


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

  componentDidMount: function()
  {
    this.updateListener = eventManager.addEventListener("updateNotificationLog", this.forceUpdate.bind(this));
  },

  componentWillUnmount: function()
  {
    eventManager.removeEventListener("updateNotificationLog", this.updateListener);
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
    var log: Rance.NotificationLog = this.props.log;

    var popupId = this.refs.popupManager.makePopup(
    {
      contentConstructor: UIComponents.ConfirmPopup,
      contentProps:
      {
        contentConstructor: notification.template.contentConstructor,
        contentProps:
        {
          notification: notification
        },
        handleOk: this.handleMarkAsRead.bind(this, notification),
        handleClose: this.closePopup.bind(this, key),
        okText: "Mark as read",
        cancelText: "Close",
        extraButtons:
        [
          UIComponents.NotificationFilterButton(
          {
            key: "notificationFilter",
            filter: log.notificationFilter,
            text: "Filter",
            highlightedOptionKey: notification.template.key
          })
        ]
      },
      popupProps:
      {
        containerDragOnly: true,
        preventAutoResize: true
      }
    });

    var stateObj: any = {};
    stateObj[key] = popupId;
    this.setState(stateObj);
  },

  closePopup: function(key: string)
  {
    this.refs.popupManager.closePopup(this.state[key]);

    var stateObj: any = {};
    stateObj[key] = undefined;
    this.setState(stateObj);
  },

  togglePopup: function(notification: Notification)
  {
    var key = this.getNotificationKey(notification);
    if (isFinite(this.state[key]))
    {
      this.closePopup(key);
    }
    else
    {
      this.makePopup(notification, key);
    }
  },

  render: function()
  {
    var log: Rance.NotificationLog = this.props.log;
    var notifications: Notification[] = log.filterNotifications(log.unread);

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
}));
