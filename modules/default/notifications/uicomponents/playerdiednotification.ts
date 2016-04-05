export namespace UIComponents
{
  export var PlayerDiedNotification = React.createFactory(React.createClass(
  {
    displayName: "PlayerDiedNotification",
    render: function()
    {
      var notification: Notification = this.props.notification;

      return(
        React.DOM.div(
        {
          className: "player-died-notification draggable-container"
        },
          "Here lies " + notification.props.deadPlayerName + ".",
          React.DOM.br(null),
          React.DOM.br(null),
          "He never scored."
        )
      );
    }
  }));
}
