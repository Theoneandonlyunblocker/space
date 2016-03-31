/// <reference path="../../../src/templateinterfaces/inotificationtemplate.d.ts"/>
/// <reference path="uicomponents/playerdiednotification.ts" />

namespace Rance
{
  export namespace Modules
  {
    export namespace DefaultModule
    {
      export namespace Notifications
      {
        export var playerDiedNotification: Rance.Templates.INotificationTemplate =
        {
          key: "playerDiedNotification",
          displayName: "Player died",
          category: "game",
          defaultFilterState: [NotificationFilterState.alwaysShow],
          iconSrc: "modules\/default\/img\/resources\/test1.png",
          eventListeners: ["makePlayerDiedNotification"],
          contentConstructor: DefaultModule.UIComponents.PlayerDiedNotification,
          messageConstructor: function(props: any)
          {
            var message = "Player " + props.deadPlayerName + " died";

            return message;
          },
          serializeProps: function(props: any)
          {
            return(
            {
              deadPlayerName: props.deadPlayerName
            });
          },
          deserializeProps: function(props: any, gameLoader: GameLoader)
          {
            return(
            {
              deadPlayerName: props.deadPlayerName
            });
          }
        }
      }
    }
  }
}
