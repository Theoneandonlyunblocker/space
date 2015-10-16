/// <reference path="../notificationfilterstate.ts" />

declare module Rance
{
  module Templates
  {
    interface INotificationTemplate
    {
      key: string;
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
