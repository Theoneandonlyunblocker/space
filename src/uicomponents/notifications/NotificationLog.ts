import * as React from "react";
import * as ReactDOM from "react-dom";


import Notification from "../../Notification";
import NotificationLog from "../../NotificationLog";
import eventManager from "../../eventManager";

import {default as DialogBox} from "../windows/DialogBox";

import NotificationComponentFactory from "./Notification";
import NotificationFilterButton from "./NotificationFilterButton";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  log: NotificationLog;
  currentTurn: number;
}

interface StateType
{
  notificationsWithActivePopup: Notification<any, any>[];
}

export class NotificationLogComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "NotificationLog";
  updateListener: Function;

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }

  public componentDidMount()
  {
    this.updateListener = eventManager.addEventListener("updateNotificationLog", this.forceUpdate.bind(this));
  }
  public componentWillUnmount()
  {
    eventManager.removeEventListener("updateNotificationLog", this.updateListener);
  }
  public componentDidUpdate()
  {
    const domNode = ReactDOM.findDOMNode(this);
    domNode.scrollTop = domNode.scrollHeight;
  }
  public render()
  {
    const log = this.props.log;
    const notifications: Notification<any, any>[] = log.filterNotifications(log.notifications.filter(notification =>
    {
      return !notification.hasBeenRead;
    }));

    const items: React.ReactElement<any>[] = [];

    for (let i = 0; i < notifications.length; i++)
    {
      items.push(NotificationComponentFactory(
      {
        notification: notifications[i],
        key: this.getNotificationKey(notifications[i]),
        markAsRead: this.handleMarkAsRead,
        togglePopup: this.togglePopup,
      }));
    }

    return(
      React.DOM.div(
      {
        className: "notification-log-container",
      },
        React.DOM.ol(
        {
          className: "notification-log",
        },
          items.reverse(),
        ),
        this.state.notificationsWithActivePopup.map(notification =>
        {
          return DialogBox(
          {
            key: this.getNotificationKey(notification),
            title: notification.getTitle(),
            handleOk: () =>
            {
              this.handleMarkAsRead(notification);
              this.closePopup(notification);
            },
            handleCancel: () =>
            {
              this.closePopup(notification);
            },
            okText: localize("markAsRead")(),
            cancelText: localize("close")(),
            extraButtons:
            [
              NotificationFilterButton(
              {
                key: "notificationFilter",
                filter: log.notificationFilter,
                text: localize("notificationFilterButton")(),
                highlightedOptionKey: notification.template.key,
              }),
            ],
          },
            notification.template.contentConstructor(
            {
              notification: notification,
            }),
          );
        }),
      )
    );
  }

  private bindMethods()
  {
    this.closePopup = this.closePopup.bind(this);
    this.getNotificationKey = this.getNotificationKey.bind(this);
    this.handleMarkAsRead = this.handleMarkAsRead.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
  }
  private getInitialStateTODO(): StateType
  {
    return(
    {
      notificationsWithActivePopup: [],
    });
  }
  private getNotificationKey(notification: Notification<any, any>)
  {
    return `${notification.turn}_${this.props.log.notifications.indexOf(notification)}`;
  }
  private handleMarkAsRead(notification: Notification<any, any>)
  {
    notification.hasBeenRead = true;

    if (this.hasPopup(notification))
    {
      this.closePopup(notification);
    }
    else
    {
      this.forceUpdate();
    }
  }
  private openPopup(notification: Notification<any, any>): void
  {
    this.setState(
    {
      notificationsWithActivePopup: this.state.notificationsWithActivePopup.concat(notification),
    });
  }
  private closePopup(notificationToRemove: Notification<any, any>): void
  {
    this.setState(
    {
      notificationsWithActivePopup: this.state.notificationsWithActivePopup.filter(notification =>
      {
        return notification !== notificationToRemove;
      }),
    });
  }
  private hasPopup(notification: Notification<any, any>): boolean
  {
    return this.state.notificationsWithActivePopup.indexOf(notification) >= 0;
  }
  private togglePopup(notification: Notification<any, any>): void
  {
    if (this.hasPopup(notification))
    {
      this.closePopup(notification);
    }
    else
    {
      this.openPopup(notification);
    }
  }


}

const Factory: React.Factory<PropTypes> = React.createFactory(NotificationLogComponent);
export default Factory;
