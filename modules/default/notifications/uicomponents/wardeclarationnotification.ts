export var WarDeclarationNotification = React.createFactory(React.createClass(
{
  displayName: "WarDeclarationNotification",
  render: function()
  {
    var notification: Notification = this.props.notification;
    var p = notification.props;
    return(
      React.DOM.div(
      {
        className: "war-declaration-notification draggable-container"
      },
        null
      )
    );
  }
}));
