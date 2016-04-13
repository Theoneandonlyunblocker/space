/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";


import NotificationLog from "../../NotificationLog";
import NotificationComponentFactory from "./Notification";
import Notification from "../../Notification";
import ConfirmPopup from "../popups/ConfirmPopup";
import NotificationFilterButton from "./NotificationFilterButton";
import {default as PopupManager, PopupManagerComponent} from "../popups/PopupManager";
import eventManager from "../../eventManager";


interface PropTypes extends React.Props<any>
{
  log: NotificationLog;
  currentTurn: number;
}

interface StateType
{
}

export class NotificationLogComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "NotificationLog";
  mixins: reactTypeTODO_any = [React.addons.PureRenderMixin];
  updateListener: Function = undefined;
  
  state: StateType;
  ref_TODO_popupManager: PopupManagerComponent;
  
  scrollTop: number; // TODO refactor | unused?

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

  componentWillReceiveProps(newProps: PropTypes)
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

  getNotificationKey(notification: Notification<any>)
  {
    return "" + notification.turn + this.props.log.byTurn[notification.turn].indexOf(notification);
  }

  handleMarkAsRead(notification: Notification<any>)
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

  makePopup(notification: Notification<any>, key: string)
  {
    var log = this.props.log;

    var popupId = this.ref_TODO_popupManager.makePopup(
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

    var stateObj: StateType = {};
    stateObj[key] = popupId;
    this.setState(stateObj);
  }

  closePopup(key: string)
  {
    this.ref_TODO_popupManager.closePopup(this.state[key]);

    var stateObj: StateType = {};
    stateObj[key] = undefined;
    this.setState(stateObj);
  }

  togglePopup(notification: Notification<any>)
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
    var log = this.props.log;
    var notifications: Notification<any>[] = log.filterNotifications(log.unread);

    var items: React.ReactElement<any>[] = [];

    for (var i = 0; i < notifications.length; i++)
    {
      items.push(NotificationComponentFactory(
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
          ref: (component: PopupManagerComponent) =>
          {
            this.ref_TODO_popupManager = component;
          }
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(NotificationLogComponent);
export default Factory;
