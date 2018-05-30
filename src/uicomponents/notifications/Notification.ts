import * as React from "react";

import {Notification} from "../../notifications/Notification";

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
      React.DOM.li(
      {
        className: "notification",
        onClick: this.handleClick,
        onContextMenu: this.handleRightClick,
        title: localize("notificationToolTip")(),
      },
        React.DOM.img(
        {
          className: "notification-image",
          src: notification.template.iconSrc,
        }),
        React.DOM.span(
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
