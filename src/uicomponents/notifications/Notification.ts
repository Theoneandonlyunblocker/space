/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

import Notification from "../../Notification";

interface PropTypes extends React.Props<any>
{
  markAsRead: (notification: Notification<any>) => void;
  notification: Notification<any>;
  togglePopup: (notification: Notification<any>) => void;
}

interface StateType
{
}

export class NotificationComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "Notification";

  state: StateType;

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
  handleRightClick(e: React.MouseEvent)
  {
    e.preventDefault();
    e.stopPropagation();
    this.handleClose();
  }

  render()
  {
    var notification = this.props.notification;
    return(
      React.DOM.li(
      {
        className: "notification",
        onClick: this.handleClick,
        onContextMenu: this.handleRightClick
      },
        React.DOM.img(
        {
          className: "notification-image",
          src: notification.template.iconSrc
        }),
        React.DOM.span(
        {
          className: "notification-message"
        },
          notification.makeMessage()
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(NotificationComponent);
export default Factory;
