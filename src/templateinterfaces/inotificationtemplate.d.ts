/// <reference path="../notificationfilterstate.ts" />

declare module Rance
{
  module Templates
  {
    interface INotificationTemplate
    {
      key: string;
      displayName: string;
      category: string;
      defaultFilterState: NotificationFilterState[];
      iconSrc: string;
      eventListeners: string[];
      contentConstructor: UIComponents.ReactComponentPlaceHolder;
      messageConstructor: (props: any) => string;

      serializeProps: (props: any) => any;
      deserializeProps: (dataProps: any, gameLoader: GameLoader) => any;
    }
  }
}
