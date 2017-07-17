/// <reference path="../../../lib/react-global.d.ts" />


import Notification from "../../Notification";
import NotificationLog from "../../NotificationLog";
import eventManager from "../../eventManager";

import {Language} from "../../localization/Language";

import {default as DialogBox} from "../windows/DialogBox";

import NotificationComponentFactory from "./Notification";
import NotificationFilterButton from "./NotificationFilterButton";


export interface PropTypes extends React.Props<any>
{
  log: NotificationLog;
  currentTurn: number;
  activeLanguage: Language;
}

interface StateType
{
  notificationsWithActivePopup: Notification<any, any>[];
}

export class NotificationLogComponent extends React.PureComponent<PropTypes, StateType>
{
  displayName: string = "NotificationLog";
  updateListener: Function = undefined;

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
            okText: "Mark as read",
            cancelText: "Close",
            extraButtons:
            [
              NotificationFilterButton(
              {
                key: "notificationFilter",
                filter: log.notificationFilter,
                text: "Filter",
                highlightedOptionKey: notification.template.key,
                activeLanguage: this.props.activeLanguage,
              }),
            ],
          },
            notification.template.contentConstructor(
              {
                notification: notification,
              },
            ),
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
    this.props.log.markAsRead(notification);
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
