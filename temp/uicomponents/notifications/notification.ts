/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class Notification extends React.Component<PropTypes, {}>
{
  displayName: string = "Notification";

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  handleClose()
  {
    this.props.markAsRead(this.props.notification);
  }
  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
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

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
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
