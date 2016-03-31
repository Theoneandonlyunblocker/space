module Rance
{
  export module UIComponents
  {
    export var Notification = React.createFactory(React.createClass(
    {
      displayName: "Notification",

      handleClose: function()
      {
        this.props.markAsRead(this.props.notification);
      },
      handleClick: function()
      {
        this.props.togglePopup(this.props.notification);
      },
      handleRightClick: function(e: MouseEvent)
      {
        e.preventDefault();
        e.stopPropagation();
        this.handleClose();
      },

      render: function()
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
    }));
  }
}
