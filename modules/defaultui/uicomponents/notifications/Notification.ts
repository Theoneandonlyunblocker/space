import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Notification} from "../../../../src/notifications/Notification";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  markAsRead: (notification: Notification) => void;
  notification: Notification;
  togglePopup: (notification: Notification) => void;
}

interface StateType
{
}

export class NotificationComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "Notification";

  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
  }

  handleClose()
  {
    this.props.markAsRead(this.props.notification);
  }
  handleClick()
  {
    this.props.togglePopup(this.props.notification);
  }
  handleRightClick(e: React.MouseEvent<HTMLLIElement>)
  {
    e.preventDefault();
    e.stopPropagation();
    this.handleClose();
  }

  render()
  {
    const notification = this.props.notification;

    return(
      ReactDOMElements.li(
      {
        className: "notification",
        onClick: this.handleClick,
        onContextMenu: this.handleRightClick,
        title: localize("notificationToolTip")(),
      },
        ReactDOMElements.img(
        {
          className: "notification-image",
          src: notification.template.getIconSrc(),
        }),
        ReactDOMElements.span(
        {
          className: "notification-message",
        },
          notification.makeMessage(),
        ),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(NotificationComponent);
export default factory;
