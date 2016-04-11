/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes extends React.Props<any>
{
  markAsRead: any; // TODO refactor | define prop type 123
  notification: any; // TODO refactor | define prop type 123
  togglePopup: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

class Notification_COMPONENT_TODO extends React.Component<PropTypes, StateType>
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
    
  }
  
  handleClose()
  {
    this.props.markAsRead(this.props.notification);
  }
  handleClick()
  {
    this.props.togglePopup(this.props.notification);
  }
  handleRightClick(e: MouseEvent)
  {
    e.preventDefault();
    e.stopPropagation();
    this.handleClose();
  }

  render()
  {
    var notification: Notification = this.props.notification;
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

const Factory: React.Factory<PropTypes> = React.createFactory(Notification_COMPONENT_TODO);
export default Factory;
