import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import {eventManager} from "src/app/eventManager";
import {Notification as NotificationObj} from "src/notifications/Notification";
import {activeNotificationFilter, NotificationFilter} from "src/notifications/NotificationFilter";
import {NotificationSubscriber} from "src/notifications/NotificationSubscriber";
import {DialogBox} from "../windows/DialogBox";

import {Notification} from "./Notification";
import {NotificationFilterButton} from "./NotificationFilterButton";


export interface PropTypes extends React.Props<any>
{
  notifications: NotificationObj[];
  notificationLog: NotificationSubscriber;
  notificationFilter?: NotificationFilter;
  currentTurn: number;
}

interface StateType
{
  notificationsWithActivePopup: NotificationObj[];
}

export class NotificationLogComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "NotificationLog";
  public state: StateType;

  private updateListener: () => void;
  private readonly ownDOMNode = React.createRef<HTMLDivElement>();

  static get defaultProps(): Partial<PropTypes>
  {
    return(
    {
      notificationFilter: activeNotificationFilter,
    });
  }

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
    const domNode = this.ownDOMNode.current;
    domNode.scrollTop = domNode.scrollHeight;
  }
  public render()
  {
    const log = this.props.notificationLog;
    const notifications = log.unreadNotifications.filter(notification =>
    {
      return this.props.notificationFilter.shouldDisplayNotification(notification);
    });

    const items: React.ReactElement<any>[] = [];

    for (let i = 0; i < notifications.length; i++)
    {
      items.push(Notification(
      {
        notification: notifications[i],
        key: this.getNotificationKey(notifications[i]),
        markAsRead: this.handleMarkAsRead,
        togglePopup: this.togglePopup,
      }));
    }

    return(
      ReactDOMElements.div(
      {
        className: "notification-log-container",
        ref: this.ownDOMNode,
      },
        ReactDOMElements.ol(
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
            okText: localize("markAsRead").toString(),
            cancelText: localize("close").toString(),
            extraButtons:
            [
              NotificationFilterButton(
              {
                key: "notificationFilter",
                text: localize("notificationFilterButton").toString(),
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

  private bindMethods(): void
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
  private getNotificationKey(notification: NotificationObj): string
  {
    return "" + notification.id;
  }
  private handleMarkAsRead(notification: NotificationObj): void
  {
    this.props.notificationLog.markNotificationAsRead(notification);

    if (this.hasPopup(notification))
    {
      this.closePopup(notification);
    }
    else
    {
      this.forceUpdate();
    }
  }
  private openPopup(notification: NotificationObj): void
  {
    this.setState(
    {
      notificationsWithActivePopup: this.state.notificationsWithActivePopup.concat(notification),
    });
  }
  private closePopup(notificationToRemove: NotificationObj): void
  {
    this.setState(
    {
      notificationsWithActivePopup: this.state.notificationsWithActivePopup.filter(notification =>
      {
        return notification !== notificationToRemove;
      }),
    });
  }
  private hasPopup(notification: NotificationObj): boolean
  {
    return this.state.notificationsWithActivePopup.indexOf(notification) >= 0;
  }
  private togglePopup(notification: NotificationObj): void
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

export const NotificationLog: React.Factory<PropTypes> = React.createFactory(NotificationLogComponent);
