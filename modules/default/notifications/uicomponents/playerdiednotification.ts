module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export module UIComponents
      {
        export var PlayerDiedNotification = React.createClass(
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
        })
      }
    }
  }
}
