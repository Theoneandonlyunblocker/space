/// <reference path="../../../src/templateinterfaces/inotificationtemplate.d.ts"/>
/// <reference path="uicomponents/wardeclarationnotification.ts" />

module Rance
{
  export module Modules
  {
    export module DefaultModule
    {
      export module Notifications
      {
        export var WarDeclarationNotification: Rance.Templates.INotificationTemplate =
        {
          key: "WarDeclarationNotification",
          category: "diplomacy",
          defaultFilterState: [NotificationFilterState.showIfInvolved],
          iconSrc: "img\/resources\/test2.png",
          eventListeners: ["makeWarDeclarationNotification"],
          contentConstructor: DefaultModule.UIComponents.WarDeclarationNotification,
          messageConstructor: function(props: any)
          {
            var message = props.player1.name + " declared war on " + props.player2.name;

            return message;
          },
          serializeProps: function(props: any)
          {
            return(
            {
              player1Id: props.player1.id,
              player2Id: props.player2.id,
            });
          },
          deserializeProps: function(props: any, gameLoader: GameLoader)
          {
            return(
            {
              player1: gameLoader.playersById[props.player1Id],
              player2: gameLoader.playersById[props.player2Id],
            });
          }
        }
      }
    }
  }
}
