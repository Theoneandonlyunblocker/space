/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../notificationlog.ts" />
/// <reference path="notification.ts" />
/// <reference path="notificationfilterbutton.ts" />


import NotificationLog from "../../../src/NotificationLog.ts";
import Notification from "./Notification.ts";
import ConfirmPopup from "../popups/ConfirmPopup.ts";
import NotificationFilterButton from "./NotificationFilterButton.ts";
import PopupManager from "../popups/PopupManager.ts";
import eventManager from "../../../src/eventManager.ts";


export interface PropTypes extends React.Props<any>
{
  log: NotificationLog;
  currentTurn: number;
}

interface StateType
{
}

interface RefTypes extends React.Refs
{
  popupManager: React.Component<any, any>; // TODO refactor | correct ref type 542 | PopupManager
}

class NotificationLog_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "NotificationLog";
  mixins: reactTypeTODO_any = [React.addons.PureRenderMixin];
  updateListener: reactTypeTODO_any = undefined;


  state: StateType;
  refs: RefTypes;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.makePopup = this.makePopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.getNotificationKey = this.getNotificationKey.bind(this);
    this.handleMarkAsRead = this.handleMarkAsRead.bind(this);
    this.togglePopup = this.togglePopup.bind(this);    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      
    });
  }

  componentWillReceiveProps(newProps: any)
  {
    if (newProps.currentTurn !== this.props.currentTurn)
    {
      this.scrollTop = undefined;
    }
  }

  componentDidMount()
  {
    this.updateListener = eventManager.addEventListener("updateNotificationLog", this.forceUpdate.bind(this));
  }

  componentWillUnmount()
  {
    eventManager.removeEventListener("updateNotificationLog", this.updateListener);
  }

  componentDidUpdate()
  {
    var domNode = React.findDOMNode(this);
    if (!isFinite(this.scrollTop))
    {
      this.scrollTop = domNode.scrollTop;
    }

    domNode.scrollTop = domNode.scrollHeight;
  }

  getNotificationKey(notification: Notification)
  {
    return "" + notification.turn + this.props.log.byTurn[notification.turn].indexOf(notification);
  }

  handleMarkAsRead(notification: Notification)
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
  }

  makePopup(notification: Notification, key: string)
  {
    var log: NotificationLog = this.props.log;

    var popupId = this.refs.popupManager.makePopup(
    {
      contentConstructor: ConfirmPopup,
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
          NotificationFilterButton(
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
  }

  closePopup(key: string)
  {
    this.refs.popupManager.closePopup(this.state[key]);

    var stateObj: any = {};
    stateObj[key] = undefined;
    this.setState(stateObj);
  }

  togglePopup(notification: Notification)
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
  }

  render()
  {
    var log: NotificationLog = this.props.log;
    var notifications: Notification[] = log.filterNotifications(log.unread);

    var items: React.ReactElement<any>[] = [];

    for (var i = 0; i < notifications.length; i++)
    {
      items.push(Notification(
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
        PopupManager(
        {
          ref: "popupManager"
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(NotificationLog_COMPONENT_TODO);
export default Factory;
